# Monthly run 2026-11 (P-23) and summary of the finish run

Written by the unattended finish run on `data/phase1`, in place of a pull request description (T-P23, docs/10 B-854, B-855 to B-858). The monthly run was split over four sessions (T-P23-1 to T-P23-4); this file holds the summary table of the whole run (section 1), the Comtrade result (section 2), the parts of the monthly run (sections 3 to 9) and what was not done (section 10). Everything below is provisional: no event is published and no reader has reviewed one.

## 1. Summary table of the finish run (2026-11-03 to 2026-11-04)

Counts are those of the repository on 4 November 2026 after T-P23-4: 1236 events (all `reviewed` except one `draft`, `evt_2025_09_29_USA_B10`, never to be published), 193 assessments, 236 leads, 2084 sources. "Events on file" for a light-protocol group counts the events now in the group's country files (they include the corrections of Task V and the additions of the monthly run); the groups of three countries are those of `.claude/run-briefs/light_groups.json`.

| Task | Scope | Model | Status | Result |
|---|---|---|---|---|
| T-HOUSE | housekeeping, first Comtrade run | Sonnet 5.5 | done | stale worktree removed; reports of T-P21-19 and T-P21-20 added; Comtrade for 63 reporters (docs/10 B-695) |
| T-P21-21 to T-P21-30, T-P21-46 to T-P21-49 | light protocol, groups 21 to 30 and 46 to 49 (43 countries) | Sonnet 5.5 (21, 22, 23, 27 to 30), Opus 5.5 (24, 25, 26, 46 to 49) | done | table below |
| T-P21-31 to T-P21-45 | light protocol, sub-Saharan Africa, groups 31 to 45 (45 countries, Claude track, docs/10 B-694) | Sonnet 5.5 | done | table below |
| T-VERIFY-1, T-VERIFY-2 | verification of the light-protocol events of groups 5 to 49 | Opus 5.5 | done | 386 events, 144 leads and 22 recognition rows re-read; locators, French summaries and scope tags corrected in place (docs/10 B-848, B-849, `docs/review/light-protocol.md`, section "Verification of 2026-11") |
| T-P23-1 | monthly run, first half of the deferred follow-ups | Sonnet 5.5 | partial | Comtrade for the 76 remaining reporters; Wayback replays of 371 captures re-fetched; General Debate files found through the Wayback CDX (B-850 to B-852) |
| T-P23-2 | monthly run, rest of the deferred follow-ups | Sonnet 5.5 | partial | Kazakhstan's two C2 events confirmed on the Ministry's release (B-853) |
| T-P23-3 | new events, 45 full-protocol countries | Sonnet 5.5 | partial | 10 events (GBR, nine signatories of the joint statement of 16 October 2026), all west-bank (B-854) |
| T-P23-4 | new events, light-protocol countries; Article 19; A4; maintenance | Sonnet 5.5 | partial | sections 5 to 9 below (B-855 to B-858) |

The tasks after this one (T-P20, T-P22, T-CHECKUP, T-FINAL) had not run when this file was written.

### Light-protocol groups

| Task | Countries | Model | Events on file | Leads on file | Status |
|---|---|---|---|---|---|
| T-P21-01 | NZL KAZ KGZ | Sonnet 5.5 | 19 | 3 | done |
| T-P21-02 | TJK TKM UZB | Sonnet 5.5 | 8 | 5 | done |
| T-P21-03 | MNG PRK BGR | Sonnet 5.5 | 8 | 5 | done |
| T-P21-04 | BLR MDA ROU | Sonnet 5.5 | 15 | 7 | done |
| T-P21-05 | SVK UKR ATG | Sonnet 5.5 | 11 | 10 | done |
| T-P21-06 | BHS BLZ BRB | Sonnet 5.5 | 6 | 5 | done |
| T-P21-07 | CRI CUB DMA | Sonnet 5.5 | 7 | 9 | done |
| T-P21-08 | DOM ECU GRD | Sonnet 5.5 | 7 | 3 | done |
| T-P21-09 | GTM GUY HND | Sonnet 5.5 | 10 | 5 | done |
| T-P21-10 | HTI JAM KNA | Sonnet 5.5 | 3 | 2 | done |
| T-P21-11 | LCA NIC PAN | Sonnet 5.5 | 5 | 7 | done |
| T-P21-12 | PER PRY SLV | Sonnet 5.5 | 5 | 6 | done |
| T-P21-13 | SUR TTO URY | Sonnet 5.5 | 2 | 9 | done |
| T-P21-14 | VCT VEN FJI | Sonnet 5.5 | 10 | 7 | done |
| T-P21-15 | PNG SLB VUT | Sonnet 5.5 | 5 | 4 | done |
| T-P21-16 | FSM KIR MHL | Sonnet 5.5 | 1 | 2 | done |
| T-P21-17 | NRU PLW LBY | Sonnet 5.5 | 5 | 7 | done |
| T-P21-18 | SDN TUN EST | Sonnet 5.5 | 28 | 7 | done |
| T-P21-19 | FIN ISL LTU | Sonnet 5.5 | 56 | 7 | done |
| T-P21-20 | LVA TON TUV | Sonnet 5.5 | 16 | 5 | done |
| T-P21-21 | WSM BRN KHM | Sonnet 5.5 | 4 | 4 | done |
| T-P21-22 | LAO MMR PHL | Sonnet 5.5 | 3 | 4 | done |
| T-P21-23 | SGP THA TLS | Sonnet 5.5 | 11 | 3 | done |
| T-P21-24 | VNM AFG BGD | Opus 5.5 | 4 | 2 | done |
| T-P21-25 | BTN IRN LKA | Opus 5.5 | 7 | 2 | done |
| T-P21-26 | MDV NPL PAK | Opus 5.5 | 14 | 2 | done |
| T-P21-27 | ALB AND BIH | Sonnet 5.5 | 9 | 3 | done |
| T-P21-28 | HRV MKD MLT | Sonnet 5.5 | 34 | 1 | done |
| T-P21-29 | MNE PRT SMR | Sonnet 5.5 | 27 | 5 | done |
| T-P21-30 | SRB VAT AGO | Sonnet 5.5 | 9 | 3 | done |
| T-P21-31 | BDI BEN BFA | Sonnet 5.5 | 1 | 1 | done |
| T-P21-32 | BWA CAF CIV | Sonnet 5.5 | 0 | 0 | done |
| T-P21-33 | CMR COD COG | Sonnet 5.5 | 0 | 0 | done |
| T-P21-34 | COM CPV DJI | Sonnet 5.5 | 4 | 0 | done |
| T-P21-35 | ERI ETH GAB | Sonnet 5.5 | 0 | 1 | done |
| T-P21-36 | GHA GIN GMB | Sonnet 5.5 | 3 | 1 | done |
| T-P21-37 | GNB GNQ KEN | Sonnet 5.5 | 1 | 3 | done |
| T-P21-38 | LBR LSO MDG | Sonnet 5.5 | 3 | 2 | done |
| T-P21-39 | MLI MOZ MRT | Sonnet 5.5 | 2 | 3 | done |
| T-P21-40 | MUS MWI NAM | Sonnet 5.5 | 3 | 1 | done |
| T-P21-41 | NER RWA SEN | Sonnet 5.5 | 5 | 0 | done |
| T-P21-42 | SLE SOM SSD | Sonnet 5.5 | 11 | 2 | done |
| T-P21-43 | STP SWZ SYC | Sonnet 5.5 | 1 | 2 | done |
| T-P21-44 | TCD TGO TZA | Sonnet 5.5 | 2 | 2 | done |
| T-P21-45 | UGA ZMB ZWE | Sonnet 5.5 | 1 | 1 | done |
| T-P21-46 | ARM BHR CYP | Opus 5.5 | 19 | 1 | done |
| T-P21-47 | GEO IRQ KWT | Opus 5.5 | 3 | 0 | done |
| T-P21-48 | LBN OMN SYR | Opus 5.5 | 9 | 0 | done |
| T-P21-49 | YEM LIE LUX MCO | Opus 5.5 | 26 | 0 | done |

## 2. Comtrade (HANDOFF Task C, first bullet)

`pnpm fetch:comtrade` ran on 3 November (63 reporters, docs/10 B-695), on 4 November (12 reporters) and a third time on 4 November for the 76 remaining reporters (B-850). **Every reporter now has rows or a documented reason.** Rows exist in `comtrade_a2.csv` or `comtrade_c3.csv` for 153 of the 195 registry entries. The 42 entries with no row, each with its reason in docs/10 B-850:

- no usable data in Comtrade (no total trade reported in both flows, or no reporter data): AFG ATG BDI BTN COM CPV FSM GNB GNQ HTI IRN IRQ KIR KNA KWT LBN LBR LBY MHL NRU OMN PLW PRK QAT SDN SLB STP SYR TLS TON TUV VAT VCT VUT WSM YEM;
- no current reporter code: LIE, MCO;
- fetched, no bilateral data: DZA, SAU;
- not reporters: ISR and PSE (not in the 193).

For these, A2 and C3 stay `no-data` in the build. The keyed cross-check against the preview API reported no difference. T-P23-4 did not run the fetcher again (`COMTRADE-20261104` is in `reports.jsonl` and every reporter is covered); `pnpm calibrate` was not re-run (no score of a published event depends on the new rows; the provisional scores are those of each session).

## 3. Deferred follow-ups of the earlier sessions (T-P23-1, T-P23-2)

Done: the P-12 checks (39 nightly runs green); the Wayback CDX route for General Debate files (Angola's 79th address filed, Timor-Leste's 80th archived and not filed under R3 because a Permanent Representative delivered it, 60 of 86 negative-length captures that serve through a redirect: B-851 to B-853); Kazakhstan's two C2 events moved from corroborated to confirmed on the Ministry's own release of 27 January 2026 (score +12 to +6, band unchanged); an exact-address CDX run for 26 official addresses named in leads (nothing else changed). Not done: the P-16 list (searches for CAN to NLD, the ICJ declarations of Brazil, Mexico, Bolivia and Belgium, UNRWA's 2025 donor table, the pre-2023 recognition rows, B5 for Algeria and Indonesia, the Arab-Islamic ministers' statements of 2026) and the URL-finding items of the T-P21 sessions need a search tool or `icj-cij.org`, `unrwa.org` and `documents.un.org`, which refuse scripts and Save Page Now; they stay in the P-23 block of `PROMPTS.md`.


## 4. New events for the 45 full-protocol countries

T-P23-3, window: 27 September 2026 (the day before the sessions of the 45 countries, whose last full checks are dated 28 to 30 September 2026) to 4 November 2026. All events below are `reviewed`, not published, and tagged `west-bank`, so they are recorded and not scored in version 1.

### Method and its limit

The run had no web search (the allowance of calls was used up, as for T-P21-26 and T-P21-46 to T-P21-49), so no news search per indicator group was possible. The run read the governments' own sites where a script can reach them. Every candidate was opened at its primary page, archived with Save Page Now, and its Wayback replay was fetched again and compared with the index row (bytes and SHA-256). A country with no route below was not searched; its absence from the table is not a finding that nothing happened.

### Events filed

| Event | Country | Indicator | Date | Points | Scope | Confidence | Source |
|---|---|---|---|---|---|---|---|
| evt_2026_10_19_GBR_B9 | GBR | B9 | 2026-10-19 | +5 | west-bank | confirmed | `src_20261019_gov-uk_fs-statement-e1-tender-deadline` (Foreign Secretary's statement on the E1 tender deadline) |
| evt_2026_10_16_EGY_B9 | EGY | B9 | 2026-10-16 | +5 | west-bank | confirmed | `src_20261016_dirco_joint-statement-colombia-embassy` |
| evt_2026_10_16_TUR_B9 | TUR | B9 | 2026-10-16 | +5 | west-bank | confirmed | same |
| evt_2026_10_16_QAT_B9 | QAT | B9 | 2026-10-16 | +5 | west-bank | confirmed | same |
| evt_2026_10_16_JOR_B9 | JOR | B9 | 2026-10-16 | +5 | west-bank | confirmed | same |
| evt_2026_10_16_MYS_B9 | MYS | B9 | 2026-10-16 | +5 | west-bank | confirmed | same |
| evt_2026_10_16_IDN_B9 | IDN | B9 | 2026-10-16 | +5 | west-bank | confirmed | same |
| evt_2026_10_16_SAU_B9 | SAU | B9 | 2026-10-16 | +5 | west-bank | confirmed | same |
| evt_2026_10_16_DZA_B9 | DZA | B9 | 2026-10-16 | +5 | west-bank | confirmed | same |
| evt_2026_10_16_ZAF_B9 | ZAF | B9 | 2026-10-16 | +5 | west-bank | confirmed | same |

The joint statement of 16 October 2026 (twenty foreign ministers reject Colombia's inauguration of its embassy in Jerusalem) is filed for every signatory among the 45 countries, as the joint statement of 21 August 2025 was (docs/10 B-444). The ten signatories outside the 45 (Libya, Yemen, Djibouti, Somalia, Kuwait, Oman, Syria, Sudan, Lebanon, Pakistan; the State of Palestine is not in the universe) are light-protocol countries and were not filed in T-P23-3 (T-P23-4 filed four of them: section 5).

Both sources are archived; the replays were re-fetched with `curl --compressed`: 71,626 bytes, SHA-256 `36c5c8a4…3ae0` (GBR) and 164,609 bytes, SHA-256 `47253df3…fc8d` (DIRCO).

### What was read, by country

| Country | Route | Period read | Result |
|---|---|---|---|
| GBR | GOV.UK search API (queries gaza, palestinian, settlers, occupied palestinian, FCDO filter) and content API | 27 Sep to 4 Nov | One event (above). Read and not filed: the Foreign Secretary's statement of 8 Oct on the Jerusalem mission (a statement on a consular building and a legal view of East Jerusalem, no call or named violation); the joint statement of Australia, Canada, France and the United Kingdom of 13 Oct on the postponement of Palestinian elections and the joint press release on the R4 meeting in Istanbul of 24 Oct (neither mentions Gaza); the Security Council statements of 28 Sep and 15 Oct (delivered by the Permanent Representative, not a B9 speaker). The Prime Minister's statement of 6 Oct on the anniversary of 7 October does not cite Gaza's conduct and names no violation. |
| ZAF | DIRCO "Media Statements" list (first page, 28 Sep to 30 Oct) | 28 Sep to 30 Oct | The joint statement above. No other item on Gaza. |
| CHE | News Service Bund RSS (117 releases) | 28 Sep to 4 Nov | Titles read; titles and summaries searched by script for Gaza, Israel, Palestin*, Hamas, UNRWA, Middle East, Near East: no hit. Two releases of 3 Nov on international humanitarian law and the ICRC were not opened. |
| RUS | en.kremlin.ru search (Gaza) | 1 Oct | The President's meeting with the Valdai Discussion Club (1 Oct): his answer on Gaza restates the Russian position on a Palestinian state; no call for a ceasefire or an end to the blockade and no named violation, so no B9. The Ministry's pages were not read. |
| USA | state.gov RSS (10 items of 2 to 4 Nov) | 2 to 4 Nov | No item on Gaza or Israel. The site's REST list returns only the latest items, so 27 Sep to 1 Nov was not read. |
| CZE | mzv.gov.cz press-release page | latest | A statement "Three Years Since the Hamas Terrorist Attack" is listed; not opened (no named speaker is expected, and it is not about conduct in Gaza). |
| EU members and CAN (EU-Canada summit, 30 Oct) | Council RSS (20 latest items) | 30 Oct | The joint statement of the summit is listed; consilium.europa.eu answers 403 to scripts and to Save Page Now, so it was not read. Whether it names Gaza is unknown. |

Not reached (no route that a script can read, or a route that answered 403, 404, a bot check or an empty list in this run): AUS (the Prime Minister's list shows only CHOGM items; the Foreign Minister's site did not answer), CAN (Canada.ca news API empty), IRL (page built by script), NOR, SWE, DNK, BEL, AUT, ITA, GRC, NLD, DEU, FRA, ESP, POL, SVN, HUN, IND, JPN, KOR, BRA, MEX, COL, CHL, ARG, BOL, CHN, MAR, NGA, ARE, AZE, plus the Ministries of the signatories of the joint statement. Their last full checks are those of 28 to 30 September 2026.

### Seen and not filed

- **Colombia's embassy in Jerusalem.** The joint statement shows that Colombia, whose government restored relations with Israel on 11 August 2026 (`evt_2024_05_02_COL_B12`), inaugurated an embassy in Jerusalem by 16 October 2026. The methodology defines no indicator for an embassy move (docs/10 B-599), so nothing is filed for Colombia; the Colombian side was not read (the Ministry answers 403). A decision for the author or the next methodology version: whether such a move needs an indicator.
- **UK mission in Jerusalem (8 Oct):** see the GBR row.
- **Attacks on French, Belgian and Polish officials in the West Bank** (named in the Foreign Secretary's statement of 19 October): the governments' reactions were not searched.

### Not done

- The news search for the 45 countries (no search tool). A session with a search tool should run, for each country, the Phase 1 queries per indicator group for 27 September to the run date, starting with the countries not reached above.
- The 16 October joint statement for the ten light-protocol signatories (done in part by T-P23-4 for four of them: section 5).
- `pnpm calibrate` was not re-run (west-bank events do not move any score).

### Addendum of T-P23-4: the joint statement of 22 September 2026

Pakistan's Ministry of Foreign Affairs published (press release 252/2026, Islamabad, 22 September 2026) the joint statement of the foreign ministers of Pakistan, Egypt, Indonesia, Jordan, Qatar, Saudi Arabia, Türkiye and the United Arab Emirates after their meeting in New York on 21 September 2026. It was in no country file (the sessions of the 45 countries ran on 28 to 30 September and T-P23-3 did not reach Pakistan's site). It calls on Israel to ensure "the immediate, safe and unhindered delivery of humanitarian assistance" in Gaza and stresses "the imperative of preserving the ceasefire and ending all violations": B9 +2 (call), scope gaza, the same tier as the statement of 1 February 2026. It is filed for the seven signatories among the 45 and for Pakistan (section 5), as the earlier statements of the series were (docs/10 B-444). Its passage on settlements, annexation and forced displacement ("illegal measures") concerns the occupied Palestinian territory as a whole: a West Bank passage, not scored, and one event for the same speaker and day. The source is archived (`src_20260922_mofa-pk_fms-joint-statement-gaza-81st`, the replay re-fetched with `curl --compressed`: 108,746 bytes in the record, SHA-256 `3687e18f…6147`, equal).

| Event | Country | Date | Points | Scope | Confidence |
|---|---|---|---|---|---|
| evt_2026_09_22_EGY_B9 | EGY | 2026-09-22 | +2 | gaza | confirmed |
| evt_2026_09_22_IDN_B9 | IDN | 2026-09-22 | +2 | gaza | confirmed |
| evt_2026_09_22_JOR_B9 | JOR | 2026-09-22 | +2 | gaza | confirmed |
| evt_2026_09_22_QAT_B9 | QAT | 2026-09-22 | +2 | gaza | confirmed |
| evt_2026_09_22_SAU_B9 | SAU | 2026-09-22 | +2 | gaza | confirmed |
| evt_2026_09_22_TUR_B9_2 | TUR | 2026-09-22 | +2 | gaza | confirmed |
| evt_2026_09_22_ARE_B9 | ARE | 2026-09-22 | +2 | gaza | confirmed |

These seven countries are at or near the B9 cap (+10) or already have events inside 365 days, so no band is expected to move; the provisional effect was not computed (`pnpm score --preview` was not run for them). Flag for the author: each minister is named by the continuity of the post (the text prints no names); for Türkiye the Foreign Minister's event and the President's address of the same day are two speakers, two events.


## 5. New events for the light-protocol countries (T-P23-4)

Window: 27 September 2026 to 4 November 2026 for every light-protocol country (their sessions ran between 5 October and 4 November; the window is the same for all so that the statements of the General Debate week and after are covered). Routes: the WordPress REST search for Gaza and Palestin on every origin of the light-protocol countries' `gov_sources` (340 origins; 78 answered), the press-release listing of Pakistan's Ministry (pages 1 and 2, 12 September to 3 November 2026), the Ministries of Oman, Libya and Somalia through their own APIs. No web search was available. Every candidate was opened at its primary page, archived with Save Page Now, and its Wayback replay re-fetched and compared (bytes and SHA-256) with the index row; `archive/index.csv` gained rows only (no row removed).

| Event | Country | Indicator | Date | Points | Scope | Confidence | Source |
|---|---|---|---|---|---|---|---|
| evt_2026_09_22_PAK_B9 | PAK | B9 | 2026-09-22 | +2 | gaza | confirmed | `src_20260922_mofa-pk_fms-joint-statement-gaza-81st` (Pakistan's Ministry) |
| evt_2026_10_16_PAK_B9 | PAK | B9 | 2026-10-16 | +5 | west-bank | confirmed | `src_20261016_mofa-pk_fms-joint-statement-colombia-embassy` (Pakistan's Ministry) and the DIRCO copy |
| evt_2026_10_16_OMN_B9 | OMN | B9 | 2026-10-16 | +5 | west-bank | confirmed | the same; minister named by `src_20261014_fm-gov-om_albusaidi-dar-press-conference` |
| evt_2026_10_16_LBY_B9 | LBY | B9 | 2026-10-16 | +5 | west-bank | confirmed | the same; minister named by `src_20261017_mofa-ly_el-baour-oic-cfm-baghdad` |
| evt_2026_10_16_SOM_B9 | SOM | B9 | 2026-10-16 | +5 | west-bank | confirmed | the same; minister named by `src_20261014_mfa-so_fm-farewell-saudi-ambassador` |

The five light-protocol events are `reviewed` (second reading recorded in each), none is published. The two West Bank events of the 16 October series for PAK, OMN, LBY and SOM are recorded and not scored in version 1.

### Read and not filed

| Country | Item | Date | Why not |
|---|---|---|---|
| OMN | Foreign Minister's lecture at Cambridge ("Inclusive Security in the Gulf"), text on the Ministry's site | 26 Oct | Gaza is named once, in a criticism of the Board of Peace ("Palestinians barely have any role"); no call, no named violation |
| OMN | Joint statement of Oman and the United Kingdom (state visit of 20 to 22 October) | 23 Oct | reaffirms a two-state solution; Gaza is not named; no named speaker |
| OMN | Human Rights Council statement under Item 7 (63rd session) | 30 Sep | delivered by the Permanent Representative in Geneva (R3) |
| OMN / PAK | Press conference of the two foreign ministers in Islamabad | 14 Oct | Pakistan's minister's remark that they exchanged views on Gaza is in indirect speech (R4) |
| LBY | Acting Foreign Minister's meeting with Palestine's Foreign Minister; his attendance at the opening of the OIC Council of Foreign Ministers in Baghdad | 12 and 17 Oct | Ministry reports in the third person (R4) |
| PAK | Joint statement of the Makkah Alliance for Defense (5 Oct); foreign ministers of the Makkah Joint Defense Agreement in New York (25 Sep) | | no mention of Gaza |
| BHS | travel advisory "Middle East travel advisory (regional tensions)" | 11 Oct | not a statement on Gaza |
| BFA, LSO, MLI | statements of the 81st General Debate | 25 to 29 Sep | already read, filed or recorded by their sessions (T-P21-31, T-P21-38, T-P21-39) |
| other WordPress hits | 21 origins, mostly local news items that contain the word Gaza or Palestin (sport, Nobel Prize 2026, ambassadors' credentials) | | not statements of a head of state, a head of government or a foreign minister |

### Signatories of the 16 October 2026 statement not filed

Djibouti, Kuwait, Lebanon, Sudan, Syria and Yemen are named among the twenty signatories (Pakistan's copy, line 104) and are not filed: no archived document names the foreign minister of the government represented at the UN for the weeks around 16 October 2026, and a B9 event needs the speaker's name (the precedent of Kuwait for 26 October 2023). Each country's B9 assessment says so; the names would come from the ministries' own pages (`mfa.gov.kw`, `mofaex.gov.sy`, `mfa.gov.lb` and the others, which a script does not read here). Palestine is not in the universe.


## 6. Article 19 check (docs/10 B-856; HANDOFF "Article 19 check", B-626)

**Question.** `unga_votes.csv` has no vote (`X`) for some states on some of the twelve qualifying votes (Venezuela on all twelve, Kiribati on nine, Solomon Islands, Vanuatu, …). Article 19 of the Charter takes the vote away from a state whose arrears equal or exceed its contributions for the two preceding full years, unless the General Assembly permits it to vote. Are the absences a loss of vote or a choice, and how does B1 treat them?

**Evidence.** The General Assembly's Article 19 page (`un.org/en/ga/about/art19.shtml`) is undated and shows only the current state; the Wayback Machine holds its earlier states. Ten captures nearest before each vote date were recorded as sources (`src_{date}_un-ga_article19-page`, the bytes re-fetched and equal to the index), together with the two sources recorded earlier (`src_20250903_undocs_a-80-362-article19`, `src_20261013_un-ga_article19-page`). The Secretary-General's documents the page cites (A/78/336, A/78/707, A/79/338, A/79/720) are on `documents.un.org`, which refuses scripts: they are cited from the page, not archived.

| Vote | Date | Page used (capture) | States subject to Article 19 | Permitted to vote by resolution |
|---|---|---|---|---|
| A/RES/ES-10/21 | 2023-10-27 | 20231026 (as of 31 Aug 2023, A/78/336) | Venezuela | Comoros, Sao Tome and Principe, Somalia (78/2) |
| A/RES/ES-10/22 | 2023-12-12 | 20231130 (same) | Venezuela | same |
| A/RES/ES-10/23 | 2024-05-10 | 20240412 (as of 21 Mar 2024, A/78/707) | Afghanistan, Ecuador, Venezuela | Comoros, Sao Tome and Principe, Somalia (78/2) |
| A/RES/ES-10/24 | 2024-09-18 | 20240916 (as of 4 Sep 2024) | Afghanistan, Venezuela; Sao Tome and Principe and Somalia (78/2 ran to the end of the 78th session; 79/3 was adopted on 9 October 2024) | none in force on the date |
| A/RES/ES-10/25, /26 | 2024-12-11 | 20241202 (A/79/338) | Afghanistan, Venezuela | Sao Tome and Principe, Somalia (79/3) |
| A/RES/79/232 | 2024-12-19 | 20241218 (as of 18 Dec 2024) | Afghanistan, Venezuela | Sao Tome and Principe (79/3) |
| A/RES/ES-10/27 | 2025-06-12 | 20250620 (A/79/720; 20250401 added Congo and Guinea-Bissau) | Afghanistan, Bolivia, Venezuela | Sao Tome and Principe (79/3) |
| A/DEC/80/506, A/RES/80/1 | 2025-09-12, 2025-09-19 | 20250915 (A/80/362) | Afghanistan, Bolivia, Sao Tome and Principe, Venezuela | none in force (79/3 ended with the 79th session; 80/2 was adopted on 14 October 2025) |
| A/RES/80/78, A/RES/80/116 | 2025-12-05, 2025-12-12 | 20251204 (A/80/362) | Afghanistan, Venezuela | Bolivia, Sao Tome and Principe (80/2) |

The Assembly's page of 13 October 2026 (A/81/360) lists Afghanistan, Bolivia, Sao Tome and Principe (permitted by 81/2 of 12 October 2026) and Venezuela.

**Result.** The table records 218 absences on the twelve votes by 64 states.

| State | Absences | Explained by Article 19 (not entitled on the date) |
|---|---|---|
| Venezuela | 12 | 12 |
| Afghanistan | 10 (all votes from ES-10/23) | 10 |
| Bolivia | 4 | 3 (80/78 was after 80/2) |
| Sao Tome and Principe | 12 | 3 (the other nine: permitted by 78/2, 79/3 or 80/2, and no vote recorded) |
| Ecuador | 1 | 1 (ES-10/23) |
| Somalia | 2 | 1 (ES-10/24; the other, 80/1, is not explained) |
| Other 58 states | 177 | 0 |

Of the 218 absences, **30 are by states the lists show as not entitled to vote on the date; 188 (by 61 states) are not explained by Article 19.** The largest unexplained blocks: Eswatini 12, Benin 10, Kiribati 9, Zambia 9, Central African Republic 8, Equatorial Guinea 7, Democratic Republic of the Congo 6, Haiti 6, Madagascar 6, Tuvalu 6, Burkina Faso, Congo, Guinea-Bissau, Liberia and Malawi 5 each (the complete list is in `data/structured/unga_votes.csv`; the state-by-state findings are in the B-rows of the sessions: B-643 Kiribati, B-690 Tonga and Tuvalu, B-701 Samoa and Cambodia, B-722 Andorra, B-742 Afghanistan, B-749 Bhutan and Iran, B-832 Sao Tome and Principe, B-846 Zambia). Congo and Guinea-Bissau appear on the page of 1 April 2025 and not on that of 20 June 2025; their absences of 2024 and the second half of 2025 fall outside the lists. The reason for an unexplained absence is not stated by the record (an absence at the vote, a delegation not present, or a formal "did not participate" are recorded alike).

**How B1 treats a state without a vote.** docs/02 §2 B1: "Absent is scored −2; a formal 'did not participate' is treated as absent." `unga_votes.csv` records both as `X` and has no field for entitlement. A state that lost its vote under Article 19 and a state that did not take part therefore score the same −2 per vote. For the 30 explained absences the undecayed sum is −24 (Venezuela), −20 (Afghanistan), −6 (Bolivia), −6 (Sao Tome and Principe), −2 (Ecuador), −2 (Somalia); B1 is capped by its category and decayed with the age of each vote, so the effect on a score is smaller (docs/10 B-626 gives Venezuela's).

**For the author and P-24 (no methodology change here).** Options: keep −2 for every absence (the rule as written); score an absence of a state not entitled to vote as 0, from a dated list kept with `votes.yaml` (a methodology change that moves Venezuela and Afghanistan and four smaller cases); keep −2 and show on the country page which absences the lists explain. Default for the draft: keep −2, and show the reason (display only). Recorded in the P-24 block of `PROMPTS.md`.

## 7. A4 data-year gap (docs/10 B-857; B-536 (7))

The A4 generator reads only the rows of the release's own data year (2025). `sipri_orders.csv` carries every order year of the register export, so the orders of data year 2024 are in the table and are not scored, although 2024 starts after 7 October 2023:

| Country | TIV of new orders from Israel, data year 2024 | A4 tier the rule would give | Note |
|---|---|---|---|
| USA | 288 | −10 | |
| SVK | 282 | −10 | Barak MX, contract of 23 December 2024 (B-536 (7)) |
| AUT | 165 | −10 | |
| AZE | 121.8 | −10 | |
| KEN | 45 | −5 | |
| PHL | 5 | −2 | |
| LBR | 0.24 | −2 | |

Zero in 2024: CHE, NLD, PRT, ROU, SRB, SWE. Data year 2023 is left out by design (the year starts before 7 October 2023): positive rows for CZE, DEU (5,400), DNK, GRC, HUN, MAR, MDA, NLD, POL and SGP. **No import was done and none is needed**: the March 2025 release is not archived, and the table already holds the 2024 rows. The fix is in the generator (`packages/pipeline/src/generate/sipri.ts`, `isDataYearRow`), a change on `main` that moves the A4 of six countries by 2 to 10 points and needs a calibration re-run; it is the author's decision, scheduled in the P-24 block of `PROMPTS.md`.

## 8. Maintenance (docs/10 B-858)

| Item | Result |
|---|---|
| Wayback check (issue #14) | `pnpm check:wayback` over the whole index (2,107 rows with a `wayback_url` of 2,143) was started and stopped after about 50 minutes, at about row 530, because the tool paces its requests and writes its report only at the end (a full run takes about three hours), and Wayback then refused connections for a few minutes. No full-index result exists. Verified in this task: the one row of issue #14 (`src_20260927_comtrade_deu-mirror-2023`) answers 200 with 7,203 bytes and the recorded SHA-256 `1b2007c9…141f` (the 404 of 1 October did not repeat); the 15 rows added today (replays re-fetched with `curl --compressed`, bytes and SHA-256 equal to the index). Earlier in the run: 371 replays of 4 November (T-P23-1), 219 and 117 replays of the light-protocol sources (T-VERIFY-1, T-VERIFY-2), all equal except three captures not yet indexed (PHL, BRN, SGP: served later, T-P23-1). The quarterly workflow (`wayback.yml`) runs the full check from GitHub's runners; issue #14 can be closed (its only row answers again) |
| `pnpm audit` | 36 advisories: 2 critical, 14 high, 18 moderate, 2 low. Both critical and two high are in `next` 16.x (unauthenticated remote code execution in Image Optimization and in `use cache`; patched in 16.4.1; the site is a static export, which runs no Next server). The others are in `undici` and `sharp` under `wrangler`, `vite`, `@vitest/mocker`, `zod` below 4.6.6 and the `@lhci/cli` chain of issue #12. Nothing was changed: a dependency change is a change on `main` with a build, listed for T-P20 (Task D) and for the author |
| Issue #12 (`@lhci/cli`) | open; `extract-zip` still has no patched version |
| Issue #13 (widget under Trusted Types) | open; no newsroom has asked; default unchanged |
| Pinned actions | every `uses:` in `.github/workflows` and `.github/actions` is pinned by commit SHA |
| Right-of-reply and error issues | `gh issue list --state all`: three issues (#12, #13, #14), none a reply or an error report; no entry in `data/replies`; nothing to draft under docs/08 |

## 9. What T-P23-4 changed in the data

Events: 13 new (`evt_2026_09_22_{PAK,EGY,IDN,JOR,QAT,SAU,ARE}_B9`, `evt_2026_09_22_TUR_B9_2`, `evt_2026_10_16_{PAK,OMN,LBY,SOM}_B9`), all `reviewed`. Sources: 10 pages of the Article 19 series and 5 documents of ministries (Pakistan 2, Oman 1, Libya 1, Somalia 1); `archive/index.csv` gained 15 rows; 15 replays re-fetched and equal. Assessments: the B9 `queries` of PAK, OMN, LBY, SOM, EGY, IDN, JOR, QAT, SAU, TUR, ARE and of DJI, KWT, LBN, SDN, SYR, YEM.

## 10. Not done

- The news search per indicator group for 27 September to the run date for every country the scripts did not reach (the 45 countries listed in section 4, the 262 origins that did not answer a WordPress search, and every light-protocol country whose site is script-rendered or refuses scripts). A session with a search tool should run them, starting with the signatories of the statements of 22 September and 16 October and the countries named in the P-23 block of `PROMPTS.md`.
- The foreign ministers of Djibouti, Kuwait, Lebanon, Sudan, Syria and Yemen in an archived document, and the 16 October statement for them (section 5).
- The other signatories' ministries' own copies of both statements.
- The documents.un.org copies of the Secretary-General's Article 19 documents (section 6); the EU-Canada summit statement of 30 October 2026 (`consilium.europa.eu` refuses scripts).
- The dependency updates of section 8; `pnpm calibrate` after the new events (the new events change B9 inside categories already at or near their caps; the numbers were not recomputed).
- The tasks after this one (T-P20, T-P22, T-CHECKUP, T-FINAL).

## 11. Finish plan of 2026-11-08

### T-F-HOUSE: quarterly Wayback check (docs/10 B-872, B-873)

The workflow `wayback.yml` was run on GitHub's runners twice. The run on `main` (42522212202) checked 25 rows, because `main` holds a 26-row index; the run on `data/phase1` (42522470502, 2 h 16 min) checked the whole archive. Its report was commented on issue #14 by the workflow.

| Item | Rows |
|---|---|
| Rows of `archive/index.csv` | 2,143 |
| Without `wayback_url` (not checked) | 36 |
| Requested | 2,107 |
| HTTP 200 and the recorded SHA-256 | 1,562 |
| Not HTTP 200 | 545 |
| of which redirect (302) | 77 |
| of which not found (404) | 468 |
| HTTP 200, different SHA-256 | 1 |

The 545 failing rows, second request with redirects followed:

| Result | Rows |
|---|---|
| 302, other snapshot serves the recorded bytes | 20 |
| 302, other snapshot serves different bytes | 52 |
| 302, no answer or 403 | 5 |
| 404 again | 294 |
| 404, no answer (connection closed) | 174 |

The 468 rows with 404 have snapshot timestamps from 2026-11-03 20:46 to 2026-11-04 21:25 UTC (449 Comtrade rows and 19 others). None was re-archived in this session (about eight hours of Save Page Now captures; the cause may be a lag). The list is in `docs/review/wayback-check-2026-11-08.tsv`. The hash difference is `src_20260928_undl_ga-voting-2025-03-31-corr1`. Next step: run the workflow again on `data/phase1` after seven days and re-archive only the rows still failing.

### T-F-UNDOCS-1: documents on hosts that refuse scripts (docs/10 B-874, B-875)

Run on 2026-11-09 with WebSearch, curl, the Wayback CDX index and the built-in browser pane (one tab, `icj-cij.org` and `consilium.europa.eu`). Every capture's replay was re-fetched with `curl --compressed` and compared (bytes and SHA-256) with its index row. Two failed Save Page Now rows (the ICJ's Brazil PDF, Yemen's Ministry page) were removed from `archive/index.csv` by exact id; no other row was touched.

| Item | Result | Records |
|---|---|---|
| ICJ case 192, the Court's list | Read in the pane: no filing after 13 March 2026; every intervener in the universe already filed | none |
| Declaration of Mexico (24 May 2024) | Archived from UNISPAL's Wayback copy; supports the applicant; B3 confirmed on the text | `src_20240524_icj_192-declaration-mexico`; `evt_2024_05_24_MEX_B3` (3 passages added) |
| Declaration of Bolivia (8 October 2024) | Archived from UNISPAL's Wayback copy; supports the applicant; no withdrawal listed | `src_20241008_icj_192-declaration-bolivia`; `evt_2024_10_08_BOL_B3` (2 passages added) |
| Declaration of Belgium (18 December 2025) | Scan OCR'd from the archived bytes; paragraph 19 quoted after comparison with the page image | `src_20251218_icj_192-declaration-belgium` (text file); `evt_2025_12_23_BEL_B3` (3 fragments added) |
| Declaration of Brazil (17 September 2025) | Not readable: ICJ human check (not clicked), Save Page Now 403, no UNISPAL or government copy | `evt_2025_09_17_BRA_B3` notes only |
| EU–Canada summit statement (30 October 2026) | Read (Council document ST 15148/26): Middle East paragraph without Gaza (R7); signed by the EU's Presidents and Canada's Prime Minister | none |
| 16 October 2026 statement, six signatories | Foreign ministers named in archived official documents; filed | `evt_2026_10_16_{DJI,KWT,LBN,SDN,SYR,YEM}_B9` (+5, west-bank, unscored); 6 sources |
| 22 September and 16 October 2026, signatories' own copies | Not sought (every signatory is filed on the archived copies) | none |
| B5 Algeria | Ministry statement of 21 November 2024 archived from the Arabic Wayback capture; filed under R2, flagged | `src_20241121_mfa-dz_statement-icc-warrants`; `evt_2024_11_21_DZA_B5` (+8) |
| B5 Indonesia | Ministry post on X of 23 November 2024, known from the press; no copy on kemlu.go.id | lead kept (`lead_20260929_IDN_1`) |

Score effect (preview, for reading only): Algeria +37 (Acting) to +45 (Confronting) with the B5 event; the other records add text to existing events or are west-bank and do not move a score. Flags for the author are in docs/10 B-875.
