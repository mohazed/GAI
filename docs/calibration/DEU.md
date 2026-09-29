# Calibration worksheet: Germany (DEU)

Computed on 2026-09-30 with methodology 1.0.0-rc.1, by `pnpm calibrate --date 2026-09-30 --fts` (P-15, docs/08 §3). **Provisional**: none of this country's hand-written events is published yet; the 526 events at status `reviewed` are scored as if published (the `--preview` reading of docs/06 §4), and the one `draft` event of the dataset is left out. The numbers change when the author reviews and publishes the events, and when the incomplete structured tables below are imported; P-22 re-runs this worksheet on the published dataset before the score is shown.

**Score +8.9 → display +9 (Acting)**, position 40 of 193 scored entities (148 of which have only generated events so far). Passivity: not applied (qualifying: `evt_2026_01_11_DEU_C2`, `evt_2026_05_20_DEU_C3_comtrade-2025-self`, `evt_2026_09_01_DEU_D1_fts`).

## Worksheet

One row per event in force on the date (counted, or set aside by a stacking rule), and one row per scored indicator without an event in force, with its assessment status. Points are shown as p × w × d = contribution (docs/02 §3–§4); generated events come from the structured tables (D-08).

| Indicator | Event(s) | Points | Confidence | Source (primary) | Notes |
|---|---|---|---|---|---|
| A1 | — | — | — | — | unchecked; no SIPRI release imported (docs/10 B-187, B-900–B-904) |
| A2 | `evt_2026_05_20_DEU_A2_comtrade-2025-self`: The country exported USD 649,550 of goods under HS 93 to Israel in 2025, per its report to UN Comtrade. | −3.0 × 1.0 × 1 = −3.00 | confirmed | `src_20260927_comtrade_deu-self-2025` (dataset) | computed, 2026-05-20 to open; generated |
| A3 | — | — | — | — | none found |
| A4 | — | — | — | — | unchecked; no SIPRI release imported (docs/10 B-187, B-900–B-904) |
| A5 | — | — | — | — | has events; 1 event(s) recorded, none in force on 2026-09-30 |
| A6 | — | — | — | — | has events; 1 event(s) recorded, none in force on 2026-09-30 |
| A7 | — | — | — | — | none found |
| A8 | — | — | — | — | none found |
| B1 | `evt_2024_12_11_DEU_B1_es-10-25`: The country voted yes on General Assembly resolution A/RES/ES-10/25. | +3.0 × 1.0 × 0.3979 = +1.19 | confirmed | `src_20260928_undl_ga-voting-2025-03-31-corr1` (dataset) | dated 2024-12-11; generated |
| B1 | `evt_2024_12_11_DEU_B1_es-10-26`: The country voted yes on General Assembly resolution A/RES/ES-10/26. | +3.0 × 1.0 × 0.3979 = +1.19 | confirmed | `src_20260928_undl_ga-voting-2025-03-31-corr1` (dataset) | dated 2024-12-11; generated |
| B1 | `evt_2024_12_19_DEU_B1_79-232`: The country voted yes on General Assembly resolution A/RES/79/232. | +3.0 × 1.0 × 0.4144 = +1.24 | confirmed | `src_20260928_undl_ga-voting-2025-03-31-corr1` (dataset) | dated 2024-12-19; generated |
| B2 | — | — | — | — | not applicable |
| B3 | — | — | — | — | none found |
| B4 | — | — | — | — | none found |
| B5 | — | — | — | — | none found |
| B6 | — | — | — | — | none found |
| B7 | — | — | — | — | none found |
| B8 | — | — | — | — | none found |
| B9 | `evt_2025_07_25_DEU_B9`: The Federal Chancellor, with the leaders of France and the United Kingdom, called for an immediate ceasefire and for Israel to lift restrictions on aid to act against starvation. | +5.0 × 1.0 × 0.8623 = +4.31 | confirmed | `src_20250725_bundesregierung_e3-declaration-gaza` (official) | dated 2025-07-25 |
| B9 | `evt_2025_09_27_DEU_B9`: The Federal Foreign Minister told the General Assembly that the war in Gaza had to be ended and the hostages released. | +2.0 × 1.0 × 0.9938 = +1.99 | confirmed | `src_20250927_auswaertiges-amt_wadephul-generaldebatte` (official) | dated 2025-09-27 |
| B10 | — | — | — | — | has events; 1 event(s) recorded, none in force on 2026-09-30 |
| B11 | — | — | — | — | none found |
| B12 | — | — | — | — | none found |
| C1 | — | — | — | — | none found |
| C2 | `evt_2026_01_11_DEU_C2`: The Federal Minister of the Interior and the Prime Minister of Israel signed a joint declaration on cooperation in a cyber and security pact. | −10.0 × 0.4 × 1 = −4.00 | reported | `src_20260223_bundestag_drs-21-4306-cyberpakt` (parliamentary) | standing, 2026-01-11 to open; qualifies against passivity |
| C3 | `evt_2026_05_20_DEU_C3_comtrade-2025-self`: The country traded goods worth USD 9.9 billion with Israel in 2025, 109% of its 2022 level, per its report to UN Comtrade. | −5.0 × 1.0 × 1 = −5.00 | confirmed | `src_20260927_comtrade_deu-self-2025` (dataset) | computed, 2026-05-20 to open; qualifies against passivity; generated |
| C4 | — | — | — | — | none found |
| C5 | — | — | — | — | none found |
| C6 | — | — | — | — | none found |
| D1 | `evt_2026_09_01_DEU_D1_fts`: The government paid or committed USD 105.1 million to the oPt flash appeals in the 12 months to 31 August 2026, per FTS. | +6.0 × 1.0 × 1 = +6.00 | confirmed | `src_20260928_fts_plan-1186-p1` (dataset) | computed, 2026-09-01 to 2026-10-01; qualifies against passivity; generated |
| D2 | — | — | — | — | has events; 1 event(s) recorded, none in force on 2026-09-30 |
| D3 | `evt_2024_04_24_DEU_D3`: The Federal Foreign Office and the development ministry announced that the federal government would shortly continue its cooperation with UNRWA in Gaza. | +5.0 × 1.0 × 1 = +5.00 | confirmed | `src_20240424_auswaertiges-amt_unrwa-fortsetzung` (official) | standing, 2024-04-24 to open |
| D4 | — | — | — | — | none found |
| D5 | — | — | — | — | none found |

## Score by category

| Category | Sum of indicators | Cap | Clipped |
|---|---|---|---|
| A Arms & military | −3.00 | −45 … +30 | −3.00 |
| B Diplomacy & international law | +9.93 | −40 … +45 | +9.93 |
| C Trade & economy | −9.00 | −20 … +20 | −9.00 |
| D Humanitarian | +11.00 | −15 … +25 | +11.00 |

raw = −3.00 +9.93 −9.00 +11.00 − 0 (passivity) = +8.93; S = clip(raw, −100, +100) = +8.93; display +9; band Acting (docs/02 §7: Sustaining ≤ −51, Enabling −50…−21, Passive −20…0, Acting 1…40, Confronting ≥ 41).

## What drives this score

1. **B9 +6.30**: `evt_2025_07_25_DEU_B9`, `evt_2025_09_27_DEU_B9`.
2. **D1 +6.00**: `evt_2026_09_01_DEU_D1_fts`.
3. **C3 −5.00**: `evt_2026_05_20_DEU_C3_comtrade-2025-self`.

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

Display score on 2026-09-30 under each proposal measured in docs/calibration/README.md §4 (rc.1: +9, Acting); the last column gives the largest change of this country's display score at a quarter end since 2023-10-07.

| Proposal | Display (band) | Change | Largest change in the history |
|---|---|---|---|
| b21: official-video and parliamentary sources count for confirmed (B-21) | +3 (Acting) | −6 | +11 → +5 (2026-03-31) |
| b22: most severe stacking for A3, A6, A7, B3, B7, D2 (B-22, B-51) | +9 (Acting) | 0 | none |
| b23: B1 capped at +15 (B-23, one option) | +9 (Acting) | 0 | none |
| b23-sym: B1 capped at −15 and +15 (B-23, symmetric option) | +9 (Acting) | 0 | none |
| b46: only contributions of +2 or more qualify (B-46) | +9 (Acting) | 0 | none |
| b47: pre-existing B8 tier does not qualify (B-47) | +9 (Acting) | 0 | none |
| b48-alt: alternative to B-48: a standing state qualifies while it holds | +9 (Acting) | 0 | none |
| b46+b47: B-46 and B-47 together | +9 (Acting) | 0 | none |
| b8-pre: pre-existing recognitions of the registry as B8 +3 (B-199 (3) alternative) | +9 (Acting) | 0 | none |
| b8-pre+b47: pre-existing B8 +3 rows, with B-47 | +9 (Acting) | 0 | none |
| trade-no-2022: A2 and C3 values of data year 2022 not in force in the window (P-04, B-63) | +9 (Acting) | 0 | −19 → −11 (2023-12-31) |
| d1-postwar: D1 from FTS flows dated on or after 2023-10-07 only (P-04, B-60) | +9 (Acting) | 0 | none |
| proposal: the recommended set: B-21, B-22, B-23 (B1 within −15…+15), B-46, B-47, no 2022 trade values, D1 from post-war flows | +3 (Acting) | −6 | −19 → −11 (2023-12-31) |

## Sensitivity (docs/02 §10)

Position among the 193 scored entities (1 = highest), display score and band under each sensitivity variant.

| Variant | Display (band) | Position |
|---|---|---|
| rc.1 default | +9 (Acting) | 40 |
| passivity-5 | +9 (Acting) | 40 |
| passivity-15 | +9 (Acting) | 40 |
| passivity-25 | +9 (Acting) | 39 |
| weight-A-0.5 | +10 (Acting) | 37 |
| weight-A-1.5 | +7 (Acting) | 42 |
| weight-B-0.5 | +4 (Acting) | 40 |
| weight-B-1.5 | +14 (Acting) | 38 |
| weight-C-0.5 | +13 (Acting) | 35 |
| weight-C-1.5 | +4 (Acting) | 43 |
| weight-D-0.5 | +3 (Acting) | 43 |
| weight-D-1.5 | +14 (Acting) | 36 |
| reported-0.2 | +11 (Acting) | 37 |
| reported-0.6 | +7 (Acting) | 42 |
| statements-excluded | +3 (Acting) | 39 |
| decay-off | −1 (Passive) | 133 |

## Questions of the country session

The readings the DEU session flagged are in docs/10 B-211; those it referred to P-15 are decided, for every country at once, in docs/calibration/README.md §6.
