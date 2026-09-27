import { AUTHOR } from '@gai/scoring'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { CountryBody, ExcludedBody } from '../../../../components/CountryPage'
import { publicApi } from '../../../../lib/api'
import { cardPath, peersOf } from '../../../../lib/country'
import { signedInt } from '../../../../lib/format'
import { getT, isLang, LOCALES } from '../../../../lib/i18n'
import { bandById, siteMethodology } from '../../../../lib/methodology'
import { SITE_MODE } from '../../../../lib/mode'
import { alternatesFor } from '../../../../lib/seo'

export const dynamicParams = false

const API_BASE = '/api/v1'

/** Every registry entry has a page: scored countries and the excluded entities (D-10). */
export function generateStaticParams() {
  const iso3s = publicApi.countries().countries.map((c) => c.iso3)
  return LOCALES.flatMap((locale) => iso3s.map((iso3) => ({ locale, iso3 })))
}

type Params = Promise<{ locale: string; iso3: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale: lang, iso3 } = await params
  if (!isLang(lang)) return {}
  const t = getT(lang)
  const file = publicApi.country(iso3)
  const name = file.name[lang]
  let title: string
  let description: string
  if (file.excluded) {
    title = t('country.metaTitleExcluded', { country: name })
    description = file.excluded_reason[lang]
  } else if (SITE_MODE === 'score') {
    const m = siteMethodology(publicApi.methodology(file.methodology))
    title = t('country.metaTitle', {
      country: name,
      score: signedInt(file.score_display, lang),
      band: bandById(m, file.band).name[lang],
    })
    description = file.summary[lang]
  } else {
    title = name
    description = file.summary_scorecard[lang]
  }
  const path = `country/${iso3}/`
  const image = {
    url: cardPath(lang, iso3),
    width: 1200,
    height: 630,
    alt: `${name} · ${t('common.siteName')}`,
  }
  return {
    title,
    description,
    alternates: alternatesFor(lang, path),
    openGraph: {
      type: 'website',
      siteName: t('common.siteName'),
      title,
      description,
      url: `/${lang}/${path}`,
      locale: lang === 'en' ? 'en_GB' : 'fr_FR',
      images: [image],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image.url] },
  }
}

/**
 * Country page (docs/05 §6 Country), one per registry entry, read from countries/{ISO3}.json.
 * The excluded entities (ISR, PSE, D-10) get an explanatory page, not a scorecard.
 */
export default async function Country({ params }: { params: Params }) {
  const { locale: lang, iso3 } = await params
  if (!isLang(lang)) notFound()
  setRequestLocale(lang)
  const file = publicApi.country(iso3)
  if (file.excluded) return <ExcludedBody lang={lang} file={file} apiBase={API_BASE} />
  const manifest = publicApi.manifest()
  const methodology = siteMethodology(publicApi.methodology(file.methodology))
  return (
    <CountryBody
      lang={lang}
      mode={SITE_MODE}
      methodology={methodology}
      file={file}
      peers={peersOf(publicApi.countries(), file, SITE_MODE)}
      gitSha={manifest.git.sha}
      apiBase={API_BASE}
      card={cardPath(lang, iso3)}
      siteUrl={manifest.site_url}
      author={`${AUTHOR.given} ${AUTHOR.family}`}
    />
  )
}
