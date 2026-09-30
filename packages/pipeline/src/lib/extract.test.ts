/**
 * The archiver reads untrusted documents (P-19): HTML and PDF from any site. These tests check that
 * nothing in a document runs, that the pdfjs build has no eval path, and that the download and
 * text limits hold.
 */
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { fetchBytes, MAX_DOWNLOAD_BYTES, TooLargeError } from './deps.js'
import { extractHtml, extractText, TEXT_LIMIT_BYTES, truncateText } from './extract.js'
import { fakeNet } from './testing.js'

const g = globalThis as Record<string, unknown>

describe('extractHtml on hostile markup', () => {
  it('runs no script, handler or javascript: URL, and keeps none of them in the text', () => {
    delete g.__gaiRan
    const html = `<!doctype html><html lang="en"><head><title>T</title>
      <script>globalThis.__gaiRan = 'head'</script></head>
      <body onload="globalThis.__gaiRan = 'onload'">
        <main><h1>Statement</h1><p>The ministry said it would review the licences.</p>
        <img src="x" onerror="globalThis.__gaiRan = 'onerror'">
        <a href="javascript:globalThis.__gaiRan='href'">link</a>
        <script>globalThis.__gaiRan = 'body'</script>
        <iframe srcdoc="<script>globalThis.__gaiRan='iframe'</script>"></iframe>
        <noscript>no script text</noscript></main>
      </body></html>`
    const x = extractHtml(html)
    expect(g.__gaiRan).toBeUndefined()
    expect(x.text).toContain('The ministry said it would review the licences.')
    expect(x.text).not.toMatch(/__gaiRan|onerror|javascript:/)
  })

  it('fetches nothing for external resources', async () => {
    const calls: string[] = []
    const original = globalThis.fetch
    globalThis.fetch = (async (u: string | URL | Request) => {
      calls.push(String(u))
      return new Response('')
    }) as typeof fetch
    try {
      extractHtml(
        '<html><head><link rel="stylesheet" href="https://example.org/a.css"></head><body><p>Text</p><img src="https://example.org/i.png"><script src="https://example.org/s.js"></script></body></html>',
      )
      await new Promise((r) => setTimeout(r, 10))
    } finally {
      globalThis.fetch = original
    }
    expect(calls).toEqual([])
  })
})

describe('pdfjs build', () => {
  it('has no eval or new Function code path', () => {
    const require = createRequire(import.meta.url)
    const dir = dirname(require.resolve('pdfjs-dist/package.json'))
    for (const file of ['legacy/build/pdf.mjs', 'legacy/build/pdf.worker.mjs']) {
      const src = readFileSync(join(dir, file), 'utf8')
      expect(src, file).not.toMatch(/\beval\s*\(/)
      expect(src, file).not.toMatch(/new Function\s*\(/)
    }
  })

  it('falls back to the raw bytes on a damaged PDF', async () => {
    const bytes = new TextEncoder().encode('%PDF-1.7\nnot really a pdf')
    const x = await extractText(bytes, 'application/pdf')
    expect(x.method).toBe('raw')
  })
})

describe('limits', () => {
  it('caps the extracted text at 200 KB', () => {
    const { text, truncated } = truncateText('é'.repeat(TEXT_LIMIT_BYTES))
    expect(truncated).toBe(true)
    expect(Buffer.byteLength(text, 'utf8')).toBeLessThanOrEqual(TEXT_LIMIT_BYTES)
  })

  it('refuses a body larger than the download limit, declared or streamed', async () => {
    expect(MAX_DOWNLOAD_BYTES).toBe(512 * 1024 * 1024)
    const big = new Uint8Array(2048)
    const declared = fakeNet([
      { match: () => true, body: big, headers: { 'content-length': '2048' } },
    ])
    await expect(
      fetchBytes(declared.deps, 'https://example.org/a', {}, 1000, 1024),
    ).rejects.toBeInstanceOf(TooLargeError)
    const streamed = fakeNet([{ match: () => true, body: big }])
    await expect(
      fetchBytes(streamed.deps, 'https://example.org/b', {}, 1000, 1024),
    ).rejects.toBeInstanceOf(TooLargeError)
    const small = fakeNet([{ match: () => true, body: new Uint8Array(1024) }])
    const ok = await fetchBytes(small.deps, 'https://example.org/c', {}, 1000, 1024)
    expect(ok.body.byteLength).toBe(1024)
  })
})
