/**
 * The package entry point (index.ts) re-exports the schemas, id helpers, loaders and the
 * validator that the other packages and the scripts import.
 */
import { describe, expect, it } from 'vitest'
import * as schema from './index.js'
import { packageName } from './index.js'

describe('@gai/schema', () => {
  it('says hello', () => {
    expect(packageName).toBe('@gai/schema')
  })

  it.each([
    // ids
    'parseEventId',
    'formatEventId',
    'nextEventId',
    'parseSourceId',
    'formatSourceId',
    'slugify',
    'isValidId',
    // issues
    'issue',
    'formatIssue',
    'sortIssues',
    // loaders
    'loadDataset',
    'loadMethodology',
    'listMethodologyVersions',
    'parseBannedWords',
    'parseYaml',
    'parseCsv',
    'resolveBaseRef',
    'loadBaseSnapshot',
    // validator
    'validate',
    'buildContext',
    'buildIndex',
    // primitives
    'daysBetween',
    'addDays',
    'isCalendarDate',
  ])('exports the function %s', (name) => {
    expect(typeof (schema as Record<string, unknown>)[name]).toBe('function')
  })

  it.each([
    'Country',
    'Event',
    'Evidence',
    'Source',
    'Assessment',
    'Correction',
    'Reply',
    'Lead',
    'ArchiveIndexRow',
    'UngaVoteRow',
    'IndicatorsFile',
    'CategoriesFile',
    'BandsFile',
  ])('exports the zod schema %s', (name) => {
    const s = (schema as Record<string, unknown>)[name] as { safeParse?: unknown }
    expect(typeof s?.safeParse).toBe('function')
  })

  it('exports the registries and constants', () => {
    expect(schema.RULE_IDS.length).toBe(Object.keys(schema.RULES).length)
    expect(schema.RULES['schema.event'].level).toBe('error')
    expect(schema.ALL_RULES.length).toBeGreaterThan(0)
    expect(schema.METHODOLOGY_ONLY_RULES.length).toBeGreaterThan(0)
    expect(Object.keys(schema.ID_PATTERNS)).toEqual([
      'event',
      'generatedEvent',
      'source',
      'reply',
      'correction',
      'lead',
    ])
    expect(Object.keys(schema.METHODOLOGY_FILES)).toHaveLength(9)
    expect(schema.STRUCTURED_TABLE_NAMES).toHaveLength(9)
    expect(schema.WINDOW_START).toBe('2023-10-07')
    expect(schema.EVENT_TYPES).toEqual(['standing', 'repeatable', 'computed'])
  })

  it('the exported pieces work together', () => {
    const id = schema.formatEventId({ date: '2025-08-08', iso3: 'DEU', indicator: 'A6' })
    expect(schema.isValidId('event', id)).toBe(true)
    const i = schema.issue('schema.event', { file: 'data/events/DEU.yaml', id, line: 3 }, 'x')
    expect(schema.formatIssue(i)).toBe(
      'error   data/events/DEU.yaml:3  evt_2025_08_08_DEU_A6  [schema.event]  x',
    )
  })
})
