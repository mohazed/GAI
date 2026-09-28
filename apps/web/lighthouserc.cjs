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
 * Pages: home and ranking (P-07); the country page of Germany in the real data, in both languages,
 * and Israel as an excluded entity (P-08); Compare empty and with Germany chosen (its charts
 * arrive after a fetch, inside a region that keeps its height), Changes and a monthly report
 * (P-09); Methodology and Data in both languages, About, Corrections, Reply and Embed (P-10).
 */
const { chromium } = require('@playwright/test')

const PORT = 4175
const PAGES = [
  '/en/',
  '/fr/',
  '/en/ranking/',
  '/fr/ranking/',
  '/en/country/DEU/',
  '/fr/country/DEU/',
  '/en/country/ISR/',
  '/en/compare/',
  '/fr/compare/',
  '/en/compare/?c=DEU',
  '/en/changes/',
  '/fr/changes/',
  '/en/changes/2024-06/',
  '/en/methodology/',
  '/fr/methodology/',
  '/en/data/',
  '/fr/data/',
  '/en/about/',
  '/en/corrections/',
  '/en/reply/',
  '/en/embed/',
]

// ≤ 150 KB of JavaScript per page, transferred (gzip). The application-code share (≤ 25 KB) is
// checked on the built chunks by scripts/postbuild.ts.
const SCRIPT_BUDGET = {
  'resource-summary:script:size': ['error', { maxNumericValue: 150 * 1024 }],
}

const ASSERTIONS = {
  'largest-contentful-paint': ['error', { maxNumericValue: 1500 }],
  // No layout shift from fonts or hydration (docs/04 §3). Every face is font-display: optional
  // (P-13, docs/10 B-174): a font is never swapped in after the first paint. The limit is 0.001,
  // a hundredth of the "good" 0.1.
  'cumulative-layout-shift': ['error', { maxNumericValue: 0.001 }],
  'categories:accessibility': ['error', { minScore: 1 }],
  'categories:best-practices': ['error', { minScore: 1 }],
  'categories:seo': ['error', { minScore: 1 }],
}

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
      // The median of the runs is asserted. The Compare page with a country chosen (`?c=`) loads
      // its results view on demand after the first load (docs/04 §3, docs/10 B-135): the
      // JavaScript budget is the page's first load, measured on /en/compare/ and /fr/compare/;
      // the `?c=` run checks everything else, layout shift included.
      assertMatrix: [
        {
          matchingUrlPattern: '^[^?]*$',
          aggregationMethod: 'median',
          assertions: { ...SCRIPT_BUDGET, ...ASSERTIONS },
        },
        { matchingUrlPattern: '\\?c=', aggregationMethod: 'median', assertions: ASSERTIONS },
      ],
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci' },
  },
}
