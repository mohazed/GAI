/**
 * Validation rules: events (docs/03 §4, docs/02 §2–§4 and §12.1).
 *
 * Every rule reads `ctx.dataset.events`. Rules that need the event's indicator skip events whose
 * indicator is unknown (reported once, by `event.indicator-known`) and return nothing when
 * indicators.yaml failed to load. Evidence rules that depend on a source's kind or publisher skip
 * an event citing a source that failed its schema (its kind is unknown; `schema.source` reports
 * it). Rules never read the clock.
 */
import { parseEventId } from '../../ids.js'
import { type Issue, type IssueLocation, issue } from '../../issues.js'
import type { Located } from '../../load/dataset.js'
import type { ConfidenceLevel, Indicator, PointsSpec } from '../../methodology/schemas.js'
import { type Confidence, daysBetween, type SourceKind, WINDOW_START } from '../../primitives.js'
import type { Event, Source } from '../../records.js'
import type { Rule, ValidationContext } from '../context.js'
import { foldName } from '../normalise.js'
import { compareEventIds } from '../order.js'
import { eventNotLoaded, unreadableFiles } from './shared.js'
import { notArchivedReason } from './sources.js'

type LocatedEvent = Located<Event>

const COUNTRIES_FILE = 'data/countries.yaml'

/** docs/02 §4: confirmed needs one source of these kinds (used when confidence.yaml is absent). */
const DEFAULT_CONFIRMED_KINDS: readonly SourceKind[] = ['official', 'court', 'dataset']
/** docs/03 §4: corroborated needs two distinct publishers (used when confidence.yaml is absent). */
const DEFAULT_MIN_PUBLISHERS = 2
/** docs/02 §3: a repeatable event stops counting after 730 days (used when decay.yaml is absent). */
const DEFAULT_END_DAYS = 730
/** docs/02 §4: the official denial of a disputed event. */
const DENIAL_KINDS: readonly SourceKind[] = ['official', 'official-video']

// ---------------------------------------------------------------------------------------------
// Helpers

function at(e: LocatedEvent): IssueLocation {
  return { file: e.file, id: e.value.id, line: e.line }
}

/** `a`, `a or b`, `a, b or c`. */
function orList(items: readonly string[]): string {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')} or ${items.at(-1)}`
}

/** Events paired with their indicator; events with an unknown indicator are left out. */
function withIndicator(ctx: ValidationContext): [LocatedEvent, Indicator][] {
  const out: [LocatedEvent, Indicator][] = []
  for (const e of ctx.dataset.events) {
    const ind = ctx.methodology.indicatorById.get(e.value.indicator)
    if (ind) out.push([e, ind])
  }
  return out
}

interface EvidenceSources {
  /** Distinct cited sources that exist, in evidence order. */
  known: Source[]
  /** True when a cited source failed its schema, so its kind and publisher are unknown. */
  undecidable: boolean
}

function evidenceSources(ctx: ValidationContext, e: Event): EvidenceSources {
  const known: Source[] = []
  const seen = new Set<string>()
  let undecidable = false
  for (const ev of e.evidence) {
    if (seen.has(ev.source)) continue
    seen.add(ev.source)
    const src = ctx.index.sourceById.get(ev.source)
    if (src) known.push(src.value)
    else if (ctx.dataset.invalid.source.has(ev.source)) undecidable = true
  }
  return { known, undecidable }
}

function distinctKinds(sources: Source[]): string[] {
  return [...new Set(sources.map((s) => s.kind))]
}

function confidenceLevel(ctx: ValidationContext, id: Confidence): ConfidenceLevel | undefined {
  return ctx.methodology.confidence?.value.levels.find((l) => l.id === id)
}

function compareByDateThenId(a: LocatedEvent, b: LocatedEvent): number {
  if (a.value.date !== b.value.date) return a.value.date < b.value.date ? -1 : 1
  return compareEventIds(a.value.id, b.value.id)
}

/** Statuses that never score and are left out of the overlap and duplicate checks. */
function isWithdrawn(e: Event): boolean {
  return e.status === 'retracted' || e.status === 'superseded'
}

// ---------------------------------------------------------------------------------------------
// Rules

/**
 * event.country-known — docs/03 §4, D-10: the country is registered and not excluded. A code whose
 * countries.yaml entry failed its schema is not reported (`schema.country` covers it).
 */
function countryKnown(ctx: ValidationContext): Issue[] {
  const ds = ctx.dataset
  // countries.yaml missing or unreadable: the load issue covers it, do not cascade.
  if (ds.countries.length === 0 && ds.issues.some((i) => i.file === COUNTRIES_FILE)) return []
  const out: Issue[] = []
  for (const e of ds.events) {
    const iso3 = e.value.country
    const country = ctx.index.countryByIso3.get(iso3)
    if (!country) {
      // Only a malformed countries.yaml entry hides the code; a malformed record of another kind
      // (an assessment for that country, say) does not.
      if (ds.invalid.country.has(iso3)) continue
      out.push(
        issue(
          'event.country-known',
          at(e),
          `Country ${iso3} is not in ${COUNTRIES_FILE}; expected the ISO3 code of a registered country.`,
        ),
      )
    } else if (country.value.excluded) {
      out.push(
        issue(
          'event.country-known',
          at(e),
          `Country ${iso3} is excluded from the index (D-10); expected a scored country.`,
        ),
      )
    }
  }
  return out
}

/** event.indicator-known — docs/02 §2: the indicator is in the current methodology. */
function indicatorKnown(ctx: ValidationContext): Issue[] {
  const m = ctx.methodology
  if (!m.indicatorsFile) return []
  const file = m.indicatorsFile.file
  return ctx.dataset.events
    .filter((e) => !m.indicatorById.has(e.value.indicator))
    .map((e) =>
      issue(
        'event.indicator-known',
        at(e),
        `Indicator ${e.value.indicator} is not in ${file}; expected an indicator id of methodology ${m.version}.`,
      ),
    )
}

/** event.type-matches-indicator — docs/02 §3: the type is the one indicators.yaml gives. */
function typeMatchesIndicator(ctx: ValidationContext): Issue[] {
  return withIndicator(ctx)
    .filter(([e, ind]) => e.value.type !== ind.type)
    .map(([e, ind]) =>
      issue(
        'event.type-matches-indicator',
        at(e),
        `Type ${e.value.type} differs from the type of ${ind.id} in indicators.yaml; expected ${ind.type}.`,
      ),
    )
}

/**
 * event.not-generated — D-08, docs/03 §4 and §7: data/events holds hand-authored events only.
 * Generated indicators, the computed type, generated ids (with a slug) and `generated: true`
 * belong to build output. One issue per event, listing every reason.
 */
function notGenerated(ctx: ValidationContext): Issue[] {
  const out: Issue[] = []
  for (const e of ctx.dataset.events) {
    const reasons: string[] = []
    const ind = ctx.methodology.indicatorById.get(e.value.indicator)
    if (ind?.authoring === 'generated') {
      const from = ind.generated_from ? ` (${ind.generated_from})` : ''
      reasons.push(`indicator ${ind.id} is generated${from}`)
    }
    if (e.value.type === 'computed') reasons.push('the type is computed')
    const parsed = parseEventId(e.value.id)
    if (parsed?.generated) reasons.push(`the id carries the generated-event slug ${parsed.slug}`)
    if (e.value.generated === true) reasons.push('generated is true')
    if (reasons.length === 0) continue
    out.push(
      issue(
        'event.not-generated',
        at(e),
        `data/events holds hand-authored events only (D-08), but ${reasons.join('; ')}.`,
      ),
    )
  }
  return out
}

const SIGN_HOLDS: Record<Indicator['sign'], (p: number) => boolean> = {
  negative: (p) => p < 0,
  positive: (p) => p > 0,
  mixed: (p) => p !== 0,
}

const SIGN_EXPECTED: Record<Indicator['sign'], string> = {
  negative: 'below 0',
  positive: 'above 0',
  mixed: 'other than 0',
}

/** event.points-sign — docs/03 §4: negative ⇒ p < 0, positive ⇒ p > 0, mixed ⇒ p ≠ 0. */
function pointsSign(ctx: ValidationContext): Issue[] {
  return withIndicator(ctx)
    .filter(([e, ind]) => !SIGN_HOLDS[ind.sign](e.value.points))
    .map(([e, ind]) =>
      issue(
        'event.points-sign',
        at(e),
        `Points ${e.value.points} do not match the ${ind.sign} sign of ${ind.id}; expected a value ${SIGN_EXPECTED[ind.sign]}.`,
      ),
    )
}

/** What a points spec allows, as a test and as words for the message. */
function allowedPoints(spec: PointsSpec): { ok: (p: number) => boolean; expected: string } {
  const exactly = (value: number, what: string) => ({
    ok: (p: number) => p === value,
    expected: `the ${what} value ${value}`,
  })
  switch (spec.kind) {
    case 'fixed':
      return exactly(spec.value, 'fixed')
    case 'per_instance':
    case 'tiers': {
      if (spec.kind === 'per_instance' && spec.value !== undefined) {
        return exactly(spec.value, 'per-instance')
      }
      const tiers = spec.tiers ?? []
      return {
        ok: (p) => tiers.some((t) => t.value === p),
        expected: `one of the tier values ${orList(tiers.map((t) => `${t.value} (${t.key})`))}`,
      }
    }
    case 'formula':
      return {
        ok: (p) => p >= spec.range.min && p <= spec.range.max,
        expected: `a value from ${spec.range.min} to ${spec.range.max} (formula ${spec.ref})`,
      }
  }
}

/**
 * event.points-range — docs/03 §4, docs/02 §2: the points equal the fixed or per-instance value,
 * are one of the tier values, or lie in the formula range. Checked only when the sign is right,
 * so a wrong sign is reported once.
 */
function pointsRange(ctx: ValidationContext): Issue[] {
  const out: Issue[] = []
  for (const [e, ind] of withIndicator(ctx)) {
    const p = e.value.points
    if (!SIGN_HOLDS[ind.sign](p)) continue
    const allowed = allowedPoints(ind.points)
    if (allowed.ok(p)) continue
    out.push(
      issue(
        'event.points-range',
        at(e),
        `Points ${p} are not allowed for ${ind.id}; expected ${allowed.expected}.`,
      ),
    )
  }
  return out
}

/** event.points-rationale — docs/03 §4: scaled indicators carry a non-empty points_rationale. */
function pointsRationale(ctx: ValidationContext): Issue[] {
  return withIndicator(ctx)
    .filter(([e, ind]) => ind.scaled && (e.value.points_rationale ?? '').trim() === '')
    .map(([e, ind]) =>
      issue(
        'event.points-rationale',
        at(e),
        `points_rationale is missing or empty; ${ind.id} is scaled, so the event says why it carries ${e.value.points} points.`,
      ),
    )
}

/**
 * event.end — docs/03 §4, docs/02 §3: only standing events carry an end (exclusive), and
 * end ≥ date (end = date is an empty window, allowed).
 */
function eventEnd(ctx: ValidationContext): Issue[] {
  const out: Issue[] = []
  for (const e of ctx.dataset.events) {
    const { end, date, type } = e.value
    if (end === null || end === undefined) continue
    if (type !== 'standing') {
      out.push(
        issue(
          'event.end',
          at(e),
          `end ${end} is set on a ${type} event; expected end only on standing events.`,
        ),
      )
    }
    if (end < date) {
      out.push(
        issue('event.end', at(e), `end ${end} is before the date ${date}; expected end ≥ date.`),
      )
    }
  }
  return out
}

/**
 * event.date-in-window — docs/02 §1, docs/02 §2 (B8): every indicator measures conduct since
 * WINDOW_START (2023-10-07), so an event is dated on or after it. A repeatable (or computed) event
 * dated earlier is an error. A standing event dated earlier is a warning: a state that already
 * held on 2023-10-07 counts from that day, as B8 counts a pre-existing recognition as a standing
 * state from 2023-10-07, so its date is expected to be 2023-10-07 (and its id to carry it). Every
 * status is checked: a retracted event keeps the date it was published with.
 */
function dateInWindow(ctx: ValidationContext): Issue[] {
  const out: Issue[] = []
  for (const e of ctx.dataset.events) {
    const { date, type } = e.value
    if (date >= WINDOW_START) continue
    const loc: IssueLocation = { ...at(e), path: 'date' }
    if (type === 'standing') {
      out.push(
        issue(
          'event.date-in-window',
          loc,
          `Date ${date} is before the window start ${WINDOW_START}; a standing state that began earlier is dated from ${WINDOW_START}, like the B8 pre-existing recognition (docs/02 §2), so expected date ${WINDOW_START}.`,
          'warning',
        ),
      )
    } else {
      out.push(
        issue(
          'event.date-in-window',
          loc,
          `Date ${date} is before the window start ${WINDOW_START}; a ${type} event is dated on or after ${WINDOW_START} (docs/02 §1).`,
        ),
      )
    }
  }
  return out
}

/** Publisher types of the press and NGOs (docs/03 §5): their records are not official documents. */
const NON_OFFICIAL_PUBLISHER_TYPES: readonly string[] = ['press', 'ngo']
/** Kinds that claim a primary document of a state or a court. */
const PRIMARY_KINDS: readonly SourceKind[] = ['official', 'official-video', 'court']

/**
 * Why a source of an allowed kind still cannot make an event confirmed, or null when it can: it
 * is not archived (docs/06 §6: a failed capture "cannot support a confirmed event until
 * archived"; CLAUDE.md: nothing scores without an archived copy), or it claims a primary kind
 * while its publisher is the press or an NGO (docs/03 §5: press articles are never the sole
 * support of a confirmed event).
 */
function confirmedBlocker(ctx: ValidationContext, s: Source): string | null {
  const archive = notArchivedReason(ctx, s)
  if (archive !== null) return archive
  if (PRIMARY_KINDS.includes(s.kind) && NON_OFFICIAL_PUBLISHER_TYPES.includes(s.publisher_type)) {
    return `Source "${s.id}" is of kind ${s.kind} but its publisher_type is ${s.publisher_type}`
  }
  return null
}

/**
 * event.confirmed-source-kind — docs/02 §4 and §12.2: a confirmed event cites at least one
 * existing source whose kind is in confidence.yaml `confirmed.requires.any_source_kind`, that is
 * archived and whose publisher_type is not press or ngo (see `confirmedBlocker`). Checked at
 * every status: a draft cannot be marked confirmed on a failed capture either.
 */
function confirmedSourceKind(ctx: ValidationContext): Issue[] {
  const kinds: readonly SourceKind[] =
    confidenceLevel(ctx, 'confirmed')?.requires.any_source_kind ?? DEFAULT_CONFIRMED_KINDS
  const out: Issue[] = []
  for (const e of ctx.dataset.events) {
    if (e.value.confidence !== 'confirmed') continue
    const { known, undecidable } = evidenceSources(ctx, e.value)
    if (undecidable) continue
    const ofKind = known.filter((s) => kinds.includes(s.kind))
    const blockers = ofKind.map((s) => confirmedBlocker(ctx, s))
    if (blockers.some((b) => b === null)) continue
    let message: string
    if (ofKind.length === 0) {
      const found = distinctKinds(known)
      const foundText = found.length > 0 ? ` (found ${found.join(', ')})` : ''
      message = `Confidence is confirmed but no evidence source is of kind ${orList(kinds)}${foundText}; expected at least one.`
    } else {
      message = `Confidence is confirmed but no evidence source of kind ${orList(kinds)} can support it: ${blockers.join('; ')}; expected at least one archived primary source.`
    }
    out.push(issue('event.confirmed-source-kind', at(e), message))
  }
  return out
}

/** The document a source records: its sha256, else its url without scheme, `www.` or trailing slash. */
function documentKey(s: Source): string {
  if (s.sha256 !== null) return `sha256:${s.sha256}`
  const url = s.url
    .trim()
    .replace(/^[a-z]+:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\/+$/, '')
  return `url:${url.toLowerCase()}`
}

/**
 * event.corroborated-publishers — docs/02 §4 ("two independent `ngo` or `press` sources"),
 * docs/03 §4: the evidence sources whose kind is in `corroborated.requires.publisher_kinds`
 * (every kind when absent) come from at least `min_distinct_publishers` distinct publishers,
 * counting one publisher per distinct document. Publishers are compared with `foldName` (case,
 * whitespace runs, U+00A0, compatibility forms and trailing punctuation fold); documents by
 * sha256, else by url, so one article filed twice under two publisher names counts once.
 */
function corroboratedPublishers(ctx: ValidationContext): Issue[] {
  const requires = confidenceLevel(ctx, 'corroborated')?.requires
  const min = requires?.min_distinct_publishers ?? DEFAULT_MIN_PUBLISHERS
  const kinds = requires?.publisher_kinds ?? null
  const out: Issue[] = []
  for (const e of ctx.dataset.events) {
    if (e.value.confidence !== 'corroborated') continue
    const { known, undecidable } = evidenceSources(ctx, e.value)
    if (undecidable) continue
    const publishers = new Map<string, string>()
    const documents = new Set<string>()
    let repeated = 0
    for (const s of known) {
      if (kinds !== null && !kinds.includes(s.kind)) continue
      const doc = documentKey(s)
      if (documents.has(doc)) {
        repeated++
        continue
      }
      documents.add(doc)
      const key = foldName(s.publisher)
      if (!publishers.has(key)) publishers.set(key, s.publisher.trim())
    }
    if (publishers.size >= min) continue
    const among = kinds !== null ? ` among sources of kind ${orList(kinds)}` : ''
    const names = publishers.size > 0 ? ` (${[...publishers.values()].join(', ')})` : ''
    const same =
      repeated > 0
        ? `, not counting ${repeated} source(s) that record the same document (same sha256 or url) as another`
        : ''
    out.push(
      issue(
        'event.corroborated-publishers',
        at(e),
        `Confidence is corroborated but the evidence has ${publishers.size} distinct publisher(s)${among}${names}${same}; expected at least ${min}.`,
      ),
    )
  }
  return out
}

/**
 * event.disputed-both-sides — docs/02 §4 ("an official denial is on record (a reply or an
 * official source) and counter-evidence exists; both sides linked"): a disputed event links both
 * sides, either a reply contesting it, or evidence with an official denial (a source of kind
 * official or official-video) and a source from another publisher (compared with `foldName`).
 * Two releases of one government are one side.
 */
function disputedBothSides(ctx: ValidationContext): Issue[] {
  const out: Issue[] = []
  for (const e of ctx.dataset.events) {
    if (e.value.confidence !== 'disputed') continue
    if ((ctx.index.repliesByEvent.get(e.value.id)?.length ?? 0) > 0) continue
    const { known, undecidable } = evidenceSources(ctx, e.value)
    if (undecidable) continue
    const denials = known.filter((s) => DENIAL_KINDS.includes(s.kind))
    const bothSides = denials.some((d) =>
      known.some((s) => foldName(s.publisher) !== foldName(d.publisher)),
    )
    if (bothSides) continue
    const found =
      denials.length === 0
        ? `, none of kind ${orList(DENIAL_KINDS)}`
        : ', all from the publisher of the denial'
    out.push(
      issue(
        'event.disputed-both-sides',
        at(e),
        `Confidence is disputed but no reply contests the event and the evidence cites ${known.length} source(s)${found}; expected a contesting reply, or an official denial and a source from another publisher.`,
      ),
    )
  }
  return out
}

/**
 * event.statement-requirements — docs/03 §4, docs/02 §2 (B9/B10): `evidence.requires_actor`
 * needs actor.name; `evidence.source_kinds` needs one cited source of those kinds.
 */
function statementRequirements(ctx: ValidationContext): Issue[] {
  const out: Issue[] = []
  for (const [e, ind] of withIndicator(ctx)) {
    if (ind.evidence.requires_actor && (e.value.actor?.name ?? '').trim() === '') {
      out.push(
        issue(
          'event.statement-requirements',
          at(e),
          `actor.name is missing or empty; ${ind.id} requires the name of the person speaking.`,
        ),
      )
    }
    const kinds = ind.evidence.source_kinds
    if (kinds === null) continue
    const { known, undecidable } = evidenceSources(ctx, e.value)
    if (undecidable || known.some((s) => kinds.includes(s.kind))) continue
    const found = distinctKinds(known)
    const foundText = found.length > 0 ? ` (found ${found.join(', ')})` : ''
    out.push(
      issue(
        'event.statement-requirements',
        at(e),
        `No evidence source is of kind ${orList(kinds)}${foundText}; ${ind.id} requires at least one.`,
      ),
    )
  }
  return out
}

/**
 * event.statement-duplicate — docs/02 §2 (B9/B10): same speaker, same day, one event. Among
 * events of indicators with `requires_actor`, not retracted or superseded, events sharing
 * country, indicator, date and actor.name (compared with `foldName`: case, whitespace runs,
 * U+00A0, compatibility forms and trailing punctuation fold) are reported after the first by id
 * order.
 */
function statementDuplicate(ctx: ValidationContext): Issue[] {
  const groups = new Map<string, LocatedEvent[]>()
  for (const [e, ind] of withIndicator(ctx)) {
    if (!ind.evidence.requires_actor || isWithdrawn(e.value)) continue
    const name = foldName(e.value.actor?.name ?? '')
    if (name === '') continue
    const key = [e.value.country, e.value.indicator, e.value.date, name].join('\u0000')
    const list = groups.get(key)
    if (list) list.push(e)
    else groups.set(key, [e])
  }
  const out: Issue[] = []
  for (const list of groups.values()) {
    if (list.length < 2) continue
    const [first, ...rest] = [...list].sort((a, b) => compareEventIds(a.value.id, b.value.id))
    if (!first) continue
    const speaker = (first.value.actor?.name ?? '').trim()
    for (const e of rest) {
      out.push(
        issue(
          'event.statement-duplicate',
          at(e),
          `${first.value.id} already records a ${e.value.indicator} statement by ${speaker} on ${e.value.date}; expected one event per speaker and day.`,
        ),
      )
    }
  }
  return out
}

/** event.published-reviewed — docs/03 §4: published ⇒ reviewed_by and reviewed_at are set. */
function publishedReviewed(ctx: ValidationContext): Issue[] {
  const out: Issue[] = []
  for (const e of ctx.dataset.events) {
    if (e.value.status !== 'published') continue
    const { reviewed_by, reviewed_at } = e.value.review
    const missing: string[] = []
    if ((reviewed_by ?? '').trim() === '') missing.push('review.reviewed_by')
    if (reviewed_at === null || reviewed_at === undefined) missing.push('review.reviewed_at')
    if (missing.length === 0) continue
    out.push(
      issue(
        'event.published-reviewed',
        at(e),
        `Status is published but ${missing.join(' and ')} ${missing.length > 1 ? 'are' : 'is'} missing or empty; expected the reviewer and the review date.`,
      ),
    )
  }
  return out
}

/**
 * event.second-read — docs/03 §11, docs/06 §1.6: reviewed and published events carry the
 * mandatory second reading, with verdict agree.
 */
function secondRead(ctx: ValidationContext): Issue[] {
  const out: Issue[] = []
  for (const e of ctx.dataset.events) {
    const status = e.value.status
    if (status !== 'reviewed' && status !== 'published') continue
    const read = e.value.review.second_read
    if (read === null || read === undefined) {
      out.push(
        issue(
          'event.second-read',
          at(e),
          `Status is ${status} but review.second_read is missing; expected a second reading with verdict agree.`,
        ),
      )
    } else if (read.verdict !== 'agree') {
      out.push(
        issue(
          'event.second-read',
          at(e),
          `Status is ${status} but the second reading by ${read.by} has verdict ${read.verdict}; expected agree.`,
        ),
      )
    }
  }
  return out
}

/**
 * event.references — docs/03 §4: `supersedes` names another existing event of the same country,
 * dated on or before the event ("the earlier event this replaces"); each `related` id names
 * another existing event. Ids of events that failed their schema, or that sit in an events file
 * that cannot be read, count as existing (for those, the country and date are read from the id).
 * Generated events exist only in build outputs, so a `related` link to one is not checked.
 */
function references(ctx: ValidationContext): Issue[] {
  const { eventById } = ctx.index
  const ds = ctx.dataset
  const unreadable = unreadableFiles(ds)
  const out: Issue[] = []
  for (const e of ds.events) {
    const { id, country, date, supersedes, related } = e.value
    if (supersedes !== null && supersedes !== undefined) {
      const target = eventById.get(supersedes)
      const parsed = parseEventId(supersedes)
      if (supersedes === id) {
        out.push(
          issue(
            'event.references',
            at(e),
            `supersedes names the event itself; expected an earlier event of ${country}.`,
          ),
        )
      } else if (!target && !eventNotLoaded(ds, supersedes, unreadable)) {
        out.push(
          issue(
            'event.references',
            at(e),
            `supersedes names ${supersedes}, which is not an event in data/events; expected an existing event id.`,
          ),
        )
      } else {
        const targetCountry = target ? target.value.country : parsed?.iso3
        const targetDate = target ? target.value.date : parsed?.date
        if (targetCountry !== undefined && targetCountry !== country) {
          out.push(
            issue(
              'event.references',
              at(e),
              `supersedes names ${supersedes}, an event of ${targetCountry}; expected an event of ${country}.`,
            ),
          )
        }
        if (targetDate !== undefined && targetDate > date) {
          out.push(
            issue(
              'event.references',
              at(e),
              `supersedes names ${supersedes}, dated ${targetDate}, after this event (${date}); expected the earlier event this one replaces.`,
            ),
          )
        }
      }
    }
    for (const rel of related ?? []) {
      if (rel === id) {
        out.push(
          issue(
            'event.references',
            at(e),
            'related lists the event itself; expected other events.',
          ),
        )
      } else if (
        !eventById.has(rel) &&
        !eventNotLoaded(ds, rel, unreadable) &&
        !parseEventId(rel)?.generated
      ) {
        out.push(
          issue(
            'event.references',
            at(e),
            `related names ${rel}, which is not an event in data/events; expected an existing event id.`,
          ),
        )
      }
    }
  }
  return out
}

interface EventWindow {
  e: LocatedEvent
  /** Day numbers, half-open [start, end). */
  start: number
  end: number
}

/**
 * event.same-points — docs/02 §12.1: for an indicator that is not scaled, two events of one
 * country whose windows overlap carry the same points. Events retracted or superseded, and
 * computed events, are left out. Windows: standing [date, end) (end null = open); repeatable
 * [date, date + decay end_days] inclusive. The later event (by date, then id) is reported,
 * naming the other.
 *
 * Under a methodology that passes methodology.indicator-points, a non-scaled indicator allows a
 * single points value, so event.points-range reports any event this rule would report first.
 * The rule stays as the docs/02 §12.1 check itself, a guard that holds even if a future
 * methodology lets a non-scaled indicator take several values.
 */
function samePoints(ctx: ValidationContext): Issue[] {
  const endDays = ctx.methodology.decay?.value.end_days ?? DEFAULT_END_DAYS
  const day = (d: string) => daysBetween(WINDOW_START, d)
  const groups = new Map<string, { ind: Indicator; windows: EventWindow[] }>()
  for (const [e, ind] of withIndicator(ctx)) {
    if (ind.scaled || isWithdrawn(e.value)) continue
    const { type, date, end } = e.value
    if (type !== 'standing' && type !== 'repeatable') continue
    const start = day(date)
    const stop =
      type === 'repeatable'
        ? start + endDays + 1
        : end === null || end === undefined
          ? Number.POSITIVE_INFINITY
          : day(end)
    if (stop <= start) continue
    const key = `${e.value.country}\u0000${e.value.indicator}`
    const group = groups.get(key)
    const w = { e, start, end: stop }
    if (group) group.windows.push(w)
    else groups.set(key, { ind, windows: [w] })
  }
  const out: Issue[] = []
  for (const { ind, windows } of groups.values()) {
    windows.sort((a, b) => compareByDateThenId(a.e, b.e))
    for (let j = 1; j < windows.length; j++) {
      const later = windows[j]
      if (!later) continue
      for (let i = 0; i < j; i++) {
        const earlier = windows[i]
        if (!earlier) continue
        const overlap = earlier.start < later.end && later.start < earlier.end
        if (!overlap || earlier.e.value.points === later.e.value.points) continue
        out.push(
          issue(
            'event.same-points',
            at(later.e),
            `Points ${later.e.value.points} differ from the ${earlier.e.value.points} points of ${earlier.e.value.id}, whose window overlaps this one; ${ind.id} is not scaled, so expected the same points.`,
          ),
        )
      }
    }
  }
  return out
}

/** Standing indicators whose overlapping records add up today and should not (B-22, B-51). */
export const STACKING_STANDING: readonly string[] = ['A3', 'B7', 'D2']

/** Events of one country grouped by indicator, withdrawn records left out, by date then id. */
function byCountryIndicator(ctx: ValidationContext, indicators: readonly string[]) {
  const groups = new Map<string, LocatedEvent[]>()
  for (const e of ctx.dataset.events) {
    if (isWithdrawn(e.value) || !indicators.includes(e.value.indicator)) continue
    const key = `${e.value.country}\u0000${e.value.indicator}`
    const list = groups.get(key) ?? []
    list.push(e)
    groups.set(key, list)
  }
  for (const list of groups.values()) list.sort(compareByDateThenId)
  return groups
}

/** [date, end) of a standing record: end null or absent is open. */
const holds = (e: Event, day: string): boolean =>
  e.date <= day && (e.end === null || e.end === undefined || day < e.end)

/**
 * event.standing-overlap (B-22, B-51; warning): two standing records of one country under A3, B7
 * or D2 hold on the same day. Methodology 1.0.0 sums them (each designation of B7 adds its
 * points); the "most severe" reading is scheduled for the next version (P-15, P-24), so the
 * overlap is flagged for review. The later record is reported, naming the earlier.
 */
function standingOverlap(ctx: ValidationContext): Issue[] {
  const out: Issue[] = []
  for (const list of byCountryIndicator(ctx, STACKING_STANDING).values()) {
    for (let j = 1; j < list.length; j++) {
      const later = list[j] as LocatedEvent
      if (later.value.type !== 'standing') continue
      const earlier = list
        .slice(0, j)
        .find((e) => e.value.type === 'standing' && holds(e.value, later.value.date))
      if (earlier === undefined) continue
      out.push(
        issue(
          'event.standing-overlap',
          at(later),
          `${later.value.indicator} standing record overlaps ${earlier.value.id}, which still holds on ${later.value.date}; methodology 1.0.0 adds both (B-22), so check that two records are meant, or end the earlier one.`,
        ),
      )
    }
  }
  return out
}

/**
 * event.b5-b6-same-day (B-56; warning): a B5 and a B6 of one country on the same day. B5 and B6
 * replace each other in time (docs/02 §2), so on one day the order between them is undecided.
 */
function b5b6SameDay(ctx: ValidationContext): Issue[] {
  const out: Issue[] = []
  const b5 = new Map<string, LocatedEvent>()
  for (const e of ctx.dataset.events) {
    if (!isWithdrawn(e.value) && e.value.indicator === 'B5') {
      const key = `${e.value.country}\u0000${e.value.date}`
      if (!b5.has(key)) b5.set(key, e)
    }
  }
  for (const e of ctx.dataset.events) {
    if (isWithdrawn(e.value) || e.value.indicator !== 'B6') continue
    const other = b5.get(`${e.value.country}\u0000${e.value.date}`)
    if (other === undefined) continue
    out.push(
      issue(
        'event.b5-b6-same-day',
        at(e),
        `B6 on ${e.value.date}, the day of the B5 ${other.value.id}; B5 and B6 replace each other in time, so check which position was stated last that day.`,
      ),
    )
  }
  return out
}

/**
 * event.d2-open-after-d3 (B-56; warning): a D2 (UNRWA funding suspended) of one country still
 * holds on the day a D3 (funding restored or increased) of that country starts. The resumption
 * ends the suspension (docs/02 §2 D2), so the D2 record's end is expected on or before it.
 */
function d2OpenAfterD3(ctx: ValidationContext): Issue[] {
  const out: Issue[] = []
  const d2 = [...byCountryIndicator(ctx, ['D2']).values()].flat()
  for (const e of ctx.dataset.events) {
    if (isWithdrawn(e.value) || e.value.indicator !== 'D3') continue
    const open = d2.find(
      (s) =>
        s.value.country === e.value.country &&
        s.value.date <= e.value.date &&
        holds(s.value, e.value.date),
    )
    if (open === undefined) continue
    out.push(
      issue(
        'event.d2-open-after-d3',
        at(open),
        `D2 still holds on ${e.value.date}, when D3 ${e.value.id} starts; expected the suspension to end (end ≤ ${e.value.date}) when funding resumes.`,
      ),
    )
  }
  return out
}

export const rules: Rule[] = [
  countryKnown,
  indicatorKnown,
  typeMatchesIndicator,
  notGenerated,
  pointsSign,
  pointsRange,
  pointsRationale,
  eventEnd,
  dateInWindow,
  confirmedSourceKind,
  corroboratedPublishers,
  disputedBothSides,
  statementRequirements,
  statementDuplicate,
  publishedReviewed,
  secondRead,
  references,
  samePoints,
  standingOverlap,
  b5b6SameDay,
  d2OpenAfterD3,
]
