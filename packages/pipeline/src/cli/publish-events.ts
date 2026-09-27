/**
 * Entry point of `pnpm publish:events --pr N` (see ../publish-events.ts). It supplies what the
 * command reads from outside: `gh` and `git` run in the repository root, the files of the
 * working tree (repository-relative, regular files only, strict UTF-8), and the only clock read
 * of the command: today's date in the local time zone (localIsoDate), the default and latest
 * review date. It is the author's calendar day, the one data sessions write in
 * `review.drafted_at` and `review.second_read.at`, so the three review dates share one calendar:
 * a review at 00:30 in Paris is dated that day, not the previous UTC day.
 *
 * The repository is found from this file's location, so the command works from any directory.
 */
import { isUtf8 } from 'node:buffer'
import { spawnSync } from 'node:child_process'
import { lstatSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { findRepoRoot } from '@gai/schema'
import { type CommandRunner, localIsoDate, runPublishEvents } from '../publish-events.js'

const REPO_ROOT = findRepoRoot(dirname(fileURLToPath(import.meta.url)))

const runner =
  (command: string): CommandRunner =>
  (args) => {
    const r = spawnSync(command, args, {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    if (r.error) return { code: 127, stdout: '', stderr: `${command}: ${r.error.message}` }
    return { code: r.status ?? 1, stdout: r.stdout, stderr: r.stderr }
  }

function readFile(path: string): string | null {
  const abs = join(REPO_ROOT, path)
  try {
    if (!lstatSync(abs).isFile()) return null
  } catch {
    return null
  }
  const bytes = readFileSync(abs)
  if (!isUtf8(bytes))
    throw new Error('not valid UTF-8; save the file as UTF-8 and run pnpm validate')
  return bytes.toString('utf8')
}

const result = runPublishEvents(process.argv.slice(2), {
  today: localIsoDate(new Date()),
  gh: runner('gh'),
  git: runner('git'),
  readFile,
  writeFile: (path, text) => writeFileSync(join(REPO_ROOT, path), text, 'utf8'),
})
process.stdout.write(result.stdout)
process.stderr.write(result.stderr)
process.exitCode = result.code
