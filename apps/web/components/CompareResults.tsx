import type { ApiScoredCountryFile } from '@gai/schema/api'
import {
  type CategoryWeights,
  comparisonCitations,
  DEFAULT_WEIGHTS,
  formatWeights,
  isDefaultWeights,
  parseWeights,
  userScore,
} from '@gai/scoring'
import { useEffect, useId, useMemo, useState } from 'react'
import { longDate } from '../lib/format'
import type { Lang } from '../lib/i18n'
import { bandById, combineModel, type SiteMethodology } from '../lib/methodology'
import type { Mode } from '../lib/mode'
import type { Translate } from '../lib/translate'
import { CiteThis } from './CiteThis'
import {
  CategoryDotsView,
  CompareChartView,
  type CompareSeries,
  EventDiffView,
} from './CompareViews'
import { WeightSliders } from './WeightSliders'

export interface CompareResultsProps {
  lang: Lang
  t: Translate
  mode: Mode
  methodology: SiteMethodology
  /** The files of the countries compared, in the order chosen (one to five). */
  files: readonly ApiScoredCountryFile[]
  /** `?w=` as written in the address (score mode), null for the published weights. */
  weights: string | null
  /** Sets `?w=`: null for the published weights. */
  onWeights: (w: string | null) => void
  buildDate: string
  siteUrl: string
}

/**
 * The score of each change point of a series with the reader's weights (docs/02 §9), from the
 * point's clipped subtotals and its passivity flag, by @gai/scoring's `userScore`; the published
 * score at the default weights. The series gives the subtotals to one decimal, so a weighted score
 * can differ by a rounding step from one computed at full precision; the page says the line uses
 * the reader's weights.
 */
function weightedPoints(
  file: ApiScoredCountryFile,
  weights: CategoryWeights,
  methodology: SiteMethodology,
): CompareSeries['points'] {
  if (isDefaultWeights(weights)) return file.series
  const model = combineModel(methodology)
  return file.series.map((p) => ({
    date: p.date,
    score: userScore(
      {
        categories: p.categories,
        passivity: { value: p.passivity_applied ? methodology.passivityPoints : 0 },
      },
      weights,
      model,
    ).score,
  }))
}

/**
 * What the Compare page shows for the countries chosen (docs/05 §6 Compare): the CompareChart (in
 * score mode, with the reader's weights when `?w=` sets them), CategoryDots, EventDiff and the
 * comparison's citation. Loaded on demand by ComparePanel (`import()`).
 */
export function CompareResultsView({
  lang,
  t,
  mode,
  methodology,
  files,
  weights: wParam,
  onWeights,
  buildDate,
  siteUrl,
}: CompareResultsProps) {
  const id = useId()
  const parsed = wParam === null ? null : parseWeights(wParam)
  const weights = parsed ?? DEFAULT_WEIGHTS
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(parsed !== null && !isDefaultWeights(parsed))

  // A `w` that does not parse, or the default weights, leaves the address.
  useEffect(() => {
    if (wParam !== null && (parsed === null || isDefaultWeights(parsed))) onWeights(null)
  }, [wParam, parsed, onWeights])

  const setWeights = (w: CategoryWeights) => {
    setCopied(false)
    onWeights(isDefaultWeights(w) ? null : formatWeights(w))
  }

  const series = useMemo(
    () =>
      files.map((f) => ({
        iso3: f.iso3,
        name: f.name,
        points: weightedPoints(f, weights, methodology),
      })),
    [files, weights, methodology],
  )

  const citations = comparisonCitations(
    {
      countries: files.map((f) => ({
        iso3: f.iso3,
        countryName: f.name,
        score:
          mode === 'score'
            ? { display: f.score_display, bandName: bandById(methodology, f.band).name }
            : null,
      })),
      date: buildDate,
      methodologyVersion: methodology.version,
      siteUrl,
    },
    lang,
  )

  const range = { from: longDate(methodology.windowStart, lang), to: longDate(buildDate, lang) }
  const custom = !isDefaultWeights(weights)
  const shownWeights = (['A', 'B', 'C', 'D'] as const)
    .map(
      (k) =>
        `${k} ${lang === 'fr' ? weights[k].toFixed(1).replace('.', ',') : weights[k].toFixed(1)}`,
    )
    .join(' · ')

  return (
    <div className="flex flex-col gap-12">
      {mode === 'score' ? (
        <section aria-labelledby={`${id}-scores`} className="flex flex-col gap-4">
          <h2 id={`${id}-scores`} className="text-18 font-semibold">
            {t('compare.scoresTitle', range)}
          </h2>
          {custom ? (
            <p className="text-14 text-ink-2">
              {t('compare.weighted', { weights: shownWeights })}{' '}
              <button
                type="button"
                className="text-link underline underline-offset-3 hover:decoration-2"
                onClick={() => setWeights(DEFAULT_WEIGHTS)}
              >
                {t('compare.published')}
              </button>
            </p>
          ) : null}
          <CompareChartView
            lang={lang}
            t={t}
            mode={mode}
            methodology={methodology}
            series={series}
            to={buildDate}
          />
          <details
            className="weights"
            open={open}
            onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}
          >
            <summary className="btn list-none">{t('weights.title')}</summary>
            <div className="mt-4">
              <WeightSliders
                categories={methodology.categories}
                weights={weights}
                onChange={(k, v) => setWeights({ ...weights, [k]: v })}
                onReset={() => setWeights(DEFAULT_WEIGHTS)}
                copied={copied}
                onCopyLink={async () => {
                  try {
                    if (navigator.clipboard === undefined) return false
                    await navigator.clipboard.writeText(window.location.href)
                    setCopied(true)
                    return true
                  } catch {
                    return false
                  }
                }}
              />
            </div>
          </details>
        </section>
      ) : (
        <CompareChartView
          lang={lang}
          t={t}
          mode={mode}
          methodology={methodology}
          series={series}
          to={buildDate}
        />
      )}
      <section aria-labelledby={`${id}-cats`} className="flex flex-col gap-4">
        <h2 id={`${id}-cats`} className="text-18 font-semibold">
          {t(mode === 'score' ? 'compare.categoriesTitle' : 'compare.countsTitle', {
            date: range.to,
          })}
        </h2>
        <CategoryDotsView
          lang={lang}
          t={t}
          mode={mode}
          methodology={methodology}
          countries={files.map((f) => ({
            iso3: f.iso3,
            name: f.name,
            categories: f.categories,
            counts: f.events.by_category,
          }))}
        />
      </section>
      <section aria-labelledby={`${id}-events`} className="flex flex-col gap-4">
        <h2 id={`${id}-events`} className="text-18 font-semibold">
          {t('compare.eventsTitle')}
        </h2>
        <p className="text-14 text-ink-2">{t('compare.eventsNote')}</p>
        <EventDiffView
          lang={lang}
          t={t}
          countries={files.map((f) => ({ iso3: f.iso3, name: f.name, events: f.event_list }))}
        />
      </section>
      <div className="relative flex flex-wrap items-center gap-3 border-t border-rule pt-6">
        <CiteThis citations={citations} />
        <p className="text-14 text-ink-2">{t('compare.citeNote', { date: range.to })}</p>
      </div>
    </div>
  )
}
