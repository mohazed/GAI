/**
 * `pnpm fetch:comtrade --reporters DEU,FRA [--latest-year 2025] [--force] [--max-calls 500]`
 * (docs/06 §2): archives the Comtrade preview responses of each reporter with Israel (self and
 * mirror, annual HS, 2022 to the latest year), cross-checks them with the keyed API, and replaces
 * the reporters' rows in comtrade_a2.csv and comtrade_c3.csv. Needs COMTRADE_KEY, IA_ACCESS_KEY
 * and IA_SECRET_KEY in .env. Keyed calls are counted per UTC day in .cache/comtrade-state.json;
 * reporters already done are skipped, so the same command resumes an interrupted run.
 */
import { runFetchComtrade } from '../fetch/comtrade-run.js'
import { datasetContext, env, fail, flag, option } from './common.js'

const reporters = option('--reporters')?.toUpperCase().split(',').filter(Boolean)
if (!reporters || reporters.length === 0 || reporters.some((r) => !/^[A-Z]{3}$/.test(r))) {
  fail(
    'usage: pnpm fetch:comtrade --reporters DEU,FRA [--latest-year YYYY] [--force] [--max-calls N]',
  )
}
const key = env().COMTRADE_KEY ?? ''
if (key === '') fail('COMTRADE_KEY must be set in .env')
const ctx = datasetContext('fetch:comtrade')
const latestYear = Number(option('--latest-year') ?? ctx.deps.now().getUTCFullYear() - 1)
const maxCalls = Number(option('--max-calls') ?? 500)
if (!Number.isInteger(latestYear) || latestYear < 2022) fail('--latest-year must be a year ≥ 2022')
if (!Number.isInteger(maxCalls) || maxCalls < 0 || maxCalls > 500) fail('--max-calls must be 0…500')
const result = await runFetchComtrade(ctx, {
  reporters,
  key,
  latestYear,
  force: flag('--force'),
  limit: maxCalls,
})
process.stdout.write(`${result.report.join('\n')}\n`)
process.exitCode = result.ok ? 0 : 1
