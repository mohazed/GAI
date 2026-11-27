# Score-flip dry run (P-22, run T-P22 of 2026-11-05)

What this is: the dry run of the score flip of `PROMPTS.md` P-22, without flipping (HANDOFF Task E). Each gate of P-22 is checked with its evidence; the scores are compared under methodology 1.0.0-rc.1 and the 1.0.0-rc.2 proposal side by side, because the author has not decided PR #15; the site is checked in score mode on a local preview build; the two issues found are fixed on `main`; the flip's command sequence is written out for the author (§6). Nothing was flipped: `methodology/v1.0.0/` still declares 1.0.0-rc.1, `apps/web/.env.production` still reads `NEXT_PUBLIC_SHOW_SCORES=false`, no `NEXT_PUBLIC_SHOW_SCORES=true` was committed anywhere, no tag was made, nothing was published or deployed. The draft of the flip's note is `docs/drafts/index-launch.md` (not `changes/`, so no build reads it).

All numbers below come from the **preview build** (`pnpm build:data --date 2026-11-04 --preview`: the 1,235 events at status `reviewed` scored as if published; the one `draft` left out). They are provisional and change when the author reviews and publishes the events. Build date 2026-11-04 (the UTC date of the run).

Commits of the run: `main` 0afb931 (score labels, B-865), 58950b1 (browser tests follow the site's mode, B-866); `data/phase1` 9da1b76 and 136990f (merges of `main`), then this file, the draft, the build log and PROMPTS.md (B-867, B-868).

## 1. The gates of P-22

| Gate (PROMPTS.md P-22 and its follow-ups) | Evidence | State |
|---|---|---|
| Reviewers listed in `methodology/reviewers.yaml`, each sign-off naming v1.0.0 (P-10, B-142) | `reviewers: []` on `main` and `data/phase1` (schema `ReviewersFile`; `pnpm validate` 0 errors). The About page says "Reviewers: none yet." | **Not met** |
| Three readers' notes in `docs/calibration/` (docs/08 §3) | The ten worksheets (`USA`, `DEU`, `GBR`, `FRA`, `ESP`, `IRL`, `ZAF`, `TUR`, `EGY`, `IND`) have 3 reading slots each, 30 in all; all 30 are blank (`- Reader:` with nothing after it). The worksheets were last computed on 2026-10-05 (773 reviewed events); P-15's follow-up asks for a re-run on the published dataset before the readers read them. | **Not met** |
| The author's decision on the threshold changes, applied first as 1.0.0-rc.2 through P-24, PR #15 merged after its window with the decision in the changelog (P-15, P-24 follow-ups) | PR #15 (`methodology/v1.0.0-rc.2`, head 2aab466) is open, not merged, with no comment and no review (`gh pr view 15`). The window closed on 2026-10-19. `methodology/proposals.yaml` holds no entry for it (the Discussion is not posted). | **Not met** (author) |
| No unchecked indicator among the 45 full-protocol countries (docs/01 §7, docs/02 §8) | Preview build: 9 unchecked entries among the 45, all B8, one each for ARE, AZE, EGY, JOR, MAR, MYS, NGA, QAT, SAU (`build-notes.json`, kind `unchecked`), as T-P20 found (B-860). Without `--preview` (published events only) the 45 show 2 to 11 unchecked each, because `has-events` is derived from published events only; that is expected until `pnpm publish:events`. | **Not met** (B-860, author) |
| `data/corrections.yaml` non-empty (docs/01 §6, docs/08 §5) | `[]`. A correction needs a published event. | **Not met** |
| Sensitivity tables present (docs/02 §10) | `api/v1/sensitivity.json` is written by every build: 5 tables (passivity 5/15/25, weights A–D 0.5/1.5, confidence of `reported` 0.2/0.6, statements excluded, decay off) over 193 entities; the methodology page shows them. | Met |
| Hand events published (P-22 runs on the published dataset; P-16, P-17 follow-ups) | 0 of 1,235 hand-researched events are `published` (1,235 `reviewed`, 1 `draft`). | **Not met** (author) |
| T-P20's follow-ups for P-22 (B-859 to B-864) | (1) B8 for the nine: see above. (2) Corrections: see above. (3) The dump in parts: in the preview build each part is under 25 MiB (the build fails otherwise); to be re-checked on the Data page after the flip. (4) Lighthouse on a build of the published data: not run (no Chrome in the run, §5). (5) `proposals.yaml` entry for rc.2: absent. | Open |

P-22 says: if any gate fails, stop and report; do not flip. Six gates fail, all of them on the author's side (review and publication of PR #11, the B8 decision, reviewers, readers, the rc.2 decision, a first correction). Nothing here can lift them.

## 2. The scores under 1.0.0-rc.1 and 1.0.0-rc.2, side by side

How: on a local scratch branch (never pushed, deleted after the run), `methodology/v1.0.0-rc.2` (2aab466) was merged into `data/phase1` (7f6ba8f) without a commit; the merge had no conflict. In that tree `pnpm methodology:diff --from data/phase1 --date 2026-11-04 --preview --json` scored every entity twice with the same engine and the same events: under the rc.1 files of `data/phase1` and under the rc.2 files of the merge. `pnpm validate` on the merged tree: 0 errors, 1,198 warnings, the same rules and counts as on `data/phase1` (561 orphan sources, 404 has-events mismatches, 193 unchecked, 30 archive-required, 10 archive-index), so the rc.2 validator rules (official-video sources for `confirmed`, the B9/B10 speaker rule) reject no event of the current dataset. The rc.1 column is the `countries.json` of the preview build; ranks are by display score among the 193, ties sharing the best rank.

Result: 120 display scores move by 1 or more, 39 passivity decisions change, 38 bands change (acting → passive 28, confronting → acting 3, passive → enabling 6, sustaining → enabling 1). The causes are the rules of the proposal: B1 capped at ±15 (most moves of 1 or 2 points), only contributions of +2 or more lift the passivity penalty (most band changes: a negative C2 or C3 event no longer lifts it), "most severe" stacking, `confirmed` for official-video and parliamentary sources (Germany's C2 rests on a Bundestag paper, Türkiye's A8 on a record of the Grand National Assembly; both are `reported` under rc.1) and the A2/C3 values of data year 2022 (Bosnia and Herzegovina's A2). PR #15's own diff (computed on 2026-10-05 on the generated events only) gave 120 moved scores and 86 band changes; on the reviewed events of today 120 scores move and 38 bands change.

Scored entities: 193. Band counts (rc.1 / rc.2):

| Band | rc.1 | rc.2 |
|---|---|---|
| Sustaining | 4 | 3 |
| Enabling | 21 | 28 |
| Passive | 41 | 63 |
| Acting | 105 | 80 |
| Confronting | 22 | 19 |

The 45 full-protocol countries, ranked by the rc.1 display score (rank among the 193; ties share a rank):

| Country | ISO3 | rc.1 score | rc.1 band | rc.1 rank | rc.2 score | rc.2 band | rc.2 rank | Cause of the move (rc.2) |
|---|---|---|---|---|---|---|---|---|
| Spain | ESP | +79 | Confronting | 1 | +79 | Confronting | 1 | — |
| Türkiye | TUR | +77 | Confronting | 2 | +79 | Confronting | 1 | A8 +1.7 → +4.3 (confidence) |
| Belgium | BEL | +67 | Confronting | 3 | +67 | Confronting | 3 | — |
| Netherlands (Kingdom of the) | NLD | +64 | Confronting | 4 | +64 | Confronting | 4 | — |
| Ireland | IRL | +59 | Confronting | 5 | +59 | Confronting | 5 | — |
| United Kingdom of Great Britain and Northern Ireland | GBR | +53 | Confronting | 7 | +52 | Confronting | 8 | B1 +16.5 → +15.0 (indicator cap) |
| South Africa | ZAF | +53 | Confronting | 7 | +53 | Confronting | 6 | — |
| Chile | CHL | +52 | Confronting | 9 | +51 | Confronting | 9 | B1 +16.5 → +15.0 (indicator cap) |
| Brazil | BRA | +49 | Confronting | 11 | +48 | Confronting | 11 | B1 +16.5 → +15.0 (indicator cap) |
| Norway | NOR | +48 | Confronting | 13 | +48 | Confronting | 11 | — |
| Mexico | MEX | +47 | Confronting | 14 | +46 | Confronting | 14 | B1 +16.5 → +15.0 (indicator cap) |
| Canada | CAN | +46 | Confronting | 16 | +46 | Confronting | 14 | — |
| Colombia | COL | +46 | Confronting | 16 | +45 | Confronting | 16 | B1 +16.5 → +15.0 (indicator cap) |
| France | FRA | +46 | Confronting | 16 | +45 | Confronting | 16 | B1 +16.5 → +15.0 (indicator cap) |
| Jordan | JOR | +42 | Confronting | 21 | +40 | Acting | 20 | B1 +16.5 → +15.0 (indicator cap) |
| Slovenia | SVN | +38 | Acting | 23 | +37 | Acting | 22 | B1 +16.5 → +15.0 (indicator cap) |
| Algeria | DZA | +37 | Acting | 24 | +36 | Acting | 23 | B1 +16.5 → +15.0 (indicator cap) |
| Switzerland | CHE | +36 | Acting | 25 | +35 | Acting | 25 | B1 +16.5 → +15.0 (indicator cap) |
| Austria | AUT | +35 | Acting | 28 | +35 | Acting | 25 | — |
| Poland | POL | +35 | Acting | 28 | +34 | Acting | 29 | B1 +16.5 → +15.0 (indicator cap) |
| Indonesia | IDN | +34 | Acting | 31 | +33 | Acting | 30 | B1 +16.5 → +15.0 (indicator cap) |
| Qatar | QAT | +34 | Acting | 31 | +33 | Acting | 30 | B1 +16.5 → +15.0 (indicator cap) |
| Saudi Arabia | SAU | +34 | Acting | 31 | +33 | Acting | 30 | B1 +16.5 → +15.0 (indicator cap) |
| Sweden | SWE | +33 | Acting | 35 | +32 | Acting | 34 | B1 +16.5 → +15.0 (indicator cap) |
| Japan | JPN | +32 | Acting | 37 | +31 | Acting | 36 | B1 +16.5 → +15.0 (indicator cap) |
| Malaysia | MYS | +31 | Acting | 38 | +30 | Acting | 38 | B1 +16.5 → +15.0 (indicator cap) |
| Australia | AUS | +30 | Acting | 40 | +30 | Acting | 38 | — |
| Denmark | DNK | +29 | Acting | 42 | +28 | Acting | 41 | B1 +16.5 → +15.0 (indicator cap) |
| China | CHN | +27 | Acting | 44 | +26 | Acting | 44 | B1 +16.5 → +15.0 (indicator cap) |
| United Arab Emirates | ARE | +22 | Acting | 51 | +21 | Acting | 51 | B1 +16.5 → +15.0 (indicator cap) |
| Russian Federation | RUS | +22 | Acting | 51 | +6 | Acting | 79 | B1 +16.5 → +15.0 (indicator cap); passivity penalty applied (−15): C3 −5.0 no longer lifts it |
| Egypt | EGY | +21 | Acting | 56 | +20 | Acting | 52 | B1 +16.5 → +15.0 (indicator cap) |
| Italy | ITA | +13 | Acting | 76 | +13 | Acting | 62 | — |
| Greece | GRC | +12 | Acting | 77 | +12 | Acting | 65 | — |
| Bolivia (Plurinational State of) | BOL | +4 | Acting | 103 | +4 | Acting | 86 | — |
| Republic of Korea | KOR | +3 | Acting | 107 | −13 | Passive | 149 | B1 +16.5 → +15.0 (indicator cap); passivity penalty applied (−15): C3 −5.0 no longer lifts it |
| Morocco | MAR | +3 | Acting | 107 | −14 | Passive | 151 | B1 +16.5 → +15.0 (indicator cap); passivity penalty applied (−15): C3 −3.0 and C2 −10.0 no longer lift it |
| Germany | DEU | −3 | Passive | 134 | −9 | Passive | 137 | C2 −4.0 → −10.0 (confidence) |
| Azerbaijan | AZE | −4 | Passive | 141 | −20 | Passive | 161 | B1 +16.5 → +15.0 (indicator cap); passivity penalty applied (−15): C2 −10.0 no longer lifts it |
| Nigeria | NGA | −4 | Passive | 141 | −4 | Passive | 128 | — |
| India | IND | −19 | Passive | 168 | −19 | Passive | 160 | — |
| Czechia | CZE | −38 | Enabling | 183 | −38 | Enabling | 186 | — |
| Argentina | ARG | −45 | Enabling | 188 | −50 | Enabling | 190 | B1 −24.7 → −15.0 (indicator cap); passivity penalty applied (−15): C2 −10.0 and C3 −3.0 no longer lift it |
| Hungary | HUN | −53 | Sustaining | 190 | −48 | Enabling | 189 | B1 −23.8 → −15.0 (indicator cap); category B −40.0 → −35.3 (category cap) |
| United States of America | USA | −100 | Sustaining | 193 | −100 | Sustaining | 193 | — |

Band changes among all scored entities under rc.2:

| Country | ISO3 | rc.1 | rc.2 | Cause |
|---|---|---|---|---|
| Bahrain | BHR | +14 Acting | −2 Passive | B1 +16.5 → +15.0 (indicator cap); passivity penalty applied (−15): C3 −2.0 no longer lifts it |
| Belarus | BLR | +14 Acting | −2 Passive | B1 +16.5 → +15.0 (indicator cap); passivity penalty applied (−15): C3 −2.0 no longer lifts it |
| Botswana | BWA | +7 Acting | −8 Passive | passivity penalty applied (−15): C3 −3.0 no longer lifts it |
| Cambodia | KHM | +14 Acting | −2 Passive | B1 +16.5 → +15.0 (indicator cap); passivity penalty applied (−15): C3 −2.0 no longer lifts it |
| Côte d'Ivoire | CIV | +1 Acting | 0 Passive | B1 +16.5 → +15.0 (indicator cap) |
| Democratic People's Republic of Korea | PRK | +1 Acting | 0 Passive | B1 +16.5 → +15.0 (indicator cap) |
| Djibouti | DJI | +14 Acting | −2 Passive | B1 +16.5 → +15.0 (indicator cap); passivity penalty applied (−15): C3 −2.0 no longer lifts it |
| Dominican Republic | DOM | +7 Acting | −9 Passive | B1 +16.5 → +15.0 (indicator cap); passivity penalty applied (−15): C3 −2.0 no longer lifts it |
| Ecuador | ECU | −13 Passive | −28 Enabling | passivity penalty applied (−15): C2 −10.0 and C3 −2.0 no longer lift it |
| Georgia | GEO | −9 Passive | −24 Enabling | passivity penalty applied (−15): C3 −3.0 no longer lifts it |
| Ghana | GHA | +1 Acting | 0 Passive | B1 +16.5 → +15.0 (indicator cap) |
| Guinea | GIN | +1 Acting | 0 Passive | B1 +16.5 → +15.0 (indicator cap) |
| Honduras | HND | +1 Acting | −14 Passive | passivity penalty applied (−15): C2 −7.0 no longer lifts it |
| Hungary | HUN | −53 Sustaining | −48 Enabling | B1 −23.8 → −15.0 (indicator cap); category B −40.0 → −35.3 (category cap) |
| Jordan | JOR | +42 Confronting | +40 Acting | B1 +16.5 → +15.0 (indicator cap) |
| Kazakhstan | KAZ | +6 Acting | −10 Passive | B1 +16.5 → +15.0 (indicator cap); passivity penalty applied (−15): C2 −10.0 no longer lifts it |
| Lao People's Democratic Republic | LAO | +1 Acting | 0 Passive | B1 +16.5 → +15.0 (indicator cap) |
| Libya | LBY | +41 Confronting | +40 Acting | B1 +16.5 → +15.0 (indicator cap) |
| Malawi | MWI | −11 Passive | −26 Enabling | passivity penalty applied (−15): C3 −2.0 no longer lifts it |
| Mali | MLI | +1 Acting | 0 Passive | B1 +16.5 → +15.0 (indicator cap) |
| Mauritius | MUS | +1 Acting | 0 Passive | B1 +16.5 → +15.0 (indicator cap) |
| Mongolia | MNG | +1 Acting | 0 Passive | B1 +16.5 → +15.0 (indicator cap) |
| Morocco | MAR | +3 Acting | −14 Passive | B1 +16.5 → +15.0 (indicator cap); passivity penalty applied (−15): C3 −3.0 and C2 −10.0 no longer lift it |
| Myanmar | MMR | +1 Acting | 0 Passive | B1 +16.5 → +15.0 (indicator cap) |
| Nepal | NPL | +1 Acting | 0 Passive | B1 +16.5 → +15.0 (indicator cap) |
| New Zealand | NZL | +47 Confronting | +30 Acting | B1 +16.5 → +15.0 (indicator cap); passivity penalty applied (−15): C3 −3.0 no longer lifts it |
| North Macedonia | MKD | −15 Passive | −30 Enabling | passivity penalty applied (−15): C3 −2.0 and C2 −4.0 no longer lift it |
| Republic of Korea | KOR | +3 Acting | −13 Passive | B1 +16.5 → +15.0 (indicator cap); passivity penalty applied (−15): C3 −5.0 no longer lifts it |
| Republic of Moldova | MDA | −11 Passive | −26 Enabling | passivity penalty applied (−15): C3 −2.0 and C2 −10.0 no longer lift it |
| Seychelles | SYC | +1 Acting | 0 Passive | B1 +16.5 → +15.0 (indicator cap) |
| Thailand | THA | +12 Acting | −4 Passive | B1 +16.5 → +15.0 (indicator cap); passivity penalty applied (−15): C3 −5.0 no longer lifts it |
| Turkmenistan | TKM | +10 Acting | −5 Passive | passivity penalty applied (−15): C3 −2.0 no longer lifts it |
| Uganda | UGA | +14 Acting | −2 Passive | B1 +16.5 → +15.0 (indicator cap); passivity penalty applied (−15): C3 −2.0 no longer lifts it |
| Ukraine | UKR | +5 Acting | −10 Passive | passivity penalty applied (−15): C3 −3.0 no longer lifts it |
| United Republic of Tanzania | TZA | +5 Acting | −10 Passive | passivity penalty applied (−15): C3 −2.0 no longer lifts it |
| Uruguay | URY | +15 Acting | 0 Passive | passivity penalty applied (−15): C3 −3.0 no longer lifts it |
| Yemen | YEM | +1 Acting | 0 Passive | B1 +16.5 → +15.0 (indicator cap) |
| Zambia | ZMB | −13 Passive | −28 Enabling | passivity penalty applied (−15): C3 −2.0 no longer lifts it |

What this means for the author's decision: under rc.2, Jordan (+42 → +40) and Libya (+41 → +40) leave Confronting by the B1 cap alone, New Zealand (+47 → +30) by the passivity rule; Hungary leaves Sustaining (−53 → −48); twelve countries at +1 under rc.1 (CIV, GHA, GIN, LAO, MLI, MMR, MNG, MUS, NPL, PRK, SYC, YEM) fall to 0, in the Passive band, by the B1 cap. Among the 45, four change band (Jordan, Hungary, the Republic of Korea, Morocco); Russia (+22 → +6) and Azerbaijan (−4 → −20) move most without changing band. 39 countries move by 10 points or more: 36 through the passivity rule (with or without the B1 cap), and Palau, Papua New Guinea and Tonga through the B1 cap alone (their negative B1 totals of −24.7 to −26.5 become −15). The side-by-side numbers are the preview's; the decision itself is the author's (Part 4, item 2 of HANDOFF.md).

## 3. Score mode on the preview build

How: `pnpm build:data --date 2026-11-04 --preview`, then `NEXT_PUBLIC_SHOW_SCORES=true pnpm --filter @gai/web build` (the variable in the process environment, nothing committed; the build's widget step printed `gai.js score mode, 14504 bytes, 6119 gzipped (budget 15360)`), served by `apps/web/scripts/serve.ts` on localhost:4173 and read in one browser tab, closed with the server when done. Then `main` was rebuilt in its own mode (`pnpm build`, scorecard).

| Check | What was seen | Result |
|---|---|---|
| Ranking (`/en/ranking/`) | "Ranking of 193 countries … methodology v1.0.0-rc.1"; rows with position, score, band, coverage; Spain +79 first, the United States −100 last; filters by region, band and grouping; the excluded entities after the table. | Works |
| Sliders ("Your weights", ranking) | Four range inputs A–D (0 to 2, step 0.1). Setting B to 0.2 rewrote the address to `?w=1.0,0.2,1.0,1.0` and re-ranked: Spain +43 with "Change from the published score: (−36)", Belgium +31 now Acting, Colombia fifth. | Works |
| Compare (`/en/compare/?c=DEU,FRA,ZAF,USA,EGY`) | Five step lines with end labels, the table of category subtotals, the events by month; "Five countries is the most that can be compared." The end labels read `Germany −3.5`, `France +46.5`, `Egypt +21.5` while the ranking, the page headline and the card show −3, +46, +21. | **Issue 1, fixed** |
| Country page (`/en/country/DEU/`) | Title "Germany: −3, Passive"; gauge, coverage 100%, 0 unchecked; summary sentence; category subtotals; timeline. The timeline's text alternative ended "−3.5 at the end." | **Issue 1, fixed** |
| Cite | Plain reference: "Gaza Accountability Index, Germany: −3 (Passive), methodology v1.0.0-rc.1, as of 4 November 2026, https://gaza-accountability-index.pages.dev/en/country/DEU?date=2026-11-04"; the API carries APA and Chicago forms in EN and FR. | Works |
| Share cards | `cards/DEU.png` (−3, Passive, gauge marker at −3) and `cards/GBR.png` (+53, Confronting, the long name on three lines without overflow) read as images; 196 cards written; `og:image` and `twitter:image` point to them; `og:title` "Germany: −3, Passive". | Works |
| Widget in score mode (`/en/embed/`) | Both examples render in their shadow roots: the gauge ("Score −26, Enabling band, on a scale from −100 to +100."; coverage 67%) and the timeline with its step line (one path of 1,708 characters) and "−26 at the end". `grep -o 'mode[^,]*'` on `out/embed/v1/gai.js` prints `mode\":\"score\"`. | Works |
| API | `countries.json` (195 entries, `score`, `score_display`, `band`, `passivity`), `countries/{ISO3}.json` with `series` and `citations.score`, `scores/{date}.json` (1,125 days and `index.json`), `sensitivity.json`, the dump in parts. The API publishes the scores in both modes; only the pages hide them in scorecard mode (D-16). | Works |
| Home (`/fr/`) | Map by band, the week's movers (Zambie +13, from −26 to −13), the ranking strip (top five, bottom five), "Changements de la semaine". | Works |
| JavaScript budget (P-17 follow-up) | Score mode: ranking 147.0 KB, `/en/embed/` 147.1 KB, compare 145.8 KB, a country page 146.4 KB (gzipped, framework 128.5 KB), all under the 150 KB gate; the same as the scorecard build of `main` (147.0, 147.1, 145.8, 146.4). Page HTML gzipped: ranking 60.5 KB, `/en/country/DEU/` 142 KB, `/en/methodology/` 178 KB. | Within budget |

**Issue 1 (B-865).** The published data carries `score` to one decimal and `score_display`, the integer read from the full-precision score (docs/02 §14; methodology page, "Display rounding"). Germany's exact score is −3.482: −3.5 to one decimal, −3 displayed. The end labels of the comparison chart and the closing words of the timeline's text alternative (site and widget) printed the one-decimal value, so a reader saw −3 and −3.5 for the same country and date, and the methodology page says −13.5 is displayed as −14. Fixed on `main` (0afb931): those three places print `score_display`; the data table under each chart keeps one decimal. The widget's test fixture now has a point whose one-decimal score (−12.5) and displayed integer (−12) differ.

**Issue 2 (B-866).** The browser tests ran the scorecard expectations on `out/` because the project serving it was named `scorecard`. After the one-line flip of `apps/web/.env.production` that build is in score mode, so CI would have failed on the flip commit (for instance "scorecard mode drops ?w= and shows no score" on the Compare page). Fixed on `main` (58950b1): the project is named `production` and carries `metadata.mode`, read from `.env.production` with `scripts/site-env.ts` as the build reads it; the six specs read the mode from the metadata. `playwright test --list` loads the configuration (335 tests, 156 on `production`); the tests themselves run in CI.

## 4. Not done, and why

- The browser tests in score mode on the real data: Chromium for Playwright is not installed on this machine, and the run installs nothing. The flip's pull request runs them in CI on the score-mode build (§6, step 8).
- Lighthouse and the P-17 audit (overflow at 360, 768 and 1280 px, French punctuation, ten share cards) on the published build: they belong after `pnpm publish:events` (P-17 and T-P20 follow-ups), and the run allows no Chrome beyond one tab.
- A score-mode build under rc.2: the side-by-side numbers come from `methodology:diff`, not from a site build; the pages read the same fields under either version.
- The calibration re-run (`pnpm calibrate --fts`) on the published dataset and the re-run of P-16's score effects: they need the published dataset (P-15, P-16 follow-ups).
- `methodology/v1.0.0` final, `diff.json` against rc.1, the flag, the note, the tag: forbidden in this run (HANDOFF Task E).

## 5. What is left for the author before the flip

In this order, each with its check: (1) review PR #11 and `pnpm publish:events --pr 11`; (2) B8 for ARE, AZE, EGY, JOR, MAR, MYS, NGA, QAT, SAU (B-860); (3) a first entry of `data/corrections.yaml`; (4) the rc.2 decision on PR #15 (§2), with its Discussion and `proposals.yaml` entry; (5) the calibration re-run and three readers' notes; (6) two or three reviewers with sign-offs naming 1.0.0; (7) the scorecard launch (`v0.9.0-scorecard`, `docs/review/launch-readiness.md`). Then the flip of §6.

## 6. The flip, command by command

Run on `main` after PR #11 is merged (the published events are then on `main`). `{DATE}` is the flip date (UTC), `{REF}` a git ref with the previous version's methodology and the same published data. Stop at the first step whose check fails.

```sh
# 0. Start clean
git checkout main && git pull && pnpm install --frozen-lockfile
pnpm lint && pnpm typecheck && pnpm test && pnpm validate        # 0 errors

# 1. Gate: no unchecked indicator among the 45 (B-860 decided first)
pnpm build:data --date {DATE}
jq -r '.notes[] | select(.kind == "unchecked") | .country' apps/web/public/api/v1/build-notes.json \
  | grep -xE 'USA|DEU|GBR|FRA|ESP|IRL|ZAF|TUR|EGY|IND|ITA|NLD|CAN|AUS|BEL|NOR|SWE|DNK|CHE|AUT|SVN|CZE|HUN|POL|GRC|JPN|KOR|CHN|RUS|BRA|COL|CHL|MEX|BOL|ARG|SAU|ARE|QAT|JOR|MAR|IDN|MYS|DZA|NGA|AZE'
#    must print nothing

# 2. Gates: reviewers, corrections, sensitivity
grep -v '^ *#' methodology/reviewers.yaml | grep -cE 'version: 1\.0\.0[,} ]'   # ≥ 2 sign-offs naming 1.0.0
grep -v '^ *#' data/corrections.yaml | grep -c '^- '                      # ≥ 1 correction
jq '.tables | length' apps/web/public/api/v1/sensitivity.json            # 5

# 3. Gate: rc.2 decided. Either PR #15 merged after its window with the decision in
#    methodology/CHANGELOG.md (and its methodology/proposals.yaml entry removed in the merge),
#    or PR #15 closed and rc.1 kept. Check:
gh pr view 15 --json state,mergedAt

# 4. Calibration on the published dataset (P-15, P-24 follow-ups); keep the readings already written
pnpm calibrate --date {DATE} --fts --out calibration.json
pnpm calibrate --date {DATE} --fts --rc1 --out calibration-rc1.json   # only if rc.2 was merged
#    regenerate docs/calibration/{ISO3}.md and README §1–§5, §8; the three readers read these

# 5. The final version, on a branch, as a pull request (docs/08 §1)
git checkout -b methodology/v1.0.0
sed -i '' -E 's/^version: 1\.0\.0-rc\.[0-9]+$/version: 1.0.0/' methodology/v1.0.0/*.yaml
pnpm methodology:render
#    methodology/CHANGELOG.md: a "## 1.0.0" entry naming the decided changes ("none" beyond rc.2)

# 6. diff.json against the previous version, on the published data (P-24 recipe)
#    {REF}: if rc.2 was merged after the events were published, a scratch branch holding
#    `git revert -m 1 <merge commit of PR #15>`; if the events were published after the merge,
#    the first parent of that merge. Without rc.2, {REF} = main.
pnpm methodology:diff --from {REF} --date {DATE} --write
#    every cause must name a rule of the changelog

# 7. The flag and the note
sed -i '' 's/^NEXT_PUBLIC_SHOW_SCORES=false$/NEXT_PUBLIC_SHOW_SCORES=true/' apps/web/.env.production
git mv docs/drafts/index-launch.md changes/index-launch.md
#    fill its braces and the French version, delete its comment (the comment lists what)

# 8. Build and check locally, then open the pull request (CI runs the browser tests in score mode)
pnpm lint && pnpm typecheck && pnpm test && pnpm validate && pnpm build:data:check && pnpm build
grep -o 'mode[^,]*' apps/web/out/embed/v1/gai.js | head -1      # mode\":\"score\"
pnpm --filter @gai/web serve                                     # read ranking, compare, sliders, cite, cards, /embed
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
