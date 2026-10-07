import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { type Event, loadMethodology } from '@gai/schema'
import { describe, expect, it } from 'vitest'
import {
  asPublished,
  both,
  cappedFiles,
  compare,
  compile,
  d1Runs,
  methodologyFiles,
  mostSevereFiles,
  noPreexistingB8,
  positiveOnly,
  preexistingB8,
  raiseConfidence,
  scoreVariant,
  sensitivityRows,
  standingWhileHolding,
} from './calibrate.js'

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')
const files = methodologyFiles(loadMethodology(REPO_ROOT))
const m = compile(files)

/** A synthetic gaza-scoped event (codes X.. are user-assigned, not real countries). */
function ev(
  country: string,
  indicator: string,
  type: 'standing' | 'repeatable' | 'computed',
  date: string,
  points: number,
  extra: Record<string, unknown> = {},
): Event {
  return {
    id: `evt_${date.replaceAll('-', '_')}_${country}_${indicator}_${String(points).replace('-', 'm')}${String(extra.n ?? '')}`,
    country,
    indicator,
    type,
    date,
    end: null,
    points,
    confidence: 'confirmed',
    scope: ['gaza'],
    status: 'published',
    evidence: [],
    ...extra,
  } as unknown as Event
}

const one = (iso3: string, events: Event[], date: string, spec = {}) =>
  scoreVariant([{ iso3, events }], m, date, { id: 't', ...spec }).scores[0]

describe('asPublished', () => {
  it('scores the listed statuses as published and leaves the others', () => {
    const out = asPublished(
      [
        ev('XAA', 'B9', 'repeatable', '2024-01-10', 2, { status: 'reviewed' }),
        ev('XAA', 'B9', 'repeatable', '2024-01-11', 2, { status: 'draft' }),
      ],
      ['reviewed'],
    )
    expect(out.map((e) => e.status)).toEqual(['published', 'draft'])
  })
})

describe('raiseConfidence (B-21)', () => {
  it('raises corroborated and reported events with a listed source kind, nothing else', () => {
    const kinds = new Map([
      ['src_a', 'parliamentary'],
      ['src_b', 'press'],
    ])
    const events = [
      ev('XAA', 'C2', 'standing', '2024-01-10', -10, {
        confidence: 'reported',
        evidence: [{ source: 'src_a' }],
      }),
      ev('XAA', 'B9', 'repeatable', '2024-01-11', 2, {
        confidence: 'reported',
        evidence: [{ source: 'src_b' }],
      }),
      ev('XAA', 'B10', 'repeatable', '2024-01-12', -5, {
        confidence: 'disputed',
        evidence: [{ source: 'src_a' }],
      }),
    ]
    const r = raiseConfidence(events, kinds, ['official-video', 'parliamentary'])
    expect(r.events.map((e) => e.confidence)).toEqual(['confirmed', 'reported', 'disputed'])
    expect(r.raised).toEqual([events[0]?.id])
  })
})

describe('methodology variants', () => {
  it('most severe stacking keeps one of two overlapping B7 states (B-22)', () => {
    const events = [
      ev('XAA', 'B7', 'standing', '2025-02-06', -20, { n: 1 }),
      ev('XAA', 'B7', 'standing', '2025-06-05', -20, { n: 2 }),
    ]
    const sum = one('XAA', events, '2025-07-01')
    const severe = one('XAA', events, '2025-07-01', {
      methodology: compile(mostSevereFiles(files, ['B7'])),
    })
    expect(sum?.clipped.B).toBe(-40)
    expect(severe?.clipped.B).toBe(-20)
  })

  it('an indicator cap bounds B1 (B-23)', () => {
    const votes = ['2024-09-18', '2024-12-11', '2024-12-12', '2024-12-19', '2025-06-12'].map(
      (d, i) => ev('XAA', 'B1', 'repeatable', d, 3, { n: i }),
    )
    const capped = compile(cappedFiles(files, 'B1', { min: -15, max: 15 }))
    expect(one('XAA', votes, '2025-06-30')?.clipped.B).toBe(15)
    const more = [...votes, ev('XAA', 'B1', 'repeatable', '2025-06-13', 3, { n: 9 })]
    expect(one('XAA', more, '2025-06-30')?.clipped.B).toBe(18)
    expect(one('XAA', more, '2025-06-30', { methodology: capped })?.clipped.B).toBe(15)
    // A yes-only state is passive under the cap: B1 never exceeds the penalty.
    expect(one('XAA', more, '2025-06-30', { methodology: capped })?.display).toBe(0)
  })
})

describe('passivity variants', () => {
  it('a negative act no longer lifts the penalty under B-46', () => {
    const events = [ev('XAA', 'C2', 'standing', '2026-01-11', -10)]
    expect(one('XAA', events, '2026-06-30')).toMatchObject({ exact: -10, passivity: false })
    expect(one('XAA', events, '2026-06-30', { qualifies: positiveOnly })).toMatchObject({
      exact: -25,
      passivity: true,
    })
  })

  it('the pre-existing B8 tier no longer lifts the penalty under B-47', () => {
    const events = [ev('XAA', 'B8', 'standing', '2023-10-07', 3)]
    expect(one('XAA', events, '2024-01-01')).toMatchObject({ exact: 3, passivity: false })
    expect(one('XAA', events, '2024-01-01', { qualifies: noPreexistingB8 })).toMatchObject({
      exact: -12,
      passivity: true,
    })
    expect(
      one('XAA', events, '2024-01-01', { qualifies: both(positiveOnly, noPreexistingB8) }),
    ).toMatchObject({ passivity: true })
  })

  it('a standing state qualifies while it holds under the B-48 alternative', () => {
    const events = [ev('XAA', 'B8', 'standing', '2024-05-28', 8)]
    expect(one('XAA', events, '2025-06-30')).toMatchObject({ exact: -7, passivity: true })
    expect(one('XAA', events, '2025-06-30', { qualifies: standingWhileHolding })).toMatchObject({
      exact: 8,
      passivity: false,
    })
  })
})

describe('preexistingB8', () => {
  it('adds +3 from the window start for registry dates before it, without a row already', () => {
    const out = preexistingB8(
      [
        { iso3: 'XAA', since: '1988-11-15' },
        { iso3: 'XBB', since: '2024-05-28' },
        { iso3: 'XCC', since: null },
        { iso3: 'XDD', since: '1988-11-15' },
      ],
      new Set(['XDD']),
      '2023-10-07',
    )
    expect(out.map((e) => [e.country, e.date, e.points])).toEqual([['XAA', '2023-10-07', 3]])
  })
})

describe('compare and sensitivityRows', () => {
  const countries = [
    { iso3: 'XAA', events: [ev('XAA', 'C2', 'standing', '2026-01-11', -10)] },
    { iso3: 'XBB', events: [ev('XBB', 'B9', 'repeatable', '2026-03-01', 5)] },
    { iso3: 'XCC', events: [] },
  ]
  it('counts changed display scores, bands and passivity decisions', () => {
    const a = scoreVariant(countries, m, '2026-06-30', { id: 'a' }).scores
    const b = scoreVariant(countries, m, '2026-06-30', { id: 'b', qualifies: positiveOnly }).scores
    const c = compare(a, b)
    expect(c.changedDisplay).toBe(1)
    expect(c.passivityChanges).toEqual([{ iso3: 'XAA', from: false, to: true }])
    expect(c.bandChanges.map((x) => [x.iso3, x.from, x.to])).toEqual([
      ['XAA', 'passive', 'enabling'],
    ])
    expect(() => compare(a, b.slice(1))).toThrow(RangeError)
  })

  it('computes the fifteen rows of docs/02 §10, each against its own baseline', () => {
    const rows = sensitivityRows(countries, m, '2026-06-30', { id: 'b', qualifies: positiveOnly })
    expect(rows.map((r) => r.id)).toEqual([
      'passivity-5',
      'passivity-15',
      'passivity-25',
      'weight-A-0.5',
      'weight-A-1.5',
      'weight-B-0.5',
      'weight-B-1.5',
      'weight-C-0.5',
      'weight-C-1.5',
      'weight-D-0.5',
      'weight-D-1.5',
      'reported-0.2',
      'reported-0.6',
      'statements-excluded',
      'decay-off',
    ])
    expect(rows.find((r) => r.id === 'passivity-15')?.changedDisplay).toBe(0)
    // XAA and XCC are both passive under B-46: a smaller penalty moves both.
    expect(rows.find((r) => r.id === 'passivity-5')?.changedDisplay).toBe(2)
  })
})

describe('d1Runs', () => {
  it('counts month-to-month and quarter-to-quarter changes of D1 points', () => {
    const events = [
      ['2025-01-01', 3],
      ['2025-02-01', 6],
      ['2025-03-01', 3],
      ['2025-04-01', 6],
      ['2025-05-01', 6],
    ].map(([d, p]) => ev('XAA', 'D1', 'computed', d as string, p as number))
    const [r] = d1Runs(events, '2025-01', '2025-06')
    expect(r).toMatchObject({ iso3: 'XAA', months: 5, changes: 4, quarterlyChanges: 1 })
    expect(r?.steps).toEqual(['2025-01 3', '2025-02 6', '2025-03 3', '2025-04 6', '2025-06 0'])
  })
})
