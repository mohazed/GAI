import { describe, expect, it } from 'vitest'
import { contribution, decayFactor } from './contribution.js'
import { ev, methodology } from './test-helpers.js'
import { addDays } from './time.js'

const m = methodology()

describe('decay d(Δ) (docs/02 §3)', () => {
  it.each([
    [0, 1],
    [365, 1],
    [366, 1 - 0.75 / 365],
    [547, 1 - (0.75 * 182) / 365],
    [730, 0.25],
    [731, 0],
  ])('Δ = %i gives %f', (delta, expected) => {
    expect(decayFactor(delta, m.decay)).toBeCloseTo(expected, 12)
  })

  it('is exactly 1 on the plateau, 0.25 on day 730, 0 before the event and after day 730', () => {
    expect(decayFactor(0, m.decay)).toBe(1)
    expect(decayFactor(365, m.decay)).toBe(1)
    expect(decayFactor(730, m.decay)).toBe(0.25)
    expect(decayFactor(731, m.decay)).toBe(0)
    expect(decayFactor(-1, m.decay)).toBe(0)
    expect(decayFactor(5000, m.decay)).toBe(0)
  })

  it('falls linearly between day 365 and day 730', () => {
    for (let d = 366; d < 730; d++) {
      expect(decayFactor(d, m.decay)).toBeLessThan(decayFactor(d - 1, m.decay))
      expect(decayFactor(d, m.decay) - decayFactor(d + 1, m.decay)).toBeCloseTo(0.75 / 365, 12)
    }
  })

  it('takes whole days only', () => {
    expect(() => decayFactor(1.5, m.decay)).toThrow(RangeError)
  })

  it('applies to repeatable events through contribution()', () => {
    const vote = ev('B1', '2024-01-01', -5)
    expect(contribution(vote, '2024-01-01', m)).toBe(-5)
    expect(contribution(vote, addDays('2024-01-01', 365), m)).toBe(-5)
    expect(contribution(vote, addDays('2024-01-01', 547), m)).toBeCloseTo(
      -5 * (1 - (0.75 * 182) / 365),
      12,
    )
    expect(contribution(vote, addDays('2024-01-01', 730), m)).toBe(-1.25)
    expect(contribution(vote, addDays('2024-01-01', 731), m)).toBe(0)
    expect(contribution(vote, '2023-12-31', m)).toBe(0)
  })
})

describe('standing states (docs/02 §3: start ≤ t < end)', () => {
  const a6 = ev('A6', '2025-08-08', 10, { end: '2025-11-24' })

  it('counts from the start day inclusive', () => {
    expect(contribution(a6, '2025-08-07', m)).toBe(0)
    expect(contribution(a6, '2025-08-08', m)).toBe(10)
  })

  it('stops on the end day: end is exclusive', () => {
    expect(contribution(a6, '2025-11-23', m)).toBe(10)
    expect(contribution(a6, '2025-11-24', m)).toBe(0)
    expect(contribution(a6, '2026-01-01', m)).toBe(0)
  })

  it('holds for ever when end is null or absent, and never decays', () => {
    const open = ev('A3', '2023-10-07', -15)
    const { end: _, ...absent } = ev('A3', '2023-10-07', -15)
    expect(contribution(open, '2033-10-07', m)).toBe(-15)
    expect(contribution(absent, '2030-01-01', m)).toBe(-15)
  })

  it('never holds when end equals the start', () => {
    const empty = ev('A6', '2025-01-01', 10, { end: '2025-01-01' })
    expect(contribution(empty, '2025-01-01', m)).toBe(0)
  })
})

describe('computed events (docs/02 §3: as standing, from one release to the next)', () => {
  it('hold from the release date to the next release date, exclusive, without decay', () => {
    const d1 = ev('D1', '2026-08-01', 6, { end: '2026-09-01', confidence: 'confirmed' })
    expect(contribution(d1, '2026-07-31', m)).toBe(0)
    expect(contribution(d1, '2026-08-01', m)).toBe(6)
    expect(contribution(d1, '2026-08-31', m)).toBe(6)
    expect(contribution(d1, '2026-09-01', m)).toBe(0)
    const a1 = ev('A1', '2024-03-11', -21.9, { end: null })
    expect(contribution(a1, '2027-03-11', m)).toBe(-21.9)
  })
})

describe('eligibility, confidence and options', () => {
  it('weights by confidence (docs/02 §4)', () => {
    expect(
      contribution(ev('C5', '2025-01-01', 5, { confidence: 'corroborated' }), '2025-01-01', m),
    ).toBeCloseTo(3.5, 12)
    expect(
      contribution(ev('C5', '2025-01-01', 5, { confidence: 'reported' }), '2025-01-01', m),
    ).toBeCloseTo(2, 12)
    expect(
      contribution(ev('C5', '2025-01-01', 5, { confidence: 'disputed' }), '2025-01-01', m),
    ).toBeCloseTo(2, 12)
  })

  it.each(['draft', 'reviewed', 'superseded', 'corrected', 'retracted'])(
    'a %s event contributes 0 on every date',
    (status) => {
      const e = ev('A7', '2024-01-01', 25, { status })
      for (const d of ['2024-01-01', '2025-01-01', '2030-01-01'])
        expect(contribution(e, d, m)).toBe(0)
    },
  )

  it('scores only events scoped to gaza (docs/03 §4)', () => {
    expect(contribution(ev('C5', '2025-01-01', 5, { scope: ['west-bank'] }), '2025-01-01', m)).toBe(
      0,
    )
    expect(
      contribution(ev('C5', '2025-01-01', 5, { scope: ['lebanon', 'gaza'] }), '2025-01-01', m),
    ).toBe(5)
  })

  it('ignores an end on a repeatable event', () => {
    expect(contribution(ev('C5', '2025-01-01', 5, { end: '2025-01-02' }), '2025-06-01', m)).toBe(5)
  })

  it('applies the sensitivity options', () => {
    const reported = ev('B9', '2025-01-01', 5, { confidence: 'reported' })
    expect(
      contribution(reported, '2025-01-01', m, { confidenceWeights: { reported: 0.2 } }),
    ).toBeCloseTo(1, 12)
    expect(contribution(reported, '2025-01-01', m, { excludeIndicators: ['B9', 'B10'] })).toBe(0)
    const vote = ev('B1', '2024-01-01', 3)
    expect(contribution(vote, '2026-06-01', m, { decay: 'off' })).toBe(3)
    expect(contribution(vote, '2023-12-31', m, { decay: 'off' })).toBe(0)
  })

  it('throws on an unknown indicator, a type mismatch or an unknown confidence', () => {
    expect(() =>
      contribution({ ...ev('A6', '2025-01-01', 10), indicator: 'A9' }, '2025-01-01', m),
    ).toThrow(/A9/)
    expect(() =>
      contribution({ ...ev('A6', '2025-01-01', 10), type: 'repeatable' }, '2025-01-01', m),
    ).toThrow(/standing/)
    expect(() =>
      contribution(
        { ...ev('A6', '2025-01-01', 10), confidence: 'rumoured' as never },
        '2025-01-01',
        m,
      ),
    ).toThrow(/confidence/)
    expect(() => contribution(ev('A6', '2025-01-01', 10), '2025-1-1', m)).toThrow(RangeError)
  })
})
