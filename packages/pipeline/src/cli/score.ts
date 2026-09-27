/**
 * Entry point of `pnpm score` (see ../score-cli.ts). The only clock read of the command: today's
 * UTC date, used when --date is absent.
 *
 * The repository is found from this file's location, so the command works from any directory.
 * `--root` resolves against the directory the command was typed in: pnpm's INIT_CWD when pnpm
 * runs the `score` script (it moves the working directory to the repository root), else the
 * working directory; an INIT_CWD inherited from another pnpm or npm process is ignored.
 */
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { runScore } from '../score-cli.js'

const today = new Date().toISOString().slice(0, 10)
const underPnpmScript = process.env.npm_lifecycle_event === 'score'
const invocationDir = (underPnpmScript ? process.env.INIT_CWD : undefined) ?? process.cwd()
const result = runScore(process.argv.slice(2), {
  cwd: dirname(fileURLToPath(import.meta.url)),
  invocationDir,
  today,
})
process.stdout.write(result.stdout)
process.stderr.write(result.stderr)
process.exitCode = result.code
