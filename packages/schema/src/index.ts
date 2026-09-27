/**
 * @gai/schema — zod schemas, id helpers, loaders, validators and tone lint for the dataset
 * (docs/03) and the methodology files (docs/02).
 */
export const packageName = '@gai/schema'

export * from './api.js'
export * from './ids.js'
export * from './issues.js'
export * from './load/dataset.js'
export * from './load/git.js'
export * from './load/methodology.js'
export * from './load/parse.js'
export * from './load/repo.js'
export * from './methodology/render.js'
export * from './methodology/schemas.js'
export * from './primitives.js'
export * from './records.js'
export * from './structured.js'
export * from './validate/index.js'
export * from './validate/normalise.js'
// Helpers and constants of individual rule modules that the scoring engine (P-03), the pipeline
// (P-04) and build-data (P-05) reuse. Named re-exports: every rule module also exports `rules`.
export {
  canonicalJson,
  DIFF_KEYS,
  EDIT_FIELDS,
  EVIDENCE_KEYS,
  PUBLIC_STATUSES,
} from './validate/rules/history.js'
export {
  EXCLUDED_ISO3,
  REPLY_DEADLINE_DAYS,
  UNIVERSE_SIZE,
  UNSC_PERMANENT_ISO3,
} from './validate/rules/records.js'
export { isDatasetRow, notArchivedReason, VIDEO_LOCATOR } from './validate/rules/sources.js'
export * from './validate/tone.js'
