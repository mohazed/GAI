/**
 * @gai/pipeline — the commands that read and write the dataset: the archiver (`pnpm archive`),
 * the structured-source fetchers and importers, the generators of the structured indicators
 * (D-08) and `pnpm score`; build-data (P-05) next.
 */
export const packageName = '@gai/pipeline'

export * from './generate/index.js'
export { type ArchivedDocument, archiveUrl, deriveSourceId, sha256Hex } from './lib/archive.js'
export { extractText, TEXT_LIMIT_BYTES, truncateText } from './lib/extract.js'
export { scoringMethodology } from './methodology.js'
export { parseScoreArgs, runScore, type ScoreArgs, type ScoreRunResult } from './score-cli.js'
export { UN_MEMBER_ISO3, UNIVERSE_ISO3 } from './universe.js'
