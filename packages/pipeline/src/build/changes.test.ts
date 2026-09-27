/**
 * Tests of the changes feed on synthetic countries (AAA, BBB, CCC) and synthetic events: no row
 * here describes a real state or a real act. Every expectation is worked out by hand in the
 * comments next to it (dates, ISO weeks, display scores).
 */
import {
  ApiChangesLatestFile,
  ApiChangesMonthFile,
  type ApiCorrection,
  ApiEvent,
  ApiFeedEntry,
  type ApiReply,
} from '@gai/schema'
import { addDays, roundHalfAwayFromZero } from '@gai/scoring'
import { describe, expect, it } from 'vitest'
import {
  type ChangesInput,
  type FeedCountry,
  feedEntries,
  feedMonths,
  latestFile,
  monthFile,
  monthFiles,
  monthPath,
  moversBetween,
  reportPaths,
} from './changes.js'
import { datesBetween } from './dates.js'
import type { DayScore } from './types.js'

const WINDOW = '2023-10-07'
const BUILD = '2026-09-27' // a Sunday: the last day of 2026-W39

// ---------------------------------------------------------------------------------------------
// Synthetic inputs

/** Daily scores from the window start to `to`, S following the steps (date → S, ascending). */
function days(to: string, steps: readonly [string, number][]): DayScore[] {
  return datesBetween(WINDOW, to).map((d) => {
    let exact = 0
    for (const [from, value] of steps) if (from <= d) exact = value
    return {
      exact,
      score: roundHalfAwayFromZero(exact, 1),
      display: roundHalfAwayFromZero(exact, 0),
      band: 'passive',
      passivity: false,
      coverage: 0.5,
      clipped: { A: 0, B: 0, C: 0, D: 0, E: 0 },
    }
  })
}

const STEPS: Record<string, [string, number][]> = {
  // 0 → −1.5 (display −2) on 2023-10-09, −2.5 (display −3) on 2023-10-20, −13.6 (−14) on
  // 2026-08-01, −3.6 (−4) on 2026-09-10.
  AAA: [
    [WINDOW, 0],
    ['2023-10-09', -1.5],
    ['2023-10-20', -2.5],
    ['2026-08-01', -13.6],
    ['2026-09-10', -3.6],
  ],
  // 0.4 (display 0), 2.6 (3) from 2024-01-01, 0.6 (1) from 2026-09-15.
  BBB: [
    [WINDOW, 0.4],
    ['2024-01-01', 2.6],
    ['2026-09-15', 0.6],
  ],
  // 0.2 → 0.4 on 2026-09-20: the display score stays 0, never a mover.
  CCC: [
    [WINDOW, 0.2],
    ['2026-09-20', 0.4],
  ],
}

function countries(to: string): FeedCountry[] {
  return ['AAA', 'BBB', 'CCC'].map((iso3) => ({
    iso3,
    name: { en: `Country ${iso3}`, fr: `Pays ${iso3}` },
    days: days(to, STEPS[iso3] ?? []),
  }))
}

type EventOver = Partial<ApiEvent> & Pick<ApiEvent, 'id' | 'type' | 'date' | 'points'>

/** A synthetic published gaza event; country, indicator and category are read from the id. */
function ev(over: EventOver): ApiEvent {
  const [, , , , country = 'AAA', indicator = 'B9'] = over.id.split('_')
  return {
    revision: 1,
    country,
    indicator,
    indicator_name: { en: `Indicator ${indicator}`, fr: `Indicateur ${indicator}` },
    category: indicator.charAt(0) as ApiEvent['category'],
    end: null,
    points_rationale: null,
    confidence: 'confirmed',
    scope: ['gaza'],
    summary: { en: `Country ${country} took synthetic action.`, fr: `Pays ${country} action.` },
    actor: null,
    evidence: [
      {
        source: 'src_20260901_synthetic_test',
        quote: 'synthetic',
        quote_lang: 'en',
        quote_en: null,
        quote_fr: null,
        locator: 'row 2',
      },
    ],
    status: 'published',
    supersedes: null,
    related: [],
    generated: over.type === 'computed',
    review: {
      drafted_by: 'test',
      drafted_at: '2026-09-01',
      second_read: null,
      reviewed_by: 'test',
      reviewed_at: '2026-09-01',
      notes: null,
    },
    scored: true,
    at_build: {
      reason: 'counted',
      factor: 1,
      weight: 1,
      value: over.points,
      counted: over.points,
      qualifies: false,
      by: null,
    },
    previous_points: null,
    corrections: [],
    replies: [],
    ...over,
  }
}

const EVENTS: ApiEvent[] = [
  // Standing from before the window, ends inside it: an end entry only.
  ev({
    id: 'evt_2023_05_01_CCC_B11',
    type: 'standing',
    date: '2023-05-01',
    end: '2026-09-22',
    points: 10,
  }),
  // Ends on the window start: it never held inside the window, no entry.
  ev({
    id: 'evt_2023_06_01_BBB_C1',
    type: 'standing',
    date: '2023-06-01',
    end: WINDOW,
    points: 10,
  }),
  // Starts on the window start.
  ev({ id: 'evt_2023_10_07_AAA_B8', type: 'standing', date: WINDOW, points: 3 }),
  // Computed, first of its indicator: previous null, changed.
  ev({
    id: 'evt_2024_03_11_BBB_A1_sipri-2023',
    type: 'computed',
    date: '2024-03-11',
    end: '2026-09-15',
    points: -11.3,
  }),
  ev({
    id: 'evt_2026_08_01_AAA_D1_fts-2026-08',
    type: 'computed',
    date: '2026-08-01',
    end: '2026-09-01',
    points: 3,
    previous_points: 1,
  }),
  ev({ id: 'evt_2026_08_31_CCC_B9', type: 'repeatable', date: '2026-08-31', points: 2 }),
  // Three computed values on 2026-09-01: two unchanged, one changed.
  ev({
    id: 'evt_2026_09_01_CCC_D1_fts-2026-09',
    type: 'computed',
    date: '2026-09-01',
    end: '2026-10-01',
    points: 0,
    previous_points: 0,
  }),
  ev({
    id: 'evt_2026_09_01_AAA_D1_fts-2026-09',
    type: 'computed',
    date: '2026-09-01',
    end: '2026-10-01',
    points: 3,
    previous_points: 3,
  }),
  ev({
    id: 'evt_2026_09_01_BBB_D1_fts-2026-09',
    type: 'computed',
    date: '2026-09-01',
    end: '2026-10-01',
    points: 1,
    previous_points: 3,
  }),
  // Not published or not gaza: never listed.
  ev({
    id: 'evt_2026_09_05_CCC_B9',
    type: 'repeatable',
    date: '2026-09-05',
    points: 2,
    status: 'retracted',
  }),
  ev({
    id: 'evt_2026_09_12_BBB_B10',
    type: 'repeatable',
    date: '2026-09-12',
    points: -5,
    status: 'superseded',
  }),
  ev({
    id: 'evt_2026_09_13_BBB_B9',
    type: 'repeatable',
    date: '2026-09-13',
    points: 2,
    status: 'corrected',
  }),
  ev({
    id: 'evt_2026_09_18_AAA_B9_2',
    type: 'repeatable',
    date: '2026-09-18',
    points: 5,
    scope: ['lebanon'],
  }),
  // Standing, ends after the build date: a start only.
  ev({
    id: 'evt_2026_09_10_AAA_A6',
    type: 'standing',
    date: '2026-09-10',
    end: '2026-10-15',
    points: 10,
  }),
  ev({
    id: 'evt_2026_09_15_BBB_A1_sipri-2026',
    type: 'computed',
    date: '2026-09-15',
    end: null,
    points: -12.6,
    previous_points: -11.3,
  }),
  ev({
    id: 'evt_2026_09_18_AAA_B9',
    type: 'repeatable',
    date: '2026-09-18',
    points: 5,
    scope: ['region', 'gaza'],
  }),
  // Starts and ends the same day: end before start (change order).
  ev({
    id: 'evt_2026_09_20_CCC_C4',
    type: 'standing',
    date: '2026-09-20',
    end: '2026-09-20',
    points: 2,
  }),
  ev({
    id: 'evt_2026_09_22_AAA_C3_comtrade-2025',
    type: 'computed',
    date: '2026-09-22',
    end: null,
    points: -3,
    previous_points: -3,
  }),
  ev({ id: 'evt_2026_09_27_BBB_B9', type: 'repeatable', date: BUILD, points: 2 }),
  // After the build date.
  ev({ id: 'evt_2026_10_02_AAA_B9', type: 'repeatable', date: '2026-10-02', points: 2 }),
]

function cor(id: string, date: string, kind: ApiCorrection['kind'] = 'correction'): ApiCorrection {
  return {
    id,
    date,
    event: 'evt_2026_09_10_AAA_A6',
    country: 'AAA',
    kind,
    flagged_by: 'author',
    flagged_ref: null,
    before: { points: 8 },
    after: { points: 10 },
    reason: 'Synthetic reason.',
    commit: null,
  }
}

const CORRECTIONS: ApiCorrection[] = [
  cor('cor_20260930_1', '2026-09-30'), // after the build date
  cor('cor_20260915_2', '2026-09-15', 'retraction'),
  cor('cor_20260828_1', '2026-08-28'), // exactly 30 days before: outside latest.json's window
  cor('cor_20260927_1', BUILD),
  cor('cor_20260915_1', '2026-09-15'),
  cor('cor_20260829_1', '2026-08-29'),
]

function rep(id: string, published: string): ApiReply {
  return {
    id,
    country: id.slice(13, 16),
    received_at: addDays(published, -5),
    published_at: published,
    from: { org: 'Synthetic office', role: 'Press office' },
    contests: ['evt_2026_09_10_AAA_A6'],
    text: {
      original: 'Synthetic text.',
      lang: 'en',
      en: 'Synthetic text.',
      fr: 'Texte synthétique.',
    },
    response: { en: 'Synthetic response.', fr: 'Réponse synthétique.' },
    outcome: 'none',
    notes: null,
  }
}

const REPLIES: ApiReply[] = [
  rep('rep_20260910_AAA_1', '2026-09-10'),
  rep('rep_20260831_BBB_1', '2026-08-31'),
  rep('rep_20260905_CCC_1', '2026-09-05'),
]

function input(date = BUILD, over: Partial<ChangesInput> = {}): ChangesInput {
  return {
    date,
    windowStart: WINDOW,
    methodology: '1.0.0',
    countries: countries(date),
    events: EVENTS,
    corrections: CORRECTIONS,
    replies: REPLIES,
    ...over,
  }
}

const key = (e: ApiFeedEntry) => `${e.date} ${e.id} ${e.change}`

it('builds valid synthetic events', () => {
  for (const e of EVENTS) expect(() => ApiEvent.parse(e)).not.toThrow()
})

// ---------------------------------------------------------------------------------------------

describe('feedEntries', () => {
  const entries = feedEntries(input())

  it('lists published gaza starts in the window and standing ends after the window start', () => {
    expect(entries.map(key)).toEqual([
      '2023-10-07 evt_2023_10_07_AAA_B8 start',
      '2024-03-11 evt_2024_03_11_BBB_A1_sipri-2023 start',
      '2026-08-01 evt_2026_08_01_AAA_D1_fts-2026-08 start',
      '2026-08-31 evt_2026_08_31_CCC_B9 start',
      '2026-09-01 evt_2026_09_01_AAA_D1_fts-2026-09 start',
      '2026-09-01 evt_2026_09_01_BBB_D1_fts-2026-09 start',
      '2026-09-01 evt_2026_09_01_CCC_D1_fts-2026-09 start',
      '2026-09-10 evt_2026_09_10_AAA_A6 start',
      '2026-09-15 evt_2026_09_15_BBB_A1_sipri-2026 start',
      '2026-09-18 evt_2026_09_18_AAA_B9 start',
      '2026-09-20 evt_2026_09_20_CCC_C4 end',
      '2026-09-20 evt_2026_09_20_CCC_C4 start',
      '2026-09-22 evt_2026_09_22_AAA_C3_comtrade-2025 start',
      '2026-09-22 evt_2023_05_01_CCC_B11 end',
      '2026-09-27 evt_2026_09_27_BBB_B9 start',
    ])
  })

  it('never lists the end of a computed event (its next release is a start)', () => {
    // evt_2026_08_01_AAA_D1 ends 2026-09-01 and evt_2024_03_11_BBB_A1 ends 2026-09-15.
    expect(entries.filter((e) => e.type === 'computed' && e.change === 'end')).toEqual([])
  })

  it('carries previous_points for computed events and flags unchanged recomputations', () => {
    const byId = new Map(entries.filter((e) => e.change === 'start').map((e) => [e.id, e]))
    const pick = (id: string) => {
      const e = byId.get(id)
      return e && [e.previous_points, e.points_changed]
    }
    expect(pick('evt_2024_03_11_BBB_A1_sipri-2023')).toEqual([null, true]) // first value
    expect(pick('evt_2026_08_01_AAA_D1_fts-2026-08')).toEqual([1, true]) // 1 → 3
    expect(pick('evt_2026_09_01_AAA_D1_fts-2026-09')).toEqual([3, false]) // 3 → 3
    expect(pick('evt_2026_09_01_BBB_D1_fts-2026-09')).toEqual([3, true]) // 3 → 1
    expect(pick('evt_2026_09_01_CCC_D1_fts-2026-09')).toEqual([0, false]) // 0 → 0
    expect(pick('evt_2026_09_15_BBB_A1_sipri-2026')).toEqual([-11.3, true])
    expect(pick('evt_2026_09_22_AAA_C3_comtrade-2025')).toEqual([-3, false])
    // Standing and repeatable events: always changed, previous_points null.
    expect(pick('evt_2026_09_10_AAA_A6')).toEqual([null, true])
    expect(pick('evt_2026_09_27_BBB_B9')).toEqual([null, true])
    const end = entries.find((e) => e.id === 'evt_2023_05_01_CCC_B11')
    expect(end).toMatchObject({ change: 'end', date: '2026-09-22', points: 10 })
    expect(end?.previous_points).toBeNull()
    expect(end?.points_changed).toBe(true)
  })

  it('lists the end of a computed value that no other value of its indicator follows', () => {
    // Synthetic D1 series of AAA: +1 for August 2026, nothing for September (no funding row),
    // +1 again from 1 October; and a C3 value replaced on its end date by the next release.
    const events = [
      ev({
        id: 'evt_2026_08_01_AAA_D1_fts',
        indicator: 'D1',
        type: 'computed',
        date: '2026-08-01',
        end: '2026-09-01',
        points: 1,
        previous_points: null,
      }),
      ev({
        id: 'evt_2026_10_01_AAA_D1_fts',
        indicator: 'D1',
        type: 'computed',
        date: '2026-10-01',
        end: '2026-11-01',
        points: 1,
        previous_points: null,
      }),
      ev({
        id: 'evt_2025_05_20_AAA_C3_comtrade-2024-self',
        indicator: 'C3',
        type: 'computed',
        date: '2025-05-20',
        end: '2026-05-20',
        points: -5,
        previous_points: null,
      }),
      ev({
        id: 'evt_2026_05_20_AAA_C3_comtrade-2025-self',
        indicator: 'C3',
        type: 'computed',
        date: '2026-05-20',
        end: null,
        points: -5,
        previous_points: -5,
      }),
    ]
    const out = feedEntries(input('2026-10-15', { events }))
    expect(out.map((e) => [e.date, e.id, e.change, e.points_changed])).toEqual([
      ['2025-05-20', 'evt_2025_05_20_AAA_C3_comtrade-2024-self', 'start', true],
      ['2026-05-20', 'evt_2026_05_20_AAA_C3_comtrade-2025-self', 'start', false],
      ['2026-08-01', 'evt_2026_08_01_AAA_D1_fts', 'start', true],
      ['2026-09-01', 'evt_2026_08_01_AAA_D1_fts', 'end', true],
      ['2026-10-01', 'evt_2026_10_01_AAA_D1_fts', 'start', true],
    ])
    expect(out[3]?.previous_points).toBeNull()
  })

  it('ignores previous_points on events that are not computed', () => {
    const e = ev({ id: 'evt_2026_09_02_AAA_B9', type: 'repeatable', date: '2026-09-02', points: 2 })
    const [entry] = feedEntries(input(BUILD, { events: [{ ...e, previous_points: 2 }] }))
    expect(entry).toMatchObject({ previous_points: null, points_changed: true })
  })

  it('copies the event fields and names the country from the input', () => {
    const e = entries.find((x) => x.id === 'evt_2026_09_15_BBB_A1_sipri-2026')
    expect(e).toEqual({
      id: 'evt_2026_09_15_BBB_A1_sipri-2026',
      country: 'BBB',
      country_name: { en: 'Country BBB', fr: 'Pays BBB' },
      indicator: 'A1',
      indicator_name: { en: 'Indicator A1', fr: 'Indicateur A1' },
      category: 'A',
      type: 'computed',
      change: 'start',
      date: '2026-09-15',
      points: -12.6,
      previous_points: -11.3,
      points_changed: true,
      confidence: 'confirmed',
      generated: true,
      summary: { en: 'Country BBB took synthetic action.', fr: 'Pays BBB action.' },
    })
    for (const x of entries) expect(() => ApiFeedEntry.parse(x)).not.toThrow()
  })

  it('does not depend on the order of the events or the countries', () => {
    const shuffled = input(BUILD, {
      events: [...EVENTS].reverse(),
      countries: [...countries(BUILD)].reverse(),
    })
    expect(feedEntries(shuffled)).toEqual(entries)
  })

  it('stops at the build date', () => {
    expect(feedEntries(input('2026-09-20')).map(key).slice(-3)).toEqual([
      '2026-09-18 evt_2026_09_18_AAA_B9 start',
      '2026-09-20 evt_2026_09_20_CCC_C4 end',
      '2026-09-20 evt_2026_09_20_CCC_C4 start',
    ])
  })

  it('throws on an event of a country that is not scored, and on a date before the window', () => {
    const stray = ev({
      id: 'evt_2026_09_02_DDD_B9',
      type: 'repeatable',
      date: '2026-09-02',
      points: 2,
    })
    expect(() => feedEntries(input(BUILD, { events: [stray] }))).toThrow(/DDD/)
    expect(() => feedEntries(input(BUILD, { date: '2023-10-06' }))).toThrow(RangeError)
  })
})

// ---------------------------------------------------------------------------------------------

describe('moversBetween', () => {
  it('lists display-score rises and falls with names, one-decimal and display values', () => {
    // 2026-08-31 → 2026-09-27: AAA −13.6 → −3.6 (−14 → −4); BBB 2.6 → 0.6 (3 → 1);
    // CCC 0.2 → 0.4 (0 → 0) is not a mover.
    expect(moversBetween(input(), '2026-08-31', BUILD, null)).toEqual({
      days: null,
      from: '2026-08-31',
      to: BUILD,
      up: [
        {
          iso3: 'AAA',
          name: { en: 'Country AAA', fr: 'Pays AAA' },
          from: -13.6,
          to: -3.6,
          delta: 10,
          display_from: -14,
          display_to: -4,
          display_delta: 10,
        },
      ],
      down: [
        {
          iso3: 'BBB',
          name: { en: 'Country BBB', fr: 'Pays BBB' },
          from: 2.6,
          to: 0.6,
          delta: -2,
          display_from: 3,
          display_to: 1,
          display_delta: -2,
        },
      ],
    })
  })

  it('orders by the size of the display change, then the exact change, then ISO3', () => {
    const flat = (iso3: string, from: number, to: number): FeedCountry => ({
      iso3,
      name: { en: iso3, fr: iso3 },
      days: days('2023-10-08', [
        [WINDOW, from],
        ['2023-10-08', to],
      ]),
    })
    const m = moversBetween(
      input('2023-10-08', {
        countries: [
          flat('EEE', 0, 2.4), // +2 display, exact +2.4
          flat('FFF', 0, 1.6), // +2 display, exact +1.6
          flat('GGG', 0, 2.4), // +2 display, exact +2.4: ISO3 after EEE
          flat('HHH', 0, 5), // +5
          flat('JJJ', 0, -0.6), // −1
          flat('KKK', 0, -3), // −3
        ],
      }),
      WINDOW,
      '2023-10-08',
      7,
    )
    expect(m.days).toBe(7)
    expect(m.up.map((x) => x.iso3)).toEqual(['HHH', 'EEE', 'GGG', 'FFF'])
    expect(m.down.map((x) => x.iso3)).toEqual(['KKK', 'JJJ'])
  })

  it('throws when a date has no daily score or the window is reversed', () => {
    expect(() => moversBetween(input(), '2023-10-06', BUILD, null)).toThrow(/no daily score/)
    expect(() => moversBetween(input(), BUILD, '2026-09-28', null)).toThrow(/no daily score/)
    expect(() => moversBetween(input(), BUILD, '2026-09-01', null)).toThrow(RangeError)
  })
})

// ---------------------------------------------------------------------------------------------

describe('monthFile', () => {
  const inp = input()
  const entries = feedEntries(inp)
  const september = monthFile(inp, '2026-09', entries)
  const august = monthFile(inp, '2026-08', entries)
  const weekKeys = (m: ApiChangesMonthFile) =>
    m.weeks.map((w) => [w.week, w.from, w.to, w.entries.map(key), w.unchanged_computed])

  it('parses with the API schema', () => {
    for (const m of monthFiles(inp, entries))
      expect(() => ApiChangesMonthFile.parse(m)).not.toThrow()
  })

  it('the month in progress ends on the build date and is not complete', () => {
    expect([september.from, september.to, september.complete]).toEqual(['2026-09-01', BUILD, false])
    expect(september.month).toBe('2026-09')
    expect(september.methodology).toBe('1.0.0')
    expect(september.reports).toEqual(reportPaths('2026-09'))
  })

  it('splits ISO weeks that span a month boundary, full Monday–Sunday bounds', () => {
    // 2026-09-01 is a Tuesday: its week (2026-W36) runs from Monday 31 August to 6 September.
    // 2026-09-28 (W40) is after the build date, so September has four weeks.
    expect(weekKeys(september)).toEqual([
      [
        '2026-W36',
        '2026-08-31',
        '2026-09-06',
        [
          '2026-09-01 evt_2026_09_01_AAA_D1_fts-2026-09 start',
          '2026-09-01 evt_2026_09_01_BBB_D1_fts-2026-09 start',
          '2026-09-01 evt_2026_09_01_CCC_D1_fts-2026-09 start',
        ],
        2,
      ],
      ['2026-W37', '2026-09-07', '2026-09-13', ['2026-09-10 evt_2026_09_10_AAA_A6 start'], 0],
      [
        '2026-W38',
        '2026-09-14',
        '2026-09-20',
        [
          '2026-09-15 evt_2026_09_15_BBB_A1_sipri-2026 start',
          '2026-09-18 evt_2026_09_18_AAA_B9 start',
          '2026-09-20 evt_2026_09_20_CCC_C4 end',
          '2026-09-20 evt_2026_09_20_CCC_C4 start',
        ],
        0,
      ],
      [
        '2026-W39',
        '2026-09-21',
        '2026-09-27',
        [
          '2026-09-22 evt_2026_09_22_AAA_C3_comtrade-2025 start',
          '2026-09-22 evt_2023_05_01_CCC_B11 end',
          '2026-09-27 evt_2026_09_27_BBB_B9 start',
        ],
        1,
      ],
    ])
    // 2026-08-01 is a Saturday (week of Monday 27 July, W31); 31 August opens W36, which holds
    // only the August entry in the August file.
    expect(weekKeys(august)).toEqual([
      [
        '2026-W31',
        '2026-07-27',
        '2026-08-02',
        ['2026-08-01 evt_2026_08_01_AAA_D1_fts-2026-08 start'],
        0,
      ],
      ['2026-W32', '2026-08-03', '2026-08-09', [], 0],
      ['2026-W33', '2026-08-10', '2026-08-16', [], 0],
      ['2026-W34', '2026-08-17', '2026-08-23', [], 0],
      ['2026-W35', '2026-08-24', '2026-08-30', [], 0],
      ['2026-W36', '2026-08-31', '2026-09-06', ['2026-08-31 evt_2026_08_31_CCC_B9 start'], 0],
    ])
    expect([august.from, august.to, august.complete]).toEqual(['2026-08-01', '2026-08-31', true])
  })

  it('names the ISO week across a year boundary', () => {
    // 2024-12-30 is the Monday of 2025-W01; 2024-12-01 is a Sunday (week of 25 November, W48).
    const events = [
      ev({ id: 'evt_2024_12_31_AAA_B9', type: 'repeatable', date: '2024-12-31', points: 2 }),
      ev({ id: 'evt_2025_01_02_BBB_B9', type: 'repeatable', date: '2025-01-02', points: 2 }),
    ]
    const inp2 = input(BUILD, { events })
    const all = feedEntries(inp2)
    const december = monthFile(inp2, '2024-12', all)
    const january = monthFile(inp2, '2025-01', all)
    expect(december.weeks.map((w) => w.week)).toEqual([
      '2024-W48',
      '2024-W49',
      '2024-W50',
      '2024-W51',
      '2024-W52',
      '2025-W01',
    ])
    expect(weekKeys(december).at(-1)).toEqual([
      '2025-W01',
      '2024-12-30',
      '2025-01-05',
      ['2024-12-31 evt_2024_12_31_AAA_B9 start'],
      0,
    ])
    expect(weekKeys(january)[0]).toEqual([
      '2025-W01',
      '2024-12-30',
      '2025-01-05',
      ['2025-01-02 evt_2025_01_02_BBB_B9 start'],
      0,
    ])
  })

  it('October 2023 starts on the window start and its movers run from the window start', () => {
    const october = monthFile(inp, '2023-10', entries)
    expect([october.from, october.to, october.complete]).toEqual([WINDOW, '2023-10-31', true])
    // 2023-10-07 is a Saturday: first week 2023-W40 (2 to 8 October); 30 October opens W44.
    expect(weekKeys(october)).toEqual([
      ['2023-W40', '2023-10-02', '2023-10-08', ['2023-10-07 evt_2023_10_07_AAA_B8 start'], 0],
      ['2023-W41', '2023-10-09', '2023-10-15', [], 0],
      ['2023-W42', '2023-10-16', '2023-10-22', [], 0],
      ['2023-W43', '2023-10-23', '2023-10-29', [], 0],
      ['2023-W44', '2023-10-30', '2023-11-05', [], 0],
    ])
    // AAA 0 → −2.5 (display 0 → −3, half away from zero); BBB and CCC flat.
    expect(october.movers).toEqual({
      days: null,
      from: WINDOW,
      to: '2023-10-31',
      up: [],
      down: [
        {
          iso3: 'AAA',
          name: { en: 'Country AAA', fr: 'Pays AAA' },
          from: 0,
          to: -2.5,
          delta: -2.5,
          display_from: 0,
          display_to: -3,
          display_delta: -3,
        },
      ],
    })
  })

  it('movers run from the day before the month to its last day or the build date', () => {
    expect([september.movers.from, september.movers.to]).toEqual(['2026-08-31', BUILD])
    expect(september.movers.up.map((m) => [m.iso3, m.display_delta])).toEqual([['AAA', 10]])
    expect(september.movers.down.map((m) => [m.iso3, m.display_delta])).toEqual([['BBB', -2]])
    // August: 31 July −2.5 (−3) → 31 August −13.6 (−14) for AAA.
    expect([august.movers.from, august.movers.to]).toEqual(['2026-07-31', '2026-08-31'])
    expect(august.movers.down.map((m) => [m.iso3, m.delta, m.display_delta])).toEqual([
      ['AAA', -11.1, -11],
    ])
    expect(august.movers.up).toEqual([])
  })

  it('keeps the corrections dated and the replies published in the month, and counts', () => {
    expect(september.corrections.map((c) => c.id)).toEqual([
      'cor_20260915_1',
      'cor_20260915_2',
      'cor_20260927_1',
    ])
    expect(august.corrections.map((c) => c.id)).toEqual(['cor_20260828_1', 'cor_20260829_1'])
    expect(september.replies.map((r) => r.id)).toEqual(['rep_20260905_CCC_1', 'rep_20260910_AAA_1'])
    expect(august.replies.map((r) => r.id)).toEqual(['rep_20260831_BBB_1'])
    expect(september.counts).toEqual({ entries: 11, starts: 9, ends: 2, unchanged_computed: 3 })
    expect(august.counts).toEqual({ entries: 2, starts: 2, ends: 0, unchanged_computed: 0 })
  })

  it('a month in progress near the window start', () => {
    const early = input('2023-10-10')
    const october = monthFile(early, '2023-10', feedEntries(early))
    expect([october.from, october.to, october.complete]).toEqual([WINDOW, '2023-10-10', false])
    expect(october.weeks.map((w) => w.week)).toEqual(['2023-W40', '2023-W41'])
    // AAA 0 → −1.5 (display −2) by 10 October.
    expect(october.movers.down.map((m) => [m.iso3, m.from, m.to, m.display_to])).toEqual([
      ['AAA', 0, -1.5, -2],
    ])
    expect(() => ApiChangesMonthFile.parse(october)).not.toThrow()
  })

  it('throws for a month outside the feed', () => {
    expect(() => monthFile(inp, '2023-09', entries)).toThrow(/outside the feed/)
    expect(() => monthFile(inp, '2026-10', entries)).toThrow(/outside the feed/)
  })

  it('does not depend on the order of the inputs', () => {
    const shuffled = input(BUILD, {
      events: [...EVENTS].reverse(),
      countries: [...countries(BUILD)].reverse(),
      corrections: [...CORRECTIONS].reverse(),
      replies: [...REPLIES].reverse(),
    })
    expect(monthFile(shuffled, '2026-09', [...entries].reverse())).toEqual(september)
  })
})

// ---------------------------------------------------------------------------------------------

describe('latestFile', () => {
  const inp = input()
  const entries = feedEntries(inp)
  const latest = latestFile(inp, entries, monthFiles(inp, entries))

  it('parses with the API schema', () => {
    expect(() => ApiChangesLatestFile.parse(latest)).not.toThrow()
    expect(latest.build_date).toBe(BUILD)
    expect(latest.methodology).toBe('1.0.0')
  })

  it('movers over 7 and 30 days', () => {
    // d7: 2026-09-20 → 2026-09-27: nobody's display score moved (CCC 0.4 → 0.4).
    expect(latest.movers.d7).toEqual({ days: 7, from: '2026-09-20', to: BUILD, up: [], down: [] })
    // d30: 2026-08-28 → 2026-09-27: AAA −14 → −4, BBB 3 → 1.
    expect(latest.movers.d30.days).toBe(30)
    expect(latest.movers.d30.from).toBe('2026-08-28')
    expect(latest.movers.d30.up.map((m) => [m.iso3, m.display_delta])).toEqual([['AAA', 10]])
    expect(latest.movers.d30.down.map((m) => [m.iso3, m.display_delta])).toEqual([['BBB', -2]])
  })

  it('recent lists the entries newest first, unchanged computed values left out (P-09)', () => {
    // Left out: AAA C3 of 2026-09-22 (−3, as before), AAA D1 of 2026-09-01 (+3, as before) and
    // CCC D1 of 2026-09-01 (0, as before).
    expect(latest.recent.map(key)).toEqual([
      '2026-09-27 evt_2026_09_27_BBB_B9 start',
      '2026-09-22 evt_2023_05_01_CCC_B11 end',
      '2026-09-20 evt_2026_09_20_CCC_C4 end',
      '2026-09-20 evt_2026_09_20_CCC_C4 start',
      '2026-09-18 evt_2026_09_18_AAA_B9 start',
      '2026-09-15 evt_2026_09_15_BBB_A1_sipri-2026 start',
      '2026-09-10 evt_2026_09_10_AAA_A6 start',
      '2026-09-01 evt_2026_09_01_BBB_D1_fts-2026-09 start',
      '2026-08-31 evt_2026_08_31_CCC_B9 start',
      '2026-08-01 evt_2026_08_01_AAA_D1_fts-2026-08 start',
      '2024-03-11 evt_2024_03_11_BBB_A1_sipri-2023 start',
      '2023-10-07 evt_2023_10_07_AAA_B8 start',
    ])
  })

  it('recent keeps the 20 latest entries', () => {
    // 25 synthetic events, one a day from 1 to 25 September, alternating AAA and BBB, plus a
    // CCC event on 25 September: the 20 latest are 25 September (AAA, CCC) down to 7 September.
    const many = Array.from({ length: 25 }, (_, i) => {
      const date = addDays('2026-09-01', i)
      const iso3 = i % 2 === 0 ? 'AAA' : 'BBB'
      return ev({
        id: `evt_${date.replaceAll('-', '_')}_${iso3}_B9`,
        type: 'repeatable',
        date,
        points: 2,
      })
    })
    many.push(
      ev({ id: 'evt_2026_09_25_CCC_B9', type: 'repeatable', date: '2026-09-25', points: 2 }),
    )
    const inp2 = input(BUILD, { events: many })
    const all = feedEntries(inp2)
    const recent = latestFile(inp2, all, monthFiles(inp2, all)).recent
    expect(recent).toHaveLength(20)
    expect(recent.slice(0, 3).map(key)).toEqual([
      '2026-09-25 evt_2026_09_25_AAA_B9 start',
      '2026-09-25 evt_2026_09_25_CCC_B9 start',
      '2026-09-24 evt_2026_09_24_BBB_B9 start',
    ])
    expect(recent.at(-1)?.date).toBe('2026-09-07')
  })

  it('five ISO weeks newest first, entries of every month, up to the build date', () => {
    expect(
      latest.weeks.map((w) => [w.week, w.from, w.to, w.entries.length, w.unchanged_computed]),
    ).toEqual([
      ['2026-W39', '2026-09-21', '2026-09-27', 3, 1],
      ['2026-W38', '2026-09-14', '2026-09-20', 4, 0],
      ['2026-W37', '2026-09-07', '2026-09-13', 1, 0],
      ['2026-W36', '2026-08-31', '2026-09-06', 4, 2],
      ['2026-W35', '2026-08-24', '2026-08-30', 0, 0],
    ])
    // W36 is not clipped to a month: 31 August and 1 September, in feed order.
    expect(latest.weeks[3]?.entries.map(key)).toEqual([
      '2026-08-31 evt_2026_08_31_CCC_B9 start',
      '2026-09-01 evt_2026_09_01_AAA_D1_fts-2026-09 start',
      '2026-09-01 evt_2026_09_01_BBB_D1_fts-2026-09 start',
      '2026-09-01 evt_2026_09_01_CCC_D1_fts-2026-09 start',
    ])
  })

  it('clips the weeks and recent to the build date', () => {
    // Build date Wednesday 2026-09-23, given the entries of a later build: 27 September is out.
    const mid = input('2026-09-23')
    const l = latestFile(mid, entries, monthFiles(mid, entries))
    expect(l.weeks[0]).toMatchObject({ week: '2026-W39', from: '2026-09-21', to: '2026-09-27' })
    expect(l.weeks[0]?.entries.map(key)).toEqual([
      '2026-09-22 evt_2026_09_22_AAA_C3_comtrade-2025 start',
      '2026-09-22 evt_2023_05_01_CCC_B11 end',
    ])
    expect(l.recent[0]?.date).toBe('2026-09-22')
    expect(() => ApiChangesLatestFile.parse(l)).not.toThrow()
  })

  it('corrections dated in the 30 days to the build date, newest first', () => {
    // (2026-08-28, 2026-09-27]: 28 August and 30 September are out.
    expect(latest.corrections.map((c) => c.id)).toEqual([
      'cor_20260927_1',
      'cor_20260915_1',
      'cor_20260915_2',
      'cor_20260829_1',
    ])
  })

  it('lists every month from 2023-10 ascending with its files and counts', () => {
    expect(latest.months).toHaveLength(36) // October 2023 to September 2026
    expect(latest.months[0]).toEqual({
      month: '2023-10',
      file: 'changes/2023-10.json',
      reports: reportPaths('2023-10'),
      entries: 1,
      complete: true,
    })
    expect(latest.months.at(-1)).toEqual({
      month: '2026-09',
      file: 'changes/2026-09.json',
      reports: reportPaths('2026-09'),
      entries: 11,
      complete: false,
    })
    expect(latest.months.map((m) => m.entries).reduce((a, b) => a + b, 0)).toBe(entries.length)
    expect(latest.months.filter((m) => !m.complete).map((m) => m.month)).toEqual(['2026-09'])
  })

  it('takes the month files in any order but refuses a missing month', () => {
    const months = monthFiles(inp, entries)
    expect(latestFile(inp, entries, [...months].reverse())).toEqual(latest)
    expect(() => latestFile(inp, entries, months.slice(1))).toThrow(/one month file per month/)
  })

  it('near the window start: movers never start before it, weeks stop at it', () => {
    const early = input('2023-10-10')
    const all = feedEntries(early)
    const l = latestFile(early, all, monthFiles(early, all))
    // moversFrom clamps both windows to 2023-10-07; AAA 0 → −1.5 (display −2).
    for (const [m, d] of [
      [l.movers.d7, 7],
      [l.movers.d30, 30],
    ] as const) {
      expect([m.days, m.from, m.to]).toEqual([d, WINDOW, '2023-10-10'])
      expect(m.down.map((x) => [x.iso3, x.from, x.to, x.delta, x.display_delta])).toEqual([
        ['AAA', 0, -1.5, -1.5, -2],
      ])
    }
    // Week of 10 October (W41) and the week of the window start (W40); W39 ends on
    // 1 October, before the window, and is left out.
    expect(l.weeks.map((w) => [w.week, w.entries.map(key)])).toEqual([
      ['2023-W41', []],
      ['2023-W40', ['2023-10-07 evt_2023_10_07_AAA_B8 start']],
    ])
    expect(l.months).toEqual([
      {
        month: '2023-10',
        file: 'changes/2023-10.json',
        reports: reportPaths('2023-10'),
        entries: 1,
        complete: false,
      },
    ])
    expect(l.corrections).toEqual([])
    expect(() => ApiChangesLatestFile.parse(l)).not.toThrow()
  })
})

// ---------------------------------------------------------------------------------------------

describe('paths and months', () => {
  it('reportPaths and monthPath', () => {
    expect(reportPaths('2026-09')).toEqual({
      en: 'changes/2026-09.md',
      fr: 'changes/2026-09.fr.md',
      scorecard_en: 'changes/2026-09.scorecard.md',
      scorecard_fr: 'changes/2026-09.scorecard.fr.md',
    })
    expect(monthPath('2023-10')).toBe('changes/2023-10.json')
    expect(() => reportPaths('2026-13')).toThrow(RangeError)
    expect(() => reportPaths('2026-9')).toThrow(RangeError)
  })

  it('feedMonths runs from the window month to the build month', () => {
    expect(feedMonths(input('2023-10-07'))).toEqual(['2023-10'])
    const months = feedMonths(input('2024-01-01'))
    expect(months).toEqual(['2023-10', '2023-11', '2023-12', '2024-01'])
  })
})
