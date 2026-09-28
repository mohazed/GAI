/**
 * Zod schemas of the public API: every JSON file that `pnpm build:data` writes under
 * `apps/web/public/api/v1/` (docs/04 §2 step 6, docs/02 §14, D-05). The build parses each file it
 * emits with the schema `apiSchemaFor(path)` returns and fails on any mismatch, so these schemas
 * are the contract between build-data, the site, the widget and outside readers of the API.
 *
 * Conventions (documented in apps/web/public/api/README.md):
 * - Keys are snake_case; objects are strict; absent values are `null`, never missing keys, except
 *   in `methodology/{version}.json`, which reproduces the methodology files as parsed (their
 *   optional keys may be absent).
 * - Dates are `YYYY-MM-DD` (UTC calendar dates); the only date that depends on the run is the
 *   build date passed to the build (`build_date`), and files whose content does not depend on it
 *   (`scores/{date}.json`, `changes/{YYYY-MM}.json`) do not carry it.
 * - `score` is S rounded half away from zero to one decimal, `score_display` to an integer
 *   (docs/02 §7). Category subtotals (`raw`, `clipped`) are full precision, so that a reader can
 *   recompute S with other weights (docs/02 §9) and get the published value back at weights 1.
 * - Series (`series`, `points`) carry one-decimal subtotals, as the change points are cut on
 *   one-decimal values (`dailySeries` in @gai/scoring); exact subtotals for any date are in
 *   `scores/{date}.json`.
 * - Coverage is the research status of the dataset at the build date (docs/02 §8, D-09). It is
 *   not recomputed for earlier dates: the assessments record what was checked, not when.
 */
import { z } from 'zod'
import {
  BandsFile,
  CategoriesFile,
  ConfidenceFile,
  DecayFile,
  IndicatorsFile,
  MethodologyDiffFile,
  MethodologyVersion,
  PassivityFile,
  Reviewer,
  SymmetryFile,
  ThresholdsFile,
  VotesFile,
} from './methodology/schemas.js'
import {
  AssessmentStatus,
  CategoryId,
  Confidence,
  EventStatus,
  EventType,
  IndicatorId,
  Iso2,
  Iso3,
  IsoDate,
  IsoDateTime,
  LangCode,
  LangText,
  NonEmpty,
  Scope,
  Sha256,
  SourceKind,
  Url,
} from './primitives.js'
import { CorrectionId, EventIdLike, LeadId, ReplyId, SourceId, UnscTerm } from './records.js'

// ---------------------------------------------------------------------------------------------
// Primitives

const Num = z.number()
const Int = z.number().int()
const Count = z.number().int().nonnegative()
/** A share in [0, 1]. */
const Ratio = z.number().min(0).max(1)
/** A value with at most one decimal (a score rounded half away from zero, docs/02 §7). */
const OneDecimal = z.number().refine((x) => Math.abs(x * 10 - Math.round(x * 10)) < 1e-6, {
  message: 'expected at most one decimal',
})
/** Band id from bands.yaml (sustaining, enabling, passive, acting, confronting). */
export const BandId = z.string().regex(/^[a-z][a-z-]*$/, 'expected a band id')
/** A 40-hex git commit SHA. */
export const GitSha = z.string().regex(/^[0-9a-f]{40}$/, 'expected a 40-hex git commit SHA')
export const MonthId = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'expected YYYY-MM')
/** ISO 8601 week, e.g. `2026-W39`. */
export const IsoWeekId = z.string().regex(/^\d{4}-W(0[1-9]|[1-4]\d|5[0-3])$/, 'expected YYYY-Www')

function byCategory<T extends z.ZodType>(t: T) {
  return z.strictObject({ A: t, B: t, C: t, D: t, E: t })
}

// ---------------------------------------------------------------------------------------------
// Records as published (docs/03), normalised: every optional field present, null when absent

export const ApiSource = z.strictObject({
  id: SourceId,
  kind: SourceKind,
  title: NonEmpty,
  publisher: NonEmpty,
  publisher_type: NonEmpty,
  url: NonEmpty,
  wayback_url: Url.nullable(),
  archive_status: z.enum(['archived', 'failed']).nullable(),
  archive_url_alt: Url.nullable(),
  sha256: Sha256.nullable(),
  bytes: Count.nullable(),
  content_type: z.string().nullable(),
  retrieved_at: IsoDateTime.nullable(),
  language: LangCode,
  date: IsoDate,
  text_file: z.string().nullable(),
  excerpt: z.string().nullable(),
  origin: SourceId.nullable(),
  notes: z.string().nullable(),
})
export type ApiSource = z.infer<typeof ApiSource>

/** Sources keyed by id; each key equals its record's `id`. */
export const ApiSourceMap = z
  .record(z.string(), ApiSource)
  .refine((m) => Object.entries(m).every(([k, v]) => k === v.id), {
    message: 'each key must equal its source id',
  })
export type ApiSourceMap = z.infer<typeof ApiSourceMap>

export const ApiEvidence = z.strictObject({
  source: SourceId,
  quote: NonEmpty,
  quote_lang: LangCode,
  quote_en: z.string().nullable(),
  quote_fr: z.string().nullable(),
  locator: NonEmpty,
})
export type ApiEvidence = z.infer<typeof ApiEvidence>

export const ApiReview = z.strictObject({
  drafted_by: NonEmpty,
  drafted_at: IsoDate,
  second_read: z
    .strictObject({
      by: NonEmpty,
      at: IsoDate,
      verdict: z.enum(['agree', 'disagree']),
      notes: z.string().nullable(),
    })
    .nullable(),
  reviewed_by: z.string().nullable(),
  reviewed_at: IsoDate.nullable(),
  notes: z.string().nullable(),
})
export type ApiReview = z.infer<typeof ApiReview>

/** Why an event does or does not count at the build date (EventEvaluation in @gai/scoring). */
export const EventReasonId = z.enum([
  'counted',
  'not-published',
  'out-of-scope',
  'not-yet',
  'ended',
  'expired',
  'excluded',
  'superseded',
  'earlier-position',
  'less-severe',
  'same-tier',
])

/**
 * One event, hand-authored (data/events) or generated from data/structured (`generated: true`,
 * D-08), with its evaluation at the build date. Only events whose status is public (published,
 * corrected, superseded, retracted) are published; drafts and reviewed events are not.
 */
export const ApiEvent = z.strictObject({
  id: EventIdLike,
  revision: z.number().int().min(1),
  country: Iso3,
  indicator: IndicatorId,
  indicator_name: LangText,
  category: CategoryId,
  type: EventType,
  date: IsoDate,
  /** Standing and computed events: first day the state no longer holds (exclusive); null = holds. */
  end: IsoDate.nullable(),
  points: Num,
  points_rationale: z.string().nullable(),
  confidence: Confidence,
  scope: z.array(Scope).min(1),
  summary: LangText,
  actor: z.strictObject({ en: NonEmpty, fr: NonEmpty, name: z.string().nullable() }).nullable(),
  evidence: z.array(ApiEvidence).min(1),
  status: EventStatus,
  supersedes: EventIdLike.nullable(),
  related: z.array(EventIdLike),
  generated: z.boolean(),
  review: ApiReview,
  /** Can contribute to the score: status published, scope gaza, scored indicator (A–D). */
  scored: z.boolean(),
  /** Evaluation at the build date (docs/02 §3, §6). */
  at_build: z.strictObject({
    reason: EventReasonId,
    /** 1 or 0 for standing and computed events, d(Δ) for repeatable ones. */
    factor: Num,
    /** Confidence weight. */
    weight: Num,
    /** Own contribution p · w · d at the build date; 0 when it cannot score. */
    value: Num,
    /** What it adds to its indicator after the stacking rules, before the indicator cap. */
    counted: Num,
    /** Qualifies against the passivity penalty at the build date (docs/02 §6). */
    qualifies: z.boolean(),
    /** For superseded, earlier-position, less-severe and same-tier: the event counting instead. */
    by: EventIdLike.nullable(),
  }),
  /**
   * Computed events: points of the computed value of the same country and indicator in force the
   * day before; null for the first value and after a gap (no value in force the day before).
   */
  previous_points: Num.nullable(),
  /** Ids of the corrections log entries naming the event. */
  corrections: z.array(CorrectionId),
  /** Ids of the published replies contesting the event. */
  replies: z.array(ReplyId),
})
export type ApiEvent = z.infer<typeof ApiEvent>

export const ApiReply = z.strictObject({
  id: ReplyId,
  country: Iso3,
  received_at: IsoDate,
  published_at: IsoDate,
  from: z.strictObject({ org: NonEmpty, role: NonEmpty }),
  contests: z.array(EventIdLike).min(1),
  text: z.strictObject({ original: NonEmpty, lang: LangCode, en: NonEmpty, fr: NonEmpty }),
  response: LangText,
  outcome: z.enum(['none', 'disputed', 'corrected', 'retracted']),
  notes: z.string().nullable(),
})
export type ApiReply = z.infer<typeof ApiReply>

export const ApiCorrection = z.strictObject({
  id: CorrectionId,
  date: IsoDate,
  event: EventIdLike,
  /** Country of the event, null when the event is not in the dataset. */
  country: Iso3.nullable(),
  kind: z.enum(['correction', 'retraction']),
  flagged_by: z.enum(['public', 'author', 'reply', 'reviewer']),
  flagged_ref: z.string().nullable(),
  before: z.record(z.string(), z.unknown()),
  after: z.record(z.string(), z.unknown()),
  reason: NonEmpty,
  /**
   * The mainline commit (first-parent history of the built branch: the merge or direct commit)
   * that added the entry to the corrections log; the previous version of the event is at its first
   * parent (docs/03 §8). Null when the entry is not committed or the clone is shallow.
   */
  commit: GitSha.nullable(),
})
export type ApiCorrection = z.infer<typeof ApiCorrection>

// ---------------------------------------------------------------------------------------------
// Countries

export const MEMBERSHIP_KEYS = [
  'unsc',
  'eu',
  'nato',
  'arab_league',
  'oic',
  'g20',
  'g7',
  'brics',
] as const
export const MembershipKey = z.enum(MEMBERSHIP_KEYS)

export const ApiMembership = z.union([
  z.boolean(),
  z.strictObject({
    since: IsoDate.nullable(),
    until: IsoDate.nullable(),
    note: z.string().nullable(),
  }),
])
export type ApiMembership = z.infer<typeof ApiMembership>

/** The registry entry of data/countries.yaml (docs/03 §3), without research notes. */
const RegistryFields = {
  iso3: Iso3,
  iso2: Iso2,
  m49: z.number().int().min(1).max(999),
  name: LangText,
  region: NonEmpty,
  subregion: NonEmpty,
  un_member: z.boolean(),
  observer: z.boolean(),
  memberships: z.strictObject({
    unsc: z.array(UnscTerm),
    eu: ApiMembership,
    nato: ApiMembership,
    arab_league: ApiMembership,
    oic: ApiMembership,
    g20: ApiMembership,
    g7: ApiMembership,
    brics: ApiMembership,
  }),
  /** Memberships held on the build date, in MEMBERSHIP_KEYS order. */
  member_of: z.array(MembershipKey),
  recognises_palestine_since: IsoDate.nullable(),
} as const

export const ApiCategory = z.strictObject({
  /** Sum of the indicator values after indicator-level caps, full precision. */
  raw: Num,
  /** raw bounded by the category cap, full precision. */
  clipped: Num,
  cap: z.strictObject({ min: Num, max: Num }),
  capped: z.boolean(),
  /** false for E: shown, never summed (D-12). */
  scored: z.boolean(),
  /** w_k at the published score: 1 (docs/02 §9). */
  weight: Num,
})
export type ApiCategory = z.infer<typeof ApiCategory>

export const ApiPassivity = z.strictObject({
  applied: z.boolean(),
  /** The penalty's size, applied or not. */
  points: Num,
  /** What is subtracted: points when applied, else 0. */
  value: Num,
  window_days: Count,
  /** Ids of the qualifying events at the build date, by date then id. */
  qualifying: z.array(EventIdLike),
})
export type ApiPassivity = z.infer<typeof ApiPassivity>

export const ApiCoverage = z.strictObject({
  /** (has-events + none-found) / applicable (docs/02 §8), full precision. */
  ratio: Ratio,
  applicable: Count,
  has_events: Count,
  none_found: Count,
  no_data: Count,
  unchecked: Count,
  not_applicable: Count,
  /** Applicable indicators not covered (no-data and unchecked), methodology order. */
  missing: z.array(IndicatorId),
  no_data_ids: z.array(IndicatorId),
  unchecked_ids: z.array(IndicatorId),
  not_applicable_ids: z.array(IndicatorId),
  /** A1 or A2 is no-data: the card says "no export data", never a zero (docs/02 §8). */
  no_export_data: z.boolean(),
  /** Status of each of the scored indicators. */
  statuses: z.record(IndicatorId, AssessmentStatus),
})
export type ApiCoverage = z.infer<typeof ApiCoverage>

export const ApiEventCounts = z.strictObject({
  total: Count,
  confirmed: Count,
  corroborated: Count,
  reported: Count,
  disputed: Count,
  /** The same events by category; the five counts add up to `total` (scorecard mode, D-16). */
  by_category: byCategory(Count),
})
export type ApiEventCounts = z.infer<typeof ApiEventCounts>

export const ApiLastChange = z.strictObject({
  date: IsoDate,
  kind: z.enum(['event', 'passivity']),
  event: EventIdLike.nullable(),
  indicator: IndicatorId.nullable(),
  change: z.enum(['start', 'end', 'expire']).nullable(),
  /** Net change of that event's indicator value that day (after its cap), full precision. */
  points: Num.nullable(),
  /** What that step alone did to S, full precision. */
  effect: Num,
  /** score(d) − score(d − 1), one decimal (docs/02 §14). */
  delta: OneDecimal,
  passivity: z.strictObject({ before: z.boolean(), after: z.boolean() }),
})
export type ApiLastChange = z.infer<typeof ApiLastChange>

export const ApiLatestEvent = z.strictObject({
  date: IsoDate,
  id: EventIdLike,
  indicator: IndicatorId,
  points: Num,
})
export type ApiLatestEvent = z.infer<typeof ApiLatestEvent>

/** The score of a scored country at the build date (docs/02 §14, extended). */
const ScoreFields = {
  methodology: MethodologyVersion,
  /** The build date. */
  date: IsoDate,
  score: OneDecimal,
  score_display: Int,
  band: BandId,
  band_name: LangText,
  passivity_applied: z.boolean(),
  passivity: ApiPassivity,
  categories: byCategory(ApiCategory),
  coverage: ApiCoverage,
  /** Published events scoped to gaza dated on or before the build date, computed ones excepted. */
  events: ApiEventCounts,
  last_change: ApiLastChange.nullable(),
  /** The latest counted event (for the scorecard summary, D-16). */
  latest_event: ApiLatestEvent.nullable(),
  /** Summary line with the score (spec §5). */
  summary: LangText,
  /** Summary line without score or band, for scorecard mode (D-16). */
  summary_scorecard: LangText,
} as const

export const ApiScoredCountry = z.strictObject({
  ...RegistryFields,
  excluded: z.literal(false),
  ...ScoreFields,
})
export type ApiScoredCountry = z.infer<typeof ApiScoredCountry>

export const ApiExcludedCountry = z.strictObject({
  ...RegistryFields,
  excluded: z.literal(true),
  excluded_reason: LangText,
})
export type ApiExcludedCountry = z.infer<typeof ApiExcludedCountry>

export const ApiCountryEntry = z.discriminatedUnion('excluded', [
  ApiScoredCountry,
  ApiExcludedCountry,
])
export type ApiCountryEntry = z.infer<typeof ApiCountryEntry>

/** countries.json */
export const ApiCountriesFile = z.strictObject({
  build_date: IsoDate,
  methodology: MethodologyVersion,
  counts: z.strictObject({ total: Count, scored: Count, excluded: Count }),
  /** Every registry entry, by ISO3. */
  countries: z.array(ApiCountryEntry),
})
export type ApiCountriesFile = z.infer<typeof ApiCountriesFile>

export const ApiIndicatorResult = z.strictObject({
  id: IndicatorId,
  category: CategoryId,
  /** Sum of the counted contributions. */
  raw: Num,
  /** raw bounded by the indicator-level cap. */
  value: Num,
  cap: z.strictObject({ min: Num.nullable(), max: Num.nullable() }).nullable(),
  capped: z.boolean(),
  counted: z.array(EventIdLike),
})
export type ApiIndicatorResult = z.infer<typeof ApiIndicatorResult>

/** How the build arrived at a status (derived from a structured table, generated indicators). */
export const ApiDerivedStatus = z.strictObject({ status: AssessmentStatus, reason: NonEmpty })
export type ApiDerivedStatus = z.infer<typeof ApiDerivedStatus>

export const ApiAssessmentRow = z.strictObject({
  indicator: IndicatorId,
  category: CategoryId,
  name: LangText,
  /** false for E1–E3: tracked, outside coverage (D-12). */
  scored: z.boolean(),
  /** The status used for coverage at the build date. */
  status: AssessmentStatus,
  /** The status written in data/assessments/{ISO3}.yaml (unchecked when absent). */
  hand_status: AssessmentStatus,
  /** For the generated indicators (B1, B2, A1, A2, A4, C3, D1): the status read from the tables. */
  derived: ApiDerivedStatus.nullable(),
  /** When a rule replaced the hand-written status (docs/02 §8). */
  override: z
    .strictObject({ from: AssessmentStatus, to: AssessmentStatus, reason: NonEmpty })
    .nullable(),
  checked_at: IsoDate.nullable(),
  note: z.string().nullable(),
  queries: z.array(z.string()),
})
export type ApiAssessmentRow = z.infer<typeof ApiAssessmentRow>

export const ApiAssessment = z.strictObject({
  protocol_version: Int.nullable(),
  last_full_check: IsoDate.nullable(),
  /** Every indicator of the methodology, in its order. */
  indicators: z.array(ApiAssessmentRow),
})
export type ApiAssessment = z.infer<typeof ApiAssessment>

export const ApiTransition = z.strictObject({
  id: EventIdLike,
  indicator: IndicatorId,
  kind: z.enum(['start', 'end', 'expire', 'leaves-passivity-window']),
})
export type ApiTransition = z.infer<typeof ApiTransition>

/**
 * One change point of the daily score: a day on which the score (one decimal), the display
 * integer, the band, the passivity flag or a category subtotal (one decimal) changed. Between two
 * points every value equals the earlier point's; the first day (2023-10-07) is always a point.
 */
export const ApiSeriesPoint = z.strictObject({
  date: IsoDate,
  score: OneDecimal,
  score_display: Int,
  band: BandId,
  passivity_applied: z.boolean(),
  categories: byCategory(z.strictObject({ raw: OneDecimal, clipped: OneDecimal })),
  transitions: z.array(ApiTransition),
})
export type ApiSeriesPoint = z.infer<typeof ApiSeriesPoint>

const CitationSet = z.strictObject({ apa: NonEmpty, chicago: NonEmpty, plain: NonEmpty })
export const ApiCitations = z.strictObject({ en: CitationSet, fr: CitationSet })
export type ApiCitations = z.infer<typeof ApiCitations>

/** countries/{ISO3}.json for a scored country. */
export const ApiScoredCountryFile = z.strictObject({
  ...RegistryFields,
  excluded: z.literal(false),
  ...ScoreFields,
  build_date: IsoDate,
  indicators: z.array(ApiIndicatorResult),
  assessment: ApiAssessment,
  /** Every public event of the country, by date then id. */
  event_list: z.array(ApiEvent),
  /** Every source the events cite. */
  sources: ApiSourceMap,
  replies: z.array(ApiReply),
  corrections: z.array(ApiCorrection),
  /** Open leads (press or NGO claims without a primary document, never scored, docs/03 §10). */
  leads: z.strictObject({ open: Count, indicators: z.array(IndicatorId) }),
  series: z.array(ApiSeriesPoint),
  /** Citations of the build-date snapshot: with the score, and for scorecard mode (D-16). */
  citations: z.strictObject({ score: ApiCitations, scorecard: ApiCitations }),
  /** Dated permalinks of the build-date snapshot. */
  permalink: LangText,
})
export type ApiScoredCountryFile = z.infer<typeof ApiScoredCountryFile>

/** countries/{ISO3}.json for an excluded entity (ISR, PSE, D-10). */
export const ApiExcludedCountryFile = z.strictObject({
  ...RegistryFields,
  excluded: z.literal(true),
  excluded_reason: LangText,
  build_date: IsoDate,
  methodology: MethodologyVersion,
})
export type ApiExcludedCountryFile = z.infer<typeof ApiExcludedCountryFile>

export const ApiCountryFile = z.discriminatedUnion('excluded', [
  ApiScoredCountryFile,
  ApiExcludedCountryFile,
])
export type ApiCountryFile = z.infer<typeof ApiCountryFile>

/** countries/{ISO3}/events.json */
export const ApiCountryEventsFile = z.strictObject({
  build_date: IsoDate,
  methodology: MethodologyVersion,
  iso3: Iso3,
  events: z.array(ApiEvent),
  sources: ApiSourceMap,
})
export type ApiCountryEventsFile = z.infer<typeof ApiCountryEventsFile>

/** countries/{ISO3}/series.json */
export const ApiCountrySeriesFile = z.strictObject({
  build_date: IsoDate,
  methodology: MethodologyVersion,
  iso3: Iso3,
  from: IsoDate,
  to: IsoDate,
  points: z.array(ApiSeriesPoint),
})
export type ApiCountrySeriesFile = z.infer<typeof ApiCountrySeriesFile>

// ---------------------------------------------------------------------------------------------
// Scores by date

/** scores/index.json */
export const ApiScoresIndex = z.strictObject({
  build_date: IsoDate,
  methodology: MethodologyVersion,
  from: IsoDate,
  to: IsoDate,
  count: Count,
  /** Every date with a scores/{date}.json file, ascending. */
  dates: z.array(IsoDate),
})
export type ApiScoresIndex = z.infer<typeof ApiScoresIndex>

export const ApiDayScore = z.strictObject({
  iso3: Iso3,
  score: OneDecimal,
  score_display: Int,
  band: BandId,
  passivity_applied: z.boolean(),
  /** Clipped category subtotals, full precision (E shown, never summed). */
  clipped: byCategory(Num),
})
export type ApiDayScore = z.infer<typeof ApiDayScore>

/** scores/{YYYY-MM-DD}.json */
export const ApiScoresDayFile = z.strictObject({
  date: IsoDate,
  methodology: MethodologyVersion,
  /** Every scored country, by ISO3. */
  countries: z.array(ApiDayScore),
})
export type ApiScoresDayFile = z.infer<typeof ApiScoresDayFile>

// ---------------------------------------------------------------------------------------------
// Methodology

/** methodology/index.json */
export const ApiMethodologyIndex = z.strictObject({
  build_date: IsoDate,
  current: MethodologyVersion,
  versions: z.array(
    z.strictObject({
      version: MethodologyVersion,
      /** e.g. `methodology/v1.0.0` in the repository. */
      folder: NonEmpty,
      status: z.enum(['current', 'superseded']),
      /** e.g. `methodology/1.0.0-rc.1.json` in the API. */
      file: NonEmpty,
      /** API folder of the frozen outputs of a superseded version (docs/02 §11), or null. */
      frozen: z.string().nullable(),
    }),
  ),
  /** methodology/CHANGELOG.md, verbatim. */
  changelog: z.string().nullable(),
  /** methodology/reviewers.yaml `reviewers` (docs/08 §2); empty until there are reviewers. */
  reviewers: z.array(Reviewer),
})
export type ApiMethodologyIndex = z.infer<typeof ApiMethodologyIndex>

/** methodology/{version}.json: the files of one version folder as parsed (docs/03 §1). */
export const ApiMethodologyFile = z.strictObject({
  version: MethodologyVersion,
  folder: NonEmpty,
  status: z.enum(['current', 'superseded']),
  window_start: IsoDate,
  indicators: IndicatorsFile,
  categories: CategoriesFile,
  bands: BandsFile,
  confidence: ConfidenceFile,
  decay: DecayFile,
  passivity: PassivityFile,
  thresholds: ThresholdsFile.nullable(),
  votes: VotesFile.nullable(),
  symmetry: SymmetryFile.nullable(),
  /** banned-words.txt entries, in file order. */
  banned_words: z.array(z.string()),
  /** methodology.en.md and methodology.fr.md, verbatim. */
  docs: z.strictObject({ en: z.string().nullable(), fr: z.string().nullable() }),
  /** diff.json of the folder (scores moved from the previous version), or null (docs/02 §11). */
  diff: MethodologyDiffFile.nullable(),
})
export type ApiMethodologyFile = z.infer<typeof ApiMethodologyFile>

// ---------------------------------------------------------------------------------------------
// Changes

export const ApiMover = z.strictObject({
  iso3: Iso3,
  name: LangText,
  from: OneDecimal,
  to: OneDecimal,
  delta: OneDecimal,
  display_from: Int,
  display_to: Int,
  /** Change of the integer display score; never 0 for a mover. */
  display_delta: Int,
})
export type ApiMover = z.infer<typeof ApiMover>

export const ApiMovers = z.strictObject({
  /** 7 or 30 for the rolling windows of changes/latest.json; null for a calendar month. */
  days: Count.nullable(),
  from: IsoDate,
  to: IsoDate,
  /** Largest rise first. */
  up: z.array(ApiMover),
  /** Largest fall first. */
  down: z.array(ApiMover),
})
export type ApiMovers = z.infer<typeof ApiMovers>

/**
 * One entry of the changes feed: a published event scoped to gaza starting on `date`
 * (`change: start`), or a standing state or a computed value not followed by another ending on
 * `date` (`change: end`, its end date, the first day it no longer counts).
 */
export const ApiFeedEntry = z.strictObject({
  id: EventIdLike,
  country: Iso3,
  country_name: LangText,
  indicator: IndicatorId,
  indicator_name: LangText,
  category: CategoryId,
  type: EventType,
  change: z.enum(['start', 'end']),
  date: IsoDate,
  points: Num,
  /** Computed starts: `ApiEvent.previous_points`; null for other entries. */
  previous_points: Num.nullable(),
  /** false only for a computed start whose points equal the value in force the day before (P-09). */
  points_changed: z.boolean(),
  confidence: Confidence,
  generated: z.boolean(),
  summary: LangText,
})
export type ApiFeedEntry = z.infer<typeof ApiFeedEntry>

export const ApiFeedWeek = z.strictObject({
  week: IsoWeekId,
  /** Monday. */
  from: IsoDate,
  /** Sunday. */
  to: IsoDate,
  /** Entries dated in the week (and, in a month file, in the month), by date, country, id. */
  entries: z.array(ApiFeedEntry),
  /** Entries of computed events whose points did not change (listed, and counted here). */
  unchanged_computed: Count,
})
export type ApiFeedWeek = z.infer<typeof ApiFeedWeek>

export const ApiReportPaths = z.strictObject({
  en: NonEmpty,
  fr: NonEmpty,
  scorecard_en: NonEmpty,
  scorecard_fr: NonEmpty,
})
export type ApiReportPaths = z.infer<typeof ApiReportPaths>

/** changes/{YYYY-MM}.json */
export const ApiChangesMonthFile = z.strictObject({
  month: MonthId,
  methodology: MethodologyVersion,
  /** First day of the month (2023-10-07 for October 2023). */
  from: IsoDate,
  /** Last day of the month, or the build date for the month in progress. */
  to: IsoDate,
  complete: z.boolean(),
  /** Every ISO week with at least one day in [from, to]. */
  weeks: z.array(ApiFeedWeek),
  /** Display-score movers from the day before `from` (or `from` in October 2023) to `to`. */
  movers: ApiMovers,
  corrections: z.array(ApiCorrection),
  replies: z.array(ApiReply),
  counts: z.strictObject({
    entries: Count,
    starts: Count,
    ends: Count,
    unchanged_computed: Count,
  }),
  /** The monthly report, with and without scores (D-16), in English and French. */
  reports: ApiReportPaths,
})
export type ApiChangesMonthFile = z.infer<typeof ApiChangesMonthFile>

/** changes/latest.json */
export const ApiChangesLatestFile = z.strictObject({
  build_date: IsoDate,
  methodology: MethodologyVersion,
  movers: z.strictObject({ d7: ApiMovers, d30: ApiMovers }),
  /**
   * The 20 latest entries dated on or before the build date, newest first, computed values whose
   * points did not change left out (P-09).
   */
  recent: z.array(ApiFeedEntry),
  /** The ISO week of the build date and the four before it, newest first. */
  weeks: z.array(ApiFeedWeek),
  /** Corrections dated in the 30 days to the build date, newest first. */
  corrections: z.array(ApiCorrection),
  /** Every month from 2023-10 to the build month, ascending. */
  months: z.array(
    z.strictObject({
      month: MonthId,
      file: NonEmpty,
      reports: ApiReportPaths,
      entries: Count,
      complete: z.boolean(),
    }),
  ),
})
export type ApiChangesLatestFile = z.infer<typeof ApiChangesLatestFile>

// ---------------------------------------------------------------------------------------------
// Logs

/** corrections.json */
export const ApiCorrectionsFile = z.strictObject({
  build_date: IsoDate,
  /** By date, then id. */
  corrections: z.array(ApiCorrection),
})
export type ApiCorrectionsFile = z.infer<typeof ApiCorrectionsFile>

/** replies.json: replies published on or before the build date. */
export const ApiRepliesFile = z.strictObject({
  build_date: IsoDate,
  /** By published_at, then id. */
  replies: z.array(ApiReply),
})
export type ApiRepliesFile = z.infer<typeof ApiRepliesFile>

// ---------------------------------------------------------------------------------------------
// Sensitivity (docs/02 §10)

export const ApiRanked = z.strictObject({
  iso3: Iso3,
  /** S in full precision. */
  exact: Num,
  score: OneDecimal,
  score_display: Int,
  band: BandId,
  /** 1-based position (score descending, then ISO3). */
  position: Count,
  /** Fractional rank: tied scores share the average of their positions. */
  rank: Num,
})
export type ApiRanked = z.infer<typeof ApiRanked>

export const ApiSensitivityVariant = z.strictObject({
  id: NonEmpty,
  params: z.strictObject({
    passivity_points: Num.nullable(),
    weights: z
      .strictObject({
        A: Num.nullable(),
        B: Num.nullable(),
        C: Num.nullable(),
        D: Num.nullable(),
      })
      .nullable(),
    confidence_weights: z.strictObject({ reported: Num }).nullable(),
    exclude_indicators: z.array(IndicatorId).nullable(),
    decay: z.literal('off').nullable(),
  }),
  /** Spearman's ρ with the default ranking; null with fewer than two countries or all tied. */
  spearman: z.number().min(-1).max(1).nullable(),
  /** Countries whose integer display score differs from the default. */
  changed_display: Count,
  ranking: z.array(ApiRanked),
})
export type ApiSensitivityVariant = z.infer<typeof ApiSensitivityVariant>

/** sensitivity.json */
export const ApiSensitivityFile = z.strictObject({
  build_date: IsoDate,
  methodology: MethodologyVersion,
  /** Number of countries ranked. */
  n: Count,
  baseline: z.array(ApiRanked),
  tables: z.array(
    z.strictObject({
      id: z.enum(['passivity', 'weights', 'confidence', 'statements', 'decay']),
      variants: z.array(ApiSensitivityVariant),
    }),
  ),
})
export type ApiSensitivityFile = z.infer<typeof ApiSensitivityFile>

// ---------------------------------------------------------------------------------------------
// Build notes, manifest, dump

export const BUILD_NOTE_KINDS = [
  'generator',
  'unregistered-country',
  'unpublished-event',
  'assessment-derived',
  'assessment-disagreement',
  'unchecked',
  'validation-warning',
  'history',
  'large-file',
] as const
export const BuildNoteKind = z.enum(BUILD_NOTE_KINDS)

export const ApiBuildNote = z.strictObject({
  kind: BuildNoteKind,
  country: Iso3.nullable(),
  indicator: IndicatorId.nullable(),
  message: NonEmpty,
})
export type ApiBuildNote = z.infer<typeof ApiBuildNote>

/** build-notes.json */
export const ApiBuildNotesFile = z.strictObject({
  build_date: IsoDate,
  methodology: MethodologyVersion,
  /** Number of notes per kind (every kind listed). */
  counts: z.record(BuildNoteKind, Count),
  /** By kind (BUILD_NOTE_KINDS order), country, indicator, message. */
  notes: z.array(ApiBuildNote),
})
export type ApiBuildNotesFile = z.infer<typeof ApiBuildNotesFile>

export const ApiGitInfo = z.strictObject({
  /** HEAD of the repository the build read, or null outside a git checkout. */
  sha: GitSha.nullable(),
  /**
   * Uncommitted changes under the build's inputs (data, archive, methodology, code), and files
   * git ignores under data, archive and methodology: either makes the build unreproducible from
   * a clone at `sha`. Null when git cannot tell.
   */
  dirty: z.boolean().nullable(),
})
export type ApiGitInfo = z.infer<typeof ApiGitInfo>

/** manifest.json */
export const ApiManifestFile = z.strictObject({
  build_date: IsoDate,
  methodology: z.strictObject({ version: MethodologyVersion, folder: NonEmpty }),
  git: ApiGitInfo,
  site_url: Url,
  generator: NonEmpty,
  /** Every other file of the build, by path (relative to api/v1/). */
  files: z.array(z.strictObject({ path: NonEmpty, bytes: Count, sha256: Sha256 })),
  total: z.strictObject({ files: Count, bytes: Count }),
})
export type ApiManifestFile = z.infer<typeof ApiManifestFile>

/** dumps/gai-{YYYY-MM-DD}.json: the whole published dataset at the build date. */
export const ApiDumpFile = z.strictObject({
  build_date: IsoDate,
  methodology: MethodologyVersion,
  git: ApiGitInfo,
  countries: z.array(ApiCountryEntry),
  events: z.array(ApiEvent),
  sources: z.array(ApiSource),
  assessments: z.array(
    z.strictObject({
      country: Iso3,
      protocol_version: Int.nullable(),
      last_full_check: IsoDate.nullable(),
      indicators: z.array(ApiAssessmentRow),
    }),
  ),
  corrections: z.array(ApiCorrection),
  replies: z.array(ApiReply),
  leads: z.array(z.strictObject({ id: LeadId, country: Iso3, indicator: IndicatorId })),
})
export type ApiDumpFile = z.infer<typeof ApiDumpFile>

// ---------------------------------------------------------------------------------------------
// Path → schema

export interface ApiFileSpec {
  /** Matched against the path relative to api/v1/, POSIX separators. */
  readonly pattern: RegExp
  readonly schema: z.ZodType
  readonly description: string
}

export const API_FILES: readonly ApiFileSpec[] = [
  { pattern: /^countries\.json$/, schema: ApiCountriesFile, description: 'every country' },
  {
    pattern: /^countries\/[A-Z]{3}\.json$/,
    schema: ApiCountryFile,
    description: 'one country in full',
  },
  {
    pattern: /^countries\/[A-Z]{3}\/events\.json$/,
    schema: ApiCountryEventsFile,
    description: "one country's events",
  },
  {
    pattern: /^countries\/[A-Z]{3}\/series\.json$/,
    schema: ApiCountrySeriesFile,
    description: "one country's daily score as change points",
  },
  { pattern: /^scores\/index\.json$/, schema: ApiScoresIndex, description: 'dates with scores' },
  {
    pattern: /^scores\/\d{4}-\d{2}-\d{2}\.json$/,
    schema: ApiScoresDayFile,
    description: 'every score on one date',
  },
  {
    pattern: /^methodology\/index\.json$/,
    schema: ApiMethodologyIndex,
    description: 'methodology versions and changelog',
  },
  {
    pattern: /^methodology\/\d+\.\d+\.\d+(?:-[0-9A-Za-z.]+)?\.json$/,
    schema: ApiMethodologyFile,
    description: 'one methodology version',
  },
  {
    pattern: /^changes\/latest\.json$/,
    schema: ApiChangesLatestFile,
    description: 'movers and recent changes',
  },
  {
    pattern: /^changes\/\d{4}-\d{2}\.json$/,
    schema: ApiChangesMonthFile,
    description: 'changes of one month',
  },
  { pattern: /^corrections\.json$/, schema: ApiCorrectionsFile, description: 'corrections log' },
  { pattern: /^replies\.json$/, schema: ApiRepliesFile, description: 'right-of-reply records' },
  {
    pattern: /^sensitivity\.json$/,
    schema: ApiSensitivityFile,
    description: 'sensitivity tables',
  },
  { pattern: /^build-notes\.json$/, schema: ApiBuildNotesFile, description: 'build notes' },
  { pattern: /^manifest\.json$/, schema: ApiManifestFile, description: 'build manifest' },
  {
    pattern: /^dumps\/gai-\d{4}-\d{2}-\d{2}\.json$/,
    schema: ApiDumpFile,
    description: 'full dataset dump',
  },
]

/**
 * Frozen outputs of superseded methodology versions (docs/02 §11), copied verbatim from
 * data/snapshots/{version}/: validated by the schemas of their own time, not these.
 */
export const FROZEN_PATH = /^methodology\/v?\d+\.\d+\.\d+(?:-[0-9A-Za-z.]+)?\//

/** The schema of an emitted JSON file, or null (non-JSON files, frozen snapshots, unknown). */
export function apiSchemaFor(path: string): z.ZodType | null {
  if (FROZEN_PATH.test(path)) return null
  return API_FILES.find((f) => f.pattern.test(path))?.schema ?? null
}
