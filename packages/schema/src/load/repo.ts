/**
 * Locating the repository root, for the CLIs (`pnpm validate`, `pnpm methodology:render`) and
 * for later scripts (`pnpm score`, `pnpm build:data`) that read data/ and methodology/.
 */
import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

/** The nearest directory at or above `start` holding pnpm-workspace.yaml; throws if none. */
export function findRepoRoot(start: string): string {
  let dir = resolve(start)
  for (;;) {
    if (existsSync(join(dir, 'pnpm-workspace.yaml'))) return dir
    const parent = dirname(dir)
    if (parent === dir) throw new Error('repository root (pnpm-workspace.yaml) not found')
    dir = parent
  }
}
