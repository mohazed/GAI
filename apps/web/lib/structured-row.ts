/**
 * The evidence of a generated event (D-08, docs/03 §7): each dataset source of its table row is an
 * evidence entry whose quote is the row itself, as written in the CSV file, and whose locator is
 * `row N of data/structured/{table}` (N is the file's line number, the header being line 1). The
 * country page shows that row as a key/value list under the table's own column names.
 */
import type { ApiEvidence } from '@gai/schema/api'
import { STRUCTURED_TABLES, type StructuredTableName } from '@gai/schema/structured'

const ROW_LOCATOR = /^row (\d+) of (data\/structured\/([a-z0-9_]+\.csv))$/

/** One CSV record (RFC 4180: fields may be quoted, `""` is a quote inside a quoted field). */
export function parseCsvLine(line: string): string[] {
  const out: string[] = []
  let field = ''
  let quoted = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i] as string
    if (quoted) {
      if (c === '"' && line[i + 1] === '"') {
        field += '"'
        i++
      } else if (c === '"') {
        quoted = false
      } else {
        field += c
      }
    } else if (c === '"' && field === '') {
      quoted = true
    } else if (c === ',') {
      out.push(field)
      field = ''
    } else {
      field += c
    }
  }
  out.push(field)
  return out
}

export interface TableRow {
  /** `data/structured/fts_funding.csv` */
  path: string
  table: StructuredTableName
  /** Line of the row in the file (the header is line 1). */
  line: number
  /** Column name and value, in file order. */
  fields: [string, string][]
  /** The source ids of the row's `source` cell. */
  sources: string[]
}

function isTable(name: string): name is StructuredTableName {
  return Object.hasOwn(STRUCTURED_TABLES, name)
}

/**
 * The table row an evidence entry quotes, or null when the entry is not a row of a known
 * structured table or its values do not match the table's columns (then the page shows the quote
 * as written).
 */
export function tableRow(ev: Pick<ApiEvidence, 'locator' | 'quote'>): TableRow | null {
  const m = ROW_LOCATOR.exec(ev.locator)
  if (m === null) return null
  const [, line, path, name] = m as unknown as [string, string, string, string]
  if (!isTable(name)) return null
  const columns: readonly string[] = STRUCTURED_TABLES[name].columns
  const values = parseCsvLine(ev.quote)
  if (values.length !== columns.length) return null
  const fields = columns.map((c, i) => [c, values[i] as string] as [string, string])
  const source = fields.find(([c]) => c === 'source')?.[1] ?? ''
  return {
    path,
    table: name,
    line: Number(line),
    fields: fields.filter(([c]) => c !== 'source'),
    sources: source === '' ? [] : source.split(';'),
  }
}

export interface EvidenceGroups {
  /** Distinct table rows, in the order first cited. */
  rows: TableRow[]
  /** Entries that are not table rows (a vote's press release, docs/03 §7), in order. */
  quotes: ApiEvidence[]
  /** Every source id cited, in order, without repeats. */
  sources: string[]
}

/** Splits an event's evidence into the table rows it quotes and its other quotes. */
export function groupEvidence(evidence: readonly ApiEvidence[]): EvidenceGroups {
  const rows: TableRow[] = []
  const seenRows = new Set<string>()
  const quotes: ApiEvidence[] = []
  const sources: string[] = []
  const seenSources = new Set<string>()
  for (const ev of evidence) {
    if (!seenSources.has(ev.source)) {
      seenSources.add(ev.source)
      sources.push(ev.source)
    }
    const row = tableRow(ev)
    if (row === null) {
      quotes.push(ev)
      continue
    }
    const key = `${row.path}#${row.line}`
    if (seenRows.has(key)) continue
    seenRows.add(key)
    rows.push(row)
  }
  return { rows, quotes, sources }
}

/**
 * The row in the repository at the commit the build read (GitHub shows line N at `#LN`), or null
 * outside a git checkout.
 */
export function rowUrl(repoUrl: string, sha: string | null, row: TableRow): string | null {
  return sha === null ? null : `${repoUrl}/blob/${sha}/${row.path}#L${row.line}`
}
