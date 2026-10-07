# Calibration worksheet: Germany (DEU)

Computed on 2026-09-30 with methodology 1.0.0-rc.1, by `pnpm calibrate --date 2026-09-30 --fts` (P-15, docs/08 §3; re-run on 2026-10-05 after the import of the five later votes and of the SIPRI release of 9 March 2026, T-P14, docs/10 B-487). **Provisional**: none of this country's hand-written events is published yet; the 773 events at status `reviewed` are scored as if published (the `--preview` reading of docs/06 §4), and the one `draft` event of the dataset is left out. The numbers change when the author reviews and publishes the events; P-22 re-runs this worksheet on the published dataset before the score is shown.

**Score +5.1 → display +5 (Acting)**, position 53 of 193 scored entities (148 of which have only generated events so far). Passivity: not applied (qualifying: `evt_2026_01_11_DEU_C2`, `evt_2026_05_20_DEU_C3_comtrade-2025-self`, `evt_2026_05_28_DEU_B11`, `evt_2026_09_01_DEU_D1_fts`).

## Worksheet

One row per event in force on the date (counted, or set aside by a stacking rule), and one row per scored indicator without an event in force, with its assessment status. Points are shown as p × w × d = contribution (docs/02 §3–§4); generated events come from the structured tables (D-08).

| Indicator | Event(s) | Points | Confidence | Source (primary) | Notes |
|---|---|---|---|---|---|
| A1 | `evt_2026_03_09_DEU_A1_tiv-2025`: Germany delivered 6.7% of Israel's imports of major arms in 2025, per SIPRI TIV. | −10.4 × 1.0 × 1 = −10.40 | confirmed | `src_20261005_sipri_tiv-israel-2022-2025` (dataset) | computed, 2026-03-09 to open; generated |
| A2 | `evt_2026_05_20_DEU_A2_comtrade-2025-self`: Germany exported USD 649,550 of goods under HS 93 to Israel in 2025, per its report to UN Comtrade. | −3.0 × 1.0 × 1 = −3.00 | confirmed | `src_20260927_comtrade_deu-self-2025` (dataset) | computed, 2026-05-20 to open; generated |
| A3 | — | — | — | — | none found |
| A4 | `evt_2026_03_09_DEU_A4_orders-2025`: Germany ordered major arms from Israel in 2025 worth 281 TIV, per SIPRI. | −10.0 × 1.0 × 1 = −10.00 | confirmed | `src_20261005_sipri_register-supplier-israel` (dataset) | computed, 2026-03-09 to open; generated |
| A5 | — | — | — | — | has events; 1 event(s) recorded, none in force on 2026-09-30 |
| A6 | — | — | — | — | has events; 1 event(s) recorded, none in force on 2026-09-30 |
| A7 | — | — | — | — | none found |
| A8 | — | — | — | — | none found |
| B1 | `evt_2024_12_11_DEU_B1_es-10-25`: Germany voted yes on General Assembly resolution A/RES/ES-10/25. | +3.0 × 1.0 × 0.3979 = +1.19 | confirmed | `src_20260928_undl_ga-voting-2025-03-31-corr1` (dataset) | dated 2024-12-11; generated |
| B1 | `evt_2024_12_11_DEU_B1_es-10-26`: Germany voted yes on General Assembly resolution A/RES/ES-10/26. | +3.0 × 1.0 × 0.3979 = +1.19 | confirmed | `src_20260928_undl_ga-voting-2025-03-31-corr1` (dataset) | dated 2024-12-11; generated |
| B1 | `evt_2024_12_19_DEU_B1_79-232`: Germany voted yes on General Assembly resolution A/RES/79/232. | +3.0 × 1.0 × 0.4144 = +1.24 | confirmed | `src_20260928_undl_ga-voting-2025-03-31-corr1` (dataset) | dated 2024-12-19; generated |
| B1 | `evt_2025_06_12_DEU_B1_es-10-27`: Germany voted yes on General Assembly resolution A/RES/ES-10/27. | +3.0 × 1.0 × 0.7740 = +2.32 | confirmed | `src_20261005_undl_voting-es-10-27` (dataset) | dated 2025-06-12; generated |
| B1 | `evt_2025_09_12_DEU_B1_dec-80-506`: Germany voted yes on General Assembly decision A/DEC/80/506. | +3.0 × 1.0 × 0.9630 = +2.89 | confirmed | `src_20261005_undl_voting-a-dec-80-506` (dataset) | dated 2025-09-12; generated |
| B1 | `evt_2025_09_19_DEU_B1_80-1`: Germany voted yes on General Assembly resolution A/RES/80/1. | +3.0 × 1.0 × 0.9774 = +2.93 | confirmed | `src_20261005_undl_voting-a-res-80-1` (dataset) | dated 2025-09-19; generated |
| B1 | `evt_2025_12_05_DEU_B1_80-78`: Germany abstained on General Assembly resolution A/RES/80/78. | −2.0 × 1.0 × 1.0000 = −2.00 | confirmed | `src_20261005_undl_voting-a-res-80-78` (dataset) | dated 2025-12-05; generated |
| B1 | `evt_2025_12_12_DEU_B1_80-116`: Germany voted yes on General Assembly resolution A/RES/80/116. | +3.0 × 1.0 × 1.0000 = +3.00 | confirmed | `src_20261005_undl_voting-a-res-80-116` (dataset) | dated 2025-12-12; generated |
| B2 | — | — | — | — | not applicable |
| B3 | — | — | — | — | none found |
| B4 | — | — | — | — | none found |
| B5 | — | — | — | — | none found |
| B6 | — | — | — | — | none found |
| B7 | — | — | — | — | none found |
| B8 | — | — | — | — | none found |
| B9 | `evt_2024_10_26_DEU_B9`: The Federal Foreign Minister joined six foreign ministers in urging Israel to keep UNRWA's privileges and immunities and to facilitate unhindered humanitarian assistance. | +2.0 × 1.0 × 0.3034 = +0.61 | confirmed | `src_20241026_gac_joint-statement-unrwa-legislation` (official) | dated 2024-10-26 |
| B9 | `evt_2025_07_25_DEU_B9`: The Federal Chancellor, with the leaders of France and the United Kingdom, called for an immediate ceasefire and for Israel to lift restrictions on aid to act against starvation. | +5.0 × 1.0 × 0.8623 = +4.31 | confirmed | `src_20250725_bundesregierung_e3-declaration-gaza` (official) | dated 2025-07-25 |
| B9 | `evt_2025_08_09_DEU_B9`: The Federal Foreign Minister, with other foreign ministers, rejected the Israeli decision to launch a further military operation in Gaza and urged an immediate and permanent ceasefire. | +2.0 × 1.0 × 0.8932 = +1.79 | confirmed | `src_20250809_fm-gov-au_joint-statement-offensive` (official) | dated 2025-08-09 |
| B9 | `evt_2025_09_27_DEU_B9`: The Federal Foreign Minister told the General Assembly that the war in Gaza had to be ended and the hostages released. | +2.0 × 1.0 × 0.9938 = +1.99 | confirmed | `src_20250927_auswaertiges-amt_wadephul-generaldebatte` (official) | dated 2025-09-27 |
| B10 | — | — | — | — | has events; 1 event(s) recorded, none in force on 2026-09-30 |
| B11 | `evt_2024_07_15_DEU_B11`: The government agreed in the EU Council to sanctions on five Israeli settlers and activists and three entities, including a group blocking aid trucks bound for Gaza. | +5.0 × 1.0 × 1 = +5.00 | confirmed | `src_20240715_consilium_settlers-tzav9-sanctions` (official) | standing, 2024-07-15 to open |
| B11 | `evt_2026_05_28_DEU_B11`: The government agreed in the EU Council to sanctions on three Israeli settler leaders and four settler organisations, one of them for efforts to resettle the Gaza Strip. | +5.0 × 1.0 × 1 = +5.00 | confirmed | `src_20260528_eur-lex_reg-impl-2026-1177` (official) | set aside: same-tier (`evt_2024_07_15_DEU_B11`); standing, 2026-05-28 to open; qualifies against passivity |
| B12 | — | — | — | — | none found |
| C1 | — | — | — | — | none found |
| C2 | `evt_2026_01_11_DEU_C2`: The Federal Minister of the Interior and the Prime Minister of Israel signed a joint declaration on cooperation in a cyber and security pact. | −10.0 × 0.4 × 1 = −4.00 | reported | `src_20260223_bundestag_drs-21-4306-cyberpakt` (parliamentary) | standing, 2026-01-11 to open; qualifies against passivity |
| C3 | `evt_2026_05_20_DEU_C3_comtrade-2025-self`: Germany traded goods worth USD 9.9 billion with Israel in 2025, 109% of its 2022 level, per its report to UN Comtrade. | −5.0 × 1.0 × 1 = −5.00 | confirmed | `src_20260927_comtrade_deu-self-2025` (dataset) | computed, 2026-05-20 to open; qualifies against passivity; generated |
| C4 | — | — | — | — | none found |
| C5 | — | — | — | — | none found |
| C6 | — | — | — | — | none found |
| D1 | `evt_2026_09_01_DEU_D1_fts`: Germany paid or committed USD 105.1 million to the oPt flash appeals in the 12 months to 31 August 2026, per FTS. | +6.0 × 1.0 × 1 = +6.00 | confirmed | `src_20260928_fts_plan-1186-p1` (dataset) | computed, 2026-09-01 to 2026-10-01; qualifies against passivity; generated |
| D2 | — | — | — | — | has events; 1 event(s) recorded, none in force on 2026-09-30 |
| D3 | `evt_2024_04_24_DEU_D3`: The Federal Foreign Office and the development ministry announced that the federal government would shortly continue its cooperation with UNRWA in Gaza. | +5.0 × 1.0 × 1 = +5.00 | confirmed | `src_20240424_auswaertiges-amt_unrwa-fortsetzung` (official) | standing, 2024-04-24 to open |
| D4 | — | — | — | — | none found |
| D5 | — | — | — | — | none found |

## Score by category

| Category | Sum of indicators | Cap | Clipped |
|---|---|---|---|
| A Arms & military | −23.40 | −45 … +30 | −23.40 |
| B Diplomacy & international law | +26.47 | −40 … +45 | +26.47 |
| C Trade & economy | −9.00 | −20 … +20 | −9.00 |
| D Humanitarian | +11.00 | −15 … +25 | +11.00 |

raw = −23.40 +26.47 −9.00 +11.00 − 0 (passivity) = +5.07; S = clip(raw, −100, +100) = +5.07; display +5; band Acting (docs/02 §7: Sustaining ≤ −51, Enabling −50…−21, Passive −20…0, Acting 1…40, Confronting ≥ 41).

## What drives this score

1. **B1 +12.77**: `evt_2024_12_11_DEU_B1_es-10-25`, `evt_2024_12_11_DEU_B1_es-10-26`, `evt_2024_12_19_DEU_B1_79-232`, `evt_2025_06_12_DEU_B1_es-10-27`, `evt_2025_09_12_DEU_B1_dec-80-506`, `evt_2025_09_19_DEU_B1_80-1`, `evt_2025_12_05_DEU_B1_80-78`, `evt_2025_12_12_DEU_B1_80-116`.
2. **A1 −10.40**: `evt_2026_03_09_DEU_A1_tiv-2025`.
3. **A4 −10.00**: `evt_2026_03_09_DEU_A4_orders-2025`.

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

- B1 counts all 12 qualifying votes; A1 and A4 read the SIPRI release of 9 March 2026 (docs/10 B-487). The structured tables are complete for this country on this date.

## Effect of the proposals on this country

Display score on 2026-09-30 under each proposal measured in docs/calibration/README.md §4 (rc.1: +5, Acting); the last column gives the largest change of this country's display score at a quarter end since 2023-10-07.

| Proposal | Display (band) | Change | Largest change in the history |
|---|---|---|---|
| b21: official-video and parliamentary sources count for confirmed (B-21) | −1 (Passive) | −6 | +9 → +3 (2026-03-31) |
| b22: most severe stacking for A3, A6, A7, B3, B7, D2 (B-22, B-51) | +5 (Acting) | 0 | none |
| b23: B1 capped at +15 (B-23, one option) | +5 (Acting) | 0 | +34 → +33 (2025-12-31) |
| b23-sym: B1 capped at −15 and +15 (B-23, symmetric option) | +5 (Acting) | 0 | +34 → +33 (2025-12-31) |
| b46: only contributions of +2 or more qualify (B-46) | +5 (Acting) | 0 | none |
| b47: pre-existing B8 tier does not qualify (B-47) | +5 (Acting) | 0 | none |
| b48-alt: alternative to B-48: a standing state qualifies while it holds | +5 (Acting) | 0 | none |
| b46+b47: B-46 and B-47 together | +5 (Acting) | 0 | none |
| b8-pre: pre-existing recognitions of the registry as B8 +3 (B-199 (3) alternative) | +5 (Acting) | 0 | none |
| b8-pre+b47: pre-existing B8 +3 rows, with B-47 | +5 (Acting) | 0 | none |
| trade-no-2022: A2 and C3 values of data year 2022 not in force in the window (P-04, B-63) | +5 (Acting) | 0 | −11 → −3 (2023-12-31) |
| d1-postwar: D1 from FTS flows dated on or after 2023-10-07 only (P-04, B-60) | +5 (Acting) | 0 | none |
| proposal: the recommended set: B-21, B-22, B-23 (B1 within −15…+15), B-46, B-47, no 2022 trade values, D1 from post-war flows | −1 (Passive) | −6 | −11 → −3 (2023-12-31) |

## Sensitivity (docs/02 §10)

Position among the 193 scored entities (1 = highest), display score and band under each sensitivity variant.

| Variant | Display (band) | Position |
|---|---|---|
| rc.1 default | +5 (Acting) | 53 |
| passivity-5 | +5 (Acting) | 134 |
| passivity-15 | +5 (Acting) | 53 |
| passivity-25 | +5 (Acting) | 45 |
| weight-A-0.5 | +17 (Acting) | 44 |
| weight-A-1.5 | −7 (Passive) | 139 |
| weight-B-0.5 | −8 (Passive) | 110 |
| weight-B-1.5 | +18 (Acting) | 51 |
| weight-C-0.5 | +10 (Acting) | 52 |
| weight-C-1.5 | +1 (Acting) | 108 |
| weight-D-0.5 | 0 (Passive) | 109 |
| weight-D-1.5 | +11 (Acting) | 51 |
| reported-0.2 | +7 (Acting) | 51 |
| reported-0.6 | +3 (Acting) | 56 |
| statements-excluded | −4 (Passive) | 132 |
| decay-off | −5 (Passive) | 148 |

## Questions of the country session

The readings the DEU session flagged are in docs/10 B-211; those it referred to P-15 are decided, for every country at once, in docs/calibration/README.md §6.
