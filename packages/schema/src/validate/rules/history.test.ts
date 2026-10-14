/**
 * Tests for the corrections and history rules (validate/rules/history.ts). The base snapshot is
 * built in memory from the unmodified fixtures (`snapshotOf`), then the working tree is changed
 * one thing at a time; each case checks the rule id, file and record id of the issue.
 */
import { describe, expect, it } from 'vitest'
import type { Issue, RuleId } from '../../issues.js'
import type { Dataset, Located } from '../../load/dataset.js'
import type { BaseSnapshot } from '../../load/git.js'
import type { Methodology } from '../../load/methodology.js'
import { parseYaml } from '../../load/parse.js'
import type { Correction, Event, Lead } from '../../records.js'
import {
  fixtureContext,
  fixtureDataset,
  issuesOf,
  runRules,
  snapshotOf,
} from '../../testing/harness.js'
import { canonicalJson, rules } from './history.js'

type Mutate = (ds: Dataset, m: Methodology) => void

const EVENT_ID = 'evt_2025_08_08_DEU_A6'
const EVENTS_FILE = 'data/events/DEU.yaml'
const CORRECTIONS_FILE = 'data/corrections.yaml'
const CORRECTION_ID = 'cor_20260927_1'
const NEW_ID = 'cor_20260928_1'
const NEXT_ID = 'cor_20260928_2'
const SOURCE_ID = 'src_20251117_bundesregierung_ruestungsexporte-israel-aufhebung'
const SOURCE_FILE = `data/sources/2025/${SOURCE_ID}.yaml`
const REPLY_ID = 'rep_20260927_DEU_1'
const REPLY_FILE = `data/replies/DEU/${REPLY_ID}.yaml`
const LEAD_ID = 'lead_20260901_DEU_1'
const LEADS_FILE = 'data/leads/DEU.yaml'

// ---------------------------------------------------------------------------------------------
// Builders (clones of fixture records, changed in memory only)

/** Base snapshot of the fixtures, optionally changed first (the dataset "as it was"). */
function baseOf(mutate?: (ds: Dataset) => void): BaseSnapshot {
  const ds = fixtureDataset()
  mutate?.(ds)
  return snapshotOf(ds)
}

/** History rules over the fixtures changed by `mutate`, compared with `base`. */
const run = (mutate?: Mutate, base: BaseSnapshot | null = baseOf()): Issue[] =>
  runRules(rules, fixtureContext(mutate, { base }))

const of = (rule: RuleId, mutate?: Mutate, base: BaseSnapshot | null = baseOf()): Issue[] =>
  issuesOf(run(mutate, base), rule)

function event(ds: Dataset): Located<Event> {
  const e = ds.events.find((x) => x.value.id === EVENT_ID)
  if (e === undefined) throw new Error('fixture event missing')
  return e
}

function oldCorrection(ds: Dataset): Located<Correction> {
  const c = ds.corrections.find((x) => x.value.id === CORRECTION_ID)
  if (c === undefined) throw new Error('fixture correction missing')
  return c
}

function correction(overrides: Partial<Correction> = {}): Correction {
  return {
    id: NEW_ID,
    date: '2026-09-28',
    event: EVENT_ID,
    kind: 'correction',
    flagged_by: 'author',
    before: {},
    after: {},
    reason: 'Test correction.',
    ...overrides,
  }
}

function addCorrection(ds: Dataset, overrides: Partial<Correction> = {}, line = 30): void {
  ds.corrections.push({ value: correction(overrides), file: CORRECTIONS_FILE, line })
}

function lead(): Lead {
  return {
    id: LEAD_ID,
    country: 'DEU',
    indicator: 'A3',
    claim: 'Test lead.',
    sources: [{ url: 'https://example.org/test-lead', publisher: 'Example', kind: 'press' }],
    date: '2026-09-01',
    status: 'open',
  }
}

/** The load issues of a file whose YAML does not parse (as loadDataset reports them). */
function syntaxError(file: string): Issue[] {
  const issues = parseYaml('- id: [unclosed\n', file).issues
  if (issues.length === 0) throw new Error('expected a YAML syntax issue')
  return issues
}

/** Removes a one-file record (source, reply) from the working tree: record and file. */
function removeFile(ds: Dataset, file: string): void {
  ds.files = ds.files.filter((f) => f !== file)
}

/** Points 10 → 8 with a matching new correction entry and a revision bump (a valid edit). */
function validPointsEdit(ds: Dataset): void {
  event(ds).value.points = 8
  event(ds).value.revision = 3
  addCorrection(ds, { before: { points: 10 }, after: { points: 8 } })
}

const RETRACTION = {
  kind: 'retraction',
  before: { status: 'published' },
  after: { status: 'retracted' },
} as const satisfies Partial<Correction>

// ---------------------------------------------------------------------------------------------

describe('canonicalJson', () => {
  it('sorts keys at every depth and reads absent values as null', () => {
    expect(canonicalJson({ b: 1, a: { d: [{ y: 1, x: 2 }], c: null } })).toBe(
      '{"a":{"c":null,"d":[{"x":2,"y":1}]},"b":1}',
    )
    expect(canonicalJson(undefined)).toBe('null')
    expect(canonicalJson({ a: undefined })).toBe('{}')
  })
})

describe('the fixtures', () => {
  it('produce no history issue compared with themselves', () => {
    expect(run()).toEqual([])
  })

  it('produce no history issue without a base', () => {
    expect(run(undefined, null)).toEqual([])
  })
})

describe('correction.base-unavailable', () => {
  it('is silent when a base was read', () => {
    const ctx = fixtureContext(undefined, { base: baseOf() })
    ctx.baseError = 'ignored when a base exists'
    expect(issuesOf(runRules(rules, ctx), 'correction.base-unavailable')).toEqual([])
  })

  it('is silent when no comparison was requested (no base, no error)', () => {
    expect(of('correction.base-unavailable', undefined, null)).toEqual([])
  })

  it('warns once, with the reason, when the base could not be read', () => {
    const ctx = fixtureContext((ds) => {
      // Changes that every base-dependent rule would report: none of them may run.
      ds.events = []
      ds.corrections = []
    })
    ctx.baseError = 'not a git work tree, or no commit yet'
    const issues = runRules(rules, ctx)
    const found = issuesOf(issues, 'correction.base-unavailable')
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ level: 'warning', file: CORRECTIONS_FILE, id: '-' })
    expect(found[0]?.message).toContain('not a git work tree, or no commit yet')
    expect(issuesOf(issues, 'correction.never-delete')).toEqual([])
    expect(issuesOf(issues, 'correction.append-only')).toEqual([])
  })
})

describe('correction.never-delete', () => {
  it('accepts the unchanged fixtures and new records', () => {
    expect(of('correction.never-delete')).toEqual([])
    expect(of('correction.never-delete', (ds) => addCorrection(ds))).toEqual([])
  })

  it('reports a deleted event at its base file', () => {
    const found = of('correction.never-delete', (ds) => {
      ds.events = []
    })
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ level: 'error', file: EVENTS_FILE, id: EVENT_ID })
  })

  it('does not report an event that failed its schema or sits in an unparseable file', () => {
    expect(
      of('correction.never-delete', (ds) => {
        ds.events = []
        ds.invalidIds.add(EVENT_ID)
      }),
    ).toEqual([])
    expect(
      of('correction.never-delete', (ds) => {
        ds.events = []
        ds.issues.push(...syntaxError(EVENTS_FILE))
      }),
    ).toEqual([])
  })

  it('reports a deleted source at its documented path', () => {
    const found = of('correction.never-delete', (ds) => {
      ds.sources = ds.sources.filter((s) => s.value.id !== SOURCE_ID)
      removeFile(ds, SOURCE_FILE)
    })
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file: SOURCE_FILE, id: SOURCE_ID })
  })

  it('does not report a source whose file is still there (failed to load)', () => {
    expect(
      of('correction.never-delete', (ds) => {
        ds.sources = ds.sources.filter((s) => s.value.id !== SOURCE_ID)
      }),
    ).toEqual([])
  })

  it('does not report a source whose record failed its schema, whatever its file', () => {
    const invalid = of('correction.never-delete', (ds) => {
      ds.sources = ds.sources.filter((s) => s.value.id !== SOURCE_ID)
      removeFile(ds, SOURCE_FILE)
      ds.invalidIds.add(SOURCE_ID)
      ds.invalid.source.add(SOURCE_ID)
    })
    expect(invalid).toEqual([])
    const otherKind = of('correction.never-delete', (ds) => {
      ds.sources = ds.sources.filter((s) => s.value.id !== SOURCE_ID)
      removeFile(ds, SOURCE_FILE)
      ds.invalidIds.add(SOURCE_ID)
      ds.invalid.archiveIndex.add(SOURCE_ID)
    })
    expect(otherKind.map((i) => [i.file, i.id])).toEqual([[SOURCE_FILE, SOURCE_ID]])
  })

  it('falls back to data/sources when the base id does not parse', () => {
    const base = baseOf()
    base.sourceIds.add('src_not-a-dated-id')
    const found = of('correction.never-delete', undefined, base)
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file: 'data/sources', id: 'src_not-a-dated-id' })
  })

  it('reports a deleted correction entry', () => {
    const found = of('correction.never-delete', (ds) => {
      ds.corrections = []
    })
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file: CORRECTIONS_FILE, id: CORRECTION_ID })
  })

  it('reports a deleted reply', () => {
    const found = of('correction.never-delete', (ds) => {
      ds.replies = []
      removeFile(ds, REPLY_FILE)
    })
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file: REPLY_FILE, id: REPLY_ID })
  })

  it('reports a deleted lead, and accepts a kept one', () => {
    const base = baseOf((ds) => ds.leads.push({ value: lead(), file: LEADS_FILE, line: 1 }))
    expect(
      of(
        'correction.never-delete',
        (ds) => ds.leads.push({ value: lead(), file: LEADS_FILE, line: 1 }),
        base,
      ),
    ).toEqual([])
    const found = of('correction.never-delete', undefined, base)
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file: LEADS_FILE, id: LEAD_ID })
  })
})

describe('correction.status-regression', () => {
  it('accepts a published event that stays published or is retracted', () => {
    expect(of('correction.status-regression')).toEqual([])
    expect(
      of('correction.status-regression', (ds) => {
        event(ds).value.status = 'retracted'
      }),
    ).toEqual([])
  })

  it('reports published → draft and published → reviewed', () => {
    for (const status of ['draft', 'reviewed'] as const) {
      const found = of('correction.status-regression', (ds) => {
        event(ds).value.status = status
      })
      expect(found).toHaveLength(1)
      expect(found[0]).toMatchObject({ level: 'error', file: EVENTS_FILE, id: EVENT_ID })
    }
  })

  it('ignores events that were not published on the base', () => {
    const base = baseOf((ds) => {
      event(ds).value.status = 'reviewed'
    })
    expect(
      of(
        'correction.status-regression',
        (ds) => {
          event(ds).value.status = 'draft'
        },
        base,
      ),
    ).toEqual([])
  })
})

describe('correction.required-on-edit', () => {
  it('accepts the unchanged fixtures and edits to untracked fields', () => {
    expect(of('correction.required-on-edit')).toEqual([])
    expect(
      of('correction.required-on-edit', (ds) => {
        event(ds).value.summary.en = 'The Federal Chancellor stated a test.'
        event(ds).value.points_rationale = 'A reworded rationale.'
      }),
    ).toEqual([])
  })

  it('requires an entry for an end, scope or status change, without a revision bump (B-27)', () => {
    const base = baseOf()
    const edits: [string, Mutate, Partial<Correction>][] = [
      [
        'end',
        (ds) => {
          event(ds).value.end = '2025-12-01'
        },
        { before: { end: '2025-11-24' }, after: { end: '2025-12-01' } },
      ],
      [
        'scope',
        (ds) => {
          event(ds).value.scope = ['gaza', 'region']
        },
        { before: { scope: ['gaza'] }, after: { scope: ['gaza', 'region'] } },
      ],
      [
        'status',
        (ds) => {
          event(ds).value.status = 'superseded'
        },
        { before: { status: 'published' }, after: { status: 'superseded' } },
      ],
    ]
    for (const [field, edit, entry] of edits) {
      const found = of('correction.required-on-edit', edit, base)
      expect(found, field).toHaveLength(1)
      expect(found[0], field).toMatchObject({ level: 'error', file: EVENTS_FILE, id: EVENT_ID })
      expect(found[0]?.message, field).toContain(`${field} changed`)
      const withEntry = of(
        'correction.required-on-edit',
        (ds, m) => {
          edit(ds, m)
          const was = base.events.get(EVENT_ID)?.raw as Record<string, unknown>
          const fixed = { ...entry, before: { [field]: was[field] ?? null } }
          addCorrection(ds, fixed)
        },
        base,
      )
      expect(withEntry, field).toEqual([])
      // An entry that does not record the field is reported at the field.
      const unrecorded = of(
        'correction.required-on-edit',
        (ds, m) => {
          edit(ds, m)
          addCorrection(ds, { before: {}, after: {} })
        },
        base,
      )
      expect(unrecorded, field).toHaveLength(1)
      expect(unrecorded[0], field).toMatchObject({ path: field })
    }
  })

  it('accepts a points change with a new correction entry and a revision bump', () => {
    expect(of('correction.required-on-edit', validPointsEdit)).toEqual([])
    expect(of('correction.kind-consistent', validPointsEdit)).toEqual([])
  })

  it('reports a points change without any new entry', () => {
    const found = of('correction.required-on-edit', (ds) => {
      event(ds).value.points = 8
      event(ds).value.revision = 3
    })
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ level: 'error', file: EVENTS_FILE, id: EVENT_ID })
    expect(found[0]?.message).toContain('no new entry')
  })

  it('reports date, confidence and evidence changes without an entry', () => {
    const edits: Mutate[] = [
      (ds) => {
        event(ds).value.date = '2025-08-09'
      },
      (ds) => {
        event(ds).value.confidence = 'corroborated'
      },
      (ds) => {
        event(ds).value.evidence = event(ds).value.evidence.slice(0, 1)
      },
      (ds) => {
        const first = event(ds).value.evidence[0]
        if (first) first.locator = 'paragraph 7'
      },
    ]
    for (const edit of edits) {
      const found = of('correction.required-on-edit', (ds, m) => {
        edit(ds, m)
        event(ds).value.revision = 3
      })
      expect(found).toHaveLength(1)
      expect(found[0]).toMatchObject({ file: EVENTS_FILE, id: EVENT_ID })
    }
  })

  it('does not count adding or fixing a translation as an evidence change', () => {
    const translations: Mutate[] = [
      (ds) => {
        const first = event(ds).value.evidence[0]
        if (first)
          first.quote_en = 'Under these circumstances, the federal government approves no exports.'
      },
      (ds) => {
        const first = event(ds).value.evidence[0]
        if (first)
          first.quote_fr =
            'Dans ces circonstances, le gouvernement fédéral n’autorise aucune exportation.'
      },
      (ds) => {
        const second = event(ds).value.evidence[1]
        if (second) delete second.quote_en
      },
    ]
    for (const edit of translations) {
      expect(of('correction.required-on-edit', edit)).toEqual([])
    }
  })

  it('still reports an edit to the quote itself, beside a translation edit', () => {
    const found = of('correction.required-on-edit', (ds) => {
      const first = event(ds).value.evidence[0]
      if (first) {
        first.quote = first.quote.replace('Unter diesen Umständen ', '')
        first.quote_en = 'The federal government approves no exports.'
      }
      event(ds).value.revision = 3
    })
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ level: 'error', file: EVENTS_FILE, id: EVENT_ID })
    expect(found[0]?.message).toContain('evidence changed')
  })

  it('compares evidence given in an entry without its translations', () => {
    const found = of('correction.required-on-edit', (ds) => {
      const before = structuredClone(event(ds).value.evidence)
      const first = event(ds).value.evidence[0]
      if (first) first.locator = 'paragraph 7'
      event(ds).value.revision = 3
      const after = structuredClone(event(ds).value.evidence)
      for (const ev of after) ev.quote_en = 'A translation that differs from the event.'
      addCorrection(ds, { before: { evidence: before }, after: { evidence: after } })
    })
    expect(found).toEqual([])
  })

  it('does not count an edit to an entry already on the base', () => {
    const issues = run((ds) => {
      event(ds).value.points = 8
      event(ds).value.revision = 3
      const old = oldCorrection(ds)
      old.value.before = { ...old.value.before, points: 10 }
      old.value.after = { ...old.value.after, points: 8 }
    })
    const found = issuesOf(issues, 'correction.required-on-edit')
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file: EVENTS_FILE, id: EVENT_ID })
    expect(issuesOf(issues, 'correction.append-only')).toHaveLength(1)
  })

  it('reports a new entry whose before.points does not match the base', () => {
    const found = of('correction.required-on-edit', (ds) => {
      validPointsEdit(ds)
      const entry = ds.corrections.find((c) => c.value.id === NEW_ID)
      if (entry) entry.value.before = { points: 5 }
    })
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({
      file: CORRECTIONS_FILE,
      id: NEW_ID,
      line: 30,
      path: 'before.points',
    })
  })

  it('reports a new entry whose after value does not match the working tree', () => {
    const found = of('correction.required-on-edit', (ds) => {
      validPointsEdit(ds)
      const entry = ds.corrections.find((c) => c.value.id === NEW_ID)
      if (entry) entry.value.after = { points: 6 }
    })
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file: CORRECTIONS_FILE, id: NEW_ID, path: 'after.points' })
  })

  it('checks before/after end and date, reading an absent end as null', () => {
    const base = baseOf((ds) => {
      delete event(ds).value.end
    })
    const edit: Mutate = (ds) => {
      event(ds).value.date = '2025-08-09'
      event(ds).value.end = '2025-11-24'
      event(ds).value.revision = 3
      addCorrection(ds, {
        before: { date: '2025-08-08', end: null },
        after: { date: '2025-08-09', end: '2025-11-24' },
      })
    }
    expect(of('correction.required-on-edit', edit, base)).toEqual([])
    const found = of(
      'correction.required-on-edit',
      (ds, m) => {
        edit(ds, m)
        const entry = ds.corrections.find((c) => c.value.id === NEW_ID)
        if (entry) entry.value.after = { date: '2025-08-09', end: '2025-11-23' }
      },
      base,
    )
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file: CORRECTIONS_FILE, id: NEW_ID, path: 'after.end' })
  })

  it('checks the before/after values of an end-only change', () => {
    const found = of('correction.required-on-edit', (ds) => {
      event(ds).value.end = '2025-12-01'
      addCorrection(ds, { before: { end: '2025-11-23' }, after: { end: '2025-12-01' } })
    })
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file: CORRECTIONS_FILE, id: NEW_ID, path: 'before.end' })
  })

  it('reads several new entries as a chain in log order', () => {
    const chain: Mutate = (ds) => {
      event(ds).value.points = 6
      event(ds).value.revision = 4
      addCorrection(ds, { before: { points: 10 }, after: { points: 8 } }, 30)
      addCorrection(ds, { id: NEXT_ID, before: { points: 8 }, after: { points: 6 } }, 40)
    }
    expect(of('correction.required-on-edit', chain)).toEqual([])
    expect(of('correction.kind-consistent', chain)).toEqual([])
  })

  it('reports a new entry that does not record the changed field (before: {} and after: {})', () => {
    const edits: [string, Mutate][] = [
      [
        'evidence',
        (ds) => {
          const first = event(ds).value.evidence[0]
          if (first) first.locator = 'paragraph 7'
        },
      ],
      [
        'evidence',
        (ds) => {
          event(ds).value.evidence = event(ds).value.evidence.slice(0, 1)
        },
      ],
      [
        'confidence',
        (ds) => {
          event(ds).value.confidence = 'disputed'
        },
      ],
      [
        'points',
        (ds) => {
          event(ds).value.points = 8
        },
      ],
    ]
    for (const [field, edit] of edits) {
      const found = of('correction.required-on-edit', (ds, m) => {
        edit(ds, m)
        event(ds).value.revision = 3
        addCorrection(ds)
      })
      expect(found, field).toHaveLength(1)
      expect(found[0]).toMatchObject({ file: EVENTS_FILE, id: EVENT_ID, path: field })
      expect(found[0]?.message).toContain(`before.${field} and after.${field}`)
    }
  })

  it('reports a new entry that records only an unchanged field', () => {
    const found = of('correction.required-on-edit', (ds) => {
      event(ds).value.confidence = 'disputed'
      event(ds).value.revision = 3
      addCorrection(ds, { before: { end: '2025-11-24' }, after: { end: '2025-11-24' } })
    })
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file: EVENTS_FILE, id: EVENT_ID, path: 'confidence' })
  })

  it('accepts an evidence edit whose entry gives the source ids before and after', () => {
    const locator: Mutate = (ds) => {
      const first = event(ds).value.evidence[0]
      if (first) first.locator = 'paragraph 7'
      event(ds).value.revision = 3
      const ids = event(ds).value.evidence.map((e) => e.source)
      addCorrection(ds, { before: { evidence: ids }, after: { evidence: ids } })
    }
    expect(of('correction.required-on-edit', locator)).toEqual([])
    const removed: Mutate = (ds) => {
      const before = event(ds).value.evidence.map((e) => e.source)
      event(ds).value.evidence = event(ds).value.evidence.slice(0, 1)
      event(ds).value.revision = 3
      addCorrection(ds, { before: { evidence: before }, after: { evidence: before.slice(0, 1) } })
    }
    expect(of('correction.required-on-edit', removed)).toEqual([])
  })

  it('accepts an evidence edit whose entry gives the full evidence entries', () => {
    const found = of('correction.required-on-edit', (ds) => {
      const before = structuredClone(event(ds).value.evidence)
      event(ds).value.evidence = event(ds).value.evidence.slice(0, 1)
      event(ds).value.revision = 3
      addCorrection(ds, {
        before: { evidence: before },
        after: { evidence: structuredClone(event(ds).value.evidence) },
      })
    })
    expect(found).toEqual([])
  })

  it('reports before/after evidence that does not match the base or the working tree', () => {
    const found = of('correction.required-on-edit', (ds) => {
      event(ds).value.evidence = event(ds).value.evidence.slice(0, 1)
      event(ds).value.revision = 3
      addCorrection(ds, {
        before: { evidence: ['src_20250101_nonexistent_bogus'] },
        after: { evidence: [] },
      })
    })
    expect(found.map((i) => [i.file, i.id, i.path])).toEqual([
      [CORRECTIONS_FILE, NEW_ID, 'before.evidence'],
      [CORRECTIONS_FILE, NEW_ID, 'after.evidence'],
    ])
  })

  it('reports a change without a revision bump', () => {
    const found = of('correction.required-on-edit', (ds) => {
      validPointsEdit(ds)
      event(ds).value.revision = 2
    })
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({
      file: EVENTS_FILE,
      id: EVENT_ID,
      path: 'revision',
    })
    expect(found[0]?.message).toContain('expected revision 3 or more')
  })

  it('accepts a retraction with a new retraction entry, without a revision bump', () => {
    expect(
      of('correction.required-on-edit', (ds) => {
        event(ds).value.status = 'retracted'
        addCorrection(ds, RETRACTION)
      }),
    ).toEqual([])
  })

  it('reports a retraction without an entry', () => {
    const found = of('correction.required-on-edit', (ds) => {
      event(ds).value.status = 'retracted'
    })
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file: EVENTS_FILE, id: EVENT_ID })
    expect(found[0]?.message).toContain('kind retraction')
  })

  it('reports a retraction logged as a correction, and a correction logged as a retraction', () => {
    const retracted = of('correction.required-on-edit', (ds) => {
      event(ds).value.status = 'retracted'
      addCorrection(ds, { before: { status: 'published' }, after: { status: 'retracted' } })
    })
    expect(retracted).toHaveLength(1)
    expect(retracted[0]).toMatchObject({ file: EVENTS_FILE, id: EVENT_ID })
    expect(retracted[0]?.message).toContain(`${NEW_ID} (correction)`)

    const corrected = of('correction.required-on-edit', (ds) => {
      validPointsEdit(ds)
      const entry = ds.corrections.find((c) => c.value.id === NEW_ID)
      if (entry) entry.value.kind = 'retraction'
    })
    expect(corrected).toHaveLength(1)
    expect(corrected[0]).toMatchObject({ file: EVENTS_FILE, id: EVENT_ID })
    expect(corrected[0]?.message).toContain('expected one of kind correction')
  })

  it('ignores edits to events that were not published on the base, and new events', () => {
    const base = baseOf((ds) => {
      event(ds).value.status = 'reviewed'
    })
    expect(
      of(
        'correction.required-on-edit',
        (ds) => {
          event(ds).value.points = 8
        },
        base,
      ),
    ).toEqual([])
    const empty = baseOf((ds) => {
      ds.events = []
    })
    expect(
      of(
        'correction.required-on-edit',
        (ds) => {
          event(ds).value.points = 8
        },
        empty,
      ),
    ).toEqual([])
  })

  it('compares with the raw base record when it fails the current schema', () => {
    const base = baseOf()
    const rec = base.events.get(EVENT_ID)
    if (rec) rec.value = null
    expect(of('correction.required-on-edit', undefined, base)).toEqual([])
    const found = of(
      'correction.required-on-edit',
      (ds) => {
        event(ds).value.points = 8
        event(ds).value.revision = 3
      },
      base,
    )
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file: EVENTS_FILE, id: EVENT_ID })
  })
})

describe('correction.append-only', () => {
  it('accepts unchanged entries and appended ones', () => {
    expect(of('correction.append-only')).toEqual([])
    expect(of('correction.append-only', validPointsEdit)).toEqual([])
  })

  it('warns when an entry on the base is edited', () => {
    const found = of('correction.append-only', (ds) => {
      oldCorrection(ds).value.reason = 'Test fixture. Edited reason.'
    })
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ level: 'warning', file: CORRECTIONS_FILE, id: CORRECTION_ID })
    expect(found[0]?.message).toContain('reason')
  })

  it('warns when a key is added to an entry on the base', () => {
    const found = of('correction.append-only', (ds) => {
      oldCorrection(ds).value.before = { ...oldCorrection(ds).value.before, points: 10 }
    })
    expect(found).toHaveLength(1)
    expect(found[0]?.message).toContain('before')
  })
})

describe('correction.event-known', () => {
  it('accepts the fixture entry (no base needed)', () => {
    expect(of('correction.event-known', undefined, null)).toEqual([])
  })

  it('reports an entry naming an event that does not exist', () => {
    const found = of(
      'correction.event-known',
      (ds) => {
        oldCorrection(ds).value.event = 'evt_2025_08_08_DEU_A7'
      },
      null,
    )
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ level: 'error', file: CORRECTIONS_FILE, id: CORRECTION_ID })
  })

  it('skips generated events, events that failed their schema and unparseable files', () => {
    expect(
      of(
        'correction.event-known',
        (ds) => addCorrection(ds, { event: 'evt_2025_12_12_DEU_B1_es-10-25' }),
        null,
      ),
    ).toEqual([])
    expect(
      of(
        'correction.event-known',
        (ds) => {
          ds.events = []
          ds.invalidIds.add(EVENT_ID)
        },
        null,
      ),
    ).toEqual([])
    expect(
      of(
        'correction.event-known',
        (ds) => {
          ds.events = []
          ds.issues.push(...syntaxError(EVENTS_FILE))
        },
        null,
      ),
    ).toEqual([])
  })
})

describe('correction.kind-consistent', () => {
  it('accepts the fixtures (revision 2, one correction; no base needed)', () => {
    expect(of('correction.kind-consistent', undefined, null)).toEqual([])
  })

  it('reports a retraction whose event is not retracted', () => {
    const found = of('correction.kind-consistent', (ds) => addCorrection(ds, RETRACTION), null)
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ level: 'error', file: CORRECTIONS_FILE, id: NEW_ID })
  })

  it('accepts a retraction whose event is retracted, without a revision bump', () => {
    expect(
      of(
        'correction.kind-consistent',
        (ds) => {
          event(ds).value.status = 'retracted'
          addCorrection(ds, RETRACTION)
        },
        null,
      ),
    ).toEqual([])
  })

  it('reports an event whose revision was not bumped by each correction', () => {
    const found = of(
      'correction.kind-consistent',
      (ds) => {
        event(ds).value.revision = 1
      },
      null,
    )
    expect(found).toHaveLength(1)
    expect(found[0]).toMatchObject({ file: EVENTS_FILE, id: EVENT_ID, path: 'revision' })

    const two = of('correction.kind-consistent', (ds) => addCorrection(ds), null)
    expect(two).toHaveLength(1)
    expect(two[0]).toMatchObject({ file: EVENTS_FILE, id: EVENT_ID })
    expect(two[0]?.message).toContain('expected revision 3 or more')
  })

  it('leaves entries naming unknown events to correction.event-known', () => {
    expect(
      of(
        'correction.kind-consistent',
        (ds) => addCorrection(ds, { ...RETRACTION, event: 'evt_2025_08_08_DEU_A7' }),
        null,
      ),
    ).toEqual([])
  })
})

describe('events that were public in another status on the base ref', () => {
  const retractedBase = () =>
    baseOf((ds) => {
      event(ds).value.status = 'retracted'
    })

  it('an event still retracted needs no new entry', () => {
    const issues = of(
      'correction.required-on-edit',
      (ds) => {
        event(ds).value.status = 'retracted'
      },
      retractedBase(),
    )
    expect(issues).toEqual([])
  })

  it('leaving retracted without a new entry is an error', () => {
    const issues = of('correction.required-on-edit', undefined, retractedBase())
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({ file: EVENTS_FILE, id: EVENT_ID })
    expect(issues[0]?.message).toContain('status changed from retracted to published')
  })

  it('leaving retracted with a new correction entry passes', () => {
    const issues = of(
      'correction.required-on-edit',
      (ds) =>
        addCorrection(ds, { before: { status: 'retracted' }, after: { status: 'published' } }),
      retractedBase(),
    )
    expect(issues).toEqual([])
  })

  it('a corrected event whose points change needs an entry', () => {
    const base = baseOf((ds) => {
      event(ds).value.status = 'corrected'
    })
    const issues = of(
      'correction.required-on-edit',
      (ds) => {
        event(ds).value.status = 'corrected'
        event(ds).value.points = 25
      },
      base,
    )
    expect(issues.length).toBeGreaterThan(0)
    expect(issues[0]).toMatchObject({ file: EVENTS_FILE, id: EVENT_ID })
  })

  it('a superseded event going back to draft is a status regression', () => {
    const base = baseOf((ds) => {
      event(ds).value.status = 'superseded'
    })
    const issues = of(
      'correction.status-regression',
      (ds) => {
        event(ds).value.status = 'draft'
      },
      base,
    )
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({ file: EVENTS_FILE, id: EVENT_ID })
  })
})
