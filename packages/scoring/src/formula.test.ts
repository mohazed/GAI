import { loadMethodology } from '@gai/schema'
import { describe, expect, it } from 'vitest'
import {
  formulaPoints,
  percentOfGni,
  ratioGatedTierPoints,
  sqrtSharePoints,
  tierPoints,
} from './formula.js'
import { REPO_ROOT } from './test-helpers.js'

const formulas = loadMethodology(REPO_ROOT).thresholds?.value.formulas ?? {}
const f = (key: string) => {
  const formula = formulas[key]
  if (formula === undefined) throw new Error(`no formula ${key}`)
  return formula
}

describe('computed indicators (docs/02 §5)', () => {
  it('A1: −40 × √s, rounded to one decimal', () => {
    expect(sqrtSharePoints(0.3, -40, 1)).toBe(-21.9)
    expect(sqrtSharePoints(0.01, -40, 1)).toBe(-4)
    expect(sqrtSharePoints(1, -40, 1)).toBe(-40)
    expect(Object.is(sqrtSharePoints(0, -40, 1), 0)).toBe(true)
    expect(formulaPoints(f('a1'), 0.0625)).toBe(-10)
    expect(() => sqrtSharePoints(1.1, -40, 1)).toThrow(RangeError)
    expect(() => sqrtSharePoints(-0.1, -40, 1)).toThrow(RangeError)
  })

  it('A2: tiers on V in USD', () => {
    const a2 = f('a2')
    expect(formulaPoints(a2, 100_000_000)).toBe(-25)
    expect(formulaPoints(a2, 99_999_999)).toBe(-15)
    expect(formulaPoints(a2, 10_000_000)).toBe(-15)
    expect(formulaPoints(a2, 1_000_000)).toBe(-8)
    expect(formulaPoints(a2, 100_000)).toBe(-3)
    expect(formulaPoints(a2, 99_999)).toBe(0)
    expect(formulaPoints(a2, 0)).toBe(0)
  })

  it('A4: tiers on TIV, > 0 gives −2', () => {
    const a4 = f('a4')
    expect(formulaPoints(a4, 500)).toBe(-15)
    expect(formulaPoints(a4, 100)).toBe(-10)
    expect(formulaPoints(a4, 10)).toBe(-5)
    expect(formulaPoints(a4, 0.1)).toBe(-2)
    expect(formulaPoints(a4, 0)).toBe(0)
  })

  it('C3: tiers on T only when T / T(2022) ≥ 0.9', () => {
    const c3 = f('c3')
    expect(formulaPoints(c3, 1_500_000_000, 1_600_000_000)).toBe(-5)
    expect(formulaPoints(c3, 1_440_000_000, 1_600_000_000)).toBe(-5)
    expect(formulaPoints(c3, 1_439_999_999, 1_600_000_000)).toBe(0)
    expect(formulaPoints(c3, 12_000_000_000, 10_000_000_000)).toBe(-8)
    expect(formulaPoints(c3, 9_000_000, 9_000_000)).toBe(0)
    expect(formulaPoints(c3, 10_000_000, 0)).toBe(-2)
    expect(ratioGatedTierPoints(0, 0, 0.9, [], 0)).toBe(0)
    expect(() => formulaPoints(c3, 1)).toThrow(RangeError)
  })

  it('D1: x = F / GNI in percent; tiers 0.0100 % → +12 … > 0 → +1', () => {
    const d1 = f('d1')
    const gni = 4_000_000_000_000
    expect(formulaPoints(d1, percentOfGni(400_000_000, gni))).toBe(12)
    expect(formulaPoints(d1, percentOfGni(399_999_999, gni))).toBe(9)
    expect(formulaPoints(d1, percentOfGni(200_000_000, gni))).toBe(9)
    expect(formulaPoints(d1, percentOfGni(80_000_000, gni))).toBe(6)
    expect(formulaPoints(d1, percentOfGni(20_000_000, gni))).toBe(3)
    expect(formulaPoints(d1, percentOfGni(19_999_999, gni))).toBe(1)
    expect(formulaPoints(d1, percentOfGni(1, gni))).toBe(1)
    expect(formulaPoints(d1, percentOfGni(0, gni))).toBe(0)
    expect(() => percentOfGni(1, 0)).toThrow(RangeError)
  })

  it('tiers refuse a negative or non-finite measure', () => {
    expect(() => tierPoints(-1, [], 0)).toThrow(RangeError)
    expect(() => tierPoints(Number.NaN, [], 0)).toThrow(RangeError)
  })
})
