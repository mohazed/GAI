# Calibration worksheet: India (IND)

Computed on 2026-11-28 with methodology 1.0.0-rc.1, by `pnpm calibrate --date 2026-11-28 --fts` on `data/phase1` at `63b4c8b` (task T-H-PREP of the launch-plan run, docs/10 B-2224; first computed on 2026-09-30 in P-15, re-computed on 2026-10-05 in T-P14, docs/10 B-487). **Provisional**: none of this country's hand-written events is published yet; the 1,515 events at status `reviewed` are scored as if published (the `--preview` reading of docs/06 §4), and the one `draft` event of the dataset is left out. The proposals 1.0.0-rc.2 (PR #15) and 1.0.0-rc.3 (PR #19) are not applied here; the effect of the rc.2 rules is in the table of proposals below. The numbers change when the author reviews and publishes the events; P-22 re-runs this worksheet on the published dataset before the score is shown.

**Score −9.4 → display −9 (Passive)**, position 152 of 193 scored entities. Passivity: not applied (qualifying: `evt_2025_12_31_IND_D3`, `evt_2026_02_25_IND_B10`, `evt_2026_02_26_IND_C2`, `evt_2026_05_14_IND_B9`, `evt_2026_09_24_IND_B9`). In the run of 2026-10-05 (date 2026-09-30): display −17 (Passive).

## Worksheet

One row per event in force on the date (counted, or set aside by a stacking rule), and one row per scored indicator without an event in force, with its assessment status. Points are shown as p × w × d = contribution (docs/02 §3–§4); generated events come from the structured tables (D-08).

| Indicator | Event(s) | Points | Confidence | Source (primary) | Notes |
|---|---|---|---|---|---|
| A1 | — | — | — | — | none found |
| A2 | `evt_2026_07_10_IND_A2_comtrade-2025-self`: India exported USD 48.5 million of goods under HS 93 to Israel in 2025, per its report to UN Comtrade. | −15.0 × 1.0 × 1 = −15.00 | confirmed | `src_20260928_comtrade_ind-self-2025-2` (dataset) | computed, 2026-07-10 to open; generated |
| A3 | — | — | — | — | none found |
| A4 | — | — | — | — | no data |
| A5 | — | — | — | — | none found |
| A6 | — | — | — | — | none found |
| A7 | — | — | — | — | none found |
| A8 | — | — | — | — | none found |
| B1 | `evt_2024_12_11_IND_B1_es-10-25`: India voted yes on General Assembly resolution A/RES/ES-10/25. | +3.0 × 1.0 × 0.2767 = +0.83 | confirmed | `src_20260928_undl_ga-voting-2025-03-31-corr1` (dataset) | dated 2024-12-11; generated |
| B1 | `evt_2024_12_11_IND_B1_es-10-26`: India voted yes on General Assembly resolution A/RES/ES-10/26. | +3.0 × 1.0 × 0.2767 = +0.83 | confirmed | `src_20260928_undl_ga-voting-2025-03-31-corr1` (dataset) | dated 2024-12-11; generated |
| B1 | `evt_2024_12_19_IND_B1_79-232`: India voted yes on General Assembly resolution A/RES/79/232. | +3.0 × 1.0 × 0.2932 = +0.88 | confirmed | `src_20260928_undl_ga-voting-2025-03-31-corr1` (dataset) | dated 2024-12-19; generated |
| B1 | `evt_2025_06_12_IND_B1_es-10-27`: India abstained on General Assembly resolution A/RES/ES-10/27. | −2.0 × 1.0 × 0.6527 = −1.31 | confirmed | `src_20261005_undl_voting-es-10-27` (dataset) | dated 2025-06-12; generated |
| B1 | `evt_2025_09_12_IND_B1_dec-80-506`: India voted yes on General Assembly decision A/DEC/80/506. | +3.0 × 1.0 × 0.8418 = +2.53 | confirmed | `src_20261005_undl_voting-a-dec-80-506` (dataset) | dated 2025-09-12; generated |
| B1 | `evt_2025_09_19_IND_B1_80-1`: India voted yes on General Assembly resolution A/RES/80/1. | +3.0 × 1.0 × 0.8562 = +2.57 | confirmed | `src_20261005_undl_voting-a-res-80-1` (dataset) | dated 2025-09-19; generated |
| B1 | `evt_2025_12_05_IND_B1_80-78`: India voted yes on General Assembly resolution A/RES/80/78. | +3.0 × 1.0 × 1 = +3.00 | confirmed | `src_20261005_undl_voting-a-res-80-78` (dataset) | dated 2025-12-05; generated |
| B1 | `evt_2025_12_12_IND_B1_80-116`: India voted yes on General Assembly resolution A/RES/80/116. | +3.0 × 1.0 × 1 = +3.00 | confirmed | `src_20261005_undl_voting-a-res-80-116` (dataset) | dated 2025-12-12; generated |
| B2 | — | — | — | — | not applicable |
| B3 | — | — | — | — | none found |
| B4 | — | — | — | — | none found |
| B5 | — | — | — | — | none found |
| B6 | — | — | — | — | none found |
| B7 | — | — | — | — | none found |
| B8 | `evt_2023_10_07_IND_B8_recognition`: India recognised the State of Palestine, before 7 October 2023. | +3.0 × 1.0 × 1 = +3.00 | confirmed | `src_20260930_mea_india-palestine-bilateral-relations` (official) | standing, 2023-10-07 to open; generated |
| B9 | `evt_2024_12_10_IND_B9`: The Minister of External Affairs told the India–Bahrain High Joint Commission that India called for an early ceasefire in Gaza and the release of all hostages. | +2.0 × 1.0 × 0.2747 = +0.55 | confirmed | `src_20241210_mea_eam-india-bahrain-hjc` (official) | dated 2024-12-10 |
| B9 | `evt_2025_09_27_IND_B9`: The Minister of External Affairs told the UN General Assembly that India called for an end to hostilities in the conflicts in Ukraine and Gaza. | +2.0 × 1.0 × 0.8726 = +1.75 | confirmed | `src_20250927_mea_eam-unga80-general-debate` (official) | dated 2025-09-27 |
| B9 | `evt_2026_05_14_IND_B9`: The Minister of External Affairs told the BRICS foreign ministers that a sustained ceasefire and humanitarian access in Gaza remained essential. | +2.0 × 1.0 × 1 = +2.00 | confirmed | `src_20260514_mea_eam-brics-fmm-statement` (official) | dated 2026-05-14; qualifies against passivity |
| B9 | `evt_2026_09_24_IND_B9`: The Minister of External Affairs, with the foreign ministers of Brazil and South Africa, urged all parties to maintain the ceasefire and ensure unhindered humanitarian access in the Gaza Strip. | +2.0 × 1.0 × 1 = +2.00 | confirmed | `src_20260928_mea_ibsa-14th-ministerial-media-statement` (official) | dated 2026-09-24; qualifies against passivity |
| B10 | `evt_2026_02_25_IND_B10`: The Prime Minister told the Knesset that India stood with Israel with full conviction, in this moment and beyond. | −5.0 × 1.0 × 1 = −5.00 | confirmed | `src_20260225_pmindia_pm-address-knesset` (official) | dated 2026-02-25; qualifies against passivity |
| B11 | — | — | — | — | none found |
| B12 | — | — | — | — | none found |
| C1 | — | — | — | — | none found |
| C2 | `evt_2025_09_08_IND_C2`: The government signed a bilateral investment agreement with the government of Israel in New Delhi. | −10.0 × 1.0 × 1 = −10.00 | confirmed | `src_20250908_pib_india-israel-investment-agreement` (official) | standing, 2025-09-08 to open |
| C2 | `evt_2025_11_04_IND_C2`: The Ministry of Defence signed a memorandum of understanding on defence cooperation with the Israeli Ministry of Defence in Tel Aviv. | −10.0 × 1.0 × 1 = −10.00 | confirmed | `src_20251104_pib_india-israel-defence-cooperation-mou` (official) | standing, 2025-11-04 to open |
| C2 | `evt_2026_02_26_IND_C2`: The government and Indian agencies signed fifteen agreements, memoranda and protocols with Israel, including three labour mobility protocols and a memorandum on geophysical exploration. | −10.0 × 1.0 × 1 = −10.00 | confirmed | `src_20260226_mea_india-israel-joint-statement` (official) | standing, 2026-02-26 to open; qualifies against passivity |
| C3 | `evt_2026_07_10_IND_C3_comtrade-2025-self`: India traded goods worth USD 3.5 billion with Israel in 2025, 34% of its 2022 level, per its report to UN Comtrade. | 0.0 × 1.0 × 1 = 0.00 | confirmed | `src_20260928_comtrade_ind-self-2025-2` (dataset) | computed, 2026-07-10 to open; generated |
| C4 | — | — | — | — | none found |
| C5 | — | — | — | — | none found |
| C6 | — | — | — | — | none found |
| D1 | `evt_2026_11_01_IND_D1_fts`: India paid or committed USD 24,528 to the oPt flash appeals in the 12 months to 31 October 2026, per FTS. | +1.0 × 1.0 × 1 = +1.00 | confirmed | `src_20261128_fts_plan-1186-p1` (dataset) | computed, 2026-11-01 to 2026-12-01; generated |
| D2 | — | — | — | — | none found |
| D3 | `evt_2025_12_31_IND_D3`: India's contribution to UNRWA for 2025 exceeded its 2022 contribution in UNRWA's donor tables. | +8.0 × 1.0 × 1 = +8.00 | confirmed | `src_20251231_unrwa_donor-ranking-2025` (dataset) | standing, 2025-12-31 to open; qualifies against passivity |
| D4 | — | — | — | — | none found |
| D5 | — | — | — | — | none found |

## Score by category

| Category | Sum of indicators | Cap | Clipped |
|---|---|---|---|
| A Arms & military | −15.00 | −45 … +30 | −15.00 |
| B Diplomacy & international law | +16.62 | −40 … +45 | +16.62 |
| C Trade & economy | −30.00 | −20 … +20 | −20.00 |
| D Humanitarian | +9.00 | −15 … +25 | +9.00 |

raw = −15.00 +16.62 −20.00 +9.00 − 0 (passivity) = −9.38; S = clip(raw, −100, +100) = −9.38; display −9; band Passive (docs/02 §7: Sustaining ≤ −51, Enabling −50…−21, Passive −20…0, Acting 1…40, Confronting ≥ 41).

## What drives this score

1. **C2 −30.00**: `evt_2025_09_08_IND_C2`, `evt_2025_11_04_IND_C2`, `evt_2026_02_26_IND_C2`.
2. **A2 −15.00**: `evt_2026_07_10_IND_A2_comtrade-2025-self`.
3. **B1 +12.33**: `evt_2024_12_11_IND_B1_es-10-25`, `evt_2024_12_11_IND_B1_es-10-26`, `evt_2024_12_19_IND_B1_79-232`, `evt_2025_06_12_IND_B1_es-10-27`, `evt_2025_09_12_IND_B1_dec-80-506`, `evt_2025_09_19_IND_B1_80-1`, `evt_2025_12_05_IND_B1_80-78`, `evt_2025_12_12_IND_B1_80-116`.

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

- A4 is `no-data`: the SIPRI trade register of the release of 9 March 2026 lists orders placed with Israel in 2025 whose "SIPRI TIV for total order" is 0 (the number ordered is not yet known, or the order is below 0.5 TIV), so formula a4 (TIV > 0) cannot be decided (docs/10 B-488).
- B1 counts all 12 qualifying votes; A1 and A4 read the SIPRI release of 9 March 2026 (docs/10 B-487); D1 reads fts_funding.csv to October 2026 (T-H-STRUCT, docs/10 B-2177). The structured tables are complete for this country on this date, except as above.

## Effect of the proposals on this country

Display score on 2026-11-28 under each proposal measured in docs/calibration/README.md §4 (rc.1: −9, Passive); the last column gives the largest change of this country's display score at a quarter end since 2023-10-07.

| Proposal | Display (band) | Change | Largest change in the history |
|---|---|---|---|
| b21: official-video and parliamentary sources count for confirmed (B-21) | −9 (Passive) | 0 | none |
| b22: most severe stacking for A3, A6, A7, B3, B7, D2 (B-22, B-51) | −9 (Passive) | 0 | none |
| b23: B1 capped at +15 (B-23, one option) | −9 (Passive) | 0 | +2 → −2 (2025-12-31) |
| b23-sym: B1 capped at −15 and +15 (B-23, symmetric option) | −9 (Passive) | 0 | +2 → −2 (2025-12-31) |
| b46: only contributions of +2 or more qualify (B-46) | −9 (Passive) | 0 | none |
| b47: pre-existing B8 tier does not qualify (B-47) | −9 (Passive) | 0 | −18 → −33 (2024-06-30) |
| b48-alt: alternative to B-48: a standing state qualifies while it holds | −9 (Passive) | 0 | none |
| b46+b47: B-46 and B-47 together | −9 (Passive) | 0 | −19 → −34 (2023-12-31) |
| b8-pre: pre-existing recognitions of the registry as B8 +3 (B-199 (3) alternative) | −9 (Passive) | 0 | none |
| b8-pre+b47: pre-existing B8 +3 rows, with B-47 | −9 (Passive) | 0 | −18 → −33 (2024-06-30) |
| trade-no-2022: A2 and C3 values of data year 2022 not in force in the window (P-04, B-63) | −9 (Passive) | 0 | −19 → +4 (2023-12-31) |
| d1-postwar: D1 from FTS flows dated on or after 2023-10-07 only (P-04, B-60) | −9 (Passive) | 0 | none |
| proposal: the recommended set: B-21, B-22, B-23 (B1 within −15…+15), B-46, B-47, no 2022 trade values, D1 from post-war flows | −9 (Passive) | 0 | −18 → −33 (2024-06-30) |

## Sensitivity (docs/02 §10)

Position among the 193 scored entities (1 = highest), display score and band under each sensitivity variant.

| Variant | Display (band) | Position |
|---|---|---|
| rc.1 default | −9 (Passive) | 152 |
| passivity-5 | −9 (Passive) | 161 |
| passivity-15 | −9 (Passive) | 152 |
| passivity-25 | −9 (Passive) | 129 |
| weight-A-0.5 | −2 (Passive) | 136 |
| weight-A-1.5 | −17 (Passive) | 164 |
| weight-B-0.5 | −18 (Passive) | 165 |
| weight-B-1.5 | −1 (Passive) | 145 |
| weight-C-0.5 | +1 (Acting) | 125 |
| weight-C-1.5 | −19 (Passive) | 163 |
| weight-D-0.5 | −14 (Passive) | 161 |
| weight-D-1.5 | −5 (Passive) | 145 |
| reported-0.2 | −9 (Passive) | 152 |
| reported-0.6 | −9 (Passive) | 152 |
| statements-excluded | −11 (Passive) | 152 |
| decay-off | +3 (Acting) | 142 |

## Questions of the country session

The readings the IND session flagged are in docs/10 B-249; those it referred to P-15 are decided, for every country at once, in docs/calibration/README.md §6.
