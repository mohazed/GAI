# Calibration worksheet: India (IND)

Computed on 2026-09-30 with methodology 1.0.0-rc.1, by `pnpm calibrate --date 2026-09-30 --fts` (P-15, docs/08 §3). **Provisional**: none of this country's hand-written events is published yet; the 526 events at status `reviewed` are scored as if published (the `--preview` reading of docs/06 §4), and the one `draft` event of the dataset is left out. The numbers change when the author reviews and publishes the events, and when the incomplete structured tables below are imported; P-22 re-runs this worksheet on the published dataset before the score is shown.

**Score −29.9 → display −30 (Enabling)**, position 191 of 193 scored entities (148 of which have only generated events so far). Passivity: not applied (qualifying: `evt_2025_11_04_IND_C2`, `evt_2026_02_25_IND_B10`, `evt_2026_02_26_IND_C2`, `evt_2026_05_14_IND_B9`).

## Worksheet

One row per event in force on the date (counted, or set aside by a stacking rule), and one row per scored indicator without an event in force, with its assessment status. Points are shown as p × w × d = contribution (docs/02 §3–§4); generated events come from the structured tables (D-08).

| Indicator | Event(s) | Points | Confidence | Source (primary) | Notes |
|---|---|---|---|---|---|
| A1 | — | — | — | — | unchecked; no SIPRI release imported (docs/10 B-187, B-900–B-904) |
| A2 | `evt_2026_07_10_IND_A2_comtrade-2025-self`: The country exported USD 48.5 million of goods under HS 93 to Israel in 2025, per its report to UN Comtrade. | −15.0 × 1.0 × 1 = −15.00 | confirmed | `src_20260928_comtrade_ind-self-2025-2` (dataset) | computed, 2026-07-10 to open; generated |
| A3 | — | — | — | — | none found |
| A4 | — | — | — | — | unchecked; no SIPRI release imported (docs/10 B-187, B-900–B-904) |
| A5 | — | — | — | — | none found |
| A6 | — | — | — | — | none found |
| A7 | — | — | — | — | none found |
| A8 | — | — | — | — | none found |
| B1 | `evt_2024_12_11_IND_B1_es-10-25`: The country voted yes on General Assembly resolution A/RES/ES-10/25. | +3.0 × 1.0 × 0.3979 = +1.19 | confirmed | `src_20260928_undl_ga-voting-2025-03-31-corr1` (dataset) | dated 2024-12-11; generated |
| B1 | `evt_2024_12_11_IND_B1_es-10-26`: The country voted yes on General Assembly resolution A/RES/ES-10/26. | +3.0 × 1.0 × 0.3979 = +1.19 | confirmed | `src_20260928_undl_ga-voting-2025-03-31-corr1` (dataset) | dated 2024-12-11; generated |
| B1 | `evt_2024_12_19_IND_B1_79-232`: The country voted yes on General Assembly resolution A/RES/79/232. | +3.0 × 1.0 × 0.4144 = +1.24 | confirmed | `src_20260928_undl_ga-voting-2025-03-31-corr1` (dataset) | dated 2024-12-19; generated |
| B2 | — | — | — | — | not applicable |
| B3 | — | — | — | — | none found |
| B4 | — | — | — | — | none found |
| B5 | — | — | — | — | none found |
| B6 | — | — | — | — | none found |
| B7 | — | — | — | — | none found |
| B8 | — | — | — | — | unchecked |
| B9 | `evt_2024_11_13_IND_B9`: The Minister of External Affairs said at a meeting with the Foreign Minister of Saudi Arabia that India supported an early ceasefire in Gaza. | +2.0 × 1.0 × 0.3404 = +0.68 | confirmed | `src_20241113_mea_eam-saudi-fm-meeting` (official) | dated 2024-11-13 |
| B9 | `evt_2024_12_10_IND_B9`: The Minister of External Affairs told the India–Bahrain High Joint Commission that India called for an early ceasefire in Gaza and the release of all hostages. | +2.0 × 1.0 × 0.3959 = +0.79 | confirmed | `src_20241210_mea_eam-india-bahrain-hjc` (official) | dated 2024-12-10 |
| B9 | `evt_2025_09_27_IND_B9`: The Minister of External Affairs told the UN General Assembly that India called for an end to hostilities in the conflicts in Ukraine and Gaza. | +2.0 × 1.0 × 0.9938 = +1.99 | confirmed | `src_20250927_mea_eam-unga80-general-debate` (official) | dated 2025-09-27 |
| B9 | `evt_2026_05_14_IND_B9`: The Minister of External Affairs told the BRICS foreign ministers that a sustained ceasefire and humanitarian access in Gaza remained essential. | +2.0 × 1.0 × 1.0000 = +2.00 | confirmed | `src_20260514_mea_eam-brics-fmm-statement` (official) | dated 2026-05-14; qualifies against passivity |
| B10 | `evt_2026_02_25_IND_B10`: The Prime Minister told the Knesset that India stood with Israel with full conviction, in this moment and beyond. | −5.0 × 1.0 × 1.0000 = −5.00 | confirmed | `src_20260225_pmindia_pm-address-knesset` (official) | dated 2026-02-25; qualifies against passivity |
| B11 | — | — | — | — | none found |
| B12 | — | — | — | — | none found |
| C1 | — | — | — | — | none found |
| C2 | `evt_2025_09_08_IND_C2`: The government signed a bilateral investment agreement with the government of Israel in New Delhi. | −10.0 × 1.0 × 1 = −10.00 | confirmed | `src_20250908_pib_india-israel-investment-agreement` (official) | standing, 2025-09-08 to open |
| C2 | `evt_2025_11_04_IND_C2`: The Ministry of Defence signed a memorandum of understanding on defence cooperation with the Israeli Ministry of Defence in Tel Aviv. | −10.0 × 1.0 × 1 = −10.00 | confirmed | `src_20251104_pib_india-israel-defence-cooperation-mou` (official) | standing, 2025-11-04 to open; qualifies against passivity |
| C2 | `evt_2026_02_26_IND_C2`: The government and Indian agencies signed fifteen agreements, memoranda and protocols with Israel, including three labour mobility protocols and a memorandum on geophysical exploration. | −10.0 × 1.0 × 1 = −10.00 | confirmed | `src_20260226_mea_india-israel-joint-statement` (official) | standing, 2026-02-26 to open; qualifies against passivity |
| C3 | `evt_2026_07_10_IND_C3_comtrade-2025-self`: The country traded goods worth USD 3.5 billion with Israel in 2025, 34% of its 2022 level, per its report to UN Comtrade. | 0.0 × 1.0 × 1 = 0.00 | confirmed | `src_20260928_comtrade_ind-self-2025-2` (dataset) | computed, 2026-07-10 to open; generated |
| C4 | — | — | — | — | none found |
| C5 | — | — | — | — | none found |
| C6 | — | — | — | — | none found |
| D1 | `evt_2026_09_01_IND_D1_fts`: The government paid or committed USD 24,528 to the oPt flash appeals in the 12 months to 31 August 2026, per FTS. | +1.0 × 1.0 × 1 = +1.00 | confirmed | `src_20260928_fts_plan-1186-p1` (dataset) | computed, 2026-09-01 to 2026-10-01; generated |
| D2 | — | — | — | — | none found |
| D3 | — | — | — | — | none found |
| D4 | — | — | — | — | none found |
| D5 | — | — | — | — | none found |

## Score by category

| Category | Sum of indicators | Cap | Clipped |
|---|---|---|---|
| A Arms & military | −15.00 | −45 … +30 | −15.00 |
| B Diplomacy & international law | +4.09 | −40 … +45 | +4.09 |
| C Trade & economy | −30.00 | −20 … +20 | −20.00 |
| D Humanitarian | +1.00 | −15 … +25 | +1.00 |

raw = −15.00 +4.09 −20.00 +1.00 − 0 (passivity) = −29.91; S = clip(raw, −100, +100) = −29.91; display −30; band Enabling (docs/02 §7: Sustaining ≤ −51, Enabling −50…−21, Passive −20…0, Acting 1…40, Confronting ≥ 41).

## What drives this score

1. **C2 −30.00**: `evt_2025_09_08_IND_C2`, `evt_2025_11_04_IND_C2`, `evt_2026_02_26_IND_C2`.
2. **A2 −15.00**: `evt_2026_07_10_IND_A2_comtrade-2025-self`.
3. **B9 +5.46**: `evt_2024_11_13_IND_B9`, `evt_2024_12_10_IND_B9`, `evt_2025_09_27_IND_B9`, `evt_2026_05_14_IND_B9`.

Category caps bind: C −30.00 → −20.00.

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
- B8 is `unchecked`: recognitions.csv has no row for IND. The registry dates its recognition 1988-11-18 (A/78/846, a lead, B-199 (3)); a row confirmed from the state's own document would add the pre-existing tier +3 from 2023-10-07: display −30 → −27 on 2026-09-30.

## Effect of the proposals on this country

Display score on 2026-09-30 under each proposal measured in docs/calibration/README.md §4 (rc.1: −30, Enabling); the last column gives the largest change of this country's display score at a quarter end since 2023-10-07.

| Proposal | Display (band) | Change | Largest change in the history |
|---|---|---|---|
| b21: official-video and parliamentary sources count for confirmed (B-21) | −30 (Enabling) | 0 | none |
| b22: most severe stacking for A3, A6, A7, B3, B7, D2 (B-22, B-51) | −30 (Enabling) | 0 | none |
| b23: B1 capped at +15 (B-23, one option) | −30 (Enabling) | 0 | none |
| b23-sym: B1 capped at −15 and +15 (B-23, symmetric option) | −30 (Enabling) | 0 | none |
| b46: only contributions of +2 or more qualify (B-46) | −30 (Enabling) | 0 | −22 → −37 (2023-12-31) |
| b47: pre-existing B8 tier does not qualify (B-47) | −30 (Enabling) | 0 | none |
| b48-alt: alternative to B-48: a standing state qualifies while it holds | −30 (Enabling) | 0 | none |
| b46+b47: B-46 and B-47 together | −30 (Enabling) | 0 | −22 → −37 (2023-12-31) |
| b8-pre: pre-existing recognitions of the registry as B8 +3 (B-199 (3) alternative) | −27 (Enabling) | +3 | −36 → −18 (2024-06-30) |
| b8-pre+b47: pre-existing B8 +3 rows, with B-47 | −27 (Enabling) | +3 | −22 → −19 (2023-12-31) |
| trade-no-2022: A2 and C3 values of data year 2022 not in force in the window (P-04, B-63) | −30 (Enabling) | 0 | −22 → −14 (2023-12-31) |
| d1-postwar: D1 from FTS flows dated on or after 2023-10-07 only (P-04, B-60) | −30 (Enabling) | 0 | none |
| proposal: the recommended set: B-21, B-22, B-23 (B1 within −15…+15), B-46, B-47, no 2022 trade values, D1 from post-war flows | −30 (Enabling) | 0 | −22 → −14 (2023-12-31) |

## Sensitivity (docs/02 §10)

Position among the 193 scored entities (1 = highest), display score and band under each sensitivity variant.

| Variant | Display (band) | Position |
|---|---|---|
| rc.1 default | −30 (Enabling) | 191 |
| passivity-5 | −30 (Enabling) | 191 |
| passivity-15 | −30 (Enabling) | 191 |
| passivity-25 | −30 (Enabling) | 187 |
| weight-A-0.5 | −22 (Enabling) | 189 |
| weight-A-1.5 | −37 (Enabling) | 191 |
| weight-B-0.5 | −32 (Enabling) | 192 |
| weight-B-1.5 | −28 (Enabling) | 190 |
| weight-C-0.5 | −20 (Passive) | 187 |
| weight-C-1.5 | −40 (Enabling) | 191 |
| weight-D-0.5 | −30 (Enabling) | 191 |
| weight-D-1.5 | −29 (Enabling) | 191 |
| reported-0.2 | −30 (Enabling) | 191 |
| reported-0.6 | −30 (Enabling) | 191 |
| statements-excluded | −30 (Enabling) | 191 |
| decay-off | −18 (Passive) | 160 |

## Questions of the country session

The readings the IND session flagged are in docs/10 B-249; those it referred to P-15 are decided, for every country at once, in docs/calibration/README.md §6.
