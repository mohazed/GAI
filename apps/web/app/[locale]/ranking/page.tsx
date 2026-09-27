import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { RankingPanel } from '../../../components/RankingPanel'
import { publicApi } from '../../../lib/api'
import { longDate } from '../../../lib/format'
import { getT, isLang } from '../../../lib/i18n'
import { siteMethodology } from '../../../lib/methodology'
import { SITE_MODE } from '../../../lib/mode'
import { rankRows } from '../../../lib/rank'
import { alternatesFor } from '../../../lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLang(locale)) return {}
  const t = getT(locale)
  return {
    title: SITE_MODE === 'score' ? t('ranking.metaTitle') : t('ranking.metaTitleScorecard'),
    alternates: alternatesFor(locale, 'ranking/'),
  }
}

/** The published CSV of the table (dumps/countries.csv; without scores in scorecard mode, D-16). */
const RANKING_CSV = {
  score: '/api/v1/dumps/countries.csv',
  scorecard: '/api/v1/dumps/countries.scorecard.csv',
} as const

/**
 * Ranking (docs/05 §6): title, one sentence with the methodology version, the weights in a
 * collapsed panel above the table (score mode, once JavaScript runs), the RankTable, and the CSV.
 * Without JavaScript the table is complete and sorted by score. Scorecard mode (D-16): the same
 * table in alphabetical order with event counts and coverage, no score, band or weights.
 */
export default async function Ranking({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: lang } = await params
  if (!isLang(lang)) return null
  setRequestLocale(lang)
  const t = getT(lang)
  const countries = publicApi.countries()
  const methodology = siteMethodology(publicApi.methodology(countries.methodology))
  const score = SITE_MODE === 'score'
  const values = {
    count: countries.counts.scored,
    date: longDate(countries.build_date, lang),
    version: countries.methodology,
  }
  return (
    <div className="flex flex-col gap-8 py-12 md:py-16">
      <header className="flex max-w-prose flex-col gap-4">
        <h1 className="display text-d40 md:text-d64">
          {score ? t('ranking.title', values) : t('ranking.titleScorecard', values)}
        </h1>
        <p className="text-18">
          {score ? t('ranking.explain', values) : t('ranking.explainScorecard', values)}{' '}
          <a href={`/${lang}/methodology/`}>{t('home.readMethodology')}</a>
        </p>
        <p className="text-14 text-ink-2">
          <a href={score ? RANKING_CSV.score : RANKING_CSV.scorecard} download>
            {t('ranking.csv')}
          </a>{' '}
          {score ? t('ranking.csvNote') : t('ranking.csvNoteScorecard')}
        </p>
      </header>
      <RankingPanel
        id="countries"
        rows={rankRows(countries)}
        mode={SITE_MODE}
        methodology={methodology}
      />
    </div>
  )
}
