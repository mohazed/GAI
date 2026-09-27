import { describe, expect, it } from 'vitest'
import { groupEvidence, parseCsvLine, rowUrl, tableRow } from './structured-row'

const FTS =
  'DEU,2025-09-01,2026-08-31,105066282,1186;1156;1273;1510,2026-09-27T11:14:55Z,src_20260927_fts_plan-1186-p1;src_20260927_fts_locations'

describe('parseCsvLine', () => {
  it('splits plain and quoted fields', () => {
    expect(parseCsvLine('a,b,,c')).toEqual(['a', 'b', '', 'c'])
    expect(parseCsvLine('"a,b","say ""x""",c')).toEqual(['a,b', 'say "x"', 'c'])
  })
})

describe('tableRow', () => {
  it('names the values with the columns of the table', () => {
    const row = tableRow({ locator: 'row 541 of data/structured/fts_funding.csv', quote: FTS })
    expect(row?.table).toBe('fts_funding.csv')
    expect(row?.line).toBe(541)
    expect(row?.fields[0]).toEqual(['iso3', 'DEU'])
    expect(row?.fields.map(([c]) => c)).not.toContain('source')
    expect(row?.sources).toEqual(['src_20260927_fts_plan-1186-p1', 'src_20260927_fts_locations'])
  })

  it('is null for other locators, unknown tables and rows of the wrong width', () => {
    expect(tableRow({ locator: 'paragraph 2', quote: FTS })).toBeNull()
    expect(tableRow({ locator: 'row 2 of data/structured/nope.csv', quote: FTS })).toBeNull()
    expect(
      tableRow({ locator: 'row 2 of data/structured/fts_funding.csv', quote: 'a,b' }),
    ).toBeNull()
  })
})

describe('groupEvidence', () => {
  it('keeps one row per locator, the other quotes, and each source once', () => {
    const loc = 'row 541 of data/structured/fts_funding.csv'
    const g = groupEvidence([
      {
        source: 'src_a',
        quote: FTS,
        quote_lang: 'en',
        quote_en: null,
        quote_fr: null,
        locator: loc,
      },
      {
        source: 'src_b',
        quote: FTS,
        quote_lang: 'en',
        quote_en: null,
        quote_fr: null,
        locator: loc,
      },
      {
        source: 'src_c',
        quote: 'Press release text.',
        quote_lang: 'en',
        quote_en: null,
        quote_fr: null,
        locator: 'paragraph 4',
      },
    ])
    expect(g.rows).toHaveLength(1)
    expect(g.quotes.map((q) => q.source)).toEqual(['src_c'])
    expect(g.sources).toEqual(['src_a', 'src_b', 'src_c'])
  })
})

describe('rowUrl', () => {
  it('points at the line on GitHub at the build commit', () => {
    const row = tableRow({ locator: 'row 541 of data/structured/fts_funding.csv', quote: FTS })
    if (row === null) throw new Error('no row')
    expect(rowUrl('https://github.com/mohazed/GAI', 'abc', row)).toBe(
      'https://github.com/mohazed/GAI/blob/abc/data/structured/fts_funding.csv#L541',
    )
    expect(rowUrl('https://github.com/mohazed/GAI', null, row)).toBeNull()
  })
})
