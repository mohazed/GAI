/**
 * Written in P-03 by an independent test writer who derived every expectation from the contract
 * before reading the engine; kept as a second, independent check of the same rules.
 *
 * Independent audit of aggregation: docs/02 §2 (indicator-level caps, stacking and supersede
 * rules), §7 (category caps, E never summed, final clip, rounding, bands) and §9 (user weights).
 *
 * Every expected value below was derived by hand from docs/02 and methodology/v1.0.0, not from the
 * engine. Dates are computed with a local UTC helper so that Δ is in whole days (docs/02 §3).
 */
import { describe, expect, it } from 'vitest'
import { sqrtSharePoints } from './formula.js'
import {
  type CountryScore,
  combine,
  resolveWeights,
  type ScoreOptions,
  scoreCountry,
} from './index.js'
import { ev, methodologyRc1 } from './test-helpers.js'
import type { ScoringEvent } from './types.js'
import { formatWeights, parseWeights, userScore } from './weights.js'

// The docs/02 rules as written: methodology 1.0.0-rc.1 (rc.2 rules: rc2.test.ts).
const m = methodologyRc1()

const at = (events: readonly ScoringEvent[], date: string, options: ScoreOptions = {}) =>
  scoreCountry('TST', events, date, m, options)

/** Value of an indicator after stacking and its indicator-level cap; 0 when it has no events. */
const val = (s: CountryScore, id: string): number =>
  s.indicators.find((i) => i.id === id)?.value ?? 0
const rawOf = (s: CountryScore, id: string): number | undefined =>
  s.indicators.find((i) => i.id === id)?.raw

/** `iso` plus `n` whole days, computed independently of the engine's calendar code. */
function plusDays(iso: string, n: number): string {
  const [y, mo, d] = iso.split('-').map(Number) as [number, number, number]
  return new Date(Date.UTC(y, mo - 1, d) + n * 86_400_000).toISOString().slice(0, 10)
}

/** n repeatable events of `indicator`, `step` days apart from `first`. */
function series(
  indicator: string,
  first: string,
  n: number,
  step: number,
  points: number,
  over: Partial<ScoringEvent> = {},
): ScoringEvent[] {
  return Array.from({ length: n }, (_, i) => ev(indicator, plusDays(first, i * step), points, over))
}

// ------------------------------------------------------------------------------------------------
describe('docs/02 §2 — indicator-level caps, applied to summed contributions before the category clip', () => {
  const t = '2025-06-01'

  it('A5 −15: four confirmed instances (−20) are held at −15; three sit exactly on the cap', () => {
    const four = series('A5', '2025-01-01', 4, 30, -5)
    const s = at(four, t)
    expect(rawOf(s, 'A5')).toBe(-20)
    expect(val(s, 'A5')).toBe(-15)
    expect(s.indicators.find((i) => i.id === 'A5')?.capped).toBe(true)
    expect(s.categories.A.raw).toBe(-15)
    expect(s.categories.A.clipped).toBe(-15)
    expect(val(at(four.slice(0, 3), t), 'A5')).toBe(-15)
    expect(val(at(four.slice(0, 2), t), 'A5')).toBe(-10)
  })

  it('A5 −15 bounds the decayed, weighted sum, not the count of instances', () => {
    // Two at full weight, two at Δ = 730 (d = 0.25): −10 − 1.25 − 1.25 = −12.5, inside the cap.
    const two = series('A5', '2025-01-01', 2, 30, -5)
    const old = [ev('A5', plusDays(t, -730), -5), ev('A5', plusDays(t, -730), -5)]
    expect(val(at([...two, ...old], t), 'A5')).toBeCloseTo(-12.5, 9)
    // Three at full weight and one at Δ = 730: −16.25, held at −15.
    const three = series('A5', '2025-01-01', 3, 30, -5)
    expect(rawOf(at([...three, old[0] as ScoringEvent], t), 'A5')).toBeCloseTo(-16.25, 9)
    expect(val(at([...three, old[0] as ScoringEvent], t), 'A5')).toBe(-15)
    // Four reported instances: 4 × −5 × 0.4 = −8, inside the cap.
    const reported = series('A5', '2025-01-01', 4, 30, -5, { confidence: 'reported' })
    expect(val(at(reported, t), 'A5')).toBeCloseTo(-8, 9)
  })

  it('A8 +10: three instances (+15) are held at +10', () => {
    const three = series('A8', '2025-01-01', 3, 30, 5)
    const s = at(three, t)
    expect(rawOf(s, 'A8')).toBe(15)
    expect(val(s, 'A8')).toBe(10)
    expect(s.categories.A.clipped).toBe(10)
  })

  it('A5 and A8 are capped separately inside category A', () => {
    // A5 −20 → −15, A8 +10 (at the cap) → A = −5; without the A5 cap it would be −10.
    const s = at(
      [...series('A5', '2025-01-01', 4, 30, -5), ...series('A8', '2025-01-15', 2, 30, 5)],
      t,
    )
    expect(s.categories.A.raw).toBe(-5)
    expect(s.categories.A.clipped).toBe(-5)
  })

  it('B9 +10: statements +5, +5, +2 (12) are held at +10; the cap is on contributions (after w)', () => {
    const s = at(
      [ev('B9', '2025-01-10', 5), ev('B9', '2025-02-10', 5), ev('B9', '2025-03-10', 2)],
      t,
    )
    expect(rawOf(s, 'B9')).toBe(12)
    expect(val(s, 'B9')).toBe(10)
    // Corroborated: 3 × 5 × 0.7 = 10.5 → 10. Reported: 4 × 5 × 0.4 = 8, inside.
    expect(
      val(at(series('B9', '2025-01-01', 3, 30, 5, { confidence: 'corroborated' }), t), 'B9'),
    ).toBe(10)
    expect(
      val(at(series('B9', '2025-01-01', 4, 30, 5, { confidence: 'reported' }), t), 'B9'),
    ).toBeCloseTo(8, 9)
  })

  it('B10 −10: three statements (−15) are held at −10', () => {
    const s = at(series('B10', '2025-01-01', 3, 30, -5), t)
    expect(rawOf(s, 'B10')).toBe(-15)
    expect(val(s, 'B10')).toBe(-10)
    expect(s.categories.B.clipped).toBe(-10)
  })

  it('B9 and B10 are capped each on its own sum, never on their net', () => {
    // B9 3 × +5 = 15 → 10; B10 −5 → −5; B = +5. Netting first would give min(15 − 5, 10) = 10.
    const one = at([...series('B9', '2025-01-01', 3, 30, 5), ev('B10', '2025-04-01', -5)], t)
    expect(val(one, 'B9')).toBe(10)
    expect(val(one, 'B10')).toBe(-5)
    expect(one.categories.B.raw).toBe(5)
    // B9 +5, +5, +2 → 10; B10 3 × −5 → −10; B = 0 (uncapped would be −3).
    const both = at(
      [
        ev('B9', '2025-01-10', 5),
        ev('B9', '2025-02-10', 5),
        ev('B9', '2025-03-10', 2),
        ...series('B10', '2025-01-01', 3, 30, -5),
      ],
      t,
    )
    expect(both.categories.B.raw).toBe(0)
    expect(both.categories.B.clipped).toBe(0)
  })

  it('B1 has no indicator cap: 17 yes votes give B1 = +51, and only the category cap +45 binds', () => {
    const votes = series('B1', '2025-01-10', 17, 20, 3)
    const s = at(votes, '2025-12-31')
    expect(val(s, 'B1')).toBe(51)
    expect(s.categories.B.raw).toBe(51)
    expect(s.categories.B.clipped).toBe(45)
    expect(s.categories.B.capped).toBe(true)
  })
})

// ------------------------------------------------------------------------------------------------
describe('docs/02 §2 — one standing state only: B8, B12, C1, C4, D3 do not add', () => {
  it('B8: pre-existing +3 and recognised-after +8 do not add; +8 counts once it holds', () => {
    const pre = ev('B8', '2023-10-07', 3)
    const after = ev('B8', '2025-09-21', 8)
    expect(val(at([pre, after], '2025-06-01'), 'B8')).toBe(3)
    expect(val(at([pre, after], '2025-10-01'), 'B8')).toBe(8)
    expect(at([pre, after], '2025-10-01').categories.B.raw).toBe(8)
  })

  it('B12: recall +5 → downgrade +8 → severed +10, and the downgrade comes back when severance ends', () => {
    const recall = ev('B12', '2023-11-01', 5)
    const downgrade = ev('B12', '2024-01-15', 8)
    const severed = ev('B12', '2024-06-01', 10, { end: '2025-06-01' })
    const all = [recall, downgrade, severed]
    expect(val(at(all, '2023-12-01'), 'B12')).toBe(5)
    expect(val(at(all, '2024-03-01'), 'B12')).toBe(8)
    expect(val(at(all, '2024-06-01'), 'B12')).toBe(10)
    expect(val(at(all, '2025-05-31'), 'B12')).toBe(10)
    // End exclusive: on 2025-06-01 severance no longer holds; the downgrade (still in force) counts.
    expect(val(at(all, '2025-06-01'), 'B12')).toBe(8)
    expect(at(all, '2025-06-01').categories.B.clipped).toBe(8)
    // Downgrade ended too: the recall is the most severe current measure.
    const downgradeEnded = ev('B12', '2024-01-15', 8, { end: '2025-01-01' })
    expect(val(at([recall, downgradeEnded], '2025-02-01'), 'B12')).toBe(5)
    // Two recalls do not add.
    expect(val(at([recall, ev('B12', '2024-02-01', 5)], '2024-03-01'), 'B12')).toBe(5)
  })

  it('B12: a severance that cannot score (draft, other scope, not yet started) does not displace the downgrade', () => {
    const downgrade = ev('B12', '2024-01-15', 8)
    const t = '2024-09-01'
    expect(val(at([downgrade, ev('B12', '2024-06-01', 10, { status: 'draft' })], t), 'B12')).toBe(8)
    expect(
      val(at([downgrade, ev('B12', '2024-06-01', 10, { scope: ['lebanon'] })], t), 'B12'),
    ).toBe(8)
    expect(val(at([downgrade, ev('B12', '2024-10-01', 10)], t), 'B12')).toBe(8)
  })

  it('B12: the most severe measure counts even when its evidence is weaker (reading 1)', () => {
    // Spec text: "the most severe current measure counts". Severed reported: 10 × 0.4 = 4.
    const s = at(
      [ev('B12', '2024-01-15', 8), ev('B12', '2024-06-01', 10, { confidence: 'reported' })],
      '2024-09-01',
    )
    expect(val(s, 'B12')).toBeCloseTo(4, 9)
  })

  it('C1: suspension +10 supersedes review +4; the review counts again when the suspension ends', () => {
    const review = ev('C1', '2024-06-01', 4)
    const suspension = ev('C1', '2025-01-01', 10, { end: '2025-07-01' })
    expect(val(at([review, suspension], '2024-12-31'), 'C1')).toBe(4)
    expect(val(at([review, suspension], '2025-01-01'), 'C1')).toBe(10)
    expect(at([review, suspension], '2025-03-01').categories.C.raw).toBe(10)
    expect(val(at([review, suspension], '2025-07-01'), 'C1')).toBe(4)
  })

  it('C4: ban +5 supersedes labelling +2', () => {
    const labelling = ev('C4', '2024-01-01', 2)
    const ban = ev('C4', '2025-01-01', 5)
    expect(val(at([labelling, ban], '2024-06-01'), 'C4')).toBe(2)
    expect(val(at([labelling, ban], '2025-06-01'), 'C4')).toBe(5)
    expect(at([labelling, ban], '2025-06-01').categories.C.raw).toBe(5)
  })

  it('D3: increased +8 supersedes restored +5; D2 ends on the resumption date (end exclusive)', () => {
    const d2 = ev('D2', '2024-01-26', -10, { end: '2024-04-01' })
    const restored = ev('D3', '2024-04-01', 5)
    const increased = ev('D3', '2025-03-01', 8)
    const all = [d2, restored, increased]
    expect(at(all, '2024-03-31').categories.D.raw).toBe(-10)
    expect(at(all, '2024-04-01').categories.D.raw).toBe(5)
    expect(val(at(all, '2025-02-28'), 'D3')).toBe(5)
    expect(val(at(all, '2025-03-01'), 'D3')).toBe(8)
    expect(at(all, '2025-03-01').categories.D.raw).toBe(8)
  })

  it('B11: ministers +10 and settlers +5 both hold; a second ministers listing does not add', () => {
    const settlers = ev('B11', '2024-02-01', 5)
    const ministers = ev('B11', '2024-06-01', 10, { end: '2025-01-01' })
    expect(val(at([settlers, ministers], '2024-07-01'), 'B11')).toBe(15)
    expect(val(at([settlers, ministers], '2025-01-01'), 'B11')).toBe(5)
    const secondMinisters = ev('B11', '2024-09-01', 10)
    expect(val(at([settlers, ministers, secondMinisters], '2024-10-01'), 'B11')).toBe(15)
  })
})

// ------------------------------------------------------------------------------------------------
describe('docs/02 §2 — A7 supersedes A6; B5/B6 latest formal position holds', () => {
  it('A7 +25 zeroes A6 +10 while it holds; A6 counts again the day A7 ends', () => {
    const a6 = ev('A6', '2024-01-01', 10)
    const a7 = ev('A7', '2024-06-01', 25, { end: '2025-01-01' })
    expect(at([a6, a7], '2024-05-31').categories.A.raw).toBe(10)
    const during = at([a6, a7], '2024-06-01')
    expect(during.categories.A.raw).toBe(25)
    expect(val(during, 'A6')).toBe(0)
    expect(during.events.find((e) => e.id === a6.id)?.reason).toBe('superseded')
    expect(at([a6, a7], '2024-12-31').categories.A.raw).toBe(25)
    expect(at([a6, a7], '2025-01-01').categories.A.raw).toBe(10)
  })

  it('A6 and A7 never add, whatever their confidence', () => {
    const s = at(
      [ev('A6', '2024-01-01', 10, { confidence: 'reported' }), ev('A7', '2024-06-01', 25)],
      '2024-09-01',
    )
    expect(s.categories.A.raw).toBe(25)
  })

  it('an A7 that cannot score (draft, other scope, not yet in force) does not supersede A6', () => {
    const a6 = ev('A6', '2024-01-01', 10)
    const t = '2024-09-01'
    expect(at([a6, ev('A7', '2024-06-01', 25, { status: 'draft' })], t).categories.A.raw).toBe(10)
    expect(at([a6, ev('A7', '2024-06-01', 25, { scope: ['related'] })], t).categories.A.raw).toBe(
      10,
    )
    expect(at([a6, ev('A7', '2024-10-01', 25)], t).categories.A.raw).toBe(10)
  })

  it('B5/B6: the latest formal position holds, in both directions', () => {
    const b5 = ev('B5', '2024-11-22', 8)
    const b6 = ev('B6', '2025-04-03', -10)
    const b5again = ev('B5', '2025-10-01', 8)
    const all = [b5, b6, b5again]
    expect(at(all, '2025-01-01').categories.B.raw).toBe(8)
    expect(at(all, '2025-04-03').categories.B.raw).toBe(-10)
    expect(val(at(all, '2025-04-03'), 'B5')).toBe(0)
    expect(at(all, '2025-09-30').categories.B.raw).toBe(-10)
    expect(at(all, '2025-10-01').categories.B.raw).toBe(8)
    expect(val(at(all, '2025-10-01'), 'B6')).toBe(0)
  })

  it('B5/B6: two commitments are one position (+8, not +16)', () => {
    expect(
      at([ev('B5', '2024-11-22', 8), ev('B5', '2025-02-01', 8)], '2025-03-01').categories.B.raw,
    ).toBe(8)
  })

  it('B5/B6: a later B6 that cannot score does not displace the B5 position', () => {
    const b5 = ev('B5', '2024-11-22', 8)
    const t = '2025-06-01'
    expect(at([b5, ev('B6', '2025-04-03', -10, { status: 'draft' })], t).categories.B.raw).toBe(8)
    expect(at([b5, ev('B6', '2025-04-03', -10, { scope: ['related'] })], t).categories.B.raw).toBe(
      8,
    )
    expect(at([b5, ev('B6', '2025-07-01', -10)], t).categories.B.raw).toBe(8)
  })
})

// ------------------------------------------------------------------------------------------------
describe('docs/02 §2 × §7 — stacking, indicator caps and category caps together', () => {
  it('A7 ending while A6 holds, with A8 capped and the category cap binding', () => {
    const events = [
      ev('A6', '2024-01-01', 10),
      ev('A7', '2024-06-01', 25, { end: '2025-01-01' }),
      ...series('A8', '2024-07-01', 3, 31, 5),
    ]
    // During A7: 25 + 0 (A6) + 10 (A8 15 → 10) = 35 → clipped +30.
    const during = at(events, '2024-10-01')
    expect(val(during, 'A8')).toBe(10)
    expect(during.categories.A.raw).toBe(35)
    expect(during.categories.A.clipped).toBe(30)
    expect(during.categories.A.capped).toBe(true)
    // After A7: 10 (A6) + 10 (A8) = 20, below the cap.
    const after = at(events, '2025-01-01')
    expect(after.categories.A.raw).toBe(20)
    expect(after.categories.A.clipped).toBe(20)
  })

  it('indicator caps come before the category cap: A1 −40, A5 4 × −5, A8 4 × +5 → A = −45, not −40', () => {
    const events = [
      ev('A1', '2025-03-10', -40),
      ...series('A5', '2025-04-01', 4, 30, -5),
      ...series('A8', '2025-04-15', 4, 30, 5),
    ]
    const s = at(events, '2025-09-01')
    expect(val(s, 'A5')).toBe(-15)
    expect(val(s, 'A8')).toBe(10)
    expect(s.categories.A.raw).toBe(-45)
    expect(s.categories.A.clipped).toBe(-45)
  })

  it('category cap −40 binds while the B10 cap −10 also binds', () => {
    const events = [
      ev('B7', '2025-02-06', -20),
      ev('B4', '2025-03-12', -15),
      ...series('B10', '2025-01-01', 3, 30, -5),
    ]
    const s = at(events, '2025-06-01')
    expect(val(s, 'B10')).toBe(-10)
    expect(s.categories.B.raw).toBe(-45)
    expect(s.categories.B.clipped).toBe(-40)
    expect(s.categories.B.capped).toBe(true)
  })

  it('B12 severance ending restores the downgrade inside a category that also holds a capped B9', () => {
    const events = [
      ev('B3', '2024-01-11', 15),
      ev('B12', '2024-01-15', 8),
      ev('B12', '2024-06-01', 10, { end: '2025-06-01' }),
      ...series('B9', '2025-01-01', 3, 30, 5),
    ]
    expect(at(events, '2025-05-31').categories.B.raw).toBe(35)
    expect(at(events, '2025-06-01').categories.B.raw).toBe(33)
    expect(at(events, '2025-06-01').categories.B.clipped).toBe(33)
  })

  it('category cap +45 binds over stacked B indicators (B3, B5, B8, B11, B12)', () => {
    const events = [
      ev('B3', '2024-01-11', 15),
      ev('B11', '2025-06-10', 10),
      ev('B11', '2025-06-10', 5),
      ev('B8', '2023-10-07', 3),
      ev('B8', '2024-05-28', 8),
      ev('B12', '2024-01-15', 8),
      ev('B12', '2024-06-01', 10),
      ev('B5', '2024-11-22', 8),
    ]
    // 15 + 15 + 8 + 10 + 8 = 56 → 45.
    const s = at(events, '2025-09-01')
    expect(s.categories.B.raw).toBe(56)
    expect(s.categories.B.clipped).toBe(45)
  })

  it('D −15 and C −20 caps from below; D +25 and C +20 from above', () => {
    const neg = [
      ev('C2', '2025-01-01', -10),
      ev('C2', '2025-06-01', -10),
      ev('C3', '2026-01-01', -8),
      ev('D2', '2024-01-27', -10),
      ev('D2', '2024-01-30', -10),
    ]
    const n = at(neg, '2026-06-01')
    expect(n.categories.C.raw).toBe(-28)
    expect(n.categories.C.clipped).toBe(-20)
    expect(n.categories.D.raw).toBe(-20)
    expect(n.categories.D.clipped).toBe(-15)
    const pos = [
      ev('C1', '2025-06-01', 10),
      ev('C4', '2025-01-01', 5),
      ev('C5', '2026-03-01', 5),
      ev('C6', '2026-03-01', 3),
      ev('D1', '2026-05-01', 12),
      ev('D3', '2025-01-01', 8),
      ev('D4', '2026-04-01', 5),
      ev('D5', '2026-04-01', 5),
    ]
    const p = at(pos, '2026-06-01')
    expect(p.categories.C.raw).toBe(23)
    expect(p.categories.C.clipped).toBe(20)
    expect(p.categories.D.raw).toBe(30)
    expect(p.categories.D.clipped).toBe(25)
  })
})

// ------------------------------------------------------------------------------------------------
describe('docs/02 §7 — the worked example, recomputed with whole-day Δ', () => {
  const t = '2026-09-26'
  // d = 0.8 needs Δ − 365 = 97.33 days; the nearest whole day is Δ = 462:
  // d(462) = 1 − 0.75 · 97 / 365 = 0.80068493…, so the abstention counts −1.60136986…
  const abstainDate = plusDays(t, -462)
  const d462 = 1 - (0.75 * 97) / 365

  const germany = (a1: number) => [
    ev('A1', '2026-03-09', a1, { end: '2027-03-09' }),
    ev('A3', '2023-10-07', -15),
    ev('A6', '2025-08-08', 10),
    ev('B1', '2026-09-12', 3),
    ev('B1', '2025-12-02', 3),
    ev('B1', abstainDate, -2),
    ev('B10', '2026-05-01', -5),
    ev('B5', '2024-11-22', 8),
    ev('C3', '2026-07-01', -5, { end: '2027-07-01' }),
    ev('D1', '2026-09-01', 6, { end: '2026-10-01' }),
    ev('D2', '2024-01-27', -10, { end: '2024-04-01' }),
    ev('D3', '2024-04-01', 5),
  ]

  it('Δ of the abstention is 462 whole days', () => {
    expect(abstainDate).toBe('2025-06-21')
  })

  it('A1 −22 (as printed): A −27, B +7.3986, C −5, D +11, S −13.6014 → −13.6, display −14, Passive', () => {
    const s = at(germany(-22), t)
    expect(s.categories.A.raw).toBe(-27)
    expect(s.categories.A.clipped).toBe(-27)
    expect(s.categories.B.raw).toBeCloseTo(6 - 2 * d462 - 5 + 8, 10)
    expect(s.categories.B.raw).toBeCloseTo(7.39863, 5)
    expect(s.categories.B.clipped).toBeCloseTo(7.39863, 5)
    expect(s.categories.C.clipped).toBe(-5)
    expect(s.categories.D.raw).toBe(11)
    expect(s.categories.D.clipped).toBe(11)
    expect(s.categories.E).toMatchObject({ raw: 0, clipped: 0, scored: false })
    expect(s.passivity.applied).toBe(false)
    expect(s.passivity.value).toBe(0)
    expect(s.exact).toBeCloseTo(-27 + (6 - 2 * d462 - 5 + 8) - 5 + 11, 10)
    expect(s.exact).toBeCloseTo(-13.60137, 5)
    expect(s.score).toBe(-13.6)
    expect(s.display).toBe(-14)
    expect(s.band).toBe('passive')
  })

  it('A1 at the formula value −40·√0.30 = −21.9: A −26.9, S −13.5014 → −13.5, display −14', () => {
    expect(sqrtSharePoints(0.3, -40, 1)).toBe(-21.9)
    const s = at(germany(-21.9), t)
    expect(s.categories.A.raw).toBeCloseTo(-26.9, 10)
    expect(s.exact).toBeCloseTo(-13.50137, 5)
    expect(s.score).toBe(-13.5)
    expect(s.display).toBe(-14)
    expect(s.band).toBe('passive')
  })

  it('with the abstention inside 365 days (d = 1): B = +7, S = −14', () => {
    const events = germany(-22).map((e) =>
      e.indicator === 'B1' && e.points === -2 ? { ...e, date: '2025-10-01' } : e,
    )
    const s = at(events, t)
    expect(s.categories.B.raw).toBe(7)
    expect(s.exact).toBe(-14)
    expect(s.display).toBe(-14)
  })
})

// ------------------------------------------------------------------------------------------------
describe('docs/02 §7 — E is computed with cap ±10 and never summed; passivity and the final clip', () => {
  it('E1 3 × +5 → E raw 15, clipped 10, not in S', () => {
    const e = series('E1', '2025-01-01', 3, 30, 5)
    const s = at([...e, ev('C5', '2025-02-01', 5)], '2025-06-01')
    expect(s.categories.E).toMatchObject({ raw: 15, clipped: 10, scored: false })
    expect(s.exact).toBe(5)
    expect(s.display).toBe(5)
  })

  it('E2 3 × −5 → E clipped −10, not in S; E alone does not lift passivity', () => {
    const s = at(series('E2', '2025-01-01', 3, 30, -5), '2025-06-01')
    expect(s.categories.E).toMatchObject({ raw: -15, clipped: -10, scored: false })
    expect(s.passivity.applied).toBe(true)
    expect(s.exact).toBe(-15)
    expect(s.band).toBe('passive')
  })

  it('passivity is subtracted after the category clip: B1 +51 → 45, minus 15 → 30', () => {
    const s = at(series('B1', '2025-01-10', 17, 20, 3), '2025-12-31')
    expect(s.passivity.applied).toBe(true)
    expect(s.categories.B.clipped).toBe(45)
    expect(s.exact).toBe(30)
    expect(s.display).toBe(30)
    expect(s.band).toBe('acting')
  })

  it('final clip at −100: A −45, B −40, C −20, D −15 (raw −120) → S = −100, Sustaining', () => {
    const events = [
      ev('A1', '2026-03-09', -40),
      ev('A3', '2023-10-07', -15),
      ev('B2', '2026-01-01', -20),
      ev('B2', '2026-02-01', -20),
      ev('B7', '2025-02-06', -20),
      ev('C2', '2025-01-01', -10),
      ev('C2', '2025-06-01', -10),
      ev('C3', '2026-01-01', -8),
      ev('D2', '2024-01-27', -10),
      ev('D2', '2024-01-30', -10),
    ]
    const s = at(events, '2026-06-01')
    expect(s.passivity.applied).toBe(false)
    expect(s.categories.A.clipped).toBe(-45)
    expect(s.categories.B.clipped).toBe(-40)
    expect(s.categories.C.clipped).toBe(-20)
    expect(s.categories.D.clipped).toBe(-15)
    expect(s.raw).toBe(-120)
    expect(s.exact).toBe(-100)
    expect(s.score).toBe(-100)
    expect(s.display).toBe(-100)
    expect(s.band).toBe('sustaining')
  })

  it('final clip at −100 with passivity: −45 − 40 − 10 − 15 = −110 → −100', () => {
    // D2 started more than 365 days before t: it holds (−10) but its date is outside the window.
    const events = [
      ev('A1', '2026-03-09', -40),
      ev('A3', '2023-10-07', -15),
      ...series('B1', '2025-07-01', 9, 20, -5),
      ev('D2', '2024-01-27', -10),
    ]
    const s = at(events, '2026-06-01')
    expect(s.categories.B.raw).toBe(-45)
    expect(s.passivity.applied).toBe(true)
    expect(s.raw).toBe(-110)
    expect(s.exact).toBe(-100)
    expect(s.display).toBe(-100)
  })

  it('final clip at +100: A +30, B +45, C +20, D +25 (raw +120) → S = +100, Confronting', () => {
    const events = [
      ev('A7', '2025-01-01', 25),
      ev('A8', '2026-01-01', 5),
      ev('A8', '2026-02-01', 5),
      ev('B3', '2024-01-11', 15),
      ev('B11', '2025-06-10', 10),
      ev('B11', '2025-06-10', 5),
      ev('B12', '2025-01-01', 10),
      ev('B8', '2025-09-21', 8),
      ev('C1', '2025-06-01', 10),
      ev('C4', '2025-01-01', 5),
      ev('C5', '2026-03-01', 5),
      ev('C6', '2026-03-01', 3),
      ev('D1', '2026-05-01', 12),
      ev('D3', '2025-01-01', 8),
      ev('D4', '2026-04-01', 5),
      ev('D5', '2026-04-01', 5),
    ]
    const s = at(events, '2026-06-01')
    expect(s.categories.A).toMatchObject({ raw: 35, clipped: 30 })
    expect(s.categories.B).toMatchObject({ raw: 48, clipped: 45 })
    expect(s.categories.C).toMatchObject({ raw: 23, clipped: 20 })
    expect(s.categories.D).toMatchObject({ raw: 30, clipped: 25 })
    expect(s.raw).toBe(120)
    expect(s.exact).toBe(100)
    expect(s.display).toBe(100)
    expect(s.band).toBe('confronting')
  })
})

// ------------------------------------------------------------------------------------------------
describe('docs/02 §7 — rounding half away from zero, band read from the rounded integer', () => {
  const t = '2025-06-01'

  it('S = −0.5 → display −1 (not 0), Passive', () => {
    const s = at(
      [ev('A5', '2025-01-01', -5, { confidence: 'corroborated' }), ev('C6', '2025-02-01', 3)],
      t,
    )
    expect(s.passivity.applied).toBe(false)
    expect(s.exact).toBeCloseTo(-0.5, 12)
    expect(s.score).toBe(-0.5)
    expect(s.display).toBe(-1)
    expect(s.band).toBe('passive')
  })

  it('S = +0.5 → display +1, Acting', () => {
    const s = at(
      [ev('A5', '2025-01-01', -5, { confidence: 'corroborated' }), ev('C1', '2025-02-01', 4)],
      t,
    )
    expect(s.exact).toBeCloseTo(0.5, 12)
    expect(s.score).toBe(0.5)
    expect(s.display).toBe(1)
    expect(s.band).toBe('acting')
  })

  it('S = 0 exactly → display 0 (never −0), Passive', () => {
    const s = at([ev('A5', '2025-01-01', -5), ev('C5', '2025-02-01', 5)], t)
    expect(s.exact).toBe(0)
    expect(s.score).toBe(0)
    expect(s.display).toBe(0)
    expect(s.band).toBe('passive')
  })

  it('13.5 on paper (5 × 3 × 0.7 + 3) → 14, despite 2.1 not being exact in binary', () => {
    const votes = series('B1', '2025-01-01', 5, 20, 3, { confidence: 'corroborated' })
    const s = at([...votes, ev('C6', '2025-03-01', 3)], t)
    expect(s.exact).toBeCloseTo(13.5, 9)
    expect(s.score).toBe(13.5)
    expect(s.display).toBe(14)
  })

  it('S = −20.5 → display −21 → Enabling (band from the rounded integer)', () => {
    const s = at(
      [
        ev('A3', '2023-10-07', -15),
        ev('A5', '2025-01-01', -5, { confidence: 'corroborated' }),
        ev('B10', '2025-02-01', -5),
        ev('C6', '2025-03-01', 3),
      ],
      t,
    )
    expect(s.exact).toBeCloseTo(-20.5, 12)
    expect(s.display).toBe(-21)
    expect(s.band).toBe('enabling')
  })

  it('S = 40.5 → display 41 → Confronting', () => {
    const s = at(
      [
        ev('A7', '2024-06-01', 25),
        ev('A5', '2025-01-01', -5, { confidence: 'corroborated' }),
        ev('B9', '2025-01-15', 5),
        ev('B9', '2025-02-15', 5),
        ev('C1', '2025-02-01', 4),
        ev('D4', '2025-03-01', 5),
      ],
      t,
    )
    expect(s.exact).toBeCloseTo(40.5, 12)
    expect(s.display).toBe(41)
    expect(s.band).toBe('confronting')
  })

  /** Spreads a total over A–D inside the category caps, as clipped subtotals would be. */
  function spread(x: number): Record<'A' | 'B' | 'C' | 'D', number> {
    const clip = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
    const A = clip(x, -45, 30)
    const B = clip(x - A, -40, 45)
    const C = clip(x - A - B, -20, 20)
    const D = x - A - B - C
    return { A, B, C, D }
  }

  const cases: [number, number, string][] = [
    [-100, -100, 'sustaining'],
    [-51, -51, 'sustaining'],
    [-50.5, -51, 'sustaining'],
    [-50.4, -50, 'enabling'],
    [-50, -50, 'enabling'],
    [-21, -21, 'enabling'],
    [-20.5, -21, 'enabling'],
    [-20.4, -20, 'passive'],
    [-20, -20, 'passive'],
    [-0.5, -1, 'passive'],
    [-0.4, 0, 'passive'],
    [0, 0, 'passive'],
    [0.4, 0, 'passive'],
    [0.5, 1, 'acting'],
    [1, 1, 'acting'],
    [40, 40, 'acting'],
    [40.4, 40, 'acting'],
    [40.5, 41, 'confronting'],
    [41, 41, 'confronting'],
    [100, 100, 'confronting'],
  ]
  it.each(cases)('combine: S = %d → display %d, band %s', (x, display, band) => {
    const c = combine(spread(x), 0, m)
    expect(c.display).toBe(display)
    expect(c.band).toBe(band)
  })

  it('combine: passivity subtracts after the categories, then the final clip applies', () => {
    expect(combine({ A: 0, B: 0, C: 0, D: 0 }, 15, m)).toMatchObject({
      exact: -15,
      display: -15,
      band: 'passive',
    })
    expect(combine({ A: -45, B: -40, C: -20, D: -15 }, 15, m)).toMatchObject({
      raw: -135,
      exact: -100,
      display: -100,
      band: 'sustaining',
    })
    expect(combine({ A: 30, B: 45, C: 20, D: 25 }, 0, m)).toMatchObject({
      raw: 120,
      exact: 100,
      display: 100,
    })
  })

  it('combine: display is rounded from full-precision S (40.45 → score 40.5, display 40)', () => {
    const c = combine({ A: 30, B: 10.45, C: 0, D: 0 }, 0, m)
    expect(c.score).toBe(40.5)
    expect(c.display).toBe(40)
    expect(c.band).toBe('acting')
  })

  it('combine: −0.04 gives score 0 and display 0, never −0', () => {
    const c = combine({ A: -0.04, B: 0, C: 0, D: 0 }, 0, m)
    expect(c.score).toBe(0)
    expect(c.display).toBe(0)
    expect(c.band).toBe('passive')
  })
})

// ------------------------------------------------------------------------------------------------
describe('docs/02 §9 — user weights: S_user = clip(Σ w_k · clip_k − passivity, −100, 100)', () => {
  const published = (A: number, B: number, C: number, D: number, passivity: number, E = 0) => ({
    categories: {
      A: { clipped: A },
      B: { clipped: B },
      C: { clipped: C },
      D: { clipped: D },
      E: { clipped: E },
    },
    passivity: { value: passivity },
  })
  const example = published(-27, 7.4, -5, 11, 0)

  it('defaults reproduce S of the worked example (−13.6 → −14)', () => {
    const u = userScore(example, {}, m)
    expect(u.exact).toBeCloseTo(-13.6, 12)
    expect(u.display).toBe(-14)
    expect(u.band).toBe('passive')
  })

  it('w_A = 0 → 13.4 → 13, Acting; w_A = 2 → −40.6 → −41, Enabling', () => {
    expect(userScore(example, { A: 0 }, m)).toMatchObject({ display: 13, band: 'acting' })
    expect(userScore(example, { A: 0 }, m).exact).toBeCloseTo(13.4, 12)
    expect(userScore(example, { A: 2 }, m)).toMatchObject({ display: -41, band: 'enabling' })
    expect(userScore(example, { A: 2 }, m).exact).toBeCloseTo(-40.6, 12)
  })

  it('all weights 0 → 0; all at 2 → −27.2 → −27', () => {
    expect(userScore(example, { A: 0, B: 0, C: 0, D: 0 }, m)).toMatchObject({
      exact: 0,
      display: 0,
    })
    const two = userScore(example, { A: 2, B: 2, C: 2, D: 2 }, m)
    expect(two.exact).toBeCloseTo(-27.2, 12)
    expect(two.display).toBe(-27)
    expect(two.band).toBe('enabling')
  })

  it('passivity is not weighted: all weights 0 with passivity 15 → −15', () => {
    expect(userScore(published(-27, 7.4, -5, 11, 15), { A: 0, B: 0, C: 0, D: 0 }, m)).toMatchObject(
      {
        exact: -15,
        display: -15,
      },
    )
  })

  it('weights multiply the clipped subtotals and are not re-capped per category', () => {
    // A −45 at w = 2 is −90, not −45.
    expect(userScore(published(-45, 0, 0, 0, 0), { A: 2 }, m)).toMatchObject({
      exact: -90,
      display: -90,
      band: 'sustaining',
    })
    // Everything at its negative cap and w = 2: −240 → −100.
    expect(
      userScore(published(-45, -40, -20, -15, 15), { A: 2, B: 2, C: 2, D: 2 }, m),
    ).toMatchObject({
      exact: -100,
      display: -100,
    })
  })

  it('E is never summed, even when a published E subtotal is present', () => {
    expect(userScore(published(0, 0, 0, 0, 0, 10), { A: 2, B: 2, C: 2, D: 2 }, m).exact).toBe(0)
  })

  it('engine with weights = userScore over its own default published subtotals', () => {
    const events = [
      ev('A1', '2026-03-09', -40),
      ev('A3', '2023-10-07', -15),
      ev('B9', '2026-02-01', 5),
      ev('B1', '2026-01-10', 3),
      ev('C3', '2026-01-01', -5),
      ev('D1', '2026-05-01', 6),
    ]
    const t = '2026-06-01'
    const base = at(events, t)
    expect(base.categories.A.clipped).toBe(-45)
    const weights = { A: 2, B: 0.5, C: 0, D: 1.5 }
    const weighted = at(events, t, { weights })
    // clip_k are published unweighted; w_k is carried beside them.
    expect(weighted.categories.A.clipped).toBe(-45)
    expect(weighted.categories.A.weight).toBe(2)
    // 2 · (−45) + 0.5 · 8 + 0 · (−5) + 1.5 · 6 = −90 + 4 + 0 + 9 = −77
    expect(weighted.exact).toBeCloseTo(-77, 12)
    expect(weighted.display).toBe(-77)
    expect(weighted.band).toBe('sustaining')
    const u = userScore(base, weights, m)
    expect(u.exact).toBeCloseTo(weighted.exact, 12)
    expect(u.display).toBe(weighted.display)
    expect(u.band).toBe(weighted.band)
  })

  it('a zero weight does not switch passivity on: B9 alone at w_B = 0 → 0, not −15', () => {
    const s = at([ev('B9', '2025-03-01', 5)], '2025-06-01', { weights: { A: 0, B: 0, C: 0, D: 0 } })
    expect(s.passivity.applied).toBe(false)
    expect(s.exact).toBe(0)
    const votesOnly = at([ev('B1', '2025-03-01', 3)], '2025-06-01', { weights: { B: 2 } })
    expect(votesOnly.passivity.applied).toBe(true)
    expect(votesOnly.exact).toBe(2 * 3 - 15)
  })

  it('URL encoding ?w=A,B,C,D with one-decimal values in [0, 2]', () => {
    expect(formatWeights({ A: 1, B: 1.5, C: 0, D: 2 })).toBe('1.0,1.5,0.0,2.0')
    expect(parseWeights('1.0,1.5,0.0,2.0')).toEqual({ A: 1, B: 1.5, C: 0, D: 2 })
    expect(parseWeights('0,2,1,1')).toEqual({ A: 0, B: 2, C: 1, D: 1 })
    expect(parseWeights('2.1,1,1,1')).toBeNull()
    expect(parseWeights('-0.5,1,1,1')).toBeNull()
    expect(parseWeights('1.25,1,1,1')).toBeNull()
    expect(parseWeights('1,1,1')).toBeNull()
  })

  it('missing weights default to 1', () => {
    expect(resolveWeights({ A: 0 })).toEqual({ A: 0, B: 1, C: 1, D: 1 })
    expect(resolveWeights()).toEqual({ A: 1, B: 1, C: 1, D: 1 })
  })

  it('w_k multiplies clip_k, after the category cap: A raw −55 (clip −45) at w_A = 0.5 → −22.5', () => {
    const events = [
      ev('A1', '2026-03-09', -40),
      ev('A3', '2023-10-07', -15),
      ev('C6', '2026-03-01', 3),
    ]
    const s = at(events, '2026-06-01', { weights: { A: 0.5 } })
    expect(s.categories.A.raw).toBe(-55)
    expect(s.categories.A.clipped).toBe(-45)
    // 0.5 · (−45) + 3 = −19.5; weighting before the clip would give clip(−27.5) + 3 = −24.5.
    expect(s.exact).toBeCloseTo(-19.5, 12)
    expect(s.display).toBe(-20)
    expect(s.band).toBe('passive')
  })

  it('w_k = 2 is not re-capped by the category cap: A −30 at w_A = 2 → −60', () => {
    const events = [
      ev('A3', '2023-10-07', -15),
      ev('A3', '2024-01-01', -15),
      ev('C6', '2026-03-01', 3),
    ]
    const s = at(events, '2026-06-01', { weights: { A: 2 } })
    expect(s.categories.A.clipped).toBe(-30)
    expect(s.exact).toBe(-57)
    expect(s.band).toBe('sustaining')
  })
})

// ------------------------------------------------------------------------------------------------
describe('docs/02 §2 — more cap and stacking interactions', () => {
  it('A8 cap with decay: an expired instance (Δ = 731) adds nothing; one at Δ = 730 adds 1.25', () => {
    const t = '2026-06-01'
    const recent = series('A8', '2026-01-01', 2, 30, 5)
    expect(val(at([...recent, ev('A8', plusDays(t, -731), 5)], t), 'A8')).toBe(10)
    const s = at([...recent, ev('A8', plusDays(t, -730), 5)], t)
    expect(rawOf(s, 'A8')).toBeCloseTo(11.25, 9)
    expect(val(s, 'A8')).toBe(10)
  })

  it('B9 cap with decay: +5, +5 and a +5 at Δ = 730 (1.25) → 11.25 → 10; a +2 at Δ = 548 → 11.x → 10', () => {
    const t = '2026-06-01'
    const recent = series('B9', '2026-01-01', 2, 30, 5)
    expect(val(at([...recent, ev('B9', plusDays(t, -730), 5)], t), 'B9')).toBe(10)
    // d(548) = 1 − 0.75 · 183/365; 2 · d(548) ≈ 1.2479 → 11.2479 → 10.
    expect(rawOf(at([...recent, ev('B9', plusDays(t, -548), 2)], t), 'B9')).toBeCloseTo(
      10 + 2 * (1 - (0.75 * 183) / 365),
      9,
    )
    expect(val(at([...recent, ev('B9', plusDays(t, -548), 2)], t), 'B9')).toBe(10)
  })

  it('supersede and latest position apply within the same country only', () => {
    const t = '2025-06-01'
    const a6 = ev('A6', '2024-01-01', 10)
    const otherA7 = ev('A7', '2024-06-01', 25, { country: 'OTH' })
    expect(at([a6, otherA7], t).categories.A.raw).toBe(10)
    const b5 = ev('B5', '2024-11-22', 8)
    const otherB6 = ev('B6', '2025-04-03', -10, { country: 'OTH' })
    expect(at([b5, otherB6], t).categories.B.raw).toBe(8)
    const b12 = ev('B12', '2024-01-15', 8)
    const otherSevered = ev('B12', '2024-06-01', 10, { country: 'OTH' })
    expect(val(at([b12, otherSevered], t), 'B12')).toBe(8)
  })

  it('each category raw is the sum of its indicator values after stacking and indicator caps', () => {
    const events = [
      ev('A6', '2024-01-01', 10),
      ev('A7', '2024-06-01', 25),
      ...series('A8', '2025-01-01', 3, 30, 5),
      ...series('A5', '2025-01-15', 4, 30, -5),
      ev('B12', '2024-01-15', 8),
      ev('B12', '2024-06-01', 10),
      ...series('B9', '2025-01-01', 4, 30, 5),
      ev('B5', '2024-11-22', 8),
      ev('B6', '2025-04-03', -10),
    ]
    const s = at(events, '2025-06-01')
    for (const k of ['A', 'B', 'C', 'D'] as const) {
      const sum = s.indicators.filter((i) => i.category === k).reduce((a, i) => a + i.value, 0)
      expect(s.categories[k].raw).toBeCloseTo(sum, 12)
    }
    // A: 25 (A7) + 0 (A6) + 10 (A8) − 15 (A5) = 20; B: 10 (B12) + 10 (B9) − 10 (B6) = 10.
    expect(s.categories.A.raw).toBe(20)
    expect(s.categories.B.raw).toBe(10)
  })
})

// ------------------------------------------------------------------------------------------------
describe('docs/02 §7, §14 — score to one decimal and display to an integer, both half away from zero', () => {
  const cases: [number, number, number, string][] = [
    [-13.55, -13.6, -14, 'passive'],
    [13.45, 13.5, 13, 'acting'],
    [-13.45, -13.5, -13, 'passive'],
    [0.05, 0.1, 0, 'passive'],
    [-0.05, -0.1, 0, 'passive'],
  ]
  it.each(cases)('S = %d → score %d, display %d, band %s', (x, score, display, band) => {
    const c = combine({ A: 0, B: x, C: 0, D: 0 }, 0, m)
    expect(c.score).toBe(score)
    expect(c.display).toBe(display)
    expect(c.band).toBe(band)
  })
})
