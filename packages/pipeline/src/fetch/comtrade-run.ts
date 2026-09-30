/**
 * `pnpm fetch:comtrade` runner (see comtrade.ts). First, Israel's mirror responses for every year,
 * several partners per query (MIRROR_BATCH), and one keyed call cross-checking them. Then per
 * reporter: archive the self preview responses for each year, cross-check them with one keyed
 * call (counted against the daily limit), and replace that reporter's rows in comtrade_a2.csv and
 * comtrade_c3.csv. The
 * counter and the reporters done are kept in `.cache/comtrade-state.json` (git-ignored), so an
 * interrupted run resumes where it stopped.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { archiveDataset, type DatasetContext, jsonAccept, jsonOfDataset } from '../lib/dataset.js'
import { fetchBytes, isoSeconds } from '../lib/deps.js'
import { mergeRows, readTable, writeTable } from '../lib/files.js'
import {
  availabilityUrl,
  type ComtradeState,
  canCall,
  comtradeRows,
  crossCheck,
  DAILY_CALL_LIMIT,
  ISRAEL_CODE,
  keyedUrl,
  MIRROR_BATCH,
  mirrorBatches,
  parseAvailability,
  parseReporters,
  parseTrade,
  previewUrl,
  REPORTERS_URL,
  stateFor,
  type TradeRecord,
  truncatedPreview,
  type YearResponse,
  yearsFrom,
} from './comtrade.js'

export const STATE_FILE = '.cache/comtrade-state.json'
const PUBLISHER = 'UN Comtrade'

export interface ComtradeRunOptions {
  reporters: readonly string[]
  key: string
  latestYear: number
  /** Refetch reporters already done. */
  force?: boolean
  limit?: number
  /** Partners per mirror query (MIRROR_BATCH). */
  mirrorBatch?: number
}

function loadState(root: string): ComtradeState | null {
  const file = join(root, STATE_FILE)
  if (!existsSync(file)) return null
  return JSON.parse(readFileSync(file, 'utf8')) as ComtradeState
}

function saveState(root: string, state: ComtradeState): void {
  const file = join(root, STATE_FILE)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, `${JSON.stringify(state, null, 2)}\n`)
}

const tradeAccept = jsonAccept((j) => {
  try {
    parseTrade(j)
    return truncatedPreview(j)
  } catch (err) {
    return (err as Error).message
  }
})

export async function runFetchComtrade(
  ctx: DatasetContext,
  o: ComtradeRunOptions,
): Promise<{ ok: boolean; report: string[] }> {
  const report: string[] = []
  const limit = o.limit ?? DAILY_CALL_LIMIT
  const today = isoSeconds(ctx.deps.now()).slice(0, 10)
  const state = stateFor(loadState(ctx.root), today)
  const years = yearsFrom(o.latestYear)

  const reporters = await archiveDataset(ctx, {
    url: REPORTERS_URL,
    segments: ['comtrade', 'reporters'],
    title: 'UN Comtrade reference list of reporters',
    publisher: PUBLISHER,
    notes: 'Maps ISO3 codes to Comtrade reporter codes for fetch:comtrade.',
    accept: jsonAccept((j) =>
      Array.isArray((j as { results?: unknown })?.results) ? null : 'no reporter list',
    ),
  })
  if (!reporters.ok)
    return { ok: false, report: [`reporter list not archived: ${reporters.reason}`] }
  const codes = parseReporters(jsonOfDataset(reporters))

  const todo = o.reporters.filter((r) => o.force || state.done[r] === undefined)
  for (const r of o.reporters)
    if (!todo.includes(r))
      report.push(`${r}: done on ${state.done[r]}; skipped (--force refetches)`)
  const unknown = todo.filter((r) => !codes.has(r))
  for (const r of unknown) report.push(`${r}: no current Comtrade reporter code; skipped`)
  const run = todo.filter((r) => codes.has(r))
  if (run.length === 0) return { ok: unknown.length === 0, report }

  const da = await archiveDataset(ctx, {
    url: availabilityUrl([...run.map((r) => codes.get(r) as number), ISRAEL_CODE], years),
    segments: [
      'comtrade',
      `availability-${run.map((r) => r.toLowerCase()).join('-')}`.slice(0, 40).replace(/-+$/, ''),
    ],
    title: `UN Comtrade data availability, annual HS, ${years[0]}–${years.at(-1)}, reporters ${run.join(', ')} and Israel`,
    publisher: PUBLISHER,
    accept: jsonAccept((j) =>
      Array.isArray((j as { data?: unknown })?.data) ? null : 'no availability data',
    ),
  })
  if (!da.ok)
    return { ok: false, report: [...report, `data availability not archived: ${da.reason}`] }
  const releases = parseAvailability(jsonOfDataset(da))

  let ok = unknown.length === 0

  // Israel's mirror responses: one capture per year and batch of partners.
  const partnerCodes = run.map((r) => codes.get(r) as number)
  const isoOf = new Map(run.map((r) => [codes.get(r) as number, r]))
  const mirrorByYear = new Map<
    number,
    { sourceId: string; partners: number[]; records: TradeRecord[] }[]
  >()
  const mirrorFailures = new Map<number, string[]>()
  for (const year of years) {
    for (const batch of mirrorBatches(partnerCodes, o.mirrorBatch ?? MIRROR_BATCH)) {
      const first = (isoOf.get(batch[0] as number) ?? '').toLowerCase()
      const last = (isoOf.get(batch.at(-1) as number) ?? '').toLowerCase()
      const d = await archiveDataset(ctx, {
        url: previewUrl(ISRAEL_CODE, batch, year),
        segments: ['comtrade', `mirror-${year}-${first}-${last}-${batch.length}`],
        title: `UN Comtrade annual HS preview, reporter ${ISRAEL_CODE} (Israel), ${batch.length} partner(s), ${year}`,
        publisher: PUBLISHER,
        notes: `Partners: ${batch.map((c) => isoOf.get(c)).join(', ')}.`,
        accept: tradeAccept,
      })
      if (!d.ok) {
        for (const c of batch) {
          const list = mirrorFailures.get(c) ?? []
          list.push(`mirror ${year}: ${d.reason}`)
          mirrorFailures.set(c, list)
        }
        continue
      }
      const list = mirrorByYear.get(year) ?? []
      list.push({ sourceId: d.source.id, partners: batch, records: parseTrade(jsonOfDataset(d)) })
      mirrorByYear.set(year, list)
    }
  }
  // One keyed call cross-checks every mirror response.
  const keyedMirror: TradeRecord[] = []
  if (canCall(state, 1, limit)) {
    state.calls++
    saveState(ctx.root, state)
    const res = await fetchBytes(ctx.deps, keyedUrl(ISRAEL_CODE, partnerCodes, years), {
      headers: { 'Ocp-Apim-Subscription-Key': o.key },
    })
    if (res.status !== 200)
      report.push(`mirror: keyed API HTTP ${res.status}; cross-check incomplete`)
    else keyedMirror.push(...parseTrade(JSON.parse(new TextDecoder().decode(res.body))))
  } else report.push('mirror: no keyed call left today; mirror cross-check skipped')

  let a2 = readTable(ctx.root, 'comtrade_a2.csv') as Record<string, unknown>[]
  let c3 = readTable(ctx.root, 'comtrade_c3.csv') as Record<string, unknown>[]
  for (const iso3 of run) {
    const code = codes.get(iso3) as number
    if (!canCall(state, 1, limit)) {
      report.push(
        `${iso3}: stopped, ${state.calls} of ${limit} keyed calls used today; run the same command tomorrow to resume`,
      )
      ok = false
      break
    }
    const self: YearResponse[] = []
    const mirror: YearResponse[] = []
    const failures: string[] = [...(mirrorFailures.get(code) ?? [])]
    for (const year of years) {
      const d = await archiveDataset(ctx, {
        url: previewUrl(code, ISRAEL_CODE, year),
        segments: ['comtrade', `${iso3.toLowerCase()}-self-${year}`],
        title: `UN Comtrade annual HS preview, reporter ${code}, partner ${ISRAEL_CODE}, ${year}`,
        publisher: PUBLISHER,
        accept: tradeAccept,
      })
      if (!d.ok) failures.push(`self ${year}: ${d.reason}`)
      else self.push({ year, sourceId: d.source.id, records: parseTrade(jsonOfDataset(d)) })
      const m = (mirrorByYear.get(year) ?? []).find((b) => b.partners.includes(code))
      if (m !== undefined) {
        const records = m.records.filter((r) => r.partner === code)
        mirror.push({ year, sourceId: m.sourceId, records })
      }
    }
    if (failures.length > 0) {
      report.push(
        `${iso3}: NOT written; ${failures.length} response(s) not archived:`,
        ...failures.map((f) => `  ${f}`),
      )
      ok = false
      continue
    }

    // Cross-check with the keyed API: one call for the self responses; the mirror call is shared.
    const keyed = keyedMirror.filter((r) => r.partner === code)
    state.calls++
    saveState(ctx.root, state)
    const res = await fetchBytes(ctx.deps, keyedUrl(code, ISRAEL_CODE, years), {
      headers: { 'Ocp-Apim-Subscription-Key': o.key },
    })
    if (res.status !== 200) {
      report.push(
        `${iso3}: keyed API HTTP ${res.status} for ${code}→${ISRAEL_CODE}; cross-check incomplete`,
      )
    } else keyed.push(...parseTrade(JSON.parse(new TextDecoder().decode(res.body))))
    const archived = [...self, ...mirror].flatMap((r) => r.records)
    const diffs = crossCheck(archived, keyed)

    const retrievedAt = isoSeconds(ctx.deps.now())
    const rows = comtradeRows({
      iso3,
      code,
      self,
      mirror,
      releases,
      commonSources: [reporters.source.id, da.source.id],
      retrievedAt,
    })
    a2 = mergeRows(
      a2.filter((r) => r.iso3 !== iso3),
      rows.a2,
      ['iso3', 'window_start', 'window_end', 'hs', 'reporter'],
    )
    c3 = mergeRows(
      c3.filter((r) => r.iso3 !== iso3),
      rows.c3,
      ['iso3', 'window_start', 'window_end', 'reporter'],
    )
    writeTable(ctx.root, 'comtrade_a2.csv', a2, ['iso3', 'window_start', 'hs', 'reporter'])
    writeTable(ctx.root, 'comtrade_c3.csv', c3, ['iso3', 'window_start', 'reporter'])
    state.done[iso3] = retrievedAt
    saveState(ctx.root, state)
    report.push(
      `${iso3} (reporter ${code}): ${rows.a2.length} A2 rows, ${rows.c3.length} C3 rows, ${keyed.length} keyed records compared`,
    )
    for (const g of rows.gaps) report.push(`  gap: ${g}`)
    for (const d of diffs) report.push(`  cross-check: ${d}`)
  }
  report.push(`keyed calls today: ${state.calls} of ${limit}`)
  return { ok, report }
}
