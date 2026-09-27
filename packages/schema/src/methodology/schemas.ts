/**
 * Zod schemas for every file in `methodology/vX.Y.Z/` (docs/02, docs/03 §1).
 *
 * The methodology files are the only place where points, caps, thresholds, decay, passivity,
 * the qualifying-votes list and the symmetry table live; they change only through a new version
 * folder and a changelog entry (docs/08 §1).
 */
import { z } from 'zod'
import {
  CategoryId,
  Confidence,
  EventType,
  IndicatorId,
  IsoDate,
  Key,
  LangText,
  NonEmpty,
  Sign,
  SourceKind,
  Url,
} from '../primitives.js'
import { SourceId } from '../records.js'

/** `1.0.0` or a pre-release such as `1.0.0-rc.1`. The folder name carries the base version. */
export const MethodologyVersion = z
  .string()
  .regex(/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.]+)?$/, 'expected a semantic version such as 1.0.0-rc.1')

// ---------------------------------------------------------------------------------------------
// indicators.yaml

export const CADENCES = [
  'annual-march',
  'annual',
  'quarterly',
  'monthly',
  'per-vote',
  'on-event',
  'on-change',
] as const
export const Cadence = z.enum(CADENCES)
export type Cadence = z.infer<typeof Cadence>

/** Bounds on a sum of contributions. `null` = no bound on that side. */
export const Cap = z.strictObject({ min: z.number().nullable(), max: z.number().nullable() })
export type Cap = z.infer<typeof Cap>

/** One allowed per-event value, named (e.g. B12 `recall` +5, `downgrade` +8, `severed` +10). */
export const PointsTier = z.strictObject({ key: Key, value: z.number(), label: LangText })
export type PointsTier = z.infer<typeof PointsTier>

/**
 * How many points one event carries:
 * - `fixed`: every event carries `value` (A3 −15, A6 +10…).
 * - `per_instance`: every confirmed instance carries `value`, or one of `tiers` (B9 +2/+5); the
 *   indicator's `indicator_cap` bounds the sum (A5, A8, B9, B10).
 * - `tiers`: every event carries one tier value; `stacking` says how tiers combine (B8, B12…).
 * - `formula`: computed from a structured table by the formula `ref` in thresholds.yaml, within
 *   `range` (A1, A2, A4, C3, D1).
 */
export const PointsSpec = z.discriminatedUnion('kind', [
  z.strictObject({ kind: z.literal('fixed'), value: z.number() }),
  z
    .strictObject({
      kind: z.literal('per_instance'),
      value: z.number().optional(),
      tiers: z.array(PointsTier).min(2).optional(),
    })
    .refine((p) => (p.value === undefined) !== (p.tiers === undefined), {
      message: 'per_instance takes exactly one of value or tiers',
    }),
  z.strictObject({ kind: z.literal('tiers'), tiers: z.array(PointsTier).min(2) }),
  z.strictObject({
    kind: z.literal('formula'),
    ref: Key,
    range: z.strictObject({ min: z.number(), max: z.number() }),
  }),
])
export type PointsSpec = z.infer<typeof PointsSpec>

export const STACKING_RULES = ['sum', 'most_severe', 'one_per_tier', 'latest_position'] as const

/**
 * How an indicator's events combine at a date, before `indicator_cap` (docs/02 §2):
 * - `sum`: contributions add.
 * - `most_severe`: one standing state only; the holding event with the largest |points| counts.
 * - `one_per_tier`: at most one holding event per tier counts; different tiers add (B11).
 * - `latest_position`: among the events of the indicators in `group`, the latest holding one
 *   counts (B5/B6).
 */
export const Stacking = z.strictObject({
  rule: z.enum(STACKING_RULES),
  group: z.array(IndicatorId).optional(),
  note: LangText.optional(),
})
export type Stacking = z.infer<typeof Stacking>

export const PrimarySource = z.strictObject({ en: NonEmpty, fr: NonEmpty, url: Url.optional() })

export const Indicator = z.strictObject({
  id: IndicatorId,
  category: CategoryId,
  name: LangText,
  description: LangText,
  /** Sign of every allowed per-event value; `mixed` only for B1. */
  sign: Sign,
  /** docs/02 §3; the validator rejects events whose type differs. */
  type: EventType,
  /** false for E1–E3 (D-12). */
  scored: z.boolean(),
  /** `generated` indicators come from data/structured or countries.yaml, never data/events (D-08). */
  authoring: z.enum(['hand', 'generated']),
  generated_from: z.string().optional(),
  points: PointsSpec,
  /** Per-event points may differ between events; `points_rationale` is required (docs/03 §4). */
  scaled: z.boolean(),
  /** Indicator-level cap on the summed contributions, applied before the category clip. */
  indicator_cap: Cap.nullable(),
  stacking: Stacking,
  /** Indicators whose holding standing state sets this one to zero (A6 ← A7). */
  superseded_by: z.array(IndicatorId),
  /** Automatic not-applicable rule (B2: states not on the Security Council in the window). */
  not_applicable: z.strictObject({ rule: z.enum(['unsc_non_member']), note: LangText }).nullable(),
  evidence: z.strictObject({
    requires_actor: z.boolean(),
    /** Source kinds allowed as evidence; null = any kind. */
    source_kinds: z.array(SourceKind).nullable(),
    rule: LangText,
  }),
  primary_sources: z.array(PrimarySource).min(1),
  cadence: Cadence,
  notes: LangText.optional(),
})
export type Indicator = z.infer<typeof Indicator>

export const IndicatorsFile = z.strictObject({
  version: MethodologyVersion,
  cadences: z.record(Cadence, LangText),
  indicators: z.array(Indicator).min(1),
})
export type IndicatorsFile = z.infer<typeof IndicatorsFile>

// ---------------------------------------------------------------------------------------------
// categories.yaml

export const Category = z.strictObject({
  id: CategoryId,
  name: LangText,
  short: LangText,
  cap: z.strictObject({ min: z.number(), max: z.number() }),
  /** false for E: computed with its cap and shown, never summed (D-12). */
  scored: z.boolean(),
  experimental: z.boolean(),
  note: LangText.optional(),
})
export type Category = z.infer<typeof Category>

export const CategoriesFile = z.strictObject({
  version: MethodologyVersion,
  /** S = clip(raw, min, max) (docs/02 §7). */
  score_clip: z.strictObject({ min: z.number(), max: z.number() }),
  categories: z.array(Category).min(1),
})
export type CategoriesFile = z.infer<typeof CategoriesFile>

// ---------------------------------------------------------------------------------------------
// bands.yaml

export const Band = z.strictObject({
  id: Key,
  name: LangText,
  /** Inclusive integer bounds on the rounded score. */
  min: z.number().int(),
  max: z.number().int(),
  meaning: LangText,
  illustrative: LangText,
  colour_token: z
    .string()
    .regex(/^--band-[a-z]+$/, 'expected a design token such as --band-passive'),
})
export type Band = z.infer<typeof Band>

export const BandsFile = z.strictObject({
  version: MethodologyVersion,
  rounding: z.literal('half-away-from-zero'),
  /** The band is read from the rounded integer score (docs/02 §7). */
  read_from: z.literal('rounded-score'),
  bands: z.array(Band).min(1),
})
export type BandsFile = z.infer<typeof BandsFile>

// ---------------------------------------------------------------------------------------------
// confidence.yaml

export const ConfidenceLevel = z.strictObject({
  id: Confidence,
  weight: z.number().min(0).max(1),
  label: LangText,
  rule: LangText,
  requires: z.strictObject({
    /** At least one evidence source of one of these kinds (confirmed). */
    any_source_kind: z.array(SourceKind).optional(),
    /** At least this many evidence sources with distinct publishers (corroborated). */
    min_distinct_publishers: z.number().int().min(1).optional(),
    /** Kinds counted towards min_distinct_publishers. */
    publisher_kinds: z.array(SourceKind).optional(),
    /** Shown with a notice on the country page (reported, disputed). */
    flagged: z.boolean().optional(),
    /** An official denial and the counter-evidence are both linked (disputed). */
    both_sides: z.boolean().optional(),
  }),
})
export type ConfidenceLevel = z.infer<typeof ConfidenceLevel>

export const ConfidenceFile = z.strictObject({
  version: MethodologyVersion,
  levels: z.array(ConfidenceLevel).min(1),
})
export type ConfidenceFile = z.infer<typeof ConfidenceFile>

// ---------------------------------------------------------------------------------------------
// decay.yaml

export const DecayFile = z.strictObject({
  version: MethodologyVersion,
  applies_to: z.array(EventType).min(1),
  unit: z.literal('days'),
  /** d(Δ) = 1 for 0 ≤ Δ ≤ plateau_days. */
  plateau_days: z.number().int().positive(),
  /** Linear from 1 after plateau_days to end_weight at end_days; d = 0 for Δ > end_days. */
  end_days: z.number().int().positive(),
  end_weight: z.number().min(0).max(1),
  /** d(Δ) for Δ < 0 (the event has not happened yet). */
  before_event: z.literal(0),
  formula: z.strictObject({ latex: NonEmpty, text: LangText }),
})
export type DecayFile = z.infer<typeof DecayFile>

// ---------------------------------------------------------------------------------------------
// passivity.yaml

export const PassivityFile = z.strictObject({
  version: MethodologyVersion,
  /** Subtracted from raw when the country has no qualifying event. */
  points: z.number().positive(),
  /** A qualifying event's date lies in (t − window_days, t]. */
  window_days: z.number().int().positive(),
  qualifying_indicators: z.array(IndicatorId).min(1),
  /** |p · w · d(t)| of the event at t must be at least this. */
  min_abs_contribution: z.number().nonnegative(),
  statuses: z.array(z.literal('published')).length(1),
  excluded: z.array(z.strictObject({ indicators: z.array(IndicatorId).min(1), reason: LangText })),
  /** Values published in the sensitivity table (docs/02 §10, D-11). */
  sensitivity_points: z.array(z.number().nonnegative()).min(1),
  rule: LangText,
})
export type PassivityFile = z.infer<typeof PassivityFile>

// ---------------------------------------------------------------------------------------------
// thresholds.yaml

/** Evaluated in order; the first tier whose comparison holds gives the points. */
export const ThresholdTier = z.strictObject({
  op: z.enum(['gte', 'gt']),
  value: z.number(),
  points: z.number(),
})
export type ThresholdTier = z.infer<typeof ThresholdTier>

const FormulaCommon = {
  indicator: IndicatorId,
  measure: LangText,
  validity: LangText,
  notes: LangText.optional(),
}

export const Formula = z.discriminatedUnion('kind', [
  /** A1: points = scale × √s, rounded to `decimals`. */
  z.strictObject({
    kind: z.literal('sqrt_share'),
    ...FormulaCommon,
    scale: z.number(),
    decimals: z.number().int().nonnegative(),
    latex: NonEmpty,
    /** Before the first release after the window start, the indicator is no-data for everyone. */
    no_data_before: IsoDate,
  }),
  /** A2, A4, D1: tiers on a measured value. */
  z.strictObject({
    kind: z.literal('tiers'),
    ...FormulaCommon,
    unit: z.enum(['usd', 'tiv', 'percent_of_gni']),
    tiers: z.array(ThresholdTier).min(1),
    otherwise: z.number(),
    parameters: z.record(Key, z.unknown()).optional(),
  }),
  /** C3: tiers apply only when the ratio to the baseline is at least `ratio_min`. */
  z.strictObject({
    kind: z.literal('ratio_gated_tiers'),
    ...FormulaCommon,
    unit: z.literal('usd'),
    baseline_year: z.number().int(),
    ratio_min: z.number().positive(),
    tiers: z.array(ThresholdTier).min(1),
    otherwise: z.number(),
    parameters: z.record(Key, z.unknown()).optional(),
  }),
])
export type Formula = z.infer<typeof Formula>

export const ThresholdsFile = z.strictObject({
  version: MethodologyVersion,
  formulas: z.record(Key, Formula),
})
export type ThresholdsFile = z.infer<typeof ThresholdsFile>

// ---------------------------------------------------------------------------------------------
// votes.yaml (filled in P-14)

export const QualifyingVote = z.strictObject({
  /** A/RES/… or A/DEC/… */
  symbol: z.string().regex(/^A\/(RES|DEC)\/\S+$/, 'expected a GA symbol A/RES/… or A/DEC/…'),
  kind: z.enum(['resolution', 'decision']),
  /** Plenary adoption date. */
  date: IsoDate,
  title: LangText,
  subject: z.enum(['gaza', 'unrwa', 'palestine-status']),
  counts: z.strictObject({
    yes: z.number().int().nonnegative(),
    no: z.number().int().nonnegative(),
    abstain: z.number().int().nonnegative(),
  }),
  draft: z.string().optional(),
  meeting: z.string().optional(),
  undl_record: z.number().int().positive().optional(),
  /** Archived UN press release or record (kind official). */
  source: SourceId,
  /**
   * Verbatim passage of the source stating the adoption and the recorded vote, checked against
   * archive/text/{source}.txt; it is the quote of the press-release evidence of every generated
   * B1 event of this vote.
   */
  quote: NonEmpty,
  /** Where the quote sits in the source (paragraph, page). */
  locator: NonEmpty,
  rationale: LangText,
})
export type QualifyingVote = z.infer<typeof QualifyingVote>

export const VotesFile = z.strictObject({
  version: MethodologyVersion,
  votes: z.array(QualifyingVote),
})
export type VotesFile = z.infer<typeof VotesFile>

// ---------------------------------------------------------------------------------------------
// symmetry.yaml (docs/02 §13)

export const SymmetryPair = z.strictObject({
  negative: z.array(IndicatorId).min(1),
  negative_label: LangText,
  positive: z.array(IndicatorId).min(1),
  positive_label: LangText,
  note: LangText.nullable(),
})
export type SymmetryPair = z.infer<typeof SymmetryPair>

export const SymmetryFile = z.strictObject({
  version: MethodologyVersion,
  pairs: z.array(SymmetryPair).min(1),
  /** Negative indicators with no positive counterpart, each with the reason (spec §8). */
  no_counterpart: z.array(z.strictObject({ indicator: IndicatorId, reason: LangText })),
})
export type SymmetryFile = z.infer<typeof SymmetryFile>

/** Every YAML file of a methodology version and its schema. */
export const METHODOLOGY_FILES = {
  'indicators.yaml': IndicatorsFile,
  'categories.yaml': CategoriesFile,
  'bands.yaml': BandsFile,
  'confidence.yaml': ConfidenceFile,
  'decay.yaml': DecayFile,
  'passivity.yaml': PassivityFile,
  'thresholds.yaml': ThresholdsFile,
  'votes.yaml': VotesFile,
  'symmetry.yaml': SymmetryFile,
} as const

export type MethodologyFileName = keyof typeof METHODOLOGY_FILES
