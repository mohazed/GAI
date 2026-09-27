import { describe, expect, it } from 'vitest'
import { urlWithWeights } from './RankingPanel'

describe('urlWithWeights', () => {
  it('writes ?w= with plain commas and keeps other parameters', () => {
    const loc = { pathname: '/en/ranking/', search: '?c=DEU', hash: '#countries' }
    expect(urlWithWeights(loc, { A: 0, B: 1.5, C: 1, D: 2 })).toBe(
      '/en/ranking/?c=DEU&w=0.0,1.5,1.0,2.0#countries',
    )
  })
  it('drops w at the default weights', () => {
    const loc = { pathname: '/en/ranking/', search: '?w=0.0,1.0,1.0,1.0', hash: '' }
    expect(urlWithWeights(loc, { A: 1, B: 1, C: 1, D: 1 })).toBe('/en/ranking/')
  })
})
