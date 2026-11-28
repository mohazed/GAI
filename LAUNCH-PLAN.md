# LAUNCH-PLAN — everything left between today and the score flip

Written on 2026-11-27 by the orchestrating session. The author asked for this with "do everything left to do. write the whole plan and create a dynamic workflow to do the whole work". Asked how far agents should go, the author answered: "do all what you can do (even if it means doing everything) and leave the manual work and review as notes for me to check on later in a markdown file so that i do the review after everything is done". This plan follows on from `FINISH-PLAN.md` (2026-11-08 to 2026-11-10) and the P-23 pre-launch pass (2026-11-10 to 2026-11-11, cards `T-G-…`). Its cards use the ids `T-H-…` and its build-log rows start at B-2167.

## Part 1 — State on 2026-11-27

Nothing has been committed since 2026-11-11 (`acd5516` on `data/phase1`, `73c166d` on `main`). See CHECKUP.md §1 for the counts:

- 1,435 hand events: 1,434 `reviewed`, 1 `draft`, 0 published.
- BHR B12 is the only hand entry still unchecked.
- B8 is unchecked for 7 states.
- 307 leads are open.

Open pull requests:

- PR #11: the dataset.
- PR #15: methodology rc.2.
- PR #16: dependencies, CI green.
- PR #17: the rule 8 gate, CI green.
- PRs #1–#10: superseded by #11.

The live site runs in scorecard mode from `main`. Google Chrome is installed on this Mac. GitHub Discussions are enabled on `mohazed/GAI`.

## Part 2 — The author's answers of 2026-11-27 (they extend HANDOFF Part 4 for this run only)

| Question | Answer | What the run does |
|---|---|---|
| How far agents go | "do all what you can do … leave the manual work and review as notes … in a markdown file" | Everything below, except the steps in Part 3. CHECKUP.md gets a new §0: the author's review, in order, with ready commands. |
| Score-changing decisions | Apply CHECKUP defaults | B8 rows from A/78/846, flagged, for ARE AZE EGY JOR MAR MYS NGA. BHR B12 set to `no-data` with its note if it is still unreadable. Article 19 (b)+(c) and A4 (c) drafted as methodology 1.0.0-rc.3 (PR plus Discussion, 14-day window). Every other recommended default of CHECKUP §2 applied and logged. |
| Browser checks | "install them or use chrome extension if it's better" | Agents use the installed Google Chrome (`CHROME_PATH`) for Lighthouse. They install Playwright's Chromium only where the browser tests need it. One browser process at a time. |
| Discussions | Agents post them | Agents post the rc.2 and rc.3 Discussions with `gh` and add their `methodology/proposals.yaml` entries. |
| Merges | Covered by "do everything" | Agents merge PR #16, PR #17 and this run's own code PRs to `main`, with merge commits, after CI is green. |

## Part 3 — What the run still does not do, and why

Each of these goes into CHECKUP.md §0 as a ready step.

1. **`pnpm publish:events` and `review.reviewed_by: mzouad`.** The field is the author's signature that the author checked the events (D-xx signed authorship; docs/03 §11). The author said the review comes after everything else is done, so the signature waits for it. An agent writing it before then would record a check that has not happened, and that would break "never fabricate" in CLAUDE.md. The run prepares the 10 % sample and a one-paste prompt, so publishing takes one session after the review.
2. **Merging PR #11 and closing #1–#10.** These depend on step 1, because merging unpublished events would put nothing on the site.
3. **Tag `v0.9.0-scorecard`, `changes/launch.md` live, and the score flip (P-22).** These depend on steps 1 and 2. The flip also depends on the reviewers' sign-offs and the readers' notes (docs/08 §2).
4. **Merging PR #15 (rc.2) and the rc.3 PR.** docs/08 requires a 14-day public window from the Discussion. The run posts both Discussions, and the windows close 14 days after the posting date. CHECKUP §0 gives the date and the merge commands.
5. **Things only a person can do:** creating a contact address, recruiting reviewers and readers, a native French reader's pass, Cloudflare token and environment settings, a domain, editing `CLAUDE.md`, uploading Internet Archive items for documents behind human checks, and distribution (spec §9).

## Part 4 — Task cards (run in this order, one fresh agent each)

Common rules: FINISH-PLAN.md Part 3, rules 2–11, with these changes.

- Rule 1 becomes: data work goes on `data/phase1`; code goes on a branch from `main` with a PR. The cards that say so may merge that PR, with a merge commit, after CI is green. After any merge to `main`, merge `origin/main` into `data/phase1`.
- Rule 5: build-log ids from B-2167 upward.
- The "No Chrome" line of the memory rules does not apply to T-H-BROWSER.
- Review tables go in a new `docs/review/monthly-2026-11.md` §13 "Launch plan of 2026-11-27" (full protocol and cross-country) and a new section "Launch plan of 2026-11-27" of `docs/review/light-protocol.md` (light protocol).

### Phase A — Setup and code

| Id | Model | Card |
|---|---|---|
| T-H-HOUSE | sonnet | Check the tree is clean and in sync. Write one B-row with Part 2 and Part 3 of this plan. Start the third Wayback check now (`gh workflow run wayback.yml --ref data/phase1`) and write its run id in the B-row, so T-H-WAYBACK reads a finished run. |
| T-H-MERGE | sonnet | Merge PR #16, then bring PR #17 up to date with `main` (merge commit) and wait for its CI, then merge PR #17. Merge commits only. Check that the Deploy run of `main` is green and that the live home page, a country page and `/api/v1/manifest.json` answer. Merge `origin/main` into `data/phase1` and run `pnpm build:data:check` there. Record which commits are live. |
| T-H-ARCHIVER | opus | The archiver's 200 KB text limit (CHECKUP §7): remove or raise it on a branch from `main`, with tests and a note in docs/04, then PR, CI and merge. On `data/phase1`, extract the full text of the sources this limit cut (B-509 (1), the Italian stenographic record, the Moniteur PDF if it was cut). Never change a recorded hash or a quote that is already filed. Add text only where it was truncated, check it with the quote checker, and file what the new text makes quotable. |

### Phase B — Decisions by default

| Id | Model | Card |
|---|---|---|
| T-H-DEFAULTS | opus | (1) Add `recognitions.csv` rows from A/78/846 (`src_20240409_un-unispal_a-78-846-recognition-annex`), flagged, as CHECKUP §2b gives them: ARE 1988-11-16, AZE 1992-04-15, EGY 1988-11-18, JOR 1988-11-16, MAR 1988-11-15, MYS 1988-11-15, NGA 1988-11-18. HUN and CZE get no row. (2) Retry BHR B12 once more by every route T-G-B8 recorded. If it is still unreadable, set `no-data` with the note (B-2116, B-2098 default). (3) Apply the plain data fixes that CHECKUP §2c and §2e give as defaults: ECU `recognises_palestine.since` from the Ministry's date, the NZL entry in docs/06 §8, the missing `points_rationale` of the BEL and BRA B3 events, and any other "correct …" or "add …" default there. (4) Run `pnpm build:data --preview` and confirm `counts.unchecked` is 0. Add a table of score and band changes. |
| T-H-METHOD | opus | (1) **rc.3**: on a branch `methodology/v1.0.0-rc.3` built on PR #15's branch, apply the defaults of the three T-F-METHOD proposals, in the format and under the governance of docs/08 and the rc.2 PR. Article 19: option (b), 0 points for a not-entitled absence from a dated table beside `unga_votes.csv`, plus option (c), showing the reason. A4: option (c), each data year from 2024 scored once, in the first imported release that reports it. Rule 8: scope (a), already enforced by PR #17. Also state D3 as a qualifying event (CHECKUP §2a) in the methodology note. Write unit tests with the worked examples, EN and FR wording, a changelog entry and a side-by-side preview table. Open a PR into `data/phase1` and do not merge it. (2) **Discussions**: post the rc.2 Discussion from `docs/proposals/v1.0.0-rc.2-discussion.md` (with `{PR}` = 15) and an rc.3 Discussion in the same format, using `gh api graphql`. Add both entries to `methodology/proposals.yaml` on `main` (PR, CI, merge) so the Changes page shows them. Record the posting date and the window's closing date. |

### Phase C — Archive health and structured data

| Id | Model | Card |
|---|---|---|
| T-H-WAYBACK | sonnet | Read the check that T-H-HOUSE started, waiting for it if needed. Re-capture with `--root` on a scratch directory every source that still fails, including the AIM source of `lead_*_MOZ_1` and the poderjudicial source. Record the result as `archive_url_alt` only where the bytes match. No recorded hash is edited and `archive/text/` is unchanged. Write `docs/review/wayback-check-2026-11-27.tsv`. Close #14 if every row now replays; otherwise comment the counts on it. |
| T-H-STRUCT | sonnet | P-23's monthly structured work: `pnpm fetch:fts` and `pnpm fetch:worldbank`; `pnpm fetch:comtrade` for the reporters the P-23 block names, early in a UTC day; new qualifying UNGA votes and UNSC vetoes since the last run, following the rules of the P-23 block; the nightly runs and issues. Record the effect with `pnpm score --preview` on the countries that move. |
| T-H-UNDOCS | opus | Documents the leads wait for that may now exist: A/80/PV.7–16 and A/81/PV in the Official Document System, transcripts.un.org for the 81st General Debate, and gadebate files of the 81st session. File every lead and P-23 "Also" item they settle, under R3, R4 and R7, archived, with the second reading and FR summaries. |

### Phase D — Catch-up: new events since each country's last session (about 2026-11-09) to today

Per country:

1. New events, using the queries of docs/06 per indicator group, in English and the official language, then the primaries, archived.
2. The country's open leads and its P-23 "Also" items.
3. The second reading, FR summaries and `pnpm score --country XXX --preview`.
4. A review table.

Commit after each country, with the subject prefix "<id> (part):".

| Id | Countries |
|---|---|
| T-H-MF-1 | USA DEU GBR FRA ESP IRL ZAF TUR EGY |
| T-H-MF-2 | IND ITA NLD CAN AUS BEL NOR SWE DNK |
| T-H-MF-3 | CHE AUT SVN CZE HUN POL GRC JPN KOR |
| T-H-MF-4 | CHN RUS BRA COL CHL MEX BOL ARG SAU |
| T-H-MF-5 | ARE QAT JOR MAR IDN MYS DZA NGA AZE |
| T-H-ML-1 | light groups 1–8 (NZL … GRD) |
| T-H-ML-2 | light groups 9–16 (GTM … MHL) |
| T-H-ML-3 | light groups 17–24 (NRU … BGD) |
| T-H-ML-4 | light groups 25–32 (BTN … CIV) |
| T-H-ML-5 | light groups 33–40 (CMR … NAM) |
| T-H-ML-6 | light groups 41–50 (NER … MCO) |

Light groups are the entries of `.claude/run-briefs/light_groups.json` (index n−1 is group n).

### Phase E — Remaining re-search and verification

| Id | Model | Card |
|---|---|---|
| T-H-RS | opus | The primary sources still not searched behind `none-found` entries (CHECKUP §7): the hosts listed in B-2156 (4), retried, with Wayback CDX copies; Pashto for AFG and Sinhala for LKA on the 11 entries of B-2164 (9); Malay and Tamil for SGP (B-2160). |
| T-H-V1 | opus | Verification (HANDOFF Task B2 checklist) of every record that T-H-ARCHIVER to T-H-MF-5 wrote or changed. |
| T-H-V2 | opus | The same, for T-H-ML-1 to T-H-RS. |

### Phase F — Site checks and launch preparation

| Id | Model | Card |
|---|---|---|
| T-H-BROWSER | sonnet | On the preview build of the final data (`pnpm build:data --preview`, then the web build; never deployed), run one browser at a time. (1) Lighthouse with `CHROME_PATH` set to the installed Chrome, on the pages of docs/04 §3 including `/en/country/NOR/`. If LCP on NOR is over 1.5 s, move the "All n values" tables out of the page (B-864). (2) The browser tests in score mode, on a local build with `NEXT_PUBLIC_SHOW_SCORES=true` that is never deployed (install Playwright's Chromium only if the tests need it). (3) Overflow at 360, 768 and 1280 px on ten pages, plus French punctuation on ten share cards. (4) Pages with scripts off, read through curl. (5) The widget on a second localhost origin (two static file servers, stopped by PID afterwards). Fix what fails on a branch from `main`: PR, CI, merge. Write the results in `docs/review/launch-readiness.md` §5. |
| T-H-PREP | opus | (1) **The author's sample.** Write `docs/review/author-sample-2026-11.md`: a reproducible 10 % sample of the reviewed events (sorted by `sha256(id)`, the first 10 %, every country with at least one), each with its quote, the excerpt of `archive/text` at the locator, the Wayback link, speaker, date, tier, scope, the FR summary and a checkbox. (2) Run `pnpm calibrate` on the preview data and refresh the reader packet in `docs/calibration/`. (3) Refresh `docs/review/score-flip-dry-run.md` with the current preview. (4) Fill `changes/launch.md` and `docs/drafts/index-launch.md` with everything except `{CONTACT}` and the counts that publication fixes (marked). (5) Write the publish, merge and tag commands and the one-paste review prompt, ready for CHECKUP §0. |
| T-H-CHECKUP | opus | Update CHECKUP.md on `main`, then merge it into `data/phase1`. Add a **new §0 "Your review, in order"**: a short, numbered list of what is left for the author, each step with its file and command (Part 3 of this plan; the sample review; publish, merge and tag; the dates of the rc.2 and rc.3 windows; reviewers and readers; contact; accounts; the archive uploads). Recompute §1. Add a new §2h with every default this run applied and its B-id. Close or update the rows this run settled. Also write `.claude/run-briefs/author-items-5.md`. |
| T-H-FINAL | sonnet | HANDOFF Task G on both branches: checks, `pnpm build:data:check` and `pnpm build`; PR #11's description refreshed; CI green; `git worktree list`; no secrets in history. |

## Part 5 — The workflow

The orchestrator runs workflow `gai-launch-plan`: a scout applies the done rule, then the cards run strictly in sequence, one fresh agent each, with the model each card names. The orchestrator does no research or editing itself (8 GB of RAM). A card that ends blocked, with validation errors or unpushed work, gets a fixer. A partial card runs once more with the resume note. A used-up search budget stops the run. `caffeinate` runs in the background during the run. "Continue" means re-running the same script, and the scout skips the cards that are done.

## Part 6 — Definition of done

Every card has a `done` line in `.claude/run-briefs/reports.jsonl`, or a recorded reason. CHECKUP §0 lists only steps that a person must take, each with a ready command. `pnpm validate` reports 0 errors on both branches. CI is green.
