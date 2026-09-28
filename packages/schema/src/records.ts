/**
 * Zod schemas for the hand-maintained records in `data/` (docs/03 §3–§10).
 *
 * Objects are strict: an unknown key is an error, so a typo such as `point:` cannot pass
 * silently. Cross-record rules (sources exist, points match the indicator…) live in
 * `validate/rules/`, not here.
 */
import { z } from 'zod'
import { ID_DESCRIPTIONS, isValidId, parseEventId } from './ids.js'
import {
  AssessmentStatus,
  Confidence,
  EventStatus,
  EventType,
  IndicatorId,
  Iso2,
  Iso3,
  IsoDate,
  IsoDateTime,
  Key,
  LangCode,
  LangText,
  NonEmpty,
  Scope,
  Sha256,
  SourceKind,
  Url,
} from './primitives.js'

export const EventIdLike = z.string().refine((id) => parseEventId(id) !== null, {
  message: `expected ${ID_DESCRIPTIONS.event} or ${ID_DESCRIPTIONS.generatedEvent}`,
})
export const SourceId = z
  .string()
  .refine((id) => isValidId('source', id), { message: `expected ${ID_DESCRIPTIONS.source}` })
export const CorrectionId = z.string().refine((id) => isValidId('correction', id), {
  message: `expected ${ID_DESCRIPTIONS.correction}`,
})
export const ReplyId = z
  .string()
  .refine((id) => isValidId('reply', id), { message: `expected ${ID_DESCRIPTIONS.reply}` })
export const LeadId = z
  .string()
  .refine((id) => isValidId('lead', id), { message: `expected ${ID_DESCRIPTIONS.lead}` })

// ---------------------------------------------------------------------------------------------
// Country (docs/03 §3)

/** A membership is a flag, or a dated period when it changed inside the window (P-13). */
export const Membership = z.union([
  z.boolean(),
  z.strictObject({
    since: IsoDate.nullable(),
    until: IsoDate.nullable().optional(),
    note: z.string().optional(),
  }),
])
export type Membership = z.infer<typeof Membership>

export const UnscTerm = z.strictObject({
  from: IsoDate,
  to: IsoDate.nullable(),
  permanent: z.boolean(),
})
export type UnscTerm = z.infer<typeof UnscTerm>

export const GovSource = z.strictObject({
  label: NonEmpty,
  url: Url,
  /** mfa | head_of_government | head_of_state | parliament | gazette | defence | … */
  type: Key,
  lang: z.array(LangCode).min(1),
})

/**
 * UNTERM short names in EN and FR (docs/02 §1), and `fr_def`, the French short name with the
 * article UNTERM gives it ("l'Allemagne", "la France", "les États-Unis d'Amérique"; "Cuba" without
 * one), so that generated French text can name the country (P-13, P-18). Optional in the schema;
 * `country.name-fr-def` warns when it is missing and checks its form.
 */
export const CountryName = z.strictObject({
  en: NonEmpty,
  fr: NonEmpty,
  fr_def: NonEmpty.optional(),
})
export type CountryName = z.infer<typeof CountryName>

export const Country = z.strictObject({
  iso3: Iso3,
  iso2: Iso2,
  m49: z.number().int().min(1).max(999),
  name: CountryName,
  region: NonEmpty,
  subregion: NonEmpty,
  un_member: z.boolean(),
  observer: z.boolean(),
  /** true only for ISR and PSE (D-10), with `excluded_reason`. */
  excluded: z.boolean(),
  excluded_reason: LangText.optional(),
  memberships: z.strictObject({
    unsc: z.array(UnscTerm),
    eu: Membership,
    nato: Membership,
    arab_league: Membership,
    oic: Membership,
    g20: Membership,
    g7: Membership,
    brics: Membership,
  }),
  /** Date of recognition of the State of Palestine, or null; drives the B8 standing state. */
  recognises_palestine: z.strictObject({
    since: IsoDate.nullable(),
    note: z.string().optional(),
  }),
  gov_sources: z.array(GovSource),
  notes: z.string().optional(),
})
export type Country = z.infer<typeof Country>

// ---------------------------------------------------------------------------------------------
// Event (docs/03 §4)

export const Evidence = z.strictObject({
  source: SourceId,
  /** Verbatim passage from archive/text/{source}.txt, in the original language. */
  quote: NonEmpty,
  quote_lang: LangCode,
  /** Translation shown beside the original; required when quote_lang is not English. */
  quote_en: z.string().optional(),
  quote_fr: z.string().optional(),
  /** page, paragraph, `row …` (dataset) or `video hh:mm:ss` (official video). */
  locator: NonEmpty,
})
export type Evidence = z.infer<typeof Evidence>

export const SecondRead = z.strictObject({
  by: NonEmpty,
  at: IsoDate,
  verdict: z.enum(['agree', 'disagree']),
  notes: z.string().optional(),
})

export const Review = z.strictObject({
  drafted_by: NonEmpty,
  drafted_at: IsoDate,
  second_read: SecondRead.nullable().optional(),
  reviewed_by: z.string().nullable().optional(),
  reviewed_at: IsoDate.nullable().optional(),
  notes: z.string().optional(),
})

export const Actor = z.strictObject({
  en: NonEmpty,
  fr: NonEmpty,
  /** Name of the person speaking; required for B9/B10. */
  name: z.string().optional(),
})

export const Event = z
  .strictObject({
    id: EventIdLike,
    revision: z.number().int().min(1),
    country: Iso3,
    indicator: IndicatorId,
    type: EventType,
    /** Action date; start date for standing states. */
    date: IsoDate,
    /** Standing states only; null = still holds. Exclusive (docs/02 §3). */
    end: IsoDate.nullable().optional(),
    points: z.number().finite(),
    points_rationale: z.string().optional(),
    confidence: Confidence,
    scope: z.array(Scope).min(1),
    summary: LangText,
    actor: Actor.optional(),
    evidence: z.array(Evidence).min(1),
    status: EventStatus,
    supersedes: EventIdLike.nullable().optional(),
    related: z.array(EventIdLike).optional(),
    review: Review,
    /** Only generated events (build output) carry `generated: true`; never in data/events. */
    generated: z.boolean().optional(),
  })
  .refine((e) => new Set(e.scope).size === e.scope.length, {
    message: 'scope entries must be unique',
    path: ['scope'],
  })
export type Event = z.infer<typeof Event>

/** Event fields a correction entry may name in `before` / `after`. */
export const EVENT_FIELD_KEYS = [
  'indicator',
  'type',
  'date',
  'end',
  'points',
  'points_rationale',
  'confidence',
  'scope',
  'summary',
  'actor',
  'evidence',
  'status',
  'supersedes',
  'related',
] as const

// ---------------------------------------------------------------------------------------------
// Source (docs/03 §5)

/** A repo path to a structured table, used by dataset-row sources. */
export const StructuredTablePath = z
  .string()
  .regex(/^data\/structured\/[a-z0-9_]+\.csv$/, 'expected data/structured/{table}.csv')

export const Source = z.strictObject({
  id: SourceId,
  kind: SourceKind,
  title: NonEmpty,
  publisher: NonEmpty,
  /** head_of_government | mfa | parliament | gazette | court | un | ngo | press | dataset | … */
  publisher_type: Key,
  url: z.union([Url, StructuredTablePath]),
  wayback_url: Url.nullable(),
  /** `failed` when Save Page Now could not capture the page (docs/06 §6). */
  archive_status: z.enum(['archived', 'failed']).optional(),
  archive_url_alt: Url.nullable().optional(),
  sha256: Sha256.nullable(),
  bytes: z.number().int().nonnegative().nullable(),
  content_type: z.string().nullable(),
  retrieved_at: IsoDateTime.nullable(),
  language: LangCode,
  /** Document date (not the retrieval date). */
  date: IsoDate,
  text_file: z.string().nullable(),
  /** Optional; for dataset rows, the row itself. */
  excerpt: z.string().optional(),
  /** Dataset-row sources that point at data/structured: the dataset source archiving the origin. */
  origin: SourceId.optional(),
  notes: z.string().optional(),
})
export type Source = z.infer<typeof Source>

// ---------------------------------------------------------------------------------------------
// Assessment (docs/03 §6)

export const AssessmentEntry = z.strictObject({
  status: AssessmentStatus,
  checked_at: IsoDate.optional(),
  note: z.string().optional(),
  queries: z.array(NonEmpty).optional(),
})
export type AssessmentEntry = z.infer<typeof AssessmentEntry>

export const Assessment = z.strictObject({
  country: Iso3,
  protocol_version: z.number().int().min(1),
  last_full_check: IsoDate.nullable(),
  indicators: z.record(IndicatorId, AssessmentEntry),
})
export type Assessment = z.infer<typeof Assessment>

// ---------------------------------------------------------------------------------------------
// Correction (docs/03 §8)

const FieldChanges = z.partialRecord(z.enum(EVENT_FIELD_KEYS), z.unknown())

export const Correction = z.strictObject({
  id: CorrectionId,
  date: IsoDate,
  event: EventIdLike,
  kind: z.enum(['correction', 'retraction']),
  flagged_by: z.enum(['public', 'author', 'reply', 'reviewer']),
  flagged_ref: z.string().optional(),
  before: FieldChanges,
  after: FieldChanges,
  reason: NonEmpty,
})
export type Correction = z.infer<typeof Correction>

// ---------------------------------------------------------------------------------------------
// Right of reply (docs/03 §9)

export const Reply = z.strictObject({
  id: ReplyId,
  country: Iso3,
  received_at: IsoDate,
  /** Must be ≤ received_at + 10 days. */
  published_at: IsoDate,
  from: z.strictObject({ org: NonEmpty, role: NonEmpty }),
  contests: z.array(EventIdLike).min(1),
  text: z.strictObject({ original: NonEmpty, lang: LangCode, en: NonEmpty, fr: NonEmpty }),
  /** The project's answer. */
  response: LangText,
  outcome: z.enum(['none', 'disputed', 'corrected', 'retracted']),
  notes: z.string().optional(),
})
export type Reply = z.infer<typeof Reply>

// ---------------------------------------------------------------------------------------------
// Lead (docs/03 §10)

export const LeadSource = z.union([
  z.strictObject({ source: SourceId }),
  z.strictObject({
    url: Url,
    publisher: NonEmpty,
    kind: z.enum(['press', 'ngo']),
    title: z.string().optional(),
    date: IsoDate.optional(),
  }),
])
export type LeadSource = z.infer<typeof LeadSource>

export const Lead = z.strictObject({
  id: LeadId,
  country: Iso3,
  indicator: IndicatorId,
  claim: NonEmpty,
  sources: z.array(LeadSource).min(1),
  date: IsoDate,
  /** `open`, `dropped`, or `promoted:evt_…`. */
  status: z
    .string()
    .regex(/^(open|dropped|promoted:evt_\S+)$/, 'expected open, dropped or promoted:evt_…')
    .refine((s) => !/^promoted:evt_\S+$/.test(s) || parseEventId(s.slice(9)) !== null, {
      message: `promoted: must name an event id (${ID_DESCRIPTIONS.event})`,
    }),
  reason: z.string().optional(),
})
export type Lead = z.infer<typeof Lead>

// ---------------------------------------------------------------------------------------------
// archive/index.csv (docs/03 §1)

export const ARCHIVE_INDEX_COLUMNS = [
  'src_id',
  'url',
  'wayback_url',
  'sha256',
  'bytes',
  'retrieved_at',
  'content_type',
] as const

const blankToNull = (v: unknown) => (v === '' ? null : v)

export const ArchiveIndexRow = z.strictObject({
  src_id: SourceId,
  url: NonEmpty,
  wayback_url: z.preprocess(blankToNull, Url.nullable()),
  sha256: z.preprocess(blankToNull, Sha256.nullable()),
  bytes: z.preprocess(
    (v) => (v === '' ? null : typeof v === 'string' && /^\d+$/.test(v) ? Number(v) : v),
    z.number().int().nonnegative().nullable(),
  ),
  retrieved_at: z.preprocess(blankToNull, IsoDateTime.nullable()),
  content_type: z.string(),
})
export type ArchiveIndexRow = z.infer<typeof ArchiveIndexRow>
