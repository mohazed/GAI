/**
 * D1 funding from OCHA FTS (docs/02 §5 D1, docs/06 §2): government contributions to the oPt flash
 * appeals, from the FTS API v1 flows of each plan, attributed to the donor's source location.
 *
 * Fields of a flow used (API v1 `/public/fts/flow?planid={id}`):
 * - `id`: flow id, to count a flow listed under two plans once in the window totals;
 * - `amountUSD`: the amount;
 * - `status`: `paid` and `commitment` count, `pledge` does not (docs/02 §5: paid + committed);
 * - `boundary`: `incoming` only (FTS counts a plan's funding as its incoming flows; `internal`
 *   and `outgoing` flows move money already counted);
 * - `date`: the flow date, which places it in a trailing-12-month window;
 * - `sourceObjects[type=Organization].organizationTypes`: must include `Governments` (docs/02
 *   says donor type "Government"; FTS names the type `Governments`);
 * - `sourceObjects[type=Location].id`: the donor's location, mapped to ISO3 with the FTS location
 *   list (`/v2/public/location`, fields `id`, `iso3`).
 * - `destinationObjects[type=Plan].id`: the plan the flow belongs to.
 *
 * A government flow whose source location is missing or is not an entry of the universe (for
 * example a ministry recorded with the location "Occupied Palestinian Territory") is not
 * attributed and is listed in the report, never guessed, unless its source organisation is one of
 * FTS_ATTRIBUTION_OVERRIDES (P-14): each names an FTS organisation id and the country its FTS
 * organisation record locates it in; the runner checks every override against the archived
 * organisation list (`/v1/public/organization`) before applying it, and the rows it changes cite
 * that list.
 */
import { addDays } from '@gai/schema'

/** oPt plans: 2023 flash appeal 1186, 2024 1156, 2025 1273, 2026 1510 (docs/06 §2). */
export const FTS_PLAN_IDS: readonly string[] = ['1186', '1156', '1273', '1510']
export const FTS_FLOW_URL = 'https://api.hpc.tools/v1/public/fts/flow'
/**
 * The location list. v2 serves the same list as v1 (258 entries, same id → ISO3 on 2026-09-27);
 * v2 is used because Wayback would not serve its first capture of the v1 URL.
 */
export const FTS_LOCATION_URL = 'https://api.hpc.tools/v2/public/location'
/** The API's largest page. */
export const FTS_PAGE_LIMIT = 1000
/** First month whose D1 value is published: October 2023 (docs/02 §1 window start). */
export const FTS_FIRST_MONTH = '2023-10'

/**
 * The FTS organisation list (every organisation with its locations). The per-organisation path
 * `/v1/public/organization/{id}` answers ResourceNotFound (2026-09-28), so the list is archived.
 */
export const FTS_ORGANIZATION_URL = 'https://api.hpc.tools/v1/public/organization'

/**
 * Government donors whose flows FTS records without a source location, or at a location that is
 * not the donor's, attributed by their FTS organisation id (P-14; seen at the 2026-09-27 fetch).
 * The Palestinian Authority (5235, "Palestinian territory, occupied") and Jersey Overseas Aid
 * (8550, Jersey) stay unattributed: neither is a scored state.
 */
export const FTS_ATTRIBUTION_OVERRIDES: readonly { orgId: string; iso3: string; name: string }[] = [
  { orgId: '2917', iso3: 'GBR', name: 'United Kingdom, Government of' },
  { orgId: '2646', iso3: 'CHE', name: 'Swiss Development Cooperation/Swiss Humanitarian Aid' },
  { orgId: '13052', iso3: 'QAT', name: 'Qatar Fund for Development' },
  { orgId: '13808', iso3: 'DEU', name: 'German Federal Foreign Office Auswärtiges Amt' },
]

export interface FtsOrganization {
  id: string
  name: string
  /** Location ids of the organisation record. */
  locations: string[]
}

/** FTS organisation id → record, from `/v1/public/organization`. */
export function parseOrganizations(json: unknown): Map<string, FtsOrganization> {
  const data = (json as { status?: unknown; data?: unknown })?.data
  if (!Array.isArray(data)) throw new Error('not an FTS organisation list')
  const out = new Map<string, FtsOrganization>()
  for (const o of data as { id?: unknown; name?: unknown; locations?: unknown }[]) {
    if (o.id === undefined) continue
    const locations = Array.isArray(o.locations)
      ? (o.locations as { id?: unknown }[])
          .filter((l) => l.id !== undefined)
          .map((l) => String(l.id))
      : []
    out.set(String(o.id), { id: String(o.id), name: String(o.name ?? ''), locations })
  }
  return out
}

/**
 * The overrides whose organisation record exists and is located in exactly the override's country
 * (organisation id → ISO3), and a problem for each one that is not: an override never applies on
 * trust.
 */
export function verifyOverrides(
  overrides: readonly { orgId: string; iso3: string }[],
  organizations: ReadonlyMap<string, FtsOrganization>,
  locations: ReadonlyMap<string, string>,
): { applied: Map<string, string>; problems: string[] } {
  const applied = new Map<string, string>()
  const problems: string[] = []
  for (const o of overrides) {
    const rec = organizations.get(o.orgId)
    if (rec === undefined) {
      problems.push(`organisation ${o.orgId}: not in the FTS organisation list; not applied`)
      continue
    }
    const iso = [...new Set(rec.locations.map((l) => locations.get(l) ?? `location ${l}`))]
    if (iso.length !== 1 || iso[0] !== o.iso3) {
      problems.push(
        `organisation ${o.orgId} (${rec.name}): located in ${iso.join(', ') || 'nothing'}, not ${o.iso3}; not applied`,
      )
      continue
    }
    applied.set(o.orgId, o.iso3)
  }
  return { applied, problems }
}

export const planPageUrl = (planId: string): string =>
  `${FTS_FLOW_URL}?planid=${planId}&limit=${FTS_PAGE_LIMIT}`

interface FtsObject {
  type?: unknown
  id?: unknown
  name?: unknown
  organizationTypes?: unknown
}

export interface FtsFlow {
  id: string
  amountUSD: number
  status: string
  boundary: string
  date: string
  sourceObjects: FtsObject[]
  destinationObjects: FtsObject[]
}

export interface FtsPage {
  planId: string
  /** Page number, 1-based. */
  page: number
  sourceId: string
  count: number
  nextLink: string | null
  flows: FtsFlow[]
}

/** Parses one archived page of `/public/fts/flow`; throws on anything unexpected. */
export function parseFlowPage(
  json: unknown,
  planId: string,
  page: number,
  sourceId: string,
): FtsPage {
  const j = json as {
    status?: unknown
    data?: { flows?: unknown }
    meta?: { count?: unknown; nextLink?: unknown }
  }
  if (j?.status !== 'ok' || !Array.isArray(j.data?.flows)) {
    throw new Error(
      `plan ${planId} page ${page}: not an FTS flow response (status ${String(j?.status)})`,
    )
  }
  const flows = (j.data.flows as Record<string, unknown>[]).map((f, i) => {
    const id = String(f.id ?? '')
    const amount = f.amountUSD
    const date = typeof f.date === 'string' ? f.date.slice(0, 10) : ''
    if (
      id === '' ||
      typeof amount !== 'number' ||
      !Number.isFinite(amount) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date)
    ) {
      throw new Error(`plan ${planId} page ${page}: flow #${i + 1} lacks id, amountUSD or date`)
    }
    return {
      id,
      amountUSD: amount,
      status: String(f.status ?? ''),
      boundary: String(f.boundary ?? ''),
      date,
      sourceObjects: Array.isArray(f.sourceObjects) ? (f.sourceObjects as FtsObject[]) : [],
      destinationObjects: Array.isArray(f.destinationObjects)
        ? (f.destinationObjects as FtsObject[])
        : [],
    }
  })
  const count = Number(j.meta?.count)
  if (!Number.isInteger(count)) throw new Error(`plan ${planId} page ${page}: meta.count missing`)
  const next =
    typeof j.meta?.nextLink === 'string' && j.meta.nextLink !== '' ? j.meta.nextLink : null
  return { planId, page, sourceId, count, nextLink: next, flows }
}

/** FTS location id → ISO3, from `/public/location`. */
export function parseLocations(json: unknown): Map<string, string> {
  const data = (json as { data?: unknown })?.data
  if (!Array.isArray(data)) throw new Error('not an FTS location list')
  const out = new Map<string, string>()
  for (const l of data as { id?: unknown; iso3?: unknown }[]) {
    if (typeof l.iso3 === 'string' && /^[A-Z]{3}$/.test(l.iso3) && l.id !== undefined)
      out.set(String(l.id), l.iso3)
  }
  return out
}

const COUNTED_STATUSES = new Set(['paid', 'commitment'])

export interface GovernmentFlow {
  flowId: string
  planId: string
  iso3: string
  amount: number
  date: string
  /** The FTS organisation id whose override attributed the flow (its location did not). */
  overriddenBy?: string
}

export interface UnattributedFlow {
  flowId: string
  planId: string
  organization: string
  location: string
  amount: number
}

function isGovernment(flow: FtsFlow): boolean {
  return flow.sourceObjects.some(
    (o) =>
      o.type === 'Organization' &&
      Array.isArray(o.organizationTypes) &&
      o.organizationTypes.includes('Governments'),
  )
}

/** The government flows of the pages that count (status, boundary, plan), attributed or not. */
export function governmentFlows(
  pages: readonly FtsPage[],
  locations: ReadonlyMap<string, string>,
  universe: ReadonlySet<string>,
  overrides: ReadonlyMap<string, string> = new Map(),
): { attributed: GovernmentFlow[]; unattributed: UnattributedFlow[] } {
  const attributed: GovernmentFlow[] = []
  const unattributed: UnattributedFlow[] = []
  for (const page of pages) {
    for (const f of page.flows) {
      if (!COUNTED_STATUSES.has(f.status) || f.boundary !== 'incoming' || !isGovernment(f)) continue
      const inPlan = f.destinationObjects.some(
        (o) => o.type === 'Plan' && String(o.id) === page.planId,
      )
      if (!inPlan) continue
      const loc = f.sourceObjects.find((o) => o.type === 'Location')
      const iso3 = loc ? locations.get(String(loc.id)) : undefined
      if (iso3 !== undefined && universe.has(iso3)) {
        attributed.push({
          flowId: f.id,
          planId: page.planId,
          iso3,
          amount: f.amountUSD,
          date: f.date,
        })
        continue
      }
      const org = f.sourceObjects.find((o) => o.type === 'Organization')
      const override = org ? overrides.get(String(org.id)) : undefined
      if (override !== undefined && universe.has(override)) {
        attributed.push({
          flowId: f.id,
          planId: page.planId,
          iso3: override,
          amount: f.amountUSD,
          date: f.date,
          overriddenBy: String(org?.id),
        })
      } else {
        unattributed.push({
          flowId: f.id,
          planId: page.planId,
          organization: String(org?.name ?? '?'),
          location: loc ? String(loc.name ?? loc.id) : '(none)',
          amount: f.amountUSD,
        })
      }
    }
  }
  return { attributed, unattributed }
}

/** `YYYY-MM` plus `n` months. */
export function addMonths(month: string, n: number): string {
  const [y, m] = month.split('-').map(Number) as [number, number]
  const t = y * 12 + (m - 1) + n
  return `${Math.floor(t / 12)}-${String((t % 12) + 1).padStart(2, '0')}`
}

/**
 * The trailing-12-month window behind the D1 value of month `month` (docs/02 §5, "recomputed
 * monthly; valid one month"): the twelve complete calendar months before it. The value of
 * October 2024 is the funding dated 1 October 2023 to 30 September 2024.
 */
export function windowFor(month: string): { start: string; end: string } {
  return { start: `${addMonths(month, -12)}-01`, end: addDays(`${month}-01`, -1) }
}

export type FtsWindowRow = {
  iso3: string
  window_start: string
  window_end: string
  usd_paid_committed: number
  plan_ids: string
  retrieved_at: string
  source: string
}

export type FtsPlanRow = {
  iso3: string
  plan_id: string
  usd_paid_committed: number
  flows: number
  retrieved_at: string
  source: string
}

export interface FtsTables {
  windows: FtsWindowRow[]
  plans: FtsPlanRow[]
  unattributed: UnattributedFlow[]
  /** Government flows (after the filters) listed under more than one plan, counted once in windows. */
  sharedFlows: string[]
  /** Attributed flows dated before 2023-10-07. */
  preWindowFlows: GovernmentFlow[]
  /** Flows attributed by an override (FTS_ATTRIBUTION_OVERRIDES). */
  overriddenFlows: GovernmentFlow[]
}

/**
 * The two tables of fetch:fts. Window rows for every donor with an attributed flow, for every
 * month from October 2023 to `lastMonth`, zeros included (zero is a real zero, docs/02 §5); plan
 * rows per donor and plan over all flow dates. Amounts are summed exactly and rounded once.
 */
export function ftsTables(input: {
  pages: readonly FtsPage[]
  locations: ReadonlyMap<string, string>
  locationSourceId: string
  universe: ReadonlySet<string>
  plans: readonly string[]
  lastMonth: string
  retrievedAt: string
  /** Organisation id → ISO3 (verifyOverrides), and the archived organisation list they cite. */
  overrides?: ReadonlyMap<string, string>
  organizationSourceId?: string
}): FtsTables {
  const { attributed, unattributed } = governmentFlows(
    input.pages,
    input.locations,
    input.universe,
    input.overrides,
  )
  // Rows of a donor with an overridden flow also cite the organisation list (P-14).
  const overridden = new Set(attributed.filter((f) => f.overriddenBy).map((f) => f.iso3))
  const withOrgs = (iso3: string, sources: string[]) =>
    overridden.has(iso3) && input.organizationSourceId
      ? [...sources, input.organizationSourceId]
      : sources
  const pageSources = (plan: string) =>
    input.pages
      .filter((p) => p.planId === plan)
      .sort((a, b) => a.page - b.page)
      .map((p) => p.sourceId)

  // Plan totals.
  const plans: FtsPlanRow[] = []
  const byPlan = new Map<string, { sum: number; n: number }>()
  for (const f of attributed) {
    const k = `${f.iso3}\u0000${f.planId}`
    const cur = byPlan.get(k) ?? { sum: 0, n: 0 }
    cur.sum += f.amount
    cur.n += 1
    byPlan.set(k, cur)
  }
  for (const [k, v] of byPlan) {
    const [iso3, plan] = k.split('\u0000') as [string, string]
    plans.push({
      iso3,
      plan_id: plan,
      usd_paid_committed: Math.round(v.sum),
      flows: v.n,
      retrieved_at: input.retrievedAt,
      source: withOrgs(iso3, [...pageSources(plan), input.locationSourceId]).join(';'),
    })
  }

  // Each flow once, whatever the number of plans listing it.
  const seen = new Map<string, GovernmentFlow>()
  const shared = new Set<string>()
  for (const f of attributed) {
    if (seen.has(f.flowId)) shared.add(f.flowId)
    else seen.set(f.flowId, f)
  }
  const unique = [...seen.values()]
  const donors = [...new Set(unique.map((f) => f.iso3))].sort()
  const allSources = [...input.plans.flatMap(pageSources), input.locationSourceId]
  const windows: FtsWindowRow[] = []
  for (let month = FTS_FIRST_MONTH; month <= input.lastMonth; month = addMonths(month, 1)) {
    const w = windowFor(month)
    for (const iso3 of donors) {
      let sum = 0
      for (const f of unique)
        if (f.iso3 === iso3 && f.date >= w.start && f.date <= w.end) sum += f.amount
      windows.push({
        iso3,
        window_start: w.start,
        window_end: w.end,
        usd_paid_committed: Math.round(sum),
        plan_ids: input.plans.join(';'),
        retrieved_at: input.retrievedAt,
        source: withOrgs(iso3, allSources).join(';'),
      })
    }
  }
  return {
    windows,
    plans,
    unattributed,
    sharedFlows: [...shared].sort(),
    preWindowFlows: unique.filter((f) => f.date < '2023-10-07'),
    overriddenFlows: attributed.filter((f) => f.overriddenBy !== undefined),
  }
}
