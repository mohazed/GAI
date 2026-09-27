/**
 * What the country page takes from the API besides its components' props: peers, the share card
 * path, the JSON-LD Dataset record. Values are copied from the API; nothing restates a rule.
 */
import type { ApiCountriesFile, ApiScoredCountry, ApiScoredCountryFile } from '@gai/schema/api'
import type { Lang } from './i18n'
import type { Mode } from './mode'

export interface Peer {
  iso3: string
  name: { en: string; fr: string }
}

export interface Peers {
  region: Peer[]
  /** Score mode only: the band is not shown before the flip (D-16). */
  band: Peer[]
}

const byIso = (a: { iso3: string }, b: { iso3: string }) =>
  a.iso3 < b.iso3 ? -1 : a.iso3 > b.iso3 ? 1 : 0

/**
 * "Compare with peers" (docs/05 §6 Country): up to `n` scored countries of the same region and,
 * in score mode, of the same band. Score mode takes the nearest scores (ties by ISO3); scorecard
 * mode, which has no score to measure distance with, takes the same subregion first, then ISO3.
 */
export function peersOf(
  file: ApiCountriesFile,
  self: Pick<ApiScoredCountry, 'iso3' | 'region' | 'subregion' | 'band' | 'score'>,
  mode: Mode,
  n = 4,
): Peers {
  const others = file.countries.filter(
    (c): c is ApiScoredCountry => !c.excluded && c.iso3 !== self.iso3,
  )
  const near = (a: ApiScoredCountry, b: ApiScoredCountry) =>
    Math.abs(a.score - self.score) - Math.abs(b.score - self.score) || byIso(a, b)
  const sub = (a: ApiScoredCountry, b: ApiScoredCountry) =>
    Number(b.subregion === self.subregion) - Number(a.subregion === self.subregion) || byIso(a, b)
  const pick = (xs: ApiScoredCountry[]) =>
    xs.slice(0, n).map((c) => ({ iso3: c.iso3, name: c.name }))
  const region = others.filter((c) => c.region === self.region)
  return {
    region: pick(region.sort(mode === 'score' ? near : sub)),
    band: mode === 'score' ? pick(others.filter((c) => c.band === self.band).sort(near)) : [],
  }
}

/** The share card of a country page: `/cards/{ISO3}.png` in English, `/cards/fr/{ISO3}.png`. */
export function cardPath(lang: Lang, iso3: string): string {
  return lang === 'en' ? `/cards/${iso3}.png` : `/cards/fr/${iso3}.png`
}

/** `/compare/?c=DEU,FRA,…`, at most five countries (docs/05 §6 Compare). */
export function compareHref(lang: Lang, iso3s: readonly string[]): string {
  return `/${lang}/compare/?c=${[...new Set(iso3s)].slice(0, 5).join(',')}`
}

/**
 * The JSON-LD Dataset of a country page (schema.org), serialised for a
 * <script type="application/ld+json">: `<` is escaped so the text cannot close the element.
 */
export function datasetJsonLd(args: {
  file: ApiScoredCountryFile
  lang: Lang
  siteUrl: string
  siteName: string
  description: string
  author: string
  windowStart: string
  mode: Mode
}): string {
  const { file, lang, siteUrl, siteName, description, author, windowStart, mode } = args
  const base = siteUrl.replace(/\/$/, '')
  const record = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `${siteName}: ${file.name[lang]}`,
    description,
    url: `${base}/${lang}/country/${file.iso3}/`,
    inLanguage: lang,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    isAccessibleForFree: true,
    creator: { '@type': 'Person', name: author },
    version: file.methodology,
    dateModified: file.build_date,
    temporalCoverage: `${windowStart}/${file.build_date}`,
    citation: (mode === 'score' ? file.citations.score : file.citations.scorecard)[lang].plain,
    isPartOf: { '@type': 'Dataset', name: siteName, url: `${base}/${lang}/` },
    distribution: [
      {
        '@type': 'DataDownload',
        encodingFormat: 'application/json',
        contentUrl: `${base}/api/v1/countries/${file.iso3}.json`,
      },
      {
        '@type': 'DataDownload',
        encodingFormat: 'application/json',
        contentUrl: `${base}/api/v1/countries/${file.iso3}/events.json`,
      },
    ],
  }
  return JSON.stringify(record).replace(/</g, '\\u003c')
}
