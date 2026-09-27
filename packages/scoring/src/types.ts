/**
 * Input shapes read by the scoring engine.
 *
 * They are structural subsets of the records in `@gai/schema` (docs/03 §3, §4, §6), declared here
 * so that the engine has no dependency: a parsed `Event`, `Country` or `Assessment` from the
 * schema package is assignable to them (checked in `schema-compat.test.ts`).
 */

export const CATEGORY_IDS = ['A', 'B', 'C', 'D', 'E'] as const
export type CategoryId = (typeof CATEGORY_IDS)[number]

export type EventType = 'standing' | 'repeatable' | 'computed'

export const CONFIDENCE_LEVELS = ['confirmed', 'corroborated', 'reported', 'disputed'] as const
export type Confidence = (typeof CONFIDENCE_LEVELS)[number]

export type AssessmentStatus =
  | 'has-events'
  | 'none-found'
  | 'no-data'
  | 'not-applicable'
  | 'unchecked'

/** Start of the window every indicator measures (docs/02 §1). */
export const WINDOW_START = '2023-10-07'

/** The only status that scores (docs/02 §3). */
export const SCORING_STATUS = 'published'

/** The only scope that scores in v1 (docs/03 §4, D-14). */
export const SCORED_SCOPE = 'gaza'

/** One event, hand-authored (data/events) or generated (docs/03 §4, §7). */
export interface ScoringEvent {
  readonly id: string
  readonly country: string
  readonly indicator: string
  readonly type: EventType
  /** Action date; start date for standing and computed events. */
  readonly date: string
  /** Standing and computed events: first day the state no longer holds (exclusive); null = holds. */
  readonly end?: string | null | undefined
  readonly points: number
  readonly confidence: Confidence
  readonly scope: readonly string[]
  readonly status: string
}

/** A Security Council term (docs/03 §3); `to` is inclusive, null for permanent members. */
export interface UnscTerm {
  readonly from: string
  readonly to: string | null
  readonly permanent: boolean
}

export interface ScoringCountry {
  readonly iso3: string
  readonly name: { readonly en: string; readonly fr: string }
  readonly excluded: boolean
  readonly memberships: { readonly unsc: readonly UnscTerm[] }
}

export interface ScoringAssessment {
  readonly indicators: Readonly<Record<string, { readonly status: AssessmentStatus } | undefined>>
}

export type Lang = 'en' | 'fr'

export interface LangText {
  readonly en: string
  readonly fr: string
}
