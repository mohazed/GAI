# FINISH-PLAN — everything left to do, how to do it, and the workflow that runs it

Written 2026-11-08 on `data/phase1` (`29dabb1`), after the unattended finish run of 2026-11-03 to 2026-11-05 (B-695 to B-870). It replaces HANDOFF.md Part 3 as the list of remaining agent work; HANDOFF.md Part 1 (rules), Part 4 (author-only steps) and the appendices still apply. Decision row: B-871.

Read in this order: Part 1 (state), Part 2 (what is missing), Part 3 (rules for this run), Part 4 (task cards), Part 5 (the workflow the orchestrating session builds), Part 6 (after the author's steps), Part 7 (definition of done).

---

## Part 1 — State on 2026-11-08 (checked, not copied from reports)

- `main` `90f187c`, `data/phase1` `29dabb1`, both pushed; `main` is merged into `data/phase1`. CI green on both; Nightly green every day to 2026-11-08. Live site in scorecard mode.
- 193 assessment files with 34 entries each (45 full protocol, 148 light protocol). 1,236 hand events in 139 files: 1,235 `reviewed`, 1 `draft`, 0 `published`, 0 with `review.reviewed_by`. 236 leads in 106 files. `pnpm validate`: 0 errors, 1,198 warnings.
- `CHECKUP.md` (author's list) exists on both branches. `docs/review/monthly-2026-11.md` holds the monthly run.
- Assessment statuses over all 193 files: none-found 3,386, unchecked 1,908, has-events 792, no-data 313, not-applicable 163.

## Part 2 — What is missing

### 2.1 Unfilled assessments (the largest gap)

Unchecked entries that a research session can fill (the generated indicators A1, A2, A4, B1, B2, C3, D1 and B8 are derived by the build and never hand-authored; they are excluded below):

| Indicator | Unchecked | Who |
|---|---|---|
| A3 F-35 supply chain | 148 | every light-protocol country |
| A5 military cooperation | 148 | every light-protocol country |
| A7 full two-way arms embargo | 148 | every light-protocol country |
| C6 procurement exclusion | 148 | every light-protocol country |
| A6 export licences suspended | 147 | light protocol |
| A8 transit denied | 147 | light protocol |
| C5 sovereign/pension fund divestment | 147 | light protocol |
| C4 settlement goods ban/labelling | 146 | light protocol |
| B11 23, D4 21, B7 18, D5 16, C2 11, B12 9, B5 4, B10 2, C1 2 | 106 | scattered light-protocol countries |
| E1, E2, E3 (experimental, recorded, not scored in v1) | 166, 164, 166 | 148 light + 18 full-protocol countries |

Why it matters: docs/02 §12 rule 8 says no country may have an `unchecked` indicator when `NEXT_PUBLIC_SHOW_SCORES=true`. The P-22 gate as written in the plan and CHECKUP checks only the 45 full-protocol countries, and the build only writes a note (`packages/pipeline/src/build/index.ts`, kind `unchecked`), so nothing enforces rule 8. Filling the 1,285 scored entries removes the conflict; the scope question still goes to the author as a proposal (task T-F-METHOD).

Also unchecked: B8 for nine full-protocol countries (ARE, AZE, EGY, JOR, MAR, MYS, NGA, QAT, SAU; B-860, author's decision unless a state document is found).

### 2.2 Research the finish run could not do (no web search left; hosts refusing scripts)

- New events since each country's own session: about 30 of the 45 full-protocol countries (since 2026-09-27) and most of the 148 light-protocol countries (since their session date) were not reached (monthly-2026-11 §4, §5, §10).
- The P-16 "not searched" lists of the full-protocol waves (CAN to NLD, in the P-D rows of `docs/10-build-log.md`).
- Documents on hosts that refuse scripts and Save Page Now: ICJ case 192 declarations of BRA, MEX, BOL, BEL (B3 direction); UNRWA's 2025 donor table (D3); the Secretary-General's Article 19 documents on documents.un.org (188 of 218 absences unexplained, B-856); the EU–Canada summit statement of 30 Oct 2026 (consilium.europa.eu).
- Foreign ministers of DJI, KWT, LBN, SDN, SYR, YEM in an archived document (16 Oct 2026 statement; KWT 26 Oct 2023), and the other signatories' own copies of the 22 Sep and 16 Oct 2026 statements.
- Pre-2023 recognition rows without a state document: the nine of B-860 and HUN, POL, CZE, SDN, TUN, VUT, PNG.
- 236 leads, many waiting for an official copy (TJK Foreign Minister 26 Sep 2026, SUR President 81st session, TCD President 11 Nov 2024, NGA two B9, JAM, NIC, PHL, MRT …).
- Every "Also (T-P21-… / T-P-D …)" paragraph of the P-23 block of `PROMPTS.md` not closed by T-P23-1/2 (their reports in `.claude/run-briefs/reports.jsonl` say where they stopped).
- B5 for IDN and DZA (ministry statements; B-453).

### 2.3 Verification and maintenance

- Light-protocol groups 1–4 (NZL KAZ KGZ, TJK TKM UZB, MNG PRK BGR, BLR MDA ROU) were never put through Task V's checklist (Task V covered groups 5–49). Everything filed by this run needs it too.
- Full `pnpm check:wayback` over ~2,107 rows: stopped at about row 530 (B-858). The quarterly workflow `wayback.yml` has `workflow_dispatch`.
- Dependencies: `pnpm audit` shows 36 advisories, 2 critical in `next` 16.4.1 (B-858); issues #12, #13, #14 open.
- `pnpm calibrate` after the new events (results wait for the published dataset).

### 2.4 Methodology questions an agent drafts and the author decides

- Scope of the "no unchecked" rule for the score flip (docs/02 §12 rule 8 vs the 45-country gate).
- Article 19: how B1 treats a state not entitled to vote vs a non-vote (both −2 now; B-856).
- A4 data-year gap: 2024 orders unscored (AUT, AZE, SVK, USA, KEN, PHL, LBR; B-857).
- PR #15 (rc.2) is already drafted; only the author decides it.

### 2.5 Only the author (never done by an agent; full list in CHECKUP.md and HANDOFF.md Part 4)

Review PR #11 and run `pnpm publish:events --pr 11`; merge PR #11 and close #1–#10; decide PR #15; decide B-860 and the flagged readings; contact email, About text, French reading pass; accounts and settings; reviewers and readers' notes; tags `v0.9.0-scorecard` and later `v1.0.0`; SIPRI terms; merge the dependency PR this run opens.

---

## Part 3 — Rules for this run (on top of HANDOFF.md Part 1 and CLAUDE.md)

1. **Branch:** `data/phase1` in `/Users/mohorozovic/M2/GAI`. Code changes go on a branch from `main` with a pull request that the agent does not merge (T-F-DEPS). Never merge a PR, tag, deploy, publish, set `status: published` or `review.reviewed_by`, delete data, or rewrite `archive/index.csv` (remove only your own failed rows by exact id).
2. **Search tools, in this order:** `WebSearch` (load it with ToolSearch); `WebFetch` if present; `curl --compressed` and the Wayback CDX API (`https://web.archive.org/cdx/search/cdx?url=…`); the built-in browser pane (`mcp__Claude_Browser__*`, one tab, closed when done) for pages that refuse scripts — `icj-cij.org`, `unrwa.org`, `documents.un.org`, `consilium.europa.eu`, ministry sites rendered by script — and, if WebSearch is unavailable, for a search engine page. Never bypass a CAPTCHA or a bot check. A page read in the browser still needs `pnpm archive <url>` (or `--capture <timestamp>` of an existing Wayback copy); if neither works, the fact is a lead.
3. **Never fabricate** (HANDOFF 1.2): never file from a search summary; open and archive the primary page; check byte count and SHA-256 of every capture against the replay (not a bot-check page).
4. **Filling an assessment** (Part 2.1): for each unchecked indicator, run the searches docs/06 and the full-protocol sessions use (English plus the official language; the ministry's site; the indicator's natural primary source, e.g. the F-35 programme's partner and supplier lists for A3, the national export-control authority for A6/A7, port/airspace authority and government statements for A8, customs/trade ministry for C4, the fund's exclusion list for C5, procurement authority for C6, health ministry/WHO evacuation lists for D4, immigration authority for D5, prosecutor/courts for E1/E3, police/interior ministry for E2). Set `has-events` only with a filed event; `none-found` only after the searches, with the queries, date and pages read in the note; `no-data` only where the indicator has no source for that state; `not-applicable` only as docs/02 §8 allows. Copy the note structure of a full-protocol country of the same region (`data/assessments/{ISO3}.yaml`).
5. **Build-log ids:** this run uses B-872 to B-999, then B-2001 upward (B-1001–B-1999 stay reserved for the Antigravity track). Take the next free id at the moment you write.
6. **Commit trailer:** the model you run on: `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` or `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
7. **Before every commit:** `pnpm lint && pnpm typecheck --concurrency=1 && pnpm test --concurrency=1 && pnpm validate` (0 errors); `pnpm build` only where the card says so. Push after each task (retry up to 15 minutes on network failure).
8. **Report line:** append one line to `.claude/run-briefs/reports.jsonl` (short Python command) with the keys `id, date, status (done|partial|blocked), summary (≤1,500 chars), not_done, decisions_differing_from_prompt, open_questions, author_checks, branches_pushed, pushed, pr_url, blocker`. Each session also adds its B-rows, its summary table in the review file the card names, and an "Also (T-F-… )" paragraph to the P-23 block of `PROMPTS.md` for anything it defers.
9. **Done rule:** a task is done when `reports.jsonl` has a line with its id and `"status": "done"`, or `git log data/phase1 --format=%s` has a commit subject containing `<id>:`. A `partial` task runs again with "resume: follow HANDOFF.md 1.3 on uncommitted work".
10. **Stop:** research sessions stop at 120 minutes of work, other sessions at a natural commit point: commit and push what is sound, report `partial` with what is left (country by country).
11. **Memory rules (copy verbatim into every brief):**

> This Mac has 8 GB of RAM and runs the Claude app at the same time.
> - Run one heavy command at a time. Use `pnpm typecheck --concurrency=1` and `pnpm test --concurrency=1`.
> - Run `pnpm build` only if your task card says so, as `NODE_OPTIONS=--max-old-space-size=3072 pnpm build`, and nothing else at the same time.
> - No dev server. The built-in browser pane only for pages that refuse scripts (or as the search page when WebSearch is unavailable): one tab at a time, closed when done. No Chrome.
> - Run Save Page Now captures one at a time (a background capture is fine, never several at once).
> - Never load `data/structured/raw/` (a 352 MB file is there) or a whole `archive/text/` directory into memory; read files by name, `grep` to find passages.
> - Never run `pkill node`, `killall node` or similar: the Claude app is a Node process. Stop only the processes you started, by PID.
> - Do not start sub-agents of your own.

---

## Part 4 — Task cards (run in this order, one at a time)

Each card: id · model · effort · what to read · steps · output. Light groups are the entries of `.claude/run-briefs/light_groups.json` (index n−1 = group n; group 49 = YEM, LIE, LUX, MCO).

### Phase A — Unblock

**T-F-HOUSE** · sonnet · medium
- Read: this file, `CHECKUP.md` §7, `docs/review/monthly-2026-11.md` §10.
- Steps: confirm the working tree is clean and in sync with `origin/data/phase1`; write B-871's follow-up status if needed; start the quarterly Wayback check on GitHub's runners (`gh workflow run wayback.yml --ref main`), wait for it (`gh run watch`, up to 3 hours, in the background), read its result, re-archive or record every failing row (issue #14: comment the result only if the workflow does not do it itself); record the counts in a B-row and in `docs/review/monthly-2026-11.md` (new section "11. Finish plan of 2026-11-08").
- Output: the Wayback result recorded; failing rows re-archived (`pnpm archive … --id src_…`) or listed.

**T-F-UNDOCS-1** · opus · high — documents on hosts that refuse scripts (browser pane)
- Steps: (1) ICJ case 192: the Court's list of declarations of intervention, and the declarations of BRA, MEX, BOL, BEL; file or fix B3/B4 by direction for each intervener not yet filed (check every country's events first). (2) The EU–Canada summit statement of 30 Oct 2026 (consilium): file for CAN and the EU members it binds only as the earlier joint-statement sessions did. (3) The 16 Oct 2026 and 22 Sep 2026 joint statements: the signatories' own copies, and the foreign ministers of DJI, KWT, LBN, SDN, SYR, YEM in an archived document; file the missing signatories. (4) B5 for IDN and DZA.
- Output: events/leads, B-rows, a section in `docs/review/monthly-2026-11.md` §11.

**T-F-UNDOCS-2** · sonnet · high — UNRWA 2025 donor table
- Steps: find and archive UNRWA's 2025 pledges/contributions table (unrwa.org via the browser; Wayback copy otherwise); file D3 for each donor exactly as the earlier D3 events from the 2023/2024 tables were filed (same columns read, same "increased/new" rule, check each country's existing D3 events first; never double-count a year).
- Output: D3 events, assessment statuses updated, B-row, §11 table.

**T-F-UNDOCS-3** · sonnet · high — Article 19 documents
- Steps: archive the Secretary-General's Article 19 letters/notes for each of the twelve vote dates (documents.un.org via the browser); extend the table of monthly-2026-11 §6 so each of the 218 absences is "not entitled" or "non-vote", with the document; do not change `unga_votes.csv` semantics or the methodology.
- Output: §6 completed, B-row; input for T-F-METHOD.

### Phase B — Full-protocol countries (45), one wave per session

For each wave: (1) new events from 2026-09-27 to today: the Phase 1 queries per indicator group (docs/06) in English and the official language, then the primaries, archived; (2) the wave's P-16 "not searched" lists (P-D rows of `docs/10-build-log.md`) and its P-23 "Also" paragraphs; (3) its leads: look for the official copy, file or keep; (4) unchecked entries (E1–E3, B8 for the nine: only a document of the state itself; otherwise leave for B-860); (5) score preview, review table in `docs/review/monthly-2026-11.md` §11.

| id | wave | model · effort |
|---|---|---|
| T-F-W1 | USA DEU GBR FRA ESP | sonnet · high |
| T-F-W2 | IRL ZAF TUR EGY IND | opus · high |
| T-F-W3 | ITA NLD CAN AUS BEL | sonnet · high |
| T-F-W4 | NOR SWE DNK CHE AUT | sonnet · high |
| T-F-W5 | SVN CZE HUN POL GRC | sonnet · high |
| T-F-W6 | JPN KOR CHN RUS BRA | opus · high |
| T-F-W7 | COL CHL MEX BOL ARG | sonnet · high |
| T-F-W8 | SAU ARE QAT JOR MAR | opus · high |
| T-F-W9 | IDN MYS DZA NGA AZE | opus · high |

### Phase C — Light-protocol completion (148 countries), two groups per session

For each country of the batch: (1) every unchecked indicator of Part 2.1 filled per rule 4 of Part 3 (A3, A5–A8, C4–C6 first; then the scattered ones; E1–E3 last); (2) new events since the country's own session date (its section of `docs/review/light-protocol.md`), searched per indicator group; (3) its leads (official copy → event, otherwise keep and note the search); (4) its P-23 "Also (T-P21-…)" follow-ups and a missing pre-2023 recognition row (state document only; SDN, TUN, VUT, PNG among them); (5) second reading, French summaries (`docs/glossary.fr.md`), score preview; (6) a session table appended to `docs/review/light-protocol.md` under a new section "Completion of 2026-11". Do not hand-author generated indicators.

| id | groups | model · effort |
|---|---|---|
| T-F-L01 | 1, 2 (NZL KAZ KGZ TJK TKM UZB) | sonnet · high |
| T-F-L02 | 3, 4 (MNG PRK BGR BLR MDA ROU) | sonnet · high |
| T-F-L03 | 5, 6 (SVK UKR ATG BHS BLZ BRB) | sonnet · high |
| T-F-L04 | 7, 8 (CRI CUB DMA DOM ECU GRD) | sonnet · high |
| T-F-L05 | 9, 10 (GTM GUY HND HTI JAM KNA) | sonnet · high |
| T-F-L06 | 11, 12 (LCA NIC PAN PER PRY SLV) | sonnet · high |
| T-F-L07 | 13, 14 (SUR TTO URY VCT VEN FJI) | sonnet · high |
| T-F-L08 | 15, 16 (PNG SLB VUT FSM KIR MHL) | sonnet · high |
| T-F-L09 | 17, 18 (NRU PLW LBY SDN TUN EST) | opus · high |
| T-F-L10 | 19, 20 (FIN ISL LTU LVA TON TUV) | sonnet · high |
| T-F-L11 | 21, 22 (WSM BRN KHM LAO MMR PHL) | sonnet · high |
| T-F-L12 | 23, 24 (SGP THA TLS VNM AFG BGD) | opus · high |
| T-F-L13 | 25, 26 (BTN IRN LKA MDV NPL PAK) | opus · high |
| T-F-L14 | 27, 28 (ALB AND BIH HRV MKD MLT) | sonnet · high |
| T-F-L15 | 29, 30 (MNE PRT SMR SRB VAT AGO) | sonnet · high |
| T-F-L16 | 31, 32 (BDI BEN BFA BWA CAF CIV) | sonnet · high |
| T-F-L17 | 33, 34 (CMR COD COG COM CPV DJI) | opus · high |
| T-F-L18 | 35, 36 (ERI ETH GAB GHA GIN GMB) | sonnet · high |
| T-F-L19 | 37, 38 (GNB GNQ KEN LBR LSO MDG) | sonnet · high |
| T-F-L20 | 39, 40 (MLI MOZ MRT MUS MWI NAM) | opus · high |
| T-F-L21 | 41, 42 (NER RWA SEN SLE SOM SSD) | opus · high |
| T-F-L22 | 43, 44 (STP SWZ SYC TCD TGO TZA) | sonnet · high |
| T-F-L23 | 45, 46 (UGA ZMB ZWE ARM BHR CYP) | opus · high |
| T-F-L24 | 47, 48 (GEO IRQ KWT LBN OMN SYR) | opus · high |
| T-F-L25 | 49 (YEM LIE LUX MCO) | opus · high |

### Phase D — Code and methodology drafts

**T-F-DEPS** · sonnet · medium
- Steps: on a branch `chore/deps-2026-11` from `origin/main`: update `next` past the critical advisories and the other runtime dependencies within their majors; `pnpm audit`; full checks plus `NODE_OPTIONS=--max-old-space-size=3072 pnpm build` and `pnpm build:data:check`; push the branch and open a PR to `main` (do not merge); wait for its CI (`gh pr checks --watch`) and fix failures; note issues #12 and #13 status in the PR text (close nothing). B-row on `data/phase1`.
- Output: a green PR for the author to merge.

**T-F-METHOD** · opus · high
- Steps: write three proposals in `docs/proposals/` on `data/phase1` in the format of the rc.2 proposals (no version folder, no PR, no Discussion): (1) scope of docs/02 §12 rule 8 for the score flip, with the counts of unchecked entries left after Phase C, options (all countries; only countries with zero unchecked show a score; rule changed) and a recommended default; (2) Article 19 treatment in B1 (from T-F-UNDOCS-3); (3) the A4 data-year gap (B-857). Add the items to the P-24 block of `PROMPTS.md` and B-rows.
- Output: three proposal files for the author.

### Phase E — Verification

Apply Task B2's checklist (HANDOFF.md: quote at the locator; byte count and SHA-256 against `archive/index.csv` and the Wayback replay; speaker and wording under R3/R4/R7; date and tier; scope tags; French summary) to every event, lead, recognition row and changed assessment status written since `29dabb1`, plus everything of light groups 1–4. Fix in place or move to leads; never publish. Record a table per country in `docs/review/light-protocol.md` "Verification of 2026-11 (second pass)" (light) or `docs/review/monthly-2026-11.md` §11 (full protocol), B-row per session, flagged readings for CHECKUP.

| id | scope | model · effort |
|---|---|---|
| T-F-V1 | groups 1–4 (all their records) and the new records of T-F-L01–T-F-L10 | opus · high |
| T-F-V2 | the new records of T-F-L11–T-F-L25 | opus · high |
| T-F-V3 | the new records of T-F-W1–W9 and T-F-UNDOCS-1/2/3 | opus · high |

### Phase F — Close

**T-F-CHECKUP** · opus · high
- Steps: update `CHECKUP.md` (on `main` as T-CHECKUP did, then merge `main` into `data/phase1` with a merge commit): status, every new flagged reading and decision with its B-id and default, the proposals of T-F-METHOD, the dependency PR, the known gaps left. Update HANDOFF.md Part 2.0 and this file's Part 1 with the new state.

**T-F-FINAL** · sonnet · medium
- Steps: HANDOFF Task G on both branches (`pnpm build` allowed): checks, `pnpm build:data:check`, PR #11's description refreshed with final counts per country, CI green (`gh run list`), `git worktree list`, no `.env` value in history (never print them). Final report line.

Total: 1 + 3 + 9 + 25 + 2 + 3 + 2 = 45 tasks; about 70–80 hours of agent time, one at a time.

---

## Part 5 — The workflow (for the orchestrating session)

The orchestrator does no research and no editing; it builds and runs one Workflow, after loading the `workflow-authoring` skill. It reads only this file, `CLAUDE.md` and HANDOFF.md Parts 0–1.

**Pre-flight, while the author is present:**
1. `mcp__ccd_host__request_keep_awake` with `until: "session_idle"` (load with ToolSearch); if unavailable, tell the author to run `caffeinate -dimsu`.
2. Load `WebSearch` with ToolSearch and run one test query. Open the built-in browser once on `https://www.icj-cij.org`, `https://www.unrwa.org`, `https://documents.un.org`, `https://www.consilium.europa.eu` and `https://duckduckgo.com/html/` so the author can approve each site now; close the tab. Tell the author which of the two routes work. If neither WebSearch nor the browser works, stop and say so: Phases B and C cannot run without a search route.

**Script shape:**
- Concurrency 1: tasks run strictly one after another with `await`; never `parallel()` or `pipeline()` over tasks.
- First agent `T-F-SCOUT` (sonnet, effort low, schema `{done: string[], partial: string[], notes: string}`): applies the done rule of Part 3.9 to every id of Part 4 and returns the lists. The script skips done ids and adds the resume note to partial ones.
- Then one agent per task card, in Part 4's order, with `model` and `effort` from the card, label = id, phase = the card's phase.
- **Each brief is self-contained and generated from the card:** "You are one session of the finish plan of the Gaza Accountability Index in /Users/mohorozovic/M2/GAI on branch data/phase1. Your task id is `<id>`." + the card's full text (read, steps, output, and for batch cards the country list and the per-country steps of its phase) + "Read first: CLAUDE.md, FINISH-PLAN.md Part 3 and your card, HANDOFF.md Part 1 and Appendix B; then the files your card names." + Part 3 rules 1–10 in one paragraph + the memory rules verbatim + the commit trailer for its model + "Return the JSON of the result schema as your final answer."
- Result schema: `id` (string), `status` (`done` | `partial` | `blocked`), `commit` (string), `pushed` (boolean), `validate_errors` (number), `summary` (≤ 600 characters), `blocker` (string), `author_items` (string[]), `countries_left` (string[], countries of the card not finished).
- After each agent: `done` → next. `partial` → run the same id once more with the resume note; a second `partial` → record and go on. `blocked`, `validate_errors > 0` or `pushed: false` → one fresh `sonnet` (effort medium) fixer whose only job is to read `git status`, `git log -5`, the task's last report line and the blocker, fix what is in its power (push retry for 15 minutes; a validation error the task caused) and return the same schema; if it fails, stop the workflow and return everything so far. A blocker confined to one batch's research (site down, CAPTCHA) with a clean tree, 0 errors and a push is recorded and the run goes on. An agent that dies (null result or thrown error: usage limit, network) → stop the workflow and return everything so far.
- Return `{stopped, skipped, results}`.

**When the workflow ends or stops**, the orchestrator prints: tasks done, partial (with `countries_left`) and blocked (with the blocker); the `author_items` numbered (also written to `.claude/run-briefs/author-items-2.md`); `pnpm validate`'s count line; `git log --oneline -1`; the number of `unchecked` entries left (a short Python count over `data/assessments/*.yaml`, excluding generated indicators); and what is left. When the author says "continue", it re-runs the same script: the scout skips what is done.

---

## Part 6 — After the author's steps (a later session, not this workflow)

When the author has published PR #11 (`pnpm publish:events --pr 11`) and merged it:
1. Corrections: any error found later in a published event goes through `data/corrections.yaml` (P-25). The scorecard launch needs at least one entry; never create one without a real error.
2. `pnpm calibrate --date {DATE} --fts` on the published data; recompute `diff.json` (recipe in `PROMPTS.md`).
3. Browser tests in score mode on the real data and Lighthouse on the published build (the flip PR's CI).
4. The scorecard launch (P-20) and later the flip (P-22) by the author, with the commands in `CHECKUP.md` §6 and `docs/review/score-flip-dry-run.md` §6.
5. Monthly maintenance (P-23) each month.

## Part 7 — Definition of done for this plan

- 0 unchecked entries on scored, hand-researched indicators in all 193 countries, or each left one with its searches recorded and the reason in `countries_left`/CHECKUP.
- Every country searched for new events up to the run date; every lead re-checked once; the blocked-host documents archived or recorded as leads.
- Every record written since `29dabb1`, and light groups 1–4, verified.
- Wayback check complete; dependency PR green and waiting for the author.
- Three methodology proposals written; CHECKUP.md updated on both branches.
- `pnpm validate` 0 errors; deterministic build; CI green on `main`, PR #11 and the dependency PR.
- Nothing published, merged, tagged or deployed from a preview build.
