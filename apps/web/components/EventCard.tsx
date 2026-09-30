import type { ApiEvent, ApiEvidence, ApiSource, ApiSourceMap } from '@gai/schema/api'
import { formatInteger, plain, signed } from '../lib/format'
import { getT, type Lang, type T } from '../lib/i18n'
import { categoryById, type SiteMethodology } from '../lib/methodology'
import { REPO_URL } from '../lib/site'
import { groupEvidence, rowUrl, type TableRow } from '../lib/structured-row'
import { ConfidenceChip } from './ConfidenceChip'
import { CopyHash } from './CopyHash'

export interface EventCardProps {
  lang: Lang
  methodology: SiteMethodology
  event: ApiEvent
  sources: ApiSourceMap
  /** Commit the build read (manifest `git.sha`): table rows link to their line at it. */
  gitSha?: string | null
}

/** Indicator badge: `A6 · Arms & military`, an outlined chip. */
export function IndicatorBadge({
  lang,
  methodology,
  indicator,
  category,
}: {
  lang: Lang
  methodology: SiteMethodology
  indicator: string
  category: string
}) {
  return (
    <span className="inline-block rounded-xs border border-rule px-1.5 py-0.5 text-start text-12 text-ink">
      <span className="font-mono text-m12">{indicator}</span>
      <span aria-hidden="true">&nbsp;·&nbsp;</span>
      <span className="sr-only">, </span>
      {categoryById(methodology, category).name[lang]}
    </span>
  )
}

function sourcesOf(ids: readonly string[], sources: ApiSourceMap): ApiSource[] {
  return ids.flatMap((id) => {
    const s = sources[id]
    return s === undefined ? [] : [s]
  })
}

function Dot() {
  return (
    <span aria-hidden="true" className="text-ink-3">
      ·
    </span>
  )
}

/** A quote, original language first, the translation in the page language beneath. */
export function QuoteFigure({ ev, lang, t }: { ev: ApiEvidence; lang: Lang; t: T }) {
  const translation = ev.quote_lang === lang ? null : lang === 'en' ? ev.quote_en : ev.quote_fr
  return (
    <figure className="flex flex-col gap-1">
      <blockquote lang={ev.quote_lang} className="quote-rule text-16">
        {ev.quote}
      </blockquote>
      {translation !== null ? (
        <p lang={lang} className="quote-rule text-16 text-ink-2">
          <span className="sr-only">{t('event.translationLabel')} </span>
          {translation}
        </p>
      ) : null}
      <figcaption className="font-mono text-m12 text-ink-2">{ev.locator}</figcaption>
    </figure>
  )
}

/** `Publisher · Archived copy · sha256 3f2a…e1 · date`, the evidence row of docs/05 §5. */
export function SourceLine({ s, t, label }: { s: ApiSource; t: T; label?: string }) {
  return (
    <li className="flex flex-wrap items-center gap-x-2 gap-y-2">
      <a href={s.url} title={s.title} lang={s.language}>
        {label ?? s.publisher}
      </a>
      <Dot />
      {s.wayback_url !== null ? (
        <a href={s.wayback_url}>{t('event.archived')}</a>
      ) : (
        <span className="text-ink-2">{t('event.notArchived')}</span>
      )}
      {s.sha256 !== null ? (
        <>
          <Dot />
          <CopyHash sha256={s.sha256} />
        </>
      ) : null}
      <span className="font-mono text-m12 text-ink-3">{s.date}</span>
    </li>
  )
}

/** A structured-table row as a small key/value list, with its line in the repository. */
export function TableRowList({ row, t, gitSha }: { row: TableRow; t: T; gitSha: string | null }) {
  const href = rowUrl(REPO_URL, gitSha, row)
  return (
    <figure className="flex flex-col gap-1">
      <figcaption className="flex flex-wrap items-baseline gap-x-2 text-14">
        <span className="font-mono text-m12 text-ink-2">
          {t('gen.row', { line: row.line, path: row.path })}
        </span>
        {href !== null ? <a href={href}>{t('gen.rowLink')}</a> : null}
      </figcaption>
      <dl className="quote-rule grid grid-cols-[minmax(0,auto)_minmax(0,1fr)] gap-x-4 font-mono text-m12">
        {row.fields.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-ink-2">{k}</dt>
            <dd className="break-all">{v}</dd>
          </div>
        ))}
      </dl>
    </figure>
  )
}

/**
 * The archived dataset responses a table row cites (the pages of one API query, the location
 * list, the GNI row…), collapsed behind their count; each with its Wayback copy and hash.
 */
export function ArchivedResponses({
  lang,
  sources,
  t,
  citedBy,
}: {
  lang: Lang
  sources: readonly ApiSource[]
  t: T
  /** For a run: how many of its values cite each source. */
  citedBy?: { counts: ReadonlyMap<string, number>; total: number }
}) {
  if (sources.length === 0) return null
  return (
    <details className="text-14">
      <summary>{t('gen.responses', { count: sources.length })}</summary>
      <ul className="mt-2 flex flex-col gap-1">
        {sources.map((s) => {
          const k = citedBy?.counts.get(s.id) ?? 0
          return (
            <li key={s.id} className="flex flex-col gap-0.5 border-t border-rule pt-1">
              <ul>
                <SourceLine s={s} t={t} label={s.title} />
              </ul>
              <p className="font-mono text-m12 text-ink-2">
                {s.id}
                {s.retrieved_at !== null
                  ? ` · ${t('gen.retrieved', { date: s.retrieved_at.slice(0, 10) })}`
                  : ''}
                {citedBy !== undefined && k < citedBy.total
                  ? ` · ${t('gen.citedBy', { count: formatInteger(k, lang), total: formatInteger(citedBy.total, lang) })}`
                  : ''}
              </p>
            </li>
          )
        })}
      </ul>
    </details>
  )
}

/** Points, confidence, scope, and why the event does not count at the build date. */
export function PointsLine({
  lang,
  methodology,
  event,
  t,
}: {
  lang: Lang
  methodology: SiteMethodology
  event: ApiEvent
  t: T
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="num font-mono text-m14 font-semibold">
          <span className="sr-only">{t('event.pointsLabel')} </span>
          {signed(event.points, lang)}
        </p>
        <ConfidenceChip lang={lang} confidence={event.confidence} methodology={methodology} />
        <p className="text-14 text-ink-2">
          {t('event.scopeLine', {
            scopes: event.scope.map((s) => t(`event.scopes.${s}`)).join(', '),
          })}
        </p>
        {event.status === 'published' && event.at_build.reason !== 'counted' ? (
          <p className="text-14 text-ink-2">
            {t('event.notCounted', { reason: t(`event.reasons.${event.at_build.reason}`) })}
          </p>
        ) : null}
      </div>
      {event.points_rationale !== null && event.points_rationale !== '' ? (
        <p className="text-14 text-ink-2">{t('gen.rationale', { text: event.points_rationale })}</p>
      ) : null}
    </div>
  )
}

/**
 * One event (docs/05 §5 EventCard): date and indicator badge on the left; summary, quotes
 * (original first, translation beneath), points, confidence, scope and evidence on the right.
 * The layout is the same whatever the sign of the points. Reported and disputed events carry a
 * one-line notice; retracted events are struck through and link to the correction. A generated
 * event (D-08) keeps the layout: its table row as a key/value list in place of a quote, then the
 * archived dataset responses the row cites, collapsed behind their count; a vote also shows its
 * press-release quote.
 */
export function EventCard({ lang, methodology, event, sources, gitSha = null }: EventCardProps) {
  const t = getT(lang)
  const retracted = event.status === 'retracted'
  const latestCorrection = event.corrections[event.corrections.length - 1] ?? null
  const correctionHref = (id: string) => `/${lang}/corrections/#${id}`
  const flagged = event.confidence === 'reported' || event.confidence === 'disputed'
  const weight = plain(event.at_build.weight, lang)
  const groups = event.generated ? groupEvidence(event.evidence) : null
  const rowSources = new Set(groups?.rows.flatMap((r) => r.sources) ?? [])
  const quotes = groups === null ? event.evidence : groups.quotes
  const listed = [...new Set(quotes.map((q) => q.source))].filter((id) => !rowSources.has(id))
  return (
    <article
      id={event.id}
      className="event-card grid scroll-mt-8 gap-x-8 gap-y-3 border-t border-rule py-6 md:grid-cols-[112px_1fr]"
    >
      <div className="flex flex-row flex-wrap items-start gap-x-4 gap-y-2 md:flex-col">
        <p className="font-mono text-m13">
          <time dateTime={event.date}>{event.date}</time>
          {event.end !== null ? (
            <span className="block text-m12 text-ink-2">
              {t('event.ended')}
              <time dateTime={event.end} className="block">
                {event.end}
              </time>
            </span>
          ) : null}
        </p>
        <IndicatorBadge
          lang={lang}
          methodology={methodology}
          indicator={event.indicator}
          category={event.category}
        />
      </div>
      <div className="flex min-w-0 flex-col gap-3">
        <h3 className={`text-18 font-normal ${retracted ? 'text-ink-2 line-through' : ''}`}>
          {event.summary[lang]}
        </h3>
        {retracted ? (
          <p className="text-14">
            {t('event.retracted')}{' '}
            {latestCorrection !== null ? (
              <a href={correctionHref(latestCorrection)}>
                {t('event.seeCorrection', { id: latestCorrection })}
              </a>
            ) : null}
          </p>
        ) : event.revision > 1 && latestCorrection !== null ? (
          <p className="text-14 text-ink-2">
            <a href={correctionHref(latestCorrection)}>
              {t('event.revision', { n: event.revision })}
            </a>
          </p>
        ) : null}
        {flagged && !retracted ? (
          <p className="border-s-2 border-dotted border-ink-3 ps-3 text-14 text-ink-2">
            {t(`event.notice.${event.confidence as 'reported' | 'disputed'}`, { weight })}
          </p>
        ) : null}
        {groups?.rows.map((row) => (
          <TableRowList key={`${row.path}#${row.line}`} row={row} t={t} gitSha={gitSha} />
        ))}
        {quotes.map((ev, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: evidence entries have no id; order is fixed.
          <QuoteFigure key={i} ev={ev} lang={lang} t={t} />
        ))}
        <PointsLine lang={lang} methodology={methodology} event={event} t={t} />
        {listed.length > 0 ? (
          <ul className="flex flex-col gap-2 text-14">
            {sourcesOf(listed, sources).map((s) => (
              <SourceLine key={s.id} s={s} t={t} />
            ))}
          </ul>
        ) : null}
        {groups !== null ? (
          <ArchivedResponses lang={lang} sources={sourcesOf([...rowSources], sources)} t={t} />
        ) : null}
        {event.replies.length > 0 ? (
          <p className="text-14">
            {event.replies.map((id) => (
              <a key={id} href={`#${id}`} className="me-4">
                {t('event.contested')}
              </a>
            ))}
          </p>
        ) : null}
      </div>
    </article>
  )
}
