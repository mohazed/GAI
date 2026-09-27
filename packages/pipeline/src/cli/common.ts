/** Shared set-up of the network CLIs: repository root, credentials from .env, options. */
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { findRepoRoot } from '@gai/schema'
import type { DatasetContext } from '../lib/dataset.js'
import { realDeps } from '../lib/deps.js'
import { loadEnv } from '../lib/env.js'

export const REPO_ROOT = findRepoRoot(dirname(fileURLToPath(import.meta.url)))

export const argv = process.argv.slice(2).filter((a) => a !== '--')

export function fail(message: string, code = 2): never {
  process.stderr.write(`${message}\n`)
  process.exit(code)
}

/** The value after `name`, or undefined when the option is absent. */
export function option(name: string): string | undefined {
  const i = argv.indexOf(name)
  if (i === -1) return undefined
  const v = argv[i + 1]
  if (v === undefined || v.startsWith('--')) fail(`${name} needs a value`)
  return v
}

export const flag = (name: string): boolean => argv.includes(name)

export function env(): Record<string, string> {
  return loadEnv(REPO_ROOT)
}

/** Archiving context with the Save Page Now keys; exits when they are missing. */
export function datasetContext(command: string): DatasetContext {
  const e = env()
  const creds = { access: e.IA_ACCESS_KEY ?? '', secret: e.IA_SECRET_KEY ?? '' }
  if (!creds.access || !creds.secret) {
    fail(
      `${command} archives every response with authenticated Save Page Now: set IA_ACCESS_KEY and IA_SECRET_KEY in .env`,
    )
  }
  return { root: REPO_ROOT, creds, deps: realDeps() }
}
