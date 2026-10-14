/**
 * `pnpm archive <url> [--kind official|court|dataset|ngo|press|parliamentary|official-video]
 * [--id src_…] [--root DIR]` (docs/06 §6). Saves the URL with authenticated Save Page Now, hashes
 * the snapshot, writes archive/text/{id}.txt and a row of archive/index.csv, and prints a source
 * record to paste into data/sources/{YYYY}/{id}.yaml.
 *
 * `--capture TS` records the existing Wayback capture TS of the URL instead of saving it anew (a
 * file whose origin now answers Save Page Now with a bot challenge); the bytes are downloaded from
 * that capture and hashed as usual.
 *
 * Needs IA_ACCESS_KEY and IA_SECRET_KEY in .env; the anonymous endpoint is never called.
 * Exit codes: 0 archived, 1 capture failed (a skeleton with wayback_url: null is printed), 2 usage.
 */
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { findRepoRoot, SOURCE_KINDS, type SourceKind } from '@gai/schema'
import { archiveUrl, skeletonChecks } from '../lib/archive.js'
import { realDeps } from '../lib/deps.js'
import { loadEnv } from '../lib/env.js'
import { sourcePath, sourceYaml } from '../lib/files.js'

const USAGE = `usage: pnpm archive <url> [--kind ${SOURCE_KINDS.join('|')}] [--id src_…] [--root DIR] [--capture YYYYMMDDhhmmss]`

function fail(message: string, code = 2): never {
  process.stderr.write(`${message}\n`)
  process.exit(code)
}

const repo = findRepoRoot(dirname(fileURLToPath(import.meta.url)))
const argv = process.argv.slice(2).filter((a) => a !== '--')
let url: string | undefined
let kind: SourceKind | undefined
let id: string | undefined
let capture: string | undefined
let root = repo
for (let i = 0; i < argv.length; i++) {
  const a = argv[i] as string
  const value = () => argv[++i] ?? fail(`${a} needs a value\n${USAGE}`)
  if (a === '--kind') {
    const k = value()
    if (!(SOURCE_KINDS as readonly string[]).includes(k))
      fail(`--kind must be one of ${SOURCE_KINDS.join(', ')}`)
    kind = k as SourceKind
  } else if (a === '--id') id = value()
  else if (a === '--capture') {
    capture = value()
    if (!/^\d{14}$/.test(capture)) fail('--capture expects a 14-digit Wayback timestamp')
  } else if (a === '--root') root = resolve(process.env.INIT_CWD ?? process.cwd(), value())
  else if (a.startsWith('--')) fail(`unknown option ${a}\n${USAGE}`)
  else if (url === undefined) url = a
  else fail(`one URL at a time\n${USAGE}`)
}
if (url === undefined) fail(USAGE)
try {
  const u = new URL(url)
  if (u.protocol !== 'http:' && u.protocol !== 'https:') throw new Error()
} catch {
  fail(`not an http(s) URL: ${url}`)
}

const env = loadEnv(repo)
const creds = { access: env.IA_ACCESS_KEY ?? '', secret: env.IA_SECRET_KEY ?? '' }
if (!creds.access || !creds.secret) {
  fail(
    'IA_ACCESS_KEY and IA_SECRET_KEY must be set in .env (docs/06 §6); the anonymous Save Page Now endpoint is never used',
    2,
  )
}

const doc = await archiveUrl({
  url,
  root,
  creds,
  deps: realDeps(),
  ...(id ? { id } : {}),
  ...(kind ? { kind } : {}),
  // A recorded capture may be a large file: allow 15 minutes for its download.
  ...(capture ? { capture, spn: { requestTimeoutMs: 900_000 } } : {}),
})
const checks = skeletonChecks(doc, kind !== undefined)
const header = [
  `# ${sourcePath(doc.source.id)}`,
  doc.ok
    ? `# archived: ${doc.source.wayback_url} · sha256 ${doc.source.sha256} · ${doc.source.bytes} bytes · text by ${doc.extracted.method}${doc.truncated ? ' (truncated at 200 KB)' : ''}`
    : `# NOT ARCHIVED: ${doc.reason}. This source cannot support an event until archived (docs/06 §6).`,
  `# check before filing: ${checks.join(', ')}`,
]
process.stdout.write(`${header.join('\n')}\n${sourceYaml(doc.source)}`)
process.exitCode = doc.ok ? 0 : 1
