/**
 * Per-page Content-Security-Policy (docs/04 §3). Next.js writes inline <script> elements into
 * every page (its RSC payload); the root page adds the language redirect; the stylesheet is
 * inlined as one <style> element (`experimental.inlineCss`, docs/10 B-102: it saves the round
 * trip of a render-blocking request). Each HTML file gets a <meta http-equiv=
 * "Content-Security-Policy"> that allows scripts and styles from the site's origin and, of the
 * inline ones, exactly those it contains, by SHA-256. Style attributes stay refused (the build
 * fails on one, and a hash-source never allows them). See public/_headers.
 */
import { createHash } from 'node:crypto'

const INLINE_SCRIPT = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi
const INLINE_STYLE = /<style\b[^>]*>([\s\S]*?)<\/style>/gi
const META_MARK = 'data-gai-csp'

export function inlineScripts(html: string): string[] {
  const out: string[] = []
  for (const m of html.matchAll(INLINE_SCRIPT)) {
    const attrs = m[1] ?? ''
    if (/\bsrc\s*=/.test(attrs)) continue
    out.push(m[2] ?? '')
  }
  return out
}

export function inlineStyles(html: string): string[] {
  return [...html.matchAll(INLINE_STYLE)].map((m) => m[1] ?? '')
}

export function sha256Source(text: string): string {
  return `'sha256-${createHash('sha256').update(text, 'utf8').digest('base64')}'`
}

export function pagePolicy(html: string): string {
  const hashes = [...new Set(inlineScripts(html).map(sha256Source))].sort()
  const styles = [...new Set(inlineStyles(html).map(sha256Source))].sort()
  return [
    "default-src 'self'",
    ['script-src', "'self'", ...hashes].join(' '),
    ['style-src', "'self'", ...styles].join(' '),
    "img-src 'self'",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ')
}

/**
 * The page with its CSP meta as the first element after <meta charset>, before any script.
 * Idempotent: an existing meta written by this function is replaced.
 */
export function withPolicy(html: string): string {
  const clean = html.replace(new RegExp(`<meta ${META_MARK}[^>]*>`, 'g'), '')
  const meta = `<meta ${META_MARK} http-equiv="Content-Security-Policy" content="${pagePolicy(clean)}"/>`
  const charset = /<meta charSet="utf-8"\/>|<meta charset="utf-8"\s*\/?>/i.exec(clean)
  if (charset !== null) {
    const at = charset.index + charset[0].length
    return clean.slice(0, at) + meta + clean.slice(at)
  }
  const head = /<head[^>]*>/i.exec(clean)
  if (head === null) throw new Error('no <head> in page')
  const at = head.index + head[0].length
  return clean.slice(0, at) + meta + clean.slice(at)
}

/** Offences against the policy that the build must refuse (style attributes, inline code before the meta). */
export function policyProblems(html: string): string[] {
  const problems: string[] = []
  if (/<[a-z][^>]*\sstyle="/i.test(html))
    problems.push("an inline style attribute (style-src 'self')")
  const meta = html.indexOf(META_MARK)
  const firstStyle = html.search(/<style\b/i)
  if (meta >= 0 && firstStyle >= 0 && firstStyle < meta)
    problems.push('a <style> before the CSP meta')
  const firstScript = html.search(/<script\b/i)
  if (meta < 0) problems.push('no CSP meta')
  else if (firstScript >= 0 && firstScript < meta) problems.push('a script before the CSP meta')
  return problems
}
