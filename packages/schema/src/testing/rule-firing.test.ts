/**
 * Every registered rule fires through the whole pipeline (loadDataset / loadMethodology →
 * validate), from one mutation of the valid fixtures each.
 *
 * validate/coverage.test.ts checks that each rule id is named in some test file; this table
 * checks that each one is actually produced. `CASES` is typed `Record<RuleId, Case>`, so a rule
 * added to the registry without a case here does not compile, and the last test compares the
 * table with RULE_IDS at run time as well. The mutations are deliberately blunt: each only has to
 * make its rule fire (other rules may fire too); the rule's own test file holds the precise
 * positive and negative cases.
 */
import { appendFileSync, cpSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { type Issue, RULE_IDS, type RuleId } from '../issues.js'
import { type Dataset, loadDataset } from '../load/dataset.js'
import { loadMethodology, type Methodology } from '../load/methodology.js'
import type { Indicator, QualifyingVote } from '../methodology/schemas.js'
import { type Event, Lead, type Source } from '../records.js'
import { STRUCTURED_TABLES } from '../structured.js'
import { buildContext, type ValidationContext } from '../validate/context.js'
import { validate } from '../validate/index.js'
import {
  FIXTURES_ROOT,
  fixtureContext,
  fixtureDataset,
  REPO_ROOT,
  repoMethodology,
  snapshotOf,
} from './harness.js'

type Mutate = (ds: Dataset, m: Methodology) => void

type Case =
  /** Mutates in-memory copies of the fixtures and the methodology. */
  | { memory: Mutate; base?: true; ctx?: (ctx: ValidationContext) => void }
  /** Edits a temporary copy of fixtures/ (data/ and archive/) on disk, then loads it. */
  | { disk: (root: string) => void }
  /** Edits a temporary copy of the current methodology folder on disk, then loads it. */
  | { methodologyDisk: (folder: string) => void }

const SRC_1 = 'src_20250808_bundesregierung_ruestungsexporte-gaza'
const UNKNOWN_EVENT = 'evt_2099_01_01_DEU_A6'

function need<T>(value: T | null | undefined, what: string): T {
  if (value === null || value === undefined) throw new Error(`fixture: ${what} missing`)
  return value
}

const event = (ds: Dataset): Event => need(ds.events[0], 'event').value
const source = (ds: Dataset, i = 0): Source => need(ds.sources[i], `source #${i}`).value
const ind = (m: Methodology, id: string): Indicator =>
  need(
    m.indicators.find((i) => i.id === id),
    `indicator ${id}`,
  )

/** Adds a copy of the fixture event with other fields. */
function addEvent(ds: Dataset, fields: Partial<Event>, line = 900): void {
  const first = need(ds.events[0], 'event')
  ds.events.push({ value: { ...structuredClone(first.value), ...fields }, file: first.file, line })
}

function addLead(ds: Dataset, fields: Record<string, unknown>): void {
  const value = Lead.parse({
    id: 'lead_20260901_DEU_1',
    country: 'DEU',
    indicator: 'A3',
    claim: 'Test lead.',
    sources: [{ url: 'https://example.org/test-lead', publisher: 'Example', kind: 'press' }],
    date: '2026-09-01',
    status: 'open',
    ...fields,
  })
  ds.leads.push({ value, file: 'data/leads/DEU.yaml', line: 1 })
}

function addStructured(ds: Dataset, table: 'unga_votes.csv' | 'fts_funding.csv', record: object) {
  const value = STRUCTURED_TABLES[table].row.parse(record)
  const rows = ds.structured[table] as { value: unknown; file: string; line: number }[]
  rows.push({ value, file: `data/structured/${table}`, line: rows.length + 2 })
}

const append = (root: string, rel: string, text: string | Buffer) =>
  appendFileSync(join(root, rel), text)
const write = (root: string, rel: string, text: string | Buffer) =>
  writeFileSync(join(root, rel), text)

const CASES: Record<RuleId, Case> = {
  // Loading and shape: on disk ---------------------------------------------------------------
  'load.yaml-syntax': {
    disk: (r) => write(r, 'data/events/DEU.yaml', '- id: x\n  scope: [gaza\n'),
  },
  'load.csv-syntax': { disk: (r) => write(r, 'data/structured/gni.csv', 'iso3,year\n') },
  'load.unexpected-file': { disk: (r) => write(r, 'data/foo.txt', 'x\n') },
  'load.missing-file': { disk: (r) => rmSync(join(r, 'data/structured/gni.csv')) },
  'load.misplaced-file': { disk: (r) => write(r, 'data/events/FRA.yml', '[]\n') },
  'load.symlink': { disk: (r) => symlinkSync('..', join(r, 'data/events/loop')) },
  'load.encoding': {
    disk: (r) => write(r, 'data/leads/DEU.yaml', Buffer.from([0x23, 0x20, 0x63, 0xe9, 0x0a])),
  },
  'schema.country': { disk: (r) => append(r, 'data/countries.yaml', '- iso3: xx\n') },
  'schema.event': {
    disk: (r) => append(r, 'data/events/DEU.yaml', '- id: evt_2025_08_09_DEU_A6\n  points: ten\n'),
  },
  'schema.source': {
    disk: (r) =>
      write(
        r,
        'data/sources/2025/src_20250809_test_bad-record.yaml',
        'id: src_20250809_test_bad-record\n',
      ),
  },
  'schema.assessment': { disk: (r) => write(r, 'data/assessments/FRA.yaml', 'country: FRA\n') },
  'schema.correction': {
    disk: (r) => append(r, 'data/corrections.yaml', '- id: cor_20260928_1\n'),
  },
  'schema.reply': {
    disk: (r) => write(r, 'data/replies/DEU/rep_20260928_DEU_2.yaml', 'id: rep_20260928_DEU_2\n'),
  },
  'schema.lead': { disk: (r) => write(r, 'data/leads/DEU.yaml', '- id: lead_20260901_DEU_1\n') },
  'schema.structured-row': {
    disk: (r) =>
      append(r, 'data/structured/unga_votes.csv', `A/RES/ES-10/21,2023-10-27,FRA,Q,${SRC_1}\n`),
  },
  'schema.archive-index': {
    disk: (r) =>
      append(
        r,
        'archive/index.csv',
        'src_20250809_test_bad-record,https://example.org/x,,nothex,12,2026-09-26T22:58:53Z,text/html\n',
      ),
  },
  'schema.methodology': { methodologyDisk: (f) => append(f, 'bands.yaml', 'bogus: 1\n') },

  // Identifiers and layout -------------------------------------------------------------------
  'id.unique': { memory: (ds) => addEvent(ds, {}) },
  'id.date-matches': {
    memory: (ds) => {
      event(ds).date = '2025-08-09'
    },
  },
  'id.parts-match': {
    memory: (ds) => {
      event(ds).indicator = 'A7'
    },
  },
  'layout.file-matches-record': {
    memory: (ds) => {
      need(ds.events[0], 'event').file = 'data/events/FRA.yaml'
    },
  },
  'layout.events-sorted': {
    memory: (ds) => addEvent(ds, { id: 'evt_2025_08_07_DEU_A6', date: '2025-08-07' }),
  },

  // Countries --------------------------------------------------------------------------------
  'country.excluded': {
    memory: (ds) => {
      need(ds.countries[0], 'country').value.excluded = true
    },
  },
  'country.membership-flags': {
    memory: (ds) => {
      need(ds.countries[0], 'country').value.observer = true
    },
  },
  // The fixtures list one scored country of 193: a warning on the unmodified fixtures.
  'country.universe-size': { memory: () => undefined },

  // Events -----------------------------------------------------------------------------------
  'record.chronology': {
    memory: (ds) => {
      source(ds).retrieved_at = '2025-08-01T00:00:00Z'
    },
  },
  'structured.unique': {
    memory: (ds) => {
      const row = {
        resolution: 'A/RES/ES-10/21',
        date: '2023-10-27',
        iso3: 'DEU',
        vote: 'Y',
        source: SRC_1,
      }
      addStructured(ds, 'unga_votes.csv', row)
      addStructured(ds, 'unga_votes.csv', row)
    },
  },
  'event.country-known': {
    memory: (ds) => {
      event(ds).country = 'XYZ'
    },
  },
  'event.indicator-known': {
    memory: (ds) => {
      event(ds).indicator = 'F9'
    },
  },
  'event.type-matches-indicator': {
    memory: (ds) => {
      event(ds).type = 'repeatable'
    },
  },
  'event.not-generated': {
    memory: (ds) => {
      event(ds).generated = true
    },
  },
  'event.points-sign': {
    memory: (ds) => {
      event(ds).points = -10
    },
  },
  'event.points-range': {
    memory: (ds) => {
      event(ds).points = 11
    },
  },
  'event.points-rationale': {
    memory: (ds) => {
      const e = event(ds) as Event & { points_rationale?: unknown }
      e.indicator = 'B12'
      e.points = 5
      delete e.points_rationale
    },
  },
  'event.date-in-window': {
    memory: (ds) => {
      const e = event(ds)
      e.type = 'repeatable'
      e.indicator = 'B4'
      e.points = -15
      e.date = '2023-10-06'
    },
  },
  'event.end': {
    memory: (ds) => {
      event(ds).end = '2025-01-01'
    },
  },
  'event.confirmed-source-kind': {
    memory: (ds) => {
      for (const s of ds.sources) s.value.kind = 'press'
    },
  },
  'event.corroborated-publishers': {
    memory: (ds) => {
      event(ds).confidence = 'corroborated'
    },
  },
  'event.disputed-both-sides': {
    memory: (ds) => {
      const e = event(ds)
      e.confidence = 'disputed'
      e.evidence = e.evidence.slice(0, 1)
      ds.replies = []
    },
  },
  'event.statement-requirements': {
    memory: (ds) => {
      const e = event(ds)
      e.indicator = 'B9'
      e.type = 'repeatable'
      if (e.actor) delete (e.actor as { name?: string }).name
    },
  },
  'event.statement-duplicate': {
    memory: (ds) => {
      const e = event(ds)
      e.indicator = 'B10'
      e.type = 'repeatable'
      addEvent(ds, { id: 'evt_2025_08_08_DEU_B10_2' })
    },
  },
  'event.quote-in-archive': {
    memory: (ds) => {
      need(event(ds).evidence[0], 'evidence').quote = 'Dieser Satz steht nicht im Text.'
    },
  },
  'event.quote-translation': {
    memory: (ds) => {
      delete (need(event(ds).evidence[0], 'evidence') as { quote_en?: string }).quote_en
    },
  },
  'event.evidence-source-known': {
    memory: (ds) => {
      need(event(ds).evidence[0], 'evidence').source = 'src_20990101_test_unknown'
    },
  },
  'event.evidence-archived': {
    memory: (ds) => {
      source(ds).wayback_url = null
    },
  },
  'event.video-locator': {
    memory: (ds) => {
      source(ds).kind = 'official-video'
    },
  },
  'event.published-reviewed': {
    memory: (ds) => {
      ;(event(ds).review as unknown as Record<string, unknown>).reviewed_by = null
    },
  },
  'event.second-read': {
    memory: (ds) => {
      ;(event(ds).review as unknown as Record<string, unknown>).second_read = null
    },
  },
  'event.references': {
    memory: (ds) => {
      event(ds).related = [UNKNOWN_EVENT]
    },
  },
  'event.same-points': {
    memory: (ds) => addEvent(ds, { id: 'evt_2025_08_08_DEU_A6_2', points: 5 }),
  },

  // Tone -------------------------------------------------------------------------------------
  'tone.banned-word': {
    memory: (ds) => {
      event(ds).summary.en = 'The Federal Chancellor stated a brutal decision.'
    },
  },
  'tone.exclamation': {
    memory: (ds) => {
      event(ds).summary.en = 'The Federal Chancellor stated a decision!'
    },
  },
  'tone.length': {
    memory: (ds) => {
      event(ds).summary.en = `The Federal Chancellor stated ${'a decision, '.repeat(30)}and more.`
    },
  },
  'tone.actor-first': {
    memory: (ds) => {
      event(ds).summary.en = 'On 8 August 2025, the Federal Chancellor stated a decision.'
    },
  },
  'tone.site-voice': {
    memory: (ds) => {
      need(ds.corrections[0], 'correction').value.reason = 'Test fixture. A brutal change.'
    },
  },

  // Sources ----------------------------------------------------------------------------------
  'source.archive-required': {
    memory: (ds) => {
      source(ds).sha256 = null
    },
  },
  'source.text-file': {
    memory: (ds) => {
      source(ds).text_file = 'archive/text/other.txt'
    },
  },
  'source.archive-index': {
    memory: (ds) => {
      need(ds.archiveIndex[0], 'index row').value.sha256 = 'f'.repeat(64)
    },
  },
  'source.dataset-origin': {
    memory: (ds) => {
      const id = 'src_20240101_test_unga-row'
      const value = { ...structuredClone(source(ds)), id, kind: 'dataset' as const }
      value.url = 'data/structured/unga_votes.csv'
      value.date = '2024-01-01'
      ds.sources.push({ value, file: `data/sources/2024/${id}.yaml`, line: 1 })
    },
  },
  'source.orphan': {
    memory: (ds) => {
      const id = 'src_20250808_bundesregierung_unused-copy'
      ds.sources.push({
        value: { ...structuredClone(source(ds)), id },
        file: `data/sources/2025/${id}.yaml`,
        line: 1,
      })
    },
  },

  // Assessments ------------------------------------------------------------------------------
  'assessment.country-known': {
    memory: (ds) => {
      need(ds.assessments[0], 'assessment').value.country = 'XYZ'
    },
  },
  'assessment.indicator-known': {
    memory: (ds) => {
      const a = need(ds.assessments[0], 'assessment').value
      ;(a.indicators as Record<string, unknown>).Z9 = { status: 'unchecked' }
    },
  },
  'assessment.checked-evidence': {
    memory: (ds) => {
      const a = need(ds.assessments[0], 'assessment').value
      ;(a.indicators as Record<string, unknown>).A1 = { status: 'none-found' }
    },
  },
  'assessment.not-applicable': {
    memory: (ds) => {
      const a = need(ds.assessments[0], 'assessment').value
      ;(a.indicators as Record<string, unknown>).A1 = { status: 'not-applicable' }
    },
  },
  'assessment.has-events-mismatch': {
    memory: (ds) => {
      const a = need(ds.assessments[0], 'assessment').value
      ;(a.indicators as Record<string, unknown>).A7 = { status: 'has-events' }
    },
  },
  // The fixture assessment leaves most indicators unchecked: a warning on the fixtures.
  'assessment.unchecked': { memory: () => undefined },

  // Corrections and history ------------------------------------------------------------------
  'correction.event-known': {
    memory: (ds) => {
      need(ds.corrections[0], 'correction').value.event = UNKNOWN_EVENT
    },
  },
  'correction.kind-consistent': {
    memory: (ds) => {
      need(ds.corrections[0], 'correction').value.kind = 'retraction'
    },
  },
  'correction.required-on-edit': {
    base: true,
    memory: (ds) => {
      event(ds).points = 8
    },
  },
  'correction.never-delete': {
    base: true,
    memory: (ds) => {
      ds.events = []
    },
  },
  'correction.append-only': {
    base: true,
    memory: (ds) => {
      need(ds.corrections[0], 'correction').value.reason = 'Test fixture. Edited.'
    },
  },
  'correction.status-regression': {
    base: true,
    memory: (ds) => {
      event(ds).status = 'draft'
    },
  },
  'correction.base-unavailable': {
    memory: () => undefined,
    ctx: (ctx) => {
      ctx.baseError = 'test: no base'
    },
  },

  // Replies and leads ------------------------------------------------------------------------
  'reply.deadline': {
    memory: (ds) => {
      need(ds.replies[0], 'reply').value.published_at = '2026-12-31'
    },
  },
  'reply.contests-known': {
    memory: (ds) => {
      need(ds.replies[0], 'reply').value.contests = [UNKNOWN_EVENT]
    },
  },
  'reply.outcome-consistent': {
    memory: (ds) => {
      need(ds.replies[0], 'reply').value.outcome = 'retracted'
    },
  },
  'lead.status': { memory: (ds) => addLead(ds, { status: `promoted:${UNKNOWN_EVENT}` }) },
  'lead.source-kind': { memory: (ds) => addLead(ds, { sources: [{ source: SRC_1 }] }) },

  // Structured tables ------------------------------------------------------------------------
  'structured.source-dataset': {
    memory: (ds) =>
      addStructured(ds, 'unga_votes.csv', {
        resolution: 'A/RES/ES-10/21',
        date: '2023-10-27',
        iso3: 'DEU',
        vote: 'Y',
        source: SRC_1,
      }),
  },
  'structured.iso3-known': {
    memory: (ds) =>
      addStructured(ds, 'unga_votes.csv', {
        resolution: 'A/RES/ES-10/21',
        date: '2023-10-27',
        iso3: 'XYZ',
        vote: 'Y',
        source: SRC_1,
      }),
  },
  'structured.window': {
    memory: (ds) =>
      addStructured(ds, 'fts_funding.csv', {
        iso3: 'DEU',
        window_start: '2024-12-31',
        window_end: '2024-01-01',
        usd_paid_committed: '1',
        plan_ids: '1185',
        retrieved_at: '2026-09-01T00:00:00Z',
        source: SRC_1,
      }),
  },

  // Methodology ------------------------------------------------------------------------------
  'methodology.version': {
    memory: (_ds, m) => {
      need(m.categories, 'categories.yaml').value.version = '9.9.9'
    },
  },
  'methodology.indicator-set': {
    memory: (_ds, m) => {
      m.indicators.push(structuredClone(ind(m, 'A1')))
    },
  },
  'methodology.indicator-points': {
    memory: (_ds, m) => {
      ;(ind(m, 'A1').points as { ref?: string }).ref = 'zz'
    },
  },
  'methodology.indicator-caps': {
    memory: (_ds, m) => {
      ind(m, 'A5').indicator_cap = null
    },
  },
  'methodology.thresholds': {
    memory: (_ds, m) => {
      const formulas = need(m.thresholds, 'thresholds.yaml').value.formulas
      ;(need(formulas.a1, 'formula a1') as { indicator: string }).indicator = 'D9'
    },
  },
  'methodology.categories': {
    memory: (_ds, m) => {
      const file = need(m.categories, 'categories.yaml').value
      file.categories = file.categories.filter((c) => c.id !== 'E')
    },
  },
  'methodology.bands': {
    memory: (_ds, m) => {
      need(need(m.bands, 'bands.yaml').value.bands[0], 'band').max -= 1
    },
  },
  'methodology.confidence': {
    memory: (_ds, m) => {
      const levels = need(m.confidence, 'confidence.yaml').value.levels
      need(
        levels.find((l) => l.id === 'confirmed'),
        'confirmed',
      ).weight = 0.9
    },
  },
  'methodology.decay': {
    memory: (_ds, m) => {
      need(m.decay, 'decay.yaml').value.plateau_days = 800
    },
  },
  'methodology.passivity': {
    memory: (_ds, m) => {
      need(m.passivity, 'passivity.yaml').value.qualifying_indicators.push('Z9')
    },
  },
  'methodology.votes': {
    memory: (_ds, m) => {
      const vote: QualifyingVote = {
        symbol: 'A/RES/TEST/1',
        kind: 'resolution',
        date: '2023-10-06',
        title: { en: 'Test fixture vote', fr: 'Vote de test' },
        subject: 'gaza',
        counts: { yes: 0, no: 0, abstain: 0 },
        source: SRC_1,
        rationale: { en: 'Test fixture.', fr: 'Donnée de test.' },
      } as QualifyingVote
      need(m.votes, 'votes.yaml').value.votes.push(vote)
    },
  },
  'methodology.symmetry': {
    memory: (_ds, m) => {
      const file = need(m.symmetry, 'symmetry.yaml').value
      file.pairs = file.pairs.filter((p) => !p.negative.includes('D2'))
    },
  },
  'methodology.banned-words': {
    memory: (_ds, m) => {
      need(m.bannedWords, 'banned-words.txt').entries = []
    },
  },
  'methodology.docs-generated': {
    memory: (_ds, m) => {
      const doc = need(m.docs.en, 'methodology.en.md')
      doc.text = doc.text.replace(/(<!-- BEGIN generated:\w+ -->\n)/, '$1hand edit\n')
    },
  },
}

let tmp: string | undefined

afterEach(() => {
  if (tmp) rmSync(tmp, { recursive: true, force: true })
  tmp = undefined
})

function issuesFor(c: Case): Issue[] {
  if ('disk' in c) {
    tmp = mkdtempSync(join(tmpdir(), 'gai-firing-'))
    cpSync(FIXTURES_ROOT, tmp, { recursive: true })
    c.disk(tmp)
    return validate(buildContext(loadDataset(tmp), repoMethodology()))
  }
  if ('methodologyDisk' in c) {
    tmp = mkdtempSync(join(tmpdir(), 'gai-firing-'))
    const folder = repoMethodology().folder
    cpSync(join(REPO_ROOT, folder), join(tmp, folder), { recursive: true })
    c.methodologyDisk(join(tmp, folder))
    return validate(buildContext(fixtureDataset(), loadMethodology(tmp)))
  }
  const base = c.base ? { base: snapshotOf(fixtureDataset()) } : {}
  const ctx = fixtureContext(c.memory, base)
  c.ctx?.(ctx)
  return validate(ctx)
}

describe('every registered rule fires through validate()', () => {
  it.each(RULE_IDS)('%s', (rule) => {
    const issues = issuesFor(CASES[rule])
    const fired = [...new Set(issues.map((i) => i.rule))].sort()
    expect(fired, `${rule} did not fire; fired: ${fired.join(', ')}`).toContain(rule)
  })

  it('the table has exactly one case per registered rule', () => {
    expect(Object.keys(CASES).sort()).toEqual([...RULE_IDS].sort())
  })
})
