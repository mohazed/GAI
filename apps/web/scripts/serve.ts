/**
 * A static server for a built site, close enough to Cloudflare Pages for the Playwright tests:
 * serves `<dir>/…/index.html` for directory paths, `404.html` with status 404 for anything
 * missing, applies the rules of `<dir>/_headers` (every matching rule adds its headers), and
 * gzips text responses for clients that accept it, as the CDN does (Lighthouse measures the
 * transferred bytes against the budget of docs/04 §3).
 *
 *   tsx scripts/serve.ts [dir=out] [port=4173]
 */
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import path from 'node:path'
import { createGzip } from 'node:zlib'

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
}

interface Rule {
  pattern: RegExp
  headers: [string, string][]
  /** `! Name` lines: headers an earlier rule set that this path must not carry (Cloudflare). */
  detach: string[]
}

export function parseHeaders(text: string): Rule[] {
  const rules: Rule[] = []
  let current: Rule | null = null
  for (const raw of text.split('\n')) {
    if (raw.trim() === '' || raw.trimStart().startsWith('#')) continue
    if (!/^\s/.test(raw)) {
      const glob = raw.trim()
      const re = `^${glob.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`
      current = { pattern: new RegExp(re), headers: [], detach: [] }
      rules.push(current)
    } else if (current !== null) {
      const line = raw.trim()
      if (line.startsWith('!')) {
        current.detach.push(line.slice(1).trim().toLowerCase())
        continue
      }
      const i = line.indexOf(':')
      current.headers.push([line.slice(0, i).trim(), line.slice(i + 1).trim()])
    }
  }
  return rules
}

/** The headers of a path: every matching rule adds its own, then detached ones are removed. */
export function headersFor(rules: readonly Rule[], pathname: string): Record<string, string> {
  const matching = rules.filter((r) => r.pattern.test(pathname))
  const detached = new Set(matching.flatMap((r) => r.detach))
  const out: Record<string, string> = {}
  for (const r of matching)
    for (const [k, v] of r.headers) if (!detached.has(k.toLowerCase())) out[k] = v
  return out
}

function resolve(dir: string, urlPath: string): string | null {
  let clean: string
  try {
    clean = decodeURIComponent(urlPath.split('?')[0] ?? '/')
  } catch {
    return null
  }
  const full = path.join(dir, clean)
  if (full !== dir && !full.startsWith(dir + path.sep)) return null
  if (existsSync(full) && statSync(full).isFile()) return full
  const index = path.join(full, 'index.html')
  if (existsSync(index)) return index
  if (existsSync(`${full}.html`)) return `${full}.html`
  return null
}

export function serve(dir: string, port: number): void {
  const headersFile = path.join(dir, '_headers')
  const rules = existsSync(headersFile) ? parseHeaders(readFileSync(headersFile, 'utf8')) : []
  createServer((req, res) => {
    const url = req.url ?? '/'
    const pathname = url.split('?')[0] ?? '/'
    // Cloudflare Pages redirects a directory path without its slash, keeping the query (the
    // dated permalinks are `/en/country/DEU?date=…`).
    if (
      !pathname.endsWith('/') &&
      !path.extname(pathname) &&
      existsSync(path.join(dir, pathname, 'index.html'))
    ) {
      res.writeHead(308, { Location: `${pathname}/${url.slice(pathname.length)}` })
      res.end()
      return
    }
    const file = resolve(dir, url)
    const status = file === null ? 404 : 200
    const body = file ?? path.join(dir, '404.html')
    for (const [k, v] of Object.entries(headersFor(rules, pathname))) res.setHeader(k, v)
    const type = TYPES[path.extname(body)] ?? 'application/octet-stream'
    res.setHeader('Content-Type', type)
    const gzip =
      /^(text\/|application\/json|image\/svg)/.test(type) &&
      /\bgzip\b/.test(String(req.headers['accept-encoding'] ?? ''))
    if (gzip) {
      res.setHeader('Content-Encoding', 'gzip')
      res.setHeader('Vary', 'Accept-Encoding')
    }
    res.writeHead(status)
    const stream = createReadStream(body)
    if (gzip) stream.pipe(createGzip()).pipe(res)
    else stream.pipe(res)
  }).listen(port, () => {
    console.log(`serving ${path.relative(process.cwd(), dir)}/ on http://localhost:${port}`)
  })
}

if (
  process.argv[1] !== undefined &&
  path.resolve(process.argv[1]) === path.resolve(import.meta.filename)
) {
  serve(
    path.resolve(import.meta.dirname, '..', process.argv[2] ?? 'out'),
    Number(process.argv[3] ?? 4173),
  )
}
