# Score-flip dry run (P-22; run T-P22 of 2026-11-05, refreshed by T-H-PREP on 2026-11-28)

What this is: the dry run of the score flip of `PROMPTS.md` P-22, without flipping (HANDOFF Task E). Each gate of P-22 is checked with its evidence; the scores are compared under methodology 1.0.0-rc.1 and the two proposals 1.0.0-rc.2 (PR #15) and 1.0.0-rc.3 (PR #19) side by side, because the author has not decided them; the site was checked in score mode on a local preview build; the flip's command sequence is written out for the author (§6). Nothing was flipped: `methodology/v1.0.0/` still declares 1.0.0-rc.1 on `data/phase1` and `main`, `apps/web/.env.production` still reads `NEXT_PUBLIC_SHOW_SCORES=false`, no tag was made, nothing was published or deployed. The draft of the flip's note is `docs/drafts/index-launch.md` (not `changes/`, so no build reads it).

**Refresh of 2026-11-28** (task T-H-PREP of the launch-plan run, LAUNCH-PLAN.md Part 4; docs/10 B-2225). §1, §2, §4, §5 and §6 are rewritten on the data of `data/phase1` at `63b4c8b` (the dataset after the finish plan, the P-23 pass and the launch-plan run to T-H-BROWSER). §3 points to the browser checks of T-H-BROWSER (`docs/review/launch-readiness.md` §6) and keeps the two issues of 2026-11-05. All numbers below come from the **preview build** (`pnpm build:data --date 2026-11-28 --preview`: the 1,515 events at status `reviewed` scored as if published; the one `draft` left out). They are provisional and change when the author reviews and publishes the events.

## 1. The gates of P-22

| Gate (PROMPTS.md P-22 and its follow-ups) | Evidence on 2026-11-28 | State |
|---|---|---|
| Reviewers listed in `methodology/reviewers.yaml`, each sign-off naming v1.0.0 (P-10, B-142) | `reviewers: []` on `main` and `data/phase1`. The About page says "Reviewers: none yet." | **Not met** (author) |
| Three readers' notes in `docs/calibration/` (docs/08 §3) | The ten worksheets were recomputed on 2026-11-28 on the preview (1,515 reviewed events; `docs/calibration/README.md`, B-2224); all 30 reading slots are blank. P-15's follow-up asks for a re-run on the published dataset before the readers read them. | **Not met** (author) |
| The author's decision on the threshold changes: 1.0.0-rc.2 (PR #15) and 1.0.0-rc.3 (PR #19), merged after their window with the decision in the changelog (P-15, P-24 follow-ups) | Both PRs open, into `data/phase1`. Discussions posted on 2026-11-28: #20 (rc.2) and #21 (rc.3); both windows close on **2026-12-12** (docs/08 §1, B-2175). `methodology/proposals.yaml` on `main` lists both (PR #22). | **Not met** (author, after 2026-12-12) |
| Rule 8: no `unchecked` indicator on any of the 193 (docs/02 §12; scope (a), B-2098) | Preview build: `build-notes.json` `counts.unchecked` = **0** (B8 rows of A/78/846 added by default for ARE, AZE, EGY, JOR, MAR, MYS, NGA, B-2170; BHR B12 filed, B-2171; B-2173). The gate is in the build since PR #17 (`apps/web/scripts/rule8.ts`, merged on `main` as da585c6, B-2168): a score-mode build fails while the count is above 0. The same build without `--preview` gives **145**, because `has-events` is derived from published events only: publication clears it, and every event left out of publication turns its entry back to `unchecked` unless the entry has another published event or is changed to `none-found` with a note. | Met in the preview; to be checked after publication |
| `data/corrections.yaml` non-empty (docs/01 §6, docs/08 §5) | `[]`. A correction needs a published event. | **Not met** (author) |
| Sensitivity tables present (docs/02 §10) | `api/v1/sensitivity.json`: 5 tables, 15 rows, over 193 entities; the methodology page shows them. | Met |
| Hand events published (P-22 runs on the published dataset; P-16, P-17 follow-ups) | 0 of 1,516 hand-researched events are `published` (1,515 `reviewed`, 1 `draft`). The author's 10 % sample is `docs/review/author-sample-2026-11.md` (227 events, B-2223). | **Not met** (author) |
| T-P20's follow-ups for P-22 (B-859 to B-864) | (1) B8: decided by default (B-2170), author to confirm. (2) Corrections: above. (3) The dump in parts: every part under 25 MiB in the preview build of 2026-11-28 (largest event part 2025). (4) Lighthouse on the real data: passed on the preview, NOR LCP 0.84 s, so the "All n values" tables stay (T-H-BROWSER, `launch-readiness.md` §6.1, B-2221). (5) `proposals.yaml` entries for rc.2 and rc.3: present on `main`. | (1) author; (2) open; (3)–(5) met |

P-22 says: if any gate fails, stop and report; do not flip. Five gates fail, all on the author's side: publication of PR #11, reviewers, readers, the rc.2 and rc.3 decisions (not before 2026-12-12), a first correction.

## 2. The scores under 1.0.0-rc.1, 1.0.0-rc.2 and 1.0.0-rc.3, side by side

How (2026-11-28): on a local scratch branch of `data/phase1` (never pushed, deleted after the run), `origin/methodology/v1.0.0-rc.2` (2aab466) was merged and committed; one file conflicted, `data/structured/fts_funding.csv`, and was taken from `data/phase1` (refreshed by T-H-STRUCT on 2026-11-28; rc.2's rule 7 only removes FTS flows dated before 2023-10-07, which touch windows up to July 2024 and not the score on 2026-11-28). In that tree `pnpm methodology:diff --from data/phase1 --date 2026-11-28 --preview --json` scored every entity under the rc.1 files of `data/phase1` and the rc.2 files of the merge, with the same events. Then `origin/methodology/v1.0.0-rc.3` (38fa314, built on rc.2) was merged on top without a commit (no conflict), and the same command ran `--from` the rc.2 commit (rc.2 → rc.3) and `--from data/phase1` (rc.1 → rc.3). `pnpm validate` on the rc.3 tree: 0 errors, 1,219 warnings, so the rc.2 and rc.3 validator rules reject no event of the current dataset. The rc.1 column is the `countries.json` of the preview build; ranks are by display score among the 193, ties sharing the best rank.

Result: rc.2 moves **105** display scores, 31 passivity decisions and 28 bands (acting → passive 17, passive → enabling 7, confronting → acting 3, sustaining → enabling 1); rc.3 moves **10** more display scores from rc.2 and 5 bands (AFG Enabling → Passive, VEN Passive → Acting, AZE Passive → Enabling, KEN and SVK Acting → Passive), no passivity decision; from rc.1 to rc.3, 114 display scores. `pnpm calibrate` models the same rc.2 set and gives the same counts (105, 28, 31; `docs/calibration/README.md` §4). The causes are the rules of the proposals: the B1 cap at ±15 (most moves of 1 point), only contributions of +2 or more lift the passivity penalty (most band changes: a negative C2 or C3 event no longer lifts it), `confirmed` for official-video and parliamentary sources (Germany's C2 rests on a Bundestag paper, Türkiye's A8 on a record of the Grand National Assembly); under rc.3, the absence of a state without a vote under Article 19 scores 0 (AFG, VEN, BOL, STP) and the SIPRI orders of 2024 score once (AUT, AZE, KEN, LBR, PHL, SVK). On 2026-11-04 (1,235 reviewed events) rc.2 moved 120 scores and 38 bands.

Scored entities: 193. Band counts:

| Band | rc.1 | rc.2 | rc.3 |
|---|---|---|---|
| Sustaining | 4 | 3 | 3 |
| Enabling | 24 | 32 | 32 |
| Passive | 38 | 48 | 49 |
| Acting | 99 | 85 | 84 |
| Confronting | 28 | 25 | 25 |

The 45 full-protocol countries, ranked by the rc.1 display score (rank among the 193; ties share a rank):

| Country | ISO3 | rc.1 | rc.1 rank | rc.2 | rc.2 rank | rc.3 | rc.3 rank | Cause of the move (rc.2; then rc.3) |
|---|---|---|---|---|---|---|---|---|
| Spain | ESP | +82 Confronting | 1 | +82 Confronting | 1 | +82 Confronting | 1 | — |
| Belgium | BEL | +78 Confronting | 2 | +78 Confronting | 2 | +78 Confronting | 2 | — |
| Türkiye | TUR | +70 Confronting | 3 | +72 Confronting | 3 | +72 Confronting | 3 | A8 +1.6 → +4.1 (confidence) |
| Ireland | IRL | +67 Confronting | 4 | +67 Confronting | 4 | +67 Confronting | 4 | — |
| Netherlands (Kingdom of the) | NLD | +65 Confronting | 5 | +65 Confronting | 5 | +65 Confronting | 5 | — |
| Norway | NOR | +59 Confronting | 7 | +59 Confronting | 7 | +59 Confronting | 7 | — |
| South Africa | ZAF | +56 Confronting | 8 | +56 Confronting | 8 | +56 Confronting | 8 | — |
| United Kingdom of Great Britain and Northern Ireland | GBR | +55 Confronting | 10 | +54 Confronting | 10 | +54 Confronting | 10 | B1 +15.6 → +15.0 (indicator cap) |
| Chile | CHL | +52 Confronting | 12 | +51 Confronting | 12 | +51 Confronting | 12 | B1 +15.6 → +15.0 (indicator cap) |
| France | FRA | +52 Confronting | 12 | +51 Confronting | 12 | +51 Confronting | 12 | B1 +15.6 → +15.0 (indicator cap) |
| Jordan | JOR | +52 Confronting | 12 | +51 Confronting | 12 | +51 Confronting | 12 | B1 +15.6 → +15.0 (indicator cap) |
| Brazil | BRA | +51 Confronting | 15 | +50 Confronting | 16 | +50 Confronting | 16 | B1 +15.6 → +15.0 (indicator cap) |
| Canada | CAN | +51 Confronting | 15 | +51 Confronting | 12 | +51 Confronting | 12 | — |
| Mexico | MEX | +47 Confronting | 18 | +46 Confronting | 18 | +46 Confronting | 18 | B1 +15.6 → +15.0 (indicator cap) |
| Sweden | SWE | +45 Confronting | 19 | +44 Confronting | 20 | +44 Confronting | 20 | B1 +15.6 → +15.0 (indicator cap) |
| Poland | POL | +41 Confronting | 25 | +40 Acting | 26 | +40 Acting | 26 | B1 +15.6 → +15.0 (indicator cap) |
| Qatar | QAT | +41 Confronting | 25 | +40 Acting | 26 | +40 Acting | 26 | B1 +15.6 → +15.0 (indicator cap) |
| Switzerland | CHE | +41 Confronting | 25 | +41 Confronting | 25 | +41 Confronting | 25 | — |
| Slovenia | SVN | +39 Acting | 30 | +38 Acting | 30 | +38 Acting | 30 | B1 +15.6 → +15.0 (indicator cap) |
| Austria | AUT | +38 Acting | 31 | +38 Acting | 30 | +28 Acting | 47 | rc.3: A4 0.0 → −10.0 (events added, removed or replaced) |
| Denmark | DNK | +38 Acting | 31 | +37 Acting | 32 | +37 Acting | 31 | B1 +15.6 → +15.0 (indicator cap) |
| Algeria | DZA | +37 Acting | 33 | +36 Acting | 33 | +36 Acting | 32 | B1 +15.6 → +15.0 (indicator cap) |
| United Arab Emirates | ARE | +37 Acting | 33 | +36 Acting | 33 | +36 Acting | 32 | B1 +15.6 → +15.0 (indicator cap) |
| Australia | AUS | +35 Acting | 36 | +35 Acting | 36 | +35 Acting | 35 | — |
| Indonesia | IDN | +34 Acting | 39 | +33 Acting | 39 | +33 Acting | 38 | B1 +15.6 → +15.0 (indicator cap) |
| Malaysia | MYS | +34 Acting | 39 | +33 Acting | 39 | +33 Acting | 38 | B1 +15.6 → +15.0 (indicator cap) |
| Russian Federation | RUS | +32 Acting | 43 | +31 Acting | 44 | +31 Acting | 43 | B1 +15.6 → +15.0 (indicator cap) |
| Saudi Arabia | SAU | +32 Acting | 43 | +31 Acting | 44 | +31 Acting | 43 | B1 +15.6 → +15.0 (indicator cap) |
| China | CHN | +29 Acting | 47 | +28 Acting | 48 | +28 Acting | 47 | B1 +15.6 → +15.0 (indicator cap) |
| Colombia | COL | +29 Acting | 47 | +28 Acting | 48 | +28 Acting | 47 | B1 +15.6 → +15.0 (indicator cap) |
| Japan | JPN | +26 Acting | 53 | +25 Acting | 53 | +25 Acting | 53 | B1 +15.6 → +15.0 (indicator cap) |
| Egypt | EGY | +24 Acting | 55 | +23 Acting | 60 | +23 Acting | 60 | B1 +15.6 → +15.0 (indicator cap) |
| Italy | ITA | +15 Acting | 75 | +15 Acting | 71 | +15 Acting | 71 | — |
| Greece | GRC | +12 Acting | 85 | +12 Acting | 75 | +12 Acting | 75 | — |
| Morocco | MAR | +11 Acting | 88 | −5 Passive | 133 | −5 Passive | 133 | B1 +15.6 → +15.0 (indicator cap); passivity penalty applied (−15): C3 −3.0 and C2 −10.0 no longer lift it |
| Republic of Korea | KOR | +5 Acting | 103 | +5 Acting | 92 | +5 Acting | 93 | — |
| Bolivia (Plurinational State of) | BOL | +4 Acting | 106 | +4 Acting | 95 | +9 Acting | 82 | rc.3: B1 −9.2 → −4.5 (tier of an event changed) |
| Azerbaijan | AZE | −1 Passive | 129 | −17 Passive | 156 | −27 Enabling | 173 | B1 +15.6 → +15.0 (indicator cap); passivity penalty applied (−15): C2 −10.0 no longer lifts it; rc.3: A4 0.0 → −10.0 (events added, removed or replaced) |
| Nigeria | NGA | −1 Passive | 129 | −1 Passive | 119 | −1 Passive | 117 | — |
| India | IND | −9 Passive | 151 | −9 Passive | 141 | −9 Passive | 142 | — |
| Germany | DEU | −22 Enabling | 166 | −28 Enabling | 175 | −28 Enabling | 175 | C2 −4.0 → −10.0 (confidence) |
| Czechia | CZE | −37 Enabling | 183 | −37 Enabling | 184 | −37 Enabling | 184 | — |
| Argentina | ARG | −44 Enabling | 188 | −50 Enabling | 190 | −50 Enabling | 190 | B1 −23.4 → −15.0 (indicator cap); passivity penalty applied (−15): C2 −10.0 and C3 −3.0 no longer lift it |
| Hungary | HUN | −53 Sustaining | 190 | −48 Enabling | 189 | −48 Enabling | 189 | B1 −22.6 → −15.0 (indicator cap); category B −40.0 → −35.3 (category cap) |
| United States of America | USA | −100 Sustaining | 193 | −100 Sustaining | 193 | −100 Sustaining | 193 | — |

Band changes among all scored entities, under rc.2 or rc.3:

| Country | ISO3 | rc.1 | rc.2 | rc.3 | Cause |
|---|---|---|---|---|---|
| Afghanistan | AFG | −25 Enabling | −25 Enabling | −15 Passive | rc.3: B1 −10.4 → 0.0 (tier of an event changed) |
| Azerbaijan | AZE | −1 Passive | −17 Passive | −27 Enabling | B1 +15.6 → +15.0 (indicator cap); passivity penalty applied (−15): C2 −10.0 no longer lifts it; rc.3: A4 0.0 → −10.0 (events added, removed or replaced) |
| Botswana | BWA | +6 Acting | −9 Passive | −9 Passive | passivity penalty applied (−15): C3 −3.0 no longer lifts it |
| Cambodia | KHM | +10 Acting | −6 Passive | −6 Passive | B1 +15.6 → +15.0 (indicator cap); passivity penalty applied (−15): C2 −7.0 and C3 −2.0 no longer lift it |
| Costa Rica | CRI | +2 Acting | −13 Passive | −13 Passive | passivity penalty applied (−15): C2 −10.0 and C3 −2.0 no longer lift it |
| Côte d'Ivoire | CIV | +1 Acting | 0 Passive | 0 Passive | B1 +15.6 → +15.0 (indicator cap) |
| Dominican Republic | DOM | +7 Acting | −9 Passive | −9 Passive | B1 +15.6 → +15.0 (indicator cap); passivity penalty applied (−15): C3 −2.0 no longer lifts it |
| Ecuador | ECU | −14 Passive | −29 Enabling | −29 Enabling | passivity penalty applied (−15): C2 −10.0 and C3 −2.0 no longer lift it |
| Georgia | GEO | −8 Passive | −23 Enabling | −23 Enabling | passivity penalty applied (−15): C3 −3.0 no longer lifts it |
| Guinea | GIN | +1 Acting | 0 Passive | 0 Passive | B1 +15.6 → +15.0 (indicator cap) |
| Hungary | HUN | −53 Sustaining | −48 Enabling | −48 Enabling | B1 −22.6 → −15.0 (indicator cap); category B −40.0 → −35.3 (category cap) |
| Kenya | KEN | +2 Acting | +2 Acting | −3 Passive | rc.3: A4 0.0 → −5.0 (events added, removed or replaced) |
| Mali | MLI | +1 Acting | 0 Passive | 0 Passive | B1 +15.6 → +15.0 (indicator cap) |
| Montenegro | MNE | +15 Acting | 0 Passive | 0 Passive | B1 +15.6 → +15.0 (indicator cap); passivity penalty applied (−15): C3 −2.0 no longer lifts it |
| Morocco | MAR | +11 Acting | −5 Passive | −5 Passive | B1 +15.6 → +15.0 (indicator cap); passivity penalty applied (−15): C3 −3.0 and C2 −10.0 no longer lift it |
| Myanmar | MMR | +1 Acting | 0 Passive | 0 Passive | B1 +15.6 → +15.0 (indicator cap) |
| Namibia | NAM | +41 Confronting | +40 Acting | +40 Acting | B1 +15.6 → +15.0 (indicator cap) |
| Nepal | NPL | +1 Acting | 0 Passive | 0 Passive | B1 +15.6 → +15.0 (indicator cap) |
| North Macedonia | MKD | −15 Passive | −30 Enabling | −30 Enabling | passivity penalty applied (−15): C3 −2.0 and C2 −4.0 no longer lift it |
| Poland | POL | +41 Confronting | +40 Acting | +40 Acting | B1 +15.6 → +15.0 (indicator cap) |
| Qatar | QAT | +41 Confronting | +40 Acting | +40 Acting | B1 +15.6 → +15.0 (indicator cap) |
| Republic of Moldova | MDA | −11 Passive | −26 Enabling | −26 Enabling | passivity penalty applied (−15): C3 −2.0 and C2 −10.0 no longer lift it |
| Serbia | SRB | −6 Passive | −21 Enabling | −21 Enabling | passivity penalty applied (−15): C3 −3.0 and C2 −4.0 no longer lift it |
| Slovakia | SVK | +3 Acting | +3 Acting | −7 Passive | rc.3: A4 0.0 → −10.0 (events added, removed or replaced) |
| Togo | TGO | −7 Passive | −22 Enabling | −22 Enabling | passivity penalty applied (−15): C2 −10.0 no longer lifts it |
| Turkmenistan | TKM | +12 Acting | −3 Passive | −3 Passive | passivity penalty applied (−15): C3 −2.0 no longer lifts it |
| Uganda | UGA | +14 Acting | −2 Passive | −2 Passive | B1 +15.6 → +15.0 (indicator cap); passivity penalty applied (−15): C3 −2.0 no longer lifts it |
| Ukraine | UKR | +8 Acting | −7 Passive | −7 Passive | passivity penalty applied (−15): C3 −3.0 no longer lifts it |
| United Republic of Tanzania | TZA | +4 Acting | −11 Passive | −11 Passive | passivity penalty applied (−15): C3 −2.0 no longer lifts it |
| Uruguay | URY | +14 Acting | −1 Passive | −1 Passive | passivity penalty applied (−15): C3 −3.0 no longer lifts it |
| Venezuela (Bolivarian Republic of) | VEN | −9 Passive | −9 Passive | +1 Acting | rc.3: B1 −10.4 → 0.0 (tier of an event changed) |
| Zambia | ZMB | −12 Passive | −27 Enabling | −27 Enabling | passivity penalty applied (−15): C3 −2.0 no longer lifts it |
| Zimbabwe | ZWE | +1 Acting | 0 Passive | 0 Passive | B1 +15.6 → +15.0 (indicator cap) |

What this means for the author's decision: under rc.2, Poland, Qatar and Namibia (+41 → +40) leave Confronting by the B1 cap alone; Hungary leaves Sustaining (−53 → −48); six countries at +1 under rc.1 (CIV, GIN, MLI, MMR, NPL, ZWE) fall to 0, in the Passive band, by the B1 cap; most of the other band changes come from the passivity rule (B-46). Among the 45, Poland, Qatar, Hungary and Morocco change band under rc.2, and Azerbaijan under rc.3 (−1 → −17 → −27). 30 countries move by 10 points or more under rc.2, 34 under rc.3. The decision is the author's (HANDOFF Part 4, item 2; CHECKUP §2a).

## 3. Score mode on the preview build

**2026-11-28 (T-H-BROWSER, `docs/review/launch-readiness.md` §6, B-2221, B-2222).** On the preview build of the same data (1,515 reviewed events as if published; never deployed), with the installed Chrome, one browser at a time: Lighthouse on 24 pages of the scorecard build and 7 of the score build, every assertion passed, `/en/country/NOR/` LCP 0.84 s (score mode 0.90 s), so the "All n values" tables stay (B-864); the browser tests in score mode, 325 passed, 8 skipped, the 2 failures caused by branded Chrome's favicon request and fixed in the test; no page scrolls sideways at 360, 768 or 1280 px in either mode; the gauge tooltip, cut off at 360 and 400 px in score mode, fixed by PR #23 (merged, 9885d4d); French punctuation on ten share cards and the 486 pages with scripts off: 0 problems; the widget works from a second origin. Not done: branded Safari and Firefox.

**2026-11-05 (T-P22).** The ranking, sliders, compare, country page, Cite, share cards, widget, API, home and JavaScript budget were read in score mode on a local build (`NEXT_PUBLIC_SHOW_SCORES=true` in the process environment only). Two issues were found and fixed on `main`:

**Issue 1 (B-865).** The published data carries `score` to one decimal and `score_display`, the integer read from the full-precision score (docs/02 §14; methodology page, "Display rounding"). Germany's exact score is −3.482: −3.5 to one decimal, −3 displayed. The end labels of the comparison chart and the closing words of the timeline's text alternative (site and widget) printed the one-decimal value, so a reader saw −3 and −3.5 for the same country and date, and the methodology page says −13.5 is displayed as −14. Fixed on `main` (0afb931): those three places print `score_display`; the data table under each chart keeps one decimal. The widget's test fixture now has a point whose one-decimal score (−12.5) and displayed integer (−12) differ.

**Issue 2 (B-866).** The browser tests ran the scorecard expectations on `out/` because the project serving it was named `scorecard`. After the one-line flip of `apps/web/.env.production` that build is in score mode, so CI would have failed on the flip commit (for instance "scorecard mode drops ?w= and shows no score" on the Compare page). Fixed on `main` (58950b1): the project is named `production` and carries `metadata.mode`, read from `.env.production` with `scripts/site-env.ts` as the build reads it; the six specs read the mode from the metadata. `playwright test --list` loads the configuration (335 tests, 156 on `production`); the tests themselves run in CI.

## 4. Not done, and why

- The browser tests and Lighthouse on the **published** data: they run in CI on the flip's pull request (§6, step 8); on the preview they passed (§3).
- A score-mode site build under rc.2 or rc.3: the side-by-side numbers come from `methodology:diff`, not from a site build; the pages read the same fields under any version.
- The calibration re-run on the published dataset (`pnpm calibrate --fts`): it needs the published dataset; the worksheets were recomputed on the preview on 2026-11-28 (B-2224).
- `methodology/v1.0.0` final, `diff.json` against rc.1, the flag, the note, the tag: the author's steps (LAUNCH-PLAN Part 3).

## 5. What is left for the author before the flip

In this order, each with its check (the commands are in `docs/review/launch-commands-2026-11.md`, B-2226): (1) review the 10 % sample and publish PR #11 (`pnpm publish:events --pr 11`), then merge it; (2) confirm or reverse the B8 rows of A/78/846 (B-2170) and the other defaults of the launch-plan run (CHECKUP §2h); (3) a first entry of `data/corrections.yaml`; (4) after 2026-12-12, decide PR #15 (rc.2) and PR #19 (rc.3), merging #15 then #19 with merge commits, or closing them, and removing their `methodology/proposals.yaml` entries; (5) the calibration re-run on the published data and three readers' notes; (6) two or three reviewers with sign-offs naming 1.0.0; (7) the scorecard launch (`v0.9.0-scorecard`, `changes/launch.md`). Then the flip of §6.

## 6. The flip, command by command

Run on `main` after PR #11 is merged (the published events are then on `main`). `{DATE}` is the flip date (UTC), `{REF}` a git ref with the previous version's methodology and the same published data. Stop at the first step whose check fails.

```sh
# 0. Start clean
git checkout main && git pull && pnpm install --frozen-lockfile
pnpm lint && pnpm typecheck && pnpm test && pnpm validate        # 0 errors

# 1. Gate rule 8: no unchecked indicator on any of the 193 (scope (a), B-2098; enforced by
#    apps/web/scripts/rule8.ts in the score-mode build, PR #17)
pnpm build:data --date {DATE}
jq '.counts.unchecked' apps/web/public/api/v1/build-notes.json        # must print 0
jq -r '.notes[] | select(.kind == "unchecked") | .country' apps/web/public/api/v1/build-notes.json   # the countries if not

# 2. Gates: reviewers, corrections, sensitivity
grep -v '^ *#' methodology/reviewers.yaml | grep -cE 'version: 1\.0\.0[,} ]'   # ≥ 2 sign-offs naming 1.0.0
grep -v '^ *#' data/corrections.yaml | grep -c '^- '                      # ≥ 1 correction
jq '.tables | length' apps/web/public/api/v1/sensitivity.json            # 5 (15 rows)

# 3. Gate: rc.2 and rc.3 decided (windows closed on 2026-12-12). Either merged (PR #15 first,
#    then PR #19, merge commits, each removing its methodology/proposals.yaml entry), or closed
#    and rc.1 kept. Check:
gh pr view 15 --json state,mergedAt && gh pr view 19 --json state,mergedAt

# 4. Calibration on the published dataset (P-15, P-24 follow-ups); keep the readings already written
pnpm calibrate --date {DATE} --fts --out calibration.json
#    regenerate docs/calibration/{ISO3}.md and README §1, §2, §4, §8 from it (the field mapping
#    of the refresh of 2026-11-28, B-2224); the three readers read these

# 5. The final version, on a branch, as a pull request (docs/08 §1)
git checkout -b methodology/v1.0.0
sed -i '' -E 's/^version: 1\.0\.0-rc\.[0-9]+$/version: 1.0.0/' methodology/v1.0.0/*.yaml
pnpm methodology:render
#    methodology/CHANGELOG.md: a "## 1.0.0" entry naming the decided changes ("none" beyond rc.3)

# 6. diff.json against the previous version, on the published data (P-24 recipe)
#    {REF}: if the proposals were merged after the events were published, a scratch branch holding
#    `git revert -m 1 <merge commit>` of each; if the events were published after the merges,
#    the first parent of the first merge. Without any proposal merged, {REF} = main.
pnpm methodology:diff --from {REF} --date {DATE} --write
#    every cause must name a rule of the changelog

# 7. The flag and the note
sed -i '' 's/^NEXT_PUBLIC_SHOW_SCORES=false$/NEXT_PUBLIC_SHOW_SCORES=true/' apps/web/.env.production
git mv docs/drafts/index-launch.md changes/index-launch.md
#    fill the braces marked "at the flip", the French version, delete its comment

# 8. Build and check locally, then open the pull request (CI runs the browser tests in score mode)
pnpm lint && pnpm typecheck && pnpm test && pnpm validate && pnpm build:data:check
NODE_OPTIONS=--max-old-space-size=3072 pnpm build                # rule8.ts runs first in score mode
grep -o 'mode[^,]*' apps/web/out/embed/v1/gai.js | head -1      # mode\":\"score\"
git add -A methodology apps/web/.env.production changes docs/calibration
git commit -m "Methodology 1.0.0; scores shown (P-22)"
git push -u origin methodology/v1.0.0 && gh pr create --base main --fill
#    merge with a merge commit once CI is green

# 9. Tag and deploy (the push to main deploys; deploy.yml)
git checkout main && git pull
git tag -a v1.0.0 -m "Methodology 1.0.0; scores shown" && git push origin v1.0.0

# 10. On the live site
curl -s https://gaza-accountability-index.pages.dev/embed/v1/gai.js | grep -o 'mode[^,]*' | head -1
curl -sI https://gaza-accountability-index.pages.dev/cards/DEU.png | head -1
curl -s https://gaza-accountability-index.pages.dev/api/v1/countries.json | jq '.countries[0] | {iso3, score_display, band}'
#    then in a browser: /en/ranking/ with ?w=, /en/compare/?c=DEU,FRA,ZAF,USA,EGY, Cite on a
#    country page, /en/embed/ and a blank page with the snippet; the Data page lists every dump
#    part under 25 MiB; Lighthouse on /en/country/NOR/ (LCP < 1.5 s, else B-864); P-17's audit
```
