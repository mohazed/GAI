/**
 * The passivity rule of docs/02 §6: passivity = 15 at t when no published event of B2–B12, C1–C6
 * or D1–D5 is dated in (t − 365, t] with a current weighted contribution of absolute value ≥ 2.
 */
import { describe, expect, it } from 'vitest'
import { scoreCountry } from './score.js'
import { ev, methodology } from './test-helpers.js'
import { addDays } from './time.js'
import type { ScoringEvent } from './types.js'

const m = methodology()
const T = '2025-06-01'
const passive = (events: ScoringEvent[], date = T) =>
  scoreCountry('TST', events, date, m).passivity.applied

describe('passivity (docs/02 §6)', () => {
  it('applies to a country with no event: S = −15, Passive', () => {
    const s = scoreCountry('TST', [], T, m)
    expect(s.passivity).toEqual({ applied: true, points: 15, value: 15, qualifying: [] })
    expect(s).toMatchObject({ exact: -15, score: -15, display: -15, band: 'passive' })
  })

  it('the qualifying list is B2–B12, C1–C6, D1–D5 exactly', () => {
    const expected = [
      ...Array.from({ length: 11 }, (_, i) => `B${i + 2}`),
      ...Array.from({ length: 6 }, (_, i) => `C${i + 1}`),
      ...Array.from({ length: 5 }, (_, i) => `D${i + 1}`),
    ]
    expect([...m.passivity.qualifying].sort()).toEqual(expected.sort())
    expect(m.passivity).toMatchObject({ points: 15, windowDays: 365, minAbsContribution: 2 })
  })

  describe('trailing 365 days: event date in (t − 365, t]', () => {
    it('an event dated t − 364 qualifies', () => {
      expect(passive([ev('B9', addDays(T, -364), 5)])).toBe(false)
    })

    it('an event dated t − 365 does not, although it still contributes in full', () => {
      const b9 = ev('B9', addDays(T, -365), 5)
      const s = scoreCountry('TST', [b9], T, m)
      expect(s.passivity.applied).toBe(true)
      expect(s.events[0]?.value).toBe(5)
      expect(s.exact).toBe(5 - 15)
    })

    it('an event dated t qualifies; an event dated t + 1 does not', () => {
      expect(passive([ev('B9', T, 5)])).toBe(false)
      expect(passive([ev('B9', addDays(T, 1), 5)])).toBe(true)
    })

    it('a standing state qualifies for 365 days from its start date, even while it still holds', () => {
      const b8 = ev('B8', '2023-10-07', 3)
      expect(passive([b8], '2023-10-07')).toBe(false)
      expect(passive([b8], '2024-10-05')).toBe(false)
      expect(passive([b8], '2024-10-06')).toBe(true)
      expect(scoreCountry('TST', [b8], '2024-10-06', m).exact).toBe(3 - 15)
    })

    it('switches back on the day the last qualifying event leaves the window', () => {
      const events = [ev('C5', '2024-03-01', 5), ev('D4', '2024-09-01', 5)]
      expect(passive(events, '2025-08-31')).toBe(false)
      expect(passive(events, '2025-09-01')).toBe(true)
    })
  })

  describe('|current weighted contribution| ≥ 2', () => {
    it('exactly 2 qualifies (B9 +2 confirmed; B9 +5 reported, 5 × 0.4)', () => {
      expect(passive([ev('B9', '2025-05-01', 2)])).toBe(false)
      expect(passive([ev('B9', '2025-05-01', 5, { confidence: 'reported' })])).toBe(false)
      expect(passive([ev('B9', '2025-05-01', 5, { confidence: 'disputed' })])).toBe(false)
    })

    it('below 2 does not (B9 +2 corroborated = 1.4; C6 +3 reported = 1.2)', () => {
      expect(passive([ev('B9', '2025-05-01', 2, { confidence: 'corroborated' })])).toBe(true)
      expect(passive([ev('C6', '2025-05-01', 3, { confidence: 'reported' })])).toBe(true)
    })

    it('token D1 funding below the +3 tier does not qualify; the +3 tier does', () => {
      expect(passive([ev('D1', '2025-05-01', 1, { end: '2025-07-01' })])).toBe(true)
      expect(passive([ev('D1', '2025-05-01', 3, { end: '2025-07-01' })])).toBe(false)
    })

    it('uses the current contribution: a standing state that has ended does not qualify', () => {
      expect(passive([ev('D2', '2025-01-27', -10, { end: '2025-05-01' })])).toBe(true)
      expect(passive([ev('D2', '2025-01-27', -10, { end: '2025-06-02' })])).toBe(false)
    })

    it('a negative event qualifies (engagement, already scored negative)', () => {
      expect(passive([ev('D2', '2025-01-27', -10)])).toBe(false)
      expect(passive([ev('B2', '2025-03-01', -20)])).toBe(false)
    })

    it("uses the event's own contribution, before stacking: a superseded B12 recall still qualifies", () => {
      const recall = ev('B12', '2025-01-01', 5)
      const severed = ev('B12', '2023-12-01', 10)
      const s = scoreCountry('TST', [severed, recall], T, m)
      expect(s.events.find((e) => e.id === recall.id)).toMatchObject({
        reason: 'less-severe',
        qualifies: true,
      })
      expect(s.passivity.applied).toBe(false)
    })
  })

  describe('excluded indicators and events', () => {
    it('B1 votes do not qualify', () => {
      expect(passive([ev('B1', '2025-05-01', 3), ev('B1', '2025-05-02', 3)])).toBe(true)
    })

    it('category A never qualifies', () => {
      expect(
        passive([
          ev('A6', '2025-05-01', 10),
          ev('A7', '2025-05-01', 25),
          ev('A5', '2025-05-01', -5),
        ]),
      ).toBe(true)
    })

    it('category E does not qualify', () => {
      expect(passive([ev('E1', '2025-05-01', 5)])).toBe(true)
    })

    it('unpublished and out-of-scope events do not qualify', () => {
      expect(passive([ev('B9', '2025-05-01', 5, { status: 'reviewed' })])).toBe(true)
      expect(passive([ev('B9', '2025-05-01', 5, { scope: ['lebanon'] })])).toBe(true)
    })
  })

  it('lists the qualifying events by date then id', () => {
    const a = ev('C5', '2025-03-01', 5, { id: 'evt_2025_03_01_TST_C5' })
    const b = ev('B9', '2025-02-01', 5, { id: 'evt_2025_02_01_TST_B9' })
    expect(scoreCountry('TST', [a, b], T, m).passivity.qualifying).toEqual([b.id, a.id])
  })

  it('takes other penalty sizes (sensitivity: 5, 15, 25)', () => {
    expect(m.passivity.sensitivityPoints).toEqual([5, 15, 25])
    expect(scoreCountry('TST', [], T, m, { passivityPoints: 25 }).exact).toBe(-25)
    expect(scoreCountry('TST', [], T, m, { passivityPoints: 5 }).exact).toBe(-5)
    expect(() => scoreCountry('TST', [], T, m, { passivityPoints: -1 })).toThrow(RangeError)
  })
})
