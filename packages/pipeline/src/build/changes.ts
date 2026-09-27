/**
 * The changes feed (docs/04 §2 step 5: movers over 7 and 30 days, the "changed this week/month"
 * feed; docs/05 §6 Changes) as the API files `changes/{YYYY-MM}.json` and `changes/latest.json`.
 *
 * Rules:
 * - A feed entry is a published event scoped to gaza (docs/02 §3: only these can score). It gives
 *   a `start` entry on its `date` when that date lies in [window start, build date], and, for a
 *   hand-authored standing state (type `standing`), an `end` entry on its `end` date when that
 *   date lies in (window start, build date]: `end` is the first day the state no longer holds, so
 *   an end on the window start means the state never held inside the window. A computed value
 *   usually ends where the next one starts, and that start is the entry; when no computed event of
 *   the same country and indicator starts on its end date (a month without FTS funding, a release
 *   without a row of the country), its end is listed too, since the value stopped counting.
 *   Repeatable events have no end.
 * - `points_changed` is false only for a computed event whose points equal those of the computed
 *   value in force the day before (`ApiEvent.previous_points`, null after a gap): the site lists a
 *   monthly or yearly recomputation only when its value moved and counts the others, one line per
 *   week (PROMPTS.md P-09). latest.json's `recent` leaves the unchanged ones out.
 * - Weeks are ISO 8601 weeks (Monday to Sunday, ./dates.ts). A month file lists every ISO week
 *   with at least one day in the month, with the full Monday–Sunday bounds, and only the entries
 *   dated inside the month; a week that spans two months appears in both files, each with its own
 *   entries. The month of the window start begins on 2023-10-07; the build month ends on the build
 *   date and is not complete.
 * - Movers compare the full-precision score S (`DayScore.exact`) at two dates through `movers` of
 *   @gai/scoring: a country moves when its integer display score changed (docs/02 §11 lists
 *   methodology movers the same way). A month's movers run from the day before the month (the
 *   window start itself for October 2023, as there is no score before it) to its last day or the
 *   build date; the rolling movers of latest.json run over 7 and 30 days, never from before the
 *   window start (`moversFrom`).
 * - Order is explicit everywhere (D-25): entries by date, country, id, then change (code-unit
 *   comparison); `recent` newest first (date descending, then country, id and change ascending);
 *   corrections by date then id, newest date first in latest.json; replies by publication date
 *   then id.
 *
 * Pure: no clock, no I/O; the same input gives the same objects.
 */
import type {
  ApiChangesLatestFile,
  ApiChangesMonthFile,
  ApiCorrection,
  ApiEvent,
  ApiFeedEntry,
  ApiFeedWeek,
  ApiMovers,
  ApiReply,
  ApiReportPaths,
  LangText,
} from '@gai/schema'
import { addDays, dayNumber, type Mover, movers, moversFrom } from '@gai/scoring'
import { isoWeek, monthBounds, monthOf, monthsBetween, weekStart } from './dates.js'
import type { DayScore } from './types.js'

/** A scored country as the feed sees it: its name and its daily scores. */
export interface FeedCountry {
  iso3: string
  name: LangText
  /** One entry per day from the window start (days[0]) to the build date. */
  days: readonly DayScore[]
}

export interface ChangesInput {
  /** Build date `YYYY-MM-DD`. */
  date: string
  /** First day of the window (2023-10-07). */
  windowStart: string
  /** Methodology version, e.g. `1.0.0`. */
  methodology: string
  /** Scored countries, any order. */
  countries: readonly FeedCountry[]
  /** Every public event of every scored country, as published (ApiEvent). */
  events: readonly ApiEvent[]
  corrections: readonly ApiCorrection[]
  /** Replies already filtered to published_at ≤ date. */
  replies: readonly ApiReply[]
}

/** Entries per page of latest.json's `recent`. */
export const RECENT_ENTRIES = 20
/** ISO weeks in latest.json: the build date's week and the four before it. */
export const LATEST_WEEKS = 5
/** Days of the corrections window of latest.json: (date − 30, date]. */
export const LATEST_CORRECTION_DAYS = 30

function compare(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0
}

/** Feed order: date, country, id, change (code-unit comparison). */
export function compareEntries(a: ApiFeedEntry, b: ApiFeedEntry): number {
  return (
    compare(a.date, b.date) ||
    compare(a.country, b.country) ||
    compare(a.id, b.id) ||
    compare(a.change, b.change)
  )
}

/** Newest first: date descending, then country, id and change ascending. */
function compareNewestFirst(a: ApiFeedEntry, b: ApiFeedEntry): number {
  return (
    compare(b.date, a.date) ||
    compare(a.country, b.country) ||
    compare(a.id, b.id) ||
    compare(a.change, b.change)
  )
}

/** A copy of a text pair, so that no output object shares a reference with the input. */
function copyText(t: LangText): LangText {
  return { en: t.en, fr: t.fr }
}

function checkDates(input: ChangesInput): void {
  dayNumber(input.windowStart)
  if (dayNumber(input.date) < dayNumber(input.windowStart)) {
    throw new RangeError(`build date ${input.date} is before the window start ${input.windowStart}`)
  }
}

function countryNames(input: ChangesInput): Map<string, LangText> {
  const names = new Map<string, LangText>()
  for (const c of input.countries) {
    if (names.has(c.iso3)) throw new Error(`country ${c.iso3} is listed twice in the feed input`)
    names.set(c.iso3, c.name)
  }
  return names
}

/** A feed entry of an event. */
function entryOf(e: ApiEvent, name: LangText, change: 'start' | 'end'): ApiFeedEntry {
  const computed = e.type === 'computed' && change === 'start'
  const previous = computed ? e.previous_points : null
  return {
    id: e.id,
    country: e.country,
    country_name: copyText(name),
    indicator: e.indicator,
    indicator_name: copyText(e.indicator_name),
    category: e.category,
    type: e.type,
    change,
    date: change === 'start' ? e.date : (e.end as string),
    points: e.points,
    previous_points: previous,
    points_changed: !computed || previous === null || e.points !== previous,
    confidence: e.confidence,
    generated: e.generated,
    summary: copyText(e.summary),
  }
}

/**
 * Every feed entry from the window start to the build date, by date, country, id and change:
 * a `start` entry per published gaza event dated in [window start, date], an `end` entry per
 * published gaza standing state, or computed value not followed by another on the same day, whose
 * `end` lies in (window start, date]. Throws when an event belongs to a country that is not in
 * `input.countries`.
 */
export function feedEntries(input: ChangesInput): ApiFeedEntry[] {
  checkDates(input)
  const names = countryNames(input)
  const first = dayNumber(input.windowStart)
  const last = dayNumber(input.date)
  const listed = input.events.filter((e) => e.status === 'published' && e.scope.includes('gaza'))
  const computedKey = (country: string, indicator: string, date: string) =>
    `${country}\u0000${indicator}\u0000${date}`
  const computedStarts = new Set(
    listed
      .filter((e) => e.type === 'computed')
      .map((e) => computedKey(e.country, e.indicator, e.date)),
  )
  const out: ApiFeedEntry[] = []
  for (const e of listed) {
    const name = names.get(e.country)
    if (name === undefined) {
      throw new Error(`event ${e.id} belongs to ${e.country}, which is not a scored country`)
    }
    const start = dayNumber(e.date)
    if (start >= first && start <= last) out.push(entryOf(e, name, 'start'))
    if (e.end === null || e.type === 'repeatable') continue
    if (e.type === 'computed' && computedStarts.has(computedKey(e.country, e.indicator, e.end))) {
      continue
    }
    const end = dayNumber(e.end)
    if (end > first && end <= last) out.push(entryOf(e, name, 'end'))
  }
  return out.sort(compareEntries)
}

function dayScore(c: FeedCountry, date: string, windowStart: string): DayScore {
  const index = dayNumber(date) - dayNumber(windowStart)
  const day = index >= 0 ? c.days[index] : undefined
  if (day === undefined) throw new RangeError(`no daily score of ${c.iso3} on ${date}`)
  return day
}

/**
 * Countries whose integer display score moved from `from` to `to` (both in [window start, build
 * date]), compared on the full-precision score: `up` by largest rise, `down` by largest fall (ties
 * by the exact change, then ISO3; `movers` of @gai/scoring), no limit. `days` is 7 or 30 for the
 * rolling windows of latest.json and null for a calendar month.
 */
export function moversBetween(
  input: ChangesInput,
  from: string,
  to: string,
  days: number | null,
): ApiMovers {
  if (dayNumber(from) > dayNumber(to)) {
    throw new RangeError(`movers window starts on ${from}, after its end ${to}`)
  }
  const names = countryNames(input)
  const moved = movers(
    input.countries.map((c) => ({
      iso3: c.iso3,
      from: dayScore(c, from, input.windowStart).exact,
      to: dayScore(c, to, input.windowStart).exact,
    })),
  )
  const api = (m: Mover): ApiMovers['up'][number] => ({
    iso3: m.iso3,
    name: copyText(names.get(m.iso3) as LangText),
    from: m.from,
    to: m.to,
    delta: m.delta,
    display_from: m.displayFrom,
    display_to: m.displayTo,
    display_delta: m.displayDelta,
  })
  return { days, from, to, up: moved.up.map(api), down: moved.down.map(api) }
}

/** The four report paths of a month: `changes/{m}.md`, `.fr.md`, `.scorecard.md`, `.scorecard.fr.md`. */
export function reportPaths(month: string): ApiReportPaths {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
    throw new RangeError(`expected a month YYYY-MM, got ${JSON.stringify(month)}`)
  }
  return {
    en: `changes/${month}.md`,
    fr: `changes/${month}.fr.md`,
    scorecard_en: `changes/${month}.scorecard.md`,
    scorecard_fr: `changes/${month}.scorecard.fr.md`,
  }
}

/** The API path of a month file. */
export function monthPath(month: string): string {
  reportPaths(month)
  return `changes/${month}.json`
}

/** Every month of the feed, from the window start's month to the build month, ascending. */
export function feedMonths(input: ChangesInput): string[] {
  checkDates(input)
  return monthsBetween(input.windowStart, input.date)
}

/**
 * The ISO week starting on `monday`, with the entries dated in [max(monday, from), min(sunday,
 * to)] (already sorted), and the count of unchanged recomputations among them.
 */
function feedWeek(
  monday: string,
  entries: readonly ApiFeedEntry[],
  from: string,
  to: string,
): ApiFeedWeek {
  const sunday = addDays(monday, 6)
  const a = monday > from ? monday : from
  const b = sunday < to ? sunday : to
  const inWeek = entries.filter((e) => e.date >= a && e.date <= b)
  return {
    week: isoWeek(monday),
    from: monday,
    to: sunday,
    entries: inWeek,
    unchanged_computed: inWeek.filter((e) => !e.points_changed).length,
  }
}

/**
 * `changes/{month}.json`: the month's entries by ISO week, its movers, the corrections dated in
 * it and the replies published in it. `entries` is the whole feed (`feedEntries`); only entries
 * dated in the month are kept. Throws for a month outside [window start's month, build month].
 */
export function monthFile(
  input: ChangesInput,
  month: string,
  entries: readonly ApiFeedEntry[],
): ApiChangesMonthFile {
  const months = feedMonths(input)
  if (!months.includes(month)) {
    throw new RangeError(
      `month ${month} is outside the feed (${months[0]} to ${months[months.length - 1]})`,
    )
  }
  const { first, last } = monthBounds(month)
  const from = first < input.windowStart ? input.windowStart : first
  const complete = month !== monthOf(input.date)
  const to = complete ? last : input.date

  const inMonth = entries.filter((e) => e.date >= from && e.date <= to).sort(compareEntries)
  const weeks: ApiFeedWeek[] = []
  for (let monday = weekStart(from); monday <= to; monday = addDays(monday, 7)) {
    weeks.push(feedWeek(monday, inMonth, from, to))
  }

  const moversFromDate = from === input.windowStart ? from : addDays(from, -1)
  const corrections = input.corrections
    .filter((c) => c.date >= from && c.date <= to)
    .sort((a, b) => compare(a.date, b.date) || compare(a.id, b.id))
  const replies = input.replies
    .filter((r) => r.published_at >= from && r.published_at <= to)
    .sort((a, b) => compare(a.published_at, b.published_at) || compare(a.id, b.id))

  return {
    month,
    methodology: input.methodology,
    from,
    to,
    complete,
    weeks,
    movers: moversBetween(input, moversFromDate, to, null),
    corrections,
    replies,
    counts: {
      entries: inMonth.length,
      starts: inMonth.filter((e) => e.change === 'start').length,
      ends: inMonth.filter((e) => e.change === 'end').length,
      unchanged_computed: inMonth.filter((e) => !e.points_changed).length,
    },
    reports: reportPaths(month),
  }
}

/** Every month file of the feed, ascending (`monthFile` for each of `feedMonths`). */
export function monthFiles(
  input: ChangesInput,
  entries: readonly ApiFeedEntry[],
): ApiChangesMonthFile[] {
  return feedMonths(input).map((m) => monthFile(input, m, entries))
}

/**
 * `changes/latest.json`: movers over 7 and 30 days, the 20 latest listed entries (unchanged
 * computed values left out, P-09), the build date's ISO week and the four before it (newest first; entries of every month, up to the build date; weeks
 * that end before the window start are left out), the corrections dated in (date − 30, date]
 * (newest first), and the list of month files. `months` must be exactly the feed's months
 * (`monthFiles`).
 */
export function latestFile(
  input: ChangesInput,
  entries: readonly ApiFeedEntry[],
  months: readonly ApiChangesMonthFile[],
): ApiChangesLatestFile {
  checkDates(input)
  const { date, windowStart } = input
  const upTo = entries.filter((e) => e.date <= date)

  const weeks: ApiFeedWeek[] = []
  const sorted = [...upTo].sort(compareEntries)
  for (let k = 0; k < LATEST_WEEKS; k++) {
    const monday = addDays(weekStart(date), -7 * k)
    if (addDays(monday, 6) < windowStart) break
    weeks.push(feedWeek(monday, sorted, monday, date))
  }

  const since = addDays(date, -LATEST_CORRECTION_DAYS)
  const corrections = input.corrections
    .filter((c) => c.date > since && c.date <= date)
    .sort((a, b) => compare(b.date, a.date) || compare(a.id, b.id))

  const expected = feedMonths(input)
  const listed = [...months].sort((a, b) => compare(a.month, b.month))
  const got = listed.map((m) => m.month)
  if (got.join() !== expected.join()) {
    throw new Error(
      `latest.json needs one month file per month from ${expected[0]} to ${expected[expected.length - 1]}, got [${got.join(', ')}]`,
    )
  }

  return {
    build_date: date,
    methodology: input.methodology,
    movers: {
      d7: moversBetween(input, moversFrom(date, 7, windowStart), date, 7),
      d30: moversBetween(input, moversFrom(date, 30, windowStart), date, 30),
    },
    recent: upTo
      .filter((e) => e.points_changed)
      .sort(compareNewestFirst)
      .slice(0, RECENT_ENTRIES),
    weeks,
    corrections,
    months: listed.map((m) => ({
      month: m.month,
      file: monthPath(m.month),
      reports: { ...m.reports },
      entries: m.counts.entries,
      complete: m.complete,
    })),
  }
}
