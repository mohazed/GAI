# Author's sample of the reviewed events (November 2026)

Written on 2026-11-28 by task T-H-PREP of the launch-plan run (LAUNCH-PLAN.md Part 4; docs/10 B-2223) for the author's sampled review before `pnpm publish:events` (CHECKUP.md §3a, docs/03 §11). Nothing here was published and no `review.reviewed_by` was set. Drawn on `data/phase1` at `63b4c8b`.

## How the sample is drawn (reproducible)

1. Every event of `data/events/*.yaml` at status `reviewed`: **1,515** events in **148** countries (the one `draft`, `evt_2025_09_29_USA_B10`, is left out; it is never published).
2. Sorted by the hexadecimal SHA-256 of the event id (UTF-8), ascending. The first 10 %, rounded up: **152** events, in 73 countries.
3. For each country with at least one reviewed event and none in that slice, its first event in the same order: **75** more events, one per country. Total **227** events, every one of the 148 countries with at least one.

The same ids come out of this, run at the repository root on the same commit:

```sh
python3 -c "import yaml,glob,hashlib,math;r=sorted([e for f in glob.glob('data/events/*.yaml') for e in yaml.safe_load(open(f)) or [] if e['status']=='reviewed'],key=lambda e:hashlib.sha256(e['id'].encode()).hexdigest());n=math.ceil(len(r)/10);s=r[:n];c={e['country'] for e in s};[s.append(e) or c.add(e['country']) for e in r if e['country'] not in c];print('\n'.join(e['id'] for e in s))"
```

Events added to the publication after this commit are not in the sample; an event dropped by the author leaves it.

## What to check for each event (CHECKUP.md §3a)

- The quote is in `archive/text/<source>.txt` at its locator (the excerpt below is the archived text where the quote stands, with up to about 160 characters on each side, whitespace collapsed as the quote checker does; the line "Mechanical check" says whether the normalised quote was found there, which `pnpm validate` also checks).
- The Wayback link opens the same page as the archived text.
- Speaker, date, tier (points) and scope follow the rules: R3 (speakers of B9: head of state, head of government, foreign minister), R4 (indirect speech is not B9), R7 (a B9 statement cites Gaza), and the indicator table of `methodology/v1.0.0/indicators.yaml`.
- The French summary says what the English one says and follows `docs/glossary.fr.md`.

Tick the box of each event checked. An event to leave out of publication goes in `{EXCLUDED}` of the review prompt (`docs/review/launch-commands-2026-11.md`); an event to fix is fixed in place before publication (no correction entry for unpublished events).

## Index

| Country | Events in the sample | Reviewed events of the country |
|---|---|---|
| Angola (AGO) | [`evt_2025_09_04_AGO_B9`](#evt_2025_09_04_ago_b9), [`evt_2025_09_23_AGO_B9`](#evt_2025_09_23_ago_b9) | 4 |
| Albania (ALB) | [`evt_2024_12_31_ALB_C2`](#evt_2024_12_31_alb_c2) | 3 |
| Andorra (AND) | [`evt_2025_07_29_AND_B9`](#evt_2025_07_29_and_b9) | 6 |
| United Arab Emirates (ARE) | [`evt_2026_02_01_ARE_B9`](#evt_2026_02_01_are_b9), [`evt_2023_12_02_ARE_D4`](#evt_2023_12_02_are_d4) | 21 |
| Argentina (ARG) | [`evt_2023_11_22_ARG_B9`](#evt_2023_11_22_arg_b9) | 8 |
| Armenia (ARM) | [`evt_2024_12_31_ARM_D3`](#evt_2024_12_31_arm_d3) | 1 |
| Antigua and Barbuda (ATG) | [`evt_2024_09_27_ATG_B9`](#evt_2024_09_27_atg_b9) | 2 |
| Australia (AUS) | [`evt_2024_10_26_AUS_B9`](#evt_2024_10_26_aus_b9) | 28 |
| Austria (AUT) | [`evt_2024_04_19_AUT_B11`](#evt_2024_04_19_aut_b11), [`evt_2024_01_29_AUT_D2`](#evt_2024_01_29_aut_d2), [`evt_2025_09_27_AUT_B9`](#evt_2025_09_27_aut_b9), [`evt_2026_09_24_AUT_B9`](#evt_2026_09_24_aut_b9), [`evt_2026_09_03_AUT_B9`](#evt_2026_09_03_aut_b9) | 30 |
| Azerbaijan (AZE) | [`evt_2026_02_04_AZE_C2`](#evt_2026_02_04_aze_c2) | 4 |
| Belgium (BEL) | [`evt_2025_07_21_BEL_B9`](#evt_2025_07_21_bel_b9), [`evt_2026_05_28_BEL_B11`](#evt_2026_05_28_bel_b11), [`evt_2024_02_07_BEL_A6`](#evt_2024_02_07_bel_a6) | 26 |
| Burkina Faso (BFA) | [`evt_2026_06_24_BFA_B6`](#evt_2026_06_24_bfa_b6) | 1 |
| Bangladesh (BGD) | [`evt_2024_09_27_BGD_B9`](#evt_2024_09_27_bgd_b9) | 3 |
| Bulgaria (BGR) | [`evt_2024_09_25_BGR_B9`](#evt_2024_09_25_bgr_b9) | 9 |
| Bahrain (BHR) | [`evt_2023_12_31_BHR_D3`](#evt_2023_12_31_bhr_d3) | 4 |
| Bosnia and Herzegovina (BIH) | [`evt_2025_09_25_BIH_B9`](#evt_2025_09_25_bih_b9) | 1 |
| Belize (BLZ) | [`evt_2023_11_14_BLZ_B12`](#evt_2023_11_14_blz_b12) | 4 |
| Bolivia (Plurinational State of) (BOL) | [`evt_2024_04_24_BOL_B9`](#evt_2024_04_24_bol_b9) | 10 |
| Brazil (BRA) | [`evt_2024_12_02_BRA_B9`](#evt_2024_12_02_bra_b9), [`evt_2026_09_22_BRA_B9`](#evt_2026_09_22_bra_b9) | 20 |
| Barbados (BRB) | [`evt_2025_09_26_BRB_B9`](#evt_2025_09_26_brb_b9) | 2 |
| Brunei Darussalam (BRN) | [`evt_2026_11_23_BRN_B9`](#evt_2026_11_23_brn_b9) | 4 |
| Canada (CAN) | [`evt_2024_03_08_CAN_D3`](#evt_2024_03_08_can_d3), [`evt_2025_06_10_CAN_B11`](#evt_2025_06_10_can_b11), [`evt_2026_09_08_CAN_B9`](#evt_2026_09_08_can_b9), [`evt_2025_08_12_CAN_B9`](#evt_2025_08_12_can_b9), [`evt_2025_08_21_CAN_B9`](#evt_2025_08_21_can_b9) | 35 |
| Switzerland (CHE) | [`evt_2025_08_12_CHE_B9`](#evt_2025_08_12_che_b9), [`evt_2026_05_20_CHE_B9`](#evt_2026_05_20_che_b9) | 18 |
| Chile (CHL) | [`evt_2023_10_31_CHL_B12`](#evt_2023_10_31_chl_b12), [`evt_2024_06_11_CHL_B9`](#evt_2024_06_11_chl_b9), [`evt_2026_02_26_CHL_B9`](#evt_2026_02_26_chl_b9), [`evt_2025_10_14_CHL_B9`](#evt_2025_10_14_chl_b9) | 15 |
| China (CHN) | [`evt_2025_04_28_CHN_B9`](#evt_2025_04_28_chn_b9), [`evt_2024_10_23_CHN_B9`](#evt_2024_10_23_chn_b9), [`evt_2024_09_25_CHN_B9`](#evt_2024_09_25_chn_b9), [`evt_2025_02_20_CHN_B9`](#evt_2025_02_20_chn_b9) | 19 |
| Democratic Republic of the Congo (COD) | [`evt_2026_07_27_COD_C2_2`](#evt_2026_07_27_cod_c2_2) | 2 |
| Colombia (COL) | [`evt_2024_06_06_COL_B9`](#evt_2024_06_06_col_b9), [`evt_2024_06_11_COL_B9`](#evt_2024_06_11_col_b9) | 12 |
| Comoros (COM) | [`evt_2026_10_29_COM_B9`](#evt_2026_10_29_com_b9), [`evt_2024_11_27_COM_B9`](#evt_2024_11_27_com_b9) | 4 |
| Costa Rica (CRI) | [`evt_2025_12_08_CRI_C2`](#evt_2025_12_08_cri_c2) | 2 |
| Cuba (CUB) | [`evt_2025_09_26_CUB_B9`](#evt_2025_09_26_cub_b9), [`evt_2025_10_01_CUB_B9`](#evt_2025_10_01_cub_b9) | 9 |
| Cyprus (CYP) | [`evt_2024_07_15_CYP_B11`](#evt_2024_07_15_cyp_b11) | 17 |
| Czechia (CZE) | [`evt_2023_10_25_CZE_B10`](#evt_2023_10_25_cze_b10) | 8 |
| Germany (DEU) | [`evt_2023_10_12_DEU_B10`](#evt_2023_10_12_deu_b10), [`evt_2024_04_24_DEU_D3`](#evt_2024_04_24_deu_d3), [`evt_2024_03_21_DEU_B9`](#evt_2024_03_21_deu_b9) | 21 |
| Djibouti (DJI) | [`evt_2026_11_14_DJI_B9`](#evt_2026_11_14_dji_b9) | 3 |
| Denmark (DNK) | [`evt_2025_08_13_DNK_B9`](#evt_2025_08_13_dnk_b9) | 26 |
| Dominican Republic (DOM) | [`evt_2024_10_31_DOM_C2`](#evt_2024_10_31_dom_c2) | 1 |
| Algeria (DZA) | [`evt_2026_08_27_DZA_B9`](#evt_2026_08_27_dza_b9), [`evt_2024_09_30_DZA_B9`](#evt_2024_09_30_dza_b9) | 16 |
| Ecuador (ECU) | [`evt_2026_08_05_ECU_C2_2`](#evt_2026_08_05_ecu_c2_2) | 6 |
| Egypt (EGY) | [`evt_2023_11_23_EGY_B9`](#evt_2023_11_23_egy_b9), [`evt_2026_08_21_EGY_B9`](#evt_2026_08_21_egy_b9), [`evt_2026_10_10_EGY_B9`](#evt_2026_10_10_egy_b9), [`evt_2026_10_05_EGY_B9`](#evt_2026_10_05_egy_b9) | 29 |
| Spain (ESP) | [`evt_2024_06_06_ESP_B9`](#evt_2024_06_06_esp_b9), [`evt_2025_05_20_ESP_C1`](#evt_2025_05_20_esp_c1), [`evt_2026_02_24_ESP_B9`](#evt_2026_02_24_esp_b9), [`evt_2024_07_24_ESP_D4`](#evt_2024_07_24_esp_d4) | 34 |
| Estonia (EST) | [`evt_2024_07_15_EST_B11`](#evt_2024_07_15_est_b11) | 20 |
| Ethiopia (ETH) | [`evt_2025_02_04_ETH_C2`](#evt_2025_02_04_eth_c2) | 1 |
| Finland (FIN) | [`evt_2025_09_24_FIN_B9`](#evt_2025_09_24_fin_b9), [`evt_2025_05_19_FIN_B9`](#evt_2025_05_19_fin_b9), [`evt_2026_05_28_FIN_B11`](#evt_2026_05_28_fin_b11), [`evt_2025_07_21_FIN_B9`](#evt_2025_07_21_fin_b9) | 23 |
| Fiji (FJI) | [`evt_2023_10_31_FJI_E2`](#evt_2023_10_31_fji_e2) | 7 |
| France (FRA) | [`evt_2026_10_28_FRA_B9`](#evt_2026_10_28_fra_b9), [`evt_2025_05_20_FRA_C1`](#evt_2025_05_20_fra_c1), [`evt_2024_03_28_FRA_D3`](#evt_2024_03_28_fra_d3) | 40 |
| United Kingdom of Great Britain and Northern Ireland (GBR) | [`evt_2024_09_02_GBR_A6`](#evt_2024_09_02_gbr_a6), [`evt_2026_06_08_GBR_B9`](#evt_2026_06_08_gbr_b9), [`evt_2023_12_02_GBR_A5`](#evt_2023_12_02_gbr_a5) | 35 |
| Ghana (GHA) | [`evt_2025_09_25_GHA_B9`](#evt_2025_09_25_gha_b9) | 1 |
| Gambia (GMB) | [`evt_2025_08_25_GMB_B9`](#evt_2025_08_25_gmb_b9) | 3 |
| Greece (GRC) | [`evt_2025_09_26_GRC_B9`](#evt_2025_09_26_grc_b9) | 24 |
| Guatemala (GTM) | [`evt_2025_09_24_GTM_B9`](#evt_2025_09_24_gtm_b9) | 1 |
| Guyana (GUY) | [`evt_2025_09_24_GUY_B9`](#evt_2025_09_24_guy_b9) | 5 |
| Honduras (HND) | [`evt_2024_09_25_HND_B9`](#evt_2024_09_25_hnd_b9), [`evt_2023_11_03_HND_B12`](#evt_2023_11_03_hnd_b12) | 4 |
| Croatia (HRV) | [`evt_2025_01_17_HRV_C2`](#evt_2025_01_17_hrv_c2), [`evt_2025_09_24_HRV_B9`](#evt_2025_09_24_hrv_b9), [`evt_2023_12_31_HRV_D3`](#evt_2023_12_31_hrv_d3) | 12 |
| Hungary (HUN) | [`evt_2025_08_11_HUN_B9`](#evt_2025_08_11_hun_b9), [`evt_2026_05_28_HUN_B11`](#evt_2026_05_28_hun_b11) | 16 |
| Indonesia (IDN) | [`evt_2026_06_02_IDN_B9`](#evt_2026_06_02_idn_b9), [`evt_2025_12_31_IDN_D3`](#evt_2025_12_31_idn_d3), [`evt_2026_07_23_IDN_B9`](#evt_2026_07_23_idn_b9) | 24 |
| India (IND) | [`evt_2026_09_24_IND_B9`](#evt_2026_09_24_ind_b9), [`evt_2024_12_10_IND_B9`](#evt_2024_12_10_ind_b9) | 12 |
| Ireland (IRL) | [`evt_2024_02_19_IRL_B9`](#evt_2024_02_19_irl_b9), [`evt_2025_09_26_IRL_B9`](#evt_2025_09_26_irl_b9), [`evt_2026_09_15_IRL_C4`](#evt_2026_09_15_irl_c4), [`evt_2026_10_12_IRL_B9`](#evt_2026_10_12_irl_b9), [`evt_2026_09_24_IRL_B9`](#evt_2026_09_24_irl_b9), [`evt_2025_05_21_IRL_B9`](#evt_2025_05_21_irl_b9) | 33 |
| Iran (Islamic Republic of) (IRN) | [`evt_2025_09_24_IRN_B9`](#evt_2025_09_24_irn_b9) | 4 |
| Iraq (IRQ) | [`evt_2024_12_31_IRQ_D3`](#evt_2024_12_31_irq_d3) | 3 |
| Iceland (ISL) | [`evt_2025_08_29_ISL_B9`](#evt_2025_08_29_isl_b9) | 24 |
| Italy (ITA) | [`evt_2024_01_27_ITA_D2`](#evt_2024_01_27_ita_d2), [`evt_2025_09_24_ITA_B9`](#evt_2025_09_24_ita_b9) | 24 |
| Jamaica (JAM) | [`evt_2024_09_27_JAM_B9`](#evt_2024_09_27_jam_b9) | 1 |
| Jordan (JOR) | [`evt_2026_08_21_JOR_B9`](#evt_2026_08_21_jor_b9) | 30 |
| Japan (JPN) | [`evt_2024_01_28_JPN_D2`](#evt_2024_01_28_jpn_d2), [`evt_2024_06_02_JPN_B9`](#evt_2024_06_02_jpn_b9) | 23 |
| Kazakhstan (KAZ) | [`evt_2025_09_23_KAZ_B9`](#evt_2025_09_23_kaz_b9) | 7 |
| Kenya (KEN) | [`evt_2024_01_25_KEN_E2`](#evt_2024_01_25_ken_e2) | 2 |
| Kyrgyzstan (KGZ) | [`evt_2025_09_23_KGZ_B9`](#evt_2025_09_23_kgz_b9) | 1 |
| Cambodia (KHM) | [`evt_2025_12_01_KHM_C2`](#evt_2025_12_01_khm_c2) | 2 |
| Saint Kitts and Nevis (KNA) | [`evt_2025_09_27_KNA_B9`](#evt_2025_09_27_kna_b9) | 2 |
| Republic of Korea (KOR) | [`evt_2025_09_23_KOR_B9`](#evt_2025_09_23_kor_b9) | 7 |
| Kuwait (KWT) | [`evt_2026_11_19_KWT_B9`](#evt_2026_11_19_kwt_b9) | 6 |
| Lao People's Democratic Republic (LAO) | [`evt_2024_09_27_LAO_B9`](#evt_2024_09_27_lao_b9) | 1 |
| Lebanon (LBN) | [`evt_2026_11_14_LBN_B9`](#evt_2026_11_14_lbn_b9), [`evt_2024_12_31_LBN_D3`](#evt_2024_12_31_lbn_d3) | 7 |
| Libya (LBY) | [`evt_2025_09_25_LBY_B9`](#evt_2025_09_25_lby_b9) | 7 |
| Saint Lucia (LCA) | [`evt_2025_09_29_LCA_B9`](#evt_2025_09_29_lca_b9) | 2 |
| Liechtenstein (LIE) | [`evt_2025_08_12_LIE_B9`](#evt_2025_08_12_lie_b9) | 8 |
| Sri Lanka (LKA) | [`evt_2025_12_22_LKA_C2`](#evt_2025_12_22_lka_c2) | 5 |
| Lesotho (LSO) | [`evt_2024_09_26_LSO_B9`](#evt_2024_09_26_lso_b9) | 3 |
| Lithuania (LTU) | [`evt_2025_12_31_LTU_D3`](#evt_2025_12_31_ltu_d3) | 14 |
| Luxembourg (LUX) | [`evt_2025_05_16_LUX_B9`](#evt_2025_05_16_lux_b9), [`evt_2025_12_14_LUX_B9`](#evt_2025_12_14_lux_b9) | 23 |
| Latvia (LVA) | [`evt_2024_12_31_LVA_D3`](#evt_2024_12_31_lva_d3) | 17 |
| Morocco (MAR) | [`evt_2024_05_16_MAR_B9`](#evt_2024_05_16_mar_b9) | 12 |
| Monaco (MCO) | [`evt_2026_05_29_MCO_B11`](#evt_2026_05_29_mco_b11) | 4 |
| Republic of Moldova (MDA) | [`evt_2026_09_09_MDA_C2`](#evt_2026_09_09_mda_c2) | 4 |
| Maldives (MDV) | [`evt_2026_04_30_MDV_B9`](#evt_2026_04_30_mdv_b9) | 7 |
| Mexico (MEX) | [`evt_2025_12_31_MEX_D3`](#evt_2025_12_31_mex_d3) | 7 |
| Marshall Islands (MHL) | [`evt_2024_09_25_MHL_B9`](#evt_2024_09_25_mhl_b9) | 1 |
| North Macedonia (MKD) | [`evt_2026_08_24_MKD_C2`](#evt_2026_08_24_mkd_c2) | 1 |
| Mali (MLI) | [`evt_2026_06_24_MLI_B6`](#evt_2026_06_24_mli_b6) | 1 |
| Malta (MLT) | [`evt_2025_08_29_MLT_D4`](#evt_2025_08_29_mlt_d4), [`evt_2024_10_07_MLT_A8`](#evt_2024_10_07_mlt_a8) | 22 |
| Montenegro (MNE) | [`evt_2023_12_31_MNE_D3`](#evt_2023_12_31_mne_d3) | 3 |
| Mauritania (MRT) | [`evt_2025_09_27_MRT_B9`](#evt_2025_09_27_mrt_b9) | 2 |
| Mauritius (MUS) | [`evt_2025_10_28_MUS_B9`](#evt_2025_10_28_mus_b9) | 1 |
| Malawi (MWI) | [`evt_2025_04_07_MWI_C2`](#evt_2025_04_07_mwi_c2) | 2 |
| Malaysia (MYS) | [`evt_2025_09_27_MYS_B9`](#evt_2025_09_27_mys_b9), [`evt_2024_01_23_MYS_B9`](#evt_2024_01_23_mys_b9), [`evt_2024_06_11_MYS_B9`](#evt_2024_06_11_mys_b9), [`evt_2023_12_31_MYS_D3`](#evt_2023_12_31_mys_d3) | 19 |
| Namibia (NAM) | [`evt_2024_09_25_NAM_B9`](#evt_2024_09_25_nam_b9) | 5 |
| Niger (NER) | [`evt_2025_09_27_NER_B9`](#evt_2025_09_27_ner_b9) | 3 |
| Nicaragua (NIC) | [`evt_2024_01_23_NIC_B3`](#evt_2024_01_23_nic_b3) | 2 |
| Netherlands (Kingdom of the) (NLD) | [`evt_2025_09_27_NLD_B9`](#evt_2025_09_27_nld_b9), [`evt_2025_08_12_NLD_B9`](#evt_2025_08_12_nld_b9), [`evt_2026_09_22_NLD_C4`](#evt_2026_09_22_nld_c4), [`evt_2025_05_20_NLD_C1`](#evt_2025_05_20_nld_c1), [`evt_2024_11_21_NLD_B5`](#evt_2024_11_21_nld_b5), [`evt_2024_01_27_NLD_D2`](#evt_2024_01_27_nld_d2) | 29 |
| Norway (NOR) | [`evt_2023_10_28_NOR_B9`](#evt_2023_10_28_nor_b9), [`evt_2026_09_24_NOR_B9`](#evt_2026_09_24_nor_b9) | 44 |
| Naoero (NRU) | [`evt_2026_09_23_NRU_B6`](#evt_2026_09_23_nru_b6) | 1 |
| New Zealand (NZL) | [`evt_2024_02_29_NZL_B11`](#evt_2024_02_29_nzl_b11), [`evt_2025_07_30_NZL_B9`](#evt_2025_07_30_nzl_b9), [`evt_2024_07_26_NZL_B9`](#evt_2024_07_26_nzl_b9) | 15 |
| Oman (OMN) | [`evt_2025_11_23_OMN_B9`](#evt_2025_11_23_omn_b9) | 8 |
| Pakistan (PAK) | [`evt_2026_08_06_PAK_B9`](#evt_2026_08_06_pak_b9) | 15 |
| Panama (PAN) | [`evt_2026_05_27_PAN_C2`](#evt_2026_05_27_pan_c2) | 1 |
| Peru (PER) | [`evt_2025_11_21_PER_C2`](#evt_2025_11_21_per_c2) | 1 |
| Philippines (PHL) | [`evt_2025_09_27_PHL_B9`](#evt_2025_09_27_phl_b9) | 2 |
| Papua New Guinea (PNG) | [`evt_2024_10_07_PNG_B9`](#evt_2024_10_07_png_b9) | 3 |
| Poland (POL) | [`evt_2025_09_22_POL_B9`](#evt_2025_09_22_pol_b9) | 15 |
| Portugal (PRT) | [`evt_2024_07_15_PRT_B11`](#evt_2024_07_15_prt_b11), [`evt_2024_12_31_PRT_D3`](#evt_2024_12_31_prt_d3) | 23 |
| Paraguay (PRY) | [`evt_2024_12_09_PRY_B6`](#evt_2024_12_09_pry_b6) | 6 |
| Qatar (QAT) | [`evt_2025_07_28_QAT_B9`](#evt_2025_07_28_qat_b9), [`evt_2026_11_14_QAT_B9`](#evt_2026_11_14_qat_b9), [`evt_2026_11_27_QAT_B9`](#evt_2026_11_27_qat_b9) | 32 |
| Romania (ROU) | [`evt_2026_05_28_ROU_B11`](#evt_2026_05_28_rou_b11) | 12 |
| Russian Federation (RUS) | [`evt_2023_10_13_RUS_B9`](#evt_2023_10_13_rus_b9) | 11 |
| Rwanda (RWA) | [`evt_2024_06_11_RWA_B9`](#evt_2024_06_11_rwa_b9) | 1 |
| Saudi Arabia (SAU) | [`evt_2023_10_24_SAU_B9`](#evt_2023_10_24_sau_b9) | 23 |
| Sudan (SDN) | [`evt_2026_11_14_SDN_B9`](#evt_2026_11_14_sdn_b9) | 4 |
| Senegal (SEN) | [`evt_2026_11_23_SEN_B9`](#evt_2026_11_23_sen_b9) | 3 |
| Singapore (SGP) | [`evt_2023_12_31_SGP_D3`](#evt_2023_12_31_sgp_d3) | 11 |
| Solomon Islands (SLB) | [`evt_2024_09_27_SLB_B9`](#evt_2024_09_27_slb_b9) | 2 |
| Sierra Leone (SLE) | [`evt_2025_09_24_SLE_B9`](#evt_2025_09_24_sle_b9) | 6 |
| San Marino (SMR) | [`evt_2024_09_28_SMR_B9`](#evt_2024_09_28_smr_b9) | 5 |
| Somalia (SOM) | [`evt_2025_09_25_SOM_B9`](#evt_2025_09_25_som_b9) | 7 |
| Serbia (SRB) | [`evt_2026_04_29_SRB_C2`](#evt_2026_04_29_srb_c2) | 1 |
| South Sudan (SSD) | [`evt_2025_08_13_SSD_C2`](#evt_2025_08_13_ssd_c2) | 1 |
| Suriname (SUR) | [`evt_2025_09_23_SUR_B9`](#evt_2025_09_23_sur_b9) | 1 |
| Slovakia (SVK) | [`evt_2024_12_19_SVK_D4`](#evt_2024_12_19_svk_d4) | 9 |
| Slovenia (SVN) | [`evt_2025_07_17_SVN_B11`](#evt_2025_07_17_svn_b11) | 33 |
| Sweden (SWE) | [`evt_2024_04_19_SWE_B11`](#evt_2024_04_19_swe_b11), [`evt_2026_02_24_SWE_B9`](#evt_2026_02_24_swe_b9), [`evt_2025_05_19_SWE_B9`](#evt_2025_05_19_swe_b9) | 28 |
| Seychelles (SYC) | [`evt_2023_11_10_SYC_B9`](#evt_2023_11_10_syc_b9) | 3 |
| Syrian Arab Republic (SYR) | [`evt_2026_10_16_SYR_B9`](#evt_2026_10_16_syr_b9) | 4 |
| Chad (TCD) | [`evt_2023_11_04_TCD_B12`](#evt_2023_11_04_tcd_b12) | 3 |
| Togo (TGO) | [`evt_2026_07_06_TGO_C2`](#evt_2026_07_06_tgo_c2) | 1 |
| Thailand (THA) | [`evt_2025_12_31_THA_D3`](#evt_2025_12_31_tha_d3) | 4 |
| Tajikistan (TJK) | [`evt_2025_09_18_TJK_C2`](#evt_2025_09_18_tjk_c2) | 3 |
| Timor-Leste (TLS) | [`evt_2025_09_24_TLS_B9`](#evt_2025_09_24_tls_b9) | 1 |
| Trinidad and Tobago (TTO) | [`evt_2024_09_28_TTO_B9`](#evt_2024_09_28_tto_b9) | 1 |
| Tunisia (TUN) | [`evt_2026_09_26_TUN_B9`](#evt_2026_09_26_tun_b9) | 9 |
| Türkiye (TUR) | [`evt_2026_02_24_TUR_B9`](#evt_2026_02_24_tur_b9), [`evt_2026_08_21_TUR_B9`](#evt_2026_08_21_tur_b9), [`evt_2026_08_03_TUR_B9`](#evt_2026_08_03_tur_b9), [`evt_2026_07_23_TUR_B9`](#evt_2026_07_23_tur_b9), [`evt_2026_02_01_TUR_B9`](#evt_2026_02_01_tur_b9), [`evt_2026_10_23_TUR_B9`](#evt_2026_10_23_tur_b9), [`evt_2026_11_19_TUR_B9`](#evt_2026_11_19_tur_b9) | 29 |
| United States of America (USA) | [`evt_2024_01_26_USA_D2`](#evt_2024_01_26_usa_d2) | 16 |
| Uzbekistan (UZB) | [`evt_2023_12_31_UZB_D3`](#evt_2023_12_31_uzb_d3) | 6 |
| Holy See (VAT) | [`evt_2025_10_05_VAT_B9`](#evt_2025_10_05_vat_b9) | 6 |
| Saint Vincent and the Grenadines (VCT) | [`evt_2025_09_26_VCT_B9`](#evt_2025_09_26_vct_b9) | 2 |
| Venezuela (Bolivarian Republic of) (VEN) | [`evt_2023_10_07_VEN_B12`](#evt_2023_10_07_ven_b12) | 4 |
| Viet Nam (VNM) | [`evt_2026_11_13_VNM_B9`](#evt_2026_11_13_vnm_b9) | 2 |
| Yemen (YEM) | [`evt_2025_09_15_YEM_B9`](#evt_2025_09_15_yem_b9) | 4 |
| South Africa (ZAF) | [`evt_2026_01_30_ZAF_B12`](#evt_2026_01_30_zaf_b12), [`evt_2023_11_07_ZAF_B9`](#evt_2023_11_07_zaf_b9) | 15 |
| Zimbabwe (ZWE) | [`evt_2024_12_31_ZWE_D3`](#evt_2024_12_31_zwe_d3) | 1 |

## The events

### Angola (AGO)

#### evt_2025_09_04_AGO_B9

- [ ] Checked (1 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-09-04 |
| Speaker or actor | President of Angola / Président de l'Angola |
| Tier (points) | +2: Formal call for a ceasefire (+2): in the joint statement of the state visit to Angola the Heads of State 'called for an immediate and permanent ceasefire in Gaza and a cessation of settlement activities in the Occupied Palestinian Territory'. |
| Confidence | confirmed |
| Scope | gaza, west-bank |
| Summary (EN) | The President, with the President of the United Arab Emirates, called for an immediate and permanent ceasefire in Gaza in a joint statement. |
| Summary (FR) | Le président, avec le président des Émirats arabes unis, a appelé à un cessez-le-feu immédiat et permanent à Gaza dans une déclaration commune. |
| Second reading | agree, 2026-11-04; the notes mention a flag |

Evidence 1: `src_20250904_mofa-ae_uae-angola-joint-statement` (official, Ministry of Foreign Affairs of the United Arab Emirates (mofa.gov.ae), 2025-09-04), locator **line 11**, language `en`.
Wayback: <https://web.archive.org/web/20261104032946id_/https://www.mofa.gov.ae/en/mediahub/news/2025/9/4/4-9-2025-uae-angola>

Quote:

> called for an immediate and permanent ceasefire in Gaza and a cessation of settlement activities in the Occupied Palestinian Territory

Mechanical check: found at line 11, starting within the locator (line 11). Archived text at line 11 of `archive/text/src_20250904_mofa-ae_uae-angola-joint-statement.txt`:

> The Heads of State expressed their concern over the ongoing escalation in the Gaza Strip and the West Bank, including East Jerusalem, and called for an immediate and permanent ceasefire in Gaza and a cessation of settlement activities in the Occupied Palestinian Territory. They stressed the urgent need for the rapid, unhindered, and safe delivery of humanitarian assistance at-scale, through all means to civilians in need. They …

Evidence 2: `src_20250904_mofa-ae_uae-angola-joint-statement` (official, Ministry of Foreign Affairs of the United Arab Emirates (mofa.gov.ae), 2025-09-04), locator **line 5**, language `en`.
Wayback: <https://web.archive.org/web/20261104032946id_/https://www.mofa.gov.ae/en/mediahub/news/2025/9/4/4-9-2025-uae-angola>

Quote:

> held a state visit to the Republic of Angola at the invitation of His Excellency João Manuel Gonçalves Lourenço, President of the Republic of Angola

Mechanical check: found at line 5, starting within the locator (line 5). Archived text at line 5 of `archive/text/src_20250904_mofa-ae_uae-angola-joint-statement.txt`:

> His Highness Sheikh Mohamed bin Zayed Al Nahyan, President of the United Arab Emirates, held a state visit to the Republic of Angola at the invitation of His Excellency João Manuel Gonçalves Lourenço, President of the Republic of Angola. The visit, the first by a President of the United Arab Emirates to Angola, signals a renewed era of partnership and a shared ambition to elevate bilateral …

#### evt_2025_09_23_AGO_B9

- [ ] Checked (2 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-09-23 |
| Speaker or actor | President of Angola (and Chairperson of the African Union) / Président de l'Angola (et président en exercice de l'Union africaine) |
| Tier (points) | +5: Legal characterisation (+5): the President says Israel 'cannot be allowed' to pursue in Palestine, 'particularly in Gaza', 'a policy of extermination of a people' and that the exclusion of the Palestinian President from the Assembly 'encourages the continuation of the genocide to which we all bear witness'. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The President told the General Assembly that Israel could not be allowed to pursue in Gaza what he described as a policy of eliminating a people, and spoke of what he called the genocide. |
| Summary (FR) | Le président a déclaré à l'Assemblée générale qu'Israël ne pouvait être autorisé à mener à Gaza ce qu'il a décrit comme une politique d'élimination d'un peuple, et évoqué ce qu'il a appelé génocide. |
| Second reading | agree, 2026-11-04; the notes mention a flag |

Evidence 1: `src_20250923_cipra_lourenco-80th-general-debate-pt` (official, Centro de Imprensa da Presidência da República de Angola (Plataforma CIPRA, plataformacipra.gov.ao), 2025-09-23), locator **line 118**, language `pt`.
Wayback: <https://web.archive.org/web/20260209085453id_/https://plataformacipra.gov.ao/public/ficheiros/arquivos/Gov_AngolaDiscurso862409251240061758714006.pdf>

Quote:

> não se lhe pode contudo permitir que desenvolva na Palestina e particularmente na faixa de Gaza uma política de extermínio de um povo

Translation in the record:

> it cannot however be allowed to pursue in Palestine and particularly in the Gaza Strip a policy of extermination of a people

Mechanical check: found at lines 118–120, starting within the locator (line 118). Archived text at lines 118–120 of `archive/text/src_20250923_cipra_lourenco-80th-general-debate-pt.txt`:

> Estado e a exigir a libertação dos ainda reféns do trágico 7 de Outubro, não se lhe pode contudo permitir que desenvolva na Palestina e particularmente na faixa de Gaza uma política de extermínio de um povo.

Evidence 2: `src_20250923_cipra_lourenco-80th-general-debate-pt` (official, Centro de Imprensa da Presidência da República de Angola (Plataforma CIPRA, plataformacipra.gov.ao), 2025-09-23), locator **line 133**, language `pt`.
Wayback: <https://web.archive.org/web/20260209085453id_/https://plataformacipra.gov.ao/public/ficheiros/arquivos/Gov_AngolaDiscurso862409251240061758714006.pdf>

Quote:

> encoraja a continuação do genocídio a que todos assistimos impotentes e impunemente

Translation in the record:

> encourages the continuation of the genocide to which we all bear witness, helpless and with impunity

Mechanical check: found at lines 133–134, starting within the locator (line 133). Archived text at lines 133–134 of `archive/text/src_20250923_cipra_lourenco-80th-general-debate-pt.txt`:

> Geral emite um sinal muito negativo, pois encoraja a continuação do genocídio a que todos assistimos impotentes e impunemente, adia a resolução do problema e complica os

Evidence 3: `src_20250923_un-gadebate_ago-lourenco-80th-en` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2025-09-23), locator **lines 122–123**, language `en`.
Wayback: <https://web.archive.org/web/20251008132621id_/https://gadebate.un.org/sites/default/files/gastatements/80/ao_en.pdf>

Quote:

> allowed to pursue in Palestine — and particularly in Gaza — a policy of extermination of a people.

Mechanical check: found at lines 122–123, starting within the locator (lines 122–123). Archived text at lines 122–123 of `archive/text/src_20250923_un-gadebate_ago-lourenco-80th-en.txt`:

> allowed to pursue in Palestine — and particularly in Gaza — a policy of extermination of a people.

Evidence 4: `src_20250923_un-gadebate_ago-lourenco-80th-en` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2025-09-23), locator **lines 135–136**, language `en`.
Wayback: <https://web.archive.org/web/20251008132621id_/https://gadebate.un.org/sites/default/files/gastatements/80/ao_en.pdf>

Quote:

> it encourages the continuation of the genocide to which we all bear witness helplessly and with impunity

Mechanical check: found at lines 135–136, starting within the locator (lines 135–136). Archived text at lines 135–136 of `archive/text/src_20250923_un-gadebate_ago-lourenco-80th-en.txt`:

> Assembly sends a highly negative signal, as it encourages the continuation of the genocide to which we all bear witness helplessly and with impunity, delays resolution of the problem, and

### Albania (ALB)

#### evt_2024_12_31_ALB_C2

- [ ] Checked (3 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | C2, standing |
| Date | 2024-12-31 |
| Speaker or actor | Government of Albania / Gouvernement de l'Albanie |
| Tier (points) | −10: C2 (-10): the Israeli Embassy in Tirana's list of official agreements between Israel and Albania records, under 2024, a Memorandum of Cooperation in Tourism between the Council of Ministers of Albania and the Government of the State of Israel (docs/calibration/README.md R18, one event per instrument); dated no later than the end of 2024 because the list gives the year only. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Council of Ministers signed with Israel a memorandum of cooperation in tourism, listed by Israel's embassy among the agreements of 2024. |
| Summary (FR) | Le Conseil des ministres a signé avec Israël un mémorandum de coopération dans le tourisme, que l'ambassade d'Israël range parmi les accords de 2024. |
| Second reading | agree, 2026-11-04; the notes mention a flag |

Evidence 1: `src_20250429_embassies-il_albania-bilateral-relations` (official, Embassy of Israel in Tirana, Ministry of Foreign Affairs of Israel (embassies.gov.il), 2025-04-29), locator **line 83**, language `en`.
Wayback: <https://web.archive.org/web/20250517123427id_/https://new.embassies.gov.il/albania/en/the-embassy/bilateral-relations>

Quote:

> Memorandum of Cooperation in Tourism between the Council of Ministers of Albania and the Government of the State of Israel.

Mechanical check: found at line 83, starting within the locator (line 83). Archived text at line 83 of `archive/text/src_20250429_embassies-il_albania-bilateral-relations.txt`:

> Memorandum of Cooperation in Tourism between the Council of Ministers of Albania and the Government of the State of Israel.

### Andorra (AND)

#### evt_2025_07_29_AND_B9

- [ ] Checked (4 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-07-29 |
| Speaker or actor | Minister for Foreign Affairs / Ministre des Affaires étrangères |
| Tier (points) | +5: Names specific violations and calls for a ceasefire (+5): the Minister for Foreign Affairs tells the high-level conference that the response to the attacks of 7 October 2023 included 'indiscriminate aggression' against civilians, that access to aid was obstructed and that the spiral of violence was unsustainable, and that Andorra again calls for an immediate and lasting ceasefire. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister for Foreign Affairs, at the UN conference on Palestine, called for an immediate and lasting ceasefire and described the obstruction of aid to Gaza's civilians as unsustainable. |
| Summary (FR) | La ministre des Affaires étrangères, à la conférence de l'ONU sur la Palestine, a appelé à un cessez-le-feu immédiat et durable et jugé insoutenable l'obstruction de l'aide aux civils de Gaza. |
| Second reading | agree, 2026-11-04; the notes mention a flag |

Evidence 1: `src_20250729_un-unispal_and-tor-two-state-conference-fr` (official, Government of Andorra, published by the UN Division for Palestinian Rights (UNISPAL), 2025-07-29), locator **lines 39–43**, language `fr`.
Wayback: <https://web.archive.org/web/20261104005654id_/https://www.un.org/unispal/wp-content/uploads/2025/07/fWLQMVfEDG_nyc_fr.pdf>

Quote:

> nous avons aussi profondément regretté la violence de la réponse à ces attaques et l’agression indiscriminée aux populations civiles, avec presque 60.000 victimes majoritairement des femmes et des enfants.

Translation in the record:

> we also deeply regretted the violence of the response to these attacks and the indiscriminate aggression against civilian populations, with almost 60,000 victims, mostly women and children.

Mechanical check: found at lines 39–43, starting within the locator (lines 39–43). Archived text at lines 39–43 of `archive/text/src_20250729_un-unispal_and-tor-two-state-conference-fr.txt`:

> le 7 octobre 2023 et demandé la libération des otages, nous avons aussi profondément regretté la violence de la réponse à ces attaques et l’agression indiscriminée aux populations civiles, avec presque 60.000 victimes majoritairement des femmes et des enfants.

Evidence 2: `src_20250729_un-unispal_and-tor-two-state-conference-fr` (official, Government of Andorra, published by the UN Division for Palestinian Rights (UNISPAL), 2025-07-29), locator **lines 44–47**, language `fr`.
Wayback: <https://web.archive.org/web/20261104005654id_/https://www.un.org/unispal/wp-content/uploads/2025/07/fWLQMVfEDG_nyc_fr.pdf>

Quote:

> Cette spirale de violence, qui a engendré une situation humanitaire catastrophique, avec l’obstruction de l’accès à l’aide des populations civiles déjà éprouvées, est, je le répète, insoutenable.

Translation in the record:

> This spiral of violence, which has produced a catastrophic humanitarian situation, with the obstruction of access to aid for civilian populations already tried, is, I repeat, unsustainable.

Mechanical check: found at lines 44–47, starting within the locator (lines 44–47). Archived text at lines 44–47 of `archive/text/src_20250729_un-unispal_and-tor-two-state-conference-fr.txt`:

> Cette spirale de violence, qui a engendré une situation humanitaire catastrophique, avec l’obstruction de l’accès à l’aide des populations civiles déjà éprouvées, est, je le répète, insoutenable.

Evidence 3: `src_20250729_un-unispal_and-tor-two-state-conference-fr` (official, Government of Andorra, published by the UN Division for Palestinian Rights (UNISPAL), 2025-07-29), locator **lines 50–53**, language `fr`.
Wayback: <https://web.archive.org/web/20261104005654id_/https://www.un.org/unispal/wp-content/uploads/2025/07/fWLQMVfEDG_nyc_fr.pdf>

Quote:

> L’Andorre, une fois de plus, appelle à un cessez le feu immédiat et durable et au respect du droit humanitaire international ainsi qu’à la libération inconditionnelle de tous les otages.

Translation in the record:

> Andorra, once again, calls for an immediate and lasting ceasefire and for respect for international humanitarian law, and for the unconditional release of all the hostages.

Mechanical check: found at lines 50–53, starting within the locator (lines 50–53). Archived text at lines 50–53 of `archive/text/src_20250729_un-unispal_and-tor-two-state-conference-fr.txt`:

> L’Andorre, une fois de plus, appelle à un cessez le feu immédiat et durable et au respect du droit humanitaire international ainsi qu’à la libération inconditionnelle de tous les otages.

Evidence 4: `src_20250729_govern-ad_tor-two-state-conference` (official, Govern d'Andorra, Ministry of Foreign Affairs, 2025-07-29), locator **line 1158**, language `ca`.
Wayback: <https://web.archive.org/web/20261104010256id_/https://www.govern.ad/ca/w/andorra-condemna-la-barbarie-a-la-franja-de-gaza-i-insta-a-una-solucio-en-el-conflicte-entre-israel-i-palestina>

Quote:

> Andorra, segons ha exposat la ministra, ha reiterat la seva crida per un alto el foc immediat i durador, per al respecte del dret internacional humanitari i l’alliberament incondicional de tots els ostatges.

Translation in the record:

> Andorra, as the minister set out, reiterated its call for an immediate and lasting ceasefire, for respect for international humanitarian law and for the unconditional release of all the hostages.

Mechanical check: found at line 1158, starting within the locator (line 1158). Archived text at line 1158 of `archive/text/src_20250729_govern-ad_tor-two-state-conference.txt`:

> Andorra, segons ha exposat la ministra, ha reiterat la seva crida per un alto el foc immediat i durador, per al respecte del dret internacional humanitari i l’alliberament incondicional de tots els ostatges. La ministra també ha denunciat l’espiral de violència que ha sotmès Gaza a una situació humanitària catastròfica amb l’obstrucció de l’accés a l’ajuda de la …

### United Arab Emirates (ARE)

#### evt_2026_02_01_ARE_B9

- [ ] Checked (5 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2026-02-01 |
| Speaker or actor | Deputy Prime Minister and Minister of Foreign Affairs / Vice-Premier ministre et ministre des Affaires étrangères |
| Tier (points) | +2: Formal call for a ceasefire (+2): the joint statement of the foreign ministers of the United Arab Emirates and seven other states condemned Israel's repeated violations of the ceasefire in Gaza and called on all parties to preserve and sustain it; no violation of international humanitarian law is named. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Foreign Minister and seven counterparts condemned Israel's repeated violations of the Gaza ceasefire and called on all parties to preserve it. |
| Summary (FR) | Le ministre des Affaires étrangères et sept homologues ont condamné les violations répétées par Israël du cessez-le-feu à Gaza et appelé toutes les parties à le préserver. |
| Second reading | agree, 2026-09-29 |

Evidence 1: `src_20260201_spa_fms-joint-statement-ceasefire-gaza` (official, Saudi Press Agency, 2026-02-01), locator **line 3**, language `en`.
Wayback: <https://web.archive.org/web/20260929110100id_/https://www.spa.gov.sa/en/N2502340>

Quote:

> Israel’s repeated violations of the ceasefire in Gaza which have resulted in the killing, and injuring of more than a thousand Palestinians.

Mechanical check: found at line 3, starting within the locator (line 3). Archived text at line 3 of `archive/text/src_20260201_spa_fms-joint-statement-ceasefire-gaza.txt`:

> … the State of Qatar, the Republic of Indonesia, the Islamic Republic of Pakistan, the Arab Republic of Egypt, and the Republic of Türkiye strongly condemn Israel’s repeated violations of the ceasefire in Gaza which have resulted in the killing, and injuring of more than a thousand Palestinians.

Evidence 2: `src_20260201_spa_fms-joint-statement-ceasefire-gaza` (official, Saudi Press Agency, 2026-02-01), locator **line 6**, language `en`.
Wayback: <https://web.archive.org/web/20260929110100id_/https://www.spa.gov.sa/en/N2502340>

Quote:

> They also call on all parties to fully uphold their responsibilities during this critical period and to exercise the utmost restraint, in order to preserve and sustain the ceasefire

Mechanical check: found at line 6, starting within the locator (line 6). Archived text at line 6 of `archive/text/src_20260201_spa_fms-joint-statement-ceasefire-gaza.txt`:

> They also call on all parties to fully uphold their responsibilities during this critical period and to exercise the utmost restraint, in order to preserve and sustain the ceasefire, refrain from any actions that may undermine the current process, and create favorable conditions to move forward toward early recovery and reconstruction, as …

#### evt_2023_12_02_ARE_D4

- [ ] Checked (6 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | D4, repeatable |
| Date | 2023-12-02 |
| Speaker or actor | Government of the United Arab Emirates / Gouvernement des Émirats arabes unis |
| Tier (points) | +5 |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The United Arab Emirates opened a field hospital of more than 150 beds in the southern Gaza Strip. |
| Summary (FR) | Les Émirats arabes unis ont ouvert un hôpital de campagne de plus de 150 lits dans le sud de la bande de Gaza. |
| Second reading | agree, 2026-09-29 |

Evidence 1: `src_20231203_mofa-ae_field-hospital-gaza` (official, Ministry of Foreign Affairs, United Arab Emirates, 2023-12-03), locator **line 211**, language `en`.
Wayback: <https://web.archive.org/web/20260929123745id_/https://www.mofa.gov.ae/en/mediahub/news/2023/12/3/3-12-2023-uae-ghaza>

Quote:

> The Emirati integrated field hospital in Gaza began today providing its treatment services to the people of the Gaza Strip, as part of the UAE’s efforts to alleviate the suffering of Palestinian people and support the health system in the Gaza Strip, which faces exceptional, critical circumstances.

Mechanical check: found at line 211, starting within the locator (line 211). Archived text at line 211 of `archive/text/src_20231203_mofa-ae_field-hospital-gaza.txt`:

> The Emirati integrated field hospital in Gaza began today providing its treatment services to the people of the Gaza Strip, as part of the UAE’s efforts to alleviate the suffering of Palestinian people and support the health system in the Gaza Strip, which faces exceptional, critical circumstances.

Evidence 2: `src_20241106_mofa-ae_evacuation-210-patients-gaza` (official, Ministry of Foreign Affairs, United Arab Emirates, 2024-11-06), locator **line 7**, language `en`.
Wayback: <https://web.archive.org/web/20260929125034id_/https://www.mofa.gov.ae/en/MediaHub/News/2024/11/6/6-11-2024-UAE-UAE>

Quote:

> Since it began operations on December 2nd, 2023, the UAE field hospital in the southern Gaza Strip has treated 50,489 cases.

Mechanical check: found at line 7, starting within the locator (line 7). Archived text at line 7 of `archive/text/src_20241106_mofa-ae_evacuation-210-patients-gaza.txt`:

> The UAE has undertaken robust efforts to provide advanced healthcare to sick and severely injured Palestinians. Since it began operations on December 2nd, 2023, the UAE field hospital in the southern Gaza Strip has treated 50,489 cases. Moreover, since its launch in February 2024, the hospital floating ship anchored in Al-Arish Port has treated 6,405 cases so far.

### Argentina (ARG)

#### evt_2023_11_22_ARG_B9

- [ ] Checked (7 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2023-11-22 |
| Speaker or actor | President of the Nation / Président de la Nation |
| Tier (points) | +2: Formal call for a truce (+2): the President called at the G20 leaders' virtual summit for a humanitarian truce allowing international aid to arrive; the statement names no specific violation. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The President called at the G20 leaders' virtual summit for a humanitarian truce allowing international aid to arrive, and for the release of the hostages held in Gaza. |
| Summary (FR) | Le président a appelé, lors du sommet virtuel des dirigeants du G20, à une trêve humanitaire permettant l'arrivée de l'aide internationale et à la libération des otages détenus à Gaza. |
| Second reading | agree, 2026-09-29 |

Evidence 1: `src_20231122_cancilleria_fernandez-g20-tregua` (official, Ministerio de Relaciones Exteriores, Comercio Internacional y Culto (Argentina), 2023-11-22), locator **line 5**, language `es`.
Wayback: <https://web.archive.org/web/20260929102021id_/https://www.cancilleria.gob.ar/es/actualidad/noticias/el-presidente-destaco-el-acuerdo-alcanzado-entre-israel-y-hamas-en-la-cumbre-del>

Quote:

> el mandatario expresó su “preocupación por las terribles consecuencias del conflicto sobre las mujeres, los niños y las niñas y los civiles israelíes y palestinos”, y abogó por una “tregua humanitaria que permita la llegada de la ayuda internacional, que en parte es ayuda argentina”.

Translation in the record:

> the President expressed his "concern at the terrible consequences of the conflict for women, children and Israeli and Palestinian civilians", and called for a "humanitarian truce that allows international aid to arrive, part of which is Argentine aid".

Mechanical check: found at line 5, starting within the locator (line 5). Archived text at line 5 of `archive/text/src_20231122_cancilleria_fernandez-g20-tregua.txt`:

> Acompañado por el ministro de Relaciones Exteriores, Comercio Internacional y Culto, Santiago Cafiero, el mandatario expresó su “preocupación por las terribles consecuencias del conflicto sobre las mujeres, los niños y las niñas y los civiles israelíes y palestinos”, y abogó por una “tregua humanitaria que permita la llegada de la ayuda internacional, que en parte es ayuda argentina”.

### Armenia (ARM)

#### evt_2024_12_31_ARM_D3

- [ ] Checked (8 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | D3, standing |
| Date | 2024-12-31 to 2025-12-31 |
| Speaker or actor | Government of Armenia / Gouvernement de l'Arménie |
| Tier (points) | +8: Increased tier (+8): UNRWA's table for 2024 gives USD 20,000 pledged and received for Armenia (rank 107), against no row in the 2022 table (a zero baseline). |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | Armenia's contribution to UNRWA for 2024 exceeded its 2022 contribution in UNRWA's donor tables. |
| Summary (FR) | La contribution de l'Arménie à l'UNRWA pour 2024 a dépassé celle de 2022, selon les tableaux des donateurs de l'UNRWA. |
| Second reading | agree, 2026-11-04; the notes mention a flag |

Evidence 1: `src_20241231_unrwa_donor-ranking-2024` (dataset, UNRWA, 2024-12-31), locator **line 159**, language `en`.
Wayback: <https://web.archive.org/web/20260521084323id_/https://www.unrwa.org/sites/default/files/overall_donor_ranking_by_pledged_and_received_002.pdf>

Quote:

> Armenia 20,000 20,000 - - 20,000 20,000 - - - - - - - - - - - - - - 20,000 107 20,000 104

Mechanical check: found at line 159, starting within the locator (line 159). Archived text at line 159 of `archive/text/src_20241231_unrwa_donor-ranking-2024.txt`:

> Armenia 20,000 20,000 - - 20,000 20,000 - - - - - - - - - - - - - - 20,000 107 20,000 104

### Antigua and Barbuda (ATG)

#### evt_2024_09_27_ATG_B9

- [ ] Checked (9 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2024-09-27 |
| Speaker or actor | Prime Minister / Premier ministre |
| Tier (points) | +2: Formal call to end the conflict (+2): the Prime Minister calls on all parties to end the suffering by negotiating and says it is time to end these conflicts; no specific violation is named. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Prime Minister told the General Assembly that it was time to end the conflicts in the Middle East and called on all parties to negotiate a lasting solution. |
| Summary (FR) | Le Premier ministre a déclaré devant l'Assemblée générale qu'il était temps de mettre fin aux conflits au Moyen-Orient et a appelé toutes les parties à négocier une solution durable. |
| Second reading | agree, 2026-10-06; the notes mention a flag |

Evidence 1: `src_20240927_un-gadebate_atg-browne-en` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2024-09-27), locator **line 196**, language `en`.
Wayback: <https://web.archive.org/web/20241111150007id_/https://gadebate.un.org/sites/default/files/gastatements/79/ag_en.pdf>

Quote:

> We call on all parties to end the suffering, by sitting down at a table of peace, where sincere negotiations can lead to a lasting solution.

Mechanical check: found at lines 196–197, starting within the locator (line 196). Archived text at lines 196–197 of `archive/text/src_20240927_un-gadebate_atg-browne-en.txt`:

> We call on all parties to end the suffering, by sitting down at a table of peace, where sincere negotiations can lead to a lasting solution.

Evidence 2: `src_20240927_un-gadebate_atg-browne-en` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2024-09-27), locator **line 200**, language `en`.
Wayback: <https://web.archive.org/web/20241111150007id_/https://gadebate.un.org/sites/default/files/gastatements/79/ag_en.pdf>

Quote:

> It is time for the people of this region - and all conflict zones, to end these conflicts and to give peace a chance.

Mechanical check: found at lines 200–201, starting within the locator (line 200). Archived text at lines 200–201 of `archive/text/src_20240927_un-gadebate_atg-browne-en.txt`:

> It is time for the people of this region - and all conflict zones, to end these conflicts and to give peace a chance.

Evidence 3: `src_20240927_un-gadebate_atg-browne-en` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2024-09-27), locator **line 202**, language `en`.
Wayback: <https://web.archive.org/web/20241111150007id_/https://gadebate.un.org/sites/default/files/gastatements/79/ag_en.pdf>

Quote:

> From Gaza to Sudan, Ukraine to Yemen, the scars of conflict run deep, leaving devastation in their

Mechanical check: found at line 202, starting within the locator (line 202). Archived text at line 202 of `archive/text/src_20240927_un-gadebate_atg-browne-en.txt`:

> From Gaza to Sudan, Ukraine to Yemen, the scars of conflict run deep, leaving devastation in their

### Australia (AUS)

#### evt_2024_10_26_AUS_B9

- [ ] Checked (10 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2024-10-26 |
| Speaker or actor | Minister for Foreign Affairs / Ministre des Affaires étrangères |
| Tier (points) | +2: Formal call for humanitarian access (+2, call tier): the seven foreign ministers urged Israel to facilitate full, rapid, safe and unhindered humanitarian assistance and to keep UNRWA's privileges and immunities; no violation is named. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister for Foreign Affairs joined six foreign ministers in urging Israel to keep UNRWA's privileges and immunities and to facilitate unhindered humanitarian assistance. |
| Summary (FR) | La ministre des Affaires étrangères s'est jointe à six homologues pour exhorter Israël à préserver les privilèges et immunités de l'UNRWA et à faciliter l'aide humanitaire. |
| Second reading | agree, 2026-09-30 |

Evidence 1: `src_20241026_gac_joint-statement-unrwa-legislation` (official, Global Affairs Canada, 2024-10-26), locator **line 5**, language `en`.
Wayback: <https://web.archive.org/web/20241028025407id_/https://www.canada.ca/en/global-affairs/news/2024/10/foreign-ministers-statement-on-legislation-against-united-nations-relief-and-works-agency-for-palestine-refugees-in-the-near-east-under-considerati.html>

Quote:

> We urge the Israeli Government to abide by its international obligations, keep the reserve privileges and immunities of UNRWA untouched and live up to its responsibility to facilitate full, rapid, safe and unhindered humanitarian assistance in all its forms as well as the provision of sorely needed basic services to the civilian population.

Mechanical check: found at line 5, starting within the locator (line 5). Archived text at line 5 of `archive/text/src_20241026_gac_joint-statement-unrwa-legislation.txt`:

> … UN organizations and agencies be fully able to deliver humanitarian aid and their assistance to those who need it most, fulfilling their mandates effectively. We urge the Israeli Government to abide by its international obligations, keep the reserve privileges and immunities of UNRWA untouched and live up to its responsibility to facilitate full, rapid, safe and unhindered humanitarian assistance in all its forms as well as the provision of sorely needed basic services to the civilian population.

Evidence 2: `src_20241026_gac_joint-statement-unrwa-legislation` (official, Global Affairs Canada, 2024-10-26), locator **line 3**, language `en`.
Wayback: <https://web.archive.org/web/20241028025407id_/https://www.canada.ca/en/global-affairs/news/2024/10/foreign-ministers-statement-on-legislation-against-united-nations-relief-and-works-agency-for-palestine-refugees-in-the-near-east-under-considerati.html>

Quote:

> “We, the Foreign Ministers of Canada, Australia

Mechanical check: found at line 3, starting within the locator (line 3). Archived text at line 3 of `archive/text/src_20241026_gac_joint-statement-unrwa-legislation.txt`:

> “We, the Foreign Ministers of Canada, Australia, France, Germany, Japan, Republic of Korea and the United Kingdom, express our grave concern over legislation currently under consideration by the Israeli …

### Austria (AUT)

#### evt_2024_04_19_AUT_B11

- [ ] Checked (11 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B11, standing |
| Date | 2024-04-19 |
| Speaker or actor | — / — |
| Tier (points) | +5: Sanctions on settler entities (+5): the EU listing of 19 April 2024 (Decision (CFSP) 2024/1175) of four settlers and two settler entities (Lehava, Hilltop Youth), adopted by unanimity. West Bank only: tagged, unscored in v1 (docs/10 B-32). |
| Confidence | confirmed |
| Scope | west-bank |
| Summary (EN) | The government agreed in the EU Council to sanctions on four Israeli settlers and two settler entities for human rights abuses against Palestinians in the West Bank. |
| Summary (FR) | Le gouvernement a approuvé au Conseil de l'UE des sanctions contre quatre colons israéliens et deux entités de colons pour des atteintes aux droits de Palestiniens en Cisjordanie. |
| Second reading | agree, 2026-09-30 |

Evidence 1: `src_20240419_consilium_settlers-sanctions` (official, Council of the European Union, 2024-04-19), locator **line 1**, language `en`.
Wayback: <https://web.archive.org/web/20240419135311id_/https://www.consilium.europa.eu/en/press/press-releases/2024/04/19/extremist-settlers-in-the-occupied-west-bank-and-east-jerusalem-council-sanctions-four-individuals-and-two-entities-over-serious-human-rights-abuses-against-palestinians/>

Quote:

> The Council decided today to list four persons and two entities under the EU Global Human Rights Sanctions Regime. The listed individuals and entities are responsible for serious human rights abuses against Palestinians, including torture and other cruel, inhuman or degrading treatment or punishment and for the violation of right to property and to private and family life of Palestinians in the West Bank.

Mechanical check: found at line 1, starting within the locator (line 1). Archived text at line 1 of `archive/text/src_20240419_consilium_settlers-sanctions.txt`:

> The Council decided today to list four persons and two entities under the EU Global Human Rights Sanctions Regime. The listed individuals and entities are responsible for serious human rights abuses against Palestinians, including torture and other cruel, inhuman or degrading treatment or punishment and for the violation of right to property and to private and family life of Palestinians in the West Bank.

Evidence 2: `src_20240419_consilium_settlers-sanctions` (official, Council of the European Union, 2024-04-19), locator **line 2**, language `en`.
Wayback: <https://web.archive.org/web/20240419135311id_/https://www.consilium.europa.eu/en/press/press-releases/2024/04/19/extremist-settlers-in-the-occupied-west-bank-and-east-jerusalem-council-sanctions-four-individuals-and-two-entities-over-serious-human-rights-abuses-against-palestinians/>

Quote:

> The listed entities are Lehava, a radical right-wing Jewish supremacist group, and Hilltop Youth, a radical youth group consisting of members known for violent acts against Palestinians and their villages in the West Bank. Two leading figures of Hilltop Youth, Meir Ettinger and Elisha Yered, are also listed. Both were involved in deadly attacks against Palestinians in 2015 and 2023.

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20240419_consilium_settlers-sanctions.txt`:

> The listed entities are Lehava, a radical right-wing Jewish supremacist group, and Hilltop Youth, a radical youth group consisting of members known for violent acts against Palestinians and their villages in the West Bank. Two leading figures of Hilltop Youth, Meir Ettinger and Elisha Yered, are also listed. Both were involved in deadly attacks against Palestinians in 2015 and 2023.

Evidence 3: `src_20240419_consilium_settlers-sanctions` (official, Council of the European Union, 2024-04-19), locator **line 11**, language `en`.
Wayback: <https://web.archive.org/web/20240419135311id_/https://www.consilium.europa.eu/en/press/press-releases/2024/04/19/extremist-settlers-in-the-occupied-west-bank-and-east-jerusalem-council-sanctions-four-individuals-and-two-entities-over-serious-human-rights-abuses-against-palestinians/>

Quote:

> Council Decision (CFSP) 2024/1175 of 19 April 2024 amending Decision (CFSP) 2020/1999 concerning restrictive measures against serious human rights violations and abuses

Mechanical check: found at line 11, starting within the locator (line 11). Archived text at line 11 of `archive/text/src_20240419_consilium_settlers-sanctions.txt`:

> Council Decision (CFSP) 2024/1175 of 19 April 2024 amending Decision (CFSP) 2020/1999 concerning restrictive measures against serious human rights violations and abuses

#### evt_2024_01_29_AUT_D2

- [ ] Checked (12 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | D2, standing |
| Date | 2024-01-29 to 2024-05-18 |
| Speaker or actor | Federal Ministry for European and International Affairs / Ministère fédéral des Affaires européennes et internationales |
| Tier (points) | −10 |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Federal Ministry for European and International Affairs suspended all further payments to UNRWA until the allegations against UNRWA staff were cleared up. |
| Summary (FR) | Le ministère fédéral des Affaires européennes et internationales a suspendu tout nouveau versement à l'UNRWA jusqu'à l'éclaircissement des accusations visant des employés de l'UNRWA. |
| Second reading | agree, 2026-09-29 |

Evidence 1: `src_20240129_bmeia_suspendiert-unrwa` (official, Bundesministerium für europäische und internationale Angelegenheiten (BMEIA, Federal Ministry for European and International Affairs), press releases, 2024-01-29), locator **line 520**, language `de`.
Wayback: <https://web.archive.org/web/20260928231944id_/https://www.bmeia.gv.at/ministerium/presse/aktuelles/2024/01/oesterreich-suspendiert-zahlungen-an-unrwa>

Quote:

> Bis all diese Vorwürfe vollständig aufgeklärt sind und Klarheit über die daraus gezogenen Konsequenzen herrscht, wird Österreich in Abstimmung mit internationalen Partnern vorläufig alle weiteren Zahlungen an UNRWA suspendieren.

Translation in the record:

> Until all these allegations have been fully cleared up and there is clarity about the consequences drawn from them, Austria will, in coordination with international partners, provisionally suspend all further payments to UNRWA.

Mechanical check: found at line 520, starting within the locator (line 520). Archived text at line 520 of `archive/text/src_20240129_bmeia_suspendiert-unrwa.txt`:

> … der eigenen Glaubwürdigkeit über jede Kritik erhaben sein. Mögliche Beteiligte an der Terrorattacke vom 7. Oktober müssen zur Rechenschaft gezogen werden. Bis all diese Vorwürfe vollständig aufgeklärt sind und Klarheit über die daraus gezogenen Konsequenzen herrscht, wird Österreich in Abstimmung mit internationalen Partnern vorläufig alle weiteren Zahlungen an UNRWA suspendieren.

#### evt_2025_09_27_AUT_B9

- [ ] Checked (13 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-09-27 |
| Speaker or actor | Federal Minister for European and International Affairs / Ministre fédérale des Affaires européennes et internationales |
| Tier (points) | +2: Formal call for a ceasefire or for the end of restrictions on aid (+2): the joint statement urges Israel to lift restrictions on deliveries of medicine and medical equipment to Gaza and to restore the medical corridor; no violation is named. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Foreign Minister, with other foreign ministers, urged Israel to lift restrictions on medicine for Gaza and to restore the medical corridor to the West Bank. |
| Summary (FR) | La ministre des Affaires étrangères et d'autres ministres ont exhorté Israël à lever ses restrictions sur les médicaments pour Gaza et à rouvrir le corridor médical vers la Cisjordanie. |
| Second reading | agree, 2026-09-30 |

Evidence 1: `src_20250927_fm-gov-au_joint-statement-gaza-patients` (official, Minister for Foreign Affairs of Australia, 2025-09-27), locator **line 9**, language `en`.
Wayback: <https://web.archive.org/web/20260928190717id_/https://www.foreignminister.gov.au/minister/penny-wong/media-release/joint-statement-offer-assist-treatments-patients-gaza-occupied-west-bank-including-east-jerusalem>

Quote:

> We furthermore urge Israel to lift restrictions on deliveries of medicine and medical equipment to Gaza in line with Israel’s obligations under international law, including international humanitarian law;

Mechanical check: found at line 9, starting within the locator (line 9). Archived text at line 9 of `archive/text/src_20250927_fm-gov-au_joint-statement-gaza-patients.txt`:

> We furthermore urge Israel to lift restrictions on deliveries of medicine and medical equipment to Gaza in line with Israel’s obligations under international law, including international humanitarian law; to urgently and fully enable the UN and other humanitarian partners to do their life-saving work in Gaza; and in line with UN Security Council resolution 2286 …

Evidence 2: `src_20250927_fm-gov-au_joint-statement-gaza-patients` (official, Minister for Foreign Affairs of Australia, 2025-09-27), locator **line 2**, language `en`.
Wayback: <https://web.archive.org/web/20260928190717id_/https://www.foreignminister.gov.au/minister/penny-wong/media-release/joint-statement-offer-assist-treatments-patients-gaza-occupied-west-bank-including-east-jerusalem>

Quote:

> The Foreign Ministers of Australia, Austria

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20250927_fm-gov-au_joint-statement-gaza-patients.txt`:

> The Foreign Ministers of Australia, Austria, Belgium, Canada, Croatia, Cyprus, Denmark, Finland, France, Germany, Greece, Iceland, Ireland, Italy, Lithuania, Luxembourg, Malta, the Netherlands, Norway, …

#### evt_2026_09_24_AUT_B9

- [ ] Checked (14 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2026-09-24 |
| Speaker or actor | Federal Minister for European and International Affairs / Ministre fédérale des Affaires européennes et internationales |
| Tier (points) | +2: Formal call (+2): the Foreign Minister tells the General Assembly that Palestinians in Gaza need peace and stability with Hamas disarmed and the IDF withdrawing from the Strip, and that settlement expansion in the West Bank must be firmly rejected; she names no violation and does not call for a ceasefire or for aid by name. |
| Confidence | confirmed |
| Scope | gaza, west-bank |
| Summary (EN) | The Foreign Minister told the General Assembly that Gaza needed peace, with Hamas disarmed and the IDF withdrawing, and that settlement expansion in the West Bank must be rejected. |
| Summary (FR) | La ministre des Affaires étrangères a déclaré à l'Assemblée générale que Gaza avait besoin de paix, le Hamas désarmé et l'armée israélienne retirée, et qu'il fallait rejeter l'expansion des colonies. |
| Second reading | agree, 2026-11-09 |

Evidence 1: `src_20260924_un-gadebate_aut-meinl-reisinger-81-en` (official, Federal Ministry for European and International Affairs (Austria), through the UN General Debate (gadebate.un.org), 2026-09-24), locator **lines 58 to 59**, language `en`.
Wayback: <https://web.archive.org/web/20261022075407id_/https://gadebate.un.org/sites/default/files/gastatements/81/at_en.pdf>

Quote:

> Palestinians in Gaza desperately need peace and stability, with Hamas disarmed and the IDF withdrawing from the Strip.

Mechanical check: found at lines 58–59, starting within the locator (lines 58 to 59). Archived text at lines 58–59 of `archive/text/src_20260924_un-gadebate_aut-meinl-reisinger-81-en.txt`:

> Palestinians in Gaza desperately need peace and stability, with Hamas disarmed and the IDF withdrawing from the Strip.

Evidence 2: `src_20260924_un-gadebate_aut-meinl-reisinger-81-en` (official, Federal Ministry for European and International Affairs (Austria), through the UN General Debate (gadebate.un.org), 2026-09-24), locator **lines 55 to 57**, language `en`.
Wayback: <https://web.archive.org/web/20261022075407id_/https://gadebate.un.org/sites/default/files/gastatements/81/at_en.pdf>

Quote:

> Any unilateral actions that undermine this prospect – including the continued settlement expansions in the West Bank – only perpetuate the conflict and must be firmly rejected by all of us.

Mechanical check: found at lines 55–57, starting within the locator (lines 55 to 57). Archived text at lines 55–57 of `archive/text/src_20260924_un-gadebate_aut-meinl-reisinger-81-en.txt`:

> security, with a credible path to a two-state solution. Any unilateral actions that undermine this prospect – including the continued settlement expansions in the West Bank – only perpetuate the conflict and must be firmly rejected by all of us.

#### evt_2026_09_03_AUT_B9

- [ ] Checked (15 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2026-09-03 |
| Speaker or actor | Federal Minister for European and International Affairs / Ministre fédérale des Affaires européennes et internationales |
| Tier (points) | +5: Legal characterisation (+5): Israeli settlement building called contrary to international law. |
| Confidence | confirmed |
| Scope | west-bank |
| Summary (EN) | The Foreign Minister and the Jordanian foreign minister condemned Israeli settlement building in the West Bank as contrary to international law, and settler violence. |
| Summary (FR) | La ministre des Affaires étrangères et son homologue jordanien ont condamné la colonisation israélienne en Cisjordanie, contraire au droit international, et la violence des colons. |
| Second reading | agree, 2026-09-29 |

Evidence 1: `src_20260903_bmeia_meinl-reisinger-safadi` (official, Bundesministerium für europäische und internationale Angelegenheiten (BMEIA, Federal Ministry for European and International Affairs), press releases, 2026-09-03), locator **line 522**, language `de`.
Wayback: <https://web.archive.org/web/20260928232506id_/https://www.bmeia.gv.at/ministerium/presse/aktuelles/alle/musterjahr/09-1-1/meinl-reisinger-trifft-jordanischem-aussenminister-safadi-deeskalation-und-diplomatie-sind-das-gebot-der-stunde-oesterreich-und-jordanien-vertiefen-sicherheitspolitische-zusammenarbeit>

Quote:

> Österreich und Jordanien setzen sich im Nahen Osten für eine Zweistaatenlösung ein und verurteilen den völkerrechtswidrigen israelischen Siedlungsbau sowie die zunehmende Gewalt von Siedlerinnen und Siedlern im Westjordanland auf das Schärfste.

Translation in the record:

> Austria and Jordan support a two-state solution in the Middle East and condemn in the strongest terms the Israeli settlement building, contrary to international law, and the increasing violence by settlers in the West Bank.

Mechanical check: found at line 522, starting within the locator (line 522). Archived text at line 522 of `archive/text/src_20260903_bmeia_meinl-reisinger-safadi.txt`:

> Österreich und Jordanien setzen sich im Nahen Osten für eine Zweistaatenlösung ein und verurteilen den völkerrechtswidrigen israelischen Siedlungsbau sowie die zunehmende Gewalt von Siedlerinnen und Siedlern im Westjordanland auf das Schärfste. Im Hinblick auf Österreichs Mitgliedschaft im Sicherheitsrat 2027/28 wollen beide Länder ihre Abstimmung zu Gaza und dem Nahen Osten intensivieren.

### Azerbaijan (AZE)

#### evt_2026_02_04_AZE_C2

- [ ] Checked (16 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | C2, standing |
| Date | 2026-02-04 |
| Speaker or actor | Minister of Digital Development and Transport / Ministre du Développement numérique et des Transports |
| Tier (points) | −10 |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister of Digital Development and Transport signed with Israel's National Artificial Intelligence Directorate a memorandum of understanding on cooperation in artificial intelligence. |
| Summary (FR) | Le ministre du Développement numérique et des Transports a signé avec la direction israélienne de l'intelligence artificielle un mémorandum d'entente sur la coopération dans ce domaine. |
| Second reading | agree, 2026-09-30 |

Evidence 1: `src_20260204_mincom_ai-mou-israel` (official, Ministry of Digital Development and Transport of the Republic of Azerbaijan, 2026-02-04), locator **line 143**, language `en`.
Wayback: <https://web.archive.org/web/20260929220741id_/https://mincom.gov.az/en/media-en/news/mou-on-ai-cooperation-signed-during-rashad-nabiyevs-israel-visit>

Quote:

> As part of his official visit to Israel, Rashad Nabiyev, Minister of Digital Development and Transport, signed a Memorandum of Understanding (MoU) on artificial intelligence (AI) cooperation with Israel’s National Artificial Intelligence Directorate of the Prime Minister’s Office.

Mechanical check: found at line 143, starting within the locator (line 143). Archived text at line 143 of `archive/text/src_20260204_mincom_ai-mou-israel.txt`:

> As part of his official visit to Israel, Rashad Nabiyev, Minister of Digital Development and Transport, signed a Memorandum of Understanding (MoU) on artificial intelligence (AI) cooperation with Israel’s National Artificial Intelligence Directorate of the Prime Minister’s Office. The ceremony featured a speech by Israeli Prime Minister Benjamin Netanyahu.

### Belgium (BEL)

#### evt_2025_07_21_BEL_B9

- [ ] Checked (17 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-07-21 |
| Speaker or actor | Minister of Foreign Affairs / Ministre des Affaires étrangères |
| Tier (points) | +5: Names specific violations (+5): the joint statement calls the denial of essential humanitarian assistance unacceptable and permanent forced displacement a violation of international humanitarian law. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister of Foreign Affairs, with other foreign ministers, said the war in Gaza must end now and called forced displacement a violation of international humanitarian law. |
| Summary (FR) | Le ministre des Affaires étrangères, avec d'autres ministres, a déclaré que la guerre à Gaza devait cesser et qualifié le déplacement forcé de violation du droit international humanitaire. |
| Second reading | agree, 2026-09-28 |

Evidence 1: `src_20250721_gac_joint-statement-26-partners` (official, Global Affairs Canada, 2025-07-21), locator **line 5**, language `en`.
Wayback: <https://web.archive.org/web/20260928182124id_/https://www.canada.ca/en/global-affairs/news/2025/07/joint-statement-on-behalf-of-26-partners-on-the-occupied-palestinian-territories.html>

Quote:

> The Israeli Government’s denial of essential humanitarian assistance to the civilian population is unacceptable.

Mechanical check: found at line 5, starting within the locator (line 5). Archived text at line 5 of `archive/text/src_20250721_gac_joint-statement-26-partners.txt`:

> … including children, seeking to meet their most basic needs of water and food. It is horrifying that over 800 Palestinians have been killed while seeking aid. The Israeli Government’s denial of essential humanitarian assistance to the civilian population is unacceptable. Israel must comply with its obligations under international humanitarian law.

Evidence 2: `src_20250721_gac_joint-statement-26-partners` (official, Global Affairs Canada, 2025-07-21), locator **line 8**, language `en`.
Wayback: <https://web.archive.org/web/20260928182124id_/https://www.canada.ca/en/global-affairs/news/2025/07/joint-statement-on-behalf-of-26-partners-on-the-occupied-palestinian-territories.html>

Quote:

> Permanent forced displacement is a violation of international humanitarian law.

Mechanical check: found at line 8, starting within the locator (line 8). Archived text at line 8 of `archive/text/src_20250721_gac_joint-statement-26-partners.txt`:

> … the obligations of international humanitarian law. Proposals to remove the Palestinian population into a ‘humanitarian city’ are completely unacceptable. Permanent forced displacement is a violation of international humanitarian law.

Evidence 3: `src_20250721_gac_joint-statement-26-partners` (official, Global Affairs Canada, 2025-07-21), locator **line 1**, language `en`.
Wayback: <https://web.archive.org/web/20260928182124id_/https://www.canada.ca/en/global-affairs/news/2025/07/joint-statement-on-behalf-of-26-partners-on-the-occupied-palestinian-territories.html>

Quote:

> The Foreign Ministers of Australia, Austria, Belgium, Canada, Denmark

Mechanical check: found at line 1, starting within the locator (line 1). Archived text at line 1 of `archive/text/src_20250721_gac_joint-statement-26-partners.txt`:

> The Foreign Ministers of Australia, Austria, Belgium, Canada, Denmark, Estonia, Finland, France, Iceland, Ireland, Italy, Japan, Latvia, Lithuania, Luxembourg, The Netherlands, New Zealand, Norway, Poland, Portugal, Slovenia, …

#### evt_2026_05_28_BEL_B11

- [ ] Checked (18 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B11, standing |
| Date | 2026-05-28 |
| Speaker or actor | — / — |
| Tier (points) | +5: Sanctions on settler entities (+5): the EU listing of 28 May 2026 (Implementing Regulation (EU) 2026/1177) of four settler organisations and three individuals, adopted by unanimity; it lists Nachala for abuses in the West Bank and the Gaza Strip. The settler tier already holds from 15 July 2024 (one per tier), so it adds no points. |
| Confidence | confirmed |
| Scope | gaza, west-bank |
| Summary (EN) | The government agreed in the EU Council to sanctions on three Israeli settler leaders and four settler organisations, one of them for efforts to resettle the Gaza Strip. |
| Summary (FR) | Le gouvernement a approuvé au Conseil de l'UE des sanctions contre trois dirigeants de colons israéliens et quatre organisations de colons, dont l'une pour son projet de colonisation de Gaza. |
| Second reading | agree, 2026-09-30 |

Evidence 1: `src_20260528_eur-lex_reg-impl-2026-1177` (official, Council of the European Union (Official Journal, EUR-Lex), 2026-05-28), locator **line 2**, language `en`.
Wayback: <https://web.archive.org/web/20260529134604id_/https://eur-lex.europa.eu/eli/reg_impl/2026/1177/oj/eng>

Quote:

> the following entries are added to the list of natural or legal persons, entities or bodies under the heading ‘B. Legal persons, entities and bodies’:

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20260528_eur-lex_reg-impl-2026-1177.txt`:

> the following entries are added to the list of natural or legal persons, entities or bodies under the heading ‘B. Legal persons, entities and bodies’:

Evidence 2: `src_20260528_eur-lex_reg-impl-2026-1177` (official, Council of the European Union (Official Journal, EUR-Lex), 2026-05-28), locator **line 27**, language `en`.
Wayback: <https://web.archive.org/web/20260529134604id_/https://eur-lex.europa.eu/eli/reg_impl/2026/1177/oj/eng>

Quote:

> After 7 October 2023, Nachala has furthermore been at the forefront of efforts to resettle the Gaza Strip. Therefore, Nachala is responsible for facilitating and encouraging human rights abuses in the West Bank and the Gaza Strip, including abuses of the right of Palestinians to self-determination, their right to property, their right to private and family life, as well as the right to life and to physical health, which are of serious concern as regards the objectives of the common foreign and security policy set out in Article 21 of the Treaty on European Union.

Mechanical check: found at line 27, starting within the locator (line 27). Archived text at line 27 of `archive/text/src_20260528_eur-lex_reg-impl-2026-1177.txt`:

> After 7 October 2023, Nachala has furthermore been at the forefront of efforts to resettle the Gaza Strip. Therefore, Nachala is responsible for facilitating and encouraging human rights abuses in the West Bank and the Gaza Strip, including abuses of the right of Palestinians to self-determination, their right to property, their right to private and family life, as well as the right to life and to physical health, which are of serious concern as regards the objectives of the common foreign and security policy set out in Article 21 of the Treaty on European Union.

#### evt_2024_02_07_BEL_A6

- [ ] Checked (19 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | A6, standing |
| Date | 2024-02-07 |
| Speaker or actor | Walloon Government and Brussels-Capital Region / Gouvernement wallon et Région de Bruxelles-Capitale |
| Tier (points) | +10 |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Walloon Government suspended the valid licences for exports of military equipment to Israel, and Wallonia and Brussels extended their refusal to dual-use and transit licences. |
| Summary (FR) | Le gouvernement wallon a suspendu les licences valides d'exportation de matériel militaire vers Israël, et la Wallonie et Bruxelles ont étendu leur refus aux licences de double usage et de transit. |
| Second reading | agree, 2026-09-28; the notes mention a flag |

Evidence 1: `src_20240207_wallonie_licences-israel` (official, Minister-President of the Walloon Government, 2024-02-07), locator **line 16**, language `fr`.
Wayback: <https://web.archive.org/web/20240223000215id_/https://dirupo.wallonie.be/home/presse--actualites/communiques-de-presse1/presses/bruxelles-et-la-wallonie-decident-detendre-leur-politique-restrictive-dexportations-de-biens-militaires-vers-israel-aux-biens-a-double-usage-et-aux-licences-de-transit-a-destination-disrael.html>

Quote:

> la Wallonie a décidé de suspendre temporairement les licences d’exportation de matériel militaire en cours de validité à destination d’Israël.

Translation in the record:

> Wallonia decided to temporarily suspend the valid export licences for military equipment destined for Israel.

Mechanical check: found at line 16, starting within the locator (line 16). Archived text at line 16 of `archive/text/src_20240207_wallonie_licences-israel.txt`:

> … de la Cour Internationale de Justice le 26 janvier dernier et compte tenu des énormes pertes civiles, en particulier des enfants, dans la Bande de Gaza, la Wallonie a décidé de suspendre temporairement les licences d’exportation de matériel militaire en cours de validité à destination d’Israël. Ces licences ont été octroyées avant le conflit, conformément à la position de 2009.

Evidence 2: `src_20240207_wallonie_licences-israel` (official, Minister-President of the Walloon Government, 2024-02-07), locator **line 13**, language `fr`.
Wayback: <https://web.archive.org/web/20240223000215id_/https://dirupo.wallonie.be/home/presse--actualites/communiques-de-presse1/presses/bruxelles-et-la-wallonie-decident-detendre-leur-politique-restrictive-dexportations-de-biens-militaires-vers-israel-aux-biens-a-double-usage-et-aux-licences-de-transit-a-destination-disrael.html>

Quote:

> 3. De ne procurer aucune licence pour le transit d’armes et de biens et technologies à double usage qui renforcerait la capacité militaire des forces en présence.

Translation in the record:

> 3. To grant no licence for the transit of arms and dual-use goods and technologies that would strengthen the military capacity of the forces present.

Mechanical check: found at line 13, starting within the locator (line 13). Archived text at line 13 of `archive/text/src_20240207_wallonie_licences-israel.txt`:

> 3. De ne procurer aucune licence pour le transit d’armes et de biens et technologies à double usage qui renforcerait la capacité militaire des forces en présence.

Evidence 3: `src_20240207_wallonie_licences-israel` (official, Minister-President of the Walloon Government, 2024-02-07), locator **line 6**, language `fr`.
Wayback: <https://web.archive.org/web/20240223000215id_/https://dirupo.wallonie.be/home/presse--actualites/communiques-de-presse1/presses/bruxelles-et-la-wallonie-decident-detendre-leur-politique-restrictive-dexportations-de-biens-militaires-vers-israel-aux-biens-a-double-usage-et-aux-licences-de-transit-a-destination-disrael.html>

Quote:

> Ce sont en effet les régions, en tant qu’entités fédérées, qui sont compétentes en matière d’octroi de licences d’exportation de biens militaires et de technologies à double usage dans notre pays.

Translation in the record:

> It is the regions, as federated entities, that are competent for granting export licences for military goods and dual-use technologies in our country.

Mechanical check: found at line 6, starting within the locator (line 6). Archived text at line 6 of `archive/text/src_20240207_wallonie_licences-israel.txt`:

> Ce sont en effet les régions, en tant qu’entités fédérées, qui sont compétentes en matière d’octroi de licences d’exportation de biens militaires et de technologies à double usage dans notre pays.

Evidence 4: `src_20240924_premier-be_discours-agnu79` (official, Prime Minister of Belgium, 2024-09-24), locator **line 27**, language `fr`.
Wayback: <https://web.archive.org/web/20250120074717id_/https://www.premier.be/fr/discours-du-premier-ministre-devant-l%E2%80%99assembl%C3%A9e-g%C3%A9n%C3%A9rale-des-nations-unies>

Quote:

> La Belgique a imposé un embargo sur les armes.

Translation in the record:

> Belgium has imposed an arms embargo.

Mechanical check: found at line 27, starting within the locator (line 27). Archived text at line 27 of `archive/text/src_20240924_premier-be_discours-agnu79.txt`:

> La Belgique a imposé un embargo sur les armes.

### Burkina Faso (BFA)

#### evt_2026_06_24_BFA_B6

- [ ] Checked (20 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B6, standing |
| Date | 2026-06-24 |
| Speaker or actor | Government of Burkina Faso / Gouvernement du Burkina Faso |
| Tier (points) | −10 |
| Confidence | confirmed |
| Scope | related |
| Summary (EN) | The Government notified the UN Secretary-General of Burkina Faso's withdrawal from the Rome Statute, to take effect on 24 June 2027. |
| Summary (FR) | Le gouvernement a notifié au Secrétaire général de l'ONU le retrait du Burkina Faso du Statut de Rome, qui prendra effet le 24 juin 2027. |
| Second reading | agree, 2026-11-04; the notes mention a flag |

Evidence 1: `src_20260630_un-treaties_cn-263-2026-burkina-faso-withdrawal` (official, United Nations, Secretary-General as depositary (treaties.un.org), 2026-06-30), locator **lines 4 to 7**, language `en`.
Wayback: <https://web.archive.org/web/20260802081235id_/https://treaties.un.org/doc/Publication/CN/2026/CN.263.2026-Eng.pdf>

Quote:

> BURKINA FASO: WITHDRAWAL1 The Secretary-General of the United Nations, acting in his capacity as depositary, communicates the following: The above action was effected on 24 June 2026

Mechanical check: found at lines 4–7, starting within the locator (lines 4 to 7). Archived text at lines 4–7 of `archive/text/src_20260630_un-treaties_cn-263-2026-burkina-faso-withdrawal.txt`:

> BURKINA FASO: WITHDRAWAL1 The Secretary-General of the United Nations, acting in his capacity as depositary, communicates the following: The above action was effected on 24 June 2026, with:

Evidence 2: `src_20260630_un-treaties_cn-263-2026-burkina-faso-withdrawal` (official, United Nations, Secretary-General as depositary (treaties.un.org), 2026-06-30), locator **lines 20 to 21**, language `en`.
Wayback: <https://web.archive.org/web/20260802081235id_/https://treaties.un.org/doc/Publication/CN/2026/CN.263.2026-Eng.pdf>

Quote:

> The action shall take effect for Burkina Faso on 24 June 2027 in accordance with article 127 (1)

Mechanical check: found at lines 20–21, starting within the locator (lines 20 to 21). Archived text at lines 20–21 of `archive/text/src_20260630_un-treaties_cn-263-2026-burkina-faso-withdrawal.txt`:

> The action shall take effect for Burkina Faso on 24 June 2027 in accordance with article 127 (1) which reads as follows:

### Bangladesh (BGD)

#### evt_2024_09_27_BGD_B9

- [ ] Checked (21 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2024-09-27 |
| Speaker or actor | Chief Adviser of the interim Government of Bangladesh / Conseiller principal du gouvernement intérimaire du Bangladesh |
| Tier (points) | +5: Legal characterisation (+5): the Chief Adviser, naming Gaza, speaks of the genocide in Gaza and of crimes against humanity against the Palestinian people, and calls for an immediate and complete ceasefire. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Chief Adviser told the General Assembly that what he called the genocide in Gaza continued and called for an immediate and complete ceasefire. |
| Summary (FR) | Le conseiller principal a déclaré à l'Assemblée générale que ce qu'il a appelé le génocide à Gaza se poursuivait et a appelé à un cessez-le-feu immédiat et complet. |
| Second reading | agree, 2026-11-04; the notes mention a flag |

Evidence 1: `src_20240927_un-gadebate_bgd-yunus-en` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2024-09-27), locator **line 188**, language `en`.
Wayback: <https://web.archive.org/web/20241012041916id_/https://gadebate.un.org/sites/default/files/gastatements/79/bd_en.pdf>

Quote:

> The genocide in Gaza continues unabated despite global concerns and condemnation.

Mechanical check: found at line 188, starting within the locator (line 188). Archived text at line 188 of `archive/text/src_20240927_un-gadebate_bgd-yunus-en.txt`:

> The genocide in Gaza continues unabated despite global concerns and condemnation. The

Evidence 2: `src_20240927_un-gadebate_bgd-yunus-en` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2024-09-27), locator **line 191**, language `en`.
Wayback: <https://web.archive.org/web/20241012041916id_/https://gadebate.un.org/sites/default/files/gastatements/79/bd_en.pdf>

Quote:

> Bangladesh calls

Mechanical check: found at line 191, starting within the locator (line 191). Archived text at line 191 of `archive/text/src_20240927_un-gadebate_bgd-yunus-en.txt`:

> against humanity against the Palestinian people must be held accountable. Bangladesh calls

Evidence 3: `src_20240927_un-gadebate_bgd-yunus-en` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2024-09-27), locator **line 192**, language `en`.
Wayback: <https://web.archive.org/web/20241012041916id_/https://gadebate.un.org/sites/default/files/gastatements/79/bd_en.pdf>

Quote:

> for an immediate and complete ceasefire to protect the Palestinian people from the

Mechanical check: found at line 192, starting within the locator (line 192). Archived text at line 192 of `archive/text/src_20240927_un-gadebate_bgd-yunus-en.txt`:

> for an immediate and complete ceasefire to protect the Palestinian people from the

### Bulgaria (BGR)

#### evt_2024_09_25_BGR_B9

- [ ] Checked (22 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2024-09-25 |
| Speaker or actor | President / Président |
| Tier (points) | +2: Formal call for a ceasefire (+2): the President says that Bulgaria calls for an immediate ceasefire in Gaza, free access of the humanitarian convoys and the release of all hostages held by Hamas; no violation is named. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The President told the General Assembly that Bulgaria called for an immediate ceasefire in Gaza, free access for humanitarian convoys and the release of all hostages held by Hamas. |
| Summary (FR) | Le président a déclaré à l'Assemblée générale que la Bulgarie appelait à un cessez-le-feu immédiat à Gaza, à l'accès libre des convois humanitaires et à la libération de tous les otages du Hamas. |
| Second reading | agree, 2026-10-05 |

Evidence 1: `src_20240925_un-gadebate_bgr-radev-en` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2024-09-25), locator **lines 54-55**, language `en`.
Wayback: <https://web.archive.org/web/20250318074440id_/https://gadebate.un.org/sites/default/files/gastatements/79/bg_en.pdf>

Quote:

> We call for immediate ceasefire, free access of the humanitarian convoys as well as release of all hostages held by Hamas.

Mechanical check: found at lines 54–56, starting within the locator (lines 54-55). Archived text at lines 54–56 of `archive/text/src_20240925_un-gadebate_bgr-radev-en.txt`:

> in Gaza, the total destruction of vital infrastructure and mass displacement of people. We call for immediate ceasefire, free access of the humanitarian convoys as well as release of all hostages held by Hamas. We are also deeply concerned about the recent development in Lebanon,

### Bahrain (BHR)

#### evt_2023_12_31_BHR_D3

- [ ] Checked (23 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | D3, standing |
| Date | 2023-12-31 to 2024-12-31 |
| Speaker or actor | Government of Bahrain / Gouvernement de Bahreïn |
| Tier (points) | +8: Increased tier (+8): UNRWA's table for 2023 gives USD 3,050,000 for Bahrain (rank 32), against USD 50,000 in the 2022 table (rank 73). |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | Bahrain contributed more to UNRWA in 2023 than in 2022, according to UNRWA's donor tables. |
| Summary (FR) | La contribution de Bahreïn à l'UNRWA pour 2023 a dépassé celle de 2022, selon les tableaux des donateurs de l'UNRWA. |
| Second reading | agree, 2026-11-04; the notes mention a flag |

Evidence 1: `src_20231231_unrwa_donor-ranking-2023` (dataset, UNRWA, 2023-12-31), locator **line 48**, language `en`.
Wayback: <https://web.archive.org/web/20240617020444id_/https://www.unrwa.org/sites/default/files/overall_donor_ranking_.pdf>

Quote:

> Bahrain 50,000 0 50,000 0 0 3,000,000 0 0 0 0 3,050,000 32

Mechanical check: found at line 48, starting within the locator (line 48). Archived text at line 48 of `archive/text/src_20231231_unrwa_donor-ranking-2023.txt`:

> Bahrain 50,000 0 50,000 0 0 3,000,000 0 0 0 0 3,050,000 32

Evidence 2: `src_20221231_unrwa_donor-ranking-2022` (dataset, UNRWA, 2022-12-31), locator **line 84**, language `en`.
Wayback: <https://web.archive.org/web/20230921090159id_/https://www.unrwa.org/sites/default/files/overall_donor_ranking_2022.pdf>

Quote:

> Bahrain 50,000 0 50,000 0 0 0 50,000 73

Mechanical check: found at line 84, starting within the locator (line 84). Archived text at line 84 of `archive/text/src_20221231_unrwa_donor-ranking-2022.txt`:

> Bahrain 50,000 0 50,000 0 0 0 50,000 73

### Bosnia and Herzegovina (BIH)

#### evt_2025_09_25_BIH_B9

- [ ] Checked (24 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-09-25 |
| Speaker or actor | Chairman of the Presidency (head of state) / Président de la Présidence (chef de l’État) |
| Tier (points) | +5: Uses a legal characterisation (+5): in the General Debate of the 80th session the Chairman of the Presidency says that 'in the Gaza Strip' the Palestinian people face the two elements of genocide laid down in the Genocide Convention, and calls the violence unjustified. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Chairman of the Presidency, at the General Debate, said that the Palestinian people in the Gaza Strip faced what he called two elements of genocide. |
| Summary (FR) | Le président de la Présidence, au débat général, a déclaré que le peuple palestinien de la bande de Gaza faisait face à ce qu'il a appelé deux éléments du génocide. |
| Second reading | agree, 2026-11-04; the notes mention a flag |

Evidence 1: `src_20250925_un-gadebate_bih-komsic-bs` (official, Presidency of Bosnia and Herzegovina, through the UN General Debate (gadebate.un.org), 2025-09-25), locator **lines 93–96**, language `bs`.
Wayback: <https://web.archive.org/web/20260723150422id_/https://gadebate.un.org/sites/default/files/gastatements/80/ba_fl.pdf>

Quote:

> To je ovo što danas imamo u pojasu Gaze, gdje se narod Palestine suočava sa ova dva elementa genocida, propisana pomenutom Konvencijom o sprečavanju i kažnjavaju genocida,

Translation in the record:

> That is what we have today in the Gaza Strip, where the Palestinian people face these two elements of genocide, laid down in the said Convention on the Prevention and Punishment of the Crime of Genocide,

Mechanical check: found at lines 93–96, starting within the locator (lines 93–96). Archived text at lines 93–96 of `archive/text/src_20250925_un-gadebate_bih-komsic-bs.txt`:

> To je ovo što danas imamo u pojasu Gaze, gdje se narod Palestine suočava sa ova dva elementa genocida, propisana pomenutom Konvencijom o sprečavanju i kažnjavaju genocida, gdje jedan dio svjetske političke javnosti zatvara oči

Evidence 2: `src_20250925_un-gadebate_bih-komsic-bs` (official, Presidency of Bosnia and Herzegovina, through the UN General Debate (gadebate.un.org), 2025-09-25), locator **lines 98–102**, language `bs`.
Wayback: <https://web.archive.org/web/20260723150422id_/https://gadebate.un.org/sites/default/files/gastatements/80/ba_fl.pdf>

Quote:

> Ne postoji politički interes ili, čak, onaj ekonomski interes pokrenut namjerom za iskorištavanjem prirodnih resursa, kao što je to nafta ili prirodni gas u tom dijelu Mediterana, koji može opravdati ovako visok stepen genocidnog nasilja nad lokalnim palestinskim stanovništvom.

Translation in the record:

> There is no political interest or even economic interest, driven by the intention to exploit natural resources such as oil or natural gas in that part of the Mediterranean, that can justify such a high degree of genocidal violence against the local Palestinian population.

Mechanical check: found at lines 98–102, starting within the locator (lines 98–102). Archived text at lines 98–102 of `archive/text/src_20250925_un-gadebate_bih-komsic-bs.txt`:

> Ne postoji politički interes ili, čak, onaj ekonomski interes pokrenut namjerom za iskorištavanjem prirodnih resursa, kao što je to nafta ili prirodni gas u tom dijelu Mediterana, koji može opravdati ovako visok stepen genocidnog nasilja nad lokalnim palestinskim stanovništvom.

Evidence 3: `src_20250925_un-gadebate_bih-komsic-bs` (official, Presidency of Bosnia and Herzegovina, through the UN General Debate (gadebate.un.org), 2025-09-25), locator **lines 103–105**, language `bs`.
Wayback: <https://web.archive.org/web/20260723150422id_/https://gadebate.un.org/sites/default/files/gastatements/80/ba_fl.pdf>

Quote:

> Osim što je takvo nasilje neopravdano i neprihvatljivo, na isti način je neprihvatljiva šutnja, a povremeno i odobravanje, koje dolazi iz različitih političkih krugova u svijetu.

Translation in the record:

> Besides that such violence is unjustified and unacceptable, so is the silence, and at times the approval, that comes from various political circles in the world.

Mechanical check: found at lines 103–105, starting within the locator (lines 103–105). Archived text at lines 103–105 of `archive/text/src_20250925_un-gadebate_bih-komsic-bs.txt`:

> Osim što je takvo nasilje neopravdano i neprihvatljivo, na isti način je neprihvatljiva šutnja, a povremeno i odobravanje, koje dolazi iz različitih političkih krugova u svijetu.

### Belize (BLZ)

#### evt_2023_11_14_BLZ_B12

- [ ] Checked (25 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B12, standing |
| Date | 2023-11-14 |
| Speaker or actor | Ministry of Foreign Affairs, Foreign Trade and Immigration / Ministère des Affaires étrangères, du Commerce extérieur et de l'Immigration |
| Tier (points) | +5: Recall tier (+5), as the nearest: the Government withdrew its agrément for Israel's ambassador designate and suspended the honorary consulates of both states, citing Israel's violations in Gaza; Israel had no resident ambassador and relations were not severed. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Ministry of Foreign Affairs withdrew its agrément for Israel's ambassador designate and suspended the honorary consulates of both states, citing Israel's conduct in Gaza. |
| Summary (FR) | Le ministère des Affaires étrangères a retiré l'agrément de l'ambassadrice désignée d'Israël et suspendu les consulats honoraires des deux États, en invoquant la conduite d'Israël à Gaza. |
| Second reading | agree, 2026-10-06; the notes mention a flag |

Evidence 1: `src_20231114_pressoffice-bz_measures-against-israel` (official, Government of Belize Press Office, 2023-11-14), locator **line 7 (measure a)**, language `en`.
Wayback: <https://web.archive.org/web/20261005232100id_/https://www.pressoffice.gov.bz/belize-takes-measures-against-israel/>

Quote:

> a. The Government of Belize is withdrawing its Agrément for the accreditation of H.E. Einat Kranz-Neiger, Israel’s Ambassador Designate to Belize;

Mechanical check: found at line 7, starting within the locator (line 7 (measure a)). Archived text at line 7 of `archive/text/src_20231114_pressoffice-bz_measures-against-israel.txt`:

> a. The Government of Belize is withdrawing its Agrément for the accreditation of H.E. Einat Kranz-Neiger, Israel’s Ambassador Designate to Belize;

Evidence 2: `src_20231114_pressoffice-bz_measures-against-israel` (official, Government of Belize Press Office, 2023-11-14), locator **line 8 (measure b)**, language `en`.
Wayback: <https://web.archive.org/web/20261005232100id_/https://www.pressoffice.gov.bz/belize-takes-measures-against-israel/>

Quote:

> b. All activities conducted by the Israeli Honorary Consulate in Belize and the appointment of the Honorary Consul are suspended;

Mechanical check: found at line 8, starting within the locator (line 8 (measure b)). Archived text at line 8 of `archive/text/src_20231114_pressoffice-bz_measures-against-israel.txt`:

> b. All activities conducted by the Israeli Honorary Consulate in Belize and the appointment of the Honorary Consul are suspended;

Evidence 3: `src_20231114_pressoffice-bz_measures-against-israel` (official, Government of Belize Press Office, 2023-11-14), locator **line 4**, language `en`.
Wayback: <https://web.archive.org/web/20261005232100id_/https://www.pressoffice.gov.bz/belize-takes-measures-against-israel/>

Quote:

> Since the 7th October 2023, Israel has consistently violated international law, international humanitarian law and the human rights of Gazans.

Mechanical check: found at line 4, starting within the locator (line 4). Archived text at line 4 of `archive/text/src_20231114_pressoffice-bz_measures-against-israel.txt`:

> Since the 7th October 2023, Israel has consistently violated international law, international humanitarian law and the human rights of Gazans.

### Bolivia (Plurinational State of) (BOL)

#### evt_2024_04_24_BOL_B9

- [ ] Checked (26 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2024-04-24 |
| Speaker or actor | President of Bolivia / Président de la Bolivie |
| Tier (points) | +5: Legal characterisation (+5): at the ALBA-TCP summit the President called for firm action against "the unacceptable genocide" in the Gaza Strip. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The President of Bolivia called on the ALBA-TCP alliance to act against what he called the genocide in the Gaza Strip. |
| Summary (FR) | Le président de la Bolivie a appelé l'alliance ALBA-TCP à agir contre ce qu'il a appelé le génocide dans la bande de Gaza. |
| Second reading | agree, 2026-09-29 |

Evidence 1: `src_20240424_cancilleria_arce-cumbre-alba` (official, Ministerio de Relaciones Exteriores (Bolivia), 2024-04-24), locator **line 114 (Ministry's English version, line 156)**, language `es`.
Wayback: <https://web.archive.org/web/20260929093030id_/https://cancilleria.gob.bo/mre/2024/04/24/18217/>

Quote:

> Es en este sentido que deseo continuar mi intervención en esta vigésimo tercer cumbre de jefes de Estado y del Gobierno del ALBA-TCP invocando una acción firme y decida por parte de nuestra alianza frente al inaceptable genocidio que se está desarrollando en la Franja de Gaza producto de la agresión de las fuerzas de defensa de Israel contra el pueblo palestino.

Translation in the record:

> To this effect, I wish to continue my intervention at this twenty-third summit of heads of state and government of ALBA-TCP by calling for firm and decisive action on behalf of our alliance upon the unacceptable genocide that is taking place in the Gaza Strip as a result of the aggression of the Israeli defense forces against the Palestinian people.

Mechanical check: found at line 114, starting within the locator (line 114 (Ministry's English version, line 156)). Archived text at line 114 of `archive/text/src_20240424_cancilleria_arce-cumbre-alba.txt`:

> Es en este sentido que deseo continuar mi intervención en esta vigésimo tercer cumbre de jefes de Estado y del Gobierno del ALBA-TCP invocando una acción firme y decida por parte de nuestra alianza frente al inaceptable genocidio que se está desarrollando en la Franja de Gaza producto de la agresión de las fuerzas de defensa de Israel contra el pueblo palestino.

### Brazil (BRA)

#### evt_2024_12_02_BRA_B9

- [ ] Checked (27 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2024-12-02 |
| Speaker or actor | Minister of Foreign Affairs of Brazil / Ministre des Relations extérieures du Brésil |
| Tier (points) | +5: Names violations (+5): the Minister described the situation in Gaza as a man-made calamity akin to genocide and cited the deliberate starvation policy reported by the UN Special Rapporteur on the right to food. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister of Foreign Affairs of Brazil described the situation in Gaza as akin to genocide and cited a deliberate policy of starvation. |
| Summary (FR) | Le ministre des Relations extérieures du Brésil a décrit la situation à Gaza comme semblable à un génocide et a cité une politique délibérée de famine. |
| Second reading | agree, 2026-09-29 |

Evidence 1: `src_20241202_mre_vieira-cairo-conference` (official, Ministério das Relações Exteriores, 2024-12-02), locator **line 334**, language `pt`.
Wayback: <https://web.archive.org/web/20250802160800id_/https://www.gov.br/mre/pt-br/centrais-de-conteudo/publicacoes/discursos-artigos-e-entrevistas/ministro-das-relacoes-exteriores/discursos-mre/mauro-vieira/intervencao-do-ministro-mauro-vieira-na-conferencia-ministerial-para-reforcar-a-resposta-humanitaria-em-gaza>

Quote:

> A situação humanitária em Gaza não é uma catástrofe. É a pior calamidade criada pelo homem, semelhante a genocídio, conforme reconhecido pela Corte Internacional de Justiça.

Translation in the record:

> The humanitarian situation in Gaza is not a catastrophe. It is the worst man-made calamity, akin to genocide, as recognised by the International Court of Justice.

Mechanical check: found at line 334, starting within the locator (line 334). Archived text at line 334 of `archive/text/src_20241202_mre_vieira-cairo-conference.txt`:

> A situação humanitária em Gaza não é uma catástrofe. É a pior calamidade criada pelo homem, semelhante a genocídio, conforme reconhecido pela Corte Internacional de Justiça.

Evidence 2: `src_20241202_mre_vieira-cairo-conference` (official, Ministério das Relações Exteriores, 2024-12-02), locator **line 343**, language `pt`.
Wayback: <https://web.archive.org/web/20250802160800id_/https://www.gov.br/mre/pt-br/centrais-de-conteudo/publicacoes/discursos-artigos-e-entrevistas/ministro-das-relacoes-exteriores/discursos-mre/mauro-vieira/intervencao-do-ministro-mauro-vieira-na-conferencia-ministerial-para-reforcar-a-resposta-humanitaria-em-gaza>

Quote:

> Isso ocorreu após o Relator Especial da ONU sobre o Direito à Alimentação ter divulgado um relatório, dois meses antes, em que detalha uma deliberada política de fome para a população em Gaza.

Translation in the record:

> This happened after the UN Special Rapporteur on the Right to Food released a report, two months earlier, detailing a deliberate policy of starvation for the population in Gaza.

Mechanical check: found at line 343, starting within the locator (line 343). Archived text at line 343 of `archive/text/src_20241202_mre_vieira-cairo-conference.txt`:

> Isso ocorreu após o Relator Especial da ONU sobre o Direito à Alimentação ter divulgado um relatório, dois meses antes, em que detalha uma deliberada política de fome para a população em Gaza.

#### evt_2026_09_22_BRA_B9

- [ ] Checked (28 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2026-09-22 |
| Speaker or actor | President of Brazil / Président du Brésil |
| Tier (points) | +5: Legal characterisation (+5): the President, opening the General Debate of the 81st session, spoke of the genocide committed by the Netanyahu government against women and children in Gaza. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The President of Brazil told the General Assembly that the Netanyahu government had committed genocide against women and children in Gaza. |
| Summary (FR) | Le président du Brésil a déclaré à l'Assemblée générale que le gouvernement Netanyahou avait commis un génocide contre des femmes et des enfants à Gaza. |
| Second reading | agree, 2026-11-09 |

Evidence 1: `src_20260922_un-gadebate_bra-lula-81-pt` (official, Presidency of the Republic and Ministry of Foreign Affairs (Brazil), through the UN General Debate (gadebate.un.org), 2026-09-22), locator **lines 62-63**, language `pt`.
Wayback: <https://web.archive.org/web/20261011004827id_/https://gadebate.un.org/sites/default/files/gastatements/81/br_pt.pdf>

Quote:

> Gerações de palestinos carregarão a dor e o trauma deixados pelo genocídio praticado pelo governo Netanyahu contra mulheres e crianças em Gaza.

Translation in the record:

> Generations of Palestinians will carry the pain and trauma left by the genocide committed by the Netanyahu government against women and children in Gaza.

Mechanical check: found at lines 62–63, starting within the locator (lines 62-63). Archived text at lines 62–63 of `archive/text/src_20260922_un-gadebate_bra-lula-81-pt.txt`:

> Gerações de palestinos carregarão a dor e o trauma deixados pelo genocídio praticado pelo governo Netanyahu contra mulheres e crianças em Gaza.

Evidence 2: `src_20260922_un-gadebate_bra-lula-81-pt` (official, Presidency of the Republic and Ministry of Foreign Affairs (Brazil), through the UN General Debate (gadebate.un.org), 2026-09-22), locator **line 2**, language `pt`.
Wayback: <https://web.archive.org/web/20261011004827id_/https://gadebate.un.org/sites/default/files/gastatements/81/br_pt.pdf>

Quote:

> Discurso do Presidente Lula na abertura da 81ª Sessão da Assembleia Geral

Translation in the record:

> Speech of President Lula at the opening of the 81st Session of the General Assembly

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20260922_un-gadebate_bra-lula-81-pt.txt`:

> Discurso do Presidente Lula na abertura da 81ª Sessão da Assembleia Geral

### Barbados (BRB)

#### evt_2025_09_26_BRB_B9

- [ ] Checked (29 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-09-26 |
| Speaker or actor | Prime Minister / Première ministre |
| Tier (points) | +5: Legal characterisation and named violations (+5): the Prime Minister speaks of the genocidal destruction taking place in Gaza and of continuous and disproportionate attacks on the Palestinian people and the failure to allow humanitarian aid access; she also calls for the release of the hostages. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Prime Minister told the General Assembly that the world must not ignore Gaza, citing disproportionate attacks on the Palestinian people and the lack of access for humanitarian aid. |
| Summary (FR) | La Première ministre a déclaré devant l'Assemblée générale que le monde ne devait pas ignorer Gaza, citant des attaques disproportionnées contre les Palestiniens et l'accès refusé à l'aide. |
| Second reading | agree, 2026-10-06; the notes mention a flag |

Evidence 1: `src_20250926_un-gadebate_brb-mottley-en` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2025-09-26), locator **lines 63–64**, language `en`.
Wayback: <https://web.archive.org/web/20260831125928id_/https://gadebate.un.org/sites/default/files/gastatements/80/bb_en.pdf>

Quote:

> the horror in Sudan and definitely not Gaza. The genocidal destruction taking place in Gaza right now no attention.

Mechanical check: found at lines 63–64, starting within the locator (lines 63–64). Archived text at lines 63–64 of `archive/text/src_20250926_un-gadebate_brb-mottley-en.txt`:

> the horror in Sudan and definitely not Gaza. The genocidal destruction taking place in Gaza right now no attention.

Evidence 2: `src_20250926_un-gadebate_brb-mottley-en` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2025-09-26), locator **lines 66–69**, language `en`.
Wayback: <https://web.archive.org/web/20260831125928id_/https://gadebate.un.org/sites/default/files/gastatements/80/bb_en.pdf>

Quote:

> But we have now gone to a point where all of our human sensibilities are offended by the continuous and disproportionate attacks on the Palestinian people and the failure to allow access by the international community to the survivors for the provision of humanitarian aid.

Mechanical check: found at lines 66–69, starting within the locator (lines 66–69). Archived text at lines 66–69 of `archive/text/src_20250926_un-gadebate_brb-mottley-en.txt`:

> But we have now gone to a point where all of our human sensibilities are offended by the continuous and disproportionate attacks on the Palestinian people and the failure to allow access by the international community to the survivors for the provision of humanitarian aid.

Evidence 3: `src_20250926_un-gadebate_brb-mottley-en` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2025-09-26), locator **line 65**, language `en`.
Wayback: <https://web.archive.org/web/20260831125928id_/https://gadebate.un.org/sites/default/files/gastatements/80/bb_en.pdf>

Quote:

> Yes there must be a release of the hostages taken on October 7th.

Mechanical check: found at line 65, starting within the locator (line 65). Archived text at line 65 of `archive/text/src_20250926_un-gadebate_brb-mottley-en.txt`:

> Yes there must be a release of the hostages taken on October 7th.

### Brunei Darussalam (BRN)

#### evt_2026_11_23_BRN_B9

- [ ] Checked (30 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2026-11-23 |
| Speaker or actor | Sultan and Yang Di-Pertuan of Brunei Darussalam (head of state and Prime Minister) / Sultan et Yang Di-Pertuan du Brunéi Darussalam (chef de l'État et Premier ministre) |
| Tier (points) | +2: Calls for the protection of civilians and humanitarian access (+2), set by the Gaza passage: the Sultan's message says the ceasefire in Gaza must be sustained through effective implementation, the protection of civilians and unhindered humanitarian access, without naming a violation in Gaza. The call on the Occupying Power to end its unlawful presence follows the West Bank passage and is tagged west-bank, unscored in v1 (docs/10 B-32), the reading of B-2192 (1) for a statement whose legal characterisation follows a West Bank passage (flagged). |
| Confidence | confirmed |
| Scope | gaza, west-bank |
| Summary (EN) | The Sultan called for the ceasefire in Gaza to be sustained through the protection of civilians and unhindered humanitarian access. |
| Summary (FR) | Le sultan a appelé à consolider le cessez-le-feu à Gaza par la protection des civils et un accès humanitaire sans entrave. |
| Second reading | agree, 2026-11-28; the notes mention a flag |

Evidence 1: `src_20261123_un-unispal_brn-sultan-solidarity-day-message` (official, United Nations, Division for Palestinian Rights (UNISPAL), the delegation's text, 2026-11-23), locator **lines 58 to 60**, language `en`.
Wayback: <https://web.archive.org/web/20261128113800id_/https://www.un.org/unispal/wp-content/uploads/2026/11/20261120_1725_HoS_Brunei-Darussalam_HM-Sultan_ER_Message.pdf>

Quote:

> The ceasefire in Gaza offers hope, but that hope must be sustained through effective implementation, the protection of civilians, safe, rapid and unhindered humanitarian access; and sustained support for Gaza’s recovery and reconstruction.

Mechanical check: found at lines 58–60, starting within the locator (lines 58 to 60). Archived text at lines 58–60 of `archive/text/src_20261123_un-unispal_brn-sultan-solidarity-day-message.txt`:

> The ceasefire in Gaza offers hope, but that hope must be sustained through effective implementation, the protection of civilians, safe, rapid and unhindered humanitarian access; and sustained support for Gaza’s recovery and reconstruction. We

Evidence 2: `src_20261123_un-unispal_brn-sultan-solidarity-day-message` (official, United Nations, Division for Palestinian Rights (UNISPAL), the delegation's text, 2026-11-23), locator **lines 64 to 66**, language `en`.
Wayback: <https://web.archive.org/web/20261128113800id_/https://www.un.org/unispal/wp-content/uploads/2026/11/20261120_1725_HoS_Brunei-Darussalam_HM-Sultan_ER_Message.pdf>

Quote:

> We call upon the Occupying Power to comply with international law, and end its unlawful presence in the Occupied Palestinian Territory as rapidly as possible, in accordance with the Advisory Opinion of the International Court of Justice of July 2024.

Mechanical check: found at lines 64–66, starting within the locator (lines 64 to 66). Archived text at lines 64–66 of `archive/text/src_20261123_un-unispal_brn-sultan-solidarity-day-message.txt`:

> We call upon the Occupying Power to comply with international law, and end its unlawful presence in the Occupied Palestinian Territory as rapidly as possible, in accordance with the Advisory Opinion of the International Court of Justice of July 2024.

Evidence 3: `src_20261123_un-unispal_brn-sultan-solidarity-day-message` (official, United Nations, Division for Palestinian Rights (UNISPAL), the delegation's text, 2026-11-23), locator **line 40**, language `en`.
Wayback: <https://web.archive.org/web/20261128113800id_/https://www.un.org/unispal/wp-content/uploads/2026/11/20261120_1725_HoS_Brunei-Darussalam_HM-Sultan_ER_Message.pdf>

Quote:

> HIS MAJESTY THE SULTAN OF BRUNEI DARUSSALAM

Mechanical check: found at line 40, starting within the locator (line 40). Archived text at line 40 of `archive/text/src_20261123_un-unispal_brn-sultan-solidarity-day-message.txt`:

> HIS MAJESTY THE SULTAN OF BRUNEI DARUSSALAM

### Canada (CAN)

#### evt_2024_03_08_CAN_D3

- [ ] Checked (31 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | D3, standing |
| Date | 2024-03-08 to 2024-12-31 |
| Speaker or actor | Minister of International Development / Ministre du Développement international |
| Tier (points) | +5: Restored tier (+5): funding to UNRWA resumed after the pause; superseded on 2024-12-31 by the increased tier (evt_2024_12_31_CAN_D3). |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister of International Development announced that Canada was lifting its temporary pause on funding to UNRWA. |
| Summary (FR) | Le ministre du Développement international a annoncé que le Canada levait la suspension temporaire de son financement à l'UNRWA. |
| Second reading | agree, 2026-09-28 |

Evidence 1: `src_20240308_gac_unrwa-resumption` (official, Global Affairs Canada, 2024-03-08), locator **line 4**, language `en`.
Wayback: <https://web.archive.org/web/20260928182519id_/https://www.canada.ca/en/global-affairs/news/2024/03/canada-announces-continued-assistance-for-people-in-gaza.html>

Quote:

> announced that Canada will be lifting its temporary pause on funding to the United Nations Relief and Works Agency for Palestine Refugees in the Near East (UNRWA)

Mechanical check: found at line 4, starting within the locator (line 4). Archived text at line 4 of `archive/text/src_20240308_gac_unrwa-resumption.txt`:

> … is one of the world’s largest donors of assistance to address the current crisis. Today, the Honourable Ahmed Hussen, Minister of International Development, announced that Canada will be lifting its temporary pause on funding to the United Nations Relief and Works Agency for Palestine Refugees in the Near East (UNRWA). UNRWA plays a vital role in Gaza, providing over 2 million people with humanitarian relief, in addition to its crucial operations supporting 4 million people …

#### evt_2025_06_10_CAN_B11

- [ ] Checked (32 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B11, standing |
| Date | 2025-06-10 |
| Speaker or actor | Minister of Foreign Affairs / Ministre des Affaires étrangères |
| Tier (points) | +10: Ministers tier (+10): sanctions on two serving Israeli ministers, Itamar Ben-Gvir and Bezalel Smotrich. |
| Confidence | confirmed |
| Scope | gaza, west-bank |
| Summary (EN) | The Minister of Foreign Affairs, with four other foreign ministers, announced sanctions on Israeli ministers Itamar Ben-Gvir and Bezalel Smotrich. |
| Summary (FR) | La ministre des Affaires étrangères, avec quatre autres ministres des Affaires étrangères, a annoncé des sanctions contre les ministres israéliens Itamar Ben-Gvir et Bezalel Smotrich. |
| Second reading | agree, 2026-09-28; the notes mention a flag |

Evidence 1: `src_20250610_gac_ben-gvir-smotrich` (official, Global Affairs Canada, 2025-06-10), locator **line 1**, language `en`.
Wayback: <https://web.archive.org/web/20260928182549id_/https://www.canada.ca/en/global-affairs/news/2025/06/joint-statement-by-the-foreign-ministers-of-australia-canada-new-zealand-norway-and-the-united-kingdom-on-measures-targeting-itamar-ben-gvir-and-be.html>

Quote:

> Today, the Foreign Ministers of Australia, Canada, New Zealand, Norway and the United Kingdom have announced sanctions and other measures targeting Itamar Ben-Gvir and Bezalel Smotrich for inciting violence against Palestinians in the West Bank.

Mechanical check: found at line 1, starting within the locator (line 1). Archived text at line 1 of `archive/text/src_20250610_gac_ben-gvir-smotrich.txt`:

> Today, the Foreign Ministers of Australia, Canada, New Zealand, Norway and the United Kingdom have announced sanctions and other measures targeting Itamar Ben-Gvir and Bezalel Smotrich for inciting violence against Palestinians in the West Bank.

Evidence 2: `src_20250610_gac_ben-gvir-smotrich` (official, Global Affairs Canada, 2025-06-10), locator **line 8**, language `en`.
Wayback: <https://web.archive.org/web/20260928182549id_/https://www.canada.ca/en/global-affairs/news/2025/06/joint-statement-by-the-foreign-ministers-of-australia-canada-new-zealand-norway-and-the-united-kingdom-on-measures-targeting-itamar-ben-gvir-and-be.html>

Quote:

> Today’s measures focus on the West Bank, but of course this cannot be seen in isolation from the catastrophe in Gaza.

Mechanical check: found at line 8, starting within the locator (line 8). Archived text at line 8 of `archive/text/src_20250610_gac_ben-gvir-smotrich.txt`:

> Today’s measures focus on the West Bank, but of course this cannot be seen in isolation from the catastrophe in Gaza. We continue to be appalled by the immense suffering of civilians, including the denial of essential aid. There must be no unlawful transfer of Palestinians …

#### evt_2026_09_08_CAN_B9

- [ ] Checked (33 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2026-09-08 |
| Speaker or actor | Minister of Foreign Affairs / Ministre des Affaires étrangères |
| Tier (points) | +5: Statement naming specific violations (+5): the joint statement opposes forced displacement of the Palestinian population and calls the settlements illegal under international law; West Bank only. |
| Confidence | confirmed |
| Scope | west-bank |
| Summary (EN) | The Minister of Foreign Affairs, with eleven other foreign ministers, opposed annexation and forced displacement in the West Bank and called on Israel to halt settlement expansion. |
| Summary (FR) | La ministre des Affaires étrangères, avec onze autres ministres, s'est opposée à l'annexion et au déplacement forcé en Cisjordanie et a appelé Israël à cesser l'expansion des colonies. |
| Second reading | agree, 2026-09-30 |

Evidence 1: `src_20260908_gov-pl_oswiadczenie-dwupanstwowe` (official, Ministerstwo Spraw Zagranicznych (Ministry of Foreign Affairs of Poland, gov.pl/web/dyplomacja), 2026-09-08), locator **line 6**, language `pl`.
Wayback: <https://web.archive.org/web/20260929022856id_/https://www.gov.pl/web/dyplomacja/wspolne-oswiadczenie-ministrow-spraw-zagranicznych-w-sprawie-rozwiazania-dwupanstwowego>

Quote:

> Stanowczo sprzeciwiamy się działaniom równoznacznym z aneksją ziem palestyńskich oraz przymusowemu wysiedlaniu ludności palestyńskiej.

Translation in the record:

> We firmly oppose actions amounting to the annexation of Palestinian land and the forced displacement of the Palestinian population.

Mechanical check: found at line 6, starting within the locator (line 6). Archived text at line 6 of `archive/text/src_20260908_gov-pl_oswiadczenie-dwupanstwowe.txt`:

> … a my podejmować będziemy działania na rzecz sprawiedliwego i trwałego pokoju, opartego na zasadach zawartych w Deklaracji Nowojorskiej przyjętej rok temu. Stanowczo sprzeciwiamy się działaniom równoznacznym z aneksją ziem palestyńskich oraz przymusowemu wysiedlaniu ludności palestyńskiej.

Evidence 2: `src_20260908_gov-pl_oswiadczenie-dwupanstwowe` (official, Ministerstwo Spraw Zagranicznych (Ministry of Foreign Affairs of Poland, gov.pl/web/dyplomacja), 2026-09-08), locator **line 2**, language `pl`.
Wayback: <https://web.archive.org/web/20260929022856id_/https://www.gov.pl/web/dyplomacja/wspolne-oswiadczenie-ministrow-spraw-zagranicznych-w-sprawie-rozwiazania-dwupanstwowego>

Quote:

> Ministerstwo Spraw Zagranicznych RP informuje, że Polska, opowiadając się za przestrzeganiem prawa międzynarodowego, przyłączyła się do oświadczenia ministrów spraw zagranicznych: Danii, Finlandii, Francji, Hiszpanii, Islandii, Irlandii, Kanady

Translation in the record:

> The Ministry of Foreign Affairs of the Republic of Poland reports that Poland, standing for respect for international law, has joined the statement of the foreign ministers of: Denmark, Finland, France, Spain, Iceland, Ireland, Canada

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20260908_gov-pl_oswiadczenie-dwupanstwowe.txt`:

> Ministerstwo Spraw Zagranicznych RP informuje, że Polska, opowiadając się za przestrzeganiem prawa międzynarodowego, przyłączyła się do oświadczenia ministrów spraw zagranicznych: Danii, Finlandii, Francji, Hiszpanii, Islandii, Irlandii, Kanady, Norwegii, Portugalii, Szwecji i Wielkiej Brytanii, wyrażającego poparcie dla rozwiązania dwupaństwowego w konflikcie izraelsko-palestyńskim.

#### evt_2025_08_12_CAN_B9

- [ ] Checked (34 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-08-12 |
| Speaker or actor | Minister of Foreign Affairs / Ministre des Affaires étrangères |
| Tier (points) | +5: Statement naming specific violations (+5): the joint statement says famine is unfolding and calls for halting starvation, and asks that lethal force not be used at distribution sites. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister of Foreign Affairs, with other foreign ministers, said that famine was unfolding in Gaza and called for urgent action to halt starvation. |
| Summary (FR) | La ministre des Affaires étrangères, avec d'autres ministres, a déclaré qu'une famine sévissait à Gaza et a appelé à agir d'urgence pour y mettre fin. |
| Second reading | agree, 2026-09-30 |

Evidence 1: `src_20250812_fm-gov-au_joint-statement-humanitarian` (official, Minister for Foreign Affairs of Australia, 2025-08-12), locator **line 3**, language `en`.
Wayback: <https://web.archive.org/web/20260928190413id_/https://www.foreignminister.gov.au/minister/penny-wong/media-release/joint-statement-humanitarian-situation-gaza>

Quote:

> Famine is unfolding before our eyes. Urgent action is needed now to halt and reverse starvation.

Mechanical check: found at line 3, starting within the locator (line 3). Archived text at line 3 of `archive/text/src_20250812_fm-gov-au_joint-statement-humanitarian.txt`:

> The humanitarian suffering in Gaza has reached unimaginable levels. Famine is unfolding before our eyes. Urgent action is needed now to halt and reverse starvation. Humanitarian space must be protected, and aid should never be politicised.

Evidence 2: `src_20250812_fm-gov-au_joint-statement-humanitarian` (official, Minister for Foreign Affairs of Australia, 2025-08-12), locator **line 7**, language `en`.
Wayback: <https://web.archive.org/web/20260928190413id_/https://www.foreignminister.gov.au/minister/penny-wong/media-release/joint-statement-humanitarian-situation-gaza>

Quote:

> The Foreign Ministers of Australia, Andorra, Belgium, Canada

Mechanical check: found at line 7, starting within the locator (line 7). Archived text at line 7 of `archive/text/src_20250812_fm-gov-au_joint-statement-humanitarian.txt`:

> The Foreign Ministers of Australia, Andorra, Belgium, Canada, Cyprus, Denmark, Estonia, Finland, France, Greece, Iceland, Ireland, Italy, Japan, Latvia, Liechtenstein, Lithuania, Luxembourg, Malta, the Netherlands, …

#### evt_2025_08_21_CAN_B9

- [ ] Checked (35 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-08-21 |
| Speaker or actor | Minister of Foreign Affairs / Ministre des Affaires étrangères |
| Tier (points) | +5: Uses a legal characterisation (+5): a violation of international law. West Bank conduct, tagged and unscored in v1 (docs/10 B-32). |
| Confidence | confirmed |
| Scope | west-bank |
| Summary (EN) | The Minister of Foreign Affairs, with other foreign ministers, called the approval of settlement plans in the E1 area east of Jerusalem a violation of international law. |
| Summary (FR) | La ministre des Affaires étrangères, avec d'autres ministres, a qualifié l'approbation des plans de colonies dans la zone E1 à l'est de Jérusalem de violation du droit international. |
| Second reading | agree, 2026-09-30 |

Evidence 1: `src_20250821_um_joint-statement-e1` (official, Udenrigsministeriet (Ministry of Foreign Affairs of Denmark), press room on via.ritzau.dk, 2025-08-21), locator **line 6**, language `en`.
Wayback: <https://web.archive.org/web/20260928221605id_/https://via.ritzau.dk/pressemeddelelse/14536883/occupied-palestinian-territories-joint-statement?publisherId=2012662&lang=da>

Quote:

> The decision by the Israeli Higher Planning Committee to approve plans for settlement construction in the E1 area, East of Jerusalem, is unacceptable and a violation of international law.

Mechanical check: found at line 6, starting within the locator (line 6). Archived text at line 6 of `archive/text/src_20250821_um_joint-statement-e1.txt`:

> The decision by the Israeli Higher Planning Committee to approve plans for settlement construction in the E1 area, East of Jerusalem, is unacceptable and a violation of international law.

Evidence 2: `src_20250821_um_joint-statement-e1` (official, Udenrigsministeriet (Ministry of Foreign Affairs of Denmark), press room on via.ritzau.dk, 2025-08-21), locator **line 4**, language `en`.
Wayback: <https://web.archive.org/web/20260928221605id_/https://via.ritzau.dk/pressemeddelelse/14536883/occupied-palestinian-territories-joint-statement?publisherId=2012662&lang=da>

Quote:

> foreign ministers of Australia, Belgium, Canada

Mechanical check: found at line 4, starting within the locator (line 4). Archived text at line 4 of `archive/text/src_20250821_um_joint-statement-e1.txt`:

> foreign ministers of Australia, Belgium, Canada, Denmark, Estonia, Finland, France, Iceland, Ireland, Italy, Japan, Latvia, Lithuania, Luxembourg, Malta, the Netherlands, Norway, Portugal, Slovenia, Spain, …

### Switzerland (CHE)

#### evt_2025_08_12_CHE_B9

- [ ] Checked (36 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-08-12 |
| Speaker or actor | Head of the Federal Department of Foreign Affairs / Chef du Département fédéral des affaires étrangères |
| Tier (points) | +5: Statement naming specific violations (+5): the joint statement says famine is unfolding and calls for halting starvation, and asks that lethal force not be used at distribution sites. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Head of the Federal Department of Foreign Affairs, with other foreign ministers, said that famine was unfolding in Gaza and called for urgent action to halt starvation. |
| Summary (FR) | Le chef du DFAE, avec d'autres ministres, a déclaré qu'une famine sévissait à Gaza et a appelé à agir d'urgence pour y mettre fin. |
| Second reading | agree, 2026-09-30 |

Evidence 1: `src_20250812_fm-gov-au_joint-statement-humanitarian` (official, Minister for Foreign Affairs of Australia, 2025-08-12), locator **line 3**, language `en`.
Wayback: <https://web.archive.org/web/20260928190413id_/https://www.foreignminister.gov.au/minister/penny-wong/media-release/joint-statement-humanitarian-situation-gaza>

Quote:

> Famine is unfolding before our eyes. Urgent action is needed now to halt and reverse starvation.

Mechanical check: found at line 3, starting within the locator (line 3). Archived text at line 3 of `archive/text/src_20250812_fm-gov-au_joint-statement-humanitarian.txt`:

> The humanitarian suffering in Gaza has reached unimaginable levels. Famine is unfolding before our eyes. Urgent action is needed now to halt and reverse starvation. Humanitarian space must be protected, and aid should never be politicised.

Evidence 2: `src_20250812_fm-gov-au_joint-statement-humanitarian` (official, Minister for Foreign Affairs of Australia, 2025-08-12), locator **line 7**, language `en`.
Wayback: <https://web.archive.org/web/20260928190413id_/https://www.foreignminister.gov.au/minister/penny-wong/media-release/joint-statement-humanitarian-situation-gaza>

Quote:

> The Foreign Ministers of Australia, Andorra, Belgium, Canada, Cyprus, Denmark, Estonia, Finland, France, Greece, Iceland, Ireland, Italy, Japan, Latvia, Liechtenstein, Lithuania, Luxembourg, Malta, the Netherlands, Norway, Poland, Portugal, Slovakia, Slovenia, Spain, Sweden, Switzerland

Mechanical check: found at line 7, starting within the locator (line 7). Archived text at line 7 of `archive/text/src_20250812_fm-gov-au_joint-statement-humanitarian.txt`:

> The Foreign Ministers of Australia, Andorra, Belgium, Canada, Cyprus, Denmark, Estonia, Finland, France, Greece, Iceland, Ireland, Italy, Japan, Latvia, Liechtenstein, Lithuania, Luxembourg, Malta, the Netherlands, Norway, Poland, Portugal, Slovakia, Slovenia, Spain, Sweden, Switzerland and the UK.

#### evt_2026_05_20_CHE_B9

- [ ] Checked (37 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2026-05-20 |
| Speaker or actor | Federal Council / Conseil fédéral |
| Tier (points) | +5: Legal characterisation (+5): the occupation of the Palestinian territory called a violation of international law, the settlements illegal. |
| Confidence | confirmed |
| Scope | west-bank |
| Summary (EN) | The Federal Council stated that Switzerland calls on Israel to end the occupation of the Palestinian territory, which violates international law. |
| Summary (FR) | Le Conseil fédéral a déclaré que la Suisse appelait Israël à mettre fin à l'occupation du Territoire palestinien, laquelle violait le droit international. |
| Second reading | agree, 2026-09-29 |

Evidence 1: `src_20260520_parlament_ip-26-3480` (official, Swiss Parliament (Curia Vista, open data service ws.parlament.ch), answer of the Federal Council, 2026-05-20), locator **FederalCouncilResponseText, questions 1, 2 and 4**, language `fr`.
Wayback: <https://web.archive.org/web/20260928224821id_/https://ws.parlament.ch/odata.svc/Business(ID=20263480,Language=%27FR%27)>

Quote:

> La Suisse appelle régulièrement Israël à mettre fin à l’occupation du Territoire palestinien, laquelle viole le droit international.

Translation in the record:

> Switzerland regularly calls on Israel to end the occupation of the Palestinian territory, which violates international law.

Mechanical check: found at line 1; the locator is not a line number. Archived text at line 1 of `archive/text/src_20260520_parlament_ip-26-3480.txt`:

> … m:null="true" /><d:MotionText m:null="true" /><d:FederalCouncilResponseText>&lt;span&gt;&lt;p&gt;Questions&amp;nbsp;1, 2 et 4&amp;nbsp;: La Suisse appelle régulièrement Israël à mettre fin à l’occupation du Territoire palestinien, laquelle viole le droit international. Elle condamne l’expansion des colonies illégales en Cisjordanie et rejette toute mesure visant à modifier la composition territoriale ou démographique du …

### Chile (CHL)

#### evt_2023_10_31_CHL_B12

- [ ] Checked (38 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B12, standing |
| Date | 2023-10-31 to 2026-06-04 |
| Speaker or actor | Government of Chile / Gouvernement du Chili |
| Tier (points) | +5: Ambassador recalled (+5): the government called the ambassador in Israel to Santiago for consultations on 31 October 2023, citing violations of international humanitarian law in the Gaza Strip. Ended on 4 June 2026, when the President designated a new ambassador to Israel who had received the agrément. No downgrade or severance followed; the withdrawal of the military attachés on 28 May 2025 is not counted as a separate tier (docs/10 B-362 (2)). |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The government recalled the ambassador in Israel to Santiago for consultations, citing violations of international humanitarian law in Gaza. |
| Summary (FR) | Le gouvernement a rappelé l'ambassadeur en Israël à Santiago pour consultations, en invoquant des violations du droit international humanitaire à Gaza. |
| Second reading | agree, 2026-09-29; the notes mention a flag |

Evidence 1: `src_20231031_minrel_llamado-consultas-embajador-israel` (official, Ministerio de Relaciones Exteriores de Chile, 2023-10-31), locator **line 49**, language `es`.
Wayback: <https://web.archive.org/web/20260929074434id_/https://www.minrel.gob.cl/sala-de-prensa/chile-llama-en-consultas-a-embajador-de-chile-en-israel>

Quote:

> Ante las inaceptables violaciones del Derecho Internacional Humanitario en que ha incurrido Israel en la franja de Gaza, el Gobierno de Chile ha resuelto llamar en consultas a Santiago al embajador de Chile en Israel, Jorge Carvajal.

Translation in the record:

> In view of the unacceptable violations of international humanitarian law committed by Israel in the Gaza Strip, the Government of Chile has decided to call the ambassador of Chile in Israel, Jorge Carvajal, to Santiago for consultations.

Mechanical check: found at line 49, starting within the locator (line 49). Archived text at line 49 of `archive/text/src_20231031_minrel_llamado-consultas-embajador-israel.txt`:

> Ante las inaceptables violaciones del Derecho Internacional Humanitario en que ha incurrido Israel en la franja de Gaza, el Gobierno de Chile ha resuelto llamar en consultas a Santiago al embajador de Chile en Israel, Jorge Carvajal.

Evidence 2: `src_20260604_minrel_designacion-embajadores-israel` (official, Ministerio de Relaciones Exteriores de Chile, 2026-06-04), locator **line 3**, language `es`.
Wayback: <https://web.archive.org/web/20260929074540id_/https://www.minrel.gob.cl/sala-de-prensa/presidente-jose-antonio-kast-designa-nuevos-embajadores-de-chile-en-el-0>

Quote:

> El Ministerio de Relaciones Exteriores informa que el Presidente de la República, José Antonio Kast, designó como embajadores de Chile a Ricardo Hernández, en Ecuador; Hernán Bascuñán, en Países Bajos; James Sinclair, en Santa Sede, y Gabriel Zaliasnik, en Israel. Todos ellos ya recibieron sus respectivos beneplácitos.

Translation in the record:

> The Ministry of Foreign Affairs reports that the President of the Republic, José Antonio Kast, designated as ambassadors of Chile Ricardo Hernández, in Ecuador; Hernán Bascuñán, in the Netherlands; James Sinclair, to the Holy See; and Gabriel Zaliasnik, in Israel. All of them have already received their respective agréments.

Mechanical check: found at line 3, starting within the locator (line 3). Archived text at line 3 of `archive/text/src_20260604_minrel_designacion-embajadores-israel.txt`:

> El Ministerio de Relaciones Exteriores informa que el Presidente de la República, José Antonio Kast, designó como embajadores de Chile a Ricardo Hernández, en Ecuador; Hernán Bascuñán, en Países Bajos; James Sinclair, en Santa Sede, y Gabriel Zaliasnik, en Israel. Todos ellos ya recibieron sus respectivos beneplácitos.

#### evt_2024_06_11_CHL_B9

- [ ] Checked (39 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2024-06-11 |
| Speaker or actor | Minister of Foreign Affairs of Chile / Ministre des Affaires étrangères du Chili |
| Tier (points) | +5: Named violations (+5): at the Jordan conference on the humanitarian response for Gaza, the Foreign Minister condemned Israel's indiscriminate and disproportionate attacks on civilians in Gaza. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister of Foreign Affairs condemned Israel's indiscriminate and disproportionate attacks on civilians in Gaza at the conference on humanitarian response for Gaza in Jordan. |
| Summary (FR) | Le ministre des Affaires étrangères a condamné les attaques indiscriminées et disproportionnées d'Israël contre des civils à Gaza, lors d'une conférence humanitaire en Jordanie. |
| Second reading | agree, 2026-09-29 |

Evidence 1: `src_20240611_minrel_canciller-conferencia-gaza-jordania` (official, Ministerio de Relaciones Exteriores de Chile, 2024-06-11), locator **line 6**, language `es`.
Wayback: <https://web.archive.org/web/20260929074928id_/https://www.minrel.gob.cl/sala-de-prensa/canciller-participa-en-conferencia-sobre-gaza-se-necesita-urgentemente-la>

Quote:

> Asimismo, condenamos enérgicamente los ataques indiscriminados y desproporcionados de Israel contra civiles en Gaza, especialmente mujeres y niños

Translation in the record:

> Likewise, we strongly condemn Israel's indiscriminate and disproportionate attacks against civilians in Gaza, especially women and children.

Mechanical check: found at line 6, starting within the locator (line 6). Archived text at line 6 of `archive/text/src_20240611_minrel_canciller-conferencia-gaza-jordania.txt`:

> … humanitario. Hemos condenado inequívocamente las acciones terroristas de Hamas y exigimos la liberación inmediata e incondicional de los rehenes. Asimismo, condenamos enérgicamente los ataques indiscriminados y desproporcionados de Israel contra civiles en Gaza, especialmente mujeres y niños”.

#### evt_2026_02_26_CHL_B9

- [ ] Checked (40 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2026-02-26 |
| Speaker or actor | President of Chile / Président du Chili |
| Tier (points) | +5: Legal characterisation (+5): presenting the Foreign Ministry's institutional report, the President said Chile condemned the genocide the Israeli government is carrying out in Gaza, which has not ended. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The President of Chile condemned the genocide he said the Israeli government was carrying out in Gaza, at the presentation of the Foreign Ministry's institutional report. |
| Summary (FR) | Le président du Chili a condamné le génocide que mène selon lui le gouvernement israélien à Gaza, lors de la présentation du rapport institutionnel du ministère des Affaires étrangères. |
| Second reading | agree, 2026-09-29 |

Evidence 1: `src_20260226_presidencia_boric-memoria-cancilleria` (official, Presidencia de la República de Chile, 2026-02-26), locator **line 83**, language `es`.
Wayback: <https://web.archive.org/web/20260929080749id_/https://prensa.presidencia.cl/discurso.aspx?id=320761>

Quote:

> Condenamos el terrorismo de Hamas, exigimos la liberación de los rehenes y condenamos el genocidio que está llevando adelante el gobierno de Israel en Gaza, que no ha terminado y que hemos visto cómo en Cisjordania hoy día se sigue desplazando y ocupando territorio.

Translation in the record:

> We condemn the terrorism of Hamas, we demand the release of the hostages and we condemn the genocide that the government of Israel is carrying out in Gaza, which has not ended, and we have seen how in the West Bank today territory continues to be displaced and occupied.

Mechanical check: found at line 83, starting within the locator (line 83). Archived text at line 83 of `archive/text/src_20260226_presidencia_boric-memoria-cancilleria.txt`:

> … en Gaza era consecuencia inevitable de las acciones terroristas de Hamas. Nosotros dijimos en la ONU no estamos disponibles a elegir entre barbaries. Condenamos el terrorismo de Hamas, exigimos la liberación de los rehenes y condenamos el genocidio que está llevando adelante el gobierno de Israel en Gaza, que no ha terminado y que hemos visto cómo en Cisjordania hoy día se sigue desplazando y ocupando territorio. Mantuvimos una posición firme, pese a presión desde uno y otro lado, que no era suficiente, que era demasiado.

#### evt_2025_10_14_CHL_B9

- [ ] Checked (41 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-10-14 |
| Speaker or actor | President of Chile / Président du Chili |
| Tier (points) | +5: Named violation and legal characterisation (+5): at the FAO investment forum the President said hunger must never again be a strategy of war, as it had been in the genocide committed in Gaza by the Netanyahu government. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The President of Chile said at the FAO that hunger had been used as a strategy of war in the genocide committed in Gaza by the Netanyahu government. |
| Summary (FR) | Le président du Chili a déclaré à la FAO que la faim avait été utilisée comme stratégie de guerre dans le génocide commis à Gaza par le gouvernement Netanyahou. |
| Second reading | agree, 2026-09-29 |

Evidence 1: `src_20251014_presidencia_boric-foro-fao` (official, Presidencia de la República de Chile, 2025-10-14), locator **line 16**, language `es`.
Wayback: <https://web.archive.org/web/20260929080719id_/https://prensa.presidencia.cl/discurso.aspx?id=304930>

Quote:

> a volver a levantar la voz fuerte para que el hambre no sea nunca más una estrategia de guerra como lo ha sido en el genocidio que se estuvo cometiendo en Gaza por parte del gobierno del señor Netanyahu.

Translation in the record:

> to raise our voice strongly again so that hunger is never again a strategy of war, as it has been in the genocide that was being committed in Gaza by the government of Mr Netanyahu.

Mechanical check: found at line 16, starting within the locator (line 16). Archived text at line 16 of `archive/text/src_20251014_presidencia_boric-foro-fao.txt`:

> … en Sudán nos obliga a generar nuevas estrategias para garantizar el derecho a la alimentación en todo el mundo. Y desgraciadamente, también hay que decirlo, a volver a levantar la voz fuerte para que el hambre no sea nunca más una estrategia de guerra como lo ha sido en el genocidio que se estuvo cometiendo en Gaza por parte del gobierno del señor Netanyahu. Y creo que es importante decirlo porque cuando veíamos a esos niños con las guatitas hinchadas de hambre producto de la desnutrición estábamos viendo al final …

### China (CHN)

#### evt_2025_04_28_CHN_B9

- [ ] Checked (42 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-04-28 |
| Speaker or actor | Minister of Foreign Affairs / Ministre des Affaires étrangères |
| Tier (points) | +2: Formal call for a ceasefire (+2): the Minister said the immediate priority is a comprehensive ceasefire in Gaza and the relief of the humanitarian situation; no violation is named. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister of Foreign Affairs told the BRICS foreign ministers that the immediate priority was a comprehensive ceasefire in Gaza. |
| Summary (FR) | Le ministre des Affaires étrangères a déclaré aux ministres des Affaires étrangères des BRICS que la priorité immédiate était un cessez-le-feu complet à Gaza. |
| Second reading | agree, 2026-09-29 |

Evidence 1: `src_20250428_fmprc_wang-yi-brics-fmm` (official, Ministry of Foreign Affairs of the People's Republic of China, 2025-04-28), locator **line 17**, language `en`.
Wayback: <https://web.archive.org/web/20260929045047id_/https://www.fmprc.gov.cn/eng/wjbzhd/202505/t20250510_11618442.html>

Quote:

> The immediate priority is to bring about a comprehensive ceasefire in Gaza and alleviate the humanitarian catastrophe.

Mechanical check: found at line 17, starting within the locator (line 17). Archived text at line 17 of `archive/text/src_20250428_fmprc_wang-yi-brics-fmm.txt`:

> The situation in the Middle East is at a critical stage, and the question of Palestine must not be marginalized again. The immediate priority is to bring about a comprehensive ceasefire in Gaza and alleviate the humanitarian catastrophe. The long-term resolution lies in advancing the two-State solution and realizing peaceful coexistence between the State of Palestine and the State of Israel. …

#### evt_2024_10_23_CHN_B9

- [ ] Checked (43 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2024-10-23 |
| Speaker or actor | President of the People's Republic of China / Président de la République populaire de Chine |
| Tier (points) | +2: Formal call for a ceasefire (+2): the President said the BRICS must promote an immediate ceasefire and an end to the killing, after naming the humanitarian situation in Gaza; no violation is named. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The President of the People's Republic of China told the BRICS summit that an immediate ceasefire and an end to the killing must be promoted, with reference to Gaza. |
| Summary (FR) | Le président de la République populaire de Chine a déclaré au sommet des BRICS qu'il fallait promouvoir un cessez-le-feu immédiat et l'arrêt des combats, en référence à Gaza. |
| Second reading | agree, 2026-09-29 |

Evidence 1: `src_20241023_fmprc_xi-brics-summit-kazan` (official, Ministry of Foreign Affairs of the People's Republic of China, 2024-10-23), locator **line 10**, language `en`.
Wayback: <https://web.archive.org/web/20260929044859id_/https://www.fmprc.gov.cn/eng/xw/zyjh/202412/t20241217_11495308.html>

Quote:

> While the humanitarian situation in Gaza continues to deteriorate, the flames of war have once again been rekindled in Lebanon, and conflicts are escalating among the parties. We must promote an immediate ceasefire and an end to the killing.

Mechanical check: found at line 10, starting within the locator (line 10). Archived text at line 10 of `archive/text/src_20241023_fmprc_xi-brics-summit-kazan.txt`:

> … key principles: no expansion of the battlefields, no escalation of hostilities, and no fanning flames, and strive for swift deescalation of the situation. While the humanitarian situation in Gaza continues to deteriorate, the flames of war have once again been rekindled in Lebanon, and conflicts are escalating among the parties. We must promote an immediate ceasefire and an end to the killing. We must make unremitting efforts toward a comprehensive, just and lasting resolution of the Palestinian question.

#### evt_2024_09_25_CHN_B9

- [ ] Checked (44 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2024-09-25 |
| Speaker or actor | Minister of Foreign Affairs / Ministre des Affaires étrangères |
| Tier (points) | +2: Formal call for a ceasefire (+2): the Minister said the pressing priority is an immediate, comprehensive and sustainable ceasefire and the easing of the humanitarian crisis; no violation is named. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister of Foreign Affairs told the G20 foreign ministers that the pressing priority in Gaza was an immediate, comprehensive and sustainable ceasefire. |
| Summary (FR) | Le ministre des Affaires étrangères a déclaré aux ministres des Affaires étrangères du G20 que la priorité à Gaza était un cessez-le-feu immédiat, complet et durable. |
| Second reading | agree, 2026-09-29 |

Evidence 1: `src_20240925_fmprc_wang-yi-g20-fmm` (official, Ministry of Foreign Affairs of the People's Republic of China, 2024-09-25), locator **line 15**, language `en`.
Wayback: <https://web.archive.org/web/20260929044814id_/https://www.fmprc.gov.cn/eng/wjbzhd/202412/t20241218_11497472.html>

Quote:

> The Gaza situation is a test for justice and human conscience. The pressing priority is to achieve immediate, comprehensive and sustainable ceasefire, ease the humanitarian crisis, implement the two-State solution, and accept Palestine as a full U.N. member state.

Mechanical check: found at line 15, starting within the locator (line 15). Archived text at line 15 of `archive/text/src_20240925_fmprc_wang-yi-g20-fmm.txt`:

> … no provocation by any party, to work for deescalation of the Ukraine crisis as soon as possible and create conditions for starting peace talks in due course. The Gaza situation is a test for justice and human conscience. The pressing priority is to achieve immediate, comprehensive and sustainable ceasefire, ease the humanitarian crisis, implement the two-State solution, and accept Palestine as a full U.N. member state.

#### evt_2025_02_20_CHN_B9

- [ ] Checked (45 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-02-20 |
| Speaker or actor | Minister of Foreign Affairs / Ministre des Affaires étrangères |
| Tier (points) | +2: Formal call for the ceasefire's implementation (+2, as the ceasefire-implementation calls on the other wave branches): the Minister said the flames of war must not be reignited and the ceasefire agreement must be implemented; no violation is named. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister of Foreign Affairs told the G20 foreign ministers that the ceasefire agreement in Gaza must be implemented in a continuous and effective manner. |
| Summary (FR) | Le ministre des Affaires étrangères a déclaré aux ministres des Affaires étrangères du G20 que l'accord de cessez-le-feu à Gaza devait être mis en œuvre de manière continue et effective. |
| Second reading | agree, 2026-09-29 |

Evidence 1: `src_20250220_fmprc_wang-yi-g20-fmm` (official, Ministry of Foreign Affairs of the People's Republic of China, 2025-02-20), locator **line 15**, language `en`.
Wayback: <https://web.archive.org/web/20260929045024id_/https://www.fmprc.gov.cn/eng/wjbzhd/202502/t20250221_11560001.html>

Quote:

> The conflict in Gaza has caused an unprecedented humanitarian disaster. The flames of war must not be reignited, and the ceasefire agreement must be implemented in a continuous and effective manner.

Mechanical check: found at line 15, starting within the locator (line 15). Archived text at line 15 of `archive/text/src_20250220_fmprc_wang-yi-g20-fmm.txt`:

> The conflict in Gaza has caused an unprecedented humanitarian disaster. The flames of war must not be reignited, and the ceasefire agreement must be implemented in a continuous and effective manner. Gaza and the West Bank are the homeland of the Palestinian people. “The Palestinians governing Palestine” is an important principle that must be upheld in the …

### Democratic Republic of the Congo (COD)

#### evt_2026_07_27_COD_C2_2

- [ ] Checked (46 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | C2, standing |
| Date | 2026-07-27 |
| Speaker or actor | Minister of State for Foreign Affairs / Ministre d'État, ministre des Affaires étrangères |
| Tier (points) | −10: C2 (-10): a signed memorandum of understanding on cooperation between the diplomatic academies of the Democratic Republic of the Congo and Israel (docs/calibration/README.md R18, one event per instrument; as the Kazakh memorandum on diplomatic training). |
| Confidence | corroborated |
| Scope | gaza |
| Summary (EN) | The Minister of State for Foreign Affairs signed with Israel's Minister of Foreign Affairs a memorandum of understanding on cooperation between the two countries' diplomatic academies. |
| Summary (FR) | La ministre d'État, ministre des Affaires étrangères, a signé avec le ministre israélien des Affaires étrangères un mémorandum d'entente sur la coopération entre les académies diplomatiques. |
| Second reading | agree, 2026-11-10; the notes mention a flag |

Evidence 1: `src_20260727_acp_drc-israel-cooperation-jerusalem` (press, ACP (Agence congolaise de presse, the national news agency of the Democratic Republic of the Congo), 2026-07-27), locator **line 3**, language `en`.
Wayback: <https://web.archive.org/web/20261110043248id_/https://acp.cd/anglais/strengthening-bilateral-cooperation-between-drc-and-israel-discussed-in-jerusalem/>

Quote:

> the meeting also featured the signing of two cooperation agreements: a memorandum of understanding on political and diplomatic consultations, and another on cooperation between the two countries’ diplomatic academies.

Mechanical check: found at line 3, starting within the locator (line 3). Archived text at line 3 of `archive/text/src_20260727_acp_drc-israel-cooperation-jerusalem.txt`:

> According to the document, the meeting also featured the signing of two cooperation agreements: a memorandum of understanding on political and diplomatic consultations, and another on cooperation between the two countries’ diplomatic academies. Discussions also focused on security developments in eastern Democratic Republic of the Congo and the Middle East. The Congolese foreign minister has outlined …

Evidence 2: `src_20260728_acp_rdc-modele-israelien-diplomates` (press, ACP (Agence congolaise de presse, the national news agency of the Democratic Republic of the Congo), 2026-07-28), locator **line 3**, language `fr`.
Wayback: <https://web.archive.org/web/20261110043333id_/https://acp.cd/nation/diplomatie-la-rdc-sinspire-du-modele-israelien-pour-former-ses-diplomates/>

Quote:

> cette rencontre fait suite à la signature, le 27 juillet 2026, du mémorandum d’entente sur la coopération entre les Académies diplomatiques de la RDC et de l’État d’Israël

Translation in the record:

> this meeting follows the signing, on 27 July 2026, of the memorandum of understanding on cooperation between the Diplomatic Academies of the DRC and of the State of Israel

Mechanical check: found at line 3, starting within the locator (line 3). Archived text at line 3 of `archive/text/src_20260728_acp_rdc-modele-israelien-diplomates.txt`:

> Selon ce document, cette rencontre fait suite à la signature, le 27 juillet 2026, du mémorandum d’entente sur la coopération entre les Académies diplomatiques de la RDC et de l’État d’Israël, ajoutant qu’elle marque le lancement d’un partenariat destiné à renforcer les capacités de l’Académie diplomatique congolaise à travers le développement de …

Evidence 3: `src_20260728_ecofin_drc-israel-cooperation-deals` (press, Ecofin Agency, 2026-07-28), locator **line 54**, language `en`.
Wayback: <https://web.archive.org/web/20261110043557id_/https://www.ecofinagency.com/news/2807-57775-drc-israel-sign-cooperation-deals-to-support-closer-economic-ties>

Quote:

> According to the DRC's Ministry of Foreign Affairs, the agreements establish a framework for regular political and diplomatic consultations and cooperation between the diplomatic academies of both countries.

Mechanical check: found at line 54, starting within the locator (line 54). Archived text at line 54 of `archive/text/src_20260728_ecofin_drc-israel-cooperation-deals.txt`:

> According to the DRC's Ministry of Foreign Affairs, the agreements establish a framework for regular political and diplomatic consultations and cooperation between the diplomatic academies of both countries. The two ministers also agreed to increase coordination in multilateral forums on issues of common interest.

### Colombia (COL)

#### evt_2024_06_06_COL_B9

- [ ] Checked (47 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2024-06-06 |
| Speaker or actor | President of Colombia / Président de la Colombie |
| Tier (points) | +2: Formal call for a ceasefire (+2): the joint statement of the leaders of seventeen states fully supports the move towards a ceasefire and a hostage-release agreement and says it is time for the war to end; it names no specific violation. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The President of Colombia joined sixteen other leaders in supporting a ceasefire and hostage-release agreement for Gaza and in stating that it was time for the war to end. |
| Summary (FR) | Le président de la Colombie s'est joint à seize autres dirigeants pour soutenir un cessez-le-feu et un accord de libération des otages à Gaza et déclarer qu'il était temps que la guerre prenne fin. |
| Second reading | agree, 2026-09-30 |

Evidence 1: `src_20240606_govinfo_dcpd-202400492` (official, Office of the Federal Register (Daily Compilation of Presidential Documents), 2024-06-06), locator **line 3**, language `en`.
Wayback: <https://web.archive.org/web/20260930010538id_/https://www.govinfo.gov/content/pkg/DCPD-202400492/html/DCPD-202400492.htm>

Quote:

> we fully support the movement towards a ceasefire and hostage release deal now on the table and as outlined by President Biden on May 31, 2024.

Mechanical check: found at line 3, starting within the locator (line 3). Archived text at line 3 of `archive/text/src_20240606_govinfo_dcpd-202400492.txt`:

> As leaders of countries deeply concerned for the hostages held by Hamas in Gaza, including many of our own citizens, we fully support the movement towards a ceasefire and hostage release deal now on the table and as outlined by President Biden on May 31, 2024. There is no time to lose. We call on Hamas to close this agreement, that Israel is ready to move forward with, and begin the process of releasing our citizens.

Evidence 2: `src_20240606_govinfo_dcpd-202400492` (official, Office of the Federal Register (Daily Compilation of Presidential Documents), 2024-06-06), locator **line 4**, language `en`.
Wayback: <https://web.archive.org/web/20260930010538id_/https://www.govinfo.gov/content/pkg/DCPD-202400492/html/DCPD-202400492.htm>

Quote:

> It is time for the war to end and this deal is the necessary starting point.

Mechanical check: found at line 4, starting within the locator (line 4). Archived text at line 4 of `archive/text/src_20240606_govinfo_dcpd-202400492.txt`:

> … this deal and bring relief to the families of our hostages, as well as those on both sides of this terrible conflict, including the civilian populations. It is time for the war to end and this deal is the necessary starting point.

Evidence 3: `src_20240606_govinfo_dcpd-202400492` (official, Office of the Federal Register (Daily Compilation of Presidential Documents), 2024-06-06), locator **line 6**, language `en`.
Wayback: <https://web.archive.org/web/20260930010538id_/https://www.govinfo.gov/content/pkg/DCPD-202400492/html/DCPD-202400492.htm>

Quote:

> Categories: Joint Statements : Argentina, Austria, Brazil, Bulgaria, Canada, Colombia

Mechanical check: found at line 6, starting within the locator (line 6). Archived text at line 6 of `archive/text/src_20240606_govinfo_dcpd-202400492.txt`:

> Categories: Joint Statements : Argentina, Austria, Brazil, Bulgaria, Canada, Colombia, Denmark, France, Germany, Poland, Portugal, Romania, Serbia, Spain, Thailand, and United Kingdom, situation in Gaza, Palestinian Territories.

#### evt_2024_06_11_COL_B9

- [ ] Checked (48 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2024-06-11 |
| Speaker or actor | Minister of Foreign Affairs of Colombia / Ministre des Affaires étrangères de la Colombie |
| Tier (points) | +5: Legal characterisation (+5): the Minister of Foreign Affairs said that the Palestinian people face a genocide, at the conference on the humanitarian response for Gaza. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister of Foreign Affairs of Colombia said at a conference on Gaza that the Palestinian people face a genocide. |
| Summary (FR) | Le ministre des Affaires étrangères de la Colombie a déclaré lors d'une conférence sur Gaza que le peuple palestinien fait face à un génocide. |
| Second reading | agree, 2026-09-29 |

Evidence 1: `src_20240611_cancilleria_murillo-conferencia-gaza-jordania` (official, Ministerio de Relaciones Exteriores de Colombia, 2024-06-11), locator **line 2**, language `es`.
Wayback: <https://web.archive.org/web/20260929070438id_/https://www.cancilleria.gov.co/sala-de-prensa/noticias/este-sufrimiento-humano-es-inaceptable-y-requiere-una-respuesta-urgente-y-eficaz-de-la-comunidad-internacional-canciller-luis-gilberto-murillo-sobre-la-situacion-en-gaza>

Quote:

> “El pueblo palestino hoy enfrenta un genocidio, debemos decirlo muy claramente, y la guerra es una guerra desigual que ha escalado a niveles absurdos.

Translation in the record:

> "The Palestinian people today face a genocide, we must say it very clearly, and the war is an unequal war that has escalated to absurd levels.

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20240611_cancilleria_murillo-conferencia-gaza-jordania.txt`:

> “El pueblo palestino hoy enfrenta un genocidio, debemos decirlo muy claramente, y la guerra es una guerra desigual que ha escalado a niveles absurdos. Todo eso, agravado por las dificultades que enfrentan las agencias de ayuda para llevar suministros humanitarios esenciales a Gaza. Este sufrimiento humano es …

### Comoros (COM)

#### evt_2026_10_29_COM_B9

- [ ] Checked (49 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2026-10-29 |
| Speaker or actor | President of the Union of the Comores / Président de l'Union des Comores |
| Tier (points) | +5: Legal characterisation (+5): at the third Russia-Africa summit the President says 'un génocide se poursuit en Palestine' and renews the Comores' call for the protection of civilians in Gaza and an end to the Palestinian people's sufferings. Flagged: the legal term is said of Palestine and Gaza is named in the next sentence (docs/10 B-789). |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The President of the Union of the Comores told the Russia-Africa summit that what he called a genocide was continuing in Palestine and called for the protection of civilians in Gaza. |
| Summary (FR) | Le président de l'Union des Comores a dit au sommet Russie-Afrique que ce qu'il a appelé un génocide se poursuivait en Palestine et a demandé la protection des civils à Gaza. |
| Second reading | agree, 2026-11-04; the notes mention a flag |

Evidence 1: `src_20261029_beit-salam_azali-russie-afrique` (official, Presidency of the Union of the Comores (beit-salam.km), 2026-10-29), locator **line 48**, language `fr`.
Wayback: <https://web.archive.org/web/20261104073321id_/https://beit-salam.km/discours-du-president/discours-de-sem-azali-assoumani-au-3%C3%A8me-sommet-russie-afrique.html>

Quote:

> un génocide se poursuit en Palestine

Translation in the record:

> a genocide is continuing in Palestine

Mechanical check: found at line 48, starting within the locator (line 48). Archived text at line 48 of `archive/text/src_20261029_beit-salam_azali-russie-afrique.txt`:

> Ce Sommet se tient alors que qu’un génocide se poursuit en Palestine, que des drames se déroulent, sous nos yeux, en Cisjordanie occupée,

Evidence 2: `src_20261029_beit-salam_azali-russie-afrique` (official, Presidency of the Union of the Comores (beit-salam.km), 2026-10-29), locator **line 49**, language `fr`.
Wayback: <https://web.archive.org/web/20261104073321id_/https://beit-salam.km/discours-du-president/discours-de-sem-azali-assoumani-au-3%C3%A8me-sommet-russie-afrique.html>

Quote:

> son appel à la protection des populations civiles à Gaza, à la fin des supplices infligées au peuple palestinien

Translation in the record:

> its call for the protection of the civilian populations in Gaza, for an end to the torment inflicted on the Palestinian people

Mechanical check: found at line 49, starting within the locator (line 49). Archived text at line 49 of `archive/text/src_20261029_beit-salam_azali-russie-afrique.txt`:

> L’Union des Comores réitère ici, son appel à la protection des populations civiles à Gaza, à la fin des supplices infligées au peuple palestinien et réaffirme son sourient à la solution à deux Etats, Israël et Palestine, vivant en paix.

#### evt_2024_11_27_COM_B9

- [ ] Checked (50 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2024-11-27 |
| Speaker or actor | President of the Union of the Comores / Président de l'Union des Comores |
| Tier (points) | +5: Legal characterisation (+5): at the MEDays forum in Tangier the President speaks of 'le génocide en cours à Gaza, où les victimes, par dizaines de milliers sont en majorité des civils innocents' and ends by urging an end to the sufferings of the Palestinian people. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The President of the Union of the Comores told the MEDays forum in Tangier that what he called a genocide was under way in Gaza. |
| Summary (FR) | Le président de l'Union des Comores a dit au forum MEDays, à Tanger, que ce qu'il a appelé un génocide se déroulait à Gaza. |
| Second reading | agree, 2026-11-04 |

Evidence 1: `src_20241127_beit-salam_azali-medays` (official, Presidency of the Union of the Comores (beit-salam.km), 2024-11-27), locator **line 15**, language `fr`.
Wayback: <https://web.archive.org/web/20241203170337id_/https://beit-salam.km/discours-du-president/allocution-de-sem-monsieur-azali-assoumani-pr%C3%A9sident-de-l%E2%80%99union-des-comores%2C-%C3%A0-la-16%C3%A8me-%C3%A9dition-du-forum-medays.html>

Quote:

> le génocide en cours à Gaza, où les victimes, par dizaines de milliers sont en majorité des civils innocents

Translation in the record:

> the genocide under way in Gaza, where the victims, in the tens of thousands, are mostly innocent civilians

Mechanical check: found at line 15, starting within the locator (line 15). Archived text at line 15 of `archive/text/src_20241127_beit-salam_azali-medays.txt`:

> La guerre en Ukraine, le génocide en cours à Gaza, où les victimes, par dizaines de milliers sont en majorité des civils innocents, notamment les femmes et les enfants ainsi que les attaques meurtrières menée par Israël contre les civils au Liban, tout comme les conflits internes dans de …

### Costa Rica (CRI)

#### evt_2025_12_08_CRI_C2

- [ ] Checked (51 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | C2, standing |
| Date | 2025-12-08 |
| Speaker or actor | Ministry of Foreign Trade of Costa Rica / Ministère du Commerce extérieur du Costa Rica |
| Tier (points) | −10: C2 (-10): a free trade agreement with Israel signed in Jerusalem by the Minister of Foreign Trade and Israel's Minister of Economy and Industry, covering trade, investment and innovation (docs/calibration/README.md R18, one event per instrument); it awaits the Legislative Assembly's approval. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Government of Costa Rica signed a free trade agreement with Israel in Jerusalem. |
| Summary (FR) | Le gouvernement du Costa Rica a signé à Jérusalem un traité de libre-échange avec Israël. |
| Second reading | agree, 2026-10-06; the notes mention a flag |

Evidence 1: `src_20251208_comex_tlc-israel` (official, Ministerio de Comercio Exterior de Costa Rica (COMEX), 2025-12-08), locator **line 4**, language `es`.
Wayback: <https://web.archive.org/web/20261005234720id_/https://www.comex.go.cr/sala-de-prensa/comunicados/2025/diciembre/cp-3100-costa-rica-e-israel-firman-tratado-de-libre-comercio-que-fortalecer%C3%A1-su-vinculaci%C3%B3n-comercial-en-sectores-estrat%C3%A9gicos/>

Quote:

> Costa Rica e Israel suscribieron hoy un Tratado de Libre Comercio (TLC), culminando un proceso iniciado en marzo de 2023.

Translation in the record:

> Costa Rica and Israel today signed a Free Trade Agreement (FTA), culminating a process begun in March 2023.

Mechanical check: found at line 4, starting within the locator (line 4). Archived text at line 4 of `archive/text/src_20251208_comex_tlc-israel.txt`:

> Jerusalén, 8 de diciembre de 2026. Costa Rica e Israel suscribieron hoy un Tratado de Libre Comercio (TLC), culminando un proceso iniciado en marzo de 2023. Este acuerdo consolida un hito estratégico en la relación bilateral y representa un paso firme hacia la diversificación y profundización de los lazos …

Evidence 2: `src_20251208_comex_tlc-israel` (official, Ministerio de Comercio Exterior de Costa Rica (COMEX), 2025-12-08), locator **line 12**, language `es`.
Wayback: <https://web.archive.org/web/20261005234720id_/https://www.comex.go.cr/sala-de-prensa/comunicados/2025/diciembre/cp-3100-costa-rica-e-israel-firman-tratado-de-libre-comercio-que-fortalecer%C3%A1-su-vinculaci%C3%B3n-comercial-en-sectores-estrat%C3%A9gicos/>

Quote:

> Este proceso culmina hoy con la firma oficial del Tratado.

Translation in the record:

> This process culminates today with the official signing of the Treaty.

Mechanical check: found at line 12, starting within the locator (line 12). Archived text at line 12 of `archive/text/src_20251208_comex_tlc-israel.txt`:

> … de un Memorando de Entendimiento. Tras la reafirmación del compromiso en octubre de 2024, el cierre técnico de la negociación se alcanzó en noviembre de 2025. Este proceso culmina hoy con la firma oficial del Tratado.

Evidence 3: `src_20251209_jns_israel-costa-rica-fta` (press, JNS (Jewish News Syndicate), 2025-12-09), locator **line 2**, language `en`.
Wayback: <https://web.archive.org/web/20260202142524id_/https://www.jns.org/israel-and-costa-rica-sign-landmark-free-trade-deal/>

Quote:

> Israel and Costa Rica have taken a “leap forward” in bilateral relations with the signing of a free trade agreement encompassing goods, services and investments, Jerusalem’s Foreign Ministry announced on Monday.

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20251209_jns_israel-costa-rica-fta.txt`:

> Israel and Costa Rica have taken a “leap forward” in bilateral relations with the signing of a free trade agreement encompassing goods, services and investments, Jerusalem’s Foreign Ministry announced on Monday.

Evidence 4: `src_20251212_upi_costa-rica-israel-trade-pact` (press, UPI, 2025-12-12), locator **line 1**, language `en`.
Wayback: <https://web.archive.org/web/20260813000554id_/https://www.upi.com/Top_News/World-News/2025/12/12/latam-costarica-israel-trade-agreement/2771765552596/>

Quote:

> Israel and Costa Rica have signed a free trade agreement, but it must be ratified by Costa Rica's Legislative Assembly

Mechanical check: found at line 1, starting within the locator (line 1). Archived text at line 1 of `archive/text/src_20251212_upi_costa-rica-israel-trade-pact.txt`:

> Israel and Costa Rica have signed a free trade agreement, but it must be ratified by Costa Rica's Legislative Assembly in the face of opposition by pro-Palestinian groups. File Photo by Abir Sultan/EPA

### Cuba (CUB)

#### evt_2025_09_26_CUB_B9

- [ ] Checked (52 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-09-26 |
| Speaker or actor | Minister of Foreign Affairs of Cuba / Ministre des Affaires étrangères de Cuba |
| Tier (points) | +5: Legal characterisation and named violations (+5): at the General Assembly the Foreign Minister said that 2.2 million people in Gaza were doomed to starve through 'acts of genocide, extermination and ethnic cleansing'. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Foreign Minister said in the General Debate that 2.2 million people in Gaza were doomed to starve through what he called acts of genocide. |
| Summary (FR) | Le ministre des Affaires étrangères a déclaré au débat général que 2,2 millions de personnes à Gaza étaient condamnées à la famine par ce qu'il a appelé des actes de génocide. |
| Second reading | agree, 2026-10-06 |

Evidence 1: `src_20250926_un-gadebate_cub-rodriguez-en` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2025-09-26), locator **line 9**, language `en`.
Wayback: <https://web.archive.org/web/20260118015217id_/https://gadebate.un.org/sites/default/files/gastatements/80/cu_en.pdf>

Quote:

> 2.2 million human beings in Gaza are doomed to starve due to the acts of genocide, extermination and ethnic cleansing of the Zionist regime

Mechanical check: found at lines 9–11, starting within the locator (line 9). Archived text at lines 9–11 of `archive/text/src_20250926_un-gadebate_cub-rodriguez-en.txt`:

> As we deliberate here, 2.2 million human beings in Gaza are doomed to starve due to the acts of genocide, extermination and ethnic cleansing of the Zionist regime, which counts on the military and

#### evt_2025_10_01_CUB_B9

- [ ] Checked (53 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-10-01 |
| Speaker or actor | Minister of Foreign Affairs of Cuba / Ministre des Affaires étrangères de Cuba |
| Tier (points) | +5: Legal characterisation and named violations (+5): at the General Assembly's plenary on the use of the veto the Foreign Minister said that the Israeli campaign in Gaza was a genocide and a crime against humanity, that fifteen Palestinians died each day of malnutrition, that Israel used hunger as a weapon of war, and called for an immediate and permanent ceasefire and an arms embargo against Israel. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Foreign Minister told the General Assembly's plenary on the veto that Israel was committing what he called genocide in Gaza, and called for an immediate ceasefire and an arms embargo. |
| Summary (FR) | Le ministre des Affaires étrangères a dit à l'Assemblée générale qu'Israël commettait ce qu'il a appelé un génocide à Gaza, et a demandé un cessez-le-feu immédiat et un embargo sur les armes. |
| Second reading | agree, 2026-11-09 |

Evidence 1: `src_20251001_cubaminrex_rodriguez-plenaria-veto-es` (official, Ministry of Foreign Affairs of Cuba (cubaminrex.cu), 2025-10-01), locator **line 11**, language `es`.
Wayback: <https://web.archive.org/web/20261109215249id_/https://cubaminrex.cu/es/intervencion-del-ministro-de-relaciones-exteriores-de-la-republica-de-cuba-excmo-sr-bruno-rodriguez>

Quote:

> Cuba reafirma su compromiso y apoyo a la causa palestina, y reitera su firme condena al genocidio que perpetra Israel en Gaza, con el fin de exterminar o expulsar a la población de ese territorio ocupado.

Translation in the record:

> Cuba reaffirms its commitment and support for the Palestinian cause, and reiterates its firm condemnation of the genocide that Israel is perpetrating in Gaza, in order to exterminate or expel the population of that occupied territory.

Mechanical check: found at line 11, starting within the locator (line 11). Archived text at line 11 of `archive/text/src_20251001_cubaminrex_rodriguez-plenaria-veto-es.txt`:

> Cuba reafirma su compromiso y apoyo a la causa palestina, y reitera su firme condena al genocidio que perpetra Israel en Gaza, con el fin de exterminar o expulsar a la población de ese territorio ocupado.

Evidence 2: `src_20251001_cubaminrex_rodriguez-plenaria-veto-es` (official, Ministry of Foreign Affairs of Cuba (cubaminrex.cu), 2025-10-01), locator **line 8**, language `es`.
Wayback: <https://web.archive.org/web/20261109215249id_/https://cubaminrex.cu/es/intervencion-del-ministro-de-relaciones-exteriores-de-la-republica-de-cuba-excmo-sr-bruno-rodriguez>

Quote:

> Es inadmisible que Israel continúe utilizando el hambre, la entrega de alimentos y la ayuda humanitaria como armas de guerra.

Translation in the record:

> It is inadmissible that Israel continues to use hunger, the delivery of food and humanitarian aid as weapons of war.

Mechanical check: found at line 8, starting within the locator (line 8). Archived text at line 8 of `archive/text/src_20251001_cubaminrex_rodriguez-plenaria-veto-es.txt`:

> Es inadmisible que Israel continúe utilizando el hambre, la entrega de alimentos y la ayuda humanitaria como armas de guerra. Privar de agua, electricidad, medicamentos y combustible a una población civil sitiada no es una estrategia militar, sino un crimen de lesa humanidad, un …

Evidence 3: `src_20251001_cubaminrex_rodriguez-plenaria-veto-es` (official, Ministry of Foreign Affairs of Cuba (cubaminrex.cu), 2025-10-01), locator **line 10**, language `es`.
Wayback: <https://web.archive.org/web/20261109215249id_/https://cubaminrex.cu/es/intervencion-del-ministro-de-relaciones-exteriores-de-la-republica-de-cuba-excmo-sr-bruno-rodriguez>

Quote:

> Urge un cese al fuego inmediato y permanente en la Franja de Gaza y la retirada de las fuerzas de ocupación israelíes.

Translation in the record:

> An immediate and permanent ceasefire in the Gaza Strip and the withdrawal of the Israeli occupation forces are urgent.

Mechanical check: found at line 10, starting within the locator (line 10). Archived text at line 10 of `archive/text/src_20251001_cubaminrex_rodriguez-plenaria-veto-es.txt`:

> Urge un cese al fuego inmediato y permanente en la Franja de Gaza y la retirada de las fuerzas de ocupación israelíes. Israel debe permitir el acceso de ayuda humanitaria suficiente, sin condiciones, ni límites y debe autorizar la labor indispensable de UNRWA.

Evidence 4: `src_20251001_cubaminrex_rodriguez-plenaria-veto-es` (official, Ministry of Foreign Affairs of Cuba (cubaminrex.cu), 2025-10-01), locator **line 15**, language `es`.
Wayback: <https://web.archive.org/web/20261109215249id_/https://cubaminrex.cu/es/intervencion-del-ministro-de-relaciones-exteriores-de-la-republica-de-cuba-excmo-sr-bruno-rodriguez>

Quote:

> Puede instar a los Estados Miembros a imponer un embargo de armas contra Israel

Translation in the record:

> It can urge Member States to impose an arms embargo on Israel

Mechanical check: found at line 15, starting within the locator (line 15). Archived text at line 15 of `archive/text/src_20251001_cubaminrex_rodriguez-plenaria-veto-es.txt`:

> … General puede hacer más. La Asamblea está en capacidad declarar al genocidio y al apartheid que comete Israel como lo que son, crímenes de lesa humanidad. Puede instar a los Estados Miembros a imponer un embargo de armas contra Israel, y excluir a ese país de la participación en las organizaciones y conferencias internacionales bajo los auspicios de las Naciones Unidas.

### Cyprus (CYP)

#### evt_2024_07_15_CYP_B11

- [ ] Checked (54 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B11, standing |
| Date | 2024-07-15 |
| Speaker or actor | — / — |
| Tier (points) | +5: Sanctions on settler entities (+5): the EU listing of 15 July 2024 (Decision (CFSP) 2024/1967) of five persons and three entities, among them Tzav 9 for blocking humanitarian aid trucks to Gaza, adopted by unanimity. Scoped gaza as the listing cites Gaza (docs/10 B-32; B-281 (2), as Norway's alignment, evt_2024_07_24_NOR_B11). |
| Confidence | confirmed |
| Scope | gaza, west-bank |
| Summary (EN) | The government agreed in the EU Council to sanctions on five Israeli settlers and activists and three entities, including a group blocking aid trucks bound for Gaza. |
| Summary (FR) | Le gouvernement a approuvé au Conseil de l'UE des sanctions contre cinq colons et militants israéliens et trois entités, dont un groupe bloquant les camions d'aide destinés à Gaza. |
| Second reading | agree, 2026-11-04 |

Evidence 1: `src_20240715_consilium_settlers-tzav9-sanctions` (official, Council of the European Union, 2024-07-15), locator **line 1**, language `en`.
Wayback: <https://web.archive.org/web/20240715172525id_/https://www.consilium.europa.eu/en/press/press-releases/2024/07/15/extremist-israeli-settlers-in-the-occupied-west-bank-and-east-jerusalem-as-well-as-violent-activists-blocking-humanitarian-aid-to-gaza-five-individuals-and-three-entities-sanctioned-under-the-eu-global-human-rights-sanctions-regime/>

Quote:

> Today the Council approved additional restrictive measures against five persons and three entities under the European Union's Global Human Rights Sanctions Regime. The listed individuals and entities are responsible for serious and systematic human rights abuses against Palestinians in the West Bank, including abuse of the right of everyone to enjoy the highest attainable standard of physical and mental integrity, the right to property, the right to private and family life, to freedom of religion or belief and the right to education.

Mechanical check: found at line 1, starting within the locator (line 1). Archived text at line 1 of `archive/text/src_20240715_consilium_settlers-tzav9-sanctions.txt`:

> Today the Council approved additional restrictive measures against five persons and three entities under the European Union's Global Human Rights Sanctions Regime. The listed individuals and entities are responsible for serious and systematic human rights abuses against Palestinians in the West Bank, including abuse of the right of everyone to enjoy the highest attainable standard of physical and mental integrity, the right to property, the right to private and family life, to freedom of religion or belief and the right to education.

Evidence 2: `src_20240715_consilium_settlers-tzav9-sanctions` (official, Council of the European Union, 2024-07-15), locator **line 4**, language `en`.
Wayback: <https://web.archive.org/web/20240715172525id_/https://www.consilium.europa.eu/en/press/press-releases/2024/07/15/extremist-israeli-settlers-in-the-occupied-west-bank-and-east-jerusalem-as-well-as-violent-activists-blocking-humanitarian-aid-to-gaza-five-individuals-and-three-entities-sanctioned-under-the-eu-global-human-rights-sanctions-regime/>

Quote:

> Today’s designations also include Tzav 9, an Israeli group of violent activists founded in January 2024, regularly blocking humanitarian aid trucks delivering food, water and fuel to Gaza. Tzav 9’s actions include violent protests, attacks against food trucks and the destruction of food.

Mechanical check: found at line 4, starting within the locator (line 4). Archived text at line 4 of `archive/text/src_20240715_consilium_settlers-tzav9-sanctions.txt`:

> Today’s designations also include Tzav 9, an Israeli group of violent activists founded in January 2024, regularly blocking humanitarian aid trucks delivering food, water and fuel to Gaza. Tzav 9’s actions include violent protests, attacks against food trucks and the destruction of food.

Evidence 3: `src_20240715_consilium_settlers-tzav9-sanctions` (official, Council of the European Union, 2024-07-15), locator **line 12**, language `en`.
Wayback: <https://web.archive.org/web/20240715172525id_/https://www.consilium.europa.eu/en/press/press-releases/2024/07/15/extremist-israeli-settlers-in-the-occupied-west-bank-and-east-jerusalem-as-well-as-violent-activists-blocking-humanitarian-aid-to-gaza-five-individuals-and-three-entities-sanctioned-under-the-eu-global-human-rights-sanctions-regime/>

Quote:

> Council Decision (CFSP) 2024/1967 of 15 July 2024 amending Decision (CFSP) 2020/1999 concerning restrictive measures against serious human rights violations and abuses (including the list of sanctioned individuals and entities)

Mechanical check: found at line 12, starting within the locator (line 12). Archived text at line 12 of `archive/text/src_20240715_consilium_settlers-tzav9-sanctions.txt`:

> Council Decision (CFSP) 2024/1967 of 15 July 2024 amending Decision (CFSP) 2020/1999 concerning restrictive measures against serious human rights violations and abuses (including the list of sanctioned individuals and entities)

Evidence 4: `src_20240715_eur-lex_cfsp-2024-1967` (official, Council of the European Union (Official Journal, EUR-Lex), 2024-07-15), locator **line 2**, language `en`.
Wayback: <https://web.archive.org/web/20240917211729id_/https://eur-lex.europa.eu/eli/dec/2024/1967>

Quote:

> the following entries are added to the list of natural and legal persons, entities and bodies under heading ‘A. Natural persons’:

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20240715_eur-lex_cfsp-2024-1967.txt`:

> the following entries are added to the list of natural and legal persons, entities and bodies under heading ‘A. Natural persons’:

### Czechia (CZE)

#### evt_2023_10_25_CZE_B10

- [ ] Checked (55 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B10, repeatable |
| Date | 2023-10-25 |
| Speaker or actor | Prime Minister / Premier ministre |
| Tier (points) | −5 |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Prime Minister said in Israel that Czechia stood on Israel's side and would stand by it for as long as needed. |
| Summary (FR) | Le Premier ministre a déclaré en Israël que la Tchéquie se tenait aux côtés d'Israël et le resterait aussi longtemps que nécessaire. |
| Second reading | agree, 2026-09-29 |

Evidence 1: `src_20231025_vlada-cz_fiala-izrael-netanjahu` (official, Úřad vlády České republiky (Office of the Government of the Czech Republic), vlada.gov.cz, 2023-10-25), locator **line 4**, language `cs`.
Wayback: <https://web.archive.org/web/20260929005259id_/https://vlada.gov.cz/cz/media-centrum/aktualne/premier-fiala-jednal-v-izraeli-s-premierem-netanjahuem-a-prezidentem-herzogem-209437/>

Quote:

> Ujistil jsem naše přátele, že Česko stojí na straně Izraele a bude při něm stát tak dlouho, jak to bude potřeba.

Translation in the record:

> I assured our friends that Czechia stands on Israel's side and will stand by it for as long as it takes.

Mechanical check: found at line 4, starting within the locator (line 4). Archived text at line 4 of `archive/text/src_20231025_vlada-cz_fiala-izrael-netanjahu.txt`:

> … „7. říjen byl pro Izrael a židovský národ nejtragičtějším za desítky let, teroristické útoky Hamásu jsou nevýslovně brutální a Izrael má plné právo na obranu. Ujistil jsem naše přátele, že Česko stojí na straně Izraele a bude při něm stát tak dlouho, jak to bude potřeba. Naše podpora je konkrétní. České firmy okamžitě dodaly Izraeli základní vojenské vybavení, například balistické pláty od společnosti STV Group. O další možné …

Evidence 2: `src_20231025_vlada-cz_fiala-izrael-netanjahu` (official, Úřad vlády České republiky (Office of the Government of the Czech Republic), vlada.gov.cz, 2023-10-25), locator **line 6**, language `cs`.
Wayback: <https://web.archive.org/web/20260929005259id_/https://vlada.gov.cz/cz/media-centrum/aktualne/premier-fiala-jednal-v-izraeli-s-premierem-netanjahuem-a-prezidentem-herzogem-209437/>

Quote:

> Izrael je náš klíčový spojenec. Má právo na mír a bezpečnost a Česká republika stojí pevně po jeho boku

Translation in the record:

> Israel is our key ally. It has the right to peace and security and the Czech Republic stands firmly by its side

Mechanical check: found at line 6, starting within the locator (line 6). Archived text at line 6 of `archive/text/src_20231025_vlada-cz_fiala-izrael-netanjahu.txt`:

> … Hamás je teroristická organizace, podle toho k ní musíme přistupovat, musíme si být jistí tím, že žádné evropské peníze nebudou využity na podporu terorismu. Izrael je náš klíčový spojenec. Má právo na mír a bezpečnost a Česká republika stojí pevně po jeho boku,“ dodal premiér. Rada se bude také zabývat tím, jak podpořit úsilí o propuštění rukojmích, které teroristé v Gaze drží.

### Germany (DEU)

#### evt_2023_10_12_DEU_B10

- [ ] Checked (56 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B10, repeatable |
| Date | 2023-10-12 |
| Speaker or actor | Federal Chancellor / Chancelier fédéral |
| Tier (points) | −5 |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Federal Chancellor said in a government statement to the Bundestag that at this moment there was only one place for Germany, at Israel's side. |
| Summary (FR) | Le chancelier fédéral a affirmé, dans une déclaration gouvernementale au Bundestag, qu'il n'y avait en ce moment qu'une place pour l'Allemagne, aux côtés d'Israël. |
| Second reading | agree, 2026-09-28; the notes mention a flag |

Evidence 1: `src_20231012_bundesregierung_bulletin-111-1-scholz-israel` (official, Die Bundesregierung (Presse- und Informationsamt), 2023-10-12), locator **page 2 (paragraphs 36–38 of the extracted text)**, language `de`.
Wayback: <https://web.archive.org/web/20260928104910id_/https://www.bundesregierung.de/resource/blob/992814/2230132/72ecc2497b84a5dc74bf4d02aadd2724/111-1-bk-bt-data.pdf?download=1>

Quote:

> In diesem Moment gibt es für Deutschland nur einen Platz: den Platz an der Seite Israels. Das meinen wir, wenn wir sagen: Die Sicherheit Israels ist deutsche Staatsräson.

Translation in the record:

> At this moment there is only one place for Germany: the place at Israel's side. That is what we mean when we say: Israel's security is Germany's reason of state.

Mechanical check: found at lines 36–38; the locator is not a line number. Archived text at lines 36–38 of `archive/text/src_20231012_bundesregierung_bulletin-111-1-scholz-israel.txt`:

> gestellt werden, und darum muss Israel sich verteidigen können. In diesem Moment gibt es für Deutschland nur einen Platz: den Platz an der Seite Israels. Das meinen wir, wenn wir sagen: Die Sicherheit Israels ist deutsche Staatsräson. Unsere eigene

#### evt_2024_04_24_DEU_D3

- [ ] Checked (57 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | D3, standing |
| Date | 2024-04-24 |
| Speaker or actor | Federal Foreign Office and Federal Ministry for Economic Cooperation and Development / Ministère fédéral des Affaires étrangères et ministère fédéral de la Coopération économique et du Développement |
| Tier (points) | +5: Restored tier (+5). Not the increased tier: UNRWA's donor tables give USD 202,054,285 for 2022 and USD 173,994,652 pledged for 2024 (checked in P-16, docs/10 B-223 (2)); the 2023 contribution (USD 212,890,232) exceeded 2022, which is evt_2023_12_31_DEU_D3 up to the suspension. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Federal Foreign Office and the development ministry announced that the federal government would shortly continue its cooperation with UNRWA in Gaza. |
| Summary (FR) | Le ministère fédéral des Affaires étrangères et le ministère du Développement ont annoncé que le gouvernement fédéral poursuivrait prochainement sa coopération avec l'UNRWA à Gaza. |
| Second reading | agree, 2026-09-28 |

Evidence 1: `src_20240424_auswaertiges-amt_unrwa-fortsetzung` (official, Auswärtiges Amt, 2024-04-24), locator **paragraph 5**, language `de`.
Wayback: <https://web.archive.org/web/20260928104250id_/https://www.auswaertiges-amt.de/de/newsroom/2654388-2654388>

Quote:

> Vor diesem Hintergrund und in Begleitung dieser Reformen wird die Bundesregierung die Zusammenarbeit mit UNRWA in Gaza in Kürze fortsetzen, so wie u.a. bereits Australien, Kanada, Schweden und Japan.

Translation in the record:

> Against this background and accompanying these reforms, the Federal Government will shortly continue its cooperation with UNRWA in Gaza, as Australia, Canada, Sweden and Japan, among others, already have.

Mechanical check: found at line 5; the locator is not a line number. Archived text at line 5 of `archive/text/src_20240424_auswaertiges-amt_unrwa-fortsetzung.txt`:

> Vor diesem Hintergrund und in Begleitung dieser Reformen wird die Bundesregierung die Zusammenarbeit mit UNRWA in Gaza in Kürze fortsetzen, so wie u.a. bereits Australien, Kanada, Schweden und Japan. Deutschland wird sich mit seinen engsten internationalen Partnern zur Auszahlung weiterer Mittel eng abstimmen. Der kurzfristige Finanzierungsbedarf von UNRWA …

#### evt_2024_03_21_DEU_B9

- [ ] Checked (58 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2024-03-21 |
| Speaker or actor | Federal Foreign Minister / Ministre fédérale des Affaires étrangères |
| Tier (points) | +2: Formal call for a humanitarian ceasefire (+2); the passage names no specific violation and uses no legal characterisation. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Federal Foreign Minister told the Bundestag that the dying and the hunger in Gaza had to end and that this required a humanitarian ceasefire. |
| Summary (FR) | La ministre fédérale des Affaires étrangères a déclaré au Bundestag que les morts et la faim à Gaza devaient cesser et qu'il fallait pour cela un cessez-le-feu humanitaire. |
| Second reading | agree, 2026-09-28 |

Evidence 1: `src_20240321_bundesregierung_bulletin-baerbock-israel` (official, Die Bundesregierung (Presse- und Informationsamt), 2024-03-21), locator **paragraph 12**, language `de`.
Wayback: <https://web.archive.org/web/20260928110147id_/https://www.bundesregierung.de/breg-de/service/newsletter-und-abos/bulletin/baerbock-israel-2266842>

Quote:

> Das Sterben, das Hungern – es muss ein Ende haben. Dafür braucht es einen humanitären Waffenstillstand

Translation in the record:

> The dying, the hunger: it must come to an end. That requires a humanitarian ceasefire

Mechanical check: found at line 12; the locator is not a line number. Archived text at line 12 of `archive/text/src_20240321_bundesregierung_bulletin-baerbock-israel.txt`:

> Das Sterben, das Hungern – es muss ein Ende haben. Dafür braucht es einen humanitären Waffenstillstand, wie ihn gerade Katar stellvertretend für viele von uns versucht zu verhandeln, damit die Geiseln freikommen – das will die Hamas nicht; aber das muss …

### Djibouti (DJI)

#### evt_2026_11_14_DJI_B9

- [ ] Checked (59 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2026-11-14 |
| Speaker or actor | Minister of Foreign Affairs and International Cooperation of the Republic of Djibouti / Ministre des Affaires étrangères et de la Coopération internationale de la République de Djibouti |
| Tier (points) | +5: Names specific violations (+5): the eighteen foreign ministers condemn the Israeli airstrike on the Nasser Medical Complex in Khan Younis as a violation of international humanitarian law and call on Israel to uphold the ceasefire and ensure unimpeded humanitarian aid. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister of Foreign Affairs and seventeen counterparts condemned the Israeli strike on the Nasser Medical Complex in Khan Younis as a violation of international humanitarian law. |
| Summary (FR) | Le ministre des Affaires étrangères et dix-sept homologues ont condamné la frappe israélienne contre le complexe médical Nasser de Khan Younès comme une violation du droit international humanitaire. |
| Second reading | agree, 2026-11-28; the notes mention a flag |

Evidence 1: `src_20261114_mfa-tr_joint-statement-nasser-medical-complex` (official, Ministry of Foreign Affairs of the Republic of Türkiye, 2026-11-14), locator **line 2**, language `en`.
Wayback: <https://web.archive.org/web/20261128044350id_/https://www.mfa.gov.tr/condemn-in-the-strongest-terms-the-israeli-airstrike-on-the-nasser-medical-complex-in-khan-younis.en.mfa>

Quote:

> condemn in the strongest terms the Israeli airstrike on the Nasser Medical Complex in Khan Younis, which caused casualties among patients and medical personnel, in violation of international humanitarian law, which affords special protection to medical facilities and healthcare workers.

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20261114_mfa-tr_joint-statement-nasser-medical-complex.txt`:

> … State of Palestine, the State of Qatar, the Kingdom of Saudi Arabia, the Federal Republic of Somalia, the Republic of the Sudan and the United Arab Emirates condemn in the strongest terms the Israeli airstrike on the Nasser Medical Complex in Khan Younis, which caused casualties among patients and medical personnel, in violation of international humanitarian law, which affords special protection to medical facilities and healthcare workers.

Evidence 2: `src_20261114_mfa-tr_joint-statement-nasser-medical-complex` (official, Ministry of Foreign Affairs of the Republic of Türkiye, 2026-11-14), locator **line 5**, language `en`.
Wayback: <https://web.archive.org/web/20261128044350id_/https://www.mfa.gov.tr/condemn-in-the-strongest-terms-the-israeli-airstrike-on-the-nasser-medical-complex-in-khan-younis.en.mfa>

Quote:

> Israel must uphold the ceasefire, protect civilians and medical facilities, and ensure the safe, sustained and unimpeded delivery of humanitarian aid in sufficient quantities, including shelter and early recovery supplies and equipment to restore essential infrastructure.

Mechanical check: found at line 5, starting within the locator (line 5). Archived text at line 5 of `archive/text/src_20261114_mfa-tr_joint-statement-nasser-medical-complex.txt`:

> … in full its obligations under the Sharm El-Sheikh Agreement, President Trump’s Comprehensive Plan and United Nations Security Council Resolution 2803 (2025). Israel must uphold the ceasefire, protect civilians and medical facilities, and ensure the safe, sustained and unimpeded delivery of humanitarian aid in sufficient quantities, including shelter and early recovery supplies and equipment to restore essential infrastructure. It must also allow United Nations agencies and humanitarian organisations to carry out their mandates without obstruction.

Evidence 3: `src_20261114_mfa-tr_joint-statement-nasser-medical-complex` (official, Ministry of Foreign Affairs of the Republic of Türkiye, 2026-11-14), locator **line 2**, language `en`.
Wayback: <https://web.archive.org/web/20261128044350id_/https://www.mfa.gov.tr/condemn-in-the-strongest-terms-the-israeli-airstrike-on-the-nasser-medical-complex-in-khan-younis.en.mfa>

Quote:

> Republic of Djibouti

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20261114_mfa-tr_joint-statement-nasser-medical-complex.txt`:

> The Foreign Ministers of the Republic of Türkiye, the People's Democratic Republic of Algeria, Republic of Djibouti, the Arab Republic of Egypt, the Republic of Indonesia, the Hashemite Kingdom of Jordan, the State of Kuwait, the Lebanese Republic, the State of Libya, the …

### Denmark (DNK)

#### evt_2025_08_13_DNK_B9

- [ ] Checked (60 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-08-13 |
| Speaker or actor | Minister for Foreign Affairs / Ministre des Affaires étrangères |
| Tier (points) | +5: Names a specific violation (+5): starvation and famine in Gaza, and the call for Israel to unblock aid; it also calls for a ceasefire. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister for Foreign Affairs signed a joint statement that says famine is unfolding in Gaza and calls for a ceasefire. |
| Summary (FR) | Le ministre des Affaires étrangères a signé une déclaration commune qui affirme qu'une famine sévit à Gaza et appelle à un cessez-le-feu. |
| Second reading | agree, 2026-09-29 |

Evidence 1: `src_20250813_um_joint-statement-humanitarian-gaza` (official, Udenrigsministeriet (Ministry of Foreign Affairs of Denmark), press room on via.ritzau.dk, 2025-08-13), locator **line 2**, language `en`.
Wayback: <https://web.archive.org/web/20260928221541id_/https://via.ritzau.dk/pressemeddelelse/14522515/joint-statement-on-the-humanitarian-situation-in-gaza?publisherId=2012662&lang=da>

Quote:

> Famine is unfolding before our eyes. Urgent action is needed now to halt and reverse starvation.

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20250813_um_joint-statement-humanitarian-gaza.txt`:

> The humanitarian suffering in Gaza has reached unimaginable levels. Famine is unfolding before our eyes. Urgent action is needed now to halt and reverse starvation. Humanitarian space must be protected, and aid should never be politicised.

Evidence 2: `src_20250813_um_joint-statement-humanitarian-gaza` (official, Udenrigsministeriet (Ministry of Foreign Affairs of Denmark), press room on via.ritzau.dk, 2025-08-13), locator **line 4**, language `en`.
Wayback: <https://web.archive.org/web/20260928221541id_/https://via.ritzau.dk/pressemeddelelse/14522515/joint-statement-on-the-humanitarian-situation-in-gaza?publisherId=2012662&lang=da>

Quote:

> We need a ceasefire that can end the war, for hostages to be released and aid to enter Gaza by land unhindered.

Mechanical check: found at line 4, starting within the locator (line 4). Archived text at line 4 of `archive/text/src_20250813_um_joint-statement-humanitarian-gaza.txt`:

> We are grateful to the US, Qatar and Egypt for their efforts in pushing for a ceasefire and pursuing peace. We need a ceasefire that can end the war, for hostages to be released and aid to enter Gaza by land unhindered.

Evidence 3: `src_20250813_um_joint-statement-humanitarian-gaza` (official, Udenrigsministeriet (Ministry of Foreign Affairs of Denmark), press room on via.ritzau.dk, 2025-08-13), locator **line 6**, language `en`.
Wayback: <https://web.archive.org/web/20260928221541id_/https://via.ritzau.dk/pressemeddelelse/14522515/joint-statement-on-the-humanitarian-situation-in-gaza?publisherId=2012662&lang=da>

Quote:

> The Foreign Ministers of Australia, Belgium, Canada, Cyprus, Denmark,

Mechanical check: found at line 6, starting within the locator (line 6). Archived text at line 6 of `archive/text/src_20250813_um_joint-statement-humanitarian-gaza.txt`:

> The Foreign Ministers of Australia, Belgium, Canada, Cyprus, Denmark, Estonia, Finland, France, Greece, Iceland, Ireland, Japan, Lithuania, Luxembourg, Malta, the Netherlands, Norway, Portugal, Slovakia, Slovenia, Spain, Sweden, …

### Dominican Republic (DOM)

#### evt_2024_10_31_DOM_C2

- [ ] Checked (61 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | C2, standing |
| Date | 2024-10-31 |
| Speaker or actor | Ministry of Foreign Affairs of the Dominican Republic / Ministère des Affaires étrangères de la République dominicaine |
| Tier (points) | −10: C2 (-10): an agreement signed in Santo Domingo by the Minister of Foreign Affairs and the Israeli Ambassador, for MASHAV (the development cooperation agency of Israel's Ministry of Foreign Affairs), for a technological education project, the first step to a reimbursable cooperation of about USD 100 million (docs/calibration/README.md R18, a signed governmental instrument of cooperation, one event per instrument). |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Ministry of Foreign Affairs of the Dominican Republic signed with Israel's development cooperation agency (MASHAV) an agreement on technological education. |
| Summary (FR) | Le ministère des Affaires étrangères de la République dominicaine a signé avec l'agence israélienne de coopération (MASHAV) un accord sur l'enseignement technologique. |
| Second reading | agree, 2026-10-06; the notes mention a flag |

Evidence 1: `src_20241031_mirex_tratado-mashav-industria-4` (official, Ministerio de Relaciones Exteriores de la República Dominicana (MIREX), treaties database, 2024-10-31), locator **line 173**, language `es`.
Wayback: <https://web.archive.org/web/20261006005740id_/https://mirex.gob.do/tratados/acuerdo-entre-el-ministerio-de-relaciones-exteriores-de-republica-dominicana-mirex-y-la-agencia-de-cooperacion-internacional-para-el-desarrollo-del-ministerio-de-relaciones-exteriores-del-estado-de/>

Quote:

> ACUERDO ENTRE EL MINISTERIO DE RELACIONES EXTERIORES DE REPÚBLICA DOMINICANA (MIREX) Y LA AGENCIA DE COOPERACIÓN INTERNACIONAL PARA EL DESARROLLO DEL MINISTERIO DE RELACIONES EXTERIORES DEL ESTADO DE ISRAEL (MASHV) PARA EL PROYECTO DE EDUCACIÓN SUPERIOR TECNOLÓGIA PARA LA INDUSTRIA 4.0.

Translation in the record:

> AGREEMENT BETWEEN THE MINISTRY OF FOREIGN AFFAIRS OF THE DOMINICAN REPUBLIC (MIREX) AND THE INTERNATIONAL DEVELOPMENT COOPERATION AGENCY OF THE MINISTRY OF FOREIGN AFFAIRS OF THE STATE OF ISRAEL (MASHAV) FOR THE TECHNOLOGICAL HIGHER EDUCATION PROJECT FOR INDUSTRY 4.0.

Mechanical check: found at line 173, starting within the locator (line 173). Archived text at line 173 of `archive/text/src_20241031_mirex_tratado-mashav-industria-4.txt`:

> ACUERDO ENTRE EL MINISTERIO DE RELACIONES EXTERIORES DE REPÚBLICA DOMINICANA (MIREX) Y LA AGENCIA DE COOPERACIÓN INTERNACIONAL PARA EL DESARROLLO DEL MINISTERIO DE RELACIONES EXTERIORES DEL ESTADO DE ISRAEL (MASHV) PARA EL PROYECTO DE EDUCACIÓN SUPERIOR TECNOLÓGIA PARA LA INDUSTRIA 4.0.

Evidence 2: `src_20241031_mirex_tratado-mashav-industria-4` (official, Ministerio de Relaciones Exteriores de la República Dominicana (MIREX), treaties database, 2024-10-31), locator **line 179**, language `es`.
Wayback: <https://web.archive.org/web/20261006005740id_/https://mirex.gob.do/tratados/acuerdo-entre-el-ministerio-de-relaciones-exteriores-de-republica-dominicana-mirex-y-la-agencia-de-cooperacion-internacional-para-el-desarrollo-del-ministerio-de-relaciones-exteriores-del-estado-de/>

Quote:

> Por el Ministerio de Relaciones Exteriores de República Dominicana, Roberto Álvarez, Ministro y Por la Agencia de Cooperación Internacional para el Desarrollo del Ministerio de Relaciones Exteriores del Estado de Israel (MASHAV), Raslan Abu Rukun, Embajador Extraordinario y Plenipotenciario del Estado de Israel en República Dominicana

Translation in the record:

> For the Ministry of Foreign Affairs of the Dominican Republic, Roberto Álvarez, Minister, and for the International Development Cooperation Agency of the Ministry of Foreign Affairs of the State of Israel (MASHAV), Raslan Abu Rukun, Ambassador Extraordinary and Plenipotentiary of the State of Israel in the Dominican Republic

Mechanical check: found at line 179, starting within the locator (line 179). Archived text at line 179 of `archive/text/src_20241031_mirex_tratado-mashav-industria-4.txt`:

> Por el Ministerio de Relaciones Exteriores de República Dominicana, Roberto Álvarez, Ministro y Por la Agencia de Cooperación Internacional para el Desarrollo del Ministerio de Relaciones Exteriores del Estado de Israel (MASHAV), Raslan Abu Rukun, Embajador Extraordinario y Plenipotenciario del Estado de Israel en República Dominicana

Evidence 3: `src_20241102_mirex_acuerdo-mashav-educacion` (official, Ministerio de Relaciones Exteriores de la República Dominicana (MIREX), 2024-11-02), locator **line 176**, language `es`.
Wayback: <https://web.archive.org/web/20261006005724id_/https://mirex.gob.do/mirex-firma-acuerdo-de-cooperacion-en-materia-de-educacion-superior-tecnologica-con-israel/>

Quote:

> El Ministerio de Relaciones Exteriores (MIREX) firmó un acuerdo de cooperación con la Agencia de Cooperación Internacional para el Desarrollo del Ministerio de Relaciones Exteriores del Estado de Israel (MASHAV)

Translation in the record:

> The Ministry of Foreign Affairs (MIREX) signed a cooperation agreement with the International Development Cooperation Agency of the Ministry of Foreign Affairs of the State of Israel (MASHAV)

Mechanical check: found at line 176, starting within the locator (line 176). Archived text at line 176 of `archive/text/src_20241102_mirex_acuerdo-mashav-educacion.txt`:

> Santo Domingo de Guzmán, República Dominicana. – El Ministerio de Relaciones Exteriores (MIREX) firmó un acuerdo de cooperación con la Agencia de Cooperación Internacional para el Desarrollo del Ministerio de Relaciones Exteriores del Estado de Israel (MASHAV) para la implementación del “Proyecto de Educación Tecnológica para la Industria 4.0” en República Dominicana.

Evidence 4: `src_20241102_mirex_acuerdo-mashav-educacion` (official, Ministerio de Relaciones Exteriores de la República Dominicana (MIREX), 2024-11-02), locator **line 177**, language `es`.
Wayback: <https://web.archive.org/web/20261006005724id_/https://mirex.gob.do/mirex-firma-acuerdo-de-cooperacion-en-materia-de-educacion-superior-tecnologica-con-israel/>

Quote:

> constituye el primer paso para que República Dominicana acceda a una cooperación reembolsable de aproximadamente cien millones de dólares

Translation in the record:

> it is the first step for the Dominican Republic to access a reimbursable cooperation of about one hundred million dollars

Mechanical check: found at line 177, starting within the locator (line 177). Archived text at line 177 of `archive/text/src_20241102_mirex_acuerdo-mashav-educacion.txt`:

> … técnico profesional a la vanguardia de la tecnología, a través de la innovación y actualización de los centros de formación técnico profesional. Además, constituye el primer paso para que República Dominicana acceda a una cooperación reembolsable de aproximadamente cien millones de dólares, orientada al desarrollo del referido proyecto.

### Algeria (DZA)

#### evt_2026_08_27_DZA_B9

- [ ] Checked (62 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2026-08-27 |
| Speaker or actor | Minister of Foreign Affairs / Ministre des Affaires étrangères |
| Tier (points) | +5: Specific violations named (+5): at the OIC Council of Foreign Ministers' urgent extraordinary meeting the Minister of Foreign Affairs said the Israeli occupation authorities had refused to implement the second phase of the Gaza ceasefire agreement and persisted in a policy of intimidation, killing, starvation and collective punishment against the Palestinian people, the catastrophe in Gaza being the product of a systematic will to destroy the foundations of life. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister of Foreign Affairs told the OIC Council of Foreign Ministers that the Israeli authorities pursued a policy of starvation and collective punishment against Palestinians, citing Gaza. |
| Summary (FR) | Le ministre des Affaires étrangères a déclaré aux ministres de l'OCI que les autorités israéliennes menaient une politique de famine et de punition collective contre les Palestiniens, citant Gaza. |
| Second reading | agree, 2026-09-29 |

Evidence 1: `src_20260827_mfa-dz_fm-oic-cfm-extraordinary` (official, Ministry of Foreign Affairs of Algeria (وزارة الشؤون الخارجية), 2026-08-27), locator **line 9**, language `ar`.
Wayback: <https://web.archive.org/web/20260929204853id_/https://www.mfa.gov.dz/ar/press-and-information/statements/speech-delivered-by-he-mr-ahmed-attaf-during-his-participation-at-the-urgent-extraordinary-meeting-of-the-council-of-foreign-ministers-of-the-member-states-of-the-organisation-of-islamic-cooperation-2026-08-27>

Quote:

> وإصرارها على مواصلة سياسة الترهيب والتقتيل والتجويع والعقاب الجماعي، ضد الشعب الفلسطيني

Translation in the record:

> and their insistence on pursuing the policy of intimidation, killing, starvation and collective punishment against the Palestinian people

Mechanical check: found at line 9, starting within the locator (line 9). Archived text at line 9 of `archive/text/src_20260827_mfa-dz_fm-oic-cfm-extraordinary.txt`:

> … اصطدم بتعنت سلطات الاحتلال الإسرائيلي ورفضها، على عادتها، الوفاء بالتزاماتها وتعهداتها في تنفيذ المرحلة الثانية من اتفاقٍ أُبْرِمَ بعد جهود دبلوماسية مضنية، وإصرارها على مواصلة سياسة الترهيب والتقتيل والتجويع والعقاب الجماعي، ضد الشعب الفلسطيني.

Evidence 2: `src_20260827_mfa-dz_fm-oic-cfm-extraordinary` (official, Ministry of Foreign Affairs of Algeria (وزارة الشؤون الخارجية), 2026-08-27), locator **line 6**, language `ar`.
Wayback: <https://web.archive.org/web/20260929204853id_/https://www.mfa.gov.dz/ar/press-and-information/statements/speech-delivered-by-he-mr-ahmed-attaf-during-his-participation-at-the-urgent-extraordinary-meeting-of-the-council-of-foreign-ministers-of-the-member-states-of-the-organisation-of-islamic-cooperation-2026-08-27>

Quote:

> ومع استمرار مأساةٍ إنسانيةٍ كارثيةٍ بغزة

Translation in the record:

> and with the continuation of a catastrophic humanitarian tragedy in Gaza

Mechanical check: found at line 6, starting within the locator (line 6). Archived text at line 6 of `archive/text/src_20260827_mfa-dz_fm-oic-cfm-extraordinary.txt`:

> ينعقد اجتماعنا اليوم، والأوضاع في فلسطين المحتلة، خطيرةٌ وتزداد خطورة، على وقع انتهاكات يومية بالضفة الغربية والقدس الشريف، ومع استمرار مأساةٍ إنسانيةٍ كارثيةٍ بغزة، بلغت من الفظاعة مَبْلَغاً، قلَّ نظيره في تاريخ الإنسانية المعاصر.

#### evt_2024_09_30_DZA_B9

- [ ] Checked (63 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2024-09-30 |
| Speaker or actor | Minister of Foreign Affairs / Ministre des Affaires étrangères |
| Tier (points) | +5: Legal characterisation (+5): in the General Assembly's general debate the Minister of Foreign Affairs spoke of the ongoing genocidal war in Gaza and called on the international community to put an end to the hell inflicted on the Palestinian and Lebanese peoples. The quote is the UN's English rendering of a statement made in Arabic; the Ministry's site carries the video only (docs/10 B-417). |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister of Foreign Affairs told the General Assembly that a war of genocide had been waged in Gaza for almost a year. |
| Summary (FR) | Le ministre des Affaires étrangères a déclaré à l'Assemblée générale qu'une guerre de génocide était menée à Gaza depuis près d'un an. |
| Second reading | agree, 2026-09-29 |

Evidence 1: `src_20240930_undocs_a-79-pv-17` (official, United Nations General Assembly, 2024-09-30), locator **line 1041**, language `en`.
Wayback: <https://web.archive.org/web/20260929202205id_/https://documents.un.org/doc/undoc/gen/n24/277/58/pdf/n2427758.pdf>

Quote:

> The ongoing genocidal war in Gaza, which has raged for almost a whole year,

Mechanical check: found at line 1041, starting within the locator (line 1041). Archived text at line 1041 of `archive/text/src_20240930_undocs_a-79-pv-17.txt`:

> The ongoing genocidal war in Gaza, which has raged for almost a whole year,

Evidence 2: `src_20240930_undocs_a-79-pv-17` (official, United Nations General Assembly, 2024-09-30), locator **line 1047**, language `en`.
Wayback: <https://web.archive.org/web/20260929202205id_/https://documents.un.org/doc/undoc/gen/n24/277/58/pdf/n2427758.pdf>

Quote:

> The international community today should hasten to put an end to the hell inflicted on the Palestinian and Lebanese peoples

Mechanical check: found at lines 1047–1048, starting within the locator (line 1047). Archived text at lines 1047–1048 of `archive/text/src_20240930_undocs_a-79-pv-17.txt`:

> Charter of the United Nations. The international community today should hasten to put an end to the hell inflicted on the Palestinian and Lebanese peoples and to rein in

### Ecuador (ECU)

#### evt_2026_08_05_ECU_C2_2

- [ ] Checked (64 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | C2, standing |
| Date | 2026-08-05 |
| Speaker or actor | Government of Ecuador / Gouvernement de l'Équateur |
| Tier (points) | −10: C2 (-10): a joint declaration setting up an Expanded Economic Dialogue between Ecuador and Israel, a mechanism for cooperation on trade, investment, cybersecurity, innovation and technology, signed in Quito on the visit of Israel's Foreign Minister (docs/calibration/README.md R18: a joint declaration setting up a cooperation mechanism, one event per instrument). |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Government of Ecuador signed with Israel a joint declaration setting up an Expanded Economic Dialogue on trade, investment, cybersecurity, innovation and technology. |
| Summary (FR) | Le gouvernement de l'Équateur a signé avec Israël une déclaration commune instituant un dialogue économique élargi sur le commerce, l'investissement, la cybersécurité et l'innovation. |
| Second reading | agree, 2026-10-06; the notes mention a flag |

Evidence 1: `src_20260805_cancilleria_noboa-saar-instrumentos` (official, Ministerio de Relaciones Exteriores y Movilidad Humana del Ecuador, 2026-08-05), locator **line 3**, language `es`.
Wayback: <https://web.archive.org/web/20261006005402id_/https://www.cancilleria.gob.ec/2026/08/05/el-presidente-noboa-y-el-ministro-de-relaciones-exteriores-de-israel-gideon-saar-dialogaron-sobre-la-cooperacion-para-luchar-contra-el-terrorismo-y-el-desarrollo-economico/>

Quote:

> Y el segundo acuerdo que se firmó hoy se trata de una declaración conjunta del Diálogo Económico Ampliado, un mecanismo que impulsará la cooperación en comercio, inversión, ciberseguridad, innovación y tecnología.

Translation in the record:

> And the second agreement signed today is a joint declaration of the Expanded Economic Dialogue, a mechanism that will promote cooperation in trade, investment, cybersecurity, innovation and technology.

Mechanical check: found at line 3, starting within the locator (line 3). Archived text at line 3 of `archive/text/src_20260805_cancilleria_noboa-saar-instrumentos.txt`:

> Y el segundo acuerdo que se firmó hoy se trata de una declaración conjunta del Diálogo Económico Ampliado, un mecanismo que impulsará la cooperación en comercio, inversión, ciberseguridad, innovación y tecnología.

Evidence 2: `src_20260805_swissinfo_ecuador-israel-negociacion-tlc` (press, SWI swissinfo.ch (EFE wire), 2026-08-05), locator **line 180**, language `es`.
Wayback: <https://web.archive.org/web/20261006035818id_/https://www.swissinfo.ch/spa/ecuador-e-israel-iniciar%C3%A1n-pr%C3%B3ximamente-negociaciones-para-un-acuerdo-de-libre-comercio/91852925>

Quote:

> Ecuador e Israel iniciarán próximamente las negociaciones para suscribir un acuerdo de libre comercio, según acordaron este miércoles, en Quito

Translation in the record:

> Ecuador and Israel will soon begin negotiations to sign a free trade agreement, as they agreed on Wednesday in Quito

Mechanical check: found at line 180, starting within the locator (line 180). Archived text at line 180 of `archive/text/src_20260805_swissinfo_ecuador-israel-negociacion-tlc.txt`:

> Guayaquil (Ecuador), 5 ago (EFE).- Ecuador e Israel iniciarán próximamente las negociaciones para suscribir un acuerdo de libre comercio, según acordaron este miércoles, en Quito, el ministro de Relaciones Exteriores ecuatoriano, Roberto Kury y su homólogo israelí, Gideon Sa’ar.

### Egypt (EGY)

#### evt_2023_11_23_EGY_B9

- [ ] Checked (65 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2023-11-23 |
| Speaker or actor | President of the Arab Republic of Egypt / Président de la République arabe d'Égypte |
| Tier (points) | +2: Formal call for a ceasefire (+2): the President restates the need for an immediate ceasefire; the address names no specific violation. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The President restated at the "Long Live Egypt, Long Live Palestine" event the need for an immediate ceasefire in Gaza. |
| Summary (FR) | Le président a réaffirmé lors de l'événement « Vive l'Égypte, vive la Palestine » la nécessité d'un cessez-le-feu immédiat à Gaza. |
| Second reading | agree, 2026-09-28 |

Evidence 1: `src_20231123_presidency-eg_long-live-egypt-palestine` (official, Presidency of the Arab Republic of Egypt, 2023-11-23), locator **line 20**, language `en`.
Wayback: <https://web.archive.org/web/20240516215250id_/https://www.presidency.eg/en/%D8%A7%D9%84%D8%B1%D8%A6%D8%A7%D8%B3%D8%A9/%D8%AE%D8%B7%D8%A8-%D8%A7%D9%84%D8%B1%D8%A6%D9%8A%D8%B3/speeches23112023/>

Quote:

> We have reiterated the imperative need for an immediate ceasefire and a return to the negotiating table, in order to reach a just and comprehensive peace, based on the acknowledgment of the legitimate rights of the brotherly Palestinian people, primarily the recognition of an Independent Palestinian State, with East Jerusalem as its capital.

Mechanical check: found at line 20, starting within the locator (line 20). Archived text at line 20 of `archive/text/src_20231123_presidency-eg_long-live-egypt-palestine.txt`:

> We have reiterated the imperative need for an immediate ceasefire and a return to the negotiating table, in order to reach a just and comprehensive peace, based on the acknowledgment of the legitimate rights of the brotherly Palestinian people, primarily the recognition of an Independent Palestinian State, with East Jerusalem as its capital.

#### evt_2026_08_21_EGY_B9

- [ ] Checked (66 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2026-08-21 |
| Speaker or actor | Minister of Foreign Affairs, Emigration and Egyptian Expatriates / Ministre des Affaires étrangères, de l'Émigration et des Égyptiens à l'étranger |
| Tier (points) | +5: Violations named (+5): the eight foreign ministers condemn settler violence against Palestinians and their property, with the support of the Israeli authorities, as violations of international law, and reject the E1 settlement plan. Scoped west-bank: tracked, not scored in v1 (D-14, docs/10 B-32). |
| Confidence | confirmed |
| Scope | west-bank |
| Summary (EN) | The Minister of Foreign Affairs and seven counterparts rejected the E1 settlement plan and called settler violence against Palestinians a violation of international law. |
| Summary (FR) | Le ministre des Affaires étrangères et sept homologues ont rejeté le plan de colonisation E1 et qualifié les violences de colons contre les Palestiniens de violations du droit international. |
| Second reading | agree, 2026-11-09 |

Evidence 1: `src_20260821_mfa-tr_eight-ministers-e1-settlement` (official, Ministry of Foreign Affairs of the Republic of Türkiye, 2026-08-21), locator **line 2**, language `en`.
Wayback: <https://web.archive.org/web/20261109031309id_/https://www.mfa.gov.tr/joint-statement-by-the-foreign-ministers-of-turkiye--egypt--indonesia--jordan--pakistan--qatar--saudi-arabia-and-uae--21-august-2026.en.mfa>

Quote:

> They stress that such acts in no way diminish the inalienable rights of the Palestinian people and constitute violations of international law and relevant United Nations resolutions

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20260821_mfa-tr_eight-ministers-e1-settlement.txt`:

> … and acts of violence perpetrated by settlers, with the support of the Israeli occupying authorities, against the Palestinian people and their property. They stress that such acts in no way diminish the inalienable rights of the Palestinian people and constitute violations of international law and relevant United Nations resolutions, while posing a serious threat to regional and international peace and security.

Evidence 2: `src_20260821_mfa-tr_eight-ministers-e1-settlement` (official, Ministry of Foreign Affairs of the Republic of Türkiye, 2026-08-21), locator **line 2**, language `en`.
Wayback: <https://web.archive.org/web/20261109031309id_/https://www.mfa.gov.tr/joint-statement-by-the-foreign-ministers-of-turkiye--egypt--indonesia--jordan--pakistan--qatar--saudi-arabia-and-uae--21-august-2026.en.mfa>

Quote:

> The Foreign Ministers of the Republic of Türkiye, the Arab Republic of Egypt

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20260821_mfa-tr_eight-ministers-e1-settlement.txt`:

> The Foreign Ministers of the Republic of Türkiye, the Arab Republic of Egypt, the Republic of Indonesia, the Hashemite Kingdom of Jordan, the Islamic Republic of Pakistan, the State of Qatar, the Kingdom of Saudi Arabia and the United …

#### evt_2026_10_10_EGY_B9

- [ ] Checked (67 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2026-10-10 |
| Speaker or actor | President of the Arab Republic of Egypt / Président de la République arabe d'Égypte |
| Tier (points) | +2: Formal call to end restrictions on humanitarian access (+2): the President states the necessity of ensuring the full and sustainable delivery of humanitarian aid into the Gaza Strip and rejects any attempt to forcibly displace the Palestinian people; no act is named as a violation. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The President said at a press conference with Malaysia's Prime Minister that the full delivery of humanitarian aid into Gaza must be ensured. |
| Summary (FR) | Le président a déclaré, lors d'une conférence de presse avec le Premier ministre malaisien, que l'acheminement intégral de l'aide humanitaire à Gaza devait être garanti. |
| Second reading | agree, 2026-11-09 |

Evidence 1: `src_20261010_sis_sisi-press-conference-malaysia` (official, State Information Service (Egypt), 2026-10-10), locator **line 16**, language `en`.
Wayback: <https://web.archive.org/web/20261109025902id_/https://sis.gov.eg/en/presidency/speeches-telegrams-posts/president-el-sisis-speech-at-joint-press-conference-with-prime-minister-of-malaysia-anwar-ibrahim/>

Quote:

> In the same context, I reaffirm the necessity of ensuring the full and sustainable delivery of humanitarian aid into the Gaza Strip.

Mechanical check: found at line 16, starting within the locator (line 16). Archived text at line 16 of `archive/text/src_20261010_sis_sisi-press-conference-malaysia.txt`:

> In the same context, I reaffirm the necessity of ensuring the full and sustainable delivery of humanitarian aid into the Gaza Strip. Egypt reiterates its categorical rejection of any attempts to forcibly displace the Palestinian people, alter the demographic composition of Palestinian …

#### evt_2026_10_05_EGY_B9

- [ ] Checked (68 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2026-10-05 |
| Speaker or actor | President of the Arab Republic of Egypt / Président de la République arabe d'Égypte |
| Tier (points) | +2: Formal call for a ceasefire (+2): the President calls for the full implementation of the ceasefire plan for the Gaza Strip and rejects any attempt to displace the Palestinian people; no act is named as a violation (ceasefire-implementation call tier, docs/10 B-335). |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The President called for the full implementation of the ceasefire plan for the Gaza Strip and rejected any displacement of the Palestinian people. |
| Summary (FR) | Le président a appelé à la mise en œuvre intégrale du plan de cessez-le-feu pour la bande de Gaza et rejeté tout déplacement du peuple palestinien. |
| Second reading | agree, 2026-11-09 |

Evidence 1: `src_20261005_sis_sisi-october-war-anniversary` (official, State Information Service (Egypt), 2026-10-05), locator **line 32**, language `en`.
Wayback: <https://web.archive.org/web/20261109025759id_/https://sis.gov.eg/en/presidency/speeches-telegrams-posts/president-el-sisi-s-speech-marking-the-53rd-anniversary-of-october-war-victory/>

Quote:

> I also emphasize the imperative of the full implementation of U.S. President Donald Trump’s plan for a ceasefire in the Gaza Strip, cautioning against any effort to circumvent or disregard its execution.

Mechanical check: found at line 32, starting within the locator (line 32). Archived text at line 32 of `archive/text/src_20261005_sis_sisi-october-war-anniversary.txt`:

> I also emphasize the imperative of the full implementation of U.S. President Donald Trump’s plan for a ceasefire in the Gaza Strip, cautioning against any effort to circumvent or disregard its execution.

Evidence 2: `src_20261005_sis_sisi-october-war-anniversary` (official, State Information Service (Egypt), 2026-10-05), locator **line 31**, language `en`.
Wayback: <https://web.archive.org/web/20261109025759id_/https://sis.gov.eg/en/presidency/speeches-telegrams-posts/president-el-sisi-s-speech-marking-the-53rd-anniversary-of-october-war-victory/>

Quote:

> In this context, I reaffirm our categorical rejection of any attempts aimed at displacing the Palestinian people from their land.

Mechanical check: found at line 31, starting within the locator (line 31). Archived text at line 31 of `archive/text/src_20261005_sis_sisi-october-war-anniversary.txt`:

> In this context, I reaffirm our categorical rejection of any attempts aimed at displacing the Palestinian people from their land.

### Spain (ESP)

#### evt_2024_06_06_ESP_B9

- [ ] Checked (69 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2024-06-06 |
| Speaker or actor | President of the Government / Président du gouvernement |
| Tier (points) | +2: Formal call for a ceasefire (+2): the joint statement of the leaders of seventeen states fully supports the move towards a ceasefire and a hostage-release agreement and says it is time for the war to end; it names no specific violation. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The President of the Government joined sixteen other leaders in supporting a ceasefire and hostage-release agreement for Gaza and in stating that it was time for the war to end. |
| Summary (FR) | Le président du gouvernement s'est joint à seize autres dirigeants pour soutenir un cessez-le-feu et un accord de libération des otages à Gaza et déclarer qu'il était temps que la guerre prenne fin. |
| Second reading | agree, 2026-09-30 |

Evidence 1: `src_20240606_govinfo_dcpd-202400492` (official, Office of the Federal Register (Daily Compilation of Presidential Documents), 2024-06-06), locator **line 3**, language `en`.
Wayback: <https://web.archive.org/web/20260930010538id_/https://www.govinfo.gov/content/pkg/DCPD-202400492/html/DCPD-202400492.htm>

Quote:

> we fully support the movement towards a ceasefire and hostage release deal now on the table and as outlined by President Biden on May 31, 2024.

Mechanical check: found at line 3, starting within the locator (line 3). Archived text at line 3 of `archive/text/src_20240606_govinfo_dcpd-202400492.txt`:

> As leaders of countries deeply concerned for the hostages held by Hamas in Gaza, including many of our own citizens, we fully support the movement towards a ceasefire and hostage release deal now on the table and as outlined by President Biden on May 31, 2024. There is no time to lose. We call on Hamas to close this agreement, that Israel is ready to move forward with, and begin the process of releasing our citizens.

Evidence 2: `src_20240606_govinfo_dcpd-202400492` (official, Office of the Federal Register (Daily Compilation of Presidential Documents), 2024-06-06), locator **line 4**, language `en`.
Wayback: <https://web.archive.org/web/20260930010538id_/https://www.govinfo.gov/content/pkg/DCPD-202400492/html/DCPD-202400492.htm>

Quote:

> It is time for the war to end and this deal is the necessary starting point.

Mechanical check: found at line 4, starting within the locator (line 4). Archived text at line 4 of `archive/text/src_20240606_govinfo_dcpd-202400492.txt`:

> … this deal and bring relief to the families of our hostages, as well as those on both sides of this terrible conflict, including the civilian populations. It is time for the war to end and this deal is the necessary starting point.

Evidence 3: `src_20240606_govinfo_dcpd-202400492` (official, Office of the Federal Register (Daily Compilation of Presidential Documents), 2024-06-06), locator **line 6**, language `en`.
Wayback: <https://web.archive.org/web/20260930010538id_/https://www.govinfo.gov/content/pkg/DCPD-202400492/html/DCPD-202400492.htm>

Quote:

> Categories: Joint Statements : Argentina, Austria, Brazil, Bulgaria, Canada, Colombia, Denmark, France, Germany, Poland, Portugal, Romania, Serbia, Spain

Mechanical check: found at line 6, starting within the locator (line 6). Archived text at line 6 of `archive/text/src_20240606_govinfo_dcpd-202400492.txt`:

> Categories: Joint Statements : Argentina, Austria, Brazil, Bulgaria, Canada, Colombia, Denmark, France, Germany, Poland, Portugal, Romania, Serbia, Spain, Thailand, and United Kingdom, situation in Gaza, Palestinian Territories.

#### evt_2025_05_20_ESP_C1

- [ ] Checked (70 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | C1, standing |
| Date | 2025-05-20 |
| Speaker or actor | Government of Spain / Gouvernement de l'Espagne |
| Tier (points) | +4: Review tier (+4): the EU launched a review of Israel's compliance with Article 2 of the Association Agreement, a review Spain had requested; no suspension was adopted. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The government supported the review of the EU–Israel Association Agreement launched by the Foreign Affairs Council on 20 May 2025, after requesting it since February 2024. |
| Summary (FR) | Le gouvernement a soutenu le réexamen de l'accord d'association UE–Israël lancé par le Conseil des affaires étrangères le 20 mai 2025, qu'il demandait depuis février 2024. |
| Second reading | agree, 2026-09-28 |

Evidence 1: `src_20250520_eeas_fac-press-remarks-kallas` (official, European External Action Service, 2025-05-20), locator **line 13**, language `en`.
Wayback: <https://web.archive.org/web/20260928124548id_/https://www.eeas.europa.eu/eeas/foreign-affairs-council-press-remarks-high-representative-kaja-kallas-after-meeting-2_en>

Quote:

> It is clear from today's discussion that there is a strong majority in favour of [the] review of Article 2 of our Association Agreement with Israel. So, we will launch this exercise

Mechanical check: found at line 13, starting within the locator (line 13). Archived text at line 13 of `archive/text/src_20250520_eeas_fac-press-remarks-kallas.txt`:

> It is clear from today's discussion that there is a strong majority in favour of [the] review of Article 2 of our Association Agreement with Israel. So, we will launch this exercise and, in the meantime, it is up to Israel to unblock the humanitarian aid. Saving lives must be our top priority.

Evidence 2: `src_20241128_congreso_acta-taquigrafica-pleno` (official, Congreso de los Diputados, 2024-11-28), locator **lines 824–826**, language `es`.
Wayback: <https://web.archive.org/web/20260928124713id_/https://www.congreso.es/docu/tramit/LegXV/AT/ATCD_15_PL_20241128.pdf>

Quote:

> España ha solicitado reiteradamente a la Comisión Europea la revisión del Acuerdo de Asociación Unión Europea-Israel a la luz de la situación de los derechos humanos en Gaza.

Translation in the record:

> Spain has repeatedly asked the European Commission to review the EU–Israel Association Agreement in the light of the human rights situation in Gaza.

Mechanical check: found at lines 824–826, starting within the locator (lines 824–826). Archived text at lines 824–826 of `archive/text/src_20241128_congreso_acta-taquigrafica-pleno.txt`:

> permita el retorno de los refugiados palestinos. España ha solicitado reiteradamente a la Comisión Europea la revisión del Acuerdo de Asociación Unión Europea-Israel a la luz de la situación de los derechos humanos en Gaza. El pasado 13 de noviembre, mi

Evidence 3: `src_20240214_lamoncloa_carta-sanchez-varadkar` (official, La Moncloa, Presidencia del Gobierno, 2024-02-14), locator **line 49**, language `es`.
Wayback: <https://web.archive.org/web/20260928123557id_/https://www.lamoncloa.gob.es/presidente/actividades/Paginas/2024/140224-carta-comision-europea-sanchez-varadkar.aspx>

Quote:

> Ante la situación insostenible en Gaza y con el riesgo de una catástrofe humanitaria aún mayor por la ampliación de la operación militar israelí sobre Rafah, el presidente del Gobierno de España y el primer ministro de Irlanda piden por carta a la Comisión Europea una evaluación urgente del Acuerdo de Asociación UE/Israel para que investigue si se están cumpliendo los puntos esenciales de la relación en materia de derechos humanos y principios democráticos.

Translation in the record:

> In view of the unsustainable situation in Gaza and the risk of an even greater humanitarian catastrophe from the extension of the Israeli military operation to Rafah, the President of the Government of Spain and the Prime Minister of Ireland ask the European Commission by letter for an urgent assessment of the EU/Israel Association Agreement to investigate whether the essential elements of the relationship on human rights and democratic principles are being complied with.

Mechanical check: found at line 49, starting within the locator (line 49). Archived text at line 49 of `archive/text/src_20240214_lamoncloa_carta-sanchez-varadkar.txt`:

> Ante la situación insostenible en Gaza y con el riesgo de una catástrofe humanitaria aún mayor por la ampliación de la operación militar israelí sobre Rafah, el presidente del Gobierno de España y el primer ministro de Irlanda piden por carta a la Comisión Europea una evaluación urgente del Acuerdo de Asociación UE/Israel para que investigue si se están cumpliendo los puntos esenciales de la relación en materia de derechos humanos y principios democráticos.

Evidence 4: `src_20250909_lamoncloa_rueda-prensa-transcripcion` (official, La Moncloa, Consejo de Ministros, 2025-09-09), locator **lines 239–242**, language `es`.
Wayback: <https://web.archive.org/web/20260612014129id_/https://www.lamoncloa.gob.es/consejodeministros/ruedas/Documents/2025/20250909TrancripcionRdPCMin.pdf>

Quote:

> toda una batería de acciones urgentes para detener esta catástrofe humanitaria en Gaza, incluyendo la suspensión inmediata del acuerdo de asociación Unión Europea-Israel en base a la violación del artículo 2 que habla del respeto de los derechos humanos.

Translation in the record:

> a whole battery of urgent actions to stop this humanitarian catastrophe in Gaza, including the immediate suspension of the EU–Israel Association Agreement on the basis of the violation of Article 2, which concerns respect for human rights.

Mechanical check: found at lines 239–242, starting within the locator (lines 239–242). Archived text at lines 239–242 of `archive/text/src_20250909_lamoncloa_rueda-prensa-transcripcion.txt`:

> Exteriores de Copenhague los días 29 y 30 de agosto, toda una batería de acciones urgentes para detener esta catástrofe humanitaria en Gaza, incluyendo la suspensión inmediata del acuerdo de asociación Unión Europea-Israel en base a la violación del artículo 2 que habla del respeto de los derechos humanos.

#### evt_2026_02_24_ESP_B9

- [ ] Checked (71 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2026-02-24 |
| Speaker or actor | Minister of Foreign Affairs, European Union and Cooperation / Ministre des Affaires étrangères, de l'Union européenne et de la Coopération |
| Tier (points) | +5: Uses a legal characterisation (+5): the settlements as a violation of international law. West Bank conduct, tagged and unscored in v1 (docs/10 B-32). |
| Confidence | confirmed |
| Scope | west-bank |
| Summary (EN) | The Minister of Foreign Affairs signed a joint statement that calls Israel's settlements a violation of international law. |
| Summary (FR) | Le ministre des Affaires étrangères a signé une déclaration commune qui qualifie les colonies d'Israël de violation du droit international. |
| Second reading | agree, 2026-09-30 |

Evidence 1: `src_20260224_um_joint-statement-west-bank` (official, Udenrigsministeriet (Ministry of Foreign Affairs of Denmark), press room on via.ritzau.dk, 2026-02-24), locator **line 2**, language `en`.
Wayback: <https://web.archive.org/web/20260928221628id_/https://via.ritzau.dk/pressemeddelelse/14806013/joint-statement?publisherId=2012662&lang=da>

Quote:

> We are clear that Israel’s illegal settlements, and decisions designed to further them, are a flagrant violation of international law, including previous United Nations Security Council Resolutions and the 2024 Advisory Opinion of the International Court of Justice.

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20260224_um_joint-statement-west-bank.txt`:

> We are clear that Israel’s illegal settlements, and decisions designed to further them, are a flagrant violation of international law, including previous United Nations Security Council Resolutions and the 2024 Advisory Opinion of the International Court of Justice. These latest decisions are part of a clear trajectory that aims to change the reality on the ground and to advance unacceptable de facto annexation. They also …

Evidence 2: `src_20260224_um_joint-statement-west-bank` (official, Udenrigsministeriet (Ministry of Foreign Affairs of Denmark), press room on via.ritzau.dk, 2026-02-24), locator **line 1**, language `en`.
Wayback: <https://web.archive.org/web/20260928221628id_/https://via.ritzau.dk/pressemeddelelse/14806013/joint-statement?publisherId=2012662&lang=da>

Quote:

> We, the Foreign Ministers of the Federative Republic of Brazil, the French Republic, the Kingdom of Denmark, the Republic of Finland, the Republic of Iceland, the Republic of Indonesia, Ireland, the Arab Republic of Egypt, the Hashemite Kingdom of Jordan, the Grand Duchy of Luxembourg, the Kingdom of Norway, the State of Palestine, the Portuguese Republic, the State of Qatar, the Kingdom of Saudi Arabia, the Republic of Slovenia, the Kingdom of Spain

Mechanical check: found at line 1, starting within the locator (line 1). Archived text at line 1 of `archive/text/src_20260224_um_joint-statement-west-bank.txt`:

> We, the Foreign Ministers of the Federative Republic of Brazil, the French Republic, the Kingdom of Denmark, the Republic of Finland, the Republic of Iceland, the Republic of Indonesia, Ireland, the Arab Republic of Egypt, the Hashemite Kingdom of Jordan, the Grand Duchy of Luxembourg, the Kingdom of Norway, the State of Palestine, the Portuguese Republic, the State of Qatar, the Kingdom of Saudi Arabia, the Republic of Slovenia, the Kingdom of Spain, the Kingdom of Sweden, the Republic of Türkiye, and the Secretary Generals of the League of Arab States and the Organization of Islamic Cooperation, condemn …

#### evt_2024_07_24_ESP_D4

- [ ] Checked (72 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | D4, repeatable |
| Date | 2024-07-24 |
| Speaker or actor | Ministry of Health / Ministère de la Santé |
| Tier (points) | +5 |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Ministry of Health began a programme of medical evacuations of children from Gaza to Spanish hospitals, with 15 children and 27 relatives flown from Cairo on 24 July 2024. |
| Summary (FR) | Le ministère de la Santé a lancé un programme d'évacuations sanitaires d'enfants de Gaza vers des hôpitaux espagnols, avec 15 enfants et 27 proches transportés du Caire le 24 juillet 2024. |
| Second reading | agree, 2026-09-28 |

Evidence 1: `src_20240722_sanidad_menores-gazaties` (official, Ministerio de Sanidad, 2024-07-22), locator **line 4**, language `es`.
Wayback: <https://web.archive.org/web/20260616095400id_/https://www.sanidad.gob.es/gabinete/notasPrensa.do?id=6483>

Quote:

> El Cairo, 22 de julio de 2024.- Un total de 15 menores palestinos con problemas de salud graves derivados de los efectos de la ofensiva israelí sobre la Franja de Gaza y 27 familiares directos llegarán a Madrid este miércoles, 24 de julio, desde El Cairo para ser atendidos en diversos hospitales españoles.

Translation in the record:

> Cairo, 22 July 2024. A total of 15 Palestinian children with serious health problems resulting from the effects of the Israeli offensive on the Gaza Strip and 27 direct relatives will arrive in Madrid this Wednesday, 24 July, from Cairo to be treated in various Spanish hospitals.

Mechanical check: found at line 4, starting within the locator (line 4). Archived text at line 4 of `archive/text/src_20240722_sanidad_menores-gazaties.txt`:

> El Cairo, 22 de julio de 2024.- Un total de 15 menores palestinos con problemas de salud graves derivados de los efectos de la ofensiva israelí sobre la Franja de Gaza y 27 familiares directos llegarán a Madrid este miércoles, 24 de julio, desde El Cairo para ser atendidos en diversos hospitales españoles. En concreto, hay 13 menores heridos, una paciente oncológica y otra con una enfermedad crónica cardiaca

Evidence 2: `src_20251027_lamoncloa_quinta-evacuacion-menores` (official, La Moncloa, Ministerio de Sanidad, 2025-10-27), locator **line 15**, language `es`.
Wayback: <https://web.archive.org/web/20260928123352id_/https://www.lamoncloa.gob.es/serviciosdeprensa/notasprensa/sanidad14/paginas/2025/271025-garcia-menores-gazaties-hospital-.aspx>

Quote:

> Esta es la quinta evacuación humanitaria de este tipo organizada por España en el último año y medio, dentro del procedimiento de Evacuación Médica (MEDEVAC), activado por el ERCC, a través de la Dirección General de Protección Civil y Emergencias del Ministerio del Interior y de la OMS.

Translation in the record:

> This is the fifth humanitarian evacuation of this kind organised by Spain in the last year and a half, within the Medical Evacuation procedure (MEDEVAC), activated by the ERCC, through the Directorate-General for Civil Protection and Emergencies of the Ministry of the Interior and the WHO.

Mechanical check: found at line 15, starting within the locator (line 15). Archived text at line 15 of `archive/text/src_20251027_lamoncloa_quinta-evacuacion-menores.txt`:

> Esta es la quinta evacuación humanitaria de este tipo organizada por España en el último año y medio, dentro del procedimiento de Evacuación Médica (MEDEVAC), activado por el ERCC, a través de la Dirección General de Protección Civil y Emergencias del Ministerio del Interior y de la OMS.

### Estonia (EST)

#### evt_2024_07_15_EST_B11

- [ ] Checked (73 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B11, standing |
| Date | 2024-07-15 |
| Speaker or actor | — / — |
| Tier (points) | +5: Sanctions on settler entities (+5): the EU listing of 15 July 2024 (Decision (CFSP) 2024/1967) of five persons and three entities, among them Tzav 9 for blocking humanitarian aid trucks to Gaza, adopted by unanimity. Scoped gaza as the listing cites Gaza (docs/10 B-32; B-281 (2), as Norway's alignment, evt_2024_07_24_NOR_B11). |
| Confidence | confirmed |
| Scope | gaza, west-bank |
| Summary (EN) | The government agreed in the EU Council to sanctions on five Israeli settlers and activists and three entities, including a group blocking aid trucks bound for Gaza. |
| Summary (FR) | Le gouvernement a approuvé au Conseil de l'UE des sanctions contre cinq colons et militants israéliens et trois entités, dont un groupe bloquant les camions d'aide destinés à Gaza. |
| Second reading | agree, 2026-10-13 |

Evidence 1: `src_20240715_consilium_settlers-tzav9-sanctions` (official, Council of the European Union, 2024-07-15), locator **line 1**, language `en`.
Wayback: <https://web.archive.org/web/20240715172525id_/https://www.consilium.europa.eu/en/press/press-releases/2024/07/15/extremist-israeli-settlers-in-the-occupied-west-bank-and-east-jerusalem-as-well-as-violent-activists-blocking-humanitarian-aid-to-gaza-five-individuals-and-three-entities-sanctioned-under-the-eu-global-human-rights-sanctions-regime/>

Quote:

> Today the Council approved additional restrictive measures against five persons and three entities under the European Union's Global Human Rights Sanctions Regime. The listed individuals and entities are responsible for serious and systematic human rights abuses against Palestinians in the West Bank, including abuse of the right of everyone to enjoy the highest attainable standard of physical and mental integrity, the right to property, the right to private and family life, to freedom of religion or belief and the right to education.

Mechanical check: found at line 1, starting within the locator (line 1). Archived text at line 1 of `archive/text/src_20240715_consilium_settlers-tzav9-sanctions.txt`:

> Today the Council approved additional restrictive measures against five persons and three entities under the European Union's Global Human Rights Sanctions Regime. The listed individuals and entities are responsible for serious and systematic human rights abuses against Palestinians in the West Bank, including abuse of the right of everyone to enjoy the highest attainable standard of physical and mental integrity, the right to property, the right to private and family life, to freedom of religion or belief and the right to education.

Evidence 2: `src_20240715_consilium_settlers-tzav9-sanctions` (official, Council of the European Union, 2024-07-15), locator **line 4**, language `en`.
Wayback: <https://web.archive.org/web/20240715172525id_/https://www.consilium.europa.eu/en/press/press-releases/2024/07/15/extremist-israeli-settlers-in-the-occupied-west-bank-and-east-jerusalem-as-well-as-violent-activists-blocking-humanitarian-aid-to-gaza-five-individuals-and-three-entities-sanctioned-under-the-eu-global-human-rights-sanctions-regime/>

Quote:

> Today’s designations also include Tzav 9, an Israeli group of violent activists founded in January 2024, regularly blocking humanitarian aid trucks delivering food, water and fuel to Gaza. Tzav 9’s actions include violent protests, attacks against food trucks and the destruction of food.

Mechanical check: found at line 4, starting within the locator (line 4). Archived text at line 4 of `archive/text/src_20240715_consilium_settlers-tzav9-sanctions.txt`:

> Today’s designations also include Tzav 9, an Israeli group of violent activists founded in January 2024, regularly blocking humanitarian aid trucks delivering food, water and fuel to Gaza. Tzav 9’s actions include violent protests, attacks against food trucks and the destruction of food.

Evidence 3: `src_20240715_consilium_settlers-tzav9-sanctions` (official, Council of the European Union, 2024-07-15), locator **line 12**, language `en`.
Wayback: <https://web.archive.org/web/20240715172525id_/https://www.consilium.europa.eu/en/press/press-releases/2024/07/15/extremist-israeli-settlers-in-the-occupied-west-bank-and-east-jerusalem-as-well-as-violent-activists-blocking-humanitarian-aid-to-gaza-five-individuals-and-three-entities-sanctioned-under-the-eu-global-human-rights-sanctions-regime/>

Quote:

> Council Decision (CFSP) 2024/1967 of 15 July 2024 amending Decision (CFSP) 2020/1999 concerning restrictive measures against serious human rights violations and abuses (including the list of sanctioned individuals and entities)

Mechanical check: found at line 12, starting within the locator (line 12). Archived text at line 12 of `archive/text/src_20240715_consilium_settlers-tzav9-sanctions.txt`:

> Council Decision (CFSP) 2024/1967 of 15 July 2024 amending Decision (CFSP) 2020/1999 concerning restrictive measures against serious human rights violations and abuses (including the list of sanctioned individuals and entities)

Evidence 4: `src_20240715_eur-lex_cfsp-2024-1967` (official, Council of the European Union (Official Journal, EUR-Lex), 2024-07-15), locator **line 2**, language `en`.
Wayback: <https://web.archive.org/web/20240917211729id_/https://eur-lex.europa.eu/eli/dec/2024/1967>

Quote:

> the following entries are added to the list of natural and legal persons, entities and bodies under heading ‘A. Natural persons’:

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20240715_eur-lex_cfsp-2024-1967.txt`:

> the following entries are added to the list of natural and legal persons, entities and bodies under heading ‘A. Natural persons’:

### Ethiopia (ETH)

#### evt_2025_02_04_ETH_C2

- [ ] Checked (74 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | C2, standing |
| Date | 2025-02-04 |
| Speaker or actor | Minister of Water and Energy / Ministre de l'Eau et de l'Énergie |
| Tier (points) | −10: C2 (-10): a signed agreement between the Ethiopian Minister of Water and Energy and Israel's Minister of Energy and Infrastructure on cooperation in energy, water and innovation (docs/calibration/README.md R18: a signed governmental instrument of cooperation with Israel, one event per instrument). |
| Confidence | corroborated |
| Scope | gaza |
| Summary (EN) | The Minister of Water and Energy signed with Israel's Minister of Energy and Infrastructure an agreement on cooperation in water and energy. |
| Summary (FR) | Le ministre de l'Eau et de l'Énergie a signé avec le ministre israélien de l'Énergie et des Infrastructures un accord de coopération dans les domaines de l'eau et de l'énergie. |
| Second reading | agree, 2026-11-10; the notes mention a flag |

Evidence 1: `src_20250204_fana_ethiopia-israel-water-energy-agreement` (press, Fana Media Corporation (FMC), 2025-02-04), locator **line 32**, language `en`.
Wayback: <https://web.archive.org/web/20261110045648id_/https://www.fanamc.com/english/ethiopia-israel-sign-agreement-to-work-closely-in-water-and-energy-sector/>

Quote:

> Ethiopia and Israel today signed an agreement to work closely in the fields of water resources and energy development.

Mechanical check: found at line 32, starting within the locator (line 32). Archived text at line 32 of `archive/text/src_20250204_fana_ethiopia-israel-water-energy-agreement.txt`:

> Addis Ababa, February 4, 2025 (FMC) – Ethiopia and Israel today signed an agreement to work closely in the fields of water resources and energy development.

Evidence 2: `src_20250204_inn_israel-ethiopia-energy-water-agreement` (press, Israel National News (Arutz Sheva), 2025-02-04), locator **line 1**, language `en`.
Wayback: <https://web.archive.org/web/20261110045852id_/https://www.israelnationalnews.com/news/403404>

Quote:

> Energy and Infrastructure Minister Eli Cohen signed an agreement with Ethiopian Energy and Water Minister Habtamu Itefa Geleta to cooperate in the fields of energy, water, and innovation.

Mechanical check: found at line 1, starting within the locator (line 1). Archived text at line 1 of `archive/text/src_20250204_inn_israel-ethiopia-energy-water-agreement.txt`:

> Energy and Infrastructure Minister Eli Cohen signed an agreement with Ethiopian Energy and Water Minister Habtamu Itefa Geleta to cooperate in the fields of energy, water, and innovation.

### Finland (FIN)

#### evt_2025_09_24_FIN_B9

- [ ] Checked (75 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-09-24 |
| Speaker or actor | President of the Republic / Président de la République |
| Tier (points) | +5: Legal characterisation (+5): the President says Israel has no right to violate international law in Palestine, and that an immediate ceasefire is needed in Gaza. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The President of the Republic said at the General Debate that an immediate ceasefire was needed in Gaza and that Israel had no right to violate international law in Palestine. |
| Summary (FR) | Le président de la République a déclaré, lors du débat général, qu'un cessez-le-feu immédiat était nécessaire à Gaza et qu'Israël n'avait pas le droit de violer le droit international en Palestine. |
| Second reading | agree, 2026-10-13 |

Evidence 1: `src_20250924_un-gadebate_fin-stubb-80th` (official, United Nations (General Debate statements, gadebate.un.org), 2025-09-24), locator **line 57**, language `en`.
Wayback: <https://web.archive.org/web/20251217131407id_/https://gadebate.un.org/sites/default/files/gastatements/80/fi_en.pdf>

Quote:

> Israel has no right to violate international law in Palestine.

Mechanical check: found at lines 57–58, starting within the locator (line 57). Archived text at lines 57–58 of `archive/text/src_20250924_un-gadebate_fin-stubb-80th.txt`:

> Russia has no right to continue its aggression against Ukraine. Israel has no right to violate international law in Palestine. States have no right to use Sudanese or Congolese territories to fight proxy wars for their

Evidence 2: `src_20250924_un-gadebate_fin-stubb-80th` (official, United Nations (General Debate statements, gadebate.un.org), 2025-09-24), locator **line 112**, language `en`.
Wayback: <https://web.archive.org/web/20251217131407id_/https://gadebate.un.org/sites/default/files/gastatements/80/fi_en.pdf>

Quote:

> An immediate ceasefire is needed in Gaza. Humanitarian aid must be granted safe and unhindered access.

Mechanical check: found at line 112, starting within the locator (line 112). Archived text at line 112 of `archive/text/src_20250924_un-gadebate_fin-stubb-80th.txt`:

> An immediate ceasefire is needed in Gaza. Humanitarian aid must be granted safe and unhindered access.

Evidence 3: `src_20250924_un-gadebate_fin-80th-session-page` (official, United Nations (General Debate, gadebate.un.org), 2025-09-24), locator **line 2**, language `en`.
Wayback: <https://web.archive.org/web/20260317124240id_/https://gadebate.un.org/en/80/finland>

Quote:

> Israel has no right to violate international law in Palestine.

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20250924_un-gadebate_fin-80th-session-page.txt`:

> … of the use of force and the respect for human rights and fundamental freedoms. “Russia has no right to continue its aggression on Ukraine,” he stressed. Israel has no right to violate international law in Palestine. States have no right to use Sudanese or Congolese territories to fight proxy wars for their economic or strategic self-interest, he emphasized.

#### evt_2025_05_19_FIN_B9

- [ ] Checked (76 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-05-19 |
| Speaker or actor | Minister for Foreign Affairs / Ministre des Affaires étrangères |
| Tier (points) | +2: Formal call to end the blockade and for a ceasefire (+2): the donors ask the Government of Israel to 'allow a full resumption of aid into Gaza immediately' and call an 'immediate return to a ceasefire' the way to peace; no violation is named. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister of Foreign Affairs, with other foreign ministers, asked Israel to allow a full resumption of aid into Gaza and called for an immediate return to a ceasefire. |
| Summary (FR) | La ministre des Affaires étrangères, avec d'autres ministres, a demandé à Israël de permettre la pleine reprise de l'aide à Gaza et appelé à un retour immédiat à un cessez-le-feu. |
| Second reading | agree, 2026-10-13 |

Evidence 1: `src_20250519_vm-ee_joint-donor-statement-gaza` (official, Ministry of Foreign Affairs of Estonia (vm.ee), 2025-05-19), locator **line 3**, language `en`.
Wayback: <https://web.archive.org/web/20261013070522id_/https://vm.ee/en/news/joint-donor-statement-humanitarian-aid-gaza>

Quote:

> allow a full resumption of aid into Gaza immediately and enable the UN and humanitarian organisations to work independently and impartially to save lives, reduce suffering and maintain dignity.

Mechanical check: found at line 3, starting within the locator (line 3). Archived text at line 3 of `archive/text/src_20250519_vm-ee_joint-donor-statement-gaza.txt`:

> As humanitarian donors, we have two straightforward messages for the Government of Israel: allow a full resumption of aid into Gaza immediately and enable the UN and humanitarian organisations to work independently and impartially to save lives, reduce suffering and maintain dignity. We remain committed to meeting the acute needs we see in Gaza. We also reiterate our firm message that Hamas must immediately release all remaining hostages …

Evidence 2: `src_20250519_vm-ee_joint-donor-statement-gaza` (official, Ministry of Foreign Affairs of Estonia (vm.ee), 2025-05-19), locator **line 3**, language `en`.
Wayback: <https://web.archive.org/web/20261013070522id_/https://vm.ee/en/news/joint-donor-statement-humanitarian-aid-gaza>

Quote:

> It is our firm conviction that an immediate return to a ceasefire and working towards the implementation of a two-state solution are the only way to bring peace and security to Israelis and Palestinians and ensure long-term stability for the whole region.

Mechanical check: found at line 3, starting within the locator (line 3). Archived text at line 3 of `archive/text/src_20250519_vm-ee_joint-donor-statement-gaza.txt`:

> … our firm message that Hamas must immediately release all remaining hostages and allow humanitarian assistance to be distributed without interference. It is our firm conviction that an immediate return to a ceasefire and working towards the implementation of a two-state solution are the only way to bring peace and security to Israelis and Palestinians and ensure long-term stability for the whole region.

Evidence 3: `src_20250519_vm-ee_joint-donor-statement-gaza` (official, Ministry of Foreign Affairs of Estonia (vm.ee), 2025-05-19), locator **line 5**, language `en`.
Wayback: <https://web.archive.org/web/20261013070522id_/https://vm.ee/en/news/joint-donor-statement-humanitarian-aid-gaza>

Quote:

> Estonia, Finland, France

Mechanical check: found at line 5, starting within the locator (line 5). Archived text at line 5 of `archive/text/src_20250519_vm-ee_joint-donor-statement-gaza.txt`:

> The Foreign Ministers of Australia, Austria, Belgium, Canada, Denmark, Estonia, Finland, France, Germany, Iceland, Ireland, Italy, Japan, Latvia, Lithuania, Luxembourg, the Netherlands, New Zealand, Norway, Portugal, Slovenia, Spain, Sweden and the UK.

#### evt_2026_05_28_FIN_B11

- [ ] Checked (77 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B11, standing |
| Date | 2026-05-28 |
| Speaker or actor | — / — |
| Tier (points) | +5: Sanctions on settler entities (+5): the EU listing of 28 May 2026 (Implementing Regulation (EU) 2026/1177) of four settler organisations and three individuals, adopted by unanimity; it lists Nachala for abuses in the West Bank and the Gaza Strip. The settler tier already holds from 15 July 2024 (one per tier), so it adds no points. |
| Confidence | confirmed |
| Scope | gaza, west-bank |
| Summary (EN) | The government agreed in the EU Council to sanctions on three Israeli settler leaders and four settler organisations, one of them for efforts to resettle the Gaza Strip. |
| Summary (FR) | Le gouvernement a approuvé au Conseil de l'UE des sanctions contre trois dirigeants de colons israéliens et quatre organisations de colons, dont l'une pour son projet de colonisation de Gaza. |
| Second reading | agree, 2026-10-13 |

Evidence 1: `src_20260528_eur-lex_reg-impl-2026-1177` (official, Council of the European Union (Official Journal, EUR-Lex), 2026-05-28), locator **line 2**, language `en`.
Wayback: <https://web.archive.org/web/20260529134604id_/https://eur-lex.europa.eu/eli/reg_impl/2026/1177/oj/eng>

Quote:

> the following entries are added to the list of natural or legal persons, entities or bodies under the heading ‘B. Legal persons, entities and bodies’:

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20260528_eur-lex_reg-impl-2026-1177.txt`:

> the following entries are added to the list of natural or legal persons, entities or bodies under the heading ‘B. Legal persons, entities and bodies’:

Evidence 2: `src_20260528_eur-lex_reg-impl-2026-1177` (official, Council of the European Union (Official Journal, EUR-Lex), 2026-05-28), locator **line 27**, language `en`.
Wayback: <https://web.archive.org/web/20260529134604id_/https://eur-lex.europa.eu/eli/reg_impl/2026/1177/oj/eng>

Quote:

> After 7 October 2023, Nachala has furthermore been at the forefront of efforts to resettle the Gaza Strip. Therefore, Nachala is responsible for facilitating and encouraging human rights abuses in the West Bank and the Gaza Strip, including abuses of the right of Palestinians to self-determination, their right to property, their right to private and family life, as well as the right to life and to physical health, which are of serious concern as regards the objectives of the common foreign and security policy set out in Article 21 of the Treaty on European Union.

Mechanical check: found at line 27, starting within the locator (line 27). Archived text at line 27 of `archive/text/src_20260528_eur-lex_reg-impl-2026-1177.txt`:

> After 7 October 2023, Nachala has furthermore been at the forefront of efforts to resettle the Gaza Strip. Therefore, Nachala is responsible for facilitating and encouraging human rights abuses in the West Bank and the Gaza Strip, including abuses of the right of Palestinians to self-determination, their right to property, their right to private and family life, as well as the right to life and to physical health, which are of serious concern as regards the objectives of the common foreign and security policy set out in Article 21 of the Treaty on European Union.

#### evt_2025_07_21_FIN_B9

- [ ] Checked (78 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-07-21 |
| Speaker or actor | Minister for Foreign Affairs / Ministre des Affaires étrangères |
| Tier (points) | +5: Names specific violations (+5): the joint statement calls the denial of essential humanitarian assistance unacceptable and permanent forced displacement a violation of international humanitarian law. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister of Foreign Affairs, with other foreign ministers, said the war in Gaza must end now and called forced displacement a violation of international humanitarian law. |
| Summary (FR) | La ministre des Affaires étrangères, avec d'autres ministres, a déclaré que la guerre à Gaza devait cesser et qualifié le déplacement forcé de violation du droit humanitaire. |
| Second reading | agree, 2026-10-13 |

Evidence 1: `src_20250721_fm-gov-au_joint-statement-opt` (official, Minister for Foreign Affairs of Australia, 2025-07-21), locator **line 3**, language `en`.
Wayback: <https://web.archive.org/web/20260928190421id_/https://www.foreignminister.gov.au/minister/penny-wong/media-release/joint-statement-occupied-palestinian-territories>

Quote:

> The Israeli Government's denial of essential humanitarian assistance to the civilian population is unacceptable.

Mechanical check: found at line 3, starting within the locator (line 3). Archived text at line 3 of `archive/text/src_20250721_fm-gov-au_joint-statement-opt.txt`:

> … including children, seeking to meet their most basic needs of water and food. It is horrifying that over 800 Palestinians have been killed while seeking aid. The Israeli Government's denial of essential humanitarian assistance to the civilian population is unacceptable. Israel must comply with its obligations under international humanitarian law.

Evidence 2: `src_20250721_fm-gov-au_joint-statement-opt` (official, Minister for Foreign Affairs of Australia, 2025-07-21), locator **line 6**, language `en`.
Wayback: <https://web.archive.org/web/20260928190421id_/https://www.foreignminister.gov.au/minister/penny-wong/media-release/joint-statement-occupied-palestinian-territories>

Quote:

> Permanent forced displacement is a violation of international humanitarian law.

Mechanical check: found at line 6, starting within the locator (line 6). Archived text at line 6 of `archive/text/src_20250721_fm-gov-au_joint-statement-opt.txt`:

> … the obligations of international humanitarian law. Proposals to remove the Palestinian population into a "humanitarian city" are completely unacceptable. Permanent forced displacement is a violation of international humanitarian law.

Evidence 3: `src_20250721_fm-gov-au_joint-statement-opt` (official, Minister for Foreign Affairs of Australia, 2025-07-21), locator **line 11**, language `en`.
Wayback: <https://web.archive.org/web/20260928190421id_/https://www.foreignminister.gov.au/minister/penny-wong/media-release/joint-statement-occupied-palestinian-territories>

Quote:

> Estonia, Finland, France

Mechanical check: found at line 11, starting within the locator (line 11). Archived text at line 11 of `archive/text/src_20250721_fm-gov-au_joint-statement-opt.txt`:

> The Foreign Ministers of Australia, Austria, Belgium, Canada, Cyprus, Denmark, Estonia, Finland, France, Greece, Iceland, Ireland, Italy, Japan, Latvia, Liechtenstein, Lithuania, Luxembourg, Malta, The Netherlands, New Zealand, Norway, Poland, Portugal, …

### Fiji (FJI)

#### evt_2023_10_31_FJI_E2

- [ ] Checked (79 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | E2, repeatable |
| Date | 2023-10-31 |
| Speaker or actor | Fiji Police Force / Force de police des Fidji |
| Tier (points) | −5: E2 (-5): the Fiji Police Force denied an application for a 'Free Palestine' march scheduled for 4 November 2023, citing the risk of communal discord; the Minister for Home Affairs confirmed it and explained the reasons. Experimental indicator, recorded and unscored in v1.0 (D-12). |
| Confidence | corroborated |
| Scope | gaza |
| Summary (EN) | The Fiji Police Force denied an application for a 'Free Palestine' march planned for 4 November 2023, citing the risk of communal discord. |
| Summary (FR) | La Force de police des Fidji a refusé une demande de marche « Free Palestine » prévue le 4 novembre 2023, en invoquant le risque de discorde entre communautés. |
| Second reading | agree, 2026-11-10; the notes mention a flag |

Evidence 1: `src_20231101_fijisun_free-palestine-march-permit-denied` (press, Fiji Sun, 2023-11-01), locator **line 3**, language `en`.
Wayback: <https://web.archive.org/web/20261109234345id_/https://fijisun.com.fj/news/nation/free-palestine-march-permit-denied>

Quote:

> The Fiji Police Force has denied an application for a ‘Free Palestine’ March scheduled for November 4.

Mechanical check: found at line 3, starting within the locator (line 3). Archived text at line 3 of `archive/text/src_20231101_fijisun_free-palestine-march-permit-denied.txt`:

> The Fiji Police Force has denied an application for a ‘Free Palestine’ March scheduled for November 4.

Evidence 2: `src_20231101_fijisun_free-palestine-march-permit-denied` (press, Fiji Sun, 2023-11-01), locator **line 4**, language `en`.
Wayback: <https://web.archive.org/web/20261109234345id_/https://fijisun.com.fj/news/nation/free-palestine-march-permit-denied>

Quote:

> Minister for Home Affairs Pio Tikoduadua confirmed this yesterday.

Mechanical check: found at line 4, starting within the locator (line 4). Archived text at line 4 of `archive/text/src_20231101_fijisun_free-palestine-march-permit-denied.txt`:

> Minister for Home Affairs Pio Tikoduadua confirmed this yesterday.

Evidence 3: `src_20231031_maitv_fiji-denies-palestine-march-permit` (press, Mai Tv, 2023-10-31), locator **line 1**, language `en`.
Wayback: <https://web.archive.org/web/20261109234309id_/https://maitvfiji.com/fiji-denies-solidarity-march-pass-with-palestine-citing-safety-concerns-and-possible-precedent/>

Quote:

> Fiji’s Police have denied applications for a solidarity march with Palestine, amidst the ongoing conflict in Gaza between Hamas and Israel, citing concerns about potential communal discord and the need to ensure the safety of all Fijians.

Mechanical check: found at line 1, starting within the locator (line 1). Archived text at line 1 of `archive/text/src_20231031_maitv_fiji-denies-palestine-march-permit.txt`:

> Fiji’s Police have denied applications for a solidarity march with Palestine, amidst the ongoing conflict in Gaza between Hamas and Israel, citing concerns about potential communal discord and the need to ensure the safety of all Fijians.

### France (FRA)

#### evt_2026_10_28_FRA_B9

- [ ] Checked (80 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2026-10-28 |
| Speaker or actor | Minister for Europe and Foreign Affairs / Ministre de l'Europe et des Affaires étrangères |
| Tier (points) | +5: Names specific violations (+5): the Foreign Minister said violence had exploded in the West Bank and that settlers terrorise Palestinian farmers during the olive harvest, as the reason for France's decision to cease trade with illegal settlements. West Bank conduct, tagged and unscored in v1 (docs/10 B-32). |
| Confidence | confirmed |
| Scope | west-bank |
| Summary (EN) | The Foreign Minister said violence had exploded in the West Bank and that settlers were terrorising Palestinian farmers during the olive harvest. |
| Summary (FR) | Le ministre des Affaires étrangères a déclaré que la violence avait explosé en Cisjordanie et que les colons terrorisaient les agriculteurs palestiniens pendant la cueillette des olives. |
| Second reading | agree, 2026-11-09 |

Evidence 1: `src_20261028_diplomatie-gouv_france2-barrot` (official, Ministère de l’Europe et des Affaires étrangères, 2026-10-28), locator **line 18**, language `fr`.
Wayback: <https://web.archive.org/web/20261109013921id_/https://www.diplomatie.gouv.fr/fr/presse-et-ressources/decouvrir-et-informer/actualites/france-2-entretien-de-jean-noel-barrot-3>

Quote:

> C'est parce que ce qui se passe en Cisjordanie est tout simplement révoltant. On assiste à une explosion des violences, à une accélération effrénée de la colonisation. Et depuis la fin septembre, c'est la période de la cueillette des olives, une période agricole importante en Palestine, pendant laquelle les colons terrorisent les agriculteurs de Palestine.

Translation in the record:

> It is because what is happening in the West Bank is simply revolting. We are witnessing an explosion of violence, a headlong acceleration of colonisation. And since the end of September it is the olive-picking season, an important agricultural season in Palestine, during which settlers terrorise the farmers of Palestine.

Mechanical check: found at line 18, starting within the locator (line 18). Archived text at line 18 of `archive/text/src_20261028_diplomatie-gouv_france2-barrot.txt`:

> R - Alors d'abord, pourquoi est-ce qu'on a pris cette décision ? C'est parce que ce qui se passe en Cisjordanie est tout simplement révoltant. On assiste à une explosion des violences, à une accélération effrénée de la colonisation. Et depuis la fin septembre, c'est la période de la cueillette des olives, une période agricole importante en Palestine, pendant laquelle les colons terrorisent les agriculteurs de Palestine.

#### evt_2025_05_20_FRA_C1

- [ ] Checked (81 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | C1, standing |
| Date | 2025-05-20 |
| Speaker or actor | Ministry for Europe and Foreign Affairs / Ministère de l'Europe et des Affaires étrangères |
| Tier (points) | +4: Review tier (+4): France called in the Foreign Affairs Council for the review of the EU–Israel Association Agreement that the High Representative announced that day; the agreement was not suspended, so the suspension tier (+10) does not apply. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The government called in the EU Foreign Affairs Council for a review of the EU–Israel Association Agreement and welcomed the High Representative's announcement of that review. |
| Summary (FR) | Le gouvernement a demandé, au Conseil des affaires étrangères de l'UE, le réexamen de l'accord d'association UE–Israël et a salué l'annonce de ce réexamen par la Haute représentante. |
| Second reading | agree, 2026-09-28; the notes mention a flag |

Evidence 1: `src_20250520_diplomatie-gouv_cae-accord-association` (official, Ministère de l’Europe et des Affaires étrangères, 2025-05-20), locator **paragraph 5**, language `fr`.
Wayback: <https://web.archive.org/web/20260928120002id_/https://www.diplomatie.gouv.fr/fr/presse-et-ressources/decouvrir-et-informer/actualites/union-europeenne-conseil-affaires-etrangeres-du-20-mai-0>

Quote:

> Elle a par ailleurs appelé l’Union européenne à prendre des mesures concrètes, en particulier s’agissant du réexamen de l’accord d’association entre l’UE et Israël et accueille favorablement l’annonce de la Haute-Représentante en ce sens à l’issue de la réunion.

Translation in the record:

> It also called on the European Union to take concrete measures, in particular regarding the review of the Association Agreement between the EU and Israel, and welcomes the High Representative's announcement to that effect at the end of the meeting.

Mechanical check: found at line 5; the locator is not a line number. Archived text at line 5 of `archive/text/src_20250520_diplomatie-gouv_cae-accord-association.txt`:

> … israélienne et souligné la nécessité d’un accord des États membres sur des sanctions contre les colons violents et entités promouvant la colonisation. Elle a par ailleurs appelé l’Union européenne à prendre des mesures concrètes, en particulier s’agissant du réexamen de l’accord d’association entre l’UE et Israël et accueille favorablement l’annonce de la Haute-Représentante en ce sens à l’issue de la réunion. La France a redit son attachement à la solution à deux États et a rappelé ses efforts pour la mettre en œuvre dans le cadre de la conférence qu’elle …

Evidence 2: `src_20250520_diplomatie-gouv_cae-accord-association` (official, Ministère de l’Europe et des Affaires étrangères, 2025-05-20), locator **paragraph 5**, language `fr`.
Wayback: <https://web.archive.org/web/20260928120002id_/https://www.diplomatie.gouv.fr/fr/presse-et-ressources/decouvrir-et-informer/actualites/union-europeenne-conseil-affaires-etrangeres-du-20-mai-0>

Quote:

> La France a rappelé sa ferme condamnation de l’extension des opérations militaires israéliennes à Gaza et du blocage de l’aide humanitaire qui constitue une violation des principes du droit international.

Translation in the record:

> France recalled its firm condemnation of the extension of Israeli military operations in Gaza and of the blocking of humanitarian aid, which constitutes a violation of the principles of international law.

Mechanical check: found at line 5; the locator is not a line number. Archived text at line 5 of `archive/text/src_20250520_diplomatie-gouv_cae-accord-association.txt`:

> La France a rappelé sa ferme condamnation de l’extension des opérations militaires israéliennes à Gaza et du blocage de l’aide humanitaire qui constitue une violation des principes du droit international. La France a rappelé sa forte préoccupation s’agissant de la politique de colonisation israélienne et souligné la nécessité d’un accord des États membres sur …

#### evt_2024_03_28_FRA_D3

- [ ] Checked (82 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | D3, standing |
| Date | 2024-03-28 to 2024-12-31 |
| Speaker or actor | Ministry for Europe and Foreign Affairs / Ministère de l'Europe et des Affaires étrangères |
| Tier (points) | +5: Restored tier (+5): the ministry announced a 2024 contribution of more than EUR 30 million; from 31 December 2024 the increased tier (evt_2024_12_31_FRA_D3) supersedes it (UNRWA's tables, checked in P-16). |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Ministry for Europe and Foreign Affairs announced that France would contribute more than EUR 30 million to UNRWA in 2024. |
| Summary (FR) | Le ministère de l'Europe et des Affaires étrangères a annoncé que la France contribuerait à hauteur de plus de 30 millions d'euros à l'UNRWA en 2024. |
| Second reading | agree, 2026-09-28 |

Evidence 1: `src_20240328_diplomatie-gouv_point-presse-unrwa` (official, Ministère de l’Europe et des Affaires étrangères, 2024-03-28), locator **paragraph 34**, language `fr`.
Wayback: <https://web.archive.org/web/20240409164936id_/https://www.diplomatie.gouv.fr/fr/salle-de-presse/point-de-presse-live-du-porte-parole-adjoint-du-meae/article/q-r-point-de-presse-live-28-03-24>

Quote:

> Sur la question de l’UNRWA en 2024, la France contribuera aux actions de l’UNRWA à hauteur de plus de 30 millions d’euros. Nous verserons nos contributions en nous assurant que les conditions sont remplies pour que l’UNRWA remplisse ses missions dans un esprit dénué d’appel à la haine et à la violence. Mais la France contribuera au budget de l’UNRWA.

Translation in the record:

> On the question of UNRWA in 2024, France will contribute to UNRWA's actions to the amount of more than EUR 30 million. We will pay our contributions while ensuring that the conditions are met for UNRWA to fulfil its missions in a spirit free of calls to hatred and violence. But France will contribute to UNRWA's budget.

Mechanical check: found at line 34; the locator is not a line number. Archived text at line 34 of `archive/text/src_20240328_diplomatie-gouv_point-presse-unrwa.txt`:

> Sur la question de l’UNRWA en 2024, la France contribuera aux actions de l’UNRWA à hauteur de plus de 30 millions d’euros. Nous verserons nos contributions en nous assurant que les conditions sont remplies pour que l’UNRWA remplisse ses missions dans un esprit dénué d’appel à la haine et à la violence. Mais la France contribuera au budget de l’UNRWA.

### United Kingdom of Great Britain and Northern Ireland (GBR)

#### evt_2024_09_02_GBR_A6

- [ ] Checked (83 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | A6, standing |
| Date | 2024-09-02 |
| Speaker or actor | Secretary of State for Business and Trade / Ministre des Affaires et du Commerce |
| Tier (points) | +10 |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Business and Trade Secretary suspended around 30 export licences to Israel for items assessed to be for use in military operations in Gaza. |
| Summary (FR) | Le ministre des Affaires et du Commerce a suspendu une trentaine de licences d'exportation vers Israël portant sur des biens jugés destinés aux opérations militaires à Gaza. |
| Second reading | agree, 2026-09-28 |

Evidence 1: `src_20240902_gov-uk_suspends-30-licences-israel` (official, Foreign, Commonwealth & Development Office and Department for Business and Trade, 2024-09-02), locator **paragraph 5**, language `en`.
Wayback: <https://web.archive.org/web/20260928112034id_/https://www.gov.uk/government/news/uk-suspends-around-30-arms-export-licences-to-israel-for-use-in-gaza-over-international-humanitarian-law-concerns>

Quote:

> The government has taken the decision that the UK will suspend arms export licences to Israel for use in military operations in Gaza, following a review of Israel’s compliance with international humanitarian law.

Mechanical check: found at line 5; the locator is not a line number. Archived text at line 5 of `archive/text/src_20240902_gov-uk_suspends-30-licences-israel.txt`:

> The government has taken the decision that the UK will suspend arms export licences to Israel for use in military operations in Gaza, following a review of Israel’s compliance with international humanitarian law.

Evidence 2: `src_20240902_gov-uk_nte-2024-20-israel` (official, Export Control Joint Unit, Department for Business and Trade, 2024-09-02), locator **paragraph 68**, language `en`.
Wayback: <https://web.archive.org/web/20260928111533id_/https://www.gov.uk/government/publications/notice-to-exporters-202420-suspension-of-licences-for-israel/nte-202420-suspension-of-licences-for-israel>

Quote:

> the Secretary of State for Business and Trade has suspended extant export licences where we assess the items are for use in military operations in Gaza.

Mechanical check: found at line 68; the locator is not a line number. Archived text at line 68 of `archive/text/src_20240902_gov-uk_nte-2024-20-israel.txt`:

> … and the Written Statement made by the Secretary of State for Business and Trade on 2 September 2024, and under article 32 of the Export Control Order 2008, the Secretary of State for Business and Trade has suspended extant export licences where we assess the items are for use in military operations in Gaza.

Evidence 3: `src_20260908_gov-uk_fs-oral-statement-israel-palestine` (official, Foreign, Commonwealth & Development Office, 2026-09-08), locator **paragraph 87**, language `en`.
Wayback: <https://web.archive.org/web/20260927185529id_/https://www.gov.uk/government/speeches/foreign-secretary-oral-statement-on-israel-palestine>

Quote:

> We have already suspended over 30 arms licences used by the IDF in Gaza. That suspension remains fully in place.

Mechanical check: found at line 87; the locator is not a line number. Archived text at line 87 of `archive/text/src_20260908_gov-uk_fs-oral-statement-israel-palestine.txt`:

> I also want to address the question of arms sales. We have already suspended over 30 arms licences used by the IDF in Gaza. That suspension remains fully in place.

#### evt_2026_06_08_GBR_B9

- [ ] Checked (84 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2026-06-08 |
| Speaker or actor | Foreign Secretary / Ministre des Affaires étrangères |
| Tier (points) | +2: Formal call to end the blockade (+2): the signatories call on Israel to comply with its obligations under international humanitarian law and say humanitarian access is non-negotiable; the restrictions are described, not called violations. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Foreign Secretary joined a joint statement calling on Israel to comply with international humanitarian law and allow humanitarian access in Gaza. |
| Summary (FR) | La ministre des Affaires étrangères s'est jointe à une déclaration commune appelant Israël à respecter le droit international humanitaire et à permettre l'accès humanitaire à Gaza. |
| Second reading | agree, 2026-09-30 |

Evidence 1: `src_20260608_diplomatie-belgium_joint-statement-ingos` (official, FPS Foreign Affairs, Foreign Trade and Development Cooperation, 2026-06-08), locator **line 6**, language `en`.
Wayback: <https://web.archive.org/web/20260928194453id_/https://diplomatie.belgium.be/fr/actualites/joint-statement-humanitarian-access-gaza-and-registration-law-affecting-ingos>

Quote:

> we call on Israel, the occupying power in Gaza and the West Bank, including East Jerusalem, to comply with its obligations under international humanitarian law. Humanitarian access is non-negotiable.

Mechanical check: found at line 6, starting within the locator (line 6). Archived text at line 6 of `archive/text/src_20260608_diplomatie-belgium_joint-statement-ingos.txt`:

> While recognizing the security concerns of the State of Israel, we call on Israel, the occupying power in Gaza and the West Bank, including East Jerusalem, to comply with its obligations under international humanitarian law. Humanitarian access is non-negotiable. All internationally recognized humanitarian organizations – the INGOs, the Red Cross and Red Crescent Movement and UN agencies including UNRWA – must be able …

Evidence 2: `src_20260608_diplomatie-belgium_joint-statement-ingos` (official, FPS Foreign Affairs, Foreign Trade and Development Cooperation, 2026-06-08), locator **line 7**, language `en`.
Wayback: <https://web.archive.org/web/20260928194453id_/https://diplomatie.belgium.be/fr/actualites/joint-statement-humanitarian-access-gaza-and-registration-law-affecting-ingos>

Quote:

> Signatories: Australia, Austria, Belgium, Denmark, European Commissioner for Equality, Preparedness and Crisis Management (Lahbib), Estonia, France, Finland, Ireland, Iceland, Japan, Luxembourg, The Netherlands, The United Kingdom

Mechanical check: found at line 7, starting within the locator (line 7). Archived text at line 7 of `archive/text/src_20260608_diplomatie-belgium_joint-statement-ingos.txt`:

> Signatories: Australia, Austria, Belgium, Denmark, European Commissioner for Equality, Preparedness and Crisis Management (Lahbib), Estonia, France, Finland, Ireland, Iceland, Japan, Luxembourg, The Netherlands, The United Kingdom, Norway, Poland, Portugal, Slovakia, Spain, Sweden and Switzerland.

#### evt_2023_12_02_GBR_A5

- [ ] Checked (85 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | A5, repeatable |
| Date | 2023-12-02 |
| Speaker or actor | Ministry of Defence / Ministère de la Défense |
| Tier (points) | −5: One confirmed instance (−5): the Ministry of Defence announced surveillance flights over Israel and Gaza in support of hostage rescue, whose information was passed to the Israeli authorities; an official confirmation of intelligence sharing related to the Gaza campaign. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Ministry of Defence announced surveillance flights over Israel and Gaza to locate hostages, with information on hostage rescue passed to the Israeli authorities; they ended on 10 October 2025. |
| Summary (FR) | Le ministère de la Défense a annoncé des vols de surveillance au-dessus d'Israël et de Gaza pour localiser les otages, les informations étant transmises à Israël ; fin des vols le 10 octobre 2025. |
| Second reading | agree, 2026-09-28; the notes mention a flag |

Evidence 1: `src_20231202_gov-uk_mod-surveillance-flights` (official, Ministry of Defence, 2023-12-02), locator **paragraph 56**, language `en`.
Wayback: <https://web.archive.org/web/20260928112056id_/https://www.gov.uk/government/news/uk-military-activity-in-the-eastern-mediterranean>

Quote:

> In support of the ongoing hostage rescue activity, the UK Ministry of Defence will conduct surveillance flights over the Eastern Mediterranean, including operating in air space over Israel and Gaza.

Mechanical check: found at line 56; the locator is not a line number. Archived text at line 56 of `archive/text/src_20231202_gov-uk_mod-surveillance-flights.txt`:

> … the region to secure the release of hostages, including British nationals, who have been kidnapped. The safety of British nationals is our utmost priority. In support of the ongoing hostage rescue activity, the UK Ministry of Defence will conduct surveillance flights over the Eastern Mediterranean, including operating in air space over Israel and Gaza.

Evidence 2: `src_20231202_gov-uk_mod-surveillance-flights` (official, Ministry of Defence, 2023-12-02), locator **paragraph 57**, language `en`.
Wayback: <https://web.archive.org/web/20260928112056id_/https://www.gov.uk/government/news/uk-military-activity-in-the-eastern-mediterranean>

Quote:

> Only information relating to hostage rescue will be passed to the relevant authorities responsible for hostage rescue.

Mechanical check: found at line 57; the locator is not a line number. Archived text at line 57 of `archive/text/src_20231202_gov-uk_mod-surveillance-flights.txt`:

> Surveillance aircraft will be unarmed, do not have a combat role, and will be tasked solely to locate hostages. Only information relating to hostage rescue will be passed to the relevant authorities responsible for hostage rescue.

Evidence 3: `src_20251016_gov-uk_mod-surveillance-flights-ended` (official, Ministry of Defence, 2025-10-16), locator **paragraph 5**, language `en`.
Wayback: <https://web.archive.org/web/20260928112034id_/https://www.gov.uk/government/news/statement-on-uk-military-activity-in-the-eastern-mediterranean>

Quote:

> The UK government strictly controlled what information was passed on and only information relating to hostage rescue was passed to the relevant Israeli authorities.

Mechanical check: found at line 5; the locator is not a line number. Archived text at line 5 of `archive/text/src_20251016_gov-uk_mod-surveillance-flights-ended.txt`:

> The UK government strictly controlled what information was passed on and only information relating to hostage rescue was passed to the relevant Israeli authorities.

Evidence 4: `src_20251016_gov-uk_mod-surveillance-flights-ended` (official, Ministry of Defence, 2025-10-16), locator **paragraph 6**, language `en`.
Wayback: <https://web.archive.org/web/20260928112034id_/https://www.gov.uk/government/news/statement-on-uk-military-activity-in-the-eastern-mediterranean>

Quote:

> The last flight took place on the 10 October 2025.

Mechanical check: found at line 6; the locator is not a line number. Archived text at line 6 of `archive/text/src_20251016_gov-uk_mod-surveillance-flights-ended.txt`:

> … of the Gaza peace plan between Israel and Hamas, and the release of remaining hostages, the Ministry of Defence has ceased surveillance flights over Gaza. The last flight took place on the 10 October 2025.

### Ghana (GHA)

#### evt_2025_09_25_GHA_B9

- [ ] Checked (86 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-09-25 |
| Speaker or actor | President of the Republic of Ghana / Président de la République du Ghana |
| Tier (points) | +5: Names violations (+5): at the General Debate of the 80th session, as the verbatim record gives the address he delivered in English, the President speaks of innocent people "who have been facing collective punishment and forced starvation for no reason other than the fact that they are Palestinian", of "what we all know is taking place in Gaza", and ends the passage with "The crimes in Gaza must stop." Gaza is named (R7) and starvation and collective punishment are named violations. No call for a ceasefire or an end of the blockade. 429 days old on 28 November 2026: counted with decay, outside the 365 days of the passivity rule. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The President of Ghana told the General Assembly that the crimes in Gaza must stop and that Palestinians faced collective punishment and forced starvation. |
| Summary (FR) | Le président du Ghana a déclaré à l'Assemblée générale que les crimes à Gaza devaient cesser et que les Palestiniens subissaient une punition collective et une famine imposée. |
| Second reading | agree, 2026-11-28; the notes mention a flag |

Evidence 1: `src_20250925_undocs_a-80-pv-8` (official, United Nations General Assembly, 2025-09-25), locator **lines 1565 to 1566**, language `en`.
Wayback: <https://web.archive.org/web/20261128040920id_/https://documents.un.org/doc/undoc/gen/n25/250/42/pdf/n2525042.pdf>

Quote:

> who have been facing collective punishment and forced starvation for no reason other than the fact that they are Palestinian.

Mechanical check: found at lines 1565–1566, starting within the locator (lines 1565 to 1566). Archived text at lines 1565–1566 of `archive/text/src_20250925_undocs_a-80-pv-8.txt`:

> women and children, who have been facing collective punishment and forced starvation for no reason other than the fact that they are Palestinian.

Evidence 2: `src_20250925_undocs_a-80-pv-8` (official, United Nations General Assembly, 2025-09-25), locator **lines 1567 to 1569**, language `en`.
Wayback: <https://web.archive.org/web/20261128040920id_/https://documents.un.org/doc/undoc/gen/n25/250/42/pdf/n2525042.pdf>

Quote:

> we here in this General Assembly have been playing hide-and-seek with language to find the right words to help us to avoid or excuse what we all know is taking place in Gaza.

Mechanical check: found at lines 1567–1569, starting within the locator (lines 1567 to 1569). Archived text at lines 1567–1569 of `archive/text/src_20250925_undocs_a-80-pv-8.txt`:

> For nearly two years, and for the fear of reprisal, we here in this General Assembly have been playing hide-and-seek with language to find the right words to help us to avoid or excuse what we all know is taking place in Gaza. But here is the thing: it doe s

Evidence 3: `src_20250925_undocs_a-80-pv-8` (official, United Nations General Assembly, 2025-09-25), locator **lines 1570 to 1571**, language `en`.
Wayback: <https://web.archive.org/web/20261128040920id_/https://documents.un.org/doc/undoc/gen/n25/250/42/pdf/n2525042.pdf>

Quote:

> if it looks like a duck, swims like a duck and quacks like a duck, well then it must be a duck. The crimes in Gaza must stop.

Mechanical check: found at lines 1570–1571, starting within the locator (lines 1570 to 1571). Archived text at lines 1570–1571 of `archive/text/src_20250925_undocs_a-80-pv-8.txt`:

> not matter what you call it — if it looks like a duck, swims like a duck and quacks like a duck, well then it must be a duck. The crimes in Gaza must stop.

Evidence 4: `src_20250925_undocs_a-80-pv-8` (official, United Nations General Assembly, 2025-09-25), locator **line 1425**, language `en`.
Wayback: <https://web.archive.org/web/20261128040920id_/https://documents.un.org/doc/undoc/gen/n25/250/42/pdf/n2525042.pdf>

Quote:

> President Dramani Mahama: At this eightieth session of the General Assembly,

Mechanical check: found at line 1425, starting within the locator (line 1425). Archived text at line 1425 of `archive/text/src_20250925_undocs_a-80-pv-8.txt`:

> President Dramani Mahama: At this eightieth session of the General Assembly,

### Gambia (GMB)

#### evt_2025_08_25_GMB_B9

- [ ] Checked (87 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-08-25 |
| Speaker or actor | Minister of Foreign Affairs of the Gambia / Ministre des Affaires étrangères de la Gambie |
| Tier (points) | +5: Named violations (+5): at the Extraordinary Session of the OIC Council of Foreign Ministers in Jeddah the Foreign Minister says that 'the continuation of Israeli military action, forceful displacement of the Palestinian people, and destruction of their homes and livelihoods will not bring peace or security to the region' and that 'the people of Palestine, particularly those in Gaza, have suffered enough'. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Foreign Minister of the Gambia told the OIC Council of Foreign Ministers in Jeddah that Israeli military action and forceful displacement would not bring peace. |
| Summary (FR) | Le ministre des Affaires étrangères de la Gambie a déclaré, devant l'OCI à Djeddah, que l'action militaire israélienne et les déplacements forcés n'apporteraient pas la paix. |
| Second reading | agree, 2026-11-04; the notes mention a flag |

Evidence 1: `src_20250827_mofa-gm_njie-oic-extraordinary-cfm` (official, Ministry of Foreign Affairs, International Cooperation and Gambians Abroad of the Gambia (mofa.gov.gm), 2025-08-27), locator **line 3**, language `en`.
Wayback: <https://web.archive.org/web/20261104083626id_/https://mofa.gov.gm/%F0%9D%90%93%F0%9D%90%A1%F0%9D%90%9E-%F0%9D%90%86%F0%9D%90%9A%F0%9D%90%A6%F0%9D%90%9B%F0%9D%90%A2%F0%9D%90%9A%F0%9D%90%AC-%F0%9D%90%85%F0%9D%90%A8%F0%9D%90%AB%F0%9D%90%9E%F0%9D%90%A2/>

Quote:

> The continuation of Israeli military action, forceful displacement of the Palestinian people, and destruction of their homes and livelihoods will not bring peace or security to the region

Mechanical check: found at line 3, starting within the locator (line 3). Archived text at line 3 of `archive/text/src_20250827_mofa-gm_njie-oic-extraordinary-cfm.txt`:

> “The continuation of Israeli military action, forceful displacement of the Palestinian people, and destruction of their homes and livelihoods will not bring peace or security to the region,” Minister Njie declared. He highlighted the devastating impact of the conflict, particularly on children, with reports revealing that over 300,000 children …

Evidence 2: `src_20250827_mofa-gm_njie-oic-extraordinary-cfm` (official, Ministry of Foreign Affairs, International Cooperation and Gambians Abroad of the Gambia (mofa.gov.gm), 2025-08-27), locator **line 13**, language `en`.
Wayback: <https://web.archive.org/web/20261104083626id_/https://mofa.gov.gm/%F0%9D%90%93%F0%9D%90%A1%F0%9D%90%9E-%F0%9D%90%86%F0%9D%90%9A%F0%9D%90%A6%F0%9D%90%9B%F0%9D%90%A2%F0%9D%90%9A%F0%9D%90%AC-%F0%9D%90%85%F0%9D%90%A8%F0%9D%90%AB%F0%9D%90%9E%F0%9D%90%A2/>

Quote:

> The people of Palestine, particularly those in Gaza, have suffered enough.

Mechanical check: found at line 13, starting within the locator (line 13). Archived text at line 13 of `archive/text/src_20250827_mofa-gm_njie-oic-extraordinary-cfm.txt`:

> “The people of Palestine, particularly those in Gaza, have suffered enough. We must act now and consolidate our resolve to address their plight, defend the sanctity of Al-Quds Al-Shareef, and restore international peace and security. …

### Greece (GRC)

#### evt_2025_09_26_GRC_B9

- [ ] Checked (88 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-09-26 |
| Speaker or actor | Prime Minister / Premier ministre |
| Tier (points) | +5: Statement naming specific violations (+5): the Prime Minister said that no military target could justify the death of thousands of children and the forced displacement of over a million Palestinians within the Gaza Strip. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Prime Minister told the UN General Assembly that no military target could justify the death of thousands of children and the forced displacement of over a million Palestinians in Gaza. |
| Summary (FR) | Le Premier ministre a déclaré à l'Assemblée générale de l'ONU qu'aucun objectif militaire ne justifiait la mort de milliers d'enfants et le déplacement forcé de plus d'un million de Palestiniens. |
| Second reading | agree, 2026-09-29 |

Evidence 1: `src_20250926_primeminister-gr_unga-80-speech` (official, Prime Minister of the Hellenic Republic (primeminister.gr), 2025-09-26), locator **line 34**, language `en`.
Wayback: <https://web.archive.org/web/20251014041947id_/https://www.primeminister.gr/en/2025/09/26/37065>

Quote:

> But we have, at the same time, made it very clear that no military targets, no matter how valuable they are, can justify the death of thousands of children, the forced displacement of over a million Palestinians within the Gaza strip and the humanitarian suffering of the Palestinian people.

Mechanical check: found at line 34, starting within the locator (line 34). Archived text at line 34 of `archive/text/src_20250926_primeminister-gr_unga-80-speech.txt`:

> We have called for the immediate release of all hostages and a comprehensive cease fire. But we have, at the same time, made it very clear that no military targets, no matter how valuable they are, can justify the death of thousands of children, the forced displacement of over a million Palestinians within the Gaza strip and the humanitarian suffering of the Palestinian people.

### Guatemala (GTM)

#### evt_2025_09_24_GTM_B9

- [ ] Checked (89 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-09-24 |
| Speaker or actor | President of Guatemala / Président du Guatemala |
| Tier (points) | +2: Call tier (+2): in the General Debate the President called for immediately stopping the attacks and guaranteeing the entry of humanitarian aid to all territories at war, and for 'un alto total al sufrimiento y a la muerte de población civil en Gaza', and for the immediate and unconditional release of the hostages. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The President of Guatemala told the General Assembly that attacks in Gaza must stop immediately, called for a total end to the suffering of civilians there and for the release of the hostages. |
| Summary (FR) | Le président du Guatemala a déclaré à l'Assemblée générale que les attaques à Gaza devaient cesser immédiatement et a appelé à mettre fin à la souffrance des civils et à libérer les otages. |
| Second reading | agree, 2026-10-06; the notes mention a flag |

Evidence 1: `src_20250924_presidencia-gt_arevalo-onu-paz-regiones` (official, Secretaría de Comunicación Social de la Presidencia de Guatemala, 2025-09-24), locator **line 12**, language `es`.
Wayback: <https://web.archive.org/web/20261006043957id_/https://bernardoarevalo.presidencia.gob.gt/presidente-arevalo-aboga-por-intervencion-de-onu-para-llevar-paz-a-regiones-del-mundo-en-guerra/>

Quote:

> detener inmediatamente los ataques y garantizar el ingreso de ayuda humanitaria a todos los territorios en guerra

Translation in the record:

> stop the attacks immediately and guarantee the entry of humanitarian aid to all territories at war

Mechanical check: found at line 12, starting within the locator (line 12). Archived text at line 12 of `archive/text/src_20250924_presidencia-gt_arevalo-onu-paz-regiones.txt`:

> Abogó por “detener inmediatamente los ataques y garantizar el ingreso de ayuda humanitaria a todos los territorios en guerra”, y por “poner un alto a la invasión de Ucrania. Un alto a la guerra en Sudán”.

Evidence 2: `src_20250924_presidencia-gt_arevalo-onu-paz-regiones` (official, Secretaría de Comunicación Social de la Presidencia de Guatemala, 2025-09-24), locator **line 13**, language `es`.
Wayback: <https://web.archive.org/web/20261006043957id_/https://bernardoarevalo.presidencia.gob.gt/presidente-arevalo-aboga-por-intervencion-de-onu-para-llevar-paz-a-regiones-del-mundo-en-guerra/>

Quote:

> un alto total al sufrimiento y a la muerte de población civil en Gaza

Translation in the record:

> a total halt to the suffering and the death of the civilian population in Gaza

Mechanical check: found at line 13, starting within the locator (line 13). Archived text at line 13 of `archive/text/src_20250924_presidencia-gt_arevalo-onu-paz-regiones.txt`:

> El presidente de Guatemala se pronunció por “un alto total al sufrimiento y a la muerte de población civil en Gaza”, e instó “a la liberación inmediata y sin condiciones de los rehenes”.

### Guyana (GUY)

#### evt_2025_09_24_GUY_B9

- [ ] Checked (90 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-09-24 |
| Speaker or actor | President of Guyana / Président du Guyana |
| Tier (points) | +5: Legal characterisation and named violations (+5): in the General Debate the President said that Israel's actions had 'shattered any pretense of legitimate self-defense', that what was happening was 'mass extermination, a systematic slaughter and displacement', called it a war crime and called for urgent action 'to halt the genocide' and return the hostages. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The President of Guyana told the General Assembly that Israel's actions in Gaza had shattered any pretence of self-defence and called for urgent action to halt what he called genocide. |
| Summary (FR) | Le président du Guyana a dit à l'Assemblée générale que les actions d'Israël avaient anéanti toute prétention à la légitime défense et a appelé à arrêter ce qu'il a appelé un génocide. |
| Second reading | agree, 2026-10-06 |

Evidence 1: `src_20250924_op_ali-unga80-address` (official, Office of the President, Guyana, 2025-09-24), locator **line 12**, language `en`.
Wayback: <https://web.archive.org/web/20261006042100id_/https://op.gov.gy/president-ali-urges-bold-global-action-to-end-crises-and-uphold-justice-at-unga-80/>

Quote:

> What we are witnessing is not warfare, but mass extermination, a systematic slaughter and displacement of Palestinian men, women, and children.

Mechanical check: found at line 12, starting within the locator (line 12). Archived text at line 12 of `archive/text/src_20250924_op_ali-unga80-address.txt`:

> “What we are witnessing is not warfare, but mass extermination, a systematic slaughter and displacement of Palestinian men, women, and children. Those who escape the bombs and bullets are condemned to die slowly, starved of food, water, and hope. This is a war crime.”

Evidence 2: `src_20250924_op_ali-unga80-address` (official, Office of the President, Guyana, 2025-09-24), locator **line 14**, language `en`.
Wayback: <https://web.archive.org/web/20261006042100id_/https://op.gov.gy/president-ali-urges-bold-global-action-to-end-crises-and-uphold-justice-at-unga-80/>

Quote:

> We must take urgent action to halt the genocide, return the hostages and accelerate our efforts towards the Two-State Solution.

Mechanical check: found at line 14, starting within the locator (line 14). Archived text at line 14 of `archive/text/src_20250924_op_ali-unga80-address.txt`:

> “Impunity must never triumph over justice. We must take urgent action to halt the genocide, return the hostages and accelerate our efforts towards the Two-State Solution. We urge Qatar, Egypt and the United States to continue their efforts in this regard.”

### Honduras (HND)

#### evt_2024_09_25_HND_B9

- [ ] Checked (91 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2024-09-25 |
| Speaker or actor | President of Honduras / Présidente du Honduras |
| Tier (points) | +5: Legal characterisation (+5): at the General Debate the President said that her first action had been to denounce 'el genocidio en contra del pueblo Palestino', that more than 40,000 innocent people had been killed by a bombing that some countries had rewarded with their silence, and demanded an end to it. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The President of Honduras told the General Assembly that she had denounced what she called genocide against the Palestinian people and demanded an end to it. |
| Summary (FR) | La présidente du Honduras a déclaré à l'Assemblée générale qu'elle avait dénoncé ce qu'elle a appelé le génocide du peuple palestinien et en a exigé la fin. |
| Second reading | agree, 2026-10-06 |

Evidence 1: `src_20240925_un-gadebate_hnd-castro-es` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2024-09-25), locator **line 141**, language `es`.
Wayback: <https://web.archive.org/web/20241012033551id_/https://gadebate.un.org/sites/default/files/gastatements/79/hn_es.pdf>

Quote:

> Como Presidenta de Honduras, mi primera acción fue alzar mi voz para denunciar el genocidio en contra del pueblo Palestino. Ya son más de 40 mil personas inocentes asesinadas por un bombardeo al que algunos países han premiado con su silencio. Desde aquí elevo también mi voz exigiendo el fin de éste genocidio.

Translation in the record:

> As President of Honduras, my first action was to raise my voice to denounce the genocide against the Palestinian people. Already more than 40 thousand innocent people have been killed by a bombing that some countries have rewarded with their silence. From here I also raise my voice demanding an end to this genocide.

Mechanical check: found at lines 141–146, starting within the locator (line 141). Archived text at lines 141–146 of `archive/text/src_20240925_un-gadebate_hnd-castro-es.txt`:

> Estados. Como Presidenta de Honduras, mi primera acción fue alzar mi voz para denunciar el genocidio en contra del pueblo Palestino. Ya son más de 40 mil personas inocentes asesinadas por un bombardeo al que algunos países han premiado con su silencio. Desde aquí elevo también mi voz exigiendo el fin de éste genocidio.

#### evt_2023_11_03_HND_B12

- [ ] Checked (92 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B12, standing |
| Date | 2023-11-03 to 2026-08-03 |
| Speaker or actor | Ministry of Foreign Affairs of Honduras / Ministère des Affaires étrangères du Honduras |
| Tier (points) | +5: Recall tier (+5): the Foreign Ministry announced on 3 November 2023 that the Government had decided to call its ambassador to Israel to Tegucigalpa for consultations, citing the humanitarian situation of Palestinian civilians in Gaza; the embassy in Jerusalem stayed open and relations were not broken. The state ended on 3 August 2026, when Israel's President received the credentials of Honduras's new ambassador. |
| Confidence | corroborated |
| Scope | gaza |
| Summary (EN) | The Ministry of Foreign Affairs of Honduras called its ambassador to Israel back to Tegucigalpa for consultations, citing the humanitarian situation of Palestinian civilians in Gaza. |
| Summary (FR) | Le ministère des Affaires étrangères du Honduras a rappelé son ambassadeur en Israël à Tegucigalpa pour consultations, en invoquant la situation humanitaire des civils palestiniens à Gaza. |
| Second reading | agree, 2026-10-06; the notes mention a flag |

Evidence 1: `src_20231103_laprensa-hn_embajador-israel-consultas` (press, La Prensa (Honduras), 2023-11-03), locator **line 2**, language `es`.
Wayback: <https://web.archive.org/web/20261006043141id_/https://www.laprensa.hn/honduras/honduras-embajador-roberto-martinez-consultas-israel-guerra-bombardeos-gaza-palestina-KA16079636>

Quote:

> ante la grave situación humanitaria que sufre la población civil palestina en la franja de Gaza, el gobierno de la presidenta Xiomara Castro ha decidido llamar inmediatamente a consultas a Tegucigalpa al señor Roberto Martínez, embajador de la República de Honduras en Israel

Translation in the record:

> in view of the grave humanitarian situation suffered by the Palestinian civilian population in the Gaza Strip, the Government of President Xiomara Castro has decided to call to Tegucigalpa immediately for consultations Mr Roberto Martínez, Ambassador of the Republic of Honduras in Israel

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20231103_laprensa-hn_embajador-israel-consultas.txt`:

> Mediante redes sociales, el canciller Eduardo Enrique Reina informó que “ante la grave situación humanitaria que sufre la población civil palestina en la franja de Gaza, el gobierno de la presidenta Xiomara Castro ha decidido llamar inmediatamente a consultas a Tegucigalpa al señor Roberto Martínez, embajador de la República de Honduras en Israel”.

Evidence 2: `src_20231104_elheraldo_embajador-israel-consultas` (press, El Heraldo (Honduras), 2023-11-04), locator **line 66**, language `es`.
Wayback: <https://web.archive.org/web/20261006043158id_/https://www.elheraldo.hn/honduras/incertidumbre-relacion-honduras-israel-llamado-gobierno-embajador-roberto-martinez-palestina-IP16088275>

Quote:

> La Cancillería hondureña informó en un comunicado que el “gobierno de la presidenta Xiomara Castro ha decidido llamar inmediatamente a consultas a Tegucigalpa al señor Roberto Martínez (embajador)”.

Translation in the record:

> The Honduran Foreign Ministry said in a communiqué that the “Government of President Xiomara Castro has decided to call to Tegucigalpa immediately for consultations Mr Roberto Martínez (ambassador)”.

Mechanical check: found at line 66, starting within the locator (line 66). Archived text at line 66 of `archive/text/src_20231104_elheraldo_embajador-israel-consultas.txt`:

> La Cancillería hondureña informó en un comunicado que el “gobierno de la presidenta Xiomara Castro ha decidido llamar inmediatamente a consultas a Tegucigalpa al señor Roberto Martínez (embajador)”.

Evidence 3: `src_20260803_embassies-gov-il_herzog-credentials-new-ambassadors` (official, Ministry of Foreign Affairs of Israel (embassies.gov.il), 2026-08-03), locator **line 2**, language `en`.
Wayback: <https://web.archive.org/web/20261006043402id_/https://embassies.gov.il/thailand/en/news/president-herzog-receives-diplomatic-credentials-new-ambassadors-israel-3-aug-2026>

Quote:

> whose countries returned Ambassadors to Israel for the first time since October 7th

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20260803_embassies-gov-il_herzog-credentials-new-ambassadors.txt`:

> President Isaac Herzog today (Monday, 3 August 2026) received the diplomatic credentials of six new Ambassadors to Israel, including from Chile and Honduras, whose countries returned Ambassadors to Israel for the first time since October 7th. In formal ceremonies held at the President’s Residence in Jerusalem, the new Ambassadors of Germany, Alexander Graf Lambsdorff; Chile, Gabriel Alejandro …

### Croatia (HRV)

#### evt_2025_01_17_HRV_C2

- [ ] Checked (93 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | C2, standing |
| Date | 2025-01-17 |
| Speaker or actor | Government of Croatia / Gouvernement de la Croatie |
| Tier (points) | −10: C2 (-10): a memorandum of cooperation in electronic communications and postal services between the Ministry of the Sea, Transport and Infrastructure of Croatia and the Ministry of Communications of Israel, signed on 17 January 2025 by the two ministers (docs/calibration/README.md R18, one event per instrument). |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister of the Sea, Transport and Infrastructure signed with Israel's Minister of Communications a memorandum of cooperation on electronic communications and postal services. |
| Summary (FR) | Le ministre de la Mer, des Transports et des Infrastructures a signé avec le ministre israélien des Communications un mémorandum sur les communications électroniques et les services postaux. |
| Second reading | agree, 2026-11-04; the notes mention a flag |

Evidence 1: `src_20250117_mmpi_memorandum-izrael-komunikacije` (official, Ministry of the Sea, Transport and Infrastructure (Croatia), 2025-01-17), locator **lines 9–11**, language `hr`.
Wayback: <https://web.archive.org/web/20261104022358id_/https://mmpi.gov.hr/UserDocsImages/dokumenti/PRESS/Priop%C4%87enja/Priopcenja_25/Priopcenje%20za%20medije_potpisivanje%20Memoranduma%20o%20suradnji%20s%20Drzavom%20Izrael%2017-1_25.pdf>

Quote:

> Tom je prilikom između Ministarstva mora, prometa i infrastrukture Republike Hrvatske i Ministarstva komunikacija Države Izrael potpisan Memorandum o suradnji u području elektroničkih komunikacija i poštanskih usluga.

Translation in the record:

> On that occasion a Memorandum of cooperation in the field of electronic communications and postal services was signed between the Ministry of the Sea, Transport and Infrastructure of the Republic of Croatia and the Ministry of Communications of the State of Israel.

Mechanical check: found at lines 9–11, starting within the locator (lines 9–11). Archived text at lines 9–11 of `archive/text/src_20250117_mmpi_memorandum-izrael-komunikacije.txt`:

> Tom je prilikom između Ministarstva mora, prometa i infrastrukture Republike Hrvatske i Ministarstva komunikacija Države Izrael potpisan Memorandum o suradnji u području elektroničkih komunikacija i poštanskih usluga. Cilj

#### evt_2025_09_24_HRV_B9

- [ ] Checked (94 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-09-24 |
| Speaker or actor | President of the Republic / Président de la République |
| Tier (points) | +2: Formal call (+2): at the General Debate the President says that in Gaza tens of thousands of women and children have been killed and calls for the carnage to end, for the safe delivery of aid and for the release of all hostages; no party is named. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The President, at the General Debate, called for the fighting in Gaza to end, for the safe delivery of aid and for the release of all hostages. |
| Summary (FR) | Le président a appelé, devant l'Assemblée générale, à mettre fin aux combats à Gaza, à y acheminer l'aide en sécurité et à libérer tous les otages. |
| Second reading | agree, 2026-11-04; the notes mention a flag |

Evidence 1: `src_20250924_predsjednik_milanovic-unga80` (official, Office of the President of the Republic of Croatia, 2025-09-24), locator **line 6**, language `en`.
Wayback: <https://web.archive.org/web/20261104020720id_/https://www.predsjednik.hr/en/news/president-milanovic-at-the-un-we-urgently-call-for-the-carnage-in-gaza-to-end-and-for-the-universal-recognition-of-the-legitimate-political-aspirations-of-the-palestinian-people/>

Quote:

> In Gaza, tens of thousands of women and children have been killed. Millions live without safety, food, medicine, and basic human dignity. This is worse than a mere war – it is carnage and we urgently call for it to end, for safe delivery of aid—especially to children—and for the release of all hostages

Mechanical check: found at line 6, starting within the locator (line 6). Archived text at line 6 of `archive/text/src_20250924_predsjednik_milanovic-unga80.txt`:

> Beyond Europe, other regions face devastating crises. In Gaza, tens of thousands of women and children have been killed. Millions live without safety, food, medicine, and basic human dignity. This is worse than a mere war – it is carnage and we urgently call for it to end, for safe delivery of aid—especially to children—and for the release of all hostages. Lasting peace can only come through the universal recognition of the legitimate political aspirations of the Palestinian people, long denied. It is time to …

#### evt_2023_12_31_HRV_D3

- [ ] Checked (95 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | D3, standing |
| Date | 2023-12-31 to 2024-12-31 |
| Speaker or actor | Government of Croatia / Gouvernement de la Croatie |
| Tier (points) | +8: Increased tier (+8): UNRWA's table for 2023 gives USD 269,687 for Croatia (rank 73), all in the last column before the total (the Gaza flash appeal), against no row in the 2022 table (a zero). |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | Croatia contributed more to UNRWA in 2023 than in 2022, according to UNRWA's donor tables. |
| Summary (FR) | La contribution de la Croatie à l'UNRWA pour 2023 a dépassé celle de 2022, selon les tableaux des donateurs de l'UNRWA. |
| Second reading | agree, 2026-11-04 |

Evidence 1: `src_20231231_unrwa_donor-ranking-2023` (dataset, UNRWA, 2023-12-31), locator **line 92**, language `en`.
Wayback: <https://web.archive.org/web/20240617020444id_/https://www.unrwa.org/sites/default/files/overall_donor_ranking_.pdf>

Quote:

> Croatia 0 0 0 0 0 0 0 0 0 269,687 269,687 73

Mechanical check: found at line 92, starting within the locator (line 92). Archived text at line 92 of `archive/text/src_20231231_unrwa_donor-ranking-2023.txt`:

> Croatia 0 0 0 0 0 0 0 0 0 269,687 269,687 73

### Hungary (HUN)

#### evt_2025_08_11_HUN_B9

- [ ] Checked (96 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-08-11 |
| Speaker or actor | Minister of Foreign Affairs and Trade / Ministre des Affaires étrangères et du Commerce extérieur |
| Tier (points) | +2: Formal call for the end of restrictions on aid (+2): the Minister stated that access to humanitarian aid had to be increased; no violation or its author is named. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister of Foreign Affairs and Trade stated after a call with Israel's Foreign Minister that access to humanitarian aid had to be increased. |
| Summary (FR) | Le ministre des Affaires étrangères et du Commerce extérieur a déclaré après un entretien avec le ministre israélien des Affaires étrangères que l'accès à l'aide humanitaire devait être accru. |
| Second reading | agree, 2026-09-29 |

Evidence 1: `src_20250811_kormany-hu_szijjarto-humanitarius-hozzaferes` (official, Magyarország Kormánya, archive of the 2020–2026 government site (2020-2025.kormany.hu), 2025-08-11), locator **line 2**, language `hu`.
Wayback: <https://web.archive.org/web/20260929014407id_/https://2020-2025.kormany.hu/hirek/szijjarto-peter-izraeli-kollegajaval-egyeztetett-a-kozel-keleti-helyzetrol>

Quote:

> 1. A humanitárius segítséghez való hozzáférést növelni kell!

Translation in the record:

> 1. Access to humanitarian aid must be increased!

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20250811_kormany-hu_szijjarto-humanitarius-hozzaferes.txt`:

> Tájékoztatása szerint a megbeszélés során hivatali partnerével egyetértettek négy fontos kérdésben: "1. A humanitárius segítséghez való hozzáférést növelni kell! 2. A túszokat - köztük a magyar állampolgárságú túszt is - haladéktalanul és feltétel nélkül szabadon kell bocsátani! 3. A biztonságos, terror- és …

#### evt_2026_05_28_HUN_B11

- [ ] Checked (97 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B11, standing |
| Date | 2026-05-28 |
| Speaker or actor | — / — |
| Tier (points) | +5: Sanctions on settler entities (+5): the EU listing of 28 May 2026 (Implementing Regulation (EU) 2026/1177) of four settler organisations and three individuals, adopted by unanimity; it lists Nachala for abuses in the West Bank and the Gaza Strip. The settler tier already holds from 15 July 2024 (one per tier), so it adds no points. |
| Confidence | confirmed |
| Scope | gaza, west-bank |
| Summary (EN) | The government agreed in the EU Council to sanctions on three Israeli settler leaders and four settler organisations, one of them for efforts to resettle the Gaza Strip. |
| Summary (FR) | Le gouvernement a approuvé au Conseil de l'UE des sanctions contre trois dirigeants de colons israéliens et quatre organisations de colons, dont l'une pour son projet de colonisation de Gaza. |
| Second reading | agree, 2026-09-30; the notes mention a flag |

Evidence 1: `src_20260528_eur-lex_reg-impl-2026-1177` (official, Council of the European Union (Official Journal, EUR-Lex), 2026-05-28), locator **line 2**, language `en`.
Wayback: <https://web.archive.org/web/20260529134604id_/https://eur-lex.europa.eu/eli/reg_impl/2026/1177/oj/eng>

Quote:

> the following entries are added to the list of natural or legal persons, entities or bodies under the heading ‘B. Legal persons, entities and bodies’:

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20260528_eur-lex_reg-impl-2026-1177.txt`:

> the following entries are added to the list of natural or legal persons, entities or bodies under the heading ‘B. Legal persons, entities and bodies’:

Evidence 2: `src_20260528_eur-lex_reg-impl-2026-1177` (official, Council of the European Union (Official Journal, EUR-Lex), 2026-05-28), locator **line 27**, language `en`.
Wayback: <https://web.archive.org/web/20260529134604id_/https://eur-lex.europa.eu/eli/reg_impl/2026/1177/oj/eng>

Quote:

> After 7 October 2023, Nachala has furthermore been at the forefront of efforts to resettle the Gaza Strip. Therefore, Nachala is responsible for facilitating and encouraging human rights abuses in the West Bank and the Gaza Strip, including abuses of the right of Palestinians to self-determination, their right to property, their right to private and family life, as well as the right to life and to physical health, which are of serious concern as regards the objectives of the common foreign and security policy set out in Article 21 of the Treaty on European Union.

Mechanical check: found at line 27, starting within the locator (line 27). Archived text at line 27 of `archive/text/src_20260528_eur-lex_reg-impl-2026-1177.txt`:

> After 7 October 2023, Nachala has furthermore been at the forefront of efforts to resettle the Gaza Strip. Therefore, Nachala is responsible for facilitating and encouraging human rights abuses in the West Bank and the Gaza Strip, including abuses of the right of Palestinians to self-determination, their right to property, their right to private and family life, as well as the right to life and to physical health, which are of serious concern as regards the objectives of the common foreign and security policy set out in Article 21 of the Treaty on European Union.

### Indonesia (IDN)

#### evt_2026_06_02_IDN_B9

- [ ] Checked (98 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2026-06-02 |
| Speaker or actor | Minister for Foreign Affairs / Ministre des Affaires étrangères |
| Tier (points) | +5: Legal characterisation (+5): the eight foreign ministers call settler incursions into Al-Aqsa Mosque under the protection of Israeli forces a flagrant violation of international law. Scoped west-bank (East Jerusalem): tracked, not scored in v1 (D-14, docs/10 B-32). |
| Confidence | confirmed |
| Scope | west-bank |
| Summary (EN) | The Minister of Foreign Affairs and seven counterparts called settler incursions into Al-Aqsa Mosque under Israeli protection a violation of international law. |
| Summary (FR) | Le ministre des Affaires étrangères et sept homologues ont qualifié les incursions de colons dans la mosquée Al-Aqsa sous protection israélienne de violation du droit international. |
| Second reading | agree, 2026-11-09 |

Evidence 1: `src_20260602_mfa-tr_eight-ministers-al-aqsa` (official, Ministry of Foreign Affairs of the Republic of Türkiye, 2026-06-02), locator **line 2**, language `en`.
Wayback: <https://web.archive.org/web/20261109031212id_/https://www.mfa.gov.tr/joint-statement-by-the-foreign-ministers-2-june-2026.en.mfa>

Quote:

> They stress that these provocative and unacceptable actions constitute a flagrant violation of international law, the relevant United Nations resolutions, and the historical and legal status quo at the holy sites in occupied East Jerusalem.

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20260602_mfa-tr_eight-ministers-al-aqsa.txt`:

> … into Al-Aqsa Mosque / Al-Haram Al-Sharif under the protection of the Israeli forces, as well as the raising of the Israeli flag within its courtyards. They stress that these provocative and unacceptable actions constitute a flagrant violation of international law, the relevant United Nations resolutions, and the historical and legal status quo at the holy sites in occupied East Jerusalem.

Evidence 2: `src_20260602_mfa-tr_eight-ministers-al-aqsa` (official, Ministry of Foreign Affairs of the Republic of Türkiye, 2026-06-02), locator **line 2**, language `en`.
Wayback: <https://web.archive.org/web/20261109031212id_/https://www.mfa.gov.tr/joint-statement-by-the-foreign-ministers-2-june-2026.en.mfa>

Quote:

> The Foreign Ministers of the Republic of Türkiye, Arab Republic of Egypt, Republic of Indonesia, the Hashemite Kingdom of Jordan

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20260602_mfa-tr_eight-ministers-al-aqsa.txt`:

> The Foreign Ministers of the Republic of Türkiye, Arab Republic of Egypt, Republic of Indonesia, the Hashemite Kingdom of Jordan, Islamic Republic of Pakistan, State of Qatar, Kingdom of Saudi Arabia, and United Arab Emirates condemn in the strongest terms the continued incursions by …

#### evt_2025_12_31_IDN_D3

- [ ] Checked (99 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | D3, standing |
| Date | 2025-12-31 |
| Speaker or actor | Government of Indonesia / Gouvernement de l'Indonésie |
| Tier (points) | +8: Increased tier (+8): UNRWA's table of 2025 gives USD 1,626,000 pledged and USD 1,626,000 received for Indonesia, against USD 200,000 in UNRWA's table of 2022 (nominal USD, docs/02 §2 D3). |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | Indonesia's contribution to UNRWA for 2025 exceeded its 2022 contribution in UNRWA's donor tables. |
| Summary (FR) | La contribution de l'Indonésie à l'UNRWA pour 2025 a dépassé celle de 2022, selon les tableaux des donateurs de l'UNRWA. |
| Second reading | agree, 2026-11-09 |

Evidence 1: `src_20251231_unrwa_donor-ranking-2025` (dataset, UNRWA, 2025-12-31), locator **row Indonesia (lines 49-50)**, language `en`.
Wayback: <https://web.archive.org/web/20260521084310id_/https://www.unrwa.org/sites/default/files/table_3_2025_overall_donor_ranking_confirmed_pledges_and_received_cash_and_in-kind.pdf>

Quote:

> (Baznas)) 1,200,000 1,200,000 - - 1,200,000 1,200,000 - - 426,000 426,000 - - - - 426,000 426,000 1,626,000 39 1,626,000 39

Mechanical check: found at line 50; the locator is not a line number. Archived text at line 50 of `archive/text/src_20251231_unrwa_donor-ranking-2025.txt`:

> (Baznas)) 1,200,000 1,200,000 - - 1,200,000 1,200,000 - - 426,000 426,000 - - - - 426,000 426,000 1,626,000 39 1,626,000 39

Evidence 2: `src_20221231_unrwa_donor-ranking-2022` (dataset, UNRWA, 2022-12-31), locator **line 63 (Indonesia)**, language `en`.
Wayback: <https://web.archive.org/web/20230921090159id_/https://www.unrwa.org/sites/default/files/overall_donor_ranking_2022.pdf>

Quote:

> Indonesia 200,000 0 200,000 0 0 0 200,000 54

Mechanical check: found at line 63, starting within the locator (line 63 (Indonesia)). Archived text at line 63 of `archive/text/src_20221231_unrwa_donor-ranking-2022.txt`:

> Indonesia 200,000 0 200,000 0 0 0 200,000 54

#### evt_2026_07_23_IDN_B9

- [ ] Checked (100 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2026-07-23 |
| Speaker or actor | Minister for Foreign Affairs / Ministre des Affaires étrangères |
| Tier (points) | +5: Legal characterisation (+5): the eight foreign ministers call the access restrictions in the Old City of Jerusalem a flagrant violation of international law, including international humanitarian law. Scoped west-bank (East Jerusalem): tracked, not scored in v1 (D-14, docs/10 B-32). |
| Confidence | confirmed |
| Scope | west-bank |
| Summary (EN) | The Minister of Foreign Affairs and seven counterparts called Israeli access restrictions in the Old City of Jerusalem a violation of international humanitarian law. |
| Summary (FR) | Le ministre des Affaires étrangères et sept homologues ont qualifié les restrictions d'accès israéliennes dans la vieille ville de Jérusalem de violation du droit international humanitaire. |
| Second reading | agree, 2026-11-09 |

Evidence 1: `src_20260723_mfa-tr_eight-ministers-al-aqsa-jerusalem` (official, Ministry of Foreign Affairs of the Republic of Türkiye, 2026-07-23), locator **line 4**, language `en`.
Wayback: <https://web.archive.org/web/20261109031240id_/https://www.mfa.gov.tr/joint-statement-by-the-foreign-ministers-23-july-2026.en.mfa>

Quote:

> Restrictions on access to the Old City of Jerusalem and its places of worship coupled with discriminatory and arbitrary access restrictions to the other places of worship in the old city constitute a flagrant violation of international law, including international humanitarian law

Mechanical check: found at line 4, starting within the locator (line 4). Archived text at line 4 of `archive/text/src_20260723_mfa-tr_eight-ministers-al-aqsa-jerusalem.txt`:

> 3. Restrictions on access to the Old City of Jerusalem and its places of worship coupled with discriminatory and arbitrary access restrictions to the other places of worship in the old city constitute a flagrant violation of international law, including international humanitarian law, and an unlawful attempt to alter the historical and legal status quo.

Evidence 2: `src_20260723_mfa-tr_eight-ministers-al-aqsa-jerusalem` (official, Ministry of Foreign Affairs of the Republic of Türkiye, 2026-07-23), locator **line 2**, language `en`.
Wayback: <https://web.archive.org/web/20261109031240id_/https://www.mfa.gov.tr/joint-statement-by-the-foreign-ministers-23-july-2026.en.mfa>

Quote:

> 1. The Foreign Ministers of the Republic of Türkiye, Arab Republic of Egypt, Republic of Indonesia, the Hashemite Kingdom of Jordan

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20260723_mfa-tr_eight-ministers-al-aqsa-jerusalem.txt`:

> 1. The Foreign Ministers of the Republic of Türkiye, Arab Republic of Egypt, Republic of Indonesia, the Hashemite Kingdom of Jordan, Islamic Republic of Pakistan, State of Qatar, Kingdom of Saudi Arabia, and the United Arab Emirates condemn in the strongest terms the Israeli escalation at …

### India (IND)

#### evt_2026_09_24_IND_B9

- [ ] Checked (101 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2026-09-24 |
| Speaker or actor | Minister of External Affairs / Ministre des Affaires extérieures |
| Tier (points) | +2: Formal call for a ceasefire and humanitarian access (+2): in a joint statement with the foreign ministers of Brazil and South Africa, the Minister urges all parties to maintain the ceasefire and ensure full and unhindered humanitarian access in the Gaza Strip and calls for halting any policies aimed at the forced displacement of Palestinians from Gaza; read at the call tier because the statement names no act as a violation (the +5 reading, forced displacement named, is flagged for the author). |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister of External Affairs, with the foreign ministers of Brazil and South Africa, urged all parties to maintain the ceasefire and ensure unhindered humanitarian access in the Gaza Strip. |
| Summary (FR) | Le ministre des Affaires extérieures, avec ses homologues du Brésil et d'Afrique du Sud, a exhorté les parties à maintenir le cessez-le-feu et l'accès humanitaire sans entrave à Gaza. |
| Second reading | agree, 2026-11-09 |

Evidence 1: `src_20260928_mea_ibsa-14th-ministerial-media-statement` (official, Ministry of External Affairs, Government of India, 2026-09-28), locator **line 15**, language `en`.
Wayback: <https://web.archive.org/web/20261109022911id_/https://www.mea.gov.in/FrontEnd/FetchPublicationDetailData?pkid=41832&languageId=1>

Quote:

> The Ministers called for the implementation of the relevant UNGA and UNSC Resolutions and urged all parties to ensure the maintenance of ceasefire and full and unhindered humanitarian access in the Gaza Strip.

Mechanical check: found at line 15, starting within the locator (line 15). Archived text at line 15 of `archive/text/src_20260928_mea_ibsa-14th-ministerial-media-statement.txt`:

> 13. The Ministers called for the implementation of the relevant UNGA and UNSC Resolutions and urged all parties to ensure the maintenance of ceasefire and full and unhindered humanitarian access in the Gaza Strip. In this context, they expressed deep concern about the continued violence in Gaza despite the ceasefire agreement of October 2025. They called for halting any …

Evidence 2: `src_20260928_mea_ibsa-14th-ministerial-media-statement` (official, Ministry of External Affairs, Government of India, 2026-09-28), locator **line 15**, language `en`.
Wayback: <https://web.archive.org/web/20261109022911id_/https://www.mea.gov.in/FrontEnd/FetchPublicationDetailData?pkid=41832&languageId=1>

Quote:

> They called for halting any policies aimed at forced displacement of Palestinians from Gaza Strip

Mechanical check: found at line 15, starting within the locator (line 15). Archived text at line 15 of `archive/text/src_20260928_mea_ibsa-14th-ministerial-media-statement.txt`:

> … access in the Gaza Strip. In this context, they expressed deep concern about the continued violence in Gaza despite the ceasefire agreement of October 2025. They called for halting any policies aimed at forced displacement of Palestinians from Gaza Strip and expressed concern regarding arrangements that may prejudice the inalienable rights of the Palestinian people and legitimise or prolong occupation. They …

Evidence 3: `src_20260928_mea_ibsa-14th-ministerial-media-statement` (official, Ministry of External Affairs, Government of India, 2026-09-28), locator **line 3**, language `en`.
Wayback: <https://web.archive.org/web/20261109022911id_/https://www.mea.gov.in/FrontEnd/FetchPublicationDetailData?pkid=41832&languageId=1>

Quote:

> H.E. Dr. Subrahmanyam Jaishankar, Minister of External Affairs of the Republic of India

Mechanical check: found at line 3, starting within the locator (line 3). Archived text at line 3 of `archive/text/src_20260928_mea_ibsa-14th-ministerial-media-statement.txt`:

> 1. Honourable Mr Ronald Lamola, Minister of International Relations and Cooperation of the Republic of South Africa, H.E. Dr. Subrahmanyam Jaishankar, Minister of External Affairs of the Republic of India, and H.E. Ambassador Mauro Vieira, Minister of Foreign Affairs of the Federative Republic of Brazil (hereinafter referred to as "the Ministers") met on the …

#### evt_2024_12_10_IND_B9

- [ ] Checked (102 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2024-12-10 |
| Speaker or actor | Minister of External Affairs / Ministre des Affaires extérieures |
| Tier (points) | +2: Formal call for a ceasefire (+2): the Minister calls for an early ceasefire and the release of all hostages in the conflict in Gaza; no specific violation is named. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister of External Affairs told the India–Bahrain High Joint Commission that India called for an early ceasefire in Gaza and the release of all hostages. |
| Summary (FR) | Le ministre des Affaires extérieures a déclaré devant la Haute Commission mixte Inde–Bahreïn que l'Inde appelait à un cessez-le-feu rapide à Gaza et à la libération de tous les otages. |
| Second reading | agree, 2026-09-28 |

Evidence 1: `src_20241210_mea_eam-india-bahrain-hjc` (official, Ministry of External Affairs, Government of India, 2024-12-10), locator **line 12**, language `en`.
Wayback: <https://web.archive.org/web/20251002114110id_/https://www.mea.gov.in/Speeches-Statements.htm?dtl/38738/external+affairs+minister+dr+s+jaishankars+opening+statement+at+the+4th+indiabahrain+high+join>

Quote:

> It is a region of deep strategic interest to India and certainly in recent times, it is a region where there is cause for deep concern particularly over the conflict in Gaza.

Mechanical check: found at line 12, starting within the locator (line 12). Archived text at line 12 of `archive/text/src_20241210_mea_eam-india-bahrain-hjc.txt`:

> You referred Excellency to issues pertaining to the peace and stability of West Asia/Middle East region. It is a region of deep strategic interest to India and certainly in recent times, it is a region where there is cause for deep concern particularly over the conflict in Gaza. India has a principled position. We condemn acts of terrorism and loss of civilian lives in the conflict. We believe in adherence to international …

Evidence 2: `src_20241210_mea_eam-india-bahrain-hjc` (official, Ministry of External Affairs, Government of India, 2024-12-10), locator **line 12**, language `en`.
Wayback: <https://web.archive.org/web/20251002114110id_/https://www.mea.gov.in/Speeches-Statements.htm?dtl/38738/external+affairs+minister+dr+s+jaishankars+opening+statement+at+the+4th+indiabahrain+high+join>

Quote:

> And we call for an early ceasefire and release of all hostages.

Mechanical check: found at line 12, starting within the locator (line 12). Archived text at line 12 of `archive/text/src_20241210_mea_eam-india-bahrain-hjc.txt`:

> … in adherence to international humanitarian law. We have emphasised the importance of safe and timely supply of humanitarian aid to the people of Palestine. And we call for an early ceasefire and release of all hostages. India has consistently supported the resolution of the Palestine issue through a Two-State solution. We have also contributed to the building of Palestinian …

### Ireland (IRL)

#### evt_2024_02_19_IRL_B9

- [ ] Checked (103 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2024-02-19 |
| Speaker or actor | Tánaiste and Minister for Foreign Affairs / Tánaiste et ministre des Affaires étrangères |
| Tier (points) | +2: Formal call for a ceasefire (+2): the 26 foreign ministers call for an immediate humanitarian pause leading to a sustainable ceasefire and ask Israel not to launch a military operation in Rafah; no violation is named. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Tánaiste and Minister for Foreign Affairs signed a declaration of 26 EU foreign ministers calling for an immediate humanitarian pause leading to a sustainable ceasefire in Gaza. |
| Summary (FR) | Le Tánaiste et ministre des Affaires étrangères a signé une déclaration de 26 ministres de l'UE appelant à une pause humanitaire immédiate menant à un cessez-le-feu durable à Gaza. |
| Second reading | agree, 2026-09-30 |

Evidence 1: `src_20240219_lahbib-belgium_declaration-26-ministres` (official, Minister of Foreign Affairs of Belgium (Hadja Lahbib), 2024-02-19), locator **line 5**, language `fr`.
Wayback: <https://web.archive.org/web/20241109221138id_/https://lahbib.belgium.be/fr/israelpalestine-declaration-a-initiative-de-la-belgique>

Quote:

> Cela nécessite une pause humanitaire immédiate qui conduirait à un cessez-le-feu durable, à la libération inconditionnelle de tous les otages et à la mise en place d'une assistance humanitaire.

Translation in the record:

> This requires an immediate humanitarian pause that would lead to a sustainable ceasefire, the unconditional release of all hostages and the provision of humanitarian assistance.

Mechanical check: found at line 5, starting within the locator (line 5). Archived text at line 5 of `archive/text/src_20240219_lahbib-belgium_declaration-26-ministres.txt`:

> Cela nécessite une pause humanitaire immédiate qui conduirait à un cessez-le-feu durable, à la libération inconditionnelle de tous les otages et à la mise en place d'une assistance humanitaire.

Evidence 2: `src_20240219_lahbib-belgium_declaration-26-ministres` (official, Minister of Foreign Affairs of Belgium (Hadja Lahbib), 2024-02-19), locator **line 1**, language `fr`.
Wayback: <https://web.archive.org/web/20241109221138id_/https://lahbib.belgium.be/fr/israelpalestine-declaration-a-initiative-de-la-belgique>

Quote:

> Israël/Palestine : Déclaration des ministres des Affaires étrangères de l'Autriche, de la Belgique, de la Bulgarie, de la Croatie, de Chypre, de la République tchèque, du Danemark, de l'Estonie, de la Finlande, de la France, de l'Allemagne, de la Grèce, de l'Irlande

Translation in the record:

> Israel/Palestine: Statement by the Foreign Ministers of Austria, Belgium, Bulgaria, Croatia, Cyprus, the Czech Republic, Denmark, Estonia, Finland, France, Germany, Greece, Ireland

Mechanical check: found at line 1, starting within the locator (line 1). Archived text at line 1 of `archive/text/src_20240219_lahbib-belgium_declaration-26-ministres.txt`:

> Israël/Palestine : Déclaration des ministres des Affaires étrangères de l'Autriche, de la Belgique, de la Bulgarie, de la Croatie, de Chypre, de la République tchèque, du Danemark, de l'Estonie, de la Finlande, de la France, de l'Allemagne, de la Grèce, de l'Irlande, de l'Italie, de la Lettonie, de la Lituanie, du Luxembourg, de Malte, des Pays-Bas, de la Pologne, du Portugal, de la Roumanie, de la Slovaquie, de la …

#### evt_2025_09_26_IRL_B9

- [ ] Checked (104 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-09-26 |
| Speaker or actor | Taoiseach / Taoiseach (Premier ministre) |
| Tier (points) | +5: Names specific violations (+5): hunger used as an instrument of war and the targeting of hospitals, with the call for an immediate ceasefire. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Taoiseach stated at the UN General Assembly that hunger is being used as an instrument of war in Gaza and called for an immediate ceasefire. |
| Summary (FR) | Le Taoiseach a déclaré à l'Assemblée générale des Nations unies que la faim était utilisée comme arme de guerre à Gaza et a appelé à un cessez-le-feu immédiat. |
| Second reading | agree, 2026-09-28 |

Evidence 1: `src_20250926_gov-ie_taoiseach-unga-80` (official, Department of the Taoiseach (Ireland), 2025-09-26), locator **line 109**, language `en`.
Wayback: <https://web.archive.org/web/20260521114142id_/https://www.gov.ie/en/department-of-the-taoiseach/speeches/national-statement-by-taoiseach-miche%C3%A1l-martin-to-the-80th-session-of-the-united-nations-general-assembly-26th-september-2025/>

Quote:

> We are witnessing hunger being used as an instrument of war.

Mechanical check: found at line 109, starting within the locator (line 109). Archived text at line 109 of `archive/text/src_20250926_gov-ie_taoiseach-unga-80.txt`:

> We are witnessing hunger being used as an instrument of war.

Evidence 2: `src_20250926_gov-ie_taoiseach-unga-80` (official, Department of the Taoiseach (Ireland), 2025-09-26), locator **line 112**, language `en`.
Wayback: <https://web.archive.org/web/20260521114142id_/https://www.gov.ie/en/department-of-the-taoiseach/speeches/national-statement-by-taoiseach-miche%C3%A1l-martin-to-the-80th-session-of-the-united-nations-general-assembly-26th-september-2025/>

Quote:

> The deliberate targeting and destruction of schools, hospitals, mosques, cultural institutions.

Mechanical check: found at line 112, starting within the locator (line 112). Archived text at line 112 of `archive/text/src_20250926_gov-ie_taoiseach-unga-80.txt`:

> The deliberate targeting and destruction of schools, hospitals, mosques, cultural institutions.

Evidence 3: `src_20250926_gov-ie_taoiseach-unga-80` (official, Department of the Taoiseach (Ireland), 2025-09-26), locator **lines 117–118**, language `en`.
Wayback: <https://web.archive.org/web/20260521114142id_/https://www.gov.ie/en/department-of-the-taoiseach/speeches/national-statement-by-taoiseach-miche%C3%A1l-martin-to-the-80th-session-of-the-united-nations-general-assembly-26th-september-2025/>

Quote:

> Having examined carefully Israel’s conduct of the war since 2023, as well as the actions and statements of senior Israeli military and political figures, it concluded that Israel is responsible for the commission of genocide in Gaza. Genocide. The gravest of crimes in international law.

Mechanical check: found at lines 117–118, starting within the locator (lines 117–118). Archived text at lines 117–118 of `archive/text/src_20250926_gov-ie_taoiseach-unga-80.txt`:

> Having examined carefully Israel’s conduct of the war since 2023, as well as the actions and statements of senior Israeli military and political figures, it concluded that Israel is responsible for the commission of genocide in Gaza. Genocide. The gravest of crimes in international law.

Evidence 4: `src_20250926_gov-ie_taoiseach-unga-80` (official, Department of the Taoiseach (Ireland), 2025-09-26), locator **line 135**, language `en`.
Wayback: <https://web.archive.org/web/20260521114142id_/https://www.gov.ie/en/department-of-the-taoiseach/speeches/national-statement-by-taoiseach-miche%C3%A1l-martin-to-the-80th-session-of-the-united-nations-general-assembly-26th-september-2025/>

Quote:

> There must be an immediate ceasefire, the release of all remaining hostages

Mechanical check: found at line 135, starting within the locator (line 135). Archived text at line 135 of `archive/text/src_20250926_gov-ie_taoiseach-unga-80.txt`:

> There must be an immediate ceasefire, the release of all remaining hostages, and unimpeded access for humanitarian aid and workers to Gaza.

#### evt_2026_09_15_IRL_C4

- [ ] Checked (105 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | C4, standing |
| Date | 2026-09-15 |
| Speaker or actor | Government of Ireland / Gouvernement de l'Irlande |
| Tier (points) | +5: Ban tier (+5): the import of goods from designated Israeli settlement postal codes is prohibited by law. |
| Confidence | confirmed |
| Scope | west-bank |
| Summary (EN) | The Israeli Settlements in the Occupied Palestinian Territory (Prohibition of Importation of Goods) Act 2026 prohibited imports of goods from Israeli settlements from 15 September 2026. |
| Summary (FR) | La loi de 2026 sur les colonies israéliennes dans le Territoire palestinien occupé a interdit l'importation de marchandises des colonies israéliennes à partir du 15 septembre 2026. |
| Second reading | agree, 2026-09-28 |

Evidence 1: `src_20260915_revenue_opt-import-prohibition` (official, Revenue Commissioners (Ireland), 2026-09-15), locator **line 2**, language `en`.
Wayback: <https://web.archive.org/web/20260928132627id_/https://www.revenue.ie/en/customs/businesses/prohibitions-restrictions/occupied-palestinian-territories/index.aspx>

Quote:

> The Israeli Settlements in the Occupied Palestinian Territory (Prohibition of Importation of Goods) Act 2026 will commence on 15 September 2026. From that date, importing goods from certain designated postal codes in the Occupied Palestinian Territory will be prohibited under the Customs Act 2015.

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20260915_revenue_opt-import-prohibition.txt`:

> The Israeli Settlements in the Occupied Palestinian Territory (Prohibition of Importation of Goods) Act 2026 will commence on 15 September 2026. From that date, importing goods from certain designated postal codes in the Occupied Palestinian Territory will be prohibited under the Customs Act 2015.

Evidence 2: `src_20260915_revenue_opt-import-prohibition` (official, Revenue Commissioners (Ireland), 2026-09-15), locator **line 4**, language `en`.
Wayback: <https://web.archive.org/web/20260928132627id_/https://www.revenue.ie/en/customs/businesses/prohibitions-restrictions/occupied-palestinian-territories/index.aspx>

Quote:

> Such postal codes correspond to settlements in areas brought under Israeli administration since June 1967, including East Jerusalem.

Mechanical check: found at line 4, starting within the locator (line 4). Archived text at line 4 of `archive/text/src_20260915_revenue_opt-import-prohibition.txt`:

> … These postal codes are also used in the EU to verify eligibility for preferential tariff treatment under an agreement between the European Union and Israel. Such postal codes correspond to settlements in areas brought under Israeli administration since June 1967, including East Jerusalem. Certain of these postal codes may qualify for exemption from the Act, in accordance with section 6 (see below).

#### evt_2026_10_12_IRL_B9

- [ ] Checked (106 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2026-10-12 |
| Speaker or actor | Minister for Foreign Affairs and Trade / Ministre des Affaires étrangères et du Commerce |
| Tier (points) | +2: Formal call to end restrictions on humanitarian access (+2): the Minister says efforts on Gaza must remain focused on rapid and unimpeded passage of humanitarian aid; the breaches of human rights she names are tied to the settlements and the West Bank, not to conduct in Gaza. |
| Confidence | confirmed |
| Scope | gaza, west-bank |
| Summary (EN) | The Minister for Foreign Affairs and Trade said efforts on Gaza must focus on the rapid and unimpeded passage of humanitarian aid and called for EU action on trade with settlements. |
| Summary (FR) | La ministre des Affaires étrangères a déclaré que les efforts sur Gaza devaient viser le passage rapide et sans entrave de l'aide et a appelé l'UE à agir sur le commerce avec les colonies. |
| Second reading | agree, 2026-11-09 |

Evidence 1: `src_20261012_gov-ie_mcentee-fac-luxembourg-gaza` (official, Department of Foreign Affairs and Trade (Ireland), 2026-10-12), locator **line 6**, language `en`.
Wayback: <https://web.archive.org/web/20261012214228id_/https://www.gov.ie/en/department-of-foreign-affairs/press-releases/minister-for-foreign-affairs-and-trade-helen-mcentee-attends-meeting-of-european-union-foreign-ministers/>

Quote:

> Our immediate efforts on Gaza must remain focused on rapid and unimpeded passage of humanitarian aid.

Mechanical check: found at line 6, starting within the locator (line 6). Archived text at line 6 of `archive/text/src_20261012_gov-ie_mcentee-fac-luxembourg-gaza.txt`:

> … Settlement expansion, including the illegal West Bank settlement project, and associated settler violence in the occupied West Bank are without precedent. Our immediate efforts on Gaza must remain focused on rapid and unimpeded passage of humanitarian aid.

Evidence 2: `src_20261012_gov-ie_mcentee-fac-luxembourg-gaza` (official, Department of Foreign Affairs and Trade (Ireland), 2026-10-12), locator **line 7**, language `en`.
Wayback: <https://web.archive.org/web/20261012214228id_/https://www.gov.ie/en/department-of-foreign-affairs/press-releases/minister-for-foreign-affairs-and-trade-helen-mcentee-attends-meeting-of-european-union-foreign-ministers/>

Quote:

> The ongoing and egregious Israeli breaches of human rights and unilateral actions that undermine the two State solution require concrete action to be taken at the EU level.

Mechanical check: found at line 7, starting within the locator (line 7). Archived text at line 7 of `archive/text/src_20261012_gov-ie_mcentee-fac-luxembourg-gaza.txt`:

> “Together with a number of EU colleagues, I reiterated the call for action at EU level on the issue of trade with settlements. The ongoing and egregious Israeli breaches of human rights and unilateral actions that undermine the two State solution require concrete action to be taken at the EU level. The two-state Solution is the only path to secure lasting peace between Israelis and Palestinians, and for the wider region. I note with regret the …

#### evt_2026_09_24_IRL_B9

- [ ] Checked (107 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2026-09-24 |
| Speaker or actor | Taoiseach / Taoiseach (Premier ministre) |
| Tier (points) | +5: Names a specific violation (+5): the Taoiseach says the most basic humanitarian aid to Gaza is deliberately impeded and that humanitarian aid remains blocked, as the obstruction of aid named in evt_2025_05_21_IRL_B9. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Taoiseach stated at the UN General Assembly that humanitarian aid to Gaza remains blocked and is deliberately impeded. |
| Summary (FR) | Le Taoiseach a déclaré à l'Assemblée générale des Nations unies que l'aide humanitaire destinée à Gaza restait bloquée et était délibérément entravée. |
| Second reading | agree, 2026-11-10 |

Evidence 1: `src_20260924_un-gadebate_irl-martin-81st` (official, United Nations General Assembly, General Debate statements (gadebate.un.org); text issued by the Government Press Office of Ireland, 2026-09-24), locator **line 154**, language `en`.
Wayback: <https://web.archive.org/web/20261022075301id_/https://gadebate.un.org/sites/default/files/gastatements/81/ie_en.pdf>

Quote:

> Israeli strikes continue. Humanitarian aid remains blocked.

Mechanical check: found at line 154, starting within the locator (line 154). Archived text at line 154 of `archive/text/src_20260924_un-gadebate_irl-martin-81st.txt`:

> Israeli strikes continue. Humanitarian aid remains blocked. Civilians continue to

Evidence 2: `src_20260924_un-gadebate_irl-martin-81st` (official, United Nations General Assembly, General Debate statements (gadebate.un.org); text issued by the Government Press Office of Ireland, 2026-09-24), locator **line 177**, language `en`.
Wayback: <https://web.archive.org/web/20261022075301id_/https://gadebate.un.org/sites/default/files/gastatements/81/ie_en.pdf>

Quote:

> Where the most basic humanitarian aid – food and shelter – is deliberately impeded?

Mechanical check: found at line 177, starting within the locator (line 177). Archived text at line 177 of `archive/text/src_20260924_un-gadebate_irl-martin-81st.txt`:

> Where the most basic humanitarian aid – food and shelter – is deliberately impeded?

Evidence 3: `src_20260924_un-gadebate_irl-martin-81st` (official, United Nations General Assembly, General Debate statements (gadebate.un.org); text issued by the Government Press Office of Ireland, 2026-09-24), locator **line 180**, language `en`.
Wayback: <https://web.archive.org/web/20261022075301id_/https://gadebate.un.org/sites/default/files/gastatements/81/ie_en.pdf>

Quote:

> true horrors are finally and fully revealed, it will shame the world.

Mechanical check: found at line 180, starting within the locator (line 180). Archived text at line 180 of `archive/text/src_20260924_un-gadebate_irl-martin-81st.txt`:

> true horrors are finally and fully revealed, it will shame the world.

#### evt_2025_05_21_IRL_B9

- [ ] Checked (108 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-05-21 |
| Speaker or actor | Taoiseach / Taoiseach (Premier ministre) |
| Tier (points) | +5: Names specific violations (+5): the Taoiseach named the obstruction of life-saving aid by Israel as a violation of its international obligations. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Taoiseach stated in Dáil Éireann that Israel's obstruction of aid to Gaza is a violation of its international obligations. |
| Summary (FR) | Le Taoiseach a déclaré au Dáil Éireann que l'entrave par Israël à l'aide destinée à Gaza constituait une violation de ses obligations internationales. |
| Second reading | agree, 2026-09-28 |

Evidence 1: `src_20250521_gov-ie_taoiseach-dail-gaza` (official, Department of the Taoiseach (Ireland), 2025-05-21), locator **line 59**, language `en`.
Wayback: <https://web.archive.org/web/20260313011916id_/https://www.gov.ie/en/department-of-the-taoiseach/speeches/speech-by-taoiseach-miche%C3%A1l-martin-on-gaza-in-d%C3%A1il-%C3%A9ireann/>

Quote:

> The obstruction of life-saving aid by Israel is a violation of its international obligations.

Mechanical check: found at line 59, starting within the locator (line 59). Archived text at line 59 of `archive/text/src_20250521_gov-ie_taoiseach-dail-gaza.txt`:

> The obstruction of life-saving aid by Israel is a violation of its international obligations.

Evidence 2: `src_20250521_gov-ie_taoiseach-dail-gaza` (official, Department of the Taoiseach (Ireland), 2025-05-21), locator **line 60**, language `en`.
Wayback: <https://web.archive.org/web/20260313011916id_/https://www.gov.ie/en/department-of-the-taoiseach/speeches/speech-by-taoiseach-miche%C3%A1l-martin-on-gaza-in-d%C3%A1il-%C3%A9ireann/>

Quote:

> So too would be the large-scale displacement of the population

Mechanical check: found at line 60, starting within the locator (line 60). Archived text at line 60 of `archive/text/src_20250521_gov-ie_taoiseach-dail-gaza.txt`:

> So too would be the large-scale displacement of the population, were Israel to put plans to move Gaza’s population to the south of the strip into action.

### Iran (Islamic Republic of) (IRN)

#### evt_2025_09_24_IRN_B9

- [ ] Checked (109 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-09-24 |
| Speaker or actor | President of the Islamic Republic of Iran / Président de la République islamique d'Iran |
| Tier (points) | +5: Named violations and a legal characterisation (+5): the President lists 'The genocide in Gaza' among what the world has witnessed in two years and speaks of the destruction of homes, hospitals, clinics and schools in Gaza and of the blocking of access to water, food and medicine. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The President told the General Assembly that the world had witnessed what he called the genocide in Gaza and the destruction of homes, hospitals and schools there. |
| Summary (FR) | Le président a déclaré à l'Assemblée générale que le monde avait été témoin de ce qu'il a appelé le génocide à Gaza et de la destruction de maisons, d'hôpitaux et d'écoles. |
| Second reading | agree, 2026-11-04; the notes mention a flag |

Evidence 1: `src_20250924_un-gadebate_irn-pezeshkian-en` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2025-09-24), locator **line 32**, language `en`.
Wayback: <https://web.archive.org/web/20260812153413id_/https://gadebate.un.org/sites/default/files/gastatements/80/ir_en.pdf>

Quote:

> The genocide in Gaza,

Mechanical check: found at line 32, starting within the locator (line 32). Archived text at line 32 of `archive/text/src_20250924_un-gadebate_irn-pezeshkian-en.txt`:

> The genocide in Gaza,

Evidence 2: `src_20250924_un-gadebate_irn-pezeshkian-en` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2025-09-24), locator **line 56**, language `en`.
Wayback: <https://web.archive.org/web/20260812153413id_/https://gadebate.un.org/sites/default/files/gastatements/80/ir_en.pdf>

Quote:

> Gaza, destroying their homes, hospitals, clinics, and schools, and blocking access

Mechanical check: found at line 56, starting within the locator (line 56). Archived text at line 56 of `archive/text/src_20250924_un-gadebate_irn-pezeshkian-en.txt`:

> Gaza, destroying their homes, hospitals, clinics, and schools, and blocking access

Evidence 3: `src_20250924_un-gadebate_irn-pezeshkian-en` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2025-09-24), locator **line 57**, language `en`.
Wayback: <https://web.archive.org/web/20260812153413id_/https://gadebate.un.org/sites/default/files/gastatements/80/ir_en.pdf>

Quote:

> to water, food, bread, and medicine.

Mechanical check: found at line 57, starting within the locator (line 57). Archived text at line 57 of `archive/text/src_20250924_un-gadebate_irn-pezeshkian-en.txt`:

> to water, food, bread, and medicine.

### Iraq (IRQ)

#### evt_2024_12_31_IRQ_D3

- [ ] Checked (110 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | D3, standing |
| Date | 2024-12-31 to 2025-12-31 |
| Speaker or actor | Government of Iraq / Gouvernement de l'Iraq |
| Tier (points) | +8: Increased tier (+8): Iraq's 2024 contribution to UNRWA (USD 25,000,000) exceeds its 2022 contribution in nominal USD per UNRWA's donor tables (no row for Iraq in the 2022 table: a contribution of zero) (docs/02 §2 D3; docs/calibration/README.md R10). |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | Iraq contributed more to UNRWA in 2024 than in 2022, according to UNRWA's donor tables. |
| Summary (FR) | La contribution de l'Iraq à l'UNRWA pour 2024 a dépassé celle de 2022, selon les tableaux des donateurs de l'UNRWA. |
| Second reading | agree, 2026-11-04; the notes mention a flag |

Evidence 1: `src_20241231_unrwa_donor-ranking-2024` (dataset, UNRWA, 2024-12-31), locator **line 24**, language `en`.
Wayback: <https://web.archive.org/web/20260521084323id_/https://www.unrwa.org/sites/default/files/overall_donor_ranking_by_pledged_and_received_002.pdf>

Quote:

> Iraq - - - - - - - - - - - - - - - - 25,000,000 25,000,000 25,000,000 25,000,000 25,000,000 16 25,000,000 15

Mechanical check: found at line 24, starting within the locator (line 24). Archived text at line 24 of `archive/text/src_20241231_unrwa_donor-ranking-2024.txt`:

> Iraq - - - - - - - - - - - - - - - - 25,000,000 25,000,000 25,000,000 25,000,000 25,000,000 16 25,000,000 15

### Iceland (ISL)

#### evt_2025_08_29_ISL_B9

- [ ] Checked (111 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-08-29 |
| Speaker or actor | Minister for Foreign Affairs / Ministre des Affaires étrangères |
| Tier (points) | +5: Names specific violations (+5): the foreign ministers condemn the new offensive and call the forced displacement of Palestinians a flagrant violation of international law, and say the confirmed famine requires Israel to uphold its humanitarian obligations. |
| Confidence | confirmed |
| Scope | gaza, west-bank |
| Summary (EN) | The Minister for Foreign Affairs, with five other foreign ministers, condemned Israel's new offensive in Gaza and said forced displacement violated international law. |
| Summary (FR) | La ministre des Affaires étrangères, avec cinq autres ministres, a condamné la nouvelle offensive d'Israël à Gaza et déclaré que le déplacement forcé violait le droit international. |
| Second reading | agree, 2026-10-13 |

Evidence 1: `src_20250829_government-is_joint-statement-situation-palestine` (official, Ministry for Foreign Affairs of Iceland (government.is), 2025-08-29), locator **line 4**, language `en`.
Wayback: <https://web.archive.org/web/20261013143224id_/https://www.government.is/news/article/2025-08-29-Joint-Statement-on-the-situation-in-Palestine/>

Quote:

> We also denounce the forced displacement of Palestinians, which represents a flagrant violation of international law.

Mechanical check: found at line 4, starting within the locator (line 4). Archived text at line 4 of `archive/text/src_20250829_government-is_joint-statement-situation-palestine.txt`:

> … cruelly remain at the hands of Hamas and will lead to the intolerable deaths of innocent Palestinian civilians, including women, children and elderly people. We also denounce the forced displacement of Palestinians, which represents a flagrant violation of international law.

Evidence 2: `src_20250829_government-is_joint-statement-situation-palestine` (official, Ministry for Foreign Affairs of Iceland (government.is), 2025-08-29), locator **line 6**, language `en`.
Wayback: <https://web.archive.org/web/20261013143224id_/https://www.government.is/news/article/2025-08-29-Joint-Statement-on-the-situation-in-Palestine/>

Quote:

> We are horrified by the Integrated Food Security Phase Classification’s (IPC) confirmation of famine in Gaza Governorate and the projected spread to surrounding areas in the coming weeks. We call on Israel to uphold its humanitarian obligations, as required under international law.

Mechanical check: found at line 6, starting within the locator (line 6). Archived text at line 6 of `archive/text/src_20250829_government-is_joint-statement-situation-palestine.txt`:

> We are horrified by the Integrated Food Security Phase Classification’s (IPC) confirmation of famine in Gaza Governorate and the projected spread to surrounding areas in the coming weeks. We call on Israel to uphold its humanitarian obligations, as required under international law. The humanitarian situation remains critical and must immediately be addressed. UN agencies and NGOs must be allowed to fully operate on the ground to …

Evidence 3: `src_20250829_government-is_joint-statement-situation-palestine` (official, Ministry for Foreign Affairs of Iceland (government.is), 2025-08-29), locator **line 9**, language `en`.
Wayback: <https://web.archive.org/web/20261013143224id_/https://www.government.is/news/article/2025-08-29-Joint-Statement-on-the-situation-in-Palestine/>

Quote:

> Thorgerdur Katrin Gunnarsdottir, Minister for Foreign Affairs of Iceland.

Mechanical check: found at line 9, starting within the locator (line 9). Archived text at line 9 of `archive/text/src_20250829_government-is_joint-statement-situation-palestine.txt`:

> Thorgerdur Katrin Gunnarsdottir, Minister for Foreign Affairs of Iceland.

### Italy (ITA)

#### evt_2024_01_27_ITA_D2

- [ ] Checked (112 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | D2, standing |
| Date | 2024-01-27 to 2024-05-25 |
| Speaker or actor | Deputy President of the Council and Minister of Foreign Affairs / Vice-président du Conseil et ministre des Affaires étrangères |
| Tier (points) | −10 |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Government suspended its funding to UNRWA, as the Minister of Foreign Affairs announced; the Minister ordered its resumption on 25 May 2024. |
| Summary (FR) | Le gouvernement a suspendu son financement de l'UNRWA, selon l'annonce du ministre des Affaires étrangères ; le ministre en a ordonné la reprise le 25 mai 2024. |
| Second reading | agree, 2026-09-28 |

Evidence 1: `src_20240127_ansa_tajani-sospende-unrwa` (press, Agenzia ANSA, 2024-01-27), locator **line 255 (the Minister's post on X, quoted by ANSA)**, language `it`.
Wayback: <https://web.archive.org/web/20260928170101id_/https://www.ansa.it/sito/notizie/mondo/2024/01/27/tajani-anche-litalia-sospende-i-finanziamenti-allunrwa_b78eb908-406d-4e0a-a3ed-ba438edee91d.html>

Quote:

> Il governo italiano ha sospeso finanziamenti all'Unrwa, dopo l'atroce attacco di Hamas contro Israele del 7 ottobre.

Translation in the record:

> The Italian government has suspended funding to UNRWA, after Hamas's atrocious attack against Israel of 7 October.

Mechanical check: found at line 255, starting within the locator (line 255 (the Minister's post on X, quoted by ANSA)). Archived text at line 255 of `archive/text/src_20240127_ansa_tajani-sospende-unrwa.txt`:

> "Il governo italiano ha sospeso finanziamenti all'Unrwa, dopo l'atroce attacco di Hamas contro Israele del 7 ottobre. Paesi Alleati hanno recentemente preso la stessa decisione. Siamo impegnati nell'assistenza umanitaria alla popolazione palestinese, tutelando la sicurezza di …

Evidence 2: `src_20240525_esteri_tajani-mustafa-unrwa` (official, Ministero degli Affari Esteri e della Cooperazione Internazionale, 2024-05-25), locator **line 119**, language `it`.
Wayback: <https://web.archive.org/web/20260930013040id_/https://www.esteri.it/it/sala_stampa/archivionotizie/comunicati/2024/05/incontro-del-vice-presidente-del-consiglio-e-ministro-degli-affari-esteri-e-della-cooperazione-internazionale-on-antonio-tajani-con-il-primo-ministro-e-ministro-degli-esteri-e-degli-emigrati-dell/>

Quote:

> In aggiunta a ciò, il Ministro Tajani ha disposto la ripresa dei finanziamenti a UNRWA.

Translation in the record:

> In addition, Minister Tajani ordered the resumption of funding to UNRWA.

Mechanical check: found at line 119, starting within the locator (line 119). Archived text at line 119 of `archive/text/src_20240525_esteri_tajani-mustafa-unrwa.txt`:

> In aggiunta a ciò, il Ministro Tajani ha disposto la ripresa dei finanziamenti a UNRWA. A seguito del lavoro svolto dalla Commissione indipendente presieduta dall’ex Ministra francese Colonna e delle misure a tutela del principio di neutralità, …

#### evt_2025_09_24_ITA_B9

- [ ] Checked (113 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-09-24 |
| Speaker or actor | President of the Council of Ministers / Présidente du Conseil des ministres |
| Tier (points) | +5: Names a violation (+5): the address says Israel breached humanitarian norms and exceeded the limit of proportionality, and calls for a permanent ceasefire. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The President of the Council of Ministers told the UN General Assembly that Israel had exceeded the limit of proportionality and breached humanitarian norms in Gaza. |
| Summary (FR) | La présidente du Conseil des ministres a déclaré devant l'Assemblée générale des Nations unies qu'Israël avait dépassé la limite de la proportionnalité et enfreint les normes humanitaires à Gaza. |
| Second reading | agree, 2026-09-28 |

Evidence 1: `src_20250924_governo_meloni-unga80` (official, Presidenza del Consiglio dei Ministri, 2025-09-24), locator **line 12**, language `it`.
Wayback: <https://web.archive.org/web/20260928165428id_/https://www.governo.it/it/articolo/lintervento-del-presidente-meloni-all80-assemblea-generale-delle-nazioni-unite/29842>

Quote:

> E Israele ha superato quel limite, con una guerra su larga scala che sta coinvolgendo oltre misura la popolazione civile palestinese. Ed è su questo limite che lo Stato ebraico ha finito per infrangere le norme umanitarie, causando una strage tra i civili.

Translation in the record:

> And Israel has exceeded that limit, with a large-scale war that is affecting the Palestinian civilian population beyond measure. And it is at this limit that the Jewish State has ended up breaching humanitarian norms, causing a massacre among civilians.

Mechanical check: found at line 12, starting within the locator (line 12). Archived text at line 12 of `archive/text/src_20250924_governo_meloni-unga80.txt`:

> Ma la reazione a una aggressione deve sempre rispettare il principio di proporzionalità. Vale per gli individui, e vale a maggior ragione per gli Stati. E Israele ha superato quel limite, con una guerra su larga scala che sta coinvolgendo oltre misura la popolazione civile palestinese. Ed è su questo limite che lo Stato ebraico ha finito per infrangere le norme umanitarie, causando una strage tra i civili.

Evidence 2: `src_20250924_governo_meloni-unga80` (official, Presidenza del Consiglio dei Ministri, 2025-09-24), locator **line 18**, language `it`.
Wayback: <https://web.archive.org/web/20260928165428id_/https://www.governo.it/it/articolo/lintervento-del-presidente-meloni-all80-assemblea-generale-delle-nazioni-unite/29842>

Quote:

> L’Italia c’è e ci sarà per chiunque sia disposto a lavorare a un piano serio per il rilascio degli ostaggi, un cessate il fuoco permanente, l’esclusione di Hamas da ogni dinamica di governo in Palestina, il graduale ritiro di Israele da Gaza

Translation in the record:

> Italy is and will be there for anyone willing to work on a serious plan for the release of the hostages, a permanent ceasefire, the exclusion of Hamas from any role in governing Palestine, the gradual withdrawal of Israel from Gaza

Mechanical check: found at line 18, starting within the locator (line 18). Archived text at line 18 of `archive/text/src_20250924_governo_meloni-unga80.txt`:

> … sta orgogliosamente accogliendo e curando nei propri ospedali, chiedono risposte che possano migliorare la loro condizione, e su quello siamo impegnati. L’Italia c’è e ci sarà per chiunque sia disposto a lavorare a un piano serio per il rilascio degli ostaggi, un cessate il fuoco permanente, l’esclusione di Hamas da ogni dinamica di governo in Palestina, il graduale ritiro di Israele da Gaza, l’impegno della comunità internazionale nella gestione della fase successiva al cessate il fuoco, fino alla realizzazione della prospettiva dei due Stati.

### Jamaica (JAM)

#### evt_2024_09_27_JAM_B9

- [ ] Checked (114 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2024-09-27 |
| Speaker or actor | Minister of Foreign Affairs and Foreign Trade of Jamaica / Ministre des Affaires étrangères et du Commerce extérieur de la Jamaïque |
| Tier (points) | +2: Call tier (+2): in the General Debate the Foreign Minister said that Jamaica called for an immediate ceasefire in Gaza and the release of hostages, 'to bring an end to the protracted war and human suffering'; the same passage condemns the attacks of 7 October and the counter-attacks and supports a two-State solution. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister of Foreign Affairs of Jamaica told the General Assembly that Jamaica called for an immediate ceasefire in Gaza and the release of hostages. |
| Summary (FR) | La ministre des Affaires étrangères de la Jamaïque a déclaré à l'Assemblée générale que la Jamaïque appelait à un cessez-le-feu immédiat à Gaza et à la libération des otages. |
| Second reading | agree, 2026-10-06 |

Evidence 1: `src_20240927_un-gadebate_jam-johnson-smith-en` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2024-09-27), locator **lines 186 to 188**, language `en`.
Wayback: <https://web.archive.org/web/20241111124547id_/https://gadebate.un.org/sites/default/files/gastatements/79/jm_en.pdf>

Quote:

> We call for an immediate ceasefire in Gaza and the release of hostages to bring an end to the protracted war and human suffering.

Mechanical check: found at lines 186–188, starting within the locator (lines 186 to 188). Archived text at lines 186–188 of `archive/text/src_20240927_un-gadebate_jam-johnson-smith-en.txt`:

> recognized the State of Palestine. We call for an immediate ceasefire in Gaza and the release of hostages to bring an end to the protracted war and human suffering.

### Jordan (JOR)

#### evt_2026_08_21_JOR_B9

- [ ] Checked (115 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2026-08-21 |
| Speaker or actor | Deputy Prime Minister and Minister of Foreign Affairs and Expatriates / Vice-Premier ministre et ministre des Affaires étrangères et des Expatriés |
| Tier (points) | +5: Violations named (+5): the eight foreign ministers condemn settler violence against Palestinians and their property, with the support of the Israeli authorities, as violations of international law, and reject the E1 settlement plan. Scoped west-bank: tracked, not scored in v1 (D-14, docs/10 B-32). |
| Confidence | confirmed |
| Scope | west-bank |
| Summary (EN) | The Minister of Foreign Affairs and seven counterparts rejected the E1 settlement plan and called settler violence against Palestinians a violation of international law. |
| Summary (FR) | Le ministre des Affaires étrangères et sept homologues ont rejeté le plan de colonisation E1 et qualifié les violences de colons contre les Palestiniens de violations du droit international. |
| Second reading | agree, 2026-11-09 |

Evidence 1: `src_20260821_mfa-tr_eight-ministers-e1-settlement` (official, Ministry of Foreign Affairs of the Republic of Türkiye, 2026-08-21), locator **line 2**, language `en`.
Wayback: <https://web.archive.org/web/20261109031309id_/https://www.mfa.gov.tr/joint-statement-by-the-foreign-ministers-of-turkiye--egypt--indonesia--jordan--pakistan--qatar--saudi-arabia-and-uae--21-august-2026.en.mfa>

Quote:

> They stress that such acts in no way diminish the inalienable rights of the Palestinian people and constitute violations of international law and relevant United Nations resolutions

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20260821_mfa-tr_eight-ministers-e1-settlement.txt`:

> … and acts of violence perpetrated by settlers, with the support of the Israeli occupying authorities, against the Palestinian people and their property. They stress that such acts in no way diminish the inalienable rights of the Palestinian people and constitute violations of international law and relevant United Nations resolutions, while posing a serious threat to regional and international peace and security.

Evidence 2: `src_20260821_mfa-tr_eight-ministers-e1-settlement` (official, Ministry of Foreign Affairs of the Republic of Türkiye, 2026-08-21), locator **line 2**, language `en`.
Wayback: <https://web.archive.org/web/20261109031309id_/https://www.mfa.gov.tr/joint-statement-by-the-foreign-ministers-of-turkiye--egypt--indonesia--jordan--pakistan--qatar--saudi-arabia-and-uae--21-august-2026.en.mfa>

Quote:

> The Foreign Ministers of the Republic of Türkiye, the Arab Republic of Egypt, the Republic of Indonesia, the Hashemite Kingdom of Jordan

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20260821_mfa-tr_eight-ministers-e1-settlement.txt`:

> The Foreign Ministers of the Republic of Türkiye, the Arab Republic of Egypt, the Republic of Indonesia, the Hashemite Kingdom of Jordan, the Islamic Republic of Pakistan, the State of Qatar, the Kingdom of Saudi Arabia and the United Arab Emirates unequivocally condemn Israel’s continued …

### Japan (JPN)

#### evt_2024_01_28_JPN_D2

- [ ] Checked (116 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | D2, standing |
| Date | 2024-01-28 to 2024-04-02 |
| Speaker or actor | Ministry of Foreign Affairs / Ministère des Affaires étrangères |
| Tier (points) | −10 |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Ministry of Foreign Affairs announced that Japan suspended additional funding to UNRWA while UNRWA investigated allegations against its staff. |
| Summary (FR) | Le ministère des Affaires étrangères a annoncé que le Japon suspendait tout financement supplémentaire à l'UNRWA pendant l'enquête de l'UNRWA sur des accusations visant son personnel. |
| Second reading | agree, 2026-09-29 |

Evidence 1: `src_20240128_mofa-jp_statement-unrwa-allegations` (official, Ministry of Foreign Affairs of Japan, 2024-01-28), locator **line 10**, language `en`.
Wayback: <https://web.archive.org/web/20260822080900id_/https://www.mofa.go.jp/press/release/pressite_000001_00122.html>

Quote:

> In response, Japan has decided to suspend additional funding to UNRWA for the time being while UNRWA conducts an investigation into the matter and considers measures to address the allegations.

Mechanical check: found at line 10, starting within the locator (line 10). Archived text at line 10 of `archive/text/src_20240128_mofa-jp_statement-unrwa-allegations.txt`:

> Against this backdrop, Japan is extremely concerned about the alleged involvement of UNRWA staff members in the terror attack on Israel on October 7 last year. In response, Japan has decided to suspend additional funding to UNRWA for the time being while UNRWA conducts an investigation into the matter and considers measures to address the allegations.

Evidence 2: `src_20240415_mofa-jp_unrwa-disbursement` (official, Ministry of Foreign Affairs of Japan, 2024-04-15), locator **line 9**, language `en`.
Wayback: <https://web.archive.org/web/20240913160323id_/https://www.mofa.go.jp/press/release/pressite_000001_00283.html>

Quote:

> Having announced on April 2 that it would lift the suspension on funding to UNRWA and would provide support while confirming the appropriate use of its funds

Mechanical check: found at line 9, starting within the locator (line 9). Archived text at line 9 of `archive/text/src_20240415_mofa-jp_unrwa-disbursement.txt`:

> Having announced on April 2 that it would lift the suspension on funding to UNRWA and would provide support while confirming the appropriate use of its funds, Japan has completed the disbursement of the contribution of approximately US$35 million from the FY2023 supplementary budget.

#### evt_2024_06_02_JPN_B9

- [ ] Checked (117 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2024-06-02 |
| Speaker or actor | Minister for Foreign Affairs / Ministre des Affaires étrangères |
| Tier (points) | +2: Formal call for a ceasefire (+2): the Minister urged all parties to work toward the release of all hostages and a sustainable ceasefire; no violation is named. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister for Foreign Affairs urged all parties to work toward the release of all hostages and a sustainable ceasefire in Gaza. |
| Summary (FR) | La ministre des Affaires étrangères a exhorté toutes les parties à œuvrer à la libération de tous les otages et à un cessez-le-feu durable à Gaza. |
| Second reading | agree, 2026-09-29 |

Evidence 1: `src_20240602_mofa-jp_statement-hostage-ceasefire-proposal` (official, Ministry of Foreign Affairs of Japan, 2024-06-02), locator **line 10**, language `en`.
Wayback: <https://web.archive.org/web/20260310182721id_/https://www.mofa.go.jp/press/release/pressite_000001_00354.html>

Quote:

> Japan strongly urges all parties concerned to seize this opportunity and steadily work toward the release of all hostages and a sustainable ceasefire.

Mechanical check: found at line 10, starting within the locator (line 10). Archived text at line 10 of `archive/text/src_20240602_mofa-jp_statement-hostage-ceasefire-proposal.txt`:

> … Japan highly appreciates the vigorous diplomatic efforts made by the U.S. toward improving the situation, and strongly supports President Biden’s initiative. Japan strongly urges all parties concerned to seize this opportunity and steadily work toward the release of all hostages and a sustainable ceasefire.

### Kazakhstan (KAZ)

#### evt_2025_09_23_KAZ_B9

- [ ] Checked (118 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-09-23 |
| Speaker or actor | President / Président |
| Tier (points) | +2: Formal call for the end of restrictions on aid (+2): unhindered humanitarian access and full protection of civilians are called for in compliance with international humanitarian law; no violation is named. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The President told the General Assembly that the humanitarian crisis in Gaza could not be ignored and called for full protection of all civilians and unhindered humanitarian access. |
| Summary (FR) | Le président a déclaré à l'Assemblée générale que la crise humanitaire à Gaza ne pouvait être ignorée et a appelé à la pleine protection de tous les civils et à un accès humanitaire sans entrave. |
| Second reading | agree, 2026-10-05; the notes mention a flag |

Evidence 1: `src_20250923_akorda_tokayev-unga80-statement` (official, Official website of the President of the Republic of Kazakhstan (Akorda), 2025-09-23), locator **line 39**, language `en`.
Wayback: <https://web.archive.org/web/20250923235950id_/https://www.akorda.kz/en/statement-by-president-of-kazakhstan-kassym-jomart-tokayev-at-the-general-debate-of-the-80th-session-of-the-un-general-assembly-248206>

Quote:

> The humanitarian crisis in Gaza has reached a disastrous scale that cannot be ignored.

Mechanical check: found at line 39, starting within the locator (line 39). Archived text at line 39 of `archive/text/src_20250923_akorda_tokayev-unga80-statement.txt`:

> The humanitarian crisis in Gaza has reached a disastrous scale that cannot be ignored.

Evidence 2: `src_20250923_akorda_tokayev-unga80-statement` (official, Official website of the President of the Republic of Kazakhstan (Akorda), 2025-09-23), locator **line 41**, language `en`.
Wayback: <https://web.archive.org/web/20250923235950id_/https://www.akorda.kz/en/statement-by-president-of-kazakhstan-kassym-jomart-tokayev-at-the-general-debate-of-the-80th-session-of-the-un-general-assembly-248206>

Quote:

> Kazakhstan calls for full protection of all civilians, and unhindered humanitarian access in strict compliance with international humanitarian law.

Mechanical check: found at line 41, starting within the locator (line 41). Archived text at line 41 of `archive/text/src_20250923_akorda_tokayev-unga80-statement.txt`:

> Kazakhstan calls for full protection of all civilians, and unhindered humanitarian access in strict compliance with international humanitarian law.

### Kenya (KEN)

#### evt_2024_01_25_KEN_E2

- [ ] Checked (119 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | E2, repeatable |
| Date | 2024-01-25 |
| Speaker or actor | Kenyan police (National Police Service) / Police kényane (Service national de police) |
| Tier (points) | −5: E2 (-5): on 25 January 2024 police fired tear gas to disperse a procession in solidarity with Palestinians that the organisers (Kenyans4Palestine) had notified to the police, outside the German Embassy in Nairobi, and three activists were arrested. Experimental indicator, recorded and unscored in v1.0 (D-12). |
| Confidence | corroborated |
| Scope | gaza |
| Summary (EN) | Kenyan police dispersed with tear gas a procession in solidarity with Palestinians outside the German Embassy in Nairobi, and three activists were arrested. |
| Summary (FR) | La police kényane a dispersé au gaz lacrymogène une procession de solidarité avec les Palestiniens devant l'ambassade d'Allemagne à Nairobi, et trois militants ont été arrêtés. |
| Second reading | agree, 2026-11-10; the notes mention a flag |

Evidence 1: `src_20240125_kenyans_german-embassy-protest-teargas` (press, Kenyans.co.ke, 2024-01-25), locator **line 1**, language `en`.
Wayback: <https://web.archive.org/web/20261110052548id_/https://www.kenyans.co.ke/news/96848-police-arrest-and-teargas-demonstrators-outside-german-embassy-nairobi>

Quote:

> Police officers, on Thursday, lobbed teargas to disperse a lobby group protesting outside the German Embassy along Riverside Drive in Westlands, Nairobi.

Mechanical check: found at line 1, starting within the locator (line 1). Archived text at line 1 of `archive/text/src_20240125_kenyans_german-embassy-protest-teargas.txt`:

> Police officers, on Thursday, lobbed teargas to disperse a lobby group protesting outside the German Embassy along Riverside Drive in Westlands, Nairobi.

Evidence 2: `src_20240126_aa_kenya-pro-palestine-protest-teargas` (press, Anadolu Agency, 2024-01-26), locator **line 48**, language `en`.
Wayback: <https://web.archive.org/web/20261110052513id_/https://aa.com.tr/en/africa/tear-gas-arrests-disrupt-peaceful-pro-palestine-protest-in-kenya/3119092>

Quote:

> Kenyan police fired teargas canisters to disperse a peaceful protest Thursday that was held in solidarity with Palestinians in the Israel-Palestine conflict.

Mechanical check: found at line 48, starting within the locator (line 48). Archived text at line 48 of `archive/text/src_20240126_aa_kenya-pro-palestine-protest-teargas.txt`:

> Kenyan police fired teargas canisters to disperse a peaceful protest Thursday that was held in solidarity with Palestinians in the Israel-Palestine conflict.

Evidence 3: `src_20240126_aa_kenya-pro-palestine-protest-teargas` (press, Anadolu Agency, 2024-01-26), locator **line 50**, language `en`.
Wayback: <https://web.archive.org/web/20261110052513id_/https://aa.com.tr/en/africa/tear-gas-arrests-disrupt-peaceful-pro-palestine-protest-in-kenya/3119092>

Quote:

> Police deployed tear gas against dozens of protesters and three activists were arrested.

Mechanical check: found at line 50, starting within the locator (line 50). Archived text at line 50 of `archive/text/src_20240126_aa_kenya-pro-palestine-protest-teargas.txt`:

> Police deployed tear gas against dozens of protesters and three activists were arrested.

### Kyrgyzstan (KGZ)

#### evt_2025_09_23_KGZ_B9

- [ ] Checked (120 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-09-23 |
| Speaker or actor | President / Président |
| Tier (points) | +5: Statement using a legal characterisation (+5): the President demands the end of the genocide against the Palestinians and an international judicial investigation by the ICJ. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The President told the General Assembly that Kyrgyzstan demanded an end to what he called the genocide against the Palestinians and an investigation by the International Court of Justice. |
| Summary (FR) | Le président a déclaré à l'Assemblée générale que le Kirghizistan exigeait la fin de ce qu'il a appelé le génocide contre les Palestiniens et une enquête de la Cour internationale de Justice. |
| Second reading | agree, 2026-10-05 |

Evidence 1: `src_20250923_un-gadebate_kgz-japarov-ru` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2025-09-23), locator **line 148**, language `ru`.
Wayback: <https://web.archive.org/web/20251111052523id_/https://gadebate.un.org/sites/default/files/gastatements/80/kg_ru.pdf>

Quote:

> Мы требуем остановить геноцид в отношении палестинцев и начать международное судебное расследование со стороны Международного суда ООН!

Translation in the record:

> We demand that the genocide against the Palestinians be stopped and that an international judicial investigation by the International Court of Justice be launched!

Mechanical check: found at lines 148–150, starting within the locator (line 148). Archived text at lines 148–150 of `archive/text/src_20250923_un-gadebate_kgz-japarov-ru.txt`:

> Мы требуем остановить геноцид в отношении палестинцев и начать международное судебное расследование со стороны Международного суда ООН!

Evidence 2: `src_20250923_un-gadebate_kgz-japarov-ru` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2025-09-23), locator **line 141**, language `ru`.
Wayback: <https://web.archive.org/web/20251111052523id_/https://gadebate.un.org/sites/default/files/gastatements/80/kg_ru.pdf>

Quote:

> Что еще нужно чтобы остановить войну и ужасающие события в Газе?

Translation in the record:

> What else is needed to stop the war and the horrific events in Gaza?

Mechanical check: found at lines 141–142, starting within the locator (line 141). Archived text at lines 141–142 of `archive/text/src_20250923_un-gadebate_kgz-japarov-ru.txt`:

> Что еще нужно чтобы остановить войну и ужасающие события в Газе?

Evidence 3: `src_20250923_un-gadebate_kgz-japarov-en` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2025-09-23), locator **line 139**, language `en`.
Wayback: <https://web.archive.org/web/20251111042808id_/https://gadebate.un.org/sites/default/files/gastatements/80/kg_en.pdf>

Quote:

> We demand that the genocide against the Palestinians be stopped and that an international judicial investigation by the International Court of Justice be launched!

Mechanical check: found at lines 139–141, starting within the locator (line 139). Archived text at lines 139–141 of `archive/text/src_20250923_un-gadebate_kgz-japarov-en.txt`:

> We demand that the genocide against the Palestinians be stopped and that an international judicial investigation by the International Court of Justice be launched!

### Cambodia (KHM)

#### evt_2025_12_01_KHM_C2

- [ ] Checked (121 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | C2, standing |
| Date | 2025-12-01 |
| Speaker or actor | Minister of Labour and Vocational Training / Ministre du Travail et de la Formation professionnelle |
| Tier (points) | −10: C2 (-10): a signed governmental framework agreement with Israel on the recruitment, transfer and employment of Cambodian workers, with an implementing agreement signed the same day (docs/calibration/README.md R18, one event per instrument; the implementing agreement is not counted separately). |
| Confidence | corroborated |
| Scope | gaza |
| Summary (EN) | The Minister of Labour and Vocational Training signed with Israel's Minister of Foreign Affairs a bilateral framework agreement on the recruitment of Cambodian workers. |
| Summary (FR) | Le ministre du Travail et de la Formation professionnelle a signé avec le ministre israélien des Affaires étrangères un accord-cadre bilatéral sur le recrutement de travailleurs cambodgiens. |
| Second reading | agree, 2026-11-10; the notes mention a flag |

Evidence 1: `src_20251201_i24news_israel-cambodia-labor-agreement` (press, i24NEWS, 2025-12-01), locator **line 11**, language `en`.
Wayback: <https://web.archive.org/web/20251201145254id_/https://www.i24news.tv/en/news/israel/diplomacy/artc-israel-signs-labor-agreement-with-cambodia-to-address-agricultural-worker-shortage>

Quote:

> Israeli Foreign Minister Gideon Sa’ar on Monday signed a bilateral framework agreement with Cambodia’s Minister of Labour and Vocational Training, Heng Sour, clearing the way for thousands of Cambodian workers to arrive in Israel, primarily for employment in the agricultural sector.

Mechanical check: found at line 11, starting within the locator (line 11). Archived text at line 11 of `archive/text/src_20251201_i24news_israel-cambodia-labor-agreement.txt`:

> Israeli Foreign Minister Gideon Sa’ar on Monday signed a bilateral framework agreement with Cambodia’s Minister of Labour and Vocational Training, Heng Sour, clearing the way for thousands of Cambodian workers to arrive in Israel, primarily for employment in the agricultural sector.

Evidence 2: `src_20260625_cpp-org-kh_cambodia-israel-labour-deal` (press, Cambodian People's Party (cpp.org.kh), 2026-06-25), locator **line 2**, language `en`.
Wayback: <https://web.archive.org/web/20261110020130id_/https://www.cpp.org.kh/en/details/468908>

Quote:

> agreed to accelerate the operational rollout of the agreement signed on Dec. 1, 2025.

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20260625_cpp-org-kh_cambodia-israel-labour-deal.txt`:

> Following talks on Wednesday, Labour and Vocational Training Minister H.E. Heng Sour and Israeli non-resident Ambassador H.E. Ms. Alona Fisher-Kamm agreed to accelerate the operational rollout of the agreement signed on Dec. 1, 2025. The deal creates a transparent framework for recruiting Cambodians for temporary jobs in Israel’s agriculture and other sectors.

Evidence 3: `src_20261106_akp_alumni-israel-shalom-club` (press, Agence Kampuchea Presse (AKP, Cambodia's national news agency), 2026-11-06), locator **line 8**, language `en`.
Wayback: <https://web.archive.org/web/20261110020326id_/https://www.akp.gov.kh/post/detail/385836>

Quote:

> Building on previous achievements and the historic agreement signed in December 2025, at least 2,000 Cambodian workers are expected to have opportunities to participate in employment and training programmes in Israel.

Mechanical check: found at line 8, starting within the locator (line 8). Archived text at line 8 of `archive/text/src_20261106_akp_alumni-israel-shalom-club.txt`:

> Building on previous achievements and the historic agreement signed in December 2025, at least 2,000 Cambodian workers are expected to have opportunities to participate in employment and training programmes in Israel. The programmes will focus on modern agriculture, irrigation systems, greenhouse technology, smart water management and sustainable resource management.

### Saint Kitts and Nevis (KNA)

#### evt_2025_09_27_KNA_B9

- [ ] Checked (122 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-09-27 |
| Speaker or actor | Prime Minister of Saint Kitts and Nevis / Premier ministre de Saint-Kitts-et-Nevis |
| Tier (points) | +5: Legal characterisation and call (+5): in the General Debate the Prime Minister called for an end to the anguish caused by 'the horrific genocide that is unfolding in Gaza', said 'We categorically condemn this affront to humanity, for which there must be accountability', and urged an immediate and unconditional ceasefire, the protection of civilians, the release of hostages and humanitarian access. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Prime Minister of Saint Kitts and Nevis told the General Assembly that what he called a genocide was unfolding in Gaza and urged an immediate and unconditional ceasefire. |
| Summary (FR) | Le Premier ministre de Saint-Kitts-et-Nevis a déclaré à l'Assemblée générale que ce qu'il a appelé un génocide se déroulait à Gaza et a demandé un cessez-le-feu immédiat et inconditionnel. |
| Second reading | agree, 2026-10-06 |

Evidence 1: `src_20250927_un-gadebate_kna-drew-en` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2025-09-27), locator **lines 204 to 206**, language `en`.
Wayback: <https://web.archive.org/web/20251217121019id_/https://gadebate.un.org/sites/default/files/gastatements/80/kn_en.pdf>

Quote:

> St. Kitts and Nevis calls for an end to the anguish caused by the horrific genocide that is unfolding in Gaza. We categorically condemn this affront to humanity, for which there must be accountability.

Mechanical check: found at lines 204–206, starting within the locator (lines 204 to 206). Archived text at lines 204–206 of `archive/text/src_20250927_un-gadebate_kna-drew-en.txt`:

> compassion. St. Kitts and Nevis calls for an end to the anguish caused by the horrific genocide that is unfolding in Gaza. We categorically condemn this affront to humanity, for which there must be accountability. We urge for an immediate and

Evidence 2: `src_20250927_un-gadebate_kna-drew-en` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2025-09-27), locator **lines 206 to 208**, language `en`.
Wayback: <https://web.archive.org/web/20251217121019id_/https://gadebate.un.org/sites/default/files/gastatements/80/kn_en.pdf>

Quote:

> We urge for an immediate and unconditional ceasefire, for the protection of civilians, for the release of hostages, and for the restoration of basic necessities and humanitarian access.

Mechanical check: found at lines 206–208, starting within the locator (lines 206 to 208). Archived text at lines 206–208 of `archive/text/src_20250927_un-gadebate_kna-drew-en.txt`:

> humanity, for which there must be accountability. We urge for an immediate and unconditional ceasefire, for the protection of civilians, for the release of hostages, and for the restoration of basic necessities and humanitarian access. International

### Republic of Korea (KOR)

#### evt_2025_09_23_KOR_B9

- [ ] Checked (123 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-09-23 |
| Speaker or actor | Minister of Foreign Affairs / Ministre des Affaires étrangères |
| Tier (points) | +2: Formal call for a ceasefire and for the end of restrictions on aid (+2): the Minister called for an immediate ceasefire and for the immediate lifting of all restrictions on the entry and distribution of humanitarian assistance; famine is described as part of the crisis, not named as a violation, as Japan's statements of the same weeks (docs/10 B-332). |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister of Foreign Affairs told the Security Council that Korea called for an immediate ceasefire in Gaza and the lifting of all restrictions on humanitarian assistance. |
| Summary (FR) | Le ministre des Affaires étrangères a déclaré au Conseil de sécurité que la Corée appelait à un cessez-le-feu immédiat à Gaza et à la levée de toutes les restrictions à l'aide humanitaire. |
| Second reading | agree, 2026-09-29 |

Evidence 1: `src_20250923_mofa-kr_fm-unsc-middle-east` (official, Ministry of Foreign Affairs of the Republic of Korea, 2025-09-23), locator **line 17**, language `en`.
Wayback: <https://web.archive.org/web/20260929041442id_/https://www.mofa.go.kr/eng/brd/m_5689/view.do?seq=319674&page=1>

Quote:

> We call for the immediate lifting of all restrictions on the entry and distribution of humanitarian assistance.

Mechanical check: found at line 17, starting within the locator (line 17). Archived text at line 17 of `archive/text/src_20250923_mofa-kr_fm-unsc-middle-east.txt`:

> We call for the immediate lifting of all restrictions on the entry and distribution of humanitarian assistance.

Evidence 2: `src_20250923_mofa-kr_fm-unsc-middle-east` (official, Ministry of Foreign Affairs of the Republic of Korea, 2025-09-23), locator **line 29**, language `en`.
Wayback: <https://web.archive.org/web/20260929041442id_/https://www.mofa.go.kr/eng/brd/m_5689/view.do?seq=319674&page=1>

Quote:

> The Republic of Korea also reiterates its steadfast call for an immediate ceasefire and the unconditional release of all hostages.

Mechanical check: found at line 29, starting within the locator (line 29). Archived text at line 29 of `archive/text/src_20250923_mofa-kr_fm-unsc-middle-east.txt`:

> The Republic of Korea also reiterates its steadfast call for an immediate ceasefire and the unconditional release of all hostages.

### Kuwait (KWT)

#### evt_2026_11_19_KWT_B9

- [ ] Checked (124 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2026-11-19 |
| Speaker or actor | Minister of Foreign Affairs of the State of Kuwait / Ministre des Affaires étrangères de l'État du Koweït |
| Tier (points) | +2: Formal condemnation and call (+2), set by the Gaza passage: the sixteen foreign ministers condemn the Israeli military escalation in Gaza and call for the full and immediate implementation of the Comprehensive Plan, without naming a category of violation for Gaza. The legal characterisations (illegal settlement activity, unlawful occupation) concern the West Bank and East Jerusalem and are tagged west-bank, unscored in v1 (docs/10 B-32), the reading of B-2192 (1) for every signatory (flagged). |
| Confidence | confirmed |
| Scope | gaza, west-bank |
| Summary (EN) | The Foreign Minister and fifteen counterparts condemned the Israeli military escalation in Gaza and Israel's settlement policies in the Occupied Palestinian Territory. |
| Summary (FR) | Le ministre des Affaires étrangères et quinze homologues ont condamné l'escalade militaire israélienne à Gaza et la politique de colonisation d'Israël dans le Territoire palestinien occupé. |
| Second reading | agree, 2026-11-28; the notes mention a flag |

Evidence 1: `src_20261119_mfa-tr_joint-statement-uk-australia-sanctions` (official, Ministry of Foreign Affairs of the Republic of Türkiye, 2026-11-19), locator **line 5**, language `en`.
Wayback: <https://web.archive.org/web/20261128044413id_/https://www.mfa.gov.tr/joint-statement-19-november-2026.en.mfa>

Quote:

> The Ministers condemn the Israeli military escalation in Gaza and call for the full and immediate implementation of President Trump’s Comprehensive Plan to End the Gaza Conflict

Mechanical check: found at line 5, starting within the locator (line 5). Archived text at line 5 of `archive/text/src_20261119_mfa-tr_joint-statement-uk-australia-sanctions.txt`:

> The Ministers condemn the Israeli military escalation in Gaza and call for the full and immediate implementation of President Trump’s Comprehensive Plan to End the Gaza Conflict, to ensure security and stability, address the humanitarian situation, facilitate reconstruction and recovery, and lay the foundations for lasting peace. The …

Evidence 2: `src_20261119_mfa-tr_joint-statement-uk-australia-sanctions` (official, Ministry of Foreign Affairs of the Republic of Türkiye, 2026-11-19), locator **line 3**, language `en`.
Wayback: <https://web.archive.org/web/20261128044413id_/https://www.mfa.gov.tr/joint-statement-19-november-2026.en.mfa>

Quote:

> The Ministers renew their strongest condemnation of Israel’s continued settlement policies in the Occupied Palestinian Territory, particularly the “E1” settlement plan and related settlement activities east of occupied East Jerusalem

Mechanical check: found at line 3, starting within the locator (line 3). Archived text at line 3 of `archive/text/src_20261119_mfa-tr_joint-statement-uk-australia-sanctions.txt`:

> … settlement activities, including the E1 settlement plan, as well as those that support, facilitate or implement settlement expansion and annexation policies. The Ministers renew their strongest condemnation of Israel’s continued settlement policies in the Occupied Palestinian Territory, particularly the “E1” settlement plan and related settlement activities east of occupied East Jerusalem, they express the hope that this decision by the UK and Australia would encourage many in the international community to follow suit.

Evidence 3: `src_20261119_mfa-tr_joint-statement-uk-australia-sanctions` (official, Ministry of Foreign Affairs of the Republic of Türkiye, 2026-11-19), locator **line 2**, language `en`.
Wayback: <https://web.archive.org/web/20261128044413id_/https://www.mfa.gov.tr/joint-statement-19-november-2026.en.mfa>

Quote:

> the State of Kuwait

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20261119_mfa-tr_joint-statement-uk-australia-sanctions.txt`:

> … of the Republic of Türkiye, People's Democratic Republic of Algeria, the Arab Republic of Egypt, the Republic of Indonesia, the Hashemite Kingdom of Jordan, the State of Kuwait, the State of Libya, Republic of Maldives, Republic of the Niger, the Sultanate of Oman, the Islamic Republic of Pakistan, the State of Palestine, the State …

### Lao People's Democratic Republic (LAO)

#### evt_2024_09_27_LAO_B9

- [ ] Checked (125 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2024-09-27 |
| Speaker or actor | Prime Minister / Premier ministre |
| Tier (points) | +2: Formal call (+2): the Prime Minister states the Lao PDR's support for all international efforts to achieve a permanent ceasefire and the cessation of all violence in Gaza. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Prime Minister said that the Lao PDR maintained its support for international efforts to achieve a permanent ceasefire and the cessation of all violence in Gaza. |
| Summary (FR) | Le Premier ministre a dit que le Laos maintenait son soutien aux efforts internationaux pour un cessez-le-feu permanent et la cessation de toute violence à Gaza. |
| Second reading | agree, 2026-11-04; the notes mention a flag |

Evidence 1: `src_20240927_un-gadebate_lao-sonexay-en` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2024-09-27), locator **lines 50-51**, language `en`.
Wayback: <https://web.archive.org/web/20241111135512id_/https://gadebate.un.org/sites/default/files/gastatements/79/la_en.pdf>

Quote:

> maintain our consistent support to all international efforts aimed at achieving a permanent ceasefire and cessation of all violence in Gaza and the adjacent areas

Mechanical check: found at lines 50–51, starting within the locator (lines 50-51). Archived text at lines 50–51 of `archive/text/src_20240927_un-gadebate_lao-sonexay-en.txt`:

> maintain our consistent support to all international efforts aimed at achieving a permanent ceasefire and cessation of all violence in Gaza and the adjacent areas, as

### Lebanon (LBN)

#### evt_2026_11_14_LBN_B9

- [ ] Checked (126 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2026-11-14 |
| Speaker or actor | Minister of Foreign Affairs and Emigrants of Lebanon / Ministre des Affaires étrangères et des Émigrés du Liban |
| Tier (points) | +5: Names specific violations (+5): the eighteen foreign ministers condemn the Israeli airstrike on the Nasser Medical Complex in Khan Younis as a violation of international humanitarian law and call on Israel to uphold the ceasefire and ensure unimpeded humanitarian aid. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Foreign Minister and seventeen counterparts condemned the Israeli strike on the Nasser Medical Complex in Khan Younis as a violation of international humanitarian law. |
| Summary (FR) | Le ministre des Affaires étrangères et dix-sept homologues ont condamné la frappe israélienne contre le complexe médical Nasser de Khan Younès comme une violation du droit international humanitaire. |
| Second reading | agree, 2026-11-28; the notes mention a flag |

Evidence 1: `src_20261114_mfa-tr_joint-statement-nasser-medical-complex` (official, Ministry of Foreign Affairs of the Republic of Türkiye, 2026-11-14), locator **line 2**, language `en`.
Wayback: <https://web.archive.org/web/20261128044350id_/https://www.mfa.gov.tr/condemn-in-the-strongest-terms-the-israeli-airstrike-on-the-nasser-medical-complex-in-khan-younis.en.mfa>

Quote:

> condemn in the strongest terms the Israeli airstrike on the Nasser Medical Complex in Khan Younis, which caused casualties among patients and medical personnel, in violation of international humanitarian law, which affords special protection to medical facilities and healthcare workers.

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20261114_mfa-tr_joint-statement-nasser-medical-complex.txt`:

> … State of Palestine, the State of Qatar, the Kingdom of Saudi Arabia, the Federal Republic of Somalia, the Republic of the Sudan and the United Arab Emirates condemn in the strongest terms the Israeli airstrike on the Nasser Medical Complex in Khan Younis, which caused casualties among patients and medical personnel, in violation of international humanitarian law, which affords special protection to medical facilities and healthcare workers.

Evidence 2: `src_20261114_mfa-tr_joint-statement-nasser-medical-complex` (official, Ministry of Foreign Affairs of the Republic of Türkiye, 2026-11-14), locator **line 5**, language `en`.
Wayback: <https://web.archive.org/web/20261128044350id_/https://www.mfa.gov.tr/condemn-in-the-strongest-terms-the-israeli-airstrike-on-the-nasser-medical-complex-in-khan-younis.en.mfa>

Quote:

> Israel must uphold the ceasefire, protect civilians and medical facilities, and ensure the safe, sustained and unimpeded delivery of humanitarian aid in sufficient quantities, including shelter and early recovery supplies and equipment to restore essential infrastructure.

Mechanical check: found at line 5, starting within the locator (line 5). Archived text at line 5 of `archive/text/src_20261114_mfa-tr_joint-statement-nasser-medical-complex.txt`:

> … in full its obligations under the Sharm El-Sheikh Agreement, President Trump’s Comprehensive Plan and United Nations Security Council Resolution 2803 (2025). Israel must uphold the ceasefire, protect civilians and medical facilities, and ensure the safe, sustained and unimpeded delivery of humanitarian aid in sufficient quantities, including shelter and early recovery supplies and equipment to restore essential infrastructure. It must also allow United Nations agencies and humanitarian organisations to carry out their mandates without obstruction.

Evidence 3: `src_20261114_mfa-tr_joint-statement-nasser-medical-complex` (official, Ministry of Foreign Affairs of the Republic of Türkiye, 2026-11-14), locator **line 2**, language `en`.
Wayback: <https://web.archive.org/web/20261128044350id_/https://www.mfa.gov.tr/condemn-in-the-strongest-terms-the-israeli-airstrike-on-the-nasser-medical-complex-in-khan-younis.en.mfa>

Quote:

> the Lebanese Republic

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20261114_mfa-tr_joint-statement-nasser-medical-complex.txt`:

> … Republic of Algeria, Republic of Djibouti, the Arab Republic of Egypt, the Republic of Indonesia, the Hashemite Kingdom of Jordan, the State of Kuwait, the Lebanese Republic, the State of Libya, the Islamic Republic of Mauritania, the Sultanate of Oman, the Islamic Republic of Pakistan, the State of Palestine, the State of Qatar, …

#### evt_2024_12_31_LBN_D3

- [ ] Checked (127 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | D3, standing |
| Date | 2024-12-31 to 2025-12-31 |
| Speaker or actor | Government of Lebanon / Gouvernement du Liban |
| Tier (points) | +8: Increased tier (+8): Lebanon's 2024 contribution to UNRWA (USD 1,140,002) exceeds its 2022 contribution (USD 818,204) in nominal USD per UNRWA's donor tables (docs/02 §2 D3; docs/calibration/README.md R10). |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | Lebanon contributed more to UNRWA in 2024 than in 2022, according to UNRWA's donor tables. |
| Summary (FR) | La contribution du Liban à l'UNRWA pour 2024 a dépassé celle de 2022, selon les tableaux des donateurs de l'UNRWA. |
| Second reading | agree, 2026-11-04; the notes mention a flag |

Evidence 1: `src_20241231_unrwa_donor-ranking-2024` (dataset, UNRWA, 2024-12-31), locator **line 89**, language `en`.
Wayback: <https://web.archive.org/web/20260521084323id_/https://www.unrwa.org/sites/default/files/overall_donor_ranking_by_pledged_and_received_002.pdf>

Quote:

> Lebanon - - 1,140,002 1,140,002 1,140,002 1,140,002 - - - - - - - - - - - - - - 1,140,002 53 1,140,002 51

Mechanical check: found at line 89, starting within the locator (line 89). Archived text at line 89 of `archive/text/src_20241231_unrwa_donor-ranking-2024.txt`:

> Lebanon - - 1,140,002 1,140,002 1,140,002 1,140,002 - - - - - - - - - - - - - - 1,140,002 53 1,140,002 51

Evidence 2: `src_20221231_unrwa_donor-ranking-2022` (dataset, UNRWA, 2022-12-31), locator **line 46**, language `en`.
Wayback: <https://web.archive.org/web/20230921090159id_/https://www.unrwa.org/sites/default/files/overall_donor_ranking_2022.pdf>

Quote:

> Lebanon 0 818,204 818,204 0 0 0 818,204 37

Mechanical check: found at line 46, starting within the locator (line 46). Archived text at line 46 of `archive/text/src_20221231_unrwa_donor-ranking-2022.txt`:

> Lebanon 0 818,204 818,204 0 0 0 818,204 37

### Libya (LBY)

#### evt_2025_09_25_LBY_B9

- [ ] Checked (128 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-09-25 |
| Speaker or actor | President of the Presidential Council of Libya / Président du Conseil présidentiel de la Libye |
| Tier (points) | +5: Legal characterisation (+5): the President of the Presidential Council, at the General Debate, condemns the states that hide behind an immoral neutrality towards what the Palestinian people, 'especially in the Gaza Strip', are subjected to, 'crimes of genocide' and 'a flagrant violation of international law' (the Arabic quoted is the archived text layer, see the source note). |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The President of the Presidential Council told the General Assembly that he condemned states staying neutral towards what he called crimes of genocide against Palestinians, especially in Gaza. |
| Summary (FR) | Le président du Conseil présidentiel a dit à l'Assemblée générale qu'il condamnait les États neutres face à ce qu'il a appelé des crimes de génocide contre les Palestiniens, surtout à Gaza. |
| Second reading | agree, 2026-10-13; the notes mention a flag |

Evidence 1: `src_20250925_un-gadebate_lby-menfi-ar` (official, United Nations General Assembly, General Debate (gadebate.un.org), 2025-09-25), locator **lines 96 to 98**, language `ar`.
Wayback: <https://web.archive.org/web/20260108002650id_/https://gadebate.un.org/sites/default/files/gastatements/80/ly_ar.pdf>

Quote:

> وبهذا، نُدين بأشد العبارات مواقف بعض الدول اليت التزال ختتبئ خلف حياد غري أخالقي جتاه ما يتعرض له الشعب الفلسطيين-ال سيما يف قطاع غزة- من جرائم إبادة ، وانتهاك صارخ للقانون الدولي .

Translation in the record:

> We condemn in the strongest terms the positions of some states that still hide behind an immoral neutrality towards what the Palestinian people, especially in the Gaza Strip, are subjected to, crimes of genocide and a flagrant violation of international law.

Mechanical check: found at lines 96–98, starting within the locator (lines 96 to 98). Archived text at lines 96–98 of `archive/text/src_20250925_un-gadebate_lby-menfi-ar.txt`:

> وبهذا، نُدين بأشد العبارات مواقف بعض الدول اليت التزال ختتبئ خلف حياد غري أخالقي جتاه ما يتعرض له الشعب الفلسطيين-ال سيما يف قطاع غزة- من جرائم إبادة ، وانتهاك صارخ للقانون الدولي .

### Saint Lucia (LCA)

#### evt_2025_09_29_LCA_B9

- [ ] Checked (129 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-09-29 |
| Speaker or actor | Minister for External Affairs of Saint Lucia / Ministre des Affaires extérieures de Sainte-Lucie |
| Tier (points) | +5: Legal characterisation and named violations (+5): in the General Debate the Minister for External Affairs spoke of 'the undeniable genocide that is being committed against the people of Palestine, especially in Gaza', said that using starvation as a method of warfare and destroying hospitals, schools and places of worship could not be self-defence, and that there was an urgent need to put an end to the suffering, civilian casualties and destruction. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister for External Affairs told the General Assembly that what he called a genocide was being committed against the people of Palestine, especially in Gaza. |
| Summary (FR) | Le ministre des Affaires extérieures a déclaré à l'Assemblée générale que ce qu'il a appelé un génocide était commis contre le peuple de Palestine, surtout à Gaza. |
| Second reading | agree, 2026-10-06 |

Evidence 1: `src_20250929_un-gadebate_lca-baptiste-en` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2025-09-29), locator **lines 168–170**, language `en`.
Wayback: <https://web.archive.org/web/20260220163409id_/https://gadebate.un.org/sites/default/files/gastatements/80/lc_en.pdf>

Quote:

> However, Madame President, we have to accept that the UN’s core mission is being ignored and disrespected when we witness the undeniable genocide that is being committed against the people of Palestine, especially in Gaza.

Mechanical check: found at lines 168–170, starting within the locator (lines 168–170). Archived text at lines 168–170 of `archive/text/src_20250929_un-gadebate_lca-baptiste-en.txt`:

> However, Madame President, we have to accept that the UN’s core mission is being ignored and disrespected when we witness the undeniable genocide that is being committed against the people of Palestine, especially in Gaza. Growing famine, widespread starvation and malnutrition are

Evidence 2: `src_20250929_un-gadebate_lca-baptiste-en` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2025-09-29), locator **lines 74–76**, language `en`.
Wayback: <https://web.archive.org/web/20260220163409id_/https://gadebate.un.org/sites/default/files/gastatements/80/lc_en.pdf>

Quote:

> Madame President, dropping bombs on civilians – defenseless men, women and children – cannot constitute a defense of oneself. Using starvation as a method of so-called warfare cannot constitute defense of oneself.

Mechanical check: found at lines 74–76, starting within the locator (lines 74–76). Archived text at lines 74–76 of `archive/text/src_20250929_un-gadebate_lca-baptiste-en.txt`:

> Madame President, dropping bombs on civilians – defenseless men, women and children – cannot constitute a defense of oneself. Using starvation as a method of so-called warfare cannot constitute defense of oneself. Madame President, the destruction of hospitals, schools and places of worship

Evidence 3: `src_20250929_un-gadebate_lca-baptiste-en` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2025-09-29), locator **lines 92–94**, language `en`.
Wayback: <https://web.archive.org/web/20260220163409id_/https://gadebate.un.org/sites/default/files/gastatements/80/lc_en.pdf>

Quote:

> Madame President, Saint Lucia’s position is abundantly clear; that there is an urgent need to put an end to the intolerable and significant human suffering, civilian casualties and widespread destruction.

Mechanical check: found at lines 92–94, starting within the locator (lines 92–94). Archived text at lines 92–94 of `archive/text/src_20250929_un-gadebate_lca-baptiste-en.txt`:

> Madame President, Saint Lucia’s position is abundantly clear; that there is an urgent need to put an end to the intolerable and significant human suffering, civilian casualties and widespread destruction.

### Liechtenstein (LIE)

#### evt_2025_08_12_LIE_B9

- [ ] Checked (130 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-08-12 |
| Speaker or actor | Deputy Prime Minister and Minister of Foreign Affairs, Environment and Culture / Vice-Première ministre et ministre des Affaires étrangères, de l'Environnement et de la Culture |
| Tier (points) | +5: Names specific violations (+5): the joint statement says famine is unfolding and calls for halting starvation, as scored for Australia (evt_2025_08_12_AUS_B9). |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister of Foreign Affairs, with other foreign ministers, said that famine was unfolding in Gaza and called for urgent action to halt starvation. |
| Summary (FR) | La ministre des Affaires étrangères, avec d'autres ministres, a déclaré qu'une famine sévissait à Gaza et a appelé à agir d'urgence pour y mettre fin. |
| Second reading | agree, 2026-11-04; the notes mention a flag |

Evidence 1: `src_20250812_fm-gov-au_joint-statement-humanitarian` (official, Minister for Foreign Affairs of Australia, 2025-08-12), locator **line 3**, language `en`.
Wayback: <https://web.archive.org/web/20260928190413id_/https://www.foreignminister.gov.au/minister/penny-wong/media-release/joint-statement-humanitarian-situation-gaza>

Quote:

> Famine is unfolding before our eyes. Urgent action is needed now to halt and reverse starvation.

Mechanical check: found at line 3, starting within the locator (line 3). Archived text at line 3 of `archive/text/src_20250812_fm-gov-au_joint-statement-humanitarian.txt`:

> The humanitarian suffering in Gaza has reached unimaginable levels. Famine is unfolding before our eyes. Urgent action is needed now to halt and reverse starvation. Humanitarian space must be protected, and aid should never be politicised.

Evidence 2: `src_20250812_fm-gov-au_joint-statement-humanitarian` (official, Minister for Foreign Affairs of Australia, 2025-08-12), locator **line 7**, language `en`.
Wayback: <https://web.archive.org/web/20260928190413id_/https://www.foreignminister.gov.au/minister/penny-wong/media-release/joint-statement-humanitarian-situation-gaza>

Quote:

> Latvia, Liechtenstein, Lithuania

Mechanical check: found at line 7, starting within the locator (line 7). Archived text at line 7 of `archive/text/src_20250812_fm-gov-au_joint-statement-humanitarian.txt`:

> The Foreign Ministers of Australia, Andorra, Belgium, Canada, Cyprus, Denmark, Estonia, Finland, France, Greece, Iceland, Ireland, Italy, Japan, Latvia, Liechtenstein, Lithuania, Luxembourg, Malta, the Netherlands, Norway, Poland, Portugal, Slovakia, Slovenia, Spain, Sweden, Switzerland and the UK.

Evidence 3: `src_20261104_regierung-li_monauni-curriculum-vitae` (official, Government of the Principality of Liechtenstein (regierung.li), 2026-11-04), locator **line 6**, language `en`.
Wayback: <https://web.archive.org/web/20261104060311id_/https://www.regierung.li/regierungsmitglied/16796/lebenslauf/sabine-monauni>

Quote:

> Ministry of Foreign Affairs, Environment and Culture

Mechanical check: found at line 6, starting within the locator (line 6). Archived text at line 6 of `archive/text/src_20261104_regierung-li_monauni-curriculum-vitae.txt`:

> Responsible for Ministry of Foreign Affairs, Environment and Culture

Evidence 4: `src_20250925_regierung-li_monauni-80th-general-debate` (official, Government of the Principality of Liechtenstein (regierung.li), 2025-09-25), locator **line 3**, language `en`.
Wayback: <https://web.archive.org/web/20261110084935id_/https://www.regierung.li/files/attachments/20250925-rede-rcstv-sm-un-general-debate.pdf>

Quote:

> Minister of Foreign Affairs, Environment and Culture

Mechanical check: found at line 3, starting within the locator (line 3). Archived text at line 3 of `archive/text/src_20250925_regierung-li_monauni-80th-general-debate.txt`:

> Minister of Foreign Affairs, Environment and Culture

### Sri Lanka (LKA)

#### evt_2025_12_22_LKA_C2

- [ ] Checked (131 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | C2, standing |
| Date | 2025-12-22 |
| Speaker or actor | Sri Lanka Bureau of Foreign Employment / Bureau sri-lankais de l'emploi à l'étranger |
| Tier (points) | −10: C2 (-10, corroborated): a memorandum of understanding to facilitate the recruitment of Sri Lankan workers in the service sector, signed by the Chairman of the Sri Lanka Bureau of Foreign Employment and the Deputy Director General of Israel's Population and Immigration Authority during the Deputy Foreign Minister's visit to Israel (docs/calibration/README.md R18, one event per instrument). |
| Confidence | corroborated |
| Scope | gaza |
| Summary (EN) | The Sri Lanka Bureau of Foreign Employment signed with Israel's Population and Immigration Authority a memorandum on recruiting workers, according to the press. |
| Summary (FR) | Le Bureau sri-lankais de l'emploi à l'étranger a signé avec l'Autorité israélienne de la population et de l'immigration un mémorandum sur le recrutement de travailleurs, selon la presse. |
| Second reading | agree, 2026-11-04; the notes mention a flag |

Evidence 1: `src_20251223_dailymirror_lka-israel-service-sector-mou` (press, Daily Mirror (Colombo), 2025-12-23), locator **line 147**, language `en`.
Wayback: <https://web.archive.org/web/20261104041634id_/https://www.dailymirror.lk/breaking-news/Sri-Lanka-Israel-sign-MoU-to-expand-employment-opportunities-for-Sri-Lankan-workers/108-328658>

Quote:

> A Memorandum of Understanding (MoU) was also signed to facilitate recruitment of Sri Lankan workers in the service sector.

Mechanical check: found at line 147, starting within the locator (line 147). Archived text at line 147 of `archive/text/src_20251223_dailymirror_lka-israel-service-sector-mou.txt`:

> A Memorandum of Understanding (MoU) was also signed to facilitate recruitment of Sri Lankan workers in the service sector. The MoU was signed on behalf of Sri Lanka by Chairman of the Sri Lanka Bureau of Foreign Employment, Mr. Koshala Wickramasinghe, and on behalf of Israel by …

Evidence 2: `src_20251223_newswire_lka-israel-service-sector-mou` (press, Newswire (Colombo), 2025-12-23), locator **line 5**, language `en`.
Wayback: <https://web.archive.org/web/20261104041535id_/https://www.newswire.lk/2025/12/23/sri-lanka-signs-new-mou-to-secure-more-jobs-in-israel/>

Quote:

> As part of the visit, a Memorandum of Understanding was signed to facilitate recruitment in service-sector jobs.

Mechanical check: found at line 5, starting within the locator (line 5). Archived text at line 5 of `archive/text/src_20251223_newswire_lka-israel-service-sector-mou.txt`:

> As part of the visit, a Memorandum of Understanding was signed to facilitate recruitment in service-sector jobs. The agreement was signed on behalf of Sri Lanka by Sri Lanka Bureau of Foreign Employment Chairman Kosala Wickramasinghe, and on behalf of Israel by PIBA …

### Lesotho (LSO)

#### evt_2024_09_26_LSO_B9

- [ ] Checked (132 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2024-09-26 |
| Speaker or actor | King of Lesotho / Roi du Lesotho |
| Tier (points) | +2: Formal call (+2): in the General Debate of the 79th session the King says that 'the situation in the Middle East, especially the ongoing human rights violations in Gaza, requires urgent attention' and 'we renew our call for a ceasefire'. No party is named and no specific violation is described. Expired on 4 November 2026 (769 days), so it adds nothing to the score. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The King of Lesotho renewed his country's call for a ceasefire in Gaza, at the UN General Assembly. |
| Summary (FR) | Le roi du Lesotho a renouvelé l'appel de son pays à un cessez-le-feu à Gaza, devant l'Assemblée générale des Nations unies. |
| Second reading | agree, 2026-11-04; the notes mention a flag |

Evidence 1: `src_20240926_un-gadebate_ls-letsie-ag79` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2024-09-26), locator **lines 214 to 216**, language `en`.
Wayback: <https://web.archive.org/web/20241111145827id_/https://gadebate.un.org/sites/default/files/gastatements/79/ls_en.pdf>

Quote:

> THE SITUATION IN THE MIDDLE EAST, ESPECIALLY THE ONGOING HUMAN RIGHTS VIOLATIONS IN GAZA, REQUIRES URGENT ATTENTION. WE RENEW OUR CALL FOR A CEASEFIRE

Mechanical check: found at lines 214–216, starting within the locator (lines 214 to 216). Archived text at lines 214–216 of `archive/text/src_20240926_un-gadebate_ls-letsie-ag79.txt`:

> THE SITUATION IN THE MIDDLE EAST, ESPECIALLY THE ONGOING HUMAN RIGHTS VIOLATIONS IN GAZA, REQUIRES URGENT ATTENTION. WE RENEW OUR CALL FOR A CEASEFIRE, AS BOTH THE GENERAL

### Lithuania (LTU)

#### evt_2025_12_31_LTU_D3

- [ ] Checked (133 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | D3, standing |
| Date | 2025-12-31 |
| Speaker or actor | Government of Lithuania / Gouvernement de la Lituanie |
| Tier (points) | +8: Increased tier (+8): UNRWA's table of 2025 gives USD 56,754 pledged and USD 56,754 received for Lithuania, against no row in UNRWA's table of 2022 (a zero baseline, docs/10 B-388 (2), B-445) (nominal USD, docs/02 §2 D3). |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | Lithuania's contribution to UNRWA for 2025 exceeded its 2022 contribution in UNRWA's donor tables. |
| Summary (FR) | La contribution de la Lituanie à l'UNRWA pour 2025 a dépassé celle de 2022, selon les tableaux des donateurs de l'UNRWA. |
| Second reading | agree, 2026-11-09 |

Evidence 1: `src_20251231_unrwa_donor-ranking-2025` (dataset, UNRWA, 2025-12-31), locator **line 105 (Lithuania)**, language `en`.
Wayback: <https://web.archive.org/web/20260521084310id_/https://www.unrwa.org/sites/default/files/table_3_2025_overall_donor_ranking_confirmed_pledges_and_received_cash_and_in-kind.pdf>

Quote:

> Lithuania 56,754 56,754 - - 56,754 56,754 - - - - - - - - - - 56,754 88 56,754 86

Mechanical check: found at line 105, starting within the locator (line 105 (Lithuania)). Archived text at line 105 of `archive/text/src_20251231_unrwa_donor-ranking-2025.txt`:

> Lithuania 56,754 56,754 - - 56,754 56,754 - - - - - - - - - - 56,754 88 56,754 86

### Luxembourg (LUX)

#### evt_2025_05_16_LUX_B9

- [ ] Checked (134 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-05-16 |
| Speaker or actor | Prime Minister / Premier ministre |
| Tier (points) | +5: Names a violation (+5): the heads of government say that forced displacement or the expulsion of the Palestinian people would constitute a breach of international law, and call on Israel to lift the blockade and refrain from further military operations. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Prime Minister, with six other heads of government, called on Israel to stop military operations and lift the blockade of Gaza and said forced displacement would breach international law. |
| Summary (FR) | Le Premier ministre, avec six autres chefs de gouvernement, a appelé Israël à cesser ses opérations et à lever le blocus de Gaza et déclaré que le déplacement forcé violerait le droit international. |
| Second reading | agree, 2026-11-04 |

Evidence 1: `src_20250519_government-is_joint-statement-leaders-palestine` (official, Prime Minister's Office of Iceland (government.is), 2025-05-19), locator **line 6**, language `en`.
Wayback: <https://web.archive.org/web/20261013143146id_/https://www.government.is/news/article/2025-05-19-Joint-Statement-on-Palestine/>

Quote:

> We call upon the government of Israel to immediately reverse its current policy, refrain from further military operations and fully lift the blockade, ensuring safe, rapid and unimpeded humanitarian aid to be distributed throughout the Gaza strip by international humanitarian actors and according to humanitarian principles.

Mechanical check: found at line 6, starting within the locator (line 6). Archived text at line 6 of `archive/text/src_20250519_government-is_joint-statement-leaders-palestine.txt`:

> We call upon the government of Israel to immediately reverse its current policy, refrain from further military operations and fully lift the blockade, ensuring safe, rapid and unimpeded humanitarian aid to be distributed throughout the Gaza strip by international humanitarian actors and according to humanitarian principles. United Nations and humanitarian organizations, including UNRWA, must be supported and granted safe and unimpeded access.

Evidence 2: `src_20250519_government-is_joint-statement-leaders-palestine` (official, Prime Minister's Office of Iceland (government.is), 2025-05-19), locator **line 9**, language `en`.
Wayback: <https://web.archive.org/web/20261013143146id_/https://www.government.is/news/article/2025-05-19-Joint-Statement-on-Palestine/>

Quote:

> Forced displacement or the expulsion of the Palestinian people, by any means, is unacceptable and would constitute a breach of international law.

Mechanical check: found at line 9, starting within the locator (line 9). Archived text at line 9 of `archive/text/src_20250519_government-is_joint-statement-leaders-palestine.txt`:

> … in the West Bank, including East Jerusalem, with increased settler violence, the expansion of illegal settlements and intensified Israel military operations. Forced displacement or the expulsion of the Palestinian people, by any means, is unacceptable and would constitute a breach of international law. We reject any such plans or attempts at demographic change.

Evidence 3: `src_20250519_government-is_joint-statement-leaders-palestine` (official, Prime Minister's Office of Iceland (government.is), 2025-05-19), locator **line 13**, language `en`.
Wayback: <https://web.archive.org/web/20261013143146id_/https://www.government.is/news/article/2025-05-19-Joint-Statement-on-Palestine/>

Quote:

> Luc FRIEDEN, Prime Minister of the Grand Duchy of Luxembourg,

Mechanical check: found at line 13, starting within the locator (line 13). Archived text at line 13 of `archive/text/src_20250519_government-is_joint-statement-leaders-palestine.txt`:

> Luc FRIEDEN, Prime Minister of the Grand Duchy of Luxembourg,

#### evt_2025_12_14_LUX_B9

- [ ] Checked (135 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-12-14 |
| Speaker or actor | Deputy Prime Minister and Minister for Foreign Affairs and Foreign Trade / Vice-Premier ministre et ministre des Affaires étrangères et du Commerce extérieur |
| Tier (points) | +5: Names specific violations (+5): the letter states that Israel's highly restrictive controls obstruct an effective humanitarian response in Gaza and asks that crossings be reopened. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister for Foreign Affairs co-signed a letter to the EU High Representative stating that Israel's restrictive controls obstruct the humanitarian response in Gaza. |
| Summary (FR) | Le ministre des Affaires étrangères a cosigné une lettre à la haute représentante de l'UE indiquant que les contrôles restrictifs d'Israël entravaient la réponse humanitaire à Gaza. |
| Second reading | agree, 2026-11-04; the notes mention a flag |

Evidence 1: `src_20251214_gov-ie_letter-kallas-gaza-humanitarian` (official, Department of Foreign Affairs and Trade (Ireland), 2025-12-14), locator **line 8**, language `en`.
Wayback: <https://web.archive.org/web/20260215231051id_/https://www.gov.ie/en/department-of-foreign-affairs/press-releases/letter-to-he-ms-kaja-kallas-on-the-humanitarian-situation-in-gaza/>

Quote:

> The volume of aid entering Gaza is nowhere near sufficient and Israel’s highly-restrictive controls continue to obstruct an effective humanitarian response.

Mechanical check: found at line 8, starting within the locator (line 8). Archived text at line 8 of `archive/text/src_20251214_gov-ie_letter-kallas-gaza-humanitarian.txt`:

> … to eat, they do not have adequate shelter from the winter weather, they do not have sufficient access to medicines and they do not have access to sanitation. The volume of aid entering Gaza is nowhere near sufficient and Israel’s highly-restrictive controls continue to obstruct an effective humanitarian response.

Evidence 2: `src_20251214_gov-ie_letter-kallas-gaza-humanitarian` (official, Department of Foreign Affairs and Trade (Ireland), 2025-12-14), locator **line 11**, language `en`.
Wayback: <https://web.archive.org/web/20260215231051id_/https://www.gov.ie/en/department-of-foreign-affairs/press-releases/letter-to-he-ms-kaja-kallas-on-the-humanitarian-situation-in-gaza/>

Quote:

> All crossings must be fully reopened in both directions, truck limits must be removed, customs and movement restrictions must be eased, and critical humanitarian items must enter without restriction.

Mechanical check: found at line 11, starting within the locator (line 11). Archived text at line 11 of `archive/text/src_20251214_gov-ie_letter-kallas-gaza-humanitarian.txt`:

> … Foreign Affairs Council includes a focus on how the EU can use its considerable leverage with Israel to urgently address the humanitarian catastrophe in Gaza. All crossings must be fully reopened in both directions, truck limits must be removed, customs and movement restrictions must be eased, and critical humanitarian items must enter without restriction.

Evidence 3: `src_20251214_gov-ie_letter-kallas-gaza-humanitarian` (official, Department of Foreign Affairs and Trade (Ireland), 2025-12-14), locator **line 19**, language `en`.
Wayback: <https://web.archive.org/web/20260215231051id_/https://www.gov.ie/en/department-of-foreign-affairs/press-releases/letter-to-he-ms-kaja-kallas-on-the-humanitarian-situation-in-gaza/>

Quote:

> Xavier Bettel

Mechanical check: found at line 19, starting within the locator (line 19). Archived text at line 19 of `archive/text/src_20251214_gov-ie_letter-kallas-gaza-humanitarian.txt`:

> Xavier Bettel

Evidence 4: `src_20251214_gov-ie_letter-kallas-gaza-humanitarian` (official, Department of Foreign Affairs and Trade (Ireland), 2025-12-14), locator **line 20**, language `en`.
Wayback: <https://web.archive.org/web/20260215231051id_/https://www.gov.ie/en/department-of-foreign-affairs/press-releases/letter-to-he-ms-kaja-kallas-on-the-humanitarian-situation-in-gaza/>

Quote:

> Deputy Prime Minister and Minister of Foreign Affairs of Luxembourg

Mechanical check: found at line 20, starting within the locator (line 20). Archived text at line 20 of `archive/text/src_20251214_gov-ie_letter-kallas-gaza-humanitarian.txt`:

> Deputy Prime Minister and Minister of Foreign Affairs of Luxembourg

### Latvia (LVA)

#### evt_2024_12_31_LVA_D3

- [ ] Checked (136 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | D3, standing |
| Date | 2024-12-31 to 2025-12-31 |
| Speaker or actor | — / — |
| Tier (points) | +8: Increased tier (+8): Latvia's 2024 contribution to UNRWA (USD 18,359) exceeds its 2022 contribution (USD 17,580) in nominal USD per UNRWA's donor tables (docs/02 §2 D3; docs/calibration/README.md R10). |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | Latvia contributed more to UNRWA in 2024 than in 2022, according to UNRWA's donor tables. |
| Summary (FR) | La contribution de la Lettonie à l'UNRWA pour 2024 a dépassé celle de 2022, selon les tableaux des donateurs de l'UNRWA. |
| Second reading | agree, 2026-10-14; the notes mention a flag |

Evidence 1: `src_20241231_unrwa_donor-ranking-2024` (dataset, UNRWA, 2024-12-31), locator **line 163**, language `en`.
Wayback: <https://web.archive.org/web/20260521084323id_/https://www.unrwa.org/sites/default/files/overall_donor_ranking_by_pledged_and_received_002.pdf>

Quote:

> Latvia 18,359 18,359 - - 18,359 18,359 - - - - - - - - - - - - - - 18,359 111 18,359 108

Mechanical check: found at line 163, starting within the locator (line 163). Archived text at line 163 of `archive/text/src_20241231_unrwa_donor-ranking-2024.txt`:

> Latvia 18,359 18,359 - - 18,359 18,359 - - - - - - - - - - - - - - 18,359 111 18,359 108

Evidence 2: `src_20221231_unrwa_donor-ranking-2022` (dataset, UNRWA, 2022-12-31), locator **line 97**, language `en`.
Wayback: <https://web.archive.org/web/20230921090159id_/https://www.unrwa.org/sites/default/files/overall_donor_ranking_2022.pdf>

Quote:

> Latvia 17,580 0 17,580 0 0 0 17,580 86

Mechanical check: found at line 97, starting within the locator (line 97). Archived text at line 97 of `archive/text/src_20221231_unrwa_donor-ranking-2022.txt`:

> Latvia 17,580 0 17,580 0 0 0 17,580 86

### Morocco (MAR)

#### evt_2024_05_16_MAR_B9

- [ ] Checked (137 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2024-05-16 |
| Speaker or actor | King of Morocco / Roi du Maroc |
| Tier (points) | +5: Specific violations named (+5): the King's address to the Arab League summit says that the reprisals in the Gaza Strip revealed grave violations of international humanitarian law, condemns the killing of innocents and calls the attempts at forced displacement of Palestinians unacceptable, as the Foreign Minister's rejection of deportation was read in evt_2025_09_11_MAR_B9; it also asks for rapid and lasting aid throughout the Gaza Strip. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The King condemned the killing of civilians and attempts at forced displacement in the Gaza Strip in an address to the Arab League summit. |
| Summary (FR) | Le roi a condamné la mort de civils et les tentatives de déplacement forcé dans la bande de Gaza dans un discours au sommet de la Ligue arabe. |
| Second reading | agree, 2026-11-09 |

Evidence 1: `src_20240516_maroc-ma_discours-roi-sommet-arabe-manama` (official, Maroc.ma (Government of the Kingdom of Morocco, Ministry of Youth, Culture and Communication), 2024-05-16), locator **line 13**, language `fr`.
Wayback: <https://web.archive.org/web/20261109080819id_/https://maroc.ma/fr/discours-messages-royaux/discours-royaux/texte-integral-du-discours-adresse-par-sa-majeste-le-roi-mohammed-vi-au-33e-sommet-de-la-ligue-des>

Quote:

> Les actes de représailles perpétrés dans la bande de Gaza ont révélé de graves violations qui vont à l’encontre des dispositions du droit international et du droit international humanitaire.

Translation in the record:

> The acts of reprisal committed in the Gaza Strip have revealed grave violations contrary to the provisions of international law and international humanitarian law.

Mechanical check: found at line 13, starting within the locator (line 13). Archived text at line 13 of `archive/text/src_20240516_maroc-ma_discours-roi-sommet-arabe-manama.txt`:

> Les actes de représailles perpétrés dans la bande de Gaza ont révélé de graves violations qui vont à l’encontre des dispositions du droit international et du droit international humanitaire.

Evidence 2: `src_20240516_maroc-ma_discours-roi-sommet-arabe-manama` (official, Maroc.ma (Government of the Kingdom of Morocco, Ministry of Youth, Culture and Communication), 2024-05-16), locator **line 14**, language `fr`.
Wayback: <https://web.archive.org/web/20261109080819id_/https://maroc.ma/fr/discours-messages-royaux/discours-royaux/texte-integral-du-discours-adresse-par-sa-majeste-le-roi-mohammed-vi-au-33e-sommet-de-la-ligue-des>

Quote:

> Aussi, Nous réitérons Notre vive condamnation du meurtre d’innocents. Nous réaffirmons également que le fait d’imposer une réalité nouvelle dans la bande de Gaza et les tentatives de déplacement forcé des Palestiniens sont inacceptables, car ils ne font qu’aggraver la situation et générer plus de violence et d’instabilité.

Translation in the record:

> We therefore reiterate Our strong condemnation of the killing of innocents. We also reaffirm that imposing a new reality in the Gaza Strip and the attempts at forced displacement of the Palestinians are unacceptable, as they only aggravate the situation and generate more violence and instability.

Mechanical check: found at line 14, starting within the locator (line 14). Archived text at line 14 of `archive/text/src_20240516_maroc-ma_discours-roi-sommet-arabe-manama.txt`:

> Aussi, Nous réitérons Notre vive condamnation du meurtre d’innocents. Nous réaffirmons également que le fait d’imposer une réalité nouvelle dans la bande de Gaza et les tentatives de déplacement forcé des Palestiniens sont inacceptables, car ils ne font qu’aggraver la situation et générer plus de violence et d’instabilité.

### Monaco (MCO)

#### evt_2026_05_29_MCO_B11

- [ ] Checked (138 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B11, standing |
| Date | 2026-05-29 |
| Speaker or actor | Minister of State (Government of the Principality of Monaco) / Ministre d'État (Gouvernement princier de Monaco) |
| Tier (points) | +5: Sanctions on settler entities (+5): the Minister of State's decision No 2026-56 of 29 May 2026 adds to Monaco's national freeze list the persons and entities of the EU listing of 28 May 2026 (Implementing Regulation (EU) 2026/1177): three persons and four entities, among them the Nachala Movement, cited for efforts after 7 October 2023 to resettle the Gaza Strip. The settler tier already holds from 15 July 2024 (one per tier), so it adds no points, as Luxembourg's event on the same listing (evt_2026_05_28_LUX_B11). |
| Confidence | confirmed |
| Scope | gaza, west-bank |
| Summary (EN) | The Minister of State added three Israeli settlers and four settler organisations to the national freeze list, among them a movement promoting resettlement of the Gaza Strip. |
| Summary (FR) | Le ministre d'État a inscrit trois colons israéliens et quatre organisations de colons sur la liste nationale de gel des fonds, dont un mouvement prônant la recolonisation de la bande de Gaza. |
| Second reading | agree, 2026-11-10 |

Evidence 1: `src_20260529_geldefonds-mc_dm-2026-56-annexe` (official, Gouvernement Princier de Monaco (Direction du Budget et du Trésor, geldefonds.gouv.mc), 2026-05-29), locator **line 1**, language `fr`.
Wayback: <https://web.archive.org/web/20261110091045id_/https://geldefonds.gouv.mc/content/download/a43386705eb8328b7789082067d623c6/excel_file/2026_05_29%20Annexe%20%C3%A0%20la%20DM%20n%C2%B02026-56.xlsx>

Quote:

> ANNEXE À LA DÉCISION DU MINISTRE D'ÉTAT N° 2026-56 DU 29 MAI 2026

Translation in the record:

> Annex to the decision of the Minister of State No 2026-56 of 29 May 2026

Mechanical check: found at line 1, starting within the locator (line 1). Archived text at line 1 of `archive/text/src_20260529_geldefonds-mc_dm-2026-56-annexe.txt`:

> ANNEXE À LA DÉCISION DU MINISTRE D'ÉTAT N° 2026-56 DU 29 MAI 2026 PRISE EN APPLICATION DE L’ORDONNANCE SOUVERAINE N° 8.664 DU 26 MAI 2021 RELATIVE AUX PROCÉDURES DE GEL DES FONDS ET DES RESSOURCES ÉCONOMIQUES EN APPLICATION …

Evidence 2: `src_20260529_geldefonds-mc_dm-2026-56-annexe` (official, Gouvernement Princier de Monaco (Direction du Budget et du Trésor, geldefonds.gouv.mc), 2026-05-29), locator **line 8**, language `fr`.
Wayback: <https://web.archive.org/web/20261110091045id_/https://geldefonds.gouv.mc/content/download/a43386705eb8328b7789082067d623c6/excel_file/2026_05_29%20Annexe%20%C3%A0%20la%20DM%20n%C2%B02026-56.xlsx>

Quote:

> Nachala Movement

Translation in the record:

> Nachala Movement

Mechanical check: found at line 8, starting within the locator (line 8). Archived text at line 8 of `archive/text/src_20260529_geldefonds-mc_dm-2026-56-annexe.txt`:

> 110198 | UE Violation des droits de l'homme - R (UE) 2020/1998 | Personne morale | Nachala Movement | Le mouvement Nachala (ci-après dénommé “Nachala”) a pour objectif de promouvoir les colonies et les avant-postes illégaux juifs en Cisjordanie. Par ses …

Evidence 3: `src_20260529_geldefonds-mc_dm-2026-56-annexe` (official, Gouvernement Princier de Monaco (Direction du Budget et du Trésor, geldefonds.gouv.mc), 2026-05-29), locator **line 8**, language `fr`.
Wayback: <https://web.archive.org/web/20261110091045id_/https://geldefonds.gouv.mc/content/download/a43386705eb8328b7789082067d623c6/excel_file/2026_05_29%20Annexe%20%C3%A0%20la%20DM%20n%C2%B02026-56.xlsx>

Quote:

> Après le 7 octobre 2023, Nachala a en outre été en première ligne des efforts déployés pour recoloniser la bande de Gaza

Translation in the record:

> After 7 October 2023, Nachala was also at the forefront of efforts to resettle the Gaza Strip

Mechanical check: found at line 8, starting within the locator (line 8). Archived text at line 8 of `archive/text/src_20260529_geldefonds-mc_dm-2026-56-annexe.txt`:

> … été construits sur des terres palestiniennes privées. Tous les avant-postes de Nachala entravent l’accès aux terres agricoles et aux pâturages palestiniens. Après le 7 octobre 2023, Nachala a en outre été en première ligne des efforts déployés pour recoloniser la bande de Gaza. Par conséquent, Nachala est responsable de faciliter et d’encourager des atteintes aux droits de l’homme en Cisjordanie et dans la bande de Gaza, y compris …

Evidence 4: `src_20260529_geldefonds-mc_dm-2026-56` (official, Gouvernement Princier de Monaco (Direction du Budget et du Trésor, geldefonds.gouv.mc), 2026-05-29), locator **line 28**, language `fr`.
Wayback: <https://web.archive.org/web/20261110091144id_/https://geldefonds.gouv.mc/content/download/a43386705eb8328b7789082067d623c6/pdf_file/2026_05_29%20Decision_du_Ministre_d_Etat_n_2026-56.pdf>

Quote:

> Fait à Monaco, en l'Hôtel du Gouvernement, le vingt-neuf mai deux mille vingt-six.

Translation in the record:

> Done at Monaco, at the Government House, on the twenty-ninth of May two thousand and twenty-six.

Mechanical check: found at line 28, starting within the locator (line 28). Archived text at line 28 of `archive/text/src_20260529_geldefonds-mc_dm-2026-56.txt`:

> Fait à Monaco, en l'Hôtel du Gouvernement, le vingt-neuf mai deux mille vingt-six.

### Republic of Moldova (MDA)

#### evt_2026_09_09_MDA_C2

- [ ] Checked (139 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | C2, standing |
| Date | 2026-09-09 |
| Speaker or actor | Ambassador of the Republic of Moldova to the State of Israel / Ambassadeur de la République de Moldova en Israël |
| Tier (points) | −10: C2 (-10): a signed joint declaration of intent with Israel's Ministry of Tourism on cooperation in tourism (docs/calibration/README.md R18, one event per instrument). |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Ambassador of the Republic of Moldova to Israel signed with Israel's Minister of Tourism a joint declaration of intent on cooperation in tourism. |
| Summary (FR) | L'ambassadeur de la République de Moldova en Israël a signé avec le ministre israélien du Tourisme une déclaration commune d'intention sur la coopération touristique. |
| Second reading | agree, 2026-10-05; the notes mention a flag |

Evidence 1: `src_20261005_mfa-md_embassy-israel-cadrul-juridic` (official, Embassy of the Republic of Moldova to the State of Israel (Ministry of Foreign Affairs, israel.mfa.gov.md), 2026-10-05), locator **line 82**, language `ro`.
Wayback: <https://web.archive.org/web/20261005192409id_/https://israel.mfa.gov.md/ro/content/cadrul-juridic-bilateral>

Quote:

> Declarația Comună de Intenții între Ministerul Energiei Ministerul Dezvoltării Economice și Digitalizării și Ministerul Turismului al Statului Israel privind cooperarea în domeniul Turismului, semnat la Tel Aviv la 09.09.2026.

Translation in the record:

> Joint declaration of intent between the Ministry of Energy, the Ministry of Economic Development and Digitalisation and the Ministry of Tourism of the State of Israel on cooperation in tourism, signed in Tel Aviv on 09.09.2026.

Mechanical check: found at line 82, starting within the locator (line 82). Archived text at line 82 of `archive/text/src_20261005_mfa-md_embassy-israel-cadrul-juridic.txt`:

> Declarația Comună de Intenții între Ministerul Energiei Ministerul Dezvoltării Economice și Digitalizării și Ministerul Turismului al Statului Israel privind cooperarea în domeniul Turismului, semnat la Tel Aviv la 09.09.2026.

Evidence 2: `src_20260909_radiochisinau_israel-turism-declaratie` (press, Radio Chișinău (public broadcaster), 2026-09-09), locator **line 70**, language `ro`.
Wayback: <https://web.archive.org/web/20261005192122id_/https://radiochisinau.md/republica-moldova-si-israel-semneaza-o-declaratie-de-intentie-pentru-consolidarea-cooperarii-in-domeniul-turismului---228636.html>

Quote:

> Ambasadorul Republicii Moldova în Statul Israel, Alexandr Roitman, și ministrul turismului al Statului Israel, Haim Katz, au semnat o Declarație comună de intenție în acest sens.

Translation in the record:

> The Ambassador of the Republic of Moldova to the State of Israel, Alexandr Roitman, and Israel's Minister of Tourism, Haim Katz, signed a joint declaration of intent to that effect.

Mechanical check: found at line 70, starting within the locator (line 70). Archived text at line 70 of `archive/text/src_20260909_radiochisinau_israel-turism-declaratie.txt`:

> Republica Moldova și Israel își propun să consolideze cooperarea în domeniul turismului. Ambasadorul Republicii Moldova în Statul Israel, Alexandr Roitman, și ministrul turismului al Statului Israel, Haim Katz, au semnat o Declarație comună de intenție în acest sens.

### Maldives (MDV)

#### evt_2026_04_30_MDV_B9

- [ ] Checked (140 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2026-04-30 |
| Speaker or actor | Minister of Foreign Affairs of Maldives / Ministre des Affaires étrangères des Maldives |
| Tier (points) | +5: Legal characterisation (+5): in a joint statement with eleven counterparts, the Minister called Israel's attacks on the Global Sumud Flotilla, a humanitarian initiative on the catastrophe in Gaza, and the detention of its activists 'flagrant violations of international law and international humanitarian law'. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister of Foreign Affairs of Maldives and eleven counterparts called Israel's attacks on the Gaza flotilla violations of international law. |
| Summary (FR) | Le ministre des Affaires étrangères des Maldives et onze homologues ont qualifié les attaques d'Israël contre la flottille pour Gaza de violations du droit international. |
| Second reading | agree, 2026-11-04; the notes mention a flag |

Evidence 1: `src_20260430_mre_joint-statement-sumud-flotilla` (official, Ministério das Relações Exteriores, 2026-04-30), locator **line 337 (the English version of the same statement: line 343)**, language `pt`.
Wayback: <https://web.archive.org/web/20260507210532id_/https://www.gov.br/mre/pt-br/canais_atendimento/imprensa/notas-a-imprensa/declaracao-conjunta-sobre-os-ataques-israelenses-a-flotilha-global-sumud-30-de-abril-de-2026-1/>

Quote:

> Os ataques israelenses contra as embarcações e a detenção ilegal de ativistas humanitários em águas internacionais constituem flagrantes violações do direito internacional e do direito internacional humanitário.

Translation in the record:

> The Israeli attacks against the vessels and the unlawful detention of humanitarian activists in international waters constitute flagrant violations of international law and international humanitarian law.

Mechanical check: found at line 337, starting within the locator (line 337 (the English version of the same statement: line 343)). Archived text at line 337 of `archive/text/src_20260430_mre_joint-statement-sumud-flotilla.txt`:

> Os ataques israelenses contra as embarcações e a detenção ilegal de ativistas humanitários em águas internacionais constituem flagrantes violações do direito internacional e do direito internacional humanitário.

Evidence 2: `src_20260430_mre_joint-statement-sumud-flotilla` (official, Ministério das Relações Exteriores, 2026-04-30), locator **line 336 (English: line 342)**, language `pt`.
Wayback: <https://web.archive.org/web/20260507210532id_/https://www.gov.br/mre/pt-br/canais_atendimento/imprensa/notas-a-imprensa/declaracao-conjunta-sobre-os-ataques-israelenses-a-flotilha-global-sumud-30-de-abril-de-2026-1/>

Quote:

> Os Ministros das Relações Exteriores da República Federativa do Brasil, da República da Turquia, do Reino Hachemita da Jordânia, da República Islâmica da Mauritânia, da República Islâmica do Paquistão, do Reino da Espanha, da Malásia, da República Popular de Bangladesh, da República da Colômbia, da República das Maldivas, da República da África do Sul e do Estado da Líbia condenam, nos termos mais enérgicos, o ataque israelense à Flotilha Global Sumud, uma iniciativa humanitária civil pacífica destinada a chamar a atenção da comunidade internacional para a catástrofe humanitária em Gaza.

Translation in the record:

> The Ministers of Foreign Affairs of the Republic of Türkiye, Federative Republic of Brazil, Hashemite Kingdom of Jordan, Islamic Republic of Mauritania, Islamic Republic of Pakistan, Kingdom of Spain, Malaysia, People's Republic of Bangladesh, Republic of Colombia, Republic of Maldives, Republic of South Africa, and State of Libya condemn in the strongest terms the Israeli assault on the Global Sumud Flotilla, a peaceful civilian humanitarian initiative aimed at drawing the attention of the international community to the humanitarian catastrophe in Gaza.

Mechanical check: found at line 336, starting within the locator (line 336 (English: line 342)). Archived text at line 336 of `archive/text/src_20260430_mre_joint-statement-sumud-flotilla.txt`:

> Os Ministros das Relações Exteriores da República Federativa do Brasil, da República da Turquia, do Reino Hachemita da Jordânia, da República Islâmica da Mauritânia, da República Islâmica do Paquistão, do Reino da Espanha, da Malásia, da República Popular de Bangladesh, da República da Colômbia, da República das Maldivas, da República da África do Sul e do Estado da Líbia condenam, nos termos mais enérgicos, o ataque israelense à Flotilha Global Sumud, uma iniciativa humanitária civil pacífica destinada a chamar a atenção da comunidade internacional para a catástrofe humanitária em Gaza.

### Mexico (MEX)

#### evt_2025_12_31_MEX_D3

- [ ] Checked (141 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | D3, standing |
| Date | 2025-12-31 |
| Speaker or actor | Government of Mexico / Gouvernement du Mexique |
| Tier (points) | +8: Increased tier (+8): UNRWA's table of 2025 gives USD 1,000,000 pledged and USD 1,000,000 received for Mexico, against USD 750,000 in UNRWA's table of 2022 (nominal USD, docs/02 §2 D3). |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | Mexico's contribution to UNRWA for 2025 exceeded its 2022 contribution in UNRWA's donor tables. |
| Summary (FR) | La contribution du Mexique à l'UNRWA pour 2025 a dépassé celle de 2022, selon les tableaux des donateurs de l'UNRWA. |
| Second reading | agree, 2026-11-09 |

Evidence 1: `src_20251231_unrwa_donor-ranking-2025` (dataset, UNRWA, 2025-12-31), locator **line 59 (Mexico)**, language `en`.
Wayback: <https://web.archive.org/web/20260521084310id_/https://www.unrwa.org/sites/default/files/table_3_2025_overall_donor_ranking_confirmed_pledges_and_received_cash_and_in-kind.pdf>

Quote:

> Mexico 1,000,000 1,000,000 - - 1,000,000 1,000,000 - - - - - - - - - - 1,000,000 48 1,000,000 45

Mechanical check: found at line 59, starting within the locator (line 59 (Mexico)). Archived text at line 59 of `archive/text/src_20251231_unrwa_donor-ranking-2025.txt`:

> Mexico 1,000,000 1,000,000 - - 1,000,000 1,000,000 - - - - - - - - - - 1,000,000 48 1,000,000 45

Evidence 2: `src_20221231_unrwa_donor-ranking-2022` (dataset, UNRWA, 2022-12-31), locator **line 48 (Mexico)**, language `en`.
Wayback: <https://web.archive.org/web/20230921090159id_/https://www.unrwa.org/sites/default/files/overall_donor_ranking_2022.pdf>

Quote:

> Mexico 750,000 0 750,000 0 0 0 750,000 39

Mechanical check: found at line 48, starting within the locator (line 48 (Mexico)). Archived text at line 48 of `archive/text/src_20221231_unrwa_donor-ranking-2022.txt`:

> Mexico 750,000 0 750,000 0 0 0 750,000 39

### Marshall Islands (MHL)

#### evt_2024_09_25_MHL_B9

- [ ] Checked (142 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2024-09-25 |
| Speaker or actor | President of the Marshall Islands / Présidente des Îles Marshall |
| Tier (points) | +5: Names violations (+5, R6): the President, in the General Debate, speaks of 'extreme violence in Gaza and Israel' and of 'the disproportionate and devastating response visited upon an innocent civilian population'; she makes no call for a ceasefire (not +2). |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The President told the General Assembly that nations had expressed grave concern at extreme violence in Gaza and Israel and at what she called a disproportionate response. |
| Summary (FR) | La présidente a dit à l'Assemblée générale que les nations s'inquiétaient de l'extrême violence à Gaza et en Israël et de ce qu'elle a appelé une réponse disproportionnée. |
| Second reading | agree, 2026-10-13; the notes mention a flag |

Evidence 1: `src_20240925_un-gadebate_mhl-heine-en` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2024-09-25), locator **lines 29 to 32**, language `en`.
Wayback: <https://web.archive.org/web/20250807023526id_/https://gadebate.un.org/sites/default/files/gastatements/79/mh_en.pdf>

Quote:

> For nearly a year, nations around the world have expressed grave concern regarding extreme violence in Gaza and Israel - not just the horrific events which led to this grave conflict, but also the disproportionate and devastating response visited upon an innocent civilian population.

Mechanical check: found at lines 29–32, starting within the locator (lines 29 to 32). Archived text at lines 29–32 of `archive/text/src_20240925_un-gadebate_mhl-heine-en.txt`:

> For nearly a year, nations around the world have expressed grave concern regarding extreme violence in Gaza and Israel - not just the horrific events which led to this grave conflict, but also the disproportionate and devastating response visited upon an innocent civilian population.

### North Macedonia (MKD)

#### evt_2026_08_24_MKD_C2

- [ ] Checked (143 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | C2, standing |
| Date | 2026-08-24 |
| Speaker or actor | Minister of Foreign Affairs and Foreign Trade / Ministre des Affaires étrangères et du Commerce extérieur |
| Tier (points) | −10: C2 (-10, reported): cooperation agreements signed in Jerusalem by the two foreign ministers during the North Macedonian Minister's visit of Monday 24 August 2026, reported as two documents on cooperation in education, culture, science and sports and an economic consultations memorandum (docs/calibration/README.md R18, one event per instrument; the day from the report). |
| Confidence | reported |
| Scope | gaza |
| Summary (EN) | The Minister of Foreign Affairs signed with Israel's Foreign Minister cooperation agreements on education, culture and sports, according to the press. |
| Summary (FR) | Le ministre des Affaires étrangères a signé avec le ministre israélien des Affaires étrangères des accords de coopération sur l'éducation, la culture et le sport, selon la presse. |
| Second reading | agree, 2026-11-04; the notes mention a flag |

Evidence 1: `src_20260825_jpost_north-macedonia-fm-israel-ties` (press, The Jerusalem Post, 2026-08-25), locator **line 7**, language `en`.
Wayback: <https://web.archive.org/web/20261104022327id_/https://www.jpost.com/israel-news/article-906494>

Quote:

> During their meeting, Sa’ar and Mucunski signed two cooperation agreements and discussed expanding ties in agriculture, water management, security, innovation, tourism, health, and education.

Mechanical check: found at line 7, starting within the locator (line 7). Archived text at line 7 of `archive/text/src_20260825_jpost_north-macedonia-fm-israel-ties.txt`:

> During their meeting, Sa’ar and Mucunski signed two cooperation agreements and discussed expanding ties in agriculture, water management, security, innovation, tourism, health, and education.

Evidence 2: `src_20260825_jpost_north-macedonia-fm-israel-ties` (press, The Jerusalem Post, 2026-08-25), locator **line 12**, language `en`.
Wayback: <https://web.archive.org/web/20261104022327id_/https://www.jpost.com/israel-news/article-906494>

Quote:

> The two ministers also signed agreements focusing on education, culture, and sports, while tasking their teams with looking at further opportunities in water management, agriculture, investment, and defense.

Mechanical check: found at line 12, starting within the locator (line 12). Archived text at line 12 of `archive/text/src_20260825_jpost_north-macedonia-fm-israel-ties.txt`:

> The two ministers also signed agreements focusing on education, culture, and sports, while tasking their teams with looking at further opportunities in water management, agriculture, investment, and defense.

Evidence 3: `src_20260825_frontpages_north-macedonia-israel-pact` (press, FrontPages.EU, 2026-08-25), locator **line 6**, language `en`.
Wayback: <https://web.archive.org/web/20261104022632id_/https://buttondown.com/frontpageseu/archive/north-macedonia-israel-pact-grubi-trial-evidence/>

Quote:

> North Macedonia has signed an economic consultations memorandum and two bilateral documents with Israel, fostering cooperation in education, science, and sports.

Mechanical check: found at line 6, starting within the locator (line 6). Archived text at line 6 of `archive/text/src_20260825_frontpages_north-macedonia-israel-pact.txt`:

> North Macedonia has signed an economic consultations memorandum and two bilateral documents with Israel, fostering cooperation in education, science, and sports. This marks a new step in diplomatic relations for the country. Domestically, the 'Lottery' case against former First Deputy Prime Minister Artan Grubi saw …

### Mali (MLI)

#### evt_2026_06_24_MLI_B6

- [ ] Checked (144 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B6, standing |
| Date | 2026-06-24 |
| Speaker or actor | Government of Mali / Gouvernement du Mali |
| Tier (points) | −10 |
| Confidence | confirmed |
| Scope | related |
| Summary (EN) | The Government notified the UN Secretary-General of Mali's withdrawal from the Rome Statute, to take effect on 24 June 2027. |
| Summary (FR) | Le gouvernement a notifié au Secrétaire général de l'ONU le retrait du Mali du Statut de Rome, qui prendra effet le 24 juin 2027. |
| Second reading | agree, 2026-11-04; the notes mention a flag |

Evidence 1: `src_20260630_un-treaties_cn-264-2026-mali-withdrawal` (official, United Nations, Secretary-General as depositary (treaties.un.org), 2026-06-30), locator **lines 4 to 7**, language `en`.
Wayback: <https://web.archive.org/web/20261006064626id_/https://treaties.un.org/doc/Publication/CN/2026/CN.264.2026-Eng.pdf>

Quote:

> MALI: WITHDRAWAL1 The Secretary-General of the United Nations, acting in his capacity as depositary, communicates the following: The above action was effected on 24 June 2026

Mechanical check: found at lines 4–7, starting within the locator (lines 4 to 7). Archived text at lines 4–7 of `archive/text/src_20260630_un-treaties_cn-264-2026-mali-withdrawal.txt`:

> MALI: WITHDRAWAL1 The Secretary-General of the United Nations, acting in his capacity as depositary, communicates the following: The above action was effected on 24 June 2026, with:

Evidence 2: `src_20260630_un-treaties_cn-264-2026-mali-withdrawal` (official, United Nations, Secretary-General as depositary (treaties.un.org), 2026-06-30), locator **lines 19 to 20**, language `en`.
Wayback: <https://web.archive.org/web/20261006064626id_/https://treaties.un.org/doc/Publication/CN/2026/CN.264.2026-Eng.pdf>

Quote:

> The action shall take effect for Mali on 24 June 2027 in accordance with article 127 (1)

Mechanical check: found at line 19, starting within the locator (lines 19 to 20). Archived text at line 19 of `archive/text/src_20260630_un-treaties_cn-264-2026-mali-withdrawal.txt`:

> The action shall take effect for Mali on 24 June 2027 in accordance with article 127 (1) which

### Malta (MLT)

#### evt_2025_08_29_MLT_D4

- [ ] Checked (145 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | D4, repeatable |
| Date | 2025-08-29 |
| Speaker or actor | Government of Malta / Gouvernement de Malte |
| Tier (points) | +5: Medical-evacuation programme (+5): the Prime Minister's releases of 29 August and 23 September 2025 and his General Debate address say that Malta brings injured people from Gaza to Malta for treatment; one event per programme (docs/02 §2 D4), dated 'no later than' the first official text found. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The government hosted injured children from Gaza in Malta for medical treatment, according to the Prime Minister. |
| Summary (FR) | Le gouvernement a accueilli à Malte des enfants blessés de Gaza pour des soins médicaux, selon le Premier ministre. |
| Second reading | agree, 2026-11-04; the notes mention a flag |

Evidence 1: `src_20250829_pm-gov-mt_pm-visits-gaza-patient` (official, Office of the Prime Minister (Malta), 2025-08-29), locator **line 28**, language `en`.
Wayback: <https://web.archive.org/web/20250907013000id_/https://primeminister.gov.mt/latest-news/pr251482/>

Quote:

> Malta was among the first EU member states to welcome patients from Gaza for treatment in local hospitals following the outbreak of the war.

Mechanical check: found at line 28, starting within the locator (line 28). Archived text at line 28 of `archive/text/src_20250829_pm-gov-mt_pm-visits-gaza-patient.txt`:

> Malta was among the first EU member states to welcome patients from Gaza for treatment in local hospitals following the outbreak of the war. Prime Minister Abela reaffirmed Malta’s commitment to continue providing humanitarian assistance while also working tirelessly in favour of peace. Palestinian …

Evidence 2: `src_20250922_gov-mt_recognition-palestine` (official, Office of the Prime Minister (Malta), Department of Information, 2025-09-22), locator **line 6**, language `en`.
Wayback: <https://web.archive.org/web/20251006155333id_/https://www.gov.mt/en/Government/DOI/Press%20Releases/Pages/2025/09/23/PR251629en.aspx>

Quote:

> Malta is also continuing to assist Palestinian children injured in the conflict

Mechanical check: found at line 6, starting within the locator (line 6). Archived text at line 6 of `archive/text/src_20250922_gov-mt_recognition-palestine.txt`:

> … flour from Malta had successfully arrived in Gaza and are to be distributed through the World Central Kitchen as humanitarian aid to the Palestinian people. Malta is also continuing to assist Palestinian children injured in the conflict, demonstrating the government's commitment to combine declarations for a better future with concrete action to address current suffering.

Evidence 3: `src_20250926_un-gadebate_mlt-abela-en` (official, Government of Malta, through the UN General Debate (gadebate.un.org), 2025-09-26), locator **lines 293–295**, language `en`.
Wayback: <https://web.archive.org/web/20251002013020id_/https://gadebate.un.org/sites/default/files/gastatements/80/mt_en.pdf>

Quote:

> I cannot bear to see anymore the physical and psychological pain and suffering in the eyes of the children we bring over to Malta from Gaza, to give them a better future.

Mechanical check: found at lines 293–295, starting within the locator (lines 293–295). Archived text at lines 293–295 of `archive/text/src_20250926_un-gadebate_mlt-abela-en.txt`:

> I cannot bear to see anymore the physical and psychological pain and suffering in the eyes of the children we bring over to Malta from Gaza, to give them a better future. Children with

#### evt_2024_10_07_MLT_A8

- [ ] Checked (146 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | A8, repeatable |
| Date | 2024-10-07 |
| Speaker or actor | Government of Malta / Gouvernement de Malte |
| Tier (points) | +5: Transit denied (+5): the Government refused all port service requests (crew change, bunkering) of the vessel Kathrin, carrying explosives bound for Israel, citing a stringent and longstanding policy of refusing transit of weapons destined for conflict zones. |
| Confidence | corroborated |
| Scope | gaza |
| Summary (EN) | The government refused port services to the vessel Kathrin, which was carrying explosives bound for Israel, citing a policy of refusing the transit of weapons destined for conflict zones. |
| Summary (FR) | Le gouvernement a refusé tout service portuaire au navire Kathrin, qui transportait des explosifs vers Israël, en invoquant sa politique de refus du transit d'armes pour les zones de conflit. |
| Second reading | agree, 2026-11-04; the notes mention a flag |

Evidence 1: `src_20241007_maltatoday_transport-malta-rejects-kathrin` (press, MaltaToday, 2024-10-07), locator **line 1**, language `en`.
Wayback: <https://web.archive.org/web/20260217182431id_/https://maltatoday.com.mt/news/world/131598/un_palestine_rapporteur_tells_malta_to_stop_israelbound_arms_vessel_from_docking>

Quote:

> All service requests by an Israel-bound vessel carrying weapons is being rejected, according to Transport Malta.

Mechanical check: found at line 1, starting within the locator (line 1). Archived text at line 1 of `archive/text/src_20241007_maltatoday_transport-malta-rejects-kathrin.txt`:

> All service requests by an Israel-bound vessel carrying weapons is being rejected, according to Transport Malta.

Evidence 2: `src_20241007_lovinmalta_malta-denies-passage-kathrin` (press, Lovin Malta, 2024-10-07), locator **line 1**, language `en`.
Wayback: <https://web.archive.org/web/20241203063415id_/https://lovinmalta.com/news/malta-denies-passage-to-ship-carrying-explosives-destined-for-israel/>

Quote:

> The Maltese government has banned an Israel-bound ship from entering its territorial waters citing a “stringent” and longstanding policy of refusing transit of any weapons destined for conflict zones.

Mechanical check: found at line 1, starting within the locator (line 1). Archived text at line 1 of `archive/text/src_20241007_lovinmalta_malta-denies-passage-kathrin.txt`:

> The Maltese government has banned an Israel-bound ship from entering its territorial waters citing a “stringent” and longstanding policy of refusing transit of any weapons destined for conflict zones.

Evidence 3: `src_20241007_lovinmalta_malta-denies-passage-kathrin` (press, Lovin Malta, 2024-10-07), locator **line 2**, language `en`.
Wayback: <https://web.archive.org/web/20241203063415id_/https://lovinmalta.com/news/malta-denies-passage-to-ship-carrying-explosives-destined-for-israel/>

Quote:

> A government spokesman confirmed the ship will also not be allowed to bunker.

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20241007_lovinmalta_malta-denies-passage-kathrin.txt`:

> The MV Kathrin is understood to have requested permission to dock in Malta for a crew change. A government spokesman confirmed the ship will also not be allowed to bunker. The ship is carrying RDX Hexogen explosives, key components for the manufacture of Israeli bombs and missiles.

### Montenegro (MNE)

#### evt_2023_12_31_MNE_D3

- [ ] Checked (147 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | D3, standing |
| Date | 2023-12-31 to 2024-12-31 |
| Speaker or actor | Government of Montenegro / Gouvernement du Monténégro |
| Tier (points) | +8: Increased tier (+8): UNRWA's table for 2023 gives USD 50,000 for Montenegro (rank 105), of which USD 40,000 in the last column before the total (the Gaza flash appeal), against no row in the 2022 table (a zero). |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | Montenegro contributed more to UNRWA in 2023 than in 2022, according to UNRWA's donor tables. |
| Summary (FR) | La contribution du Monténégro à l'UNRWA pour 2023 a dépassé celle de 2022, selon les tableaux des donateurs de l'UNRWA. |
| Second reading | agree, 2026-11-04 |

Evidence 1: `src_20231231_unrwa_donor-ranking-2023` (dataset, UNRWA, 2023-12-31), locator **line 124**, language `en`.
Wayback: <https://web.archive.org/web/20240617020444id_/https://www.unrwa.org/sites/default/files/overall_donor_ranking_.pdf>

Quote:

> Montenegro 10,000 0 10,000 0 0 0 0 0 0 40,000 50,000 105

Mechanical check: found at line 124, starting within the locator (line 124). Archived text at line 124 of `archive/text/src_20231231_unrwa_donor-ranking-2023.txt`:

> Montenegro 10,000 0 10,000 0 0 0 0 0 0 40,000 50,000 105

### Mauritania (MRT)

#### evt_2025_09_27_MRT_B9

- [ ] Checked (148 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-09-27 |
| Speaker or actor | Minister of Foreign Affairs, African Cooperation and Mauritanians Abroad of Mauritania / Ministre des Affaires étrangères, de la Coopération africaine et des Mauritaniens de l'extérieur de la Mauritanie |
| Tier (points) | +5: Legal characterisation (+5): in the General Debate of the 80th session the Minister of Foreign Affairs says that the 'war of genocide' to which 'our people of Gaza' are subjected puts the conscience of humanity and the credibility of the international system to a decisive test, and Mauritania condemns this aggression and renews its standing with the Palestinian people. There is no call for a ceasefire in the passage. 403 days old on 4 November 2026: counted with decay. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister of Foreign Affairs of Mauritania told the General Assembly that the people of Gaza were subjected to what he called a war of genocide, and condemned the aggression. |
| Summary (FR) | Le ministre des Affaires étrangères de la Mauritanie a déclaré à l'Assemblée générale que la population de Gaza subissait ce qu'il a appelé une guerre de génocide, et a condamné l'agression. |
| Second reading | agree, 2026-11-04; the notes mention a flag |

Evidence 1: `src_20250927_un-gadebate_mr-merzoug-ag80` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2025-09-27), locator **line 70 (page 4)**, language `ar`.
Wayback: <https://web.archive.org/web/20260119233006id_/https://gadebate.un.org/sites/default/files/gastatements/80/mr_ar.pdf>

Quote:

> تضع حرب اإلبادة الجماعية

Translation in the record:

> places the war of genocide

Mechanical check: found at line 70, starting within the locator (line 70 (page 4)). Archived text at line 70 of `archive/text/src_20250927_un-gadebate_mr-merzoug-ag80.txt`:

> التي يتعرض وفي هذا الخِضم، تضع حرب اإلبادة الجماعية

Evidence 2: `src_20250927_un-gadebate_mr-merzoug-ag80` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2025-09-27), locator **line 71 (page 4)**, language `ar`.
Wayback: <https://web.archive.org/web/20260119233006id_/https://gadebate.un.org/sites/default/files/gastatements/80/mr_ar.pdf>

Quote:

> لها أهلناغزة الضمير اإلنساني ومصداقية منظومتنا الدولية

Translation in the record:

> to which our people of Gaza are subjected, the conscience of humanity and the credibility of our international system

Mechanical check: found at line 71, starting within the locator (line 71 (page 4)). Archived text at line 71 of `archive/text/src_20250927_un-gadebate_mr-merzoug-ag80.txt`:

> لها أهلناغزة الضمير اإلنساني ومصداقية منظومتنا الدولية

Evidence 3: `src_20250927_un-gadebate_mr-merzoug-ag80` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2025-09-27), locator **line 73 (pages 4 to 5)**, language `ar`.
Wayback: <https://web.archive.org/web/20260119233006id_/https://gadebate.un.org/sites/default/files/gastatements/80/mr_ar.pdf>

Quote:

> ونحن في الجمهورية اإلسالمية الموريتانية، إذ نندد بهذا

Translation in the record:

> We in the Islamic Republic of Mauritania, in condemning this

Mechanical check: found at line 73, starting within the locator (line 73 (pages 4 to 5)). Archived text at line 73 of `archive/text/src_20250927_un-gadebate_mr-merzoug-ag80.txt`:

> ونحن في الجمهورية اإلسالمية الموريتانية، إذ نندد بهذا

Evidence 4: `src_20250927_un-gadebate_mr-merzoug-ag80` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2025-09-27), locator **line 74 (page 5)**, language `ar`.
Wayback: <https://web.archive.org/web/20260119233006id_/https://gadebate.un.org/sites/default/files/gastatements/80/mr_ar.pdf>

Quote:

> العدوان لنجدد وقوفنا إلى جانب الشعب الفلسطيني مجددين

Translation in the record:

> aggression, renew our standing at the side of the Palestinian people

Mechanical check: found at line 74, starting within the locator (line 74 (page 5)). Archived text at line 74 of `archive/text/src_20250927_un-gadebate_mr-merzoug-ag80.txt`:

> العدوان لنجدد وقوفنا إلى جانب الشعب الفلسطيني مجددين

Evidence 5: `src_20250927_un-gadebate_mr-merzoug-ag80` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2025-09-27), locator **line 5 (cover)**, language `ar`.
Wayback: <https://web.archive.org/web/20260119233006id_/https://gadebate.un.org/sites/default/files/gastatements/80/mr_ar.pdf>

Quote:

> محمد سالم ولد مرزوك

Translation in the record:

> Mohamed Salem Ould Merzoug

Mechanical check: found at line 5, starting within the locator (line 5 (cover)). Archived text at line 5 of `archive/text/src_20250927_un-gadebate_mr-merzoug-ag80.txt`:

> محمد سالم ولد مرزوك

### Mauritius (MUS)

#### evt_2025_10_28_MUS_B9

- [ ] Checked (149 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-10-28 |
| Speaker or actor | Minister of Foreign Affairs, Regional Integration and International Trade / Ministre des Affaires étrangères, de l'Intégration régionale et du Commerce international |
| Tier (points) | +5: Uses a legal characterisation (+5): in an oral answer on Gaza in the National Assembly the Minister said that Mauritius has forcefully condemned Israel for its violations of humanitarian law, after describing atrocities taking place in Gaza. Flagged: the condemnation is stated as the Government's standing position rather than as a new formal statement. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister of Foreign Affairs stated in the National Assembly that Mauritius condemns Israel for its violations of humanitarian law in Gaza. |
| Summary (FR) | Le ministre des Affaires étrangères a déclaré à l'Assemblée nationale que Maurice condamne Israël pour ses violations du droit humanitaire à Gaza. |
| Second reading | agree, 2026-11-11; the notes mention a flag |

Evidence 1: `src_20251028_mauritiusassembly_debate-35-ramful-gaza` (official, National Assembly of Mauritius (mauritiusassembly.govmu.org), 2025-10-28), locator **lines 2223 to 2224 (page 74, answer to PQ B/944)**, language `en`.
Wayback: <https://web.archive.org/web/20260505131139id_/https://mauritiusassembly.govmu.org/mauritiusassembly/index.php/download/472/2025/24741/debate-no-35-of-2025-unrevised-tuesday-28-october-2025.pdf>

Quote:

> we are profoundly disheartened by the atrocities which have been taking place in Gaza.

Mechanical check: found at lines 2223–2224, starting within the locator (lines 2223 to 2224 (page 74, answer to PQ B/944)). Archived text at lines 2223–2224 of `archive/text/src_20251028_mauritiusassembly_debate-35-ramful-gaza.txt`:

> Mr Ramful: Mr Deputy Speaker, Sir, we are profoundly disheartened by the atrocities which have been taking place in Gaza. For the past two years, we have witnessed the

Evidence 2: `src_20251028_mauritiusassembly_debate-35-ramful-gaza` (official, National Assembly of Mauritius (mauritiusassembly.govmu.org), 2025-10-28), locator **line 2232 (page 74, answer to PQ B/944)**, language `en`.
Wayback: <https://web.archive.org/web/20260505131139id_/https://mauritiusassembly.govmu.org/mauritiusassembly/index.php/download/472/2025/24741/debate-no-35-of-2025-unrevised-tuesday-28-october-2025.pdf>

Quote:

> forcefully condemned Israel for its violations of humanitarian law.

Mechanical check: found at line 2232, starting within the locator (line 2232 (page 74, answer to PQ B/944)). Archived text at line 2232 of `archive/text/src_20251028_mauritiusassembly_debate-35-ramful-gaza.txt`:

> forcefully condemned Israel for its violations of humanitarian law.

### Malawi (MWI)

#### evt_2025_04_07_MWI_C2

- [ ] Checked (150 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | C2, standing |
| Date | 2025-04-07 |
| Speaker or actor | Government of Malawi / Gouvernement du Malawi |
| Tier (points) | −10: C2 (-10): a bilateral framework agreement on the employment of Malawian workers in Israel (agriculture and caregiving), signed in Lilongwe on 7 April 2025 during the visit of Israel's Deputy Minister of Foreign Affairs: a signed governmental instrument of cooperation (R18, one event per instrument). |
| Confidence | corroborated |
| Scope | gaza |
| Summary (EN) | The Government of Malawi signed with Israel a framework agreement on the employment of Malawian workers in Israel. |
| Summary (FR) | Le gouvernement du Malawi a signé avec Israël un accord-cadre sur l'emploi de travailleurs malawites en Israël. |
| Second reading | agree, 2026-11-10; the notes mention a flag |

Evidence 1: `src_20250407_mbc_chakwera-hails-israel-labour-deal` (press, Malawi Broadcasting Corporation (MBC; the public broadcaster), 2025-04-07), locator **line 65**, language `en`.
Wayback: <https://web.archive.org/web/20261110055304id_/https://mbc.mw/chakwera-hails-israel-on-labour-export-deal/>

Quote:

> President Dr Lazarus Chakwera, has hailed the newly signed framework agreement on labour export to Israel, saying it will positively benefit the country’s youth.

Mechanical check: found at line 65, starting within the locator (line 65). Archived text at line 65 of `archive/text/src_20250407_mbc_chakwera-hails-israel-labour-deal.txt`:

> President Dr Lazarus Chakwera, has hailed the newly signed framework agreement on labour export to Israel, saying it will positively benefit the country’s youth.

Evidence 2: `src_20250408_jns_israel-malawi-bilateral-labor-agreement` (press, JNS (Jewish News Syndicate), 2025-04-08), locator **line 667**, language `en`.
Wayback: <https://web.archive.org/web/20261110055435id_/https://www.jns.org/israel-news/as-part-of-bilateral-labor-agreement-israel-furthers-ties-with-malawi>

Quote:

> Israel’s Deputy Foreign Minister Sharren Haskel made a lightning 24-hour visit to Malawi on Monday and signed a bilateral agreement to bring in laborers from the southeast African country in the latest Israeli diplomatic outreach to the continent.

Mechanical check: found at line 667, starting within the locator (line 667). Archived text at line 667 of `archive/text/src_20250408_jns_israel-malawi-bilateral-labor-agreement.txt`:

> Israel’s Deputy Foreign Minister Sharren Haskel made a lightning 24-hour visit to Malawi on Monday and signed a bilateral agreement to bring in laborers from the southeast African country in the latest Israeli diplomatic outreach to the continent.

### Malaysia (MYS)

#### evt_2025_09_27_MYS_B9

- [ ] Checked (151 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-09-27 |
| Speaker or actor | Minister of Foreign Affairs / Ministre des Affaires étrangères |
| Tier (points) | +5: Legal characterisation (+5): in the General Assembly's general debate the Foreign Minister said it was the truth that Israel is committing genocide in Gaza. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Foreign Minister told the General Assembly that Israel is committing genocide in Gaza. |
| Summary (FR) | Le ministre des Affaires étrangères a déclaré à l'Assemblée générale qu'Israël commettait un génocide à Gaza. |
| Second reading | agree, 2026-09-29 |

Evidence 1: `src_20250927_kln_fm-unga80-general-debate` (official, Ministry of Foreign Affairs Malaysia (Wisma Putra), 2025-09-27), locator **line 21**, language `en`.
Wayback: <https://web.archive.org/web/20260929195919id_/https://www.kln.gov.my/web/guest/post/national-statement-by-the-minister-of-foreign-affairs-of-malaysia-at-the-general-debate-of-the-80-th-session-of-the-united-nations-general-assembly-ne>

Quote:

> More and more people are standing up for the truth: that Israel is committing genocide in Gaza.

Mechanical check: found at line 21, starting within the locator (line 21). Archived text at line 21 of `archive/text/src_20250927_kln_fm-unga80-general-debate.txt`:

> … its pretence of victimhood. From London to Dhaka, from Paris to Sydney, from Montreal to Kuala Lumpur, populations have spoken out in grief and outrage. More and more people are standing up for the truth: that Israel is committing genocide in Gaza.

#### evt_2024_01_23_MYS_B9

- [ ] Checked (152 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2024-01-23 |
| Speaker or actor | Minister of Foreign Affairs / Ministre des Affaires étrangères |
| Tier (points) | +5: Specific violations named (+5): in the Security Council's open debate the Foreign Minister said the population of Gaza was being starved as a method of warfare, called these war crimes, named Israel's collective punishment of the population of Gaza as illegal, and demanded an immediate ceasefire. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Foreign Minister told the Security Council that the population of Gaza was being starved as a method of warfare, and demanded a ceasefire. |
| Summary (FR) | Le ministre des Affaires étrangères a déclaré au Conseil de sécurité que la population de Gaza était affamée comme méthode de guerre, et a exigé un cessez-le-feu. |
| Second reading | agree, 2026-09-29 |

Evidence 1: `src_20240123_kln_fm-unsc-open-debate` (official, Ministry of Foreign Affairs Malaysia (Wisma Putra), 2024-01-23), locator **line 16**, language `en`.
Wayback: <https://web.archive.org/web/20260929195356id_/https://www.kln.gov.my/web/guest/post/statement-by-the-honourable-dato-seri-utama-haji-mohamad-bin-haji-hasan-minister-of-foreign-affairs-of-malaysia-at-the-united-nations-security-council>

Quote:

> Gaza is on the brink of a human-made famine, and its population is being starved, as a method of warfare.

Mechanical check: found at line 16, starting within the locator (line 16). Archived text at line 16 of `archive/text/src_20240123_kln_fm-unsc-open-debate.txt`:

> … by bombs or bullets, face the prospect of disease and starvation. They are being denied food, water, medicine, electricity, fuel, and other basic needs. Gaza is on the brink of a human-made famine, and its population is being starved, as a method of warfare.

Evidence 2: `src_20240123_kln_fm-unsc-open-debate` (official, Ministry of Foreign Affairs Malaysia (Wisma Putra), 2024-01-23), locator **line 17**, language `en`.
Wayback: <https://web.archive.org/web/20260929195356id_/https://www.kln.gov.my/web/guest/post/statement-by-the-honourable-dato-seri-utama-haji-mohamad-bin-haji-hasan-minister-of-foreign-affairs-of-malaysia-at-the-united-nations-security-council>

Quote:

> It is a fact that these are war crimes.

Mechanical check: found at line 17, starting within the locator (line 17). Archived text at line 17 of `archive/text/src_20240123_kln_fm-unsc-open-debate.txt`:

> It is a fact that these are war crimes. Israel has made sure that no one is safe, not even children. This crisis has introduced a most unwelcome new term into the English language. WCNSF stands for …

Evidence 3: `src_20240123_kln_fm-unsc-open-debate` (official, Ministry of Foreign Affairs Malaysia (Wisma Putra), 2024-01-23), locator **line 19**, language `en`.
Wayback: <https://web.archive.org/web/20260929195356id_/https://www.kln.gov.my/web/guest/post/statement-by-the-honourable-dato-seri-utama-haji-mohamad-bin-haji-hasan-minister-of-foreign-affairs-of-malaysia-at-the-united-nations-security-council>

Quote:

> Malaysia demands an immediate ceasefire.

Mechanical check: found at line 19, starting within the locator (line 19). Archived text at line 19 of `archive/text/src_20240123_kln_fm-unsc-open-debate.txt`:

> Malaysia demands an immediate ceasefire. Malaysia condemns the forced displacement of Palestinians. The right to live in peace and security is fundamental, and we urge all parties to respect this …

#### evt_2024_06_11_MYS_B9

- [ ] Checked (153 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2024-06-11 |
| Speaker or actor | Minister of Foreign Affairs / Ministre des Affaires étrangères |
| Tier (points) | +5: Legal characterisation (+5): at the conference "Call for Action: Urgent Humanitarian Response for Gaza" the Foreign Minister spoke of the genocide unfolding in Gaza and of crimes against humanity, and called for a permanent ceasefire. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Foreign Minister said at the Dead Sea conference on Gaza that a genocide was unfolding in Gaza, and called for a permanent ceasefire. |
| Summary (FR) | Le ministre des Affaires étrangères a déclaré à la conférence de la mer Morte sur Gaza qu'un génocide s'y déroulait, et a appelé à un cessez-le-feu permanent. |
| Second reading | agree, 2026-09-29 |

Evidence 1: `src_20240611_kln_fm-dead-sea-gaza-conference` (official, Ministry of Foreign Affairs Malaysia (Wisma Putra), 2024-06-11), locator **line 14**, language `en`.
Wayback: <https://web.archive.org/web/20260929195525id_/https://www.kln.gov.my/web/guest/post/statement-by-his-excellency-dato-seri-utama-haji-mohamad-bin-haji-hasan-minister-of-foreign-affairs-of-malaysia-at-the-call-for-action-urgent-humanita>

Quote:

> The unbridled genocide, that is unfolding in Gaza, has indeed paralysed the urgently needed humanitarian response for Palestinians.

Mechanical check: found at line 14, starting within the locator (line 14). Archived text at line 14 of `archive/text/src_20240611_kln_fm-dead-sea-gaza-conference.txt`:

> 3. The unbridled genocide, that is unfolding in Gaza, has indeed paralysed the urgently needed humanitarian response for Palestinians.

Evidence 2: `src_20240611_kln_fm-dead-sea-gaza-conference` (official, Ministry of Foreign Affairs Malaysia (Wisma Putra), 2024-06-11), locator **line 15**, language `en`.
Wayback: <https://web.archive.org/web/20260929195525id_/https://www.kln.gov.my/web/guest/post/statement-by-his-excellency-dato-seri-utama-haji-mohamad-bin-haji-hasan-minister-of-foreign-affairs-of-malaysia-at-the-call-for-action-urgent-humanita>

Quote:

> Until there is an effective and permanent ceasefire, and political solution, what we, the international community, could do, is to stand in solidarity with the Palestinians, and relieve their suffering.

Mechanical check: found at line 15, starting within the locator (line 15). Archived text at line 15 of `archive/text/src_20240611_kln_fm-dead-sea-gaza-conference.txt`:

> 4. Until there is an effective and permanent ceasefire, and political solution, what we, the international community, could do, is to stand in solidarity with the Palestinians, and relieve their suffering.

#### evt_2023_12_31_MYS_D3

- [ ] Checked (154 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | D3, standing |
| Date | 2023-12-31 to 2024-12-31 |
| Speaker or actor | — / — |
| Tier (points) | +8: Increased tier (+8): Malaysia's 2023 contribution to UNRWA exceeds its 2022 contribution in nominal USD per UNRWA's donor tables (USD 2,326,395 in 2023 against USD 200,000 in 2022) (docs/02 §2 D3; docs/calibration/README.md R10). |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | Malaysia contributed more to UNRWA in 2023 than in 2022, according to UNRWA's donor tables. |
| Summary (FR) | La contribution de la Malaisie à l'UNRWA pour 2023 a dépassé celle de 2022, selon les tableaux des donateurs de l'UNRWA. |
| Second reading | agree, 2026-09-30 |

Evidence 1: `src_20231231_unrwa_donor-ranking-2023` (dataset, UNRWA, 2023-12-31), locator **line 53 (Malaysia)**, language `en`.
Wayback: <https://web.archive.org/web/20240617020444id_/https://www.unrwa.org/sites/default/files/overall_donor_ranking_.pdf>

Quote:

> Malaysia 200,000 0 200,000 0 0 15,678 0 0 0 2,110,717 2,326,395 37

Mechanical check: found at line 53, starting within the locator (line 53 (Malaysia)). Archived text at line 53 of `archive/text/src_20231231_unrwa_donor-ranking-2023.txt`:

> Malaysia 200,000 0 200,000 0 0 15,678 0 0 0 2,110,717 2,326,395 37

Evidence 2: `src_20221231_unrwa_donor-ranking-2022` (dataset, UNRWA, 2022-12-31), locator **line 64 (Malaysia)**, language `en`.
Wayback: <https://web.archive.org/web/20230921090159id_/https://www.unrwa.org/sites/default/files/overall_donor_ranking_2022.pdf>

Quote:

> Malaysia 200,000 0 200,000 0 0 0 200,000 55

Mechanical check: found at line 64, starting within the locator (line 64 (Malaysia)). Archived text at line 64 of `archive/text/src_20221231_unrwa_donor-ranking-2022.txt`:

> Malaysia 200,000 0 200,000 0 0 0 200,000 55

### Namibia (NAM)

#### evt_2024_09_25_NAM_B9

- [ ] Checked (155 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2024-09-25 |
| Speaker or actor | President of the Republic of Namibia / Président de la République de Namibie |
| Tier (points) | +5: Legal characterisation (+5) with a call for a ceasefire: in the General Debate of the 79th session the President says that Namibia 'believes that Israel, by intent and by action, is committing genocide' and that it 'continues to call for a ceasefire and for humanitarian assistance to flow unhindered into Gaza'. 770 days old on 4 November 2026: expired (more than 730 days), filed for the record. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The President of Namibia told the General Assembly that Namibia believed Israel was committing genocide, in his words, and that it continued to call for a ceasefire in Gaza. |
| Summary (FR) | Le président de la Namibie a déclaré à l'Assemblée générale que la Namibie estimait, selon ses termes, qu'Israël commettait un génocide, et qu'elle continuait d'appeler à un cessez-le-feu à Gaza. |
| Second reading | agree, 2026-11-04 |

Evidence 1: `src_20240925_un-gadebate_na-mbumba-ag79` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2024-09-25), locator **paragraph 11 (lines 107 to 110)**, language `en`.
Wayback: <https://web.archive.org/web/20241111150001id_/https://gadebate.un.org/sites/default/files/gastatements/79/na_en.pdf>

Quote:

> the people of Gaza, who continue to be brutally massacred. As a country that has endured genocide, Namibia believes that Israel, by intent and by action, is committing genocide.

Mechanical check: found at lines 107–110; the locator is not a line number. Archived text at lines 107–110 of `archive/text/src_20240925_un-gadebate_na-mbumba-ag79.txt`:

> This is particularly true for the people of Gaza, who continue to be brutally massacred. As a country that has endured genocide, Namibia believes that Israel, by intent and by action, is committing genocide.

Evidence 2: `src_20240925_un-gadebate_na-mbumba-ag79` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2024-09-25), locator **paragraph 11 (lines 111 to 113)**, language `en`.
Wayback: <https://web.archive.org/web/20241111150001id_/https://gadebate.un.org/sites/default/files/gastatements/79/na_en.pdf>

Quote:

> Namibia continues to call for a ceasefire and for humanitarian assistance to flow unhindered into Gaza.

Mechanical check: found at lines 111–113; the locator is not a line number. Archived text at lines 111–113 of `archive/text/src_20240925_un-gadebate_na-mbumba-ag79.txt`:

> Namibia continues to call for a ceasefire and for humanitarian assistance to flow unhindered into Gaza.

Evidence 3: `src_20240925_un-gadebate_na-mbumba-ag79` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2024-09-25), locator **lines 4 to 7 (cover)**, language `en`.
Wayback: <https://web.archive.org/web/20241111150001id_/https://gadebate.un.org/sites/default/files/gastatements/79/na_en.pdf>

Quote:

> STATEMENT BY HIS EXCELLENCY DR. NANGOLO MBUMBA, PRESIDENT OF THE REPUBLIC OF NAMIBIA AT THE 79th SESSION OF THE UN GENERAL ASSEMBLY 25 SEPTEMBER 2024

Mechanical check: found at lines 4–7, starting within the locator (lines 4 to 7 (cover)). Archived text at lines 4–7 of `archive/text/src_20240925_un-gadebate_na-mbumba-ag79.txt`:

> STATEMENT BY HIS EXCELLENCY DR. NANGOLO MBUMBA, PRESIDENT OF THE REPUBLIC OF NAMIBIA AT THE 79th SESSION OF THE UN GENERAL ASSEMBLY 25 SEPTEMBER 2024

### Niger (NER)

#### evt_2025_09_27_NER_B9

- [ ] Checked (156 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-09-27 |
| Speaker or actor | Prime Minister of the Republic of the Niger / Premier ministre de la République du Niger |
| Tier (points) | +5: Legal characterisation (+5): in the General Debate of the 80th session the Prime Minister says that 'le peuple nigérien condamne sans réserve le génocide israélien à Gaza' and supports 'la création d'un Etat palestinien souverain'. No call for a ceasefire in the passage. 403 days old on 4 November 2026: counted with decay. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Prime Minister of the Niger told the General Assembly that the Nigerien people condemned without reserve what he called the Israeli genocide in Gaza. |
| Summary (FR) | Le Premier ministre du Niger a déclaré à l'Assemblée générale que le peuple nigérien condamnait sans réserve ce qu'il a appelé le génocide israélien à Gaza. |
| Second reading | agree, 2026-11-04; the notes mention a flag |

Evidence 1: `src_20250927_un-gadebate_ne-zeine-ag80` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2025-09-27), locator **lines 77 to 80**, language `fr`.
Wayback: <https://web.archive.org/web/20251111053852id_/https://gadebate.un.org/sites/default/files/gastatements/80/ne_fr.pdf>

Quote:

> le peuple nigérien condamne sans réserve le génocide israélien à Gaza et apporte son soutien le plus fort à la création d’un Etat palestinien souverain.

Translation in the record:

> the Nigerien people condemns without reserve the Israeli genocide in Gaza and gives its strongest support to the creation of a sovereign Palestinian State.

Mechanical check: found at lines 77–80, starting within the locator (lines 77 to 80). Archived text at lines 77–80 of `archive/text/src_20250927_un-gadebate_ne-zeine-ag80.txt`:

> Fort de ces principes, le peuple nigérien condamne sans réserve le génocide israélien à Gaza et apporte son soutien le plus fort à la création d’un Etat palestinien souverain.

Evidence 2: `src_20250927_un-gadebate_ne-zeine-ag80` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2025-09-27), locator **lines 6 to 9**, language `fr`.
Wayback: <https://web.archive.org/web/20251111053852id_/https://gadebate.un.org/sites/default/files/gastatements/80/ne_fr.pdf>

Quote:

> J’ai l’insigne honneur de vous délivrer, au nom du peuple nigérien souverain, les salutations et le message de Son Excellence le Général d’Armée ABDOURAHAMANE TIANI, Président de la République du Niger, Chef de l’État.

Translation in the record:

> I have the great honour to convey to you, on behalf of the sovereign Nigerien people, the greetings and the message of His Excellency General of the Army ABDOURAHAMANE TIANI, President of the Republic of the Niger, Head of State.

Mechanical check: found at lines 6–9, starting within the locator (lines 6 to 9). Archived text at lines 6–9 of `archive/text/src_20250927_un-gadebate_ne-zeine-ag80.txt`:

> J’ai l’insigne honneur de vous délivrer, au nom du peuple nigérien souverain, les salutations et le message de Son Excellence le Général d’Armée ABDOURAHAMANE TIANI, Président de la République du Niger, Chef de l’État.

Evidence 3: `src_20250927_un-gadebate_ne-ag80-page` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2025-09-27), locator **line 1 (the UN's summary of the statement; the page header gives 27 September 2025)**, language `en`.
Wayback: <https://web.archive.org/web/20251008034732id_/https://gadebate.un.org/en/80/niger>

Quote:

> Lamine Zeine Ali Mahaman, the Prime Minister of the Transitional Government of Niger

Mechanical check: found at line 1, starting within the locator (line 1 (the UN's summary of the statement; the page header gives 27 September 2025)). Archived text at line 1 of `archive/text/src_20250927_un-gadebate_ne-ag80-page.txt`:

> Lamine Zeine Ali Mahaman, the Prime Minister of the Transitional Government of Niger, emphasized that his people and those of the Sahel have a great tradition of living together in diversity and solidarity. They “naturally support all …

### Nicaragua (NIC)

#### evt_2024_01_23_NIC_B3

- [ ] Checked (157 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B3, standing |
| Date | 2024-01-23 to 2025-04-01 |
| Speaker or actor | Government of Nicaragua / Gouvernement du Nicaragua |
| Tier (points) | +15: Application to intervene (+15) under Article 62 in ICJ case 192, supporting the applicant: Nicaragua asks to intervene 'as a party', states that it 'coincides with the reasons and justifications that have moved South Africa to bring the case against Israel' and asks the Court to declare that Israel has breached and continues to breach the Genocide Convention. Ended when Nicaragua informed the Court on 1 April 2025 that it withdrew the application. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The government filed an application to intervene as a party in the ICJ case South Africa v. Israel on the Genocide Convention in the Gaza Strip, and withdrew it on 1 April 2025. |
| Summary (FR) | Le gouvernement a déposé devant la CIJ une demande d'intervention comme partie dans l'affaire de la Convention sur le génocide à Gaza (Afrique du Sud c. Israël), puis l'a retirée le 1er avril 2025. |
| Second reading | agree, 2026-10-06; the notes mention a flag |

Evidence 1: `src_20240208_icj_192-press-nicaragua` (court, International Court of Justice (copy published by UNISPAL), 2024-02-08), locator **lines 13–16**, language `en`.
Wayback: <https://web.archive.org/web/20261006084816id_/https://www.un.org/unispal/wp-content/uploads/2024/02/192-20240208-pre-01-00-en.pdf>

Quote:

> On 23 January 2024, Nicaragua, referring to Article 62 of the Statute of the Court, filed in the Registry of the Court an Application for permission to intervene “as a party” in the case concerning Application of the Convention on the Prevention and Punishment of the Crime of Genocide in the Gaza Strip (South Africa v. Israel).

Mechanical check: found at lines 13–16, starting within the locator (lines 13–16). Archived text at lines 13–16 of `archive/text/src_20240208_icj_192-press-nicaragua.txt`:

> THE HAGUE, 8 February 2024. On 23 January 2024, Nicaragua, referring to Article 62 of the Statute of the Court, filed in the Registry of the Court an Application for permission to intervene “as a party” in the case concerning Application of the Convention on the Prevention and Punishment of the Crime of Genocide in the Gaza Strip (South Africa v. Israel).

Evidence 2: `src_20240123_icj_192-application-nicaragua` (court, International Court of Justice (copy published by UNISPAL), 2024-01-23), locator **lines 177–178**, language `en`.
Wayback: <https://web.archive.org/web/20261006084530id_/https://www.un.org/unispal/wp-content/uploads/2025/04/192-20240123-int-01-00-en.pdf>

Quote:

> 8. For all the above, Nicaragua coincides with the reasons and justifications that have moved South Africa to bring the case against Israel before the Court and that are stated in its Application.

Mechanical check: found at lines 177–178, starting within the locator (lines 177–178). Archived text at lines 177–178 of `archive/text/src_20240123_icj_192-application-nicaragua.txt`:

> 8. For all the above, Nicaragua coincides with the reasons and justifications that have moved South Africa to bring the case against Israel before the Court and that are stated in its Application. Thus,

Evidence 3: `src_20250801_undocs_a-80-4-icj-report` (official, United Nations General Assembly, 2025-08-01), locator **lines 1754–1756**, language `en`.
Wayback: <https://web.archive.org/web/20260806165953id_/https://documents.un.org/doc/undoc/gen/n25/221/33/pdf/n2522133.pdf>

Quote:

> 203. On 1 April 2025, Nicaragua informed the Court that it had decided to withdraw the application for permission to intervene that it had submitted under Article 62 of the Statute of the Court on 23 January 2024.

Mechanical check: found at lines 1754–1756, starting within the locator (lines 1754–1756). Archived text at lines 1754–1756 of `archive/text/src_20250801_undocs_a-80-4-icj-report.txt`:

> 203. On 1 April 2025, Nicaragua informed the Court that it had decided to withdraw the application for permission to intervene that it had submitted under Article 62 of the Statute of the Court on 23 January 2024.

### Netherlands (Kingdom of the) (NLD)

#### evt_2025_09_27_NLD_B9

- [ ] Checked (158 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-09-27 |
| Speaker or actor | Minister of Foreign Affairs / Ministre des Affaires étrangères |
| Tier (points) | +2: Formal call for a ceasefire or for the end of restrictions on aid (+2): the joint statement urges Israel to lift restrictions on deliveries of medicine and medical equipment to Gaza and to restore the medical corridor; no violation is named. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister of Foreign Affairs, with other foreign ministers, urged Israel to lift restrictions on medicine for Gaza and to restore the medical corridor to the West Bank. |
| Summary (FR) | Le ministre des Affaires étrangères et d'autres ministres ont exhorté Israël à lever ses restrictions sur les médicaments pour Gaza et à rouvrir le corridor médical vers la Cisjordanie. |
| Second reading | agree, 2026-09-30 |

Evidence 1: `src_20250927_fm-gov-au_joint-statement-gaza-patients` (official, Minister for Foreign Affairs of Australia, 2025-09-27), locator **line 9**, language `en`.
Wayback: <https://web.archive.org/web/20260928190717id_/https://www.foreignminister.gov.au/minister/penny-wong/media-release/joint-statement-offer-assist-treatments-patients-gaza-occupied-west-bank-including-east-jerusalem>

Quote:

> We furthermore urge Israel to lift restrictions on deliveries of medicine and medical equipment to Gaza in line with Israel’s obligations under international law, including international humanitarian law;

Mechanical check: found at line 9, starting within the locator (line 9). Archived text at line 9 of `archive/text/src_20250927_fm-gov-au_joint-statement-gaza-patients.txt`:

> We furthermore urge Israel to lift restrictions on deliveries of medicine and medical equipment to Gaza in line with Israel’s obligations under international law, including international humanitarian law; to urgently and fully enable the UN and other humanitarian partners to do their life-saving work in Gaza; and in line with UN Security Council resolution 2286 …

Evidence 2: `src_20250927_fm-gov-au_joint-statement-gaza-patients` (official, Minister for Foreign Affairs of Australia, 2025-09-27), locator **line 2**, language `en`.
Wayback: <https://web.archive.org/web/20260928190717id_/https://www.foreignminister.gov.au/minister/penny-wong/media-release/joint-statement-offer-assist-treatments-patients-gaza-occupied-west-bank-including-east-jerusalem>

Quote:

> The Foreign Ministers of Australia, Austria, Belgium, Canada, Croatia, Cyprus, Denmark, Finland, France, Germany, Greece, Iceland, Ireland, Italy, Lithuania, Luxembourg, Malta, the Netherlands

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20250927_fm-gov-au_joint-statement-gaza-patients.txt`:

> The Foreign Ministers of Australia, Austria, Belgium, Canada, Croatia, Cyprus, Denmark, Finland, France, Germany, Greece, Iceland, Ireland, Italy, Lithuania, Luxembourg, Malta, the Netherlands, Norway, Poland, Portugal, Slovakia, Slovenia, Sweden, Switzerland, and the United Kingdom

#### evt_2025_08_12_NLD_B9

- [ ] Checked (159 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-08-12 |
| Speaker or actor | Minister of Foreign Affairs / Ministre des Affaires étrangères |
| Tier (points) | +5: Statement naming specific violations (+5): the joint statement says famine is unfolding and calls for halting starvation, and asks that lethal force not be used at distribution sites. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister of Foreign Affairs, with other foreign ministers, said that famine was unfolding in Gaza and called for urgent action to halt starvation. |
| Summary (FR) | Le ministre des Affaires étrangères, avec d'autres ministres, a déclaré qu'une famine sévissait à Gaza et a appelé à agir d'urgence pour y mettre fin. |
| Second reading | agree, 2026-09-30 |

Evidence 1: `src_20250812_fm-gov-au_joint-statement-humanitarian` (official, Minister for Foreign Affairs of Australia, 2025-08-12), locator **line 3**, language `en`.
Wayback: <https://web.archive.org/web/20260928190413id_/https://www.foreignminister.gov.au/minister/penny-wong/media-release/joint-statement-humanitarian-situation-gaza>

Quote:

> Famine is unfolding before our eyes. Urgent action is needed now to halt and reverse starvation.

Mechanical check: found at line 3, starting within the locator (line 3). Archived text at line 3 of `archive/text/src_20250812_fm-gov-au_joint-statement-humanitarian.txt`:

> The humanitarian suffering in Gaza has reached unimaginable levels. Famine is unfolding before our eyes. Urgent action is needed now to halt and reverse starvation. Humanitarian space must be protected, and aid should never be politicised.

Evidence 2: `src_20250812_fm-gov-au_joint-statement-humanitarian` (official, Minister for Foreign Affairs of Australia, 2025-08-12), locator **line 7**, language `en`.
Wayback: <https://web.archive.org/web/20260928190413id_/https://www.foreignminister.gov.au/minister/penny-wong/media-release/joint-statement-humanitarian-situation-gaza>

Quote:

> The Foreign Ministers of Australia, Andorra, Belgium, Canada, Cyprus, Denmark, Estonia, Finland, France, Greece, Iceland, Ireland, Italy, Japan, Latvia, Liechtenstein, Lithuania, Luxembourg, Malta, the Netherlands

Mechanical check: found at line 7, starting within the locator (line 7). Archived text at line 7 of `archive/text/src_20250812_fm-gov-au_joint-statement-humanitarian.txt`:

> The Foreign Ministers of Australia, Andorra, Belgium, Canada, Cyprus, Denmark, Estonia, Finland, France, Greece, Iceland, Ireland, Italy, Japan, Latvia, Liechtenstein, Lithuania, Luxembourg, Malta, the Netherlands, Norway, Poland, Portugal, Slovakia, Slovenia, Spain, Sweden, Switzerland and the UK.

#### evt_2026_09_22_NLD_C4

- [ ] Checked (160 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | C4, standing |
| Date | 2026-09-22 |
| Speaker or actor | — / — |
| Tier (points) | +5: Ban tier (+5): a national prohibition on importing, buying and selling goods from Israeli settlements, in force from 22 September 2026. |
| Confidence | confirmed |
| Scope | west-bank |
| Summary (EN) | The Government banned the import, purchase and sale of goods from Israeli settlements in the Palestinian territories, from 22 September 2026. |
| Summary (FR) | Le gouvernement a interdit l'importation, l'achat et la vente de produits des colonies israéliennes dans les territoires palestiniens, à compter du 22 septembre 2026. |
| Second reading | agree, 2026-09-28 |

Evidence 1: `src_20260721_rijksoverheid_goederen-nederzettingen` (official, Rijksoverheid (Government of the Netherlands), 2026-07-21), locator **line 2**, language `nl`.
Wayback: <https://web.archive.org/web/20260928173756id_/https://www.rijksoverheid.nl/actueel/nieuws/2026/07/21/kabinet-maatregelen-goederen-uit-onrechtmatige-israelische-nederzettingen>

Quote:

> Vanaf 22 september 2026 geldt een nationaal verbod op invoer, aankoop en verkoop van goederen afkomstig uit onrechtmatige Israëlische nederzettingen in de Palestijnse Gebieden.

Translation in the record:

> From 22 September 2026 a national ban applies on the import, purchase and sale of goods originating from unlawful Israeli settlements in the Palestinian Territories.

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20260721_rijksoverheid_goederen-nederzettingen.txt`:

> Vanaf 22 september 2026 geldt een nationaal verbod op invoer, aankoop en verkoop van goederen afkomstig uit onrechtmatige Israëlische nederzettingen in de Palestijnse Gebieden. Ook het omzeilen van deze maatregelen is verboden.

Evidence 2: `src_20260721_officielebekendmakingen_stb-2026-222` (official, Staatsblad van het Koninkrijk der Nederlanden (Government of the Netherlands), 2026-07-21), locator **line 185**, language `nl`.
Wayback: <https://web.archive.org/web/20261109033817id_/https://zoek.officielebekendmakingen.nl/stb-2026-222.html>

Quote:

> Het verbod houdt in dat goederen uit een onrechtmatige nederzetting in de door Israël bezette gebieden niet op Nederlands grondgebied mogen worden binnengebracht.

Translation in the record:

> The prohibition means that goods from an unlawful settlement in the territories occupied by Israel may not be brought onto Dutch territory.

Mechanical check: found at line 185, starting within the locator (line 185). Archived text at line 185 of `archive/text/src_20260721_officielebekendmakingen_stb-2026-222.txt`:

> In dit lid wordt het invoerverbod geregeld. Het verbod houdt in dat goederen uit een onrechtmatige nederzetting in de door Israël bezette gebieden niet op Nederlands grondgebied mogen worden binnengebracht.

#### evt_2025_05_20_NLD_C1

- [ ] Checked (161 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | C1, standing |
| Date | 2025-05-20 |
| Speaker or actor | Government of the Netherlands / Gouvernement des Pays-Bas |
| Tier (points) | +4: Review tier (+4): the EU launched a review of Israel's compliance with Article 2 of the Association Agreement, a review the Netherlands had requested on 6 May 2025; no suspension was adopted. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Government requested and supported the review of the EU–Israel Association Agreement launched by the Foreign Affairs Council on 20 May 2025. |
| Summary (FR) | Le gouvernement a demandé et soutenu le réexamen de l'accord d'association UE–Israël lancé par le Conseil des affaires étrangères le 20 mai 2025. |
| Second reading | agree, 2026-09-28 |

Evidence 1: `src_20250520_eeas_fac-press-remarks-kallas` (official, European External Action Service, 2025-05-20), locator **line 13**, language `en`.
Wayback: <https://web.archive.org/web/20260928124548id_/https://www.eeas.europa.eu/eeas/foreign-affairs-council-press-remarks-high-representative-kaja-kallas-after-meeting-2_en>

Quote:

> It is clear from today's discussion that there is a strong majority in favour of [the] review of Article 2 of our Association Agreement with Israel. So, we will launch this exercise

Mechanical check: found at line 13, starting within the locator (line 13). Archived text at line 13 of `archive/text/src_20250520_eeas_fac-press-remarks-kallas.txt`:

> It is clear from today's discussion that there is a strong majority in favour of [the] review of Article 2 of our Association Agreement with Israel. So, we will launch this exercise and, in the meantime, it is up to Israel to unblock the humanitarian aid. Saving lives must be our top priority.

Evidence 2: `src_20250507_officielebekendmakingen_kst-32623-352` (official, Tweede Kamer der Staten-Generaal (letter of the Minister of Foreign Affairs), 2025-05-07), locator **line 9**, language `nl`.
Wayback: <https://web.archive.org/web/20260928173602id_/https://zoek.officielebekendmakingen.nl/kst-32623-352.html>

Quote:

> Graag informeer ik uw Kamer over het verzoek dat ik heb gedaan aan Kaja Kallas, Hoge Vertegenwoordiger voor buitenlandse zaken en veiligheidsbeleid en Vicevoorzitter van de Europese Commissie, om de naleving door Israël van artikel 2 van het EU-Israël Associatieakkoord te evalueren.

Translation in the record:

> I would like to inform your House of the request I made to Kaja Kallas, High Representative for Foreign Affairs and Security Policy and Vice-President of the European Commission, to evaluate Israel's compliance with Article 2 of the EU–Israel Association Agreement.

Mechanical check: found at line 9, starting within the locator (line 9). Archived text at line 9 of `archive/text/src_20250507_officielebekendmakingen_kst-32623-352.txt`:

> Graag informeer ik uw Kamer over het verzoek dat ik heb gedaan aan Kaja Kallas, Hoge Vertegenwoordiger voor buitenlandse zaken en veiligheidsbeleid en Vicevoorzitter van de Europese Commissie, om de naleving door Israël van artikel 2 van het EU-Israël Associatieakkoord te evalueren. Hierbij zal Nederland hangende de evaluatie de verlenging van het EU-Israël actieplan blokkeren.

Evidence 3: `src_20250728_officielebekendmakingen_kst-23432-569` (official, Tweede Kamer der Staten-Generaal (letter of the Minister of Foreign Affairs), 2025-07-28), locator **line 12**, language `nl`.
Wayback: <https://web.archive.org/web/20260928172558id_/https://zoek.officielebekendmakingen.nl/kst-23432-569.html>

Quote:

> Om deze reden heeft Nederland in mei jl. in EU-verband het initiatief genomen voor een evaluatie van artikel 2 van het EU-Israël Associatieakkoord.

Translation in the record:

> For this reason the Netherlands took the initiative in May, within the EU, for an evaluation of Article 2 of the EU–Israel Association Agreement.

Mechanical check: found at line 12, starting within the locator (line 12). Archived text at line 12 of `archive/text/src_20250728_officielebekendmakingen_kst-23432-569.txt`:

> Het kabinet zet zich in om de situatie te verbeteren, door een combinatie van druk en dialoog. Om deze reden heeft Nederland in mei jl. in EU-verband het initiatief genomen voor een evaluatie van artikel 2 van het EU-Israël Associatieakkoord. Aanleiding was de catastrofale humanitaire situatie in de Gazastrook, maar ook de verslechterende situatie op de Westelijke Jordaanoever en Israëlische …

#### evt_2024_11_21_NLD_B5

- [ ] Checked (162 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B5, standing |
| Date | 2024-11-21 |
| Speaker or actor | Minister of Foreign Affairs / Ministre des Affaires étrangères |
| Tier (points) | +8 |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister of Foreign Affairs told the House of Representatives that the Netherlands executes arrest warrants of the International Criminal Court. |
| Summary (FR) | Le ministre des Affaires étrangères a déclaré à la Chambre des représentants que les Pays-Bas exécutaient les mandats d'arrêt de la Cour pénale internationale. |
| Second reading | agree, 2026-09-28 |

Evidence 1: `src_20241121_officielebekendmakingen_h-tk-20242025-27-7` (official, Tweede Kamer der Staten-Generaal, 2024-11-21), locator **line 181**, language `nl`.
Wayback: <https://web.archive.org/web/20260928173527id_/https://zoek.officielebekendmakingen.nl/h-tk-20242025-27-7.html>

Quote:

> We leven het Statuut van Rome voor honderd procent na. Over arrestatiebevelen: het is duidelijk dat wij een arrestatiebevel uitvoeren.

Translation in the record:

> We comply with the Rome Statute one hundred per cent. On arrest warrants: it is clear that we execute an arrest warrant.

Mechanical check: found at line 181, starting within the locator (line 181). Archived text at line 181 of `archive/text/src_20241121_officielebekendmakingen_h-tk-20242025-27-7.txt`:

> We leven het Statuut van Rome voor honderd procent na. Over arrestatiebevelen: het is duidelijk dat wij een arrestatiebevel uitvoeren. Dat is gewoon het naleven van het Statuut van Rome. Nederland is op basis van het Statuut van Rome en de Uitvoeringswet Internationaal Strafhof verplicht om …

Evidence 2: `src_20241121_officielebekendmakingen_h-tk-20242025-27-7` (official, Tweede Kamer der Staten-Generaal, 2024-11-21), locator **line 189**, language `nl`.
Wayback: <https://web.archive.org/web/20260928173527id_/https://zoek.officielebekendmakingen.nl/h-tk-20242025-27-7.html>

Quote:

> Dat betekent dat wij arrestatiebevelen opvolgen als iemand zich op Nederlands grondgebied bevindt.

Translation in the record:

> That means that we act on arrest warrants if someone is on Dutch territory.

Mechanical check: found at line 189, starting within the locator (line 189). Archived text at line 189 of `archive/text/src_20241121_officielebekendmakingen_h-tk-20242025-27-7.txt`:

> … Strafhof. Wij leven het Statuut van Rome, dat over het Internationaal Strafhof gaat, voor honderd procent na. Nederland werkt daar dus volledig mee samen. Dat betekent dat wij arrestatiebevelen opvolgen als iemand zich op Nederlands grondgebied bevindt. En dat betekent dat wij niet-essentiële contacten inderdaad niet aangaan.

#### evt_2024_01_27_NLD_D2

- [ ] Checked (163 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | D2, standing |
| Date | 2024-01-27 to 2024-09-25 |
| Speaker or actor | — / — |
| Tier (points) | −10 |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister for Foreign Trade and Development Cooperation froze future Dutch contributions to UNRWA pending the investigation of allegations against its staff. |
| Summary (FR) | Le ministre du Commerce extérieur et de la Coopération au développement a gelé les futures contributions néerlandaises à l'UNRWA dans l'attente de l'enquête sur des accusations visant son personnel. |
| Second reading | agree, 2026-09-28 |

Evidence 1: `src_20240127_rijksoverheid_bevriest-bijdragen-unrwa` (official, Rijksoverheid (Government of the Netherlands), 2024-01-27), locator **line 2**, language `nl`.
Wayback: <https://web.archive.org/web/20260928173328id_/https://www.rijksoverheid.nl/actueel/nieuws/2024/01/27/nederland-bevriest-bijdragen-unrwa>

Quote:

> Nederland bevriest toekomstige bijdragen aan de VN-organisatie UNRWA.

Translation in the record:

> The Netherlands is freezing future contributions to the UN organisation UNRWA.

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20240127_rijksoverheid_bevriest-bijdragen-unrwa.txt`:

> Nederland bevriest toekomstige bijdragen aan de VN-organisatie UNRWA. Dat heeft minister Geoffrey van Leeuwen (Buitenlandse Handel en Ontwikkelingssamenwerking) besloten na de aankondiging van onderzoek van UNRWA naar vermeende …

Evidence 2: `src_20240127_rijksoverheid_bevriest-bijdragen-unrwa` (official, Rijksoverheid (Government of the Netherlands), 2024-01-27), locator **line 3**, language `nl`.
Wayback: <https://web.archive.org/web/20260928173328id_/https://www.rijksoverheid.nl/actueel/nieuws/2024/01/27/nederland-bevriest-bijdragen-unrwa>

Quote:

> In de tussentijd gaat er geen geld meer naar UNRWA, ook niet bij nieuwe verzoeken vanwege de situatie daar.

Translation in the record:

> In the meantime no more money goes to UNRWA, including in response to new requests because of the situation there.

Mechanical check: found at line 3, starting within the locator (line 3). Archived text at line 3 of `archive/text/src_20240127_rijksoverheid_bevriest-bijdragen-unrwa.txt`:

> Van Leeuwen wacht de uitkomsten van het onderzoek af. In de tussentijd gaat er geen geld meer naar UNRWA, ook niet bij nieuwe verzoeken vanwege de situatie daar.

### Norway (NOR)

#### evt_2023_10_28_NOR_B9

- [ ] Checked (164 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2023-10-28 |
| Speaker or actor | Minister of Foreign Affairs / Ministre des Affaires étrangères |
| Tier (points) | +5: Names specific violations (+5): the Minister stated that attacks on hospitals and health personnel, on civilian infrastructure and denying access to necessities through a full blockade are not in line with the law of war; he also called for an immediate ceasefire. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister of Foreign Affairs called for an immediate ceasefire and said attacks on hospitals and a full blockade of Gaza were not in line with the law of war. |
| Summary (FR) | Le ministre des Affaires étrangères a appelé à un cessez-le-feu immédiat et a déclaré que les attaques contre des hôpitaux et un blocus total de Gaza n'étaient pas conformes au droit de la guerre. |
| Second reading | agree, 2026-09-28 |

Evidence 1: `src_20231028_regjeringen_uttalelse-midtosten` (official, Utenriksdepartementet (Ministry of Foreign Affairs), 2023-10-28), locator **line 6**, language `nb`.
Wayback: <https://web.archive.org/web/20260217154346id_/https://www.regjeringen.no/no/aktuelt/uttalelse-fra-utenriksministeren-om-midtosten/id3007541/>

Quote:

> Norge ber om en umiddelbar våpenstillstand.

Translation in the record:

> Norway calls for an immediate ceasefire.

Mechanical check: found at line 6, starting within the locator (line 6). Archived text at line 6 of `archive/text/src_20231028_regjeringen_uttalelse-midtosten.txt`:

> Det som haster aller mest, er å få et opphold i krigen så ikke flere blir drept og for å kunne hjelpe dem som er rammet. Norge ber om en umiddelbar våpenstillstand. Vi har kontakt med alle parter og land som kan bidra til å legge press for å få til en våpenstillstand. Vi har vært tydelige overfor Israel at de har rett til …

Evidence 2: `src_20231028_regjeringen_uttalelse-midtosten` (official, Utenriksdepartementet (Ministry of Foreign Affairs), 2023-10-28), locator **line 7**, language `nb`.
Wayback: <https://web.archive.org/web/20260217154346id_/https://www.regjeringen.no/no/aktuelt/uttalelse-fra-utenriksministeren-om-midtosten/id3007541/>

Quote:

> Angrep på sykehus og helsepersonell, sivil infrastruktur og det å hindre tilgang til livsnødvendigheter gjennom en full blokade er for eksempel ikke i tråd med krigens folkerett.

Translation in the record:

> Attacks on hospitals and health personnel, civilian infrastructure and preventing access to necessities through a full blockade are, for example, not in line with the international law of war.

Mechanical check: found at line 7, starting within the locator (line 7). Archived text at line 7 of `archive/text/src_20231028_regjeringen_uttalelse-midtosten.txt`:

> … stridende og sivile så langt det er mulig, og det må være forholdsmessighet mellom militærmakten man anvender og det militære og politiske mål man vil oppnå. Angrep på sykehus og helsepersonell, sivil infrastruktur og det å hindre tilgang til livsnødvendigheter gjennom en full blokade er for eksempel ikke i tråd med krigens folkerett. Dette gjelder for øvrig for alle parter i konflikten.

#### evt_2026_09_24_NOR_B9

- [ ] Checked (165 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2026-09-24 |
| Speaker or actor | Minister of Foreign Affairs / Ministre des Affaires étrangères |
| Tier (points) | +2: Formal call to end restrictions on aid (+2): the Minister says that more humanitarian assistance must be allowed into Gaza and that the 20-point plan must be implemented; the same release says the illegality of the settlements has been established by the Security Council and the International Court of Justice (West Bank, see the note). |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister of Foreign Affairs said that more humanitarian assistance must be allowed into Gaza and that the 20-point peace plan must be implemented. |
| Summary (FR) | Le ministre des Affaires étrangères a déclaré que davantage d'aide humanitaire devait être autorisée à entrer à Gaza et que le plan en vingt points devait être mis en œuvre. |
| Second reading | agree, 2026-11-09; the notes mention a flag |

Evidence 1: `src_20260924_regjeringen_norway-increases-support-palestine` (official, Ministry of Foreign Affairs (Norway), regjeringen.no, 2026-09-24), locator **line 5**, language `en`.
Wayback: <https://web.archive.org/web/20261004105037id_/https://www.regjeringen.no/en/whats-new/norway-increases-support-to-palestine/id3173552/>

Quote:

> There is an urgent need to implement the 20-point peace plan adopted by the UN Security Council last year. More humanitarian assistance must be allowed in. Reconstruction must begin.

Mechanical check: found at line 5, starting within the locator (line 5). Archived text at line 5 of `archive/text/src_20260924_regjeringen_norway-increases-support-palestine.txt`:

> ‘Norway is among the leading advocates for getting early recovery and reconstruction efforts in Gaza under way. Progress is too slow. There is an urgent need to implement the 20-point peace plan adopted by the UN Security Council last year. More humanitarian assistance must be allowed in. Reconstruction must begin. Palestinian ownership is a key prerequisite,‘ said Mr Eide.

### Naoero (NRU)

#### evt_2026_09_23_NRU_B6

- [ ] Checked (166 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B6, standing |
| Date | 2026-09-23 |
| Speaker or actor | Government of Naoero / Gouvernement de Naoero |
| Tier (points) | −10 |
| Confidence | confirmed |
| Scope | related |
| Summary (EN) | The Government took steps to withdraw Naoero from the Rome Statute, according to the Presidency of the Assembly of States Parties. |
| Summary (FR) | Le gouvernement a engagé le retrait de Naoero du Statut de Rome, selon la Présidence de l'Assemblée des États parties. |
| Second reading | agree, 2026-11-10; the notes mention a flag |

Evidence 1: `src_20260930_icc-asp_statement-naoero-withdrawal` (official, International Criminal Court, Presidency of the Assembly of States Parties (icc-cpi.int), 2026-09-30), locator **line 98**, language `en`.
Wayback: <https://web.archive.org/web/20261110004448id_/https://www.icc-cpi.int/news/statement-presidency-assembly-states-parties-withdrawal-rome-statute-naoero>

Quote:

> The Presidency of the Assembly of States Parties to the Rome Statute, in response to steps taken by the Government of Naoero towards withdrawal from the Rome Statute, the treaty establishing the International Criminal Court (“ICC”), has taken note of the situation with concern.

Mechanical check: found at line 98, starting within the locator (line 98). Archived text at line 98 of `archive/text/src_20260930_icc-asp_statement-naoero-withdrawal.txt`:

> The Presidency of the Assembly of States Parties to the Rome Statute, in response to steps taken by the Government of Naoero towards withdrawal from the Rome Statute, the treaty establishing the International Criminal Court (“ICC”), has taken note of the situation with concern.

### New Zealand (NZL)

#### evt_2024_02_29_NZL_B11

- [ ] Checked (167 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B11, standing |
| Date | 2024-02-29 |
| Speaker or actor | Prime Minister and Minister of Foreign Affairs / Premier ministre et ministre des Affaires étrangères |
| Tier (points) | +5: Settlers tier (+5): travel bans on a number of Israeli settlers; later rounds continue the same standing state. |
| Confidence | confirmed |
| Scope | west-bank |
| Summary (EN) | The Prime Minister and the Minister of Foreign Affairs announced travel bans on a number of Israeli settlers who had committed violent attacks against Palestinians in the West Bank. |
| Summary (FR) | Le Premier ministre et le ministre des Affaires étrangères ont annoncé des interdictions de voyage visant des colons israéliens auteurs d'attaques violentes contre des Palestiniens en Cisjordanie. |
| Second reading | agree, 2026-10-05 |

Evidence 1: `src_20240229_beehive_travel-bans-settlers` (official, Office of the Prime Minister and Minister of Foreign Affairs of New Zealand (Beehive), 2024-02-29), locator **line 39**, language `en`.
Wayback: <https://web.archive.org/web/20240229115611id_/https://www.beehive.govt.nz/release/travel-bans-extremist-israeli-settlers>

Quote:

> Prime Minister Christopher Luxon and Foreign Minister Winston Peters have announced travel bans on a number of extremist Israeli settlers who have committed violent attacks against Palestinians in the West Bank.

Mechanical check: found at line 39, starting within the locator (line 39). Archived text at line 39 of `archive/text/src_20240229_beehive_travel-bans-settlers.txt`:

> Prime Minister Christopher Luxon and Foreign Minister Winston Peters have announced travel bans on a number of extremist Israeli settlers who have committed violent attacks against Palestinians in the West Bank.

Evidence 2: `src_20240229_beehive_travel-bans-settlers` (official, Office of the Prime Minister and Minister of Foreign Affairs of New Zealand (Beehive), 2024-02-29), locator **line 42**, language `en`.
Wayback: <https://web.archive.org/web/20240229115611id_/https://www.beehive.govt.nz/release/travel-bans-extremist-israeli-settlers>

Quote:

> "We are imposing travel bans on a number of people known to have committed violent acts. These individuals will not be able to travel to New Zealand.

Mechanical check: found at line 42, starting within the locator (line 42). Archived text at line 42 of `archive/text/src_20240229_beehive_travel-bans-settlers.txt`:

> "We are imposing travel bans on a number of people known to have committed violent acts. These individuals will not be able to travel to New Zealand.

#### evt_2025_07_30_NZL_B9

- [ ] Checked (168 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-07-30 |
| Speaker or actor | Minister of Foreign Affairs / Ministre des Affaires étrangères |
| Tier (points) | +2: Calls for a ceasefire (+2): in a joint statement the fifteen foreign ministers 'demand an immediate ceasefire, the immediate and unconditional release of all hostages of Hamas' and unhindered humanitarian access; no violation is named (as evt_2025_07_30_AUS_B9, evt_2025_07_30_MLT_B9 and the other signatories). |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister of Foreign Affairs, with 14 other foreign ministers, demanded an immediate ceasefire and unhindered humanitarian access in Gaza. |
| Summary (FR) | Le ministre des Affaires étrangères, avec 14 autres ministres, a exigé un cessez-le-feu immédiat et un accès humanitaire sans entrave à Gaza. |
| Second reading | agree, 2026-11-28 |

Evidence 1: `src_20250730_gac_joint-statement-new-york-call` (official, Global Affairs Canada, 2025-07-30), locator **line 5**, language `en`.
Wayback: <https://web.archive.org/web/20260907132323id_/https://www.canada.ca/en/global-affairs/news/2025/07/new-york-call---joint-statement-of-the-ministers-of-foreign-affairs.html>

Quote:

> Demand an immediate ceasefire, the immediate and unconditional release of all hostages of Hamas, including the remains, as well as ensuring unhindered humanitarian access;

Mechanical check: found at line 5, starting within the locator (line 5). Archived text at line 5 of `archive/text/src_20250730_gac_joint-statement-new-york-call.txt`:

> “Demand an immediate ceasefire, the immediate and unconditional release of all hostages of Hamas, including the remains, as well as ensuring unhindered humanitarian access;

Evidence 2: `src_20250730_gac_joint-statement-new-york-call` (official, Global Affairs Canada, 2025-07-30), locator **line 1**, language `en`.
Wayback: <https://web.archive.org/web/20260907132323id_/https://www.canada.ca/en/global-affairs/news/2025/07/new-york-call---joint-statement-of-the-ministers-of-foreign-affairs.html>

Quote:

> The Foreign Ministers of Andorra, Australia, Canada, Finland, France, Iceland, Ireland, Luxembourg, Malta, New Zealand, Norway, Portugal, San Marino, Slovenia and Spain, issued the following statement:

Mechanical check: found at line 1, starting within the locator (line 1). Archived text at line 1 of `archive/text/src_20250730_gac_joint-statement-new-york-call.txt`:

> The Foreign Ministers of Andorra, Australia, Canada, Finland, France, Iceland, Ireland, Luxembourg, Malta, New Zealand, Norway, Portugal, San Marino, Slovenia and Spain, issued the following statement:

#### evt_2024_07_26_NZL_B9

- [ ] Checked (169 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2024-07-26 |
| Speaker or actor | Prime Minister / Premier ministre |
| Tier (points) | +2: Formal call for a ceasefire (+2): an immediate ceasefire is called for; no violation is named. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Prime Minister, with the Prime Ministers of Australia and Canada, called for an immediate ceasefire in Gaza and an increase in the flow of assistance. |
| Summary (FR) | Le Premier ministre, avec les Premiers ministres de l'Australie et du Canada, a appelé à un cessez-le-feu immédiat à Gaza et à une augmentation de l'aide acheminée. |
| Second reading | agree, 2026-10-05 |

Evidence 1: `src_20240726_pm-gc_joint-statement-aus-can-nzl` (official, Prime Minister of Canada, 2024-07-26), locator **line 5**, language `en`.
Wayback: <https://web.archive.org/web/20260806021908id_/https://www.pm.gc.ca/en/news/statements/2024/07/26/joint-statement-prime-ministers-australia-canada-and-new>

Quote:

> An immediate ceasefire is needed desperately.

Mechanical check: found at line 5, starting within the locator (line 5). Archived text at line 5 of `archive/text/src_20240726_pm-gc_joint-statement-aus-can-nzl.txt`:

> An immediate ceasefire is needed desperately. Civilians must be protected, and a sustained increase in the flow of assistance throughout Gaza is needed to address the humanitarian situation.

Evidence 2: `src_20261005_mfat_israel-hamas-conflict-faq` (official, Ministry of Foreign Affairs and Trade of New Zealand, 2026-10-05), locator **line 123**, language `en`.
Wayback: <https://web.archive.org/web/20261005124257id_/https://www.mfat.govt.nz/en/countries-and-regions/middle-east/israel-hamas-conflict>

Quote:

> CANZ statement: Joint statement from the Prime Ministers of Canada, Australia and New Zealand(external link) (26 July 2024)

Mechanical check: found at line 123, starting within the locator (line 123). Archived text at line 123 of `archive/text/src_20261005_mfat_israel-hamas-conflict-faq.txt`:

> CANZ statement: Joint statement from the Prime Ministers of Canada, Australia and New Zealand(external link) (26 July 2024)

### Oman (OMN)

#### evt_2025_11_23_OMN_B9

- [ ] Checked (170 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-11-23 |
| Speaker or actor | Minister of Foreign Affairs / Ministre des Affaires étrangères |
| Tier (points) | +5: Uses a legal characterisation (+5): the Foreign Minister lists Israel's invasion of Gaza among 'clearly illegal actions' (flagged: the characterisation is of the invasion as such, in a talk on foreign military interventions). |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Foreign Minister listed Israel's invasion of Gaza among actions he described as contrary to international law, in a talk to the Muscat Retreat of the Oslo Forum. |
| Summary (FR) | Le ministre des Affaires étrangères a rangé l'invasion de Gaza par Israël parmi les actions qu'il a décrites comme contraires au droit international, devant la retraite de Mascate du Forum d'Oslo. |
| Second reading | agree, 2026-11-04; the notes mention a flag |

Evidence 1: `src_20251123_fm-gov-om_fm-oslo-forum-retreat` (official, Ministry of Foreign Affairs of the Sultanate of Oman, 2025-11-23), locator **line 3**, language `en`.
Wayback: <https://web.archive.org/web/20260711052403id_/https://www.fm.gov.om/en/31623/>

Quote:

> “Of course, we cannot ignore such clearly illegal actions such as Russia’s war in Ukraine, or Israel’s invasion of Gaza and its continued illegal occupation of Palestine.

Mechanical check: found at line 3, starting within the locator (line 3). Archived text at line 3 of `archive/text/src_20251123_fm-gov-om_fm-oslo-forum-retreat.txt`:

> “Of course, we cannot ignore such clearly illegal actions such as Russia’s war in Ukraine, or Israel’s invasion of Gaza and its continued illegal occupation of Palestine.

Evidence 2: `src_20251123_fm-gov-om_fm-oslo-forum-retreat` (official, Ministry of Foreign Affairs of the Sultanate of Oman, 2025-11-23), locator **line 1**, language `en`.
Wayback: <https://web.archive.org/web/20260711052403id_/https://www.fm.gov.om/en/31623/>

Quote:

> The following is the edited text of a talk delivered by Sayyid Badr Albusaidi, Foreign Minister of the Sultanate of Oman to the Muscat Retreat of the Oslo Forum

Mechanical check: found at line 1, starting within the locator (line 1). Archived text at line 1 of `archive/text/src_20251123_fm-gov-om_fm-oslo-forum-retreat.txt`:

> The following is the edited text of a talk delivered by Sayyid Badr Albusaidi, Foreign Minister of the Sultanate of Oman to the Muscat Retreat of the Oslo Forum:

### Pakistan (PAK)

#### evt_2026_08_06_PAK_B9

- [ ] Checked (171 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2026-08-06 |
| Speaker or actor | Deputy Prime Minister and Minister of Foreign Affairs / Vice-Premier ministre et ministre des Affaires étrangères |
| Tier (points) | +5: Specific violations named (+5): the joint statement of the foreign ministers of eight states condemned the targeting of healthcare facilities and medical infrastructure and attacks on civilian infrastructure in the Gaza Strip, in grave violation of international humanitarian law. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Foreign Minister and seven counterparts condemned the targeting of healthcare facilities and civilian infrastructure in the Gaza Strip. |
| Summary (FR) | Le ministre des Affaires étrangères et sept homologues ont condamné le ciblage des établissements de santé et des infrastructures civiles dans la bande de Gaza. |
| Second reading | agree, 2026-11-04; the notes mention a flag |

Evidence 1: `src_20260806_mofa-ae_fms-joint-statement-gaza` (official, Ministry of Foreign Affairs, United Arab Emirates, 2026-08-06), locator **line 3**, language `en`.
Wayback: <https://web.archive.org/web/20260929124028id_/https://www.mofa.gov.ae/en/MediaHub/News/2026/8/6/UAE-Statement>

Quote:

> particularly the targeting of healthcare facilities and medical infrastructure, attacks on civilian infrastructure, and the continued loss of civilian lives, including women and children, in grave violation of international law, including international humanitarian law.

Mechanical check: found at line 3, starting within the locator (line 3). Archived text at line 3 of `archive/text/src_20260806_mofa-ae_fms-joint-statement-gaza.txt`:

> … of Saudi Arabia, and the Arab Republic of Egypt express their strongest condemnation and denunciation of the ongoing Israeli violations in the Gaza Strip, particularly the targeting of healthcare facilities and medical infrastructure, attacks on civilian infrastructure, and the continued loss of civilian lives, including women and children, in grave violation of international law, including international humanitarian law.

Evidence 2: `src_20260806_mofa-ae_fms-joint-statement-gaza` (official, Ministry of Foreign Affairs, United Arab Emirates, 2026-08-06), locator **line 3**, language `en`.
Wayback: <https://web.archive.org/web/20260929124028id_/https://www.mofa.gov.ae/en/MediaHub/News/2026/8/6/UAE-Statement>

Quote:

> the Islamic Republic of Pakistan

Mechanical check: found at line 3, starting within the locator (line 3). Archived text at line 3 of `archive/text/src_20260806_mofa-ae_fms-joint-statement-gaza.txt`:

> The Ministers of Foreign Affairs of the United Arab Emirates, the State of Qatar, the Hashemite Kingdom of Jordan, the Republic of Indonesia, the Islamic Republic of Pakistan, the Republic of Türkiye, the Kingdom of Saudi Arabia, and the Arab Republic of Egypt express their strongest condemnation and denunciation of the ongoing …

### Panama (PAN)

#### evt_2026_05_27_PAN_C2

- [ ] Checked (172 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | C2, standing |
| Date | 2026-05-27 |
| Speaker or actor | Government of Panama / Gouvernement du Panama |
| Tier (points) | −10: C2 (-10): a memorandum of understanding on cooperation signed with Israel by the Minister of Foreign Affairs and Israel's ambassador, between Panama's Ministry of Foreign Affairs and Israel's MASHAV agency, on health, water, agriculture, education and technology, with Israeli private companies as partners in public-private projects (docs/calibration/README.md R18, one event per instrument). |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister of Foreign Affairs signed with Israel's ambassador a memorandum of understanding on cooperation with the Israeli agency MASHAV, on health, water, agriculture and education. |
| Summary (FR) | Le ministre des Affaires étrangères a signé avec l'ambassadeur d'Israël un mémorandum d'entente de coopération avec l'agence israélienne MASHAV (santé, eau, agriculture, éducation). |
| Second reading | agree, 2026-10-06; the notes mention a flag |

Evidence 1: `src_20260527_mire_memorando-mashav-israel` (official, Ministerio de Relaciones Exteriores de Panamá (mire.gob.pa), 2026-05-27), locator **line 3**, language `es`.
Wayback: <https://web.archive.org/web/20261006090934id_/https://mire.gob.pa/panama-e-israel-firman-acuerdo-de-cooperacion-en-salud-agua-agricultura-y-tecnologia/>

Quote:

> El Gobierno de la República de Panamá y el Estado de Israel firmaron este miércoles un Memorándum de Entendimiento sobre Cooperación entre la Agencia para el Desarrollo de la Cooperación Internacional MASHAV del Ministerio de Relaciones Exteriores israelí y el Ministerio de Relaciones Exteriores de Panamá, con el objetivo de fortalecer iniciativas conjuntas en áreas estratégicas como salud, agua, agricultura, educación y tecnología.

Translation in the record:

> The Government of the Republic of Panama and the State of Israel signed on Wednesday a Memorandum of Understanding on Cooperation between the MASHAV Agency for International Development Cooperation of Israel's Ministry of Foreign Affairs and Panama's Ministry of Foreign Affairs, with the aim of strengthening joint initiatives in strategic areas such as health, water, agriculture, education and technology.

Mechanical check: found at line 3, starting within the locator (line 3). Archived text at line 3 of `archive/text/src_20260527_mire_memorando-mashav-israel.txt`:

> El Gobierno de la República de Panamá y el Estado de Israel firmaron este miércoles un Memorándum de Entendimiento sobre Cooperación entre la Agencia para el Desarrollo de la Cooperación Internacional MASHAV del Ministerio de Relaciones Exteriores israelí y el Ministerio de Relaciones Exteriores de Panamá, con el objetivo de fortalecer iniciativas conjuntas en áreas estratégicas como salud, agua, agricultura, educación y tecnología.

Evidence 2: `src_20260527_mire_memorando-mashav-israel` (official, Ministerio de Relaciones Exteriores de Panamá (mire.gob.pa), 2026-05-27), locator **line 4**, language `es`.
Wayback: <https://web.archive.org/web/20261006090934id_/https://mire.gob.pa/panama-e-israel-firman-acuerdo-de-cooperacion-en-salud-agua-agricultura-y-tecnologia/>

Quote:

> El acuerdo fue suscrito por el ministro de Relaciones Exteriores de Panamá, Javier Martínez-Acha Vásquez, y el embajador de Israel en Panamá, Mattanya Cohen.

Translation in the record:

> The agreement was signed by Panama's Minister of Foreign Affairs, Javier Martínez-Acha Vásquez, and Israel's ambassador to Panama, Mattanya Cohen.

Mechanical check: found at line 4, starting within the locator (line 4). Archived text at line 4 of `archive/text/src_20260527_mire_memorando-mashav-israel.txt`:

> El acuerdo fue suscrito por el ministro de Relaciones Exteriores de Panamá, Javier Martínez-Acha Vásquez, y el embajador de Israel en Panamá, Mattanya Cohen.

Evidence 3: `src_20260527_prensa_panama-israel-acuerdo-agua-salud` (press, La Prensa (Panamá), 2026-05-27), locator **line 1**, language `es`.
Wayback: <https://web.archive.org/web/20261006091218id_/https://www.prensa.com/politica/panama-firma-acuerdo-con-israel-para-cooperacion-en-agua-y-salud/>

Quote:

> Panamá e Israel dieron este miércoles 27 de mayo un nuevo paso en su relación bilateral con la firma de un memorando de entendimiento.

Translation in the record:

> Panama and Israel took on Wednesday 27 May a new step in their bilateral relationship with the signing of a memorandum of understanding.

Mechanical check: found at line 1, starting within the locator (line 1). Archived text at line 1 of `archive/text/src_20260527_prensa_panama-israel-acuerdo-agua-salud.txt`:

> Panamá e Israel dieron este miércoles 27 de mayo un nuevo paso en su relación bilateral con la firma de un memorando de entendimiento.

### Peru (PER)

#### evt_2025_11_21_PER_C2

- [ ] Checked (173 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | C2, standing |
| Date | 2025-11-21 |
| Speaker or actor | Government of Peru / Gouvernement du Pérou |
| Tier (points) | −10: C2 (-10): a memorandum of understanding on cybersecurity cooperation signed on 21 November 2025 by the Secretary for Government and Digital Transformation of the Presidency of the Council of Ministers and the Director General of Israel's National Cyber Directorate (docs/calibration/README.md R18, a signed governmental instrument of cooperation, one event per instrument). |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Secretariat for Government and Digital Transformation signed with Israel's National Cyber Directorate a memorandum of understanding on cybersecurity cooperation. |
| Summary (FR) | Le Secrétariat au gouvernement et à la transformation numérique a signé avec la Direction nationale cyber d'Israël un mémorandum d'entente de coopération en cybersécurité. |
| Second reading | agree, 2026-10-06; the notes mention a flag |

Evidence 1: `src_20251121_pcm_israel-direccion-cibernetica-alianza` (official, Presidencia del Consejo de Ministros del Perú (gob.pe), 2025-11-21), locator **line 1**, language `es`.
Wayback: <https://web.archive.org/web/20261006101414id_/https://www.gob.pe/institucion/pcm/noticias/1294093-pcm-y-la-direccion-nacional-de-cibernetica-de-israel-impulsan-alianza-estrategica-para-reforzar-la-ciberseguridad-nacional>

Quote:

> La Presidencia del Consejo de Ministros, a través de la Secretaría de Gobierno y Transformación Digital, formalizó una alianza estratégica con la Dirección Nacional Cibernética del Estado de Israel mediante la suscripción de un memorando de entendimiento

Translation in the record:

> The Presidency of the Council of Ministers, through the Secretariat for Government and Digital Transformation, formalised a strategic alliance with the National Cyber Directorate of the State of Israel through the signing of a memorandum of understanding

Mechanical check: found at line 1, starting within the locator (line 1). Archived text at line 1 of `archive/text/src_20251121_pcm_israel-direccion-cibernetica-alianza.txt`:

> La Presidencia del Consejo de Ministros, a través de la Secretaría de Gobierno y Transformación Digital, formalizó una alianza estratégica con la Dirección Nacional Cibernética del Estado de Israel mediante la suscripción de un memorando de entendimiento, el cual está orientado a fortalecer la seguridad digital, la gestión de incidentes y la protección de las infraestructuras críticas del país.

Evidence 2: `src_20251121_pcm_israel-direccion-cibernetica-alianza` (official, Presidencia del Consejo de Ministros del Perú (gob.pe), 2025-11-21), locator **line 2**, language `es`.
Wayback: <https://web.archive.org/web/20261006101414id_/https://www.gob.pe/institucion/pcm/noticias/1294093-pcm-y-la-direccion-nacional-de-cibernetica-de-israel-impulsan-alianza-estrategica-para-reforzar-la-ciberseguridad-nacional>

Quote:

> El documento fue suscrito por el director general de la Dirección Nacional Cibernética de Israel, Yossi Karadi, y el secretario de la Secretaría de Gobierno y Transformación Digital, Jaime Honores, en una ceremonia realizada en simultáneo en Tel Aviv y Lima.

Translation in the record:

> The document was signed by the director general of Israel's National Cyber Directorate, Yossi Karadi, and the secretary of the Secretariat for Government and Digital Transformation, Jaime Honores, at a ceremony held simultaneously in Tel Aviv and Lima.

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20251121_pcm_israel-direccion-cibernetica-alianza.txt`:

> El documento fue suscrito por el director general de la Dirección Nacional Cibernética de Israel, Yossi Karadi, y el secretario de la Secretaría de Gobierno y Transformación Digital, Jaime Honores, en una ceremonia realizada en simultáneo en Tel Aviv y Lima. El acto contó con la participación del embajador de Israel en el Perú, Eran Yuvan.

Evidence 3: `src_20251121_andina_pcm-israel-ciberseguridad` (press, Agencia Andina (Peru public news agency), 2025-11-21), locator **line 115**, language `es`.
Wayback: <https://web.archive.org/web/20261006101254id_/https://andina.pe/agencia/noticia-pcm-e-israel-suscriben-acuerdo-para-reforzar-ciberseguridad-del-pais-1052825.aspx>

Quote:

> La Presidencia del Consejo de Ministros formalizó una alianza estratégica con la Dirección Nacional Cibernética de Israel mediante un memorando de entendimiento

Translation in the record:

> The Presidency of the Council of Ministers formalised a strategic alliance with Israel's National Cyber Directorate through a memorandum of understanding

Mechanical check: found at line 115, starting within the locator (line 115). Archived text at line 115 of `archive/text/src_20251121_andina_pcm-israel-ciberseguridad.txt`:

> La Presidencia del Consejo de Ministros formalizó una alianza estratégica con la Dirección Nacional Cibernética de Israel mediante un memorando de entendimiento que permitirá fortalecer la ciberseguridad nacional, mejorar la gestión de incidentes y elevar la protección de infraestructuras críticas.

Evidence 4: `src_20251121_efe-swissinfo_peru-israel-ciberseguridad` (press, EFE (via swissinfo.ch), 2025-11-21), locator **line 180**, language `es`.
Wayback: <https://web.archive.org/web/20261006101323id_/https://www.swissinfo.ch/spa/per%C3%BA-e-israel-firman-una-alianza-para-fortalecer-la-ciberseguridad-en-ambos-pa%C3%ADses/90430007>

Quote:

> Lima, 21 nov (EFE).- La Presidencia del Consejo de Ministros de Perú formalizó una alianza con la Dirección Nacional Cibernética de Israel mediante un memorando de entendimiento

Translation in the record:

> Lima, 21 Nov (EFE).- The Presidency of the Council of Ministers of Peru formalised an alliance with Israel's National Cyber Directorate through a memorandum of understanding

Mechanical check: found at line 180, starting within the locator (line 180). Archived text at line 180 of `archive/text/src_20251121_efe-swissinfo_peru-israel-ciberseguridad.txt`:

> Lima, 21 nov (EFE).- La Presidencia del Consejo de Ministros de Perú formalizó una alianza con la Dirección Nacional Cibernética de Israel mediante un memorando de entendimiento que permitirá fortalecer la ciberseguridad, mejorar la gestión de incidentes y elevar la protección de infraestructuras críticas en ambos países, informó este …

### Philippines (PHL)

#### evt_2025_09_27_PHL_B9

- [ ] Checked (174 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-09-27 |
| Speaker or actor | Secretary of Foreign Affairs / Secrétaire aux Affaires étrangères |
| Tier (points) | +2: Formal call (+2): the Secretary of Foreign Affairs says the suffering of millions in Gaza must end, that ceasefires must hold and that humanitarian access must be restored without restrictions. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Secretary of Foreign Affairs said that ceasefires must hold and that humanitarian access to Gaza must be restored without restrictions. |
| Summary (FR) | La secrétaire aux Affaires étrangères a dit que les cessez-le-feu devaient tenir et que l'accès humanitaire à Gaza devait être rétabli sans restrictions. |
| Second reading | agree, 2026-11-04; the notes mention a flag |

Evidence 1: `src_20250927_dfa-ungarchive_phl-lazaro-80` (official, Department of Foreign Affairs of the Philippines, PH Voices in UNGA archive (sites.google.com/dfa.gov.ph/ungarchiveph), 2025-09-27), locator **line 12**, language `en`.
Wayback: <https://web.archive.org/web/20261103233400id_/https://sites.google.com/dfa.gov.ph/ungarchiveph/by-speaker/80th-ma-theresa-p-lazaro>

Quote:

> We must end the suffering of millions who live in starvation and fear in Gaza.

Mechanical check: found at line 12, starting within the locator (line 12). Archived text at line 12 of `archive/text/src_20250927_dfa-ungarchive_phl-lazaro-80.txt`:

> We must end the suffering of millions who live in starvation and fear in Gaza.

Evidence 2: `src_20250927_dfa-ungarchive_phl-lazaro-80` (official, Department of Foreign Affairs of the Philippines, PH Voices in UNGA archive (sites.google.com/dfa.gov.ph/ungarchiveph), 2025-09-27), locator **line 13**, language `en`.
Wayback: <https://web.archive.org/web/20261103233400id_/https://sites.google.com/dfa.gov.ph/ungarchiveph/by-speaker/80th-ma-theresa-p-lazaro>

Quote:

> Ceasefires must hold. Humanitarian access must be restored without restrictions.

Mechanical check: found at line 13, starting within the locator (line 13). Archived text at line 13 of `archive/text/src_20250927_dfa-ungarchive_phl-lazaro-80.txt`:

> Ceasefires must hold. Humanitarian access must be restored without restrictions. Children, women, and innocent civilians must be saved from further violence. Healing must begin. The Two-State solution is the only viable diplomatic solution …

### Papua New Guinea (PNG)

#### evt_2024_10_07_PNG_B9

- [ ] Checked (175 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2024-10-07 |
| Speaker or actor | Prime Minister of Papua New Guinea / Premier ministre de la Papouasie-Nouvelle-Guinée |
| Tier (points) | +2: Formal call for a ceasefire (+2): the Prime Minister, in a statement on the first anniversary of 7 October 2023 that cites the conflict in Gaza, says 'There must be a ceasefire.' The same paragraph says Israel will be asked to cease its military operations when Hamas and Hezbollah abandon their campaigns and calls on all parties to negotiate; no violation is named (not +5). |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Prime Minister said there must be a ceasefire, in a statement on the first anniversary of 7 October 2023 that also called for the release of all hostages held by Hamas. |
| Summary (FR) | Le Premier ministre a dit qu'il devait y avoir un cessez-le-feu, dans une déclaration pour le premier anniversaire du 7 octobre 2023 qui demandait aussi la libération des otages du Hamas. |
| Second reading | agree, 2026-10-07; the notes mention a flag |

Evidence 1: `src_20241007_pmnec-pg_marape-october-7-statement` (official, Department of Prime Minister and National Executive Council of Papua New Guinea, 2024-10-07), locator **paragraph 3, last sentence**, language `en`.
Wayback: <https://web.archive.org/web/20250814140442id_/https://www.pmnec.gov.pg/statement-by-prime-minister-hon-james-marape-on-the-recent-attacks-on-israel-and-the-first-anniversary-of-october-7-2023/>

Quote:

> There must be a ceasefire.

Mechanical check: found at line 3; the locator is not a line number. Archived text at line 3 of `archive/text/src_20241007_pmnec-pg_marape-october-7-statement.txt`:

> … conflicts must be resolved through peaceful means. Hamas and Hezbollah must lay down their arms for peace to prevail.Hamas must release the hostages alive. There must be a ceasefire.

Evidence 2: `src_20241007_pmnec-pg_marape-october-7-statement` (official, Department of Prime Minister and National Executive Council of Papua New Guinea, 2024-10-07), locator **paragraph 2**, language `en`.
Wayback: <https://web.archive.org/web/20250814140442id_/https://www.pmnec.gov.pg/statement-by-prime-minister-hon-james-marape-on-the-recent-attacks-on-israel-and-the-first-anniversary-of-october-7-2023/>

Quote:

> Let us not forget that the subsequent conflict in Gaza would never have unfolded if Hamas had not initiated the attack on Israel on that tragic day.

Mechanical check: found at line 2; the locator is not a line number. Archived text at line 2 of `archive/text/src_20241007_pmnec-pg_marape-october-7-statement.txt`:

> This attack comes at a sensitive time, as we mark the first anniversary of the horrific October 7, 2023, assault on Israel by Hamas. Let us not forget that the subsequent conflict in Gaza would never have unfolded if Hamas had not initiated the attack on Israel on that tragic day. The violence of that event continues to reverberate, as innocent lives are lost, and communities suffer.

Evidence 3: `src_20241007_pmnec-pg_marape-october-7-statement` (official, Department of Prime Minister and National Executive Council of Papua New Guinea, 2024-10-07), locator **paragraph 4**, language `en`.
Wayback: <https://web.archive.org/web/20250814140442id_/https://www.pmnec.gov.pg/statement-by-prime-minister-hon-james-marape-on-the-recent-attacks-on-israel-and-the-first-anniversary-of-october-7-2023/>

Quote:

> Israel will be asked to cease its military operations when these groups abandon their violent campaigns.

Mechanical check: found at line 4; the locator is not a line number. Archived text at line 4 of `archive/text/src_20241007_pmnec-pg_marape-october-7-statement.txt`:

> Israel will be asked to cease its military operations when these groups abandon their violent campaigns. We urge all parties to find a way to negotiate for peace, for the sake of the innocent civilians caught in this tragic conflict.

### Poland (POL)

#### evt_2025_09_22_POL_B9

- [ ] Checked (176 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-09-22 |
| Speaker or actor | Minister of Foreign Affairs / Ministre des Affaires étrangères |
| Tier (points) | +2: Formal call for the end of restrictions on aid (+2): the joint statement calls on Israel to lift restrictions on the delivery of medicine and medical equipment to Gaza and to restore the medical corridor; no violation is named. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister of Foreign Affairs, with other foreign ministers, called on Israel to lift restrictions on deliveries of medicine to Gaza and to restore the medical corridor to the West Bank. |
| Summary (FR) | Le ministre des Affaires étrangères, avec d'autres ministres, a appelé Israël à lever les restrictions aux livraisons de médicaments à Gaza et à rétablir le corridor médical vers la Cisjordanie. |
| Second reading | agree, 2026-09-29 |

Evidence 1: `src_20250923_gov-pl_leczenie-pacjentow-gaza` (official, Ministerstwo Spraw Zagranicznych, Polska pomoc (gov.pl/web/polskapomoc), 2025-09-23), locator **line 6**, language `pl`.
Wayback: <https://web.archive.org/web/20260929022834id_/https://www.gov.pl/web/polskapomoc/polska-podpisala-wspolne-oswiadczenie-w-sprawie-leczenia-pacjentow-ze-strefy-gazy>

Quote:

> Ponadto wzywamy Izrael do zniesienia ograniczeń dotyczących dostaw leków i sprzętu medycznego do Gazy zgodnie z zobowiązaniami Izraela na mocy prawa międzynarodowego, w tym międzynarodowego prawa humanitarnego

Translation in the record:

> We further call on Israel to lift restrictions on the delivery of medicines and medical equipment to Gaza in accordance with Israel's obligations under international law, including international humanitarian law

Mechanical check: found at line 6, starting within the locator (line 6). Archived text at line 6 of `archive/text/src_20250923_gov-pl_leczenie-pacjentow-gaza.txt`:

> Ponadto wzywamy Izrael do zniesienia ograniczeń dotyczących dostaw leków i sprzętu medycznego do Gazy zgodnie z zobowiązaniami Izraela na mocy prawa międzynarodowego, w tym międzynarodowego prawa humanitarnego; do pilnego umożliwienia ONZ oraz innym partnerom humanitarnym wykonywania w pełni ich ratującej życie pracy w Gazie; oraz zgodnie z rezolucją nr 2286 Rady …

Evidence 2: `src_20250923_gov-pl_leczenie-pacjentow-gaza` (official, Ministerstwo Spraw Zagranicznych, Polska pomoc (gov.pl/web/polskapomoc), 2025-09-23), locator **line 1**, language `pl`.
Wayback: <https://web.archive.org/web/20260929022834id_/https://www.gov.pl/web/polskapomoc/polska-podpisala-wspolne-oswiadczenie-w-sprawie-leczenia-pacjentow-ze-strefy-gazy>

Quote:

> 22 września Polska dołączyła do koalicji państw europejskich w sprawie leczenia pacjentów ze Strefy Gazy

Translation in the record:

> On 22 September Poland joined the coalition of European states on the treatment of patients from the Gaza Strip

Mechanical check: found at line 1, starting within the locator (line 1). Archived text at line 1 of `archive/text/src_20250923_gov-pl_leczenie-pacjentow-gaza.txt`:

> 22 września Polska dołączyła do koalicji państw europejskich w sprawie leczenia pacjentów ze Strefy Gazy na terytorium Palestyny. Inicjatorem oświadczenia jest Dania, która w II połowie 2025 roku sprawuje prezydencję w Radzie Unii Europejskiej. Poniżej …

### Portugal (PRT)

#### evt_2024_07_15_PRT_B11

- [ ] Checked (177 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B11, standing |
| Date | 2024-07-15 |
| Speaker or actor | — / — |
| Tier (points) | +5: Sanctions on settler entities (+5): the EU listing of 15 July 2024 (Decision (CFSP) 2024/1967) of five persons and three entities, among them Tzav 9 for blocking humanitarian aid trucks to Gaza, adopted by unanimity. Scoped gaza as the listing cites Gaza (docs/10 B-32; B-281 (2), as Norway's alignment, evt_2024_07_24_NOR_B11). |
| Confidence | confirmed |
| Scope | gaza, west-bank |
| Summary (EN) | The government agreed in the EU Council to sanctions on five Israeli settlers and activists and three entities, including a group blocking aid trucks bound for Gaza. |
| Summary (FR) | Le gouvernement a approuvé au Conseil de l'UE des sanctions contre cinq colons et militants israéliens et trois entités, dont un groupe bloquant les camions d'aide destinés à Gaza. |
| Second reading | agree, 2026-11-04 |

Evidence 1: `src_20240715_consilium_settlers-tzav9-sanctions` (official, Council of the European Union, 2024-07-15), locator **line 1**, language `en`.
Wayback: <https://web.archive.org/web/20240715172525id_/https://www.consilium.europa.eu/en/press/press-releases/2024/07/15/extremist-israeli-settlers-in-the-occupied-west-bank-and-east-jerusalem-as-well-as-violent-activists-blocking-humanitarian-aid-to-gaza-five-individuals-and-three-entities-sanctioned-under-the-eu-global-human-rights-sanctions-regime/>

Quote:

> Today the Council approved additional restrictive measures against five persons and three entities under the European Union's Global Human Rights Sanctions Regime. The listed individuals and entities are responsible for serious and systematic human rights abuses against Palestinians in the West Bank, including abuse of the right of everyone to enjoy the highest attainable standard of physical and mental integrity, the right to property, the right to private and family life, to freedom of religion or belief and the right to education.

Mechanical check: found at line 1, starting within the locator (line 1). Archived text at line 1 of `archive/text/src_20240715_consilium_settlers-tzav9-sanctions.txt`:

> Today the Council approved additional restrictive measures against five persons and three entities under the European Union's Global Human Rights Sanctions Regime. The listed individuals and entities are responsible for serious and systematic human rights abuses against Palestinians in the West Bank, including abuse of the right of everyone to enjoy the highest attainable standard of physical and mental integrity, the right to property, the right to private and family life, to freedom of religion or belief and the right to education.

Evidence 2: `src_20240715_consilium_settlers-tzav9-sanctions` (official, Council of the European Union, 2024-07-15), locator **line 4**, language `en`.
Wayback: <https://web.archive.org/web/20240715172525id_/https://www.consilium.europa.eu/en/press/press-releases/2024/07/15/extremist-israeli-settlers-in-the-occupied-west-bank-and-east-jerusalem-as-well-as-violent-activists-blocking-humanitarian-aid-to-gaza-five-individuals-and-three-entities-sanctioned-under-the-eu-global-human-rights-sanctions-regime/>

Quote:

> Today’s designations also include Tzav 9, an Israeli group of violent activists founded in January 2024, regularly blocking humanitarian aid trucks delivering food, water and fuel to Gaza. Tzav 9’s actions include violent protests, attacks against food trucks and the destruction of food.

Mechanical check: found at line 4, starting within the locator (line 4). Archived text at line 4 of `archive/text/src_20240715_consilium_settlers-tzav9-sanctions.txt`:

> Today’s designations also include Tzav 9, an Israeli group of violent activists founded in January 2024, regularly blocking humanitarian aid trucks delivering food, water and fuel to Gaza. Tzav 9’s actions include violent protests, attacks against food trucks and the destruction of food.

Evidence 3: `src_20240715_consilium_settlers-tzav9-sanctions` (official, Council of the European Union, 2024-07-15), locator **line 12**, language `en`.
Wayback: <https://web.archive.org/web/20240715172525id_/https://www.consilium.europa.eu/en/press/press-releases/2024/07/15/extremist-israeli-settlers-in-the-occupied-west-bank-and-east-jerusalem-as-well-as-violent-activists-blocking-humanitarian-aid-to-gaza-five-individuals-and-three-entities-sanctioned-under-the-eu-global-human-rights-sanctions-regime/>

Quote:

> Council Decision (CFSP) 2024/1967 of 15 July 2024 amending Decision (CFSP) 2020/1999 concerning restrictive measures against serious human rights violations and abuses (including the list of sanctioned individuals and entities)

Mechanical check: found at line 12, starting within the locator (line 12). Archived text at line 12 of `archive/text/src_20240715_consilium_settlers-tzav9-sanctions.txt`:

> Council Decision (CFSP) 2024/1967 of 15 July 2024 amending Decision (CFSP) 2020/1999 concerning restrictive measures against serious human rights violations and abuses (including the list of sanctioned individuals and entities)

Evidence 4: `src_20240715_eur-lex_cfsp-2024-1967` (official, Council of the European Union (Official Journal, EUR-Lex), 2024-07-15), locator **line 2**, language `en`.
Wayback: <https://web.archive.org/web/20240917211729id_/https://eur-lex.europa.eu/eli/dec/2024/1967>

Quote:

> the following entries are added to the list of natural and legal persons, entities and bodies under heading ‘A. Natural persons’:

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20240715_eur-lex_cfsp-2024-1967.txt`:

> the following entries are added to the list of natural and legal persons, entities and bodies under heading ‘A. Natural persons’:

#### evt_2024_12_31_PRT_D3

- [ ] Checked (178 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | D3, standing |
| Date | 2024-12-31 to 2025-12-31 |
| Speaker or actor | Government of Portugal / Gouvernement du Portugal |
| Tier (points) | +8: Increased tier (+8): UNRWA's table for 2024 gives USD 12,706,511 pledged and received for Portugal (rank 26), against USD 105,288 in the 2022 table. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | Portugal's contribution to UNRWA for 2024 exceeded its 2022 contribution in UNRWA's donor tables. |
| Summary (FR) | La contribution du Portugal à l'UNRWA pour 2024 a dépassé celle de 2022, selon les tableaux des donateurs de l'UNRWA. |
| Second reading | agree, 2026-11-04 |

Evidence 1: `src_20241231_unrwa_donor-ranking-2024` (dataset, UNRWA, 2024-12-31), locator **line 35**, language `en`.
Wayback: <https://web.archive.org/web/20260521084323id_/https://www.unrwa.org/sites/default/files/overall_donor_ranking_by_pledged_and_received_002.pdf>

Quote:

> Portugal 11,929,511 11,929,511 - - 11,929,511 11,929,511 - - - - - - 777,000 777,000 - - - - 777,000 777,000 12,706,511 26 12,706,511 26

Mechanical check: found at line 35, starting within the locator (line 35). Archived text at line 35 of `archive/text/src_20241231_unrwa_donor-ranking-2024.txt`:

> Portugal 11,929,511 11,929,511 - - 11,929,511 11,929,511 - - - - - - 777,000 777,000 - - - - 777,000 777,000 12,706,511 26 12,706,511 26

Evidence 2: `src_20221231_unrwa_donor-ranking-2022` (dataset, UNRWA, 2022-12-31), locator **line 71**, language `en`.
Wayback: <https://web.archive.org/web/20230921090159id_/https://www.unrwa.org/sites/default/files/overall_donor_ranking_2022.pdf>

Quote:

> Portugal 105,288 0 105,288 0 0 0 105,288 60

Mechanical check: found at line 71, starting within the locator (line 71). Archived text at line 71 of `archive/text/src_20221231_unrwa_donor-ranking-2022.txt`:

> Portugal 105,288 0 105,288 0 0 0 105,288 60

### Paraguay (PRY)

#### evt_2024_12_09_PRY_B6

- [ ] Checked (179 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B6, standing |
| Date | 2024-12-09 |
| Speaker or actor | Government of Paraguay / Gouvernement du Paraguay |
| Tier (points) | −10: B6 (-10): the President, head of state and of government, said in an interview with AFP that his Government rejects the arrest warrant of the International Criminal Court for Israel's Prime Minister and that, if the Prime Minister visited Paraguay, 'no existe ninguna posibilidad' that he would be detained (a stated refusal to execute the warrants of 21 November 2024; B5 and B6 replace each other in time and no later position was found). One press source, so `reported`. |
| Confidence | reported |
| Scope | gaza |
| Summary (EN) | The President said in an interview with AFP that Israel's Prime Minister, subject of an International Criminal Court arrest warrant, would not be detained on a visit to Paraguay. |
| Summary (FR) | Le président a déclaré dans un entretien à l'AFP que le Premier ministre israélien, visé par un mandat d'arrêt de la Cour pénale internationale, ne serait pas arrêté lors d'une visite au Paraguay. |
| Second reading | agree, 2026-11-09; the notes mention a flag |

Evidence 1: `src_20241210_ultimahora_pena-netanyahu-no-sera-detenido` (press, Última Hora, 2024-12-10), locator **line 3**, language `es`.
Wayback: <https://web.archive.org/web/20241212024318id_/https://www.ultimahora.com/pena-si-netanyahu-viene-a-paraguay-no-sera-detenido>

Quote:

> si el primer ministro israelí visitara Paraguay “no existe ninguna posibilidad” de que sea detenido.

Translation in the record:

> if Israel's Prime Minister visited Paraguay 'there is no possibility' of him being detained.

Mechanical check: found at line 3, starting within the locator (line 3). Archived text at line 3 of `archive/text/src_20241210_ultimahora_pena-netanyahu-no-sera-detenido.txt`:

> … y rechaza la orden de arresto, emitida por la Corte Penal Internacional, contra Benjamín Netanyahu, por crímenes de guerra y de lesa humanidad, por lo que si el primer ministro israelí visitara Paraguay “no existe ninguna posibilidad” de que sea detenido.

### Qatar (QAT)

#### evt_2025_07_28_QAT_B9

- [ ] Checked (180 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-07-28 |
| Speaker or actor | Prime Minister and Minister of Foreign Affairs / Premier ministre et ministre des Affaires étrangères |
| Tier (points) | +5: Specific violations named (+5): at the two-state solution conference the Prime Minister cited the use of starvation and the targeting of hospitals as methods of warfare and condemned blockade and forced displacement, amid the war on the Gaza Strip. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Prime Minister condemned the use of starvation and the targeting of hospitals as methods of warfare at the two-state solution conference. |
| Summary (FR) | Le Premier ministre a condamné, à la conférence sur la solution à deux États, l'usage de la famine et le ciblage des hôpitaux comme méthodes de guerre. |
| Second reading | agree, 2026-09-29 |

Evidence 1: `src_20250728_mofa-qa_pm-speech-two-state-conference` (official, Ministry of Foreign Affairs, State of Qatar, 2025-07-28), locator **line 12**, language `en`.
Wayback: <https://web.archive.org/web/20260516201340id_/https://mofa.gov.qa/en/latest-articles/prime-minister-speeches/speech-by-he-the-prime-minister-and-minister-of-foreign-affairs-at-the-high-level-international-conference-on-the-peaceful-settlement-of-the-palestinian-cause-and-the-implementation-of-the-two-state-solution>

Quote:

> The matter has reached the point where the normalization of using starvation and targeting hospitals as methods of warfare has become a precedent that can no longer be accepted, as if it has turned into a routine practice in every conflict.

Mechanical check: found at line 12, starting within the locator (line 12). Archived text at line 12 of `archive/text/src_20250728_mofa-qa_pm-speech-two-state-conference.txt`:

> The matter has reached the point where the normalization of using starvation and targeting hospitals as methods of warfare has become a precedent that can no longer be accepted, as if it has turned into a routine practice in every conflict. The State of Qatar reiterates its unequivocal rejection of the use of food as a tool of pressure or a weapon in conflicts, and strongly condemns the policies …

Evidence 2: `src_20250728_mofa-qa_pm-two-state-conference` (official, Ministry of Foreign Affairs, State of Qatar, 2025-07-28), locator **line 3**, language `en`.
Wayback: <https://web.archive.org/web/20250730050632id_/https://mofa.gov.qa/en/qatar/latest-articles/latest-news/details/2025/07/28/prime-minister-and-minister-of-foreign-affairs-participates-in-high-level-international-conference-for-peaceful-settlement-of-question-of-palestine-and-implementation-of-two-state-solution>

Quote:

> In Qatar's statement to the plenary session, His Excellency said that this conference is being held at a critical moment for the region amid a horrific war waged by Israel on the Gaza Strip for two years and a worsening humanitarian tragedy affecting more than two million people, most of whom are women and children.

Mechanical check: found at line 3, starting within the locator (line 3). Archived text at line 3 of `archive/text/src_20250728_mofa-qa_pm-two-state-conference.txt`:

> In Qatar's statement to the plenary session, His Excellency said that this conference is being held at a critical moment for the region amid a horrific war waged by Israel on the Gaza Strip for two years and a worsening humanitarian tragedy affecting more than two million people, most of whom are women and children.

#### evt_2026_11_14_QAT_B9

- [ ] Checked (181 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2026-11-14 |
| Speaker or actor | Prime Minister and Minister of Foreign Affairs / Premier ministre et ministre des Affaires étrangères |
| Tier (points) | +5: Names specific violations (+5): the eighteen foreign ministers condemn the Israeli airstrike on the Nasser Medical Complex in Khan Younis as a violation of international humanitarian law and call on Israel to uphold the ceasefire and ensure unimpeded humanitarian aid. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister of Foreign Affairs and seventeen counterparts condemned the Israeli strike on the Nasser Medical Complex in Khan Younis as a violation of international humanitarian law. |
| Summary (FR) | Le ministre des Affaires étrangères et dix-sept homologues ont condamné la frappe israélienne contre le complexe médical Nasser de Khan Younès comme une violation du droit international humanitaire. |
| Second reading | agree, 2026-11-28 |

Evidence 1: `src_20261114_mfa-tr_joint-statement-nasser-medical-complex` (official, Ministry of Foreign Affairs of the Republic of Türkiye, 2026-11-14), locator **line 2**, language `en`.
Wayback: <https://web.archive.org/web/20261128044350id_/https://www.mfa.gov.tr/condemn-in-the-strongest-terms-the-israeli-airstrike-on-the-nasser-medical-complex-in-khan-younis.en.mfa>

Quote:

> condemn in the strongest terms the Israeli airstrike on the Nasser Medical Complex in Khan Younis, which caused casualties among patients and medical personnel, in violation of international humanitarian law, which affords special protection to medical facilities and healthcare workers.

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20261114_mfa-tr_joint-statement-nasser-medical-complex.txt`:

> … State of Palestine, the State of Qatar, the Kingdom of Saudi Arabia, the Federal Republic of Somalia, the Republic of the Sudan and the United Arab Emirates condemn in the strongest terms the Israeli airstrike on the Nasser Medical Complex in Khan Younis, which caused casualties among patients and medical personnel, in violation of international humanitarian law, which affords special protection to medical facilities and healthcare workers.

Evidence 2: `src_20261114_mfa-tr_joint-statement-nasser-medical-complex` (official, Ministry of Foreign Affairs of the Republic of Türkiye, 2026-11-14), locator **line 5**, language `en`.
Wayback: <https://web.archive.org/web/20261128044350id_/https://www.mfa.gov.tr/condemn-in-the-strongest-terms-the-israeli-airstrike-on-the-nasser-medical-complex-in-khan-younis.en.mfa>

Quote:

> Israel must uphold the ceasefire, protect civilians and medical facilities, and ensure the safe, sustained and unimpeded delivery of humanitarian aid in sufficient quantities, including shelter and early recovery supplies and equipment to restore essential infrastructure.

Mechanical check: found at line 5, starting within the locator (line 5). Archived text at line 5 of `archive/text/src_20261114_mfa-tr_joint-statement-nasser-medical-complex.txt`:

> … in full its obligations under the Sharm El-Sheikh Agreement, President Trump’s Comprehensive Plan and United Nations Security Council Resolution 2803 (2025). Israel must uphold the ceasefire, protect civilians and medical facilities, and ensure the safe, sustained and unimpeded delivery of humanitarian aid in sufficient quantities, including shelter and early recovery supplies and equipment to restore essential infrastructure. It must also allow United Nations agencies and humanitarian organisations to carry out their mandates without obstruction.

Evidence 3: `src_20261114_mfa-tr_joint-statement-nasser-medical-complex` (official, Ministry of Foreign Affairs of the Republic of Türkiye, 2026-11-14), locator **line 2**, language `en`.
Wayback: <https://web.archive.org/web/20261128044350id_/https://www.mfa.gov.tr/condemn-in-the-strongest-terms-the-israeli-airstrike-on-the-nasser-medical-complex-in-khan-younis.en.mfa>

Quote:

> the State of Qatar, the Kingdom of Saudi Arabia

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20261114_mfa-tr_joint-statement-nasser-medical-complex.txt`:

> … Lebanese Republic, the State of Libya, the Islamic Republic of Mauritania, the Sultanate of Oman, the Islamic Republic of Pakistan, the State of Palestine, the State of Qatar, the Kingdom of Saudi Arabia, the Federal Republic of Somalia, the Republic of the Sudan and the United Arab Emirates condemn in the strongest terms the Israeli airstrike on the Nasser …

#### evt_2026_11_27_QAT_B9

- [ ] Checked (182 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2026-11-27 |
| Speaker or actor | Prime Minister and Minister of Foreign Affairs / Premier ministre et ministre des Affaires étrangères |
| Tier (points) | +2: Formal call (+2): the Prime Minister and Minister of Foreign Affairs and Canada's Minister of Foreign Affairs stress the importance of all parties fulfilling their obligations, including the ceasefire, the withdrawal of Israeli forces and the urgent, unhindered delivery of humanitarian assistance to Gaza; no violation in Gaza is named. The West Bank sentence (settlements illegal) is tagged, unscored in v1. A joint statement read as the Minister's statement, the reading of the same statement for Canada (docs/10 B-2186 (1); flagged). |
| Confidence | confirmed |
| Scope | gaza, west-bank |
| Summary (EN) | The Prime Minister and Minister of Foreign Affairs and Canada's Minister stressed that all parties must fulfil their obligations, including the ceasefire in Gaza. |
| Summary (FR) | Le Premier ministre et ministre des Affaires étrangères et la ministre canadienne ont souligné que toutes les parties devaient remplir leurs obligations, dont le cessez-le-feu à Gaza. |
| Second reading | agree, 2026-11-28 |

Evidence 1: `src_20261127_gac_qatar-canada-strategic-dialogue` (official, Global Affairs Canada, 2026-11-27), locator **line 19**, language `en`.
Wayback: <https://web.archive.org/web/20261128050955id_/https://www.canada.ca/en/global-affairs/news/2026/11/the-inaugural-strategic-dialogue-between-the-state-of-qatar-and-canada-advancing-a-strategic-partnership.html>

Quote:

> They stressed the importance of all parties to the conflict fulfilling their obligations under relevant agreements, including the implementation of the ceasefire, the withdrawal of Israeli forces and the demilitarization of Hamas and other armed groups in Gaza in accordance with the agreed arrangements, and the urgent, safe and unhindered delivery of humanitarian assistance to Gaza.

Mechanical check: found at line 19, starting within the locator (line 19). Archived text at line 19 of `archive/text/src_20261127_gac_qatar-canada-strategic-dialogue.txt`:

> They expressed their support for the implementation of United Nations Security Council Resolution 2803 and the Comprehensive Plan to End the Gaza Conflict. They stressed the importance of all parties to the conflict fulfilling their obligations under relevant agreements, including the implementation of the ceasefire, the withdrawal of Israeli forces and the demilitarization of Hamas and other armed groups in Gaza in accordance with the agreed arrangements, and the urgent, safe and unhindered delivery of humanitarian assistance to Gaza. They underscored their support for United Nations Relief and Works Agency and its indispensable role in delivering humanitarian assistance and essential …

Evidence 2: `src_20261127_gac_qatar-canada-strategic-dialogue` (official, Global Affairs Canada, 2026-11-27), locator **line 18**, language `en`.
Wayback: <https://web.archive.org/web/20261128050955id_/https://www.canada.ca/en/global-affairs/news/2026/11/the-inaugural-strategic-dialogue-between-the-state-of-qatar-and-canada-advancing-a-strategic-partnership.html>

Quote:

> underscored that Israeli settlements are illegal under international law and constitute an obstacle to peace

Mechanical check: found at line 18, starting within the locator (line 18). Archived text at line 18 of `archive/text/src_20261127_gac_qatar-canada-strategic-dialogue.txt`:

> … the two-state solution, in accordance with international law and relevant UN resolutions. They reiterated their opposition to any annexation of the West Bank, underscored that Israeli settlements are illegal under international law and constitute an obstacle to peace, and called for concrete measures to hold perpetrators of settler violence accountable. They reaffirmed their support for Palestinian-led reforms that …

Evidence 3: `src_20261127_gac_qatar-canada-strategic-dialogue` (official, Global Affairs Canada, 2026-11-27), locator **line 3**, language `en`.
Wayback: <https://web.archive.org/web/20261128050955id_/https://www.canada.ca/en/global-affairs/news/2026/11/the-inaugural-strategic-dialogue-between-the-state-of-qatar-and-canada-advancing-a-strategic-partnership.html>

Quote:

> The Prime Minister and Minister of Foreign Affairs of the State of Qatar, His Excellency Sheikh Mohammed bin Abdulrahman bin Jassim Al Thani, and the Minister of Foreign Affairs of Canada, the Honourable Anita Anand, co-chaired the inaugural Qatar–Canada Strategic Dialogue

Mechanical check: found at line 3, starting within the locator (line 3). Archived text at line 3 of `archive/text/src_20261127_gac_qatar-canada-strategic-dialogue.txt`:

> The Prime Minister and Minister of Foreign Affairs of the State of Qatar, His Excellency Sheikh Mohammed bin Abdulrahman bin Jassim Al Thani, and the Minister of Foreign Affairs of Canada, the Honourable Anita Anand, co-chaired the inaugural Qatar–Canada Strategic Dialogue in Ottawa, Canada, on November 24, 2026.

### Romania (ROU)

#### evt_2026_05_28_ROU_B11

- [ ] Checked (183 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B11, standing |
| Date | 2026-05-28 |
| Speaker or actor | — / — |
| Tier (points) | +5: Sanctions on settler entities (+5): the EU listing of 28 May 2026 (Implementing Regulation (EU) 2026/1177) of four settler organisations and three individuals, adopted by unanimity; it lists Nachala for abuses in the West Bank and the Gaza Strip. The settler tier already holds from 15 July 2024 (one per tier), so it adds no points. |
| Confidence | confirmed |
| Scope | gaza, west-bank |
| Summary (EN) | The government agreed in the EU Council to sanctions on three Israeli settler leaders and four settler organisations, one of them for efforts to resettle the Gaza Strip. |
| Summary (FR) | Le gouvernement a approuvé au Conseil de l'UE des sanctions contre trois dirigeants de colons israéliens et quatre organisations de colons, dont l'une pour son projet de colonisation de Gaza. |
| Second reading | agree, 2026-10-05 |

Evidence 1: `src_20260528_eur-lex_reg-impl-2026-1177` (official, Council of the European Union (Official Journal, EUR-Lex), 2026-05-28), locator **line 2**, language `en`.
Wayback: <https://web.archive.org/web/20260529134604id_/https://eur-lex.europa.eu/eli/reg_impl/2026/1177/oj/eng>

Quote:

> the following entries are added to the list of natural or legal persons, entities or bodies under the heading ‘B. Legal persons, entities and bodies’:

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20260528_eur-lex_reg-impl-2026-1177.txt`:

> the following entries are added to the list of natural or legal persons, entities or bodies under the heading ‘B. Legal persons, entities and bodies’:

Evidence 2: `src_20260528_eur-lex_reg-impl-2026-1177` (official, Council of the European Union (Official Journal, EUR-Lex), 2026-05-28), locator **line 27**, language `en`.
Wayback: <https://web.archive.org/web/20260529134604id_/https://eur-lex.europa.eu/eli/reg_impl/2026/1177/oj/eng>

Quote:

> After 7 October 2023, Nachala has furthermore been at the forefront of efforts to resettle the Gaza Strip. Therefore, Nachala is responsible for facilitating and encouraging human rights abuses in the West Bank and the Gaza Strip, including abuses of the right of Palestinians to self-determination, their right to property, their right to private and family life, as well as the right to life and to physical health, which are of serious concern as regards the objectives of the common foreign and security policy set out in Article 21 of the Treaty on European Union.

Mechanical check: found at line 27, starting within the locator (line 27). Archived text at line 27 of `archive/text/src_20260528_eur-lex_reg-impl-2026-1177.txt`:

> After 7 October 2023, Nachala has furthermore been at the forefront of efforts to resettle the Gaza Strip. Therefore, Nachala is responsible for facilitating and encouraging human rights abuses in the West Bank and the Gaza Strip, including abuses of the right of Palestinians to self-determination, their right to property, their right to private and family life, as well as the right to life and to physical health, which are of serious concern as regards the objectives of the common foreign and security policy set out in Article 21 of the Treaty on European Union.

### Russian Federation (RUS)

#### evt_2023_10_13_RUS_B9

- [ ] Checked (184 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2023-10-13 |
| Speaker or actor | President of the Russian Federation / Président de la Fédération de Russie |
| Tier (points) | +2: Call tier (+2): the President called for collective efforts to achieve a ceasefire and said civilian losses in Gaza would be unacceptable; the address names no specific violation. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The President of the Russian Federation called for collective efforts to achieve a ceasefire in Gaza and to stop the bloodshed. |
| Summary (FR) | Le président de la Fédération de Russie a appelé à des efforts collectifs pour parvenir à un cessez-le-feu à Gaza et arrêter l'effusion de sang. |
| Second reading | agree, 2026-09-29 |

Evidence 1: `src_20231013_kremlin_putin-cis-address` (official, President of Russia (Presidential Executive Office), 2023-10-13), locator **line 56**, language `en`.
Wayback: <https://web.archive.org/web/20260929051258id_/http://en.kremlin.ru/events/president/transcripts/72500>

Quote:

> The most important thing is that losses among civilians will be absolutely unacceptable; there are almost two million people living there. The most important thing is to stop the bloodshed. There is a great need for collective efforts to achieve a ceasefire and stabilise the situation on the ground.

Mechanical check: found at line 56, starting within the locator (line 56). Archived text at line 56 of `archive/text/src_20231013_kremlin_putin-cis-address.txt`:

> … than can have serious consequences for both sides. Yet, carrying out these operations in residential areas without such equipment is even more complicated. The most important thing is that losses among civilians will be absolutely unacceptable; there are almost two million people living there. The most important thing is to stop the bloodshed. There is a great need for collective efforts to achieve a ceasefire and stabilise the situation on the ground.

### Rwanda (RWA)

#### evt_2024_06_11_RWA_B9

- [ ] Checked (185 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2024-06-11 |
| Speaker or actor | President of the Republic of Rwanda / Président de la République du Rwanda |
| Tier (points) | +2: Call for a ceasefire (+2), flagged: at the International Conference on Urgent Humanitarian Response for Gaza (Jordan, 11 June 2024) the President says that 'we are here to offer our modest contribution to the tireless diplomatic and mediation initiatives of various countries and organizations, to achieve a ceasefire in Gaza' and that 'Facilities such as schools and hospitals, or places of refuge where people congregate, should neither be used by combatants, nor targeted by military operations'. 876 days old on 4 November 2026: expired (more than 730 days), filed for the record. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The President of Rwanda told a conference on the humanitarian response in Gaza that Rwanda supported efforts to achieve a ceasefire and that schools and hospitals should not be targeted. |
| Summary (FR) | Le président du Rwanda a déclaré à une conférence sur la réponse humanitaire à Gaza que le Rwanda soutenait les efforts de cessez-le-feu et que les écoles et les hôpitaux ne devaient pas être ciblés. |
| Second reading | agree, 2026-11-04; the notes mention a flag |

Evidence 1: `src_20240611_paulkagame_remarks-gaza-conference-jordan` (official, Office of the President of Rwanda (paulkagame.rw), 2024-06-11), locator **line 10**, language `en`.
Wayback: <https://web.archive.org/web/20261104114235id_/https://www.paulkagame.rw/international-conference-on-urgent-humanitarian-response-for-gaza-jordan-11-june-2024/>

Quote:

> we are here to offer our modest contribution to the tireless diplomatic and mediation initiatives of various countries and organizations, to achieve a ceasefire in Gaza.

Mechanical check: found at line 10, starting within the locator (line 10). Archived text at line 10 of `archive/text/src_20240611_paulkagame_remarks-gaza-conference-jordan.txt`:

> … fail to prompt immediate action to bring an end to the terrible suffering of countless innocent civilians, as we are seeing every day. It moves us deeply, and we are here to offer our modest contribution to the tireless diplomatic and mediation initiatives of various countries and organizations, to achieve a ceasefire in Gaza.

Evidence 2: `src_20240611_paulkagame_remarks-gaza-conference-jordan` (official, Office of the President of Rwanda (paulkagame.rw), 2024-06-11), locator **line 12**, language `en`.
Wayback: <https://web.archive.org/web/20261104114235id_/https://www.paulkagame.rw/international-conference-on-urgent-humanitarian-response-for-gaza-jordan-11-june-2024/>

Quote:

> Facilities such as schools and hospitals, or places of refuge where people congregate, should neither be used by combatants, nor targeted by military operations.

Mechanical check: found at line 12, starting within the locator (line 12). Archived text at line 12 of `archive/text/src_20240611_paulkagame_remarks-gaza-conference-jordan.txt`:

> Facilities such as schools and hospitals, or places of refuge where people congregate, should neither be used by combatants, nor targeted by military operations. The erosion of basic principles against the targeting of civilians under any circumstances is a cause for alarm, because we are not just talking about legal …

Evidence 3: `src_20240611_paulkagame_remarks-gaza-conference-jordan` (official, Office of the President of Rwanda (paulkagame.rw), 2024-06-11), locator **line 15**, language `en`.
Wayback: <https://web.archive.org/web/20261104114235id_/https://www.paulkagame.rw/international-conference-on-urgent-humanitarian-response-for-gaza-jordan-11-june-2024/>

Quote:

> Once again, I wish to thank the conveners of this conference for taking the lead to ensure that the humanitarian mission in Gaza can be fulfilled.

Mechanical check: found at line 15, starting within the locator (line 15). Archived text at line 15 of `archive/text/src_20240611_paulkagame_remarks-gaza-conference-jordan.txt`:

> Once again, I wish to thank the conveners of this conference for taking the lead to ensure that the humanitarian mission in Gaza can be fulfilled.

### Saudi Arabia (SAU)

#### evt_2023_10_24_SAU_B9

- [ ] Checked (186 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2023-10-24 |
| Speaker or actor | Minister of Foreign Affairs / Ministre des Affaires étrangères |
| Tier (points) | +5: Specific violations named (+5): at the Security Council the Foreign Minister called for an immediate stop to the collective punishment of the people of Gaza and to attempts at forced displacement, and named the blockade and the targeting of schools and hospitals in the Gaza Strip. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Foreign Minister called at the UN Security Council for an immediate stop to the collective punishment of the people of Gaza and to attempts at forced displacement. |
| Summary (FR) | Le ministre des Affaires étrangères a appelé, devant le Conseil de sécurité, à l'arrêt immédiat de la punition collective de la population de Gaza et des tentatives de déplacement forcé. |
| Second reading | agree, 2026-09-29 |

Evidence 1: `src_20231025_spa_fm-security-council-gaza` (official, Saudi Press Agency, 2023-10-25), locator **line 9**, language `en`.
Wayback: <https://web.archive.org/web/20260929105839id_/https://www.spa.gov.sa/en/N1985994>

Quote:

> He added: "What we have witnessed is the international community's negligence so far to work to immediately stop the collective punishment carried out by the Israeli war machine against the people of Gaza and attempts at forced displacement that will not bring us any closer to the security and stability that we all seek."

Mechanical check: found at line 9, starting within the locator (line 9). Archived text at line 9 of `archive/text/src_20231025_spa_fm-security-council-gaza.txt`:

> He added: "What we have witnessed is the international community's negligence so far to work to immediately stop the collective punishment carried out by the Israeli war machine against the people of Gaza and attempts at forced displacement that will not bring us any closer to the security and stability that we all seek."

Evidence 2: `src_20231024_un-press_sc15462` (official, United Nations, Meetings Coverage and Press Releases, 2023-10-24), locator **line 81**, language `en`.
Wayback: <https://web.archive.org/web/20231111163038id_/https://press.un.org/en/2023/sc15462.doc.htm>

Quote:

> Condemning the targeting of civilians, he called for an end of the escalation of military operations, adding that the blockade and hostilities are causing suffering for the Palestinians.

Mechanical check: found at line 81, starting within the locator (line 81). Archived text at line 81 of `archive/text/src_20231024_un-press_sc15462.txt`:

> FAISAL BIN FARHAN A.F. AL FURHAN AL-SAUD, Minister for Foreign Affairs of Saudi Arabia, said that today’s meeting is being held under painful circumstances. Condemning the targeting of civilians, he called for an end of the escalation of military operations, adding that the blockade and hostilities are causing suffering for the Palestinians. The international community’s failure to end this collective punishment by the Israeli occupation forces on Gaza “will not bring us any closer to security and …

### Sudan (SDN)

#### evt_2026_11_14_SDN_B9

- [ ] Checked (187 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2026-11-14 |
| Speaker or actor | Minister of Foreign Affairs and International Cooperation of the Sudan / Ministre des Affaires étrangères et de la Coopération internationale du Soudan |
| Tier (points) | +5: Names specific violations (+5): the eighteen foreign ministers condemn the Israeli airstrike on the Nasser Medical Complex in Khan Younis as a violation of international humanitarian law and call on Israel to uphold the ceasefire and ensure unimpeded humanitarian aid. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister of Foreign Affairs and seventeen counterparts condemned the Israeli strike on the Nasser Medical Complex in Khan Younis as a violation of international humanitarian law. |
| Summary (FR) | Le ministre des Affaires étrangères et dix-sept homologues ont condamné la frappe israélienne contre le complexe médical Nasser de Khan Younès comme une violation du droit international humanitaire. |
| Second reading | agree, 2026-11-28; the notes mention a flag |

Evidence 1: `src_20261114_mfa-tr_joint-statement-nasser-medical-complex` (official, Ministry of Foreign Affairs of the Republic of Türkiye, 2026-11-14), locator **line 2**, language `en`.
Wayback: <https://web.archive.org/web/20261128044350id_/https://www.mfa.gov.tr/condemn-in-the-strongest-terms-the-israeli-airstrike-on-the-nasser-medical-complex-in-khan-younis.en.mfa>

Quote:

> condemn in the strongest terms the Israeli airstrike on the Nasser Medical Complex in Khan Younis, which caused casualties among patients and medical personnel, in violation of international humanitarian law, which affords special protection to medical facilities and healthcare workers.

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20261114_mfa-tr_joint-statement-nasser-medical-complex.txt`:

> … State of Palestine, the State of Qatar, the Kingdom of Saudi Arabia, the Federal Republic of Somalia, the Republic of the Sudan and the United Arab Emirates condemn in the strongest terms the Israeli airstrike on the Nasser Medical Complex in Khan Younis, which caused casualties among patients and medical personnel, in violation of international humanitarian law, which affords special protection to medical facilities and healthcare workers.

Evidence 2: `src_20261114_mfa-tr_joint-statement-nasser-medical-complex` (official, Ministry of Foreign Affairs of the Republic of Türkiye, 2026-11-14), locator **line 5**, language `en`.
Wayback: <https://web.archive.org/web/20261128044350id_/https://www.mfa.gov.tr/condemn-in-the-strongest-terms-the-israeli-airstrike-on-the-nasser-medical-complex-in-khan-younis.en.mfa>

Quote:

> Israel must uphold the ceasefire, protect civilians and medical facilities, and ensure the safe, sustained and unimpeded delivery of humanitarian aid in sufficient quantities, including shelter and early recovery supplies and equipment to restore essential infrastructure.

Mechanical check: found at line 5, starting within the locator (line 5). Archived text at line 5 of `archive/text/src_20261114_mfa-tr_joint-statement-nasser-medical-complex.txt`:

> … in full its obligations under the Sharm El-Sheikh Agreement, President Trump’s Comprehensive Plan and United Nations Security Council Resolution 2803 (2025). Israel must uphold the ceasefire, protect civilians and medical facilities, and ensure the safe, sustained and unimpeded delivery of humanitarian aid in sufficient quantities, including shelter and early recovery supplies and equipment to restore essential infrastructure. It must also allow United Nations agencies and humanitarian organisations to carry out their mandates without obstruction.

Evidence 3: `src_20261114_mfa-tr_joint-statement-nasser-medical-complex` (official, Ministry of Foreign Affairs of the Republic of Türkiye, 2026-11-14), locator **line 2**, language `en`.
Wayback: <https://web.archive.org/web/20261128044350id_/https://www.mfa.gov.tr/condemn-in-the-strongest-terms-the-israeli-airstrike-on-the-nasser-medical-complex-in-khan-younis.en.mfa>

Quote:

> the Republic of the Sudan and the United Arab Emirates

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20261114_mfa-tr_joint-statement-nasser-medical-complex.txt`:

> … Sultanate of Oman, the Islamic Republic of Pakistan, the State of Palestine, the State of Qatar, the Kingdom of Saudi Arabia, the Federal Republic of Somalia, the Republic of the Sudan and the United Arab Emirates condemn in the strongest terms the Israeli airstrike on the Nasser Medical Complex in Khan Younis, which caused casualties among patients and medical …

### Senegal (SEN)

#### evt_2026_11_23_SEN_B9

- [ ] Checked (188 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2026-11-23 |
| Speaker or actor | President of the Republic of Senegal / Président de la République du Sénégal |
| Tier (points) | +5: Names violations (+5): in his message for the International Day of Solidarity the President says that Palestinian men, women and children of Gaza, the West Bank and Jerusalem are 'persécutés, déplacés, spoliés, affamés ou tués, en violation de toutes les normes internationales' (displacement and starvation are among the examples the B9 definition gives, with a legal characterisation). No call for a ceasefire. The passage attributes the acts to no party, the reading of evt_2025_09_24_SEN_B9; a reader who requires a violation attributed to a party would give it no tier (0) (flagged, docs/10 B-2214). |
| Confidence | confirmed |
| Scope | gaza, west-bank |
| Summary (EN) | The President of Senegal stated that Palestinians of Gaza, the West Bank and Jerusalem were displaced, starved or killed in violation of international norms, in a Solidarity Day message. |
| Summary (FR) | Le président du Sénégal a déclaré que les Palestiniens de Gaza, de Cisjordanie et de Jérusalem étaient déplacés, affamés ou tués en violation des normes internationales, dans un message de solidarité. |
| Second reading | agree, 2026-11-28; the notes mention a flag |

Evidence 1: `src_20261123_un-unispal_sen-president-solidarity-day-message` (official, United Nations, Division for Palestinian Rights (UNISPAL), the delegation's text, 2026-11-23), locator **lines 19 to 21**, language `fr`.
Wayback: <https://web.archive.org/web/20261128132315id_/https://www.un.org/unispal/wp-content/uploads/2026/11/20261119_1001_HoS_Senegal_President_FR_Message.pdf>

Quote:

> ces enfants palestiniens de Gaza, Cisjordanie et Jérusalem persécutés, déplacés, spoliés, affamés ou tués, en violation de toutes les normes internationales.

Translation in the record:

> these Palestinian children of Gaza, the West Bank and Jerusalem, persecuted, displaced, dispossessed, starved or killed, in violation of all international norms.

Mechanical check: found at lines 19–21, starting within the locator (lines 19 to 21). Archived text at lines 19–21 of `archive/text/src_20261123_un-unispal_sen-president-solidarity-day-message.txt`:

> ces enfants palestiniens de Gaza, Cisjordanie et Jérusalem persécutés, déplacés, spoliés, affamés ou tués, en violation de toutes les normes internationales.

Evidence 2: `src_20261123_un-unispal_sen-president-solidarity-day-message` (official, United Nations, Division for Palestinian Rights (UNISPAL), the delegation's text, 2026-11-23), locator **lines 9 to 10 (heading)**, language `fr`.
Wayback: <https://web.archive.org/web/20261128132315id_/https://www.un.org/unispal/wp-content/uploads/2026/11/20261119_1001_HoS_Senegal_President_FR_Message.pdf>

Quote:

> MONSIEUR BASSIROU DIOMAYE DIAKHAR FAYE, PRESIDENT DE LA REPUBLIQUE DU SENEGAL

Translation in the record:

> Mr Bassirou Diomaye Diakhar Faye, President of the Republic of Senegal

Mechanical check: found at lines 9–10, starting within the locator (lines 9 to 10 (heading)). Archived text at lines 9–10 of `archive/text/src_20261123_un-unispal_sen-president-solidarity-day-message.txt`:

> MONSIEUR BASSIROU DIOMAYE DIAKHAR FAYE, PRESIDENT DE LA REPUBLIQUE DU SENEGAL

### Singapore (SGP)

#### evt_2023_12_31_SGP_D3

- [ ] Checked (189 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | D3, standing |
| Date | 2023-12-31 to 2024-12-31 |
| Speaker or actor | Government of Singapore / Gouvernement de Singapour |
| Tier (points) | +8: Increased tier (+8): Singapore's 2023 contribution to UNRWA (USD 50,000) exceeds its 2022 contribution in nominal USD per UNRWA's donor tables (no row for Singapore in the 2022 table: a contribution of zero) (docs/02 §2 D3; docs/calibration/README.md R10). |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | Singapore contributed more to UNRWA in 2023 than in 2022, according to UNRWA's donor tables. |
| Summary (FR) | La contribution de Singapour à l'UNRWA pour 2023 a dépassé celle de 2022, selon les tableaux des donateurs de l'UNRWA. |
| Second reading | agree, 2026-11-04; the notes mention a flag |

Evidence 1: `src_20231231_unrwa_donor-ranking-2023` (dataset, UNRWA, 2023-12-31), locator **line 126**, language `en`.
Wayback: <https://web.archive.org/web/20240617020444id_/https://www.unrwa.org/sites/default/files/overall_donor_ranking_.pdf>

Quote:

> Singapore 0 0 0 0 0 0 0 50,000 0 0 50,000 107

Mechanical check: found at line 126, starting within the locator (line 126). Archived text at line 126 of `archive/text/src_20231231_unrwa_donor-ranking-2023.txt`:

> Singapore 0 0 0 0 0 0 0 50,000 0 0 50,000 107

### Solomon Islands (SLB)

#### evt_2024_09_27_SLB_B9

- [ ] Checked (190 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2024-09-27 |
| Speaker or actor | Minister for Foreign Affairs and External Trade of Solomon Islands / Ministre des Affaires étrangères et du Commerce extérieur des Îles Salomon |
| Tier (points) | +5: Names specific violations (+5): the Foreign Minister, in the General Debate, speaks of 'the suffering and collective punishment on the Gaza population by Israel', says it is 'unacceptable' and speaks of 'the disregard for international law and humanitarian law'. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Foreign Minister told the General Assembly that what he called Israel's collective punishment of the Gaza population had claimed more than 41,000 Palestinian lives. |
| Summary (FR) | Le ministre des Affaires étrangères a dit à l'Assemblée générale que ce qu'il a appelé la punition collective de la population de Gaza par Israël avait fait plus de 41 000 morts palestiniens. |
| Second reading | agree, 2026-10-07 |

Evidence 1: `src_20240927_un-gadebate_slb-agovaka-en` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2024-09-27), locator **lines 100 to 103**, language `en`.
Wayback: <https://web.archive.org/web/20241111131537id_/https://gadebate.un.org/sites/default/files/gastatements/79/sb_en.pdf>

Quote:

> The suffering and collective punishment on the Gaza population by Israel has claimed more than 41,000 Palestinian lives in less than a year. This is unacceptable.

Mechanical check: found at lines 100–103, starting within the locator (lines 100 to 103). Archived text at lines 100–103 of `archive/text/src_20240927_un-gadebate_slb-agovaka-en.txt`:

> carnage from all parties including the terror attack on Israel by Hamas. The suffering and collective punishment on the Gaza population by Israel has claimed more than 41,000 Palestinian lives in less than a year. This is unacceptable. The disregard for international law and humanitarian law have

Evidence 2: `src_20240927_un-gadebate_slb-agovaka-en` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2024-09-27), locator **lines 103 to 104**, language `en`.
Wayback: <https://web.archive.org/web/20241111131537id_/https://gadebate.un.org/sites/default/files/gastatements/79/sb_en.pdf>

Quote:

> The disregard for international law and humanitarian law have seen the matter referred to the International Court of Justice.

Mechanical check: found at lines 103–104, starting within the locator (lines 103 to 104). Archived text at lines 103–104 of `archive/text/src_20240927_un-gadebate_slb-agovaka-en.txt`:

> unacceptable. The disregard for international law and humanitarian law have seen the matter referred to the International Court of Justice. We hope those

### Sierra Leone (SLE)

#### evt_2025_09_24_SLE_B9

- [ ] Checked (191 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-09-24 |
| Speaker or actor | President of the Republic of Sierra Leone / Président de la République de la Sierra Leone |
| Tier (points) | +5: Legal characterisation (+5), flagged: at the General Debate of the 80th session the President says "A preventable genocide was not prevented. Mass starvation that could have been avoided was not avoided." in a passage on Gaza, and "Ceasefire now in Gaza!". |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The President of Sierra Leone told the General Assembly that a preventable genocide in Gaza had not been prevented, in his words, and called for a ceasefire in Gaza. |
| Summary (FR) | Le président de la Sierra Leone a déclaré à l'Assemblée générale qu'un génocide évitable à Gaza n'avait pas été empêché, selon ses termes, et a appelé à un cessez-le-feu à Gaza. |
| Second reading | agree, 2026-11-04; the notes mention a flag |

Evidence 1: `src_20250924_un-gadebate_sl-bio-ag80` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2025-09-24), locator **lines 135-137**, language `en`.
Wayback: <https://web.archive.org/web/20260201054228id_/https://gadebate.un.org/sites/default/files/gastatements/80/sl_en_0.pdf>

Quote:

> A preventable genocide was not prevented. Mass starvation that could have been avoided was not avoided.

Mechanical check: found at lines 135–137, starting within the locator (lines 135-137). Archived text at lines 135–137 of `archive/text/src_20250924_un-gadebate_sl-bio-ag80.txt`:

> 30. A preventable genocide was not prevented. Mass starvation that could have been avoided was not avoided.

Evidence 2: `src_20250924_un-gadebate_sl-bio-ag80` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2025-09-24), locator **line 155**, language `en`.
Wayback: <https://web.archive.org/web/20260201054228id_/https://gadebate.un.org/sites/default/files/gastatements/80/sl_en_0.pdf>

Quote:

> We say again: Ceasefire now in Gaza!

Mechanical check: found at line 155, starting within the locator (line 155). Archived text at line 155 of `archive/text/src_20250924_un-gadebate_sl-bio-ag80.txt`:

> 35. We say again: Ceasefire now in Gaza!

### San Marino (SMR)

#### evt_2024_09_28_SMR_B9

- [ ] Checked (192 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2024-09-28 |
| Speaker or actor | Secretary of State for Foreign Affairs / Secrétaire d'État aux Affaires étrangères |
| Tier (points) | +2: Formal call for a ceasefire (+2): the Minister 'reiterates' San Marino's call for an immediate ceasefire and a return to dialogue; the passage before it calls the civilian suffering and the death of UNRWA staff, aid workers and journalists unacceptable and intolerable but names no violation of law. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Secretary of State for Foreign Affairs told the General Assembly that San Marino reiterated its call for an immediate ceasefire in Gaza. |
| Summary (FR) | Le secrétaire d'État aux Affaires étrangères a déclaré à l'Assemblée générale que Saint-Marin réitérait son appel à un cessez-le-feu immédiat à Gaza. |
| Second reading | agree, 2026-11-04 |

Evidence 1: `src_20240928_un-gadebate_smr-beccari-en` (official, Permanent Mission of San Marino to the United Nations, through the UN General Debate (gadebate.un.org), 2024-09-28), locator **line 187**, language `en`.
Wayback: <https://web.archive.org/web/20250720015912id_/https://gadebate.un.org/sites/default/files/gastatements/79/sm_en.pdf>

Quote:

> San Marino reiterates its calls for an immediate ceasefire and for a return to dialogue to address the legitimate concerns of the State of Israel and the legitimate aspirations of the Palestinian people.

Mechanical check: found at lines 187–189, starting within the locator (line 187). Archived text at lines 187–189 of `archive/text/src_20240928_un-gadebate_smr-beccari-en.txt`:

> San Marino reiterates its calls for an immediate ceasefire and for a return to dialogue to address the legitimate concerns of the State of Israel and the legitimate aspirations of the Palestinian people.

### Somalia (SOM)

#### evt_2025_09_25_SOM_B9

- [ ] Checked (193 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-09-25 |
| Speaker or actor | President of the Federal Republic of Somalia / Président de la République fédérale de Somalie |
| Tier (points) | +2: Call for a ceasefire (+2), flagged: at the General Debate of the 80th session the President says "We call for an immediate and lasting ceasefire, unhindered humanitarian access, and renewed commitment towards the two-State solution" after "The ongoing violence, displacement, and deprivation faced in the occupied territories including Gaza". |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The President of Somalia told the General Assembly that Somalia called for an immediate and lasting ceasefire and unhindered humanitarian access in the occupied territories including Gaza. |
| Summary (FR) | Le président de la Somalie a déclaré à l'Assemblée que la Somalie appelait à un cessez-le-feu immédiat et durable et à un accès humanitaire sans entrave dans les territoires occupés dont Gaza. |
| Second reading | agree, 2026-11-04; the notes mention a flag |

Evidence 1: `src_20250925_un-gadebate_so-hassan-ag80` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2025-09-25), locator **lines 74-75**, language `en`.
Wayback: <https://web.archive.org/web/20251008042446id_/https://gadebate.un.org/sites/default/files/gastatements/80/so_en.pdf>

Quote:

> The ongoing violence, displacement, and deprivation faced in the occupied territories including Gaza demand our collective conscience and urgent action.

Mechanical check: found at lines 74–75, starting within the locator (lines 74-75). Archived text at lines 74–75 of `archive/text/src_20250925_un-gadebate_so-hassan-ag80.txt`:

> people. The ongoing violence, displacement, and deprivation faced in the occupied territories including Gaza demand our collective conscience and urgent action.

Evidence 2: `src_20250925_un-gadebate_so-hassan-ag80` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2025-09-25), locator **lines 76-78**, language `en`.
Wayback: <https://web.archive.org/web/20251008042446id_/https://gadebate.un.org/sites/default/files/gastatements/80/so_en.pdf>

Quote:

> We call for an immediate and lasting ceasefire, unhindered humanitarian access, and renewed commitment towards the two-State solution as the only viable path for a just and lasting peace in the Middle East.

Mechanical check: found at lines 76–78, starting within the locator (lines 76-78). Archived text at lines 76–78 of `archive/text/src_20250925_un-gadebate_so-hassan-ag80.txt`:

> We call for an immediate and lasting ceasefire, unhindered humanitarian access, and renewed commitment towards the two-State solution as the only viable path for a just and lasting peace in the Middle East.

Evidence 3: `src_20250925_un-gadebate_so-ag80-page` (official, United Nations General Assembly, General Debate (gadebate.un.org), 2025-09-25), locator **line 7**, language `en`.
Wayback: <https://web.archive.org/web/20251207222446id_/https://gadebate.un.org/en/80/somalia>

Quote:

> In his address to the General Assembly, the President of Somalia Hassan Sheikh Mohamud outlined global challenges

Mechanical check: found at line 7, starting within the locator (line 7). Archived text at line 7 of `archive/text/src_20250925_un-gadebate_so-ag80-page.txt`:

> In his address to the General Assembly, the President of Somalia Hassan Sheikh Mohamud outlined global challenges and shared the progress his country has made in the fight against terrorism, promoting inclusive governance and economic development.

### Serbia (SRB)

#### evt_2026_04_29_SRB_C2

- [ ] Checked (194 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | C2, standing |
| Date | 2026-04-29 |
| Speaker or actor | Government of Serbia (Ministry of Defence) / Gouvernement de la Serbie (ministère de la Défense) |
| Tier (points) | −10: C2 (-10, reported): the Governments of Serbia and Israel, through their defence ministries, signed a 'General Security Agreement on the exchange and mutual protection of classified information in the defence sector' (docs/calibration/README.md R18, one event per instrument; the day is the day of the report). |
| Confidence | reported |
| Scope | gaza |
| Summary (EN) | The Governments of Serbia and Israel signed an agreement on the exchange and protection of classified information in the defence sector, according to the press. |
| Summary (FR) | Les gouvernements de la Serbie et d'Israël ont signé un accord sur l'échange et la protection des informations classifiées dans le domaine de la défense, selon la presse. |
| Second reading | agree, 2026-11-04; the notes mention a flag |

Evidence 1: `src_20260429_021-rs_birn-sporazum-srbija-izrael-tajni-podaci` (press, 021.rs (Novosadski informativni portal), report by BIRN (Saša Dragojlo), 2026-04-29), locator **line 94**, language `sr`.
Wayback: <https://web.archive.org/web/20261104033102id_/https://www.021.rs/info/srbija/441999/detalji-sporazuma-srbije-i-izraela-o-tajnim-podacima-u-sektoru-odbrane>

Quote:

> Vlade Srbije i Izraela, odnosno njihova nadležna ministarstva odbrane, potpisali su "Opšti bezbednosni sporazum o razmeni i uzajamnoj zaštiti tajnih podataka u oblasti odbrane".

Translation in the record:

> The Governments of Serbia and Israel, that is their competent ministries of defence, signed the "General Security Agreement on the exchange and mutual protection of classified information in the field of defence".

Mechanical check: found at line 94, starting within the locator (line 94). Archived text at line 94 of `archive/text/src_20260429_021-rs_birn-sporazum-srbija-izrael-tajni-podaci.txt`:

> Vlade Srbije i Izraela, odnosno njihova nadležna ministarstva odbrane, potpisali su "Opšti bezbednosni sporazum o razmeni i uzajamnoj zaštiti tajnih podataka u oblasti odbrane".

### South Sudan (SSD)

#### evt_2025_08_13_SSD_C2

- [ ] Checked (195 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | C2, standing |
| Date | 2025-08-13 |
| Speaker or actor | — / — |
| Tier (points) | −10: C2 (-10): a memorandum of understanding on bilateral cooperation signed in Juba on 13 August 2025 by South Sudan's Foreign Minister and Israel's Deputy Foreign Minister, "a framework for diplomatic consultations and joint initiatives" (docs/calibration/README.md R18, one event per instrument). Confidence corroborated: two press publishers (Radio Tamazuj, Eye Radio), no archived primary document. A standing state counts until it ends (docs/02 §3) and lifts the passivity penalty for 365 days from its start, a period that ended on 13 August 2026 (448 days old on 4 November 2026). |
| Confidence | corroborated |
| Scope | gaza |
| Summary (EN) | The Governments of South Sudan and Israel signed in Juba a memorandum of understanding on bilateral cooperation. |
| Summary (FR) | Les gouvernements du Soudan du Sud et d'Israël ont signé à Juba un mémorandum d'entente sur la coopération bilatérale. |
| Second reading | agree, 2026-11-04; the notes mention a flag |

Evidence 1: `src_20250813_radiotamazuj_juba-israel-mou` (press, Radio Tamazuj, 2025-08-13), locator **line 1**, language `en`.
Wayback: <https://web.archive.org/web/20261104122518id_/https://www.radiotamazuj.org/en/news/article/juba-tel-aviv-sign-pact-amid-resettlement-claims-for-gazans>

Quote:

> South Sudan and Israel signed a memorandum of understanding (MoU) on bilateral cooperation on Wednesday

Mechanical check: found at line 1, starting within the locator (line 1). Archived text at line 1 of `archive/text/src_20250813_radiotamazuj_juba-israel-mou.txt`:

> South Sudan and Israel signed a memorandum of understanding (MoU) on bilateral cooperation on Wednesday, as the South Sudanese government dismissed reports of discussions to resettle Palestinians from Gaza in the African nation.

Evidence 2: `src_20250813_radiotamazuj_juba-israel-mou` (press, Radio Tamazuj, 2025-08-13), locator **line 2**, language `en`.
Wayback: <https://web.archive.org/web/20261104122518id_/https://www.radiotamazuj.org/en/news/article/juba-tel-aviv-sign-pact-amid-resettlement-claims-for-gazans>

Quote:

> The agreement, signed in Juba by South Sudan’s Foreign Minister Monday Semaya Kumba and Israeli Deputy Foreign Minister Sharren Haskel, establishes a framework for “diplomatic consultations” and “joint initiatives” between the two countries.

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20250813_radiotamazuj_juba-israel-mou.txt`:

> The agreement, signed in Juba by South Sudan’s Foreign Minister Monday Semaya Kumba and Israeli Deputy Foreign Minister Sharren Haskel, establishes a framework for “diplomatic consultations” and “joint initiatives” between the two countries.

Evidence 3: `src_20250813_eyeradio_haskel-resettlement-mou` (press, Eye Radio, 2025-08-13), locator **line 8**, language `en`.
Wayback: <https://web.archive.org/web/20261104122554id_/https://eyeradio.org/palestinian-resettlement-not-on-our-agenda-says-israeli-deputy-fm/>

Quote:

> She also highlighted the signing of an important Memorandum of Understanding (MOU) between Israel and South Sudan, which she said opens official channels for dialogue and cooperation in various fields, including health care, energy, agriculture, and security.

Mechanical check: found at line 8, starting within the locator (line 8). Archived text at line 8 of `archive/text/src_20250813_eyeradio_haskel-resettlement-mou.txt`:

> She also highlighted the signing of an important Memorandum of Understanding (MOU) between Israel and South Sudan, which she said opens official channels for dialogue and cooperation in various fields, including health care, energy, agriculture, and security.

Evidence 4: `src_20250905_radiotamazuj_juba-mou-ties-not-palestinians` (press, Radio Tamazuj, 2025-09-05), locator **line 22**, language `en`.
Wayback: <https://web.archive.org/web/20261104122625id_/https://www.radiotamazuj.org/en/news/article/juba-mou-with-israel-focuses-on-ties-not-palestinians>

Quote:

> the Memorandum of Understanding (MoU), signed in Juba on Aug. 13 during a visit by Israeli Deputy Foreign Minister Sharren Haskel

Mechanical check: found at line 22, starting within the locator (line 22). Archived text at line 22 of `archive/text/src_20250905_radiotamazuj_juba-mou-ties-not-palestinians.txt`:

> The clarification comes amid speculation on social media suggesting that the Memorandum of Understanding (MoU), signed in Juba on Aug. 13 during a visit by Israeli Deputy Foreign Minister Sharren Haskel, may have involved such plans.

### Suriname (SUR)

#### evt_2025_09_23_SUR_B9

- [ ] Checked (196 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-09-23 |
| Speaker or actor | President of Suriname / Présidente du Suriname |
| Tier (points) | +5: Names a specific violation (+5, R6): the President, in the General Debate, speaks of grave violations of human rights, and more specifically of the rights of children, for example in Gaza. No call for a ceasefire, no actor named. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The President of Suriname told the General Assembly of grave violations of human rights, and more specifically of the rights of children, for example in Gaza. |
| Summary (FR) | La présidente du Suriname a évoqué devant l'Assemblée générale de graves violations des droits de l'homme, en particulier des droits de l'enfant, par exemple à Gaza. |
| Second reading | agree, 2026-10-07; the notes mention a flag |

Evidence 1: `src_20250923_un-gadebate_sur-geerlings-simons-en` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2025-09-23), locator **lines 84 to 87**, language `en`.
Wayback: <https://web.archive.org/web/20251008130724id_/https://gadebate.un.org/sites/default/files/gastatements/80/sr_en.pdf>

Quote:

> At this moment there are increased occurrences of grave violations of human rights and more specifically the rights of children for example in Gaza.

Mechanical check: found at lines 84–87, starting within the locator (lines 84 to 87). Archived text at lines 84–87 of `archive/text/src_20250923_un-gadebate_sur-geerlings-simons-en.txt`:

> at the hands of terrorist organizations. At this moment there are increased occurrences of grave violations of human rights and more specifically the rights of children for example in Gaza.

Evidence 2: `src_20250923_gov-sr_simons-vn-geen-militaire-agressie` (official, Government of Suriname (gov.sr), Department of Public Information, 2025-09-23), locator **last sentence**, language `nl`.
Wayback: <https://web.archive.org/web/20261007013334id_/https://gov.sr/president-simons-op-vn-we-willen-geen-militaire-agressie-in-onze-regio/>

Quote:

> Ze verwees daarbij naar het terugkeren van oorlog in Europa, de terreur in het Midden-Oosten en de ernstige schendingen van kinderrechten, bijvoorbeeld in Gaza.

Translation in the record:

> She referred to the return of war in Europe, the terror in the Middle East and the serious violations of the rights of children, for example in Gaza.

Mechanical check: found at line 6; the locator is not a line number. Archived text at line 6 of `archive/text/src_20250923_gov-sr_simons-vn-geen-militaire-agressie.txt`:

> … de andere kant moeten we toegeven dat de VN er op andere momenten helaas niet in geslaagd is conflicten, oorlogen en mensenrechtenschendingen te voorkomen.” Ze verwees daarbij naar het terugkeren van oorlog in Europa, de terreur in het Midden-Oosten en de ernstige schendingen van kinderrechten, bijvoorbeeld in Gaza.

### Slovakia (SVK)

#### evt_2024_12_19_SVK_D4

- [ ] Checked (197 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | D4, repeatable |
| Date | 2024-12-19 |
| Speaker or actor | — / — |
| Tier (points) | +5 |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The government evacuated Gazan patients by air, among them 55 seriously ill children: eight flights by 17 February 2026. |
| Summary (FR) | Le gouvernement a évacué par avion des patients de Gaza, dont 55 enfants gravement malades : huit vols au 17 février 2026. |
| Second reading | agree, 2026-10-06 |

Evidence 1: `src_20241220_gov-ie_medevac-first-group` (official, Department of Health (Ireland), 2024-12-20), locator **line 6**, language `en`.
Wayback: <https://web.archive.org/web/20260520045424id_/https://www.gov.ie/en/department-of-health/press-releases/minister-for-health-confirms-successful-medical-evacuation-of-sick-children-from-gaza-for-healthcare-treatment-in-ireland/>

Quote:

> The group travelled on a plane provided by the Slovakian Government for the medical evacuation

Mechanical check: found at line 6, starting within the locator (line 6). Archived text at line 6 of `archive/text/src_20241220_gov-ie_medevac-first-group.txt`:

> The eight children arrived in Dublin late on Thursday evening accompanied by eight carers and 11 siblings. The group travelled on a plane provided by the Slovakian Government for the medical evacuation and were accompanied by three medical doctors from the Health Service Executive (HSE) and a translator. The group were welcomed to Ireland by Minister of …

Evidence 2: `src_20260217_mzv-sk_blanar-palestinian-minister-visit` (official, Ministry of Foreign and European Affairs of the Slovak Republic (mzv.sk), 2026-02-17), locator **line 7**, language `en`.
Wayback: <https://web.archive.org/web/20260411201722id_/https://www.mzv.sk/en/web/en/pressreleasedetail?p_p_id=sk_mzv_portal_pressrelease_detail_portlet_PressReleaseDetailPortlet&p_p_lifecycle=0&groupId=10182&articleId=57136319>

Quote:

> The Slovak Republic has thus far conducted eight such specialised flights and transported almost 200 civilians, including 55 seriously ill paediatric patients.

Mechanical check: found at line 7, starting within the locator (line 7). Archived text at line 7 of `archive/text/src_20260217_mzv-sk_blanar-palestinian-minister-visit.txt`:

> … outbreak of the conflict has surpassed 670 thousand euros in the form of financial or material aid as well as through medical evacuations from the Gaza Strip. The Slovak Republic has thus far conducted eight such specialised flights and transported almost 200 civilians, including 55 seriously ill paediatric patients. A major portion of the aid to the Palestinian population also consisted of a financial contribution of 100 thousand euros to the World Food Program.

### Slovenia (SVN)

#### evt_2025_07_17_SVN_B11

- [ ] Checked (198 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B11, standing |
| Date | 2025-07-17 to 2026-06-11 |
| Speaker or actor | Government of Slovenia / Gouvernement de la Slovénie |
| Tier (points) | +10: Ministers tier (+10): the Government decided measures to declare two serving Israeli ministers undesirable persons; on 25 September 2025 it adopted a measure against the Prime Minister. |
| Confidence | confirmed |
| Scope | gaza, west-bank |
| Summary (EN) | The Government decided to declare Israeli ministers Itamar Ben-Gvir and Bezalel Smotrich undesirable persons; it annulled the decision on 11 June 2026. |
| Summary (FR) | Le gouvernement a décidé de déclarer indésirables les ministres israéliens Itamar Ben-Gvir et Bezalel Smotrich ; il a annulé cette décision le 11 juin 2026. |
| Second reading | agree, 2026-09-29; the notes mention a flag |

Evidence 1: `src_20250717_gov-si_seja-162-ben-gvir-smotrich` (official, Vlada Republike Slovenije (Government of the Republic of Slovenia), GOV.SI, 2025-07-17), locator **line 2**, language `sl`.
Wayback: <https://web.archive.org/web/20260929000338id_/https://www.gov.si/novice/2025-07-17-162-redna-seja-vlade-republike-slovenije/>

Quote:

> Vlada Republike Slovenije je na današnji seji sprejela Izhodišča za sprejetje ukrepov proti Itamar Ben-Gvirju, izraelskemu ministru za nacionalno varnost, in Bezalel Smotrichu, izraelskemu ministru za finance in obrambo.

Translation in the record:

> At today's session the Government of the Republic of Slovenia adopted the Starting points for the adoption of measures against Itamar Ben-Gvir, Israel's Minister of National Security, and Bezalel Smotrich, Israel's Minister of Finance and Defence.

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20250717_gov-si_seja-162-ben-gvir-smotrich.txt`:

> Vlada Republike Slovenije je na današnji seji sprejela Izhodišča za sprejetje ukrepov proti Itamar Ben-Gvirju, izraelskemu ministru za nacionalno varnost, in Bezalel Smotrichu, izraelskemu ministru za finance in obrambo. Gre za ministra, ki s svojimi genocidnimi izjavami spodbujata skrajno nasilje in hude kršitve človekovih pravic Palestincev. Javno zagovarjata širitev …

Evidence 2: `src_20250717_gov-si_seja-162-ben-gvir-smotrich` (official, Vlada Republike Slovenije (Government of the Republic of Slovenia), GOV.SI, 2025-07-17), locator **line 2**, language `sl`.
Wayback: <https://web.archive.org/web/20260929000338id_/https://www.gov.si/novice/2025-07-17-162-redna-seja-vlade-republike-slovenije/>

Quote:

> S svojimi dejanji in stališči spodbujata etnično čiščenje Zahodnega brega in Gaze.

Translation in the record:

> Through their actions and positions they promote the ethnic cleansing of the West Bank and Gaza.

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20250717_gov-si_seja-162-ben-gvir-smotrich.txt`:

> … širitev nezakonitih izraelskih naselbin na Zahodnem bregu, prisilne izselitve Palestincev in pozivata k nasilju zoper civilno palestinsko prebivalstvo. S svojimi dejanji in stališči spodbujata etnično čiščenje Zahodnega brega in Gaze. Takšna dejanja so v nasprotju s Svetovalnim mnenjem o politikah in praksah Izraela na zasedenem palestinskem ozemlju, vključno z Vzhodnim Jeruzalemom …

Evidence 3: `src_20250717_gov-si_seja-162-ben-gvir-smotrich` (official, Vlada Republike Slovenije (Government of the Republic of Slovenia), GOV.SI, 2025-07-17), locator **line 2**, language `sl`.
Wayback: <https://web.archive.org/web/20260929000338id_/https://www.gov.si/novice/2025-07-17-162-redna-seja-vlade-republike-slovenije/>

Quote:

> Z ukrepom namerava Republika Slovenija ministra razglasiti za nezaželeni osebi.

Translation in the record:

> By the measure the Republic of Slovenia intends to declare the two ministers undesirable persons.

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20250717_gov-si_seja-162-ben-gvir-smotrich.txt`:

> … s Svetovalnim mnenjem o politikah in praksah Izraela na zasedenem palestinskem ozemlju, vključno z Vzhodnim Jeruzalemom Meddržavnega sodišča iz julija 2024. Z ukrepom namerava Republika Slovenija ministra razglasiti za nezaželeni osebi.

Evidence 4: `src_20250925_gov-si_session-170-netanyahu` (official, Vlada Republike Slovenije (Government of the Republic of Slovenia), GOV.SI, 2025-09-25), locator **line 5**, language `en`.
Wayback: <https://web.archive.org/web/20260929000706id_/https://www.gov.si/en/news/2025-09-25-170th-regular-session-of-the-government-of-the-republic-of-slovenia/>

Quote:

> The Government today unanimously adopted a measure against Benjamin Netanyahu, Prime Minister of the State of Israel, following measures already taken against two extremist Israeli ministers.

Mechanical check: found at line 5, starting within the locator (line 5). Archived text at line 5 of `archive/text/src_20250925_gov-si_session-170-netanyahu.txt`:

> The Government today unanimously adopted a measure against Benjamin Netanyahu, Prime Minister of the State of Israel, following measures already taken against two extremist Israeli ministers. Proceedings are under way against the Israeli Prime Minister for war crimes and crimes against humanity. On 19 July 2024, the International Court of Justice …

Evidence 5: `src_20260611_gov-si_seja-2-orozje-izrael` (official, Vlada Republike Slovenije (Government of the Republic of Slovenia), GOV.SI, 2026-06-11), locator **line 31**, language `sl`.
Wayback: <https://web.archive.org/web/20260929000202id_/https://www.gov.si/novice/2026-06-11-2-redna-seja-vlade-republike-slovenije/>

Quote:

> Vlada Republike Slovenije je razveljavila Sklepe Vlade Republike Slovenije št. 50000-3/2025/4 z dne 17. julija 2025, št. 56000-2/2025/3 z dne 25. septembra 2025 in št. 30000-5/2025/2 z dne 6. avgusta 2025.

Translation in the record:

> The Government of the Republic of Slovenia annulled Government Decisions No. 50000-3/2025/4 of 17 July 2025, No. 56000-2/2025/3 of 25 September 2025 and No. 30000-5/2025/2 of 6 August 2025.

Mechanical check: found at line 31, starting within the locator (line 31). Archived text at line 31 of `archive/text/src_20260611_gov-si_seja-2-orozje-izrael.txt`:

> Vlada Republike Slovenije je razveljavila Sklepe Vlade Republike Slovenije št. 50000-3/2025/4 z dne 17. julija 2025, št. 56000-2/2025/3 z dne 25. septembra 2025 in št. 30000-5/2025/2 z dne 6. avgusta 2025.

### Sweden (SWE)

#### evt_2024_04_19_SWE_B11

- [ ] Checked (199 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B11, standing |
| Date | 2024-04-19 |
| Speaker or actor | — / — |
| Tier (points) | +5: Sanctions on settler entities (+5): the EU listing of 19 April 2024 (Decision (CFSP) 2024/1175) of four settlers and two settler entities (Lehava, Hilltop Youth), adopted by unanimity. West Bank only: tagged, unscored in v1 (docs/10 B-32). |
| Confidence | confirmed |
| Scope | west-bank |
| Summary (EN) | The government agreed in the EU Council to sanctions on four Israeli settlers and two settler entities for human rights abuses against Palestinians in the West Bank. |
| Summary (FR) | Le gouvernement a approuvé au Conseil de l'UE des sanctions contre quatre colons israéliens et deux entités de colons pour des atteintes aux droits de Palestiniens en Cisjordanie. |
| Second reading | agree, 2026-09-30 |

Evidence 1: `src_20240419_consilium_settlers-sanctions` (official, Council of the European Union, 2024-04-19), locator **line 1**, language `en`.
Wayback: <https://web.archive.org/web/20240419135311id_/https://www.consilium.europa.eu/en/press/press-releases/2024/04/19/extremist-settlers-in-the-occupied-west-bank-and-east-jerusalem-council-sanctions-four-individuals-and-two-entities-over-serious-human-rights-abuses-against-palestinians/>

Quote:

> The Council decided today to list four persons and two entities under the EU Global Human Rights Sanctions Regime. The listed individuals and entities are responsible for serious human rights abuses against Palestinians, including torture and other cruel, inhuman or degrading treatment or punishment and for the violation of right to property and to private and family life of Palestinians in the West Bank.

Mechanical check: found at line 1, starting within the locator (line 1). Archived text at line 1 of `archive/text/src_20240419_consilium_settlers-sanctions.txt`:

> The Council decided today to list four persons and two entities under the EU Global Human Rights Sanctions Regime. The listed individuals and entities are responsible for serious human rights abuses against Palestinians, including torture and other cruel, inhuman or degrading treatment or punishment and for the violation of right to property and to private and family life of Palestinians in the West Bank.

Evidence 2: `src_20240419_consilium_settlers-sanctions` (official, Council of the European Union, 2024-04-19), locator **line 2**, language `en`.
Wayback: <https://web.archive.org/web/20240419135311id_/https://www.consilium.europa.eu/en/press/press-releases/2024/04/19/extremist-settlers-in-the-occupied-west-bank-and-east-jerusalem-council-sanctions-four-individuals-and-two-entities-over-serious-human-rights-abuses-against-palestinians/>

Quote:

> The listed entities are Lehava, a radical right-wing Jewish supremacist group, and Hilltop Youth, a radical youth group consisting of members known for violent acts against Palestinians and their villages in the West Bank. Two leading figures of Hilltop Youth, Meir Ettinger and Elisha Yered, are also listed. Both were involved in deadly attacks against Palestinians in 2015 and 2023.

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20240419_consilium_settlers-sanctions.txt`:

> The listed entities are Lehava, a radical right-wing Jewish supremacist group, and Hilltop Youth, a radical youth group consisting of members known for violent acts against Palestinians and their villages in the West Bank. Two leading figures of Hilltop Youth, Meir Ettinger and Elisha Yered, are also listed. Both were involved in deadly attacks against Palestinians in 2015 and 2023.

Evidence 3: `src_20240419_consilium_settlers-sanctions` (official, Council of the European Union, 2024-04-19), locator **line 11**, language `en`.
Wayback: <https://web.archive.org/web/20240419135311id_/https://www.consilium.europa.eu/en/press/press-releases/2024/04/19/extremist-settlers-in-the-occupied-west-bank-and-east-jerusalem-council-sanctions-four-individuals-and-two-entities-over-serious-human-rights-abuses-against-palestinians/>

Quote:

> Council Decision (CFSP) 2024/1175 of 19 April 2024 amending Decision (CFSP) 2020/1999 concerning restrictive measures against serious human rights violations and abuses

Mechanical check: found at line 11, starting within the locator (line 11). Archived text at line 11 of `archive/text/src_20240419_consilium_settlers-sanctions.txt`:

> Council Decision (CFSP) 2024/1175 of 19 April 2024 amending Decision (CFSP) 2020/1999 concerning restrictive measures against serious human rights violations and abuses

#### evt_2026_02_24_SWE_B9

- [ ] Checked (200 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2026-02-24 |
| Speaker or actor | Minister for Foreign Affairs / Ministre des Affaires étrangères |
| Tier (points) | +5: Uses a legal characterisation (+5): the settlements as a violation of international law. West Bank conduct, tagged and unscored in v1 (docs/10 B-32). |
| Confidence | confirmed |
| Scope | west-bank |
| Summary (EN) | The Minister for Foreign Affairs signed a joint statement that calls Israel's settlements a violation of international law. |
| Summary (FR) | La ministre des Affaires étrangères a signé une déclaration commune qui qualifie les colonies d'Israël de violation du droit international. |
| Second reading | agree, 2026-09-30 |

Evidence 1: `src_20260224_um_joint-statement-west-bank` (official, Udenrigsministeriet (Ministry of Foreign Affairs of Denmark), press room on via.ritzau.dk, 2026-02-24), locator **line 2**, language `en`.
Wayback: <https://web.archive.org/web/20260928221628id_/https://via.ritzau.dk/pressemeddelelse/14806013/joint-statement?publisherId=2012662&lang=da>

Quote:

> We are clear that Israel’s illegal settlements, and decisions designed to further them, are a flagrant violation of international law, including previous United Nations Security Council Resolutions and the 2024 Advisory Opinion of the International Court of Justice.

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20260224_um_joint-statement-west-bank.txt`:

> We are clear that Israel’s illegal settlements, and decisions designed to further them, are a flagrant violation of international law, including previous United Nations Security Council Resolutions and the 2024 Advisory Opinion of the International Court of Justice. These latest decisions are part of a clear trajectory that aims to change the reality on the ground and to advance unacceptable de facto annexation. They also …

Evidence 2: `src_20260224_um_joint-statement-west-bank` (official, Udenrigsministeriet (Ministry of Foreign Affairs of Denmark), press room on via.ritzau.dk, 2026-02-24), locator **line 1**, language `en`.
Wayback: <https://web.archive.org/web/20260928221628id_/https://via.ritzau.dk/pressemeddelelse/14806013/joint-statement?publisherId=2012662&lang=da>

Quote:

> We, the Foreign Ministers of the Federative Republic of Brazil, the French Republic, the Kingdom of Denmark, the Republic of Finland, the Republic of Iceland, the Republic of Indonesia, Ireland, the Arab Republic of Egypt, the Hashemite Kingdom of Jordan, the Grand Duchy of Luxembourg, the Kingdom of Norway, the State of Palestine, the Portuguese Republic, the State of Qatar, the Kingdom of Saudi Arabia, the Republic of Slovenia, the Kingdom of Spain, the Kingdom of Sweden

Mechanical check: found at line 1, starting within the locator (line 1). Archived text at line 1 of `archive/text/src_20260224_um_joint-statement-west-bank.txt`:

> We, the Foreign Ministers of the Federative Republic of Brazil, the French Republic, the Kingdom of Denmark, the Republic of Finland, the Republic of Iceland, the Republic of Indonesia, Ireland, the Arab Republic of Egypt, the Hashemite Kingdom of Jordan, the Grand Duchy of Luxembourg, the Kingdom of Norway, the State of Palestine, the Portuguese Republic, the State of Qatar, the Kingdom of Saudi Arabia, the Republic of Slovenia, the Kingdom of Spain, the Kingdom of Sweden, the Republic of Türkiye, and the Secretary Generals of the League of Arab States and the Organization of Islamic Cooperation, condemn in the strongest terms …

#### evt_2025_05_19_SWE_B9

- [ ] Checked (201 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-05-19 |
| Speaker or actor | Minister for Foreign Affairs / Ministre des Affaires étrangères |
| Tier (points) | +2: Formal call for a ceasefire (+2): the Minister called for a ceasefire and an end to the fighting; her remark that annexation would breach international law is conditional, so the +5 tier is not applied. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister for Foreign Affairs condemned the Israeli Prime Minister's statement on taking control of all of Gaza and called for a ceasefire and an end to the fighting. |
| Summary (FR) | La ministre des Affaires étrangères a condamné la déclaration du Premier ministre israélien sur la prise de contrôle de toute la bande de Gaza et a appelé à un cessez-le-feu et à la fin des combats. |
| Second reading | agree, 2026-09-28 |

Evidence 1: `src_20250519_regeringen_uttalande-situationen-gaza` (official, Regeringskansliet (Ministry for Foreign Affairs), 2025-05-19), locator **line 331**, language `sv`.
Wayback: <https://web.archive.org/web/20260928212151id_/https://www.regeringen.se/uttalanden/2025/05/uttalande-av-utrikesminister-maria-malmer-stenergard-med-anledning-av-situationen-i-gaza1/>

Quote:

> Vi fördömer det senaste uttalandet av Netanyahu om att Israel ska ta kontroll över hela Gaza.

Translation in the record:

> We condemn Netanyahu's latest statement that Israel will take control of all of Gaza.

Mechanical check: found at line 331, starting within the locator (line 331). Archived text at line 331 of `archive/text/src_20250519_regeringen_uttalande-situationen-gaza.txt`:

> Vi fördömer det senaste uttalandet av Netanyahu om att Israel ska ta kontroll över hela Gaza. Om detta innebär annektering strider det mot folkrätten. Sverige står fast vid att Gazas territorium inte får ändras eller reduceras. Vi har upprepade gånger …

Evidence 2: `src_20250519_regeringen_uttalande-situationen-gaza` (official, Regeringskansliet (Ministry for Foreign Affairs), 2025-05-19), locator **line 331**, language `sv`.
Wayback: <https://web.archive.org/web/20260928212151id_/https://www.regeringen.se/uttalanden/2025/05/uttalande-av-utrikesminister-maria-malmer-stenergard-med-anledning-av-situationen-i-gaza1/>

Quote:

> Det behövs en vapenvila och slut på stridigheterna, och gisslan måste släppas.

Translation in the record:

> A ceasefire and an end to the fighting are needed, and the hostages must be released.

Mechanical check: found at line 331, starting within the locator (line 331). Archived text at line 331 of `archive/text/src_20250519_regeringen_uttalande-situationen-gaza.txt`:

> … göras. Vi ser över vilka ytterligare åtgärder Sverige och EU kan vidta för att förbättra den fruktansvärda situationen för den civila befolkningen i Gaza. Det behövs en vapenvila och slut på stridigheterna, och gisslan måste släppas. Inte fler uttalanden eller planer från den israeliska regeringen som förvärrar för de civila i Gaza.

### Seychelles (SYC)

#### evt_2023_11_10_SYC_B9

- [ ] Checked (202 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2023-11-10 |
| Speaker or actor | President of the Republic of Seychelles / Président de la République des Seychelles |
| Tier (points) | +2: Call for the end of hostilities (+2), flagged: at the First Saudi-African Summit (Riyadh, 10 November 2023) the President, in a passage the Presidency introduces as being on "the ongoing crisis in Gaza and Israel", says "We call for an end to those indiscriminate attacks, an immediate cessation of hostilities, and a return to the negotiating table." No violation is attributed to a party (attacks on civilians "in Palestine as in Israel" are condemned alike), so the +5 tier is not read. 1,090 days old on 4 November 2026: expired (more than 730 days), filed for the record. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The President of Seychelles called at the Saudi-African Summit for an immediate cessation of hostilities, in a passage on the crisis in Gaza and Israel. |
| Summary (FR) | Le président des Seychelles a appelé, devant le sommet Arabie saoudite-Afrique, à une cessation immédiate des hostilités, dans un passage sur la crise à Gaza et en Israël. |
| Second reading | agree, 2026-11-04; the notes mention a flag |

Evidence 1: `src_20231110_statehouse-sc_saudi-african-summit` (official, State House Seychelles, Office of the President (statehouse.gov.sc), 2023-11-10), locator **line 10**, language `en`.
Wayback: <https://web.archive.org/web/20261104130444id_/https://www.statehouse.gov.sc/news/5995/president-ramkalawan-addresses-the-first-saudi-african-summit>

Quote:

> spoke about the ongoing crisis in Gaza and Israel as a grave tragedy and a matter of utmost concern for all

Mechanical check: found at line 10, starting within the locator (line 10). Archived text at line 10 of `archive/text/src_20231110_statehouse-sc_saudi-african-summit.txt`:

> President Ramkalwam also spoke about the ongoing crisis in Gaza and Israel as a grave tragedy and a matter of utmost concern for all.

Evidence 2: `src_20231110_statehouse-sc_saudi-african-summit` (official, State House Seychelles, Office of the President (statehouse.gov.sc), 2023-11-10), locator **line 11**, language `en`.
Wayback: <https://web.archive.org/web/20261104130444id_/https://www.statehouse.gov.sc/news/5995/president-ramkalawan-addresses-the-first-saudi-african-summit>

Quote:

> We call for an end to those indiscriminate attacks, an immediate cessation of hostilities, and a return to the negotiating table.

Mechanical check: found at line 11, starting within the locator (line 11). Archived text at line 11 of `archive/text/src_20231110_statehouse-sc_saudi-african-summit.txt`:

> "Seychelles firmly condemns all attacks on civilians in Palestine as in Israel. We call for an end to those indiscriminate attacks, an immediate cessation of hostilities, and a return to the negotiating table. We also reaffirm our support for a two-state solution, which is the only way forward to lasting peace in the region."

### Syrian Arab Republic (SYR)

#### evt_2026_10_16_SYR_B9

- [ ] Checked (203 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2026-10-16 |
| Speaker or actor | Minister of Foreign Affairs and Expatriates of the Syrian Arab Republic / Ministre des Affaires étrangères et des Expatriés de la République arabe syrienne |
| Tier (points) | +5: Uses a legal characterisation (+5): the joint statement of twenty foreign ministers says that Colombia's inauguration of its embassy in Jerusalem contravenes Security Council resolutions and that any measure altering the status of occupied Jerusalem is null and void. Jerusalem and the West Bank only, no mention of Gaza: tagged and unscored in v1 (docs/10 B-32). |
| Confidence | confirmed |
| Scope | west-bank |
| Summary (EN) | The Minister of Foreign Affairs, with nineteen other foreign ministers, rejected Colombia's inauguration of its embassy in Jerusalem as contravening Security Council resolutions. |
| Summary (FR) | Le ministre des Affaires étrangères, avec dix-neuf autres ministres, a rejeté l'inauguration par la Colombie de son ambassade à Jérusalem comme contraire aux résolutions du Conseil de sécurité. |
| Second reading | agree, 2026-11-09; the notes mention a flag |

Evidence 1: `src_20261016_mofa-pk_fms-joint-statement-colombia-embassy` (official, Ministry of Foreign Affairs of Pakistan (mofa.gov.pk), 2026-10-16), locator **line 104**, language `en`.
Wayback: <https://web.archive.org/web/20261104212055id_/https://mofa.gov.pk/press-releases/joint-statement-by-the-foreign-ministers-of-the-islamic-republic-of-pakistanalgeria-djibouti-egyptindonesia-jordankuwait-lebanonlibya-malaysia-oman-palestine-qatar-saudi-arabia-somalia-syria-sudan-and-turkiye>

Quote:

> the Syrian Arab Republic

Mechanical check: found at line 104, starting within the locator (line 104). Archived text at line 104 of `archive/text/src_20261016_mofa-pk_fms-joint-statement-colombia-embassy.txt`:

> … Malaysia, the Republic of Indonesia, the Kingdom of Saudi Arabia, the State of Kuwait, the People’s Democratic Republic of Algeria, the Sultanate of Oman, the Syrian Arab Republic, and Republic of the Sudan, strongly condemn and express their unequivocal rejection of the inauguration by the Republic of Colombia of its embassy in …

Evidence 2: `src_20261016_dirco_joint-statement-colombia-embassy` (official, Department of International Relations and Cooperation, 2026-10-16), locator **line 1**, language `en`.
Wayback: <https://web.archive.org/web/20261104205033id_/https://dirco.gov.za/south-africa-joins-other-countries-in-rejecting-colombias-inauguration-of-its-embassy-in-jerusalem/>

Quote:

> the Syrian Arab Republic

Mechanical check: found at line 1, starting within the locator (line 1). Archived text at line 1 of `archive/text/src_20261016_dirco_joint-statement-colombia-embassy.txt`:

> … Malaysia, the Republic of Indonesia, the Kingdom of Saudi Arabia, the State of Kuwait, the Democratic People’s Republic of Algeria, the Sultanate of Oman, the Syrian Arab Republic, the Republic of Sudan, the Islamic Republic of Pakistan and the Republic of South Africa strongly condemn and express their unequivocal rejection of the …

Evidence 3: `src_20261016_dirco_joint-statement-colombia-embassy` (official, Department of International Relations and Cooperation, 2026-10-16), locator **line 1**, language `en`.
Wayback: <https://web.archive.org/web/20261104205033id_/https://dirco.gov.za/south-africa-joins-other-countries-in-rejecting-colombias-inauguration-of-its-embassy-in-jerusalem/>

Quote:

> strongly condemn and express their unequivocal rejection of the inauguration by the Republic of Colombia of its embassy in Jerusalem, a step that contravenes relevant United Nations Security Council resolutions

Mechanical check: found at line 1, starting within the locator (line 1). Archived text at line 1 of `archive/text/src_20261016_dirco_joint-statement-colombia-embassy.txt`:

> … Republic of Algeria, the Sultanate of Oman, the Syrian Arab Republic, the Republic of Sudan, the Islamic Republic of Pakistan and the Republic of South Africa strongly condemn and express their unequivocal rejection of the inauguration by the Republic of Colombia of its embassy in Jerusalem, a step that contravenes relevant United Nations Security Council resolutions and undermines international efforts to achieve a just and lasting peace based on the two-State solution.

Evidence 4: `src_20261016_dirco_joint-statement-colombia-embassy` (official, Department of International Relations and Cooperation, 2026-10-16), locator **line 2**, language `en`.
Wayback: <https://web.archive.org/web/20261104205033id_/https://dirco.gov.za/south-africa-joins-other-countries-in-rejecting-colombias-inauguration-of-its-embassy-in-jerusalem/>

Quote:

> is null and void and has no legal effect

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20261016_dirco_joint-statement-colombia-embassy.txt`:

> … reaffirm that any measure or decision intended to alter the legal or historical status of occupied Jerusalem, or to recognise it as Israel’s capital, is null and void and has no legal effect. This position is consistent with relevant United Nations Security Council and General Assembly resolutions, particularly Security Council Resolutions 476 …

Evidence 5: `src_20260821_mofa-pk_syrian-fm-visit` (official, Ministry of Foreign Affairs of Pakistan (mofa.gov.pk), 2026-08-21), locator **line 104**, language `en`.
Wayback: <https://web.archive.org/web/20261109002252id_/https://mofa.gov.pk/press-releases/syrian-foreign-minister-concludes-official-visit-to-pakistan>

Quote:

> Asaad Hassan Al-Shaibani

Mechanical check: found at line 104, starting within the locator (line 104). Archived text at line 104 of `archive/text/src_20260821_mofa-pk_syrian-fm-visit.txt`:

> The Minister for Foreign Affairs and Expatriates of the Syrian Arab Republic, H.E. Mr. Asaad Hassan Al-Shaibani, visited Pakistan from 19–20 August 2026, at the invitation of Senator Mohammad Ishaq Dar, Deputy Prime Minister/Minister for Foreign Affairs of Pakistan. …

### Chad (TCD)

#### evt_2023_11_04_TCD_B12

- [ ] Checked (204 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B12, standing |
| Date | 2023-11-04 |
| Speaker or actor | Ministry of Foreign Affairs of Chad / Ministère des Affaires étrangères du Tchad |
| Tier (points) | +5: Recall tier (+5): on 4 November 2023 the Ministry of Foreign Affairs announced that, facing "cette tragédie" in the Gaza Strip, Chad condemns the loss of civilian lives, calls for a ceasefire and "décide de rappeler son Chargé d'Affaires en Israël pour consultations" (the Presidency's summary of 6 November 2023 prints the Ministry's sentence in quotation marks). Relations were not downgraded or severed: Tchadinfos (press) reports that the Foreign Minister stressed on 10 November 2023 that the recall did not mean a rupture of diplomatic relations. No return of the Chargé d'Affaires was found, so the state is open. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Ministry of Foreign Affairs recalled Chad's Chargé d'Affaires in Israel for consultations, citing the loss of civilian lives in the Gaza Strip. |
| Summary (FR) | Le ministère des Affaires étrangères a rappelé le chargé d'affaires du Tchad en Israël pour consultations, en invoquant la perte de vies civiles dans la bande de Gaza. |
| Second reading | agree, 2026-11-04; the notes mention a flag |

Evidence 1: `src_20231106_presidence-td_synthese-rappel-charge-affaires` (official, Présidence de la République du Tchad (presidence.td), 2023-11-06), locator **line 1**, language `fr`.
Wayback: <https://web.archive.org/web/20240810143116id_/https://presidence.td/synthese-du-lundi-06-novembre-2023/19949/>

Quote:

> L’annonce, faite samedi 4 novembre 2023 par le Ministère des Affaires Etrangères

Translation in the record:

> The announcement, made on Saturday 4 November 2023 by the Ministry of Foreign Affairs

Mechanical check: found at line 1, starting within the locator (line 1). Archived text at line 1 of `archive/text/src_20231106_presidence-td_synthese-rappel-charge-affaires.txt`:

> … : La guerre dans la Bande de Gaza provoque l’indignation du Gouvernement tchadien qui a décidé de rappeler son Chargé d’Affaires en Israël pour consultations. L’annonce, faite samedi 4 novembre 2023 par le Ministère des Affaires Etrangères, fait état d’une plus grande attention et inquiétude du Tchad face à la situation au Moyen Orient, notamment les vagues de violences meurtrières sans …

Evidence 2: `src_20231106_presidence-td_synthese-rappel-charge-affaires` (official, Présidence de la République du Tchad (presidence.td), 2023-11-06), locator **line 1**, language `fr`.
Wayback: <https://web.archive.org/web/20240810143116id_/https://presidence.td/synthese-du-lundi-06-novembre-2023/19949/>

Quote:

> décidé de rappeler son Chargé d’Affaires en Israël pour consultations

Translation in the record:

> decided to recall its Chargé d'Affaires in Israel for consultations

Mechanical check: found at line 1, starting within the locator (line 1). Archived text at line 1 of `archive/text/src_20231106_presidence-td_synthese-rappel-charge-affaires.txt`:

> DIPLOMATIE : La guerre dans la Bande de Gaza provoque l’indignation du Gouvernement tchadien qui a décidé de rappeler son Chargé d’Affaires en Israël pour consultations. L’annonce, faite samedi 4 novembre 2023 par le Ministère des Affaires Etrangères, fait état d’une plus grande attention et inquiétude du Tchad face à la …

Evidence 3: `src_20231106_presidence-td_synthese-rappel-charge-affaires` (official, Présidence de la République du Tchad (presidence.td), 2023-11-06), locator **line 1**, language `fr`.
Wayback: <https://web.archive.org/web/20240810143116id_/https://presidence.td/synthese-du-lundi-06-novembre-2023/19949/>

Quote:

> Face à cette tragédie, le Tchad condamne la perte des vies humaines de nombreux civils innocents et appelle à un cessez-le-feu conduisant à une solution durable de la question palestinienne

Translation in the record:

> In the face of this tragedy, Chad condemns the loss of the lives of many innocent civilians and calls for a ceasefire leading to a lasting solution of the Palestinian question

Mechanical check: found at line 1, starting within the locator (line 1). Archived text at line 1 of `archive/text/src_20231106_presidence-td_synthese-rappel-charge-affaires.txt`:

> … attention et inquiétude du Tchad face à la situation au Moyen Orient, notamment les vagues de violences meurtrières sans précédent dans la bande de Gaza. « Face à cette tragédie, le Tchad condamne la perte des vies humaines de nombreux civils innocents et appelle à un cessez-le-feu conduisant à une solution durable de la question palestinienne», indique le communiqué.

### Togo (TGO)

#### evt_2026_07_06_TGO_C2

- [ ] Checked (205 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | C2, standing |
| Date | 2026-07-06 |
| Speaker or actor | Ministry of Foreign Affairs of Togo / Ministère des Affaires étrangères du Togo |
| Tier (points) | −10: C2 (-10): on 6 July 2026 Togo and Israel signed in Lomé a Memorandum of Understanding on political consultations, initialled by the Secretary General of Togo's Ministry of Foreign Affairs and by Israel's Ambassador; the Ministry's release says it institutionalises periodic consultations, better coordination of diplomatic positions 'lorsque cela est opportun' and new joint initiatives (docs/calibration/README.md R18: a memorandum setting up a cooperation mechanism, one event per instrument; the same reading as the South Sudanese, Kazakh and Argentine memoranda). A standing state counts until it ends (docs/02 §3) and lifts the passivity penalty for 365 days from its start (127 days old on 10 November 2026). |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Secretary General of Togo's Ministry of Foreign Affairs and Israel's Ambassador signed in Lomé a memorandum of understanding on political consultations. |
| Summary (FR) | Le secrétaire général du ministère togolais des Affaires étrangères et l'ambassadeur d'Israël ont signé à Lomé un mémorandum d'entente sur les consultations politiques. |
| Second reading | agree, 2026-11-10; the notes mention a flag |

Evidence 1: `src_20260706_diplomatie-gouv-tg_togo-israel-mou-consultations` (official, Ministry of Foreign Affairs of Togo (diplomatie.gouv.tg; the site's WordPress API at bk.diplomatie.gouv.tg), 2026-07-06), locator **line 2**, language `fr`.
Wayback: <https://web.archive.org/web/20261110065844id_/https://bk.diplomatie.gouv.tg/wp-json/wp/v2/posts/22273>

Quote:

> Les deux pays ont procédé ce jour, à Lomé, à la signature solennelle d’un Mémorandum d’Entente sur les consultations politiques.

Translation in the record:

> The two countries signed today, in Lomé, a Memorandum of Understanding on political consultations in a formal ceremony.

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20260706_diplomatie-gouv-tg_togo-israel-mou-consultations.txt`:

> Une nouvelle page s’ouvre dans les relations diplomatiques entre la République Togolaise et l’État d’Israël. Les deux pays ont procédé ce jour, à Lomé, à la signature solennelle d’un Mémorandum d’Entente sur les consultations politiques. Cet instrument juridique de haute portée a été paraphé par monsieur Afo O. Salifou, Secrétaire général du ministère des affaires étrangères, de la …

Evidence 2: `src_20260706_diplomatie-gouv-tg_togo-israel-mou-consultations` (official, Ministry of Foreign Affairs of Togo (diplomatie.gouv.tg; the site's WordPress API at bk.diplomatie.gouv.tg), 2026-07-06), locator **line 8**, language `fr`.
Wayback: <https://web.archive.org/web/20261110065844id_/https://bk.diplomatie.gouv.tg/wp-json/wp/v2/posts/22273>

Quote:

> Mieux coordonner les positions diplomatiques respectives lorsque cela est opportun

Translation in the record:

> Better coordinate their respective diplomatic positions when appropriate

Mechanical check: found at line 8, starting within the locator (line 8). Archived text at line 8 of `archive/text/src_20260706_diplomatie-gouv-tg_togo-israel-mou-consultations.txt`:

> Mieux coordonner les positions diplomatiques respectives lorsque cela est opportun ;

Evidence 3: `src_20260708_republicoftogo_togo-israel-mou-political-consultations` (official, République Togolaise (republicoftogo.com, the Togolese Government's web magazine), 2026-07-08), locator **line 40**, language `fr`.
Wayback: <https://web.archive.org/web/20261110064915id_/https://www.republicoftogo.com/toutes-les-rubriques/diplomatie/nouveau-cadre-de-cooperation-entre-lome-et-jerusalem>

Quote:

> Le Togo et Israël ont signé il y a quelques jours à Lomé un mémorandum d'entente sur les consultations politiques.

Translation in the record:

> Togo and Israel signed a few days ago in Lomé a memorandum of understanding on political consultations.

Mechanical check: found at line 40, starting within the locator (line 40). Archived text at line 40 of `archive/text/src_20260708_republicoftogo_togo-israel-mou-political-consultations.txt`:

> Le Togo et Israël ont signé il y a quelques jours à Lomé un mémorandum d'entente sur les consultations politiques.

### Thailand (THA)

#### evt_2025_12_31_THA_D3

- [ ] Checked (206 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | D3, standing |
| Date | 2025-12-31 |
| Speaker or actor | Government of Thailand / Gouvernement de la Thaïlande |
| Tier (points) | +8: Increased tier (+8): UNRWA's table of 2025 gives USD 90,000 pledged and USD 90,000 received for Thailand, against USD 40,000 in UNRWA's table of 2022 (nominal USD, docs/02 §2 D3). |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | Thailand's contribution to UNRWA for 2025 exceeded its 2022 contribution in UNRWA's donor tables. |
| Summary (FR) | La contribution de la Thaïlande à l'UNRWA pour 2025 a dépassé celle de 2022, selon les tableaux des donateurs de l'UNRWA. |
| Second reading | agree, 2026-11-09 |

Evidence 1: `src_20251231_unrwa_donor-ranking-2025` (dataset, UNRWA, 2025-12-31), locator **line 96 (Thailand)**, language `en`.
Wayback: <https://web.archive.org/web/20260521084310id_/https://www.unrwa.org/sites/default/files/table_3_2025_overall_donor_ranking_confirmed_pledges_and_received_cash_and_in-kind.pdf>

Quote:

> Thailand 40,000 40,000 - - 40,000 40,000 - - 50,000 50,000 - - - - 50,000 50,000 90,000 80 90,000 78

Mechanical check: found at line 96, starting within the locator (line 96 (Thailand)). Archived text at line 96 of `archive/text/src_20251231_unrwa_donor-ranking-2025.txt`:

> Thailand 40,000 40,000 - - 40,000 40,000 - - 50,000 50,000 - - - - 50,000 50,000 90,000 80 90,000 78

Evidence 2: `src_20221231_unrwa_donor-ranking-2022` (dataset, UNRWA, 2022-12-31), locator **line 88 (Thailand)**, language `en`.
Wayback: <https://web.archive.org/web/20230921090159id_/https://www.unrwa.org/sites/default/files/overall_donor_ranking_2022.pdf>

Quote:

> Thailand 40,000 0 40,000 0 0 0 40,000 77

Mechanical check: found at line 88, starting within the locator (line 88 (Thailand)). Archived text at line 88 of `archive/text/src_20221231_unrwa_donor-ranking-2022.txt`:

> Thailand 40,000 0 40,000 0 0 0 40,000 77

### Tajikistan (TJK)

#### evt_2025_09_18_TJK_C2

- [ ] Checked (207 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | C2, standing |
| Date | 2025-09-18 |
| Speaker or actor | Chairman of the Committee for Tourism Development / Président du Comité pour le développement du tourisme |
| Tier (points) | −10: C2 (-10): a signed memorandum of understanding (a joint declaration of intent) on tourism cooperation between the Committee for Tourism Development and Israel's Ministry of Tourism, the first bilateral tourism instrument (docs/calibration/README.md R18, one event per instrument). |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Chairman of the Committee for Tourism Development signed with Israel's Minister of Tourism a joint declaration of intent on tourism cooperation. |
| Summary (FR) | Le président du Comité pour le développement du tourisme a signé avec le ministre israélien du Tourisme une déclaration commune d'intention sur la coopération touristique. |
| Second reading | agree, 2026-10-05; the notes mention a flag |

Evidence 1: `src_20250918_embassies-gov-il_katz-tajikistan-tourism` (official, Embassies of Israel (embassies.gov.il), Embassy of Israel in Uzbekistan, 2025-09-18), locator **line 1**, language `en`.
Wayback: <https://web.archive.org/web/20261005175941id_/https://embassies.gov.il/uzbekistan/en/news/tourism>

Quote:

> This was the first visit by an Israeli minister to Tajikistan, and included high-level meetings, participation in the 2025 Tajikistan Tourism Investment Forum, and the signing of a Joint Declaration of Intent on Tourism.

Mechanical check: found at line 1, starting within the locator (line 1). Archived text at line 1 of `archive/text/src_20250918_embassies-gov-il_katz-tajikistan-tourism.txt`:

> This was the first visit by an Israeli minister to Tajikistan, and included high-level meetings, participation in the 2025 Tajikistan Tourism Investment Forum, and the signing of a Joint Declaration of Intent on Tourism.

Evidence 2: `src_20250922_jns_israel-tajikistan-tourism-agreement` (press, JNS (Jewish News Syndicate), 2025-09-22), locator **line 669**, language `en`.
Wayback: <https://web.archive.org/web/20261005180022id_/https://www.jns.org/israel-news/israel-and-tajikistan-sign-tourism-agreement-in-landmark-visit>

Quote:

> Israeli Tourism Minister Haim Katz and Jumakhonzoda Jamshed Jurakhon, chairman of the Committee for Tourism Development of the Republic of Tajikistan, inked the memorandum of understanding on Thursday at the UN Tourism Investment Forum in Dushanbe, in the first official visit by an Israeli minister to the country.

Mechanical check: found at line 669, starting within the locator (line 669). Archived text at line 669 of `archive/text/src_20250922_jns_israel-tajikistan-tourism-agreement.txt`:

> Israeli Tourism Minister Haim Katz and Jumakhonzoda Jamshed Jurakhon, chairman of the Committee for Tourism Development of the Republic of Tajikistan, inked the memorandum of understanding on Thursday at the UN Tourism Investment Forum in Dushanbe, in the first official visit by an Israeli minister to the country.

### Timor-Leste (TLS)

#### evt_2025_09_24_TLS_B9

- [ ] Checked (208 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-09-24 |
| Speaker or actor | Prime Minister / Premier ministre |
| Tier (points) | +5: Names violations and uses a legal characterisation (+5): in a joint declaration the Prime Minister and the Prime Minister of Malaysia express concern at the humanitarian catastrophe in the Gaza Strip 'caused by acts of genocide committed by Israel', condemn indiscriminate violence and the systematic blockade and reiterate the call for a permanent ceasefire. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Prime Minister, in a joint declaration with Malaysia's Prime Minister, condemned what it called acts of genocide in Gaza and the blockade, and reiterated the call for a permanent ceasefire. |
| Summary (FR) | Le Premier ministre, dans une déclaration conjointe avec son homologue malaisien, a condamné ce qu'elle a appelé des actes de génocide à Gaza et le blocus, et réitéré l'appel à un cessez-le-feu. |
| Second reading | agree, 2026-11-04; the notes mention a flag |

Evidence 1: `src_20250924_gov-tl_joint-declaration-malaysia` (official, Government of Timor-Leste (timor-leste.gov.tl), Prime Minister, IX Constitutional Government, 2025-09-24), locator **line 25**, language `pt`.
Wayback: <https://web.archive.org/web/20261104000821id_/https://timor-leste.gov.tl/?p=45380&lang=pt>

Quote:

> Ambos os líderes expressaram profunda preocupação com o agravamento da catástrofe humanitária na Faixa de Gaza, causada por atos de genocídio cometidos por Israel.

Translation in the record:

> Both leaders expressed deep concern at the worsening humanitarian catastrophe in the Gaza Strip, caused by acts of genocide committed by Israel.

Mechanical check: found at line 25, starting within the locator (line 25). Archived text at line 25 of `archive/text/src_20250924_gov-tl_joint-declaration-malaysia.txt`:

> Ambos os líderes expressaram profunda preocupação com o agravamento da catástrofe humanitária na Faixa de Gaza, causada por atos de genocídio cometidos por Israel. Condenaram a violência indiscriminada e o bloqueio sistemático, que resultaram em baixas civis em massa, deslocamentos generalizados, fome e escassez crítica …

Evidence 2: `src_20250924_gov-tl_joint-declaration-malaysia` (official, Government of Timor-Leste (timor-leste.gov.tl), Prime Minister, IX Constitutional Government, 2025-09-24), locator **line 25**, language `pt`.
Wayback: <https://web.archive.org/web/20261104000821id_/https://timor-leste.gov.tl/?p=45380&lang=pt>

Quote:

> Condenaram a violência indiscriminada e o bloqueio sistemático, que resultaram em baixas civis em massa, deslocamentos generalizados, fome e escassez crítica de suprimentos essenciais, incluindo medicamentos.

Translation in the record:

> They condemned the indiscriminate violence and the systematic blockade, which resulted in mass civilian casualties, widespread displacement, famine and critical shortages of essential supplies, including medicines.

Mechanical check: found at line 25, starting within the locator (line 25). Archived text at line 25 of `archive/text/src_20250924_gov-tl_joint-declaration-malaysia.txt`:

> … os líderes expressaram profunda preocupação com o agravamento da catástrofe humanitária na Faixa de Gaza, causada por atos de genocídio cometidos por Israel. Condenaram a violência indiscriminada e o bloqueio sistemático, que resultaram em baixas civis em massa, deslocamentos generalizados, fome e escassez crítica de suprimentos essenciais, incluindo medicamentos. Os líderes exortaram a comunidade internacional a agir de forma decisiva para pôr fim à agressão, impedir uma maior desestabilização regional e garantir o …

Evidence 3: `src_20250924_gov-tl_joint-declaration-malaysia` (official, Government of Timor-Leste (timor-leste.gov.tl), Prime Minister, IX Constitutional Government, 2025-09-24), locator **line 25**, language `pt`.
Wayback: <https://web.archive.org/web/20261104000821id_/https://timor-leste.gov.tl/?p=45380&lang=pt>

Quote:

> Reiteraram o apelo urgente a um cessar-fogo permanente para alcançar uma paz, segurança e estabilidade duradouras.

Translation in the record:

> They reiterated the urgent call for a permanent ceasefire to achieve lasting peace, security and stability.

Mechanical check: found at line 25, starting within the locator (line 25). Archived text at line 25 of `archive/text/src_20250924_gov-tl_joint-declaration-malaysia.txt`:

> … a agir de forma decisiva para pôr fim à agressão, impedir uma maior desestabilização regional e garantir o acesso humanitário imediato e sem entraves. Reiteraram o apelo urgente a um cessar-fogo permanente para alcançar uma paz, segurança e estabilidade duradouras.

### Trinidad and Tobago (TTO)

#### evt_2024_09_28_TTO_B9

- [ ] Checked (209 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2024-09-28 |
| Speaker or actor | Minister of Foreign and CARICOM Affairs of Trinidad and Tobago / Ministre des Affaires étrangères et de la CARICOM de la Trinité-et-Tobago |
| Tier (points) | +5: Names specific violations and combines them with a call (+5): the Minister of Foreign and CARICOM Affairs, in the General Debate, speaks of the killing of over two hundred United Nations staff members and of tens of thousands of civilians, including women and children, and of 'ongoing violations of international law', and says that Trinidad and Tobago has joined the call for an immediate, full and complete ceasefire and for the unconditional release of every hostage. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister of Foreign and CARICOM Affairs told the General Assembly that Trinidad and Tobago joined the call for an immediate ceasefire in Gaza and cited ongoing violations of international law. |
| Summary (FR) | Le ministre des Affaires étrangères et de la CARICOM a dit à l'Assemblée générale que la Trinité-et-Tobago appelait à un cessez-le-feu immédiat à Gaza et a cité des violations du droit international. |
| Second reading | agree, 2026-10-07 |

Evidence 1: `src_20240928_un-gadebate_tto-browne-en` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2024-09-28), locator **lines 99 to 101**, language `en`.
Wayback: <https://web.archive.org/web/20241111133119id_/https://gadebate.un.org/sites/default/files/gastatements/79/tt_en.pdf>

Quote:

> Trinidad and Tobago has joined in the call for an immediate, full, and complete ceasefire, and for the unconditional release of every single hostage.

Mechanical check: found at lines 99–101, starting within the locator (lines 99 to 101). Archived text at lines 99–101 of `archive/text/src_20240928_un-gadebate_tto-browne-en.txt`:

> In this regard, Trinidad and Tobago has joined in the call for an immediate, full, and complete ceasefire, and for the unconditional release of every single hostage. The truth is there is no military solution to this

Evidence 2: `src_20240928_un-gadebate_tto-browne-en` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2024-09-28), locator **lines 78 to 80**, language `en`.
Wayback: <https://web.archive.org/web/20241111133119id_/https://gadebate.un.org/sites/default/files/gastatements/79/tt_en.pdf>

Quote:

> How else are we to describe the killing of over two-hundred UN staff members-the highest death toll in United Nations history, and the deaths of tens of thousands of civilians, including women and children.

Mechanical check: found at lines 78–80, starting within the locator (lines 78 to 80). Archived text at lines 78–80 of `archive/text/src_20240928_un-gadebate_tto-browne-en.txt`:

> How else are we to describe the killing of over two-hundred UN staff members-the highest death toll in United Nations history, and the deaths of tens of thousands of civilians, including women and children. And this

Evidence 3: `src_20240928_un-gadebate_tto-browne-en` (official, United Nations General Assembly, General Debate statements (gadebate.un.org), 2024-09-28), locator **line 87**, language `en`.
Wayback: <https://web.archive.org/web/20241111133119id_/https://gadebate.un.org/sites/default/files/gastatements/79/tt_en.pdf>

Quote:

> these ongoing violations of international law

Mechanical check: found at line 87, starting within the locator (line 87). Archived text at line 87 of `archive/text/src_20240928_un-gadebate_tto-browne-en.txt`:

> resourcing of these ongoing violations of international law send a chilling

Evidence 4: `src_20240928_un-press_ga12639` (official, United Nations, Meetings Coverage and Press Releases, 2024-09-28), locator **line 99**, language `en`.
Wayback: <https://web.archive.org/web/20260305055047id_/https://press.un.org/en/2024/ga12639.doc.htm>

Quote:

> AMERY BROWNE, Minister for Foreign and CARICOM Affairs of Trinidad and Tobago, expressed deep concern over the ongoing war on Gaza

Mechanical check: found at line 99, starting within the locator (line 99). Archived text at line 99 of `archive/text/src_20240928_un-press_ga12639.txt`:

> AMERY BROWNE, Minister for Foreign and CARICOM Affairs of Trinidad and Tobago, expressed deep concern over the ongoing war on Gaza, stating “only someone absolutely bereft of humanity would think that it is lawful and just, and even godly to respond to atrocities committed on one awful …

### Tunisia (TUN)

#### evt_2026_09_26_TUN_B9

- [ ] Checked (210 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2026-09-26 |
| Speaker or actor | Minister of Foreign Affairs of Tunisia / Ministre des Affaires étrangères de la Tunisie |
| Tier (points) | +5: Names violations and uses a legal characterisation (+5): the statement condemns 'the policies of persecution, starvation and isolation in the Gaza Strip and the crimes of genocide that claim more lives every day' and calls on the international community to assume its responsibilities. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister of Foreign Affairs told the General Assembly that Tunisia condemned the policies of starvation and isolation in Gaza and what he called the crimes of genocide there. |
| Summary (FR) | Le ministre des Affaires étrangères a dit à l'Assemblée générale que la Tunisie condamnait les politiques de famine et d'isolement à Gaza et ce qu'il a appelé les crimes de génocide. |
| Second reading | agree, 2026-10-13; the notes mention a flag |

Evidence 1: `src_20260926_diplomatie-tn_nafti-unga81` (official, Ministry of Foreign Affairs, Migration and Tunisians Abroad of Tunisia (diplomatie.gov.tn, content API), 2026-09-26), locator **line 25**, language `en`.
Wayback: <https://web.archive.org/web/20261013071122id_/https://back.diplomatie.gov.tn/index.php/api/post/1354>

Quote:

> While my country condemns the continued settlement policies of the occupying entity in the West Bank, as well as the policies of persecution, starvation and isolation in the Gaza Strip and the crimes of genocide that claim more lives every day, in the absence of any accountability or punishment,

Mechanical check: found at line 25, starting within the locator (line 25). Archived text at line 25 of `archive/text/src_20260926_diplomatie-tn_nafti-unga81.txt`:

> While my country condemns the continued settlement policies of the occupying entity in the West Bank, as well as the policies of persecution, starvation and isolation in the Gaza Strip and the crimes of genocide that claim more lives every day, in the absence of any accountability or punishment, it calls upon the international community to assume its legal, moral and humanitarian responsibility to redress this longstanding historical injustice.

Evidence 2: `src_20260920_lapresse_nafti-leads-delegation-unga81` (press, La Presse de Tunisie, 2026-09-20), locator **line 2**, language `fr`.
Wayback: <https://web.archive.org/web/20261013131113id_/https://www.lapresse.tn/2026/09/20/onu-mohamed-ali-nafti-conduira-la-delegation-tunisienne-a-la-81e-assemblee-generale/>

Quote:

> À cette occasion, M. le Ministre prononcera la déclaration de la République Tunisienne lors du débat général de la 81e session et présentera les positions de la Tunisie ainsi que sa vision sur les principales questions régionales et internationales à l’ordre du jour. Il prendra également part à plusieurs réunions officielles et manifestations de haut niveau consacrées à un ensemble de dossiers prioritaires sur la scène internationale, notamment le droit au développement, la lutte contre les effets de l’élévation du niveau de la mer, ainsi que la prévention des pandémies, la préparation et la riposte à celles-ci, outre l’Alliance des Civilisations des Nations Unies.

Translation in the record:

> On this occasion, the Minister will deliver the statement of the Republic of Tunisia at the general debate of the 81st session

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20260920_lapresse_nafti-leads-delegation-unga81.txt`:

> À cette occasion, M. le Ministre prononcera la déclaration de la République Tunisienne lors du débat général de la 81e session et présentera les positions de la Tunisie ainsi que sa vision sur les principales questions régionales et internationales à l’ordre du jour. Il prendra également part à plusieurs réunions officielles et manifestations de haut niveau consacrées à un ensemble de dossiers prioritaires sur la scène internationale, notamment le droit au développement, la lutte contre les effets de l’élévation du niveau de la mer, ainsi que la prévention des pandémies, la préparation et la riposte à celles-ci, outre l’Alliance des Civilisations des Nations Unies.

Evidence 3: `src_20260927_arabnews_tunisia-un-address` (press, Arab News, 2026-09-27), locator **line 5**, language `en`.
Wayback: <https://web.archive.org/web/20261013132216id_/https://www.arabnews.pk/middle-east/tunisia-urges-end-to-regional-wars-in-un-address-3002488>

Quote:

> Mohamed Ali Nafti, Tunisia’s minister for foreign affairs, migration and Tunisians abroad, specifically called for an end to Israel’s violence and what he described as genocide against Palestinians in Gaza and the West Bank.

Mechanical check: found at line 5, starting within the locator (line 5). Archived text at line 5 of `archive/text/src_20260927_arabnews_tunisia-un-address.txt`:

> … violence and conflict around the world, including in the Middle East and North Africa, Tunisia’s foreign minister told the UN General Assembly on Saturday. Mohamed Ali Nafti, Tunisia’s minister for foreign affairs, migration and Tunisians abroad, specifically called for an end to Israel’s violence and what he described as genocide against Palestinians in Gaza and the West Bank. “The United Nations remains, for Tunisia, the home of international legitimacy, the house that carries the hopes and aspirations of future generations for a …

### Türkiye (TUR)

#### evt_2026_02_24_TUR_B9

- [ ] Checked (211 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2026-02-24 |
| Speaker or actor | Minister of Foreign Affairs / Ministre des Affaires étrangères |
| Tier (points) | +5: Uses a legal characterisation (+5): the settlements as a violation of international law. West Bank conduct, tagged and unscored in v1 (docs/10 B-32). |
| Confidence | confirmed |
| Scope | west-bank |
| Summary (EN) | The Minister of Foreign Affairs signed a joint statement that calls Israel's settlements a violation of international law. |
| Summary (FR) | Le ministre des Affaires étrangères a signé une déclaration commune qui qualifie les colonies d'Israël de violation du droit international. |
| Second reading | agree, 2026-09-30 |

Evidence 1: `src_20260224_um_joint-statement-west-bank` (official, Udenrigsministeriet (Ministry of Foreign Affairs of Denmark), press room on via.ritzau.dk, 2026-02-24), locator **line 2**, language `en`.
Wayback: <https://web.archive.org/web/20260928221628id_/https://via.ritzau.dk/pressemeddelelse/14806013/joint-statement?publisherId=2012662&lang=da>

Quote:

> We are clear that Israel’s illegal settlements, and decisions designed to further them, are a flagrant violation of international law, including previous United Nations Security Council Resolutions and the 2024 Advisory Opinion of the International Court of Justice.

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20260224_um_joint-statement-west-bank.txt`:

> We are clear that Israel’s illegal settlements, and decisions designed to further them, are a flagrant violation of international law, including previous United Nations Security Council Resolutions and the 2024 Advisory Opinion of the International Court of Justice. These latest decisions are part of a clear trajectory that aims to change the reality on the ground and to advance unacceptable de facto annexation. They also …

Evidence 2: `src_20260224_um_joint-statement-west-bank` (official, Udenrigsministeriet (Ministry of Foreign Affairs of Denmark), press room on via.ritzau.dk, 2026-02-24), locator **line 1**, language `en`.
Wayback: <https://web.archive.org/web/20260928221628id_/https://via.ritzau.dk/pressemeddelelse/14806013/joint-statement?publisherId=2012662&lang=da>

Quote:

> We, the Foreign Ministers of the Federative Republic of Brazil, the French Republic, the Kingdom of Denmark, the Republic of Finland, the Republic of Iceland, the Republic of Indonesia, Ireland, the Arab Republic of Egypt, the Hashemite Kingdom of Jordan, the Grand Duchy of Luxembourg, the Kingdom of Norway, the State of Palestine, the Portuguese Republic, the State of Qatar, the Kingdom of Saudi Arabia, the Republic of Slovenia, the Kingdom of Spain, the Kingdom of Sweden, the Republic of Türkiye

Mechanical check: found at line 1, starting within the locator (line 1). Archived text at line 1 of `archive/text/src_20260224_um_joint-statement-west-bank.txt`:

> We, the Foreign Ministers of the Federative Republic of Brazil, the French Republic, the Kingdom of Denmark, the Republic of Finland, the Republic of Iceland, the Republic of Indonesia, Ireland, the Arab Republic of Egypt, the Hashemite Kingdom of Jordan, the Grand Duchy of Luxembourg, the Kingdom of Norway, the State of Palestine, the Portuguese Republic, the State of Qatar, the Kingdom of Saudi Arabia, the Republic of Slovenia, the Kingdom of Spain, the Kingdom of Sweden, the Republic of Türkiye, and the Secretary Generals of the League of Arab States and the Organization of Islamic Cooperation, condemn in the strongest terms a series of recent …

#### evt_2026_08_21_TUR_B9

- [ ] Checked (212 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2026-08-21 |
| Speaker or actor | Minister of Foreign Affairs / Ministre des Affaires étrangères |
| Tier (points) | +5: Violations named (+5): the eight foreign ministers condemn settler violence against Palestinians and their property, with the support of the Israeli authorities, as violations of international law, and reject the E1 settlement plan. Scoped west-bank: tracked, not scored in v1 (D-14, docs/10 B-32). |
| Confidence | confirmed |
| Scope | west-bank |
| Summary (EN) | The Minister of Foreign Affairs and seven counterparts rejected the E1 settlement plan and called settler violence against Palestinians a violation of international law. |
| Summary (FR) | Le ministre des Affaires étrangères et sept homologues ont rejeté le plan de colonisation E1 et qualifié les violences de colons contre les Palestiniens de violations du droit international. |
| Second reading | agree, 2026-11-09 |

Evidence 1: `src_20260821_mfa-tr_eight-ministers-e1-settlement` (official, Ministry of Foreign Affairs of the Republic of Türkiye, 2026-08-21), locator **line 2**, language `en`.
Wayback: <https://web.archive.org/web/20261109031309id_/https://www.mfa.gov.tr/joint-statement-by-the-foreign-ministers-of-turkiye--egypt--indonesia--jordan--pakistan--qatar--saudi-arabia-and-uae--21-august-2026.en.mfa>

Quote:

> They stress that such acts in no way diminish the inalienable rights of the Palestinian people and constitute violations of international law and relevant United Nations resolutions

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20260821_mfa-tr_eight-ministers-e1-settlement.txt`:

> … and acts of violence perpetrated by settlers, with the support of the Israeli occupying authorities, against the Palestinian people and their property. They stress that such acts in no way diminish the inalienable rights of the Palestinian people and constitute violations of international law and relevant United Nations resolutions, while posing a serious threat to regional and international peace and security.

Evidence 2: `src_20260821_mfa-tr_eight-ministers-e1-settlement` (official, Ministry of Foreign Affairs of the Republic of Türkiye, 2026-08-21), locator **line 2**, language `en`.
Wayback: <https://web.archive.org/web/20261109031309id_/https://www.mfa.gov.tr/joint-statement-by-the-foreign-ministers-of-turkiye--egypt--indonesia--jordan--pakistan--qatar--saudi-arabia-and-uae--21-august-2026.en.mfa>

Quote:

> The Foreign Ministers of the Republic of Türkiye, the Arab Republic of Egypt

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20260821_mfa-tr_eight-ministers-e1-settlement.txt`:

> The Foreign Ministers of the Republic of Türkiye, the Arab Republic of Egypt, the Republic of Indonesia, the Hashemite Kingdom of Jordan, the Islamic Republic of Pakistan, the State of Qatar, the Kingdom of Saudi Arabia and the United …

#### evt_2026_08_03_TUR_B9

- [ ] Checked (213 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2026-08-03 |
| Speaker or actor | Minister of Foreign Affairs / Ministre des Affaires étrangères |
| Tier (points) | +5: Names a specific violation (+5): the mediating states condemn the targeting of healthcare facilities and medical infrastructure in the Gaza Strip and call it a flagrant violation of international law and international humanitarian law. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister of Foreign Affairs and his counterparts of the other mediating states condemned the targeting of healthcare facilities in Gaza as a violation of international humanitarian law. |
| Summary (FR) | Le ministre des Affaires étrangères et ses homologues des autres États médiateurs ont condamné le ciblage d'installations de santé à Gaza comme une violation du droit international humanitaire. |
| Second reading | agree, 2026-11-09; the notes mention a flag |

Evidence 1: `src_20260803_mfa-tr_mediators-violations-gaza` (official, Ministry of Foreign Affairs of the Republic of Türkiye, 2026-08-03), locator **line 2**, language `en`.
Wayback: <https://web.archive.org/web/20261109024948id_/https://www.mfa.gov.tr/joint-statement-issued-by-the-mediators--the-republic-of-turkiye--the-arab-republic-of-egypt-and-the-state-of-qatar-on-the-ongoing-israeli-violations-in-gaza.en.mfa>

Quote:

> The Republic of Türkiye, the Arab Republic of Egypt and the State of Qatar, in their capacity as the mediating countries, express their strong condemnation and denunciation of the ongoing Israeli violations in the Gaza Strip, particularly the targeting of healthcare facilities and medical infrastructure, and the resulting civilian casualties, including women and children, which constitute a flagrant violation of international law and international humanitarian law.

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20260803_mfa-tr_mediators-violations-gaza.txt`:

> The Republic of Türkiye, the Arab Republic of Egypt and the State of Qatar, in their capacity as the mediating countries, express their strong condemnation and denunciation of the ongoing Israeli violations in the Gaza Strip, particularly the targeting of healthcare facilities and medical infrastructure, and the resulting civilian casualties, including women and children, which constitute a flagrant violation of international law and international humanitarian law.

#### evt_2026_07_23_TUR_B9

- [ ] Checked (214 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2026-07-23 |
| Speaker or actor | Minister of Foreign Affairs / Ministre des Affaires étrangères |
| Tier (points) | +5: Legal characterisation (+5): the eight foreign ministers call the access restrictions in the Old City of Jerusalem a flagrant violation of international law, including international humanitarian law. Scoped west-bank (East Jerusalem): tracked, not scored in v1 (D-14, docs/10 B-32). |
| Confidence | confirmed |
| Scope | west-bank |
| Summary (EN) | The Minister of Foreign Affairs and seven counterparts called Israeli access restrictions in the Old City of Jerusalem a violation of international humanitarian law. |
| Summary (FR) | Le ministre des Affaires étrangères et sept homologues ont qualifié les restrictions d'accès israéliennes dans la vieille ville de Jérusalem de violation du droit international humanitaire. |
| Second reading | agree, 2026-11-09 |

Evidence 1: `src_20260723_mfa-tr_eight-ministers-al-aqsa-jerusalem` (official, Ministry of Foreign Affairs of the Republic of Türkiye, 2026-07-23), locator **line 4**, language `en`.
Wayback: <https://web.archive.org/web/20261109031240id_/https://www.mfa.gov.tr/joint-statement-by-the-foreign-ministers-23-july-2026.en.mfa>

Quote:

> Restrictions on access to the Old City of Jerusalem and its places of worship coupled with discriminatory and arbitrary access restrictions to the other places of worship in the old city constitute a flagrant violation of international law, including international humanitarian law

Mechanical check: found at line 4, starting within the locator (line 4). Archived text at line 4 of `archive/text/src_20260723_mfa-tr_eight-ministers-al-aqsa-jerusalem.txt`:

> 3. Restrictions on access to the Old City of Jerusalem and its places of worship coupled with discriminatory and arbitrary access restrictions to the other places of worship in the old city constitute a flagrant violation of international law, including international humanitarian law, and an unlawful attempt to alter the historical and legal status quo.

Evidence 2: `src_20260723_mfa-tr_eight-ministers-al-aqsa-jerusalem` (official, Ministry of Foreign Affairs of the Republic of Türkiye, 2026-07-23), locator **line 2**, language `en`.
Wayback: <https://web.archive.org/web/20261109031240id_/https://www.mfa.gov.tr/joint-statement-by-the-foreign-ministers-23-july-2026.en.mfa>

Quote:

> The Foreign Ministers of the Republic of Türkiye, Arab Republic of Egypt

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20260723_mfa-tr_eight-ministers-al-aqsa-jerusalem.txt`:

> 1. The Foreign Ministers of the Republic of Türkiye, Arab Republic of Egypt, Republic of Indonesia, the Hashemite Kingdom of Jordan, Islamic Republic of Pakistan, State of Qatar, Kingdom of Saudi Arabia, and the United Arab Emirates …

#### evt_2026_02_01_TUR_B9

- [ ] Checked (215 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2026-02-01 |
| Speaker or actor | Minister of Foreign Affairs / Ministre des Affaires étrangères |
| Tier (points) | +2: Formal call for a ceasefire (+2): the joint statement of the foreign ministers of eight states condemned Israel's repeated violations of the ceasefire in Gaza and called on all parties to preserve and sustain it; no violation of international humanitarian law is named. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister of Foreign Affairs and seven counterparts condemned Israel's repeated violations of the Gaza ceasefire and called on all parties to preserve it. |
| Summary (FR) | Le ministre des Affaires étrangères et sept homologues ont condamné les violations répétées par Israël du cessez-le-feu à Gaza et appelé toutes les parties à le préserver. |
| Second reading | agree, 2026-09-30 |

Evidence 1: `src_20260201_spa_fms-joint-statement-ceasefire-gaza` (official, Saudi Press Agency, 2026-02-01), locator **line 3**, language `en`.
Wayback: <https://web.archive.org/web/20260929110100id_/https://www.spa.gov.sa/en/N2502340>

Quote:

> Israel’s repeated violations of the ceasefire in Gaza which have resulted in the killing, and injuring of more than a thousand Palestinians.

Mechanical check: found at line 3, starting within the locator (line 3). Archived text at line 3 of `archive/text/src_20260201_spa_fms-joint-statement-ceasefire-gaza.txt`:

> … the State of Qatar, the Republic of Indonesia, the Islamic Republic of Pakistan, the Arab Republic of Egypt, and the Republic of Türkiye strongly condemn Israel’s repeated violations of the ceasefire in Gaza which have resulted in the killing, and injuring of more than a thousand Palestinians.

Evidence 2: `src_20260201_spa_fms-joint-statement-ceasefire-gaza` (official, Saudi Press Agency, 2026-02-01), locator **line 6**, language `en`.
Wayback: <https://web.archive.org/web/20260929110100id_/https://www.spa.gov.sa/en/N2502340>

Quote:

> They also call on all parties to fully uphold their responsibilities during this critical period and to exercise the utmost restraint, in order to preserve and sustain the ceasefire

Mechanical check: found at line 6, starting within the locator (line 6). Archived text at line 6 of `archive/text/src_20260201_spa_fms-joint-statement-ceasefire-gaza.txt`:

> They also call on all parties to fully uphold their responsibilities during this critical period and to exercise the utmost restraint, in order to preserve and sustain the ceasefire, refrain from any actions that may undermine the current process, and create favorable conditions to move forward toward early recovery and reconstruction, as …

Evidence 3: `src_20260201_spa_fms-joint-statement-ceasefire-gaza` (official, Saudi Press Agency, 2026-02-01), locator **line 3**, language `en`.
Wayback: <https://web.archive.org/web/20260929110100id_/https://www.spa.gov.sa/en/N2502340>

Quote:

> Riyadh, February 01, 2026, SPA -- The foreign ministers of the Kingdom of Saudi Arabia, the Hashimte Kingdom of Jordan, the United Arab Emirates, the State of Qatar, the Republic of Indonesia, the Islamic Republic of Pakistan, the Arab Republic of Egypt, and the Republic of Türkiye

Mechanical check: found at line 3, starting within the locator (line 3). Archived text at line 3 of `archive/text/src_20260201_spa_fms-joint-statement-ceasefire-gaza.txt`:

> Riyadh, February 01, 2026, SPA -- The foreign ministers of the Kingdom of Saudi Arabia, the Hashimte Kingdom of Jordan, the United Arab Emirates, the State of Qatar, the Republic of Indonesia, the Islamic Republic of Pakistan, the Arab Republic of Egypt, and the Republic of Türkiye strongly condemn Israel’s repeated violations of the ceasefire in Gaza which have resulted in the killing, and injuring of more than a thousand Palestinians.

#### evt_2026_10_23_TUR_B9

- [ ] Checked (216 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2026-10-23 |
| Speaker or actor | Minister of Foreign Affairs / Ministre des Affaires étrangères |
| Tier (points) | +2: Formal call to end the violence and for humanitarian access (+2): the four foreign ministers call for an urgent end to the ongoing Israeli violence and underline the urgent need for an uninterrupted flow of humanitarian aid to Gaza; the violations named (settlement activity, settler violence) are in the West Bank. |
| Confidence | confirmed |
| Scope | gaza, west-bank |
| Summary (EN) | The Minister of Foreign Affairs and three counterparts called for an urgent end to Israeli violence and for an uninterrupted flow of humanitarian aid to Gaza. |
| Summary (FR) | Le ministre des Affaires étrangères et trois homologues ont appelé à la fin urgente des violences israéliennes et à un acheminement ininterrompu de l'aide humanitaire à Gaza. |
| Second reading | agree, 2026-11-09 |

Evidence 1: `src_20261023_mfa-tr_joint-statement-r4-ministerial-istanbul` (official, Ministry of Foreign Affairs of the Republic of Türkiye, 2026-10-23), locator **line 4**, language `en`.
Wayback: <https://web.archive.org/web/20261109023300id_/https://www.mfa.gov.tr/joint-statement-on-the-r4-ministerial-meeting-istanbul-23-october-2026.en.mfa>

Quote:

> They underlined the urgent need for uninterrupted flow of humanitarian aid to and reconstruction in Gaza.

Mechanical check: found at line 4, starting within the locator (line 4). Archived text at line 4 of `archive/text/src_20261023_mfa-tr_joint-statement-r4-ministerial-istanbul.txt`:

> … They condemned all the previous and current settlement activities in the West Bank and Jerusalem, as well as the settler violence against Palestinians. They underlined the urgent need for uninterrupted flow of humanitarian aid to and reconstruction in Gaza.

Evidence 2: `src_20261023_mfa-tr_joint-statement-r4-ministerial-istanbul` (official, Ministry of Foreign Affairs of the Republic of Türkiye, 2026-10-23), locator **line 4**, language `en`.
Wayback: <https://web.archive.org/web/20261109023300id_/https://www.mfa.gov.tr/joint-statement-on-the-r4-ministerial-meeting-istanbul-23-october-2026.en.mfa>

Quote:

> The Ministers called for an urgent end to the ongoing Israeli violence

Mechanical check: found at line 4, starting within the locator (line 4). Archived text at line 4 of `archive/text/src_20261023_mfa-tr_joint-statement-r4-ministerial-istanbul.txt`:

> The Ministers called for an urgent end to the ongoing Israeli violence, as well as attempts to change the legal and historical status of Jerusalem, and to bring an end to further destruction and humanitarian tragedy in Palestine. …

Evidence 3: `src_20261023_mfa-tr_joint-statement-r4-ministerial-istanbul` (official, Ministry of Foreign Affairs of the Republic of Türkiye, 2026-10-23), locator **line 2**, language `en`.
Wayback: <https://web.archive.org/web/20261109023300id_/https://www.mfa.gov.tr/joint-statement-on-the-r4-ministerial-meeting-istanbul-23-october-2026.en.mfa>

Quote:

> The Foreign Ministers of the Republic of Türkiye, Arab Republic of Egypt, Islamic Republic of Pakistan, and the Kingdom of Saudi Arabia (R4 Group), met today in İstanbul

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20261023_mfa-tr_joint-statement-r4-ministerial-istanbul.txt`:

> The Foreign Ministers of the Republic of Türkiye, Arab Republic of Egypt, Islamic Republic of Pakistan, and the Kingdom of Saudi Arabia (R4 Group), met today in İstanbul to discuss regional issues of mutual concern, united in their commitment to contribute to diplomatic efforts and guided by the mutual interest to promote …

#### evt_2026_11_19_TUR_B9

- [ ] Checked (217 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2026-11-19 |
| Speaker or actor | Minister of Foreign Affairs / Ministre des Affaires étrangères |
| Tier (points) | +2: Formal condemnation and call (+2), set by the Gaza passage: the sixteen foreign ministers condemn the Israeli military escalation in Gaza and call for the full and immediate implementation of the Comprehensive Plan, without naming a category of violation for Gaza. The legal characterisations (illegal settlement activity, unlawful occupation) concern the West Bank and East Jerusalem and are tagged west-bank, unscored in v1 (docs/10 B-32), as for evt_2026_10_23_TUR_B9. Corrected in place on 2026-11-28 (T-H-MF-4, docs/10 B-2192): first filed at +5, west-bank only, without line 5. |
| Confidence | confirmed |
| Scope | gaza, west-bank |
| Summary (EN) | The Minister of Foreign Affairs and fifteen counterparts condemned the Israeli military escalation in Gaza and Israel's settlement policies in the Occupied Palestinian Territory. |
| Summary (FR) | Le ministre des Affaires étrangères et quinze homologues ont condamné l'escalade militaire israélienne à Gaza et la politique de colonisation d'Israël dans le Territoire palestinien occupé. |
| Second reading | agree, 2026-11-28 |

Evidence 1: `src_20261119_mfa-tr_joint-statement-uk-australia-sanctions` (official, Ministry of Foreign Affairs of the Republic of Türkiye, 2026-11-19), locator **line 5**, language `en`.
Wayback: <https://web.archive.org/web/20261128044413id_/https://www.mfa.gov.tr/joint-statement-19-november-2026.en.mfa>

Quote:

> The Ministers condemn the Israeli military escalation in Gaza and call for the full and immediate implementation of President Trump’s Comprehensive Plan to End the Gaza Conflict

Mechanical check: found at line 5, starting within the locator (line 5). Archived text at line 5 of `archive/text/src_20261119_mfa-tr_joint-statement-uk-australia-sanctions.txt`:

> The Ministers condemn the Israeli military escalation in Gaza and call for the full and immediate implementation of President Trump’s Comprehensive Plan to End the Gaza Conflict, to ensure security and stability, address the humanitarian situation, facilitate reconstruction and recovery, and lay the foundations for lasting peace. The …

Evidence 2: `src_20261119_mfa-tr_joint-statement-uk-australia-sanctions` (official, Ministry of Foreign Affairs of the Republic of Türkiye, 2026-11-19), locator **line 3**, language `en`.
Wayback: <https://web.archive.org/web/20261128044413id_/https://www.mfa.gov.tr/joint-statement-19-november-2026.en.mfa>

Quote:

> The Ministers renew their strongest condemnation of Israel’s continued settlement policies in the Occupied Palestinian Territory, particularly the “E1” settlement plan and related settlement activities east of occupied East Jerusalem

Mechanical check: found at line 3, starting within the locator (line 3). Archived text at line 3 of `archive/text/src_20261119_mfa-tr_joint-statement-uk-australia-sanctions.txt`:

> … settlement activities, including the E1 settlement plan, as well as those that support, facilitate or implement settlement expansion and annexation policies. The Ministers renew their strongest condemnation of Israel’s continued settlement policies in the Occupied Palestinian Territory, particularly the “E1” settlement plan and related settlement activities east of occupied East Jerusalem, they express the hope that this decision by the UK and Australia would encourage many in the international community to follow suit.

Evidence 3: `src_20261119_mfa-tr_joint-statement-uk-australia-sanctions` (official, Ministry of Foreign Affairs of the Republic of Türkiye, 2026-11-19), locator **line 4**, language `en`.
Wayback: <https://web.archive.org/web/20261128044413id_/https://www.mfa.gov.tr/joint-statement-19-november-2026.en.mfa>

Quote:

> the obligation of all States not to recognize as legal the situation arising from Israel’s unlawful occupation

Mechanical check: found at line 4, starting within the locator (line 4). Archived text at line 4 of `archive/text/src_20261119_mfa-tr_joint-statement-uk-australia-sanctions.txt`:

> … including United Nations Security Council resolution 2334 (2016), and the Advisory Opinion of the International Court of Justice of 19 July 2024, including the obligation of all States not to recognize as legal the situation arising from Israel’s unlawful occupation and not to render aid or assistance in maintaining the situation created by Israel’s occupation. In this regard, they reiterate their call for Israel to …

Evidence 4: `src_20261119_mfa-tr_joint-statement-uk-australia-sanctions` (official, Ministry of Foreign Affairs of the Republic of Türkiye, 2026-11-19), locator **line 2**, language `en`.
Wayback: <https://web.archive.org/web/20261128044413id_/https://www.mfa.gov.tr/joint-statement-19-november-2026.en.mfa>

Quote:

> The Ministers of Foreign Affairs of the Republic of Türkiye, People's Democratic Republic of Algeria, the Arab Republic of Egypt

Mechanical check: found at line 2, starting within the locator (line 2). Archived text at line 2 of `archive/text/src_20261119_mfa-tr_joint-statement-uk-australia-sanctions.txt`:

> The Ministers of Foreign Affairs of the Republic of Türkiye, People's Democratic Republic of Algeria, the Arab Republic of Egypt, the Republic of Indonesia, the Hashemite Kingdom of Jordan, the State of Kuwait, the State of Libya, Republic of Maldives, Republic of the Niger, the …

### United States of America (USA)

#### evt_2024_01_26_USA_D2

- [ ] Checked (218 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | D2, standing |
| Date | 2024-01-26 |
| Speaker or actor | Department of State / Département d'État |
| Tier (points) | −10 |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Department of State paused additional funding for UNRWA while it reviewed allegations against twelve of the agency's employees. |
| Summary (FR) | Le département d'État a suspendu tout financement supplémentaire de l'UNRWA pendant l'examen d'allégations visant douze employés de l'agence. |
| Second reading | agree, 2026-09-28 |

Evidence 1: `src_20240126_state-gov_unrwa-allegations` (official, United States Department of State, 2024-01-26), locator **paragraph 206**, language `en`.
Wayback: <https://web.archive.org/web/20260928095626id_/https://2021-2025.state.gov/statement-on-unrwa-allegations/>

Quote:

> The Department of State has temporarily paused additional funding for UNRWA while we review these allegations and the steps the United Nations is taking to address them.

Mechanical check: found at line 206; the locator is not a line number. Archived text at line 206 of `archive/text/src_20240126_state-gov_unrwa-allegations.txt`:

> … United States is extremely troubled by the allegations that twelve UNRWA employees may have been involved in the October 7 Hamas terrorist attack on Israel. The Department of State has temporarily paused additional funding for UNRWA while we review these allegations and the steps the United Nations is taking to address them.

Evidence 2: `src_20250204_whitehouse_eo-14199-un-organizations` (official, The White House, 2025-02-04), locator **paragraph 7 (section 3(a))**, language `en`.
Wayback: <https://web.archive.org/web/20260928100217id_/https://www.whitehouse.gov/presidential-actions/2025/02/withdrawing-the-united-states-from-and-ending-funding-to-certain-united-nations-organizations-and-reviewing-united-states-support-to-all-international-organizations/>

Quote:

> Executive departments and agencies shall not use any funds for a contribution, grant, or other payment to UNRWA, consistent with section 301 of title III, division G, of Public Law 118-47 (March 23, 2024).

Mechanical check: found at line 7; the locator is not a line number. Archived text at line 7 of `archive/text/src_20250204_whitehouse_eo-14199-un-organizations.txt`:

> Sec. 3. Funding. (a) Executive departments and agencies shall not use any funds for a contribution, grant, or other payment to UNRWA, consistent with section 301 of title III, division G, of Public Law 118-47 (March 23, 2024). The Secretary shall withdraw the determination previously made under section 7048(c)(1) of title VII, division F, of Public Law 118-47. Accordingly, of the …

### Uzbekistan (UZB)

#### evt_2023_12_31_UZB_D3

- [ ] Checked (219 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | D3, standing |
| Date | 2023-12-31 to 2024-12-31 |
| Speaker or actor | — / — |
| Tier (points) | +8: Increased tier (+8): Uzbekistan's 2023 contribution to UNRWA exceeds its 2022 contribution in nominal USD per UNRWA's donor tables (USD 1,500,000 in 2023; no row for Uzbekistan in the 2022 table (a 2022 contribution of zero)) (docs/02 §2 D3; docs/calibration/README.md R10). |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | Uzbekistan contributed more to UNRWA in 2023 than in 2022, according to UNRWA's donor tables. |
| Summary (FR) | La contribution de l'Ouzbékistan à l'UNRWA pour 2023 a dépassé celle de 2022, selon les tableaux des donateurs de l'UNRWA. |
| Second reading | agree, 2026-10-05 |

Evidence 1: `src_20231231_unrwa_donor-ranking-2023` (dataset, UNRWA, 2023-12-31), locator **line 62**, language `en`.
Wayback: <https://web.archive.org/web/20240617020444id_/https://www.unrwa.org/sites/default/files/overall_donor_ranking_.pdf>

Quote:

> Uzbekistan 0 0 0 0 0 0 0 0 0 1,500,000 1,500,000 45

Mechanical check: found at line 62, starting within the locator (line 62). Archived text at line 62 of `archive/text/src_20231231_unrwa_donor-ranking-2023.txt`:

> Uzbekistan 0 0 0 0 0 0 0 0 0 1,500,000 1,500,000 45

### Holy See (VAT)

#### evt_2025_10_05_VAT_B9

- [ ] Checked (220 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-10-05 |
| Speaker or actor | Pope / Pape |
| Tier (points) | +2: Formal call for a ceasefire (+2): after naming 'the immense suffering of the Palestinian people in Gaza' the Pope asks those in positions of responsibility 'to bring about a ceasefire and to release the hostages'; no violation is named. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Pope asked those in positions of responsibility to bring about a ceasefire in Gaza and to release the hostages. |
| Summary (FR) | Le pape a demandé à ceux qui détiennent des responsabilités d'obtenir un cessez-le-feu à Gaza et la libération des otages. |
| Second reading | agree, 2026-11-10; the notes mention a flag |

Evidence 1: `src_20251005_vatican_angelus-5-ottobre-2025` (official, Holy See (vatican.va), 2025-10-05), locator **line 11**, language `en`.
Wayback: <https://web.archive.org/web/20261110035817id_/https://www.vatican.va/content/leo-xiv/en/angelus/2025/documents/20251005-angelus.html>

Quote:

> I continue to be saddened by the immense suffering of the Palestinian people in Gaza.

Mechanical check: found at line 11, starting within the locator (line 11). Archived text at line 11 of `archive/text/src_20251005_vatican_angelus-5-ottobre-2025.txt`:

> I express my concern about the rise of antisemitic hatred in the world, as unfortunately we saw with the terrorist attack in Manchester a few days ago. I continue to be saddened by the immense suffering of the Palestinian people in Gaza.

Evidence 2: `src_20251005_vatican_angelus-5-ottobre-2025` (official, Holy See (vatican.va), 2025-10-05), locator **line 12**, language `en`.
Wayback: <https://web.archive.org/web/20261110035817id_/https://www.vatican.va/content/leo-xiv/en/angelus/2025/documents/20251005-angelus.html>

Quote:

> I ask all those in positions of responsibility to commit themselves to this path, to bring about a ceasefire and to release the hostages.

Mechanical check: found at line 12, starting within the locator (line 12). Archived text at line 12 of `archive/text/src_20251005_vatican_angelus-5-ottobre-2025.txt`:

> … in the Middle East, some significant steps forward have been taken in peace negotiations, which I hope will achieve the desired results as soon as possible. I ask all those in positions of responsibility to commit themselves to this path, to bring about a ceasefire and to release the hostages. At the same time, I urge everyone to remain united in prayer, so that the ongoing efforts may put an end to the war and lead us towards a just and lasting …

### Saint Vincent and the Grenadines (VCT)

#### evt_2025_09_26_VCT_B9

- [ ] Checked (221 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-09-26 |
| Speaker or actor | Prime Minister of Saint Vincent and the Grenadines / Premier ministre de Saint-Vincent-et-les Grenadines |
| Tier (points) | +5: Uses a legal characterisation (+5): the Prime Minister, in the General Debate, on Gaza and the West Bank, says that the hottest part of hell is reserved for the perpetrators of genocide and those complicit in it (UN Meetings Coverage's quotation). |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Prime Minister told the General Assembly, on Gaza and the West Bank, that the hottest part of hell was reserved for those responsible for what he called genocide. |
| Summary (FR) | Le Premier ministre a dit à l'Assemblée générale, à propos de Gaza et de la Cisjordanie, que la partie la plus chaude de l'enfer était réservée aux responsables de ce qu'il a appelé un génocide. |
| Second reading | agree, 2026-10-07; the notes mention a flag |

Evidence 1: `src_20250926_un-press_ga12712` (official, United Nations, Meetings Coverage and Press Releases, 2025-09-26), locator **line 44 (UN Meetings Coverage GA/12712, summary of Mr Gonsalves's statement)**, language `en`.
Wayback: <https://web.archive.org/web/20251230210333id_/https://press.un.org/en/2025/ga12712.doc.htm>

Quote:

> On Gaza and the West Bank, he said:

Mechanical check: found at line 44, starting within the locator (line 44 (UN Meetings Coverage GA/12712, summary of Mr Gonsalves's statement)). Archived text at line 44 of `archive/text/src_20250926_un-press_ga12712.txt`:

> On Gaza and the West Bank, he said: “Surely, the hottest part of hell is reserved for these perpetrators of genocide and those who are complicit in it,” calling for the “tragedy in Palestine” to …

Evidence 2: `src_20250926_un-press_ga12712` (official, United Nations, Meetings Coverage and Press Releases, 2025-09-26), locator **lines 7 and 44**, language `en`.
Wayback: <https://web.archive.org/web/20251230210333id_/https://press.un.org/en/2025/ga12712.doc.htm>

Quote:

> Surely, the hottest part of hell is reserved for these perpetrators of genocide and those who are complicit in it

Mechanical check: found at line 7, starting within the locator (lines 7 and 44). Archived text at line 7 of `archive/text/src_20250926_un-press_ga12712.txt`:

> “Surely, the hottest part of hell is reserved for these perpetrators of genocide and those who are complicit in it,” said Ralph Gonsalves, Prime Minister of Saint Vincent and the Grenadines. He called for the “tragedy in Palestine” to stop — an appeal that was echoed …

### Venezuela (Bolivarian Republic of) (VEN)

#### evt_2023_10_07_VEN_B12

- [ ] Checked (222 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B12, standing |
| Date | 2023-10-07 |
| Speaker or actor | Government of Venezuela / Gouvernement du Venezuela |
| Tier (points) | +10: Relations severed (+10): the Venezuelan delegation announced to the General Assembly on 16 January 2009 (the severance, dated from 7 October 2023 as it predates the window), citing what it called a policy of genocide and crimes against humanity in the Gaza Strip, that the Bolivarian Republic had decided to break diplomatic relations with Israel; the Ministry's communiqué of 11 August 2026 establishes only a mechanism for consular services and no diplomatic relations. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | Venezuela's delegation told the General Assembly that the Government had decided to break diplomatic relations with Israel, citing Israeli actions in the Gaza Strip. |
| Summary (FR) | La délégation du Venezuela a dit à l'Assemblée générale que le gouvernement avait décidé de rompre les relations diplomatiques avec Israël, en invoquant des actions d'Israël dans la bande de Gaza. |
| Second reading | agree, 2026-10-07; the notes mention a flag |

Evidence 1: `src_20090116_un-unispal_es-10-34-verbatim` (official, United Nations General Assembly, via UNISPAL (Question of Palestine), 2009-01-16), locator **line 49 (A/ES-10/PV.34, 16 January 2009, statement of Mr Valero Briceño for the Bolivarian Republic of Venezuela)**, language `en`.
Wayback: <https://web.archive.org/web/20261007022835id_/https://www.un.org/unispal/document/auto-insert-178178/>

Quote:

> In response to the policy of genocide adopted by the Government of Israel against the Palestinian people, and given the crimes against humanity committed by its political and military elite in the Gaza Strip, its repeated use of State terrorism and the refusal of its Government to abide by Security Council resolution 1860 (2009), the Bolivarian Republic of Venezuela, in keeping with the principles of peace and solidarity that guide its foreign policy, has decided to break diplomatic relations with the State of Israel.

Mechanical check: found at line 49, starting within the locator (line 49 (A/ES-10/PV.34, 16 January 2009, statement of Mr Valero Briceño for the Bolivarian Republic of Venezuela)). Archived text at line 49 of `archive/text/src_20090116_un-unispal_es-10-34-verbatim.txt`:

> … in Spanish ): At this important debate, the delegation of the Bolivarian Republic of Venezuela wishes to make an announcement that we consider important. In response to the policy of genocide adopted by the Government of Israel against the Palestinian people, and given the crimes against humanity committed by its political and military elite in the Gaza Strip, its repeated use of State terrorism and the refusal of its Government to abide by Security Council resolution 1860 (2009), the Bolivarian Republic of Venezuela, in keeping with the principles of peace and solidarity that guide its foreign policy, has decided to break diplomatic relations with the State of Israel.

Evidence 2: `src_20260811_mppre-ve_israel-cooperacion-tecnica` (official, Ministerio del Poder Popular para Relaciones Exteriores y Comercio Internacional de Venezuela (mppre.gob.ve), 2026-08-11), locator **line 2 (the Ministry of Foreign Affairs' communiqué of 11 August 2026, with Israel: a consular coordination mechanism only)**, language `es`.
Wayback: <https://web.archive.org/web/20261007023232id_/https://mppre.gob.ve/publicacion/7905-venezuela-e-israel-acuerdan-permitir-la-continuidad-de-la-cooperacion-tecnica-bilateral>

Quote:

> Asimismo, los dos países acuerdan establecer un mecanismo de coordinación que permita la prestación de servicios consulares a sus respectivos ciudadanos residentes en el otro país, según sea necesario.

Translation in the record:

> Likewise, the two countries agree to establish a coordination mechanism that allows the provision of consular services to their respective citizens residing in the other country, as necessary.

Mechanical check: found at line 2, starting within the locator (line 2 (the Ministry of Foreign Affairs' communiqué of 11 August 2026, with Israel: a consular coordination mechanism only)). Archived text at line 2 of `archive/text/src_20260811_mppre-ve_israel-cooperacion-tecnica.txt`:

> Asimismo, los dos países acuerdan establecer un mecanismo de coordinación que permita la prestación de servicios consulares a sus respectivos ciudadanos residentes en el otro país, según sea necesario.

### Viet Nam (VNM)

#### evt_2026_11_13_VNM_B9

- [ ] Checked (223 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2026-11-13 |
| Speaker or actor | President of the Socialist Republic of Viet Nam / Président de la République socialiste du Viet Nam |
| Tier (points) | +2: Calls for a ceasefire (+2): the President's message calls on all parties to uphold the ceasefire in the Gaza Strip and end all acts of hostility, and stresses the protection of civilians, humanitarian personnel and civilian infrastructure in the Gaza Strip and the West Bank; it names no violation and attributes none. |
| Confidence | confirmed |
| Scope | gaza, west-bank |
| Summary (EN) | The President called on all parties to uphold the ceasefire in the Gaza Strip and to protect civilians and humanitarian personnel. |
| Summary (FR) | Le président a appelé toutes les parties à respecter le cessez-le-feu dans la bande de Gaza et à protéger les civils et le personnel humanitaire. |
| Second reading | agree, 2026-11-28 |

Evidence 1: `src_20261113_un-unispal_vnm-to-lam-solidarity-day-message` (official, United Nations, Division for Palestinian Rights (UNISPAL), the delegation's text, 2026-11-13), locator **lines 380 to 389 (Vietnamese original); lines 33 to 34 (the Mission's translation)**, language `vi`.
Wayback: <https://web.archive.org/web/20261128113729id_/https://www.un.org/unispal/wp-content/uploads/2026/11/20261118_1443_HoS_Viet-Nam_President_EN-VI_Message.pdf>

Quote:

> Việt Nam kêu gọi các bên liên quan tuân thủ nghiêm túc thỏa thuận ngừng bắn tại Dải Gaza, chấm dứt các hành động thù địch và hướng tới hòa bình lâu dài.

Translation in the record:

> Viet Nam calls on all parties concerned to uphold the ceasefire in the Gaza Strip, end all acts of hostility and work towards lasting peace.

Mechanical check: found at lines 380–389, starting within the locator (lines 380 to 389 (Vietnamese original); lines 33 to 34 (the Mission's translation)). Archived text at lines 380–389 of `archive/text/src_20261113_un-unispal_vnm-to-lam-solidarity-day-message.txt`:

> Việt Nam kêu gọi các bên liên quan tuân thủ nghiêm túc thỏa thuận ngừng bắn tại Dải Gaza, chấm dứt các hành động thù địch và hướng tới hòa bình lâu dài. Chúng

Evidence 2: `src_20261113_un-unispal_vnm-to-lam-solidarity-day-message` (official, United Nations, Division for Palestinian Rights (UNISPAL), the delegation's text, 2026-11-13), locator **lines 34 to 37 (the Mission's translation)**, language `en`.
Wayback: <https://web.archive.org/web/20261128113729id_/https://www.un.org/unispal/wp-content/uploads/2026/11/20261118_1443_HoS_Viet-Nam_President_EN-VI_Message.pdf>

Quote:

> We stress the need to respect international law, particularly international humanitarian law; to protect civilians, humanitarian personnel and civilian infrastructure in the Gaza Strip and the West Bank;

Mechanical check: found at lines 34–37, starting within the locator (lines 34 to 37 (the Mission's translation)). Archived text at lines 34–37 of `archive/text/src_20261113_un-unispal_vnm-to-lam-solidarity-day-message.txt`:

> Strip, end all acts of hostility and work towards lasting peace. We stress the need to respect international law, particularly international humanitarian law; to protect civilians, humanitarian personnel and civilian infrastructure in the Gaza Strip and the West Bank; and to refrain from actions that undermine the prospects for a two-

Evidence 3: `src_20261113_un-unispal_vnm-to-lam-solidarity-day-message` (official, United Nations, Division for Palestinian Rights (UNISPAL), the delegation's text, 2026-11-13), locator **lines 69 to 73**, language `en`.
Wayback: <https://web.archive.org/web/20261128113729id_/https://www.un.org/unispal/wp-content/uploads/2026/11/20261118_1443_HoS_Viet-Nam_President_EN-VI_Message.pdf>

Quote:

> Ha Noi, 13 November 2026 TO LAM General Secretary of the Central Committee of the Communist Party of Viet Nam President of the Socialist Republic of Viet Nam

Mechanical check: found at lines 69–73, starting within the locator (lines 69 to 73). Archived text at lines 69–73 of `archive/text/src_20261113_un-unispal_vnm-to-lam-solidarity-day-message.txt`:

> Ha Noi, 13 November 2026 TO LAM General Secretary of the Central Committee of the Communist Party of Viet Nam President of the Socialist Republic of Viet Nam

### Yemen (YEM)

#### evt_2025_09_15_YEM_B9

- [ ] Checked (224 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2025-09-15 |
| Speaker or actor | Chairman of the Presidential Leadership Council of the Republic of Yemen / Président du Conseil de direction présidentiel de la République du Yémen |
| Tier (points) | +5: Uses a legal characterisation (+5, flagged): in his address to the emergency Arab-Islamic summit in Doha on the Israeli strike on Qatar, the Chairman of the Presidential Leadership Council says that the continuation of the genocide in Gaza without accountability emboldened the attack on Qatar. Flagged as Lebanon's statement at the same summit (evt_2025_09_15_LBN_B9): a single clause in a speech on Qatar, with no call; the author may read a passing mention as outside B9 (0). |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Chairman of the Presidential Leadership Council told the Arab-Islamic summit in Doha that what he called the genocide in Gaza continued without accountability. |
| Summary (FR) | Le président du Conseil de direction présidentiel a déclaré au sommet arabo-islamique de Doha que ce qu'il a appelé le génocide à Gaza se poursuivait sans reddition de comptes. |
| Second reading | agree, 2026-11-10; the notes mention a flag |

Evidence 1: `src_20250915_presidentalalimi_alimi-doha-summit` (official, Office of the Chairman of the Presidential Leadership Council of the Republic of Yemen (official website), 2025-09-15), locator **line 10**, language `en`.
Wayback: <https://web.archive.org/web/20251012135457id_/https://presidentalalimi.net/en/news1285.html>

Quote:

> The continuation of the genocide in Gaza without accountability, and the ongoing assaults on the countries of the region without deterrence, have ultimately emboldened the Israeli occupation to attack the State of Qatar.

Mechanical check: found at line 10, starting within the locator (line 10). Archived text at line 10 of `archive/text/src_20250915_presidentalalimi_alimi-doha-summit.txt`:

> The continuation of the genocide in Gaza without accountability, and the ongoing assaults on the countries of the region without deterrence, have ultimately emboldened the Israeli occupation to attack the State of Qatar.

### South Africa (ZAF)

#### evt_2026_01_30_ZAF_B12

- [ ] Checked (225 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B12, standing |
| Date | 2026-01-30 |
| Speaker or actor | Department of International Relations and Cooperation / Ministère des Relations internationales et de la Coopération |
| Tier (points) | +8: Downgrade tier (+8) as the nearest: the head of Israel's mission in Pretoria, the chargé d'affaires, was declared persona non grata. Tracked, unscored: the decision cites diplomatic conduct, not Gaza (scope related). |
| Confidence | confirmed |
| Scope | related |
| Summary (EN) | The Department of International Relations and Cooperation declared the chargé d'affaires of the Israeli embassy persona non grata, citing breaches of diplomatic norms. |
| Summary (FR) | Le ministère des Relations internationales et de la Coopération a déclaré persona non grata le chargé d'affaires de l'ambassade d'Israël, en invoquant des manquements aux usages diplomatiques. |
| Second reading | agree, 2026-09-28 |

Evidence 1: `src_20260130_dirco_charge-daffaires-persona-non-grata` (official, Department of International Relations and Cooperation (South Africa), 2026-01-30), locator **line 95**, language `en`.
Wayback: <https://web.archive.org/web/20260928141938id_/https://dirco.gov.za/israeli-charge-daffaires-declared-persona-non-grata/>

Quote:

> The Department of International Relations and Cooperation has informed the Government of the State of Israel of its decision to declare Mr Ariel Seidman, the Chargé d’Affaires of the Israeli Embassy, persona non grata.

Mechanical check: found at line 95, starting within the locator (line 95). Archived text at line 95 of `archive/text/src_20260130_dirco_charge-daffaires-persona-non-grata.txt`:

> The Department of International Relations and Cooperation has informed the Government of the State of Israel of its decision to declare Mr Ariel Seidman, the Chargé d’Affaires of the Israeli Embassy, persona non grata.

#### evt_2023_11_07_ZAF_B9

- [ ] Checked (226 of 227; first 10 %)

| Field | Value |
|---|---|
| Indicator, type | B9, repeatable |
| Date | 2023-11-07 |
| Speaker or actor | Minister of International Relations and Cooperation / Ministre des Relations internationales et de la Coopération |
| Tier (points) | +5: Names specific violations (+5): the targeting of civilians, civilian infrastructure and UN premises and the collective punishment of Palestinians, with a call for an immediate ceasefire. |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | The Minister of International Relations and Cooperation told the National Assembly that civilians and UN premises were being targeted and called for an immediate ceasefire. |
| Summary (FR) | La ministre des Relations internationales et de la Coopération a déclaré à l'Assemblée nationale que des civils et des locaux de l'ONU étaient pris pour cible et a appelé à un cessez-le-feu immédiat. |
| Second reading | agree, 2026-09-28 |

Evidence 1: `src_20231107_dirco_pandor-national-assembly-statement` (official, Department of International Relations and Cooperation (South Africa), 2023-11-07), locator **line 7**, language `en`.
Wayback: <https://web.archive.org/web/20260928142753id_/https://dirco.gov.za/ministerial-statement-on-the-ongoing-israeli-palestinian-conflict-by-dr-gnm-pandor-minister-for-international-relations-and-cooperation-in-the-national-assembly-house-of-parliament-7-november-2023/>

Quote:

> Today we join the world in expressing horror at the war crimes being committed in Palestine through the targeting of civilians, civilian infrastructure, UN premises and other vulnerable targets.

Mechanical check: found at line 7, starting within the locator (line 7). Archived text at line 7 of `archive/text/src_20231107_dirco_pandor-national-assembly-statement.txt`:

> Today we join the world in expressing horror at the war crimes being committed in Palestine through the targeting of civilians, civilian infrastructure, UN premises and other vulnerable targets.

Evidence 2: `src_20231107_dirco_pandor-national-assembly-statement` (official, Department of International Relations and Cooperation (South Africa), 2023-11-07), locator **line 11**, language `en`.
Wayback: <https://web.archive.org/web/20260928142753id_/https://dirco.gov.za/ministerial-statement-on-the-ongoing-israeli-palestinian-conflict-by-dr-gnm-pandor-minister-for-international-relations-and-cooperation-in-the-national-assembly-house-of-parliament-7-november-2023/>

Quote:

> Therefore, as South Africa, we remain steadfast in calling for an immediate, comprehensive ceasefire.

Mechanical check: found at line 11, starting within the locator (line 11). Archived text at line 11 of `archive/text/src_20231107_dirco_pandor-national-assembly-statement.txt`:

> Therefore, as South Africa, we remain steadfast in calling for an immediate, comprehensive ceasefire. The full as well as the opening of all humanitarian corridors to ensure much-needed aid and basic services reach those in need.

Evidence 3: `src_20231107_dirco_pandor-national-assembly-statement` (official, Department of International Relations and Cooperation (South Africa), 2023-11-07), locator **line 20**, language `en`.
Wayback: <https://web.archive.org/web/20260928142753id_/https://dirco.gov.za/ministerial-statement-on-the-ongoing-israeli-palestinian-conflict-by-dr-gnm-pandor-minister-for-international-relations-and-cooperation-in-the-national-assembly-house-of-parliament-7-november-2023/>

Quote:

> The collective punishment Israel is exacting on all Palestinian people is an affront that has gone on for too long.

Mechanical check: found at line 20, starting within the locator (line 20). Archived text at line 20 of `archive/text/src_20231107_dirco_pandor-national-assembly-statement.txt`:

> The collective punishment Israel is exacting on all Palestinian people is an affront that has gone on for too long. The world has expressed horror but has not acted effectively to save Palestinian lives. Sadly, there are many even in our country who chose to turn a blind …

### Zimbabwe (ZWE)

#### evt_2024_12_31_ZWE_D3

- [ ] Checked (227 of 227; country top-up)

| Field | Value |
|---|---|
| Indicator, type | D3, standing |
| Date | 2024-12-31 to 2025-12-31 |
| Speaker or actor | — / — |
| Tier (points) | +8: Increased tier (+8): Zimbabwe's 2024 contribution to UNRWA (USD 500,000) exceeds its 2022 contribution in nominal USD per UNRWA's donor tables (no row in the 2022 table) (docs/02 §2 D3; docs/calibration/README.md R10). |
| Confidence | confirmed |
| Scope | gaza |
| Summary (EN) | Zimbabwe contributed more to UNRWA in 2024 than in 2022, according to UNRWA's donor tables. |
| Summary (FR) | La contribution du Zimbabwe à l'UNRWA pour 2024 a dépassé celle de 2022, selon les tableaux des donateurs de l'UNRWA. |
| Second reading | agree, 2026-11-04 |

Evidence 1: `src_20241231_unrwa_donor-ranking-2024` (dataset, UNRWA, 2024-12-31), locator **line 99**, language `en`.
Wayback: <https://web.archive.org/web/20260521084323id_/https://www.unrwa.org/sites/default/files/overall_donor_ranking_by_pledged_and_received_002.pdf>

Quote:

> Zimbabwe 500,000 500,000 - - 500,000 500,000 - - - - - - - - - - - - - - 500,000 63 500,000 61

Mechanical check: found at line 99, starting within the locator (line 99). Archived text at line 99 of `archive/text/src_20241231_unrwa_donor-ranking-2024.txt`:

> Zimbabwe 500,000 500,000 - - 500,000 500,000 - - - - - - - - - - - - - - 500,000 63 500,000 61

## Totals of the mechanical check

227 events, 502 evidence items: 479 quotes found starting within their line locator, 23 found where the locator is a paragraph, page or other form, 0 found on another line than the locator, 0 not found, 0 archived texts missing.
