/**
 * Clipping, comparison and rounding in full precision (docs/02 §7: "All internal arithmetic uses
 * full precision").
 *
 * Binary floating point cannot hold 0.7 or 0.4 exactly, so a sum that is exactly −0.5 on paper can
 * come out as −0.49999999999999994. Every term of a score is a one-decimal points value times a
 * one-decimal confidence weight times a decay factor (1460 − 3k)/1460, possibly times a
 * one-decimal category weight (docs/02 §9), so two scores that differ on paper differ by at least
 * 1/1 460 000 ≈ 6.8e-7, while rounding noise over a few hundred terms stays below 1e-11. Values
 * are therefore compared, and halves detected, on a grid of 1e-9: wide enough to absorb the
 * noise, far narrower than any real difference.
 */

/** Tolerance for comparisons and for detecting halves (see the module comment). */
export const EPSILON = 1e-9

/**
 * `x` snapped to the 1e-9 grid, with −0 written as 0: the nearest double to k / 10^9 for the
 * nearest integer k, so a sum equal to 10 on paper comes back as exactly 10. Values beyond 10^6
 * in magnitude (never a score) are returned unchanged.
 */
export function snap(x: number): number {
  if (!Number.isFinite(x) || Math.abs(x) >= 1e6) return x
  const s = Math.round(x * 1e9) / 1e9
  return s === 0 ? 0 : s
}

/** a ≥ b, up to EPSILON. */
export function atLeast(a: number, b: number): boolean {
  return a >= b - EPSILON
}

/** a = b, up to EPSILON. */
export function nearlyEqual(a: number, b: number): boolean {
  return Math.abs(a - b) <= EPSILON
}

/** `x` bounded by `min` and `max`; a null bound is no bound. −0 is written as 0. */
export function clip(x: number, min: number | null, max: number | null): number {
  let out = x
  if (min !== null && out < min) out = min
  if (max !== null && out > max) out = max
  return out === 0 ? 0 : out
}

/**
 * Rounds half away from zero to `decimals` places (docs/02 §7): 0.5 → 1, −0.5 → −1, −13.5 → −14.
 * The scaled value is snapped to the 1e-9 grid first, so float noise cannot move a half. Never
 * returns −0.
 */
export function roundHalfAwayFromZero(x: number, decimals = 0): number {
  if (!Number.isFinite(x)) throw new RangeError(`cannot round ${x}`)
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 4) {
    throw new RangeError(`decimals must be an integer from 0 to 4, got ${decimals}`)
  }
  const factor = 10 ** decimals
  const raw = Math.abs(x) * factor
  // Snapping needs raw · 1e9 below 2^53; beyond 1e6 the value is far outside any score anyway.
  const scaled = raw < 1e6 ? Math.round(raw * 1e9) / 1e9 : raw
  const rounded = (Math.sign(x) * Math.floor(scaled + 0.5)) / factor
  return rounded === 0 ? 0 : rounded
}

/** Sum left to right. Callers sort their terms first, so the result does not depend on input order. */
export function sum(values: readonly number[]): number {
  let total = 0
  for (const v of values) total += v
  return total === 0 ? 0 : total
}

/** Difference b − a of two one-decimal values, exact in tenths. */
export function tenthsDelta(a: number, b: number): number {
  const d = (Math.round(b * 10) - Math.round(a * 10)) / 10
  return d === 0 ? 0 : d
}
