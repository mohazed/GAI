/**
 * `methodology.docs-generated` (docs/05 §6): marker layout and staleness of the generated blocks
 * of methodology.{en,fr}.md.
 */
import { describe, expect, it } from 'vitest'
import type { Methodology } from '../../load/methodology.js'
import { renderBlock } from '../../methodology/render.js'
import { fixtureContext, issuesOf, runRules } from '../../testing/harness.js'
import { rules } from './docs.js'

const EN = 'methodology/v1.0.0/methodology.en.md'
const FR = 'methodology/v1.0.0/methodology.fr.md'

const begin = (name: string) => `<!-- BEGIN generated:${name} -->`
const end = (name: string) => `<!-- END generated:${name} -->`

/** 1-based line of the first line equal to `line`. */
function lineOf(text: string, line: string): number {
  const i = text.split('\n').indexOf(line)
  if (i < 0) throw new Error(`line not found: ${line}`)
  return i + 1
}

function docText(m: Methodology, lang: 'en' | 'fr'): string {
  const doc = m.docs[lang]
  if (!doc) throw new Error(`methodology.${lang}.md not loaded`)
  return doc.text
}

/** Issues of the rule after editing one document of a fresh context. */
function afterEdit(
  lang: 'en' | 'fr',
  edit: (text: string) => string,
  extra?: (m: Methodology) => void,
) {
  const ctx = fixtureContext((_ds, m) => {
    const doc = m.docs[lang]
    if (!doc) throw new Error(`methodology.${lang}.md not loaded`)
    doc.text = edit(doc.text)
    extra?.(m)
  })
  return {
    issues: issuesOf(runRules(rules, ctx), 'methodology.docs-generated'),
    m: ctx.methodology,
  }
}

describe('methodology.docs-generated', () => {
  it('passes on the repository documents (rendered by pnpm methodology:render)', () => {
    const ctx = fixtureContext()
    expect(issuesOf(runRules(rules, ctx), 'methodology.docs-generated')).toEqual([])
  })

  it('passes when a document is absent (load.missing-file covers it)', () => {
    const ctx = fixtureContext((_ds, m) => {
      m.docs.fr = null
    })
    expect(issuesOf(runRules(rules, ctx), 'methodology.docs-generated')).toEqual([])
  })

  it('reports a block that is stale after a YAML change, in both languages', () => {
    const ctx = fixtureContext((_ds, m) => {
      const a6 = m.indicators.find((i) => i.id === 'A6')
      if (a6?.points.kind !== 'fixed') throw new Error('A6 fixed points expected')
      a6.points.value = 12
    })
    const issues = issuesOf(runRules(rules, ctx), 'methodology.docs-generated')
    const m = ctx.methodology
    expect(issues.map((i) => [i.file, i.id, i.line])).toEqual([
      [EN, 'indicators', lineOf(docText(m, 'en'), begin('indicators'))],
      [FR, 'indicators', lineOf(docText(m, 'fr'), begin('indicators'))],
    ])
    expect(issues[0]?.message).toContain('run pnpm methodology:render')
    expect(issues[0]?.level).toBe('error')
  })

  it('reports hand-edited text inside a block', () => {
    const { issues, m } = afterEdit('en', (t) => t.replace('| Sustaining |', '| Sustain |'))
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({
      rule: 'methodology.docs-generated',
      file: EN,
      id: 'bands',
      line: lineOf(docText(m, 'en'), begin('bands')),
    })
  })

  it('reports a block whose blank lines around the table are missing', () => {
    const table = renderBlock(fixtureContext().methodology, 'categories', 'fr')
    const { issues } = afterEdit('fr', (t) =>
      t.replace(`${begin('categories')}\n\n${table}\n\n`, `${begin('categories')}\n${table}\n`),
    )
    expect(issues.map((i) => [i.file, i.id])).toEqual([[FR, 'categories']])
  })

  it('reports a missing block at line 1', () => {
    const { issues } = afterEdit('en', (t) =>
      t.replace(`${begin('votes')}\n`, '').replace(`${end('votes')}\n`, ''),
    )
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({ file: EN, id: 'votes', line: 1 })
    expect(issues[0]?.message).toContain('is missing')
  })

  it('reports a BEGIN without END and an END without BEGIN', () => {
    const noEnd = afterEdit('en', (t) => t.replace(`${end('decay')}\n`, ''))
    expect(noEnd.issues).toHaveLength(1)
    expect(noEnd.issues[0]).toMatchObject({
      file: EN,
      id: 'decay',
      line: lineOf(docText(noEnd.m, 'en'), begin('decay')),
    })
    const noBegin = afterEdit('fr', (t) => t.replace(`${begin('passivity')}\n`, ''))
    expect(noBegin.issues).toHaveLength(1)
    expect(noBegin.issues[0]).toMatchObject({
      file: FR,
      id: 'passivity',
      line: lineOf(docText(noBegin.m, 'fr'), end('passivity')),
    })
  })

  it('reports a duplicated block at its second marker', () => {
    const table = renderBlock(fixtureContext().methodology, 'bands', 'en')
    const { issues, m } = afterEdit(
      'en',
      (t) => `${t}\n${begin('bands')}\n\n${table}\n\n${end('bands')}\n`,
    )
    const lines = docText(m, 'en').split('\n')
    const secondBegin = lines.lastIndexOf(begin('bands')) + 1
    const secondEnd = lines.lastIndexOf(end('bands')) + 1
    expect(issues.map((i) => [i.file, i.id, i.line])).toEqual([
      [EN, 'bands', secondBegin],
      [EN, 'bands', secondEnd],
    ])
    expect(issues[0]?.message).toContain('appears 2 times')
  })

  it('reports a marker with an unknown block name', () => {
    const { issues, m } = afterEdit('en', (t) => `${t}\n${begin('foo')}\n${end('foo')}\n`)
    const text = docText(m, 'en')
    expect(issues.map((i) => [i.file, i.id, i.line])).toEqual([
      [EN, 'foo', lineOf(text, begin('foo'))],
      [EN, 'foo', lineOf(text, end('foo'))],
    ])
    expect(issues[0]?.message).toContain('names no generated block')
  })

  it('reports END before BEGIN', () => {
    const { issues, m } = afterEdit('en', (t) =>
      t
        .replace(begin('symmetry'), '@@')
        .replace(end('symmetry'), begin('symmetry'))
        .replace('@@', end('symmetry')),
    )
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({
      file: EN,
      id: 'symmetry',
      line: lineOf(docText(m, 'en'), end('symmetry')),
    })
    expect(issues[0]?.message).toContain('comes before')
  })

  it('reports a block that encloses another block', () => {
    const { issues, m } = afterEdit('en', (t) =>
      t
        .replace(`${begin('categories')}\n`, '')
        .replace(`${end('categories')}\n`, '')
        .replace(
          `${end('bands')}\n`,
          `${begin('categories')}\n${end('categories')}\n${end('bands')}\n`,
        ),
    )
    const text = docText(m, 'en')
    const nested = issues.find((i) => i.id === 'bands')
    expect(nested).toMatchObject({ file: EN, line: lineOf(text, begin('bands')) })
    expect(nested?.message).toContain('contains the marker')
    // The inner block is well formed, and empty, hence stale.
    expect(issues.map((i) => i.id).sort()).toEqual(['bands', 'categories'])
  })

  it('reports CRLF line endings once, for the file', () => {
    const { issues } = afterEdit('fr', (t) => t.replace(/\n/g, '\r\n'))
    expect(issues.map((i) => [i.file, i.id, i.line])).toEqual([[FR, '-', 1]])
    expect(issues[0]?.message).toContain('line endings')
  })

  it('skips the staleness check when a methodology YAML did not load, not the marker check', () => {
    const stale = afterEdit(
      'en',
      (t) => t.replace('| Sustaining |', '| Sustain |'),
      (m) => {
        m.bands = null
      },
    )
    expect(stale.issues).toEqual([])
    const broken = afterEdit(
      'en',
      (t) => t.replace(`${end('votes')}\n`, ''),
      (m) => {
        m.thresholds = null
      },
    )
    expect(broken.issues.map((i) => [i.file, i.id])).toEqual([[EN, 'votes']])
  })
})
