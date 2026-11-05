/**
 * The package entry point (index.ts) re-exports the schemas, id helpers, loaders and the
 * validator that the other packages and the scripts import.
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'
import * as schema from './index.js'
import { packageName } from './index.js'
import { fixtureContext } from './testing/harness.js'

const PACKAGE_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

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
    'compareCodeUnits',
    // loaders
    'loadDataset',
    'loadMethodology',
    'listMethodologyVersions',
    'parseBannedWords',
    'parseYaml',
    'parseCsv',
    'resolveBaseRef',
    'resolveBase',
    'baseRequired',
    'loadBaseSnapshot',
    'decodeUtf8',
    'findRepoRoot',
    // validator
    'validate',
    'buildContext',
    'buildIndex',
    // primitives
    'daysBetween',
    'addDays',
    'isCalendarDate',
    // event order (validate/order.ts)
    'compareEventIds',
    'compareEventOrder',
    // rule-module helpers (validate/rules/history.ts, sources.ts)
    'canonicalJson',
    'isDatasetRow',
    'notArchivedReason',
    // quote matching (validate/normalise.ts)
    'normaliseWhitespace',
    'quoteSearcher',
    'containsQuote',
    'foldName',
    // tone lint (validate/tone.ts)
    'compileBannedWords',
    'findBannedWords',
    'bannedWordMessage',
    'checkActorFirst',
    'lintSummary',
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
    expect(schema.STRUCTURED_TABLE_NAMES).toHaveLength(12)
    expect(schema.WINDOW_START).toBe('2023-10-07')
    expect(schema.EVENT_TYPES).toEqual(['standing', 'repeatable', 'computed'])
  })

  it('exports the constants of the rule modules', () => {
    expect(schema.UNIVERSE_SIZE).toBe(193)
    expect(schema.EXCLUDED_ISO3).toEqual(['ISR', 'PSE'])
    expect(schema.UNSC_PERMANENT_ISO3).toEqual(['CHN', 'FRA', 'GBR', 'RUS', 'USA'])
    expect(schema.REPLY_DEADLINE_DAYS).toBe(10)
    expect(schema.EDIT_FIELDS).toEqual(['points', 'date', 'confidence', 'evidence'])
    expect(schema.DIFF_KEYS).toEqual([
      'date',
      'points',
      'confidence',
      'end',
      'evidence',
      'scope',
      'status',
    ])
    expect(schema.LOGGED_FIELDS).toEqual(['end', 'scope', 'status'])
    expect(schema.PUBLIC_STATUSES).toEqual(['published', 'corrected', 'superseded', 'retracted'])
    expect(schema.SUMMARY_MAX_LENGTH).toBe(200)
    expect(schema.VIDEO_LOCATOR.test('video 01:02:03')).toBe(true)
    expect(schema.VIDEO_LOCATOR.test('p. 4')).toBe(false)
  })

  it('the exported order and canonical-JSON helpers behave as documented', () => {
    expect(schema.compareEventIds('evt_2025_08_08_DEU_B9', 'evt_2025_08_08_DEU_B10')).toBe(-1)
    expect(
      schema.compareEventOrder(
        { date: '2025-08-07', id: 'evt_2025_08_07_DEU_B10' },
        { date: '2025-08-08', id: 'evt_2025_08_08_DEU_A6' },
      ),
    ).toBe(-1)
    expect(schema.canonicalJson({ b: 1, a: [{ d: 2, c: 3 }] })).toBe('{"a":[{"c":3,"d":2}],"b":1}')
    expect(schema.containsQuote('a  quoted\ntext', 'quoted text')).toBe(true)
  })

  it('the exported source helpers accept the fixture sources', () => {
    const ctx = fixtureContext()
    expect(ctx.dataset.sources.length).toBeGreaterThan(0)
    for (const { value } of ctx.dataset.sources) {
      expect(schema.notArchivedReason(ctx, value)).toBeNull()
      expect(schema.isDatasetRow(value)).toBe(false)
    }
    const first = ctx.dataset.sources[0]?.value
    if (!first) throw new Error('fixture source missing')
    const row = { ...first, kind: 'dataset' as const, url: 'data/structured/gni.csv' }
    expect(schema.isDatasetRow(row)).toBe(true)
    expect(schema.notArchivedReason(ctx, { ...first, wayback_url: null })).toContain('wayback_url')
  })

  it('exposes the fixture harness as the "./testing" subpath', async () => {
    const pkg = JSON.parse(readFileSync(join(PACKAGE_ROOT, 'package.json'), 'utf8')) as {
      exports: Record<string, string>
    }
    expect(pkg.exports['.']).toBe('./src/index.ts')
    const target = pkg.exports['./testing']
    expect(target).toBe('./src/testing/harness.ts')
    const harness = (await import(
      pathToFileURL(join(PACKAGE_ROOT, target as string)).href
    )) as Record<string, unknown>
    for (const name of ['fixtureDataset', 'repoMethodology', 'fixtureContext', 'runRules']) {
      expect(typeof harness[name]).toBe('function')
    }
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
