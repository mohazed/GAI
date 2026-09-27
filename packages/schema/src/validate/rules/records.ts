/**
 * Validation rules for identifiers, file layout, the country registry, assessments, replies,
 * leads and structured tables (docs/03 §1–§3 and §6–§10, docs/02 §1 and §8).
 *
 * Every rule reads only the context: no clock, no file system. Records that failed their schema
 * are absent from the dataset; references to their ids (`dataset.invalidIds`) are not reported
 * again as unknown.
 */
import {
  parseCorrectionId,
  parseEventId,
  parseLeadId,
  parseReplyId,
  parseSourceId,
} from '../../ids.js'
import { type Issue, type IssueLocation, issue } from '../../issues.js'
import type { Located } from '../../load/dataset.js'
import { addDays, daysBetween, WINDOW_START } from '../../primitives.js'
import type { Event } from '../../records.js'
import {
  STRUCTURED_ISO3_COLUMN,
  STRUCTURED_TABLE_NAMES,
  type StructuredTableName,
} from '../../structured.js'
import type { Rule, ValidationContext } from '../context.js'

/** Scored entities: the UN member states plus the Holy See, minus ISR and PSE (docs/02 §1). */
export const UNIVERSE_SIZE = 193

/** The only entries flagged `excluded` (D-10). */
export const EXCLUDED_ISO3: readonly string[] = ['ISR', 'PSE']

/** Maximum days between receiving and publishing a reply (docs/03 §9, docs/08 §4). */
export const REPLY_DEADLINE_DAYS = 10

/** Tables with a `window_start` / `window_end` pair (docs/03 §7). */
const WINDOWED_TABLES: readonly StructuredTableName[] = [
  'fts_funding.csv',
  'comtrade_a2.csv',
  'comtrade_c3.csv',
]

// ---------------------------------------------------------------------------------------------
// Helpers

function at(rec: Located<unknown>, id: string, path?: string): IssueLocation {
  const loc: IssueLocation = { file: rec.file, id, line: rec.line }
  if (path !== undefined) loc.path = path
  return loc
}

function where(rec: Located<unknown>): string {
  return rec.line === undefined ? rec.file : `${rec.file}:${rec.line}`
}

const isBlank = (text: string | undefined): boolean => (text ?? '').trim() === ''

/**
 * Order of events inside a country file: date, then id, compared by UTF-16 code units (the
 * order of a plain JavaScript sort, independent of the locale).
 */
export function compareEventOrder(
  a: Pick<Event, 'date' | 'id'>,
  b: Pick<Event, 'date' | 'id'>,
): number {
  if (a.date !== b.date) return a.date < b.date ? -1 : 1
  if (a.id !== b.id) return a.id < b.id ? -1 : 1
  return 0
}

/** Rows of a structured table as plain records, for column access by name. */
function rowsOf(ctx: ValidationContext, table: StructuredTableName) {
  return ctx.dataset.structured[table] as unknown as Located<Record<string, unknown>>[]
}

// ---------------------------------------------------------------------------------------------
// Identifiers (docs/03 §2)

function duplicates<T>(label: string, items: Located<T>[], key: (value: T) => string): Issue[] {
  const first = new Map<string, Located<T>>()
  const out: Issue[] = []
  for (const item of items) {
    const k = key(item.value)
    const prev = first.get(k)
    if (prev === undefined) first.set(k, item)
    else
      out.push(
        issue(
          'id.unique',
          at(item, k),
          `${label} ${k} is already defined at ${where(prev)}; ids are unique per record kind`,
        ),
      )
  }
  return out
}

/**
 * id.unique (docs/03 §2): one record per id and kind. Every occurrence after the first is
 * reported at its own file and line.
 */
const idUnique: Rule = (ctx) => {
  const ds = ctx.dataset
  return [
    ...duplicates('country', ds.countries, (c) => c.iso3),
    ...duplicates('event id', ds.events, (e) => e.id),
    ...duplicates('source id', ds.sources, (s) => s.id),
    ...duplicates('correction id', ds.corrections, (c) => c.id),
    ...duplicates('reply id', ds.replies, (r) => r.id),
    ...duplicates('lead id', ds.leads, (l) => l.id),
    ...duplicates('assessment for country', ds.assessments, (a) => a.country),
  ]
}

/**
 * id.date-matches (docs/03 §2, §8): the date in an id is the record's date. Ids never change,
 * so an event whose date was corrected keeps an id carrying a date that a correction entry
 * names in `before.date` or `after.date`.
 */
const idDateMatches: Rule = (ctx) => {
  const ds = ctx.dataset
  const out: Issue[] = []
  const mismatch = (
    rec: Located<unknown>,
    id: string,
    idDate: string,
    field: string,
    actual: string,
  ) =>
    issue(
      'id.date-matches',
      at(rec, id, field),
      `${field} ${actual} differs from the date ${idDate} in the id; expected them to be equal`,
    )

  for (const e of ds.events) {
    const parsed = parseEventId(e.value.id)
    if (parsed === null || parsed.date === e.value.date) continue
    const corrections = ctx.index.correctionsByEvent.get(e.value.id) ?? []
    const corrected = corrections.some(
      (c) => c.value.before.date === parsed.date || c.value.after.date === parsed.date,
    )
    if (!corrected) {
      out.push(
        issue(
          'id.date-matches',
          at(e, e.value.id, 'date'),
          `event date ${e.value.date} differs from the date ${parsed.date} in the id, and no correction entry records ${parsed.date} as a before or after date; expected them to be equal`,
        ),
      )
    }
  }
  for (const s of ds.sources) {
    const parsed = parseSourceId(s.value.id)
    if (parsed !== null && parsed.date !== s.value.date) {
      out.push(mismatch(s, s.value.id, parsed.date, 'date', s.value.date))
    }
  }
  for (const c of ds.corrections) {
    const parsed = parseCorrectionId(c.value.id)
    if (parsed !== null && parsed.date !== c.value.date) {
      out.push(mismatch(c, c.value.id, parsed.date, 'date', c.value.date))
    }
  }
  for (const r of ds.replies) {
    const parsed = parseReplyId(r.value.id)
    if (parsed !== null && parsed.date !== r.value.received_at) {
      out.push(mismatch(r, r.value.id, parsed.date, 'received_at', r.value.received_at))
    }
  }
  for (const l of ds.leads) {
    const parsed = parseLeadId(l.value.id)
    if (parsed !== null && parsed.date !== l.value.date) {
      out.push(mismatch(l, l.value.id, parsed.date, 'date', l.value.date))
    }
  }
  return out
}

/**
 * id.parts-match (docs/03 §2): the country (and, for events, the indicator) named in an id are
 * the record's own.
 */
const idPartsMatch: Rule = (ctx) => {
  const ds = ctx.dataset
  const out: Issue[] = []
  const country = (rec: Located<unknown>, id: string, idIso3: string, actual: string) =>
    issue(
      'id.parts-match',
      at(rec, id, 'country'),
      `country ${actual} differs from the country ${idIso3} in the id; expected them to be equal`,
    )

  for (const e of ds.events) {
    const parsed = parseEventId(e.value.id)
    if (parsed === null) continue
    if (parsed.iso3 !== e.value.country) {
      out.push(country(e, e.value.id, parsed.iso3, e.value.country))
    }
    if (parsed.indicator !== e.value.indicator) {
      out.push(
        issue(
          'id.parts-match',
          at(e, e.value.id, 'indicator'),
          `indicator ${e.value.indicator} differs from the indicator ${parsed.indicator} in the id; expected them to be equal`,
        ),
      )
    }
  }
  for (const r of ds.replies) {
    const parsed = parseReplyId(r.value.id)
    if (parsed !== null && parsed.iso3 !== r.value.country) {
      out.push(country(r, r.value.id, parsed.iso3, r.value.country))
    }
  }
  for (const l of ds.leads) {
    const parsed = parseLeadId(l.value.id)
    if (parsed !== null && parsed.iso3 !== l.value.country) {
      out.push(country(l, l.value.id, parsed.iso3, l.value.country))
    }
  }
  return out
}

// ---------------------------------------------------------------------------------------------
// Layout (docs/03 §1)

/**
 * layout.file-matches-record (docs/03 §1): events/{ISO3}.yaml, sources/{YYYY}/{id}.yaml (year of
 * the document date), assessments/{ISO3}.yaml, replies/{ISO3}/{id}.yaml, leads/{ISO3}.yaml.
 */
const layoutFileMatchesRecord: Rule = (ctx) => {
  const ds = ctx.dataset
  const out: Issue[] = []
  const check = (rec: Located<unknown>, label: string, id: string, expected: string) => {
    if (rec.file !== expected) {
      out.push(
        issue(
          'layout.file-matches-record',
          at(rec, id),
          `${label} ${id} is in ${rec.file}; expected it in ${expected}`,
        ),
      )
    }
  }
  for (const e of ds.events) {
    check(e, 'event', e.value.id, `data/events/${e.value.country}.yaml`)
  }
  for (const s of ds.sources) {
    check(s, 'source', s.value.id, `data/sources/${s.value.date.slice(0, 4)}/${s.value.id}.yaml`)
  }
  for (const a of ds.assessments) {
    check(a, 'assessment', a.value.country, `data/assessments/${a.value.country}.yaml`)
  }
  for (const r of ds.replies) {
    check(r, 'reply', r.value.id, `data/replies/${r.value.country}/${r.value.id}.yaml`)
  }
  for (const l of ds.leads) {
    check(l, 'lead', l.value.id, `data/leads/${l.value.country}.yaml`)
  }
  return out
}

/**
 * layout.events-sorted (docs/03 §1): inside each events file, events are in non-decreasing
 * (date, id) order (`compareEventOrder`). Only the first event out of order is reported per file.
 */
const layoutEventsSorted: Rule = (ctx) => {
  const byFile = new Map<string, Located<Event>[]>()
  for (const e of ctx.dataset.events) {
    const list = byFile.get(e.file)
    if (list) list.push(e)
    else byFile.set(e.file, [e])
  }
  const out: Issue[] = []
  for (const list of byFile.values()) {
    let prev: Located<Event> | undefined
    for (const e of list) {
      if (prev !== undefined && compareEventOrder(prev.value, e.value) > 0) {
        out.push(
          issue(
            'layout.events-sorted',
            at(e, e.value.id),
            `event ${e.value.id} (${e.value.date}) comes after ${prev.value.id} (${prev.value.date}); expected events sorted by date, then id`,
          ),
        )
        break
      }
      prev = e
    }
  }
  return out
}

// ---------------------------------------------------------------------------------------------
// Countries (docs/03 §3, docs/02 §1)

/**
 * country.excluded (docs/03 §3, D-10): only ISR and PSE are excluded, both must be, and
 * `excluded_reason` is present exactly when `excluded` is true.
 */
const countryExcluded: Rule = (ctx) => {
  const out: Issue[] = []
  for (const c of ctx.dataset.countries) {
    const { iso3, excluded, excluded_reason } = c.value
    const listed = EXCLUDED_ISO3.includes(iso3)
    if (excluded && !listed) {
      out.push(
        issue(
          'country.excluded',
          at(c, iso3, 'excluded'),
          `${iso3} is excluded; only ${EXCLUDED_ISO3.join(' and ')} are excluded (D-10)`,
        ),
      )
    }
    if (!excluded && listed) {
      out.push(
        issue(
          'country.excluded',
          at(c, iso3, 'excluded'),
          `${iso3} is not excluded; expected excluded: true with excluded_reason (D-10)`,
        ),
      )
    }
    if (excluded && excluded_reason === undefined) {
      out.push(
        issue(
          'country.excluded',
          at(c, iso3, 'excluded_reason'),
          `${iso3} is excluded without excluded_reason; expected the reason in EN and FR`,
        ),
      )
    }
    if (!excluded && excluded_reason !== undefined) {
      out.push(
        issue(
          'country.excluded',
          at(c, iso3, 'excluded_reason'),
          `${iso3} carries excluded_reason but is not excluded; expected no excluded_reason`,
        ),
      )
    }
  }
  return out
}

/**
 * country.membership-flags (docs/02 §1, docs/03 §3): every entry is either a UN member or an
 * observer, never both; Security Council terms have to ≥ from (to null = ongoing); dated
 * memberships have until ≥ since when both are set.
 */
const countryMembershipFlags: Rule = (ctx) => {
  const out: Issue[] = []
  for (const c of ctx.dataset.countries) {
    const { iso3, un_member, observer, memberships } = c.value
    if (un_member === observer) {
      out.push(
        issue(
          'country.membership-flags',
          at(c, iso3, 'un_member'),
          `${iso3} has un_member: ${un_member} and observer: ${observer}; expected exactly one of them to be true`,
        ),
      )
    }
    memberships.unsc.forEach((term, i) => {
      if (term.to !== null && term.to < term.from) {
        out.push(
          issue(
            'country.membership-flags',
            at(c, iso3, `memberships.unsc.${i}`),
            `Security Council term of ${iso3} ends on ${term.to}, before it starts on ${term.from}; expected to ≥ from`,
          ),
        )
      }
    })
    for (const [key, value] of Object.entries(memberships)) {
      if (key === 'unsc' || typeof value !== 'object' || value === null || Array.isArray(value)) {
        continue
      }
      const { since, until } = value
      if (since !== null && until !== null && until !== undefined && until < since) {
        out.push(
          issue(
            'country.membership-flags',
            at(c, iso3, `memberships.${key}`),
            `${key} membership of ${iso3} ends on ${until}, before it starts on ${since}; expected until ≥ since`,
          ),
        )
      }
    }
  }
  return out
}

/**
 * country.universe-size (docs/02 §1): the registry lists 193 entries that are not excluded.
 * A warning until the full registry is built.
 */
const countryUniverseSize: Rule = (ctx) => {
  const count = ctx.dataset.countries.filter((c) => !c.value.excluded).length
  if (count === UNIVERSE_SIZE) return []
  return [
    issue(
      'country.universe-size',
      { file: 'data/countries.yaml', id: '-' },
      `countries.yaml has ${count} scored ${count === 1 ? 'entry' : 'entries'} (not excluded); expected ${UNIVERSE_SIZE}`,
    ),
  ]
}

// ---------------------------------------------------------------------------------------------
// Assessments (docs/03 §6, docs/02 §8)

/** assessment.country-known (docs/03 §6): the country is in the registry and is not excluded. */
const assessmentCountryKnown: Rule = (ctx) => {
  const out: Issue[] = []
  for (const a of ctx.dataset.assessments) {
    const iso3 = a.value.country
    const country = ctx.index.countryByIso3.get(iso3)
    if (country === undefined) {
      if (!ctx.dataset.invalidIds.has(iso3)) {
        out.push(
          issue(
            'assessment.country-known',
            at(a, iso3, 'country'),
            `country ${iso3} is not in countries.yaml; expected a registered country`,
          ),
        )
      }
    } else if (country.value.excluded) {
      out.push(
        issue(
          'assessment.country-known',
          at(a, iso3, 'country'),
          `country ${iso3} is excluded (D-10); expected no assessment for it`,
        ),
      )
    }
  }
  return out
}

/**
 * assessment.indicator-known (docs/03 §6): every key is an indicator of the current methodology.
 * Skipped when indicators.yaml failed to load.
 */
const assessmentIndicatorKnown: Rule = (ctx) => {
  const m = ctx.methodology
  if (m.indicatorsFile === null) return []
  const out: Issue[] = []
  for (const a of ctx.dataset.assessments) {
    for (const key of Object.keys(a.value.indicators)) {
      if (!m.indicatorById.has(key)) {
        out.push(
          issue(
            'assessment.indicator-known',
            at(a, a.value.country, `indicators.${key}`),
            `indicator ${key} is not in methodology ${m.version}; expected an indicator id of the current methodology`,
          ),
        )
      }
    }
  }
  return out
}

/**
 * assessment.checked-evidence (docs/03 §6): none-found and no-data carry checked_at, and a
 * non-blank note or at least one query.
 */
const assessmentCheckedEvidence: Rule = (ctx) => {
  const out: Issue[] = []
  for (const a of ctx.dataset.assessments) {
    const iso3 = a.value.country
    for (const [ind, entry] of Object.entries(a.value.indicators)) {
      if (entry.status !== 'none-found' && entry.status !== 'no-data') continue
      const path = `indicators.${ind}`
      if (entry.checked_at === undefined) {
        out.push(
          issue(
            'assessment.checked-evidence',
            at(a, iso3, path),
            `${ind} is ${entry.status} without checked_at; expected the date of the check`,
          ),
        )
      }
      if (isBlank(entry.note) && (entry.queries ?? []).length === 0) {
        out.push(
          issue(
            'assessment.checked-evidence',
            at(a, iso3, path),
            `${ind} is ${entry.status} without a note or queries; expected a non-empty note or at least one query`,
          ),
        )
      }
    }
  }
  return out
}

/**
 * assessment.not-applicable (docs/02 §8): not-applicable carries a note; on an indicator whose
 * methodology rule is `unsc_non_member` (B2), the country has no Security Council term that
 * overlaps the window. Without a clock, a term overlaps when it is ongoing (to null) or ends on
 * or after WINDOW_START, whatever its start.
 */
const assessmentNotApplicable: Rule = (ctx) => {
  const out: Issue[] = []
  for (const a of ctx.dataset.assessments) {
    const iso3 = a.value.country
    const country = ctx.index.countryByIso3.get(iso3)
    for (const [ind, entry] of Object.entries(a.value.indicators)) {
      if (entry.status !== 'not-applicable') continue
      const path = `indicators.${ind}`
      if (isBlank(entry.note)) {
        out.push(
          issue(
            'assessment.not-applicable',
            at(a, iso3, path),
            `${ind} is not-applicable without a note; expected a note giving the reason`,
          ),
        )
      }
      const rule = ctx.methodology.indicatorById.get(ind)?.not_applicable?.rule
      if (rule !== 'unsc_non_member' || country === undefined) continue
      const term = country.value.memberships.unsc.find((t) => t.to === null || t.to >= WINDOW_START)
      if (term !== undefined) {
        out.push(
          issue(
            'assessment.not-applicable',
            at(a, iso3, path),
            `${ind} is not-applicable but ${iso3} has a Security Council term from ${term.from} to ${term.to ?? 'ongoing'} that overlaps the window from ${WINDOW_START}; expected not-applicable only for states never on the Council in the window`,
          ),
        )
      }
    }
  }
  return out
}

/**
 * assessment.has-events-mismatch (docs/03 §6): the build sets has-events from published events,
 * so on hand-authored indicators a hand-set has-events without a published event, or another
 * status beside a published event, is overwritten (warning).
 */
const assessmentHasEventsMismatch: Rule = (ctx) => {
  const m = ctx.methodology
  if (m.indicatorsFile === null) return []
  const out: Issue[] = []
  for (const a of ctx.dataset.assessments) {
    const iso3 = a.value.country
    const published = new Set(
      (ctx.index.eventsByCountry.get(iso3) ?? [])
        .filter((e) => e.value.status === 'published')
        .map((e) => e.value.indicator),
    )
    for (const [ind, entry] of Object.entries(a.value.indicators)) {
      if (m.indicatorById.get(ind)?.authoring !== 'hand') continue
      const path = `indicators.${ind}`
      if (entry.status === 'has-events' && !published.has(ind)) {
        out.push(
          issue(
            'assessment.has-events-mismatch',
            at(a, iso3, path),
            `${ind} is has-events but ${iso3} has no published ${ind} event; the build will overwrite the status`,
          ),
        )
      } else if (entry.status !== 'has-events' && published.has(ind)) {
        out.push(
          issue(
            'assessment.has-events-mismatch',
            at(a, iso3, path),
            `${ind} is ${entry.status} but ${iso3} has a published ${ind} event; expected has-events, which the build will set`,
          ),
        )
      }
    }
  }
  return out
}

/**
 * assessment.unchecked (docs/02 §8): one warning per assessment listing the scored indicators
 * that are missing or unchecked, and one per non-excluded country without an assessment file.
 * Skipped when indicators.yaml failed to load.
 */
const assessmentUnchecked: Rule = (ctx) => {
  const m = ctx.methodology
  if (m.indicatorsFile === null) return []
  const scored = m.indicators.filter((i) => i.scored).map((i) => i.id)
  if (scored.length === 0) return []
  const out: Issue[] = []
  for (const a of ctx.dataset.assessments) {
    const open = scored.filter((id) => {
      const entry = a.value.indicators[id]
      return entry === undefined || entry.status === 'unchecked'
    })
    if (open.length > 0) {
      out.push(
        issue(
          'assessment.unchecked',
          at(a, a.value.country, 'indicators'),
          `${open.length} of ${scored.length} scored indicators of ${a.value.country} are missing or unchecked: ${open.join(', ')}`,
        ),
      )
    }
  }
  for (const c of ctx.dataset.countries) {
    const iso3 = c.value.iso3
    if (c.value.excluded || ctx.index.assessmentByCountry.has(iso3)) continue
    if (ctx.dataset.invalidIds.has(iso3)) continue
    out.push(
      issue(
        'assessment.unchecked',
        at(c, iso3),
        `${iso3} has no data/assessments/${iso3}.yaml, so all ${scored.length} scored indicators are unchecked`,
      ),
    )
  }
  return out
}

// ---------------------------------------------------------------------------------------------
// Replies (docs/03 §9, docs/08 §4)

/** reply.deadline (docs/03 §9): received_at ≤ published_at ≤ received_at + 10 days. */
const replyDeadline: Rule = (ctx) => {
  const out: Issue[] = []
  for (const r of ctx.dataset.replies) {
    const { id, received_at, published_at } = r.value
    const days = daysBetween(received_at, published_at)
    if (days < 0) {
      out.push(
        issue(
          'reply.deadline',
          at(r, id, 'published_at'),
          `published_at ${published_at} is before received_at ${received_at}; expected published_at ≥ received_at`,
        ),
      )
    } else if (days > REPLY_DEADLINE_DAYS) {
      out.push(
        issue(
          'reply.deadline',
          at(r, id, 'published_at'),
          `published_at ${published_at} is ${days} days after received_at ${received_at}; expected publication by ${addDays(received_at, REPLY_DEADLINE_DAYS)}`,
        ),
      )
    }
  }
  return out
}

/** reply.contests-known (docs/03 §9): contested events exist and belong to the reply country. */
const replyContestsKnown: Rule = (ctx) => {
  const out: Issue[] = []
  for (const r of ctx.dataset.replies) {
    r.value.contests.forEach((eventId, i) => {
      const e = ctx.index.eventById.get(eventId)
      if (e === undefined) {
        if (!ctx.dataset.invalidIds.has(eventId)) {
          out.push(
            issue(
              'reply.contests-known',
              at(r, r.value.id, `contests.${i}`),
              `contested event ${eventId} does not exist; expected an event id from data/events`,
            ),
          )
        }
      } else if (e.value.country !== r.value.country) {
        out.push(
          issue(
            'reply.contests-known',
            at(r, r.value.id, `contests.${i}`),
            `contested event ${eventId} belongs to ${e.value.country}; expected an event of ${r.value.country}`,
          ),
        )
      }
    })
  }
  return out
}

/**
 * reply.outcome-consistent (docs/03 §9, docs/08 §4): the outcome applies to every contested
 * event: disputed → confidence disputed; retracted → status retracted; corrected → at least one
 * corrections.yaml entry names the event. Unknown events are left to reply.contests-known.
 */
const replyOutcomeConsistent: Rule = (ctx) => {
  const out: Issue[] = []
  for (const r of ctx.dataset.replies) {
    const { id, outcome } = r.value
    if (outcome === 'none') continue
    r.value.contests.forEach((eventId, i) => {
      const e = ctx.index.eventById.get(eventId)
      if (e === undefined) return
      const loc = at(r, id, `contests.${i}`)
      if (outcome === 'disputed' && e.value.confidence !== 'disputed') {
        out.push(
          issue(
            'reply.outcome-consistent',
            loc,
            `outcome is disputed but ${eventId} has confidence ${e.value.confidence}; expected confidence disputed`,
          ),
        )
      } else if (outcome === 'retracted' && e.value.status !== 'retracted') {
        out.push(
          issue(
            'reply.outcome-consistent',
            loc,
            `outcome is retracted but ${eventId} has status ${e.value.status}; expected status retracted`,
          ),
        )
      } else if (
        outcome === 'corrected' &&
        (ctx.index.correctionsByEvent.get(eventId) ?? []).length === 0
      ) {
        out.push(
          issue(
            'reply.outcome-consistent',
            loc,
            `outcome is corrected but corrections.yaml has no entry for ${eventId}; expected a correction entry`,
          ),
        )
      }
    })
  }
  return out
}

// ---------------------------------------------------------------------------------------------
// Leads (docs/03 §10)

/** lead.status (docs/03 §10): promoted:evt_… names an existing event; dropped carries a reason. */
const leadStatus: Rule = (ctx) => {
  const out: Issue[] = []
  for (const l of ctx.dataset.leads) {
    const { id, status } = l.value
    if (status.startsWith('promoted:')) {
      const target = status.slice('promoted:'.length)
      if (!ctx.index.eventById.has(target) && !ctx.dataset.invalidIds.has(target)) {
        out.push(
          issue(
            'lead.status',
            at(l, id, 'status'),
            `lead is promoted to ${target}, which does not exist; expected an existing event id`,
          ),
        )
      }
    } else if (status === 'dropped' && isBlank(l.value.reason)) {
      out.push(
        issue(
          'lead.status',
          at(l, id, 'reason'),
          `lead ${id} is dropped without a reason; expected a non-empty reason`,
        ),
      )
    }
  }
  return out
}

/** lead.source-kind (docs/03 §10): a `{source: id}` entry names an existing press or NGO source. */
const leadSourceKind: Rule = (ctx) => {
  const out: Issue[] = []
  for (const l of ctx.dataset.leads) {
    l.value.sources.forEach((entry, i) => {
      if (!('source' in entry)) return
      const loc = at(l, l.value.id, `sources.${i}`)
      const src = ctx.index.sourceById.get(entry.source)
      if (src === undefined) {
        if (!ctx.dataset.invalidIds.has(entry.source)) {
          out.push(
            issue(
              'lead.source-kind',
              loc,
              `lead source ${entry.source} does not exist; expected an existing press or ngo source`,
            ),
          )
        }
      } else if (src.value.kind !== 'press' && src.value.kind !== 'ngo') {
        out.push(
          issue(
            'lead.source-kind',
            loc,
            `lead source ${entry.source} is of kind ${src.value.kind}; expected press or ngo`,
          ),
        )
      }
    })
  }
  return out
}

// ---------------------------------------------------------------------------------------------
// Structured tables (docs/03 §7)

/** structured.source-dataset (docs/03 §7): the source column names an existing dataset source. */
const structuredSourceDataset: Rule = (ctx) => {
  const out: Issue[] = []
  for (const table of STRUCTURED_TABLE_NAMES) {
    for (const row of rowsOf(ctx, table)) {
      const sourceId = row.value.source
      if (typeof sourceId !== 'string') continue
      const loc = at(row, `row ${row.line ?? '?'}`, 'source')
      const src = ctx.index.sourceById.get(sourceId)
      if (src === undefined) {
        if (!ctx.dataset.invalidIds.has(sourceId)) {
          out.push(
            issue(
              'structured.source-dataset',
              loc,
              `source ${sourceId} does not exist; expected an existing source of kind dataset`,
            ),
          )
        }
      } else if (src.value.kind !== 'dataset') {
        out.push(
          issue(
            'structured.source-dataset',
            loc,
            `source ${sourceId} is of kind ${src.value.kind}; expected kind dataset`,
          ),
        )
      }
    }
  }
  return out
}

/** structured.iso3-known (docs/03 §7): the table's country column is in countries.yaml (warning). */
const structuredIso3Known: Rule = (ctx) => {
  const out: Issue[] = []
  for (const table of STRUCTURED_TABLE_NAMES) {
    const column = STRUCTURED_ISO3_COLUMN[table]
    for (const row of rowsOf(ctx, table)) {
      const iso3 = row.value[column]
      if (typeof iso3 !== 'string') continue
      if (ctx.index.countryByIso3.has(iso3) || ctx.dataset.invalidIds.has(iso3)) continue
      out.push(
        issue(
          'structured.iso3-known',
          at(row, `row ${row.line ?? '?'}`, column),
          `${column} ${iso3} is not in countries.yaml; expected a registered country code`,
        ),
      )
    }
  }
  return out
}

/** structured.window (docs/03 §7): window_start ≤ window_end. */
const structuredWindow: Rule = (ctx) => {
  const out: Issue[] = []
  for (const table of WINDOWED_TABLES) {
    for (const row of rowsOf(ctx, table)) {
      const { window_start: start, window_end: end } = row.value
      if (typeof start !== 'string' || typeof end !== 'string' || start <= end) continue
      out.push(
        issue(
          'structured.window',
          at(row, `row ${row.line ?? '?'}`, 'window_end'),
          `window_end ${end} is before window_start ${start}; expected window_start ≤ window_end`,
        ),
      )
    }
  }
  return out
}

export const rules: Rule[] = [
  idUnique,
  idDateMatches,
  idPartsMatch,
  layoutFileMatchesRecord,
  layoutEventsSorted,
  countryExcluded,
  countryMembershipFlags,
  countryUniverseSize,
  assessmentCountryKnown,
  assessmentIndicatorKnown,
  assessmentCheckedEvidence,
  assessmentNotApplicable,
  assessmentHasEventsMismatch,
  assessmentUnchecked,
  replyDeadline,
  replyContestsKnown,
  replyOutcomeConsistent,
  leadStatus,
  leadSourceKind,
  structuredSourceDataset,
  structuredIso3Known,
  structuredWindow,
]
