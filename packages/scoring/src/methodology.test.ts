import type {
  Assessment,
  BandsFile,
  CategoriesFile,
  ConfidenceFile,
  Country,
  DecayFile,
  Event,
  IndicatorsFile,
  PassivityFile,
} from '@gai/schema'
import { WINDOW_START as SCHEMA_WINDOW_START } from '@gai/schema'
import { describe, expect, it } from 'vitest'
import { compileMethodology, type MethodologyFilesInput } from './methodology.js'
import { methodology, methodologyRc1, repoFiles } from './test-helpers.js'
import {
  type ScoringAssessment,
  type ScoringCountry,
  type ScoringEvent,
  WINDOW_START,
} from './types.js'

const m = methodology()

describe('schema compatibility', () => {
  it('records and methodology files parsed by @gai/schema are engine inputs as they are', () => {
    // Compile-time check (pnpm typecheck): each assignment fails to compile if the shapes drift.
    const records = (
      e: Event,
      c: Country,
      a: Assessment,
    ): [ScoringEvent, ScoringCountry, ScoringAssessment] => [e, c, a]
    const files = (
      indicators: IndicatorsFile,
      categories: CategoriesFile,
      bands: BandsFile,
      confidence: ConfidenceFile,
      decay: DecayFile,
      passivity: PassivityFile,
    ): MethodologyFilesInput => ({ indicators, categories, bands, confidence, decay, passivity })
    expect(typeof records).toBe('function')
    expect(typeof files).toBe('function')
  })

  it('shares the window start with the schema package (docs/02 §1)', () => {
    expect(WINDOW_START).toBe(SCHEMA_WINDOW_START)
    expect(m.windowStart).toBe('2023-10-07')
  })
})

describe('the compiled repository methodology agrees with docs/02', () => {
  it('34 indicators, 31 scored', () => {
    expect(m.indicators).toHaveLength(34)
    expect(m.scoredIndicatorIds).toHaveLength(31)
    expect(m.version).toMatch(/^1\.0\.0/)
  })

  it('category caps (§7) and the score clip', () => {
    expect(m.categories.map((c) => [c.id, c.cap.min, c.cap.max, c.scored])).toEqual([
      ['A', -45, 30, true],
      ['B', -40, 45, true],
      ['C', -20, 20, true],
      ['D', -15, 25, true],
      ['E', -10, 10, false],
    ])
    expect(m.scoreClip).toEqual({ min: -100, max: 100 })
  })

  it('bands (§7)', () => {
    expect(m.bands.map((b) => [b.id, b.min, b.max])).toEqual([
      ['sustaining', -100, -51],
      ['enabling', -50, -21],
      ['passive', -20, 0],
      ['acting', 1, 40],
      ['confronting', 41, 100],
    ])
  })

  it('confidence weights (§4) and decay (§3)', () => {
    expect(m.confidenceWeights).toEqual({
      confirmed: 1,
      corroborated: 0.7,
      reported: 0.4,
      disputed: 0.4,
    })
    expect(m.decay).toEqual({
      appliesTo: ['repeatable'],
      plateauDays: 365,
      endDays: 730,
      endWeight: 0.25,
    })
  })

  it('indicator-level caps (§2)', () => {
    const caps = Object.fromEntries(
      m.indicators.filter((i) => i.cap !== null).map((i) => [i.id, i.cap]),
    )
    expect(caps).toEqual({
      A5: { min: -15, max: null },
      A8: { min: null, max: 10 },
      B1: { min: -15, max: 15 },
      B9: { min: null, max: 10 },
      B10: { min: -10, max: null },
    })
    // 1.0.0-rc.2 (B-23): B1 is capped at the passivity penalty, in both directions.
    expect(m.indicatorById.get('B1')?.cap).toEqual({
      min: -m.passivity.points,
      max: m.passivity.points,
    })
  })

  it('stacking and supersede rules (§2)', () => {
    const rule = (id: string) => m.indicatorById.get(id)?.stacking
    for (const id of ['B8', 'B12', 'C1', 'C4', 'D3']) expect(rule(id), id).toBe('most_severe')
    // 1.0.0-rc.2 (B-22, B-51): the standing indicators that summed in rc.1.
    for (const id of ['A3', 'A6', 'A7', 'B3', 'B7', 'D2']) expect(rule(id), id).toBe('most_severe')
    // 1.0.0-rc.2 (B-46, B-47): only positive contributions qualify; B8's +3 tier never does.
    expect(m.passivity.sign).toBe('positive')
    expect(m.passivity.excludedPoints).toEqual({ B8: [3] })
    expect(methodologyRc1().passivity.sign).toBe('any')
    expect(methodologyRc1().passivity.excludedPoints).toEqual({})
    expect(rule('B11')).toBe('one_per_tier')
    expect(rule('B5')).toBe('latest_position')
    expect(m.indicatorById.get('B6')?.group).toEqual(['B5', 'B6'])
    expect(m.indicatorById.get('A6')?.supersededBy).toEqual(['A7'])
    expect(m.indicatorById.get('B2')?.notApplicable).toBe('unsc_non_member')
  })

  it('event types (§3)', () => {
    const byType = (t: string) => m.indicators.filter((i) => i.type === t).map((i) => i.id)
    expect(byType('computed')).toEqual(['A1', 'A2', 'A4', 'C3', 'D1'])
    expect(byType('standing')).toEqual([
      'A3',
      'A6',
      'A7',
      'B3',
      'B5',
      'B6',
      'B7',
      'B8',
      'B11',
      'B12',
      'C1',
      'C2',
      'C4',
      'D2',
      'D3',
    ])
  })
})

describe('compileMethodology refuses what it cannot score unambiguously', () => {
  type Raw = {
    indicators: { indicators: Record<string, unknown>[] }
    categories: { categories: Record<string, unknown>[] }
    bands: { bands: Record<string, unknown>[] }
    confidence: { levels: Record<string, unknown>[] }
    decay: Record<string, unknown>
    passivity: Record<string, unknown>
    thresholds: { formulas: Record<string, Record<string, unknown>> }
  }
  const byId = (f: Raw, id: string) =>
    f.indicators.indicators.find((i) => i.id === id) as Record<string, unknown>
  const broken = (mutate: (f: Raw) => void) => {
    const f = repoFiles() as unknown as Raw
    mutate(f)
    return () => compileMethodology(f as unknown as MethodologyFilesInput)
  }
  const cases: [string, (f: Raw) => void, RegExp][] = [
    ['a missing category', (f) => f.categories.categories.splice(2, 1), /category C/],
    [
      'category E scored',
      (f) => Object.assign(f.categories.categories[4] as object, { scored: true }),
      /E is scored/,
    ],
    [
      'a duplicate indicator',
      (f) => f.indicators.indicators.push({ ...(f.indicators.indicators[0] as object) }),
      /listed twice/,
    ],
    [
      'an unknown category',
      (f) => Object.assign(f.indicators.indicators[0] as object, { category: 'F' }),
      /unknown category/,
    ],
    [
      'an unscored indicator in a scored category',
      (f) => Object.assign(f.indicators.indicators[0] as object, { scored: false }),
      /unscored/,
    ],
    [
      'an unknown superseded_by',
      (f) => Object.assign(f.indicators.indicators[5] as object, { superseded_by: ['A9'] }),
      /unknown indicator A9/,
    ],
    [
      'a band gap',
      (f) => Object.assign(f.bands.bands[1] as object, { min: -49 }),
      /gap or overlap/,
    ],
    [
      'bands short of the scale',
      (f) => Object.assign(f.bands.bands[4] as object, { max: 99 }),
      /cover/,
    ],
    ['a missing confidence level', (f) => f.confidence.levels.pop(), /disputed/],
    [
      'a decay that ends before its plateau',
      (f) => Object.assign(f.decay, { end_days: 300 }),
      /end_days/,
    ],
    [
      'a passivity indicator that does not exist',
      (f) => Object.assign(f.passivity, { qualifying_indicators: ['B13'] }),
      /B13/,
    ],
    [
      'a latest_position group that disagrees',
      (f) => {
        const b6 = f.indicators.indicators.find((i) => i.id === 'B6') as Record<string, unknown>
        b6.stacking = { rule: 'latest_position', group: ['B6', 'B7'] }
      },
      /group|B7/,
    ],
    [
      'one_per_tier without tiers',
      (f) => {
        const b7 = f.indicators.indicators.find((i) => i.id === 'B7') as Record<string, unknown>
        b7.stacking = { rule: 'one_per_tier' }
      },
      /one_per_tier/,
    ],
    // P-19: the remaining refusals, so that a malformed methodology version cannot compile.
    [
      'a category cap that excludes 0',
      (f) => Object.assign(f.categories.categories[0] as object, { cap: { min: 5, max: 40 } }),
      /cap must contain 0/,
    ],
    [
      'a scored indicator in the unscored category E',
      (f) => Object.assign(byId(f, 'E1'), { scored: true }),
      /scored in unscored category E/,
    ],
    [
      'a latest_position group without the indicator itself',
      (f) => {
        byId(f, 'B6').stacking = { rule: 'latest_position', group: ['B7'] }
      },
      /does not include it/,
    ],
    [
      'a band with fractional bounds',
      (f) => Object.assign(f.bands.bands[2] as object, { max: 15.5 }),
      /integer bounds/,
    ],
    [
      'a confidence weight above 1',
      (f) => Object.assign(f.confidence.levels[0] as object, { weight: 1.5 }),
      /must lie in \[0, 1\]/,
    ],
    [
      'a decay in fractional days',
      (f) => Object.assign(f.decay, { plateau_days: 364.5 }),
      /whole days/,
    ],
    [
      'a passivity window of zero days',
      (f) => Object.assign(f.passivity, { window_days: 0 }),
      /window_days/,
    ],
    [
      'a no_data_before on an unknown indicator',
      (f) => Object.assign(f.thresholds.formulas.a1 as object, { indicator: 'A99' }),
      /unknown indicator A99/,
    ],
    [
      'a no_data_before that is not a date',
      (f) => Object.assign(f.thresholds.formulas.a1 as object, { no_data_before: '2024-02-30' }),
      /not a date/,
    ],
  ]
  it.each(cases)('%s', (_, mutate, message) => {
    expect(broken(mutate)).toThrow(message)
  })

  it('compiles the untouched files', () => {
    expect(() => compileMethodology(repoFiles())).not.toThrow()
  })
})
