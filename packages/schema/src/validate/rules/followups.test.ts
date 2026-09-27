/**
 * Cases added while integrating the rule modules: links to generated events, sources kept alive
 * by the corrections log, malformed index rows, promoted leads, the evidence-rule list of the
 * methodology page, and version folders.
 */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import type { Dataset } from '../../load/dataset.js'
import { listMethodologyVersions } from '../../load/methodology.js'
import { renderBlock } from '../../methodology/render.js'
import { Lead } from '../../records.js'
import {
  cloneEvent,
  fixtureContext,
  issuesOf,
  repoMethodology,
  runRules,
} from '../../testing/harness.js'
import { rules as eventRules } from './events.js'
import { rules as sourceRules } from './sources.js'

const SOURCE_2 = 'src_20251117_bundesregierung_ruestungsexporte-israel-aufhebung'

describe('event.references and generated events', () => {
  it('accepts a related link to a generated event, which exists only in build outputs', () => {
    const ctx = fixtureContext((ds) => {
      const e = ds.events[0]
      if (e) e.value.related = ['evt_2023_10_27_DEU_B1_es-10-21']
    })
    expect(issuesOf(runRules(eventRules, ctx), 'event.references')).toEqual([])
  })

  it('still rejects a related link to a missing hand-authored event', () => {
    const ctx = fixtureContext((ds) => {
      const e = ds.events[0]
      if (e) e.value.related = ['evt_2023_10_27_DEU_B4']
    })
    const issues = issuesOf(runRules(eventRules, ctx), 'event.references')
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({ file: 'data/events/DEU.yaml', id: 'evt_2025_08_08_DEU_A6' })
  })
})

describe('source.orphan and the corrections log', () => {
  const dropSecondEvidence = (ds: Dataset) => {
    const e = ds.events[0]
    if (e) e.value.evidence = e.value.evidence.filter((ev) => ev.source !== SOURCE_2)
  }

  it('a source removed from an event but named in a correction is not an orphan', () => {
    const ctx = fixtureContext(dropSecondEvidence)
    expect(issuesOf(runRules(sourceRules, ctx), 'source.orphan')).toEqual([])
  })

  it('the same source is an orphan once no correction names it either', () => {
    const ctx = fixtureContext((ds) => {
      dropSecondEvidence(ds)
      for (const c of ds.corrections) {
        c.value.before = {}
        c.value.after = {}
      }
    })
    const issues = issuesOf(runRules(sourceRules, ctx), 'source.orphan')
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({ id: SOURCE_2 })
  })
})

describe('source.archive-index and malformed index rows', () => {
  it('does not also warn about a missing row when the row failed its schema', () => {
    const ctx = fixtureContext((ds) => {
      ds.archiveIndex = ds.archiveIndex.filter((r) => r.value.src_id !== SOURCE_2)
      ds.invalidIds.add(SOURCE_2)
      ds.invalid.archiveIndex.add(SOURCE_2)
    })
    const issues = issuesOf(runRules(sourceRules, ctx), 'source.archive-index')
    expect(issues).toEqual([])
  })

  it('reports a missing row otherwise: an error for a source of a published event', () => {
    const ctx = fixtureContext((ds) => {
      ds.archiveIndex = ds.archiveIndex.filter((r) => r.value.src_id !== SOURCE_2)
    })
    const issues = issuesOf(runRules(sourceRules, ctx), 'source.archive-index')
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({ level: 'error', id: SOURCE_2 })
  })

  it('and a warning for a source that supports nothing public yet', () => {
    const ctx = fixtureContext((ds) => {
      for (const e of ds.events) e.value.status = 'draft'
      ds.archiveIndex = ds.archiveIndex.filter((r) => r.value.src_id !== SOURCE_2)
    })
    const issues = issuesOf(runRules(sourceRules, ctx), 'source.archive-index')
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({ level: 'warning', id: SOURCE_2 })
  })
})

describe('Lead status schema', () => {
  const lead = {
    id: 'lead_20260901_DEU_1',
    country: 'DEU',
    indicator: 'A3',
    claim: 'Test lead.',
    sources: [{ url: 'https://example.org/lead', publisher: 'Example', kind: 'press' }],
    date: '2026-09-01',
  }

  it('accepts open, dropped and promoted to an event id', () => {
    for (const status of ['open', 'dropped', 'promoted:evt_2025_08_08_DEU_A6']) {
      expect(Lead.safeParse({ ...lead, status }).success).toBe(true)
    }
  })

  it('rejects promoted to something that is not an event id', () => {
    expect(Lead.safeParse({ ...lead, status: 'promoted:evt_x' }).success).toBe(false)
  })
})

describe('methodology page: evidence rules under each category table', () => {
  it('lists every indicator evidence rule in both languages', () => {
    const m = repoMethodology()
    const en = renderBlock(m, 'indicators', 'en')
    const fr = renderBlock(m, 'indicators', 'fr')
    expect(en.match(/^\*\*Evidence rules\*\*$/gm)).toHaveLength(5)
    expect(fr.match(/^\*\*Règles de preuve\*\*$/gm)).toHaveLength(5)
    for (const ind of m.indicators) {
      expect(en).toContain(`- **${ind.id}** — `)
      expect(fr).toContain(`- **${ind.id}** — `)
    }
  })
})

describe('listMethodologyVersions', () => {
  it('ignores a file named like a version folder', () => {
    const root = mkdtempSync(join(tmpdir(), 'gai-versions-'))
    try {
      mkdirSync(join(root, 'methodology', 'v1.0.0'), { recursive: true })
      writeFileSync(join(root, 'methodology', 'v1.1.0'), 'not a folder')
      expect(listMethodologyVersions(root)).toEqual(['v1.0.0'])
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })
})

describe('cloneEvent', () => {
  it('returns an independent copy', () => {
    const ctx = fixtureContext()
    const copy = cloneEvent(ctx.dataset)
    copy.points = 99
    expect(ctx.dataset.events[0]?.value.points).toBe(10)
  })
})
