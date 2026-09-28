/**
 * A reader for the site's long documents: the methodology (`methodology.{en,fr}.md`, served in
 * `methodology/{version}.json`), its changelog, and the prose of the About, Data, Embed and Reply
 * pages (`apps/web/content/*.md`). Like lib/markdown.ts for the monthly reports, it reads a fixed
 * subset of Markdown into blocks that components/DocMarkdown.tsx turns into React elements, never
 * into HTML strings, and refuses anything else, so that a construct it does not know fails the
 * build instead of rendering as stray text.
 *
 * Blocks: `#`–`####` headings; paragraphs (lines joined by a space); `- ` and `1. ` lists, an item
 * continuing on lines indented by two spaces; pipe tables with a `|---|` row; `$$ … $$` display
 * math (rendered by KaTeX at build, lib/math.ts); fenced code (```sh); and one-line HTML comments:
 * `<!-- BEGIN generated:x -->` / `<!-- END generated:x -->` (the methodology's generated blocks,
 * kept as markers), `<!-- slot:x -->` (where a page inserts a component), any other comment is
 * skipped. Inline: `**strong**`, `` `code` ``, `[text](href)` and backslash escapes; a single `*`
 * or `_` used for emphasis is refused.
 */

export type Inline =
  | { t: 'text'; v: string }
  | { t: 'code'; v: string }
  | { t: 'strong'; children: Inline[] }
  | { t: 'link'; href: string; children: Inline[] }

export type Align = 'start' | 'center' | 'end'

export type DocBlock =
  | { kind: 'heading'; level: 1 | 2 | 3 | 4; text: string; id: string }
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; ordered: boolean; start: number; items: string[] }
  | { kind: 'table'; header: string[]; align: Align[]; rows: string[][] }
  | { kind: 'math'; tex: string }
  | { kind: 'code'; lang: string; text: string }
  | { kind: 'slot'; name: string }
  | { kind: 'generated'; name: string; edge: 'begin' | 'end' }

class DocError extends Error {}

function fail(line: number, what: string): never {
  throw new DocError(`document line ${line}: ${what}`)
}

/**
 * Heading anchors: lowercase ASCII words joined by `-`, accents removed (`Événements` →
 * `evenements`), as a reader would type them; a repeated heading gets `-2`, `-3`.
 */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/`/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Splits a table row on the pipes that are neither escaped nor inside a code span. */
function cells(row: string, line: number): string[] {
  const inner = row.trim()
  if (!inner.startsWith('|') || !inner.endsWith('|'))
    fail(line, 'a table row starts and ends with |')
  const out: string[] = []
  let cur = ''
  let code = false
  for (let i = 1; i < inner.length - 1; i++) {
    const ch = inner[i] as string
    if (ch === '\\' && i + 1 < inner.length - 1) {
      cur += ch + (inner[i + 1] as string)
      i++
    } else if (ch === '`') {
      code = !code
      cur += ch
    } else if (ch === '|' && !code) {
      out.push(cur.trim())
      cur = ''
    } else cur += ch
  }
  out.push(cur.trim())
  return out
}

const SEPARATOR = /^\|(\s*:?-{3,}:?\s*\|)+$/
const LIST_ITEM = /^(- |(\d+)\. )/
const BLOCK_START = /^(#{1,4} |\$\$\s*$|```|<!--|\|)/

export function parseDoc(src: string): DocBlock[] {
  const lines = src.replace(/\r\n/g, '\n').split('\n')
  const blocks: DocBlock[] = []
  const ids = new Map<string, number>()
  let i = 0
  while (i < lines.length) {
    const line = lines[i] as string
    const n = i + 1
    if (line.trim() === '') {
      i++
      continue
    }
    const h = /^(#{1,4}) (.+)$/.exec(line)
    if (h !== null) {
      const text = (h[2] as string).trim()
      const base = slugify(text) || 'section'
      const seen = ids.get(base) ?? 0
      ids.set(base, seen + 1)
      blocks.push({
        kind: 'heading',
        level: (h[1] as string).length as 1 | 2 | 3 | 4,
        text,
        id: seen === 0 ? base : `${base}-${seen + 1}`,
      })
      i++
      continue
    }
    if (line.startsWith('<!--')) {
      const c = /^<!--\s*(.*?)\s*-->$/.exec(line.trim())
      if (c === null) fail(n, 'an HTML comment must open and close on one line')
      const body = c[1] as string
      const gen = /^(BEGIN|END) generated:([a-z0-9-]+)$/.exec(body)
      const slot = /^slot:([a-z0-9-]+)$/.exec(body)
      if (gen !== null)
        blocks.push({
          kind: 'generated',
          name: gen[2] as string,
          edge: gen[1] === 'BEGIN' ? 'begin' : 'end',
        })
      else if (slot !== null) blocks.push({ kind: 'slot', name: slot[1] as string })
      i++
      continue
    }
    if (/^\$\$\s*$/.test(line)) {
      const tex: string[] = []
      i++
      while (i < lines.length && !/^\$\$\s*$/.test(lines[i] as string)) {
        tex.push(lines[i] as string)
        i++
      }
      if (i >= lines.length) fail(n, 'display math opened with $$ is not closed')
      blocks.push({ kind: 'math', tex: tex.join('\n') })
      i++
      continue
    }
    const fence = /^```([a-z]*)\s*$/.exec(line)
    if (fence !== null) {
      const text: string[] = []
      i++
      while (i < lines.length && !/^```\s*$/.test(lines[i] as string)) {
        text.push(lines[i] as string)
        i++
      }
      if (i >= lines.length) fail(n, 'a code block opened with ``` is not closed')
      blocks.push({ kind: 'code', lang: fence[1] as string, text: text.join('\n') })
      i++
      continue
    }
    const li = LIST_ITEM.exec(line)
    if (li !== null) {
      const ordered = li[2] !== undefined
      const items: string[] = []
      const start = ordered ? Number(li[2]) : 1
      while (i < lines.length) {
        const l = lines[i] as string
        const m = LIST_ITEM.exec(l)
        if (m !== null && (m[2] !== undefined) === ordered) {
          items.push(l.slice((m[0] as string).length))
          i++
        } else if (/^ {2,}\S/.test(l) && items.length > 0) {
          items[items.length - 1] += ` ${l.trim()}`
          i++
        } else break
      }
      blocks.push({ kind: 'list', ordered, start, items })
      continue
    }
    if (line.startsWith('|')) {
      const header = cells(line, n)
      const sep = lines[i + 1]
      if (sep === undefined || !SEPARATOR.test(sep.trim()))
        fail(n + 1, 'a table needs its |---| row')
      const align = sep
        .trim()
        .slice(1, -1)
        .split('|')
        .map((s): Align => {
          const t = s.trim()
          if (t.startsWith(':') && t.endsWith(':')) return 'center'
          return t.endsWith(':') ? 'end' : 'start'
        })
      if (align.length !== header.length)
        fail(n + 1, `${align.length} alignments, ${header.length} cells`)
      i += 2
      const rows: string[][] = []
      while (i < lines.length && (lines[i] as string).startsWith('|')) {
        const row = cells(lines[i] as string, i + 1)
        if (row.length !== header.length)
          fail(i + 1, `${row.length} cells, ${header.length} expected`)
        rows.push(row)
        i++
      }
      blocks.push({ kind: 'table', header, align, rows })
      continue
    }
    if (/^(>|\s|\* |\+ |={3,}|-{3,}\s*$)/.test(line)) fail(n, `unsupported block: ${line}`)
    const para: string[] = []
    while (i < lines.length) {
      const l = lines[i] as string
      if (l.trim() === '' || BLOCK_START.test(l) || LIST_ITEM.test(l)) break
      para.push(l.trim())
      i++
    }
    blocks.push({ kind: 'paragraph', text: para.join(' ') })
  }
  // Every text of a block must parse as inline markup: check now, so errors carry the source.
  for (const b of blocks) {
    const texts =
      b.kind === 'heading' || b.kind === 'paragraph'
        ? [b.text]
        : b.kind === 'list'
          ? b.items
          : b.kind === 'table'
            ? [...b.header, ...b.rows.flat()]
            : []
    for (const t of texts) parseInline(t)
  }
  return blocks
}

const ESCAPABLE = new Set(['\\', '`', '*', '_', '[', ']', '(', ')', '#', '|', '<', '>', '$', '!'])

/** Inline markup of one block's text. Throws on emphasis it does not support. */
export function parseInline(src: string): Inline[] {
  const out: Inline[] = []
  let text = ''
  const flush = () => {
    if (text !== '') out.push({ t: 'text', v: text })
    text = ''
  }
  let i = 0
  while (i < src.length) {
    const ch = src[i] as string
    if (ch === '\\' && ESCAPABLE.has(src[i + 1] ?? '')) {
      text += src[i + 1]
      i += 2
      continue
    }
    if (ch === '`') {
      const end = src.indexOf('`', i + 1)
      if (end < 0) throw new DocError(`unclosed code span in: ${src}`)
      flush()
      out.push({ t: 'code', v: src.slice(i + 1, end) })
      i = end + 1
      continue
    }
    if (ch === '*' && src[i + 1] === '*') {
      const end = src.indexOf('**', i + 2)
      if (end < 0) throw new DocError(`unclosed ** in: ${src}`)
      flush()
      out.push({ t: 'strong', children: parseInline(src.slice(i + 2, end)) })
      i = end + 2
      continue
    }
    if (ch === '[') {
      const close = src.indexOf('](', i)
      const end = close < 0 ? -1 : src.indexOf(')', close)
      if (close > i && end > close && !src.slice(i + 1, close).includes('[')) {
        const href = src.slice(close + 2, end)
        if (!/^(https?:\/\/|\/|#|mailto:)\S+$/.test(href))
          throw new DocError(`unsupported link target "${href}" in: ${src}`)
        flush()
        out.push({ t: 'link', href, children: parseInline(src.slice(i + 1, close)) })
        i = end + 1
        continue
      }
    }
    if (ch === '*') throw new DocError(`single * (emphasis) is not supported in: ${src}`)
    if (ch === '_' && /[\s(]/.test(src[i - 1] ?? ' ') && /\S/.test(src[i + 1] ?? ' '))
      throw new DocError(`_ emphasis is not supported in: ${src}`)
    text += ch
    i++
  }
  flush()
  return out
}

/** The text of inline markup without its marks (for `aria-label`s, slugs and tests). */
export function plainInline(nodes: readonly Inline[]): string {
  return nodes
    .map((n) => (n.t === 'text' || n.t === 'code' ? n.v : plainInline(n.children)))
    .join('')
}

/**
 * A site path as the static export serves it: `/en/about` → `/en/about/` (the pages are
 * folders), keeping a query or fragment; other targets are returned as written.
 */
export function sitePath(href: string): string {
  const m = /^(\/(?:en|fr)(?:\/[^?#.]*[^/?#.])?)([?#].*)?$/.exec(href)
  if (m === null) return href
  return `${m[1]}/${m[2] ?? ''}`
}
