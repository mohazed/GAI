/**
 * `sensitivity.json` (docs/02 §10, docs/04 §2 step 5): the five sensitivity tables that
 * `sensitivitySuite` of @gai/scoring computes at the build date, in the API's snake_case shape.
 *
 * Nothing is recomputed here: scores, positions, fractional ranks and Spearman's ρ are copied as
 * the engine returns them (`exact` in full precision, `score` to one decimal, `score_display` the
 * integer). Every variant lists every parameter: the ones the variant sets carry their value, the
 * others are null, so a reader never has to guess what "absent" means. Pure (D-25).
 */
import type { ApiSensitivityFile } from '@gai/schema'
import type {
  RankedEntry,
  SensitivityParams,
  SensitivitySuite,
  SensitivityVariant,
} from '@gai/scoring'

type ApiRanked = ApiSensitivityFile['baseline'][number]
type ApiVariant = ApiSensitivityFile['tables'][number]['variants'][number]

function ranked(e: RankedEntry): ApiRanked {
  return {
    iso3: e.iso3,
    exact: e.exact,
    score: e.score,
    score_display: e.display,
    band: e.band,
    position: e.position,
    rank: e.rank,
  }
}

/** Every parameter of a variant; null when the variant leaves it at its default. */
function params(p: SensitivityParams): ApiVariant['params'] {
  const w = p.weights
  return {
    passivity_points: p.passivityPoints ?? null,
    weights:
      w === undefined ? null : { A: w.A ?? null, B: w.B ?? null, C: w.C ?? null, D: w.D ?? null },
    confidence_weights:
      p.confidenceWeights === undefined ? null : { reported: p.confidenceWeights.reported },
    exclude_indicators: p.excludeIndicators === undefined ? null : [...p.excludeIndicators],
    decay: p.decay ?? null,
  }
}

function variant(v: SensitivityVariant): ApiVariant {
  return {
    id: v.id,
    params: params(v.params),
    spearman: v.spearman,
    changed_display: v.changedDisplay,
    ranking: v.ranking.map(ranked),
  }
}

/**
 * The sensitivity file of a suite computed at the build date `date`. Throws when the suite was
 * computed at another date, as the file would then describe scores other than the published ones.
 */
export function sensitivityFile(suite: SensitivitySuite, date: string): ApiSensitivityFile {
  if (suite.date !== date) {
    throw new RangeError(`sensitivity suite computed at ${suite.date}, build date ${date}`)
  }
  return {
    build_date: date,
    methodology: suite.methodology,
    n: suite.n,
    baseline: suite.baseline.map(ranked),
    tables: suite.tables.map((t) => ({ id: t.id, variants: t.variants.map(variant) })),
  }
}
