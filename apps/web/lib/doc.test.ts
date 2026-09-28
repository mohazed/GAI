import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { parseDoc, parseInline, plainInline, sitePath, slugify } from './doc'
import { renderMath } from './math'

const root = path.resolve(import.meta.dirname, '..', '..', '..')

describe('parseDoc (lib/doc.ts)', () => {
  it('reads headings with anchors, paragraphs, lists with continued items, tables', () => {
    const blocks = parseDoc(
      [
        '# Title',
        '',
        'One line',
        'and the next.',
        '',
        '## Scope: Gaza',
        '',
        '- first item',
        '  continued',
        '- second',
        '',
        '1. one',
        '2. two',
        '',
        '| A | B |',
        '|---|---:|',
        '| x | `a|b` |',
        '',
        '## Scope: Gaza',
      ].join('\n'),
    )
    expect(blocks).toEqual([
      { kind: 'heading', level: 1, text: 'Title', id: 'title' },
      { kind: 'paragraph', text: 'One line and the next.' },
      { kind: 'heading', level: 2, text: 'Scope: Gaza', id: 'scope-gaza' },
      { kind: 'list', ordered: false, start: 1, items: ['first item continued', 'second'] },
      { kind: 'list', ordered: true, start: 1, items: ['one', 'two'] },
      { kind: 'table', header: ['A', 'B'], align: ['start', 'end'], rows: [['x', '`a|b`']] },
      { kind: 'heading', level: 2, text: 'Scope: Gaza', id: 'scope-gaza-2' },
    ])
  })

  it('reads display math, code, generated markers and slots; skips other comments', () => {
    const blocks = parseDoc(
      [
        '$$',
        'S = \\mathrm{clip}(x)',
        '$$',
        '```sh',
        'pnpm build:data',
        '```',
        '<!-- BEGIN generated:votes -->',
        '<!-- a note -->',
        '<!-- END generated:votes -->',
        '<!-- slot:downloads -->',
      ].join('\n'),
    )
    expect(blocks).toEqual([
      { kind: 'math', tex: 'S = \\mathrm{clip}(x)' },
      { kind: 'code', lang: 'sh', text: 'pnpm build:data' },
      { kind: 'generated', name: 'votes', edge: 'begin' },
      { kind: 'generated', name: 'votes', edge: 'end' },
      { kind: 'slot', name: 'downloads' },
    ])
  })

  it('refuses what it does not know, so that a format change fails the build', () => {
    expect(() => parseDoc('> a quote')).toThrow(/unsupported block/)
    expect(() => parseDoc('* star list')).toThrow(/unsupported block/)
    expect(() => parseDoc('$$\nx')).toThrow(/not closed/)
    expect(() => parseDoc('| a |\n| b |')).toThrow(/\|---\|/)
    expect(() => parseDoc('a *word* here')).toThrow(/emphasis/)
    expect(() => parseDoc('an _emphasis_ here')).toThrow(/emphasis/)
    expect(() => parseDoc('[x](javascript:alert(1))')).toThrow(/link target/)
  })

  it('inline: strong, code, links, escapes; underscores inside words are text', () => {
    const nodes = parseInline('**A1** uses `s = 0` and [About](/en/about); E_k(c) \\* 2')
    expect(nodes).toEqual([
      { t: 'strong', children: [{ t: 'text', v: 'A1' }] },
      { t: 'text', v: ' uses ' },
      { t: 'code', v: 's = 0' },
      { t: 'text', v: ' and ' },
      { t: 'link', href: '/en/about', children: [{ t: 'text', v: 'About' }] },
      { t: 'text', v: '; E_k(c) * 2' },
    ])
    expect(plainInline(nodes)).toBe('A1 uses s = 0 and About; E_k(c) * 2')
  })

  it('slugs and site paths', () => {
    expect(slugify('Types d’événements et décroissance')).toBe('types-d-evenements-et-decroissance')
    expect(slugify('A. Arms & military (cap −45 / +30)')).toBe('a-arms-military-cap-45-30')
    expect(sitePath('/en/about')).toBe('/en/about/')
    expect(sitePath('/fr/methodology#x')).toBe('/fr/methodology/#x')
    expect(sitePath('/en/data/')).toBe('/en/data/')
    expect(sitePath('/api/v1/countries.json')).toBe('/api/v1/countries.json')
    expect(sitePath('https://example.org/a')).toBe('https://example.org/a')
  })
})

describe('the methodology documents and the changelog', () => {
  const files = [
    'methodology/v1.0.0/methodology.en.md',
    'methodology/v1.0.0/methodology.fr.md',
    'methodology/CHANGELOG.md',
  ]
  for (const f of files) {
    it(`${f} parses`, () => {
      const blocks = parseDoc(readFileSync(path.join(root, f), 'utf8'))
      expect(blocks.length).toBeGreaterThan(3)
    })
  }

  it('EN and FR have the same structure: headings, tables, math, generated blocks', () => {
    const shape = (lang: string) =>
      parseDoc(readFileSync(path.join(root, `methodology/v1.0.0/methodology.${lang}.md`), 'utf8'))
        .map((b) => (b.kind === 'heading' ? `h${b.level}` : b.kind))
        .join(' ')
    expect(shape('fr')).toBe(shape('en'))
  })

  it('every formula renders to MathML with its source and no style attribute', () => {
    for (const lang of ['en', 'fr']) {
      const blocks = parseDoc(
        readFileSync(path.join(root, `methodology/v1.0.0/methodology.${lang}.md`), 'utf8'),
      )
      const math = blocks.filter((b) => b.kind === 'math')
      expect(math.length).toBe(3)
      for (const b of math) {
        if (b.kind !== 'math') continue
        const html = renderMath(b.tex)
        expect(html).toContain('<math')
        expect(html).toContain('application/x-tex')
        expect(html).not.toMatch(/\sstyle=/)
      }
    }
    expect(() => renderMath('\\notacommand')).toThrow()
  })
})
