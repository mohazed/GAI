/**
 * JavaScript weight per page (docs/04 §3, docs/10 B-79): at most 150 KB gzipped in total, of
 * which application code at most 25 KB. "Framework" is what Next.js loads on every page before
 * any of ours: the `rootMainFiles` and `polyfillFiles` of .next/build-manifest.json (webpack
 * runtime, React DOM, the Next.js client, main-app). Everything else a page loads is application
 * code: its page and layout chunks and the shared chunks they pull in (next-intl included).
 * `noModule` scripts are left out: modern browsers never download them. Sizes are gzip at the
 * default level of zlib, as a CDN would serve them.
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { gzipSync } from 'node:zlib'

export const BUDGET = { totalKb: 150, appKb: 25 } as const

export interface PageWeight {
  page: string
  frameworkBytes: number
  appBytes: number
  totalBytes: number
  scripts: { src: string; bytes: number; framework: boolean }[]
}

/** The `src` of each external script of a page that a module-supporting browser loads. */
export function pageScripts(html: string): string[] {
  const out: string[] = []
  for (const m of html.matchAll(/<script\b([^>]*)>/gi)) {
    const attrs = m[1] ?? ''
    if (/\bnomodule\b/i.test(attrs)) continue
    const src = /\bsrc="([^"]+)"/i.exec(attrs)?.[1]
    if (src !== undefined) out.push(src)
  }
  return out
}

/** Framework chunk paths (`/_next/static/chunks/…`) from the build manifest. */
export function frameworkChunks(manifest: {
  rootMainFiles: string[]
  polyfillFiles: string[]
}): Set<string> {
  return new Set([...manifest.rootMainFiles, ...manifest.polyfillFiles].map((f) => `/_next/${f}`))
}

export function measurePage(
  outDir: string,
  page: string,
  framework: Set<string>,
  gzCache = new Map<string, number>(),
): PageWeight {
  const html = readFileSync(path.join(outDir, page), 'utf8')
  const scripts = [...new Set(pageScripts(html))].map((src) => {
    const file = decodeURIComponent(src.split('?')[0] ?? src)
    let bytes = gzCache.get(file)
    if (bytes === undefined) {
      bytes = gzipSync(readFileSync(path.join(outDir, file))).length
      gzCache.set(file, bytes)
    }
    return { src: file, bytes, framework: framework.has(file) }
  })
  const frameworkBytes = scripts.filter((s) => s.framework).reduce((a, s) => a + s.bytes, 0)
  const appBytes = scripts.filter((s) => !s.framework).reduce((a, s) => a + s.bytes, 0)
  return { page, frameworkBytes, appBytes, totalBytes: frameworkBytes + appBytes, scripts }
}

/** Budget problems of the measured pages, one line each; empty when every page is within. */
export function budgetProblems(pages: readonly PageWeight[]): string[] {
  const kb = (b: number) => (b / 1024).toFixed(1)
  const out: string[] = []
  for (const p of pages) {
    if (p.totalBytes > BUDGET.totalKb * 1024)
      out.push(`${p.page}: ${kb(p.totalBytes)} KB of JavaScript (budget ${BUDGET.totalKb} KB)`)
    if (p.appBytes > BUDGET.appKb * 1024)
      out.push(`${p.page}: ${kb(p.appBytes)} KB of application code (budget ${BUDGET.appKb} KB)`)
  }
  return out
}

export function formatWeights(pages: readonly PageWeight[]): string {
  const kb = (b: number) => (b / 1024).toFixed(1).padStart(6)
  return [
    'page                                     framework     app   total  (KB gzip)',
    ...pages.map(
      (p) => `${p.page.padEnd(40)} ${kb(p.frameworkBytes)}  ${kb(p.appBytes)}  ${kb(p.totalBytes)}`,
    ),
  ].join('\n')
}
