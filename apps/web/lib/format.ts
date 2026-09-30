/**
 * Display formatting (docs/05 §2). Numbers reuse @gai/scoring's formatters, so the site writes a
 * score exactly as the generated summary line does: minus sign U+2212, plus sign on positive
 * values, decimal comma and narrow no-break space in French.
 */
import {
  formatInteger,
  formatLongDate,
  formatSigned,
  frenchTypography,
  MINUS,
  NBSP,
  NNBSP,
  roundHalfAwayFromZero,
} from '@gai/scoring'
import type { Lang } from './i18n'

export { formatInteger, formatLongDate, MINUS, NBSP, NNBSP }

/** Signed value, one decimal by default: `+3`, `−1.6`, `−1,6`, `0`. */
export function signed(x: number, lang: Lang, decimals = 1): string {
  return formatSigned(x, lang, decimals)
}

/** Signed integer: `+10`, `−15`, `0`. */
export function signedInt(x: number, lang: Lang): string {
  return formatSigned(x, lang, 0)
}

/** An unsigned-looking number with the minus sign when negative, no plus: `12`, `−3.5`. */
export function plain(x: number, lang: Lang, decimals = 1): string {
  const s = formatSigned(x, lang, decimals)
  return s.startsWith('+') ? s.slice(1) : s
}

/**
 * Coverage and other shares as a whole percent, rounded half away from zero as in the summary
 * line (@gai/scoring summaryLine): `71%` in English, `71 %` (narrow no-break space) in French.
 */
export function percent(ratio: number, lang: Lang): string {
  const n = roundHalfAwayFromZero(ratio * 100, 0)
  return lang === 'fr' ? `${n}${NNBSP}%` : `${n}%`
}

/** An ISO date written long: "12 September 2026" / "12 septembre 2026". */
export function longDate(iso: string, lang: Lang): string {
  return formatLongDate(iso, lang)
}

/** Month heading: "September 2026" / "septembre 2026". */
export function monthLabel(month: string, lang: Lang): string {
  const long = formatLongDate(`${month}-01`, lang)
  return long.replace(/^1(er)? /, '')
}

/** `3f2a…e1` for a SHA-256: first four and last two hex digits. */
export function shortHash(sha256: string): string {
  return `${sha256.slice(0, 4)}…${sha256.slice(-2)}`
}

/**
 * French typography for text written with ordinary spaces and straight apostrophes (docs/05 §2):
 * no-break space before `:` and inside guillemets, narrow no-break space before `; ? ! %`, and
 * the typographic apostrophe between letters (P-18). @gai/scoring `frenchTypography`, shared with
 * the widget. Idempotent; leaves other languages alone.
 */
export const frenchPunctuation = frenchTypography

/**
 * The site's display form of API data (docs/05 §2, P-18): in every reader-facing text object
 * `{ en, fr }` (names, summaries, labels, the methodology documents, the project's responses, the
 * citation sets), each string of the `fr` member gets French typography, since the data and the
 * API keep the straight apostrophe and ordinary spaces as written. A reply's text, which carries
 * `original` (the sender's words), is left as received; quotes are plain strings, never `{ en,
 * fr }` objects, so they are never touched. Returns a new value; the input is not changed.
 */
export function frenchDisplay<T>(value: T): T {
  if (Array.isArray(value)) return value.map(frenchDisplay) as T
  if (value === null || typeof value !== 'object') return value
  const o = value as Record<string, unknown>
  const langText = 'en' in o && 'fr' in o && !('original' in o)
  return Object.fromEntries(
    Object.entries(o).map(([k, v]) => [
      k,
      langText && k === 'fr' ? frenchMessages(v) : frenchDisplay(v),
    ]),
  ) as T
}

/** Apply `frenchPunctuation` to every string of a messages tree. */
export function frenchMessages<T>(tree: T): T {
  if (typeof tree === 'string') return frenchPunctuation(tree) as T
  if (Array.isArray(tree)) return tree.map(frenchMessages) as T
  if (tree !== null && typeof tree === 'object') {
    return Object.fromEntries(Object.entries(tree).map(([k, v]) => [k, frenchMessages(v)])) as T
  }
  return tree
}

/**
 * A file size in decimal units: `830 bytes`, `412 kB`, `1.4 MB` / `830 octets`, `412 ko`,
 * `1,4 Mo`.
 */
export function fileSize(bytes: number, lang: Lang): string {
  const fr = lang === 'fr'
  if (bytes < 1000) return `${formatInteger(bytes, lang)}${NBSP}${fr ? 'octets' : 'bytes'}`
  if (bytes < 1_000_000)
    return `${formatInteger(Math.round(bytes / 1000), lang)}${NBSP}${fr ? 'ko' : 'kB'}`
  return `${plain(bytes / 1_000_000, lang, 1)}${NBSP}${fr ? 'Mo' : 'MB'}`
}
