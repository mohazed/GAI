import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { ChangesFeed } from '../../../components/ChangesFeed'
import { StaleNotice } from '../../../components/StaleNotice'
import { publicApi } from '../../../lib/api'
import { longDate, monthLabel } from '../../../lib/format'
import { getT, isLang } from '../../../lib/i18n'
import { siteMethodology } from '../../../lib/methodology'
import { SITE_MODE } from '../../../lib/mode'
import { alternatesFor } from '../../../lib/seo'
// The no-JavaScript rules of the country filter, one per registry entry (scripts/filter-css.ts,
// written before every build from the API's countries.json; not tracked).
import './country-filters.css'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLang(locale)) return {}
  const t = getT(locale)
  const latest = publicApi.changesLatest()
  const weeks = latest.weeks
  const from = weeks[weeks.length - 1]?.from ?? latest.build_date
  return {
    title: t('changesPage.metaTitle'),
    description: t('changesPage.title', {
      from: longDate(from, locale),
      to: longDate(latest.build_date, locale),
    }),
    alternates: alternatesFor(locale, 'changes/'),
  }
}

/**
 * Changes (docs/05 §6): the ChangesFeed of the latest weeks (changes/latest.json), by ISO week
 * with its filters; the build date and, once JavaScript runs, a notice when the build is more
 * than three days old; then the months, each linking its monthly report (/changes/{YYYY-MM}/).
 */
export default async function Changes({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: lang } = await params
  if (!isLang(lang)) return null
  setRequestLocale(lang)
  const t = getT(lang)
  const latest = publicApi.changesLatest()
  const manifest = publicApi.manifest()
  const methodology = siteMethodology(publicApi.methodology(latest.methodology))
  const weeks = latest.weeks
  const from = weeks[weeks.length - 1]?.from ?? latest.build_date
  const listed = weeks.flatMap((w) => w.entries.filter((e) => e.points_changed)).length
  const months = [...latest.months].reverse().map((m) => {
    const c = publicApi.changesMonth(m.month).counts
    return { ...m, listed: c.entries - c.unchanged_computed, unchanged: c.unchanged_computed }
  })
  const values = {
    from: longDate(from, lang),
    to: longDate(latest.build_date, lang),
    weeks: weeks.length,
  }
  return (
    <div className="flex flex-col gap-12 py-12 md:py-16">
      <header className="flex max-w-prose flex-col gap-4">
        <h1 className="display text-d40 md:text-d64">{t('changesPage.title', values)}</h1>
        <p className="text-18">{t('changesPage.explain', values)}</p>
        <p className="text-16">{t('changesPage.computed')}</p>
        <p className="text-14 text-ink-2">
          {t('changesPage.built', {
            date: longDate(manifest.build_date, lang),
            version: latest.methodology,
          })}
        </p>
        <StaleNotice
          buildDate={manifest.build_date}
          dateLabel={longDate(manifest.build_date, lang)}
        />
      </header>
      <section id="feed" aria-labelledby="feed-title" className="flex flex-col gap-4">
        <h2 id="feed-title" className="text-18 font-semibold">
          {t('changesPage.feedTitle', { count: listed, weeks: weeks.length })}
        </h2>
        <ChangesFeed lang={lang} weeks={weeks} methodology={methodology} sectionId="feed" />
      </section>
      <section
        id="months"
        aria-labelledby="months-title"
        className="flex flex-col gap-4 border-t border-rule pt-12"
      >
        <h2 id="months-title" className="text-18 font-semibold">
          {t('changesPage.monthsTitle')}
        </h2>
        <p className="max-w-prose text-16">
          {t(SITE_MODE === 'score' ? 'changesPage.monthsNote' : 'changesPage.monthsNoteScorecard', {
            first: monthLabel(latest.months[0]?.month ?? '', lang),
            last: monthLabel(latest.months[latest.months.length - 1]?.month ?? '', lang),
          })}
        </p>
        <div className="overflow-x-auto">
          <table className="w-full max-w-xl border-collapse text-14">
            <caption className="sr-only">{t('changesPage.monthsCaption')}</caption>
            <thead>
              <tr className="border-b border-ink">
                <th scope="col" className="py-2 pe-4 text-start font-semibold">
                  {t('changesPage.month')}
                </th>
                <th scope="col" className="py-2 pe-4 text-end font-semibold">
                  {t('changesPage.entries')}
                </th>
                <th scope="col" className="py-2 text-end font-semibold">
                  {t('changesPage.unchanged')}
                </th>
              </tr>
            </thead>
            <tbody>
              {months.map((m) => (
                <tr key={m.month} className="border-b border-rule">
                  <th scope="row" className="py-2 pe-4 text-start font-normal">
                    <a href={`/${lang}/changes/${m.month}/`}>{monthLabel(m.month, lang)}</a>
                    {m.complete ? null : (
                      <span className="ms-2 text-12 text-ink-2">{t('changesPage.inProgress')}</span>
                    )}
                  </th>
                  <td className="py-2 pe-4 text-end font-mono text-m13">{m.listed}</td>
                  <td className="py-2 text-end font-mono text-m13">{m.unchanged}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
