/**
 * `pnpm archive:retext <src_id>… [--file PATH] [--dry-run]` (docs/10 B-2169): writes the full
 * text of sources whose archive/text file was cut by the former 200 KB cap, extracted again from
 * the bytes of record (downloaded from the recorded `wayback_url`, or read from `--file` for one
 * id). Refuses unless the bytes have the recorded SHA-256 and byte count and the text already in
 * the file is the start of the new text; never writes the source record or archive/index.csv.
 * Needs no key. Exit codes: 0 every id extended, 1 one or more refused, 2 usage.
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { realDeps } from '../lib/deps.js'
import { retextSource } from '../lib/retext.js'
import { argv, fail, REPO_ROOT } from './common.js'

const USAGE = 'usage: pnpm archive:retext <src_id>… [--file PATH] [--dry-run] [--root DIR]'
const ids: string[] = []
let file: string | undefined
let root = REPO_ROOT
let dryRun = false
for (let i = 0; i < argv.length; i++) {
  const a = argv[i] as string
  const value = () => argv[++i] ?? fail(`${a} needs a value\n${USAGE}`)
  if (a === '--file') file = resolve(process.env.INIT_CWD ?? process.cwd(), value())
  else if (a === '--root') root = resolve(process.env.INIT_CWD ?? process.cwd(), value())
  else if (a === '--dry-run') dryRun = true
  else if (a.startsWith('--')) fail(`unknown option ${a}\n${USAGE}`)
  else ids.push(a)
}
if (ids.length === 0) fail(USAGE)
if (file !== undefined && ids.length !== 1) fail(`--file goes with one id\n${USAGE}`)

let refused = 0
for (const id of ids) {
  const r = await retextSource({
    root,
    id,
    deps: realDeps(),
    dryRun,
    ...(file !== undefined ? { body: new Uint8Array(readFileSync(file)) } : {}),
  })
  if (r.ok) {
    process.stdout.write(
      `${id}: ${r.written ? 'written' : 'would write'} ${r.textFile} (${r.method}): ${r.keptBefore} → ${r.keptAfter} of ${r.total} bytes${r.truncated ? ' (still truncated)' : ' (full text)'}\n`,
    )
  } else {
    refused++
    process.stdout.write(`${id}: refused: ${r.reason}\n`)
  }
}
process.exitCode = refused === 0 ? 0 : 1
