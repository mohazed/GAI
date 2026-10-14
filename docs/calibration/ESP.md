# Calibration worksheet: Spain (ESP)

Computed on 2026-09-30 with methodology 1.0.0-rc.1, by `pnpm calibrate --date 2026-09-30 --fts` (P-15, docs/08 §3; re-run on 2026-10-05 after the import of the five later votes and of the SIPRI release of 9 March 2026, T-P14, docs/10 B-487). **Provisional**: none of this country's hand-written events is published yet; the 773 events at status `reviewed` are scored as if published (the `--preview` reading of docs/06 §4), and the one `draft` event of the dataset is left out. The numbers change when the author reviews and publishes the events; P-22 re-runs this worksheet on the published dataset before the score is shown.

**Score +85.0 → display +85 (Confronting)**, position 1 of 193 scored entities (148 of which have only generated events so far). Passivity: not applied (qualifying: `evt_2026_01_28_ESP_B9`, `evt_2026_04_30_ESP_B9`, `evt_2026_05_28_ESP_B11`, `evt_2026_06_08_ESP_B9`, `evt_2026_09_01_ESP_D1_fts`, `evt_2026_09_23_ESP_B9`).

## Worksheet

One row per event in force on the date (counted, or set aside by a stacking rule), and one row per scored indicator without an event in force, with its assessment status. Points are shown as p × w × d = contribution (docs/02 §3–§4); generated events come from the structured tables (D-08).

| Indicator | Event(s) | Points | Confidence | Source (primary) | Notes |
|---|---|---|---|---|---|
| A1 | — | — | — | — | none found; the SIPRI release of 2026-03-09 lists no delivery to Israel in 2025 (s = 0) |
| A2 | `evt_2026_04_17_ESP_A2_comtrade-2025-self`: Spain exported USD 173,372 of goods under HS 93 to Israel in 2025, per its report to UN Comtrade. | −3.0 × 1.0 × 1 = −3.00 | confirmed | `src_20260928_comtrade_esp-self-2025` (dataset) | computed, 2026-04-17 to open; generated |
| A3 | — | — | — | — | none found |
| A4 | — | — | — | — | none found; the SIPRI release of 2026-03-09 lists no order placed with Israel in 2025 |
| A5 | — | — | — | — | none found |
| A6 | `evt_2023_10_07_ESP_A6`: The government stopped granting new licences for arms exports to Israel from 7 October 2023, as the Minister of Foreign Affairs stated in Congress. | +10.0 × 1.0 × 1 = +10.00 | confirmed | `src_20241128_congreso_acta-taquigrafica-pleno` (official) | set aside: superseded (`evt_2025_09_25_ESP_A7`); standing, 2023-10-07 to open |
| A7 | `evt_2025_09_25_ESP_A7`: Real Decreto-ley 10/2025 entered into force, prohibiting exports to Israel and imports from Israel of defence material and dual-use items, and their transit. | +25.0 × 1.0 × 1 = +25.00 | confirmed | `src_20250924_boe_rdl-10-2025-gaza` (official) | standing, 2025-09-25 to open |
| A8 | — | — | — | — | has events; 1 event(s) recorded, none in force on 2026-09-30 |
| B1 | `evt_2024_12_11_ESP_B1_es-10-25`: Spain voted yes on General Assembly resolution A/RES/ES-10/25. | +3.0 × 1.0 × 0.3979 = +1.19 | confirmed | `src_20260928_undl_ga-voting-2025-03-31-corr1` (dataset) | dated 2024-12-11; generated |
| B1 | `evt_2024_12_11_ESP_B1_es-10-26`: Spain voted yes on General Assembly resolution A/RES/ES-10/26. | +3.0 × 1.0 × 0.3979 = +1.19 | confirmed | `src_20260928_undl_ga-voting-2025-03-31-corr1` (dataset) | dated 2024-12-11; generated |
| B1 | `evt_2024_12_19_ESP_B1_79-232`: Spain voted yes on General Assembly resolution A/RES/79/232. | +3.0 × 1.0 × 0.4144 = +1.24 | confirmed | `src_20260928_undl_ga-voting-2025-03-31-corr1` (dataset) | dated 2024-12-19; generated |
| B1 | `evt_2025_06_12_ESP_B1_es-10-27`: Spain voted yes on General Assembly resolution A/RES/ES-10/27. | +3.0 × 1.0 × 0.7740 = +2.32 | confirmed | `src_20261005_undl_voting-es-10-27` (dataset) | dated 2025-06-12; generated |
| B1 | `evt_2025_09_12_ESP_B1_dec-80-506`: Spain voted yes on General Assembly decision A/DEC/80/506. | +3.0 × 1.0 × 0.9630 = +2.89 | confirmed | `src_20261005_undl_voting-a-dec-80-506` (dataset) | dated 2025-09-12; generated |
| B1 | `evt_2025_09_19_ESP_B1_80-1`: Spain voted yes on General Assembly resolution A/RES/80/1. | +3.0 × 1.0 × 0.9774 = +2.93 | confirmed | `src_20261005_undl_voting-a-res-80-1` (dataset) | dated 2025-09-19; generated |
| B1 | `evt_2025_12_05_ESP_B1_80-78`: Spain voted yes on General Assembly resolution A/RES/80/78. | +3.0 × 1.0 × 1.0000 = +3.00 | confirmed | `src_20261005_undl_voting-a-res-80-78` (dataset) | dated 2025-12-05; generated |
| B1 | `evt_2025_12_12_ESP_B1_80-116`: Spain voted yes on General Assembly resolution A/RES/80/116. | +3.0 × 1.0 × 1.0000 = +3.00 | confirmed | `src_20261005_undl_voting-a-res-80-116` (dataset) | dated 2025-12-12; generated |
| B2 | — | — | — | — | not applicable |
| B3 | `evt_2024_06_28_ESP_B3`: The government filed a declaration of intervention under Article 63 in the ICJ case South Africa v. Israel on the Genocide Convention in the Gaza Strip. | +15.0 × 1.0 × 1 = +15.00 | confirmed | `src_20240628_icj_192-press-spain` (court) | standing, 2024-06-28 to open |
| B4 | — | — | — | — | none found |
| B5 | `evt_2024_11_28_ESP_B5`: The Minister of Foreign Affairs told Congress, asked whether the Prime Minister of Israel would be arrested in Spain, that Spain will comply with its Rome Statute obligations. | +8.0 × 1.0 × 1 = +8.00 | confirmed | `src_20241128_congreso_acta-taquigrafica-pleno` (official) | standing, 2024-11-28 to open |
| B6 | — | — | — | — | none found |
| B7 | — | — | — | — | none found |
| B8 | `evt_2024_05_28_ESP_B8_recognition`: Spain recognised the State of Palestine. | +8.0 × 1.0 × 1 = +8.00 | confirmed | `src_20240528_lamoncloa_reconocimiento-palestina` (official) | standing, 2024-05-28 to open; generated |
| B9 | `evt_2025_07_21_ESP_B9`: The Minister of Foreign Affairs, with other foreign ministers, said the war in Gaza must end now and called forced displacement a violation of international humanitarian law. | +5.0 × 1.0 × 0.8541 = +4.27 | confirmed | `src_20250721_fm-gov-au_joint-statement-opt` (official) | dated 2025-07-21 |
| B9 | `evt_2025_08_10_ESP_B9`: The Minister of Foreign Affairs and seven counterparts condemned Israel's announced intensification of the offensive in Gaza City and called for an immediate ceasefire. | +5.0 × 1.0 × 0.8952 = +4.48 | confirmed | `src_20250810_regjeringen_joint-statement-gaza` (official) | dated 2025-08-10 |
| B9 | `evt_2025_08_12_ESP_B9`: The Minister of Foreign Affairs, with other foreign ministers, said that famine was unfolding in Gaza and called for urgent action to halt starvation. | +5.0 × 1.0 × 0.8993 = +4.50 | confirmed | `src_20250812_fm-gov-au_joint-statement-humanitarian` (official) | dated 2025-08-12 |
| B9 | `evt_2025_09_08_ESP_B9`: The President of the Government announced nine measures against what he called the genocide in Gaza and named the bombing of hospitals and the starving of children. | +5.0 × 1.0 × 0.9548 = +4.77 | confirmed | `src_20250908_lamoncloa_declaracion-medidas-gaza` (official) | dated 2025-09-08 |
| B9 | `evt_2026_01_28_ESP_B9`: The Minister of Foreign Affairs, with ten other foreign ministers, condemned the demolition of UNRWA premises in East Jerusalem and called on Israel to facilitate aid to Gaza. | +2.0 × 1.0 × 1.0000 = +2.00 | confirmed | `src_20260128_gac_joint-statement-unrwa` (official) | dated 2026-01-28; qualifies against passivity |
| B9 | `evt_2026_04_30_ESP_B9`: The Minister of Foreign Affairs and eleven counterparts called Israel's attacks on the Gaza flotilla violations of international humanitarian law. | +5.0 × 1.0 × 1.0000 = +5.00 | confirmed | `src_20260430_mre_joint-statement-sumud-flotilla` (official) | dated 2026-04-30; qualifies against passivity |
| B9 | `evt_2026_06_08_ESP_B9`: The Minister of Foreign Affairs joined a joint statement calling on Israel to comply with international humanitarian law and allow humanitarian access in Gaza. | +2.0 × 1.0 × 1.0000 = +2.00 | confirmed | `src_20260608_diplomatie-belgium_joint-statement-ingos` (official) | dated 2026-06-08; qualifies against passivity |
| B9 | `evt_2026_09_23_ESP_B9`: The President of the Government told the UN General Assembly that Spain condemns what he called the genocide that Israel's Prime Minister continues to perpetrate in Gaza. | +5.0 × 1.0 × 1.0000 = +5.00 | confirmed | `src_20260923_lamoncloa_intervencion-agnu` (official) | dated 2026-09-23; qualifies against passivity |
| B9 | indicator cap | sum +32.02 → +10.00 | | | indicator-level cap (docs/02 §2) |
| B10 | — | — | — | — | none found |
| B11 | `evt_2024_07_15_ESP_B11`: The government agreed in the EU Council to sanctions on five Israeli settlers and activists and three entities, including a group blocking aid trucks bound for Gaza. | +5.0 × 1.0 × 1 = +5.00 | confirmed | `src_20240715_consilium_settlers-tzav9-sanctions` (official) | standing, 2024-07-15 to open |
| B11 | `evt_2025_09_09_ESP_B11`: The Council of Ministers added Israel's ministers Itamar Ben-Gvir and Bezalel Smotrich to Spain's list of sanctioned persons, barring them from Spanish territory. | +10.0 × 1.0 × 1 = +10.00 | confirmed | `src_20250909_lamoncloa_rueda-prensa-transcripcion` (official) | standing, 2025-09-09 to open |
| B11 | `evt_2026_05_28_ESP_B11`: The government agreed in the EU Council to sanctions on three Israeli settler leaders and four settler organisations, one of them for efforts to resettle the Gaza Strip. | +5.0 × 1.0 × 1 = +5.00 | confirmed | `src_20260528_eur-lex_reg-impl-2026-1177` (official) | set aside: same-tier (`evt_2024_07_15_ESP_B11`); standing, 2026-05-28 to open; qualifies against passivity |
| B12 | `evt_2025_09_08_ESP_B12`: The government recalled its ambassador in Tel Aviv for consultations on 8 September 2025, with no date set for her return. | +5.0 × 1.0 × 1 = +5.00 | confirmed | `src_20250909_lamoncloa_rueda-prensa-transcripcion` (official) | standing, 2025-09-08 to open |
| C1 | `evt_2025_05_20_ESP_C1`: The government supported the review of the EU–Israel Association Agreement launched by the Foreign Affairs Council on 20 May 2025, after requesting it since February 2024. | +4.0 × 1.0 × 1 = +4.00 | confirmed | `src_20250520_eeas_fac-press-remarks-kallas` (official) | standing, 2025-05-20 to open |
| C2 | — | — | — | — | none found |
| C3 | `evt_2026_04_17_ESP_C3_comtrade-2025-self`: Spain traded goods worth USD 2.8 billion with Israel in 2025, 82% of its 2022 level, per its report to UN Comtrade. | 0.0 × 1.0 × 1 = 0.00 | confirmed | `src_20260928_comtrade_esp-self-2025` (dataset) | computed, 2026-04-17 to open; generated |
| C4 | — | — | — | — | has events |
| C5 | — | — | — | — | none found |
| C6 | — | — | — | — | none found |
| D1 | `evt_2026_09_01_ESP_D1_fts`: Spain paid or committed USD 49.1 million to the oPt flash appeals in the 12 months to 31 August 2026, per FTS. | +6.0 × 1.0 × 1 = +6.00 | confirmed | `src_20260928_fts_plan-1186-p1` (dataset) | computed, 2026-09-01 to 2026-10-01; qualifies against passivity; generated |
| D2 | — | — | — | — | none found |
| D3 | `evt_2024_12_31_ESP_D3`: The government's contribution to UNRWA in 2024 exceeded its 2022 contribution, per UNRWA's donor tables for both years. | +8.0 × 1.0 × 1 = +8.00 | confirmed | `src_20241231_unrwa_donor-ranking-2024` (dataset) | standing, 2024-12-31 to open |
| D4 | — | — | — | — | has events; 1 event(s) recorded, none in force on 2026-09-30 |
| D5 | — | — | — | — | none found |

## Score by category

| Category | Sum of indicators | Cap | Clipped |
|---|---|---|---|
| A Arms & military | +22.00 | −45 … +30 | +22.00 |
| B Diplomacy & international law | +78.77 | −40 … +45 | +45.00 |
| C Trade & economy | +4.00 | −20 … +20 | +4.00 |
| D Humanitarian | +14.00 | −15 … +25 | +14.00 |

raw = +22.00 +45.00 +4.00 +14.00 − 0 (passivity) = +85.00; S = clip(raw, −100, +100) = +85.00; display +85; band Confronting (docs/02 §7: Sustaining ≤ −51, Enabling −50…−21, Passive −20…0, Acting 1…40, Confronting ≥ 41).

## What drives this score

1. **A7 +25.00**: `evt_2025_09_25_ESP_A7`.
2. **B1 +17.77**: `evt_2024_12_11_ESP_B1_es-10-25`, `evt_2024_12_11_ESP_B1_es-10-26`, `evt_2024_12_19_ESP_B1_79-232`, `evt_2025_06_12_ESP_B1_es-10-27`, `evt_2025_09_12_ESP_B1_dec-80-506`, `evt_2025_09_19_ESP_B1_80-1`, `evt_2025_12_05_ESP_B1_80-78`, `evt_2025_12_12_ESP_B1_80-116`.
3. **B3 +15.00**: `evt_2024_06_28_ESP_B3`.

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

Display score on 2026-09-30 under each proposal measured in docs/calibration/README.md §4 (rc.1: +85, Confronting); the last column gives the largest change of this country's display score at a quarter end since 2023-10-07.

| Proposal | Display (band) | Change | Largest change in the history |
|---|---|---|---|
| b21: official-video and parliamentary sources count for confirmed (B-21) | +85 (Confronting) | 0 | none |
| b22: most severe stacking for A3, A6, A7, B3, B7, D2 (B-22, B-51) | +85 (Confronting) | 0 | none |
| b23: B1 capped at +15 (B-23, one option) | +85 (Confronting) | 0 | none |
| b23-sym: B1 capped at −15 and +15 (B-23, symmetric option) | +85 (Confronting) | 0 | none |
| b46: only contributions of +2 or more qualify (B-46) | +85 (Confronting) | 0 | none |
| b47: pre-existing B8 tier does not qualify (B-47) | +85 (Confronting) | 0 | none |
| b48-alt: alternative to B-48: a standing state qualifies while it holds | +85 (Confronting) | 0 | none |
| b46+b47: B-46 and B-47 together | +85 (Confronting) | 0 | none |
| b8-pre: pre-existing recognitions of the registry as B8 +3 (B-199 (3) alternative) | +85 (Confronting) | 0 | none |
| b8-pre+b47: pre-existing B8 +3 rows, with B-47 | +85 (Confronting) | 0 | none |
| trade-no-2022: A2 and C3 values of data year 2022 not in force in the window (P-04, B-63) | +85 (Confronting) | 0 | +14 → +27 (2023-12-31) |
| d1-postwar: D1 from FTS flows dated on or after 2023-10-07 only (P-04, B-60) | +85 (Confronting) | 0 | none |
| proposal: the recommended set: B-21, B-22, B-23 (B1 within −15…+15), B-46, B-47, no 2022 trade values, D1 from post-war flows | +85 (Confronting) | 0 | +14 → +27 (2023-12-31) |

## Sensitivity (docs/02 §10)

Position among the 193 scored entities (1 = highest), display score and band under each sensitivity variant.

| Variant | Display (band) | Position |
|---|---|---|
| rc.1 default | +85 (Confronting) | 1 |
| passivity-5 | +85 (Confronting) | 1 |
| passivity-15 | +85 (Confronting) | 1 |
| passivity-25 | +85 (Confronting) | 1 |
| weight-A-0.5 | +74 (Confronting) | 1 |
| weight-A-1.5 | +96 (Confronting) | 1 |
| weight-B-0.5 | +63 (Confronting) | 1 |
| weight-B-1.5 | +100 (Confronting) | 1 |
| weight-C-0.5 | +83 (Confronting) | 1 |
| weight-C-1.5 | +87 (Confronting) | 1 |
| weight-D-0.5 | +78 (Confronting) | 1 |
| weight-D-1.5 | +92 (Confronting) | 1 |
| reported-0.2 | +85 (Confronting) | 1 |
| reported-0.6 | +85 (Confronting) | 1 |
| statements-excluded | +85 (Confronting) | 1 |
| decay-off | +92 (Confronting) | 1 |

## Questions of the country session

The readings the ESP session flagged are in docs/10 B-223; those it referred to P-15 are decided, for every country at once, in docs/calibration/README.md §6.
