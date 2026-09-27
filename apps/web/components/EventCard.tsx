import type { ApiEvent, ApiSource, ApiSourceMap } from '@gai/schema/api'
import { plain, signed } from '../lib/format'
import { getT, type Lang } from '../lib/i18n'
import { categoryById, type SiteMethodology } from '../lib/methodology'
import { ConfidenceChip } from './ConfidenceChip'
import { CopyHash } from './CopyHash'

export interface EventCardProps {
  lang: Lang
  methodology: SiteMethodology
  event: ApiEvent
  sources: ApiSourceMap
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

function uniqueSources(event: ApiEvent, sources: ApiSourceMap): ApiSource[] {
  const seen = new Set<string>()
  const out: ApiSource[] = []
  for (const ev of event.evidence) {
    if (seen.has(ev.source)) continue
    seen.add(ev.source)
    const s = sources[ev.source]
    if (s !== undefined) out.push(s)
  }
  return out
}

/**
 * One event (docs/05 §5 EventCard): date and indicator badge on the left; summary, quotes
 * (original first, translation beneath), points, confidence, scope and evidence on the right.
 * The layout is the same whatever the sign of the points. Reported and disputed events carry a
 * one-line notice; retracted events are struck through and link to the correction.
 */
export function EventCard({ lang, methodology, event, sources }: EventCardProps) {
  const t = getT(lang)
  const retracted = event.status === 'retracted'
  const latestCorrection = event.corrections[event.corrections.length - 1] ?? null
  const correctionHref = (id: string) => `/${lang}/corrections/#${id}`
  const flagged = event.confidence === 'reported' || event.confidence === 'disputed'
  const weight = plain(event.at_build.weight, lang)
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
        <p className={`text-18 ${retracted ? 'text-ink-2 line-through' : ''}`}>
          {event.summary[lang]}
        </p>
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
        {event.evidence.map((ev, i) => {
          const translation =
            ev.quote_lang === lang ? null : lang === 'en' ? ev.quote_en : ev.quote_fr
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: evidence entries have no id; order is fixed.
            <figure key={i} className="flex flex-col gap-1">
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
        })}
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
        <ul className="flex flex-col gap-1 text-14">
          {uniqueSources(event, sources).map((s) => (
            <li key={s.id} className="flex flex-wrap items-center gap-x-2">
              <a href={s.url} title={s.title} lang={s.language}>
                {s.publisher}
              </a>
              <span aria-hidden="true" className="text-ink-3">
                ·
              </span>
              {s.wayback_url !== null ? (
                <a href={s.wayback_url}>{t('event.archived')}</a>
              ) : (
                <span className="text-ink-2">{t('event.notArchived')}</span>
              )}
              {s.sha256 !== null ? (
                <>
                  <span aria-hidden="true" className="text-ink-3">
                    ·
                  </span>
                  <CopyHash sha256={s.sha256} />
                </>
              ) : null}
              <span className="font-mono text-m12 text-ink-3">{s.date}</span>
            </li>
          ))}
        </ul>
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
