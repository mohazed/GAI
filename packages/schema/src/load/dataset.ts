/**
 * Loads the whole `data/` and `archive/` tree into typed records (docs/03 §1).
 *
 * Every record keeps the file (relative to the dataset root, POSIX separators) and line it came
 * from. Records that fail their schema are reported and left out of the typed arrays; their ids
 * are remembered in `invalidIds` so that other rules do not cascade "unknown id" errors.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, posix } from 'node:path'
import type { z } from 'zod'
import { type Issue, issue, type RuleId } from '../issues.js'
import {
  ARCHIVE_INDEX_COLUMNS,
  ArchiveIndexRow,
  Assessment,
  Correction,
  Country,
  Event,
  Lead,
  Reply,
  Source,
} from '../records.js'
import {
  STRUCTURED_TABLE_NAMES,
  STRUCTURED_TABLES,
  type StructuredRow,
  type StructuredTableName,
} from '../structured.js'
import { parseCsv, parseYaml } from './parse.js'

export interface Located<T> {
  value: T
  /** Path relative to the dataset (or repository) root, POSIX separators. */
  file: string
  line?: number
}

export type StructuredData = { [K in StructuredTableName]: Located<StructuredRow<K>>[] }

export interface Dataset {
  /** Absolute path of the directory holding `data/` and `archive/`. */
  root: string
  countries: Located<Country>[]
  events: Located<Event>[]
  sources: Located<Source>[]
  assessments: Located<Assessment>[]
  corrections: Located<Correction>[]
  replies: Located<Reply>[]
  leads: Located<Lead>[]
  structured: StructuredData
  archiveIndex: Located<ArchiveIndexRow>[]
  /** Source ids with a file in archive/text/. */
  archiveTextIds: Set<string>
  /** Contents of archive/text/{id}.txt, or undefined when absent. */
  readArchiveText: (sourceId: string) => string | undefined
  /** Ids of records that exist in the tree but failed their schema. */
  invalidIds: Set<string>
  /** Every file seen under data/ and archive/ (relative paths). */
  files: string[]
  /** Loading and schema issues. */
  issues: Issue[]
}

/** Required files of the tree. */
export const REQUIRED_FILES = [
  'data/countries.yaml',
  'data/corrections.yaml',
  'archive/index.csv',
  ...STRUCTURED_TABLE_NAMES.map((t) => `data/structured/${t}`),
] as const

const IGNORED = [/(^|\/)\.gitkeep$/, /(^|\/)README\.md$/, /(^|\/)\.DS_Store$/]
const IGNORED_DIRS = ['data/snapshots/', 'data/structured/raw/']

/** Recursively lists files under `dir` (relative to `root`), POSIX paths, sorted. */
export function listFiles(root: string, dir: string): string[] {
  const abs = join(root, dir)
  if (!existsSync(abs)) return []
  const out: string[] = []
  const walk = (rel: string) => {
    for (const name of readdirSync(join(root, rel)).sort()) {
      const child = posix.join(rel, name)
      if (statSync(join(root, child)).isDirectory()) walk(child)
      else out.push(child)
    }
  }
  walk(dir)
  return out
}

/** Converts a zod error into issues, one per problem. */
export function zodIssues(
  rule: RuleId,
  error: z.ZodError,
  at: { file: string; id: string; line?: number | undefined },
  pathPrefix = '',
): Issue[] {
  return error.issues.map((zi) => {
    const path = [pathPrefix, ...zi.path.map(String)].filter(Boolean).join('.')
    return issue(rule, { ...at, path }, zi.message)
  })
}

function rawId(value: unknown, fallback: string): string {
  if (value && typeof value === 'object' && 'id' in value) {
    const id = (value as { id: unknown }).id
    if (typeof id === 'string' && id !== '') return id
  }
  return fallback
}

function rawField(value: unknown, key: string): string | undefined {
  if (value && typeof value === 'object' && key in value) {
    const v = (value as Record<string, unknown>)[key]
    if (typeof v === 'string') return v
  }
  return undefined
}

interface Collector {
  issues: Issue[]
  invalidIds: Set<string>
}

/** Parses a YAML file holding a list of records of one kind. */
function loadList<S extends z.ZodType>(
  root: string,
  file: string,
  schema: S,
  rule: RuleId,
  c: Collector,
  idKey = 'id',
): Located<z.infer<S>>[] {
  const parsed = parseYaml(readFileSync(join(root, file), 'utf8'), file)
  c.issues.push(...parsed.issues)
  if (!parsed.ok) return []
  if (parsed.value === null || parsed.value === undefined) return []
  if (!Array.isArray(parsed.value)) {
    c.issues.push(issue(rule, { file }, 'expected a YAML list of records'))
    return []
  }
  const out: Located<z.infer<S>>[] = []
  parsed.value.forEach((raw, i) => {
    const line = parsed.itemLines[i]
    const id = idKey === 'id' ? rawId(raw, `#${i + 1}`) : (rawField(raw, idKey) ?? `#${i + 1}`)
    const result = schema.safeParse(raw)
    if (result.success) {
      out.push(
        line === undefined ? { value: result.data, file } : { value: result.data, file, line },
      )
    } else {
      c.issues.push(...zodIssues(rule, result.error, { file, id, line }))
      c.invalidIds.add(id)
    }
  })
  return out
}

/** Parses a YAML file holding one record. */
function loadOne<S extends z.ZodType>(
  root: string,
  file: string,
  schema: S,
  rule: RuleId,
  c: Collector,
  idKey = 'id',
): Located<z.infer<S>> | null {
  const parsed = parseYaml(readFileSync(join(root, file), 'utf8'), file)
  c.issues.push(...parsed.issues)
  if (!parsed.ok) return null
  const fallback = posix.basename(file, '.yaml')
  const id = rawField(parsed.value, idKey) ?? fallback
  if (parsed.value === null || typeof parsed.value !== 'object' || Array.isArray(parsed.value)) {
    c.issues.push(issue(rule, { file, id, line: 1 }, 'expected a YAML mapping (one record)'))
    c.invalidIds.add(id)
    return null
  }
  const result = schema.safeParse(parsed.value)
  if (!result.success) {
    c.issues.push(...zodIssues(rule, result.error, { file, id, line: 1 }))
    c.invalidIds.add(id)
    return null
  }
  return { value: result.data, file, line: 1 }
}

function emptyStructured(): StructuredData {
  const out = {} as Record<StructuredTableName, unknown[]>
  for (const t of STRUCTURED_TABLE_NAMES) out[t] = []
  return out as StructuredData
}

export interface LoadDatasetOptions {
  /** Report missing required files (default true). */
  requireFiles?: boolean
}

export function loadDataset(root: string, options: LoadDatasetOptions = {}): Dataset {
  const c: Collector = { issues: [], invalidIds: new Set() }
  const files = [...listFiles(root, 'data'), ...listFiles(root, 'archive')]
  const present = new Set(files)

  if (options.requireFiles !== false) {
    for (const f of REQUIRED_FILES) {
      if (!present.has(f)) c.issues.push(issue('load.missing-file', { file: f }, `${f} is missing`))
    }
  }

  const ds: Dataset = {
    root,
    countries: [],
    events: [],
    sources: [],
    assessments: [],
    corrections: [],
    replies: [],
    leads: [],
    structured: emptyStructured(),
    archiveIndex: [],
    archiveTextIds: new Set(),
    readArchiveText: () => undefined,
    invalidIds: c.invalidIds,
    files,
    issues: c.issues,
  }

  const textCache = new Map<string, string | undefined>()
  ds.readArchiveText = (sourceId: string) => {
    if (!textCache.has(sourceId)) {
      const f = `archive/text/${sourceId}.txt`
      textCache.set(sourceId, present.has(f) ? readFileSync(join(root, f), 'utf8') : undefined)
    }
    return textCache.get(sourceId)
  }

  for (const file of files) {
    if (IGNORED.some((re) => re.test(file)) || IGNORED_DIRS.some((d) => file.startsWith(d))) {
      continue
    }
    const parts = file.split('/')
    if (file === 'data/countries.yaml') {
      ds.countries.push(...loadList(root, file, Country, 'schema.country', c, 'iso3'))
    } else if (file === 'data/corrections.yaml') {
      ds.corrections.push(...loadList(root, file, Correction, 'schema.correction', c))
    } else if (parts[1] === 'events' && parts.length === 3 && file.endsWith('.yaml')) {
      ds.events.push(...loadList(root, file, Event, 'schema.event', c))
    } else if (parts[1] === 'leads' && parts.length === 3 && file.endsWith('.yaml')) {
      ds.leads.push(...loadList(root, file, Lead, 'schema.lead', c))
    } else if (parts[1] === 'sources' && parts.length === 4 && file.endsWith('.yaml')) {
      const r = loadOne(root, file, Source, 'schema.source', c)
      if (r) ds.sources.push(r)
    } else if (parts[1] === 'assessments' && parts.length === 3 && file.endsWith('.yaml')) {
      const r = loadOne(root, file, Assessment, 'schema.assessment', c, 'country')
      if (r) ds.assessments.push(r)
    } else if (parts[1] === 'replies' && parts.length === 4 && file.endsWith('.yaml')) {
      const r = loadOne(root, file, Reply, 'schema.reply', c)
      if (r) ds.replies.push(r)
    } else if (parts[1] === 'structured' && parts.length === 3 && file.endsWith('.csv')) {
      const table = parts[2] as StructuredTableName
      const spec = STRUCTURED_TABLES[table]
      if (!spec) {
        c.issues.push(issue('load.unexpected-file', { file }, 'not a documented structured table'))
        continue
      }
      const parsed = parseCsv(readFileSync(join(root, file), 'utf8'), file, spec.columns)
      c.issues.push(...parsed.issues)
      const rows = ds.structured[table] as Located<unknown>[]
      for (const { record, line } of parsed.rows) {
        const result = spec.row.safeParse(record)
        if (result.success) rows.push({ value: result.data, file, line })
        else
          c.issues.push(
            ...zodIssues('schema.structured-row', result.error, { file, id: `row ${line}`, line }),
          )
      }
    } else if (file === 'archive/index.csv') {
      const parsed = parseCsv(readFileSync(join(root, file), 'utf8'), file, ARCHIVE_INDEX_COLUMNS)
      c.issues.push(...parsed.issues)
      for (const { record, line } of parsed.rows) {
        const result = ArchiveIndexRow.safeParse(record)
        if (result.success) ds.archiveIndex.push({ value: result.data, file, line })
        else {
          c.issues.push(
            ...zodIssues('schema.archive-index', result.error, {
              file,
              id: record.src_id || `row ${line}`,
              line,
            }),
          )
          // Like any record that fails its schema, so rules can tell "row malformed" from "no row".
          if (record.src_id) c.invalidIds.add(record.src_id)
        }
      }
    } else if (parts[0] === 'archive' && parts[1] === 'text' && parts.length === 3) {
      if (file.endsWith('.txt')) ds.archiveTextIds.add(posix.basename(file, '.txt'))
      else
        c.issues.push(issue('load.unexpected-file', { file }, 'archive/text holds .txt files only'))
    } else {
      c.issues.push(issue('load.unexpected-file', { file }, 'not part of the documented data tree'))
    }
  }

  return ds
}
