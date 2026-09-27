/**
 * The bulk downloads of the API (docs/04 §2 step 6): four CSV tables and one JSON file holding
 * the whole published dataset at the build date.
 *
 * - `dumps/events.csv`: one row per published event (every public status) of the scored
 *   countries, by country, date, id; lists are joined with `;` (scope, evidence sources without
 *   repeats in evidence order, related ids); the evaluation at the build date is reduced to its
 *   reason, own value and counted value.
 * - `dumps/sources.csv`: every source of the dataset, by id, every field in api.ts order.
 * - `dumps/assessments.csv`: one row per country and indicator (countries by ISO3, indicators in
 *   methodology order), with the hand-written and derived statuses; queries joined with ` | `.
 * - `dumps/scores-daily.csv`: one row per date and scored country from the window start to the
 *   build date, by date then ISO3; `score` to one decimal, the clipped category subtotals A–E in
 *   full precision (docs/02 §7, §9: a reader can recompute S with other weights). Coverage is not
 *   a daily value: it is the research status at the build date (countries.json, assessments.csv).
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
} from '@gai/schema'
import { dayNumber, isoDate } from '@gai/scoring'
import { csvDocument, jsonText } from './json.js'
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
 * `dumps/scores-daily.csv`: by date, then ISO3. Throws when a country is listed twice or when its
 * days do not run from the window start to the build date (one entry per day).
 */
function scoresDailyCsv(input: DumpInput): string {
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
  const rows: unknown[][] = []
  for (let i = 0; i < count; i++) {
    const date = isoDate(first + i)
    for (const c of countries) {
      const line = { date, iso3: c.iso3, day: c.days[i] as DayScore }
      rows.push(SCORES_DAILY_CSV_COLUMNS.map((col) => SCORE_FIELDS[col](line)))
    }
  }
  return csvDocument(SCORES_DAILY_CSV_COLUMNS, rows)
}

/**
 * The five dump files, keyed by path relative to api/v1/: `dumps/events.csv`,
 * `dumps/sources.csv`, `dumps/assessments.csv`, `dumps/scores-daily.csv` and
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
    ['dumps/scores-daily.csv', scoresDailyCsv(input)],
    [`dumps/gai-${input.date}.json`, jsonText(dump)],
  ])
}
