import { describe, expect, it } from 'vitest'
import { atLeast, clip, roundHalfAwayFromZero, snap, sum, tenthsDelta } from './numeric.js'

describe('roundHalfAwayFromZero (docs/02 §7)', () => {
  it('rounds −0.5 to −1 and 0.5 to 1', () => {
    expect(roundHalfAwayFromZero(-0.5)).toBe(-1)
    expect(roundHalfAwayFromZero(0.5)).toBe(1)
  })

  it('rounds other halves away from zero and non-halves to the nearest integer', () => {
    expect(roundHalfAwayFromZero(-13.5)).toBe(-14)
    expect(roundHalfAwayFromZero(13.5)).toBe(14)
    expect(roundHalfAwayFromZero(-13.6)).toBe(-14)
    expect(roundHalfAwayFromZero(-13.4)).toBe(-13)
    expect(roundHalfAwayFromZero(2.5)).toBe(3)
    expect(roundHalfAwayFromZero(-2.5)).toBe(-3)
    expect(roundHalfAwayFromZero(0.49)).toBe(0)
  })

  it('never returns −0', () => {
    expect(Object.is(roundHalfAwayFromZero(-0.4), 0)).toBe(true)
    expect(Object.is(roundHalfAwayFromZero(-0.04, 1), 0)).toBe(true)
    expect(Object.is(roundHalfAwayFromZero(-0), 0)).toBe(true)
  })

  it('is not moved off a half by binary floating-point noise', () => {
    // 0.7 · 3 − 1.6 is 0.5 on paper and 0.49999999999999956 in binary.
    const x = 0.7 * 3 - 1.6
    expect(x).not.toBe(0.5)
    expect(roundHalfAwayFromZero(x)).toBe(1)
    expect(roundHalfAwayFromZero(-x)).toBe(-1)
    // 0.1 + 0.2 − 0.35 is −0.05 on paper: one decimal rounds it to −0.1.
    expect(roundHalfAwayFromZero(0.1 + 0.2 - 0.35, 1)).toBe(-0.1)
  })

  it('keeps real differences from a half, down to 1e-7', () => {
    expect(roundHalfAwayFromZero(0.4999999)).toBe(0)
    expect(roundHalfAwayFromZero(-0.4999999)).toBe(0)
  })

  it('rounds to one decimal', () => {
    expect(roundHalfAwayFromZero(-13.60137, 1)).toBe(-13.6)
    expect(roundHalfAwayFromZero(-21.908902, 1)).toBe(-21.9)
    expect(roundHalfAwayFromZero(1.25, 1)).toBe(1.3)
    expect(roundHalfAwayFromZero(-1.25, 1)).toBe(-1.3)
  })

  it('rejects non-finite values and bad decimals', () => {
    expect(() => roundHalfAwayFromZero(Number.NaN)).toThrow(RangeError)
    expect(() => roundHalfAwayFromZero(Number.POSITIVE_INFINITY)).toThrow(RangeError)
    expect(() => roundHalfAwayFromZero(1, -1)).toThrow(RangeError)
    expect(() => roundHalfAwayFromZero(1, 0.5)).toThrow(RangeError)
  })
})

describe('clip and helpers', () => {
  it('clips with optional bounds and writes −0 as 0', () => {
    expect(clip(-50, -45, 30)).toBe(-45)
    expect(clip(35, -45, 30)).toBe(30)
    expect(clip(-20, -15, null)).toBe(-15)
    expect(clip(20, null, 10)).toBe(10)
    expect(clip(1e9, null, null)).toBe(1e9)
    expect(Object.is(clip(-0, -1, 1), 0)).toBe(true)
  })

  it('compares up to 1e-9', () => {
    expect(atLeast(2 - 1e-12, 2)).toBe(true)
    expect(atLeast(1.99, 2)).toBe(false)
    expect(snap(0.1 + 0.2)).toBeCloseTo(0.3, 12)
    expect(sum([])).toBe(0)
    expect(tenthsDelta(-13.6, -13.5)).toBe(0.1)
    expect(tenthsDelta(3, 3)).toBe(0)
  })
})
