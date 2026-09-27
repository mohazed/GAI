/**
 * User-adjustable weights (docs/02 §9):
 *
 *   S_user = clip(Σ_k w_k · clip_k − passivity, −100, 100),  w_k ∈ [0, 2], default 1
 *
 * computed from the published clip_k values and passivity flag; the URL encodes the weights as
 * `?w=A,B,C,D` with one-decimal values.
 */
import type { CombineModel } from './methodology.js'
import { roundHalfAwayFromZero } from './numeric.js'
import {
  type CategoryWeights,
  type Combined,
  combine,
  DEFAULT_WEIGHTS,
  resolveWeights,
} from './score.js'
import type { CategoryId } from './types.js'

export interface PublishedCategories {
  readonly categories: Readonly<Record<CategoryId, { readonly clipped: number }>>
  readonly passivity: { readonly value: number }
}

/**
 * S_user from a country's published subtotals and passivity (§9). At the default weights it
 * reproduces the published score, display and band exactly only when `clipped` is given at full
 * precision: rounding each subtotal to one decimal first can move S across a half. Publish the
 * clipped subtotals at full precision wherever a client recomputes S_user (P-05).
 */
export function userScore(
  published: PublishedCategories,
  weights: Partial<Record<'A' | 'B' | 'C' | 'D', number>>,
  m: CombineModel,
): Combined {
  const c = published.categories
  return combine(
    { A: c.A.clipped, B: c.B.clipped, C: c.C.clipped, D: c.D.clipped },
    published.passivity.value,
    m,
    resolveWeights(weights),
  )
}

/**
 * `?w=` value: four one-decimal weights, A to D, e.g. `1.0,1.5,0.0,2.0`, always with a point
 * (never a decimal comma, which would collide with the separator). Weights come from sliders on
 * the 0.1 grid (docs/05); a value off the grid is rounded half away from zero to it.
 */
export function formatWeights(weights: Partial<Record<'A' | 'B' | 'C' | 'D', number>>): string {
  const w = resolveWeights(weights)
  return (['A', 'B', 'C', 'D'] as const)
    .map((k) => roundHalfAwayFromZero(w[k], 1).toFixed(1))
    .join(',')
}

const WEIGHT = /^(?:[01](?:\.\d)?|2(?:\.0)?)$/

/**
 * The weights of a `?w=` value, or null when it is not four comma-separated values in [0, 2]
 * with at most one decimal (`1`, `1.5`, `0.0`, `2.0`). Callers fall back to the defaults.
 */
export function parseWeights(value: string | null | undefined): CategoryWeights | null {
  if (value === null || value === undefined) return null
  const parts = value.split(',')
  if (parts.length !== 4 || !parts.every((p) => WEIGHT.test(p))) return null
  const [a, b, c, d] = parts.map(Number) as [number, number, number, number]
  return { A: a, B: b, C: c, D: d }
}

/** True when the weights are the defaults (all 1). */
export function isDefaultWeights(weights: CategoryWeights): boolean {
  return (['A', 'B', 'C', 'D'] as const).every((k) => weights[k] === DEFAULT_WEIGHTS[k])
}
