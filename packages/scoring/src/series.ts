/**
 * Time behaviour of the score: the daily series compressed to change points, the "last change"
 * of a country (§14 `last_change`, spec §5 summary line) and the movers between two dates
 * (docs/04 §2: 7-day and 30-day deltas).
 */
import { EPSILON, nearlyEqual, roundHalfAwayFromZero, snap, tenthsDelta } from './numeric.js'
import type { CountryScore, CountryScorer, Transition } from './score.js'
import { dayNumber, isoDate } from './time.js'
import { CATEGORY_IDS, type CategoryId } from './types.js'

export interface SeriesPoint {
  readonly date: string
  /** S to one decimal. */
  readonly score: number
  readonly display: number
  readonly band: string
  readonly passivity: boolean
  /** Category subtotals to one decimal. */
  readonly categories: Readonly<
    Record<CategoryId, { readonly raw: number; readonly clipped: number }>
  >
  /** Event steps on that day (starts, ends, expiries, passivity-window exits). */
  readonly transitions: readonly Transition[]
}

/** The series point of one day's score (categories to one decimal). */
export function seriesPoint(s: CountryScore, transitions: readonly Transition[]): SeriesPoint {
  const categories = {} as Record<CategoryId, { raw: number; clipped: number }>
  for (const id of CATEGORY_IDS) {
    const c = s.categories[id]
    categories[id] = {
      raw: roundHalfAwayFromZero(c.raw, 1),
      clipped: roundHalfAwayFromZero(c.clipped, 1),
    }
  }
  return {
    date: s.date,
    score: s.score,
    display: s.display,
    band: s.band,
    passivity: s.passivity.applied,
    categories,
    transitions,
  }
}

function keyOf(p: SeriesPoint): string {
  const cats = CATEGORY_IDS.map((id) => `${p.categories[id].raw}/${p.categories[id].clipped}`)
  return `${p.score}|${p.display}|${p.band}|${p.passivity}|${cats.join('|')}`
}

/**
 * Keeps the change points of consecutive daily points (one per day, ascending): the first point,
 * then every point whose published values differ from the day before (see dailySeries).
 */
export function compressSeries(points: readonly SeriesPoint[]): SeriesPoint[] {
  const out: SeriesPoint[] = []
  let previous = ''
  for (const p of points) {
    const key = keyOf(p)
    if (key !== previous) out.push(p)
    previous = key
  }
  return out
}

/**
 * The score from `from` to `to` (inclusive, `YYYY-MM-DD`), one point per day on which a published
 * value changes: the score to one decimal, the display integer, the band, the passivity flag, or a
 * category subtotal (raw or clipped) to one decimal. The first day is always a point. Between two
 * points every value equals the earlier point's (a step function), so the full daily series is
 * recovered by carrying each point forward.
 */
export function dailySeries(scorer: CountryScorer, from: string, to: string): SeriesPoint[] {
  const a = dayNumber(from)
  const b = dayNumber(to)
  if (b < a) throw new RangeError(`series end ${to} is before its start ${from}`)
  const points: SeriesPoint[] = []
  for (let day = a; day <= b; day++) {
    points.push(seriesPoint(scorer.atDay(day), scorer.transitionsOn(day)))
  }
  return compressSeries(points)
}

/** Score of `day` from a full series of change points (null before the first point). */
export function valueOn<T extends { readonly date: string }>(
  points: readonly T[],
  date: string,
): T | null {
  let found: T | null = null
  for (const p of points) {
    if (p.date > date) break
    found = p
  }
  return found
}

export interface LastChange {
  readonly date: string
  /**
   * `event`: an event's start, end or expiry caused the change; `passivity`: the penalty was
   * applied or lifted with no event step causing more of the change.
   */
  readonly kind: 'event' | 'passivity'
  /** The event whose step moved the score most that day. */
  readonly event: string | null
  readonly indicator: string | null
  readonly change: 'start' | 'end' | 'expire' | null
  /** Net change of that event's indicator value (after its cap) that day, full precision. */
  readonly points: number | null
  /** What the principal step alone did to S (counterfactual), full precision. */
  readonly effect: number
  /** score(d) − score(d − 1), one decimal (§14 `last_change.delta`). */
  readonly delta: number
  readonly passivity: { readonly before: boolean; readonly after: boolean }
}

const KIND_RANK: Record<Transition['kind'], number> = {
  start: 0,
  end: 1,
  expire: 2,
  'leaves-passivity-window': 3,
}

/** Smallest effect on S that counts as causing a change (it shows at one decimal). */
const MIN_EFFECT = 0.05

/**
 * The most recent day d ≤ `date` on which the country's published score (one decimal, or the
 * integer display) changed and an event step caused it: an event started, a standing or computed
 * state ended, a repeatable event left the score (Δ = 731), or a qualifying event left the
 * passivity window.
 *
 * Each step on d is judged by its effect on S: S(d) minus the score at d with that one event read
 * as on the day before (`CountryScorer.counterfactual`). A step whose effect is below 0.05 in
 * absolute value caused nothing visible: an E event (never summed), an event absorbed by an
 * indicator or category cap, a renewal at equal points. A day whose change came only from gradual
 * decay is skipped. The principal step has the largest |effect| (ties: start, end, expiry, then
 * passivity window; then smaller id); when it is a passivity-window exit, the change is reported
 * as `passivity`. Returns null when no event step ever changed the score.
 */
export function lastChange(scorer: CountryScorer, date: string): LastChange | null {
  const m = scorer.methodology
  const first = dayNumber(m.windowStart)
  const last = dayNumber(date)
  if (last < first) return null
  const days = scorer
    .transitionDays()
    .filter((d) => d >= first && d <= last)
    .sort((x, y) => y - x)
  for (const day of days) {
    const after = scorer.atDay(day)
    const before = scorer.atDay(day - 1)
    if (after.score === before.score && after.display === before.display) continue
    let best: { t: Transition; effect: number } | null = null
    for (const t of scorer.transitionsOn(day)) {
      const effect = after.exact - scorer.counterfactual(day, [t.id]).exact
      if (Math.abs(effect) < MIN_EFFECT) continue
      const better =
        best === null ||
        Math.abs(effect) > Math.abs(best.effect) + EPSILON ||
        (Math.abs(Math.abs(effect) - Math.abs(best.effect)) <= EPSILON &&
          (KIND_RANK[t.kind] < KIND_RANK[best.t.kind] ||
            (KIND_RANK[t.kind] === KIND_RANK[best.t.kind] && t.id < best.t.id)))
      if (better) best = { t, effect }
    }
    if (best === null) continue
    const passivity = { before: before.passivity.applied, after: after.passivity.applied }
    const delta = tenthsDelta(before.score, after.score)
    if (best.t.kind === 'leaves-passivity-window') {
      return {
        date: isoDate(day),
        kind: 'passivity',
        event: null,
        indicator: null,
        change: null,
        points: null,
        effect: best.effect,
        delta,
        passivity,
      }
    }
    const indicatorValue = (s: typeof after, id: string) =>
      s.indicators.find((i) => i.id === id)?.value ?? 0
    const points = snap(
      indicatorValue(after, best.t.indicator) - indicatorValue(before, best.t.indicator),
    )
    return {
      date: isoDate(day),
      kind: 'event',
      event: best.t.id,
      indicator: best.t.indicator,
      change: best.t.kind,
      points,
      effect: best.effect,
      delta,
      passivity,
    }
  }
  return null
}

export interface Mover {
  readonly iso3: string
  /** Scores to one decimal. */
  readonly from: number
  readonly to: number
  /** The full-precision change, rounded to one decimal. */
  readonly delta: number
  readonly displayFrom: number
  readonly displayTo: number
  /** Change of the integer display score; non-zero for every mover. */
  readonly displayDelta: number
}

export interface MoverInput {
  readonly iso3: string
  /** S in full precision at the earlier date. */
  readonly from: number
  /** S in full precision at the later date. */
  readonly to: number
}

/**
 * Countries whose integer display score moved between two dates, the score readers see (as
 * docs/02 §11 lists methodology movers by display score): `up` by largest rise, `down` by largest
 * fall; ties by the full-precision change, then ISO3. `limit` bounds each list.
 */
export function movers(
  entries: readonly MoverInput[],
  limit = Number.POSITIVE_INFINITY,
): { up: Mover[]; down: Mover[] } {
  const all = entries.map((e) => {
    const displayFrom = roundHalfAwayFromZero(e.from, 0)
    const displayTo = roundHalfAwayFromZero(e.to, 0)
    const displayDelta = displayTo - displayFrom
    const mover: Mover = {
      iso3: e.iso3,
      from: roundHalfAwayFromZero(e.from, 1),
      to: roundHalfAwayFromZero(e.to, 1),
      delta: roundHalfAwayFromZero(e.to - e.from, 1),
      displayFrom,
      displayTo,
      displayDelta: displayDelta === 0 ? 0 : displayDelta,
    }
    return { mover, exact: e.to - e.from }
  })
  type Entry = (typeof all)[number]
  const byIso = (a: Entry, b: Entry) =>
    a.mover.iso3 < b.mover.iso3 ? -1 : a.mover.iso3 > b.mover.iso3 ? 1 : 0
  const bySize = (a: Entry, b: Entry) =>
    Math.abs(b.mover.displayDelta) - Math.abs(a.mover.displayDelta) ||
    (nearlyEqual(a.exact, b.exact) ? 0 : Math.abs(b.exact) - Math.abs(a.exact)) ||
    byIso(a, b)
  const up = all.filter((x) => x.mover.displayDelta > 0).sort(bySize)
  const down = all.filter((x) => x.mover.displayDelta < 0).sort(bySize)
  return {
    up: up.slice(0, limit).map((x) => x.mover),
    down: down.slice(0, limit).map((x) => x.mover),
  }
}

/** The earlier date of a k-day movers window, never before the window start. */
export function moversFrom(date: string, days: number, windowStart: string): string {
  const from = dayNumber(date) - days
  return isoDate(Math.max(from, dayNumber(windowStart)))
}
