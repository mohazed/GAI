/**
 * A1 (deliveries to Israel) and A4 (orders from Israel) computed events from the SIPRI tables
 * (docs/02 §5, D-08). A SIPRI release R published in March of year Y+1 carries data through year
 * Y; for each release, the rows of data year Y = year(R) − 1 give one event per country, valid
 * from R to the next release in the table (open-ended for the latest).
 *
 * A1: s = TIV(country → Israel, Y) / TIV(all → Israel, Y), points −40 × √s rounded to one decimal
 * (formula a1). No event before `no_data_before` (the first post-war release): A1 is no-data then.
 * A4: tiers on the TIV of new orders placed with Israel in year Y (formula a4). Only years that
 * start on or after `orders_signed_from` (2023-10-07) count, because SIPRI dates orders by year:
 * 2023 orders include contracts signed before 7 October and are left out rather than guessed.
 */
import {
  type Formula,
  formatEventId,
  type Located,
  STRUCTURED_TABLES,
  type StructuredRow,
} from '@gai/schema'
import { formulaPoints } from '@gai/scoring'
import {
  baseEvent,
  type GenerateContext,
  type Generated,
  percent,
  rowEvidence,
  signed,
  tiv,
} from './common.js'

export function formula(ctx: GenerateContext, ref: string): Formula {
  const f = ctx.thresholds.formulas[ref]
  if (f === undefined) throw new Error(`thresholds.yaml has no formula ${ref}`)
  return f
}

/** Release dates in order, and the next one after each (null for the latest). */
function nextReleases(dates: Iterable<string>): Map<string, string | null> {
  const sorted = [...new Set(dates)].sort()
  return new Map(sorted.map((d, i) => [d, sorted[i + 1] ?? null]))
}

/** The data year of a SIPRI release: the year before its publication (docs/02 §5). */
export const dataYearOf = (release: string): number => Number(release.slice(0, 4)) - 1

/**
 * A row of its release's data year: the only rows the generators read. An export over a range of
 * years also carries the earlier years; those rows are history, not the measure of the release.
 */
export function isDataYearRow(r: { release_date: string; data_year: number }): boolean {
  return r.data_year === dataYearOf(r.release_date)
}

/**
 * The share s = TIV(country) / TIV(all) of a sipri_deliveries.csv row can be computed: a total
 * above zero and a TIV that does not exceed it. generateA1 notes the other rows with deliveries
 * ("no event").
 */
export function isA1ShareComputable(r: StructuredRow<'sipri_deliveries.csv'>): boolean {
  return r.tiv_total_to_israel > 0 && r.tiv_to_israel <= r.tiv_total_to_israel
}

export function generateA1(
  ctx: GenerateContext,
  rows: readonly Located<StructuredRow<'sipri_deliveries.csv'>>[],
): Generated {
  const f = formula(ctx, 'a1')
  if (f.kind !== 'sqrt_share') throw new Error('formula a1 is not sqrt_share')
  const next = nextReleases(rows.map((r) => r.value.release_date))
  const columns = STRUCTURED_TABLES['sipri_deliveries.csv'].columns
  const events = []
  const notes: string[] = []
  for (const row of rows) {
    const r = row.value
    if (ctx.excluded.has(r.supplier_iso3)) continue
    if (!isDataYearRow(r)) continue
    if (r.release_date < f.no_data_before) {
      notes.push(
        `sipri_deliveries.csv row ${row.line}: release ${r.release_date} is before ${f.no_data_before}; A1 is no-data then`,
      )
      continue
    }
    if (r.tiv_to_israel <= 0) continue
    if (!isA1ShareComputable(r)) {
      notes.push(
        `sipri_deliveries.csv row ${row.line}: TIV ${r.tiv_to_israel} of a total ${r.tiv_total_to_israel}; no event`,
      )
      continue
    }
    const s = r.tiv_to_israel / r.tiv_total_to_israel
    const points = formulaPoints(f, s)
    const y = r.data_year
    events.push(
      baseEvent(
        {
          id: formatEventId({
            date: r.release_date,
            iso3: r.supplier_iso3,
            indicator: 'A1',
            slug: `tiv-${y}`,
          }),
          country: r.supplier_iso3,
          indicator: 'A1',
          type: 'computed',
          date: r.release_date,
          end: next.get(r.release_date) ?? null,
          points,
          points_rationale: `SIPRI release ${r.release_date}, ${y}: TIV ${r.tiv_to_israel} of ${r.tiv_total_to_israel} delivered to Israel, s = ${s.toFixed(4)}; ${f.scale} × √s = ${signed(points)}.`,
          summary: {
            en: `The country delivered ${percent(s, 'en')} of Israel's imports of major arms in ${y}, per SIPRI TIV.`,
            fr: `Le pays a livré ${percent(s, 'fr')} des importations d'armes majeures d'Israël en ${y}, selon les TIV du SIPRI.`,
          },
          evidence: rowEvidence(
            row as Located<Record<string, unknown>>,
            'sipri_deliveries.csv',
            columns,
          ),
        },
        'sipri_deliveries.csv',
      ),
    )
  }
  return { events, notes }
}

export function generateA4(
  ctx: GenerateContext,
  rows: readonly Located<StructuredRow<'sipri_orders.csv'>>[],
): Generated {
  const f = formula(ctx, 'a4')
  if (f.kind !== 'tiers') throw new Error('formula a4 is not tiers')
  const signedFrom = String(f.parameters?.orders_signed_from ?? '2023-10-07')
  const next = nextReleases(rows.map((r) => r.value.release_date))
  const columns = STRUCTURED_TABLES['sipri_orders.csv'].columns
  const events = []
  const notes: string[] = []
  for (const row of rows) {
    const r = row.value
    if (ctx.excluded.has(r.buyer_iso3)) continue
    if (!isDataYearRow(r)) continue
    if (`${r.data_year}-01-01` < signedFrom) {
      if (r.tiv_new_orders_from_israel > 0) {
        notes.push(
          `sipri_orders.csv row ${row.line}: ${r.buyer_iso3} orders of ${r.data_year} not scored (the year starts before ${signedFrom})`,
        )
      }
      continue
    }
    if (r.tiv_new_orders_from_israel <= 0) continue
    const points = formulaPoints(f, r.tiv_new_orders_from_israel)
    const y = r.data_year
    events.push(
      baseEvent(
        {
          id: formatEventId({
            date: r.release_date,
            iso3: r.buyer_iso3,
            indicator: 'A4',
            slug: `orders-${y}`,
          }),
          country: r.buyer_iso3,
          indicator: 'A4',
          type: 'computed',
          date: r.release_date,
          end: next.get(r.release_date) ?? null,
          points,
          points_rationale: `SIPRI release ${r.release_date}: new orders from Israel in ${y} worth ${r.tiv_new_orders_from_israel} TIV; tier ${signed(points)}.`,
          summary: {
            en: `The country ordered major arms from Israel in ${y} worth ${tiv(r.tiv_new_orders_from_israel, 'en')} TIV, per SIPRI.`,
            fr: `Le pays a commandé à Israël en ${y} des armes majeures d'une valeur de ${tiv(r.tiv_new_orders_from_israel, 'fr')} TIV, selon le SIPRI.`,
          },
          evidence: rowEvidence(
            row as Located<Record<string, unknown>>,
            'sipri_orders.csv',
            columns,
          ),
        },
        'sipri_orders.csv',
      ),
    )
  }
  return { events, notes }
}
