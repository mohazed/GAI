/**
 * @gai/scoring — pure, dependency-free scoring functions (docs/02): contributions and decay,
 * stacking rules and caps, passivity, score, band, coverage, user weights, sensitivity, the daily
 * series, last change and movers, the summary line and citations. No I/O, no clock, no randomness:
 * the same input always gives the same output (D-25).
 */
export const packageName = '@gai/scoring'

export * from './citation.js'
export * from './contribution.js'
export * from './coverage.js'
export * from './format.js'
export * from './formula.js'
export * from './labels.js'
export * from './methodology.js'
export * from './numeric.js'
export * from './score.js'
export * from './sensitivity.js'
export * from './series.js'
export * from './summary.js'
export * from './time.js'
export * from './types.js'
export * from './weights.js'
