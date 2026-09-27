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

/** One citation. */
export function citation(input: CitationInput, style: CitationStyle, lang: Lang): string {
  const url = permalink(input.siteUrl, lang, input.iso3, input.date)
  const w = WORDS[lang]
  const author = input.author ?? AUTHOR
  const version = `v${input.methodologyVersion}`
  const subj = subject(input, lang)
  const { year, month, day } = dateParts(input.date)
  switch (style) {
    case 'plain':
      return `${INDEX_TITLE}, ${subj}, ${w.methodology} ${version}, ${w.asOf} ${formatLongDate(input.date, lang)}, ${url}`
    case 'apa': {
      const when =
        lang === 'fr'
          ? `${year}, ${day === 1 ? '1er' : day} ${monthName(month, lang)}`
          : `${year}, ${monthName(month, lang)} ${day}`
      // APA 7 data set: Author. (Date). Title (Version) [Data set]. Publisher. URL
      return `${author.family}, ${author.initials} (${when}). ${subj} (${w.version(input.methodologyVersion)}) [${w.dataset}]. ${INDEX_TITLE}. ${url}`
    }
    case 'chicago': {
      const when =
        lang === 'fr'
          ? formatLongDate(input.date, lang)
          : `${monthName(month, lang)} ${day}, ${year}`
      const title = lang === 'fr' ? `«${NBSP}${subj}${NBSP}».` : `“${subj}.”`
      return `${author.family}, ${author.given}. ${title} ${INDEX_TITLE}, ${w.methodology} ${version}, ${when}. ${url}.`
    }
  }
}

/** The three citations in one language. */
export function citations(input: CitationInput, lang: Lang): Record<CitationStyle, string> {
  return {
    apa: citation(input, 'apa', lang),
    chicago: citation(input, 'chicago', lang),
    plain: citation(input, 'plain', lang),
  }
}
