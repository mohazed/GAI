/**
 * Test helpers (not exported by the package): the repository's methodology compiled once, and
 * builders for synthetic events and countries. Tests only; the engine never imports this file.
 */
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadMethodology } from '@gai/schema'
import {
  compileMethodology,
  type MethodologyFilesInput,
  type ScoringMethodology,
} from './methodology.js'
import type { ScoringCountry, ScoringEvent } from './types.js'

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')

let cache: { files: MethodologyFilesInput; m: ScoringMethodology } | null = null

/** The methodology files of the repository (methodology/v1.0.0), as parsed by @gai/schema. */
export function repoFiles(): MethodologyFilesInput {
  if (cache === null) {
    const lm = loadMethodology(REPO_ROOT)
    if (lm.issues.length > 0) throw new Error(`methodology issues: ${JSON.stringify(lm.issues)}`)
    const files = {
      indicators: must(lm.indicatorsFile).value,
      categories: must(lm.categories).value,
      bands: must(lm.bands).value,
      confidence: must(lm.confidence).value,
      decay: must(lm.decay).value,
      passivity: must(lm.passivity).value,
      thresholds: must(lm.thresholds).value,
    }
    cache = { files, m: compileMethodology(files) }
  }
  return structuredClone(cache.files)
}

/** The standing indicators that stack by "most severe" from 1.0.0-rc.2 and summed in rc.1. */
export const RC2_MOST_SEVERE: readonly string[] = ['A3', 'A6', 'A7', 'B3', 'B7', 'D2']

/**
 * The rules of methodology 1.0.0-rc.1, rebuilt from the repository files by reverting the rule
 * changes of 1.0.0-rc.2 that the engine reads (docs/calibration/README.md §7): passivity counts
 * the absolute contribution and every B8 tier, B1 has no indicator cap, and A3, A6, A7, B3, B7 and
 * D2 add up. The worked examples of docs/02 as written are tested against it; the rc.2 rules have
 * their own tests (rc2.test.ts). The other changes of rc.2 (confidence kinds, the generators'
 * parameters) are not read by the engine.
 */
export function rc1Files(): MethodologyFilesInput {
  const f = repoFiles()
  return {
    ...f,
    indicators: {
      ...f.indicators,
      indicators: f.indicators.indicators.map((i) =>
        i.id === 'B1'
          ? { ...i, indicator_cap: null }
          : RC2_MOST_SEVERE.includes(i.id)
            ? { ...i, stacking: { rule: 'sum' as const } }
            : i,
      ),
    },
    passivity: {
      ...f.passivity,
      contribution_sign: 'any',
      excluded: (f.passivity.excluded ?? []).filter((e) => e.tiers === undefined),
    },
  }
}

let rc1: ScoringMethodology | null = null

/** The rules of 1.0.0-rc.1 (see rc1Files), compiled. */
export function methodologyRc1(): ScoringMethodology {
  if (rc1 === null) rc1 = compileMethodology(rc1Files())
  return rc1
}

/** The repository's methodology, compiled. */
export function methodology(): ScoringMethodology {
  if (cache === null) repoFiles()
  return (cache as { m: ScoringMethodology }).m
}

function must<T>(v: T | null): T {
  if (v === null) throw new Error('methodology file failed to load')
  return v
}

let counter = 0

/**
 * A published, confirmed, gaza-scoped event of country TST with the indicator's type; points,
 * dates and the rest can be overridden.
 */
export function ev(
  indicator: string,
  date: string,
  points: number,
  over: Partial<Omit<ScoringEvent, 'indicator' | 'date' | 'points'>> = {},
): ScoringEvent {
  const ind = methodology().indicatorById.get(indicator)
  if (ind === undefined) throw new Error(`unknown indicator ${indicator}`)
  counter++
  return {
    id:
      over.id ??
      `evt_${date.replaceAll('-', '_')}_${over.country ?? 'TST'}_${indicator}_${counter}`,
    country: 'TST',
    type: ind.type,
    confidence: 'confirmed',
    scope: ['gaza'],
    status: 'published',
    end: null,
    ...over,
    indicator,
    date,
    points,
  }
}

/** A country TST with the given Security Council terms. */
export function country(
  unsc: ScoringCountry['memberships']['unsc'] = [],
  iso3 = 'TST',
): ScoringCountry {
  return {
    iso3,
    name: { en: 'Testland', fr: 'Testlande' },
    excluded: false,
    memberships: { unsc },
  }
}
