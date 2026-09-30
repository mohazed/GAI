import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { MonthReport } from '../../../../components/MonthReport'
import { publicApi } from '../../../../lib/api'
import { frenchPunctuation, monthLabel } from '../../../../lib/format'
import { getT, isLang, type Lang, LOCALES } from '../../../../lib/i18n'
import { parseMarkdown } from '../../../../lib/markdown'
import { SITE_MODE } from '../../../../lib/mode'
import { alternatesFor } from '../../../../lib/seo'

export const dynamicParams = false

const API_BASE = '/api/v1'

/**
 * The report's Markdown in the site's display form: French typography on the French reports
 * (docs/05 §2, P-18; the API file keeps the data's straight apostrophes).
 */
function reportText(path: string, lang: Lang): string {
  const text = publicApi.text(path)
  return lang === 'fr' ? frenchPunctuation(text) : text
}

/** One page per month of changes/latest.json `months`, in both languages. */
export function generateStaticParams() {
  const months = publicApi.changesLatest().months.map((m) => m.month)
  return LOCALES.flatMap((locale) => months.map((month) => ({ locale, month })))
}

type Params = Promise<{ locale: string; month: string }>

/** The report of the page's language and of the site's mode (D-16: no scores in scorecard mode). */
function reportPath(month: string, lang: Lang): string {
  const m = publicApi.changesLatest().months.find((x) => x.month === month)
  if (m === undefined) notFound()
  const r = m.reports
  if (SITE_MODE === 'score') return lang === 'en' ? r.en : r.fr
  return lang === 'en' ? r.scorecard_en : r.scorecard_fr
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, month } = await params
  if (!isLang(locale)) return {}
  const first = parseMarkdown(reportText(reportPath(month, locale), locale))[0]
  return {
    title: first?.kind === 'heading' ? first.text : monthLabel(month, locale),
    description: getT(locale)('changesPage.reportSource', { month }),
    alternates: alternatesFor(locale, `changes/${month}/`),
  }
}

/**
 * A monthly report (docs/05 §6 Changes: "generated Markdown page: movers, new events,
 * corrections") rendered from the API's Markdown for the page's language and the site's mode,
 * with the previous and next months and the Markdown and JSON files.
 */
export default async function Month({ params }: { params: Params }) {
  const { locale: lang, month } = await params
  if (!isLang(lang)) notFound()
  setRequestLocale(lang)
  const t = getT(lang)
  const months = publicApi.changesLatest().months.map((m) => m.month)
  const i = months.indexOf(month)
  if (i < 0) notFound()
  const prev = months[i - 1]
  const next = months[i + 1]
  const path = reportPath(month, lang)
  return (
    <div className="flex flex-col gap-8 py-12 md:py-16">
      <nav aria-label={t('changesPage.monthNav')} className="flex flex-col gap-1 text-14">
        <a href={`/${lang}/changes/`}>{t('changesPage.all')}</a>
        <ul className="flex flex-wrap gap-x-6 gap-y-1">
          {prev === undefined ? null : (
            <li>
              <a href={`/${lang}/changes/${prev}/`} rel="prev">
                {t('changesPage.previous', { month: monthLabel(prev, lang) })}
              </a>
            </li>
          )}
          {next === undefined ? null : (
            <li>
              <a href={`/${lang}/changes/${next}/`} rel="next">
                {t('changesPage.next', { month: monthLabel(next, lang) })}
              </a>
            </li>
          )}
        </ul>
      </nav>
      <article className="flex flex-col">
        <MonthReport
          lang={lang}
          month={publicApi.changesMonth(month)}
          markdown={reportText(path, lang)}
          scorecard={SITE_MODE === 'scorecard'}
        />
      </article>
      <p className="flex flex-wrap gap-x-6 gap-y-1 border-t border-rule pt-6 text-14">
        <a href={`${API_BASE}/${path}`}>{t('changesPage.markdown')}</a>
        <a href={`${API_BASE}/changes/${month}.json`}>{t('changesPage.json')}</a>
        <span className="text-ink-2">{t('changesPage.reportSource', { month })}</span>
      </p>
    </div>
  )
}
