/**
 * Every generated event of the dataset (D-08, docs/04 §2 step 3): B1, B2, A1, A4, A2, C3 and D1
 * from the tables of data/structured and the methodology files. Pure.
 */
import { type Dataset, EXCLUDED_ISO3, type Methodology } from '@gai/schema'
import { type GenerateContext, type Generated, sortEvents } from './common.js'
import { generateD1 } from './funding.js'
import { generateA1, generateA4 } from './sipri.js'
import { generateA2, generateC3 } from './trade.js'
import { generateB1, generateB2 } from './votes.js'

export * from './common.js'
export { generateD1, gniFor } from './funding.js'
export { generateA1, generateA4 } from './sipri.js'
export { generateA2, generateC3 } from './trade.js'
export { generateB1, generateB2, voteSlug } from './votes.js'

export interface GenerateOptions {
  /** HS 8526/8802 flows confirmed as military, per country (docs/02 §2 A2); none by default. */
  confirmedMilitary?: ReadonlyMap<string, ReadonlySet<string>>
}

/** The generator context of a loaded methodology; throws when a file it needs failed to load. */
export function generateContext(
  m: Methodology,
  excluded: Iterable<string> = EXCLUDED_ISO3,
): GenerateContext {
  if (m.indicatorsFile === null || m.thresholds === null || m.votes === null) {
    throw new Error(
      `methodology ${m.folder}: indicators.yaml, thresholds.yaml and votes.yaml are needed to generate events`,
    )
  }
  return {
    indicators: m.indicatorsFile.value.indicators,
    thresholds: m.thresholds.value,
    votes: m.votes.value,
    excluded: new Set(excluded),
  }
}

export function generateAll(
  ctx: GenerateContext,
  structured: Dataset['structured'],
  options: GenerateOptions = {},
): Generated {
  const parts = [
    generateB1(ctx, structured['unga_votes.csv']),
    generateB2(ctx, structured['unsc_vetoes.csv']),
    generateA1(ctx, structured['sipri_deliveries.csv']),
    generateA4(ctx, structured['sipri_orders.csv']),
    generateA2(ctx, structured['comtrade_a2.csv'], options.confirmedMilitary),
    generateC3(ctx, structured['comtrade_c3.csv']),
    generateD1(ctx, structured['fts_funding.csv'], structured['gni.csv']),
  ]
  const events = sortEvents(parts.flatMap((p) => p.events))
  const seen = new Set<string>()
  for (const e of events) {
    if (seen.has(e.id)) throw new Error(`two generated events share the id ${e.id}`)
    seen.add(e.id)
  }
  return { events, notes: parts.flatMap((p) => p.notes) }
}
