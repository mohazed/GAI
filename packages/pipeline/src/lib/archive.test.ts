import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { ArchiveIndexRow, parseCsv, Source } from '@gai/schema'
import { afterAll, describe, expect, it } from 'vitest'
import { parse } from 'yaml'
import { archiveUrl, deriveSourceId, publisherSlug, sha256Hex, topicSlug } from './archive.js'
import { archiveDataset, checkFileAgainstSource, datasetSourceId, jsonAccept } from './dataset.js'
import { domToText, extractHtml, extractText, TEXT_LIMIT_BYTES, truncateText } from './extract.js'
import {
  appendArchiveIndex,
  csvField,
  csvText,
  mergeRows,
  sourceYaml,
  writeSource,
} from './files.js'
import { fakeNet, isSave, isSnapshot, isStatus } from './testing.js'

const TMP = mkdtempSync(join(tmpdir(), 'gai-archive-'))
afterAll(() => rmSync(TMP, { recursive: true, force: true }))
let n = 0
const root = () => join(TMP, `r${++n}`)

const CREDS = { access: 'AK', secret: 'SK' }
const PAGE = 'https://www.example.gov/news/2025/statement-gaza'
const TS = '20260927101500'
const HTML = `<!doctype html><html lang="en-GB"><head><title>Statement on Gaza</title>
<meta property="article:published_time" content="2025-08-08T10:00:00+02:00">
<meta property="og:site_name" content="Example Government"></head>
<body><nav>Home | News</nav><article><h1>Statement on Gaza</h1>
<p>The government will not approve   exports\nthat could be used in Gaza.</p>
<p>Second paragraph with <b>bold</b> text.</p></article><script>var x = 1</script></body></html>`

const script = (body: string | Uint8Array, type = 'text/html; charset=utf-8') => [
  { match: isSave, body: { url: PAGE, job_id: 'spn2-1' } },
  { match: isStatus, body: { status: 'success', timestamp: TS, original_url: PAGE } },
  { match: isSnapshot, body, headers: { 'content-type': type } },
]

describe('archiveUrl', () => {
  it('writes the text and an index row, and returns a valid archived source record', async () => {
    const r = root()
    const net = fakeNet(script(HTML))
    const doc = await archiveUrl({
      url: PAGE,
      root: r,
      creds: CREDS,
      deps: net.deps,
      kind: 'official',
    })
    expect(doc.ok).toBe(true)
    if (!doc.ok) return
    const bytes = new TextEncoder().encode(HTML)
    expect(doc.source).toMatchObject({
      id: 'src_20250808_example_2025-statement-gaza',
      kind: 'official',
      title: 'Statement on Gaza',
      publisher: 'Example Government',
      url: PAGE,
      wayback_url: `https://web.archive.org/web/${TS}id_/${PAGE}`,
      archive_status: 'archived',
      sha256: sha256Hex(bytes),
      bytes: bytes.byteLength,
      content_type: 'text/html',
      retrieved_at: '2026-09-27T10:00:05Z',
      language: 'en',
      date: '2025-08-08',
      text_file: 'archive/text/src_20250808_example_2025-statement-gaza.txt',
    })
    expect(Source.safeParse(doc.source).success).toBe(true)
    const text = readFileSync(join(r, doc.source.text_file as string), 'utf8')
    expect(text).toContain('The government will not approve exports that could be used in Gaza.')
    expect(text).not.toContain('var x')
    const index = parseCsv(readFileSync(join(r, 'archive/index.csv'), 'utf8'), 'index')
    expect(index.rows).toHaveLength(1)
    const row = ArchiveIndexRow.parse(index.rows[0]?.record)
    expect(row).toMatchObject({
      src_id: doc.source.id,
      sha256: doc.source.sha256,
      bytes: bytes.byteLength,
    })
  })

  it('on final failure writes no text, records the attempt, and returns wayback_url: null', async () => {
    const r = root()
    const net = fakeNet([{ match: isSave, status: 429, body: 'x', repeat: true }])
    const doc = await archiveUrl({
      url: PAGE,
      root: r,
      creds: CREDS,
      deps: net.deps,
      id: 'src_20250808_example_statement',
    })
    expect(doc.ok).toBe(false)
    expect(doc.source).toMatchObject({
      wayback_url: null,
      sha256: null,
      archive_status: 'failed',
      text_file: null,
    })
    expect(Source.safeParse(doc.source).success).toBe(true)
    expect(readFileSync(join(r, 'archive/index.csv'), 'utf8').trim().split('\n')).toEqual([
      'src_id,url,wayback_url,sha256,bytes,retrieved_at,content_type',
      `src_20250808_example_statement,${PAGE},,,,,`,
    ])
    // Two retries, 60 s apart.
    expect(net.slept.filter((ms) => ms === 60_000)).toHaveLength(2)
  })

  it('captures anew once when a reused capture is not served', async () => {
    const r = root()
    const net = fakeNet([
      { match: isSave, body: { job_id: 'spn2-1' } },
      {
        match: isStatus,
        body: { status: 'success', timestamp: '20260101000000', original_url: PAGE },
      },
      { match: (u) => u.includes('20260101000000'), status: 404, body: '', repeat: true },
      { match: isSave, body: { job_id: 'spn2-2' } },
      { match: isStatus, body: { status: 'success', timestamp: TS, original_url: PAGE } },
      { match: isSnapshot, body: HTML, headers: { 'content-type': 'text/html' } },
    ])
    const doc = await archiveUrl({
      url: PAGE,
      root: r,
      creds: CREDS,
      deps: net.deps,
      spn: { availabilityTimeoutMs: 60_000 },
    })
    expect(doc.ok).toBe(true)
    const saves = net.calls.filter((c) => isSave(c.url, c.init))
    expect(String(saves[1]?.init?.body)).not.toContain('if_not_archived_within')
  })

  it('rejects an archived error page before writing anything', async () => {
    const r = root()
    const net = fakeNet(script('{"statusCode":429}', 'application/json'))
    const doc = await archiveUrl({
      url: PAGE,
      root: r,
      creds: CREDS,
      deps: net.deps,
      id: 'src_20260927_example_data',
      accept: jsonAccept((j) => (Array.isArray((j as { data?: unknown }).data) ? null : 'no data')),
    })
    expect(doc).toMatchObject({ ok: false, reason: expect.stringContaining('rejected (no data)') })
    expect(() => readFileSync(join(r, 'archive/index.csv'))).toThrow()
  })

  it('records an existing capture without saving anew (--capture)', async () => {
    const r = root()
    const csv = 'a,b\n1,2\n'
    const net = fakeNet([
      { match: isSnapshot, body: csv, headers: { 'content-type': 'text/csv; charset=utf-8' } },
    ])
    const doc = await archiveUrl({
      url: 'https://data.example.org/files/votes.csv',
      id: 'src_20260928_example_votes',
      kind: 'dataset',
      capture: '20250618161123',
      root: r,
      creds: CREDS,
      deps: net.deps,
    })
    expect(net.calls.map((c) => c.url)).toEqual([
      'https://web.archive.org/web/20250618161123id_/https://data.example.org/files/votes.csv',
    ])
    expect(doc.ok).toBe(true)
    if (!doc.ok) return
    expect(doc.source).toMatchObject({
      wayback_url:
        'https://web.archive.org/web/20250618161123id_/https://data.example.org/files/votes.csv',
      sha256: sha256Hex(new TextEncoder().encode(csv)),
      archive_status: 'archived',
    })
    expect(doc.source.notes).toContain('existing Wayback capture 20250618161123')
    await expect(
      archiveUrl({
        url: PAGE,
        capture: '2025',
        root: r,
        creds: CREDS,
        deps: net.deps,
      }),
    ).rejects.toThrow(/14-digit/)
  })
})

describe('source ids', () => {
  it('derives publisher and topic slugs from the URL', () => {
    expect(publisherSlug('https://www.icj-cij.org/case/192')).toBe('icj-cij')
    expect(publisherSlug('https://press.un.org/en/2023/ga12548.doc.htm')).toBe('un-press')
    expect(publisherSlug('https://www.gov.uk/government/news/x')).toBe('gov')
    expect(publisherSlug('https://www.diplomatie.gouv.fr/fr/x')).toBe('diplomatie')
    expect(topicSlug('https://www.icj-cij.org/case/192', null)).toBe('case-192')
    expect(topicSlug('https://press.un.org/en/2023/ga12548.doc.htm', null)).toBe('2023-ga12548-doc')
    expect(topicSlug('https://example.org/', 'Déclaration sur Gaza')).toBe('declaration-sur-gaza')
    expect(deriveSourceId('https://www.icj-cij.org/case/192', '2026-09-27', null)).toBe(
      'src_20260927_icj-cij_case-192',
    )
  })

  it('never reuses the id of a source holding other bytes', () => {
    const r = root()
    const base = {
      kind: 'dataset' as const,
      title: 't',
      publisher: 'p',
      publisher_type: 'dataset',
      url: 'https://example.org/api',
      wayback_url: `https://web.archive.org/web/${TS}id_/https://example.org/api`,
      archive_status: 'archived' as const,
      sha256: 'a'.repeat(64),
      bytes: 1,
      content_type: 'application/json',
      retrieved_at: '2026-09-27T10:00:00Z',
      language: 'en',
      date: '2026-09-27',
      text_file: null,
    }
    writeSource(r, { ...base, id: 'src_20260927_fts_plan-1-p1' })
    expect(datasetSourceId(r, '2026-09-27', ['fts', 'plan-1-p1'], 'a'.repeat(64))).toBe(
      'src_20260927_fts_plan-1-p1',
    )
    expect(datasetSourceId(r, '2026-09-27', ['fts', 'plan-1-p1'], 'b'.repeat(64))).toBe(
      'src_20260927_fts_plan-1-p1-2',
    )
  })
})

describe('archiveDataset', () => {
  it('files a dataset source with its title and publisher, and parses the archived bytes', async () => {
    const r = root()
    const json = '{"data":[1,2]}'
    const net = fakeNet(script(json, 'application/json'))
    const d = await archiveDataset(
      { root: r, creds: CREDS, deps: net.deps },
      { url: PAGE, segments: ['test', 'dataset'], title: 'Test dataset', publisher: 'Tester' },
    )
    expect(d.ok).toBe(true)
    const rec = parse(
      readFileSync(join(r, 'data/sources/2026/src_20260927_test_dataset.yaml'), 'utf8'),
    )
    expect(Source.parse(rec)).toMatchObject({
      kind: 'dataset',
      title: 'Test dataset',
      publisher: 'Tester',
      publisher_type: 'dataset',
      date: '2026-09-27',
    })
    expect(readFileSync(join(r, 'archive/text/src_20260927_test_dataset.txt'), 'utf8')).toBe(
      `${json}\n`,
    )
    const bytes = new TextEncoder().encode(json)
    expect(checkFileAgainstSource(r, 'src_20260927_test_dataset', bytes, sha256Hex(bytes))).toEqual(
      [],
    )
    expect(
      checkFileAgainstSource(r, 'src_20260927_test_dataset', bytes, 'f'.repeat(64))[0],
    ).toContain('sha256')
    expect(
      checkFileAgainstSource(r, 'src_20260927_test_missing', bytes, 'f'.repeat(64))[0],
    ).toContain('does not exist')
  })
})

describe('text extraction', () => {
  it('turns blocks into lines and drops scripts', () => {
    const x = extractHtml(HTML)
    expect(x.method).toBe('readability')
    expect(x.text.split('\n')).toContain('Second paragraph with bold text.')
    expect(x).toMatchObject({
      title: 'Statement on Gaza',
      lang: 'en',
      published: '2025-08-08',
      siteName: 'Example Government',
    })
  })

  it('keeps the whole body of a list page where Readability finds little', () => {
    const list = `<html><body><ul>${Array.from({ length: 40 }, (_, i) => `<li>Item ${i}</li>`).join('')}</ul></body></html>`
    const x = extractHtml(list)
    expect(x.text.split('\n')).toHaveLength(40)
  })

  it('reads the prose of a client-rendered Next.js page whose body has no text', () => {
    const data = {
      props: {
        props: { settings: { terms: 'Site terms that are not the page' } },
        pageProps: {
          newsDetails: {
            uuid: 'N1995533',
            title: 'Crown Prince Inaugurates Summit',
            content:
              'Riyadh, November 11, 2023, SPA -- First paragraph.\n    Second <b>paragraph</b> here.\n',
          },
          gcloudToken: 'abc123',
        },
      },
    }
    const page = `<html lang="en"><head><title>SPA</title></head><body><div id="__next"></div><script id="__NEXT_DATA__" type="application/json">${JSON.stringify(data)}</script></body></html>`
    const x = extractHtml(page)
    expect(x.method).toBe('next-data')
    expect(x.text.split('\n')).toEqual([
      'Crown Prince Inaugurates Summit',
      'Riyadh, November 11, 2023, SPA -- First paragraph.',
      'Second paragraph here.',
    ])
    expect(extractHtml('<html><body><div id="__next"></div></body></html>').method).toBe(
      'html-body',
    )
  })

  it('reads the prose of a content-API JSON document and leaves dataset JSON raw', async () => {
    const api = {
      message: 'berhasil mengambil data konten publikasi',
      data: {
        title: 'Menlu RI di SMU PBB',
        slug: 'menlu-ri-di-smu-pbb',
        thumbnail_path: 'publikasi/1790_image.jpeg',
        content_detail:
          '<p style="text-align:justify;"><strong>New York</strong>– “First paragraph,” said the Minister.</p><p>Second <i>paragraph</i> here.</p>',
        views: 0,
      },
    }
    const bytes = new TextEncoder().encode(
      JSON.stringify(api).replace(/–|“|”/g, (c) => `\\u${c.charCodeAt(0).toString(16)}`),
    )
    const x = await extractText(bytes, 'application/json', null)
    expect(x.method).toBe('json-content')
    expect(x.text.split('\n')).toEqual([
      'berhasil mengambil data konten publikasi',
      'Menlu RI di SMU PBB',
      'New York– “First paragraph,” said the Minister.',
      'Second paragraph here.',
    ])
    const dataset = new TextEncoder().encode(
      JSON.stringify({ data: [{ name: 'Plan 1186', amountUSD: 5 }] }),
    )
    const y = await extractText(dataset, 'application/json', null)
    expect(y.method).toBe('raw')
    expect(y.text).toBe(new TextDecoder().decode(dataset))
  })

  it('reads the text layer of a PDF', async () => {
    const stream = 'BT /F1 12 Tf 72 720 Td (Hello archived PDF) Tj ET'
    const objs = [
      '<< /Type /Catalog /Pages 2 0 R >>',
      '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
      '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
      `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
      '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    ]
    let pdf = '%PDF-1.4\n'
    const offsets: number[] = []
    objs.forEach((o, i) => {
      offsets.push(pdf.length)
      pdf += `${i + 1} 0 obj\n${o}\nendobj\n`
    })
    const xref = pdf.length
    pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${offsets.map((o) => `${String(o).padStart(10, '0')} 00000 n \n`).join('')}`
    pdf += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`
    const x = await extractText(new TextEncoder().encode(pdf), 'application/pdf')
    expect(x.method).toBe('pdf')
    expect(x.text).toContain('Hello archived PDF')
  })

  it('falls back to the raw text', async () => {
    const x = await extractText(new TextEncoder().encode('{"a":1}'), 'application/json')
    expect(x).toMatchObject({ method: 'raw', text: '{"a":1}' })
  })

  it('truncates at 200 KB of UTF-8 with a marker, on a character boundary', () => {
    const long = 'é'.repeat(150_000) // 300 000 bytes
    const t = truncateText(long)
    expect(t.truncated).toBe(true)
    expect(Buffer.byteLength(t.text, 'utf8')).toBeLessThanOrEqual(TEXT_LIMIT_BYTES)
    expect(t.text).toMatch(
      /\[pnpm archive: text truncated at 200 KB; \d+ of 300000 bytes of extracted text kept\]\n$/,
    )
    expect(t.text).not.toContain('�')
    expect(truncateText('short')).toEqual({ text: 'short', truncated: false })
  })

  it('domToText handles <br>, cells and <pre>', () => {
    const x = extractHtml(
      '<html><body><p>a<br>b</p><table><tr><td>1</td><td>2</td></tr></table><pre>x  y\nz</pre></body></html>',
    )
    expect(x.text).toBe('a\nb\n1\t2\nx  y\nz')
    expect(typeof domToText).toBe('function')
  })
})

describe('file writers', () => {
  it('quote CSV fields only when needed', () => {
    expect(csvField('a,b')).toBe('"a,b"')
    expect(csvField('say "x"')).toBe('"say ""x"""')
    expect(csvField(null)).toBe('')
    expect(csvText(['a', 'b'], [{ a: 1, b: 'x' }])).toBe('a,b\n1,x\n')
  })

  it('merge replaces rows by key and keeps the rest', () => {
    const merged = mergeRows(
      [
        { iso3: 'DEU', year: 2024, v: 1 },
        { iso3: 'FRA', year: 2024, v: 2 },
      ],
      [{ iso3: 'DEU', year: 2024, v: 9 }],
      ['iso3', 'year'],
    )
    expect(merged).toEqual([
      { iso3: 'FRA', year: 2024, v: 2 },
      { iso3: 'DEU', year: 2024, v: 9 },
    ])
  })

  it('appends index rows after the header', () => {
    const r = root()
    const row = {
      src_id: 'src_20260927_a_b',
      url: 'https://x.org',
      wayback_url: null,
      sha256: null,
      bytes: null,
      retrieved_at: null,
      content_type: '',
    }
    appendArchiveIndex(r, row)
    appendArchiveIndex(r, row)
    expect(readFileSync(join(r, 'archive/index.csv'), 'utf8').split('\n')).toHaveLength(4)
  })

  it('writes source records in the documented key order', () => {
    const y = sourceYaml({
      notes: 'n',
      id: 'src_20260927_a_b',
      kind: 'dataset',
      title: 't',
      publisher: 'p',
      publisher_type: 'dataset',
      url: 'https://x.org',
      wayback_url: null,
      sha256: null,
      bytes: null,
      content_type: null,
      retrieved_at: null,
      language: 'en',
      date: '2026-09-27',
      text_file: null,
    })
    expect(y.split('\n')[0]).toBe('id: src_20260927_a_b')
    expect(y.trim().split('\n').at(-1)).toBe('notes: n')
  })
})
