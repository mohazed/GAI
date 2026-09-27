/**
 * Coverage (docs/02 §8, D-09): one status per scored indicator, and the share checked.
 *
 *   applicable = 31 − count(not-applicable)
 *   coverage   = (count(has-events) + count(none-found)) / applicable
 *
 * Status of each scored indicator at date t, in this order:
 * 1. has-events when the country has a published event of the indicator scoped to gaza, dated on
 *    or before t (docs/03 §6: set by the build; the hand-set value is overwritten).
 * 2. not-applicable by rule: B2 (`unsc_non_member`) when the country held no Security Council seat
 *    at any point from the window start to t.
 * 2b. no-data for everyone before an indicator's first release (docs/02 §5: A1 before the first
 *    post-war SIPRI release, thresholds.yaml `no_data_before`).
 * 3. Otherwise the assessment's status, with two corrections: a hand-set has-events without such
 *    an event, and a hand-set not-applicable on an indicator whose rule says the country is
 *    concerned, both become unchecked (nothing verified them). A missing entry is unchecked.
 * Other indicators are never not-applicable automatically; a hand-set not-applicable (with its
 * note, enforced by the validator) is kept.
 */
import type { ScoringMethodology } from './methodology.js'
import { dayNumber } from './time.js'
import {
  type AssessmentStatus,
  SCORED_SCOPE,
  SCORING_STATUS,
  type ScoringAssessment,
  type ScoringCountry,
  type ScoringEvent,
} from './types.js'

/** Indicators whose no-data status shows "no export data" on the card, never a zero (§8). */
export const EXPORT_DATA_INDICATORS: readonly string[] = ['A1', 'A2']

export interface CoverageOverride {
  readonly indicator: string
  /** The assessment's status (unchecked when the entry is missing). */
  readonly from: AssessmentStatus
  readonly to: AssessmentStatus
  readonly reason: 'published-event' | 'no-published-event' | 'unsc-rule' | 'before-first-release'
}

export interface Coverage {
  /** (has-events + none-found) / applicable, full precision. */
  readonly ratio: number
  readonly applicable: number
  readonly hasEvents: number
  readonly noneFound: number
  readonly noData: number
  readonly unchecked: number
  readonly notApplicable: number
  /**
   * Applicable indicators not covered, no-data and unchecked, methodology order (§14 `missing`;
   * spec §6: the coverage bar's grey segments name the missing ones).
   */
  readonly missing: readonly string[]
  /** no-data indicators (hatched on the coverage bar), methodology order. */
  readonly noDataIds: readonly string[]
  /** unchecked indicators (empty on the coverage bar), methodology order. */
  readonly uncheckedIds: readonly string[]
  readonly notApplicableIds: readonly string[]
  /** The status of every scored indicator. */
  readonly statuses: Readonly<Record<string, AssessmentStatus>>
  /** A1 or A2 is no-data (§8). */
  readonly noExportData: boolean
  /** Hand-set statuses the rules replaced. */
  readonly overrides: readonly CoverageOverride[]
}

/**
 * True when the country held a Security Council seat on at least one day of [from, to]
 * (inclusive; a term's `to` is inclusive, null = ongoing).
 */
export function onSecurityCouncil(country: ScoringCountry, from: string, to: string): boolean {
  const a = dayNumber(from)
  const b = dayNumber(to)
  return country.memberships.unsc.some(
    (term) => dayNumber(term.from) <= b && (term.to === null || dayNumber(term.to) >= a),
  )
}

export interface CoverageInput {
  readonly country: ScoringCountry
  /** data/assessments/{ISO3}.yaml, or null when the country has none (all unchecked). */
  readonly assessment: ScoringAssessment | null | undefined
  /** The country's events (other countries' events are ignored). */
  readonly events: readonly ScoringEvent[]
  /** `YYYY-MM-DD`. */
  readonly date: string
}

export function coverage(input: CoverageInput, m: ScoringMethodology): Coverage {
  const { country, assessment, events, date } = input
  const day = dayNumber(date)
  const withEvents = new Set(
    events
      .filter(
        (e) =>
          e.country === country.iso3 &&
          e.status === SCORING_STATUS &&
          e.scope.includes(SCORED_SCOPE) &&
          dayNumber(e.date) <= day,
      )
      .map((e) => e.indicator),
  )
  const statuses: Record<string, AssessmentStatus> = {}
  const overrides: CoverageOverride[] = []
  for (const id of m.scoredIndicatorIds) {
    const ind = m.indicatorById.get(id)
    const hand: AssessmentStatus = assessment?.indicators[id]?.status ?? 'unchecked'
    let status: AssessmentStatus
    let reason: CoverageOverride['reason'] | null = null
    const ruleApplies = ind?.notApplicable === 'unsc_non_member'
    const concerned = ruleApplies ? onSecurityCouncil(country, m.windowStart, date) : true
    if (withEvents.has(id)) {
      status = 'has-events'
      reason = 'published-event'
    } else if (!concerned) {
      status = 'not-applicable'
      reason = 'unsc-rule'
    } else if (m.noDataBefore[id] !== undefined && date < (m.noDataBefore[id] as string)) {
      status = 'no-data'
      reason = 'before-first-release'
    } else if (hand === 'not-applicable' && ruleApplies) {
      status = 'unchecked'
      reason = 'unsc-rule'
    } else if (hand === 'has-events') {
      status = 'unchecked'
      reason = 'no-published-event'
    } else {
      status = hand
    }
    statuses[id] = status
    if (reason !== null && status !== hand)
      overrides.push({ indicator: id, from: hand, to: status, reason })
  }
  const ids = (s: AssessmentStatus) => m.scoredIndicatorIds.filter((id) => statuses[id] === s)
  const notApplicableIds = ids('not-applicable')
  const applicable = m.scoredIndicatorIds.length - notApplicableIds.length
  const hasEvents = ids('has-events').length
  const noneFound = ids('none-found').length
  const noDataIds = ids('no-data')
  const uncheckedIds = ids('unchecked')
  const missing = m.scoredIndicatorIds.filter(
    (id) => statuses[id] === 'no-data' || statuses[id] === 'unchecked',
  )
  return {
    ratio: applicable === 0 ? 0 : (hasEvents + noneFound) / applicable,
    applicable,
    hasEvents,
    noneFound,
    noData: noDataIds.length,
    unchecked: uncheckedIds.length,
    notApplicable: notApplicableIds.length,
    missing,
    noDataIds,
    uncheckedIds,
    notApplicableIds,
    statuses,
    noExportData: EXPORT_DATA_INDICATORS.some((id) => statuses[id] === 'no-data'),
    overrides,
  }
}
