/**
 * `pnpm fetch:fts` runner: archives the FTS location list and every page of the flows of each oPt
 * plan as dataset sources, builds fts_funding.csv (trailing-12-month windows, docs/02 §5 D1) and
 * fts_plan_totals.csv from the archived bytes, and returns a report. Nothing is written to the
 * tables unless every page was archived and parsed. The windows count the flows dated on or after
 * formula d1 `parameters.flows_from` of the current methodology, when it sets one (1.0.0-rc.2).
 *
 * `runRebuildFts` (`pnpm fetch:fts --rebuild`) captures nothing: it downloads the archived copies
 * the table cites, checks each SHA-256 against its source record, and rewrites the window amounts
 * under the current methodology's rule (see `rebuildWindows`).
 */
import { createHash } from 'node:crypto'
import { EXCLUDED_ISO3, loadDataset, loadMethodology, splitSourceIds } from '@gai/schema'
import { formatInteger } from '@gai/scoring'
import {
  archiveDataset,
  type DatasetContext,
  inPool,
  jsonAccept,
  jsonOfDataset,
} from '../lib/dataset.js'
import { fetchBytes, isoSeconds, type NetDeps } from '../lib/deps.js'
import { writeTable } from '../lib/files.js'
import { UNIVERSE_ISO3 } from '../universe.js'
import {
  FTS_ATTRIBUTION_OVERRIDES,
  FTS_LOCATION_URL,
  FTS_ORGANIZATION_URL,
  FTS_PLAN_IDS,
  type FtsPage,
  type FtsWindowRow,
  flowsFromOf,
  ftsTables,
  parseFlowPage,
  parseLocations,
  parseOrganizations,
  planPageUrl,
  rebuildWindows,
  verifyOverrides,
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
  const orgs = await archiveDataset(ctx, {
    url: FTS_ORGANIZATION_URL,
    segments: ['fts', 'organizations'],
    title: 'OCHA FTS API v1, list of organisations',
    publisher: PUBLISHER,
    notes:
      'Every FTS organisation with its categories and locations; justifies the attribution overrides of fetch:fts (FTS_ATTRIBUTION_OVERRIDES).',
    accept: jsonAccept((j) =>
      Array.isArray((j as { data?: unknown })?.data) ? null : 'no organisation list',
    ),
  })
  if (!orgs.ok) failures.push(`${FTS_ORGANIZATION_URL}: ${orgs.reason}`)

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

  if (failures.length > 0 || !loc.ok || !orgs.ok) {
    report.push('fetch:fts FAILED; fts_funding.csv and fts_plan_totals.csv were not changed.')
    for (const f of failures) report.push(`  ${f}`)
    return { ok: false, report }
  }

  const pages = planPages.flat()
  const lastMonth = isoSeconds(ctx.deps.now()).slice(0, 7)
  const locations = parseLocations(jsonOfDataset(loc))
  const verified = verifyOverrides(
    FTS_ATTRIBUTION_OVERRIDES,
    parseOrganizations(jsonOfDataset(orgs)),
    locations,
  )
  const input = {
    pages,
    locations,
    locationSourceId: loc.source.id,
    universe: FTS_DONOR_UNIVERSE,
    plans,
    lastMonth,
    retrievedAt: stamps.sort().at(-1) ?? isoSeconds(ctx.deps.now()),
  }
  const flowsFrom = flowsFromOf(loadMethodology(ctx.root).thresholds?.value)
  const tables = ftsTables({
    ...input,
    overrides: verified.applied,
    organizationSourceId: orgs.source.id,
    flowsFrom,
  })
  const without = ftsTables({ ...input, flowsFrom })
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
    const before = without.plans
      .filter((r) => r.plan_id === plan)
      .reduce((s, r) => s + r.usd_paid_committed, 0)
    report.push(
      `  plan ${plan}: ${flows.length} flows on ${ps.length} page(s); plan funding (incoming, paid + committed, all donors) ${usd(planFunding)}; attributed government funding ${usd(govSum)} from ${gov.length} donors (${usd(before)} without the overrides)`,
    )
  }
  report.push(`  organisation list ${orgs.source.id}; overrides applied: ${verified.applied.size}`)
  for (const p of verified.problems) report.push(`    override problem: ${p}`)
  for (const f of tables.overriddenFlows) {
    const name = FTS_ATTRIBUTION_OVERRIDES.find((o) => o.orgId === f.overriddenBy)?.name ?? ''
    report.push(
      `    override: flow ${f.flowId} (plan ${f.planId}, ${f.date}) of organisation ${f.overriddenBy} ${name} → ${f.iso3}, ${usd(f.amount)}`,
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
      flowsFrom === undefined
        ? `  ${tables.preWindowFlows.length} attributed government flow(s) are dated before 2023-10-07 (${usd(sum)}); they fall in the windows their dates place them in`
        : `  ${tables.preWindowFlows.length} attributed government flow(s) are dated before ${flowsFrom} (${usd(sum)}); they count in no window (formula d1 flows_from)`,
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

/** Downloads an archived copy and checks its SHA-256 against the source record. */
async function verifiedJson(
  deps: NetDeps,
  source: { id: string; wayback_url: string | null; sha256: string | null },
): Promise<unknown> {
  if (source.wayback_url === null || source.sha256 === null) {
    throw new Error(`${source.id}: no archived copy`)
  }
  const res = await fetchBytes(deps, source.wayback_url)
  const sha = createHash('sha256').update(res.body).digest('hex')
  if (res.status !== 200 || sha !== source.sha256) {
    throw new Error(`${source.id}: HTTP ${res.status}, sha256 ${sha}, expected ${source.sha256}`)
  }
  deps.log(`  ${source.id}: ${res.body.length} bytes, sha256 checked`)
  return JSON.parse(new TextDecoder().decode(res.body)) as unknown
}

/** `pnpm fetch:fts --rebuild`: see the module comment. Writes fts_funding.csv only. */
export async function runRebuildFts(root: string, deps: NetDeps): Promise<FtsRunResult> {
  const report: string[] = []
  const ds = loadDataset(root)
  const committed = ds.structured['fts_funding.csv'].map((r) => r.value as FtsWindowRow)
  const first = committed[0]
  if (first === undefined) return { ok: false, report: ['fetch:fts --rebuild: no row to rebuild'] }
  const flowsFrom = flowsFromOf(loadMethodology(root).thresholds?.value)
  const sourceOf = new Map(ds.sources.map((s) => [s.value.id, s.value]))
  const cited = [...new Set(committed.flatMap((r) => splitSourceIds(r.source)))].sort()
  const pages: FtsPage[] = []
  let locations: Map<string, string> | null = null
  let locationSourceId = ''
  let organizations: ReturnType<typeof parseOrganizations> | null = null
  let organizationSourceId: string | undefined
  try {
    for (const id of cited) {
      const s = sourceOf.get(id)
      if (s === undefined) throw new Error(`${id}: no source record`)
      const page = /_fts_plan-(\d+)-p(\d+)$/.exec(id)
      if (page) {
        pages.push(parseFlowPage(await verifiedJson(deps, s), page[1] ?? '', Number(page[2]), id))
      } else if (id.endsWith('_fts_locations')) {
        locations = parseLocations(await verifiedJson(deps, s))
        locationSourceId = id
      } else if (id.endsWith('_fts_organizations')) {
        organizations = parseOrganizations(await verifiedJson(deps, s))
        organizationSourceId = id
      }
    }
  } catch (err) {
    return { ok: false, report: [`fetch:fts --rebuild FAILED: ${(err as Error).message}`] }
  }
  if (locations === null) {
    return { ok: false, report: ['fetch:fts --rebuild FAILED: the table cites no location list'] }
  }
  const overrides =
    organizations === null
      ? undefined
      : verifyOverrides(FTS_ATTRIBUTION_OVERRIDES, organizations, locations).applied
  const last =
    committed
      .map((r) => r.window_end.slice(0, 7))
      .sort()
      .at(-1) ?? ''
  const [y, mo] = last.split('-').map(Number) as [number, number]
  const lastMonth = mo === 12 ? `${y + 1}-01` : `${y}-${String(mo + 1).padStart(2, '0')}`
  let result: ReturnType<typeof rebuildWindows>
  try {
    result = rebuildWindows(
      committed,
      {
        pages,
        locations,
        locationSourceId,
        universe: FTS_DONOR_UNIVERSE,
        plans: first.plan_ids.split(';'),
        lastMonth,
        retrievedAt: first.retrieved_at,
        ...(overrides === undefined ? {} : { overrides }),
        ...(organizationSourceId === undefined ? {} : { organizationSourceId }),
      },
      flowsFrom,
    )
  } catch (err) {
    return { ok: false, report: [`fetch:fts --rebuild FAILED: ${(err as Error).message}`] }
  }
  writeTable(root, 'fts_funding.csv', result.rows, ['iso3', 'window_start', 'window_end'])
  report.push(
    `fetch:fts --rebuild: ${pages.length} archived pages re-read; ${committed.length} rows rebuilt and checked against the table, then written with flows_from ${flowsFrom ?? '(none)'}: ${result.changed.length} rows changed`,
  )
  for (const c of result.changed) {
    report.push(`  ${c.iso3} ${c.window_end}: ${usd(c.from)} → ${usd(c.to)}`)
  }
  return { ok: true, report }
}
