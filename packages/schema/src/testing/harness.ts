/**
 * Test helpers: load the fixtures (`fixtures/` at the repository root) and the repository's
 * methodology once, hand out independent deep copies, and run rules against them.
 *
 * Typical use:
 *
 *   const ctx = fixtureContext((ds, m) => { ds.events[0]!.value.points = -3 })
 *   expect(rulesIn(runRules(eventRules, ctx))).toContain('event.points-sign')
 */
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Issue, RuleId } from '../issues.js'
import { type Dataset, loadDataset } from '../load/dataset.js'
import type { BaseRecord, BaseSnapshot } from '../load/git.js'
import { loadMethodology, type Methodology } from '../load/methodology.js'
import type { Correction, Event } from '../records.js'
import { buildContext, type Rule, type ValidationContext } from '../validate/context.js'

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..')
export const FIXTURES_ROOT = join(REPO_ROOT, 'fixtures')

let datasetCache: Dataset | null = null
let methodologyCache: Methodology | null = null

const textOverrides = new WeakMap<Dataset, Map<string, string | undefined>>()

/** A deep copy of a dataset whose archive texts can be overridden with `setArchiveText`. */
export function cloneDataset(ds: Dataset): Dataset {
  const { readArchiveText, ...data } = ds
  const copy = structuredClone(data) as Omit<Dataset, 'readArchiveText'>
  const overrides = new Map<string, string | undefined>()
  const clone: Dataset = {
    ...copy,
    readArchiveText: (id: string) => (overrides.has(id) ? overrides.get(id) : readArchiveText(id)),
  }
  textOverrides.set(clone, overrides)
  return clone
}

/** Replaces (or removes, with undefined) archive/text/{id}.txt in a cloned dataset. */
export function setArchiveText(ds: Dataset, sourceId: string, text: string | undefined): void {
  const overrides = textOverrides.get(ds)
  if (!overrides) throw new Error('setArchiveText needs a dataset from cloneDataset/fixtureDataset')
  overrides.set(sourceId, text)
  if (text === undefined) ds.archiveTextIds.delete(sourceId)
  else ds.archiveTextIds.add(sourceId)
}

/** A fresh deep copy of the fixture dataset (`fixtures/data`, `fixtures/archive`). */
export function fixtureDataset(): Dataset {
  datasetCache ??= loadDataset(FIXTURES_ROOT)
  return cloneDataset(datasetCache)
}

/** A fresh deep copy of the repository's current methodology. */
export function repoMethodology(): Methodology {
  methodologyCache ??= loadMethodology(REPO_ROOT)
  return structuredClone(methodologyCache)
}

/** In-memory base snapshot of a dataset, as `loadBaseSnapshot` would read it from git. */
export function snapshotOf(ds: Dataset, ref = 'base'): BaseSnapshot {
  const events = new Map<string, BaseRecord<Event>>()
  for (const e of ds.events) {
    events.set(e.value.id, {
      raw: structuredClone(e.value) as unknown as Record<string, unknown>,
      value: structuredClone(e.value),
      file: e.file,
    })
  }
  const corrections = new Map<string, BaseRecord<Correction>>()
  for (const c of ds.corrections) {
    corrections.set(c.value.id, {
      raw: structuredClone(c.value) as unknown as Record<string, unknown>,
      value: structuredClone(c.value),
      file: c.file,
    })
  }
  return {
    ref,
    commit: '0'.repeat(40),
    events,
    corrections,
    sourceIds: new Set(ds.sources.map((s) => s.value.id)),
    replyIds: new Set(ds.replies.map((r) => r.value.id)),
    leadIds: new Set(ds.leads.map((l) => l.value.id)),
  }
}

export interface FixtureContextOptions {
  /** Base snapshot for the history rules; defaults to none. */
  base?: BaseSnapshot | null
}

/**
 * A validation context over fresh copies of the fixtures and the methodology. `mutate` runs
 * before the indexes are built, so edits are visible to every rule.
 */
export function fixtureContext(
  mutate?: (ds: Dataset, m: Methodology) => void,
  options: FixtureContextOptions = {},
): ValidationContext {
  const ds = fixtureDataset()
  const m = repoMethodology()
  mutate?.(ds, m)
  if (mutate) {
    m.indicatorById = new Map(m.indicators.map((i) => [i.id, i]))
    m.version = m.indicatorsFile?.value.version ?? m.version
  }
  return buildContext(ds, m, options.base ?? null)
}

/** Runs one rule or a list of rules. */
export function runRules(rules: Rule | Rule[], ctx: ValidationContext): Issue[] {
  return (Array.isArray(rules) ? rules : [rules]).flatMap((r) => r(ctx))
}

/** The distinct rule ids among `issues`. */
export function rulesIn(issues: Issue[]): RuleId[] {
  return [...new Set(issues.map((i) => i.rule))]
}

/** Issues of one rule. */
export function issuesOf(issues: Issue[], rule: RuleId): Issue[] {
  return issues.filter((i) => i.rule === rule)
}

/** A deep copy of the first fixture event, for building extra events in tests. */
export function cloneEvent(ds: Dataset, index = 0): Event {
  const e = ds.events[index]
  if (!e) throw new Error(`fixture event #${index} missing`)
  return structuredClone(e.value)
}
