# Calibration worksheet: France (FRA)

Computed on 2026-09-30 with methodology 1.0.0-rc.1, by `pnpm calibrate --date 2026-09-30 --fts` (P-15, docs/08 §3). **Provisional**: none of this country's hand-written events is published yet; the 526 events at status `reviewed` are scored as if published (the `--preview` reading of docs/06 §4), and the one `draft` event of the dataset is left out. The numbers change when the author reviews and publishes the events, and when the incomplete structured tables below are imported; P-22 re-runs this worksheet on the published dataset before the score is shown.

**Score +31.6 → display +32 (Acting)**, position 16 of 193 scored entities (148 of which have only generated events so far). Passivity: not applied (qualifying: `evt_2025_12_30_FRA_B9`, `evt_2026_05_23_FRA_B11`, `evt_2026_07_16_FRA_C3_comtrade-2025-self`, `evt_2026_09_01_FRA_D1_fts`).

## Worksheet

One row per event in force on the date (counted, or set aside by a stacking rule), and one row per scored indicator without an event in force, with its assessment status. Points are shown as p × w × d = contribution (docs/02 §3–§4); generated events come from the structured tables (D-08).

| Indicator | Event(s) | Points | Confidence | Source (primary) | Notes |
|---|---|---|---|---|---|
| A1 | — | — | — | — | unchecked; no SIPRI release imported (docs/10 B-187, B-900–B-904) |
| A2 | `evt_2026_07_16_FRA_A2_comtrade-2025-self`: The country exported USD 64,176 of goods under HS 93 to Israel in 2025, per its report to UN Comtrade. | 0.0 × 1.0 × 1 = 0.00 | confirmed | `src_20260928_comtrade_fra-self-2025` (dataset) | computed, 2026-07-16 to open; generated |
| A3 | — | — | — | — | none found |
| A4 | — | — | — | — | unchecked; no SIPRI release imported (docs/10 B-187, B-900–B-904) |
| A5 | — | — | — | — | none found |
| A6 | — | — | — | — | none found |
| A7 | — | — | — | — | none found |
| A8 | — | — | — | — | none found |
| B1 | `evt_2024_12_11_FRA_B1_es-10-25`: The country voted yes on General Assembly resolution A/RES/ES-10/25. | +3.0 × 1.0 × 0.3979 = +1.19 | confirmed | `src_20260928_undl_ga-voting-2025-03-31-corr1` (dataset) | dated 2024-12-11; generated |
| B1 | `evt_2024_12_11_FRA_B1_es-10-26`: The country voted yes on General Assembly resolution A/RES/ES-10/26. | +3.0 × 1.0 × 0.3979 = +1.19 | confirmed | `src_20260928_undl_ga-voting-2025-03-31-corr1` (dataset) | dated 2024-12-11; generated |
| B1 | `evt_2024_12_19_FRA_B1_79-232`: The country voted yes on General Assembly resolution A/RES/79/232. | +3.0 × 1.0 × 0.4144 = +1.24 | confirmed | `src_20260928_undl_ga-voting-2025-03-31-corr1` (dataset) | dated 2024-12-19; generated |
| B2 | — | — | — | — | none found |
| B3 | — | — | — | — | none found |
| B4 | — | — | — | — | none found |
| B5 | — | — | — | — | none found |
| B6 | `evt_2024_11_27_FRA_B6`: The Ministry for Europe and Foreign Affairs stated that immunities of states not party to the ICC apply to Prime Minister Netanyahu and would have to be considered if the ICC requested his arrest. | −10.0 × 1.0 × 1 = −10.00 | confirmed | `src_20241127_diplomatie-gouv_cpi-immunites` (official) | standing, 2024-11-27 to open |
| B7 | — | — | — | — | none found |
| B8 | `evt_2025_09_22_FRA_B8_recognition`: The country recognised the State of Palestine. | +8.0 × 1.0 × 1 = +8.00 | confirmed | `src_20250922_diplomatie-gouv_reconnaissance-palestine` (official) | standing, 2025-09-22 to open; generated |
| B9 | `evt_2025_05_19_FRA_B9`: The President of the Republic, with the leaders of the United Kingdom and Canada, said the denial of essential aid risked breaching humanitarian law and asked Israel to stop its operations in Gaza. | +5.0 × 1.0 × 0.7247 = +3.62 | confirmed | `src_20250519_elysee_declaration-gaza-cisjordanie` (official) | dated 2025-05-19 |
| B9 | `evt_2025_07_25_FRA_B9`: The President of the Republic, with the leaders of Germany and the United Kingdom, called for an immediate ceasefire and for Israel to lift restrictions on aid and respect humanitarian law. | +5.0 × 1.0 × 0.8623 = +4.31 | confirmed | `src_20250725_elysee_declaration-e3-gaza` (official) | dated 2025-07-25 |
| B9 | `evt_2025_09_22_FRA_B9`: The President of the Republic told the UN General Assembly that nothing justified continuing the war in Gaza and called for an immediate end to the war and the bombing. | +5.0 × 1.0 × 0.9836 = +4.92 | confirmed | `src_20250922_elysee_agnu-80-reconnaissance` (official) | dated 2025-09-22 |
| B9 | `evt_2025_12_30_FRA_B9`: The Minister for Europe and Foreign Affairs, with nine other foreign ministers, called on Israel to open the crossings into Gaza and to lift the obstacles to humanitarian access. | +2.0 × 1.0 × 1.0000 = +2.00 | confirmed | `src_20251230_diplomatie-gouv_reponse-humanitaire-gaza` (official) | dated 2025-12-30; qualifies against passivity |
| B9 | indicator cap | sum +14.85 → +10.00 | | | indicator-level cap (docs/02 §2) |
| B10 | — | — | — | — | none found |
| B11 | `evt_2026_05_23_FRA_B11`: The Minister for Europe and Foreign Affairs barred Israeli minister Itamar Ben-Gvir from French territory after the treatment of French members of a Gaza flotilla; Bezalel Smotrich followed in June. | +10.0 × 1.0 × 1 = +10.00 | confirmed | `src_20260529_diplomatie-gouv_france-inter-barrot` (official) | standing, 2026-05-23 to open; qualifies against passivity |
| B12 | — | — | — | — | none found |
| C1 | `evt_2025_05_20_FRA_C1`: The government called in the EU Foreign Affairs Council for a review of the EU–Israel Association Agreement and welcomed the High Representative's announcement of that review. | +4.0 × 1.0 × 1 = +4.00 | confirmed | `src_20250520_diplomatie-gouv_cae-accord-association` (official) | standing, 2025-05-20 to open |
| C2 | — | — | — | — | none found |
| C3 | `evt_2026_07_16_FRA_C3_comtrade-2025-self`: The country traded goods worth USD 3.6 billion with Israel in 2025, 95% of its 2022 level, per its report to UN Comtrade. | −5.0 × 1.0 × 1 = −5.00 | confirmed | `src_20260928_comtrade_fra-self-2025` (dataset) | computed, 2026-07-16 to open; qualifies against passivity; generated |
| C4 | — | — | — | — | none found |
| C5 | — | — | — | — | none found |
| C6 | — | — | — | — | none found |
| D1 | `evt_2026_09_01_FRA_D1_fts`: The government paid or committed USD 72.0 million to the oPt flash appeals in the 12 months to 31 August 2026, per FTS. | +6.0 × 1.0 × 1 = +6.00 | confirmed | `src_20260928_fts_plan-1186-p1` (dataset) | computed, 2026-09-01 to 2026-10-01; qualifies against passivity; generated |
| D2 | — | — | — | — | has events; 1 event(s) recorded, none in force on 2026-09-30 |
| D3 | `evt_2024_03_28_FRA_D3`: The Ministry for Europe and Foreign Affairs announced that France would contribute more than EUR 30 million to UNRWA in 2024. | +5.0 × 1.0 × 1 = +5.00 | confirmed | `src_20240328_diplomatie-gouv_point-presse-unrwa` (official) | standing, 2024-03-28 to open |
| D4 | — | — | — | — | has events; 2 event(s) recorded, none in force on 2026-09-30 |
| D5 | — | — | — | — | none found |

## Score by category

| Category | Sum of indicators | Cap | Clipped |
|---|---|---|---|
| A Arms & military | 0.00 | −45 … +30 | 0.00 |
| B Diplomacy & international law | +21.63 | −40 … +45 | +21.63 |
| C Trade & economy | −1.00 | −20 … +20 | −1.00 |
| D Humanitarian | +11.00 | −15 … +25 | +11.00 |

raw = 0.00 +21.63 −1.00 +11.00 − 0 (passivity) = +31.63; S = clip(raw, −100, +100) = +31.63; display +32; band Acting (docs/02 §7: Sustaining ≤ −51, Enabling −50…−21, Passive −20…0, Acting 1…40, Confronting ≥ 41).

## What drives this score

1. **B11 +10.00**: `evt_2026_05_23_FRA_B11`.
2. **B6 −10.00**: `evt_2024_11_27_FRA_B6`.
3. **B9 +10.00** (sum +14.85, capped): `evt_2025_05_19_FRA_B9`, `evt_2025_07_25_FRA_B9`, `evt_2025_09_22_FRA_B9`, `evt_2025_12_30_FRA_B9`.

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

Display score on 2026-09-30 under each proposal measured in docs/calibration/README.md §4 (rc.1: +32, Acting); the last column gives the largest change of this country's display score at a quarter end since 2023-10-07.

| Proposal | Display (band) | Change | Largest change in the history |
|---|---|---|---|
| b21: official-video and parliamentary sources count for confirmed (B-21) | +32 (Acting) | 0 | none |
| b22: most severe stacking for A3, A6, A7, B3, B7, D2 (B-22, B-51) | +32 (Acting) | 0 | none |
| b23: B1 capped at +15 (B-23, one option) | +32 (Acting) | 0 | +30 → +24 (2024-12-31) |
| b23-sym: B1 capped at −15 and +15 (B-23, symmetric option) | +32 (Acting) | 0 | +30 → +24 (2024-12-31) |
| b46: only contributions of +2 or more qualify (B-46) | +32 (Acting) | 0 | none |
| b47: pre-existing B8 tier does not qualify (B-47) | +32 (Acting) | 0 | none |
| b48-alt: alternative to B-48: a standing state qualifies while it holds | +32 (Acting) | 0 | none |
| b46+b47: B-46 and B-47 together | +32 (Acting) | 0 | none |
| b8-pre: pre-existing recognitions of the registry as B8 +3 (B-199 (3) alternative) | +32 (Acting) | 0 | none |
| b8-pre+b47: pre-existing B8 +3 rows, with B-47 | +32 (Acting) | 0 | none |
| trade-no-2022: A2 and C3 values of data year 2022 not in force in the window (P-04, B-63) | +32 (Acting) | 0 | +16 → +21 (2023-12-31) |
| d1-postwar: D1 from FTS flows dated on or after 2023-10-07 only (P-04, B-60) | +32 (Acting) | 0 | none |
| proposal: the recommended set: B-21, B-22, B-23 (B1 within −15…+15), B-46, B-47, no 2022 trade values, D1 from post-war flows | +32 (Acting) | 0 | +30 → +24 (2024-12-31) |

## Sensitivity (docs/02 §10)

Position among the 193 scored entities (1 = highest), display score and band under each sensitivity variant.

| Variant | Display (band) | Position |
|---|---|---|
| rc.1 default | +32 (Acting) | 16 |
| passivity-5 | +32 (Acting) | 16 |
| passivity-15 | +32 (Acting) | 16 |
| passivity-25 | +32 (Acting) | 16 |
| weight-A-0.5 | +32 (Acting) | 15 |
| weight-A-1.5 | +32 (Acting) | 16 |
| weight-B-0.5 | +21 (Acting) | 15 |
| weight-B-1.5 | +42 (Confronting) | 13 |
| weight-C-0.5 | +32 (Acting) | 16 |
| weight-C-1.5 | +31 (Acting) | 16 |
| weight-D-0.5 | +26 (Acting) | 15 |
| weight-D-1.5 | +37 (Acting) | 16 |
| reported-0.2 | +32 (Acting) | 16 |
| reported-0.6 | +32 (Acting) | 16 |
| statements-excluded | +22 (Acting) | 13 |
| decay-off | +59 (Confronting) | 6 |

## Questions of the country session

The readings the FRA session flagged are in docs/10 B-219; those it referred to P-15 are decided, for every country at once, in docs/calibration/README.md §6.
