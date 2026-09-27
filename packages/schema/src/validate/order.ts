/**
 * The one order of events that the validator enforces and that writers (P-04 tools,
 * `pnpm publish:events`) use when they insert an event into `data/events/{ISO3}.yaml`
 * (docs/03 §1: "sorted by date").
 *
 * Events are sorted by date; events of one date by id in natural order: digit runs compare as
 * numbers, so `…_B9` comes before `…_B10`, and instance `_2` before `_10` (the order in which
 * `nextEventId` hands them out). Everything else compares by UTF-16 code unit, independent of the
 * locale.
 */
import type { Event } from '../records.js'

const RUNS = /\d+|\D+/g

/** Natural order of two ids: digit runs compared by value, other runs by code unit. */
export function compareEventIds(a: string, b: string): number {
  if (a === b) return 0
  const ra = a.match(RUNS) ?? []
  const rb = b.match(RUNS) ?? []
  const n = Math.min(ra.length, rb.length)
  for (let i = 0; i < n; i++) {
    const x = ra[i] as string
    const y = rb[i] as string
    if (x === y) continue
    const dx = /^\d/.test(x)
    const dy = /^\d/.test(y)
    if (dx && dy) {
      // Compare by value without number overflow: strip leading zeros, then length, then digits.
      const vx = x.replace(/^0+(?=\d)/, '')
      const vy = y.replace(/^0+(?=\d)/, '')
      if (vx.length !== vy.length) return vx.length < vy.length ? -1 : 1
      if (vx !== vy) return vx < vy ? -1 : 1
      // Same value, different zero padding: fall through to the code-unit order below.
    }
    return x < y ? -1 : 1
  }
  if (ra.length !== rb.length) return ra.length < rb.length ? -1 : 1
  return a < b ? -1 : 1
}

/** Order of events inside a country file: date, then `compareEventIds`. */
export function compareEventOrder(
  a: Pick<Event, 'date' | 'id'>,
  b: Pick<Event, 'date' | 'id'>,
): number {
  if (a.date !== b.date) return a.date < b.date ? -1 : 1
  return compareEventIds(a.id, b.id)
}
