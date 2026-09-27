/**
 * Loads the whole `data/` and `archive/` tree into typed records (docs/03 §1).
 *
 * Every record keeps the file (relative to the dataset root, POSIX separators) and line it came
 * from. Records that fail their schema are reported and left out of the typed arrays; their ids
 * are remembered in `invalidIds` so that other rules do not cascade "unknown id" errors.
 */

import { isUtf8 } from 'node:buffer'
import { lstatSync, readdirSync, readFileSync } from 'node:fs'
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
import { decodeUtf8, firstInvalidUtf8, parseCsv, parseYaml } from './parse.js'

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
  /**
   * Ids of records that exist in the tree but failed their schema, all kinds together (country
   * codes, event, source, correction, reply and lead ids, assessment countries, archive index
   * src_ids). Prefer `invalid`, which keeps the kinds apart.
   */
  invalidIds: Set<string>
  /** The same ids per kind of record, so a malformed record of one kind hides nothing else. */
  invalid: InvalidIds
  /** Every regular file under data/ and archive/ (relative paths); symbolic links excluded. */
  files: string[]
  /** Loading and schema issues. */
  issues: Issue[]
}

/** Ids of records that failed their schema, per kind (see `Dataset.invalid`). */
export interface InvalidIds {
  /** iso3 of country records in data/countries.yaml. */
  country: Set<string>
  event: Set<string>
  source: Set<string>
  /** The `country` of data/assessments/{ISO3}.yaml (or the file name). */
  assessment: Set<string>
  correction: Set<string>
  reply: Set<string>
  lead: Set<string>
  /** src_id of archive/index.csv rows. */
  archiveIndex: Set<string>
}

export type RecordKind = keyof InvalidIds

function emptyInvalid(): InvalidIds {
  return {
    country: new Set(),
    event: new Set(),
    source: new Set(),
    assessment: new Set(),
    correction: new Set(),
    reply: new Set(),
    lead: new Set(),
    archiveIndex: new Set(),
  }
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

/**
 * Recursively lists the regular files under `dir` (relative to `root`), POSIX paths, in code-unit
 * order. Symbolic links are never followed (a loop, a dangling link or a link out of the tree
 * would otherwise abort the run or read a foreign file); they are collected in `symlinks` when
 * given. Other non-regular entries (sockets, FIFOs) are skipped.
 */
export function listFiles(root: string, dir: string, symlinks?: string[]): string[] {
  const out: string[] = []
  let top: ReturnType<typeof lstatSync> | undefined
  try {
    top = lstatSync(join(root, dir))
  } catch {
    return out
  }
  if (top.isSymbolicLink()) {
    symlinks?.push(dir)
    return out
  }
  if (!top.isDirectory()) return out
  const walk = (rel: string) => {
    const entries = readdirSync(join(root, rel), { withFileTypes: true })
    entries.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
    for (const entry of entries) {
      const child = posix.join(rel, entry.name)
      if (entry.isSymbolicLink()) symlinks?.push(child)
      else if (entry.isDirectory()) walk(child)
      else if (entry.isFile()) out.push(child)
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
  invalid: InvalidIds
}

function markInvalid(c: Collector, kind: RecordKind, id: string): void {
  c.invalidIds.add(id)
  c.invalid[kind].add(id)
}

/** Reads a text file as strict UTF-8 (docs/03 §1, §7), reporting invalid bytes. */
function readText(root: string, file: string, c: Collector): string {
  const decoded = decodeUtf8(readFileSync(join(root, file)), file)
  c.issues.push(...decoded.issues)
  return decoded.text
}

/** Parses a YAML file holding a list of records of one kind. */
function loadList<S extends z.ZodType>(
  root: string,
  file: string,
  schema: S,
  rule: RuleId,
  c: Collector,
  kind: RecordKind,
  idKey = 'id',
): Located<z.infer<S>>[] {
  const parsed = parseYaml(readText(root, file, c), file)
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
      markInvalid(c, kind, id)
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
  kind: RecordKind,
  idKey = 'id',
): Located<z.infer<S>> | null {
  const parsed = parseYaml(readText(root, file, c), file)
  c.issues.push(...parsed.issues)
  if (!parsed.ok) return null
  const fallback = posix.basename(file, '.yaml')
  const id = rawField(parsed.value, idKey) ?? fallback
  if (parsed.value === null || typeof parsed.value !== 'object' || Array.isArray(parsed.value)) {
    c.issues.push(issue(rule, { file, id, line: 1 }, 'expected a YAML mapping (one record)'))
    markInvalid(c, kind, id)
    return null
  }
  const result = schema.safeParse(parsed.value)
  if (!result.success) {
    c.issues.push(...zodIssues(rule, result.error, { file, id, line: 1 }))
    markInvalid(c, kind, id)
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

/**
 * Record directories and the one name pattern their files follow (docs/03 §1). Any other file
 * under them is reported as `load.misplaced-file`: it would be neither validated nor loaded.
 */
const RECORD_DIRS: readonly { dir: string; depth: number; ext: string; pattern: string }[] = [
  { dir: 'data/events', depth: 3, ext: '.yaml', pattern: 'data/events/{ISO3}.yaml' },
  { dir: 'data/sources', depth: 4, ext: '.yaml', pattern: 'data/sources/{YYYY}/{src_id}.yaml' },
  { dir: 'data/assessments', depth: 3, ext: '.yaml', pattern: 'data/assessments/{ISO3}.yaml' },
  { dir: 'data/replies', depth: 4, ext: '.yaml', pattern: 'data/replies/{ISO3}/{reply_id}.yaml' },
  { dir: 'data/leads', depth: 3, ext: '.yaml', pattern: 'data/leads/{ISO3}.yaml' },
  { dir: 'data/structured', depth: 3, ext: '.csv', pattern: 'data/structured/{table}.csv' },
  { dir: 'archive/text', depth: 3, ext: '.txt', pattern: 'archive/text/{src_id}.txt' },
]

/** The record directory a misnamed file sits in, or undefined when the file fits its pattern. */
function misplacedIn(file: string): (typeof RECORD_DIRS)[number] | undefined {
  const spec = RECORD_DIRS.find((d) => file.startsWith(`${d.dir}/`))
  if (spec === undefined) return undefined
  const ok = file.split('/').length === spec.depth && file.endsWith(spec.ext)
  return ok ? undefined : spec
}

export function loadDataset(root: string, options: LoadDatasetOptions = {}): Dataset {
  const c: Collector = { issues: [], invalidIds: new Set(), invalid: emptyInvalid() }
  const symlinks: string[] = []
  const files = [...listFiles(root, 'data', symlinks), ...listFiles(root, 'archive', symlinks)]
  const present = new Set(files)
  for (const link of symlinks) {
    c.issues.push(
      issue(
        'load.symlink',
        { file: link },
        'symbolic link; data/ and archive/ hold regular files only, so it was not read. Replace it with the file itself',
      ),
    )
  }

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
    invalid: c.invalid,
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
    const dir = `${parts[0]}/${parts[1]}`
    const misplaced = misplacedIn(file)
    if (misplaced !== undefined) {
      c.issues.push(
        issue(
          'load.misplaced-file',
          { file },
          `not loaded: files under ${misplaced.dir}/ follow ${misplaced.pattern}; rename or move it`,
        ),
      )
    } else if (file === 'data/countries.yaml') {
      ds.countries.push(...loadList(root, file, Country, 'schema.country', c, 'country', 'iso3'))
    } else if (file === 'data/corrections.yaml') {
      ds.corrections.push(...loadList(root, file, Correction, 'schema.correction', c, 'correction'))
    } else if (dir === 'data/events') {
      ds.events.push(...loadList(root, file, Event, 'schema.event', c, 'event'))
    } else if (dir === 'data/leads') {
      ds.leads.push(...loadList(root, file, Lead, 'schema.lead', c, 'lead'))
    } else if (dir === 'data/sources') {
      const r = loadOne(root, file, Source, 'schema.source', c, 'source')
      if (r) ds.sources.push(r)
    } else if (dir === 'data/assessments') {
      const r = loadOne(root, file, Assessment, 'schema.assessment', c, 'assessment', 'country')
      if (r) ds.assessments.push(r)
    } else if (dir === 'data/replies') {
      const r = loadOne(root, file, Reply, 'schema.reply', c, 'reply')
      if (r) ds.replies.push(r)
    } else if (dir === 'data/structured') {
      const table = parts[2] as StructuredTableName
      const spec = Object.hasOwn(STRUCTURED_TABLES, table) ? STRUCTURED_TABLES[table] : undefined
      if (!spec) {
        c.issues.push(
          issue(
            'load.misplaced-file',
            { file },
            `not loaded: not a documented structured table; expected one of ${STRUCTURED_TABLE_NAMES.join(', ')}`,
          ),
        )
        continue
      }
      const parsed = parseCsv(readText(root, file, c), file, spec.columns)
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
      const parsed = parseCsv(readText(root, file, c), file, ARCHIVE_INDEX_COLUMNS)
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
          if (record.src_id) markInvalid(c, 'archiveIndex', record.src_id)
        }
      }
    } else if (dir === 'archive/text') {
      ds.archiveTextIds.add(posix.basename(file, '.txt'))
      // The text is read lazily by the rules; its encoding is checked here, once.
      const bytes = readFileSync(join(root, file))
      if (!isUtf8(bytes)) {
        const bad = firstInvalidUtf8(bytes)
        c.issues.push(
          issue(
            'load.encoding',
            { file, line: bad?.line ?? 1 },
            `not valid UTF-8 (first invalid byte at offset ${bad?.offset ?? 0}); quotes cannot be checked against it. Expected the extracted text saved as UTF-8`,
          ),
        )
      }
    } else {
      c.issues.push(issue('load.unexpected-file', { file }, 'not part of the documented data tree'))
    }
  }

  return ds
}
