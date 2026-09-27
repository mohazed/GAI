/**
 * YAML and CSV parsing with line numbers, reporting syntax errors as issues.
 */
import { parse as parseCsvSync } from 'csv-parse/sync'
import { isMap, isSeq, LineCounter, parseDocument } from 'yaml'
import { type Issue, issue } from '../issues.js'

export interface ParsedYaml {
  /** The document as plain JS (YAML 1.2 core schema: dates stay strings). */
  value: unknown
  /** For a top-level sequence: the 1-based line of each item. */
  itemLines: (number | undefined)[]
  /** For a top-level mapping: the 1-based line of each key. */
  keyLines: Map<string, number>
  issues: Issue[]
  ok: boolean
}

export function parseYaml(text: string, file: string): ParsedYaml {
  const lineCounter = new LineCounter()
  const doc = parseDocument(text, {
    lineCounter,
    prettyErrors: false,
    uniqueKeys: true,
    version: '1.2',
    schema: 'core',
  })
  const issues: Issue[] = []
  for (const err of doc.errors) {
    const line = lineCounter.linePos(err.pos[0]).line
    issues.push(issue('load.yaml-syntax', { file, line }, err.message.split('\n')[0] ?? err.code))
  }
  const itemLines: (number | undefined)[] = []
  const keyLines = new Map<string, number>()
  if (issues.length > 0) return { value: undefined, itemLines, keyLines, issues, ok: false }
  const contents = doc.contents
  if (isSeq(contents)) {
    for (const item of contents.items) {
      const range = (item as { range?: [number, number, number] } | null)?.range
      itemLines.push(range ? lineCounter.linePos(range[0]).line : undefined)
    }
  } else if (isMap(contents)) {
    for (const pair of contents.items) {
      const key = pair.key as { value?: unknown; range?: [number, number, number] } | null
      if (key && typeof key.value === 'string' && key.range) {
        keyLines.set(key.value, lineCounter.linePos(key.range[0]).line)
      }
    }
  }
  let value: unknown
  try {
    value = doc.toJS({ maxAliasCount: 100 })
  } catch (err) {
    issues.push(issue('load.yaml-syntax', { file }, (err as Error).message))
    return { value: undefined, itemLines, keyLines, issues, ok: false }
  }
  return { value, itemLines, keyLines, issues, ok: true }
}

export interface ParsedCsv {
  header: string[]
  /** Rows keyed by header column, with the 1-based line where each row starts. */
  rows: { record: Record<string, string>; line: number }[]
  issues: Issue[]
  ok: boolean
}

/**
 * The 1-based line on which each non-empty record starts, found by a scan that follows quoted
 * fields. csv-parse's `info.lines` gives the line where a record ends, and it counts a CRLF
 * inside a quoted field as two lines, so it cannot be used for start lines.
 */
function recordStartLines(text: string): number[] {
  const starts: number[] = []
  let line = 1
  let inQuotes = false
  let atLineStart = true
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (atLineStart && !inQuotes) {
      if (ch === '\n') {
        line++
        continue
      }
      if ((ch === '\r' && text[i + 1] === '\n') || (ch === '\uFEFF' && i === 0)) continue
      starts.push(line)
      atLineStart = false
    }
    if (ch === '"') inQuotes = !inQuotes
    else if (ch === '\n') {
      line++
      if (!inQuotes) atLineStart = true
    }
  }
  return starts
}

/**
 * Parses a CSV with a header row. When `columns` is given, the header must equal it exactly
 * (same names, same order).
 */
export function parseCsv(text: string, file: string, columns?: readonly string[]): ParsedCsv {
  let records: { record: string[]; info: { lines: number } }[]
  try {
    records = parseCsvSync(text, {
      bom: true,
      info: true,
      skip_empty_lines: true,
      relax_column_count: false,
    }) as unknown as { record: string[]; info: { lines: number } }[]
  } catch (err) {
    const e = err as Error & { lines?: number }
    return {
      header: [],
      rows: [],
      issues: [issue('load.csv-syntax', { file, line: e.lines }, e.message)],
      ok: false,
    }
  }
  const [head, ...body] = records
  if (!head) {
    return {
      header: [],
      rows: [],
      issues: [issue('load.csv-syntax', { file, line: 1 }, 'missing header row')],
      ok: false,
    }
  }
  const starts = recordStartLines(text)
  const header = head.record
  if (columns && (header.length !== columns.length || header.some((h, i) => h !== columns[i]))) {
    return {
      header,
      rows: [],
      issues: [
        issue(
          'load.csv-syntax',
          { file, line: starts[0] ?? 1 },
          `header is "${header.join(',')}", expected "${columns.join(',')}"`,
        ),
      ],
      ok: false,
    }
  }
  const rows = body.map(({ record, info }, i) => {
    const obj: Record<string, string> = {}
    header.forEach((h, k) => {
      obj[h] = record[k] ?? ''
    })
    // Fall back to the end line should the scan and the parser ever disagree.
    return { record: obj, line: starts[i + 1] ?? info.lines }
  })
  return { header, rows, issues: [], ok: true }
}
