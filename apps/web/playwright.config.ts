import { defineConfig, devices } from '@playwright/test'

/**
 * Browser tests of two builds, served with the rules of _headers so the CSP is live:
 * - `score`: the kit build (`pnpm --filter @gai/web build:kit`, out-kit/), built with
 *   NEXT_PUBLIC_SHOW_SCORES=true: the production pages in score mode plus the dev-only /_kit.
 * - `scorecard`: the production build (`pnpm build`, out/), in scorecard mode as deployed (D-16);
 *   only the page smoke tests run on it.
 * Both builds must exist before `pnpm test:e2e`.
 */
const PORTS = { score: 4173, scorecard: 4174 } as const

export default defineConfig({
  testDir: 'e2e',
  timeout: 60_000,
  fullyParallel: true,
  reporter: process.env.CI ? 'github' : 'list',
  use: { trace: 'retain-on-failure' },
  projects: [
    {
      name: 'score',
      use: { ...devices['Desktop Chrome'], baseURL: `http://localhost:${PORTS.score}` },
    },
    {
      name: 'scorecard',
      testMatch: /(pages|country)\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'], baseURL: `http://localhost:${PORTS.scorecard}` },
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
      command: `node --import tsx scripts/serve.ts out ${PORTS.scorecard}`,
      port: PORTS.scorecard,
      gracefulShutdown: { signal: 'SIGTERM', timeout: 2000 },
      reuseExistingServer: !process.env.CI,
    },
  ],
})
