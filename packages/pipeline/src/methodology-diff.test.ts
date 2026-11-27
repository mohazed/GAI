import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { type Event, loadMethodology, MethodologyDiffFile } from '@gai/schema'
import { createScorer } from '@gai/scoring'
import { describe, expect, it } from 'vitest'
import { compile, methodologyFiles, rc1Files } from './calibrate.js'
import { causeOf, type DiffInput, diffRows, diffSummary } from './methodology-diff.js'

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')
const rc2 = compile(methodologyFiles(loadMethodology(REPO_ROOT)))
const rc1 = compile(rc1Files(methodologyFiles(loadMethodology(REPO_ROOT))))

let n = 0
function ev(
  country: string,
  indicator: string,
  type: 'standing' | 'repeatable' | 'computed',
  date: string,
  points: number,
  extra: Record<string, unknown> = {},
): Event {
  n++
  return {
    id: `evt_${date.replaceAll('-', '_')}_${country}_${indicator}_${n}`,
    country,
    indicator,
    type,
    date,
    end: null,
    points,
    confidence: 'confirmed',
    scope: ['gaza'],
    status: 'published',
    evidence: [],
    ...extra,
  } as unknown as Event
}

const DATE = '2025-09-30'
const input = (iso3: string, events: Event[], before = rc1, after = rc2): DiffInput => ({
  iso3,
  name: { en: `Country ${iso3}`, fr: `Pays ${iso3}` },
  before: createScorer(iso3, events, before).at(DATE),
  after: createScorer(iso3, events, after).at(DATE),
})
const votes = (iso3: string, k: number) =>
  Array.from({ length: k }, (_, i) =>
    ev(iso3, 'B1', 'repeatable', `2025-0${i + 1}-10`, 3, {
      id: `evt_2025_0${i + 1}_10_${iso3}_B1`,
    }),
  )

describe('methodology:diff causes (rc.1 → rc.2)', () => {
  it('names the indicator cap of B1', () => {
    const x = input('XAA', votes('XAA', 8))
    expect(x.before.display).toBe(9)
    expect(x.after.display).toBe(0)
    expect(causeOf(x.before, x.after, 'en')).toBe('B1 +24.0 → +15.0 (indicator cap)')
    expect(causeOf(x.before, x.after, 'fr')).toBe("B1 +24,0 → +15,0 (plafond de l'indicateur)")
  })

  it('names the passivity decision and the act that no longer lifts it', () => {
    const x = input('XBB', [ev('XBB', 'C2', 'standing', '2025-03-01', -10)])
    expect(causeOf(x.before, x.after, 'en')).toBe(
      'passivity penalty applied (−15): C2 −10.0 no longer lifts it',
    )
    expect(causeOf(x.before, x.after, 'fr')).toBe(
      'pénalité de passivité appliquée (−15) : C2 −10,0 ne la lève plus',
    )
  })

  it('names the most severe of overlapping records', () => {
    const x = input('XCC', [
      ev('XCC', 'B7', 'standing', '2025-02-13', -20),
      ev('XCC', 'B7', 'standing', '2025-06-05', -20),
      ev('XCC', 'B9', 'repeatable', '2025-06-01', 5),
    ])
    expect(causeOf(x.before, x.after, 'en')).toBe(
      'B7 −40.0 → −20.0 (most severe of overlapping records)',
    )
  })

  it('names a confidence change, with the same methodology on both sides', () => {
    const reported = ev('XDD', 'C2', 'standing', '2025-01-11', -10, { confidence: 'reported' })
    const x: DiffInput = {
      iso3: 'XDD',
      name: { en: 'Country XDD', fr: 'Pays XDD' },
      before: createScorer('XDD', [reported], rc2).at(DATE),
      after: createScorer('XDD', [{ ...reported, confidence: 'confirmed' }], rc2).at(DATE),
    }
    expect(causeOf(x.before, x.after, 'en')).toBe('C2 −4.0 → −10.0 (confidence)')
  })

  it('lists the countries moved by 1 or more, by ISO3, as diff.json takes them', () => {
    const inputs = [
      input('XEE', votes('XEE', 8)),
      input('XAA', [ev('XAA', 'C2', 'standing', '2025-03-01', -10)]),
      input('XFF', [ev('XFF', 'D4', 'repeatable', '2025-05-01', 5)]),
    ]
    const rows = diffRows(inputs)
    expect(rows.map((r) => [r.iso3, r.old, r.new])).toEqual([
      ['XAA', -10, -25],
      ['XEE', 9, 0],
    ])
    expect(() =>
      MethodologyDiffFile.parse({
        from: '1.0.0-rc.1',
        to: '1.0.0-rc.2',
        date: DATE,
        countries: rows,
      }),
    ).not.toThrow()
    expect(diffSummary(inputs)).toEqual({
      changed: 2,
      bands: { 'acting → passive': 1, 'passive → enabling': 1 },
      passivity: 1,
    })
  })
})
