/**
 * `pnpm archive` as a function (docs/06 §2 rule 2, §6): save a URL to the Wayback Machine with
 * authenticated Save Page Now, download the snapshot bytes, SHA-256 them, extract the text, write
 * archive/text/{id}.txt, append archive/index.csv, and return a source record ready to file.
 *
 * On a failed capture nothing is written to archive/text; the index still gets a row (the index is
 * append-only and records failed attempts, docs/03 §1) and the record carries `wayback_url: null`
 * and `archive_status: failed`, so it cannot support an event until archived (docs/06 §6).
 */
import { createHash } from 'node:crypto'
import { isValidId, type Source, type SourceKind, slugify } from '@gai/schema'
import { isoSeconds, type NetDeps } from './deps.js'
import { type Extracted, extractText, truncateText } from './extract.js'
import { appendArchiveIndex, writeArchiveText } from './files.js'
import { downloadSnapshot, type SpnCredentials, type SpnOptions, spnSave } from './wayback.js'

export interface ArchiveRequest {
  url: string
  /** Source id; derived from the URL, the document date and the title when absent. */
  id?: string
  kind?: SourceKind
  /** Repository (or dataset) root holding archive/. */
  root: string
  creds: SpnCredentials
  deps: NetDeps
  spn?: SpnOptions
  /** Final id from the hash of the archived bytes (dataset sources that must not overwrite). */
  resolveId?: (sha256: string) => string
  /**
   * Checks the archived bytes before anything is written: returns null to accept, or the reason
   * to reject (an API error page captured instead of the data). A rejected capture writes
   * nothing; its Wayback URL is named in the reason.
   */
  accept?: (body: Uint8Array) => string | null
}

export type ArchivedDocument =
  | {
      ok: true
      source: Source
      /** The bytes that were hashed (callers parse datasets from these, not from a live call). */
      body: Uint8Array
      extracted: Extracted
      truncated: boolean
      /** True when the id was derived rather than given. */
      derivedId: boolean
    }
  | { ok: false; source: Source; reason: string; derivedId: boolean }

export const sha256Hex = (bytes: Uint8Array): string =>
  createHash('sha256').update(bytes).digest('hex')

/** Second-level labels under a country code that are not the publisher (gov.uk, co.jp…). */
const GENERIC_SLD = new Set([
  'ac',
  'co',
  'com',
  'edu',
  'gc',
  'go',
  'gob',
  'gouv',
  'gov',
  'govt',
  'net',
  'or',
  'org',
])

/** Publisher slug from a host name: `www.icj-cij.org` → `icj-cij`, `press.un.org` → `un-press`. */
export function publisherSlug(url: string): string {
  const host = new URL(url).hostname.toLowerCase().replace(/^www\d?\./, '')
  const labels = host.split('.')
  labels.pop()
  const last = labels.at(-1)
  if (labels.length > 1 && last !== undefined && GENERIC_SLD.has(last)) labels.pop()
  const slug = slugify(labels.reverse().join('-'), 40)
  return slug === '' ? 'site' : slug
}

/** Topic slug from the URL path, else the title: `/case/192` → `case-192`. */
export function topicSlug(url: string, title: string | null): string {
  const u = new URL(url)
  const path = decodeURIComponent(u.pathname)
    .replace(/\.(html?|php|aspx?|pdf)$/i, '')
    .split('/')
    .filter((p) => p !== '' && !/^(en|fr|de|es|index)$/i.test(p))
  const fromPath = slugify(path.slice(-2).join('-'), 40)
  if (fromPath !== '') return fromPath
  const fromTitle = title ? slugify(title, 40) : ''
  return fromTitle === '' ? 'home' : fromTitle
}

/** `src_{YYYYMMDD}_{publisher}_{topic}` (docs/03 §2). */
export function deriveSourceId(url: string, date: string, title: string | null): string {
  const id = `src_${date.replaceAll('-', '')}_${publisherSlug(url)}_${topicSlug(url, title)}`
  if (!isValidId('source', id))
    throw new Error(`could not derive a valid source id from ${url}; pass --id`)
  return id
}

const PUBLISHER_TYPE: Record<SourceKind, string> = {
  official: 'government',
  'official-video': 'government',
  court: 'court',
  dataset: 'dataset',
  ngo: 'ngo',
  press: 'press',
  parliamentary: 'parliament',
}

function baseSource(
  req: ArchiveRequest,
  id: string,
  date: string,
  x: Pick<Extracted, 'title' | 'lang' | 'siteName'> | null,
): Source {
  const kind = req.kind ?? 'official'
  return {
    id,
    kind,
    title: x?.title ?? new URL(req.url).hostname,
    publisher: x?.siteName ?? new URL(req.url).hostname.replace(/^www\./, ''),
    publisher_type: PUBLISHER_TYPE[kind],
    url: req.url,
    wayback_url: null,
    archive_status: 'failed',
    sha256: null,
    bytes: null,
    content_type: null,
    retrieved_at: null,
    language: x?.lang && /^[a-z]{2,3}$/.test(x.lang) ? x.lang : 'en',
    date,
    text_file: null,
    notes: '',
  }
}

/** Archives one URL (see the module comment). */
export async function archiveUrl(req: ArchiveRequest): Promise<ArchivedDocument> {
  const { deps } = req
  const today = isoSeconds(deps.now()).slice(0, 10)
  if (req.id !== undefined && !isValidId('source', req.id)) {
    throw new Error(
      `--id ${req.id} is not a source id src_{YYYYMMDD}_{publisher-slug}_{topic-slug}`,
    )
  }
  deps.log(`archive ${req.url}: Save Page Now…`)
  let saved = await spnSave(req.url, req.creds, deps, req.spn)
  let snap = saved.ok ? await downloadSnapshot(saved.capture, deps, req.spn) : null
  if (saved.ok && snap !== null && !snap.ok && req.spn?.ifNotArchivedWithin !== null) {
    // A reused capture that Wayback does not serve: capture anew once.
    deps.log(`  ${req.url}: ${snap.reason}; capturing anew`)
    saved = await spnSave(req.url, req.creds, deps, { ...req.spn, ifNotArchivedWithin: null })
    snap = saved.ok ? await downloadSnapshot(saved.capture, deps, req.spn) : null
  }
  if (!saved.ok || snap === null || !snap.ok) {
    const reason = !saved.ok ? saved.reason : snap && !snap.ok ? snap.reason : 'unknown failure'
    const id = req.id ?? deriveSourceId(req.url, today, null)
    const source = baseSource(req, id, today, null)
    source.notes = `Save Page Now failed on ${today}: ${reason}. Retry pnpm archive, or archive by hand (archive.ph) and record archive_url_alt (docs/06 §6).`
    appendArchiveIndex(req.root, {
      src_id: id,
      url: req.url,
      wayback_url: null,
      sha256: null,
      bytes: null,
      retrieved_at: null,
      content_type: '',
    })
    return { ok: false, source, reason, derivedId: req.id === undefined }
  }

  const rejected = req.accept?.(snap.body) ?? null
  if (rejected !== null) {
    const id = req.id ?? deriveSourceId(req.url, today, null)
    const source = baseSource(req, id, today, null)
    const reason = `archived response rejected (${rejected}): ${snap.waybackUrl}`
    return { ok: false, source, reason, derivedId: req.id === undefined }
  }
  const retrievedAt = isoSeconds(deps.now())
  const extracted = await extractText(snap.body, snap.contentType, snap.charset)
  const date = extracted.published ?? today
  const sha256 = sha256Hex(snap.body)
  const id = req.resolveId?.(sha256) ?? req.id ?? deriveSourceId(req.url, date, extracted.title)
  const { text, truncated } = truncateText(extracted.text)
  const textFile = writeArchiveText(req.root, id, text)
  const contentType = snap.contentType ?? 'application/octet-stream'
  appendArchiveIndex(req.root, {
    src_id: id,
    url: req.url,
    wayback_url: snap.waybackUrl,
    sha256,
    bytes: snap.body.byteLength,
    retrieved_at: retrievedAt,
    content_type: contentType,
  })
  const source: Source = {
    ...baseSource(req, id, date, extracted),
    wayback_url: snap.waybackUrl,
    archive_status: 'archived',
    sha256,
    bytes: snap.body.byteLength,
    content_type: contentType,
    retrieved_at: retrievedAt,
    text_file: textFile,
    notes: [
      snap.timestamp !== saved.capture.timestamp
        ? `Save Page Now capture ${saved.capture.timestamp}; Wayback serves the identical snapshot ${snap.timestamp}.`
        : '',
      snap.originalUrl !== req.url ? `Wayback captured ${snap.originalUrl} (redirect).` : '',
      truncated ? 'Extracted text truncated at 200 KB.' : '',
      `Text extracted by ${extracted.method}.`,
    ]
      .filter(Boolean)
      .join(' '),
  }
  return {
    ok: true,
    source,
    body: snap.body,
    extracted,
    truncated,
    derivedId: req.id === undefined,
  }
}

/** Fields of the skeleton the author must check before filing (inferred, not read). */
export function skeletonChecks(doc: ArchivedDocument, kindGiven: boolean): string[] {
  const out = ['title', 'publisher', 'publisher_type', 'language']
  if (!kindGiven) out.unshift('kind')
  if (doc.derivedId || !doc.ok || doc.extracted.published === null)
    out.push('date (the document date; the id carries it)')
  return out
}
