/**
 * The score of one country at one date (docs/02 §2, §6, §7):
 *
 *   sub_k(c,t)  = Σ_e∈k p_e · w_e · d_e(t)     after the stacking rules and indicator-level caps
 *   clip_k(c,t) = clip(sub_k, cap_k⁻, cap_k⁺)   for k ∈ {A, B, C, D}; E computed, never summed
 *   raw(c,t)    = Σ_k clip_k − passivity(c,t)
 *   S(c,t)      = clip(raw, −100, +100)
 *
 * Order of operations at date t, per country:
 * 1. Each event's own contribution p · w · d(t) (contribution.ts); events that are not published,
 *    not scoped to gaza or not in force are set aside with the reason.
 * 2. superseded_by: an indicator is zeroed while a standing state of an indicator that supersedes
 *    it holds (A6 while A7 holds).
 * 3. latest_position: among the events in force of a group (B5, B6), only the one with the latest
 *    date counts; on the same date, the greater id.
 * 4. Per indicator: `sum` adds; `most_severe` keeps the event with the largest |points| (ties:
 *    larger |p · w|, then earlier date, then smaller id); `one_per_tier` keeps one event per tier
 *    (largest |p · w|, then earlier date, then smaller id) and adds the tiers (B11).
 * 5. The indicator-level cap bounds the indicator's sum; the category cap bounds the category's.
 * 6. Passivity (§6) from the events' own contributions of step 1.
 * 7. S, then S rounded half away from zero to one decimal (`score`) and to an integer (`display`),
 *    and the band read from `display`.
 */
import {
  confidenceWeight,
  endDay,
  type IneligibleReason,
  ineligibility,
  type ScoreOptions,
  type TimeReason,
  timeFactor,
} from './contribution.js'
import {
  bandFor,
  type Cap,
  type CombineModel,
  type CompiledIndicator,
  indicatorOf,
  type ScoringMethodology,
} from './methodology.js'
import { atLeast, clip, nearlyEqual, roundHalfAwayFromZero, snap, sum } from './numeric.js'
import { dayNumber, isoDate } from './time.js'
import type { CategoryId, Confidence, EventType, ScoringEvent } from './types.js'

export type EventReason =
  | 'counted'
  | IneligibleReason
  | TimeReason
  | 'excluded'
  | 'superseded'
  | 'earlier-position'
  | 'less-severe'
  | 'same-tier'

export interface EventEvaluation {
  readonly id: string
  readonly indicator: string
  readonly category: CategoryId
  readonly type: EventType
  readonly date: string
  readonly end: string | null
  /** Points as recorded on the event. */
  readonly points: number
  readonly confidence: Confidence
  readonly weight: number
  /** 1 or 0 for standing and computed events, d(Δ) for repeatable ones. */
  readonly factor: number
  /** The event's own contribution p · w · d(t) (docs/02 §3); 0 when it cannot score. */
  readonly value: number
  /** What the event adds to its indicator after the stacking rules, before the indicator cap. */
  readonly counted: number
  readonly reason: EventReason
  /** For superseded, earlier-position, less-severe and same-tier: the event that counts instead. */
  readonly by: string | null
  /** Counts as a qualifying event for the passivity rule at this date (§6). */
  readonly qualifies: boolean
}

export interface IndicatorResult {
  readonly id: string
  readonly category: CategoryId
  /** Sum of the counted contributions. */
  readonly raw: number
  /** raw bounded by the indicator-level cap. */
  readonly value: number
  readonly cap: Cap | null
  readonly capped: boolean
  /** Ids of the events that count. */
  readonly counted: readonly string[]
}

export interface CategoryResult {
  readonly id: CategoryId
  /** Sum of the indicator values (after indicator-level caps). */
  readonly raw: number
  /** raw bounded by the category cap. */
  readonly clipped: number
  readonly cap: { readonly min: number; readonly max: number }
  readonly capped: boolean
  /** false for E: shown, never summed (D-12). */
  readonly scored: boolean
  /** w_k (§9); 1 by default, and for E, which is never summed. */
  readonly weight: number
}

export interface PassivityResult {
  /** No qualifying event in the trailing window. */
  readonly applied: boolean
  /** The penalty's size, applied or not. */
  readonly points: number
  /** What is subtracted: points when applied, else 0. */
  readonly value: number
  /** Ids of the qualifying events, by date then id. */
  readonly qualifying: readonly string[]
}

export interface Combined {
  /** Σ_k w_k · clip_k − passivity, before the final clip. */
  readonly raw: number
  /** S in full precision. */
  readonly exact: number
  /** S rounded half away from zero to one decimal (§14 `score`). */
  readonly score: number
  /** S rounded half away from zero to an integer (§14 `score_display`). */
  readonly display: number
  /** Band id, read from `display`. */
  readonly band: string
}

export interface CountryScore extends Combined {
  readonly country: string
  readonly date: string
  readonly methodology: string
  readonly passivity: PassivityResult
  readonly categories: Readonly<Record<CategoryId, CategoryResult>>
  /** Indicators with at least one event of the country, in methodology order. */
  readonly indicators: readonly IndicatorResult[]
  /** Every event of the country, by date then id. */
  readonly events: readonly EventEvaluation[]
}

export type CategoryWeights = Readonly<Record<'A' | 'B' | 'C' | 'D', number>>

export const DEFAULT_WEIGHTS: CategoryWeights = Object.freeze({ A: 1, B: 1, C: 1, D: 1 })

/** Checked weights w_k ∈ [0, 2] (§9), missing ones at 1. */
export function resolveWeights(
  weights?: Partial<Record<'A' | 'B' | 'C' | 'D', number>>,
): CategoryWeights {
  const out = { ...DEFAULT_WEIGHTS }
  for (const k of ['A', 'B', 'C', 'D'] as const) {
    const w = weights?.[k]
    if (w === undefined) continue
    if (!Number.isFinite(w) || w < 0 || w > 2) {
      throw new RangeError(`weight ${k} must lie in [0, 2], got ${w}`)
    }
    out[k] = w
  }
  return out
}

/**
 * S from the clipped category subtotals and the passivity value (§7, §9):
 * clip(Σ_k w_k · clip_k − passivity, −100, +100), rounded and banded.
 */
export function combine(
  clipped: Readonly<Record<'A' | 'B' | 'C' | 'D', number>>,
  passivityValue: number,
  m: CombineModel,
  weights?: Partial<Record<'A' | 'B' | 'C' | 'D', number>>,
): Combined {
  if (!Number.isFinite(passivityValue) || passivityValue < 0) {
    throw new RangeError(`passivity must be ≥ 0, got ${passivityValue}`)
  }
  const w = resolveWeights(weights)
  const terms: number[] = []
  for (const c of m.categories) {
    // E is never summed (compileMethodology refuses a methodology that scores it).
    if (!c.scored || c.id === 'E') continue
    terms.push(w[c.id] * clipped[c.id])
  }
  const raw = snap(sum(terms) - passivityValue)
  const exact = clip(raw, m.scoreClip.min, m.scoreClip.max)
  const display = roundHalfAwayFromZero(exact, 0)
  return {
    raw: raw === 0 ? 0 : raw,
    exact,
    score: roundHalfAwayFromZero(exact, 1),
    display,
    band: bandFor(m, display).id,
  }
}

interface Prepared {
  readonly event: ScoringEvent
  readonly ind: CompiledIndicator
  readonly start: number
  readonly end: number
  readonly weight: number
  readonly ineligible: IneligibleReason | null
  readonly excluded: boolean
  readonly qualifyingIndicator: boolean
}

interface Working {
  readonly p: Prepared
  readonly factor: number
  readonly value: number
  reason: EventReason
  by: string | null
}

function compareIds(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0
}

/** Scores one country on any date, from its events prepared once. */
export interface CountryScorer {
  readonly country: string
  readonly methodology: ScoringMethodology
  readonly options: ScoreOptions
  /** Score at a `YYYY-MM-DD` date. */
  at(date: string): CountryScore
  /** Score at a day number (time.ts). */
  atDay(day: number): CountryScore
  /**
   * Day numbers on which an event can change the score by a step: a start, a standing or computed
   * end, a repeatable event leaving the score (Δ = end_days + 1), a qualifying event leaving the
   * passivity window. Sorted, unique.
   */
  transitionDays(): readonly number[]
  /** The events of each transition day, with what happens to them (a fresh array each call). */
  transitionsOn(day: number): readonly Transition[]
  /**
   * The score at `day` with the events in `held` evaluated as on the day before (their time
   * factor and their passivity window read at day − 1): what the score would have been had their
   * step not happened. Used to attribute a change to its cause (series.ts lastChange).
   */
  counterfactual(day: number, held: readonly string[]): CountryScore
}

export interface Transition {
  readonly id: string
  readonly indicator: string
  readonly kind: 'start' | 'end' | 'expire' | 'leaves-passivity-window'
}

/** A frozen copy of the options, so that a caller changing its object later changes nothing. */
function snapshotOptions(options: ScoreOptions): ScoreOptions {
  const out: {
    -readonly [K in keyof ScoreOptions]: ScoreOptions[K]
  } = { decay: options.decay ?? 'on' }
  if (options.confidenceWeights !== undefined) {
    out.confidenceWeights = Object.freeze({ ...options.confidenceWeights })
  }
  if (options.excludeIndicators !== undefined) {
    out.excludeIndicators = Object.freeze([...options.excludeIndicators])
  }
  if (options.passivityPoints !== undefined) out.passivityPoints = options.passivityPoints
  if (options.weights !== undefined) out.weights = Object.freeze({ ...options.weights })
  return Object.freeze(out)
}

/**
 * Throws when two computed values of one indicator would hold on the same day: a computed value
 * is valid from its release to the next release (docs/02 §3), so exactly one holds at a time and
 * `sum` stacking must never add two of them.
 */
function assertNoComputedOverlap(prepared: readonly Prepared[]): void {
  const byIndicator = new Map<string, Prepared[]>()
  for (const p of prepared) {
    if (p.event.type !== 'computed' || p.ineligible !== null) continue
    const list = byIndicator.get(p.ind.id)
    if (list) list.push(p)
    else byIndicator.set(p.ind.id, [p])
  }
  for (const list of byIndicator.values()) {
    for (let i = 1; i < list.length; i++) {
      const a = list[i - 1] as Prepared
      const b = list[i] as Prepared
      if (a.end > b.start) {
        throw new Error(
          `computed events ${a.event.id} and ${b.event.id} of ${a.ind.id} overlap: a computed value ends where the next release starts (docs/02 §3)`,
        )
      }
    }
  }
}

/**
 * Prepares the events of `country` (others are ignored) for scoring on any date. Throws on an
 * unknown indicator, a type that differs from the indicator's, an unknown confidence, an invalid
 * date, a duplicate id, or two computed values of one indicator that overlap.
 *
 * A standing or computed state dated before the window start counts from the window start
 * (docs/02 §2, B8: "pre-existing recognition is a standing state from 2023-10-07"); this is also
 * the date its passivity window runs from. Repeatable events keep their date.
 */
export function createScorer(
  country: string,
  events: readonly ScoringEvent[],
  m: ScoringMethodology,
  options: ScoreOptions = {},
): CountryScorer {
  const opts = snapshotOptions(options)
  const qualifyingSet = new Set(m.passivity.qualifying)
  const excludedSet = new Set(opts.excludeIndicators ?? [])
  const windowStart = dayNumber(m.windowStart)
  const ids = new Set<string>()
  const prepared: Prepared[] = []
  for (const event of events) {
    if (event.country !== country) continue
    if (ids.has(event.id)) throw new Error(`duplicate event id ${event.id}`)
    ids.add(event.id)
    const ind = indicatorOf(m, event.indicator, event.id)
    if (event.type !== ind.type) {
      throw new Error(`event ${event.id} is ${event.type} but ${ind.id} is ${ind.type}`)
    }
    if (!Number.isFinite(event.points))
      throw new RangeError(`event ${event.id} has no finite points`)
    const date = dayNumber(event.date)
    prepared.push({
      event,
      ind,
      start: event.type === 'repeatable' ? date : Math.max(date, windowStart),
      end: endDay(event),
      weight: confidenceWeight(event.confidence, m, opts),
      ineligible: ineligibility(event),
      excluded: excludedSet.has(ind.id),
      qualifyingIndicator:
        qualifyingSet.has(ind.id) &&
        m.passivity.statuses.includes(event.status) &&
        !(m.passivity.excludedPoints[ind.id] ?? []).includes(event.points),
    })
  }
  // Indicator order, then date, then id: sums never depend on the order of the input.
  prepared.sort(
    (a, b) => a.ind.order - b.ind.order || a.start - b.start || compareIds(a.event.id, b.event.id),
  )
  assertNoComputedOverlap(prepared)
  const passivityPoints = opts.passivityPoints ?? m.passivity.points
  if (!Number.isFinite(passivityPoints) || passivityPoints < 0) {
    throw new RangeError(`passivity points must be ≥ 0, got ${passivityPoints}`)
  }
  const weights = resolveWeights(opts.weights)

  const atDay = (day: number): CountryScore =>
    evaluate(country, prepared, day, m, opts, passivityPoints, weights, null)

  let transitions: Map<number, Transition[]> | null = null
  const transitionMap = (): Map<number, Transition[]> => {
    if (transitions !== null) return transitions
    const map = new Map<number, Transition[]>()
    const add = (day: number, t: Transition) => {
      const list = map.get(day)
      if (list) list.push(t)
      else map.set(day, [t])
    }
    for (const p of prepared) {
      if (p.ineligible !== null) continue
      const { id, indicator, type } = p.event
      add(p.start, { id, indicator, kind: 'start' })
      if (type !== 'repeatable' && Number.isFinite(p.end))
        add(p.end, { id, indicator, kind: 'end' })
      if (type === 'repeatable' && opts.decay !== 'off' && m.decay.appliesTo.includes(type)) {
        add(p.start + m.decay.endDays + 1, { id, indicator, kind: 'expire' })
      }
      if (p.qualifyingIndicator) {
        add(p.start + m.passivity.windowDays, { id, indicator, kind: 'leaves-passivity-window' })
      }
    }
    for (const list of map.values()) {
      list.sort((a, b) => compareIds(a.id, b.id) || compareIds(a.kind, b.kind))
      for (const t of list) Object.freeze(t)
    }
    transitions = map
    return map
  }

  return Object.freeze({
    country,
    methodology: m,
    options: opts,
    at: (date: string) => atDay(dayNumber(date)),
    atDay,
    transitionDays: () => [...transitionMap().keys()].sort((a, b) => a - b),
    transitionsOn: (day: number) => [...(transitionMap().get(day) ?? [])],
    counterfactual: (day: number, held: readonly string[]) =>
      evaluate(country, prepared, day, m, opts, passivityPoints, weights, new Set(held)),
  })
}

/** The score of `country` at `date` (`YYYY-MM-DD`) from its events. */
export function scoreCountry(
  country: string,
  events: readonly ScoringEvent[],
  date: string,
  m: ScoringMethodology,
  options: ScoreOptions = {},
): CountryScore {
  return createScorer(country, events, m, options).at(date)
}

/** Picks the winner of `list` by `better` (true when a beats b) and marks the others. */
function keepOne(
  list: Working[],
  better: (a: Working, b: Working) => boolean,
  reason: EventReason,
) {
  let winner: Working | undefined
  for (const w of list) if (winner === undefined || better(w, winner)) winner = w
  if (winner === undefined) return
  for (const w of list) {
    if (w === winner) continue
    w.reason = reason
    w.by = winner.p.event.id
  }
}

/** Tier key of an event's points; points outside every tier form their own tier. */
function tierKey(ind: CompiledIndicator, points: number): string {
  return ind.tiers.find((t) => t.value === points)?.key ?? `points:${points}`
}

/** a before b on (earlier date, smaller id). */
function earlier(a: Working, b: Working): boolean {
  return (
    a.p.start < b.p.start || (a.p.start === b.p.start && compareIds(a.p.event.id, b.p.event.id) < 0)
  )
}

function evaluate(
  country: string,
  prepared: readonly Prepared[],
  day: number,
  m: ScoringMethodology,
  options: ScoreOptions,
  passivityPoints: number,
  weights: CategoryWeights,
  held: ReadonlySet<string> | null,
): CountryScore {
  /** The day an event is read at: the day before for a held event (counterfactual). */
  const dayOf = (p: Prepared) => (held?.has(p.event.id) ? day - 1 : day)
  // 1. Own contributions.
  const work: Working[] = prepared.map((p) => {
    const tf = timeFactor(p.event.type, p.start, p.end, dayOf(p), m, options.decay)
    const inForce = p.ineligible === null && tf.reason === null
    const value = inForce && !p.excluded ? p.event.points * p.weight * tf.factor : 0
    const reason: EventReason = p.ineligible ?? tf.reason ?? (p.excluded ? 'excluded' : 'counted')
    return { p, factor: tf.factor, value: value === 0 ? 0 : value, reason, by: null }
  })
  const candidates = work.filter((w) => w.reason === 'counted')

  // 2. superseded_by (A6 while A7 holds).
  const holdingByIndicator = new Map<string, Working>()
  for (const w of candidates) {
    const current = holdingByIndicator.get(w.p.ind.id)
    if (current === undefined || earlier(w, current)) holdingByIndicator.set(w.p.ind.id, w)
  }
  for (const w of candidates) {
    for (const id of w.p.ind.supersededBy) {
      const holder = holdingByIndicator.get(id)
      if (holder !== undefined) {
        w.reason = 'superseded'
        w.by = holder.p.event.id
        break
      }
    }
  }

  // 3. latest_position groups (B5, B6).
  const groups = new Map<string, Working[]>()
  for (const w of candidates) {
    if (w.reason !== 'counted' || w.p.ind.stacking !== 'latest_position') continue
    const key = w.p.ind.group.join(',')
    const list = groups.get(key)
    if (list) list.push(w)
    else groups.set(key, [w])
  }
  for (const list of groups.values()) {
    keepOne(
      list,
      (a, b) =>
        a.p.start > b.p.start ||
        (a.p.start === b.p.start && compareIds(a.p.event.id, b.p.event.id) > 0),
      'earlier-position',
    )
  }

  // 4. Stacking within each indicator.
  const byIndicator = new Map<string, Working[]>()
  for (const w of candidates) {
    if (w.reason !== 'counted') continue
    const list = byIndicator.get(w.p.ind.id)
    if (list) list.push(w)
    else byIndicator.set(w.p.ind.id, [w])
  }
  for (const list of byIndicator.values()) {
    const ind = (list[0] as Working).p.ind
    if (ind.stacking === 'most_severe') {
      keepOne(
        list,
        (a, b) => {
          const pa = Math.abs(a.p.event.points)
          const pb = Math.abs(b.p.event.points)
          if (pa !== pb) return pa > pb
          const va = Math.abs(a.value)
          const vb = Math.abs(b.value)
          if (!nearlyEqual(va, vb)) return va > vb
          return earlier(a, b)
        },
        'less-severe',
      )
    } else if (ind.stacking === 'one_per_tier') {
      const tiers = new Map<string, Working[]>()
      for (const w of list) {
        const key = tierKey(ind, w.p.event.points)
        const t = tiers.get(key)
        if (t) t.push(w)
        else tiers.set(key, [w])
      }
      for (const t of tiers.values()) {
        keepOne(
          t,
          (a, b) => {
            const va = Math.abs(a.value)
            const vb = Math.abs(b.value)
            if (!nearlyEqual(va, vb)) return va > vb
            return earlier(a, b)
          },
          'same-tier',
        )
      }
    }
  }

  // 5. Indicator caps, then category caps.
  const indicatorResults: IndicatorResult[] = []
  const indicatorValues = new Map<string, number>()
  let current: { ind: CompiledIndicator; items: Working[] } | null = null
  const flush = () => {
    if (current === null) return
    const counted = current.items.filter((w) => w.reason === 'counted')
    // Sums are snapped to the 1e-9 grid (numeric.ts), so that a sum equal to a cap on paper is
    // not reported as capped because of binary noise.
    const raw = snap(sum(counted.map((w) => w.value)))
    const cap = current.ind.cap
    const value = cap === null ? raw : clip(raw, cap.min, cap.max)
    indicatorValues.set(current.ind.id, value)
    indicatorResults.push({
      id: current.ind.id,
      category: current.ind.category,
      raw,
      value,
      cap: cap === null ? null : { ...cap },
      capped: value !== raw,
      counted: counted.map((w) => w.p.event.id),
    })
  }
  for (const w of work) {
    if (current === null || current.ind !== w.p.ind) {
      flush()
      current = { ind: w.p.ind, items: [] }
    }
    current.items.push(w)
  }
  flush()

  const categories = {} as Record<CategoryId, CategoryResult>
  const clipped = {} as Record<'A' | 'B' | 'C' | 'D', number>
  for (const c of m.categories) {
    const values = indicatorResults.filter((r) => r.category === c.id).map((r) => r.value)
    const raw = snap(sum(values))
    const cl = clip(raw, c.cap.min, c.cap.max)
    const weight = c.id === 'E' ? 1 : weights[c.id]
    categories[c.id] = {
      id: c.id,
      raw,
      clipped: cl,
      cap: { ...c.cap },
      capped: cl !== raw,
      scored: c.scored,
      weight,
    }
    if (c.id !== 'E') clipped[c.id] = cl
  }

  // 6. Passivity (§6): a published event of a qualifying indicator (not of an excluded tier)
  // dated in (t − window, t] whose own weighted contribution at t is at least
  // min_abs_contribution: in absolute value (sign `any`, 1.0.0-rc.1), or as a positive value
  // (sign `positive`, 1.0.0-rc.2: a negative act never lifts the penalty, B-46).
  const qualifying = work.filter(
    (w) =>
      w.p.qualifyingIndicator &&
      w.p.ineligible === null &&
      w.p.start <= dayOf(w.p) &&
      w.p.start > dayOf(w.p) - m.passivity.windowDays &&
      atLeast(
        m.passivity.sign === 'positive' ? w.value : Math.abs(w.value),
        m.passivity.minAbsContribution,
      ),
  )
  const qualifyingIds = new Set(qualifying.map((w) => w.p.event.id))
  const applied = qualifying.length === 0
  const passivity: PassivityResult = {
    applied,
    points: passivityPoints,
    value: applied ? passivityPoints : 0,
    qualifying: [...qualifying]
      .sort((a, b) => a.p.start - b.p.start || compareIds(a.p.event.id, b.p.event.id))
      .map((w) => w.p.event.id),
  }

  // 7. S.
  const combined = combine(clipped, passivity.value, m, weights)

  const evaluations: EventEvaluation[] = work
    .map((w) => ({
      id: w.p.event.id,
      indicator: w.p.ind.id,
      category: w.p.ind.category,
      type: w.p.event.type,
      date: w.p.event.date,
      end: w.p.event.type === 'repeatable' ? null : (w.p.event.end ?? null),
      points: w.p.event.points,
      confidence: w.p.event.confidence,
      weight: w.p.weight,
      factor: w.factor,
      value: w.value,
      counted: w.reason === 'counted' ? w.value : 0,
      reason: w.reason,
      by: w.by,
      qualifies: qualifyingIds.has(w.p.event.id),
    }))
    .sort((a, b) => compareIds(a.date, b.date) || compareIds(a.id, b.id))

  return {
    country,
    date: isoDate(day),
    methodology: m.version,
    ...combined,
    passivity,
    categories,
    indicators: indicatorResults,
    events: evaluations,
  }
}
