/**
 * Records of data/ as the API publishes them (docs/04 §2 step 6, packages/schema/src/api.ts):
 * snake_case keys, every optional field present and `null` when absent, never a missing key.
 *
 * - Sources (docs/03 §5): the record, with `archive_status`, `archive_url_alt`, `excerpt`,
 *   `origin` and `notes` null when absent.
 * - Events (docs/03 §4): the record, with the indicator's name and category from the methodology,
 *   `scored` (status published, scope gaza, scored indicator: docs/02 §3, D-12, D-14), the event's
 *   evaluation at the build date (`at_build`, docs/02 §3, §6), the previous computed value of the
 *   same country and indicator (`previous_points`, computed events only), and the ids of the
 *   corrections and published replies that name it. Optional fields are null when absent: `end`
 *   (always null for repeatable events), `points_rationale`, `actor` (and `actor.name`),
 *   `supersedes`, evidence `quote_en` / `quote_fr`, `review.second_read` (and its `notes`),
 *   `review.reviewed_by`, `review.reviewed_at`, `review.notes`; `related` is [] and `generated`
 *   false when absent.
 * - Replies (docs/03 §9) with `notes` null when absent; corrections (docs/03 §8) with the event's
 *   country and the commit that added the entry, `flagged_ref` null when absent, `before` and
 *   `after` copied as written.
 * - Country registry fields (docs/03 §3) without the research notes and `gov_sources`, which are
 *   not published: dated memberships normalised to {since, until, note}, and `member_of`, the
 *   memberships held on the build date in MEMBERSHIP_KEYS order.
 *
 * Pure: no clock, no I/O (D-25). Arrays the build does not own (evidence, scope, related) keep
 * the record's order; id lists passed in are sorted by code unit.
 */
import {
  type ApiCorrection,
  type ApiEvent,
  type ApiReply,
  type ApiScoredCountry,
  type ApiSource,
  type Correction,
  type Country,
  type Event,
  MEMBERSHIP_KEYS,
  type Membership,
  type Methodology,
  PUBLIC_STATUSES,
  type Reply,
  type Source,
} from '@gai/schema'
import { type EventEvaluation, SCORED_SCOPE, SCORING_STATUS } from '@gai/scoring'

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0
}

/** A sorted copy of an id list (code-unit order). */
function sortedIds(ids: readonly string[]): string[] {
  return [...ids].sort(compareStrings)
}

/** A source record as published (docs/03 §5). */
export function toApiSource(s: Source): ApiSource {
  return {
    id: s.id,
    kind: s.kind,
    title: s.title,
    publisher: s.publisher,
    publisher_type: s.publisher_type,
    url: s.url,
    wayback_url: s.wayback_url,
    archive_status: s.archive_status ?? null,
    archive_url_alt: s.archive_url_alt ?? null,
    sha256: s.sha256,
    bytes: s.bytes,
    content_type: s.content_type,
    retrieved_at: s.retrieved_at,
    language: s.language,
    date: s.date,
    text_file: s.text_file,
    excerpt: s.excerpt ?? null,
    origin: s.origin ?? null,
    notes: s.notes ?? null,
  }
}

export interface ApiEventInfo {
  /** For the indicator's name, category and `scored` flag. */
  methodology: Methodology
  /** The event's EventEvaluation at the build date (from CountryScore.events). */
  evaluation: EventEvaluation
  /**
   * Computed events: points of the computed event of the same country and indicator in force the
   * day before (`previousComputedPoints`), else null. Ignored (null) for other types.
   */
  previousPoints: number | null
  /** Ids of the corrections log entries naming the event. */
  corrections: readonly string[]
  /** Ids of the published replies contesting the event. */
  replies: readonly string[]
}

/**
 * An event as published (docs/03 §4), with its evaluation at the build date. Throws when the
 * indicator is not in the methodology or the evaluation belongs to another event.
 */
export function toApiEvent(e: Event, info: ApiEventInfo): ApiEvent {
  const ind = info.methodology.indicatorById.get(e.indicator)
  if (ind === undefined) {
    throw new Error(
      `event ${e.id}: indicator ${e.indicator} is not in methodology ${info.methodology.version}`,
    )
  }
  const ev = info.evaluation
  if (ev.id !== e.id) throw new Error(`event ${e.id}: evaluation of ${ev.id} passed`)
  const r = e.review
  return {
    id: e.id,
    revision: e.revision,
    country: e.country,
    indicator: e.indicator,
    indicator_name: { en: ind.name.en, fr: ind.name.fr },
    category: ind.category,
    type: e.type,
    date: e.date,
    end: e.type === 'repeatable' ? null : (e.end ?? null),
    points: e.points,
    points_rationale: e.points_rationale ?? null,
    confidence: e.confidence,
    scope: [...e.scope],
    summary: { en: e.summary.en, fr: e.summary.fr },
    actor:
      e.actor === undefined ? null : { en: e.actor.en, fr: e.actor.fr, name: e.actor.name ?? null },
    evidence: e.evidence.map((x) => ({
      source: x.source,
      quote: x.quote,
      quote_lang: x.quote_lang,
      quote_en: x.quote_en ?? null,
      quote_fr: x.quote_fr ?? null,
      locator: x.locator,
    })),
    status: e.status,
    supersedes: e.supersedes ?? null,
    related: [...(e.related ?? [])],
    generated: e.generated ?? false,
    review: {
      drafted_by: r.drafted_by,
      drafted_at: r.drafted_at,
      second_read:
        r.second_read === null || r.second_read === undefined
          ? null
          : {
              by: r.second_read.by,
              at: r.second_read.at,
              verdict: r.second_read.verdict,
              notes: r.second_read.notes ?? null,
            },
      reviewed_by: r.reviewed_by ?? null,
      reviewed_at: r.reviewed_at ?? null,
      notes: r.notes ?? null,
    },
    scored: e.status === SCORING_STATUS && e.scope.includes(SCORED_SCOPE) && ind.scored,
    at_build: {
      reason: ev.reason,
      factor: ev.factor,
      weight: ev.weight,
      value: ev.value,
      counted: ev.counted,
      qualifies: ev.qualifies,
      by: ev.by,
    },
    previous_points: e.type === 'computed' ? info.previousPoints : null,
    corrections: sortedIds(info.corrections),
    replies: sortedIds(info.replies),
  }
}

/**
 * Event id → points of the computed event of the same country and indicator in force the day
 * before it starts: the previous one of its series (by date then id) when that one ends on this
 * event's date (`end` is exclusive, docs/02 §3). Null for the first value of a series, after a gap
 * (a month without FTS funding, a SIPRI release or Comtrade year without a row of the country: the
 * value before was 0 or no data, so the new value is a change), and for every event that is not
 * computed. Every event passed gets an entry.
 */
export function previousComputedPoints(events: readonly Event[]): Map<string, number | null> {
  const out = new Map<string, number | null>()
  const computed = events
    .filter((e) => e.type === 'computed')
    .sort((a, b) => compareStrings(a.date, b.date) || compareStrings(a.id, b.id))
  const last = new Map<string, Event>()
  for (const e of computed) {
    const key = `${e.country}\u0000${e.indicator}`
    const prev = last.get(key)
    out.set(e.id, prev !== undefined && prev.end === e.date ? prev.points : null)
    last.set(key, e)
  }
  for (const e of events) if (e.type !== 'computed') out.set(e.id, null)
  return out
}

/** A right-of-reply record as published (docs/03 §9). */
export function toApiReply(r: Reply): ApiReply {
  return {
    id: r.id,
    country: r.country,
    received_at: r.received_at,
    published_at: r.published_at,
    from: { org: r.from.org, role: r.from.role },
    contests: [...r.contests],
    text: { original: r.text.original, lang: r.text.lang, en: r.text.en, fr: r.text.fr },
    response: { en: r.response.en, fr: r.response.fr },
    outcome: r.outcome,
    notes: r.notes ?? null,
  }
}

/**
 * A corrections log entry as published (docs/03 §8). `country`: the event's country, null when the
 * event is not in the dataset; `commit`: the commit that added the entry, null when unknown.
 */
export function toApiCorrection(
  c: Correction,
  country: string | null,
  commit: string | null,
): ApiCorrection {
  return {
    id: c.id,
    date: c.date,
    event: c.event,
    country,
    kind: c.kind,
    flagged_by: c.flagged_by,
    flagged_ref: c.flagged_ref ?? null,
    before: { ...c.before },
    after: { ...c.after },
    reason: c.reason,
    commit,
  }
}

/** Registry fields of a country (docs/03 §3), as ApiScoredCountry and ApiExcludedCountry hold them. */
export type RegistryFieldsOut = Pick<
  ApiScoredCountry,
  | 'iso3'
  | 'iso2'
  | 'm49'
  | 'name'
  | 'region'
  | 'subregion'
  | 'un_member'
  | 'observer'
  | 'memberships'
  | 'member_of'
  | 'recognises_palestine_since'
>

type ApiMembershipValue = RegistryFieldsOut['memberships']['eu']

function apiMembership(m: Membership): ApiMembershipValue {
  if (typeof m === 'boolean') return m
  return { since: m.since, until: m.until ?? null, note: m.note ?? null }
}

/**
 * Held on `date`: `true`; a dated period with a start on or before `date` and no end, or an end
 * on or after `date` (inclusive).
 */
function heldOn(m: Membership, date: string): boolean {
  if (typeof m === 'boolean') return m
  return (
    m.since !== null &&
    m.since <= date &&
    (m.until === null || m.until === undefined || m.until >= date)
  )
}

/**
 * The registry fields of a country at `date`: memberships normalised, `member_of` the
 * memberships held on `date` (a Security Council term with from ≤ date ≤ to, `to` null =
 * ongoing), in MEMBERSHIP_KEYS order, and the date the country recognised Palestine. Research
 * notes and `gov_sources` are not published.
 */
export function registryFields(c: Country, date: string): RegistryFieldsOut {
  const ms = c.memberships
  const memberOf = MEMBERSHIP_KEYS.filter((k) =>
    k === 'unsc'
      ? ms.unsc.some((t) => t.from <= date && (t.to === null || t.to >= date))
      : heldOn(ms[k], date),
  )
  return {
    iso3: c.iso3,
    iso2: c.iso2,
    m49: c.m49,
    name: { en: c.name.en, fr: c.name.fr },
    region: c.region,
    subregion: c.subregion,
    un_member: c.un_member,
    observer: c.observer,
    memberships: {
      unsc: ms.unsc.map((t) => ({ from: t.from, to: t.to, permanent: t.permanent })),
      eu: apiMembership(ms.eu),
      nato: apiMembership(ms.nato),
      arab_league: apiMembership(ms.arab_league),
      oic: apiMembership(ms.oic),
      g20: apiMembership(ms.g20),
      g7: apiMembership(ms.g7),
      brics: apiMembership(ms.brics),
    },
    member_of: memberOf,
    recognises_palestine_since: c.recognises_palestine.since,
  }
}

/** True for the statuses whose events are published (PUBLIC_STATUSES). */
export function isPublicStatus(status: string): boolean {
  return PUBLIC_STATUSES.includes(status)
}
