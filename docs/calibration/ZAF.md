# Calibration worksheet: South Africa (ZAF)

Computed on 2026-09-30 with methodology 1.0.0-rc.1, by `pnpm calibrate --date 2026-09-30 --fts` (P-15, docs/08 §3). **Provisional**: none of this country's hand-written events is published yet; the 526 events at status `reviewed` are scored as if published (the `--preview` reading of docs/06 §4), and the one `draft` event of the dataset is left out. The numbers change when the author reviews and publishes the events, and when the incomplete structured tables below are imported; P-22 re-runs this worksheet on the published dataset before the score is shown.

**Score +52.6 → display +53 (Confronting)**, position 7 of 193 scored entities (148 of which have only generated events so far). Passivity: not applied (qualifying: `evt_2026_02_23_ZAF_B9`, `evt_2026_09_01_ZAF_D1_fts`).

## Worksheet

One row per event in force on the date (counted, or set aside by a stacking rule), and one row per scored indicator without an event in force, with its assessment status. Points are shown as p × w × d = contribution (docs/02 §3–§4); generated events come from the structured tables (D-08).

| Indicator | Event(s) | Points | Confidence | Source (primary) | Notes |
|---|---|---|---|---|---|
| A1 | — | — | — | — | unchecked; no SIPRI release imported (docs/10 B-187, B-900–B-904) |
| A2 | `evt_2025_02_21_ZAF_A2_comtrade-2024-mirror`: The country exported USD 4,000 of goods under HS 93 to Israel in 2024, per Israel's report to UN Comtrade. | 0.0 × 1.0 × 1 = 0.00 | confirmed | `src_20260928_comtrade_mirror-2024-fra-aze-41` (dataset) | computed, 2025-02-21 to open; generated |
| A3 | — | — | — | — | none found |
| A4 | — | — | — | — | unchecked; no SIPRI release imported (docs/10 B-187, B-900–B-904) |
| A5 | — | — | — | — | none found |
| A6 | — | — | — | — | none found |
| A7 | — | — | — | — | none found |
| A8 | — | — | — | — | none found |
| B1 | `evt_2024_12_11_ZAF_B1_es-10-25`: The country voted yes on General Assembly resolution A/RES/ES-10/25. | +3.0 × 1.0 × 0.3979 = +1.19 | confirmed | `src_20260928_undl_ga-voting-2025-03-31-corr1` (dataset) | dated 2024-12-11; generated |
| B1 | `evt_2024_12_11_ZAF_B1_es-10-26`: The country voted yes on General Assembly resolution A/RES/ES-10/26. | +3.0 × 1.0 × 0.3979 = +1.19 | confirmed | `src_20260928_undl_ga-voting-2025-03-31-corr1` (dataset) | dated 2024-12-11; generated |
| B1 | `evt_2024_12_19_ZAF_B1_79-232`: The country voted yes on General Assembly resolution A/RES/79/232. | +3.0 × 1.0 × 0.4144 = +1.24 | confirmed | `src_20260928_undl_ga-voting-2025-03-31-corr1` (dataset) | dated 2024-12-19; generated |
| B2 | — | — | — | — | not applicable |
| B3 | `evt_2023_12_29_ZAF_B3`: The government filed an application instituting proceedings against Israel at the ICJ under the Genocide Convention in relation to Palestinians in the Gaza Strip. | +15.0 × 1.0 × 1 = +15.00 | confirmed | `src_20231229_icj_192-press-application` (court) | standing, 2023-12-29 to open |
| B4 | — | — | — | — | none found |
| B5 | `evt_2024_11_21_ZAF_B5`: The Minister of Justice welcomed the ICC arrest warrants for Netanyahu and Gallant and stated that States Parties would fulfil their obligations by enforcing them. | +8.0 × 1.0 × 1 = +8.00 | confirmed | `src_20241121_doj-za_minister-icc-warrants` (official) | standing, 2024-11-21 to open |
| B6 | — | — | — | — | none found |
| B7 | — | — | — | — | none found |
| B8 | — | — | — | — | unchecked |
| B9 | `evt_2025_09_23_ZAF_B9`: The President used the term genocide for Israel's conduct in Gaza at the UN General Assembly, citing the finding of the UN Commission of Inquiry. | +5.0 × 1.0 × 0.9856 = +4.93 | confirmed | `src_20250923_gov-za_ramaphosa-unga80-general-debate` (official) | dated 2025-09-23 |
| B9 | `evt_2026_02_23_ZAF_B9`: The Minister of International Relations and Cooperation called at the Human Rights Council for an end to the occupation and used the term genocide for the situation in Gaza. | +5.0 × 1.0 × 1.0000 = +5.00 | confirmed | `src_20260223_dirco_lamola-hrc61-national-statement` (official) | dated 2026-02-23; qualifies against passivity |
| B10 | — | — | — | — | none found |
| B11 | — | — | — | — | none found |
| B12 | `evt_2023_11_06_ZAF_B12`: Cabinet recalled all South African diplomats from Tel Aviv for consultation, citing the airstrikes on Gaza and the closure of humanitarian corridors. | +5.0 × 1.0 × 1 = +5.00 | confirmed | `src_20231106_gov-za_cabinet-statement-1-nov-2023` (official) | standing, 2023-11-06 to open |
| C1 | — | — | — | — | none found |
| C2 | — | — | — | — | none found |
| C3 | `evt_2026_02_10_ZAF_C3_comtrade-2025-self`: The country traded goods worth USD 409.1 million with Israel in 2025, 69% of its 2022 level, per its report to UN Comtrade. | 0.0 × 1.0 × 1 = 0.00 | confirmed | `src_20260928_comtrade_zaf-self-2025` (dataset) | computed, 2026-02-10 to open; generated |
| C4 | — | — | — | — | none found |
| C5 | — | — | — | — | none found |
| C6 | — | — | — | — | none found |
| D1 | `evt_2026_09_01_ZAF_D1_fts`: The government paid or committed USD 2.9 million to the oPt flash appeals in the 12 months to 31 August 2026, per FTS. | +3.0 × 1.0 × 1 = +3.00 | confirmed | `src_20260928_fts_plan-1186-p1` (dataset) | computed, 2026-09-01 to 2026-10-01; qualifies against passivity; generated |
| D2 | — | — | — | — | none found |
| D3 | `evt_2024_12_31_ZAF_D3`: The government's contribution to UNRWA in 2024 exceeded its 2022 contribution, per UNRWA's donor tables for both years. | +8.0 × 1.0 × 1 = +8.00 | confirmed | `src_20241231_unrwa_donor-ranking-2024` (dataset) | standing, 2024-12-31 to open |
| D4 | — | — | — | — | none found |
| D5 | — | — | — | — | none found |

## Score by category

| Category | Sum of indicators | Cap | Clipped |
|---|---|---|---|
| A Arms & military | 0.00 | −45 … +30 | 0.00 |
| B Diplomacy & international law | +41.56 | −40 … +45 | +41.56 |
| C Trade & economy | 0.00 | −20 … +20 | 0.00 |
| D Humanitarian | +11.00 | −15 … +25 | +11.00 |

raw = 0.00 +41.56 0.00 +11.00 − 0 (passivity) = +52.56; S = clip(raw, −100, +100) = +52.56; display +53; band Confronting (docs/02 §7: Sustaining ≤ −51, Enabling −50…−21, Passive −20…0, Acting 1…40, Confronting ≥ 41).

## What drives this score

1. **B3 +15.00**: `evt_2023_12_29_ZAF_B3`.
2. **B9 +9.93**: `evt_2025_09_23_ZAF_B9`, `evt_2026_02_23_ZAF_B9`.
3. **B5 +8.00**: `evt_2024_11_21_ZAF_B5`.

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
- B8 is `unchecked`: recognitions.csv has no row for ZAF. The registry dates its recognition 1995-02-15 (A/78/846, a lead, B-199 (3)); a row confirmed from the state's own document would add the pre-existing tier +3 from 2023-10-07: display +53 → +56 on 2026-09-30.

## Effect of the proposals on this country

Display score on 2026-09-30 under each proposal measured in docs/calibration/README.md §4 (rc.1: +53, Confronting); the last column gives the largest change of this country's display score at a quarter end since 2023-10-07.

| Proposal | Display (band) | Change | Largest change in the history |
|---|---|---|---|
| b21: official-video and parliamentary sources count for confirmed (B-21) | +53 (Confronting) | 0 | none |
| b22: most severe stacking for A3, A6, A7, B3, B7, D2 (B-22, B-51) | +53 (Confronting) | 0 | none |
| b23: B1 capped at +15 (B-23, one option) | +53 (Confronting) | 0 | none |
| b23-sym: B1 capped at −15 and +15 (B-23, symmetric option) | +53 (Confronting) | 0 | none |
| b46: only contributions of +2 or more qualify (B-46) | +53 (Confronting) | 0 | none |
| b47: pre-existing B8 tier does not qualify (B-47) | +53 (Confronting) | 0 | none |
| b48-alt: alternative to B-48: a standing state qualifies while it holds | +53 (Confronting) | 0 | none |
| b46+b47: B-46 and B-47 together | +53 (Confronting) | 0 | none |
| b8-pre: pre-existing recognitions of the registry as B8 +3 (B-199 (3) alternative) | +56 (Confronting) | +3 | +28 → +31 (2023-12-31) |
| b8-pre+b47: pre-existing B8 +3 rows, with B-47 | +56 (Confronting) | +3 | +28 → +31 (2023-12-31) |
| trade-no-2022: A2 and C3 values of data year 2022 not in force in the window (P-04, B-63) | +53 (Confronting) | 0 | +28 → +31 (2023-12-31) |
| d1-postwar: D1 from FTS flows dated on or after 2023-10-07 only (P-04, B-60) | +53 (Confronting) | 0 | none |
| proposal: the recommended set: B-21, B-22, B-23 (B1 within −15…+15), B-46, B-47, no 2022 trade values, D1 from post-war flows | +53 (Confronting) | 0 | +28 → +31 (2023-12-31) |

## Sensitivity (docs/02 §10)

Position among the 193 scored entities (1 = highest), display score and band under each sensitivity variant.

| Variant | Display (band) | Position |
|---|---|---|
| rc.1 default | +53 (Confronting) | 7 |
| passivity-5 | +53 (Confronting) | 7 |
| passivity-15 | +53 (Confronting) | 7 |
| passivity-25 | +53 (Confronting) | 7 |
| weight-A-0.5 | +53 (Confronting) | 7 |
| weight-A-1.5 | +53 (Confronting) | 7 |
| weight-B-0.5 | +32 (Acting) | 7 |
| weight-B-1.5 | +73 (Confronting) | 6 |
| weight-C-0.5 | +53 (Confronting) | 7 |
| weight-C-1.5 | +53 (Confronting) | 7 |
| weight-D-0.5 | +47 (Confronting) | 6 |
| weight-D-1.5 | +58 (Confronting) | 7 |
| reported-0.2 | +53 (Confronting) | 7 |
| reported-0.6 | +53 (Confronting) | 7 |
| statements-excluded | +43 (Confronting) | 7 |
| decay-off | +56 (Confronting) | 9 |

## Questions of the country session

The readings the ZAF session flagged are in docs/10 B-234; those it referred to P-15 are decided, for every country at once, in docs/calibration/README.md §6.
