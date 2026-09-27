import { z } from 'zod'

/** Calendar date `YYYY-MM-DD` (docs/03 §2: dates are the document's or the action's date). */
export const IsoDate = z.iso.date()
export type IsoDate = z.infer<typeof IsoDate>

/** UTC timestamp `YYYY-MM-DDTHH:MM:SSZ` (source `retrieved_at`). */
export const IsoDateTime = z.iso.datetime()

export const Iso3 = z.string().regex(/^[A-Z]{3}$/, 'expected an ISO 3166-1 alpha-3 code')
export const Iso2 = z.string().regex(/^[A-Z]{2}$/, 'expected an ISO 3166-1 alpha-2 code')

/** BCP 47 language tag, lowercase primary subtag (`de`, `fr`, `pt-BR`). */
export const LangCode = z
  .string()
  .regex(/^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$/, 'expected a language code such as "de" or "pt-BR"')

export const NonEmpty = z.string().trim().min(1, 'must not be empty')

/** Text in both site languages (D-17). */
export const LangText = z.strictObject({ en: NonEmpty, fr: NonEmpty })
export type LangText = z.infer<typeof LangText>

export const Url = z.url({ protocol: /^https?$/ })

export const Sha256 = z.string().regex(/^[0-9a-f]{64}$/, 'expected 64 lowercase hex characters')

/** Lowercase ASCII slug with hyphens (docs/03 §2). */
export const Slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'expected lowercase ASCII words joined by hyphens')
  .max(40, 'slugs are at most 40 characters')

/** Lowercase snake-case key used for enumerations that data sessions may extend. */
export const Key = z.string().regex(/^[a-z][a-z0-9_]*$/, 'expected a lowercase snake_case key')

export const CATEGORY_IDS = ['A', 'B', 'C', 'D', 'E'] as const
export const CategoryId = z.enum(CATEGORY_IDS)
export type CategoryId = z.infer<typeof CategoryId>

/** Shape of an indicator id; membership is checked against the methodology's indicators.yaml. */
export const IndicatorId = z
  .string()
  .regex(/^[A-E](?:1[0-2]|[1-9])$/, 'expected an indicator id such as A6 or B12')
export type IndicatorId = z.infer<typeof IndicatorId>

export const EVENT_TYPES = ['standing', 'repeatable', 'computed'] as const
export const EventType = z.enum(EVENT_TYPES)
export type EventType = z.infer<typeof EventType>

export const CONFIDENCE_LEVELS = ['confirmed', 'corroborated', 'reported', 'disputed'] as const
export const Confidence = z.enum(CONFIDENCE_LEVELS)
export type Confidence = z.infer<typeof Confidence>

export const SCOPES = ['gaza', 'lebanon', 'west-bank', 'region', 'related'] as const
export const Scope = z.enum(SCOPES)
export type Scope = z.infer<typeof Scope>

export const EVENT_STATUSES = [
  'draft',
  'reviewed',
  'published',
  'superseded',
  'corrected',
  'retracted',
] as const
export const EventStatus = z.enum(EVENT_STATUSES)
export type EventStatus = z.infer<typeof EventStatus>

export const SOURCE_KINDS = [
  'official',
  'official-video',
  'court',
  'dataset',
  'ngo',
  'press',
  'parliamentary',
] as const
export const SourceKind = z.enum(SOURCE_KINDS)
export type SourceKind = z.infer<typeof SourceKind>

export const ASSESSMENT_STATUSES = [
  'has-events',
  'none-found',
  'no-data',
  'not-applicable',
  'unchecked',
] as const
export const AssessmentStatus = z.enum(ASSESSMENT_STATUSES)
export type AssessmentStatus = z.infer<typeof AssessmentStatus>

export const SIGNS = ['negative', 'positive', 'mixed'] as const
export const Sign = z.enum(SIGNS)
export type Sign = z.infer<typeof Sign>

/** Start of the window every indicator measures (docs/02 §1). */
export const WINDOW_START = '2023-10-07'

/** Whole days from `a` to `b` (both `YYYY-MM-DD`, UTC). Positive when `b` is later. */
export function daysBetween(a: string, b: string): number {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000)
}

/** `YYYY-MM-DD` plus `n` days. */
export function addDays(date: string, n: number): string {
  return new Date(Date.parse(`${date}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10)
}

/** True when `YYYYMMDD` or `YYYY-MM-DD` names a real calendar date. */
export function isCalendarDate(value: string): boolean {
  const m = /^(\d{4})-?(\d{2})-?(\d{2})$/.exec(value)
  if (!m) return false
  const [, y, mo, d] = m
  const iso = `${y}-${mo}-${d}`
  const t = Date.parse(`${iso}T00:00:00Z`)
  return !Number.isNaN(t) && new Date(t).toISOString().slice(0, 10) === iso
}
