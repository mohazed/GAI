/**
 * Assessment statuses at the build date (docs/02 §8, docs/03 §6, D-08, D-09).
 *
 * The eight generated indicators (B1, B2, B8, A1, A2, A4, C3, D1) are measured from the tables of
 * data/structured, so their status is read from the tables rather than taken on trust from the
 * hand-written data/assessments/{ISO3}.yaml. `deriveGeneratedStatuses` applies these rules, in
 * order, for one country as of a date; `null` means the tables say nothing and the hand status
 * stands:
 *
 * 1. Any of the eight: a published generated event of the indicator, scoped to gaza and dated on or
 *    before the date → `has-events` (`generated-event`). Nothing else overrides it.
 * 2. A1: before `no_data_before` of formula a1 (the first post-war SIPRI release) → `no-data`
 *    (`before-first-release`, docs/02 §5: no data for anyone, whatever the table holds). Else
 *    sipri_deliveries.csv has no rows at all → null (not imported: the hand status stands, as for
 *    D1). Else a release is in force when the table has a row of its data year (year of release
 *    − 1, the rows generateA1 reads) released from `no_data_before` to the date. A SIPRI release
 *    covers every country (docs/02 §5, methodology.en.md: s = TIV(country) / TIV(all), 0 ≤ s ≤ 1),
 *    so a country without an event then has s = 0 → `none-found` (`release-without-deliveries`),
 *    whether SIPRI lists it with earlier years only or not at all; except a country whose own
 *    data-year row in force has deliveries but no computable share (total ≤ 0 or TIV above the
 *    total; generateA1 notes it) → `no-data` (`row-not-computable`). No release in force →
 *    `no-data` (`no-release`): the card says "no export data", never zero (docs/02 §8).
 * 3. A2: comtrade_a2.csv has no rows → null (not fetched). Else a row of the country released on
 *    or before the date (any HS code, either reporter) → `none-found`
 *    (`row-without-counted-exports`: the rows are HS 8526/8802 not confirmed as military, docs/02 §2 A2);
 *    else `no-data` (`no-row`: docs/02 §5, "if both absent, no-data").
 * 4. C3: comtrade_c3.csv has no rows → null (not fetched). Else a row of the country released on
 *    or before the date → `none-found` (`row-without-event`); else `no-data` (`no-row`).
 * 5. A4: sipri_orders.csv has no rows → null (orders not imported; `pnpm import:sipri` imports
 *    them only with `--orders`, so a deliveries release says nothing about orders). Else the
 *    releases in force are the release dates of sipri_orders.csv from `no_data_before` of formula
 *    a1 to the date. A release covers A4 when its data year (year of release − 1) starts on or
 *    after `parameters.orders_signed_from` of formula a4 (default 2023-10-07; SIPRI dates orders
 *    by year, so the 2023 orders mix pre-war contracts). A covering release in force →
 *    `none-found` (`release-without-orders`); except a country whose row of the data year in the
 *    latest covering release is 0 TIV → `no-data` (`orders-without-tiv`): SIPRI lists an order
 *    but writes 0 for its "SIPRI TIV for total order", either below 0.5 TIV or not available (the
 *    number ordered is not known), so "TIV > 0" of formula a4 cannot be decided (B-488). No
 *    covering release in force → `no-data` (`no-release`).
 * 6. D1: fts_funding.csv has no rows at all → null (the table was not fetched). Else a row of the
 *    country with funding above zero, whose window ended before the date, and no usable GNI (the
 *    row gniFor picks, as the generator does, is missing or zero) → `no-data` (`no-gni`); else
 *    `none-found` (`no-funding`): no FTS row, or only zero rows, is a real zero (docs/02 §5).
 * 7. B2: not on the Security Council in the window → null (coverage makes it not-applicable,
 *    docs/02 §8). An elected member → `none-found` (`no-veto-power`). A permanent member:
 *    `none-found` (`no-ceasefire-veto`) when unsc_vetoes.csv has at least one row (the table is
 *    filled), else null.
 * 8. B1: null unless rule 1. A vote record without the country (the Holy See, for one) is decided
 *    by the hand assessment; `b1MissingFromVotes` lists the qualifying votes whose rows omit the
 *    country, for the build notes.
 * 9. B8: null unless rule 1. recognitions.csv holds the recognitions confirmed from an archived
 *    official statement, not yet every recognising state, so a missing row decides nothing and
 *    the hand status stands (P-14 prompt: B8 is derived beyond rule 1 only once the table decides
 *    a status for every country).
 *
 * `effectiveAssessment` lays the derived statuses over the hand ones; the coverage function of
 * @gai/scoring reads the result. `disagreements` reports a hand status that the tables contradict,
 * except when the tables give `has-events`, which the build sets whatever the file says
 * (docs/03 §6). `assessmentRows` writes the 34 rows of a country file.
 *
 * Pure: no clock, no I/O (D-25).
 */
import {
  type ApiAssessmentRow,
  type Assessment,
  type AssessmentStatus,
  type Dataset,
  type Event,
  type Formula,
  type Methodology,
  WINDOW_START,
} from '@gai/schema'
import {
  type Coverage,
  SCORED_SCOPE,
  SCORING_STATUS,
  type ScoringAssessment,
  type ScoringMethodology,
} from '@gai/scoring'
import { gniFor } from '../generate/funding.js'
import { dataYearOf, isA1ShareComputable, isDataYearRow } from '../generate/sipri.js'
import type { BuildNote, DerivedStatus } from './types.js'

/** The indicators generated from data/structured (D-08), in code-unit order. */
export const GENERATED_INDICATORS = ['A1', 'A2', 'A4', 'B1', 'B2', 'B8', 'C3', 'D1'] as const
export type GeneratedIndicator = (typeof GENERATED_INDICATORS)[number]

/** Default of formula a4 `orders_signed_from` (docs/02 §2 A4). */
const DEFAULT_ORDERS_SIGNED_FROM = '2023-10-07'

export interface DeriveInput {
  iso3: string
  /** Derive as of this date (`YYYY-MM-DD`). */
  date: string
  structured: Dataset['structured']
  /** The country's generated events (published, generated: true). */
  generated: readonly Event[]
  /** Thresholds (no_data_before, orders_signed_from) and the qualifying votes. */
  methodology: Methodology
  /** Held a Security Council seat on some day of [window start, date]. */
  unscMember: boolean
  /** A permanent member of the Security Council. */
  permanentMember: boolean
}

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0
}

function derived(status: AssessmentStatus, reason: string): DerivedStatus {
  return { status, reason }
}

/** The formula of an indicator: its `points.ref` in thresholds.yaml, else the one naming it. */
function formulaOf(m: Methodology, indicator: string): Formula | null {
  const formulas = m.thresholds?.value.formulas
  if (formulas === undefined) return null
  const points = m.indicatorById.get(indicator)?.points
  if (points?.kind === 'formula' && formulas[points.ref] !== undefined) {
    return formulas[points.ref] as Formula
  }
  return Object.values(formulas).find((f) => f.indicator === indicator) ?? null
}

/** `no_data_before` of formula a1 (the first post-war SIPRI release), or the window start. */
function firstSipriRelease(m: Methodology): { date: string; declared: boolean } {
  const f = formulaOf(m, 'A1')
  return f?.kind === 'sqrt_share'
    ? { date: f.no_data_before, declared: true }
    : { date: WINDOW_START, declared: false }
}

function ordersSignedFrom(m: Methodology): string {
  const f = formulaOf(m, 'A4')
  const v = f?.kind === 'tiers' ? f.parameters?.orders_signed_from : undefined
  return typeof v === 'string' ? v : DEFAULT_ORDERS_SIGNED_FROM
}

function hasGeneratedEvent(input: DeriveInput, indicator: string): boolean {
  return input.generated.some(
    (e) =>
      e.generated === true &&
      e.country === input.iso3 &&
      e.indicator === indicator &&
      e.status === SCORING_STATUS &&
      e.scope.includes(SCORED_SCOPE) &&
      e.date <= input.date,
  )
}

function deriveA1(input: DeriveInput): DerivedStatus | null {
  const { iso3, date } = input
  const first = firstSipriRelease(input.methodology)
  if (first.declared && date < first.date) return derived('no-data', 'before-first-release')
  const rows = input.structured['sipri_deliveries.csv']
  if (rows.length === 0) return null
  const inForce = rows.filter(
    (r) =>
      isDataYearRow(r.value) && r.value.release_date >= first.date && r.value.release_date <= date,
  )
  if (inForce.length === 0) return derived('no-data', 'no-release')
  const notComputable = inForce.some(
    (r) =>
      r.value.supplier_iso3 === iso3 && r.value.tiv_to_israel > 0 && !isA1ShareComputable(r.value),
  )
  return notComputable
    ? derived('no-data', 'row-not-computable')
    : derived('none-found', 'release-without-deliveries')
}

function deriveA2(input: DeriveInput): DerivedStatus | null {
  const rows = input.structured['comtrade_a2.csv']
  if (rows.length === 0) return null
  const row = rows.some((r) => r.value.iso3 === input.iso3 && r.value.release_date <= input.date)
  return row ? derived('none-found', 'row-without-counted-exports') : derived('no-data', 'no-row')
}

function deriveC3(input: DeriveInput): DerivedStatus | null {
  const rows = input.structured['comtrade_c3.csv']
  if (rows.length === 0) return null
  const row = rows.some((r) => r.value.iso3 === input.iso3 && r.value.release_date <= input.date)
  return row ? derived('none-found', 'row-without-event') : derived('no-data', 'no-row')
}

function deriveA4(input: DeriveInput): DerivedStatus | null {
  const { iso3, date } = input
  const orders = input.structured['sipri_orders.csv']
  if (orders.length === 0) return null
  const first = firstSipriRelease(input.methodology).date
  const from = ordersSignedFrom(input.methodology)
  let latest: string | undefined
  for (const {
    value: { release_date: release },
  } of orders) {
    if (release < first || release > date) continue
    if (`${String(dataYearOf(release)).padStart(4, '0')}-01-01` < from) continue
    if (latest === undefined || release > latest) latest = release
  }
  if (latest === undefined) return derived('no-data', 'no-release')
  const zeroTiv = orders.some(
    ({ value: r }) =>
      r.release_date === latest &&
      r.buyer_iso3 === iso3 &&
      isDataYearRow(r) &&
      r.tiv_new_orders_from_israel <= 0,
  )
  return zeroTiv
    ? derived('no-data', 'orders-without-tiv')
    : derived('none-found', 'release-without-orders')
}

function deriveD1(input: DeriveInput): DerivedStatus | null {
  const { iso3, date, structured } = input
  const funding = structured['fts_funding.csv']
  if (funding.length === 0) return null
  const gni = structured['gni.csv'].filter((g) => g.value.iso3 === iso3)
  const noGni = funding.some((r) => {
    const v = r.value
    if (v.iso3 !== iso3 || v.usd_paid_committed <= 0 || v.window_end >= date) return false
    const g = gniFor(gni, Number(v.window_end.slice(0, 4)))
    return g === undefined || g.value.gni_atlas_usd <= 0
  })
  return noGni ? derived('no-data', 'no-gni') : derived('none-found', 'no-funding')
}

function deriveB2(input: DeriveInput): DerivedStatus | null {
  if (!input.unscMember) return null
  if (!input.permanentMember) return derived('none-found', 'no-veto-power')
  return input.structured['unsc_vetoes.csv'].length > 0
    ? derived('none-found', 'no-ceasefire-veto')
    : null
}

/**
 * The status of each generated indicator for one country as of `input.date`, read from the
 * tables (rules in the module comment); null = the tables say nothing, the hand status stands.
 */
export function deriveGeneratedStatuses(
  input: DeriveInput,
): Record<GeneratedIndicator, DerivedStatus | null> {
  const rules: Record<GeneratedIndicator, (i: DeriveInput) => DerivedStatus | null> = {
    A1: deriveA1,
    A2: deriveA2,
    A4: deriveA4,
    B1: () => null,
    B2: deriveB2,
    B8: () => null,
    C3: deriveC3,
    D1: deriveD1,
  }
  const out = {} as Record<GeneratedIndicator, DerivedStatus | null>
  for (const id of GENERATED_INDICATORS) {
    out[id] = hasGeneratedEvent(input, id)
      ? derived('has-events', 'generated-event')
      : rules[id](input)
  }
  return out
}

/**
 * Qualifying votes (votes.yaml) dated on or before `input.date` whose rows in unga_votes.csv do not
 * include the country, although the vote has rows: the symbols, by date then symbol. The B1 status
 * of such a country is left to the hand assessment; the build lists these in its notes.
 */
export function b1MissingFromVotes(input: DeriveInput): string[] {
  const votes = input.methodology.votes?.value.votes ?? []
  const rows = input.structured['unga_votes.csv']
  const withRows = new Set(rows.map((r) => r.value.resolution))
  const withCountry = new Set(
    rows.filter((r) => r.value.iso3 === input.iso3).map((r) => r.value.resolution),
  )
  return votes
    .filter((v) => v.date <= input.date && withRows.has(v.symbol) && !withCountry.has(v.symbol))
    .sort((a, b) => compareStrings(a.date, b.date) || compareStrings(a.symbol, b.symbol))
    .map((v) => v.symbol)
}

/**
 * The assessment the coverage function reads: the hand statuses (data/assessments/{ISO3}.yaml)
 * with every non-null derived status laid over them.
 */
export function effectiveAssessment(
  hand: Assessment | null,
  derivedStatuses: Readonly<Record<string, DerivedStatus | null>>,
): ScoringAssessment {
  const indicators: Record<string, { status: AssessmentStatus }> = {}
  for (const [id, entry] of Object.entries(hand?.indicators ?? {})) {
    indicators[id] = { status: entry.status }
  }
  for (const [id, d] of Object.entries(derivedStatuses)) {
    if (d !== null && d !== undefined) indicators[id] = { status: d.status }
  }
  return { indicators }
}

/**
 * Hand statuses the tables contradict (kind `assessment-disagreement`), by indicator: the hand
 * status is set (not unchecked, not absent), the derived status is not null, the two differ, and
 * the derived status is not `has-events` (the build sets has-events whatever the file says,
 * docs/03 §6; the row's `override` records it).
 */
export function disagreements(
  iso3: string,
  hand: Assessment | null,
  derivedStatuses: Readonly<Record<string, DerivedStatus | null>>,
): BuildNote[] {
  const notes: BuildNote[] = []
  const ids = Object.keys(derivedStatuses).sort(compareStrings)
  for (const id of ids) {
    const d = derivedStatuses[id]
    const h = hand?.indicators[id]?.status
    if (d === null || d === undefined || h === undefined || h === 'unchecked') continue
    if (d.status === h || d.status === 'has-events') continue
    notes.push({
      kind: 'assessment-disagreement',
      country: iso3,
      indicator: id,
      message: `data/assessments/${iso3}.yaml gives ${id} ${h}; the structured tables give ${d.status} (${d.reason}), which is used.`,
    })
  }
  return notes
}

export interface AssessmentRowsInput {
  methodology: Methodology
  scoring: ScoringMethodology
  /** data/assessments/{ISO3}.yaml, or null when the country has none. */
  hand: Assessment | null
  /** deriveGeneratedStatuses of the country at the build date. */
  derived: Readonly<Record<string, DerivedStatus | null>>
  /** Coverage at the build date, computed from the effective assessment. */
  coverage: Coverage
  /** The country's events (hand-authored and generated). */
  events: readonly Event[]
  /** Build date. */
  date: string
}

/**
 * The assessment rows of a country file: every indicator of the methodology, in its order.
 *
 * - `status`: for a scored indicator, the coverage status; for an unscored one (E1–E3, D-12), the
 *   rule coverage applies to scored ones (docs/03 §6): `has-events` when a published event of it,
 *   scoped to gaza, is dated on or before the date; a hand-set `has-events` without such an event
 *   is `unchecked`; else the hand status (unchecked when absent).
 * - `hand_status`: the file's status, unchecked when absent; `derived`: the derived status of a
 *   generated indicator (null for others and when the tables say nothing).
 * - `override`: the coverage override of the indicator; else, for an unscored indicator, the
 *   published-event rule above; else, when the status differs from the hand status because of the
 *   derived one, {from: hand, to: status, reason: `derived:{reason}`}; else null.
 * - `checked_at`, `note`, `queries`: from the file (null, null, []).
 */
export function assessmentRows(args: AssessmentRowsInput): ApiAssessmentRow[] {
  const { methodology, scoring, hand, coverage, events, date } = args
  const withEvents = new Set(
    events
      .filter(
        (e) => e.status === SCORING_STATUS && e.scope.includes(SCORED_SCOPE) && e.date <= date,
      )
      .map((e) => e.indicator),
  )
  const overrides = new Map(coverage.overrides.map((o) => [o.indicator, o]))
  return scoring.indicators.map((compiled) => {
    const id = compiled.id
    const ind = methodology.indicatorById.get(id)
    const entry = hand?.indicators[id]
    const handStatus: AssessmentStatus = entry?.status ?? 'unchecked'
    const d = args.derived[id] ?? null
    let status: AssessmentStatus
    let override: ApiAssessmentRow['override'] = null
    if (compiled.scored) {
      const s = coverage.statuses[id]
      if (s === undefined) throw new Error(`coverage has no status for scored indicator ${id}`)
      status = s
      const o = overrides.get(id)
      if (o !== undefined) override = { from: o.from, to: o.to, reason: o.reason }
    } else if (withEvents.has(id)) {
      status = 'has-events'
      if (handStatus !== status)
        override = { from: handStatus, to: status, reason: 'published-event' }
    } else if (handStatus === 'has-events') {
      status = 'unchecked'
      override = { from: handStatus, to: status, reason: 'no-published-event' }
    } else {
      status = handStatus
    }
    if (override === null && d !== null && status !== handStatus && status === d.status) {
      override = { from: handStatus, to: status, reason: `derived:${d.reason}` }
    }
    return {
      indicator: id,
      category: compiled.category,
      name: { en: (ind?.name ?? compiled.name).en, fr: (ind?.name ?? compiled.name).fr },
      scored: compiled.scored,
      status,
      hand_status: handStatus,
      derived: d === null ? null : { status: d.status, reason: d.reason },
      override,
      checked_at: entry?.checked_at ?? null,
      note: entry?.note ?? null,
      queries: [...(entry?.queries ?? [])],
    }
  })
}
