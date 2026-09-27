/**
 * The methodology as the engine reads it, compiled from the YAML files of `methodology/vX.Y.Z/`
 * (docs/02 §2–§9). The input types are structural subsets of the file schemas in `@gai/schema`,
 * so a loaded methodology passes straight in; the engine itself imports nothing.
 *
 * Compilation checks what the engine relies on and throws on anything it cannot score
 * unambiguously. The validator (`pnpm validate`) remains the first line of checks.
 */

import { isIsoDate } from './time.js'
import {
  CATEGORY_IDS,
  type CategoryId,
  CONFIDENCE_LEVELS,
  type Confidence,
  type EventType,
  type LangText,
  WINDOW_START,
} from './types.js'

export interface CapInput {
  readonly min: number | null
  readonly max: number | null
}

export interface TierInput {
  readonly key: string
  readonly value: number
}

export type PointsSpecInput =
  | { readonly kind: 'fixed'; readonly value: number }
  | {
      readonly kind: 'per_instance'
      readonly value?: number | undefined
      readonly tiers?: readonly TierInput[] | undefined
    }
  | { readonly kind: 'tiers'; readonly tiers: readonly TierInput[] }
  | {
      readonly kind: 'formula'
      readonly ref: string
      readonly range: { readonly min: number; readonly max: number }
    }

export type StackingRule = 'sum' | 'most_severe' | 'one_per_tier' | 'latest_position'

export interface IndicatorInput {
  readonly id: string
  readonly category: CategoryId
  readonly name: LangText
  readonly type: EventType
  readonly scored: boolean
  readonly points: PointsSpecInput
  readonly indicator_cap: CapInput | null
  readonly stacking: { readonly rule: StackingRule; readonly group?: readonly string[] | undefined }
  readonly superseded_by: readonly string[]
  readonly not_applicable: { readonly rule: 'unsc_non_member' } | null
}

export interface MethodologyFilesInput {
  readonly indicators: { readonly version: string; readonly indicators: readonly IndicatorInput[] }
  readonly categories: {
    readonly score_clip: { readonly min: number; readonly max: number }
    readonly categories: readonly {
      readonly id: CategoryId
      readonly name: LangText
      readonly short: LangText
      readonly cap: { readonly min: number; readonly max: number }
      readonly scored: boolean
    }[]
  }
  readonly bands: {
    readonly bands: readonly {
      readonly id: string
      readonly name: LangText
      readonly min: number
      readonly max: number
    }[]
  }
  readonly confidence: {
    readonly levels: readonly { readonly id: Confidence; readonly weight: number }[]
  }
  readonly decay: {
    readonly applies_to: readonly EventType[]
    readonly plateau_days: number
    readonly end_days: number
    readonly end_weight: number
  }
  readonly passivity: {
    readonly points: number
    readonly window_days: number
    readonly qualifying_indicators: readonly string[]
    readonly min_abs_contribution: number
    readonly statuses: readonly string[]
    readonly sensitivity_points: readonly number[]
  }
  /**
   * thresholds.yaml, read only for `no_data_before` (docs/02 §5: before the first post-war SIPRI
   * release, A1 is no-data for everyone). Optional: without it no indicator has such a date.
   */
  readonly thresholds?:
    | {
        readonly formulas: Readonly<
          Record<string, { readonly indicator: string; readonly no_data_before?: string }>
        >
      }
    | undefined
}

export interface Cap {
  readonly min: number | null
  readonly max: number | null
}

export interface CompiledIndicator {
  readonly id: string
  readonly category: CategoryId
  readonly name: LangText
  readonly type: EventType
  readonly scored: boolean
  /** Indicator-level cap on the summed contributions, applied before the category clip (§2). */
  readonly cap: Cap | null
  readonly stacking: StackingRule
  /** latest_position: the indicators that compete (B5, B6), sorted; [] for other rules. */
  readonly group: readonly string[]
  /** Indicators whose holding standing state sets this one to zero (A6 ← A7). */
  readonly supersededBy: readonly string[]
  readonly notApplicable: 'unsc_non_member' | null
  /** Named per-event values (tiers, or per_instance tiers); [] otherwise. */
  readonly tiers: readonly TierInput[]
  /** Position in indicators.yaml. */
  readonly order: number
}

export interface CompiledCategory {
  readonly id: CategoryId
  readonly name: LangText
  readonly short: LangText
  readonly cap: { readonly min: number; readonly max: number }
  /** false for E: computed and shown, never summed (D-12). */
  readonly scored: boolean
}

export interface CompiledBand {
  readonly id: string
  readonly name: LangText
  /** Inclusive integer bounds on the rounded score. */
  readonly min: number
  readonly max: number
}

export interface DecayParams {
  readonly appliesTo: readonly EventType[]
  /** d(Δ) = 1 for 0 ≤ Δ ≤ plateauDays. */
  readonly plateauDays: number
  /** Linear to endWeight at endDays; 0 beyond. */
  readonly endDays: number
  readonly endWeight: number
}

export interface PassivityParams {
  readonly points: number
  /** A qualifying event is dated in (t − windowDays, t]. */
  readonly windowDays: number
  readonly qualifying: readonly string[]
  readonly minAbsContribution: number
  readonly statuses: readonly string[]
  readonly sensitivityPoints: readonly number[]
}

export interface ScoringMethodology {
  readonly version: string
  readonly windowStart: string
  /** Every indicator, in indicators.yaml order. */
  readonly indicators: readonly CompiledIndicator[]
  readonly indicatorById: ReadonlyMap<string, CompiledIndicator>
  /** Ids of the scored indicators (A1–D5 in v1.0), the coverage denominator (§8). */
  readonly scoredIndicatorIds: readonly string[]
  /** A, B, C, D, E. */
  readonly categories: readonly CompiledCategory[]
  readonly categoryById: ReadonlyMap<CategoryId, CompiledCategory>
  readonly scoreClip: { readonly min: number; readonly max: number }
  /** Sorted by min. */
  readonly bands: readonly CompiledBand[]
  readonly confidenceWeights: Readonly<Record<Confidence, number>>
  readonly decay: DecayParams
  readonly passivity: PassivityParams
  /** Indicator → first date with data; before it the indicator is no-data for everyone (§5, A1). */
  readonly noDataBefore: Readonly<Record<string, string>>
}

/** A Map that cannot be changed after compilation. */
class FrozenMap<K, V> implements ReadonlyMap<K, V> {
  readonly #map: Map<K, V>
  constructor(entries: Iterable<readonly [K, V]>) {
    this.#map = new Map(entries)
    Object.freeze(this)
  }
  get size(): number {
    return this.#map.size
  }
  get(key: K): V | undefined {
    return this.#map.get(key)
  }
  has(key: K): boolean {
    return this.#map.has(key)
  }
  forEach(fn: (value: V, key: K, map: ReadonlyMap<K, V>) => void): void {
    this.#map.forEach((v, k) => {
      fn(v, k, this)
    })
  }
  entries(): MapIterator<[K, V]> {
    return this.#map.entries()
  }
  keys(): MapIterator<K> {
    return this.#map.keys()
  }
  values(): MapIterator<V> {
    return this.#map.values()
  }
  [Symbol.iterator](): MapIterator<[K, V]> {
    return this.#map[Symbol.iterator]()
  }
}

const frozenText = (t: LangText): LangText => Object.freeze({ en: t.en, fr: t.fr })

function fail(message: string): never {
  throw new Error(`compileMethodology: ${message}`)
}

function tiersOf(p: PointsSpecInput): readonly TierInput[] {
  if (p.kind === 'tiers') return p.tiers
  if (p.kind === 'per_instance') return p.tiers ?? []
  return []
}

/** Compiles the methodology files; throws when they cannot be scored unambiguously. */
export function compileMethodology(files: MethodologyFilesInput): ScoringMethodology {
  const categories: CompiledCategory[] = []
  for (const id of CATEGORY_IDS) {
    const found = files.categories.categories.filter((c) => c.id === id)
    if (found.length !== 1) fail(`categories.yaml must list category ${id} exactly once`)
    const c = found[0] as (typeof found)[number]
    if (!(c.cap.min <= 0 && c.cap.max >= 0)) fail(`category ${id} cap must contain 0`)
    // User weights exist for A–D only (§9); scoring E would need them extended first.
    if (id === 'E' && c.scored) fail('category E is scored; this engine sums A–D only (D-12)')
    categories.push(
      Object.freeze({
        id,
        name: frozenText(c.name),
        short: frozenText(c.short),
        cap: Object.freeze({ ...c.cap }),
        scored: c.scored,
      }),
    )
  }
  const categoryById = new FrozenMap(categories.map((c) => [c.id, c] as const))

  const indicators: CompiledIndicator[] = []
  const seen = new Set<string>()
  files.indicators.indicators.forEach((ind, order) => {
    if (seen.has(ind.id)) fail(`indicator ${ind.id} is listed twice`)
    seen.add(ind.id)
    const category = categoryById.get(ind.category)
    if (category === undefined) fail(`indicator ${ind.id} names unknown category ${ind.category}`)
    if (category.scored && !ind.scored) {
      fail(`indicator ${ind.id} is unscored in scored category ${category.id}; not supported`)
    }
    if (!category.scored && ind.scored) {
      fail(`indicator ${ind.id} is scored in unscored category ${category.id}; not supported`)
    }
    const rule = ind.stacking.rule
    const group = rule === 'latest_position' ? [...(ind.stacking.group ?? [])].sort() : []
    if (rule === 'latest_position' && !group.includes(ind.id)) {
      fail(`indicator ${ind.id} stacks latest_position with a group that does not include it`)
    }
    const tiers = tiersOf(ind.points)
    if (rule === 'one_per_tier' && tiers.length === 0) {
      fail(`indicator ${ind.id} stacks one_per_tier without tiers`)
    }
    indicators.push(
      Object.freeze({
        id: ind.id,
        category: ind.category,
        name: frozenText(ind.name),
        type: ind.type,
        scored: ind.scored,
        cap: ind.indicator_cap === null ? null : Object.freeze({ ...ind.indicator_cap }),
        stacking: rule,
        group: Object.freeze(group),
        supersededBy: Object.freeze([...ind.superseded_by]),
        notApplicable: ind.not_applicable?.rule ?? null,
        tiers: Object.freeze(tiers.map((t) => Object.freeze({ key: t.key, value: t.value }))),
        order,
      }),
    )
  })
  const indicatorById = new FrozenMap(indicators.map((i) => [i.id, i] as const))
  for (const ind of indicators) {
    for (const id of [...ind.supersededBy, ...ind.group]) {
      if (!indicatorById.has(id)) fail(`indicator ${ind.id} refers to unknown indicator ${id}`)
    }
    for (const id of ind.group) {
      const other = indicatorById.get(id)
      if (other?.stacking !== 'latest_position' || other.group.join() !== ind.group.join()) {
        fail(`latest_position group of ${ind.id} disagrees with ${id}`)
      }
    }
  }

  const bands = [...files.bands.bands]
    .map((b) => Object.freeze({ id: b.id, name: frozenText(b.name), min: b.min, max: b.max }))
    .sort((a, b) => a.min - b.min)
  bands.forEach((b, i) => {
    if (!Number.isInteger(b.min) || !Number.isInteger(b.max) || b.min > b.max) {
      fail(`band ${b.id} must have integer bounds min ≤ max`)
    }
    const prev = bands[i - 1]
    if (prev !== undefined && b.min !== prev.max + 1) {
      fail(`bands ${prev.id} and ${b.id} leave a gap or overlap`)
    }
  })
  const clipMin = files.categories.score_clip.min
  const clipMax = files.categories.score_clip.max
  if (bands[0]?.min !== clipMin || bands.at(-1)?.max !== clipMax) {
    fail(`bands must cover the score range ${clipMin}…${clipMax}`)
  }

  const weights = {} as Record<Confidence, number>
  for (const level of CONFIDENCE_LEVELS) {
    const found = files.confidence.levels.filter((l) => l.id === level)
    if (found.length !== 1) fail(`confidence.yaml must list ${level} exactly once`)
    const w = (found[0] as (typeof found)[number]).weight
    if (!(w >= 0 && w <= 1)) fail(`confidence weight of ${level} must lie in [0, 1]`)
    weights[level] = w
  }

  const d = files.decay
  if (!(Number.isInteger(d.plateau_days) && Number.isInteger(d.end_days) && d.plateau_days >= 0)) {
    fail('decay plateau_days and end_days must be whole days')
  }
  if (d.end_days <= d.plateau_days) fail('decay end_days must exceed plateau_days')

  const p = files.passivity
  for (const id of p.qualifying_indicators) {
    if (!indicatorById.has(id)) fail(`passivity qualifies unknown indicator ${id}`)
  }
  if (!Number.isInteger(p.window_days) || p.window_days <= 0) {
    fail('passivity window_days must be a positive whole number')
  }

  const noDataBefore: Record<string, string> = {}
  for (const f of Object.values(files.thresholds?.formulas ?? {})) {
    if (f.no_data_before === undefined) continue
    if (!indicatorById.has(f.indicator)) fail(`thresholds name unknown indicator ${f.indicator}`)
    if (!isIsoDate(f.no_data_before)) fail(`no_data_before of ${f.indicator} is not a date`)
    noDataBefore[f.indicator] = f.no_data_before
  }

  return Object.freeze({
    version: files.indicators.version,
    windowStart: WINDOW_START,
    indicators: Object.freeze(indicators),
    indicatorById,
    scoredIndicatorIds: Object.freeze(indicators.filter((i) => i.scored).map((i) => i.id)),
    categories: Object.freeze(categories),
    categoryById,
    scoreClip: Object.freeze({ min: clipMin, max: clipMax }),
    bands: Object.freeze(bands),
    confidenceWeights: Object.freeze(weights),
    decay: Object.freeze({
      appliesTo: Object.freeze([...d.applies_to]),
      plateauDays: d.plateau_days,
      endDays: d.end_days,
      endWeight: d.end_weight,
    }),
    passivity: Object.freeze({
      points: p.points,
      windowDays: p.window_days,
      qualifying: Object.freeze([...p.qualifying_indicators]),
      minAbsContribution: p.min_abs_contribution,
      statuses: Object.freeze([...p.statuses]),
      sensitivityPoints: Object.freeze([...p.sensitivity_points]),
    }),
    noDataBefore: Object.freeze(noDataBefore),
  })
}

/** The indicator, or a thrown error naming the event that refers to it. */
export function indicatorOf(
  m: ScoringMethodology,
  id: string,
  eventId?: string,
): CompiledIndicator {
  const ind = m.indicatorById.get(id)
  if (ind === undefined) {
    throw new Error(
      `indicator ${id}${eventId === undefined ? '' : ` (event ${eventId})`} is not in methodology ${m.version}`,
    )
  }
  return ind
}

/**
 * The parts of the methodology that combine a country's published subtotals into S (docs/02 §7,
 * §9): the categories, the final clip and the bands. The site recomputes S with reader weights in
 * the browser from these alone, without the indicators.
 */
export type CombineModel = Pick<ScoringMethodology, 'categories' | 'scoreClip' | 'bands'>

/** The band whose inclusive range holds the rounded score (docs/02 §7). */
export function bandFor(m: Pick<ScoringMethodology, 'bands'>, display: number): CompiledBand {
  if (!Number.isInteger(display))
    throw new RangeError(`the band is read from an integer, got ${display}`)
  const band = m.bands.find((b) => display >= b.min && display <= b.max)
  if (band === undefined) throw new RangeError(`no band holds ${display}`)
  return band
}
