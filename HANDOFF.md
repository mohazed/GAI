# HANDOFF — Gaza Accountability Index: everything left to do

Written 2026-10-14 for a coding agent that takes over from Claude Code; updated 2026-11-03 with the run plan (Part 3, "Run plan"), the state on that date (Part 2.0) and the decision to run groups 31–45 in the Claude track (B-694). It is self-contained: read it top to bottom, then work through Part 3 in order. The author is Mohamed Zouad (GitHub user `mohazed`). Credibility is the product of this project: a missing fact is always better than an invented one.

---

## Part 0 — How to use this file

1. Read Part 1 (rules) and Part 2 (state) before touching anything.
2. Read `CLAUDE.md` at the repository root. Its non-negotiables bind you. Two points are out of date: it names "Claude Opus 5.5" in the commit trailer (use your own model name instead, see Part 1.6), and its list of commands is correct.
3. Do the work in Part 3 in the order given. Each task says where to commit, how to verify and what to report.
4. Everything the author must decide or do is in Part 4. Never do those things yourself.
5. **Since 2026-11-08 the remaining agent work is in `FINISH-PLAN.md` (B-871); it replaces Part 3 as the task list. Parts 1 and 4 and the appendices still apply.**
6. Appendices A to C hold the working briefs used so far (copied verbatim from `.claude/run-briefs/`): the standing rules for sessions, the research lessons and reading standards, and the task definitions.

If you are a different tool than Claude Code (Antigravity, Cursor, Codex…), nothing in this repository needs a specific model: the research is done with a shell, a browser or fetch tool, the repository's own `pnpm` commands and careful reading.

---

## Part 1 — Rules (non-negotiable)

### 1.1 What the project is

A public index that scores every state's conduct regarding Gaza since 7 October 2023 (−100 to +100, five categories, 34 indicators, bands Sustaining / Enabling / Passive / Acting / Confronting). Static site (Next.js export on Cloudflare Pages, EN and FR), JSON API, embeddable widget. The data is files in git: `data/events/{ISO3}.yaml`, `data/assessments/{ISO3}.yaml`, `data/leads/{ISO3}.yaml`, `data/sources/{year}/src_*.yaml`, `archive/index.csv` and `archive/text/*.txt`, structured CSV tables in `data/structured/`. The methodology is in `methodology/v1.0.0/` (currently declared 1.0.0-rc.1 on every branch except PR #15). Full contract documents: `docs/00-decisions.md` … `docs/10-build-log.md`, `docs/02-methodology-spec.md`, `docs/03-data-model.md`, `docs/06-sources-playbook.md`.

### 1.2 Never

- **Never fabricate.** No invented events, quotes, URLs, hashes, dates, votes or figures. A fact you cannot verify is recorded as `none-found`, `no-data`, or a lead — never guessed. Web-search summaries have invented events several times in this project (a visit by Israel's President to Guatemala, a Jamaica visa-waiver "signed by Hugh Shearer", a J$4 billion contract). **Never file anything known only from a search summary or from republished old newspaper items; open and archive the primary page.**
- Nothing scores without a primary document, an archived copy (`wayback_url`) and a `sha256`. Quotes are verbatim from `archive/text/` (the validator checks them). Translations sit beside the original.
- Never delete data. Retract or correct a *published* event through `data/corrections.yaml`. Draft/reviewed-but-unpublished events are fixed in place.
- Do not change the methodology silently: points, caps, thresholds, decay, passivity, the qualifying-votes list and the universe change only through a new version folder plus a changelog entry (`docs/08-governance.md`).
- No secrets in git. `.env` (git-ignored) holds `IA_ACCESS_KEY`, `IA_SECRET_KEY` and `COMTRADE_KEY` for the archiver/fetchers. Never open, print, quote, log or commit it. Only `pnpm` commands read it.
- No LLM API calls in the codebase (D-03).
- Same treatment for every country: same protocol, templates and layout for positive and negative events.
- Site voice: statements of fact, sentence case, no adjectives in summaries, no legal characterisations in the site's own words. Banned words are linted from `methodology/*/banned-words.txt`.
- **Never run `pnpm publish:events`, never set `status: published`, never set `review.reviewed_by`.** Those are the author's decisions (Part 4).
- Never merge a pull request, create a tag, change repository settings or secrets, deploy a preview build, or post anything publicly (GitHub Discussions, issues, comments are the author's, except issue/PR text the tasks below ask for).
- Never bypass a CAPTCHA or the importers' hash checks.

### 1.3 Always

- Small commits, clear messages. Before every commit: `pnpm lint && pnpm typecheck && pnpm test && pnpm validate` (and `pnpm build` when site code changes). `pnpm validate` must show **0 errors**; it also shows several hundred **warnings** (orphan sources, unchecked assessments, has-events mismatch of reviewed-but-unpublished events). Warnings are expected, not failures.
- Record every decision that departs from a prompt or plan as a new `B-xx` row in `docs/10-build-log.md` (see 1.5). Update the statuses of older rows you touch. Fold follow-ups into the right later prompt of `PROMPTS.md` (keep every existing requirement).
- Push after every task. If a push fails because the network is down, retry for up to 15 minutes. A usage-limit or network failure mid-task is normal: on restart, run `git status` and `git diff`, keep uncommitted work only after re-checking it (captures: byte count and SHA-256; events: quotes against `archive/text`).

### 1.4 Branches and worktrees (as of 2026-10-14; unchanged on 2026-11-03)

| Branch | Where | Role |
|---|---|---|
| `main` (`3d502e7`) | `origin/main`, live site deploys from it | Site and code. Pushes run CI and deploy to https://gaza-accountability-index.pages.dev (scorecard mode, no scores). Nightly build 03:15 UTC. |
| `data/phase1` (`85139bd`) | `/Users/mohorozovic/M2/GAI` (this checkout) | **The single review branch for the whole dataset = PR #11** (supersedes #1–#10). All data work goes here. Merge `origin/main` into it (merge commit) after every `main` push. |
| `methodology/v1.0.0-rc.2` (`2aab466`) | PR #15 into `data/phase1` | Methodology 1.0.0-rc.2 proposal. **Do not merge before 2026-10-19** (14-day comment window). The author decides the set. |
| `data/phase1-ag` (`5522250`, **stale**) | `/Users/mohorozovic/M2/GAI-ag` | Parallel track for the sub-Saharan groups. It never started. Since 2026-11-03 (B-694) groups 31–45 run in the Claude track on `data/phase1` (Task B); this branch is used only if the author restarts the Antigravity track, and must then first be brought up to date with `data/phase1`. |
| `data/wave-1…9`, `data/structured` | PRs #2–#10, #1 | Superseded by #11; leave open for reference; the author closes them. |

The repository allows **merge commits only** (a correction's commit keeps its first parent at the previous version of the event). Never squash or rebase shared branches. Stale worktree `/Users/mohorozovic/M2/GAI/.claude/worktrees/agent-a03b96f1d4c911724` (branch `data/structured`) can be removed with `git worktree remove --force`.

### 1.5 Build-log ids

`docs/10-build-log.md` rows are `B-nnn`. Highest used on `data/phase1`: **B-694** (the run plan of 2026-11-03). Claude sessions use B-500…B-999 (reserved block; B-900…B-904 exist). The Antigravity track uses **B-1001 and up**. A new session takes the next free id in its own block. Each row: ID, decision, why, status ("Default adopted in the unattended run of <date>" for decisions taken without the author).

### 1.6 Commit trailer

CLAUDE.md says `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Use the model that actually did the work (sessions since 2026-10-05 used `Claude Sonnet 5.5`; the run plan of Part 3 names the model of each step, so the trailer is `Claude Sonnet 5.5` or `Claude Opus 5.5` accordingly). For other tools: `Co-Authored-By: <model name via tool> <noreply@…>`. The author may update CLAUDE.md; do not edit it yourself.

### 1.7 Commands

`pnpm install`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm validate`, `pnpm build:data [--date YYYY-MM-DD] [--preview]`, `pnpm build:data:check`, `pnpm build`, `pnpm dev`, `pnpm archive <url> [--kind dataset] [--id src_…] [--capture YYYYMMDDhhmmss]`, `pnpm score --country XXX [--date …] [--list] [--preview]`, `pnpm calibrate [--date …] [--fts] [--rc1]`, `pnpm fetch:fts`, `pnpm fetch:worldbank`, `pnpm fetch:comtrade [--reporters ISO3,…]`, `pnpm import:sipri <file>`, `pnpm import:unvotes <csv>`, `pnpm publish:events --pr N` (**author only**), `pnpm methodology:diff`, `pnpm check:wayback`. `--preview` shows reviewed-but-unpublished events as if published, for local reading only (never deploy it; `deploy-check` refuses it).

---

## Part 2 — State at handoff (2026-10-14)

### 2.0 Changes since 2026-10-14 (checked 2026-11-03)

- No work was done between 2026-10-14 and 2026-11-03: `data/phase1` is still `85139bd`, `main` `3d502e7`, `data/phase1-ag` `5522250`. `pnpm validate` on `data/phase1`: 0 errors, 738 warnings. The nightly workflow on `main` is green (runs of 2026-10-30 to 2026-11-03).
- The Antigravity track (`GAI-ag`) never started (`reports-ag.jsonl` absent). Groups 31–45 now run in the Claude track (B-694, Task B).
- PR #15's 14-day comment window closed on 2026-10-19. It now waits only on the author's decision (Part 4, item 2); Task E needs that decision.
- The first monthly run is now `monthly-2026-11` and must cover the gap since each country's session (Task C).
- This file was not in git until the commit of 2026-11-03 on `data/phase1`.

**Changes since 2026-11-03 (checked 2026-11-10 by T-F-CHECKUP, B-2108; counts from the files, not from reports):**

- Two unattended runs since: the finish run of 2026-11-03 to 2026-11-05 (Part 3 Tasks A to G, B-695 to B-870) and the finish plan of 2026-11-08 to 2026-11-10 (`FINISH-PLAN.md`, B-871 to B-999 and B-2001 to B-2108). `FINISH-PLAN.md` replaced Part 3 as the task list (Part 0, item 5); its Part 1 has the state below.
- Branches: `main` `32fe6f1` (CHECKUP.md of T-F-CHECKUP; live site in scorecard mode, Nightly green every day to 2026-11-10); `data/phase1` has `main` merged (merge commits only). `data/phase1-ag` (`5522250`) and the worktree `/Users/mohorozovic/M2/GAI-ag` are still stale (the author decides, CHECKUP.md §5).
- Dataset on `data/phase1` (PR #11): 1,421 hand-researched events in 146 country files (1,420 `reviewed`, 1 `draft`, 0 `published`, 0 with `review.reviewed_by`); 193 assessment files of 34 entries (45 full protocol, 148 light protocol); hand-researched entries (generated A1, A2, A4, B1, B2, B8, C3, D1 excluded): 4,576 `none-found`, 436 `has-events`, 5 `no-data`, 1 `unchecked` (BHR B12); generated entries still `unchecked`: B8 for 30 states, A1 and A4 for the 45; 323 leads in 134 files; 2,295 source records; `archive/index.csv` 2,354 rows; `recognitions.csv` 64 rows. `pnpm validate`: 0 errors, 1,164 warnings.
- Open PRs: #11 (dataset), #15 (rc.2 proposal, undecided), #16 (dependency update into `main`, red only on the Lighthouse script budget; B-2097), #1–#10 (superseded). Open issues: #12, #13, #14 (the Wayback check of 2026-11-08 found 545 of 2,107 copies not replaying; B-872).
- Methodology drafts for the author: `docs/proposals/rule-8-scope.md`, `b1-article-19.md`, `a4-data-years.md` (B-2098 to B-2100; no version, no PR, no Discussion).
- Everything the author must check or decide is in `CHECKUP.md` (updated on both branches on 2026-11-10; its §2e lists every reading the finish plan flagged, with B-id and default).

**Changes since 2026-11-10 (checked 2026-11-11 by T-G-CHECKUP, B-2165; counts from the files, not from reports):**

- One unattended run since: the P-23 pre-launch pass of 2026-11-10 to 2026-11-11 (the author's "continue doing the whole work"; 22 cards `T-G-…`, B-2110 to B-2165, report lines in `.claude/run-briefs/reports.jsonl`). It did the agent work of CHECKUP.md §2 to §7 with CHECKUP's default wherever a card said so; each default is in CHECKUP.md §2f with its B-id so the author can reverse it.
- Branches: `main` `73c166d` (CHECKUP.md of T-G-CHECKUP; CI and Deploy of `32fe6f1` green on 2026-11-10, Nightly green to 2026-11-10); `data/phase1` has `main` merged (merge commits only). New branch `chore/rule8-gate` (PR #17). `data/phase1-ag` (`5522250`) and `/Users/mohorozovic/M2/GAI-ag` still stale.
- Dataset on `data/phase1` (PR #11): 1,435 hand-researched events in 147 country files (1,434 `reviewed`, 1 `draft`, 0 `published`, 0 with `review.reviewed_by`); hand-researched entries: 4,576 `none-found`, 436 `has-events`, 5 `no-data`, 1 `unchecked` (BHR B12); generated entries still `unchecked`: B8 for 7 states (ARE, AZE, EGY, JOR, MAR, MYS, NGA), A1 and A4 for the 45, A2 and C3 for one state each; 330 leads in 134 files (307 open, 20 promoted, 3 dropped); 2,348 source records; `archive/index.csv` 2,407 rows; `recognitions.csv` 89 rows. `pnpm validate`: 0 errors, 1,160 warnings. Preview of 2026-11-11: bands 4 / 24 / 37 / 106 / 22 (Sustaining to Confronting); `build-notes.json` `counts.unchecked` 8.
- Open PRs: #11 (dataset), #15 (rc.2, undecided), #16 (dependency update, CI green since `82c7b69`, B-2113), #17 (rule 8 build gate, CI green, B-2114), #1–#10 (superseded). Open issues: #12, #13, #14 (second Wayback check of 2026-11-10: 63 sources still do not replay, B-2112).
- Everything the author must check or decide is in `CHECKUP.md` (updated on both branches on 2026-11-11; §2f the run's defaults, §2g its flagged readings). The follow-ups for agents are the "Also (T-G-…)" paragraphs of the P-23 block of `PROMPTS.md`.

### 2.1 Built and live

P-01 to P-19 are done (repo bootstrap, schema, scoring engine, pipeline, build-data, web foundation, all pages in EN/FR, widget `/embed/v1/gai.js`, Cloudflare Pages deploy + nightly + quarterly Wayback workflows, country registry of 195 entries, structured data, French review, security and code review). The live site runs in **scorecard mode** (no score shown). Nothing from the dataset is published yet: the site shows only generated indicators.

### 2.2 Dataset on `data/phase1` (PR #11)

- **1,000 events** in 86 country files: 999 `status: reviewed` (passed the agent's second reading, unpublished) and 1 `draft` (`evt_2025_09_29_USA_B10`, rejected at the second reading; never to be published).
- **105 countries have assessments**: the 45 full-protocol countries (waves 1–9) and the first **60 light-protocol countries (groups 1–20)**.
- Structured tables are complete: 12 qualifying UN votes (`unga_votes.csv`, all imported), vetoes, recognitions (grows with every session), FTS funding, SIPRI (release of 2026-03-09), Comtrade for the 45 + a few others, GNI, population.
- ~1,258 source records, `archive/index.csv` ~1,289 rows.
- `pnpm validate`: 0 errors. `pnpm build:data:check`: deterministic.

### 2.3 Light-protocol progress (the 148 non-full-protocol countries, in 50 groups of three)

`/Users/mohorozovic/M2/GAI/.claude/run-briefs/light_groups.json` holds the groups (index n−1 = group n). **Groups 1–20 are done and pushed.** Remaining 88 countries:

- **Claude/any-agent track, 43 countries:** groups 21–30 and 46–50 (50 = MCO alone; fold it into group 49: YEM, LIE, LUX, MCO).
  - 21 WSM BRN KHM · 22 LAO MMR PHL · 23 SGP THA TLS · 24 VNM AFG BGD · 25 BTN IRN LKA · 26 MDV NPL PAK · 27 ALB AND BIH · 28 HRV MKD MLT · 29 MNE PRT SMR · 30 SRB VAT AGO · 46 ARM BHR CYP · 47 GEO IRQ KWT · 48 LBN OMN SYR · 49 YEM LIE LUX MCO.
- **Sub-Saharan Africa, 45 countries (planned for Antigravity; in the Claude track since 2026-11-03, B-694):** groups 31–45: 31 BDI BEN BFA · 32 BWA CAF CIV · 33 CMR COD COG · 34 COM CPV DJI · 35 ERI ETH GAB · 36 GHA GIN GMB · 37 GNB GNQ KEN · 38 LBR LSO MDG · 39 MLI MOZ MRT · 40 MUS MWI NAM · 41 NER RWA SEN · 42 SLE SOM SSD · 43 STP SWZ SYC · 44 TCD TGO TZA · 45 UGA ZMB ZWE. (Whoever has capacity may take them; if one agent does everything, treat these like any other group.)

Each session covers one group and takes 25–60 minutes. A light session files **0–25 events** per group (EU members get many because of the Council's settler listings and joint statements).

### 2.4 Methodology and open PRs

- PR #15 (`methodology/v1.0.0-rc.2`): the eight rule changes recommended by P-15 (details in the PR text and `docs/proposals/v1.0.0-rc.2-*.md` on that branch): `confirmed` accepts official-video/parliamentary sources; "most severe" stacking for A3, A6, A7, B3, B7, D2; B1 capped at ±15; only contributions ≥ +2 lift passivity; the pre-existing B8 tier never qualifies; A2/C3 values of data year 2022 not in force; D1 counts FTS flows from 2023-10-07; B9/B10 speakers limited to head of state, head of government and foreign minister. Effect (generated events only): 120 display scores and 86 bands change. Draft Discussion post: `docs/proposals/v1.0.0-rc.2-discussion.md` on that branch (not posted). The author decides; do not merge before 2026-10-19.
- Open GitHub issues: #12 (dev-tool advisories under `@lhci/cli`), #13 (widget under Trusted Types), #14 (quarterly Wayback check: archived copies failing).

### 2.5 Local-only files (not in git)

`.claude/run-briefs/` (copied into the appendices below), `.env`, `.claude/worktrees/…` (stale), `GAI-ag/.ag-run/` (Antigravity brief: `START-HERE.md`, `ag-groups.json`, `PASTE-THIS-PROMPT.md`), `data/structured/raw/` (the author's seven downloads and a 352 MB UN bulk file, git-ignored; the committed copies are in `data/structured/author-downloads/`).

### 2.6 Known facts and quirks that will bite you

- `pnpm archive` can record a bot-check page (hundreds of bytes) as a successful capture. Always check the byte count and re-fetch the Wayback replay (`curl --compressed`) and compare byte count and SHA-256 with `archive/index.csv`. Use `pnpm archive <url> --capture <timestamp>` for pages Save Page Now cannot read but Wayback already holds. Remove only **your own** failed rows from `archive/index.csv` (B-208); **never rewrite that file wholesale or with a broad filter** (twice an agent deleted dozens of legitimate rows; B-619). Name sources by the **page's own date**, not the request date (B-663).
- Save Page Now allows about five captures of one URL a day and answers 429/401/502/"Temporarily Offline" at times. The Comtrade reporter-list capture is limited the same way (that is why Comtrade is still missing for most countries).
- `gadebate.un.org` files fail Save Page Now with 405; a General Debate text with no Wayback capture is a lead, unless the government's own report of the speech prints the quoted words (B-569). The archiver's 200 KB text limit can cut a long UN transcript before the passage you need. Some PDFs have broken ligatures (use the government's HTML copy) or are scans (OCR, compared with page images). The validator requires an `official` or `official-video` source for B9; a lead accepts only `press` or `ngo` sources.
- The author's machine can sleep or lose the network mid-task; usage limits stop long runs. Plan commits so that a cut-off loses little.

---

## Part 3 — What is left to do, in order

For every task: work on `data/phase1` unless stated; finish with the checks of 1.3; append a report line (a one-line JSON written with a short Python command) to `.claude/run-briefs/reports.jsonl` with keys `id, date, status (done|partial|blocked), summary (≤1,500 chars), not_done, decisions_differing_from_prompt, open_questions, author_checks, branches_pushed, pushed, pr_url, blocker`; commit; push. The full standing rules are in Appendix A; the lessons and reading standards in Appendix B; the task definitions in Appendix C.

### Run plan (2026-11-03, B-694)

One fresh agent per session, in this order. The light-protocol sessions run one at a time on `data/phase1` (they all write `archive/index.csv`, `docs/10-build-log.md`, `recognitions.csv` and `PROMPTS.md`). Times are agent time, measured on groups 5–20 (30–60 minutes for a light group; 60–90 for groups with many events or sources in Arabic, Persian or Urdu).

| Step | Work | Sessions | Agent time | Model |
|---|---|---|---|---|
| 0 | Housekeeping: commit this file, remove the stale worktree (1.4), first Comtrade run (Task C). Then one Comtrade run at the start of the first session of each UTC day, committed on its own before the group work, until every reporter has rows or a documented reason. | 1, then daily | ~1.5 h in total | Sonnet 5.5 |
| 1 | Task A, groups 21, 22, 23, 27, 28, 29, 30 (Southeast Asia, the Balkans, Croatia, Malta, Portugal, the Holy See, Angola) | 7 | 8–9 h | Sonnet 5.5 |
| 2 | Task A, groups 24, 25, 26, 46, 47, 48, 49 (Afghanistan, Bangladesh, Iran, Sri Lanka, Pakistan, the Gulf, Iraq, Lebanon, Syria, Yemen, Cyprus, Luxembourg) | 7 | 9–10 h | Opus 5.5 |
| 3 | Task B, groups 31–45 (sub-Saharan Africa), in the Claude track | 15 | 10–12 h | Sonnet 5.5 |
| 4 | Task V, verification of the light-protocol events of groups 5–49 | 2 | ~5 h | Opus 5.5 |
| 5 | Task C, monthly maintenance (`monthly-2026-11`) | 4–5 | 12–15 h | Sonnet 5.5 |
| 6 | Task D, launch readiness | 1 | 3–4 h | Sonnet 5.5 |
| 7 | Task E, score-flip dry run (after the author's rc.2 decision if it has been taken; otherwise with rc.1 and rc.2 side by side) | 1–2 | 4–5 h | Opus 5.5 |
| 8 | Task F, `CHECKUP.md` | 1 | ~1.5 h | Opus 5.5 |
| 9 | Task G, final hygiene | 1 | ~1 h | Sonnet 5.5 |

Total: about 60 hours of agent time (50–70). Run non-stop on one track that is 2.5–3 days; usage limits, Save Page Now refusals and resumed sessions make it 1–2 weeks of calendar time, and Comtrade needs several UTC days in any case. Opus is used where the validator cannot check the reading (speaker rank, R7, indirect speech, rival authorities, sources in Arabic, Persian or Urdu, the ICC/ICJ positions) and for the steps whose output the author acts on directly; the mechanical steps use Sonnet, which ran groups 5–20 with 0 validation errors.

### Task A — Light protocol for groups 21–30 and 46–49 (43 countries, 14 sessions)

Follow Appendix B (lessons and reading standards) and the P-21 section of `PROMPTS.md` ("## P-21 — Light-protocol sessions", with its many "Also (T-P21-…)" paragraphs, which hold lessons from every earlier session — read them), plus `docs/review/light-protocol.md` (finished sessions: copy their structure) and the build-log rows from B-500 on. Substitutions: `{DATE}` = today, `{ISO3_A/B/C}` = the group, `{N}` = group number. A session: load generated events (`pnpm score --country X --list`), verify recognition and ICJ/ICC status from the structured tables, scan the foreign ministry's Gaza/Palestine pages and one search per indicator group in English and the official language, file events only with archived primaries, write all 34 assessment entries with the queries used, put unprovable claims in `data/leads/{ISO3}.yaml`, second reading, `gov_sources` for the country in `data/countries.yaml`, French summaries (`docs/glossary.fr.md`), validate, score preview, commit on `data/phase1`, append the session's summary table to `docs/review/light-protocol.md`, add build-log rows, add an "Also (T-P21-NN …)" paragraph to the P-21 and P-23 blocks of `PROMPTS.md` for lessons and deferred work, push. Stop at 90 minutes.

Group-specific hints:
- **EU members** among these groups: HRV and MLT (group 28), PRT (29), CYP (46), LUX (49); Albania, Bosnia, North Macedonia, Montenegro and Serbia are candidates, not members; Liechtenstein and Monaco are not EU members. For the members, file the Council's settler listings as B11 under R8 (19 Apr 2024, 15 Jul 2024, 28 May 2026; sources already archived by earlier sessions) and the joint statements already archived for their signatories, exactly as done for BGR, ROU, SVK, EST, FIN, LTU (B-515…B-540, B-662…B-693). West Bank-tagged events are recorded but unscored in rc.1.
- **Recognition rows (R21):** HRV, PRT, MLT, SMR, ALB, BIH etc. — check `data/structured/recognitions.csv` first; add a row only with an official document or a ministry statement of the date; flag UN Secretariat chronologies; do not duplicate (Malta, San Marino, Portugal 2025 rows exist; Andorra is a conditional announcement and not a recognition).
- **Arab League/OIC/Gulf (46–48, 25 IRN, 24 AFG/BGD, 26 PAK):** search in Arabic/Persian/Urdu as relevant; B9 speakers are heads of state, heads of government, foreign ministers; Lebanon/Syria/Yemen have rival or interim authorities: use the government represented at the UN.
- **ICJ case 192:** check each country against the Court's list of interveners (page read live; B3 supports the applicant, B4 the respondent, read by direction). Iran, Bangladesh, Pakistan, Maldives, Malaysia-style cases are possible.
- **ICC:** Pakistan, Iran, Bangladesh-type positions on the warrants need an archived government text before B5/B6.
- **Holy See / Vatican (30 VAT):** observer state; apply the protocol, note limits; recognition is a known document.
- **Article 19 check:** if a country has no vote recorded on qualifying votes (`data/structured/unga_votes.csv`), note it in the report (Venezuela, Kiribati, Solomon Islands, Vanuatu so far); it is Task D's job to resolve, do not change methodology.
- Do **not** hand-author generated indicators (B1, B2, A1, A2, A4, C3, D1; B8 from `recognitions.csv`).

### Task B — Groups 31–45 (sub-Saharan Africa, 45 countries, 15 sessions)

Since 2026-11-03 (B-694) these groups run in the Claude track exactly like Task A: on `data/phase1`, build-log ids in the B-500…B-999 block, summary tables in `docs/review/light-protocol.md`, "Also (T-P21-NN …)" paragraphs in `PROMPTS.md`. Appendix B's section "Groups handled by the Antigravity track (do not do them)" and Appendix D no longer apply to Claude sessions. Group hints: the AU and OIC members among them (search in French, Portuguese and Arabic as relevant); ICJ case 192 interveners; ICC states parties' positions on the warrants (B5/B6 need an archived government text); recognitions are almost all pre-2023 rows (check `recognitions.csv` before adding one); B9 speakers at the General Debate as in Task A.

**Fallback, only if the author restarts the Antigravity track.** The brief is in `/Users/mohorozovic/M2/GAI-ag/.ag-run/START-HERE.md` (self-contained; also summarised in Appendix A/B/C). Steps for whoever runs it:

1. In `/Users/mohorozovic/M2/GAI-ag`: `git fetch && git merge origin/data/phase1` (the branch is stale; merge commit), `pnpm install`, make sure `.env` is present (copied from the main checkout, git-ignored), run `pnpm validate` once.
2. Per group: paste `PASTE-THIS-PROMPT.md`. The agent picks the first group of `ag-groups.json` missing from `.ag-run/reports-ag.jsonl`, does the light protocol for it on branch `data/phase1-ag` (push only that branch), uses build-log ids B-1001 and up, appends its summary to `docs/review/light-protocol-ag.md`, and does not edit `PROMPTS.md`.
3. **Run only group 31 first, then have the output verified (Task B2) before continuing.** If the quality is not good enough (invented quotes, wrong speakers, unarchived sources), do not continue with that agent: take the groups over in Task A's way.

**Task B2 — T-VERIFY-AG (mandatory before the Antigravity branch is merged):** a fresh agent re-checks **every** event, lead and recognition row on `data/phase1-ag` that is not on `data/phase1`: (a) quote appears verbatim in `archive/text/<source>.txt` at the cited locator; (b) the source record's byte count/SHA-256 match `archive/index.csv` and the Wayback replay (not a bot-check page); (c) speaker and wording satisfy R3/R4/R7 (heads of state/government and foreign ministers only; indirect speech excluded; the statement cites Gaza); (d) date and tier of points; (e) scope tags (`west-bank` vs `gaza`); (f) French summary follows the glossary and the tone lint. Fix in place or move to leads; record the findings in `docs/review/light-protocol-ag.md` and a B-xx row.

**Merge procedure** (after B2): merge `data/phase1-ag` into `data/phase1` with a merge commit; resolve conflicts by **union** in `archive/index.csv` (rows of both, header once, the order the tools write), `data/structured/recognitions.csv` (sorted as `packages/pipeline/src/lib/files.ts` writes it), `docs/10-build-log.md` (all rows, ordered by id, no duplicates; B-1001+ rows stay in their block), `data/countries.yaml` (by country record), `docs/review/` (both files kept). Then `pnpm lint && pnpm typecheck && pnpm test && pnpm validate && pnpm build:data:check`, push.

### Task V — Verification of the light-protocol events (groups 5–49)

Opus 5.5, two sessions, after Tasks A and B, on `data/phase1`. Apply T-VERIFY-AG's checklist (Task B2: quote at the locator, byte count/SHA-256 against `archive/index.csv` and the Wayback replay, speaker and wording under R3/R4/R7, date and tier, scope tags, French summary) to every event, lead and recognition row filed by the light-protocol sessions of groups 5–49, which were run by Sonnet 5.5. Fix in place (the events are `reviewed`, not published) or move to leads; never change `status` to `published` or set `review.reviewed_by`. Record the findings as a table per country in `docs/review/light-protocol.md` (section "Verification of 2026-11") and a B-row per session; add the flagged readings to the author's list for `CHECKUP.md`.

### Task C — First monthly maintenance run (P-23)

Spec in Appendix C ("T-P23"). Commit on `data/phase1`; write the summary table to `docs/review/monthly-2026-11.md`. Do it **after** Tasks A, B and V so that it covers all countries. Comtrade runs start earlier (run plan, step 0); this task reports what they reached. The new-events search covers, for each country, the days since its own session (since 2026-09-28 for the 45 full-protocol countries, since the session date for the light-protocol ones), not only the last 35 days. Contents:
- Comtrade (`pnpm fetch:comtrade`, one run early in a UTC day; the daily limit on the reporter-list capture decides how many reporters one day yields; repeat on following days until all 193 minus excluded have rows or a documented reason). Report countries still without rows.
- The follow-up searches earlier sessions deferred: read every "Also (T-P21-… / T-P-D …)" paragraph of the P-23 block of `PROMPTS.md` and the "not searched" lists in the P-D rows of `docs/10-build-log.md` (about 40 countries; examples: the Tunisian Foreign Ministry's unread post-id ranges, the 2026 joint statements of the eight Arab and Islamic foreign ministers, the 12 pre-2023 recognitions still without a row, ICJ declarations of Brazil/Mexico/Bolivia/Belgium, B5 for Algeria and Indonesia, the statements of the 81st General Debate session whose texts had no capture, UNRWA's 2025 donor table, the Tajik Foreign Minister's September 2026 statement, B10 leads awaiting official copies).
- **Article 19 check (B-626):** `unga_votes.csv` has no vote for some states on some or all of the 12 qualifying votes (Venezuela on all 12, Kiribati on 9, Solomon Islands, Vanuatu…). Check the UN's lists of states in arrears under Article 19 for each vote date (Secretary-General's notes/Committee on Contributions, archived), list every affected country and report how B1 treats a state without a vote (non-voting versus not entitled). Do not change the methodology; file the finding for the author and P-24.
- **A4 data-year gap (B-536 (7)):** SIPRI orders from earlier data years are not scored (Slovakia's 2024 Barak MX order of 282 TIV, also AUT, AZE, KEN, PHL, USA). Report the affected countries and import the March 2025 release only if an archived export exists.
- Open Wayback problems (issue #14: `pnpm check:wayback`, re-archive or record), `pnpm audit` and the pinned actions (issues #12, #13).
- Right-of-reply/error issues: `gh issue list` for any; draft per `docs/08` only if there are any.
- New events over the last 35 days for the 45 full-protocol countries (news search per indicator group, then primaries, archived).

### Task D — Launch readiness (P-20), without launching

Spec in Appendix C ("T-P20"). Verify every launch criterion of `docs/01-plan.md` §6 with evidence on `main` (live site) and on `data/phase1` (local preview build), fix small issues, write `changes/launch.md` and the `methodology/reviewers.yaml` state (empty allowed), split `dumps/gai-{date}.json` by record type if it passes ~20 MB (measure first with `pnpm build:data --preview` on `data/phase1`; with the events of 88 more countries the split is expected to be needed) (document the split in the API README; the build fails at 25 MiB; it is ~18.7 MB now and ~21 MB with all reviewed events published; adding the light-protocol events makes it larger), consider the P-24 follow-ups scheduled in P-20 (CI diff comment, Changes-page notice, docs/08 §1 steps 2–3 mechanism). **Do not tag, publish or launch.** List the exact remaining launch commands in Part 4.

### Task E — Score-flip dry run (P-22), without flipping

Spec in Appendix C ("T-P22"). Run the gate checks with evidence (reviewers.yaml, readers' notes, rc.2 decision, published events, corrections, sensitivity tables), prepare `docs/drafts/index-launch.md` (not `changes/`), check score mode locally on the preview build (ranking, compare with sliders, cite, share cards, API, widget in score mode) fixing issues on `main`, and write the exact flip command sequence. **Do not** create `methodology/v1.0.0` final, do not commit `NEXT_PUBLIC_SHOW_SCORES=true` anywhere, do not tag.

### Task F — `CHECKUP.md`

Spec in Appendix C ("T-CHECKUP"). Write the author's single, complete check-up list (the author asked for exactly this: "list me once the whole website is done what to verify by myself"). Gather items from `docs/10-build-log.md` (rows saying the author decides/confirms/checks, open questions with defaults, flagged evidence readings per country), `PROMPTS.md`, `docs/calibration/README.md`, `docs/review/*.md`, `docs/proposals/*` (on the rc.2 branch), `.claude/run-briefs/reports.jsonl`, `gh pr list`, `gh issue list`, and Part 4 of this file. Commit on `main`, merge into `data/phase1`, push.

### Task G — Final hygiene

`pnpm lint && pnpm typecheck && pnpm test && pnpm validate && pnpm build:data:check && pnpm build` on both `main` and `data/phase1`; PR #11's description updated with final counts per country (events, reviewed, coverage, preview band) and links; CI of `main` and PR #11 green (`gh run list`); `git worktree list` clean; no secrets in git (`git log --all -S` for the three `.env` values, never print them).

---

## Part 4 — Only the author does these (never do them yourself; list them in CHECKUP.md)

1. **Review PR #11** (the dataset, ~1,000+ events; the flagged readings are one row per country in `docs/10-build-log.md` and a table per session in `docs/review/light-protocol.md`; sampled-review mode: print a random 10% of events with quotes and archived-text excerpts and check them). Then on `data/phase1`: `pnpm publish:events --pr 11 [--exclude id,id…]` (sets `status: published` and `review.reviewed_by: mzouad`), `pnpm validate`, commit, push, **merge with a merge commit**, close PRs #1–#10 as superseded, confirm the deploy and that the country pages are live.
2. **Methodology rc.2 (PR #15):** confirm or edit the set; read the rc.2 wording in `methodology/v1.0.0/methodology.en.md` / `.fr.md`; post the Discussion from `docs/proposals/v1.0.0-rc.2-discussion.md` with the PR link; merge only after 2026-10-19 (14-day window; closed, so the decision is due now and Task E waits on it); optionally tag `methodology-1.0.0-rc.1` on `6676783`. Then P-22's gates, recompute `diff.json` on published data (recipe in `PROMPTS.md`), re-run calibration, final `methodology/v1.0.0`.
3. **Decisions on flagged readings**, for example: Tajikistan's C2 (decides its only band change); Belize's B12 tier; Fiji's three technical C2 instruments; Costa Rica/Panama passivity effect of negative events; the UAE reception of Netanyahu (lead); Morocco's joint statement (C2); the US bomb-shipment pause (A6); South Africa's B3; Libya's Confronting band (rests on three flagged items); Estonia/Tunisia flags; Venezuela's B12/B6 and B1 absences (Article 19); R7 (Palestine without Gaza) for Jamaica, Nicaragua, Uruguay, Libya, Venezuela; head-of-state speakers (R3); 0-TIV SIPRI orders (India, Poland A4 no-data); the A4 data-year gap; the two recognition dates differing from the registry (Suriname/Uruguay/Ecuador/Paraguay).
4. **Site and wording:** contact email (`CONTACT_EMAIL` in `apps/web/lib/site.ts`, currently `null`); the About page's standpoint text; update `CLAUDE.md`'s commit-trailer line; a native French reader's pass over the French site (home, a country page with events, methodology, About, Data, a monthly report) against `docs/glossary.fr.md`; look once at `/en/methodology/` and `/en/embed/` in branded Safari and Firefox.
5. **Accounts and settings:** Cloudflare API token scope ("Cloudflare Pages: Edit" on this one account only); a protected GitHub environment for the deploy secrets; domain choice and HSTS `includeSubDomains`/`preload`; Web Analytics yes/no (default off, D-19); VPS mirror yes/no (needs three more secrets, default off); GitHub private vulnerability reporting (was to be enabled in P-12: check); `main` branch protections as desired.
6. **People:** recruit reviewers (`methodology/reviewers.yaml`, empty at scorecard launch, required before the score flip); post the calibration worksheet (`docs/calibration/*.md`) to two or three readers (the three "does the band feel right" slots are blank by design).
7. **Launch commands** (after items 1–6, with P-20's report): tag `v0.9.0-scorecard` and confirm the deploy; later the flip (P-22): set `NEXT_PUBLIC_SHOW_SCORES=true`, publish `changes/index-launch.md`, tag `v1.0.0`, deploy, verify ranking/compare/sliders/cite/cards/API on the live site; then P-23 monthly.
8. **SIPRI terms:** the two SIPRI exports are in the repository (`data/structured/author-downloads/`) under SIPRI's non-commercial fair-use terms (less than 10% of the dataset; credited in the folder's README). Confirm that is acceptable.
9. **Antigravity:** if Task B is used, the author starts the sessions (nothing else can) and decides whether to continue after the group-31 verification.

---

## Part 5 — Definition of done for "everything but the author's checks"

- Every one of the 193 scored countries has 34 assessment entries (45 full + 148 light) and its leads file where relevant.
- Task V's verification is recorded for every light-protocol country of groups 5–49.
- `pnpm validate` 0 errors on `data/phase1`; deterministic build; CI green on `main` and PR #11; the live site deploys.
- Comtrade rows exist or a documented reason, for every country; the follow-ups of Task C are done or each is a listed lead.
- PR #15 untouched except for review feedback the author asks for.
- `CHECKUP.md` exists at the repository root (on `main` and merged into `data/phase1`), complete, with the exact commands of Part 4.
- `docs/10-build-log.md` has a B-row for every decision; `PROMPTS.md` follow-ups are folded into the right later prompts.
- Nothing is published, merged (except merges of branches into `data/phase1` as described), tagged or deployed from a preview build.

---

# Appendices (verbatim working briefs)

## Appendix A — Standing rules for every session (`.claude/run-briefs/common.md`)

````markdown
# Rules for every session of the final unattended run

You are a fresh session of the Gaza Accountability Index build (working directory /Users/mohorozovic/M2/GAI). Today: run `date +%F`. You run with Sonnet 5.5 (the author switched the run to it on 2026-10-05; earlier sessions ran on Opus 5.5) and share no context with earlier sessions: everything you need is in the repository, in this file and in your task file.

## Why the run is unattended

The author wrote on 2026-10-05: "auto push and validate everything and list me once the whole website is done what to verify by myself (write a check-up md file that i'll check on in the end of everything). For now, do the rest of the building and i'll do the whole check up all in the end."

State of the build at the start of this run:
- P-01 to P-19 are done.
- The 45 full-protocol countries are researched.
- The whole dataset is on `data/phase1` (PR #11 against main), which supersedes PRs #1–#10 (still open). It holds the structured tables and 773 events at status reviewed; none is published.
- The live site (https://gaza-accountability-index.pages.dev) is in scorecard mode.
- The author's seven UNDL/SIPRI downloads are committed on `data/phase1` in commit ab996e43c9fd99edec337d2f7a994f94134e7723, under `data/structured/author-downloads/` (B-903).

## Rules

- **Defaults.** Wherever the prompt or CLAUDE.md says to ask the author, wait, or leave a choice open, take the default you would recommend, apply it and continue.
- **Decision log.** Record every decision that differs from the prompt text as a new B-xx row in `docs/10-build-log.md`, marked "Default adopted in the unattended run". Use the next free id after the highest on any branch; B-900–B-999 is reserved. Update older rows you touch. Fold follow-ups into the specific later prompts of PROMPTS.md, keeping every existing requirement.
- **Author items and stops.** Items only the author can do go into `author_checks`, each naming the file, B-id, PR or command; they never cause a stop. Stop with status "blocked" only for a hard blocker no default can lift, and commit and push what is complete first.
- **Never do these:**
  - fabricate anything;
  - bypass a CAPTCHA or the importers' hash checks;
  - set `review.reviewed_by`, run `pnpm publish:events` or set `status: published`;
  - merge a PR, create a release tag, or change repository settings or secrets;
  - post anything publicly outside git and GitHub PR/issue text.
- **Branches:**
  - Data work goes on `data/phase1`, the single review PR #11 for the whole dataset. Fix draft events in place, without `corrections.yaml` entries.
  - Site and code changes go on `main`; then merge `origin/main` into `data/phase1` with a merge commit.
  - Numbers computed from unpublished events use the existing preview options (`pnpm score --preview`, `pnpm build:data --preview`, `pnpm calibrate`) and are stated as provisional. Never deploy a preview build.
- **Commit attribution.** CLAUDE.md names Opus 5.5 in the Co-Authored-By line, written when Opus did all sessions. Sessions on Sonnet 5.5 end commit messages with `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` (and PR descriptions with the Claude Code line), so the history names the model that did the work. Do not edit CLAUDE.md; the author is told to update that line.
- **Ending the session.**
  - Leave the untracked `.claude/` folder alone, except for appending your report as below.
  - End as CLAUDE.md "How to end every session" says: `pnpm lint && pnpm typecheck && pnpm test && pnpm validate` (and `pnpm build` when the site changes), fix failures, commit, update `docs/10-build-log.md`, then push every branch you committed to.
  - If a push fails because the network is down, retry for up to 15 minutes before reporting.
  - The repository must be clean and pushed when you finish; the next session starts from it immediately.

## Report

At the very end, append one line of JSON to `/Users/mohorozovic/M2/GAI/.claude/run-briefs/reports.jsonl` with these keys:

| Key | Content |
|---|---|
| `id` | the task id |
| `date` | today's date |
| `status` | done, partial or blocked |
| `summary` | at most 1,500 characters |
| `not_done` | array |
| `decisions_differing_from_prompt` | array |
| `open_questions` | array |
| `author_checks` | array |
| `branches_pushed` | array |
| `pushed` | boolean |
| `pr_url` | string |
| `blocker` | string |

Write it with a short Python one-liner, so the JSON is valid. Then give the same report as your final answer.

````

## Appendix B — Lessons and reading standards for light-protocol sessions (`.claude/run-briefs/p21-launch.md`)

````markdown
# Standing instructions for every T-P21-NN session

Read `common.md`, then the section "## T-P21-NN" of `tasks.md` (NN = your session number; your countries are group NN, index NN−1, of `light_groups.json`). Check out `data/phase1` and pull first. Work with the current rc.1 rules; the rc.2 proposal (PR #15) is a separate unmerged branch.

Before starting, read:
- `docs/review/light-protocol.md`;
- the "Also (T-P21-…)" paragraphs of the P-21 block of PROMPTS.md;
- the build-log rows of earlier P-21 sessions (from B-500 on).

They hold the lessons and the reading standards already applied. Apply them the same way for every country.

## Lessons
- Check the byte count of every capture. `pnpm archive` can record a bot-check page as a successful capture; use `--capture` (Wayback) for pages Save Page Now cannot read. Remove only your own failed index rows (B-208). Never rewrite `archive/index.csv` wholesale; append your rows only.
- The archiver's 200 KB text limit can cut a UN transcript before the passage you need.
- `gadebate.un.org` files fail Save Page Now with 405. An unarchived General Debate text is a lead, unless the Government's own report of the speech prints the quoted words (Presidency-report route, B-569).
- PDF ligature breakage: use the government's HTML copy. Scanned PDFs: OCR, compared with the page images.
- The validator requires an official or official-video source for B9; a lead accepts only press or ngo sources.
- NEVER file anything known only from a web-search summary or from republished old newspaper items (several summaries have invented events).
- Re-fetch every Wayback replay after writing the source records and compare byte count and SHA-256 with the index rows.

## Reading standards
- B9 speakers: head of state, head of government, foreign minister (R3). Indirect speech is not B9 (R4). The statement must cite Gaza (R7).
- C2: corroborated weight needs two press/ngo publishers; technical instruments are flagged under R18. Embassy moves are not an indicator act unless `methodology/v1.0.0/indicators.yaml` defines one (B-599).
- UNRWA D2/D3 follow the donor tables, with the no-2022-row precedent (B-445). D4 is one event per programme.
- ICJ case 192: B3 for a filing or declaration that supports the applicant, B4 for one that supports the respondent; read by direction. Check each country against the Court's list.
- R21: a recognition row in `data/structured/recognitions.csv` needs an official document or a ministry statement of the date; flag UN Secretariat chronologies. Do not duplicate existing rows.
- R8: EU Council settler listings as B11 for EU members, and the joint statements already archived for their signatories.
- Also check the Hague Group and Bogotá declarations as joint-statement leads (no named signatory means no B9), and CARICOM communiqués for Caribbean states.

## Recovery
If a previous attempt of this task was cut off by a usage limit and `git status` shows uncommitted work, inspect it (`git diff archive/index.csv`), keep what is sound after re-checking every capture, and write the missing source records.

## Groups handled by the Antigravity track (do not do them)
> **Superseded on 2026-11-03 (B-694):** Claude sessions now run groups 31–45 on `data/phase1` (Part 3, Task B). The text below is kept as it was written.

Groups 31 to 45 of `light_groups.json` (sub-Saharan Africa: BDI … ZWE) are run by the author in Antigravity in the worktree /Users/mohorozovic/M2/GAI-ag on branch `data/phase1-ag` (B-id block B-1001 and up, summary file docs/review/light-protocol-ag.md). Claude sessions skip groups 31–45. Claude sessions keep to B-500 to B-999. When the Antigravity branch is merged into `data/phase1`, union-merge archive/index.csv, recognitions.csv, docs/10-build-log.md and countries.yaml, and verify every Antigravity event (T-VERIFY-AG).

````

## Appendix C — Task definitions (`.claude/run-briefs/tasks.md`)

````markdown
# Task definitions of the final unattended run

Each session gets one task id. Read `common.md` in this folder first.

## T-P14 — finish P-14's blocked imports

Background: PROMPTS.md "## P-14"; docs/10 B-186, B-187, B-199, B-900–B-904.

1. `git checkout data/phase1 && git pull`, then `pnpm install`.
2. Archive each of the seven files at its commit-pinned URL:
   - URL: `https://raw.githubusercontent.com/mohazed/GAI/ab996e43c9fd99edec337d2f7a994f94134e7723/data/structured/author-downloads/<file>`.
   - Command: `pnpm archive <url> --kind dataset --id src_…`.
   - If Save Page Now refuses raw.githubusercontent.com, use `https://cdn.jsdelivr.net/gh/mohazed/GAI@ab996e43c9fd99edec337d2f7a994f94134e7723/data/structured/author-downloads/<file>`.
   - Check that the SHA-256 of the bytes Wayback serves equals the file's (the README table).
   - The source records name:
     - the original (the UN Digital Library record with its export URL, or the SIPRI query);
     - the author's browser download of 2026-09-29;
     - the unchanged copy in archive.org item `sipri_register_supplier_israel`;
     - the repository copy that was captured.
   - Keep the failed-attempt records (B-900) unchanged.
3. Import:
   - `pnpm import:unvotes` with the five MARCXML exports, the votes after the 2025-03-31 bulk file's cut-off. Reconcile per-vote totals with votes.yaml and the press releases, and report every discrepancy.
   - `pnpm import:sipri` with the two exports (SIPRI release of 9 March 2026; Taiwan and unknown recipients skipped and listed, B-904).
4. Redo P-14 step 7 for what changed:
   - Run `pnpm build:data`, then `pnpm score --country FRA --list` and `--country DEU --list` (with `--preview`).
   - Hand-check two rows each of B1, A1 and A4.
   - Check that A1 is none-found (s = 0) for non-suppliers, and A4 none-found for countries that ordered nothing.
   - Re-run `pnpm calibrate` and update docs/calibration (the README and the ten worksheets) with the new provisional numbers, saying what moved.
5. Update the statuses of B-186, B-187, B-199, B-900–B-904 and of every PROMPTS.md follow-up this resolves. Update PR #11's structured-data table with `gh pr edit 11`.

## T-P24 — P-24, methodology change proposal

Carry out PROMPTS.md "## P-24" with these substitutions:
- **{DESCRIBE}:** the proposal set P-15 recommended in docs/calibration/README.md (§7, "one proposal for P-24", 1.0.0-rc.2; docs/10 B-436–B-442 and P-15's follow-up rows), exactly as recommended there. Update it with the numbers after the P-14 import where they change a recommendation, and say so.
- **{DATE+14}:** today + 14 days.

Further instructions:
- Default adopted: the author has not decided the set yet. Use P-15's recommendation, and make "the author confirms or edits the set" the first item of `author_checks`.
- Branch: create `methodology/v1.0.0-rc.2` from `data/phase1` and open the PR against `data/phase1`, so its diff is the methodology change only. Do not merge.
- Write the draft GitHub Discussion post to `docs/proposals/v1.0.0-rc.2-discussion.md` on that branch. Do not post it.

## T-P21-NN — P-21, light protocol (NN = 01…49)

Carry out PROMPTS.md "## P-21" with these substitutions:
- **{DATE}:** today.
- **{ISO3_A}, {ISO3_B}, {ISO3_C}:** group NN of `light_groups.json` in this folder (1-based index; NN = 49 holds four countries).
- **{N}:** NN.

Branch: a default adopted in the unattended run. If no B-xx row records it yet, record it once.
- Instead of one branch and PR per session, every light-protocol session commits directly to `data/phase1`, so the author reviews the whole dataset in PR #11.
- Append this session's summary to `docs/review/light-protocol.md` instead of writing a PR description. Create the file if it is missing, with a header saying it is the P-21 PR description.
- The summary has a table with event id, indicator, date, points, confidence and source kind; then, per country, the assessment counts and the 90-minute stop note.

The generated indicators are left to the build.

## T-P23 — P-23, first monthly maintenance

Carry out PROMPTS.md "## P-23" with these substitutions:
- **{DATE}:** today.
- **{YYYY-MM}:** the current month.

Branch: a default adopted in the unattended run. Commit on `data/phase1` instead of `data/monthly-{YYYY-MM}`, and write the summary table to `docs/review/monthly-{YYYY-MM}.md` instead of a PR description.

Scope:
- New events for the 45 full-protocol countries over the last 35 days.
- Every follow-up earlier sessions folded into P-23:
  - Comtrade for the countries still missing (ARE, QAT, AZE and any other), in one fetch run early in the UTC day.
  - The P-16 follow-up searches, by docs/10 row.
  - The open Wayback rows and issue #14.
  - `pnpm audit` and the pinned actions, per P-19; issues #12 and #13.
- B1 and Article 19 (B-626): unga_votes.csv has no vote for Venezuela on any of the 12 qualifying votes, which may be a loss of vote under Article 19 of the UN Charter (arrears), not a choice. Check the UN's lists of Article 19 states for each vote date (UN Committee on Contributions / Secretary-General's notes, archived), find every country in the same situation, and report how B1 treats a state without a vote (non-voting versus not-entitled). Do not change the methodology: file the finding for the author and P-15/P-24.
- A4 data-year gap (B-536 (7)): SIPRI orders of earlier data years are not scored; report the affected countries and import the March 2025 release only if an archived export is available.
- Right-of-reply and error issues: list the open ones with `gh issue list`, and draft per docs/08 only if there are any.

This first run may take up to four hours.

## T-P20 — P-20 launch readiness, without launching

Carry out PROMPTS.md "## P-20" with this adaptation. The "Before" items are not met:
- no event is published (the author's review of PR #11 is kept to the end);
- `corrections.yaml` has no public entry;
- the calibration worksheet has not been posted to readers.

Default adopted:
- Run every verification of the prompt, with evidence:
  - on `main`, against the live site;
  - on `data/phase1`, with the local preview build.
- Fix small issues.
- Write `changes/launch.md` and set the `reviewers.yaml` state (empty is allowed).
- Do NOT tag v0.9.0-scorecard and do NOT launch.
- Put the exact remaining launch commands (`publish:events`, merge, tag, deploy check) and the prompt's checklist "what only I can do next" in `author_checks`.
- List the blocking items, with the evidence of each.

## T-P22 — P-22 dry run, without flipping

The "Before" gates are not met:
- `reviewers.yaml` is empty;
- the readers' notes are absent;
- the author has not decided the threshold changes or the rc.2 proposal;
- no event is published.

Per the prompt, when a gate fails you stop, report and do not flip. Default adopted:
- Run the gate checks and report each with evidence.
- Without flipping anything, prepare what the flip needs:
  - a draft of `changes/index-launch.md`, in `docs/drafts/`, unpublished;
  - a local score-mode check on the preview build (ranking, compare, sliders, cite, share cards, API, widget in score mode), with the issues fixed on `main`;
  - the exact sequence of commands for the flip, in `author_checks`.
- Do not create `methodology/v1.0.0`, do not commit `NEXT_PUBLIC_SHOW_SCORES=true` anywhere, and do not tag.

## T-CHECKUP — CHECKUP.md

Write `CHECKUP.md` at the repository root: the author's single, complete check-up list to work through at the end. The author asked for it as "list me once the whole website is done what to verify by myself".

Gather items from these sources, read in full; do not invent items:
- `docs/10-build-log.md`: every row whose status or text says the author decides, confirms or must do, "for the author", "author's checklist"; open questions with defaults adopted in the unattended run; flagged evidence readings per country.
- PROMPTS.md: the Before lines of P-20 and P-22, and the author's review prompt after P-D.
- `docs/calibration/README.md`, `docs/review/*.md`, `docs/proposals/*`, `docs/drafts/*`.
- The open PRs (`gh pr list`) and issues (`gh issue list`).
- `.claude/run-briefs/reports.jsonl`: this run's session reports.

Structure: plain, factual, sentence case, no adjectives, tables where useful, a "- [ ]" checkbox per item.
1. **Status in five lines:** what is built and live (URL), what is in which PR, counts (events by status, countries, sources), the mode.
2. **Decisions before publishing,** grouped:
   - (a) methodology: the rc.2 proposal set, the P-24 PR, the 14-day window, threshold decisions;
   - (b) evidence readings flagged per country, as a table: country → B-ids → the question in one line → the default adopted;
   - (c) site and wording defaults: the contact email in `apps/web/lib/site.ts`, the standpoint text, and so on.
3. **Review and publish the dataset:**
   - exact steps and commands: review PR #11 and `docs/review/*`; `pnpm publish:events --pr 11 [--exclude …]` on `data/phase1`; `pnpm validate`; merge with a merge commit; close #1–#10 as superseded; confirm the deploy;
   - how to sample, using the 10 % sampled-review mode of the P-D review prompt.
4. **Manual checks on the live site:** each page to look at in EN and FR, the branded Safari and Firefox checks, share cards, the widget on a blank page, and a native French reader's pass, with what to look for (from the P-17, P-18 and P-20 reports).
5. **Accounts and settings:** the Cloudflare token scope, a protected GitHub environment, the domain and HSTS, the Web Analytics choice, the VPS mirror choice, reviewers.yaml and readers (the calibration worksheet to two or three readers), and the SIPRI terms note.
6. **Launch sequence:** P-20 (tag v0.9.0-scorecard), then the flip (P-22) with its gates, then P-23 monthly; each with the exact command or prompt id and its precondition.
7. **Known gaps left by the unattended run,** each with where it is scheduled.

Every item names the file, B-id, PR or command that lets the author act on it. Merge duplicates. Keep the file as long as completeness needs and no longer.

Finishing:
- Commit `CHECKUP.md` on `main`, then merge `origin/main` into `data/phase1` with a merge commit.
- Run `pnpm lint` and `pnpm validate`.
- Add a B-xx row on `data/phase1`.
- Push both branches.

````

## Appendix D — Antigravity brief (`GAI-ag/.ag-run/START-HERE.md`)

````markdown
# START HERE — light-protocol research on Antigravity (parallel track)

You are an AI coding agent working in the git worktree /Users/mohorozovic/M2/GAI-ag (branch `data/phase1-ag`) of the Gaza Accountability Index. Another agent (Claude Code) works at the same time in a different worktree on branch `data/phase1`. You never touch that worktree or that branch. Read this whole file, then `CLAUDE.md` of the repository (its non-negotiables bind you too: never fabricate, nothing scores without a primary document plus an archived copy plus a sha256, quotes are verbatim from `archive/text/`, same treatment for every country, no legal characterisations in the site's words, never delete data), then follow the task below.

## What one session is

One session = one group of three countries from `ag-groups.json` in this folder. Pick the FIRST group whose number does not appear yet in `reports-ag.jsonl` in this folder (if that file does not exist, it is group 31). The task is the light protocol of `PROMPTS.md`, section "## P-21 — Light-protocol sessions", with these substitutions: {DATE} = today (`date +%F`), {ISO3_A}/{ISO3_B}/{ISO3_C} = the group's countries, {N} = the group number. Read first the section above in PROMPTS.md, its "Also (T-P21-…)" paragraphs (they hold lessons learned by the earlier sessions), `docs/review/light-protocol.md` (finished sessions, as examples of what a good result looks like: copy their structure for events, assessments, leads, source records and French summaries) and the build-log rows from B-500 on in `docs/10-build-log.md`.

## Overrides (they take precedence over anything else you read)

- **Branch:** work and commit only on `data/phase1-ag`. Push only with `git push origin data/phase1-ag`. Never push another branch, never merge, never force-push, never create tags, never open or merge pull requests, never change repository settings or secrets, never publish anything outside git.
- **Build-log ids:** the block `B-1001` and up is yours (Claude's sessions use B-500 to B-999). Take the next free id in that block. Add your rows at the end of the P-21 section of `docs/10-build-log.md`, marked "Default adopted in the unattended run".
- **Summary file:** append your session's summary (event table; assessment counts; stop note) to `docs/review/light-protocol-ag.md` (create it with a header on the first session), NOT to `docs/review/light-protocol.md`. Do not edit `PROMPTS.md`.
- **Secrets:** a `.env` file holds API keys for the archiver. NEVER open, print, quote or search it; only the `pnpm` commands read it.
- **Commit trailer:** end every commit message with `Co-Authored-By: <the model you are, e.g. Gemini 3.x via Antigravity> <noreply@google.com>`.
- **Report:** at the very end append one JSON line to `reports-ag.jsonl` in this folder (valid JSON, written with a one-line Python command) with keys `group`, `countries`, `date`, `status` (done|partial|blocked), `summary` (max 1,500 characters), `events` (list of event ids), `leads`, `flags` (readings the author should check), `not_done`, `pushed` (boolean), `head_sha`. Then print the same report.
- **Human review is kept for the end:** never set `review.reviewed_by`, never run `pnpm publish:events`, never set `status: published`. New events are `status: reviewed` after your own second reading, exactly as the earlier sessions did.
- **Finish properly:** `pnpm lint && pnpm typecheck && pnpm test && pnpm validate` must pass (0 errors) before you commit; fix what fails. Commit, push `data/phase1-ag`, and leave the working tree clean. If a push fails because the network is down, retry for up to 15 minutes.
- **Stop at 90 minutes** of work per session, as the P-21 prompt says; then commit and push what is sound.
- **Quality bar:** every event needs an archived primary (`pnpm archive <url>` or `--capture` for pages with existing Wayback captures), a verbatim quote that the validator finds in `archive/text/`, the right speaker (R3), the right wording (R4, R7) and a second reading. If you are not sure, put it in `data/leads/{ISO3}.yaml` and in the assessment note instead of filing an event. A session with zero events for a quiet country is a good result when the searches are recorded. Never rely on a web-search summary: open and archive the primary page.

---

## Task definition and lessons (from the Claude track; the substitutions above apply)

## Reading standards
- B9 speakers: head of state, head of government, foreign minister (R3). Indirect speech is not B9 (R4). The statement must cite Gaza (R7).
- C2: corroborated weight needs two press/ngo publishers; technical instruments are flagged under R18. Embassy moves are not an indicator act unless `methodology/v1.0.0/indicators.yaml` defines one (B-599).
- UNRWA D2/D3 follow the donor tables, with the no-2022-row precedent (B-445). D4 is one event per programme.
- ICJ case 192: B3 for a filing or declaration that supports the applicant, B4 for one that supports the respondent; read by direction. Check each country against the Court's list.
- R21: a recognition row in `data/structured/recognitions.csv` needs an official document or a ministry statement of the date; flag UN Secretariat chronologies. Do not duplicate existing rows.
- R8: EU Council settler listings as B11 for EU members, and the joint statements already archived for their signatories.
- Also check the Hague Group and Bogotá declarations as joint-statement leads (no named signatory means no B9), and CARICOM communiqués for Caribbean states.

## Recovery
If a previous attempt of this task was cut off by a usage limit and `git status` shows uncommitted work, inspect it (`git diff archive/index.csv`), keep what is sound after re-checking every capture, and write the missing source records.
## Lessons
- Check the byte count of every capture. `pnpm archive` can record a bot-check page as a successful capture; use `--capture` (Wayback) for pages Save Page Now cannot read. Remove only your own failed index rows (B-208). Never rewrite `archive/index.csv` wholesale; append your rows only.
- The archiver's 200 KB text limit can cut a UN transcript before the passage you need.
- `gadebate.un.org` files fail Save Page Now with 405. An unarchived General Debate text is a lead, unless the Government's own report of the speech prints the quoted words (Presidency-report route, B-569).
- PDF ligature breakage: use the government's HTML copy. Scanned PDFs: OCR, compared with the page images.
- The validator requires an official or official-video source for B9; a lead accepts only press or ngo sources.
- NEVER file anything known only from a web-search summary or from republished old newspaper items (several summaries have invented events).
- Re-fetch every Wayback replay after writing the source records and compare byte count and SHA-256 with the index rows.


````
