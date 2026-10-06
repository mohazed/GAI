/**
 * Written in P-03 by an independent test writer who derived every expectation from the contract
 * before reading the engine; kept as a second, independent check of the same rules.
 *
 * Independent audit of the time behaviour (docs/02 §3), the confidence weights (§4) and the
 * passivity rule (§6). Every expected value below is derived by hand from the contract, not from
 * the engine: dates are hard-coded (no date arithmetic from the engine under test) and decay
 * values are written as fractions of 365.
 *
 * Date facts used throughout (checked by hand):
 * - 2024 is a leap year; 2024-01-01 is day 19 723 since 1970-01-01, so 2024-02-29 is day 19 782.
 * - 2024-02-29 + 365 = 2025-02-28; + 366 = 2025-03-01; + 729 = 2026-02-27; + 730 = 2026-02-28.
 * - 2023-10-07 + 365 = 2024-10-06 (the span holds 2024-02-29); + 547 = 2025-04-06;
 *   + 729 = 2025-10-05; + 730 = 2025-10-06; + 731 = 2025-10-07.
 * - 2025-06-01 − 365 = 2024-06-01; 2024-12-31 − 365 = 2024-01-01; 2025-02-28 − 365 = 2024-02-29;
 *   2025-03-01 − 365 = 2024-03-01.
 */
import { describe, expect, it } from 'vitest'
import type { ScoreOptions } from './contribution.js'
import {
  confidenceWeight,
  contribution,
  decayFactor,
  endDay,
  ineligibility,
  timeFactor,
} from './contribution.js'
import { createScorer, scoreCountry } from './score.js'
import { ev, methodologyRc1 } from './test-helpers.js'
import { dayNumber, daysBetween, isIsoDate } from './time.js'
import type { Confidence, ScoringEvent } from './types.js'

// The docs/02 rules as written: methodology 1.0.0-rc.1 (rc.2 rules: rc2.test.ts).
const m = methodologyRc1()

/** d(Δ) on the decay ramp, 365 < Δ ≤ 730, written out by hand: 1 − 0.75·(Δ − 365)/365. */
const ramp = (delta: number) => 1 - (0.75 * (delta - 365)) / 365

const close = (actual: number, expected: number) => expect(actual).toBeCloseTo(expected, 9)

const c = (e: ScoringEvent, date: string, options?: ScoreOptions) =>
  contribution(e, date, m, options)

const passivityAt = (events: ScoringEvent[], date: string, options?: ScoreOptions) =>
  scoreCountry('TST', events, date, m, options).passivity

// ---------------------------------------------------------------------------------------------
// Calendar sanity: the engine's day arithmetic, checked against hand-computed values. The rest of
// the file hard-codes dates, so these only tell us whether a failure below comes from the calendar.

describe('calendar arithmetic used by the time rules', () => {
  it('day numbers are days since 1970-01-01, leap days included', () => {
    expect(dayNumber('1970-01-01')).toBe(0)
    expect(dayNumber('2000-01-01')).toBe(10957)
    expect(dayNumber('2024-01-01')).toBe(19723)
    expect(dayNumber('2024-02-29')).toBe(19782)
    expect(dayNumber('2024-03-01') - dayNumber('2024-02-28')).toBe(2)
  })

  it('whole days across the leap day and across daylight-saving changes', () => {
    expect(daysBetween('2024-02-29', '2025-02-28')).toBe(365)
    expect(daysBetween('2024-02-29', '2025-03-01')).toBe(366)
    expect(daysBetween('2023-10-07', '2024-10-06')).toBe(365)
    expect(daysBetween('2023-10-07', '2024-10-07')).toBe(366)
    expect(daysBetween('2024-01-01', '2024-12-31')).toBe(365)
    expect(daysBetween('2024-03-30', '2024-04-01')).toBe(2)
    expect(daysBetween('2024-10-26', '2024-10-28')).toBe(2)
    expect(daysBetween('2025-06-01', '2024-06-01')).toBe(-365)
    expect(daysBetween('2024-03-09', '2024-03-11')).toBe(2)
    expect(daysBetween('2024-11-02', '2024-11-04')).toBe(2)
  })

  it('only YYYY-MM-DD dates are accepted', () => {
    expect(() => dayNumber('2024-2-29')).toThrow()
    expect(() => dayNumber('2024-02-29T00:00:00Z')).toThrow()
    expect(() => dayNumber('')).toThrow()
  })

  it('29 February exists only in leap years', () => {
    expect(isIsoDate('2024-02-29')).toBe(true)
    expect(isIsoDate('2000-02-29')).toBe(true)
    expect(isIsoDate('2023-02-29')).toBe(false)
    expect(isIsoDate('2100-02-29')).toBe(false)
    expect(() => dayNumber('2025-02-29')).toThrow()
  })
})

// ---------------------------------------------------------------------------------------------
// §3 — event types per indicator

describe('§3 which indicators use which type', () => {
  const typeOf = (id: string) => m.indicatorById.get(id)?.type

  it('standing: A3, A6, A7, B3, B5, B6, B7, B8, B11, B12, C1, C2, C4, D2, D3', () => {
    for (const id of [
      'A3',
      'A6',
      'A7',
      'B3',
      'B5',
      'B6',
      'B7',
      'B8',
      'B11',
      'B12',
      'C1',
      'C2',
      'C4',
      'D2',
      'D3',
    ]) {
      expect(typeOf(id), id).toBe('standing')
    }
  })

  it('repeatable: A5, A8, B1, B2, B4, B9, B10, C5, C6, D4, D5, E1–E3', () => {
    for (const id of [
      'A5',
      'A8',
      'B1',
      'B2',
      'B4',
      'B9',
      'B10',
      'C5',
      'C6',
      'D4',
      'D5',
      'E1',
      'E2',
      'E3',
    ]) {
      expect(typeOf(id), id).toBe('repeatable')
    }
  })

  it('computed: A1, A2, A4, C3, D1', () => {
    for (const id of ['A1', 'A2', 'A4', 'C3', 'D1']) expect(typeOf(id), id).toBe('computed')
  })

  it('an event whose type differs from its indicator is rejected', () => {
    const wrong = ev('C5', '2025-01-10', 5, { type: 'standing' })
    expect(() => createScorer('TST', [wrong], m)).toThrow()
  })
})

// ---------------------------------------------------------------------------------------------
// §3 — decay d(Δ)

describe('§3 decay d(Δ), Δ in whole days', () => {
  const cases: [number, number][] = [
    [-365, 0],
    [-1, 0],
    [0, 1],
    [1, 1],
    [364, 1],
    [365, 1],
    [366, 1 - 0.75 / 365],
    [547, 1 - 136.5 / 365],
    [548, 1 - 137.25 / 365],
    [729, 92 / 365],
    [730, 0.25],
    [731, 0],
    [1000, 0],
  ]
  for (const [delta, expected] of cases) {
    it(`d(${delta}) = ${expected}`, () => close(decayFactor(delta, m.decay), expected))
  }

  it('d(730) is exactly 0.25 and d(729) is 92/365', () => {
    close(decayFactor(730, m.decay), 0.25)
    close(decayFactor(729, m.decay), 0.2520547945205479)
  })

  it('the ramp drops by the same 0.75/365 every day from Δ = 366 to Δ = 730', () => {
    for (let delta = 366; delta <= 730; delta++) {
      close(decayFactor(delta - 1, m.decay) - decayFactor(delta, m.decay), 0.75 / 365)
    }
  })

  it('d is non-increasing on Δ ≥ 0 and stays in [0.25, 1] up to Δ = 730', () => {
    for (let delta = 0; delta <= 740; delta++) {
      const d = decayFactor(delta, m.decay)
      expect(d).toBeLessThanOrEqual(decayFactor(delta - 1 < 0 ? 0 : delta - 1, m.decay) + 1e-12)
      if (delta <= 730) {
        expect(d).toBeGreaterThanOrEqual(0.25 - 1e-12)
        expect(d).toBeLessThanOrEqual(1)
      } else {
        expect(d).toBe(0)
      }
    }
  })

  it('the methodology file carries the parameters of §3', () => {
    expect(m.decay).toMatchObject({ plateauDays: 365, endDays: 730, endWeight: 0.25 })
    expect([...m.decay.appliesTo]).toEqual(['repeatable'])
  })
})

// ---------------------------------------------------------------------------------------------
// §3 — repeatable events

describe('§3 repeatable events: p × w × d(t − date)', () => {
  const leap = ev('C5', '2024-02-29', 5)

  const leapCases: [string, number][] = [
    ['2024-02-28', 0], // Δ = −1
    ['2024-02-29', 5], // Δ = 0
    ['2025-02-28', 5], // Δ = 365
    ['2025-03-01', 5 * ramp(366)], // Δ = 366
    ['2026-02-27', 5 * ramp(729)], // Δ = 729
    ['2026-02-28', 1.25], // Δ = 730
    ['2026-03-01', 0], // Δ = 731
  ]
  for (const [date, expected] of leapCases) {
    it(`C5 +5 dated 2024-02-29, scored on ${date}: ${expected}`, () =>
      close(c(leap, date), expected))
  }

  const vote = ev('B1', '2023-10-07', 3)
  const voteCases: [string, number][] = [
    ['2023-10-06', 0], // Δ = −1
    ['2023-10-07', 3], // Δ = 0
    ['2024-10-06', 3], // Δ = 365: the anniversary is Δ = 366 because the span holds 2024-02-29
    ['2024-10-07', 3 * ramp(366)], // Δ = 366
    ['2025-04-06', 3 * ramp(547)], // Δ = 547
    ['2025-10-05', 3 * ramp(729)], // Δ = 729
    ['2025-10-06', 0.75], // Δ = 730
    ['2025-10-07', 0], // Δ = 731
  ]
  for (const [date, expected] of voteCases) {
    it(`B1 +3 dated 2023-10-07, scored on ${date}: ${expected}`, () =>
      close(c(vote, date), expected))
  }

  it('the anniversary date of a vote cast before 29 February is already on the ramp', () => {
    expect(c(vote, '2024-10-07')).toBeLessThan(3)
    close(c(vote, '2024-10-07'), 2.993835616438356)
  })

  it('weight and decay multiply: B10 −5 corroborated at Δ = 547 → −5 × 0.7 × (1 − 136.5/365)', () => {
    const e = ev('B10', '2023-10-07', -5, { confidence: 'corroborated' })
    close(c(e, '2025-04-06'), -2.191095890410959)
  })

  it('a repeatable event ignores an end date: it decays from its date instead', () => {
    const e = ev('C5', '2024-02-29', 5, { end: '2024-03-10' })
    expect(endDay(e)).toBe(Number.POSITIVE_INFINITY)
    close(c(e, '2024-06-01'), 5)
  })

  it('decay off (§10.5): d = 1 from the event date on, still 0 before it', () => {
    const off: ScoreOptions = { decay: 'off' }
    expect(c(leap, '2024-02-28', off)).toBeCloseTo(0, 12)
    close(c(leap, '2026-03-01', off), 5)
    close(c(leap, '2030-01-01', off), 5)
  })

  it('the event evaluation reports factor, value and reason at each boundary', () => {
    const at = (date: string) => scoreCountry('TST', [leap], date, m).events[0]
    expect(at('2024-02-28')).toMatchObject({ factor: 0, reason: 'not-yet' })
    expect(at('2024-02-29')).toMatchObject({ factor: 1, value: 5, reason: 'counted' })
    expect(at('2025-02-28')).toMatchObject({ factor: 1, value: 5, reason: 'counted' })
    close(at('2026-02-28')?.factor ?? Number.NaN, 0.25)
    expect(at('2026-03-01')).toMatchObject({ factor: 0, reason: 'expired' })
  })

  it('the category subtotal carries the decayed value (C on 2026-02-28: 1.25)', () => {
    const s = scoreCountry('TST', [leap], '2026-02-28', m)
    close(s.categories.C.raw, 1.25)
    close(s.categories.C.clipped, 1.25)
  })
})

// ---------------------------------------------------------------------------------------------
// §3 — standing events

describe('§3 standing events: p × w on start ≤ t < end', () => {
  const sanction = ev('B11', '2024-02-29', 10, { end: '2024-03-01' })

  it('holds on its start day only when end is the next day (leap day)', () => {
    expect(c(sanction, '2024-02-28')).toBeCloseTo(0, 12)
    close(c(sanction, '2024-02-29'), 10)
    expect(c(sanction, '2024-03-01')).toBeCloseTo(0, 12)
  })

  it('end is exclusive: full on the day before end, 0 on end', () => {
    const suspension = ev('D2', '2024-01-26', -10, { end: '2024-04-02' })
    expect(c(suspension, '2024-01-25')).toBeCloseTo(0, 12)
    close(c(suspension, '2024-01-26'), -10)
    close(c(suspension, '2024-02-29'), -10)
    close(c(suspension, '2024-04-01'), -10)
    expect(c(suspension, '2024-04-02')).toBeCloseTo(0, 12)
    expect(c(suspension, '2025-01-01')).toBeCloseTo(0, 12)
  })

  it('end equal to start: the state never holds', () => {
    const e = ev('B11', '2025-01-10', 10, { end: '2025-01-10' })
    for (const d of ['2025-01-09', '2025-01-10', '2025-01-11']) expect(c(e, d)).toBeCloseTo(0, 12)
  })

  it('end null: holds with no decay, far past 730 days', () => {
    const recognition = ev('B8', '2024-05-28', 8)
    close(c(recognition, '2024-05-28'), 8)
    close(c(recognition, '2026-05-28'), 8) // Δ = 730
    close(c(recognition, '2026-05-29'), 8) // Δ = 731, a repeatable event would be 0 here
    close(c(recognition, '2033-01-01'), 8)
  })

  it('B3 is standing (docs/02 §3 decision): an intervention holds past 730 days', () => {
    const intervention = ev('B3', '2024-01-11', 15)
    close(c(intervention, '2026-09-27'), 15)
  })

  it('confidence weight applies to standing events: B11 +10 reported → 4', () => {
    const e = ev('B11', '2024-06-01', 10, { confidence: 'reported' })
    close(c(e, '2025-06-01'), 4)
  })

  it('the evaluation reason is not-yet before start and ended on end', () => {
    const e = ev('D2', '2024-01-26', -10, { end: '2024-04-02' })
    const at = (date: string) => scoreCountry('TST', [e], date, m).events[0]
    expect(at('2024-01-25')).toMatchObject({ factor: 0, reason: 'not-yet' })
    expect(at('2024-04-01')).toMatchObject({ factor: 1, value: -10, reason: 'counted' })
    expect(at('2024-04-02')).toMatchObject({ factor: 0, reason: 'ended' })
  })

  it('timeFactor: [start, end) for standing and computed, decay for repeatable', () => {
    const s = dayNumber('2024-02-29')
    const e = dayNumber('2024-03-02')
    expect(timeFactor('standing', s, e, s - 1, m).factor).toBe(0)
    expect(timeFactor('standing', s, e, s, m)).toEqual({ factor: 1, reason: null })
    expect(timeFactor('standing', s, e, e - 1, m).factor).toBe(1)
    expect(timeFactor('standing', s, e, e, m).factor).toBe(0)
    expect(timeFactor('computed', s, e, e, m).factor).toBe(0)
    expect(timeFactor('computed', s, Number.POSITIVE_INFINITY, s + 5000, m).factor).toBe(1)
    const inf = Number.POSITIVE_INFINITY
    expect(timeFactor('repeatable', s, inf, s + 365, m).factor).toBe(1)
    close(timeFactor('repeatable', s, inf, s + 366, m).factor, ramp(366))
    close(timeFactor('repeatable', s, inf, s + 730, m).factor, 0.25)
    expect(timeFactor('repeatable', s, inf, s + 731, m).factor).toBe(0)
    expect(timeFactor('repeatable', s, inf, s - 1, m).factor).toBe(0)
  })
})

// ---------------------------------------------------------------------------------------------
// §3 — computed events

describe('§3 computed events: standing from release date to next release date', () => {
  it('A1 holds its formula output from release to next release, end exclusive, no decay', () => {
    const r2024 = ev('A1', '2024-03-11', -22, { end: '2025-03-10' })
    expect(c(r2024, '2024-03-10')).toBeCloseTo(0, 12)
    close(c(r2024, '2024-03-11'), -22)
    close(c(r2024, '2025-03-09'), -22) // Δ = 363
    expect(c(r2024, '2025-03-10')).toBeCloseTo(0, 12)
  })

  it('an open computed value (end null) does not decay past 730 days', () => {
    const e = ev('A1', '2024-03-11', -22)
    close(c(e, '2026-09-27'), -22)
  })

  it('consecutive D1 releases do not overlap: the new value replaces the old on its date', () => {
    const may = ev('D1', '2024-05-01', 6, { end: '2024-06-01' })
    const june = ev('D1', '2024-06-01', 9, { end: '2024-07-01' })
    const d = (date: string) => scoreCountry('TST', [may, june], date, m).categories.D.raw
    close(d('2024-04-30'), 0)
    close(d('2024-05-31'), 6)
    close(d('2024-06-01'), 9)
    close(d('2024-06-30'), 9)
    close(d('2024-07-01'), 0)
  })
})

// ---------------------------------------------------------------------------------------------
// §3 — status and scope eligibility

describe('§3 only published, gaza-scoped events score', () => {
  for (const status of ['draft', 'reviewed', 'superseded', 'corrected', 'retracted']) {
    it(`status ${status} contributes 0 on every date`, () => {
      const e = ev('B11', '2024-06-01', 10, { status })
      expect(ineligibility(e)).toBe('not-published')
      for (const d of ['2024-06-01', '2025-06-01', '2027-01-01']) expect(c(e, d)).toBeCloseTo(0, 12)
      const s = scoreCountry('TST', [e], '2025-01-01', m)
      close(s.categories.B.raw, 0)
    })
  }

  it('a retracted repeatable event contributes 0 on its own date', () => {
    const e = ev('B9', '2025-01-10', 5, { status: 'retracted' })
    expect(c(e, '2025-01-10')).toBeCloseTo(0, 12)
  })

  for (const scope of [['lebanon'], ['west-bank'], ['region'], ['related'], []]) {
    it(`scope [${scope.join(', ')}] without gaza contributes 0`, () => {
      const e = ev('B9', '2025-01-10', 5, { scope })
      expect(ineligibility(e)).toBe('out-of-scope')
      expect(c(e, '2025-01-10')).toBeCloseTo(0, 12)
    })
  }

  it('gaza anywhere in the scope list is enough', () => {
    const e = ev('B9', '2025-01-10', 5, { scope: ['region', 'gaza'] })
    expect(ineligibility(e)).toBeNull()
    close(c(e, '2025-01-10'), 5)
  })

  it('published and gaza: eligible', () => {
    expect(ineligibility(ev('B9', '2025-01-10', 5))).toBeNull()
  })
})

// ---------------------------------------------------------------------------------------------
// §4 — confidence weights

describe('§4 confidence weights', () => {
  it('confirmed 1.0, corroborated 0.7, reported 0.4, disputed 0.4', () => {
    expect(m.confidenceWeights).toEqual({
      confirmed: 1,
      corroborated: 0.7,
      reported: 0.4,
      disputed: 0.4,
    })
    const weights: [Confidence, number][] = [
      ['confirmed', 1],
      ['corroborated', 0.7],
      ['reported', 0.4],
      ['disputed', 0.4],
    ]
    for (const [level, w] of weights) close(confidenceWeight(level, m), w)
  })

  const products: [Confidence, number, number][] = [
    ['confirmed', 5, 5],
    ['corroborated', 5, 3.5],
    ['reported', 5, 2],
    ['disputed', 5, 2],
    ['corroborated', 2, 1.4],
    ['reported', 2, 0.8],
  ]
  for (const [level, p, expected] of products) {
    it(`B9 +${p} ${level} → ${expected}`, () =>
      close(c(ev('B9', '2025-01-10', p, { confidence: level }), '2025-01-10'), expected))
  }

  it('a sensitivity override replaces only the level it names (§10.3)', () => {
    const low: ScoreOptions = { confidenceWeights: { reported: 0.2 } }
    close(confidenceWeight('reported', m, low), 0.2)
    close(confidenceWeight('disputed', m, low), 0.4)
    close(confidenceWeight('confirmed', m, low), 1)
    close(c(ev('B9', '2025-01-10', 5, { confidence: 'reported' }), '2025-01-10', low), 1)
  })
})

// ---------------------------------------------------------------------------------------------
// §6 — passivity

describe('§6 passivity: window (t − 365, t]', () => {
  const T = '2025-06-01'

  it('no event at all: passivity 15, S = −15', () => {
    const s = scoreCountry('TST', [], T, m)
    expect(s.passivity).toMatchObject({ applied: true, points: 15, value: 15 })
    expect(s).toMatchObject({ exact: -15, display: -15, band: 'passive' })
  })

  it('an event dated exactly t − 365 does not qualify, though it still scores in full', () => {
    const e = ev('C5', '2024-06-01', 5)
    const s = scoreCountry('TST', [e], T, m)
    expect(s.passivity.applied).toBe(true)
    expect(s.events[0]?.qualifies).toBe(false)
    close(s.categories.C.raw, 5) // Δ = 365, d = 1
    close(s.exact, -10)
  })

  it('an event dated t − 364 qualifies', () => {
    const e = ev('C5', '2024-06-02', 5)
    const s = scoreCountry('TST', [e], T, m)
    expect(s.passivity.applied).toBe(false)
    expect(s.passivity.value).toBe(0)
    expect(s.passivity.qualifying).toEqual([e.id])
    expect(s.events[0]?.qualifies).toBe(true)
    close(s.exact, 5)
  })

  it('an event dated t qualifies', () => {
    expect(passivityAt([ev('C5', T, 5)], T).applied).toBe(false)
  })

  it('an event dated t + 1 does not qualify', () => {
    const s = scoreCountry('TST', [ev('C5', '2025-06-02', 5)], T, m)
    expect(s.passivity.applied).toBe(true)
    close(s.exact, -15)
  })

  it('leap year: t = 2024-12-31, t − 365 = 2024-01-01 is out, 2024-01-02 is in', () => {
    expect(passivityAt([ev('B9', '2023-12-31', 5)], '2024-12-31').applied).toBe(true)
    expect(passivityAt([ev('B9', '2024-01-01', 5)], '2024-12-31').applied).toBe(true)
    expect(passivityAt([ev('B9', '2024-01-02', 5)], '2024-12-31').applied).toBe(false)
  })

  it('leap day: t = 2025-02-28, an event of 2024-02-29 is at t − 365 and is out', () => {
    expect(passivityAt([ev('B9', '2024-02-29', 5)], '2025-02-28').applied).toBe(true)
    expect(passivityAt([ev('B9', '2024-03-01', 5)], '2025-02-28').applied).toBe(false)
  })

  it('t = 2025-03-01: 2024-03-01 is t − 365 (out), 2024-03-02 is t − 364 (in)', () => {
    expect(passivityAt([ev('B9', '2024-03-01', 5)], '2025-03-01').applied).toBe(true)
    expect(passivityAt([ev('B9', '2024-03-02', 5)], '2025-03-01').applied).toBe(false)
  })

  it('over time: an event of 2024-02-29 lifts passivity through 2025-02-27, not on 2025-02-28', () => {
    const e = ev('B4', '2024-02-29', -15)
    const scorer = createScorer('TST', [e], m)
    expect(scorer.at('2024-02-28').passivity.applied).toBe(true)
    expect(scorer.at('2024-02-29').passivity.applied).toBe(false)
    expect(scorer.at('2025-02-27').passivity.applied).toBe(false)
    expect(scorer.at('2025-02-28').passivity.applied).toBe(true)
    close(scorer.at('2025-02-27').exact, -15)
    close(scorer.at('2025-02-28').exact, -30)
  })

  it('transition days of a repeatable qualifying event: start, t + 365 leaves the window, Δ = 731 expires', () => {
    const e = ev('C5', '2024-02-29', 5)
    const scorer = createScorer('TST', [e], m)
    const days = scorer.transitionDays()
    const start = 19782
    expect(days).toContain(start)
    expect(days).toContain(start + 365) // 2025-02-28
    expect(days).toContain(start + 731) // 2026-03-01
    expect(scorer.transitionsOn(start).map((t) => t.kind)).toContain('start')
    expect(scorer.transitionsOn(start + 365).map((t) => t.kind)).toContain(
      'leaves-passivity-window',
    )
    expect(scorer.transitionsOn(start + 731).map((t) => t.kind)).toContain('expire')
  })

  it('another country’s event in the window does not lift passivity', () => {
    const other = ev('B9', '2025-05-01', 5, { country: 'FRA' })
    const s = scoreCountry('TST', [other], T, m)
    expect(s.passivity.applied).toBe(true)
    expect(s.events).toHaveLength(0)
    expect(scoreCountry('FRA', [other], T, m).passivity.applied).toBe(false)
  })

  it('the scorer is stateless: dates queried out of order give the same answers', () => {
    const e = ev('C5', '2024-02-29', 5)
    const scorer = createScorer('TST', [e], m)
    const dates = ['2026-03-01', '2024-02-29', '2025-02-28', '2025-03-01', '2024-02-28']
    const first = dates.map((d) => scorer.at(d).exact)
    const fresh = dates.map((d) => scoreCountry('TST', [e], d, m).exact)
    const again = [...dates].reverse().map((d) => scorer.at(d).exact)
    expect(first).toEqual(fresh)
    expect(again).toEqual([...first].reverse())
    expect(scorer.atDay(19782)).toEqual(scorer.at('2024-02-29'))
    // −15 before, 5 on the plateau, 5 − 15 when it leaves the window, then decayed − 15, then −15.
    close(first[0] ?? Number.NaN, -15)
    close(first[1] ?? Number.NaN, 5)
    close(first[2] ?? Number.NaN, -10)
    close(first[3] ?? Number.NaN, 5 * ramp(366) - 15)
    close(first[4] ?? Number.NaN, -15)
  })

  it('qualifying ids are listed by date then id', () => {
    const late = ev('C5', '2025-05-20', 5, { id: 'evt_2025_05_20_TST_C5' })
    const early = ev('B9', '2025-01-10', 5, { id: 'evt_2025_01_10_TST_B9' })
    const sameDayB = ev('D4', '2025-01-10', 5, { id: 'evt_2025_01_10_TST_D4' })
    const s = scoreCountry('TST', [late, sameDayB, early], T, m)
    expect(s.passivity.qualifying).toEqual([
      'evt_2025_01_10_TST_B9',
      'evt_2025_01_10_TST_D4',
      'evt_2025_05_20_TST_C5',
    ])
  })
})

describe('§6 passivity: |contribution| ≥ 2', () => {
  const T = '2025-06-01'
  const D = '2025-05-01'

  const cases: [string, ScoringEvent, boolean][] = [
    ['B9 +5 reported = 2.0 qualifies', ev('B9', D, 5, { confidence: 'reported' }), false],
    ['B9 +5 disputed = 2.0 qualifies', ev('B9', D, 5, { confidence: 'disputed' }), false],
    ['B9 +2 confirmed = 2.0 qualifies', ev('B9', D, 2), false],
    ['C6 +3 corroborated = 2.1 qualifies', ev('C6', D, 3, { confidence: 'corroborated' }), false],
    ['B9 +2 corroborated = 1.4 does not', ev('B9', D, 2, { confidence: 'corroborated' }), true],
    ['C6 +3 reported = 1.2 does not', ev('C6', D, 3, { confidence: 'reported' }), true],
    ['B9 +2 reported = 0.8 does not', ev('B9', D, 2, { confidence: 'reported' }), true],
    ['B10 −5 reported = −2.0 qualifies', ev('B10', D, -5, { confidence: 'reported' }), false],
    ['B10 −5 disputed = −2.0 qualifies', ev('B10', D, -5, { confidence: 'disputed' }), false],
    ['C4 +2 confirmed (labelling) = 2.0 qualifies', ev('C4', D, 2), false],
    ['C4 +2 corroborated = 1.4 does not', ev('C4', D, 2, { confidence: 'corroborated' }), true],
    ['D1 +1 (token funding) does not', ev('D1', D, 1, { end: '2025-07-01' }), true],
    ['D1 +3 (the +3 tier) qualifies', ev('D1', D, 3, { end: '2025-07-01' }), false],
    ['C3 −2 (lowest tier) qualifies', ev('C3', D, -2), false],
  ]
  for (const [label, e, applied] of cases) {
    it(`${label} → passivity ${applied ? 'applied' : 'lifted'}`, () => {
      expect(passivityAt([e], T).applied).toBe(applied)
    })
  }

  it('B9 +2 corroborated scores 1.4 and passivity still applies: S = 1.4 − 15 = −13.6', () => {
    const s = scoreCountry('TST', [ev('B9', D, 2, { confidence: 'corroborated' })], T, m)
    close(s.exact, -13.6)
    expect(s.score).toBe(-13.6)
    expect(s.display).toBe(-14)
    expect(s.band).toBe('passive')
  })

  it('B10 −5 reported qualifies: S = −2, no passivity', () => {
    const s = scoreCountry('TST', [ev('B10', D, -5, { confidence: 'reported' })], T, m)
    close(s.exact, -2)
    expect(s.display).toBe(-2)
  })

  it('the threshold is per event: two events of 1.4 and 1.2 (sum 2.6) do not qualify', () => {
    const a = ev('B9', D, 2, { confidence: 'corroborated' })
    const b = ev('C6', '2025-05-02', 3, { confidence: 'reported' })
    const s = scoreCountry('TST', [a, b], T, m)
    expect(s.passivity.applied).toBe(true)
    close(s.exact, 1.4 + 1.2 - 15)
  })

  it('two 1.4 statements on the same indicator (B9 2.8) do not qualify either', () => {
    const a = ev('B9', D, 2, { confidence: 'corroborated' })
    const b = ev('B9', '2025-05-02', 2, { confidence: 'corroborated' })
    expect(passivityAt([a, b], T).applied).toBe(true)
  })

  it('the contribution is the current one: a D1 release with an ended value does not qualify', () => {
    const ended = ev('D1', '2025-04-01', 6, { end: '2025-05-01' })
    const current = ev('D1', '2025-05-01', 1, { end: '2025-06-01' })
    const latest = ev('D1', '2025-06-01', 1)
    const s = scoreCountry('TST', [ended, current, latest], T, m)
    expect(s.passivity.applied).toBe(true)
    close(s.categories.D.raw, 1)
  })

  it('a standing state that ended inside the window no longer qualifies', () => {
    const e = ev('D2', '2025-03-01', -10, { end: '2025-05-01' })
    expect(passivityAt([e], T).applied).toBe(true)
  })

  it('a standing state ending on t (end exclusive) does not qualify on t; ending on t + 1 does', () => {
    expect(passivityAt([ev('D2', '2025-03-01', -10, { end: T })], T).applied).toBe(true)
    expect(passivityAt([ev('D2', '2025-03-01', -10, { end: '2025-06-02' })], T).applied).toBe(false)
  })

  it('a standing state started at t − 365 and still holding does not qualify (event date rule)', () => {
    const s = scoreCountry('TST', [ev('B11', '2024-06-01', 10)], T, m)
    expect(s.passivity.applied).toBe(true)
    close(s.exact, 10 - 15)
  })

  it('a standing state started at t − 364 qualifies', () => {
    expect(passivityAt([ev('B11', '2024-06-02', 10)], T).applied).toBe(false)
  })

  it('a standing state started on t qualifies on t, not the day before', () => {
    const e = ev('D2', T, -10)
    expect(passivityAt([e], T).applied).toBe(false)
    expect(passivityAt([e], '2025-05-31').applied).toBe(true)
  })

  it('a qualifying event superseded by stacking still qualifies on its own contribution (reading 3)', () => {
    // C1 suspension +10 since 2024-01-15 (outside the window) supersedes a review +4 in the window.
    const suspension = ev('C1', '2024-01-15', 10)
    const review = ev('C1', D, 4)
    const s = scoreCountry('TST', [suspension, review], T, m)
    close(s.categories.C.raw, 10)
    expect(s.passivity.applied).toBe(false)
    expect(s.passivity.qualifying).toEqual([review.id])
  })
})

describe('§6 passivity: qualifying indicators', () => {
  const T = '2025-06-01'
  const D = '2025-05-01'

  const qualifying: [string, number][] = [
    ['B2', -20],
    ['B3', 15],
    ['B4', -15],
    ['B5', 8],
    ['B6', -10],
    ['B7', -20],
    ['B8', 8],
    ['B9', 5],
    ['B10', -5],
    ['B11', 10],
    ['B12', 5],
    ['C1', 4],
    ['C2', -10],
    ['C3', -5],
    ['C4', 5],
    ['C5', 5],
    ['C6', 3],
    ['D1', 3],
    ['D2', -10],
    ['D3', 5],
    ['D4', 5],
    ['D5', 5],
  ]
  for (const [id, p] of qualifying) {
    it(`${id} ${p > 0 ? '+' : ''}${p} in the window lifts passivity`, () => {
      const s = scoreCountry('TST', [ev(id, D, p)], T, m)
      expect(s.passivity.applied).toBe(false)
      expect(s.events[0]?.qualifies).toBe(true)
    })
  }

  const excluded: [string, number][] = [
    ['A1', -22],
    ['A2', -8],
    ['A3', -15],
    ['A4', -5],
    ['A5', -5],
    ['A6', 10],
    ['A7', 25],
    ['A8', 5],
    ['B1', 3],
    ['E1', 5],
    ['E2', -5],
    ['E3', 5],
  ]
  for (const [id, p] of excluded) {
    it(`${id} ${p > 0 ? '+' : ''}${p} in the window does not lift passivity`, () => {
      const s = scoreCountry('TST', [ev(id, D, p)], T, m)
      expect(s.passivity.applied).toBe(true)
      expect(s.events[0]?.qualifies).toBe(false)
    })
  }

  it('B1 yes votes only: Passive (spec §2), S = 3 + 3 − 15 = −9', () => {
    const s = scoreCountry('TST', [ev('B1', '2025-05-01', 3), ev('B1', '2025-05-20', 3)], T, m)
    expect(s.passivity.applied).toBe(true)
    close(s.exact, -9)
    expect(s.band).toBe('passive')
  })

  it('A7 embargo only: passivity still applies, S = 25 − 15 = 10', () => {
    const s = scoreCountry('TST', [ev('A7', D, 25)], T, m)
    close(s.exact, 10)
  })

  it('category E is shown, not summed, and does not lift passivity: S = −15', () => {
    const s = scoreCountry('TST', [ev('E1', D, 5)], T, m)
    close(s.categories.E.raw, 5)
    close(s.exact, -15)
  })

  it('category E events decay like any repeatable event (E1 +5 at Δ = 366)', () => {
    const s = scoreCountry('TST', [ev('E1', '2024-02-29', 5)], '2025-03-01', m)
    close(s.categories.E.raw, 5 * ramp(366))
  })

  it('user weights (§9) do not change qualification: B at 0 still lifts passivity, S = 0', () => {
    const s = scoreCountry('TST', [ev('B9', D, 5)], T, m, { weights: { B: 0 } })
    expect(s.passivity.applied).toBe(false)
    close(s.exact, 0)
    const s2 = scoreCountry('TST', [ev('D2', D, -10)], T, m, { weights: { D: 2 } })
    expect(s2.passivity.applied).toBe(false)
    close(s2.exact, -20)
  })

  it('a reported negative D2 (−10 × 0.4 = −4) qualifies', () => {
    expect(passivityAt([ev('D2', D, -10, { confidence: 'reported' })], T).applied).toBe(false)
  })

  it('a non-published or non-gaza event in a qualifying indicator does not qualify', () => {
    expect(passivityAt([ev('B9', D, 5, { status: 'reviewed' })], T).applied).toBe(true)
    expect(passivityAt([ev('B9', D, 5, { status: 'corrected' })], T).applied).toBe(true)
    expect(passivityAt([ev('B9', D, 5, { scope: ['lebanon'] })], T).applied).toBe(true)
    expect(passivityAt([ev('B9', D, 5, { scope: ['lebanon', 'gaza'] })], T).applied).toBe(false)
  })

  it('the methodology lists exactly B2–B12, C1–C6, D1–D5, window 365, minimum 2', () => {
    const expected = [
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
    expect([...m.passivity.qualifying].sort()).toEqual([...expected].sort())
    expect(m.passivity).toMatchObject({ points: 15, windowDays: 365, minAbsContribution: 2 })
    expect([...m.passivity.statuses]).toEqual(['published'])
  })
})

describe('§6 with §10 variants: the variant weights decide qualification', () => {
  const T = '2025-06-01'
  const D = '2025-05-01'

  it('reported at 0.2: B9 +5 reported = 1.0 no longer qualifies', () => {
    const e = ev('B9', D, 5, { confidence: 'reported' })
    expect(passivityAt([e], T).applied).toBe(false)
    expect(passivityAt([e], T, { confidenceWeights: { reported: 0.2 } }).applied).toBe(true)
  })

  it('reported at 0.6: C6 +3 reported = 1.8 still does not qualify, B9 +5 reported = 3.0 does', () => {
    const opt: ScoreOptions = { confidenceWeights: { reported: 0.6 } }
    expect(passivityAt([ev('C6', D, 3, { confidence: 'reported' })], T, opt).applied).toBe(true)
    expect(passivityAt([ev('B9', D, 5, { confidence: 'reported' })], T, opt).applied).toBe(false)
  })

  it('reported at 0.2 does not change disputed: B9 +5 disputed stays 2.0 and qualifies', () => {
    const opt: ScoreOptions = { confidenceWeights: { reported: 0.2 } }
    expect(passivityAt([ev('B9', D, 5, { confidence: 'disputed' })], T, opt).applied).toBe(false)
  })

  it('statements excluded (B9, B10 at 0): a lone statement no longer lifts passivity', () => {
    const e = ev('B9', D, 5)
    const s = scoreCountry('TST', [e], T, m, { excludeIndicators: ['B9', 'B10'] })
    expect(s.passivity.applied).toBe(true)
    close(s.exact, -15)
  })

  it('passivity at 5 and 25 (§10.1)', () => {
    close(scoreCountry('TST', [], T, m, { passivityPoints: 5 }).exact, -5)
    const s25 = scoreCountry('TST', [], T, m, { passivityPoints: 25 })
    close(s25.exact, -25)
    expect(s25.band).toBe('enabling')
  })
})
