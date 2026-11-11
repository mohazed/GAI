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

### T-F-W3: full-protocol wave ITA NLD CAN AUS BEL (docs/10 B-891 to B-895)

Window of 27 September to 9 November 2026, read on the Governments' own sites and listings (routes in B-891); the open items of the P-D rows of the wave added where a route existed (B-895 lists the rest). Every capture's replay was re-fetched and compared (bytes and SHA-256) with its index row. Preview scores are rc.1 with `--preview`, for reading only.

| Country | Routes read | New events | Seen and not filed | Preview score before and after | Assessments touched |
|---|---|---|---|---|---|
| ITA | Wayback CDX listing of esteri.it October 2026 (47 pages), searches of esteri.it and governo.it, the Prime Minister's page | `evt_2026_09_22_ITA_B9` (+2, Minister at the General Assembly); `evt_2026_10_07_ITA_B9` (+2, President of the Council, tier flagged) | Minister's message of 7 October (no call); joint statement of 9 October on the ICC (no warrants); question time of October (no Gaza passage); suspension of the renewal of the 2003 defence memorandum (April 2026, press only; no indicator) | +12.6 Acting, unchanged (B9 raw +25.6, cap +10) | B9, D2, C2, A5 notes; leads ITA 2 and the three of 30 September annotated |
| NLD | Official publications repository (SRU, 82 documents of the window), government.nl, Staatsblad 2026, 222 | `evt_2026_10_27_NLD_B9` (+2, Minister's written answer); evidence added to `evt_2026_09_22_NLD_C4` (decree's own publication) | Answer of 16 October on Ben-Gvir (no violation named); Prime Minister's General Assembly speech of 24 September (no call); answer of 30 October on the EUR 12 million package (D4 already filed); Councils' reports (third person) | +55.9 Confronting, unchanged | B9, C4, A8, C5, D4, E1 notes |
| CAN | Global Affairs Canada's news feed (75 items), the Prime Minister's RSS, searches of pm.gc.ca and canada.ca | none | Prime Minister's remarks of 22 September (no call); 7 October statements; Canada-Türkiye statement of 22 October (Gaza as a subject of cooperation); joint statement of 13 October on Palestinian elections (no Gaza); settlement-goods ban still a pledge on 28 October | +45.6 Confronting, unchanged | B9, C4, A6 notes |
| AUS | The Minister's media-release, transcript and speech lists (Wayback captures of 13 and 26 October), the Prime Minister's media page | `evt_2026_10_14_AUS_B9` (+2, joint leaders' statement with the King of Jordan) | Prime Minister's statement of 7 October (no call); Minister's interviews of 21 September and 9 October; joint statements of 9 and 13 October (ICC; Palestinian elections) | +32.6 Acting, unchanged (B9 at cap) | B9, A6, C5 notes |
| BEL | FPS Foreign Affairs search (Gaza, 4 pages), Wayback CDX listings of diplomatie.belgium.be, premier.be and prevot.belgium.be, searches | none | Belgian-Vietnamese joint statement of 24 October (no named signatory); FPS releases of 21 September and 20 October | +67.0 Confronting, unchanged | B9, A8, C4, E1, E3 notes; `data/leads/BEL.yaml` created (A8 royal decree of 18 January 2026, E3) |

Sources added (6): `src_20261027_officielebekendmakingen_ah-1275888`, `src_20260721_officielebekendmakingen_stb-2026-222`, `src_20261014_pm-gov-au_joint-statement-jordan`, `src_20260926_esteri_tajani-unga81-discorso`, `src_20260923_esteri_tajani-interviene-oggi-onu`, `src_20261007_governo-it_meloni-anniversario-7-ottobre`; and `src_20260718_news-belgium_projet-ar-colonies` (the draft royal decree of 18 July 2026, cited by the BEL C4 note; no event).

Not done: B-895. Findings that need an archived primary or the author: the Belgian Royal Decree of 18 January 2026 on overflight and technical stops (A8, about +5 for Belgium once archived; the Moniteur site's protection page blocks Save Page Now), the Belgian draft decree on settlement goods, the Belgian prosecutor's E1 and E3 matters (B-894). Flags for the author: B-893.

### T-F-W4: full-protocol wave NOR SWE DNK CHE AUT (docs/10 B-896 to B-899)

Window of 27 September to 9 November 2026, read on the Governments' and Parliaments' own sites and listings (routes in B-896); the General Debate statements of 2024 to 2026 from the P-16 list of the wave added. Every capture's replay was re-fetched and compared (bytes and SHA-256) with its index row. Preview scores are rc.1 with `--preview`, for reading only.

| Country | Routes read | New events | Seen and not filed | Preview score before and after | Assessments touched |
|---|---|---|---|---|---|
| NOR | Storting open data (604 written answers of the window, 8 pages with Gaza or Palestine read), norway.no statements, Wayback captures of regjeringen.no (Cloudflare check on the site), General Debate files of sessions 79 to 81 | `evt_2025_09_25_NOR_B9` (+5), `evt_2024_09_28_NOR_B9` (+2, decayed), `evt_2026_09_24_NOR_B9` (+2) | General Debate statement of 25 September 2026 (Palestine, not Gaza: R7); answers of 2 and 15 October, 19 October and 6 November 2026; the Minister's statements of 7 October, at the AHLC and at the Global Alliance (title only) | +47.9 Confronting, unchanged (B9 at cap) | B9, C4, C5, D4, D5, E1, E2, E3 notes |
| SWE | regeringen.se search with a date filter (13 terms), Riksdag open data and protocols 2026/27:7 to 9, swedenabroad.se, General Debate files of sessions 79 and 81 | none | General Debate statement of 25 September 2026 (Palestine in a list: R7); Prime Minister's replies of 20 October 2026 (general: R4); FAC release of 12 October; 26 September 2024 statement (decayed) | +33.3 Acting, unchanged | B9, B11, C1, E1, E3 notes |
| DNK | Ministry press room API (20 releases and 13 search terms), Prime Minister's speech of 6 October 2026, Folketing database, General Debate files of sessions 79 to 81 | none | General Debate statements of 2025 and 2026 (Permanent Representative: R3); opening speech (Middle East, not Gaza); answer to S 367 of 22 September 2026 (ft.dk blocked) | +29.3 Acting, unchanged | B9, A3, E1, E3 notes |
| CHE | news service feed (276 releases), Parliament OData (no business since 19 June), General Debate files of sessions 79 to 81 | none | the President's statements of 2024, 2025 and 2026 (no Gaza call in 2025 and 2026; a commitment to ceasefire resolutions in 2024, decayed) | +36.1 Acting, unchanged | B9, C5, E1, E3 notes; `lead_20261109_CHE_2` |
| AUT | the Ministry's press listing (28 releases of September to November), Chancellery sitemap, General Debate files of sessions 80 and 81 | `evt_2025_09_25_AUT_B9` (+2), `evt_2026_09_24_AUT_B9` (+2) | round table of 15 October 2026 and the State Secretaries' statements (R3) | +35.1 Acting, unchanged (B9 at cap) | B9, E1, E3 notes; `lead_20261109_AUT_1` |

Sources added (5): `src_20260924_un-gadebate_aut-meinl-reisinger-81-en`, `src_20250926_un-gadebate_aut-meinl-reisinger-80-en`, `src_20250926_un-gadebate_nor-eide-80-en`, `src_20240928_un-gadebate_nor-eide-79-en`, `src_20260924_regjeringen_norway-increases-support-palestine`.

Not done: B-899. Flags for the author: B-897 (the tiers of the two Austrian events and the Norwegian press release of 24 September 2026).

### T-F-W5: full-protocol wave SVN CZE HUN POL GRC (docs/10 B-905 to B-908)

Window of 27 September to 9 November 2026, read on the Governments' and Ministries' own listings (routes in B-905); the General Debate statements of sessions 79 to 81 from the P-16 lists added, and the experimental E1 to E3 entries re-searched. Every capture's replay was re-fetched and compared (bytes and SHA-256) with its index row. Preview scores are rc.1 with `--preview`, for reading only.

| Country | Routes read | New events | Seen and not filed | Preview score before and after | Assessments touched |
|---|---|---|---|---|---|
| SVN | GOV.SI news listing from 27 September to 8 November 2026 (728 items opened and filtered, 32 hits read), General Debate files of sessions 79 to 81 | `evt_2026_09_29_SVN_B10` (−5, the Prime Minister: under international law there is no genocide in Gaza; flagged, B-906 (3)) | General Debate statement of 24 September 2026 (no call), Embassy statement of 7 October 2026 (no speaker), Minister at the Foreign Affairs Council of 12 October, speech of 25 October | +38.3 Acting to +33.3 Acting | B9, B10, C5, E1, E2, E3 notes; `lead_20261109_SVN_1` |
| CZE | the Ministry's press releases of 9 October to 6 November 2026 and its statements listing, General Debate files of sessions 79 to 81, web search of mzv.gov.cz, vlada.gov.cz, hrad.cz | none | President Pavel's statements (no Gaza), Foreign Minister's 2026 statements known from search summaries only | −38.3 Enabling, unchanged | B9, C5, E1, E2, E3 notes; `lead_20261109_CZE_1`, `_2` |
| HUN | Wayback listing of kormany.hu/hirek from 27 September 2026 (343 addresses), General Debate file of session 81, police.hu releases of 2023 (E2) | `evt_2023_10_13_HUN_E2`, `evt_2023_10_18_HUN_E2`, `evt_2023_11_08_HUN_E2` (−5 each, unscored; flagged, B-906 (1)) | General Debate statement of 24 September 2026 (President Baka: the Middle East, Gaza not named) | −53.0 Sustaining, unchanged | B9, C5, E1, E2 (unchecked to has-events), E3 notes |
| POL | GOV.PL search API (35 terms, 100 items from 27 September 2026), General Debate files of sessions 79 to 81 (the 2025 scan by OCR), Warsaw court decision IV Ns 173/23 | none | Ministry statement on Taybeh of 18 October 2026 (no speaker), Mission at the Security Council of 15 October, President's statements (Middle East, Gaza not named) | +35.3 Acting, unchanged | B9, C5, E1, E2 (unchecked to none-found), E3 notes; `lead_20261109_POL_1`, `_2` |
| GRC | mfa.gr WordPress API through the browser pane (99 posts from 28 September to 5 November 2026), General Debate file and speaker page of session 81 | `evt_2026_09_24_GRC_B9` (+2), `evt_2026_10_07_GRC_B9` (+2) | Ministry announcement of 7 October 2026 (no speaker), interviews, Security Council statement of 29 October | +12.0 Acting, unchanged (B9 above its cap) | B9, C5, E1, E2 (unchecked to none-found), E3 notes; `lead_20261109_GRC_1`, `_2` |

Sources added (6): `src_20260924_un-gadebate_grc-mitsotakis-81-en`, `src_20261007_mfa-gr_gerapetritis-rubio-diloseis`, `src_20231013_police-hu_brfk-ujabb-betiltott-gyules`, `src_20231018_police-hu_brfk-terrorszervezet-mellett`, `src_20231108_police-hu_brfk-a-kozrend-vedelmeben`, `src_20260929_gov-si_pm-odgovori-poslanska-vprasanja`.

Not done: B-908. Flags for the author: B-906 (the three Hungarian E2 events, the Slovenian B10, the two Greek B9 events at +2).

### T-F-W6: full-protocol wave JPN KOR CHN RUS BRA (docs/10 B-909 to B-912)

Window of 27 September to 9 November 2026, read on the Governments' own lists and in the built-in browser where scripts are refused (routes in B-909); the P-16 items of the wave's P-D rows (B-335, B-338, B-345, B-350, B-355) and the P-23 item of T-F-W2 for Brazil added; the experimental E entries of the five searched. Every capture's replay was re-fetched with `curl --compressed` and compared (bytes and SHA-256) with its index row. Preview scores are rc.1 with `--preview`, for reading only.

| Country | Routes read | New events | Seen and not filed | Preview score before and after | Assessments touched |
|---|---|---|---|---|---|
| JPN | Foreign Minister's statements list, press-release index and Gaza page (browser), Kantei speech, statement and actions lists of September to November 2026 (browser), the Diet's minutes API (Gaza, window: no speech) | none | Message of 9 October 2026 on the ICC sanctions (no warrant, no Gaza act); Gaza items by officials who are not B9 speakers; policy speech of 5 October 2026 (Middle East only); the Foreign Minister's Diet speeches of February to July 2026 (policy statements; flagged, B-911 (3)) | +24.0 Acting, unchanged | B9, C5, E2 (unchecked to none-found) |
| KOR | MOFA English press releases, Ministry news, Minister's speeches, Korean press-release board (20 pages), General Debate page of session 81 | none | Spokesperson's commentaries on the Houthis; Special Representative at the Global Alliance meeting; President's General Debate statement (no Gaza) | +3.1 Acting, unchanged | B9, C5, E2 (unchecked to none-found) |
| CHN | Foreign Minister's activities list (14 pages), Ministry's documents list for Russia, General Debate page of session 81 | `evt_2026_05_20_CHN_B9` (+2, joint statement of the Heads of State with Russia) | Readouts of 15 October 2026 (Baku: President of Israel, Palestinian Foreign Minister; indirect speech); CICA initiative (no Gaza); Vice President's General Debate statement (not a B9 speaker); joint statements of 2024 and 2025 with Russia (no Gaza) | +27.1 to +29.1, Acting | B9; E1, E2, E3 (unchecked to none-found) |
| RUS | kremlin.ru search, en and ru (browser), General Debate page of session 81 | `evt_2026_05_20_RUS_B9` (+2, the same joint statement, from the Chinese Ministry's copy) | Valdai answer of 1 October 2026 (no call); Foreign Minister's General Debate statement of 26 September 2026 (no call in the UN summary; no Wayback capture) | +30.0 to +32.0, Acting | B9; E1, E2, E3 (unchecked to none-found) |
| BRA | Minister's speeches list and press notes Nos. 223 to 338 (browser; gov.br rate-limits scripts and the pane), Wayback CDX of gadebate.un.org, two speeches of 2025 already archived re-read | `evt_2026_09_22_BRA_B9` (+5, General Debate, B-355 (1)); `evt_2026_09_24_BRA_B9` (+2, IBSA ministers); `evt_2025_07_28_BRA_A6` (+10, standing: suspension of defence exports to Israel, flagged) | Note No. 318 of 19 October 2026 (unsigned, West Bank); four joint declarations of July and August 2026 (no Gaza); Planalto speeches of the window not reached (HTTP 429) | +41.3 to +51.3, Confronting | B9, A6 (to has-events), A7, B12, D5, E1, E2, E3 (unchecked to none-found); `data/leads/BRA.yaml` (B12 recall of 2024, E3 federal court order of 2024) |

Sources added (2): `src_20260922_un-gadebate_bra-lula-81-pt` (recorded from the Wayback capture of 11 October 2026), `src_20260520_mfa-cn_china-russia-joint-statement-2026`.

Not done: B-912. Flags for the author: B-910 (1) (the Brazilian A6: two official speeches state the suspension; no published decision; dated from 28 July 2025).

### T-F-W7: full-protocol wave COL CHL MEX BOL ARG (docs/10 B-913 to B-916)

Window of 27 September to 9 November 2026, read on the Governments' own lists (routes in B-914; the Chilean and Mexican sites through the built-in browser, which was closed afterwards); the P-16 items of the wave's P-D rows (B-360, B-365, B-370, B-375, B-380) and the experimental E entries of the five searched. Every capture's replay was re-fetched with `curl --compressed` and compared (bytes and SHA-256) with its index row. Preview scores are rc.1 with `--preview`, for reading only.

| Country | Routes read | New events | Seen and not filed | Preview score before and after | Assessments touched |
|---|---|---|---|---|---|
| COL | Ministry's news listing (pages 0 to 30), Ministry of Commerce's decree list of 2026 | `evt_2024_08_14_COL_A6` ended 13 October 2026 (Decree 1514 of 9 October 2026 repeals the coal export ban; B-913 (1)) | Withdrawal from the Hague Group (15 October), embassy in Jerusalem (14 October), visit of the Foreign Minister to Israel (16 October), restored visa exemption, cooperation in security and intelligence (no Gaza link); General Assembly address by the Vice President | +38.1 to +28.1, Acting (A: +10 to 0) | A5, A6, A8, B9, B10, B12, C1, C2; E1, E2, E3 (unchecked to none-found); `lead_20261109_COL_1` |
| CHL | Press-room listing (14 pages, built-in browser), President's General Debate file (Wayback copy) | none | Protest note of 28 September to Israel's ambassador (his remarks on Chilean politics); General Debate statement (no Gaza); press on defence dialogue with Israel | +52.3 Confronting, unchanged | A5, B9, B10, B12; E1, E2, E3 (unchecked to none-found); `lead_20261109_CHL_1`, `_2` |
| MEX | SRE listing (108 items) and 28 transcripts of the morning conference (built-in browser) | none | General Debate address of 25 September as the Ministry reports it (two-State solution, no Gaza); passing mention of Palestine on 28 September | +47.3 Confronting, unchanged | B9; E1, E2, E3 (unchecked to none-found) |
| BOL | Ministry's feeds (latest items and monthly feeds to 20 August 2026), site-search feeds | none | Exit from the Hague Group (March 2026, press); address of 24 September 2026 only as audio | +4.0 Acting, unchanged (passivity -15 stands) | A6, B9; E1, E2, E3 (unchecked to none-found) |
| ARG | Ministry's news listing (pages 0 to 6), Casa Rosada speeches (17 of 29 September to 6 November 2026), Ministry of Defence item | `evt_2026_10_06_ARG_C2` (-10, defence cooperation memorandum signed 6 October 2026; B-913 (2)) | President's speeches of 2 November and 15 October 2026 (Hamas and hostages, Gaza not named: B10 under the literal scope rule, flagged B-915 (1)); ICC communiqué of 21 November 2024 (unsigned, not B6) | -44.9 Enabling, unchanged (C at its cap) | A5, B6, B9, B10, C2; E1, E2, E3 (unchecked to none-found); `lead_20261109_ARG_1` |

Sources added (3): `src_20261009_mincit_decreto-1514-carbon-israel`, `src_20261013_mincit_decretos-2026`, `src_20261008_defensa-ar_memorandum-defensa-israel`.

Not done: B-916. Flags for the author: B-913 (1) (end date of the Colombian A6 from the Ministry's publication, the Diario Oficial's date not read), B-913 (2) (the Argentine defence memorandum as a fourth C2 event, no score effect), B-915 (1) (the Argentine B10 reading of the speeches of 2 November and 15 October 2026).

### T-F-W8: full-protocol wave SAU ARE QAT JOR MAR (docs/10 B-917 to B-920)

Window of 27 September to 9 November 2026, read on the Governments' own sites (routes in B-917; the Amiri Diwan through the built-in browser, which was closed afterwards), plus the joint statements that T-F-W1 and T-F-W2 left for this wave. Every capture's replay was re-fetched with `curl --compressed` and compared (bytes and SHA-256). The session's web searches stopped after six calls (the run's shared allowance was used up), so E1 and E3 stay unchecked (B-919).

| Country | Routes read | New events | Seen and not filed | Preview score before and after | Assessments touched |
|---|---|---|---|---|---|
| SAU | Saudi Press Agency search API (24 title terms) and item pages | West Bank statements of the eight ministers of 2 Jun, 23 Jul, 21 Aug, 9 Sep 2026 (+5 each, unscored); `evt_2026_10_23_SAU_B9` (+2, R4 Istanbul) | Crown Prince's Shura address of 30 Sep 2026 (lead, spa.gov.sa refuses Save Page Now); Human Rights Council statement by a director general; unsigned Ministry and Cabinet statements | +26 Acting, unchanged (B9 at cap) | header; E1, E3 notes (still unchecked); `lead_20261109_SAU_3` |
| ARE | Ministry news search (16 terms) | West Bank statements of the eight ministers (4 events, +5 each, unscored) | Unsigned statements of 29 Sep and 19 Oct; Foreign Minister's call with Israel's Foreign Minister of 30 Sep (no indicator act) | +22 Acting, unchanged | header; E1, E3 notes (still unchecked) |
| QAT | Ministry Statements listing (90 items), Prime Minister's speeches and press conferences, Amiri Diwan Speeches & Remarks (built-in browser) | `evt_2026_10_13_QAT_B9` (+5, the Amir: genocide in Gaza), `evt_2026_09_22_QAT_B9_2` (+5, the Amir at the General Assembly), `evt_2026_10_21_QAT_B9` (+2, France-Qatar joint statement), `evt_2026_08_03_QAT_B9` (+5), `evt_2026_08_20_QAT_B9` (+2), West Bank statements (4 events, unscored) | Unsigned Ministry statements; fourth Qatar-France strategic dialogue (no Gaza call) | +26 Acting, unchanged (B9 at cap) | header; E1, E3 notes (still unchecked); `lead_20260929_QAT_1` closed as promoted |
| JOR | King's official website (Press Room pages 0 to 5, Speeches) | `evt_2026_09_22_JOR_B9_2` (+5, the King at the General Assembly: field hospitals targeted), `evt_2026_10_14_JOR_B9` (+2, Australia-Jordan joint statement), West Bank statements (4 events, unscored) | Speech from the Throne of 2 Nov 2026 (no call, no named violation; flagged B-920 (3)) | +42 Confronting, unchanged (B9 at cap) | header; E1, E3 notes (still unchecked) |
| MAR | maroc.ma royal speeches and news; Wayback index of diplomatie.ma | none | Speech at the opening of Parliament of 9 Oct 2026 (no Gaza or Palestine) | +3 Acting, unchanged | header; E1, E3 notes (still unchecked); `lead_20260929_MAR_3` annotated |

Sources added (5): `src_20261021_mofa-qa_joint-statement-qatar-france-state-visit`, `src_20261013_diwan-gov-qa_amir-speech-shura-council-55`, `src_20260922_diwan-gov-qa_amir-speech-unga-81`, `src_20260922_kingabdullah-jo_unga-81-general-debate-address`, `src_20261014_kingabdullah-jo_jordan-australia-joint-statement`.

Not done: B-919 (E1 and E3 of the five; B8 for the five; Petra, WAM, the Qatari latest-news listing). Flags for the author: B-920 (1) to (5).

Resumed session (docs/10 B-921, B-922). R3 made the head of state a B9 speaker, so the King of Morocco's speeches and messages on maroc.ma (listings pages 0 to 6, from October 2023) were read; Morocco was the one country of the wave below the B9 cap. WebSearch was still unavailable (shared allowance used up), so E1 and E3 of the five stay unchecked.

| Country | Routes read | New events | Seen and not filed | Preview score before and after | Assessments touched |
|---|---|---|---|---|---|
| MAR | maroc.ma royal speeches and messages (French), every page from October 2023 | `evt_2023_11_29_MAR_B9` (+5), `evt_2024_05_04_MAR_B9` (+2), `evt_2024_05_16_MAR_B9` (+5), `evt_2024_11_26_MAR_B9` (+5), `evt_2025_05_17_MAR_B9` (+2), `evt_2025_11_25_MAR_B9` (+5): the King's messages to the UN Committee on Palestinian rights and addresses to the OIC and Arab League summits | Throne Day speech of 29 Jul 2024 (cessation of hostilities called a priority, not a call; flagged B-922 (4) (c)); Throne Day 2025 and 2026, openings of Parliament 2023 to 2026, Green March 2023 and 2024, address of 31 Oct 2025 (no Gaza) | +3 to +8 Acting (B9 +4.4 to +10, capped) | B9 note; header comment; E1, E3 notes (still unchecked) |
| JOR | Ministry of Foreign Affairs (www.mfa.gov.jo): Arabic news listing, item pages, site search | none | No Ministry copy of the ICC statement of 21 Nov 2024; `lead_20260929_JOR_1` kept open | +42 Confronting, unchanged | E1, E3 notes; `lead_20260929_JOR_1` annotated |
| SAU, ARE, QAT | none (no search allowance) | none | none | unchanged | E1, E3 notes |

Sources added (6): `src_20231129_maroc-ma_message-roi-comite-palestine`, `src_20240505_maroc-ma_discours-roi-sommet-oci-banjul`, `src_20240516_maroc-ma_discours-roi-sommet-arabe-manama`, `src_20241126_maroc-ma_message-roi-comite-palestine`, `src_20250517_maroc-ma_discours-roi-sommet-arabe-bagdad`, `src_20251125_maroc-ma_message-roi-comite-palestine`.

Still not done: E1 and E3 of the five (B-922 (1)); B8 for the five (B-919 (2)); the leads of B-922 (3); the other heads of state's statements before the window (B-921 (6)). Flags for the author: B-922 (4) (a) to (d).

Second resumed session, with web search (docs/10 B-949, B-950). E1 and E3 of the five filled after press and NGO searches in English and Arabic (French for Morocco), TRIAL International's UJAR 2026 and the prosecutors' sites (none answered); the none-found entries that the first Saudi session set without web search were re-run; an official copy found for one lead and archived for another; Qatar's 1988 recognition recorded. Every capture's replay was compared (bytes and SHA-256).

| Country | Routes read | New events | Seen and not filed | Preview score before and after | Assessments touched |
|---|---|---|---|---|---|
| SAU | Web search (English, Arabic); SPA API title search; UNISPAL document API; pp.gov.sa (refused) | none | Pilgrims' six-month residency of February 2024 (press only: `lead_20261109_SAU_4`, D5); A/78/846 signed by Saudi Arabia's Permanent Representative (B8 reading for the author, B-950 (1)) | +26 Acting, unchanged | E1, E3 none-found; A3, A6, A7, A8, B6, B7, B11, C4, C5, C6, D2, D5 re-run (statuses kept); B8 note |
| ARE | Web search (English, Arabic); UNISPAL document API; pp.gov.ae (339-byte page) | none | Hind Rajab Foundation's ICC complaint on a soldier in Dubai (an ICC filing) | +22 Acting, unchanged | E1, E3 none-found; B8 note |
| QAT | Web search (English, Arabic); UNISPAL document API; pp.gov.qa (refused) | none (recognition row `QAT,1988-11-16`, generated B8) | Qatar's ICC steps after the strike on Doha (an ICC proceeding) | +26 → +29 Acting | E1, E3 none-found; B8 has-events (no unchecked indicator left) |
| JOR | Web search (English, Arabic, restricted to mfa.gov.jo and petra.gov.jo); UNISPAL document API; jc.jo (refused) | `evt_2024_11_21_JOR_B5` (+8, standing: the ICC's decisions 'must be respected, and must be implemented') | Ministry item of 16 Nov 2023 on the energy-for-water agreement (archived, `lead_20260929_JOR_2` kept for the author's C1 reading); Jordan Bar Association's ICC complaint | +42 → +50 Confronting | B5 has-events; E1, E3 none-found; B8 note; `lead_20260929_JOR_1` promoted |
| MAR | Web search (English, Arabic, French); UNISPAL document API; pmp.ma (refused) | none | Complaints of 29 Jul 2024 (Israeli soldier) and 17 Feb 2025 (Israeli minister) before the Court of Appeal of Rabat, no record of acceptance (`lead_20261109_MAR_5`, E3); AMDH complaint on the ports (Sep 2025, title only) | +8 Acting, unchanged | E1, E3 none-found; B8 note |

Sources added (3): `src_19881214_un-unispal_qat-recognition-a-43-971`, `src_20241121_mfa-jo_safadi-borrell-icc-warrants`, `src_20231116_mfa-jo_water-for-energy-not-signed`.

Still not done: B8 of SAU, ARE, JOR and MAR (B-950 (1)); the leads of B-950 (5); heads of state before the window (B-950 (6)). Flags for the author: B-950 (1) to (4).

### T-F-W9: full-protocol wave IDN MYS DZA NGA AZE (docs/10 B-923 to B-926)

Window of 27 September to 9 November 2026, read on the Governments' own sites (routes in B-923; mfa.gov.az and president.az through the built-in browser, one tab, closed afterwards), plus the eight ministers' West Bank statements that T-F-W2 left for Indonesia. Every capture's replay was re-fetched and compared with its index row (bytes and SHA-256; the Algerian page with gzip decoding). WebSearch answered at the first call that the run's shared allowance was used up, so the press and NGO searches that E1 to E3 need could not be made (B-925).

| Country | Routes read | New events | Seen and not filed | Preview score before and after | Assessments touched |
|---|---|---|---|---|---|
| IDN | Ministry content API (Berita, 120 items to 23 Sep 2026; Daftar Joint Statement); Cabinet Secretariat search feed for Gaza | `evt_2026_10_11_IDN_B9` (+5, Egypt-Indonesia joint statement, west-bank, unscored); West Bank statements of the eight ministers of 2 Jun, 23 Jul, 21 Aug, 9 Sep 2026 (4 events, +5 each, unscored); `evt_2026_10_16_IDN_B9` actor corrected to Arrmanatha Nasir | The President's press statement with Egypt's President of 12 Oct 2026 (setkab.go.id; Save Page Now captured an F5 bot-check page, removed; no Wayback copy; B-924 (1)); Deputy Foreign Minister at the OIC Council in Baghdad, 17-18 Oct (not an R3 speaker); Foreign Minister on the Secretary-General's visit, 19 Oct (two-State solution only) | +34 Acting, unchanged (B9 at cap) | header; E1, E3 notes (still unchecked); leads 1 and 2 annotated |
| MYS | Ministry listings (Speeches & Statements; Press Releases and MFA News pages 1 to 4); Prime Minister's Office verbatim listings | `evt_2026_09_26_MYS_B9` (+5, Foreign Minister at the General Assembly: medics, aid workers and journalists killed in Gaza); `evt_2026_10_10_MYS_B9` (+2, Malaysia-Egypt joint statement: consolidate the ceasefire, unrestricted aid) | Ministry statement on Al-Aqsa of 30 Sep (unsigned); twelve ministers' statement of 21 Aug 2026 (Syria, no Gaza); Commonwealth intervention of 3 Nov (no Gaza); the Prime Minister's speech of 28 Oct (no Gaza act) | +31 Acting, unchanged (B9 at cap) | header; E1, E3 notes (still unchecked); lead 1 annotated |
| DZA | Ministry Arabic Statements (4 pages) and Communiqués (2 pages) | `evt_2026_10_08_DZA_B9` (+5, the Minister: 'the machine of extermination' in Gaza and the West Bank; flagged B-926 (2)) | Joint communiqué of 13 Oct (support for Palestine only); joint statement of 2 Nov (no Palestine); unsigned Ministry statements; the statement of 22 Sep 2026 has no text in its page data | +37 Acting, unchanged (B9 at cap) | header; E1 to E3 notes (still unchecked); lead 1 annotated |
| NGA | Ministry and State House REST APIs (all posts of the window; searches Gaza, Israel, Palestine, Rafah, Riyadh) | none | Ministry item on Jeddah of 28 Aug 2026 (reported speech, R4, already read in P-D) | −4 Passive, unchanged | header; E1 to E3 notes (still unchecked); leads 1 and 2 annotated |
| AZE | mfa.gov.az in the browser (Press Releases to No. 390/26 of 13 Oct, Statements, Meetings and phone calls, Interviews and speeches); president.az in the browser (Speeches, Interviews, Statements, Letters; three texts of the window) | none | Minister's meetings with a US envoy's adviser (6 Oct) and calls with Rubio (5 Oct): no Gaza passage; the President's speeches at the CICA summit (15 Oct), the Intercultural Dialogue forum (27 Oct) and the party congress (2 Oct: 'the Middle East' only) | −4 Passive, unchanged | header; E1 to E3 notes (still unchecked); lead 1 annotated |

Sources added (5): `src_20261011_kemlu_joint-statement-egypt-official-visit`, `src_20261013_kemlu_serah-terima-jabatan-menlu` (dates the change of Foreign Minister), `src_20260926_kln_fm-unga81-general-debate`, `src_20261010_kln_joint-statement-egypt-visit`, `src_20261008_mfa-dz_fm-diplomacy-day-un-81`. Failed and removed by exact id: `src_20261012_setkab_president-press-statement-egypt` (bot-check page).

Not done: B-925 (E1 to E3 of the five; B8 for MYS, NGA, AZE; the Malaysian King as head of state under R3; Algeria's Presidency site, which did not answer). Flags for the author: B-926 (1) to (5).

Second resumed session, with web search (docs/10 B-951, B-952). E1 to E3 of the five (E2 of DZA, NGA and AZE) filled after press and NGO searches in English and the official language (Indonesian, Malay, Arabic and French, Azerbaijani), TRIAL International's UJAR 2026 (no mention of the five) and the prosecutors' sites (none answered with a search). Web searches for the window returned nothing beyond the events already filed.

| Country | Routes read | New events | Seen and not filed | Preview score before and after | Assessments touched |
|---|---|---|---|---|---|
| IDN | Web search (English, Indonesian); kejaksaan.go.id (no answer); Wayback index of setkab.go.id (October to November 2026) | none | Complaints of 5 Feb and 29 Jul 2026 to the Attorney General's Office, under study, no inquiry opened (`lead_20261109_IDN_3`, E3); the Ministry's verification of a report naming Indonesia in an Israeli army document (not an investigation) | +34 Acting, unchanged | E1, E3 none-found |
| MYS | Web search (English, Malay); agc.gov.my (no press search) | none | Government's call of 28 May 2026 for an investigation of the treatment of Malaysian flotilla members (not a domestic complaint accepted) | +31 Acting, unchanged | E1, E3 none-found |
| DZA | Web search (English, French, Arabic); mjustice.dz and el-mouradia.dz (no answer) | none | Ministry of the Interior's answer of August 2025 to a request for a Gaza march in Algiers, indoor gatherings only (`lead_20261109_DZA_2`, E2); lawyers' complaint to the ICC (international) | +37 Acting, unchanged | E1, E2, E3 none-found |
| NGA | Web search (English); justice.gov.ng (no search) | none | Arrests and deaths at the Islamic Movement's Palestine processions in Abuja (2024 to 2026), the group proscribed since 2019 (not an E2 ban) | −4 Passive, unchanged | E1, E2, E3 none-found |
| AZE | Web search (English, Azerbaijani); genprosecutor.gov.az (redirects) | none | Police dispersals at the Israeli embassy in 2009, 2014 and 2018 (before the window) | −4 Passive, unchanged | E1, E2, E3 none-found |

Sources added: none (leads only). Still not done: B8 for MYS, NGA and AZE (B-860); the P-16 items of B-925 (4). Flags for the author: B-952 (1) to (3).

### T-F-METHOD: three methodology proposals (docs/10 B-2098 to B-2101)

Drafts for the author in `docs/proposals/`, in the format of the 1.0.0-rc.2 drafts; no methodology folder, pull request or Discussion. Measured on 2026-11-10 (rc.1) with `pnpm build:data` and `pnpm score`; the temporary edits used for the measurements were reverted before the commit.

| Proposal | File | Question | Options | Recommended default | Effect on 2026-11-10 |
|---|---|---|---|---|---|
| Scope of docs/02 §12 rule 8 | `docs/proposals/rule-8-scope.md` | Which countries must have no unchecked indicator before scores are shown | (a) all 193; (b) per country; (c) rule changed | (a), no version; P-22 gate widened from the 45; build check on `main` | 1 hand entry unchecked (BHR B12); 456 build entries in 154 countries, 37 after publication of the reviewed events, 31 after the six scope fixes (30 B8, BHR B12) |
| Article 19 in B1 | `docs/proposals/b1-article-19.md` | Does an absence of a state not entitled to vote score −2 | (a) keep −2; (b) 0 from a dated table; (c) keep −2, show the reason | (b) with (c) (differs from the T-P23-4 draft default (a) with (c)) | VEN −23 → −12, AFG −26 → −15, BOL −21 → −16, STP −26 → −22; ECU, SOM unchanged |
| A4 data-year gap | `docs/proposals/a4-data-years.md` | Are the orders of 2024 scored | (a) keep §5; (b) cumulative; (c) first release that reports the year; (d) two years per release | (c), each year's tier summed, one event per release (minor version) | SVK −18 → −28, AUT +7 → −3, AZE +1 → −9, KEN +1 → −4, LBR −13 → −15, PHL −4 → −6, USA unchanged |

Found on the way: the six hand `has-events` entries scoped `related` or `west-bank` (BFA, MLI, NER, NRU, VEN B6; SGP B11) are shown `unchecked` by the build (the B-860 (1) convention gap); scheduled in the P-23 block of `PROMPTS.md`. The A4 edit described in B-857 alone fails on the Philippines (two computed A4 events of one release overlap).

### T-F-V3: verification of the records of T-F-W1 to T-F-W9 and T-F-UNDOCS-1/2/3 (docs/10 B-2106, B-2107)

FINISH-PLAN.md Phase E, Task B2's checklist, by a fresh Opus 5.5 session on 2026-11-10. **Scope.** The records written or changed by the 21 commits of these task ids since `29dabb1` (a commit-by-commit diff of `data/`): 198 events (136 new, 62 changed), 445 evidence items, 47 leads (21 new, 26 annotated or closed), 1 recognition row (QAT) and 60 assessment entries whose status changed. The 45 full-protocol countries are below; the 31 light-protocol countries touched by T-F-UNDOCS-1 and T-F-UNDOCS-2 are in `docs/review/light-protocol.md` (Verification of 2026-11, second pass, T-F-V3).

**What was checked, and how.** (1) Quote at the locator: a script normalised each quote and its `archive/text/` file as the validator does and mapped the match to line numbers; every `line …` locator agrees, and so do the `row …`, `paragraph …` and `OCR line …` locators. (2) Captures: every source record equals its `archive/index.csv` row. The 122 distinct sources (cited by the events and recognition row, or added by these commits, the 18 Article 19 documents of T-F-UNDOCS-3 among them) were fetched again from their `wayback_url` with `curl --compressed`, one at a time, in three passes. 98 of the 122 replay equal to their records on 2026-11-10. The 24 others are listed in B-2107 (1): captures of 2026-11-09 that the Wayback Machine now answers with a 404 page or redirects to an earlier capture, and the Pakistani press release of 2026-11-04. The Wayback CDX API answered 'Temporarily Offline' during the session, so these sources were not re-archived. (3) Speaker and wording: every B9, B10 and B5 event read against R3 (heads of state as speakers, B-920), R4 and R7. (4) Date and tier read; the 39 D3 tiers of 2025 and the 20 states whose 2024 D3 event ends without a 2025 event checked by script against the 2025 and 2022 rows. (5) Scope tags and (6) French summaries read. (7) Leads: claims and sourcing read; 78 lead URLs fetched live. (8) Recognition row: the date found in the archived letter. (9) Assessments: each changed entry has its date, queries and pages read; no generated indicator hand-set (QAT B8 mirrors the new `recognitions.csv` row); no hand-researched indicator left `unchecked` in the 45. (10) T-F-UNDOCS-3: the twelve votes' counts re-added (30 not entitled, 188 non-vote, 218) and the letters in force re-read vote by vote; its 18 documents were replayed with the others.

**Result.** No invented quote, source, date or speaker. Fixed in place (French summaries): `evt_2026_10_21_FRA_B9`, `evt_2026_10_21_QAT_B9`, `evt_2024_11_21_JOR_B5`, `evt_2026_09_24_AUT_B9`. No event moved to leads; no status changed; `review.reviewed_by` not set; nothing published. Readings flagged for the author: B-2107 (1) to (7).

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index on 2026-11-10 | Leads new / annotated (source URLs live) | Recognition row | Assessment entries changed (unchecked left) | Findings and fixes |
|---|---|---|---|---|---|---|---|
| USA | 0 | 0: 0 / 0 | 0: 0 | 0 / 0 (no URL) | none added or changed | 0 (none) | No record of T-F-W1 in scope (the window's statements were read and not filed, B-880 ff.). No finding. |
| DEU | 0 | 0: 0 / 0 | 0: 0 | 0 / 0 (no URL) | none added or changed | 0 (none) | No 2025 D3 event: 2025 grand total USD 118,675,683 against USD 202,054,285 in 2022 (not above); the restored tier stays as filed (B-876). No finding. |
| GBR | 2 | 4: 4 / 4 | 3: 3 | 0 / 0 (no URL) | none added or changed | 0 (none) | evt_2025_12_31_GBR_D3 (+8) read: the 2025 grand total pledged is above the 2022 grand total, both figures in the quotes; the 2024 event ends on 2025-12-31. No other record. |
| FRA | 6 | 12: 12 / 12 | 8: 5 | 0 / 1 (1/1 answer 200) | none added or changed | 0 (none) | evt_2026_10_21_FRA_B9: French summary 'ont déclaré que toutes les parties doivent appliquer' changed to 'ont souligné, dans une déclaration conjointe, que toutes les parties devaient appliquer' (the English 'stressed'; reported speech). evt_2026_09_22_FRA_B9 rests on the speech as published by the French embassy in the DRC on the Ministry's domain and on UN News; the 27 September summary renders 'coupable au regard du droit international' as 'contrary to international law' (attributed, west-bank, unscored): kept. Three 2026-11-09 captures do not replay as recorded today (B-2107 (1)). evt_2025_12_31_FRA_D3 (+8) read: the 2025 grand total pledged is above the 2022 grand total, both figures in the quotes; the 2024 event ends on 2025-12-31. |
| ESP | 5 | 15: 15 / 15 | 6: 6 | 0 / 1 (2/2 answer 200) | none added or changed | 0 (none) | The leaders' statement is dated 16 May 2025 from its text ('May 16th, 2025'; page of 19 May): checked. evt_2025_12_31_ESP_D3 (+8) read: the 2025 grand total pledged is above the 2022 grand total, both figures in the quotes; the 2024 event ends on 2025-12-31. |
| IRL | 6 | 13: 13 / 13 | 7: 7 | 0 / 5 (9/9 answer 200) | none added or changed | 0 (none) | As Spain for the leaders' statement of 16 May 2025. evt_2026_10_12_IRL_B9: 'EU action on trade with settlements' is in line 7 of the source (checked). Five leads annotated by T-F-W2, URLs live. evt_2025_12_31_IRL_D3 (+8) read: the 2025 grand total pledged is above the 2022 grand total, both figures in the quotes; the 2024 event ends on 2025-12-31. |
| ZAF | 3 | 7: 7 / 7 | 4: 3 | 0 / 1 (1/2 answer 200; other: 404: 1) | none added or changed | 0 (none) | IBSA statement at +2 (flag B-889 (3)): kept. lead_20260928_ZAF_2's Armscor PDF answers 404 live; the Wayback CDX was offline during the session (look-up left to the next run). The IBSA capture (mea.gov.in, 2026-11-09) does not replay as recorded today (B-2107 (1)). evt_2025_12_31_ZAF_D3 (+8) read: the 2025 grand total pledged is above the 2022 grand total, both figures in the quotes; the 2024 event ends on 2025-12-31. |
| TUR | 8 | 17: 17 / 17 | 9: 7 | 0 / 1 (1/1 answer 200) | none added or changed | 0 (none) | Mediators' statements of 3 August (+5) and 20 August (+2, flag B-889 (2)) and the R4 statement read. The 2 June and 21 August 2026 statements' captures (mfa.gov.tr, 2026-11-09) do not replay as recorded today (B-2107 (1)); the 23 July and 9 September captures are equal. The 3 August capture replays 78 bytes more than recorded (B-2107 (1)). |
| EGY | 10 | 20: 20 / 20 | 10: 8 | 0 / 1 (1/2 answer 200; other: 403: 1) | none added or changed | 0 (none) | Ten B9 events: presidential statements of 5, 10 and 11 October (call tier, the 11 October +5 reading flagged by T-F-W2) and ministers' statements read against their quotes. The 2 June and 21 August 2026 statements' captures (mfa.gov.tr, 2026-11-09) do not replay as recorded today (B-2107 (1)); the 23 July and 9 September captures are equal. |
| IND | 2 | 5: 5 / 5 | 3: 2 | 0 / 0 (no URL) | none added or changed | 1 (none) | IBSA statement at +2 (flag B-889 (3)): kept. First D3 event (evt_2025_12_31_IND_D3, USD 5,147,799 against 5,000,000; narrow margin, flag B-877 (3)); D3 none-found to has-events. The IBSA capture does not replay as recorded today (B-2107 (1)). |
| ITA | 2 | 4: 4 / 4 | 3: 1 | 0 / 4 (5/6 answer 200; other: 406: 1) | none added or changed | 0 (none) | Both B9 events at the call tier, readings agree. The Tajani and Meloni captures (2026-11-09) do not replay as recorded today (404; same size, different hash) (B-2107 (1)). No D3 event for 2025 (not above 2022). |
| NLD | 3 | 6: 6 / 6 | 5: 3 | 0 / 0 (no URL) | none added or changed | 0 (none) | evt_2026_10_27_NLD_B9 (+2) and the C4 settlement ban with the Staatsblad decree added as evidence: quotes at locators. The two officielebekendmakingen captures (2026-11-09) do not replay as recorded today (B-2107 (1)). evt_2024_12_31_NLD_D3 ends on 2025-12-31: 2025 total USD 16,339,869 against 21,189,038 (flag B-877 (6)). |
| CAN | 2 | 4: 4 / 4 | 3: 3 | 0 / 0 (no URL) | none added or changed | 0 (none) | evt_2025_12_31_CAN_D3 (+8) read: the 2025 grand total pledged is above the 2022 grand total, both figures in the quotes; the 2024 event ends on 2025-12-31. Narrow margin (+5.7%, flag B-877 (3)). |
| AUS | 3 | 5: 5 / 5 | 4: 3 | 0 / 0 (no URL) | none added or changed | 0 (none) | evt_2026_10_14_AUS_B9 (+2) read with the Jordanian copy. The pm.gov.au capture (2026-11-09) replays the recorded size with a different hash today (B-2107 (1)). evt_2025_12_31_AUS_D3 (+8) read: the 2025 grand total pledged is above the 2022 grand total, both figures in the quotes; the 2024 event ends on 2025-12-31. (the restored tier of 15 March 2024 ends the same day). |
| BEL | 3 | 8: 8 / 8 | 5: 5 | 2 / 0 (4/4 answer 200) | none added or changed | 0 (none) | evt_2025_12_23_BEL_B3: three French quotes from the OCR text of the scanned declaration (English OCR model), found at OCR lines 242, 244 and 248; the event has no points_rationale field (older event, unchanged). Leads BEL_1 (Royal Decree, not archivable) and BEL_2 read. evt_2025_12_31_BEL_D3 (+8) read: the 2025 grand total pledged is above the 2022 grand total, both figures in the quotes; the 2024 event ends on 2025-12-31. Narrow margin (flag B-877 (3)). |
| NOR | 5 | 11: 11 / 11 | 7: 7 | 0 / 0 (no URL) | none added or changed | 0 (none) | Three B9 events from the General Debate files and the Ministry's release: tiers agree. evt_2025_12_31_NOR_D3 (+8) read: the 2025 grand total pledged is above the 2022 grand total, both figures in the quotes; the 2024 event ends on 2025-12-31. |
| SWE | 0 | 0: 0 / 0 | 0: 0 | 0 / 0 (no URL) | none added or changed | 0 (none) | No record in scope (no row in the 2025 table; D2 stays open, B-877 (7)). No finding. |
| DNK | 2 | 5: 5 / 5 | 4: 4 | 0 / 0 (no URL) | none added or changed | 0 (none) | evt_2025_12_31_DNK_D3 (+8) read: the 2025 grand total pledged is above the 2022 grand total, both figures in the quotes; the 2024 event ends on 2025-12-31. |
| CHE | 0 | 0: 0 / 0 | 0: 0 | 1 / 0 (1/1 answer 200) | none added or changed | 0 (none) | lead_20261109_CHE_2 (E3, the Foundation's post only) read. No 2025 D3 event (USD 17,327,689 against 25,534,028). No finding. |
| AUT | 2 | 4: 4 / 4 | 2: 2 | 1 / 0 (1/1 answer 200) | none added or changed | 0 (none) | evt_2026_09_24_AUT_B9: French summary given its articles ('le Hamas', 'l'armée israélienne') and shortened to 198 characters. evt_2025_09_25_AUT_B9 dated from the UN's page (file dated 26 September): checked. lead_20261109_AUT_1 read. |
| SVN | 3 | 7: 7 / 7 | 5: 4 | 1 / 0 (2/2 answer 200) | none added or changed | 1 (none) | evt_2026_09_29_SVN_B10: the first quote is the Prime Minister's direct speech in the Government's release; the gov.si capture (2026-11-09) does not replay as recorded today (B-2107 (1)). lead_20261109_SVN_1 read. evt_2025_12_31_SVN_D3 (+8) read: the 2025 grand total pledged is above the 2022 grand total, both figures in the quotes; the 2024 event ends on 2025-12-31. |
| CZE | 0 | 0: 0 / 0 | 0: 0 | 2 / 0 (2/2 answer 200) | none added or changed | 0 (none) | Two new E3 leads read; both name the soldier the Foundation accuses (B-2107 (5)). |
| HUN | 3 | 6: 6 / 6 | 3: 3 | 0 / 0 (no URL) | none added or changed | 1 (none) | Three E2 events from the Budapest police's prohibitions of October and November 2023 (lines 271 and 272): dates are the decisions' dates, scope gaza as for BGR E2; experimental, unscored. E2 unchecked to has-events. |
| POL | 2 | 5: 5 / 5 | 4: 4 | 2 / 0 (3/3 answer 200) | none added or changed | 1 (none) | E2 none-found with the Warsaw court decision read; leads POL_1 and POL_2 read. evt_2025_12_31_POL_D3 (+8) read: the 2025 grand total pledged is above the 2022 grand total, both figures in the quotes; the 2024 event ends on 2025-12-31. |
| GRC | 4 | 9: 9 / 9 | 6: 6 | 2 / 0 (2/2 answer 200) | none added or changed | 1 (none) | Two B9 events at the call tier: readings agree. E2 none-found. lead_20261109_GRC_1 names the soldier the Foundation accuses (B-2107 (5)). evt_2025_12_31_GRC_D3 (+8) read: the 2025 grand total pledged is above the 2022 grand total, both figures in the quotes; the 2024 event ends on 2025-12-31. |
| JPN | 1 | 2: 2 / 2 | 2: 2 | 0 / 0 (no URL) | none added or changed | 1 (none) | E2 none-found. evt_2024_12_31_JPN_D3 ends on 2025-12-31: 2025 total USD 28,256,437 against 30,152,202 in 2022 (flag B-877 (6)). |
| KOR | 2 | 4: 4 / 4 | 3: 3 | 0 / 0 (no URL) | none added or changed | 1 (none) | E2 none-found. evt_2025_12_31_KOR_D3 (+8) read: the 2025 grand total pledged is above the 2022 grand total, both figures in the quotes; the 2024 event ends on 2025-12-31. |
| CHN | 3 | 6: 6 / 6 | 4: 4 | 0 / 0 (no URL) | none added or changed | 3 (none) | evt_2026_05_20_CHN_B9 (+2, the China-Russia joint statement, Chinese text): reading agrees. E1 and E3 none-found notes name no query text (B-2107 (2)). evt_2025_12_31_CHN_D3 (+8) read: the 2025 grand total pledged is above the 2022 grand total, both figures in the quotes; the 2024 event ends on 2025-12-31. |
| RUS | 2 | 4: 4 / 4 | 3: 3 | 0 / 0 (no URL) | none added or changed | 4 (none) | evt_2026_05_20_RUS_B9 as China. E1 and E3 none-found notes name no query text (B-2107 (2)). First D3 event (USD 4,000,000 against 2,000,000); D3 none-found to has-events. |
| BRA | 5 | 12: 12 / 12 | 7: 6 | 2 / 0 (4/5 answer 200; other: 403: 1) | none added or changed | 4 (none) | evt_2025_07_28_BRA_A6 rests on two speeches stating the suspension (flag B-910 (1)); evt_2026_09_22_BRA_B9 (+5) and evt_2026_09_24_BRA_B9 (+2) read. evt_2025_09_17_BRA_B3: evidence unchanged by T-F-UNDOCS-1. Leads BRA_1 and BRA_2 read. evt_2024_12_31_BRA_D3 ends on 2025-12-31: the state has no row in the 2025 table, so no 2025 event (B-876 rule; flagged, B-2107 (3)). |
| COL | 2 | 8: 8 / 8 | 7: 7 | 1 / 0 (1/1 answer 200) | none added or changed | 3 (none) | evt_2024_08_14_COL_A6 end 2026-10-13 checked against the listing (line 3) and Article 4 of Decree 1514. Lead COL_1 read. evt_2024_12_31_COL_D3 ends on 2025-12-31: the state has no row in the 2025 table, so no 2025 event (B-876 rule; flagged, B-2107 (3)). |
| CHL | 2 | 4: 4 / 4 | 3: 3 | 2 / 0 (3/3 answer 200) | none added or changed | 3 (none) | CHL E1 none-found names no query text (B-2107 (2)); leads CHL_1 and CHL_2 read. evt_2025_12_31_CHL_D3 (+8) read: the 2025 grand total pledged is above the 2022 grand total, both figures in the quotes; the 2024 event ends on 2025-12-31. |
| MEX | 3 | 10: 10 / 10 | 7: 7 | 0 / 0 (no URL) | none added or changed | 3 (none) | evt_2024_05_24_MEX_B3: four quotes of the archived declaration at their paragraphs. E1 to E3 none-found. evt_2025_12_31_MEX_D3 (+8) read: the 2025 grand total pledged is above the 2022 grand total, both figures in the quotes; the 2024 event ends on 2025-12-31. |
| BOL | 1 | 5: 5 / 5 | 4: 4 | 0 / 0 (no URL) | none added or changed | 3 (none) | evt_2024_10_08_BOL_B3: declaration quotes at their paragraphs. BOL E2 none-found names no query text (B-2107 (2)). |
| ARG | 1 | 2: 2 / 2 | 1: 1 | 1 / 0 (2/2 answer 200) | none added or changed | 3 (none) | evt_2026_10_06_ARG_C2: 'el martes' before the page's stamp of 8 October 2026 is Tuesday 6 October 2026 (checked); the Minister of Defence and Israel's ambassador signed. ARG E1 none-found names no query text (B-2107 (2)). lead ARG_1 read. |
| SAU | 6 | 14: 14 / 14 | 7: 6 | 2 / 0 (2/2 answer 200) | none added or changed | 2 (none) | Five B9 events (four eight-minister statements, west-bank, unscored; R4 statement +2). Leads SAU_3 (not archivable) and SAU_4 (D5 reading for the author) read. E1 and E3 none-found with Arabic and English queries. The 2 June and 21 August 2026 statements' captures (mfa.gov.tr, 2026-11-09) do not replay as recorded today (B-2107 (1)); the 23 July and 9 September captures are equal. evt_2024_12_31_SAU_D3 ends on 2025-12-31: 2025 total USD 2,396,398 against 27,000,000. |
| ARE | 6 | 11: 11 / 11 | 6: 5 | 0 / 0 (no URL) | none added or changed | 2 (none) | Four eight-minister statements (west-bank, unscored). E1 and E3 none-found. The 2 June and 21 August 2026 statements' captures (mfa.gov.tr, 2026-11-09) do not replay as recorded today (B-2107 (1)); the 23 July and 9 September captures are equal. evt_2025_12_31_ARE_D3 (+8) read: the 2025 grand total pledged is above the 2022 grand total, both figures in the quotes; the 2024 event ends on 2025-12-31. |
| QAT | 10 | 23: 23 / 23 | 14: 9 | 0 / 1 (1/1 answer 200) | 1988-11-16 | 3 (none) | evt_2026_10_21_QAT_B9: French summary fixed as for France. Two B9 events on 22 September 2026 (ministers' statement +2; the Amir's General Debate speech +5): different speakers, kept and flagged (B-2107 (4)). Recognition row 1988-11-16 read in A/43/971 (the Council of Ministers' statement of 16 November 1988, transmitted by the Mission): a state document; B8 note mirrors the row. Two Diwan captures and the French joint-declaration capture (2026-11-09) do not replay as recorded today (B-2107 (1)). evt_2024_12_31_QAT_D3 ends on 2025-12-31: USD 10,000,000 against 10,500,000. |
| JOR | 9 | 21: 21 / 21 | 10: 9 | 0 / 2 (2/3 answer 200; other: 403: 1) | none added or changed | 3 (none) | evt_2024_11_21_JOR_B5: French summary in the tense of reported speech; the Ministry's item gives Safadi's words partly in direct quotation (B5, so R4 does not apply); first replay timed out, the second was equal. Two B9 events on 22 September 2026 (ministers +2; the King +5): kept and flagged (B-2107 (4)). The 2 June and 21 August 2026 statements' captures (mfa.gov.tr, 2026-11-09) do not replay as recorded today (B-2107 (1)); the 23 July and 9 September captures are equal. evt_2025_12_31_JOR_D3 (+8) read: the 2025 grand total pledged is above the 2022 grand total, both figures in the quotes; the 2024 event ends on 2025-12-31. |
| MAR | 6 | 16: 16 / 16 | 6: 4 | 1 / 1 (3/4 answer 200; other: 403: 1) | none added or changed | 2 (none) | Six B9 events of the King (head of state, R3 per B-920): tiers read (+5 for 29 Nov 2023, 16 May 2024, 26 Nov 2024, 25 Nov 2025; +2 for 4 May 2024 and 17 May 2025). Two maroc.ma captures (2026-11-09) do not replay as recorded today (B-2107 (1)). Lead MAR_5 read. |
| IDN | 8 | 18: 18 / 18 | 9: 8 | 1 / 2 (6/7 answer 200; other: 403: 1) | none added or changed | 2 (none) | evt_2026_10_16_IDN_B9: actor Arrmanatha Nasir, Foreign Minister from 12 October 2026 per T-F-W9's archived source: kept. evt_2026_10_11_IDN_B9 west-bank only (R7 reading, flagged by T-F-W9): kept. The 2 June and 21 August 2026 statements' captures (mfa.gov.tr, 2026-11-09) do not replay as recorded today (B-2107 (1)); the 23 July and 9 September captures are equal. evt_2025_12_31_IDN_D3 (+8) read: the 2025 grand total pledged is above the 2022 grand total, both figures in the quotes; the 2024 event ends on 2025-12-31. |
| MYS | 4 | 11: 11 / 11 | 5: 5 | 0 / 1 (2/2 answer 200) | none added or changed | 2 (none) | evt_2026_09_26_MYS_B9 (+5, 'slaughtered', flagged) and evt_2026_10_10_MYS_B9 (+2) read; quotes are line fragments of the PDF text, each verbatim. evt_2025_12_31_MYS_D3 (+8) read: the 2025 grand total pledged is above the 2022 grand total, both figures in the quotes; the 2024 event ends on 2025-12-31. |
| DZA | 3 | 6: 6 / 6 | 4: 4 | 1 / 1 (2/3 answer 200; other: 403: 1) | none added or changed | 4 (none) | evt_2026_10_08_DZA_B9: the speech is in the first person (page marks of the transcript); the +5 rests on 'آلة الإبادة', which the summary does not name (flag of T-F-W9, B-2107 (6)). evt_2024_11_21_DZA_B5 (Ministry statement; Algeria not a party): kept as flagged. Lead DZA_2 read. evt_2024_12_31_DZA_D3 ends on 2025-12-31: the state has no row in the 2025 table, so no 2025 event (B-876 rule; flagged, B-2107 (3)). |
| NGA | 0 | 0: 0 / 0 | 0: 0 | 0 / 2 (2/6 answer 200; other: 403: 3, 000: 1) | none added or changed | 3 (none) | No event. E1 to E3 none-found with English queries; two leads annotated (three press URLs answer 403, one timed out). |
| AZE | 0 | 0: 0 / 0 | 0: 0 | 0 / 1 (1/1 answer 200) | none added or changed | 3 (none) | No event. E1 to E3 none-found with English and Azerbaijani queries; lead AZE_1 annotated. |

### T-F-CHECKUP: the author's list after the finish plan (docs/10 B-2108)

`CHECKUP.md` updated on `main` (`32fe6f1`) and merged into `data/phase1`; HANDOFF.md Part 2.0 and FINISH-PLAN.md Part 1 updated. Counts read from the files on `data/phase1` on 2026-11-10, not copied from the reports:

| Measure | 2026-11-08 (FINISH-PLAN Part 1) | 2026-11-10 |
|---|---|---|
| Hand events (files) | 1,236 (139) | 1,421 (146) |
| `reviewed` / `draft` / `published` | 1,235 / 1 / 0 | 1,420 / 1 / 0 |
| Leads (files) | 236 (106) | 323 (134) |
| Assessment entries `unchecked`, all indicators | 1,908 | 123 (A1 45, A4 45, B8 30, A2 1, C3 1, B12 1) |
| Hand-researched entries `unchecked` | 1,285 scored + E1–E3 | 1 (BHR B12) |
| `none-found` / `has-events` / `no-data` / `not-applicable`, all indicators | 3,386 / 792 / 313 / 163 | 5,126 / 832 / 318 / 163 |
| Source records / `archive/index.csv` rows / `recognitions.csv` rows | not counted / not counted / not counted | 2,295 / 2,354 / 64 |
| `pnpm validate` | 0 errors, 1,198 warnings | 0 errors, 1,164 warnings |

What CHECKUP.md now holds: the three proposals of T-F-METHOD with their defaults (§2a); B8 for 30 states and eleven new cross-country readings (§2b); §2e with every reading flagged by T-F-UNDOCS-1/2/3, T-F-W1 to T-F-W9, T-F-L01 to T-F-L25 and T-F-V1 to T-F-V3, each with its B-id and default; PR #16 and the Wayback check of 2026-11-08 (§5); the flip gate under the rule 8 decision (§6); the gaps left (§7). Data change: the headers (comments) of `data/events/QAT.yaml` and `data/events/JOR.yaml` brought into line with R3 (B-2107 (4)); no event changed.

### T-F-FINAL (2026-11-10)

Final hygiene on `data/phase1` (`7846db8`): lint, typecheck, tests, `pnpm validate` (0 errors, 1,164 warnings), `pnpm build:data:check` (1,928 files, 153,851,631 bytes, identical) and `pnpm build` pass. PR #11's description now holds the preview table of 2026-11-10 for all 193 countries. Decisions: docs/10 B-2109.

| Item | Value |
|---|---|
| Events `reviewed` / `draft` / country files | 1,420 / 1 / 146 |
| Leads / source records / `archive/index.csv` rows | 323 / 2,295 / 2,354 |
| Unchecked entries (countries) | 123 (68) |
| Preview bands | Sustaining 4, Enabling 23, Passive 42, Acting 102, Confronting 22 |
| Secrets in history (by key name, values not printed) | none |

## 12. P-23 pre-launch pass, T-G-HOUSE (2026-11-10)

| Item | Result | B-id |
|---|---|---|
| BFA B6, MLI B6, NER B6, NRU B6, VEN B6, SGP B11 | `has-events` set to `none-found`; event ids and reason in each note; events unchanged | B-2111 (1) |
| Soldiers' names in CZE leads 1 and 2, GRC lead 1, CZE, GRC and MAR assessment notes | Replaced by "an Israeli soldier"; URLs unchanged; three NGO page titles shortened | B-2111 (2) |
| `pnpm validate` | 0 errors, 1,158 warnings | |

### T-G-WAYBACK (2026-11-10)

Second check of the archived copies on `data/phase1` (workflow run 42839581858, issue #14), and the failing rows requested again by hand. Decisions: docs/10 B-2112. List: `docs/review/wayback-check-2026-11-10.tsv`.

| Item | 2026-11-08 (B-872) | 2026-11-10 |
|---|---|---|
| Recorded `id_` URLs requested | 2,107 | 2,318 |
| Answered 200 with the recorded SHA-256 | 1,562 | 2,196 |
| Did not answer 200 | 545 | 122 (121 sources) |
| Answered 200 with other bytes | 1 | 0 |
| Of the 121 sources, replay by hand (`curl -L --compressed`, two passes) | | 58 match; 48 answer 404 or 403; 15 serve other bytes at another snapshot |
| 24 sources of T-F-V3 | 24 flagged | 1 replays, 16 answer 404 or 403, 7 serve other bytes |
| KEN and GHA lead sources | do not replay | both replay |
| Re-captured with Save Page Now | | none; wait for the workflow used 2 h 20 min of 180 |
| `archive/text/`, `archive/index.csv`, recorded hashes | | unchanged |

Issue #14 stays open (63 rows do not replay).

### T-G-B8 (2026-11-10)

Recognition rows for the states without one, and BHR B12 retried. Decisions: docs/10 B-2115, B-2116. A/78/846-S/2024/283 is now archived (`src_20240409_un-unispal_a-78-846-recognition-annex`). Every row precedes 2023-10-07 and gives the pre-existing B8 tier (+3); no score depends on the day.

| State | Row | Source | Basis | Flag |
|---|---|---|---|---|
| SAU | 1988-11-16 | A/78/846 | Signed by Saudi Arabia's Permanent Representative (Arab Group chair) | B-950 (1) default |
| POL | 1988-12-14 | Ministry text 2025 + A/78/846 | Year 1988 from the Ministry, day from A/78/846 | R21, day from registry |
| ROU | 1988-11-24 | Conference statement July 2025 + A/78/846 | Year 1988 | R21, day from registry |
| BGR | 1988-11-25 | Conference statement 30 July 2025 + A/78/846 | Year 1988 | R21, day from registry |
| KGZ | 1995-11-01 | Conference statement 30 July 2025 + A/78/846 | Among recognising states; relations 1995 | R21, month from registry |
| GTM | 2013-04-08 | Conference statement 30 July 2025 | "reconoció oficialmente a Palestina el 8 de abril de 2013" | Registry 9 April |
| KAZ | 1992-04-06 | Ministry item 28 April 2022 + A/78/846 | Relations, April 1992 | R21, relations, day from registry |
| UZB | 1994-09-25 | Ministry list of diplomatic relations | State of Palestine, exchange of notes | R21, relations |
| TKM | 1992-04-17 | Ministry of Health item 20 August 2025 | Relations with the State of Palestine | R21, relations |
| TJK | 1992-03-06 | Khovar (state agency) citing the Ministry, 2020 | Relations | R21, relations; registry 2 April 1994 |
| LAO | 1989-05-15 | KPL (state agency), 22 April 2026 | Relations | R21, relations; registry 2 December 1988 |
| GRD | 2013-09-27 | NV/2013/83, Joint Communiqué | Relations with the State of Palestine | R21, relations; registry 25 September 2011 |
| BLR, BRN, CRI, DMA, KHM, LBY, NIC, PHL, PRK, SVK, UKR, VUT, SDN | A/78/846 dates | A/78/846 only | No state document with a date found | CHECKUP §2b default, R21 |
| ARE, AZE, EGY, JOR, MAR, MYS, NGA | none | | Full protocol: B8 only from the state's own document (rule 4) | Unchecked, author |
| HUN | none | | The Prime Minister doubts the recognition (B-316) | none-found, author |
| CZE | none | | The Ministry denies a recognition (B-310) | none-found |
| BHR B12 | unchanged | | bna.bh bot check, 405 and 403; Wayback captures 403 | Unchecked, author (B-2098) |

Counts: `recognitions.csv` 64 → 89 rows; B8 without a row and unchecked 30 → 7. `pnpm validate`: 0 errors.

### T-G-JOINT (2026-11-10)

Joint statements of 22 September and 16 October 2026, and visa-exemption and labour-mobility instruments with Israel (C2, R18). Decisions: docs/10 B-2117, B-2118.

| Item | Result | B-id |
|---|---|---|
| Statement of 22 September 2026 (eight foreign ministers) | All eight signatories already filed (B-855); own copies of TUR, ARE and QAT archived and added as evidence; EGY, IDN, JOR, SAU own copies not found (noted in the events) | B-2117 (1), (2), (3) |
| Statement of 16 October 2026 (Colombia's embassy in Jerusalem) | All nineteen scored signatories already filed (DJI, KWT, LBN, SDN, SYR, YEM by T-F-UNDOCS-1, B-875 (3)); own copies of TUR and QAT archived and added; Qatar's copy lists eighteen states | B-2117 (1), (2) |
| KAZ C2: memorandum of intent on visa exemption, 27 January 2026 | Filed `evt_2026_01_27_KAZ_C2_3` (−10, confirmed, flagged); no score effect (C at −20 cap) | B-2118 (1), default |
| WSM C2: visa waiver | Signed 2019, in force 6 July 2023 (Government's page): before the window, no event; B-703 (3) closed | B-2118 (2) |
| LKA C2: agricultural workers arrangement, 6 November 2023 | Implementing plan of the 2020 agreement (Cabinet decision): not filed (R18); the December 2025 event and IND's labour protocols flagged | B-2118 (3), author |
| THA, VNM, MDA, TON C2 | No new instrument (THA quota memorandum disputed by the Israeli Embassy's page; VNM agreement unsigned; MDA extension; TON 2010) | B-2118 (4)–(7) |
| Israel's treaty database (gov.il) | Cloudflare block and human-verification page; not passed | B-2118 |
| `pnpm validate` | 0 errors | |

### T-G-BLOCKED (2026-11-10)

Documents on blocked or unarchivable hosts (CHECKUP §2e and §7). Decisions: docs/10 B-2119 to B-2127. No human check or CAPTCHA was passed or clicked.

| Document | Routes tried | Result | B-id |
|---|---|---|---|
| BEL Royal Decree of 18 January 2026 (A8) | ELI `/justel` and `/moniteur` (Save Page Now captures the F5 protection page); `mobilit.belgium.be` (human check); MFA news pages of January 2026; web searches FR, NL, EN; Wayback CDX of `mopdf/2026/01/22_1.pdf` | **Archived** from the PDF capture of 24 January 2026 (bytes equal to today's PDF; the capture of 2026-10-03 is a CAPTCHA page); decree inside the 200 KB text kept. **Filed** `evt_2026_01_22_BEL_A8` (+5, confirmed); BEL +67 → +72 (Confronting, no band change); `lead_20261109_BEL_1` promoted; new `lead_20261110_BEL_3` (Liège seizure, press) | B-2119 |
| BRA ICJ declaration, case 192 (B3 direction) | ICJ file (two Wayback captures, both 403); UNISPAL media API and guessed addresses (404); web searches PT | Declaration still unread; Itamaraty press note no. 336 of 23 July 2025 **archived** and added to `evt_2025_09_17_BRA_B3` as Brazil's stated purpose | B-2120 |
| A/79/572-S/2024/802 | UN Digital Library PDF (Save Page Now 202, then 401) | **Archived** from UNISPAL's HTML copy; nothing filed (B-953 default); KAZ_2 and KGZ_2 leads updated | B-2121 |
| C.N.378.2026 (NRU withdrawal from the Rome Statute) | treaties.un.org English and French PDFs (served to a script; Save Page Now 403); availability API (none); CDX offline; web search | Not archived; NRU B6 note updated | B-2122 |
| SAU Shura address of 30 September 2026 (spa.gov.sa) | Arabic web search | **Archived** from Umm Al-Qura, the official gazette (uqn.gov.sa); **filed** `evt_2026_09_30_SAU_B9` (+2; B9 at cap, no score effect); `lead_20261109_SAU_3` promoted | B-2123 |
| DNK answer to S 367 (ft.dk) | oda.ft.dk (Sag 105888, Dokument 1230891, file URL found); the PDF (Cloudflare 403); Save Page Now (403); availability API (none) | Not read, not archived; DNK B9 note updated | B-2125 |
| primeminister.gr | Availability API for the two pages cited as not archived | **Archived** two interviews (17 September 2025, 28 May 2024) from Wayback captures; GRC A6, B4, B10, C1 notes cite them; no event (interviews, B-325 (4)) | B-2124 |
| gadebate.un.org, 81st session (leads PHL_1, SMR_2, IRN_2, LBY_2, CUB_2; also BLR, BLZ, PNG, SLB, PRK, SUR, NRU, TJK named in leads) | CDX listing of `gastatements/81/` (45 files with 200 captures, none of these states); availability API; Save Page Now (405); A/81/PV not yet on documents.un.org; PHL: dfa.gov.ph (Cloudflare), un.int mission page (nothing after May 2025), two web searches; SMR: one web search | None archived; the five leads record the date and routes | B-2126 |
| `pnpm validate` | | 0 errors | |

### T-G-LEADS-1: leads of AFG to CHL, full-protocol countries (2026-11-10)

P-23 lead pass (CHECKUP §7). Decisions: docs/10 B-2128 to B-2134. Every open lead carries a dated note with the searches made; the light-protocol rows are in `docs/review/light-protocol.md` ("P-23 pass of 2026-11-10"). No human check or CAPTCHA was passed; the SVVK-ASIR terms-of-use page was not accepted.

| Country | Lead | Indicator | Result | Event or note | Score effect (preview) |
|---|---|---|---|---|---|
| ARE | ARE_2 | A5 | Ministry's statement of 8 September 2026 archived (`src_20260908_mofa-ae_statement-media-reporting`): intelligence "has been and continues to be communicated"; not related to the Gaza campaign | Not filed; A5 note extended; author's reading (B-2128) | None |
| ARE | ARE_3 | E2 | Press and NGO only | Kept open | None (unscored) |
| ARG | ARG_1 | E3 | Press and NGO only | Kept open | None (unscored) |
| AUT | AUT_1 | E3 | Press only | Kept open | None (unscored) |
| AZE | AZE_1 | C2 | **Protocol of the 4th Joint Commission meeting** signed in Israel, State Tax Service item of 20 November 2025, from its Wayback capture | **Filed** `evt_2025_11_20_AZE_C2` (−10, confirmed, flagged R18); lead promoted (B-2130) | None (C at −20 cap; −4, Passive) |
| BEL | BEL_2 | E3 | Not searched again (om-mp.be protection page) | Kept open | None (unscored) |
| BEL | BEL_3 | A8 | Liège seizure, March 2026: press and NGO only | Kept open | None |
| BEL | BEL_4 (new) | A8 | **Walloon ministerial decree of 27 May 2024** banning arms transit to Israel through the Walloon airports, archived from Justel; **annulled** by the Council of State, judgment no 263.167 of 29 April 2025 (archived) | **Filed** `evt_2024_05_27_BEL_A8` (+5, confirmed); lead recorded and promoted (B-2131, B-2133) | None (decayed; +72, Confronting) |
| BRA | BRA_1 | B12 | Decree of 28 May 2024 in the Diário Oficial (press); DOU viewer asks for a captcha field | Kept open | At most +0.7 (B at +44.3 of +45) |
| BRA | BRA_2 | E3 | Press only (case under seal) | Kept open | None (unscored) |
| CHE | CHE_1 | C5 | SVVK-ASIR list (conduct-based exclusion of Bank Hapoalim and Bank Leumi, no reason or date) and PUBLICA's ESG page archived | Not a fund decision citing Gaza; C5 none-found (B-2129) | None |
| CHE | CHE_2 | E3 | No Office of the Attorney General communication | Kept open | None (unscored) |
| CHL | CHL_1 | E3 | No Fiscalía communication | Kept open | None (unscored) |
| CHL | CHL_2 | E3 | Court of Appeals annulled the refusal; hearing 12 June 2026 (press) | Kept open | None (unscored) |

`pnpm validate`: 0 errors.

### T-G-LEADS-2: leads of CIV to EST, full-protocol countries (2026-11-10)

P-23 lead pass (CHECKUP §7). Decisions: docs/10 B-2135 to B-2139. Every open lead of COL, CZE, DEU, DZA, EGY and ESP carries a dated note with the searches made; the light-protocol rows are in `docs/review/light-protocol.md` ("P-23 pass of 2026-11-10"). No human check or CAPTCHA was passed.

| Country | Lead | Indicator | Result | Event or note | Score effect (preview) |
|---|---|---|---|---|---|
| COL | COL_1 | E3 | No Fiscalía communication | Kept open | None (unscored) |
| CZE | CZE_1, CZE_2 | E3 | No Czech prosecution or court communication | Kept open | None (unscored) |
| DEU | DEU_1 | B6 | **Chancellor's answer of 14 May 2025** in the Government's transcript (question on the warrant; "Grundsätzlich muss ein israelischer Premierminister nach Deutschland reisen können") archived | **Filed** `evt_2025_05_14_DEU_B6` (−10, confirmed); lead promoted; author's reading (B-2136) | −10 |
| DEU | DEU_2 | A3 | **Federal Ministry of Defence**: "Rheinmetall fertigt die Rumpfmittelteile" (18 September 2026) and the Weeze industrial agreement of August 2023 (19th armaments report), both archived | **Filed** `evt_2023_10_07_DEU_A3` (−15, confirmed, dated as Finland's); lead promoted; author's reading (B-2138) | −15; with DEU_1: **−4 → −29, Passive → Enabling** |
| DEU | DEU_3 | B5 | Press only; would be superseded by the B6 position of 14 May 2025 | Kept open | None |
| DZA | DZA_1 | D4 | Decayed; not searched again | Kept open | None |
| DZA | DZA_2 | E2 | Press only (the letter not found) | Kept open | None (unscored) |
| EGY | EGY_1 | A5 | Ministry of Transport statement in press copies only; no transit record | Kept open | None |
| EGY | EGY_2 | B12 | Press: ambassador Hazem Khairat appointed in June 2026 (no decree found) | Kept open; B12 note extended | None |
| EGY | EGY_3 | E2 | Rights groups and wires only | Kept open | None (unscored) |
| ESP | ESP_1 | A8 | Press only; Marianne Danica still reported | Kept open | None (decayed) |
| ESP | ESP_2 | B11 | No listing decision | Kept open | None (west-bank) |
| ESP | ESP_3 | B12 | Real Decreto 195/2026 (dismissal only); the Ministry's ambassadors page lists Tel Aviv with no name | Kept open | None (B at its +45 cap) |
| ESP | ESP_4 | C6 | Press on the IMI termination (29 September 2025) and conflicting reports on Spike and SILAM | Kept open (author's reading) | None |
| ESP | ESP_5 | D5 | No instrument; fourth evacuation (press) | Kept open | None |
| ESP | ESP_6 | A2 | Generated indicator; not searched | Kept open | None |
| ESP | ESP_7 | E3 | Extension to torture in press only | Kept open (author's reading) | None (unscored) |
| ESP | ESP_8 | A5 | Author's reading; not searched again | Kept open | None |
| ESP | ESP_9 | A3 | No document naming a Spanish supplier | Kept open | None |

`pnpm validate`: 0 errors.

### T-G-LEADS-3: leads of ETH to IRL, full-protocol countries (2026-11-10)

P-23 lead pass (CHECKUP §7). Decisions: docs/10 B-2140 to B-2142. Every open lead of FRA, GBR, GRC, IDN, IND and IRL carries a dated note with the searches made; the light-protocol rows are in `docs/review/light-protocol.md` ("P-23 pass of 2026-11-10"). No human check or CAPTCHA was passed (oireachtas.ie's human check was not used; the Official Report's records on data.oireachtas.ie were read instead).

| Country | Lead | Indicator | Result | Event or note | Score effect (preview) |
|---|---|---|---|---|---|
| FRA | FRA_1 | E1 | No PNAT communiqué (AFP-based press only) | Kept open | None (unscored) |
| FRA | FRA_2 | B6 | Overflights; standing position of 27 Nov 2024 filed; not searched again | Kept open | None |
| FRA | FRA_3 | A5 | Outside A5 and A8; A2 generated; not searched again | Kept open | None |
| FRA | FRA_5 | C6 | Trade-fair measure, outside every indicator; not searched again | Kept open (author's consideration) | None |
| FRA | FRA_6 | E3 | No PNAT communiqué; second inquiry of 1 July 2026 (press) | Kept open (author's reading of category E) | None (unscored) |
| GBR | GBR_1 | B5 | Hansard API: urgent question of 25 Nov 2024 answered by an Under-Secretary (not a B5 speaker); no PM, Foreign or Justice Secretary statement | Kept open | None |
| GBR | GBR_2 | A5 | Hansard: Armed Forces Minister's debate of 18 Mar 2025; no other intelligence sharing confirmed | Kept open | None |
| GBR | GBR_3 | E1 | No Met Police or CPS statement on the referral (PILC and press on the July 2026 reversal) | Kept open | None (unscored) |
| GRC | GRC_1, GRC_2 | E3 | No Greek prosecutor's or court's document | Kept open | None (unscored) |
| IDN | IDN_1 | B5 | Ministry statement of 23 Nov 2024 was a post on X; no copy on kemlu.go.id | Kept open (author's reading, B-411 (2)) | None |
| IDN | IDN_2 | D4 | No record of patients from Gaza received | Kept open | None |
| IDN | IDN_3 | E3 | No inquiry or investigation opened; kejaksaan.go.id did not answer | Kept open | None (unscored) |
| IND | IND_1, IND_2, IND_4 | A1, A2 | Generated indicators; not searched again | Kept open | None |
| IND | IND_3 | A2 | Amnesty report rests on HS 93 data (already in A2); no dual-code row | Kept open | None |
| IND | IND_5 | E2 | Court and police orders not readable without the case-status form; later permission of 20 Aug 2025 (press) | Kept open | None (unscored) |
| IRL | IRL_1 | B5 | **Justice Minister's written answer of 13 Feb 2025** (procedure under the ICC Act 2006) archived | Kept open; event stays corroborated; author's reading (B-2140 (3)) | None (B clipped at +45) |
| IRL | IRL_2 | B11 | **Justice Minister's written answer of 16 Jun 2026**: "I instructed Immigration officers to refuse entry" to Ben-Gvir and Smotrich, archived | `evt_2026_06_05_IRL_B11` raised to **confirmed**; lead promoted (B-2140 (2)) | None (B clipped at +45) |
| IRL | IRL_3 | A5 | Transport Minister's answers (one refusal in 2025; examination ongoing); no authorised flight named | Kept open | None |
| IRL | IRL_4 | A6 | Enterprise Minister's answers: 15 licences issued, 2 refused in 2025, case by case | Kept open | None |
| IRL | IRL_5 | D5 | About forty written questions on study visas; no legal instrument | Kept open | None |
| IRL | IRL_6 | B9 | **Taoiseach's 81st-session statement** from the Wayback capture of the gadebate file, archived | **Filed** `evt_2026_09_24_IRL_B9` (+5, confirmed); lead promoted; author's reading of the tier (B-2140 (1)) | None (B9 at cap; IRL +59) |

`pnpm validate`: 0 errors.

### T-G-LEADS-4: leads of IRN to LSO, full-protocol countries (2026-11-10)

P-23 lead pass (CHECKUP §7). Decisions: docs/10 B-2143, B-2144. Every open lead of ITA and JOR carries a dated note with the searches made; the light-protocol rows are in `docs/review/light-protocol.md` ("P-23 pass of 2026-11-10"). No human check or CAPTCHA was passed (esteri.it's Radware check was not used).

| Country | Lead | Indicator | Result | Event or note | Score effect (preview) |
|---|---|---|---|---|---|
| ITA | ITA_2 (2026-09-28) | B6 | **Foreign Minister at question time, 27 Nov 2024** (Chamber sitting 388, page 67) archived: Italy 'rispetta gli obblighi' and examines 'la prevalenza del diritto internazionale generale sulle immunità'; Senate question time of 30 Jul 2026 not found | Kept open; B5 note extended; not filed (author's reading, B-2143 (2)) | None now; +8 if read as B5 |
| ITA | ITA_1 (2026-09-30) | A8 | Not searched again (local shareholders, not the state) | Kept open | None |
| ITA | ITA_2 (2026-09-30) | B6 | **Government's written answer of 11 Dec 2025** to 4-06146 (Allegato B, sitting 582), signed by an Under-Secretary, archived: overflight authorised by the military authority; execution only on a formal request; hindering the visit 'non è nell'interesse dell'Italia' | Kept open; B6 note extended; not filed (author's reading, B-2143 (1)) | None now; −10 (ITA +12.6 → +2.6) if read as B6 |
| ITA | ITA_3 (2026-09-30) | E2 | TAR Lazio monocratic decree refusing interim suspension (press); neither the Questura's order nor the decree found | Kept open | None (unscored) |
| JOR | JOR_2 | C1 | Not searched again (Ministry text archived; author's reading) | Kept open | None |
| JOR | JOR_3 | C2 | Press only: extension request (2024), Israel's refusal to renew (July 2026) | Kept open (extension of a 2021 arrangement) | None |
| JOR | JOR_4 | E2 | No Interior Ministry or Public Security decision found | Kept open | None (unscored) |
| JOR | JOR_5 | A5 | Not searched again (author's reading) | Kept open | None |

`pnpm validate`: 0 errors.

### T-G-LEADS-5: leads of LTU to NZL, full-protocol countries (2026-11-11)

P-23 lead pass (CHECKUP §7). Decisions: docs/10 B-2145 to B-2147. Every open lead of MAR, MYS and NGA carries a dated note with the searches made; the light-protocol rows are in `docs/review/light-protocol.md` ("P-23 pass of 2026-11-10"). No human check or CAPTCHA was passed.

| Country | Lead | Indicator | Result | Event or note | Score effect (preview) |
|---|---|---|---|---|---|
| MAR | MAR_1 | A5 | **AFRICOM release of 12 May 2025** (Israel among the participating nations of African Lion 25) archived from its Wayback capture; a US document naming no Israeli unit | Kept open; A5 note extended; not filed (author's reading, B-403 (4), B-2146 (2)) | None |
| MAR | MAR_2 | A5 | Press only (Le Desk, Hespress on the port's statement); no authorisation or parliamentary answer | Kept open | None |
| MAR | MAR_3 | D4 | Press only: an FAR detachment at the Force's headquarters in Kiryat Gat; no record of a field hospital operating in Gaza | Kept open | None |
| MAR | MAR_4 | E2 | No decree, order or judgment found | Kept open | None (unscored) |
| MAR | MAR_5 | E3 | Filing reported; no prosecutor's decision found (soldier's name not recorded) | Kept open | None (unscored) |
| MYS | MYS_1 | B5 | Press and RTM reports of the Prime Minister's remarks of 22 Nov 2024; no transcript or official video | Kept open | None |
| NGA | NGA_1 | B9 | Press only; no State House text (730 days old on 11 Nov 2026) | Kept open | None |
| NGA | NGA_2 | B9 | Press only; no Ministry text (expired) | Kept open | None |

`pnpm validate`: 0 errors.

### T-G-LEADS-6: leads of PAK to SEN, full-protocol countries (2026-11-11)

P-23 lead pass (CHECKUP §7). Decisions: docs/10 B-2148 to B-2150. Every open lead of POL and SAU carries a dated note with the searches made; QAT has no open lead (`lead_20260929_QAT_1` promoted earlier); the light-protocol rows are in `docs/review/light-protocol.md` ("P-23 pass of 2026-11-10"). No human check or CAPTCHA was passed.

| Country | Lead | Indicator | Result | Event or note | Score effect (preview) |
|---|---|---|---|---|---|
| POL | POL_1 | E2 | Helsinki Foundation's amicus opinion (NGO) gives the Mayor's decision number; the Court lifted the ban on 16 Nov 2023 (press); no City or Court document naming the purpose | Kept open; E2 note extended | None (unscored) |
| POL | POL_2 | E3 | Press and the Foundation's pages on the Wrocław filing; no prosecutor's decision | Kept open | None (unscored) |
| POL | POL_3 (new) | E3 | Nomada (NGO): the Kielce District Prosecutor's Office confirmed an investigation in rem (art. 118, 118a) on the MSPO complaint of 3 Sep 2025; no prosecutor's communication found | New lead; E3 stays none-found (B-2149 (1)) | None (unscored) |
| SAU | SAU_1 | A5 | Press only; no official Saudi confirmation of interceptions for Israel | Kept open | None |
| SAU | SAU_2 | E2 | NGO and press reports of sentences not concerning Gaza; no decree or record | Kept open | None (unscored) |
| SAU | SAU_4 | D5 | Gulf News and a travel blog only; no Passports or SPA announcement | Kept open | None |

`pnpm validate`: 0 errors.

### T-G-LEADS-7: leads of SGP to TUN, full-protocol countries (2026-11-11)

P-23 lead pass (CHECKUP §7). Decisions: docs/10 B-2151, B-2152. SVN is the only full-protocol country of the card; its one open lead carries a dated note with the searches made; the light-protocol rows are in `docs/review/light-protocol.md` ("P-23 pass of 2026-11-10"). No human check or CAPTCHA was passed.

| Country | Lead | Indicator | Result | Event or note | Score effect (preview) |
|---|---|---|---|---|---|
| SVN | SVN_1 | E3 | The Foundation's page and the press on the complaint of 7 Sep 2026 to the Ljubljana District State Prosecutor's Office; no prosecutor's or court communication | Kept open | None (unscored) |

`pnpm validate`: 0 errors.

### T-G-LEADS-8: leads of TUR to ZWE, full-protocol countries (2026-11-11)

P-23 lead pass (CHECKUP §7). Decisions: docs/10 B-2153, B-2154. Every open lead of TUR, USA and ZAF carries a dated note with the searches made (`lead_20260928_ZAF_1` was already dropped as resolved); the light-protocol rows are in `docs/review/light-protocol.md` ("P-23 pass of 2026-11-10"). No human check or CAPTCHA was passed.

| Country | Lead | Indicator | Result | Event or note | Score effect (preview) |
|---|---|---|---|---|---|
| TUR | TUR_1 | B12 | Press only (Takvim, Milli Gazete, BirGün); no Ministry announcement or Official Gazette act downgrading relations | Kept open | None |
| TUR | TUR_2 | E3 | Press reports the prosecutors' **indictment of 35 suspects** and its acceptance by a court (NTV, CNN Türk, 10 Apr 2026); istanbul.adalet.gov.tr releases end Sep 2024; adalet.gov.tr archive search script-rendered; posts on x.com | Kept open; TUR E3 note updated (B-2153 (4)) | None (unscored) |
| TUR | TUR_3 | A8 | No circular, harbour-master notice or Ministry release (press of Aug 2025 only) | Kept open | None |
| USA | USA_1 | A5 | Press only; defense.gov release index Nov 2023 to Feb 2024 has no release on the flights (one Ryder statement, on Red Hill) | Kept open | None |
| USA | USA_2 | E2 | Not searched again (visa revocations are not a ban) | Kept open | None (unscored) |
| ZAF | ZAF_2 | A6 | gov.za: the Deputy Minister's presentation of the NCACC's 2025 reports denies arms sales to Israel; no decision suspending licences | Kept open (B-2153 (5)) | None |
| ZAF | ZAF_3 | A8 | Bogotá statement archived (DIRCO); no instrument, port notice or refused vessel | Kept open | None |
| ZAF | ZAF_4 | E1 | Press: Hawks say the investigation is ongoing; no Hawks or NPA statement, no charge | Kept open | None (unscored) |

`pnpm validate`: 0 errors.

### T-G-RS-1: re-search of none-found entries where events are plausible, full-protocol countries (2026-11-11)

P-23 re-search (CHECKUP §2b, B-2105 (a)). Decisions: docs/10 B-2155, B-2156. The light-protocol rows (IRQ, KWT, LBN, OMN, SYR, IRN, SRB, MNE, BHR) are in `docs/review/light-protocol.md` ("P-23 pass of 2026-11-10"). No human check or CAPTCHA was passed; no capture was made.

| Country | Entries | Primary sources tried | Result | Status | Score effect (preview) |
|---|---|---|---|---|---|
| SAU | C5, C6 | pif.gov.sa (403); sama.gov.sa, hassanainvestment.com, lcgpa.gov.sa (no answer); mof.gov.sa tenders-law page (404) | PIF's sales of US holdings (2025, market reasons); regional-headquarters procurement rule and its Etimad exemptions; GCC secondary boycott unenforced since 1994 | none-found kept | None |
| ARE | C5, C6 | adia.ae, mubadala.com, adq.ae, mof.gov.ae federal procurement page (read) | Boycott law repealed in 2020 (before the window); ADNOC-NewMed deal paused (not a fund exclusion); **Israeli defence firms barred from the Dubai Airshow 2025** (press only): not C6 by default, **new lead** `lead_20261111_ARE_4` (B-2155 (4)) | none-found kept (reading flagged) | None |
| QAT | C5, C6 | qia.qa and its Sustainability page, monaqasat.mof.gov.qa (home, ESG, tenders law; read); mof.gov.qa (403) | MOFA statements welcoming other states' settlement-goods bans; no fund or procurement exclusion | none-found kept | None |

`pnpm validate`: 0 errors.
