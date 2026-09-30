/**
 * B8 (recognition of the State of Palestine) from recognitions.csv (B-25, D-08).
 *
 * One standing event per row: a recognition dated on or after the window start (2023-10-07) holds
 * from its date at the tier `recognised_after_window` (+8); an earlier recognition is a standing
 * state from the window start at the tier `pre_existing` (+3) (docs/02 §2 B8: one standing state
 * only; pre-existing recognition holds from 2023-10-07). The event never ends: a recognition is
 * not withdrawn in the record. Evidence: the table row and the archived statement it cites.
 *
 * A state with no row gets no event. The table covers the recognitions confirmed from an archived
 * official statement, which is not yet every recognising state, so the build does not derive a B8
 * assessment status from the absence of a row (B-25; the hand status stands).
 */
import {
  formatEventId,
  type Located,
  STRUCTURED_TABLES,
  type StructuredRow,
  WINDOW_START,
} from '@gai/schema'
import { baseEvent, type GenerateContext, type Generated, rowEvidence, signed } from './common.js'

function tier(ctx: GenerateContext, key: string): number {
  const p = ctx.indicators.find((i) => i.id === 'B8')?.points
  const value = p?.kind === 'tiers' ? p.tiers?.find((t) => t.key === key)?.value : undefined
  if (value === undefined) throw new Error(`indicators.yaml has no B8 tier "${key}"`)
  return value
}

export function generateB8(
  ctx: GenerateContext,
  rows: readonly Located<StructuredRow<'recognitions.csv'>>[],
): Generated {
  const columns = STRUCTURED_TABLES['recognitions.csv'].columns
  const events = []
  for (const row of rows) {
    const r = row.value
    if (ctx.excluded.has(r.iso3)) continue
    const after = r.date >= WINDOW_START
    const key = after ? 'recognised_after_window' : 'pre_existing'
    const points = tier(ctx, key)
    const start = after ? r.date : WINDOW_START
    events.push(
      baseEvent(
        {
          id: formatEventId({ date: start, iso3: r.iso3, indicator: 'B8', slug: 'recognition' }),
          country: r.iso3,
          indicator: 'B8',
          type: 'standing',
          date: start,
          end: null,
          points,
          points_rationale: after
            ? `Recognition of the State of Palestine on ${r.date}, on or after ${WINDOW_START}: ${signed(points)}.`
            : `Recognition of the State of Palestine on ${r.date}, before ${WINDOW_START}; a standing state from ${WINDOW_START}: ${signed(points)}.`,
          summary: after
            ? {
                en: 'The country recognised the State of Palestine.',
                fr: "Le pays a reconnu l'État de Palestine.",
              }
            : {
                en: 'The country recognised the State of Palestine, before 7 October 2023.',
                fr: "Le pays a reconnu l'État de Palestine, avant le 7 octobre 2023.",
              },
          evidence: rowEvidence(
            row as Located<Record<string, unknown>>,
            'recognitions.csv',
            columns,
          ),
        },
        'recognitions.csv',
      ),
    )
  }
  return { events, notes: [] }
}
