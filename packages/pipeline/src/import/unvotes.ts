/**
 * `pnpm import:unvotes` as pure functions (docs/06 §2): the UN Digital Library General Assembly
 * voting data, either the bulk CSV (record 4060887) or a per-resolution MARCXML export
 * (`/record/{id}/export/xm`), reduced to the qualifying votes of votes.yaml and written as
 * unga_votes.csv rows (resolution, date, iso3, vote Y|N|A|X, source).
 *
 * The column names of the bulk CSV and the MARC tags are read by name from the file, with the
 * aliases below; a file whose header matches none of them is refused with its header listed, so
 * a change of format stops the import instead of misreading it. A blank vote, "non-voting" or
 * "absent" is X (docs/02 §2 B1: a formal "did not participate" is treated as absent).
 */
import { parseCsv } from '@gai/schema'
import { iso3ForName } from '../names.js'

/** Header aliases, lowercase, for the bulk CSV. */
const CSV_COLUMNS = {
  symbol: ['resolution', 'symbol', 'undl_symbol', 'res_symbol'],
  iso3: ['ms_code', 'iso3', 'country_code', 'iso_code'],
  name: ['ms_name', 'country', 'member_state', 'country_name'],
  vote: ['ms_vote', 'vote'],
  date: ['date', 'vote_date'],
} as const

export type Vote = 'Y' | 'N' | 'A' | 'X'

export interface ParsedVote {
  symbol: string
  date: string | null
  iso3: string
  vote: Vote
}

export interface ParsedVotes {
  votes: ParsedVote[]
  /** Member names that could not be coded (no ISO3 column value and no known name). */
  unknownNames: string[]
}

/** Y/N/A/X from the codes and words the exports use; throws on anything else. */
export function normaliseVote(raw: string): Vote {
  const v = raw.trim().toUpperCase()
  if (v === 'Y' || v === 'YES') return 'Y'
  if (v === 'N' || v === 'NO') return 'N'
  if (v === 'A' || v === 'ABSTAIN' || v === 'ABSTENTION') return 'A'
  if (
    v === '' ||
    v === 'X' ||
    v === 'NON-VOTING' ||
    v === 'NON VOTING' ||
    v === 'ABSENT' ||
    v === 'DID NOT VOTE'
  )
    return 'X'
  throw new Error(`unknown vote value "${raw}"`)
}

/** `YYYY-MM-DD` from `YYYY-MM-DD…`, `YYYYMMDD` or `YYYY/MM/DD`; null when absent. */
export function normaliseDate(raw: string | undefined): string | null {
  const s = (raw ?? '').trim()
  const m = /^(\d{4})[-/]?(\d{2})[-/]?(\d{2})/.exec(s)
  return m ? `${m[1]}-${m[2]}-${m[3]}` : null
}

function pick(header: string[], aliases: readonly string[]): string | undefined {
  const lower = header.map((h) => h.trim().toLowerCase())
  const i = lower.findIndex((h) => aliases.includes(h))
  return i === -1 ? undefined : header[i]
}

function code(
  iso3: string | undefined,
  name: string | undefined,
  unknown: Set<string>,
): string | undefined {
  const c = iso3?.trim().toUpperCase()
  if (c && /^[A-Z]{3}$/.test(c)) return c
  const byName = name ? iso3ForName(name) : undefined
  if (byName) return byName
  if (name) unknown.add(name.trim())
  return undefined
}

export function parseVotesCsv(text: string, file: string): ParsedVotes {
  const parsed = parseCsv(text, file)
  if (!parsed.ok) throw new Error(parsed.issues.map((i) => i.message).join('; '))
  const col = {
    symbol: pick(parsed.header, CSV_COLUMNS.symbol),
    iso3: pick(parsed.header, CSV_COLUMNS.iso3),
    name: pick(parsed.header, CSV_COLUMNS.name),
    vote: pick(parsed.header, CSV_COLUMNS.vote),
    date: pick(parsed.header, CSV_COLUMNS.date),
  }
  if (!col.symbol || !col.vote || (!col.iso3 && !col.name)) {
    throw new Error(
      `${file}: not a recognised UN voting CSV; header is "${parsed.header.join(',')}" (expected a symbol column ${CSV_COLUMNS.symbol.join('/')}, a vote column ${CSV_COLUMNS.vote.join('/')} and a member column ${[...CSV_COLUMNS.iso3, ...CSV_COLUMNS.name].join('/')})`,
    )
  }
  const unknown = new Set<string>()
  const votes: ParsedVote[] = []
  for (const { record, line } of parsed.rows) {
    const symbol = (record[col.symbol] ?? '').trim()
    if (symbol === '') continue
    const iso3 = code(
      col.iso3 ? record[col.iso3] : undefined,
      col.name ? record[col.name] : undefined,
      unknown,
    )
    if (iso3 === undefined) continue
    let vote: Vote
    try {
      vote = normaliseVote(record[col.vote] ?? '')
    } catch (err) {
      throw new Error(`${file}:${line}: ${(err as Error).message}`)
    }
    votes.push({ symbol, date: normaliseDate(col.date ? record[col.date] : undefined), iso3, vote })
  }
  return { votes, unknownNames: [...unknown].sort() }
}

// ---------------------------------------------------------------------------------------------
// MARCXML

const XML_ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" }
const unescapeXml = (s: string) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (m, e: string) =>
    e.startsWith('#x')
      ? String.fromCodePoint(Number.parseInt(e.slice(2), 16))
      : e.startsWith('#')
        ? String.fromCodePoint(Number(e.slice(1)))
        : (XML_ENTITIES[e] ?? m),
  )

/** The subfields of each `<datafield tag="…">` of one record, in order. */
function datafields(record: string): { tag: string; sub: Map<string, string> }[] {
  const out: { tag: string; sub: Map<string, string> }[] = []
  for (const f of record.matchAll(
    /<(?:marc:)?datafield\b[^>]*\btag="(\d{3})"[^>]*>([\s\S]*?)<\/(?:marc:)?datafield>/g,
  )) {
    const sub = new Map<string, string>()
    for (const s of (f[2] ?? '').matchAll(
      /<(?:marc:)?subfield\b[^>]*\bcode="(\w)"[^>]*>([\s\S]*?)<\/(?:marc:)?subfield>/g,
    )) {
      sub.set(s[1] as string, unescapeXml(s[2] ?? '').trim())
    }
    out.push({ tag: f[1] as string, sub })
  }
  return out
}

/**
 * A MARCXML voting record: the symbol in 791 $a, the date in 269 $a, and one 967 field per
 * member with the vote in $d, the member's code in the subfield holding three capital letters
 * (checked in $c, $a, $b), and the name in $e.
 */
export function parseVotesMarcXml(text: string, file: string): ParsedVotes {
  const records = [...text.matchAll(/<(?:marc:)?record\b[^>]*>([\s\S]*?)<\/(?:marc:)?record>/g)]
  if (records.length === 0) throw new Error(`${file}: no MARCXML <record> found`)
  const unknown = new Set<string>()
  const votes: ParsedVote[] = []
  for (const r of records) {
    const fields = datafields(r[1] ?? '')
    const symbol = fields.find((f) => f.tag === '791')?.sub.get('a')
    const date = normaliseDate(fields.find((f) => f.tag === '269')?.sub.get('a'))
    const members = fields.filter((f) => f.tag === '967')
    if (!symbol || members.length === 0) {
      throw new Error(
        `${file}: a record lacks the symbol (791 $a) or the votes (967); not a voting record`,
      )
    }
    for (const m of members) {
      const iso = ['c', 'a', 'b']
        .map((c) => m.sub.get(c))
        .find((v) => v !== undefined && /^[A-Z]{3}$/.test(v))
      const iso3 = code(iso, m.sub.get('e'), unknown)
      if (iso3 === undefined) continue
      votes.push({ symbol, date, iso3, vote: normaliseVote(m.sub.get('d') ?? '') })
    }
  }
  return { votes, unknownNames: [...unknown].sort() }
}

export function parseVotesFile(text: string, file: string): ParsedVotes {
  const head = text.trimStart().slice(0, 200)
  return head.startsWith('<') ? parseVotesMarcXml(text, file) : parseVotesCsv(text, file)
}

export type UngaRow = { resolution: string; date: string; iso3: string; vote: Vote; source: string }

export interface VotesImport {
  rows: UngaRow[]
  /** Qualifying symbols not found in the file. */
  absentSymbols: string[]
  /** Per imported symbol, the members with no row. */
  missingMembers: Map<string, string[]>
  /** Rows whose date differs from votes.yaml (the votes.yaml date is written). */
  dateMismatches: string[]
  /** Symbol → vote counts in the file, compared with votes.yaml counts. */
  countMismatches: string[]
  unknownCodes: string[]
}

/**
 * The unga_votes.csv rows of the qualifying votes found in the file, one per member, dated as in
 * votes.yaml, and the checks the import reports: members missing from a vote, dates and totals
 * that differ from votes.yaml.
 */
export function votesImport(
  parsed: ParsedVotes,
  qualifying: readonly {
    symbol: string
    date: string
    counts: { yes: number; no: number; abstain: number }
  }[],
  members: readonly string[],
  universe: ReadonlySet<string>,
  source: string,
): VotesImport {
  const bySymbol = new Map(qualifying.map((q) => [q.symbol, q]))
  const rows: UngaRow[] = []
  const seen = new Map<string, Set<string>>()
  const dateMismatches = new Set<string>()
  const unknownCodes = new Set<string>()
  const tally = new Map<string, { Y: number; N: number; A: number; X: number }>()
  for (const v of parsed.votes) {
    const q = bySymbol.get(v.symbol)
    if (q === undefined) continue
    if (!universe.has(v.iso3)) {
      unknownCodes.add(v.iso3)
      continue
    }
    const set = seen.get(v.symbol) ?? new Set<string>()
    if (set.has(v.iso3)) throw new Error(`${v.symbol}: two votes for ${v.iso3} in the file`)
    set.add(v.iso3)
    seen.set(v.symbol, set)
    if (v.date !== null && v.date !== q.date)
      dateMismatches.add(`${v.symbol}: file ${v.date}, votes.yaml ${q.date}`)
    const t = tally.get(v.symbol) ?? { Y: 0, N: 0, A: 0, X: 0 }
    t[v.vote]++
    tally.set(v.symbol, t)
    rows.push({ resolution: v.symbol, date: q.date, iso3: v.iso3, vote: v.vote, source })
  }
  const missingMembers = new Map<string, string[]>()
  for (const [symbol, set] of seen) {
    const missing = members.filter((m) => !set.has(m))
    if (missing.length > 0) missingMembers.set(symbol, missing)
  }
  const countMismatches: string[] = []
  for (const [symbol, t] of tally) {
    const c = bySymbol.get(symbol)?.counts
    if (c && (c.yes !== t.Y || c.no !== t.N || c.abstain !== t.A)) {
      countMismatches.push(
        `${symbol}: file ${t.Y}–${t.N}–${t.A} (${t.X} X), votes.yaml ${c.yes}–${c.no}–${c.abstain}`,
      )
    }
  }
  return {
    rows,
    absentSymbols: qualifying.map((q) => q.symbol).filter((s) => !seen.has(s)),
    missingMembers,
    dateMismatches: [...dateMismatches].sort(),
    countMismatches: countMismatches.sort(),
    unknownCodes: [...unknownCodes].sort(),
  }
}
