/**
 * Sensitivity tables (docs/02 §10), regenerated each build:
 *
 * 1. Passivity at 5, 15, 25.
 * 2. Each category weight at 0.5 and 1.5 (others at 1).
 * 3. Confidence weight of `reported` at 0.2 and 0.6.
 * 4. Statements excluded (B9/B10 at 0).
 * 5. Decay off (d = 1 for all repeatable events).
 *
 * Each variant gives the full ranking and its Spearman rank correlation with the default ranking.
 * Rankings order the full-precision scores, highest first; tied scores share the average of their
 * positions (fractional ranking), and Spearman's ρ is Pearson's correlation of those ranks, which
 * is the standard treatment of ties. Variants 3–5 rescore every event, so they also change which
 * events qualify against the passivity penalty (a statement excluded no longer qualifies).
 */
import type { ScoreOptions } from './contribution.js'
import type { ScoringMethodology } from './methodology.js'
import { nearlyEqual, roundHalfAwayFromZero } from './numeric.js'
import { type CountryScore, combine, createScorer } from './score.js'
import type { ScoringEvent } from './types.js'

/** The statement indicators of variant 4. */
export const STATEMENT_INDICATORS: readonly string[] = ['B9', 'B10']
export const SENSITIVITY_WEIGHTS: readonly number[] = [0.5, 1.5]
export const SENSITIVITY_REPORTED_WEIGHTS: readonly number[] = [0.2, 0.6]

export interface RankedEntry {
  readonly iso3: string
  readonly exact: number
  readonly score: number
  readonly display: number
  readonly band: string
  /** 1-based position after sorting (score descending, then ISO3). */
  readonly position: number
  /** Fractional rank: tied scores share the average of their positions. */
  readonly rank: number
}

/**
 * Fractional ranks of `values`, highest value first (rank 1); values equal up to 1e-9 share the
 * average of their positions.
 */
export function averageRanks(values: readonly number[]): number[] {
  const order = values.map((v, i) => ({ v, i })).sort((a, b) => b.v - a.v || a.i - b.i)
  const ranks = new Array<number>(values.length).fill(0)
  let start = 0
  while (start < order.length) {
    let end = start
    const first = order[start] as { v: number; i: number }
    while (end + 1 < order.length && nearlyEqual((order[end + 1] as { v: number }).v, first.v))
      end++
    const rank = (start + end) / 2 + 1
    for (let k = start; k <= end; k++) ranks[(order[k] as { i: number }).i] = rank
    start = end + 1
  }
  return ranks
}

/** Pearson correlation; null when fewer than two values or either series is constant. */
export function pearson(x: readonly number[], y: readonly number[]): number | null {
  if (x.length !== y.length) throw new RangeError('series must have the same length')
  const n = x.length
  if (n < 2) return null
  const mean = (v: readonly number[]) => v.reduce((s, a) => s + a, 0) / n
  const mx = mean(x)
  const my = mean(y)
  let sxy = 0
  let sxx = 0
  let syy = 0
  for (let i = 0; i < n; i++) {
    const dx = (x[i] as number) - mx
    const dy = (y[i] as number) - my
    sxy += dx * dy
    sxx += dx * dx
    syy += dy * dy
  }
  if (sxx === 0 || syy === 0) return null
  const r = sxy / Math.sqrt(sxx * syy)
  return Math.max(-1, Math.min(1, r))
}

/**
 * Spearman's rank correlation of two score lists over the same countries, with ties at their
 * average rank; null when undefined (fewer than two countries, or all scores tied in a list).
 */
export function spearman(x: readonly number[], y: readonly number[]): number | null {
  return pearson(averageRanks(x), averageRanks(y))
}

/** Ranking of full-precision scores: highest first, ties by ISO3, with fractional ranks. */
export function rankScores(
  entries: readonly { readonly iso3: string; readonly exact: number; readonly band: string }[],
): RankedEntry[] {
  const sorted = [...entries].sort(
    (a, b) =>
      (nearlyEqual(a.exact, b.exact) ? 0 : b.exact - a.exact) ||
      (a.iso3 < b.iso3 ? -1 : a.iso3 > b.iso3 ? 1 : 0),
  )
  const ranks = averageRanks(sorted.map((e) => e.exact))
  return sorted.map((e, i) => ({
    iso3: e.iso3,
    exact: e.exact,
    score: roundHalfAwayFromZero(e.exact, 1),
    display: roundHalfAwayFromZero(e.exact, 0),
    band: e.band,
    position: i + 1,
    rank: ranks[i] as number,
  }))
}

export type SensitivityTableId = 'passivity' | 'weights' | 'confidence' | 'statements' | 'decay'

export interface SensitivityParams {
  readonly passivityPoints?: number
  readonly weights?: Partial<Record<'A' | 'B' | 'C' | 'D', number>>
  readonly confidenceWeights?: { readonly reported: number }
  readonly excludeIndicators?: readonly string[]
  readonly decay?: 'off'
}

export interface SensitivityVariant {
  readonly id: string
  readonly params: SensitivityParams
  readonly ranking: readonly RankedEntry[]
  /** Spearman's ρ with the default ranking. */
  readonly spearman: number | null
  /** Countries whose integer display score differs from the default. */
  readonly changedDisplay: number
}

export interface SensitivityTable {
  readonly id: SensitivityTableId
  readonly variants: readonly SensitivityVariant[]
}

export interface SensitivitySuite {
  readonly date: string
  readonly methodology: string
  /** Number of countries ranked; Spearman's ρ is null when n < 2. */
  readonly n: number
  readonly baseline: readonly RankedEntry[]
  readonly tables: readonly SensitivityTable[]
}

export interface CountryEvents {
  readonly iso3: string
  readonly events: readonly ScoringEvent[]
}

/**
 * The five tables of §10 at `date`, over the given countries (callers pass the scored entities
 * only, D-10). Deterministic: countries are processed in ISO3 order.
 */
export function sensitivitySuite(
  countries: readonly CountryEvents[],
  date: string,
  m: ScoringMethodology,
): SensitivitySuite {
  const list = [...countries].sort((a, b) => (a.iso3 < b.iso3 ? -1 : a.iso3 > b.iso3 ? 1 : 0))
  const scoreAll = (options: ScoreOptions): CountryScore[] =>
    list.map((c) => createScorer(c.iso3, c.events, m, options).at(date))
  const base = scoreAll({})
  const baseline = rankScores(base.map((s) => ({ iso3: s.country, exact: s.exact, band: s.band })))
  const baseExact = base.map((s) => s.exact)
  const baseDisplay = base.map((s) => s.display)

  const variant = (
    id: string,
    params: SensitivityParams,
    scored: readonly { iso3: string; exact: number; display: number; band: string }[],
  ): SensitivityVariant => ({
    id,
    params,
    ranking: rankScores(scored),
    spearman: spearman(
      baseExact,
      scored.map((s) => s.exact),
    ),
    changedDisplay: scored.filter((s, i) => s.display !== baseDisplay[i]).length,
  })

  // Tables 1 and 2 recombine the published subtotals: qualification does not depend on the
  // penalty's size, and weights apply to the clipped subtotals (§9).
  const recombined = (passivityPoints: number, weights: SensitivityParams['weights']) =>
    base.map((s) => {
      const c = s.categories
      const r = combine(
        { A: c.A.clipped, B: c.B.clipped, C: c.C.clipped, D: c.D.clipped },
        s.passivity.applied ? passivityPoints : 0,
        m,
        weights,
      )
      return { iso3: s.country, exact: r.exact, display: r.display, band: r.band }
    })
  const rescored = (options: ScoreOptions) =>
    scoreAll(options).map((s) => ({
      iso3: s.country,
      exact: s.exact,
      display: s.display,
      band: s.band,
    }))

  const passivity: SensitivityVariant[] = m.passivity.sensitivityPoints.map((p) =>
    variant(`passivity-${p}`, { passivityPoints: p }, recombined(p, undefined)),
  )
  const weights: SensitivityVariant[] = []
  for (const k of ['A', 'B', 'C', 'D'] as const) {
    for (const w of SENSITIVITY_WEIGHTS) {
      weights.push(
        variant(
          `weight-${k}-${w}`,
          { weights: { [k]: w } },
          recombined(m.passivity.points, { [k]: w }),
        ),
      )
    }
  }
  const confidence = SENSITIVITY_REPORTED_WEIGHTS.map((w) =>
    variant(
      `reported-${w}`,
      { confidenceWeights: { reported: w } },
      rescored({ confidenceWeights: { reported: w } }),
    ),
  )
  const statements = [
    variant(
      'statements-excluded',
      { excludeIndicators: STATEMENT_INDICATORS },
      rescored({ excludeIndicators: STATEMENT_INDICATORS }),
    ),
  ]
  const decay = [variant('decay-off', { decay: 'off' }, rescored({ decay: 'off' }))]

  return {
    date,
    methodology: m.version,
    n: list.length,
    baseline,
    tables: [
      { id: 'passivity', variants: passivity },
      { id: 'weights', variants: weights },
      { id: 'confidence', variants: confidence },
      { id: 'statements', variants: statements },
      { id: 'decay', variants: decay },
    ],
  }
}
