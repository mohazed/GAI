/**
 * `pnpm import:unvotes <file> --source src_…` (docs/06 §2): reads the UN Digital Library voting
 * CSV (bulk) or a MARCXML voting record, keeps the qualifying votes of votes.yaml, and replaces
 * their rows in data/structured/unga_votes.csv. The file must be the archived dataset source it
 * is cited as (same sha256). Reports qualifying votes absent from the file, members missing from
 * a vote, and dates or totals that differ from votes.yaml.
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { listMethodologyVersions, loadMethodology } from '@gai/schema'
import { parseVotesFile, votesImport } from '../import/unvotes.js'
import { sha256Hex } from '../lib/archive.js'
import { checkFileAgainstSource } from '../lib/dataset.js'
import { mergeRows, readTable, writeTable } from '../lib/files.js'
import { UN_MEMBER_ISO3, UNIVERSE_ISO3 } from '../universe.js'
import { argv, fail, option, REPO_ROOT } from './common.js'

const USAGE = 'usage: pnpm import:unvotes <file.csv|file.xml> --source src_… [--methodology vX.Y.Z]'
const file = argv.find((a, i) => !a.startsWith('--') && !argv[i - 1]?.startsWith('--'))
const source = option('--source')
if (!file || !source) fail(USAGE)
const path = resolve(process.env.INIT_CWD ?? process.cwd(), file)
const bytes = new Uint8Array(readFileSync(path))
const problems = checkFileAgainstSource(REPO_ROOT, source, bytes, sha256Hex(bytes))
if (problems.length > 0) fail(`import:unvotes refused:\n  ${problems.join('\n  ')}`, 1)

const folder = option('--methodology') ?? listMethodologyVersions(REPO_ROOT).at(-1)
const m = loadMethodology(REPO_ROOT, folder)
const qualifying = m.votes?.value.votes ?? []
if (qualifying.length === 0)
  fail(`votes.yaml of ${folder} lists no qualifying vote; nothing to import`, 1)

const parsed = parseVotesFile(new TextDecoder().decode(bytes), path)
const r = votesImport(parsed, qualifying, UN_MEMBER_ISO3, UNIVERSE_ISO3, source)
const imported = new Set(r.rows.map((x) => x.resolution))
const kept = readTable(REPO_ROOT, 'unga_votes.csv').filter((x) => !imported.has(x.resolution ?? ''))
writeTable(REPO_ROOT, 'unga_votes.csv', mergeRows(kept, r.rows, ['resolution', 'iso3']), [
  'date',
  'resolution',
  'iso3',
])

const out = [
  `import:unvotes: ${r.rows.length} rows for ${imported.size} qualifying vote(s) from ${file}`,
]
if (r.absentSymbols.length > 0)
  out.push(`  qualifying votes not in the file: ${r.absentSymbols.join(', ')}`)
for (const [s, missing] of r.missingMembers)
  out.push(`  ${s}: ${missing.length} member(s) with no row: ${missing.join(', ')}`)
for (const d of r.dateMismatches) out.push(`  date differs: ${d}`)
for (const c of r.countMismatches) out.push(`  totals differ: ${c}`)
if (r.unknownCodes.length > 0)
  out.push(`  codes outside the universe, dropped: ${r.unknownCodes.join(', ')}`)
if (parsed.unknownNames.length > 0)
  out.push(`  member names not coded (add them to names.ts): ${parsed.unknownNames.join('; ')}`)
process.stdout.write(`${out.join('\n')}\n`)
process.exitCode = parsed.unknownNames.length > 0 ? 1 : 0
