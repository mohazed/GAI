import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ApiSensitivityFile, apiSchemaFor, loadMethodology } from '@gai/schema'
import {
  type CountryEvents,
  type ScoringEvent,
  type SensitivitySuite,
  sensitivitySuite,
} from '@gai/scoring'
import { describe, expect, it } from 'vitest'
import { scoringMethodology } from '../methodology.js'
import { jsonText } from './json.js'
import { sensitivityFile } from './sensitivity.js'

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..')
const m = scoringMethodology(loadMethodology(REPO_ROOT))
const T = '2025-06-01'

/** A synthetic published, gaza-scoped event (codes X.. are user-assigned, not real countries). */
const ev = (
  country: string,
  indicator: string,
  type: ScoringEvent['type'],
  date: string,
  points: number,
  confidence: ScoringEvent['confidence'] = 'confirmed',
): ScoringEvent => ({
  id: `evt_${date.replaceAll('-', '_')}_${country}_${indicator}`,
  country,
  indicator,
  type,
  date,
  end: null,
  points,
  confidence,
  scope: ['gaza'],
  status: 'published',
})

// Hand-computed at T = 2025-06-01 with methodology/v1.0.0 (passivity 15, reported weight 0.4):
const COUNTRIES: CountryEvents[] = [
  // A6 +10 standing; category A never qualifies, so passivity applies: 10 − 15 = −5 (passive).
  { iso3: 'XAA', events: [ev('XAA', 'A6', 'standing', '2024-01-01', 10)] },
  // B9 +5 a month before T: qualifies, S = 5 (acting).
  { iso3: 'XBB', events: [ev('XBB', 'B9', 'repeatable', '2025-05-01', 5)] },
  // C5 +5 reported: 5 × 0.4 = 2, which qualifies, S = 2 (acting).
  { iso3: 'XCC', events: [ev('XCC', 'C5', 'repeatable', '2025-05-01', 5, 'reported')] },
  // No events: −15 (passive).
  { iso3: 'XDD', events: [] },
]

const roundTrip = (value: unknown): unknown => JSON.parse(jsonText(value))

describe('sensitivityFile (sensitivity.json)', () => {
  const suite = sensitivitySuite(COUNTRIES, T, m)
  const file = sensitivityFile(suite, T)

  it('parses with ApiSensitivityFile after a round trip through jsonText, unchanged', () => {
    expect(ApiSensitivityFile.parse(roundTrip(file))).toEqual(file)
    expect(apiSchemaFor('sensitivity.json')).toBe(ApiSensitivityFile)
  })

  it('carries the build date, the version and the number of countries', () => {
    expect(file.build_date).toBe(T)
    expect(file.methodology).toBe(m.version)
    expect(file.n).toBe(4)
  })

  it('maps the baseline ranking to snake_case', () => {
    expect(file.baseline).toEqual([
      {
        iso3: 'XBB',
        exact: 5,
        score: 5,
        score_display: 5,
        band: 'acting',
        position: 1,
        rank: 1,
      },
      {
        iso3: 'XCC',
        exact: expect.closeTo(2, 12),
        score: 2,
        score_display: 2,
        band: 'acting',
        position: 2,
        rank: 2,
      },
      {
        iso3: 'XAA',
        exact: -5,
        score: -5,
        score_display: -5,
        band: 'passive',
        position: 3,
        rank: 3,
      },
      {
        iso3: 'XDD',
        exact: -15,
        score: -15,
        score_display: -15,
        band: 'passive',
        position: 4,
        rank: 4,
      },
    ])
  })

  it('maps a variant in full: passivity at 5 ties XAA with XBB', () => {
    // XAA 10 − 5 = 5, XDD −5. Ranks by ISO3 (XAA, XBB, XCC, XDD): baseline [3, 1, 2, 4],
    // variant [1.5, 1.5, 3, 4]; Pearson of the ranks: Σdxdy = 3, Σdx² = 5, Σdy² = 4.5.
    expect(file.tables[0]?.variants[0]).toEqual({
      id: 'passivity-5',
      params: {
        passivity_points: 5,
        weights: null,
        confidence_weights: null,
        exclude_indicators: null,
        decay: null,
      },
      spearman: expect.closeTo(3 / Math.sqrt(22.5), 12),
      changed_display: 2,
      ranking: [
        {
          iso3: 'XAA',
          exact: 5,
          score: 5,
          score_display: 5,
          band: 'acting',
          position: 1,
          rank: 1.5,
        },
        {
          iso3: 'XBB',
          exact: 5,
          score: 5,
          score_display: 5,
          band: 'acting',
          position: 2,
          rank: 1.5,
        },
        {
          iso3: 'XCC',
          exact: expect.closeTo(2, 12),
          score: 2,
          score_display: 2,
          band: 'acting',
          position: 3,
          rank: 3,
        },
        {
          iso3: 'XDD',
          exact: -5,
          score: -5,
          score_display: -5,
          band: 'passive',
          position: 4,
          rank: 4,
        },
      ],
    })
  })

  it('maps every table and every variant, in order, with the values the engine computed', () => {
    expect(file.tables.map((t) => [t.id, t.variants.map((v) => v.id)])).toEqual(
      suite.tables.map((t) => [t.id, t.variants.map((v) => v.id)]),
    )
    expect(file.tables.map((t) => t.id)).toEqual([
      'passivity',
      'weights',
      'confidence',
      'statements',
      'decay',
    ])
    expect(file.tables.flatMap((t) => t.variants)).toHaveLength(3 + 8 + 2 + 1 + 1)
    suite.tables.forEach((t, i) => {
      t.variants.forEach((v, j) => {
        const out = file.tables[i]?.variants[j]
        expect(out?.spearman).toBe(v.spearman)
        expect(out?.changed_display).toBe(v.changedDisplay)
        expect(out?.ranking).toEqual(
          v.ranking.map((e) => ({
            iso3: e.iso3,
            exact: e.exact,
            score: e.score,
            score_display: e.display,
            band: e.band,
            position: e.position,
            rank: e.rank,
          })),
        )
      })
    })
  })

  it('lists every parameter, null where the variant does not set it', () => {
    const params = (tableId: string) =>
      file.tables.find((t) => t.id === tableId)?.variants.map((v) => [v.id, v.params])
    const none = {
      passivity_points: null,
      weights: null,
      confidence_weights: null,
      exclude_indicators: null,
      decay: null,
    }
    expect(params('passivity')).toEqual(
      [5, 15, 25].map((p) => [`passivity-${p}`, { ...none, passivity_points: p }]),
    )
    const weights: [string, unknown][] = []
    for (const k of ['A', 'B', 'C', 'D']) {
      for (const w of [0.5, 1.5]) {
        const set = { A: null, B: null, C: null, D: null, [k]: w }
        weights.push([`weight-${k}-${w}`, { ...none, weights: set }])
      }
    }
    expect(params('weights')).toEqual(weights)
    expect(params('confidence')).toEqual([
      ['reported-0.2', { ...none, confidence_weights: { reported: 0.2 } }],
      ['reported-0.6', { ...none, confidence_weights: { reported: 0.6 } }],
    ])
    expect(params('statements')).toEqual([
      ['statements-excluded', { ...none, exclude_indicators: ['B9', 'B10'] }],
    ])
    expect(params('decay')).toEqual([['decay-off', { ...none, decay: 'off' }]])
  })

  it('reports the hand-computed effects of the rescored variants', () => {
    const ranking = (tableId: string, id: string) =>
      file.tables.find((t) => t.id === tableId)?.variants.find((v) => v.id === id)?.ranking
    const exact = (tableId: string, id: string, iso3: string) =>
      ranking(tableId, id)?.find((e) => e.iso3 === iso3)?.exact
    // Reported at 0.2: 5 × 0.2 = 1 < 2 no longer qualifies, so 1 − 15.
    expect(exact('confidence', 'reported-0.2', 'XCC')).toBeCloseTo(-14, 12)
    // Statements excluded: B9 at 0 and passivity returns.
    expect(exact('statements', 'statements-excluded', 'XBB')).toBe(-15)
    // Passivity at 25 moves the passive countries only; the order stays, ρ = 1.
    const p25 = file.tables[0]?.variants[2]
    expect(p25?.id).toBe('passivity-25')
    expect(p25?.spearman).toBe(1)
    expect(p25?.changed_display).toBe(2)
    expect(exact('passivity', 'passivity-25', 'XAA')).toBe(-15)
    expect(exact('passivity', 'passivity-25', 'XDD')).toBe(-25)
  })

  it('writes the same bytes whatever the order of the countries', () => {
    const reversed = sensitivityFile(sensitivitySuite([...COUNTRIES].reverse(), T, m), T)
    expect(jsonText(reversed)).toBe(jsonText(file))
  })

  it('keeps a null Spearman ρ with fewer than two countries', () => {
    const one = sensitivityFile(sensitivitySuite(COUNTRIES.slice(0, 1), T, m), T)
    expect(one.n).toBe(1)
    for (const t of one.tables) for (const v of t.variants) expect(v.spearman).toBeNull()
    expect(ApiSensitivityFile.parse(roundTrip(one))).toEqual(one)
    const none = sensitivityFile(sensitivitySuite([], T, m), T)
    expect(none).toMatchObject({ n: 0, baseline: [] })
    expect(ApiSensitivityFile.parse(roundTrip(none))).toEqual(none)
  })

  it('refuses a suite computed at another date than the build date', () => {
    const other: SensitivitySuite = { ...suite, date: '2025-05-31' }
    expect(() => sensitivityFile(other, T)).toThrow(
      'sensitivity suite computed at 2025-05-31, build date 2025-06-01',
    )
  })
})
