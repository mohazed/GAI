# Calibration worksheet: France (FRA)

Computed on 2026-09-30 with methodology 1.0.0-rc.1, by `pnpm calibrate --date 2026-09-30 --fts` (P-15, docs/08 §3; re-run on 2026-10-05 after the import of the five later votes and of the SIPRI release of 9 March 2026, T-P14, docs/10 B-487). **Provisional**: none of this country's hand-written events is published yet; the 773 events at status `reviewed` are scored as if published (the `--preview` reading of docs/06 §4), and the one `draft` event of the dataset is left out. The numbers change when the author reviews and publishes the events; P-22 re-runs this worksheet on the published dataset before the score is shown.

**Score +53.8 → display +54 (Confronting)**, position 10 of 193 scored entities (148 of which have only generated events so far). Passivity: not applied (qualifying: `evt_2025_12_05_FRA_B9`, `evt_2025_12_30_FRA_B9`, `evt_2026_01_28_FRA_B9`, `evt_2026_05_23_FRA_B11`, `evt_2026_05_28_FRA_B11`, `evt_2026_06_08_FRA_B9`, `evt_2026_07_16_FRA_C3_comtrade-2025-self`, `evt_2026_09_01_FRA_D1_fts`).

## Worksheet

One row per event in force on the date (counted, or set aside by a stacking rule), and one row per scored indicator without an event in force, with its assessment status. Points are shown as p × w × d = contribution (docs/02 §3–§4); generated events come from the structured tables (D-08).

| Indicator | Event(s) | Points | Confidence | Source (primary) | Notes |
|---|---|---|---|---|---|
| A1 | — | — | — | — | none found; the SIPRI release of 2026-03-09 lists no delivery to Israel in 2025 (s = 0) |
| A2 | `evt_2026_07_16_FRA_A2_comtrade-2025-self`: France exported USD 64,176 of goods under HS 93 to Israel in 2025, per its report to UN Comtrade. | 0.0 × 1.0 × 1 = 0.00 | confirmed | `src_20260928_comtrade_fra-self-2025` (dataset) | computed, 2026-07-16 to open; generated |
| A3 | — | — | — | — | none found |
| A4 | — | — | — | — | none found; the SIPRI release of 2026-03-09 lists no order placed with Israel in 2025 |
| A5 | — | — | — | — | none found |
| A6 | — | — | — | — | none found |
| A7 | — | — | — | — | none found |
| A8 | — | — | — | — | none found |
| B1 | `evt_2024_12_11_FRA_B1_es-10-25`: France voted yes on General Assembly resolution A/RES/ES-10/25. | +3.0 × 1.0 × 0.3979 = +1.19 | confirmed | `src_20260928_undl_ga-voting-2025-03-31-corr1` (dataset) | dated 2024-12-11; generated |
| B1 | `evt_2024_12_11_FRA_B1_es-10-26`: France voted yes on General Assembly resolution A/RES/ES-10/26. | +3.0 × 1.0 × 0.3979 = +1.19 | confirmed | `src_20260928_undl_ga-voting-2025-03-31-corr1` (dataset) | dated 2024-12-11; generated |
| B1 | `evt_2024_12_19_FRA_B1_79-232`: France voted yes on General Assembly resolution A/RES/79/232. | +3.0 × 1.0 × 0.4144 = +1.24 | confirmed | `src_20260928_undl_ga-voting-2025-03-31-corr1` (dataset) | dated 2024-12-19; generated |
| B1 | `evt_2025_06_12_FRA_B1_es-10-27`: France voted yes on General Assembly resolution A/RES/ES-10/27. | +3.0 × 1.0 × 0.7740 = +2.32 | confirmed | `src_20261005_undl_voting-es-10-27` (dataset) | dated 2025-06-12; generated |
| B1 | `evt_2025_09_12_FRA_B1_dec-80-506`: France voted yes on General Assembly decision A/DEC/80/506. | +3.0 × 1.0 × 0.9630 = +2.89 | confirmed | `src_20261005_undl_voting-a-dec-80-506` (dataset) | dated 2025-09-12; generated |
| B1 | `evt_2025_09_19_FRA_B1_80-1`: France voted yes on General Assembly resolution A/RES/80/1. | +3.0 × 1.0 × 0.9774 = +2.93 | confirmed | `src_20261005_undl_voting-a-res-80-1` (dataset) | dated 2025-09-19; generated |
| B1 | `evt_2025_12_05_FRA_B1_80-78`: France voted yes on General Assembly resolution A/RES/80/78. | +3.0 × 1.0 × 1.0000 = +3.00 | confirmed | `src_20261005_undl_voting-a-res-80-78` (dataset) | dated 2025-12-05; generated |
| B1 | `evt_2025_12_12_FRA_B1_80-116`: France voted yes on General Assembly resolution A/RES/80/116. | +3.0 × 1.0 × 1.0000 = +3.00 | confirmed | `src_20261005_undl_voting-a-res-80-116` (dataset) | dated 2025-12-12; generated |
| B2 | — | — | — | — | none found |
| B3 | — | — | — | — | none found |
| B4 | — | — | — | — | none found |
| B5 | — | — | — | — | none found |
| B6 | `evt_2024_11_27_FRA_B6`: The Ministry for Europe and Foreign Affairs stated that immunities of states not party to the ICC apply to Prime Minister Netanyahu and would have to be considered if the ICC requested his arrest. | −10.0 × 1.0 × 1 = −10.00 | confirmed | `src_20241127_diplomatie-gouv_cpi-immunites` (official) | standing, 2024-11-27 to open |
| B7 | — | — | — | — | none found |
| B8 | `evt_2025_09_22_FRA_B8_recognition`: France recognised the State of Palestine. | +8.0 × 1.0 × 1 = +8.00 | confirmed | `src_20250922_diplomatie-gouv_reconnaissance-palestine` (official) | standing, 2025-09-22 to open; generated |
| B9 | `evt_2024_10_26_FRA_B9`: The Minister for Europe and Foreign Affairs joined six foreign ministers in urging Israel to keep UNRWA's privileges and immunities and to facilitate unhindered humanitarian assistance. | +2.0 × 1.0 × 0.3034 = +0.61 | confirmed | `src_20241026_gac_joint-statement-unrwa-legislation` (official) | dated 2024-10-26 |
| B9 | `evt_2025_05_19_FRA_B9`: The President of the Republic, with the leaders of the United Kingdom and Canada, said the denial of essential aid risked breaching humanitarian law and asked Israel to stop its operations in Gaza. | +5.0 × 1.0 × 0.7247 = +3.62 | confirmed | `src_20250519_elysee_declaration-gaza-cisjordanie` (official) | dated 2025-05-19 |
| B9 | `evt_2025_07_21_FRA_B9`: The Minister for Europe and Foreign Affairs, with other foreign ministers, said the war in Gaza must end now and called forced displacement a violation of international humanitarian law. | +5.0 × 1.0 × 0.8541 = +4.27 | confirmed | `src_20250721_fm-gov-au_joint-statement-opt` (official) | dated 2025-07-21 |
| B9 | `evt_2025_07_25_FRA_B9`: The President of the Republic, with the leaders of Germany and the United Kingdom, called for an immediate ceasefire and for Israel to lift restrictions on aid and respect humanitarian law. | +5.0 × 1.0 × 0.8623 = +4.31 | confirmed | `src_20250725_elysee_declaration-e3-gaza` (official) | dated 2025-07-25 |
| B9 | `evt_2025_08_09_FRA_B9`: The Minister for Europe and Foreign Affairs, with other foreign ministers, rejected the Israeli decision to launch a further military operation in Gaza and urged an immediate and permanent ceasefire. | +2.0 × 1.0 × 0.8932 = +1.79 | confirmed | `src_20250809_fm-gov-au_joint-statement-offensive` (official) | dated 2025-08-09 |
| B9 | `evt_2025_08_12_FRA_B9`: The Minister for Europe and Foreign Affairs, with other foreign ministers, said that famine was unfolding in Gaza and called for urgent action to halt starvation. | +5.0 × 1.0 × 0.8993 = +4.50 | confirmed | `src_20250812_fm-gov-au_joint-statement-humanitarian` (official) | dated 2025-08-12 |
| B9 | `evt_2025_09_22_FRA_B9`: The President of the Republic told the UN General Assembly that nothing justified continuing the war in Gaza and called for an immediate end to the war and the bombing. | +5.0 × 1.0 × 0.9836 = +4.92 | confirmed | `src_20250922_elysee_agnu-80-reconnaissance` (official) | dated 2025-09-22 |
| B9 | `evt_2025_09_27_FRA_B9`: The Minister for Europe and Foreign Affairs, with other foreign ministers, urged Israel to lift restrictions on medicine for Gaza and to restore the medical corridor to the West Bank. | +2.0 × 1.0 × 0.9938 = +1.99 | confirmed | `src_20250927_fm-gov-au_joint-statement-gaza-patients` (official) | dated 2025-09-27 |
| B9 | `evt_2025_12_05_FRA_B9`: The President of the Republic and the President of the People's Republic of China called on all parties to implement the Gaza ceasefire and for unimpeded aid throughout the Gaza Strip. | +2.0 × 1.0 × 1.0000 = +2.00 | confirmed | `src_20251205_mfa-cn_china-france-joint-statement` (official) | dated 2025-12-05; qualifies against passivity |
| B9 | `evt_2025_12_30_FRA_B9`: The Minister for Europe and Foreign Affairs, with nine other foreign ministers, called on Israel to open the crossings into Gaza and to lift the obstacles to humanitarian access. | +2.0 × 1.0 × 1.0000 = +2.00 | confirmed | `src_20251230_diplomatie-gouv_reponse-humanitaire-gaza` (official) | dated 2025-12-30; qualifies against passivity |
| B9 | `evt_2026_01_28_FRA_B9`: The Minister for Europe and Foreign Affairs, with ten other foreign ministers, condemned the demolition of UNRWA premises in East Jerusalem and called on Israel to facilitate aid to Gaza. | +2.0 × 1.0 × 1.0000 = +2.00 | confirmed | `src_20260128_gac_joint-statement-unrwa` (official) | dated 2026-01-28; qualifies against passivity |
| B9 | `evt_2026_06_08_FRA_B9`: The Minister for Europe and Foreign Affairs joined a joint statement calling on Israel to comply with international humanitarian law and allow humanitarian access in Gaza. | +2.0 × 1.0 × 1.0000 = +2.00 | confirmed | `src_20260608_diplomatie-belgium_joint-statement-ingos` (official) | dated 2026-06-08; qualifies against passivity |
| B9 | indicator cap | sum +34.00 → +10.00 | | | indicator-level cap (docs/02 §2) |
| B10 | — | — | — | — | none found |
| B11 | `evt_2024_07_15_FRA_B11`: The government agreed in the EU Council to sanctions on five Israeli settlers and activists and three entities, including a group blocking aid trucks bound for Gaza. | +5.0 × 1.0 × 1 = +5.00 | confirmed | `src_20240715_consilium_settlers-tzav9-sanctions` (official) | standing, 2024-07-15 to open |
| B11 | `evt_2026_05_23_FRA_B11`: The Minister for Europe and Foreign Affairs barred Israeli minister Itamar Ben-Gvir from French territory after the treatment of French members of a Gaza flotilla; Bezalel Smotrich followed in June. | +10.0 × 1.0 × 1 = +10.00 | confirmed | `src_20260529_diplomatie-gouv_france-inter-barrot` (official) | standing, 2026-05-23 to open; qualifies against passivity |
| B11 | `evt_2026_05_28_FRA_B11`: The government agreed in the EU Council to sanctions on three Israeli settler leaders and four settler organisations, one of them for efforts to resettle the Gaza Strip. | +5.0 × 1.0 × 1 = +5.00 | confirmed | `src_20260528_eur-lex_reg-impl-2026-1177` (official) | set aside: same-tier (`evt_2024_07_15_FRA_B11`); standing, 2026-05-28 to open; qualifies against passivity |
| B12 | — | — | — | — | none found |
| C1 | `evt_2025_05_20_FRA_C1`: The government called in the EU Foreign Affairs Council for a review of the EU–Israel Association Agreement and welcomed the High Representative's announcement of that review. | +4.0 × 1.0 × 1 = +4.00 | confirmed | `src_20250520_diplomatie-gouv_cae-accord-association` (official) | standing, 2025-05-20 to open |
| C2 | — | — | — | — | none found |
| C3 | `evt_2026_07_16_FRA_C3_comtrade-2025-self`: France traded goods worth USD 3.6 billion with Israel in 2025, 95% of its 2022 level, per its report to UN Comtrade. | −5.0 × 1.0 × 1 = −5.00 | confirmed | `src_20260928_comtrade_fra-self-2025` (dataset) | computed, 2026-07-16 to open; qualifies against passivity; generated |
| C4 | — | — | — | — | none found |
| C5 | — | — | — | — | none found |
| C6 | — | — | — | — | none found |
| D1 | `evt_2026_09_01_FRA_D1_fts`: France paid or committed USD 72.0 million to the oPt flash appeals in the 12 months to 31 August 2026, per FTS. | +6.0 × 1.0 × 1 = +6.00 | confirmed | `src_20260928_fts_plan-1186-p1` (dataset) | computed, 2026-09-01 to 2026-10-01; qualifies against passivity; generated |
| D2 | — | — | — | — | has events; 1 event(s) recorded, none in force on 2026-09-30 |
| D3 | `evt_2024_12_31_FRA_D3`: France contributed more to UNRWA in 2024 than in 2022, according to UNRWA's donor tables. | +8.0 × 1.0 × 1 = +8.00 | confirmed | `src_20241231_unrwa_donor-ranking-2024` (dataset) | standing, 2024-12-31 to open |
| D4 | — | — | — | — | has events; 2 event(s) recorded, none in force on 2026-09-30 |
| D5 | — | — | — | — | none found |

## Score by category

| Category | Sum of indicators | Cap | Clipped |
|---|---|---|---|
| A Arms & military | 0.00 | −45 … +30 | 0.00 |
| B Diplomacy & international law | +40.77 | −40 … +45 | +40.77 |
| C Trade & economy | −1.00 | −20 … +20 | −1.00 |
| D Humanitarian | +14.00 | −15 … +25 | +14.00 |

raw = 0.00 +40.77 −1.00 +14.00 − 0 (passivity) = +53.77; S = clip(raw, −100, +100) = +53.77; display +54; band Confronting (docs/02 §7: Sustaining ≤ −51, Enabling −50…−21, Passive −20…0, Acting 1…40, Confronting ≥ 41).

## What drives this score

1. **B1 +17.77**: `evt_2024_12_11_FRA_B1_es-10-25`, `evt_2024_12_11_FRA_B1_es-10-26`, `evt_2024_12_19_FRA_B1_79-232`, `evt_2025_06_12_FRA_B1_es-10-27`, `evt_2025_09_12_FRA_B1_dec-80-506`, `evt_2025_09_19_FRA_B1_80-1`, `evt_2025_12_05_FRA_B1_80-78`, `evt_2025_12_12_FRA_B1_80-116`.
2. **B11 +15.00**: `evt_2024_07_15_FRA_B11`, `evt_2026_05_23_FRA_B11`.
3. **B6 −10.00**: `evt_2024_11_27_FRA_B6`.

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

Display score on 2026-09-30 under each proposal measured in docs/calibration/README.md §4 (rc.1: +54, Confronting); the last column gives the largest change of this country's display score at a quarter end since 2023-10-07.

| Proposal | Display (band) | Change | Largest change in the history |
|---|---|---|---|
| b21: official-video and parliamentary sources count for confirmed (B-21) | +54 (Confronting) | 0 | none |
| b22: most severe stacking for A3, A6, A7, B3, B7, D2 (B-22, B-51) | +54 (Confronting) | 0 | none |
| b23: B1 capped at +15 (B-23, one option) | +51 (Confronting) | −3 | +59 → +46 (2025-12-31) |
| b23-sym: B1 capped at −15 and +15 (B-23, symmetric option) | +51 (Confronting) | −3 | +59 → +46 (2025-12-31) |
| b46: only contributions of +2 or more qualify (B-46) | +54 (Confronting) | 0 | none |
| b47: pre-existing B8 tier does not qualify (B-47) | +54 (Confronting) | 0 | none |
| b48-alt: alternative to B-48: a standing state qualifies while it holds | +54 (Confronting) | 0 | none |
| b46+b47: B-46 and B-47 together | +54 (Confronting) | 0 | none |
| b8-pre: pre-existing recognitions of the registry as B8 +3 (B-199 (3) alternative) | +54 (Confronting) | 0 | none |
| b8-pre+b47: pre-existing B8 +3 rows, with B-47 | +54 (Confronting) | 0 | none |
| trade-no-2022: A2 and C3 values of data year 2022 not in force in the window (P-04, B-63) | +54 (Confronting) | 0 | +24 → +29 (2023-12-31) |
| d1-postwar: D1 from FTS flows dated on or after 2023-10-07 only (P-04, B-60) | +54 (Confronting) | 0 | none |
| proposal: the recommended set: B-21, B-22, B-23 (B1 within −15…+15), B-46, B-47, no 2022 trade values, D1 from post-war flows | +51 (Confronting) | −3 | +59 → +46 (2025-12-31) |

## Sensitivity (docs/02 §10)

Position among the 193 scored entities (1 = highest), display score and band under each sensitivity variant.

| Variant | Display (band) | Position |
|---|---|---|
| rc.1 default | +54 (Confronting) | 10 |
| passivity-5 | +54 (Confronting) | 10 |
| passivity-15 | +54 (Confronting) | 10 |
| passivity-25 | +54 (Confronting) | 10 |
| weight-A-0.5 | +54 (Confronting) | 11 |
| weight-A-1.5 | +54 (Confronting) | 9 |
| weight-B-0.5 | +33 (Acting) | 10 |
| weight-B-1.5 | +74 (Confronting) | 11 |
| weight-C-0.5 | +54 (Confronting) | 10 |
| weight-C-1.5 | +53 (Confronting) | 10 |
| weight-D-0.5 | +47 (Confronting) | 10 |
| weight-D-1.5 | +61 (Confronting) | 10 |
| reported-0.2 | +54 (Confronting) | 10 |
| reported-0.6 | +54 (Confronting) | 10 |
| statements-excluded | +44 (Confronting) | 9 |
| decay-off | +68 (Confronting) | 7 |

## Questions of the country session

The readings the FRA session flagged are in docs/10 B-219; those it referred to P-15 are decided, for every country at once, in docs/calibration/README.md §6.
