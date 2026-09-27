import { describe, expect, it } from 'vitest'
import { compareQuery, compareStyle, parseCompare, spreadLabels } from './compare'

describe('compare helpers', () => {
  it('spreads colliding labels and keeps order', () => {
    expect(spreadLabels([100, 102, 300], 14, 0, 320)).toEqual([100, 114, 300])
    expect(spreadLabels([318, 316], 14, 0, 320)).toEqual([320, 306])
  })
  it('refuses a sixth country', () => {
    expect(compareStyle(4).cls).toBe('cmp-5')
    expect(() => compareStyle(5)).toThrow()
  })
  it('reads ?c=: scored countries, in order, once, at most five', () => {
    const scored = new Set(['DEU', 'FRA', 'ESP', 'ITA', 'IRL', 'NOR'])
    expect(parseCompare(null, scored)).toEqual({ kept: [], dropped: [] })
    expect(parseCompare('deu, FRA,DEU,,ISR', scored)).toEqual({
      kept: ['DEU', 'FRA'],
      dropped: ['ISR'],
    })
    expect(parseCompare('DEU,FRA,ESP,ITA,IRL,NOR', scored)).toEqual({
      kept: ['DEU', 'FRA', 'ESP', 'ITA', 'IRL'],
      dropped: ['NOR'],
    })
  })
  it('writes ?c= and ?w= with plain commas', () => {
    expect(compareQuery([], null)).toBe('')
    expect(compareQuery(['DEU', 'FRA'], null)).toBe('?c=DEU,FRA')
    expect(compareQuery(['DEU'], '2.0,1.0,1.0,0.5')).toBe('?c=DEU&w=2.0,1.0,1.0,0.5')
    expect(compareQuery([], '2.0,1.0,1.0,0.5')).toBe('?w=2.0,1.0,1.0,0.5')
  })
})
