/**
 * Whitespace normalisation for the quote check (docs/02 §12.4, docs/03 §4).
 *
 * A quote must appear verbatim in `archive/text/{source}.txt`. Text extraction from HTML or PDF
 * moves line breaks, turns spaces into non-breaking spaces and leaves invisible break hints, so
 * both sides are normalised the same way before comparing:
 *
 * - Unicode NFC (a precomposed `é` equals `e` + U+0301);
 * - the soft hyphen U+00AD and the zero-width characters U+200B–U+200D, U+2060 and U+FEFF are
 *   removed;
 * - every run of whitespace (JavaScript `\s`: space, tab, line breaks, U+00A0, U+202F,
 *   U+2000–U+200A, U+3000, U+2028, U+2029…) becomes one ASCII space;
 * - leading and trailing whitespace is removed.
 *
 * Nothing else is normalised: quotation marks, apostrophes, dashes and letter case must match.
 */

const INVISIBLE = /[\u00AD\u200B-\u200D\u2060\uFEFF]/g
const WHITESPACE = /\s+/g

export function normaliseWhitespace(s: string): string {
  return s.normalize('NFC').replace(INVISIBLE, '').replace(WHITESPACE, ' ').trim()
}

/** True when `quote` appears in `text` once both are whitespace-normalised. */
export function containsQuote(text: string, quote: string): boolean {
  return normaliseWhitespace(text).includes(normaliseWhitespace(quote))
}
