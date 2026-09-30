/**
 * Shared parts of the generators (D-08, docs/03 §7): the context they read, the evidence entry of
 * a dataset row, the review block, and the number formats of the generated summaries.
 *
 * Generators are pure: they read typed rows and methodology files and return events; they never
 * read the clock, the network or the file system. Every generated event is `confirmed` (its
 * evidence is a dataset source), `published` (the table is the reviewed record), carries
 * `generated: true`, and cites each dataset source of its row with a `row N of …` locator.
 */
import {
  type Event,
  type Evidence,
  type IndicatorsFile,
  type Located,
  parseSourceId,
  type StructuredTableName,
  splitSourceIds,
  type ThresholdsFile,
  type VotesFile,
} from '@gai/schema'
import { formatInteger, NNBSP, roundHalfAwayFromZero } from '@gai/scoring'
import { csvLine } from '../lib/files.js'

export interface GenerateContext {
  indicators: IndicatorsFile['indicators']
  thresholds: ThresholdsFile
  votes: VotesFile
  /** Countries whose rows are never turned into events (ISR, PSE, D-10). */
  excluded: ReadonlySet<string>
}

/** What a generator returns: the events, and notes on rows it could not use. */
export interface Generated {
  events: Event[]
  notes: string[]
}

export const GENERATOR = '@gai/pipeline generate'

/** The row's values in file order, the quote of a dataset-row evidence entry. */
export function rowQuote(row: Record<string, unknown>, columns: readonly string[]): string {
  return csvLine(columns.map((c) => row[c]))
}

/** One evidence entry per dataset source the row cites (docs/03 §4 `row …` locator). */
export function rowEvidence(
  row: Located<Record<string, unknown>>,
  table: StructuredTableName,
  columns: readonly string[],
): Evidence[] {
  const quote = rowQuote(row.value, columns)
  return splitSourceIds(String(row.value.source)).map((source) => ({
    source,
    quote,
    quote_lang: 'en',
    locator: `row ${row.line ?? '?'} of data/structured/${table}`,
  }))
}

/**
 * The review block of a generated event: drafted by the generator on the retrieval date of its
 * first dataset source (the date in the source id), never reviewed as an event, since the table
 * it comes from is what is reviewed.
 */
export function generatedReview(
  evidence: readonly Evidence[],
  table: StructuredTableName,
): Event['review'] {
  const first = evidence[0]?.source
  const drafted = (first && parseSourceId(first)?.date) || '2023-10-07'
  return {
    drafted_by: GENERATOR,
    drafted_at: drafted,
    second_read: null,
    reviewed_by: null,
    reviewed_at: null,
    notes: `Generated from data/structured/${table} (D-08); not hand-authored.`,
  }
}

export function baseEvent(
  e: Pick<
    Event,
    | 'id'
    | 'country'
    | 'indicator'
    | 'type'
    | 'date'
    | 'points'
    | 'points_rationale'
    | 'summary'
    | 'evidence'
  > & {
    end?: string | null
  },
  table: StructuredTableName,
): Event {
  return {
    id: e.id,
    revision: 1,
    country: e.country,
    indicator: e.indicator,
    type: e.type,
    date: e.date,
    ...(e.type === 'repeatable' ? {} : { end: e.end ?? null }),
    points: e.points,
    points_rationale: e.points_rationale,
    confidence: 'confirmed',
    scope: ['gaza'],
    summary: e.summary,
    evidence: e.evidence,
    status: 'published',
    supersedes: null,
    related: [],
    review: generatedReview(e.evidence, table),
    generated: true,
  }
}

/** Events in a stable order: country, date, id. */
export function sortEvents(events: Event[]): Event[] {
  return events.sort((a, b) =>
    a.country !== b.country
      ? a.country < b.country
        ? -1
        : 1
      : a.date !== b.date
        ? a.date < b.date
          ? -1
          : 1
        : a.id < b.id
          ? -1
          : a.id > b.id
            ? 1
            : 0,
  )
}

// ---------------------------------------------------------------------------------------------
// Numbers in summaries (docs/05 §2: decimal comma and narrow no-break space in French)

function decimal(x: number, decimals: number, lang: 'en' | 'fr'): string {
  const s = roundHalfAwayFromZero(x, decimals).toFixed(decimals)
  return lang === 'fr' ? s.replace('.', ',') : s
}

/**
 * `USD 105,066,282`: an exact amount of a structured table, as the English `points_rationale`
 * quotes it, grouped by commas (docs/05 §2); decimals, if any, are kept as the table has them.
 */
export function usdExact(n: number): string {
  const [int = '', frac] = String(n).split('.')
  return `USD ${int.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${frac === undefined ? '' : `.${frac}`}`
}

/** `USD 12.3 million`, `USD 8.4 billion`, `USD 250,000` / `12,3 millions USD`, `250 000 USD`. */
export function money(usd: number, lang: 'en' | 'fr'): string {
  const n = Math.round(usd)
  if (n >= 1e9) {
    const v = decimal(n / 1e9, 1, lang)
    return lang === 'en'
      ? `USD ${v} billion`
      : `${v}${NNBSP}${n / 1e9 >= 2 ? 'milliards' : 'milliard'} USD`
  }
  if (n >= 1e6) {
    const v = decimal(n / 1e6, 1, lang)
    return lang === 'en'
      ? `USD ${v} million`
      : `${v}${NNBSP}${n / 1e6 >= 2 ? 'millions' : 'million'} USD`
  }
  return lang === 'en' ? `USD ${formatInteger(n, 'en')}` : `${formatInteger(n, 'fr')}${NNBSP}USD`
}

/** `30.1%` / `30,1 %`. */
export function percent(share: number, lang: 'en' | 'fr', decimals = 1): string {
  const v = decimal(share * 100, decimals, lang)
  return lang === 'en' ? `${v}%` : `${v}${NNBSP}%`
}

/** A TIV value: `123.4` / `123,4`, integers without decimals. */
export function tiv(x: number, lang: 'en' | 'fr'): string {
  if (Number.isInteger(x)) return formatInteger(x, lang)
  return decimal(x, 1, lang)
}

/** Signed points for rationales: `+3`, `−5`, `0`. */
export function signed(x: number): string {
  if (x === 0) return '0'
  return `${x > 0 ? '+' : '−'}${Math.abs(x)}`
}
