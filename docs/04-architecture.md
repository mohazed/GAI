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
   - `dumps/events.csv`, `dumps/sources.csv`, `dumps/assessments.csv`, `dumps/scores-daily-{YYYY}.csv` (one file per year), `dumps/gai-{date}.json` (everything)

   Coverage is the research status of the dataset at the build date; it is not recomputed for earlier dates, because the assessments record what was checked, not when. Outputs always carry the scores; the site decides what to show (D-16).
7. **Determinism test** (`pnpm build:data:check`, run in CI on `data/` and on `fixtures/`): run steps 1–6 twice, as two separate processes, into temp dirs with the same date and diff every byte. Build time is passed in as an argument so it is not a source of nondeterminism.

## 3. Site (`apps/web`)

- **Routes** (both `/en/…` and `/fr/…`; `/` redirects by `Accept-Language` via a tiny inline script and a `<meta http-equiv="refresh">` fallback to `/en/`):
  `/`, `/ranking`, `/country/{iso3}`, `/compare` (client state in URL: `?c=DEU,FRA&w=1,1,1,1`), `/changes`, `/methodology` and `/methodology/{version}`, `/corrections`, `/about`, `/data` (downloads, API docs, licence), `/embed` (widget docs), `/reply` (right-of-reply instructions).
- **Rendering:** all pages static. Interactive islands (map hover, weight sliders, compare chart, search) are client components hydrated on demand. Pages must render meaningful HTML without JavaScript: the ranking table, country page, event cards, sources and citations are server-rendered HTML; JS only enhances.
- **Data access:** pages import the JSON emitted by build-data at build time (no runtime fetch except Compare, which fetches `countries/{iso3}.json` on demand).
- **Share cards:** `/cards/{iso3}.png` rendered at build with `satori` + `@resvg/resvg-js` from the same template for every country, 1200×630, plus `og:image` tags on every country page.
- **Citations:** APA, Chicago and plain formats, computed from country, score, band, methodology version, date and the permalink `/country/{iso3}?date=YYYY-MM-DD` (the page reads `date` client-side and shows the snapshot from `scores/{date}.json`).
- **Search:** client-side over `countries.json` (names EN/FR, ISO codes), keyboard accessible.
- **Map:** SVG, d3-geo (Natural Earth 1:50m admin-0, simplified with mapshaper to ≈ 300 KB TopoJSON), Equal Earth projection, fill by band, hatched fill for excluded / no-data, hover tooltip and click to country page. Disputed territories drawn per Natural Earth and not filled.
- **i18n:** `next-intl` with static messages; every UI string in `messages/{en,fr}.json`; event summaries and methodology prose come bilingual from the data. RTL smoke test with `dir="rtl"` on a pseudo-locale in CI.
- **Feature flag:** `NEXT_PUBLIC_SHOW_SCORES` (`false` in Phase 1). When false: no number, no band colour, no ranking order (alphabetical table), no gauge; category rows show event counts; map shows coverage instead of band. Methodology page shows "v1.0 draft, scoring not yet displayed".
- **Performance budgets:** country page ≤ 120 KB JS gzipped, LCP < 1.5 s on a mid-range phone, no layout shift from fonts (self-hosted, `font-display: optional` for display face, `swap` for text), images only the share card.
- **Accessibility:** WCAG 2.2 AA; every chart has a text alternative (a table or a sentence); colour never the only carrier of band (pattern + label); focus visible; skip link; reduced-motion respected.
- **Security headers** (via `_headers` file for Cloudflare Pages): CSP with no inline scripts except the language redirect (hashed), `X-Content-Type-Options`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` minimal. CORS `Access-Control-Allow-Origin: *` on `/api/*`, `/cards/*`, `/embed/*`.
- **SEO/structured data:** `Dataset` schema.org JSON-LD on `/data`, `Article`-free (this is not news), `BreadcrumbList`, canonical and hreflang pairs, sitemap, `robots.txt`, `llms.txt` describing the API.
- **How it is built (P-06):**
  - `pnpm build` = `pnpm build:data` then `next build --webpack` in `apps/web` (webpack, because Turbopack cannot map the workspace packages' NodeNext `import './x.js'` to `x.ts`; `experimental.extensionAlias` does it), then `apps/web/scripts/postbuild.ts`. Pages read the API through `apps/web/lib/api.ts`, which parses every file with its schema from `@gai/schema/api`.
  - **CSP in practice.** Next.js writes inline `<script>` elements (its RSC payload) into every page, different on each page, so one header cannot list their hashes. `public/_headers` sets the policy for everything, with `script-src 'self' 'unsafe-inline'`; `postbuild.ts` writes into each HTML page a `<meta http-equiv="Content-Security-Policy">` whose `script-src` lists `'self'` and the SHA-256 of each inline script of that page (the language redirect of `/` included). Browsers enforce both policies, so only hashed inline scripts run. The build fails if a page lacks its meta or contains an inline `style` attribute or `<style>` element (`style-src 'self'`), and, in production, if the output contains `/_kit`, the Inter font, `oklch()` colours or any hex colour outside the tokens of `05-design-system.md` §3.
  - **Charts without JavaScript and without inline styles.** SVG without a `viewBox`: horizontal positions are percentages of the width, vertical ones pixels; paths (step lines) sit in a nested SVG stretched horizontally with `vector-effect: non-scaling-stroke`. Tooltips are an enhancement (`TooltipLayer`); every mark also has a `<title>`, and every chart a text alternative. Charts keep a left-to-right axis in right-to-left pages; signed numbers carry the `.num` class (LTR, isolated).
  - **Map geometry** is `apps/web/map/world-50m.topo.json`, made by `pnpm --filter @gai/web map` (pinned Natural Earth v5.1.2, SHA-256 checked, mapshaper 0.7.68; `map/README.md`). The WorldMap projects it at build time into integer, relative path data (about 70 KB, 16 KB gzipped).
  - **Component kit.** `/_kit` (docs/05 §5) is dev-only: its files end in `.kit.tsx` and are pages only in `next dev` and in `pnpm --filter @gai/web build:kit`, which builds the fixtures API into `apps/web/.kit/` and the site with the kit into `apps/web/out-kit/` (never deployed). `pnpm test:e2e` runs the Playwright tests against `out-kit/` served with the `_headers` rules (`apps/web/scripts/serve.ts`): axe (WCAG 2.2 AA) on every kit row, no horizontal scroll at 375 px, the CSP, the language redirect, the output without JavaScript.
  - **JS weight.** Measured on P-06's home page: the Next.js 16 runtime and React DOM are about 131 KB gzipped before any application code (application code: about 7 KB). The 120 KB country-page budget above cannot be met by this stack as it stands; the decision is recorded in P-07.

## 4. Embeddable widget

`<script src="https://{host}/embed/gai.js" data-country="DEU" data-view="gauge|timeline" data-lang="en"></script>` renders into a `<div>` it creates, fetches `countries/{iso3}.json`, draws the gauge or timeline in the site's style, and links back. Under 15 KB gzipped, no dependencies, Shadow DOM for style isolation. Versioned path `/embed/v1/gai.js`.

## 5. CI and hosting

- **CI on every PR:** biome, tsc, vitest, `pnpm validate`, `build:data` determinism, `next build`, Playwright smoke (home, ranking, one country, compare, methodology in EN and FR; axe checks), Lighthouse CI budget on the country page.
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
