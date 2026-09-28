import {
  type ApiAssessmentRow,
  type ApiCorrection,
  type ApiCountryEntry,
  ApiDumpFile,
  type ApiEvent,
  type ApiReply,
  type ApiSource,
  apiSchemaFor,
  type Country,
  WINDOW_START,
} from '@gai/schema'
import { roundHalfAwayFromZero } from '@gai/scoring'
import { parse } from 'csv-parse/sync'
import { describe, expect, it } from 'vitest'
import {
  ASSESSMENTS_CSV_COLUMNS,
  COUNTRIES_CSV_COLUMNS,
  COUNTRIES_SCORECARD_CSV_COLUMNS,
  type DumpAssessment,
  type DumpInput,
  type DumpLead,
  dumpFiles,
  EVENTS_CSV_COLUMNS,
  REGISTRY_CSV_COLUMNS,
  SCORES_DAILY_CSV_COLUMNS,
  SOURCES_CSV_COLUMNS,
} from './dumps.js'
import { jsonText } from './json.js'
import type { DayScore } from './types.js'

// Every row below is synthetic: X-prefixed ISO3 codes are user-assigned (no real country),
// example.org URLs, invented summaries. Only the shapes and the dump rules are under test.

const DATE = '2023-10-10' // four days from the window start
const VERSION = '0.0.0-test'
const SHA = '0123456789abcdef0123456789abcdef01234567'

const EN_FR = { en: 'Synthetic', fr: 'Synthétique' }

function source(id: string, over: Partial<ApiSource> = {}): ApiSource {
  return {
    id,
    kind: 'official',
    title: 'Synthetic document',
    publisher: 'Example publisher',
    publisher_type: 'mfa',
    url: 'https://example.org/doc',
    wayback_url: null,
    archive_status: null,
    archive_url_alt: null,
    sha256: null,
    bytes: null,
    content_type: null,
    retrieved_at: null,
    language: 'en',
    date: '2023-10-08',
    text_file: null,
    excerpt: null,
    origin: null,
    notes: null,
    ...over,
  }
}

const SRC_A = 'src_20231008_example_first'
const SRC_B = 'src_20231009_example_second'

function event(over: Partial<ApiEvent> & Pick<ApiEvent, 'id' | 'country'>): ApiEvent {
  return {
    revision: 1,
    indicator: 'B9',
    indicator_name: EN_FR,
    category: 'B',
    type: 'repeatable',
    date: '2023-10-08',
    end: null,
    points: 5,
    points_rationale: null,
    confidence: 'confirmed',
    scope: ['gaza'],
    summary: { en: 'The synthetic ministry issued a statement.', fr: 'Le ministère a publié.' },
    actor: null,
    evidence: [
      {
        source: SRC_A,
        quote: 'Synthetic quote.',
        quote_lang: 'en',
        quote_en: null,
        quote_fr: null,
        locator: 'paragraph 1',
      },
    ],
    status: 'published',
    supersedes: null,
    related: [],
    generated: false,
    review: {
      drafted_by: 'test',
      drafted_at: '2023-10-09',
      second_read: null,
      reviewed_by: null,
      reviewed_at: null,
      notes: null,
    },
    scored: true,
    at_build: {
      reason: 'counted',
      factor: 1,
      weight: 1,
      value: 5,
      counted: 5,
      qualifies: true,
      by: null,
    },
    previous_points: null,
    corrections: [],
    replies: [],
    ...over,
  }
}

// XBB B9 with an actor, two evidence items from the same source and one from another, two scopes.
const E_XBB = event({
  id: 'evt_2023_10_09_XBB_B9',
  country: 'XBB',
  date: '2023-10-09',
  summary: {
    en: 'The synthetic ministry said "stop", then left.',
    fr: 'Le ministère synthétique a déclaré\nune chose.',
  },
  actor: { en: 'Foreign minister', fr: 'Ministre des Affaires étrangères', name: 'Synthetic Name' },
  scope: ['gaza', 'region'],
  evidence: [
    {
      source: SRC_B,
      quote: 'One.',
      quote_lang: 'en',
      quote_en: null,
      quote_fr: null,
      locator: 'p. 1',
    },
    {
      source: SRC_A,
      quote: 'Two.',
      quote_lang: 'en',
      quote_en: null,
      quote_fr: null,
      locator: 'p. 2',
    },
    {
      source: SRC_B,
      quote: 'Three.',
      quote_lang: 'en',
      quote_en: null,
      quote_fr: null,
      locator: 'p. 3',
    },
  ],
  related: ['evt_2023_10_08_XAA_A6', 'evt_2023_10_08_XAA_B1_synthetic-vote'],
  at_build: {
    reason: 'counted',
    factor: 1,
    weight: 1,
    value: 0.1 + 0.2,
    counted: 0.1 + 0.2,
    qualifies: true,
    by: null,
  },
})
// XAA A6 standing, ended at the build date.
const E_XAA_A6 = event({
  id: 'evt_2023_10_08_XAA_A6',
  country: 'XAA',
  indicator: 'A6',
  category: 'A',
  type: 'standing',
  end: '2023-10-10',
  points: 10,
  points_rationale: 'Synthetic rationale, with a comma.',
  at_build: {
    reason: 'ended',
    factor: 0,
    weight: 1,
    value: 0,
    counted: 0,
    qualifies: false,
    by: null,
  },
})
// XAA generated B1, negative points, same date as A6 (sorted by id after it).
const E_XAA_B1 = event({
  id: 'evt_2023_10_08_XAA_B1_synthetic-vote',
  country: 'XAA',
  indicator: 'B1',
  points: -5,
  generated: true,
  at_build: {
    reason: 'counted',
    factor: 1,
    weight: 1,
    value: -5,
    counted: -5,
    qualifies: false,
    by: null,
  },
})
// XAA retracted: not scored.
const E_XAA_RETRACTED = event({
  id: 'evt_2023_10_07_XAA_C5',
  country: 'XAA',
  indicator: 'C5',
  category: 'C',
  date: '2023-10-07',
  status: 'retracted',
  scored: false,
  supersedes: 'evt_2023_10_08_XAA_A6',
  at_build: {
    reason: 'not-published',
    factor: 1,
    weight: 1,
    value: 0,
    counted: 0,
    qualifies: false,
    by: null,
  },
})

const REGISTRY = {
  region: 'Synthetic region',
  subregion: 'Synthetic subregion',
  un_member: true,
  observer: false,
  memberships: {
    unsc: [],
    eu: false,
    nato: false,
    arab_league: false,
    oic: false,
    g20: false,
    g7: false,
    brics: false,
  },
  member_of: [],
  recognises_palestine_since: null,
}

const category = (raw: number, scored = true) => ({
  raw,
  clipped: raw,
  cap: { min: -10, max: 10 },
  capped: false,
  scored,
  weight: 1,
})

function scoredCountry(iso3: string, iso2: string, m49: number, score = -5): ApiCountryEntry {
  return {
    iso3,
    iso2,
    m49,
    name: EN_FR,
    ...REGISTRY,
    excluded: false,
    methodology: VERSION,
    date: DATE,
    score,
    score_display: Math.round(score),
    band: 'passive',
    band_name: EN_FR,
    passivity_applied: true,
    passivity: { applied: true, points: 15, value: 15, window_days: 365, qualifying: [] },
    categories: {
      A: category(10),
      B: category(0),
      C: category(0),
      D: category(0),
      E: category(0, false),
    },
    coverage: {
      ratio: 0,
      applicable: 1,
      has_events: 0,
      none_found: 0,
      no_data: 0,
      unchecked: 1,
      not_applicable: 0,
      missing: ['A1'],
      no_data_ids: [],
      unchecked_ids: ['A1'],
      not_applicable_ids: [],
      no_export_data: false,
      statuses: { A1: 'unchecked' },
    },
    events: {
      total: 3,
      confirmed: 2,
      corroborated: 1,
      reported: 0,
      disputed: 0,
      by_category: { A: 1, B: 2, C: 0, D: 0, E: 0 },
    },
    last_change: null,
    latest_event: null,
    summary: EN_FR,
    summary_scorecard: EN_FR,
  }
}

const EXCLUDED: ApiCountryEntry = {
  iso3: 'XEX',
  iso2: 'XE',
  m49: 903,
  name: EN_FR,
  ...REGISTRY,
  excluded: true,
  excluded_reason: EN_FR,
}

function row(indicator: string, over: Partial<ApiAssessmentRow> = {}): ApiAssessmentRow {
  return {
    indicator,
    category: indicator.slice(0, 1) as ApiAssessmentRow['category'],
    name: EN_FR,
    scored: true,
    status: 'none-found',
    hand_status: 'none-found',
    derived: null,
    override: null,
    checked_at: '2023-10-09',
    note: null,
    queries: [],
    ...over,
  }
}

const ASSESS_XAA: DumpAssessment = {
  country: 'XAA',
  protocol_version: 1,
  last_full_check: '2023-10-09',
  indicators: [
    row('A1', {
      status: 'no-data',
      hand_status: 'unchecked',
      derived: { status: 'no-data', reason: 'before-first-release' },
      override: { from: 'unchecked', to: 'no-data', reason: 'derived:before-first-release' },
      checked_at: null,
    }),
    row('B9', { note: 'Searched, "none" found.', queries: ['query one', 'query, two'] }),
    row('E1', { scored: false, status: 'unchecked', hand_status: 'unchecked', checked_at: null }),
  ],
}
const ASSESS_XBB: DumpAssessment = {
  country: 'XBB',
  protocol_version: null,
  last_full_check: null,
  indicators: [row('B9', { status: 'has-events', hand_status: 'has-events' })],
}

function correction(id: string, date: string): ApiCorrection {
  return {
    id,
    date,
    event: 'evt_2023_10_08_XAA_A6',
    country: 'XAA',
    kind: 'correction',
    flagged_by: 'author',
    flagged_ref: null,
    before: { points: 5 },
    after: { points: 10 },
    reason: 'Synthetic reason.',
    commit: null,
  }
}

function reply(id: string, publishedAt: string): ApiReply {
  return {
    id,
    country: 'XAA',
    received_at: '2023-10-08',
    published_at: publishedAt,
    from: { org: 'Synthetic embassy', role: 'Press office' },
    contests: ['evt_2023_10_08_XAA_A6'],
    text: { original: 'Synthetic text.', lang: 'en', en: 'Synthetic text.', fr: 'Texte.' },
    response: EN_FR,
    outcome: 'none',
    notes: null,
  }
}

function day(exact: number, band: string, passivity: boolean, A: number, B = 0): DayScore {
  return {
    exact,
    score: roundHalfAwayFromZero(exact, 1),
    display: roundHalfAwayFromZero(exact, 0),
    band,
    passivity,
    clipped: { A, B, C: 0, D: 0, E: 0 },
  }
}

// Four days, 2023-10-07 … 2023-10-10, for two countries.
const DAYS_XAA = [
  day(-15, 'passive', true, 0),
  day(-5, 'passive', true, 10),
  day(-5, 'passive', true, 10),
  day(-20, 'passive', true, 0, -5),
]
const DAYS_XBB = [
  day(-15, 'passive', true, 0),
  day(-15, 'passive', true, 0),
  day(0.1 + 0.2, 'passive', false, 0, 0.1 + 0.2),
  day(0.1 + 0.2, 'passive', false, 0, 0.1 + 0.2),
]

const LEAD_EXTRA = {
  id: 'lead_20231008_XAA_2',
  country: 'XAA',
  indicator: 'A5',
  claim: 'A field the dump does not publish.',
}

/** The input in a scrambled order: the dump sorts everything itself. */
/** Synthetic registry entries (X-prefixed codes): a permanent member, a dated one, an excluded one. */
function registryEntry(iso3: string, over: Partial<Country> = {}): Country {
  return {
    iso3,
    iso2: iso3.slice(0, 2),
    m49: 900,
    name: { en: `Country ${iso3}`, fr: `Pays ${iso3}`, fr_def: `le Pays ${iso3}` },
    region: 'Europe',
    subregion: 'Western Europe',
    un_member: true,
    observer: false,
    excluded: false,
    memberships: {
      unsc: [],
      eu: false,
      nato: false,
      arab_league: false,
      oic: false,
      g20: false,
      g7: false,
      brics: false,
    },
    recognises_palestine: { since: null },
    gov_sources: [],
    ...over,
  }
}
const REGISTRY_ENTRIES: Country[] = [
  registryEntry('XBB', {
    memberships: {
      unsc: [
        { from: '2023-01-01', to: '2023-12-31', permanent: false },
        { from: '2027-01-01', to: '2028-12-31', permanent: false },
      ],
      eu: true,
      nato: { since: '2023-10-09', note: 'Joined in the window.' },
      arab_league: false,
      oic: { since: null, note: 'Invited, not a member.' },
      g20: false,
      g7: false,
      brics: { since: '2023-01-01', until: '2023-10-08' },
    },
    recognises_palestine: { since: '2024-05-28', note: 'Synthetic.' },
    notes: 'Not published.',
  }),
  registryEntry('XAA', {
    memberships: {
      unsc: [{ from: '1945-10-24', to: null, permanent: true }],
      eu: false,
      nato: false,
      arab_league: true,
      oic: true,
      g20: true,
      g7: false,
      brics: false,
    },
    recognises_palestine: { since: '1988-11-15' },
  }),
  registryEntry('XZZ', {
    excluded: true,
    name: { en: 'Excluded, one', fr: 'Exclu', fr_def: "l'Exclu" },
  }),
]

function input(over: Partial<DumpInput> = {}): DumpInput {
  return {
    date: DATE,
    methodology: VERSION,
    git: { sha: SHA, dirty: false },
    countries: [EXCLUDED, scoredCountry('XBB', 'XB', 902, 12.5), scoredCountry('XAA', 'XA', 901)],
    registry: REGISTRY_ENTRIES,
    events: [E_XBB, E_XAA_B1, E_XAA_RETRACTED, E_XAA_A6],
    sources: [
      source(SRC_B),
      source(SRC_A, {
        wayback_url: 'https://web.archive.org/web/20231009000000/https://example.org/doc',
        archive_status: 'archived',
        sha256: 'a'.repeat(64),
        bytes: 1234,
        content_type: 'text/html',
        retrieved_at: '2023-10-09T00:00:00Z',
        text_file: `archive/text/${SRC_A}.txt`,
        excerpt: 'row 1, "quoted"',
        notes: 'Line one\nline two',
      }),
    ],
    assessments: [ASSESS_XBB, ASSESS_XAA],
    corrections: [
      correction('cor_20231009_2', '2023-10-09'),
      correction('cor_20231009_1', '2023-10-09'),
      correction('cor_20231008_1', '2023-10-08'),
    ],
    replies: [reply('rep_20231009_XAA_1', '2023-10-10'), reply('rep_20231008_XAA_1', '2023-10-09')],
    leads: [
      { id: 'lead_20231009_XBB_1', country: 'XBB', indicator: 'B10' },
      LEAD_EXTRA as DumpLead,
      { id: 'lead_20231008_XAA_1', country: 'XAA', indicator: 'A2' },
    ],
    days: [
      { iso3: 'XBB', days: DAYS_XBB },
      { iso3: 'XAA', days: DAYS_XAA },
    ],
    windowStart: WINDOW_START,
    ...over,
  }
}

const files = dumpFiles(input())
const text = (path: string): string => {
  const t = files.get(path)
  if (t === undefined) throw new Error(`${path} missing`)
  return t
}
const records = (path: string): string[][] => parse(text(path), { relax_column_count: false })

describe('dumpFiles: paths and CSV conventions', () => {
  it('produces the eight files, in order', () => {
    expect([...files.keys()]).toEqual([
      'dumps/events.csv',
      'dumps/sources.csv',
      'dumps/assessments.csv',
      'dumps/countries.csv',
      'dumps/countries.scorecard.csv',
      'dumps/registry.csv',
      'dumps/scores-daily-2023.csv',
      'dumps/gai-2023-10-10.json',
    ])
  })

  it('writes the headers exactly as specified', () => {
    expect(text('dumps/events.csv').split('\n')[0]).toBe(
      'id,revision,country,indicator,category,type,date,end,points,points_rationale,confidence,' +
        'scope,status,generated,scored,summary_en,summary_fr,actor_en,actor_fr,actor_name,' +
        'sources,supersedes,related,at_build_reason,at_build_value,at_build_counted',
    )
    expect(text('dumps/sources.csv').split('\n')[0]).toBe(
      'id,kind,title,publisher,publisher_type,url,wayback_url,archive_status,archive_url_alt,' +
        'sha256,bytes,content_type,retrieved_at,language,date,text_file,excerpt,origin,notes',
    )
    expect(text('dumps/assessments.csv').split('\n')[0]).toBe(
      'country,indicator,category,scored,status,hand_status,derived_status,derived_reason,' +
        'checked_at,note,queries',
    )
    expect(text('dumps/scores-daily-2023.csv').split('\n')[0]).toBe(
      'date,iso3,score,score_display,band,passivity_applied,A,B,C,D,E',
    )
    expect(text('dumps/countries.csv').split('\n')[0]).toBe(
      'iso3,name_en,name_fr,region,excluded,score,score_display,band,passivity_applied,' +
        'passivity_value,A,B,C,D,E,coverage,has_events,none_found,no_data,unchecked,' +
        'not_applicable,events,last_change',
    )
    expect(text('dumps/countries.scorecard.csv').split('\n')[0]).toBe(
      'iso3,name_en,name_fr,region,excluded,coverage,has_events,none_found,no_data,unchecked,' +
        'not_applicable,events,events_confirmed,events_corroborated,events_reported,' +
        'events_disputed,events_A,events_B,events_C,events_D,events_E,latest_event',
    )
    expect(EVENTS_CSV_COLUMNS).toHaveLength(26)
    expect(ASSESSMENTS_CSV_COLUMNS).toHaveLength(11)
    expect(SCORES_DAILY_CSV_COLUMNS).toHaveLength(11)
  })

  it('lists every ApiSource field in api.ts order', async () => {
    const { ApiSource } = await import('@gai/schema')
    expect([...SOURCES_CSV_COLUMNS]).toEqual(Object.keys(ApiSource.shape))
  })

  it('uses LF only and ends every file with one LF', () => {
    for (const [path, t] of files) {
      expect(t, path).not.toContain('\r')
      expect(t.endsWith('\n'), path).toBe(true)
      expect(t.endsWith('\n\n'), path).toBe(false)
    }
  })

  it('every CSV row has one field per column', () => {
    const cases: [string, readonly string[]][] = [
      ['dumps/events.csv', EVENTS_CSV_COLUMNS],
      ['dumps/sources.csv', SOURCES_CSV_COLUMNS],
      ['dumps/assessments.csv', ASSESSMENTS_CSV_COLUMNS],
      ['dumps/countries.csv', COUNTRIES_CSV_COLUMNS],
      ['dumps/countries.scorecard.csv', COUNTRIES_SCORECARD_CSV_COLUMNS],
      ['dumps/registry.csv', REGISTRY_CSV_COLUMNS],
      ['dumps/scores-daily-2023.csv', SCORES_DAILY_CSV_COLUMNS],
    ]
    for (const [path, columns] of cases) {
      const [header, ...rows] = records(path)
      expect(header).toEqual([...columns])
      for (const r of rows) expect(r).toHaveLength(columns.length)
    }
  })
})

describe('dumps/countries.csv and countries.scorecard.csv', () => {
  it('orders scored countries by score, highest first, excluded entities last', () => {
    const [, ...rows] = records('dumps/countries.csv')
    expect(rows.map((r) => r[0])).toEqual(['XBB', 'XAA', 'XEX'])
    const col = (name: (typeof COUNTRIES_CSV_COLUMNS)[number]) =>
      COUNTRIES_CSV_COLUMNS.indexOf(name)
    expect(rows[0]?.[col('score')]).toBe('12.5')
    expect(rows[0]?.[col('passivity_value')]).toBe('15')
    expect(rows[0]?.[col('A')]).toBe('10')
    expect(rows[0]?.[col('last_change')]).toBe('')
    // Excluded entities: registry fields only, every score field empty.
    expect(rows[2]?.slice(col('score'))).toEqual(
      COUNTRIES_CSV_COLUMNS.slice(col('score')).map(() => ''),
    )
    expect(rows[2]?.[col('excluded')]).toBe('true')
  })

  it('leaves out everything derived from the score in the scorecard table (D-16)', () => {
    for (const c of ['score', 'score_display', 'band', 'passivity_applied', 'A', 'last_change'])
      expect(COUNTRIES_SCORECARD_CSV_COLUMNS as readonly string[]).not.toContain(c)
    const [, ...rows] = records('dumps/countries.scorecard.csv')
    expect(rows.map((r) => r[0])).toEqual(['XAA', 'XBB', 'XEX'])
    const col = (name: (typeof COUNTRIES_SCORECARD_CSV_COLUMNS)[number]) =>
      COUNTRIES_SCORECARD_CSV_COLUMNS.indexOf(name)
    expect(rows[0]?.slice(col('events'), col('events_E') + 1)).toEqual([
      '3',
      '2',
      '1',
      '0',
      '0',
      '1',
      '2',
      '0',
      '0',
      '0',
    ])
  })
})

describe('dumps/events.csv', () => {
  const [, ...rows] = records('dumps/events.csv')
  const col = (r: string[] | undefined, c: (typeof EVENTS_CSV_COLUMNS)[number]) =>
    r?.[EVENTS_CSV_COLUMNS.indexOf(c)]

  it('orders events by country, date, id', () => {
    expect(rows.map((r) => r[0])).toEqual([
      'evt_2023_10_07_XAA_C5',
      'evt_2023_10_08_XAA_A6',
      'evt_2023_10_08_XAA_B1_synthetic-vote',
      'evt_2023_10_09_XBB_B9',
    ])
  })

  it('writes the XAA A6 row field by field: null as empty, booleans as true/false', () => {
    const lines = text('dumps/events.csv').split('\n')
    expect(lines[2]).toBe(
      [
        'evt_2023_10_08_XAA_A6',
        '1',
        'XAA',
        'A6',
        'A',
        'standing',
        '2023-10-08',
        '2023-10-10',
        '10',
        '"Synthetic rationale, with a comma."',
        'confirmed',
        'gaza',
        'published',
        'false',
        'true',
        'The synthetic ministry issued a statement.',
        'Le ministère a publié.',
        '',
        '',
        '',
        SRC_A,
        '',
        '',
        'ended',
        '0',
        '0',
      ].join(','),
    )
  })

  it('quotes commas, quotes and line breaks in summaries, and joins lists with ;', () => {
    const t = text('dumps/events.csv')
    expect(t).toContain(',"The synthetic ministry said ""stop"", then left.",')
    expect(t).toContain(',"Le ministère synthétique a déclaré\nune chose.",')
    const xbb = rows[3]
    expect(col(xbb, 'summary_en')).toBe('The synthetic ministry said "stop", then left.')
    expect(col(xbb, 'summary_fr')).toBe('Le ministère synthétique a déclaré\nune chose.')
    expect(col(xbb, 'scope')).toBe('gaza;region')
    // Evidence sources without repeats, in evidence order.
    expect(col(xbb, 'sources')).toBe(`${SRC_B};${SRC_A}`)
    expect(col(xbb, 'related')).toBe('evt_2023_10_08_XAA_A6;evt_2023_10_08_XAA_B1_synthetic-vote')
    expect(col(xbb, 'actor_en')).toBe('Foreign minister')
    expect(col(xbb, 'actor_fr')).toBe('Ministre des Affaires étrangères')
    expect(col(xbb, 'actor_name')).toBe('Synthetic Name')
  })

  it('writes numbers in full precision, negative with an ASCII hyphen-minus', () => {
    const xbb = rows[3]
    expect(col(xbb, 'at_build_value')).toBe('0.30000000000000004')
    expect(col(xbb, 'at_build_counted')).toBe('0.30000000000000004')
    const b1 = rows[2]
    expect(col(b1, 'points')).toBe('-5')
    expect(col(b1, 'generated')).toBe('true')
    const retracted = rows[0]
    expect(col(retracted, 'status')).toBe('retracted')
    expect(col(retracted, 'scored')).toBe('false')
    expect(col(retracted, 'supersedes')).toBe('evt_2023_10_08_XAA_A6')
    expect(col(retracted, 'at_build_reason')).toBe('not-published')
  })
})

describe('dumps/sources.csv', () => {
  it('orders sources by id and writes every field, empty for null', () => {
    const lines = text('dumps/sources.csv').split('\n')
    expect(lines[1]).toBe(
      [
        SRC_A,
        'official',
        'Synthetic document',
        'Example publisher',
        'mfa',
        'https://example.org/doc',
        'https://web.archive.org/web/20231009000000/https://example.org/doc',
        'archived',
        '',
        'a'.repeat(64),
        '1234',
        'text/html',
        '2023-10-09T00:00:00Z',
        'en',
        '2023-10-08',
        `archive/text/${SRC_A}.txt`,
        '"row 1, ""quoted"""',
        '',
        '"Line one',
      ].join(','),
    )
    expect(lines[2]).toBe('line two"')
    const [, ...rows] = records('dumps/sources.csv')
    expect(rows.map((r) => r[0])).toEqual([SRC_A, SRC_B])
    expect(rows[1]).toEqual([
      SRC_B,
      'official',
      'Synthetic document',
      'Example publisher',
      'mfa',
      'https://example.org/doc',
      ...Array(6).fill(''),
      '',
      'en',
      '2023-10-08',
      '',
      '',
      '',
      '',
    ])
  })
})

describe('dumps/assessments.csv', () => {
  it('writes one row per country and indicator, countries by ISO3, rows in given order', () => {
    expect(text('dumps/assessments.csv')).toBe(
      [
        'country,indicator,category,scored,status,hand_status,derived_status,derived_reason,checked_at,note,queries',
        'XAA,A1,A,true,no-data,unchecked,no-data,before-first-release,,,',
        'XAA,B9,B,true,none-found,none-found,,,2023-10-09,"Searched, ""none"" found.","query one | query, two"',
        'XAA,E1,E,false,unchecked,unchecked,,,,,',
        'XBB,B9,B,true,has-events,has-events,,,2023-10-09,,',
        '',
      ].join('\n'),
    )
  })
})

describe('dumps/scores-daily-{YYYY}.csv', () => {
  it('writes one row per date and country, by date then ISO3, full precision', () => {
    expect(text('dumps/scores-daily-2023.csv')).toBe(
      [
        'date,iso3,score,score_display,band,passivity_applied,A,B,C,D,E',
        '2023-10-07,XAA,-15,-15,passive,true,0,0,0,0,0',
        '2023-10-07,XBB,-15,-15,passive,true,0,0,0,0,0',
        '2023-10-08,XAA,-5,-5,passive,true,10,0,0,0,0',
        '2023-10-08,XBB,-15,-15,passive,true,0,0,0,0,0',
        '2023-10-09,XAA,-5,-5,passive,true,10,0,0,0,0',
        '2023-10-09,XBB,0.3,0,passive,false,0,0.30000000000000004,0,0,0',
        '2023-10-10,XAA,-20,-20,passive,true,0,-5,0,0,0',
        '2023-10-10,XBB,0.3,0,passive,false,0,0.30000000000000004,0,0,0',
        '',
      ].join('\n'),
    )
  })

  it('writes one file per calendar year', () => {
    // Synthetic window from 2023-12-30 to 2024-01-02: two days in each year.
    const four = DAYS_XAA
    const files = dumpFiles(
      input({ windowStart: '2023-12-30', date: '2024-01-02', days: [{ iso3: 'XAA', days: four }] }),
    )
    expect([...files.keys()].filter((p) => p.startsWith('dumps/scores-daily'))).toEqual([
      'dumps/scores-daily-2023.csv',
      'dumps/scores-daily-2024.csv',
    ])
    expect(files.get('dumps/scores-daily-2023.csv')?.split('\n').slice(1, 3)).toEqual([
      '2023-12-30,XAA,-15,-15,passive,true,0,0,0,0,0',
      '2023-12-31,XAA,-5,-5,passive,true,10,0,0,0,0',
    ])
    expect(files.get('dumps/scores-daily-2024.csv')?.split('\n').slice(1, 3)).toEqual([
      '2024-01-01,XAA,-5,-5,passive,true,10,0,0,0,0',
      '2024-01-02,XAA,-20,-20,passive,true,0,-5,0,0,0',
    ])
  })

  it('refuses days that do not run from the window start to the build date', () => {
    expect(() => dumpFiles(input({ days: [{ iso3: 'XAA', days: DAYS_XAA.slice(0, 3) }] }))).toThrow(
      'scores-daily: XAA has 3 days; 2023-10-07 to 2023-10-10 is 4',
    )
    expect(() => dumpFiles(input({ date: '2023-10-11' }))).toThrow(/has 4 days/)
  })

  it('refuses a country listed twice', () => {
    expect(() =>
      dumpFiles(
        input({
          days: [
            { iso3: 'XAA', days: DAYS_XAA },
            { iso3: 'XAA', days: DAYS_XAA },
          ],
        }),
      ),
    ).toThrow('scores-daily: XAA is listed twice')
  })
})

describe('dumps/gai-{date}.json', () => {
  const json = text('dumps/gai-2023-10-10.json')
  const dump = ApiDumpFile.parse(JSON.parse(json))

  it('parses with ApiDumpFile and is canonical JSON', () => {
    expect(apiSchemaFor('dumps/gai-2023-10-10.json')).toBe(ApiDumpFile)
    expect(jsonText(JSON.parse(json))).toBe(json)
    expect(dump.build_date).toBe(DATE)
    expect(dump.methodology).toBe(VERSION)
    expect(dump.git).toEqual({ sha: SHA, dirty: false })
  })

  it('sorts every list', () => {
    expect(dump.countries.map((c) => c.iso3)).toEqual(['XAA', 'XBB', 'XEX'])
    expect(dump.events.map((e) => e.id)).toEqual([
      'evt_2023_10_07_XAA_C5',
      'evt_2023_10_08_XAA_A6',
      'evt_2023_10_08_XAA_B1_synthetic-vote',
      'evt_2023_10_09_XBB_B9',
    ])
    expect(dump.sources.map((s) => s.id)).toEqual([SRC_A, SRC_B])
    expect(dump.assessments.map((a) => a.country)).toEqual(['XAA', 'XBB'])
    expect(dump.assessments[0]?.indicators.map((r) => r.indicator)).toEqual(['A1', 'B9', 'E1'])
    expect(dump.corrections.map((c) => c.id)).toEqual([
      'cor_20231008_1',
      'cor_20231009_1',
      'cor_20231009_2',
    ])
    expect(dump.replies.map((r) => r.id)).toEqual(['rep_20231008_XAA_1', 'rep_20231009_XAA_1'])
    expect(dump.leads).toEqual([
      { id: 'lead_20231008_XAA_1', country: 'XAA', indicator: 'A2' },
      { id: 'lead_20231008_XAA_2', country: 'XAA', indicator: 'A5' },
      { id: 'lead_20231009_XBB_1', country: 'XBB', indicator: 'B10' },
    ])
  })

  it('keeps the records as given (events, sources, assessments)', () => {
    expect(dump.events[3]).toEqual(E_XBB)
    expect(dump.assessments[1]).toEqual(ASSESS_XBB)
    expect(dump.sources[1]).toEqual(source(SRC_B))
  })

  it('writes null git fields outside a checkout', () => {
    const out = dumpFiles(input({ git: { sha: null, dirty: null } }))
    const d = ApiDumpFile.parse(JSON.parse(out.get('dumps/gai-2023-10-10.json') ?? ''))
    expect(d.git).toEqual({ sha: null, dirty: null })
  })
})

describe('dumpFiles: registry.csv', () => {
  it('writes the header exactly as specified', () => {
    expect(text('dumps/registry.csv').split('\n')[0]).toBe(
      'iso3,iso2,m49,name_en,name_fr,name_fr_def,region,subregion,un_member,observer,excluded,' +
        'unsc,unsc_permanent,eu,nato,arab_league,oic,g20,g7,brics,member_of,' +
        'recognises_palestine_since',
    )
  })

  it('writes one row per entry by ISO3, memberships as flags or intervals, held ones at the build date', () => {
    expect(text('dumps/registry.csv').split('\n').slice(1)).toEqual([
      'XAA,XA,900,Country XAA,Pays XAA,le Pays XAA,Europe,Western Europe,true,false,false,' +
        '1945-10-24/..,true,false,false,true,true,true,false,false,unsc;arab_league;oic;g20,1988-11-15',
      // Build date 2023-10-10: the 2023 term is held, NATO since 2023-10-09 is held, BRICS
      // ended on 2023-10-08, the OIC invitation (since null) is not a membership.
      'XBB,XB,900,Country XBB,Pays XBB,le Pays XBB,Europe,Western Europe,true,false,false,' +
        '2023-01-01/2023-12-31;2027-01-01/2028-12-31,false,true,2023-10-09/..,false,false,false,' +
        'false,2023-01-01/2023-10-08,unsc;eu;nato,2024-05-28',
      'XZZ,XZ,900,"Excluded, one",Exclu,l\'Exclu,Europe,Western Europe,true,false,true,,false,' +
        'false,false,false,false,false,false,false,,',
      '',
    ])
  })

  it('publishes neither notes nor gov_sources', () => {
    expect(text('dumps/registry.csv')).not.toContain('Not published')
    expect(text('dumps/registry.csv')).not.toContain('Synthetic.')
  })
})

describe('dumpFiles: determinism and edge cases', () => {
  it('gives the same bytes whatever the input order', () => {
    const reversed = dumpFiles(
      input({
        countries: [...input().countries].reverse(),
        events: [...input().events].reverse(),
        sources: [...input().sources].reverse(),
        assessments: [...input().assessments].reverse(),
        corrections: [...input().corrections].reverse(),
        replies: [...input().replies].reverse(),
        leads: [...input().leads].reverse(),
        registry: [...REGISTRY_ENTRIES].reverse(),
        days: [...input().days].reverse(),
      }),
    )
    expect([...reversed.entries()]).toEqual([...files.entries()])
  })

  it('does not change the caller’s arrays', () => {
    const i = input()
    const before = i.events.map((e) => e.id)
    dumpFiles(i)
    expect(i.events.map((e) => e.id)).toEqual(before)
  })

  it('writes header-only CSVs and a valid dump for an empty dataset', () => {
    const empty = dumpFiles(
      input({
        countries: [],
        events: [],
        sources: [],
        assessments: [],
        corrections: [],
        replies: [],
        leads: [],
        registry: [],
        days: [],
      }),
    )
    expect(empty.get('dumps/registry.csv')).toBe(`${REGISTRY_CSV_COLUMNS.join(',')}\n`)
    expect(empty.get('dumps/events.csv')).toBe(`${EVENTS_CSV_COLUMNS.join(',')}\n`)
    expect(empty.get('dumps/sources.csv')).toBe(`${SOURCES_CSV_COLUMNS.join(',')}\n`)
    expect(empty.get('dumps/assessments.csv')).toBe(`${ASSESSMENTS_CSV_COLUMNS.join(',')}\n`)
    expect(empty.get('dumps/countries.csv')).toBe(`${COUNTRIES_CSV_COLUMNS.join(',')}\n`)
    expect(empty.get('dumps/scores-daily-2023.csv')).toBe(`${SCORES_DAILY_CSV_COLUMNS.join(',')}\n`)
    const d = ApiDumpFile.parse(JSON.parse(empty.get('dumps/gai-2023-10-10.json') ?? ''))
    expect(d).toMatchObject({ countries: [], events: [], sources: [], leads: [] })
  })
})
