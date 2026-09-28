import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { switchLocalePath } from '../lib/locale-path'
import { parseHeaders, headersFor as resolveHeaders } from './serve'

const rules = parseHeaders(
  readFileSync(path.join(import.meta.dirname, '..', 'public', '_headers'), 'utf8'),
)
const headersFor = (p: string) => resolveHeaders(rules, p)

describe('public/_headers (docs/04 §3)', () => {
  it('sets the CSP and the security headers on every path', () => {
    const h = headersFor('/en/ranking/')
    const csp = h['Content-Security-Policy'] ?? ''
    for (const d of [
      "default-src 'self'",
      "style-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
    ]) {
      expect(csp).toContain(d)
    }
    // 'unsafe-inline' in the header is narrowed by each page's meta to hashed <style> and
    // <script> elements (scripts/csp.ts); the header alone must not allow anything else inline.
    expect(csp).toMatch(/script-src 'self' 'unsafe-inline';/)
    expect(csp).toMatch(/style-src 'self' 'unsafe-inline';/)
    expect(h['X-Content-Type-Options']).toBe('nosniff')
    expect(h['Referrer-Policy']).toBe('strict-origin-when-cross-origin')
    expect(h['Permissions-Policy']).toBeDefined()
  })
  it('serves hashed build assets immutable, without the page-level headers', () => {
    for (const p of [
      '/_next/static/chunks/main-app-1.js',
      '/fonts/newsreader-latin-opsz-5.3.0.woff2',
    ]) {
      const h = headersFor(p)
      expect(h['Cache-Control'], p).toBe('public, max-age=31536000, immutable')
      expect(h['X-Content-Type-Options'], p).toBe('nosniff')
      for (const k of [
        'Content-Security-Policy',
        'Permissions-Policy',
        'Referrer-Policy',
        'X-Frame-Options',
      ])
        expect(h[k], `${p} ${k}`).toBeUndefined()
    }
    expect(headersFor('/en/')['Cache-Control']).toBeUndefined()
  })

  it('opens the API, the cards and the widget to other origins, and only them', () => {
    for (const p of ['/api/v1/countries.json', '/cards/DEU.png', '/embed/v1/gai.js']) {
      expect(headersFor(p)['Access-Control-Allow-Origin'], p).toBe('*')
    }
    expect(headersFor('/en/')['Access-Control-Allow-Origin']).toBeUndefined()
  })

  it('serves the widget without the page-level headers, revalidated (docs/04 §4)', () => {
    const h = headersFor('/embed/v1/gai.js')
    expect(h['X-Content-Type-Options']).toBe('nosniff')
    expect(h['Cache-Control']).toBeUndefined()
    for (const k of [
      'Content-Security-Policy',
      'Permissions-Policy',
      'Referrer-Policy',
      'X-Frame-Options',
    ])
      expect(h[k], k).toBeUndefined()
  })
})

describe('switchLocalePath', () => {
  it('maps a page to the same page in the other language', () => {
    expect(switchLocalePath('/en/ranking/', 'fr')).toBe('/fr/ranking/')
    expect(switchLocalePath('/fr/', 'en')).toBe('/en/')
    expect(switchLocalePath('/en', 'fr')).toBe('/fr/')
    expect(switchLocalePath('/fr/country/DEU/', 'en')).toBe('/en/country/DEU/')
  })
})
