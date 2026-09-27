/**
 * YAML and CSV parsing with line numbers, reporting syntax errors as issues, and strict UTF-8
 * decoding (docs/03 §1, §7: the data files are UTF-8).
 */
import { isUtf8 } from 'node:buffer'
import { parse as parseCsvSync } from 'csv-parse/sync'
import { isMap, isSeq, LineCounter, parseDocument } from 'yaml'
import { type Issue, issue } from '../issues.js'

/** Length of the valid UTF-8 sequence starting at `i`, or 0 when the byte there is invalid. */
function utf8SequenceLength(bytes: Uint8Array, i: number): number {
  const b0 = bytes[i] ?? 0
  const cont = (k: number, lo = 0x80, hi = 0xbf) => {
    const b = bytes[i + k]
    return b !== undefined && b >= lo && b <= hi
  }
  if (b0 <= 0x7f) return 1
  if (b0 >= 0xc2 && b0 <= 0xdf) return cont(1) ? 2 : 0
  if (b0 >= 0xe0 && b0 <= 0xef) {
    const lo = b0 === 0xe0 ? 0xa0 : 0x80
    const hi = b0 === 0xed ? 0x9f : 0xbf
    return cont(1, lo, hi) && cont(2) ? 3 : 0
  }
  if (b0 >= 0xf0 && b0 <= 0xf4) {
    const lo = b0 === 0xf0 ? 0x90 : 0x80
    const hi = b0 === 0xf4 ? 0x8f : 0xbf
    return cont(1, lo, hi) && cont(2) && cont(3) ? 4 : 0
  }
  return 0
}

/** Byte offset and 1-based line of the first invalid UTF-8 byte, or null when all are valid. */
export function firstInvalidUtf8(bytes: Uint8Array): { offset: number; line: number } | null {
  let line = 1
  for (let i = 0; i < bytes.length; ) {
    const n = utf8SequenceLength(bytes, i)
    if (n === 0) return { offset: i, line }
    if (bytes[i] === 0x0a) line++
    i += n
  }
  return null
}

/**
 * Decodes UTF-8. Invalid byte sequences are reported as one `load.encoding` issue at the line of
 * the first one; the text is still returned (with U+FFFD in their place) so that the rest of the
 * file can be checked.
 */
export function decodeUtf8(bytes: Uint8Array, file: string): { text: string; issues: Issue[] } {
  const text = Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString('utf8')
  if (isUtf8(bytes)) return { text, issues: [] }
  const bad = firstInvalidUtf8(bytes)
  const at = bad ?? { offset: 0, line: 1 }
  const byte = (bytes[at.offset] ?? 0).toString(16).toUpperCase().padStart(2, '0')
  return {
    text,
    issues: [
      issue(
        'load.encoding',
        { file, line: at.line },
        `not valid UTF-8: byte 0x${byte} at byte offset ${at.offset} is not part of a UTF-8 character; expected the file saved as UTF-8`,
      ),
    ],
  }
}

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

/**
 * One issue per file: the first syntax error in document order. After one error the parser
 * usually reports a cascade (a single tab can yield a hundred token errors), so the rest are only
 * counted. A tab in the indentation of the error line is named as the cause.
 */
function firstYamlError(
  text: string,
  file: string,
  errors: readonly { code: string; message: string; pos: [number, number] }[],
  lineCounter: LineCounter,
): Issue {
  const sorted = [...errors].sort((a, b) => a.pos[0] - b.pos[0])
  const first = sorted[0] as (typeof sorted)[number]
  const line = lineCounter.linePos(first.pos[0]).line
  const start = lineCounter.lineStarts[line - 1] ?? 0
  const end = text.indexOf('\n', start)
  const lineText = text.slice(start, end === -1 ? undefined : end)
  const tab = first.code === 'TAB_AS_INDENT' || /^[ ]*\t/.test(lineText)
  let message = tab
    ? 'tabs are not allowed for indentation; indent with spaces'
    : (first.message.split('\n')[0] ?? first.code)
  const more = sorted.length - 1
  if (more > 0) {
    message += ` (${more} further syntax error${more === 1 ? '' : 's'} in this file not listed; they often follow from this one)`
  }
  return issue('load.yaml-syntax', { file, line }, message)
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
  const itemLines: (number | undefined)[] = []
  const keyLines = new Map<string, number>()
  if (doc.errors.length > 0) {
    issues.push(firstYamlError(text, file, doc.errors, lineCounter))
    return { value: undefined, itemLines, keyLines, issues, ok: false }
  }
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
