/**
 * The rule changes of methodology 1.0.0-rc.2 that the engine reads (docs/calibration/README.md §7,
 * CHANGELOG "1.0.0-rc.2"), each with a worked example, against the repository's methodology and,
 * for contrast, the rules of 1.0.0-rc.1 (test-helpers `methodologyRc1`):
 *   (2) A3, A6, A7, B3, B7 and D2 stack by "most severe" (B-22, B-51);
 *   (3) B1 has an indicator cap of −15…+15 (B-23);
 *   (4) a qualifying event against passivity contributes +2 or more (B-46);
 *   (5) the pre-existing B8 tier does not qualify (B-47).
 * Rule (1), the source kinds of `confirmed`, is checked by the validator; rules (6) and (7) by
 * the generators and fetch:fts (packages/pipeline); rule (8), the speakers of B9 and B10, by the
 * second reading.
 */
import { describe, expect, it } from 'vitest'
import { createScorer } from './score.js'
import { ev, methodology, methodologyRc1 } from './test-helpers.js'
import type { ScoringEvent } from './types.js'

const m = methodology()
const rc1 = methodologyRc1()
const at = (events: ScoringEvent[], date: string, mm = m) =>
  createScorer('TST', events, mm).at(date)

describe('1.0.0-rc.2 (4): only contributions of +2 or more qualify against passivity (B-46)', () => {
  it('a C2 agreement (−10) no longer ends the penalty: S = −10 − 15 = −25, Enabling (rc.1: −10)', () => {
    const c2 = ev('C2', '2025-03-01', -10)
    const s = at([c2], '2025-06-30')
    expect(s.passivity).toMatchObject({ applied: true, value: 15, qualifying: [] })
    expect(s.exact).toBe(-25)
    expect(s.band).toBe('enabling')
    const r = at([c2], '2025-06-30', rc1)
    expect(r.passivity).toMatchObject({ applied: false, qualifying: [c2.id] })
    expect(r.exact).toBe(-10)
  })

  it('adding a negative act never raises a score: none −15, + C3 −5 → −20 (rc.1: −5)', () => {
    const c3 = ev('C3', '2025-05-01', -5, { end: '2026-05-01' })
    expect(at([], '2025-06-30').exact).toBe(-15)
    expect(at([c3], '2025-06-30').exact).toBe(-20)
    expect(at([c3], '2025-06-30', rc1).exact).toBe(-5)
  })

  it('a B9 call (+2) qualifies; a reported B9 +5 (× 0.4 = +2.0) qualifies; a reported +2 (0.8) does not', () => {
    const call = ev('B9', '2025-05-01', 2)
    expect(at([call], '2025-06-30').passivity.applied).toBe(false)
    expect(at([call], '2025-06-30').exact).toBe(2)
    const reported5 = ev('B9', '2025-05-01', 5, { confidence: 'reported' })
    expect(at([reported5], '2025-06-30').passivity.qualifying).toEqual([reported5.id])
    const reported2 = ev('B9', '2025-05-01', 2, { confidence: 'reported' })
    expect(at([reported2], '2025-06-30').passivity.applied).toBe(true)
  })

  it('a negative and a positive act together: the positive one qualifies alone', () => {
    const b10 = ev('B10', '2025-04-01', -5)
    const d4 = ev('D4', '2025-05-01', 5)
    const s = at([b10, d4], '2025-06-30')
    expect(s.passivity.qualifying).toEqual([d4.id])
    expect(s.exact).toBe(0)
    expect(at([b10, d4], '2025-06-30', rc1).passivity.qualifying).toEqual([b10.id, d4.id])
  })
})

describe('1.0.0-rc.2 (5): the pre-existing B8 tier does not qualify (B-47)', () => {
  it('a recognition that predates the window: +3 from 2023-10-07, penalty kept, S = −12 (rc.1: +3)', () => {
    const pre = ev('B8', '1988-11-15', 3)
    const s = at([pre], '2024-01-01')
    expect(s.categories.B.clipped).toBe(3)
    expect(s.passivity.applied).toBe(true)
    expect(s.exact).toBe(-12)
    expect(at([pre], '2024-01-01', rc1).exact).toBe(3)
    // rc.1 dropped the 15 points on 2024-10-06, when the state left the 365-day window.
    expect(at([pre], '2024-10-05', rc1).exact).toBe(3)
    expect(at([pre], '2024-10-06', rc1).exact).toBe(-12)
    expect(at([pre], '2024-10-06').exact).toBe(-12)
  })

  it('a recognition after 7 October 2023 (+8) qualifies for 365 days from its start', () => {
    const b8 = ev('B8', '2024-05-28', 8)
    expect(at([b8], '2024-06-30')).toMatchObject({ exact: 8, passivity: { applied: false } })
    expect(at([b8], '2025-05-27').passivity.applied).toBe(false)
    expect(at([b8], '2025-05-28')).toMatchObject({ exact: -7, passivity: { applied: true } })
  })
})

describe('1.0.0-rc.2 (3): B1 is capped at −15…+15 (B-23)', () => {
  const votes = (points: number, n: number) =>
    Array.from({ length: n }, (_, i) =>
      ev('B1', `2025-0${i + 1}-15`, points, { id: `evt_2025_0${i + 1}_15_TST_B1_v${i}` }),
    )

  it('a state that votes yes five times and does nothing else: B1 +15, S = 0, Passive (rc.1: +15 − 15 = 0 too)', () => {
    const s = at(votes(3, 5), '2025-06-30')
    expect(s.indicators.find((i) => i.id === 'B1')).toMatchObject({
      raw: 15,
      value: 15,
      capped: false,
    })
    expect(s.exact).toBe(0)
    expect(s.band).toBe('passive')
  })

  it('eight yes votes: B1 raw +24, capped +15, S = 0, Passive (rc.1: +9, Acting)', () => {
    const s = at(votes(3, 8), '2025-09-30')
    expect(s.indicators.find((i) => i.id === 'B1')).toMatchObject({
      raw: 24,
      value: 15,
      capped: true,
    })
    expect(s.passivity.applied).toBe(true)
    expect(s.exact).toBe(0)
    expect(s.band).toBe('passive')
    const r = at(votes(3, 8), '2025-09-30', rc1)
    expect(r.exact).toBe(9)
    expect(r.band).toBe('acting')
  })

  it('symmetric: eight no votes, B1 raw −40, capped −15 (rc.1: −40, the category cap)', () => {
    const s = at(votes(-5, 8), '2025-09-30')
    expect(s.indicators.find((i) => i.id === 'B1')).toMatchObject({ raw: -40, value: -15 })
    expect(s.exact).toBe(-30)
    expect(at(votes(-5, 8), '2025-09-30', rc1).exact).toBe(-55)
  })
})

describe('1.0.0-rc.2 (2): A3, A6, A7, B3, B7 and D2 stack by "most severe" (B-22, B-51)', () => {
  it('two B7 designations holding together count once: B −20 (rc.1: −40)', () => {
    const a = ev('B7', '2025-02-13', -20)
    const b = ev('B7', '2025-06-05', -20)
    const s = at([a, b], '2025-09-30')
    expect(s.categories.B.raw).toBe(-20)
    expect(s.events.find((e) => e.id === b.id)?.reason).toBe('less-severe')
    expect(at([a, b], '2025-09-30', rc1).categories.B.raw).toBe(-40)
  })

  it('two overlapping UNRWA suspensions (D2 −10 each) count once; the earlier one is kept on a tie', () => {
    const a = ev('D2', '2024-01-27', -10, { end: '2024-05-01' })
    const b = ev('D2', '2024-02-10', -10, { end: '2024-03-15' })
    const s = at([a, b], '2024-03-01')
    expect(s.categories.D.raw).toBe(-10)
    expect(s.events.find((e) => e.id === a.id)?.reason).toBe('counted')
    expect(at([a, b], '2024-03-01', rc1).categories.D.raw).toBe(-20)
  })

  it('a confirmed and a reported A3 record: the points decide, then the larger weighted value', () => {
    const reported = ev('A3', '2023-10-07', -15, { confidence: 'reported' })
    const confirmed = ev('A3', '2024-01-01', -15)
    const s = at([reported, confirmed], '2024-06-30')
    expect(s.categories.A.raw).toBe(-15)
    expect(s.events.find((e) => e.id === confirmed.id)?.reason).toBe('counted')
  })
})

describe('docs/02 §7 worked example under 1.0.0-rc.2: unchanged, S = −13.6, display −14', () => {
  it('only D1 (+6) qualifies now (B10 −5 and C3 −5 no longer do), so no penalty applies', () => {
    const t = '2026-09-26'
    const events = [
      ev('A1', '2026-03-09', -22, { end: '2027-03-09' }),
      ev('A3', '2023-10-07', -15),
      ev('A6', '2025-08-08', 10),
      ev('B1', '2026-09-12', 3),
      ev('B1', '2025-12-02', 3),
      ev('B1', '2025-06-21', -2),
      ev('B10', '2026-05-01', -5),
      ev('B5', '2024-11-22', 8),
      ev('C3', '2026-07-01', -5, { end: '2027-07-01' }),
      ev('D1', '2026-09-01', 6, { end: '2026-10-01' }),
      ev('D2', '2024-01-27', -10, { end: '2024-04-01' }),
      ev('D3', '2024-04-01', 5),
    ]
    const s = at(events, t)
    const d1 = events.find((e) => e.indicator === 'D1')
    const b10 = events.find((e) => e.indicator === 'B10')
    const c3 = events.find((e) => e.indicator === 'C3')
    expect(s.passivity).toMatchObject({ applied: false, qualifying: [d1?.id] })
    expect(at(events, t, rc1).passivity.qualifying).toEqual([b10?.id, c3?.id, d1?.id])
    expect(s.exact).toBeCloseTo(-13.60137, 5)
    expect(s.score).toBe(-13.6)
    expect(s.display).toBe(-14)
    expect(s.band).toBe('passive')
  })
})
