/**
 * `pnpm fetch:fts [--plans 1186,1156,1273,1510]` (docs/06 §2): archives the FTS API v1 flows of
 * the oPt plans and the FTS location list as dataset sources, then writes
 * data/structured/fts_funding.csv and fts_plan_totals.csv from the archived bytes.
 * Needs IA_ACCESS_KEY and IA_SECRET_KEY in .env (Save Page Now, authenticated).
 */

import { FTS_PLAN_IDS } from '../fetch/fts.js'
import { runFetchFts } from '../fetch/fts-run.js'
import { datasetContext, option } from './common.js'

const ctx = datasetContext('fetch:fts')
const plans = option('--plans')?.split(',') ?? [...FTS_PLAN_IDS]
const result = await runFetchFts(ctx, plans)
process.stdout.write(`${result.report.join('\n')}\n`)
process.exitCode = result.ok ? 0 : 1
