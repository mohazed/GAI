/**
 * The dataset loader (load/dataset.ts, docs/03 §1) on temporary copies of the fixtures: counts
 * and locations, required and unexpected files, and one malformed record of each kind producing
 * exactly its schema rule while its valid siblings still load. `fixtures/` itself is never
 * written: every test works in a fresh copy under the OS temporary directory.
 */
import {
  appendFileSync,
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { stringify } from 'yaml'
import type { RuleId } from '../issues.js'
import type { Correction, Event, Reply, Source } from '../records.js'
import { STRUCTURED_TABLE_NAMES } from '../structured.js'
import { FIXTURES_ROOT, rulesIn } from '../testing/harness.js'
import { type Dataset, loadDataset, REQUIRED_FILES } from './dataset.js'

const EVENTS_FILE = 'data/events/DEU.yaml'
const COUNTRIES_FILE = 'data/countries.yaml'
const CORRECTIONS_FILE = 'data/corrections.yaml'
const INDEX_FILE = 'archive/index.csv'
const SOURCE_ID = 'src_20250808_bundesregierung_ruestungsexporte-gaza'
const SOURCE_2_ID = 'src_20251117_bundesregierung_ruestungsexporte-israel-aufhebung'
const SOURCE_FILE = `data/sources/2025/${SOURCE_ID}.yaml`
const REPLY_FILE = 'data/replies/DEU/rep_20260927_DEU_1.yaml'
const BAD_SOURCE_ID = 'src_20250809_test_bad-record'

let root: string

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'gai-dataset-'))
  cpSync(FIXTURES_ROOT, root, { recursive: true })
})

afterEach(() => {
  rmSync(root, { recursive: true, force: true })
})

// ---------------------------------------------------------------------------------------------
// Helpers on the temporary copy

const read = (rel: string): string => readFileSync(join(root, rel), 'utf8')

function write(rel: string, text: string): void {
  mkdirSync(dirname(join(root, rel)), { recursive: true })
  writeFileSync(join(root, rel), text)
}

const remove = (rel: string): void => rmSync(join(root, rel))

/** Appends YAML list items to a list file; returns the line of the first appended item. */
function appendItems(rel: string, items: unknown[]): number {
  const before = read(rel)
  const sep = before.endsWith('\n') ? '' : '\n'
  appendFileSync(join(root, rel), sep + stringify(items))
  return (before + sep).split('\n').length
}

/** 1-based line of the first line of `rel` that contains `needle`. */
function lineOf(rel: string, needle: string): number {
  const i = read(rel)
    .split('\n')
    .findIndex((l) => l.includes(needle))
  if (i < 0) throw new Error(`${needle} not in ${rel}`)
  return i + 1
}

/** Typed records of the pristine fixtures, used as templates for new records. */
function templates(): { event: Event; source: Source; correction: Correction; reply: Reply } {
  const ds = loadDataset(FIXTURES_ROOT)
  const event = ds.events[0]?.value
  const source = ds.sources.find((s) => s.value.id === SOURCE_ID)?.value
  const correction = ds.corrections[0]?.value
  const reply = ds.replies[0]?.value
  if (!event || !source || !correction || !reply) throw new Error('fixture records missing')
  return structuredClone({ event, source, correction, reply })
}

const load = (): Dataset => loadDataset(root)

// ---------------------------------------------------------------------------------------------

describe('the fixture tree', () => {
  it('loads every record with no issue', () => {
    const ds = load()
    expect(ds.issues).toEqual([])
    expect(ds.root).toBe(root)
    expect(ds.countries).toHaveLength(3)
    expect(ds.events).toHaveLength(1)
    expect(ds.sources).toHaveLength(2)
    expect(ds.assessments).toHaveLength(1)
    expect(ds.corrections).toHaveLength(1)
    expect(ds.replies).toHaveLength(1)
    expect(ds.leads).toHaveLength(0)
    expect(ds.archiveIndex).toHaveLength(2)
    expect(ds.archiveTextIds).toEqual(new Set([SOURCE_ID, SOURCE_2_ID]))
    expect(ds.invalidIds.size).toBe(0)
    for (const t of STRUCTURED_TABLE_NAMES) expect(ds.structured[t], t).toEqual([])
  })

  it('keeps the file and line of every record', () => {
    const ds = load()
    expect(ds.countries.map((c) => [c.value.iso3, c.file, c.line])).toEqual([
      ['DEU', COUNTRIES_FILE, 16],
      ['ISR', COUNTRIES_FILE, 52],
      ['PSE', COUNTRIES_FILE, 81],
    ])
    expect(ds.events[0]).toMatchObject({ file: EVENTS_FILE, line: 3 })
    expect(ds.events[0]?.value.id).toBe('evt_2025_08_08_DEU_A6')
    expect(ds.corrections[0]).toMatchObject({ file: CORRECTIONS_FILE, line: 3 })
    expect(ds.sources.map((s) => [s.file, s.line])).toEqual([
      [SOURCE_FILE, 1],
      [`data/sources/2025/${SOURCE_2_ID}.yaml`, 1],
    ])
    expect(ds.assessments[0]).toMatchObject({ file: 'data/assessments/DEU.yaml', line: 1 })
    expect(ds.replies[0]).toMatchObject({ file: REPLY_FILE, line: 1 })
    expect(ds.archiveIndex.map((r) => [r.value.src_id, r.file, r.line])).toEqual([
      [SOURCE_ID, INDEX_FILE, 2],
      [SOURCE_2_ID, INDEX_FILE, 3],
    ])
  })

  it('parses YAML dates as strings and CSV numbers as numbers', () => {
    const ds = load()
    expect(ds.events[0]?.value.date).toBe('2025-08-08')
    expect(ds.events[0]?.value.end).toBe('2025-11-24')
    expect(ds.archiveIndex[0]?.value.bytes).toBe(107672)
  })

  it('lists every file it saw, POSIX paths relative to the root', () => {
    const ds = load()
    expect(ds.files).toContain('data/leads/.gitkeep')
    expect(ds.files).toContain(`archive/text/${SOURCE_ID}.txt`)
    expect(ds.files.every((f) => !f.startsWith('/') && !f.includes('\\'))).toBe(true)
  })

  it('reads archive texts on demand', () => {
    const ds = load()
    expect(ds.readArchiveText(SOURCE_ID)).toContain('genehmigt die Bundesregierung')
    expect(ds.readArchiveText('src_20990101_none_none')).toBeUndefined()
  })
})

describe('required files (load.missing-file)', () => {
  it.each([
    COUNTRIES_FILE,
    CORRECTIONS_FILE,
    INDEX_FILE,
    'data/structured/gni.csv',
    'data/structured/unga_votes.csv',
  ])('%s removed', (rel) => {
    remove(rel)
    const ds = load()
    expect(ds.issues).toMatchObject([{ rule: 'load.missing-file', file: rel, level: 'error' }])
  })

  it('every structured table is required', () => {
    for (const t of STRUCTURED_TABLE_NAMES) {
      expect(REQUIRED_FILES).toContain(`data/structured/${t}`)
    }
  })

  it('the countries are empty when countries.yaml is missing', () => {
    remove(COUNTRIES_FILE)
    expect(load().countries).toEqual([])
  })

  it('requireFiles: false skips the check', () => {
    remove(COUNTRIES_FILE)
    remove(INDEX_FILE)
    expect(loadDataset(root, { requireFiles: false }).issues).toEqual([])
  })
})

describe('unexpected files (load.unexpected-file)', () => {
  it.each([
    'data/events/DEU.yml',
    'data/foo.txt',
    'archive/text/x.pdf',
    'archive/other.csv',
    'data/structured/foo.csv',
    'data/events/2025/DEU.yaml',
    'data/sources/src_20250808_bundesregierung_ruestungsexporte.yaml',
  ])('%s', (rel) => {
    write(rel, 'x: 1\n')
    const ds = load()
    expect(ds.issues).toMatchObject([{ rule: 'load.unexpected-file', file: rel, level: 'warning' }])
    // The rest of the tree still loads.
    expect(ds.events).toHaveLength(1)
    expect(ds.sources).toHaveLength(2)
  })

  it('ignores .gitkeep, README.md, .DS_Store, data/snapshots/** and data/structured/raw/**', () => {
    write('data/README.md', '# data\n')
    write('data/events/.gitkeep', '')
    write('data/events/README.md', 'notes\n')
    write('archive/text/.gitkeep', '')
    write('data/.DS_Store', 'x')
    write('data/snapshots/v0.9.0/scores.json', '{}')
    write('data/snapshots/v0.9.0/events.yaml', 'not: [valid')
    write('data/structured/raw/fts_2025.json', '{}')
    write('data/structured/raw/nested/unga.csv', 'x,y\n')
    const ds = load()
    expect(ds.issues).toEqual([])
    expect(ds.files).toContain('data/snapshots/v0.9.0/scores.json')
  })
})

describe('malformed records (schema.*)', () => {
  it("'schema.country': the entry is reported with its iso3 and line; siblings load", () => {
    const line = appendItems(COUNTRIES_FILE, [
      {
        iso3: 'XXA',
        iso2: 'X',
        m49: 999,
        name: { en: 'Test country', fr: 'Pays de test' },
        region: 'Test',
        subregion: 'Test',
        un_member: false,
        observer: false,
        excluded: false,
        memberships: {
          unsc: [],
          eu: false,
          nato: false,
          arab_league: false,
          oic: false,
          g20: false,
          g7: false,
          brics: false,
        },
        recognises_palestine: { since: null },
        gov_sources: [],
      },
    ])
    const ds = load()
    expect(rulesIn(ds.issues)).toEqual(['schema.country'])
    expect(ds.issues).toMatchObject([
      { rule: 'schema.country', file: COUNTRIES_FILE, id: 'XXA', line, path: 'iso2' },
    ])
    expect(ds.invalidIds).toEqual(new Set(['XXA']))
    expect(ds.countries.map((c) => c.value.iso3)).toEqual(['DEU', 'ISR', 'PSE'])
  })

  it("'schema.event': the event is reported with its id, line and path; siblings load", () => {
    const { event } = templates()
    const bad = { ...event, id: 'evt_2025_08_09_DEU_A6', date: '2025-08-09', points: 'ten' }
    const line = appendItems(EVENTS_FILE, [bad])
    const ds = load()
    expect(rulesIn(ds.issues)).toEqual(['schema.event'])
    expect(ds.issues).toMatchObject([
      {
        rule: 'schema.event',
        file: EVENTS_FILE,
        id: 'evt_2025_08_09_DEU_A6',
        line,
        path: 'points',
      },
    ])
    expect(ds.invalidIds).toEqual(new Set(['evt_2025_08_09_DEU_A6']))
    expect(ds.events.map((e) => e.value.id)).toEqual(['evt_2025_08_08_DEU_A6'])
  })

  it("'schema.event': an event with no id is reported as #n", () => {
    const { event } = templates()
    const { id: _id, ...noId } = event
    const line = appendItems(EVENTS_FILE, [noId])
    const ds = load()
    expect(ds.issues).toMatchObject([{ rule: 'schema.event', id: '#2', line, path: 'id' }])
    expect(ds.invalidIds.has('#2')).toBe(true)
  })

  it("'schema.event': an invalid id (instance _1) is reported", () => {
    const { event } = templates()
    appendItems(EVENTS_FILE, [{ ...event, id: 'evt_2025_08_08_DEU_A6_1' }])
    const ds = load()
    expect(ds.issues).toMatchObject([
      { rule: 'schema.event', id: 'evt_2025_08_08_DEU_A6_1', path: 'id' },
    ])
  })

  it("'schema.source': the file is reported with the record id, line 1; siblings load", () => {
    const { source } = templates()
    const rel = `data/sources/2025/${BAD_SOURCE_ID}.yaml`
    write(rel, stringify({ ...source, id: BAD_SOURCE_ID, sha256: 'ABC' }))
    const ds = load()
    expect(rulesIn(ds.issues)).toEqual(['schema.source'])
    expect(ds.issues).toMatchObject([
      { rule: 'schema.source', file: rel, id: BAD_SOURCE_ID, line: 1, path: 'sha256' },
    ])
    expect(ds.invalidIds).toEqual(new Set([BAD_SOURCE_ID]))
    expect(ds.sources).toHaveLength(2)
  })

  it("'schema.source': a file holding a list, or no id, falls back to the file name", () => {
    const rel = `data/sources/2025/${BAD_SOURCE_ID}.yaml`
    write(rel, '- a\n- b\n')
    const ds = load()
    expect(ds.issues).toMatchObject([
      { rule: 'schema.source', file: rel, id: BAD_SOURCE_ID, line: 1 },
    ])
    expect(ds.issues[0]?.message).toContain('expected a YAML mapping')
    expect(ds.invalidIds.has(BAD_SOURCE_ID)).toBe(true)
  })

  it("'schema.assessment': the file is reported with its country; siblings load", () => {
    const rel = 'data/assessments/XXA.yaml'
    write(
      rel,
      stringify({
        country: 'XXA',
        protocol_version: 1,
        last_full_check: null,
        indicators: { A1: { status: 'done' } },
      }),
    )
    const ds = load()
    expect(rulesIn(ds.issues)).toEqual(['schema.assessment'])
    expect(ds.issues).toMatchObject([
      { rule: 'schema.assessment', file: rel, id: 'XXA', line: 1, path: 'indicators.A1.status' },
    ])
    expect(ds.invalidIds).toEqual(new Set(['XXA']))
    expect(ds.assessments.map((a) => a.value.country)).toEqual(['DEU'])
  })

  it("'schema.correction': the entry is reported with its id and line; siblings load", () => {
    const { correction } = templates()
    const line = appendItems(CORRECTIONS_FILE, [
      { ...correction, id: 'cor_20260927_2', kind: 'erratum' },
    ])
    const ds = load()
    expect(rulesIn(ds.issues)).toEqual(['schema.correction'])
    expect(ds.issues).toMatchObject([
      {
        rule: 'schema.correction',
        file: CORRECTIONS_FILE,
        id: 'cor_20260927_2',
        line,
        path: 'kind',
      },
    ])
    expect(ds.invalidIds).toEqual(new Set(['cor_20260927_2']))
    expect(ds.corrections.map((c) => c.value.id)).toEqual(['cor_20260927_1'])
  })

  it("'schema.reply': the file is reported with its id; siblings load", () => {
    const { reply } = templates()
    const rel = 'data/replies/DEU/rep_20260927_DEU_2.yaml'
    write(rel, stringify({ ...reply, id: 'rep_20260927_DEU_2', outcome: 'maybe' }))
    const ds = load()
    expect(rulesIn(ds.issues)).toEqual(['schema.reply'])
    expect(ds.issues).toMatchObject([
      { rule: 'schema.reply', file: rel, id: 'rep_20260927_DEU_2', line: 1, path: 'outcome' },
    ])
    expect(ds.invalidIds).toEqual(new Set(['rep_20260927_DEU_2']))
    expect(ds.replies.map((r) => r.value.id)).toEqual(['rep_20260927_DEU_1'])
  })

  it("'schema.lead': the entry is reported with its id and line; siblings load", () => {
    const rel = 'data/leads/DEU.yaml'
    const lead = {
      id: 'lead_20260901_DEU_1',
      country: 'DEU',
      indicator: 'A3',
      claim: 'Test lead.',
      sources: [{ url: 'https://example.org/test-lead', publisher: 'Example', kind: 'press' }],
      date: '2026-09-01',
      status: 'open',
    }
    write(rel, stringify([lead, { ...lead, id: 'lead_20260901_DEU_2', status: 'closed' }]))
    const ds = load()
    expect(rulesIn(ds.issues)).toEqual(['schema.lead'])
    expect(ds.issues).toMatchObject([
      {
        rule: 'schema.lead',
        file: rel,
        id: 'lead_20260901_DEU_2',
        line: lineOf(rel, 'id: lead_20260901_DEU_2'),
        path: 'status',
      },
    ])
    expect(ds.invalidIds).toEqual(new Set(['lead_20260901_DEU_2']))
    expect(ds.leads.map((l) => l.value.id)).toEqual(['lead_20260901_DEU_1'])
  })

  it("'schema.structured-row': the row is reported as `row {line}`; valid rows load", () => {
    const rel = 'data/structured/unga_votes.csv'
    const src = 'src_20240311_undl_votes'
    appendFileSync(
      join(root, rel),
      `A/RES/ES-10/21,2023-10-27,FRA,Y,${src}\nA/RES/ES-10/21,2023-10-27,USA,Q,${src}\n`,
    )
    const ds = load()
    expect(rulesIn(ds.issues)).toEqual(['schema.structured-row'])
    expect(ds.issues).toMatchObject([
      { rule: 'schema.structured-row', file: rel, id: 'row 3', line: 3, path: 'vote' },
    ])
    expect(ds.structured['unga_votes.csv']).toMatchObject([
      { file: rel, line: 2, value: { iso3: 'FRA', vote: 'Y' } },
    ])
  })

  it("'schema.archive-index': the row is reported with its src_id and line; valid rows load", () => {
    appendFileSync(
      join(root, INDEX_FILE),
      `${BAD_SOURCE_ID},https://example.org/x,,nothex,12,2026-09-26T22:58:53Z,text/html\n`,
    )
    const ds = load()
    expect(rulesIn(ds.issues)).toEqual(['schema.archive-index'])
    expect(ds.issues).toMatchObject([
      {
        rule: 'schema.archive-index',
        file: INDEX_FILE,
        id: BAD_SOURCE_ID,
        line: 4,
        path: 'sha256',
      },
    ])
    expect(ds.invalidIds).toEqual(new Set([BAD_SOURCE_ID]))
    expect(ds.archiveIndex.map((r) => r.value.src_id)).toEqual([SOURCE_ID, SOURCE_2_ID])
  })

  it("'schema.archive-index': a row with no src_id is reported as `row {line}`", () => {
    appendFileSync(join(root, INDEX_FILE), ',https://example.org/x,,,,,text/html\n')
    const ds = load()
    expect(ds.issues).toMatchObject([
      { rule: 'schema.archive-index', id: 'row 4', line: 4, path: 'src_id' },
    ])
    expect(ds.invalidIds.size).toBe(0)
  })

  it('unknown keys are rejected (strict objects)', () => {
    const { event, source } = templates()
    appendItems(EVENTS_FILE, [{ ...event, id: 'evt_2025_08_09_DEU_A6', point: 10 }])
    const rel = `data/sources/2025/${BAD_SOURCE_ID}.yaml`
    write(rel, stringify({ ...source, id: BAD_SOURCE_ID, publisher_typ: 'mfa' }))
    const ds = load()
    const byRule = (rule: RuleId) => ds.issues.filter((i) => i.rule === rule)
    expect(byRule('schema.event')).toMatchObject([{ id: 'evt_2025_08_09_DEU_A6' }])
    expect(byRule('schema.event')[0]?.message).toContain('point')
    expect(byRule('schema.source')).toMatchObject([{ id: BAD_SOURCE_ID }])
    expect(byRule('schema.source')[0]?.message).toContain('publisher_typ')
  })

  it('an events file holding a mapping instead of a list', () => {
    const { event } = templates()
    write(EVENTS_FILE, stringify(event))
    const ds = load()
    expect(ds.issues).toMatchObject([{ rule: 'schema.event', file: EVENTS_FILE, id: '-' }])
    expect(ds.issues[0]?.message).toBe('expected a YAML list of records')
    expect(ds.events).toEqual([])
  })

  it('an empty events file holds no events and no issue', () => {
    write(EVENTS_FILE, '# nothing yet\n')
    const ds = load()
    expect(ds.issues).toEqual([])
    expect(ds.events).toEqual([])
  })

  it('a YAML syntax error drops the file and keeps the rest of the tree', () => {
    write(EVENTS_FILE, '- id: evt_2025_08_08_DEU_A6\n  scope: [gaza\n')
    const ds = load()
    expect(rulesIn(ds.issues)).toEqual(['load.yaml-syntax'])
    expect(ds.issues[0]).toMatchObject({ file: EVENTS_FILE })
    expect(ds.events).toEqual([])
    expect(ds.sources).toHaveLength(2)
  })

  it('a structured table whose header differs is load.csv-syntax and loads no rows', () => {
    const rel = 'data/structured/gni.csv'
    write(rel, 'iso3,gni_atlas_usd,year,source\nDEU,1,2023,src_20240701_wb_gni\n')
    const ds = load()
    expect(ds.issues).toMatchObject([{ rule: 'load.csv-syntax', file: rel, line: 1 }])
    expect(ds.structured['gni.csv']).toEqual([])
  })
})
