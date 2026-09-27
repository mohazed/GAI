import type { ApiEvent, ApiSeriesPoint } from '@gai/schema/api'
import {
  datePercent,
  PATH_WIDTH,
  pct,
  quarterTicks,
  stepPath,
  valueAt,
  valuePx,
} from '../lib/chart'
import { longDate, plain, signed } from '../lib/format'
import { getT, type Lang, type T } from '../lib/i18n'
import { bandSegments, type SiteMethodology } from '../lib/methodology'
import type { Mode } from '../lib/mode'
import { TooltipLayer } from './TooltipLayer'

export interface TimelineProps {
  lang: Lang
  mode: Mode
  methodology: SiteMethodology
  countryName: string
  /** Change points of the daily score (`series`). */
  series: readonly ApiSeriesPoint[]
  /** The country's public events (`event_list`). */
  events: readonly ApiEvent[]
  /** Last day drawn: the build date. */
  to: string
}

export const CHART_HEIGHT = 320
const TOP = 12
const BOTTOM = 292
const STRIP_HEIGHT = 96
const Y_TICKS = [-100, -50, 0, 50, 100]

/** Events drawn on the chart: those that can score, dated in the window. */
export function chartEvents(events: readonly ApiEvent[], from: string, to: string): ApiEvent[] {
  return events.filter((e) => e.scored && e.date >= from && e.date <= to)
}

export function eventTip(e: ApiEvent, lang: Lang): string {
  return `${e.date} · ${e.indicator} · ${signed(e.points, lang)}\n${e.summary[lang]}`
}

/** Date axis along the bottom: a tick per quarter, a label per year (docs/05 §5 Timeline). */
export function DateAxis({ from, to, y }: { from: string; to: string; y: number }) {
  const x = datePercent(from, to)
  const ticks = quarterTicks(from, to)
  return (
    // biome-ignore lint/a11y/noAriaHiddenOnFocusable: an SVG <g> is not focusable; the axis labels are hidden from screen readers, the figure caption says the range.
    <g aria-hidden="true">
      <line x1="0%" x2="100%" y1={y} y2={y} className="stroke-rule" strokeWidth={1} />
      {ticks.map((d) => (
        <line
          key={d}
          x1={pct(x(d))}
          x2={pct(x(d))}
          y1={y}
          y2={y + (d.endsWith('-01-01') ? 6 : 3)}
          className="stroke-ink-3"
          strokeWidth={1}
        />
      ))}
      {ticks
        .filter((d) => d.endsWith('-01-01'))
        .map((d) => (
          <text
            key={d}
            x={pct(x(d))}
            y={y + 18}
            textAnchor="middle"
            fontSize={11}
            className="fill-ink-2 font-mono"
          >
            {d.slice(0, 4)}
          </text>
        ))}
    </g>
  )
}

/** Score axis labels (−100…+100), in their own column left of the plot. */
export function ScoreAxis({ lang }: { lang: Lang }) {
  const y = valuePx([-100, 100], TOP, BOTTOM)
  return (
    <svg width="40" height={CHART_HEIGHT} aria-hidden="true" className="block">
      {Y_TICKS.map((v) => (
        <text
          key={v}
          x={34}
          y={y(v) + 4}
          textAnchor="end"
          fontSize={11}
          className="fill-ink-2 font-mono"
        >
          {v > 0 ? `+${v}` : plain(v, lang, 0)}
        </text>
      ))}
    </svg>
  )
}

/** Faint band stripes and the score grid, shared by Timeline and CompareChart. */
export function ScoreGrid({ methodology }: { methodology: SiteMethodology }) {
  const y = valuePx([methodology.scoreClip.min, methodology.scoreClip.max], TOP, BOTTOM)
  return (
    // biome-ignore lint/a11y/noAriaHiddenOnFocusable: an SVG <g> is not focusable; stripes and grid are decoration.
    <g aria-hidden="true">
      {bandSegments(methodology.bands, methodology.scoreClip).map((s) => (
        <rect
          key={s.band.id}
          x="0%"
          width="100%"
          y={y(s.to)}
          height={y(s.from) - y(s.to)}
          className={`band-${s.band.id} fill-band`}
          fillOpacity={0.06}
        />
      ))}
      {Y_TICKS.map((v) => (
        <line
          key={v}
          x1="0%"
          x2="100%"
          y1={y(v)}
          y2={y(v)}
          className={v === 0 ? 'stroke-ink-3' : 'stroke-rule'}
          strokeWidth={1}
        />
      ))}
    </g>
  )
}

function Dot({ e, x, y, lang, t }: { e: ApiEvent; x: string; y: number; lang: Lang; t: T }) {
  const negative = e.points < 0
  const r = e.generated ? 3 : 5
  return (
    <a
      href={`#${e.id}`}
      data-tip={eventTip(e, lang)}
      aria-label={t('chart.dotLabel', {
        date: longDate(e.date, lang),
        indicator: e.indicator,
        points: signed(e.points, lang),
        summary: e.summary[lang],
      })}
      tabIndex={e.generated ? -1 : undefined}
      className="chart-dot"
    >
      <title>{eventTip(e, lang)}</title>
      {/* A 12 px transparent target keeps small dots easy to hit (docs/05 §10). */}
      <circle cx={x} cy={y} r={12} className="fill-transparent" />
      <circle
        cx={x}
        cy={y}
        r={negative ? r : r - 0.75}
        className={negative ? 'fill-ink' : 'fill-paper stroke-ink'}
        strokeWidth={negative ? undefined : 1.5}
      />
    </a>
  )
}

/**
 * The score over time (docs/05 §5 Timeline): a step line on the −100…+100 axis with faint band
 * stripes, one dot per event (filled for negative points, open for positive, small for generated
 * events), and the table of score changes beneath. Scorecard mode (D-16) draws the events on a
 * date strip without the score. Dots link to their event cards.
 */
export function Timeline({
  lang,
  mode,
  methodology,
  countryName,
  series,
  events,
  to,
}: TimelineProps) {
  const t = getT(lang)
  const from = methodology.windowStart
  const x = datePercent(from, to)
  const drawn = chartEvents(events, from, to)
  const scoreMode = mode === 'score'
  const y = valuePx([methodology.scoreClip.min, methodology.scoreClip.max], TOP, BOTTOM)
  const points = series.map((p) => ({ date: p.date, value: p.score }))
  const last = series[series.length - 1]
  const summary = scoreMode
    ? t('chart.timelineAria', {
        country: countryName,
        from: longDate(from, lang),
        to: longDate(to, lang),
        changes: Math.max(0, series.length - 1),
        score: last === undefined ? '—' : signed(last.score, lang),
      })
    : t('chart.stripAria', {
        country: countryName,
        from: longDate(from, lang),
        to: longDate(to, lang),
        count: drawn.length,
      })
  const height = scoreMode ? CHART_HEIGHT : STRIP_HEIGHT
  const axisY = scoreMode ? BOTTOM : STRIP_HEIGHT - 28
  return (
    <figure className="flex flex-col gap-2">
      <div dir="ltr" className={scoreMode ? 'grid grid-cols-[40px_1fr]' : ''}>
        {scoreMode ? <ScoreAxis lang={lang} /> : null}
        <TooltipLayer>
          {/* biome-ignore lint/a11y/useSemanticElements: an SVG chart holding links; <fieldset> is for form controls. */}
          <svg
            width="100%"
            height={height}
            role="group"
            aria-label={summary}
            overflow="visible"
            className="block"
          >
            {scoreMode ? (
              <>
                <ScoreGrid methodology={methodology} />
                <svg
                  width="100%"
                  height={CHART_HEIGHT}
                  viewBox={`0 0 ${PATH_WIDTH} ${CHART_HEIGHT}`}
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d={stepPath(points, from, to, y)}
                    className="non-scaling fill-transparent stroke-ink"
                    strokeWidth={1.5}
                  />
                </svg>
              </>
            ) : (
              // biome-ignore lint/a11y/noAriaHiddenOnFocusable: an SVG <line> is not focusable; decoration.
              <line
                x1="0%"
                x2="100%"
                y1={axisY / 2}
                y2={axisY / 2}
                className="stroke-rule"
                strokeWidth={1}
                aria-hidden="true"
              />
            )}
            <DateAxis from={from} to={to} y={axisY} />
            {drawn.map((e) => {
              const at = valueAt(series, e.date)
              return (
                <Dot
                  key={e.id}
                  e={e}
                  x={pct(x(e.date))}
                  y={scoreMode ? y(at?.score ?? 0) : axisY / 2}
                  lang={lang}
                  t={t}
                />
              )
            })}
          </svg>
        </TooltipLayer>
      </div>
      <figcaption className="text-12 text-ink-2">{summary}</figcaption>
      <details className="text-14">
        <summary>{t('chart.dataBehind')}</summary>
        {scoreMode ? (
          <SeriesTable lang={lang} series={series} t={t} />
        ) : (
          <EventsTable lang={lang} events={drawn} t={t} />
        )}
      </details>
    </figure>
  )
}

function SeriesTable({ lang, series, t }: { lang: Lang; series: readonly ApiSeriesPoint[]; t: T }) {
  if (series.length === 0) return <p className="mt-2 text-ink-2">{t('chart.empty')}</p>
  return (
    <table className="mt-2 w-full border-collapse text-14">
      <caption className="sr-only">{t('chart.seriesCaption')}</caption>
      <thead>
        <tr className="border-b border-rule text-start">
          <th scope="col" className="py-1 pe-4 text-start font-semibold">
            {t('chart.date')}
          </th>
          <th scope="col" className="py-1 pe-4 text-end font-semibold">
            {t('chart.score')}
          </th>
          <th scope="col" className="py-1 pe-4 text-end font-semibold">
            {t('chart.change')}
          </th>
          <th scope="col" className="py-1 text-start font-semibold">
            {t('chart.cause')}
          </th>
        </tr>
      </thead>
      <tbody>
        {series.map((p, i) => {
          const prev = series[i - 1]
          return (
            <tr key={p.date} className="border-b border-rule">
              <td className="py-1 pe-4 font-mono text-m12">{p.date}</td>
              <td className="py-1 pe-4 text-end font-mono text-m12">{signed(p.score, lang)}</td>
              <td className="py-1 pe-4 text-end font-mono text-m12">
                {prev === undefined ? '' : signed(p.score - prev.score, lang)}
              </td>
              <td className="py-1 text-12">
                {p.transitions.length === 0
                  ? i === 0 || prev === undefined
                    ? t('chart.start')
                    : prev.passivity_applied !== p.passivity_applied
                      ? t(p.passivity_applied ? 'chart.passivityOn' : 'chart.passivityOff')
                      : t('chart.decay')
                  : p.transitions
                      .map((tr) => `${tr.indicator} ${t(`chart.transition.${tr.kind}`)} (${tr.id})`)
                      .join('; ')}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

function EventsTable({ lang, events, t }: { lang: Lang; events: readonly ApiEvent[]; t: T }) {
  if (events.length === 0) return <p className="mt-2 text-ink-2">{t('chart.noEvents')}</p>
  return (
    <table className="mt-2 w-full border-collapse text-14">
      <caption className="sr-only">{t('chart.eventsCaption')}</caption>
      <thead>
        <tr className="border-b border-rule">
          <th scope="col" className="py-1 pe-4 text-start font-semibold">
            {t('chart.date')}
          </th>
          <th scope="col" className="py-1 pe-4 text-start font-semibold">
            {t('chart.indicator')}
          </th>
          <th scope="col" className="py-1 pe-4 text-end font-semibold">
            {t('chart.points')}
          </th>
          <th scope="col" className="py-1 text-start font-semibold">
            {t('chart.summary')}
          </th>
        </tr>
      </thead>
      <tbody>
        {events.map((e) => (
          <tr key={e.id} className="border-b border-rule">
            <td className="py-1 pe-4 font-mono text-m12">{e.date}</td>
            <td className="py-1 pe-4 font-mono text-m12">{e.indicator}</td>
            <td className="py-1 pe-4 text-end font-mono text-m12">{signed(e.points, lang)}</td>
            <td className="py-1 text-12">
              <a href={`#${e.id}`}>{e.summary[lang]}</a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
