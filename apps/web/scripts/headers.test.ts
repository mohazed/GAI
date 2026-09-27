import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { switchLocalePath } from '../lib/i18n'
import { parseHeaders } from './serve'

const rules = parseHeaders(
  readFileSync(path.join(import.meta.dirname, '..', 'public', '_headers'), 'utf8'),
)
const headersFor = (p: string) =>
  Object.fromEntries(rules.filter((r) => r.pattern.test(p)).flatMap((r) => r.headers))

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
    expect(csp).not.toMatch(/style-src[^;]*unsafe-inline/)
    expect(h['X-Content-Type-Options']).toBe('nosniff')
    expect(h['Referrer-Policy']).toBe('strict-origin-when-cross-origin')
    expect(h['Permissions-Policy']).toBeDefined()
  })
  it('opens the API, the cards and the widget to other origins, and only them', () => {
    for (const p of ['/api/v1/countries.json', '/cards/DEU.png', '/embed/v1/gai.js']) {
      expect(headersFor(p)['Access-Control-Allow-Origin'], p).toBe('*')
    }
    expect(headersFor('/en/')['Access-Control-Allow-Origin']).toBeUndefined()
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
