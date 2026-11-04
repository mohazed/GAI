/**
 * Indicator-level caps, category caps, the final clip and the stacking and supersede rules of
 * docs/02 §2 (B8, B11, B12, C1, C4, D3, A6/A7, B5/B6 latest position).
 */
import { describe, expect, it } from 'vitest'
import { scoreCountry } from './score.js'
import { ev, methodologyRc1 } from './test-helpers.js'
import type { ScoringEvent } from './types.js'

// The docs/02 rules as written: methodology 1.0.0-rc.1 (rc.2 rules: rc2.test.ts).
const m = methodologyRc1()
const at = (events: ScoringEvent[], date: string) => scoreCountry('TST', events, date, m)
const indicator = (events: ScoringEvent[], date: string, id: string) =>
  at(events, date).indicators.find((i) => i.id === id)
const reasonOf = (events: ScoringEvent[], date: string, id: string) =>
  at(events, date).events.find((e) => e.id === id)?.reason

describe('indicator-level caps (docs/02 §2), applied before the category clip', () => {
  it('A5 −15: hit from below', () => {
    const four = ['2025-01-01', '2025-02-01', '2025-03-01', '2025-04-01'].map((d) =>
      ev('A5', d, -5),
    )
    const r = indicator(four, '2025-05-01', 'A5')
    expect(r?.raw).toBe(-20)
    expect(r?.value).toBe(-15)
    expect(r?.capped).toBe(true)
    expect(indicator(four.slice(0, 3), '2025-05-01', 'A5')).toMatchObject({
      value: -15,
      capped: false,
    })
    expect(indicator(four.slice(0, 2), '2025-05-01', 'A5')?.value).toBe(-10)
  })

  it('A8 +10: hit from above', () => {
    const three = ['2025-01-01', '2025-02-01', '2025-03-01'].map((d) => ev('A8', d, 5))
    expect(indicator(three, '2025-05-01', 'A8')).toMatchObject({ raw: 15, value: 10, capped: true })
  })

  it('B9 +10 and B10 −10', () => {
    const b9 = ['2025-01-01', '2025-02-01', '2025-03-01'].map((d) => ev('B9', d, 5))
    const b10 = ['2025-01-01', '2025-02-01', '2025-03-01'].map((d) => ev('B10', d, -5))
    expect(indicator(b9, '2025-05-01', 'B9')).toMatchObject({ raw: 15, value: 10 })
    expect(indicator(b10, '2025-05-01', 'B10')).toMatchObject({ raw: -15, value: -10 })
  })

  it('B1 has no indicator cap; the category cap governs', () => {
    const noes = Array.from({ length: 10 }, (_, i) => ev('B1', `2025-01-${String(i + 10)}`, -5))
    const s = at(noes, '2025-06-01')
    expect(s.indicators.find((i) => i.id === 'B1')).toMatchObject({
      raw: -50,
      value: -50,
      capped: false,
    })
    expect(s.categories.B).toMatchObject({ raw: -50, clipped: -40, capped: true })
  })

  it('the cap bounds the sum of decayed and undecayed instances', () => {
    const four = ['2024-01-01', '2025-01-01', '2025-02-01', '2025-03-01'].map((d) =>
      ev('A5', d, -5),
    )
    // On 2025-06-01 the 2024 instance is 517 days old: −5 · d(517) = −3.438…
    const r = indicator(four, '2025-06-01', 'A5')
    expect(r?.raw).toBeCloseTo(-15 - 5 * (1 - (0.75 * 152) / 365), 8)
    expect(r?.value).toBe(-15)
  })
})

describe('category caps and the final clip (docs/02 §7)', () => {
  it('A −45 / +30', () => {
    expect(
      at([ev('A1', '2024-03-11', -40), ev('A3', '2023-10-07', -15)], '2025-01-01').categories.A,
    ).toMatchObject({
      raw: -55,
      clipped: -45,
      capped: true,
    })
    const up = [ev('A7', '2024-01-01', 25), ev('A8', '2024-06-01', 5), ev('A8', '2024-07-01', 5)]
    expect(at(up, '2024-08-01').categories.A).toMatchObject({ raw: 35, clipped: 30 })
  })

  it('B −40 / +45, C −20 / +20, D −15 / +25', () => {
    const bUp = [
      ev('B3', '2024-01-01', 15),
      ev('B5', '2024-11-22', 8),
      ev('B8', '2024-05-28', 8),
      ev('B11', '2024-06-01', 10),
      ev('B11', '2024-06-02', 5),
      ev('B12', '2024-06-03', 10),
    ]
    expect(at(bUp, '2025-01-01').categories.B).toMatchObject({ raw: 56, clipped: 45 })
    const bDown = [
      ev('B2', '2025-01-15', -20),
      ev('B7', '2025-02-06', -20),
      ev('B4', '2025-03-01', -15),
    ]
    expect(at(bDown, '2025-04-01').categories.B).toMatchObject({ raw: -55, clipped: -40 })
    const cUp = [
      ev('C1', '2025-01-01', 10),
      ev('C4', '2025-01-01', 5),
      ev('C5', '2025-01-01', 5),
      ev('C6', '2025-01-01', 3),
    ]
    expect(at(cUp, '2025-02-01').categories.C).toMatchObject({ raw: 23, clipped: 20 })
    const cDown = [
      ev('C2', '2024-01-01', -10),
      ev('C2', '2024-06-01', -10),
      ev('C3', '2025-01-01', -8),
    ]
    expect(at(cDown, '2025-02-01').categories.C).toMatchObject({ raw: -28, clipped: -20 })
    const dUp = [
      ev('D1', '2025-01-01', 12),
      ev('D3', '2024-07-01', 8),
      ev('D4', '2025-01-01', 5),
      ev('D4', '2025-01-02', 5),
    ]
    expect(at(dUp, '2025-01-10').categories.D).toMatchObject({ raw: 30, clipped: 25 })
    const dDown = [ev('D2', '2024-01-27', -10), ev('D2', '2024-01-28', -10)]
    expect(at(dDown, '2024-02-01').categories.D).toMatchObject({ raw: -20, clipped: -15 })
  })

  it('E is computed with its cap −10 / +10 and never summed (D-12)', () => {
    const e = [
      ev('E2', '2025-01-01', -5),
      ev('E2', '2025-02-01', -5),
      ev('E2', '2025-03-01', -5),
      ev('B9', '2025-03-01', 5),
    ]
    const s = at(e, '2025-04-01')
    expect(s.categories.E).toMatchObject({ raw: -15, clipped: -10, scored: false })
    expect(s.exact).toBe(5)
  })

  it('clips S to +100 from above and −100 from below', () => {
    const top = [
      ev('A7', '2024-01-01', 25),
      ev('A8', '2024-06-01', 5),
      ev('A6', '2024-01-01', 10),
      ev('B3', '2024-01-01', 15),
      ev('B5', '2024-06-01', 8),
      ev('B8', '2024-05-28', 8),
      ev('B11', '2024-06-01', 10),
      ev('B12', '2024-06-03', 10),
      ev('C1', '2024-06-01', 10),
      ev('C4', '2024-06-01', 5),
      ev('C5', '2024-06-01', 5),
      ev('D1', '2024-06-01', 12),
      ev('D3', '2024-06-01', 8),
      ev('D4', '2024-06-01', 5),
    ]
    const s = at(top, '2024-07-01')
    expect(s.raw).toBe(120)
    expect(s).toMatchObject({ exact: 100, score: 100, display: 100, band: 'confronting' })
    const bottom = [
      ev('A1', '2024-03-11', -40),
      ev('A3', '2023-10-07', -15),
      ev('B2', '2024-12-01', -20),
      ev('B7', '2025-02-06', -20),
      ev('C2', '2024-06-01', -10),
      ev('C3', '2025-01-01', -8),
      ev('C2', '2024-07-01', -10),
      ev('D2', '2024-01-27', -10),
      ev('D2', '2024-01-28', -10),
    ]
    const b = at(bottom, '2025-03-01')
    expect(b.raw).toBe(-120)
    expect(b).toMatchObject({ exact: -100, display: -100, band: 'sustaining' })
  })
})

describe('supersede rules (docs/02 §2)', () => {
  it('A7 supersedes A6 while it holds; A6 counts again after A7 ends', () => {
    const a6 = ev('A6', '2024-01-01', 10)
    const a7 = ev('A7', '2025-01-01', 25, { end: '2025-12-01' })
    const events = [a6, a7]
    expect(at(events, '2024-06-01').categories.A.raw).toBe(10)
    expect(at(events, '2025-06-01').categories.A.raw).toBe(25)
    expect(at(events, '2025-06-01').events.find((e) => e.id === a6.id)).toMatchObject({
      reason: 'superseded',
      by: a7.id,
      counted: 0,
      value: 10,
    })
    expect(at(events, '2025-12-01').categories.A.raw).toBe(10)
  })

  it('B12: the most severe current measure counts; they do not add', () => {
    const recall = ev('B12', '2023-11-01', 5)
    const downgrade = ev('B12', '2024-02-01', 8)
    const severed = ev('B12', '2024-06-01', 10)
    const events = [recall, downgrade, severed]
    expect(indicator(events, '2024-01-01', 'B12')?.value).toBe(5)
    expect(indicator(events, '2024-03-01', 'B12')?.value).toBe(8)
    expect(indicator(events, '2024-07-01', 'B12')?.value).toBe(10)
    expect(reasonOf(events, '2024-07-01', recall.id)).toBe('less-severe')
    // Relations restored: the severance ends, the downgrade still holds.
    const ended = [recall, downgrade, { ...severed, end: '2025-01-01' }]
    expect(indicator(ended, '2025-02-01', 'B12')?.value).toBe(8)
  })

  it('most severe is read from the points, not the weighted contribution', () => {
    const recall = ev('B12', '2024-01-01', 5)
    const severedReported = ev('B12', '2024-02-01', 10, { confidence: 'reported' })
    expect(indicator([recall, severedReported], '2024-03-01', 'B12')?.value).toBeCloseTo(4, 12)
  })

  it('B8: one standing state, +8 after 2023-10-07 else +3', () => {
    const pre = ev('B8', '2023-10-07', 3)
    const after = ev('B8', '2025-09-21', 8)
    expect(indicator([pre, after], '2025-01-01', 'B8')?.value).toBe(3)
    expect(indicator([pre, after], '2025-09-21', 'B8')?.value).toBe(8)
  })

  it('B11: ministers and settlers are separate standing states and both hold; one per tier', () => {
    const ministers = ev('B11', '2025-06-10', 10)
    const settlers = ev('B11', '2024-02-12', 5)
    const moreSettlers = ev('B11', '2024-05-03', 5)
    const events = [ministers, settlers, moreSettlers]
    expect(indicator(events, '2024-06-01', 'B11')?.value).toBe(5)
    expect(reasonOf(events, '2024-06-01', moreSettlers.id)).toBe('same-tier')
    expect(indicator(events, '2025-07-01', 'B11')?.value).toBe(15)
  })

  it('C1: suspension supersedes review; they do not add', () => {
    const events = [ev('C1', '2025-05-20', 4), ev('C1', '2026-01-15', 10)]
    expect(indicator(events, '2025-06-01', 'C1')?.value).toBe(4)
    expect(indicator(events, '2026-02-01', 'C1')?.value).toBe(10)
  })

  it('C4: ban supersedes labelling', () => {
    const events = [ev('C4', '2024-01-01', 2), ev('C4', '2025-01-01', 5)]
    expect(indicator(events, '2024-06-01', 'C4')?.value).toBe(2)
    expect(indicator(events, '2025-06-01', 'C4')?.value).toBe(5)
  })

  it('D3: increased supersedes restored', () => {
    const events = [ev('D3', '2024-07-01', 5), ev('D3', '2025-03-01', 8)]
    expect(indicator(events, '2024-08-01', 'D3')?.value).toBe(5)
    expect(indicator(events, '2025-04-01', 'D3')?.value).toBe(8)
  })

  it('B5 / B6: the latest formal position holds, in either order', () => {
    const refuse = ev('B6', '2024-11-25', -10)
    const commit = ev('B5', '2025-03-01', 8)
    const b = (events: ScoringEvent[], d: string) => at(events, d).indicators
    expect(b([refuse, commit], '2025-01-01').map((i) => [i.id, i.value])).toEqual([
      ['B5', 0],
      ['B6', -10],
    ])
    expect(b([refuse, commit], '2025-04-01').map((i) => [i.id, i.value])).toEqual([
      ['B5', 8],
      ['B6', 0],
    ])
    expect(reasonOf([refuse, commit], '2025-04-01', refuse.id)).toBe('earlier-position')
    const commitFirst = ev('B5', '2024-11-22', 8)
    const refuseLater = ev('B6', '2026-06-02', -10)
    expect(at([commitFirst, refuseLater], '2026-07-01').categories.B.raw).toBe(-10)
    expect(at([commitFirst, refuseLater], '2026-05-01').categories.B.raw).toBe(8)
  })

  it('B5 / B6 on the same day: the greater id holds (deterministic tie-break)', () => {
    const b5 = ev('B5', '2025-03-01', 8, { id: 'evt_2025_03_01_TST_B5' })
    const b6 = ev('B6', '2025-03-01', -10, { id: 'evt_2025_03_01_TST_B6' })
    expect(at([b5, b6], '2025-04-01').categories.B.raw).toBe(-10)
    expect(at([b6, b5], '2025-04-01').categories.B.raw).toBe(-10)
  })

  it('stacking considers only published, gaza-scoped events in force', () => {
    const severed = ev('B12', '2024-06-01', 10, { status: 'retracted' })
    const recall = ev('B12', '2023-11-01', 5)
    expect(indicator([recall, severed], '2024-07-01', 'B12')?.value).toBe(5)
    const a7 = ev('A7', '2025-01-01', 25, { scope: ['west-bank'] })
    expect(at([ev('A6', '2024-01-01', 10), a7], '2025-06-01').categories.A.raw).toBe(10)
  })
})
