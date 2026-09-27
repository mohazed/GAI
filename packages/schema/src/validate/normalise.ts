/**
 * Text normalisation shared by the validator.
 *
 * Quotes (docs/02 §12.4, docs/03 §4): a quote must appear verbatim in
 * `archive/text/{source}.txt`. Text extraction from HTML or PDF moves line breaks, turns spaces
 * into non-breaking spaces and leaves invisible break hints, so both sides are normalised the same
 * way before comparing:
 *
 * - Unicode NFC (a precomposed `é` equals `e` + U+0301);
 * - the soft hyphen U+00AD and the zero-width characters U+200B–U+200D, U+2060 and U+FEFF are
 *   removed;
 * - every run of whitespace (JavaScript `\s`: space, tab, line breaks, U+00A0, U+202F,
 *   U+2000–U+200A, U+3000, U+2028, U+2029…) becomes one ASCII space;
 * - leading and trailing whitespace is removed.
 *
 * Nothing else is normalised: quotation marks, apostrophes, dashes and letter case must match.
 *
 * Names (`foldName`): publishers and speakers are compared in a looser form, so that spelling
 * noise cannot make one publisher or speaker count as two.
 */

const INVISIBLE = /[­​-‍⁠﻿]/g
const WHITESPACE = /\s+/g

export function normaliseWhitespace(s: string): string {
  return s.normalize('NFC').replace(INVISIBLE, '').replace(WHITESPACE, ' ').trim()
}

/**
 * A search over one text, normalised once, for checking several quotes against it: returns true
 * when a quote appears in the text once both are whitespace-normalised. The quote check of the
 * validator and `containsQuote` share it, so the two comparisons cannot drift apart.
 */
export function quoteSearcher(text: string): (quote: string) => boolean {
  const normalised = normaliseWhitespace(text)
  return (quote) => normalised.includes(normaliseWhitespace(quote))
}

/** True when `quote` appears in `text` once both are whitespace-normalised. */
export function containsQuote(text: string, quote: string): boolean {
  return quoteSearcher(text)(quote)
}

/** Format characters (soft hyphen, zero-width characters, bidi marks, BOM…). */
const FORMAT_CHARS = /\p{Cf}/gu
const TRAILING_PUNCTUATION = /[\s\p{Po}]+$/u

/**
 * The form in which publisher and speaker names are compared (event.corroborated-publishers,
 * event.disputed-both-sides, event.statement-duplicate): Unicode NFKC (fullwidth letters and
 * compatibility forms fold to their plain form), format characters removed, whitespace runs
 * (U+00A0 included) collapsed to one space, trailing punctuation (`.`, `,`, `;`…) removed,
 * lowercase. "Der  Spiegel", "Der Spiegel", "DER SPIEGEL" and "Der Spiegel." fold to
 * "der spiegel".
 */
export function foldName(s: string): string {
  return s
    .normalize('NFKC')
    .replace(FORMAT_CHARS, '')
    .replace(WHITESPACE, ' ')
    .trim()
    .replace(TRAILING_PUNCTUATION, '')
    .toLowerCase()
}
