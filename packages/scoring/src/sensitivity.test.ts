import { describe, expect, it } from 'vitest'
import { averageRanks, pearson, rankScores, sensitivitySuite, spearman } from './sensitivity.js'
import { ev, methodology } from './test-helpers.js'

const m = methodology()

describe('ranks and Spearman correlation', () => {
  it('gives tied values the average of their positions, highest first', () => {
    expect(averageRanks([10, 20, 20, 5])).toEqual([3, 1.5, 1.5, 4])
    expect(averageRanks([1, 1, 1])).toEqual([2, 2, 2])
    expect(averageRanks([])).toEqual([])
    // Equal up to 1e-9 is a tie.
    expect(averageRanks([0.1 + 0.2, 0.3])).toEqual([1.5, 1.5])
  })

  it('is 1 for the same order, −1 for the reverse order', () => {
    expect(spearman([1, 2, 3, 4], [10, 20, 30, 40])).toBe(1)
    expect(spearman([1, 2, 3, 4], [40, 30, 20, 10])).toBe(-1)
  })

  it('handles ties as Pearson on average ranks', () => {
    // Ranks: x [5, 4, 3, 2, 1], y [5, 4, 2.5, 1, 2.5]; ρ = 8 / √95.
    expect(spearman([1, 2, 3, 4, 5], [5, 6, 7, 8, 7])).toBeCloseTo(8 / Math.sqrt(95), 12)
  })

  it('matches 1 − 6Σd²/(n(n²−1)) when there are no ties', () => {
    const x = [3.1, -2, 7, 0, 15, -40]
    const y = [2, -1, 5, 1, 4, -3]
    const rx = averageRanks(x)
    const ry = averageRanks(y)
    const d2 = rx.reduce((s, r, i) => s + (r - (ry[i] as number)) ** 2, 0)
    const n = x.length
    expect(spearman(x, y)).toBeCloseTo(1 - (6 * d2) / (n * (n * n - 1)), 12)
  })

  it('is undefined (null) for fewer than two values or a constant list', () => {
    expect(spearman([1], [2])).toBeNull()
    expect(spearman([1, 1, 1], [1, 2, 3])).toBeNull()
    expect(pearson([], [])).toBeNull()
    expect(() => spearman([1, 2], [1])).toThrow(RangeError)
  })

  it('ranks scores highest first, ties by ISO3, with positions and fractional ranks', () => {
    const r = rankScores([
      { iso3: 'BBB', exact: -15, band: 'passive' },
      { iso3: 'AAA', exact: -15, band: 'passive' },
      { iso3: 'CCC', exact: 12.44, band: 'acting' },
    ])
    expect(r.map((e) => [e.iso3, e.position, e.rank, e.score, e.display])).toEqual([
      ['CCC', 1, 1, 12.4, 12],
      ['AAA', 2, 2.5, -15, -15],
      ['BBB', 3, 2.5, -15, -15],
    ])
  })
})

describe('sensitivity suite (docs/02 §10)', () => {
  const T = '2025-06-01'
  const countries = [
    // S = −40 + 5 = −35.
    {
      iso3: 'AAA',
      events: [
        ev('A1', '2024-03-11', -40, { country: 'AAA' }),
        ev('B9', '2025-05-01', 5, { country: 'AAA' }),
      ],
    },
    // No events: −15.
    { iso3: 'BBB', events: [] },
    // Statements only: +10; without them −15 (passivity returns).
    {
      iso3: 'CCC',
      events: [
        ev('B9', '2025-05-01', 5, { country: 'CCC' }),
        ev('B9', '2025-05-02', 5, { country: 'CCC' }),
      ],
    },
    // Three old yes votes, decayed (Δ = 517, 516, 515), and a D4 programme.
    {
      iso3: 'DDD',
      events: [
        ev('B1', '2024-01-01', 3, { country: 'DDD' }),
        ev('B1', '2024-01-02', 3, { country: 'DDD' }),
        ev('B1', '2024-01-03', 3, { country: 'DDD' }),
        ev('D4', '2025-05-01', 5, { country: 'DDD' }),
      ],
    },
    // A reported divestment: 5 · 0.4 = 2, which just qualifies.
    {
      iso3: 'EEE',
      events: [ev('C5', '2025-05-01', 5, { country: 'EEE', confidence: 'reported' })],
    },
  ]
  const suite = sensitivitySuite(countries, T, m)
  const table = (id: string) => suite.tables.find((t) => t.id === id)
  const variant = (tableId: string, id: string) => table(tableId)?.variants.find((v) => v.id === id)
  const exactOf = (tableId: string, id: string, iso3: string) =>
    variant(tableId, id)?.ranking.find((e) => e.iso3 === iso3)?.exact

  it('has the five tables and every variant', () => {
    expect(suite.tables.map((t) => [t.id, t.variants.map((v) => v.id)])).toEqual([
      ['passivity', ['passivity-5', 'passivity-15', 'passivity-25']],
      [
        'weights',
        [
          'weight-A-0.5',
          'weight-A-1.5',
          'weight-B-0.5',
          'weight-B-1.5',
          'weight-C-0.5',
          'weight-C-1.5',
          'weight-D-0.5',
          'weight-D-1.5',
        ],
      ],
      ['confidence', ['reported-0.2', 'reported-0.6']],
      ['statements', ['statements-excluded']],
      ['decay', ['decay-off']],
    ])
    expect(suite).toMatchObject({ date: T, methodology: m.version })
  })

  it('the baseline is the default ranking', () => {
    expect(suite.baseline.map((e) => [e.iso3, e.exact])).toEqual(
      [
        ['DDD', 3 * (3 - (0.75 * (152 + 151 + 150)) / 365) + 5],
        ['CCC', 10],
        ['EEE', 2],
        ['BBB', -15],
        ['AAA', -35],
      ].map(([iso3, x]) => [iso3, expect.closeTo(x as number, 8)]),
    )
  })

  it('passivity 15 is the baseline itself (ρ = 1); 5 and 25 move only passive countries', () => {
    expect(variant('passivity', 'passivity-15')?.spearman).toBe(1)
    expect(variant('passivity', 'passivity-15')?.changedDisplay).toBe(0)
    expect(exactOf('passivity', 'passivity-5', 'BBB')).toBe(-5)
    expect(exactOf('passivity', 'passivity-25', 'BBB')).toBe(-25)
    expect(exactOf('passivity', 'passivity-25', 'AAA')).toBe(-35)
  })

  it('category weights at 0.5 and 1.5 scale the clipped subtotal', () => {
    expect(exactOf('weights', 'weight-A-0.5', 'AAA')).toBe(-20 + 5)
    expect(exactOf('weights', 'weight-A-1.5', 'AAA')).toBe(-60 + 5)
    expect(exactOf('weights', 'weight-B-1.5', 'CCC')).toBe(15)
  })

  it('reported at 0.2 and 0.6 rescore, and change who qualifies against passivity', () => {
    expect(exactOf('confidence', 'reported-0.6', 'EEE')).toBeCloseTo(3, 12)
    // 5 × 0.2 = 1 < 2: the divestment no longer qualifies.
    expect(exactOf('confidence', 'reported-0.2', 'EEE')).toBeCloseTo(1 - 15, 12)
  })

  it('statements excluded: B9/B10 at 0, and they no longer qualify', () => {
    expect(exactOf('statements', 'statements-excluded', 'CCC')).toBe(-15)
    expect(exactOf('statements', 'statements-excluded', 'AAA')).toBe(-40 - 15)
    const v = variant('statements', 'statements-excluded')
    expect(v?.spearman).toBeLessThan(1)
    expect(v?.changedDisplay).toBe(2)
  })

  it('decay off: d = 1 for every repeatable event from its date', () => {
    expect(exactOf('decay', 'decay-off', 'DDD')).toBe(9 + 5)
    expect(exactOf('decay', 'decay-off', 'CCC')).toBe(10)
  })

  it('Spearman compares each variant with the default over the same countries', () => {
    for (const t of suite.tables) {
      for (const v of t.variants) {
        expect(v.ranking).toHaveLength(countries.length)
        expect(v.spearman === null || (v.spearman >= -1 && v.spearman <= 1)).toBe(true)
        const scores = (r: typeof v.ranking) =>
          [...r].sort((a, b) => (a.iso3 < b.iso3 ? -1 : 1)).map((e) => e.exact)
        expect(v.spearman).toBe(spearman(scores(suite.baseline), scores(v.ranking)))
      }
    }
  })

  it('does not depend on the order of the countries', () => {
    expect(sensitivitySuite([...countries].reverse(), T, m)).toEqual(suite)
  })
})
