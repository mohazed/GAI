import { describe, expect, it } from 'vitest'
import { sqrtSharePoints } from './formula.js'
import { bandFor } from './methodology.js'
import { combine, scoreCountry } from './score.js'
import { ev, methodology } from './test-helpers.js'
import { addDays } from './time.js'

const m = methodology()

describe('the worked example of docs/02 §7, reproduced to the decimal', () => {
  // "Germany, hypothetical date: A: A1 −22 (s = 0.30), A3 −15, A6 +10 → −27 (within −45).
  // B: votes +3, +3, −2 (decayed ×0.8 → −1.6), B10 −5, B5 +8 → +7.4. C: C3 −5. D: D1 +6,
  // D2 (ended) 0, D3 +5 → +11. raw = −27 + 7.4 − 5 + 11 = −13.6; no passivity. S = −13.6 →
  // display −14, Passive."
  const t = '2026-09-26'
  // d = 0.8 needs Δ = 365 + 97.33… days; Δ is whole (§3), so the example's vote is 462 days old:
  // d(462) = 0.800685 and −2 · d = −1.60137, which is −1.6 to the decimal.
  const decayedVote = ev('B1', addDays(t, -462), -2, { country: 'DEU' })
  const events = [
    ev('A1', '2026-03-09', -22, { country: 'DEU' }),
    ev('A3', '2023-10-07', -15, { country: 'DEU' }),
    ev('A6', '2025-08-08', 10, { country: 'DEU' }),
    ev('B1', '2026-09-12', 3, { country: 'DEU' }),
    ev('B1', '2025-12-10', 3, { country: 'DEU' }),
    decayedVote,
    ev('B10', '2026-03-01', -5, { country: 'DEU' }),
    ev('B5', '2024-11-22', 8, { country: 'DEU' }),
    ev('C3', '2026-01-15', -5, { country: 'DEU' }),
    ev('D1', '2026-09-01', 6, { country: 'DEU', end: '2026-10-01' }),
    ev('D2', '2024-01-27', -10, { country: 'DEU', end: '2024-07-01' }),
    ev('D3', '2024-07-01', 5, { country: 'DEU' }),
  ]
  const s = scoreCountry('DEU', events, t, m)
  const one = (x: number) => Math.round(x * 10) / 10

  it('category subtotals', () => {
    expect(s.categories.A).toMatchObject({ raw: -27, clipped: -27 })
    expect(one(s.categories.B.raw)).toBe(7.4)
    // Sums are kept on the 1e-9 grid (numeric.ts): equal to the exact value to 9 decimals.
    expect(s.categories.B.raw).toBeCloseTo(3 + 3 - 2 * (1 - (0.75 * 97) / 365) - 5 + 8, 9)
    expect(s.categories.C).toMatchObject({ raw: -5, clipped: -5 })
    expect(s.categories.D).toMatchObject({ raw: 11, clipped: 11 })
    expect(s.events.find((e) => e.id === decayedVote.id)?.value).toBeCloseTo(-1.6, 2)
  })

  it('no passivity, S = −13.6, display −14, Passive', () => {
    expect(s.passivity.applied).toBe(false)
    expect(s.score).toBe(-13.6)
    expect(s.display).toBe(-14)
    expect(s.band).toBe('passive')
    expect(s.exact).toBeCloseTo(-13.60137, 5)
  })

  it('with A1 from the §5 formula (s = 0.30 gives −21.9, not −22), S = −13.5, still −14 Passive', () => {
    const a1 = sqrtSharePoints(0.3, -40, 1)
    expect(a1).toBe(-21.9)
    const exact = [...events.slice(1), ev('A1', '2026-03-09', a1, { country: 'DEU' })]
    const r = scoreCountry('DEU', exact, t, m)
    expect(r.score).toBe(-13.5)
    expect(r.display).toBe(-14)
    expect(r.band).toBe('passive')
  })
})

describe('bands are read from the rounded integer (docs/02 §7)', () => {
  it.each([
    [-100, 'sustaining'],
    [-51, 'sustaining'],
    [-50, 'enabling'],
    [-21, 'enabling'],
    [-20, 'passive'],
    [0, 'passive'],
    [1, 'acting'],
    [40, 'acting'],
    [41, 'confronting'],
    [100, 'confronting'],
  ])('%i → %s', (display, band) => {
    expect(bandFor(m, display).id).toBe(band)
  })

  it('reads the band after rounding: −50.5 → −51 Sustaining, 40.5 → 41 Confronting, 0.4 → 0 Passive', () => {
    const c = (x: number) => combine({ A: x, B: 0, C: 0, D: 0 }, 0, m)
    expect(c(-50.5)).toMatchObject({ display: -51, band: 'sustaining' })
    expect(c(-50.4)).toMatchObject({ display: -50, band: 'enabling' })
    expect(c(40.5)).toMatchObject({ display: 41, band: 'confronting' })
    expect(c(40.4)).toMatchObject({ display: 40, band: 'acting' })
    expect(c(0.4)).toMatchObject({ display: 0, band: 'passive' })
    expect(c(-20.5)).toMatchObject({ display: -21, band: 'enabling' })
  })

  it('rejects a score outside every band or not an integer', () => {
    expect(() => bandFor(m, 101)).toThrow(RangeError)
    expect(() => bandFor(m, 0.5)).toThrow(RangeError)
  })
})

describe('rounding of −0.5 and 0.5 through the engine', () => {
  // B9 +5 corroborated = 3.5 (qualifies, so no passivity).
  const b9 = ev('B9', '2025-05-01', 5, { confidence: 'corroborated' })

  it('S = 0.5 → display 1, Acting', () => {
    const s = scoreCountry('TST', [b9, ev('A2', '2025-01-01', -3)], '2025-06-01', m)
    expect(s.exact).toBeCloseTo(0.5, 12)
    expect(s).toMatchObject({ score: 0.5, display: 1, band: 'acting' })
  })

  it('S = −0.5 → display −1, Passive', () => {
    const s = scoreCountry('TST', [b9, ev('A1', '2025-03-10', -4)], '2025-06-01', m)
    expect(s.exact).toBeCloseTo(-0.5, 12)
    expect(s).toMatchObject({ score: -0.5, display: -1, band: 'passive' })
  })

  it('display is rounded from full precision, not from the one-decimal score', () => {
    // S = −0.46: one decimal gives −0.5, but the integer is read from S itself: 0, not −1.
    const r = combine({ A: -0.46, B: 0, C: 0, D: 0 }, 0, m)
    expect(r).toMatchObject({ score: -0.5, display: 0, band: 'passive' })
  })
})

describe('scoreCountry', () => {
  it('keeps only the events of the country and lists them by date then id', () => {
    const mine = [ev('C5', '2025-02-01', 5), ev('C5', '2025-01-01', 5)]
    const other = ev('C5', '2025-01-01', 5, { country: 'FRA' })
    const s = scoreCountry('TST', [...mine, other], '2025-03-01', m)
    expect(s.events.map((e) => e.id)).toEqual([mine[1]?.id, mine[0]?.id])
    expect(s.categories.C.raw).toBe(10)
    expect(s).toMatchObject({ country: 'TST', date: '2025-03-01', methodology: m.version })
  })

  it('throws on a duplicate event id', () => {
    const a = ev('C5', '2025-02-01', 5)
    expect(() => scoreCountry('TST', [a, { ...a }], '2025-03-01', m)).toThrow(/duplicate/)
  })

  it('gives every event its reason', () => {
    const events = [
      ev('C5', '2025-01-01', 5, { id: 'evt_a' }),
      ev('C5', '2025-01-01', 5, { id: 'evt_b', status: 'draft' }),
      ev('C5', '2025-01-01', 5, { id: 'evt_c', scope: ['region'] }),
      ev('C5', '2026-01-01', 5, { id: 'evt_d' }),
      ev('A6', '2024-01-01', 10, { id: 'evt_e', end: '2024-06-01' }),
      ev('C5', '2022-12-01', 5, { id: 'evt_f' }),
    ]
    const reasons = Object.fromEntries(
      scoreCountry('TST', events, '2025-06-01', m).events.map((e) => [e.id, e.reason]),
    )
    expect(reasons).toEqual({
      evt_a: 'counted',
      evt_b: 'not-published',
      evt_c: 'out-of-scope',
      evt_d: 'not-yet',
      evt_e: 'ended',
      evt_f: 'expired',
    })
  })
})
