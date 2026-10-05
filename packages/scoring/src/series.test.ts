import { describe, expect, it } from 'vitest'
import { createScorer } from './score.js'
import { dailySeries, lastChange, movers, moversFrom, valueOn } from './series.js'
import { ev, methodology, methodologyRc1 } from './test-helpers.js'
import { addDays, dayNumber, isoDate } from './time.js'
import type { ScoringEvent } from './types.js'

const m = methodology()
const scorer = (events: ScoringEvent[]) => createScorer('TST', events, m)

describe('daily series: change points only', () => {
  it('a standing state gives three points: the window start, its start, its end', () => {
    const a6 = ev('A6', '2025-08-08', 10, { end: '2025-11-24' })
    const points = dailySeries(scorer([a6]), '2023-10-07', '2026-09-27')
    expect(points.map((p) => [p.date, p.score, p.band, p.passivity])).toEqual([
      ['2023-10-07', -15, 'passive', true],
      ['2025-08-08', -5, 'passive', true],
      ['2025-11-24', -15, 'passive', true],
    ])
    expect(points[1]?.transitions).toEqual([{ id: a6.id, indicator: 'A6', kind: 'start' }])
    expect(points[2]?.transitions).toEqual([{ id: a6.id, indicator: 'A6', kind: 'end' }])
    expect(points[1]?.categories.A).toEqual({ raw: 10, clipped: 10 })
  })

  it('carrying each point forward gives back the score of every day', () => {
    const events = [
      ev('B1', '2024-01-10', -5),
      ev('B1', '2024-03-02', 3),
      ev('B9', '2024-06-01', 5),
      ev('A5', '2024-02-01', -5),
      ev('D2', '2024-01-27', -10, { end: '2024-07-01' }),
      ev('D3', '2024-07-01', 5),
      ev('D1', '2024-05-01', 3, { end: '2024-06-01' }),
      ev('D1', '2024-06-01', 6, { end: '2024-07-01' }),
    ]
    const s = scorer(events)
    const from = '2023-10-07'
    const to = '2026-12-31'
    const points = dailySeries(s, from, to)
    expect(points.length).toBeGreaterThan(10)
    expect(points.length).toBeLessThan(dayNumber(to) - dayNumber(from))
    for (let d = dayNumber(from); d <= dayNumber(to); d++) {
      const full = s.atDay(d)
      const p = valueOn(points, isoDate(d))
      expect(p?.score).toBe(full.score)
      expect(p?.display).toBe(full.display)
      expect(p?.passivity).toBe(full.passivity.applied)
    }
    // No two consecutive points carry the same values.
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1]
      const b = points[i]
      expect(JSON.stringify({ ...a, date: 0, transitions: 0 })).not.toBe(
        JSON.stringify({ ...b, date: 0, transitions: 0 }),
      )
    }
  })

  it('always starts with the first day and rejects an inverted range', () => {
    expect(dailySeries(scorer([]), '2024-01-01', '2024-12-31')).toHaveLength(1)
    expect(() => dailySeries(scorer([]), '2024-01-02', '2024-01-01')).toThrow(RangeError)
    expect(valueOn([{ date: '2024-01-02' }], '2024-01-01')).toBeNull()
  })
})

describe('last change', () => {
  it('is null for a country whose score never moved', () => {
    expect(lastChange(scorer([]), '2026-09-26')).toBeNull()
    expect(lastChange(scorer([ev('C5', '2026-10-01', 5)]), '2026-09-26')).toBeNull()
  })

  it('a UNGA vote: date, event, +3 (§14 example)', () => {
    const vote = ev('B1', '2026-09-12', 3, { country: 'TST' })
    const lc = lastChange(scorer([ev('B9', '2026-01-01', 5), vote]), '2026-09-26')
    expect(lc).toEqual({
      date: '2026-09-12',
      kind: 'event',
      event: vote.id,
      indicator: 'B1',
      change: 'start',
      points: 3,
      effect: 3,
      delta: 3,
      passivity: { before: false, after: false },
    })
  })

  it('the end of a standing state', () => {
    const a6 = ev('A6', '2025-08-08', 10, { end: '2025-11-24' })
    expect(lastChange(scorer([a6]), '2026-09-27')).toMatchObject({
      date: '2025-11-24',
      kind: 'event',
      event: a6.id,
      change: 'end',
      points: -10,
      delta: -10,
    })
    expect(lastChange(scorer([a6]), '2025-11-23')).toMatchObject({
      date: '2025-08-08',
      change: 'start',
      points: 10,
    })
  })

  it('a repeatable event leaving the score on day 731', () => {
    const vote = ev('B1', '2023-11-01', -5)
    const lc = lastChange(scorer([vote]), '2026-01-01')
    expect(lc).toMatchObject({ date: addDays('2023-11-01', 731), change: 'expire', points: 1.25 })
    // −1.25 − 15 = −16.25 → −16.3 to one decimal; −15 after.
    expect(lc?.delta).toBe(1.3)
  })

  it('the passivity penalty applied when the last qualifying event leaves the window', () => {
    const lc = lastChange(scorer([ev('C5', '2025-01-01', 5)]), '2026-06-01')
    expect(lc).toEqual({
      date: '2026-01-01',
      kind: 'passivity',
      event: null,
      indicator: null,
      change: null,
      points: null,
      effect: -15,
      delta: -15,
      passivity: { before: false, after: true },
    })
  })

  it('skips an event that a cap absorbs', () => {
    const a5 = ['2025-01-01', '2025-02-01', '2025-03-01', '2025-04-01'].map((d) => ev('A5', d, -5))
    expect(lastChange(scorer(a5), '2025-06-01')).toMatchObject({ date: '2025-03-01', points: -5 })
  })

  it('reports the net change of the indicator when a computed release replaces the previous one', () => {
    const old = ev('D1', '2026-08-01', 6, { end: '2026-09-01' })
    const next = ev('D1', '2026-09-01', 9, { end: null })
    expect(lastChange(scorer([old, next]), '2026-09-26')).toMatchObject({
      date: '2026-09-01',
      event: next.id,
      change: 'start',
      points: 3,
      delta: 3,
    })
  })

  it('reports the net change when a more severe measure replaces a less severe one', () => {
    const recall = ev('B12', '2024-01-01', 5)
    const severed = ev('B12', '2024-06-01', 10)
    expect(lastChange(scorer([recall, severed]), '2024-07-01')).toMatchObject({
      event: severed.id,
      points: 5,
      delta: 5,
    })
  })

  it('compares the window start with the score of a country without events', () => {
    const b8 = ev('B8', '2023-10-07', 3)
    // 1.0.0-rc.1: the pre-existing B8 tier lifted the penalty until 2024-10-06.
    const rc1 = (events: ScoringEvent[]) => createScorer('TST', events, methodologyRc1())
    expect(lastChange(rc1([b8]), '2024-01-01')).toMatchObject({
      date: '2023-10-07',
      event: b8.id,
      change: 'start',
      points: 3,
      delta: 18,
      passivity: { before: true, after: false },
    })
    expect(lastChange(rc1([b8]), '2025-01-01')).toMatchObject({
      date: '2024-10-06',
      kind: 'passivity',
      delta: -15,
    })
    // 1.0.0-rc.2 (B-47): the pre-existing tier never qualifies, so the penalty stays and the
    // change of the window start is the +3 alone.
    expect(lastChange(scorer([b8]), '2024-01-01')).toMatchObject({
      date: '2023-10-07',
      event: b8.id,
      change: 'start',
      points: 3,
      delta: 3,
      passivity: { before: true, after: true },
    })
    expect(lastChange(scorer([b8]), '2025-01-01')).toMatchObject({ date: '2023-10-07', delta: 3 })
  })

  it('is null before the window start', () => {
    expect(lastChange(scorer([ev('B9', '2024-01-01', 5)]), '2023-10-06')).toBeNull()
  })
})

describe('movers', () => {
  const entries = [
    { iso3: 'AAA', from: -15, to: -5 },
    { iso3: 'BBB', from: 3, to: 3.04 },
    { iso3: 'CCC', from: 10, to: -10 },
    { iso3: 'DDD', from: 0, to: 10 },
    { iso3: 'EEE', from: -13.46, to: -13.54 },
  ]

  it('lists risers and fallers by display change, ties by ISO3, leaving out unchanged displays', () => {
    const { up, down } = movers(entries)
    expect(up.map((x) => [x.iso3, x.delta, x.displayDelta])).toEqual([
      ['AAA', 10, 10],
      ['DDD', 10, 10],
    ])
    expect(down.map((x) => [x.iso3, x.delta, x.displayDelta])).toEqual([
      ['CCC', -20, -20],
      ['EEE', -0.1, -1],
    ])
    // −13.46 → −13.54 reads −13 → −14 on the site; to one decimal both are −13.5.
    expect(down[1]).toMatchObject({ from: -13.5, to: -13.5, displayFrom: -13, displayTo: -14 })
  })

  it('orders equal display changes by the full-precision change', () => {
    const { up } = movers([
      { iso3: 'AAA', from: 0, to: 1.2 },
      { iso3: 'BBB', from: 0, to: 1.4 },
    ])
    expect(up.map((x) => x.iso3)).toEqual(['BBB', 'AAA'])
  })

  it('bounds each list', () => {
    expect(movers(entries, 1).up.map((x) => x.iso3)).toEqual(['AAA'])
    expect(movers([], 5)).toEqual({ up: [], down: [] })
  })

  it('starts a k-day window no earlier than the window start', () => {
    expect(moversFrom('2026-09-26', 7, m.windowStart)).toBe('2026-09-19')
    expect(moversFrom('2023-10-10', 30, m.windowStart)).toBe('2023-10-07')
  })
})
