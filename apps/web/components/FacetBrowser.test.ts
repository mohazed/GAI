import { describe, expect, it } from 'vitest'
import { decodeHash, type FacetDef, type FacetItem, visibleItems } from './FacetBrowser'
import { buildAge, STALE_AFTER_DAYS } from './StaleNotice'

const facets: FacetDef[] = [
  { key: 'cty', param: 'country', label: 'Country', values: [] },
  { key: 'ind', param: 'indicator', label: 'Indicator', values: [] },
]

// Two weeks: W2 with a DEU A1 entry and a FRA B1 entry, W1 with only an unchanged count line.
const items: FacetItem[] = [
  { key: 'h2', group: 'W2', header: true, values: { cty: ['DEU', 'FRA'], ind: ['A1', 'B1'] } },
  { key: 'e1', group: 'W2', values: { cty: ['DEU'], ind: ['A1'] } },
  { key: 'e2', group: 'W2', values: { cty: ['FRA'], ind: ['B1'] } },
  { key: 'h1', group: 'W1', header: true, values: { cty: [], ind: [] } },
  { key: 'u1', group: 'W1', header: true, values: { cty: [], ind: [] } },
]

describe('FacetBrowser: which entries and week headings show', () => {
  it('shows everything without a filter', () => {
    expect(visibleItems(items, facets, { country: null, indicator: null })).toEqual([
      true,
      true,
      true,
      true,
      true,
    ])
  })
  it('keeps a week while one of its entries shows, and combines facets', () => {
    expect(visibleItems(items, facets, { country: 'DEU', indicator: null })).toEqual([
      true,
      true,
      false,
      false,
      false,
    ])
    // DEU and B1: no entry matches, so the week heading goes too (the union of its classes would
    // have kept it; with JavaScript the entries decide).
    expect(visibleItems(items, facets, { country: 'DEU', indicator: 'B1' })).toEqual([
      false,
      false,
      false,
      false,
      false,
    ])
  })
})

describe('stale build notice', () => {
  it('counts whole days from the build date, UTC, and is stale after three', () => {
    const day = 86_400_000
    const built = Date.parse('2026-09-27T00:00:00Z')
    expect(buildAge('2026-09-27', built + 23 * 3_600_000)).toBe(0)
    expect(buildAge('2026-09-27', built + 3 * day + 1)).toBe(3)
    expect(buildAge('2026-09-27', built + 4 * day)).toBeGreaterThan(STALE_AFTER_DAYS)
  })
})

describe('decodeHash (P-19)', () => {
  it('decodes a fragment and returns empty text for malformed percent-encoding', () => {
    expect(decodeHash('f-ind-A2')).toBe('f-ind-A2')
    expect(decodeHash('f-cty-C%C3%B4te')).toBe('f-cty-Côte')
    expect(decodeHash('%E0%A4%A')).toBe('')
  })
})
