/**
 * The mode of the site being built, for the scripts that run before Next.js (`cards.ts`,
 * `embed.ts`). They are started by `tsx`, which reads no environment file, while `next build`
 * reads `.env.production` (and `next dev` `.env.development`), then `.env.local` and `.env`, a
 * variable already in the process environment winning. Without this, flipping the gate in
 * `apps/web/.env.production` (D-16) would give score-mode pages with scorecard share cards and a
 * scorecard widget (P-12, docs/10 B-163). Called from the scripts' `main`, never on import, so
 * tests that import the scripts read no file.
 */
import path from 'node:path'
import nextEnv from '@next/env'
import type { Mode } from '../lib/mode'

const web = path.resolve(import.meta.dirname, '..')

/** Loads apps/web's environment files as Next.js does and returns the mode they set. */
export function loadSiteMode(
  dir: string = web,
  dev: boolean = process.env.npm_lifecycle_event === 'dev',
): Mode {
  // forceReload: a process that already loaded an env (a test, or a parent that exported
  // __NEXT_PROCESSED_ENV) would otherwise skip the files.
  nextEnv.loadEnvConfig(
    dir,
    dev,
    { info: () => {}, error: (...a: unknown[]) => console.error(...a) },
    true,
  )
  return process.env.NEXT_PUBLIC_SHOW_SCORES === 'true' ? 'score' : 'scorecard'
}
