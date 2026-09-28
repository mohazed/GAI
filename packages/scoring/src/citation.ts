/**
 * "Cite this" strings (docs/04 §3, docs/05 §5 CiteThis): APA, Chicago and plain, in English and
 * French, from the country, score, band, methodology version, date and the dated permalink
 * `{site}/{lang}/country/{ISO3}?date=YYYY-MM-DD`. The project is signed by its author (D-01).
 *
 * Plain (docs/05 §5): Gaza Accountability Index, Germany: −14 (Passive), methodology v1.0.0, as of
 * 26 September 2026, https://…/en/country/DEU?date=2026-09-26
 *
 * In scorecard mode (D-16) the score and band are replaced by "scorecard".
 */
import { formatLongDate, formatSigned, monthName, NBSP } from './format.js'
import { dateParts, isIsoDate } from './time.js'
import type { Lang, LangText } from './types.js'

export const INDEX_TITLE = 'Gaza Accountability Index'

export interface Author {
  readonly family: string
  readonly given: string
  /** As APA writes them, e.g. `M.`. */
  readonly initials: string
}

/** The signed author (D-01); pass another `author` after a hand-over, no code change needed. */
export const AUTHOR: Author = Object.freeze({ family: 'Zouad', given: 'Mohamed', initials: 'M.' })

export type CitationStyle = 'apa' | 'chicago' | 'plain'
export const CITATION_STYLES: readonly CitationStyle[] = ['apa', 'chicago', 'plain']

export interface CitationInput {
  readonly iso3: string
  readonly countryName: LangText
  /** `YYYY-MM-DD`, the date of the snapshot cited. */
  readonly date: string
  /** e.g. `1.0.0`; printed as `v1.0.0`. */
  readonly methodologyVersion: string
  /** null in scorecard mode (D-16). */
  readonly score: { readonly display: number; readonly bandName: LangText } | null
  /** Site origin, e.g. `https://gaza-accountability-index.pages.dev` (trailing slash ignored). */
  readonly siteUrl: string
  /** Default: AUTHOR (D-01). */
  readonly author?: Author | undefined
}

/** The dated permalink of a country page in one language. */
export function permalink(siteUrl: string, lang: Lang, iso3: string, date: string): string {
  if (!/^https?:\/\/\S+$/.test(siteUrl))
    throw new RangeError(`expected an http(s) URL, got ${siteUrl}`)
  if (!/^[A-Z]{3}$/.test(iso3)) throw new RangeError(`expected an ISO3 code, got ${iso3}`)
  if (!isIsoDate(date)) throw new RangeError(`expected a date YYYY-MM-DD, got ${date}`)
  return `${siteUrl.replace(/\/+$/, '')}/${lang}/country/${iso3}?date=${date}`
}

const WORDS = {
  en: {
    methodology: 'methodology',
    asOf: 'as of',
    dataset: 'Data set',
    version: (v: string) => `Methodology version ${v}`,
    scorecard: 'scorecard',
  },
  fr: {
    methodology: 'méthodologie',
    asOf: 'au',
    dataset: 'Jeu de données',
    version: (v: string) => `méthodologie, version ${v}`,
    scorecard: "fiche d'évaluation",
  },
} as const

/** "Germany: −14 (Passive)" / "Allemagne : −14 (Passivité)", or the scorecard form. */
function subject(input: CitationInput, lang: Lang): string {
  const name = input.countryName[lang]
  if (input.score === null) return `${name} (${WORDS[lang].scorecard})`
  const colon = lang === 'fr' ? `${NBSP}:` : ':'
  return `${name}${colon} ${formatSigned(input.score.display, lang, 0)} (${input.score.bandName[lang]})`
}

/** One citation of `subj` at `url`: the three styles share everything but the subject and link. */
function cite(
  subj: string,
  url: string,
  date: string,
  methodologyVersion: string,
  author: Author,
  style: CitationStyle,
  lang: Lang,
): string {
  const w = WORDS[lang]
  const version = `v${methodologyVersion}`
  const { year, month, day } = dateParts(date)
  switch (style) {
    case 'plain':
      return `${INDEX_TITLE}, ${subj}, ${w.methodology} ${version}, ${w.asOf} ${formatLongDate(date, lang)}, ${url}`
    case 'apa': {
      const when =
        lang === 'fr'
          ? `${year}, ${day === 1 ? '1er' : day} ${monthName(month, lang)}`
          : `${year}, ${monthName(month, lang)} ${day}`
      // APA 7 data set: Author. (Date). Title (Version) [Data set]. Publisher. URL
      return `${author.family}, ${author.initials} (${when}). ${subj} (${w.version(methodologyVersion)}) [${w.dataset}]. ${INDEX_TITLE}. ${url}`
    }
    case 'chicago': {
      const when =
        lang === 'fr' ? formatLongDate(date, lang) : `${monthName(month, lang)} ${day}, ${year}`
      const title = lang === 'fr' ? `«${NBSP}${subj}${NBSP}».` : `“${subj}.”`
      return `${author.family}, ${author.given}. ${title} ${INDEX_TITLE}, ${w.methodology} ${version}, ${when}. ${url}.`
    }
  }
}

/** One citation. */
export function citation(input: CitationInput, style: CitationStyle, lang: Lang): string {
  const url = permalink(input.siteUrl, lang, input.iso3, input.date)
  return cite(
    subject(input, lang),
    url,
    input.date,
    input.methodologyVersion,
    input.author ?? AUTHOR,
    style,
    lang,
  )
}

/** The three citations in one language. */
export function citations(input: CitationInput, lang: Lang): Record<CitationStyle, string> {
  return {
    apa: citation(input, 'apa', lang),
    chicago: citation(input, 'chicago', lang),
    plain: citation(input, 'plain', lang),
  }
}

/** At most five countries are compared (docs/05 §6 Compare). */
export const MAX_COMPARED = 5

export interface ComparisonInput {
  /** One to five countries, in the order chosen; `score` null in scorecard mode (D-16). */
  readonly countries: readonly Pick<CitationInput, 'iso3' | 'countryName' | 'score'>[]
  /** `YYYY-MM-DD`: the build date, the date of the data compared. */
  readonly date: string
  readonly methodologyVersion: string
  readonly siteUrl: string
  readonly author?: Author | undefined
}

/**
 * The permalink of a comparison: `{site}/{lang}/compare?c=DEU,FRA` (the Compare page reads `c`,
 * docs/04 §3). It is not dated: the page shows the build's data, and the citation names the date.
 */
export function comparePermalink(siteUrl: string, lang: Lang, iso3s: readonly string[]): string {
  if (!/^https?:\/\/\S+$/.test(siteUrl))
    throw new RangeError(`expected an http(s) URL, got ${siteUrl}`)
  if (iso3s.length === 0 || iso3s.length > MAX_COMPARED)
    throw new RangeError(`expected 1 to ${MAX_COMPARED} countries, got ${iso3s.length}`)
  for (const iso3 of iso3s)
    if (!/^[A-Z]{3}$/.test(iso3)) throw new RangeError(`expected an ISO3 code, got ${iso3}`)
  return `${siteUrl.replace(/\/+$/, '')}/${lang}/compare?c=${iso3s.join(',')}`
}

const COMPARISON = {
  en: { title: 'Comparison', scorecards: 'scorecards' },
  fr: { title: 'Comparaison', scorecards: "fiches d'évaluation" },
} as const

/**
 * "Comparison: Germany −14 (Passive), France +3 (Acting)" / "Comparaison : Allemagne −14
 * (Passivité), …"; in scorecard mode "Comparison: Germany, France (scorecards)".
 */
function comparisonSubject(input: ComparisonInput, lang: Lang): string {
  const colon = lang === 'fr' ? `${NBSP}:` : ':'
  const w = COMPARISON[lang]
  const scored = input.countries.every((c) => c.score !== null)
  const names = input.countries.map((c) =>
    scored && c.score !== null
      ? `${c.countryName[lang]} ${formatSigned(c.score.display, lang, 0)} (${c.score.bandName[lang]})`
      : c.countryName[lang],
  )
  return `${w.title}${colon} ${names.join(', ')}${scored ? '' : ` (${w.scorecards})`}`
}

/** The three citations of a comparison of one to five countries (docs/05 §6 Compare, "Cite"). */
export function comparisonCitations(
  input: ComparisonInput,
  lang: Lang,
): Record<CitationStyle, string> {
  if (!isIsoDate(input.date)) throw new RangeError(`expected a date YYYY-MM-DD, got ${input.date}`)
  const url = comparePermalink(
    input.siteUrl,
    lang,
    input.countries.map((c) => c.iso3),
  )
  const subj = comparisonSubject(input, lang)
  const author = input.author ?? AUTHOR
  const one = (style: CitationStyle) =>
    cite(subj, url, input.date, input.methodologyVersion, author, style, lang)
  return { apa: one('apa'), chicago: one('chicago'), plain: one('plain') }
}

export interface DatasetCitationInput {
  /** `YYYY-MM-DD`: the build date of the dataset cited. */
  readonly date: string
  readonly methodologyVersion: string
  readonly siteUrl: string
  readonly author?: Author | undefined
}

const DATASET = {
  en: { title: 'Dataset and API' },
  fr: { title: 'Données et API' },
} as const

/** The permalink of the dataset: the Data page, `{site}/{lang}/data/`. */
export function datasetPermalink(siteUrl: string, lang: Lang): string {
  if (!/^https?:\/\/\S+$/.test(siteUrl))
    throw new RangeError(`expected an http(s) URL, got ${siteUrl}`)
  return `${siteUrl.replace(/\/+$/, '')}/${lang}/data/`
}

/**
 * The three citations of the whole dataset (the Data page, docs/05 §6 Data): "Gaza
 * Accountability Index, Dataset and API, methodology v1.0.0, as of 26 September 2026,
 * https://…/en/data/". It names the build date; the files of that build are listed with their
 * hashes in its manifest.json.
 */
export function datasetCitations(
  input: DatasetCitationInput,
  lang: Lang,
): Record<CitationStyle, string> {
  if (!isIsoDate(input.date)) throw new RangeError(`expected a date YYYY-MM-DD, got ${input.date}`)
  const url = datasetPermalink(input.siteUrl, lang)
  const author = input.author ?? AUTHOR
  const one = (style: CitationStyle) =>
    cite(DATASET[lang].title, url, input.date, input.methodologyVersion, author, style, lang)
  return { apa: one('apa'), chicago: one('chicago'), plain: one('plain') }
}
