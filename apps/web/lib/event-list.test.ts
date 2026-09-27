import type { ApiEvent } from '@gai/schema/api'
import { describe, expect, it } from 'vitest'
import {
  computedInForce,
  computedRuns,
  itemFacets,
  listFacets,
  listItems,
  matches,
  NO_FILTER,
  timelineEvents,
} from './event-list'

function ev(
  id: string,
  patch: Partial<ApiEvent> & Pick<ApiEvent, 'indicator' | 'date' | 'points'>,
): ApiEvent {
  return {
    id,
    type: 'repeatable',
    confidence: 'confirmed',
    previous_points: null,
    at_build: { reason: 'counted' },
    ...patch,
  } as ApiEvent
}

const d1 = (month: string, points: number, previous: number | null, counted = false) =>
  ev(`evt_${month.replace('-', '_')}_01_XXX_D1_fts`, {
    indicator: 'D1',
    type: 'computed',
    date: `${month}-01`,
    points,
    previous_points: previous,
    at_build: { reason: counted ? 'counted' : 'ended' } as ApiEvent['at_build'],
  })

const EVENTS = [
  d1('2024-01', 1, null),
  d1('2024-02', 1, 1),
  d1('2024-03', 3, 1),
  // A gap: no value in force the day before.
  d1('2024-06', 3, null),
  d1('2024-07', 3, 3, true),
  ev('evt_2024_05_02_XXX_B9', { indicator: 'B9', date: '2024-05-02', points: 2 }),
  ev('evt_2024_08_08_XXX_A6', {
    indicator: 'A6',
    type: 'standing',
    date: '2024-08-08',
    points: 10,
    confidence: 'reported',
  }),
  ev('evt_2024_05_20_XXX_A2_x', {
    indicator: 'A2',
    type: 'computed',
    date: '2024-05-20',
    points: -3,
  }),
]

describe('computedRuns', () => {
  it('splits a run where no value was in force the day before', () => {
    const runs = computedRuns(EVENTS).map((r) => r.map((e) => e.date))
    expect(runs).toEqual([
      ['2024-01-01', '2024-02-01', '2024-03-01'],
      ['2024-06-01', '2024-07-01'],
      ['2024-05-20'],
    ])
  })
})

describe('listItems', () => {
  it('lists acts and runs newest first; a run of one value is an event', () => {
    const items = listItems(EVENTS)
    expect(items.map((i) => `${i.kind}:${i.date}`)).toEqual([
      'event:2024-08-08',
      'run:2024-07-01',
      'event:2024-05-20',
      'event:2024-05-02',
      'run:2024-03-01',
    ])
    const first = items[4]
    if (first?.kind !== 'run') throw new Error('expected a run')
    expect(first.changes.map((e) => e.date)).toEqual(['2024-01-01', '2024-03-01'])
  })
})

describe('facets and filters', () => {
  const items = listItems(EVENTS)
  it('lists the values present in methodology order', () => {
    expect(
      listFacets(items, {
        indicators: ['A2', 'A6', 'B9', 'D1'],
        confidences: ['confirmed', 'corroborated', 'reported'],
      }),
    ).toEqual({
      indicators: ['A2', 'A6', 'B9', 'D1'],
      signs: ['positive', 'negative'],
      confidences: ['confirmed', 'reported'],
    })
  })
  it('matches every filter at once', () => {
    const f = items.map(itemFacets)
    expect(f.filter((x) => matches(x, NO_FILTER))).toHaveLength(items.length)
    expect(f.filter((x) => matches(x, { ...NO_FILTER, sign: 'negative' }))).toHaveLength(1)
    expect(
      f.filter((x) => matches(x, { indicator: 'D1', sign: 'positive', confidence: 'confirmed' })),
    ).toHaveLength(2)
    expect(f.filter((x) => matches(x, { ...NO_FILTER, confidence: 'reported' }))).toHaveLength(1)
  })
})

describe('timelineEvents and computedInForce', () => {
  it('draws computed values only when their points changed', () => {
    expect(timelineEvents(EVENTS).map((e) => e.date)).toEqual([
      '2024-01-01',
      '2024-03-01',
      '2024-06-01',
      '2024-05-02',
      '2024-08-08',
      '2024-05-20',
    ])
  })
  it('counts the computed values counted at the build date', () => {
    expect(computedInForce(EVENTS).map((e) => e.date)).toEqual(['2024-07-01', '2024-05-20'])
  })
})
