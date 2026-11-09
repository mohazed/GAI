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

**Evidence.** The General Assembly's Article 19 page (`un.org/en/ga/about/art19.shtml`) is undated and shows only the current state; the Wayback Machine holds its earlier states. Ten captures nearest before each vote date were recorded as sources (`src_{date}_un-ga_article19-page`, the bytes re-fetched and equal to the index), together with the two sources recorded earlier (`src_20250903_undocs_a-80-362-article19`, `src_20261013_un-ga_article19-page`). The Secretary-General's documents the page cites (A/78/336, A/78/707, A/79/338, A/79/720) were cited from the page in this first reading; they and their addenda are archived since T-F-UNDOCS-3 (section 6.1), and sections 6.2 and 6.3 give the document behind each of the 218 absences.

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

### 6.1 The Secretary-General's letters and the three resolutions, archived (T-F-UNDOCS-3, docs/10 B-878, B-879)

`documents.un.org` answers `curl` through its symbol route (`documents.un.org/api/symbol/access?s=A/78/336&l=en&t=pdf`, which redirects to the file under `/doc/undoc/gen/`); every file below was saved with Save Page Now (or recorded from an existing capture of the same address), its SHA-256 and byte count equal to the bytes fetched and to the Wayback replay fetched again. Each letter is one page and its text is in `archive/text/`.

| Document | Date of the letter | Source id | Content |
|---|---|---|---|
| A/78/336 | 31 Aug 2023 | `src_20230831_undocs_a-78-336-article19` | four states in arrears (2021 and 2022 contributions): Comoros, Sao Tome and Principe, Somalia, Venezuela |
| A/78/707 | 8 Jan 2024 | `src_20240108_undocs_a-78-707-article19` | ten states (2022 and 2023): Afghanistan, Antigua and Barbuda, Comoros, Dominica, Ecuador, Iran, Liberia, Sao Tome and Principe, Somalia, Venezuela |
| A/78/707/Add.1 to Add.5 | 11 Jan, 13 Mar, 21 Mar, 22 May, 4 Sep 2024 | `src_20240111_`, `20240313_`, `20240321_`, `20240522_`, `20240904_undocs_a-78-707-add{1..5}-article19` | payments: Antigua and Barbuda and Iran; Liberia; Dominica; Ecuador; the Comoros |
| A/79/338 | 4 Sep 2024 | `src_20240904_undocs_a-79-338-article19` | four states (2022 and 2023): Afghanistan, Sao Tome and Principe, Somalia, Venezuela |
| A/79/338/Add.1 | 18 Dec 2024 | `src_20241218_undocs_a-79-338-add1-article19` | payment: Somalia |
| A/79/720 | 13 Jan 2025 | `src_20250113_undocs_a-79-720-article19` | ten states (2023 and 2024): Afghanistan, Antigua and Barbuda, Bolivia, Cabo Verde, Congo, Ecuador, Grenada, Guinea-Bissau, Sao Tome and Principe, Venezuela |
| A/79/720/Add.1 to Add.5 | 20 Jan, 24 Feb, 28 Feb, 28 Mar, 2 Jun 2025 | `src_20250120_`, `20250224_`, `20250228_`, `20250328_`, `20250602_undocs_a-79-720-add{1..5}-article19` | payments: Antigua and Barbuda; Cabo Verde and Grenada; Ecuador; Congo; Guinea-Bissau |
| A/80/362 | 3 Sep 2025 | `src_20250903_undocs_a-80-362-article19` (archived earlier) | four states (2023 and 2024): Afghanistan, Bolivia, Sao Tome and Principe, Venezuela |
| A/RES/78/2, 79/3, 80/2 | 5 Oct 2023, 9 Oct 2024, 14 Oct 2025 | `src_20231005_`, `20241009_`, `20251014_undocs_a-res-{78-2,79-3,80-2}-article19` | permission to vote: Comoros, Sao Tome and Principe, Somalia until the end of the 78th session; Sao Tome and Principe and Somalia until the end of the 79th; Bolivia and Sao Tome and Principe until the end of the 80th |

Looked for and not found (the symbol route answers an error page): A/78/336/Add.1, A/79/338/Add.2, A/80/362/Add.1 and Add.2, A/78/707/Add.6, A/79/720/Add.6. Two points on dates. (1) A/79/720/Add.5 is dated 2 June 2025 but the PDF carries the distribution line `25-08618 (E) 220726` and sits under the 2026 path of the site; the Article 19 page captured on 20 June 2025 already cites it, so Guinea-Bissau's payment was on record before the vote of 12 June 2025. (2) A/78/707/Add.4 (22 May 2024) reports Ecuador's payment twelve days after the vote of 10 May 2024 and does not give the date of the payment; the letters in force on the vote date show Ecuador in arrears, and that absence is classed "not entitled" on that basis. Somalia on 18 September 2024 is in the same position (named in A/79/338 of 4 September 2024, no permission in force; its payment is reported by A/79/338/Add.1 of 18 December 2024, without a date). Both are flags for the author (docs/10 B-879). The letter A/81/360 (3 Sep 2026) and its Add.1, and resolution 81/2 (12 Oct 2026), exist on the same site and are not archived: no qualifying vote of the table falls in the 81st session (the vote of 17 September 2026 is not in `votes.yaml` yet).

### 6.2 Each absence by vote: not entitled or non-vote

Definitions. **Not entitled**: the state is named in the letter in force on the vote date (the last letter, with the addenda, dated on or before the vote) and no resolution under Article 19 permitted it to vote that day; under Article 19 it had no vote, and `unga_votes.csv` records `X`. **Non-vote**: the state was entitled to vote (not named in the letters in force, or named and permitted by resolution) and no vote is recorded; the record does not say whether the delegation was absent or formally did not participate. The 79th session opened on 10 September 2024 and the 80th on 9 September 2025 (calendar dates; the permissions "until the end of its seventy-eighth / seventy-ninth session" ended on the day before).

| Vote | Date | Letters of the Secretary-General in force | Subject to Article 19 | Permitted to vote by resolution | Absences: not entitled | Absences: non-vote (entitled; no vote recorded) |
|---|---|---|---|---|---|---|
| A/RES/ES-10/21 | 2023-10-27 | A/78/336 (31 Aug 2023) | Comoros, Sao Tome and Principe, Somalia, Venezuela | Comoros, Sao Tome and Principe, Somalia (78/2) | 1: Venezuela (Bolivarian Republic of) | 13: Burundi, Benin, Burkina Faso, Jamaica, Cambodia, Liberia, Rwanda, Sao Tome and Principe, Eswatini, Seychelles, Togo, Turkmenistan, Samoa |
| A/RES/ES-10/22 | 2023-12-12 | A/78/336 (31 Aug 2023) | Comoros, Sao Tome and Principe, Somalia, Venezuela | Comoros, Sao Tome and Principe, Somalia (78/2) | 1: Venezuela (Bolivarian Republic of) | 6: Burkina Faso, Haiti, Kiribati, Sao Tome and Principe, Eswatini, Turkmenistan |
| A/RES/ES-10/23 | 2024-05-10 | A/78/707 (8 Jan 2024) with Add.1 (11 Jan), Add.2 (13 Mar), Add.3 (21 Mar); Add.4 (22 May) is later than the vote | Afghanistan, Comoros, Ecuador, Sao Tome and Principe, Somalia, Venezuela | Comoros, Sao Tome and Principe, Somalia (78/2) | 3: Afghanistan, Ecuador, Venezuela (Bolivarian Republic of) | 13: Cameroon, Democratic Republic of the Congo, Congo, Kiribati, Liberia, Solomon Islands, South Sudan, Sao Tome and Principe, Eswatini, Togo, Tonga, Tuvalu, Samoa |
| A/RES/ES-10/24 | 2024-09-18 | A/79/338 (4 Sep 2024) and A/78/707/Add.5 (4 Sep 2024) | Afghanistan, Sao Tome and Principe, Somalia, Venezuela | none in force (78/2 ended with the 78th session; 79/3 was adopted on 9 Oct 2024) | 4: Afghanistan, Somalia, Sao Tome and Principe, Venezuela (Bolivarian Republic of) | 8: Benin, Central African Republic, Congo, Equatorial Guinea, Madagascar, Eswatini, Togo, Zambia |
| A/RES/ES-10/25 | 2024-12-11 | A/79/338 (4 Sep 2024); Add.1 (18 Dec) is later than the vote | Afghanistan, Sao Tome and Principe, Somalia, Venezuela | Sao Tome and Principe, Somalia (79/3) | 2: Afghanistan, Venezuela (Bolivarian Republic of) | 12: Benin, Burkina Faso, Central African Republic, Democratic Republic of the Congo, Dominica, Guinea-Bissau, Haiti, Kiribati, Sao Tome and Principe, Eswatini, Tuvalu, Zambia |
| A/RES/ES-10/26 | 2024-12-11 | A/79/338 (4 Sep 2024); Add.1 (18 Dec) is later than the vote | Afghanistan, Sao Tome and Principe, Somalia, Venezuela | Sao Tome and Principe, Somalia (79/3) | 2: Afghanistan, Venezuela (Bolivarian Republic of) | 11: Benin, Central African Republic, Democratic Republic of the Congo, Dominica, Guinea-Bissau, Haiti, Kiribati, Sao Tome and Principe, Eswatini, Tuvalu, Zambia |
| A/RES/79/232 | 2024-12-19 | A/79/338 with Add.1 (18 Dec 2024: Somalia paid) | Afghanistan, Sao Tome and Principe, Venezuela | Sao Tome and Principe (79/3) | 2: Afghanistan, Venezuela (Bolivarian Republic of) | 20: Benin, Burkina Faso, Central African Republic, Democratic Republic of the Congo, Congo, Comoros, Dominica, Gabon, Equatorial Guinea, Grenada, Kiribati, Madagascar, Mozambique, Malawi, Sao Tome and Principe, Eswatini, Tuvalu, Saint Vincent and the Grenadines, Vanuatu, Zambia |
| A/RES/ES-10/27 | 2025-06-12 | A/79/720 (13 Jan 2025) with Add.1 (20 Jan), Add.2 (24 Feb), Add.3 (28 Feb), Add.4 (28 Mar), Add.5 (2 Jun) | Afghanistan, Bolivia, Sao Tome and Principe, Venezuela | Sao Tome and Principe (79/3) | 3: Afghanistan, Bolivia (Plurinational State of), Venezuela (Bolivarian Republic of) | 10: Benin, Central African Republic, Comoros, Equatorial Guinea, Haiti, Madagascar, Sao Tome and Principe, Eswatini, Samoa, Zambia |
| A/DEC/80/506 | 2025-09-12 | A/80/362 (3 Sep 2025) | Afghanistan, Bolivia, Sao Tome and Principe, Venezuela | none in force (79/3 ended with the 79th session; 80/2 was adopted on 14 Oct 2025) | 4: Afghanistan, Bolivia (Plurinational State of), Sao Tome and Principe, Venezuela (Bolivarian Republic of) | 25: Antigua and Barbuda, Benin, Bhutan, Central African Republic, Dominica, Eritrea, Georgia, Guinea-Bissau, Equatorial Guinea, Grenada, Honduras, Haiti, Iran (Islamic Republic of), Iraq, Kiribati, Liberia, Monaco, Madagascar, Malawi, Panama, Eswatini, Tunisia, Tuvalu, Vanuatu, Zambia |
| A/RES/80/1 | 2025-09-19 | A/80/362 (3 Sep 2025) | Afghanistan, Bolivia, Sao Tome and Principe, Venezuela | none in force (as above) | 4: Afghanistan, Bolivia (Plurinational State of), Sao Tome and Principe, Venezuela (Bolivarian Republic of) | 33: Andorra, Argentina, Burundi, Benin, Belize, Botswana, Central African Republic, Cameroon, Democratic Republic of the Congo, Congo, Micronesia (Federated States of), Gabon, Georgia, Gambia, Guinea-Bissau, Equatorial Guinea, Jamaica, Kiribati, Liberia, Marshall Islands, Malawi, Peru, Somalia, South Sudan, Slovakia, Eswatini, Turkmenistan, Tonga, Tuvalu, United Republic of Tanzania, Vanuatu, Samoa, Zambia |
| A/RES/80/78 | 2025-12-05 | A/80/362 (3 Sep 2025) | Afghanistan, Bolivia, Sao Tome and Principe, Venezuela | Bolivia, Sao Tome and Principe (80/2) | 2: Afghanistan, Venezuela (Bolivarian Republic of) | 16: Benin, Bolivia (Plurinational State of), Botswana, Central African Republic, Congo, Guinea-Bissau, Equatorial Guinea, Grenada, Kiribati, Madagascar, Malawi, Nigeria, Sao Tome and Principe, Eswatini, Saint Vincent and the Grenadines, Zambia |
| A/RES/80/116 | 2025-12-12 | A/80/362 (3 Sep 2025) | Afghanistan, Bolivia, Sao Tome and Principe, Venezuela | Bolivia, Sao Tome and Principe (80/2) | 2: Afghanistan, Venezuela (Bolivarian Republic of) | 21: Antigua and Barbuda, Benin, Burkina Faso, Cameroon, Democratic Republic of the Congo, Cabo Verde, Equatorial Guinea, Grenada, Haiti, Kiribati, Liberia, Saint Lucia, Lesotho, Madagascar, Malawi, Rwanda, Sao Tome and Principe, Eswatini, United Republic of Tanzania, Saint Vincent and the Grenadines, Zambia |

Totals: **30 not entitled, 188 non-vote**, 218 in all; the 30 are the same absences as in the table of the Result above, now each tied to a letter. Sao Tome and Principe was entitled (permitted by 78/2, 79/3 or 80/2) and has no recorded vote on nine of its twelve absences; Bolivia was permitted on 5 and 12 December 2025 and has no vote on 5 December (and voted N on 12 December); Somalia has a non-vote on 19 September 2025, when A/80/362 does not name it.

### 6.3 Each state with an absence

| State | ISO3 | Absences | Not entitled | Non-vote | Documents |
|---|---|---|---|---|---|
| Eswatini | SWZ | 12 | 0 | 12 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Sao Tome and Principe | STP | 12 | 3 | 9 | Named in every letter; permitted by 78/2, 79/3 and 80/2 for the periods in the table of 6.2; not entitled on 18 Sep 2024, 12 Sep 2025 and 19 Sep 2025 (no resolution in force); entitled and absent on the nine others. |
| Venezuela (Bolivarian Republic of) | VEN | 12 | 12 | 0 | Named in every letter (A/78/336, A/78/707, A/79/338, A/79/720, A/80/362); never permitted. |
| Afghanistan | AFG | 10 | 10 | 0 | Named in A/78/707 (8 Jan 2024), A/79/338, A/79/720, A/80/362; never permitted. Not named in A/78/336, and voted on the two votes of 2023. |
| Benin | BEN | 10 | 0 | 10 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Kiribati | KIR | 9 | 0 | 9 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Zambia | ZMB | 9 | 0 | 9 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Central African Republic | CAF | 8 | 0 | 8 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Equatorial Guinea | GNQ | 7 | 0 | 7 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Democratic Republic of the Congo | COD | 6 | 0 | 6 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Haiti | HTI | 6 | 0 | 6 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Madagascar | MDG | 6 | 0 | 6 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Tuvalu | TUV | 6 | 0 | 6 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Burkina Faso | BFA | 5 | 0 | 5 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Congo | COG | 5 | 0 | 5 | Named in A/79/720 (13 Jan 2025) until Add.4 (28 Mar 2025). Its five absences (10 May, 18 Sep, 19 Dec 2024; 19 Sep, 5 Dec 2025) fall outside that period. |
| Guinea-Bissau | GNB | 5 | 0 | 5 | Named in A/79/720 until Add.5 (2 Jun 2025). Its five absences (two on 11 Dec 2024; 12 Sep, 19 Sep, 5 Dec 2025) fall outside that period. |
| Liberia | LBR | 5 | 0 | 5 | Named in A/78/707 only; paid by Add.2 (13 Mar 2024). Absences of 27 Oct 2023 (before the letter), 10 May 2024 (after the payment) and the three of Sep and Dec 2025: non-votes. |
| Malawi | MWI | 5 | 0 | 5 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Bolivia (Plurinational State of) | BOL | 4 | 3 | 1 | Named in A/79/720 (13 Jan 2025) and A/80/362; permitted by 80/2 (14 Oct 2025): not entitled on 12 Jun, 12 Sep and 19 Sep 2025; entitled and absent on 5 Dec 2025 (voted N on 12 Dec 2025). |
| Dominica | DMA | 4 | 0 | 4 | Named in A/78/707 until Add.3 (21 Mar 2024). Its four absences (11 Dec 2024 twice, 19 Dec 2024, 12 Sep 2025) fall outside that period. |
| Grenada | GRD | 4 | 0 | 4 | Named in A/79/720 until Add.2 (24 Feb 2025). Its four absences (19 Dec 2024; 12 Sep, 5 Dec, 12 Dec 2025) fall outside that period. |
| Samoa | WSM | 4 | 0 | 4 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Cameroon | CMR | 3 | 0 | 3 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Saint Vincent and the Grenadines | VCT | 3 | 0 | 3 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Togo | TGO | 3 | 0 | 3 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Turkmenistan | TKM | 3 | 0 | 3 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Vanuatu | VUT | 3 | 0 | 3 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Antigua and Barbuda | ATG | 2 | 0 | 2 | Named in A/78/707 until Add.1 (11 Jan 2024) and in A/79/720 until Add.1 (20 Jan 2025). Its two absences (12 Sep, 12 Dec 2025) fall outside those periods. |
| Botswana | BWA | 2 | 0 | 2 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Burundi | BDI | 2 | 0 | 2 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Comoros | COM | 2 | 0 | 2 | Named in A/78/336 and A/78/707 (permitted by 78/2); paid by A/78/707/Add.5 (4 Sep 2024). Not named in A/79/338 or A/79/720: its absences of 19 Dec 2024 and 12 Jun 2025 are non-votes. |
| Gabon | GAB | 2 | 0 | 2 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Georgia | GEO | 2 | 0 | 2 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Jamaica | JAM | 2 | 0 | 2 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Rwanda | RWA | 2 | 0 | 2 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Somalia | SOM | 2 | 1 | 1 | Named in A/78/336, A/78/707, A/79/338; permitted by 78/2 and 79/3; no resolution in force on 18 Sep 2024: not entitled that day. Payment reported by A/79/338/Add.1 (18 Dec 2024), without its date. Absent on 19 Sep 2025 when not named in A/80/362: non-vote. |
| South Sudan | SSD | 2 | 0 | 2 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Tonga | TON | 2 | 0 | 2 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| United Republic of Tanzania | TZA | 2 | 0 | 2 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Andorra | AND | 1 | 0 | 1 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Argentina | ARG | 1 | 0 | 1 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Belize | BLZ | 1 | 0 | 1 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Bhutan | BTN | 1 | 0 | 1 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Cabo Verde | CPV | 1 | 0 | 1 | Named in A/79/720 until Add.2 (24 Feb 2025). Its absence of 12 Dec 2025 falls outside. |
| Cambodia | KHM | 1 | 0 | 1 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Ecuador | ECU | 1 | 1 | 0 | Named in A/78/707 (8 Jan 2024); A/78/707/Add.4 (22 May 2024, after the vote) reports its payment without a date of payment: not entitled on the letters in force on 10 May 2024. Named again in A/79/720 until Add.3 (28 Feb 2025), outside its absence. |
| Eritrea | ERI | 1 | 0 | 1 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Gambia | GMB | 1 | 0 | 1 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Honduras | HND | 1 | 0 | 1 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Iran (Islamic Republic of) | IRN | 1 | 0 | 1 | Named in A/78/707 until Add.1 (11 Jan 2024). Its absence of 12 Sep 2025 falls outside. |
| Iraq | IRQ | 1 | 0 | 1 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Lesotho | LSO | 1 | 0 | 1 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Marshall Islands | MHL | 1 | 0 | 1 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Micronesia (Federated States of) | FSM | 1 | 0 | 1 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Monaco | MCO | 1 | 0 | 1 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Mozambique | MOZ | 1 | 0 | 1 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Nigeria | NGA | 1 | 0 | 1 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Panama | PAN | 1 | 0 | 1 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Peru | PER | 1 | 0 | 1 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Saint Lucia | LCA | 1 | 0 | 1 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Seychelles | SYC | 1 | 0 | 1 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Slovakia | SVK | 1 | 0 | 1 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Solomon Islands | SLB | 1 | 0 | 1 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |
| Tunisia | TUN | 1 | 0 | 1 | Not named in any of the letters (A/78/336, A/78/707 and its addenda, A/79/338 and Add.1, A/79/720 and its addenda, A/80/362). |

Of the 64 states, 61 have at least one non-vote; Venezuela, Afghanistan and Ecuador have only not-entitled absences. 49 of the 64 states are named in none of the letters. The 15 named in a letter are the six with not-entitled absences (Venezuela, Afghanistan, Bolivia, Sao Tome and Principe, Ecuador, Somalia) and nine (the Comoros, Liberia, Congo, Guinea-Bissau, Dominica, Grenada, Antigua and Barbuda, Cabo Verde, Iran) whose listing periods do not overlap their absence dates, as the table states.

### 6.4 For T-F-METHOD (no methodology change here)

The table 6.2 is a dated, document-backed list of the votes on which a state had no vote under Article 19 (the "not entitled" column: 30 absences by six states, undecayed −60 under B1 as written). `unga_votes.csv` and docs/02 §2 B1 are unchanged; both kinds of absence still score −2. If the author chooses option (b) of the P-24 block (score a not-entitled absence as 0), the list above is the input for a `votes.yaml` field; if option (c) (display only), it is the text for the country page. Default for the draft stays: keep −2 and show the reason.

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

### T-F-UNDOCS-2: UNRWA 2025 donor table (docs/10 B-876, B-877)

| Item | Result |
|---|---|
| Table | `src_20251231_unrwa_donor-ranking-2025`: UNRWA table 3 of the 2025 set, "as of 31 December 2025", from the Wayback capture of 21 May 2026 (unrwa.org itself shows a Cloudflare check, not clicked); 489,397 bytes, sha256 checked against the replay |
| States with a row in the universe | 56 (EU, UN agencies, NGOs and committees are not states) |
| Above their 2022 contribution (D3 increased, +8, from 2025-12-31) | 39: AND ARE AUS BEL CAN CHL CHN CYP DNK ESP EST FRA GBR GRC IDN IND IRL ISL JOR KAZ KOR LBN LIE LTU LUX MDV MEX MYS NOR OMN PAK POL PRT RUS SMR SVN SYR THA ZAF |
| First D3 event for the state | IND, RUS, SYR |
| Row, not above 2022 (no event) | AUT BGD BRN CHE DEU FIN ITA JPN KWT MCO MLT NLD PHL QAT SAU TUR VAT |
| No row in the 2025 table (no event) | every other state, including USA and SWE (D2 stays open) |
| 2024 events ended on 2025-12-31 | 55 events (20 states without a 2025 event: ARM BRA COL DZA GUY IRQ JPN KWT LKA LVA MLT MNE NLD NZL PHL QAT SAU TUR VNM ZWE; the 2024 or restored event of the 39 above, so that no year is counted twice) |
| Open restored tiers left as filed | AUT CHE DEU FIN ITA ROU |
| Assessments | D3 of all 193 states: note, query and `checked_at` updated; IND, RUS, SYR none-found to has-events |
| Verification | every quote re-found at its locator by a script after writing; `pnpm validate` 0 errors |

Score effect (preview, for reading only): each of the 39 gains D3 +8 from 2025-12-31 (also counted as a qualifying event for passivity); e.g. Norway +47.9 and Syria +26.1 (Acting). Flags for the author are in docs/10 B-877.

### T-F-UNDOCS-3: Article 19 documents (docs/10 B-878, B-879)

| Item | Result |
|---|---|
| Letters archived | A/78/336, A/78/707 and Add.1 to Add.5, A/79/338 and Add.1, A/79/720 and Add.1 to Add.5: 15 one-page PDFs from `documents.un.org` (symbol route read with `curl`), each saved with Save Page Now or recorded from an existing capture; SHA-256 and bytes equal to the bytes fetched and to the replay fetched again |
| Resolutions archived | A/RES/78/2, 79/3, 80/2 (permission to vote under Article 19), same checks |
| Already archived | A/80/362 (`src_20250903_undocs_a-80-362-article19`) |
| Not found | A/78/336/Add.1, A/79/338/Add.2, A/80/362/Add.1 and Add.2, A/78/707/Add.6, A/79/720/Add.6 |
| Absences classified (section 6.2, 6.3) | 218 = 30 not entitled (VEN 12, AFG 10, BOL 3, STP 3, ECU 1, SOM 1) + 188 non-vote (61 states) |
| Flags | Ecuador 10 May 2024 and Somalia 18 Sep 2024 (payment date not stated); session-opening dates; "non-vote" does not say absent or did not participate (docs/10 B-879) |
| Changed | no data row, `unga_votes.csv` semantics and methodology unchanged; 18 source records and texts added |
| Verification | `pnpm validate` 0 errors |


### T-F-W1: full-protocol wave USA DEU GBR FRA ESP (docs/10 B-880 to B-884)

Window of 27 September to 9 November 2026, read on the governments' own sites (no search engine date filter works; routes in B-880). Every capture's replay was re-fetched and compared (bytes and SHA-256) with its index row. Preview scores are rc.1 with `--preview`, for reading only.

| Country | Routes read | New events | Seen and not filed | Preview score before and after | Assessments touched |
|---|---|---|---|---|---|
| USA | White House listings (briefings, remarks, fact sheets, presidential actions), State Department feed (10 items), two Secretary's transcripts, the fact sheet of 9 October 2026 on the ICC | none | no item on Gaza; the designation of the ICC itself under Executive Order 14203 (B7 is one standing state: no new event, B-885) | −100.0 Sustaining, unchanged | B7, B9 notes |
| DEU | Foreign Office search endpoint (11 terms, 28 items), speeches of 29 September and 5 November, joint statement of 9 October on the ICC, Drucksache 21/7784 | none | Foreign Minister's speech of 5 November 2026 (no call, no violation named); ICC statement (no warrants) | −3.8 Passive, unchanged | A7 note (licences to Israel Q2 2026 EUR 735.8 million, archived), B9 note |
| GBR | GOV.UK search API (20 queries) to 9 November, Bills API | none beyond `evt_2026_10_19_GBR_B9` (T-P23-3) | none | +52.8 Confronting, unchanged | B9 note |
| FRA | the ministry's news list, pages 0 to 9 (every item with Gaza or Palestine read), arms-export report 2026 | `evt_2026_09_22_FRA_B9` (+5), `evt_2026_09_27_FRA_B9` (+5, west-bank), `evt_2026_10_21_FRA_B9` (+2), `evt_2026_10_28_FRA_B9` (+5, west-bank) | 6 October speech (five conflicts in one list); 14 October answer on arms (precautionary measures, no class named) | +46.3 Confronting, unchanged (B9 at cap) | A2 (primary report), A6, B9, C4 notes; `lead_20260928_FRA_4` dropped (resolved) |
| ESP | Ministry press notes (21) and statements, Moncloa activities, Councils' references of 29 September to 3 November | `evt_2025_05_16_ESP_B9` (+5), `evt_2025_12_14_ESP_B9` (+5), `evt_2026_01_05_ESP_B9` (+2): the T-VERIFY-2 items (B-849) | nothing in the window | +79.0 Confronting, unchanged (B9 at cap) | B9, E3 notes; `lead_20260928_ESP_7` note |

Sources added (10): `src_20261009_state_imposing-sanctions-icc-institution`, `src_20260922_un-news_macron-general-debate`, `src_20260923_diplomatie-cd_macron-agnu-81`, `src_20260927_diplomatie-gouv_france2-inter-barrot`, `src_20261014_diplomatie-gouv_qag-barrot-gaza-armes`, `src_20261021_diplomatie-gouv_declaration-conjointe-france-qatar`, `src_20261028_diplomatie-gouv_france2-barrot`, `src_20260812_defense-gouv_rapport-parlement-2026-exportations`, `src_20260710_poderjudicial_an-admite-querellas-flotilla`, `src_20260828_bundestag_drucksache-21-7784-israel`.

Not done: the news search by indicator group in the official language for USA, DEU and GBR beyond the routes above (the Federal Government's site and the Élysée's list cannot be paged by script); the leads that need an official copy (USA 1, GBR 1, FRA 1 to 3 and 5 to 6, ESP 1 to 6, 8, 9, DEU 1 to 3: B-883); the Franco-Qatari declaration for Qatar's Emir (another wave). Open questions for the author: B-884.

### T-F-W2: full-protocol wave IRL ZAF TUR EGY IND (docs/10 B-886 to B-890)

Window of 27 September to 9 November 2026, read on the governments' own sites (routes in B-886); joint statements of 2026 from the P-16 list and the T-VERIFY-2 items for Ireland added (B-887). Every capture's replay was re-fetched and compared (bytes and SHA-256) with its index row. Preview scores are rc.1 with `--preview`, for reading only.

| Country | Routes read | New events | Seen and not filed | Preview score before and after | Assessments touched |
|---|---|---|---|---|---|
| IRL | Wayback CDX listings of the Department of Foreign Affairs' press releases and the Taoiseach's speeches and press releases; gov.ie read directly | `evt_2026_10_12_IRL_B9` (+2); `evt_2025_05_16_IRL_B9` (+5) and `evt_2026_01_05_IRL_B9` (+2), the joint statements of T-VERIFY-2; `evt_2025_08_28_IRL_B9` (+2, found while reading lead 5) | ICC statements of 5 and 9 October (no warrants); pre-European Council release (no call); Taoiseach's General Debate statement of 24 September (read, not archivable: lead 6) | +58.7 Confronting, unchanged (B9 at cap) | B9 note; leads 2 to 6 annotated |
| ZAF | DIRCO Media Statements and Minister's speeches lists; Presidency statements pages 0 to 16 | `evt_2026_09_24_ZAF_B9` (+2, IBSA ministers) | Minister's General Debate statement of 24 September (Palestine, Gaza not named, R7); remarks of 20 October; CHOGM communiqué of 4 November (no Gaza) | +53.0 Confronting, unchanged (B9 at cap) | B9 note; lead 2 annotated |
| TUR | Ministry press releases No. 191 to 215, Joint Declarations 2026, speeches, interviews, press conferences; Directorate of Communications' news | `evt_2026_10_23_TUR_B9` (+2, R4 ministers); `evt_2026_08_03_TUR_B9` (+5) and `evt_2026_08_20_TUR_B9` (+2), mediators' statements of the P-16 list; the eight ministers' West Bank statements of 2 June, 23 July, 21 August and 9 September 2026 (+5 each, west-bank, unscored) | MUSIAD speech (reported speech); Turkevi remarks (before the window, undated); NSC statement; ministry releases without a speaker; R4 of 21 June, eight ministers of 16 August, twelve ministers of 21 August on Syria | +68.7 Confronting, unchanged (B9 at cap) | B9 note; lead 2 annotated |
| EGY | SIS XML sitemap (948 entries since 27 September; speeches and Gaza news read in full); Presidency site (index by script) | `evt_2026_10_05_EGY_B9` (+2), `evt_2026_10_10_EGY_B9` (+2), `evt_2026_10_11_EGY_B9` (+5), `evt_2026_10_23_EGY_B9` (+2); `evt_2026_08_03_EGY_B9` (+5) and `evt_2026_08_20_EGY_B9` (+2); the same four West Bank statements as Türkiye (+5 each, unscored) | President's press conference of 3 November with Slovenia (not archivable: Save Page Now unavailable); unattributed ministry statements on Al-Aqsa; readout of 6 October; Seoul press conference (no call) | +21.3 Acting, unchanged (B9 at cap) | B9 and B8 notes (B8 stays unchecked, B-860); lead 2 annotated |
| IND | MEA listing endpoint, 90 items since 27 September, full texts read | `evt_2026_09_24_IND_B9` (+2, IBSA ministers) | Prime Minister's statements of 5 and 22 October and Minister's remarks of 23 and 25 October ("West Asia", no Gaza); spokesperson's briefings | −11.2 to −9.2, Passive (B9 +5.0 to +7.0) | B9 note |

Sources added (13): `src_20250828_gov-ie_tanaiste-52-palestinians-gaza`, `src_20260602_mfa-tr_eight-ministers-al-aqsa`, `src_20260723_mfa-tr_eight-ministers-al-aqsa-jerusalem`, `src_20260821_mfa-tr_eight-ministers-e1-settlement`, `src_20260909_mfa-tr_eight-ministers-settlement-trade`, `src_20261012_gov-ie_mcentee-fac-luxembourg-gaza`, `src_20260928_mea_ibsa-14th-ministerial-media-statement`, `src_20261023_mfa-tr_joint-statement-r4-ministerial-istanbul`, `src_20260803_mfa-tr_mediators-violations-gaza`, `src_20260820_mfa-tr_mediators-statement-israeli-attacks-gaza`, `src_20261005_sis_sisi-october-war-anniversary`, `src_20261010_sis_sisi-press-conference-malaysia`, `src_20261011_sis_sisi-press-conference-indonesia`.

Not done: the press and NGO searches per indicator group beyond the governments' own sites and the leads (IND B-249 (5) and EGY B-244 (2) stay open); the leads not re-searched (IRL 1, ZAF 3 and 4, TUR 1 and 3, EGY 1 and 3, IND 1 to 5); the same four West Bank statements for the other signatories (other waves); the Taoiseach's General Debate statement and the Egyptian President's statement of 3 November 2026 (not archivable on 2026-11-09). Flags for the author: B-889.
