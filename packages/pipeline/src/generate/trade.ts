/**
 * A2 (military exports by customs code) and C3 (trade as usual) computed events from the Comtrade
 * tables (docs/02 §5, D-08). One event per country and annual window; the country's own report is
 * used when it has one, else Israel's mirror report, else no event (no-data, never zero). The event
 * starts on the first release of the data used and ends when the next window's data is released.
 *
 * A2: V = the window's exports under the full HS codes (93, 8710), plus the conditional codes
 * (8526, 8802) only for the countries and codes in `confirmedMilitary` (a licence register,
 * parliamentary answer or investigation confirms the military nature, docs/02 §2 A2). Rows of
 * conditional codes are otherwise kept in the table and not counted. Tiers of formula a2; an
 * event is written even at 0 points, since it records that export data exists.
 * C3: T and T(2022) from one reporter; tiers only when r = T / T(2022) ≥ 0.9 (formula c3).
 */
import { formatEventId, type Located, STRUCTURED_TABLES, type StructuredRow } from '@gai/schema'
import { formulaPoints } from '@gai/scoring'
import { byNumber } from './actor.js'
import {
  actorFor,
  baseEvent,
  type GenerateContext,
  type Generated,
  money,
  percent,
  rowEvidence,
  signed,
  usdExact,
} from './common.js'
import { formula } from './sipri.js'

type Reporter = 'self' | 'mirror'

interface Window<R> {
  iso3: string
  start: string
  end: string
  release: string
  reporter: Reporter
  rows: Located<R>[]
}

/** Keeps, per country, the windows in order and the time each is valid (release to release). */
function withValidity<R>(windows: Window<R>[]): (Window<R> & { until: string | null })[] {
  const out: (Window<R> & { until: string | null })[] = []
  const byCountry = new Map<string, Window<R>[]>()
  for (const w of windows) byCountry.set(w.iso3, [...(byCountry.get(w.iso3) ?? []), w])
  for (const list of byCountry.values()) {
    list.sort((a, b) => (a.start < b.start ? -1 : a.start > b.start ? 1 : 0))
    // A window whose successor was released on or before it never takes effect.
    const kept = list.filter((w, i) => list.slice(i + 1).every((n) => n.release > w.release))
    kept.forEach((w, i) => {
      out.push({ ...w, until: kept[i + 1]?.release ?? null })
    })
  }
  return out
}

/** The source of the figures, French by the actor's number (`sa` or `leur` déclaration). */
const REPORTER_TEXT: Record<Reporter, { en: string; fr: readonly [string, string] }> = {
  self: {
    en: 'per its report to UN Comtrade',
    fr: ['selon sa déclaration à UN Comtrade', 'selon leur déclaration à UN Comtrade'],
  },
  mirror: {
    en: "per Israel's report to UN Comtrade",
    fr: [
      "selon la déclaration d'Israël à UN Comtrade",
      "selon la déclaration d'Israël à UN Comtrade",
    ],
  },
}

export function generateA2(
  ctx: GenerateContext,
  rows: readonly Located<StructuredRow<'comtrade_a2.csv'>>[],
  confirmedMilitary: ReadonlyMap<string, ReadonlySet<string>> = new Map(),
): Generated {
  const f = formula(ctx, 'a2')
  if (f.kind !== 'tiers') throw new Error('formula a2 is not tiers')
  const full = (f.parameters?.hs_full as string[] | undefined) ?? ['93', '8710']
  const conditional = (f.parameters?.hs_conditional as string[] | undefined) ?? ['8526', '8802']
  const counted = (iso3: string, hs: string) =>
    full.includes(hs) || (conditional.includes(hs) && confirmedMilitary.get(iso3)?.has(hs) === true)
  const groups = new Map<string, Window<StructuredRow<'comtrade_a2.csv'>>>()
  for (const row of rows) {
    const r = row.value
    if (ctx.excluded.has(r.iso3) || !counted(r.iso3, r.hs)) continue
    const k = `${r.iso3}\u0000${r.window_start}\u0000${r.window_end}\u0000${r.reporter}`
    const g = groups.get(k) ?? {
      iso3: r.iso3,
      start: r.window_start,
      end: r.window_end,
      release: r.release_date,
      reporter: r.reporter,
      rows: [],
    }
    g.rows.push(row)
    groups.set(k, g)
  }
  // Own report first, else the mirror (docs/02 §5).
  const chosen = new Map<string, Window<StructuredRow<'comtrade_a2.csv'>>>()
  for (const g of groups.values()) {
    const k = `${g.iso3}\u0000${g.start}\u0000${g.end}`
    const cur = chosen.get(k)
    if (cur === undefined || (cur.reporter === 'mirror' && g.reporter === 'self')) chosen.set(k, g)
  }
  const columns = STRUCTURED_TABLES['comtrade_a2.csv'].columns
  const events = []
  for (const w of withValidity([...chosen.values()])) {
    const v = w.rows.reduce((s, r) => s + r.value.usd, 0)
    const codes = [...new Set(w.rows.map((r) => r.value.hs))].sort()
    const points = formulaPoints(f, v)
    const year = w.start.slice(0, 4)
    const a = actorFor(ctx, w.iso3)
    events.push(
      baseEvent(
        {
          id: formatEventId({
            date: w.release,
            iso3: w.iso3,
            indicator: 'A2',
            slug: `comtrade-${year}-${w.reporter}`,
          }),
          country: w.iso3,
          indicator: 'A2',
          type: 'computed',
          date: w.release,
          end: w.until,
          points,
          points_rationale: `V = ${usdExact(v)} of exports to Israel under HS ${codes.join(' + ')}, ${w.start} to ${w.end} (${w.reporter} report); tier ${signed(points)}.`,
          summary: {
            en: `${a.en} exported ${money(v, 'en')} of goods under HS ${codes.join(', ')} to Israel in ${year}, ${REPORTER_TEXT[w.reporter].en}.`,
            fr: `${a.fr} ${byNumber(a, 'a', 'ont')} exporté vers Israël ${money(v, 'fr')} de marchandises (SH ${codes.join(', ')}) en ${year}, ${byNumber(a, REPORTER_TEXT[w.reporter].fr[0], REPORTER_TEXT[w.reporter].fr[1])}.`,
          },
          evidence: w.rows.flatMap((r) =>
            rowEvidence(r as Located<Record<string, unknown>>, 'comtrade_a2.csv', columns),
          ),
        },
        'comtrade_a2.csv',
      ),
    )
  }
  return { events, notes: [] }
}

export function generateC3(
  ctx: GenerateContext,
  rows: readonly Located<StructuredRow<'comtrade_c3.csv'>>[],
): Generated {
  const f = formula(ctx, 'c3')
  if (f.kind !== 'ratio_gated_tiers') throw new Error('formula c3 is not ratio_gated_tiers')
  const chosen = new Map<string, Window<StructuredRow<'comtrade_c3.csv'>>>()
  for (const row of rows) {
    const r = row.value
    if (ctx.excluded.has(r.iso3)) continue
    const k = `${r.iso3}\u0000${r.window_start}\u0000${r.window_end}`
    const cur = chosen.get(k)
    if (cur === undefined || (cur.reporter === 'mirror' && r.reporter === 'self')) {
      chosen.set(k, {
        iso3: r.iso3,
        start: r.window_start,
        end: r.window_end,
        release: r.release_date,
        reporter: r.reporter,
        rows: [row],
      })
    }
  }
  const columns = STRUCTURED_TABLES['comtrade_c3.csv'].columns
  const events = []
  for (const w of withValidity([...chosen.values()])) {
    const row = w.rows[0] as Located<StructuredRow<'comtrade_c3.csv'>>
    const { usd_total: t, usd_2022: t0 } = row.value
    const points = formulaPoints(f, t, t0)
    const ratio = t0 === 0 ? null : t / t0
    const year = w.start.slice(0, 4)
    const level = ratio === null ? '' : `, ${percent(ratio, 'en', 0)} of its 2022 level`
    const levelFr = ratio === null ? '' : `, soit ${percent(ratio, 'fr', 0)} du niveau de 2022`
    const a = actorFor(ctx, w.iso3)
    events.push(
      baseEvent(
        {
          id: formatEventId({
            date: w.release,
            iso3: w.iso3,
            indicator: 'C3',
            slug: `comtrade-${year}-${w.reporter}`,
          }),
          country: w.iso3,
          indicator: 'C3',
          type: 'computed',
          date: w.release,
          end: w.until,
          points,
          points_rationale: `T = ${usdExact(t)}, T(2022) = ${usdExact(t0)}, r = ${ratio === null ? 'n/a' : ratio.toFixed(3)} (${w.reporter} report); ${ratio !== null && ratio < f.ratio_min ? `r < ${f.ratio_min}, 0` : `tier ${signed(points)}`}.`,
          summary: {
            en: `${a.en} traded goods worth ${money(t, 'en')} with Israel in ${year}${level}, ${REPORTER_TEXT[w.reporter].en}.`,
            fr: `${a.fr} ${byNumber(a, 'a', 'ont')} échangé avec Israël ${money(t, 'fr')} de marchandises en ${year}${levelFr}, ${byNumber(a, REPORTER_TEXT[w.reporter].fr[0], REPORTER_TEXT[w.reporter].fr[1])}.`,
          },
          evidence: rowEvidence(
            row as Located<Record<string, unknown>>,
            'comtrade_c3.csv',
            columns,
          ),
        },
        'comtrade_c3.csv',
      ),
    )
  }
  return { events, notes: [] }
}
