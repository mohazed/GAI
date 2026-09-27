/**
 * Archiving an API response as a `dataset` source (docs/06 §2, §6): the fetchers save each
 * response URL with Save Page Now, parse the archived bytes (never a separate live call, so the
 * table is exactly what the hash covers), and file a source record in data/sources/.
 */
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { formatSourceId, parseSourceId, type Source } from '@gai/schema'
import { parse } from 'yaml'
import { type ArchiveRequest, archiveUrl } from './archive.js'
import { isoSeconds, type NetDeps } from './deps.js'
import { sourcePath, writeSource } from './files.js'
import type { SpnCredentials, SpnOptions } from './wayback.js'

export interface DatasetContext {
  root: string
  creds: SpnCredentials
  deps: NetDeps
  spn?: SpnOptions
}

export interface DatasetSpec {
  url: string
  /** Two or more slug segments after the date: ['fts', 'plan-1186-p1'] (docs/03 §2). */
  segments: string[]
  title: string
  publisher: string
  notes?: string
  /** Rejects an archived body that is not the expected data (see ArchiveRequest.accept). */
  accept?: (body: Uint8Array) => string | null
}

export type ArchivedDataset =
  | { ok: true; source: Source; body: Uint8Array }
  | { ok: false; source: Source; reason: string }

function existingSha(root: string, id: string): string | null | undefined {
  const file = join(root, sourcePath(id))
  if (!existsSync(file)) return undefined
  const v = parse(readFileSync(file, 'utf8')) as { sha256?: unknown }
  return typeof v?.sha256 === 'string' ? v.sha256 : null
}

/**
 * The id for a dataset source retrieved today: the plain id, or the same id with `-2`, `-3`…
 * on the last segment when a record with that id already holds different bytes (a source is
 * never overwritten, CLAUDE.md "never delete data").
 */
export function datasetSourceId(
  root: string,
  date: string,
  segments: string[],
  sha256: string,
): string {
  for (let n = 1; ; n++) {
    const segs = n === 1 ? segments : [...segments.slice(0, -1), `${segments.at(-1)}-${n}`]
    const id = formatSourceId({ date, segments: segs })
    const sha = existingSha(root, id)
    if (sha === undefined || sha === sha256) return id
  }
}

function request(
  ctx: DatasetContext,
  spec: DatasetSpec,
  date: string,
  provisional: string,
  spn: SpnOptions | undefined,
): ArchiveRequest {
  return {
    url: spec.url,
    kind: 'dataset',
    root: ctx.root,
    creds: ctx.creds,
    deps: ctx.deps,
    // API responses and files need no browser rendering (SPN2 force_get).
    spn: { forceGet: true, ...spn },
    ...(spec.accept ? { accept: spec.accept } : {}),
    resolveId: (sha256) => datasetSourceId(ctx.root, date, spec.segments, sha256),
    id: provisional,
  }
}

/** Archives one dataset URL and files its source record (only when the capture succeeded). */
export async function archiveDataset(
  ctx: DatasetContext,
  spec: DatasetSpec,
): Promise<ArchivedDataset> {
  const date = isoSeconds(ctx.deps.now()).slice(0, 10)
  const provisional = formatSourceId({ date, segments: spec.segments })
  let doc = await archiveUrl(request(ctx, spec, date, provisional, ctx.spn))
  // A rejected capture (an error page) is captured anew rather than reused, twice at most.
  for (
    let retry = 1;
    !doc.ok && doc.reason.startsWith('archived response rejected') && retry <= 2;
    retry++
  ) {
    ctx.deps.log(`  ${spec.url}: ${doc.reason}; capturing anew in 60 s (${retry} of 2)`)
    await ctx.deps.sleep(ctx.spn?.retryPauseMs ?? 60_000)
    doc = await archiveUrl(
      request(ctx, spec, date, provisional, { ...ctx.spn, ifNotArchivedWithin: null }),
    )
  }
  const source: Source = {
    ...doc.source,
    title: spec.title,
    publisher: spec.publisher,
    publisher_type: 'dataset',
    language: 'en',
    date,
    notes: [spec.notes ?? '', doc.source.notes ?? ''].filter(Boolean).join(' '),
  }
  if (!doc.ok) return { ok: false, source, reason: doc.reason }
  writeSource(ctx.root, source)
  return { ok: true, source, body: doc.body }
}

/** The JSON of an archived response, or an error naming the source. */
export function jsonOfDataset(d: { source: Source; body: Uint8Array }): unknown {
  try {
    return JSON.parse(new TextDecoder().decode(d.body))
  } catch {
    throw new Error(`${d.source.id}: the archived response is not JSON (${d.source.wayback_url})`)
  }
}

/** The date embedded in a source id (the retrieval date for dataset sources). */
export const sourceDate = (id: string): string => parseSourceId(id)?.date ?? ''

/** Runs `tasks` with at most `limit` in flight (Save Page Now allows a few concurrent captures). */
export async function inPool<T, R>(
  items: readonly T[],
  limit: number,
  task: (item: T) => Promise<R>,
): Promise<R[]> {
  const out: R[] = new Array(items.length)
  let next = 0
  const worker = async () => {
    for (;;) {
      const i = next++
      if (i >= items.length) return
      out[i] = await task(items[i] as T)
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return out
}

/** An `accept` check: the body parses as JSON and passes `check` (null when it does). */
export function jsonAccept(
  check: (json: unknown) => string | null,
): (body: Uint8Array) => string | null {
  return (body) => {
    let json: unknown
    try {
      json = JSON.parse(new TextDecoder().decode(body))
    } catch {
      return 'not JSON'
    }
    return check(json)
  }
}

/**
 * Checks that a local file is the archived dataset source it will be cited as: the record exists,
 * is of kind dataset, is archived, and its sha256 is the file's (so the table rows trace to bytes
 * anyone can re-download). Returns the problems, empty when none.
 */
export function checkFileAgainstSource(
  root: string,
  sourceId: string,
  bytes: Uint8Array,
  sha256: string,
): string[] {
  if (parseSourceId(sourceId) === null) return [`${sourceId} is not a source id`]
  const file = join(root, sourcePath(sourceId))
  if (!existsSync(file)) {
    return [
      `${sourcePath(sourceId)} does not exist; archive the file first (pnpm archive <url> --kind dataset --id ${sourceId}) and file its record`,
    ]
  }
  const rec = parse(readFileSync(file, 'utf8')) as Partial<Source>
  const out: string[] = []
  if (rec.kind !== 'dataset')
    out.push(`${sourceId} is of kind ${String(rec.kind)}; expected dataset`)
  if (!rec.wayback_url || rec.archive_status === 'failed') out.push(`${sourceId} is not archived`)
  if (rec.sha256 !== sha256) {
    out.push(
      `${sourceId} has sha256 ${String(rec.sha256)} but the file's is ${sha256} (${bytes.byteLength} bytes); the rows must come from the archived bytes`,
    )
  }
  return out
}
