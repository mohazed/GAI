/**
 * What the components need from a methodology version, read from the API's
 * `methodology/{version}.json` (docs/02). Nothing here restates a rule: bands, caps, clip and
 * indicator order come from the files, and S with reader weights is @gai/scoring's `userScore`.
 */
import type { ApiMethodologyFile } from '@gai/schema/api'
import type { CombineModel } from '@gai/scoring'

export interface LangText {
  en: string
  fr: string
}

export interface BandSpec {
  id: string
  name: LangText
  /** Inclusive integer bounds on the rounded score. */
  min: number
  max: number
}

export type CategoryKey = 'A' | 'B' | 'C' | 'D' | 'E'

export interface CategorySpec {
  id: CategoryKey
  name: LangText
  short: LangText
  cap: { min: number; max: number }
  scored: boolean
  experimental: boolean
}

export interface IndicatorSpec {
  id: string
  category: CategoryKey
  name: LangText
  scored: boolean
}

/** The methodology as the site's components read it; serialisable, safe to pass to the client. */
export interface SiteMethodology {
  version: string
  windowStart: string
  scoreClip: { min: number; max: number }
  bands: BandSpec[]
  categories: CategorySpec[]
  indicators: IndicatorSpec[]
  confidence: { id: string; label: LangText; weight: number }[]
  passivityPoints: number
}

export function siteMethodology(file: ApiMethodologyFile): SiteMethodology {
  return {
    version: file.version,
    windowStart: file.window_start,
    scoreClip: file.categories.score_clip,
    bands: [...file.bands.bands]
      .sort((a, b) => a.min - b.min)
      .map((b) => ({ id: b.id, name: b.name, min: b.min, max: b.max })),
    categories: file.categories.categories.map((c) => ({
      id: c.id,
      name: c.name,
      short: c.short,
      cap: c.cap,
      scored: c.scored,
      experimental: c.experimental,
    })),
    indicators: file.indicators.indicators.map((i) => ({
      id: i.id,
      category: i.category,
      name: i.name,
      scored: i.scored,
    })),
    confidence: file.confidence.levels.map((l) => ({ id: l.id, label: l.label, weight: l.weight })),
    passivityPoints: file.passivity.points,
  }
}

/** The part of the methodology `userScore` reads (docs/02 §9). */
export function combineModel(m: SiteMethodology): CombineModel {
  return {
    categories: m.categories.map((c) => ({
      id: c.id,
      name: c.name,
      short: c.short,
      cap: c.cap,
      scored: c.scored,
    })),
    scoreClip: m.scoreClip,
    bands: m.bands,
  }
}

/**
 * Boundaries between adjacent bands on the continuous −100…+100 axis. Bands are read from the
 * rounded integer score, so the boundary between −50 (Enabling) and −51 (Sustaining) sits at −50.5.
 */
export function bandSegments(bands: readonly BandSpec[], clip: { min: number; max: number }) {
  return bands.map((b, i) => ({
    band: b,
    from: i === 0 ? clip.min : (bands[i - 1] as BandSpec).max + 0.5,
    to: i === bands.length - 1 ? clip.max : b.max + 0.5,
  }))
}

export function bandById(m: SiteMethodology, id: string): BandSpec {
  const b = m.bands.find((x) => x.id === id)
  if (b === undefined) throw new Error(`no band ${id} in methodology ${m.version}`)
  return b
}

export function categoryById(m: SiteMethodology, id: string): CategorySpec {
  const c = m.categories.find((x) => x.id === id)
  if (c === undefined) throw new Error(`no category ${id} in methodology ${m.version}`)
  return c
}

export function indicatorById(m: SiteMethodology, id: string): IndicatorSpec {
  const i = m.indicators.find((x) => x.id === id)
  if (i === undefined) throw new Error(`no indicator ${id} in methodology ${m.version}`)
  return i
}
