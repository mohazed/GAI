import type { ApiCategory, ApiEvent, ApiSeriesPoint } from '@gai/schema/api'
import { PATH_WIDTH, pct, stepPath, valuePercent, valuePx } from '../lib/chart'
import { type CompareStyle, compareStyle, spreadLabels } from '../lib/compare'
import { longDate, monthLabel, plain, signed } from '../lib/format'
import { getT, type Lang } from '../lib/i18n'
import type { CategoryKey, LangText, SiteMethodology } from '../lib/methodology'
import type { Mode } from '../lib/mode'
import { CHART_HEIGHT, DateAxis, ScoreAxis, ScoreGrid } from './Timeline'
import { TooltipLayer } from './TooltipLayer'

const TOP = 12
const BOTTOM = 292

export interface CompareSeries {
  iso3: string
  name: LangText
  /** Change points of the daily score (`series` of countries/{ISO3}.json). */
  points: readonly ApiSeriesPoint[]
}

export interface CompareChartProps {
  lang: Lang
  mode: Mode
  methodology: SiteMethodology
  /** One to five countries, in the order chosen (docs/05 §5 CompareChart). */
  series: readonly CompareSeries[]
  /** The build date. */
  to: string
}

/** A short sample of the line's dash, for labels and legends. */
export function LineSwatch({ style }: { style: CompareStyle }) {
  return (
    <svg width="20" height="8" aria-hidden="true" className="inline-block shrink-0">
      <line
        x1={0}
        x2={20}
        y1={4}
        y2={4}
        className={style.stroke}
        strokeWidth={2}
        strokeDasharray={style.dash}
      />
    </svg>
  )
}

/**
 * Up to five step lines on the Timeline's axes, each in its compare colour and dash, labelled
 * with the country name at the right end; no legend (docs/05 §5 CompareChart). The table of
 * scores at every change date follows in a <details>.
 */
export function CompareChart({ lang, mode, methodology, series, to }: CompareChartProps) {
  const t = getT(lang)
  // Scorecard mode (D-16): no score, so no lines; the events are compared in EventDiff.
  if (mode === 'scorecard') return <p className="text-16 text-ink-2">{t('compare.scorecard')}</p>
  const from = methodology.windowStart
  const y = valuePx([methodology.scoreClip.min, methodology.scoreClip.max], TOP, BOTTOM)
  const lastYs = series.map((s) => y(s.points[s.points.length - 1]?.score ?? 0))
  const labelYs = spreadLabels(lastYs, 14, TOP + 4, BOTTOM)
  const names = series.map((s) => s.name[lang]).join(', ')
  const aria = t('chart.compareAria', {
    countries: names,
    from: longDate(from, lang),
    to: longDate(to, lang),
  })
  return (
    <figure className="flex flex-col gap-2">
      <div dir="ltr" className="grid grid-cols-[40px_1fr_8rem] md:grid-cols-[40px_1fr_10rem]">
        <ScoreAxis lang={lang} />
        <TooltipLayer>
          <svg width="100%" height={CHART_HEIGHT} role="img" aria-label={aria} className="block">
            <ScoreGrid methodology={methodology} />
            <svg
              width="100%"
              height={CHART_HEIGHT}
              viewBox={`0 0 ${PATH_WIDTH} ${CHART_HEIGHT}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {series.map((s, i) => {
                const st = compareStyle(i)
                return (
                  <path
                    key={s.iso3}
                    d={stepPath(
                      s.points.map((p) => ({ date: p.date, value: p.score })),
                      from,
                      to,
                      y,
                    )}
                    className={`non-scaling fill-transparent ${st.stroke}`}
                    strokeWidth={1.5}
                    strokeDasharray={st.dash}
                  />
                )
              })}
            </svg>
            <DateAxis from={from} to={to} y={BOTTOM} />
          </svg>
        </TooltipLayer>
        <svg
          width="100%"
          height={CHART_HEIGHT}
          aria-hidden="true"
          className="block"
          overflow="visible"
        >
          {series.map((s, i) => {
            const st = compareStyle(i)
            const last = s.points[s.points.length - 1]
            const ly = labelYs[i] ?? 0
            return (
              <g key={s.iso3}>
                <line
                  x1={2}
                  x2={16}
                  y1={ly}
                  y2={ly}
                  className={st.stroke}
                  strokeWidth={2}
                  strokeDasharray={st.dash}
                />
                <text x={22} y={ly + 4} fontSize={12} className="fill-ink">
                  {s.name[lang]}
                  {last !== undefined ? ` ${signed(last.score, lang)}` : ''}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
      <figcaption className="text-12 text-ink-2">{aria}</figcaption>
      <details className="text-14">
        <summary>{t('chart.dataBehind')}</summary>
        <CompareTable lang={lang} series={series} />
      </details>
    </figure>
  )
}

function CompareTable({ lang, series }: { lang: Lang; series: readonly CompareSeries[] }) {
  const t = getT(lang)
  const dates = [...new Set(series.flatMap((s) => s.points.map((p) => p.date)))].sort()
  const at = (s: CompareSeries, date: string) => {
    let v: number | null = null
    for (const p of s.points) {
      if (p.date <= date) v = p.score
      else break
    }
    return v
  }
  return (
    <table className="mt-2 w-full border-collapse text-14">
      <caption className="sr-only">{t('chart.compareCaption')}</caption>
      <thead>
        <tr className="border-b border-rule">
          <th scope="col" className="py-1 pe-4 text-start font-semibold">
            {t('chart.date')}
          </th>
          {series.map((s) => (
            <th key={s.iso3} scope="col" className="py-1 pe-4 text-end font-semibold">
              {s.name[lang]}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dates.map((d) => (
          <tr key={d} className="border-b border-rule">
            <td className="py-1 pe-4 font-mono text-m12">{d}</td>
            {series.map((s) => {
              const v = at(s, d)
              return (
                <td key={s.iso3} className="py-1 pe-4 text-end font-mono text-m12">
                  {v === null ? '—' : signed(v, lang)}
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export interface DotsCountry {
  iso3: string
  name: LangText
  categories: Record<CategoryKey, ApiCategory>
  /** Published events by category (`eventCountsByCategory`), shown in scorecard mode. */
  counts: Record<CategoryKey, number>
}

function Shape({ shape, cls }: { shape: CompareStyle['shape']; cls: string }) {
  switch (shape) {
    case 'circle':
      return <circle r={5} className={cls} />
    case 'square':
      return <rect x={-4.5} y={-4.5} width={9} height={9} className={cls} />
    case 'triangle':
      return <path d="M0,-5.5 L5.5,4.5 L-5.5,4.5 Z" className={cls} />
    case 'diamond':
      return <path d="M0,-6 L6,0 L0,6 L-6,0 Z" className={cls} />
    case 'cross':
      return <path d="M-5,-2 H-2 V-5 H2 V-2 H5 V2 H2 V5 H-2 V2 H-5 Z" className={cls} />
  }
}

/**
 * Five rows, A to E, each an axis from the category's lower cap to its upper cap, with one mark
 * per country in its compare colour and shape (docs/05 §5 CategoryDots, D-21). Values are also
 * given in a table for screen readers.
 */
export function CategoryDots({
  lang,
  methodology,
  mode,
  countries,
}: {
  lang: Lang
  mode: Mode
  methodology: SiteMethodology
  countries: readonly DotsCountry[]
}) {
  const t = getT(lang)
  if (mode === 'scorecard')
    return <CategoryCounts lang={lang} methodology={methodology} countries={countries} />
  return (
    <figure className="flex flex-col gap-2">
      <table className="sr-only">
        <caption>{t('chart.dotsCaption')}</caption>
        <thead>
          <tr>
            <th scope="col">{t('categories.category')}</th>
            {countries.map((c) => (
              <th key={c.iso3} scope="col">
                {c.name[lang]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {methodology.categories.map((cat) => (
            <tr key={cat.id}>
              <th scope="row">{`${cat.id} ${cat.short[lang]}`}</th>
              {countries.map((c) => (
                <td key={c.iso3}>{signed(c.categories[cat.id].clipped, lang)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <TooltipLayer>
        <ul aria-hidden="true" className="flex flex-col" dir="ltr">
          {methodology.categories.map((cat) => {
            const x = valuePercent([cat.cap.min, cat.cap.max])
            const muted = !cat.scored
            return (
              <li
                key={cat.id}
                className="grid grid-cols-[7rem_1fr] items-center gap-4 border-t border-rule py-2 first:border-t-0 md:grid-cols-[10rem_1fr]"
              >
                <span className={`text-14 ${muted ? 'text-ink-3' : ''}`}>
                  <span className="font-mono text-m13">{cat.id}</span> {cat.short[lang]}
                  <span className="num block font-mono text-m11 text-ink-2">
                    {`${plain(cat.cap.min, lang, 0)} … +${plain(cat.cap.max, lang, 0)}`}
                  </span>
                </span>
                <svg
                  width="100%"
                  height={20 + countries.length * 4}
                  overflow="visible"
                  aria-hidden="true"
                  className="block"
                >
                  <line x1="0%" x2="100%" y1={10} y2={10} className="stroke-rule" strokeWidth={1} />
                  <line
                    x1={pct(x(0))}
                    x2={pct(x(0))}
                    y1={2}
                    y2={18 + countries.length * 4}
                    className="stroke-ink-3"
                    strokeWidth={1}
                  />
                  {countries.map((c, i) => {
                    const st = compareStyle(i)
                    const v = c.categories[cat.id].clipped
                    const tip = `${c.name[lang]} · ${cat.id} ${signed(v, lang)}`
                    return (
                      <svg
                        key={c.iso3}
                        x={pct(x(v))}
                        y={10 + i * 4}
                        overflow="visible"
                        aria-hidden="true"
                        data-tip={tip}
                      >
                        <title>{tip}</title>
                        <Shape shape={st.shape} cls={`${st.fill} stroke-paper`} />
                      </svg>
                    )
                  })}
                </svg>
              </li>
            )
          })}
        </ul>
      </TooltipLayer>
      <figcaption className="flex flex-wrap gap-x-4 gap-y-1 text-12 text-ink-2">
        {countries.map((c, i) => {
          const st = compareStyle(i)
          return (
            <span key={c.iso3} className="inline-flex items-center gap-1">
              <svg width="12" height="12" aria-hidden="true" overflow="visible">
                <g transform="translate(6 6)">
                  <Shape shape={st.shape} cls={st.fill} />
                </g>
              </svg>
              {c.name[lang]}
            </span>
          )
        })}
      </figcaption>
    </figure>
  )
}

/** Scorecard mode (D-16): published events by category and country, as a table. */
function CategoryCounts({
  lang,
  methodology,
  countries,
}: {
  lang: Lang
  methodology: SiteMethodology
  countries: readonly DotsCountry[]
}) {
  const t = getT(lang)
  return (
    <table className="w-full border-collapse text-14">
      <caption className="sr-only">{t('compare.countsCaption')}</caption>
      <thead>
        <tr className="border-b border-ink">
          <th scope="col" className="py-2 pe-4 text-start font-semibold">
            {t('categories.category')}
          </th>
          {countries.map((c) => (
            <th key={c.iso3} scope="col" className="py-2 pe-4 text-end font-semibold">
              {c.name[lang]}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {methodology.categories.map((cat) => (
          <tr key={cat.id} className="border-b border-rule">
            <th
              scope="row"
              className={`py-2 pe-4 text-start font-normal ${cat.scored ? '' : 'text-ink-3'}`}
            >
              <span className="font-mono text-m13">{cat.id}</span> {cat.short[lang]}
            </th>
            {countries.map((c) => (
              <td key={c.iso3} className="py-2 pe-4 text-end">
                {t('categories.count', { count: c.counts[cat.id] })}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export interface DiffCountry {
  iso3: string
  name: LangText
  events: readonly ApiEvent[]
}

/**
 * Events of two to five countries side by side, one row per month, newest first (docs/05 §5
 * EventDiff). Only events that can score are listed; each links to its country page.
 */
export function EventDiff({ lang, countries }: { lang: Lang; countries: readonly DiffCountry[] }) {
  const t = getT(lang)
  const months = [
    ...new Set(
      countries.flatMap((c) => c.events.filter((e) => e.scored).map((e) => e.date.slice(0, 7))),
    ),
  ].sort((a, b) => (a < b ? 1 : -1))
  if (months.length === 0) return <p className="text-14 text-ink-2">{t('compare.noEvents')}</p>
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-14">
        <caption className="sr-only">{t('compare.diffCaption')}</caption>
        <thead>
          <tr className="border-b border-ink">
            <th scope="col" className="py-2 pe-4 text-start font-semibold">
              {t('compare.month')}
            </th>
            {countries.map((c) => (
              <th key={c.iso3} scope="col" className="py-2 pe-4 text-start font-semibold">
                {c.name[lang]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {months.map((m) => (
            <tr key={m} className="border-b border-rule align-top">
              <th scope="row" className="py-2 pe-4 text-start font-normal whitespace-nowrap">
                {monthLabel(m, lang)}
              </th>
              {countries.map((c) => {
                const list = c.events.filter((e) => e.scored && e.date.startsWith(m))
                return (
                  <td key={c.iso3} className="py-2 pe-4">
                    {list.length === 0 ? (
                      <span className="text-ink-3">—</span>
                    ) : (
                      <ul className="flex flex-col gap-1">
                        {list.map((e) => (
                          <li key={e.id}>
                            <span className="font-mono text-m12">
                              {e.indicator} {signed(e.points, lang)}
                            </span>{' '}
                            <a href={`/${lang}/country/${c.iso3}/#${e.id}`}>{e.summary[lang]}</a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
