import type { ApiScoredCountry } from '@gai/schema/api'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { ComparePanel } from '../../../components/ComparePanel'
import { publicApi } from '../../../lib/api'
import { MAX_COMPARE } from '../../../lib/compare'
import { longDate } from '../../../lib/format'
import { compareClientMessages, getT, isLang } from '../../../lib/i18n'
import { siteMethodology } from '../../../lib/methodology'
import { SITE_MODE } from '../../../lib/mode'
import { alternatesFor } from '../../../lib/seo'

const API_BASE = '/api/v1'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLang(locale)) return {}
  const t = getT(locale)
  const countries = publicApi.countries()
  const m = siteMethodology(publicApi.methodology(countries.methodology))
  return {
    title: t('compare.metaTitle'),
    description: t(SITE_MODE === 'score' ? 'compare.explain' : 'compare.explainScorecard', {
      max: MAX_COMPARE,
      from: longDate(m.windowStart, locale),
      to: longDate(countries.build_date, locale),
      version: countries.methodology,
    }),
    alternates: alternatesFor(locale, 'compare/'),
  }
}

/**
 * Compare (docs/05 §6): the country picker, CompareChart, CategoryDots, EventDiff and Cite, for up
 * to five countries, drawn in the browser from each country's file (docs/04 §3: the one page
 * that fetches at runtime), with the state in the URL (`?c=DEU,FRA&w=…`; the country page's
 * peers link here). Without JavaScript the page says so and links every country page, which
 * carries the same charts and events for one country.
 */
export default async function Compare({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: lang } = await params
  if (!isLang(lang)) return null
  setRequestLocale(lang)
  const t = getT(lang)
  const countries = publicApi.countries()
  const manifest = publicApi.manifest()
  const methodology = siteMethodology(publicApi.methodology(countries.methodology))
  const collator = new Intl.Collator(lang)
  const scored = countries.countries
    .filter((c): c is ApiScoredCountry => !c.excluded)
    .map((c) => ({ iso3: c.iso3, name: c.name }))
    .sort((a, b) => collator.compare(a.name[lang], b.name[lang]))
  const values = {
    max: MAX_COMPARE,
    from: longDate(methodology.windowStart, lang),
    to: longDate(countries.build_date, lang),
    version: countries.methodology,
  }
  return (
    <div className="flex flex-col gap-8 py-12 md:py-16">
      <header className="flex max-w-prose flex-col gap-4">
        <h1 className="display text-d40 md:text-d64">{t('compare.title', values)}</h1>
        <p className="text-18">
          {t(SITE_MODE === 'score' ? 'compare.explain' : 'compare.explainScorecard', values)}{' '}
          <a href={`/${lang}/methodology/`}>{t('home.readMethodology')}</a>
        </p>
        <p className="text-14 text-ink-2">{t('compare.dataLine', values)}</p>
      </header>
      <noscript>
        <section aria-labelledby="compare-nojs" className="flex flex-col gap-4">
          <h2 id="compare-nojs" className="text-18 font-semibold">
            {t('compare.noJsTitle')}
          </h2>
          <p className="max-w-prose text-16">{t('compare.noJs', values)}</p>
          <ul className="columns-2 gap-8 text-16 md:columns-4">
            {scored.map((c) => (
              <li key={c.iso3} className="break-inside-avoid py-1">
                <a href={`/${lang}/country/${c.iso3}/`}>{c.name[lang]}</a>
              </li>
            ))}
          </ul>
        </section>
      </noscript>
      <NextIntlClientProvider locale={lang} messages={compareClientMessages(lang)}>
        <ComparePanel
          lang={lang}
          mode={SITE_MODE}
          methodology={methodology}
          countries={scored}
          buildDate={countries.build_date}
          siteUrl={manifest.site_url}
          apiBase={API_BASE}
        />
      </NextIntlClientProvider>
    </div>
  )
}
