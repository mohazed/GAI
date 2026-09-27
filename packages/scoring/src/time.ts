/**
 * Calendar arithmetic on `YYYY-MM-DD` strings (proleptic Gregorian, UTC), without the Date object:
 * no clock and no time zone can enter a score (D-25).
 *
 * A day number counts days since 1970-01-01. Conversions follow H. Hinnant's days_from_civil and
 * civil_from_days algorithms.
 */

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/

function isLeap(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0
}

function daysInMonth(y: number, m: number): number {
  if (m === 2) return isLeap(y) ? 29 : 28
  return m === 4 || m === 6 || m === 9 || m === 11 ? 30 : 31
}

function parts(iso: string): [number, number, number] | null {
  const match = ISO_DATE.exec(iso)
  if (match === null) return null
  const y = Number(match[1])
  const m = Number(match[2])
  const d = Number(match[3])
  if (m < 1 || m > 12 || d < 1 || d > daysInMonth(y, m)) return null
  return [y, m, d]
}

/** True when `iso` is a real calendar date written `YYYY-MM-DD`. */
export function isIsoDate(iso: string): boolean {
  return parts(iso) !== null
}

/** Days since 1970-01-01. Throws on anything but a real `YYYY-MM-DD` date. */
export function dayNumber(iso: string): number {
  const p = parts(iso)
  if (p === null) throw new RangeError(`expected a date YYYY-MM-DD, got ${JSON.stringify(iso)}`)
  const [y, m, d] = p
  const yy = m <= 2 ? y - 1 : y
  const era = Math.floor(yy / 400)
  const yoe = yy - era * 400
  const mp = (m + 9) % 12
  const doy = Math.floor((153 * mp + 2) / 5) + d - 1
  const doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy
  return era * 146097 + doe - 719468
}

function pad(n: number, width: number): string {
  return String(n).padStart(width, '0')
}

/** The `YYYY-MM-DD` date of a day number. */
export function isoDate(day: number): string {
  if (!Number.isSafeInteger(day)) throw new RangeError(`expected an integer day number, got ${day}`)
  const z = day + 719468
  const era = Math.floor(z / 146097)
  const doe = z - era * 146097
  const yoe = Math.floor(
    (doe - Math.floor(doe / 1460) + Math.floor(doe / 36524) - Math.floor(doe / 146096)) / 365,
  )
  const doy = doe - (365 * yoe + Math.floor(yoe / 4) - Math.floor(yoe / 100))
  const mp = Math.floor((5 * doy + 2) / 153)
  const d = doy - Math.floor((153 * mp + 2) / 5) + 1
  const m = mp < 10 ? mp + 3 : mp - 9
  const y = yoe + era * 400 + (m <= 2 ? 1 : 0)
  return `${pad(y, 4)}-${pad(m, 2)}-${pad(d, 2)}`
}

/** Whole days from `a` to `b`; positive when `b` is later. */
export function daysBetween(a: string, b: string): number {
  return dayNumber(b) - dayNumber(a)
}

/** `iso` plus `n` days. */
export function addDays(iso: string, n: number): string {
  return isoDate(dayNumber(iso) + n)
}

/** Year, month (1–12) and day of a `YYYY-MM-DD` date. */
export function dateParts(iso: string): { year: number; month: number; day: number } {
  const p = parts(iso)
  if (p === null) throw new RangeError(`expected a date YYYY-MM-DD, got ${JSON.stringify(iso)}`)
  return { year: p[0], month: p[1], day: p[2] }
}
