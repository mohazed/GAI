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
| evt_2026_01_27_KAZ_C2 | C2 | 2026-01-27 | −10 | confirmed (was corroborated; the Ministry's release archived 2026-11-04, B-853) | official, press |
| evt_2026_01_27_KAZ_C2_2 | C2 | 2026-01-27 | −10 | confirmed (was corroborated; the Ministry's release archived 2026-11-04, B-853) | official, press |
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

## T-P21-16: FSM, KIR, MHL (2026-10-13)

Light protocol (docs/06 §5) for the Federated States of Micronesia, Kiribati and the Marshall Islands. 1 event: none for the Federated States of Micronesia, none for Kiribati, 1 for the Marshall Islands. Decisions and flags are in docs/10 B-641 to B-650.

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2024_09_25_MHL_B9 | B9 | 2024-09-25 (expired) | +5 | confirmed | official |

Points are the tier points before decay and weights. B1, D1 and the other generated indicators are left to the build. No row was added to `data/structured/recognitions.csv` (none of the three recognises Palestine, B-645).

### Federated States of Micronesia

Assessments (34 indicators): has-events 1 (B1), none-found 19, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6 and the three experimental E1 to E3). Leads: 2 (`lead_20261013_FSM_1`, B9, the President's statement of 26 September 2024 on 'the conflict between Israel and Palestine', which never names Gaza; `_2`, B10, the Permanent Mission's and the Government's statements of support for Israel, none by a B10 speaker or in direct speech). Sources read: the FSM Government's site (gov.fm, searched for Israel, Gaza, Palestine, Hamas, ceasefire and Middle East), the Permanent Mission's site (unmission.fm, every post mentioning Israel, Gaza, Palestin, Hamas, antisemit, hostage or Middle East), the General Debate statements of the 79th to 81st sessions, the ICJ's and the ICC's lists. Not an EU member; no archived joint statement names it. 90-minute stop note: finished inside the budget (about 15 minutes on the Federated States of Micronesia). Not filed and why: the President's statement of 26 September 2024 (R7), the Permanent Mission's statements of 1 November 2023, 30 April 2026 and 9 September 2026 (R3), the Government's reports of 5 March and 28 April 2025 (R4, R3), the Vice-President's 81st-session statement (R3, no Gaza).

### Kiribati

Assessments: has-events 1 (B1), none-found 19, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). No lead. Sources read: the Ministry of Foreign Affairs and Immigration's site (40 posts, searched), the Office of Te Beretitenti's site, the General Debate statements of the 79th (the Permanent Representative's), 80th and 81st sessions, UN Meetings Coverage's report of 18 September 2024, the ICJ's and the ICC's lists (Kiribati is a state party). Not an EU member; no archived joint statement names it. 90-minute stop note: finished inside the budget (about 10 minutes on Kiribati). No B9 or B10 event: the statements read have no passage on Gaza, Palestine or Israel. Flagged: no vote recorded on 9 of the 12 qualifying votes, the reason not stated (Article 19 check to P-23, B-643).

### Marshall Islands

Assessments: has-events 2 (B1, B9), none-found 18, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). No lead. Sources read: the President's General Debate statements of the 79th to 81st sessions, UN Meetings Coverage's report of 12 June 2025, the ICJ's and the ICC's lists (a state party), the Embassy in Washington's pages; no site of the Ministry or of the Office of the President could be reached (B-646). Not an EU member; no archived joint statement names it. 90-minute stop note: finished inside the budget (about 15 minutes on the Marshall Islands). Not filed and why: the 80th and 81st sessions' statements (no passage on Gaza).

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-10-13 (methodology 1.0.0-rc.1), the one reviewed event scored as if published; before it the generated indicators alone gave −37 (FSM), −27 (KIR) and −11 (MHL).

| Country | Before (generated only) | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| FSM | −36.9 (−37) | −36.9 (−37) | Enabling | no event; B1 −21.9 and the passivity penalty (−15) |
| KIR | −26.5 (−27) | −26.5 (−27) | Enabling | no event; B1 −11.5 (nine absences) and the penalty |
| MHL | −11.2 (−11) | −11.2 (−11) | Passive | the B9 event is 748 days old, expired; B1 +3.8 and the penalty |

No band changes. Coverage rises from 13% to 67% for each. Read critically (docs/06 §4 step 7): all three scores are B1 and the passivity penalty; a qualifying event within 365 days would add 15 (less the event's own points), so the readings with the largest effect are the unread 81st-session texts and Kiribati's nine absences (B-643, B-648).

## T-P21-17: NRU, PLW, LBY (2026-10-13)

Light protocol (docs/06 §5) for Nauru (Naoero), Palau and Libya. 4 events: none for Nauru, none for Palau, 4 for Libya (one expired). Decisions and flags are in docs/10 B-651 to B-661.

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2024_05_10_LBY_B3 | B3 | 2024-05-10 | +15 | confirmed | court |
| evt_2024_09_25_LBY_B9 | B9 | 2024-09-25 (expired) | +5 | confirmed | official |
| evt_2025_09_25_LBY_B9 | B9 | 2025-09-25 | +5 | confirmed | official |
| evt_2026_04_30_LBY_B9 | B9 | 2026-04-30 | +5 | confirmed | official |

Points are the tier points before decay and weights. B1, D1 and the other generated indicators are left to the build. No row was added to `data/structured/recognitions.csv` (Nauru and Palau do not recognise Palestine; Libya has no document of its recognition of 1988 that could be read, B-654). All 36 qualifying votes of the three countries are recorded, so no Article 19 note is needed (B-654).

### Nauru

Assessments (34 indicators): has-events 1 (B1), none-found 19, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6 and the three experimental E1 to E3). Leads: 1 (`lead_20261013_NRU_1`, B10, the Vice President and Foreign Minister's 'Our support for Israel has been unwavering' at the opening of the embassy in Jerusalem, 7 September 2026: press only, no Gaza, R7). Sources read: the Government Information Office's releases and pages (through Wayback captures and the CDX index of `nauru.gov.nr`), the President's General Debate statements of the 79th and 80th sessions (archived, no passage on Gaza), the Government's release of 22 July 2026 on an embassy in Israel (archived), the UN Meetings Coverage reports of the votes, the ICJ's case 192 and case 186 pages, the Assembly of States Parties' list (Nauru is a party), and press reports on the embassy. The EU Council listings do not apply and no archived joint statement names Nauru. 90-minute stop note: finished inside the budget (about 15 minutes on Nauru). The embassy's establishment and opening are notes, not events (B-599); Nauru voted no on 11 of the 12 qualifying votes and abstained on one.

### Palau

Assessments: has-events 1 (B1), none-found 19, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Leads: 2 (`lead_20261013_PLW_1`, B10, the President's letter of October 2023, 'stand in solidarity with Israel', expired; `_2`, B10, the President's press conference of September 2025 defending the vote on a resolution endorsing Palestinian statehood: both known from the Island Times alone). Sources read: the General Debate statements of the 79th (delivered by the Senior Vice President and Minister of Justice), 80th (the President's: 'two peoples, Israelis and Palestinians', no Gaza) and 81st sessions, the Government's site (`palaugov.pw`, HTTP 403 to scripted requests; Wayback captures and the CDX index), the ICJ's and the ICC's lists (Palau is not a party), UN Meetings Coverage reports of the votes and web searches in English (no result in Palauan). The EU Council listings do not apply and no archived joint statement names Palau. 90-minute stop note: finished inside the budget (about 15 minutes on Palau). Palau voted no on 9 of the 12 qualifying votes and abstained on three; the embassy-in-Israel history named in the prompt was not found in any source and is not an indicator act in any case (B-599).

### Libya

Assessments: has-events 3 (B1, B3, B9), none-found 16, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 12 (A3, A5 to A8, B8, C4 to C6, E1 to E3). Leads: 4 (`lead_20261013_LBY_1`, B9, the Acting Foreign Minister's remarks of 24 and 25 September 2026 and 12 October 2026 in the Ministry's indirect-speech reports; `_2`, B9, the President's 81st statement, 'Palestine' without Gaza, R7; `_3`, B9, statements of October 2023 to January 2024 known from the press, expired; `_4`, A8, the refusal of vessels that had called at Haifa, November 2023, not an arms transit). Sources read: the Ministry of Foreign Affairs and International Cooperation's site (WordPress search in Arabic and English; posts from July 2026 only), the Libyan News Agency's search, the General Debate statements of the 79th to 81st sessions (the Arabic files; the Assembly's verbatim record A/79/PV.9), the ICJ press release and declaration of intervention of 10 May 2024 (UNISPAL copies), the joint statement of 30 April 2026 already archived for Brazil, the votes' press releases (the representative's statement of 12 June 2025), the ICC's list (Libya is not a party), UNRWA's tables (no row) and searches in English and Arabic. Libya has two rival governments: the speakers are those of the government that represents Libya at the UN, the Presidential Council's President, the Prime Minister of the Government of National Unity and the Foreign Minister (acting, Taher El-Baour). 90-minute stop note: finished inside the budget (about 40 minutes on Libya). Flagged: the actor's name on the joint statement of 30 April 2026 is inferred from the continuity of the post (B-651); the Arabic quote of the 80th statement is the archived text layer with reversed ligatures, beside the session's translation; the 2025 statement is 383 days old and does not end the passivity penalty.

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-10-13 (methodology 1.0.0-rc.1), the 4 reviewed events scored as if published; before them the generated indicators alone gave +2.3 (+2, Acting) for Libya, −40.8 (−41, Enabling) for Nauru and −42.7 (−43, Enabling) for Palau.

| Country | Before (generated only) | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| LBY | +2.3 (+2) | +42.1 (+42) | Confronting | B3 +15.0 and B9 +9.8 (April 2026 +5.0, September 2025 +4.8; the 2024 event is expired); the April 2026 event, the only qualifying one inside 365 days, ends the passivity penalty (+15) |
| NRU | −40.8 (−41) | −40.8 (−41) | Enabling | no event; B1 −25.8 and the passivity penalty (−15) |
| PLW | −42.7 (−43) | −42.7 (−43) | Enabling | no event; B1 −27.7 and the passivity penalty (−15) |

One band change: Libya moves from Acting to Confronting, clearing the threshold (41) by 1.1 points. It rests on three flagged items: without the April 2026 event (the minister's name is inferred) the score is +22.1 (Acting); without B3, +27.1 (Acting); without the 2025 statement, +37.3 (Acting). Coverage rises from 13% to 63% (Libya) and 67% (Nauru, Palau). Read critically (docs/06 §4 step 7): no cap is hit (Libya's category B is +42.1 of +45); for Nauru and Palau a qualifying event within 365 days would end the penalty (+15), so the readings with the largest effect are the unfiled B10 leads (B-659, B-661).

## T-P21-18: SDN, TUN, EST (2026-10-13)

Light protocol (docs/06 §5) for the Sudan, Tunisia and Estonia, resuming a cut-off attempt (24 captures re-fetched from Wayback, SHA-256 and byte count equal to the index rows; two source dates corrected, B-662). 28 events: 2 for the Sudan, 9 for Tunisia, 17 for Estonia. Decisions and flags are in docs/10 B-662 to B-672.

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2024_09_26_SDN_B9 | B9 | 2024-09-26 (expired) | +2 | confirmed | official |
| evt_2025_03_04_SDN_B9 | B9 | 2025-03-04 | +2 | confirmed | official |
| evt_2023_10_18_TUN_B9 | B9 | 2023-10-18 (expired) | +5 | confirmed | official |
| evt_2023_12_12_TUN_B9 | B9 | 2023-12-12 (expired) | +5 | confirmed | official |
| evt_2024_01_20_TUN_B9 | B9 | 2024-01-20 (expired) | +5 | confirmed | official |
| evt_2024_02_27_TUN_B9 | B9 | 2024-02-27 (expired) | +5 | confirmed | official |
| evt_2023_12_03_TUN_D4 | D4 | 2023-12-03 (expired) | +5 | corroborated | press |
| evt_2024_09_27_TUN_B9 | B9 | 2024-09-27 (expired) | +5 | confirmed | official |
| evt_2025_09_27_TUN_B9 | B9 | 2025-09-27 | +5 | confirmed | official |
| evt_2026_02_23_TUN_B9 | B9 | 2026-02-23 | +5 | confirmed | official |
| evt_2026_09_26_TUN_B9 | B9 | 2026-09-26 | +5 | confirmed | official, press |
| evt_2023_12_31_EST_D3 | D3 | 2023-12-31 (ended 2024-01-28) | +8 | confirmed | dataset |
| evt_2024_01_28_EST_D2 | D2 | 2024-01-28 (ended 2024-05-07) | −10 | corroborated | press |
| evt_2024_02_19_EST_B9 | B9 | 2024-02-19 (expired) | +2 | confirmed | official |
| evt_2024_04_19_EST_B11 | B11 | 2024-04-19 | +5 (west-bank, unscored) | confirmed | official |
| evt_2024_05_07_EST_D3 | D3 | 2024-05-07 (ended 2024-12-31) | +5 | confirmed | official |
| evt_2024_07_15_EST_B11 | B11 | 2024-07-15 | +5 | confirmed | official |
| evt_2024_09_24_EST_B9 | B9 | 2024-09-24 (expired) | +2 | confirmed | official |
| evt_2024_12_31_EST_D3 | D3 | 2024-12-31 | +8 | confirmed | dataset |
| evt_2025_05_19_EST_B9 | B9 | 2025-05-19 | +2 | confirmed | official |
| evt_2025_06_10_EST_B9 | B9 | 2025-06-10 | +5 | confirmed | official |
| evt_2025_07_21_EST_B9 | B9 | 2025-07-21 | +5 | confirmed | official |
| evt_2025_08_06_EST_B9 | B9 | 2025-08-06 | +5 | confirmed | official, press |
| evt_2025_08_12_EST_B9 | B9 | 2025-08-12 | +5 | confirmed | official |
| evt_2025_08_21_EST_B9 | B9 | 2025-08-21 | +5 (west-bank, unscored) | confirmed | official |
| evt_2025_09_24_EST_B9 | B9 | 2025-09-24 | +5 | confirmed | official |
| evt_2026_05_28_EST_B11 | B11 | 2026-05-28 | +5 | confirmed | official |
| evt_2026_06_08_EST_B9 | B9 | 2026-06-08 | +2 | confirmed | official |

Points are the tier points before decay and weights. B1, D1 and the other generated indicators are left to the build. No row was added to `data/structured/recognitions.csv` (Sudan 1988 and Tunisia 1988 have no document that could be read; Estonia does not recognise Palestine). All 36 qualifying votes of the three countries are recorded, so no Article 19 note is needed; Tunisia's one non-vote (A/DEC/80/506, 12 September 2025) is a recorded non-vote, and Tunisia is not among the four Member States in arrears in A/80/362 (B-663).

### Sudan

Assessments (34 indicators): has-events 2 (B1, B9), none-found 18, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6 and the three experimental E1 to E3). No lead. Sources read: the General Debate statements of the 79th (the Assembly's verbatim record A/79/PV.11) and 80th sessions (the Prime Minister's, through the Sudan News Agency and the UN's page), the Sudan News Agency's texts of the speeches at the Cairo (4 March 2025) and Doha (15 September 2025) summits, the ICJ's and the ICC's lists (the Sudan is on neither), UNRWA's donor tables (no row), and web searches in Arabic and English for each indicator group; the Ministry of Foreign Affairs serves no site (mfa.gov.sd refuses the connection, its Wayback capture is a hosting default page) and the news agency's search does not return a result list to a scripted request. The Sudan has two rival authorities: the speakers are those of the government that represents it at the UN. 90-minute stop note: finished inside the budget (about 40 minutes on the Sudan). Not filed and why: the Doha speech and the Prime Minister's 80th statement (Gaza is cited without a call or a named violation), the Foreign Ministry's communiqués (no named speaker, R3), the Baghdad summit (led by a member of the Sovereignty Council, not a B9 speaker).

### Tunisia

Assessments: has-events 3 (B1, B9, D4), none-found 17, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Leads: 4 (`lead_20261013_TUN_1`, B9, the President's statements of 22 July and 2 October 2025 relayed in indirect speech; `_2`, B9, the Minister's delivery of the President's speech at the Cairo summit of 4 March 2025, La Presse; `_3`, B9, the Ministry's reports of 26 December 2024 and 14 January 2025 in indirect speech; `_4`, B9, its reports of 26 August, 5 September and 16 September 2025). Sources read: the Ministry of Foreign Affairs' content API (back.diplomatie.gov.tn: 427 posts read of ids 1 to 1400, in six ranges, screened for Gaza, Palestine, Israel and UNRWA; see B-667), the General Debate statements of the 79th to 81st sessions, the Human Rights Council statement of 23 February 2026, La Presse, Kapitalis, Le Courrier de l'Atlas, Webdo, L'Economiste Maghrébin and Arab News, the ICJ's and the ICC's lists (Tunisia is a state party), UNRWA's donor tables (no row), and web searches in French, Arabic and English. The 2023 bill to criminalise normalisation with Israel was not enacted: its plenary debate was suspended in November 2023 and the deputies were still calling for its approval on 7 October 2025 (archived); a draft bill is not an event. 90-minute stop note: finished inside the budget (about 70 minutes on Tunisia). Flagged: the speaker of the 81st-session statement is established by La Presse and Arab News, not by the Ministry's text; the Arabic text layers of the 79th and 80th statements are broken (quotes kept verbatim with own translations); the D4 event rests on two press publishers and the numbers of wounded differ (29 and 20 on 3 December 2023).

### Estonia

Assessments: has-events 6 (B1, B9, B11, D1, D2, D3), none-found 14, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Leads: 3 (`lead_20261013_EST_1`, B9, the Ministry's reports of 11 and 23 September 2025 in indirect speech; `_2`, B5, ERR's report of the press conference of 26 November 2024 on the ICC warrants; `_3`, B9, the Ministry's report of 16 May 2026). Estonia is an EU member: the Council's three settler listings are B11 events (19 April 2024 west-bank unscored, 15 July 2024, 28 May 2026) and the joint statements already archived that name it are B9 events (B-515 to B-540 route, B-446). Sources read: the Ministry's, the President's and the Government Office's sites, the General Debate statements of the 78th to 81st sessions (the 79th through A/79/PV.8, the 80th through the President's Office), UNRWA's donor tables of 2022 to 2024, ERR News and the Jerusalem Post, the ICJ's and the ICC's lists (Estonia is a state party). 90-minute stop note: finished inside the budget (about 60 minutes on Estonia). Not filed and why: the President in Amman on 4 November 2024 and the Foreign Minister's remarks of 7 October 2024, 11 November 2025 and 17 March 2026 (no Gaza, or no call or violation), the 81st-session statement (a past position, no call), the Undersecretary's statement of 30 July 2025 (not a B9 speaker, R3).

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-10-13 (methodology 1.0.0-rc.1), the 28 reviewed events scored as if published; before them the generated indicators alone gave +2.3 (SDN, Acting), −2.4 (TUN, Passive) and +0.4 (EST, Passive).

| Country | Before (generated only) | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| SDN | +2.3 (+2) | +3.4 (+3) | Acting | B9 +1.1 (the Cairo summit event at weight 0.54; the 2024 event is expired); the passivity penalty (−15) still applies |
| TUN | −2.4 (−2) | +22.6 (+23) | Acting | B9 reaches its cap (+10.0 of +14.8 summed) and the events of 23 February and 26 September 2026 each end the passivity penalty (+15); D4 and the 2023 and 2024 B9 events are expired |
| EST | +0.4 (0) | +38.4 (+38) | Acting | B9 reaches its cap (+10.0 of +24.7), D3 +8.0, B11 +5.0, and the events of 28 May and 8 June 2026 end the passivity penalty (+15) |

Two band changes. Tunisia moves from Passive to Acting: without the two 2026 events the score is +2.4 (Acting, penalty applied), so the band holds on the 80th-session event alone. Estonia moves from Passive to Acting at +38.4, 2.6 points under the Confronting threshold (41); without the two 2026 events (28 May and 8 June) the penalty applies and the score is about 15 points lower (Acting); the President's statement of 6 August 2025 (flagged, +5 or +2) changes nothing, B9 being capped. Coverage rises from 13% to 67% for each. Read critically (docs/06 §4 step 7): the cap on B9 hides most of Estonia's and Tunisia's B9 events; the readings with the largest effect are the Tunisian 81st-session speaker (B-665) and, for Estonia, the unconditional-support check of B10 (none found).

## T-P21-19: FIN, ISL, LTU (2026-10-13)

Light protocol (docs/06 §5) for Finland, Iceland and Lithuania. No cut-off attempt had left work in the tree. 56 events: 21 for Finland, 22 for Iceland, 13 for Lithuania. Decisions and flags are in docs/10 B-674 to B-684.

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2024_01_27_FIN_D2 | D2 | 2024-01-27 (ended 2024-03-22) | −10 | confirmed | official |
| evt_2024_02_19_FIN_B9 | B9 | 2024-02-19 (expired) | +2 | confirmed | official |
| evt_2024_02_29_FIN_C2 | C2 | 2024-02-29 | −10 | reported | press |
| evt_2024_03_22_FIN_D3 | D3 | 2024-03-22 | +5 | confirmed | dataset, official |
| evt_2024_04_19_FIN_B11 | B11 | 2024-04-19 (west-bank, unscored) | +5 | confirmed | official |
| evt_2024_07_15_FIN_B11 | B11 | 2024-07-15 | +5 | confirmed | official |
| evt_2025_05_19_FIN_B9 | B9 | 2025-05-19 | +2 | confirmed | official |
| evt_2025_05_20_FIN_C1 | C1 | 2025-05-20 | +4 | confirmed | official |
| evt_2025_05_22_FIN_B9 | B9 | 2025-05-22 | +5 | confirmed | official |
| evt_2025_07_21_FIN_B9 | B9 | 2025-07-21 | +5 | confirmed | official |
| evt_2025_08_12_FIN_B9 | B9 | 2025-08-12 | +5 | confirmed | official |
| evt_2025_08_21_FIN_B9 | B9 | 2025-08-21 (west-bank, unscored) | +5 | confirmed | official |
| evt_2025_08_25_FIN_B9 | B9 | 2025-08-25 | +5 | confirmed | official |
| evt_2025_09_24_FIN_B9 | B9 | 2025-09-24 | +5 | confirmed | official |
| evt_2025_09_27_FIN_B9 | B9 | 2025-09-27 | +2 | confirmed | official |
| evt_2025_09_30_FIN_B9 | B9 | 2025-09-30 | +5 | confirmed | official |
| evt_2025_12_30_FIN_B9 | B9 | 2025-12-30 | +2 | confirmed | official |
| evt_2026_02_24_FIN_B9 | B9 | 2026-02-24 (west-bank, unscored) | +5 | confirmed | official |
| evt_2026_05_28_FIN_B11 | B11 | 2026-05-28 | +5 | confirmed | official |
| evt_2026_06_08_FIN_B9 | B9 | 2026-06-08 | +2 | confirmed | official |
| evt_2026_09_08_FIN_B9 | B9 | 2026-09-08 (west-bank, unscored) | +5 | confirmed | official |
| evt_2023_12_31_ISL_D3 | D3 | 2023-12-31 (ended 2024-01-30) | +8 | confirmed | dataset |
| evt_2024_01_30_ISL_D2 | D2 | 2024-01-30 (ended 2024-03-19) | −10 | confirmed | official |
| evt_2024_03_19_ISL_D3 | D3 | 2024-03-19 (ended 2024-12-31) | +5 | confirmed | official |
| evt_2024_12_31_ISL_D3 | D3 | 2024-12-31 | +8 | confirmed | dataset |
| evt_2025_05_07_ISL_B9 | B9 | 2025-05-07 | +5 | confirmed | official |
| evt_2025_05_16_ISL_B9 | B9 | 2025-05-16 | +5 | confirmed | official |
| evt_2025_05_19_ISL_B9 | B9 | 2025-05-19 | +2 | confirmed | official |
| evt_2025_07_21_ISL_B9 | B9 | 2025-07-21 | +5 | confirmed | official |
| evt_2025_07_29_ISL_B9 | B9 | 2025-07-29 | +5 | confirmed | official |
| evt_2025_08_10_ISL_B9 | B9 | 2025-08-10 | +5 | confirmed | official |
| evt_2025_08_12_ISL_B9 | B9 | 2025-08-12 | +5 | confirmed | official |
| evt_2025_08_21_ISL_B9 | B9 | 2025-08-21 (west-bank, unscored) | +5 | confirmed | official |
| evt_2025_08_29_ISL_B9 | B9 | 2025-08-29 | +5 | confirmed | official |
| evt_2025_09_27_ISL_B9 | B9 | 2025-09-27 | +5 | confirmed | official |
| evt_2025_12_24_ISL_B9 | B9 | 2025-12-24 (west-bank, unscored) | +5 | confirmed | official |
| evt_2025_12_30_ISL_B9 | B9 | 2025-12-30 | +2 | confirmed | official |
| evt_2026_01_05_ISL_B9 | B9 | 2026-01-05 | +2 | confirmed | official |
| evt_2026_01_28_ISL_B9 | B9 | 2026-01-28 | +2 | confirmed | official |
| evt_2026_02_24_ISL_B9 | B9 | 2026-02-24 (west-bank, unscored) | +5 | confirmed | official |
| evt_2026_03_11_ISL_B3 | B3 | 2026-03-11 | +15 | confirmed | court, official |
| evt_2026_06_08_ISL_B9 | B9 | 2026-06-08 | +2 | confirmed | official |
| evt_2026_09_08_ISL_B9 | B9 | 2026-09-08 (west-bank, unscored) | +5 | confirmed | official |
| evt_2023_12_31_LTU_D3 | D3 | 2023-12-31 (ended 2024-12-31) | +8 | confirmed | dataset |
| evt_2024_02_19_LTU_B9 | B9 | 2024-02-19 (expired) | +2 | confirmed | official |
| evt_2024_04_19_LTU_B11 | B11 | 2024-04-19 (west-bank, unscored) | +5 | confirmed | official |
| evt_2024_07_15_LTU_B11 | B11 | 2024-07-15 | +5 | confirmed | official |
| evt_2024_12_31_LTU_D3 | D3 | 2024-12-31 | +8 | confirmed | dataset |
| evt_2025_05_19_LTU_B9 | B9 | 2025-05-19 | +2 | confirmed | official |
| evt_2025_07_21_LTU_B9 | B9 | 2025-07-21 | +5 | confirmed | official |
| evt_2025_08_12_LTU_B9 | B9 | 2025-08-12 | +5 | confirmed | official |
| evt_2025_08_21_LTU_B9 | B9 | 2025-08-21 (west-bank, unscored) | +5 | confirmed | official |
| evt_2025_08_29_LTU_B9 | B9 | 2025-08-29 | +2 | confirmed | official |
| evt_2025_09_24_LTU_B9 | B9 | 2025-09-24 | +2 | confirmed | official |
| evt_2025_09_27_LTU_B9 | B9 | 2025-09-27 | +2 | confirmed | official |
| evt_2026_05_28_LTU_B11 | B11 | 2026-05-28 | +5 | confirmed | official |

Points are the tier points before decay and weights. B1, D1, A1, A4, B8 and the other generated indicators are left to the build (Iceland's B8 comes from the row added to `data/structured/recognitions.csv`, B-677 (4)). The EU members (Finland, Lithuania) have the Council's three listings as B11 events and the joint statements already archived as B9 events; Iceland, which is not an EU member, has the statements named in its own Government's texts as well. All 36 qualifying votes of the three countries are recorded (Finland yes 10 and abstained 2, Iceland yes 11 and abstained 1, Lithuania yes 6 and abstained 6), so **no missing vote and no Article 19 note is needed**.

### Finland

Assessments (34 indicators): has-events 8 (B1, B9, B11, C1, C2, D1, D2, D3), none-found 12, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Leads: 1 (`lead_20261013_FIN_1`, D2, the announcement of 27 August 2026 that Finland will not renew its UNRWA agreement). Sources read: the Ministry's and the Government's pages (valtioneuvosto.fi, um.fi: a Cloudflare challenge; read through Wayback replays and recorded with `--capture`), the President's site, the General Debate statements of the 78th to 81st sessions (the 80th archived with the UN's page), the Foreign Minister's speech to Parliament of 22 May 2025 (Finnish), the Prime Minister's reply to the interpellation of 30 September 2025 (Finnish), the SIPRI register, the ICJ's and the ICC's lists (Finland is a state party), UNRWA's donor tables, Yle and Globes on the defence memorandum. 90-minute stop note: finished inside the budget (about 70 minutes on Finland). Flagged: the C2 event rests on one press origin and decides the band (B-676); the 25 August 2025 speech and the 24 September 2025 statement are filed at +5 on a legal-term-free reading and a 'check against delivery' file confirmed by the UN's summary. Not filed and why: the President's 81st statement (no call), the D2 for the end of UNRWA funding (no payment withheld), the David's Sling contract (A4, TIV 0), statements of 2023 and February 2024 (expired).

### Iceland

Assessments: has-events 7 (B1, B3, B8, B9, D1, D2, D3), none-found 14, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 10 (A3, A5 to A8, C5, C6, E1 to E3). Leads: 3 (`lead_20261013_ISL_1` to `_3`: the entry ban on two Israeli ministers, the free trade agreement not to be updated, the labelling of goods from the occupied territories, all announced on 8 September 2025 and known from the press only). Sources read: the Government's news search (about 100 items on Gaza, Palestine, Israel and UNRWA, in Icelandic) and the English statements, the Foreign Minister's report to the Althing (Wayback), the declaration of intervention (a scan: OCR), the General Debate statements, UNRWA's donor tables, the SIPRI register, the ICJ's and the ICC's lists (Iceland is a state party). 90-minute stop note: finished inside the budget (about 80 minutes on Iceland). Flagged: B3 is read from an OCR text and decides the band (B-677 (2)); the R21 row rests on the Foreign Minister's report (the date of diplomatic relations 'which involves recognition'); the evacuations of permit holders are not D4 or D5 events (B-678 (3)); the joint statements filed for Iceland and not for their other signatories (B-674 (6)). Not filed and why: the address of 26 September 2026 (no archived copy), the Paris conference remarks of 12 June 2026 (indirect speech), the statements of 2023 and 2024 (expired).

### Lithuania

Assessments: has-events 6 (A4, B1, B9, B11, D1, D3), none-found 14, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Leads: 3 (`lead_20261013_LTU_1` to `_3`: the conflicting reports on a UNRWA hold, the Ministry's commentary on the warrants, the Foreign Minister's remarks of 16 September 2025). Sources read: the Ministry's release of 29 August 2025 (a Wayback capture: urm.lt answers a bot check and Save Page Now fails with HTTP 403), LRT English and BNS, LSM, the General Debate statements (the 80th archived and read by OCR), UNRWA's donor tables, the SIPRI register, the ICJ's and the ICC's lists (Lithuania is a state party). 90-minute stop note: finished inside the budget (about 60 minutes on Lithuania). Flagged: both own B9 events are at the call tier on 'all sides' and 'implementation of the ceasefire' wording; no D2 event because the reports conflict; no C1 event because Lithuania opposed the review. Not filed and why: the 81st statement (no call; no Wayback capture), the Foreign Minister's remarks to lawmakers (press only), the June 2026 visit to Israel and Palestine (Ministry pages blocked).

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-10-13 (methodology 1.0.0-rc.1), the 56 reviewed events scored as if published; before them the generated indicators alone gave +2.3 (+2, Acting) for Finland, +2.3 (+2, Acting) for Iceland and −3.5 (−4, Passive) for Lithuania.

| Country | Before (generated only) | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| FIN | +2.3 (+2) | +37.3 (+37) | Acting | B9 +10.0 (cap; summed +33.5), B11 +5.0, C1 +4.0, D3 +5.0, C2 −4.0 (`reported`); the events of 30 December 2025, 28 May and 8 June 2026 end the passivity penalty (+15) |
| ISL | +2.3 (+2) | +53.0 (+53) | Confronting | category B +45.3 clipped to +45.0 (B9 +10.0 capped from +42.7, B3 +15.0, B8 +3.0, B1 +17.3), D3 +8.0; five 2025-26 events end the penalty (+15) |
| LTU | −3.5 (−4) | +34.5 (+34) | Acting | B9 +10.0 (capped from +15.6), B11 +5.0, D3 +8.0, A4 −2.0; the 28 May 2026 listing, which adds no points beyond the standing state of 15 July 2024, is the only qualifying event and ends the penalty (+15) |

Two band changes: Iceland from Acting to Confronting, held by one reading (B3): without it the score is +38.3 (Acting), 2.7 under the threshold (41); Lithuania from Passive to Acting at +34.5, and without the 28 May 2026 listing the penalty applies and the score is +19.5 (Acting). Finland stays Acting (+2 to +37) but sits 3.7 points under the threshold with the C2 event and 0.3 over it without (+41.3, Confronting): the reading with the largest effect (B-676). Coverage rises from 13% to 67% (Finland, Lithuania) and 70% (Iceland). Read critically (docs/06 §4 step 7): B9 is capped for all three, so the call-tier and flagged tiers move nothing; for Lithuania the cap hides a +5.6 surplus.

## T-P21-20: LVA, TON, TUV (2026-10-14)

Light protocol (docs/06 §5) for Latvia, Tonga and Tuvalu. A cut-off attempt of 2026-10-13 had left 11 captures, source records, Latvia's events, the three assessments and the `gov_sources` in the working tree: they were kept after every replay was fetched again (SHA-256 and byte count equal to the index rows), every source record was checked against its text and every quotation validated; two wordings (B10 reasons) and one lead (Tonga's) were corrected (docs/10 B-685). 16 events, all for Latvia: none for Tonga and Tuvalu. Decisions and flags are in docs/10 B-685 to B-693.

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2023_12_31_LVA_D3 | D3 | 2023-12-31 (ended 2024-01-29) | +8 | confirmed | dataset |
| evt_2024_01_29_LVA_D2 | D2 | 2024-01-29 (ended 2024-05-27) | −10 | corroborated | press |
| evt_2024_02_19_LVA_B9 | B9 | 2024-02-19 (expired) | +2 | confirmed | official |
| evt_2024_04_19_LVA_B11 | B11 | 2024-04-19 (west-bank, unscored) | +5 | confirmed | official |
| evt_2024_05_27_LVA_D3 | D3 | 2024-05-27 (ended 2024-12-31) | +5 | reported | press |
| evt_2024_07_15_LVA_B11 | B11 | 2024-07-15 | +5 | confirmed | official |
| evt_2024_09_24_LVA_B9 | B9 | 2024-09-24 (expired) | +2 | confirmed | official |
| evt_2024_12_31_LVA_D3 | D3 | 2024-12-31 | +8 | confirmed | dataset |
| evt_2025_05_19_LVA_B9 | B9 | 2025-05-19 | +2 | confirmed | official |
| evt_2025_07_02_LVA_B9 | B9 | 2025-07-02 | +2 | confirmed | official |
| evt_2025_07_21_LVA_B9 | B9 | 2025-07-21 | +5 | confirmed | official |
| evt_2025_08_05_LVA_B9 | B9 | 2025-08-05 | +2 | confirmed | official |
| evt_2025_08_12_LVA_B9 | B9 | 2025-08-12 | +5 | confirmed | official |
| evt_2025_08_21_LVA_B9 | B9 | 2025-08-21 (west-bank, unscored) | +5 | confirmed | official |
| evt_2025_09_24_LVA_B9 | B9 | 2025-09-24 | +2 | confirmed | official |
| evt_2026_05_28_LVA_B11 | B11 | 2026-05-28 | +5 | confirmed | official |

Points are the tier points before decay and weights. B1, D1, A1, A4, B2, B8 and the other generated indicators are left to the build. Latvia is an EU member: the Council's three listings are B11 events and the five joint statements already archived that name it are B9 events (B-686).

### Latvia

Assessments (34 indicators): has-events 7 (A4, B1, B9, B11, D1, D2, D3), none-found 14, no-data 2 (A2, C3), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Leads: 3 (`lead_20261014_LVA_1` to `_3`: the Foreign Minister's briefing of 28 August 2025, the Ministry's report of the Council of 11 August 2025, the Ministry's statement on the arrest warrants). Sources read: the Ministry, the Cabinet and the President's sites, LSM (Latvian and English), the Baltic Times (LETA), TVNET, Re:Baltica, ERR, the General Debate statements of the 78th to 81st sessions (the 79th and 80th read by OCR), the archived joint statements, the Council's listings, UNRWA's tables, the SIPRI register, the ICJ's and the Assembly of States Parties' pages. Stop note: about 85 minutes of research, inside the 90-minute budget.

### Tonga

Assessments: has-events 1 (B1), none-found 19, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11. Leads: 2 (`lead_20261014_TON_1` and `_2`: the Prime Minister's remarks of 3 October 2025 and the Government's reasons for its vote of 27 October 2023, press only). Sources read: the national portal (gov.to), the General Debate statements of the 78th to 81st sessions, Matangi Tonga, Kaniva Tonga, Islands Business, the generated tables. Stop note: about 25 minutes of research.

### Tuvalu

Assessments: has-events 1 (B1), none-found 19, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11. No lead. Sources read: the Permanent Mission to the UN (un.int/tuvalu), the General Debate statements of the 78th to 81st sessions (no passage on Gaza; they ask that Taiwan take part in the UN system), the generated tables. Stop note: about 20 minutes of research.

### Article 19 note (report only)

Latvia: all 12 qualifying votes recorded. Tonga: no vote on 2 of 12 (A/RES/ES-10/23, A/RES/80/1). Tuvalu: no vote on 6 of 12 (A/RES/ES-10/23, ES-10/25, ES-10/26, A/RES/79/232, A/DEC/80/506, A/RES/80/1). Neither is among the four Member States in arrears in A/80/362 or on the Assembly's Article 19 page (archived), so the absences are not shown to be a loss of vote; the lists for the 2024 vote dates are not archived (P-23). The build scores a non-vote at −2 (B-690).

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-10-14 (methodology 1.0.0-rc.1), the 16 reviewed events scored as if published.

| Country | Before (generated only) | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| LVA | −7.7 (−8) | +30.3 (+30) | Acting | A4 −5.0, B1 +12.3, B9 +10.0 (capped from +15.1), B11 +5.0, D3 +8.0; the 28 May 2026 listing is the only qualifying event and ends the passivity penalty (+15) |
| TON | −40.9 (−41) | −40.9 (−41) | Enabling | B1 −25.9; passivity penalty −15; no event |
| TUV | −23.7 (−24) | −23.7 (−24) | Enabling | B1 −8.7 (six non-votes weigh −6.0); passivity penalty −15; no event |

One band change: Latvia from Passive to Acting; without the 28 May 2026 listing the penalty applies and the score is +15.3 (Acting). Read critically (docs/06 §4 step 7): B9 is capped for Latvia, so the flagged call-tier events move nothing.

## T-P21-21: WSM, BRN, KHM (2026-11-04)

Light protocol (docs/06 §5) for Samoa, Brunei Darussalam and Cambodia, by a fresh Sonnet 5.5 session of the finish run. Seven documents archived (six with Wayback captures read with `--capture` or Save Page Now; every replay fetched again with `curl --compressed` and equal to the index rows in bytes and SHA-256). 4 events (Brunei 3, Cambodia 1), none for Samoa; 4 leads. Decisions and flags are in docs/10 B-696 to B-703. The session ran about ten minutes over its 90-minute budget; B7, B11, D4 and D5 are `unchecked` for the three countries.

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2025_09_27_BRN_B9 | B9 | 2025-09-27 | +5 | confirmed | official |
| evt_2026_08_22_BRN_B9 | B9 | 2026-08-22 | +5 | confirmed | official |
| evt_2026_09_26_BRN_B9 | B9 | 2026-09-26 | +5 | confirmed | official |
| evt_2024_09_28_KHM_B9 | B9 | 2024-09-28 (expired) | +2 | confirmed | official |

Points are the tier points before decay and weights. B1, D1, A1, A4, B2, B8 and the other generated indicators are left to the build.

### Samoa

Assessments (34 indicators): has-events 1 (B1), none-found 14, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 16 (A3, A5 to A8, B7, B8, B11, C4 to C6, D4, D5, E1 to E3). Leads: 2 (`lead_20261104_WSM_1` the Prime Minister's declarations of support for Israel, Talamua Online; `_2` the instruction to prepare an office in Jerusalem, Samoa Observer). Sources read: the Government portal and the Ministry (site searches), the General Debate statements of the 78th to 80th sessions, the Government's release of 23 October 2025, Talamua Online, the Samoa Observer, Middle East Eye. Stop note: about 30 minutes of research.

### Brunei Darussalam

Assessments: has-events 3 (B1, B9, D1), none-found 12, no-data 2, not-applicable 1, unchecked 16. Lead: 1 (`lead_20261104_BRN_1`: the Sultan's titah of 20 October 2023 and the joint statement of 27 August 2025, press only). Sources read: the Ministry's Press Room (items 1199, 1229, 1234), the General Debate statements of the 78th, 80th and 81st sessions, The Star (Borneo Bulletin, Bernama). Stop note: about 35 minutes of research.

### Cambodia

Assessments: has-events 2 (B1, B9), none-found 13, no-data 2, not-applicable 1, unchecked 16 (with B7, B8, B11, D4, D5 as for Samoa). Lead: 1 (`lead_20261104_KHM_1`: the education memorandum of 20 February 2025, press only; the labour agreement of 1 December 2025 is not filed because its only source could not be read). Sources read: AKP, the Council of Ministers' press unit, the General Debate statements of the 79th and 81st sessions, Asia News Network, Open Development Cambodia, B2B Cambodia. Stop note: about 30 minutes of research.

### Article 19 note (report only)

Samoa: no vote on 4 of 12 (A/RES/ES-10/21, ES-10/23, ES-10/27, A/RES/80/1). Cambodia: no vote on 1 of 12 (A/RES/ES-10/21). Brunei: all 12 recorded. Neither Samoa nor Cambodia is among the four Member States in arrears on the General Assembly's page (archived) or in A/80/362, so the absences are not shown to be a loss of vote; the build scores a non-vote at -2 (B-701).

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-11-04 (methodology 1.0.0-rc.1), the reviewed events scored as if published.

| Country | Before (generated only) | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| BRN | +1.5 (+2) | +26.5 (+27) | Acting | B9 +10.0 (cap; summed +14.6 from three events), the 22 August and 26 September 2026 events end the passivity penalty (+15) |
| KHM | +1.5 (+2) | +1.5 (+2) | Acting | the 2024 event is beyond 730 days; passivity penalty applies |
| WSM | −22.7 (−23) | −22.7 (−23) | Enabling | no event; B1 with four non-votes; passivity penalty applies |

No band change. Read critically (docs/06 §4 step 7): Brunei's score rests on the two 2026 events; without the 26 September 2026 reading the 22 August 2026 event alone still ends the penalty.

## T-P21-22: LAO, MMR, PHL (2026-11-04)

Light protocol (docs/06 §5) for the Lao People's Democratic Republic, Myanmar and the Philippines, by a fresh Sonnet 5.5 session of the finish run. Two documents archived (the Lao Prime Minister's 79th General Debate statement from the existing Wayback capture; the Department of Foreign Affairs' archive page of the Philippines' 80th statement with Save Page Now; both replays fetched again with `curl --compressed` and equal to the index rows in bytes and SHA-256; the failed capture of the Philippines' 81st file, HTTP 405, removed by its exact id). 3 events (Lao PDR 1, Philippines 2), none for Myanmar; 4 leads. Decisions and flags are in docs/10 B-704 to B-710. The session took about 35 minutes by the machine's clock; B7 and B11 are `unchecked` for the three countries and D4 and D5 for the Lao PDR and Myanmar.

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2024_09_27_LAO_B9 | B9 | 2024-09-27 (expired) | +2 | confirmed | official |
| evt_2024_12_31_PHL_D3 | D3 | 2024-12-31 | +8 | confirmed | official |
| evt_2025_09_27_PHL_B9 | B9 | 2025-09-27 | +2 | confirmed | official |

Points are the tier points before decay and weights. B1, D1, A1, A4, B2, B8 and the other generated indicators are left to the build.

### Lao People's Democratic Republic

Assessments (34 indicators): has-events 2 (B1, B9), none-found 13, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 16 (A3, A5 to A8, B7, B8, B11, C4 to C6, D4, D5, E1 to E3). Lead: 1 (`lead_20261104_LAO_1`: the 2nd ASEAN-GCC Summit of 27 May 2025, whose final statement was not found). Sources read: the General Debate statements of the 78th, 79th and 81st sessions (live files), the 80th on the Permanent Mission's page, KPL, Bernama. Not filed: the 78th, 80th and 81st statements (R7 or no call).

### Myanmar

Assessments: has-events 1 (B1), none-found 14, no-data 2, not-applicable 1, unchecked 16 (as for the Lao PDR). No event and no lead: the General Debate statements could not be read, the Ministry's statement of 6 March 2026 names neither Gaza nor Israel, no statement of the President on Gaza was found. Whose statements count (the government in office or the delegation that holds the seat) is flagged in B-707.

### Philippines

Assessments: has-events 4 (A4, B1, B9, D3), none-found 13 (including D4 and D5), no-data 2, not-applicable 1, unchecked 14 (A3, A5 to A8, B7, B8, B11, C4 to C6, E1 to E3). Leads: 3 (`lead_20261104_PHL_1` Lazaro's 81st statement, `_2` President Marcos at the ASEAN-GCC Summit of 27 May 2025, `_3` the Department's statement of 25 August 2025). Sources read: the Department's UNGA archive, the General Debate statements of the 78th to 81st sessions (live files), UNISPAL's file of the statement at the two-state conference, GMA News, Philstar, Inquirer, Daily Tribune, Khaleej Times, PTV News, GlobalSecurity.org.

### Article 19 note (report only)

All twelve qualifying votes are recorded for the three countries; nothing to report (the Philippines abstained on A/RES/ES-10/21).

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-11-04 (methodology 1.0.0-rc.1), the reviewed events scored as if published.

| Country | Before (generated only) | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| LAO | +1.5 (+2) | +1.5 (+2) | Acting | the 2024 event is beyond 730 days; passivity penalty applies |
| MMR | +1.5 (+2) | +1.5 (+2) | Acting | no event; passivity penalty applies |
| PHL | −3.5 (−3) | +6.4 (+6) | Passive to Acting | D3 +8.0, B9 +1.8; A4 −5.0 and the passivity penalty −15 remain |

One band change: the Philippines from Passive to Acting. Read critically (docs/06 §4 step 7): D3 alone accounts for the change (without it the score is −1.6, Passive); it rests on a doubling of a USD 50,000 contribution to UNRWA (B-708 (4)). The B9 event is 403 days old and does not end the passivity penalty.

## T-P21-23: SGP, THA, TLS (2026-11-04)

Light protocol (docs/06 §5) for Singapore, Thailand and Timor-Leste, by a fresh Sonnet 5.5 session of the finish run. Nine documents archived (eight with Save Page Now, one, the 79th General Debate file, from the existing Wayback capture 20250718095152; every replay fetched again with `curl --compressed` and equal to the index rows in bytes and SHA-256; one failed capture, the 80th General Debate file of Singapore, HTTP 405, removed by its exact id and replaced by the Ministry's own page of the statement). 11 events (Singapore 8, Thailand 2, Timor-Leste 1) and one recognition row (Thailand); 3 leads. Decisions and flags are in docs/10 B-711 to B-717. The session took about 45 minutes by the machine's clock; A3, A5 to A8, C4 to C6 and E1 to E3 are `unchecked` for the three countries as in earlier sessions.

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2023_12_31_SGP_D3 | D3 | 2023-12-31 to 2024-12-31 | +8 | confirmed | dataset (UNRWA table) |
| evt_2024_02_29_SGP_B9 | B9 | 2024-02-29 (expired) | +2 | confirmed | official |
| evt_2024_09_28_SGP_B9 | B9 | 2024-09-28 (expired) | +2 | confirmed | official |
| evt_2025_04_16_SGP_D4 | D4 | 2025-04-16 | +5 | confirmed | official |
| evt_2025_09_22_SGP_B9 | B9 | 2025-09-22 | +5 | confirmed | official |
| evt_2025_09_27_SGP_B9 | B9 | 2025-09-27 | +2 | confirmed | official |
| evt_2025_11_21_SGP_B11 | B11 | 2025-11-21 | +5 (west-bank, unscored) | confirmed | official |
| evt_2026_02_27_SGP_B9 | B9 | 2026-02-27 | +5 | confirmed | official |
| evt_2023_12_31_THA_D3 | D3 | 2023-12-31 to 2024-12-31 | +8 | confirmed | dataset (UNRWA tables) |
| evt_2024_12_31_THA_D3 | D3 | 2024-12-31 | +8 | confirmed | dataset (UNRWA tables) |
| evt_2025_09_24_TLS_B9 | B9 | 2025-09-24 | +5 | confirmed | official |

Points are the tier points before decay and weights. B1, D1, A1, A4, B2, B8 and the other generated indicators are left to the build; the recognition row `THA,2012-01-17` (R21, the Ministry's own page) feeds B8.

### Singapore

Assessments (34 indicators): has-events 7 (A4, B1, B9, B11, D1, D3, D4), none-found 13, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Leads: none. Sources read: the Ministry of Foreign Affairs' press statements, transcripts and Committee of Supply speeches (2024, 2026), the ministerial statement of 22 September 2025, the Ministry of Defence's release of 16 April 2025, the General Debate statements of the 78th to 81st sessions, search results on the Prime Minister's Office, and The Star's report of the ministerial statement. Not searched in Malay, Mandarin or Tamil.

### Thailand

Assessments: has-events 5 (A4, B1, B8, D1, D3), none-found 15, no-data 2, not-applicable 1, unchecked 11 (as for Singapore). Leads: 2 (`lead_20261104_THA_1` the joint statement of the 17 countries with hostages, 7 June 2024; `_2` the Prime Minister at the ASEAN-GCC summit, 20 October 2023; both older than 730 days). Sources read: the Ministry of Foreign Affairs' pages (the news item of 12 January 2024, the statement of 18 November 2023, the General Debate statements of the 78th to 81st sessions), Thai Newsroom, The Nation; the Prime Minister's site was not readable by script.

### Timor-Leste

Assessments: has-events 2 (B1, B9), none-found 18, no-data 2, not-applicable 1, unchecked 11. Lead: 1 (`lead_20261104_TLS_1`: the President's press statement of 14 September 2025, Tatoli). Not filed: the Foreign Minister's 80th General Debate statement (no archived copy possible: B-715). Sources read: the Government's portal, Tatoli (content API), the General Debate statements of the 78th to 81st sessions, the Deputy Permanent Representative's statement at the two-State conference (UNISPAL).

### Article 19 note (report only)

All twelve qualifying votes are recorded for the three countries; nothing to report under Article 19. Timor-Leste abstained on A/RES/ES-10/27 (12 June 2025) in the Assembly's record, and a Lusa headline of 14 June 2025 says the delegation corrected its vote (B-715 (6)).

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-11-04 (methodology 1.0.0-rc.1), the reviewed events scored as if published.

| Country | Before (generated only) | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| SGP | −3.5 (−3) | +24.4 (+24) | Passive to Acting | B9 +10.0 (cap; summed +11.4 from three events inside 730 days), D4 +2.9; the 27 February 2026 B9 event is the only qualifying event and ends the passivity penalty (+15); the B11 event is west-bank and unscored |
| THA | −8.5 (−8) | +2.5 (+2) | Passive to Acting | D3 +8.0 and B8 +3.0 (the new recognition row); A4 −10.0 and the passivity penalty −15 remain |
| TLS | −2.0 (−2) | +2.5 (+3) | Passive to Acting | B9 +4.6 (one event, 406 days old); the passivity penalty −15 remains |

Three band changes (Passive to Acting for all three). Read critically (docs/06 §4 step 7): Singapore's change rests on two +5 events and one qualifying event; without the 27 February 2026 event the score is +5.8 (Acting), without the two B9 and D4 events it would be Passive; Thailand's change rests on D3 (a mechanical reading of UNRWA's tables) and on the recognition row (without the row −0.5, Passive; without D3 −5.5); Timor-Leste's rests on one joint declaration (without it Passive).

## T-P21-27: ALB, AND, BIH (2026-11-04)

Light protocol (docs/06 §5) for Albania, Andorra and Bosnia and Herzegovina, by a fresh Sonnet 5.5 session of the finish run, which also ran the day's Comtrade fetch for 12 reporters (docs/10 B-718: rows for 10, none for WSM and TLS). Seven documents archived (two with Save Page Now, five from existing Wayback captures; every replay fetched again with `curl --compressed` and equal to the index rows in bytes and SHA-256); one failed capture (the 81st General Debate file of Bosnia, HTTP 405) removed by its exact id. 9 events (Albania 3, Andorra 5, Bosnia and Herzegovina 1), 3 leads (Albania 2, Bosnia 1), no recognition row.

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2024_12_31_ALB_C2 | C2 | 2024-12-31 (no later than) | −10 | confirmed | official (embassy list) |
| evt_2025_03_25_ALB_C2 | C2 | 2025-03-25 | −10 | confirmed | official (embassy list) and press |
| evt_2025_09_24_ALB_B9 | B9 | 2025-09-24 | +2 | confirmed | official (OCR of a printout) |
| evt_2023_12_31_AND_D3 | D3 | 2023-12-31 to 2024-12-31 | +8 | confirmed | dataset (UNRWA table) |
| evt_2024_12_31_AND_D3 | D3 | 2024-12-31 | +8 | confirmed | dataset (UNRWA table) |
| evt_2025_07_29_AND_B9 | B9 | 2025-07-29 | +5 | confirmed | official |
| evt_2025_07_30_AND_B9 | B9 | 2025-07-30 | +2 | confirmed | official |
| evt_2025_08_12_AND_B9 | B9 | 2025-08-12 | +5 | confirmed | official |
| evt_2025_09_25_BIH_B9 | B9 | 2025-09-25 | +5 | confirmed | official |

Points are the tier points before decay and weights. B1, D1, A1, A4, B2, B8 and the other generated indicators are left to the build.

### Albania

Assessments (34 indicators): has-events 4 (B1, B9, C2, C3), none-found 18, no-data 1 (A2), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Leads: 2 (`lead_20261104_ALB_1` the medical evacuation of one child from Gaza, January 2025; `_2` the Prime Minister's address to the Knesset, 26 January 2026, a B10 question). Sources read: the 78th to 81st General Debate statements (the 80th, the President's, by OCR), A/79/PV.14, the Israeli Embassy's list of agreements, The Jerusalem Post, the Albanian Media and Information Agency (read, not archived), Periskopi, Daily Sabah, euronews.al. Not read: the Government's own sites (kryeministria.al, punetejashtme.gov.al, president.al: bot checks), the Albanian-language press.

### Andorra

Assessments: has-events 4 (B1, B9, C3, D3), none-found 18, not-applicable 1 (B2), unchecked 11. Leads: none. Sources read: the Govern d'Andorra's releases of 29 July 2025 and 12 June 2026, the Minister's address (UNISPAL), the joint statements of 30 July and 12 August 2025, the 80th and 81st General Debate statements (the 80th by OCR), the generated tables and UNRWA's tables. Not read: Catalan-language press beyond search results; the Butlletí Oficial.

### Bosnia and Herzegovina

Assessments: has-events 4 (A2, B1, B9, C3), none-found 18 (B2 not-applicable: 1), unchecked 11. Leads: 1 (`lead_20261104_BIH_1`, the Chairman of the Presidency's 81st General Debate statement, 22 September 2026, with no archivable official copy). Sources read: the 78th to 81st General Debate statements (live files; the 79th and 80th have Wayback replays), the Permanent Mission's site (content API), press reports of the Foreign Minister's remarks (search results, not read in full). Not read: the Presidency's site (no answer), the Foreign Ministry's own releases.

### Article 19 note (report only)

All twelve qualifying votes are recorded for Albania and Bosnia and Herzegovina. Andorra has a recorded non-vote on A/RES/80/1 (19 September 2025), which the build scores at −2 whatever the reason; whether it is an Article 19 case was not checked (B-626, the monthly run).

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-11-04 (methodology 1.0.0-rc.1), the reviewed events scored as if published; the "before" column is the generated events only (with the Comtrade rows fetched today).

| Country | Before (generated only) | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| ALB | −22.6 (−23) | −40.8 (−41) | Enabling | C2 −20.0 (two events at the category cap), B9 +1.8; the passivity penalty −15 remains; without the C2 events −21 (Enabling) |
| AND | −3.0 (−3) | +14.7 (+15) | Passive to Acting | B9 +9.7, D3 +8.0; the passivity penalty −15 remains; without the D3 events +7, without the B9 events +5 (Acting either way) |
| BIH | +11.5 (+11) | +16.1 (+16) | Acting | B9 +4.6 (one event, 405 days old); the Comtrade C3 event of 2026-03-10 is a qualifying event, so no passivity penalty before or after |

One band change: Andorra from Passive to Acting. Read critically (docs/06 §4 step 7): either event group alone moves Andorra (the D3 events are a mechanical reading of small UNRWA amounts, the B9 events rest on the Minister's address of 29 July 2025 and two joint statements, all older than 365 days).

## T-P21-28: HRV, MKD, MLT (2026-11-04)

Light protocol (docs/06 §5) for Croatia, North Macedonia and Malta, by a fresh Sonnet 5.5 session of the finish run (docs/10 B-723 to B-728). The Comtrade step was skipped (the line COMTRADE-20261104 is in `reports.jsonl`; none of the three has rows). 19 documents archived (15 from existing Wayback captures, 4 with Save Page Now; every replay fetched again with `curl --compressed` and equal to the index rows in bytes and SHA-256; one stub capture of the Jerusalem Post page removed by its exact id). 32 events (Croatia 12, Malta 19, North Macedonia 1), 1 lead (Malta), no recognition row.

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2023_12_31_HRV_D3 | D3 | 2023-12-31 to 2024-12-31 | +8 | confirmed | dataset |
| evt_2024_02_19_HRV_B9 | B9 | 2024-02-19 | +2 | confirmed | official |
| evt_2024_04_19_HRV_B11 | B11 | 2024-04-19 | +5 | confirmed | official |
| evt_2024_07_15_HRV_B11 | B11 | 2024-07-15 | +5 | confirmed | official |
| evt_2024_09_27_HRV_B9 | B9 | 2024-09-27 | +2 | confirmed | official |
| evt_2025_01_17_HRV_C2 | C2 | 2025-01-17 | −10 | confirmed | official |
| evt_2025_09_09_HRV_B9 | B9 | 2025-09-09 | +2 | confirmed | official |
| evt_2025_09_16_HRV_B9 | B9 | 2025-09-16 | +5 | confirmed | official |
| evt_2025_09_24_HRV_B9 | B9 | 2025-09-24 | +2 | confirmed | official |
| evt_2025_09_27_HRV_B9 | B9 | 2025-09-27 | +2 | confirmed | official |
| evt_2026_02_25_HRV_B9 | B9 | 2026-02-25 | +5 | confirmed | official |
| evt_2026_05_28_HRV_B11 | B11 | 2026-05-28 | +5 | confirmed | official |
| evt_2026_08_24_MKD_C2 | C2 | 2026-08-24 | −10 | reported | press |
| evt_2023_12_31_MLT_D3 | D3 | 2023-12-31 to 2024-12-31 | +8 | confirmed | dataset |
| evt_2024_02_19_MLT_B9 | B9 | 2024-02-19 | +2 | confirmed | official |
| evt_2024_04_19_MLT_B11 | B11 | 2024-04-19 | +5 | confirmed | official |
| evt_2024_07_15_MLT_B11 | B11 | 2024-07-15 | +5 | confirmed | official |
| evt_2024_10_07_MLT_A8 | A8 | 2024-10-07 | +5 | corroborated | press |
| evt_2024_12_31_MLT_D3 | D3 | 2024-12-31 | +8 | confirmed | dataset |
| evt_2025_05_20_MLT_C1 | C1 | 2025-05-20 | +4 | confirmed | official |
| evt_2025_07_21_MLT_B9 | B9 | 2025-07-21 | +5 | confirmed | official |
| evt_2025_07_30_MLT_B9 | B9 | 2025-07-30 | +2 | confirmed | official |
| evt_2025_08_10_MLT_B9 | B9 | 2025-08-10 | +5 | confirmed | official |
| evt_2025_08_12_MLT_B9 | B9 | 2025-08-12 | +5 | confirmed | official |
| evt_2025_08_21_MLT_B9 | B9 | 2025-08-21 | +5 | confirmed | official |
| evt_2025_09_22_MLT_B9 | B9 | 2025-09-22 | +5 | confirmed | official |
| evt_2025_09_22_MLT_D4 | D4 | 2025-09-22 | +5 | confirmed | official |
| evt_2025_09_26_MLT_B9 | B9 | 2025-09-26 | +5 | confirmed | official |
| evt_2025_09_27_MLT_B9 | B9 | 2025-09-27 | +2 | confirmed | official |
| evt_2025_12_03_MLT_B9 | B9 | 2025-12-03 | +5 | confirmed | official |
| evt_2026_05_28_MLT_B11 | B11 | 2026-05-28 | +5 | confirmed | official |
| evt_2026_09_25_MLT_B9 | B9 | 2026-09-25 | +2 | confirmed | official |

Points are the tier points before decay and weights. B1, D1, A1, A4, B2, B8 and the other generated indicators are left to the build.

### Croatia

Assessments (34 indicators): has-events 6 (B1, B9, B11, C2, D1, D3), none-found 14, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11. Leads: none (the President's and the Government's texts are official sources). Sources read: the Ministry's releases of 27 and 30 August and 9 September 2025, the President's site (about a dozen items of about 70 listed for Gaza, Palestine and Israel), the General Debate statements of the 78th to 81st sessions, the State Secretary's address at the two-state conference, the Ministry of the Sea's release of 17 January 2025, UNRWA's tables, SIPRI, the ICJ and ICC lists. Not read: the Croatian-language press beyond search results, the Sabor's records, `hina.hr` (bot check).

### North Macedonia

Assessments: has-events 2 (B1, C2), none-found 18, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11. Leads: none. Sources read: the General Debate statements of the 78th to 81st sessions (none cites Gaza, Palestine or Israel), the Jerusalem Post's reports of 25 and 28 August 2026, a digest of Macedonian headlines, the Western Wall Heritage Foundation's page, UNRWA's tables, SIPRI, the ICJ and ICC lists. Not read: the Ministry's and the Government's own news (client-rendered sites), the Macedonian- and Albanian-language press, MIA's pages.

### Malta

Assessments: has-events 9 (A8, B1, B8, B9, B11, C1, D1, D3, D4), none-found 13 (B2 among them: Malta sat on the Security Council and cast no veto), no-data 2 (A2, C3), unchecked 10. Leads: 1 (`lead_20261104_MLT_1`, the dates of the first arrivals of children from Gaza). Sources read: the Prime Minister's release PR251629 and his General Debate addresses of the 79th to 81st sessions (the 80th and 81st archived), the Foreign Minister's article in the Ministry's review of December 2025, MaltaToday and Lovin Malta, UNRWA's tables, SIPRI, the ICJ and ICC lists. Not read: the Department of Information's and the Ministry's own pages (HTTP 403), Maltese and Italian sources.

### Article 19 note (report only)

All twelve qualifying votes are recorded for the three states and none is in the Secretary-General's letter of 3 September 2025 (A/80/362): no Article 19 case.

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-11-04 (methodology 1.0.0-rc.1), the reviewed events scored as if published; the "before" column is the generated events only. The sensitivity rows are scored on a scratch copy of the data with `--root`.

| Country | Before (generated only) | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| HRV | −5.2 (−5) | +14.8 (+15) | Passive to Acting | the Council's B11 listing of 28 May 2026 ends the passivity penalty (−15) and alone gives +14.8; the B9 events (cap +10) and the C2 event (−10) offset; without the President's three B9 events +8.4 (Acting) |
| MKD | −24.0 (−24) | −13.0 (−13) | Enabling to Passive | the C2 event (reported, −4 after weighting) is a qualifying event inside 365 days and ends the passivity penalty (−15); without it −24 |
| MLT | +9.5 (+9) | +56.0 (+56) | Acting to Confronting | B9 at the cap, B11, C1 +4, D3 ×2, D4 +5, A8 +5; without A8, C1 and D4 +47.5 (Confronting); without A8, C1, D4 and D3 +39.5 (Acting); the three Council listings and the generated rows only +29.5 (Acting) |

Three band changes. Read critically (docs/06 §4 step 7): Croatia's rests on one EU Council decision filed under R8; North Macedonia's on a press-only report of agreements and a rule that lets a negative event end a penalty; Malta's on several flagged items (the D4 date, the single-word tier of 22 September 2025, the press-corroborated A8, the mechanical D3 events).

## T-P21-29: MNE, PRT, SMR (2026-11-04)

Light protocol (docs/06 §5) for Montenegro, Portugal and San Marino, by a fresh Sonnet 5.5 session of the finish run (docs/10 B-729 to B-733). The Comtrade step was skipped (the line COMTRADE-20261104 is in `reports.jsonl`; none of the three has rows). Six documents archived (five from existing Wayback captures, one with Save Page Now; every replay fetched again with `curl --compressed` and equal to the index rows in bytes and SHA-256; one failed Save Page Now attempt removed by its exact id). 26 events (Portugal 20, Montenegro 3, San Marino 3), 5 leads (Portugal 2, Montenegro 1, San Marino 2), no recognition row.

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2023_12_31_MNE_D3 | D3 | 2023-12-31 to 2024-12-31 | +8 | confirmed | dataset |
| evt_2024_12_31_MNE_D3 | D3 | 2024-12-31 | +8 | confirmed | dataset |
| evt_2025_09_25_MNE_B9 | B9 | 2025-09-25 | +2 | confirmed | official |
| evt_2023_12_31_PRT_D3 | D3 | 2023-12-31 to 2024-12-31 | +8 | confirmed | dataset |
| evt_2024_02_19_PRT_B9 | B9 | 2024-02-19 | +2 | confirmed | official |
| evt_2024_04_19_PRT_B11 | B11 | 2024-04-19 | +5 | confirmed | official |
| evt_2024_06_06_PRT_B9 | B9 | 2024-06-06 | +2 | confirmed | official |
| evt_2024_07_15_PRT_B11 | B11 | 2024-07-15 | +5 | confirmed | official |
| evt_2024_09_26_PRT_B9 | B9 | 2024-09-26 | +2 | confirmed | official |
| evt_2024_10_21_PRT_B9 | B9 | 2024-10-21 | +2 | confirmed | official |
| evt_2024_12_31_PRT_D3 | D3 | 2024-12-31 | +8 | confirmed | dataset |
| evt_2025_05_19_PRT_B9 | B9 | 2025-05-19 | +2 | confirmed | official |
| evt_2025_07_21_PRT_B9 | B9 | 2025-07-21 | +5 | confirmed | official |
| evt_2025_07_30_PRT_B9 | B9 | 2025-07-30 | +2 | confirmed | official |
| evt_2025_08_10_PRT_B9 | B9 | 2025-08-10 | +5 | confirmed | official |
| evt_2025_08_12_PRT_B9 | B9 | 2025-08-12 | +5 | confirmed | official |
| evt_2025_08_21_PRT_B9 | B9 | 2025-08-21 | +5 | confirmed | official |
| evt_2025_09_27_PRT_B9 | B9 | 2025-09-27 | +2 | confirmed | official |
| evt_2025_10_07_PRT_B9 | B9 | 2025-10-07 | +2 | confirmed | official |
| evt_2026_01_28_PRT_B9 | B9 | 2026-01-28 | +2 | confirmed | dataset |
| evt_2026_05_28_PRT_B11 | B11 | 2026-05-28 | +5 | confirmed | official |
| evt_2026_06_08_PRT_B9 | B9 | 2026-06-08 | +2 | confirmed | official |
| evt_2026_09_08_PRT_B9 | B9 | 2026-09-08 | +5 | confirmed | official |
| evt_2024_09_28_SMR_B9 | B9 | 2024-09-28 | +2 | confirmed | official |
| evt_2024_12_31_SMR_D3 | D3 | 2024-12-31 | +8 | confirmed | dataset |
| evt_2025_07_30_SMR_B9 | B9 | 2025-07-30 | +2 | confirmed | official |

Points are the tier points before decay and weights. B1, D1, A1, A4, B2, B8 and the other generated indicators are left to the build.

### Portugal

Assessments (34 indicators): has-events 6 (B1, B8, B9, B11, D1, D3), none-found 13, no-data 2 (A2, C3), not-applicable 1 (B2: Portugal's Security Council term starts in 2027), unchecked 12 (A3, A5 to A8, C4 to C6, D5 and E1 to E3). Leads: 2 (`lead_20261104_PRT_1`, the Foreign Minister's support for suspending the Association Agreement, C1; `lead_20261104_PRT_2`, the ICC warrants, B5; both press only). Sources read: the Ministry's portal (about 70 pages listed by its site search, those since October 2023 read), the Government's and the Presidency's pages, the General Debate statements of the 79th to 81st sessions, ECO and DN (Lusa) for the two leads, UNRWA's tables, SIPRI, the ICJ and ICC lists. Not read: the Assembly of the Republic's records, the Portuguese press beyond the pages cited, the Council of Ministers' communiqués, the President's statements after 9 March 2026.

### Montenegro

Assessments: has-events 4 (B1, B9, D1, D3), none-found 16, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6 and E1 to E3). Leads: 1 (`lead_20261104_MNE_1`, the Deputy Prime Minister's statement of 27 September 2024: rank under R3 unconfirmed). Sources read: the General Debate statements of the 79th to 81st sessions, the President's page of the 80th statement (Wayback), UNRWA's tables, SIPRI, the ICJ and ICC lists, web searches in English and Montenegrin. Not read: gov.me, the Ministry's and the President's own news (no scripted access from this network), the Parliament's records, the Montenegrin press beyond search results.

### San Marino

Assessments: has-events 5 (B1, B8, B9, D1, D3), none-found 15, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11. Leads: 2 (`lead_20261104_SMR_1` and `_2`, the 80th and 81st General Debate statements, which have no archived text; the 80th would be +5 and 403 days old, the 81st +2 and inside 365 days). Sources read: the Foreign Secretariat's pages and releases (esteri.sm, libertas.sm, San Marino RTV), the General Debate statements of the 79th to 81st sessions (the 79th archived), the Global Affairs Canada text of the New York Call, UNRWA's tables, SIPRI, the ICJ and ICC lists. Not read: the Great and General Council's records, the Captains Regent's pages, the Italian-language press beyond the pages cited.

### Article 19 note (report only)

All twelve qualifying votes are recorded for the three states and none is in the Secretary-General's letter of 3 September 2025 (A/80/362): no Article 19 case. San Marino abstained on A/RES/ES-10/21 (27 October 2023).

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-11-04 (methodology 1.0.0-rc.1), the reviewed events scored as if published; the "before" column is the generated events only. The sensitivity rows are scored on a scratch copy of the data with `--root`.

| Country | Before (generated only) | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| PRT | +9.5 (+9) | +47.5 (+47) | Acting to Confronting | the passivity penalty (−15) ends (the 28 January 2026 and 8 June 2026 joint statements and the Council's listing of 28 May 2026 are qualifying events inside 365 days); B9 at the cap (+10), B11 +5, D3 +8; without the eleven joint-statement events +39.4 (Acting); the three listings and D3 only +37.5 (Acting); the joint statements and listings without the three own B9 events and D3 +39.5 (Acting); without the joint statements and listings +19.4 (Acting, passivity applied) |
| MNE | +1.5 (+1) | +11.3 (+11) | Acting, unchanged | D3 +8 and the President's B9 (+1.6 after decay); the passivity penalty still applies (no qualifying event in the last 365 days) |
| SMR | +9.5 (+9) | +19.1 (+19) | Acting, unchanged | D3 +8 and the New York Call (+1.6 after decay); the 79th statement is older than 730 days; the passivity penalty still applies. An archived 81st statement (+2, 26 September 2026, inside 365 days) could end it |

One band change. Read critically (docs/06 §4 step 7): Portugal's rests on the joint statements filed under B-444 and the Council's listings under R8, on three flagged own events (the Prime Minister's, the 2+2 declaration, the President's) and on the mechanical D3 events; San Marino's unfiled 81st statement could end its passivity penalty and its 80th would add +5.

## T-P21-30: SRB, VAT, AGO (2026-11-04)

Light protocol (docs/06 §5) for Serbia, the Holy See and Angola, by a fresh Sonnet 5.5 session of the finish run (docs/10 B-734 to B-739). The Comtrade step was skipped (the line COMTRADE-20261104 is in `reports.jsonl`; none of the three has rows). Ten documents archived (two from existing Wayback captures, the Angolan Presidency's PDFs and the Holy See's 79th General Debate file counted as captures; the rest with Save Page Now; every replay fetched again with `curl --compressed` and equal to its index row in bytes and SHA-256); two attempts removed by exact id (the Embassy of Angola in South Africa's page: HTTP 403 from Save Page Now; the verbatim record A/79/PV.7, whose extracted text is cut at 200 KB before the Angolan address).

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2026_04_29_SRB_C2 | C2 | 2026-04-29 | −10 | reported | press |
| evt_2024_09_28_VAT_B9 | B9 | 2024-09-28 | +2 | confirmed | official |
| evt_2024_12_25_VAT_B9 | B9 | 2024-12-25 | +2 | confirmed | official |
| evt_2025_07_20_VAT_B9 | B9 | 2025-07-20 | +5 | confirmed | official |
| evt_2025_07_27_VAT_B9 | B9 | 2025-07-27 | +2 | confirmed | official |
| evt_2025_09_04_AGO_B9 | B9 | 2025-09-04 | +2 | confirmed | official |
| evt_2025_09_22_AGO_B9 | B9 | 2025-09-22 | +5 | confirmed | official |
| evt_2025_09_23_AGO_B9 | B9 | 2025-09-23 | +5 | confirmed | official |

Points are the tier points before decay and weights. B1, D1, A1, A4, B2, B8 and the other generated indicators are left to the build. Two rows were added to `data/structured/recognitions.csv` (Angola 1988-12-06 from the President's address of 22 September 2025; the Holy See 2015-06-26 from the Press Office's bulletin of that date), both flagged.

### Serbia

Assessments (34 indicators): has-events 2 (B1, C2), none-found 18, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6 and E1 to E3). Leads: 1 (`lead_20261104_SRB_1`, the Elbit Systems contracts and the drone venture, press without a primary). Sources read: the Ministry of Foreign Affairs' releases (mfa.gov.rs/en), the General Debate statements of the 79th to 81st sessions (read live; the 80th and 81st have no Wayback replay), BIRN's report as republished by 021.rs (archived), UNRWA tables, the SIPRI register, the ICJ and ICC lists. One C2 event, `reported`, flagged R18 and single origin; it ends the passivity penalty.

### Holy See

Assessments: has-events 2 (B8, B9), none-found 18, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11. Leads: 1 (`lead_20261104_VAT_1`, the Bambino Gesù hospital's admissions of children from Gaza, D4, Vatican News). Sources read: the Pope's texts on vatican.va (Angelus, audiences, Urbi et Orbi, 2023 to 2026), the General Debate statements of the 79th to 81st sessions (the 79th archived), the Press Office's bulletin of 26 June 2015 (archived), UNRWA tables (USD 20,000 in each of 2022, 2023, 2024: no D3), the ICJ and ICC lists. No event is inside 365 days.

### Angola

Assessments: has-events 3 (B1, B8, B9), none-found 17, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11. Leads: 1 (`lead_20261104_AGO_1`, the Cairo summit address of 4 March 2025, Ver Angola). Sources read: the Presidency's press centre (PDFs of the addresses of 22 and 23 September 2025, archived), UNISPAL's English text of the address of 22 September 2025 (archived), the UAE Ministry's joint statement of 4 September 2025 (archived), the Embassy pages that print the addresses of 24 September 2024 and 22 September 2026, the delegation's General Debate files (79th to 81st, read live), UNRWA tables, the SIPRI register, the ICJ and ICC lists.

### Article 19 note (report only)

Serbia and Angola have all twelve qualifying votes recorded and neither is in the Secretary-General's letter of 3 September 2025 (A/80/362): no Article 19 case. The Holy See is a non-member observer state and has no vote on resolutions (B1 `none-found`, not an absence).

### A4 data-year gap (report only)

Serbia: orders from Israel of 2022 to 2024 in SIPRI's register (lines 583 to 587 of the archived export; TIV 0 to 3) are not in the release's own data year and are not scored (docs/10 B-536 (7)). Angola's two orders (2004, 2015) predate the window.

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-11-04 (methodology 1.0.0-rc.1), the reviewed events scored as if published; the "before" column is the generated events only.

| Country | Before (generated only) | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| SRB | −5.2 (−5) | +5.8 (+6) | Passive to Acting | the reported C2 event (−10 × 0.4 = −4.0) is a qualifying event inside 365 days and ends the passivity penalty (−15); without it the score stays −5.2 (Passive) |
| VAT | −15.0 (−15) | −5.8 (−6) | Passive, unchanged | B8 +3.0 (the 2015 row) and three B9 events still counted (+0.7, +3.9, +1.6); the passivity penalty still applies (no event inside 365 days) |
| AGO | +1.5 (+1) | +14.5 (+14) | Acting, unchanged | B8 +3.0 and three B9 events (+1.8, +4.6, +4.6); the passivity penalty still applies (the last B9 is 407 days old) |

One band change. Read critically (docs/06 §4 step 7): Serbia's rests on one `reported` C2 event of a single origin, filed 'no later than' the day of the report and flagged as a technical instrument; the author may remove it (the band returns to Passive). The Holy See's B9 events rest on the rank reading of B-736 (the Pope as head of state; the Secretary of State as head-of-government equivalent). Angola's two +5 events are the President's own legal characterisation and named violations, in texts of the Presidency.

## T-P21-24: VNM, AFG, BGD (2026-11-04)

Light protocol (docs/06 §5) for Viet Nam, Afghanistan and Bangladesh, by a fresh Opus 5.5 session of the finish run (docs/10 B-740 to B-744). The Comtrade step was skipped (the line COMTRADE-20261104 is in `reports.jsonl`; none of the three has rows). Five documents archived (three from existing Wayback captures with `--capture`, two with Save Page Now; every replay fetched again with `curl --compressed` and equal to its index row in bytes and SHA-256).

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2024_12_31_VNM_D3 | D3 | 2024-12-31 | +8 | confirmed | dataset (UNRWA table) |
| evt_2024_09_27_BGD_B9 | B9 | 2024-09-27 | +5 | confirmed | official |
| evt_2025_07_29_BGD_B9 | B9 | 2025-07-29 | +5 | confirmed | official |
| evt_2026_02_26_BGD_B9 | B9 | 2026-02-26 | +2 | confirmed | official (name from press) |

Points are the tier points before decay and weights. B1, D1, A1, A4, B2, B8 and the other generated indicators are left to the build. No row was added to `data/structured/recognitions.csv` (the registry's 1988 dates have no Government document in this session).

### Viet Nam

Assessments (34 indicators): has-events 3 (B1, D1, D3), none-found 17, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6 and E1 to E3). Leads: none. Sources read: the delegation's General Debate files of the 79th to 81st sessions (none cites Gaza; the 80th calls for 'ceasefires … in conflict zones' and speaks of 'the Palestinian people': R7), UNRWA tables, FTS, the SIPRI register, the ICJ and ICC lists; web searches in English and Vietnamese. The Ministry's statements on Gaza are the spokesperson's (R3).

### Afghanistan

Assessments: has-events 1 (B1), none-found 19, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11. Leads: 1 (`lead_20261104_AFG_1`, the Taliban leader's Eid message of June 2025, FDD's Long War Journal). Sources read: the General Debate files (none exists for the 79th to 81st sessions), the Taliban authorities' Ministry of Foreign Affairs (`mfa.gov.af/en`, statements on Gaza with no named speaker), UNRWA tables, the SIPRI register, the ICJ and ICC lists, the Secretary-General's Article 19 letter. The Taliban authorities do not hold the UN seat: their statements are leads until the author decides (B-742).

### Bangladesh

Assessments: has-events 3 (B1, B9, D1), none-found 17, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11. Leads: 1 (`lead_20261104_BGD_1`, the Chief Adviser's 80th General Debate address, UNB). Sources read: the General Debate pages and files of the 79th to 81st sessions (the 79th archived), the Ministry's press-release listing and its Permanent Mission to the OIC (the Foreign Minister's statement of 26 February 2026, archived), UNISPAL's text of the Foreign Adviser's statement at the two-State conference and the UN's press release (archived), UNRWA tables (USD 50,000 a year, no D3), FTS, the SIPRI register, the ICJ and ICC lists.

### Article 19 note (report only)

Viet Nam and Bangladesh have all twelve qualifying votes recorded (yes on each). Afghanistan has yes on A/RES/ES-10/21 and ES-10/22 and no vote on the ten from A/RES/ES-10/23 (10 May 2024) to A/RES/80/116; it is one of the four Member States in arrears under Article 19 in the Secretary-General's letter of 3 September 2025 (A/80/362, line 25: minimum payment USD 448,288) and on the Assembly's Article 19 page of 2026. The build scores each absence at −2 (−20 points before decay; −11.0 of B1 counted on 2026-11-04). The votes are those of the mission that holds the seat.

### A4 data-year gap (report only)

Viet Nam's orders from Israel in SIPRI's register are of 2006 to 2018 (lines 833 to 841), none in the window. Bangladesh and Afghanistan have no orders from Israel.

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-11-04 (methodology 1.0.0-rc.1), the reviewed events scored as if published; the "before" column is the generated events only.

| Country | Before (generated only) | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| VNM | +1.5 (+1) | +9.5 (+9) | Acting, unchanged | D3 +8.0; the passivity penalty still applies (the D3 event is 673 days old) |
| AFG | −26.0 (−26) | −26.0 (−26) | Enabling, unchanged | no event; B1 −11.0 from ten absences under Article 19 arrears and the passivity penalty (−15) |
| BGD | +1.5 (+1) | +22.5 (+22) | Acting, unchanged | B9 +4.0 (29 July 2025, decayed) and +2.0 (26 February 2026); the OIC statement is inside 365 days and ends the passivity penalty (−15); without it the score is +5.5 |

No band change. Read critically (docs/06 §4 step 7): Bangladesh's +22.5 rests on the OIC statement, whose speaker is unnamed in the official text (named by one press report) and whose call is made while a ceasefire was formally in force; and on the reading of the interim Government's Chief Adviser and Foreign Adviser as head of government and foreign minister (B-741). Afghanistan's −26 is mostly the Article 19 absences and the passivity penalty; its speakers are the author's decision (B-742).

## T-P21-25: BTN, IRN, LKA (2026-11-04)

Light protocol (docs/06 §5) for Bhutan, the Islamic Republic of Iran and Sri Lanka, by a fresh Opus 5.5 session of the finish run (docs/10 B-745 to B-749). The Comtrade step was skipped (the line COMTRADE-20261104 is in `reports.jsonl`; none of the three has rows). Seven documents archived (three General Debate files from existing Wayback captures with `--capture`, four pages with Save Page Now: the Sri Lankan Ministry's page of the Foreign Minister's 81st General Debate statement, the Iranian Ministry's text of the Foreign Minister's Al Jazeera Forum speech, two Colombo press reports of the service-sector memorandum); every replay fetched again with `curl --compressed` and equal to its index row in bytes and SHA-256.

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2024_09_24_IRN_B9 | B9 | 2024-09-24 | +5 | confirmed | official |
| evt_2025_09_24_IRN_B9 | B9 | 2025-09-24 | +5 | confirmed | official |
| evt_2026_02_07_IRN_B9 | B9 | 2026-02-07 | +5 | confirmed | official (Ministry, embassy page) |
| evt_2024_12_31_LKA_D3 | D3 | 2024-12-31 | +8 | confirmed | dataset (UNRWA table) |
| evt_2025_09_24_LKA_B9 | B9 | 2025-09-24 | +2 | confirmed | official |
| evt_2025_12_22_LKA_C2 | C2 | 2025-12-22 | −10 | corroborated | press (two publishers, one release) |
| evt_2026_09_28_LKA_B9 | B9 | 2026-09-28 | +2 | confirmed | official (Ministry) |

Points are the tier points before decay and weights. B1, D1, A1, A4, B2, B8 and the other generated indicators are left to the build. No row was added to `data/structured/recognitions.csv` (the registry's dates of 1988 and 1989 have no Government document in this session).

### Bhutan

Assessments (34 indicators): has-events 1 (B1), none-found 19, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6 and E1 to E3). Leads: none. Sources read: the Prime Minister's General Debate addresses of the 79th to 81st sessions (none mentions Gaza, Palestine or Israel), UNRWA tables (no row), FTS (no flow), the SIPRI register, the ICJ and ICC lists; web searches in English. The Ministry (`mfa.gov.bt`) and the Prime Minister's Office (`pmo.gov.bt`) did not answer from this network and were checked through Wayback captures only.

### Iran

Assessments: has-events 2 (B1, B9), none-found 18, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11. Leads: 1, promoted (`lead_20261104_IRN_1` → `evt_2026_02_07_IRN_B9`). Sources read: the President's General Debate files of the 79th and 80th sessions (archived) and the UN's page of the 81st (no file), the President's English site (items in indirect speech, R4), the Foreign Ministry's text of the Al Jazeera Forum speech on its Embassy in Sri Lanka's pages (archived; the Ministry's sites answer scripts with a cookie challenge, not bypassed), UNRWA tables (no row), FTS (no flow), the SIPRI register (orders of 1985 and 1986 only), the ICJ and ICC lists.

### Sri Lanka

Assessments: has-events 5 (B1, B9, C2, D1, D3), none-found 15, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11. Leads: 1 (`lead_20261104_LKA_1`, the construction-sector memorandum, Ada Derana). Sources read: the General Debate files of the 79th (the Permanent Representative: R3), 80th (the President, archived) and 81st sessions (the Foreign Minister, archived from the Ministry's page), the Ministry's listing of the Minister's statements (the remarks of 14 October 2024, a call for a ceasefire, expired), the press reports of the Deputy Foreign Minister's visit to Israel of December 2025 (archived), UNRWA tables, FTS, the SIPRI register, the ICJ and ICC lists.

### Article 19 note (report only)

Sri Lanka has all twelve qualifying votes recorded (yes on each). Bhutan and Iran have yes on eleven and are recorded as not voting (X) on A/DEC/80/506 (12 September 2025, the decision on the participation of the State of Palestine's President by video); neither is among the Member States in arrears in the Secretary-General's letter of 3 September 2025 (A/80/362), so the absence is not an Article 19 loss of vote. The build scores it at −2.

### A4 data-year gap (report only)

Iran's orders from Israel in SIPRI's register are of 1985 and 1986 (lines 408 to 410), none in the window. Bhutan and Sri Lanka have no orders from Israel.

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-11-04 (methodology 1.0.0-rc.1), the reviewed events scored as if published; the "before" column is the generated events only.

| Country | Before (generated only) | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| BTN | −3.0 (−3) | −3.0 (−3) | Passive, unchanged | no event; the passivity penalty (−15) applies |
| IRN | −3.0 (−3) | +21.6 (+22) | Passive to Acting | B9 +4.6 (24 September 2025, decayed) and +5.0 (7 February 2026); the Al Jazeera Forum speech is inside 365 days and ends the passivity penalty (−15); without it the score is +1.6 (Acting) |
| LKA | +1.5 (+1) | +21.3 (+21) | Acting, unchanged | D3 +8.0; B9 +1.8 and +2.0; C2 −7.0; the 81st General Debate statement and the C2 event are inside 365 days and end the passivity penalty; without the C2 event +28.3, without the 81st statement +19.3, without both +11.3 |

One band change (Iran, Passive to Acting). Read critically (docs/06 §4 step 7): Iran's band change rests on two General Debate addresses (one expired) and the Foreign Minister's speech at a broadcaster's forum, filed from the Ministry's own text; the 80th address alone keeps Iran at +1.6, the bottom of Acting. Sri Lanka's C2 event rests on two press reports of one Government release, flagged under R18 as a labour-recruitment memorandum between employment agencies.
## T-P21-26: MDV, NPL, PAK (2026-11-04)

Light protocol (docs/06 §5) for Maldives, Nepal and Pakistan, by a fresh Opus 5.5 session of the finish run (docs/10 B-750 to B-754). The Comtrade step was skipped (the line COMTRADE-20261104 is in `reports.jsonl`; none of the three has rows). Web searches were not available to this session (the run's search budget was spent): the session read the primaries it could reach directly and records what it did not search, for P-23. Five documents archived (Pakistan's 80th and 81st General Debate files and the Maldives' ICJ declaration and the ICJ press release from existing Wayback captures with `--capture`, the Maldivian President's summit speech with Save Page Now); every replay fetched again with `curl --compressed` and equal to its index row in bytes and SHA-256. One failed capture (the Maldives' 80th General Debate file, 405) was removed from `archive/index.csv` by its exact id.

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2024_10_01_MDV_B3 | B3 | 2024-10-01 | +15 | confirmed | court (ICJ declaration and press release, UNISPAL copies) |
| evt_2024_12_31_MDV_D3 | D3 | 2024-12-31 | +8 | confirmed | dataset (UNRWA tables) |
| evt_2025_09_15_MDV_B9 | B9 | 2025-09-15 | +5 | confirmed | official (President's Office) |
| evt_2026_04_30_MDV_B9 | B9 | 2026-04-30 | +5 | confirmed | official (joint statement, Brazil's Ministry) |
| evt_2024_12_31_PAK_D3 | D3 | 2024-12-31 | +8 | confirmed | dataset (UNRWA tables) |
| evt_2025_09_23_PAK_B9 | B9 | 2025-09-23 | +2 | confirmed | official (S/PV.10003) |
| evt_2025_09_26_PAK_B9 | B9 | 2025-09-26 | +5 | confirmed | official |
| evt_2026_02_01_PAK_B9 | B9 | 2026-02-01 | +2 | confirmed | official (joint statement, SPA) |
| evt_2026_04_30_PAK_B9 | B9 | 2026-04-30 | +5 | confirmed | official (joint statement, Brazil's Ministry) |
| evt_2026_06_18_PAK_B9 | B9 | 2026-06-18 | +5 (west-bank, unscored) | confirmed | official (joint statement, UAE Ministry) |
| evt_2026_08_06_PAK_B9 | B9 | 2026-08-06 | +5 | confirmed | official (joint statement, UAE Ministry) |
| evt_2026_09_06_PAK_B9 | B9 | 2026-09-06 | +5 | confirmed | official (joint statement, UAE Ministry) |
| evt_2026_09_25_PAK_B9 | B9 | 2026-09-25 | +5 (west-bank, unscored) | confirmed | official |

Points are the tier points before decay and weights. B1, D1, A1, A4, B2, B8 and the other generated indicators are left to the build. No row was added to `data/structured/recognitions.csv` (the registry's dates of 1988 have no Government document in this session).

### Maldives

Assessments (34 indicators): has-events 5 (B1, B3, B9, D1, D3), none-found 15, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6 and E1 to E3). Leads: 2 (`lead_20261104_MDV_1`, the Foreign Minister's 80th General Debate statement with no capture; `lead_20261104_MDV_2`, the President's World Humanitarian Day message in indirect speech). Sources read: the General Debate files of the 79th (the President, expired), 80th (the Foreign Minister, no capture) and 81st sessions (the Vice President, R3), the President's Office's site search for Gaza, Palestine, Israeli passport, arrest warrant and Criminal Court (items read), the ICJ declaration and press release (archived), the Court's report A/80/4, UNRWA tables, FTS, the SIPRI register, the Assembly of States Parties' list (a party). The Foreign Ministry's site answers 403.

### Nepal

Assessments: has-events 1 (B1), none-found 19, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11. Leads: none. Sources read: the General Debate files of the 79th (the Prime Minister: no Gaza), 80th (the Permanent Representative, R3) and 81st sessions (the Prime Minister: no Gaza), the Ministry's home page and press-release titles (texts served by script), UNRWA tables (no row), FTS (no flow), the SIPRI register (an order of 1969), the ICJ and ICC lists.

### Pakistan

Assessments: has-events 3 (B1, B9, D3), none-found 18 (B2 generated: a Council member in 2025 and 2026), no-data 2 (A2, C3), unchecked 11. Leads: none. Sources read: the General Debate files of the 79th (expired), 80th and 81st sessions (archived), the Security Council records already archived (S/PV.9841, 9929 and 10000: the Permanent Representative, R3; S/PV.10003: the Foreign Minister), the joint statements already archived, UNRWA tables, FTS (no flow), the SIPRI register, the ICJ and ICC lists. Not searched: the Ministry's and the Prime Minister's Office's releases item by item, Urdu sources, OIC and summit texts (B9 is at its cap).

### Article 19 note (report only)

All three have the twelve qualifying votes recorded (Nepal abstained on A/RES/ES-10/24, the others voted yes on each); none is among the Member States in arrears in the Secretary-General's letter of 3 September 2025 (A/80/362).

### A4 data-year gap (report only)

Nepal's only order from Israel in SIPRI's register is of 1969 (line 493); the Maldives and Pakistan have none.

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-11-04 (methodology 1.0.0-rc.1), the reviewed events scored as if published; the "before" column is the generated events only.

| Country | Before (generated only) | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| MDV | +1 | +49.0 (+49) | Acting to Confronting | B3 +15.0; B9 +9.5; D3 +8.0; the flotilla statement is inside 365 days and ends the passivity penalty (−15); without B3 +34 (Acting), without D3 +41 (Confronting) |
| NPL | +1.5 (+1) | +1.5 (+1) | Acting, unchanged | no event; the passivity penalty (−15) applies |
| PAK | +1 | +34.5 (+34) | Acting, unchanged | B9 at its cap (+10.0); D3 +8.0; four joint statements inside 365 days end the passivity penalty; without D3 +26.5 |

One band change (the Maldives, Acting to Confronting). Read critically (docs/06 §4 step 7): the Maldives' band rests on the ICJ declaration (B3, whose direction is read from its construction of Articles I to IV and flagged for its restatement of the strict standard of intent) and on a D3 increase whose 2024 amount equals its FTS flow; Pakistan's D3 rests on an increase of USD 2,984 over 2022.

## T-P21-46: ARM, BHR, CYP (2026-11-04)

Light protocol (docs/06 §5) for Armenia, Bahrain and Cyprus, by a fresh Opus 5.5 session of the finish run (docs/10 B-755 to B-759). The Comtrade step was skipped (the line COMTRADE-20261104 is in `reports.jsonl`; none of the three has rows). Web searches were not available to this session (the run's search budget was spent, as for T-P21-26): the session read the Government portals it could reach (gov.cy's WordPress search API, mfa.am's site search), the UN's General Debate files and the texts already archived, and records what it did not search, for P-23. Five documents archived, all from existing Wayback captures with `--capture` (Cyprus's 79th General Debate file and four gov.cy pages; gov.cy refuses Save Page Now with 403); every replay fetched again with `curl --compressed` and equal to its index row in bytes and SHA-256. Two failed Save Page Now rows (gov.cy, 403; Bahrain's 80th General Debate file, 405) were removed from `archive/index.csv` by their exact ids.

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2023_10_26_BHR_B9 | B9 | 2023-10-26 | +5 (decayed) | confirmed | official (joint statement, Omani Ministry) |
| evt_2023_12_31_BHR_D3 | D3 | 2023-12-31 | +8 (ended 2024-12-31) | confirmed | dataset (UNRWA tables) |
| evt_2024_12_31_ARM_D3 | D3 | 2024-12-31 | +8 | confirmed | dataset (UNRWA tables) |
| evt_2023_12_31_CYP_D3 | D3 | 2023-12-31 | +8 (ended 2024-12-31) | confirmed | dataset (UNRWA tables) |
| evt_2024_02_19_CYP_B9 | B9 | 2024-02-19 | +2 (decayed) | confirmed | official (joint declaration, Belgian Ministry) |
| evt_2024_04_19_CYP_B11 | B11 | 2024-04-19 | +5 (west-bank, unscored) | confirmed | official (EU Council) |
| evt_2024_07_15_CYP_B11 | B11 | 2024-07-15 | +5 | confirmed | official (EU Council, EUR-Lex) |
| evt_2024_09_25_CYP_B9 | B9 | 2024-09-25 | +2 (decayed) | confirmed | official (General Debate file) |
| evt_2024_11_27_CYP_B9 | B9 | 2024-11-27 | +2 | confirmed | official (joint declaration, gov.cy) |
| evt_2024_12_31_CYP_D3 | D3 | 2024-12-31 | +8 | confirmed | dataset (UNRWA tables) |
| evt_2025_01_09_CYP_B9 | B9 | 2025-01-09 | +2 | confirmed | official (joint declaration, gov.cy) |
| evt_2025_07_21_CYP_B9 | B9 | 2025-07-21 | +5 | confirmed | official (joint statement, Australian Minister) |
| evt_2025_08_12_CYP_B9 | B9 | 2025-08-12 | +5 | confirmed | official (joint statement, Australian Minister) |
| evt_2025_09_24_CYP_B9 | B9 | 2025-09-24 | +2 | confirmed | official (gov.cy, President's address) |
| evt_2025_09_27_CYP_B9 | B9 | 2025-09-27 | +2 | confirmed | official (joint statement, Australian Minister) |
| evt_2025_12_22_CYP_B10 | B10 | 2025-12-22 | −5 | confirmed | official (joint declaration, Greek Prime Minister's office) |
| evt_2025_12_22_CYP_C2 | C2 | 2025-12-22 | −10 | confirmed | official (joint declaration, Greek Prime Minister's office) |
| evt_2026_05_06_CYP_B9 | B9 | 2026-05-06 | +2 | confirmed | official (joint declaration, gov.cy) |
| evt_2026_05_28_CYP_B11 | B11 | 2026-05-28 | +5 (same tier, no points) | confirmed | official (EUR-Lex) |

Points are the tier points before decay and weights. B1, D1, A1, A4, B2, B8 and the other generated indicators are left to the build. No row was added to `data/structured/recognitions.csv` (Armenia's row of 21 June 2024 exists; Cyprus's and Bahrain's registry dates of 1988 have no Government document in this session).

### Armenia

Assessments (34 indicators): has-events 3 (B1, B8, D3), none-found 17, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6 and E1 to E3). Leads: none. Sources read: the Ministry's site search (mfa.am/en/search, Gaza, Israel, Palestine, ceasefire; the Minister's interviews, speeches and press conferences that mention Gaza read), the General Debate files of the 79th and 81st sessions (the Prime Minister: no Gaza; no 80th file), UNRWA tables, FTS, the SIPRI register, the ICJ and ICC lists (a state party). Not searched: the press, Armenian-language sources, the Prime Minister's and President's sites item by item.

### Bahrain

Assessments: has-events 3 (B1, B9, D3), none-found 17 (B2 generated: a Council member in 2026 and 2027), no-data 2 (A2, C3), unchecked 12 (B12 and the eleven of the protocol). Leads: 1 (`lead_20261104_BHR_1`, the Foreign Minister's 80th General Debate statement, no usable capture). Sources read: the General Debate files of the 79th (the Crown Prince and Prime Minister, Arabic, garbled), 80th (the Foreign Minister, no usable capture) and 81st sessions (no Gaza), GA/12712, the joint statements already archived, UNRWA tables, FTS, the SIPRI register, the ICJ and ICC lists (not a party). The Ministry (`mofa.gov.bh`) and the news agency (`bna.bh`) answer 405 from this network: no Government release was read, so B12 (the ambassadors after October 2023) is left unchecked for P-23.

### Cyprus

Assessments: has-events 7 (B1, B9, B10, B11, C2, D1, D3), none-found 13 (B8 among them), no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11. Leads: none. Sources read: gov.cy's search API (Gaza, ceasefire, Palestin*, Criminal Court, Association Agreement, Netanyahu, UNRWA, evacuation; the items on Gaza, Israel and the trilateral summits read), the General Debate files of the 79th to 81st sessions (the 80th by OCR; the gov.cy page archived), the joint statements already archived, UNRWA tables, FTS, the SIPRI register, the ICJ and ICC lists (a state party). Not archivable: the Al-Alamein declaration of 8 September 2026 (no capture, gov.cy refuses Save Page Now). Not searched: the press, Greek-language sources, the Government Spokesman's statements (R3).

### Article 19 note (report only)

All three have the twelve qualifying votes recorded (yes on each, except Cyprus's vote on A/RES/ES-10/21, recorded as an abstention, −2.0 and decayed); none is among the Member States in arrears in the Secretary-General's letter of 3 September 2025 (A/80/362).

### A4 data-year gap (report only)

Cyprus's orders from Israel in SIPRI's register are of 2002 and 2021 (lines 178 to 180; the 2021 Barak-MX system was delivered in 2024); Armenia and Bahrain have none.

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-11-04 (methodology 1.0.0-rc.1), the reviewed events scored as if published; the "before" column is the generated events only.

| Country | Before (generated only) | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| ARM | +9.5 (+9) | +17.5 (+17) | Acting, unchanged | D3 +8.0; no qualifying event inside 365 days, the passivity penalty (−15) applies |
| BHR | +1.5 (+1) | +1.5 (+1) | Acting, unchanged | the B9 of 2023 has decayed and the D3 tier ended on 2024-12-31; the passivity penalty applies |
| CYP | +1.5 (+1) | +24.5 (+24) | Acting, unchanged | B9 at its cap (+10.0); B11 +5.0; D3 +8.0; B10 −5.0; C2 −10.0; four qualifying events inside 365 days end the passivity penalty; without B10 and C2 +39.5 (Acting; Confronting begins at +41) |

No band change. Read critically (docs/06 §4 step 7): Cyprus's B10 and C2 rest on the same reading of the trilateral declaration with Israel as Greece's (flagged, B-326); its B9 cap is reached with or without the decayed and flagged readings.

## T-P21-47: GEO, IRQ, KWT (2026-11-04)

Light protocol (docs/06 §5) for Georgia, Iraq and Kuwait, by a fresh Opus 5.5 session of the finish run (docs/10 B-760 to B-764). The Comtrade step was skipped (the line COMTRADE-20261104 is in `reports.jsonl`; none of the three has rows). Web searches were not available to this session (the run's search budget was spent, as for T-P21-26 and T-P21-46): the session read the UN's General Debate files (read live; Iraq's and Kuwait's in Arabic only), the Security Council records and joint statements already archived, the UN's Meetings Coverage of two Council debates through Wayback, the Georgian Ministry's listings and the Iraqi Prime Minister's Office's latest items, and records what it did not search, for P-23. One document archived, from its existing Wayback capture with `--capture` (Iraq's 80th General Debate file; the replay fetched again with `curl --compressed` equals the live file in bytes and SHA-256). No failed row was left in `archive/index.csv`.

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2024_12_31_IRQ_D3 | D3 | 2024-12-31 | +8 | confirmed | dataset (UNRWA tables) |
| evt_2025_09_23_IRQ_B9 | B9 | 2025-09-23 | +5 (flagged tier) | confirmed | official (General Debate file, Arabic) |
| evt_2024_12_31_KWT_D3 | D3 | 2024-12-31 | +8 | confirmed | dataset (UNRWA tables) |

Points are the tier points before decay and weights. B1, D1, A1, A4, B2, B8 and the other generated indicators are left to the build. No row was added to `data/structured/recognitions.csv` (the registry dates, Georgia 1992 and Iraq and Kuwait 1988, have no Government document in this session).

### Georgia

Assessments (34 indicators): has-events 1 (B1), none-found 19, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6 and E1 to E3). Leads: none. Sources read: the General Debate files of the 79th to 81st sessions (no mention of Gaza, Palestine or Israel; the 80th by the President, Mikheil Kavelashvili), the Ministry's 'Statements by MFA' and news listings (first pages), the joint statements and UN records already archived, the Israeli President's release of 3 August 2026 on new ambassadors (Georgia's ambassador, no indicator), UNRWA tables (no row), FTS, the SIPRI register (orders of 2004 to 2008), the ICJ and ICC lists (a state party). Not searched: the press, Georgian-language sources, the Ministry's and the Government's items one by one (gov.ge and president.gov.ge did not answer).

### Iraq

Assessments: has-events 4 (B1, B9, D1, D3), none-found 16, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11. Leads: none. Sources read: the General Debate files of the 79th (no speaker named, garbled, more than 730 days old), 80th (the President, archived) and 81st sessions (no Gaza, R7), the UN's Meetings Coverage of the Council's January 2024 debate (Iraq's representative, R3), the joint statements already archived (none names Iraq), UNRWA tables, FTS, the SIPRI register (a 2022 order: A4 data-year gap), the ICJ and ICC lists (not a party; case 186 oral statement), pmo.iq's latest items (the Prime Minister Ali Falih al-Zaidi). Not reachable: mofa.gov.iq (530), presidency.iq (challenge). Not searched: the press, the Prime Minister's and Foreign Minister's statements of 2023 to 2026.

### Kuwait

Assessments: has-events 3 (B1, D1, D3), none-found 17, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11. Leads: none. Sources read: the General Debate files of the 79th and 81st sessions (the Crown Prince, R3; no 80th file), S/PV.9534 and S/PV.10003 with the UN's Meetings Coverage of those days through Wayback (the Deputy Foreign Minister in January 2024, R3; an unidentified 'Mr. Al-Sabah' in September 2025, not filed), the joint statement of 26 October 2023 (names Kuwait; not filed: no archived document names the Foreign Minister on that date), the UN's release of the two-State conference of 29 July 2025 (indirect speech, R4), UNRWA tables, FTS, the SIPRI register, the ICJ and ICC lists (not a party; case 186 statements). Not reachable: mofa.gov.kw and kuna.net.kw (Cloudflare challenge). Not searched: the press, the Amiri Diwan's and the Council of Ministers' items.

### Article 19 note (report only)

Georgia has no vote recorded on A/DEC/80/506 (12 September 2025) and A/RES/80/1 (19 September 2025), Iraq none on A/DEC/80/506; neither is among the Member States in arrears in the Secretary-General's letter of 3 September 2025 (A/80/362). The build scores each absence at −2 like an abstention (B-690). Kuwait has the twelve votes recorded.

### A4 data-year gap (report only)

Iraq ordered 108 SandCat armoured personnel carriers from Israel in 2022 ('T-KAT version; from Czech production line', delivered 2023, 15.12 TIV; SIPRI register line 411): an order of an earlier data year, not scored (B-536 (7)). Georgia's orders are of 2004 to 2008; Kuwait has none.

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-11-04 (methodology 1.0.0-rc.1), the reviewed events scored as if published; the "before" column is the generated events only.

| Country | Before (generated only) | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| GEO | −21.0 (−21) | −21.0 (−21) | Enabling, unchanged | no event; nine abstentions and two absences on the qualifying votes; the passivity penalty (−15) applies |
| IRQ | −3.0 (−3) | +9.6 (+10) | Passive → Acting | B9 +4.6 (decay 0.91); D3 +8.0; without the B9 +5.0, without the D3 +1.6 (both Acting); the passivity penalty still applies (the B9 is 407 days old) |
| KWT | +1.5 (+1) | +9.5 (+9) | Acting, unchanged | D3 +8.0; the passivity penalty applies |

One band change (Iraq). Read critically (docs/06 §4 step 7): Iraq's band moves with either event alone; the B9's +5 tier rests on naming starvation and displacement without a legal qualifier (flagged; +2 at the call tier would give about +6.9, still Acting), and both D3 amounts sit in the column pair read, not with certainty, as the oPt flash appeal.

## T-P21-48: LBN, OMN, SYR (2026-11-04)

Light protocol (docs/06 §5) for Lebanon, Oman and the Syrian Arab Republic, by a fresh Opus 5.5 session of the finish run (docs/10 B-765 to B-769). The Comtrade step was skipped (the line COMTRADE-20261104 is in `reports.jsonl`; none of the three has rows). Web searches were not available to this session (the run's search budget was spent, as for T-P21-26, T-P21-46 and T-P21-47): the session read the UN's General Debate files (read live; Oman's 80th, a scan, by OCR), the joint statements and UN records already archived, the Omani Ministry's WordPress API (309 posts on Gaza by title, eight opened) and the Lebanese Presidency's media search, and records what it did not search, for P-23. Four documents archived, all from existing Wayback captures with `--capture` (the 80th General Debate files of Syria and Lebanon, equal to the live files; two pages of the Omani Ministry); every replay fetched again with `curl --compressed` equals its index row in bytes and SHA-256. No failed row was left in `archive/index.csv`.

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2023_12_31_LBN_D3 | D3 | 2023-12-31 (ended 2024-12-31) | +8 (flagged: host in-kind) | confirmed | dataset (UNRWA tables) |
| evt_2024_12_31_LBN_D3 | D3 | 2024-12-31 | +8 (flagged: host in-kind) | confirmed | dataset (UNRWA tables) |
| evt_2025_09_23_LBN_B9 | B9 | 2025-09-23 | +2 (flagged tier) | confirmed | official (General Debate file, French) |
| evt_2023_10_26_OMN_B9 | B9 | 2023-10-26 | +5 (decayed; minister by continuity, flagged) | confirmed | official (the Omani Ministry's text of the joint statement) |
| evt_2023_12_31_OMN_D3 | D3 | 2023-12-31 (ended 2024-12-31) | +8 | confirmed | dataset (UNRWA tables) |
| evt_2025_11_23_OMN_B9 | B9 | 2025-11-23 | +5 (flagged tier) | confirmed | official (the Ministry's text of the Foreign Minister's talk) |
| evt_2026_06_29_OMN_B9 | B9 | 2026-06-29 | +2 (flagged: ceasefire in force) | confirmed | official (the Ministry's text of the joint declaration) |
| evt_2025_09_24_SYR_B9 | B9 | 2025-09-24 | +2 (flagged tier and speaker) | confirmed | official (General Debate file, English) |

Points are the tier points before decay and weights. B1, D1, A1, A4, B2, B8 and the other generated indicators are left to the build. No row was added to `data/structured/recognitions.csv` (registry dates Lebanon 2008, Oman 1988, Syria 2011; no Government document of the date in this session).

### Lebanon

Assessments (34 indicators): has-events 3 (B1, B9, D3), none-found 17, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6 and E1 to E3); D1 none-found (generated). Leads: none. Sources read: the General Debate files of the 79th (the Foreign Minister, Arabic, expired), 80th (the President, French, archived) and 81st sessions (Arabic, no speaker named, no call), S/PV.9763 (Lebanon's representative, R3), the joint statements already archived (none names Lebanon), the Presidency's two items on Gaza (indirect speech, R4), UNRWA tables, FTS, the SIPRI register (transfers of 1976 to 1987 to non-state groups), the ICJ and ICC lists (not a party). Not reachable: pcm.gov.lb, mfa.gov.lb. Not searched: the press, the Prime Ministers' and Foreign Ministers' statements of 2023 to 2026.

### Oman

Assessments: has-events 4 (B1, B9, D1, D3), none-found 16, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11. Leads: none. Sources read: the General Debate files of the 79th (ceasefire call and 'genocidal policies', expired), 80th (a scan read by OCR: no Gaza, R7) and 81st sessions (no Gaza, R7), the joint statement of 26 October 2023 (the Ministry's own text), GA/12639 (the Foreign Minister named in the post), the Ministry's API listing and eight posts (the Foreign Minister's Oslo Forum talk; the joint declarations with France, Spain and India; the press conferences in Ankara and with Pakistan, indirect speech; the Munich and Gulf-security items, no Gaza statement in the Minister's words), UNRWA tables, FTS (plan 1156), the SIPRI register (none), the ICJ and ICC lists (not a party). Not searched: the press, the Ministry's other posts item by item, the Sultan's addresses, the Royal Court (did not answer).

### Syrian Arab Republic

Assessments: has-events 2 (B1, B9), none-found 18, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11; D1 none-found (generated). Leads: none. Sources read: the General Debate files of the 79th (the former government's Foreign Minister, expired), 80th (the President Ahmed al-Sharaa, English, archived) and 81st sessions (Arabic, garbled text layer, normalised: no Gaza), the joint statements already archived (none names Syria), UNRWA tables (in-kind amounts below 2022), FTS, the SIPRI register (none), the ICJ and ICC lists (not a party). Not reached: mofaex.gov.sy (script-rendered), the Presidency (no site answered). Not searched: SANA, the press.

### Article 19 note (report only)

The three have the twelve qualifying votes recorded (all yes); none is among the Member States in arrears in A/80/362.

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-11-04 (methodology 1.0.0-rc.1), the reviewed events scored as if published; the "before" column is the generated events only.

| Country | Before (generated only) | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| LBN | +1.5 (+1) | +11.3 (+11) | Acting, unchanged | D3 2024 +8.0; B9 +1.8 (decay 0.91); the 2023 D3 ended; the passivity penalty (−15) still applies |
| OMN | +1.5 (+1) | +23.5 (+23) | Acting, unchanged | B9 +5.0 (Oslo Forum talk) and +2.0 (French declaration), both qualifying events, end the passivity penalty; without the talk +18.5, without the declaration +21.5, without both +1.5; the 2023 B9 and D3 add nothing |
| SYR | +1.5 (+1) | +3.3 (+3) | Acting, unchanged | B9 +1.8 (decay 0.92); the passivity penalty still applies |

No band change. Read critically (docs/06 §4 step 7): Oman's +22 rests on two flagged B9 readings, and either alone ends the passivity penalty (worth +15); Lebanon's +10 rests mostly on an in-kind host contribution (flagged as Jordan's); all three B9 call-tier readings ('an immediate end to the tragedy unfolding in Gaza', 'an immediate end to the war', 'maintenance of the ceasefire') are flagged.

### 90-minute stop note

The session finished within the limit. Left for P-23: the web searches per indicator group (English, Arabic, French), the Omani Ministry's posts one by one, the Lebanese Council of Ministers and Ministry, the Syrian Ministry and SANA, UNRWA's 2025 table, Comtrade for the three.

## T-P21-49: YEM, LIE, LUX, MCO (2026-11-04)

Light protocol (docs/06 §5) for Yemen, Liechtenstein, Luxembourg and Monaco (group 49 with the former group 50, Monaco, folded in), by a fresh Opus 5.5 session of the finish run (docs/10 B-770 to B-774). The Comtrade step was skipped (the line COMTRADE-20261104 is in `reports.jsonl`; none of the four has rows). Web searches were not available to this session (the run's search budget was spent, as for T-P21-26 and T-P21-46 to T-P21-48): the session read the UN's General Debate files live, the joint statements and UN records already archived (grep of `archive/text` for the four names), the generated tables, the UNRWA tables, the ICJ and ICC lists and the Governments' sites, and records what it did not search, for P-23. Two documents archived: Luxembourg's 80th General Debate file (`--capture 20251002052836`, equal to the live file) and the Liechtenstein Government's page of the Deputy Prime Minister (Save Page Now); both replays fetched again with `curl --compressed` equal their index rows in bytes and SHA-256. No failed row was left in `archive/index.csv`.

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2023_12_31_LIE_D3 | D3 | 2023-12-31 (ended 2024-12-31) | +8 (small increase, flagged) | confirmed | dataset (UNRWA tables) |
| evt_2024_12_31_LIE_D3 | D3 | 2024-12-31 | +8 (ninth column pair, flagged) | confirmed | dataset (UNRWA tables) |
| evt_2025_07_21_LIE_B9 | B9 | 2025-07-21 | +5 (minister by continuity, flagged) | confirmed | official (joint statement, archived for another signatory) |
| evt_2025_08_12_LIE_B9 | B9 | 2025-08-12 | +5 (minister by continuity, flagged) | confirmed | official (joint statement, archived for another signatory) |
| evt_2023_12_31_LUX_D3 | D3 | 2023-12-31 (ended 2024-12-31) | +8 | confirmed | dataset (UNRWA tables) |
| evt_2024_02_19_LUX_B9 | B9 | 2024-02-19 | +2 (decayed) | confirmed | official (joint statement, archived for another signatory) |
| evt_2024_04_19_LUX_B11 | B11 | 2024-04-19 | +5 (west-bank, unscored) | confirmed | official (Council release) |
| evt_2024_07_15_LUX_B11 | B11 | 2024-07-15 | +5 | confirmed | official (Council release, EUR-Lex) |
| evt_2024_12_31_LUX_D3 | D3 | 2024-12-31 | +8 | confirmed | dataset (UNRWA tables) |
| evt_2025_05_07_LUX_B9 | B9 | 2025-05-07 | +5 | confirmed | official (joint statement, signature line) |
| evt_2025_05_16_LUX_B9 | B9 | 2025-05-16 | +5 (the Prime Minister) | confirmed | official (joint statement, signature line) |
| evt_2025_05_19_LUX_B9 | B9 | 2025-05-19 | +2 | confirmed | official (joint statement, archived for another signatory) |
| evt_2025_07_21_LUX_B9 | B9 | 2025-07-21 | +5 | confirmed | official (joint statement, archived for another signatory) |
| evt_2025_07_30_LUX_B9 | B9 | 2025-07-30 | +2 | confirmed | official (joint statement, archived for another signatory) |
| evt_2025_08_10_LUX_B9 | B9 | 2025-08-10 | +5 | confirmed | official (joint statement, signature line) |
| evt_2025_08_12_LUX_B9 | B9 | 2025-08-12 | +5 | confirmed | official (joint statement, archived for another signatory) |
| evt_2025_08_21_LUX_B9 | B9 | 2025-08-21 | +5 (west-bank, unscored) | confirmed | official (joint statement, archived for another signatory) |
| evt_2025_08_29_LUX_B9 | B9 | 2025-08-29 | +5 | confirmed | official (joint statement, signature line) |
| evt_2025_09_26_LUX_B9 | B9 | 2025-09-26 | +2 (flagged tier) | confirmed | official (General Debate file) |
| evt_2025_09_27_LUX_B9 | B9 | 2025-09-27 | +2 | confirmed | official (joint statement, archived for another signatory) |
| evt_2025_12_14_LUX_B9 | B9 | 2025-12-14 | +5 (the Irish reading, flagged) | confirmed | official (letter, signature block) |
| evt_2026_01_05_LUX_B9 | B9 | 2026-01-05 | +2 | confirmed | official (joint statement, archived for another signatory) |
| evt_2026_02_24_LUX_B9 | B9 | 2026-02-24 | +5 (west-bank, unscored) | confirmed | official (joint statement, archived for another signatory) |
| evt_2026_05_28_LUX_B11 | B11 | 2026-05-28 | +5 (same tier, no points) | confirmed | official (EUR-Lex) |
| evt_2026_06_08_LUX_B9 | B9 | 2026-06-08 | +2 | confirmed | official (joint statement, archived for another signatory) |
| evt_2023_12_31_MCO_D3 | D3 | 2023-12-31 (ended 2024-12-31) | +8 (Projects column, flagged) | confirmed | dataset (UNRWA tables) |

Points are the tier points before decay and weights. B1, D1, A1, A4, B2, B8 and the other generated indicators are left to the build. No row was added to `data/structured/recognitions.csv` (Luxembourg's and Monaco's rows of 22 September 2025 exist; Liechtenstein has not recognised; Yemen's 1988 recognition has no Government document of the date in this session). Where a joint statement does not name Luxembourg's Foreign Minister, Xavier Bettel is named by the continuity of the post (he signs four of the archived texts); Liechtenstein's Sabine Monauni is named from the Government's archived page and the continuity of the post (both flagged).

### Yemen

Assessments (34 indicators): has-events 1 (B1), none-found 19, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Leads: none. The B9/B10 speakers are those of the Government that holds the UN seat (the Presidential Leadership Council; flagged, as Libya and Syria); the de facto authorities in Sana'a are not the state's speakers and their ministry's site (`mofa.gov.ye`) is not registered. Sources read: the General Debate files of the 79th (the Chairman Rashad al-Alimi: the Israeli war on the Palestinian people must stop, no Gaza, R7; older than 730 days), 80th (Gaza named as a moral test, no call; no usable capture) and 81st sessions (garbled text layer, no capture), the joint statements already archived (none names Yemen as a signatory), UNRWA tables (no row), FTS, the SIPRI register, the ICJ and ICC lists. Not searched: Saba's reports of the Chairman's summit speeches, the Foreign Minister's statements, the press.

### Liechtenstein

Assessments: has-events 4 (B1, B9, D1, D3), none-found 15, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 12 (A3, A5 to A8, B11, C4 to C6, E1 to E3). Leads: none. Sources read: the 81st General Debate file (no Gaza; the 79th and 80th have no file), the joint statements already archived (two name Liechtenstein), the Government's site (members of the Government; the Foreign Minister's page archived), UNRWA tables, FTS, the SIPRI register, the ICJ and ICC lists (a state party). Not searched: the Government's press releases item by item, the law gazette for an alignment with the EU settler listings (B11 left `unchecked`).

### Luxembourg

Assessments: has-events 6 (B1, B8, B9, B11, D1, D3), none-found 14, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Leads: none. Sources read: the 80th General Debate file (the Prime Minister; the 79th and 81st have no file), the fifteen joint statements already archived that name Luxembourg, the Government's release of the recognition (no named speaker, R3), the Council's three listings, UNRWA tables, FTS, the SIPRI register, the ICJ and ICC lists (a state party). Not searched: the Government's and the Ministry's releases item by item (C1 position, B5 on the warrants, D4), the press.

### Monaco

Assessments: has-events 3 (B1, B8, D3), none-found 16, no-data 3 (A2, C3, D1), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Leads: none. Sources read: the General Debate files of the 79th (the Sovereign Prince, no Gaza) and 81st sessions (the Minister of State: 'appelle toutes les parties à consolider ce cessez-le-feu fragile' in Gaza, a call-tier reading, but no Wayback capture and no press source, so neither an event nor a lead), the joint statements already archived (none names Monaco), UNRWA tables, FTS, the SIPRI register, the ICJ and ICC lists (not a party). Not reached: gouv.mc (HTTP 403 to a script; registered from its Wayback capture).

### Article 19 note (report only)

The four have the twelve qualifying votes recorded; Monaco has a non-vote on A/DEC/80/506 (12 September 2025), scored −2 by the build (B-690), and is not among the Member States in arrears in A/80/362, so the non-vote is not explained by Article 19. Liechtenstein abstained on ES-10/24.

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-11-04 (methodology 1.0.0-rc.1), the reviewed events scored as if published; the "before" column is the generated events only.

| Country | Before (generated only) | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| YEM | +1.5 (+1) | +1.5 (+1) | Acting, unchanged | no event; the passivity penalty (−15) applies |
| LIE | +1.5 (+1) | +17.5 (+18) | Acting, unchanged | B9 +8.05 (two statements, decay 0.78 and 0.83); D3 2024 +8.0; the passivity penalty still applies (the latest B9 is 449 days old) |
| LUX | +9.5 (+9) | +47.5 (+47) | Acting to Confronting | B9 +10 (capped; sum +38.4), B11 +5, D3 2024 +8; four qualifying events inside 365 days (B9 of 14 December 2025, 5 January and 8 June 2026; B11 of 28 May 2026) end the passivity penalty (+15); without the B9 events +37.5 (Acting) |
| MCO | +5.0 (+5) | +5.0 (+5) | Acting, unchanged | the 2023 D3 ended on 2024-12-31; the passivity penalty applies |

One band change. Read critically (docs/06 §4 step 7): Luxembourg's Confronting band rests on the B9 cap reached by the joint statements every EU signatory has (B-444) and on the B11 listings; without the B9 events it stays Acting. The Luxembourg General Debate reading and the Kallas-letter reading are flagged; Liechtenstein's and Monaco's D3 increases are small or in non-programme columns (flagged).

### 90-minute stop note

The session finished within the limit. Left for P-23: the web searches per indicator group (English, French, German, Arabic), the Luxembourg and Liechtenstein Government releases item by item, Liechtenstein's alignment with the EU listings, Monaco's 81st General Debate statement (a capture or the Government's copy), Yemen's Chairman's summit speeches on Saba, UNRWA's 2025 table, Comtrade for the four.

## T-P21-31: BDI, BEN, BFA (2026-11-04)

Light protocol (docs/06 §5) for Burundi, Benin and Burkina Faso (group 31, the first group of Task B in the Claude track, B-694), by a fresh Sonnet 5.5 session of the finish run (docs/10 B-775 to B-779). The Comtrade step was skipped (the line COMTRADE-20261104 is in `reports.jsonl`; none of the three has rows). Web searches were not available to this session (the run's search budget was spent, as for T-P21-26 and T-P21-46 to T-P21-49): the session read the UN's General Debate files live (the 79th to 81st sessions, all French), the records and joint statements already archived (grep of `archive/text` for the three names, with and without accents), the Governments' sites that answer scripts (the Burundian Presidency and Ministry, the Burkinabè Ministry and Government Information Service, searched through their WordPress APIs), the UN Treaty Collection's status page for the Rome Statute, the generated tables, UNRWA tables, FTS, the SIPRI register and the ICJ and ICC lists.

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2026_06_24_BFA_B6 | B6 | 2026-06-24 | -10 (scope `related`, unscored; flagged) | confirmed | official (UN depositary notification C.N.263.2026) |

Points are the tier points before decay and weights. B1, D1, A1, A4, B2, B8 and the other generated indicators are left to the build. No row was added to `data/structured/recognitions.csv` (the registry's dates of 22 December 1988, 12 May 1989 and 21 November 1988 have no Government document of the date in this session). Two documents were archived (the depositary notification by `--capture 20260802081235`; the Burundian Presidency's report of 22 December 2023 by Save Page Now); both replays fetched again with `curl --compressed` equal their index rows in bytes and SHA-256.

### Burundi

Assessments (34 indicators): has-events 1 (B1), none-found 19, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). One lead (`lead_20261104_BDI_1`, B10): the Presidency's report of 22 December 2023 of the audience for Israel's special envoy, in indirect speech (R4), 1,048 days old; not filed. General Debate statements: the 79th and 81st (the President, as Chairperson of the African Union) name neither Gaza nor Palestine; the 80th (Foreign Minister Bizimana) names 'les horreurs que nous observons à Gaza' with no call and no named violation. Not a state party to the Rome Statute since 27 October 2017. Not searched: the African Union's texts of the President's speeches as Chairperson, the Official Gazette, one search per indicator group in French and English (P-23).

### Benin

Assessments: has-events 1 (B1), none-found 14, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 16 (A3, A5 to A8, B11, B12, C2, C4 to C6, D4, D5, E1 to E3). Leads: none. The 79th statement was delivered by the Foreign Minister (GA/12639): it condemned the attacks of 7 October 2023 and called for dialogue with two States, with no ceasefire call; the 80th and 81st were delivered by the Permanent Representative (R3). B1: ten non-votes of the twelve qualifying votes, scored -2 each by the build (flagged for the author, B-777). The Ministry's site is a landing page and the Presidency's and Government's portals cannot be searched, so five indicators are left `unchecked` with the reason.

### Burkina Faso

Assessments: has-events 2 (B1, B6), none-found 18, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Leads: none. B6: the withdrawal from the Rome Statute notified on 24 June 2026 (scope `related`, unscored, the default of Venezuela's, B-622 (3); if the author scores it, the preview goes from -6.9 to -1.9 because the event ends the passivity penalty). General Debate statements: the 79th (Foreign Minister) and 80th (Prime Minister) never name Gaza (R7); the 81st (Foreign Minister, for the Confederation of Sahel States) names 'les populations civiles de Gaza' with no call and no named violation. Not searched: the Presidency of Faso's news (its REST API is closed), the Burkinabè press, the Sahel states' joint announcement of September 2025 on the ICC, the Official Journal (P-23).

### Article 19 note (report only)

The three have the twelve qualifying votes recorded: Burundi two non-votes (A/RES/ES-10/21, A/RES/80/1), Burkina Faso five (ES-10/21, ES-10/22, ES-10/25, 79/232, 80/116), Benin ten (all but ES-10/22 and ES-10/23). None is named in A/80/362 (3 September 2025) or on the Assembly's page of October 2026 (A/81/360); the letters between those dates and the arrears lists of 2023 and 2024 were not checked. The build scores a non-vote at -2 (B-690).

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-11-04 (methodology 1.0.0-rc.1), the reviewed events scored as if published; the "before" column is the generated events only.

| Country | Before (generated only) | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| BDI | -3.0 (-3) | -3.0 (-3) | Passive, unchanged | no event; the passivity penalty (-15) applies |
| BEN | -26.0 (-26) | -26.0 (-26) | Enabling, unchanged | no event; B1 -11.0 (ten non-votes) and the passivity penalty (-15) |
| BFA | -6.9 (-7) | -6.9 (-7) | Passive, unchanged | B6 is out of scope (`related`); with the scope `gaza` the score would be -1.9 (Passive): the B6 event, a negative qualifying event, ends the passivity penalty |

No band change. Read critically (docs/06 §4 step 7): Benin's Enabling band rests on the build's treatment of ten non-votes at -2 each and on the passivity penalty; nothing hand-authored moves it.

### 90-minute stop note

The session finished within the limit. Left for P-23: the web searches per indicator group (French, English), Benin's Presidency and Government news, the African Union's texts of the Burundian President's speeches as Chairperson, the Sahel states' announcement on the ICC, the Burkinabè press, UNRWA's 2025 table, Comtrade for the three.

## T-P21-32: BWA, CAF, CIV (2026-11-04)

Light protocol (docs/06 §5) for Botswana, the Central African Republic and Côte d'Ivoire (group 32, Task B in the Claude track, B-694), by a fresh Sonnet 5.5 session of the finish run (docs/10 B-780 to B-784). The Comtrade step was skipped (the line COMTRADE-20261104 is in `reports.jsonl`; none of the three has rows). Web searches were not available to this session (the run's search budget was spent, as for T-P21-31): the session read the UN's General Debate files of the 79th to 81st sessions live (Botswana in English, the Central African Republic and Côte d'Ivoire in French; the Central African 81st file by OCR), the Governments' sites that answer scripts (the Botswana Government's press-release database filtered by title and the Daily News search; the Central African Primature's WordPress API and the Government portal; the Ivorian Presidency's WordPress site), the Embassy of Israel in Abidjan's page, the UN Treaty Collection's status page for the Rome Statute, the records and joint statements already archived (grep of `archive/text` for the three names), the generated tables, UNRWA tables, FTS, the SIPRI register and the ICJ and ICC lists.

No event and no lead were filed. One row was added to `data/structured/recognitions.csv` (Botswana, 19 December 1988, from the Ministry's notice of 19 March 2017 as the Government's newspaper published it; docs/10 B-783).

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| none | | | | | |

Six documents were archived (four General Debate files by `--capture`: Botswana's 79th, the Central African Republic's 79th and 80th, Côte d'Ivoire's 80th Foreign Minister's statement; the Israeli embassy's page and the Daily News notice by Save Page Now); every replay fetched again with `curl --compressed` equals its index row in bytes and SHA-256.

### Botswana

Assessments (34 indicators): has-events 1 (B1), none-found 19 (B11, B12, C2, D4 and D5 on title searches of the Government's press-release database only, said in each note), no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Leads: none. President Masisi's 79th statement (25 September 2024) condemns attacks on civilians 'on both sides', voices concern at the situation in the Gaza Strip and abhors attacks on UNRWA installations, with no ceasefire call and no party named: not a B9 tier (the reading of Samoa's statement, flagged; docs/10 B-780); President Boko's 80th welcomes four recognitions and states solidarity with the Palestinian people; the 81st names none of Gaza, Palestine, Israel. B1: two non-votes (A/RES/80/1, A/RES/80/78). The SIPRI register lists two older orders from Israel (1991; 2016, delivered 2019 to 2023), before the window. Not searched: the Ministry of International Relations (did not answer), the Botswana press, the 'Statement of Shared Commitments on UNRWA' (P-23).

### Central African Republic

Assessments: has-events 1 (B1), none-found 14, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 16 (A3, A5 to A8, B11, B12, C2, C4 to C6, D4, D5, E1 to E3). Leads: none. President Touadéra's three General Debate statements never name Gaza (the 79th lists 'l'Israël et le Hamas' among the wars; the 80th speaks of 'les violences persistantes entre Israël et la Palestine'; the 81st has nothing): R7. The Primature's site has no item on the conflict. B1: eight non-votes and one abstention of the twelve qualifying votes (-11.0; flagged for the author, docs/10 B-781). The Ministry and the Presidency do not answer, so five indicators are left `unchecked` with the reason.

### Côte d'Ivoire

Assessments: has-events 1 (B1), none-found 14, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 16 (A3, A5 to A8, B11, B12, C2, C4 to C6, D4, D5, E1 to E3). Leads: none. The 80th statement (Foreign Minister Adom) never names Gaza; the 79th and 81st were delivered by Vice President Koné (R3: not B9), the 81st speaking of 'la reprise des hostilités au Proche et au Moyen-Orient'. B1: yes on all twelve votes. The Embassy of Israel's page lists no agreement signed since October 2023 (a timeline only). The Ivorian Government's sites could not be searched (the Presidency's posts end in October 2023).

### Article 19 note (report only)

The three have the twelve qualifying votes recorded: Botswana two non-votes (A/RES/80/1, A/RES/80/78), the Central African Republic eight non-votes (A/RES/ES-10/24 to A/RES/80/78) and one abstention (A/RES/80/116), Côte d'Ivoire none. None is named in A/80/362 (3 September 2025) or on the Assembly's page of October 2026 (A/81/360); the letters between those dates and the arrears lists of 2023 and 2024 were not checked. The build scores a non-vote at -2 (B-690).

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-11-04 (methodology 1.0.0-rc.1), the reviewed events scored as if published; the "before" column is the generated events only.

| Country | Before (generated only) | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| BWA | -8.0 (-8) | -5.0 (-5) | Passive, unchanged | the recognition row adds B8 +3.0 (standing from 2023-10-07); the passivity penalty (-15) still applies |
| CAF | -26.0 (-26) | -26.0 (-26) | Enabling, unchanged | no event; B1 -11.0 (eight non-votes, one abstention) and the passivity penalty (-15) |
| CIV | +1.5 (+1) | +1.5 (+1) | Acting, unchanged | no event; B1 +16.5 less the passivity penalty (-15) |

No band change. Read critically (docs/06 §4 step 7): the Central African Republic's Enabling band rests on the build's treatment of nine non-supporting votes and the passivity penalty; Côte d'Ivoire's Acting band rests on B1 alone and a +1.5 raw score, so any scored event in either direction changes it.

### 90-minute stop note

The session finished within the limit. Left for P-23: the web searches per indicator group (English, French), the Botswana Ministry of International Relations' site and press, the Central African Ministry of Foreign Affairs and Presidency, the Ivorian Government's news and the OIC's communiques, Botswana's 80th and the three states' 81st General Debate files (no Wayback replay), UNRWA's 2025 table, Comtrade for the three, the Government documents for the recognition dates of the Central African Republic and Côte d'Ivoire; for Task V and the Chad session: the withdrawals by Chad (27 July 2026) and Nauru (23 September 2026) listed on the Rome Statute status page.

## T-P21-33: CMR, COD, COG (2026-11-04)

Light protocol (docs/06 §5) for Cameroon, the Democratic Republic of the Congo and the Congo (group 33, Task B in the Claude track, B-694), by a fresh Sonnet 5.5 session of the finish run (docs/10 B-785 to B-788). The Comtrade step was skipped (the line COMTRADE-20261104 is in `reports.jsonl`; none of the three has rows). Web searches were not available to this session (the run's search budget was spent, as for T-P21-31 and T-P21-32): the session read the UN's General Debate files of the 79th to 81st sessions live (French; the `_en` files return 404), the Presidency of Cameroon's site search, the Congolese Ministry's and Primature's WordPress sites and the Congo's Government portal through their REST APIs, the Embassy of Israel in Yaounde's page, the UN Treaty Collection's status page for the Rome Statute, the records and joint statements already archived (grep of `archive/text` for the three names: none is a joint statement signed by one of them), the generated tables, UNRWA tables, FTS, the SIPRI register and the ICJ and ICC lists.

No event and no lead were filed. No row was added to `data/structured/recognitions.csv`.

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| none | | | | | |

Ten documents were archived (five General Debate files by `--capture`: the Democratic Republic of the Congo's 79th and 80th, the Congo's 79th and 80th, Cameroon's 79th; the Presidency of Cameroon's reply to the diplomatic corps of 10 January 2025 and its report of the credentials ceremony of 29 November 2024; the Congo's two replies to the diplomatic corps of 5 January 2024 and 6 January 2025, the second by `--capture` after Save Page Now answered 503 and 504; the Israeli embassy's page); every replay fetched again with `curl --compressed` equals its index row in bytes and SHA-256.

### Cameroon

Assessments (34 indicators): has-events 1 (B1), none-found 15, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 15 (A3, A5 to A8, B11, C2, C4 to C6, D4, D5, E1 to E3). Leads: none. The 79th statement (Minister Mbella Mbella) names Gaza in a list of conflicts with no call; the 80th and 81st never name Gaza; President Biya's reply to the diplomatic corps of 10 January 2025 lists Gaza among tragedies, no call. His letter of condolence to Mr Herzog of 9 October 2023 (an image on the Presidency's site) is not B10 (flagged, docs/10 B-785); the President of the General Assembly's statement of 12 June 2025 is an officer's, not B9. B12: Israel's ambassador presented his credentials on 29 November 2024. B1: nine abstentions and three non-votes (-11.0). Not a state party to the Rome Statute (signed 1998). The Ministry of External Relations does not answer, so four indicators are left `unchecked` with the reason.

### Democratic Republic of the Congo

Assessments: has-events 1 (B1), none-found 20, no-data 2 (A2, C3), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Leads: none. President Tshisekedi's 79th statement calls Gaza 'le terrible drame' and the 80th says the war between Israël and Hamas 'ravage la bande de Gaza': no call, no violation, neither B9 tier (flagged, docs/10 B-786); the 81st (Prime Minister Suminwa) names none. The Ministry's and the Primature's sites have no item on the conflict. Security Council member from 2026 (first presidency of the Council in July 2026); no veto after 18 September 2025 in the table. B1: two yes votes, four abstentions, six non-votes (-11.0). State party to the Rome Statute since 2002. B11, B12, C2, D4 and D5 are `none-found` on those two sites only, said in each note; the Presidency answers 503.

### Congo

Assessments: has-events 1 (B1), none-found 19, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Leads: none. The 79th statement (Foreign Minister Gakosso) lists 'en Palestine'; the 80th (President Sassou N'Guesso) supports the two-State solution 'au Moyen-Orient'; the 81st calls for 'une solution politique juste et durable au Moyen-Orient': none names Gaza (R7). The President's reply to the diplomatic corps of 5 January 2024 names Gaza in a statement of concern and support for mediation and aid delivery, with no ceasefire call: neither B9 tier (flagged, docs/10 B-787; 1,034 days old, it would move nothing). B1: seven yes votes and five non-votes (+5.2). State party to the Rome Statute since 2004. B11, B12, C2, D4 and D5 are `none-found` on the Government portal only, said in each note.

### Article 19 note (report only)

The three have the twelve qualifying votes recorded: Cameroon nine abstentions and three non-votes (A/RES/ES-10/23, A/RES/80/1, A/RES/80/116), the Democratic Republic of the Congo six non-votes (A/RES/ES-10/23, ES-10/25, ES-10/26, A/RES/79/232, A/RES/80/1, A/RES/80/116), the Congo five (A/RES/ES-10/23, ES-10/24, A/RES/79/232, A/RES/80/1, A/RES/80/78). None is named in A/80/362 (3 September 2025) or on the Assembly's page of October 2026 (A/81/360); the letters between those dates and the arrears lists of 2023 and 2024 were not checked. The build scores a non-vote at -2 (B-690).

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-11-04 (methodology 1.0.0-rc.1), the reviewed events scored as if published; no event was filed, so the preview equals the generated events only.

| Country | Before (generated only) | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| CMR | -26.0 (-26) | -26.0 (-26) | Enabling, unchanged | no event; B1 -11.0 (nine abstentions, three non-votes) and the passivity penalty (-15) |
| COD | -26.0 (-26) | -26.0 (-26) | Enabling, unchanged | no event; B1 -11.0 (four abstentions, six non-votes) and the passivity penalty (-15) |
| COG | -9.8 (-10) | -9.8 (-10) | Passive, unchanged | no event; B1 +5.2 (seven yes votes, five non-votes) less the passivity penalty (-15) |

No band change. Read critically (docs/06 §4 step 7): the two Enabling bands rest on the build's treatment of non-supporting votes and the passivity penalty, not on any act in the window; the Democratic Republic of the Congo sits on the Security Council in 2026 and the sources read give no act of it on Gaza.

### 90-minute stop note

The session finished within the limit. Left for P-23: the web searches per indicator group (English, French), the Ministry of External Relations of Cameroon (does not answer), the Cameroonian and Congolese press, the OIC's and the African Union's communiques, the DRC's Presidency (503) and the Congo's Ministry and Presidency sites, the unarchived 80th and 81st Cameroonian, 81st Congolese and 81st DRC General Debate files, the Security Council meetings under the DRC's presidency of July 2026, UNRWA's 2025 table, Comtrade for the three, the Government documents for the recognition dates of the DRC (18 December 1988), the Congo (5 December 1988) and Cameroon (none in the registry), the unexplained non-votes of B1.


## T-P21-34: COM, CPV, DJI (2026-11-04)

Light protocol (docs/06 §5) for the Comoros, Cabo Verde and Djibouti (group 34, Task B in the Claude track, B-694), by a fresh Sonnet 5.5 session of the finish run (docs/10 B-789 to B-792). The Comtrade step was skipped (the line COMTRADE-20261104 is in `reports.jsonl`; none of the three has rows). Web searches were not available to this session (the run's search budget was spent): the session read the Comoros' Presidency site through its search page, the Government portal of Cabo Verde through its REST API, the Presidency of Djibouti's list of articles, the UN's General Debate pages and files through Wayback (the live `gadebate.un.org` answers a bot check to scripted requests; it was not worked around), the ICJ's case 192 page and the Comoros' declaration of intervention (UNISPAL copy), the Assembly of States Parties' list, the generated tables, UNRWA tables, the SIPRI register and the Article 19 documents.

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2024_11_27_COM_B9 | B9 | 2024-11-27 | +5 | confirmed | official (Presidency's page of the speech) |
| evt_2025_09_24_COM_B9 | B9 | 2025-09-24 | +5 | confirmed | official (Presidency's page of the speech) |
| evt_2025_10_31_COM_B3 | B3 | 2025-10-31 | +15 | confirmed | court listing and the declaration (UNISPAL copy) |
| evt_2026_10_29_COM_B9 | B9 | 2026-10-29 | +5 (flagged tier and date) | confirmed | official (Presidency's page of the speech) |

Nine documents were archived (the Comoros' Presidency pages of the speeches of 17 February 2024, 27 November 2024, 24 September 2025, 24 September 2026 and 29 October 2026; the Government of Cabo Verde's communiqué of 1 November 2023 and the Prime Minister's speech of 26 September 2025; the Presidency of Djibouti's release of 22 September 2025; the Comoros' declaration of intervention). The MEDays page was first recorded as a bot-check page; that row was removed by exact id (B-208) and the page recorded from the existing Wayback capture 20241203170337. Every replay fetched again with `curl --compressed` equals its index row in bytes and SHA-256.

### Comoros

Assessments (34 indicators): has-events 3 (B1, B3, B9), none-found 17, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Events: 4 (see the table). President Azali Assoumani named a genocide in Gaza at the MEDays forum in Tangier (27 November 2024) and at the 80th General Debate (24 September 2025); at the third Russia-Africa summit (29 October 2026) he said a genocide continued in Palestine and called for the protection of civilians in Gaza (flagged tier and date, docs/10 B-789). The Comoros filed a declaration of intervention in ICJ case 192 (listed 31 October 2025; the direction is this session's reading, flagged). Not filed: the African Union speech of 17 February 2024 and the 81st General Debate statement (Palestine, no Gaza, R7), the 79th General Debate statement (the speaker is the President in the file and the Foreign Minister in the UN's page; expired), the Presidency's third-person reports (R4). B1: ten yes votes, two non-votes. State party to the Rome Statute. The Ministry of Foreign Affairs has no site that answers.

### Cabo Verde

Assessments: has-events 1 (B1), none-found 19, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Events: none. Leads: none. President Neves (79th) and Prime Minister Correia e Silva (80th) never name Gaza; the Prime Minister's 80th sentence is the two-State solution. The Government's communiqué of 1 November 2023 (no named speaker; support for Israel's right to defend itself conditional on international humanitarian law) is not B10 (flagged, docs/10 B-790). B1: nine yes votes, two abstentions, one non-vote. State party to the Rome Statute; not on the Court's list of interveners.

### Djibouti

Assessments: has-events 1 (B1), none-found 19, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Events: none. Leads: none. The Presidency's release of 22 September 2025 summarises, in the third person, President Guelleh's statement at the Trusteeship Council conference, including that a UN inquiry confirmed a genocide in Gaza (indirect speech, R4; the statement's text was not found, docs/10 B-791). The 80th General Debate statement was delivered by the Permanent Representative (not a B9 speaker). B1: twelve yes votes of twelve. State party to the Rome Statute; written statement in case 186 (2023), not B3 or B4.

### Article 19 note (report only)

The three have the twelve qualifying votes recorded: the Comoros two non-votes (A/RES/79/232, A/RES/ES-10/27), Cabo Verde one (A/RES/80/116) and Djibouti none. None is named in A/80/362 (3 September 2025) or on the Assembly's page of October 2026 (A/81/360); the letters between those dates and the arrears lists of 2023 and 2024 were not checked. The build scores a non-vote at -2 (B-690).

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-11-04 (methodology 1.0.0-rc.1), the reviewed events scored as if published.

| Country | Before (generated only) | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| COM | -4 (Passive) | +36.3 (+36) | Passive to Acting | B3 +15 (standing from 31 October 2025), two B9 events of 2024 and 2025 and one of 2026 (cap +10); the October 2026 event is the only qualifying event of the last 365 days, so passivity (-15) is not applied; without it +17.3 (Acting) |
| CPV | -3.5 (-4) | -3.5 (-4) | Passive, unchanged | no event; B1 and the passivity penalty (-15) |
| DJI | +1.5 (+1) | +1.5 (+1) | Acting, unchanged | no event; twelve yes votes in B1 and the passivity penalty (-15) |

One band change (the Comoros), resting on the B3 direction and the third B9 event (both flagged). Read critically (docs/06 §4 step 7): Cabo Verde's and Djibouti's bands rest on B1 and the passivity penalty, not on any act found in the window; the Djibouti Presidency's third-person release of 22 September 2025 could change that if the statement's text is found.

### 90-minute stop note

The session finished within the limit. Left for P-23 and Task V: the web searches per indicator group (English, French, Portuguese, Arabic), the Comoros' Ministry of Foreign Affairs, the 79th General Debate statement of the Comoros (speaker), the 81st General Debate files of the three, the text of President Guelleh's statement of 22 September 2025, Cabo Verde's Ministry and its pages of 22 January and 14 April 2024 (read, not archived), the Article 19 check, Comtrade for the three and the Government documents for the recognition dates.

## T-P21-35 — Eritrea, Ethiopia, Gabon (2026-11-04)

Light protocol, group 35, fifth sub-Saharan group in the Claude track (Task B, B-694), run by a Sonnet 5.5 session. Comtrade step skipped (COMTRADE-20261104 present; none of the three has rows). Web searches were not available (the run's search budget was spent): the session read the Eritrean Ministry of Information's portal through its site search, the Ethiopian Ministry's JSON endpoints and the Ethiopian News Agency's search, the Gabonese Presidency's and Press Agency's REST APIs and the Ministry's site search, the UN's General Debate pages and files of the 79th to 81st sessions (live; the Ethiopian files, which are image scans, by OCR), the ICJ's case 192 page (live), the Assembly of States Parties' list and the Treaty Collection's page, the generated tables, UNRWA tables, the SIPRI register and the Article 19 documents.

No event was filed. One lead (Ethiopia, C2) and one recognition row (Gabon).

| Row | Kind | Date | Detail | Source kind |
|---|---|---|---|---|
| GAB, 1988-12-12 | recognition (R21) | 2025-09-25 (speech) | President Oligui Nguema: 'Le 12 décembre 1988, le Gabon reconnaissait officiellement l’État de Palestine' (+3.0 standing B8 from 2023-10-07 in the build) | official (Presidency's page of the General Debate speech) |
| lead_20261104_ETH_1 | lead, C2 | 2025-03 to 2026-09 | Ethiopia-Israel ministerial contacts and cooperation reports, no signing found | press (Ethiopian News Agency) |

Eight documents were archived (Gabon: the President's 79th and 80th General Debate speeches, the Council of Ministers' communiqué of 14 May 2024, the Ministry's notes of 16 December 2024 and 19 December 2023; Eritrea: the Ministry of Information's press statement of 19 January 2025; Ethiopia: the Ethiopian News Agency's reports of 5 May 2025 and 12 October 2026). Every replay fetched again with `curl --compressed` equals its index row in bytes and SHA-256.

### Eritrea

Assessments (34 indicators): has-events 1 (B1), none-found 19, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Events: none. Leads: none. The Foreign Minister's 80th and 81st General Debate statements name neither Gaza nor Palestine; his 79th and his Non-Aligned Movement statement of 23 September 2024 are expired. The Ministry of Information's press statement of 19 January 2025 (no named speaker) welcomes the ceasefire agreement and urges support for 'an independent Palestinian State' (not B9). B1: eleven yes votes, one non-vote. Not a state party to the Rome Statute (signed 1998). Docs/10 B-793.

### Ethiopia

Assessments: has-events 1 (B1), none-found 19, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11. Events: none. Leads: one (C2). The President's 80th General Debate passage (25 September 2025) affirms the Palestinian people's right to self-determination, calls for direct negotiation among 'the warring parties' and humanitarian access, and names neither Gaza nor a ceasefire (neither tier, flagged); the 79th and 81st name none of Gaza, Palestine or Israel. The Ethiopian News Agency reports frequent contacts with Israel's Government (talks on trade, energy and agriculture in March and May 2025; the Prime Minister's call with Mr Netanyahu on 12 October 2026), none of which names Gaza or reports a signing. B1: five yes votes, seven abstentions. Not a state party to the Rome Statute. Docs/10 B-794.

### Gabon

Assessments: has-events 1 (B1), none-found 20, no-data 2 (A2, C3), unchecked 11. Events: none. Leads: none. The President's 80th General Debate speech states the recognition of 12 December 1988 (a recognition row) and the two-State solution without naming Gaza; his 79th asks the Assembly 'de ne pas détourner les yeux de Gaza' with no call (neither tier; expired). The 81st statement, by the Foreign Minister, names none of Gaza, Palestine or Israel. The Deputy Permanent Representative's statement at the Security Council on 19 December 2023 ('Ce bain de sang doit cesser') is not a B9 speaker's. B1: ten yes votes, two non-votes. State party to the Rome Statute (ratified 2000). Docs/10 B-795, B-796.

### Article 19 note (report only)

The three have the twelve qualifying votes recorded: Eritrea one non-vote (A/DEC/80/506), Ethiopia seven abstentions, Gabon two non-votes (A/RES/79/232, A/RES/80/1). None is named in A/80/362 (3 September 2025) or on the Assembly's page of October 2026 (A/81/360); the letters between those dates and the arrears lists of 2023 and 2024 were not checked. The build scores a non-vote and an abstention at -2 (B-690).

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-11-04 (methodology 1.0.0-rc.1).

| Country | Before (generated only) | With the reviewed events and the recognition row | Band | What moves it |
|---|---|---|---|---|
| ERI | -3.0 (-3) | -3.0 (-3) | Passive, unchanged | no event; B1 and the passivity penalty (-15) |
| ETH | -18.2 (-18) | -18.2 (-18) | Passive, unchanged | no event; seven abstentions in B1 and the passivity penalty (-15) |
| GAB | -4.8 (-5) | -1.8 (-2) | Passive, unchanged | the recognition row (B8 +3.0 standing); B1 and the passivity penalty (-15) |

No band change. Read critically (docs/06 §4 step 7): all three bands rest on B1 and the passivity penalty, not on any act found in the window; Gabon's change comes from a recognition of 1988.

### 90-minute stop note

The session finished within the limit. Left for P-23 and Task V: the web searches per indicator group (English, French, Amharic, Tigrinya), Eritrea's Ministry of Foreign Affairs and Presidency (no site found), the Prime Minister of Ethiopia's posts, Ethiopia's BRICS declarations, the Ministry's releases of the March 2025 visit to Israel, the Government documents for the Ethiopian recognition date, the Article 19 check, and Comtrade for the three.

## T-P21-36 — Ghana, Guinea, the Gambia (2026-11-04)

Light protocol, group 36, sixth sub-Saharan group in the Claude track (Task B, B-694), run by a Sonnet 5.5 session of the finish run (docs/10 B-798 to B-801). Comtrade step skipped (COMTRADE-20261104 present; none of the three has rows). Web searches were not available (the run's search budget was spent): the session read the Governments' own sites through their REST APIs and site searches (Ghana's Presidency and Ministry; Guinea's Presidency, Government portal, Ministry and Prime Minister's site; the Gambia's State House and Ministry), the UN's General Debate pages and files of the 79th and 80th sessions through Wayback (the live `gadebate.un.org` answers scripted requests with a bot check, not worked around), the ICJ's case 192 page (live), the Treaty Collection's page on the Rome Statute (live) and the generated tables.

Three events (the Gambia) and one lead (Ghana).

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2024_05_04_GMB_B9 | B9 | 2024-05-04 | +5 (flagged tier; expired, weight zero) | confirmed | official (State House's page of the President's address) |
| evt_2025_06_06_GMB_B9 | B9 | 2025-06-06 | +2 (flagged: 'such atrocities') | confirmed | official (State House's page of the President's message) |
| evt_2025_08_25_GMB_B9 | B9 | 2025-08-25 | +5 (flagged: Ministry's release with two quoted passages) | confirmed | official (Ministry's release of 27 August 2025) |
| lead_20261104_GHA_1 | lead, B9 | 2026-09-01 | the President at the Non-Aligned summit, Gaza in the Presidency's indirect speech | press (Presidency's report) |

Eleven documents were archived (Ghana: the Presidency's report of 1 September 2026, the Ministry's release of 23 January 2026, and the 79th and 80th General Debate files recorded from Wayback captures 20250424210546 and 20251217131154; Guinea: the Government's texts of the Prime Minister's 79th and the President's 81st speeches; the Gambia: State House's address of 4 May 2024, Koriteh message of 9 April 2024, 79th statement and Eid al-Adha message of 6 June 2025, and the Ministry's release of 27 August 2025). Every replay fetched again with `curl --compressed` equals its index row in bytes and SHA-256.

### Ghana

Assessments (34 indicators): has-events 1 (B1), none-found 20, no-data 2 (A2, C3), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Events: none. Leads: one (B9). The President's 80th General Debate statement (25 September 2025) deplores the denial of visas to President Abbas and speaks of people facing 'collective punishment and forced starvation' because they are Palestinian, never naming Gaza (R7: read as citing Gaza it would be +5, flagged); at the Non-Aligned summit in Belgrade (1 September 2026) the Presidency's report puts the call on Gaza in indirect speech (the lead). President Akufo-Addo's 79th names Gaza in a passage on Security Council reform (neither tier; expired). The Ministry's releases on Palestine and Israel are meetings (the third Ghana-Israel Political Dialogue in Jerusalem, 21 January 2026: no signing). B1: twelve yes votes. Security Council member to 31 December 2023 (no veto). State party to the Rome Statute; not on the Court's list of interveners.

### Guinea

Assessments: has-events 1 (B1), none-found 19, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11. Events: none. Leads: none. The President's 81st General Debate statement (24 September 2026, the Government's text) names none of Gaza, Palestine or Israel; the Prime Minister's 79th (28 September 2024; expired) lists 'entre Israël et la Palestine' among wars with no call; the 80th was by the Minister of State, Secretary-General of the Presidency (not a B9 speaker; the file has no capture and was not read). The four Government sites' searches found no statement on the war and no agreement with Israel. B1: twelve yes votes. State party to the Rome Statute; not on the Court's list of interveners.

### The Gambia

Assessments: has-events 2 (B1, B9), none-found 18, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11. Events: three (see the table). President Barrow, Chairman of the OIC since the Banjul Summit of May 2024, commended South Africa's case before the ICJ and said that impunity for 'grave violations of international law, such as those committed against the Palestinian people, will not be tolerated' (4 May 2024, expired); called upon Israel 'to cease its military operations and ensure unhindered access for humanitarian aid' to Gaza (Eid al-Adha message, 6 June 2025); and Foreign Minister Njie told the OIC Council of Foreign Ministers in Jeddah (25 August 2025) that 'forceful displacement of the Palestinian people' and the destruction of their homes would not bring peace (the Ministry's release prints the passage in quotation marks). Not filed: the Koriteh message of 9 April 2024 (never names Gaza), the 79th statement (no call), the 80th (Vice President), Foreign Minister Tangara's Istanbul statement (indirect speech). B1: eleven yes votes and one non-vote (A/RES/80/1). State party to the Rome Statute; not on the Court's list of interveners.

### Article 19 note (report only)

The three have the twelve qualifying votes recorded: the Gambia one non-vote (A/RES/80/1), Ghana and Guinea none. None is named in A/80/362 (3 September 2025) or on the Assembly's page of October 2026 (A/81/360); the letters between those dates and the arrears lists of 2023 and 2024 were not checked. The build scores a non-vote at -2 (B-690).

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-11-04 (methodology 1.0.0-rc.1), the reviewed events scored as if published.

| Country | Before (generated only) | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| GHA | +1.5 (+1) | +1.5 (+1) | Acting, unchanged | no event; twelve yes votes in B1 and the passivity penalty (-15) |
| GIN | +1.5 (+1) | +1.5 (+1) | Acting, unchanged | no event; twelve yes votes in B1 and the passivity penalty (-15) |
| GMB | -3.0 (-3) | +2.6 (+3) | Passive to Acting | B9 events of June 2025 (+1.38) and August 2025 (+4.27); the 2024 event is expired; passivity (-15) still applies. Without the August event about -1.6 (Passive) |

One band change (the Gambia), resting on the Ministry's release of the Foreign Minister's statement (flagged tier and source). Read critically (docs/06 §4 step 7): Ghana's and Guinea's bands rest on B1 and the passivity penalty, not on any act found in the window; Ghana's lead could change that if the President's words are found.

### 90-minute stop note

The session finished within the limit. Left for P-23 and Task V: the web searches per indicator group (English and French), the text of the Gambian Foreign Minister's statements (Istanbul, June 2025; Jeddah, 25 August 2025) and the OIC's record of the President's Summit address, the Gambia's 81st statement, the Ghanaian President's words at the Non-Aligned summit and his 81st statement, Guinea's 80th file, the Government documents for the three recognition dates, the Article 19 check, and Comtrade for the three.

## T-P21-37 — Guinea-Bissau, Equatorial Guinea, Kenya (2026-11-04)

Light protocol, group 37, seventh sub-Saharan group in the Claude track (Task B, B-694), run by a Sonnet 5.5 session of the finish run (docs/10 B-802 to B-806). Comtrade step skipped (COMTRADE-20261104 present; none of the three has rows). Web searches were not available (the run's search budget was spent): the session read the Governments' own sites (Kenya's Presidency through its REST API and the Ministry's lists; Guinea-Bissau's Presidency sitemap, Ministry and state news agency; Equatorial Guinea's press office), the UN's General Debate pages and files of the 79th to 81st sessions (live; the files recorded from existing Wayback captures, whose SHA-256 equal the live files'), the ICJ's case 192 page and the Treaty Collection's page on the Rome Statute (live) and the generated tables.

One event (Kenya) and three leads (Kenya).

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2025_09_24_KEN_B9 | B9 | 2025-09-24 | +2 (call for a permanent ceasefire; flagged for the 'disproportionate military operations' wording) | confirmed | official (the UN's General Debate text; the Presidency's report as second source) |
| lead_20261104_KEN_1 | lead, B9 | 2025-01-29 | the President at the visit of Egypt's President: 'committed to UN Security Council Resolution 2728 ... which calls for an immediate ceasefire', Gaza not named in the quotation | press (Presidency's report) |
| lead_20261104_KEN_2 | lead, B9 | 2025-04-26 | joint statement with China: 'the two sides ... oppose the forced transfer of people in Gaza' | press (Ministry's copy of the joint statement) |
| lead_20261104_KEN_3 | lead, C2 | 2024-03-07 | Cabinet approval of an MOU between the ICT ministry and Israel's National Cyber Directorate, no signing found | press (Presidency's report) |

Fourteen documents were archived (Kenya: the 79th and 80th General Debate files recorded from Wayback captures 20241211073009 and 20251026192526, the Presidency's reports of 24 September 2025, 29 January 2025 and the Cabinet of 7 March 2024, the Ministry's copy of the joint statement with China and its item of 7 February 2026; Guinea-Bissau: the 79th and 80th files recorded from captures 20241111140847 and 20260103192646, and three reports of the state news agency ANG; Equatorial Guinea: two reports of the Government's press office). Every replay fetched again with `curl --compressed` equals its index row in bytes and SHA-256.

### Kenya

Assessments (34 indicators): has-events 3 (B1, B9, D1), none-found 17, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Events: one (B9, the President, 24 September 2025). Leads: three. The President's 80th General Debate statement calls for the release of Israeli hostages and 'a permanent ceasefire' after expressing concern at 'the humanitarian catastrophe in Gaza' and at civilians 'caught in the devastation of disproportionate military operations' (the wording the Marshall Islands' event read at +5; here kept at the call tier, flagged). The 79th statement (26 September 2024) names Gaza in a list of conflicts; the 81st (23 September 2026) names neither Gaza nor Palestine. The Prime Cabinet Secretary and Cabinet Secretary for Foreign and Diaspora Affairs has no statement on Gaza in the Ministry's lists. Kenya is not on the Court's list of interveners in case 192; it is a state party to the Rome Statute and no statement on the warrants was found. B1: eleven yes votes and one abstention (ES-10/24). SIPRI: a 2024 order of 45 TIV from Israel is outside the build's data year (the A4 data-year gap). `mfa.go.ke` carries hidden gambling keywords in its HTML.

### Guinea-Bissau

Assessments: has-events 1 (B1), none-found 19, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Events: none. Leads: none. President Embaló's 79th (25 September 2024) and 80th (25 September 2025) General Debate statements name Gaza only in passing (a visit to Israel and Palestine; a list of conflicts); the 81st was by the Prime Minister and has no file. The state news agency reports the President's appeal for a ceasefire (10 October 2023, indirect speech), his visit to Israel (3 March 2024, the first by a Bissau-Guinean head of state) and to Ramallah (4 March 2024, the Grand Collar of the State of Palestine); no quotation of his words, no Gaza in his words, no agreement. The Presidency's and the Ministry's sites do not cover the window. Signatory, not a party, to the Rome Statute; not on the Court's list of interveners. B1: seven yes votes and five non-votes.

### Equatorial Guinea

Assessments: has-events 1 (B1), none-found 19, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Events: none. Leads: none. The General Debate statements of the 79th to 81st sessions were delivered by the Vice President and do not name Gaza, Palestine or Israel. The Government reports a donation of EUR 500,000 to the Red Crescent of Egypt for Gaza (28 December 2023; handed over in Cairo on 14 June 2024): not an FTS flow, so D1 (generated) does not count it. Neither a party to the Rome Statute nor a signatory; not on the Court's list of interveners. B1: four yes votes, one abstention and seven non-votes.

### Article 19 note (report only)

The three have the twelve qualifying votes recorded: Guinea-Bissau five non-votes, Equatorial Guinea seven non-votes and an abstention, Kenya an abstention. None is named in A/80/362 (3 September 2025) or on the Assembly's page of October 2026 (A/81/360); the letters between those dates and the arrears lists of 2023 and 2024 were not checked. The build scores a non-vote at -2 (B-690).

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-11-04 (methodology 1.0.0-rc.1), the reviewed events scored as if published.

| Country | Before (generated only) | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| GNB | -15.8 (-16) | -15.8 (-16) | Passive, unchanged | no event; B1 (-0.8, five non-votes) and the passivity penalty (-15) |
| GNQ | -22.7 (-23) | -22.7 (-23) | Enabling, unchanged | no event; B1 (-7.7, seven non-votes and an abstention) and the passivity penalty (-15) |
| KEN | +1.5 (+1) | +3.3 (+3) | Acting, unchanged | the B9 event of 24 September 2025 (+1.83); B1 (+16.5); passivity (-15) still applies. At +5 about +6.1 (+6), Acting |

No band change. Read critically (docs/06 §4 step 7): Equatorial Guinea's Enabling band and Guinea-Bissau's Passive band rest on non-votes that no source read explains, and on the passivity penalty; Kenya's score rests on its votes in B1.

### 90-minute stop note

The session finished within the limit. Left for P-23 and Task V: the web searches per indicator group (English, French, Portuguese, Spanish), the Kenyan Ministry's items from October 2023 to August 2024 (not listed on its site), the signing of the Kenya-Israel cyber MOU, the Government documents for the three recognition dates, Guinea-Bissau's 81st statement and Government sites for 2024 to 2026, Equatorial Guinea's non-votes, the Article 19 check, the A4 data-year gap for Kenya, and Comtrade for the three.

## T-P21-38 — Liberia, Lesotho, Madagascar (2026-11-04)

Light protocol, group 38, eighth sub-Saharan group in the Claude track (Task B, B-694), run by a Sonnet 5.5 session of the finish run (docs/10 B-807 to B-811). Comtrade step skipped (COMTRADE-20261104 present; none of the three has rows). Web searches were not available (the run's search budget was spent): the session read the Governments' own sites (Liberia's Executive Mansion and Ministry by their lists; Lesotho's portal through its REST API and the Ministry's site; Madagascar's Ministry through its site search), the UN's General Debate pages and files of the 79th to 81st sessions (live; the files recorded from existing Wayback captures, whose byte counts equal the live files'), the ICJ's case 192 page and the Treaty Collection's page on the Rome Statute (live) and the generated tables.

Three events (Lesotho) and two leads (Lesotho, Liberia).

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2025_09_26_LSO_B9 | B9 | 2025-09-26 | +2 (the Prime Minister: call for a permanent ceasefire and the release of all remaining hostages) | confirmed | official (the Government's page printing the full statement; the UN's file has no Wayback capture) |
| evt_2024_09_26_LSO_B9 | B9 | 2024-09-26 | +2 (the King: 'we renew our call for a ceasefire'; flagged for 'human rights violations in Gaza'; expired) | confirmed | official (the UN's General Debate text) |
| evt_2023_11_14_LSO_B9 | B9 | 2023-11-14 | +5 (the Minister of Foreign Affairs, in Sesotho: immediate ceasefire; 'disproportionate force', 'collective punishment'; flagged for the Sesotho reading and the date; expired) | confirmed | official (the Government's portal, PDF) |
| lead_20261104_LSO_1 | lead, B9 | 2026-09-25 | the Prime Minister's 81st statement welcomes 'the ceasefire framework' (file) while the Government's summary says 'Ceasefire in Gaza NOW' | press (the Government's information service) |
| lead_20261104_LBR_1 | lead, B9 | 2024-04-15 | the President 'urged both Israel and Hamas to adhere to ... Resolution 2728' (indirect speech, Gaza not named; expired) | press (the Executive Mansion's report) |

Six documents were archived (Lesotho: the 79th General Debate file recorded from the Wayback capture 20241111145827, the Government's page of the 80th statement from the capture 20260210005203, the Sesotho statement of November 2023 by a new Save Page Now capture; Liberia: the 79th and 80th files from captures 20250718102306 and 20251008124633 and the Executive Mansion's report of 15 April 2024 from the capture 20260106040900). Every replay fetched again with `curl --compressed` equals its index row in bytes and SHA-256.

### Liberia

Assessments (34 indicators): has-events 1 (B1), none-found 20, no-data 2 (A2, C3), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Events: none. Leads: one. President Boakai's 79th statement (25 September 2024) calls for 'an immediate ceasefire in the Middle East' without naming Gaza; the 80th supports mediation of the Israeli-Palestinian conflict and the two-state solution; the 81st (an image PDF, read by OCR) says nothing on the war. Liberia sits on the Security Council from January 2026 (B2 generated, no veto); its statements in the Council were not read. State party to the Rome Statute; not on the Court's list of interveners. B1: five yes votes, one no (12 December 2023), one abstention and five non-votes. SIPRI: a 2024 order of 0.24 TIV from Israel is outside the build's data year.

### Lesotho

Assessments: has-events 2 (B1, B9), none-found 18, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Events: three (B9). Leads: one. The King (79th), the Prime Minister (80th) and the Minister of Foreign Affairs (statement to the National Assembly, November 2023) call for a ceasefire; the Prime Minister's 81st statement welcomes the ceasefire framework in Gaza and calls for a lasting solution on the 1967 borders. State party to the Rome Statute; not on the Court's list of interveners. B1: eleven yes votes and one non-vote (12 December 2025).

### Madagascar

Assessments: has-events 1 (B1), none-found 19, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Events: none. Leads: none. The three General Debate statements (Prime Minister Ntsay 2024, President Rajoelina 2025, President of the Refoundation Randrianirina 2026) do not name Gaza, Palestine or Israel; the Ministry's site search returns no statement on the war. The Presidency's and the Prime Minister's sites could not be read. State party to the Rome Statute; not on the Court's list of interveners. B1: six yes votes and six non-votes.

### Article 19 note (report only)

The three have the twelve qualifying votes recorded: Liberia five non-votes, a no and an abstention, Lesotho one non-vote, Madagascar six non-votes. None is named in A/80/362 (3 September 2025) or on the Assembly's page of October 2026 (A/81/360); the letters between those dates and the arrears lists of 2023 and 2024 were not checked. The build scores a non-vote at -2 (B-690).

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-11-04 (methodology 1.0.0-rc.1), the reviewed events scored as if published.

| Country | Before (generated only) | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| LBR | -12.5 (-13) | -12.5 (-13) | Passive, unchanged | no event; B1 (+2.5) and the passivity penalty (-15) |
| LSO | -3.5 (-4) | -1.7 (-2) | Passive, unchanged | the B9 event of 26 September 2025 (+1.84; the two older events are expired); B1 (+11.5); passivity (-15) still applies because the event is older than 365 days |
| MDG | -18.2 (-18) | -18.2 (-18) | Passive, unchanged | no event; B1 (-3.2) and the passivity penalty (-15) |

No band change. Read critically (docs/06 §4 step 7): Madagascar's and Liberia's scores rest on their votes in B1 and the passivity penalty, and on non-votes that no source read explains; Lesotho's rests on B1 and a single counted B9 event.

### 90-minute stop note

The session finished within the limit. Left for P-23 and Task V: the web searches per indicator group (English, French, Sesotho), Liberia's statements in the Security Council since January 2026, Madagascar's Presidency and Prime Minister's items, a native reading of Lesotho's Sesotho statement, Lesotho's embassy list and treaty page, the Government documents for the three recognition dates, the non-votes of Liberia and Madagascar, the Article 19 check, the A4 data-year gap for Liberia, and Comtrade for the three.

## T-P21-39 — Mali, Mozambique, Mauritania (2026-11-04)

Light protocol, group 39, ninth sub-Saharan group in the Claude track (Task B, B-694), run by a Sonnet 5.5 session of the finish run (docs/10 B-812 to B-815). Comtrade step skipped (COMTRADE-20261104 present; none of the three has rows). Web searches were not available (the run's search budget was spent): the session read the Governments' own sites and state agencies (Mali's Presidency and AMAP through their REST search; Mozambique's Ministry and Government portal; Mauritania's Ministry by its site search, the state agency AMI by its REST search), the UN's General Debate pages and files of the 79th to 81st sessions (live; the files recorded from existing Wayback captures, whose byte counts equal the live files'), the ICJ's case 192 page and the Treaty Collection's page on the Rome Statute (live) and the generated tables.

Two events (Mali, Mauritania) and three leads (Mauritania).

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2025_09_27_MRT_B9 | B9 | 2025-09-27 | +5 (the Minister of Foreign Affairs: 'the war of genocide to which our people of Gaza are subjected', condemnation of the aggression; no call for a ceasefire; flagged for the tier and the extraction faults) | confirmed | official (the UN's General Debate text, Arabic) |
| evt_2026_06_24_MLI_B6 | B6 | 2026-06-24 | -10, scope `related` (unscored): withdrawal from the Rome Statute, effective 24 June 2027 | confirmed | official (depositary notification C.N.264.2026) |
| lead_20261104_MRT_1 | lead, B9 | 2024-11-11 | the President at the Arab-Islamic summit in Riyadh: condemnation of 'what Israel is doing in Palestine by way of genocide and destruction' and an immediate ceasefire (full text printed by the state agency) | press (AMI) |
| lead_20261104_MRT_2 | lead, B9 | 2025-03-04 | the President at the Arab summit in Cairo: killing, destruction and genocide in the Gaza Strip, support for the ceasefire agreement (full text printed by the state agency) | press (AMI) |
| lead_20261104_MRT_3 | lead, B9 | 2025-06-21 | the Minister at the OIC Council of Foreign Ministers, Istanbul (the Ministry's indirect-speech report) | press (the Ministry's report) |

Eleven documents were archived: Mali (the 79th, 80th and 81st General Debate files, recorded from the Wayback captures 20240930072203, 20260118012314 and 20261003061316; notification C.N.264.2026 from the capture 20261006064626), Mozambique (the 80th file from the capture 20251008140704), Mauritania (the 79th, 80th and 81st files from the captures 20250810031326, 20260119233006 and 20261004070749; two AMI pages and the Ministry's report of 21 June 2025 by new Save Page Now captures). Every replay fetched again with `curl --compressed` equals its index row in bytes and SHA-256.

### Mali

Assessments (34 indicators): has-events 2 (B1, B6), none-found 18, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Events: one (B6, scope `related`). Leads: none. The 79th General Debate statement was delivered by a Deputy Prime Minister (not a B9 speaker) and does not name Gaza; the Prime Minister's 80th statement does not mention Palestine; the Foreign Minister's 81st reaffirms 'soutien total au peuple palestinien' with no call. State party to the Rome Statute until 24 June 2027; not on the Court's list of interveners. B1: twelve yes votes. The Prime Minister's and the Ministry's sites did not answer.

### Mozambique

Assessments: has-events 1 (B1), none-found 20, no-data 2 (A2, C3), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Events: none. Leads: none. The President's 80th and 81st statements support the two-State solution without naming Gaza; the 79th was delivered by the Deputy Minister. Security Council member in 2023 and 2024 (B2 `none-found`, no veto). Signed the Rome Statute (28 December 2000), not a party; not on the Court's list of interveners. B1: eleven yes votes and a non-vote on A/RES/79/232 (19 December 2024).

### Mauritania

Assessments: has-events 2 (B1, B9), none-found 18, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Events: one (B9). Leads: three. The Minister's 80th statement calls what Gaza is subjected to a war of genocide; the President's 79th statement ('war of genocide against the unarmed Palestinian people', Gaza not named) and the Minister's 81st (atrocities and systematic destruction in 'the Palestinian territories', Resolution 2803 on Gaza) are not filed (R7); the President's speeches at the Riyadh and Cairo summits are leads because only the state agency prints them. Not a party to the Rome Statute; not on the Court's list of interveners. B1: twelve yes votes.

### Article 19 note (report only)

The three have the twelve qualifying votes recorded except Mozambique's non-vote on A/RES/79/232 (19 December 2024), scored -2 by the build (B-690). None is named in A/80/362 (3 September 2025) or on the Assembly's page of October 2026 (A/81/360); the letters between those dates and the arrears lists of 2023 and 2024 were not checked.

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-11-04 (methodology 1.0.0-rc.1), the reviewed events scored as if published.

| Country | Before (generated only) | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| MLI | +1.5 (+1) | +1.5 (+1) | Acting, unchanged | the B6 event has scope `related` and is unscored; B1 (+16.5) and the passivity penalty (-15). If the author reads B6 as scoring the withdrawal (scope `gaza`), it ends the passivity penalty and the score is +6.5 (+6), Acting either way |
| MOZ | -0.2 (0) | -0.2 (0) | Passive, unchanged | no event; B1 (+14.8) and the passivity penalty (-15) |
| MRT | +1.5 (+1) | +6.1 (+6) | Acting, unchanged | the B9 event of 27 September 2025 (+4.6 after decay); B1 (+16.5); the passivity penalty (-15) still applies because the event is older than 365 days |

No band change. Read critically (docs/06 §4 step 7): the three scores rest mainly on B1 (the Assembly votes) and the passivity penalty; Mauritania's rise rests on one B9 event at the legal-characterisation tier, flagged, and its two stronger-looking speeches are leads because of their source kind.

### 90-minute stop note

The session finished within the limit. Left for P-23 and Task V: the web searches per indicator group (English, French, Portuguese, Arabic), the unreachable Mali sites, the Presidency of Mozambique and its Security Council statements, a Presidency or Arab League text for Mauritania's two summit speeches, the Government documents for the three recognition dates, the Article 19 check, and Comtrade for the three.

## T-P21-40 — Mauritius, Malawi, Namibia (2026-11-04)

Light protocol, group 40, tenth sub-Saharan group in the Claude track (Task B, B-694), run by a Sonnet 5.5 session of the finish run (docs/10 B-816 to B-819). Comtrade step skipped (COMTRADE-20261104 present; none of the three has rows). Web searches were not available (the run's search budget was spent): the session read Mauritius's Prime Minister's Office (the Cabinet's highlights), the Malawian Government portal, the UN's General Debate pages and files of the 79th to 81st sessions (live; the files recorded from existing Wayback captures, whose byte counts and SHA-256 equal the live files'), the ICJ's case 192 page (archived and live), Namibia's declaration of intervention (the UNISPAL copy), the Treaty Collection's page on the Rome Statute (live), Infobae's report of the Bogota conference and the generated tables. The Presidency, the Ministry and the Government portal of Namibia, and the Ministry, State House and news agency of Malawi, did not answer; the indicators a Government source would decide are `unchecked` with the reason.

Three events (Namibia) and one lead (Namibia).

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2024_09_25_NAM_B9 | B9 | 2024-09-25 | +5 (the President: 'Namibia believes that Israel, by intent and by action, is committing genocide', and 'continues to call for a ceasefire'; expired, 770 days) | confirmed | official (the UN's General Debate text) |
| evt_2025_09_24_NAM_B9 | B9 | 2025-09-24 | +5 (the President reports the Commission of Inquiry's finding of genocide and says access to aid in Gaza is 'severely limited'; flagged for the tier) | confirmed | official (the UN's General Debate text) |
| evt_2026_03_12_NAM_B3 | B3 | 2026-03-12 | +15 (declaration of intervention under Article 63 in case 192, read by direction: the applicant's construction) | confirmed | court (ICJ document, UNISPAL copy) and the Court's page |
| lead_20261104_NAM_1 | lead, B9 | 2025-07-16 | Namibia is one of twelve signatories of the Hague Group's Bogota declaration; no Namibian signatory named | press (Infobae) |

Eight documents were archived: six General Debate files (Namibia's 79th, 80th and 81st from the Wayback captures 20241111150001, 20260118023820 and 20260924160044; Mauritius's 79th and 80th from 20250211092627 and 20260120002501; Malawi's 79th from 20241109111144), Namibia's declaration (Save Page Now capture of the UNISPAL copy, 714,578 bytes) and the Cabinet highlights of Mauritius of 22 August 2025 (393,715 bytes). Every replay was fetched again with curl --compressed and equals the index row.

### Mauritius

Assessments (34 indicators): has-events 2 (B1, D1), none-found 17, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 12 (A3, A5 to A8, B5, C4 to C6, E1 to E3). Events: none. Leads: none. The President's 79th statement names Gaza ('heart wrenching') with no call and no violation; the Minister's 80th and 81st support the Palestinian cause and the two-State solution without naming Gaza; the Cabinet endorsed the New York Declaration on 22 August 2025 (a Cabinet decision, not a B9 speaker). The Ministry's lists load by script and were not read.

### Malawi

Assessments: has-events 1 (B1), none-found 11, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 19 (A3, A5 to A8, B5, B7, B10 to B12, C2, C4 to C6, D4, D5, E1 to E3). Events: none. Leads: none. The 79th statement names Palestine only in a list of conflicts; the 80th (Permanent Representative) and the 81st (Foreign Minister) name none of Gaza, Palestine or Israel. Five of twelve qualifying votes have no recorded vote (not Article 19 on the documents read).

### Namibia

Assessments: has-events 3 (B1, B3, B9), none-found 9, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 19 (A3, A5 to A8, B5, B7, B10 to B12, C2, C4 to C6, D4, D5, E1 to E3). Events: three. Leads: one. Filed for the 79th and 80th statements of the President (head of state and head of government); the 81st ('an end to the atrocities being committed in Gaza') is not filed (neither tier). Namibia's declaration of intervention supports the applicant's construction.

### Article 19 note (report only)

Mauritius and Namibia have the twelve qualifying votes recorded; Malawi has no vote recorded on five (A/RES/79/232, A/DEC/80/506, A/RES/80/1, A/RES/80/78, A/RES/80/116). None of the three is named in A/80/362 (3 September 2025) or on the Assembly's page of October 2026 (A/81/360); the letters between those dates and the arrears lists of 2023 and 2024 were not checked.

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-11-04 (methodology 1.0.0-rc.1), the reviewed events scored as if published.

| Country | Before (generated only) | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| MUS | +1.5 (+1) | +1.5 (+1) | Acting, unchanged | no event; B1 (+16.5) and the passivity penalty (-15) |
| MWI | -24.4 (-24) | -24.4 (-24) | Enabling, unchanged | no event; B1 (-9.4) and the passivity penalty (-15) |
| NAM | +1.5 (+1) | +36.1 (+36) | Acting, unchanged | B3 +15 (qualifying: ends the passivity penalty, +15), the B9 event of 24 September 2025 (+4.6 after decay); B1 (+16.5). Without the flagged B9 event: +31.5 (+32), Acting |

No band change. Read critically (docs/06 §4 step 7): Namibia's rise rests on the B3 declaration (which also lifts the passivity penalty) and on one flagged B9 reading; Mauritius's and Malawi's scores rest on B1 and the passivity penalty alone, and Malawi's B1 depends on five non-votes.

### 90-minute stop note

The session finished within the limit. Left for P-23 and Task V: the web searches per indicator group (English), the Government sources of Namibia and Malawi when their sites answer, the Presidency of Namibia's statements and the Hague Group's founding declaration, Mauritius's Ministry lists, the Government documents for the three recognition dates, the Article 19 check, and Comtrade for the three.

## T-P21-41 — Niger, Rwanda, Senegal (2026-11-04)

Light protocol, group 41, eleventh sub-Saharan group in the Claude track (Task B, B-694), run by a Sonnet 5.5 session of the finish run (docs/10 B-820 to B-824). Comtrade step skipped (COMTRADE-20261104 present; none of the three has rows). Web searches were not available (the run's search budget was spent): the session read the UN's General Debate pages and files of the 79th to 81st sessions (live; three files and the Niger page recorded from existing Wayback captures, whose byte counts and SHA-256 equal the live files'), Senegal's Government site (`primature.sn`, site search and every result), Rwanda's Ministry news list (24 pages by title) and the President's site, Niger's Presidency list and the state daily Le Sahel (press), the ICJ's case 192 page (live and archived), the Treaty Collection's page on the Rome Statute and the notification C.N.251.2026 (live) and the generated tables. Niger's Ministry, Government portal and Prime Minister's site did not answer; Senegal's Presidency loads its texts by script; the indicators a Government source would decide are `unchecked` for Niger with the reason.

Five events (Niger 2, Rwanda 1, Senegal 2), no lead.

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2025_09_27_NER_B9 | B9 | 2025-09-27 | +5 (the Prime Minister: 'le peuple nigérien condamne sans réserve le génocide israélien à Gaza'; flagged) | confirmed | official (the UN's General Debate text) |
| evt_2026_06_18_NER_B6 | B6 | 2026-06-18 | -10, scope `related`, unscored (withdrawal from the Rome Statute, C.N.251.2026; the quoted reason names neither Gaza nor the warrants; flagged) | confirmed | official (UN depositary notification) |
| evt_2024_06_11_RWA_B9 | B9 | 2024-06-11 | +2 (the President at the Gaza humanitarian conference: efforts 'to achieve a ceasefire in Gaza'; flagged; expired, 876 days) | confirmed | official (the President's site) |
| evt_2024_09_25_SEN_B9 | B9 | 2024-09-25 | +2 (the President: 'appelle à un cessez-le-feu immédiat et durable'; R7 flagged; expired, 770 days) | confirmed | official (the UN's General Debate text) |
| evt_2025_09_24_SEN_B9 | B9 | 2025-09-24 | +5 (the President: 'Gaza ne vit plus', people 'privés de nourriture, d'eau et de soins de santé', condemnation; flagged) | confirmed | official (the UN's General Debate text) |

Six documents were archived: the Niger 80th General Debate file (Wayback capture 20251111053852) and the Niger page of the General Debate site (20251008034732), Senegal's 79th and 80th files (20241211072108 and 20260120002803), the depositary notification C.N.251.2026 (20260710191619) and the Rwandan President's remarks of 11 June 2024 (Save Page Now, 44,760 bytes). Every replay was fetched again with curl --compressed and equals the index row. One attempted capture (Senegal's 81st file, HTTP 405) failed and its index row was removed by exact id.

### Niger

Assessments (34 indicators): has-events 3 (B1, B6, B9), none-found 10, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 18 (A3, A5 to A8, B5, B7, B11, B12, C2, C4 to C6, D4, D5, E1 to E3). Events: two. Leads: none. The 80th statement (Prime Minister) uses 'le génocide israélien à Gaza'; the 79th (Foreign Minister) names Palestine only; the 81st (Prime Minister) names Gaza with a call for civilian protection and humanitarian access (neither tier). The withdrawal from the Rome Statute is filed with scope `related`.

### Rwanda

Assessments: has-events 2 (B1, B9), none-found 18, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Events: one (expired). Leads: none. The 80th and 81st General Debate statements name none of Gaza, Palestine and Israel; the Ministry's news list has no item on them; Rwanda is not a State Party to the Rome Statute.

### Senegal

Assessments: has-events 2 (B1, B9), none-found 18, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Events: two. Leads: none. The 81st statement (24 September 2026: 'the systematic violation of international law is intolerable', 'put an end to the horror of massacres and destruction') reads as a +5 event but cannot be archived (docs/10 B-823), so it is not filed.

### Article 19 note (report only)

Niger and Senegal have the twelve qualifying votes recorded; Rwanda has no vote recorded on A/RES/ES-10/21 and A/RES/80/116 (and abstentions on two). None of the three is named in A/80/362 (3 September 2025) or on the Assembly's page of October 2026 (A/81/360); the letters between those dates and the arrears lists of 2023 and 2024 were not checked.

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-11-04 (methodology 1.0.0-rc.1), the reviewed events scored as if published.

| Country | Before (generated only) | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| NER | +1.5 (+1) | +6.1 (+6) | Acting, unchanged | the B9 event of 27 September 2025 (+4.6 after decay); B1 (+16.5) and the passivity penalty (-15) stay. If the author scores the B6 withdrawal (scope `gaza`): +11.1 (+11), Acting |
| RWA | -5.2 (-5) | -5.2 (-5) | Passive, unchanged | the only event is expired; B1 (+9.8) and the passivity penalty (-15) |
| SEN | +1.5 (+1) | +6.1 (+6) | Acting, unchanged | the B9 event of 24 September 2025 (+4.6); B1 (+16.5) and the passivity penalty (-15) stay. The unarchived 81st statement would add about +5 (B9 cap +10) |

No band change. Read critically (docs/06 §4 step 7): Niger's and Senegal's rises rest on one flagged B9 reading each; Rwanda's score rests on B1 (with two non-votes) and the passivity penalty alone.

### 90-minute stop note

The session finished within the limit. Left for P-23 and Task V: the web searches per indicator group (English and French), Niger's Ministry statements when its sites answer, the Presidency of Senegal's texts and an archived copy of the 81st statement, the Hague Group's founding declaration, Rwanda's Ministry press statements outside the news list, the Government documents for the three recognition dates, the Article 19 check, and Comtrade for the three.

## T-P21-42 — Sierra Leone, Somalia, South Sudan (2026-11-04)

Light protocol, group 42, twelfth sub-Saharan group in the Claude track (Task B, B-694), run by a Sonnet 5.5 session of the finish run (docs/10 B-825 to B-829). Comtrade step skipped (COMTRADE-20261104 present; none of the three has rows). Web searches were not available (the run's search budget was spent): the session read the UN's General Debate pages and files of the 79th to 81st sessions (live), the Security Council's verbatim records S/PV.9440 to S/PV.10255 (805 records downloaded from the UN Official Document System, one at a time, read by title and by the speakers called on as a minister of the three countries), State House of Sierra Leone's site (WordPress REST search), Somalia's Ministry and Presidency sites, two Juba news sites for South Sudan (Radio Tamazuj, Eye Radio; kind press), the ICJ's case 192 page (live and archived), the archived ASP list and UNRWA donor tables and the Article 19 documents. Sierra Leone's Ministry site and every official site of South Sudan did not answer.

Eleven events (Sierra Leone 6, Somalia 4, South Sudan 1) and two leads (South Sudan).

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2024_04_18_SLE_B9 | B9 | 2024-04-18 | +5 (Foreign Minister, S/PV.9608: 'without distinction, proportionality or the protection of civilians'; expired, 930 days) | confirmed | official (Council record) |
| evt_2024_09_24_SLE_B9 | B9 | 2024-09-24 | +2 (the President, 79th General Debate: 'The need for a ceasefire in Gaza … is not just pressing but urgent'; flagged; expired, 771 days) | confirmed | official (the UN's General Debate text) |
| evt_2025_01_20_SLE_B9 | B9 | 2025-01-20 | +5 (Foreign Minister, S/PV.9841: 'repeated violations of international law', 'collective punishment') | confirmed | official (Council record) |
| evt_2025_04_29_SLE_B9 | B9 | 2025-04-29 | +5 (Foreign Minister, S/PV.9907: incendiary weapons, 'The total blockade of humanitarian aid') | confirmed | official (Council record) |
| evt_2025_09_23_SLE_B9 | B9 | 2025-09-23 | +5 (Foreign Minister, S/PV.10003: 'a blatant violation of the Charter', permanent ceasefire, lifting of aid restrictions) | confirmed | official (Council record) |
| evt_2025_09_24_SLE_B9 | B9 | 2025-09-24 | +5 (the President, 80th General Debate: 'A preventable genocide was not prevented'; 'Ceasefire now in Gaza!'; flagged) | confirmed | official (the UN's General Debate text) |
| evt_2024_09_27_SOM_B9 | B9 | 2024-09-27 | +5 (the Prime Minister, 79th General Debate: 'the continuous violations of international law by the Israeli government'; expired, 768 days) | confirmed | official (the UN's General Debate text) |
| evt_2025_01_20_SOM_B9 | B9 | 2025-01-20 | +2 (Foreign Minister, S/PV.9841: 'lifting the blockade on the Gaza Strip' as a root cause; flagged) | confirmed | official (Council record) |
| evt_2025_09_23_SOM_B9 | B9 | 2025-09-23 | +5 (Foreign Minister, S/PV.10003: 'the use of hunger as a collective punishment is a grave violation of international law') | confirmed | official (Council record) |
| evt_2025_09_25_SOM_B9 | B9 | 2025-09-25 | +2 (the President, 80th General Debate: 'an immediate and lasting ceasefire'; flagged; dated by the General Debate page) | confirmed | official (the UN's General Debate text and page) |
| evt_2025_08_13_SSD_C2 | C2 | 2025-08-13 | -10 (memorandum of understanding on bilateral cooperation with Israel, signed in Juba; counts -7.0 at the weight of corroborated; flagged) | corroborated | press (Radio Tamazuj, Eye Radio) |

Ten documents were archived: the four General Debate files (Wayback captures 20241012042050, 20260201054228, 20250717095315, 20251008042446, each with the live file's byte count and SHA-256) and Somalia's 80th page (20251207222446) by `--capture`; the Council's records S/PV.9608 (an existing capture of 20260806051756) and S/PV.9907, and the three press articles, by Save Page Now. Every replay was fetched again with curl --compressed and equals its index row (byte count and SHA-256).

### Sierra Leone

Assessments (34 indicators): has-events 2 (B1, B9), none-found 13, no-data 2 (A2, C3), unchecked 17 (A3, A5 to A8, B7, B11, B12, C2, C4 to C6, D4, D5, E1 to E3). Events: six. Leads: none. A Council member in 2024 and 2025; State Party to the Rome Statute. The Ministry's site did not answer, so the indicators that only its releases would settle are `unchecked`. Not filed: the President's address of 17 November 2025 (S/PV.10045: Gaza in a list of places where 'hunger has been weaponized'), the Permanent Representative's explanation of vote on resolution 2803 (S/PV.10046), the 81st General Debate statement (no Gaza); D3 not filed on a USD 10,000 pledge with nothing received (B-826).

### Somalia

Assessments: has-events 2 (B1, B9), none-found 19, no-data 2 (A2, C3), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Events: four. Leads: none. A Council member in 2025 and 2026; not a State Party to the Rome Statute. The Ministry's reports of the Foreign Minister's remarks at the OIC emergency meeting (25 August 2025) and the Arab-Islamic meetings in Doha are indirect speech and are not filed.

### South Sudan

Assessments: has-events 2 (B1, C2), none-found 15, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 14 (A3, A5 to A8, B7, B11, C4 to C6, D4, E1 to E3). Events: one. Leads: two. No B9: the 79th and 81st General Debate statements name neither Gaza nor Palestine, the 80th was the Vice-President's. The C2 event rests on two press publishers and no primary document (B-828).

### Article 19 note (report only)

Sierra Leone has the twelve qualifying votes recorded; Somalia has two non-votes (A/RES/ES-10/24, A/RES/80/1); South Sudan has two non-votes (A/RES/ES-10/23, A/RES/80/1) and ten abstentions. None of the three is named in A/80/362 (3 September 2025) or on the Assembly's page of October 2026 (A/81/360); the letters between those dates and the arrears lists of 2023 and 2024 were not checked.

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-11-04 (methodology 1.0.0-rc.1), the reviewed events scored as if published.

| Country | Before (generated only) | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| SLE | +1.5 (+1) | +11.5 (+11) | Acting, unchanged | B9 reaches its cap of +10 on four counted events (the Foreign Minister's of 20 January, 29 April and 23 September 2025 and the President's of 24 September 2025); B1 (+16.5) and the passivity penalty (-15) stay |
| SOM | -3.0 (-3) | +4.2 (+4) | **Passive -> Acting** | B9 +7.2: the Foreign Minister's event of 23 September 2025 (+4.6 after decay) alone gives about +1.6 (Acting); the two flagged +2 events add +2.7 |
| SSD | -26.0 (-26) | -33.0 (-33) | Enabling, unchanged | C2 -7.0 (the memorandum, confidence corroborated at weight 0.7); B1 (-11.0) and the passivity penalty (-15) stay. Without the press-only C2 event: -26 |

One band change (Somalia, Passive to Acting). Read critically (docs/06 §4 step 7): Somalia's change rests on a solid +5 reading from the Council's record; Sierra Leone's rise rests on four B9 events of which one is the President's flagged reading; South Sudan's fall rests on a press-only instrument.

### 90-minute stop note

The session finished within the limit. Left for P-23 and Task V: the web searches per indicator group (English, French, Arabic, Somali), the Government sources of Sierra Leone (Ministry) and South Sudan (all) when their sites answer, Somalia's Prime Minister's site, the OIC and Arab League communiqués, a primary for South Sudan's memorandum, the Hague Group declaration, the Government documents for the recognition dates, the 2025 UNRWA table, the Article 19 check, and Comtrade for the three.

## T-P21-43 — Sao Tome and Principe, Eswatini, Seychelles (2026-11-04)

Light protocol, group 43, thirteenth sub-Saharan group in the Claude track (Task B, B-694), run by a Sonnet 5.5 session of the finish run (docs/10 B-830 to B-834). Comtrade step skipped (COMTRADE-20261104 present; none of the three has rows). Web searches were not available (the run's search budget was spent): the session read the UN's General Debate pages and files of the 79th to 81st sessions (live), State House Seychelles (site search; the 122 speeches and messages from id 5950), Seychelles Nation, STP-Press, the Times of Eswatini and Eswatini Post (WordPress REST searches), the ICJ's case 192 page (live and archived), the archived ASP list, UNRWA donor tables and Article 19 documents. No Foreign Ministry site of the three answered.

One event (Seychelles) and two leads (Seychelles); none for Sao Tome and Principe and Eswatini.

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2023_11_10_SYC_B9 | B9 | 2023-11-10 | +2 (the President, First Saudi-African Summit: 'an immediate cessation of hostilities'; flagged under R7; expired, 1,090 days) | confirmed | official (State House report) |

One document was archived: the State House item of 10 November 2023, by Save Page Now; its replay was fetched again with curl --compressed and equals the index row (39,484 bytes, SHA-256 812259fc...). The General Debate files read were not archived because no event rests on them.

### Sao Tome and Principe

Assessments (34 indicators): has-events 1 (B1), none-found 16, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 14 (A3, A5 to A8, B7, B11, C4 to C6, D4, E1 to E3). Events: none. Leads: none. No B9: the 79th statement (the President) voices concern at 'the recent worsening of the situation in the Gaza Strip and in Lebanon' with no call; the 80th (the Prime Minister) and 81st (the Foreign Minister) name the Israeli-Palestinian conflict and the Middle East, not Gaza (R7). The Government's communique of 29 October 2023 appeals for dialogue between 'both parties'. No Ministry site answers (B7, B11, D4 `unchecked`).

### Eswatini

Assessments: has-events 1 (B1), none-found 16, no-data 2, not-applicable 1, unchecked 14 (same list). Events: none. Leads: none. The King's 80th statement proposes ad hoc committees and refers to 'the bombardment' in the Middle East without naming Gaza and without a call (B-833). The Government portal did not answer.

### Seychelles

Assessments: has-events 2 (B1, B9), none-found 18, no-data 2, not-applicable 1, unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Events: one. Leads: two (the Foreign Minister's statements of 20 November 2023 and 11 January 2024, known only from the Nation in indirect speech). State Party to the Rome Statute; not on the case 192 list.

### Article 19 note (report only)

Sao Tome and Principe is named in A/80/362 (3 September 2025) and on the Assembly's page of October 2026 (A/81/360; resolution 81/2 of 12 October 2026 lets it vote until the end of the 81st session); it has a non-vote on all twelve qualifying votes. Eswatini has a non-vote on all twelve and is not named in either document. Seychelles has one non-vote (A/RES/ES-10/21) and is not named. The arrears lists of 2023 and 2024 were not checked.

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-11-04 (methodology 1.0.0-rc.1), the reviewed events scored as if published.

| Country | Before (generated only) | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| STP | -26.0 (-26) | -26.0 (-26) | Enabling, unchanged | B1 -11.0 (twelve non-votes) and the passivity penalty (-15). Without the B1 non-votes (if the author treats a state not entitled to vote as having no B1 event): -15, band Passive |
| SWZ | -26.0 (-26) | -26.0 (-26) | Enabling, unchanged | B1 -11.0 (twelve non-votes) and the passivity penalty (-15) |
| SYC | +1.5 (+1) | +1.5 (+1) | Acting, unchanged | The B9 event is expired (1,090 days) and adds nothing; B1 +16.5 and the passivity penalty (-15) stay |

No band change. Read critically (docs/06 §4 step 7): the two Enabling bands rest entirely on non-votes in the General Assembly; Sao Tome and Principe's may be a loss of vote under Article 19 (B-832).

### 90-minute stop note

The session finished within the limit. Left for P-23 and Task V: the web searches per indicator group (English, Portuguese, French), the Foreign Affairs department's release of 12 January 2024 and the National Assembly's record for Seychelles, a Ministry source for Sao Tome and Principe and Eswatini, the arrears lists of 2023 and 2024, the 2025 UNRWA table, and Comtrade for the three.

## T-P21-44 — Chad, Togo, United Republic of Tanzania (2026-11-04)

Light protocol, group 44, fourteenth sub-Saharan group in the Claude track (Task B, B-694), run by a Sonnet 5.5 session of the finish run (docs/10 B-835 to B-840). Comtrade step skipped (COMTRADE-20261104 present; none of the three has rows). Web searches were not available (the run's search budget was spent): the session read the Chadian Presidency (WordPress REST search; the daily summaries and the Head of State's speeches), Tchadinfos, Togo's Presidency (21 posts), the Tanzanian Presidency's speeches (PDFs, searched by script), the Ministry's blog, the Daily News, the UN's General Debate pages and files of the 79th to 81st sessions (Chad's three files are scans, read by OCR), the ICJ's case 192 page, the archived ASP list, UNRWA donor tables and the Article 19 documents. No Foreign Ministry site of the three answered usefully; Chad's Prime Minister's site did not answer.

Two events (both Chad) and two leads (one Chad, one Tanzania); none for Togo and Tanzania.

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2023_11_04_TCD_B12 | B12 | 2023-11-04 | +5 (the Ministry of Foreign Affairs recalls the Chargé d'Affaires in Israel for consultations; standing, open; flagged: a Chargé d'Affaires, not an ambassador) | confirmed | official (the Presidency's daily summary of 6 November 2023) |
| evt_2025_09_25_TCD_B9 | B9 | 2025-09-25 | +5 (the President's message to the 80th General Debate, read by the Prime Minister: 'bombardements indiscriminés', 'destruction systématique d’infrastructures vitales' at Gaza; flagged under R3 and the tier) | confirmed | official (the delegation's file on gadebate.un.org, a scan read by OCR) |

Two documents were archived, both from existing Wayback captures with `--capture` (Save Page Now answers 403 for `presidence.td` and 405 for `gadebate.un.org`); the replays were fetched again with curl --compressed and equal the index rows (35,632 bytes, SHA-256 73ac0445…; 874,087 bytes, SHA-256 93308851…). The Chadian file's text in `archive/text` is OCR, corrected against the page images at the quoted passages.

### Chad

Assessments (34 indicators): has-events 3 (B1, B9, B12), none-found 17, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 11 (A3, A5 to A8, C4 to C6, E1 to E3). Events: two. Leads: one (the Foreign Minister's words of 10 November 2023, Tchadinfos, expired). State Party to the Rome Statute; not on the case 192 list. Not filed: the President's speech of 11 November 2024 at the Arab-Islamic summit (a +2 call naming Gaza; no archived copy exists: B-837 (1)), the New Year message of 31 December 2023 (R7), the Presidency's report of the summit of 11 November 2023 (R4), the 79th and 81st General Debate statements.

### Togo

Assessments: has-events 1 (B1), none-found 14, no-data 2, not-applicable 1, unchecked 16 (A3, A5 to A8, B7, B11, C2, C4 to C6, D4, D5, E1 to E3). Events: none. Leads: none. The three General Debate statements do not mention Gaza, Palestine or Israel; the Presidency's posts record the Israeli Ambassador's credentials (10 October 2025) and the Palestinian Ambassador's (4 March 2026). No entry on the ASP list.

### United Republic of Tanzania

Assessments: has-events 1 (B1), none-found 16, no-data 2, not-applicable 1, unchecked 14 (A3, A5 to A8, B7, B11, C4 to C6, D4, E1 to E3). Events: none. Leads: one (the Daily News of 18 April 2024, R7, expired). The President's remarks of 7 February 2024 call for a cessation of hostilities and never name Gaza (R7); the 80th and 81st General Debate statements are the Vice President's. State Party to the Rome Statute; not on the case 192 list.

### Article 19 note (report only)

None of the three is named in A/80/362 or on the Assembly's page of October 2026. Chad has a vote on all twelve qualifying votes; Togo has three non-votes (A/RES/ES-10/21, ES-10/23, ES-10/24) and Tanzania two (A/RES/80/1, A/RES/80/116). The arrears lists of 2023 and 2024 were not checked.

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-11-04 (methodology 1.0.0-rc.1), the reviewed events scored as if published.

| Country | Before (generated only) | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| TCD | +1.5 (+1) | +11.1 (+11) | Acting, unchanged | B12 +5.0 (standing) and B9 +4.6 (+5 at 0.918 of its weight); B1 +16.5 and the passivity penalty (-15) stay. Without B9: +6.5; without both: +1.5 |
| TGO | -12.0 (-12) | -12.0 (-12) | Passive, unchanged | B1 +3.0 and the passivity penalty (-15) |
| TZA | -8.0 (-8) | -8.0 (-8) | Passive, unchanged | B1 +7.0 and the passivity penalty (-15) |

No band change. Read critically (docs/06 §4 step 7): Chad's rise rests on a recall of a Chargé d'Affaires (flagged) and on a +5 reading of 'indiscriminés' and 'systématique' that a stricter reader would not make; neither changes the band.

### 90-minute stop note

The session ran slightly over the limit because Save Page Now failed for `presidence.td` three times (about 20 minutes). Left for P-23 and Task V: the web searches per indicator group (English, French, Swahili), an archived copy of the Chad President's speech of 11 November 2024, a documented end of Chad's B12, the Chadian Prime Minister's and Ministry's sources, Togo's Ministry and Government sources, Tanzania's Prime Minister's and Ministry's own pages, the arrears lists of 2023 and 2024, the 2025 UNRWA table, and Comtrade for the three.

## T-P21-45 — Uganda, Zambia, Zimbabwe (2026-11-04)

Light protocol, group 45, fifteenth and last sub-Saharan group in the Claude track (Task B, B-694), run by a Sonnet 5.5 session of the finish run (docs/10 B-841 to B-847). Comtrade step skipped (COMTRADE-20261104 present; none of the three has rows). Web searches were not available (the run's search budget was spent): the session read the UN's General Debate pages and files of the 79th to 81st sessions (Zambia's 79th and Zimbabwe's 81st are scans, read by OCR), Uganda's Ministry of Foreign Affairs and Parliament (Drupal site search), Zambia's Ministry (WordPress site search), Chimp Reports, The Independent (Uganda), Zambia Monitor and Diggers (WordPress REST search, kind press), the ICJ's case 192 page (live and archived copy), the archived ASP list, UNRWA donor tables (2022 to 2024) and the Article 19 documents. Zimbabwe's Government sites did not answer (the Ministry answers HTTP 503) and Uganda's State House answered 526.

One event (Zimbabwe) and one lead (Uganda); none for Zambia.

| Event id | Ind. | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2024_12_31_ZWE_D3 | D3 | 2024-12-31 | +8 (UNRWA's 2024 donor table: USD 500,000 against no 2022 row; standing, open; no-2022-row precedent, B-445, B-679) | confirmed | ngo (UNRWA donor ranking, archived earlier) |

No new document was archived (the event cites the UNRWA table of 31 December 2024, already in `archive/index.csv`); `archive/index.csv` is unchanged.

### Uganda

Assessments (34 indicators): has-events 1 (B1), none-found 16, no-data 2 (A2, C3), not-applicable 1 (B2), unchecked 14 (A3, A5 to A8, B7, B11, C4 to C6, D4, E1 to E3). Events: none. Leads: one (A5: Parliament's approval of 6 August 2026 of a deployment of UPDF troops to the Gaza Strip within a proposed US-backed stabilisation force; no indicator defines it). State Party to the Rome Statute; not on the case 192 list. Not filed: the President's statement of 22 June 2025 on the Iran-Israel war and the Ministry's statement of 21 September 2026 (two-state solution, no Gaza: R7); the 80th General Debate statement (a Vice President: R3); the Permanent Representative's statement for the Non-Aligned Movement at the Security Council (April 2026, not a B9 speaker).

### Zambia

Assessments: has-events 1 (B1), none-found 16, no-data 2, not-applicable 1, unchecked 14 (A3, A5 to A8, B7, B11, C4 to C6, D4, E1 to E3). Events: none. Leads: none. The Foreign Minister's three General Debate statements do not mention Gaza or Palestine. Relations with Israel recorded as notes: the framework agreement of 2023 (before the window), Israel's resident embassy opened on 21 August 2025, the Israeli President's state visit of 10 and 11 November 2025; no agreement signed since October 2023 was found (the State House record was not reachable). State Party to the Rome Statute; not on the case 192 list.

### Zimbabwe

Assessments: has-events 2 (B1, D3), none-found 12, no-data 2, not-applicable 1 (B2: Council term from 1 January 2027), unchecked 17 (A3, A5 to A8, B7, B11, B12, C2, C4 to C6, D4, D5, E1 to E3). Events: one (D3). Leads: none. The 79th and 80th General Debate statements name Palestine and the two-state solution but not Gaza (R7); the 81st (a scan, read by OCR) names neither. Not a State Party to the Rome Statute; not on the case 192 list.

### Article 19 note (report only)

None of the three is named in A/80/362 or on the Assembly's page of October 2026. Uganda and Zimbabwe have a vote on all twelve qualifying votes. Zambia has an abstention (A/RES/ES-10/21), two 'yes' votes (ES-10/22, ES-10/23) and nine non-votes (ES-10/24 to A/RES/80/116); arrears do not explain them and the reason is not known (B-846). The arrears lists of 2023 and 2024 were not checked.

### Score effects (provisional)

`pnpm score --country X --preview` on 2026-11-04 (methodology 1.0.0-rc.1), the reviewed events scored as if published.

| Country | Before (generated only) | With the reviewed events | Band | What moves it |
|---|---|---|---|---|
| UGA | +1.5 (+1) | +1.5 (+1) | Acting, unchanged | B1 +16.5 and the passivity penalty (-15); no event |
| ZMB | -26.0 (-26) | -26.0 (-26) | Enabling, unchanged | B1 -11.0 (nine non-votes and an abstention) and the passivity penalty (-15); no event |
| ZWE | +1.5 (+1) | +9.5 (+9) | Acting, unchanged | D3 +8.0 (standing); B1 +16.5 and the passivity penalty (-15) stay. Without the event: +1.5 |

No band change. Read critically (docs/06 §4 step 7): Zimbabwe's rise rests on a USD 500,000 contribution read against an absent 2022 row; Zambia's band rests on non-votes whose cause is unknown (if B1 counted nothing for them it would be -15, Passive).

### 90-minute stop note

The session finished within the limit. Left for P-23 and Task V: the web searches per indicator group, Zimbabwe's Government sources, Uganda's State House addresses (including the NAM summit of January 2024), Zambia's State House record of the Herzog visit, B7, B11 and D4 for the three, the arrears lists of 2023 and 2024, the 2025 UNRWA table, and Comtrade for the three.

## Verification of 2026-11

HANDOFF.md Task V: a second check, by a fresh Opus 5.5 session, of every event, lead and recognition row filed by the light-protocol sessions, which Sonnet 5.5 ran. Session T-VERIFY-1 (2026-11-04) covers groups 5 to 26 (66 countries); T-VERIFY-2 (2026-11-04) covers groups 27 to 49 (70 countries). Build-log rows: docs/10 B-848 and B-849. No event changed status; `review.reviewed_by` is not set; nothing is published.

### T-VERIFY-1: groups 5 to 26 (2026-11-04)

**What was checked, and how.** The checklist of Task B2 (T-VERIFY-AG), applied to 218 events (all `reviewed`), 112 leads and the 18 recognition rows these sessions added to `data/structured/recognitions.csv`.

1. **Quote at the locator.** A script normalised each quote and `archive/text/<source>.txt` as the validator does (NFC, whitespace runs collapsed, invisible characters removed), confirmed every quote is in the text, and mapped its position back to line numbers to compare with the `line …` locators; `paragraph …` and `page …` locators were checked by hand against the line or paragraph number.
2. **Captures.** Every source cited by these events and recognition rows (219 sources) was fetched again from its `wayback_url` with `curl --compressed`, one at a time, and its byte count and SHA-256 compared with the source record (which the validator ties to `archive/index.csv`). Archived texts under 1,500 characters or with bot-check wording near the top were opened and read.
3. **Speaker and wording (R3, R4, R7).** Every event was read with its quotes, points rationale and notes. For B9 and B10 events scoped `gaza`, a script measured the distance from each quote to the nearest mention of Gaza in the archived document; documents without one were read.
4. **Date and tier.** Event dates compared with source dates (gaps over three days read in the notes); UNRWA D3 tiers re-read against the 2022, 2023 and 2024 donor tables; tiers compared across countries for the same wording.
5. **Scope tags.** `west-bank`-only events checked for quotes about Gaza; `gaza` scopes checked as in 3.
6. **French summaries.** Gender and capitals of every named speaker's summary against `docs/glossary.fr.md`; the tone lint is the validator's.
7. **Leads.** Every lead read for its claim and sourcing (only press or NGO sources, or archived records); each lead source URL fetched live once to catch dead or invented addresses.
8. **Recognition rows.** Each row's date found in its archived source text.

**Result.** Every quote is verbatim in its archived text. Three events had wrong line locators (corrected). Two B9 events cite documents that do not name Gaza (scope changed to `related` under R7, as `evt_2024_11_25_IND_B9`). Eight French summaries had a wrong gender or capital (corrected). Every replay that answered equals its record (exceptions below). No invented quote, source, date or speaker was found.

**Replays.** 216 of the 219 sources: the replay fetched again equals the record (byte count and SHA-256; six needed a second fetch after a time-out). Three captures made by Save Page Now on 3 November 2026 are not yet in the Wayback index: `src_20250927_dfa-ungarchive_phl-lazaro-80` (`evt_2025_09_27_PHL_B9`) and `src_20260926_mfa-bn_prince-mateen-unga81` (`evt_2026_09_26_BRN_B9`) answer HTTP 404 at their timestamps, and `src_20260227_mfa-sg_cos-2026-speeches` (`evt_2026_02_27_SGP_B9`) is redirected to the capture of 10 October 2026 (1,137,186 bytes against 1,136,472 recorded). The CDX index lists none of the three timestamps, a usual delay for captures a day old; the sessions recorded an equal replay right after capture, and the archived texts are in `archive/text/`. Left open: re-fetch the three in P-23 (Wayback item, T-P23-4) and re-archive any that stays absent.

**Leads.** 112 leads (111 open, one promoted to `evt_2026_02_07_IRN_B9`); every source is press, NGO or an archived record. Of 163 distinct lead URLs, 147 answer HTTP 200 live; 14 answer 403, 406 or time out (news sites behind bot checks); `radiorebelde.cu` (lead_20261006_CUB_2) answers 404 and `samoaobserver.ws` (lead_20261104_WSM_2) 500, and both have Wayback copies (28 September 2026, 15 February 2026). No lead rests on an address that does not exist.

### Table per country (groups 5 to 26)

Columns: events filed; evidence items with the quote found verbatim and at its locator (after the fixes below); distinct sources cited by the events and whether the replay equals the record; leads and their live URLs; the recognition row the session added, if any; findings.

#### Group 5: SVK, UKR, ATG

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index | Leads (source URLs fetched live) | Recognition row | Findings and fixes |
|---|---|---|---|---|---|---|
| SVK | 9 | 22: 22 / 22 | 11: 11 | 5 (8/9 URLs answer 200; other: 403) | none filed by the session | No finding. |
| UKR | 0 | 0: 0 / 0 | 0: 0 | 3 (1/2 URLs answer 200; other: 403) | none filed by the session | No event. lead_20261006_UKR_3 quotes the Cabinet's words from a search excerpt (kmu.gov.ua answers a CAPTCHA): acceptable for a lead, never for an event. |
| ATG | 2 | 6: 6 / 6 | 2: 2 | 2 (1/2 URLs answer 200; other: 403) | none filed by the session | No finding. |

#### Group 6: BHS, BLZ, BRB

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index | Leads (source URLs fetched live) | Recognition row | Findings and fixes |
|---|---|---|---|---|---|---|
| BHS | 0 | 0: 0 / 0 | 0: 0 | 1 (1/1 URLs answer 200) | none filed by the session | No finding. |
| BLZ | 4 | 11: 11 / 11 | 5: 5 | 3 (3/3 URLs answer 200) | 2011-09-09 (1 source(s), replay equal 1/1) | No finding. Recognition row read in the Press Office's release of 9 September 2011. |
| BRB | 2 | 4: 4 / 4 | 2: 2 | 1 (0/1 URLs answer 200; other: 000) | none filed by the session | No finding. |

#### Group 7: CRI, CUB, DMA

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index | Leads (source URLs fetched live) | Recognition row | Findings and fixes |
|---|---|---|---|---|---|---|
| CRI | 2 | 6: 6 / 6 | 4: 4 | 3 (4/4 URLs answer 200) | none filed by the session | No finding. |
| CUB | 5 | 13: 13 / 13 | 6: 6 | 4 (6/7 URLs answer 200; other: 404) | 1988-11-16 (1 source(s), replay equal 1/1) | (1) evt_2025_01_10_CUB_B3: the three locators of the declaration were one line early; corrected to lines 146, 854, 277. (2) evt_2024_09_28_CUB_B9: the archived Spanish file names no Gaza ('el pueblo palestino' only): scope gaza changed to related under R7 (B-234 (2)); decayed, no score change. Recognition row (16 November 1988) read in the Ministry's text. |
| DMA | 0 | 0: 0 / 0 | 0: 0 | 2 (1/2 URLs answer 200; other: 403) | none filed by the session | No finding. |

#### Group 8: DOM, ECU, GRD

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index | Leads (source URLs fetched live) | Recognition row | Findings and fixes |
|---|---|---|---|---|---|---|
| DOM | 1 | 4: 4 / 4 | 2: 2 | 0 | 2009-07-15 (1 source(s), replay equal 1/1) | No finding on the event. Recognition row rests on the joint communiqué establishing diplomatic relations with the State of Palestine (15 July 2009): recognition implied by the relations, flagged. |
| ECU | 6 | 13: 13 / 13 | 6: 6 | 3 (4/4 URLs answer 200) | 2010-12-24 (1 source(s), replay equal 1/1) | evt_2026_08_05_ECU_C2_2: the EFE quote is on line 180, not 176 (the headline); corrected. Recognition row (24 December 2010) read in the Cancillería's page of 3 December 2018. |
| GRD | 0 | 0: 0 / 0 | 0: 0 | 0 | none filed by the session | No finding. |

#### Group 9: GTM, GUY, HND

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index | Leads (source URLs fetched live) | Recognition row | Findings and fixes |
|---|---|---|---|---|---|---|
| GTM | 1 | 2: 2 / 2 | 1: 1 | 2 (2/2 URLs answer 200) | none filed by the session | No finding. |
| GUY | 5 | 12: 12 / 12 | 5: 5 | 1 (1/1 URLs answer 200) | 2011-01-13 (1 source(s), replay equal 1/1) | evt_2024_10_29_GUY_B9: the third quote is on lines 837 to 841 (Mr. Todd's statement, lines 808 to 900), not line 1810; corrected. Recognition row read in Guyana's letter A/65/692 (UNISPAL copy). |
| HND | 4 | 9: 9 / 9 | 9: 9 | 2 (2/2 URLs answer 200) | 2011-08-26 (2 source(s), replay equal 2/2) | No finding on the events. Recognition row (26 August 2011) rests on the UN Division for Palestinian Rights' chronology and the President's General Assembly excerpt: a UN Secretariat chronology, flagged (R21). |

#### Group 10: HTI, JAM, KNA

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index | Leads (source URLs fetched live) | Recognition row | Findings and fixes |
|---|---|---|---|---|---|---|
| HTI | 0 | 0: 0 / 0 | 0: 0 | 0 | 2013-09-27 (1 source(s), replay equal 1/1) | No event. Recognition row (27 September 2013) rests on the UN chronology of September 2013 (ceremony at UN Headquarters): flagged (R21). |
| JAM | 1 | 1: 1 / 1 | 1: 1 | 2 (3/3 URLs answer 200) | none filed by the session | No finding. |
| KNA | 2 | 3: 3 / 3 | 2: 2 | 0 | 2019-07-29 (1 source(s), replay equal 1/1) | No finding. Recognition row dated by the agreement establishing diplomatic relations (SKNIS, 30 July 2019): recognition implied by the relations, flagged. |

#### Group 11: LCA, NIC, PAN

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index | Leads (source URLs fetched live) | Recognition row | Findings and fixes |
|---|---|---|---|---|---|---|
| LCA | 2 | 6: 6 / 6 | 2: 2 | 0 | 2015-09-14 (1 source(s), replay equal 1/1) | No finding. Recognition row dated by the Department of External Affairs' list of diplomatic relations ('Palestine (State of) 2015 (Sept 14)'): recognition implied by the relations, flagged. |
| NIC | 2 | 6: 6 / 6 | 4: 4 | 4 (4/4 URLs answer 200) | none filed by the session | No finding. |
| PAN | 1 | 3: 3 / 3 | 2: 2 | 3 (5/5 URLs answer 200) | none filed by the session | No finding. |

#### Group 12: PER, PRY, SLV

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index | Leads (source URLs fetched live) | Recognition row | Findings and fixes |
|---|---|---|---|---|---|---|
| PER | 1 | 4: 4 / 4 | 3: 3 | 1 (1/1 URLs answer 200) | 2011-01-24 (1 source(s), replay equal 1/1) | No finding on the event. Recognition row (24 January 2011) rests on the UN chronology of January 2011: flagged (R21). |
| PRY | 4 | 11: 11 / 11 | 7: 7 | 5 (10/10 URLs answer 200) | 2011-01-28 (1 source(s), replay equal 1/1) | No finding on the events. Recognition row (28 January 2011) rests on the UN chronology quoting the Ministry's statement: flagged (R21). |
| SLV | 0 | 0: 0 / 0 | 0: 0 | 0 | 2011-08-25 (1 source(s), replay equal 1/1) | No event. Recognition row (25 August 2011) rests on the UN chronology of August 2011: flagged (R21). |

#### Group 13: SUR, TTO, URY

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index | Leads (source URLs fetched live) | Recognition row | Findings and fixes |
|---|---|---|---|---|---|---|
| SUR | 1 | 2: 2 / 2 | 2: 2 | 3 (3/4 URLs answer 200; other: 403) | 2011-02-01 (3 source(s), replay equal 3/3) | No finding on the event. Recognition row (1 February 2011) rests on the UN Montevideo meeting report (a UN Secretariat text); the February 2011 chronology and the 2023 Government page do not state the date: flagged (R21). |
| TTO | 1 | 4: 4 / 4 | 2: 2 | 2 (3/4 URLs answer 200; other: 000) | none filed by the session | No finding. |
| URY | 0 | 0: 0 / 0 | 0: 0 | 4 (8/8 URLs answer 200) | 2011-03-15 (1 source(s), replay equal 1/1) | No event. Recognition row (15 March 2011) rests on the UN Montevideo meeting report: flagged (R21). |

#### Group 14: VCT, VEN, FJI

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index | Leads (source URLs fetched live) | Recognition row | Findings and fixes |
|---|---|---|---|---|---|---|
| VCT | 2 | 5: 5 / 5 | 2: 2 | 1 (1/1 URLs answer 200) | 2011-08-30 (1 source(s), replay equal 1/1) | evt_2025_09_26_VCT_B9 rests on the UN Meetings Coverage (GA/12712), which prints the Prime Minister's words in quotation marks (direct speech): kept, flagged. Recognition row (30 August 2011) rests on the UN chronology: flagged (R21). |
| VEN | 4 | 10: 10 / 10 | 5: 5 | 3 (4/4 URLs answer 200) | 2009-04-27 (2 source(s), replay equal 2/2) | No change. B12 (pre-window severance) and B6 scope stay flagged (B-628). Recognition row (27 April 2009) rests on the UN review of April 2009 relaying AFP on a joint communiqué establishing relations with the PA, and the 2011 note verbale: flagged (R21, B-628). |
| FJI | 4 | 12: 12 / 12 | 4: 4 | 3 (4/4 URLs answer 200) | none filed by the session | No finding. |

#### Group 15: PNG, SLB, VUT

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index | Leads (source URLs fetched live) | Recognition row | Findings and fixes |
|---|---|---|---|---|---|---|
| PNG | 3 | 7: 7 / 7 | 3: 3 | 3 (3/3 URLs answer 200) | none filed by the session | No change. The conditional ceasefire call and the two B10 events stay flagged (B-629, B-630). |
| SLB | 2 | 4: 4 / 4 | 2: 2 | 1 (2/2 URLs answer 200) | none filed by the session | No finding. |
| VUT | 0 | 0: 0 / 0 | 0: 0 | 0 | none filed by the session | No finding. |

#### Group 16: FSM, KIR, MHL

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index | Leads (source URLs fetched live) | Recognition row | Findings and fixes |
|---|---|---|---|---|---|---|
| FSM | 0 | 0: 0 / 0 | 0: 0 | 2 (1/2 URLs answer 200; other: 403) | none filed by the session | No finding. |
| KIR | 0 | 0: 0 / 0 | 0: 0 | 0 | none filed by the session | No finding. |
| MHL | 1 | 1: 1 / 1 | 1: 1 | 0 | none filed by the session | French summary: 'La Présidente' changed to 'La présidente' (glossary: lower case). |

#### Group 17: NRU, PLW, LBY

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index | Leads (source URLs fetched live) | Recognition row | Findings and fixes |
|---|---|---|---|---|---|---|
| NRU | 0 | 0: 0 / 0 | 0: 0 | 1 (3/3 URLs answer 200) | none filed by the session | No finding. |
| PLW | 0 | 0: 0 / 0 | 0: 0 | 2 (2/2 URLs answer 200) | none filed by the session | No finding. |
| LBY | 4 | 7: 7 / 7 | 5: 5 | 4 (10/10 URLs answer 200) | none filed by the session | No change. Speakers of the rival-authority setting stay flagged (B-661). |

#### Group 18: SDN, TUN, EST

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index | Leads (source URLs fetched live) | Recognition row | Findings and fixes |
|---|---|---|---|---|---|---|
| SDN | 2 | 3: 3 / 3 | 2: 2 | 0 | none filed by the session | No finding. |
| TUN | 9 | 21: 21 / 21 | 15: 15 | 4 (7/8 URLs answer 200; other: 403) | none filed by the session | No change. The Arabic quotes of the 79th and 80th General Debate files carry broken text layers (stay flagged, B-673 (2)). |
| EST | 17 | 40: 40 / 40 | 22: 22 | 3 (4/4 URLs answer 200) | none filed by the session | No change. Tier readings of 'not acceptable' (6 August 2025) and 'crossed all red lines' (24 September 2025) at +5 stay flagged; see the cross-country tier note below. |

#### Group 19: FIN, ISL, LTU

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index | Leads (source URLs fetched live) | Recognition row | Findings and fixes |
|---|---|---|---|---|---|---|
| FIN | 21 | 53: 53 / 53 | 26: 26 | 1 (2/2 URLs answer 200) | none filed by the session | No change. evt_2025_08_25_FIN_B9 ('gone many times too far') at +5 and evt_2024_02_29_FIN_C2 (one press origin, day not known) stay flagged; see the cross-country tier note below. |
| ISL | 22 | 55: 55 / 55 | 24: 24 | 3 (2/2 URLs answer 200) | 2011-12-15 (1 source(s), replay equal 1/1) | No finding. Recognition row (15 December 2011) read in the Foreign Minister's report to the Althing (2024). |
| LTU | 13 | 30: 30 / 30 | 15: 15 | 3 (3/4 URLs answer 200; other: 403) | none filed by the session | No finding. |

#### Group 20: LVA, TON, TUV

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index | Leads (source URLs fetched live) | Recognition row | Findings and fixes |
|---|---|---|---|---|---|---|
| LVA | 16 | 33: 33 / 33 | 19: 19 | 3 (3/5 URLs answer 200; other: 403, 403) | none filed by the session | French summaries: four joint-statement events of the Foreign Minister Baiba Braže said 'Le ministre'; corrected to 'La ministre' (evt_2025_05_19, 07_21, 08_12, 08_21). Three 'Le Président' changed to 'Le président' (glossary). |
| TON | 0 | 0: 0 / 0 | 0: 0 | 2 (3/3 URLs answer 200) | none filed by the session | No finding. |
| TUV | 0 | 0: 0 / 0 | 0: 0 | 0 | none filed by the session | No finding. |

#### Group 21: WSM, BRN, KHM

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index | Leads (source URLs fetched live) | Recognition row | Findings and fixes |
|---|---|---|---|---|---|---|
| WSM | 0 | 0: 0 / 0 | 0: 0 | 2 (2/3 URLs answer 200; other: 500) | none filed by the session | No finding. |
| BRN | 3 | 6: 6 / 6 | 3: 2 | 1 (2/2 URLs answer 200) | none filed by the session | evt_2026_08_22_BRN_B9: the archived joint statement names no Gaza (the Palestinian issue, people and statehood only): scope gaza changed to related under R7 (B-234 (2)). Provisional score +26.5 to +26.1 (B9 sum 14.6 to 9.6, under the cap), band Acting unchanged. The event's flag says the Malaysian counterpart is filed: data/events/MYS.yaml has no event of that day. |
| KHM | 1 | 1: 1 / 1 | 1: 1 | 1 (2/2 URLs answer 200) | none filed by the session | No finding. |

#### Group 22: LAO, MMR, PHL

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index | Leads (source URLs fetched live) | Recognition row | Findings and fixes |
|---|---|---|---|---|---|---|
| LAO | 1 | 1: 1 / 1 | 1: 1 | 1 (1/1 URLs answer 200) | none filed by the session | No finding. |
| MMR | 0 | 0: 0 / 0 | 0: 0 | 0 | none filed by the session | No finding. |
| PHL | 2 | 4: 4 / 4 | 3: 2 | 3 (6/7 URLs answer 200; other: 403) | none filed by the session | No finding. |

#### Group 23: SGP, THA, TLS

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index | Leads (source URLs fetched live) | Recognition row | Findings and fixes |
|---|---|---|---|---|---|---|
| SGP | 8 | 11: 11 / 11 | 8: 7 | 0 | none filed by the session | No change. evt_2024_02_29_SGP_B9 reads 'gone too far' at the call tier (+2), unlike FIN and EST (+5): see the cross-country tier note below. evt_2023_12_31_SGP_D3 (earthquake-appeal column) stays flagged. |
| THA | 2 | 4: 4 / 4 | 3: 3 | 2 (2/2 URLs answer 200) | 2012-01-17 (1 source(s), replay equal 1/1) | No finding. Recognition row (17 January 2012) read in the Ministry's release of 12 January 2024. |
| TLS | 1 | 3: 3 / 3 | 1: 1 | 1 (1/1 URLs answer 200) | none filed by the session | No finding. |

#### Group 24: VNM, AFG, BGD

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index | Leads (source URLs fetched live) | Recognition row | Findings and fixes |
|---|---|---|---|---|---|---|
| VNM | 1 | 1: 1 / 1 | 1: 1 | 0 | none filed by the session | No finding. |
| AFG | 0 | 0: 0 / 0 | 0: 0 | 1 (1/1 URLs answer 200) | none filed by the session | No finding. |
| BGD | 3 | 10: 10 / 10 | 5: 5 | 1 (1/1 URLs answer 200) | none filed by the session | No finding. |

#### Group 25: BTN, IRN, LKA

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index | Leads (source URLs fetched live) | Recognition row | Findings and fixes |
|---|---|---|---|---|---|---|
| BTN | 0 | 0: 0 / 0 | 0: 0 | 0 | none filed by the session | No finding. |
| IRN | 3 | 9: 9 / 9 | 3: 3 | 1 (1/1 URLs answer 200) | none filed by the session | No finding. |
| LKA | 4 | 6: 6 / 6 | 5: 5 | 1 (2/2 URLs answer 200) | none filed by the session | No finding. |

#### Group 26: MDV, NPL, PAK

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index | Leads (source URLs fetched live) | Recognition row | Findings and fixes |
|---|---|---|---|---|---|---|
| MDV | 4 | 10: 10 / 10 | 6: 6 | 2 (1/2 URLs answer 200; other: 406) | none filed by the session | No finding. |
| NPL | 0 | 0: 0 / 0 | 0: 0 | 0 | none filed by the session | No finding. |
| PAK | 9 | 20: 20 / 20 | 10: 10 | 0 | none filed by the session | No finding. |

#### Fixes made in place (events `reviewed`, unpublished: no corrections.yaml entry, revision unchanged)

| Event | Field | Before | After | Why |
|---|---|---|---|---|
| evt_2025_01_10_CUB_B3 | three locators | lines 145, 853, 276 | lines 146, 854, 277 | the quotes begin one line later in the archived text |
| evt_2026_08_05_ECU_C2_2 | locator (EFE) | line 176 | line 180 | line 176 is the headline, in other words |
| evt_2024_10_29_GUY_B9 | locator (third quote) | line 1810 | lines 837 to 841 | the passage is in Mr. Todd's statement (lines 808 to 900) |
| evt_2024_09_28_CUB_B9 | scope | gaza | related | the archived file names no Gaza (R7, B-234 (2)); decayed to zero, no score change |
| evt_2026_08_22_BRN_B9 | scope | gaza | related | the archived joint statement names no Gaza (R7, B-234 (2)); Brunei +26.5 to +26.1 provisional, Acting unchanged |
| four LVA joint-statement B9 events of Baiba Braže (19 May, 21 July, 12 August, 21 August 2025) | summary.fr | Le ministre | La ministre | the Minister is a woman |
| evt_2024_09_24_LVA_B9, evt_2025_08_05_LVA_B9, evt_2025_09_24_LVA_B9 | summary.fr | Le Président | Le président | glossary: lower case |
| evt_2024_09_25_MHL_B9 | summary.fr | La Présidente | La présidente | glossary: lower case |

Each changed event's `review.notes` now ends with a "Verification of 2026-11 (T-VERIFY-1)" sentence; locator-only fixes are noted in CUB, ECU and GUY.

#### Cross-country reading flagged for the author

- **Tier of criticism without a legal term.** "Israel's military response has gone too far" is filed at the call tier (+2) for Singapore (evt_2024_02_29_SGP_B9, which also calls for a ceasefire), while "Israel has gone many times too far" (evt_2025_08_25_FIN_B9), "crossed all red lines" (evt_2025_09_24_EST_B9) and "not acceptable" (evt_2025_08_06_EST_B9) are filed at +5 as named conduct. Default adopted: kept as filed; no score moves (the Singapore event is past 730 days; Finland's and Estonia's B9 are at the +10 cap without them). The author decides one reading for all four.
- **Recognition rows resting on UN Secretariat texts** (R21 flag): HND, HTI, PER, PRY, SLV, VCT, VEN (the Division for Palestinian Rights' chronologies), SUR and URY (the UN Montevideo meeting report). Rows dated by the establishment of diplomatic relations: DOM, KNA, LCA (and ISL by the Government's own statement that relations imply recognition). Default adopted: kept, flagged.
- **A UN press summary as B9 evidence**: evt_2025_09_26_VCT_B9 (direct quotation in GA/12712). Default adopted: kept.

#### Not done in this session

- Leads were checked for sourcing and live URLs, not re-researched; the claims stay unverified, as leads are by definition.
- The French summaries were read for gender, capitals and the glossary's terms; a native reader's pass stays with the author (Part 4, item 4).
- Groups 27 to 49 are T-VERIFY-2's. Passed on: the French summary of `evt_2025_10_07_PRT_B9` begins "Le Président de la République" (glossary: lower case).

### T-VERIFY-2: groups 27 to 49 (2026-11-04)

**What was checked, and how.** The same checklist as T-VERIFY-1 (Task B2), by a fresh Opus 5.5 session, applied to the 70 countries of groups 27 to 49 (group 49 with Monaco folded in): 168 events filed by the light-protocol sessions (all `reviewed`), 32 leads and the 4 recognition rows these sessions added to `data/structured/recognitions.csv` (AGO, BWA, GAB, VAT). Groups 46 to 49 and 24 to 26 were run by Opus 5.5 and groups 27 to 45 by Sonnet 5.5; all are checked alike.

1. **Quote at the locator.** A script normalised each quote and its `archive/text/<source>.txt` as the validator does and mapped each quote's position to line numbers; `page …` and `paragraph …` locators were checked by hand (the Namibian declaration's page numbers are page headers in the extracted text).
2. **Captures.** The 117 sources cited by these events and recognition rows were fetched again from their `wayback_url` with `curl --compressed`, one at a time, and byte count and SHA-256 compared with the source record and `archive/index.csv` (all three agree for every source). Archived texts under 1,500 characters or with bot-check wording were read (three short texts, all genuine: the Botswana notice, the Niger depositary notification, the Liechtenstein curriculum vitae).
3. **Speaker and wording (R3, R4, R7).** Every event was read with its quotes, rationale and notes, clustered by statement so that one joint statement filed for several signatories was read once and its signatory line checked per country. For B9 and B10 scoped `gaza`, a script measured the distance from each quote to the nearest mention of Gaza (Arabic, Greek and the Slavic case forms included) in the archived document.
4. **Date and tier.** Event dates compared with source dates (four gaps over three days, all explained: a year-only list, depositary notifications after the action); the UNRWA D3 tiers re-read against the 2022, 2023 and 2024 donor tables for all 25 D3 events; tiers compared across countries for the same wording.
5. **Scope tags.** The ten `west-bank`-only events read for conduct in Gaza (none); `gaza` scopes as in 3.
6. **French summaries.** Gender and capitals against `docs/glossary.fr.md`.
7. **Leads.** Every lead read for its claim and sourcing; each lead source URL fetched live once.
8. **Signatories.** For every joint statement filed in these groups, the archived text was searched for the other states of groups 27 to 49 to find signatories left without the event (same treatment for every signatory, B-444).

**Result.** Every quote is verbatim in its archived text and at its locator, after one locator fix (Namibia). Every replay equals its record. No invented quote, source, date or speaker was found. No B9 or B10 scoped `gaza` rests on a document without Gaza. Four French summaries had a capital on the title (corrected). Three joint statements co-signed by Malta and Portugal, archived for other signatories, had not been filed for them: three events added (no score change, both countries are at the B9 cap). Serbia's signature of the leaders' statement of 6 June 2024 has no named signatory: recorded, not filed.

**Replays.** 117 of 117 sources: the replay fetched again equals the record (three needed a second fetch after a time-out). No capture of these groups is missing from the Wayback index.

**Leads.** 32 leads, all open; every source is kind `press` (Government information services such as the Presidencies of Ghana, Kenya and Liberia and the state news agency of Mauritania are entered with kind press, as the validator requires for a lead; their texts are archived where the lead says so). Of 37 lead source URLs, 36 answer HTTP 200 live; `dailynews.co.tz` (lead_20261104_TZA_1) answers 500 and has a Wayback copy of 15 July 2026. No lead rests on an address that does not exist.

### Table per country (groups 27 to 49)

Columns as for groups 5 to 26. Events and evidence items count the events after this session's additions (MLT 19 + 2, PRT 20 + 1).

#### Group 27: ALB, AND, BIH

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index | Leads (source URLs fetched live) | Recognition row | Findings and fixes |
|---|---|---|---|---|---|---|
| ALB | 3 | 5: 5 / 5 | 3: 3 | 2 (2/2 URLs answer 200) | none filed by the session | No finding. The two C2 memoranda stay flagged under R18 (tourism; health). |
| AND | 5 | 10: 10 / 10 | 6: 6 | 0 | none filed by the session | No finding. |
| BIH | 1 | 3: 3 / 3 | 1: 1 | 1 (1/1 URLs answer 200) | none filed by the session | No finding. The address names Gaza in the Bosnian genitive ('u pojasu Gaze'); the Chairman of the Presidency as head of state stays flagged (R3). |

#### Group 28: HRV, MKD, MLT

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index | Leads (source URLs fetched live) | Recognition row | Findings and fixes |
|---|---|---|---|---|---|---|
| HRV | 12 | 22: 22 / 22 | 13: 13 | 0 | none filed by the session | No change. evt_2024_09_27_HRV_B9 (negotiations to end hostilities, no ceasefire named) and evt_2025_09_09_HRV_B9 stay flagged at the call tier. |
| MKD | 1 | 3: 3 / 3 | 2: 2 | 0 | none filed by the session | No finding. The C2 event rests on two press publishers with no primary (confidence reported, flagged). |
| MLT | 21 | 48: 48 / 48 | 23: 23 | 1 (3/3 URLs answer 200) | none filed by the session | Two joint statements that name Malta, archived and filed for other signatories, had not been filed: evt_2025_05_16_MLT_B9 (the seven Prime Ministers' statement, Robert Abela on line 14, +5) and evt_2026_01_05_MLT_B9 (UNRWA and NGOs, Malta on line 133, +2, minister's name by continuity, flagged) added. B9 at the +10 cap before and after: provisional +56 unchanged. Assessment note updated. |

#### Group 29: MNE, PRT, SMR

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index | Leads (source URLs fetched live) | Recognition row | Findings and fixes |
|---|---|---|---|---|---|---|
| MNE | 3 | 3: 3 / 3 | 3: 3 | 1 (1/1 URLs answer 200) | none filed by the session | No finding. |
| PRT | 21 | 49: 49 / 49 | 23: 23 | 2 (2/2 URLs answer 200) | none filed by the session | (1) evt_2025_10_07_PRT_B9: summary.fr 'Le Président' changed to 'Le président' (passed on by T-VERIFY-1). (2) The six foreign ministers' letter of 14 December 2025 (Paulo Rangel on lines 25 and 26; the Luxembourg event listed the signatories for Task V) had not been filed: evt_2025_12_14_PRT_B9 added (+5). B9 at the +10 cap before and after: provisional +47.5 unchanged. (3) The B9 assessment note counted eleven joint statements for twelve; corrected. |
| SMR | 3 | 4: 4 / 4 | 3: 3 | 2 (2/2 URLs answer 200) | none filed by the session | Two French summaries: 'Le Secrétaire d'État' changed to 'Le secrétaire d'État' (glossary: lower case). |

#### Group 30: SRB, VAT, AGO

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index | Leads (source URLs fetched live) | Recognition row | Findings and fixes |
|---|---|---|---|---|---|---|
| SRB | 1 | 1: 1 / 1 | 1: 1 | 1 (1/1 URLs answer 200) | none filed by the session | Serbia is named among the seventeen states of the leaders' joint statement of 6 June 2024 (src_20240606_govinfo_dcpd-202400492, line 6; filed for Portugal, Romania and others). The text names states, not signatories, and either the President or the Prime Minister may have signed for Serbia: no speaker is established (R3), so no event is filed; the statement is past 730 days (no score effect). Recorded in the B9 assessment note, for the author. |
| VAT | 4 | 8: 8 / 8 | 4: 4 | 1 (1/1 URLs answer 200) | 2015-06-26 (1 source(s), replay equal 1/1) | evt_2024_09_28_VAT_B9: summary.fr 'Le Secrétaire d'État' changed to 'Le secrétaire d'État'. Cardinal Parolin as the head-of-government equivalent stays flagged (R3, B-736). Recognition row (26 June 2015) read in the joint communiqué on the signing of the Comprehensive Agreement with the State of Palestine: recognition implied by the treaty, flagged. |
| AGO | 3 | 7: 7 / 7 | 4: 4 | 1 (1/1 URLs answer 200) | 1988-12-06 (1 source(s), replay equal 1/1) | No finding. Recognition row (6 December 1988) read in the President's address of 22 September 2025 (UNISPAL copy, line 83). |

#### Group 31: BDI, BEN, BFA

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index | Leads (source URLs fetched live) | Recognition row | Findings and fixes |
|---|---|---|---|---|---|---|
| BDI | 0 | 0: 0 / 0 | 0: 0 | 1 (1/1 URLs answer 200) | none filed by the session | No event. The lead's source is the Presidency's own report, entered with kind press (the Government's information service), as the sessions of groups 31 to 45 did. |
| BEN | 0 | 0: 0 / 0 | 0: 0 | 0 | none filed by the session | No event. No finding. |
| BFA | 1 | 2: 2 / 2 | 1: 1 | 0 | none filed by the session | No change. The withdrawal from the Rome Statute stays scoped related and flagged (B6, B-776). |

#### Group 32: BWA, CAF, CIV

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index | Leads (source URLs fetched live) | Recognition row | Findings and fixes |
|---|---|---|---|---|---|---|
| BWA | 0 | 0: 0 / 0 | 0: 0 | 0 | 1988-12-19 (1 source(s), replay equal 1/1) | No event. Recognition row (19 December 1988) read in the Ministry's notice as the Daily News printed it on 19 March 2017 (line 5): a Government statement relayed by the state daily, flagged. |
| CAF | 0 | 0: 0 / 0 | 0: 0 | 0 | none filed by the session | No event. No finding. |
| CIV | 0 | 0: 0 / 0 | 0: 0 | 0 | none filed by the session | No event. No finding. |

#### Group 33: CMR, COD, COG

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index | Leads (source URLs fetched live) | Recognition row | Findings and fixes |
|---|---|---|---|---|---|---|
| CMR | 0 | 0: 0 / 0 | 0: 0 | 0 | none filed by the session | No event. No finding. |
| COD | 0 | 0: 0 / 0 | 0: 0 | 0 | none filed by the session | No event. No finding. |
| COG | 0 | 0: 0 / 0 | 0: 0 | 0 | none filed by the session | No event. No finding. |

#### Group 34: COM, CPV, DJI

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index | Leads (source URLs fetched live) | Recognition row | Findings and fixes |
|---|---|---|---|---|---|---|
| COM | 4 | 6: 6 / 6 | 5: 5 | 0 | none filed by the session | No finding. The declaration of intervention (B3) matches the Court's case page. |
| CPV | 0 | 0: 0 / 0 | 0: 0 | 0 | none filed by the session | No event. No finding. |
| DJI | 0 | 0: 0 / 0 | 0: 0 | 0 | none filed by the session | No event. No finding. |

#### Group 35: ERI, ETH, GAB

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index | Leads (source URLs fetched live) | Recognition row | Findings and fixes |
|---|---|---|---|---|---|---|
| ERI | 0 | 0: 0 / 0 | 0: 0 | 0 | none filed by the session | No event. No finding. |
| ETH | 0 | 0: 0 / 0 | 0: 0 | 1 (3/3 URLs answer 200) | none filed by the session | No finding. |
| GAB | 0 | 0: 0 / 0 | 0: 0 | 0 | 1988-12-12 (1 source(s), replay equal 1/1) | No event. Recognition row (12 December 1988) read in the President's General Debate address of 25 September 2025 (line 45). |

#### Group 36: GHA, GIN, GMB

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index | Leads (source URLs fetched live) | Recognition row | Findings and fixes |
|---|---|---|---|---|---|---|
| GHA | 0 | 0: 0 / 0 | 0: 0 | 1 (1/1 URLs answer 200) | none filed by the session | No finding. |
| GIN | 0 | 0: 0 / 0 | 0: 0 | 0 | none filed by the session | No event. No finding. |
| GMB | 3 | 4: 4 / 4 | 3: 3 | 0 | none filed by the session | No finding. |

#### Group 37: GNB, GNQ, KEN

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index | Leads (source URLs fetched live) | Recognition row | Findings and fixes |
|---|---|---|---|---|---|---|
| GNB | 0 | 0: 0 / 0 | 0: 0 | 0 | none filed by the session | No event. No finding. |
| GNQ | 0 | 0: 0 / 0 | 0: 0 | 0 | none filed by the session | No event. No finding. |
| KEN | 1 | 3: 3 / 3 | 2: 2 | 3 (3/3 URLs answer 200) | none filed by the session | No change. evt_2025_09_24_KEN_B9 ('disproportionate military operations', no party named) stays at the call tier, flagged; see the cross-country tier note below. |

#### Group 38: LBR, LSO, MDG

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index | Leads (source URLs fetched live) | Recognition row | Findings and fixes |
|---|---|---|---|---|---|---|
| LBR | 0 | 0: 0 / 0 | 0: 0 | 1 (1/1 URLs answer 200) | none filed by the session | No finding. |
| LSO | 3 | 5: 5 / 5 | 3: 3 | 1 (1/1 URLs answer 200) | none filed by the session | No change. evt_2024_09_26_LSO_B9 ('human rights violations in Gaza') stays at the call tier, flagged (expired, no effect). |
| MDG | 0 | 0: 0 / 0 | 0: 0 | 0 | none filed by the session | No event. No finding. |

#### Group 39: MLI, MOZ, MRT

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index | Leads (source URLs fetched live) | Recognition row | Findings and fixes |
|---|---|---|---|---|---|---|
| MLI | 1 | 2: 2 / 2 | 1: 1 | 0 | none filed by the session | No change. As Burkina Faso (B6, related, flagged). |
| MOZ | 0 | 0: 0 / 0 | 0: 0 | 0 | none filed by the session | No event. No finding. |
| MRT | 1 | 5: 5 / 5 | 1: 1 | 3 (3/3 URLs answer 200) | none filed by the session | No change. The Arabic text layer of the 80th General Debate file has broken ligatures ('اإلبادة'); the quotes match the archived text as extracted: flagged, as Tunisia's (B-673 (2)). |

#### Group 40: MUS, MWI, NAM

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index | Leads (source URLs fetched live) | Recognition row | Findings and fixes |
|---|---|---|---|---|---|---|
| MUS | 0 | 0: 0 / 0 | 0: 0 | 0 | none filed by the session | No event. No finding. |
| MWI | 0 | 0: 0 / 0 | 0: 0 | 0 | none filed by the session | No event. No finding. |
| NAM | 3 | 13: 13 / 13 | 4: 4 | 1 (1/1 URLs answer 200) | none filed by the session | evt_2024_09_25_NAM_B9: the second quote is on lines 111 to 113, not 110 to 112; corrected. The page locators of evt_2026_03_12_NAM_B3 checked against the page headers of the archived declaration: correct. |

#### Group 41: NER, RWA, SEN

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index | Leads (source URLs fetched live) | Recognition row | Findings and fixes |
|---|---|---|---|---|---|---|
| NER | 2 | 5: 5 / 5 | 3: 3 | 0 | none filed by the session | No change. B6 as Burkina Faso; the Prime Minister of the transitional Government as head of government stays flagged. |
| RWA | 1 | 3: 3 / 3 | 1: 1 | 0 | none filed by the session | No finding. |
| SEN | 2 | 7: 7 / 7 | 2: 2 | 0 | none filed by the session | No finding. |

#### Group 42: SLE, SOM, SSD

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index | Leads (source URLs fetched live) | Recognition row | Findings and fixes |
|---|---|---|---|---|---|---|
| SLE | 6 | 14: 14 / 14 | 6: 6 | 0 | none filed by the session | No finding. |
| SOM | 4 | 11: 11 / 11 | 5: 5 | 0 | none filed by the session | No finding. The date of evt_2025_09_25_SOM_B9 (file headed 24 September) stays flagged. |
| SSD | 1 | 4: 4 / 4 | 3: 3 | 2 (3/3 URLs answer 200) | none filed by the session | No change. The C2 memorandum rests on two press publishers with no primary (corroborated, flagged). |

#### Group 43: STP, SWZ, SYC

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index | Leads (source URLs fetched live) | Recognition row | Findings and fixes |
|---|---|---|---|---|---|---|
| STP | 0 | 0: 0 / 0 | 0: 0 | 0 | none filed by the session | No event. No finding. |
| SWZ | 0 | 0: 0 / 0 | 0: 0 | 0 | none filed by the session | No event. No finding. |
| SYC | 1 | 2: 2 / 2 | 1: 1 | 2 (2/2 URLs answer 200) | none filed by the session | No change. R7 and R4 flags of evt_2023_11_10_SYC_B9 stay (expired, no effect). |

#### Group 44: TCD, TGO, TZA

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index | Leads (source URLs fetched live) | Recognition row | Findings and fixes |
|---|---|---|---|---|---|---|
| TCD | 2 | 6: 6 / 6 | 2: 2 | 1 (1/1 URLs answer 200) | none filed by the session | No finding. |
| TGO | 0 | 0: 0 / 0 | 0: 0 | 0 | none filed by the session | No event. No finding. |
| TZA | 0 | 0: 0 / 0 | 0: 0 | 1 (0/1 URLs answer 200; other: 500) | none filed by the session | No event. The lead's Daily News URL answers HTTP 500 live; the Wayback Machine holds a copy (15 July 2026). |

#### Group 45: UGA, ZMB, ZWE

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index | Leads (source URLs fetched live) | Recognition row | Findings and fixes |
|---|---|---|---|---|---|---|
| UGA | 0 | 0: 0 / 0 | 0: 0 | 1 (1/1 URLs answer 200) | none filed by the session | No finding. |
| ZMB | 0 | 0: 0 / 0 | 0: 0 | 0 | none filed by the session | No event. No finding. |
| ZWE | 1 | 1: 1 / 1 | 1: 1 | 0 | none filed by the session | No finding. |

#### Group 46: ARM, BHR, CYP

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index | Leads (source URLs fetched live) | Recognition row | Findings and fixes |
|---|---|---|---|---|---|---|
| ARM | 1 | 1: 1 / 1 | 1: 1 | 0 | none filed by the session | No finding. |
| BHR | 2 | 6: 6 / 6 | 3: 3 | 1 (1/1 URLs answer 200) | none filed by the session | No finding. |
| CYP | 16 | 40: 40 / 40 | 17: 17 | 0 | none filed by the session | No finding. The joint declaration of 22 December 2025 (B10 and C2) stays flagged. |

#### Group 47: GEO, IRQ, KWT

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index | Leads (source URLs fetched live) | Recognition row | Findings and fixes |
|---|---|---|---|---|---|---|
| GEO | 0 | 0: 0 / 0 | 0: 0 | 0 | none filed by the session | No event. No finding. |
| IRQ | 2 | 5: 5 / 5 | 2: 2 | 0 | none filed by the session | No change. The Arabic text layer of the General Debate file has broken ligatures ('لإلنسانية', 'ال يطاق'); the quotes match the archived text as extracted: flagged, as Mauritania's. |
| KWT | 1 | 2: 2 / 2 | 2: 2 | 0 | none filed by the session | No finding. |

#### Group 48: LBN, OMN, SYR

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index | Leads (source URLs fetched live) | Recognition row | Findings and fixes |
|---|---|---|---|---|---|---|
| LBN | 3 | 5: 5 / 5 | 4: 4 | 0 | none filed by the session | No finding. |
| OMN | 4 | 10: 10 / 10 | 5: 5 | 0 | none filed by the session | No finding. |
| SYR | 1 | 1: 1 / 1 | 1: 1 | 0 | none filed by the session | No finding. |

#### Group 49: YEM, LIE, LUX, MCO

| Country | Events | Evidence items: quote verbatim / at locator | Sources: replay equal to index | Leads (source URLs fetched live) | Recognition row | Findings and fixes |
|---|---|---|---|---|---|---|
| YEM | 0 | 0: 0 / 0 | 0: 0 | 0 | none filed by the session | No event. No finding. |
| LIE | 4 | 11: 11 / 11 | 6: 6 | 0 | none filed by the session | No finding. |
| LUX | 21 | 54: 54 / 54 | 23: 23 | 0 | none filed by the session | No finding. The signatories listed for Task V in evt_2025_12_14_LUX_B9: Portugal filed (above); Spain, Belgium and Slovenia are full-protocol countries, left to P-23. |
| MCO | 1 | 2: 2 / 2 | 2: 2 | 0 | none filed by the session | No finding. |
#### Fixes made in place (events `reviewed`, unpublished: no corrections.yaml entry, revision unchanged)

| Event | Field | Before | After | Why |
|---|---|---|---|---|
| evt_2024_09_25_NAM_B9 | locator (second quote) | paragraph 11 (lines 110 to 112) | paragraph 11 (lines 111 to 113) | the quote begins on line 111 of the archived text |
| evt_2025_10_07_PRT_B9 | summary.fr | Le Président de la République | Le président de la République | glossary: lower case (passed on by T-VERIFY-1) |
| evt_2024_09_28_SMR_B9, evt_2025_07_30_SMR_B9 | summary.fr | Le Secrétaire d'État | Le secrétaire d'État | glossary: lower case |
| evt_2024_09_28_VAT_B9 | summary.fr | Le Secrétaire d'État | Le secrétaire d'État | glossary: lower case |

#### Events added (joint statements already archived and filed for other signatories)

| Event | Indicator | Date | Points | Confidence | Source kind | Why |
|---|---|---|---|---|---|---|
| evt_2025_05_16_MLT_B9 | B9 | 2025-05-16 | +5 | confirmed | official | seven Prime Ministers' statement, signed by Robert Abela (line 14); filed for ISL and LUX |
| evt_2025_12_14_PRT_B9 | B9 | 2025-12-14 | +5 | confirmed | official | six foreign ministers' letter to the High Representative, signed by Paulo Rangel (lines 25 and 26); filed for IRL and LUX |
| evt_2026_01_05_MLT_B9 | B9 | 2026-01-05 | +2 | confirmed | official | statement of seven states on UNRWA and NGOs, Malta named on line 133; filed for ISL and LUX; the minister's name rests on the continuity of the post (flagged) |

Each carries tier, speaker reading, flags and scope of the counterpart events, with a second reading recorded. Provisional scores (`pnpm score --preview`) before and after: Malta +56, Portugal +47.5; the B9 sums (31.8 to 37.0, 22.8 to 27.8) are above the +10 cap either way.

Each changed event's `review.notes` ends with a "Verification of 2026-11 (T-VERIFY-2, docs/10 B-849)" sentence; the B9 assessment notes of MLT, PRT and SRB say what changed.

#### Cross-country reading flagged for the author

- **Wording on proportionality or indiscriminate attacks, no party named, at the call tier (+2):** evt_2025_09_24_KEN_B9 ('disproportionate military operations'), evt_2023_11_10_SYC_B9 ('indiscriminate attacks', condemned on both sides), evt_2024_09_28_VAT_B9 ('raises many questions about its proportionality'), evt_2024_09_26_LSO_B9 ('human rights violations in Gaza'); against evt_2024_04_18_SLE_B9 ('without distinction, proportionality', the military response of Israel) and evt_2025_09_22_AGO_B9 ('the disproportionate reaction of the State of Israel') at +5, where a party is named. Default adopted: kept as filed (the party named decides the tier); only the Kenyan event is still within 730 days, and Kenya has no other B9 event in force, so +5 would add 3 points before decay. The author decides one reading.
- **Recognition rows** resting on a treaty with the State of Palestine (VAT, 2015) or on a Government notice relayed by the state daily (BWA): kept, flagged, as the rows resting on diplomatic relations (B-848 (6)).
- **Arabic General Debate files with broken text layers** (MRT 80th, IRQ 80th): quotes match the text as extracted; the author may wish to compare them with the PDF page images, as for Tunisia (B-673 (2)).
- **Signatories without the event outside these groups** (found while checking signatories; for P-23): Thailand on the leaders' statement of 6 June 2024 (group 23); Ireland, Norway, Slovenia and Spain on the statements of 16 May 2025 and 5 January 2026; Spain, Belgium and Slovenia on the letter of 14 December 2025 (full-protocol countries).

#### Not done in this session

- Leads were checked for sourcing and live URLs, not re-researched.
- The French summaries were read for gender, capitals and the glossary's terms; a native reader's pass stays with the author (Part 4, item 4).
- The joint-statement signatory gaps of countries outside groups 27 to 49 were not filed (P-23).

## Completion of 2026-11

The finish run of November 2026 (FINISH-PLAN.md Part 4, Phase C) returns to the light-protocol countries to fill the unchecked hand-researched indicators, search for new events and re-check leads. Each session appends a table here. Notes and statuses are in `data/assessments/{ISO3}.yaml` (header comment "Completion of 2026-11"); decisions are in docs/10.

### T-F-L01: NZL, KAZ, KGZ, TJK, TKM, UZB (2026-11-09, groups 1 and 2)

The session had no web search: the shared search allowance of the run was used up before it started (the first query answered "budget used up"). It worked on the Governments' own pages, the Wayback CDX and the Fund's published lists (FINISH-PLAN Part 3 rule 2), as T-F-W7 to W9 did. No event was filed: nothing new was found for the six countries from 5 October to 9 November 2026 on the pages that could be read. 4 sources archived and recorded (B-927).

| Country | Filled (none-found, `checked_at` 2026-11-09) | Notes extended | Still unchecked |
|---|---|---|---|
| NZL | A3, A5, A7, A8, C6 (new); C4, C5 rewritten on primary documents | D2 (closes the seed-list question, B-927) | C2, E1, E2, E3 |
| KAZ | A3 | B9 (akorda.kz read for 5 October to 9 November) | A5 to A8, B8, C1, C4 to C6, E1 to E3 |
| KGZ | A3 | none (the Ministry answers HTTP 502; president.kg loads its items by script) | A5 to A8, B8, C1, C4 to C6, E1 to E3 |
| TJK | A3 | B9 (mfa.tj/en, the President's items of 1 September to 7 November) | A5 to A8, B8, C4 to C6, E1 to E3 |
| TKM | A3 | none (mfa.gov.tm/en/news, first two pages, no passage on Gaza) | A5 to A8, B8, C4 to C6, E1 to E3 |
| UZB | A3 | B9 (president.uz items 9715 to 9831: one passage not filed, B-928) | A5 to A8, B8, C4 to C6, E1 to E3 |

B8 is a generated indicator and was not touched. The six countries' leads (8 in all) stay open: none has a primary copy that could be archived with the tools available (B-929).

| Source id | What | Used for |
|---|---|---|
| src_20240722_mfat_letter-minto-psn | The Minister of Foreign Affairs' letter of 22 July 2024 with Annex 1 | NZL A3, A5, A7, A8, C4, C6, D2 |
| src_20250304_mfat_oia-29917-trade-israel | Ministry's OIA response of 4 March 2025 (labelling: information does not exist) | NZL C4 |
| src_20231231_nzsuperfund_exclusions-list-december-2023 | NZ Super Fund exclusions at 31 December 2023 | NZL C5 |
| src_20260630_nzsuperfund_exclusions-list-june-2026 | NZ Super Fund exclusions at 30 June 2026 | NZL C5 |

Score effect: none (none-found entries carry no points; no event was added). Provisional previews are unchanged.

### T-F-L02: MNG, PRK, BGR, BLR, MDA, ROU (2026-11-09, groups 3 and 4)

The session had no web search (the first query answered that the run's shared allowance was used up, as for T-F-L01). It worked on the Governments' own pages, the UN's General Debate files and the Council's press list (routes and refusals in docs/10 B-930). No event was filed and no existing event changed: for 5 October to 9 November 2026 nothing that names Gaza was found for the six countries on the pages that could be read, and the 81st-session statements (22 to 28 September 2026) of all six were read (ROU and BGR again, as T-P23-1 had read them) without a ceasefire call, a call to end restrictions on aid or a named violation. 4 sources archived and recorded, 3 failed index rows removed by exact id (B-931).

| Country | Filled (`checked_at` 2026-11-09) | Notes extended | Still unchecked |
|---|---|---|---|
| MNG | A3, A5, A6, A7, A8, C4 (none-found; the Cabinet's site search returns nothing for Israel, Palestine, Gaza, Hamas, Middle East in Mongolian and English) | B9 (81st statement; Cabinet search) | C5, C6, E1 to E3 |
| PRK | A3, A5, A6, A7, A8, C4 (none-found); C5, C6 (no-data) | B9 (81st statement: no passage on Gaza) | E1 to E3 |
| BGR | A3, A5, A6, A7, A8, C4 (none-found; the Council of Ministers' record of 162 meetings since 7 October 2023 and the export-control portal) | B9 (81st statement; the 16 July 2026 readout, new lead BGR_1) | C5, C6, E1 to E3 |
| BLR | A3 (none-found) | B9 (81st statement; the President's site, 48 items of the window) | A5 to A8, C4 to C6, E1 to E3 |
| MDA | A3 (none-found) | B9 (81st statement; the Ministry's 189 releases of 26 May to 9 November 2026 and the Government's 1,015 of 20 November 2024 to 9 November 2026) | A5 to A8, C4 to C6, E1 to E3 |
| ROU | A3, A5 (none-found; the Ministry of National Defence's 1,570 releases) | B9, D4 (Ministry of National Defence's release no. 278 of 31 August 2026) | A6 to A8, C4 to C6, E1 to E3 |

B8 is a generated indicator and was not touched; none of the six has a row in `recognitions.csv` (a state document is needed, B-933 (2)).

| Source id | What | Used for |
|---|---|---|
| src_20260923_un-gadebate_rou-dan-81-en | President Dan's General Debate statement, 81st session (Wayback capture of 22 October 2026) | ROU B9 note (no event) |
| src_20260923_un-gadebate_bgr-iotova-81-fr | President Iotova's General Debate statement, 81st session, French (Wayback capture of 22 October 2026) | BGR B9 note (no event) |
| src_20260716_gov-bg_radev-majdalani-gaza | Council of Ministers' news item of 16 July 2026 on the Prime Minister's meeting with the Palestinian President's special envoy | lead_20261109_BGR_1 (B9, R4) |
| src_20240830_gov-bg_ms-zasedanie-30-08-2024 | Council of Ministers' record of its meeting of 30 August 2024 (draft plan of cooperation with Israel's Ministry of Health) | lead_20261005_BGR_3 (C2, R18) |

Leads: new `lead_20261109_BGR_1`; all twelve earlier leads of the six (ROU 1 to 4, BGR 1 to 4, BLR 1, MDA 1 and 2, PRK 1) annotated with the session's searches and kept open. Readings flagged for the author (B-932): the Radev readout, the Bulgarian health plan under R18, the Romanian flight of 31 August 2026 under R11, the DPRK's no-data and none-found, the thin evidence base of the Mongolian and Bulgarian none-found entries, the Romanian defence contacts under A5.

Score effect: none (no event was added or changed). Provisional previews (rc.1, 2026-11-09): MNG +1 Acting, PRK +1 Acting, BGR +7 Acting, BLR +14 Acting, MDA −11 Passive, ROU −11 Passive; they differ from the T-P21 tables of 5 October because of later Comtrade rows and decay.

### T-F-L02, second session: MNG, PRK, BGR, BLR, MDA, ROU (2026-11-09)

The second session had no web search either (the first query answered that the run's allowance of 200 calls per turn is used up). It found three official routes that the first session had not used: the Moldovan Government's full release listing (1,361 releases fetched and searched in full text), the Official Gazette's legislative portal of Romania (public search service) and the Bulgarian Prosecutor's Office site search (routes and refusals in docs/10 B-934). No event was filed and no existing event changed; no source was archived (the readings are of listings and search results, recorded in the notes with their queries).

| Country | Filled (`checked_at` 2026-11-09) | Notes extended | Still unchecked |
|---|---|---|---|
| MNG | C5, C6 (none-found; the Cabinet's site search, control queries answered) | none | E1 to E3 |
| PRK | E1, E2, E3 (no-data, as C5 and C6: no source for the State) | none | none |
| BGR | C5, C6 (none-found; Council of Ministers' record); E1, E3 (none-found; Prosecutor's Office site search) | none | E2 |
| BLR | none (president.gov.by, mfa.gov.md and the Council of Ministers' site did not answer or answered 403; the Foreign Ministry's news list is paged by a script call that answers a server error; the legal portals need a search form or a captcha) | none | A5 to A8, C4 to C6, E1 to E3 |
| MDA | A5, A6, A7, A8, C4, C5, C6 (none-found; the Government's 1,361 releases of 17 September 2024 to 5 November 2026: no mention of Gaza, Palestine, Hamas or UNRWA; ten releases name Israel, none on arms, transit, settlements, funds or procurement) | none | E1 to E3 |
| ROU | A6, A7, A8, C4, C5, C6 (none-found; the Official Gazette's portal: acts naming Gaza, Palestine, Hamas, the West Bank or Israel since 7 October 2023) | D5 (Government Decision no. 1155 of 2023 read, not filed, B-935) | E1 to E3 |

What the Romanian portal shows for acts of 7 October 2023 or later (read by title and text): Parliament's Declaration no. 2 of 11 October 2023 (solidarity with Israel), Government Decision no. 1155 of 23 November 2023 (emergency aid for persons evacuated from Gaza), no. 65 of 31 January 2024 and no. 795 of 11 July 2024 (humanitarian aid from the state reserves), Parliament Decision no. 8 of 22 April 2024 (Prosperity Guardian), Law no. 86 of 9 April 2024 (a day of solidarity and friendship with Israel), the National Strategy of 23 May 2024 against antisemitism. None concerns an embargo, licences, transit, settlement goods, procurement or a fund. What the Moldovan releases show for Israel: the recognition of driving licences (six releases), the Prime Minister's meeting with Israel's Foreign Minister on 4 February 2025 and his call with Mr Netanyahu on 25 August 2025 (B-935).

B8 (generated) and the pre-2023 recognition rows were not touched (a state document is needed). Leads: none opened, none closed. Score effect: none; provisional previews of the first session are unchanged (no event was added or changed; `--preview` not re-run).

### T-F-L03: SVK, UKR, ATG, BHS, BLZ, BRB (2026-11-09, groups 5 and 6)

The session had no web search (the first query answered that the run's shared allowance is used up). It read the Governments' own sites in full text through their public interfaces: the WordPress interface of the Ministries and Press Office of Barbados, the Bahamas and Belize (and the Bahamas' Customs and Antigua's Police Force), the Antigua Government's release and Cabinet Note pages, and the search services of the Slovak Government Office, Ministries of Defence and Economy and Prosecutor General's Office (routes and refusals in docs/10 B-937). Every Ukrainian official site refuses a script or the built-in browser (a CAPTCHA in the pane, not touched). No event was filed; for 6 October to 9 November 2026 nothing that qualifies was found on the pages read.

| Country | Filled (none-found, `checked_at` 2026-11-09) | Notes extended | Still unchecked |
|---|---|---|---|
| SVK | A3, A5, A6, A7, A8, C4, C5, C6, E1, E2, E3 (Government Office search: 44 pages; Ministry of Defence, Economy and Prosecutor General's searches) | B9, B10, C1 (the Prime Minister's own releases, five archived) | B8 |
| UKR | A3 | B9 lead (sites still refuse) | A5 to A8, C4 to C6, E1 to E3, B8 |
| ATG | A3, A5, A6, A7, A8, C4, C5, C6, E1, E2, E3 (Government releases 2025 and 2026, 19 Cabinet Notes of 2026, Police Force site) | B9; B8 now has-events (2011 General Debate statement) | none |
| BHS | A3, A5, A6, A7, A8, C4, C5, C6, E1, E2, E3 (Ministry: 1,818 posts; Customs: 277 posts and 99 pages) | B9 | none |
| BLZ | A3, A5, A6, A7, A8, C4, C5, C6, E1, E2, E3 (Press Office: 2,553 releases; Ministry: 60 items) | B9 | none |
| BRB | A3, A5, A6, A7, A8, C4, C5, C6, E1, E2, E3 (Ministry: 431 items and 92 pages) | B9 | none |

| Source id | What | Used for |
|---|---|---|
| src_20250625_vlada-sk_fico-netanyahu-call | Prime Minister Fico's release on his call with Mr Netanyahu, 25 June 2025 | SVK C1, A6, A7, lead_20261006_SVK_3 |
| src_20260304_vlada-sk_vlada-energeticka-bezpecnost | Government meeting of 4 March 2026 (denial of combat-aircraft overflights, Iran conflict) | SVK A5, A8 (flagged, not an instance) |
| src_20241018_vlada-sk_fico-samit-eu-blizky-vychod | Prime Minister's statement of 18 October 2024 (indirect speech) | lead_20261109_SVK_6 |
| src_20240201_vlada-sk_fico-rada-gaza | Prime Minister's statement of 1 February 2024 | lead_20261109_SVK_6 |
| src_20240322_vlada-sk_fico-rada-bosna-gaza | Prime Minister's statement of 22 March 2024 (indirect speech) | SVK B10 note |
| src_20260923_un-gadebate_svk-pellegrini-81-en | President Pellegrini's General Debate statement, 81st session (Wayback capture of 22 October 2026) | SVK B9 note (no event) |
| src_20250910_foreign-gov-bb_statement-gulf-region | Barbados Ministry's statement of 10 September 2025 (no speaker named) | lead_20261109_BRB_2 |
| src_20110924_un-gadebate_atg-spencer-66-en | Antigua and Barbuda's General Debate statement, 66th session (24 September 2011; Wayback capture of 18 July 2021) | ATG B8 (`recognitions.csv` row) |

Leads: new `lead_20261109_SVK_6` (B9, the Prime Minister's statements of 2024) and `lead_20261109_BRB_2` (B9, a Government statement without a speaker); `lead_20261006_SVK_3` extended with the Prime Minister's own archived release; SVK 1, UKR 1, BRB 1, BHS 1, BLZ 2 and ATG 2 annotated with the session's searches; the rest stay open. Readings flagged for the author (B-938): the Barbados statement of 10 September 2025 under R3, the Slovak Prime Minister's statements, the overflight denial of 4 March 2026, the thin evidence base of the none-found entries.

Score effect: ATG +3 (B8, the pre-existing tier, from the row added with a state document); none-found entries carry no points and no event was added. Provisional previews (rc.1, 2026-11-09): SVK −1 Passive, UKR +5 Acting, ATG −1 Passive, BHS +9 Acting, BLZ +24 Acting, BRB +14 Acting.

### T-F-L04: CRI, CUB, DMA, DOM, ECU, GRD (2026-11-09, groups 7 and 8)

The session had no web search (the first query answered that the run's shared allowance is used up). It read the Governments' own sites in full text through their public interfaces: eight Ecuadorian sites and the Dominican Ministry of Foreign Affairs through WordPress (4,068 and 825 posts), the Dominican, Costa Rican, Dominican-Police and Ecuadorian financial sites through their search, the Joomla search service of Dominica's portal, the pages of Grenada's portal, and the Cuban Ministry of Foreign Affairs' site, which answered from outside Cuba on that day (routes and refusals in docs/10 B-940). Two events were filed, both Cuban, from the Ministry's own pages; no other event was added or changed.

| Country | Filled (none-found, `checked_at` 2026-11-09) | Notes extended | Still unchecked |
|---|---|---|---|
| CRI | A3, A5, A6, A7, A8, C4, C5, C6, E1, E2, E3 (Presidency, Procuraduría, Public Security and Foreign Trade as far as they answer; the Ministry of Foreign Affairs answered 403) | B8 (63rd-session statement read, no recognition) | B8 (generated) |
| CUB | A3, A5, A6, A7, A8, C4, C5, C6, E1, E2, E3 (Ministry of Foreign Affairs: 237 items listed, 169 read in full, site search) | B9 (new events); B8 as generated | none |
| DMA | A3, A5, A6, A7, A8, C4, C5, C6, E1, E2, E3 (search service of the Government's portal) | B8 (66th-session statement read, no passage on Palestine) | B8 (generated) |
| DOM | A3, A5, A6, A7, A8, C4, C5, C6, E1, E2, E3 (Ministry of Foreign Affairs: 825 posts; Police and Interior by search) | none | none |
| ECU | A3, A5, A6, A7, A8, C4, C5, C6, E1, E2, E3 (eight Government sites, 4,068 posts) | C2 (JETCO of 15 July 2026 read, no instrument) | none |
| GRD | A3, A5, A6, A7, A8, C4, C5, C6, E1, E2, E3 (Government portal, Finance news, Customs home page) | B8 (66th-session statement read, no recognition) | B8 (generated) |

| Event | Indicator | Date | Points | Confidence | Source kind |
|---|---|---|---|---|---|
| evt_2026_09_25_CUB_B9 | B9 | 2026-09-25 | +5 | confirmed | official |
| evt_2026_07_30_CUB_B9 | B9 | 2026-07-30 | +5 (a digression in a speech on the United States' blockade, flagged) | confirmed | official |

| Source id | What | Used for |
|---|---|---|
| src_20260925_cubaminrex_rodriguez-grupo-haya-es | The Foreign Minister's intervention at the Hague Group's high-level meeting, New York, 25 September 2026 (Ministry's Spanish text; Save Page Now, replay equal) | evt_2026_09_25_CUB_B9 |
| src_20260730_cubaminrex_diaz-canel-clausura-anpp-es | The President's closing speech of the National Assembly's session, 30 July 2026 (stenographic version on the Ministry's site; Save Page Now, replay equal) | evt_2026_07_30_CUB_B9 |

No pre-2023 recognition row was added: the General Debate statements read for Costa Rica (63rd session, the President), Dominica (66th) and Grenada (66th) state no recognition (R21); B8 is generated and was not hand-authored.

Leads: `lead_20261006_CUB_1` promoted to the first event; `lead_20261006_CUB_2` (the Ministry's own text names the Palestinian people and never Gaza: R7), `_3` and `_4`, ECU 1 to 3, CRI 1 to 3 and DMA 1 and 2 re-checked on the official sites and kept open. Readings flagged for the author (B-941): the Cuban President's speech of 30 July 2026 as a B9 event; the Cuban Foreign Minister's statements of 1 October 2025 and 9 July 2026 and the President's of 26 July and 14 August 2026, read and not filed; Ecuador's Defence releases on Israeli vehicles and the pledge of 6 May 2025 (not A5); the JETCO meeting of 15 July 2026 (not C2); the thin evidence base of the none-found entries.

Score effect: CUB +29.0 Acting before the two events (the event of 15 October 2025 is 390 days old, so the passivity penalty applied) and +44.3 Confronting with them. Provisional previews (rc.1, 2026-11-09): CRI −1 Passive, CUB +44 Confronting, DMA −16 Passive, DOM +7 Acting, ECU −14 Passive, GRD −15 Passive.

### T-F-L05: GTM, GUY, HND, HTI, JAM, KNA (2026-11-09, groups 9 and 10)

The session had no web search (the first query answered that the run's shared allowance is used up). It read the Governments' own sites in full text through their public interfaces: the WordPress interfaces of Guatemala's Presidency, Interior Ministry and Public Prosecutor, of Guyana's Department of Public Information, Haiti's Prime Minister's office, Jamaica's Office of the Prime Minister, Saint Kitts and Nevis's Information Service and Ministry, and Honduras's Foreign Ministry (which holds only 29 items for the period); the Drupal search of Guyana's Ministry of Foreign Affairs and Honduras's Defence Secretariat; and the searches of the Jamaica Information Service, Police and Finance sites and of several Haitian and Honduran ministries (routes and refusals in docs/10 B-943). No event was filed, no event changed and no lead changed status: nothing new that names Gaza was found for the six countries from 6 October to 9 November 2026 on the pages that could be read.

| Country | Filled (none-found, `checked_at` 2026-11-09) | Notes extended | Still unchecked |
|---|---|---|---|
| GTM | A3, A5, A6, A7, A8, C4, C5, C6, E1, E2, E3 (Presidency, Interior and Public Prosecutor by WordPress interface; Economy by search; Ministry of Foreign Affairs 403) | B9 (Presidency's posts re-read) | B8 (generated) |
| GUY | A3, A5, A6, A7, A8, C4, C5, C6, E1, E2, E3 (DPI posts and the Ministry's site search; Defence Force, Revenue Authority, Finance, Home Affairs by search) | B9 (address of 24 September 2026 read: no Gaza, R7) | none |
| HND | A3, A5, A6, A7, A8, C4, C5, C6, E1, E2, E3 (Foreign Ministry's 29 items; Defence Secretariat, Public Prosecutor, Finance, pension, Central Bank by search) | C2 (no page on the two instruments) | none |
| HTI | A3, A5, A6, A7, A8, C4, C5, C6, E1, E2, E3 (Prime Minister's office, 280 posts to February 2025; Central Bank, customs, Justice, Finance by search; the Ministry of Foreign Affairs' site cannot be read) | none | none |
| JAM | A3, A5, A6, A7, A8, C4, C5, C6, E1, E2, E3 (Office of the Prime Minister, 788 posts; Information Service, Police, Prosecutions, Justice, Defence Force, Finance by search) | B9 (full text of the address of 26 September 2025: no Gaza, R7) | none |
| KNA | A3, A5, A6, A7, A8, C4, C5, C6, E1, E2, E3 (Information Service and Ministry by WordPress interface) | B9 (Ministry's statement of 2 March 2026: no Gaza) | none |

B8 is a generated indicator and was not touched. The thin base of the none-found entries (Haiti, Honduras, Guatemala, Saint Kitts and Nevis) is flagged in docs/10 B-945.

No pre-2023 recognition row was added: Guatemala's state document of April 2013 was not found (the Ministry answers 403; the Wayback window of 9 April to 31 May 2013 lists no page that names Palestine). Rows of Guyana, Honduras and Haiti still rest on UN documents.

Leads: all seven re-checked and kept open (`lead_20261006_GTM_1`, `_2`, `GUY_1`, `HND_1`, `_2`, `JAM_1`, `_2`): the Jamaican Prime Minister's address of 26 September 2025 is published in full on the Office's site and says 'the Palestinian Territories', never Gaza (R7); the Honduran General Debate file has no served Wayback replay and the verbatim record needs a script-loaded viewer. Readings flagged for the author (B-944): none filed; Guyana's address of 24 September 2026 and Guatemala's Interior Minister's meeting of 5 November 2025 read and not filed; the R7 decision for 'the Palestinian territories' (Jamaica, Nicaragua, Uruguay).

Score effect: none (no event added). Provisional previews (rc.1, 2026-11-09): GTM −1 Passive, GUY +13 Acting, HND +1 Acting, HTI −12 Passive, JAM +5 Acting, KNA +9 Acting.
