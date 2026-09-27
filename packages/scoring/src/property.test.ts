/**
 * Property test: whatever the events, no score leaves [−100, 100], every category stays within
 * its cap, every indicator within its own cap, and the band agrees with the display score.
 * Random inputs come from a seeded generator, so a failure is reproducible from its seed.
 */
import { describe, expect, it } from 'vitest'
import { bandFor, type CompiledIndicator } from './methodology.js'
import { createScorer } from './score.js'
import { ev, methodology } from './test-helpers.js'
import { addDays } from './time.js'
import { CATEGORY_IDS, CONFIDENCE_LEVELS, type ScoringEvent } from './types.js'
import { userScore } from './weights.js'

const m = methodology()

/** mulberry32: a small, well-mixed 32-bit generator. */
function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** The named per-event values of a tiered indicator (B1, B8, B9, B11, B12, C1, C4, D3). */
function allowedPoints(ind: CompiledIndicator): number[] {
  return ind.tiers.map((t) => t.value)
}

const FIXED: Record<string, number[]> = {
  A1: [-40, -21.9, -4, -0.4, 0],
  A2: [-25, -15, -8, -3, 0],
  A3: [-15],
  A4: [-15, -10, -5, -2, 0],
  A5: [-5],
  A6: [10],
  A7: [25],
  A8: [5],
  B2: [-20],
  B3: [15],
  B4: [-15],
  B5: [8],
  B6: [-10],
  B7: [-20],
  B10: [-5],
  C2: [-10],
  C3: [-8, -5, -3, -2, 0],
  C5: [5],
  C6: [3],
  D1: [12, 9, 6, 3, 1, 0],
  D2: [-10],
  D4: [5],
  D5: [5],
  E1: [5],
  E2: [-5],
  E3: [5],
}

function pointsFor(ind: CompiledIndicator, r: () => number): number {
  const options = ind.tiers.length > 0 ? allowedPoints(ind) : (FIXED[ind.id] ?? [])
  if (options.length === 0) throw new Error(`no points for ${ind.id}`)
  return options[Math.floor(r() * options.length)] as number
}

const pick = <T>(list: readonly T[], r: () => number): T => list[Math.floor(r() * list.length)] as T

function randomEvents(seed: number, extreme: boolean): ScoringEvent[] {
  const r = rng(seed)
  const n = extreme ? 60 : Math.floor(r() * 40)
  const events: ScoringEvent[] = []
  for (let i = 0; i < n; i++) {
    const ind = pick(m.indicators, r)
    const date = addDays('2023-10-07', Math.floor(r() * 1200))
    const standingLike = ind.type !== 'repeatable'
    const end = standingLike && r() < 0.4 ? addDays(date, Math.floor(r() * 500)) : null
    let points = pointsFor(ind, r)
    if (extreme) {
      // Push towards the caps: the most extreme allowed value of the indicator.
      const options = ind.tiers.length > 0 ? allowedPoints(ind) : (FIXED[ind.id] ?? [points])
      points = r() < 0.5 ? Math.min(...options) : Math.max(...options)
    }
    events.push(
      ev(ind.id, date, points, {
        id: `evt_p${seed}_${i}`,
        end,
        confidence: extreme ? 'confirmed' : pick(CONFIDENCE_LEVELS, r),
        status: r() < 0.9 ? 'published' : pick(['draft', 'retracted', 'superseded'], r),
        scope: r() < 0.9 ? ['gaza'] : ['lebanon'],
      }),
    )
  }
  return chainComputed(events)
}

/**
 * Computed values are releases: one holds at a time, each ending where the next starts (docs/02
 * §3; the engine rejects overlaps). Per indicator, eligible values are sorted by date, values on
 * an already-used date are dropped, and each one ends at the next one's date.
 */
function chainComputed(events: ScoringEvent[]): ScoringEvent[] {
  const out = events.filter((e) => e.type !== 'computed')
  const byIndicator = new Map<string, ScoringEvent[]>()
  for (const e of events) {
    if (e.type !== 'computed') continue
    const eligible = e.status === 'published' && e.scope.includes('gaza')
    if (!eligible) {
      out.push(e)
      continue
    }
    const list = byIndicator.get(e.indicator) ?? []
    list.push(e)
    byIndicator.set(e.indicator, list)
  }
  for (const list of byIndicator.values()) {
    const sorted = list
      .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
      .filter((e, i, all) => i === 0 || e.date !== all[i - 1]?.date)
    sorted.forEach((e, i) => {
      const next = sorted[i + 1]
      out.push(next === undefined ? e : { ...e, end: next.date })
    })
  }
  return out
}

function checkAll(seed: number, extreme: boolean) {
  const r = rng(seed ^ 0x9e3779b9)
  const events = randomEvents(seed, extreme)
  const scorer = createScorer('TST', events, m)
  for (let k = 0; k < 6; k++) {
    const date = addDays('2023-10-07', Math.floor(r() * 1400))
    const s = scorer.at(date)
    expect(s.exact).toBeGreaterThanOrEqual(-100)
    expect(s.exact).toBeLessThanOrEqual(100)
    expect(Number.isInteger(s.display)).toBe(true)
    expect(Math.abs(s.display)).toBeLessThanOrEqual(100)
    expect(Math.abs(s.score)).toBeLessThanOrEqual(100)
    expect(s.band).toBe(bandFor(m, s.display).id)
    expect([0, 15]).toContain(s.passivity.value)
    for (const id of CATEGORY_IDS) {
      const c = s.categories[id]
      expect(c.clipped).toBeGreaterThanOrEqual(c.cap.min)
      expect(c.clipped).toBeLessThanOrEqual(c.cap.max)
    }
    for (const i of s.indicators) {
      if (i.cap?.min != null) expect(i.value).toBeGreaterThanOrEqual(i.cap.min)
      if (i.cap?.max != null) expect(i.value).toBeLessThanOrEqual(i.cap.max)
    }
    const w = { A: r() * 2, B: r() * 2, C: r() * 2, D: r() * 2 }
    const u = userScore(s, w, m)
    expect(u.exact).toBeGreaterThanOrEqual(-100)
    expect(u.exact).toBeLessThanOrEqual(100)
    expect(u.band).toBe(bandFor(m, u.display).id)
  }
}

describe('property: no score leaves [−100, 100]', () => {
  it('holds for 400 random countries', () => {
    for (let seed = 1; seed <= 400; seed++) checkAll(seed, false)
  })

  it('holds for 200 countries pushed to the caps', () => {
    for (let seed = 1001; seed <= 1200; seed++) checkAll(seed, true)
  })

  it('reaches both ends of the scale on extreme inputs', () => {
    const seen = { top: false, bottom: false }
    for (let seed = 1001; seed <= 1200; seed++) {
      const scorer = createScorer('TST', randomEvents(seed, true), m)
      for (const d of ['2024-06-01', '2025-06-01', '2026-06-01']) {
        const s = scorer.at(d)
        if (s.exact === 100) seen.top = true
        if (s.exact === -100) seen.bottom = true
      }
    }
    expect(seen).toEqual({ top: true, bottom: true })
  })
})
