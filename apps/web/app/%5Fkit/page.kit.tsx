import type { ApiScoredCountryFile } from '@gai/schema/api'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import type { ReactNode } from 'react'
import { BandChip } from '../../components/BandChip'
import { CategoryRows } from '../../components/CategoryRows'
import { ChangesFeed } from '../../components/ChangesFeed'
import { CiteThis } from '../../components/CiteThis'
import { CategoryDots, CompareChart, EventDiff } from '../../components/CompareChart'
import { ComputedRun } from '../../components/ComputedRun'
import { ConfidenceChip } from '../../components/ConfidenceChip'
import { CoverageBar } from '../../components/CoverageBar'
import { DiffViewer } from '../../components/DiffViewer'
import { EventCard, IndicatorBadge } from '../../components/EventCard'
import { Footer } from '../../components/Footer'
import { Masthead } from '../../components/Masthead'
import { MethodologyTable } from '../../components/MethodologyTable'
import { Movers } from '../../components/Movers'
import { OutcomeChip } from '../../components/OutcomeChip'
import { RankingPanel } from '../../components/RankingPanel'
import { RankingStrip } from '../../components/RankingStrip'
import { RightOfReplyBlock } from '../../components/RightOfReplyBlock'
import { ScoreGauge } from '../../components/ScoreGauge'
import { SearchBox } from '../../components/SearchBox'
import { Timeline } from '../../components/Timeline'
import { VersionSelector } from '../../components/VersionSelector'
import { WorldMap } from '../../components/WorldMap'
import { apiReader, KIT_API_DIR } from '../../lib/api'
import { mapCountries, rankingStrip, stripFrom } from '../../lib/countries'
import { clientMessages, type Lang } from '../../lib/i18n'
import { siteMethodology } from '../../lib/methodology'
import type { Mode } from '../../lib/mode'
import { rankRows } from '../../lib/rank'
import { REPO_URL } from '../../lib/site'
import {
  cappedCategories,
  KIT_SERIES,
  KIT_SOURCE,
  kitEvents,
  kitMovers,
  kitName,
  kitRankRows,
  kitRun,
  mixedCoverage,
} from './samples'

export const metadata: Metadata = {
  title: 'Component kit · Gaza Accountability Index',
  robots: { index: false, follow: false },
}

const kit = apiReader(KIT_API_DIR)

function Specimen({
  title,
  note,
  children,
}: {
  title: string
  note?: string
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-4 border-t border-rule py-8">
      <h3 className="font-mono text-m12 text-ink-2" lang="en" dir="ltr">
        {title}
        {note ? <span className="ms-2 text-ink-3">· {note}</span> : null}
      </h3>
      {children}
    </section>
  )
}

function Row({
  lang,
  dir,
  label,
  mode,
  n,
}: {
  lang: Lang
  dir: 'ltr' | 'rtl'
  label: string
  mode: Mode
  n: number
}) {
  const manifest = kit.manifest()
  const countries = kit.countries()
  const m = siteMethodology(kit.methodology(manifest.methodology.version))
  const deu = kit.country('DEU') as ApiScoredCountryFile
  const isr = kit.country('ISR')
  const base = deu.event_list[0]
  if (base === undefined) throw new Error('the DEU fixture has no event')
  const samples = kitEvents(base)
  const generated = samples[samples.length - 1] as typeof base
  const run = kitRun(generated).map((e) => ({ ...e, id: `${e.id}_k${n}` }))
  const counts = deu.events.by_category
  const rows = [...rankRows(countries), ...kitRankRows(m)]
  const mapCountryList = mapCountries(countries)
  const index = kit.methodologyIndex()
  const aug = kit.changesMonth('2025-08')
  const nov = kit.changesMonth('2025-11')
  const latest = kit.changesLatest()
  const weeks = [...nov.weeks, ...aug.weeks].reverse().sort((a, b) => (a.week < b.week ? 1 : -1))
  const compare = [
    { iso3: deu.iso3, name: deu.name, points: deu.series },
    ...KIT_SERIES.map((s) => ({ iso3: s.iso3, name: kitName(s.letter), points: s.points })),
  ]
  const capped = cappedCategories(m)
  const dots = [
    { iso3: deu.iso3, name: deu.name, categories: deu.categories, counts },
    {
      iso3: 'XAA',
      name: kitName('A'),
      categories: capped,
      counts: { A: 0, B: 1, C: 0, D: 0, E: 0 },
    },
  ]
  const diffCountries = [
    { iso3: deu.iso3, name: deu.name, events: deu.event_list },
    { iso3: 'XAA', name: kitName('A'), events: samples.slice(0, 1) },
    { iso3: 'XAB', name: kitName('B'), events: samples.slice(1, 2) },
  ]
  const sources = { ...deu.sources, [KIT_SOURCE.id]: KIT_SOURCE }
  const citations = mode === 'score' ? deu.citations.score[lang] : deu.citations.scorecard[lang]

  return (
    <div lang={lang} dir={dir} className="flex flex-col" data-kit-row={n}>
      <h2 className="display border-t-2 border-ink pt-8 text-d40" lang="en" dir="ltr">
        {label}
      </h2>
      <NextIntlClientProvider locale={lang} messages={clientMessages(lang)}>
        <Specimen title="Masthead">
          <Masthead
            lang={lang}
            version={manifest.methodology.version}
            buildDate={manifest.build_date}
            path={`/${lang}/ranking/`}
          />
        </Specimen>

        <Specimen title="BandChip · ConfidenceChip · OutcomeChip · IndicatorBadge">
          <div className="flex flex-wrap gap-2">
            {m.bands.map((b) => (
              <BandChip key={b.id} lang={lang} band={b} />
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {(['confirmed', 'corroborated', 'reported', 'disputed'] as const).map((c) => (
              <ConfidenceChip key={c} lang={lang} confidence={c} methodology={m} />
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {(['none', 'disputed', 'corrected', 'retracted'] as const).map((o) => (
              <OutcomeChip key={o} lang={lang} outcome={o} />
            ))}
            <IndicatorBadge lang={lang} methodology={m} indicator="A6" category="A" />
          </div>
        </Specimen>

        <Specimen title={`ScoreGauge + CoverageBar · ${mode}`} note="fixture DEU">
          <ScoreGauge
            lang={lang}
            mode={mode}
            methodology={m}
            value={{ score: deu.score, display: deu.score_display, band: deu.band }}
          />
          <CoverageBar
            lang={lang}
            methodology={m}
            coverage={deu.coverage}
            buildDate={deu.build_date}
          />
        </Specimen>
        {mode === 'score' ? (
          <>
            <Specimen
              title="ScoreGauge + CoverageBar · score, past date"
              note="synthetic value −62.4 on 2025-01-15; coverage of every status"
            >
              <ScoreGauge
                lang={lang}
                mode="score"
                methodology={m}
                value={{ score: -62.4, display: -62, band: 'sustaining' }}
              />
              <CoverageBar
                lang={lang}
                methodology={m}
                coverage={mixedCoverage(m)}
                buildDate={deu.build_date}
                gaugeDate="2025-01-15"
              />
            </Specimen>
            <Specimen title="ScoreGauge · score near the upper end" note="synthetic value +96.5">
              <ScoreGauge
                lang={lang}
                mode="score"
                methodology={m}
                value={{ score: 96.5, display: 97, band: 'confronting' }}
              />
            </Specimen>
          </>
        ) : null}
        <Specimen title="ScoreGauge + CoverageBar · excluded" note="fixture ISR">
          <ScoreGauge
            lang={lang}
            mode={mode}
            methodology={m}
            value={null}
            excludedReason={isr.excluded ? isr.excluded_reason : null}
          />
          <CoverageBar lang={lang} methodology={m} coverage={null} buildDate={deu.build_date} />
        </Specimen>

        <Specimen title={`CategoryRows · ${mode}`} note="fixture DEU">
          <CategoryRows
            lang={lang}
            mode={mode}
            methodology={m}
            categories={deu.categories}
            counts={counts}
          />
        </Specimen>
        {mode === 'score' ? (
          <Specimen
            title="CategoryRows · capped"
            note="synthetic subtotals, A and D beyond their caps"
          >
            <CategoryRows
              lang={lang}
              mode="score"
              methodology={m}
              categories={capped}
              counts={counts}
            />
          </Specimen>
        ) : null}

        <Specimen title={`Timeline · ${mode}`} note="fixture DEU">
          <Timeline
            lang={lang}
            mode={mode}
            methodology={m}
            countryName={deu.name[lang]}
            series={deu.series}
            events={deu.event_list}
            to={deu.build_date}
          />
        </Specimen>
        <Specimen title={`Timeline · ${mode} · empty`} note="synthetic: no event, one change point">
          <Timeline
            lang={lang}
            mode={mode}
            methodology={m}
            countryName={kitName('E')[lang]}
            series={deu.series.slice(0, 1)}
            events={[]}
            to={deu.build_date}
          />
        </Specimen>

        <Specimen title="EventCard · published, ended, revision 2" note="fixture DEU (real event)">
          <EventCard lang={lang} methodology={m} event={base} sources={sources} />
        </Specimen>
        <Specimen
          title="EventCard · reported, disputed, retracted, generated"
          note="synthetic copies of the fixture"
        >
          <div>
            {samples.map((e) => (
              <EventCard key={e.id} lang={lang} methodology={m} event={e} sources={sources} />
            ))}
          </div>
        </Specimen>

        <Specimen
          title="ComputedRun · five monthly values, points changed twice"
          note="synthetic XAE; the fixture tables have no rows"
        >
          <ComputedRun
            lang={lang}
            methodology={m}
            values={run}
            changes={run.filter(
              (e) => e.previous_points === null || e.previous_points !== e.points,
            )}
            sources={sources}
            anchor={`series-kit-${n}`}
            gitSha={null}
          />
        </Specimen>

        <Specimen
          title={`RankingPanel (WeightSliders + RankTable) · ${mode}`}
          note="fixture countries and synthetic XAA–XAE"
        >
          <RankingPanel rows={rows} mode={mode} methodology={m} />
        </Specimen>
        <Specimen title={`RankTable · ${mode} · empty`} note="only the excluded entities">
          <RankingPanel rows={rows.filter((r) => r.excluded)} mode={mode} methodology={m} />
        </Specimen>

        {mode === 'score' ? (
          <>
            <Specimen
              title="Movers · rises and falls, one direction empty, none"
              note="synthetic XAA–XAD; the fixture has no mover"
            >
              <Movers lang={lang} movers={kitMovers(latest.movers.d7)} />
              <Movers lang={lang} movers={{ ...kitMovers(latest.movers.d7), down: [] }} />
              <Movers lang={lang} movers={latest.movers.d7} />
            </Specimen>
            <Specimen
              title="RankingStrip · all rows, gap between top and bottom"
              note="fixture DEU and synthetic XAA–XAE"
            >
              <RankingStrip
                lang={lang}
                methodology={m}
                strip={rankingStrip(countries)}
                total={countries.counts.scored}
              />
              <RankingStrip
                lang={lang}
                methodology={m}
                strip={stripFrom(
                  rows
                    .filter((r) => !r.excluded && r.display !== null && r.band !== null)
                    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
                    .map((r) => ({
                      iso3: r.iso3,
                      name: r.name,
                      display: r.display ?? 0,
                      band: r.band ?? '',
                    })),
                  2,
                )}
                total={rows.filter((r) => !r.excluded).length}
              />
            </Specimen>
          </>
        ) : null}

        <Specimen
          title={`WorldMap · ${mode}`}
          note="fixture countries; DEU coloured, ISR and PSE hatched"
        >
          <WorldMap lang={lang} mode={mode} methodology={m} countries={mapCountryList} />
        </Specimen>

        <Specimen
          title={`CompareChart · CategoryDots · EventDiff · ${mode}`}
          note="fixture DEU and synthetic XAA, XAB"
        >
          <CompareChart
            lang={lang}
            mode={mode}
            methodology={m}
            series={compare}
            to={deu.build_date}
          />
          <CategoryDots lang={lang} mode={mode} methodology={m} countries={dots} />
          <EventDiff lang={lang} countries={diffCountries} />
        </Specimen>
        {mode === 'scorecard' ? (
          <Specimen title="EventDiff · empty">
            <EventDiff lang={lang} countries={[{ iso3: 'XAE', name: kitName('E'), events: [] }]} />
          </Specimen>
        ) : null}

        <Specimen title={`CiteThis · ${mode}`} note="fixture DEU">
          <CiteThis citations={citations} />
        </Specimen>

        <Specimen title="ChangesFeed" note="fixture months 2025-08 and 2025-11">
          <ChangesFeed weeks={weeks} />
        </Specimen>
        <Specimen title="ChangesFeed · empty" note="latest five weeks of the fixture">
          <ChangesFeed weeks={latest.weeks} />
        </Specimen>

        <Specimen title="VersionSelector · MethodologyTable">
          <VersionSelector
            current={index.current}
            versions={index.versions.map((v) => ({
              version: v.version,
              status: v.status,
              href: `/${lang}/methodology/${v.version}/`,
            }))}
          />
          <MethodologyTable lang={lang} file={kit.methodology(index.current)} />
        </Specimen>
        <Specimen title="DiffViewer · none, rows" note="rows are synthetic">
          <DiffViewer lang={lang} from={null} to={index.current} rows={[]} />
          <DiffViewer
            lang={lang}
            from="1.0.0"
            to="1.1.0"
            rows={[
              {
                iso3: 'XAA',
                name: kitName('A'),
                old: 12,
                new: 15,
                cause: {
                  en: 'Kit sample: E scored from 1.1.0',
                  fr: 'Exemple du kit : E noté à partir de 1.1.0',
                },
              },
            ]}
          />
        </Specimen>

        <Specimen
          title="RightOfReplyBlock · reply, none"
          note="the fixture reply is synthetic (fixtures/README.md)"
        >
          <RightOfReplyBlock lang={lang} replies={deu.replies} />
          <RightOfReplyBlock lang={lang} replies={[]} />
        </Specimen>

        <Specimen title="SearchBox">
          <SearchBox
            action={`/${lang}/ranking/`}
            countries={rows.map((r) => ({ iso3: r.iso3, name: r.name }))}
          />
        </Specimen>

        <Specimen title="Footer">
          <Footer
            lang={lang}
            version={manifest.methodology.version}
            gitSha={manifest.git.sha}
            buildDate={manifest.build_date}
            repoUrl={REPO_URL}
          />
        </Specimen>
      </NextIntlClientProvider>
    </div>
  )
}

/**
 * The component kit (docs/05 §5): every component in every state, in English and French, in both
 * modes (D-16), and a right-to-left row. Dev only: `next dev`, or a kit build (`GAI_KIT=1`,
 * written to out-kit/); never part of the production build.
 */
export default function KitPage() {
  // Static render: next-intl must not read the request headers for a locale.
  setRequestLocale('en')
  if (!kit.exists()) {
    return (
      <main className="container-page py-16">
        <p className="text-18">
          The kit reads the fixtures API. Run <code>pnpm --filter @gai/web kit:data</code> first.
        </p>
      </main>
    )
  }
  return (
    <main id="content" className="container-page flex flex-col gap-16 py-8">
      <header className="flex flex-col gap-2">
        <h1 className="display text-d64">Component kit</h1>
        <p className="text-18 text-ink-2">
          Dev-only route. Data: the fixtures API (fixtures/, build date {kit.manifest().build_date}
          ); states the fixtures lack are synthetic copies labelled “Kit sample” with user-assigned
          codes XAA–XAE.
        </p>
      </header>
      <Row n={0} lang="en" dir="ltr" label="English · score mode" mode="score" />
      <Row n={1} lang="fr" dir="ltr" label="Français · mode score" mode="score" />
      <Row n={2} lang="en" dir="ltr" label="English · scorecard mode (D-16)" mode="scorecard" />
      <Row n={3} lang="fr" dir="ltr" label="Français · mode fiche (D-16)" mode="scorecard" />
      <Row
        n={4}
        lang="en"
        dir="rtl"
        label="RTL pseudo-locale (English strings, dir=rtl; their full stops move to the left, as expected) · score mode"
        mode="score"
      />
    </main>
  )
}
