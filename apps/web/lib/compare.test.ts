import { describe, expect, it } from 'vitest'
import { compareStyle, spreadLabels } from './compare'

describe('compare helpers', () => {
  it('spreads colliding labels and keeps order', () => {
    expect(spreadLabels([100, 102, 300], 14, 0, 320)).toEqual([100, 114, 300])
    expect(spreadLabels([318, 316], 14, 0, 320)).toEqual([320, 306])
  })
  it('refuses a sixth country', () => {
    expect(compareStyle(4).cls).toBe('cmp-5')
    expect(() => compareStyle(5)).toThrow()
  })
})
