/**
 * Tests for the identifier, layout, country, assessment, reply, lead and structured-table rules
 * (validate/rules/records.ts). Each case starts from the valid fixtures, changes one thing and
 * checks the rule id, file and record id of the issue.
 */
import { describe, expect, it } from 'vitest'
import { type Issue, issue, type RuleId } from '../../issues.js'
import type { Dataset, Located } from '../../load/dataset.js'
import type { Methodology } from '../../load/methodology.js'
import type { AssessmentEntry, Country, Lead, Source } from '../../records.js'
import { cloneEvent, fixtureContext, issuesOf, runRules } from '../../testing/harness.js'
import { compareEventOrder, rules } from './records.js'

type Mutate = (ds: Dataset, m: Methodology) => void

const run = (mutate?: Mutate): Issue[] => runRules(rules, fixtureContext(mutate))
const of = (rule: RuleId, mutate?: Mutate): Issue[] => issuesOf(run(mutate), rule)

const EVENT_ID = 'evt_2025_08_08_DEU_A6'
const EVENTS_FILE = 'data/events/DEU.yaml'
const SOURCE_ID = 'src_20250808_bundesregierung_ruestungsexporte-gaza'
const SOURCE_FILE = `data/sources/2025/${SOURCE_ID}.yaml`
const REPLY_ID = 'rep_20260927_DEU_1'
const REPLY_FILE = `data/replies/DEU/${REPLY_ID}.yaml`
const CORRECTION_ID = 'cor_20260927_1'
const ASSESSMENT_FILE = 'data/assessments/DEU.yaml'
const COUNTRIES_FILE = 'data/countries.yaml'
const LEAD_ID = 'lead_20260901_DEU_1'
const LEADS_FILE = 'data/leads/DEU.yaml'
const DATASET_ID = 'src_20260901_test-dataset_release-1'

// ---------------------------------------------------------------------------------------------
// Builders (clones of fixture records, changed in memory only)

function first<T>(items: Located<T>[], label: string): Located<T> {
  const item = items[0]
  if (item === undefined) throw new Error(`fixture ${label} missing`)
  return item
}

function countryOf(ds: Dataset, iso3: string): Located<Country> {
  const c = ds.countries.find((x) => x.value.iso3 === iso3)
  if (c === undefined) throw new Error(`fixture country ${iso3} missing`)
  return c
}

function entries(ds: Dataset): Record<string, AssessmentEntry> {
  return first(ds.assessments, 'assessment').value.indicators
}

function lead(overrides: Partial<Lead> = {}): Lead {
  return {
    id: LEAD_ID,
    country: 'DEU',
    indicator: 'A3',
    claim: 'Test lead.',
    sources: [{ url: 'https://example.org/test-lead', publisher: 'Example', kind: 'press' }],
    date: '2026-09-01',
    status: 'open',
    ...overrides,
  }
}

function addLead(ds: Dataset, overrides: Partial<Lead> = {}, file = LEADS_FILE): void {
  ds.leads.push({ value: lead(overrides), file, line: 1 })
}

/** A copy of the first fixture source with another id, kind and date. */
function addSource(ds: Dataset, id: string, kind: Source['kind'], date: string): void {
  const value: Source = { ...structuredClone(first(ds.sources, 'source').value), id, kind, date }
  ds.sources.push({ value, file: `data/sources/${date.slice(0, 4)}/${id}.yaml`, line: 1 })
}

function addFtsRow(
  ds: Dataset,
  row: { iso3?: string; source?: string; window_start?: string; window_end?: string } = {},
): void {
  ds.structured['fts_funding.csv'].push({
    value: {
      iso3: row.iso3 ?? 'DEU',
      window_start: row.window_start ?? '2024-01-01',
      window_end: row.window_end ?? '2024-12-31',
      usd_paid_committed: 1000,
      plan_ids: '1156',
      retrieved_at: '2026-09-01T00:00:00Z',
      source: row.source ?? DATASET_ID,
    },
    file: 'data/structured/fts_funding.csv',
    line: 2,
  })
}

/** `n` distinct three-letter codes that are not DEU, ISR or PSE. */
function codes(n: number): string[] {
  const out: string[] = []
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  for (const a of letters) {
    for (const b of letters) {
      if (out.length === n) return out
      out.push(`Q${a}${b}`)
    }
  }
  return out
}

function addCountries(ds: Dataset, n: number): void {
  const deu = countryOf(ds, 'DEU')
  codes(n).forEach((iso3, i) => {
    ds.countries.push({
      value: { ...structuredClone(deu.value), iso3 },
      file: COUNTRIES_FILE,
      line: 1000 + i,
    })
  })
}

/** Marks every scored indicator of the DEU assessment as checked. */
function checkEverything(ds: Dataset, m: Methodology): void {
  const ind = entries(ds)
  for (const i of m.indicators) {
    if (!i.scored || i.id === 'A6' || i.id === 'B2') continue
    ind[i.id] = { status: 'none-found', checked_at: '2026-09-27', note: 'Test fixture.' }
  }
}

// ---------------------------------------------------------------------------------------------

describe('fixtures', () => {
  it('produce no error from the record rules', () => {
    expect(run().filter((i) => i.level === 'error')).toEqual([])
  })

  it('do not throw when indicators.yaml failed to load', () => {
    const issues = run((_ds, m) => {
      m.indicatorsFile = null
      m.indicators = []
    })
    expect(issues.filter((i) => i.level === 'error')).toEqual([])
  })
})

describe("'id.unique'", () => {
  it('passes on the fixtures', () => {
    expect(of('id.unique')).toEqual([])
  })

  const cases: [string, (ds: Dataset) => void, string, string][] = [
    [
      'country',
      (ds) => {
        const c = countryOf(ds, 'DEU')
        ds.countries.push({ ...structuredClone(c), line: 900 })
      },
      COUNTRIES_FILE,
      'DEU',
    ],
    [
      'event',
      (ds) => ds.events.push({ value: cloneEvent(ds), file: EVENTS_FILE, line: 900 }),
      EVENTS_FILE,
      EVENT_ID,
    ],
    [
      'source',
      (ds) => ds.sources.push({ ...structuredClone(first(ds.sources, 'source')), line: 900 }),
      SOURCE_FILE,
      SOURCE_ID,
    ],
    [
      'correction',
      (ds) =>
        ds.corrections.push({ ...structuredClone(first(ds.corrections, 'correction')), line: 900 }),
      'data/corrections.yaml',
      CORRECTION_ID,
    ],
    [
      'reply',
      (ds) => ds.replies.push({ ...structuredClone(first(ds.replies, 'reply')), line: 900 }),
      REPLY_FILE,
      REPLY_ID,
    ],
    [
      'lead',
      (ds) => {
        addLead(ds)
        ds.leads.push({ value: lead(), file: LEADS_FILE, line: 900 })
      },
      LEADS_FILE,
      LEAD_ID,
    ],
    [
      'assessment',
      (ds) =>
        ds.assessments.push({ ...structuredClone(first(ds.assessments, 'assessment')), line: 900 }),
      ASSESSMENT_FILE,
      'DEU',
    ],
  ]

  it.each(cases)('reports a duplicate %s at the second occurrence', (_kind, add, file, id) => {
    const issues = of('id.unique', add)
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({ rule: 'id.unique', file, id, line: 900 })
  })

  it('reports every occurrence after the first', () => {
    const issues = of('id.unique', (ds) => {
      ds.events.push({ value: cloneEvent(ds), file: EVENTS_FILE, line: 900 })
      ds.events.push({ value: cloneEvent(ds), file: EVENTS_FILE, line: 950 })
    })
    expect(issues.map((i) => i.line)).toEqual([900, 950])
  })
})

describe("'id.date-matches'", () => {
  it('passes on the fixtures', () => {
    expect(of('id.date-matches')).toEqual([])
  })

  it('reports an event whose date differs from its id', () => {
    const issues = of('id.date-matches', (ds) => {
      first(ds.events, 'event').value.date = '2025-08-09'
    })
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({ file: EVENTS_FILE, id: EVENT_ID, path: 'date' })
  })

  it('accepts a corrected event date when the corrections go from the id date to the current date', () => {
    const issues = of('id.date-matches', (ds) => {
      first(ds.events, 'event').value.date = '2025-08-09'
      const c = first(ds.corrections, 'correction').value
      c.before = { ...c.before, date: '2025-08-08' }
      c.after = { ...c.after, date: '2025-08-09' }
    })
    expect(issues).toEqual([])
  })

  it('reads several corrections of the date as a chain in log order', () => {
    const chain = (lastAfter: string) =>
      of('id.date-matches', (ds) => {
        first(ds.events, 'event').value.date = '2025-08-10'
        const c = first(ds.corrections, 'correction').value
        c.before = { ...c.before, date: '2025-08-08' }
        c.after = { ...c.after, date: '2025-08-09' }
        ds.corrections.push({
          value: {
            ...structuredClone(c),
            id: 'cor_20260928_1',
            date: '2026-09-28',
            before: { date: '2025-08-09' },
            after: { date: lastAfter },
          },
          file: 'data/corrections.yaml',
          line: 30,
        })
      })
    expect(chain('2025-08-10')).toEqual([])
    expect(chain('2025-08-11').map((i) => i.id)).toEqual([EVENT_ID])
  })

  it('reports a date that the corrections do not account for', () => {
    const cases: [string, Record<string, unknown>, Record<string, unknown>][] = [
      // Only one side of the change is recorded.
      ['2025-08-09', { date: '2025-08-08' }, {}],
      ['2025-08-09', {}, { date: '2025-08-08' }],
      // The entry records a change to another date than the event's (case e4).
      ['2025-07-01', { date: '2025-08-08' }, { date: '2025-08-09' }],
      // The entry does not start from the id date.
      ['2025-08-09', { date: '2025-08-07' }, { date: '2025-08-09' }],
    ]
    for (const [date, before, after] of cases) {
      const issues = of('id.date-matches', (ds) => {
        first(ds.events, 'event').value.date = date
        const c = first(ds.corrections, 'correction').value
        c.before = { ...c.before, ...before }
        c.after = { ...c.after, ...after }
      })
      expect(issues, JSON.stringify([date, before, after])).toHaveLength(1)
      expect(issues[0]).toMatchObject({ file: EVENTS_FILE, id: EVENT_ID, path: 'date' })
    }
  })

  it('does not accept a correction of another event as the reason', () => {
    const issues = of('id.date-matches', (ds) => {
      first(ds.events, 'event').value.date = '2025-08-09'
      const c = first(ds.corrections, 'correction').value
      c.event = 'evt_2025_08_08_DEU_A7'
      c.before = { date: '2025-08-08' }
    })
    expect(issues.map((i) => i.id)).toEqual([EVENT_ID])
  })

  it('reports a source, correction, reply and lead whose date differs from the id', () => {
    const issues = of('id.date-matches', (ds) => {
      first(ds.sources, 'source').value.date = '2025-08-07'
      first(ds.corrections, 'correction').value.date = '2026-09-28'
      first(ds.replies, 'reply').value.received_at = '2026-09-26'
      addLead(ds, { date: '2026-09-02' })
    })
    expect(issues.map((i) => [i.file, i.id, i.path])).toEqual([
      [SOURCE_FILE, SOURCE_ID, 'date'],
      ['data/corrections.yaml', CORRECTION_ID, 'date'],
      [REPLY_FILE, REPLY_ID, 'received_at'],
      [LEADS_FILE, LEAD_ID, 'date'],
    ])
  })
})

describe("'id.parts-match'", () => {
  it('passes on the fixtures and on a matching lead', () => {
    expect(of('id.parts-match', (ds) => addLead(ds))).toEqual([])
  })

  it('reports an event whose country or indicator differs from its id', () => {
    const issues = of('id.parts-match', (ds) => {
      const e = first(ds.events, 'event').value
      e.country = 'FRA'
      e.indicator = 'A7'
    })
    expect(issues.map((i) => [i.file, i.id, i.path])).toEqual([
      [EVENTS_FILE, EVENT_ID, 'country'],
      [EVENTS_FILE, EVENT_ID, 'indicator'],
    ])
  })

  it('reports a reply and a lead whose country differs from the id', () => {
    const issues = of('id.parts-match', (ds) => {
      first(ds.replies, 'reply').value.country = 'FRA'
      addLead(ds, { country: 'FRA' })
    })
    expect(issues.map((i) => [i.file, i.id])).toEqual([
      [REPLY_FILE, REPLY_ID],
      [LEADS_FILE, LEAD_ID],
    ])
  })
})

describe("'layout.file-matches-record'", () => {
  it('passes on the fixtures and on a lead in its country file', () => {
    expect(of('layout.file-matches-record', (ds) => addLead(ds))).toEqual([])
  })

  it('reports each record kind in the wrong file', () => {
    const issues = of('layout.file-matches-record', (ds) => {
      first(ds.events, 'event').file = 'data/events/FRA.yaml'
      first(ds.sources, 'source').file = `data/sources/2026/${SOURCE_ID}.yaml`
      first(ds.assessments, 'assessment').file = 'data/assessments/FRA.yaml'
      first(ds.replies, 'reply').file = `data/replies/FRA/${REPLY_ID}.yaml`
      addLead(ds, {}, 'data/leads/FRA.yaml')
    })
    expect(issues.map((i) => [i.file, i.id])).toEqual([
      ['data/events/FRA.yaml', EVENT_ID],
      [`data/sources/2026/${SOURCE_ID}.yaml`, SOURCE_ID],
      ['data/assessments/FRA.yaml', 'DEU'],
      [`data/replies/FRA/${REPLY_ID}.yaml`, REPLY_ID],
      ['data/leads/FRA.yaml', LEAD_ID],
    ])
  })

  it('reports a source file whose name is not the id', () => {
    const issues = of('layout.file-matches-record', (ds) => {
      first(ds.sources, 'source').file = 'data/sources/2025/src_20250808_other_name.yaml'
    })
    expect(issues.map((i) => i.id)).toEqual([SOURCE_ID])
  })
})

describe("'layout.events-sorted'", () => {
  const later = (ds: Dataset, id: string, date: string) => {
    const e = cloneEvent(ds)
    e.id = id
    e.date = date
    return { value: e, file: EVENTS_FILE, line: 1 }
  }

  it('passes on the fixtures and on same-date events sorted by id', () => {
    expect(of('layout.events-sorted')).toEqual([])
    const issues = of('layout.events-sorted', (ds) => {
      ds.events.push(later(ds, `${EVENT_ID}_2`, '2025-08-08'))
      ds.events.push(later(ds, 'evt_2025_09_01_DEU_A6', '2025-09-01'))
    })
    expect(issues).toEqual([])
  })

  it('reports the first event that comes before an earlier date', () => {
    const issues = of('layout.events-sorted', (ds) => {
      ds.events.unshift(later(ds, 'evt_2025_09_01_DEU_A6', '2025-09-01'))
      ds.events.push(later(ds, 'evt_2025_01_01_DEU_A6', '2025-01-01'))
    })
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({ file: EVENTS_FILE, id: EVENT_ID })
  })

  it('reports same-date events out of id order', () => {
    const issues = of('layout.events-sorted', (ds) => {
      ds.events.unshift(later(ds, `${EVENT_ID}_2`, '2025-08-08'))
    })
    expect(issues.map((i) => i.id)).toEqual([EVENT_ID])
  })

  it('checks each file on its own', () => {
    const issues = of('layout.events-sorted', (ds) => {
      const e = later(ds, 'evt_2024_01_01_FRA_A6', '2024-01-01')
      e.value.country = 'FRA'
      ds.events.push({ ...e, file: 'data/events/FRA.yaml' })
    })
    expect(issues).toEqual([])
  })

  it('orders by date, then id in natural order', () => {
    const a = { date: '2025-01-01', id: 'evt_2025_01_01_DEU_B1' }
    const b = { date: '2025-01-01', id: 'evt_2025_01_01_DEU_B10' }
    expect(compareEventOrder(a, b)).toBe(-1)
    expect(compareEventOrder(b, a)).toBe(1)
    expect(compareEventOrder(a, { ...a })).toBe(0)
    expect(compareEventOrder({ ...b, date: '2024-12-31' }, a)).toBe(-1)
    const b9 = { date: '2025-01-01', id: 'evt_2025_01_01_DEU_B9' }
    expect(compareEventOrder(b9, b)).toBe(-1)
    const n9 = { date: '2025-01-01', id: 'evt_2025_01_01_DEU_A6_9' }
    const n10 = { date: '2025-01-01', id: 'evt_2025_01_01_DEU_A6_10' }
    expect(compareEventOrder(n9, n10)).toBe(-1)
    expect(compareEventOrder({ ...n9, id: 'evt_2025_01_01_DEU_A6' }, n9)).toBe(-1)
  })

  it('accepts instances _2 … _9, _10 and indicators B9, B10 of one date in natural order', () => {
    const issues = of('layout.events-sorted', (ds) => {
      for (const n of [2, 3, 4, 5, 6, 7, 8, 9, 10, 11]) {
        ds.events.push(later(ds, `${EVENT_ID}_${n}`, '2025-08-08'))
      }
      ds.events.push(later(ds, 'evt_2025_09_01_DEU_B9', '2025-09-01'))
      ds.events.push(later(ds, 'evt_2025_09_01_DEU_B10', '2025-09-01'))
    })
    expect(issues).toEqual([])
  })

  it('reports _10 before _9, and B10 before B9, of one date', () => {
    const instances = of('layout.events-sorted', (ds) => {
      ds.events.push(later(ds, `${EVENT_ID}_10`, '2025-08-08'))
      ds.events.push(later(ds, `${EVENT_ID}_9`, '2025-08-08'))
    })
    expect(instances.map((i) => i.id)).toEqual([`${EVENT_ID}_9`])
    const indicators = of('layout.events-sorted', (ds) => {
      ds.events.push(later(ds, 'evt_2025_09_01_DEU_B10', '2025-09-01'))
      ds.events.push(later(ds, 'evt_2025_09_01_DEU_B9', '2025-09-01'))
    })
    expect(indicators.map((i) => i.id)).toEqual(['evt_2025_09_01_DEU_B9'])
  })
})

describe("'country.excluded'", () => {
  it('passes on the fixtures', () => {
    expect(of('country.excluded')).toEqual([])
  })

  it('reports an excluded entry other than ISR and PSE', () => {
    const issues = of('country.excluded', (ds) => {
      const deu = countryOf(ds, 'DEU').value
      deu.excluded = true
      deu.excluded_reason = { en: 'Test.', fr: 'Test.' }
    })
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({ file: COUNTRIES_FILE, id: 'DEU', path: 'excluded' })
  })

  it('reports an excluded entry without excluded_reason', () => {
    const issues = of('country.excluded', (ds) => {
      delete countryOf(ds, 'ISR').value.excluded_reason
    })
    expect(issues.map((i) => [i.id, i.path])).toEqual([['ISR', 'excluded_reason']])
  })

  it('reports excluded_reason on an entry that is not excluded', () => {
    const issues = of('country.excluded', (ds) => {
      countryOf(ds, 'DEU').value.excluded_reason = { en: 'Test.', fr: 'Test.' }
    })
    expect(issues.map((i) => [i.id, i.path])).toEqual([['DEU', 'excluded_reason']])
  })

  it('reports ISR or PSE missing from the registry', () => {
    const issues = of('country.excluded', (ds) => {
      ds.countries = ds.countries.filter((c) => !['ISR', 'PSE'].includes(c.value.iso3))
    })
    expect(issues.map((i) => [i.file, i.id])).toEqual([
      [COUNTRIES_FILE, 'ISR'],
      [COUNTRIES_FILE, 'PSE'],
    ])
  })

  it('does not report ISR or PSE missing when the registry cannot be read or the entry is invalid', () => {
    const unreadable = of('country.excluded', (ds) => {
      ds.countries = []
      ds.issues.push(issue('load.yaml-syntax', { file: COUNTRIES_FILE }, 'bad YAML'))
    })
    expect(unreadable).toEqual([])
    const invalid = of('country.excluded', (ds) => {
      ds.countries = ds.countries.filter((c) => c.value.iso3 !== 'ISR')
      ds.invalidIds.add('ISR')
      ds.invalid.country.add('ISR')
    })
    expect(invalid).toEqual([])
  })

  it('reports ISR or PSE when not excluded', () => {
    const issues = of('country.excluded', (ds) => {
      const pse = countryOf(ds, 'PSE').value
      pse.excluded = false
      delete pse.excluded_reason
    })
    expect(issues.map((i) => [i.id, i.path])).toEqual([['PSE', 'excluded']])
  })
})

describe("'country.membership-flags'", () => {
  it('passes on the fixtures and on valid terms and dated memberships', () => {
    expect(of('country.membership-flags')).toEqual([])
    const issues = of('country.membership-flags', (ds) => {
      const m = countryOf(ds, 'DEU').value.memberships
      m.unsc = [
        { from: '2019-01-01', to: '2020-12-31', permanent: false },
        { from: '2027-01-01', to: null, permanent: false },
      ]
      m.eu = { since: '2020-01-01', until: '2020-01-01' }
      m.nato = { since: null, until: '2020-01-01' }
      m.brics = { since: '2024-01-01' }
    })
    expect(issues).toEqual([])
  })

  it('reports an entry that is both a UN member and an observer', () => {
    const issues = of('country.membership-flags', (ds) => {
      countryOf(ds, 'DEU').value.observer = true
    })
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({ file: COUNTRIES_FILE, id: 'DEU', path: 'un_member' })
  })

  it('reports an entry that is neither a UN member nor an observer', () => {
    const issues = of('country.membership-flags', (ds) => {
      countryOf(ds, 'PSE').value.observer = false
    })
    expect(issues.map((i) => i.id)).toEqual(['PSE'])
  })

  it('reports a Security Council term that ends before it starts', () => {
    const issues = of('country.membership-flags', (ds) => {
      countryOf(ds, 'DEU').value.memberships.unsc = [
        { from: '2019-01-01', to: '2020-12-31', permanent: false },
        { from: '2020-01-01', to: '2019-12-31', permanent: false },
      ]
    })
    expect(issues.map((i) => [i.id, i.path])).toEqual([['DEU', 'memberships.unsc.1']])
  })

  it('reports a permanent term on a state that is not a permanent member', () => {
    const issues = of('country.membership-flags', (ds) => {
      countryOf(ds, 'DEU').value.memberships.unsc = [
        { from: '1945-10-24', to: null, permanent: true },
      ]
    })
    expect(issues.map((i) => [i.id, i.path])).toEqual([['DEU', 'memberships.unsc.0']])
    expect(issues[0]?.message).toContain('CHN, FRA, GBR, RUS, USA')
  })

  it('reports a permanent member without an ongoing permanent term, and accepts one with it', () => {
    const usa = (unsc: Country['memberships']['unsc']) => (ds: Dataset) => {
      ds.countries.push({
        value: {
          ...structuredClone(countryOf(ds, 'DEU').value),
          iso3: 'USA',
          iso2: 'US',
          m49: 840,
        },
        file: COUNTRIES_FILE,
        line: 200,
      })
      countryOf(ds, 'USA').value.memberships.unsc = unsc
    }
    const missing = of('country.membership-flags', usa([]))
    expect(missing.map((i) => [i.id, i.path])).toEqual([['USA', 'memberships.unsc']])
    const ended = of(
      'country.membership-flags',
      usa([{ from: '1945-10-24', to: '2020-01-01', permanent: true }]),
    )
    expect(ended.map((i) => i.id)).toEqual(['USA'])
    expect(
      of('country.membership-flags', usa([{ from: '1945-10-24', to: null, permanent: true }])),
    ).toEqual([])
  })

  it('reports a dated membership whose until is before since', () => {
    const issues = of('country.membership-flags', (ds) => {
      countryOf(ds, 'DEU').value.memberships.eu = { since: '2020-01-01', until: '2019-01-01' }
    })
    expect(issues.map((i) => [i.id, i.path])).toEqual([['DEU', 'memberships.eu']])
  })
})

describe("'country.universe-size'", () => {
  it('passes with 193 entries that are not excluded (ISR and PSE not counted)', () => {
    expect(of('country.universe-size', (ds) => addCountries(ds, 192))).toEqual([])
  })

  it('warns once on the three-entry fixture registry, stating the count', () => {
    const issues = of('country.universe-size')
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({ level: 'warning', file: COUNTRIES_FILE, id: '-' })
    expect(issues[0]?.message).toContain('has 1 scored entry')
  })

  it('warns with 194 entries that are not excluded', () => {
    const issues = of('country.universe-size', (ds) => addCountries(ds, 193))
    expect(issues).toHaveLength(1)
    expect(issues[0]?.message).toContain('has 194 scored entries')
  })
})

describe("'assessment.country-known'", () => {
  it('passes on the fixtures', () => {
    expect(of('assessment.country-known')).toEqual([])
  })

  it('reports an unknown country', () => {
    const issues = of('assessment.country-known', (ds) => {
      first(ds.assessments, 'assessment').value.country = 'FRA'
    })
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({ file: ASSESSMENT_FILE, id: 'FRA', path: 'country' })
  })

  it('reports an excluded country', () => {
    const issues = of('assessment.country-known', (ds) => {
      first(ds.assessments, 'assessment').value.country = 'ISR'
    })
    expect(issues.map((i) => i.id)).toEqual(['ISR'])
  })

  it('does not report a country whose registry entry failed its schema', () => {
    const issues = of('assessment.country-known', (ds) => {
      first(ds.assessments, 'assessment').value.country = 'FRA'
      ds.invalidIds.add('FRA')
      ds.invalid.country.add('FRA')
    })
    expect(issues).toEqual([])
  })

  it('reports the country when only a record of another kind with that id failed its schema', () => {
    const issues = of('assessment.country-known', (ds) => {
      first(ds.assessments, 'assessment').value.country = 'FRA'
      // A second assessment file for FRA failed its schema; the registry has no FRA entry.
      ds.invalidIds.add('FRA')
      ds.invalid.assessment.add('FRA')
    })
    expect(issues.map((i) => [i.file, i.id])).toEqual([[ASSESSMENT_FILE, 'FRA']])
  })
})

describe("'assessment.indicator-known'", () => {
  it('passes on the fixtures', () => {
    expect(of('assessment.indicator-known')).toEqual([])
  })

  it('reports a key that is not an indicator of the methodology', () => {
    const issues = of('assessment.indicator-known', (ds) => {
      entries(ds).A9 = { status: 'unchecked' }
    })
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({ file: ASSESSMENT_FILE, id: 'DEU', path: 'indicators.A9' })
  })

  it('is skipped when indicators.yaml failed to load', () => {
    const issues = of('assessment.indicator-known', (ds, m) => {
      entries(ds).A9 = { status: 'unchecked' }
      m.indicatorsFile = null
      m.indicators = []
    })
    expect(issues).toEqual([])
  })
})

describe("'assessment.checked-evidence'", () => {
  it('passes on the fixtures and on documented none-found and no-data', () => {
    expect(of('assessment.checked-evidence')).toEqual([])
    const issues = of('assessment.checked-evidence', (ds) => {
      entries(ds).A5 = { status: 'none-found', checked_at: '2026-09-27', queries: ['q'] }
      entries(ds).A2 = { status: 'no-data', checked_at: '2026-09-27', note: 'No data.' }
    })
    expect(issues).toEqual([])
  })

  it('reports none-found without checked_at', () => {
    const issues = of('assessment.checked-evidence', (ds) => {
      entries(ds).A5 = { status: 'none-found', note: 'Searched.' }
    })
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({ file: ASSESSMENT_FILE, id: 'DEU', path: 'indicators.A5' })
    expect(issues[0]?.message).toContain('checked_at')
  })

  it('reports no-data with a blank note and no queries', () => {
    const issues = of('assessment.checked-evidence', (ds) => {
      entries(ds).A2 = { status: 'no-data', checked_at: '2026-09-27', note: '   ', queries: [] }
    })
    expect(issues.map((i) => i.path)).toEqual(['indicators.A2'])
  })

  it('reports both problems on an undocumented entry', () => {
    const issues = of('assessment.checked-evidence', (ds) => {
      entries(ds).C5 = { status: 'none-found' }
    })
    expect(issues).toHaveLength(2)
  })
})

describe("'assessment.not-applicable'", () => {
  const term = (from: string, to: string | null) => (ds: Dataset) => {
    countryOf(ds, 'DEU').value.memberships.unsc = [{ from, to, permanent: false }]
  }

  it('passes on the fixtures and with a term that ended before the window', () => {
    expect(of('assessment.not-applicable')).toEqual([])
    expect(of('assessment.not-applicable', term('2019-01-01', '2023-10-06'))).toEqual([])
  })

  it('reports not-applicable without a note', () => {
    const issues = of('assessment.not-applicable', (ds) => {
      entries(ds).B2 = { status: 'not-applicable', note: ' ' }
    })
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({ file: ASSESSMENT_FILE, id: 'DEU', path: 'indicators.B2' })
  })

  it('reports B2 not-applicable for a state with a term overlapping the window', () => {
    for (const [from, to] of [
      ['2023-01-01', '2023-10-07'],
      ['2027-01-01', '2028-12-31'],
      ['1946-01-01', null],
    ] as const) {
      const issues = of('assessment.not-applicable', term(from, to))
      expect(issues, `${from}–${to}`).toHaveLength(1)
      expect(issues[0]).toMatchObject({ id: 'DEU', path: 'indicators.B2' })
    }
  })

  it('accepts B2 not-applicable when the only term starts after the date of the check', () => {
    const checkedIn2026 = (ds: Dataset) => {
      term('2027-01-01', '2028-12-31')(ds)
      entries(ds).B2 = {
        status: 'not-applicable',
        checked_at: '2026-09-27',
        note: 'Not a member of the Security Council between 2023-10-07 and 2026-09-27.',
      }
    }
    expect(of('assessment.not-applicable', checkedIn2026)).toEqual([])
    // last_full_check dates the check when the entry has no checked_at.
    const fullCheck = of('assessment.not-applicable', (ds) => {
      term('2027-01-01', '2028-12-31')(ds)
      first(ds.assessments, 'assessment').value.last_full_check = '2026-09-27'
    })
    expect(fullCheck).toEqual([])
  })

  it('reports B2 not-applicable when the term has started by the date of the check', () => {
    const issues = of('assessment.not-applicable', (ds) => {
      term('2027-01-01', '2028-12-31')(ds)
      entries(ds).B2 = { status: 'not-applicable', checked_at: '2027-01-01', note: 'Test.' }
    })
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({ id: 'DEU', path: 'indicators.B2' })
    expect(issues[0]?.message).toContain('to 2027-01-01')
  })

  it('counts a term that has not started when no date dates the check', () => {
    const issues = of('assessment.not-applicable', term('2027-01-01', '2028-12-31'))
    expect(issues).toHaveLength(1)
    expect(issues[0]?.message).toContain('no checked_at or last_full_check')
  })

  it('checks membership only on indicators with the unsc_non_member rule', () => {
    const issues = of('assessment.not-applicable', (ds) => {
      term('2024-01-01', '2025-12-31')(ds)
      entries(ds).B2 = { status: 'none-found', checked_at: '2026-09-27', note: 'None.' }
      entries(ds).A3 = { status: 'not-applicable', note: 'Test.' }
    })
    expect(issues).toEqual([])
  })
})

describe("'assessment.has-events-mismatch'", () => {
  it('passes on the fixtures', () => {
    expect(of('assessment.has-events-mismatch')).toEqual([])
  })

  it('warns on has-events without a published event', () => {
    const issues = of('assessment.has-events-mismatch', (ds) => {
      entries(ds).A3 = { status: 'has-events' }
    })
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({
      level: 'warning',
      file: ASSESSMENT_FILE,
      id: 'DEU',
      path: 'indicators.A3',
    })
  })

  it('counts only published events scoped to gaza (only gaza scores in v1)', () => {
    const westBankOnly = of('assessment.has-events-mismatch', (ds) => {
      first(ds.events, 'event').value.scope = ['west-bank']
    })
    expect(westBankOnly).toHaveLength(1)
    expect(westBankOnly[0]).toMatchObject({
      level: 'warning',
      file: ASSESSMENT_FILE,
      id: 'DEU',
      path: 'indicators.A6',
    })
    expect(westBankOnly[0]?.message).toContain('scoped to gaza')
    const beside = of('assessment.has-events-mismatch', (ds) => {
      first(ds.events, 'event').value.scope = ['west-bank']
      entries(ds).A6 = { status: 'none-found', checked_at: '2026-09-27', note: 'Test.' }
    })
    expect(beside).toEqual([])
    const withGaza = of('assessment.has-events-mismatch', (ds) => {
      first(ds.events, 'event').value.scope = ['west-bank', 'gaza']
    })
    expect(withGaza).toEqual([])
  })

  it('does not count events that are not published', () => {
    const issues = of('assessment.has-events-mismatch', (ds) => {
      first(ds.events, 'event').value.status = 'reviewed'
    })
    expect(issues.map((i) => i.path)).toEqual(['indicators.A6'])
  })

  it('warns on another status beside a published event', () => {
    const issues = of('assessment.has-events-mismatch', (ds) => {
      entries(ds).A6 = { status: 'none-found', checked_at: '2026-09-27', note: 'Test.' }
    })
    expect(issues.map((i) => i.path)).toEqual(['indicators.A6'])
  })

  it('ignores generated indicators', () => {
    const issues = of('assessment.has-events-mismatch', (ds) => {
      entries(ds).B1 = { status: 'has-events' }
    })
    expect(issues).toEqual([])
  })

  it('does not claim a missing event when the events file cannot be read', () => {
    const issues = of('assessment.has-events-mismatch', (ds) => {
      ds.events = []
      ds.issues.push(issue('load.yaml-syntax', { file: EVENTS_FILE }, 'bad YAML'))
    })
    expect(issues).toEqual([])
  })

  it('does not claim a missing event when that event failed its schema', () => {
    const issues = of('assessment.has-events-mismatch', (ds) => {
      ds.events = []
      ds.invalidIds.add(EVENT_ID)
    })
    expect(issues).toEqual([])
    const other = of('assessment.has-events-mismatch', (ds) => {
      ds.events = []
      ds.invalidIds.add('evt_2025_08_08_DEU_A7')
    })
    expect(other.map((i) => i.path)).toEqual(['indicators.A6'])
  })
})

describe("'assessment.unchecked'", () => {
  it('passes when every scored indicator is checked (unscored E1–E3 may stay unchecked)', () => {
    const issues = of('assessment.unchecked', (ds, m) => {
      checkEverything(ds, m)
      entries(ds).E1 = { status: 'unchecked' }
      delete entries(ds).E2
    })
    expect(issues).toEqual([])
  })

  it('warns once on the fixture assessment, listing the unchecked scored indicators', () => {
    const issues = of('assessment.unchecked')
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({ level: 'warning', file: ASSESSMENT_FILE, id: 'DEU' })
    const message = issues[0]?.message ?? ''
    expect(message).toContain('29 of 31')
    expect(message).not.toMatch(/\bA6\b|\bB2\b|\bE1\b/)
  })

  it('lists an indicator missing from the file', () => {
    const issues = of('assessment.unchecked', (ds, m) => {
      checkEverything(ds, m)
      delete entries(ds).C5
    })
    expect(issues).toHaveLength(1)
    expect(issues[0]?.message).toContain(': C5')
  })

  it('warns on a country without an assessment file, but not on excluded ones', () => {
    const issues = of('assessment.unchecked', (ds) => {
      ds.assessments.length = 0
    })
    expect(issues.map((i) => [i.file, i.id])).toEqual([[COUNTRIES_FILE, 'DEU']])
  })

  it('does not warn on a country whose assessment failed its schema', () => {
    const issues = of('assessment.unchecked', (ds) => {
      ds.assessments.length = 0
      ds.invalidIds.add('DEU')
      ds.invalid.assessment.add('DEU')
    })
    expect(issues).toEqual([])
  })
})

describe("'reply.deadline'", () => {
  const dates = (received_at: string, published_at: string) => (ds: Dataset) => {
    const r = first(ds.replies, 'reply').value
    r.received_at = received_at
    r.published_at = published_at
  }

  it('passes on the fixtures and on publication on day 10', () => {
    expect(of('reply.deadline')).toEqual([])
    expect(of('reply.deadline', dates('2026-09-27', '2026-10-07'))).toEqual([])
  })

  it('reports publication after 10 days', () => {
    const issues = of('reply.deadline', dates('2026-09-27', '2026-10-08'))
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({ file: REPLY_FILE, id: REPLY_ID, path: 'published_at' })
    expect(issues[0]?.message).toContain('2026-10-07')
  })

  it('reports publication before receipt', () => {
    const issues = of('reply.deadline', dates('2026-09-27', '2026-09-26'))
    expect(issues.map((i) => i.id)).toEqual([REPLY_ID])
  })
})

describe("'reply.contests-known'", () => {
  it('passes on the fixtures', () => {
    expect(of('reply.contests-known')).toEqual([])
  })

  it('reports an unknown contested event', () => {
    const issues = of('reply.contests-known', (ds) => {
      first(ds.replies, 'reply').value.contests.push('evt_2025_08_09_DEU_A6')
    })
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({ file: REPLY_FILE, id: REPLY_ID, path: 'contests.1' })
  })

  it('does not report an event that failed its schema', () => {
    const issues = of('reply.contests-known', (ds) => {
      first(ds.replies, 'reply').value.contests.push('evt_2025_08_09_DEU_A6')
      ds.invalidIds.add('evt_2025_08_09_DEU_A6')
    })
    expect(issues).toEqual([])
  })

  it('accepts generated events of the reply country (votes, funding)', () => {
    const issues = of('reply.contests-known', (ds) => {
      first(ds.replies, 'reply').value.contests = [
        'evt_2026_09_01_DEU_D1_fts-2026-09',
        'evt_2023_10_27_DEU_B1_es-10-21',
      ]
    })
    expect(issues).toEqual([])
  })

  it('reports a generated event of another country', () => {
    const issues = of('reply.contests-known', (ds) => {
      first(ds.replies, 'reply').value.contests = ['evt_2023_10_27_FRA_B1_es-10-21']
    })
    expect(issues.map((i) => [i.id, i.path])).toEqual([[REPLY_ID, 'contests.0']])
    expect(issues[0]?.message).toContain('belongs to FRA')
  })

  it('does not report an event in an events file that cannot be parsed', () => {
    const issues = of('reply.contests-known', (ds) => {
      ds.events = []
      ds.issues.push(issue('load.yaml-syntax', { file: EVENTS_FILE }, 'bad YAML'))
    })
    expect(issues).toEqual([])
  })

  it('reports an event of another country', () => {
    const issues = of('reply.contests-known', (ds) => {
      const e = cloneEvent(ds)
      e.id = 'evt_2025_08_08_FRA_A6'
      e.country = 'FRA'
      ds.events.push({ value: e, file: 'data/events/FRA.yaml', line: 1 })
      first(ds.replies, 'reply').value.contests = [e.id]
    })
    expect(issues.map((i) => [i.id, i.path])).toEqual([[REPLY_ID, 'contests.0']])
  })
})

describe("'reply.outcome-consistent'", () => {
  const outcome = (value: 'disputed' | 'retracted' | 'corrected') => (ds: Dataset) => {
    first(ds.replies, 'reply').value.outcome = value
  }

  it('passes on the fixtures and on consistent outcomes', () => {
    expect(of('reply.outcome-consistent')).toEqual([])
    const disputed = of('reply.outcome-consistent', (ds) => {
      outcome('disputed')(ds)
      first(ds.events, 'event').value.confidence = 'disputed'
    })
    expect(disputed).toEqual([])
    const retracted = of('reply.outcome-consistent', (ds) => {
      outcome('retracted')(ds)
      first(ds.events, 'event').value.status = 'retracted'
    })
    expect(retracted).toEqual([])
    expect(of('reply.outcome-consistent', outcome('corrected'))).toEqual([])
  })

  it('reports disputed when the event is not disputed', () => {
    const issues = of('reply.outcome-consistent', outcome('disputed'))
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({ file: REPLY_FILE, id: REPLY_ID, path: 'contests.0' })
  })

  it('reports retracted when the event is not retracted', () => {
    const issues = of('reply.outcome-consistent', outcome('retracted'))
    expect(issues.map((i) => i.id)).toEqual([REPLY_ID])
  })

  it('reports corrected when no correction names the event', () => {
    const issues = of('reply.outcome-consistent', (ds) => {
      outcome('corrected')(ds)
      ds.corrections.length = 0
    })
    expect(issues.map((i) => i.id)).toEqual([REPLY_ID])
  })

  it('reports corrected when the only correction predates the reply', () => {
    const issues = of('reply.outcome-consistent', (ds) => {
      outcome('corrected')(ds)
      const r = first(ds.replies, 'reply').value
      r.received_at = '2026-10-01'
      r.published_at = '2026-10-02'
    })
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({ file: REPLY_FILE, id: REPLY_ID, path: 'contests.0' })
    expect(issues[0]?.message).toContain('on or after received_at 2026-10-01')
  })
})

describe("'lead.status'", () => {
  it('passes on open, promoted and dropped leads', () => {
    expect(of('lead.status')).toEqual([])
    const issues = of('lead.status', (ds) => {
      addLead(ds)
      addLead(ds, { id: 'lead_20260901_DEU_2', indicator: 'A6', status: `promoted:${EVENT_ID}` })
      addLead(ds, { id: 'lead_20260901_DEU_3', status: 'dropped', reason: 'No primary found.' })
    })
    expect(issues).toEqual([])
  })

  it("reports a promotion to another country's event", () => {
    const issues = of('lead.status', (ds) => {
      addLead(
        ds,
        {
          id: 'lead_20260901_FRA_1',
          country: 'FRA',
          indicator: 'A6',
          status: `promoted:${EVENT_ID}`,
        },
        'data/leads/FRA.yaml',
      )
    })
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({
      level: 'error',
      file: 'data/leads/FRA.yaml',
      id: 'lead_20260901_FRA_1',
      path: 'status',
    })
    expect(issues[0]?.message).toContain('an event of DEU')
  })

  it('warns when the promoted event is of another indicator', () => {
    const issues = of('lead.status', (ds) => {
      addLead(ds, { indicator: 'B9', status: `promoted:${EVENT_ID}` })
    })
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({ level: 'warning', file: LEADS_FILE, id: LEAD_ID })
  })

  it('does not report a promotion into an events file that cannot be parsed', () => {
    const issues = of('lead.status', (ds) => {
      ds.issues.push(issue('load.yaml-syntax', { file: EVENTS_FILE }, 'bad YAML'))
      ds.events = []
      addLead(ds, { indicator: 'A6', status: `promoted:${EVENT_ID}` })
    })
    expect(issues).toEqual([])
  })

  it('reports a promotion to an event that does not exist', () => {
    const issues = of('lead.status', (ds) => {
      addLead(ds, { status: 'promoted:evt_2025_08_09_DEU_A6' })
    })
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({ file: LEADS_FILE, id: LEAD_ID, path: 'status' })
  })

  it('does not report a promotion to an event that failed its schema', () => {
    const issues = of('lead.status', (ds) => {
      addLead(ds, { status: 'promoted:evt_2025_08_09_DEU_A6' })
      ds.invalidIds.add('evt_2025_08_09_DEU_A6')
    })
    expect(issues).toEqual([])
  })

  it('reports a dropped lead without a reason', () => {
    const issues = of('lead.status', (ds) => {
      addLead(ds, { status: 'dropped' })
      addLead(ds, { id: 'lead_20260901_DEU_2', status: 'dropped', reason: '  ' })
    })
    expect(issues.map((i) => [i.id, i.path])).toEqual([
      [LEAD_ID, 'reason'],
      ['lead_20260901_DEU_2', 'reason'],
    ])
  })
})

describe("'lead.source-kind'", () => {
  it('passes on URL entries and on press and ngo sources', () => {
    expect(of('lead.source-kind')).toEqual([])
    const issues = of('lead.source-kind', (ds) => {
      addSource(ds, 'src_20260901_example_press-report', 'press', '2026-09-01')
      addSource(ds, 'src_20260901_example_ngo-report', 'ngo', '2026-09-01')
      addLead(ds, {
        sources: [
          { source: 'src_20260901_example_press-report' },
          { source: 'src_20260901_example_ngo-report' },
          { url: 'https://example.org/test-lead', publisher: 'Example', kind: 'ngo' },
        ],
      })
    })
    expect(issues).toEqual([])
  })

  it('reports a source of another kind', () => {
    const issues = of('lead.source-kind', (ds) => {
      addLead(ds, { sources: [{ source: SOURCE_ID }] })
    })
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({ file: LEADS_FILE, id: LEAD_ID, path: 'sources.0' })
    expect(issues[0]?.message).toContain('official')
  })

  it('reports an unknown source unless it failed its schema', () => {
    const unknown = 'src_20260901_example_missing-report'
    const issues = of('lead.source-kind', (ds) => {
      addLead(ds, { sources: [{ source: unknown }] })
    })
    expect(issues.map((i) => i.id)).toEqual([LEAD_ID])
    const skipped = of('lead.source-kind', (ds) => {
      addLead(ds, { sources: [{ source: unknown }] })
      ds.invalidIds.add(unknown)
      ds.invalid.source.add(unknown)
    })
    expect(skipped).toEqual([])
  })
})

describe("'structured.source-dataset'", () => {
  it('passes on the fixtures and on a row citing a dataset source', () => {
    expect(of('structured.source-dataset')).toEqual([])
    const issues = of('structured.source-dataset', (ds) => {
      addSource(ds, DATASET_ID, 'dataset', '2026-09-01')
      addFtsRow(ds)
    })
    expect(issues).toEqual([])
  })

  it('reports a row citing a dataset source that is not archived', () => {
    const patches: Partial<Source>[] = [
      { archive_status: 'failed', wayback_url: null, sha256: null },
      { wayback_url: null },
      { archive_status: 'failed' },
    ]
    for (const patch of patches) {
      const issues = of('structured.source-dataset', (ds) => {
        addSource(ds, DATASET_ID, 'dataset', '2026-09-01')
        const src = ds.sources.find((x) => x.value.id === DATASET_ID)
        if (src) Object.assign(src.value, patch)
        addFtsRow(ds)
      })
      expect(issues, JSON.stringify(patch)).toHaveLength(1)
      expect(issues[0]).toMatchObject({
        file: 'data/structured/fts_funding.csv',
        id: 'row 2',
        path: 'source',
      })
    }
  })

  it('accepts a row citing a dataset row whose origin is archived', () => {
    const issues = of('structured.source-dataset', (ds) => {
      addSource(ds, DATASET_ID, 'dataset', '2026-09-01')
      const rowId = 'src_20260901_test-dataset_row'
      addSource(ds, rowId, 'dataset', '2026-09-01')
      const row = ds.sources.find((x) => x.value.id === rowId)
      if (row) {
        Object.assign(row.value, {
          url: 'data/structured/fts_funding.csv',
          wayback_url: null,
          sha256: null,
          origin: DATASET_ID,
        })
      }
      addFtsRow(ds, { source: rowId })
    })
    expect(issues).toEqual([])
  })

  it('checks every id of a row citing several sources', () => {
    const second = 'src_20260901_test-dataset_page-2'
    const clean = of('structured.source-dataset', (ds) => {
      addSource(ds, DATASET_ID, 'dataset', '2026-09-01')
      addSource(ds, second, 'dataset', '2026-09-01')
      addFtsRow(ds, { source: `${DATASET_ID};${second}` })
    })
    expect(clean).toEqual([])
    const issues = of('structured.source-dataset', (ds) => {
      addSource(ds, DATASET_ID, 'dataset', '2026-09-01')
      addFtsRow(ds, { source: `${DATASET_ID};${SOURCE_ID}` })
    })
    expect(issues).toHaveLength(1)
    expect(issues[0]?.message).toContain(`source ${SOURCE_ID} is of kind`)
  })

  it('reports a row citing a source of another kind', () => {
    const issues = of('structured.source-dataset', (ds) => addFtsRow(ds, { source: SOURCE_ID }))
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({
      file: 'data/structured/fts_funding.csv',
      id: 'row 2',
      path: 'source',
    })
  })

  it('reports a row citing an unknown source unless it failed its schema', () => {
    expect(of('structured.source-dataset', (ds) => addFtsRow(ds)).map((i) => i.id)).toEqual([
      'row 2',
    ])
    const skipped = of('structured.source-dataset', (ds) => {
      addFtsRow(ds)
      ds.invalidIds.add(DATASET_ID)
      ds.invalid.source.add(DATASET_ID)
    })
    expect(skipped).toEqual([])
  })
})

describe("'structured.iso3-known'", () => {
  it('passes on known codes, excluded entries included', () => {
    expect(of('structured.iso3-known')).toEqual([])
    const issues = of('structured.iso3-known', (ds) => {
      addFtsRow(ds)
      ds.structured['unga_votes.csv'].push({
        value: {
          resolution: 'A/RES/ES-10/21',
          date: '2023-10-27',
          iso3: 'ISR',
          vote: 'N',
          source: DATASET_ID,
        },
        file: 'data/structured/unga_votes.csv',
        line: 2,
      })
    })
    expect(issues).toEqual([])
  })

  it('does not warn on a code whose registry entry failed its schema, and only then', () => {
    const skipped = of('structured.iso3-known', (ds) => {
      addFtsRow(ds, { iso3: 'FRA' })
      ds.invalidIds.add('FRA')
      ds.invalid.country.add('FRA')
    })
    expect(skipped).toEqual([])
    const otherKind = of('structured.iso3-known', (ds) => {
      addFtsRow(ds, { iso3: 'FRA' })
      ds.invalidIds.add('FRA')
      ds.invalid.assessment.add('FRA')
    })
    expect(otherKind.map((i) => [i.file, i.id, i.path])).toEqual([
      ['data/structured/fts_funding.csv', 'row 2', 'iso3'],
    ])
  })

  it('gives one warning per table, naming every unknown code and its row count', () => {
    const issues = of('structured.iso3-known', (ds) => {
      addFtsRow(ds, { iso3: 'QQQ' })
      addFtsRow(ds, { iso3: 'QQQ', window_start: '2025-02-01', window_end: '2026-01-31' })
      addFtsRow(ds, { iso3: 'ZZZ', window_start: '2025-03-01', window_end: '2026-02-28' })
    })
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({ file: 'data/structured/fts_funding.csv', path: 'iso3' })
    expect(issues[0]?.message).toContain('2 iso3 codes are not in countries.yaml (QQQ ×2, ZZZ ×1)')
  })

  it('warns on a code missing from the registry, in the table-specific column', () => {
    const issues = of('structured.iso3-known', (ds) => {
      ds.structured['unsc_vetoes.csv'].push({
        value: {
          date: '2023-10-18',
          draft: 'S/2023/773',
          vetoed_by: 'QQQ',
          ceasefire: false,
          source: DATASET_ID,
        },
        file: 'data/structured/unsc_vetoes.csv',
        line: 3,
      })
    })
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({
      level: 'warning',
      file: 'data/structured/unsc_vetoes.csv',
      id: 'row 3',
      path: 'vetoed_by',
    })
  })
})

describe("'structured.window'", () => {
  it('passes on the fixtures and on a one-day window', () => {
    expect(of('structured.window')).toEqual([])
    const issues = of('structured.window', (ds) =>
      addFtsRow(ds, { window_start: '2024-01-01', window_end: '2024-01-01' }),
    )
    expect(issues).toEqual([])
  })

  it('reports a window that ends before it starts, in each windowed table', () => {
    const issues = of('structured.window', (ds) => {
      addFtsRow(ds, { window_start: '2024-12-31', window_end: '2024-01-01' })
      const common = {
        iso3: 'DEU',
        window_start: '2025-01-01',
        window_end: '2024-12-31',
        release_date: '2025-02-01',
        reporter: 'mirror' as const,
        retrieved_at: '2026-09-01T00:00:00Z',
        source: DATASET_ID,
      }
      ds.structured['comtrade_a2.csv'].push({
        value: { ...common, hs: '93', usd: 1 },
        file: 'data/structured/comtrade_a2.csv',
        line: 4,
      })
      ds.structured['comtrade_c3.csv'].push({
        value: { ...common, usd_total: 1, usd_2022: 1 },
        file: 'data/structured/comtrade_c3.csv',
        line: 5,
      })
    })
    expect(issues.map((i) => [i.file, i.id, i.path])).toEqual([
      ['data/structured/fts_funding.csv', 'row 2', 'window_end'],
      ['data/structured/comtrade_a2.csv', 'row 4', 'window_end'],
      ['data/structured/comtrade_c3.csv', 'row 5', 'window_end'],
    ])
  })
})
