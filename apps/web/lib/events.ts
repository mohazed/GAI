/**
 * Counting published events for display. The definition is the API's `events` field of a country
 * (packages/schema/src/api.ts ScoreFields.events): published events scoped to gaza dated on or
 * before the build date, computed ones excepted. A test checks that the totals agree.
 */
import type { ApiEvent } from '@gai/schema/api'
import type { CategoryKey } from './methodology'

export function countedForDisplay(e: ApiEvent, buildDate: string): boolean {
  return (
    e.status === 'published' &&
    e.scope.includes('gaza') &&
    e.date <= buildDate &&
    e.type !== 'computed'
  )
}

export function eventCountsByCategory(
  events: readonly ApiEvent[],
  buildDate: string,
): Record<CategoryKey, number> {
  const out: Record<CategoryKey, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 }
  for (const e of events) if (countedForDisplay(e, buildDate)) out[e.category] += 1
  return out
}

/** Sign of an event's points, for filters: the same wording for both signs. */
export function signOf(points: number): 'positive' | 'negative' | 'zero' {
  return points > 0 ? 'positive' : points < 0 ? 'negative' : 'zero'
}
