# Calibration worksheet: Egypt (EGY)

Computed on 2026-09-30 with methodology 1.0.0-rc.1, by `pnpm calibrate --date 2026-09-30 --fts` (P-15, docs/08 §3). **Provisional**: none of this country's hand-written events is published yet; the 526 events at status `reviewed` are scored as if published (the `--preview` reading of docs/06 §4), and the one `draft` event of the dataset is left out. The numbers change when the author reviews and publishes the events, and when the incomplete structured tables below are imported; P-22 re-runs this worksheet on the published dataset before the score is shown.

**Score +8.6 → display +9 (Acting)**, position 41 of 193 scored entities (148 of which have only generated events so far). Passivity: not applied (qualifying: `evt_2026_04_15_EGY_C3_comtrade-2025-self`, `evt_2026_04_25_EGY_B9`).

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
| B1 | `evt_2024_12_11_EGY_B1_es-10-25`: The country voted yes on General Assembly resolution A/RES/ES-10/25. | +3.0 × 1.0 × 0.3979 = +1.19 | confirmed | `src_20260928_undl_ga-voting-2025-03-31-corr1` (dataset) | dated 2024-12-11; generated |
| B1 | `evt_2024_12_11_EGY_B1_es-10-26`: The country voted yes on General Assembly resolution A/RES/ES-10/26. | +3.0 × 1.0 × 0.3979 = +1.19 | confirmed | `src_20260928_undl_ga-voting-2025-03-31-corr1` (dataset) | dated 2024-12-11; generated |
| B1 | `evt_2024_12_19_EGY_B1_79-232`: The country voted yes on General Assembly resolution A/RES/79/232. | +3.0 × 1.0 × 0.4144 = +1.24 | confirmed | `src_20260928_undl_ga-voting-2025-03-31-corr1` (dataset) | dated 2024-12-19; generated |
| B2 | — | — | — | — | not applicable |
| B3 | — | — | — | — | none found |
| B4 | — | — | — | — | none found |
| B5 | — | — | — | — | none found |
| B6 | — | — | — | — | none found |
| B7 | — | — | — | — | none found |
| B8 | — | — | — | — | unchecked |
| B9 | `evt_2024_12_19_EGY_B9`: The President told the D-8 summit that Israeli violations in Gaza had killed international staff and destroyed most infrastructure, and called for an immediate ceasefire. | +5.0 × 1.0 × 0.4144 = +2.07 | confirmed | `src_20241219_presidency-eg_d8-special-session-palestine` (official) | dated 2024-12-19 |
| B9 | `evt_2025_08_05_EGY_B9`: The President said at a press conference that the war in Gaza had become a war of starvation and genocide, and called for an immediate ceasefire and the entry of aid. | +5.0 × 1.0 × 0.8849 = +4.42 | confirmed | `src_20250805_sis_sisi-gaza-starvation-genocide` (official) | dated 2025-08-05 |
| B9 | `evt_2025_09_15_EGY_B9`: The President told the Arab-Islamic summit in Doha that Egypt rejected the targeting of civilians and the policy of collective punishment and starvation in the Gaza Strip. | +5.0 × 1.0 × 0.9692 = +4.85 | confirmed | `src_20250915_presidency-eg_doha-arab-islamic-summit` (official) | dated 2025-09-15 |
| B9 | `evt_2026_04_25_EGY_B9`: The President called on the anniversary of Sinai's liberation for full implementation of the Gaza ceasefire agreement and the unhindered entry of humanitarian aid. | +2.0 × 1.0 × 1.0000 = +2.00 | confirmed | `src_20260425_presidency-eg_sinai-liberation-44` (official) | dated 2026-04-25; qualifies against passivity |
| B9 | indicator cap | sum +13.34 → +10.00 | | | indicator-level cap (docs/02 §2) |
| B10 | — | — | — | — | none found |
| B11 | — | — | — | — | none found |
| B12 | — | — | — | — | none found |
| C1 | — | — | — | — | none found |
| C2 | — | — | — | — | none found |
| C3 | `evt_2026_04_15_EGY_C3_comtrade-2025-self`: The country traded goods worth USD 2.6 billion with Israel in 2025, 123% of its 2022 level, per its report to UN Comtrade. | −5.0 × 1.0 × 1 = −5.00 | confirmed | `src_20260928_comtrade_egy-self-2025` (dataset) | computed, 2026-04-15 to open; qualifies against passivity; generated |
| C4 | — | — | — | — | none found |
| C5 | — | — | — | — | none found |
| C6 | — | — | — | — | none found |
| D1 | — | — | — | — | none found |
| D2 | — | — | — | — | none found |
| D3 | — | — | — | — | none found |
| D4 | — | — | — | — | has events; 1 event(s) recorded, none in force on 2026-09-30 |
| D5 | — | — | — | — | none found |

## Score by category

| Category | Sum of indicators | Cap | Clipped |
|---|---|---|---|
| A Arms & military | 0.00 | −45 … +30 | 0.00 |
| B Diplomacy & international law | +13.63 | −40 … +45 | +13.63 |
| C Trade & economy | −5.00 | −20 … +20 | −5.00 |
| D Humanitarian | 0.00 | −15 … +25 | 0.00 |

raw = 0.00 +13.63 −5.00 0.00 − 0 (passivity) = +8.63; S = clip(raw, −100, +100) = +8.63; display +9; band Acting (docs/02 §7: Sustaining ≤ −51, Enabling −50…−21, Passive −20…0, Acting 1…40, Confronting ≥ 41).

## What drives this score

1. **B9 +10.00** (sum +13.34, capped): `evt_2024_12_19_EGY_B9`, `evt_2025_08_05_EGY_B9`, `evt_2025_09_15_EGY_B9`, `evt_2026_04_25_EGY_B9`.
2. **C3 −5.00**: `evt_2026_04_15_EGY_C3_comtrade-2025-self`.
3. **B1 +3.63**: `evt_2024_12_11_EGY_B1_es-10-25`, `evt_2024_12_11_EGY_B1_es-10-26`, `evt_2024_12_19_EGY_B1_79-232`.

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
- B8 is `unchecked`: recognitions.csv has no row for EGY. The registry dates its recognition 1988-11-18 (A/78/846, a lead, B-199 (3)); a row confirmed from the state's own document would add the pre-existing tier +3 from 2023-10-07: display +9 → +12 on 2026-09-30.

## Effect of the proposals on this country

Display score on 2026-09-30 under each proposal measured in docs/calibration/README.md §4 (rc.1: +9, Acting); the last column gives the largest change of this country's display score at a quarter end since 2023-10-07.

| Proposal | Display (band) | Change | Largest change in the history |
|---|---|---|---|
| b21: official-video and parliamentary sources count for confirmed (B-21) | +9 (Acting) | 0 | none |
| b22: most severe stacking for A3, A6, A7, B3, B7, D2 (B-22, B-51) | +9 (Acting) | 0 | none |
| b23: B1 capped at +15 (B-23, one option) | +9 (Acting) | 0 | +30 → +24 (2024-12-31) |
| b23-sym: B1 capped at −15 and +15 (B-23, symmetric option) | +9 (Acting) | 0 | +30 → +24 (2024-12-31) |
| b46: only contributions of +2 or more qualify (B-46) | +9 (Acting) | 0 | none |
| b47: pre-existing B8 tier does not qualify (B-47) | +9 (Acting) | 0 | none |
| b48-alt: alternative to B-48: a standing state qualifies while it holds | +9 (Acting) | 0 | none |
| b46+b47: B-46 and B-47 together | +9 (Acting) | 0 | none |
| b8-pre: pre-existing recognitions of the registry as B8 +3 (B-199 (3) alternative) | +12 (Acting) | +3 | +13 → +16 (2023-12-31) |
| b8-pre+b47: pre-existing B8 +3 rows, with B-47 | +12 (Acting) | +3 | +13 → +16 (2023-12-31) |
| trade-no-2022: A2 and C3 values of data year 2022 not in force in the window (P-04, B-63) | +9 (Acting) | 0 | +13 → +18 (2023-12-31) |
| d1-postwar: D1 from FTS flows dated on or after 2023-10-07 only (P-04, B-60) | +9 (Acting) | 0 | none |
| proposal: the recommended set: B-21, B-22, B-23 (B1 within −15…+15), B-46, B-47, no 2022 trade values, D1 from post-war flows | +9 (Acting) | 0 | +30 → +24 (2024-12-31) |

## Sensitivity (docs/02 §10)

Position among the 193 scored entities (1 = highest), display score and band under each sensitivity variant.

| Variant | Display (band) | Position |
|---|---|---|
| rc.1 default | +9 (Acting) | 41 |
| passivity-5 | +9 (Acting) | 41 |
| passivity-15 | +9 (Acting) | 41 |
| passivity-25 | +9 (Acting) | 40 |
| weight-A-0.5 | +9 (Acting) | 41 |
| weight-A-1.5 | +9 (Acting) | 40 |
| weight-B-0.5 | +2 (Acting) | 42 |
| weight-B-1.5 | +15 (Acting) | 35 |
| weight-C-0.5 | +11 (Acting) | 38 |
| weight-C-1.5 | +6 (Acting) | 42 |
| weight-D-0.5 | +9 (Acting) | 35 |
| weight-D-1.5 | +9 (Acting) | 43 |
| reported-0.2 | +9 (Acting) | 41 |
| reported-0.6 | +9 (Acting) | 40 |
| statements-excluded | −1 (Passive) | 43 |
| decay-off | +31 (Acting) | 26 |

## Questions of the country session

The readings the EGY session flagged are in docs/10 B-244; those it referred to P-15 are decided, for every country at once, in docs/calibration/README.md §6.
