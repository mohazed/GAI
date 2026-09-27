# PROMPTS — run these one by one with Claude Opus 5.5

How to use: open Claude Code in this folder (`/Users/mohorozovic/M2/GAI`), select Opus 5.5 in the app, type `/clear`, then paste one prompt. Each prompt ends with the session reporting what it did, what it did not do, and the next prompt id. Read the report, review the commit or PR, then `/clear` and paste the next one. Do not run two build prompts in parallel; data prompts (P-D) can run in parallel in separate folders (git worktrees) if you want.

Prerequisites per prompt are listed as **Before**. `CLAUDE.md` is loaded automatically in every session and carries the non-negotiables; the prompts do not repeat them.

---

## P-01 — Repository bootstrap

**Before:** nothing. The public repository already exists and is empty: https://github.com/mohazed/GAI (gh is logged in as mohazed on this machine).

```
/clear
```

```
Read CLAUDE.md, docs/00-decisions.md, docs/04-architecture.md and docs/09-accounts-and-costs.md.

Bootstrap the monorepo in this folder exactly as docs/04-architecture.md §1 describes: pnpm workspaces, Turborepo, TypeScript strict with a shared tsconfig.base.json, Biome, Vitest, Node 22 (.nvmrc), empty packages `schema`, `scoring`, `pipeline`, `ui` and apps `web`, `widget` with package.json stubs and a passing "hello" test each. Add: LICENSE (MIT, © 2026 Mohamed Zouad), DATA-LICENSE (CC BY 4.0 text), README.md (what the project is, the standpoint sentence from spec §1, how to reproduce a build, licences), CONTRIBUTING.md (how to report an error, how to submit a right of reply, that only the maintainer merges), SECURITY.md, CODE_OF_CONDUCT.md (short), .gitignore (.env, out/, node_modules, .turbo), .env.example with the variables of docs/04-architecture.md §6, and GitHub issue forms in .github/ISSUE_TEMPLATE/: "report-an-error.yml", "right-of-reply.yml", "submit-a-lead.yml" with the fields described in docs/08-governance.md §4, plus config.yml disabling blank issues. Add .github/workflows/ci.yml running lint, typecheck and tests on every push and PR (the data and build steps will be added later). Keep the spec markdown file and docs/ where they are; they are part of the repo.

Then: install pnpm if missing (npm i -g pnpm), git init, initial commit on main, add the remote https://github.com/mohazed/GAI (it exists and is empty), push main, enable Discussions with gh (Issues are already on). Do not create any other account or key.

Acceptance: `pnpm install && pnpm lint && pnpm typecheck && pnpm test` pass; CI is green on GitHub; README explains the project in under 300 words without marketing language.
End with the report described in CLAUDE.md.
```

---

## P-02 — Schema package and methodology v1.0.0 files

```
/clear
```

```
Read CLAUDE.md, docs/02-methodology-spec.md, docs/03-data-model.md, and spec §3 of "Gaza Accountability Index — Cahier des charges.md".

1) Create methodology/v1.0.0/ with: indicators.yaml (all 34 indicators: id, category, name en/fr, description en/fr, points spec as either fixed value, per-instance value with cap, tier table, or formula reference; event type per docs/02 §3; primary sources; cadence; evidence rule; scored: false for E1–E3), categories.yaml (caps), bands.yaml, confidence.yaml, decay.yaml, passivity.yaml (15, qualifying rule exactly as docs/02 §6), thresholds.yaml (A1 sqrt scaling, A4/A2/C3/D1 tiers), votes.yaml (empty list with the schema documented in a comment; filled in P-14), symmetry.yaml (docs/02 §13), banned-words.txt (adjectives and loaded terms, EN and FR, ≥ 80 entries), methodology.en.md and methodology.fr.md as structured drafts covering every section of docs/05-design-system.md §6 "Methodology" (the FR is a full translation, not a summary), and methodology/CHANGELOG.md starting with "1.0.0-rc.1 — initial".

2) In packages/schema: zod schemas for Country, Event, Source, Assessment, Correction, Reply, Lead, the structured CSV rows, and every methodology file; id helpers and validators for docs/03 §2 patterns; YAML/CSV loaders that read the whole data/ tree into typed objects; a validator that enforces every rule in docs/03 §4–§6 and docs/02 §12 items 1–6 (quote-presence check against archive/text with whitespace normalisation, confidence/source-kind rule, tone lint, corrections-required-on-edit using git diff of published events, indicator-level caps present, symmetry complete). Errors must name the file, the id and the rule.

3) Create data/ with the tree of docs/03 §1, empty except: countries.yaml with ONLY ISR and PSE (excluded, with reasons) plus DEU as a complete example entry; one fully worked example event, source, assessment, correction and reply for DEU under a `fixtures/` sibling folder (not under data/) used by tests; archive/index.csv header; data/structured/*.csv headers.

4) `pnpm validate` script at the root that loads and validates data/ and methodology/, exits non-zero on error, and prints counts. Unit tests for every rule using the fixtures (positive and negative cases).

Acceptance: pnpm validate passes on the near-empty data tree; tests cover each validator rule; indicators.yaml matches docs/02 exactly (I will diff them). Report anything in docs/02 that could not be encoded and why.
```

---

## P-03 — Scoring engine

```
/clear
```

```
Read CLAUDE.md, docs/02-methodology-spec.md fully, and packages/schema.

Implement packages/scoring as pure, dependency-free TypeScript: contribution(event, date, methodology) with the three event types and the decay function; indicator-level caps and the supersede rules of docs/02 §2 (B8, B12, C1, C4, D3, A6/A7, B5/B6 latest-position); category subtotals raw and clipped; the passivity rule of §6 exactly (qualifying indicators, |contribution| ≥ 2, B1 excluded, trailing 365 days); the final score, rounding half away from zero, band assignment from the rounded integer; coverage per §8 with not-applicable handling for B2 by UNSC membership periods; user weights per §9; the sensitivity suite of §10 including Spearman rank correlation; a daily series function that returns change points only; the summary-line generator for EN and FR from the template in spec §5; the citation generator (APA, Chicago, plain) in EN and FR; the "last change" and movers computations.

Tests (Vitest): the worked example of docs/02 §7 reproduced to the decimal; decay at Δ = 0, 365, 366, 547, 730, 731; standing-state end dates (end exclusive); caps hit from above and below; supersede pairs; passivity on/off around the 365-day boundary and the ≥ 2 threshold; coverage with N/A; weights at 0 and 2; rounding of −0.5 and 0.5; band boundaries (−51, −50, 0, 1, 40, 41); determinism (same input, same output, no Date.now anywhere); a property test that no score leaves [−100, 100].

Also add `pnpm score --country XXX [--date YYYY-MM-DD] [--list] [--json]` in packages/pipeline (thin CLI over the loaders and the engine) printing the category table, the events with their contributions, and the coverage. Acceptance: all tests pass; the CLI runs on the DEU fixture. Report any ambiguity found in docs/02 with your chosen reading.
```

---

## P-04 — Pipeline tools: archiver, fetchers, importers, generators

**Before:** Internet Archive S3 keys in `.env` (`IA_ACCESS_KEY`, `IA_SECRET_KEY`), Comtrade key in `.env` (`COMTRADE_KEY`). The session must not commit `.env`.

```
/clear
```

```
Read CLAUDE.md, docs/06-sources-playbook.md fully (especially §2, §6 and §8), docs/03-data-model.md §7, docs/02-methodology-spec.md §5, and docs/04-architecture.md §5.

Build in packages/pipeline:

1) `pnpm archive <url> [--kind official|court|dataset|ngo|press|parliamentary|official-video] [--id src_...]`: authenticated Wayback SPN2 save (POST https://web.archive.org/save, Authorization: LOW key:secret, if_not_archived_within=1d, poll /save/status/{job}), fetch the snapshot bytes, SHA-256, extract text (HTML via a Readability port to plain text; PDF via pdfjs-dist; fall back to raw text), write archive/text/{id}.txt (truncate at 200 KB with a marker), append archive/index.csv, and print a complete source YAML skeleton to paste into data/sources/{YYYY}/{id}.yaml. Handle 429 and timeouts with two retries and 60 s pauses; on final failure print a skeleton with wayback_url: null and archive_status: failed. Never call the anonymous save endpoint.

2) Fetchers, each archiving its raw response as a dataset source and writing rows with that source id: `pnpm fetch:fts` (FTS API v1 flows for plan ids 1186, 1156, 1273, 1510 grouped by source location; trailing-12-month windows per docs/02 §5 D1; store both the per-plan totals and the window totals), `pnpm fetch:worldbank` (GNI Atlas and population, latest year per country), `pnpm fetch:comtrade` (for a given list of reporters: HS 93, 8710, 8526, 8802 exports to 376 and total trade both flows with 376, plus the mirror from reporter 376; respect 500 calls/day with a local call counter and resume file; annual periods 2022–latest).

3) Importers: `pnpm import:unvotes <csv>` (the UN Digital Library bulk GA voting CSV or a per-resolution MARCXML export; keep only symbols listed in methodology/*/votes.yaml; write unga_votes.csv with Y/N/A/X; report members missing from any vote), `pnpm import:sipri <csv>` (TIV deliveries to Israel by supplier per year and orders from Israel by recipient; write sipri_deliveries.csv and sipri_orders.csv with the release date passed as an argument).

4) Generators (pure functions, tested with fixtures): B1 vote events (repeatable, per vote, with the press-release source id per resolution), B2 veto events, A1/A4 computed events per SIPRI release window, A2 and C3 computed events per Comtrade window (self-report else mirror else no-data), D1 computed events per monthly window with GNI. Each generated event carries generated: true and the dataset source in evidence with a `row` locator.

Acceptance: unit tests for every generator with hand-computed expectations; `pnpm archive https://www.icj-cij.org/case/192` produces a real archived source (commit its text and index row as a smoke fixture); fetch:worldbank runs and commits gni.csv and population.csv for all countries with dataset sources archived; fetch:fts runs and commits fts_funding.csv. Do not run comtrade beyond one test reporter (DEU) today. Report the exact FTS fields used and any surprise in the data.
```

---

## P-05 — Build-data: snapshots, API files, dumps, determinism

```
/clear
```

```
Read CLAUDE.md, docs/04-architecture.md §2, docs/02-methodology-spec.md §10–§14, docs/03-data-model.md, and packages/scoring.

Implement `pnpm build:data [--date YYYY-MM-DD] [--out dir]` in packages/pipeline performing steps 1–6 of docs/04 §2 and emitting every file listed there under apps/web/public/api/v1/ (default) with stable key ordering, LF line endings, no timestamps other than the passed build date, and a manifest.json with git SHA, methodology version, build date and SHA-256 of every emitted file. Include: countries.json, countries/{iso3}.json (full), countries/{iso3}/events.json and series.json, scores/index.json and scores/{date}.json for every day since 2023-10-07, methodology/{version}.json and index.json, changes/latest.json and changes/{YYYY-MM}.json (events by week, movers, corrections), corrections.json, replies.json, sensitivity.json (docs/02 §10, all five tables with Spearman), dumps/*.csv and dumps/gai-{date}.json. Phase-1 flag awareness: outputs always contain scores; the site decides what to show.

Step 3 (generate) uses `generateAll(generateContext(methodology), dataset.structured)` from packages/pipeline/src/generate (built in P-04; `pnpm score` already calls it): validate every generated event against the `Event` schema and the tone lint before emitting (a failure fails the build), publish them with `generated: true` in the country files, events.json and the dumps, and write the generators' `notes` (rows they could not use: no GNI, pre-release SIPRI rows, tracked vetoes) to a `build-notes.json` listed in the manifest. Derive the assessment status of the generated indicators (B1, B2, A1, A2, A4, C3, D1) from the tables, documented and tested: `has-events` when a generated event exists; `no-data` for A1, A2 and C3 when no row covers the country (so the card says "no export data", never zero, docs/02 §8); D1 with no FTS row is `none-found` (a real zero, docs/02 §5). A hand-written assessment never overrides `has-events`; the build reports any other disagreement.

Add `pnpm build:data:check` that builds twice into temp dirs with the same date and diffs; wire it, `pnpm validate` and the scoring tests into .github/workflows/ci.yml. Add the monthly report generator (Markdown per month: movers, new events, corrections, methodology notes) into changes/{YYYY-MM}.md.

Acceptance: builds from the fixtures in under 30 s; determinism check passes in CI; every JSON file validates against a zod schema exported from packages/schema (add `api` schemas); a README section in docs/ or apps/web/public/api/README.md documents each endpoint with an example. Report file counts and total size.
```

---

## P-06 — Web foundation and component kit

```
/clear
```

```
Read CLAUDE.md, docs/05-design-system.md fully (it is the contract), docs/04-architecture.md §3, and packages/schema api types.

Set up apps/web: Next.js (latest stable) App Router with output: 'export', images.unoptimized, React 19, Tailwind 4 configured ONLY with the tokens of docs/05 §3 (no default palette), fonts self-hosted via @fontsource-variable/newsreader, @fontsource-variable/source-sans-3, @fontsource/source-code-pro with font-display as specified, next-intl with /en and /fr routes and messages/{en,fr}.json, a root redirect page with the hashed inline language script and meta-refresh fallback, _headers for Cloudflare with the CSP of docs/04 §3, and the global styles (paper/ink, hairlines, focus ring, minus-sign helper, tabular numerals, French punctuation helper).

Build the Masthead and Footer, the layout, and every component of docs/05 §5 as typed React components under apps/web/components/ (ScoreGauge, CoverageBar, CategoryRows, BandChip, ConfidenceChip, EventCard, Timeline, RankTable, WeightSliders, WorldMap, CompareChart, CategoryDots, EventDiff, CiteThis, ChangesFeed, MethodologyTable, VersionSelector, DiffViewer, RightOfReplyBlock, SearchBox). Charts are hand-drawn SVG with d3-scale/d3-shape/d3-geo only (no chart library). Every component supports the Phase-1 mode and every state (no-data, unchecked, retracted, disputed, excluded, empty). Prepare the WorldMap TopoJSON from Natural Earth 1:50m admin-0 (public domain) simplified with mapshaper to ≤ 300 KB, keyed by ADM0_A3/ISO_A3_EH, with PSE and ISR flagged excluded.

Add a dev-only route /_kit that renders every component in every state using the fixtures, in EN and FR, plus an RTL pseudo-locale row. Then go through the anti-slop checklist (docs/05 §9) and the accessibility rules (§10) on /_kit and fix everything before finishing. Run axe on /_kit in a Playwright test.

Acceptance: `pnpm build` produces out/ with /_kit excluded in production; no default Tailwind colours or Inter anywhere (grep); axe clean; the components look like docs/05 describes (describe in the report what you would change and why, but do not deviate without saying so).

The API contract is packages/schema/src/api.ts, documented endpoint by endpoint in apps/web/public/api/README.md (P-05): components take their props from those types (`ApiScoredCountryFile`, `ApiEvent`, `ApiFeedEntry`…) and never re-derive a scoring rule; in scorecard mode they use the outputs made for it (`summary_scorecard`, `citations.scorecard`, the `.scorecard` monthly reports). Coverage in the API is the build-date coverage only (not recomputed for earlier dates): a CoverageBar shown beside a past-date gauge says so.
```

---

## P-07 — Home, Ranking and the map

```
/clear
```

```
Read CLAUDE.md, docs/05-design-system.md §6 (Home, Ranking) and §5, docs/04-architecture.md §3, docs/02-methodology-spec.md §9.

Implement /[locale] (Home) and /[locale]/ranking exactly as described: home with the one-line statement, the WorldMap with legend, movers up/down (7-day), "changed this week", search, ranking strip; ranking page with the RankTable (sortable, filterable by region, band, coverage ≥ 50 %, memberships), the collapsible WeightSliders with live re-rank computed client-side from the published clipped subtotals and passivity flags per docs/02 §9, URL state `?w=`, a "Copy link" and a "Download CSV" link. Both pages must render complete, meaningful HTML without JavaScript (the table sorted by score with all rows; the map as static SVG with country links). Phase-1 mode: alphabetical table, no scores, coverage map fill, copy from docs/05. Data comes from the build-data outputs at build time.

Add Playwright smoke tests (EN and FR, JS on and off) and Lighthouse CI with the budgets of docs/04 §3. Acceptance: budgets met; anti-slop checklist re-run on both pages; report screenshots' descriptions and any budget you could not meet.

Data (P-05): the RankTable and WeightSliders read countries.json: `categories.{A..D}.clipped` in full precision and `passivity.value`, recombined with `userScore` of @gai/scoring (docs/02 §9); `coverage.ratio` and `coverage.statuses` for the 31-segment micro bar; `last_change.date`; `events.total` in Phase 1. The map fill reads `band`, or `coverage.ratio` in Phase 1, and hatches excluded entities and countries whose A1 and A2 statuses are both no-data. "Moved this week" is `changes/latest.json` `movers.d7` (first five of `up` and `down`); "Changed this week" is its `recent` (first eight; unchanged computed values are already left out).
```

---

## P-08 — Country page, share cards, citations

```
/clear
```

```
Read CLAUDE.md, docs/05-design-system.md §5–§6 (Country, EventCard, Timeline, CiteThis, ShareCard, RightOfReplyBlock), docs/03-data-model.md, docs/02-methodology-spec.md §14.

Implement /[locale]/country/[iso3] for every scored entity with: title block, ScoreGauge + CoverageBar (never one without the other), generated summary line, CategoryRows, Timeline with event dots and the "data behind this chart" table, events list newest first with filters (indicator, sign, confidence) that work without JS via links and with JS via client state, EventCards with the exact evidence row (source, archived copy, truncated hash with copy), assessment table "What was checked" (collapsed), replies block, Cite/Share/Download JSON row, peers links, the `?date=` snapshot behaviour reading scores/{date}.json client-side with a visible "as of" banner, hreflang and canonical, og:image pointing at /cards/{iso3}.png, JSON-LD Dataset on the page. Excluded entities (ISR, PSE) get a single explanatory page each, not a scorecard.

Generated events need their own evidence presentation, same layout as other events: the table row as a small key/value list, then the archived dataset responses it cites (a D1 event cites up to eight FTS pages plus the location list and the GNI row) collapsed behind "n archived responses" with each Wayback link and hash; a B1 event also shows its press-release quote. Consecutive computed events of one indicator (D1 changes monthly, A2/C3 yearly) appear in the events list and the Timeline as one run showing only the dates the points changed, with the full monthly detail one click away, so 36 D1 months never bury the hand-authored events.

Build the share-card generator at build time with satori + @resvg/resvg-js from the same template for all countries (Phase-1 variant included), writing apps/web/public/cards/{iso3}.png, and wire it into `pnpm build`.

Acceptance: country page for the DEU fixture matches docs/05 in structure; identical layout for positive and negative events; page weight and Lighthouse budgets met; axe clean; VoiceOver-style reading order sensible (heading levels checked). Report.

Data (P-05): the page reads countries/{iso3}.json. The `?date=` snapshot reads scores/{date}.json (score, band, passivity flag, clipped subtotals) and keeps the build-date CoverageBar with a line saying coverage is as of the build date (P-05 publishes coverage for the build date only). Runs of computed values use `previous_points` (the value in force the day before; null for the first value and after a gap) and the `end` of the last value. The generated summary line counts acts only (spec §5 template, P-03 rule): a country whose score comes from computed values reads "0 events"; show beside it, in the page's own words, the number of computed values in force (event_list entries of type computed with `at_build.reason` counted) so that the card does not read as empty.
```

---

## P-09 — Compare and Changes

```
/clear
```

```
Read CLAUDE.md, docs/05-design-system.md §5–§6 (Compare, Changes, CompareChart, CategoryDots, EventDiff, ChangesFeed), docs/04-architecture.md §3.

Implement /[locale]/compare (up to five countries, URL state ?c= and ?w=, picker with search, CompareChart with direct labels and no legend, CategoryDots, EventDiff by month, Cite for the comparison; client-fetch of countries/{iso3}.json on demand; a no-JS fallback that explains and links to the country pages) and /[locale]/changes (ChangesFeed by ISO week with filters; month navigation; the monthly report Markdown rendered at /changes/{YYYY-MM}; a "stale build" notice when the build date is older than 3 days). The feed lists a computed event (D1 monthly, A1/A4 per SIPRI release, A2/C3 per Comtrade release) only when its points differ from the previous value for that country and indicator; unchanged recomputations are counted in one line per week, not listed. Acceptance: smoke tests EN/FR; budgets; anti-slop checklist.

Data (P-05): changes/{YYYY-MM}.json `weeks[].entries` carry `points_changed` (false only for a computed value equal to the value in force the day before) and each week counts `unchanged_computed`; `change: end` entries are standing states that ended and computed values that stopped with nothing following (the first day they no longer count). Render `changes/{m}.md` or `.fr.md`, and the `.scorecard` variants in Phase 1. The stale-build notice reads `manifest.json` `build_date`.
```

---

## P-10 — Methodology, Corrections, About, Data & API, Embed, Reply pages

**Before:** the project email address (tell the session), and confirm the About page text: the standpoint paragraph from spec §1, signed "Mohamed Zouad".

```
/clear
```

```
Read CLAUDE.md, docs/05-design-system.md §6, docs/08-governance.md, docs/09-accounts-and-costs.md, methodology/v1.0.0/methodology.en.md and .fr.md, and the API README from P-05.

Implement: /[locale]/methodology and /methodology/[version] (rendered from the methodology JSON and Markdown: version selector, indicator table, the formula via KaTeX rendered at build time plus a plain-language paragraph, decay, confidence, computed indicators, passivity, coverage, sensitivity tables rendered as tables, symmetry table, changelog, known limitations, the list of qualifying votes, and the DiffViewer when a diff.json exists); /corrections; /about (standpoint verbatim and signed, maintainer per D-01, reviewers section that reads a reviewers.yaml — "none yet" state included —, independence and funding, contact email {EMAIL}, hand-over note); /data (downloads, full API docs with examples, licences, dataset citation, reproducibility instructions with the manifest procedure); /embed (docs and live examples; the widget itself comes in P-11); /reply (process and the 10-day rule, links to the issue forms). Add sitemap.xml, robots.txt, llms.txt, and the JSON-LD for the Dataset on /data. French versions complete.

Acceptance: every page passes the anti-slop checklist and axe; no marketing language; the methodology page reproduces docs/02 faithfully (I will diff against it). Report any place where the methodology prose and the code disagree.

The methodology and data pages must also state the implementation choices of P-04 (packages/pipeline/src/fetch and generate; decided by the author 2026-09-27), each with its reason: D1 windows are the twelve calendar months before the month the value applies to; FTS flows count by their FTS date, including flows dated before 7 October 2023 that FTS lists under the flash appeals; government flows are attributed by FTS source location, with the organisation-id overrides of P-14 listed, and the remaining unattributed flows named; GNI is the latest World Bank year not after the window, else the most recent (some countries' latest year is old: list them); A4 leaves out orders of 2023 because SIPRI dates orders by year only; A2 and C3 use calendar-year Comtrade data valid from each reporter's first release of that year to the next; A2 counts HS 8526/8802 only where a confirmation is recorded; each dataset response is archived and the tables are built from the archived bytes (for Comtrade, the keyless preview queries, cross-checked with the keyed API). The /data page documents every structured table, including fts_plan_totals.csv and the `;`-separated `source` column.

The /data page documents every endpoint from apps/web/public/api/README.md (P-05), the yearly `dumps/scores-daily-{YYYY}.csv` files, build-notes.json and the reproducibility procedure (check out the manifest's `git.sha`, run `pnpm build:data --date <build_date> --site-url <site_url>`, compare with manifest.json; a build whose `git.dirty` is true cannot be reproduced from a clone). The methodology page states the reading of A1 coverage decided in P-05 (a SIPRI release in force covers every country: a non-supplier is none-found, s = 0; before the first post-war release, or with no release imported, A1 is no-data or left to the assessment) and that coverage is published for the build date only.
```

---

## P-11 — Embeddable widget

```
/clear
```

```
Read CLAUDE.md, docs/04-architecture.md §4, docs/05-design-system.md (ScoreGauge, Timeline).

Build apps/widget with Vite: a single script /embed/v1/gai.js (< 15 KB gzipped, no dependencies, Shadow DOM, self-contained styles matching the tokens, fonts falling back to system serif/sans) that reads data-country, data-view (gauge|timeline), data-lang (en|fr), fetches /api/v1/countries/{iso3}.json from the site origin (configurable via data-origin), renders, links back to the country page, respects Phase-1 mode, and degrades to a text link if fetch fails. Copy the built file into apps/web/public/embed/v1/ during `pnpm build`. Add live examples to /embed and a Playwright test that embeds it in a blank page. Report size and browser support.
```

---

## P-12 — Deploy, nightly build, headers, monitoring

**Before:** Cloudflare account; API token with Pages edit rights and the Account ID added as GitHub Actions secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.

```
/clear
```

```
Read CLAUDE.md, docs/04-architecture.md §5–§6, docs/09-accounts-and-costs.md.

Create the Cloudflare Pages project `gaza-accountability-index` from the CLI (wrangler pages project create; if the dashboard or CLI steers to Workers static assets, use that with the same free tier and say so), add .github/workflows/deploy.yml (on push to main: build:data, build, deploy out/; PR previews) and nightly.yml (cron 03:15 UTC: same, with --date of the run day; on failure open or update a GitHub issue "Nightly build failed"). Ensure the _headers file is applied (CSP, CORS on /api, /cards, /embed), that NEXT_PUBLIC_SHOW_SCORES=false and NEXT_PUBLIC_SITE_URL are set for production, and that the stale-build notice on /changes works from the manifest date. Add a quarterly workflow that checks every wayback_url in archive/index.csv returns 200 and opens an issue listing failures. Add the optional VPS mirror step (rsync over SSH) disabled by default with documentation. The structured fetchers stay local commands (they need the Internet Archive and Comtrade keys, and CLAUDE.md allows only the two Cloudflare secrets in Actions): do not add a fetch workflow with those keys; document the local procedure instead. The quarterly Wayback check requests the recorded `id_` URLs, and on a 200 also recomputes the SHA-256 of the decoded body (`curl --compressed`) and lists mismatches. Once the two secrets are in GitHub Actions, remove every CLOUDFLARE_* line from the local .env (keep IA_ACCESS_KEY, IA_SECRET_KEY, COMTRADE_KEY) and show `cut -d= -f1 .env` as evidence.

Deploy and give me the *.pages.dev URL. Acceptance: the live site serves every page in EN and FR with fixture data in Phase-1 mode; headers verified with curl; nightly workflow ran once manually (workflow_dispatch) and succeeded. Report the URL and anything that needs the dashboard.

Build-data needs the full git history: deploy.yml and nightly.yml check out with `fetch-depth: 0` (each corrections-log entry is linked to the mainline commit that added it; a shallow clone publishes null and a `history` build note), and both fail before deploying when build-notes.json has `counts.history` above 0 (`jq -e '.counts.history == 0' apps/web/public/api/v1/build-notes.json`). Run `pnpm build:data --date <run day>` before `pnpm build`. The API tree grows to roughly 45 MB with 193 countries (one scores/{date}.json per day; historical files change only when the data does, so a deploy uploads few files); a file above 25 MiB fails the build (the Cloudflare Pages limit). If dumps/gai-{date}.json comes near it (about 20 MB is expected after P-14), split it by record type and document the split in the API README.
```

---

## P-13 — Country registry (195 entries)

```
/clear
```

```
Read CLAUDE.md, docs/03-data-model.md §3, docs/07-country-list.md, docs/02-methodology-spec.md §1.

Fill data/countries.yaml for all 193 UN member states plus the Holy See and Palestine (ISR and PSE excluded with reasons): ISO codes, M49, names EN/FR from UNTERM short names, region and sub-region (M49), memberships with dates (UNSC permanent and elected periods 2023–2026 with exact terms; EU; NATO; Arab League; OIC; G20; G7; BRICS incl. 2024–2025 enlargements), recognises_palestine.since (use docs/06 §8 seed list and a reliable tracker for pre-2023 dates; mark uncertain dates with a note), and gov_sources with at least the foreign ministry and head-of-government sites for the 45 countries in docs/07 (URLs verified live with a fetch or a Wayback check; record lang). Also record each country's French name with its article as UNTERM gives it (l'Allemagne, la France, les États-Unis d'Amérique, Cuba without article) in a new optional field `name.fr_def` (schema, validation and a test that all 195 are set), so the generated summaries can name the country in French (P-18). Add a CSV export of the registry under dumps in build-data. Use web search and fetch; do not guess URLs — verify each. Where a fact cannot be verified, leave it null with a note. Acceptance: pnpm validate passes with no structured.iso3-known warning left except for codes outside the universe; a test asserts 193 scored entities and that packages/pipeline/src/universe.ts lists exactly the registry's codes; report the entries with nulls.

After filling the registry, run pnpm build:data and pnpm build:data:check: build-notes.json must list no `unregistered-country` note. Report the build time and the sizes of dumps/gai-{date}.json and the largest files (P-05 measured 2.8 s of scoring for 193 synthetic countries).
```

---

## P-14 — Structured data: votes, vetoes, SIPRI, Comtrade, FTS, recognitions

**Before:** Comtrade key in `.env`. The session downloads the UN voting CSV and the SIPRI exports itself with the built-in browser; approve the download prompts if the app asks. If a CAPTCHA blocks it, download the files yourself into `data/structured/raw/` (git-ignored if larger than 25 MB) and tell the session the names.

```
/clear
```

```
Read CLAUDE.md, docs/06-sources-playbook.md §2 and §8, docs/02-methodology-spec.md §2 (B1, B2, B3, B8) and §5, packages/pipeline.

0) Using the built-in browser (read-only, no login), download the UN Digital Library bulk GA voting CSV (record 4060887), the SIPRI TIV table (recipient Israel by supplier per year) and the SIPRI trade register (supplier Israel, all recipients, with order years and "SIPRI TIV for total order") into data/structured/raw/. Archive each file's download URL with `pnpm archive <url> --kind dataset --id src_…` and import from the bytes Wayback serves: the importers refuse a file whose SHA-256 differs from its archived source, and that check is not to be bypassed. If Wayback cannot capture a file, or a CAPTCHA blocks you, stop and ask me. The importers' formats were written in P-04 without the real files: before importing, compare each file's header and layout with packages/pipeline/src/import (UNDL column names, MARCXML 967 subfields, SIPRI title lines, Total row, order-year notation), fix the parsers and extend their tests with an excerpt of the real header if they differ, and report what differed.
1) Fill methodology/v1.0.0/votes.yaml with every qualifying vote: start from the seed table in docs/06 §2, verify each symbol, date and counts against the UN Digital Library record or the UN press release (archive the press release as the vote's official source with pnpm archive; each entry needs its verbatim `quote` stating the adoption and the recorded vote, and its `locator`, which pnpm validate checks against archive/text), search for any plenary Gaza/UNRWA/Palestine recorded vote since 7 October 2023 that the seed list misses (including 2026), and write the inclusion rationale for each. Then run pnpm import:unvotes on the bulk CSV plus per-record exports for votes after its cut-off, and reconcile counts with the press releases (report every discrepancy).
2) Fill data/structured/unsc_vetoes.csv from docs/06 §8, each verified against the UN meeting record (archived), with ceasefire true/false per docs/02 B2.
3) Run pnpm import:sipri on the exports (release date 2026-03-09 and, if available, the 2024 and 2025 releases for the time series) and archive the export files as dataset sources.
4) Run pnpm fetch:comtrade for the 45 countries of docs/07 (self and mirror), staying under the daily limit; commit comtrade_a2.csv and comtrade_c3.csv; list countries with no data. Save Page Now allows about five captures of one URL a day and answers 429 under load, and each reporter needs about ten captures: first change the fetcher so that Israel's mirror responses cover several partners per query (one period per call, at most 500 records), cutting the captures, with tests; run in batches over as many days as needed (the resume file skips reporters done). Also add data/structured/a2_confirmed_military.csv (iso3, hs, source), empty, read by build-data into the A2 generator's `confirmedMilitary`; a row needs an archived licence register, parliamentary answer or investigation citing the customs code (docs/02 §2 A2).
5) Re-run pnpm fetch:fts and pnpm fetch:worldbank. Then, in packages/pipeline/src/fetch/fts.ts, add attribution overrides keyed by FTS organisation id for government flows whose source location is missing or wrong (on 2026-09-27: United Kingdom, Government of, no location, 2 flows, USD 13.1M; Swiss Development Cooperation/Swiss Humanitarian Aid, no location; Qatar Fund for Development, no location; German Federal Foreign Office recorded at location Occupied Palestinian Territory). Each override is justified by the FTS organisation record (`/v1/public/organization/{id}`, archived as a dataset source and cited by the rows it changes); the Palestinian Authority and Jersey stay unattributed. Add tests, re-run, and report the totals before and after per plan. Then list the flows behind the USA's USD 600M in the window 2025-09-01…2026-08-31 (organisation, destination, date, status, flowType, newMoney, flow id) and report them; change nothing unless an FTS field shows the flow is not government funding under the rule of docs/02 §5, and ask me in that case.
6) Create data/structured/recognitions.csv (iso3, date, source id) from the seed list, each verified against an official statement archived with pnpm archive; the generator for B8 standing states reads this table (add it to packages/pipeline with tests).
7) Run pnpm build:data and pnpm score --country FRA --list and --country DEU --list; sanity-check every generated indicator (B1, B2, A1, A4, A2, C3, D1): points against a hand computation for two rows each, validity dates, and that countries with no Comtrade rows show A2/C3 no-data, not zero, while SIPRI non-suppliers show A1 none-found (s = 0).

Commit on branch data/structured and open a PR with a table of what was loaded, counts per table, and every unresolved discrepancy. Do not hand-author any event in this session.

Build-data wiring (P-05): pass the `a2_confirmed_military.csv` rows as `generateAll(ctx, structured, { confirmedMilitary })` in packages/pipeline/src/build/index.ts step 3 and in score-cli.ts, with a test. When the B8 generator reads recognitions.csv, add B8 to the derived statuses of packages/pipeline/src/build/assessments.ts only if the table decides a status for every country, with tests. Check the derived statuses after the imports: countries without Comtrade rows show A2/C3 no-data; a SIPRI release in force makes A1 none-found for every non-supplier (s = 0, the P-05 reading of docs/02 §5) and A4 none-found for every country that ordered nothing.
```

---

## P-D — Country research session (template; run once per country, 45 times in Phase 1)

Replace `{ISO3}` and `{WAVE}` (see `docs/07-country-list.md`). Wave order: 1 USA DEU GBR FRA ESP · 2 IRL ZAF TUR EGY IND · 3 ITA NLD CAN AUS BEL · 4 NOR SWE DNK CHE AUT · 5 SVN CZE HUN POL GRC · 6 JPN KOR CHN RUS BRA · 7 COL CHL MEX BOL ARG · 8 SAU ARE QAT JOR MAR · 9 IDN MYS DZA NGA AZE.

```
/clear
```

```
Today is {DATE}. Read CLAUDE.md, docs/06-sources-playbook.md fully, docs/02-methodology-spec.md §2–§4 and §8, docs/03-data-model.md §4–§6 and §10, and data/countries.yaml entry for {ISO3}.

Run the full per-country protocol of docs/06 §4 for {ISO3}, on branch data/wave-{WAVE} (create it from main or check it out if it exists). Cover every one of the 34 indicators in order; for each, either file events (source archived with pnpm archive, quote verbatim with locator, EN and FR summaries from the template, points and rationale, confidence per the rules, scope tags) or write the assessment entry with the queries used. Search in English, French and the country's official languages. Check the last 12 months first, then back to 7 October 2023. Put press/NGO claims without a primary in data/leads/{ISO3}.yaml. Include Lebanon/West Bank-related conduct as tagged, unscored events when you meet it, but do not search for it specifically. B1, B2, A1, A4, A2, C3 and D1 are generated from data/structured (D-08): never hand-author them; check the generated values against the country's own sources and report disagreements. If {ISO3} has no Comtrade rows yet, run `pnpm fetch:comtrade --reporters {ISO3}`. If you find an archived licence register, parliamentary answer or investigation confirming that HS 8526 or 8802 exports to Israel are military, add a row to data/structured/a2_confirmed_military.csv citing it.

Then do the second reading (docs/06 §1 rule 6): re-open every archived text in reverse order, confirm each quote and indicator match, and record second_read verdicts. Run pnpm validate and pnpm score --country {ISO3} --preview (the events are still drafts); read the result critically (dominant events, caps, band versus evidence) and write two sentences of judgment in the PR description, without changing any point to "fix" the band. Set status: reviewed on events that passed both readings.

Commit with a message listing event ids. If the PR for data/wave-{WAVE} does not exist, open it; otherwise push to it. Append to its description a table: event id, indicator, date, points, confidence, source kind. Stop after three hours of work even if incomplete, saying exactly what remains.

Do not fabricate anything. If a site cannot be fetched, say so and use the Wayback copy or the built-in browser to read only.
```

After each wave, the author reviews the PR, then runs:

```
/clear
```

```
Read CLAUDE.md and docs/03-data-model.md §11. Review mode: {full | sampled} (docs/01-plan.md §4; in sampled mode, first print a random 10 % sample of the branch's events with their quotes and archived-text excerpts for me to check, then wait for my go). For PR #{N} (branch data/wave-{WAVE}): run pnpm validate and pnpm build:data; on the PR branch, run pnpm publish:events --pr {N} to set status: published and review.reviewed_by: mzouad with today's date on every reviewed event that this PR adds or changes (only those I approved; here is the list of ids to exclude, if any: {EXCLUDED}); run pnpm validate, commit and push the edited files, then merge the PR with a merge commit; confirm the deploy succeeded and that the country pages are live; report the counts.
```

---

## P-15 — Calibration worksheet (after waves 1 and 2)

```
/clear
```

```
Read CLAUDE.md, docs/08-governance.md §3, docs/02-methodology-spec.md, and the published events for USA, DEU, GBR, FRA, ESP, IRL, ZAF, TUR, EGY, IND.

Produce docs/calibration/{ISO3}.md for each of the ten with the worksheet table of docs/08 §3, the computed score by category, the band, the three "does it feel right" reading slots left blank for human readers, and a section "what drives this score" naming the three largest contributions. Then write docs/calibration/README.md: the ten in a table, the ranking, and a critical review of the thresholds: which rule produced a surprising result and what change (with version bump) you would propose, with the sensitivity numbers from sensitivity.json. Include in the review the implementation choices of P-04 that affect scores, with numbers: D1 moving between tiers month to month, the effect of pre-war-dated FTS flows on the windows to September 2024, the GNI year for countries whose latest World Bank year is old, the exclusion of 2023 SIPRI orders from A4, and calendar-year A2/C3 validity. Do not change methodology files in this session. Commit on main.
```

---

## P-16 — Quality pass: consistency, tone, links, second-reading sweep

```
/clear
```

```
Read CLAUDE.md, docs/02-methodology-spec.md §12, docs/08-governance.md §5–§6, docs/06-sources-playbook.md §1.

Over the whole published dataset: (1) run and fix pnpm validate and every consistency check; (2) tone audit: read every summary EN and FR, remove adjectives and loaded terms, ensure the actor-first template, fix French typography (espaces insécables, guillemets); (3) check every wayback_url responds and every sha256 matches a fresh download of the snapshot (script it; the hash is of the body served at the recorded `id_` URL after HTTP content decoding, i.e. `curl --compressed`; a structured row's `source` may list several ids joined by `;`, check each; report mismatches as corrections candidates, do not silently fix); (4) a fresh second reading of a random 20 % sample of events against their archived text; (5) same-conduct-same-points check across countries (e.g. all January 2024 UNRWA suspensions at −10, all recognitions at +8); (6) list events at reported/disputed confidence and try once more to find a primary for each. File every change to a published event through data/corrections.yaml (these are the first public corrections; write the reasons plainly). Open a PR "quality pass 1" with the findings table.
```

---

## P-17 — Design critique and anti-slop pass

```
/clear
```

```
Read CLAUDE.md and docs/05-design-system.md fully. If the skills frontend-design, design:design-critique and design:accessibility-review are available, invoke them for this pass; otherwise proceed manually.

Run the site locally with real data (pnpm build:data && pnpm dev). Visit every page in EN and FR, at 360 px, 768 px and 1280 px, with JS on and off, and with prefers-reduced-motion. Score each page against the anti-slop checklist (docs/05 §9), the component specs (§5), the copy rules (§7), the chart rules (§8) and accessibility (§10). Fix everything you can; for judgement calls, list them with a recommendation. Pay special attention to: symmetric treatment of positive and negative events, the coverage bar never separated from the gauge, the passivity line, tabular numerals and the minus sign, French punctuation, the share cards (open ten PNGs and check them), the widget. Commit fixes on main. Report a before/after table per page.
```

---

## P-18 — French review

```
/clear
```

```
Read CLAUDE.md and docs/05-design-system.md §2 and §7.

Review every French string: messages/fr.json, methodology.fr.md, all event summaries FR, generated summary and citation templates, the About/Data/Reply pages, the issue forms. Correct grammar, register (sobre, factuel, pas de calques de l'anglais), typography (espaces insécables, guillemets, virgule décimale, majuscules), and terminology consistency (a glossary in docs/glossary.fr.md: bande, indicateur, couverture, passivité, état durable, événement répétable, confiance…). Keep the same meaning as the English. The monthly report templates (packages/pipeline/src/build/report.ts, including "Mode fiche d'évaluation") and the generated summaries (packages/pipeline/src/generate/*.ts) use "The country" / "Le pays" as the actor because the French names lacked articles: switch them, in both languages, to the country's name (EN name, FR `name.fr_def` from P-13), with the same template for every country, keep them within the tone lint and 200 characters, and update the generator tests. Then do a second, independent pass reading only the French as a francophone reader would, without the English beside it, and fix anything that reads as translated. Commit on main; report changed strings by area.
```

---

## P-19 — Security and code review

```
/clear
```

```
Read CLAUDE.md. If the skills security-review and engineering:code-review are available, invoke them on the whole repository; otherwise review manually.

Focus: CSP and headers on the live site; no secrets in git history (scan); dependency audit (pnpm audit) and pinning; the archiver's handling of untrusted HTML/PDF (packages/pipeline/src/lib/extract.ts: linkedom and Readability must not run scripts, pdfjs without eval, size limits on downloads and text); that no key can reach a URL, a log line, a source record or archive/text (Save Page Now keys only in the Authorization header, the Comtrade key only in its header, never in an archived URL); the local .env and .cache/ never tracked; GitHub Actions permissions (least privilege, pinned action SHAs); issue-form abuse; the widget's origin handling; the build's determinism; test coverage gaps in scoring. Fix what is safe to fix; open issues for the rest. Report.
```

---

## P-20 — Pre-launch checklist and launch in scorecard mode

**Before:** at least one entry in `data/corrections.yaml`; ≥ 500 published events; you have posted the calibration worksheet to two other readers (their notes can be added later).

```
/clear
```

```
Read CLAUDE.md, docs/01-plan.md §6, docs/08-governance.md.

Verify each launch criterion of docs/01 §6 with evidence (commands and outputs): EN/FR rendering without JS on every page, Lighthouse scores on /country/DEU, counts of events/sources/assessments, zero unchecked among the 45 countries, the corrections page non-empty, a fresh-clone reproducibility test comparing manifest.json hashes, banned-word lint, the nightly workflow's last run. Fix small issues; list blocking ones. Then: write the launch note as changes/launch.md (what the site is, what it is not yet — no score displayed —, how to report errors, how to reply), add reviewers.yaml (empty is allowed at scorecard launch), tag v0.9.0-scorecard, confirm the deploy, and give me the URL and a checklist of what only I can do next (domain, reviewers, distribution per spec §9).
```

---

## P-21 — Light-protocol sessions (Phase 3; three countries per session)

```
/clear
```

```
Today is {DATE}. Read CLAUDE.md, docs/06-sources-playbook.md §5 (light protocol) and §1, docs/03-data-model.md §4–§6.

Run the light protocol for {ISO3_A}, {ISO3_B}, {ISO3_C} on branch data/light-{N}: for each, load generated events (pnpm score --country X --list), verify recognition and ICJ/ICC status from the structured tables, scan the foreign ministry's Gaza/Palestine pages and one search per indicator group in English and the official language, file events only with archived primaries, write every assessment entry with queries, put leads aside. Second reading, validate, score, PR with the summary table. Stop at 90 minutes.
```

---

## P-22 — Flip the score (Phase 2), publish methodology v1.0.0

**Before:** reviewers listed in `reviewers.yaml` with their sign-off; three readers' notes added to `docs/calibration/`; you have decided on any threshold changes from P-15 (state them in the prompt or say "none").

```
/clear
```

```
Read CLAUDE.md, docs/08-governance.md §1, docs/02-methodology-spec.md §11, docs/01-plan.md §2 and §7.

Threshold changes decided by the author: {NONE or list}. Create methodology/v1.0.0 as the final version (from the rc, applying the changes with changelog entries and a diff.json), run the full build, and check the gates: no unchecked indicator among the 45 full-protocol countries, reviewers.yaml non-empty, corrections non-empty, sensitivity tables present. If any gate fails, stop and report; do not flip. Otherwise set NEXT_PUBLIC_SHOW_SCORES=true, write changes/index-launch.md (what the number is and is not, the passivity rule in one paragraph, how to change the weights, how to cite), tag v1.0.0, deploy, and verify the ranking, compare, sliders, cite, share cards and API on the live site. Report.
```

---

## P-23 — Monthly maintenance

```
/clear
```

```
Today is {DATE}. Read CLAUDE.md, docs/08-governance.md §6, docs/06-sources-playbook.md §2.

Monthly refresh on branch data/monthly-{YYYY-MM}: run fetch:fts and fetch:worldbank once each (Save Page Now allows about five captures of a URL a day; if a capture is refused or not served, re-run the next day rather than work around it); check for new qualifying UNGA votes and UNSC vetoes since the last run (verify, archive, add to votes.yaml as a minor version if any); in March, import the new SIPRI release; quarterly, refresh Comtrade for the 45 countries; scan for new events for the 45 countries over the last 35 days (news search per indicator group, then primaries, archived); file events and update assessments' last_full_check; process any open right-of-reply or error issues per docs/08 §4–§5 (draft the reply record or the correction, do not decide outcomes for me — propose); run the quality checks; generate the monthly report and review its text; open the PR with the summary table. Target: under two hours.
```

---

## P-24 — Methodology change proposal (template)

```
/clear
```

```
Read CLAUDE.md, docs/08-governance.md §1, docs/02-methodology-spec.md §11. Proposed change: {DESCRIBE}. Create methodology/v{X.Y.Z} from the current version with the change, a CHANGELOG entry with the rationale, and diff.json; build; open a PR with the diff table (every country moved ≥ 1 and why) and a draft GitHub Discussion post announcing the 14-day comment window ending {DATE+14}. Do not merge.
```

---

## P-25 — Right of reply or correction handling (template)

```
/clear
```

```
Read CLAUDE.md, docs/08-governance.md §4–§5, docs/03-data-model.md §8–§9. Issue #{N} is a {right of reply | error report} about {ISO3} events {IDS}. Read the issue and the events, re-check the archived sources, and draft on branch reply-{N}: the reply record (verbatim text, translation, our response) or the correction entry; set the events to disputed/corrected/retracted as the evidence warrants, with reasons; open a PR for my decision. Publication deadline: {DATE+10}. Propose, do not decide.
```
