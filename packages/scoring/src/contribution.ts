/**
 * The contribution of one event at one date (docs/02 §3), before any stacking rule or cap.
 *
 * | type       | contribution at t                                                        |
 * |------------|--------------------------------------------------------------------------|
 * | standing   | p × w for start ≤ t < end (end null = still holds)                        |
 * | repeatable | p × w × d(t − date)                                                       |
 * | computed   | as standing; start and end are the source release dates                  |
 *
 * Only published events scoped to gaza contribute (docs/02 §3, docs/03 §4).
 */
import { type DecayParams, indicatorOf, type ScoringMethodology } from './methodology.js'
import { dayNumber } from './time.js'
import {
  CONFIDENCE_LEVELS,
  type Confidence,
  SCORED_SCOPE,
  SCORING_STATUS,
  type ScoringEvent,
} from './types.js'

/** Variations used by the sensitivity tables (docs/02 §10) and user weights (§9). */
export interface ScoreOptions {
  /** Confidence weights replacing the methodology's (§10.3: reported at 0.2 and 0.6). */
  readonly confidenceWeights?: Partial<Record<Confidence, number>> | undefined
  /** Indicators whose events count 0, as if their points were 0 (§10.4: B9 and B10). */
  readonly excludeIndicators?: readonly string[] | undefined
  /** 'off': d = 1 for every repeatable event from its date on (§10.5). Default 'on'. */
  readonly decay?: 'on' | 'off' | undefined
  /** Passivity points replacing the methodology's (§10.1: 5, 15, 25). */
  readonly passivityPoints?: number | undefined
  /** Category weights w_k ∈ [0, 2] (§9, §10.2). Default 1. */
  readonly weights?: Partial<Record<'A' | 'B' | 'C' | 'D', number>> | undefined
}

/**
 * The decay factor d(Δ) of a repeatable event, Δ in whole days (docs/02 §3):
 * 1 for 0 ≤ Δ ≤ 365; 1 − 0.75·(Δ − 365)/365 for 365 < Δ ≤ 730; 0 for Δ > 730 or Δ < 0.
 */
export function decayFactor(delta: number, decay: DecayParams): number {
  if (!Number.isInteger(delta)) throw new RangeError(`Δ is a whole number of days, got ${delta}`)
  if (delta < 0) return 0
  if (delta <= decay.plateauDays) return 1
  if (delta > decay.endDays) return 0
  return (
    1 - ((1 - decay.endWeight) * (delta - decay.plateauDays)) / (decay.endDays - decay.plateauDays)
  )
}

/** The confidence weight of an event, after any override. */
export function confidenceWeight(
  confidence: Confidence,
  m: ScoringMethodology,
  options: ScoreOptions = {},
): number {
  if (!CONFIDENCE_LEVELS.includes(confidence)) {
    throw new RangeError(`unknown confidence ${JSON.stringify(confidence)}`)
  }
  const w = options.confidenceWeights?.[confidence] ?? m.confidenceWeights[confidence]
  if (!Number.isFinite(w) || w < 0) throw new RangeError(`confidence weight must be ≥ 0, got ${w}`)
  return w
}

export type IneligibleReason = 'not-published' | 'out-of-scope'

/** Why an event cannot score on any date, or null when it can. */
export function ineligibility(event: ScoringEvent): IneligibleReason | null {
  if (event.status !== SCORING_STATUS) return 'not-published'
  if (!event.scope.includes(SCORED_SCOPE)) return 'out-of-scope'
  return null
}

export type TimeReason = 'not-yet' | 'ended' | 'expired'

export interface TimeFactor {
  /** 1 or 0 for standing and computed events, d(Δ) for repeatable ones. */
  readonly factor: number
  /** Why the factor is 0, or null when the event is in force. */
  readonly reason: TimeReason | null
}

/**
 * The time factor of an event on day number `day`, from its start and end day numbers. Standing
 * and computed events hold on [start, end), end exclusive (docs/02 §3); repeatable events decay
 * from their date.
 */
export function timeFactor(
  type: ScoringEvent['type'],
  start: number,
  end: number,
  day: number,
  m: ScoringMethodology,
  decay: 'on' | 'off' = 'on',
): TimeFactor {
  if (day < start) return { factor: 0, reason: 'not-yet' }
  if (type !== 'repeatable' && day >= end) return { factor: 0, reason: 'ended' }
  if (decay === 'off' || !m.decay.appliesTo.includes(type)) return { factor: 1, reason: null }
  const factor = decayFactor(day - start, m.decay)
  return { factor, reason: factor === 0 ? 'expired' : null }
}

/** Day number of an event's end: +∞ when it has none or is repeatable (repeatable events decay). */
export function endDay(event: ScoringEvent): number {
  if (event.type === 'repeatable' || event.end === null || event.end === undefined) {
    return Number.POSITIVE_INFINITY
  }
  return dayNumber(event.end)
}

/**
 * p × w × d of one event at `date` (`YYYY-MM-DD`), before stacking rules and caps; 0 when the
 * event is not published, not scoped to gaza, or not in force at that date.
 */
export function contribution(
  event: ScoringEvent,
  date: string,
  m: ScoringMethodology,
  options: ScoreOptions = {},
): number {
  const ind = indicatorOf(m, event.indicator, event.id)
  if (event.type !== ind.type) {
    throw new Error(`event ${event.id} is ${event.type} but ${ind.id} is ${ind.type}`)
  }
  const weight = confidenceWeight(event.confidence, m, options)
  if (ineligibility(event) !== null) return 0
  if (options.excludeIndicators?.includes(event.indicator)) return 0
  const { factor } = timeFactor(
    event.type,
    dayNumber(event.date),
    endDay(event),
    dayNumber(date),
    m,
    options.decay,
  )
  const value = event.points * weight * factor
  return value === 0 ? 0 : value
}
