# 04 — Architecture

A static site generated from the files in `data/` and `methodology/`. No server, no database, no secrets at runtime.

## 1. Monorepo

```
gaza-accountability-index/
  package.json  pnpm-workspace.yaml  turbo.json  tsconfig.base.json  .nvmrc (Node 22 or later; Node 26 works)
  CLAUDE.md  README.md  LICENSE (MIT)  DATA-LICENSE (CC BY 4.0)  CONTRIBUTING.md  SECURITY.md
  data/  archive/  methodology/  docs/
  packages/
    schema/       zod schemas, id helpers, loaders (YAML/CSV → typed objects), validators, tone lint
    scoring/      pure functions: contributions, caps, passivity, score, band, coverage, sensitivity; zero deps
    pipeline/     fetchers for structured sources (write CSV + dataset source records), generators (tables → events),
                  archiver (Wayback save + hash + text extraction), build-data (snapshots → JSON/CSV under apps/web/public)
    ui/           (optional) shared React components used by both the site and the embeddable widget
  apps/
    web/          Next.js 15+, App Router, output: 'export', React 19, Tailwind 4 with design tokens, next-intl
    widget/       tiny embeddable script (Preact or vanilla) built with Vite, served from /embed/
  .github/workflows/
    ci.yml        lint, typecheck, unit tests, validate data, build-data determinism check, build site
    nightly.yml   cron 03:15 UTC: build-data + build site + deploy to Cloudflare Pages
    deploy.yml    on push to main: same as nightly
    fetch.yml     manual (workflow_dispatch): run a structured fetcher and open a PR with the updated CSV
```

Tooling: pnpm, Turborepo, TypeScript strict, Biome (lint + format), Vitest, Playwright for a small smoke suite, Changesets not needed. Node 22.

## 2. Build pipeline (`pnpm build:data`)

1. **Load** `data/` and `methodology/{current}` through `packages/schema`; fail on any schema error.
2. **Validate**: consistency checks §12 of `02-methodology-spec.md`; quote presence against `archive/text/`; tone lint.
3. **Generate** events from structured tables (B1, B2, A1, A4, A2, C3, D1).
4. **Score** every scored country for every date from 2023-10-07 to the build date (UTC), for the current methodology version. About 1 100 dates × 193 countries; runs in seconds.
5. **Derive**: bands, coverage, movers (7-day and 30-day deltas), "changed this week/month" feed, sensitivity tables, summary lines (EN/FR templates), citation strings.
6. **Emit** into `apps/web/public/api/v1/` (`pnpm build:data [--date YYYY-MM-DD] [--out dir] [--root dir] [--site-url url]`; every endpoint is documented with an example in `apps/web/public/api/README.md`, and every JSON file is checked against its zod schema in `packages/schema/src/api.ts` before it is written):
   - `countries.json` (every registry entry at the build date, excluded entities flagged), `countries/{iso3}.json` (full: subtotals, indicator values, events with evidence and sources, assessments with the statuses of the generated indicators read from the tables, replies, corrections, series of daily scores compressed as change points, summary lines and citations with and without the score)
   - `countries/{iso3}/events.json`, `countries/{iso3}/series.json`
   - `scores/index.json` (list of dates) and `scores/{YYYY-MM-DD}.json` for every date from 2023-10-07 (score, band, passivity flag, clipped subtotals in full precision)
   - `methodology/{version}.json` for every version folder, `methodology/index.json` (versions and changelog), and the frozen outputs of superseded versions copied from `data/snapshots/{version}/` to `methodology/{version}/`
   - `changes/latest.json`, `changes/{YYYY-MM}.json`, and the monthly report in four variants: `changes/{YYYY-MM}.md` (English), `.fr.md`, `.scorecard.md` and `.scorecard.fr.md` (without scores, for scorecard mode, D-16)
   - `corrections.json`, `replies.json`, `sensitivity.json`, `build-notes.json` (generator notes, unpublished events, events of countries outside the registry, derived statuses the hand-written assessments contradict, unchecked indicators, validation warnings), `manifest.json` (git SHA and dirty flag, methodology version, build date, site URL, size and SHA-256 of every other file)
   - `dumps/events.csv`, `dumps/sources.csv`, `dumps/assessments.csv`, `dumps/countries.csv` (every country at the build date in ranking order, with the clipped subtotals and passivity value in full precision: the ranking page's "Download CSV") and `dumps/countries.scorecard.csv` (the same without anything derived from the score, D-16), `dumps/scores-daily-{YYYY}.csv` (one file per year), `dumps/gai-{date}.json` (everything)

   Coverage is the research status of the dataset at the build date; it is not recomputed for earlier dates, because the assessments record what was checked, not when. Outputs always carry the scores; the site decides what to show (D-16).
7. **Determinism test** (`pnpm build:data:check`, run in CI on `data/` and on `fixtures/`): run steps 1–6 twice, as two separate processes, into temp dirs with the same date and diff every byte. Build time is passed in as an argument so it is not a source of nondeterminism.

## 3. Site (`apps/web`)

- **Routes** (both `/en/…` and `/fr/…`; `/` redirects by `Accept-Language` via a tiny inline script and a `<meta http-equiv="refresh">` fallback to `/en/`):
  `/`, `/ranking`, `/country/{iso3}`, `/compare` (client state in URL: `?c=DEU,FRA&w=1,1,1,1`), `/changes`, `/methodology` and `/methodology/{version}`, `/corrections`, `/about`, `/data` (downloads, API docs, licence), `/embed` (widget docs), `/reply` (right-of-reply instructions).
- **Rendering:** all pages static. Interactive islands (map hover, weight sliders, compare chart, search) are client components hydrated on demand. Pages must render meaningful HTML without JavaScript: the ranking table, country page, event cards, sources and citations are server-rendered HTML; JS only enhances.
- **Data access:** pages import the JSON emitted by build-data at build time (no runtime fetch except Compare, which fetches `countries/{iso3}.json` on demand).
- **Share cards:** `/cards/{iso3}.png` rendered at build with `satori` + `@resvg/resvg-js` from the same template for every country, 1200×630, plus `og:image` tags on every country page. As built (P-08, docs/10 B-114): `apps/web/scripts/cards.ts` runs before `next build` in `pnpm build` and `build:kit`, reads the published `countries.json` and each country file, and writes one card per registry entry and language, `public/cards/{ISO3}.png` (English) and `public/cards/fr/{ISO3}.png` (French), not tracked; the template is `scripts/card-template.tsx` (score, scorecard and excluded variants); fonts are the static WOFF files of the pinned @fontsource packages; resvg does not load system fonts (about 12–25 ms a card).
- **Citations:** APA, Chicago and plain formats, computed from country, score, band, methodology version, date and the permalink `/country/{iso3}?date=YYYY-MM-DD` (the page reads `date` client-side and shows the snapshot from `scores/{date}.json`); P-08: the gauge and the category rows are redrawn for that date under an "as of" banner, by a view loaded only for a dated link, while coverage, events and the timeline stay those of the build date; in scorecard mode the banner says the page is the build-date scorecard, docs/10 B-113).
- **Search:** client-side over `countries.json` (names EN/FR, ISO codes), keyboard accessible.
- **Map:** SVG, d3-geo (Natural Earth 1:50m admin-0, simplified with mapshaper to ≈ 300 KB TopoJSON), Equal Earth projection, fill by band, hatched fill for excluded / no-data, hover tooltip and click to country page. Disputed territories drawn per Natural Earth and not filled.
- **i18n:** `next-intl` with static messages; every UI string in `messages/{en,fr}.json`; event summaries and methodology prose come bilingual from the data. RTL smoke test with `dir="rtl"` on a pseudo-locale in CI.
- **Feature flag:** `NEXT_PUBLIC_SHOW_SCORES` (`false` in Phase 1). When false: no number, no band colour, no ranking order (alphabetical table), no gauge; category rows show event counts; map shows coverage instead of band. Methodology page shows "v1.0 draft, scoring not yet displayed".
- **Performance budgets:** ≤ 150 KB JS gzipped per page in total, of which application code (outside the Next.js and React framework chunks) ≤ 25 KB (decided in P-06, docs/10 B-79; the plan's 120 KB was below the framework's own 131 KB), LCP < 1.5 s on a mid-range phone, no layout shift from fonts (self-hosted, `font-display: optional` for display face, `swap` for text over a metric-matched fallback), images only the share card. How each is enforced (P-07): the JavaScript weights by `scripts/postbuild.ts` on the built chunks (framework = the build manifest's `rootMainFiles` and `polyfillFiles`; `noModule` scripts left out; gzip); LCP, CLS (≤ 0.001, the residue of the font swap), JavaScript on the wire (≤ 150 KB) and the accessibility, best-practices and SEO scores (100) by Lighthouse CI (`apps/web/lighthouserc.cjs`) on the production build, with Lighthouse's mobile profile (Moto G Power, 4× CPU, slow 4G) applied to the browser rather than simulated (docs/10 B-103).
- **Accessibility:** WCAG 2.2 AA; every chart has a text alternative (a table or a sentence); colour never the only carrier of band (pattern + label); focus visible; skip link; reduced-motion respected.
- **Security headers** (via `_headers` file for Cloudflare Pages): CSP with no inline scripts except the language redirect (hashed), `X-Content-Type-Options`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` minimal. CORS `Access-Control-Allow-Origin: *` on `/api/*`, `/cards/*`, `/embed/*`.
- **SEO/structured data:** `Dataset` schema.org JSON-LD on `/data` and on every country page (P-08, docs/10 B-115), `Article`-free (this is not news), `BreadcrumbList`, canonical and hreflang pairs, sitemap, `robots.txt`, `llms.txt` describing the API.
- **How it is built (P-06):**
  - `pnpm build` = `pnpm build:data` then `next build --webpack` in `apps/web` (webpack, because Turbopack cannot map the workspace packages' NodeNext `import './x.js'` to `x.ts`; `experimental.extensionAlias` does it), then `apps/web/scripts/postbuild.ts`. Pages read the API through `apps/web/lib/api.ts`, which parses every file with its schema from `@gai/schema/api`.
  - **CSP in practice.** Next.js writes inline `<script>` elements (its RSC payload) into every page, different on each page, so one header cannot list their hashes. The stylesheet is inlined into each page as one `<style>` element (`experimental.inlineCss`, P-07, docs/10 B-102): on a slow connection it saves the round trip of a render-blocking request. `public/_headers` sets the policy for everything, with `script-src 'self' 'unsafe-inline'` and `style-src 'self' 'unsafe-inline'`; `postbuild.ts` writes into each HTML page a `<meta http-equiv="Content-Security-Policy">` whose `script-src` and `style-src` list `'self'` and the SHA-256 of each inline script and `<style>` element of that page (the language redirect of `/` included). Browsers enforce both policies, so only hashed inline code runs, and style attributes never do (hash-sources do not cover them). Hashed build assets (`/_next/static/*`, `/fonts/*`) are served immutable and without the page-level headers (Cloudflare's `! Header` lines). The build fails if a page lacks its meta, contains a `style` attribute, or has a `url()` to a file missing from the output, and, in production, if a page is over the JavaScript budget, a client chunk contains a message file, or if the output contains `/_kit`, the Inter font, `oklch()` colours or any hex colour outside the tokens of `05-design-system.md` §3.
  - **Charts without JavaScript and without inline styles.** SVG without a `viewBox`: horizontal positions are percentages of the width, vertical ones pixels; paths (step lines) sit in a nested SVG stretched horizontally with `vector-effect: non-scaling-stroke`. Tooltips are an enhancement (`TooltipLayer`); every mark also has a `<title>`, and every chart a text alternative. Charts keep a left-to-right axis in right-to-left pages; signed numbers carry the `.num` class (LTR, isolated).
  - **Map geometry** is `apps/web/map/world-50m.topo.json`, made by `pnpm --filter @gai/web map` (pinned Natural Earth v5.1.2, SHA-256 checked, mapshaper 0.7.68; `map/README.md`). The WorldMap projects it at build time into integer, relative path data (about 70 KB, 16 KB gzipped).
  - **Fonts** are copied from the pinned @fontsource packages to `public/fonts/`, named with the package version (`scripts/fonts.ts`, run before every build and `next dev`, not tracked), and referenced by those public paths: in the inlined stylesheet Next.js 16 writes bundled assets' `url()` without their `/_next` prefix, and the RSC payload, which repeats the stylesheet in length-prefixed rows, must not be edited. The text face swaps in over `Source Sans 3 Fallback`, Arial or Liberation Sans with `size-adjust` and ascent and descent overrides measured on the site's own text (a separate one for the uppercase navigation), so the swap does not rewrap lines.
  - **Compare and Changes (P-09, docs/10 B-125–B-132).** Compare is a client panel (`ComparePanel`) in the HTML from the start: it reads `?c=` (up to five scored countries) and, in score mode, `?w=`, fetches `countries/{ISO3}.json` for each country, writes the choice back with `replaceState`, and loads the charts, tables and citation (`CompareResults`, with d3-shape) with `import()`; a `<noscript>` section lists the country pages. The compare components are views taking a translator (`CompareViews.tsx`), so the browser gets only the page's language. The chart scales are two linear functions with d3-scale's arithmetic (`lib/chart.ts`; d3-scale is no longer a dependency). Changes renders `changes/latest.json` with `ChangesFeed` (filters through `FacetBrowser`, the country page's mechanism; the country rules are written before each build by `scripts/filter-css.ts` into a stylesheet only the Changes page imports), the months, and a stale-build notice computed in the browser from the build date; each month's report is rendered from its Markdown (`lib/markdown.ts`, `MonthReport`) at `/changes/{YYYY-MM}/`.
  - **Component kit.** `/_kit` (docs/05 §5) is dev-only: its files end in `.kit.tsx` and are pages only in `next dev` and in `pnpm --filter @gai/web build:kit`, which builds the fixtures API into `apps/web/.kit/` and the site with the kit into `apps/web/out-kit/` (never deployed). The kit build shows scores (`NEXT_PUBLIC_SHOW_SCORES=true`), so its production pages are the score-mode pages; `out/` is the scorecard mode as deployed. `pnpm test:e2e` runs the Playwright tests against both, served with the `_headers` rules and gzip (`apps/web/scripts/serve.ts`): the page smoke tests (EN and FR, JavaScript on and off) on each, axe (WCAG 2.2 AA) on every page and every kit row, no horizontal scroll at 375 px, the CSP, the language redirect, the output without JavaScript. Controls that only work with JavaScript (ranking filters, weights) are in the HTML, so that hydration moves nothing, and hidden by `@media (scripting: none)`.
  - **JS weight.** Measured on P-06's home page: the Next.js 16 runtime and React DOM are about 131 KB gzipped before any application code (application code: about 7 KB). Hence the budget above (docs/10 B-79). P-07: framework 128.4 KB; home 14.5 KB of application code (142.9 KB in total), ranking 17.3 KB (145.7 KB), of which 11.8 KB is next-intl's message formatter. Client components import nothing from `lib/i18n.ts` (it holds both message files). P-08: country page 17.3 KB of application code (145.7 KB in total; 151,601 bytes of JavaScript on the wire in Lighthouse); ranking 18.0 KB (146.4 KB; 152,268 bytes on the wire, 1.3 KB under the limit), 0.7 KB more than in P-07 because the formatting helpers are now shared with the country page's client components and webpack no longer inlines them into the ranking module (docs/10 B-120). Views that only some states need load on demand (`import()`). P-09 (docs/10 B-127): ranking 152,637 bytes on the wire (963 under the limit), country 152,016, home 148,835, compare 150,159 at first load, changes 148,707, a monthly report 146,878. Webpack's `splitChunks` considers only chunks loaded at page start (`next.config.ts`): a module that an on-demand view shares with other pages is copied into the view's chunk instead of going into a chunk of its own that those pages would load.

## 4. Embeddable widget

`<script src="https://{host}/embed/gai.js" data-country="DEU" data-view="gauge|timeline" data-lang="en"></script>` renders into a `<div>` it creates, fetches `countries/{iso3}.json`, draws the gauge or timeline in the site's style, and links back. Under 15 KB gzipped, no dependencies, Shadow DOM for style isolation. Versioned path `/embed/v1/gai.js`.

## 5. CI and hosting

- **CI on every PR:** biome, tsc, vitest, `pnpm validate`, `build:data` determinism, `next build`, Playwright smoke (home, ranking, one country, compare, methodology in EN and FR; axe checks), Lighthouse CI budgets (home and ranking since P-07; the country page from P-08).
- **Deploy:** Cloudflare Pages direct upload from GitHub Actions (`wrangler pages deploy apps/web/out`), on push to `main` and nightly. Preview deploys for PRs. Secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` only.
- **Mirror (optional):** a `rsync` step to the author's VPS with the same `out/` folder; documented, off by default.
- **Data fetchers** run only on demand (`workflow_dispatch` or locally): `pnpm fetch:fts`, `pnpm fetch:worldbank`, `pnpm fetch:comtrade` (needs `COMTRADE_KEY` locally), `pnpm fetch:unvotes`, `pnpm import:sipri <file>`. Each writes the CSV, archives the raw response into a dataset source record, and the author commits.
- **Archiver CLI:** `pnpm archive <url>` → saves to Wayback, downloads the snapshot, computes SHA-256, extracts text (HTML via readability + turndown-free plain text; PDF via pdfjs), writes `archive/text/…`, appends `archive/index.csv`, and prints a source YAML skeleton. This is the tool every data session uses.

## 6. Environment and secrets

| Name | Where | Purpose |
|---|---|---|
| `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` | GitHub Actions secrets | deploy |
| `COMTRADE_KEY` | local `.env` only | Comtrade fetcher |
| `IA_ACCESS_KEY`, `IA_SECRET_KEY` | local `.env` only, optional | Wayback SPN2 authenticated saves (higher limits) |
| `NEXT_PUBLIC_SHOW_SCORES` | repo `.env.production` | Phase gate |
| `NEXT_PUBLIC_SITE_URL` | repo | canonical URLs |

No LLM API key anywhere (D-03).
