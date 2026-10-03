# Calibration worksheet: United Kingdom of Great Britain and Northern Ireland (GBR)

Computed on 2026-09-30 with methodology 1.0.0-rc.1, by `pnpm calibrate --date 2026-09-30 --fts` (P-15, docs/08 §3). **Provisional**: none of this country's hand-written events is published yet; the 526 events at status `reviewed` are scored as if published (the `--preview` reading of docs/06 §4), and the one `draft` event of the dataset is left out. The numbers change when the author reviews and publishes the events, and when the incomplete structured tables below are imported; P-22 re-runs this worksheet on the published dataset before the score is shown.

**Score +43.5 → display +43 (Confronting)**, position 8 of 193 scored entities (148 of which have only generated events so far). Passivity: not applied (qualifying: `evt_2025_11_18_GBR_B9`, `evt_2026_09_01_GBR_D1_fts`, `evt_2026_09_08_GBR_B9`).

## Worksheet

One row per event in force on the date (counted, or set aside by a stacking rule), and one row per scored indicator without an event in force, with its assessment status. Points are shown as p × w × d = contribution (docs/02 §3–§4); generated events come from the structured tables (D-08).

| Indicator | Event(s) | Points | Confidence | Source (primary) | Notes |
|---|---|---|---|---|---|
| A1 | — | — | — | — | unchecked; no SIPRI release imported (docs/10 B-187, B-900–B-904) |
| A2 | `evt_2026_03_10_GBR_A2_comtrade-2025-self`: The country exported USD 399,666 of goods under HS 93 to Israel in 2025, per its report to UN Comtrade. | −3.0 × 1.0 × 1 = −3.00 | confirmed | `src_20260928_comtrade_gbr-self-2025` (dataset) | computed, 2026-03-10 to open; generated |
| A3 | `evt_2023_10_07_GBR_A3`: The government stated that UK components for the multinational F-35 programme were excluded from its suspension of arms export licences to Israel, except those going directly to Israel. | −15.0 × 1.0 × 1 = −15.00 | confirmed | `src_20240902_gov-uk_suspends-30-licences-israel` (official) | standing, 2023-10-07 to open |
| A4 | — | — | — | — | unchecked; no SIPRI release imported (docs/10 B-187, B-900–B-904) |
| A5 | — | — | — | — | has events; 1 event(s) recorded, none in force on 2026-09-30 |
| A6 | `evt_2024_09_02_GBR_A6`: The Business and Trade Secretary suspended around 30 export licences to Israel for items assessed to be for use in military operations in Gaza. | +10.0 × 1.0 × 1 = +10.00 | confirmed | `src_20240902_gov-uk_suspends-30-licences-israel` (official) | standing, 2024-09-02 to open |
| A7 | — | — | — | — | none found |
| A8 | — | — | — | — | none found |
| B1 | `evt_2024_12_11_GBR_B1_es-10-25`: The country voted yes on General Assembly resolution A/RES/ES-10/25. | +3.0 × 1.0 × 0.3979 = +1.19 | confirmed | `src_20260928_undl_ga-voting-2025-03-31-corr1` (dataset) | dated 2024-12-11; generated |
| B1 | `evt_2024_12_11_GBR_B1_es-10-26`: The country voted yes on General Assembly resolution A/RES/ES-10/26. | +3.0 × 1.0 × 0.3979 = +1.19 | confirmed | `src_20260928_undl_ga-voting-2025-03-31-corr1` (dataset) | dated 2024-12-11; generated |
| B1 | `evt_2024_12_19_GBR_B1_79-232`: The country voted yes on General Assembly resolution A/RES/79/232. | +3.0 × 1.0 × 0.4144 = +1.24 | confirmed | `src_20260928_undl_ga-voting-2025-03-31-corr1` (dataset) | dated 2024-12-19; generated |
| B2 | — | — | — | — | none found |
| B3 | — | — | — | — | none found |
| B4 | — | — | — | — | none found |
| B5 | — | — | — | — | none found |
| B6 | — | — | — | — | none found |
| B7 | — | — | — | — | none found |
| B8 | `evt_2025_09_21_GBR_B8_recognition`: The country recognised the State of Palestine. | +8.0 × 1.0 × 1 = +8.00 | confirmed | `src_20250921_gov-uk_recognition-palestine` (official) | standing, 2025-09-21 to open; generated |
| B9 | `evt_2025_05_20_GBR_B9`: The Foreign Secretary told the House of Commons that civilians in Gaza faced starvation and that the Israeli government planned to drive Gazans into a corner of the Strip. | +5.0 × 1.0 × 0.7267 = +3.63 | confirmed | `src_20250520_gov-uk_fs-statement-israel-opts` (official) | dated 2025-05-20 |
| B9 | `evt_2025_07_25_GBR_B9`: The Prime Minister said the starvation and denial of aid in Gaza and Israel's military escalation were indefensible, and with the leaders of France and Germany called for an immediate ceasefire. | +5.0 × 1.0 × 0.8623 = +4.31 | confirmed | `src_20250725_gov-uk_pm-statement-gaza` (official) | dated 2025-07-25 |
| B9 | `evt_2025_09_23_GBR_B9`: The Foreign Secretary told the Security Council that children in Gaza were enduring a man-made famine and called for a ceasefire now and for Israel to unblock aid. | +5.0 × 1.0 × 0.9856 = +4.93 | confirmed | `src_20250923_gov-uk_cooper-unsc-gaza` (official) | dated 2025-09-23 |
| B9 | `evt_2025_11_18_GBR_B9`: The Foreign Secretary told the House of Commons that all land crossings into Gaza had to open and that the Israeli government must remove restrictions on aid. | +2.0 × 1.0 × 1.0000 = +2.00 | confirmed | `src_20251118_gov-uk_fs-statement-gaza-sudan` (official) | dated 2025-11-18; qualifies against passivity |
| B9 | `evt_2026_09_08_GBR_B9`: The Foreign Secretary told the House of Commons that aid to Gaza had been routinely blocked and cited reports, including by the UN Commission of Inquiry, on the conduct of the war. | +5.0 × 1.0 × 1.0000 = +5.00 | confirmed | `src_20260908_gov-uk_fs-oral-statement-israel-palestine` (official) | dated 2026-09-08; qualifies against passivity |
| B9 | indicator cap | sum +19.87 → +10.00 | | | indicator-level cap (docs/02 §2) |
| B10 | — | — | — | — | none found |
| B11 | `evt_2025_06_10_GBR_B11`: The Foreign Secretary, with the foreign ministers of Australia, Canada, New Zealand and Norway, announced sanctions on Israeli ministers Itamar Ben-Gvir and Bezalel Smotrich. | +10.0 × 1.0 × 1 = +10.00 | confirmed | `src_20250610_gov-uk_joint-statement-ben-gvir-smotrich` (official) | standing, 2025-06-10 to open |
| B12 | — | — | — | — | none found |
| C1 | `evt_2025_05_20_GBR_C1`: The Foreign Secretary announced that the UK had suspended negotiations with the Israeli government on a new free trade agreement and would review cooperation under the 2030 Bilateral Roadmap. | +4.0 × 1.0 × 1 = +4.00 | confirmed | `src_20250520_gov-uk_fs-statement-israel-opts` (official) | standing, 2025-05-20 to open |
| C2 | — | — | — | — | none found |
| C3 | `evt_2026_03_10_GBR_C3_comtrade-2025-self`: The country traded goods worth USD 3.7 billion with Israel in 2025, 72% of its 2022 level, per its report to UN Comtrade. | 0.0 × 1.0 × 1 = 0.00 | confirmed | `src_20260928_comtrade_gbr-self-2025` (dataset) | computed, 2026-03-10 to open; generated |
| C4 | — | — | — | — | none found |
| C5 | — | — | — | — | none found |
| C6 | — | — | — | — | none found |
| D1 | `evt_2026_09_01_GBR_D1_fts`: The government paid or committed USD 79.8 million to the oPt flash appeals in the 12 months to 31 August 2026, per FTS. | +6.0 × 1.0 × 1 = +6.00 | confirmed | `src_20260928_fts_plan-1186-p1` (dataset) | computed, 2026-09-01 to 2026-10-01; qualifies against passivity; generated |
| D2 | — | — | — | — | has events; 1 event(s) recorded, none in force on 2026-09-30 |
| D3 | `evt_2024_07_19_GBR_D3`: The Foreign Secretary announced that the UK would lift its pause on funding to UNRWA and release £21 million for its work. | +5.0 × 1.0 × 1 = +5.00 | confirmed | `src_20240719_gov-uk_restart-unrwa-funding` (official) | standing, 2024-07-19 to open |
| D4 | `evt_2025_09_17_GBR_D4`: The government evacuated a first group of severely ill children from Gaza, with their immediate families, for treatment in NHS hospitals. | +5.0 × 1.0 × 0.9733 = +4.87 | confirmed | `src_20250917_gov-uk_gazan-children-nhs` (official) | dated 2025-09-17 |
| D5 | — | — | — | — | none found |

## Score by category

| Category | Sum of indicators | Cap | Clipped |
|---|---|---|---|
| A Arms & military | −8.00 | −45 … +30 | −8.00 |
| B Diplomacy & international law | +31.63 | −40 … +45 | +31.63 |
| C Trade & economy | +4.00 | −20 … +20 | +4.00 |
| D Humanitarian | +15.87 | −15 … +25 | +15.87 |

raw = −8.00 +31.63 +4.00 +15.87 − 0 (passivity) = +43.50; S = clip(raw, −100, +100) = +43.50; display +43; band Confronting (docs/02 §7: Sustaining ≤ −51, Enabling −50…−21, Passive −20…0, Acting 1…40, Confronting ≥ 41).

## What drives this score

1. **A3 −15.00**: `evt_2023_10_07_GBR_A3`.
2. **A6 +10.00**: `evt_2024_09_02_GBR_A6`.
3. **B11 +10.00**: `evt_2025_06_10_GBR_B11`.

## Does the band feel right?

Three readings, left blank for human readers (docs/08 §3). Each reader states the band they would expect, whether this one feels right, and why, without editing the events.

### (a) A reader who thinks most governments have failed

- Reader:
- Date:
- Band expected:
- Does the band feel right?
- Why:

### (b) A reader who thinks Israel’s campaign is justified

- Reader:
- Date:
- Band expected:
- Does the band feel right?
- Why:

### (c) A reader who does not follow the topic

- Reader:
- Date:
- Band expected:
- Does the band feel right?
- Why:

## Incomplete inputs

- A1 and A4 are `unchecked`: no SIPRI release is imported (docs/10 B-187, B-199 (2), B-900–B-904). A1 moves for the countries SIPRI lists as suppliers to Israel; A4 for buyers of Israeli arms.
- B1 counts 7 of the 12 qualifying votes (to December 2024, B-186); the five votes of June to December 2025 are not imported. On this date each would add +3 × d (yes), −5 × d (no) or −2 × d (abstain or absent), d = 0.774, 0.963, 0.977, 1, 1 (ES-10/27, A/DEC/80/506, 80/1, 80/78, 80/116): between +14.1 (yes on all five) and −23.6 (no on all five) before the category B cap.

## Effect of the proposals on this country

Display score on 2026-09-30 under each proposal measured in docs/calibration/README.md §4 (rc.1: +43, Confronting); the last column gives the largest change of this country's display score at a quarter end since 2023-10-07.

| Proposal | Display (band) | Change | Largest change in the history |
|---|---|---|---|
| b21: official-video and parliamentary sources count for confirmed (B-21) | +43 (Confronting) | 0 | none |
| b22: most severe stacking for A3, A6, A7, B3, B7, D2 (B-22, B-51) | +43 (Confronting) | 0 | none |
| b23: B1 capped at +15 (B-23, one option) | +43 (Confronting) | 0 | none |
| b23-sym: B1 capped at −15 and +15 (B-23, symmetric option) | +43 (Confronting) | 0 | none |
| b46: only contributions of +2 or more qualify (B-46) | +43 (Confronting) | 0 | none |
| b47: pre-existing B8 tier does not qualify (B-47) | +43 (Confronting) | 0 | none |
| b48-alt: alternative to B-48: a standing state qualifies while it holds | +43 (Confronting) | 0 | none |
| b46+b47: B-46 and B-47 together | +43 (Confronting) | 0 | none |
| b8-pre: pre-existing recognitions of the registry as B8 +3 (B-199 (3) alternative) | +43 (Confronting) | 0 | none |
| b8-pre+b47: pre-existing B8 +3 rows, with B-47 | +43 (Confronting) | 0 | none |
| trade-no-2022: A2 and C3 values of data year 2022 not in force in the window (P-04, B-63) | +43 (Confronting) | 0 | −29 → −21 (2023-12-31) |
| d1-postwar: D1 from FTS flows dated on or after 2023-10-07 only (P-04, B-60) | +43 (Confronting) | 0 | none |
| proposal: the recommended set: B-21, B-22, B-23 (B1 within −15…+15), B-46, B-47, no 2022 trade values, D1 from post-war flows | +43 (Confronting) | 0 | −29 → −21 (2023-12-31) |

## Sensitivity (docs/02 §10)

Position among the 193 scored entities (1 = highest), display score and band under each sensitivity variant.

| Variant | Display (band) | Position |
|---|---|---|
| rc.1 default | +43 (Confronting) | 8 |
| passivity-5 | +43 (Confronting) | 8 |
| passivity-15 | +43 (Confronting) | 8 |
| passivity-25 | +43 (Confronting) | 8 |
| weight-A-0.5 | +47 (Confronting) | 8 |
| weight-A-1.5 | +39 (Acting) | 9 |
| weight-B-0.5 | +28 (Acting) | 8 |
| weight-B-1.5 | +59 (Confronting) | 8 |
| weight-C-0.5 | +41 (Confronting) | 8 |
| weight-C-1.5 | +45 (Confronting) | 8 |
| weight-D-0.5 | +36 (Acting) | 9 |
| weight-D-1.5 | +51 (Confronting) | 8 |
| reported-0.2 | +43 (Confronting) | 8 |
| reported-0.6 | +43 (Confronting) | 8 |
| statements-excluded | +33 (Acting) | 8 |
| decay-off | +41 (Confronting) | 21 |

## Questions of the country session

The readings the GBR session flagged are in docs/10 B-215; those it referred to P-15 are decided, for every country at once, in docs/calibration/README.md §6.
