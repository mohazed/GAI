/**
 * The bulk downloads of the API (docs/04 §2 step 6): seven CSV tables and one JSON file holding
 * the whole published dataset at the build date.
 *
 * - `dumps/events.csv`: one row per published event (every public status) of the scored
 *   countries, by country, date, id; lists are joined with `;` (scope, evidence sources without
 *   repeats in evidence order, related ids); the evaluation at the build date is reduced to its
 *   reason, own value and counted value.
 * - `dumps/sources.csv`: every source of the dataset, by id, every field in api.ts order.
 * - `dumps/assessments.csv`: one row per country and indicator (countries by ISO3, indicators in
 *   methodology order), with the hand-written and derived statuses; queries joined with ` | `.
 * - `dumps/scores-daily-{YYYY}.csv`: one file per year, one row per date and scored country from
 *   the window start to the build date, by date then ISO3; `score` to one decimal, the clipped
 *   category subtotals A–E in full precision (docs/02 §7, §9: a reader can recompute S with other weights). Coverage is not
 *   a daily value: it is the research status at the build date (countries.json, assessments.csv).
 * - `dumps/countries.csv`: one row per registry entry at the build date, as the ranking table
 *   shows it (docs/05 §6 Ranking "Download CSV"): scored countries by score, highest first, then
 *   ISO3, excluded entities after them by ISO3; the clipped category subtotals A–E and the
 *   passivity value in full precision, so a reader can apply other weights (docs/02 §9).
 * - `dumps/countries.scorecard.csv`: the same rows by ISO3 without anything derived from the score
 *   (no score, band, subtotal, passivity or last change), for scorecard mode (D-16): coverage and
 *   event counts by confidence and by category.
 * - `dumps/registry.csv`: the country registry (data/countries.yaml) by ISO3, as published at the
 *   build date: codes, UNTERM names in EN and FR with `name_fr_def` (the French name with its
 *   article), M49 region and sub-region, UN status, exclusion, the membership tags (Security
 *   Council terms as `from/to` intervals joined with `;`, `..` for an open end; a dated membership
 *   as `since/until`, one not held as `false`), the memberships held at the build date and the
 *   date of recognition of the State of Palestine. Research notes and gov_sources are left out, as
 *   in countries.json.
 * - `dumps/gai-{date}.json`: the `ApiDumpFile` (countries, events, sources, assessments,
 *   corrections, replies, open leads), canonical JSON.
 *
 * CSV conventions (json.ts `csvDocument`, docs/03 §7): UTF-8, header row, LF line endings, final
 * LF; a field is quoted when it holds a comma, a quote or a line break; booleans are `true` and
 * `false`; null is an empty field; numbers as JavaScript writes them. Every list is sorted here,
 * whatever order the caller passed, so the same input gives the same bytes (D-25). Pure.
 */
import type {
  ApiAssessmentRow,
  ApiCorrection,
  ApiCountryEntry,
  ApiDumpFile,
  ApiEvent,
  ApiReply,
  ApiSource,
  Country,
} from '@gai/schema'
import { dayNumber, isoDate } from '@gai/scoring'
import { csvDocument, jsonText } from './json.js'
import { registryFields } from './normalize.js'
import type { DayScore, GitInfo } from './types.js'

export const EVENTS_CSV_COLUMNS = [
  'id',
  'revision',
  'country',
  'indicator',
  'category',
  'type',
  'date',
  'end',
  'points',
  'points_rationale',
  'confidence',
  'scope',
  'status',
  'generated',
  'scored',
  'summary_en',
  'summary_fr',
  'actor_en',
  'actor_fr',
  'actor_name',
  'sources',
  'supersedes',
  'related',
  'at_build_reason',
  'at_build_value',
  'at_build_counted',
] as const

/** Every field of ApiSource, in api.ts order. */
export const SOURCES_CSV_COLUMNS = [
  'id',
  'kind',
  'title',
  'publisher',
  'publisher_type',
  'url',
  'wayback_url',
  'archive_status',
  'archive_url_alt',
  'sha256',
  'bytes',
  'content_type',
  'retrieved_at',
  'language',
  'date',
  'text_file',
  'excerpt',
  'origin',
  'notes',
] as const satisfies readonly (keyof ApiSource)[]

export const ASSESSMENTS_CSV_COLUMNS = [
  'country',
  'indicator',
  'category',
  'scored',
  'status',
  'hand_status',
  'derived_status',
  'derived_reason',
  'checked_at',
  'note',
  'queries',
] as const

export const SCORES_DAILY_CSV_COLUMNS = [
  'date',
  'iso3',
  'score',
  'score_display',
  'band',
  'passivity_applied',
  'A',
  'B',
  'C',
  'D',
  'E',
] as const

/** Columns shared by both country tables. */
const COUNTRY_CSV_HEAD = ['iso3', 'name_en', 'name_fr', 'region', 'excluded'] as const
const COUNTRY_CSV_COVERAGE = [
  'coverage',
  'has_events',
  'none_found',
  'no_data',
  'unchecked',
  'not_applicable',
  'events',
] as const

export const COUNTRIES_CSV_COLUMNS = [
  ...COUNTRY_CSV_HEAD,
  'score',
  'score_display',
  'band',
  'passivity_applied',
  'passivity_value',
  'A',
  'B',
  'C',
  'D',
  'E',
  ...COUNTRY_CSV_COVERAGE,
  'last_change',
] as const

export const COUNTRIES_SCORECARD_CSV_COLUMNS = [
  ...COUNTRY_CSV_HEAD,
  ...COUNTRY_CSV_COVERAGE,
  'events_confirmed',
  'events_corroborated',
  'events_reported',
  'events_disputed',
  'events_A',
  'events_B',
  'events_C',
  'events_D',
  'events_E',
  'latest_event',
] as const

export const REGISTRY_CSV_COLUMNS = [
  'iso3',
  'iso2',
  'm49',
  'name_en',
  'name_fr',
  'name_fr_def',
  'region',
  'subregion',
  'un_member',
  'observer',
  'excluded',
  'unsc',
  'unsc_permanent',
  'eu',
  'nato',
  'arab_league',
  'oic',
  'g20',
  'g7',
  'brics',
  'member_of',
  'recognises_palestine_since',
] as const

/** One country's assessment as the dump publishes it (ApiAssessment plus the country). */
export interface DumpAssessment {
  country: string
  protocol_version: number | null
  last_full_check: string | null
  /** Every indicator of the methodology, in its order (kept as given). */
  indicators: ApiAssessmentRow[]
}

/** An open lead: press or NGO claim without a primary document, never scored (docs/03 §10). */
export interface DumpLead {
  id: string
  country: string
  indicator: string
}

export interface DumpInput {
  /** Build date. */
  date: string
  /** Methodology version. */
  methodology: string
  git: GitInfo
  /** Every registry entry (sorted by ISO3 here). */
  countries: readonly ApiCountryEntry[]
  /** data/countries.yaml, for dumps/registry.csv (sorted by ISO3 here). */
  registry: readonly Country[]
  /** Every published-status event of the scored countries (sorted by country, date, id here). */
  events: readonly ApiEvent[]
  /** Every source of the dataset (sorted by id here). */
  sources: readonly ApiSource[]
  /** One per scored country (sorted by country here). */
  assessments: readonly DumpAssessment[]
  /** Sorted by date, then id, here. */
  corrections: readonly ApiCorrection[]
  /** Sorted by published_at, then id, here. */
  replies: readonly ApiReply[]
  /** Open leads (sorted by country, then id, here). */
  leads: readonly DumpLead[]
  /** Scored countries; `days[0]` is the window start and the last day the build date. */
  days: readonly { iso3: string; days: readonly DayScore[] }[]
  windowStart: string
}

type EventsColumn = (typeof EVENTS_CSV_COLUMNS)[number]
type AssessmentsColumn = (typeof ASSESSMENTS_CSV_COLUMNS)[number]
type ScoresColumn = (typeof SCORES_DAILY_CSV_COLUMNS)[number]

function compare(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0
}

/** A comparator on string keys, compared in order by code unit. */
function by<T>(...keys: ((x: T) => string)[]): (a: T, b: T) => number {
  return (a, b) => {
    for (const key of keys) {
      const c = compare(key(a), key(b))
      if (c !== 0) return c
    }
    return 0
  }
}

/** The values, first occurrence kept, in order. */
function unique(values: readonly string[]): string[] {
  return [...new Set(values)]
}

const EVENT_FIELDS: Record<EventsColumn, (e: ApiEvent) => unknown> = {
  id: (e) => e.id,
  revision: (e) => e.revision,
  country: (e) => e.country,
  indicator: (e) => e.indicator,
  category: (e) => e.category,
  type: (e) => e.type,
  date: (e) => e.date,
  end: (e) => e.end,
  points: (e) => e.points,
  points_rationale: (e) => e.points_rationale,
  confidence: (e) => e.confidence,
  scope: (e) => e.scope.join(';'),
  status: (e) => e.status,
  generated: (e) => e.generated,
  scored: (e) => e.scored,
  summary_en: (e) => e.summary.en,
  summary_fr: (e) => e.summary.fr,
  actor_en: (e) => e.actor?.en ?? null,
  actor_fr: (e) => e.actor?.fr ?? null,
  actor_name: (e) => e.actor?.name ?? null,
  sources: (e) => unique(e.evidence.map((x) => x.source)).join(';'),
  supersedes: (e) => e.supersedes,
  related: (e) => e.related.join(';'),
  at_build_reason: (e) => e.at_build.reason,
  at_build_value: (e) => e.at_build.value,
  at_build_counted: (e) => e.at_build.counted,
}

interface AssessmentLine {
  country: string
  row: ApiAssessmentRow
}

const ASSESSMENT_FIELDS: Record<AssessmentsColumn, (a: AssessmentLine) => unknown> = {
  country: (a) => a.country,
  indicator: (a) => a.row.indicator,
  category: (a) => a.row.category,
  scored: (a) => a.row.scored,
  status: (a) => a.row.status,
  hand_status: (a) => a.row.hand_status,
  derived_status: (a) => a.row.derived?.status ?? null,
  derived_reason: (a) => a.row.derived?.reason ?? null,
  checked_at: (a) => a.row.checked_at,
  note: (a) => a.row.note,
  queries: (a) => a.row.queries.join(' | '),
}

interface ScoreLine {
  date: string
  iso3: string
  day: DayScore
}

const SCORE_FIELDS: Record<ScoresColumn, (s: ScoreLine) => unknown> = {
  date: (s) => s.date,
  iso3: (s) => s.iso3,
  score: (s) => s.day.score,
  score_display: (s) => s.day.display,
  band: (s) => s.day.band,
  passivity_applied: (s) => s.day.passivity,
  A: (s) => s.day.clipped.A,
  B: (s) => s.day.clipped.B,
  C: (s) => s.day.clipped.C,
  D: (s) => s.day.clipped.D,
  E: (s) => s.day.clipped.E,
}

type Scored = Extract<ApiCountryEntry, { excluded: false }>
type CountryField = (c: ApiCountryEntry, s: Scored | null) => unknown

const COUNTRY_FIELDS: Record<
  (typeof COUNTRIES_CSV_COLUMNS)[number] | (typeof COUNTRIES_SCORECARD_CSV_COLUMNS)[number],
  CountryField
> = {
  iso3: (c) => c.iso3,
  name_en: (c) => c.name.en,
  name_fr: (c) => c.name.fr,
  region: (c) => c.region,
  excluded: (c) => c.excluded,
  score: (_, s) => s?.score ?? null,
  score_display: (_, s) => s?.score_display ?? null,
  band: (_, s) => s?.band ?? null,
  passivity_applied: (_, s) => s?.passivity.applied ?? null,
  passivity_value: (_, s) => s?.passivity.value ?? null,
  A: (_, s) => s?.categories.A.clipped ?? null,
  B: (_, s) => s?.categories.B.clipped ?? null,
  C: (_, s) => s?.categories.C.clipped ?? null,
  D: (_, s) => s?.categories.D.clipped ?? null,
  E: (_, s) => s?.categories.E.clipped ?? null,
  coverage: (_, s) => s?.coverage.ratio ?? null,
  has_events: (_, s) => s?.coverage.has_events ?? null,
  none_found: (_, s) => s?.coverage.none_found ?? null,
  no_data: (_, s) => s?.coverage.no_data ?? null,
  unchecked: (_, s) => s?.coverage.unchecked ?? null,
  not_applicable: (_, s) => s?.coverage.not_applicable ?? null,
  events: (_, s) => s?.events.total ?? null,
  events_confirmed: (_, s) => s?.events.confirmed ?? null,
  events_corroborated: (_, s) => s?.events.corroborated ?? null,
  events_reported: (_, s) => s?.events.reported ?? null,
  events_disputed: (_, s) => s?.events.disputed ?? null,
  events_A: (_, s) => s?.events.by_category.A ?? null,
  events_B: (_, s) => s?.events.by_category.B ?? null,
  events_C: (_, s) => s?.events.by_category.C ?? null,
  events_D: (_, s) => s?.events.by_category.D ?? null,
  events_E: (_, s) => s?.events.by_category.E ?? null,
  last_change: (_, s) => s?.last_change?.date ?? null,
  latest_event: (_, s) => s?.latest_event?.date ?? null,
}

function countryCsv(
  columns: readonly (keyof typeof COUNTRY_FIELDS)[],
  countries: readonly ApiCountryEntry[],
): string {
  return csvDocument(
    columns,
    countries.map((c) => columns.map((col) => COUNTRY_FIELDS[col](c, c.excluded ? null : c))),
  )
}

type MembershipValue = Country['memberships']['eu']

/** A membership cell: `true`/`false`, or `since/until` (`..` open) for a dated one held once. */
function membershipCell(m: MembershipValue): string | boolean {
  if (typeof m === 'boolean') return m
  if (m.since === null) return false
  return `${m.since}/${m.until ?? '..'}`
}

/** `dumps/registry.csv` at `date`, entries by ISO3. */
function registryCsv(registry: readonly Country[], date: string): string {
  const rows = [...registry].sort(by((c) => c.iso3)).map((c) => {
    const f = registryFields(c, date)
    const ms = c.memberships
    const cells: Record<(typeof REGISTRY_CSV_COLUMNS)[number], unknown> = {
      iso3: c.iso3,
      iso2: c.iso2,
      m49: c.m49,
      name_en: c.name.en,
      name_fr: c.name.fr,
      name_fr_def: c.name.fr_def ?? null,
      region: c.region,
      subregion: c.subregion,
      un_member: c.un_member,
      observer: c.observer,
      excluded: c.excluded,
      unsc: ms.unsc.map((t) => `${t.from}/${t.to ?? '..'}`).join(';'),
      unsc_permanent: ms.unsc.some((t) => t.permanent),
      eu: membershipCell(ms.eu),
      nato: membershipCell(ms.nato),
      arab_league: membershipCell(ms.arab_league),
      oic: membershipCell(ms.oic),
      g20: membershipCell(ms.g20),
      g7: membershipCell(ms.g7),
      brics: membershipCell(ms.brics),
      member_of: f.member_of.join(';'),
      recognises_palestine_since: c.recognises_palestine.since,
    }
    return REGISTRY_CSV_COLUMNS.map((col) => cells[col])
  })
  return csvDocument(REGISTRY_CSV_COLUMNS, rows)
}

/** Ranking order: scored countries by full-precision score, highest first, then ISO3. */
function rankingOrder(countries: readonly ApiCountryEntry[]): ApiCountryEntry[] {
  const scored = countries.filter((c): c is Scored => !c.excluded)
  const excluded = countries.filter((c) => c.excluded)
  scored.sort((a, b) => b.score - a.score || (a.iso3 < b.iso3 ? -1 : a.iso3 > b.iso3 ? 1 : 0))
  return [...scored, ...excluded]
}

/** `dumps/events.csv` of events already in dump order. */
function eventsCsv(events: readonly ApiEvent[]): string {
  return csvDocument(
    EVENTS_CSV_COLUMNS,
    events.map((e) => EVENTS_CSV_COLUMNS.map((c) => EVENT_FIELDS[c](e))),
  )
}

/** `dumps/sources.csv` of sources already in dump order. */
function sourcesCsv(sources: readonly ApiSource[]): string {
  return csvDocument(
    SOURCES_CSV_COLUMNS,
    sources.map((s) => SOURCES_CSV_COLUMNS.map((c) => s[c])),
  )
}

/** `dumps/assessments.csv` of assessments already in dump order. */
function assessmentsCsv(assessments: readonly DumpAssessment[]): string {
  return csvDocument(
    ASSESSMENTS_CSV_COLUMNS,
    assessments.flatMap((a) =>
      a.indicators.map((row) => {
        const line = { country: a.country, row }
        return ASSESSMENTS_CSV_COLUMNS.map((c) => ASSESSMENT_FIELDS[c](line))
      }),
    ),
  )
}

/**
 * `dumps/scores-daily-{YYYY}.csv`, one file per calendar year from the window start's year to the
 * build date's: rows by date, then ISO3. One file per year keeps every file far below the 25 MiB
 * that Cloudflare Pages serves (193 countries × 366 days is about 6 MB), however long the index
 * runs. Throws when a country is listed twice or when its days do not run from the window start
 * to the build date (one entry per day).
 */
function scoresDailyCsvs(input: DumpInput): [string, string][] {
  const first = dayNumber(input.windowStart)
  const count = dayNumber(input.date) - first + 1
  const countries = [...input.days].sort(by((c) => c.iso3))
  for (const [i, c] of countries.entries()) {
    if (i > 0 && countries[i - 1]?.iso3 === c.iso3) {
      throw new Error(`scores-daily: ${c.iso3} is listed twice`)
    }
    if (c.days.length !== count) {
      throw new RangeError(
        `scores-daily: ${c.iso3} has ${c.days.length} days; ${input.windowStart} to ${input.date} is ${count}`,
      )
    }
  }
  const years = new Map<string, unknown[][]>()
  for (let i = 0; i < count; i++) {
    const date = isoDate(first + i)
    const year = date.slice(0, 4)
    let rows = years.get(year)
    if (rows === undefined) {
      rows = []
      years.set(year, rows)
    }
    for (const c of countries) {
      const line = { date, iso3: c.iso3, day: c.days[i] as DayScore }
      rows.push(SCORES_DAILY_CSV_COLUMNS.map((col) => SCORE_FIELDS[col](line)))
    }
  }
  return [...years.entries()].map(([year, rows]) => [
    `dumps/scores-daily-${year}.csv`,
    csvDocument(SCORES_DAILY_CSV_COLUMNS, rows),
  ])
}

/**
 * The dump files, keyed by path relative to api/v1/: `dumps/events.csv`, `dumps/sources.csv`,
 * `dumps/assessments.csv`, `dumps/countries.csv`, `dumps/countries.scorecard.csv`,
 * `dumps/registry.csv`, `dumps/scores-daily-{YYYY}.csv` for each year, and
 * `dumps/gai-{date}.json`, in that order.
 */
export function dumpFiles(input: DumpInput): Map<string, string> {
  const countries = [...input.countries].sort(by((c) => c.iso3))
  const events = [...input.events].sort(
    by(
      (e) => e.country,
      (e) => e.date,
      (e) => e.id,
    ),
  )
  const sources = [...input.sources].sort(by((s) => s.id))
  const assessments = [...input.assessments].sort(by((a) => a.country))
  const corrections = [...input.corrections].sort(
    by(
      (c) => c.date,
      (c) => c.id,
    ),
  )
  const replies = [...input.replies].sort(
    by(
      (r) => r.published_at,
      (r) => r.id,
    ),
  )
  const leads = [...input.leads].sort(
    by(
      (l) => l.country,
      (l) => l.id,
    ),
  )

  const dump: ApiDumpFile = {
    build_date: input.date,
    methodology: input.methodology,
    git: { sha: input.git.sha, dirty: input.git.dirty },
    countries,
    events,
    sources,
    assessments: assessments.map((a) => ({
      country: a.country,
      protocol_version: a.protocol_version,
      last_full_check: a.last_full_check,
      indicators: a.indicators,
    })),
    corrections,
    replies,
    leads: leads.map((l) => ({ id: l.id, country: l.country, indicator: l.indicator })),
  }

  return new Map([
    ['dumps/events.csv', eventsCsv(events)],
    ['dumps/sources.csv', sourcesCsv(sources)],
    ['dumps/assessments.csv', assessmentsCsv(assessments)],
    ['dumps/countries.csv', countryCsv(COUNTRIES_CSV_COLUMNS, rankingOrder(countries))],
    ['dumps/countries.scorecard.csv', countryCsv(COUNTRIES_SCORECARD_CSV_COLUMNS, countries)],
    ['dumps/registry.csv', registryCsv(input.registry, input.date)],
    ...scoresDailyCsvs(input),
    [`dumps/gai-${input.date}.json`, jsonText(dump)],
  ])
}
