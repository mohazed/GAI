/**
 * Written in P-03 by an independent test writer who derived every expectation from the contract
 * before reading the engine; kept as a second, independent check of the same rules.
 *
 * Independent audit tests for docs/02 §8 (coverage), §9 (user weights and the `?w=` URL value)
 * and §10 (sensitivity tables, Spearman rank correlation with ties).
 *
 * Every expected value below was derived by hand from docs/02, docs/03 §3 and §6 and the
 * methodology files, not from the engine. The arithmetic is written out next to each case.
 */
import { describe, expect, it } from 'vitest'
import { coverage, EXPORT_DATA_INDICATORS, onSecurityCouncil } from './coverage.js'
import {
  averageRanks,
  type CountryEvents,
  pearson,
  rankScores,
  type SensitivitySuite,
  type SensitivityVariant,
  sensitivitySuite,
  spearman,
} from './sensitivity.js'
import { country, ev, methodologyRc1 } from './test-helpers.js'
import type {
  AssessmentStatus,
  CategoryId,
  ScoringAssessment,
  ScoringEvent,
  UnscTerm,
} from './types.js'
import { formatWeights, isDefaultWeights, parseWeights, userScore } from './weights.js'

// The docs/02 rules as written: methodology 1.0.0-rc.1 (rc.2 rules: rc2.test.ts).
const m = methodologyRc1()

const SCORED_31 = [
  'A1',
  'A2',
  'A3',
  'A4',
  'A5',
  'A6',
  'A7',
  'A8',
  'B1',
  'B2',
  'B3',
  'B4',
  'B5',
  'B6',
  'B7',
  'B8',
  'B9',
  'B10',
  'B11',
  'B12',
  'C1',
  'C2',
  'C3',
  'C4',
  'C5',
  'C6',
  'D1',
  'D2',
  'D3',
  'D4',
  'D5',
]

/** Assessment from explicit statuses; indicators not listed have no entry. */
function assess(statuses: Record<string, AssessmentStatus>): ScoringAssessment {
  const indicators: Record<string, { status: AssessmentStatus }> = {}
  for (const [id, status] of Object.entries(statuses)) indicators[id] = { status }
  return { indicators }
}

/** Every scored indicator at `status`, then the overrides. */
function assessAll(
  status: AssessmentStatus,
  over: Record<string, AssessmentStatus> = {},
): ScoringAssessment {
  const s: Record<string, AssessmentStatus> = {}
  for (const id of SCORED_31) s[id] = over[id] ?? status
  return assess(s)
}

const NON_MEMBER: UnscTerm[] = []
const PERMANENT: UnscTerm[] = [{ from: '1945-10-24', to: null, permanent: true }]
const ELECTED_2024_2025: UnscTerm[] = [{ from: '2024-01-01', to: '2025-12-31', permanent: false }]
const ELECTED_2022_2023: UnscTerm[] = [{ from: '2022-01-01', to: '2023-12-31', permanent: false }]
const ELECTED_2021_2022: UnscTerm[] = [{ from: '2021-01-01', to: '2022-12-31', permanent: false }]
const ELECTED_2027_2028: UnscTerm[] = [{ from: '2027-01-01', to: '2028-12-31', permanent: false }]

const T = '2026-09-27'

// ───────────────────────────────────────────────────────────────────────────── §8 coverage

describe('audit §8: the 31 scored indicators', () => {
  it('scored indicators are exactly A1–A8, B1–B12, C1–C6, D1–D5 (34 − 3 experimental E)', () => {
    expect([...m.scoredIndicatorIds]).toEqual(SCORED_31)
    expect(m.scoredIndicatorIds).toHaveLength(31)
  })

  it('statuses carry one entry per scored indicator and the five counts add to 31', () => {
    const c = coverage(
      {
        country: country(NON_MEMBER),
        assessment: assessAll('none-found', { E1: 'none-found' }),
        events: [ev('E1', '2024-01-10', 5)],
        date: T,
      },
      m,
    )
    expect(Object.keys(c.statuses).sort()).toEqual([...SCORED_31].sort())
    expect(c.statuses.E1).toBeUndefined()
    expect(c.hasEvents + c.noneFound + c.noData + c.unchecked + c.notApplicable).toBe(31)
  })
})

describe('audit §8: coverage ratio = (has-events + none-found) / (31 − not-applicable)', () => {
  it('no assessment, no events, never on the Council: B2 N/A, 30 unchecked, ratio 0', () => {
    const c = coverage({ country: country(NON_MEMBER), assessment: null, events: [], date: T }, m)
    expect(c.statuses.B2).toBe('not-applicable')
    expect(c.notApplicable).toBe(1)
    expect(c.notApplicableIds).toEqual(['B2'])
    expect(c.applicable).toBe(30)
    expect(c.unchecked).toBe(30)
    expect(c.uncheckedIds).toEqual(SCORED_31.filter((id) => id !== 'B2'))
    expect(c.hasEvents).toBe(0)
    expect(c.noneFound).toBe(0)
    expect(c.noData).toBe(0)
    expect(c.ratio).toBe(0)
    expect(c.noDataIds).toEqual([])
    // missing = applicable indicators not covered: no-data and unchecked.
    expect(c.missing).toEqual(c.uncheckedIds)
    expect(c.noExportData).toBe(false)
  })

  it('undefined assessment behaves as null (all unchecked)', () => {
    const c = coverage(
      { country: country(PERMANENT), assessment: undefined, events: [], date: T },
      m,
    )
    expect(c.applicable).toBe(31)
    expect(c.unchecked).toBe(31)
    expect(c.ratio).toBe(0)
  })

  it('reproduces the §14 breakdown: 12 has-events, 9 none-found, 4 no-data, 5 unchecked, B2 N/A → 21/30', () => {
    // has-events (12): A1 A3 A6 B1 B5 B9 B10 B11 C1 D1 D2 D3 — set by published gaza events.
    // none-found (9): A5 A7 A8 B3 B4 B6 B7 B8 C2.  no-data (4): A2 A4 C3 C5 (the §14 `missing`).
    // unchecked (5): B12 C4 C6 D4 D5.  not-applicable: B2 (never on the Council).
    // applicable = 31 − 1 = 30; coverage = (12 + 9) / 30 = 0.7.
    const events: ScoringEvent[] = [
      ev('A1', '2024-03-11', -12),
      ev('A3', '2023-10-07', -15),
      ev('A6', '2025-08-08', 10),
      ev('B1', '2023-10-27', 3),
      ev('B5', '2024-11-21', 8),
      ev('B9', '2024-05-02', 5),
      ev('B10', '2023-10-12', -5),
      ev('B11', '2024-06-10', 10),
      ev('C1', '2025-05-20', 4),
      ev('D1', '2026-09-01', 6),
      ev('D2', '2024-01-27', -10, { end: '2024-04-24' }),
      ev('D3', '2024-04-24', 5),
    ]
    const a = assessAll('none-found', {
      A1: 'has-events',
      A3: 'has-events',
      A6: 'has-events',
      B1: 'has-events',
      B5: 'has-events',
      B9: 'has-events',
      B10: 'has-events',
      B11: 'has-events',
      C1: 'has-events',
      D1: 'has-events',
      D2: 'has-events',
      D3: 'has-events',
      A2: 'no-data',
      A4: 'no-data',
      C3: 'no-data',
      C5: 'no-data',
      B12: 'unchecked',
      C4: 'unchecked',
      C6: 'unchecked',
      D4: 'unchecked',
      D5: 'unchecked',
      B2: 'not-applicable',
    })
    const c = coverage({ country: country(NON_MEMBER), assessment: a, events, date: T }, m)
    expect(c.hasEvents).toBe(12)
    expect(c.noneFound).toBe(9)
    expect(c.noData).toBe(4)
    expect(c.unchecked).toBe(5)
    expect(c.notApplicable).toBe(1)
    expect(c.applicable).toBe(30)
    expect(c.ratio).toBeCloseTo(21 / 30, 12)
    expect(c.noDataIds).toEqual(['A2', 'A4', 'C3', 'C5'])
    expect(c.uncheckedIds).toEqual(['B12', 'C4', 'C6', 'D4', 'D5'])
    expect(c.missing).toEqual(['A2', 'A4', 'B12', 'C3', 'C4', 'C5', 'C6', 'D4', 'D5'])
    expect(c.noExportData).toBe(true)
  })

  it('ratio is full precision: one none-found out of 31 applicable is 1/31', () => {
    const c = coverage(
      {
        country: country(PERMANENT),
        assessment: assess({ C6: 'none-found' }),
        events: [],
        date: T,
      },
      m,
    )
    expect(c.applicable).toBe(31)
    expect(c.noneFound).toBe(1)
    expect(c.unchecked).toBe(30)
    expect(c.ratio).toBeCloseTo(1 / 31, 15)
  })

  it('no-data and unchecked both count against coverage; none-found counts for it', () => {
    // Council member (B2 applicable): 10 none-found, 11 no-data, 10 unchecked → 10/31.
    const over: Record<string, AssessmentStatus> = {}
    SCORED_31.forEach((id, i) => {
      over[id] = i % 3 === 0 ? 'no-data' : i % 3 === 1 ? 'none-found' : 'unchecked'
    })
    const c = coverage(
      { country: country(PERMANENT), assessment: assess(over), events: [], date: T },
      m,
    )
    // indices 0..30: i%3==0 → 11 (0,3,…,30); i%3==1 → 10; i%3==2 → 10.
    expect(c.noData).toBe(11)
    expect(c.noneFound).toBe(10)
    expect(c.unchecked).toBe(10)
    expect(c.applicable).toBe(31)
    expect(c.ratio).toBeCloseTo(10 / 31, 12)
  })

  it('everything checked on a non-member gives 30/30 = 1; on a member 31/31 = 1', () => {
    const a = assessAll('none-found')
    const non = coverage({ country: country(NON_MEMBER), assessment: a, events: [], date: T }, m)
    expect(non.applicable).toBe(30)
    expect(non.noneFound).toBe(30)
    expect(non.ratio).toBe(1)
    const mem = coverage({ country: country(PERMANENT), assessment: a, events: [], date: T }, m)
    expect(mem.applicable).toBe(31)
    expect(mem.noneFound).toBe(31)
    expect(mem.ratio).toBe(1)
  })

  it('an indicator missing from the assessment is unchecked', () => {
    const c = coverage(
      {
        country: country(PERMANENT),
        assessment: assess({ A1: 'none-found', A2: 'no-data' }),
        events: [],
        date: T,
      },
      m,
    )
    expect(c.statuses.A1).toBe('none-found')
    expect(c.statuses.A2).toBe('no-data')
    expect(c.statuses.A3).toBe('unchecked')
    expect(c.statuses.D5).toBe('unchecked')
    expect(c.unchecked).toBe(29)
  })
})

describe('audit §8 + docs/03 §6: has-events is set by published gaza events', () => {
  it('a published gaza event overrides a hand-set none-found; an old or ended one still counts', () => {
    const events = [
      ev('A5', '2025-02-01', -5),
      // Repeatable, Δ > 730 at T: contributes 0 but the event exists.
      ev('C6', '2023-11-01', 3),
      // Standing state that ended long before T.
      ev('D2', '2024-01-27', -10, { end: '2024-05-01' }),
    ]
    const c = coverage(
      {
        country: country(PERMANENT),
        assessment: assessAll('none-found'),
        events,
        date: T,
      },
      m,
    )
    expect(c.statuses.A5).toBe('has-events')
    expect(c.statuses.C6).toBe('has-events')
    expect(c.statuses.D2).toBe('has-events')
    expect(c.hasEvents).toBe(3)
    expect(c.noneFound).toBe(28)
    expect(c.ratio).toBe(1)
  })

  it('events that are not published, not gaza-scoped, dated after t or of another country do not set has-events', () => {
    const events = [
      ev('B3', '2024-01-11', 15, { status: 'draft' }),
      ev('B4', '2024-03-12', -15, { status: 'retracted' }),
      ev('B6', '2025-04-03', -10, { scope: ['related'] }),
      ev('B7', '2025-02-06', -20, { scope: ['lebanon'] }),
      ev('C5', '2026-09-28', 5), // one day after T
      ev('C2', '2024-05-01', -10, { country: 'ZZZ' }),
    ]
    const c = coverage(
      {
        country: country(PERMANENT),
        assessment: assessAll('none-found'),
        events,
        date: T,
      },
      m,
    )
    for (const id of ['B3', 'B4', 'B6', 'B7', 'C5', 'C2']) expect(c.statuses[id]).toBe('none-found')
    expect(c.hasEvents).toBe(0)
  })

  it('a multi-scope event that includes gaza sets has-events', () => {
    const c = coverage(
      {
        country: country(PERMANENT),
        assessment: assessAll('none-found'),
        events: [ev('B12', '2024-06-01', 5, { scope: ['region', 'gaza'] })],
        date: T,
      },
      m,
    )
    expect(c.statuses.B12).toBe('has-events')
  })

  it('an event dated exactly t sets has-events at t', () => {
    const c = coverage(
      {
        country: country(PERMANENT),
        assessment: assessAll('none-found'),
        events: [ev('D4', T, 5)],
        date: T,
      },
      m,
    )
    expect(c.statuses.D4).toBe('has-events')
  })

  it('a hand-set has-events without a published event is not counted as has-events', () => {
    const c = coverage(
      {
        country: country(PERMANENT),
        assessment: assessAll('none-found', { B9: 'has-events' }),
        events: [],
        date: T,
      },
      m,
    )
    expect(c.statuses.B9).not.toBe('has-events')
    expect(c.statuses.B9).toBe('unchecked')
    expect(c.hasEvents).toBe(0)
    expect(c.ratio).toBeCloseTo(30 / 31, 12)
  })
})

describe('audit §8: not-applicable only for B2, by Security Council membership periods', () => {
  it('onSecurityCouncil: inclusive term bounds, null `to` = ongoing', () => {
    const c = country(ELECTED_2024_2025)
    expect(onSecurityCouncil(c, '2023-10-07', '2023-12-31')).toBe(false)
    expect(onSecurityCouncil(c, '2023-10-07', '2024-01-01')).toBe(true)
    expect(onSecurityCouncil(c, '2025-12-31', '2026-09-27')).toBe(true)
    expect(onSecurityCouncil(c, '2026-01-01', '2026-09-27')).toBe(false)
    expect(onSecurityCouncil(country(PERMANENT), '2023-10-07', '2023-10-07')).toBe(true)
    const future: UnscTerm[] = [{ from: '2027-01-01', to: null, permanent: false }]
    expect(onSecurityCouncil(country(future), '2023-10-07', '2026-12-31')).toBe(false)
    expect(onSecurityCouncil(country(future), '2023-10-07', '2027-01-01')).toBe(true)
    expect(onSecurityCouncil(country(NON_MEMBER), '1945-01-01', '2100-01-01')).toBe(false)
  })

  const b2 = (unsc: UnscTerm[], date: string) =>
    coverage({ country: country(unsc), assessment: assessAll('none-found'), events: [], date }, m)

  it('permanent member: B2 applicable from the window start', () => {
    const c = b2(PERMANENT, '2023-10-07')
    expect(c.statuses.B2).toBe('none-found')
    expect(c.applicable).toBe(31)
  })

  it('elected 2022–2023 (on the Council when the window opened): B2 applicable', () => {
    expect(b2(ELECTED_2022_2023, '2023-10-07').statuses.B2).toBe('none-found')
    expect(b2(ELECTED_2022_2023, T).statuses.B2).toBe('none-found')
  })

  it('elected 2021–2022 (term ended before the window): B2 N/A at every date', () => {
    expect(b2(ELECTED_2021_2022, '2023-10-07').statuses.B2).toBe('not-applicable')
    const c = b2(ELECTED_2021_2022, T)
    expect(c.statuses.B2).toBe('not-applicable')
    expect(c.applicable).toBe(30)
    expect(c.ratio).toBe(1)
  })

  it('a term ending the day before the window start is outside; ending on it is inside', () => {
    const before: UnscTerm[] = [{ from: '2022-01-01', to: '2023-10-06', permanent: false }]
    const onStart: UnscTerm[] = [{ from: '2022-01-01', to: '2023-10-07', permanent: false }]
    expect(b2(before, T).statuses.B2).toBe('not-applicable')
    expect(b2(onStart, T).statuses.B2).toBe('none-found')
  })

  it('elected 2024–2025: N/A before the first day of the term, applicable from it and after it ends', () => {
    expect(b2(ELECTED_2024_2025, '2023-12-31').statuses.B2).toBe('not-applicable')
    expect(b2(ELECTED_2024_2025, '2024-01-01').statuses.B2).toBe('none-found')
    // The term ended on 2025-12-31, but the state was on the Council at a point in the window.
    expect(b2(ELECTED_2024_2025, T).statuses.B2).toBe('none-found')
    expect(b2(ELECTED_2024_2025, T).applicable).toBe(31)
  })

  it('a term starting after t (docs/03 §3 example, 2027–2028): N/A until it starts', () => {
    expect(b2(ELECTED_2027_2028, T).statuses.B2).toBe('not-applicable')
    expect(b2(ELECTED_2027_2028, '2027-01-01').statuses.B2).toBe('none-found')
  })

  it('several terms: only one inside the window is enough', () => {
    const terms: UnscTerm[] = [
      { from: '2019-01-01', to: '2020-12-31', permanent: false },
      { from: '2026-01-01', to: '2027-12-31', permanent: false },
    ]
    expect(b2(terms, '2025-12-31').statuses.B2).toBe('not-applicable')
    expect(b2(terms, '2026-01-01').statuses.B2).toBe('none-found')
  })

  it('nothing else is automatically N/A: a non-member with no assessment has only B2 N/A', () => {
    const c = coverage({ country: country(NON_MEMBER), assessment: null, events: [], date: T }, m)
    for (const id of SCORED_31) {
      expect(c.statuses[id]).toBe(id === 'B2' ? 'not-applicable' : 'unchecked')
    }
  })

  it('the B2 rule overrides a hand-set none-found or no-data on a non-member', () => {
    for (const hand of ['none-found', 'no-data', 'unchecked'] as const) {
      const c = coverage(
        {
          country: country(NON_MEMBER),
          assessment: assessAll('none-found', { B2: hand }),
          events: [],
          date: T,
        },
        m,
      )
      expect(c.statuses.B2).toBe('not-applicable')
      expect(c.applicable).toBe(30)
      expect(c.ratio).toBe(1)
    }
  })

  it('a Council member cannot be N/A on B2: a hand-set not-applicable is not kept', () => {
    const c = coverage(
      {
        country: country(ELECTED_2024_2025),
        assessment: assessAll('none-found', { B2: 'not-applicable' }),
        events: [],
        date: T,
      },
      m,
    )
    expect(c.statuses.B2).not.toBe('not-applicable')
    expect(c.statuses.B2).toBe('unchecked')
    expect(c.applicable).toBe(31)
    expect(c.ratio).toBeCloseTo(30 / 31, 12)
  })
})

describe('audit §8: "no export data" flag on A1/A2', () => {
  it('EXPORT_DATA_INDICATORS is A1 and A2', () => {
    expect([...EXPORT_DATA_INDICATORS]).toEqual(['A1', 'A2'])
  })

  const flag = (over: Record<string, AssessmentStatus>, events: ScoringEvent[] = []) =>
    coverage(
      {
        country: country(NON_MEMBER),
        assessment: assessAll('none-found', over),
        events,
        date: T,
      },
      m,
    )

  it('no-data on A1 alone, on A2 alone, or on both sets the flag', () => {
    expect(flag({ A1: 'no-data' }).noExportData).toBe(true)
    expect(flag({ A2: 'no-data' }).noExportData).toBe(true)
    expect(flag({ A1: 'no-data', A2: 'no-data' }).noExportData).toBe(true)
  })

  it('no-data on other indicators (A4, C3) does not set the flag', () => {
    const c = flag({ A4: 'no-data', C3: 'no-data' })
    expect(c.noExportData).toBe(false)
    expect(c.missing).toEqual(['A4', 'C3'])
  })

  it('unchecked on A1/A2 is not no-data', () => {
    expect(flag({ A1: 'unchecked', A2: 'unchecked' }).noExportData).toBe(false)
  })

  it('A1 has events and A2 no-data: the flag holds (A2 is missing)', () => {
    const c = flag({ A2: 'no-data' }, [ev('A1', '2024-03-11', -12)])
    expect(c.statuses.A1).toBe('has-events')
    expect(c.noExportData).toBe(true)
    expect(c.missing).toEqual(['A2'])
  })

  it('a published A1 event replaces a hand-set no-data on A1', () => {
    const c = flag({ A1: 'no-data' }, [ev('A1', '2024-03-11', -12)])
    expect(c.statuses.A1).toBe('has-events')
    expect(c.noExportData).toBe(false)
  })

  it('noDataIds lists no-data indicators in methodology order, whatever the assessment order', () => {
    const c = coverage(
      {
        country: country(NON_MEMBER),
        assessment: assess({ D1: 'no-data', A2: 'no-data', C3: 'no-data', A1: 'no-data' }),
        events: [],
        date: T,
      },
      m,
    )
    expect(c.noDataIds).toEqual(['A1', 'A2', 'C3', 'D1'])
    expect(c.missing.filter((id) => c.statuses[id] === 'no-data')).toEqual(['A1', 'A2', 'C3', 'D1'])
  })
})

// ───────────────────────────────────────────────────────────────────────── §9 user weights

type Clip = Record<CategoryId, { clipped: number }>

function published(A: number, B: number, C: number, D: number, passivity: number, E = 0) {
  const categories: Clip = {
    A: { clipped: A },
    B: { clipped: B },
    C: { clipped: C },
    D: { clipped: D },
    E: { clipped: E },
  }
  return { categories, passivity: { value: passivity } }
}

describe('audit §9: S_user = clip(Σ w_k · clip_k − passivity, −100, 100)', () => {
  // docs/02 §7 worked example: A −27, B 7.4, C −5, D 11, no passivity.
  const worked = published(-27, 7.4, -5, 11, 0)

  it('default weights reproduce the worked example: −13.6, display −14, Passive', () => {
    const s = userScore(worked, {}, m)
    expect(s.exact).toBeCloseTo(-13.6, 9)
    expect(s.score).toBe(-13.6)
    expect(s.display).toBe(-14)
    expect(s.band).toBe('passive')
  })

  it('w_A = 0: 0·(−27) + 7.4 − 5 + 11 = 13.4 → 13, Acting', () => {
    const s = userScore(worked, { A: 0 }, m)
    expect(s.score).toBe(13.4)
    expect(s.display).toBe(13)
    expect(s.band).toBe('acting')
  })

  it('all weights 2: 2 · (−13.6) = −27.2 → −27, Enabling', () => {
    const s = userScore(worked, { A: 2, B: 2, C: 2, D: 2 }, m)
    expect(s.score).toBe(-27.2)
    expect(s.display).toBe(-27)
    expect(s.band).toBe('enabling')
  })

  it('w_B = 2 only: −27 + 14.8 − 5 + 11 = −6.2 → −6', () => {
    const s = userScore(worked, { B: 2 }, m)
    expect(s.score).toBe(-6.2)
    expect(s.display).toBe(-6)
  })

  it('passivity is not weighted: all weights 0 with passivity 15 → −15', () => {
    const s = userScore(published(-27, 7.4, -5, 11, 15), { A: 0, B: 0, C: 0, D: 0 }, m)
    expect(s.exact).toBe(-15)
    expect(s.display).toBe(-15)
    expect(s.band).toBe('passive')
  })

  it('all weights 0, no passivity, negative subtotals → 0 (not −0), Passive', () => {
    const s = userScore(published(-27, -3, -5, -1, 0), { A: 0, B: 0, C: 0, D: 0 }, m)
    expect(s.display).toBe(0)
    expect(s.score).toBe(0)
    expect(s.band).toBe('passive')
  })

  it('weights at 2 can push past ±100: the final clip holds', () => {
    const low = userScore(published(-45, -40, -20, -15, 15), { A: 2, B: 2, C: 2, D: 2 }, m)
    // Σ = 2·(−120) − 15 = −255 before the clip.
    expect(low.raw).toBe(-255)
    expect(low.exact).toBe(-100)
    expect(low.display).toBe(-100)
    expect(low.band).toBe('sustaining')
    const high = userScore(published(30, 45, 20, 25, 0), { A: 2, B: 2, C: 2, D: 2 }, m)
    expect(high.raw).toBe(240)
    expect(high.exact).toBe(100)
    expect(high.display).toBe(100)
    expect(high.band).toBe('confronting')
  })

  it('category E is never summed, whatever its published subtotal', () => {
    const s = userScore(published(0, 0, 0, 0, 0, 10), { A: 2, B: 2, C: 2, D: 2 }, m)
    expect(s.exact).toBe(0)
    expect(s.display).toBe(0)
  })

  it('halves are rounded away from zero: ±0.5 and −13.5', () => {
    const neg = userScore(published(0, 0, 0, -1, 0), { D: 0.5 }, m)
    expect(neg.display).toBe(-1)
    expect(neg.band).toBe('passive')
    const pos = userScore(published(0, 0, 0, 1, 0), { D: 0.5 }, m)
    expect(pos.display).toBe(1)
    expect(pos.band).toBe('acting')
    const half = userScore(published(-27, 0, 0, 0, 0), { A: 0.5 }, m)
    expect(half.score).toBe(-13.5)
    expect(half.display).toBe(-14)
  })

  it('a half that floating point stores below .5 still rounds away from zero (−45·0.7, 22.5·1.4)', () => {
    // −45 × 0.7 is −31.5 on paper but −31.499999999999996 in binary64.
    const neg = userScore(published(-45, 0, 0, 0, 0), { A: 0.7 }, m)
    expect(neg.score).toBe(-31.5)
    expect(neg.display).toBe(-32)
    expect(neg.band).toBe('enabling')
    // 22.5 × 1.4 is 31.5 on paper but 31.499999999999996 in binary64.
    const pos = userScore(published(22.5, 0, 0, 0, 0), { A: 1.4 }, m)
    expect(pos.score).toBe(31.5)
    expect(pos.display).toBe(32)
  })

  it('one-decimal score of a product with float noise: 7.4 × 1.5 = 11.1', () => {
    const s = userScore(published(0, 7.4, 0, 0, 0), { B: 1.5 }, m)
    expect(s.score).toBe(11.1)
    expect(s.display).toBe(11)
  })

  it('band boundaries under user weights: −50.5 → −51 Sustaining, −50.4 → −50 Enabling, 40.5 → 41 Confronting, 40.4 → 40 Acting', () => {
    expect(userScore(published(-45, -5.5, 0, 0, 0), {}, m)).toMatchObject({
      display: -51,
      band: 'sustaining',
    })
    expect(userScore(published(-45, -5.4, 0, 0, 0), {}, m)).toMatchObject({
      display: -50,
      band: 'enabling',
    })
    expect(userScore(published(30, 10.5, 0, 0, 0), {}, m)).toMatchObject({
      display: 41,
      band: 'confronting',
    })
    expect(userScore(published(30, 10.4, 0, 0, 0), {}, m)).toMatchObject({
      display: 40,
      band: 'acting',
    })
    // −27 × 1.5 = −40.5 → −41, Enabling; −20.5 → −21 Enabling; −20.4 → −20 Passive.
    expect(userScore(published(-27, 0, 0, 0, 0), { A: 1.5 }, m)).toMatchObject({
      display: -41,
      band: 'enabling',
    })
    expect(userScore(published(-41, 0, 0, 0, 0), { A: 0.5 }, m)).toMatchObject({
      display: -21,
      band: 'enabling',
    })
    expect(userScore(published(-20.4, 0, 0, 0, 0), {}, m)).toMatchObject({
      display: -20,
      band: 'passive',
    })
  })
})

describe('audit §9: the URL encodes the weights as ?w=A,B,C,D with one-decimal values', () => {
  it('formats four one-decimal values in A, B, C, D order', () => {
    expect(formatWeights({ A: 1, B: 1.5, C: 0, D: 2 })).toBe('1.0,1.5,0.0,2.0')
    expect(formatWeights({ D: 2, C: 0, B: 1.5, A: 1 })).toBe('1.0,1.5,0.0,2.0')
  })

  it('missing weights are written at the default 1.0', () => {
    expect(formatWeights({})).toBe('1.0,1.0,1.0,1.0')
    expect(formatWeights({ B: 0.5 })).toBe('1.0,0.5,1.0,1.0')
  })

  it('slider values with float noise are written with one decimal (0.1 + 0.2 → 0.3)', () => {
    expect(formatWeights({ A: 0.1 + 0.2, B: 1.1 + 0.1 + 0.1 })).toBe('0.3,1.3,1.0,1.0')
  })

  it('parses the documented forms', () => {
    expect(parseWeights('1.0,1.5,0.0,2.0')).toEqual({ A: 1, B: 1.5, C: 0, D: 2 })
    expect(parseWeights('1,1.5,0,2')).toEqual({ A: 1, B: 1.5, C: 0, D: 2 })
    expect(parseWeights('0.0,0.0,0.0,0.0')).toEqual({ A: 0, B: 0, C: 0, D: 0 })
    expect(parseWeights('2.0,2.0,2.0,2.0')).toEqual({ A: 2, B: 2, C: 2, D: 2 })
  })

  it('rejects anything that is not four values in [0, 2] with at most one decimal', () => {
    for (const bad of [
      null,
      undefined,
      '',
      '1.0,1.0,1.0',
      '1.0,1.0,1.0,1.0,1.0',
      '2.1,1.0,1.0,1.0',
      '-0.1,1.0,1.0,1.0',
      '1.25,1.0,1.0,1.0',
      'a,b,c,d',
      '1.0,,1.0,1.0',
      'NaN,1.0,1.0,1.0',
      'Infinity,1.0,1.0,1.0',
      '1,0;1,0;1,0;1,0',
    ]) {
      expect(parseWeights(bad), String(bad)).toBeNull()
    }
  })

  it('round-trips every slider value 0.0 … 2.0 in steps of 0.1', () => {
    for (let i = 0; i <= 20; i++) {
      const w = i / 10
      const v = { A: w, B: 2 - w, C: w, D: 1 }
      const s = formatWeights(v)
      expect(s).toMatch(/^\d\.\d,\d\.\d,\d\.\d,\d\.\d$/)
      const back = parseWeights(s)
      expect(back).not.toBeNull()
      const b = back as NonNullable<typeof back>
      expect(b.A).toBeCloseTo(w, 12)
      expect(b.B).toBeCloseTo(2 - w, 12)
      expect(b.C).toBeCloseTo(w, 12)
      expect(b.D).toBe(1)
      expect(formatWeights(b)).toBe(s)
    }
  })

  it('isDefaultWeights is true only for all 1', () => {
    expect(isDefaultWeights({ A: 1, B: 1, C: 1, D: 1 })).toBe(true)
    expect(isDefaultWeights({ A: 1, B: 1.5, C: 1, D: 1 })).toBe(false)
    expect(isDefaultWeights({ A: 0, B: 0, C: 0, D: 0 })).toBe(false)
    const parsed = parseWeights('1.0,1.0,1.0,1.0')
    expect(parsed).not.toBeNull()
    expect(isDefaultWeights(parsed as NonNullable<typeof parsed>)).toBe(true)
  })

  it('a parsed ?w= value gives the same S_user as the weights it encodes', () => {
    const p = published(-27, 7.4, -5, 11, 0)
    const w = parseWeights(formatWeights({ A: 0.5, B: 1.5, C: 1, D: 2 }))
    expect(w).not.toBeNull()
    // 0.5·(−27) + 1.5·7.4 + (−5) + 2·11 = −13.5 + 11.1 − 5 + 22 = 14.6
    const s = userScore(p, w as NonNullable<typeof w>, m)
    expect(s.score).toBe(14.6)
    expect(s.display).toBe(15)
  })
})

// ─────────────────────────────────────────────────── §10 Spearman rank correlation, by hand

describe('audit §10: fractional ranks and Spearman with ties', () => {
  it('averageRanks: highest first, ties share the average of their positions', () => {
    expect(averageRanks([10, 20, 20, 5])).toEqual([3, 1.5, 1.5, 4])
    expect(averageRanks([1, 1, 1])).toEqual([2, 2, 2])
    expect(averageRanks([-10, 11.2, -3, -15, -1, -10])).toEqual([4.5, 1, 3, 6, 2, 4.5])
    expect(averageRanks([])).toEqual([])
  })

  it('averageRanks treats values equal up to float noise as tied (0.1 + 0.2 vs 0.3)', () => {
    expect(averageRanks([0.1 + 0.2, 0.3, 1])).toEqual([2.5, 2.5, 1])
  })

  it('pearson: perfect, inverse, undefined cases', () => {
    expect(pearson([1, 2, 3], [2, 4, 6])).toBeCloseTo(1, 12)
    expect(pearson([1, 2, 3], [3, 2, 1])).toBeCloseTo(-1, 12)
    expect(pearson([1], [1])).toBeNull()
    expect(pearson([1, 1, 1], [1, 2, 3])).toBeNull()
  })

  it('textbook example without ties (IQ vs hours of TV, n = 10): ρ = 1 − 6·194/990 = −29/165', () => {
    const iq = [106, 100, 86, 101, 99, 103, 97, 113, 112, 110]
    const tv = [7, 27, 2, 50, 28, 29, 20, 12, 6, 17]
    expect(spearman(iq, tv)).toBeCloseTo(-29 / 165, 12)
  })

  it('textbook example with a tie (SciPy spearmanr docs): [1..5] vs [5,6,7,8,7] → 8/√95', () => {
    // Ranks of y: 5→1, 6→2, 7,7→3.5, 8→5. dx = [−2,−1,0,1,2], dy = [−2,−1,0.5,2,0.5].
    // Σdxdy = 8, Σdx² = 10, Σdy² = 9.5 → ρ = 8/√95 = 0.8207826816681233.
    expect(spearman([1, 2, 3, 4, 5], [5, 6, 7, 8, 7])).toBeCloseTo(0.8207826816681233, 12)
  })

  it('ties use Pearson on average ranks, not 1 − 6Σd²/(n(n²−1)): [1,2,2,3] vs [1,2,3,4] → √0.9', () => {
    // rx = [4, 2.5, 2.5, 1], ry = [4, 3, 2, 1]; dx = [1.5,0,0,−1.5], dy = [1.5,0.5,−0.5,−1.5].
    // Σdxdy = 4.5, Σdx² = 4.5, Σdy² = 5 → ρ = 4.5/√22.5 = √0.9 ≈ 0.948683 (the shortcut gives 0.95).
    const r = spearman([1, 2, 2, 3], [1, 2, 3, 4])
    expect(r).toBeCloseTo(Math.sqrt(0.9), 12)
    expect(r).not.toBeCloseTo(0.95, 4)
  })

  it('identical rankings → 1, reversed → −1, undefined → null', () => {
    expect(spearman([3, 1, 2], [30, 10, 20])).toBeCloseTo(1, 12)
    expect(spearman([3, 1, 2], [10, 30, 20])).toBeCloseTo(-1, 12)
    expect(spearman([1], [2])).toBeNull()
    expect(spearman([1, 1, 1], [1, 2, 3])).toBeNull()
  })

  it('rankScores: highest first, ties by ISO3 for position, shared fractional rank; one-decimal and integer scores', () => {
    const r = rankScores([
      { iso3: 'CCC', exact: 20, band: 'acting' },
      { iso3: 'AAA', exact: -13.6, band: 'passive' },
      { iso3: 'DDD', exact: -100, band: 'sustaining' },
      { iso3: 'BBB', exact: 20, band: 'acting' },
    ])
    expect(r.map((e) => e.iso3)).toEqual(['BBB', 'CCC', 'AAA', 'DDD'])
    expect(r.map((e) => e.position)).toEqual([1, 2, 3, 4])
    expect(r.map((e) => e.rank)).toEqual([1.5, 1.5, 3, 4])
    const aaa = r[2]
    expect(aaa?.score).toBe(-13.6)
    expect(aaa?.display).toBe(-14)
    expect(aaa?.band).toBe('passive')
  })
})

// ─────────────────────────────────────────────────────────── §10 the five sensitivity tables

/*
 * Six synthetic countries at t = 2026-09-30 (Δ in days from the event date to t):
 *
 * AAA  A3 −15 standing from 2023-10-07; B9 +5 on 2026-09-01 (Δ 29, d 1, qualifies).
 *      A −15, B +5 → −10.
 * BBB  A7 +25 standing from 2024-06-01; B1 +3 on 2024-12-12 (Δ 657, d = 1 − 0.75·292/365 = 0.4 → 1.2).
 *      No qualifying event (A never, B1 never) → passivity 15. 25 + 1.2 − 15 = 11.2.
 * CCC  B11 +5 standing from 2026-01-15, reported (w 0.4 → 2.0, |2| ≥ 2 qualifies);
 *      A5 −5 on 2026-05-01 (Δ 152). A −5, B 2 → −3.
 * DDD  no events → −15 (passivity).
 * EEE  B4 −15 on 2024-12-12 (Δ 657, d 0.4 → −6, outside the passivity window);
 *      D4 +5 on 2025-12-01 (Δ 303, qualifies). B −6, D 5 → −1.
 * FFF  B10 −5 on 2026-08-01 (Δ 60, qualifies); B1 −5 on 2026-07-01 (Δ 91). B −10 → −10.
 *
 * Baseline: AAA −10, BBB 11.2, CCC −3, DDD −15, EEE −1, FFF −10.
 * Ranks (highest first): BBB 1, EEE 2, CCC 3, AAA 4.5, FFF 4.5, DDD 6.
 */
const TS = '2026-09-30'
const ISO = ['AAA', 'BBB', 'CCC', 'DDD', 'EEE', 'FFF'] as const
type Iso = (typeof ISO)[number]

function e(
  c: Iso,
  indicator: string,
  date: string,
  points: number,
  over: Partial<ScoringEvent> = {},
): ScoringEvent {
  return ev(indicator, date, points, {
    ...over,
    country: c,
    id: `evt_${date.replaceAll('-', '_')}_${c}_${indicator}`,
  })
}

const SUITE_INPUT: CountryEvents[] = [
  { iso3: 'AAA', events: [e('AAA', 'A3', '2023-10-07', -15), e('AAA', 'B9', '2026-09-01', 5)] },
  { iso3: 'BBB', events: [e('BBB', 'A7', '2024-06-01', 25), e('BBB', 'B1', '2024-12-12', 3)] },
  {
    iso3: 'CCC',
    events: [
      e('CCC', 'B11', '2026-01-15', 5, { confidence: 'reported' }),
      e('CCC', 'A5', '2026-05-01', -5),
    ],
  },
  { iso3: 'DDD', events: [] },
  { iso3: 'EEE', events: [e('EEE', 'B4', '2024-12-12', -15), e('EEE', 'D4', '2025-12-01', 5)] },
  { iso3: 'FFF', events: [e('FFF', 'B10', '2026-08-01', -5), e('FFF', 'B1', '2026-07-01', -5)] },
]

type Row = [number, number, number, number, number, number]

/** Hand-computed exact scores per variant, in ISO order, with ρ and the changed-display count. */
const EXPECTED = {
  baseline: [-10, 11.2, -3, -15, -1, -10] as Row,
  passivity: {
    // 5: BBB 26.2 − 5 = 21.2, DDD −5 → ranks [5.5,1,3,4,2,5.5] → Σdxdy 14, Σdx² = Σdy² = 17.
    5: { s: [-10, 21.2, -3, -5, -1, -10] as Row, rho: 14 / 17, changed: 2 },
    15: { s: [-10, 11.2, -3, -15, -1, -10] as Row, rho: 1, changed: 0 },
    // 25: BBB 1.2, DDD −25 → same ranks as baseline.
    25: { s: [-10, 1.2, -3, -25, -1, -10] as Row, rho: 1, changed: 2 },
  },
  weights: {
    // A×0.5: AAA −7.5+5, BBB 12.5+1.2−15, CCC −2.5+2 → ranks [4,3,1,6,2,5]; Σdxdy 13, Σdy² 17.5.
    'A0.5': {
      s: [-2.5, -1.3, -0.5, -15, -1, -10] as Row,
      rho: 13 / Math.sqrt(17 * 17.5),
      changed: 3,
    },
    // A×1.5: AAA −22.5+5, BBB 37.5+1.2−15, CCC −7.5+2 → ranks [6,1,3,5,2,4]; Σdxdy 15.5.
    'A1.5': {
      s: [-17.5, 23.7, -5.5, -15, -1, -10] as Row,
      rho: 15.5 / Math.sqrt(17 * 17.5),
      changed: 3,
    },
    // B×0.5: AAA −15+2.5, BBB 25+0.6−15, CCC −5+1, EEE −3+5, FFF −5 → ranks [5,1,3,6,2,4]; Σdxdy 17.
    'B0.5': { s: [-12.5, 10.6, -4, -15, 2, -5] as Row, rho: 17 / Math.sqrt(17 * 17.5), changed: 4 },
    // B×1.5: AAA −15+7.5, BBB 25+1.8−15, CCC −5+3, EEE −9+5, FFF −15 → ranks [4,1,2,5.5,3,5.5]; Σdxdy 15.25, Σdy² 17.
    'B1.5': { s: [-7.5, 11.8, -2, -15, -4, -15] as Row, rho: 15.25 / 17, changed: 5 },
    'C0.5': { s: [-10, 11.2, -3, -15, -1, -10] as Row, rho: 1, changed: 0 },
    'C1.5': { s: [-10, 11.2, -3, -15, -1, -10] as Row, rho: 1, changed: 0 },
    // D×0.5: EEE −6+2.5 = −3.5 → ranks [4.5,1,2,6,3,4.5]; Σdxdy 16, Σdy² 17.
    'D0.5': { s: [-10, 11.2, -3, -15, -3.5, -10] as Row, rho: 16 / 17, changed: 1 },
    // D×1.5: EEE −6+7.5 = 1.5 → same ranks.
    'D1.5': { s: [-10, 11.2, -3, -15, 1.5, -10] as Row, rho: 1, changed: 1 },
  },
  confidence: {
    // reported 0.2: CCC B11 → 1.0, no longer qualifies → −5 + 1 − 15 = −19 → ranks [3.5,1,6,5,2,3.5]; Σdxdy 11.
    0.2: { s: [-10, 11.2, -19, -15, -1, -10] as Row, rho: 11 / 17, changed: 1 },
    // reported 0.6: CCC B11 → 3.0 → −2; same ranks.
    0.6: { s: [-10, 11.2, -2, -15, -1, -10] as Row, rho: 1, changed: 1 },
  },
  // B9/B10 at 0: AAA loses its only qualifying event → −15 − 15 = −30; FFF → −5 − 15 = −20.
  // Ranks [6,1,3,4,2,5]; Σdxdy 14, Σdy² 17.5.
  statements: {
    s: [-30, 11.2, -3, -15, -1, -20] as Row,
    rho: 14 / Math.sqrt(17 * 17.5),
    changed: 2,
  },
  // d = 1: BBB 25 + 3 − 15 = 13; EEE −15 + 5 = −10 (three-way tie with AAA, FFF) →
  // ranks [4,1,2,6,4,4]; Σdxdy 13.5, Σdy² 15.5.
  decay: { s: [-10, 13, -3, -15, -10, -10] as Row, rho: 13.5 / Math.sqrt(17 * 15.5), changed: 2 },
}

function table(suite: SensitivitySuite, id: string) {
  const t = suite.tables.find((x) => x.id === id)
  if (t === undefined) throw new Error(`no table ${id}`)
  return t
}

function one(list: readonly SensitivityVariant[], pred: (v: SensitivityVariant) => boolean) {
  const found = list.filter(pred)
  expect(found).toHaveLength(1)
  return found[0] as SensitivityVariant
}

function weightVariant(suite: SensitivitySuite, k: 'A' | 'B' | 'C' | 'D', w: number) {
  return one(table(suite, 'weights').variants, (v) => {
    const ws = v.params.weights ?? {}
    return (['A', 'B', 'C', 'D'] as const).every((c) => (ws[c] ?? 1) === (c === k ? w : 1))
  })
}

function scoresOf(v: { ranking: readonly { iso3: string; exact: number }[] }): number[] {
  const by = new Map(v.ranking.map((r) => [r.iso3, r.exact]))
  return ISO.map((iso) => {
    const x = by.get(iso)
    if (x === undefined) throw new Error(`${iso} missing from ranking`)
    return x
  })
}

function expectRow(actual: number[], expected: Row) {
  expect(actual).toHaveLength(6)
  for (const [i, x] of actual.entries()) {
    expect(x, ISO[i]).toBeCloseTo(expected[i] as number, 9)
  }
}

describe('audit §10: sensitivity suite on six hand-scored countries', () => {
  const suite = sensitivitySuite(SUITE_INPUT, TS, m)

  it('has the five tables in §10 order with 3, 8, 2, 1, 1 variants', () => {
    expect(suite.date).toBe(TS)
    expect(suite.methodology).toBe(m.version)
    expect(suite.tables.map((t) => t.id)).toEqual([
      'passivity',
      'weights',
      'confidence',
      'statements',
      'decay',
    ])
    expect(suite.tables.map((t) => t.variants.length)).toEqual([3, 8, 2, 1, 1])
  })

  it('baseline: hand scores, ties at the average rank, positions by ISO3', () => {
    expectRow(scoresOf({ ranking: suite.baseline }), EXPECTED.baseline)
    expect(suite.baseline.map((r) => r.iso3)).toEqual(['BBB', 'EEE', 'CCC', 'AAA', 'FFF', 'DDD'])
    expect(suite.baseline.map((r) => r.position)).toEqual([1, 2, 3, 4, 5, 6])
    expect(suite.baseline.map((r) => r.rank)).toEqual([1, 2, 3, 4.5, 4.5, 6])
    expect(suite.baseline.map((r) => r.display)).toEqual([11, -1, -3, -10, -10, -15])
    expect(suite.baseline.map((r) => r.band)).toEqual([
      'acting',
      'passive',
      'passive',
      'passive',
      'passive',
      'passive',
    ])
  })

  it('every variant ranks all six countries', () => {
    for (const t of suite.tables) {
      for (const v of t.variants) {
        expect(v.ranking.map((r) => r.iso3).sort()).toEqual([...ISO])
        expect(v.ranking.map((r) => r.position)).toEqual([1, 2, 3, 4, 5, 6])
      }
    }
  })

  describe('1. passivity at 5, 15, 25', () => {
    for (const p of [5, 15, 25] as const) {
      it(`passivity ${p}`, () => {
        const v = one(table(suite, 'passivity').variants, (x) => x.params.passivityPoints === p)
        const want = EXPECTED.passivity[p]
        expectRow(scoresOf(v), want.s)
        expect(v.spearman).toBeCloseTo(want.rho, 12)
        expect(v.changedDisplay).toBe(want.changed)
      })
    }
  })

  describe('2. each category weight at 0.5 and 1.5, others at 1', () => {
    for (const k of ['A', 'B', 'C', 'D'] as const) {
      for (const w of [0.5, 1.5] as const) {
        it(`${k} × ${w}`, () => {
          const v = weightVariant(suite, k, w)
          const want = EXPECTED.weights[`${k}${w}` as keyof typeof EXPECTED.weights]
          expectRow(scoresOf(v), want.s)
          expect(v.spearman).toBeCloseTo(want.rho, 12)
          expect(v.changedDisplay).toBe(want.changed)
        })
      }
    }

    it('weighted displays round half away from zero, including a float-noise half (EEE D × 0.5)', () => {
      const a = weightVariant(suite, 'A', 0.5)
      const disp = (v: SensitivityVariant, iso: Iso) =>
        v.ranking.find((r) => r.iso3 === iso)?.display
      expect(disp(a, 'AAA')).toBe(-3) // −2.5
      expect(disp(a, 'CCC')).toBe(-1) // −5·0.5 + 2.0 = −0.5
      const d = weightVariant(suite, 'D', 0.5)
      expect(disp(d, 'EEE')).toBe(-4) // −15·0.4·1 + 5·0.5 = −3.5 on paper
      const a15 = weightVariant(suite, 'A', 1.5)
      expect(disp(a15, 'CCC')).toBe(-6) // −5.5
      expect(disp(a15, 'AAA')).toBe(-18) // −17.5
    })
  })

  describe('3. confidence weight of reported at 0.2 and 0.6', () => {
    for (const w of [0.2, 0.6] as const) {
      it(`reported at ${w} (and the passivity qualification follows the rescored contribution)`, () => {
        const v = one(
          table(suite, 'confidence').variants,
          (x) => x.params.confidenceWeights?.reported === w,
        )
        const want = EXPECTED.confidence[w]
        expectRow(scoresOf(v), want.s)
        expect(v.spearman).toBeCloseTo(want.rho, 12)
        expect(v.changedDisplay).toBe(want.changed)
      })
    }
  })

  it('4. statements excluded (B9/B10 at 0)', () => {
    const v = one(table(suite, 'statements').variants, () => true)
    expect([...(v.params.excludeIndicators ?? [])].sort()).toEqual(['B10', 'B9'])
    expectRow(scoresOf(v), EXPECTED.statements.s)
    expect(v.spearman).toBeCloseTo(EXPECTED.statements.rho, 12)
    expect(v.changedDisplay).toBe(EXPECTED.statements.changed)
  })

  it('5. decay off (d = 1 for all repeatable events), with a three-way tie', () => {
    const v = one(table(suite, 'decay').variants, () => true)
    expect(v.params.decay).toBe('off')
    expectRow(scoresOf(v), EXPECTED.decay.s)
    const tied = v.ranking.filter((r) => ['AAA', 'EEE', 'FFF'].includes(r.iso3))
    expect(tied.map((r) => r.rank)).toEqual([4, 4, 4])
    expect(tied.map((r) => r.iso3)).toEqual(['AAA', 'EEE', 'FFF'])
    expect(v.spearman).toBeCloseTo(EXPECTED.decay.rho, 12)
    expect(v.changedDisplay).toBe(EXPECTED.decay.changed)
  })

  it('ρ reported in each variant equals spearman() of the variant and baseline scores', () => {
    const base = scoresOf({ ranking: suite.baseline })
    for (const t of suite.tables) {
      for (const v of t.variants) {
        const rho = spearman(base, scoresOf(v))
        expect(v.spearman, `${t.id}/${v.id}`).toBeCloseTo(rho as number, 12)
      }
    }
  })

  it('does not depend on the order of the input countries (D-25)', () => {
    const shuffled = [3, 5, 0, 4, 1, 2].map((i) => SUITE_INPUT[i] as CountryEvents)
    expect(sensitivitySuite(shuffled, TS, m)).toEqual(suite)
  })
})

describe('audit §10: variant edges on a second hand-scored set', () => {
  /*
   * t = 2026-09-30.
   * XXA  B11 +5 standing from 2026-01-15, disputed (w 0.4 → 2.0, qualifies); E1 +5 on 2026-09-01
   *      (experimental, never summed). S = 2.
   * XXB  B1 +3 on 2023-10-27 (Δ 1069 > 730 → d 0); no qualifying event. S = −15.
   * XXC  B9 +2 on 2026-09-01, corroborated (w 0.7 → 1.4 < 2, does not qualify). S = 1.4 − 15 = −13.6.
   */
  const x = (
    c: string,
    indicator: string,
    date: string,
    points: number,
    over: Partial<ScoringEvent> = {},
  ) =>
    ev(indicator, date, points, {
      ...over,
      country: c,
      id: `evt_${date.replaceAll('-', '_')}_${c}_${indicator}`,
    })
  const input: CountryEvents[] = [
    {
      iso3: 'XXA',
      events: [
        x('XXA', 'B11', '2026-01-15', 5, { confidence: 'disputed' }),
        x('XXA', 'E1', '2026-09-01', 5),
      ],
    },
    { iso3: 'XXB', events: [x('XXB', 'B1', '2023-10-27', 3)] },
    { iso3: 'XXC', events: [x('XXC', 'B9', '2026-09-01', 2, { confidence: 'corroborated' })] },
  ]
  const s = sensitivitySuite(input, TS, m)
  const exact = (rows: readonly { iso3: string; exact: number }[], iso: string) =>
    rows.find((r) => r.iso3 === iso)?.exact

  it('baseline', () => {
    expect(exact(s.baseline, 'XXA')).toBeCloseTo(2, 9)
    expect(exact(s.baseline, 'XXB')).toBeCloseTo(-15, 9)
    expect(exact(s.baseline, 'XXC')).toBeCloseTo(-13.6, 9)
  })

  it('variant 3 changes `reported` only: disputed (also 0.4) and corroborated keep their weights', () => {
    for (const w of [0.2, 0.6]) {
      const v = one(
        table(s, 'confidence').variants,
        (y) => y.params.confidenceWeights?.reported === w,
      )
      expect(exact(v.ranking, 'XXA'), `reported ${w}`).toBeCloseTo(2, 9)
      expect(exact(v.ranking, 'XXC'), `reported ${w}`).toBeCloseTo(-13.6, 9)
      expect(v.changedDisplay).toBe(0)
      expect(v.spearman).toBeCloseTo(1, 12)
    }
  })

  it('variant 5: d = 1 also for a repeatable event older than 730 days', () => {
    const v = one(table(s, 'decay').variants, () => true)
    // XXB: 3 − 15 = −12 (B1 never qualifies). Ranks XXA 1, XXB 2, XXC 3 vs baseline 1, 3, 2:
    // Σd² = 2 → ρ = 1 − 6·2/(3·8) = 0.5.
    expect(exact(v.ranking, 'XXB')).toBeCloseTo(-12, 9)
    expect(exact(v.ranking, 'XXA')).toBeCloseTo(2, 9)
    expect(v.spearman).toBeCloseTo(0.5, 12)
    expect(v.changedDisplay).toBe(1)
  })

  it('a single country: ρ is undefined (null) in every variant', () => {
    const single = sensitivitySuite([input[0] as CountryEvents], TS, m)
    for (const t of single.tables) for (const v of t.variants) expect(v.spearman).toBeNull()
  })
})

describe('audit §8: a hand-set not-applicable outside B2 still lowers `applicable`', () => {
  it('B2 by rule plus A3 by hand → applicable 29', () => {
    const c = coverage(
      {
        country: country(NON_MEMBER),
        assessment: assessAll('none-found', { A3: 'not-applicable' }),
        events: [],
        date: T,
      },
      m,
    )
    expect(c.notApplicableIds).toEqual(['A3', 'B2'])
    expect(c.applicable).toBe(29)
    expect(c.noneFound).toBe(29)
    expect(c.ratio).toBe(1)
  })
})
