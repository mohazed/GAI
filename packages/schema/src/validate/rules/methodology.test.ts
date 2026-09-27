/**
 * Tests for the methodology rules (validate/rules/methodology.ts).
 *
 * One block per rule id: the valid fixtures raise nothing, and each mutation raises the rule on the
 * expected file and id. The last block, "v1.0.0 matches docs/02", pins the values encoded in
 * methodology/v1.0.0 to docs/02-methodology-spec.md and spec §2–§4 table by table; the expected
 * tables below were written from those documents, not copied from the YAML.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { formatIssue, type Issue, type RuleId } from '../../issues.js'
import type { Dataset } from '../../load/dataset.js'
import {
  listMethodologyVersions,
  loadMethodology,
  type Methodology,
} from '../../load/methodology.js'
import type {
  Cadence,
  Formula,
  Indicator,
  PointsSpec,
  PointsTier,
  QualifyingVote,
} from '../../methodology/schemas.js'
import type { EventType, Sign } from '../../primitives.js'
import {
  fixtureContext,
  fixtureDataset,
  issuesOf,
  REPO_ROOT,
  repoMethodology,
  runRules,
} from '../../testing/harness.js'
import { buildContext } from '../context.js'
import { rules } from './methodology.js'

// ---------------------------------------------------------------------------------------------
// Helpers

type Mutate = (ds: Dataset, m: Methodology) => void

const FOLDER = repoMethodology().folder
const pathOf = (name: string) => `${FOLDER}/${name}`

/** The methodology rules over the fixtures and the repository methodology, after `mutate`. */
function check(mutate?: Mutate): Issue[] {
  return runRules(rules, fixtureContext(mutate))
}

const CLEAN = check()

/** Asserts at least one issue of `rule` on `file` and `id` whose message matches `text`. */
function expectIssue(issues: Issue[], rule: RuleId, file: string, id: string, text?: RegExp) {
  const hits = issuesOf(issues, rule).filter(
    (i) => i.file === pathOf(file) && i.id === id && (text === undefined || text.test(i.message)),
  )
  const got = issues.map(formatIssue).join('\n') || '(no issue)'
  expect(
    hits.length,
    `expected [${rule}] ${file} ${id} ${text ?? ''}; got:\n${got}`,
  ).toBeGreaterThan(0)
}

function need<T>(value: T | null | undefined, what: string): T {
  if (value === null || value === undefined) throw new Error(`${what} is missing`)
  return value
}

function ind(m: Methodology, id: string): Indicator {
  return need(
    m.indicators.find((i) => i.id === id),
    `indicator ${id}`,
  )
}

function formulaPoints(m: Methodology, id: string): Extract<PointsSpec, { kind: 'formula' }> {
  const p = ind(m, id).points
  if (p.kind !== 'formula') throw new Error(`${id} has no formula points`)
  return p
}

function pointTiers(m: Methodology, id: string): PointsTier[] {
  const p = ind(m, id).points
  if (p.kind === 'tiers') return p.tiers
  if (p.kind === 'per_instance' && p.tiers) return p.tiers
  throw new Error(`${id} has no tiers`)
}

type TierFormula = Exclude<Formula, { kind: 'sqrt_share' }>
type SqrtFormula = Extract<Formula, { kind: 'sqrt_share' }>

function formulaOf(m: Methodology, key: string): Formula {
  return need(need(m.thresholds, 'thresholds.yaml').value.formulas[key], `formula ${key}`)
}

function tierFormula(m: Methodology, key: string): TierFormula {
  const f = formulaOf(m, key)
  if (f.kind === 'sqrt_share') throw new Error(`formula ${key} has no tiers`)
  return f
}

function sqrtFormula(m: Methodology, key: string): SqrtFormula {
  const f = formulaOf(m, key)
  if (f.kind !== 'sqrt_share') throw new Error(`formula ${key} is not sqrt_share`)
  return f
}

function setAllVersions(m: Methodology, version: string) {
  const files = [
    m.indicatorsFile,
    m.categories,
    m.bands,
    m.confidence,
    m.decay,
    m.passivity,
    m.thresholds,
    m.votes,
    m.symmetry,
  ]
  for (const f of files) if (f) f.value.version = version
  m.version = version
}

/** A synthetic qualifying vote (test data only, never a real record) citing `source`. */
function testVote(source: string, overrides: Partial<QualifyingVote> = {}): QualifyingVote {
  return {
    symbol: 'A/RES/TEST/1',
    kind: 'resolution',
    date: '2024-01-01',
    title: { en: 'Test fixture vote', fr: 'Vote de test' },
    subject: 'gaza',
    counts: { yes: 0, no: 0, abstain: 0 },
    source,
    rationale: { en: 'Test fixture.', fr: 'Donnée de test.' },
    ...overrides,
  }
}

function fixtureSourceId(ds: Dataset): string {
  return need(ds.sources[0], 'fixture source').value.id
}

// ---------------------------------------------------------------------------------------------
// Suite-level

describe('methodology rules on valid inputs', () => {
  it('the fixtures and the repository methodology raise no methodology issue', () => {
    expect(CLEAN.map(formatIssue)).toEqual([])
  })

  it('every methodology version folder in the repository passes every methodology rule', () => {
    const folders = listMethodologyVersions(REPO_ROOT)
    expect(folders.length).toBeGreaterThan(0)
    for (const folder of folders) {
      const ctx = buildContext(fixtureDataset(), loadMethodology(REPO_ROOT, folder))
      expect(runRules(rules, ctx).map(formatIssue), folder).toEqual([])
    }
  })

  it('never throws and reports nothing when every methodology file failed to load', () => {
    const issues = check((_ds, m) => {
      m.indicatorsFile = null
      m.indicators = []
      m.categories = null
      m.bands = null
      m.confidence = null
      m.decay = null
      m.passivity = null
      m.thresholds = null
      m.votes = null
      m.symmetry = null
      m.bannedWords = null
    })
    expect(issues).toEqual([])
  })

  it('does not cascade from a failed indicators.yaml into other files', () => {
    const issues = check((_ds, m) => {
      m.indicatorsFile = null
      m.indicators = []
    })
    expect(issues.map(formatIssue)).toEqual([])
  })

  it('raises only methodology rule ids', () => {
    const issues = check((_ds, m) => {
      ind(m, 'A3').points = { kind: 'fixed', value: 15 }
    })
    expect(issues.length).toBeGreaterThan(0)
    for (const i of issues) expect(i.rule.startsWith('methodology.')).toBe(true)
  })
})

// ---------------------------------------------------------------------------------------------
// methodology.version

describe('methodology.version', () => {
  it('passes the repository methodology', () => {
    expect(issuesOf(CLEAN, 'methodology.version')).toEqual([])
  })

  it('accepts a release version and another pre-release of the folder version', () => {
    for (const suffix of ['', '-rc.2']) {
      const issues = check((_ds, m) => setAllVersions(m, `${m.folderVersion}${suffix}`))
      expect(issuesOf(issues, 'methodology.version')).toEqual([])
    }
  })

  it('reports a file whose version differs from indicators.yaml', () => {
    const issues = check((_ds, m) => {
      need(m.bands, 'bands.yaml').value.version = '9.9.9'
    })
    expectIssue(issues, 'methodology.version', 'bands.yaml', 'bands.yaml', /9\.9\.9/)
    expect(issuesOf(issues, 'methodology.version')).toHaveLength(1)
  })

  it('reports a version whose base is not the folder name', () => {
    const issues = check((_ds, m) => setAllVersions(m, '9.9.9-rc.1'))
    expectIssue(issues, 'methodology.version', 'indicators.yaml', 'indicators.yaml', /folder/)
  })
})

// ---------------------------------------------------------------------------------------------
// methodology.indicator-set

describe('methodology.indicator-set', () => {
  it('passes the repository methodology', () => {
    expect(issuesOf(CLEAN, 'methodology.indicator-set')).toEqual([])
  })

  it('reports a duplicate indicator id', () => {
    const issues = check((_ds, m) => {
      m.indicators.push(structuredClone(ind(m, 'A3')))
    })
    expectIssue(issues, 'methodology.indicator-set', 'indicators.yaml', 'A3', /more than once/)
  })

  it('reports an id whose letter is not its category', () => {
    const issues = check((_ds, m) => {
      ind(m, 'A3').category = 'B'
    })
    expectIssue(issues, 'methodology.indicator-set', 'indicators.yaml', 'A3', /expected A/)
  })

  it('reports a category missing from categories.yaml', () => {
    const issues = check((_ds, m) => {
      const file = need(m.categories, 'categories.yaml').value
      file.categories = file.categories.filter((c) => c.id !== 'E')
    })
    for (const id of ['E1', 'E2', 'E3']) {
      expectIssue(issues, 'methodology.indicator-set', 'indicators.yaml', id, /categories\.yaml/)
    }
  })

  it('reports scored differing from the category (E1–E3 unscored, D-12)', () => {
    const issues = check((_ds, m) => {
      ind(m, 'E1').scored = true
    })
    expectIssue(issues, 'methodology.indicator-set', 'indicators.yaml', 'E1', /scored/)
  })

  it('skips the category checks when categories.yaml failed to load', () => {
    const issues = check((_ds, m) => {
      m.categories = null
      ind(m, 'E1').scored = true
    })
    expect(issuesOf(issues, 'methodology.indicator-set')).toEqual([])
  })
})

// ---------------------------------------------------------------------------------------------
// methodology.indicator-points

describe('methodology.indicator-points', () => {
  const rule = 'methodology.indicator-points'

  it('passes the repository methodology', () => {
    expect(issuesOf(CLEAN, 'methodology.indicator-points')).toEqual([])
  })

  it('accepts equal tier values on a generated indicator (B1 abstain −2, absent −2)', () => {
    expect(issuesOf(CLEAN, rule).filter((i) => i.id === 'B1')).toEqual([])
  })

  it('accepts a per-instance value without scaled (A8), and with it (A5)', () => {
    expect(issuesOf(CLEAN, rule).filter((i) => i.id === 'A5' || i.id === 'A8')).toEqual([])
  })

  it('reports a computed indicator without a formula', () => {
    const issues = check((_ds, m) => {
      ind(m, 'A1').points = { kind: 'fixed', value: -10 }
    })
    expectIssue(issues, 'methodology.indicator-points', 'indicators.yaml', 'A1', /computed/)
  })

  it('reports a formula on an indicator that is not computed', () => {
    const issues = check((_ds, m) => {
      ind(m, 'D1').type = 'repeatable'
    })
    expectIssue(issues, 'methodology.indicator-points', 'indicators.yaml', 'D1', /only computed/)
  })

  it('reports a formula missing from thresholds.yaml', () => {
    const issues = check((_ds, m) => {
      formulaPoints(m, 'A1').ref = 'zz'
    })
    expectIssue(issues, 'methodology.indicator-points', 'indicators.yaml', 'A1', /zz/)
  })

  it('reports a thresholds.yaml formula that names another indicator', () => {
    const issues = check((_ds, m) => {
      tierFormula(m, 'a2').indicator = 'A4'
    })
    expectIssue(issues, 'methodology.indicator-points', 'indicators.yaml', 'A2', /names A4/)
  })

  it('reports an empty formula range', () => {
    const issues = check((_ds, m) => {
      formulaPoints(m, 'A1').range = { min: 0, max: 0 }
    })
    expectIssue(issues, 'methodology.indicator-points', 'indicators.yaml', 'A1', /min < max/)
  })

  it('reports a generated indicator without generated_from', () => {
    const blank = check((_ds, m) => {
      ind(m, 'B2').generated_from = '   '
    })
    expectIssue(blank, 'methodology.indicator-points', 'indicators.yaml', 'B2', /generated_from/)
    const missing = check((_ds, m) => {
      Reflect.deleteProperty(ind(m, 'B8'), 'generated_from')
    })
    expectIssue(missing, 'methodology.indicator-points', 'indicators.yaml', 'B8', /generated_from/)
  })

  it('reports a computed indicator authored by hand (D-08)', () => {
    const issues = check((_ds, m) => {
      ind(m, 'A1').authoring = 'hand'
    })
    expectIssue(issues, 'methodology.indicator-points', 'indicators.yaml', 'A1', /D-08/)
  })

  it('reports values that contradict a negative sign, zero included', () => {
    const issues = check((_ds, m) => {
      ind(m, 'A3').points = { kind: 'fixed', value: 15 }
      ind(m, 'A5').points = { kind: 'per_instance', value: 0 }
      formulaPoints(m, 'A1').range.max = 5
    })
    expectIssue(issues, 'methodology.indicator-points', 'indicators.yaml', 'A3', /allows 15/)
    expectIssue(issues, 'methodology.indicator-points', 'indicators.yaml', 'A5', /allows 0/)
    expectIssue(issues, 'methodology.indicator-points', 'indicators.yaml', 'A1', /reaches 5/)
  })

  it('reports values that contradict a positive sign', () => {
    const issues = check((_ds, m) => {
      ind(m, 'A6').points = { kind: 'fixed', value: -10 }
      const b9 = pointTiers(m, 'B9')[0]
      if (b9) b9.value = 0
      formulaPoints(m, 'D1').range.min = -1
    })
    expectIssue(issues, 'methodology.indicator-points', 'indicators.yaml', 'A6', /allows -10/)
    expectIssue(issues, 'methodology.indicator-points', 'indicators.yaml', 'B9', /allows 0/)
    expectIssue(issues, 'methodology.indicator-points', 'indicators.yaml', 'D1', /starts at -1/)
  })

  it('reports a mixed indicator without both a positive and a negative value', () => {
    const issues = check((_ds, m) => {
      for (const tier of pointTiers(m, 'B1')) tier.value = -Math.abs(tier.value)
    })
    expectIssue(issues, 'methodology.indicator-points', 'indicators.yaml', 'B1', /mixed/)
  })

  it('reports a duplicate tier key', () => {
    const issues = check((_ds, m) => {
      const tier = pointTiers(m, 'B12')[1]
      if (tier) tier.key = 'recall'
    })
    expectIssue(issues, 'methodology.indicator-points', 'indicators.yaml', 'B12', /tier recall/)
  })

  it('reports equal tier values on a hand-authored indicator', () => {
    const issues = check((_ds, m) => {
      const tier = pointTiers(m, 'B12')[1]
      if (tier) tier.value = pointTiers(m, 'B12')[0]?.value ?? 0
    })
    expectIssue(issues, 'methodology.indicator-points', 'indicators.yaml', 'B12', /distinct/)
    const b1 = check((_ds, m) => {
      ind(m, 'B1').authoring = 'hand'
    })
    expectIssue(b1, 'methodology.indicator-points', 'indicators.yaml', 'B1', /both carry -2/)
  })

  it('reports tiers, formulas and per-instance tiers without scaled', () => {
    const issues = check((_ds, m) => {
      ind(m, 'B12').scaled = false
      ind(m, 'A1').scaled = false
      ind(m, 'B9').scaled = false
    })
    for (const id of ['B12', 'A1', 'B9']) {
      expectIssue(issues, 'methodology.indicator-points', 'indicators.yaml', id, /scaled: true/)
    }
  })
})

// ---------------------------------------------------------------------------------------------
// methodology.indicator-caps

describe('methodology.indicator-caps', () => {
  const rule = 'methodology.indicator-caps'

  it('passes the repository methodology', () => {
    expect(issuesOf(CLEAN, 'methodology.indicator-caps')).toEqual([])
  })

  it('accepts the latest_position group in another order', () => {
    const issues = check((_ds, m) => {
      ind(m, 'B6').stacking.group = ['B6', 'B5']
    })
    expect(issuesOf(issues, rule)).toEqual([])
  })

  it('reports a per-instance indicator without a cap', () => {
    const issues = check((_ds, m) => {
      ind(m, 'A5').indicator_cap = null
    })
    expectIssue(issues, 'methodology.indicator-caps', 'indicators.yaml', 'A5', /is null/)
  })

  it('reports a cap that does not follow a negative sign', () => {
    const noMin = check((_ds, m) => {
      ind(m, 'A5').indicator_cap = { min: null, max: null }
    })
    expectIssue(noMin, 'methodology.indicator-caps', 'indicators.yaml', 'A5', /min is null/)
    const wrongMax = check((_ds, m) => {
      ind(m, 'A5').indicator_cap = { min: -15, max: 5 }
    })
    expectIssue(wrongMax, 'methodology.indicator-caps', 'indicators.yaml', 'A5', /max is 5/)
    const positiveMin = check((_ds, m) => {
      ind(m, 'B10').indicator_cap = { min: 10, max: null }
    })
    expectIssue(positiveMin, 'methodology.indicator-caps', 'indicators.yaml', 'B10', /min is 10/)
  })

  it('reports a cap that does not follow a positive sign', () => {
    const wrongMin = check((_ds, m) => {
      ind(m, 'A8').indicator_cap = { min: -5, max: 10 }
    })
    expectIssue(wrongMin, 'methodology.indicator-caps', 'indicators.yaml', 'A8', /min is -5/)
    const zeroMax = check((_ds, m) => {
      ind(m, 'A8').indicator_cap = { min: null, max: 0 }
    })
    expectIssue(zeroMax, 'methodology.indicator-caps', 'indicators.yaml', 'A8', /max is 0/)
  })

  it('reports a cap smaller than one event', () => {
    const issues = check((_ds, m) => {
      ind(m, 'A5').indicator_cap = { min: -3, max: null }
      ind(m, 'B9').indicator_cap = { min: null, max: 4 }
    })
    expectIssue(issues, 'methodology.indicator-caps', 'indicators.yaml', 'A5', /magnitude/)
    expectIssue(issues, 'methodology.indicator-caps', 'indicators.yaml', 'B9', /\+5/)
  })

  it('reports one_per_tier on an indicator without tiers', () => {
    const issues = check((_ds, m) => {
      ind(m, 'A7').stacking = { rule: 'one_per_tier' }
    })
    expectIssue(issues, 'methodology.indicator-caps', 'indicators.yaml', 'A7', /no tiers/)
  })

  it('reports most_severe or one_per_tier on an indicator that is not standing', () => {
    const issues = check((_ds, m) => {
      ind(m, 'A5').stacking = { rule: 'most_severe' }
      ind(m, 'B11').type = 'repeatable'
    })
    expectIssue(issues, 'methodology.indicator-caps', 'indicators.yaml', 'A5', /standing/)
    expectIssue(issues, 'methodology.indicator-caps', 'indicators.yaml', 'B11', /standing/)
  })

  it('reports a latest_position rule without a group', () => {
    const issues = check((_ds, m) => {
      ind(m, 'B5').stacking = { rule: 'latest_position' }
    })
    expectIssue(issues, 'methodology.indicator-caps', 'indicators.yaml', 'B5', /without a group/)
  })

  it('reports a latest_position group that leaves out the indicator itself', () => {
    const issues = check((_ds, m) => {
      ind(m, 'B5').stacking.group = ['B6']
    })
    expectIssue(issues, 'methodology.indicator-caps', 'indicators.yaml', 'B5', /must include B5/)
  })

  it('reports an unknown group member and members that disagree', () => {
    const unknown = check((_ds, m) => {
      ind(m, 'B5').stacking.group = ['B5', 'B6', 'D9']
    })
    expectIssue(unknown, 'methodology.indicator-caps', 'indicators.yaml', 'B5', /D9/)
    expectIssue(unknown, 'methodology.indicator-caps', 'indicators.yaml', 'B6', /group member B5/)
    const otherRule = check((_ds, m) => {
      ind(m, 'B6').stacking = { rule: 'sum' }
    })
    expectIssue(
      otherRule,
      'methodology.indicator-caps',
      'indicators.yaml',
      'B5',
      /B6 of B5 stacks sum/,
    )
  })

  it('reports a group given with another rule', () => {
    const issues = check((_ds, m) => {
      ind(m, 'A3').stacking = { rule: 'sum', group: ['A3'] }
    })
    expectIssue(issues, 'methodology.indicator-caps', 'indicators.yaml', 'A3', /only by latest/)
  })

  it('reports superseded_by naming an unknown id, itself, or a non-standing indicator', () => {
    const unknown = check((_ds, m) => {
      ind(m, 'A6').superseded_by = ['D9']
    })
    expectIssue(unknown, 'methodology.indicator-caps', 'indicators.yaml', 'A6', /D9/)
    const self = check((_ds, m) => {
      ind(m, 'A6').superseded_by = ['A6']
    })
    expectIssue(self, 'methodology.indicator-caps', 'indicators.yaml', 'A6', /itself/)
    const repeatable = check((_ds, m) => {
      ind(m, 'A6').superseded_by = ['A5']
      ind(m, 'A8').superseded_by = ['A7']
    })
    expectIssue(repeatable, 'methodology.indicator-caps', 'indicators.yaml', 'A6', /standing/)
    expectIssue(repeatable, 'methodology.indicator-caps', 'indicators.yaml', 'A8', /standing/)
  })
})

// ---------------------------------------------------------------------------------------------
// methodology.thresholds

describe('methodology.thresholds', () => {
  const rule = 'methodology.thresholds'

  it('passes the repository methodology', () => {
    expect(issuesOf(CLEAN, 'methodology.thresholds')).toEqual([])
  })

  it('accepts equal thresholds as gt then gte', () => {
    const issues = check((_ds, m) => {
      tierFormula(m, 'a4').tiers = [
        { op: 'gte', value: 500, points: -15 },
        { op: 'gte', value: 100, points: -10 },
        { op: 'gt', value: 10, points: -5 },
        { op: 'gte', value: 10, points: -4 },
        { op: 'gt', value: 0, points: -2 },
      ]
    })
    expect(issuesOf(issues, rule)).toEqual([])
  })

  it('reports a formula naming an unknown indicator', () => {
    const issues = check((_ds, m) => {
      sqrtFormula(m, 'a1').indicator = 'D9'
    })
    expectIssue(issues, 'methodology.thresholds', 'thresholds.yaml', 'a1', /D9/)
  })

  it('reports a formula naming an indicator without formula points', () => {
    const issues = check((_ds, m) => {
      sqrtFormula(m, 'a1').indicator = 'A3'
    })
    expectIssue(issues, 'methodology.thresholds', 'thresholds.yaml', 'a1', /kind is fixed/)
  })

  it('reports a formula whose indicator refers to another key', () => {
    const issues = check((_ds, m) => {
      const t = need(m.thresholds, 'thresholds.yaml').value
      t.formulas.a1b = structuredClone(sqrtFormula(m, 'a1'))
    })
    expectIssue(issues, 'methodology.thresholds', 'thresholds.yaml', 'a1b', /refer to a1/)
  })

  it('reports tiers not ordered from the highest threshold down', () => {
    const issues = check((_ds, m) => {
      const f = tierFormula(m, 'a2')
      f.tiers = [...f.tiers].reverse()
    })
    expectIssue(issues, 'methodology.thresholds', 'thresholds.yaml', 'a2', /highest threshold/)
  })

  it('reports equal thresholds as gte then gt, where the gt tier could never match', () => {
    const issues = check((_ds, m) => {
      tierFormula(m, 'a4').tiers = [
        { op: 'gte', value: 500, points: -15 },
        { op: 'gte', value: 100, points: -10 },
        { op: 'gte', value: 10, points: -5 },
        { op: 'gt', value: 10, points: -4 },
      ]
    })
    expectIssue(issues, 'methodology.thresholds', 'thresholds.yaml', 'a4', /follows gte 10/)
    const twice = check((_ds, m) => {
      tierFormula(m, 'd1').tiers.push({ op: 'gt', value: 0, points: 1 })
    })
    expectIssue(twice, 'methodology.thresholds', 'thresholds.yaml', 'd1', /follows gt 0/)
  })

  it('reports tier points and otherwise outside the indicator range', () => {
    const issues = check((_ds, m) => {
      const f = tierFormula(m, 'a2')
      const first = f.tiers[0]
      if (first) first.points = -30
      tierFormula(m, 'c3').otherwise = 1
    })
    expectIssue(issues, 'methodology.thresholds', 'thresholds.yaml', 'a2', /gives -30/)
    expectIssue(issues, 'methodology.thresholds', 'thresholds.yaml', 'c3', /otherwise gives 1/)
  })

  it('reports a sqrt_share scale outside the range or short of its far bound', () => {
    const short = check((_ds, m) => {
      sqrtFormula(m, 'a1').scale = -30
    })
    expectIssue(short, 'methodology.thresholds', 'thresholds.yaml', 'a1', /does not reach/)
    const outside = check((_ds, m) => {
      sqrtFormula(m, 'a1').scale = 40
    })
    expectIssue(outside, 'methodology.thresholds', 'thresholds.yaml', 'a1', /outside the range/)
  })

  it('still checks tier order when indicators.yaml failed to load', () => {
    const issues = check((_ds, m) => {
      m.indicatorsFile = null
      m.indicators = []
      const f = tierFormula(m, 'a2')
      f.tiers = [...f.tiers].reverse()
    })
    expectIssue(issues, 'methodology.thresholds', 'thresholds.yaml', 'a2', /highest threshold/)
    expect(issuesOf(issues, rule).every((i) => /highest threshold/.test(i.message))).toBe(true)
  })
})

// ---------------------------------------------------------------------------------------------
// methodology.categories

describe('methodology.categories', () => {
  it('passes the repository methodology', () => {
    expect(issuesOf(CLEAN, 'methodology.categories')).toEqual([])
  })

  it('accepts a cap bound of 0', () => {
    const issues = check((_ds, m) => {
      const a = need(m.categories, 'categories.yaml').value.categories[0]
      if (a) a.cap.max = 0
    })
    expect(issuesOf(issues, 'methodology.categories')).toEqual([])
  })

  it('reports a duplicate category', () => {
    const issues = check((_ds, m) => {
      const file = need(m.categories, 'categories.yaml').value
      file.categories.push(structuredClone(need(file.categories[0], 'category A')))
    })
    expectIssue(issues, 'methodology.categories', 'categories.yaml', 'A', /more than once/)
  })

  it('reports a missing category', () => {
    const issues = check((_ds, m) => {
      const file = need(m.categories, 'categories.yaml').value
      file.categories = file.categories.filter((c) => c.id !== 'E')
    })
    expectIssue(issues, 'methodology.categories', 'categories.yaml', 'E', /missing/)
  })

  it('reports a cap that does not straddle 0', () => {
    const issues = check((_ds, m) => {
      const file = need(m.categories, 'categories.yaml').value
      const c = need(
        file.categories.find((x) => x.id === 'C'),
        'category C',
      )
      c.cap.min = 5
      const d = need(
        file.categories.find((x) => x.id === 'D'),
        'category D',
      )
      d.cap.max = -1
    })
    expectIssue(issues, 'methodology.categories', 'categories.yaml', 'C', /min ≤ 0 ≤ max/)
    expectIssue(issues, 'methodology.categories', 'categories.yaml', 'D', /min ≤ 0 ≤ max/)
  })

  it('reports a score clip that does not straddle 0', () => {
    const issues = check((_ds, m) => {
      need(m.categories, 'categories.yaml').value.score_clip.min = 0
    })
    expectIssue(issues, 'methodology.categories', 'categories.yaml', 'score_clip', /min < 0 < max/)
  })
})

// ---------------------------------------------------------------------------------------------
// methodology.bands

describe('methodology.bands', () => {
  const rule = 'methodology.bands'
  const band = (m: Methodology, id: string) =>
    need(
      need(m.bands, 'bands.yaml').value.bands.find((b) => b.id === id),
      `band ${id}`,
    )

  it('passes the repository methodology', () => {
    expect(issuesOf(CLEAN, 'methodology.bands')).toEqual([])
  })

  it('accepts contiguous bands listed in another order', () => {
    const issues = check((_ds, m) => {
      need(m.bands, 'bands.yaml').value.bands.reverse()
    })
    expect(issuesOf(issues, rule)).toEqual([])
  })

  it('reports a duplicate band id', () => {
    const issues = check((_ds, m) => {
      band(m, 'enabling').id = 'sustaining'
    })
    expectIssue(issues, 'methodology.bands', 'bands.yaml', 'sustaining', /more than once/)
  })

  it('reports a band with min > max', () => {
    const issues = check((_ds, m) => {
      band(m, 'acting').min = 50
    })
    expectIssue(issues, 'methodology.bands', 'bands.yaml', 'acting', /min 50 > max 40/)
  })

  it('reports a gap and an overlap between bands', () => {
    const gap = check((_ds, m) => {
      band(m, 'passive').max = -1
    })
    expectIssue(gap, 'methodology.bands', 'bands.yaml', 'acting', /expected 0/)
    const overlap = check((_ds, m) => {
      band(m, 'acting').min = 0
    })
    expectIssue(overlap, 'methodology.bands', 'bands.yaml', 'acting', /expected 1/)
  })

  it('reports bands that do not cover the score clip exactly', () => {
    const issues = check((_ds, m) => {
      band(m, 'sustaining').min = -99
      band(m, 'confronting').max = 99
    })
    expectIssue(issues, 'methodology.bands', 'bands.yaml', 'sustaining', /minimum -100/)
    expectIssue(issues, 'methodology.bands', 'bands.yaml', 'confronting', /maximum 100/)
  })

  it('skips the score clip check when categories.yaml failed to load', () => {
    const issues = check((_ds, m) => {
      m.categories = null
      band(m, 'sustaining').min = -99
    })
    expect(issuesOf(issues, rule)).toEqual([])
  })
})

// ---------------------------------------------------------------------------------------------
// methodology.confidence

describe('methodology.confidence', () => {
  const level = (m: Methodology, id: string) =>
    need(
      need(m.confidence, 'confidence.yaml').value.levels.find((l) => l.id === id),
      `level ${id}`,
    )

  it('passes the repository methodology', () => {
    expect(issuesOf(CLEAN, 'methodology.confidence')).toEqual([])
  })

  it('reports a missing level', () => {
    const issues = check((_ds, m) => {
      const file = need(m.confidence, 'confidence.yaml').value
      file.levels = file.levels.filter((l) => l.id !== 'disputed')
    })
    expectIssue(issues, 'methodology.confidence', 'confidence.yaml', 'disputed', /missing/)
  })

  it('reports a duplicate level', () => {
    const issues = check((_ds, m) => {
      const file = need(m.confidence, 'confidence.yaml').value
      file.levels.push(structuredClone(level(m, 'reported')))
    })
    expectIssue(issues, 'methodology.confidence', 'confidence.yaml', 'reported', /2 times/)
  })

  it('reports confirmed with a weight other than 1', () => {
    const issues = check((_ds, m) => {
      level(m, 'confirmed').weight = 0.9
    })
    expectIssue(issues, 'methodology.confidence', 'confidence.yaml', 'confirmed', /0\.9/)
  })

  it('reports confirmed without source kinds', () => {
    const empty = check((_ds, m) => {
      level(m, 'confirmed').requires.any_source_kind = []
    })
    expectIssue(empty, 'methodology.confidence', 'confidence.yaml', 'confirmed', /any_source_kind/)
    const missing = check((_ds, m) => {
      Reflect.deleteProperty(level(m, 'confirmed').requires, 'any_source_kind')
    })
    expectIssue(missing, 'methodology.confidence', 'confidence.yaml', 'confirmed', /any_source/)
  })

  it('reports corroborated without min_distinct_publishers', () => {
    const issues = check((_ds, m) => {
      Reflect.deleteProperty(level(m, 'corroborated').requires, 'min_distinct_publishers')
    })
    expectIssue(issues, 'methodology.confidence', 'confidence.yaml', 'corroborated', /publishers/)
  })
})

// ---------------------------------------------------------------------------------------------
// methodology.decay

describe('methodology.decay', () => {
  it('passes the repository methodology', () => {
    expect(issuesOf(CLEAN, 'methodology.decay')).toEqual([])
  })

  it('reports a plateau that does not end before the decay', () => {
    const issues = check((_ds, m) => {
      const d = need(m.decay, 'decay.yaml').value
      d.plateau_days = d.end_days
    })
    expectIssue(issues, 'methodology.decay', 'decay.yaml', 'plateau_days', /not below/)
  })

  it('reports decay that does not apply to repeatable events', () => {
    const issues = check((_ds, m) => {
      need(m.decay, 'decay.yaml').value.applies_to = ['standing']
    })
    expectIssue(issues, 'methodology.decay', 'decay.yaml', 'applies_to', /repeatable/)
  })
})

// ---------------------------------------------------------------------------------------------
// methodology.passivity

describe('methodology.passivity', () => {
  const rule = 'methodology.passivity'

  it('passes the repository methodology', () => {
    expect(issuesOf(CLEAN, 'methodology.passivity')).toEqual([])
  })

  it('reports an unknown qualifying indicator', () => {
    const issues = check((_ds, m) => {
      need(m.passivity, 'passivity.yaml').value.qualifying_indicators.push('D9')
    })
    expectIssue(issues, 'methodology.passivity', 'passivity.yaml', 'D9', /not an indicator/)
  })

  it('reports an unscored qualifying indicator', () => {
    const issues = check((_ds, m) => {
      ind(m, 'C5').scored = false
    })
    expectIssue(issues, 'methodology.passivity', 'passivity.yaml', 'C5', /not scored/)
  })

  it('reports an unknown excluded indicator', () => {
    const issues = check((_ds, m) => {
      need(need(m.passivity, 'passivity.yaml').value.excluded[0], 'excluded').indicators.push('D9')
    })
    expectIssue(issues, 'methodology.passivity', 'passivity.yaml', 'D9', /excluded indicator/)
  })

  it('reports an indicator both qualifying and excluded', () => {
    const issues = check((_ds, m) => {
      need(need(m.passivity, 'passivity.yaml').value.excluded[0], 'excluded').indicators.push('B2')
    })
    expectIssue(issues, 'methodology.passivity', 'passivity.yaml', 'B2', /both/)
  })

  it('reports a penalty missing from the sensitivity values (D-11)', () => {
    const issues = check((_ds, m) => {
      need(m.passivity, 'passivity.yaml').value.sensitivity_points = [5, 25]
    })
    expectIssue(issues, 'methodology.passivity', 'passivity.yaml', 'sensitivity_points', /15/)
  })

  it('skips the existence checks when indicators.yaml failed to load', () => {
    const issues = check((_ds, m) => {
      m.indicatorsFile = null
      m.indicators = []
      need(m.passivity, 'passivity.yaml').value.qualifying_indicators.push('D9')
    })
    expect(issuesOf(issues, rule)).toEqual([])
  })
})

// ---------------------------------------------------------------------------------------------
// methodology.votes

describe('methodology.votes', () => {
  const rule = 'methodology.votes'
  const addVotes = (m: Methodology, ...list: QualifyingVote[]) => {
    need(m.votes, 'votes.yaml').value.votes.push(...list)
  }

  it('passes the repository methodology', () => {
    expect(issuesOf(CLEAN, 'methodology.votes')).toEqual([])
  })

  it('accepts a vote dated on the window start and citing an official source', () => {
    const issues = check((ds, m) =>
      addVotes(m, testVote(fixtureSourceId(ds), { date: '2023-10-07' })),
    )
    expect(issuesOf(issues, rule)).toEqual([])
  })

  it('reports a duplicate symbol', () => {
    const issues = check((ds, m) =>
      addVotes(m, testVote(fixtureSourceId(ds)), testVote(fixtureSourceId(ds))),
    )
    expectIssue(issues, 'methodology.votes', 'votes.yaml', 'A/RES/TEST/1', /more than once/)
  })

  it('reports a vote before 2023-10-07', () => {
    const issues = check((ds, m) =>
      addVotes(m, testVote(fixtureSourceId(ds), { date: '2023-10-06' })),
    )
    expectIssue(issues, 'methodology.votes', 'votes.yaml', 'A/RES/TEST/1', /2023-10-06/)
  })

  it('reports an unknown source unless the source failed its schema', () => {
    const unknown = 'src_20240101_test_unknown-source'
    const issues = check((_ds, m) => addVotes(m, testVote(unknown)))
    expectIssue(issues, 'methodology.votes', 'votes.yaml', 'A/RES/TEST/1', /not a source/)
    const invalid = check((ds, m) => {
      ds.invalidIds.add(unknown)
      ds.invalid.source.add(unknown)
      addVotes(m, testVote(unknown))
    })
    expect(issuesOf(invalid, rule)).toEqual([])
  })

  it('reports a source that is not of kind official', () => {
    const issues = check((ds, m) => {
      const source = need(ds.sources[0], 'fixture source')
      source.value.kind = 'press'
      addVotes(m, testVote(source.value.id))
    })
    expectIssue(issues, 'methodology.votes', 'votes.yaml', 'A/RES/TEST/1', /kind press/)
  })
})

// ---------------------------------------------------------------------------------------------
// methodology.symmetry

describe('methodology.symmetry', () => {
  const rule = 'methodology.symmetry'
  const firstPair = (m: Methodology) =>
    need(need(m.symmetry, 'symmetry.yaml').value.pairs[0], 'first symmetry pair')
  const dropPair = (m: Methodology, negative: string) => {
    const file = need(m.symmetry, 'symmetry.yaml').value
    file.pairs = file.pairs.filter((p) => !p.negative.includes(negative))
  }

  it('passes the repository methodology (B1, mixed, on both sides)', () => {
    expect(issuesOf(CLEAN, 'methodology.symmetry')).toEqual([])
  })

  it('accepts a negative indicator listed in no_counterpart with a reason', () => {
    const issues = check((_ds, m) => {
      dropPair(m, 'D2')
      need(m.symmetry, 'symmetry.yaml').value.no_counterpart.push({
        indicator: 'D2',
        reason: { en: 'Test fixture.', fr: 'Donnée de test.' },
      })
    })
    expect(issuesOf(issues, rule)).toEqual([])
  })

  it('reports a negative indicator without a counterpart', () => {
    const issues = check((_ds, m) => dropPair(m, 'D2'))
    expectIssue(issues, 'methodology.symmetry', 'symmetry.yaml', 'D2', /no positive counterpart/)
  })

  it('reports a mixed indicator without a counterpart', () => {
    const issues = check((_ds, m) => dropPair(m, 'B1'))
    expectIssue(issues, 'methodology.symmetry', 'symmetry.yaml', 'B1', /is mixed/)
  })

  it('reports an unknown id', () => {
    const issues = check((_ds, m) => {
      firstPair(m).positive.push('D9')
    })
    expectIssue(issues, 'methodology.symmetry', 'symmetry.yaml', 'D9', /not an indicator/)
  })

  it('reports a positive indicator on the negative side', () => {
    const issues = check((_ds, m) => {
      firstPair(m).negative.push('A6')
    })
    expectIssue(issues, 'methodology.symmetry', 'symmetry.yaml', 'A6', /negative side/)
  })

  it('reports a negative indicator on the positive side', () => {
    const issues = check((_ds, m) => {
      firstPair(m).positive = ['A2']
    })
    expectIssue(issues, 'methodology.symmetry', 'symmetry.yaml', 'A2', /positive side/)
  })

  it('reports a positive indicator in no_counterpart', () => {
    const issues = check((_ds, m) => {
      need(m.symmetry, 'symmetry.yaml').value.no_counterpart.push({
        indicator: 'A6',
        reason: { en: 'Test fixture.', fr: 'Donnée de test.' },
      })
    })
    expectIssue(issues, 'methodology.symmetry', 'symmetry.yaml', 'A6', /no_counterpart side/)
  })

  it('skips the id checks when indicators.yaml failed to load', () => {
    const issues = check((_ds, m) => {
      m.indicatorsFile = null
      m.indicators = []
      firstPair(m).positive.push('D9')
    })
    expect(issuesOf(issues, rule)).toEqual([])
  })
})

// ---------------------------------------------------------------------------------------------
// methodology.banned-words

describe('methodology.banned-words', () => {
  const rule = 'methodology.banned-words'
  const entries = (m: Methodology) => need(m.bannedWords, 'banned-words.txt').entries

  it('passes the repository methodology', () => {
    expect(issuesOf(CLEAN, 'methodology.banned-words')).toEqual([])
  })

  it('accepts a trailing wildcard', () => {
    const issues = check((_ds, m) => {
      entries(m).push({ term: 'testword*', line: 9001 })
    })
    expect(issuesOf(issues, rule)).toEqual([])
  })

  it('reports an empty list', () => {
    const issues = check((_ds, m) => {
      need(m.bannedWords, 'banned-words.txt').entries = []
    })
    expectIssue(issues, 'methodology.banned-words', 'banned-words.txt', '-', /no term/)
  })

  it('reports a duplicate term on the later line', () => {
    const issues = check((_ds, m) => {
      const first = need(entries(m)[0], 'first banned word')
      entries(m).push({ term: first.term, line: 9001 })
    })
    const hits = issuesOf(issues, 'methodology.banned-words')
    expect(hits).toHaveLength(1)
    expect(hits[0]?.line).toBe(9001)
    expect(hits[0]?.file).toBe(pathOf('banned-words.txt'))
    expect(hits[0]?.message).toMatch(/repeats line/)
  })

  it('reports a lone *, a ** and a * before the end', () => {
    const issues = check((_ds, m) => {
      entries(m).push(
        { term: '*', line: 9001 },
        { term: 'testword**', line: 9002 },
        { term: 'test*word', line: 9003 },
      )
    })
    for (const term of ['*', 'testword**', 'test*word']) {
      expectIssue(issues, 'methodology.banned-words', 'banned-words.txt', term, /wildcard/)
    }
  })
})

// ---------------------------------------------------------------------------------------------
// v1.0.0 matches docs/02
//
// Expected values written from docs/02-methodology-spec.md (§2 indicator-level caps and
// precisions, §3 event types and their final decisions, §4 confidence, §5 formulas, §6 passivity,
// §7 score and bands, §10 sensitivity, §13 symmetry), spec §2 (scale), §3 (indicator tables) and
// §4, and the P-02 encoding decisions (authoring, tier keys, stacking names). If the YAML
// disagrees, the YAML is what needs fixing (docs/02: "when they conflict, fix the files").

type ExpectedPoints =
  | { fixed: number }
  | { perInstance: number }
  | { perInstanceTiers: Record<string, number> }
  | { tiers: Record<string, number> }
  | { formula: [number, number] }
type Stacking = 'sum' | 'most_severe' | 'one_per_tier' | 'latest_position'
type Row = [
  id: string,
  type: EventType,
  sign: Sign,
  points: ExpectedPoints,
  cap: [number | null, number | null] | null,
  stacking: Stacking,
  authoring: 'hand' | 'generated',
  cadence: Cadence,
]

// biome-ignore format: one indicator per line reads as the spec tables
const INDICATOR_TABLE: Row[] = [
  // A. Arms & military (cap −45 / +30). A6 standing (open-ended suspension, docs/02 §3).
  ['A1', 'computed', 'negative', { formula: [-40, 0] }, null, 'sum', 'generated', 'annual-march'],
  ['A2', 'computed', 'negative', { formula: [-25, 0] }, null, 'sum', 'generated', 'quarterly'],
  ['A3', 'standing', 'negative', { fixed: -15 }, null, 'sum', 'hand', 'on-change'],
  ['A4', 'computed', 'negative', { formula: [-15, 0] }, null, 'sum', 'generated', 'annual'],
  ['A5', 'repeatable', 'negative', { perInstance: -5 }, [-15, null], 'sum', 'hand', 'on-event'],
  ['A6', 'standing', 'positive', { fixed: 10 }, null, 'sum', 'hand', 'on-event'],
  ['A7', 'standing', 'positive', { fixed: 25 }, null, 'sum', 'hand', 'on-event'],
  ['A8', 'repeatable', 'positive', { perInstance: 5 }, [null, 10], 'sum', 'hand', 'on-event'],
  // B. Diplomacy & international law (cap −40 / +45). B3, B5/B6 standing (docs/02 §3).
  ['B1', 'repeatable', 'mixed', { tiers: { yes: 3, abstain: -2, no: -5, absent: -2 } }, null, 'sum', 'generated', 'per-vote'],
  ['B2', 'repeatable', 'negative', { fixed: -20 }, null, 'sum', 'generated', 'per-vote'],
  ['B3', 'standing', 'positive', { fixed: 15 }, null, 'sum', 'hand', 'on-event'],
  ['B4', 'repeatable', 'negative', { fixed: -15 }, null, 'sum', 'hand', 'on-event'],
  ['B5', 'standing', 'positive', { fixed: 8 }, null, 'latest_position', 'hand', 'on-event'],
  ['B6', 'standing', 'negative', { fixed: -10 }, null, 'latest_position', 'hand', 'on-event'],
  ['B7', 'standing', 'negative', { fixed: -20 }, null, 'sum', 'hand', 'on-event'],
  ['B8', 'standing', 'positive', { tiers: { recognised_after_window: 8, pre_existing: 3 } }, null, 'most_severe', 'generated', 'on-event'],
  ['B9', 'repeatable', 'positive', { perInstanceTiers: { call: 2, names_violations: 5 } }, [null, 10], 'sum', 'hand', 'on-event'],
  ['B10', 'repeatable', 'negative', { perInstance: -5 }, [-10, null], 'sum', 'hand', 'on-event'],
  ['B11', 'standing', 'positive', { tiers: { ministers: 10, settlers: 5 } }, null, 'one_per_tier', 'hand', 'on-event'],
  ['B12', 'standing', 'positive', { tiers: { recall: 5, downgrade: 8, severed: 10 } }, null, 'most_severe', 'hand', 'on-event'],
  // C. Trade & economy (cap −20 / +20). C2 standing (docs/02 §3).
  ['C1', 'standing', 'positive', { tiers: { review: 4, suspension: 10 } }, null, 'most_severe', 'hand', 'on-event'],
  ['C2', 'standing', 'negative', { fixed: -10 }, null, 'sum', 'hand', 'on-event'],
  ['C3', 'computed', 'negative', { formula: [-8, 0] }, null, 'sum', 'generated', 'annual'],
  ['C4', 'standing', 'positive', { tiers: { labelling: 2, ban: 5 } }, null, 'most_severe', 'hand', 'on-event'],
  ['C5', 'repeatable', 'positive', { fixed: 5 }, null, 'sum', 'hand', 'on-event'],
  ['C6', 'repeatable', 'positive', { fixed: 3 }, null, 'sum', 'hand', 'on-event'],
  // D. Humanitarian (cap −15 / +25).
  ['D1', 'computed', 'positive', { formula: [0, 12] }, null, 'sum', 'generated', 'monthly'],
  ['D2', 'standing', 'negative', { fixed: -10 }, null, 'sum', 'hand', 'on-event'],
  ['D3', 'standing', 'positive', { tiers: { restored: 5, increased: 8 } }, null, 'most_severe', 'hand', 'on-event'],
  ['D4', 'repeatable', 'positive', { fixed: 5 }, null, 'sum', 'hand', 'on-event'],
  ['D5', 'repeatable', 'positive', { fixed: 5 }, null, 'sum', 'hand', 'on-event'],
  // E. Domestic accountability (cap −10 / +10), experimental and unscored (D-12).
  ['E1', 'repeatable', 'positive', { fixed: 5 }, null, 'sum', 'hand', 'on-event'],
  ['E2', 'repeatable', 'negative', { fixed: -5 }, null, 'sum', 'hand', 'on-event'],
  ['E3', 'repeatable', 'positive', { fixed: 5 }, null, 'sum', 'hand', 'on-event'],
]

/** Indicators whose per-event points may differ (docs/02 §12.1 list, extended in P-02). */
const SCALED = [
  'A1',
  'A2',
  'A4',
  'A5',
  'B1',
  'B8',
  'B9',
  'B11',
  'B12',
  'C1',
  'C3',
  'C4',
  'D1',
  'D3',
]

function encodedPoints(p: PointsSpec): ExpectedPoints {
  const byKey = (tiers: PointsTier[]) => Object.fromEntries(tiers.map((t) => [t.key, t.value]))
  switch (p.kind) {
    case 'fixed':
      return { fixed: p.value }
    case 'per_instance':
      return p.tiers ? { perInstanceTiers: byKey(p.tiers) } : { perInstance: p.value ?? Number.NaN }
    case 'tiers':
      return { tiers: byKey(p.tiers) }
    case 'formula':
      return { formula: [p.range.min, p.range.max] }
  }
}

const range = (letter: string, from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => `${letter}${from + i}`)

/** Rows of the spec §3 indicator tables: id → Indicator, Points, Cadence cells. */
function specIndicatorRows(): Map<string, { name: string; points: string; cadence: string }> {
  const spec = readFileSync(
    join(REPO_ROOT, 'Gaza Accountability Index — Cahier des charges.md'),
    'utf8',
  )
  const section = spec.slice(spec.indexOf('## 3. Indicators'), spec.indexOf('## 4. Scoring'))
  const rows = new Map<string, { name: string; points: string; cadence: string }>()
  for (const line of section.split('\n')) {
    const match = /^\| ([A-E]\d{1,2}) \| (.*) \|$/.exec(line.trim())
    if (!match?.[1] || match[2] === undefined) continue
    const [name, points, , cadence] = match[2].split(' | ')
    if (name && points && cadence) rows.set(match[1], { name, points, cadence })
  }
  return rows
}

describe('v1.0.0 matches docs/02', () => {
  const v1 = loadMethodology(REPO_ROOT, 'v1.0.0')
  const indicators = () => need(v1.indicatorsFile, 'v1.0.0 indicators.yaml').value.indicators
  const get = (id: string) =>
    need(
      indicators().find((i) => i.id === id),
      `indicator ${id}`,
    )

  it('loads without issue', () => {
    expect(v1.issues.map(formatIssue)).toEqual([])
  })

  describe('indicators (spec §3, docs/02 §2–§3, §5)', () => {
    it('lists the 34 indicators in spec order, 31 of them scored (docs/02 §2)', () => {
      expect(indicators().map((i) => i.id)).toEqual(INDICATOR_TABLE.map(([id]) => id))
      expect(indicators().filter((i) => i.scored)).toHaveLength(31)
    })

    it.each(INDICATOR_TABLE)(
      '%s: type, sign, points, cap, stacking, scored, authoring, cadence',
      (id, type, sign, points, cap, stacking, authoring, cadence) => {
        const i = get(id)
        expect(i.category).toBe(id.charAt(0))
        expect(i.type).toBe(type)
        expect(i.sign).toBe(sign)
        expect(encodedPoints(i.points)).toEqual(points)
        expect(
          i.indicator_cap === null ? null : [i.indicator_cap.min, i.indicator_cap.max],
        ).toEqual(cap)
        expect(i.stacking.rule).toBe(stacking)
        expect(i.scored).toBe(!id.startsWith('E'))
        expect(i.authoring).toBe(authoring)
        expect(i.cadence).toBe(cadence)
        if (i.points.kind === 'formula') expect(i.points.ref).toBe(id.toLowerCase())
        expect(i.scaled).toBe(SCALED.includes(id))
      },
    )

    it('names and cadences are the spec §3 cells verbatim', () => {
      const rows = specIndicatorRows()
      const cadences = need(v1.indicatorsFile, 'v1.0.0 indicators.yaml').value.cadences
      expect([...rows.keys()]).toEqual(INDICATOR_TABLE.map(([id]) => id))
      for (const [id, row] of rows) {
        const i = get(id)
        expect(i.name.en, id).toBe(row.name)
        expect(cadences[i.cadence]?.en, id).toBe(row.cadence)
      }
    })

    it('A7 supersedes A6, and nothing else supersedes (docs/02 §2 A6/A7)', () => {
      for (const i of indicators())
        expect(i.superseded_by, i.id).toEqual(i.id === 'A6' ? ['A7'] : [])
    })

    it('B5 and B6 share one latest_position group (docs/02 §2 B5/B6)', () => {
      expect(new Set(get('B5').stacking.group)).toEqual(new Set(['B5', 'B6']))
      expect(new Set(get('B6').stacking.group)).toEqual(new Set(['B5', 'B6']))
    })

    it('only B2 is automatically not applicable, for non-members of the Council (docs/02 §8)', () => {
      for (const i of indicators()) {
        expect(i.not_applicable?.rule ?? null, i.id).toBe(i.id === 'B2' ? 'unsc_non_member' : null)
      }
    })

    it('only B9 and B10 require an actor and an official transcript or video (docs/02 §2)', () => {
      for (const i of indicators()) {
        const statement = i.id === 'B9' || i.id === 'B10'
        expect(i.evidence.requires_actor, i.id).toBe(statement)
        expect(i.evidence.source_kinds, i.id).toEqual(
          statement ? ['official', 'official-video'] : null,
        )
      }
    })
  })

  it('categories and score clip (docs/02 §7, spec §3, D-12)', () => {
    const file = need(v1.categories, 'v1.0.0 categories.yaml').value
    expect(file.score_clip).toEqual({ min: -100, max: 100 })
    expect(file.categories.map((c) => [c.id, c.name.en, c.cap.min, c.cap.max, c.scored])).toEqual([
      ['A', 'Arms & military', -45, 30, true],
      ['B', 'Diplomacy & international law', -40, 45, true],
      ['C', 'Trade & economy', -20, 20, true],
      ['D', 'Humanitarian', -15, 25, true],
      ['E', 'Domestic accountability', -10, 10, false],
    ])
    expect(file.categories.filter((c) => c.experimental).map((c) => c.id)).toEqual(['E'])
  })

  it('bands (spec §2, docs/02 §7)', () => {
    const file = need(v1.bands, 'v1.0.0 bands.yaml').value
    expect(file.rounding).toBe('half-away-from-zero')
    expect(file.read_from).toBe('rounded-score')
    expect(file.bands.map((b) => [b.id, b.name.en, b.min, b.max, b.meaning.en])).toEqual([
      ['sustaining', 'Sustaining', -100, -51, 'Materially enabling the military campaign'],
      ['enabling', 'Enabling', -50, -21, 'Contributing without leading'],
      ['passive', 'Passive', -20, 0, 'Silence or gestures only'],
      ['acting', 'Acting', 1, 40, 'Concrete measures with a cost'],
      ['confronting', 'Confronting', 41, 100, 'Sustained action across several fronts'],
    ])
  })

  it('confidence weights and requirements (docs/02 §4, spec §4)', () => {
    const levels = need(v1.confidence, 'v1.0.0 confidence.yaml').value.levels
    expect(levels.map((l) => [l.id, l.weight])).toEqual([
      ['confirmed', 1],
      ['corroborated', 0.7],
      ['reported', 0.4],
      ['disputed', 0.4],
    ])
    const [confirmed, corroborated, reported, disputed] = levels
    expect(new Set(confirmed?.requires.any_source_kind)).toEqual(
      new Set(['official', 'court', 'dataset']),
    )
    expect(corroborated?.requires.min_distinct_publishers).toBe(2)
    expect(new Set(corroborated?.requires.publisher_kinds)).toEqual(new Set(['ngo', 'press']))
    expect(reported?.requires.flagged).toBe(true)
    expect(disputed?.requires.flagged).toBe(true)
    expect(disputed?.requires.both_sides).toBe(true)
  })

  it('decay constants (docs/02 §3, spec §4)', () => {
    const d = need(v1.decay, 'v1.0.0 decay.yaml').value
    expect(d.applies_to).toEqual(['repeatable'])
    expect(d.plateau_days).toBe(365)
    expect(d.end_days).toBe(730)
    // d(730) = 1 − 0.75 · (730 − 365) / 365
    expect(d.end_weight).toBeCloseTo(1 - (0.75 * (730 - 365)) / 365, 12)
    expect(d.before_event).toBe(0)
  })

  it('passivity constants and qualifying list (docs/02 §6, §10, D-11)', () => {
    const p = need(v1.passivity, 'v1.0.0 passivity.yaml').value
    expect(p.points).toBe(15)
    expect(p.window_days).toBe(365)
    expect(p.min_abs_contribution).toBe(2)
    expect(p.statuses).toEqual(['published'])
    expect(p.qualifying_indicators).toEqual([
      ...range('B', 2, 12),
      ...range('C', 1, 6),
      ...range('D', 1, 5),
    ])
    expect(new Set(p.excluded.flatMap((e) => e.indicators))).toEqual(
      new Set(['B1', ...range('A', 1, 8), ...range('E', 1, 3)]),
    )
    expect(p.sensitivity_points).toEqual([5, 15, 25])
  })

  describe('thresholds (docs/02 §5)', () => {
    const formulas = () => need(v1.thresholds, 'v1.0.0 thresholds.yaml').value.formulas
    const tiers = (key: string) => {
      const f = need(formulas()[key], `formula ${key}`)
      if (f.kind === 'sqrt_share') throw new Error(`${key} has no tiers`)
      return {
        kind: f.kind,
        indicator: f.indicator,
        unit: f.unit,
        tiers: f.tiers.map((t) => [t.op, t.value, t.points]),
        otherwise: f.otherwise,
      }
    }

    it('lists exactly a1, a2, a4, c3 and d1', () => {
      expect(Object.keys(formulas()).sort()).toEqual(['a1', 'a2', 'a4', 'c3', 'd1'])
    })

    it('a1: −40 × √s, one decimal, no data before the March 2024 release', () => {
      const f = need(formulas().a1, 'formula a1')
      if (f.kind !== 'sqrt_share') throw new Error('a1 is not sqrt_share')
      expect([f.indicator, f.scale, f.decimals]).toEqual(['A1', -40, 1])
      expect(f.no_data_before.startsWith('2024-03-')).toBe(true)
    })

    it('a2: V ≥ 100 M → −25; ≥ 10 M → −15; ≥ 1 M → −8; ≥ 100 k → −3; else 0', () => {
      expect(tiers('a2')).toEqual({
        kind: 'tiers',
        indicator: 'A2',
        unit: 'usd',
        tiers: [
          ['gte', 100_000_000, -25],
          ['gte', 10_000_000, -15],
          ['gte', 1_000_000, -8],
          ['gte', 100_000, -3],
        ],
        otherwise: 0,
      })
    })

    it('a4: TIV ≥ 500 → −15; ≥ 100 → −10; ≥ 10 → −5; > 0 → −2', () => {
      expect(tiers('a4')).toEqual({
        kind: 'tiers',
        indicator: 'A4',
        unit: 'tiv',
        tiers: [
          ['gte', 500, -15],
          ['gte', 100, -10],
          ['gte', 10, -5],
          ['gt', 0, -2],
        ],
        otherwise: 0,
      })
    })

    it('c3: if r ≥ 0.9 against 2022, T ≥ 10 B → −8; ≥ 1 B → −5; ≥ 100 M → −3; ≥ 10 M → −2', () => {
      const f = need(formulas().c3, 'formula c3')
      if (f.kind !== 'ratio_gated_tiers') throw new Error('c3 is not ratio_gated_tiers')
      expect([f.baseline_year, f.ratio_min]).toEqual([2022, 0.9])
      expect(tiers('c3')).toEqual({
        kind: 'ratio_gated_tiers',
        indicator: 'C3',
        unit: 'usd',
        tiers: [
          ['gte', 10_000_000_000, -8],
          ['gte', 1_000_000_000, -5],
          ['gte', 100_000_000, -3],
          ['gte', 10_000_000, -2],
        ],
        otherwise: 0,
      })
    })

    it('d1: x ≥ 0.0100 % → +12; ≥ 0.0050 % → +9; ≥ 0.0020 % → +6; ≥ 0.0005 % → +3; > 0 → +1', () => {
      expect(tiers('d1')).toEqual({
        kind: 'tiers',
        indicator: 'D1',
        unit: 'percent_of_gni',
        tiers: [
          ['gte', 0.01, 12],
          ['gte', 0.005, 9],
          ['gte', 0.002, 6],
          ['gte', 0.0005, 3],
          ['gt', 0, 1],
        ],
        otherwise: 0,
      })
    })
  })

  it('symmetry table, the 15 rows of docs/02 §13', () => {
    const file = need(v1.symmetry, 'v1.0.0 symmetry.yaml').value
    expect(
      file.pairs.map((p) => [
        p.negative,
        p.negative_label.en,
        p.positive,
        p.positive_label.en,
        p.note?.en ?? null,
      ]),
    ).toEqual([
      [['A1'], 'A1 deliveries', ['A7'], 'A7 embargo', null],
      [['A2'], 'A2 components', ['A6'], 'A6 partial suspension', null],
      [['A3'], 'A3 F-35', ['A6'], 'A6 (halt of F-35 parts)', null],
      [['A4'], 'A4 purchases from Israel', ['A7'], 'A7 (two-way embargo)', null],
      [['A5'], 'A5 cooperation', ['A8'], 'A8 transit denied', null],
      [['B1'], 'B1 no/abstain', ['B1'], 'B1 yes', 'same indicator'],
      [['B2'], 'B2 veto', ['B3'], 'B3 intervention', 'both are legal-institutional acts'],
      [['B4'], 'B4 rejects ICJ', ['B3'], 'B3', null],
      [['B6'], 'B6 refuses ICC', ['B5'], 'B5 executes ICC', null],
      [['B7'], 'B7 sanctions ICC', ['B5'], 'B5', null],
      [['B10'], 'B10 denial', ['B9'], 'B9 naming', null],
      [['C2'], 'C2 new agreement', ['C1'], 'C1 suspension', null],
      [['C3'], 'C3 trade as usual', ['C1', 'C4'], 'C1, C4', null],
      [['D2'], 'D2 UNRWA cut', ['D3'], 'D3 UNRWA restored', null],
      [['E2'], 'E2 protest bans', ['E1'], 'E1 investigations', 'experimental'],
    ])
    expect(file.no_counterpart).toEqual([])
  })
})
