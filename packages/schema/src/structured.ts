/**
 * Row schemas for the structured tables in `data/structured/` (docs/03 §1 and §7).
 *
 * CSV, UTF-8, header row, ISO dates, USD as integers. Every table has a `source` column holding
 * the id of a `dataset` source that archives the origin (or, in the hand tables, an archived
 * document: STRUCTURED_SOURCE_KINDS), or several ids joined by `;` when the row is derived from
 * more than one archived response. Columns are listed in file order; the
 * loader rejects a header that differs.
 */
import { z } from 'zod'
import { isValidId } from './ids.js'
import { Iso3, IsoDate, IsoDateTime } from './primitives.js'

/** Separator of the ids in a `source` cell and of the plan ids in fts_funding.csv. */
export const LIST_SEPARATOR = ';'

/** The source ids of a `source` cell, in the order written. */
export function splitSourceIds(cell: string): string[] {
  return cell.split(LIST_SEPARATOR)
}

/**
 * The `source` column: one dataset source id, or several joined by `;` when the row is derived
 * from more than one archived response (several pages of one API query, or a year and its
 * baseline year). Each id matches src_{YYYYMMDD}_{…} and none repeats.
 */
export const SourceIdList = z.string().superRefine((cell, ctx) => {
  const ids = splitSourceIds(cell)
  const bad = ids.filter((id) => !isValidId('source', id))
  if (bad.length > 0) {
    ctx.addIssue({
      code: 'custom',
      message: `expected one or more source ids src_{YYYYMMDD}_{publisher-slug}_{topic-slug} joined by "${LIST_SEPARATOR}"; not a source id: ${bad.map((b) => `"${b}"`).join(', ')}`,
    })
  } else if (new Set(ids).size !== ids.length) {
    ctx.addIssue({ code: 'custom', message: 'a source id is listed more than once' })
  }
})

const int = (label: string) =>
  z.preprocess(
    (v) => (typeof v === 'string' && /^-?\d+$/.test(v) ? Number(v) : v),
    z
      .number({ error: `${label}: expected an integer` })
      .int()
      .safe(),
  )

const nonNegInt = (label: string) =>
  z.preprocess(
    (v) => (typeof v === 'string' && /^\d+$/.test(v) ? Number(v) : v),
    z
      .number({ error: `${label}: expected a non-negative integer` })
      .int()
      .nonnegative()
      .safe(),
  )

const nonNegNumber = (label: string) =>
  z.preprocess(
    (v) => (typeof v === 'string' && /^\d+(\.\d+)?$/.test(v) ? Number(v) : v),
    z.number({ error: `${label}: expected a non-negative number` }).nonnegative(),
  )

const bool = z.preprocess(
  (v) => (v === 'true' ? true : v === 'false' ? false : v),
  z.boolean({ error: 'expected true or false' }),
)

const Reporter = z.enum(['self', 'mirror'])

export const UngaVoteRow = z.strictObject({
  /** Document symbol, e.g. A/RES/ES-10/21 or A/DEC/80/506. */
  resolution: z.string().regex(/^A\/(RES|DEC)\/\S+$/, 'expected a GA symbol A/RES/… or A/DEC/…'),
  date: IsoDate,
  iso3: Iso3,
  /** Y yes, N no, A abstain, X absent or did not participate (scored as absent). */
  vote: z.enum(['Y', 'N', 'A', 'X']),
  source: SourceIdList,
})

export const UnscVetoRow = z.strictObject({
  date: IsoDate,
  /** Draft resolution symbol, e.g. S/2023/773. */
  draft: z.string().regex(/^S\/\d{4}\/\d+$/, 'expected a draft symbol S/{YYYY}/{n}'),
  /** One row per vetoing permanent member. */
  vetoed_by: Iso3,
  /** true when the operative paragraphs called for a ceasefire, truce or pause (docs/02 B2). */
  ceasefire: bool,
  source: SourceIdList,
})

export const FtsFundingRow = z.strictObject({
  iso3: Iso3,
  window_start: IsoDate,
  window_end: IsoDate,
  /**
   * Paid + committed government funding dated in the window; from methodology 1.0.0-rc.2 only
   * flows dated on or after formula d1 `parameters.flows_from` (2023-10-07) count (fetch:fts).
   */
  usd_paid_committed: nonNegInt('usd_paid_committed'),
  /** FTS plan ids joined by `;`, e.g. 1156;1273. */
  plan_ids: z.string().regex(/^\d+(;\d+)*$/, 'expected plan ids joined by ";"'),
  retrieved_at: IsoDateTime,
  source: SourceIdList,
})

/** Per-plan totals of FTS government funding, all flow dates (docs/06 §2, fetch:fts). */
export const FtsPlanTotalsRow = z.strictObject({
  iso3: Iso3,
  /** FTS plan id, e.g. 1156. */
  plan_id: z.string().regex(/^\d+$/, 'expected an FTS plan id'),
  usd_paid_committed: nonNegInt('usd_paid_committed'),
  /** Number of FTS flows summed. */
  flows: nonNegInt('flows'),
  retrieved_at: IsoDateTime,
  source: SourceIdList,
})

export const SipriDeliveriesRow = z.strictObject({
  release_date: IsoDate,
  data_year: int('data_year'),
  supplier_iso3: Iso3,
  tiv_to_israel: nonNegNumber('tiv_to_israel'),
  tiv_total_to_israel: nonNegNumber('tiv_total_to_israel'),
  source: SourceIdList,
})

export const SipriOrdersRow = z.strictObject({
  release_date: IsoDate,
  data_year: int('data_year'),
  buyer_iso3: Iso3,
  tiv_new_orders_from_israel: nonNegNumber('tiv_new_orders_from_israel'),
  source: SourceIdList,
})

export const ComtradeA2Row = z.strictObject({
  iso3: Iso3,
  window_start: IsoDate,
  window_end: IsoDate,
  /**
   * First release of the period's data by the reporter (Israel for mirror rows), from the
   * Comtrade data-availability record: the computed event is valid from this date to the next
   * period's release (docs/02 §3, §5).
   */
  release_date: IsoDate,
  /** HS chapter or heading: 93, 8710, 8526 or 8802. */
  hs: z.string().regex(/^\d{2}(\d{2}){0,2}$/, 'expected an HS code of 2, 4 or 6 digits'),
  usd: nonNegInt('usd'),
  reporter: Reporter,
  retrieved_at: IsoDateTime,
  source: SourceIdList,
})

export const ComtradeC3Row = z.strictObject({
  iso3: Iso3,
  window_start: IsoDate,
  window_end: IsoDate,
  /**
   * First release of the period's data by the reporter (Israel for mirror rows), from the
   * Comtrade data-availability record: the computed event is valid from this date to the next
   * period's release (docs/02 §3, §5).
   */
  release_date: IsoDate,
  usd_total: nonNegInt('usd_total'),
  usd_2022: nonNegInt('usd_2022'),
  reporter: Reporter,
  retrieved_at: IsoDateTime,
  source: SourceIdList,
})

export const GniRow = z.strictObject({
  iso3: Iso3,
  year: int('year'),
  gni_atlas_usd: nonNegInt('gni_atlas_usd'),
  source: SourceIdList,
})

export const PopulationRow = z.strictObject({
  iso3: Iso3,
  year: int('year'),
  population: nonNegInt('population'),
  source: SourceIdList,
})

/**
 * Recognition of the State of Palestine (B8, B-25): one row per recognising state, dated the day
 * the recognition took effect, citing the archived official statement (kind official, B-31), or a
 * dataset source. A state with no row does not recognise Palestine.
 */
export const RecognitionRow = z.strictObject({
  iso3: Iso3,
  date: IsoDate,
  source: SourceIdList,
})

/**
 * HS 8526 and 8802 exports to Israel confirmed as military (docs/02 §2 A2, B-30): one row per
 * country and heading, citing the archived licence register, parliamentary answer or published
 * investigation that names the customs code. Without a row those headings do not count in A2.
 */
export const A2ConfirmedMilitaryRow = z.strictObject({
  iso3: Iso3,
  hs: z.enum(['8526', '8802'], { error: 'expected 8526 or 8802 (docs/02 §2 A2)' }),
  source: SourceIdList,
})

/** Every structured table: file name → columns in order and the row schema. */
export const STRUCTURED_TABLES = {
  'unga_votes.csv': {
    columns: ['resolution', 'date', 'iso3', 'vote', 'source'],
    row: UngaVoteRow,
  },
  'unsc_vetoes.csv': {
    columns: ['date', 'draft', 'vetoed_by', 'ceasefire', 'source'],
    row: UnscVetoRow,
  },
  'fts_funding.csv': {
    columns: [
      'iso3',
      'window_start',
      'window_end',
      'usd_paid_committed',
      'plan_ids',
      'retrieved_at',
      'source',
    ],
    row: FtsFundingRow,
  },
  'fts_plan_totals.csv': {
    columns: ['iso3', 'plan_id', 'usd_paid_committed', 'flows', 'retrieved_at', 'source'],
    row: FtsPlanTotalsRow,
  },
  'sipri_deliveries.csv': {
    columns: [
      'release_date',
      'data_year',
      'supplier_iso3',
      'tiv_to_israel',
      'tiv_total_to_israel',
      'source',
    ],
    row: SipriDeliveriesRow,
  },
  'sipri_orders.csv': {
    columns: ['release_date', 'data_year', 'buyer_iso3', 'tiv_new_orders_from_israel', 'source'],
    row: SipriOrdersRow,
  },
  'comtrade_a2.csv': {
    columns: [
      'iso3',
      'window_start',
      'window_end',
      'release_date',
      'hs',
      'usd',
      'reporter',
      'retrieved_at',
      'source',
    ],
    row: ComtradeA2Row,
  },
  'comtrade_c3.csv': {
    columns: [
      'iso3',
      'window_start',
      'window_end',
      'release_date',
      'usd_total',
      'usd_2022',
      'reporter',
      'retrieved_at',
      'source',
    ],
    row: ComtradeC3Row,
  },
  'gni.csv': {
    columns: ['iso3', 'year', 'gni_atlas_usd', 'source'],
    row: GniRow,
  },
  'population.csv': {
    columns: ['iso3', 'year', 'population', 'source'],
    row: PopulationRow,
  },
  'recognitions.csv': {
    columns: ['iso3', 'date', 'source'],
    row: RecognitionRow,
  },
  'a2_confirmed_military.csv': {
    columns: ['iso3', 'hs', 'source'],
    row: A2ConfirmedMilitaryRow,
  },
} as const satisfies Record<string, { columns: readonly string[]; row: z.ZodType }>

export type StructuredTableName = keyof typeof STRUCTURED_TABLES
export type StructuredRow<T extends StructuredTableName> = z.infer<
  (typeof STRUCTURED_TABLES)[T]['row']
>
export const STRUCTURED_TABLE_NAMES = Object.keys(STRUCTURED_TABLES) as StructuredTableName[]

/** Columns holding a country code, per table (for registry cross-checks). */
export const STRUCTURED_ISO3_COLUMN: Record<StructuredTableName, string> = {
  'unga_votes.csv': 'iso3',
  'unsc_vetoes.csv': 'vetoed_by',
  'fts_funding.csv': 'iso3',
  'fts_plan_totals.csv': 'iso3',
  'sipri_deliveries.csv': 'supplier_iso3',
  'sipri_orders.csv': 'buyer_iso3',
  'comtrade_a2.csv': 'iso3',
  'comtrade_c3.csv': 'iso3',
  'gni.csv': 'iso3',
  'population.csv': 'iso3',
  'recognitions.csv': 'iso3',
  'a2_confirmed_military.csv': 'iso3',
}

/**
 * Source kinds a table's `source` column may cite (docs/03 §7): a dataset source, except in the
 * hand tables verified against documents (B-31): a veto against the UN meeting record, a
 * recognition against the government's statement, an A2 confirmation against a licence register,
 * a parliamentary answer or a published investigation (docs/02 §2 A2).
 */
export const STRUCTURED_SOURCE_KINDS: Record<StructuredTableName, readonly string[]> = {
  'unga_votes.csv': ['dataset'],
  'unsc_vetoes.csv': ['dataset', 'official'],
  'fts_funding.csv': ['dataset'],
  'fts_plan_totals.csv': ['dataset'],
  'sipri_deliveries.csv': ['dataset'],
  'sipri_orders.csv': ['dataset'],
  'comtrade_a2.csv': ['dataset'],
  'comtrade_c3.csv': ['dataset'],
  'gni.csv': ['dataset'],
  'population.csv': ['dataset'],
  'recognitions.csv': ['dataset', 'official'],
  'a2_confirmed_military.csv': ['official', 'parliamentary', 'ngo', 'press', 'dataset'],
}
