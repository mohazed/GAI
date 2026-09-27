/**
 * @gai/schema — zod schemas, id helpers, loaders, validators and tone lint for the dataset
 * (docs/03) and the methodology files (docs/02).
 */
export const packageName = '@gai/schema'

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
export * from './validate/tone.js'
