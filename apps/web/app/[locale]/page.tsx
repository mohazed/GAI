import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { CompactEvent } from '../../components/CompactEvent'
import { Movers } from '../../components/Movers'
import { RankingStrip } from '../../components/RankingStrip'
import { SearchBox } from '../../components/SearchBox'
import { WorldMap } from '../../components/WorldMap'
import { publicApi } from '../../lib/api'
import { changedThisWeek, mapCountries, rankingStrip, searchCountries } from '../../lib/countries'
import { longDate } from '../../lib/format'
import { getT, isLang } from '../../lib/i18n'
import { siteMethodology } from '../../lib/methodology'
import { SITE_MODE } from '../../lib/mode'
import { alternatesFor } from '../../lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return isLang(locale)
    ? {
        title: { absolute: getT(locale)('common.siteName') },
        alternates: alternatesFor(locale, ''),
      }
    : {}
}

/**
 * Home (docs/05 §6): the statement and its sub-line; the WorldMap with its legend (from 768 px;
 * on phones the ranking strip stands in for it, docs/05 §5); "Moved this week" and "Changed this
 * week" side by side; the search box; the ranking strip. Nothing else. Scorecard mode (D-16): the
 * map is filled by coverage, and the movers and the strip, which are made of scores, give way to
 * the scorecard line and a link to the alphabetical country list.
 */
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: lang } = await params
  if (!isLang(lang)) return null
  setRequestLocale(lang)
  const t = getT(lang)
  const countries = publicApi.countries()
  const latest = publicApi.changesLatest()
  const methodology = siteMethodology(publicApi.methodology(countries.methodology))
  const score = SITE_MODE === 'score'
  const week = changedThisWeek(latest)
  const scored = countries.counts.scored
  const window = {
    from: longDate(latest.movers.d7.from, lang),
    to: longDate(latest.movers.d7.to, lang),
  }

  return (
    <div className="flex flex-col">
      <section className="flex max-w-prose flex-col gap-4 py-12 md:py-16">
        <h1 className="display text-d40">{t('home.statement')}</h1>
        <p className="text-18">
          {t('home.sub')} <a href={`/${lang}/methodology/`}>{t('home.readMethodology')}</a>
        </p>
        {score ? null : <p className="text-16 text-ink-2">{t('home.scorecard')}</p>}
      </section>

      <section aria-labelledby="map-title" className="hidden border-t border-rule py-16 md:block">
        <h2 id="map-title" className="mb-6 text-16 font-semibold">
          {score
            ? t('home.mapTitle', { date: longDate(countries.build_date, lang) })
            : t('home.mapTitleScorecard', { date: longDate(countries.build_date, lang) })}
        </h2>
        <WorldMap
          lang={lang}
          mode={SITE_MODE}
          methodology={methodology}
          countries={mapCountries(countries)}
        />
      </section>

      <div
        className={`grid gap-12 border-t border-rule py-12 md:py-16 ${score ? 'md:grid-cols-2' : ''}`}
      >
        {score ? (
          <section aria-labelledby="moved-title" className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h2 id="moved-title" className="display text-d28">
                {t('home.moved')}
              </h2>
              <p className="text-14 text-ink-2">{t('home.window', window)}</p>
            </div>
            <Movers lang={lang} movers={latest.movers.d7} />
          </section>
        ) : null}
        <section aria-labelledby="changed-title" className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 id="changed-title" className="display text-d28">
              {t('home.changed')}
            </h2>
            <p className="text-14 text-ink-2">
              {t('home.changedCount', { count: week.total, ...window })}
            </p>
          </div>
          {week.entries.length === 0 ? (
            <p className="text-16">
              <a href={`/${lang}/changes/`}>{t('home.changesEarlier')}</a>
            </p>
          ) : (
            <div className="flex flex-col">
              {week.entries.map((e) => (
                <CompactEvent
                  key={`${e.id}-${e.change}`}
                  entry={e}
                  lang={lang}
                  endedLabel={t('changes.ended')}
                  endedPoints={t('changes.endedPoints')}
                />
              ))}
              <p className="border-t border-rule pt-3 text-14">
                <a href={`/${lang}/changes/`}>
                  {week.total > week.entries.length
                    ? t('home.changedMore', { count: week.total - week.entries.length })
                    : t('home.changesLink')}
                </a>
              </p>
            </div>
          )}
        </section>
      </div>

      <section className="border-t border-rule py-12 md:py-16">
        <SearchBox action={`/${lang}/ranking/`} countries={searchCountries(countries)} />
      </section>

      <section
        aria-labelledby="strip-title"
        className="flex flex-col gap-4 border-t border-rule py-12 md:py-16"
      >
        {score ? (
          <>
            <h2 id="strip-title" className="display text-d28">
              {t('home.stripTitle')}
            </h2>
            <RankingStrip
              lang={lang}
              methodology={methodology}
              strip={rankingStrip(countries)}
              total={scored}
            />
            <p className="text-16">
              <a href={`/${lang}/ranking/`}>{t('home.fullRanking', { count: scored })}</a>
            </p>
          </>
        ) : (
          <>
            <h2 id="strip-title" className="display text-d28">
              {t('home.listTitle')}
            </h2>
            <p className="text-16">
              <a href={`/${lang}/ranking/#countries`}>
                {t('home.fullList', { count: countries.counts.total })}
              </a>
            </p>
          </>
        )}
      </section>
    </div>
  )
}
