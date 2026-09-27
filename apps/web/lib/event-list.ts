/**
 * The events list and the Timeline of a country page (docs/05 §6 Country). Computed indicators
 * change on a calendar (D1 monthly, A2 and C3 yearly, A1 and A4 per SIPRI release): consecutive
 * computed values of one indicator form one run, listed once and drawn only on the dates its
 * points changed, so that 36 monthly D1 values do not bury the hand-authored events. Nothing here
 * restates a scoring rule: `previous_points` (the value in force the day before, null for the
 * first value and after a gap) and `at_build` come from the API.
 */
import type { ApiEvent } from '@gai/schema/api'

export interface EventItem {
  kind: 'event'
  key: string
  /** Date the list is ordered by. */
  date: string
  event: ApiEvent
}

export interface RunItem {
  kind: 'run'
  key: string
  /** Date of the latest value. */
  date: string
  indicator: string
  /** Every value of the run, oldest first. */
  values: ApiEvent[]
  /** The values whose points differ from the value in force the day before (the first one too). */
  changes: ApiEvent[]
}

export type ListItem = EventItem | RunItem

/** A computed value whose points differ from those in force the day before, or that follows none. */
export function pointsChanged(e: ApiEvent): boolean {
  return e.previous_points === null || e.previous_points !== e.points
}

/**
 * Runs of computed values: per indicator, by date; a value without a value in force the day
 * before (`previous_points` null) starts a new run.
 */
export function computedRuns(events: readonly ApiEvent[]): ApiEvent[][] {
  const byIndicator = new Map<string, ApiEvent[]>()
  for (const e of events) {
    if (e.type !== 'computed') continue
    const list = byIndicator.get(e.indicator) ?? []
    list.push(e)
    byIndicator.set(e.indicator, list)
  }
  const runs: ApiEvent[][] = []
  for (const list of byIndicator.values()) {
    list.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.id < b.id ? -1 : 1))
    let run: ApiEvent[] = []
    for (const e of list) {
      if (run.length > 0 && e.previous_points === null) {
        runs.push(run)
        run = []
      }
      run.push(e)
    }
    if (run.length > 0) runs.push(run)
  }
  return runs
}

/** Anchor of a run on the page. */
export function runAnchor(values: readonly ApiEvent[]): string {
  const first = values[0]
  if (first === undefined) throw new Error('empty run')
  return `series-${first.id}`
}

/**
 * The list, newest first: every public event that is not a computed value, and each run of
 * computed values (a run of one value is listed as that event). Equal dates by key.
 */
export function listItems(events: readonly ApiEvent[]): ListItem[] {
  const items: ListItem[] = events
    .filter((e) => e.type !== 'computed')
    .map((e) => ({ kind: 'event', key: e.id, date: e.date, event: e }))
  for (const values of computedRuns(events)) {
    const last = values[values.length - 1] as ApiEvent
    if (values.length === 1) {
      items.push({ kind: 'event', key: last.id, date: last.date, event: last })
    } else {
      items.push({
        kind: 'run',
        key: runAnchor(values),
        date: last.date,
        indicator: last.indicator,
        values,
        changes: values.filter(pointsChanged),
      })
    }
  }
  return items.sort((a, b) =>
    a.date !== b.date ? (a.date < b.date ? 1 : -1) : a.key < b.key ? -1 : a.key > b.key ? 1 : 0,
  )
}

export type Sign = 'positive' | 'negative'

export interface Facets {
  indicators: string[]
  signs: Sign[]
  confidences: string[]
}

function signOf(points: number): Sign | null {
  return points > 0 ? 'positive' : points < 0 ? 'negative' : null
}

/** The filter values an item matches (a run matches the values of any of its members). */
export function itemFacets(item: ListItem): Facets {
  const events = item.kind === 'event' ? [item.event] : item.values
  const uniq = <T>(xs: T[]) => [...new Set(xs)]
  return {
    indicators: uniq(events.map((e) => e.indicator)),
    signs: uniq(events.map((e) => signOf(e.points)).filter((s): s is Sign => s !== null)),
    confidences: uniq(events.map((e) => e.confidence)),
  }
}

/** The filter values present in a list, in the order given (methodology order for indicators). */
export function listFacets(
  items: readonly ListItem[],
  order: { indicators: readonly string[]; confidences: readonly string[] },
): Facets {
  const all = items.map(itemFacets)
  const has = (pick: (f: Facets) => readonly string[]) => new Set(all.flatMap(pick))
  const ind = has((f) => f.indicators)
  const sign = has((f) => f.signs)
  const conf = has((f) => f.confidences)
  return {
    indicators: order.indicators.filter((i) => ind.has(i)),
    signs: (['positive', 'negative'] as const).filter((s) => sign.has(s)),
    confidences: order.confidences.filter((c) => conf.has(c)),
  }
}

export interface Filter {
  indicator: string | null
  sign: Sign | null
  confidence: string | null
}

export const NO_FILTER: Filter = { indicator: null, sign: null, confidence: null }

export function matches(f: Facets, filter: Filter): boolean {
  return (
    (filter.indicator === null || f.indicators.includes(filter.indicator)) &&
    (filter.sign === null || f.signs.includes(filter.sign)) &&
    (filter.confidence === null || f.confidences.includes(filter.confidence))
  )
}

/** The events drawn on the Timeline: every event except computed values whose points did not change. */
export function timelineEvents(events: readonly ApiEvent[]): ApiEvent[] {
  return events.filter((e) => e.type !== 'computed' || pointsChanged(e))
}

/** Computed values counted at the build date (the summary line counts acts only, B-74). */
export function computedInForce(events: readonly ApiEvent[]): ApiEvent[] {
  return events.filter((e) => e.type === 'computed' && e.at_build.reason === 'counted')
}
