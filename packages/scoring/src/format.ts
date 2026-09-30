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
/** U+2019, the typographic apostrophe of French text on the site (docs/05 §2, P-18). */
export const APOSTROPHE = '\u2019'

/**
 * The display form of French text (docs/05 §2, P-18): a straight apostrophe between two letters
 * ("l'Allemagne", "aujourd'hui") becomes the typographic apostrophe U+2019. The data, the
 * registry and the API keep the straight apostrophe as written; the site and the widget apply
 * this when they display French. Idempotent; a quotation mark or code with no letter on one side
 * is left alone.
 */
export function frenchApostrophes(text: string): string {
  return text.replace(/(\p{L}\p{M}*)'(?=\p{L})/gu, `$1${APOSTROPHE}`)
}

/**
 * French typography for display (docs/05 §2): the typographic apostrophe between letters, a
 * no-break space before `:` and inside guillemets, a narrow no-break space before `; ? ! %`.
 * Text may be written with ordinary spaces and straight apostrophes; idempotent. The site applies
 * it to its French messages and content and to the French text of the API data it shows; the
 * widget to the French text of the country file.
 */
export function frenchTypography(text: string): string {
  return frenchApostrophes(text)
    .replace(/[ \u00a0\u202f]+:/g, `${NBSP}:`)
    .replace(/[ \u00a0\u202f]+([;?!%])/g, `${NNBSP}$1`)
    .replace(/«[ \u00a0\u202f]*/g, `«${NBSP}`)
    .replace(/[ \u00a0\u202f]*»/g, `${NBSP}»`)
}

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
