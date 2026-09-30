/**
 * D1 computed events from fts_funding.csv and gni.csv (docs/02 §5, D-08). Each row is the
 * government funding F of a trailing-12-month window ending on the last day of a month; its event
 * is valid for the following month (from window_end + 1 day to the first day of the month after),
 * "recomputed monthly; valid one month". x = F / GNI in percent, tiers of formula d1.
 *
 * GNI: the latest year of gni.csv not after the window's end year, else the most recent year
 * available ("latest available year", docs/02 §5). A country with no GNI row gets no D1 event
 * (listed in the notes). Windows with F = 0 give no event: they contribute 0 either way.
 */
import {
  addDays,
  formatEventId,
  type Located,
  STRUCTURED_TABLES,
  type StructuredRow,
} from '@gai/schema'
import { formatLongDate, formulaPoints, percentOfGni } from '@gai/scoring'
import { addMonths } from '../fetch/fts.js'
import {
  baseEvent,
  type GenerateContext,
  type Generated,
  money,
  rowEvidence,
  signed,
  usdExact,
} from './common.js'
import { formula } from './sipri.js'

type GniRow = Located<StructuredRow<'gni.csv'>>

/** The GNI row used for a window ending in `year` (see the module comment). */
export function gniFor(rows: readonly GniRow[], year: number): GniRow | undefined {
  const sorted = [...rows].sort((a, b) => a.value.year - b.value.year)
  return [...sorted].reverse().find((r) => r.value.year <= year) ?? sorted.at(-1)
}

export function generateD1(
  ctx: GenerateContext,
  funding: readonly Located<StructuredRow<'fts_funding.csv'>>[],
  gni: readonly GniRow[],
): Generated {
  const f = formula(ctx, 'd1')
  if (f.kind !== 'tiers') throw new Error('formula d1 is not tiers')
  const gniBy = new Map<string, GniRow[]>()
  for (const g of gni) gniBy.set(g.value.iso3, [...(gniBy.get(g.value.iso3) ?? []), g])
  const fCols = STRUCTURED_TABLES['fts_funding.csv'].columns
  const gCols = STRUCTURED_TABLES['gni.csv'].columns
  const events = []
  const noGni = new Set<string>()
  for (const row of funding) {
    const r = row.value
    if (ctx.excluded.has(r.iso3) || r.usd_paid_committed <= 0) continue
    const g = gniFor(gniBy.get(r.iso3) ?? [], Number(r.window_end.slice(0, 4)))
    if (g === undefined || g.value.gni_atlas_usd <= 0) {
      noGni.add(r.iso3)
      continue
    }
    const x = percentOfGni(r.usd_paid_committed, g.value.gni_atlas_usd)
    const points = formulaPoints(f, x)
    const start = addDays(r.window_end, 1)
    const end = `${addMonths(start.slice(0, 7), 1)}-01`
    events.push(
      baseEvent(
        {
          id: formatEventId({ date: start, iso3: r.iso3, indicator: 'D1', slug: 'fts' }),
          country: r.iso3,
          indicator: 'D1',
          type: 'computed',
          date: start,
          end,
          points,
          points_rationale: `F = ${usdExact(r.usd_paid_committed)} (${r.window_start} to ${r.window_end}, plans ${r.plan_ids.replaceAll(';', ', ')}); GNI ${g.value.year} = ${usdExact(g.value.gni_atlas_usd)}; x = ${x.toPrecision(3)}% of GNI; tier ${signed(points)}.`,
          summary: {
            en: `The government paid or committed ${money(r.usd_paid_committed, 'en')} to the oPt flash appeals in the 12 months to ${formatLongDate(r.window_end, 'en')}, per FTS.`,
            fr: `Le gouvernement a versé ou engagé ${money(r.usd_paid_committed, 'fr')} aux appels éclair pour le Territoire palestinien occupé sur les 12 mois au ${formatLongDate(r.window_end, 'fr')}, selon le FTS.`,
          },
          evidence: [
            ...rowEvidence(row as Located<Record<string, unknown>>, 'fts_funding.csv', fCols),
            ...rowEvidence(g as Located<Record<string, unknown>>, 'gni.csv', gCols),
          ],
        },
        'fts_funding.csv',
      ),
    )
  }
  const notes = [...noGni]
    .sort()
    .map((c) => `${c}: FTS funding but no GNI in gni.csv; D1 is no-data`)
  return { events, notes }
}
