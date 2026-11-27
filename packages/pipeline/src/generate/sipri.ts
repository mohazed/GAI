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
 * Which years a release scores is `parameters.years` of formula a4: `release-year` (the default,
 * methodology 1.0.0-rc.1 and rc.2) reads only the release's own data year; `first-reporting-release`
 * (1.0.0-rc.3) scores each data year from `orders_signed_from` once, in the first release of the
 * table that has rows of that year, so a year whose own release was never imported is scored by
 * the next imported one. Either way there is one A4 event per country and release (the engine
 * takes one computed value per indicator and window, docs/02 §3): its points are the sum of each
 * year's tier and its rationale lists each year's TIV.
 */
import {
  type Formula,
  formatEventId,
  type Located,
  STRUCTURED_TABLES,
  type StructuredRow,
} from '@gai/schema'
import { formulaPoints } from '@gai/scoring'
import { byNumber } from './actor.js'
import {
  actorFor,
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
    const a = actorFor(ctx, r.supplier_iso3)
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
            en: `${a.en} delivered ${percent(s, 'en')} of Israel's imports of major arms in ${y}, per SIPRI TIV.`,
            fr: `${a.fr} ${byNumber(a, 'a', 'ont')} livré ${percent(s, 'fr')} des importations d'armes majeures d'Israël en ${y}, selon les TIV du SIPRI.`,
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

/** The rule of formula a4 that says which data years a release scores (`parameters.years`). */
export type A4Years = 'release-year' | 'first-reporting-release'

export function a4YearsRule(f: Formula): A4Years {
  const v = ('parameters' in f ? f.parameters?.years : undefined) ?? 'release-year'
  if (v !== 'release-year' && v !== 'first-reporting-release') {
    throw new Error(
      `formula a4 parameters.years is "${String(v)}"; expected release-year or first-reporting-release`,
    )
  }
  return v
}

/**
 * The data years each release scores under the rule: its own data year (`release-year`), or
 * every year from `firstYear` up to its data year that no earlier release of the table carries
 * (`first-reporting-release`). Pure; releases in date order.
 */
export function a4YearsByRelease(
  rows: readonly { release_date: string; data_year: number }[],
  rule: A4Years,
  firstYear: number,
): Map<string, Set<number>> {
  const releases = [...new Set(rows.map((r) => r.release_date))].sort()
  const out = new Map<string, Set<number>>(releases.map((d) => [d, new Set<number>()]))
  if (rule === 'release-year') {
    for (const d of releases) out.get(d)?.add(dataYearOf(d))
    return out
  }
  const assigned = new Set<number>()
  for (const d of releases) {
    const years = [...new Set(rows.filter((r) => r.release_date === d).map((r) => r.data_year))]
      .filter((y) => y >= firstYear && y <= dataYearOf(d) && !assigned.has(y))
      .sort((a, b) => a - b)
    for (const y of years) {
      assigned.add(y)
      out.get(d)?.add(y)
    }
  }
  return out
}

/** "a, b and c" in English, "a, b et c" in French. */
function listJoin(items: readonly string[], lang: 'en' | 'fr'): string {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')} ${lang === 'en' ? 'and' : 'et'} ${items.at(-1)}`
}

export function generateA4(
  ctx: GenerateContext,
  rows: readonly Located<StructuredRow<'sipri_orders.csv'>>[],
): Generated {
  const f = formula(ctx, 'a4')
  if (f.kind !== 'tiers') throw new Error('formula a4 is not tiers')
  const signedFrom = String(f.parameters?.orders_signed_from ?? '2023-10-07')
  const rule = a4YearsRule(f)
  // The first data year whose 1 January is on or after the signing date (2024 for 2023-10-07).
  const signedYear = Number(signedFrom.slice(0, 4))
  const firstYear = signedFrom.slice(5) === '01-01' ? signedYear : signedYear + 1
  const yearsBy = a4YearsByRelease(
    rows.map((r) => r.value),
    rule,
    firstYear,
  )
  const next = nextReleases(rows.map((r) => r.value.release_date))
  const columns = STRUCTURED_TABLES['sipri_orders.csv'].columns
  const notes: string[] = []
  // Rows scored, grouped by release and country, in file order.
  const groups = new Map<string, Located<StructuredRow<'sipri_orders.csv'>>[]>()
  for (const row of rows) {
    const r = row.value
    if (ctx.excluded.has(r.buyer_iso3)) continue
    if (isDataYearRow(r) && `${r.data_year}-01-01` < signedFrom) {
      if (r.tiv_new_orders_from_israel > 0) {
        notes.push(
          `sipri_orders.csv row ${row.line}: ${r.buyer_iso3} orders of ${r.data_year} not scored (the year starts before ${signedFrom})`,
        )
      }
      continue
    }
    if (!yearsBy.get(r.release_date)?.has(r.data_year)) continue
    if (`${r.data_year}-01-01` < signedFrom) continue
    if (r.tiv_new_orders_from_israel <= 0) continue
    const key = `${r.release_date}\u0000${r.buyer_iso3}`
    groups.set(key, [...(groups.get(key) ?? []), row])
  }
  const events = []
  for (const group of groups.values()) {
    const sorted = [...group].sort((a, b) => a.value.data_year - b.value.data_year)
    const first = sorted[0]
    if (first === undefined) continue
    const { release_date: release, buyer_iso3: iso3 } = first.value
    const parts = sorted.map((row) => ({
      year: row.value.data_year,
      tiv: row.value.tiv_new_orders_from_israel,
      points: formulaPoints(f, row.value.tiv_new_orders_from_israel),
    }))
    const points = parts.reduce((sum, p) => sum + p.points, 0)
    if (points === 0) continue
    const years = parts.map((p) => p.year)
    const a = actorFor(ctx, iso3)
    const ownYearOnly = parts.length === 1 && years[0] === dataYearOf(release)
    const only = parts[0]
    const summary =
      parts.length === 1 && only !== undefined
        ? {
            en: `${a.en} ordered major arms from Israel in ${only.year} worth ${tiv(only.tiv, 'en')} TIV, per SIPRI${ownYearOnly ? '' : ` (release of ${release})`}.`,
            fr: `${a.fr} ${byNumber(a, 'a', 'ont')} commandé à Israël en ${only.year} des armes majeures d'une valeur de ${tiv(only.tiv, 'fr')} TIV, selon le SIPRI${ownYearOnly ? '' : ` (publication du ${release})`}.`,
          }
        : {
            en: `${a.en} ordered major arms from Israel worth ${listJoin(
              parts.map((p) => `${tiv(p.tiv, 'en')} TIV in ${p.year}`),
              'en',
            )}, per SIPRI (release of ${release}).`,
            fr: `${a.fr} ${byNumber(a, 'a', 'ont')} commandé à Israël des armes majeures pour ${listJoin(
              parts.map((p) => `${tiv(p.tiv, 'fr')} TIV en ${p.year}`),
              'fr',
            )}, selon le SIPRI (publication du ${release}).`,
          }
    const rationale =
      parts.length === 1 && only !== undefined
        ? `SIPRI release ${release}: new orders from Israel in ${only.year} worth ${only.tiv} TIV${ownYearOnly ? '' : `, scored in the first imported release that reports the year (formula a4, years: ${rule})`}; tier ${signed(points)}.`
        : `SIPRI release ${release}: new orders from Israel in ${listJoin(
            parts.map((p) => `${p.year} worth ${p.tiv} TIV (tier ${signed(p.points)})`),
            'en',
          )}, each year scored once, in the first imported release that reports it (formula a4, years: ${rule}); ${signed(points)}.`
    events.push(
      baseEvent(
        {
          id: formatEventId({
            date: release,
            iso3,
            indicator: 'A4',
            slug: `orders-${years.join('-')}`,
          }),
          country: iso3,
          indicator: 'A4',
          type: 'computed',
          date: release,
          end: next.get(release) ?? null,
          points,
          points_rationale: rationale,
          summary,
          evidence: sorted.flatMap((row) =>
            rowEvidence(row as Located<Record<string, unknown>>, 'sipri_orders.csv', columns),
          ),
        },
        'sipri_orders.csv',
      ),
    )
  }
  return { events, notes }
}
