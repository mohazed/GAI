/**
 * `pnpm fetch:fts` runner: archives the FTS location list and every page of the flows of each oPt
 * plan as dataset sources, builds fts_funding.csv (trailing-12-month windows, docs/02 §5 D1) and
 * fts_plan_totals.csv from the archived bytes, and returns a report. Nothing is written to the
 * tables unless every page was archived and parsed.
 */
import { EXCLUDED_ISO3 } from '@gai/schema'
import { formatInteger } from '@gai/scoring'
import {
  archiveDataset,
  type DatasetContext,
  inPool,
  jsonAccept,
  jsonOfDataset,
} from '../lib/dataset.js'
import { isoSeconds } from '../lib/deps.js'
import { writeTable } from '../lib/files.js'
import { UNIVERSE_ISO3 } from '../universe.js'
import {
  FTS_LOCATION_URL,
  FTS_PLAN_IDS,
  type FtsPage,
  ftsTables,
  parseFlowPage,
  parseLocations,
  planPageUrl,
} from './fts.js'

const PUBLISHER = 'OCHA Financial Tracking Service'

/** Donors attributed by source location: the universe without the excluded ISR and PSE. */
export const FTS_DONOR_UNIVERSE: ReadonlySet<string> = new Set(
  [...UNIVERSE_ISO3].filter((c) => !EXCLUDED_ISO3.includes(c)),
)

export interface FtsRunResult {
  ok: boolean
  report: string[]
}

const usd = (n: number) => `USD ${formatInteger(Math.round(n), 'en')}`

export async function runFetchFts(
  ctx: DatasetContext,
  plans: readonly string[] = FTS_PLAN_IDS,
): Promise<FtsRunResult> {
  const report: string[] = []
  const failures: string[] = []
  const stamps: string[] = []
  const loc = await archiveDataset(ctx, {
    url: FTS_LOCATION_URL,
    segments: ['fts', 'locations'],
    title: 'OCHA FTS API v1, list of locations',
    publisher: PUBLISHER,
    notes: 'Maps the FTS location ids of donors to ISO3 codes for fetch:fts.',
    accept: jsonAccept((j) =>
      Array.isArray((j as { data?: unknown })?.data) ? null : 'no location list',
    ),
  })
  if (!loc.ok) failures.push(`${FTS_LOCATION_URL}: ${loc.reason}`)
  else stamps.push(loc.source.retrieved_at ?? '')

  const planPages = await inPool(plans, 2, async (plan) => {
    const pages: FtsPage[] = []
    let url: string | null = planPageUrl(plan)
    for (let n = 1; url !== null; n++) {
      const d = await archiveDataset(ctx, {
        url,
        segments: ['fts', `plan-${plan}-p${n}`],
        title: `OCHA FTS API v1 flows, plan ${plan}, page ${n}`,
        publisher: PUBLISHER,
        accept: jsonAccept((j) => {
          const r = j as { status?: unknown; data?: { flows?: unknown } }
          return r?.status === 'ok' && Array.isArray(r.data?.flows) ? null : 'no flows'
        }),
      })
      if (!d.ok) {
        failures.push(`${url}: ${d.reason}`)
        return pages
      }
      stamps.push(d.source.retrieved_at ?? '')
      try {
        const page = parseFlowPage(jsonOfDataset(d), plan, n, d.source.id)
        pages.push(page)
        url = page.nextLink
      } catch (err) {
        failures.push(`${url}: ${(err as Error).message}`)
        return pages
      }
    }
    const total = pages.reduce((s, p) => s + p.flows.length, 0)
    const count = pages[0]?.count ?? 0
    if (total !== count)
      failures.push(
        `plan ${plan}: ${total} flows on ${pages.length} pages, meta.count says ${count}`,
      )
    return pages
  })

  if (failures.length > 0 || !loc.ok) {
    report.push('fetch:fts FAILED; fts_funding.csv and fts_plan_totals.csv were not changed.')
    for (const f of failures) report.push(`  ${f}`)
    return { ok: false, report }
  }

  const pages = planPages.flat()
  const lastMonth = isoSeconds(ctx.deps.now()).slice(0, 7)
  const tables = ftsTables({
    pages,
    locations: parseLocations(jsonOfDataset(loc)),
    locationSourceId: loc.source.id,
    universe: FTS_DONOR_UNIVERSE,
    plans,
    lastMonth,
    retrievedAt: stamps.sort().at(-1) ?? isoSeconds(ctx.deps.now()),
  })
  writeTable(ctx.root, 'fts_funding.csv', tables.windows, ['iso3', 'window_start', 'window_end'])
  writeTable(ctx.root, 'fts_plan_totals.csv', tables.plans, ['iso3', 'plan_id'])

  report.push(
    `fetch:fts: ${pages.length} pages of ${plans.length} plans archived, location list ${loc.source.id}`,
  )
  for (const plan of plans) {
    const ps = pages.filter((p) => p.planId === plan)
    const flows = ps.flatMap((p) => p.flows)
    const gov = tables.plans.filter((r) => r.plan_id === plan)
    const govSum = gov.reduce((s, r) => s + r.usd_paid_committed, 0)
    const planFunding = flows
      .filter(
        (f) => f.boundary === 'incoming' && (f.status === 'paid' || f.status === 'commitment'),
      )
      .reduce((s, f) => s + f.amountUSD, 0)
    report.push(
      `  plan ${plan}: ${flows.length} flows on ${ps.length} page(s); plan funding (incoming, paid + committed, all donors) ${usd(planFunding)}; attributed government funding ${usd(govSum)} from ${gov.length} donors`,
    )
  }
  const months = new Set(tables.windows.map((w) => w.window_end)).size
  const donors = new Set(tables.windows.map((w) => w.iso3)).size
  report.push(
    `  fts_funding.csv: ${tables.windows.length} rows (${donors} donors × ${months} monthly windows)`,
  )
  report.push(`  fts_plan_totals.csv: ${tables.plans.length} rows`)
  if (tables.sharedFlows.length > 0) {
    report.push(
      `  ${tables.sharedFlows.length} government flow(s) listed under two plans, counted once in the windows: ${tables.sharedFlows.join(', ')}`,
    )
  }
  if (tables.preWindowFlows.length > 0) {
    const sum = tables.preWindowFlows.reduce((s, f) => s + f.amount, 0)
    report.push(
      `  ${tables.preWindowFlows.length} attributed government flow(s) are dated before 2023-10-07 (${usd(sum)}); they fall in the windows their dates place them in`,
    )
  }
  if (tables.unattributed.length > 0) {
    const sum = tables.unattributed.reduce((s, f) => s + f.amount, 0)
    report.push(
      `  ${tables.unattributed.length} government flow(s) NOT attributed (source location missing or outside the donor universe), ${usd(sum)}:`,
    )
    const groups = new Map<string, { n: number; sum: number }>()
    for (const f of tables.unattributed) {
      const k = `${f.organization} · location ${f.location}`
      const g = groups.get(k) ?? { n: 0, sum: 0 }
      g.n++
      g.sum += f.amount
      groups.set(k, g)
    }
    for (const [k, g] of [...groups].sort((a, b) => b[1].sum - a[1].sum))
      report.push(`    ${k}: ${g.n} flow(s), ${usd(g.sum)}`)
  }
  const latest = tables.windows.filter((w) => w.window_end === tables.windows.at(-1)?.window_end)
  const top = [...latest].sort((a, b) => b.usd_paid_committed - a.usd_paid_committed).slice(0, 10)
  if (top.length > 0) {
    report.push(`  largest donors, window ${top[0]?.window_start} … ${top[0]?.window_end}:`)
    for (const r of top) report.push(`    ${r.iso3} ${usd(r.usd_paid_committed)}`)
  }
  return { ok: true, report }
}
