/**
 * Validation rules for identifiers, file layout, the country registry, assessments, replies,
 * leads and structured tables (docs/03 §1–§3 and §6–§10, docs/02 §1 and §8).
 *
 * Every rule reads only the context: no clock, no file system. Records that failed their schema
 * are absent from the dataset; references to them are not reported again as unknown. Lookups of
 * country codes, sources and assessments use the per-kind sets of `dataset.invalid` (a malformed
 * assessment for FRA does not hide an unknown country FRA elsewhere); event ids use
 * `dataset.invalidIds` (through `eventNotLoaded`).
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
  splitSourceIds,
} from '../../structured.js'
import type { Rule, ValidationContext } from '../context.js'
import { compareEventOrder } from '../order.js'
import { eventNotLoaded, eventsFileUnreadable, unreadableFiles } from './shared.js'
import { notArchivedReason } from './sources.js'

export { compareEventOrder } from '../order.js'

/** Scored entities: the UN member states plus the Holy See, minus ISR and PSE (docs/02 §1). */
export const UNIVERSE_SIZE = 193

/** The only entries flagged `excluded` (D-10). */
export const EXCLUDED_ISO3: readonly string[] = ['ISR', 'PSE']

/** The permanent members of the Security Council (UN Charter, Art. 23). */
export const UNSC_PERMANENT_ISO3: readonly string[] = ['CHN', 'FRA', 'GBR', 'RUS', 'USA']

const COUNTRIES_FILE = 'data/countries.yaml'

/** Maximum days between receiving and publishing a reply (docs/03 §9, docs/08 §4). */
export const REPLY_DEADLINE_DAYS = 10

/**
 * The columns that identify a row of each structured table (docs/03 §7): one vote per resolution
 * and country, one veto per draft and permanent member, one figure per country and window (per HS
 * code for A2) and reporter (self and mirror rows coexist; the generators prefer self, docs/02 §5), per release, data year and country (SIPRI), per country and year.
 */
export const STRUCTURED_UNIQUE_KEYS: Record<StructuredTableName, readonly string[]> = {
  'unga_votes.csv': ['resolution', 'iso3'],
  'unsc_vetoes.csv': ['draft', 'vetoed_by'],
  'fts_funding.csv': ['iso3', 'window_start', 'window_end'],
  'fts_plan_totals.csv': ['iso3', 'plan_id'],
  'sipri_deliveries.csv': ['release_date', 'data_year', 'supplier_iso3'],
  'sipri_orders.csv': ['release_date', 'data_year', 'buyer_iso3'],
  'comtrade_a2.csv': ['iso3', 'window_start', 'window_end', 'hs', 'reporter'],
  'comtrade_c3.csv': ['iso3', 'window_start', 'window_end', 'reporter'],
  'gni.csv': ['iso3', 'year'],
  'population.csv': ['iso3', 'year'],
}

/** Tables whose rows record one vote each: the column naming the voted text, voted on one date. */
const VOTE_COLUMN: Partial<Record<StructuredTableName, string>> = {
  'unga_votes.csv': 'resolution',
  'unsc_vetoes.csv': 'draft',
}

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
 * so an event whose date was corrected keeps an id carrying its first date; the mismatch is
 * accepted only when the event's corrections, read in log order, account for it: the first entry
 * giving `before.date` gives the id date, and the last entry giving `after.date` gives the
 * event's current date.
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
    const first = corrections.find((c) => Object.hasOwn(c.value.before, 'date'))
    const last = corrections.findLast((c) => Object.hasOwn(c.value.after, 'date'))
    if (first?.value.before.date === parsed.date && last?.value.after.date === e.value.date) {
      continue
    }
    const logged =
      first === undefined && last === undefined
        ? 'no correction entry records a date change'
        : `the corrections record a date change from ${String(first?.value.before.date ?? 'nothing')} to ${String(last?.value.after.date ?? 'nothing')}`
    out.push(
      issue(
        'id.date-matches',
        at(e, e.value.id, 'date'),
        `event date ${e.value.date} differs from the date ${parsed.date} in the id, and ${logged}; expected them to be equal, or corrections whose first before.date is ${parsed.date} and whose last after.date is ${e.value.date}`,
      ),
    )
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
 * (date, id) order, ids of one date in natural order (`compareEventOrder`: `…_B9` before
 * `…_B10`, `_2` before `_10`). Only the first event out of order is reported per file.
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
            `event ${e.value.id} (${e.value.date}) comes after ${prev.value.id} (${prev.value.date}); expected events sorted by date, then id in natural order`,
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
// Chronology across records (docs/03 §2, §4, §5, §8)

/**
 * record.chronology (docs/03 §2, §4, §5, §8): dates that record the steps of one process follow
 * each other. Rules read no clock, so only the order of recorded dates is checked:
 * - a source is retrieved on or after its document date (docs/03 §2: `date` is the document's
 *   date, never the retrieval date): the date part of `retrieved_at` (UTC) is not before `date`;
 *   reported on the source, at retrieved_at;
 * - an event's review is second-read and reviewed on or after it was drafted (docs/03 §4):
 *   `review.second_read.at` and `review.reviewed_at` are not before `review.drafted_at`; reported
 *   on the event;
 * - a correction is dated on or after the event it names was drafted (docs/03 §8): `date` is not
 *   before the event's `review.drafted_at`; reported on the entry. Entries naming an event that is
 *   not loaded are left to correction.event-known;
 * - a reply is received on or after the date of each event it contests (docs/03 §9): its
 *   `received_at` is not before the event's `date` (for a generated event, the date in its id);
 *   reported on the reply, at contests.{i}. Unknown events are left to reply.contests-known.
 */
const recordChronology: Rule = (ctx) => {
  const ds = ctx.dataset
  const out: Issue[] = []
  for (const src of ds.sources) {
    const { id, date, retrieved_at } = src.value
    if (retrieved_at === null) continue
    const retrieved = retrieved_at.slice(0, 10)
    // retrieved_at is UTC while the document date is local to the publisher: a page published
    // early on its local day east of UTC can be captured on the previous UTC day.
    if (addDays(retrieved, 1) >= date) continue
    out.push(
      issue(
        'record.chronology',
        at(src, id, 'retrieved_at'),
        `retrieved_at ${retrieved_at} is before the document date ${date}; expected the retrieval on or after the date of the document (date is the document's date, never the retrieval date)`,
      ),
    )
  }
  for (const e of ds.events) {
    const { id, review } = e.value
    const read = review.second_read
    if (read !== null && read !== undefined && read.at < review.drafted_at) {
      out.push(
        issue(
          'record.chronology',
          at(e, id, 'review.second_read.at'),
          `the second reading is dated ${read.at}, before the event was drafted on ${review.drafted_at}; expected second_read.at on or after drafted_at`,
        ),
      )
    }
    const reviewed = review.reviewed_at
    if (reviewed !== null && reviewed !== undefined && reviewed < review.drafted_at) {
      out.push(
        issue(
          'record.chronology',
          at(e, id, 'review.reviewed_at'),
          `reviewed_at ${reviewed} is before the event was drafted on ${review.drafted_at}; expected reviewed_at on or after drafted_at`,
        ),
      )
    }
  }
  for (const c of ds.corrections) {
    const e = ctx.index.eventById.get(c.value.event)
    if (e === undefined) continue
    const drafted = e.value.review.drafted_at
    if (c.value.date >= drafted) continue
    out.push(
      issue(
        'record.chronology',
        at(c, c.value.id, 'date'),
        `the correction is dated ${c.value.date}, before ${c.value.event} was drafted on ${drafted}; expected a date on or after the drafting of the event it corrects`,
      ),
    )
  }
  for (const r of ds.replies) {
    const { id, received_at, contests } = r.value
    contests.forEach((eventId, i) => {
      const e = ctx.index.eventById.get(eventId)
      const parsed = parseEventId(eventId)
      // An event keeps its id when a correction moves its date (docs/03 §2), possibly after the
      // reply: the earlier of the id date and the current date is the one the reply could see.
      const dates = [
        e?.value.date,
        e === undefined && !parsed?.generated ? undefined : parsed?.date,
      ]
        .filter((d): d is string => d !== undefined)
        .sort()
      const date = dates[0]
      if (date === undefined || received_at >= date) return
      out.push(
        issue(
          'record.chronology',
          at(r, id, `contests.${i}`),
          `received_at ${received_at} is before ${date}, the date of the contested event ${eventId}; expected a reply received on or after the event it contests`,
        ),
      )
    })
  }
  return out
}

// ---------------------------------------------------------------------------------------------
// Countries (docs/03 §3, docs/02 §1)

/**
 * country.excluded (docs/03 §1 and §3, D-10): the registry lists ISR and PSE (docs/03 §1: "193
 * scored + ISR + PSE flagged excluded"); only they are excluded, both must be, and
 * `excluded_reason` is present exactly when `excluded` is true. A missing ISR or PSE is not
 * reported when countries.yaml is absent or cannot be read (the load issue covers it) or when
 * the entry failed its schema.
 */
const countryExcluded: Rule = (ctx) => {
  const ds = ctx.dataset
  const out: Issue[] = []
  if (ds.files.includes(COUNTRIES_FILE) && !unreadableFiles(ds).has(COUNTRIES_FILE)) {
    for (const iso3 of EXCLUDED_ISO3) {
      if (ctx.index.countryByIso3.has(iso3) || ds.invalid.country.has(iso3)) continue
      out.push(
        issue(
          'country.excluded',
          { file: COUNTRIES_FILE, id: iso3 },
          `${iso3} is missing from countries.yaml; expected it listed with excluded: true and excluded_reason (D-10)`,
        ),
      )
    }
  }
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
 * observer, never both; Security Council terms have to ≥ from (to null = ongoing); only the five
 * permanent members (UN Charter Art. 23: CHN, FRA, GBR, RUS, USA) have a permanent term, and each
 * of them, when listed, has an ongoing one (to null), since B2's not-applicable check reads the
 * terms; dated memberships have until ≥ since when both are set.
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
    const permanentMember = UNSC_PERMANENT_ISO3.includes(iso3)
    if (permanentMember && !memberships.unsc.some((t) => t.permanent && t.to === null)) {
      out.push(
        issue(
          'country.membership-flags',
          at(c, iso3, 'memberships.unsc'),
          `${iso3} is a permanent member of the Security Council but has no ongoing permanent term; expected a term with permanent: true and to: null`,
        ),
      )
    }
    memberships.unsc.forEach((term, i) => {
      if (term.permanent && !permanentMember) {
        out.push(
          issue(
            'country.membership-flags',
            at(c, iso3, `memberships.unsc.${i}`),
            `${iso3} has a permanent Security Council term; expected permanent: true only for ${UNSC_PERMANENT_ISO3.join(', ')} (UN Charter Art. 23)`,
          ),
        )
      }
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
      { file: COUNTRIES_FILE, id: '-' },
      `countries.yaml has ${count} scored ${count === 1 ? 'entry' : 'entries'} (not excluded); expected ${UNIVERSE_SIZE}`,
    ),
  ]
}

// ---------------------------------------------------------------------------------------------
// Assessments (docs/03 §6, docs/02 §8)

/**
 * assessment.country-known (docs/03 §6): the country is in the registry and is not excluded. A
 * code whose countries.yaml entry failed its schema is not reported.
 */
const assessmentCountryKnown: Rule = (ctx) => {
  const out: Issue[] = []
  for (const a of ctx.dataset.assessments) {
    const iso3 = a.value.country
    const country = ctx.index.countryByIso3.get(iso3)
    if (country === undefined) {
      if (!ctx.dataset.invalid.country.has(iso3)) {
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
 * overlaps the window, which runs from WINDOW_START to the date of the check. Without a clock,
 * that date is the entry's checked_at, else the assessment's last_full_check: a term overlaps
 * when it has started by then (from ≤ that date) and is ongoing (to null) or ends on or after
 * WINDOW_START. A state elected for a term that has not started (e.g. 2027–2028, checked in
 * 2026) is not on the Council in the window. When neither date is set, every term that ends on
 * or after WINDOW_START counts, whatever its start.
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
      const asOf = entry.checked_at ?? a.value.last_full_check ?? null
      const term = country.value.memberships.unsc.find(
        (t) => (t.to === null || t.to >= WINDOW_START) && (asOf === null || t.from <= asOf),
      )
      if (term !== undefined) {
        const window = asOf === null ? `from ${WINDOW_START}` : `from ${WINDOW_START} to ${asOf}`
        const hint =
          asOf === null
            ? ' (no checked_at or last_full_check dates the check, so a term that has not started also counts)'
            : ''
        out.push(
          issue(
            'assessment.not-applicable',
            at(a, iso3, path),
            `${ind} is not-applicable but ${iso3} has a Security Council term from ${term.from} to ${term.to ?? 'ongoing'} that overlaps the window ${window}${hint}; expected not-applicable only for states never on the Council in the window`,
          ),
        )
      }
    }
  }
  return out
}

/**
 * assessment.has-events-mismatch (docs/03 §6): the build sets has-events from the published events
 * that score, so on hand-authored indicators a hand-set has-events without such an event, or
 * another status beside one, is overwritten (warning). Only events whose scope includes `gaza`
 * score in v1 (docs/03 §4, D-14): a published event scoped to the West Bank or Lebanon only is
 * tracked, not scored, and does not make an indicator has-events. "No published event" is not
 * claimed when the country's events file cannot be read or an event of that country and
 * indicator failed its schema (the load or schema issue covers it).
 */
const assessmentHasEventsMismatch: Rule = (ctx) => {
  const m = ctx.methodology
  if (m.indicatorsFile === null) return []
  const ds = ctx.dataset
  const notLoaded = new Set<string>()
  for (const id of ds.invalidIds) {
    const parsed = parseEventId(id)
    if (parsed !== null) notLoaded.add(`${parsed.iso3}\u0000${parsed.indicator}`)
  }
  const out: Issue[] = []
  for (const a of ctx.dataset.assessments) {
    const iso3 = a.value.country
    const unreadable = eventsFileUnreadable(ds, iso3)
    const published = new Set(
      (ctx.index.eventsByCountry.get(iso3) ?? [])
        .filter((e) => e.value.status === 'published' && e.value.scope.includes('gaza'))
        .map((e) => e.value.indicator),
    )
    for (const [ind, entry] of Object.entries(a.value.indicators)) {
      if (m.indicatorById.get(ind)?.authoring !== 'hand') continue
      const path = `indicators.${ind}`
      if (entry.status === 'has-events' && !published.has(ind)) {
        if (unreadable || notLoaded.has(`${iso3}\u0000${ind}`)) continue
        out.push(
          issue(
            'assessment.has-events-mismatch',
            at(a, iso3, path),
            `${ind} is has-events but ${iso3} has no published ${ind} event scoped to gaza (only gaza scores in v1); the build will overwrite the status`,
          ),
        )
      } else if (entry.status !== 'has-events' && published.has(ind)) {
        out.push(
          issue(
            'assessment.has-events-mismatch',
            at(a, iso3, path),
            `${ind} is ${entry.status} but ${iso3} has a published ${ind} event scoped to gaza; expected has-events, which the build will set`,
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
    // The assessment file exists but failed its schema (schema.assessment covers it).
    if (ctx.dataset.invalid.assessment.has(iso3)) continue
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

/**
 * reply.contests-known (docs/03 §9): contested events exist and belong to the reply country.
 * Generated events (votes, vetoes, computed indicators; docs/03 §2) exist only in build outputs,
 * so for them only the country in the id is checked. Events that failed their schema or sit in an
 * events file that cannot be read are not reported as missing (the load issue covers them).
 */
const replyContestsKnown: Rule = (ctx) => {
  const ds = ctx.dataset
  const unreadable = unreadableFiles(ds)
  const out: Issue[] = []
  for (const r of ds.replies) {
    r.value.contests.forEach((eventId, i) => {
      const e = ctx.index.eventById.get(eventId)
      const parsed = parseEventId(eventId)
      const country = e?.value.country ?? (parsed?.generated ? parsed.iso3 : undefined)
      if (country === undefined) {
        if (!eventNotLoaded(ds, eventId, unreadable)) {
          out.push(
            issue(
              'reply.contests-known',
              at(r, r.value.id, `contests.${i}`),
              `contested event ${eventId} does not exist; expected an event id from data/events or a generated event id`,
            ),
          )
        }
      } else if (country !== r.value.country) {
        out.push(
          issue(
            'reply.contests-known',
            at(r, r.value.id, `contests.${i}`),
            `contested event ${eventId} belongs to ${country}; expected an event of ${r.value.country}`,
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
 * corrections.yaml entry names the event and is dated on or after the reply's received_at (a
 * correction logged before the reply arrived did not result from it). Unknown events are left to
 * reply.contests-known.
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
        !(ctx.index.correctionsByEvent.get(eventId) ?? []).some(
          (c) => c.value.date >= r.value.received_at,
        )
      ) {
        out.push(
          issue(
            'reply.outcome-consistent',
            loc,
            `outcome is corrected but corrections.yaml has no entry for ${eventId} dated on or after received_at ${r.value.received_at}; expected the correction entry that resolved the reply`,
          ),
        )
      }
    })
  }
  return out
}

// ---------------------------------------------------------------------------------------------
// Leads (docs/03 §10)

/**
 * lead.status (docs/03 §10): promoted:evt_… names an existing event of the lead's country (a
 * warning when its indicator differs from the lead's); dropped carries a reason. An event that
 * failed its schema or sits in an events file that cannot be read is not reported as missing.
 */
const leadStatus: Rule = (ctx) => {
  const ds = ctx.dataset
  const unreadable = unreadableFiles(ds)
  const out: Issue[] = []
  for (const l of ds.leads) {
    const { id, status } = l.value
    if (status.startsWith('promoted:')) {
      const target = status.slice('promoted:'.length)
      const e = ctx.index.eventById.get(target)
      if (e === undefined) {
        if (!eventNotLoaded(ds, target, unreadable)) {
          out.push(
            issue(
              'lead.status',
              at(l, id, 'status'),
              `lead is promoted to ${target}, which does not exist; expected an existing event id`,
            ),
          )
        }
      } else if (e.value.country !== l.value.country) {
        out.push(
          issue(
            'lead.status',
            at(l, id, 'status'),
            `lead of ${l.value.country} is promoted to ${target}, an event of ${e.value.country}; expected an event of ${l.value.country}`,
          ),
        )
      } else if (e.value.indicator !== l.value.indicator) {
        out.push(
          issue(
            'lead.status',
            at(l, id, 'status'),
            `lead on ${l.value.indicator} is promoted to ${target}, an event of ${e.value.indicator}; check the lead's indicator or the promoted event`,
            'warning',
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
        if (!ctx.dataset.invalid.source.has(entry.source)) {
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

/**
 * structured.source-dataset (docs/03 §7: "a `src_` id of kind `dataset` whose record archives
 * the origin"): each id of the source column (one, or several joined by `;`) names an existing source of kind dataset that is archived
 * (wayback_url and sha256, capture not failed, or a dataset row whose origin is archived; see
 * `notArchivedReason`). Generated events are built from these rows, so nothing scores from an
 * unarchived table (CLAUDE.md).
 */
const structuredSourceDataset: Rule = (ctx) => {
  const out: Issue[] = []
  for (const table of STRUCTURED_TABLE_NAMES) {
    for (const row of rowsOf(ctx, table)) {
      const cell = row.value.source
      if (typeof cell !== 'string') continue
      const loc = at(row, `row ${row.line ?? '?'}`, 'source')
      for (const sourceId of splitSourceIds(cell)) {
        const src = ctx.index.sourceById.get(sourceId)
        if (src === undefined) {
          if (!ctx.dataset.invalid.source.has(sourceId)) {
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
        } else {
          const reason = notArchivedReason(ctx, src.value)
          if (reason !== null) {
            out.push(
              issue(
                'structured.source-dataset',
                loc,
                `${reason}; expected a dataset source whose record archives the origin (wayback_url and sha256)`,
              ),
            )
          }
        }
      }
    }
  }
  return out
}

/**
 * structured.iso3-known (docs/03 §7): the table's country column is in countries.yaml (warning).
 * A code whose countries.yaml entry failed its schema is not reported. One warning per table, at
 * the first row concerned: a table fetched for the whole world before the registry is complete
 * (P-13) would otherwise give one warning per row and bury every other warning.
 */
const structuredIso3Known: Rule = (ctx) => {
  const out: Issue[] = []
  for (const table of STRUCTURED_TABLE_NAMES) {
    const column = STRUCTURED_ISO3_COLUMN[table]
    const unknown = new Map<string, number[]>()
    let first: Located<Record<string, unknown>> | undefined
    for (const row of rowsOf(ctx, table)) {
      const iso3 = row.value[column]
      if (typeof iso3 !== 'string') continue
      if (ctx.index.countryByIso3.has(iso3) || ctx.dataset.invalid.country.has(iso3)) continue
      first ??= row
      unknown.set(iso3, [...(unknown.get(iso3) ?? []), row.line ?? 0])
    }
    if (first === undefined) continue
    const codes = [...unknown.keys()]
    const message =
      codes.length === 1
        ? `${column} ${codes[0]} is not in countries.yaml; expected a registered country code`
        : `${codes.length} ${column} codes are not in countries.yaml (${codes
            .map((c) => {
              const lines = unknown.get(c) ?? []
              return `${c} ×${lines.length}`
            })
            .join(', ')}); expected registered country codes`
    out.push(issue('structured.iso3-known', at(first, `row ${first.line ?? '?'}`, column), message))
  }
  return out
}

/**
 * structured.unique (docs/03 §7, docs/02 §2 B1 and B2): the rows of a table are unique by the key
 * columns of STRUCTURED_UNIQUE_KEYS; the rows of one General Assembly resolution (unga_votes) or
 * one draft (unsc_vetoes) carry one date, since a text is put to the vote once; and a veto is
 * cast by a permanent member (UNSC_PERMANENT_ISO3), the only states that can cast one. The later
 * row is reported (by file order), naming the line of the first.
 */
const structuredUnique: Rule = (ctx) => {
  const out: Issue[] = []
  for (const table of STRUCTURED_TABLE_NAMES) {
    const columns = STRUCTURED_UNIQUE_KEYS[table]
    const voteColumn = VOTE_COLUMN[table]
    const firstByKey = new Map<string, Located<Record<string, unknown>>>()
    const firstByVote = new Map<string, Located<Record<string, unknown>>>()
    for (const row of rowsOf(ctx, table)) {
      const id = `row ${row.line ?? '?'}`
      const key = columns.map((c) => String(row.value[c])).join('\u0000')
      const prev = firstByKey.get(key)
      if (prev === undefined) firstByKey.set(key, row)
      else {
        const values = columns.map((c) => `${c} ${String(row.value[c])}`).join(', ')
        out.push(
          issue(
            'structured.unique',
            at(row, id),
            `${values} is already recorded at line ${prev.line ?? '?'}; expected one row per ${columns.join(', ')}`,
          ),
        )
      }
      if (voteColumn !== undefined) {
        const text = String(row.value[voteColumn])
        const firstVote = firstByVote.get(text)
        if (firstVote === undefined) firstByVote.set(text, row)
        else if (firstVote.value.date !== row.value.date) {
          out.push(
            issue(
              'structured.unique',
              at(row, id, 'date'),
              `${voteColumn} ${text} is dated ${String(row.value.date)} here but ${String(firstVote.value.date)} at line ${firstVote.line ?? '?'}; expected one date per ${voteColumn}, the day it was put to the vote`,
            ),
          )
        }
      }
      if (table === 'unsc_vetoes.csv') {
        const member = row.value.vetoed_by
        if (typeof member === 'string' && !UNSC_PERMANENT_ISO3.includes(member)) {
          out.push(
            issue(
              'structured.unique',
              at(row, id, 'vetoed_by'),
              `vetoed_by ${member} is not a permanent member of the Security Council; expected one of ${UNSC_PERMANENT_ISO3.join(', ')}, the only states that can cast a veto`,
            ),
          )
        }
      }
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
  recordChronology,
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
  structuredUnique,
  structuredWindow,
]
