/**
 * Builds the fixtures API that the dev-only component kit (/_kit) reads: `pnpm build:data` on
 * fixtures/ with a fixed build date, written to apps/web/.kit/api/v1 (git-ignored, never
 * deployed). The fixtures are test data (fixtures/README.md).
 */
import { spawnSync } from 'node:child_process'
import path from 'node:path'

export const KIT_DATE = '2026-09-27'

const root = path.resolve(import.meta.dirname, '..', '..', '..')
const out = path.resolve(import.meta.dirname, '..', '.kit', 'api', 'v1')
const run = spawnSync(
  'pnpm',
  [
    'build:data',
    '--root',
    'fixtures',
    '--date',
    KIT_DATE,
    '--out',
    out,
    '--site-url',
    'https://gaza-accountability-index.pages.dev',
  ],
  { cwd: root, stdio: 'inherit' },
)
process.exit(run.status ?? 1)
