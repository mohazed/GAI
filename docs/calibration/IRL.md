# Calibration worksheet: Ireland (IRL)

Computed on 2026-09-30 with methodology 1.0.0-rc.1, by `pnpm calibrate --date 2026-09-30 --fts` (P-15, docs/08 §3). **Provisional**: none of this country's hand-written events is published yet; the 526 events at status `reviewed` are scored as if published (the `--preview` reading of docs/06 §4), and the one `draft` event of the dataset is left out. The numbers change when the author reviews and publishes the events, and when the incomplete structured tables below are imported; P-22 re-runs this worksheet on the published dataset before the score is shown.

**Score +68.1 → display +68 (Confronting)**, position 3 of 193 scored entities (148 of which have only generated events so far). Passivity: not applied (qualifying: `evt_2025_12_14_IRL_B9`, `evt_2026_04_17_IRL_B9`, `evt_2026_06_05_IRL_B11`, `evt_2026_09_01_IRL_D1_fts`).

## Worksheet

One row per event in force on the date (counted, or set aside by a stacking rule), and one row per scored indicator without an event in force, with its assessment status. Points are shown as p × w × d = contribution (docs/02 §3–§4); generated events come from the structured tables (D-08).

| Indicator | Event(s) | Points | Confidence | Source (primary) | Notes |
|---|---|---|---|---|---|
| A1 | — | — | — | — | unchecked; no SIPRI release imported (docs/10 B-187, B-900–B-904) |
| A2 | — | — | — | — | none found |
| A3 | — | — | — | — | none found |
| A4 | — | — | — | — | unchecked; no SIPRI release imported (docs/10 B-187, B-900–B-904) |
| A5 | — | — | — | — | none found |
| A6 | — | — | — | — | none found |
| A7 | — | — | — | — | none found |
| A8 | — | — | — | — | none found |
| B1 | `evt_2024_12_11_IRL_B1_es-10-25`: The country voted yes on General Assembly resolution A/RES/ES-10/25. | +3.0 × 1.0 × 0.3979 = +1.19 | confirmed | `src_20260928_undl_ga-voting-2025-03-31-corr1` (dataset) | dated 2024-12-11; generated |
| B1 | `evt_2024_12_11_IRL_B1_es-10-26`: The country voted yes on General Assembly resolution A/RES/ES-10/26. | +3.0 × 1.0 × 0.3979 = +1.19 | confirmed | `src_20260928_undl_ga-voting-2025-03-31-corr1` (dataset) | dated 2024-12-11; generated |
| B1 | `evt_2024_12_19_IRL_B1_79-232`: The country voted yes on General Assembly resolution A/RES/79/232. | +3.0 × 1.0 × 0.4144 = +1.24 | confirmed | `src_20260928_undl_ga-voting-2025-03-31-corr1` (dataset) | dated 2024-12-19; generated |
| B2 | — | — | — | — | not applicable |
| B3 | `evt_2025_01_06_IRL_B3`: The government filed a declaration of intervention under Article 63 in the ICJ case South Africa v. Israel on the Genocide Convention in the Gaza Strip. | +15.0 × 1.0 × 1 = +15.00 | confirmed | `src_20250107_icj_192-press-ireland` (court) | standing, 2025-01-06 to open |
| B4 | — | — | — | — | none found |
| B5 | `evt_2024_11_22_IRL_B5`: The Taoiseach stated that Ireland would arrest Benjamin Netanyahu under the International Criminal Court warrant if he came to Ireland. | +8.0 × 0.7 × 1 = +5.60 | corroborated | `src_20241122_dailystar_ireland-would-arrest-netanyahu` (press) | standing, 2024-11-22 to open |
| B6 | — | — | — | — | none found |
| B7 | — | — | — | — | none found |
| B8 | `evt_2024_05_28_IRL_B8_recognition`: The country recognised the State of Palestine. | +8.0 × 1.0 × 1 = +8.00 | confirmed | `src_20240528_gov-ie_recognises-palestine` (official) | standing, 2024-05-28 to open; generated |
| B9 | `evt_2025_05_21_IRL_B9`: The Taoiseach stated in Dáil Éireann that Israel's obstruction of life-saving aid to Gaza is a violation of its international obligations. | +5.0 × 1.0 × 0.7288 = +3.64 | confirmed | `src_20250521_gov-ie_taoiseach-dail-gaza` (official) | dated 2025-05-21 |
| B9 | `evt_2025_09_26_IRL_B9`: The Taoiseach stated at the UN General Assembly that hunger is being used as an instrument of war in Gaza and called for an immediate ceasefire. | +5.0 × 1.0 × 0.9918 = +4.96 | confirmed | `src_20250926_gov-ie_taoiseach-unga-80` (official) | dated 2025-09-26 |
| B9 | `evt_2025_12_14_IRL_B9`: The Minister for Foreign Affairs and Trade co-signed a letter to the EU High Representative stating that Israel's restrictive controls obstruct the humanitarian response in Gaza. | +5.0 × 1.0 × 1.0000 = +5.00 | confirmed | `src_20251214_gov-ie_letter-kallas-gaza-humanitarian` (official) | dated 2025-12-14; qualifies against passivity |
| B9 | `evt_2026_04_17_IRL_B9`: The Minister for Foreign Affairs and Trade co-signed a letter to the EU High Representative stating that Israeli measures violate international humanitarian law, citing ceasefire violations in Gaza. | +5.0 × 1.0 × 1.0000 = +5.00 | confirmed | `src_20260417_gov-ie_letter-kallas-middle-east` (official) | dated 2026-04-17; qualifies against passivity |
| B9 | indicator cap | sum +18.60 → +10.00 | | | indicator-level cap (docs/02 §2) |
| B10 | — | — | — | — | none found |
| B11 | `evt_2026_06_05_IRL_B11`: The Minister for Justice instructed immigration officers to refuse entry to Israel's ministers Itamar Ben-Gvir and Bezalel Smotrich, citing the disaster in Gaza. | +10.0 × 0.7 × 1 = +7.00 | corroborated | `src_20260605_rte_israeli-ministers-travel-ban` (press) | standing, 2026-06-05 to open; qualifies against passivity |
| B12 | — | — | — | — | none found |
| C1 | `evt_2025_05_20_IRL_C1`: The government supported the review of the EU–Israel Association Agreement launched by the Foreign Affairs Council on 20 May 2025, after requesting it since February 2024. | +4.0 × 1.0 × 1 = +4.00 | confirmed | `src_20250520_eeas_fac-press-remarks-kallas` (official) | standing, 2025-05-20 to open |
| C2 | — | — | — | — | none found |
| C3 | `evt_2026_06_03_IRL_C3_comtrade-2025-self`: The country traded goods worth USD 5.4 billion with Israel in 2025, 87% of its 2022 level, per its report to UN Comtrade. | 0.0 × 1.0 × 1 = 0.00 | confirmed | `src_20260928_comtrade_irl-self-2025` (dataset) | computed, 2026-06-03 to open; generated |
| C4 | — | — | — | — | has events |
| C5 | — | — | — | — | has events |
| C6 | — | — | — | — | none found |
| D1 | `evt_2026_09_01_IRL_D1_fts`: The government paid or committed USD 36.1 million to the oPt flash appeals in the 12 months to 31 August 2026, per FTS. | +9.0 × 1.0 × 1 = +9.00 | confirmed | `src_20260928_fts_plan-1186-p1` (dataset) | computed, 2026-09-01 to 2026-10-01; qualifies against passivity; generated |
| D2 | — | — | — | — | none found |
| D3 | `evt_2024_12_31_IRL_D3`: The government's contribution to UNRWA in 2024 exceeded its 2022 contribution, per UNRWA's donor tables for both years. | +8.0 × 1.0 × 1 = +8.00 | confirmed | `src_20241231_unrwa_donor-ranking-2024` (dataset) | standing, 2024-12-31 to open |
| D4 | `evt_2024_12_19_IRL_D4`: The government received the first group of eight sick children from Gaza for treatment in Ireland under a medical evacuation programme approved in September 2024. | +5.0 × 1.0 × 0.4144 = +2.07 | confirmed | `src_20241220_gov-ie_medevac-first-group` (official) | dated 2024-12-19 |
| D5 | — | — | — | — | none found |

## Score by category

| Category | Sum of indicators | Cap | Clipped |
|---|---|---|---|
| A Arms & military | 0.00 | −45 … +30 | 0.00 |
| B Diplomacy & international law | +49.23 | −40 … +45 | +45.00 |
| C Trade & economy | +4.00 | −20 … +20 | +4.00 |
| D Humanitarian | +19.07 | −15 … +25 | +19.07 |

raw = 0.00 +45.00 +4.00 +19.07 − 0 (passivity) = +68.07; S = clip(raw, −100, +100) = +68.07; display +68; band Confronting (docs/02 §7: Sustaining ≤ −51, Enabling −50…−21, Passive −20…0, Acting 1…40, Confronting ≥ 41).

## What drives this score

1. **B3 +15.00**: `evt_2025_01_06_IRL_B3`.
2. **B9 +10.00** (sum +18.60, capped): `evt_2025_05_21_IRL_B9`, `evt_2025_09_26_IRL_B9`, `evt_2025_12_14_IRL_B9`, `evt_2026_04_17_IRL_B9`.
3. **D1 +9.00**: `evt_2026_09_01_IRL_D1_fts`.

Category caps bind: B +49.23 → +45.00.

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

Display score on 2026-09-30 under each proposal measured in docs/calibration/README.md §4 (rc.1: +68, Confronting); the last column gives the largest change of this country's display score at a quarter end since 2023-10-07.

| Proposal | Display (band) | Change | Largest change in the history |
|---|---|---|---|
| b21: official-video and parliamentary sources count for confirmed (B-21) | +68 (Confronting) | 0 | none |
| b22: most severe stacking for A3, A6, A7, B3, B7, D2 (B-22, B-51) | +68 (Confronting) | 0 | none |
| b23: B1 capped at +15 (B-23, one option) | +68 (Confronting) | 0 | +52 → +47 (2024-12-31) |
| b23-sym: B1 capped at −15 and +15 (B-23, symmetric option) | +68 (Confronting) | 0 | +52 → +47 (2024-12-31) |
| b46: only contributions of +2 or more qualify (B-46) | +68 (Confronting) | 0 | none |
| b47: pre-existing B8 tier does not qualify (B-47) | +68 (Confronting) | 0 | none |
| b48-alt: alternative to B-48: a standing state qualifies while it holds | +68 (Confronting) | 0 | none |
| b46+b47: B-46 and B-47 together | +68 (Confronting) | 0 | none |
| b8-pre: pre-existing recognitions of the registry as B8 +3 (B-199 (3) alternative) | +68 (Confronting) | 0 | none |
| b8-pre+b47: pre-existing B8 +3 rows, with B-47 | +68 (Confronting) | 0 | none |
| trade-no-2022: A2 and C3 values of data year 2022 not in force in the window (P-04, B-63) | +68 (Confronting) | 0 | +4 → +9 (2023-12-31) |
| d1-postwar: D1 from FTS flows dated on or after 2023-10-07 only (P-04, B-60) | +68 (Confronting) | 0 | none |
| proposal: the recommended set: B-21, B-22, B-23 (B1 within −15…+15), B-46, B-47, no 2022 trade values, D1 from post-war flows | +68 (Confronting) | 0 | +4 → +9 (2023-12-31) |

## Sensitivity (docs/02 §10)

Position among the 193 scored entities (1 = highest), display score and band under each sensitivity variant.

| Variant | Display (band) | Position |
|---|---|---|
| rc.1 default | +68 (Confronting) | 3 |
| passivity-5 | +68 (Confronting) | 3 |
| passivity-15 | +68 (Confronting) | 3 |
| passivity-25 | +68 (Confronting) | 3 |
| weight-A-0.5 | +68 (Confronting) | 3 |
| weight-A-1.5 | +68 (Confronting) | 4 |
| weight-B-0.5 | +46 (Confronting) | 4 |
| weight-B-1.5 | +91 (Confronting) | 2 |
| weight-C-0.5 | +66 (Confronting) | 3 |
| weight-C-1.5 | +70 (Confronting) | 2 |
| weight-D-0.5 | +59 (Confronting) | 4 |
| weight-D-1.5 | +78 (Confronting) | 2 |
| reported-0.2 | +68 (Confronting) | 3 |
| reported-0.6 | +68 (Confronting) | 3 |
| statements-excluded | +62 (Confronting) | 2 |
| decay-off | +71 (Confronting) | 4 |

## Questions of the country session

The readings the IRL session flagged are in docs/10 B-229; those it referred to P-15 are decided, for every country at once, in docs/calibration/README.md §6.
