import { defineConfig, devices } from '@playwright/test'

/**
 * Browser tests of the kit build (`pnpm --filter @gai/web build:kit`, written to out-kit/): the
 * production pages plus the dev-only /_kit, served with the rules of _headers so the CSP is live.
 * P-07 adds the page smoke tests and Lighthouse CI.
 */
export default defineConfig({
  testDir: 'e2e',
  timeout: 60_000,
  fullyParallel: true,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: 'http://localhost:4173', trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // One process (no pnpm/tsx wrapper) so that Playwright can stop it when the run ends.
    command: 'node --import tsx scripts/serve.ts out-kit 4173',
    port: 4173,
    gracefulShutdown: { signal: 'SIGTERM', timeout: 2000 },
    reuseExistingServer: !process.env.CI,
  },
})
