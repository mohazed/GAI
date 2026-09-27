/**
 * Display formatting (docs/05 §2). Numbers reuse @gai/scoring's formatters, so the site writes a
 * score exactly as the generated summary line does: minus sign U+2212, plus sign on positive
 * values, decimal comma and narrow no-break space in French.
 */
import {
  formatInteger,
  formatLongDate,
  formatSigned,
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
 * French typography for text written with ordinary spaces (docs/05 §2): no-break space before
 * `:` and inside guillemets, narrow no-break space before `; ? ! %`. Idempotent; leaves other
 * languages alone.
 */
export function frenchPunctuation(text: string): string {
  return text
    .replace(/[   ]+:/g, `${NBSP}:`)
    .replace(/[   ]+([;?!%])/g, `${NNBSP}$1`)
    .replace(/«[   ]*/g, `«${NBSP}`)
    .replace(/[   ]*»/g, `${NBSP}»`)
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
