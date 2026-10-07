# P-21 light protocol: the description of the review (PR #11)

The P-21 sessions (PROMPTS.md "P-21", three countries per session) do not open one pull request each. Every session commits to `data/phase1` and appends its summary here, so that the author reviews the whole dataset in PR #11 (docs/10 B-500). Each section has a table of the events the session filed (event id, indicator, date, points, confidence, the kind of the first source), then, per country, the assessment counts and the 90-minute stop note. Every event is at status `reviewed`; none is published, and no `review.reviewed_by` is set. Scores quoted are `pnpm score --preview` figures on the unpublished events and are provisional.

## T-P21-01: NZL, KAZ, KGZ (2026-10-05)

Light protocol (docs/06 §5) for New Zealand, Kazakhstan and Kyrgyzstan. 19 events: 13 for New Zealand, 5 for Kazakhstan, 1 for Kyrgyzstan. Decisions and flags are in docs/10 B-500 to B-507.

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2023_12_12_NZL_B9 | B9 | 2023-12-12 | +2 | confirmed | official |
| evt_2023_12_31_NZL_D3 | D3 | 2023-12-31 to 2024-12-31 | +8 | confirmed | dataset |
| evt_2024_02_14_NZL_B9 | B9 | 2024-02-14 | +2 | confirmed | official |
| evt_2024_02_29_NZL_B11 | B11 | 2024-02-29 (west-bank, unscored) | +5 | confirmed | official |
| evt_2024_04_08_NZL_B9 | B9 | 2024-04-08 | +5 | confirmed | official |
| evt_2024_05_07_NZL_B9 | B9 | 2024-05-07 | +2 | confirmed | official |
| evt_2024_07_26_NZL_B9 | B9 | 2024-07-26 | +2 | confirmed | official |
| evt_2024_12_02_NZL_B5 | B5 | 2024-12-02 | +8 | confirmed | official |
| evt_2024_12_31_NZL_D3 | D3 | 2024-12-31 | +8 | confirmed | dataset |
| evt_2025_06_10_NZL_B11 | B11 | 2025-06-10 | +10 | confirmed | official |
| evt_2025_07_21_NZL_B9 | B9 | 2025-07-21 | +5 | confirmed | official |
| evt_2025_08_09_NZL_B9 | B9 | 2025-08-09 | +2 | confirmed | official |
| evt_2025_09_26_NZL_B9 | B9 | 2025-09-26 | +2 | confirmed | official |
| evt_2023_12_31_KAZ_D3 | D3 | 2023-12-31 to 2024-12-31 | +8 | confirmed | dataset |
| evt_2024_12_31_KAZ_D3 | D3 | 2024-12-31 | +8 | confirmed | dataset |
| evt_2025_09_23_KAZ_B9 | B9 | 2025-09-23 | +2 | confirmed | official |
| evt_2026_01_27_KAZ_C2 | C2 | 2026-01-27 | −10 | corroborated | press |
| evt_2026_01_27_KAZ_C2_2 | C2 | 2026-01-27 | −10 | corroborated | press |
| evt_2025_09_23_KGZ_B9 | B9 | 2025-09-23 | +5 | confirmed | official |

Points are the tier points before decay and weights. B1, D1 and the other generated indicators are left to the build.

### New Zealand

Assessments (34 indicators): has-events 6 (B1, B5, B9, B11, D1, D3), none-found 16, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 9 (A3, A5, A7, A8, C2, C6 and the three experimental E1 to E3). Leads: 1 (`lead_20261005_NZL_1`, B9). Sources read: the Ministry's page with its frequently asked questions (archived), the Beehive releases and transcripts (through Wayback captures), the General Debate statements, and the joint statements already archived for the 45 (7 of them name New Zealand). The EU Council listings do not apply. 90-minute stop note: the work finished inside the budget (about 45 minutes in all for the three countries, 25 of them on New Zealand); nothing was cut for time except what the protocol does not search (A3, A5, A7, A8, C2, C6).

### Kazakhstan

Assessments: has-events 5 (B1, B9, C2, D1, D3), none-found 13, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 13 (A3, A5 to A8, B8, C1, C4 to C6, E1 to E3). Leads: 1 (`lead_20261005_KAZ_1`, C2 and D4, D5 notes). Joint statements: none of the statements already archived names Kazakhstan. 90-minute stop note: finished inside the budget (about 10 minutes on Kazakhstan). The Ministry's releases cannot be archived as text (B-501): the C2 events rest on two press reports at `corroborated`.

### Kyrgyzstan

Assessments: has-events 2 (B1, B9), none-found 16, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 13 (A3, A5 to A8, B8, C1, C4 to C6, E1 to E3). Leads: 1 (`lead_20261005_KGZ_1`, B9). Joint statements: none of the statements already archived names Kyrgyzstan. 90-minute stop note: finished inside the budget (about 8 minutes on Kyrgyzstan). Neither the Ministry's site (HTTP 502 to scripted requests) nor the President's site (script-loaded) could be read directly.

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-10-05 (methodology 1.0.0-rc.1), the 19 reviewed events scored as if published; before them the generated indicators alone gave +3 (Acting) for each of the three countries.

| Country | Before (generated only) | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| NZL | +3 | +37 | Acting | B5 +8, B11 +10, D3 +8, B9 +7.9 (the statements of 2025), passivity penalty (−15) applied: no qualifying event in the last 365 days |
| KAZ | +3 | +14 | Acting | C2 −14 (two events at weight 0.7), D3 +8, B9 +2.0; the C2 events are qualifying, so the passivity penalty (−15) no longer applies |
| KGZ | +3 | +7 | Acting | B9 +4.9, passivity penalty (−15) still applied |

No band changes. One reading to note for the author: Kazakhstan's two C2 events (−14 in all) end its passivity penalty (+15), so the score with them is 1 point above the score without them (B-504 (2)).

## T-P21-02: TJK, TKM, UZB (2026-10-05)

Light protocol (docs/06 §5) for Tajikistan, Turkmenistan and Uzbekistan. 8 events: 3 for Tajikistan, none for Turkmenistan, 5 for Uzbekistan. Decisions and flags are in docs/10 B-508 to B-514.

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2024_09_24_TJK_B9 | B9 | 2024-09-24 | +2 | confirmed | official |
| evt_2025_09_18_TJK_C2 | C2 | 2025-09-18 | −10 | confirmed | official |
| evt_2025_09_23_TJK_B9 | B9 | 2025-09-23 | +2 | confirmed | official |
| evt_2023_11_03_UZB_B9 | B9 | 2023-11-03 | +2 | confirmed | official |
| evt_2023_12_31_UZB_D3 | D3 | 2023-12-31 to 2024-12-31 | +8 | confirmed | dataset |
| evt_2024_11_11_UZB_B9 | B9 | 2024-11-11 | +2 | confirmed | official |
| evt_2025_07_04_UZB_B9 | B9 | 2025-07-04 | +2 | confirmed | official |
| evt_2025_09_23_UZB_B9 | B9 | 2025-09-23 | +2 | confirmed | official |

Points are the tier points before decay and weights. B1, D1 and the other generated indicators are left to the build.

### Tajikistan

Assessments (34 indicators): has-events 3 (B1, B9, C2), none-found 16, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 12 (A3, A5 to A8, B8, C4 to C6 and the three experimental E1 to E3). Leads: 2 (`lead_20261005_TJK_1`, B9; `lead_20261005_TJK_2`, B5). Sources read: the Ministry's English pages (news, statements of 2025 and 2026, the President's speeches), the General Debate statements of the 79th and 80th sessions, the UN's transcript of the 81st session's Day 5 sitting, the Israeli Government's news item on the tourism visit. The EU Council listings do not apply and no archived joint statement names Tajikistan. 90-minute stop note: finished inside the budget (about 30 minutes on Tajikistan). The Foreign Minister's call for a lasting ceasefire at the 81st session (26 September 2026) is in the UN's transcript, which the archiver truncates before that passage, and the Ministry's own page is a summary without it: a lead, not an event (B-509).

### Turkmenistan

Assessments: has-events 1 (B1), none-found 18, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 12 (A3, A5 to A8, B8, C4 to C6, E1 to E3). Leads: 1 (`lead_20261005_TKM_1`, B9). No event: the General Debate statements read (the Foreign Minister's of 2024, the President's of 2025) have no passage on Gaza, and the Ministry's statements of 2026 concern Iran. No archived joint statement names Turkmenistan; the EU Council listings do not apply. 90-minute stop note: finished inside the budget (about 12 minutes on Turkmenistan).

### Uzbekistan

Assessments: has-events 4 (B1, B9, D1, D3), none-found 15, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 12 (A3, A5 to A8, B8, C4 to C6, E1 to E3). Leads: 2 (`lead_20261005_UZB_1`, B6; `lead_20261005_UZB_2`, D4). No archived joint statement names Uzbekistan; the EU Council listings do not apply. 90-minute stop note: finished inside the budget (about 25 minutes on Uzbekistan). The President's site publishes the full English texts of his addresses, which is why four of the five events rest on it.

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-10-05 (methodology 1.0.0-rc.1), the 8 reviewed events scored as if published; before them the generated indicators alone gave +3 (Acting) for Tajikistan and Uzbekistan and −2 (Passive) for Turkmenistan.

| Country | Before (generated only) | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| TJK | +3 | −5 | Passive | C2 −10, B9 +2.0 (the statement of 2025; that of 2024 has decayed to zero), passivity penalty (−15) applied: no qualifying event in the last 365 days |
| TKM | −2 | −2 | Passive | no event; the passivity penalty (−15) applies |
| UZB | +3 | +7 | Acting | B9 +4.2 (2024, July and September 2025), D3 ended on 2024-12-31 and no longer counts, passivity penalty (−15) applied |

One band change: Tajikistan moves from Acting to Passive on the C2 event. Two unfiled items would each end a passivity penalty: the Tajik Foreign Minister's statement of 26 September 2026 (a lead, +2 and a qualifying event: the score would be about +12) and, for Uzbekistan, nothing found within 365 days that meets the evidence rule. Read critically (docs/06 §4 step 7): no cap is hit; the bands rest on one tourism instrument for Tajikistan (B-510 (2)).

## T-P21-03: MNG, PRK, BGR (2026-10-05)

Light protocol (docs/06 §5) for Mongolia, the Democratic People's Republic of Korea and Bulgaria. 8 events: none for Mongolia, none for the DPRK, 8 for Bulgaria. Decisions and flags are in docs/10 B-515 to B-522.

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2023_12_31_BGR_D3 | D3 | 2023-12-31 to 2024-12-31 | +8 | confirmed | dataset |
| evt_2024_02_19_BGR_B9 | B9 | 2024-02-19 | +2 | confirmed | official |
| evt_2024_04_19_BGR_B11 | B11 | 2024-04-19 (west-bank, unscored) | +5 | confirmed | official |
| evt_2024_06_06_BGR_B9 | B9 | 2024-06-06 | +2 | confirmed | official |
| evt_2024_07_15_BGR_B11 | B11 | 2024-07-15 | +5 | confirmed | official |
| evt_2024_09_25_BGR_B9 | B9 | 2024-09-25 | +2 | confirmed | official |
| evt_2025_09_26_BGR_B9 | B9 | 2025-09-26 | +2 | confirmed | official |
| evt_2026_05_28_BGR_B11 | B11 | 2026-05-28 | +5 (adds no points beside the 2024 listing) | confirmed | official |

Points are the tier points before decay and weights. B1, D1 and the other generated indicators are left to the build.

### Mongolia

Assessments (34 indicators): has-events 1 (B1), none-found 18, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 12 (A3, A5 to A8, B8, C4 to C6 and the three experimental E1 to E3). Leads: none. Sources read: the President's General Debate statements of the 79th and 80th sessions (archived; no passage on Gaza, Palestine or the Middle East), the generated events and tables, UNRWA's donor tables (no row), web searches in English and Mongolian per indicator group. The Ministry's own pages could not be read (the site redirects to a Government-portal page that answers 404, B-515 (2)). The EU Council listings do not apply and no archived joint statement names Mongolia. 90-minute stop note: finished inside the budget (about 5 minutes on Mongolia).

### Democratic People's Republic of Korea

Assessments: has-events 1 (B1), none-found 18, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 12 (A3, A5 to A8, B8, C4 to C6, E1 to E3). Leads: 1 (`lead_20261005_PRK_1`, B9). No event: the DPRK's words on Gaza come from its General Debate delegation (an Ambassador in 2024, a Vice Foreign Minister in 2025), the Foreign Ministry's unnamed spokesperson and remarks attributed to Kim Jong Un, none a B9 speaker with a named, exact-words statement (R3, R4; B-518). Both General Debate texts are archived (the 2025 one in Korean). No archived joint statement names the DPRK; the EU Council listings do not apply. 90-minute stop note: finished inside the budget (about 5 minutes on the DPRK); KCNA's own archive cannot be searched by a script, so a statement of the Foreign Minister herself, if one exists, was not found.

### Bulgaria

Assessments: has-events 5 (B1, B9, B11, D1, D3), none-found 14, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 9 (A3, A5 to A8, B8, C4 to C6; E1 to E3 experimental). Leads: 4 (`lead_20261005_BGR_1`, B6; `_2`, B10; `_3`, C2; `_4`, B9). Sources read: the Ministry of Foreign Affairs' releases (through Wayback captures: the site answers a scripted request with a bot check), the Council of Ministers' release on the visit of November 2023 (archived), the General Debate statements of the 78th to 80th sessions, the two joint statements already archived that name Bulgaria (19 February and 6 June 2024), the Council's three settler listings (R8), UNRWA's donor tables and web searches in English and Bulgarian per indicator group. 90-minute stop note: finished inside the budget (about 15 minutes on Bulgaria). Not filed and why: B10 for the Prime Minister's visit of 6 November 2023 (the "full support" wording is the release's own, R4), B5/B6 for the Ministry's criticism of the ICC warrants (no position on executing them, no named speaker), C2 for a health cooperation plan of November 2024 (implements an existing agreement, R18).

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-10-05 (methodology 1.0.0-rc.1), the 8 reviewed events scored as if published; before them the generated indicators alone gave −11 (Passive) for Bulgaria and +3 (Acting) for Mongolia and the DPRK.

| Country | Before (generated only) | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| MNG | +3 | +3 | Acting | no event |
| PRK | +3 | +3 | Acting | no event |
| BGR | −11 | +11 | Acting | B11 +5.0 (listing of 15 July 2024), B9 +2.0 (statement of 2025), B1 +3.6; the passivity penalty (−15) no longer applies, the Council's listing of 28 May 2026 being a qualifying event |

One band change: Bulgaria moves from Passive to Acting. Without the 28 May 2026 listing, which adds no points (one event per tier), the penalty would apply and the score would be −4 (Passive): the band rests on the EU listings counted under R8, as it does for the 15 EU members among the 45 (B-446). No cap is hit.

## T-P21-04: BLR, MDA, ROU (2026-10-05)

Light protocol (docs/06 §5) for Belarus, the Republic of Moldova and Romania. 15 events: none for Belarus, 4 for Moldova, 11 for Romania. Decisions and flags are in docs/10 B-523 to B-531.

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2024_03_20_MDA_C2 | C2 | 2024-03-20 | −10 | confirmed | official |
| evt_2025_05_28_MDA_C2 | C2 | 2025-05-28 | −10 | confirmed | official |
| evt_2025_09_03_MDA_C2 | C2 | 2025-09-03 | −10 | confirmed | official |
| evt_2026_09_09_MDA_C2 | C2 | 2026-09-09 | −10 | confirmed | official |
| evt_2023_12_31_ROU_D3 | D3 | 2023-12-31 to 2024-01-29 | +8 | confirmed | dataset |
| evt_2024_01_29_ROU_D2 | D2 | 2024-01-29 to 2024-07-19 | −10 | corroborated | press |
| evt_2024_02_19_ROU_B9 | B9 | 2024-02-19 | +2 | confirmed | official |
| evt_2024_04_19_ROU_B11 | B11 | 2024-04-19 (west-bank, unscored) | +5 | confirmed | official |
| evt_2024_05_12_ROU_C2 | C2 | 2024-05-12 | −10 | reported | press |
| evt_2024_06_06_ROU_B9 | B9 | 2024-06-06 | +2 | confirmed | official |
| evt_2024_07_15_ROU_B11 | B11 | 2024-07-15 | +5 | confirmed | official |
| evt_2024_07_19_ROU_D3 | D3 | 2024-07-19 | +5 | reported | official |
| evt_2024_09_25_ROU_B9 | B9 | 2024-09-25 | +2 | confirmed | official |
| evt_2024_09_30_ROU_D4 | D4 | 2024-09-30 | +5 | confirmed | official |
| evt_2026_05_28_ROU_B11 | B11 | 2026-05-28 | +5 (adds no points beside the 2024 listing) | confirmed | official |

Points are the tier points before decay and weights. B1, D1 and the other generated indicators are left to the build.

### Belarus

Assessments (34 indicators): has-events 1 (B1), none-found 18, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 12 (A3, A5 to A8, B8, C4 to C6 and the three experimental E1 to E3). Leads: 1 (`lead_20261005_BLR_1`, B9). Sources read: the President's site, the Foreign Minister's General Debate statements of the 78th to 81st sessions (Russian, searched for Gaza, Palestine, Israel and the Middle East and read around each hit; Wayback captures of the 78th and 79th, a direct request for the 80th and 81st), the Foreign Ministry's and the President's statements as press report them, UNRWA's donor tables (no row). No event: the Foreign Minister's statements mention Palestine in lists and, in 2024, a humanitarian catastrophe, with no call for a ceasefire; the President's interview of 15 June 2026 and his message of 29 November 2023 call for a Palestinian state and criticise Israel's conduct without a call for a ceasefire; the Ministry's statement of 13 October 2025 is a press secretary's (R3). Belarus is not an EU member, so the Council's listings do not apply, and no archived joint statement names it. 90-minute stop note: finished inside the budget (about 5 minutes on Belarus). The Foreign Ministry's own pages were not read (search excerpts and press relays only); the President's interview of 15 June 2026 was not read in full.

### Moldova

Assessments: has-events 2 (B1, C2), none-found 18, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Leads: 2 (`lead_20261005_MDA_1`, C2; `_2`, B10). Sources read: the Ministry of Foreign Affairs' releases, the Embassy in Israel's page of the bilateral legal framework (archived: it lists every instrument with its date of signature, which decided the four C2 events), the Government's release on the driving-licence agreement (Wayback capture), MOLDPRES, Radio Moldova, Radio Chișinău, Europa Liberă Moldova, the General Debate statements of the 79th and 80th sessions (English, searched: no passage on Gaza), UNRWA's donor tables (no row) and web searches in English and Romanian per indicator group. Moldova is not an EU member and no archived joint statement names it. 90-minute stop note: finished inside the budget (about 10 minutes on Moldova). The Foreign Minister's, the President's and the Prime Minister's own statements on Gaza after October 2023 were searched and none that qualifies was found; the 78th and 81st General Debate statements could not be read.

### Romania

Assessments: has-events 9 (A4, B1, B9, B11, C2, D1, D2, D3, D4), none-found 10, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 12 (A3, A5 to A8, B8, C4 to C6, E1 to E3). Leads: 4 (`lead_20261005_ROU_1`, B9; `_2`, B6; `_3`, D3; `_4`, D4). Romania is an EU member: the Council's three settler listings are filed as B11 under R8 and the two joint statements already archived that name it as B9 (the declaration of 26 EU foreign ministers of 19 February 2024; the leaders' statement of 6 June 2024, signed for Romania by the President), as for Bulgaria (docs/10 B-519). The Ministry of Foreign Affairs (mae.ro) and the Presidency answer every scripted request, and their Wayback captures, with a bot check: the Ministry's releases are known through the outlets that quote them, and the Ministry of Health, the Inspectorate for Emergency Situations and the Government answer normally. 90-minute stop note: finished inside the budget (about 25 minutes on Romania, ten archived pages). Not filed and why: the Foreign Minister's General Debate statement of 27 September 2025 (the UN's file cannot be archived: Save Page Now answers 405 and Wayback holds no capture), B5/B6 for the Ministry's message of 22 November 2024 and the Prime Minister's invitation to Mr Netanyahu of January 2025 (no position on executing the warrants; no visit), the twelve medical-evacuation flights after the first (one programme, one D4 event).

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-10-05 (methodology 1.0.0-rc.1), the 15 reviewed events scored as if published; before them the score was +3 (Acting) for Belarus, −6 (Passive) for Moldova and −13 (Passive) for Romania.

| Country | Before | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| BLR | +3 | +3 | Acting | no event; the passivity penalty (−15) applies |
| MDA | −6 | −11 | Passive | C2 −40 clipped to the category cap of −20; the passivity penalty (−15) no longer applies, the tourism declaration of 9 September 2026 being a qualifying event |
| ROU | −13 | +5 | Acting | B11 +5.0, D3 restored +2.0 (reported, weight 0.4), C2 −4.0 (reported), B9 0.0 (decayed); the passivity penalty (−15) no longer applies, the Council's listing of 28 May 2026 being a qualifying event |

One band change: Romania moves from Passive to Acting. Without the 28 May 2026 listing, which adds no points beside the 2024 listing (one event per tier), the penalty would apply and the score would be about −10 (Passive): the band rests on the EU listing counted under R8, as it does for Bulgaria and the 15 EU members among the 45 (B-446, B-519). Moldova's score falls by 5 points although its passivity penalty is lifted, because four C2 events reach the category cap on instruments some readers would not count (B-526): any two of the four reach the cap, and the tourism declaration of 9 September 2026, the only one inside 365 days, lifts the penalty (without it the score would be about −26). No other cap is hit.

## T-P21-05: SVK, UKR, ATG (2026-10-06)

Light protocol (docs/06 §5) for Slovakia, Ukraine and Antigua and Barbuda. 11 events: 9 for Slovakia, none for Ukraine, 2 for Antigua and Barbuda. Decisions and flags are in docs/10 B-532 to B-540.

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2024_02_19_SVK_B9 | B9 | 2024-02-19 | +2 | confirmed | official |
| evt_2024_04_19_SVK_B11 | B11 | 2024-04-19 (west-bank, unscored) | +5 | confirmed | official |
| evt_2024_07_15_SVK_B11 | B11 | 2024-07-15 | +5 | confirmed | official |
| evt_2024_12_19_SVK_D4 | D4 | 2024-12-19 (no later than) | +5 | confirmed | official |
| evt_2025_07_21_SVK_B9 | B9 | 2025-07-21 | +5 | confirmed | official |
| evt_2025_08_12_SVK_B9 | B9 | 2025-08-12 | +5 | confirmed | official |
| evt_2025_09_27_SVK_B9 | B9 | 2025-09-27 | +2 | confirmed | official |
| evt_2026_05_28_SVK_B11 | B11 | 2026-05-28 | +5 (adds no points beside the 2024 listing) | confirmed | official |
| evt_2026_06_08_SVK_B9 | B9 | 2026-06-08 | +2 | confirmed | official |
| evt_2024_09_27_ATG_B9 | B9 | 2024-09-27 | +2 | confirmed | official |
| evt_2025_09_26_ATG_B9 | B9 | 2025-09-26 | +5 | confirmed | official |

Points are the tier points before decay and weights. B1, D1 and the other generated indicators are left to the build.

### Slovakia

Assessments (34 indicators): has-events 5 (B1, B9, B11, D1, D4), none-found 14, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 9 (A3, A5 to A8, B8, C4 to C6) and the three experimental E1 to E3. Leads: 5 (`lead_20261006_SVK_1`, B9; `_2`, B5; `_3`, C1; `_4`, A4; `_5`, D5). Sources read: the Ministry of Foreign and European Affairs' release of 17 February 2026 (Wayback capture, archived), its other releases through TASR and SITA, the President's General Debate statements (79th: image of a draft, read by OCR; 80th: archived; 81st: no capture), the five joint statements already archived that name Slovakia (B-444), the Council's three settler listings (R8), UNRWA's donor tables, SIPRI's trade register and web searches in English and Slovak per indicator group. 90-minute stop note: the work finished inside the budget (about 40 minutes on Slovakia). Not filed and why: the Minister's own statements (indirect speech only, R4), the Prime Minister's criticism of the ICC (no position on executing the warrants), the President's statements (no call for a ceasefire; self-defence paired with the law of war), the Barak MX contract (A4's domain; no Slovak primary archived).

### Ukraine

Assessments: has-events 1 (B1), none-found 18, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 9 (A3, A5 to A8, B8, C4 to C6) and the three experimental. Leads: 3 (`lead_20261006_UKR_1`, B9; `_2`, B10; `_3`, C2). No event: the President's answer of 2 June 2024 at the Shangri-La Dialogue is archived in the organiser's transcript and a press report but B9 needs a source of kind official or official-video (the President's site answers HTTP 403); the General Debate statements have no call for a ceasefire; the protocol of the Intergovernmental Commission of 23 July 2025 is an implementing arrangement (R18). No archived joint statement names Ukraine; the EU Council listings do not apply. 90-minute stop note: finished inside the budget (about 20 minutes on Ukraine). No Ukrainian government page could be read by a script (B-532 (2)).

### Antigua and Barbuda

Assessments: has-events 2 (B1, B9), none-found 17, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 9 (A3, A5 to A8, B8, C4 to C6) and the three experimental. Leads: 2 (`lead_20261006_ATG_1`, B8; `_2`, B9). Sources read: the Prime Minister's General Debate statements of the 79th and 80th sessions (Wayback captures, archived), the Permanent Representative's statement of the 81st (no capture; no passage on Gaza), the UN's summary of the 79th session's debate, the Embassy to the United States' releases, WAFA and web searches in English per indicator group. No archived joint statement names Antigua and Barbuda; the EU Council listings do not apply. 90-minute stop note: finished inside the budget (about 15 minutes on Antigua and Barbuda).

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-10-05 UTC (methodology 1.0.0-rc.1), the 11 reviewed events scored as if published; before them the generated indicators alone gave −15 (Passive) for Slovakia, −6 (Passive) for Ukraine and −7 (Passive) for Antigua and Barbuda.

| Country | Before (generated only) | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| SVK | −15 | +17 | Acting | B9 +12.6 clipped to the indicator cap (+10), B11 +5.0, D4 +2.0; the passivity penalty (−15) no longer applies: the Council's listing of 28 May 2026 and the INGO statement of 8 June 2026 are qualifying events (either alone lifts it; with neither the score is +2) |
| UKR | −6 | −6 | Passive | no event; the passivity penalty (−15) applies |
| ATG | −7 | −2 | Passive | B9 +4.9 (the statement of 2025); the passivity penalty (−15) applies: the statement is 374 days old |

One band change: Slovakia moves from Passive to Acting, on joint statements of foreign ministers and the EU listing counted under R8. Read critically (docs/06 §4 step 7): the indicator cap of B9 is hit for Slovakia; the A4 gap (SIPRI order of 2024, B-536 (7)) would subtract up to 10; Ukraine's missing B9 rests on the source kind (B-534).

## T-P21-06: BHS, BLZ, BRB (2026-10-06)

Light protocol (docs/06 §5) for the Bahamas, Belize and Barbados. 6 events: none for the Bahamas, 4 for Belize, 2 for Barbados. One row is added to `data/structured/recognitions.csv` (Belize, 2011). Decisions and flags are in docs/10 B-541 to B-550.

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2023_10_26_BLZ_B9 | B9 | 2023-10-26 | +2 | confirmed | official |
| evt_2023_11_14_BLZ_B12 | B12 | 2023-11-14 | +5 (recall tier, flagged) | confirmed | official |
| evt_2025_01_30_BLZ_B3 | B3 | 2025-01-30 | +15 | confirmed | court |
| evt_2025_09_26_BLZ_B9 | B9 | 2025-09-26 | +5 | confirmed | official |
| evt_2024_09_27_BRB_B9 | B9 | 2024-09-27 | +5 (flagged) | confirmed | official |
| evt_2025_09_26_BRB_B9 | B9 | 2025-09-26 | +5 | confirmed | official |

Points are the tier points before decay and weights. B1, B8, D1 and the other generated indicators are left to the build.

### The Bahamas

Assessments (34 indicators): has-events 2 (B1, B8, both generated), none-found 18, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6 and the three experimental E1 to E3). Leads: 1 (`lead_20261006_BHS_1`, B9). Sources read: the Ministry's site (its own search for Gaza, Palestine and Israel; the release of 28 October 2023; the Israeli Ambassador's call of 2021), the General Debate statements of the 78th to 81st sessions (read with a browser User-Agent; no passage on Gaza, the 2025 statement speaks of 'the agony of the Middle East' without a call), the Bahama Journal's report of the Foreign Minister's words of 11 October 2023 and web searches in English per indicator group. No event. No archived joint statement names the Bahamas; the EU Council listings do not apply. 90-minute stop note: finished inside the budget (about 15 minutes on the Bahamas).

### Belize

Assessments: has-events 5 (B1, B3, B8, B9, B12), none-found 15 (A1, A4, B4 to B7, B10, B11, C1, C2, D1 to D5), no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6 and the three experimental E1 to E3). Leads: 3 (`lead_20261006_BLZ_1`, B9 for statements with no named speaker; `_2`, B9 for the 81st session's statement, which does not cite Gaza (R7); `_3`, B9 for the Hague Group). Sources read: the ICJ's press release and the application and declaration of Belize (UNISPAL copies, archived), the Press Office's releases (14 and 16 November 2023, 2 February and 1 October 2024, 9 September 2011, archived), the General Debate statements of the 78th to 81st sessions (the 80th archived through its Wayback capture), the generated events and web searches in English per indicator group. No archived joint statement names Belize; the EU Council listings do not apply. 90-minute stop note: finished inside the budget (about 40 minutes on Belize).

### Barbados

Assessments: has-events 3 (B1, B8, B9), none-found 17, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Leads: 1 (`lead_20261006_BRB_1`, B9: the press conference of 18 November 2023). Sources read: the Ministry's statement of 26 October 2023 (archived from its Wayback capture of 15 June 2024: the site serves a bot check to Save Page Now), the Prime Minister's Office's transcript of the address of 27 September 2024 (Wayback capture), the General Debate statements of the 78th to 81st sessions (the 79th is an image, read by OCR; the 80th archived through its Wayback capture), the generated events and web searches in English per indicator group. No archived joint statement names Barbados; the EU Council listings do not apply. 90-minute stop note: finished inside the budget (about 20 minutes on Barbados).

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-10-05 UTC (methodology 1.0.0-rc.1), the 6 reviewed events scored as if published (and Belize's pre-2023 recognition row); before them the score was +11 (Acting) for the Bahamas, −2 (Passive) for Belize and +11 (Acting) for Barbados.

| Country | Before | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| BHS | +11 | +11 | Acting | no event |
| BLZ | −2 | +26 | Acting | B3 +15.0, B12 +5.0, B8 +3.0 (the added row), B9 +4.9 (the statement of 2025), passivity penalty (−15) applied: no qualifying event in the last 365 days |
| BRB | +11 | +15 | Acting | B9 +4.9 (the statement of 2025; that of 2024 has decayed to zero), the penalty applies |

One band change: Belize moves from Passive to Acting, on a well-documented ICJ filing (B3), the Ministry's measures of November 2023 (B12, tier flagged: ±3) and the recognition row. Read critically (docs/06 §4 step 7): no cap is hit; the Prime Minister's statement of the 81st session, which says 'the genocide must end' without citing Gaza (R7), is a lead that would end Belize's passivity penalty (about +46 with it).

## T-P21-07: CRI, CUB, DMA (2026-10-06)

Light protocol (docs/06 §5) for Costa Rica, Cuba and Dominica. 7 events: 2 for Costa Rica, 5 for Cuba, none for Dominica. One row is added to `data/structured/recognitions.csv` (Cuba, 1988). Decisions and flags are in docs/10 B-551 to B-559.

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2024_09_26_CRI_B9 | B9 | 2024-09-26 | +2 (call addressed to nine conflicts, flagged) | confirmed | official |
| evt_2025_12_08_CRI_C2 | C2 | 2025-12-08 | −10 (the release's dateline year is a misprint, flagged) | confirmed | official |
| evt_2023_10_28_CUB_B9 | B9 | 2023-10-28 | +5 | confirmed | official |
| evt_2024_09_28_CUB_B9 | B9 | 2024-09-28 | +5 | confirmed | official |
| evt_2025_01_10_CUB_B3 | B3 | 2025-01-10 | +15 | confirmed | court |
| evt_2025_09_26_CUB_B9 | B9 | 2025-09-26 | +5 | confirmed | official |
| evt_2025_10_15_CUB_B9 | B9 | 2025-10-15 | +5 | confirmed | official |

Points are the tier points before decay and weights. B1, B8, D1 and the other generated indicators are left to the build.

### Costa Rica

Assessments (34 indicators): has-events 3 (B1, B9, C2), none-found 16, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 12 (A3, A5 to A8, B8, C4 to C6 and the three experimental E1 to E3). Leads: 3 (`lead_20261006_CRI_1`, B10, the President's reply of 2 July 2025; `_2`, B10, the Foreign Minister's interview of 12 July 2026; `_3`, B5, the Government's reaction to the warrants). Sources read: the Ministry of Foreign Affairs and Worship's releases of 2023 to 2025 (read, Wayback captures exist; the site then blocked scripted requests), COMEX's release of the free trade agreement (archived), the General Debate statements of the 78th to 81st sessions (the 79th archived), and web searches in English and Spanish per indicator group. No archived joint statement names Costa Rica; the EU Council listings do not apply. B8 is `unchecked`: the Ministry's annual report 2007-2008 states the recognition of 5 February 2008 but cannot be archived (no row, R21). 90-minute stop note: finished inside the budget (about 30 minutes on Costa Rica).

### Cuba

Assessments: has-events 4 (B1, B3, B8, B9), none-found 16, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Leads: 4 (`lead_20261006_CUB_1`, B9, the Foreign Minister at the Hague Group's high-level meeting of 25 September 2026, press copy only; `_2`, B9, the 81st General Debate statement, which never cites Gaza (R7); `_3`, B9, the Hague Group's declaration of Bogotá, signatory not named; `_4`, posts on X). Sources read: the ICJ's press release and Cuba's declaration of intervention (UNISPAL copies, archived), the Presidency's site, the Ministry's English text of the Foreign Minister's statement of 15 October 2025 (Wayback capture: the Ministry's site is not reachable from outside Cuba), the General Debate statements of the 78th to 81st sessions (the 79th and 80th archived through their Wayback captures), the Cuban press and web searches in Spanish and English per indicator group. The only archived joint statement that names Cuba is the Colombian Ministry's release on the Hague Group's declaration (a lead); the EU Council listings do not apply. 90-minute stop note: finished inside the budget (about 45 minutes on Cuba).

### Dominica

Assessments: has-events 1 (B1), none-found 18, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 12 (A3, A5 to A8, B8, C4 to C6, E1 to E3). Leads: 2 (`lead_20261006_DMA_1`, B9, the Foreign Minister's radio interview of 10 October 2023; `_2`, D5, the Prime Minister's budget speech of 31 July 2025). Sources read: the Government's web portal (the Ministry's and the Head of Government's pages carry no statement on Gaza), the General Debate statements of the 78th to 81st sessions (no passage on Gaza), Dominica News Online (archived through Wayback), the CARICOM communiqués of the 46th and 48th meetings and web searches in English per indicator group. No event. No archived joint statement names Dominica; the EU Council listings do not apply. 90-minute stop note: finished inside the budget (about 20 minutes on Dominica).

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-10-06 UTC (methodology 1.0.0-rc.1), the 7 reviewed events scored as if published (and Cuba's pre-existing recognition row); before them the score was −2 (Passive) for Costa Rica, +3 (Acting) for Cuba and −17 (Passive) for Dominica.

| Country | Before | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| CRI | −2 | +3 (+2.6) | Acting | C2 −10.0, and the passivity penalty (−15) no longer applies because the free trade agreement is a qualifying event: net +5 on the generated B1 of +12.6 |
| CUB | +3 | +45 (+45.0) | Confronting | B3 +15.0, B9 +9.9 (two events inside two years), B8 +3.0 (the added row), B1 +17.6; category B is clipped at its cap of +45 (raw +45.4); the passivity penalty no longer applies because of the event of 15 October 2025 |
| DMA | −17 | −17 | Passive | no event |

Two band changes. Costa Rica moves from Passive to Acting only because a negative C2 event is a qualifying event that ends the passivity penalty (the same mechanism as Moldova's tourism declaration, docs/10 B-526 (4)): without the agreement the score is −2 (Passive), with it +3 (Acting). Cuba moves from Acting to Confronting, on a well-documented ICJ filing (B3), four B9 statements (two decayed) and the pre-existing recognition; without the event of 15 October 2025, the only qualifying event inside 365 days, the penalty would apply and the score would be about +26 (Acting). Read critically (docs/06 §4 step 7): the category cap of B is hit for Cuba; the Hague Group speech of 25 September 2026 (lead) would add 0.1, the cap of B9 being +10.

## T-P21-08: DOM, ECU, GRD (2026-10-06)

Light protocol (docs/06 §5) for the Dominican Republic, Ecuador and Grenada. 7 events: 1 for the Dominican Republic, 6 for Ecuador, none for Grenada. Two rows are added to `data/structured/recognitions.csv` (the Dominican Republic, 2009; Ecuador, 2010). The session resumed a first attempt cut off by a usage limit after the archiving: its 14 captures were kept after the hash of each Wayback replay and the extracted text were checked (docs/10 B-560 (1)). Decisions and flags are in docs/10 B-560 to B-568.

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2024_10_31_DOM_C2 | C2 | 2024-10-31 | −10 (a technical-education agreement with MASHAV, flagged) | confirmed | official |
| evt_2023_12_07_ECU_B9 | B9 | 2023-12-07 | +2 (a position in favour of the ceasefire, flagged) | confirmed | official |
| evt_2024_04_03_ECU_C2 | C2 | 2024-04-03 (no later than) | −10 (labour memorandum, flagged) | confirmed | official |
| evt_2025_05_05_ECU_C2 | C2 | 2025-05-05 (no later than) | −10 | confirmed | official |
| evt_2026_03_30_ECU_C2 | C2 | 2026-03-30 | −10 (cooperation programme 2026-2027, flagged under R18) | confirmed | official |
| evt_2026_08_05_ECU_C2 | C2 | 2026-08-05 | −10 (agreement to combat terrorism) | confirmed | official |
| evt_2026_08_05_ECU_C2_2 | C2 | 2026-08-05 | −10 (joint declaration, Expanded Economic Dialogue, flagged) | confirmed | official |

Points are the tier points before decay and weights. B1, B8, D1 and the other generated indicators are left to the build.

### Dominican Republic

Assessments (34 indicators): has-events 3 (B1, B8, C2), none-found 17, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6 and the three experimental E1 to E3). Leads: none. Sources read: the Ministry of Foreign Affairs' site (its search for Israel, Gaza and Palestina, its news items and its treaties database, archived), the Presidency's site, the General Debate statements of the 78th to 80th sessions (no passage on Gaza) and the Foreign Minister's statement to the Security Council of January 2025 (welcomes the ceasefire, no call), and web searches in Spanish and English per indicator group. No archived joint statement names the Dominican Republic; the EU Council listings do not apply. B8 rests on the Ministry's record of the communiqué establishing relations with Palestine (15 July 2009, flagged). 90-minute stop note: finished inside the budget (about 25 minutes on the Dominican Republic).

### Ecuador

Assessments: has-events 4 (B1, B8, B9, C2), none-found 17, no-data 2 (A2, C3), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Leads: 3 (`lead_20261006_ECU_1`, B9, the Foreign Minister's interview with EFE of 12 June 2024; `_2`, C2, the agreement of 5 August 2026 to begin free trade negotiations; `_3`, B10, the President's 'Tenemos los mismos enemigos' of 5 May 2025). Sources read: the Ministry of Foreign Affairs and Human Mobility's releases (archived), the Presidency's communication secretariat and the Ministry of Environment and Energy (archived), UNifeed's record of the President's stakeout, the General Debate statements of the 78th to 81st sessions (no passage on Gaza in the 80th and 81st), Plan V, Primicias and EFE through swissinfo (archived), and web searches in Spanish and English per indicator group. No archived joint statement names Ecuador; the EU Council listings do not apply. B8 rests on the Ministry's release of 2018 (24 December 2010; the registry says 27 December, left to the author). 90-minute stop note: finished inside the budget (about 45 minutes on Ecuador, after a first attempt that a usage limit cut off).

### Grenada

Assessments: has-events 1 (B1), none-found 18, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 12 (A3, A5 to A8, B8, C4 to C6, E1 to E3). Leads: none. Sources read: the Government's portal (the Ministry's and the Prime Ministers' pages carry no statement on Gaza), the Prime Minister's General Debate statements of the 78th to 80th sessions (the 80th, archived, has an education passage that names Palestine and Gaza and urges 'all parties' to come to the table, without a call for a ceasefire: not filed, docs/10 B-564) and the Permanent Representative's 81st, the CARICOM Chairman's remarks of 2024, NOW Grenada (archived), and web searches in English per indicator group. No archived joint statement names Grenada; the EU Council listings do not apply. B8 is `unchecked` (no state document for the recognition of 2011, R21). No event. 90-minute stop note: finished inside the budget (about 20 minutes on Grenada).

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-10-06 UTC (methodology 1.0.0-rc.1), the 7 reviewed events scored as if published (and the two added recognition rows); before them the score was +2.6 (Acting) for the Dominican Republic, −11.0 (Passive) for Ecuador and −14.2 (Passive) for Grenada.

| Country | Before | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| DOM | +2.6 | −4.4 (−4) | Passive | C2 −10.0, B8 +3.0, B1 +17.6; the passivity penalty (−15) applies: the agreement of 31 October 2024 is 705 days old, so it does not qualify |
| ECU | −11.0 | −13.0 (−13) | Passive | B1 +4.0, B8 +3.0, B9 0.0 (decayed), C2 −50.0 clipped at the cap of −20; the penalty no longer applies because three of the five C2 events are inside 365 days |
| GRD | −14.2 | −14.2 (−14) | Passive | no event |

One band change: the Dominican Republic moves from Acting to Passive on one flagged technical instrument (without it the preview is +5.6, Acting). Ecuador stays Passive; without the three qualifying 2026 instruments the penalty would apply and the preview would be −28 (Enabling). Read critically (docs/06 §4 step 7): the category cap of C is hit for Ecuador (raw −50, so any two instruments suffice); the Dominican band rests on one event and the Ecuadorian band on whether one of three 2026 instruments is counted; Grenada's passage of the 80th session (not filed) would add 1.96, below the 2 needed to qualify against passivity.

## T-P21-09: GTM, GUY, HND (2026-10-06)

Light protocol (docs/06 §5) for Guatemala, Guyana and Honduras. 10 events: 1 for Guatemala, 5 for Guyana, 4 for Honduras. Two rows are added to `data/structured/recognitions.csv` (Guyana, 2011-01-13; Honduras, 2011-08-26). Decisions and flags are in docs/10 B-569 to B-578.

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2025_09_24_GTM_B9 | B9 | 2025-09-24 | +2 (President: attacks must stop, aid, end of civilian suffering; call tier, flagged) | confirmed | official |
| evt_2024_09_25_GUY_B9 | B9 | 2024-09-25 | +5 (President, General Debate) | confirmed | official |
| evt_2024_10_29_GUY_B9 | B9 | 2024-10-29 | +5 (Minister of Foreign Affairs, Security Council) | confirmed | official |
| evt_2024_12_31_GUY_D3 | D3 | 2024-12-31 | +8 (UNRWA 2024 contribution against a zero in 2022) | confirmed | dataset |
| evt_2025_09_23_GUY_B9 | B9 | 2025-09-23 | +5 (Minister of Foreign Affairs, Security Council) | confirmed | official |
| evt_2025_09_24_GUY_B9 | B9 | 2025-09-24 | +5 (President, General Debate) | confirmed | official |
| evt_2023_11_03_HND_B12 | B12 | 2023-11-03 to 2026-08-03 | +5 (ambassador recalled for consultations, ended; flagged) | corroborated | press (end: official) |
| evt_2024_09_25_HND_B9 | B9 | 2024-09-25 | +5 (President, General Debate) | confirmed | official |
| evt_2026_06_02_HND_C2 | C2 | 2026-06-02 | −10 (addendum to the Cooperation Plan with MASHAV, flagged under R18) | corroborated | press |
| evt_2026_08_16_HND_C2 | C2 | 2026-08-16 | −10 (defense memorandum of understanding, text not public, flagged) | corroborated | press |

Points are the tier points before decay and weights. B1, B8, D1 and the other generated indicators are left to the build.

### Guatemala

Assessments (34 indicators): has-events 2 (B1, B9), none-found 17, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 12 (A3, A5 to A8, B8, C4 to C6 and the three experimental E1 to E3). Leads: 2 (`lead_20261006_GTM_1`, B10, the Ministry's account of the President's 'irrestricto apoyo y solidaridad' to Israel's President, Munich, 17 February 2024; `_2`, B8, EFE's report of the recognition of April 2013, no state document archived). Sources read: the Presidency's site, the General Debate statements of the 78th to 81st sessions (the 80th is the event; the 81st, the Foreign Minister's, has no passage on Gaza), the Ministry of Economy's treaties page and the Israeli embassy's bilateral-relations page (the free trade agreement of 8 September 2022 entered into force on 1 March 2024: pre-war, not filed), and web searches in Spanish and English per indicator group; the Ministry of Foreign Affairs' site and the state news agency refuse scripted requests. None of the joint statements already archived for the 45 names Guatemala (`archive/text/` searched for the name in English, French and Spanish: the hits are UN records, donor and trade tables and press items); it is not an EU member, so the Council's listings do not apply, and the Hague Group's and Bogotá declarations do not name it. 90-minute stop note: finished inside the budget (about 15 minutes of research on Guatemala).

### Guyana

Assessments: has-events 5 (B1, B8, B9, D1, D3), none-found 16, no-data 2 (A2, C3), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Leads: 1 (`lead_20261006_GUY_1`, B9, the Permanent Representative's statements, not a B9 speaker). Sources read: the Ministry of Foreign Affairs', the Office of the President's and the Government Information Agency's sites, the General Debate statements of the 78th to 81st sessions (the 81st has no call on Gaza), the Security Council records of 29 October 2024 and 23 September 2025 (the Foreign Minister's statements), UNRWA's donor tables, the ICJ case 192 list (Guyana is not on it), and web searches in English per indicator group. Guyana sat on the Security Council in 2024 and 2025: B2 is none-found (no veto by an elected member). The statements already archived for the 45 that name Guyana are Security Council records and vote tables, no joint statement; it is not an EU member. 90-minute stop note: finished inside the budget (about 20 minutes of research on Guyana).

### Honduras

Assessments: has-events 5 (B1, B8, B9, B12, C2), none-found 15, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Leads: 2 (`lead_20261006_HND_1`, B9, the Secretary of Foreign Affairs' General Debate statement of 29 September 2025, no archived copy: its Wayback capture is not served; `_2`, B9, the Hague Group's inaugural declaration of 31 January 2025, which Honduras signed and left on 3 March 2026, with no signatory named). Sources read: the Foreign Ministry's current site (sreci.gob.hn), the General Debate statements of the 78th to 81st sessions, the archived press (La Prensa, El Heraldo, EFE through Infobae, Honduras Trascendental, the Jerusalem Post), the Israeli President's release of 3 August 2026, the Israeli Defense Ministry's release as GlobalSecurity.org reproduces it, UN records for the recognition of 2011, UNRWA's donor tables, and web searches in Spanish and English per indicator group. None of the joint statements already archived for the 45 names Honduras; it is not an EU member. 90-minute stop note: finished inside the budget (about 25 minutes of research on Honduras; the session's clock was mostly Save Page Now).

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-10-06 (methodology 1.0.0-rc.1), the 10 reviewed events scored as if published and the two added recognition rows; before them the generated indicators alone gave −2.2 (GTM), +2.6 (GUY) and −2.2 (HND).

| Country | Before (generated only) | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| GTM | −2.2 (−2) | −0.3 (0) | Passive | B9 +1.95; the passivity penalty (−15) applies: the statement is 377 days old and its weight (+1.95) is below 2 |
| GUY | +2.6 (+3) | +23.6 (+24) | Acting | B9 +11.2 clipped at the indicator cap of +10 (four events, two of them decayed to +1.5 and zero), D3 +8.0, B8 +3.0 (the row added), B1 +17.6; the penalty applies (the two events of September 2025 are 377 and 378 days old) |
| HND | −2.2 (−2) | +1.8 (+2) | Acting | B8 +3.0 (the row added), C2 −14.0 (two events at weight 0.7), B1 +12.8; the two C2 events are qualifying and lift the penalty (+15), a net +1.0; B12 ended, B9 decayed |

One band change (Honduras, Passive to Acting), resting on the recognition row (+3.0: without it the preview is −1.2, Passive) and on the penalty mechanism: the two negative C2 events raise the score by 1 because they end a penalty of 15. Without the C2 events the preview would be +0.8 (Acting, display +1). Read critically (docs/06 §4 step 7): the indicator cap of B9 is hit for Guyana; no single event dominates Guatemala or Honduras; Guyana's band does not depend on any one flagged reading (without the B8 row +20.6, without D3 +15.6, without the four B9 events +13.6, all Acting).

## T-P21-10: HTI, JAM, KNA (2026-10-06)

Light protocol (docs/06 §5) for Haiti, Jamaica and Saint Kitts and Nevis. 3 events: none for Haiti, 1 for Jamaica, 2 for Saint Kitts and Nevis. Two rows are added to `data/structured/recognitions.csv` (Haiti, 2013-09-27; Saint Kitts and Nevis, 2019-07-29); Jamaica's row of 2024-04-22 was already there. Decisions and flags are in docs/10 B-579 to B-587.

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2024_09_27_JAM_B9 | B9 | 2024-09-27 | +2 (Foreign Minister, General Debate: immediate ceasefire in Gaza and release of hostages; call tier; decayed) | confirmed | official |
| evt_2024_09_27_KNA_B9 | B9 | 2024-09-27 | +2 (Prime Minister, General Debate: reiterates CARICOM's call for an unconditional ceasefire in Gaza; decayed) | confirmed | official |
| evt_2025_09_27_KNA_B9 | B9 | 2025-09-27 | +5 (Prime Minister, General Debate: 'the horrific genocide that is unfolding in Gaza', accountability, immediate and unconditional ceasefire) | confirmed | official |

Points are the tier points before decay and weights. B1, B8, D1 and the other generated indicators are left to the build.

### Haiti

Assessments (34 indicators): has-events 2 (B1, B8), none-found 18, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6 and the three experimental E1 to E3). Leads: none. No event: the General Debate statements of the 78th to 81st sessions (French files, the first three images read by OCR) never cite Gaza, Israel or Palestine, and no statement of the Prime Minister, the President of the Presidential Council of the Transition or the Minister of Foreign Affairs on Gaza was found; the Ministry's (`mae.gouv.ht`) and the Prime Minister's (`primature.gouv.ht`) site searches return nothing. A row `HTI,2013-09-27` is added to the recognitions table from the Division for Palestinian Rights' chronology of September 2013 (UNISPAL, archived; a UN Secretariat review, flagged). Haiti is not on the ICJ case 192 list, is not an EU member, and none of the joint statements already archived for the 45 names it. 90-minute stop note: finished inside the budget (about 20 minutes of research on Haiti).

### Jamaica

Assessments: has-events 3 (B1, B8, B9), none-found 17, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Leads: 2 (`lead_20261006_JAM_1`, B9, the Prime Minister's General Debate statement of 26 September 2025, which supports a ceasefire agreement in 'the Palestinian territories' and never cites Gaza, R7, with no archived copy; `_2`, B9, the Prime Minister's post-Cabinet remarks of October 2023, a humanitarian pause 'in Gaza' in indirect speech, R4). Sources read: the Ministry of Foreign Affairs and Foreign Trade's, the Office of the Prime Minister's and the Jamaica Information Service's sites, the General Debate statements of the 78th to 81st sessions (the 79th, the Foreign Minister's, is the event; the 81st has no passage on the Middle East), the Gleaner and the Observer, the Government's release of the recognition (archived), and web searches in English per indicator group; the searches' claims of a visa-waiver agreement of 2024 and of a contract with ELTA Systems were checked against the pages and are a republished article of 1967 and a pre-war contract (B-579 (4)). None of the joint statements already archived for the 45 names Jamaica; it is not an EU member; the ICJ case 192 list, the Hague Group's founding states and the Bogotá conference's participants do not include it. 90-minute stop note: finished inside the budget (about 30 minutes of research on Jamaica).

### Saint Kitts and Nevis

Assessments: has-events 3 (B1, B8, B9), none-found 17, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Leads: none. Sources read: the Ministry of Foreign Affairs', the Information Service's (SKNIS: site searches for Gaza, Israel and Palestine) and the Prime Minister's (under maintenance) sites, the General Debate statements of the 78th to 81st sessions (the 79th and 80th are the events; the 81st, by the Acting Prime Minister, names Gaza in a list with no call), the Ministry's statements of 2026 on the Middle East (not Gaza), and web searches in English per indicator group. A row `KNA,2019-07-29` is added to the recognitions table from SKNIS's release of 30 July 2019 (archived). None of the joint statements already archived for the 45 names Saint Kitts and Nevis; it is not an EU member; the ICJ case 192 list, the Hague Group's founding states and the Bogotá conference's participants do not include it. 90-minute stop note: finished inside the budget (about 20 minutes of research on Saint Kitts and Nevis; the session's clock was mostly Save Page Now).

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-10-06 (methodology 1.0.0-rc.1), the 3 reviewed events scored as if published and the two added recognition rows; before them the generated indicators alone gave −14.9 (HTI), +5.7 (JAM) and +2.6 (KNA).

| Country | Before (generated only) | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| HTI | −14.9 (−15) | −11.9 (−12) | Passive | B8 +3.0 (the row added); the passivity penalty (−15) applies |
| JAM | +5.7 (+6) | +5.7 (+6) | Acting | nothing: the one B9 event (27 September 2024, 739 days old) is decayed to zero; the penalty applies |
| KNA | +2.6 (+3) | +10.5 (+10) | Acting | B9 +4.9 (27 September 2025; the 2024 event is decayed to zero), B8 +3.0 (the row added); the penalty applies because the 2025 statement is 374 days old, outside the 365-day window |

No band change. Read critically (docs/06 §4 step 7): no cap is hit and no single reading decides a band (Saint Kitts and Nevis without the 2025 B9 event would be +5.6, without the B8 row +7.5, Acting both; Haiti is Passive with or without the row).

## T-P21-11: LCA, NIC, PAN (2026-10-06)

Light protocol (docs/06 §5) for Saint Lucia, Nicaragua and Panama. 5 events: 2 for Saint Lucia, 2 for Nicaragua, 1 for Panama. One row is added to `data/structured/recognitions.csv` (Saint Lucia, 2015-09-14). Decisions and flags are in docs/10 B-588 to B-596.

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2024_09_27_LCA_B9 | B9 | 2024-09-27 | +5 (Minister for External Affairs, General Debate: killings of aid workers, UNRWA staff and journalists in Gaza, the war must end today; decayed) | confirmed | official |
| evt_2025_09_29_LCA_B9 | B9 | 2025-09-29 | +5 (Minister for External Affairs, General Debate: 'the undeniable genocide', starvation, destruction of hospitals; 372 days old) | confirmed | official |
| evt_2024_01_23_NIC_B3 | B3 | 2024-01-23 to 2025-04-01 | +15 (Article 62 application to intervene as a party in case 192, supporting the applicant; withdrawn, so it no longer counts) | confirmed | court |
| evt_2024_10_11_NIC_B12 | B12 | 2024-10-11 | +10 (relations with Israel severed, Presidential Agreement 181-2024, La Gaceta of 14 October 2024) | confirmed | official |
| evt_2026_05_27_PAN_C2 | C2 | 2026-05-27 | −10 (memorandum of understanding with Israel's MASHAV agency, signed by the Minister and Israel's ambassador) | confirmed | official |

Points are the tier points before decay and weights. B1, B8, D1 and the other generated indicators are left to the build.

### Saint Lucia

Assessments (34 indicators): has-events 3 (B1, B8, B9), none-found 17, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6 and the three experimental E1 to E3). Leads: none. Sources read: the Department of External Affairs' site (`stlucia.gov.lc`: its list of diplomatic relations, archived), the Ministry's own site (Wayback capture of 15 June 2026: no item on Gaza), the Government portal (`govt.lc`), the General Debate statements of the 78th to 81st sessions (the 79th and 80th, the Minister's, are the events; the Prime Minister's of the 81st names Gaza in a list of conflicts with no call and is not filed), St. Lucia Times and The Voice, and web searches in English per indicator group. A row `LCA,2015-09-14` is added to the recognitions table from the Department's own list ('Palestine (State of) 2015 (Sept 14)'). None of the joint statements already archived for the 45 names Saint Lucia; it is not an EU member; the ICJ case 192 list, the Hague Group's founding states and the Bogotá conference's participants do not include it; CARICOM's communiqués name no signatory (R3). 90-minute stop note: finished inside the budget (about 15 minutes of research on Saint Lucia).

### Nicaragua

Assessments: has-events 3 (B1, B3, B12), none-found 16, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 12 (A3, A5 to A8, B8, C4 to C6, E1 to E3). Leads: 4 (`lead_20261006_NIC_1` to `_3`, B9: the Foreign Ministers' General Debate statements of 30 September 2024 and 29 September 2025 and the messages of the President and Rosario Murillo of 14 November 2024 and 25 November 2025, which condemn 'genocide' against 'the Palestinian people' and never cite Gaza, R7; `_4`, B9, the Hague Group's Bogotá declaration, which names Nicaragua among its signatories with no named signatory). Sources read: the ICJ's documents on case 192 (the press release and the application, UNISPAL copies; the Court's reports A/79/4 and A/80/4), La Gaceta No. 187 of 14 October 2024 (from Wayback), the General Debate statements of the 78th to 81st sessions (Spanish and English files), the messages and statements Nicaragua published through UNISPAL, the Assembly of States Parties' list (Nicaragua is not a State Party), and web searches in Spanish and English per indicator group. The Government's sites cannot be reached from the session's network (B-588 (3)). Nicaragua v. Germany (case 193) is a separate case and is not filed (B-591 (3)). 90-minute stop note: finished inside the budget (about 25 minutes of research on Nicaragua).

### Panama

Assessments: has-events 2 (B1, C2), none-found 19, no-data 2 (A2, C3), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Leads: 3 (`lead_20261006_PAN_1`, C2, the commitments of the Herzog visit of 6 May 2026 to reinforce the free trade agreement and agree on water cooperation, with no signed instrument; `_2`, C2, the meeting with Israel's Prime Minister in New York in September 2026, with an invitation to the 'Isaac Accords' and to a United States initiative on withdrawing from the ICC, with no signed instrument and no answer found; `_3`, B9, the President's remarks of 9 October 2025 welcoming the Israel-Hamas agreement, which are not a call, R4). Sources read: the Ministry of Foreign Affairs' site (`mire.gob.pa`, site searches for Gaza, Israel and Palestina, and its releases on the Security Council and on Israel), the Presidency's (bot check; Wayback capture), the General Debate statements of the 78th to 81st sessions (the President's three never cite Gaza), the Security Council records already archived (Panama speaks through its mission, R3), La Prensa, and web searches in Spanish and English per indicator group. Panama does not recognise the State of Palestine (no row). 90-minute stop note: finished inside the budget (about 20 minutes of research on Panama).

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-10-06 (methodology 1.0.0-rc.1), the 5 reviewed events scored as if published and the added recognition row; before them the generated indicators alone gave −2.4 (LCA), +2.6 (NIC) and −19.8 (PAN).

| Country | Before (generated only) | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| LCA | −2.4 (−2), Passive | +5.5 (+5), Acting | Passive → Acting | B9 +4.9 (29 September 2025; the 2024 event is decayed to zero), B8 +3.0 (the row added); the passivity penalty (−15) applies because the 2025 statement is 372 days old |
| NIC | +2.6 (+3), Acting | +12.6 (+13), Acting | Acting | B12 +10.0 (standing, from 11 October 2024); the B3 event ended on 1 April 2025 and counts nothing; the penalty applies (the B12 event is 725 days old) |
| PAN | −19.8 (−20), Passive | −14.8 (−15), Passive | Passive | C2 −10.0, and the C2 event is a qualifying event (132 days old), so the passivity penalty (−15) no longer applies: net +5.0 |

One band change: Saint Lucia moves from Passive to Acting. Read critically (docs/06 §4 step 7): no cap is hit and no single reading decides Saint Lucia's band as long as one of its two additions stands (without the 2025 B9 event the score is +0.6, display +1, Acting; without the B8 row +2.5, Acting; without both −2.4, Passive). Panama's C2 event ends its penalty: without it the score is −19.8 (Passive). The reading with the largest effect is unfiled: the message of 25 November 2025 from the President of Nicaragua, if the author reads 'Palestine' as Gaza (R7), would be a +5 event inside 365 days and would end the penalty, moving Nicaragua from +13 to about +33 (Acting).

## T-P21-12: PER, PRY, SLV (2026-10-06)

Light protocol (docs/06 §5) for Peru, Paraguay and El Salvador. 5 events: 1 for Peru, 4 for Paraguay, none for El Salvador. Three rows are added to `data/structured/recognitions.csv` (Peru 2011-01-24, Paraguay 2011-01-28, El Salvador 2011-08-25). Decisions and flags are in docs/10 B-597 to B-608.

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2025_11_21_PER_C2 | C2 | 2025-11-21 | −10 (memorandum of understanding on cybersecurity cooperation between the Presidency of the Council of Ministers' Secretariat for Government and Digital Transformation and Israel's National Cyber Directorate, signed in Lima and Tel Aviv) | confirmed | official |
| evt_2024_12_12_PRY_C2 | C2 | 2024-12-12 | −10 (memorandum between the research bodies of Paraguay and Israel on innovation and technology, signed with other agreements by the two Foreign Ministers) | confirmed | official |
| evt_2025_11_24_PRY_C2 | C2 | 2025-11-24 | −10 (memorandum on defense and security cooperation, signed by the Defense Minister and Israel's ambassador; weight 0.7) | corroborated | press |
| evt_2025_11_24_PRY_C2_2 | C2 | 2025-11-24 | −10 (memorandum on diplomatic cooperation, training of diplomats, signed by the two Foreign Ministers; weight 0.4) | reported | press |
| evt_2026_03_03_PRY_B4 | B4 | 2026-03-03 | −15 (declaration of intervention under Article 63 in South Africa v. Israel arguing the strict standard of intent and a narrow definition of genocide) | confirmed | court |

Points are the tier points before decay and weights. B1, B8, A4, D1 and the other generated indicators are left to the build.

### Peru

Assessments (34 indicators): has-events 4 (A4, B1, B8, C2), none-found 16, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6 and the three experimental E1 to E3). Leads: 1 (`lead_20261006_PER_1`, C2: the Foreign Ministers' call of 3 August 2026, cooperation through Mashav, no instrument). Sources read: the Ministry's and the Presidency's pages on gob.pe (live), the Presidency of the Council of Ministers' release (archived), Andina and EFE, the General Debate statements of the 78th to 81st sessions (no Gaza), the Ministry's communiqués (Comunicado Oficial 039-25 of 15 October 2025), the SIPRI register (the 2025 PULS order, A4), the UNISPAL review of January 2011 (B8) and web searches in Spanish per indicator group. A row `PER,2011-01-24` is added to the recognitions table. None of the joint statements already archived names Peru; it is not an EU member; it is not on the ICJ case 192 list; the Hague Group and Bogotá lists do not include it. 90-minute stop note: finished inside the budget (about 30 minutes on Peru).

### Paraguay

Assessments: has-events 4 (B1, B4, B8, C2), none-found 16, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Leads: 5 (`lead_20261006_PRY_1` and `_2`, B10: the President's statements of 11 and 12 December 2024 and the Foreign Minister's of 8 February 2026, none citing Gaza, R7; `_3`, B6: Netanyahu's invitation of 24 September 2026 to withdraw from the ICC, no answer found; `_4` and `_5`, C2: other agreements known only in general terms). Sources read: the Ministry's releases (Wayback captures), Agencia IP, Paraguay TV, the General Debate statements of the 78th to 81st sessions (79th and 80th: right of Israel to defend itself, no Gaza), the ICJ's case page, Paraguay's declaration of intervention (scan, OCR) and the Court's press release, the UNISPAL review of January 2011, EFE, JNS, ABC Color, La Nación, Última Hora and La Política Online, and web searches in Spanish and English per indicator group. A row `PRY,2011-01-28` is added to the recognitions table. The Israeli embassy's reopening in Asunción and the embassy's move to Jerusalem (12 December 2024) are noted under B12: no indicator measures them. None of the joint statements already archived names Paraguay; it is not an EU member; Paraguay is on the ICJ case 192 list (B4); the Hague Group and Bogotá lists do not include it. 90-minute stop note: finished inside the budget (about 80 minutes on Paraguay, the most documented of the three).

### El Salvador

Assessments: has-events 2 (B1, B8), none-found 18, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Leads: none. Sources read: the Ministry's and the Presidency's news (Wayback captures; the live sites answer a Cloudflare challenge), the General Debate statements of the 79th and 81st sessions (no Gaza; the 80th has no page on the debate site, the 78th is an image file of September 2023), the SIPRI register, the UNISPAL review of August 2011 (B8) and web searches in Spanish per indicator group. A row `SLV,2011-08-25` is added to the recognitions table. No instrument signed with Israel after 7 October 2023 was found (the agreements of 2022 pre-date the window). None of the joint statements already archived names El Salvador; it is not an EU member; it is not on the ICJ case 192 list; the Hague Group and Bogotá lists do not include it. 90-minute stop note: finished inside the budget (about 25 minutes on El Salvador).

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-10-06 (methodology 1.0.0-rc.1), the 5 reviewed events scored as if published and the three recognition rows; before them the generated indicators alone gave −7.3 (PER), −44.3 (PRY) and +2.6 (SLV).

| Country | Before (generated only) | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| PER | −7.3 (−7), Passive | +0.7 (+1), Acting | Passive → Acting | B8 +3.0 (the row added), C2 −10.0 with the passivity penalty (−15) lifted: the C2 event is a qualifying event (319 days old), net +5.0; without the memorandum the score is −4.3 (Passive) |
| PRY | −44.3 (−44), Enabling | −60.0 (−60), Sustaining | Enabling → Sustaining | B8 +3.0, B4 −15.0 (B's floor −40 is hit: B1 −29.3 and B8 +3.0 and B4 sum to −41.3), C2 −10.0, −7.0 and −4.0 (C's floor −20 is hit: −21.0), passivity penalty lifted (three qualifying events); the boundary lies between −50 and −51: without the two memoranda of 24 November 2025 the score is −50.0 (Enabling), without the 'reported' one −57.0 (Sustaining), with the B4 event alone −40.0 and with the C2 events alone −46.3 (Enabling) |
| SLV | +2.6 (+3), Acting | +5.6 (+6), Acting | Acting | B8 +3.0 (the row added); the passivity penalty (−15) applies |

Two band changes: Peru (Passive → Acting) rests on one cybersecurity memorandum signed by a government secretary (R18, flagged); Paraguay (Enabling → Sustaining) rests on the B4 event and on the defense memorandum of 24 November 2025 at `corroborated` (the Ministry's own release is not archived). Read critically (docs/06 §4 step 7): in both cases a negative event ends a passivity penalty, so the net effect of the Peruvian memorandum is +5.0, as for Panama's (B-594). The reading with the largest effect that is unfiled is R7 for Paraguay's President and Foreign Minister (leads 1 and 2): B10 events would change no score (B is already at its floor, −40.0).

## T-P21-13: SUR, TTO, URY (2026-10-07)

Light protocol (docs/06 §5) for Suriname, Trinidad and Tobago and Uruguay. 2 events: 1 for Suriname, 1 for Trinidad and Tobago, none for Uruguay. Two rows are added to `data/structured/recognitions.csv` (Suriname, 2011-02-01; Uruguay, 2011-03-15); Trinidad and Tobago's row of 2024-05-02 was already there and is not duplicated. The session resumed a first attempt cut off by a usage limit after one capture (the Division for Palestinian Rights' review of February 2011): the capture was kept after the Wayback replay was fetched again (1,607,018 bytes, SHA-256 equal to the index row, 80,770 bytes of text, not a bot-check page) and its missing source record was written (docs/10 B-609 (1)). Decisions and flags are in docs/10 B-609 to B-618.

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2025_09_23_SUR_B9 | B9 | 2025-09-23 | +5 (President, General Debate: grave violations of human rights, 'more specifically the rights of children', 'for example in Gaza'; no call; flagged) | confirmed | official |
| evt_2024_09_28_TTO_B9 | B9 | 2024-09-28 | +5 (Minister of Foreign and CARICOM Affairs, General Debate: the call for an immediate, full and complete ceasefire, the killing of UN staff and civilians, 'ongoing violations of international law'; decayed) | confirmed | official |

Points are the tier points before decay and weights. B1, B8, D1 and the other generated indicators are left to the build.

### Suriname

Assessments (34 indicators): has-events 3 (B1, B8, B9), none-found 17 (A1, A4, B3 to B7, B10 to B12, C1, C2, D1 to D5), no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6 and the three experimental E1 to E3). Leads: 3 (`lead_20261007_SUR_1`, B9, the President's statement of the 81st session, 22 September 2026, which a search excerpt credits with words on Gaza that the Government's reports do not carry; `_2`, C2, Israel's proposed cooperation agreement on public-private partnerships, no instrument signed; `_3`, B9, the Foreign Minister's meeting with Israel's non-resident ambassador of 26 January 2024, a call for a ceasefire in the report's indirect speech). Sources read: the Government portal gov.sr (the Ministry's, the President's and the Department of Public Information's pages; site searches), the General Debate statements of the 78th to 80th sessions (the 80th is the event; the 81st has no capture), the Foreign Minister's press conference of 23 October 2023 (archived: no call for a ceasefire; it states that Suriname has recognised Palestine since 2011), ABC Suriname, Times of Suriname, the ICJ's case page (Suriname is not on the list), the SIPRI register and UNRWA's donor rankings of 2022 to 2024 (no row). Suriname is not an EU member; no archived joint statement names it; Wikipedia's page on the Hague Group (read 2026-10-07) lists it neither among the founding states nor among the 34 states of the meeting of 26 September 2025, and CARICOM's and the OIC's communiqués name no signatory (R3). 90-minute stop note: finished inside the budget (about 35 minutes on Suriname). Not filed and why: the Foreign Minister's call of 26 January 2024 (indirect speech, R4), the President's statement of 22 September 2026 (the delivered text could not be read), the Government's declaration of October 2023 on the attacks in Israel (no named speaker).

### Trinidad and Tobago

Assessments: has-events 3 (B1, B8, B9), none-found 17, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Leads: 2 (`lead_20261007_TTO_1`, B9, Prime Minister Rowley's Eid-ul-Fitr message of April 2024, a call for a ceasefire in Gaza printed by the Trinidad Guardian, with no official copy; `_2`, C2, the talks with Israel's non-resident ambassador and the director general of MASHAV of 27 to 29 July 2026, no instrument signed). Sources read: the Ministry of Foreign and CARICOM Affairs' site and the Office of the Prime Minister's (rebuilt, its old releases gone), the General Debate statements of the 79th and 80th sessions (the 79th is the event; the 80th, the Prime Minister's, has no passage on Gaza) with UN Meetings Coverage's summary of the fifth day, the ICJ's case page (not on the list), the Trinidad Guardian, Newsday, Trinidad Express, CNC3 and JNS, the SIPRI register and UNRWA's donor rankings (no row). B8 stands on the row of 2 May 2024 (the Ministry's own document, archived since P-14). Not an EU member; no archived joint statement names it; Wikipedia's page on the Hague Group (read 2026-10-07) lists it neither among the founding states nor among the 34 states of the meeting of 26 September 2025, and CARICOM's communiqués name no signatory (R3). 90-minute stop note: finished inside the budget (about 30 minutes on Trinidad and Tobago). Not filed and why: the Government's designation of Hamas, Hezbollah and the Revolutionary Guards as terrorist organisations (April to June 2026) and its early support for the attack on Iran (February 2026, withdrawn) are not indicators; the Ambassador's statement of September 2026 on staying for the Israeli Prime Minister's address is a Permanent Representative's (R3).

### Uruguay

Assessments: has-events 2 (B1, B8), none-found 18, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 12 (A3, A5 to A8, C4 to C6, E1 to E3). Leads: 4 (`lead_20261007_URY_1`, B9, the President's General Debate statement of 23 September 2025, which calls for 'la suspensión inmediata de las operaciones militares' on 'los territorios palestinos' and never names Gaza (R7); `_2`, B9, Uruguay's statement of 29 July 2025 at the New York conference, which cites Gaza, names violations and calls for an immediate and permanent ceasefire but was delivered by the Permanent Representative (R3), and the Ministry's communiqués with no named speaker; `_3`, B5, the Vice Foreign Minister's statement of August 2026 that Uruguay would have to act on the ICC warrant; `_4`, C2, the agency's agreement with the Hebrew University of December 2024, paused in August 2025). Sources read: the Presidency's and the Ministry's texts on gub.uy (archived), the Foreign Minister's speech to the Security Council of 26 May 2026, the General Debate pages of the 78th to 80th sessions, la diaria, Subrayado, El Popular, Infobae, Medios Públicos and Ámbito, the ICJ's case page (not on the list), the SIPRI register (one order of 1997) and UNRWA's donor rankings (no row). Uruguay is not an EU member and no archived joint statement names it; it is on Wikipedia's list (read 2026-10-07) of the 34 states at the Hague Group's ministerial meeting of 26 September 2025, whose Chair's statement (DIRCO, read) names no participant and has no signatory from Uruguay (attendance, not a statement of a B9 speaker). 90-minute stop note: finished inside the budget (about 40 minutes on Uruguay). No event: the speakers who name Gaza are not B9 speakers (Ambassador Dupuy, the Ministry without a name) and the two who are (the President, the Foreign Minister) do not cite Gaza in an archivable text.

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-10-07 (methodology 1.0.0-rc.1), the 2 reviewed events scored as if published and the two added recognition rows; before them the generated indicators alone gave +2.5 (SUR), +10.5 (TTO) and +0.5 (URY).

| Country | Before (generated only) | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| SUR | +2.5 (+3) | +10.4 (+10) | Acting | B8 +3.0 (the row added), B9 +4.9 (the statement of 23 September 2025, 379 days old), B1 +17.5; the passivity penalty (−15) applies: the statement is outside the 365 days |
| TTO | +10.5 (+11) | +10.5 (+11) | Acting | no change: the B9 event of 28 September 2024 is 739 days old and decayed to zero; B8 +8.0, B1 +17.5; the penalty applies |
| URY | +0.5 (+1) | +3.5 (+4) | Acting | B8 +3.0 (the row added), B1 +15.5; the penalty applies |

No band change. Read critically (docs/06 §4 step 7): no cap is hit and no single reading decides a band (Suriname without the B9 event is +5.5, without the B8 row +7.4, Acting both). The readings with the largest effect are unfiled: the Surinamese President's statement of 22 September 2026, if its delivered text cites Gaza with a call or a named violation, would be a B9 event inside 365 days that ends Suriname's passivity penalty (the score would be about +27 to +30, Acting); Uruguay's President's statement of 23 September 2025, if the author reads 'los territorios palestinos' as Gaza (R7), would add +1.9 or +4.8 without lifting the penalty.

## T-P21-14: VCT, VEN, FJI (2026-10-07)

Light protocol (docs/06 §5) for Saint Vincent and the Grenadines, Venezuela and Fiji. 10 events: 2 for Saint Vincent and the Grenadines, 4 for Venezuela (one unscored), 4 for Fiji. Decisions and flags are in docs/10 B-619 to B-628.

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2024_09_27_VCT_B9 | B9 | 2024-09-27 | +5 | confirmed | official |
| evt_2025_09_26_VCT_B9 | B9 | 2025-09-26 | +5 | confirmed | official |
| evt_2023_10_07_VEN_B12 | B12 | 2023-10-07 (severed since 2009-01-16) | +10 | confirmed | official |
| evt_2024_09_25_VEN_B9 | B9 | 2024-09-25 | +5 | confirmed | official |
| evt_2025_06_17_VEN_B9 | B9 | 2025-06-17 | +5 | confirmed | official |
| evt_2026_07_24_VEN_B6 | B6 | 2026-07-24 (scope related, unscored) | −10 | confirmed | official |
| evt_2025_10_22_FJI_C2 | C2 | 2025-10-22 | −10 | confirmed | official |
| evt_2026_03_12_FJI_B4 | B4 | 2026-03-12 | −15 | confirmed | court |
| evt_2026_06_02_FJI_C2 | C2 | 2026-06-02 | −10 | confirmed | official |
| evt_2026_06_02_FJI_C2_2 | C2 | 2026-06-02 | −10 | confirmed | official |

Points are the tier points before decay and weights. B1, D1 and the other generated indicators are left to the build. Rows added to `data/structured/recognitions.csv`: `VCT,2011-08-30` and `VEN,2009-04-27` (B8, +3 each; R21, flagged: UN Secretariat reviews).

### Saint Vincent and the Grenadines

Assessments (34 indicators): has-events 3 (B1, B8, B9), none-found 17, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6 and the three experimental E1 to E3). Leads: 1 (`lead_20261007_VCT_1`, B9, Prime Minister Friday's statement of 25 September 2026, reported in indirect speech without Gaza). Sources read: the Prime Minister's General Debate address of the 79th session (the delegation's file, Wayback capture), UN Meetings Coverage's summary of the fourth day of the 80th session (the delegation's file of the 80th has no usable replay), the Division for Palestinian Rights' review of August 2011 (the recognition), the ICJ's case page, the press on the 81st session. Not an EU member; no archived joint statement names it; it attended the Hague Group's ministerial meeting of 26 September 2025 (Wikipedia, read), which is attendance and not a statement. 90-minute stop note: finished inside the budget (about 30 minutes on Saint Vincent and the Grenadines). Not filed and why: the 81st session's statement (indirect speech, R4, and no Gaza, R7); the statement of the 78th session (no capture).

### Venezuela

Assessments: has-events 5 (B1, B6, B8, B9, B12), none-found 15, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Leads: 3 (`lead_20261007_VEN_1`, B9, the Foreign Minister's Telegram reply of November 2025 and two official texts that never cite Gaza; `_2`, C2, the continuation of technical cooperation announced on 11 August 2026 with no signed instrument; `_3`, B12, whether the consular mechanism of 11 August 2026 ends the severance). Sources read: the Ministry of Foreign Affairs' publications (mppre.gob.ve: the communiqué of 11 August 2026, the Foreign Minister's statement of 17 June 2025, the reports of 2025 on Gaza), the General Debate statements of the 79th (English) and 80th sessions (Spanish), the acting President's speech of 23 September 2026 (no passage on Gaza), UNISPAL's record of 16 January 2009 (the severance), the review of April 2009 and the President's letter of 2011 (the recognition), the depositary notification of the withdrawal from the Rome Statute, the ICJ's case page. Not an EU member; no archived joint statement names it; it attended the Hague Group's ministerial meeting of 26 September 2025 (attendance). 90-minute stop note: finished inside the budget (about 50 minutes on Venezuela); the Ministry's older publications on Gaza (2024 and early 2025) were not read one by one. Not filed and why: the 80th session's statement and the President's remarks of 7 October 2025 (R7, no Gaza), the Telegram reply (social media), the Ministry's communiqués with no named speaker (R3), the acting President's statement of the 81st session (no Gaza).

### Fiji

Assessments: has-events 3 (B1, B4, C2), none-found 17, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Leads: 3 (`lead_20261007_FJI_1`, B10, the Prime Minister's statement of 13 October 2023 (R7 and 'as permitted by international law') and the Government's statement of 30 October 2023 (no named speaker); `_2`, B10, the Prime Minister's remark of 2 June 2026 that alleged violations are 'none of our business'; `_3`, B6, a possible visit of Israel's Prime Minister). Sources read: the Ministry of Foreign Affairs and External Trade's site (releases on Israel, the General Debate statements, the Prime Minister's ministerial statement), UNISPAL's copy of Fiji's declaration of intervention (read in full), the ICJ's press release of 13 March 2026, the General Debate pages of the 79th and 80th sessions, RNZ, PMN and FBC News. Not an EU member; no archived joint statement names it. 90-minute stop note: finished inside the budget (about 45 minutes on Fiji). Not filed and why: the embassy openings in Jerusalem (17 September 2025) and in Suva (2 June 2026) are not indicators (B-599); the Ambassador's interview (R3).

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-10-07 (methodology 1.0.0-rc.1), the 10 reviewed events scored as if published (the Venezuelan B6 event has scope `related` and adds nothing) and the two recognition rows; before them the generated indicators alone gave −9 (VCT), −27 (VEN) and −36 (FJI).

| Country | Before (generated only) | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| VCT | −9 (−9.5) | −1.6 (−2), with the B8 row alone −6.5 | Passive | B8 +3.0 (the row), B9 +4.9 (the statement of 26 September 2025, 376 days old); the passivity penalty (−15) applies: the B9 event is outside the 365 days; the event of 2024 is decayed to zero |
| VEN | −26.7 (−27, Enabling) | −9.8 (−10), with the B8 row alone −23.7 | Passive | B12 +10.0 (standing since 2009, flagged), B9 +3.9 (17 June 2025, weight 0.77), B8 +3.0; B1 −11.7 (twelve absences) stays; the penalty applies |
| FJI | −36.2 (−36, Enabling) | −56.2 (−56) | Sustaining | B4 −15.0, C2 −30.0 clipped to the category cap −20 (three events, all R18); the events lift the passivity penalty (+15) |

Band changes: Venezuela, Enabling to Passive; Fiji, Enabling to Sustaining. Read critically (docs/06 §4 step 7): Fiji's band needs B4 and two of its three C2 events (B4 alone gives −36.2, one C2 −46.2, both Enabling; the cap makes a third event add nothing), and all three C2 events are flagged under R18 (technical memoranda and a declaration of intent). Venezuela's band rests on B12: without it −19.8 (−20, Passive, on the boundary), without the B9 event about −13.6, without both −23.7 (Enabling); if B6 is scored (scope `gaza`) it gives −19.8 (Passive), and with B12 ended on 11 August 2026 and B6 scored −29.8 (Enabling). The twelve B1 absences (−11.7) may be the loss of Venezuela's vote under Article 19 and not a choice (B-626). Saint Vincent and the Grenadines' band does not depend on any single reading; without the 2025 B9 event it is −6.5 (Passive). The readings with the largest effect are unfiled: Saint Vincent and the Grenadines' Prime Minister's statement of 25 September 2026, if its text cites Gaza with a call, would be a B9 event inside 365 days that ends its passivity penalty (the score would be about +15, Acting).

## T-P21-15: PNG, SLB, VUT (2026-10-07)

Light protocol (docs/06 §5) for Papua New Guinea, Solomon Islands and Vanuatu. 5 events: 3 for Papua New Guinea, 2 for Solomon Islands, none for Vanuatu. Decisions and flags are in docs/10 B-629 to B-640.

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2024_10_07_PNG_B9 | B9 | 2024-10-07 | +2 | confirmed | official |
| evt_2025_08_15_PNG_B10 | B10 | 2025-08-15 | −5 | confirmed | official |
| evt_2025_10_20_PNG_B10 | B10 | 2025-10-20 | −5 | confirmed | official |
| evt_2024_09_27_SLB_B9 | B9 | 2024-09-27 | +5 | confirmed | official |
| evt_2025_09_26_SLB_B9 | B9 | 2025-09-26 | +2 | confirmed | official |

Points are the tier points before decay and weights. B1, D1 and the other generated indicators are left to the build. No row was added to `data/structured/recognitions.csv` (Papua New Guinea's date is disputed and Vanuatu's has no Government document online, B-633, B-635).

### Papua New Guinea

Assessments (34 indicators): has-events 3 (B1, B9, B10), none-found 17, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6 and the three experimental E1 to E3). Leads: 3 (`lead_20261007_PNG_1`, B9, the Prime Minister's release of 25 September 2025 in indirect speech, and the 81st session's statement, unread; `_2`, C2, a representative office announced by Israel with no signed instrument; `_3`, B10, indirect passages of three releases). Sources read: the Prime Minister's Office's releases (pmnec.gov.pg, searched for Israel, Hamas, Gaza, ceasefire, hostages, Palestinian and General Assembly), the Department of Foreign Affairs' releases (dfa.gov.pg), the General Debate statements of the 79th to 81st sessions, UN Meetings Coverage's reports of the votes (GA/12599, GA/12626 and the lists of GA/12572, GA/12667, GA/12707, GA/12739), the ICJ's case pages. Not an EU member; no archived joint statement names it; not in the Hague Group's lists. 90-minute stop note: finished inside the budget (about 30 minutes on Papua New Guinea, part of it waiting for Save Page Now, which was offline). Not filed and why: B8 (no Government document of a recognition), the release of 25 September 2025 and the indirect passages (R4), the releases of 8 October 2023 and 9 October 2025 (no Gaza, R7), the Foreign Minister's words of 3 March 2026 (not a B10 speaker; Iran), the closure of the embassy in Jerusalem (B-599).

### Solomon Islands

Assessments: has-events 2 (B1, B9), none-found 18, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6 and the three experimental E1 to E3). Leads: 1 (`lead_20261007_SLB_1`, B9, Prime Minister Wale's statement to the 81st session, no capture of the file; the press reports no passage on Gaza). Sources read: the General Debate statements of the 79th and 80th sessions and their pages, GA/12712, the Ministry's foreign-affairs news listing (22 September 2023 to 9 May 2025, Wayback), the ICJ's case pages, the press on the 81st session. Not an EU member; no archived joint statement names it. 90-minute stop note: finished inside the budget (about 12 minutes on Solomon Islands). Not filed and why: the 81st session's statement (unread), the Pacific Islands Forum communiqué of September 2025 (no signatory, R3).

### Vanuatu

Assessments: has-events 1 (B1), none-found 18, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 12 (A3, A5 to A8, B8, C4 to C6 and the three experimental E1 to E3). No lead. Sources read: the General Debate statements of the 79th (French) and 80th (the Permanent Representative's) sessions, the Prime Minister's Office's press-release listing and the Ministry's news page (searched for Israel, Gaza, Palestine, Middle East), the ICJ's case pages (Vanuatu filed no written statement and made no oral statement in case 186 and is not on the case 192 list). 90-minute stop note: finished inside the budget (about 10 minutes on Vanuatu). No B9 or B10 event: the statements read have no passage on Gaza.

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-10-07 (methodology 1.0.0-rc.1), the 5 reviewed events scored as if published; before them the generated indicators alone gave −41 (PNG), +3 (SLB) and −9 (VUT).

| Country | Before (generated only) | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| PNG | −41.3 (−41) | −35.3 (−35) | Enabling | B9 +0.5, B10 −9.5 (−4.46 and −5.00), and the passivity penalty (−15) lifted by the event of 20 October 2025, inside the 365 days; B1 −26.3 stays |
| SLB | +2.5 (+3) | +4.5 (+4) | Acting | B9 +1.95 (the 2025 event, 376 days old); the penalty (−15) still applies; the 2024 event is expired |
| VUT | −9.0 (−9) | −9.0 (−9) | Passive | no event |

No band changes. Read critically (docs/06 §4 step 7): Papua New Guinea's number depends on the 20 October 2025 B10 reading (without it −45.3, without both B10 events −40.8; every case is Enabling) and the event is a qualifying event, so a negative event raises the score by ending the passivity penalty (B-630, B-638). The three scores are dominated by B1 (−26.3, +17.5, +6.0).
