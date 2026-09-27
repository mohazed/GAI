/**
 * Tone lint for text written in the site's own voice (docs/02 §12.6, docs/05 §7, CLAUDE.md
 * "Site voice"): banned words, exclamation marks, summary length and the actor-first template
 * `{Actor} {past-tense verb} {object}{, qualifier}.`
 *
 * Pure functions, no I/O. The validator (`validate/rules/tone.ts`) and the summary generator
 * (P-03/P-05) share them, so a summary the generator accepts is one CI accepts.
 */
import type { BannedWord } from '../load/methodology.js'

/** docs/02 §12.6: summaries are at most 200 characters (Unicode code points, after NFC). */
export const SUMMARY_MAX_LENGTH = 200

export type SummaryLang = 'en' | 'fr'

// ---------------------------------------------------------------------------------------------
// Banned words (matching rules: header of methodology/vX.Y.Z/banned-words.txt)

/** A character that belongs to a word: letter, combining mark or digit. */
const WORD_CHAR = '[\\p{L}\\p{M}\\p{N}]'
const APOSTROPHE_CLASS = "['’]"

interface CompiledTerm {
  term: string
  re: RegExp
}

/** A compiled banned-words list. Build it once with `compileBannedWords` and reuse it. */
export interface BannedWordMatcher {
  readonly terms: readonly CompiledTerm[]
  /** Union of every term: one pass tells whether a text needs the per-term scan at all. */
  readonly any: RegExp | null
}

export interface BannedWordMatch {
  /** The entry as listed in banned-words.txt (lowercase, NFC), e.g. `courage*`. */
  term: string
  /** UTF-16 offset of the match in the NFC-normalised text. */
  index: number
  /** The matched text, as written. */
  match: string
}

/** Escapes the characters that are syntax in a `u`-flag regular expression. */
function escapeRegExp(s: string): string {
  return s.replace(/[\\^$.*+?()[\]{}|/]/g, '\\$&')
}

/**
 * The regular expression source for one term, or null for an empty term. Words are separated by
 * `\s+` (which includes U+00A0 and U+202F), ' and ’ match each other, a trailing `*` matches the
 * rest of the word, and the whole match must not touch a letter, mark or digit on either side.
 */
function termSource(raw: string): string | null {
  const term = raw.normalize('NFC').trim()
  const wildcard = term.endsWith('*')
  const body = (wildcard ? term.slice(0, -1) : term).trim()
  if (body === '') return null
  const words = body
    .split(/\s+/)
    .map((word) =>
      [...word]
        .map((ch) => (ch === "'" || ch === '’' ? APOSTROPHE_CLASS : escapeRegExp(ch)))
        .join(''),
    )
  const tail = wildcard ? `${WORD_CHAR}*` : ''
  return `(?<!${WORD_CHAR})${words.join('\\s+')}${tail}(?!${WORD_CHAR})`
}

/**
 * Compiles the entries of banned-words.txt, in file order. Entries that compile to the same
 * pattern (the ' and ’ spellings of one phrase) are kept once, under the first spelling; entries
 * that cannot compile are skipped.
 */
export function compileBannedWords(entries: readonly BannedWord[]): BannedWordMatcher {
  const terms: CompiledTerm[] = []
  const sources: string[] = []
  for (const entry of entries) {
    const source = termSource(entry.term)
    if (source === null || sources.includes(source)) continue
    try {
      terms.push({ term: entry.term, re: new RegExp(source, 'giu') })
      sources.push(source)
    } catch {
      // Unreachable with escaped input; a lint must never throw.
    }
  }
  let any: RegExp | null = null
  if (sources.length > 0) {
    try {
      any = new RegExp(sources.map((s) => `(?:${s})`).join('|'), 'iu')
    } catch {
      any = null
    }
  }
  return { terms, any }
}

/**
 * Every occurrence of a banned term in `text` (compared after NFC, case-insensitively, whole
 * words only), sorted by position, then by the term's order in the list. When two terms match
 * the same span, the one listed first is reported: one occurrence, one match.
 */
export function findBannedWords(text: string, matcher: BannedWordMatcher): BannedWordMatch[] {
  const nfc = text.normalize('NFC')
  if (matcher.any === null || !matcher.any.test(nfc)) return []
  const found: (BannedWordMatch & { order: number })[] = []
  matcher.terms.forEach(({ term, re }, order) => {
    for (const m of nfc.matchAll(re)) found.push({ term, index: m.index, match: m[0], order })
  })
  found.sort((a, b) => a.index - b.index || a.order - b.order)
  const out: BannedWordMatch[] = []
  const spans = new Set<string>()
  for (const { term, index, match } of found) {
    const span = `${index}:${match.length}`
    if (spans.has(span)) continue
    spans.add(span)
    out.push({ term, index, match })
  }
  return out
}

/**
 * The violation as a predicate, for callers to prefix with their subject: `contains the banned
 * term "historic"; …`, or `contains "Historique", which matches the banned term "historique*"; …`
 * when the text differs from the listed term.
 */
export function bannedWordMessage(m: BannedWordMatch): string {
  const what =
    m.match === m.term
      ? `the banned term "${m.term}"`
      : `"${m.match}", which matches the banned term "${m.term}"`
  return `contains ${what}; state the fact in neutral words`
}

// ---------------------------------------------------------------------------------------------
// Actor-first heuristic (docs/02 §12.6, docs/05 §7)

/**
 * Words that open a sentence with something other than the actor: a time, a place, a cause, a
 * condition, a pronoun or an editorial connector. Compared case-insensitively with the first word
 * (hyphenated words and elisions are one word: "Under-Secretary-General" is not "Under").
 */
const OPENERS: Record<SummaryLang, readonly string[]> = {
  en: [
    'on',
    'in',
    'at',
    'after',
    'following',
    'despite',
    'amid',
    'while',
    'as',
    'by',
    'with',
    'during',
    'since',
    'before',
    'when',
    'today',
    'yesterday',
    'last',
    'this',
    'that',
    'it',
    'there',
    'according',
    'also',
    'however',
    'meanwhile',
    'notably',
    'once',
    'under',
    'through',
    'over',
    'although',
    'because',
    'if',
    'for',
  ],
  fr: [
    'en',
    'après',
    'suite',
    'malgré',
    'dans',
    'lors',
    'depuis',
    'alors',
    "aujourd'hui",
    'hier',
    'selon',
    "d'après",
    'il',
    'elle',
    'ce',
    'cette',
    'par',
    'pendant',
    'avant',
    'durant',
    'face',
    'pour',
    'sur',
    'sous',
    'quand',
    'lorsque',
    "lorsqu'",
    'bien',
    'comme',
    'à',
    'au',
    'aux',
  ],
}

const MONTHS: Record<SummaryLang, readonly string[]> = {
  en: [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
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

const WEEKDAYS: Record<SummaryLang, readonly string[]> = {
  en: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
  fr: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'],
}

/** Words that introduce a date when a number, a weekday or a month follows ("Le 8 août", "On 8 August"). */
const DATE_LEADS: Record<SummaryLang, readonly string[]> = {
  en: ['on', 'in', 'by', 'since', 'from', 'until', 'at', 'during', 'before', 'after', 'between'],
  fr: ['le', 'la', 'les', 'au', 'du', 'en', 'dès', 'depuis', 'avant', 'après', 'entre', 'vers'],
}

/** Articles that may precede the actor ("The federal government…", "L'Allemagne…"). */
const ARTICLES: Record<SummaryLang, readonly string[]> = {
  en: ['the '],
  fr: ['le ', 'la ', 'les ', "l'"],
}

/** Straight quotes, low-9 quotes (Ps) and every initial or final quotation mark (Pi, Pf). */
const QUOTE_CHARS = /^["'„‚\p{Pi}\p{Pf}]/u
const FIRST_WORD = /^[\p{L}\p{M}]+(?:['’-][\p{L}\p{M}]+)*/u
const ELIDED_HEAD = /^[\p{L}\p{M}]+['’]/u

/** Lowercase, NFC, ’ → ', whitespace runs → one space: the form names are compared in. */
function fold(s: string): string {
  return s.normalize('NFC').replace(/’/g, "'").replace(/\s+/g, ' ').trim().toLowerCase()
}

export type ActorFirstReason = 'number' | 'quotation' | 'not-capital' | 'date' | 'opener'

const REASON_TEXT: Record<ActorFirstReason, string> = {
  number: 'a number',
  quotation: 'a quotation mark',
  'not-capital': 'no capital letter',
  date: 'a date',
  opener: 'an introductory word',
}

export interface ActorFirstFailure {
  reason: ActorFirstReason
  /** The first words of the summary, for the message. */
  start: string
}

export interface ActorNames {
  /** Registry name of the country in the summary's language (`countries.yaml` `name.en|fr`). */
  countryName?: string | undefined
  /** `actor.en` / `actor.fr` and `actor.name` of the event. */
  actor?: { label?: string | undefined; name?: string | undefined } | undefined
}

/** The first four words of a summary, with an ellipsis when more follow. */
function startOf(text: string): string {
  const words = text.split(/\s+/).filter((w) => w !== '')
  const head = words.slice(0, 4).join(' ')
  return words.length > 4 ? `${head} …` : head
}

/**
 * Whether a summary starts with its actor. A heuristic, not a parser: the lint has no grammar of
 * EN or FR, so it accepts what it can recognise as the actor and rejects only the openings that
 * are never the actor.
 *
 * 1. Pass when the summary starts with the country name, the actor label or the actor name (as
 *    whole words), optionally after an article (EN "The "; FR "Le ", "La ", "Les ", "L'"),
 *    case-insensitively.
 * 2. Otherwise fail when it starts with a number, a quotation mark or anything but a capital
 *    letter; with a date (a month or a weekday, or "On 8 …", "Le 8 …", "Le lundi …"); or with a
 *    word from the opener list (time, place, cause, condition, pronoun, connector).
 * 3. Otherwise pass: "Chancellor Friedrich Merz announced…" or "A federal court ruled…" start
 *    with an actor the event does not name, and a false alarm on them would train authors to
 *    ignore the rule. "The vote took place…" also passes; the second reading catches it.
 *
 * Returns null when the summary passes.
 */
export function checkActorFirst(
  text: string,
  lang: SummaryLang,
  names: ActorNames = {},
): ActorFirstFailure | null {
  const trimmed = text.normalize('NFC').trim()
  const folded = fold(trimmed)
  const candidates = [names.countryName, names.actor?.label, names.actor?.name]
    .filter((c): c is string => typeof c === 'string')
    .map(fold)
    .filter((c) => c !== '')
  const startsWithName = (prefix: string) =>
    folded.startsWith(prefix) && !/^[\p{L}\p{M}\p{N}]/u.test(folded.slice(prefix.length))
  for (const c of candidates) {
    if (startsWithName(c)) return null
    for (const article of ARTICLES[lang]) if (startsWithName(article + c)) return null
  }

  const fail = (reason: ActorFirstReason): ActorFirstFailure => ({
    reason,
    start: startOf(trimmed),
  })
  if (/^\p{N}/u.test(trimmed)) return fail('number')
  if (QUOTE_CHARS.test(trimmed)) return fail('quotation')
  if (!/^[\p{Lu}\p{Lt}]/u.test(trimmed)) return fail('not-capital')

  const first = fold(FIRST_WORD.exec(trimmed)?.[0] ?? '')
  const head = fold(ELIDED_HEAD.exec(trimmed)?.[0] ?? '')
  const isDateWord = (w: string) => MONTHS[lang].includes(w) || WEEKDAYS[lang].includes(w)
  if (isDateWord(first)) return fail('date')
  if (DATE_LEADS[lang].includes(first)) {
    const next = folded.slice(first.length).trimStart()
    const nextWord = /^[\p{L}\p{M}]+/u.exec(next)?.[0] ?? ''
    if (/^\p{N}/u.test(next) || isDateWord(nextWord)) return fail('date')
  }
  if (OPENERS[lang].includes(first) || (head !== '' && OPENERS[lang].includes(head))) {
    return fail('opener')
  }
  return null
}

// ---------------------------------------------------------------------------------------------
// Summary lint

export type ToneViolation =
  | { kind: 'banned-word'; term: string; match: string; index: number; message: string }
  | { kind: 'exclamation'; index: number; count: number; message: string }
  | { kind: 'length'; length: number; max: number; message: string }
  | { kind: 'actor-first'; reason: ActorFirstReason; start: string; message: string }

export interface LintSummaryOptions extends ActorNames {
  /** Compiled banned-words list; null skips the banned-word check. */
  matcher: BannedWordMatcher | null
}

/** Exclamation marks, upright and inverted (and their fullwidth and doubled forms). */
const EXCLAMATION = /[!¡！‼⁉⁈]/gu

/**
 * Lints one event summary. Each violation carries a `message` written as a predicate
 * ("contains …", "is 214 characters long …") so callers can prefix their own subject
 * ("EN summary …"). One violation per banned-word occurrence; at most one each for
 * exclamation marks, length and actor-first.
 */
export function lintSummary(
  text: string,
  lang: SummaryLang,
  options: LintSummaryOptions,
): ToneViolation[] {
  const nfc = text.normalize('NFC')
  const out: ToneViolation[] = []

  if (options.matcher !== null) {
    for (const m of findBannedWords(nfc, options.matcher)) {
      out.push({ kind: 'banned-word', ...m, message: bannedWordMessage(m) })
    }
  }

  const marks = [...nfc.matchAll(EXCLAMATION)]
  const firstMark = marks[0]
  if (firstMark !== undefined) {
    const index = firstMark.index
    const position = [...nfc.slice(0, index)].length + 1
    const what =
      marks.length === 1
        ? `an exclamation mark ("${firstMark[0]}" at character ${position})`
        : `${marks.length} exclamation marks (the first, "${firstMark[0]}", at character ${position})`
    out.push({
      kind: 'exclamation',
      index,
      count: marks.length,
      message: `contains ${what}; summaries state facts without exclamation marks`,
    })
  }

  const length = [...nfc].length
  if (length > SUMMARY_MAX_LENGTH) {
    out.push({
      kind: 'length',
      length,
      max: SUMMARY_MAX_LENGTH,
      message: `is ${length} characters long; summaries are at most ${SUMMARY_MAX_LENGTH} characters`,
    })
  }

  const actorFailure = checkActorFirst(nfc, lang, options)
  if (actorFailure !== null) {
    const expected = [options.countryName, options.actor?.label, options.actor?.name]
      .filter((c): c is string => typeof c === 'string' && c.trim() !== '')
      .map((c) => `"${c.trim()}"`)
    const hint = expected.length > 0 ? `, for example with ${expected.join(' or ')}` : ''
    out.push({
      kind: 'actor-first',
      ...actorFailure,
      message: `starts with "${actorFailure.start}" (${REASON_TEXT[actorFailure.reason]}) instead of the actor; summaries follow "{Actor} {past-tense verb} {object}" and start with the actor${hint}`,
    })
  }

  return out
}
