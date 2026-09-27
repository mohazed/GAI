/**
 * Number and date formatting for generated text (docs/05 §2): minus sign U+2212, plus sign on
 * positive values, decimal comma and narrow no-break space as thousands separator in French,
 * comma separator in English, dates written "12 September 2026" / "12 septembre 2026".
 */
import { roundHalfAwayFromZero } from './numeric.js'
import { dateParts } from './time.js'
import type { Lang } from './types.js'

export const MINUS = '−'
/** Espace insécable, before `:` and inside guillemets in French. */
export const NBSP = ' '
/** Espace fine insécable, before `; ? ! %` and as the French thousands separator. */
export const NNBSP = ' '

const MONTHS: Record<Lang, readonly string[]> = {
  en: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  fr: [
    'janvier',
    'février',
    'mars',
    'avril',
    'mai',
    'juin',
    'juillet',
    'août',
    'septembre',
    'octobre',
    'novembre',
    'décembre',
  ],
}

/** A non-negative integer with thousands separators: 12,345 / 12 345. */
export function formatInteger(n: number, lang: Lang): string {
  if (!Number.isSafeInteger(n) || n < 0) throw new RangeError(`expected a count, got ${n}`)
  const sep = lang === 'fr' ? NNBSP : ','
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, sep)
}

/**
 * A value rounded half away from zero to `decimals` places, trailing zeros dropped, with its sign:
 * `+3`, `−1.6` (EN), `−1,6` (FR), `0`.
 */
export function formatSigned(x: number, lang: Lang, decimals = 1): string {
  const r = roundHalfAwayFromZero(x, decimals)
  if (r === 0) return '0'
  const abs = Math.abs(r)
  let digits = Number.isInteger(abs) ? String(abs) : abs.toFixed(decimals).replace(/0+$/, '')
  if (lang === 'fr') digits = digits.replace('.', ',')
  return `${r > 0 ? '+' : MINUS}${digits}`
}

/** Month name (1–12). */
export function monthName(month: number, lang: Lang): string {
  const name = MONTHS[lang][month - 1]
  if (name === undefined) throw new RangeError(`no month ${month}`)
  return name
}

/** "26 September 2026" / "26 septembre 2026" ("1er septembre 2026" on the first). */
export function formatLongDate(iso: string, lang: Lang): string {
  const { year, month, day } = dateParts(iso)
  const d = lang === 'fr' && day === 1 ? '1er' : String(day)
  return `${d} ${monthName(month, lang)} ${year}`
}
