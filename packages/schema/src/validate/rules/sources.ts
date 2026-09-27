/**
 * Validation rules: evidence entries of events and the sources they cite, the archive and its
 * index (docs/03 §1, §4, §5; docs/02 §12.3–§12.4; docs/06 §6). See issues.ts for the registry.
 *
 * Nothing scores without a primary document, an archived copy and a sha256 (CLAUDE.md): these
 * rules check that every cited source exists, is archived, has its text file, agrees with
 * archive/index.csv, and that every quote is verbatim in the archived text.
 */
import { parseSourceId } from '../../ids.js'
import { type Issue, type IssueLocation, issue } from '../../issues.js'
import type { Located } from '../../load/dataset.js'
import type { Event, Evidence, Source } from '../../records.js'
import { STRUCTURED_TABLE_NAMES } from '../../structured.js'
import type { Rule, ValidationContext } from '../context.js'
import { normaliseWhitespace, quoteSearcher } from '../normalise.js'

// ---------------------------------------------------------------------------------------------
// Helpers

const DATASET_ROW_URL = /^data\/structured\/[^/]+\.csv$/

/** A dataset row: a `dataset` source whose url is a structured table of this repository. */
export function isDatasetRow(s: Source): boolean {
  return s.kind === 'dataset' && DATASET_ROW_URL.test(s.url)
}

/** The fields of the archived copy that are missing (wayback_url, sha256). */
function missingArchive(s: Source): string[] {
  const out: string[] = []
  if (s.wayback_url === null) out.push('wayback_url')
  if (s.sha256 === null) out.push('sha256')
  return out
}

/** `a`, `a and b`, `a, b and c`. */
function list(items: string[]): string {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`
}

const show = (v: unknown): string => (v === null || v === undefined ? 'null' : JSON.stringify(v))

/** At most `max` characters of the normalised text, for messages. */
function excerpt(text: string, max = 60): string {
  const t = normaliseWhitespace(text)
  return t.length <= max ? t : `${t.slice(0, max - 1)}…`
}

interface EvidenceRef {
  event: Located<Event>
  evidence: Evidence
  i: number
}

function eachEvidence(ctx: ValidationContext): EvidenceRef[] {
  const out: EvidenceRef[] = []
  for (const event of ctx.dataset.events) {
    event.value.evidence.forEach((evidence, i) => {
      out.push({ event, evidence, i })
    })
  }
  return out
}

function atEvidence(ref: EvidenceRef, field: keyof Evidence): IssueLocation {
  return {
    file: ref.event.file,
    id: ref.event.value.id,
    line: ref.event.line,
    path: `evidence.${ref.i}.${field}`,
  }
}

function atSource(s: Located<Source>, path?: string): IssueLocation {
  const at: IssueLocation = { file: s.file, id: s.value.id, line: s.line }
  if (path !== undefined) at.path = path
  return at
}

/** Where a source record lives (docs/03 §1), for messages. */
function sourcePath(id: string): string {
  const year = parseSourceId(id)?.date.slice(0, 4)
  return year ? `data/sources/${year}/${id}.yaml` : `data/sources/{YYYY}/${id}.yaml`
}

// ---------------------------------------------------------------------------------------------
// Events: evidence entries

/** A `row …` locator (a row of a dataset), matched as a whole word: "Rowland" is not a row. */
const ROW_LOCATOR = /^row\b/i

/**
 * event.quote-in-archive (docs/02 §12.4, docs/03 §4, CLAUDE.md "Quotes are verbatim from
 * archive/text/; CI checks them"): every quote appears in archive/text/{source}.txt after
 * whitespace normalisation. The only exemption is docs/02 §12.4's: a quote from a dataset row,
 * i.e. evidence citing a source of kind `dataset` with a `row …` locator, and never on
 * indicators whose evidence requires an actor (B9, B10). A `row` locator on any other source, and
 * a `video …` locator (checked against the transcript an official-video source must have in
 * archive/text, docs/03 §5), are checked like any other. Unknown sources are left to
 * event.evidence-source-known.
 *
 * Each archived text is read, normalised and searched once for all the quotes that cite it, then
 * released, so the rule holds one normalised text at a time.
 */
export const quoteInArchive: Rule = (ctx) => {
  const m = ctx.methodology
  if (m.indicatorsFile === null) return []

  // Evidence to check, grouped by source, with its position for a stable output order.
  const bySource = new Map<string, { ref: EvidenceRef; order: number }[]>()
  eachEvidence(ctx).forEach((ref, order) => {
    const { event, evidence } = ref
    const src = ctx.index.sourceById.get(evidence.source)
    if (!src) return
    const always = m.indicatorById.get(event.value.indicator)?.evidence.requires_actor === true
    const datasetRow = src.value.kind === 'dataset' && ROW_LOCATOR.test(evidence.locator.trim())
    if (!always && datasetRow) return
    const group = bySource.get(evidence.source)
    if (group) group.push({ ref, order })
    else bySource.set(evidence.source, [{ ref, order }])
  })

  const found: { order: number; issue: Issue }[] = []
  const report = (order: number, ref: EvidenceRef, message: string) =>
    found.push({ order, issue: issue('event.quote-in-archive', atEvidence(ref, 'quote'), message) })
  for (const [src, refs] of bySource) {
    const raw = ctx.dataset.readArchiveText(src)
    if (raw === undefined) {
      for (const { ref, order } of refs) {
        report(
          order,
          ref,
          `archive/text/${src}.txt is missing, so the quote cannot be checked against the archived text.`,
        )
      }
      continue
    }
    const contains = quoteSearcher(raw)
    for (const { ref, order } of refs) {
      const quote = ref.evidence.quote
      if (normaliseWhitespace(quote) === '') {
        report(
          order,
          ref,
          'The quote is empty after whitespace normalisation; expected a verbatim passage of the source.',
        )
      } else if (!contains(quote)) {
        report(
          order,
          ref,
          `The quote "${excerpt(quote)}" does not appear verbatim in archive/text/${src}.txt (only whitespace is normalised).`,
        )
      }
    }
  }
  return found.sort((a, b) => a.order - b.order).map((f) => f.issue)
}

/** The primary subtag of a language tag, lowercase (`pt-BR` → `pt`). */
const primaryLang = (tag: string): string => (tag.split('-')[0] ?? '').toLowerCase()

/** Language tags that name no single language: a source in one of them may hold any quote. */
const NO_SINGLE_LANGUAGE = new Set(['mul', 'und', 'mis', 'zxx'])

/**
 * event.quote-translation (docs/03 §4, CLAUDE.md): translations sit beside the original, never
 * instead of it. A quote whose quote_lang is not English (primary subtag other than `en`)
 * carries a non-empty quote_en. Because that requirement rests on the declared quote_lang, a
 * quote_lang whose primary subtag differs from the cited source's `language` is a warning: a
 * mislabelled quote would otherwise escape the translation check, while documents that quote
 * another language stay possible.
 */
export const quoteTranslation: Rule = (ctx) => {
  const out: Issue[] = []
  for (const ref of eachEvidence(ctx)) {
    const lang = ref.evidence.quote_lang
    const primary = primaryLang(lang)
    const src = ctx.index.sourceById.get(ref.evidence.source)?.value
    if (src !== undefined) {
      const sourcePrimary = primaryLang(src.language)
      if (sourcePrimary !== primary && !NO_SINGLE_LANGUAGE.has(sourcePrimary)) {
        out.push(
          issue(
            'event.quote-translation',
            atEvidence(ref, 'quote_lang'),
            `quote_lang is "${lang}" but the source "${src.id}" is in "${src.language}"; expected the language of the quote as written (a quote not in English carries quote_en beside the original).`,
            'warning',
          ),
        )
      }
    }
    if (primary === 'en') continue
    if ((ref.evidence.quote_en ?? '').trim() === '') {
      out.push(
        issue(
          'event.quote-translation',
          atEvidence(ref, 'quote_en'),
          `The quote is in "${lang}" but quote_en is empty; expected the English translation beside the original.`,
        ),
      )
    }
  }
  return out
}

/** event.evidence-source-known (docs/03 §4): every evidence entry cites an existing source. */
export const evidenceSourceKnown: Rule = (ctx) => {
  const out: Issue[] = []
  for (const ref of eachEvidence(ctx)) {
    const src = ref.evidence.source
    if (ctx.index.sourceById.has(src) || ctx.dataset.invalidIds.has(src)) continue
    out.push(
      issue(
        'event.evidence-source-known',
        atEvidence(ref, 'source'),
        `Source "${src}" does not exist; expected a record at ${sourcePath(src)}.`,
      ),
    )
  }
  return out
}

/**
 * Why a source is not archived for scoring purposes, or null when it is: wayback_url and sha256
 * set and the capture not recorded as failed, or a dataset row (docs/03 §5) whose origin dataset
 * source is archived in that sense. A capture recorded as `archive_status: failed` cannot support
 * an event until archived (docs/06 §6), even if the record also carries a wayback_url or sha256.
 * Shared by event.evidence-archived, event.confirmed-source-kind and structured.source-dataset.
 */
export function notArchivedReason(ctx: ValidationContext, s: Source): string | null {
  if (s.archive_status === 'failed') {
    return `Source "${s.id}" is a failed capture (archive_status: failed)`
  }
  const missing = missingArchive(s)
  if (missing.length === 0) return null
  if (!isDatasetRow(s)) return `Source "${s.id}" lacks ${list(missing)}`
  if (s.origin === undefined) return `Dataset-row source "${s.id}" names no origin`
  const origin = ctx.index.sourceById.get(s.origin)
  if (!origin) return `Dataset-row source "${s.id}" names the unknown origin "${s.origin}"`
  if (origin.value.archive_status === 'failed') {
    return `Dataset-row source "${s.id}" has origin "${s.origin}", a failed capture (archive_status: failed)`
  }
  const originMissing = missingArchive(origin.value)
  if (originMissing.length === 0) return null
  return `Dataset-row source "${s.id}" has origin "${s.origin}", which lacks ${list(originMissing)}`
}

/**
 * event.evidence-archived (CLAUDE.md, docs/02 §12.3, docs/06 §6): a published event cites only
 * archived sources — wayback_url and sha256 set, or a dataset row whose origin is archived.
 * Unknown sources are left to event.evidence-source-known.
 */
export const evidenceArchived: Rule = (ctx) => {
  const out: Issue[] = []
  for (const ref of eachEvidence(ctx)) {
    if (ref.event.value.status !== 'published') continue
    const src = ctx.index.sourceById.get(ref.evidence.source)
    if (!src) continue
    const reason = notArchivedReason(ctx, src.value)
    if (reason === null) continue
    out.push(
      issue(
        'event.evidence-archived',
        atEvidence(ref, 'source'),
        `${reason}; a published event cites only sources with an archived copy (wayback_url and sha256).`,
      ),
    )
  }
  return out
}

/**
 * `video h:mm:ss`, `video hh:mm:ss`, `video m:ss` or `video mm:ss`: minutes and seconds 00–59,
 * two-digit minutes after an hour, and no further digit, colon or letter after the seconds (a
 * range such as `video 00:12:34–00:13:10` or a note in brackets may follow).
 */
export const VIDEO_LOCATOR = /^video\s+(?:\d{1,2}:[0-5]\d|[0-5]?\d):[0-5]\d(?![\p{L}\p{N}:])/iu

/** A locator that claims a video timestamp. */
const VIDEO_LOCATOR_START = /^video\b/i

/**
 * event.video-locator (docs/03 §5: "Video statements need `official-video` (official channel),
 * with a timestamp locator and a transcript"): evidence from an official-video source has a
 * timestamp locator, `video hh:mm:ss` or `video mm:ss`; and a `video …` locator cites an
 * official-video source, not a page, press or NGO source.
 */
export const videoLocator: Rule = (ctx) => {
  const out: Issue[] = []
  for (const ref of eachEvidence(ctx)) {
    const src = ctx.index.sourceById.get(ref.evidence.source)
    if (!src) continue
    const locator = ref.evidence.locator.trim()
    if (src.value.kind !== 'official-video') {
      if (!VIDEO_LOCATOR_START.test(locator)) continue
      out.push(
        issue(
          'event.video-locator',
          atEvidence(ref, 'locator'),
          `Locator "${ref.evidence.locator}" is a video timestamp but the source "${src.value.id}" is of kind ${src.value.kind}; expected a video statement to cite an official-video source (official channel, transcript in archive/text).`,
        ),
      )
      continue
    }
    if (VIDEO_LOCATOR.test(locator)) continue
    out.push(
      issue(
        'event.video-locator',
        atEvidence(ref, 'locator'),
        `Locator "${ref.evidence.locator}" cites the official-video source "${src.value.id}"; expected a timestamp such as "video 00:12:34".`,
      ),
    )
  }
  return out
}

// ---------------------------------------------------------------------------------------------
// Sources and the archive

/**
 * A Wayback Machine snapshot (docs/03 §5 `https://web.archive.org/web/{timestamp}/{url}`,
 * docs/06 §6): a 14-digit timestamp, an optional two-letter mode such as `id_`, then the
 * archived URL.
 */
const WAYBACK_URL = /^https?:\/\/web\.archive\.org\/web\/\d{14}(?:[a-z]{2}_)?\/(\S+)$/

/** A URL reduced for comparison: no scheme, no `www.`, lowercase host, no default port or trailing slash. */
function comparableUrl(url: string): string {
  const s = url
    .trim()
    .replace(/^[a-z]+:\/\//i, '')
    .replace(/^www\./i, '')
  const slash = s.indexOf('/')
  const host = (slash === -1 ? s : s.slice(0, slash)).toLowerCase().replace(/:(?:80|443)$/, '')
  const rest = slash === -1 ? '' : s.slice(slash)
  return `${host}${rest}`.replace(/\/+$/, '')
}

/** Issues on the shape of a source's wayback_url (not null). */
function waybackIssues(src: Located<Source>): Issue[] {
  const s = src.value
  if (s.wayback_url === null) return []
  const match = WAYBACK_URL.exec(s.wayback_url)
  if (match === null) {
    return [
      issue(
        'source.archive-required',
        atSource(src, 'wayback_url'),
        `wayback_url ${s.wayback_url} is not a Wayback Machine snapshot; expected https://web.archive.org/web/{14-digit timestamp}/{url} as pnpm archive records it (other archives go in archive_url_alt).`,
      ),
    ]
  }
  const archived = match[1] ?? ''
  if (!/^https?:\/\//i.test(s.url) || comparableUrl(archived) === comparableUrl(s.url)) return []
  return [
    issue(
      'source.archive-required',
      atSource(src, 'wayback_url'),
      `wayback_url is a snapshot of ${archived}, not of the source url ${s.url}; expected a snapshot of the url (check the capture, or note the redirect in notes).`,
      'warning',
    ),
  ]
}

/**
 * source.archive-required (docs/03 §5, docs/02 §12.3, docs/06 §6): every source has wayback_url,
 * sha256 and retrieved_at, plus bytes and content_type once wayback_url is set. A wayback_url is
 * a Wayback Machine snapshot (error otherwise), of the source url (warning otherwise: a redirect
 * can explain it). Dataset rows pointing at data/structured are exempt from the rest
 * (source.dataset-origin checks their origin). A capture recorded as archive_status: failed is a
 * warning: the source is kept but cannot support an event until archived (docs/06 §6); it records
 * `wayback_url: null` and `sha256: null`, so a failed capture that still carries either is an
 * error (the record contradicts itself).
 */
export const archiveRequired: Rule = (ctx) => {
  const out: Issue[] = []
  for (const src of ctx.dataset.sources) {
    const s = src.value
    out.push(...waybackIssues(src))
    if (isDatasetRow(s)) continue
    if (s.archive_status === 'failed') {
      const set = [
        ...(s.wayback_url !== null ? ['wayback_url'] : []),
        ...(s.sha256 !== null ? ['sha256'] : []),
      ]
      if (set.length > 0) {
        out.push(
          issue(
            'source.archive-required',
            atSource(src, 'archive_status'),
            `archive_status is failed but ${list(set)} ${set.length > 1 ? 'are' : 'is'} set; expected wayback_url: null and sha256: null for a failed capture (docs/06 §6), or archive_status: archived once the capture succeeded.`,
          ),
        )
        continue
      }
      out.push(
        issue(
          'source.archive-required',
          atSource(src, 'archive_status'),
          `The capture of ${s.url} failed (archive_status: failed); the source cannot support a confirmed or published event until it is archived.`,
          'warning',
        ),
      )
      continue
    }
    const missing = missingArchive(s)
    if (s.retrieved_at === null) missing.push('retrieved_at')
    if (s.wayback_url !== null) {
      if (s.bytes === null) missing.push('bytes')
      if (s.content_type === null) missing.push('content_type')
    }
    if (missing.length === 0) continue
    out.push(
      issue(
        'source.archive-required',
        atSource(src),
        `Source lacks ${list(missing)}; expected wayback_url, sha256 and retrieved_at, with bytes and content_type of the archived copy.`,
      ),
    )
  }
  return out
}

/**
 * source.text-file (docs/03 §1, §5): text_file is exactly archive/text/{id}.txt and the file
 * exists. null is allowed only for dataset rows and failed captures, never for official-video
 * sources, whose transcript is required.
 */
export const textFile: Rule = (ctx) => {
  const out: Issue[] = []
  for (const src of ctx.dataset.sources) {
    const s = src.value
    const expected = `archive/text/${s.id}.txt`
    if (s.text_file === null) {
      if (s.kind === 'official-video') {
        out.push(
          issue(
            'source.text-file',
            atSource(src, 'text_file'),
            `text_file is null but an official-video source needs its transcript; expected "${expected}".`,
          ),
        )
      } else if (!isDatasetRow(s) && s.archive_status !== 'failed') {
        out.push(
          issue(
            'source.text-file',
            atSource(src, 'text_file'),
            `text_file is null; expected "${expected}" holding the extracted text.`,
          ),
        )
      }
      continue
    }
    if (s.text_file !== expected) {
      out.push(
        issue(
          'source.text-file',
          atSource(src, 'text_file'),
          `text_file is "${s.text_file}"; expected "${expected}".`,
        ),
      )
    }
    if (!ctx.dataset.archiveTextIds.has(s.id)) {
      out.push(
        issue(
          'source.text-file',
          atSource(src, 'text_file'),
          `${expected} does not exist; expected the extracted text of the source.`,
        ),
      )
    }
  }
  return out
}

/**
 * Ids of the sources that support something that is or will be public: evidence of an event past
 * `draft`, a structured row, a qualifying vote (votes.yaml), and the origin of a dataset row
 * cited by any of these.
 */
function supportingSourceIds(ctx: ValidationContext): Set<string> {
  const ids = new Set<string>()
  for (const e of ctx.dataset.events) {
    if (e.value.status === 'draft') continue
    for (const ev of e.value.evidence) ids.add(ev.source)
  }
  for (const table of STRUCTURED_TABLE_NAMES) {
    for (const row of ctx.dataset.structured[table] ?? []) ids.add(row.value.source)
  }
  for (const v of ctx.methodology.votes?.value.votes ?? []) ids.add(v.source)
  for (const id of [...ids]) {
    const origin = ctx.index.sourceById.get(id)?.value.origin
    if (origin !== undefined) ids.add(origin)
  }
  return ids
}

/**
 * source.archive-index (docs/03 §1, docs/06 §6): archive/index.csv agrees with the source
 * records. The index is append-only, so a source may have several rows (a failed capture, then
 * a successful retry; a later re-archive): the record is compared with the row whose wayback_url
 * equals its own, else with the latest row. An archived source (wayback_url set) has an index
 * row: the row written by `pnpm archive` is the trace that the hash came from the archiving tool,
 * so a missing row is an error when the source supports an event past draft, a structured row
 * or a qualifying vote, and a warning otherwise. The row's url, wayback_url, sha256 and bytes
 * equal the record's (bytes compared when both are set). An index row naming no source record
 * is a warning.
 */
export const archiveIndex: Rule = (ctx) => {
  const out: Issue[] = []
  let supporting: Set<string> | null = null
  for (const src of ctx.dataset.sources) {
    const s = src.value
    if (s.wayback_url === null) continue
    const rows = ctx.index.archiveIndexRowsById.get(s.id) ?? []
    const row = rows.find((r) => r.value.wayback_url === s.wayback_url) ?? rows.at(-1)
    // A malformed index row is already reported by schema.archive-index.
    if (!row && ctx.dataset.invalidIds.has(s.id)) continue
    if (!row) {
      supporting ??= supportingSourceIds(ctx)
      const needed = supporting.has(s.id)
      out.push(
        issue(
          'source.archive-index',
          atSource(src),
          needed
            ? `Source "${s.id}" has a wayback_url but no row in archive/index.csv, and it supports an event, a structured row or a qualifying vote; expected the row written by pnpm archive (the trace that the hash comes from the archiving tool).`
            : `Source "${s.id}" has a wayback_url but no row in archive/index.csv; expected the row written by pnpm archive.`,
          needed ? 'error' : 'warning',
        ),
      )
      continue
    }
    const where =
      row.line === undefined ? 'archive/index.csv' : `archive/index.csv line ${row.line}`
    const r = row.value
    const pairs: [string, unknown, unknown][] = [
      ['url', r.url, s.url],
      ['wayback_url', r.wayback_url, s.wayback_url],
      ['sha256', r.sha256, s.sha256],
    ]
    if (r.bytes !== null && s.bytes !== null) pairs.push(['bytes', r.bytes, s.bytes])
    for (const [field, indexed, recorded] of pairs) {
      if (indexed === recorded) continue
      out.push(
        issue(
          'source.archive-index',
          atSource(src, field),
          `${where} has ${field} ${show(indexed)} but the source record has ${show(recorded)}; they must agree.`,
        ),
      )
    }
  }
  for (const row of ctx.dataset.archiveIndex) {
    const id = row.value.src_id
    if (ctx.index.sourceById.has(id) || ctx.dataset.invalidIds.has(id)) continue
    out.push(
      issue(
        'source.archive-index',
        { file: row.file, id, line: row.line },
        `archive/index.csv lists "${id}" but no source record exists; expected ${sourcePath(id)}.`,
        'warning',
      ),
    )
  }
  return out
}

/**
 * source.dataset-origin (docs/03 §5): a dataset row pointing at data/structured names, in
 * origin, an existing source of kind dataset that is archived (wayback_url and sha256, capture
 * not recorded as failed).
 */
export const datasetOrigin: Rule = (ctx) => {
  const out: Issue[] = []
  for (const src of ctx.dataset.sources) {
    const s = src.value
    if (!isDatasetRow(s)) continue
    const at = atSource(src, 'origin')
    if (s.origin === undefined) {
      out.push(
        issue(
          'source.dataset-origin',
          at,
          `Dataset-row source pointing at ${s.url} names no origin; expected the id of the archived dataset source the table was built from.`,
        ),
      )
      continue
    }
    const origin = ctx.index.sourceById.get(s.origin)
    if (!origin) {
      if (ctx.dataset.invalidIds.has(s.origin)) continue
      out.push(
        issue(
          'source.dataset-origin',
          at,
          `origin "${s.origin}" does not exist; expected an archived dataset source at ${sourcePath(s.origin)}.`,
        ),
      )
      continue
    }
    if (origin.value.kind !== 'dataset') {
      out.push(
        issue(
          'source.dataset-origin',
          at,
          `origin "${s.origin}" is of kind ${origin.value.kind}; expected kind dataset.`,
        ),
      )
    }
    const missing = missingArchive(origin.value)
    if (missing.length > 0) {
      out.push(
        issue(
          'source.dataset-origin',
          at,
          `origin "${s.origin}" lacks ${list(missing)}; expected an archived dataset source.`,
        ),
      )
    } else if (origin.value.archive_status === 'failed') {
      out.push(
        issue(
          'source.dataset-origin',
          at,
          `origin "${s.origin}" is a failed capture (archive_status: failed); expected an archived dataset source.`,
        ),
      )
    }
  }
  return out
}

/**
 * source.orphan (docs/03 §5, warning): a source cited by no event evidence, no qualifying vote
 * (votes.yaml), no structured row, no lead, no other source's origin and no corrections entry
 * (before/after.evidence). Needs votes.yaml.
 */
export const orphan: Rule = (ctx) => {
  const votes = ctx.methodology.votes
  if (votes === null) return []
  const cited = new Set<string>()
  for (const e of ctx.dataset.events) for (const ev of e.value.evidence) cited.add(ev.source)
  for (const v of votes.value.votes) cited.add(v.source)
  for (const table of STRUCTURED_TABLE_NAMES) {
    for (const row of ctx.dataset.structured[table] ?? []) cited.add(row.value.source)
  }
  for (const lead of ctx.dataset.leads) {
    for (const ls of lead.value.sources) if ('source' in ls) cited.add(ls.source)
  }
  for (const src of ctx.dataset.sources) {
    const origin = src.value.origin
    if (origin !== undefined && origin !== src.value.id) cited.add(origin)
  }
  // A source a correction removed from an event stays in the tree for good (never delete data);
  // the corrections log cites it through before/after.evidence (source ids or evidence entries).
  for (const c of ctx.dataset.corrections) {
    for (const side of [c.value.before.evidence, c.value.after.evidence]) {
      if (!Array.isArray(side)) continue
      for (const item of side) {
        if (typeof item === 'string') cited.add(item)
        else if (
          item &&
          typeof item === 'object' &&
          typeof (item as { source?: unknown }).source === 'string'
        ) {
          cited.add((item as { source: string }).source)
        }
      }
    }
  }

  const out: Issue[] = []
  for (const src of ctx.dataset.sources) {
    if (cited.has(src.value.id)) continue
    out.push(
      issue(
        'source.orphan',
        atSource(src),
        `Source "${src.value.id}" is cited by no event, qualifying vote, structured row, lead or other source's origin.`,
      ),
    )
  }
  return out
}

export const rules: Rule[] = [
  quoteInArchive,
  quoteTranslation,
  evidenceSourceKnown,
  evidenceArchived,
  videoLocator,
  archiveRequired,
  textFile,
  archiveIndex,
  datasetOrigin,
  orphan,
]
