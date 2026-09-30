import type { ApiEvent, ApiSourceMap } from '@gai/schema/api'
import { formatInteger, signed } from '../lib/format'
import { getT, type Lang } from '../lib/i18n'
import type { SiteMethodology } from '../lib/methodology'
import { REPO_URL } from '../lib/site'
import { groupEvidence, rowUrl } from '../lib/structured-row'
import {
  ArchivedResponses,
  IndicatorBadge,
  PointsLine,
  QuoteFigure,
  TableRowList,
} from './EventCard'

export interface ComputedRunProps {
  lang: Lang
  methodology: SiteMethodology
  /** Consecutive computed values of one indicator, oldest first (lib/event-list.ts). */
  values: readonly ApiEvent[]
  /** The values whose points changed. */
  changes: readonly ApiEvent[]
  sources: ApiSourceMap
  anchor: string
  gitSha: string | null
}

/**
 * A run of computed values of one indicator (D1 monthly, A2 and C3 yearly), listed as one entry
 * in the layout of an EventCard: the latest value's summary, the dates on which the points
 * changed, the latest value's points and evidence, and every value one click away in a table
 * (each row is the anchor of its event id, which the Timeline and the changes feed link to).
 */
export function ComputedRun({
  lang,
  methodology,
  values,
  changes,
  sources,
  anchor,
  gitSha,
}: ComputedRunProps) {
  const t = getT(lang)
  const first = values[0] as ApiEvent
  const last = values[values.length - 1] as ApiEvent
  const open = last.at_build.reason === 'counted'
  const groups = groupEvidence(last.evidence)
  const citedBy = new Map<string, number>()
  for (const v of values) {
    for (const id of new Set(v.evidence.map((e) => e.source)))
      citedBy.set(id, (citedBy.get(id) ?? 0) + 1)
  }
  const allSources = [...citedBy.keys()].flatMap((id) => {
    const s = sources[id]
    return s === undefined ? [] : [s]
  })
  const count = formatInteger(values.length, lang)
  return (
    <article
      id={anchor}
      className="event-card grid scroll-mt-8 gap-x-8 gap-y-3 border-t border-rule py-6 md:grid-cols-[112px_1fr]"
    >
      <div className="flex flex-row flex-wrap items-start gap-x-4 gap-y-2 md:flex-col">
        <p className="font-mono text-m13">
          <time dateTime={last.date}>{last.date}</time>
        </p>
        <IndicatorBadge
          lang={lang}
          methodology={methodology}
          indicator={last.indicator}
          category={last.category}
        />
      </div>
      <div className="flex min-w-0 flex-col gap-3">
        <h3 className="text-18 font-normal">{last.summary[lang]}</h3>
        <p className="text-14 text-ink-2">
          {open || last.end === null
            ? t('run.spanOpen', { count, from: first.date })
            : t('run.span', { count, from: first.date, to: last.end })}
        </p>
        <table className="w-auto border-collapse text-14">
          <caption className="mb-1 text-start text-14 font-semibold">
            {t('run.changesCaption')}
          </caption>
          <thead>
            <tr className="border-b border-rule">
              <th scope="col" className="py-1 pe-8 text-start font-semibold">
                {t('run.date')}
              </th>
              <th scope="col" className="py-1 pe-8 text-end font-semibold">
                {t('run.points')}
              </th>
              <th scope="col" className="py-1 text-end font-semibold">
                {t('run.before')}
              </th>
            </tr>
          </thead>
          <tbody>
            {[...changes].reverse().map((v) => (
              <tr key={v.id} className="border-b border-rule">
                <td className="py-1 pe-8 font-mono text-m12">
                  <a href={`#${v.id}`}>{v.date}</a>
                </td>
                <td className="num py-1 pe-8 text-end font-mono text-m12">
                  {signed(v.points, lang)}
                </td>
                <td className="num py-1 text-end font-mono text-m12 text-ink-2">
                  {v.previous_points === null ? t('run.none') : signed(v.previous_points, lang)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {groups.rows.map((row) => (
          <TableRowList key={`${row.path}#${row.line}`} row={row} t={t} gitSha={gitSha} />
        ))}
        {groups.quotes.map((ev, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: evidence entries have no id; order is fixed.
          <QuoteFigure key={i} ev={ev} lang={lang} t={t} />
        ))}
        <PointsLine lang={lang} methodology={methodology} event={last} t={t} />
        <ArchivedResponses lang={lang} sources={latestSources(last, sources)} t={t} />
        <details className="run-values text-14">
          <summary>{t('run.all', { count })}</summary>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full border-collapse text-14">
              <caption className="sr-only">{t('run.allCaption')}</caption>
              <thead>
                <tr className="border-b border-rule">
                  <th scope="col" className="py-1 pe-3 text-start font-semibold">
                    {t('run.from')}
                  </th>
                  <th scope="col" className="py-1 pe-3 text-start font-semibold">
                    {t('run.until')}
                  </th>
                  <th scope="col" className="py-1 pe-3 text-end font-semibold">
                    {t('run.points')}
                  </th>
                  <th scope="col" className="py-1 pe-3 text-start font-semibold">
                    {t('run.basis')}
                  </th>
                  <th scope="col" className="py-1 text-start font-semibold">
                    {t('run.row')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...values].reverse().map((v) => {
                  const rows = groupEvidence(v.evidence).rows
                  return (
                    <tr key={v.id} id={v.id} className="ev-value scroll-mt-8 border-b border-rule">
                      <td className="py-1 pe-3 align-top font-mono text-m12">{v.date}</td>
                      <td className="py-1 pe-3 align-top font-mono text-m12">
                        {v.end ?? t('run.inForce')}
                      </td>
                      <td className="num py-1 pe-3 text-end align-top font-mono text-m12">
                        {signed(v.points, lang)}
                      </td>
                      <td
                        className="min-w-48 py-1 pe-3 align-top text-12"
                        lang={lang === 'en' ? undefined : 'en'}
                      >
                        {v.points_rationale ?? ''}
                      </td>
                      <td className="py-1 align-top font-mono text-m12">
                        {rows.map((r) => {
                          const href = rowUrl(REPO_URL, gitSha, r)
                          const label = `${r.table}:${r.line}`
                          return (
                            <span
                              key={label}
                              className="flex min-h-6 items-center whitespace-nowrap"
                            >
                              {href === null ? label : <a href={href}>{label}</a>}
                            </span>
                          )
                        })}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-14">{t('run.responsesAll', { count })}</p>
          <ArchivedResponses
            lang={lang}
            sources={allSources}
            t={t}
            citedBy={{ counts: citedBy, total: values.length }}
          />
        </details>
      </div>
    </article>
  )
}

function latestSources(e: ApiEvent, sources: ApiSourceMap) {
  return [...new Set(e.evidence.map((x) => x.source))].flatMap((id) => {
    const s = sources[id]
    return s === undefined ? [] : [s]
  })
}
