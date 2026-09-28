/**
 * Entry point of `pnpm build:data` (see ../build-cli.ts). The only clock reads of the command:
 * today's UTC date, used when --date is absent and as its upper bound, and the elapsed time printed
 * after the summary (stdout only, never into a file: D-25).
 *
 * The repository is found from this file's location, so the command works from any directory.
 * `--out` and `--root` resolve against the directory the command was typed in: pnpm's INIT_CWD
 * when pnpm runs the `build:data` script (it moves the working directory to the repository root),
 * else the working directory; an INIT_CWD inherited from another pnpm or npm process is ignored.
 *
 * NEXT_PUBLIC_SITE_URL is read from the process environment, then from the repository's .env (the
 * site reads the same variable, .env.example); no other variable of .env is passed on.
 * GAI_BUILD_DATE, the default --date, is read from the process environment only: the deploy
 * workflows set it so that `pnpm build` builds for the run day (P-12).
 */
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { findRepoRoot } from '@gai/schema'
import { runBuildData } from '../build-cli.js'
import { loadEnv } from '../lib/env.js'

const started = performance.now()
const today = new Date().toISOString().slice(0, 10)
const here = dirname(fileURLToPath(import.meta.url))
const underPnpmScript = process.env.npm_lifecycle_event === 'build:data'
const invocationDir = (underPnpmScript ? process.env.INIT_CWD : undefined) ?? process.cwd()
const result = runBuildData(process.argv.slice(2), {
  cwd: here,
  invocationDir,
  today,
  env: {
    NEXT_PUBLIC_SITE_URL: loadEnv(findRepoRoot(here)).NEXT_PUBLIC_SITE_URL,
    GAI_BUILD_DATE: process.env.GAI_BUILD_DATE,
  },
})
process.stdout.write(result.stdout)
if (result.code === 0 && result.stdout !== '') {
  process.stdout.write(`done in ${((performance.now() - started) / 1000).toFixed(1)} s\n`)
}
process.stderr.write(result.stderr)
process.exitCode = result.code
