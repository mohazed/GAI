import { createHash } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { inlineScripts, inlineStyles, pagePolicy, policyProblems, withPolicy } from './csp'

const page = (body: string) =>
  `<!DOCTYPE html><html><head><meta charSet="utf-8"/><script src="/_next/a.js" async=""></script></head><body>${body}</body></html>`

describe('per-page CSP', () => {
  it('hashes inline scripts only', () => {
    const html = page('<script>self.__next_f.push([1,"x"])</script>')
    expect(inlineScripts(html)).toEqual(['self.__next_f.push([1,"x"])'])
    const h = createHash('sha256').update('self.__next_f.push([1,"x"])').digest('base64')
    expect(pagePolicy(html)).toContain(`script-src 'self' 'sha256-${h}'`)
  })
  it('puts the meta before every script and is idempotent', () => {
    const once = withPolicy(page('<script>a()</script>'))
    expect(once.indexOf('Content-Security-Policy')).toBeLessThan(once.indexOf('<script'))
    expect(withPolicy(once)).toBe(once)
    expect(policyProblems(once)).toEqual([])
  })
  it('refuses inline styles and pages without the meta', () => {
    expect(policyProblems(page('<p style="color:red">x</p>'))).toContain('no CSP meta')
    expect(policyProblems(withPolicy(page('<p style="color:red">x</p>')))).toEqual([
      "an inline style attribute (style-src 'self')",
    ])
  })
  it('hashes the inlined stylesheet into style-src, and nothing else', () => {
    const css = '.a{color:#15161a}'
    const html = page(`<style data-precedence="next">${css}</style>`)
    expect(inlineStyles(html)).toEqual([css])
    const h = createHash('sha256').update(css).digest('base64')
    const policy = pagePolicy(html)
    expect(policy).toContain(`style-src 'self' 'sha256-${h}';`)
    expect(policy).not.toContain('unsafe-inline')
    expect(pagePolicy(page('<p>x</p>'))).toContain("style-src 'self';")
    const once = withPolicy(html)
    expect(policyProblems(once)).toEqual([])
    expect(once.indexOf('Content-Security-Policy')).toBeLessThan(once.indexOf('<style'))
  })
})
