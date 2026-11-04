import { defineConfig, devices } from '@playwright/test'
import { loadSiteMode } from './scripts/site-env'

/**
 * Browser tests of two builds, served with the rules of _headers so the CSP is live:
 * - `score`: the kit build (`pnpm --filter @gai/web build:kit`, out-kit/), built with
 *   NEXT_PUBLIC_SHOW_SCORES=true: the production pages in score mode plus the dev-only /_kit.
 * - `production`: the production build (`pnpm build`, out/), in the mode it was built in, read
 *   from apps/web/.env.production as the build reads it (scripts/site-env.ts; scorecard until the
 *   score flip of P-22, D-16); only the page smoke tests run on it.
 * The specs read the mode of a project from `metadata.mode`, so the flip of the one line in
 * .env.production needs no change here (T-P22 dry run, docs/10 B-866). Both builds must exist
 * before `pnpm test:e2e`.
 */
const PORTS = { score: 4173, production: 4174 } as const
const productionMode = loadSiteMode(import.meta.dirname, false)

export default defineConfig({
  testDir: 'e2e',
  timeout: 60_000,
  fullyParallel: true,
  reporter: process.env.CI ? 'github' : 'list',
  use: { trace: 'retain-on-failure' },
  projects: [
    {
      name: 'score',
      metadata: { mode: 'score' },
      use: { ...devices['Desktop Chrome'], baseURL: `http://localhost:${PORTS.score}` },
    },
    {
      name: 'production',
      metadata: { mode: productionMode },
      testMatch: /(pages|country|compare|changes|info|embed)\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'], baseURL: `http://localhost:${PORTS.production}` },
    },
  ],
  webServer: [
    // One process each (no pnpm/tsx wrapper) so that Playwright can stop it when the run ends.
    {
      command: `node --import tsx scripts/serve.ts out-kit ${PORTS.score}`,
      port: PORTS.score,
      gracefulShutdown: { signal: 'SIGTERM', timeout: 2000 },
      reuseExistingServer: !process.env.CI,
    },
    {
      command: `node --import tsx scripts/serve.ts out ${PORTS.production}`,
      port: PORTS.production,
      gracefulShutdown: { signal: 'SIGTERM', timeout: 2000 },
      reuseExistingServer: !process.env.CI,
    },
  ],
})
