/**
 * Focused zod cases for the record schemas (records.ts, docs/03 §3–§10) that the loader tests
 * do not reach: refinements, unions, nullable fields and the correction field list. Each case
 * starts from a valid fixture record and changes one thing.
 */
import { describe, expect, it } from 'vitest'
import type { z } from 'zod'
import {
  ArchiveIndexRow,
  Assessment,
  Correction,
  Country,
  EVENT_FIELD_KEYS,
  Event,
  EventIdLike,
  Lead,
  LeadSource,
  Membership,
  Reply,
  Source,
  SourceId,
  StructuredTablePath,
} from './records.js'
import { fixtureDataset } from './testing/harness.js'

type Obj = Record<string, unknown>

function fixtures() {
  const ds = fixtureDataset()
  const pick = <T>(v: T | undefined, label: string): Obj => {
    if (v === undefined) throw new Error(`fixture ${label} missing`)
    return structuredClone(v) as Obj
  }
  return {
    country: pick(ds.countries[0]?.value, 'country'),
    event: pick(ds.events[0]?.value, 'event'),
    source: pick(ds.sources[0]?.value, 'source'),
    assessment: pick(ds.assessments[0]?.value, 'assessment'),
    correction: pick(ds.corrections[0]?.value, 'correction'),
    reply: pick(ds.replies[0]?.value, 'reply'),
  }
}

/** The dotted paths of the problems, or [] when the value passes. */
function problems(schema: z.ZodType, value: unknown): string[] {
  const r = schema.safeParse(value)
  return r.success ? [] : r.error.issues.map((i) => i.path.join('.'))
}

const LEAD: Obj = {
  id: 'lead_20260901_DEU_1',
  country: 'DEU',
  indicator: 'A3',
  claim: 'Test lead.',
  sources: [{ url: 'https://example.org/test-lead', publisher: 'Example', kind: 'press' }],
  date: '2026-09-01',
  status: 'open',
}

describe('the fixture records pass their schemas', () => {
  it.each([
    ['country', Country],
    ['event', Event],
    ['source', Source],
    ['assessment', Assessment],
    ['correction', Correction],
    ['reply', Reply],
  ] as const)('%s', (name, schema) => {
    expect(problems(schema, fixtures()[name])).toEqual([])
  })

  it('lead', () => {
    expect(problems(Lead, LEAD)).toEqual([])
  })
})

describe('Event', () => {
  it('scope entries are unique', () => {
    const { event } = fixtures()
    expect(problems(Event, { ...event, scope: ['gaza', 'west-bank'] })).toEqual([])
    expect(problems(Event, { ...event, scope: ['gaza', 'gaza'] })).toEqual(['scope'])
    expect(problems(Event, { ...event, scope: [] })).toEqual(['scope'])
    expect(problems(Event, { ...event, scope: ['westbank'] })).toEqual(['scope.0'])
  })

  it('end is optional and nullable (null = still holds)', () => {
    const { event } = fixtures()
    const { end: _end, ...noEnd } = event
    expect(problems(Event, noEnd)).toEqual([])
    expect(problems(Event, { ...event, end: null })).toEqual([])
    expect(problems(Event, { ...event, end: '2025-11-24' })).toEqual([])
    expect(problems(Event, { ...event, end: '2025-02-30' })).toEqual(['end'])
    expect(problems(Event, { ...event, end: '' })).toEqual(['end'])
  })

  it('evidence has at least one entry', () => {
    const { event } = fixtures()
    expect(problems(Event, { ...event, evidence: [] })).toEqual(['evidence'])
  })

  it('evidence entries are strict and need a quote and a locator', () => {
    const { event } = fixtures()
    const ev = (event.evidence as Obj[])[0] as Obj
    expect(problems(Event, { ...event, evidence: [{ ...ev, quote: '  ' }] })).toEqual([
      'evidence.0.quote',
    ])
    const { locator: _l, ...noLocator } = ev
    expect(problems(Event, { ...event, evidence: [noLocator] })).toEqual(['evidence.0.locator'])
    expect(problems(Event, { ...event, evidence: [{ ...ev, page: 3 }] })).toEqual(['evidence.0'])
    expect(problems(Event, { ...event, evidence: [{ ...ev, source: 'src_x' }] })).toEqual([
      'evidence.0.source',
    ])
  })

  it('points are finite numbers', () => {
    const { event } = fixtures()
    expect(problems(Event, { ...event, points: -2.5 })).toEqual([])
    expect(problems(Event, { ...event, points: Number.POSITIVE_INFINITY })).toEqual(['points'])
    expect(problems(Event, { ...event, points: '10' })).toEqual(['points'])
  })

  it('ids: hand-authored and generated ids pass the shape; others do not', () => {
    const { event } = fixtures()
    expect(problems(Event, { ...event, id: 'evt_2023_10_27_DEU_A6_es-10-21' })).toEqual([])
    expect(problems(Event, { ...event, id: 'evt_2025_08_08_DEU_A6_1' })).toEqual(['id'])
    expect(problems(Event, { ...event, supersedes: 'evt_x' })).toEqual(['supersedes'])
    expect(problems(Event, { ...event, related: ['evt_2025_08_08_DEU_A6_2'] })).toEqual([])
    expect(problems(Event, { ...event, related: ['nope'] })).toEqual(['related.0'])
  })

  it('revision is a positive integer and summary needs both languages', () => {
    const { event } = fixtures()
    expect(problems(Event, { ...event, revision: 0 })).toEqual(['revision'])
    expect(problems(Event, { ...event, revision: 1.5 })).toEqual(['revision'])
    expect(problems(Event, { ...event, summary: { en: 'x' } })).toEqual(['summary.fr'])
  })

  it('review: second_read may be null; the verdict is agree or disagree', () => {
    const { event } = fixtures()
    const review = event.review as Obj
    expect(problems(Event, { ...event, review: { ...review, second_read: null } })).toEqual([])
    const sr = { by: 'x', at: '2026-09-27', verdict: 'maybe' }
    expect(problems(Event, { ...event, review: { ...review, second_read: sr } })).toEqual([
      'review.second_read.verdict',
    ])
  })

  it('unknown keys are rejected', () => {
    const { event } = fixtures()
    expect(problems(Event, { ...event, point: 10 })).toEqual([''])
  })
})

describe('Source', () => {
  it('url is an http(s) URL or a path to a structured table', () => {
    const { source } = fixtures()
    expect(problems(Source, { ...source, url: 'data/structured/x.csv' })).toEqual([])
    expect(problems(Source, { ...source, url: 'data/structured/unga_votes.csv' })).toEqual([])
    expect(problems(Source, { ...source, url: 'http://example.org/a' })).toEqual([])
    expect(problems(Source, { ...source, url: 'data/structured/x.txt' })).toEqual(['url'])
    expect(problems(Source, { ...source, url: 'data/structured/raw/x.csv' })).toEqual(['url'])
    expect(problems(Source, { ...source, url: 'ftp://example.org/a' })).toEqual(['url'])
    expect(StructuredTablePath.safeParse('data/structured/Votes.csv').success).toBe(false)
  })

  it('archive fields are nullable (a page that could not be archived)', () => {
    const { source } = fixtures()
    const unarchived = {
      ...source,
      wayback_url: null,
      archive_status: 'failed',
      archive_url_alt: null,
      sha256: null,
      bytes: null,
      content_type: null,
      retrieved_at: null,
      text_file: null,
    }
    expect(problems(Source, unarchived)).toEqual([])
    expect(problems(Source, { ...source, archive_status: 'pending' })).toEqual(['archive_status'])
  })

  it('sha256 is 64 lowercase hex characters; bytes a non-negative integer', () => {
    const { source } = fixtures()
    const sha = source.sha256 as string
    expect(problems(Source, { ...source, sha256: sha.toUpperCase() })).toEqual(['sha256'])
    expect(problems(Source, { ...source, sha256: sha.slice(1) })).toEqual(['sha256'])
    expect(problems(Source, { ...source, bytes: -1 })).toEqual(['bytes'])
    expect(problems(Source, { ...source, bytes: 1.5 })).toEqual(['bytes'])
  })

  it('retrieved_at is a UTC timestamp; date a calendar date', () => {
    const { source } = fixtures()
    expect(problems(Source, { ...source, retrieved_at: '2026-09-26' })).toEqual(['retrieved_at'])
    expect(problems(Source, { ...source, date: '2025-8-8' })).toEqual(['date'])
  })

  it('origin must be a source id', () => {
    const { source } = fixtures()
    expect(problems(Source, { ...source, origin: 'src_20240311_sipri_at_2023' })).toEqual([])
    expect(problems(Source, { ...source, origin: 'sipri' })).toEqual(['origin'])
  })

  it('SourceId needs at least two slug segments', () => {
    expect(SourceId.safeParse('src_20240311_sipri_at_2023').success).toBe(true)
    expect(SourceId.safeParse('src_20240311_sipri').success).toBe(false)
  })
})

describe('Country and Membership', () => {
  it('a membership is a flag or a dated period', () => {
    expect(problems(Membership, true)).toEqual([])
    expect(problems(Membership, false)).toEqual([])
    expect(problems(Membership, { since: '2024-01-01' })).toEqual([])
    expect(problems(Membership, { since: null, until: '2025-01-01', note: 'left' })).toEqual([])
    expect(problems(Membership, { since: '2024-01-01', until: null })).toEqual([])
    expect(problems(Membership, {})).not.toEqual([])
    expect(problems(Membership, { since: '2024-01-01', extra: 1 })).not.toEqual([])
    expect(problems(Membership, 'yes')).not.toEqual([])
    expect(problems(Membership, null)).not.toEqual([])
  })

  it('a dated membership passes inside a country', () => {
    const { country } = fixtures()
    const memberships = { ...(country.memberships as Obj), brics: { since: '2024-01-01' } }
    expect(problems(Country, { ...country, memberships })).toEqual([])
  })

  it('Security Council terms, codes and m49', () => {
    const { country } = fixtures()
    const memberships = country.memberships as Obj
    const term = { from: '2019-01-01', to: '2020-12-31', permanent: false }
    expect(
      problems(Country, { ...country, memberships: { ...memberships, unsc: [term] } }),
    ).toEqual([])
    const open = { from: '1945-10-24', to: null, permanent: true }
    expect(
      problems(Country, { ...country, memberships: { ...memberships, unsc: [open] } }),
    ).toEqual([])
    expect(problems(Country, { ...country, iso3: 'deu' })).toEqual(['iso3'])
    expect(problems(Country, { ...country, iso2: 'DEU' })).toEqual(['iso2'])
    expect(problems(Country, { ...country, m49: 0 })).toEqual(['m49'])
    expect(problems(Country, { ...country, m49: 1000 })).toEqual(['m49'])
    const { g7: _g7, ...noG7 } = memberships
    expect(problems(Country, { ...country, memberships: noG7 })).toEqual(['memberships.g7'])
  })
})

describe('Correction', () => {
  it('before/after accept every event field key', () => {
    const { correction } = fixtures()
    for (const key of EVENT_FIELD_KEYS) {
      expect(problems(Correction, { ...correction, before: { [key]: null } }), key).toEqual([])
    }
  })

  it('before/after reject keys that are not event fields', () => {
    const { correction } = fixtures()
    for (const key of ['foo', 'id', 'revision', 'review', 'country', 'generated']) {
      expect(problems(Correction, { ...correction, before: { [key]: 1 } }), key).toEqual(['before'])
      expect(problems(Correction, { ...correction, after: { [key]: 1 } }), key).toEqual(['after'])
    }
  })

  it('a retraction may have empty before/after', () => {
    const { correction } = fixtures()
    expect(problems(Correction, { ...correction, kind: 'retraction', after: {} })).toEqual([])
  })

  it('kind, flagged_by and the event id are checked', () => {
    const { correction } = fixtures()
    expect(problems(Correction, { ...correction, kind: 'erratum' })).toEqual(['kind'])
    expect(problems(Correction, { ...correction, flagged_by: 'press' })).toEqual(['flagged_by'])
    expect(problems(Correction, { ...correction, event: 'evt_x' })).toEqual(['event'])
    expect(problems(Correction, { ...correction, id: 'cor_20260927_0' })).toEqual(['id'])
    expect(problems(Correction, { ...correction, reason: '' })).toEqual(['reason'])
  })
})

describe('Reply', () => {
  it('contests at least one event; outcome is one of four', () => {
    const { reply } = fixtures()
    expect(problems(Reply, { ...reply, contests: [] })).toEqual(['contests'])
    expect(problems(Reply, { ...reply, outcome: 'disputed' })).toEqual([])
    expect(problems(Reply, { ...reply, outcome: 'accepted' })).toEqual(['outcome'])
    const text = reply.text as Obj
    expect(problems(Reply, { ...reply, text: { ...text, fr: '' } })).toEqual(['text.fr'])
  })
})

describe('Lead', () => {
  it('status is open, dropped or promoted:evt_…', () => {
    for (const status of ['open', 'dropped', 'promoted:evt_2025_08_08_DEU_A6']) {
      expect(problems(Lead, { ...LEAD, status }), status).toEqual([])
    }
    for (const status of ['closed', 'promoted:', 'promoted:foo', 'promoted:evt_', 'Open', '']) {
      expect(problems(Lead, { ...LEAD, status }), status).toEqual(['status'])
    }
  })

  it('a lead source is a source id or a press/NGO reference', () => {
    expect(
      problems(LeadSource, { source: 'src_20250808_bundesregierung_ruestungsexporte' }),
    ).toEqual([])
    expect(
      problems(LeadSource, {
        url: 'https://example.org/a',
        publisher: 'Example',
        kind: 'ngo',
        title: 'T',
        date: '2026-01-01',
      }),
    ).toEqual([])
    expect(
      problems(LeadSource, { url: 'https://example.org/a', publisher: 'X', kind: 'official' }),
    ).not.toEqual([])
    expect(problems(Lead, { ...LEAD, sources: [] })).toEqual(['sources'])
  })

  it('indicator and id shapes', () => {
    expect(problems(Lead, { ...LEAD, indicator: 'F1' })).toEqual(['indicator'])
    expect(problems(Lead, { ...LEAD, id: 'lead_20260901_1' })).toEqual(['id'])
  })
})

describe('Assessment', () => {
  it('indicator keys are indicator ids; entries are strict', () => {
    const { assessment } = fixtures()
    const indicators = assessment.indicators as Obj
    expect(
      problems(Assessment, {
        ...assessment,
        indicators: { ...indicators, F1: { status: 'unchecked' } },
      }),
    ).toEqual(['indicators.F1'])
    expect(
      problems(Assessment, {
        ...assessment,
        indicators: { A1: { status: 'none-found', checked_at: '2026-09-27', queries: ['q'] } },
      }),
    ).toEqual([])
    expect(
      problems(Assessment, {
        ...assessment,
        indicators: { A1: { status: 'none-found', by: 'x' } },
      }),
    ).toEqual(['indicators.A1'])
  })
})

describe('ArchiveIndexRow', () => {
  const row = {
    src_id: 'src_20250808_bundesregierung_ruestungsexporte',
    url: 'https://example.org/a',
    wayback_url: 'https://web.archive.org/web/2025id_/https://example.org/a',
    sha256: 'a'.repeat(64),
    bytes: '1024',
    retrieved_at: '2026-09-26T22:58:53Z',
    content_type: 'text/html',
  }

  it('coerces bytes to a number', () => {
    expect(ArchiveIndexRow.parse(row).bytes).toBe(1024)
  })

  it('blank archive fields become null', () => {
    const parsed = ArchiveIndexRow.parse({
      ...row,
      wayback_url: '',
      sha256: '',
      bytes: '',
      retrieved_at: '',
      content_type: '',
    })
    expect(parsed).toMatchObject({
      wayback_url: null,
      sha256: null,
      bytes: null,
      retrieved_at: null,
      content_type: '',
    })
  })

  it('rejects negative or fractional bytes and malformed values', () => {
    expect(problems(ArchiveIndexRow, { ...row, bytes: '-1' })).toEqual(['bytes'])
    expect(problems(ArchiveIndexRow, { ...row, bytes: '1.5' })).toEqual(['bytes'])
    expect(problems(ArchiveIndexRow, { ...row, sha256: 'xyz' })).toEqual(['sha256'])
    expect(problems(ArchiveIndexRow, { ...row, retrieved_at: '2026-09-26' })).toEqual([
      'retrieved_at',
    ])
    expect(problems(ArchiveIndexRow, { ...row, url: '' })).toEqual(['url'])
  })
})

describe('EventIdLike', () => {
  it('accepts hand-authored and generated ids', () => {
    expect(EventIdLike.safeParse('evt_2025_08_08_DEU_A6').success).toBe(true)
    expect(EventIdLike.safeParse('evt_2023_10_27_FRA_B1_es-10-21').success).toBe(true)
    expect(EventIdLike.safeParse('evt_2025_02_30_DEU_A6').success).toBe(false)
  })
})
