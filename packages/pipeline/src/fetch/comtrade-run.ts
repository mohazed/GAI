/**
 * `pnpm fetch:comtrade` runner (see comtrade.ts). Per reporter: archive the self and mirror
 * preview responses for each year, cross-check them with two keyed calls (counted against the
 * daily limit), and replace that reporter's rows in comtrade_a2.csv and comtrade_c3.csv. The
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
  parseAvailability,
  parseReporters,
  parseTrade,
  previewUrl,
  REPORTERS_URL,
  stateFor,
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
    return null
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
  let a2 = readTable(ctx.root, 'comtrade_a2.csv') as Record<string, unknown>[]
  let c3 = readTable(ctx.root, 'comtrade_c3.csv') as Record<string, unknown>[]
  for (const iso3 of run) {
    const code = codes.get(iso3) as number
    if (!canCall(state, 2, limit)) {
      report.push(
        `${iso3}: stopped, ${state.calls} of ${limit} keyed calls used today; run the same command tomorrow to resume`,
      )
      ok = false
      break
    }
    const archiveYear = async (reporter: number, partner: number, year: number, dir: string) => {
      const d = await archiveDataset(ctx, {
        url: previewUrl(reporter, partner, year),
        segments: ['comtrade', `${iso3.toLowerCase()}-${dir}-${year}`],
        title: `UN Comtrade annual HS preview, reporter ${reporter}, partner ${partner}, ${year}`,
        publisher: PUBLISHER,
        accept: tradeAccept,
      })
      return d
    }
    const self: YearResponse[] = []
    const mirror: YearResponse[] = []
    const failures: string[] = []
    for (const year of years) {
      for (const [dir, rep, par, list] of [
        ['self', code, ISRAEL_CODE, self],
        ['mirror', ISRAEL_CODE, code, mirror],
      ] as const) {
        const d = await archiveYear(rep, par, year, dir)
        if (!d.ok) failures.push(`${dir} ${year}: ${d.reason}`)
        else list.push({ year, sourceId: d.source.id, records: parseTrade(jsonOfDataset(d)) })
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

    // Cross-check with the keyed API.
    const keyed = []
    for (const [rep, par] of [
      [code, ISRAEL_CODE],
      [ISRAEL_CODE, code],
    ] as const) {
      state.calls++
      saveState(ctx.root, state)
      const res = await fetchBytes(ctx.deps, keyedUrl(rep, par, years), {
        headers: { 'Ocp-Apim-Subscription-Key': o.key },
      })
      if (res.status !== 200) {
        report.push(
          `${iso3}: keyed API HTTP ${res.status} for ${rep}→${par}; cross-check incomplete`,
        )
        continue
      }
      keyed.push(...parseTrade(JSON.parse(new TextDecoder().decode(res.body))))
    }
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
