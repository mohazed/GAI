/**
 * A reader for the Markdown of the monthly reports (packages/pipeline/src/build/report.ts), so
 * that the site renders them at /changes/{YYYY-MM}/ (P-09) as React elements, without a Markdown
 * library and without HTML strings (the CSP allows no inline style, and nothing here is ever
 * injected as HTML). It reads exactly what the report writes: `#`, `##` and `###` headings,
 * paragraphs, `- ` lists, pipe tables with a `|---|---:|` alignment row, and backslash escapes of
 * the characters report.ts escapes in data text. Anything else is refused, so that a change of the
 * report's format fails the build instead of rendering as stray text.
 */

export type Align = 'start' | 'end'

export type Block =
  | { kind: 'heading'; level: 1 | 2 | 3; text: string }
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'table'; header: string[]; align: Align[]; rows: string[][] }

const ESCAPED = /\\([\\`*_[\]<>|])/g
/**
 * Markup the reports never write unescaped: emphasis with `*`, code, links, HTML. An unescaped `_`
 * is allowed: the correction lines carry event ids (`evt_2025_08_08_…`), in which Markdown reads
 * underscores inside a word as text.
 */
const MARKUP = /(^|[^\\])[`*[\]<>]/

function text(raw: string, line: number): string {
  if (MARKUP.test(raw)) throw new Error(`markdown line ${line}: unsupported inline markup: ${raw}`)
  return raw.replace(ESCAPED, '$1')
}

/** Splits a table row on the pipes that are not escaped. */
function cells(row: string, line: number): string[] {
  const inner = row.trim()
  if (!inner.startsWith('|') || !inner.endsWith('|') || inner.endsWith('\\|'))
    throw new Error(`markdown line ${line}: a table row starts and ends with |`)
  const out: string[] = []
  let cur = ''
  for (let i = 1; i < inner.length - 1; i++) {
    const ch = inner[i] as string
    if (ch === '\\' && i + 1 < inner.length - 1) {
      cur += ch + (inner[i + 1] as string)
      i++
    } else if (ch === '|') {
      out.push(cur)
      cur = ''
    } else cur += ch
  }
  out.push(cur)
  return out.map((c) => text(c.trim(), line))
}

export function parseMarkdown(src: string): Block[] {
  const lines = src.replace(/\r\n/g, '\n').split('\n')
  const blocks: Block[] = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i] as string
    const n = i + 1
    if (line.trim() === '') {
      i++
      continue
    }
    const h = /^(#{1,3}) (.+)$/.exec(line)
    if (h !== null) {
      blocks.push({
        kind: 'heading',
        level: (h[1] as string).length as 1 | 2 | 3,
        text: text(h[2] as string, n),
      })
      i++
      continue
    }
    if (line.startsWith('- ')) {
      const items: string[] = []
      while (i < lines.length && (lines[i] as string).startsWith('- ')) {
        items.push(text((lines[i] as string).slice(2), i + 1))
        i++
      }
      blocks.push({ kind: 'list', items })
      continue
    }
    if (line.startsWith('|')) {
      const header = cells(line, n)
      const sep = lines[i + 1]
      if (sep === undefined || !/^\|(\s*-{3,}:?\s*\|)+$/.test(sep))
        throw new Error(`markdown line ${n + 1}: a table needs its |---| alignment row`)
      const align = sep
        .slice(1, -1)
        .split('|')
        .map((s): Align => (s.trim().endsWith(':') ? 'end' : 'start'))
      if (align.length !== header.length)
        throw new Error(
          `markdown line ${n + 1}: ${align.length} alignments, ${header.length} cells`,
        )
      i += 2
      const rows: string[][] = []
      while (i < lines.length && (lines[i] as string).startsWith('|')) {
        const row = cells(lines[i] as string, i + 1)
        if (row.length !== header.length)
          throw new Error(`markdown line ${i + 1}: ${row.length} cells, ${header.length} expected`)
        rows.push(row)
        i++
      }
      blocks.push({ kind: 'table', header, align, rows })
      continue
    }
    if (/^(#|>|\s|\d+\. |\* |\+ |```)/.test(line))
      throw new Error(`markdown line ${n}: unsupported block: ${line}`)
    const para: string[] = []
    while (i < lines.length) {
      const l = lines[i] as string
      if (l.trim() === '' || /^(#{1,3} |- |\|)/.test(l)) break
      para.push(text(l, i + 1))
      i++
    }
    blocks.push({ kind: 'paragraph', text: para.join(' ') })
  }
  return blocks
}
