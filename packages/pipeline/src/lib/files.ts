/**
 * Writing the dataset's files: CSV tables (docs/03 §7: UTF-8, header row, LF), source records
 * (docs/03 §5, one YAML file per source), archive/index.csv rows and archive/text files.
 * Every writer produces the same bytes for the same input.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import {
  ARCHIVE_INDEX_COLUMNS,
  type ArchiveIndexRow,
  parseCsv,
  parseSourceId,
  type Source,
  STRUCTURED_TABLES,
  type StructuredTableName,
} from '@gai/schema'
import { stringify } from 'yaml'

/** One CSV field, quoted when it holds a comma, a quote or a line break. */
export function csvField(value: unknown): string {
  const s = value === null || value === undefined ? '' : String(value)
  return /[",\r\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s
}

export function csvLine(values: readonly unknown[]): string {
  return values.map(csvField).join(',')
}

/** A whole CSV file: header, then one line per row in the given column order, LF, final LF. */
export function csvText(
  columns: readonly string[],
  rows: readonly Record<string, unknown>[],
): string {
  return `${[csvLine(columns), ...rows.map((r) => csvLine(columns.map((c) => r[c])))].join('\n')}\n`
}

function ensureDir(file: string): void {
  mkdirSync(dirname(file), { recursive: true })
}

/** Rows of a structured table as written (strings), or [] when the file is absent. */
export function readTable(root: string, table: StructuredTableName): Record<string, string>[] {
  const file = join(root, 'data/structured', table)
  if (!existsSync(file)) return []
  const parsed = parseCsv(readFileSync(file, 'utf8'), file, STRUCTURED_TABLES[table].columns)
  if (!parsed.ok) throw new Error(parsed.issues.map((i) => i.message).join('; '))
  return parsed.rows.map((r) => r.record)
}

/** Compares rows by the given columns, as strings (code-unit order), for a stable file order. */
export function byColumns(columns: readonly string[]) {
  return (a: Record<string, unknown>, b: Record<string, unknown>): number => {
    for (const c of columns) {
      const x = String(a[c] ?? '')
      const y = String(b[c] ?? '')
      if (x !== y) return x < y ? -1 : 1
    }
    return 0
  }
}

/** Writes a structured table with its documented header, rows sorted by `sortBy`. */
export function writeTable(
  root: string,
  table: StructuredTableName,
  rows: readonly Record<string, unknown>[],
  sortBy: readonly string[],
): string {
  const file = join(root, 'data/structured', table)
  ensureDir(file)
  const sorted = [...rows].sort(byColumns(sortBy))
  writeFileSync(file, csvText(STRUCTURED_TABLES[table].columns, sorted))
  return file
}

/**
 * Replaces the rows whose key (`keyColumns`) is among `fresh` and keeps every other row: a new
 * fetch updates the rows it covers and leaves the rest of the table as it was.
 */
export function mergeRows(
  existing: readonly Record<string, unknown>[],
  fresh: readonly Record<string, unknown>[],
  keyColumns: readonly string[],
): Record<string, unknown>[] {
  const key = (r: Record<string, unknown>) =>
    keyColumns.map((c) => String(r[c] ?? '')).join('\u0000')
  const replaced = new Set(fresh.map(key))
  return [...existing.filter((r) => !replaced.has(key(r))), ...fresh]
}

// ---------------------------------------------------------------------------------------------
// Sources

/** Key order of a source record, as in docs/03 §5. */
const SOURCE_KEYS: readonly (keyof Source)[] = [
  'id',
  'kind',
  'title',
  'publisher',
  'publisher_type',
  'url',
  'wayback_url',
  'archive_status',
  'archive_url_alt',
  'sha256',
  'bytes',
  'content_type',
  'retrieved_at',
  'language',
  'date',
  'text_file',
  'excerpt',
  'origin',
  'notes',
]

/** A source record as YAML, keys in the documented order, undefined keys left out. */
export function sourceYaml(source: Source): string {
  const ordered: Record<string, unknown> = {}
  for (const k of SOURCE_KEYS) if (source[k] !== undefined) ordered[k] = source[k]
  return stringify(ordered, { lineWidth: 0, defaultStringType: 'PLAIN', defaultKeyType: 'PLAIN' })
}

/** data/sources/{YYYY}/{id}.yaml, the year of the id's date (docs/03 §1). */
export function sourcePath(id: string): string {
  const parsed = parseSourceId(id)
  if (!parsed) throw new Error(`not a source id: ${id}`)
  return `data/sources/${parsed.date.slice(0, 4)}/${id}.yaml`
}

export function writeSource(root: string, source: Source): string {
  const rel = sourcePath(source.id)
  const file = join(root, rel)
  ensureDir(file)
  writeFileSync(file, sourceYaml(source))
  return rel
}

// ---------------------------------------------------------------------------------------------
// Archive

export function writeArchiveText(root: string, id: string, text: string): string {
  const rel = `archive/text/${id}.txt`
  const file = join(root, rel)
  ensureDir(file)
  writeFileSync(file, text.endsWith('\n') ? text : `${text}\n`)
  return rel
}

/** Appends one row to archive/index.csv (append-only, docs/03 §1), writing the header if new. */
export function appendArchiveIndex(root: string, row: ArchiveIndexRow): void {
  const file = join(root, 'archive/index.csv')
  ensureDir(file)
  let text = existsSync(file) ? readFileSync(file, 'utf8') : ''
  if (text === '') text = `${csvLine(ARCHIVE_INDEX_COLUMNS)}\n`
  if (!text.endsWith('\n')) text += '\n'
  text += `${csvLine(ARCHIVE_INDEX_COLUMNS.map((c) => row[c]))}\n`
  writeFileSync(file, text)
}
