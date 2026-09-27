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
/**
 * Invisible format characters (soft hyphen, zero-width space and joiners, word joiner, BOM, bidi
 * marks…): they render as nothing, so a term matches with any of them between its characters,
 * and they neither start nor end a word.
 */
const INVISIBLE = '\\p{Cf}*'

/**
 * Folds, for matching only, characters that render like the ones a term is written with; every
 * replacement is one UTF-16 unit for one, so offsets in the folded text are offsets in the text:
 * fullwidth ASCII forms (U+FF01–U+FF5E) become ASCII, and the apostrophe look-alikes U+02BC,
 * U+2018, U+0060 and U+00B4 become '.
 */
function foldForMatch(text: string): string {
  return text
    .replace(/[\uFF01-\uFF5E]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0))
    .replace(/[\u02BC\u2018\u0060\u00B4]/g, "'")
}

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
 * Invisible format characters (`\p{Cf}`) are ignored inside and around the term.
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
        .join(INVISIBLE),
    )
  const tail = wildcard ? `(?:${INVISIBLE}${WORD_CHAR})*` : ''
  return `(?<!${WORD_CHAR}${INVISIBLE})${words.join(`${INVISIBLE}\\s[\\s\\p{Cf}]*`)}${tail}(?!${INVISIBLE}${WORD_CHAR})`
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
 * the same span, the one listed first is reported: one occurrence, one match. So that a term
 * cannot be hidden by characters that render the same, invisible format characters are ignored
 * (`bru\u00ADtal` is `brutal`), fullwidth letters match their ASCII forms, and the apostrophe
 * look-alikes ʼ ‘ ` ´ match ' and ’. Offsets and matched text refer to the NFC text as written.
 */
export function findBannedWords(text: string, matcher: BannedWordMatcher): BannedWordMatch[] {
  const nfc = text.normalize('NFC')
  const folded = foldForMatch(nfc)
  if (matcher.any === null || !matcher.any.test(folded)) return []
  const found: (BannedWordMatch & { order: number })[] = []
  matcher.terms.forEach(({ term, re }, order) => {
    for (const m of folded.matchAll(re)) {
      found.push({ term, index: m.index, match: nfc.slice(m.index, m.index + m[0].length), order })
    }
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
    'mid',
    'early',
    'late',
    'later',
    'earlier',
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
    'fin',
    'début',
    'mi',
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

/**
 * Abbreviated months. Some are also names ("Jan", "Mar"), so they count as a date only when a
 * full stop or a number follows ("Aug. 8", "Sept 8", "janv. 2025").
 */
const MONTH_ABBREVIATIONS: Record<SummaryLang, readonly string[]> = {
  en: ['jan', 'feb', 'mar', 'apr', 'jun', 'jul', 'aug', 'sep', 'sept', 'oct', 'nov', 'dec'],
  fr: ['janv', 'févr', 'fév', 'avr', 'juil', 'sept', 'oct', 'nov', 'déc'],
}

/** Units of time: "Two days later", "Deux jours plus tard", "A week after" open with a date. */
const TIME_UNITS: Record<SummaryLang, readonly string[]> = {
  en: ['day', 'days', 'week', 'weeks', 'month', 'months', 'year', 'years', 'hour', 'hours'],
  fr: [
    'jour',
    'jours',
    'semaine',
    'semaines',
    'mois',
    'an',
    'ans',
    'année',
    'années',
    'heure',
    'heures',
  ],
}

/**
 * Words that place a date within a period ("Mid-August", "Mi-août", "Late August", "Fin août"):
 * a date when a month, a weekday or a number follows, with a hyphen or a space.
 */
const TIME_PREFIXES: Record<SummaryLang, readonly string[]> = {
  en: ['mid', 'early', 'late'],
  fr: ['mi', 'fin', 'début'],
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
 * Why an opening is never the actor, from its form alone (step 2 of `checkActorFirst`), or null.
 * `text` is NFC and trimmed.
 */
function openingFailure(text: string, lang: SummaryLang): ActorFirstReason | null {
  const folded = fold(text)
  if (/^\p{N}/u.test(text)) return 'number'
  if (QUOTE_CHARS.test(text)) return 'quotation'
  if (!/^[\p{Lu}\p{Lt}]/u.test(text)) return 'not-capital'

  const first = fold(FIRST_WORD.exec(text)?.[0] ?? '')
  const head = fold(ELIDED_HEAD.exec(text)?.[0] ?? '')
  const words = folded.split(/[\s,;:]+/).filter((w) => w !== '')
  const second = /^[\p{L}\p{M}]+/u.exec(words[1] ?? '')?.[0] ?? ''
  const isDateWord = (w: string) => MONTHS[lang].includes(w) || WEEKDAYS[lang].includes(w)
  if (isDateWord(first)) return 'date'
  if (MONTH_ABBREVIATIONS[lang].includes(first)) {
    const rest = folded.slice(first.length)
    if (/^(?:\.|\s*\p{N})/u.test(rest)) return 'date'
  }
  const [hyphenHead = '', hyphenNext = ''] = first.split('-')
  if (TIME_PREFIXES[lang].includes(hyphenHead) && isDateWord(hyphenNext)) return 'date'
  if (TIME_UNITS[lang].includes(first) || TIME_UNITS[lang].includes(second)) return 'date'
  if (DATE_LEADS[lang].includes(first) || TIME_PREFIXES[lang].includes(first)) {
    const next = folded.slice(first.length).trimStart()
    const nextWord = /^[\p{L}\p{M}]+/u.exec(next)?.[0] ?? ''
    if (/^\p{N}/u.test(next) || isDateWord(nextWord)) return 'date'
  }
  if (OPENERS[lang].includes(first) || (head !== '' && OPENERS[lang].includes(head))) {
    return 'opener'
  }
  return null
}

/**
 * True when a country name, actor label or actor name cannot be an actor because it opens like a
 * number, a quotation, an introductory word or a dated phrase ("On 8 August 2025"). A name that
 * merely starts with a month or weekday word and holds no digit ("May Mansour", "August Hanning")
 * stays a name.
 */
function notAName(name: string, lang: SummaryLang): boolean {
  // Judge the name's form as if it opened a sentence (capitalised).
  const reason = openingFailure(name.charAt(0).toUpperCase() + name.slice(1), lang)
  if (reason === 'date') return /\p{N}/u.test(name)
  return reason === 'number' || reason === 'quotation' || reason === 'opener'
}

/**
 * Whether a summary starts with its actor. A heuristic, not a parser: the lint has no grammar of
 * EN or FR, so it accepts what it can recognise as the actor and rejects only the openings that
 * are never the actor.
 *
 * 1. Pass when the summary starts with the country name, the actor label or the actor name (as
 *    whole words), optionally after an article (EN "The "; FR "Le ", "La ", "Les ", "L'"),
 *    case-insensitively. A name that itself opens like a date or an introductory word ("On
 *    8 August 2025") is not accepted as an actor.
 * 2. Otherwise fail when it starts with a number, a quotation mark or anything but a capital
 *    letter; with a date (a month, abbreviated with a full stop or a number after it, or a
 *    weekday; "On 8 …", "Le 8 …", "Le lundi …"; "Mid-August", "Fin août"; a unit of time among
 *    the first two words, "Two days later"); or with a word from the opener list (time, place,
 *    cause, condition, pronoun, connector).
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
    .map((c) => c.normalize('NFC').trim())
    .filter((c) => c !== '' && !notAName(c, lang))
    .map(fold)
  const startsWithName = (prefix: string) =>
    folded.startsWith(prefix) && !/^[\p{L}\p{M}\p{N}]/u.test(folded.slice(prefix.length))
  for (const c of candidates) {
    if (startsWithName(c)) return null
    for (const article of ARTICLES[lang]) if (startsWithName(article + c)) return null
  }

  const reason = openingFailure(trimmed, lang)
  return reason === null ? null : { reason, start: startOf(trimmed) }
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

/**
 * Exclamation marks, upright and inverted, and the characters that render as one: fullwidth
 * (U+FF01), small (U+FE57), doubled and combined (U+203C, U+2049, U+2048), the emoji and
 * ornament forms (U+2755, U+2757, U+2762) and the Latin letter click U+01C3.
 */
const EXCLAMATION = /[!¡！﹗‼⁉⁈❕❗❢ǃ]/gu

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
