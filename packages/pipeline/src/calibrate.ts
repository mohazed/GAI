/**
 * Calibration numbers (P-15, docs/08 §3): the scores of every scored entity at one date, and what
 * each methodology proposal under review would change, computed with the engine of @gai/scoring on
 * a methodology compiled in memory. Nothing here writes a methodology file: a proposal is applied
 * to a copy of the loaded files or to the engine's output, measured, and thrown away. A proposal
 * adopted for the next version still goes through a new version folder (docs/08 §1, P-24).
 *
 * The proposals measured (docs/10 §2):
 *   b21  `official-video` and `parliamentary` sources make an event `confirmed` (B-21);
 *   b22  "most severe" stacking for A3, A6, A7, B3, B7 and D2 instead of sum (B-22, B-51);
 *   b23  an indicator cap on B1 equal to the passivity points (B-23, one option);
 *   b46  only contributions of +2 or more qualify against passivity (B-46);
 *   b47  the pre-existing B8 tier (+3) does not qualify (B-47);
 *   b48  the alternative to B-48's kept default: a standing state qualifies while it holds;
 *   pre-existing B8 +3 rows for the registry's recognitions before 2023-10-07 (B-199 (3)).
 *
 * Passivity proposals (b46, b47, b48) re-decide the penalty from the engine's event evaluations
 * and recombine the clipped subtotals (docs/02 §7): passivity is applied after the categories, so
 * nothing else moves. Pure: no I/O, no clock.
 */
import type { Event, Methodology } from '@gai/schema'
import {
  atLeast,
  type CategoryId,
  type CountryScore,
  combine,
  compileMethodology,
  createScorer,
  type EventEvaluation,
  type MethodologyFilesInput,
  type ScoreOptions,
  type ScoringMethodology,
  spearman,
} from '@gai/scoring'

type Clipped = Record<'A' | 'B' | 'C' | 'D', number>

/** One country's result under one variant, reduced to what the calibration compares. */
export interface Scored {
  iso3: string
  exact: number
  display: number
  band: string
  clipped: Clipped
  passivity: boolean
}

/** A passivity decision from the engine's evaluation of one event. */
export type Qualifies = (e: EventEvaluation, m: ScoringMethodology) => boolean

export interface VariantSpec {
  id: string
  /** Methodology to score with (default: the baseline's). */
  methodology?: ScoringMethodology
  /** Event rewrite applied before scoring (default: none). */
  events?: (events: readonly Event[]) => Event[]
  /** Passivity re-decided from the evaluations (default: the engine's decision). */
  qualifies?: Qualifies
}

/** Events of the given statuses scored as if published (the `--preview` of `pnpm score`). */
export function asPublished(events: readonly Event[], statuses: readonly string[]): Event[] {
  return events.map((e) =>
    statuses.includes(e.status) ? { ...e, status: 'published' as const } : e,
  )
}

// ---------------------------------------------------------------------------------------------
// Proposals

/** B-21: events with a source of one of `kinds` rise to `confirmed` (corroborated or reported). */
export function raiseConfidence(
  events: readonly Event[],
  kindOf: ReadonlyMap<string, string>,
  kinds: readonly string[],
): { events: Event[]; raised: string[] } {
  const raised: string[] = []
  const out = events.map((e) => {
    if (e.confidence !== 'corroborated' && e.confidence !== 'reported') return e
    if (!e.evidence.some((ev) => kinds.includes(kindOf.get(ev.source) ?? ''))) return e
    raised.push(e.id)
    return { ...e, confidence: 'confirmed' as const }
  })
  return { events: out, raised: raised.sort() }
}

type IndicatorFile = MethodologyFilesInput['indicators']['indicators'][number]

function withIndicators(
  files: MethodologyFilesInput,
  change: (i: IndicatorFile) => IndicatorFile,
): MethodologyFilesInput {
  return {
    ...files,
    indicators: { ...files.indicators, indicators: files.indicators.indicators.map(change) },
  }
}

/** B-22, B-51: the given indicators stack by `most_severe` instead of summing. */
export function mostSevereFiles(
  files: MethodologyFilesInput,
  ids: readonly string[],
): MethodologyFilesInput {
  return withIndicators(files, (i) =>
    ids.includes(i.id) ? { ...i, stacking: { rule: 'most_severe' } } : i,
  )
}

/** B-23 (one option): an indicator-level cap on one indicator. */
export function cappedFiles(
  files: MethodologyFilesInput,
  id: string,
  cap: { min: number | null; max: number | null },
): MethodologyFilesInput {
  return withIndicators(files, (i) => (i.id === id ? { ...i, indicator_cap: cap } : i))
}

/** The engine's input files of a loaded methodology; throws when one failed to load. */
export function methodologyFiles(lm: Methodology): MethodologyFilesInput {
  const { indicatorsFile, categories, bands, confidence, decay, passivity } = lm
  if (
    indicatorsFile === null ||
    categories === null ||
    bands === null ||
    confidence === null ||
    decay === null ||
    passivity === null
  ) {
    throw new Error(`methodology ${lm.folder}: a file failed to load`)
  }
  return {
    indicators: indicatorsFile.value,
    categories: categories.value,
    bands: bands.value,
    confidence: confidence.value,
    decay: decay.value,
    passivity: passivity.value,
    thresholds: lm.thresholds?.value,
  }
}

/** The standing indicators that summed in 1.0.0-rc.1 and stack by most severe from rc.2. */
export const RC2_MOST_SEVERE: readonly string[] = ['A3', 'A6', 'A7', 'B3', 'B7', 'D2']

/**
 * The engine rules of 1.0.0-rc.1, the base the P-15 proposals were measured against, rebuilt
 * from the files of 1.0.0-rc.2 (P-24): passivity on the absolute contribution and on every B8
 * tier, no B1 cap, A3, A6, A7, B3, B7 and D2 summed. The data changes of rc.2 (confidence of
 * the events with a parliamentary or official-video source, the generators' parameters) are not
 * reverted: they live in the events and tables, not in these files.
 */
export function rc1Files(files: MethodologyFilesInput): MethodologyFilesInput {
  return {
    ...withIndicators(files, (i) =>
      i.id === 'B1'
        ? { ...i, indicator_cap: null }
        : RC2_MOST_SEVERE.includes(i.id)
          ? { ...i, stacking: { rule: 'sum' } }
          : i,
    ),
    passivity: {
      ...files.passivity,
      contribution_sign: 'any',
      excluded: (files.passivity.excluded ?? []).filter((e) => e.tiers === undefined),
    },
  }
}

export const compile = (files: MethodologyFilesInput): ScoringMethodology =>
  compileMethodology(files)

/** The engine's own passivity decision (docs/02 §6, rc.1). */
export const engineQualifies: Qualifies = (e) => e.qualifies

/** B-46: only contributions of +min_abs_contribution or more qualify. */
export const positiveOnly: Qualifies = (e, m) =>
  e.qualifies && atLeast(e.value, m.passivity.minAbsContribution)

/** B-47: the pre-existing recognition tier of B8 (+3) does not qualify. */
export const noPreexistingB8: Qualifies = (e) =>
  e.qualifies && !(e.indicator === 'B8' && e.points === 3)

/**
 * The alternative to B-48's kept default: a standing state of a qualifying indicator qualifies on
 * every day it holds (its own contribution meeting the threshold), not only for 365 days from its
 * start. Other events as the engine decides.
 */
export const standingWhileHolding: Qualifies = (e, m) =>
  e.qualifies ||
  (e.type === 'standing' &&
    m.passivity.qualifying.includes(e.indicator) &&
    e.reason !== 'not-published' &&
    e.reason !== 'out-of-scope' &&
    atLeast(Math.abs(e.value), m.passivity.minAbsContribution))

export const both =
  (a: Qualifies, b: Qualifies): Qualifies =>
  (e, m) =>
    a(e, m) && b(e, m)

/**
 * Pre-existing recognitions as B8 +3 standing events from the window start (docs/02 §2 B8), for
 * the countries whose registry date is before it and that have no B8 event already. The registry
 * dates are leads (A/78/846, B-199 (3)): these events are hypothetical and never filed.
 */
export function preexistingB8(
  countries: readonly { iso3: string; since: string | null }[],
  have: ReadonlySet<string>,
  windowStart: string,
): Event[] {
  return countries
    .filter((c) => c.since !== null && c.since < windowStart && !have.has(c.iso3))
    .map(
      (c) =>
        ({
          id: `calibration_B8_${c.iso3}`,
          country: c.iso3,
          indicator: 'B8',
          type: 'standing',
          date: windowStart,
          end: null,
          points: 3,
          confidence: 'confirmed',
          scope: ['gaza'],
          status: 'published',
        }) as unknown as Event,
    )
}

// ---------------------------------------------------------------------------------------------
// Scoring

function reduce(s: CountryScore): Scored {
  const c = s.categories
  return {
    iso3: s.country,
    exact: s.exact,
    display: s.display,
    band: s.band,
    clipped: { A: c.A.clipped, B: c.B.clipped, C: c.C.clipped, D: c.D.clipped },
    passivity: s.passivity.applied,
  }
}

/** Re-decides passivity with `q` and recombines the clipped subtotals (docs/02 §7). */
export function repassivate(
  s: CountryScore,
  m: ScoringMethodology,
  q: Qualifies,
  points = m.passivity.points,
): Scored {
  const applied = !s.events.some((e) => q(e, m))
  const c = s.categories
  const clipped = { A: c.A.clipped, B: c.B.clipped, C: c.C.clipped, D: c.D.clipped }
  const r = combine(clipped, applied ? points : 0, m)
  return {
    iso3: s.country,
    exact: r.exact,
    display: r.display,
    band: r.band,
    clipped,
    passivity: applied,
  }
}

export interface CountryEventsIn {
  iso3: string
  events: readonly Event[]
}

/** Scores every country at `date` under a variant. */
export function scoreVariant(
  countries: readonly CountryEventsIn[],
  base: ScoringMethodology,
  date: string,
  spec: VariantSpec,
  options: ScoreOptions = {},
): { scores: Scored[]; full: Map<string, CountryScore> } {
  const m = spec.methodology ?? base
  const full = new Map<string, CountryScore>()
  const scores = [...countries]
    .sort((a, b) => (a.iso3 < b.iso3 ? -1 : a.iso3 > b.iso3 ? 1 : 0))
    .map((c) => {
      const events = spec.events ? spec.events(c.events) : [...c.events]
      const s = createScorer(c.iso3, events, m, options).at(date)
      full.set(c.iso3, s)
      if (spec.qualifies === undefined) return reduce(s)
      const points = options.passivityPoints ?? m.passivity.points
      return repassivate(s, m, spec.qualifies, points)
    })
  return { scores, full }
}

export interface Comparison {
  /** Countries whose integer display score differs. */
  changedDisplay: number
  /** Countries whose band differs, with both bands. */
  bandChanges: { iso3: string; from: string; to: string; fromDisplay: number; toDisplay: number }[]
  /** Countries whose passivity decision differs. */
  passivityChanges: { iso3: string; from: boolean; to: boolean }[]
  /** Spearman's ρ of the full-precision scores. */
  spearman: number | null
}

export function compare(a: readonly Scored[], b: readonly Scored[]): Comparison {
  if (a.length !== b.length || a.some((s, i) => s.iso3 !== b[i]?.iso3)) {
    throw new RangeError('the two score lists must cover the same countries in the same order')
  }
  const bandChanges: Comparison['bandChanges'] = []
  const passivityChanges: Comparison['passivityChanges'] = []
  let changed = 0
  a.forEach((x, i) => {
    const y = b[i] as Scored
    if (x.display !== y.display) changed++
    if (x.band !== y.band) {
      bandChanges.push({
        iso3: x.iso3,
        from: x.band,
        to: y.band,
        fromDisplay: x.display,
        toDisplay: y.display,
      })
    }
    if (x.passivity !== y.passivity)
      passivityChanges.push({ iso3: x.iso3, from: x.passivity, to: y.passivity })
  })
  return {
    changedDisplay: changed,
    bandChanges,
    passivityChanges,
    spearman: spearman(
      a.map((s) => s.exact),
      b.map((s) => s.exact),
    ),
  }
}

export interface SensitivityRow {
  id: string
  spearman: number | null
  changedDisplay: number
}

/**
 * The five tables of docs/02 §10 under a variant, as `sensitivitySuite` computes them (tables 1
 * and 2 recombine the clipped subtotals with the variant's passivity decision; tables 3–5
 * rescore), reduced to Spearman's ρ and the number of changed display scores per row.
 */
export function sensitivityRows(
  countries: readonly CountryEventsIn[],
  base: ScoringMethodology,
  date: string,
  spec: VariantSpec,
): SensitivityRow[] {
  const m = spec.methodology ?? base
  const baseline = scoreVariant(countries, base, date, spec).scores
  const row = (id: string, scored: readonly Scored[]): SensitivityRow => {
    const c = compare(baseline, scored)
    return { id, spearman: c.spearman, changedDisplay: c.changedDisplay }
  }
  const recombined = (points: number, weights?: Partial<Record<CategoryId, number>>) =>
    baseline.map((s) => {
      const r = combine(s.clipped, s.passivity ? points : 0, m, weights)
      return { ...s, exact: r.exact, display: r.display, band: r.band }
    })
  const rows: SensitivityRow[] = []
  for (const p of m.passivity.sensitivityPoints) rows.push(row(`passivity-${p}`, recombined(p)))
  for (const k of ['A', 'B', 'C', 'D'] as const) {
    for (const w of [0.5, 1.5]) {
      rows.push(row(`weight-${k}-${w}`, recombined(m.passivity.points, { [k]: w })))
    }
  }
  for (const w of [0.2, 0.6]) {
    rows.push(
      row(
        `reported-${w}`,
        scoreVariant(countries, base, date, spec, { confidenceWeights: { reported: w } }).scores,
      ),
    )
  }
  rows.push(
    row(
      'statements-excluded',
      scoreVariant(countries, base, date, spec, { excludeIndicators: ['B9', 'B10'] }).scores,
    ),
  )
  rows.push(row('decay-off', scoreVariant(countries, base, date, spec, { decay: 'off' }).scores))
  return rows
}

// ---------------------------------------------------------------------------------------------
// P-04 implementation choices

export interface TierRun {
  iso3: string
  /** Months with a D1 value above zero. */
  months: number
  /** Changes of points between consecutive months (a month without an event reads 0). */
  changes: number
  /** "YYYY-MM points" for each month where the points change, the first month included. */
  steps: string[]
  /** Changes if the value of each quarter's first month held for the quarter (a comparison). */
  quarterlyChanges: number
}

/** D1 month to month (docs/02 §5 "recomputed monthly; valid one month"), per country. */
export function d1Runs(generated: readonly Event[], from: string, to: string): TierRun[] {
  const by = new Map<string, Map<string, number>>()
  for (const e of generated) {
    if (e.indicator !== 'D1') continue
    const month = e.date.slice(0, 7)
    if (month < from || month > to) continue
    const m = by.get(e.country) ?? new Map<string, number>()
    m.set(month, e.points)
    by.set(e.country, m)
  }
  const months: string[] = []
  for (let y = Number(from.slice(0, 4)), mo = Number(from.slice(5, 7)); ; ) {
    const key = `${y}-${String(mo).padStart(2, '0')}`
    if (key > to) break
    months.push(key)
    mo++
    if (mo > 12) {
      mo = 1
      y++
    }
  }
  return [...by.entries()]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([iso3, values]) => {
      let prev: number | null = null
      let changes = 0
      const steps: string[] = []
      for (const mo of months) {
        const p = values.get(mo) ?? 0
        if (prev === null || p !== prev) {
          if (prev !== null) changes++
          steps.push(`${mo} ${p}`)
        }
        prev = p
      }
      let q: number | null = null
      let quarterlyChanges = 0
      for (const mo of months) {
        if (!['01', '04', '07', '10'].includes(mo.slice(5, 7))) continue
        const p = values.get(mo) ?? 0
        if (q !== null && p !== q) quarterlyChanges++
        q = p
      }
      return {
        iso3,
        months: [...values.values()].filter((p) => p > 0).length,
        changes,
        steps,
        quarterlyChanges,
      }
    })
}

/** Points of one country's generated events of one indicator, with their validity. */
export function computedRuns(
  generated: readonly Event[],
  iso3: string,
  indicator: string,
): { date: string; end: string | null; points: number; id: string }[] {
  return generated
    .filter((e) => e.country === iso3 && e.indicator === indicator)
    .map((e) => ({ date: e.date, end: e.end ?? null, points: e.points, id: e.id }))
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
}
