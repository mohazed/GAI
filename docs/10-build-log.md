# 10 — Build log: decisions and changes since the plan

The plan is the state of `docs/00`–`docs/09`, `CLAUDE.md` and `PROMPTS.md` in the first commit (`5cb1005`, 2026-09-26). This file records everything decided after it: each choice a build session made where the plan was silent, ambiguous or wrong; each departure from the plan; each open question and what became of it; and every change to `PROMPTS.md`. Every session reads it with `docs/00-decisions.md` and adds its own entries before it ends. Cite entries as "per B-12".

Status words: **applied** (in the code, data or docs), **scheduled** (written into the named prompt, not yet done), **open** (needs the author).

## 1. The author's instructions during the build

| Date | Session | Instruction |
|---|---|---|
| 2026-09-26 | planning | Effort: high for every prompt, the maximum available for P-02, P-03 and P-05. |
| 2026-09-27 | P-02, P-03 | "push". The open questions of both reports were not answered one by one. |
| 2026-09-27 | P-04 | "go with defaults"; then "yes do it and push commits and change a bit in each coming prompt if needed but that doesn't mean settling for less." |
| 2026-09-27 | P-05 | "accept the defaults and push". |
| 2026-09-27 | P-06 | "accept the defaults and push, but make sure every post-start of building decision and change from the original plan that was made (that includes change of prompts) is written somewhere." (This file.) |
| 2026-09-27 | P-07 | "run P-07". |

Standing rule taken from these: a session's recommended defaults are adopted, and follow-ups are written into the prompt that must act on them, without lowering any requirement. The P-02 and P-03 questions left unanswered are adopted under that rule in §2 below (2026-09-27, P-06). A default that changes a score, a cap, a threshold, the passivity rule or the universe is **not** applied by editing `methodology/v1.0.0`: it goes through a new version folder, a changelog entry and `diff.json` (`docs/08` §1, prompt P-24), and P-15 decides the set before scores are shown (P-22).

## 2. Decisions by session

### P-01 — Repository bootstrap

| ID | Decision | Why | Status |
|---|---|---|---|
| B-01 | TypeScript 6.0.3, not 7.0.2. | TypeScript 7 has no JavaScript API; Next.js type-checks through it. | Applied; confirmed in P-06 (Next.js 16 type-checks with 6.0.3). |
| B-02 | `.env.production` is committed, public values only (`NEXT_PUBLIC_SHOW_SCORES=false`). Since P-06 it lives at `apps/web/.env.production`, where Next.js reads it, not at the repository root as docs/04 §6 says. | D-16 gate must be in the repository; Next.js reads env files from the app folder. | Applied. |
| B-03 | Issue labels `error-report`, `right-of-reply`, `lead` created for the issue forms. | The forms tag new issues. | Applied. |
| B-04 | Turn on GitHub private vulnerability reporting (SECURITY.md points to it). | Security reports should not be public issues. | Scheduled: P-12 (still off on 2026-09-27). |
| B-05 | Cloudflare values leave the local `.env`; only the two secrets in GitHub Actions. | CLAUDE.md: no secrets outside Actions. | Scheduled: P-12. |
| B-06 | Upgrade Git (this Mac has 2.15, 2017) before the data sessions. | Newer tools may need a recent Git. | Applied 2026-09-27: Git 2.55.0 from Homebrew; the 2017 installer's copy in /usr/local/git was removed with its own uninstall script (it shadowed Homebrew's in PATH). |

### P-02 — Schema package and methodology v1.0.0

Readings of docs/02 that could not be encoded literally:

| ID | Decision | Why | Status |
|---|---|---|---|
| B-07 | A6 is always a standing state; a suspension that ends gets its end date. | The schema allows one event type per indicator; docs/02 §3 made A6 standing only when open-ended. | Applied (A6 `notes`, CHANGELOG). |
| B-08 | B3, B5, B6 and C2 are standing (the final decision of docs/02 §3, whose earlier sentence called them repeatable). | docs/02 §3 contradicts itself. | Applied. The docs/02 wording is scheduled in P-10. |
| B-09 | A1 has no data before 2024-03-11, the date of SIPRI's first post-war release (checked on sipri.org). | docs/02 only said "March 2024". | Applied (`thresholds.yaml` a1 `no_data_before`). |
| B-10 | A4 counts orders signed from 2023-10-07 as a parameter; orders dated 2023 are left out because SIPRI dates orders by year only (P-04 default). | The date cannot be checked from SIPRI data. | Applied. |
| B-11 | A4 and C3 values hold from their source release to the next release. | docs/02 §5 is silent; the general rule of §3 for computed indicators. | Applied. |
| B-12 | A5 "confirmed instances only" defines an instance; no confidence restriction is added. | The schema has no per-indicator confidence field. | Applied. |
| B-13 | The scaled list (docs/02 §12.1: A5, B9, B12 tiers) is extended to every indicator whose points differ between events: A1, A2, A4, A5, B1, B8, B9, B11, B12, C1, C3, C4, D1, D3. | They need a `points_rationale`. | Applied (CHANGELOG). docs/02 wording scheduled in P-10. |
| B-14 | The docs/02 §7 worked example is reproduced with s = 0.3025 and a vote 462 days old (d = 0.8007): −40·√0.30 gives −21.9, not −22, and d = 0.8 cannot occur with whole days. | Keep −13.6 / −14 (Passive) exact. | Applied in tests and the methodology page; docs/02 text scheduled in P-10. |
| B-15 | Quotes of B9/B10 are always checked against `archive/text`; other quotes are exempt only for dataset rows and `official-video` timestamps. | docs/02 §12.4 and docs/03 §4 differed. | Applied. |
| B-16 | B8 is generated (from the registry, then from `recognitions.csv`), though D-08 does not list it. | It is a table of dated recognitions. | Applied; `recognitions.csv` scheduled in P-14. |
| B-17 | B2: one fixed −20 event per veto, no indicator cap. | docs/02 gives no cap. | Applied. |
| B-18 | The "to be verified" examples of docs/02 (United States and Hungary B4 declarations) are not encoded. | Unverified. | Applied (left out). |
| B-19 | Three validator rules the docs do not list: events on or after 2023-10-07, dates in order (retrieval, review, correction, reply), no duplicate rows in structured tables. | Integrity. | Applied. |
| B-20 | `banned-words.txt` has 280 EN/FR entries; the methodology page tables are generated from the YAML (`pnpm methodology:render`). | The page cannot drift from the files. | Applied. |

P-02 open questions (defaults adopted 2026-09-27 under §1's rule):

| ID | Question → default | Status |
|---|---|---|
| B-21 | `confirmed` accepts only official, court or dataset sources, so an official video or a parliamentary answer can never be `confirmed` → add `official-video` and `parliamentary` to `confirmed`. | Scheduled: P-15 decides, P-24 applies (confidence changes scores). |
| B-22 | Fixed standing indicators add up (several B7 designations each −20) → "most severe" stacking for A3, A6, A7, B3, B7, D2 (same as P-03 question 6). | Scheduled: validator warning in P-14; the stacking change in P-15/P-24. |
| B-23 | A state that only votes yes lands in Acting (about +1.7), not Passive as spec §2 says → decide in P-15 (a B1 cap is one option). The methodology page already makes no band claim for yes-only voters. | Scheduled: P-15. |
| B-24 | Passivity: a −5 denial ends the penalty; standing states older than 365 days never qualify → keep docs/02 literally for rc.1, revisit in P-15 (see B-37, B-38). | Scheduled: P-15. |
| B-25 | B8 needs a source → `recognitions.csv` (iso3, date, source). | Scheduled: P-14 (in the prompt). |
| B-26 | Read literally, docs/02 §3 gives an event with status `corrected` zero points → a corrected event keeps `status: published` with a higher `revision` and a corrections-log entry (the fixture does this); `superseded` is for re-filed records (same as P-03 question 5). | Applied in the fixture and the site (P-06 reads `revision`); P-25 reworded in P-06. |
| B-27 | A change of `end`, `scope` or `status` changes a score without a corrections entry → require an entry for those too. | Scheduled: P-14 (validator). |
| B-28 | `not-applicable` is accepted on any indicator with a note → error unless the indicator defines a not-applicable rule (only B2 does). | Scheduled: P-14 (validator). |
| B-29 | Fixture hashes are of the decoded page (`curl --compressed`) → that is the rule. | Applied in P-04; stated in P-16. |
| B-30 | A2 has nowhere to record the document confirming that HS 8526/8802 flows are military → a confirmation table. | Scheduled: `a2_confirmed_military.csv` in P-14, research in P-D. |
| B-31 | `unsc_vetoes.csv` must cite a dataset source but P-14 cites UN meeting records → allow archived official sources in that table. | Scheduled: P-14 (validator). |
| B-32 | Scope: settler sanctions (B11), settlement goods (C4) and divestment (C5) often concern the West Bank → tag `gaza` only when the act or its document cites Gaza; West Bank acts are tagged `west-bank` (scored from v2.0, D-14). | Scheduled: P-D. |
| B-33 | D1's name says "per capita of GNI", the formula is a share of GNI → rename in the first wording patch. | Scheduled: P-10 (P-05 default). |
| B-34 | P-12 said "deploy with fixture data", but the fixtures include a synthetic correction and reply → deploy the real `data/` tree, never the fixtures. | P-12 reworded in P-06. |
| B-35 | Fix the wording of docs/02 (§3 type list, §7 example, §12.1 scaled list, §14 example) and docs/00 deviation 6. | Scheduled: P-10 (wording only; no rule changes). |

### P-03 — Scoring engine

Readings of docs/02 (a five-reader audit found 63 items; these change scores or outputs):

| ID | Decision | Status |
|---|---|---|
| B-36 | Worked example as in B-14. | Applied. |
| B-37 | Passivity, literal: an event's own p·w·d is compared with 2 before stacking; a standing event qualifies from its start date, so it stops qualifying 365 days after it began even while it holds; negative events qualify; scope must be `gaza`; the penalty applies from 2023-10-07. | Applied (rc.1). Questions in B-46–B-48. |
| B-38 | "Most severe" (B8, B12, C1, C4, D3) is chosen by points, not points × confidence weight; B5/B6 on the same day: the greater id wins. | Applied; the methodology page must say it (P-10). |
| B-39 | Only `published` events score; `corrected` and `superseded` contribute 0 (see B-26). | Applied. |
| B-40 | The display integer is rounded from S in full precision, not from the one-decimal score (−20.46 shows score −20.5 and display −20). | Applied. |
| B-41 | Coverage: B2 is not applicable when no Security Council term overlaps 2023-10-07…t; A1 is no-data for everyone before 2024-03-11; a hand-set `has-events` without a published event becomes `unchecked`; `missing` = no-data + unchecked; the §14 example's ratio is 21/30 = 0.70, not 0.71. | Applied; §14 wording in P-10. |
| B-42 | Sensitivity: ranks from full-precision scores, average ranks for ties; variants 3–5 rescore and can change who is passive; variant 3 moves only `reported`, not `disputed`. | Applied. |
| B-43 | Outputs: event counts leave out computed values; movers use the integer display score; permalinks carry `/en` or `/fr`; the version prints `1.0.0-rc.1`. | Applied. |
| B-44 | Engine guards: a standing or computed state dated before 2023-10-07 counts from 2023-10-07; two overlapping computed values of one indicator are refused. | Applied. |
| B-45 | `pnpm score --preview` scores drafts as if published (docs/06 §4 step 7 and P-D use it); `--list` lists one country's events. | Applied. |

P-03 open questions (defaults adopted 2026-09-27 under §1's rule):

| ID | Question → default | Status |
|---|---|---|
| B-46 | Negative events lift passivity (a D2 suspension scores above doing nothing) → only contributions of +2 or more qualify. | Scheduled: P-15/P-24 (changes scores). |
| B-47 | The pre-existing recognition (B8 +3, dated 2023-10-07) lifts passivity for about 137 states for a year, then all drop 15 points on 2024-10-06 → the pre-existing tier does not qualify. | Scheduled: P-15/P-24. |
| B-48 | Open-ended states stop lifting passivity 365 days after they start → keep (docs/02 §6 literal). | Applied (rc.1); P-15 reviews with B-46/B-47. |
| B-49 | Most-severe by points lets a weakly sourced severe measure lower a score → keep, and state it on the methodology page. | Scheduled: P-10. |
| B-50 | Corrections keep `status: published` with a revision bump (B-26); P-25 said "set … corrected". | P-25 reworded in P-06. |
| B-51 | Overlapping A3/B7/D2 records sum → validator warning now, most-severe in the next version (B-22). | Scheduled: P-14 warning; P-15/P-24. |
| B-52 | Fix the docs/02 §7 and §14 examples (s = 0.3025 at Δ = 462; ratio 0.70; a generated id with its slug). | Scheduled: P-10. |
| B-53 | Start dates of windowed computed values (A2, C3, D1). | Applied in P-04: D1 windows are the twelve calendar months before the month the value applies to; A2/C3 hold from each reporter's first release of the year's data (`release_date`). |
| B-54 | The short indicator labels of generated text live in `packages/scoring/src/labels.ts`, not in the methodology → move them to `indicators.yaml` `short` at the next version. | Scheduled: P-15/P-24 (wording, patch version). |
| B-55 | Align D-11, the docs/00 deviations (C3 ratio 0.9, the A2 note citing D-26) and the spec's five weight sliders (docs/02 §9 has four: E is unscored) with docs/02. | Scheduled: P-10 (wording). |
| B-56 | Validator checks: same-day B5 and B6 for one country; a D2 still open after a D3 starts; overlapping computed values. | Scheduled: P-14. |

### P-04 — Pipeline tools (defaults accepted: "go with defaults")

| ID | Decision | Status |
|---|---|---|
| B-57 | Every dataset response is saved with authenticated Save Page Now and the tables are built from the archived bytes (`id_` URLs), never from a separate live call; the anonymous save endpoint is never used. | Applied. |
| B-58 | Comtrade's keyed API cannot be archived (the key would be in the URL): the data of record are the keyless `/public/v1/preview/…` queries, archived; two keyed calls per reporter cross-check them. | Applied. |
| B-59 | A structured row's `source` may list several dataset source ids joined by `;`. New table `fts_plan_totals.csv` (reference, does not score). The Comtrade tables gain `release_date`. `votes.yaml` entries carry the verbatim `quote` and `locator` of their press release. | Applied (docs/03, CHANGELOG). |
| B-60 | FTS: donor organisation type `Governments` (FTS's spelling; docs/02 says "Government"); flows counted by their FTS date, including 67 flows dated before 7 October 2023 in the flash appeals; the location list from `/v2/public/location` (the v1 capture was never served). | Applied; stated on the methodology page in P-10; effect measured in P-15. |
| B-61 | FTS flows with a missing or wrong location: overrides keyed by FTS organisation id for the United Kingdom, Swiss SDC, Qatar Fund for Development and the German Federal Foreign Office, each justified by the archived FTS organisation record; the Palestinian Authority and Jersey stay unattributed. The USA's USD 600M in the latest window is listed and nothing changes without asking the author. | Scheduled: P-14. |
| B-62 | D1 uses the latest World Bank GNI year not after the window, else the most recent (old years: Liechtenstein 2009, Eritrea 2011, South Sudan 2015, Yemen 2018, Cuba 2019, Syria 2022). | Applied; stated in P-10; measured in P-15. |
| B-63 | A2 and C3 use calendar-year Comtrade data, valid from each reporter's first release of that year to the next. | Applied; stated in P-10. |
| B-64 | HS 8526 and 8802 are kept in `comtrade_a2.csv` but counted only when a confirmation is recorded (B-30). | Applied; table in P-14. |
| B-65 | Generated summaries use "The country" / "Le pays" as the actor until the registry has French names with articles. | Scheduled: `name.fr_def` in P-13, summaries switched in P-18. |
| B-66 | The importers (`import:unvotes`, `import:sipri`) were written from docs/06 without the real files; they refuse a file whose hash differs from its archived source. | Scheduled: P-14 checks the real formats first. |
| B-67 | Save Page Now allows about five captures of one URL a day and answers 429 under load; fetchers wait for fresh captures and capture once more if one is not served. | Applied; P-14 and P-23 plan around it. |
| B-68 | The fetchers stay local commands (they need the Internet Archive and Comtrade keys; only the two Cloudflare secrets may be in Actions). | Scheduled: documented in P-12. |
| B-69 | CI runs the package test suites one at a time, with 30 s test timeouts (two-core runner). | Applied. |

### P-05 — Build-data (defaults accepted: "accept the defaults and push")

| ID | Decision | Status |
|---|---|---|
| B-70 | Coverage is published for the build date only; `scores/{date}.json` and the series carry none (the assessments record what was checked, not when). | Applied; the site says so (P-06); the methodology page states it (P-10). |
| B-71 | `dumps/scores-daily.csv` is split by year (`scores-daily-{YYYY}.csv`); any file above 25 MiB fails the build (Cloudflare Pages limit); `gai-{date}.json` is split by record type if it nears the limit. | Applied; measured in P-12/P-13. |
| B-72 | `pnpm publish:events --pr N` added (CLAUDE.md required it; no prompt did): run on the PR branch while the PR is open, only on events the PR adds or changes; CI flips nothing. | Applied (docs/03 §11, docs/06 §4 step 10, P-D). |
| B-73 | A1 when a country has no SIPRI row: once a release is in force, a non-supplier is none-found (s = 0), per docs/02 §5, not no-data as the P-05 prompt said. | Applied; P-14 wording corrected; stated in P-10. |
| B-74 | A country scored only from computed values reads "0 events" (the summary template counts acts); the country page shows the number of computed values in force beside it. | Scheduled: P-08. |
| B-75 | The D1 name and the D-26 citation (B-33) go into the first methodology wording patch through docs/08. | Scheduled: P-10. |
| B-76 | The repository allows only merge commits, so a correction's commit keeps its first parent at the previous version of the event. | Scheduled: P-12. |
| B-77 | An event left out of a review is published later only if a later pull request changes it. | Applied. |
| B-78 | Only public events enter a country's scoring pass; the banned-word pre-check skips invisible format characters (Node 22 performance), with identical matches. | Applied. |

### P-06 — Web foundation and component kit (defaults accepted: "accept the defaults and push")

| ID | Decision | Why | Status |
|---|---|---|---|
| B-79 | JavaScript budget: ≤ 150 KB gzipped per page in total, of which application code ≤ 25 KB; LCP < 1.5 s unchanged. Replaces "country page ≤ 120 KB" of docs/04 §3. | The Next.js 16 runtime and React DOM alone weigh about 131 KB (application code in P-06: about 7 KB). | Applied in docs/04 §3; enforced since P-07 (postbuild on the chunks, Lighthouse CI on the wire; B-101, B-103). |
| B-80 | Scorecard mode draws the gauge bar in neutral grey with hairline band boundaries, no band colour, no marker, no number. | docs/04 §3 says no band colour in Phase 1; docs/05 §5 says the bar is drawn without a marker; this satisfies both. | Applied. |
| B-81 | The map hatches countries whose A1 and A2 are both no-data only when the score is hidden (scorecard mode); in score mode they keep their band fill. Excluded entities are always hatched. | docs/05 §5 says "when score is hidden"; P-07's wording differed and was aligned. | Applied; P-07 aligned. |
| B-82 | Scorecard-mode category counts are computed on the site (`lib/events.ts`), with a test keeping them equal to the API's `events.total`, until the API publishes `events.by_category`. | The API has no per-category count. | Superseded by B-95 (P-07): the API publishes the counts; `lib/events.ts` is deleted. |
| B-83 | Percentages: "71%" in English, "71 %" (narrow no-break space) in French, as the generated summary line writes them; docs/05's "Coverage 71 %" is the French form. | One form per language across the site and the API text. | Applied; docs/05 §2 notes it. |
| B-84 | The site builds with webpack (`next build --webpack`, `experimental.extensionAlias`). | Turbopack cannot map the packages' NodeNext `import './x.js'` to `x.ts`. | Applied (docs/04 §3). |
| B-85 | CSP: the header allows `'unsafe-inline'` scripts and every HTML page carries a `<meta>` CSP listing the SHA-256 of each of its inline scripts (Next.js writes different inline scripts into every page, too many for one header); `style-src 'self'` with no inline styles; no `upgrade-insecure-requests`; `frame-ancestors 'none'` and `X-Frame-Options: DENY` (the widget is a script, not an iframe). The build fails on a page without its meta, on inline styles, on `/_kit` in production, on Inter, on `oklch()` colours or any colour outside the tokens. | docs/04 §3 asked for "no inline scripts except the language redirect", which Next.js cannot give. | Applied (docs/04 §3, `public/_headers`); P-07 inlines the stylesheet as a hashed `<style>` (B-102). |
| B-86 | Charts are SVG without a viewBox, positioned in percentages, step lines in a nested stretched SVG with non-scaling strokes; tooltips are an enhancement over `<title>`; charts keep a left-to-right axis in right-to-left pages and signed numbers are isolated LTR (`.num`). | Responsive with no JavaScript and no inline styles (B-85). | Applied. |
| B-87 | Map geometry: Natural Earth 1:50m admin-0 v5.1.2 (SHA-256 pinned), Antarctica left out, keyed by `ISO_A3_EH` else `ADM0_A3`, simplified with mapshaper 0.7.68 run through `npx` (not a dependency: it pulls native SQLite builds), rendered as integer relative paths with an absolute start per ring; territories outside the registry keep the neutral fill; map links are out of the tab order (the ranking table carries the same data). | Size (146 KB file, 16 KB gzipped inline) and accuracy. | Applied (`apps/web/map/README.md`). |
| B-88 | The dev-only `/_kit` is built only in `next dev` and `build:kit` (`.kit.tsx` page extension, `GAI_KIT=1`, output `out-kit/`). States the fixtures lack use synthetic samples labelled "Kit sample", codes XAA–XAE and a synthetic source, never a real document. Browser tests (axe WCAG 2.2 AA per kit row, 375 px with nothing reaching into the gutter, no-JS, CSP, redirect) run on the kit build, which contains the production pages. The gutter check was added after the first CI run on Linux found a 3 px overflow that macOS text metrics hid (CategoryRows now wraps its capped line on phones). | docs/05 §5 kit; no invented quote under a real source. | Applied; CI runs them. |
| B-89 | Weights: `?w=` written with plain commas (docs/02 §9 form); the weights panel is a `<details>` collapsed by default, rendered only once JavaScript runs (P-07: in the HTML from the start, hidden without scripting, B-105), in score mode only. `combine`, `userScore` and `bandFor` of @gai/scoring take only categories, clip and bands (`CombineModel`, type change only). | docs/05 §6; the browser recomputes S without the indicators. | Applied. |
| B-90 | CompareChart and CategoryDots in scorecard mode: one sentence, then a table of published events by category and country. | D-16: no score before the flip. | Applied. |
| B-91 | EventCard's evidence row names the publisher as the source link (title in the tooltip) instead of the literal word "Source"; the end date of a standing state sits on its own line; a line says why an event does not count at the build date; an ended state in the changes feed shows its points struck through, "no longer counted". | Legibility within docs/05's layout. | Applied. |
| B-92 | French terms follow methodology.fr.md: « bande » (band), « catégorie » (A–E), « mode fiche » (scorecard), « généré le », « non applicable »; French spacing is added to the messages automatically; colons live inside the messages. | Consistency (P-18 glossary). | Applied. |
| B-93 | `/` is `app/page.tsx` under a pass-through root layout (next-intl without middleware); the 404 page is bilingual; canonical and hreflang links are set per page (`lib/seo.ts`), never in the layout. | Static export; a layout's `alternates` would give every page the home page's canonical. | Applied. |
| B-94 | Next.js's `agentRules` is off (`next dev` otherwise writes its own AGENTS.md and CLAUDE.md into apps/web). pnpm build scripts of `@parcel/watcher` and `@swc/core` are denied (unused next-intl extractor). `pnpm build` runs `pnpm build:data` first; Turborepo does not cache the site build. | The repository's CLAUDE.md governs sessions; fresh builds for deploys. | Applied. |

### P-07 — Home, Ranking and the map

| ID | Decision | Why | Status |
|---|---|---|---|
| B-95 | The API publishes `events.by_category` (A–E, adding up to `events.total`) on every scored country in countries.json and countries/{ISO3}.json, counted by `eventCategoryCounts` of @gai/scoring over the same events as `eventCounts`, with each indicator's category from the methodology. The site reads it; `lib/events.ts` is deleted (with its unused `signOf`). | P-07 prompt; B-82. | Applied (api.ts, build-data, API README, tests). |
| B-96 | "Download CSV" links two new dumps: `dumps/countries.csv` (every registry entry at the build date in ranking order: score, band, passivity, the clipped subtotals and passivity value in full precision so that a reader can apply other weights, coverage counts, events, last change) and `dumps/countries.scorecard.csv` (the same entries by ISO3 with nothing derived from the score: coverage, event counts by confidence and by category, latest event). The ranking page links the one of its mode; the file holds the published scores at the default weights, and the page says so. | No existing dump was the ranking table; the scorecard variant follows the monthly reports (D-16). | Applied (docs/04 §2, API README). |
| B-97 | Home in scorecard mode: the movers and the ranking strip, made of scores, are not shown; "Changed this week" takes the full width; a "Scorecards by country" section links the alphabetical list (`/ranking/#countries`). On phones the map is hidden (`hidden md:block`) and the ranking strip, below the search box, stands in for it; the DOM order is not changed to move it up. | D-16; docs/05 §5 WorldMap; reading order equal to visual order. | Applied. |
| B-98 | "Changed this week" lists the entries of `changes/latest.json` `recent` dated after `movers.d7.from` and on or before the build date (the movers' window), the first eight, with a link to the changes page; the count comes from `weeks`, which hold the whole window (`recent` stops at 20). With none: the count line ("No change dated in the seven days to …") and a link. | The heading states a fact only if the entries are from this week. | Applied. |
| B-99 | Page copy: home map heading "Countries by band, {date}" / "Research coverage by country, {date}"; ranking title "Ranking of N countries" / "Countries in the index" (scorecard); one sentence with the build date and the methodology version; excluded entities after the table (D-10). | docs/05 §6, §7 (headings state facts). | Applied (messages EN and FR). |
| B-100 | Two test builds: the kit build (`build:kit`, out-kit/) is built with `NEXT_PUBLIC_SHOW_SCORES=true`, so its production pages are the score-mode pages; out/ (`pnpm build`) is the scorecard mode as deployed. Playwright has one project for each (`score`, `scorecard`): the page smoke tests run in both, the kit tests in `score`. | Score mode could not be tested before the flip otherwise (D-16). | Applied (CI builds both before `test:e2e`). |
| B-101 | `postbuild` checks the JavaScript budget on every production page: framework = `rootMainFiles` + `polyfillFiles` of the build manifest, `noModule` scripts left out, gzip of each file; the table goes to `apps/web/.js-weights.txt`. It found `MastheadNav` (a client component) importing `switchLocalePath` from `lib/i18n.ts`, which shipped both message files in every page's layout chunk (4.8 KB gzipped, ranking page at 150.5 KB): the helper moved to `lib/locale-path.ts`, and `postbuild` fails if a client chunk contains a message file. Result: framework 128.4 KB; application code 14.5 KB on home (142.9 KB in total) and 17.3 KB on ranking (145.7 KB), 11.8 KB of which is next-intl's ICU formatter (next-intl's experimental message precompilation was not used: French spacing is applied to the message strings at runtime). | B-79. | Applied. |
| B-102 | The stylesheet is inlined into each page (`experimental.inlineCss`): on Lighthouse's slow 4G a render-blocking stylesheet costs a round trip of about 560 ms; LCP measured 1.35–1.66 s without it and 0.68–0.89 s with it. The per-page CSP meta lists the SHA-256 of each `<style>` in `style-src`; the header gains `style-src 'unsafe-inline'`, narrowed by the meta as for scripts; style attributes stay refused (the build fails on one, and hash-sources never allow them). Next.js 16 writes bundled assets' `url()` without the `/_next` prefix in inlined CSS, and its RSC payload repeats the stylesheet in length-prefixed rows that must not be edited (an edit broke hydration, React error 412, in this session's first attempt): the fonts are therefore copied to `public/fonts/` with the package version in the name (`scripts/fonts.ts`), and the build fails on any `url()` to a file missing from the output. The payload's copy adds about 12 KB gzipped of HTML per page. | docs/04 §3 LCP budget. Departs from B-85's "no inline styles"; the policy stays hash-only for pages. | Applied (docs/04 §3). |
| B-103 | Lighthouse CI (`apps/web/lighthouserc.cjs`, `pnpm --filter @gai/web lighthouse`, a CI step) on out/: 3 runs each of /en/, /fr/, /en/ranking/, /fr/ranking/, medians asserted: LCP ≤ 1500 ms, JavaScript transferred ≤ 150 KB, CLS ≤ 0.001, accessibility, best practices and SEO 100. "A mid-range phone" is Lighthouse's default mobile profile (Moto G Power, 4× CPU slowdown, slow 4G: 150 ms RTT, 1.6 Mbps), **applied** to the browser (`throttlingMethod: 'devtools'`), not simulated. Final build: LCP 0.68–0.89 s applied; the simulated estimate is 2.1–3.0 s, because on a local server every script and font arrives before the first paint and the simulation then charges them all to LCP, although a real slow connection paints before the asynchronous scripts arrive. CLS limit 0.001, not 0: the swap of the text face over its metric-matched fallback leaves sub-pixel movement of inline links (0.0001–0.0004 measured). | P-07 prompt; docs/04 §3. | Applied; method and CLS limit are open questions 1 and 2 of the P-07 report (defaults adopted). |
| B-104 | Metric-matched fallbacks for the text face: `Source Sans 3 Fallback` (Arial or Liberation Sans with `size-adjust` 92 % up to weight 500 and 88.9 % from 600, ascent and descent overrides from Source Sans 3's 1.024 and 0.400 em) and `Source Sans 3 Caps Fallback` (83.4 %) for the uppercase navigation; ratios measured in Chromium on the 580 text strings of the home, ranking and kit pages in both languages. The home page's shift went from 0.041 to 0; no element changes height when the font swaps, on the four pages at 412 px. Newsreader keeps its optical-size file (132 KB; the weight-only file, 58 KB, made no difference with applied throttling). | docs/04 §3 "no layout shift from fonts", with `swap` kept for text. | Applied (globals.css). |
| B-105 | The ranking filters and the weights panel are in the HTML from the start with a `.js-only` class hidden by `@media (scripting: none)`, instead of being rendered after hydration (P-06); the sort headers have the same 24 px box before and after hydration. Inserting them after hydration shifted the table (CLS 0.09). Browsers without the `scripting` media feature (before Chrome 120, Firefox 113, Safari 17) show the controls, inert, when JavaScript is off. | CLS budget; docs/05 §9 item 15 (no dead controls without JavaScript). | Applied (tests check them hidden without JavaScript). |
| B-106 | `_headers`: `/_next/static/*` and `/fonts/*` get `Cache-Control: public, max-age=31536000, immutable` and lose the page-level headers (CSP, Permissions-Policy, Referrer-Policy, X-Frame-Options; `nosniff` stays) through Cloudflare's `! Header` lines, which `scripts/serve.ts` now applies too: they only concern documents and added about 600 bytes to each script response, which Lighthouse counts as JavaScript on the wire. `serve.ts` also gzips text responses, as the CDN does. | Budget measured on the wire; caching. | Applied; P-12 checks the `!` lines on Cloudflare Pages. |
| B-107 | A favicon, `app/icon.svg` (ink square, white serif "G", titled): every page logged a `/favicon.ico` 404, which fails Lighthouse's best-practices score. | A clean console. | Applied; open question 4 of the P-07 report. |
| B-108 | `mapCountries`, `searchCountries`, `rankingOrder`, `stripFrom` / `rankingStrip` and `changedThisWeek` (`lib/countries.ts`) are shared by the pages and the kit; the kit gains `Movers` and `RankingStrip` specimens (synthetic XAA–XAE). `Movers` shows the integer display delta and "from → to" per country, one layout for both directions. | One implementation per component (docs/05 §5). | Applied. |

## 3. Changes to PROMPTS.md since the plan

Every change adds or specifies; none removes or loosens a requirement. By prompt:

| Prompt | Added (by which session) |
|---|---|
| P-05 | Step 3 generates events with `generateAll`, checks each against the Event schema and the tone lint (a failure fails the build), writes generator notes to `build-notes.json`, and derives the assessment status of the generated indicators from the tables (P-04). |
| P-06 | The API contract (`api.ts`, the API README): components take API types, never re-derive a scoring rule, use the scorecard outputs, and a CoverageBar beside a past-date gauge says coverage is as of the build date (P-05). |
| P-07 | Which API fields the table, sliders, map, movers and "changed this week" read (P-05); the P-06 components to use; the JS budget (B-79); the map hatch rule (B-81); `events.by_category` in the API (B-82) (P-06). |
| P-08 | Evidence presentation of generated events and runs of computed values (P-04); `?date=` snapshots, `previous_points`, the "0 events" card with computed values beside it (P-05); the P-06 components, generated-event evidence still to add to EventCard, share cards not started (P-06).; category counts from `events.by_category` (B-95), the country page in Lighthouse CI, controls in the HTML with `.js-only`, no client import of `lib/i18n.ts`, fonts at `/fonts/` (P-07). |
| P-09 | The feed lists a computed value only when its points change (P-04); `points_changed`, `unchanged_computed`, end entries, the four monthly reports, the stale-build notice (P-05); the P-06 components and client versions of the compare components (P-06).; category counts from `events.by_category`, compare and changes in Lighthouse CI and the smoke tests, the same CLS and client-import rules (P-07). |
| P-10 | The P-04 implementation choices stated on the methodology and data pages (P-04); the API endpoints, scores-daily files, build notes, reproducibility procedure, the A1 coverage reading, the two wording mismatches through docs/08 (P-05); the P-06 components (P-06); the docs/02 and docs/00 wording fixes and the "most severe by points" statement (B-35, B-49, B-52, B-55) (P-06).; the Data page lists `dumps/countries.csv` and `countries.scorecard.csv` (B-96) (P-07). |
| P-12 | Fetchers stay local, the quarterly Wayback check recomputes hashes, the Cloudflare keys leave `.env` (P-04); full git history in the deploy workflows and the `history` build-note gate, `build:data` before `build`, the 25 MiB limit and dump split, merge commits only (P-05); deploy the real data tree, never the fixtures (B-34), private vulnerability reporting on (B-04) (P-06).; check that Cloudflare Pages applies the `! Header` lines and the immutable caching of assets (B-106) (P-07). |
| P-13 | French names with articles (`name.fr_def`), no `structured.iso3-known` warnings, a test of 193 scored entities, no `unregistered-country` build note, build time and dump sizes reported (P-04, P-05). |
| P-14 | Import from the Wayback copies with the hash check, check the real file formats first, vote quotes and locators, fewer Comtrade captures, `a2_confirmed_military.csv`, the FTS overrides and the USA check, sanity checks of every generated indicator (P-04); build-data wiring of the confirmation table and B8, derived-status checks (P-05); validator checks B-22, B-27, B-28, B-31, B-51, B-56 (P-06). |
| P-D | Never hand-author generated indicators, fetch Comtrade when missing, record military confirmations (P-04); `pnpm score --preview` (P-03); `publish:events` on the PR branch, merge with a merge commit (P-05); the scope rule B-32 (P-06). |
| P-15 | Measure the P-04 choices' effect on scores (P-04); decide the methodology defaults B-21–B-24, B-46–B-48, B-51, B-54 for a version made with P-24 before P-22 (P-06). |
| P-16 | The hash rule (decoded body at the `id_` URL) and `;`-separated sources (P-04). |
| P-18 | Country names instead of "The country" / "Le pays" in generated text (P-04). |
| P-19 | Archiver safety with untrusted HTML/PDF, no key in any URL, log, record or archived text, `.env` and `.cache/` never tracked (P-04). |
| P-23 | One fetch run per day under Save Page Now's limits (P-04). |
| P-25 | A correction keeps the event `published` with a higher revision; `retracted` for withdrawal; `disputed` is a confidence level (B-26, B-50) (P-06). |

Changes to the other documents of the plan: docs/03 (the `;` source list, `fts_plan_totals.csv`, `release_date`, window definitions; P-04), docs/04 §2 (build-data outputs as built; P-05) and §3 (how the site is built, B-79, B-84–B-88; P-06), docs/05 §2 (percent forms, B-83; P-06), docs/04 §2 and §3 (country dumps, budgets and how they are enforced, inline stylesheet, fonts, test builds; P-07), docs/06 (how the fetchers work, `--preview`, `publish:events`; P-03–P-05), methodology/CHANGELOG.md (P-02, P-04), CLAUDE.md and docs/00 (pointers to this file; P-06).
