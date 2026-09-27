import { describe, expect, it } from 'vitest'
import type { Issue } from '../../issues.js'
import type { Dataset } from '../../load/dataset.js'
import type { Methodology } from '../../load/methodology.js'
import type { Event, Evidence, Source } from '../../records.js'
import { fixtureContext, issuesOf, runRules, setArchiveText } from '../../testing/harness.js'
import { isDatasetRow, rules } from './sources.js'

// Fixture records (fixtures/README.md).
const EVT = 'evt_2025_08_08_DEU_A6'
const EVENTS_FILE = 'data/events/DEU.yaml'
const SRC0 = 'src_20250808_bundesregierung_ruestungsexporte-gaza'
const SRC1 = 'src_20251117_bundesregierung_ruestungsexporte-israel-aufhebung'

// Synthetic sources added in memory by the tests below.
const VIDEO = 'src_20250101_test-publisher_video-statement'
const FAILED = 'src_20250101_test-publisher_failed-capture'
const ORIGIN = 'src_20250101_test-publisher_dataset-export'
const ROW = 'src_20250101_test-publisher_dataset-row'
const EXTRA = 'src_20250101_test-publisher_extra-page'
const UNKNOWN = 'src_20250101_test-publisher_no-such-source'

const fileOf = (id: string) => `data/sources/${id.slice(4, 8)}/${id}.yaml`

type Mutate = (ds: Dataset, m: Methodology) => void

const run = (mutate?: Mutate): Issue[] => runRules(rules, fixtureContext(mutate))

function event0(ds: Dataset): Event {
  const e = ds.events[0]
  if (!e) throw new Error('fixture event missing')
  return e.value
}

function evidence(ds: Dataset, i: number): Evidence {
  const ev = event0(ds).evidence[i]
  if (!ev) throw new Error(`fixture evidence #${i} missing`)
  return ev
}

function source(ds: Dataset, id: string): Source {
  const s = ds.sources.find((x) => x.value.id === id)
  if (!s) throw new Error(`source ${id} missing`)
  return s.value
}

function archiveText(ds: Dataset, id: string): string {
  const t = ds.readArchiveText(id)
  if (t === undefined) throw new Error(`archive text ${id} missing`)
  return t
}

/** Adds a copy of the first fixture source with `patch` applied (and `drop` keys removed). */
function addSource(
  ds: Dataset,
  id: string,
  patch: Partial<Source>,
  drop: (keyof Source)[] = [],
): Source {
  const base = ds.sources[0]
  if (!base) throw new Error('fixture source missing')
  const value: Source = { ...structuredClone(base.value), ...patch, id }
  for (const k of drop) delete (value as Partial<Source>)[k]
  ds.sources.push({ value, file: fileOf(id), line: 1 })
  return value
}

const ARCHIVED = {
  wayback_url: 'https://web.archive.org/web/20250101000000id_/https://example.org/test',
  sha256: 'a'.repeat(64),
  bytes: 1234,
  content_type: 'text/html',
  retrieved_at: '2025-01-01T00:00:00Z',
} satisfies Partial<Source>

/** The archived-copy fields of ARCHIVED, with a Wayback snapshot of `url`. */
const archivedAt = (url: string) =>
  ({
    ...ARCHIVED,
    wayback_url: `https://web.archive.org/web/20250101000000id_/${url}`,
  }) satisfies Partial<Source>

const UNARCHIVED = {
  wayback_url: null,
  sha256: null,
  bytes: null,
  content_type: null,
  retrieved_at: null,
} satisfies Partial<Source>

/** An official-video source with its transcript in archive/text. */
function addVideo(ds: Dataset, patch: Partial<Source> = {}): Source {
  const s = addSource(ds, VIDEO, {
    kind: 'official-video',
    url: 'https://example.org/video',
    date: '2025-01-01',
    text_file: `archive/text/${VIDEO}.txt`,
    ...archivedAt('https://example.org/video'),
    ...patch,
  })
  setArchiveText(ds, VIDEO, 'Transcript. We call for an immediate ceasefire.')
  return s
}

/** An archived dataset source (ORIGIN) and a dataset row (ROW) pointing at a structured table. */
function addDatasetRow(ds: Dataset, originPatch: Partial<Source> = {}): Source {
  addSource(ds, ORIGIN, {
    kind: 'dataset',
    publisher_type: 'dataset',
    url: 'https://example.org/export.json',
    date: '2025-01-01',
    text_file: `archive/text/${ORIGIN}.txt`,
    ...archivedAt('https://example.org/export.json'),
    ...originPatch,
  })
  setArchiveText(ds, ORIGIN, '{"rows": []}')
  return addSource(
    ds,
    ROW,
    {
      kind: 'dataset',
      publisher_type: 'dataset',
      url: 'data/structured/unga_votes.csv',
      date: '2025-01-01',
      text_file: null,
      origin: ORIGIN,
      ...UNARCHIVED,
    },
    ['archive_status'],
  )
}

/** Index row for `id` as archive/index.csv would hold it. */
function addIndexRow(ds: Dataset, s: Source, line: number): void {
  ds.archiveIndex.push({
    value: {
      src_id: s.id,
      url: s.url,
      wayback_url: s.wayback_url,
      sha256: s.sha256,
      bytes: s.bytes,
      retrieved_at: s.retrieved_at,
      content_type: s.content_type ?? '',
    },
    file: 'archive/index.csv',
    line,
  })
}

/** The single issue of `rule`, checked for file and id. */
function only(issues: Issue[], rule: Issue['rule'], file: string, id: string): Issue {
  const found = issuesOf(issues, rule)
  expect(found, JSON.stringify(found, null, 2)).toHaveLength(1)
  const [first] = found
  if (!first) throw new Error('unreachable')
  expect(first.file).toBe(file)
  expect(first.id).toBe(id)
  return first
}

describe('fixtures', () => {
  it('produce no issue from any source rule', () => {
    expect(run()).toEqual([])
  })

  it('isDatasetRow needs kind dataset and a data/structured/*.csv url', () => {
    const ctx = fixtureContext((ds) => addDatasetRow(ds))
    const row = ctx.index.sourceById.get(ROW)?.value
    const origin = ctx.index.sourceById.get(ORIGIN)?.value
    if (!row || !origin) throw new Error('synthetic sources missing')
    expect(isDatasetRow(row)).toBe(true)
    expect(isDatasetRow(origin)).toBe(false)
    expect(isDatasetRow({ ...row, kind: 'official' })).toBe(false)
    expect(isDatasetRow({ ...row, url: 'data/structured/raw/unga_votes.csv' })).toBe(false)
  })
})

describe("'event.quote-in-archive'", () => {
  it('passes on the fixtures', () => {
    expect(issuesOf(run(), 'event.quote-in-archive')).toEqual([])
  })

  it('passes when the quote carries no-break spaces, a newline or a zero-width space', () => {
    const issues = run((ds) => {
      const e0 = evidence(ds, 0)
      e0.quote = e0.quote.replaceAll(' ', '\u00A0')
      const e1 = evidence(ds, 1)
      e1.quote = e1.quote
        .replace('Beschränkungen zum', 'Beschränkungen\nzum')
        .replace('Die ', 'Die\u200B ')
    })
    expect(issuesOf(issues, 'event.quote-in-archive')).toEqual([])
  })

  it('passes when the archived text carries narrow no-break spaces, line breaks and soft hyphens', () => {
    const issues = run((ds) => {
      const text = archiveText(ds, SRC0)
        .replace('bis auf Weiteres', 'bis\u202Fauf\r\nWeiteres')
        .replace('Rüstungsgütern', 'Rüstungs\u00ADgütern')
      setArchiveText(ds, SRC0, text)
    })
    expect(issuesOf(issues, 'event.quote-in-archive')).toEqual([])
  })

  it('passes when an Arabic quote or its archived text carries bidi marks (U+200F, U+200E, U+061C, isolates)', () => {
    // Synthetic text for the test, not a quotation of a real document.
    const text = 'قال المتحدث\u200F: \u2067إن الحكومة\u2069 ستعلق\u061C التصاريح.\u200E'
    const quote = 'إن الحكومة ستعلق التصاريح'
    const plain = run((ds) => {
      source(ds, SRC0).language = 'ar'
      setArchiveText(ds, SRC0, text)
      const e0 = evidence(ds, 0)
      e0.quote = quote
      e0.quote_lang = 'ar'
    })
    expect(issuesOf(plain, 'event.quote-in-archive')).toEqual([])
    const marked = run((ds) => {
      source(ds, SRC0).language = 'ar'
      setArchiveText(ds, SRC0, text.replace(/[\u200E\u200F\u061C\u2066-\u2069]/g, ''))
      const e0 = evidence(ds, 0)
      e0.quote = `\u200F${quote.replace(' ستعلق', '\u200F ستعلق')}\u200F`
      e0.quote_lang = 'ar'
    })
    expect(issuesOf(marked, 'event.quote-in-archive')).toEqual([])
    const differs = run((ds) => {
      source(ds, SRC0).language = 'ar'
      setArchiveText(ds, SRC0, text)
      const e0 = evidence(ds, 0)
      e0.quote = 'إن الحكومة\u200F ستوقف التصاريح'
      e0.quote_lang = 'ar'
    })
    expect(only(differs, 'event.quote-in-archive', EVENTS_FILE, EVT).path).toBe('evidence.0.quote')
  })

  it('passes when the quote is decomposed (NFD)', () => {
    const issues = run((ds) => {
      const e0 = evidence(ds, 0)
      e0.quote = e0.quote.normalize('NFD')
    })
    expect(issuesOf(issues, 'event.quote-in-archive')).toEqual([])
  })

  it('fails when a word of the quote differs from the archived text', () => {
    const issues = run((ds) => {
      const e0 = evidence(ds, 0)
      e0.quote = e0.quote.replace('keine Ausfuhren', 'alle Ausfuhren')
    })
    const i = only(issues, 'event.quote-in-archive', EVENTS_FILE, EVT)
    expect(i.level).toBe('error')
    expect(i.path).toBe('evidence.0.quote')
    expect(i.message).toContain(`archive/text/${SRC0}.txt`)
  })

  it('fails when only the apostrophe differs', () => {
    const issues = run((ds) => {
      setArchiveText(
        ds,
        SRC0,
        'The minister said: \u201Cthe government\u2019s decision stands\u201D.',
      )
      evidence(ds, 0).quote = "the government's decision stands"
    })
    const i = only(issues, 'event.quote-in-archive', EVENTS_FILE, EVT)
    expect(i.path).toBe('evidence.0.quote')
  })

  it('passes when the apostrophe is the same', () => {
    const issues = run((ds) => {
      setArchiveText(
        ds,
        SRC0,
        'The minister said: \u201Cthe government\u2019s decision stands\u201D.',
      )
      evidence(ds, 0).quote = 'the government\u2019s decision stands'
    })
    expect(issuesOf(issues, 'event.quote-in-archive')).toEqual([])
  })

  it('fails when the archived text file is missing', () => {
    const issues = run((ds) => setArchiveText(ds, SRC1, undefined))
    const i = only(issues, 'event.quote-in-archive', EVENTS_FILE, EVT)
    expect(i.path).toBe('evidence.1.quote')
    expect(i.message).toContain(`archive/text/${SRC1}.txt is missing`)
  })

  it('fails when the quote is empty after normalisation', () => {
    const issues = run((ds) => {
      evidence(ds, 0).quote = '\u200B\u00AD'
    })
    expect(only(issues, 'event.quote-in-archive', EVENTS_FILE, EVT).path).toBe('evidence.0.quote')
  })

  it('skips a row locator (any case, leading spaces) on a dataset source outside B9/B10', () => {
    for (const locator of ['row 12', 'Row 3', '  ROW 4']) {
      const issues = run((ds) => {
        source(ds, SRC0).kind = 'dataset'
        const e0 = evidence(ds, 0)
        e0.quote = 'Not in the archived text.'
        e0.locator = locator
      })
      expect(issuesOf(issues, 'event.quote-in-archive'), locator).toEqual([])
    }
  })

  it('skips a dataset row cited with a row locator, and checks it with any other locator', () => {
    const ok = run((ds) => {
      addDatasetRow(ds)
      const e0 = evidence(ds, 0)
      e0.source = ROW
      e0.quote = 'DEU,Y'
      e0.locator = 'row 2'
    })
    expect(issuesOf(ok, 'event.quote-in-archive')).toEqual([])
    const bad = run((ds) => {
      addDatasetRow(ds)
      const e0 = evidence(ds, 0)
      e0.source = ROW
      e0.quote = 'DEU,Y'
      e0.locator = 'paragraph 2'
    })
    expect(only(bad, 'event.quote-in-archive', EVENTS_FILE, EVT).message).toContain('missing')
  })

  it('checks an invented quote on an official source cited with a row or video locator', () => {
    for (const locator of ['row 1', 'Row 6', 'video 00:01:00', 'Video 1:02', 'Rowland interview']) {
      const issues = run((ds) => {
        const e0 = evidence(ds, 0)
        e0.quote = 'Die Bundesregierung verhängt ein vollständiges Waffenembargo gegen Israel.'
        e0.locator = locator
      })
      const i = only(issues, 'event.quote-in-archive', EVENTS_FILE, EVT)
      expect(i.path, locator).toBe('evidence.0.quote')
    }
  })

  it('checks a quote cited with a video locator against the official-video transcript', () => {
    const base: Mutate = (ds) => {
      addVideo(ds)
      const e0 = evidence(ds, 0)
      e0.source = VIDEO
      e0.locator = 'video 00:01:02'
    }
    const ok = run((ds, m) => {
      base(ds, m)
      evidence(ds, 0).quote = 'We call for an immediate ceasefire.'
    })
    expect(issuesOf(ok, 'event.quote-in-archive')).toEqual([])
    const bad = run((ds, m) => {
      base(ds, m)
      evidence(ds, 0).quote = 'We call for sanctions.'
    })
    only(bad, 'event.quote-in-archive', EVENTS_FILE, EVT)
  })

  it('still checks other locators such as page or paragraph', () => {
    const issues = run((ds) => {
      const e0 = evidence(ds, 0)
      e0.quote = 'Not in the archived text.'
      e0.locator = 'page 2'
    })
    only(issues, 'event.quote-in-archive', EVENTS_FILE, EVT)
  })

  it('always checks B9 and B10 quotes, whatever the locator', () => {
    for (const indicator of ['B9', 'B10']) {
      for (const locator of ['video 00:01:02', 'row 12']) {
        const issues = run((ds) => {
          event0(ds).indicator = indicator
          const e0 = evidence(ds, 0)
          e0.quote = 'Not in the archived text.'
          e0.locator = locator
        })
        const i = only(issues, 'event.quote-in-archive', EVENTS_FILE, EVT)
        expect(i.path).toBe('evidence.0.quote')
      }
    }
  })

  it('checks a B9 quote against the official-video transcript', () => {
    const base: Mutate = (ds) => {
      addVideo(ds)
      event0(ds).indicator = 'B9'
      const e0 = evidence(ds, 0)
      e0.source = VIDEO
      e0.locator = 'video 00:01:02'
    }
    const ok = run((ds, m) => {
      base(ds, m)
      evidence(ds, 0).quote = 'We call for an immediate ceasefire.'
    })
    expect(issuesOf(ok, 'event.quote-in-archive')).toEqual([])
    const bad = run((ds, m) => {
      base(ds, m)
      evidence(ds, 0).quote = 'We call for a ceasefire.'
    })
    only(bad, 'event.quote-in-archive', EVENTS_FILE, EVT)
  })

  it('leaves unknown sources to event.evidence-source-known', () => {
    const issues = run((ds) => {
      evidence(ds, 0).source = UNKNOWN
    })
    expect(issuesOf(issues, 'event.quote-in-archive')).toEqual([])
  })

  it('reports nothing when indicators.yaml failed to load', () => {
    const issues = run((ds, m) => {
      m.indicatorsFile = null
      evidence(ds, 0).quote = 'Not in the archived text.'
    })
    expect(issuesOf(issues, 'event.quote-in-archive')).toEqual([])
  })
})

describe("'event.quote-translation'", () => {
  it('passes on the fixtures (German quotes with quote_en)', () => {
    expect(issuesOf(run(), 'event.quote-translation')).toEqual([])
  })

  it('does not require quote_en for English quotes, with or without a region subtag', () => {
    for (const lang of ['en', 'en-GB']) {
      const issues = run((ds) => {
        source(ds, SRC0).language = 'en'
        const e0 = evidence(ds, 0)
        e0.quote_lang = lang
        delete e0.quote_en
      })
      expect(issuesOf(issues, 'event.quote-translation'), lang).toEqual([])
    }
  })

  it('fails when a non-English quote has no quote_en', () => {
    const issues = run((ds) => {
      delete evidence(ds, 1).quote_en
    })
    const i = only(issues, 'event.quote-translation', EVENTS_FILE, EVT)
    expect(i.path).toBe('evidence.1.quote_en')
    expect(i.message).toContain('"de"')
  })

  it('fails when quote_en is blank', () => {
    const issues = run((ds) => {
      evidence(ds, 0).quote_en = ' \n '
    })
    expect(only(issues, 'event.quote-translation', EVENTS_FILE, EVT).path).toBe(
      'evidence.0.quote_en',
    )
  })

  it('reads the primary subtag (pt-BR is not English; "eng" is not "en")', () => {
    for (const lang of ['pt-BR', 'eng']) {
      const issues = run((ds) => {
        source(ds, SRC0).language = lang
        const e0 = evidence(ds, 0)
        e0.quote_lang = lang
        delete e0.quote_en
      })
      expect(only(issues, 'event.quote-translation', EVENTS_FILE, EVT).level).toBe('error')
    }
  })

  it('warns when quote_lang differs from the language of the cited source', () => {
    const issues = run((ds) => {
      const e0 = evidence(ds, 0)
      e0.quote_lang = 'en'
      delete e0.quote_en
    })
    const i = only(issues, 'event.quote-translation', EVENTS_FILE, EVT)
    expect(i.level).toBe('warning')
    expect(i.path).toBe('evidence.0.quote_lang')
    expect(i.message).toContain('"de"')
  })

  it('compares primary subtags only, and accepts a source in several languages (mul)', () => {
    const regional = run((ds) => {
      evidence(ds, 0).quote_lang = 'de-DE'
    })
    expect(issuesOf(regional, 'event.quote-translation')).toEqual([])
    const multilingual = run((ds) => {
      source(ds, SRC0).language = 'mul'
      const e0 = evidence(ds, 0)
      e0.quote_lang = 'en'
      delete e0.quote_en
    })
    expect(issuesOf(multilingual, 'event.quote-translation')).toEqual([])
  })
})

describe("'event.evidence-source-known'", () => {
  it('passes on the fixtures', () => {
    expect(issuesOf(run(), 'event.evidence-source-known')).toEqual([])
  })

  it('fails when an evidence entry cites a source with no record', () => {
    const issues = run((ds) => {
      evidence(ds, 1).source = UNKNOWN
    })
    const i = only(issues, 'event.evidence-source-known', EVENTS_FILE, EVT)
    expect(i.path).toBe('evidence.1.source')
    expect(i.message).toContain(`data/sources/2025/${UNKNOWN}.yaml`)
  })

  it('does not report a source whose record failed its schema', () => {
    const issues = run((ds) => {
      evidence(ds, 1).source = UNKNOWN
      ds.invalidIds.add(UNKNOWN)
      ds.invalid.source.add(UNKNOWN)
    })
    expect(issuesOf(issues, 'event.evidence-source-known')).toEqual([])
  })

  it('still reports the source when only an index row of that id failed its schema', () => {
    const issues = run((ds) => {
      evidence(ds, 1).source = UNKNOWN
      ds.invalidIds.add(UNKNOWN)
      ds.invalid.archiveIndex.add(UNKNOWN)
    })
    expect(only(issues, 'event.evidence-source-known', EVENTS_FILE, EVT).path).toBe(
      'evidence.1.source',
    )
  })
})

describe("'event.evidence-archived'", () => {
  it('passes on the fixtures', () => {
    expect(issuesOf(run(), 'event.evidence-archived')).toEqual([])
  })

  it('fails when a published event cites a source without wayback_url', () => {
    const issues = run((ds) => {
      source(ds, SRC1).wayback_url = null
    })
    const i = only(issues, 'event.evidence-archived', EVENTS_FILE, EVT)
    expect(i.path).toBe('evidence.1.source')
    expect(i.message).toContain('wayback_url')
  })

  it('fails when a published event cites a source without sha256', () => {
    const issues = run((ds) => {
      source(ds, SRC0).sha256 = null
    })
    const i = only(issues, 'event.evidence-archived', EVENTS_FILE, EVT)
    expect(i.path).toBe('evidence.0.source')
    expect(i.message).toContain('sha256')
  })

  it('fails for a failed capture cited by a published event', () => {
    const issues = run((ds) => {
      addSource(ds, FAILED, { ...UNARCHIVED, archive_status: 'failed', text_file: null })
      evidence(ds, 0).source = FAILED
    })
    only(issues, 'event.evidence-archived', EVENTS_FILE, EVT)
  })

  it('fails for a failed capture that still carries wayback_url and sha256', () => {
    const issues = run((ds) => {
      source(ds, SRC0).archive_status = 'failed'
    })
    const i = only(issues, 'event.evidence-archived', EVENTS_FILE, EVT)
    expect(i.path).toBe('evidence.0.source')
    expect(i.message).toContain('archive_status: failed')
  })

  it('fails for a dataset row whose origin is a failed capture', () => {
    const issues = run((ds) => {
      addDatasetRow(ds, { archive_status: 'failed' })
      evidence(ds, 0).source = ROW
    })
    expect(only(issues, 'event.evidence-archived', EVENTS_FILE, EVT).message).toContain(ORIGIN)
  })

  it('ignores events that are not published', () => {
    for (const status of ['draft', 'reviewed', 'retracted'] as const) {
      const issues = run((ds) => {
        event0(ds).status = status
        source(ds, SRC0).wayback_url = null
      })
      expect(issuesOf(issues, 'event.evidence-archived'), status).toEqual([])
    }
  })

  it('accepts a dataset row whose origin is archived', () => {
    const issues = run((ds) => {
      addDatasetRow(ds)
      evidence(ds, 0).source = ROW
    })
    expect(issuesOf(issues, 'event.evidence-archived')).toEqual([])
  })

  it('fails for a dataset row whose origin is not archived', () => {
    const issues = run((ds) => {
      addDatasetRow(ds, { wayback_url: null })
      evidence(ds, 0).source = ROW
    })
    const i = only(issues, 'event.evidence-archived', EVENTS_FILE, EVT)
    expect(i.message).toContain(ORIGIN)
  })

  it('fails for a dataset row with no origin or an unknown origin', () => {
    for (const origin of [undefined, UNKNOWN]) {
      const issues = run((ds) => {
        const row = addDatasetRow(ds)
        if (origin === undefined) delete row.origin
        else row.origin = origin
        evidence(ds, 0).source = ROW
      })
      only(issues, 'event.evidence-archived', EVENTS_FILE, EVT)
    }
  })

  it('fails for a dataset source with an http url and no archive (no dataset-row exemption)', () => {
    const issues = run((ds) => {
      addSource(ds, EXTRA, { kind: 'dataset', ...UNARCHIVED, origin: SRC0 })
      evidence(ds, 0).source = EXTRA
    })
    only(issues, 'event.evidence-archived', EVENTS_FILE, EVT)
  })

  it('leaves unknown sources to event.evidence-source-known', () => {
    const issues = run((ds) => {
      evidence(ds, 0).source = UNKNOWN
    })
    expect(issuesOf(issues, 'event.evidence-archived')).toEqual([])
  })
})

describe("'event.video-locator'", () => {
  it('passes on the fixtures (no video sources)', () => {
    expect(issuesOf(run(), 'event.video-locator')).toEqual([])
  })

  it('accepts video hh:mm:ss, h:mm:ss and mm:ss, in any case', () => {
    for (const locator of ['video 00:12:34', 'video 1:02:03', 'video 12:34', 'VIDEO 01:02:03']) {
      const issues = run((ds) => {
        addVideo(ds)
        const e0 = evidence(ds, 0)
        e0.source = VIDEO
        e0.locator = locator
      })
      expect(issuesOf(issues, 'event.video-locator'), locator).toEqual([])
    }
  })

  it('fails when evidence from an official-video source has no timestamp locator', () => {
    for (const locator of [
      'paragraph 3',
      'video',
      'video 12',
      'video 1:2',
      'at 00:12:34',
      'video 123:45',
    ]) {
      const issues = run((ds) => {
        addVideo(ds)
        const e0 = evidence(ds, 0)
        e0.source = VIDEO
        e0.locator = locator
      })
      const i = only(issues, 'event.video-locator', EVENTS_FILE, EVT)
      expect(i.path, locator).toBe('evidence.0.locator')
    }
  })

  it('rejects malformed timestamps (long seconds, trailing junk, out-of-range fields)', () => {
    for (const locator of [
      'video 00:12:345',
      'video 00:12:34abc',
      'video 12:34:56:78',
      'video 99:99',
      'video 1:2:34',
      'video 12:3456',
      'video 00:60',
    ]) {
      const issues = run((ds) => {
        addVideo(ds)
        const e0 = evidence(ds, 0)
        e0.source = VIDEO
        e0.locator = locator
      })
      only(issues, 'event.video-locator', EVENTS_FILE, EVT)
    }
  })

  it('accepts a range or a note after the timestamp', () => {
    for (const locator of ['video 00:12:34–00:13:10', 'video 00:12:34 (German)']) {
      const issues = run((ds) => {
        addVideo(ds)
        const e0 = evidence(ds, 0)
        e0.source = VIDEO
        e0.locator = locator
      })
      expect(issuesOf(issues, 'event.video-locator'), locator).toEqual([])
    }
  })

  it('does not apply to other source kinds with other locators', () => {
    for (const locator of ['paragraph 99', 'Videoconference transcript, p. 2']) {
      const issues = run((ds) => {
        evidence(ds, 0).locator = locator
      })
      expect(issuesOf(issues, 'event.video-locator'), locator).toEqual([])
    }
  })

  it('fails when a video locator cites a source that is not official-video', () => {
    for (const kind of ['press', 'official', 'ngo'] as const) {
      const issues = run((ds) => {
        source(ds, SRC0).kind = kind
        evidence(ds, 0).locator = 'video 00:01:00'
      })
      const i = only(issues, 'event.video-locator', EVENTS_FILE, EVT)
      expect(i.path, kind).toBe('evidence.0.locator')
      expect(i.message, kind).toContain(`kind ${kind}`)
    }
  })
})

describe("'source.archive-required'", () => {
  it('passes on the fixtures', () => {
    expect(issuesOf(run(), 'source.archive-required')).toEqual([])
  })

  it('fails when wayback_url, sha256 or retrieved_at is null, naming the fields', () => {
    const issues = run((ds) => {
      const s = source(ds, SRC0)
      s.wayback_url = null
      s.sha256 = null
      s.retrieved_at = null
    })
    const i = only(issues, 'source.archive-required', fileOf(SRC0), SRC0)
    expect(i.level).toBe('error')
    expect(i.message).toContain('lacks wayback_url, sha256 and retrieved_at')
  })

  it('fails when only retrieved_at is null', () => {
    const issues = run((ds) => {
      source(ds, SRC1).retrieved_at = null
    })
    expect(only(issues, 'source.archive-required', fileOf(SRC1), SRC1).message).toContain(
      'lacks retrieved_at',
    )
  })

  it('fails when an archived copy has no bytes or content_type', () => {
    const issues = run((ds) => {
      const s = source(ds, SRC0)
      s.bytes = null
      s.content_type = null
    })
    expect(only(issues, 'source.archive-required', fileOf(SRC0), SRC0).message).toContain(
      'lacks bytes and content_type',
    )
  })

  it('does not require bytes or content_type when wayback_url is missing', () => {
    const issues = run((ds) => {
      const s = source(ds, SRC0)
      s.wayback_url = null
      s.bytes = null
      s.content_type = null
    })
    const i = only(issues, 'source.archive-required', fileOf(SRC0), SRC0)
    expect(i.message).toContain('lacks wayback_url;')
  })

  it('warns, without an error, for a capture recorded as archive_status: failed', () => {
    const issues = run((ds) => {
      addSource(ds, FAILED, { ...UNARCHIVED, archive_status: 'failed', text_file: null })
    })
    const i = only(issues, 'source.archive-required', fileOf(FAILED), FAILED)
    expect(i.level).toBe('warning')
    expect(i.message).toContain('failed')
  })

  it('fails for a failed capture that still carries a wayback_url or sha256', () => {
    for (const patch of [{ sha256: null }, { wayback_url: null }, {}]) {
      const issues = run((ds) => {
        const s = source(ds, SRC0)
        s.archive_status = 'failed'
        Object.assign(s, patch)
      })
      const i = only(issues, 'source.archive-required', fileOf(SRC0), SRC0)
      expect(i.level).toBe('error')
      expect(i.path).toBe('archive_status')
    }
  })

  it('fails when wayback_url is not a Wayback Machine snapshot', () => {
    for (const url of [
      'https://example.com/not-an-archive',
      'https://archive.ph/abcde',
      'https://web.archive.org/web/2025/https://www.bundesregierung.de/x',
    ]) {
      const issues = run((ds) => {
        source(ds, SRC0).wayback_url = url
      })
      const i = only(issues, 'source.archive-required', fileOf(SRC0), SRC0)
      expect(i.level, url).toBe('error')
      expect(i.path, url).toBe('wayback_url')
    }
  })

  it('warns when the snapshot is of another url than the source url', () => {
    const issues = run((ds) => {
      source(ds, SRC0).url = 'https://www.bundesregierung.de/breg-de/other-page'
    })
    const i = only(issues, 'source.archive-required', fileOf(SRC0), SRC0)
    expect(i.level).toBe('warning')
    expect(i.message).toContain('other-page')
  })

  it('accepts a snapshot whose url differs only by scheme, www., host case or trailing slash', () => {
    const issues = run((ds) => {
      const s = source(ds, SRC0)
      s.url = s.url
        .replace('https://www.bundesregierung.de', 'http://BUNDESREGIERUNG.de')
        .concat('/')
    })
    expect(issuesOf(issues, 'source.archive-required')).toEqual([])
  })

  it('exempts dataset rows pointing at data/structured', () => {
    const issues = run((ds) => addDatasetRow(ds))
    expect(issuesOf(issues, 'source.archive-required')).toEqual([])
  })

  it('does not exempt a dataset source with an http url', () => {
    const issues = run((ds) => {
      addSource(ds, EXTRA, { kind: 'dataset', ...UNARCHIVED, text_file: null })
    })
    only(issues, 'source.archive-required', fileOf(EXTRA), EXTRA)
  })
})

describe("'source.text-file'", () => {
  it('passes on the fixtures', () => {
    expect(issuesOf(run(), 'source.text-file')).toEqual([])
  })

  it('allows text_file null for dataset rows and failed captures', () => {
    const issues = run((ds) => {
      addDatasetRow(ds)
      addSource(ds, FAILED, { ...UNARCHIVED, archive_status: 'failed', text_file: null })
    })
    expect(issuesOf(issues, 'source.text-file')).toEqual([])
  })

  it('accepts an official-video source with its transcript', () => {
    const issues = run((ds) => addVideo(ds))
    expect(issuesOf(issues, 'source.text-file')).toEqual([])
  })

  it('fails when text_file is null on an ordinary source', () => {
    const issues = run((ds) => {
      source(ds, SRC0).text_file = null
    })
    const i = only(issues, 'source.text-file', fileOf(SRC0), SRC0)
    expect(i.path).toBe('text_file')
  })

  it('fails when an official-video source has no transcript, even after a failed capture', () => {
    for (const patch of [{}, { ...UNARCHIVED, archive_status: 'failed' as const }]) {
      const issues = run((ds) => {
        addVideo(ds, { ...patch, text_file: null })
      })
      const i = only(issues, 'source.text-file', fileOf(VIDEO), VIDEO)
      expect(i.message).toContain('transcript')
    }
  })

  it('fails when text_file is not archive/text/{id}.txt', () => {
    for (const path of [`archive/text/${SRC1}.txt`, `archive/${SRC0}.txt`, `${SRC0}.txt`]) {
      const issues = run((ds) => {
        source(ds, SRC0).text_file = path
      })
      const i = only(issues, 'source.text-file', fileOf(SRC0), SRC0)
      expect(i.message).toContain(`expected "archive/text/${SRC0}.txt"`)
    }
  })

  it('fails when archive/text/{id}.txt does not exist', () => {
    const issues = run((ds) => setArchiveText(ds, SRC1, undefined))
    const i = only(issues, 'source.text-file', fileOf(SRC1), SRC1)
    expect(i.message).toContain(`archive/text/${SRC1}.txt does not exist`)
  })

  it('checks the file of a dataset row that sets text_file', () => {
    const issues = run((ds) => {
      addDatasetRow(ds).text_file = `archive/text/${ROW}.txt`
    })
    only(issues, 'source.text-file', fileOf(ROW), ROW)
  })
})

describe("'source.archive-index'", () => {
  it('passes on the fixtures', () => {
    expect(issuesOf(run(), 'source.archive-index')).toEqual([])
  })

  it('fails when a source cited by a published or reviewed event has no index row', () => {
    for (const status of ['published', 'reviewed'] as const) {
      const issues = run((ds) => {
        event0(ds).status = status
        ds.archiveIndex = ds.archiveIndex.filter((r) => r.value.src_id !== SRC1)
      })
      const i = only(issues, 'source.archive-index', fileOf(SRC1), SRC1)
      expect(i.level, status).toBe('error')
      expect(i.message).toContain('pnpm archive')
    }
  })

  it('fails when a source cited by a structured row or a qualifying vote has no index row', () => {
    const structured = run((ds) => {
      addSource(ds, EXTRA, { kind: 'dataset', ...archivedAt(source(ds, SRC0).url) })
      ds.structured['gni.csv'].push({
        value: { iso3: 'DEU', year: 2024, gni_atlas_usd: 1, source: EXTRA },
        file: 'data/structured/gni.csv',
        line: 2,
      })
    })
    expect(only(structured, 'source.archive-index', fileOf(EXTRA), EXTRA).level).toBe('error')
    const vote = run((ds, m) => {
      addSource(ds, EXTRA, archivedAt(source(ds, SRC0).url))
      if (!m.votes) throw new Error('votes.yaml missing')
      m.votes.value.votes.push({
        symbol: 'A/RES/TEST/1',
        kind: 'resolution',
        date: '2025-01-01',
        title: { en: 'Test', fr: 'Test' },
        subject: 'gaza',
        counts: { yes: 0, no: 0, abstain: 0 },
        source: EXTRA,
        rationale: { en: 'Test', fr: 'Test' },
      })
    })
    expect(only(vote, 'source.archive-index', fileOf(EXTRA), EXTRA).level).toBe('error')
    const uncited = run((ds) => {
      addSource(ds, EXTRA, archivedAt(source(ds, SRC0).url))
    })
    expect(only(uncited, 'source.archive-index', fileOf(EXTRA), EXTRA).level).toBe('warning')
  })

  it('warns when a source supporting nothing public has no index row', () => {
    const issues = run((ds) => {
      event0(ds).status = 'draft'
      ds.archiveIndex = ds.archiveIndex.filter((r) => r.value.src_id !== SRC1)
    })
    const i = only(issues, 'source.archive-index', fileOf(SRC1), SRC1)
    expect(i.level).toBe('warning')
  })

  it('compares with the row of the same capture when a source has several rows', () => {
    const issues = run((ds) => {
      const s = source(ds, SRC0)
      // A failed capture first (blank archive fields), then the archived one: index.csv is
      // append-only.
      const rows = ds.archiveIndex.filter((r) => r.value.src_id === SRC0)
      const archived = rows[0]
      if (!archived) throw new Error('index row missing')
      ds.archiveIndex.unshift({
        value: { ...archived.value, wayback_url: null, sha256: null, bytes: null },
        file: 'archive/index.csv',
        line: 2,
      })
      archived.line = 5
      expect(s.wayback_url).toBe(archived.value.wayback_url)
    })
    expect(issuesOf(issues, 'source.archive-index')).toEqual([])
  })

  it('compares with the latest row when no row has the record wayback_url', () => {
    const issues = run((ds) => {
      const row = ds.archiveIndex.find((r) => r.value.src_id === SRC0)
      if (!row) throw new Error('index row missing')
      ds.archiveIndex.push({
        value: { ...row.value, wayback_url: `${row.value.wayback_url}-later` },
        file: 'archive/index.csv',
        line: 9,
      })
      source(ds, SRC0).wayback_url = `${row.value.wayback_url}-other`
    })
    const i = only(issues, 'source.archive-index', fileOf(SRC0), SRC0)
    expect(i.path).toBe('wayback_url')
    expect(i.message).toContain('line 9')
  })

  it('fails when the index disagrees on url, wayback_url, sha256 or bytes', () => {
    const edits: [string, (s: Source) => void][] = [
      [
        'url',
        (s) => {
          s.url = 'https://example.org/other'
        },
      ],
      [
        'wayback_url',
        (s) => {
          s.wayback_url = `${ARCHIVED.wayback_url}-other`
        },
      ],
      [
        'sha256',
        (s) => {
          s.sha256 = 'b'.repeat(64)
        },
      ],
      [
        'bytes',
        (s) => {
          s.bytes = 1
        },
      ],
    ]
    for (const [field, edit] of edits) {
      const issues = run((ds) => edit(source(ds, SRC0)))
      const i = only(issues, 'source.archive-index', fileOf(SRC0), SRC0)
      expect(i.level, field).toBe('error')
      expect(i.path, field).toBe(field)
      expect(i.message, field).toContain('archive/index.csv line 2')
    }
  })

  it('fails when the index row has a blank sha256', () => {
    const issues = run((ds) => {
      const row = ds.archiveIndex.find((r) => r.value.src_id === SRC0)
      if (!row) throw new Error('index row missing')
      row.value.sha256 = null
    })
    expect(only(issues, 'source.archive-index', fileOf(SRC0), SRC0).path).toBe('sha256')
  })

  it('compares bytes only when both sides have them', () => {
    const issues = run((ds) => {
      const row = ds.archiveIndex.find((r) => r.value.src_id === SRC0)
      if (!row) throw new Error('index row missing')
      row.value.bytes = null
    })
    expect(issuesOf(issues, 'source.archive-index')).toEqual([])
  })

  it('does not look up sources without wayback_url', () => {
    const issues = run((ds) => {
      addDatasetRow(ds)
      addSource(ds, FAILED, { ...UNARCHIVED, archive_status: 'failed', text_file: null })
    })
    // ORIGIN is archived but has no index row; ROW and FAILED are not looked up.
    const found = issuesOf(issues, 'source.archive-index')
    expect(found.map((i) => i.id)).toEqual([ORIGIN])
  })

  it('accepts an extra archived source with a matching row', () => {
    const issues = run((ds) => {
      const s = addSource(ds, EXTRA, { url: 'https://example.org/test', ...ARCHIVED })
      addIndexRow(ds, s, 4)
    })
    expect(issuesOf(issues, 'source.archive-index')).toEqual([])
  })

  it('warns on an index row that names no source record', () => {
    const issues = run((ds) => {
      const s = { ...source(ds, SRC0), id: EXTRA }
      addIndexRow(ds, s, 4)
    })
    const i = only(issues, 'source.archive-index', 'archive/index.csv', EXTRA)
    expect(i.level).toBe('warning')
    expect(i.line).toBe(4)
  })

  it('does not report an index row whose source record failed its schema', () => {
    const issues = run((ds) => {
      addIndexRow(ds, { ...source(ds, SRC0), id: EXTRA }, 4)
      ds.invalidIds.add(EXTRA)
      ds.invalid.source.add(EXTRA)
    })
    expect(issuesOf(issues, 'source.archive-index')).toEqual([])
  })

  it('does not report a missing row when the index row of the source failed its schema', () => {
    const issues = run((ds) => {
      ds.archiveIndex = ds.archiveIndex.filter((r) => r.value.src_id !== SRC1)
      ds.invalidIds.add(SRC1)
      ds.invalid.archiveIndex.add(SRC1)
    })
    expect(issuesOf(issues, 'source.archive-index')).toEqual([])
  })
})

describe("'source.dataset-origin'", () => {
  it('passes on the fixtures', () => {
    expect(issuesOf(run(), 'source.dataset-origin')).toEqual([])
  })

  it('accepts a dataset row whose origin is an archived dataset source', () => {
    const issues = run((ds) => addDatasetRow(ds))
    expect(issuesOf(issues, 'source.dataset-origin')).toEqual([])
  })

  it('fails when a dataset row names no origin', () => {
    const issues = run((ds) => {
      delete addDatasetRow(ds).origin
    })
    const i = only(issues, 'source.dataset-origin', fileOf(ROW), ROW)
    expect(i.path).toBe('origin')
    expect(i.message).toContain('data/structured/unga_votes.csv')
  })

  it('fails when the origin does not exist, unless its record failed its schema', () => {
    const bad = run((ds) => {
      addDatasetRow(ds).origin = UNKNOWN
    })
    expect(only(bad, 'source.dataset-origin', fileOf(ROW), ROW).message).toContain(UNKNOWN)
    const skipped = run((ds) => {
      addDatasetRow(ds).origin = UNKNOWN
      ds.invalidIds.add(UNKNOWN)
      ds.invalid.source.add(UNKNOWN)
    })
    expect(issuesOf(skipped, 'source.dataset-origin')).toEqual([])
  })

  it('fails when the origin is not of kind dataset', () => {
    const issues = run((ds) => {
      addDatasetRow(ds).origin = SRC0
    })
    expect(only(issues, 'source.dataset-origin', fileOf(ROW), ROW).message).toContain(
      'kind official',
    )
  })

  it('fails when the origin is not archived', () => {
    for (const patch of [{ wayback_url: null }, { sha256: null }]) {
      const issues = run((ds) => addDatasetRow(ds, patch))
      expect(only(issues, 'source.dataset-origin', fileOf(ROW), ROW).message).toContain(ORIGIN)
    }
  })

  it('fails when the origin is a failed capture', () => {
    const issues = run((ds) => addDatasetRow(ds, { archive_status: 'failed' }))
    expect(only(issues, 'source.dataset-origin', fileOf(ROW), ROW).message).toContain(
      'failed capture',
    )
  })

  it('does not apply to dataset sources with an http url', () => {
    const issues = run((ds) => {
      addSource(ds, EXTRA, { kind: 'dataset', ...ARCHIVED })
    })
    expect(issuesOf(issues, 'source.dataset-origin')).toEqual([])
  })
})

describe("'source.orphan'", () => {
  it('passes on the fixtures (both sources are cited by the event)', () => {
    expect(issuesOf(run(), 'source.orphan')).toEqual([])
  })

  it('warns on a source nothing cites', () => {
    const issues = run((ds) => {
      addSource(ds, EXTRA, ARCHIVED)
    })
    const i = only(issues, 'source.orphan', fileOf(EXTRA), EXTRA)
    expect(i.level).toBe('warning')
  })

  it('warns when the only citing event evidence is removed', () => {
    const issues = run((ds) => {
      event0(ds).evidence.pop()
      // The fixture correction also names the source (after.evidence); drop that citation too.
      for (const c of ds.corrections) {
        c.value.before = {}
        c.value.after = {}
      }
    })
    only(issues, 'source.orphan', fileOf(SRC1), SRC1)
  })

  it('counts events of any status as citing', () => {
    const issues = run((ds) => {
      event0(ds).status = 'retracted'
    })
    expect(issuesOf(issues, 'source.orphan')).toEqual([])
  })

  it('counts a qualifying vote as citing', () => {
    const issues = run((ds, m) => {
      addSource(ds, EXTRA, ARCHIVED)
      if (!m.votes) throw new Error('votes.yaml missing')
      m.votes.value.votes.push({
        symbol: 'A/RES/TEST/1',
        kind: 'resolution',
        date: '2025-01-01',
        title: { en: 'Test', fr: 'Test' },
        subject: 'gaza',
        counts: { yes: 0, no: 0, abstain: 0 },
        source: EXTRA,
        rationale: { en: 'Test', fr: 'Test' },
      })
    })
    expect(issuesOf(issues, 'source.orphan')).toEqual([])
  })

  it('counts a structured row as citing, and an origin as citing its dataset source', () => {
    const cited = run((ds) => {
      addDatasetRow(ds)
      ds.structured['unga_votes.csv'].push({
        value: {
          resolution: 'A/RES/TEST/1',
          date: '2025-01-01',
          iso3: 'DEU',
          vote: 'Y',
          source: ROW,
        },
        file: 'data/structured/unga_votes.csv',
        line: 2,
      })
    })
    expect(issuesOf(cited, 'source.orphan')).toEqual([])
    // Without the row, ROW is an orphan; ORIGIN is still cited by ROW's origin.
    const uncited = run((ds) => addDatasetRow(ds))
    only(uncited, 'source.orphan', fileOf(ROW), ROW)
  })

  it('counts a lead {source} entry as citing', () => {
    const issues = run((ds) => {
      addSource(ds, EXTRA, { kind: 'press', ...ARCHIVED })
      ds.leads.push({
        value: {
          id: 'lead_20250101_DEU_1',
          country: 'DEU',
          indicator: 'A6',
          claim: 'Test lead.',
          sources: [{ source: EXTRA }],
          date: '2025-01-01',
          status: 'open',
        },
        file: 'data/leads/DEU.yaml',
        line: 1,
      })
    })
    expect(issuesOf(issues, 'source.orphan')).toEqual([])
  })

  it('does not count a source naming itself as origin', () => {
    const issues = run((ds) => {
      addSource(ds, EXTRA, { ...ARCHIVED, origin: EXTRA })
    })
    only(issues, 'source.orphan', fileOf(EXTRA), EXTRA)
  })

  it('reports nothing when votes.yaml failed to load', () => {
    const issues = run((ds, m) => {
      addSource(ds, EXTRA, ARCHIVED)
      m.votes = null
    })
    expect(issuesOf(issues, 'source.orphan')).toEqual([])
  })
})
