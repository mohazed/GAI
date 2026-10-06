/**
 * Short indicator labels for generated text: the summary line (spec §5: "Last change:
 * 2026-09-12, UNGA vote (B1, +3).") and change explanations. Noun phrases, lower case except
 * proper names and acronyms, no adjectives; the same wording pattern for positive and negative
 * indicators. Since methodology 1.0.0-rc.2 they live in indicators.yaml `short` (B-54), so they
 * are versioned with the indicators they name; until then they were a table in this file.
 */
import type { ScoringMethodology } from './methodology.js'
import type { LangText } from './types.js'

/** Indicator id → short label, from the compiled methodology; throws when one has none. */
export function indicatorLabels(
  m: Pick<ScoringMethodology, 'indicators' | 'version'>,
): Readonly<Record<string, LangText>> {
  const out: Record<string, LangText> = {}
  for (const ind of m.indicators) {
    if (ind.short === null) {
      throw new Error(`indicator ${ind.id} has no short label in methodology ${m.version}`)
    }
    out[ind.id] = ind.short
  }
  return Object.freeze(out)
}

/** The label of an indicator; throws when the indicator has none. */
export function indicatorLabel(labels: Readonly<Record<string, LangText>>, id: string): LangText {
  const label = labels[id]
  if (label === undefined) throw new Error(`no short label for indicator ${id}`)
  return label
}
