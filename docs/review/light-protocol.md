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
