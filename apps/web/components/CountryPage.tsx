import type { ApiExcludedCountryFile, ApiScoredCountryFile } from '@gai/schema/api'
import { NextIntlClientProvider } from 'next-intl'
import type { ReactNode } from 'react'
import { compareHref, datasetJsonLd, type Peers } from '../lib/country'
import {
  computedInForce,
  type Facets,
  itemFacets,
  listFacets,
  listItems,
  timelineEvents,
} from '../lib/event-list'
import { formatInteger, longDate } from '../lib/format'
import { countryClientMessages, getT, type Lang, type T } from '../lib/i18n'
import { bandById, type SiteMethodology } from '../lib/methodology'
import type { Mode } from '../lib/mode'
import { CategoryRows } from './CategoryRows'
import { CiteThis } from './CiteThis'
import { ComputedRun } from './ComputedRun'
import { CoverageBar } from './CoverageBar'
import { DateSnapshot } from './DateSnapshot'
import { EventBrowser } from './EventBrowser'
import { EventCard } from './EventCard'
import { NoBreakDates } from './NoBreakDates'
import { RightOfReplyBlock } from './RightOfReplyBlock'
import { ScoreGauge } from './ScoreGauge'
import { ShareThis } from './ShareThis'
import { Timeline } from './Timeline'

export interface CountryBodyProps {
  lang: Lang
  mode: Mode
  methodology: SiteMethodology
  file: ApiScoredCountryFile
  peers: Peers
  /** Commit the build read (table rows link to their line at it). */
  gitSha: string | null
  /** The API folder the page links to and the snapshot reads (`/api/v1`). */
  apiBase: string
  /** Path of the page's share card. */
  card: string
  siteUrl: string
  author: string
}

function Section({
  id,
  title,
  srOnly = false,
  children,
}: {
  id: string
  title: string
  srOnly?: boolean
  children: ReactNode
}) {
  return (
    <section
      aria-labelledby={`${id}-title`}
      className="flex flex-col gap-4 border-t border-rule py-8"
    >
      <h2 id={`${id}-title`} className={srOnly ? 'sr-only' : 'text-16 font-semibold'}>
        {title}
      </h2>
      {children}
    </section>
  )
}

/** Memberships held on the build date, in the order of the API, as plain text. */
function membershipLine(file: ApiScoredCountryFile | ApiExcludedCountryFile, t: T): string | null {
  if (file.member_of.length === 0) return null
  return t('country.memberOf', {
    list: file.member_of.map((k) => t(`rank.memberships.${k}`)).join(', '),
  })
}

function CountryTitle({
  lang,
  file,
  t,
}: {
  lang: Lang
  file: ApiScoredCountryFile | ApiExcludedCountryFile
  t: T
}) {
  const members = membershipLine(file, t)
  const region = t(`rank.regions.${file.region}` as 'rank.regions.Europe')
  return (
    <header className="flex flex-col gap-2 pb-8">
      <h1 className="display text-d40 md:text-d64">{file.name[lang]}</h1>
      <p className="text-16 text-ink-2">
        {region}
        <span className="ms-3 font-mono text-m12">{file.iso3}</span>
      </p>
      {members !== null ? <p className="text-16 text-ink-2">{members}</p> : null}
    </header>
  )
}

/**
 * A scored country (docs/05 §6 Country): title; ScoreGauge with its CoverageBar and the generated
 * summary line; CategoryRows; Timeline; the events, newest first, with their filters; "What was
 * checked"; replies; cite, share, download; peers. The gauge and the categories redraw for a
 * `?date=` snapshot (DateSnapshot). Scorecard mode (D-16) shows no score, band or ranking.
 */
export function CountryBody({
  lang,
  mode,
  methodology,
  file,
  peers,
  gitSha,
  apiBase,
  card,
  siteUrl,
  author,
}: CountryBodyProps) {
  const t = getT(lang)
  const score = mode === 'score'
  const summary = score ? file.summary[lang] : file.summary_scorecard[lang]
  const inForce = computedInForce(file.event_list)
  const items = listItems(file.event_list)
  const acts = items.filter((i) => i.kind === 'event' && i.event.type !== 'computed').length
  const runs = items.length - acts
  // Events outside the Gaza scope (West Bank, Lebanon; D-14) are listed but not counted by the
  // summary line, which would otherwise read one number above and another here (P-17).
  const outOfScope = items.filter(
    (i) =>
      i.kind === 'event' &&
      i.event.type !== 'computed' &&
      i.event.status === 'published' &&
      i.event.at_build.reason === 'out-of-scope',
  ).length
  const facets: Facets = listFacets(items, {
    indicators: methodology.indicators.map((i) => i.id),
    confidences: methodology.confidence.map((c) => c.id),
  })
  const confidenceLabel = (id: string) =>
    methodology.confidence.find((c) => c.id === id)?.label[lang] ?? id
  const scored = file.assessment.indicators.filter((r) => r.scored)
  const headings = {
    score: score ? t('country.scoreTitle') : t('country.scorecardTitle'),
    categories: t('country.categoriesTitle'),
  }
  const cite = score ? file.citations.score[lang] : file.citations.scorecard[lang]
  const description = t('country.jsonLdDescription', {
    country: file.name[lang],
    from: longDate(methodology.windowStart, lang),
    to: longDate(file.build_date, lang),
    version: file.methodology,
  })
  const band = bandById(methodology, file.band)

  const coverage = (gaugeDate?: string) => (
    <CoverageBar
      lang={lang}
      methodology={methodology}
      coverage={file.coverage}
      buildDate={file.build_date}
      {...(gaugeDate === undefined ? {} : { gaugeDate })}
    />
  )

  return (
    <NextIntlClientProvider locale={lang} messages={countryClientMessages(lang)}>
      <article className="flex flex-col py-12 md:py-16">
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD data block, `<` escaped (lib/country.ts).
          dangerouslySetInnerHTML={{
            __html: datasetJsonLd({
              file,
              lang,
              siteUrl,
              siteName: t('common.siteName'),
              description,
              author,
              windowStart: methodology.windowStart,
              mode,
            }),
          }}
        />
        <CountryTitle lang={lang} file={file} t={t} />

        <DateSnapshot
          lang={lang}
          mode={mode}
          iso3={file.iso3}
          methodology={methodology}
          buildDate={file.build_date}
          apiBase={apiBase}
          raw={file.series.map((p) => ({
            date: p.date,
            raw: {
              A: p.categories.A.raw,
              B: p.categories.B.raw,
              C: p.categories.C.raw,
              D: p.categories.D.raw,
              E: p.categories.E.raw,
            },
          }))}
          counts={file.events.by_category}
          headings={headings}
          coveragePast={coverage('0000-00-00')}
        >
          <section
            aria-labelledby="score-title"
            className="flex flex-col gap-4 border-t border-rule py-8"
          >
            <h2 id="score-title" className="sr-only">
              {headings.score}
            </h2>
            <ScoreGauge
              lang={lang}
              mode={mode}
              methodology={methodology}
              value={{ score: file.score, display: file.score_display, band: file.band }}
            />
            {coverage()}
            <p className="text-18">
              <NoBreakDates text={summary} />
            </p>
            {inForce.length > 0 ? (
              <p className="text-14 text-ink-2">
                {t('country.computedInForce', {
                  count: inForce.length,
                  indicators: [...new Set(inForce.map((e) => e.indicator))].join(', '),
                })}
              </p>
            ) : null}
            {file.leads.open > 0 ? (
              <p className="text-14 text-ink-2">
                {t('country.leads', {
                  count: file.leads.open,
                  indicators: file.leads.indicators.join(', '),
                })}
              </p>
            ) : null}
          </section>
          <section
            aria-labelledby="categories-title"
            className="flex flex-col gap-4 border-t border-rule py-8"
          >
            <h2 id="categories-title" className="text-16 font-semibold">
              {headings.categories}
            </h2>
            <CategoryRows
              lang={lang}
              mode={mode}
              methodology={methodology}
              categories={file.categories}
              counts={file.events.by_category}
            />
          </section>
        </DateSnapshot>

        <Section
          id="timeline"
          title={score ? t('country.timelineTitle') : t('country.timelineTitleScorecard')}
        >
          <Timeline
            lang={lang}
            mode={mode}
            methodology={methodology}
            countryName={file.name[lang]}
            series={file.series}
            events={timelineEvents(file.event_list)}
            to={file.build_date}
          />
        </Section>

        <section
          id="events"
          aria-labelledby="events-title"
          className="flex scroll-mt-8 flex-col gap-4 border-t border-rule py-8"
        >
          <div className="flex flex-col gap-1">
            <h2 id="events-title" className="display text-d28">
              {t('country.eventsTitle')}
            </h2>
            <p className="text-14 text-ink-2">
              {runs > 0
                ? t('country.eventsCountRuns', { acts, runs })
                : t('country.eventsCount', { acts })}
              {outOfScope > 0 ? ` ${t('country.eventsOutOfScope', { count: outOfScope })}` : ''}
            </p>
          </div>
          {items.length === 0 ? (
            <p className="text-16">{t('country.eventsNone')}</p>
          ) : (
            <EventBrowser
              sectionId="events"
              items={items.map((it) => ({ key: it.key, ...itemFacets(it) }))}
              facets={{
                indicators: facets.indicators.map((id) => ({ id, label: id })),
                signs: facets.signs,
                confidences: facets.confidences.map((id) => ({ id, label: confidenceLabel(id) })),
              }}
            >
              {items.map((it) =>
                it.kind === 'event' ? (
                  <EventCard
                    key={it.key}
                    lang={lang}
                    methodology={methodology}
                    event={it.event}
                    sources={file.sources}
                    gitSha={gitSha}
                  />
                ) : (
                  <ComputedRun
                    key={it.key}
                    lang={lang}
                    methodology={methodology}
                    values={it.values}
                    changes={it.changes}
                    sources={file.sources}
                    anchor={it.key}
                    gitSha={gitSha}
                  />
                ),
              )}
            </EventBrowser>
          )}
        </section>

        <Section id="checked" title={t('country.checkedTitle')}>
          <p className="text-14 text-ink-2">
            {file.assessment.last_full_check !== null
              ? t('country.lastFullCheck', {
                  date: longDate(file.assessment.last_full_check, lang),
                })
              : t('country.noFullCheck')}
          </p>
          <details className="text-14">
            <summary>
              {t('country.checkedSummary', { count: formatInteger(scored.length, lang) })}
            </summary>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full border-collapse text-14">
                <caption className="sr-only">{t('country.checkedCaption')}</caption>
                <thead>
                  <tr className="border-b border-rule">
                    <th scope="col" className="py-1 pe-3 text-start font-semibold">
                      {t('country.cols.indicator')}
                    </th>
                    <th scope="col" className="py-1 pe-3 text-start font-semibold">
                      {t('country.cols.status')}
                    </th>
                    <th scope="col" className="py-1 pe-3 text-start font-semibold">
                      {t('country.cols.checked')}
                    </th>
                    <th scope="col" className="py-1 text-start font-semibold">
                      {t('country.cols.note')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {scored.map((r) => (
                    <tr key={r.indicator} className="border-b border-rule align-top">
                      <th scope="row" className="py-1 pe-3 text-start font-normal">
                        <span className="font-mono text-m12">{r.indicator}</span>{' '}
                        <span className="text-12 text-ink-2">{r.name[lang]}</span>
                      </th>
                      <td className="py-1 pe-3 whitespace-nowrap">
                        {t(`coverage.status.${r.status}`)}
                      </td>
                      <td className="py-1 pe-3 font-mono text-m12 whitespace-nowrap">
                        {r.checked_at ?? ''}
                      </td>
                      <td className="py-1 text-12">
                        <AssessmentNote row={r} t={t} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </Section>

        <Section id="replies" title={t('country.repliesTitle')}>
          <RightOfReplyBlock lang={lang} replies={file.replies} />
        </Section>

        <Section id="tools" title={t('country.toolsTitle')}>
          <div className="relative flex flex-wrap items-start gap-3">
            <CiteThis citations={cite} />
            <ShareThis permalink={file.permalink[lang]} card={card} />
            <a href={`${apiBase}/countries/${file.iso3}.json`} className="btn" download>
              {t('country.downloadJson')}
            </a>
          </div>
        </Section>

        <Section id="peers" title={t('country.peersTitle')}>
          <PeerList
            lang={lang}
            t={t}
            iso3={file.iso3}
            label={t('country.peersRegion', {
              region: t(`rank.regions.${file.region}` as 'rank.regions.Europe'),
            })}
            peers={peers.region}
          />
          {score ? (
            <PeerList
              lang={lang}
              t={t}
              iso3={file.iso3}
              label={t('country.peersBand', { band: band.name[lang] })}
              peers={peers.band}
            />
          ) : null}
        </Section>
      </article>
    </NextIntlClientProvider>
  )
}

function AssessmentNote({
  row,
  t,
}: {
  row: ApiScoredCountryFile['assessment']['indicators'][number]
  t: T
}) {
  const reason = (code: string) => {
    const derived = /^derived:(.+)$/.exec(code)
    const key = derived ? (derived[1] as string) : code
    const text = t.has(`country.reasons.${key}` as 'country.reasons.no-row')
      ? t(`country.reasons.${key}` as 'country.reasons.no-row')
      : key
    return derived ? t('country.derived', { reason: text }) : text
  }
  const parts: string[] = []
  if (row.override !== null) {
    parts.push(
      t('country.handStatus', {
        status: t(`coverage.status.${row.override.from}`),
        reason: reason(row.override.reason),
      }),
    )
  }
  if (row.note !== null && row.note !== '') parts.push(row.note)
  if (row.queries.length > 0) parts.push(t('country.queries', { list: row.queries.join('; ') }))
  return <>{parts.join(' ')}</>
}

function PeerList({
  lang,
  t,
  iso3,
  label,
  peers,
}: {
  lang: Lang
  t: T
  iso3: string
  label: string
  peers: readonly { iso3: string; name: { en: string; fr: string } }[]
}) {
  return (
    <div className="flex flex-col gap-1 text-16">
      <p className="text-14 text-ink-2">{label}</p>
      {peers.length === 0 ? (
        <p className="text-14">{t('country.peersNone')}</p>
      ) : (
        <p className="flex flex-wrap gap-x-4 gap-y-1">
          {peers.map((p) => (
            <a key={p.iso3} href={`/${lang}/country/${p.iso3}/`}>
              {p.name[lang]}
            </a>
          ))}
          <a href={compareHref(lang, [iso3, ...peers.map((p) => p.iso3)])}>
            {t('country.compareLink')}
          </a>
        </p>
      )}
    </div>
  )
}

/**
 * An excluded entity (ISR, PSE, D-10): one explanatory page, not a scorecard.
 */
export function ExcludedBody({
  lang,
  file,
  apiBase,
}: {
  lang: Lang
  file: ApiExcludedCountryFile
  apiBase: string
}) {
  const t = getT(lang)
  return (
    <article className="flex flex-col py-12 md:py-16">
      <CountryTitle lang={lang} file={file} t={t} />
      <section
        aria-labelledby="excluded-title"
        className="flex max-w-prose flex-col gap-4 border-t border-rule py-8"
      >
        <h2 id="excluded-title" className="display text-d28">
          {t('country.excludedTitle', { country: file.name[lang] })}
        </h2>
        <p className="text-18">
          {t('country.excludedBody', { reason: file.excluded_reason[lang] })}
        </p>
        <p className="text-16">
          {t('country.excludedMethod')}{' '}
          <a href={`/${lang}/methodology/`}>{t('home.readMethodology')}</a>
        </p>
        <p className="text-16">
          <a href={`/${lang}/ranking/#countries`}>{t('country.excludedRanking')}</a>
        </p>
        <p>
          <a href={`${apiBase}/countries/${file.iso3}.json`} className="btn" download>
            {t('country.downloadJson')}
          </a>
        </p>
      </section>
    </article>
  )
}
