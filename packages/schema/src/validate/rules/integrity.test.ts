/**
 * Tests for the integrity rules across records (validate/rules/records.ts): `record.chronology`
 * (dates that follow each other) and `structured.unique` (keys of the structured tables). Each
 * case starts from the valid fixtures, changes one thing and checks the rule id, file and record
 * id of the issue.
 */
import { describe, expect, it } from 'vitest'
import type { Issue, RuleId } from '../../issues.js'
import type { Dataset, Located } from '../../load/dataset.js'
import type { Methodology } from '../../load/methodology.js'
import type { Correction, Event, Reply, Source } from '../../records.js'
import type { StructuredRow, StructuredTableName } from '../../structured.js'
import { fixtureContext, issuesOf, runRules } from '../../testing/harness.js'
import { rules, STRUCTURED_UNIQUE_KEYS, UNSC_PERMANENT_ISO3 } from './records.js'

type Mutate = (ds: Dataset, m: Methodology) => void

const run = (mutate?: Mutate): Issue[] => runRules(rules, fixtureContext(mutate))
const of = (rule: RuleId, mutate?: Mutate): Issue[] => issuesOf(run(mutate), rule)

const EVENT_ID = 'evt_2025_08_08_DEU_A6'
const EVENTS_FILE = 'data/events/DEU.yaml'
const SOURCE_ID = 'src_20250808_bundesregierung_ruestungsexporte-gaza'
const SOURCE_FILE = `data/sources/2025/${SOURCE_ID}.yaml`
const CORRECTION_ID = 'cor_20260927_1'
const CORRECTIONS_FILE = 'data/corrections.yaml'
const REPLY_ID = 'rep_20260927_DEU_1'
const REPLY_FILE = `data/replies/DEU/${REPLY_ID}.yaml`
const DATASET_ID = 'src_20260901_test-dataset_release-1'

function first<T>(items: Located<T>[], label: string): Located<T> {
  const item = items[0]
  if (item === undefined) throw new Error(`fixture ${label} missing`)
  return item
}

const event = (ds: Dataset): Event => first(ds.events, 'event').value
const source = (ds: Dataset): Source => first(ds.sources, 'source').value
const correction = (ds: Dataset): Correction => first(ds.corrections, 'correction').value
const reply = (ds: Dataset): Reply => first(ds.replies, 'reply').value

/** Appends rows to a structured table, at lines 2, 3… after the rows already there. */
function addRows<T extends StructuredTableName>(
  ds: Dataset,
  table: T,
  rows: StructuredRow<T>[],
): void {
  const list = ds.structured[table] as Located<StructuredRow<T>>[]
  for (const value of rows) {
    list.push({ value, file: `data/structured/${table}`, line: list.length + 2 })
  }
}

// Synthetic rows: the symbols name no real resolution or draft.
const vote = (
  iso3: string,
  patch: Partial<StructuredRow<'unga_votes.csv'>> = {},
): StructuredRow<'unga_votes.csv'> => ({
  resolution: 'A/RES/TEST/1',
  date: '2024-01-10',
  iso3,
  vote: 'Y',
  source: DATASET_ID,
  ...patch,
})

const veto = (
  vetoedBy: string,
  patch: Partial<StructuredRow<'unsc_vetoes.csv'>> = {},
): StructuredRow<'unsc_vetoes.csv'> => ({
  date: '2024-01-11',
  draft: 'S/2099/1',
  vetoed_by: vetoedBy,
  ceasefire: true,
  source: DATASET_ID,
  ...patch,
})

// ---------------------------------------------------------------------------------------------

describe("'record.chronology'", () => {
  it('passes on the fixtures, where every date follows the one before', () => {
    expect(of('record.chronology')).toEqual([])
  })

  it('accepts dates on the same day (retrieved, second-read, reviewed, corrected, received)', () => {
    const issues = of('record.chronology', (ds) => {
      const s = source(ds)
      s.retrieved_at = `${s.date}T00:00:00Z`
      const review = event(ds).review
      review.drafted_at = '2026-09-27'
      review.reviewed_at = '2026-09-27'
      correction(ds).date = '2026-09-27'
      reply(ds).received_at = event(ds).date
    })
    expect(issues).toEqual([])
  })

  it('accepts a capture on the UTC day before the document date (publisher east of UTC)', () => {
    const issues = of('record.chronology', (ds) => {
      source(ds).retrieved_at = '2025-08-07T23:59:59Z'
    })
    expect(issues).toEqual([])
  })

  it('reports a source retrieved before its document date', () => {
    const issues = of('record.chronology', (ds) => {
      source(ds).retrieved_at = '2025-08-06T23:59:59Z'
    })
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({
      level: 'error',
      file: SOURCE_FILE,
      id: SOURCE_ID,
      path: 'retrieved_at',
    })
    expect(issues[0]?.message).toContain('2025-08-08')
  })

  it('does not check a source without retrieved_at (source.archive-required covers it)', () => {
    const issues = of('record.chronology', (ds) => {
      source(ds).retrieved_at = null
    })
    expect(issues).toEqual([])
  })

  it('reports a second reading and a review dated before the drafting', () => {
    const issues = of('record.chronology', (ds) => {
      const review = event(ds).review
      review.drafted_at = '2026-09-28'
      review.second_read = { by: 'claude-opus-5-5', at: '2026-09-27', verdict: 'agree' }
      review.reviewed_at = '2026-09-26'
      // The fixture correction is dated 2026-09-27, before this drafting date too.
      correction(ds).date = '2026-09-28'
    })
    expect(issues.map((i) => [i.file, i.id, i.path])).toEqual([
      [EVENTS_FILE, EVENT_ID, 'review.second_read.at'],
      [EVENTS_FILE, EVENT_ID, 'review.reviewed_at'],
    ])
  })

  it('reports a correction dated before the event was drafted, on the entry', () => {
    const issues = of('record.chronology', (ds) => {
      correction(ds).date = '2026-09-26'
    })
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({
      level: 'error',
      file: CORRECTIONS_FILE,
      id: CORRECTION_ID,
      path: 'date',
    })
    expect(issues[0]?.message).toContain(EVENT_ID)
  })

  it('leaves a correction naming an unknown event to correction.event-known', () => {
    const issues = of('record.chronology', (ds) => {
      const c = correction(ds)
      c.date = '2020-01-01'
      c.event = 'evt_2025_08_08_DEU_A7'
    })
    expect(issues).toEqual([])
  })

  it('reports a reply received before the date of a contested event, at the contested entry', () => {
    const issues = of('record.chronology', (ds) => {
      reply(ds).received_at = '2025-08-07'
    })
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({
      level: 'error',
      file: REPLY_FILE,
      id: REPLY_ID,
      path: 'contests.0',
    })
    expect(issues[0]?.message).toContain('2025-08-08')
  })

  it('reads the date of a generated event from its id, and skips unknown events', () => {
    const generated = of('record.chronology', (ds) => {
      const r = reply(ds)
      r.received_at = '2023-10-26'
      r.contests = ['evt_2023_10_27_DEU_B1_es-10-21']
    })
    expect(generated.map((i) => [i.file, i.id, i.path])).toEqual([
      [REPLY_FILE, REPLY_ID, 'contests.0'],
    ])
    const unknown = of('record.chronology', (ds) => {
      const r = reply(ds)
      r.received_at = '2023-10-26'
      r.contests = ['evt_2025_08_08_DEU_A7']
    })
    expect(unknown).toEqual([])
  })
})

describe("'structured.unique'", () => {
  it('passes on the fixtures and on distinct rows of every table', () => {
    expect(of('structured.unique')).toEqual([])
    const issues = of('structured.unique', (ds) => {
      addRows(ds, 'unga_votes.csv', [
        vote('DEU'),
        vote('FRA'),
        vote('DEU', { resolution: 'A/RES/TEST/2', date: '2024-02-20' }),
      ])
      addRows(ds, 'unsc_vetoes.csv', [
        veto('RUS'),
        veto('CHN', { date: '2024-02-21', draft: 'S/2099/2' }),
        veto('RUS', { date: '2024-02-21', draft: 'S/2099/2' }),
      ])
      const window = { window_start: '2024-01-01', window_end: '2024-12-31' }
      const common = { retrieved_at: '2026-09-01T00:00:00Z', source: DATASET_ID }
      addRows(ds, 'fts_funding.csv', [
        { iso3: 'DEU', ...window, usd_paid_committed: 1, plan_ids: '1', ...common },
        {
          iso3: 'DEU',
          window_start: '2025-01-01',
          window_end: '2025-12-31',
          usd_paid_committed: 1,
          plan_ids: '1',
          ...common,
        },
      ])
      addRows(ds, 'comtrade_a2.csv', [
        {
          iso3: 'DEU',
          ...window,
          release_date: '2025-02-01',
          hs: '93',
          usd: 1,
          reporter: 'self',
          ...common,
        },
        {
          iso3: 'DEU',
          ...window,
          release_date: '2025-02-01',
          hs: '93',
          usd: 1,
          reporter: 'mirror',
          ...common,
        },
        {
          iso3: 'DEU',
          ...window,
          release_date: '2025-02-01',
          hs: '8710',
          usd: 1,
          reporter: 'self',
          ...common,
        },
      ])
      addRows(ds, 'gni.csv', [
        { iso3: 'DEU', year: 2023, gni_atlas_usd: 1, source: DATASET_ID },
        { iso3: 'DEU', year: 2024, gni_atlas_usd: 1, source: DATASET_ID },
      ])
      addRows(ds, 'sipri_deliveries.csv', [
        {
          release_date: '2025-03-10',
          data_year: 2024,
          supplier_iso3: 'DEU',
          tiv_to_israel: 1,
          tiv_total_to_israel: 1,
          source: DATASET_ID,
        },
        {
          release_date: '2026-03-09',
          data_year: 2024,
          supplier_iso3: 'DEU',
          tiv_to_israel: 1,
          tiv_total_to_israel: 1,
          source: DATASET_ID,
        },
      ])
    })
    expect(issues).toEqual([])
  })

  it('reports the later of two rows with the same key, naming the line of the first', () => {
    const issues = of('structured.unique', (ds) => {
      addRows(ds, 'unga_votes.csv', [vote('DEU'), vote('FRA'), vote('DEU', { vote: 'A' })])
    })
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({
      level: 'error',
      file: 'data/structured/unga_votes.csv',
      id: 'row 4',
    })
    expect(issues[0]?.message).toContain('line 2')
    expect(issues[0]?.message).toContain('resolution A/RES/TEST/1, iso3 DEU')
  })

  it('reports duplicates in every table, by its own key', () => {
    const issues = of('structured.unique', (ds) => {
      const window = { window_start: '2024-01-01', window_end: '2024-12-31' }
      const released = { release_date: '2025-02-01' }
      const common = { retrieved_at: '2026-09-01T00:00:00Z', source: DATASET_ID }
      const fts = { iso3: 'DEU', ...window, usd_paid_committed: 1, plan_ids: '1', ...common }
      addRows(ds, 'fts_funding.csv', [fts, { ...fts, usd_paid_committed: 2 }])
      const plan = { iso3: 'DEU', plan_id: '1156', usd_paid_committed: 1, flows: 1, ...common }
      addRows(ds, 'fts_plan_totals.csv', [plan, { ...plan, flows: 2 }])
      const a2 = {
        iso3: 'DEU',
        ...window,
        ...released,
        hs: '93',
        usd: 1,
        reporter: 'self' as const,
        ...common,
      }
      addRows(ds, 'comtrade_a2.csv', [a2, { ...a2, usd: 2 }])
      const c3 = {
        iso3: 'DEU',
        ...window,
        ...released,
        usd_total: 1,
        usd_2022: 1,
        reporter: 'self' as const,
        ...common,
      }
      addRows(ds, 'comtrade_c3.csv', [c3, { ...c3, usd_total: 2 }])
      const deliveries = {
        release_date: '2025-03-10',
        data_year: 2024,
        supplier_iso3: 'DEU',
        tiv_to_israel: 1,
        tiv_total_to_israel: 1,
        source: DATASET_ID,
      }
      addRows(ds, 'sipri_deliveries.csv', [deliveries, { ...deliveries, tiv_to_israel: 2 }])
      const orders = {
        release_date: '2025-03-10',
        data_year: 2024,
        buyer_iso3: 'DEU',
        tiv_new_orders_from_israel: 1,
        source: DATASET_ID,
      }
      addRows(ds, 'sipri_orders.csv', [orders, { ...orders, tiv_new_orders_from_israel: 2 }])
      addRows(ds, 'gni.csv', [
        { iso3: 'DEU', year: 2024, gni_atlas_usd: 1, source: DATASET_ID },
        { iso3: 'DEU', year: 2024, gni_atlas_usd: 2, source: DATASET_ID },
      ])
      addRows(ds, 'population.csv', [
        { iso3: 'DEU', year: 2024, population: 1, source: DATASET_ID },
        { iso3: 'DEU', year: 2024, population: 2, source: DATASET_ID },
      ])
      addRows(ds, 'unsc_vetoes.csv', [veto('USA'), veto('USA', { ceasefire: false })])
      addRows(ds, 'recognitions.csv', [
        { iso3: 'DEU', date: '2024-05-28', source: DATASET_ID },
        { iso3: 'DEU', date: '2024-05-29', source: DATASET_ID },
      ])
      addRows(ds, 'a2_confirmed_military.csv', [
        { iso3: 'DEU', hs: '8526', source: DATASET_ID },
        { iso3: 'DEU', hs: '8526', source: DATASET_ID },
      ])
    })
    expect(issues.map((i) => [i.file, i.id])).toEqual([
      ['data/structured/unsc_vetoes.csv', 'row 3'],
      ['data/structured/fts_funding.csv', 'row 3'],
      ['data/structured/fts_plan_totals.csv', 'row 3'],
      ['data/structured/sipri_deliveries.csv', 'row 3'],
      ['data/structured/sipri_orders.csv', 'row 3'],
      ['data/structured/comtrade_a2.csv', 'row 3'],
      ['data/structured/comtrade_c3.csv', 'row 3'],
      ['data/structured/gni.csv', 'row 3'],
      ['data/structured/population.csv', 'row 3'],
      ['data/structured/recognitions.csv', 'row 3'],
      ['data/structured/a2_confirmed_military.csv', 'row 3'],
    ])
    expect(Object.keys(STRUCTURED_UNIQUE_KEYS)).toHaveLength(12)
  })

  it('reports a resolution or a draft recorded with two dates', () => {
    const issues = of('structured.unique', (ds) => {
      addRows(ds, 'unga_votes.csv', [vote('DEU'), vote('FRA', { date: '2024-01-09' })])
      addRows(ds, 'unsc_vetoes.csv', [veto('RUS'), veto('CHN', { date: '2024-01-12' })])
    })
    expect(issues.map((i) => [i.file, i.id, i.path])).toEqual([
      ['data/structured/unga_votes.csv', 'row 3', 'date'],
      ['data/structured/unsc_vetoes.csv', 'row 3', 'date'],
    ])
    expect(issues[0]?.message).toContain('2024-01-10 at line 2')
  })

  it('reports a veto cast by a state that is not a permanent member', () => {
    for (const iso3 of UNSC_PERMANENT_ISO3) {
      const ok = of('structured.unique', (ds) => addRows(ds, 'unsc_vetoes.csv', [veto(iso3)]))
      expect(ok, iso3).toEqual([])
    }
    const issues = of('structured.unique', (ds) => {
      addRows(ds, 'unsc_vetoes.csv', [veto('DEU')])
    })
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({
      level: 'error',
      file: 'data/structured/unsc_vetoes.csv',
      id: 'row 2',
      path: 'vetoed_by',
    })
    expect(issues[0]?.message).toContain('vetoed_by DEU')
  })
})
