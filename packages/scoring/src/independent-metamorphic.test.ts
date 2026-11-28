/**
 * Written in P-03 by an independent test writer who derived every expectation from the contract
 * before reading the engine; kept as a second, independent check of the same rules.
 *
 * Metamorphic and property tests of the scoring engine over seeded random inputs.
 *
 * Expected values come from the contract (docs/02 §2, §3, §6, §7, §8, §9; methodology/v1.0.0),
 * not from the engine. The random generator is seeded (mulberry32), so a failure is reproducible
 * from its seed; nothing reads the clock.
 *
 * (a) permuting events never changes any output;
 * (b) adding a published gaza event with positive points never lowers S, with negative points never
 *     raises S, except through the rules that break monotonicity (documented below with exact
 *     counterexamples);
 * (c) the daily series of change points, carried forward, equals scoring each day;
 * (d) lastChange(date) is consistent with the daily scores;
 * (e) S, every category and every indicator stay within their caps;
 * (f) retracting an event gives the same score as deleting it;
 * (g) past all events plus 731 days only standing/computed states and passivity remain.
 */
import { describe, expect, it } from 'vitest'
import type { ScoreOptions } from './contribution.js'
import { coverage } from './coverage.js'
import { type CountryScore, createScorer, scoreCountry } from './score.js'
import { sensitivitySuite } from './sensitivity.js'
import { dailySeries, lastChange, type SeriesPoint, valueOn } from './series.js'
import { eventCounts } from './summary.js'
import { country, ev, methodologyRc1 } from './test-helpers.js'
import { addDays, dayNumber, isoDate } from './time.js'
import { CATEGORY_IDS, CONFIDENCE_LEVELS, type ScoringEvent, WINDOW_START } from './types.js'
import { userScore } from './weights.js'

// The docs/02 rules as written: methodology 1.0.0-rc.1 (rc.2 rules: rc2.test.ts).
const m = methodologyRc1()
const WS = WINDOW_START

// ---------------------------------------------------------------------------------------------
// Contract values, written out by hand from docs/02 and methodology/v1.0.0

/** Allowed per-event points (spec §3, docs/02 §2, §5, indicators.yaml). */
const POINTS: Readonly<Record<string, readonly number[]>> = {
  A1: [-40, -21.9, -12, -4, -0.4],
  A2: [-25, -15, -8, -3, 0],
  A3: [-15],
  A4: [-15, -10, -5, -2],
  A5: [-5],
  A6: [10],
  A7: [25],
  A8: [5],
  B1: [3, -2, -5],
  B2: [-20],
  B3: [15],
  B4: [-15],
  B5: [8],
  B6: [-10],
  B7: [-20],
  B8: [8, 3],
  B9: [2, 5],
  B10: [-5],
  B11: [10, 5],
  B12: [5, 8, 10],
  C1: [4, 10],
  C2: [-10],
  C3: [-8, -5, -3, -2, 0],
  C4: [2, 5],
  C5: [5],
  C6: [3],
  D1: [12, 9, 6, 3, 1],
  D2: [-10],
  D3: [5, 8],
  D4: [5],
  D5: [5],
  E1: [5],
  E2: [-5],
  E3: [5],
}
const INDICATORS = Object.keys(POINTS)

/** Category caps (docs/02 §7). */
const CATEGORY_CAPS: Readonly<Record<string, readonly [number, number]>> = {
  A: [-45, 30],
  B: [-40, 45],
  C: [-20, 20],
  D: [-15, 25],
  E: [-10, 10],
}

/** Indicator-level caps (docs/02 §2). */
const INDICATOR_CAPS: Readonly<Record<string, readonly [number | null, number | null]>> = {
  A5: [-15, null],
  A8: [null, 10],
  B9: [null, 10],
  B10: [-10, null],
}

/** Stacking rules other than a plain sum (docs/02 §2). */
const MOST_SEVERE = new Set(['B8', 'B12', 'C1', 'C4', 'D3'])
const LATEST_POSITION = new Set(['B5', 'B6'])

const CONF_WEIGHT: Readonly<Record<string, number>> = {
  confirmed: 1,
  corroborated: 0.7,
  reported: 0.4,
  disputed: 0.4,
}

const SCORED_CATEGORIES = ['A', 'B', 'C', 'D'] as const

/** Band from the rounded integer (docs/02 §7). */
function bandOf(n: number): string {
  if (n <= -51) return 'sustaining'
  if (n <= -21) return 'enabling'
  if (n <= 0) return 'passive'
  if (n <= 40) return 'acting'
  return 'confronting'
}

/** Half away from zero, tolerant of float noise; never −0. */
function roundHalfAway(x: number, decimals = 0): number {
  const f = 10 ** decimals
  const r = Math.floor(Math.abs(x) * f + 0.5 + 1e-9)
  const out = (Math.sign(x) * r) / f
  return out === 0 ? 0 : out
}

function clipTo(x: number, lo: number | null, hi: number | null): number {
  let y = x
  if (lo !== null && y < lo) y = lo
  if (hi !== null && y > hi) y = hi
  return y
}

const TOL = 1e-9

// ---------------------------------------------------------------------------------------------
// Seeded generator

/** mulberry32. */
function rng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function randInt(r: () => number, lo: number, hi: number): number {
  return lo + Math.floor(r() * (hi - lo + 1))
}

function pick<T>(r: () => number, xs: readonly T[]): T {
  return xs[Math.floor(r() * xs.length)] as T
}

function shuffle<T>(r: () => number, xs: readonly T[]): T[] {
  const a = [...xs]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1))
    const t = a[i] as T
    a[i] = a[j] as T
    a[j] = t
  }
  return a
}

type Sign = 'any' | 'pos' | 'neg'

interface GenOptions {
  readonly sign?: Sign
  /** Days after the window start within which event dates fall. */
  readonly span?: number
  readonly country?: string
  /** Restrict to these indicators. */
  readonly indicators?: readonly string[]
}

function signOk(p: number, sign: Sign): boolean {
  return sign === 'any' || (sign === 'pos' ? p > 0 : p < 0)
}

function genEvent(r: () => number, id: string, o: GenOptions = {}): ScoringEvent {
  const sign = o.sign ?? 'any'
  const pool = (o.indicators ?? INDICATORS).filter((i) =>
    (POINTS[i] ?? []).some((p) => signOk(p, sign)),
  )
  const ind = pick(r, pool)
  const points = pick(
    r,
    (POINTS[ind] ?? []).filter((p) => signOk(p, sign)),
  )
  const date = addDays(WS, randInt(r, 0, o.span ?? 1100))
  const type = m.indicatorById.get(ind)?.type
  const end = type !== 'repeatable' && r() < 0.5 ? addDays(date, randInt(r, 1, 700)) : null
  const c = o.country ?? 'TST'
  return ev(ind, date, points, {
    id: `evt_${date.replaceAll('-', '_')}_${c}_${ind}_${id}`,
    country: c,
    confidence: pick(r, CONFIDENCE_LEVELS),
    end,
  })
}

function genEvents(r: () => number, n: number, tag: string, o: GenOptions = {}): ScoringEvent[] {
  const out: ScoringEvent[] = []
  for (let i = 0; i < n; i++) out.push(genEvent(r, `${tag}n${i}`, o))
  return chainComputed(out)
}

/**
 * Computed values are releases: one holds at a time per country and indicator, each ending where
 * the next starts (docs/02 §3; the engine rejects overlaps). Per indicator, values on an
 * already-used date are dropped and each value ends at the next one's date.
 */
function chainComputed(events: readonly ScoringEvent[]): ScoringEvent[] {
  const out = events.filter((e) => e.type !== 'computed')
  const byKey = new Map<string, ScoringEvent[]>()
  for (const e of events) {
    if (e.type !== 'computed') continue
    const key = `${e.country}/${e.indicator}`
    byKey.set(key, [...(byKey.get(key) ?? []), e])
  }
  for (const list of byKey.values()) {
    const sorted = [...list]
      .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.id < b.id ? -1 : 1))
      .filter((e, i, all) => i === 0 || e.date !== all[i - 1]?.date)
    sorted.forEach((e, i) => {
      const next = sorted[i + 1]
      out.push(next === undefined ? e : { ...e, end: next.date })
    })
  }
  return out
}

/** Indicators an added single event may take: computed values come only as release chains. */
const NOT_COMPUTED = INDICATORS.filter((i) => m.indicatorById.get(i)?.type !== 'computed')

/** Fixed dates around the window and decay boundaries, plus random ones. */
function evalDates(r: () => number, k = 6): string[] {
  const fixed = [
    WS,
    '2024-03-01',
    '2024-10-06',
    '2024-10-07',
    '2025-06-15',
    '2025-10-07',
    '2026-09-26',
    '2027-06-30',
    '2028-12-31',
  ]
  for (let i = 0; i < k; i++) fixed.push(addDays(WS, randInt(r, 0, 2000)))
  return fixed
}

const json = (x: unknown): unknown => JSON.parse(JSON.stringify(x))

function score(events: readonly ScoringEvent[], date: string, opts?: ScoreOptions): CountryScore {
  return scoreCountry('TST', events, date, m, opts)
}

function days(from: string, to: string): string[] {
  const out: string[] = []
  for (let d = dayNumber(from); d <= dayNumber(to); d++) out.push(isoDate(d))
  return out
}

/** The values that determine S at a date (everything but the per-event bookkeeping). */
function scoreCore(s: CountryScore): unknown {
  return json({
    raw: s.raw,
    exact: s.exact,
    score: s.score,
    display: s.display,
    band: s.band,
    passivity: { applied: s.passivity.applied, value: s.passivity.value },
    categories: s.categories,
    indicators: s.indicators
      .filter((i) => i.counted.length > 0)
      .map((i) => ({ id: i.id, raw: i.raw, value: i.value, counted: i.counted })),
  })
}

// ---------------------------------------------------------------------------------------------
// (a) Permutation invariance

describe('(a) permuting events never changes any output', () => {
  it('scores, transitions, series, last change, coverage and counts do not depend on input order', () => {
    const optionSets: (ScoreOptions | undefined)[] = [
      undefined,
      { decay: 'off' },
      { weights: { A: 2, B: 0.5, C: 0, D: 1.5 }, passivityPoints: 25 },
    ]
    for (let seed = 1; seed <= 20; seed++) {
      const r = rng(seed)
      const own = genEvents(r, randInt(r, 3, 40), `a${seed}`)
      const foreign = genEvents(r, 6, `a${seed}f`, { country: 'OTH' })
      const all = [...own, ...foreign]
      const orders = [shuffle(rng(seed * 7919), all), [...all].reverse()]
      const dates = evalDates(r)
      for (const opts of optionSets) {
        const s0 = createScorer('TST', all, m, opts)
        const sx = orders.map((o) => createScorer('TST', o, m, opts))
        for (const s of sx) {
          expect(s.transitionDays()).toEqual(s0.transitionDays())
          for (const day of s0.transitionDays()) {
            expect(json(s.transitionsOn(day))).toEqual(json(s0.transitionsOn(day)))
          }
          for (const d of dates) {
            expect(json(s.at(d))).toEqual(json(s0.at(d)))
            expect(json(lastChange(s, d))).toEqual(json(lastChange(s0, d)))
          }
          expect(json(dailySeries(s, WS, '2028-12-31'))).toEqual(
            json(dailySeries(s0, WS, '2028-12-31')),
          )
        }
      }
      for (const d of dates) {
        const cov0 = coverage({ country: country(), assessment: null, events: all, date: d }, m)
        const cnt0 = eventCounts(own, d)
        for (const o of orders) {
          const cov = coverage({ country: country(), assessment: null, events: o, date: d }, m)
          expect(json(cov)).toEqual(json(cov0))
          expect(
            eventCounts(
              o.filter((e) => e.country === 'TST'),
              d,
            ),
          ).toEqual(cnt0)
        }
      }
    }
    // About 7 s alone; under the parallel `pnpm test` of every package it passed 30 s (B-492 (4)).
  }, 120_000)

  it('with same-day ties in the stacking rules (most severe, latest position, supersede)', () => {
    const focus = ['A6', 'A7', 'B5', 'B6', 'B8', 'B11', 'B12', 'C1', 'C4', 'D3', 'B10', 'D2']
    for (let seed = 51; seed <= 90; seed++) {
      const r = rng(seed)
      const events = genEvents(r, randInt(r, 2, 30), `at${seed}`, { span: 15, indicators: focus })
      const shuffled = shuffle(rng(seed * 104729), events)
      const s0 = createScorer('TST', events, m)
      const s1 = createScorer('TST', shuffled, m)
      for (const d of [...days(WS, addDays(WS, 20)), ...evalDates(r, 4)]) {
        expect(json(s1.at(d)), `seed ${seed} at ${d}`).toEqual(json(s0.at(d)))
        expect(json(lastChange(s1, d))).toEqual(json(lastChange(s0, d)))
      }
    }
  })

  it('the sensitivity suite does not depend on the order of countries or of their events', () => {
    const isos = ['AAA', 'BBB', 'CCC', 'DDD', 'EEE', 'FFF', 'GGG']
    for (let seed = 101; seed <= 106; seed++) {
      const r = rng(seed)
      const countries = isos.map((iso3) => ({
        iso3,
        events: genEvents(r, randInt(r, 0, 25), `s${seed}${iso3}`, { country: iso3 }),
      }))
      const date = addDays(WS, randInt(r, 200, 1400))
      const base = sensitivitySuite(countries, date, m)
      const r2 = rng(seed * 31)
      const permuted = shuffle(r2, countries).map((c) => ({
        iso3: c.iso3,
        events: shuffle(r2, c.events),
      }))
      expect(json(sensitivitySuite(permuted, date, m))).toEqual(json(base))
    }
  })
})

// ---------------------------------------------------------------------------------------------
// (b) Monotonicity in added events

type Cause = 'A7-supersedes-A6' | 'latest-position' | 'most-severe' | 'passivity-lifted'

/**
 * Why adding `x` moved S against its sign, from the before/after evaluations; null when no known
 * rule explains it.
 */
function explain(x: ScoringEvent, before: CountryScore, after: CountryScore): Cause | null {
  const was = new Map(before.events.map((e) => [e.id, e.reason]))
  const displaced = after.events.filter(
    (e) =>
      was.get(e.id) === 'counted' &&
      (e.reason === 'superseded' || e.reason === 'earlier-position' || e.reason === 'less-severe'),
  )
  if (x.points > 0) {
    if (x.indicator === 'A7' && displaced.some((e) => e.indicator === 'A6')) {
      return 'A7-supersedes-A6'
    }
    if (
      LATEST_POSITION.has(x.indicator) &&
      displaced.some((e) => e.reason === 'earlier-position')
    ) {
      return 'latest-position'
    }
    if (MOST_SEVERE.has(x.indicator) && displaced.some((e) => e.reason === 'less-severe')) {
      return 'most-severe'
    }
    return null
  }
  if (before.passivity.applied && !after.passivity.applied) return 'passivity-lifted'
  if (LATEST_POSITION.has(x.indicator) && displaced.some((e) => e.reason === 'earlier-position')) {
    return 'latest-position'
  }
  return null
}

describe('(b) adding an event moves S in the direction of its sign', () => {
  const plainSum = NOT_COMPUTED.filter(
    (i) => !MOST_SEVERE.has(i) && !LATEST_POSITION.has(i) && i !== 'A7',
  )

  it('adding a positive event of a sum or one-per-tier indicator (not A7) never lowers S', () => {
    let rises = 0
    for (let seed = 201; seed <= 500; seed++) {
      const r = rng(seed)
      const base = genEvents(r, randInt(r, 0, 30), `b${seed}`)
      const x = genEvent(r, `b${seed}x`, { sign: 'pos', indicators: plainSum })
      for (const d of evalDates(r, 3)) {
        const before = score(base, d)
        const after = score([...base, x], d)
        expect(after.exact, `seed ${seed} ${x.id} at ${d}`).toBeGreaterThanOrEqual(
          before.exact - TOL,
        )
        expect(before.passivity.applied === false && after.passivity.applied === true).toBe(false)
        if (after.exact > before.exact + TOL) rises++
      }
    }
    expect(rises).toBeGreaterThan(0)
  })

  it('adding a negative event of a sum or one-per-tier indicator never raises S unless it lifts passivity, and then by at most the penalty', () => {
    let lifted = 0
    for (let seed = 501; seed <= 800; seed++) {
      const r = rng(seed)
      const base = genEvents(r, randInt(r, 0, 30), `b${seed}`)
      const x = genEvent(r, `b${seed}x`, { sign: 'neg', indicators: plainSum })
      for (const d of evalDates(r, 3)) {
        const before = score(base, d)
        const after = score([...base, x], d)
        expect(before.passivity.applied === false && after.passivity.applied === true).toBe(false)
        if (before.passivity.applied && !after.passivity.applied) {
          lifted++
          expect(after.exact).toBeLessThanOrEqual(before.exact + 15 + TOL)
        } else {
          expect(after.exact, `seed ${seed} ${x.id} at ${d}`).toBeLessThanOrEqual(
            before.exact + TOL,
          )
        }
      }
    }
    expect(lifted).toBeGreaterThan(0)
  })

  it('over all indicators, every counterexample is explained by one of four rules', () => {
    const found: Record<string, number> = {}
    const unexplained: string[] = []
    // A third of the seeds draw from the indicators whose rules interact, so that each rule is
    // reached; the rest draw from all 34.
    const focus = ['A6', 'A7', 'B1', 'B5', 'B6', 'B8', 'B10', 'B12', 'C1', 'C4', 'D2', 'D3']
    for (let seed = 801; seed <= 2800; seed++) {
      const r = rng(seed)
      const o: GenOptions = seed % 3 === 0 ? { span: 900, indicators: focus } : { span: 900 }
      const base = genEvents(r, randInt(r, 0, 25), `b${seed}`, o)
      const sign: Sign = seed % 2 === 0 ? 'pos' : 'neg'
      const x = genEvent(r, `b${seed}x`, {
        ...o,
        sign,
        indicators: (o.indicators ?? INDICATORS).filter((i) => NOT_COMPUTED.includes(i)),
      })
      for (const d of evalDates(r, 2)) {
        const before = score(base, d)
        const after = score([...base, x], d)
        const against =
          sign === 'pos' ? after.exact < before.exact - TOL : after.exact > before.exact + TOL
        if (!against) continue
        const cause = explain(x, before, after)
        if (cause === null) {
          unexplained.push(`seed ${seed}: ${x.id} (${x.points}) at ${d}`)
        } else {
          found[`${sign}:${cause}`] = (found[`${sign}:${cause}`] ?? 0) + 1
        }
      }
    }
    expect(unexplained).toEqual([])
    // Every rule that can break monotonicity is reached by the generator.
    expect(Object.keys(found).sort()).toEqual([
      'neg:latest-position',
      'neg:passivity-lifted',
      'pos:A7-supersedes-A6',
      'pos:latest-position',
      'pos:most-severe',
    ])
  })

  // Exact counterexamples. Each asserts the spec-literal values (docs/02); they pass when the
  // engine follows the contract and document where the contract itself is not monotone.
  const t = '2024-07-01'

  it('counterexample, A7 supersedes A6 (§2): a reported embargo lowers S by 10', () => {
    const base = [
      ev('A6', '2024-01-10', 10, { id: 'evt_2024_01_10_TST_A6' }),
      ev('A6', '2024-02-01', 10, { id: 'evt_2024_02_01_TST_A6' }),
    ]
    const a7 = ev('A7', '2024-06-01', 25, { id: 'evt_2024_06_01_TST_A7', confidence: 'reported' })
    // A = 10 + 10 = 20; no qualifying event (category A never qualifies): passivity 15.
    const before = score(base, t)
    expect(before.categories.A.clipped).toBeCloseTo(20, 9)
    expect(before.passivity.applied).toBe(true)
    expect(before.exact).toBeCloseTo(5, 9)
    // A7 at 25 × 0.4 = 10 supersedes both A6 events: A = 10.
    const after = score([...base, a7], t)
    expect(after.categories.A.clipped).toBeCloseTo(10, 9)
    expect(after.exact).toBeCloseTo(-5, 9)
    expect(after.display).toBe(-5)
  })

  it('counterexample, latest position (B5/B6, §2): a later reported B5 replaces a confirmed one, S 8 → 3.2', () => {
    const base = [ev('B5', '2024-01-10', 8, { id: 'evt_2024_01_10_TST_B5' })]
    const later = ev('B5', '2024-06-01', 8, { id: 'evt_2024_06_01_TST_B5', confidence: 'reported' })
    expect(score(base, t).exact).toBeCloseTo(8, 9)
    const after = score([...base, later], t)
    expect(after.passivity.applied).toBe(false)
    expect(after.exact).toBeCloseTo(3.2, 9)
  })

  it('counterexample, latest position (B5/B6, §2): a later reported B6 replaces a confirmed one, S −10 → −4', () => {
    const base = [ev('B6', '2024-01-10', -10, { id: 'evt_2024_01_10_TST_B6' })]
    const later = ev('B6', '2024-06-01', -10, {
      id: 'evt_2024_06_01_TST_B6',
      confidence: 'reported',
    })
    expect(score(base, t).exact).toBeCloseTo(-10, 9)
    expect(score([...base, later], t).exact).toBeCloseTo(-4, 9)
  })

  it('counterexample, most severe (B12, §2, reading 1): a reported severance replaces a confirmed downgrade, S 8 → 4', () => {
    const base = [ev('B12', '2024-01-10', 8, { id: 'evt_2024_01_10_TST_B12' })]
    const severed = ev('B12', '2024-06-01', 10, {
      id: 'evt_2024_06_01_TST_B12',
      confidence: 'reported',
    })
    expect(score(base, t).exact).toBeCloseTo(8, 9)
    expect(score([...base, severed], t).exact).toBeCloseTo(4, 9)
  })

  it('counterexample, passivity (§6, |contribution| ≥ 2): a negative event lifts the penalty and raises S', () => {
    // B1 does not qualify: B = 3, passivity 15, S = −12.
    const base = [ev('B1', '2024-01-10', 3, { id: 'evt_2024_01_10_TST_B1' })]
    expect(score(base, t).exact).toBeCloseTo(-12, 9)
    // D2 −10 (UNRWA suspension) qualifies: S = 3 − 10 = −7, five points higher.
    const d2 = ev('D2', '2024-06-01', -10, { id: 'evt_2024_06_01_TST_D2' })
    const withD2 = score([...base, d2], t)
    expect(withD2.passivity.applied).toBe(false)
    expect(withD2.exact).toBeCloseTo(-7, 9)
    // B10 −5 (denial statement): S = 3 − 5 = −2, ten points higher.
    const b10 = ev('B10', '2024-06-01', -5, { id: 'evt_2024_06_01_TST_B10' })
    expect(score([...base, b10], t).exact).toBeCloseTo(-2, 9)
    // B4 −15 (rejecting the ICJ orders): S = 3 − 15 = −12, unchanged.
    const b4 = ev('B4', '2024-06-01', -15, { id: 'evt_2024_06_01_TST_B4' })
    expect(score([...base, b4], t).exact).toBeCloseTo(-12, 9)
  })
})

// ---------------------------------------------------------------------------------------------
// (c) Daily series carried forward equals daily scoring

function sameValues(a: SeriesPoint, b: SeriesPoint): boolean {
  if (a.score !== b.score || a.display !== b.display || a.band !== b.band) return false
  if (a.passivity !== b.passivity) return false
  for (const k of CATEGORY_IDS) {
    if (a.categories[k].raw !== b.categories[k].raw) return false
    if (a.categories[k].clipped !== b.categories[k].clipped) return false
  }
  return true
}

function checkSeries(
  events: readonly ScoringEvent[],
  from: string,
  to: string,
  opts?: ScoreOptions,
) {
  const scorer = createScorer('TST', events, m, opts)
  const pts = dailySeries(scorer, from, to)
  expect(pts.length).toBeGreaterThan(0)
  expect(pts[0]?.date).toBe(from)
  expect(valueOn(pts, addDays(from, -1))).toBeNull()
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1] as SeriesPoint
    const b = pts[i] as SeriesPoint
    expect(dayNumber(b.date)).toBeGreaterThan(dayNumber(a.date))
    // Change points only: each point after the first differs from the one before.
    expect(sameValues(a, b), `redundant point ${b.date}`).toBe(false)
  }
  for (const d of days(from, to)) {
    const p = valueOn(pts, d)
    const s = scorer.at(d)
    expect(p, d).not.toBeNull()
    if (p === null) continue
    expect(p.score, d).toBe(s.score)
    expect(p.score, d).toBe(roundHalfAway(s.exact, 1))
    expect(p.display, d).toBe(s.display)
    expect(p.band, d).toBe(s.band)
    expect(p.passivity, d).toBe(s.passivity.applied)
    for (const k of CATEGORY_IDS) {
      expect(p.categories[k].raw, `${d} ${k} raw`).toBe(roundHalfAway(s.categories[k].raw, 1))
      expect(p.categories[k].clipped, `${d} ${k} clipped`).toBe(
        roundHalfAway(s.categories[k].clipped, 1),
      )
    }
  }
}

describe('(c) the daily series of change points, carried forward, equals scoring each day', () => {
  it('over the whole window and past every expiry', () => {
    for (let seed = 301; seed <= 310; seed++) {
      const r = rng(seed)
      checkSeries(genEvents(r, randInt(r, 1, 30), `c${seed}`), WS, '2028-12-31')
    }
  })

  it('from a date inside the window, with options', () => {
    const opts: (ScoreOptions | undefined)[] = [
      { decay: 'off' },
      { weights: { A: 0, B: 2, C: 1.5, D: 0.5 } },
      { confidenceWeights: { reported: 0.6 }, passivityPoints: 5 },
    ]
    for (let seed = 311; seed <= 316; seed++) {
      const r = rng(seed)
      const events = genEvents(r, randInt(r, 1, 30), `c${seed}`)
      const from = addDays(WS, randInt(r, 1, 900))
      const to = addDays(from, randInt(r, 200, 1200))
      checkSeries(events, from, to, pick(r, opts))
    }
  })

  it('with interacting stacking rules and same-day events', () => {
    const focus = ['A6', 'A7', 'B1', 'B5', 'B6', 'B8', 'B10', 'B12', 'C1', 'C4', 'D2', 'D3']
    for (let seed = 331; seed <= 336; seed++) {
      const r = rng(seed)
      checkSeries(
        genEvents(r, randInt(r, 5, 30), `c${seed}`, { span: 400, indicators: focus }),
        WS,
        '2027-06-30',
      )
    }
  })

  it('with dense events hitting caps', () => {
    for (let seed = 321; seed <= 324; seed++) {
      const r = rng(seed)
      const sign: Sign = seed % 2 === 0 ? 'pos' : 'neg'
      checkSeries(genEvents(r, 60, `c${seed}`, { sign, span: 600 }), WS, '2027-06-30')
    }
  })
})

// ---------------------------------------------------------------------------------------------
// (d) lastChange consistent with the daily scores

function tenths(a: number, b: number): number {
  const d = Math.round((a - b) * 10) / 10
  return d === 0 ? 0 : d
}

describe('(d) lastChange agrees with the daily scores', () => {
  it('decay off: the last change is exactly the latest day whose one-decimal score differs from the day before', () => {
    const opts: ScoreOptions = { decay: 'off' }
    const baseline = score([], WS, opts)
    const LAST = '2028-12-31'
    let nonNull = 0
    for (let seed = 401; seed <= 415; seed++) {
      const r = rng(seed)
      const events = genEvents(r, randInt(r, 0, 25), `d${seed}`)
      const scorer = createScorer('TST', events, m, opts)
      const all = days(WS, LAST).map((d) => scorer.at(d))
      const changed: string[] = []
      for (let i = 0; i < all.length; i++) {
        const prev = i === 0 ? baseline : (all[i - 1] as CountryScore)
        const cur = all[i] as CountryScore
        if (cur.score !== prev.score) changed.push(cur.date)
      }
      for (const t of evalDates(r, 8)) {
        const lc = lastChange(scorer, t)
        const expected = changed.filter((d) => d <= t).at(-1) ?? null
        expect(lc?.date ?? null, `seed ${seed} at ${t}`).toBe(expected)
        if (lc === null || expected === null) continue
        nonNull++
        const i = dayNumber(lc.date) - dayNumber(WS)
        const cur = all[i] as CountryScore
        const prev = i === 0 ? baseline : (all[i - 1] as CountryScore)
        expect(lc.delta).toBeCloseTo(tenths(cur.score, prev.score), 9)
        expect(lc.passivity.before).toBe(prev.passivity.applied)
        expect(lc.passivity.after).toBe(cur.passivity.applied)
      }
    }
    expect(nonNull).toBeGreaterThan(50)
  })

  it('decay on: the last change is a real step, and no later event step changes the one-decimal score', () => {
    const baseline = score([], WS)
    const LAST = '2028-12-31'
    let checkedAgainstStep = 0
    let decayOnlyChanges = 0
    for (let seed = 421; seed <= 440; seed++) {
      const r = rng(seed)
      const events = genEvents(r, randInt(r, 0, 25), `d${seed}`)
      const scorer = createScorer('TST', events, m)
      const all = days(WS, LAST).map((d) => scorer.at(d))
      const transitions = new Set(scorer.transitionDays().map((d) => isoDate(d)))
      // Largest daily drift decay alone can cause between d − 1 and d: Σ 0.75/365 · |p · w| over
      // the repeatable events of categories A–D with 366 ≤ Δ ≤ 730 at d (docs/02 §3).
      const repeatables = events.filter(
        (e) => e.type === 'repeatable' && e.status === 'published' && !e.indicator.startsWith('E'),
      )
      const drift = (d: string): number => {
        let s = 0
        for (const e of repeatables) {
          const delta = dayNumber(d) - dayNumber(e.date)
          if (delta >= 366 && delta <= 730) {
            s += (0.75 / 365) * Math.abs(e.points * (CONF_WEIGHT[e.confidence] ?? 0))
          }
        }
        return s
      }
      // Days on which the one-decimal score changed by more than decay alone can explain.
      const stepChanged: string[] = []
      for (let i = 0; i < all.length; i++) {
        const prev = i === 0 ? baseline : (all[i - 1] as CountryScore)
        const cur = all[i] as CountryScore
        if (cur.score === prev.score) continue
        if (i === 0 || Math.abs(cur.exact - prev.exact) > drift(cur.date) + 1e-7) {
          stepChanged.push(cur.date)
        } else {
          decayOnlyChanges++
        }
      }
      for (const t of evalDates(r, 8)) {
        const lc = lastChange(scorer, t)
        const latestStep = stepChanged.filter((d) => d <= t).at(-1) ?? null
        if (lc === null) {
          expect(latestStep, `seed ${seed} at ${t}: a step changed the score`).toBeNull()
          continue
        }
        expect(lc.date <= t).toBe(true)
        expect(lc.date === WS || transitions.has(lc.date), `${lc.date} is a transition day`).toBe(
          true,
        )
        const i = dayNumber(lc.date) - dayNumber(WS)
        const cur = all[i] as CountryScore
        const prev = i === 0 ? baseline : (all[i - 1] as CountryScore)
        expect(cur.score, `seed ${seed}: score changed on ${lc.date}`).not.toBe(prev.score)
        if (lc.kind === 'event') {
          expect(lc.indicator?.startsWith('E'), `${lc.date}: ${lc.indicator} is unscored`).toBe(
            false,
          )
        }
        expect(lc.delta).toBeCloseTo(tenths(cur.score, prev.score), 9)
        if (latestStep !== null) {
          checkedAgainstStep++
          expect(
            lc.date >= latestStep,
            `seed ${seed} at ${t}: last change ${lc.date} but a step changed the score on ${latestStep}`,
          ).toBe(true)
        }
      }
    }
    expect(checkedAgainstStep).toBeGreaterThan(50)
    // Decay alone moved the one-decimal score on some days: those are not last changes.
    expect(decayOnlyChanges).toBeGreaterThan(0)
  })
})

describe('(d) lastChange ignores event steps that cannot move S', () => {
  // B1 +3 on the window start decays from Δ = 366 (2024-10-07). S = 3·d − 15 (B1 never qualifies).
  // Δ = 373 (2024-10-14): d = 1 − 0.75·8/365, 3d = 2.95068…, S = −12.0493… → −12.0.
  // Δ = 374 (2024-10-15): d = 1 − 0.75·9/365, 3d = 2.94452…, S = −12.0555… → −12.1.
  // The one-decimal score moves on 2024-10-15 by decay alone.
  const b1 = ev('B1', WS, 3, { id: 'evt_2023_10_07_TST_B1' })

  it('the arithmetic of the decay-only change', () => {
    expect(score([b1], '2024-10-14').score).toBe(-12)
    expect(score([b1], '2024-10-15').score).toBe(-12.1)
    const lc = lastChange(createScorer('TST', [b1], m), '2024-10-20')
    expect(lc?.date).toBe(WS)
    expect(lc?.delta).toBeCloseTo(3, 9)
  })

  it('an unscored E1 event starting on the day decay moves the score is not the last change', () => {
    const e1 = ev('E1', '2024-10-15', 5, { id: 'evt_2024_10_15_TST_E1' })
    // E is never summed (D-12): S is the same with and without E1 on every day.
    for (const d of ['2024-10-14', '2024-10-15', '2024-10-20']) {
      expect(score([b1, e1], d).exact).toBe(score([b1], d).exact)
    }
    const lc = lastChange(createScorer('TST', [b1, e1], m), '2024-10-20')
    expect(json(lc)).toEqual(json(lastChange(createScorer('TST', [b1], m), '2024-10-20')))
    expect(lc?.date).toBe(WS)
  })

  it('an event inside a clipped category starting on the day decay moves the score is not the last change', () => {
    // B: 15 + 10 + 5 + 10 + 8 = 48, clipped to 45; D4 +5 decays from 2024-10-07.
    // All dated on the window start: they leave the passivity window on 2024-10-06 (Δ = 365),
    // S 50 → 35. Δ = 369 (2024-10-10): 30 + 5·(1 − 0.75·4/365) = 34.9589… → 35.0;
    // Δ = 370 (2024-10-11): 30 + 5·(1 − 0.75·5/365) = 34.9486… → 34.9, by decay alone.
    const base = [
      ev('B3', WS, 15, { id: 'evt_2023_10_07_TST_B3' }),
      ev('B11', WS, 10, { id: 'evt_2023_10_07_TST_B11_a' }),
      ev('B11', WS, 5, { id: 'evt_2023_10_07_TST_B11_b' }),
      ev('B12', WS, 10, { id: 'evt_2023_10_07_TST_B12' }),
      ev('B8', WS, 8, { id: 'evt_2023_10_07_TST_B8' }),
      ev('D4', WS, 5, { id: 'evt_2023_10_07_TST_D4' }),
    ]
    // A B1 vote on 2024-10-11: B raw 51, still clipped to 45; B1 never qualifies.
    const vote = ev('B1', '2024-10-11', 3, { id: 'evt_2024_10_11_TST_B1' })
    const all = [...base, vote]
    expect(score(all, '2024-10-05').score).toBe(50)
    expect(score(all, '2024-10-06').score).toBe(35)
    expect(score(all, '2024-10-10').score).toBe(35)
    expect(score(all, '2024-10-11').score).toBe(34.9)
    for (const d of ['2024-10-10', '2024-10-11', '2024-10-12']) {
      expect(score(all, d).exact).toBe(score(base, d).exact)
    }
    const lc = lastChange(createScorer('TST', all, m), '2024-10-12')
    expect(lc?.date).toBe('2024-10-06')
    expect(lc?.kind).toBe('passivity')
    expect(lc?.delta).toBeCloseTo(-15, 9)
  })
})

describe('(h) translating every event and the date by k days leaves S unchanged', () => {
  it('holds for random inputs and shifts', () => {
    for (let seed = 901; seed <= 940; seed++) {
      const r = rng(seed)
      const events = genEvents(r, randInt(r, 1, 30), `h${seed}`)
      const k = randInt(r, 1, 800)
      const shifted = events.map((e) => ({
        ...e,
        date: addDays(e.date, k),
        end: e.end === null || e.end === undefined ? e.end : addDays(e.end, k),
      }))
      for (const d of evalDates(r, 6)) {
        expect(scoreCore(score(shifted, addDays(d, k))), `seed ${seed} +${k} at ${d}`).toEqual(
          scoreCore(score(events, d)),
        )
      }
    }
  })
})

describe('(i) a duplicate of a most-severe or latest-position event changes nothing', () => {
  it('holds for random inputs', () => {
    const rules = ['B5', 'B6', 'B8', 'B12', 'C1', 'C4', 'D3']
    for (let seed = 951; seed <= 990; seed++) {
      const r = rng(seed)
      const events = genEvents(r, randInt(r, 1, 25), `i${seed}`, {
        span: 300,
        indicators: [...rules, 'B1', 'B10', 'A6', 'A7', 'D2'],
      })
      const target = events.filter((e) => rules.includes(e.indicator))
      if (target.length === 0) continue
      const orig = pick(r, target)
      const copy = { ...orig, id: `${orig.id}_dup` }
      for (const d of evalDates(r, 6)) {
        const a = score(events, d)
        const b = score([...events, copy], d)
        const core = (s: CountryScore) =>
          json({
            exact: s.exact,
            display: s.display,
            passivity: s.passivity.applied,
            categories: s.categories,
            indicators: s.indicators.map((i) => [i.id, i.value]),
          })
        expect(core(b), `seed ${seed} dup ${orig.id} at ${d}`).toEqual(core(a))
      }
    }
  })
})

// ---------------------------------------------------------------------------------------------
// (e) Caps

describe('(e) S, every category and every indicator stay within caps', () => {
  it('holds for random and dense inputs, under every option, and the caps are reached', () => {
    const optionSets: (ScoreOptions | undefined)[] = [
      undefined,
      { weights: { A: 2, B: 2, C: 2, D: 2 } },
      { weights: { A: 0, B: 0, C: 0, D: 0 } },
      { weights: { A: 0.5, B: 1.5, C: 2, D: 0 } },
      { confidenceWeights: { reported: 0.6 }, decay: 'off', passivityPoints: 25 },
    ]
    const hits = { catMax: 0, catMin: 0, indMax: 0, indMin: 0, sMax: 0, sMin: 0 }
    for (let seed = 501; seed <= 560; seed++) {
      const r = rng(seed)
      const sign: Sign = seed % 3 === 0 ? 'pos' : seed % 3 === 1 ? 'neg' : 'any'
      const events = genEvents(r, randInt(r, 0, 90), `e${seed}`, { sign, span: 500 })
      const dates = evalDates(r, 4)
      const plain = createScorer('TST', events, m)
      for (const opts of optionSets) {
        const scorer = createScorer('TST', events, m, opts)
        const w = { A: 1, B: 1, C: 1, D: 1, ...(opts?.weights ?? {}) }
        const pen = opts?.passivityPoints ?? 15
        for (const d of dates) {
          const s = scorer.at(d)
          // Indicators.
          for (const ind of s.indicators) {
            const [lo, hi] = INDICATOR_CAPS[ind.id] ?? [null, null]
            expect(ind.value).toBeCloseTo(clipTo(ind.raw, lo, hi), 9)
            if (lo !== null) expect(ind.value).toBeGreaterThanOrEqual(lo - TOL)
            if (hi !== null) expect(ind.value).toBeLessThanOrEqual(hi + TOL)
            if (hi !== null && ind.raw > hi + TOL) hits.indMax++
            if (lo !== null && ind.raw < lo - TOL) hits.indMin++
          }
          // Categories.
          for (const k of CATEGORY_IDS) {
            const c = s.categories[k]
            const [lo, hi] = CATEGORY_CAPS[k] as readonly [number, number]
            const indSum = s.indicators
              .filter((i) => i.category === k)
              .reduce((acc, i) => acc + i.value, 0)
            expect(c.raw, `${k} raw at ${d}`).toBeCloseTo(indSum, 8)
            expect(c.clipped).toBeCloseTo(clipTo(c.raw, lo, hi), 9)
            expect(c.clipped).toBeGreaterThanOrEqual(lo - TOL)
            expect(c.clipped).toBeLessThanOrEqual(hi + TOL)
            if (c.raw > hi + TOL) hits.catMax++
            if (c.raw < lo - TOL) hits.catMin++
          }
          expect(s.categories.E.scored).toBe(false)
          // Passivity and S.
          expect(s.passivity.value).toBe(s.passivity.applied ? pen : 0)
          const raw =
            SCORED_CATEGORIES.reduce((acc, k) => acc + w[k] * s.categories[k].clipped, 0) -
            s.passivity.value
          expect(s.raw).toBeCloseTo(raw, 8)
          expect(s.exact).toBeCloseTo(clipTo(raw, -100, 100), 8)
          expect(s.exact).toBeGreaterThanOrEqual(-100)
          expect(s.exact).toBeLessThanOrEqual(100)
          expect(s.display).toBe(roundHalfAway(s.exact))
          expect(s.score).toBe(roundHalfAway(s.exact, 1))
          expect(s.band).toBe(bandOf(s.display))
          if (raw > 100) hits.sMax++
          if (raw < -100) hits.sMin++
          // §9: the user score from the published subtotals equals rescoring with the weights.
          if (opts?.weights !== undefined && opts.passivityPoints === undefined) {
            const p = plain.at(d)
            const u = userScore({ categories: p.categories, passivity: p.passivity }, w, m)
            expect(u.exact).toBeCloseTo(s.exact, 8)
            expect(u.display).toBe(s.display)
            expect(u.band).toBe(s.band)
          }
        }
      }
    }
    for (const [k, v] of Object.entries(hits)) expect(v, `cap reached: ${k}`).toBeGreaterThan(0)
  })
})

// ---------------------------------------------------------------------------------------------
// (f) Retracting equals deleting

describe('(f) retracting an event gives the same score as deleting it', () => {
  const variants: { name: string; change: (e: ScoringEvent) => ScoringEvent }[] = [
    { name: 'retracted', change: (e) => ({ ...e, status: 'retracted' }) },
    { name: 'draft', change: (e) => ({ ...e, status: 'draft' }) },
    { name: 'reviewed', change: (e) => ({ ...e, status: 'reviewed' }) },
    { name: 'corrected', change: (e) => ({ ...e, status: 'corrected' }) },
    { name: 'superseded', change: (e) => ({ ...e, status: 'superseded' }) },
    { name: 'scope west-bank', change: (e) => ({ ...e, scope: ['west-bank'] }) },
    { name: 'scope related+region', change: (e) => ({ ...e, scope: ['related', 'region'] }) },
  ]

  it('on every date, in the series, in the last change, in coverage and in counts', () => {
    for (let seed = 601; seed <= 640; seed++) {
      const r = rng(seed)
      const events = genEvents(r, randInt(r, 1, 35), `f${seed}`)
      const gone = new Set(events.filter(() => r() < 0.35).map((e) => e.id))
      const v = variants[seed % variants.length] as (typeof variants)[number]
      const retracted = events.map((e) => (gone.has(e.id) ? v.change(e) : e))
      const deleted = events.filter((e) => !gone.has(e.id))
      const sr = createScorer('TST', retracted, m)
      const sd = createScorer('TST', deleted, m)
      for (const d of evalDates(r, 6)) {
        const a = sr.at(d)
        const b = sd.at(d)
        expect(scoreCore(a), `${v.name}, seed ${seed} at ${d}`).toEqual(scoreCore(b))
        expect(json(a.passivity)).toEqual(json(b.passivity))
        // The events that remain are evaluated the same way.
        const kept = a.events.filter((e) => !gone.has(e.id))
        expect(json(kept)).toEqual(json(b.events))
        // The changed events are shown and count 0.
        for (const e of a.events.filter((x) => gone.has(x.id))) {
          expect(e.value).toBe(0)
          expect(e.counted).toBe(0)
          expect(e.qualifies).toBe(false)
        }
        expect(json(lastChange(sr, d)), `${v.name}, seed ${seed} last change at ${d}`).toEqual(
          json(lastChange(sd, d)),
        )
        expect(
          json(coverage({ country: country(), assessment: null, events: retracted, date: d }, m)),
        ).toEqual(
          json(coverage({ country: country(), assessment: null, events: deleted, date: d }, m)),
        )
        expect(eventCounts(retracted, d)).toEqual(eventCounts(deleted, d))
      }
      const strip = (pts: readonly SeriesPoint[]) =>
        json(pts.map(({ transitions: _t, ...rest }) => rest))
      expect(strip(dailySeries(sr, WS, '2028-12-31'))).toEqual(
        strip(dailySeries(sd, WS, '2028-12-31')),
      )
    }
  })

  it('retracting the A7 that superseded A6 brings A6 back', () => {
    const a6 = ev('A6', '2024-01-10', 10, { id: 'evt_2024_01_10_TST_A6' })
    const a7 = ev('A7', '2024-03-01', 25, { id: 'evt_2024_03_01_TST_A7' })
    const t = '2024-07-01'
    expect(score([a6, a7], t).categories.A.clipped).toBeCloseTo(25, 9)
    const retracted = score([a6, { ...a7, status: 'retracted' }], t)
    expect(retracted.categories.A.clipped).toBeCloseTo(10, 9)
    expect(scoreCore(retracted)).toEqual(scoreCore(score([a6], t)))
  })

  it('retracting the latest B6 brings the earlier B5 back', () => {
    const b5 = ev('B5', '2024-01-10', 8, { id: 'evt_2024_01_10_TST_B5' })
    const b6 = ev('B6', '2024-03-01', -10, { id: 'evt_2024_03_01_TST_B6' })
    const t = '2024-07-01'
    expect(score([b5, b6], t).categories.B.clipped).toBeCloseTo(-10, 9)
    const retracted = score([b5, { ...b6, status: 'retracted' }], t)
    expect(retracted.categories.B.clipped).toBeCloseTo(8, 9)
    expect(scoreCore(retracted)).toEqual(scoreCore(score([b5], t)))
  })
})

// ---------------------------------------------------------------------------------------------
// (g) Past all events plus 731 days

describe('(g) past all events plus 731 days, only standing/computed states and passivity remain', () => {
  it('equals the score of the standing and computed states in force, with passivity applied', () => {
    for (let seed = 701; seed <= 760; seed++) {
      const r = rng(seed)
      const events = genEvents(r, randInt(r, 1, 40), `g${seed}`)
      const lastDate = events
        .map((e) => e.date)
        .sort()
        .at(-1) as string
      const T = addDays(lastDate, 731)
      const lastEnd = events
        .map((e) => e.end ?? null)
        .filter((x): x is string => x !== null)
        .sort()
        .at(-1)
      const far = addDays(lastEnd !== undefined && lastEnd > T ? lastEnd : T, 1000)
      for (const d of [T, addDays(T, 1), addDays(T, randInt(r, 2, 800)), far]) {
        const full = score(events, d)
        const inForce = events.filter(
          (e) =>
            e.type !== 'repeatable' &&
            e.date <= d &&
            (e.end === null || e.end === undefined || e.end > d),
        )
        const reduced = score(inForce, d)
        expect(scoreCore(full), `seed ${seed} at ${d}`).toEqual(scoreCore(reduced))
        // No event is dated in (d − 365, d]: the penalty applies.
        expect(full.passivity.applied).toBe(true)
        expect(full.passivity.value).toBe(15)
        expect(full.passivity.qualifying).toEqual([])
        // Every repeatable event has left the score.
        for (const e of full.events.filter((x) => x.type === 'repeatable')) {
          expect(e.value, e.id).toBe(0)
          expect(e.factor, e.id).toBe(0)
          expect(e.reason, e.id).toBe('expired')
        }
        // S = clip(Σ_k clip_k(in-force states) − 15).
        const sum = SCORED_CATEGORIES.reduce((acc, k) => acc + reduced.categories[k].clipped, 0)
        expect(full.exact).toBeCloseTo(clipTo(sum - 15, -100, 100), 9)
      }
      // After the last end and the last expiry nothing moves any more.
      expect(scoreCore(score(events, far))).toEqual(scoreCore(score(events, addDays(far, 5000))))
      // One day earlier the latest repeatable event (if any) still counts at d = 0.25.
      const latestRep = events
        .filter((e) => e.type === 'repeatable' && e.date === lastDate)
        .map((e) => e.id)
      const before = score(events, addDays(T, -1))
      for (const id of latestRep) {
        const e = before.events.find((x) => x.id === id)
        expect(e?.factor, id).toBeCloseTo(0.25, 12)
      }
    }
  })
})
