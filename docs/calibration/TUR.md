# Calibration worksheet: Türkiye (TUR)

Computed on 2026-11-28 with methodology 1.0.0-rc.1, by `pnpm calibrate --date 2026-11-28 --fts` on `data/phase1` at `63b4c8b` (task T-H-PREP of the launch-plan run, docs/10 B-2224; first computed on 2026-09-30 in P-15, re-computed on 2026-10-05 in T-P14, docs/10 B-487). **Provisional**: none of this country's hand-written events is published yet; the 1,515 events at status `reviewed` are scored as if published (the `--preview` reading of docs/06 §4), and the one `draft` event of the dataset is left out. The proposals 1.0.0-rc.2 (PR #15) and 1.0.0-rc.3 (PR #19) are not applied here; the effect of the rc.2 rules is in the table of proposals below. The numbers change when the author reviews and publishes the events; P-22 re-runs this worksheet on the published dataset before the score is shown.

**Score +69.6 → display +70 (Confronting)**, position 3 of 193 scored entities. Passivity: not applied (qualifying: `evt_2026_02_01_TUR_B9`, `evt_2026_04_30_TUR_B9`, `evt_2026_08_03_TUR_B9`, `evt_2026_08_06_TUR_B9`, `evt_2026_08_20_TUR_B9`, `evt_2026_09_06_TUR_B9`, `evt_2026_09_22_TUR_B9`, `evt_2026_09_22_TUR_B9_2`, `evt_2026_10_23_TUR_B9`, `evt_2026_11_13_TUR_B9`, `evt_2026_11_14_TUR_B9`, `evt_2026_11_19_TUR_B9`). In the run of 2026-10-05 (date 2026-09-30): display +78 (Confronting).

## Worksheet

One row per event in force on the date (counted, or set aside by a stacking rule), and one row per scored indicator without an event in force, with its assessment status. Points are shown as p × w × d = contribution (docs/02 §3–§4); generated events come from the structured tables (D-08).

| Indicator | Event(s) | Points | Confidence | Source (primary) | Notes |
|---|---|---|---|---|---|
| A1 | — | — | — | — | none found |
| A2 | `evt_2026_05_14_TUR_A2_comtrade-2025-mirror`: Türkiye exported USD 287,000 of goods under HS 93 to Israel in 2025, per Israel's report to UN Comtrade. | −3.0 × 1.0 × 1 = −3.00 | confirmed | `src_20260928_comtrade_mirror-2025-tur-tur-1` (dataset) | computed, 2026-05-14 to open; generated |
| A3 | — | — | — | — | none found |
| A4 | — | — | — | — | none found |
| A5 | — | — | — | — | none found |
| A6 | — | — | — | — | has events; 1 event(s) recorded, none in force on 2026-11-28 |
| A7 | `evt_2024_05_02_TUR_A7`: The government halted all exports to and imports from Israel, including transit trade, for every product group. | +25.0 × 1.0 × 1 = +25.00 | confirmed | `src_20250522_ticaret_israil-ticaret-iddialari` (official) | standing, 2024-05-02 to open |
| A8 | `evt_2025_08_29_TUR_A8`: The Minister of Foreign Affairs told the Grand National Assembly that ships and aircraft carrying arms and ammunition to Israel were denied Turkish ports and airspace. | +5.0 × 0.4 × 0.8130 = +1.63 | reported | `src_20250829_tbmm_fidan-gazze-genel-kurul` (parliamentary) | dated 2025-08-29 |
| B1 | `evt_2024_12_11_TUR_B1_es-10-25`: Türkiye voted yes on General Assembly resolution A/RES/ES-10/25. | +3.0 × 1.0 × 0.2767 = +0.83 | confirmed | `src_20260928_undl_ga-voting-2025-03-31-corr1` (dataset) | dated 2024-12-11; generated |
| B1 | `evt_2024_12_11_TUR_B1_es-10-26`: Türkiye voted yes on General Assembly resolution A/RES/ES-10/26. | +3.0 × 1.0 × 0.2767 = +0.83 | confirmed | `src_20260928_undl_ga-voting-2025-03-31-corr1` (dataset) | dated 2024-12-11; generated |
| B1 | `evt_2024_12_19_TUR_B1_79-232`: Türkiye voted yes on General Assembly resolution A/RES/79/232. | +3.0 × 1.0 × 0.2932 = +0.88 | confirmed | `src_20260928_undl_ga-voting-2025-03-31-corr1` (dataset) | dated 2024-12-19; generated |
| B1 | `evt_2025_06_12_TUR_B1_es-10-27`: Türkiye voted yes on General Assembly resolution A/RES/ES-10/27. | +3.0 × 1.0 × 0.6527 = +1.96 | confirmed | `src_20261005_undl_voting-es-10-27` (dataset) | dated 2025-06-12; generated |
| B1 | `evt_2025_09_12_TUR_B1_dec-80-506`: Türkiye voted yes on General Assembly decision A/DEC/80/506. | +3.0 × 1.0 × 0.8418 = +2.53 | confirmed | `src_20261005_undl_voting-a-dec-80-506` (dataset) | dated 2025-09-12; generated |
| B1 | `evt_2025_09_19_TUR_B1_80-1`: Türkiye voted yes on General Assembly resolution A/RES/80/1. | +3.0 × 1.0 × 0.8562 = +2.57 | confirmed | `src_20261005_undl_voting-a-res-80-1` (dataset) | dated 2025-09-19; generated |
| B1 | `evt_2025_12_05_TUR_B1_80-78`: Türkiye voted yes on General Assembly resolution A/RES/80/78. | +3.0 × 1.0 × 1 = +3.00 | confirmed | `src_20261005_undl_voting-a-res-80-78` (dataset) | dated 2025-12-05; generated |
| B1 | `evt_2025_12_12_TUR_B1_80-116`: Türkiye voted yes on General Assembly resolution A/RES/80/116. | +3.0 × 1.0 × 1 = +3.00 | confirmed | `src_20261005_undl_voting-a-res-80-116` (dataset) | dated 2025-12-12; generated |
| B2 | — | — | — | — | not applicable |
| B3 | `evt_2024_08_07_TUR_B3`: The government filed a declaration of intervention under Article 63 in the ICJ case South Africa v. Israel, supporting a construction of the Genocide Convention that covers starvation. | +15.0 × 1.0 × 1 = +15.00 | confirmed | `src_20240807_icj_192-declaration-turkiye` (court) | standing, 2024-08-07 to open |
| B4 | — | — | — | — | none found |
| B5 | — | — | — | — | none found |
| B6 | — | — | — | — | none found |
| B7 | — | — | — | — | none found |
| B8 | `evt_2023_10_07_TUR_B8_recognition`: Türkiye recognised the State of Palestine, before 7 October 2023. | +3.0 × 1.0 × 1 = +3.00 | confirmed | `src_20260928_mfa-tr_political-relations-palestine` (official) | standing, 2023-10-07 to open; generated |
| B9 | `evt_2025_09_23_TUR_B9`: The President told the UN General Assembly that hunger was being used as a weapon in Gaza and called for a ceasefire and unhindered humanitarian access. | +5.0 × 1.0 × 0.8644 = +4.32 | confirmed | `src_20250923_iletisim_erdogan-bm-80-genel-kurul` (official) | dated 2025-09-23 |
| B9 | `evt_2025_11_03_TUR_B9`: The Minister of Foreign Affairs stated that Israel had killed close to 250 Gazans since the ceasefire and was not allowing the agreed humanitarian aid into Gaza. | +5.0 × 1.0 × 0.9486 = +4.74 | confirmed | `src_20251103_mfa-tr_fidan-gazze-bakanlar-basin-toplantisi` (official) | dated 2025-11-03 |
| B9 | `evt_2026_02_01_TUR_B9`: The Minister of Foreign Affairs and seven counterparts condemned Israel's repeated violations of the Gaza ceasefire and called on all parties to preserve it. | +2.0 × 1.0 × 1 = +2.00 | confirmed | `src_20260201_spa_fms-joint-statement-ceasefire-gaza` (official) | dated 2026-02-01; qualifies against passivity |
| B9 | `evt_2026_04_30_TUR_B9`: The Minister of Foreign Affairs and eleven counterparts called Israel's attacks on the Gaza flotilla violations of international humanitarian law. | +5.0 × 1.0 × 1 = +5.00 | confirmed | `src_20260430_mre_joint-statement-sumud-flotilla` (official) | dated 2026-04-30; qualifies against passivity |
| B9 | `evt_2026_08_03_TUR_B9`: The Minister of Foreign Affairs and his counterparts of the other mediating states condemned the targeting of healthcare facilities in Gaza as a violation of international humanitarian law. | +5.0 × 1.0 × 1 = +5.00 | confirmed | `src_20260803_mfa-tr_mediators-violations-gaza` (official) | dated 2026-08-03; qualifies against passivity |
| B9 | `evt_2026_08_06_TUR_B9`: The Minister of Foreign Affairs and seven counterparts condemned the targeting of healthcare facilities and civilian infrastructure in the Gaza Strip. | +5.0 × 1.0 × 1 = +5.00 | confirmed | `src_20260806_mofa-ae_fms-joint-statement-gaza` (official) | dated 2026-08-06; qualifies against passivity |
| B9 | `evt_2026_08_20_TUR_B9`: The Minister of Foreign Affairs and his counterparts of the other mediating states condemned Israeli attacks in Gaza that killed civilians and called on Israel to comply with the ceasefire. | +2.0 × 1.0 × 1 = +2.00 | confirmed | `src_20260820_mfa-tr_mediators-statement-israeli-attacks-gaza` (official) | dated 2026-08-20; qualifies against passivity |
| B9 | `evt_2026_09_06_TUR_B9`: The Minister of Foreign Affairs and seven counterparts condemned Israeli ministers' proposals to forcibly displace Palestinians from the Gaza Strip. | +5.0 × 1.0 × 1 = +5.00 | confirmed | `src_20260906_mofa-ae_fms-joint-statement-displacement` (official) | dated 2026-09-06; qualifies against passivity |
| B9 | `evt_2026_09_22_TUR_B9`: The President told the UN General Assembly that more than 1,500 Gazans had been killed since the ceasefire and that most hospital generators in Gaza were out of service. | +5.0 × 1.0 × 1 = +5.00 | confirmed | `src_20260922_iletisim_erdogan-bm-81-genel-kurul` (official) | dated 2026-09-22; qualifies against passivity |
| B9 | `evt_2026_09_22_TUR_B9_2`: The Minister of Foreign Affairs, with seven counterparts, called on Israel to ensure the unhindered delivery of humanitarian aid in Gaza and stressed the need to preserve the ceasefire. | +2.0 × 1.0 × 1 = +2.00 | confirmed | `src_20260922_mofa-pk_fms-joint-statement-gaza-81st` (official) | dated 2026-09-22; qualifies against passivity |
| B9 | `evt_2026_10_23_TUR_B9`: The Minister of Foreign Affairs and three counterparts called for an urgent end to Israeli violence and for an uninterrupted flow of humanitarian aid to Gaza. | +2.0 × 1.0 × 1 = +2.00 | confirmed | `src_20261023_mfa-tr_joint-statement-r4-ministerial-istanbul` (official) | dated 2026-10-23; qualifies against passivity |
| B9 | `evt_2026_11_13_TUR_B9`: The President and the Amir of Qatar called on Israel to comply with its obligations under the Gaza ceasefire agreement and called for unhindered humanitarian access in Gaza. | +2.0 × 1.0 × 1 = +2.00 | confirmed | `src_20261113_mfa-tr_turkiye-qatar-strategic-committee` (official) | dated 2026-11-13; qualifies against passivity |
| B9 | `evt_2026_11_14_TUR_B9`: The Minister of Foreign Affairs and seventeen counterparts condemned the Israeli strike on the Nasser Medical Complex in Khan Younis as a violation of international humanitarian law. | +5.0 × 1.0 × 1 = +5.00 | confirmed | `src_20261114_mfa-tr_joint-statement-nasser-medical-complex` (official) | dated 2026-11-14; qualifies against passivity |
| B9 | `evt_2026_11_19_TUR_B9`: The Minister of Foreign Affairs and fifteen counterparts condemned the Israeli military escalation in Gaza and Israel's settlement policies in the Occupied Palestinian Territory. | +2.0 × 1.0 × 1 = +2.00 | confirmed | `src_20261119_mfa-tr_joint-statement-uk-australia-sanctions` (official) | dated 2026-11-19; qualifies against passivity |
| B10 | — | — | — | — | none found |
| B11 | — | — | — | — | none found |
| B12 | `evt_2023_11_04_TUR_B12`: The Ministry of Foreign Affairs recalled the ambassador in Tel Aviv for consultations, citing the attacks on civilians in Gaza and the refusal of a ceasefire. | +5.0 × 1.0 × 1 = +5.00 | confirmed | `src_20231104_mfa-tr_recall-ambassador-tel-aviv` (official) | standing, 2023-11-04 to open |
| C1 | — | — | — | — | none found |
| C2 | — | — | — | — | none found |
| C3 | `evt_2026_05_14_TUR_C3_comtrade-2025-mirror`: Türkiye traded goods worth USD 2.1 billion with Israel in 2025, 26% of its 2022 level, per Israel's report to UN Comtrade. | 0.0 × 1.0 × 1 = 0.00 | confirmed | `src_20260928_comtrade_mirror-2025-tur-tur-1` (dataset) | computed, 2026-05-14 to open; generated |
| C4 | — | — | — | — | none found |
| C5 | — | — | — | — | none found |
| C6 | — | — | — | — | none found |
| D1 | `evt_2026_11_01_TUR_D1_fts`: Türkiye paid or committed USD 1.0 million to the oPt flash appeals in the 12 months to 31 October 2026, per FTS. | +1.0 × 1.0 × 1 = +1.00 | confirmed | `src_20261128_fts_plan-1186-p1` (dataset) | computed, 2026-11-01 to 2026-12-01; generated |
| D2 | — | — | — | — | none found |
| D3 | — | — | — | — | has events; 1 event(s) recorded, none in force on 2026-11-28 |
| D4 | — | — | — | — | has events; 1 event(s) recorded, none in force on 2026-11-28 |
| D5 | — | — | — | — | none found |

## Score by category

| Category | Sum of indicators | Cap | Clipped |
|---|---|---|---|
| A Arms & military | +23.63 | −45 … +30 | +23.63 |
| B Diplomacy & international law | +48.59 | −40 … +45 | +45.00 |
| C Trade & economy | 0.00 | −20 … +20 | 0.00 |
| D Humanitarian | +1.00 | −15 … +25 | +1.00 |

raw = +23.63 +45.00 0.00 +1.00 − 0 (passivity) = +69.63; S = clip(raw, −100, +100) = +69.63; display +70; band Confronting (docs/02 §7: Sustaining ≤ −51, Enabling −50…−21, Passive −20…0, Acting 1…40, Confronting ≥ 41).

## What drives this score

1. **A7 +25.00**: `evt_2024_05_02_TUR_A7`.
2. **B1 +15.59**: `evt_2024_12_11_TUR_B1_es-10-25`, `evt_2024_12_11_TUR_B1_es-10-26`, `evt_2024_12_19_TUR_B1_79-232`, `evt_2025_06_12_TUR_B1_es-10-27`, `evt_2025_09_12_TUR_B1_dec-80-506`, `evt_2025_09_19_TUR_B1_80-1`, `evt_2025_12_05_TUR_B1_80-78`, `evt_2025_12_12_TUR_B1_80-116`.
3. **B3 +15.00**: `evt_2024_08_07_TUR_B3`.

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

- B1 counts all 12 qualifying votes; A1 and A4 read the SIPRI release of 9 March 2026 (docs/10 B-487); D1 reads fts_funding.csv to October 2026 (T-H-STRUCT, docs/10 B-2177). The structured tables are complete for this country on this date.

## Effect of the proposals on this country

Display score on 2026-11-28 under each proposal measured in docs/calibration/README.md §4 (rc.1: +70, Confronting); the last column gives the largest change of this country's display score at a quarter end since 2023-10-07.

| Proposal | Display (band) | Change | Largest change in the history |
|---|---|---|---|
| b21: official-video and parliamentary sources count for confirmed (B-21) | +72 (Confronting) | +2 | +85 → +88 (2025-09-30) |
| b22: most severe stacking for A3, A6, A7, B3, B7, D2 (B-22, B-51) | +70 (Confronting) | 0 | none |
| b23: B1 capped at +15 (B-23, one option) | +70 (Confronting) | 0 | +84 → +79 (2025-06-30) |
| b23-sym: B1 capped at −15 and +15 (B-23, symmetric option) | +70 (Confronting) | 0 | +84 → +79 (2025-06-30) |
| b46: only contributions of +2 or more qualify (B-46) | +70 (Confronting) | 0 | none |
| b47: pre-existing B8 tier does not qualify (B-47) | +70 (Confronting) | 0 | none |
| b48-alt: alternative to B-48: a standing state qualifies while it holds | +70 (Confronting) | 0 | none |
| b46+b47: B-46 and B-47 together | +70 (Confronting) | 0 | none |
| b8-pre: pre-existing recognitions of the registry as B8 +3 (B-199 (3) alternative) | +70 (Confronting) | 0 | none |
| b8-pre+b47: pre-existing B8 +3 rows, with B-47 | +70 (Confronting) | 0 | none |
| trade-no-2022: A2 and C3 values of data year 2022 not in force in the window (P-04, B-63) | +70 (Confronting) | 0 | +17 → +25 (2023-12-31) |
| d1-postwar: D1 from FTS flows dated on or after 2023-10-07 only (P-04, B-60) | +70 (Confronting) | 0 | none |
| proposal: the recommended set: B-21, B-22, B-23 (B1 within −15…+15), B-46, B-47, no 2022 trade values, D1 from post-war flows | +72 (Confronting) | +2 | +17 → +25 (2023-12-31) |

## Sensitivity (docs/02 §10)

Position among the 193 scored entities (1 = highest), display score and band under each sensitivity variant.

| Variant | Display (band) | Position |
|---|---|---|
| rc.1 default | +70 (Confronting) | 3 |
| passivity-5 | +70 (Confronting) | 3 |
| passivity-15 | +70 (Confronting) | 3 |
| passivity-25 | +70 (Confronting) | 3 |
| weight-A-0.5 | +58 (Confronting) | 8 |
| weight-A-1.5 | +81 (Confronting) | 3 |
| weight-B-0.5 | +47 (Confronting) | 3 |
| weight-B-1.5 | +92 (Confronting) | 3 |
| weight-C-0.5 | +70 (Confronting) | 3 |
| weight-C-1.5 | +70 (Confronting) | 3 |
| weight-D-0.5 | +69 (Confronting) | 3 |
| weight-D-1.5 | +70 (Confronting) | 5 |
| reported-0.2 | +69 (Confronting) | 3 |
| reported-0.6 | +70 (Confronting) | 3 |
| statements-excluded | +48 (Confronting) | 8 |
| decay-off | +75 (Confronting) | 3 |

## Questions of the country session

The readings the TUR session flagged are in docs/10 B-239; those it referred to P-15 are decided, for every country at once, in docs/calibration/README.md §6.
