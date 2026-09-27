/**
 * A static server for a built site, close enough to Cloudflare Pages for the Playwright tests:
 * serves `<dir>/…/index.html` for directory paths, `404.html` with status 404 for anything
 * missing, and applies the rules of `<dir>/_headers` (every matching rule adds its headers).
 *
 *   tsx scripts/serve.ts [dir=out] [port=4173]
 */
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import path from 'node:path'

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
}

export function parseHeaders(text: string): Rule[] {
  const rules: Rule[] = []
  let current: Rule | null = null
  for (const raw of text.split('\n')) {
    if (raw.trim() === '' || raw.trimStart().startsWith('#')) continue
    if (!/^\s/.test(raw)) {
      const glob = raw.trim()
      const re = `^${glob.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`
      current = { pattern: new RegExp(re), headers: [] }
      rules.push(current)
    } else if (current !== null) {
      const i = raw.indexOf(':')
      current.headers.push([raw.slice(0, i).trim(), raw.slice(i + 1).trim()])
    }
  }
  return rules
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
    // Cloudflare Pages redirects a directory path without its slash.
    if (
      !pathname.endsWith('/') &&
      !path.extname(pathname) &&
      existsSync(path.join(dir, pathname, 'index.html'))
    ) {
      res.writeHead(308, { Location: `${pathname}/` })
      res.end()
      return
    }
    const file = resolve(dir, url)
    const status = file === null ? 404 : 200
    const body = file ?? path.join(dir, '404.html')
    for (const r of rules)
      if (r.pattern.test(pathname)) for (const [k, v] of r.headers) res.setHeader(k, v)
    res.setHeader('Content-Type', TYPES[path.extname(body)] ?? 'application/octet-stream')
    res.writeHead(status)
    createReadStream(body).pipe(res)
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
