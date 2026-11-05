/**
 * A2 and C3 trade data from UN Comtrade (docs/02 §5, docs/06 §2), annual HS data, periods 2022 to
 * the latest year.
 *
 * The keyed API (`/data/v1/get`, header `Ocp-Apim-Subscription-Key`) cannot be archived: Wayback
 * cannot send the key, and a key in a URL would be published. So the data of record are the
 * keyless preview URLs of the same queries (`/public/v1/preview`, one period per call, at most 500
 * records), each archived with Save Page Now and parsed from the archived bytes; the keyed API is
 * called once per reporter and direction to cross-check them, within the free tier's 500 calls a
 * day (a local counter and resume file). The data-availability record (`/public/v1/getDA`, also
 * archived) gives each reporter's first release date of each year, which is when the computed
 * event starts (docs/02 §3).
 *
 * Queries: reporter → Israel (376), HS 93, 8710, 8526, 8802 and TOTAL, flows X and M, totals only
 * (customsCode C00, motCode 0, partner2Code 0); the mirror is reporter 376 → the country.
 *
 * Mirror queries cover several partners at once (P-14): Israel's responses for one year name up
 * to MIRROR_BATCH partners, so a run of n reporters needs ⌈n / MIRROR_BATCH⌉ mirror captures a
 * year instead of n. A partner gives at most 10 records (5 codes × 2 flows), so a batch stays
 * under the preview's 500 records; a response holding 500 records may be cut and is refused.
 */

export const ISRAEL_CODE = 376
export const COMTRADE_CMD = ['93', '8710', '8526', '8802', 'TOTAL'] as const
export const ARMS_HS = ['93', '8710', '8526', '8802'] as const
export const BASELINE_YEAR = 2022
export const DAILY_CALL_LIMIT = 500
/** Records returned by one preview call at most. */
export const PREVIEW_MAX_RECORDS = 500
/** Partners per mirror query: 45 × 10 records = 450, under PREVIEW_MAX_RECORDS. */
export const MIRROR_BATCH = 45

const QUERY_TAIL = `cmdCode=${COMTRADE_CMD.join(',')}&flowCode=X,M&customsCode=C00&motCode=0&partner2Code=0`

export const REPORTERS_URL = 'https://comtradeapi.un.org/files/v1/app/reference/Reporters.json'

const codes = (c: number | readonly number[]): string =>
  typeof c === 'number' ? String(c) : c.join(',')

/** Keyless preview of one reporter → one or several partners, one year (archived). */
export const previewUrl = (
  reporter: number,
  partner: number | readonly number[],
  year: number,
): string =>
  `https://comtradeapi.un.org/public/v1/preview/C/A/HS?reporterCode=${reporter}&partnerCode=${codes(partner)}&period=${year}&${QUERY_TAIL}`

/** Keyed query, one or several partners, several years (counted, not archived). */
export const keyedUrl = (
  reporter: number,
  partner: number | readonly number[],
  years: readonly number[],
): string =>
  `https://comtradeapi.un.org/data/v1/get/C/A/HS?reporterCode=${reporter}&partnerCode=${codes(partner)}&period=${years.join(',')}&${QUERY_TAIL}`

/** Partner codes in batches of at most `size`, in the order given. */
export function mirrorBatches(partners: readonly number[], size = MIRROR_BATCH): number[][] {
  if (!Number.isInteger(size) || size < 1) throw new Error(`batch size ${size}`)
  const out: number[][] = []
  for (let i = 0; i < partners.length; i += size) out.push(partners.slice(i, i + size))
  return out
}

/**
 * Null when a preview response is complete; else why not: a response holding the preview's
 * maximum of records may have been cut, so its partners would silently miss records.
 */
export function truncatedPreview(json: unknown): string | null {
  const data = (json as { data?: unknown })?.data
  if (!Array.isArray(data)) return null
  return data.length >= PREVIEW_MAX_RECORDS
    ? `${data.length} records, the preview maximum: the response may be cut; use smaller batches`
    : null
}

/** The records of one partner in a multi-partner response. */
export const recordsOfPartner = (records: readonly TradeRecord[], partner: number): TradeRecord[] =>
  records.filter((r) => r.partner === partner)

/** Data availability of the reporters' annual HS data (archived). */
export const availabilityUrl = (reporters: readonly number[], years: readonly number[]): string =>
  `https://comtradeapi.un.org/public/v1/getDA/C/A/HS?reporterCode=${reporters.join(',')}&period=${years.join(',')}`

export const yearsFrom = (latest: number): number[] =>
  Array.from({ length: latest - BASELINE_YEAR + 1 }, (_, i) => BASELINE_YEAR + i)

/** ISO3 → current Comtrade reporter code (entries without an expiry date, not groups). */
export function parseReporters(json: unknown): Map<string, number> {
  const results = (json as { results?: unknown })?.results
  if (!Array.isArray(results)) throw new Error('not the Comtrade reporter list')
  const out = new Map<string, number>()
  for (const r of results as Record<string, unknown>[]) {
    if (r.isGroup === true || r.entryExpiredDate) continue
    const iso3 = r.reporterCodeIsoAlpha3
    const code = r.reporterCode
    if (typeof iso3 === 'string' && typeof code === 'number') out.set(iso3, code)
  }
  return out
}

export interface TradeRecord {
  reporter: number
  partner: number
  year: number
  flow: 'X' | 'M'
  cmd: string
  value: number
}

/** The records of a preview or keyed response; throws on an error payload. */
export function parseTrade(json: unknown): TradeRecord[] {
  const j = json as { data?: unknown; error?: unknown; statusCode?: unknown }
  if (!Array.isArray(j?.data)) {
    throw new Error(
      `not a Comtrade data response: ${String(j?.error ?? j?.statusCode ?? 'no data')}`,
    )
  }
  if (typeof j.error === 'string' && j.error !== '') throw new Error(`Comtrade error: ${j.error}`)
  const out: TradeRecord[] = []
  for (const r of j.data as Record<string, unknown>[]) {
    if (r.customsCode !== 'C00' || r.motCode !== 0 || r.partner2Code !== 0) continue
    const flow = r.flowCode
    const value = r.primaryValue
    if ((flow !== 'X' && flow !== 'M') || typeof value !== 'number') continue
    out.push({
      reporter: Number(r.reporterCode),
      partner: Number(r.partnerCode),
      year: Number(r.refYear ?? r.period),
      flow,
      cmd: String(r.cmdCode),
      value,
    })
  }
  return out
}

/** First release date (YYYY-MM-DD) per `reporter:year` from getDA. */
export function parseAvailability(json: unknown): Map<string, string> {
  const data = (json as { data?: unknown })?.data
  if (!Array.isArray(data)) throw new Error('not a Comtrade data-availability response')
  const out = new Map<string, string>()
  for (const d of data as Record<string, unknown>[]) {
    const first = typeof d.firstReleased === 'string' ? d.firstReleased.slice(0, 10) : ''
    if (!/^\d{4}-\d{2}-\d{2}$/.test(first)) continue
    out.set(`${Number(d.reporterCode)}:${Number(d.period)}`, first)
  }
  return out
}

export type A2Row = {
  iso3: string
  window_start: string
  window_end: string
  release_date: string
  hs: string
  usd: number
  reporter: 'self' | 'mirror'
  retrieved_at: string
  source: string
}

export type C3Row = {
  iso3: string
  window_start: string
  window_end: string
  release_date: string
  usd_total: number
  usd_2022: number
  reporter: 'self' | 'mirror'
  retrieved_at: string
  source: string
}

/** One archived preview response: a reporter → partner year and its source id. */
export interface YearResponse {
  year: number
  sourceId: string
  records: TradeRecord[]
}

export interface ComtradeInput {
  iso3: string
  code: number
  /** Archived preview responses, the country reporting (partner Israel). */
  self: readonly YearResponse[]
  /** Archived preview responses, Israel reporting (partner the country). */
  mirror: readonly YearResponse[]
  releases: ReadonlyMap<string, string>
  /** Ids of the archived reporter list and data-availability record, cited by every row. */
  commonSources: readonly string[]
  retrievedAt: string
}

export interface ComtradeRows {
  a2: A2Row[]
  c3: C3Row[]
  /** Why a year produced no row, per direction. */
  gaps: string[]
}

const windowOf = (year: number) => ({ window_start: `${year}-01-01`, window_end: `${year}-12-31` })

/**
 * A2 and C3 rows from the archived responses (docs/02 §5). Only records Comtrade returned are
 * written; a code with no record gets no row (absent, never a zero). A2: one row per HS code with
 * an export record (the country's exports X; for the mirror, Israel's imports M). C3: one row per
 * year when both flows of TOTAL exist for that year and for 2022 in the same direction.
 */
export function comtradeRows(input: ComtradeInput): ComtradeRows {
  const a2: A2Row[] = []
  const c3: C3Row[] = []
  const gaps: string[] = []
  const directions = [
    {
      reporter: 'self' as const,
      responses: input.self,
      code: input.code,
      exportFlow: 'X' as const,
    },
    {
      reporter: 'mirror' as const,
      responses: input.mirror,
      code: ISRAEL_CODE,
      exportFlow: 'M' as const,
    },
  ]
  for (const d of directions) {
    // A multi-partner mirror response holds other partners' records too: keep this pair's.
    const partner = d.reporter === 'self' ? ISRAEL_CODE : input.code
    const responses = d.responses.map((r) => ({
      ...r,
      records: r.records.filter((x) => x.reporter === d.code && x.partner === partner),
    }))
    const baseline = responses.find((r) => r.year === BASELINE_YEAR)
    const total = (r: YearResponse | undefined, flow: 'X' | 'M') =>
      r?.records.find((x) => x.cmd === 'TOTAL' && x.flow === flow)?.value
    for (const r of responses) {
      const release = input.releases.get(`${d.code}:${r.year}`)
      if (release === undefined) {
        if (r.records.length > 0)
          gaps.push(`${d.reporter} ${r.year}: records but no release date in getDA`)
        else gaps.push(`${d.reporter} ${r.year}: no data`)
        continue
      }
      const sources = [r.sourceId, ...input.commonSources]
      for (const hs of ARMS_HS) {
        const rec = r.records.find((x) => x.cmd === hs && x.flow === d.exportFlow)
        if (rec === undefined) continue
        a2.push({
          iso3: input.iso3,
          ...windowOf(r.year),
          release_date: release,
          hs,
          usd: Math.round(rec.value),
          reporter: d.reporter,
          retrieved_at: input.retrievedAt,
          source: sources.join(';'),
        })
      }
      const x = total(r, 'X')
      const m = total(r, 'M')
      const x0 = total(baseline, 'X')
      const m0 = total(baseline, 'M')
      if (x === undefined || m === undefined) {
        gaps.push(`${d.reporter} ${r.year}: total trade not reported in both flows`)
        continue
      }
      if (x0 === undefined || m0 === undefined || baseline === undefined) {
        gaps.push(`${d.reporter} ${r.year}: no ${BASELINE_YEAR} baseline in both flows`)
        continue
      }
      const c3Sources = [...new Set([r.sourceId, baseline.sourceId, ...input.commonSources])]
      c3.push({
        iso3: input.iso3,
        ...windowOf(r.year),
        release_date: release,
        usd_total: Math.round(x + m),
        usd_2022: Math.round(x0 + m0),
        reporter: d.reporter,
        retrieved_at: input.retrievedAt,
        source: c3Sources.join(';'),
      })
    }
  }
  return { a2, c3, gaps }
}

/**
 * Differences between the archived preview records and the keyed API's for the same queries,
 * compared on the rounded value (Comtrade revises data; a mismatch is reported, and the archived
 * value is the one written, since it is the one the hash covers).
 */
export function crossCheck(
  archived: readonly TradeRecord[],
  keyed: readonly TradeRecord[],
): string[] {
  const key = (r: TradeRecord) => `${r.reporter}→${r.partner} ${r.year} ${r.flow} ${r.cmd}`
  const a = new Map(archived.map((r) => [key(r), Math.round(r.value)]))
  const k = new Map(keyed.map((r) => [key(r), Math.round(r.value)]))
  const out: string[] = []
  for (const [id, v] of a) {
    const w = k.get(id)
    if (w === undefined) out.push(`${id}: ${v} in the archived preview, absent from the keyed API`)
    else if (w !== v) out.push(`${id}: ${v} in the archived preview, ${w} from the keyed API`)
  }
  for (const [id, w] of k)
    if (!a.has(id)) out.push(`${id}: ${w} from the keyed API, absent from the archived preview`)
  return out.sort()
}

// ---------------------------------------------------------------------------------------------
// Call counter and resume file

export interface ComtradeState {
  /** UTC day the counter applies to. */
  day: string
  calls: number
  /** Reporters done: ISO3 → retrieval time. */
  done: Record<string, string>
}

/** The state for `today`: the counter resets on a new UTC day, the list of reporters done stays. */
export function stateFor(saved: ComtradeState | null, today: string): ComtradeState {
  if (saved === null) return { day: today, calls: 0, done: {} }
  return saved.day === today ? saved : { day: today, calls: 0, done: saved.done }
}

/** Whether `n` more keyed calls fit in today's budget. */
export const canCall = (state: ComtradeState, n: number, limit = DAILY_CALL_LIMIT): boolean =>
  state.calls + n <= limit
