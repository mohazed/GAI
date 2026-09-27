import type { ApiReply } from '@gai/schema/api'
import { getT, type Lang } from '../lib/i18n'
import { OutcomeChip } from './OutcomeChip'

/**
 * Published replies on a country page, beneath the events (docs/05 §5 RightOfReplyBlock, D-18):
 * the reply verbatim in its language, its translation, the project's response and the outcome.
 * With none, one line and the link to the instructions.
 */
export function RightOfReplyBlock({ lang, replies }: { lang: Lang; replies: readonly ApiReply[] }) {
  const t = getT(lang)
  const how = `/${lang}/reply/`
  if (replies.length === 0) {
    return (
      <p className="text-16 text-ink-2">
        {t('reply.none')} <a href={how}>{t('reply.how')}</a>
      </p>
    )
  }
  return (
    <div className="flex flex-col">
      {replies.map((r) => {
        const translation = r.text.lang === lang ? null : r.text[lang]
        return (
          <article
            key={r.id}
            id={r.id}
            className="flex scroll-mt-8 flex-col gap-3 border-t border-rule py-6"
          >
            <header className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-16 font-semibold">
                {t('reply.from', { org: r.from.org, role: r.from.role })}
              </h3>
              <p className="font-mono text-m12 text-ink-2">
                {t('reply.dates', { received: r.received_at, published: r.published_at })}
              </p>
            </header>
            <p className="text-14">
              {t('reply.contests')}{' '}
              {r.contests.map((id, i) => (
                <span key={id}>
                  {i > 0 ? ', ' : ''}
                  <a href={`#${id}`} className="font-mono text-m12">
                    {id}
                  </a>
                </span>
              ))}
            </p>
            <blockquote lang={r.text.lang} className="quote-rule text-16">
              {r.text.original}
            </blockquote>
            {translation !== null ? (
              <p lang={lang} className="quote-rule text-16 text-ink-2">
                <span className="sr-only">{t('event.translationLabel')} </span>
                {translation}
              </p>
            ) : null}
            <div className="flex flex-col gap-1">
              <p className="text-14 font-semibold">{t('reply.response')}</p>
              <p className="text-16">{r.response[lang]}</p>
            </div>
            <p className="flex items-center gap-2 text-14">
              {t('reply.outcomeLabel')} <OutcomeChip lang={lang} outcome={r.outcome} />
            </p>
          </article>
        )
      })}
    </div>
  )
}
