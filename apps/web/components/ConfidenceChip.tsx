import type { Lang } from '../lib/i18n'
import type { SiteMethodology } from '../lib/methodology'

export type ConfidenceId = 'confirmed' | 'corroborated' | 'reported' | 'disputed'

export interface ConfidenceChipProps {
  lang: Lang
  confidence: ConfidenceId
  methodology: SiteMethodology
}

const BORDER: Record<ConfidenceId, string> = {
  confirmed: 'border border-solid border-rule',
  corroborated: 'border border-solid border-ink-3',
  reported: 'border border-dotted border-ink-3',
  disputed: 'border border-dotted border-ink',
}

/** Outlined chip; the line style differs by level and the label is always written (docs/05 §5). */
export function ConfidenceChip({ lang, confidence, methodology }: ConfidenceChipProps) {
  const level = methodology.confidence.find((c) => c.id === confidence)
  const label = level?.label[lang] ?? confidence
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-xs px-1.5 py-0.5 text-14 text-ink ${BORDER[confidence]}`}
    >
      {confidence === 'disputed' ? (
        <span aria-hidden="true" className="font-semibold">
          !
        </span>
      ) : null}
      {label}
    </span>
  )
}
