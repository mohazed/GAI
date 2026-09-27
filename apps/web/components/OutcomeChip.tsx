import { getT, type Lang } from '../lib/i18n'

export type ReplyOutcome = 'none' | 'disputed' | 'corrected' | 'retracted'

/** Outcome of a right-of-reply (docs/05 §5 RightOfReplyBlock): an outlined chip with its label. */
export function OutcomeChip({ lang, outcome }: { lang: Lang; outcome: ReplyOutcome }) {
  const t = getT(lang)
  return (
    <span className="inline-flex items-center rounded-xs border border-ink-3 px-1.5 py-0.5 text-14 text-ink">
      {t(`reply.outcome.${outcome}`)}
    </span>
  )
}
