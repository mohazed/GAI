/**
 * `pnpm fetch:fts [--plans 1186,1156,1273,1510]` (docs/06 §2): archives the FTS API v1 flows of
 * the oPt plans and the FTS location list as dataset sources, then writes
 * data/structured/fts_funding.csv and fts_plan_totals.csv from the archived bytes.
 * Needs IA_ACCESS_KEY and IA_SECRET_KEY in .env (Save Page Now, authenticated).
 *
 * `pnpm fetch:fts --rebuild`: captures nothing and needs no key; rewrites the window amounts of
 * fts_funding.csv from the archived responses it cites (SHA-256 checked) under the current
 * methodology's formula d1 `flows_from` (1.0.0-rc.2).
 */

import { FTS_PLAN_IDS } from '../fetch/fts.js'
import { runFetchFts, runRebuildFts } from '../fetch/fts-run.js'
import { realDeps } from '../lib/deps.js'
import { datasetContext, flag, option, REPO_ROOT } from './common.js'

if (flag('--rebuild')) {
  const result = await runRebuildFts(REPO_ROOT, realDeps())
  process.stdout.write(`${result.report.join('\n')}\n`)
  process.exitCode = result.ok ? 0 : 1
} else {
  const ctx = datasetContext('fetch:fts')
  const plans = option('--plans')?.split(',') ?? [...FTS_PLAN_IDS]
  const result = await runFetchFts(ctx, plans)
  process.stdout.write(`${result.report.join('\n')}\n`)
  process.exitCode = result.ok ? 0 : 1
}
