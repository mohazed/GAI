/**
 * Text normalisation shared by the validator.
 *
 * Quotes (docs/02 §12.4, docs/03 §4): a quote must appear verbatim in
 * `archive/text/{source}.txt`. Text extraction from HTML or PDF moves line breaks, turns spaces
 * into non-breaking spaces and leaves invisible break hints, so both sides are normalised the same
 * way before comparing:
 *
 * - invisible format characters are removed: the soft hyphen U+00AD, the zero-width characters
 *   U+200B–U+200D, U+2060 and U+FEFF, and the bidirectional marks, embeddings, overrides and
 *   isolates (U+200E, U+200F, U+061C, U+202A–U+202E, U+2066–U+2069) that text extraction leaves
 *   in right-to-left scripts, so an Arabic quote matches its archived text with or without them;
 * - Unicode NFC (a precomposed `é` equals `e` + U+0301), applied after the removal so that a
 *   mark left between a letter and its combining accent does not keep them apart;
 * - every run of whitespace (JavaScript `\s`: space, tab, line breaks, U+00A0, U+202F,
 *   U+2000–U+200A, U+3000, U+2028, U+2029…) becomes one ASCII space;
 * - leading and trailing whitespace is removed.
 *
 * Nothing else is normalised: quotation marks, apostrophes, dashes and letter case must match.
 *
 * Names (`foldName`): publishers and speakers are compared in a looser form, so that spelling
 * noise cannot make one publisher or speaker count as two.
 */

/**
 * Invisible format characters removed before comparing: the soft hyphen U+00AD; the zero-width
 * space, non-joiner and joiner U+200B–U+200D; the word joiner U+2060; the byte order mark U+FEFF;
 * and the bidirectional format characters, which PDF and HTML extraction of Arabic, Hebrew or
 * Persian text scatters around words: the left-to-right and right-to-left marks U+200E and
 * U+200F, the Arabic letter mark U+061C, the embeddings and overrides U+202A–U+202E and the
 * isolates U+2066–U+2069.
 */
const INVISIBLE = /[\u00AD\u061C\u200B-\u200F\u202A-\u202E\u2060\u2066-\u2069\uFEFF]/g
const WHITESPACE = /\s+/g

export function normaliseWhitespace(s: string): string {
  return s.replace(INVISIBLE, '').normalize('NFC').replace(WHITESPACE, ' ').trim()
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
