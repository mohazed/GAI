import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { CorrectionsTable } from '../../../components/CorrectionsTable'
import { publicApi } from '../../../lib/api'
import { longDate } from '../../../lib/format'
import { getT, isLang } from '../../../lib/i18n'
import { alternatesFor } from '../../../lib/seo'
import { ISSUE_FORMS, REPO_URL } from '../../../lib/site'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLang(locale)) return {}
  const t = getT(locale)
  return {
    title: t('correctionsPage.metaTitle'),
    description: t('correctionsPage.explain'),
    alternates: alternatesFor(locale, 'corrections/'),
  }
}

/**
 * Corrections (docs/05 §6, docs/08 §5): the log of corrections and retractions of published
 * events, newest first, from corrections.json; how to report an error; the log as data.
 */
export default async function Corrections({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: lang } = await params
  if (!isLang(lang)) return null
  setRequestLocale(lang)
  const t = getT(lang)
  const file = publicApi.corrections()
  const names = Object.fromEntries(publicApi.countries().countries.map((c) => [c.iso3, c.name]))
  return (
    <div className="flex flex-col gap-8 py-12 md:py-16">
      <header className="flex max-w-prose flex-col gap-4">
        <h1 className="display text-d40 md:text-d64">{t('correctionsPage.title')}</h1>
        <p className="text-18">{t('correctionsPage.explain')}</p>
        <p className="text-16">
          {t('correctionsPage.report')} <a href={ISSUE_FORMS.error}>{t('correctionsPage.form')}</a>
        </p>
        <p className="text-14 text-ink-2">
          {t('correctionsPage.built', { date: longDate(file.build_date, lang) })}{' '}
          <a href="/api/v1/corrections.json">corrections.json</a>
        </p>
      </header>
      <section aria-labelledby="log-title" className="flex flex-col gap-4">
        <h2 id="log-title" className="text-18 font-semibold">
          {t('correctionsPage.logTitle', { count: file.corrections.length })}
        </h2>
        <CorrectionsTable
          lang={lang}
          corrections={file.corrections}
          names={names}
          repoUrl={REPO_URL}
        />
      </section>
    </div>
  )
}
