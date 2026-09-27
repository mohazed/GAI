/**
 * Row schemas for the structured tables in `data/structured/` (docs/03 §1 and §7).
 *
 * CSV, UTF-8, header row, ISO dates, USD as integers. Every table has a `source` column holding
 * the id of a `dataset` source that archives the origin. Columns are listed in file order; the
 * loader rejects a header that differs.
 */
import { z } from 'zod'
import { Iso3, IsoDate, IsoDateTime } from './primitives.js'
import { SourceId } from './records.js'

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
  source: SourceId,
})

export const UnscVetoRow = z.strictObject({
  date: IsoDate,
  /** Draft resolution symbol, e.g. S/2023/773. */
  draft: z.string().regex(/^S\/\d{4}\/\d+$/, 'expected a draft symbol S/{YYYY}/{n}'),
  /** One row per vetoing permanent member. */
  vetoed_by: Iso3,
  /** true when the operative paragraphs called for a ceasefire, truce or pause (docs/02 B2). */
  ceasefire: bool,
  source: SourceId,
})

export const FtsFundingRow = z.strictObject({
  iso3: Iso3,
  window_start: IsoDate,
  window_end: IsoDate,
  usd_paid_committed: nonNegInt('usd_paid_committed'),
  /** FTS plan ids joined by `;`, e.g. 1156;1273. */
  plan_ids: z.string().regex(/^\d+(;\d+)*$/, 'expected plan ids joined by ";"'),
  retrieved_at: IsoDateTime,
  source: SourceId,
})

export const SipriDeliveriesRow = z.strictObject({
  release_date: IsoDate,
  data_year: int('data_year'),
  supplier_iso3: Iso3,
  tiv_to_israel: nonNegNumber('tiv_to_israel'),
  tiv_total_to_israel: nonNegNumber('tiv_total_to_israel'),
  source: SourceId,
})

export const SipriOrdersRow = z.strictObject({
  release_date: IsoDate,
  data_year: int('data_year'),
  buyer_iso3: Iso3,
  tiv_new_orders_from_israel: nonNegNumber('tiv_new_orders_from_israel'),
  source: SourceId,
})

export const ComtradeA2Row = z.strictObject({
  iso3: Iso3,
  window_start: IsoDate,
  window_end: IsoDate,
  /** HS chapter or heading: 93, 8710, 8526 or 8802. */
  hs: z.string().regex(/^\d{2}(\d{2}){0,2}$/, 'expected an HS code of 2, 4 or 6 digits'),
  usd: nonNegInt('usd'),
  reporter: Reporter,
  retrieved_at: IsoDateTime,
  source: SourceId,
})

export const ComtradeC3Row = z.strictObject({
  iso3: Iso3,
  window_start: IsoDate,
  window_end: IsoDate,
  usd_total: nonNegInt('usd_total'),
  usd_2022: nonNegInt('usd_2022'),
  reporter: Reporter,
  retrieved_at: IsoDateTime,
  source: SourceId,
})

export const GniRow = z.strictObject({
  iso3: Iso3,
  year: int('year'),
  gni_atlas_usd: nonNegInt('gni_atlas_usd'),
  source: SourceId,
})

export const PopulationRow = z.strictObject({
  iso3: Iso3,
  year: int('year'),
  population: nonNegInt('population'),
  source: SourceId,
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
  'sipri_deliveries.csv': 'supplier_iso3',
  'sipri_orders.csv': 'buyer_iso3',
  'comtrade_a2.csv': 'iso3',
  'comtrade_c3.csv': 'iso3',
  'gni.csv': 'iso3',
  'population.csv': 'iso3',
}
