/**
 * Validation rules for the corrections log and the git history (docs/03 §8 and §11, docs/08 §5,
 * CLAUDE.md "never delete data").
 *
 * Two families:
 * - rules on the current log (`correction.event-known`, `correction.kind-consistent`), which
 *   always run;
 * - rules comparing the working tree with the dataset at the git base ref (`never-delete`,
 *   `status-regression`, `required-on-edit`, `append-only`), which run only when `ctx.base` is
 *   set. When the base could not be read, `correction.base-unavailable` says so once.
 *
 * Every rule reads only the context: no clock, no file system, no git. Base records are compared
 * through their parsed value when it passes today's schema (so both sides went through the same
 * zod transforms), through the raw YAML otherwise.
 */
import { parseEventId, parseLeadId, parseReplyId, parseSourceId } from '../../ids.js'
import { type Issue, type IssueLocation, issue } from '../../issues.js'
import type { Dataset, Located } from '../../load/dataset.js'
import type { BaseRecord, BaseSnapshot } from '../../load/git.js'
import type { Correction } from '../../records.js'
import type { Rule } from '../context.js'
import { unreadableFiles } from './shared.js'

const CORRECTIONS_FILE = 'data/corrections.yaml'

/**
 * Fields whose change on a published event requires a corrections entry (docs/03 §11). Evidence
 * is compared on EVIDENCE_KEYS only.
 */
export const EDIT_FIELDS = ['points', 'date', 'confidence', 'evidence'] as const

/**
 * The evidence fields an edit is judged on: the source, the verbatim quote, its language and the
 * locator. The translations quote_en and quote_fr sit beside the original (CLAUDE.md, docs/03 §4),
 * so adding or fixing one is not an evidence change and needs no corrections entry.
 */
export const EVIDENCE_KEYS = ['source', 'quote', 'quote_lang', 'locator'] as const

/**
 * Statuses of an event that has been public: published, and the states a published event can move
 * to (docs/03 §4). Edits to such an event need a corrections entry, whatever its status now.
 */
export const PUBLIC_STATUSES: readonly string[] = [
  'published',
  'corrected',
  'superseded',
  'retracted',
]

/** Keys of a correction's `before` / `after` checked against the diff. */
export const DIFF_KEYS = ['date', 'points', 'confidence', 'end', 'evidence'] as const

// ---------------------------------------------------------------------------------------------
// Helpers

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys)
  if (value !== null && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const key of Object.keys(value).sort()) {
      out[key] = sortKeys((value as Record<string, unknown>)[key])
    }
    return out
  }
  return value
}

/** JSON with object keys sorted at every depth; an absent value reads as null. */
export function canonicalJson(value: unknown): string {
  return JSON.stringify(sortKeys(value ?? null)) ?? 'null'
}

const same = (a: unknown, b: unknown): boolean => canonicalJson(a) === canonicalJson(b)

/**
 * Evidence reduced to EVIDENCE_KEYS: each entry that is an object keeps only those keys (the
 * translations and any other key are left out); anything else (a source id, a malformed raw
 * value) is kept as it is.
 */
function evidenceCore(value: unknown): unknown {
  if (!Array.isArray(value)) return value
  return value.map((ev) => {
    if (ev === null || typeof ev !== 'object' || Array.isArray(ev)) return ev
    const out: Record<string, unknown> = {}
    for (const key of EVIDENCE_KEYS) {
      if (Object.hasOwn(ev, key)) out[key] = (ev as Record<string, unknown>)[key]
    }
    return out
  })
}

/** Equality of two values of the event field `key`; evidence is compared on EVIDENCE_KEYS. */
const sameField = (key: string, a: unknown, b: unknown): boolean =>
  key === 'evidence' ? same(evidenceCore(a), evidenceCore(b)) : same(a, b)

const hasOwn = (record: object, key: string): boolean => Object.hasOwn(record, key)

/**
 * The value a correction gives for `key`, compared with the event's value. `evidence` may be
 * recorded as the list of cited source ids (the form docs/03 §8 entries use, e.g. the fixture
 * `[src_…, src_…]`) or as full evidence entries: a list of strings is compared with the event's
 * source ids in order, anything else with the full evidence.
 */
function eventValueFor(key: string, given: unknown, event: Record<string, unknown>): unknown {
  const value = event[key]
  if (key !== 'evidence') return value
  if (Array.isArray(given) && given.every((x) => typeof x === 'string') && Array.isArray(value)) {
    return value.map((ev) =>
      ev !== null && typeof ev === 'object' ? (ev as { source?: unknown }).source : ev,
    )
  }
  return value
}

/** The base record as a plain object: parsed value when valid today, raw YAML otherwise. */
function fieldsOf<T>(rec: BaseRecord<T>): Record<string, unknown> {
  return rec.value !== null ? (rec.value as unknown as Record<string, unknown>) : rec.raw
}

function at(rec: Located<unknown>, id: string, path?: string): IssueLocation {
  const loc: IssueLocation = { file: rec.file, id, line: rec.line }
  if (path !== undefined) loc.path = path
  return loc
}

const shortRef = (base: BaseSnapshot): string => base.commit.slice(0, 10)

/** True when a file named `{id}.yaml` exists anywhere under `dir` in the working tree. */
function fileWithIdUnder(ds: Dataset, dir: string, id: string): boolean {
  const suffix = `/${id}.yaml`
  return ds.files.some((f) => f.startsWith(`${dir}/`) && f.endsWith(suffix))
}

// ---------------------------------------------------------------------------------------------
// correction.base-unavailable

/**
 * correction.base-unavailable (docs/03 §11): the git base ref was requested but could not be
 * read, so the edit, deletion and append-only checks did not run. One warning, on the log file.
 */
const baseUnavailable: Rule = (ctx) => {
  if (ctx.base !== null || ctx.baseError === undefined) return []
  return [
    issue(
      'correction.base-unavailable',
      { file: CORRECTIONS_FILE },
      `the git base ref could not be read (${ctx.baseError}), so the edit, deletion and append-only checks were skipped; expected a readable base ref`,
    ),
  ]
}

// ---------------------------------------------------------------------------------------------
// correction.never-delete

/**
 * correction.never-delete (CLAUDE.md, docs/03 §11): every event, source, correction, reply and
 * lead present on the base ref is still present. A record that failed its schema (`invalidIds`;
 * for sources, `invalid.source`) or whose file cannot be parsed still counts as present. Sources
 * and replies are one file each, so a file named after the id counts too. Base sources, replies
 * and leads carry no file in the snapshot; the documented path is derived from the id
 * (`data/sources` etc. when it cannot be).
 */
const neverDelete: Rule = (ctx) => {
  const base = ctx.base
  if (base === null) return []
  const ds = ctx.dataset
  const unreadable = unreadableFiles(ds)
  const ref = shortRef(base)
  const out: Issue[] = []
  const report = (kind: string, id: string, file: string, remedy: string) =>
    out.push(
      issue(
        'correction.never-delete',
        { file, id },
        `${kind} ${id} exists on the base ref ${ref} and is missing from the working tree; ${remedy}`,
      ),
    )

  const eventIds = new Set(ds.events.map((e) => e.value.id))
  for (const [id, rec] of base.events) {
    if (eventIds.has(id) || ds.invalidIds.has(id) || unreadable.has(rec.file)) continue
    report(
      'event',
      id,
      rec.file,
      'events are never deleted: restore it and set status retracted with a retraction entry',
    )
  }

  const sourceIds = new Set(ds.sources.map((s) => s.value.id))
  for (const id of base.sourceIds) {
    if (sourceIds.has(id) || ds.invalid.source.has(id) || fileWithIdUnder(ds, 'data/sources', id)) {
      continue
    }
    const parsed = parseSourceId(id)
    const file = parsed ? `data/sources/${parsed.date.slice(0, 4)}/${id}.yaml` : 'data/sources'
    report('source', id, file, 'sources are never deleted: restore the file')
  }

  const correctionIds = new Set(ds.corrections.map((c) => c.value.id))
  for (const [id, rec] of base.corrections) {
    if (correctionIds.has(id) || ds.invalidIds.has(id) || unreadable.has(rec.file)) continue
    report('correction', id, rec.file, 'the corrections log is append-only: restore the entry')
  }

  const replyIds = new Set(ds.replies.map((r) => r.value.id))
  for (const id of base.replyIds) {
    if (replyIds.has(id) || ds.invalidIds.has(id) || fileWithIdUnder(ds, 'data/replies', id)) {
      continue
    }
    const parsed = parseReplyId(id)
    const file = parsed ? `data/replies/${parsed.iso3}/${id}.yaml` : 'data/replies'
    report('reply', id, file, 'replies are never deleted: restore the file')
  }

  const leadIds = new Set(ds.leads.map((l) => l.value.id))
  for (const id of base.leadIds) {
    if (leadIds.has(id) || ds.invalidIds.has(id)) continue
    const parsed = parseLeadId(id)
    const file = parsed ? `data/leads/${parsed.iso3}.yaml` : 'data/leads'
    if (unreadable.has(file)) continue
    report('lead', id, file, 'leads are never deleted: restore it and set status dropped')
  }
  return out
}

// ---------------------------------------------------------------------------------------------
// correction.status-regression

/**
 * correction.status-regression (docs/03 §11): an event that was public on the base ref
 * (PUBLIC_STATUSES) does not go back to draft or reviewed. Retracting, superseding or correcting it is not a regression.
 */
const statusRegression: Rule = (ctx) => {
  const base = ctx.base
  if (base === null) return []
  const out: Issue[] = []
  for (const e of ctx.dataset.events) {
    const b = base.events.get(e.value.id)
    if (b === undefined || !PUBLIC_STATUSES.includes(String(b.raw.status))) continue
    const now = e.value.status
    if (now !== 'draft' && now !== 'reviewed') continue
    out.push(
      issue(
        'correction.status-regression',
        at(e, e.value.id, 'status'),
        `status is ${now} but the event is published on the base ref ${shortRef(base)}; a published event stays published, or is corrected, superseded or retracted`,
      ),
    )
  }
  return out
}

// ---------------------------------------------------------------------------------------------
// correction.required-on-edit

/**
 * correction.required-on-edit (docs/03 §11, docs/08 §5). For every event that was public on the
 * base ref (PUBLIC_STATUSES) whose points, date, confidence or evidence changed, or whose status
 * entered or left retracted (leaving it needs an entry of kind correction), evidence being
 * compared on its source, quote, quote_lang and locator (EVIDENCE_KEYS; adding or fixing a
 * translation, quote_en or quote_fr, is not an evidence change, in the diff or in the entries'
 * before/after):
 * - a new corrections entry (id absent from the base log) names the event, of kind retraction
 *   when it was retracted and of kind correction otherwise (reported on the event);
 * - a change to points, date, confidence or evidence bumps `revision` above the base revision
 *   (reported on the event);
 * - the new entries record each changed field: some new entry gives it in `before` and some new
 *   entry gives it in `after` ("a matching corrections entry", docs/03 §11; the log "records what
 *   changed", docs/02 §3), reported on the event at the field;
 * - the `before` / `after` values the new entries give for date, points, confidence, end and
 *   evidence match the base and current values (reported on the entry, at
 *   `before.{key}`/`after.{key}`). Evidence may be given as the list of source ids.
 *
 * The before/after check also runs on new entries for a base-published event whose tracked
 * fields did not change (e.g. an entry recording a new `end`): whatever an entry says must be
 * true. When several new entries name the same event they read as a chain in log order: the
 * first entry giving `before.k` is checked against the base, the last one giving `after.k`
 * against the working tree.
 */
const requiredOnEdit: Rule = (ctx) => {
  const base = ctx.base
  if (base === null) return []
  const ref = shortRef(base)
  const out: Issue[] = []
  for (const e of ctx.dataset.events) {
    const id = e.value.id
    const b = base.events.get(id)
    if (b === undefined || !PUBLIC_STATUSES.includes(String(b.raw.status))) continue
    const was = fieldsOf(b)
    const now = e.value as unknown as Record<string, unknown>
    const changed = EDIT_FIELDS.filter((k) => !sameField(k, was[k], now[k]))
    // Entering or leaving `retracted` is logged; staying retracted is not a new edit.
    const retracted = e.value.status === 'retracted' && b.raw.status !== 'retracted'
    const unretracted = b.raw.status === 'retracted' && e.value.status !== 'retracted'
    const entries = (ctx.index.correctionsByEvent.get(id) ?? []).filter(
      (c) => !base.corrections.has(c.value.id),
    )

    if (changed.length > 0 || retracted || unretracted) {
      const what = [
        ...(changed.length > 0 ? [`${changed.join(', ')} changed`] : []),
        ...(retracted ? ['status changed to retracted'] : []),
        ...(unretracted ? [`status changed from retracted to ${e.value.status}`] : []),
      ].join(' and ')
      const kind = retracted ? 'retraction' : 'correction'
      if (entries.length === 0) {
        out.push(
          issue(
            'correction.required-on-edit',
            at(e, id),
            `${what} since the base ref ${ref} and ${CORRECTIONS_FILE} has no new entry for ${id}; expected a new entry of kind ${kind}`,
          ),
        )
      } else if (!entries.some((c) => c.value.kind === kind)) {
        const listed = entries.map((c) => `${c.value.id} (${c.value.kind})`).join(', ')
        out.push(
          issue(
            'correction.required-on-edit',
            at(e, id),
            `${what} since the base ref ${ref} but the new entries for ${id} are ${listed}; expected one of kind ${kind}`,
          ),
        )
      }
      if (entries.length > 0) {
        for (const key of changed) {
          const sides = [
            ...(entries.some((c) => hasOwn(c.value.before, key)) ? [] : [`before.${key}`]),
            ...(entries.some((c) => hasOwn(c.value.after, key)) ? [] : [`after.${key}`]),
          ]
          if (sides.length === 0) continue
          const listed = entries.map((c) => c.value.id).join(', ')
          out.push(
            issue(
              'correction.required-on-edit',
              at(e, id, key),
              `${key} changed since the base ref ${ref} but the new entries for ${id} (${listed}) do not record it in ${sides.join(' and ')}; expected the entry to give the ${key} before and after the change`,
            ),
          )
        }
      }
      if (changed.length > 0) {
        const baseRevision = was.revision
        if (typeof baseRevision === 'number' && !(e.value.revision > baseRevision)) {
          out.push(
            issue(
              'correction.required-on-edit',
              at(e, id, 'revision'),
              `${changed.join(', ')} changed but revision is ${e.value.revision}, as on the base ref ${ref}; expected revision ${baseRevision + 1} or more`,
            ),
          )
        }
      }
    }

    out.push(...diffMismatches(id, entries, was, now, ref))
  }
  return out
}

/** before/after keys of new entries that disagree with the base or the working tree. */
function diffMismatches(
  eventId: string,
  entries: Located<Correction>[],
  was: Record<string, unknown>,
  now: Record<string, unknown>,
  ref: string,
): Issue[] {
  const out: Issue[] = []
  for (const key of DIFF_KEYS) {
    const first = entries.find((c) => hasOwn(c.value.before, key))
    if (first !== undefined) {
      const given = first.value.before[key]
      const expected = eventValueFor(key, given, was)
      if (!sameField(key, given, expected)) {
        out.push(
          issue(
            'correction.required-on-edit',
            at(first, first.value.id, `before.${key}`),
            `before.${key} is ${canonicalJson(given)} but ${eventId} has ${key} ${canonicalJson(expected)} on the base ref ${ref}; expected the base value`,
          ),
        )
      }
    }
    const last = entries.findLast((c) => hasOwn(c.value.after, key))
    if (last !== undefined) {
      const given = last.value.after[key]
      const expected = eventValueFor(key, given, now)
      if (!sameField(key, given, expected)) {
        out.push(
          issue(
            'correction.required-on-edit',
            at(last, last.value.id, `after.${key}`),
            `after.${key} is ${canonicalJson(given)} but ${eventId} now has ${key} ${canonicalJson(expected)}; expected the current value`,
          ),
        )
      }
    }
  }
  return out
}

// ---------------------------------------------------------------------------------------------
// correction.append-only

/**
 * correction.append-only (docs/03 §8): an entry present on the base ref is unchanged. A warning:
 * fixing a typo in a reason is sometimes right, but it should be a deliberate choice.
 */
const appendOnly: Rule = (ctx) => {
  const base = ctx.base
  if (base === null) return []
  const out: Issue[] = []
  for (const c of ctx.dataset.corrections) {
    const b = base.corrections.get(c.value.id)
    if (b === undefined) continue
    const was = fieldsOf(b)
    const now = c.value as unknown as Record<string, unknown>
    const keys = [...new Set([...Object.keys(was), ...Object.keys(now)])].sort()
    const edited = keys.filter((k) => !same(was[k], now[k]))
    if (edited.length === 0) continue
    out.push(
      issue(
        'correction.append-only',
        at(c, c.value.id),
        `${edited.join(', ')} differ from the entry on the base ref ${shortRef(base)}; expected existing entries unchanged and a new entry appended instead`,
      ),
    )
  }
  return out
}

// ---------------------------------------------------------------------------------------------
// correction.event-known

/**
 * correction.event-known (docs/03 §8): the event a correction names exists in data/events.
 * Generated events (build output, docs/03 §2) are not in data/ and are skipped; so are events
 * that failed their schema or sit in a country file that cannot be parsed.
 */
const eventKnown: Rule = (ctx) => {
  const ds = ctx.dataset
  const unreadable = unreadableFiles(ds)
  const out: Issue[] = []
  for (const c of ds.corrections) {
    const eventId = c.value.event
    const parsed = parseEventId(eventId)
    if (parsed?.generated) continue
    if (ctx.index.eventById.has(eventId) || ds.invalidIds.has(eventId)) continue
    if (parsed && unreadable.has(`data/events/${parsed.iso3}.yaml`)) continue
    out.push(
      issue(
        'correction.event-known',
        at(c, c.value.id, 'event'),
        `event ${eventId} is not in data/events; expected the id of an existing event`,
      ),
    )
  }
  return out
}

// ---------------------------------------------------------------------------------------------
// correction.kind-consistent

/**
 * correction.kind-consistent (docs/03 §8, §11):
 * - a retraction entry leaves its event with status retracted (reported on the entry);
 * - each correction entry bumps the event revision, so an event named by n entries of kind
 *   correction has revision ≥ 1 + n (reported once, on the event). Retractions do not count.
 * Entries naming an unknown event are left to `correction.event-known`.
 */
const kindConsistent: Rule = (ctx) => {
  const out: Issue[] = []
  for (const c of ctx.dataset.corrections) {
    if (c.value.kind !== 'retraction') continue
    const e = ctx.index.eventById.get(c.value.event)
    if (e === undefined || e.value.status === 'retracted') continue
    out.push(
      issue(
        'correction.kind-consistent',
        at(c, c.value.id, 'kind'),
        `the entry is a retraction but event ${c.value.event} has status ${e.value.status}; expected status retracted`,
      ),
    )
  }
  for (const [eventId, entries] of ctx.index.correctionsByEvent) {
    const e = ctx.index.eventById.get(eventId)
    if (e === undefined) continue
    const corrections = entries.filter((c) => c.value.kind === 'correction')
    if (corrections.length === 0) continue
    const minimum = 1 + corrections.length
    if (e.value.revision >= minimum) continue
    const ids = corrections.map((c) => c.value.id).join(', ')
    out.push(
      issue(
        'correction.kind-consistent',
        at(e, eventId, 'revision'),
        `revision is ${e.value.revision} but ${corrections.length} correction ${corrections.length === 1 ? 'entry names' : 'entries name'} the event (${ids}); expected revision ${minimum} or more`,
      ),
    )
  }
  return out
}

export const rules: Rule[] = [
  baseUnavailable,
  neverDelete,
  statusRegression,
  requiredOnEdit,
  appendOnly,
  eventKnown,
  kindConsistent,
]
