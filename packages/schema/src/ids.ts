/**
 * Identifier patterns and helpers, docs/03 §2.
 *
 * | Thing           | Pattern                                          |
 * |-----------------|--------------------------------------------------|
 * | Event           | evt_{YYYY}_{MM}_{DD}_{ISO3}_{IND}[_{n}]           |
 * | Generated event | evt_{YYYY}_{MM}_{DD}_{ISO3}_{IND}_{slug}          |
 * | Source          | src_{YYYYMMDD}_{publisher-slug}_{topic-slug}      |
 * | Dataset source  | src_{YYYYMMDD}_{dataset}_{release}                |
 * | Reply           | rep_{YYYYMMDD}_{ISO3}_{n}                         |
 * | Correction      | cor_{YYYYMMDD}_{n}                                |
 * | Lead            | lead_{YYYYMMDD}_{ISO3}_{n}                        |
 *
 * Slugs are lowercase ASCII with hyphens, at most 40 characters. The instance suffix `_{n}`
 * of a hand-authored event starts at 2: the first event of a day keeps the bare id. A suffix of
 * digits only is always an instance number, never a generated slug, so `_0`, `_1` and `_01` are
 * rejected rather than read as slugs.
 */
import { isCalendarDate } from './primitives.js'

const SLUG = '[a-z0-9]+(?:-[a-z0-9]+)*'
const IND = '[A-E](?:1[0-2]|[1-9])'
const N = '[1-9]\\d*'
const N2 = '(?:[2-9]|[1-9]\\d+)'

export const ID_PATTERNS = {
  event: new RegExp(`^evt_(\\d{4})_(\\d{2})_(\\d{2})_([A-Z]{3})_(${IND})(?:_(${N2}))?$`),
  generatedEvent: new RegExp(
    `^evt_(\\d{4})_(\\d{2})_(\\d{2})_([A-Z]{3})_(${IND})_((?!\\d+$)${SLUG})$`,
  ),
  source: new RegExp(`^src_(\\d{8})((?:_${SLUG}){2,})$`),
  reply: new RegExp(`^rep_(\\d{8})_([A-Z]{3})_(${N})$`),
  correction: new RegExp(`^cor_(\\d{8})_(${N})$`),
  lead: new RegExp(`^lead_(\\d{8})_([A-Z]{3})_(${N})$`),
} as const

export const ID_DESCRIPTIONS = {
  event: 'evt_{YYYY}_{MM}_{DD}_{ISO3}_{IND}[_{n}] with n ≥ 2',
  generatedEvent: 'evt_{YYYY}_{MM}_{DD}_{ISO3}_{IND}_{slug}',
  source: 'src_{YYYYMMDD}_{publisher-slug}_{topic-slug}',
  reply: 'rep_{YYYYMMDD}_{ISO3}_{n}',
  correction: 'cor_{YYYYMMDD}_{n}',
  lead: 'lead_{YYYYMMDD}_{ISO3}_{n}',
} as const

export type IdKind = keyof typeof ID_PATTERNS

const SLUG_RE = new RegExp(`^${SLUG}$`)

/** `YYYYMMDD` → `YYYY-MM-DD`. */
export function compactToIso(compact: string): string {
  return `${compact.slice(0, 4)}-${compact.slice(4, 6)}-${compact.slice(6, 8)}`
}

/** `YYYY-MM-DD` → `YYYYMMDD`. */
export function isoToCompact(iso: string): string {
  return iso.replaceAll('-', '')
}

export function isValidSlug(value: string): boolean {
  return value.length <= 40 && SLUG_RE.test(value)
}

/** Latin letters that NFKD does not decompose into an ASCII base letter. */
const TRANSLITERATE: [RegExp, string][] = [
  [/[ßẞ]/g, 'ss'],
  [/æ/gi, 'ae'],
  [/œ/gi, 'oe'],
  [/ø/gi, 'o'],
  [/ł/gi, 'l'],
  [/[đð]/gi, 'd'],
  [/þ/gi, 'th'],
  [/ı/g, 'i'],
]

/**
 * Lowercase ASCII slug from free text: diacritics stripped, letters without a decomposition
 * transliterated (ß, æ, œ, ø, ł, đ, ð, þ, dotless ı), non-alphanumerics collapsed to hyphens,
 * trimmed to 40 characters without a trailing hyphen.
 */
export function slugify(text: string, max = 40): string {
  let base = text.normalize('NFKD').replace(/[̀-ͯ]/g, '')
  for (const [re, ascii] of TRANSLITERATE) base = base.replace(re, ascii)
  base = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return base.slice(0, max).replace(/-+$/, '')
}

export interface ParsedEventId {
  date: string
  iso3: string
  indicator: string
  /** Instance number; 1 when the id carries no suffix. */
  n: number
  /** Present on generated ids only. */
  slug?: string
  generated: boolean
}

export function parseEventId(id: string): ParsedEventId | null {
  const hand = ID_PATTERNS.event.exec(id)
  if (hand) {
    const [, y, m, d, iso3, indicator, n] = hand as unknown as string[]
    const date = `${y}-${m}-${d}`
    if (!isCalendarDate(date) || !iso3 || !indicator) return null
    return { date, iso3, indicator, n: n ? Number(n) : 1, generated: false }
  }
  const gen = ID_PATTERNS.generatedEvent.exec(id)
  if (gen) {
    const [, y, m, d, iso3, indicator, slug] = gen as unknown as string[]
    const date = `${y}-${m}-${d}`
    if (!isCalendarDate(date) || !iso3 || !indicator || !slug || !isValidSlug(slug)) return null
    return { date, iso3, indicator, n: 1, slug, generated: true }
  }
  return null
}

export function formatEventId(parts: {
  date: string
  iso3: string
  indicator: string
  n?: number
  slug?: string
}): string {
  const base = `evt_${parts.date.replaceAll('-', '_')}_${parts.iso3}_${parts.indicator}`
  let id = base
  if (parts.slug !== undefined) {
    if (!isValidSlug(parts.slug)) throw new Error(`invalid slug "${parts.slug}"`)
    id = `${base}_${parts.slug}`
  } else if (parts.n !== undefined && parts.n !== 1) {
    if (!Number.isInteger(parts.n) || parts.n < 2) throw new Error(`invalid instance ${parts.n}`)
    id = `${base}_${parts.n}`
  }
  return checked(id, parseEventId(id)?.generated === (parts.slug !== undefined), 'event')
}

/** Returns `id` when its parser accepts it; throws otherwise (a writer never emits a bad id). */
function checked(id: string, ok: boolean, kind: string): string {
  if (!ok) throw new Error(`invalid ${kind} id parts: "${id}" does not match ${kind} id rules`)
  return id
}

/** The first free hand-authored id for this date, country and indicator. */
export function nextEventId(
  existing: Iterable<string>,
  parts: { date: string; iso3: string; indicator: string },
): string {
  const taken = new Set(existing)
  for (let n = 1; ; n++) {
    const id = formatEventId({ ...parts, n })
    if (!taken.has(id)) return id
  }
}

export interface ParsedSourceId {
  date: string
  /** The underscore-separated slug segments after the date (publisher, topic…). */
  segments: string[]
}

export function parseSourceId(id: string): ParsedSourceId | null {
  const m = ID_PATTERNS.source.exec(id)
  if (!m) return null
  const [, compact, rest] = m as unknown as string[]
  if (!compact || !rest || !isCalendarDate(compact)) return null
  const segments = rest.slice(1).split('_')
  if (!segments.every(isValidSlug)) return null
  return { date: compactToIso(compact), segments }
}

export function formatSourceId(parts: { date: string; segments: string[] }): string {
  if (parts.segments.length < 2) throw new Error('a source id needs at least two slug segments')
  for (const s of parts.segments) if (!isValidSlug(s)) throw new Error(`invalid slug "${s}"`)
  const id = `src_${isoToCompact(parts.date)}_${parts.segments.join('_')}`
  return checked(id, parseSourceId(id) !== null, 'source')
}

interface DatedNumbered {
  date: string
  n: number
}

export function parseCorrectionId(id: string): DatedNumbered | null {
  const m = ID_PATTERNS.correction.exec(id)
  if (!m?.[1] || !m[2] || !isCalendarDate(m[1])) return null
  return { date: compactToIso(m[1]), n: Number(m[2]) }
}

/** Throws unless `n` is an integer ≥ 1 and the date and country code are valid. */
export function formatCorrectionId(parts: DatedNumbered): string {
  const id = `cor_${isoToCompact(parts.date)}_${parts.n}`
  return checked(id, parseCorrectionId(id) !== null, 'correction')
}

export function parseReplyId(id: string): (DatedNumbered & { iso3: string }) | null {
  const m = ID_PATTERNS.reply.exec(id)
  if (!m?.[1] || !m[2] || !m[3] || !isCalendarDate(m[1])) return null
  return { date: compactToIso(m[1]), iso3: m[2], n: Number(m[3]) }
}

/** Throws unless `n` is an integer ≥ 1 and the date and country code are valid. */
export function formatReplyId(parts: DatedNumbered & { iso3: string }): string {
  const id = `rep_${isoToCompact(parts.date)}_${parts.iso3}_${parts.n}`
  return checked(id, parseReplyId(id) !== null, 'reply')
}

export function parseLeadId(id: string): (DatedNumbered & { iso3: string }) | null {
  const m = ID_PATTERNS.lead.exec(id)
  if (!m?.[1] || !m[2] || !m[3] || !isCalendarDate(m[1])) return null
  return { date: compactToIso(m[1]), iso3: m[2], n: Number(m[3]) }
}

/** Throws unless `n` is an integer ≥ 1 and the date and country code are valid. */
export function formatLeadId(parts: DatedNumbered & { iso3: string }): string {
  const id = `lead_${isoToCompact(parts.date)}_${parts.iso3}_${parts.n}`
  return checked(id, parseLeadId(id) !== null, 'lead')
}

/** True when `id` matches the pattern for `kind` and its embedded date is a real date. */
export function isValidId(kind: IdKind, id: string): boolean {
  switch (kind) {
    case 'event':
      return parseEventId(id)?.generated === false
    case 'generatedEvent':
      return parseEventId(id)?.generated === true
    case 'source':
      return parseSourceId(id) !== null
    case 'reply':
      return parseReplyId(id) !== null
    case 'correction':
      return parseCorrectionId(id) !== null
    case 'lead':
      return parseLeadId(id) !== null
  }
}
