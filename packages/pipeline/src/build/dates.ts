/**
 * Calendar helpers for the build: ISO 8601 weeks and calendar months over `YYYY-MM-DD` strings,
 * on the day numbers of @gai/scoring (no Date object, no clock, no time zone; D-25).
 */
import { addDays, dateParts, dayNumber, isoDate } from '@gai/scoring'

/** Day of the week, 1 = Monday … 7 = Sunday. */
export function isoWeekday(date: string): number {
  // 1970-01-01 was a Thursday (4).
  return ((((dayNumber(date) + 3) % 7) + 7) % 7) + 1
}

/** Monday of the ISO week holding `date`. */
export function weekStart(date: string): string {
  return addDays(date, 1 - isoWeekday(date))
}

/**
 * ISO 8601 week id of `date`, e.g. `2026-W39`: weeks start on Monday, and week 1 of a year is the
 * week holding its first Thursday (so 2024-12-30 is in 2025-W01 and 2027-01-01 in 2026-W53).
 */
export function isoWeek(date: string): string {
  const thursday = addDays(weekStart(date), 3)
  const { year } = dateParts(thursday)
  const jan1 = dayNumber(`${String(year).padStart(4, '0')}-01-01`)
  const week = Math.floor((dayNumber(thursday) - jan1) / 7) + 1
  return `${String(year).padStart(4, '0')}-W${String(week).padStart(2, '0')}`
}

/** `YYYY-MM` of a date. */
export function monthOf(date: string): string {
  return date.slice(0, 7)
}

/** First and last day of a month `YYYY-MM`. */
export function monthBounds(month: string): { first: string; last: string } {
  const first = `${month}-01`
  const { year, month: m } = dateParts(first)
  const next =
    m === 12
      ? `${String(year + 1).padStart(4, '0')}-01-01`
      : `${month.slice(0, 5)}${String(m + 1).padStart(2, '0')}-01`
  return { first, last: addDays(next, -1) }
}

/** Every month `YYYY-MM` from the month of `from` to the month of `to`, ascending. */
export function monthsBetween(from: string, to: string): string[] {
  const out: string[] = []
  let month = monthOf(from)
  const last = monthOf(to)
  while (month <= last) {
    out.push(month)
    month = monthOf(addDays(monthBounds(month).last, 1))
  }
  return out
}

/** Every date from `from` to `to` inclusive, ascending. */
export function datesBetween(from: string, to: string): string[] {
  const out: string[] = []
  for (let d = dayNumber(from); d <= dayNumber(to); d++) out.push(isoDate(d))
  return out
}
