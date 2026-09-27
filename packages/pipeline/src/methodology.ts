/**
 * The bridge from a methodology loaded by @gai/schema (files and issues) to the engine's compiled
 * form. Used by `pnpm score` and later by `pnpm build:data`.
 */
import { formatIssue, type Methodology } from '@gai/schema'
import { compileMethodology, type ScoringMethodology } from '@gai/scoring'

/** Compiles a loaded methodology; throws, listing the problems, when a file failed to load. */
export function scoringMethodology(m: Methodology): ScoringMethodology {
  const errors = m.issues.filter((i) => i.level === 'error')
  const { indicatorsFile, categories, bands, confidence, decay, passivity } = m
  if (
    errors.length > 0 ||
    indicatorsFile === null ||
    categories === null ||
    bands === null ||
    confidence === null ||
    decay === null ||
    passivity === null
  ) {
    const lines = errors.map(formatIssue)
    throw new Error(
      `methodology ${m.folder} cannot be scored${lines.length > 0 ? `:\n${lines.join('\n')}` : ': a file is missing'}`,
    )
  }
  return compileMethodology({
    indicators: indicatorsFile.value,
    categories: categories.value,
    bands: bands.value,
    confidence: confidence.value,
    decay: decay.value,
    passivity: passivity.value,
    thresholds: m.thresholds?.value,
  })
}
