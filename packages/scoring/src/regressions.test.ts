/**
 * Regression tests for the problems found by the P-03 verification pass (independent test
 * writers and adversarial reviewers, each finding reproduced by two skeptics) and for the rules
 * added after the docs/02 ambiguity audit. Each test names the input that used to go wrong.
 */
import { describe, expect, it } from 'vitest'
import { coverage } from './coverage.js'
import { ratioGatedTierPoints } from './formula.js'
import { indicatorLabels } from './labels.js'
import { createScorer, scoreCountry } from './score.js'
import { sensitivitySuite } from './sensitivity.js'
import { lastChange } from './series.js'
import { eventCounts, latestEvent, summaryLine } from './summary.js'
import { country, ev, methodology } from './test-helpers.js'
import type { AssessmentStatus, ScoringEvent } from './types.js'
import { formatWeights } from './weights.js'

const m = methodology()
const scorer = (events: ScoringEvent[]) => createScorer('TST', events, m)

describe('last change: attributed by its effect on S, not by the indicator that moved', () => {
  it('an unscored E event on the day decay alone ticks the score is not the last change', () => {
    // B1 +3 from the window start decays from 2024-10-06; on 2024-10-15 the one-decimal score
    // moves from −12.0 to −12.1 by decay only. E1 is never summed.
    const b1 = ev('B1', '2023-10-07', 3)
    const e1 = ev('E1', '2024-10-15', 5)
    const without = lastChange(scorer([b1]), '2024-10-20')
    expect(lastChange(scorer([b1, e1]), '2024-10-20')).toEqual(without)
    expect(without).toMatchObject({ date: '2023-10-07', event: b1.id, points: 3, effect: 3 })
  })

  it('an event absorbed by a clipped category is not blamed when another event moved S', () => {
    const cappedB = [
      ev('B3', '2024-01-01', 15),
      ev('B8', '2024-01-01', 8),
      ev('B11', '2024-01-01', 10),
      ev('B11', '2024-01-02', 5),
      ev('B12', '2024-01-02', 10),
      ev('B9', '2026-05-01', 2),
    ]
    const vote = ev('B1', '2026-06-01', 3, { id: 'evt_vote' })
    const c4 = ev('C4', '2026-06-01', 2, { id: 'evt_c4' })
    const s = scorer([...cappedB, vote, c4])
    expect(s.at('2026-05-31').exact).toBe(45)
    expect(s.at('2026-06-01').exact).toBe(47)
    expect(lastChange(s, '2026-06-10')).toMatchObject({
      date: '2026-06-01',
      event: 'evt_c4',
      indicator: 'C4',
      points: 2,
      effect: 2,
      delta: 2,
    })
  })

  it('an E event starting the day a standing state ends does not hide the end', () => {
    const events = [
      ev('B9', '2026-06-01', 5),
      ev('D2', '2024-01-27', -8, { end: '2026-09-12' }),
      ev('E2', '2026-09-12', -10),
    ]
    const lc = lastChange(scorer(events), '2026-09-20')
    expect(lc).toMatchObject({ date: '2026-09-12', indicator: 'D2', change: 'end', points: 8 })
  })

  it('a same-day passivity toggle that caused most of the change is reported as passivity', () => {
    const c5 = ev('C5', '2025-01-01', 5)
    const vote = ev('B1', '2026-01-01', 3)
    const s = scorer([c5, vote])
    expect(s.at('2025-12-31').exact).toBe(5)
    expect(s.at('2026-01-01').exact).toBe(-7)
    const lc = lastChange(s, '2026-02-01')
    expect(lc).toMatchObject({ date: '2026-01-01', kind: 'passivity', effect: -15, delta: -12 })
    const line = summaryLine(
      {
        score: { display: -7, bandName: { en: 'Passive', fr: 'Passivité' } },
        events: eventCounts([c5, vote], '2026-02-01'),
        coverage: 0.1,
        lastChange: lc,
        passivityPoints: 15,
        labels: indicatorLabels(methodology()),
      },
      'en',
    )
    expect(line).toContain('Last change: 2026-01-01, passivity penalty applied (−15).')
  })

  it('an event that lifts the penalty is named, and the lift is stated', () => {
    const b9 = ev('B9', '2025-03-01', 5)
    const lc = lastChange(scorer([b9]), '2025-04-01')
    expect(lc).toMatchObject({
      kind: 'event',
      event: b9.id,
      points: 5,
      effect: 20,
      delta: 20,
      passivity: { before: true, after: false },
    })
  })
})

describe('coverage: A1 is no-data for everyone before the first post-war SIPRI release (§5)', () => {
  const assessment = (a1: AssessmentStatus) => {
    const indicators: Record<string, { status: AssessmentStatus }> = {}
    for (const id of m.scoredIndicatorIds) indicators[id] = { status: 'none-found' }
    indicators.A1 = { status: a1 }
    return { indicators }
  }
  const a1Event = ev('A1', '2024-03-11', -12, { end: null })
  const at = (a1: AssessmentStatus, date: string) =>
    coverage({ country: country(), assessment: assessment(a1), events: [a1Event], date }, m)

  it('compiles no_data_before from thresholds.yaml', () => {
    expect(m.noDataBefore).toEqual({ A1: '2024-03-11' })
  })

  it('before 2024-03-11: no-data whatever the hand-set status, and "no export data"', () => {
    for (const hand of ['none-found', 'has-events', 'unchecked'] as const) {
      const c = at(hand, '2024-03-10')
      expect(c.statuses.A1).toBe('no-data')
      expect(c.noExportData).toBe(true)
      expect(c.overrides).toContainEqual({
        indicator: 'A1',
        from: hand,
        to: 'no-data',
        reason: 'before-first-release',
      })
    }
  })

  it('from 2024-03-11: the release is published and A1 has events', () => {
    expect(at('none-found', '2024-03-11').statuses.A1).toBe('has-events')
    expect(at('none-found', '2024-03-11').noExportData).toBe(false)
  })
})

describe('states dated before the window count from the window start', () => {
  it('a standing state dated 2009 holds from 2023-10-07 and qualifies until 2024-10-05', () => {
    const b12 = ev('B12', '2009-01-16', 8)
    const s = scorer([b12])
    expect(s.at('2023-10-07')).toMatchObject({ exact: 8 })
    expect(s.at('2024-10-05').passivity.applied).toBe(false)
    expect(s.at('2024-10-06').passivity.applied).toBe(true)
    expect(s.at('2024-10-06').exact).toBe(8 - 15)
    expect(lastChange(s, '2024-01-01')).toMatchObject({ date: '2023-10-07', event: b12.id })
  })

  it('a repeatable event keeps its own date and decays from it (the validator rejects it anyway)', () => {
    const vote = ev('B1', '2023-01-01', 3)
    // 2024-01-10 is 374 days after 2023-01-01: already decaying, not on a fresh plateau.
    expect(scoreCountry('TST', [vote], '2024-01-10', m).events[0]?.factor).toBeCloseTo(
      1 - (0.75 * 9) / 365,
      9,
    )
  })
})

describe('computed values: one release holds at a time', () => {
  it('throws when two computed values of one indicator overlap', () => {
    const a = ev('D1', '2026-08-01', 6, { end: '2026-09-15' })
    const b = ev('D1', '2026-09-01', 9, { end: null })
    expect(() => scorer([a, b])).toThrow(/overlap/)
    const open = ev('A1', '2024-03-11', -12, { end: null })
    const next = ev('A1', '2025-03-10', -8, { end: null })
    expect(() => scorer([open, next])).toThrow(/A1/)
  })

  it('accepts a value that ends where the next starts, and ignores unpublished values', () => {
    const a = ev('D1', '2026-08-01', 6, { end: '2026-09-01' })
    const b = ev('D1', '2026-09-01', 9, { end: null })
    expect(() => scorer([a, b])).not.toThrow()
    const draft = ev('D1', '2026-08-15', 3, { end: null, status: 'draft' })
    expect(() => scorer([a, b, draft])).not.toThrow()
  })
})

describe('numerics and immutability', () => {
  it('a sum equal to a cap on paper is exactly the cap and not reported as capped', () => {
    const b9 = [
      ev('B9', '2025-05-31', 5, { confidence: 'reported' }),
      ev('B9', '2025-05-30', 5),
      ev('B9', '2025-05-29', 2, { confidence: 'corroborated' }),
      ev('B9', '2025-05-28', 2, { confidence: 'reported' }),
      ev('B9', '2025-05-27', 2, { confidence: 'reported' }),
    ]
    for (const events of [b9, [...b9].reverse()]) {
      const r = scoreCountry('TST', events, '2025-06-01', m).indicators.find((i) => i.id === 'B9')
      expect(r).toMatchObject({ raw: 10, value: 10, capped: false })
    }
  })

  it('the compiled methodology is frozen all the way down', () => {
    const a = m.categories[0]
    expect(Object.isFrozen(a?.cap)).toBe(true)
    expect(Object.isFrozen(a?.name)).toBe(true)
    expect(Object.isFrozen(m.indicatorById.get('A5')?.cap)).toBe(true)
    expect(Object.isFrozen(m.indicatorById.get('B11')?.tiers)).toBe(true)
    expect('set' in m.indicatorById).toBe(false)
  })

  it('changing a result or the options object does not change later scores', () => {
    const events = [ev('A3', '2024-01-01', -15), ev('A5', '2024-06-01', -5)]
    const first = scoreCountry('TST', events, '2024-07-01', m)
    ;(first.categories.A.cap as { min: number }).min = -10
    expect(scoreCountry('TST', events, '2024-07-01', m).categories.A.clipped).toBe(-20)

    const options: { decay: 'on' | 'off'; passivityPoints: number } = {
      decay: 'on',
      passivityPoints: 15,
    }
    const s = createScorer('TST', [ev('B1', '2023-11-01', 3)], m, options)
    const before = s.at('2025-06-01').exact
    options.decay = 'off'
    options.passivityPoints = 25
    expect(s.at('2025-06-01').exact).toBe(before)
  })

  it('transitionsOn returns a fresh array', () => {
    const s = scorer([ev('B9', '2024-01-01', 5)])
    const day = s.transitionDays()[0] as number
    ;(s.transitionsOn(day) as unknown[]).length = 0
    expect(s.transitionsOn(day)).toHaveLength(1)
  })
})

describe('smaller fixes', () => {
  it('C3 refuses a NaN or negative total instead of scoring it 0', () => {
    expect(() => ratioGatedTierPoints(Number.NaN, 1.6e9, 0.9, [], 0)).toThrow(RangeError)
    expect(() => ratioGatedTierPoints(-5e9, 1.6e9, 0.9, [], 0)).toThrow(RangeError)
  })

  it('the sensitivity suite states how many countries it ranks', () => {
    expect(sensitivitySuite([{ iso3: 'TST', events: [] }], '2025-06-01', m).n).toBe(1)
  })

  it('weights off the 0.1 grid are written rounded half away from zero', () => {
    expect(formatWeights({ A: 0.15, B: 1.25, C: 0.05, D: 1.94 })).toBe('0.2,1.3,0.1,1.9')
  })

  it('event counts leave out computed values and other countries; latestEvent picks the last act', () => {
    const events = [
      ev('D1', '2025-01-01', 6, { end: '2025-02-01' }),
      ev('D1', '2025-02-01', 6, { end: null }),
      ev('B9', '2025-01-10', 5),
      ev('C5', '2025-01-10', 5, { id: 'evt_z' }),
      ev('C5', '2025-03-01', 5, { country: 'FRA' }),
    ]
    expect(eventCounts(events, '2025-06-01', 'TST').total).toBe(2)
    expect(eventCounts(events, '2025-06-01').total).toBe(3)
    expect(latestEvent(events, '2025-06-01', 'TST')).toEqual({
      date: '2025-01-10',
      id: 'evt_z',
      indicator: 'C5',
      points: 5,
    })
    expect(latestEvent([], '2025-06-01')).toBeNull()
  })
})
