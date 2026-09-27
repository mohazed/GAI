/**
 * Lighthouse CI (docs/04 §3 budgets, docs/10 B-79, B-103) on the production build (out/), served
 * by scripts/serve.ts with the _headers rules and gzip, as the CDN serves it.
 *
 * "A mid-range phone" is Lighthouse's default mobile profile: a Moto G Power (4× CPU slowdown) on
 * slow 4G (150 ms RTT, 1.6 Mbps down). The throttling is applied to the browser ('devtools'), not
 * simulated: on a local server every script arrives before the first paint, and the simulation
 * then charges all 150 KB of asynchronous JavaScript to LCP, which a real slow connection does not
 * wait for (docs/10 B-103 has both measurements). Chromium is Playwright's.
 *
 *   pnpm build && pnpm --filter @gai/web lighthouse
 *
 * P-08 adds the country page to `url`.
 */
const { chromium } = require('@playwright/test')

const PORT = 4175
const PAGES = ['/en/', '/fr/', '/en/ranking/', '/fr/ranking/']

module.exports = {
  ci: {
    collect: {
      startServerCommand: `node --import tsx scripts/serve.ts out ${PORT}`,
      startServerReadyPattern: 'serving',
      url: PAGES.map((p) => `http://localhost:${PORT}${p}`),
      numberOfRuns: 3,
      chromePath: chromium.executablePath(),
      settings: {
        chromeFlags: '--headless=new --no-sandbox',
        throttlingMethod: 'devtools',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      },
    },
    assert: {
      // The median of the runs is asserted.
      aggregationMethod: 'median',
      assertions: {
        // ≤ 150 KB of JavaScript per page, transferred (gzip). The application-code share
        // (≤ 25 KB) is checked on the built chunks by scripts/postbuild.ts.
        'resource-summary:script:size': ['error', { maxNumericValue: 150 * 1024 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 1500 }],
        // No layout shift from fonts or hydration (docs/04 §3). The text face swaps in over a
        // metric-matched fallback (app/globals.css), which leaves sub-pixel movement of inline
        // links (0.0001 to 0.0004 measured): the limit is 0.001, a hundredth of the "good" 0.1.
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.001 }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['error', { minScore: 1 }],
        'categories:seo': ['error', { minScore: 1 }],
      },
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci' },
  },
}
