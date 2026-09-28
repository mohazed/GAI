/**
 * The site's own prose (content/*.md) and the reference data of the Data page: both languages
 * parse and have the same structure; the copy rules of docs/05 §7 hold; the standpoint is the
 * specification's text, verbatim; the facts the notes state are those of the repository's data;
 * every endpoint of the API README is documented.
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { STRUCTURED_TABLE_NAMES } from '@gai/schema/structured'
import { describe, expect, it } from 'vitest'
import { excerptJson, excerptLines, STRUCTURED_DOCS } from './api-docs'
import { CONTENT_NAMES, content, contentText } from './content'
import { parseInline, plainInline } from './doc'
import { STANDPOINT } from './standpoint'

const root = path.resolve(import.meta.dirname, '..', '..', '..')

/** Words the site never uses in its own voice (docs/05 §7, CLAUDE.md). */
const BANNED = [
  'we believe',
  'our platform',
  'empower',
  'journey',
  'dive',
  'unlock',
  'seamless',
  'robust',
  'leverage',
  'cutting-edge',
  'game-changing',
  'explore',
  'complicit',
  'guilty',
  'war crime',
  'genocidal',
  'shocking',
  'notably',
]

function prose(name: (typeof CONTENT_NAMES)[number], lang: 'en' | 'fr'): string {
  return content(name, lang)
    .flatMap((b) =>
      b.kind === 'heading' || b.kind === 'paragraph'
        ? [b.text]
        : b.kind === 'list'
          ? b.items
          : b.kind === 'table'
            ? [...b.header, ...b.rows.flat()]
            : [],
    )
    .map((t) => plainInline(parseInline(t)))
    .join('\n')
}

describe('content/*.md', () => {
  for (const name of CONTENT_NAMES) {
    it(`${name}: EN and FR parse, with the same headings, slots and lists`, () => {
      const shape = (lang: 'en' | 'fr') =>
        content(name, lang).map((b) =>
          b.kind === 'heading'
            ? `h${b.level}`
            : b.kind === 'slot'
              ? `slot:${b.name}`
              : b.kind === 'list'
                ? `list:${b.items.length}`
                : b.kind === 'table'
                  ? `table:${b.rows.length}`
                  : b.kind,
        )
      expect(shape('fr')).toEqual(shape('en'))
    })

    it(`${name}: no marketing word, no legal characterisation, no exclamation mark`, () => {
      for (const lang of ['en', 'fr'] as const) {
        const text = prose(name, lang).toLowerCase()
        for (const w of BANNED) expect(text, `${name}.${lang}: ${w}`).not.toContain(w)
        expect(text).not.toContain('!')
      }
    })

    it(`${name}: French typography (guillemets, no-break spaces)`, () => {
      const text = contentText(name, 'fr')
      // Straight double quotes only inside code spans.
      expect(text.replace(/`[^`]*`/g, '')).not.toContain('"')
      expect(text).not.toMatch(/ [:;?!]/)
      // Negative numbers take the minus sign (docs/05 §2).
      expect(text.replace(/`[^`]*`/g, '')).not.toMatch(/(^|\s)-\d/)
    })
  }
})

describe('the standpoint (About page)', () => {
  it('is the specification text, verbatim', () => {
    const spec = readFileSync(
      path.join(root, 'Gaza Accountability Index — Cahier des charges.md'),
      'utf8',
    )
    expect(spec).toContain(`**Standpoint.** ${STANDPOINT.original}`)
    expect(STANDPOINT.author).toBe('Mohamed Zouad')
  })
})

describe('facts stated in content/computed.*.md', () => {
  it('names every country whose latest GNI year in gni.csv is before 2023, with its year', () => {
    const rows = readFileSync(path.join(root, 'data/structured/gni.csv'), 'utf8')
      .trim()
      .split('\n')
      .slice(1)
      .map((l) => l.split(','))
    const latest = new Map<string, number>()
    for (const [iso3, year] of rows)
      latest.set(iso3 as string, Math.max(latest.get(iso3 as string) ?? 0, Number(year)))
    const old = [...latest].filter(([, y]) => y < 2023)
    const names: Record<string, { en: string; fr: string }> = {
      LIE: { en: 'Liechtenstein', fr: 'Liechtenstein' },
      ERI: { en: 'Eritrea', fr: 'Érythrée' },
      SSD: { en: 'South Sudan', fr: 'Soudan du Sud' },
      YEM: { en: 'Yemen', fr: 'Yémen' },
      CUB: { en: 'Cuba', fr: 'Cuba' },
      SYR: { en: 'Syrian Arab Republic', fr: 'République arabe syrienne' },
    }
    expect(old.map(([iso3]) => iso3).sort()).toEqual(Object.keys(names).sort())
    for (const lang of ['en', 'fr'] as const) {
      const text = prose('computed', lang)
      for (const [iso3, year] of old) expect(text).toContain(`${names[iso3]?.[lang]} (${year})`)
    }
    // Monaco has FTS funding and no GNI row (build note `generator`).
    expect(latest.has('MCO')).toBe(false)
  })
})

describe('the Data page reference (lib/api-docs.ts)', () => {
  it('documents every endpoint of the API README and every structured table', () => {
    const readme = readFileSync(path.join(root, 'apps/web/public/api/README.md'), 'utf8')
    const section = readme.slice(readme.indexOf('## 3. Endpoints'), readme.indexOf('### 3.1'))
    const readmePaths = [...section.matchAll(/^\| (`[^|]+) \|/gm)].flatMap((m) =>
      [...(m[1] as string).matchAll(/`([^`]+)`/g)].map((x) => x[1] as string),
    )
    expect(readmePaths.length).toBeGreaterThan(15)
    const src = readFileSync(path.join(import.meta.dirname, 'api-docs.ts'), 'utf8')
    for (const p of readmePaths) {
      const bare = p.replace(/^\./, '')
      expect(src, p).toContain(bare)
    }
    expect(Object.keys(STRUCTURED_DOCS).sort()).toEqual([...STRUCTURED_TABLE_NAMES].sort())
  })

  it('an example says what it left out', () => {
    const ex = excerptJson({ a: [1, 2, 3], b: { c: 'x'.repeat(300) }, d: 1 }, { pick: ['a', 'b'] })
    expect(JSON.parse(ex.text)).toEqual({ a: [1], b: { c: `${'x'.repeat(240)}…` } })
    expect(ex.cuts).toEqual([
      { path: '', shown: 2, total: 3, what: 'keys' },
      { path: 'a', shown: 1, total: 3, what: 'items' },
      { path: 'b.c', shown: 240, total: 300, what: 'characters' },
    ])
    expect(excerptLines('h\n1\n2\n3\n', 3)).toEqual({
      text: 'h\n1\n2',
      cuts: [{ path: '', shown: 3, total: 4, what: 'items' }],
    })
  })
})
