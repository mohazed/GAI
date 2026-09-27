/**
 * @gai/pipeline — the commands that read and write the dataset: `pnpm score` now; the archiver,
 * fetchers, importers, generators (P-04) and build-data (P-05) next.
 */
export const packageName = '@gai/pipeline'

export { scoringMethodology } from './methodology.js'
export { parseScoreArgs, runScore, type ScoreArgs, type ScoreRunResult } from './score-cli.js'
