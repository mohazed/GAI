/**
 * Points of the computed indicators (docs/02 §5), from the formulas in thresholds.yaml. The
 * generators of P-04 call these to set the `points` of A1, A2, A4, C3 and D1 events; the engine
 * then scores those events like any standing state valid from one release to the next (§3).
 */
import { roundHalfAwayFromZero } from './numeric.js'

export interface ThresholdTierInput {
  readonly op: 'gte' | 'gt'
  readonly value: number
  readonly points: number
}

export type FormulaInput =
  | {
      readonly kind: 'sqrt_share'
      readonly scale: number
      readonly decimals: number
    }
  | {
      readonly kind: 'tiers'
      readonly tiers: readonly ThresholdTierInput[]
      readonly otherwise: number
    }
  | {
      readonly kind: 'ratio_gated_tiers'
      readonly ratio_min: number
      readonly tiers: readonly ThresholdTierInput[]
      readonly otherwise: number
    }

/** A1: scale × √s, rounded half away from zero to `decimals` places; s ∈ [0, 1]. */
export function sqrtSharePoints(share: number, scale: number, decimals: number): number {
  if (!(share >= 0 && share <= 1)) throw new RangeError(`share must lie in [0, 1], got ${share}`)
  return roundHalfAwayFromZero(scale * Math.sqrt(share), decimals)
}

/** The first tier whose comparison holds, else `otherwise` (A2, A4, D1 and C3's tiers). */
export function tierPoints(
  measure: number,
  tiers: readonly ThresholdTierInput[],
  otherwise: number,
): number {
  if (!Number.isFinite(measure) || measure < 0) {
    throw new RangeError(`the measure must be a finite value ≥ 0, got ${measure}`)
  }
  for (const t of tiers) {
    if (t.op === 'gte' ? measure >= t.value : measure > t.value) return t.points
  }
  return otherwise
}

/**
 * C3: the tiers on T apply only when r = T / T(2022) ≥ ratio_min; a drop below the ratio scores
 * `otherwise` (a drop is not rewarded here, only a decision is, via C1). A baseline of 0 with
 * trade now counts as a rise (r = ∞); no trade in either period scores `otherwise`.
 */
export function ratioGatedTierPoints(
  total: number,
  baseline: number,
  ratioMin: number,
  tiers: readonly ThresholdTierInput[],
  otherwise: number,
): number {
  if (!Number.isFinite(total) || total < 0) {
    throw new RangeError(`the total must be a finite value ≥ 0, got ${total}`)
  }
  if (!Number.isFinite(baseline) || baseline < 0) {
    throw new RangeError(`the baseline must be a finite value ≥ 0, got ${baseline}`)
  }
  if (total === 0 && baseline === 0) return otherwise
  const ratio = baseline === 0 ? Number.POSITIVE_INFINITY : total / baseline
  return ratio >= ratioMin ? tierPoints(total, tiers, otherwise) : otherwise
}

/**
 * D1: x = F / GNI expressed in percent, the unit of the D1 tiers (0.0100 % is written 0.01).
 * Computed as (F · 100) / GNI, one correctly rounded division of integers, so a value exactly on
 * a tier boundary compares equal to it.
 */
export function percentOfGni(funding: number, gni: number): number {
  if (!Number.isFinite(funding) || funding < 0)
    throw new RangeError(`funding must be ≥ 0, got ${funding}`)
  if (!Number.isFinite(gni) || gni <= 0) throw new RangeError(`GNI must be > 0, got ${gni}`)
  return (funding * 100) / gni
}

/** Points of a computed indicator from its measure (s for A1, V/TIV/x for tiers, T for C3). */
export function formulaPoints(formula: FormulaInput, measure: number, baseline?: number): number {
  switch (formula.kind) {
    case 'sqrt_share':
      return sqrtSharePoints(measure, formula.scale, formula.decimals)
    case 'tiers':
      return tierPoints(measure, formula.tiers, formula.otherwise)
    case 'ratio_gated_tiers':
      if (baseline === undefined) throw new RangeError('ratio_gated_tiers needs the baseline')
      return ratioGatedTierPoints(
        measure,
        baseline,
        formula.ratio_min,
        formula.tiers,
        formula.otherwise,
      )
  }
}
