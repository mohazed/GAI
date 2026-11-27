/**
 * The text caps (docs/10 B-2169): 4,096 KB for document text, 200 KB for raw text, and
 * `pnpm archive:retext`, which adds the text the former 200 KB cap cut without moving a byte of
 * the text already filed.
 */
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, describe, expect, it } from 'vitest'
import { archiveUrl, sha256Hex } from './archive.js'
import {
  DOCUMENT_TEXT_LIMIT_BYTES,
  extendTruncatedText,
  extractText,
  limitLabel,
  TEXT_LIMIT_BYTES,
  textLimitFor,
  truncateText,
} from './extract.js'
import { retextSource } from './retext.js'
import { fakeNet, isSave, isSnapshot, isStatus } from './testing.js'

const TMP = mkdtempSync(join(tmpdir(), 'gai-retext-'))
afterAll(() => rmSync(TMP, { recursive: true, force: true }))
let n = 0
const root = () => join(TMP, `r${++n}`)

/** An HTML page whose text is about `kb` KB, with a sentence near the end. */
function longHtml(kb: number): string {
  const para = `<p>${'Paragraph of the record. '.repeat(40)}</p>\n` // about 1 KB
  return `<!doctype html><html lang="en"><head><title>Record</title></head><body><main>${para.repeat(kb)}<p>The Minister spoke on Gaza at the end of the record.</p></main></body></html>`
}

describe('text caps', () => {
  it('keeps 200 KB for raw text and 4,096 KB for document text', () => {
    expect(TEXT_LIMIT_BYTES).toBe(200 * 1024)
    expect(DOCUMENT_TEXT_LIMIT_BYTES).toBe(4096 * 1024)
    expect(textLimitFor('raw')).toBe(TEXT_LIMIT_BYTES)
    for (const m of ['readability', 'html-body', 'pdf', 'next-data', 'json-content'])
      expect(textLimitFor(m)).toBe(DOCUMENT_TEXT_LIMIT_BYTES)
    expect(limitLabel(TEXT_LIMIT_BYTES)).toBe('200 KB')
    expect(limitLabel(DOCUMENT_TEXT_LIMIT_BYTES)).toBe('4096 KB')
  })

  it('names the limit in the marker and keeps the result under it', () => {
    const long = 'é'.repeat(DOCUMENT_TEXT_LIMIT_BYTES) // twice the limit in bytes
    const t = truncateText(long, DOCUMENT_TEXT_LIMIT_BYTES)
    expect(t.truncated).toBe(true)
    expect(Buffer.byteLength(t.text, 'utf8')).toBeLessThanOrEqual(DOCUMENT_TEXT_LIMIT_BYTES)
    expect(t.text).toMatch(
      /\[pnpm archive: text truncated at 4096 KB; \d+ of 8388608 bytes of extracted text kept\]\n$/,
    )
    expect(t.text).not.toContain('�')
  })

  it('archives a 300 KB HTML document with its full text', async () => {
    const r = root()
    const url = 'https://www.example.gov/record'
    const html = longHtml(300)
    const net = fakeNet([
      { match: isSave, body: { url, job_id: 'spn2-1' } },
      {
        match: isStatus,
        body: { status: 'success', timestamp: '20260927101500', original_url: url },
      },
      { match: isSnapshot, body: html, headers: { 'content-type': 'text/html; charset=utf-8' } },
    ])
    const doc = await archiveUrl({
      url,
      root: r,
      creds: { access: 'AK', secret: 'SK' },
      deps: net.deps,
      id: 'src_20260927_example_record',
      kind: 'official',
    })
    expect(doc.ok).toBe(true)
    if (!doc.ok) return
    expect(doc.truncated).toBe(false)
    const text = readFileSync(join(r, 'archive/text/src_20260927_example_record.txt'), 'utf8')
    expect(Buffer.byteLength(text, 'utf8')).toBeGreaterThan(TEXT_LIMIT_BYTES)
    expect(text).toContain('The Minister spoke on Gaza at the end of the record.')
    expect(doc.source.notes).not.toMatch(/truncated/)
  })

  it('still cuts raw text (a dataset) at 200 KB and says so in the notes', async () => {
    const r = root()
    const url = 'https://api.example.org/data.json'
    const json = JSON.stringify({ rows: Array.from({ length: 30_000 }, (_, i) => ({ i })) })
    const net = fakeNet([
      { match: isSave, body: { url, job_id: 'spn2-1' } },
      {
        match: isStatus,
        body: { status: 'success', timestamp: '20260927101500', original_url: url },
      },
      { match: isSnapshot, body: json, headers: { 'content-type': 'application/json' } },
    ])
    const doc = await archiveUrl({
      url,
      root: r,
      creds: { access: 'AK', secret: 'SK' },
      deps: net.deps,
      id: 'src_20260927_example_data',
      kind: 'dataset',
    })
    expect(doc.ok).toBe(true)
    if (!doc.ok) return
    expect(doc.truncated).toBe(true)
    expect(doc.source.notes).toContain('Extracted text truncated at 200 KB.')
    const text = readFileSync(join(r, 'archive/text/src_20260927_example_data.txt'), 'utf8')
    expect(Buffer.byteLength(text, 'utf8')).toBeLessThanOrEqual(TEXT_LIMIT_BYTES)
  })
})

describe('extendTruncatedText', () => {
  const full = `${'Line of a long transcript.\n'.repeat(12_000)}The passage on Gaza.\n`
  const cut = truncateText(full, TEXT_LIMIT_BYTES).text

  it('adds the rest of the text after the kept part', () => {
    const r = extendTruncatedText(cut, full, DOCUMENT_TEXT_LIMIT_BYTES)
    expect(r.ok).toBe(true)
    if (!r.ok) return
    expect(r.text).toBe(full)
    expect(r.truncated).toBe(false)
    expect(r.keptAfter).toBe(Buffer.byteLength(full, 'utf8'))
    expect(r.keptBefore).toBeLessThan(TEXT_LIMIT_BYTES)
    // The kept part is unchanged, byte for byte.
    expect(r.text.startsWith(cut.slice(0, cut.indexOf('\n\n[pnpm archive:')))).toBe(true)
  })

  it('keeps a new marker when the new limit cuts again', () => {
    const r = extendTruncatedText(cut, full, 250 * 1024)
    expect(r.ok).toBe(true)
    if (!r.ok) return
    expect(r.truncated).toBe(true)
    expect(r.text).toMatch(/text truncated at 250 KB; \d+ of \d+ bytes/)
    expect(r.keptAfter).toBeGreaterThan(r.keptBefore)
  })

  it('refuses a file without a marker', () => {
    const r = extendTruncatedText('short text\n', 'short text\n', DOCUMENT_TEXT_LIMIT_BYTES)
    expect(r).toMatchObject({ ok: false, reason: expect.stringMatching(/no truncation marker/) })
  })

  it('refuses a re-extraction of another length or with another start', () => {
    const longer = extendTruncatedText(cut, `${full}more\n`, DOCUMENT_TEXT_LIMIT_BYTES)
    expect(longer).toMatchObject({ ok: false, reason: expect.stringMatching(/marker states/) })
    const moved = extendTruncatedText(cut, `X${full.slice(1)}`, DOCUMENT_TEXT_LIMIT_BYTES)
    expect(moved).toMatchObject({ ok: false, reason: expect.stringMatching(/not the start/) })
  })

  it('refuses a file whose kept part does not match its marker', () => {
    const edited = cut.replace('Line of', 'Line  of')
    const r = extendTruncatedText(edited, full, DOCUMENT_TEXT_LIMIT_BYTES)
    expect(r).toMatchObject({ ok: false, reason: expect.stringMatching(/before its marker/) })
  })

  it('refuses a limit that keeps nothing more', () => {
    const r = extendTruncatedText(cut, full, TEXT_LIMIT_BYTES)
    expect(r).toMatchObject({ ok: false, reason: expect.stringMatching(/keeps no more/) })
  })
})

describe('retextSource', () => {
  const ID = 'src_20241127_example_long-record'
  const WAYBACK = 'https://web.archive.org/web/20260101000000id_/https://www.example.gov/record'

  async function setUp(html: string, recorded?: { sha256: string; bytes: number }) {
    const r = root()
    const body = new TextEncoder().encode(html)
    const extracted = await extractText(body, 'text/html', 'utf-8')
    // The file as the former 200 KB cap wrote it.
    const old = truncateText(extracted.text, TEXT_LIMIT_BYTES).text
    mkdirSync(join(r, 'archive/text'), { recursive: true })
    mkdirSync(join(r, 'data/sources/2024'), { recursive: true })
    writeFileSync(join(r, `archive/text/${ID}.txt`), old)
    const record = [
      `id: ${ID}`,
      `wayback_url: ${WAYBACK}`,
      `sha256: ${recorded?.sha256 ?? sha256Hex(body)}`,
      `bytes: ${recorded?.bytes ?? body.byteLength}`,
      'content_type: text/html',
      `text_file: archive/text/${ID}.txt`,
      '',
    ].join('\n')
    writeFileSync(join(r, `data/sources/2024/${ID}.yaml`), record)
    return { r, body, old, full: extracted.text }
  }

  it('downloads the bytes of record, checks them and writes the full text', async () => {
    const html = longHtml(300)
    const { r, body, old, full } = await setUp(html)
    const net = fakeNet([
      {
        match: (u) => u === WAYBACK,
        body,
        headers: { 'content-type': 'text/html; charset=utf-8' },
      },
    ])
    const res = await retextSource({ root: r, id: ID, deps: net.deps })
    expect(res).toMatchObject({ ok: true, method: 'readability', truncated: false, written: true })
    const text = readFileSync(join(r, `archive/text/${ID}.txt`), 'utf8')
    expect(text.trimEnd()).toBe(full.trimEnd())
    expect(text).toContain('The Minister spoke on Gaza at the end of the record.')
    expect(text.startsWith(old.slice(0, old.indexOf('\n\n[pnpm archive:')))).toBe(true)
    // The source record is not written.
    expect(readFileSync(join(r, `data/sources/2024/${ID}.yaml`), 'utf8')).toContain(
      `sha256: ${sha256Hex(body)}`,
    )
  })

  it('accepts bytes already downloaded, and writes nothing on a dry run', async () => {
    const { r, body, old } = await setUp(longHtml(260))
    const net = fakeNet([])
    const res = await retextSource({
      root: r,
      id: ID,
      deps: net.deps,
      body,
      charset: 'utf-8',
      dryRun: true,
    })
    expect(res).toMatchObject({ ok: true, written: false })
    expect(net.calls).toHaveLength(0)
    expect(readFileSync(join(r, `archive/text/${ID}.txt`), 'utf8')).toBe(old)
  })

  it('refuses bytes that are not those of record', async () => {
    const { r, body, old } = await setUp(longHtml(260), { sha256: 'a'.repeat(64), bytes: 10 })
    const res = await retextSource({ root: r, id: ID, deps: fakeNet([]).deps, body })
    expect(res).toMatchObject({ ok: false, reason: expect.stringMatching(/not those of record/) })
    expect(readFileSync(join(r, `archive/text/${ID}.txt`), 'utf8')).toBe(old)
  })

  it('refuses a replay that does not answer 200', async () => {
    const { r } = await setUp(longHtml(260))
    const net = fakeNet([{ match: (u) => u === WAYBACK, status: 404, body: '' }])
    const res = await retextSource({ root: r, id: ID, deps: net.deps })
    expect(res).toMatchObject({ ok: false, reason: expect.stringMatching(/HTTP 404/) })
  })
})
