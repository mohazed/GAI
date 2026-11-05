/**
 * `pnpm import:sipri <deliveries.csv> --release-date YYYY-MM-DD --source src_…
 * [--orders <trade-register.csv> --orders-source src_…]` (docs/06 §2): the SIPRI TIV table of
 * imports to Israel by supplier becomes sipri_deliveries.csv rows, and the trade register's orders
 * placed with Israel become sipri_orders.csv rows, both with the release date given. Rows of the
 * same release are replaced. Each file must be the archived dataset source it is cited as.
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { isCalendarDate } from '@gai/schema'
import { importDeliveries, importOrders } from '../import/sipri.js'
import { sha256Hex } from '../lib/archive.js'
import { checkFileAgainstSource } from '../lib/dataset.js'
import { readTable, writeTable } from '../lib/files.js'
import { argv, fail, option, REPO_ROOT } from './common.js'

const USAGE =
  'usage: pnpm import:sipri <deliveries.csv> --release-date YYYY-MM-DD --source src_… [--orders <register.csv> --orders-source src_…]'
const file = argv.find((a, i) => !a.startsWith('--') && !argv[i - 1]?.startsWith('--'))
const release = option('--release-date')
const source = option('--source')
const ordersFile = option('--orders')
const ordersSource = option('--orders-source')
if (!file || !release || !source) fail(USAGE)
if (!isCalendarDate(release)) fail(`--release-date expects YYYY-MM-DD, got ${release}`)
if ((ordersFile === undefined) !== (ordersSource === undefined))
  fail('--orders and --orders-source go together')

const read = (f: string, src: string) => {
  const bytes = new Uint8Array(readFileSync(resolve(process.env.INIT_CWD ?? process.cwd(), f)))
  const problems = checkFileAgainstSource(REPO_ROOT, src, bytes, sha256Hex(bytes))
  if (problems.length > 0) fail(`import:sipri refused (${f}):\n  ${problems.join('\n  ')}`, 1)
  return new TextDecoder().decode(bytes)
}

const out: string[] = []
let code = 0
const d = importDeliveries(read(file, source), file, release, source)
if (d.unknownNames.length > 0) {
  fail(
    `import:sipri: supplier names not coded (add them to names.ts): ${d.unknownNames.join('; ')}`,
    1,
  )
}
const keptD = readTable(REPO_ROOT, 'sipri_deliveries.csv').filter((r) => r.release_date !== release)
writeTable(
  REPO_ROOT,
  'sipri_deliveries.csv',
  [...keptD, ...d.rows],
  ['release_date', 'data_year', 'supplier_iso3'],
)
out.push(
  `sipri_deliveries.csv: ${d.rows.length} rows, release ${release}, years ${d.years[0]}–${d.years.at(-1)}`,
)
if (d.summedTotals) out.push('  no Total row in the table: totals are column sums')
for (const [y, v] of d.unknownSupplierTiv)
  if (v > 0) out.push(`  ${y}: ${v} TIV from unknown suppliers (in the total, no row)`)

if (ordersFile && ordersSource) {
  const o = importOrders(read(ordersFile, ordersSource), ordersFile, release, ordersSource)
  if (o.unknownNames.length > 0) {
    out.push(`  recipient names not coded (add them to names.ts): ${o.unknownNames.join('; ')}`)
    code = 1
  }
  const keptO = readTable(REPO_ROOT, 'sipri_orders.csv').filter((r) => r.release_date !== release)
  writeTable(
    REPO_ROOT,
    'sipri_orders.csv',
    [...keptO, ...o.rows],
    ['release_date', 'data_year', 'buyer_iso3'],
  )
  out.push(`sipri_orders.csv: ${o.rows.length} rows, release ${release}`)
  if (o.nonState.length > 0)
    out.push(`  non-state recipients skipped (SIPRI's "*" mark): ${o.nonState.join('; ')}`)
  if (o.outsideUniverse.length > 0)
    out.push(`  recipients outside the universe skipped: ${o.outsideUniverse.join('; ')}`)
  if (o.unknownRecipientOrders.length > 0)
    out.push(
      `  orders of "unknown recipient(s)" skipped (${o.unknownRecipientOrders.length}): ${o.unknownRecipientOrders.join('; ')}`,
    )
  for (const e of o.emptyTivOrders)
    out.push(`  no SIPRI TIV for the total order, counted as a 0-TIV order: ${e}`)
  for (const u of o.uncertainYears) out.push(`  order year marked uncertain by SIPRI: ${u}`)
}
process.stdout.write(`${out.join('\n')}\n`)
process.exitCode = code
