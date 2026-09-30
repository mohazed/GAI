/**
 * `pnpm check:wayback [--report FILE] [--limit N]` — requests every recorded `wayback_url` of
 * archive/index.csv with curl (`--compressed`, no redirect followed), recomputes the SHA-256 of
 * each 200 body and compares it with the record (../wayback-check.ts). Writes the Markdown report
 * to FILE (default: stdout) and exits 1 when a URL did not answer 200 or a hash differs, 0
 * otherwise, 2 on a usage or loading error. The quarterly workflow (.github/workflows/wayback.yml)
 * opens or updates an issue with the report. Needs no key.
 */
import { execFile } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { loadDataset } from '@gai/schema'
import { checkWayback, type Fetched, hasProblems, waybackReport } from '../wayback-check.js'
import { fail, option, REPO_ROOT } from './common.js'

const USER_AGENT = 'gaza-accountability-index wayback check (+https://github.com/mohazed/GAI)'

function curl(url: string, dir: string): Promise<Fetched> {
  const body = join(dir, 'body')
  rmSync(body, { force: true })
  return new Promise((resolve) => {
    execFile(
      'curl',
      [
        '--compressed',
        '--silent',
        '--show-error',
        '--max-time',
        '180',
        '--user-agent',
        USER_AGENT,
        '--output',
        body,
        '--write-out',
        '%{http_code} %{redirect_url}',
        // HTTPS only, a size limit, and the URL as an option's value, never a bare argument
        // that curl could read as an option (P-19).
        '--proto',
        '=https',
        '--max-filesize',
        String(512 * 1024 * 1024),
        '--url',
        url,
      ],
      { maxBuffer: 1024 * 1024 },
      (err, stdout, stderr) => {
        const [code = '0', ...rest] = stdout.trim().split(' ')
        const status = Number(code) || 0
        const redirect = rest.join(' ').trim()
        if (status === 200) {
          // curl writes no file for an empty body: hash the empty body instead of failing the run.
          const bytes = existsSync(body) ? readFileSync(body) : Buffer.alloc(0)
          const sha256 = createHash('sha256').update(bytes).digest('hex')
          resolve({ status, sha256, detail: null })
        } else {
          const detail =
            redirect !== '' ? `→ ${redirect}` : err ? stderr.trim() || err.message : null
          resolve({ status, sha256: null, detail })
        }
      },
    )
  })
}

const limit = option('--limit')
const report = option('--report')
if (limit !== undefined && !/^[1-9]\d*$/.test(limit)) fail('--limit expects a positive integer')

const ds = loadDataset(REPO_ROOT)
const bad = ds.issues.filter((i) => i.file === 'archive/index.csv')
if (bad.length > 0) fail(`archive/index.csv has ${bad.length} issue(s); run pnpm validate`)
const rows = ds.archiveIndex.map((r) => r.value)
const dir = mkdtempSync(join(tmpdir(), 'gai-wayback-'))
try {
  const result = await checkWayback(limit === undefined ? rows : rows.slice(0, Number(limit)), {
    fetch: (url) => curl(url, dir),
    sleep: (ms) => new Promise((r) => setTimeout(r, ms)),
    log: (line) => process.stderr.write(`${line}\n`),
  })
  const text = waybackReport(result, new Date().toISOString().slice(0, 10))
  if (report === undefined) process.stdout.write(text)
  else writeFileSync(report, text)
  process.exitCode = hasProblems(result) ? 1 : 0
} finally {
  rmSync(dir, { recursive: true, force: true })
}
