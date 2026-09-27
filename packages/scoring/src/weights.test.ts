import { describe, expect, it } from 'vitest'
import { combine, scoreCountry } from './score.js'
import { ev, methodology } from './test-helpers.js'
import { formatWeights, isDefaultWeights, parseWeights, userScore } from './weights.js'

const m = methodology()

describe('user weights (docs/02 §9): S_user = clip(Σ_k w_k · clip_k − passivity, −100, 100)', () => {
  // A −45 (clipped from −55), B +10, C −5, D +12, no passivity (B9 qualifies).
  const events = [
    ev('A1', '2024-03-11', -40),
    ev('A3', '2023-10-07', -15),
    ev('B9', '2025-05-01', 5),
    ev('B9', '2025-05-02', 5),
    ev('C3', '2025-01-01', -5),
    ev('D1', '2025-05-01', 12, { end: '2025-07-01' }),
  ]
  const s = scoreCountry('TST', events, '2025-06-01', m)

  it('defaults to 1 and reproduces S', () => {
    expect(s.categories.A).toMatchObject({ raw: -55, clipped: -45 })
    expect(s.exact).toBe(-45 + 10 - 5 + 12)
    expect(userScore(s, {}, m).exact).toBe(s.exact)
    expect(userScore(s, { A: 1, B: 1, C: 1, D: 1 }, m)).toEqual(
      combine({ A: -45, B: 10, C: -5, D: 12 }, 0, m),
    )
  })

  it('weights of 0 remove a category', () => {
    expect(userScore(s, { A: 0 }, m).exact).toBe(10 - 5 + 12)
    expect(userScore(s, { A: 0, B: 0, C: 0, D: 0 }, m)).toMatchObject({
      exact: 0,
      display: 0,
      band: 'passive',
    })
  })

  it('weights of 2 double a clipped subtotal (the cap applies before the weight)', () => {
    expect(userScore(s, { A: 2 }, m).exact).toBe(-90 + 10 - 5 + 12)
    expect(userScore(s, { A: 2, B: 2, C: 2, D: 2 }, m).exact).toBe(2 * (-45 + 10 - 5 + 12))
  })

  it('weights never touch the passivity penalty, and S_user is clipped to [−100, 100]', () => {
    const passive = scoreCountry(
      'TST',
      [ev('A1', '2024-03-11', -40), ev('A3', '2023-10-07', -15)],
      '2025-06-01',
      m,
    )
    expect(passive.passivity.applied).toBe(true)
    expect(userScore(passive, { A: 0 }, m).exact).toBe(-15)
    expect(userScore(passive, { A: 2 }, m)).toMatchObject({
      raw: -105,
      exact: -100,
      display: -100,
      band: 'sustaining',
    })
  })

  it('rejects weights outside [0, 2]', () => {
    expect(() => userScore(s, { A: 2.1 }, m)).toThrow(RangeError)
    expect(() => userScore(s, { B: -0.1 }, m)).toThrow(RangeError)
    expect(() => userScore(s, { C: Number.NaN }, m)).toThrow(RangeError)
  })
})

describe('?w=A,B,C,D with one-decimal values', () => {
  it('formats four one-decimal values', () => {
    expect(formatWeights({})).toBe('1.0,1.0,1.0,1.0')
    expect(formatWeights({ A: 0, B: 1.5, D: 2 })).toBe('0.0,1.5,1.0,2.0')
  })

  it('parses one-decimal and integer values in [0, 2]', () => {
    expect(parseWeights('1.0,1.5,0.0,2.0')).toEqual({ A: 1, B: 1.5, C: 0, D: 2 })
    expect(parseWeights('1,1,1,1')).toEqual({ A: 1, B: 1, C: 1, D: 1 })
    expect(parseWeights(formatWeights({ A: 0.3, B: 1.7, C: 0.1, D: 1.9 }))).toEqual({
      A: 0.3,
      B: 1.7,
      C: 0.1,
      D: 1.9,
    })
  })

  it('refuses anything else', () => {
    for (const bad of [
      '',
      '1,1,1',
      '1,1,1,1,1',
      '2.1,1,1,1',
      '3,1,1,1',
      '1.25,1,1,1',
      '-1,1,1,1',
      'a,b,c,d',
      ' 1,1,1,1',
    ]) {
      expect(parseWeights(bad)).toBeNull()
    }
    expect(parseWeights(null)).toBeNull()
    expect(parseWeights(undefined)).toBeNull()
  })

  it('recognises the defaults', () => {
    expect(isDefaultWeights({ A: 1, B: 1, C: 1, D: 1 })).toBe(true)
    expect(isDefaultWeights({ A: 1, B: 1, C: 1, D: 0.9 })).toBe(false)
  })
})
