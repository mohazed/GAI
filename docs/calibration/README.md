# Calibration: the ten countries and the thresholds (P-15)

The Phase-0 hand-scoring of docs/08 §3 for the ten calibration countries, a critical review of the thresholds of methodology 1.0.0-rc.1, and one proposal for the next version (P-24, before the score is shown in P-22). No methodology file was changed in this session (docs/08 §1).

**Provisional numbers.** First computed on 2026-09-30 (P-15); re-computed on 2026-10-05 on branch `data/phase1` for the same date, 2026-09-30, after the import of the five later General Assembly votes and of the SIPRI release of 9 March 2026 (T-P14, docs/10 B-487). The date is kept so that what moved is the data, not the passage of time. No hand-written event is published yet: the author's review of the 773 events of the 45 countries is still to come (PR #11, `data/phase1`). The 773 events at status `reviewed` are scored as if published, as `pnpm score --preview` does (docs/06 §4 step 7); the one `draft` event (`evt_2025_09_29_USA_B10`, rejected at the second reading, B-205) is left out. Every number here changes when the author publishes, drops or corrects events. P-22 re-runs this worksheet on the published dataset before the flip.

**Reproduce.** `pnpm calibrate --date 2026-09-30 --fts --out calibration.json` on this commit (packages/pipeline/src/calibrate.ts and cli/calibrate.ts, local only; no workflow runs it). It scores the 193 scored entities with the engine of @gai/scoring, checks its baseline against `sensitivitySuite` (the function that writes sensitivity.json), compiles each proposal of §4 on a copy of the methodology in memory, and with `--fts` downloads the nine archived FTS responses fts_funding.csv cites, checks each SHA-256 against its source record, rebuilds the monthly windows (0 differences from the committed table) and rebuilds them again without the flows dated before 2023-10-07. The worksheets `{ISO3}.md` are written from that JSON. Since B-489 the assessment statuses it reports are the ones the build publishes (the hand statuses with those derived from the structured tables laid over them).

## 1. The ten

| Country | Score | Display | Band | A | B | C | D | Passivity | Position of 193 |
|---|---|---|---|---|---|---|---|---|---|
| Spain (ESP) | +85.0 | +85 | Confronting | +22.0 | +45.0 (sum +78.8) | +4.0 | +14.0 | not applied | 1 |
| Türkiye (TUR) | +77.9 | +78 | Confronting | +23.9 | +45.0 (sum +50.8) | 0.0 | +9.0 | not applied | 2 |
| Ireland (IRL) | +68.1 | +68 | Confronting | 0.0 | +45.0 (sum +68.4) | +4.0 | +19.1 | not applied | 5 |
| United Kingdom (GBR) | +59.9 | +60 | Confronting | −8.0 | +45.0 (sum +45.8) | +4.0 | +18.9 | not applied | 7 |
| South Africa (ZAF) | +56.0 | +56 | Confronting | 0.0 | +45.0 (sum +58.8) | 0.0 | +11.0 | not applied | 8 |
| France (FRA) | +53.8 | +54 | Confronting | 0.0 | +40.8 | −1.0 | +14.0 | not applied | 10 |
| Egypt (EGY) | +22.8 | +23 | Acting | 0.0 | +27.8 | −5.0 | 0.0 | not applied | 39 |
| Germany (DEU) | +5.1 | +5 | Acting | −23.4 | +26.5 | −9.0 | +11.0 | not applied | 53 |
| India (IND) | −16.6 | −17 | Passive | −15.0 | +17.4 | −20.0 (sum −30.0) | +1.0 | not applied | 160 |
| United States (USA) | −100.0 | −100 | Sustaining | −45.0 (sum −78.2) | −40.0 (sum −114.4) | −18.0 | −7.0 | not applied | 193 |

Ranking of the ten: 1 Spain, 2 Türkiye, 3 Ireland, 4 United Kingdom, 5 South Africa, 6 France, 7 Egypt, 8 Germany, 9 India, 10 United States. The positions of 193 mix 45 researched countries with 148 whose only events are generated (votes, vetoes, recognitions, FTS funding, Comtrade, SIPRI): they compare the ten with each other, not with the rest of the world.

**What moved since P-15** (display scores on 2026-09-30). The first column is the P-15 computation; the second the same date with the events as they stand after P-16 to P-19 but without the imports; the third adds the imports.

| Country | P-15 | Events of P-16 to P-19 | With the imports | What the imports changed |
|---|---|---|---|---|
| Spain | +85 | +85 | +85 | B1 +14.1 above the category cap: nothing |
| Türkiye | +69 | +69 | +78 | B1 +14.1, B capped at +45 |
| Ireland | +68 | +68 | +68 | B1 +14.1 above the category cap: nothing |
| United Kingdom | +43 | +46 | +60 | B1 +14.1, B capped at +45 |
| South Africa | +53 | +56 | +56 | B1 +14.1, B capped at +45 (+0.4) |
| France | +32 | +40 | +54 | B1 +14.1; Acting → Confronting |
| Egypt | +9 | +9 | +23 | B1 +14.1 |
| Germany | +9 | +16 | +5 | A1 −10.4 and A4 −10 (SIPRI), B1 +9.1 (yes on four votes, abstention on A/RES/80/78) |
| India | −30 | −27 | −17 | B1 +10.3; A4 `no-data` (B-488); Enabling → Passive |
| United States | −100 | −100 | −100 | A1 −38.2 (A capped at −45), B1 −23.6 (no on all five); still at the clip |

The five votes add, per country on this date, +3 × d (yes), −5 × d (no) or −2 × d (abstain or absent), d = 0.774, 0.963, 0.977, 1, 1 (A/RES/ES-10/27, A/DEC/80/506, A/RES/80/1, A/RES/80/78, A/RES/80/116): +14.1 for yes on all five, −23.6 for no on all five, before the category B cap. The SIPRI release gives A1 to Germany (−10.4), Italy (−5.7) and the United States (−38.2) and A4 to eleven buyers of Israeli arms in 2025 (Germany and Romania, the Republic of Korea, Thailand −10; Greece, Latvia, Morocco, Peru, the Philippines, Singapore −5; Lithuania −2); A1 is `none-found` (s = 0) for the 190 other scored entities, A4 `none-found` for 180, and `no-data` for India and Poland, whose 2025 orders SIPRI lists at 0 TIV (B-488).

All 193 on 2026-09-30: Sustaining 2, Enabling 27, Passive 55, Acting 89, Confronting 20 (P-15: 1, 8, 139, 36, 9); the penalty applies to 141, as before. The imports change 180 display scores (median +10, from −24 for Paraguay to +15 for Jordan): 63 states move from Passive to Acting and 21 from Passive to Enabling (their votes), 11 from Acting to Confronting, Hungary from Enabling to Sustaining (−53) and India from Enabling to Passive. At the quarter ends since 2023-10-07 the distribution moved as follows (rc.1, same data):

| Date | Sustaining | Enabling | Passive | Acting | Confronting |
|---|---|---|---|---|---|
| 2023-12-31 | 1 | 12 | 143 | 37 | 0 |
| 2024-06-30 | 1 | 23 | 119 | 43 | 7 |
| 2024-12-31 | 1 | 22 | 50 | 101 | 19 |
| 2025-06-30 | 2 | 23 | 32 | 116 | 20 |
| 2025-12-31 | 9 | 21 | 24 | 109 | 30 |
| 2026-06-30 | 4 | 26 | 35 | 103 | 25 |
| 2026-09-30 | 2 | 27 | 55 | 89 | 20 |

A1 and A4 hold from 2026-03-09 only: no earlier SIPRI release could be imported (SIPRI's database serves its current release), so at the quarter ends before that date A1 and A4 are `no-data` (`no-release`) and contribute nothing.

The worksheets: [USA](USA.md), [DEU](DEU.md), [GBR](GBR.md), [FRA](FRA.md), [ESP](ESP.md), [IRL](IRL.md), [ZAF](ZAF.md), [TUR](TUR.md), [EGY](EGY.md), [IND](IND.md). Each has the worksheet table of docs/08 §3, the score by category, the band, the three reading slots left blank, the three largest contributions, the effect of each proposal and the sensitivity rows.

## 2. Sensitivity (docs/02 §10)

The five tables of sensitivity.json computed on the same preview dataset (193 entities; Spearman's ρ against the default ranking; countries whose display score changes):

| Variant | ρ | Changed | Ten: notable moves |
|---|---|---|---|
| passivity 5 | 0.9844 | 141 | none of the ten is penalised; Germany position 53 → 134 |
| passivity 25 | 0.9946 | 141 | India 160 → 141, Germany 53 → 45 |
| weight A 0.5 / 1.5 | 0.9981 / 0.9873 | 30 / 29 | Germany Passive at 1.5 (−7), +17 at 0.5; India Enabling at 1.5 (−24) |
| weight B 0.5 / 1.5 | 0.9925 / 0.9986 | 190 / 187 | at 0.5 the United Kingdom (+37), France (+33) and South Africa (+34) Acting, Germany Passive (−8), India Enabling (−25); Egypt +37 at 1.5 |
| weight C 0.5 / 1.5 | 0.9946 / 0.9936 | 29 / 29 | India −7 at 0.5, Enabling at 1.5 (−27) |
| weight D 0.5 / 1.5 | 0.9970 / 0.9995 | 53 / 45 | Germany Passive at 0.5 (0) |
| reported 0.2 / 0.6 | 1.0000 / 1.0000 | 2 / 2 | Germany +7 / +3 (its C2 is `reported`) |
| statements excluded (B9, B10 at 0) | 0.9846 | 33 | Germany Passive (−4); Türkiye +59 |
| decay off | 0.9432 | 183 | Germany Passive (−5, position 148); Egypt Confronting (+45); France +68; India −5 |

Decay is still the parameter the ranking depends on most: switching it off changes 183 display scores and brings ρ to 0.943 (0.912 with the same events before the imports, 0.907 at P-15): the B1 votes of 2023 and 2024 and the statements of 2023 expire after two years by default, and the five votes of 2025, all within the last 16 months, now weigh on both sides. The category weights move more than at P-15, mostly through B, where the twelve votes sit: weight B 0.5 brings three of the ten from Confronting to Acting. For comparison, the sensitivity.json of `pnpm build:data --date 2026-09-30` (published events only, which are all generated) gives ρ 0.9702 and 0.9917 for passivity 5 and 25 (149 penalised), and 0.9172 for decay off.

## 3. Critical review of the thresholds

Which rules produced a result that surprised on reading the ten and the 193, and what would change it. Each change is measured in §4 and §5; the ones recommended are gathered in §7.

1. **A state that only votes yes lands in Acting for months (B-23).** B1 votes do not lift the penalty, but they are summed without a cap, so enough recent yes votes outweigh it. A hypothetical state that votes yes on all twelve qualifying votes and does nothing else scores up to +12.6 (display +13, Acting) at the end of 2025 and is Acting at 24 month ends, from December 2024 to November 2026 (+2.8 on 2026-09-30). With all twelve votes imported this is no longer hypothetical: of the 108 states whose only events are B1 votes or events of zero points, 41 are Acting on 2026-09-30, 42 Passive and 25 Enabling, and the penalty applies to 141 states while 89 are Acting; Armenia, the Bahamas, Barbados, Malta, Portugal and Trinidad and Tobago are penalised and Acting at +11 or +12. The number of Acting states goes from 37–43 (to September 2024) to 101–116 (December 2024 to December 2025). Spec §2 describes such a state as Passive. Proposed: an indicator cap on B1 of −15…+15, equal to the penalty, so that votes alone never outweigh it (minor version); measured today it changes 107 display scores and 54 bands, all of them states whose record is mostly votes. Symmetric, so that yes and no votes are treated alike (docs/02 §13); the one-sided cap +15 was measured too (§4).
2. **A negative act lifts the passivity penalty (B-46, also B-24, B-403 (7), B-431 (1)).** The qualifying rule counts contributions of absolute value 2 or more, so an agreement signed with Israel (C2 −10) or trade as usual (C3 −5) ends the −15 for inaction: Russia's only qualifying event is C3 −5 on its 2025 trade and it scores +25 (Acting); Azerbaijan's two C2 memoranda (−20) leave it at −2 instead of −17; Argentina's two C2 instruments and its C3 spare it the penalty (−48, Enabling, instead of −63, Sustaining), and Morocco's C3 and C2 keep it at +5 (Acting) instead of −10. Adding a negative act raises these scores. Proposed: only contributions of +2 or more qualify (minor).
3. **Pre-war data at the start of the window (P-04 choices B-60, B-63).** Until each reporter's 2023 figures appear (February to May 2024), A2 and C3 hold values of the calendar year 2022: C3's ratio to 2022 is then 1 by construction, so "trade as usual" applies to everyone with trade, and A2 counts 2022 exports. On 2023-12-31 this is 40 display scores, 10 bands and 2 passivity decisions; the United States −79 would be −46 and Spain +14 would be +27. D1's value of October 2023 rests entirely on funding of October 2022 to September 2023, and flows dated before 7 October 2023 count in windows to September 2024 (details in §5). Proposed: no computed value rests on data from before 2023-10-07: A2 and C3 values of data year 2022 are not in force in the window, and D1 counts FTS flows dated on or after 2023-10-07 (minor; history only, no effect on 2026-09-30).
4. **Caps that bind.** The category cap B binds for Spain (+78.8 → +45), Ireland (+68.4 → +45), South Africa (+58.8 → +45), Türkiye (+50.8 → +45), the United Kingdom (+45.8 → +45) and the United States (−114.4 → −40); A for the United States (−78.2 → −45); C for India (−30 → −20, three C2 instruments); B9's +10 for the United Kingdom, France, Spain, Ireland, South Africa, Türkiye and Egypt; and the score clip for the United States (raw −110 → −100). They work as designed (statements below deeds, D-13; no category decides alone), but with the twelve votes B reaches its cap for five of the ten, so a further positive act in B no longer moves them. The United States sits at the clip with or without any single indicator, which makes it the one country whose position cannot respond to a change; that is a property of the scale, not a proposal.
5. **Category A with the SIPRI release.** Germany gets A1 −10.4 (36 of 537 TIV delivered to Israel in 2025) and A4 −10 (281 TIV of orders in 2025) from 9 March 2026; with the five votes (+9.1) it moves from +16 to +5 and stays Acting. The United States' A1 −38.2 adds to an A already beyond its cap. A4 reads only the release's data year (orders placed in 2025): the 2023 orders (Germany's 5,400 TIV among them) are excluded by `orders_signed_from` (B-10), and the 2024 orders (the United States 288 TIV, Slovakia 282, Austria 165, Azerbaijan 121.8) would have counted only under the release of 2025, which could not be imported, so they never score. SIPRI writes 0 for the TIV of an order whose number is not yet known (India's Heron-2 and PULS of 2025, Germany's Arrow-3 of 2025): such an order adds nothing, and a country with only such orders is `no-data` on A4 (B-488). No threshold change is proposed; the author and the reviewers should know that A4 is a one-year window on the latest release.
6. **Egypt at +23 (Acting) rests on votes and statements.** B1 (+17.8, all twelve votes yes) and B9 (capped at +10), less C3 −5; category D is 0 because Egypt's aid does not appear as government funding in FTS and D4 found no qualifying programme on the sources read (B-244 (4)). The limitation of D1 to FTS is stated on the methodology page (docs/02 §5); no threshold change is proposed, but the author and the readers of §3 of docs/08 should see it.
7. **D1 moves between tiers from month to month.** 67 donors had a D1 value in the window; their points changed 274 times in 36 months (median 4 per donor; the United Kingdom and Poland 10 times, Germany 8). A quarterly value would change 219 times in 12 quarters, so it smooths nothing per step; the monthly rule is kept (§5).

## 4. The methodology defaults under review

Measured on 2026-09-30 over the 193 entities, and at the twelve quarter ends from 2023-12-31 (history). "Changed" counts display scores; ρ compares with rc.1.

| Default | Today: changed, bands, passivity, ρ | History (largest quarter end) | The ten today | Recommendation |
|---|---|---|---|---|
| B-21: `official-video` and `parliamentary` sources make an event `confirmed` | 2, 1, 0, 0.9973 (raises `evt_2025_08_29_TUR_A8` and `evt_2026_01_11_DEU_C2`) | 2 changes, 1 band (2026-06-30) | Germany +5 → −1 (Passive), Türkiye +78 → +81 | Adopt: a parliamentary answer or an official video is the government's own record, as good as its press release. |
| B-22, B-51: "most severe" for A3, A6, A7, B3, B7, D2 instead of sum | 0 | 0 | none | Adopt: no country has two such states holding at the dates measured, so nothing moves today; the rule prevents one state recorded twice from counting twice. |
| B-23: B1 capped at +15 (one-sided) | 98, 53, 0, 0.9960 | 127 changes, 87 bands (2025-12-31) | the United Kingdom +60 → +58, France +54 → +51, Egypt +23 → +20 | Reject in favour of the symmetric cap. |
| B-23: B1 capped at −15…+15 | 107, 54, 0, 0.9959 | 150 changes, 95 bands (2025-12-31) | as the one-sided cap; on 2025-12-31 France +59 → +46, Egypt +33 → +20, the United Kingdom +59 → +57, India −6 → −10 | Adopt: a yes-only state never exceeds 0 (Passive, spec §2); no state loses more than the penalty to votes alone. |
| B-24: a −5 denial ends the penalty; standing states older than 365 days never qualify | settled by B-46 and B-48 | | | Settled: B-46 for the first half, B-48 (kept) for the second. |
| B-46: only contributions of +2 or more qualify | 4, 2, 4, 0.9912 (Argentina Enabling −48 → Sustaining −63; Morocco Acting +5 → Passive −10; the penalty also applies to Azerbaijan, −2 → −17, and Russia, +25 → +10) | 4 changes, 2 bands (2023-12-31 and 2026-09-30) | none | Adopt: adding a negative act must never raise a score. |
| B-47: the pre-existing B8 tier (+3) does not qualify | 0 | 1 change, 1 band (2024-06-30: India −18 → −33, Enabling, penalised) | none | Adopt: needed before any further pre-existing recognition is added (see below), otherwise about 100 states escape the penalty for the first year (106 bands on 2024-06-30) and drop 15 points on 2024-10-06. |
| B-48: open-ended states qualify only 365 days from their start (kept) | alternative measured: 9, 0, 9, 0.9991 (the penalty lifted for Armenia, the Bahamas, Bolivia, Barbados, Jamaica, Monaco, Malta, Portugal, Trinidad and Tobago, all already Acting through their votes) | 9 changes | none | Keep: the penalty measures recent engagement; a recognition of 2024 would otherwise lift it for good. |
| B-54: the short labels of generated text move from `labels.ts` to `indicators.yaml` `short` | 0 (wording) | 0 | none | Adopt (wording). |
| Pre-existing recognitions from the registry (A/78/846) as B8 +3 (B-199 (3)) | 122, 24, 0, 0.9930 | without B-47: 93–106 bands at the quarter ends from 2023-12-31 to 2024-09-30; with B-47: 2–24 | Egypt +23 → +26 | Keep them leads (B-199 (3)): the letter A/78/846 is not the recognising governments' own document. Rows are added one by one when a state's own record is archived (India and South Africa added in P-16, B-448; Türkiye, Algeria, Indonesia, Russia and eight others before); with B-47 each adds +3 and nothing else. |

Effect on the sensitivity tables: Spearman's ρ of the rows that move, each computed against the variant's own default ranking (the fifteen rows are in the JSON; the other eleven move by the amount in the last column at most).

| Default | passivity 5 | passivity 25 | statements excluded | decay off | Largest other move |
|---|---|---|---|---|---|
| rc.1 | 0.9844 | 0.9946 | 0.9846 | 0.9432 | |
| B-21 | 0.9888 | 0.9918 | 0.9887 | 0.9496 | weight A 1.5 +0.0048 |
| B-22, B-51 | 0.9844 | 0.9946 | 0.9846 | 0.9432 | none |
| B-23 (−15…+15) | 0.9812 | 0.9935 | 0.9827 | 0.9301 | weight A 1.5 −0.0017 |
| B-46 | 0.9909 | 0.9995 | 0.9771 | 0.9429 | weight C 0.5 +0.0044 |
| B-47 | 0.9844 | 0.9946 | 0.9846 | 0.9432 | none |
| B-48 alternative | 0.9852 | 0.9952 | 0.9914 | 0.9520 | weight A 1.5 +0.0005 |
| Pre-existing B8 rows | 0.9829 | 0.9920 | 0.9924 | 0.9466 | weight A 1.5 +0.0030 |
| 2022 trade values out | 0.9844 | 0.9946 | 0.9846 | 0.9432 | none |
| D1 from post-war flows | 0.9844 | 0.9946 | 0.9846 | 0.9432 | none |
| The set of §7 | 0.9927 | 0.9959 | 0.9794 | 0.9313 | weight A 1.5 +0.0057 |

B-46 makes the penalty's size matter less (it falls only on states without a positive act, which already rank low) and statements matter more (more states escape the penalty only through a statement). The B1 cap no longer makes decay matter less, as it did at P-15: with the five votes of 2025 in force, capping B1 takes away the part of the ranking that decay does not touch yet, and ρ for decay off falls from 0.943 to 0.930.

## 5. The implementation choices of P-04, with numbers

- **D1 month to month (B-53).** 67 donors; 274 tier changes in 36 months (median 4). The ten: the United States 3 (+1, +3 from March 2024, +6 from November 2024, +3 from November 2025); Germany 8 (+3 and +6 alternating from June 2024); the United Kingdom 10; France 6; Spain 5; Ireland 4 (+9 since January 2026); South Africa 3; Türkiye 5; India 1 (+1 since July 2026); Egypt none (no FTS flow). Each change moves the score by up to 6 points (Ireland +3 → +9) and can switch the penalty (+1 does not qualify, +3 does). A quarterly value would change 219 times in 12 quarters: kept monthly.
- **FTS flows dated before 7 October 2023 (B-60).** 67 attributed government flows, USD 204,070,341, from 20 donors (the United States 84.9 million, Germany 63.6 million, the United Arab Emirates 15.0 million, Switzerland 14.8 million, Belgium 4.6 million, Norway 4.0 million, France 3.3 million and 13 others). They change D1 in 49 country-months of 19 countries, the last in July 2024: the October 2023 value of 19 donors (a window wholly before the war; the United Arab Emirates +6 → 0), and later months for Belgium (+6 → +3, March–June 2024), Iceland, Luxembourg, Norway and the United States (+3 → +1, March–July 2024). At the quarter ends, 5 display scores on 2023-12-31, 3 on 2024-03-31 and 2 on 2024-06-30 (1 band); the United States −95 → −97 and −85 → −87. Proposed in §7 (D1 from post-war flows).
- **The GNI year when the World Bank's latest is old (B-62).** Of the countries with an old GNI year, only Liechtenstein (2009) and San Marino (2023) have FTS funding: Liechtenstein's best month is x = 0.0060 % (+9); a GNI more than 19.2 % above the 2009 figure would put it at +6. San Marino's best is 0.0024 % (+6); a GNI more than 20.9 % above the 2023 figure would put it at +3. Cuba (2019), Eritrea (2011), South Sudan (2015), Syria (2022) and Yemen (2018) have no government flow to the appeals, so the choice changes nothing for them. Kept; the wording patch states it.
- **A4 without the orders of 2023 (B-10).** Measured with the release of 9 March 2026, whose trade register (372 order lines with a year marked uncertain by SIPRI) is read by data year: under that release A4 counts the orders of 2025 only, so the rule on 2023 changes nothing on 2026-09-30. It would matter only under the release of 2024 (data year 2023), which is not imported: the 2023 orders of universe states total 6,103 TIV, with Germany's 5,400 (two Arrow-3 orders), the Netherlands 184, Morocco 127, Singapore 125 and Greece 103 among them, all excluded by `orders_signed_from` as SIPRI dates orders by year only.
- **A2 and C3 on calendar-year data (B-63).** Each value holds from the reporter's first release of the year's data to the next. The 2022 values (wholly pre-war) are in force from 2023-10-07 to: the United States 2024-02-11 (A2 −25, C3 −8), Germany 2024-02-21 (−3, −5), the United Kingdom 2024-03-06 (−3, −5), France 2024-05-21 (0, −5), Spain 2024-05-02 (−8, −5), Ireland 2024-04-12 (C3 −5), South Africa 2024-02-06 (C3 −3; A2 0 to 2024-03-08), Türkiye 2024-02-06 (−3, −5), Egypt 2024-03-21 (C3 −5), India 2024-05-30 (−15, −8). The 2023 values (86 of 365 days after 7 October) then hold until early 2025. Measured with the 2022 values out: see §3 item 3. Proposed in §7 for 2022; the 2023 values stay (the only annual figure that covers the start of the window).

## 6. Readings the country sessions referred to P-15

Decided for every country at once, with the recommended defaults. "P-16" means the quality pass applies the decision to the draft events (fixed in place, no correction entry while unpublished); "wording" means the P-24 proposal writes it into the methodology text; "reviewers" means it is one of the points put to the methodology reviewers (docs/08 §2).

| # | Question (docs/10) | Decision | Follow-up |
|---|---|---|---|
| R1 | Parliamentary and official-video sources for `confirmed` (B-21; B-211 (1), B-239 (4)) | Adopt B-21. | P-24 (minor) |
| R2 | B5/B6 on a statement the foreign ministry issues in its own name (B-219 (2), B-411 (2), B-421 (2)) | Accept as the foreign minister's formal position, for B5 and B6 alike; France's B6 stays; Indonesia's and Algeria's statements are archived and filed as B5 if their text states a position on executing the warrants. | P-16; wording |
| R3 | B9/B10 speakers: heads of state who are not heads of government, vice-presidents (B-386 (4), B-390 (2), B-426 (3)) | The head of state, the head of government and the foreign minister (the three who represent the state without full powers, Vienna Convention on the Law of Treaties art. 7 (2) (a)); not vice-presidents or deputies. Egypt's President stays; the statements of the President of the United Arab Emirates and the King of Saudi Arabia may be filed when archived (late 2023, history only). | P-24 (minor: B9's name); P-16 |
| R4 | Third-person readouts as B9 evidence (B-249 (3), B-431 (2)) | Not accepted: B9 needs the exact words. | none |
| R5 | A foreign government's transcript as the verbatim record (B-396 (2)) | Accepted when it is the only verbatim record. | wording |
| R6 | Naming a violation without naming who commits it (B-411 (4), B-421 (3)) | +5 as filed: docs/02 asks that the statement name specific violations, not an actor. | none |
| R7 | Scope (B-32): a document citing Gaza (B-215 (1), B-265 (1), B-270 (2)); "the Palestinians" or "the Palestinian people" without Gaza (B-234 (2), B-375 (2), B-380 (2)) | Keep B-32 literally for B9 and B10 alike: the document must cite Gaza. | wording |
| R8 | EU settler and minister listings adopted by unanimity without a recorded national vote (B-229 (3), B-252 (9), B-283 (5)) | Count them for every EU member on the date of the Council decision (unanimity is each member's assent; a recorded constructive abstention would exclude a member), scope by B-32 (the July 2024 listing citing obstruction of aid to Gaza is `gaza`). | P-16 (27 members); wording |
| R9 | C1: suspended FTA negotiations (B-215 (2)); a full trade halt without an FTA act (B-239 (5)); "open to the review" (B-301 (4)) | Suspending the negotiation of an agreement is the review tier; a trade halt is A7, not also C1; stated openness is not support. As filed. | wording |
| R10 | D2/D3: "no new payment planned" (B-219 (1)); D3 without a prior D2 (B-223 (1)); pledges or receipts (B-239 (3)); an ended core contribution (B-286 (1)); a stated hold pending the UN investigations (B-296 (3), Denmark and Switzerland) | A publicly stated hold or stop of UNRWA payments is D2 from its announcement to the resumption; "restored" needs a prior D2, "increased" does not (from the year the contribution exceeds 2022); pledges, per UNRWA's donor tables. Switzerland's hold, and Denmark's if its record is the same, are filed as D2 with their D3. | P-16; wording |
| R11 | D4 programmes that continue after two years (B-223 (3)) | Keep repeatable per docs/02 §3; a new documented phase is a new event. A standing D4 is a candidate for a later version. | none |
| R12 | A2 against licence registers, own report against mirror, HS 8526/8802 (B-211 (2), B-219 (3), B-229 (4), B-244 (3), B-249 (4), B-255 (4), B-260 (5), B-265 (5), B-270 (4), B-286 (4)) | Keep docs/02 §5 (own report first, HS 93 and 8710 in full, 8526/8802 only with a confirmation). | reviewers (arms-trade data) |
| R13 | A3 after a court halt, and on a ministry's programme statement (B-260 (4), B-270 (3)) | Keep the rule as written. | reviewers |
| R14 | A6/A7: a general trade halt by decision (B-239 (1)); a non-military export ban (B-360 (1)); a refusal policy that predates the window (B-281 (1)); Israel-specific dual-use criteria (B-296 (4)); an arms-fair exclusion (B-365 (3)) | A7 covers a general two-way trade embargo decided by the government; A6 covers a government suspension of a class of exports to Israel, military or not, as filed for Türkiye and Colombia; a pre-window policy is not an act in the window (no pre-existing tier for A6); dual-use criteria and fair exclusions are not A6 in v1.0. | wording; reviewers |
| R15 | A recurring multinational exercise Israel joins (B-406 (3)) | Not an A5 instance: routine recurring exercises are pre-existing arrangements (docs/02 §2 A5). | none |
| R16 | B3 for the applicant of case 192 (B-234 (1)) | Yes: the application is the fullest form of the act B3 rewards. | wording |
| R17 | B12's downgrade tier: military attachés withdrawn (B-365 (1)) | Not a downgrade: the tier is a lower level of diplomatic representation. | wording |
| R18 | C2's reach and counting unit (B-249 (2), B-307 (4), B-313 (1), B-319 (2), B-329 (1), B-375 (1), B-380 (1), (3), B-406 (1)) | Any signed governmental instrument of trade, investment or cooperation with Israel (agreement, memorandum, joint declaration setting up a cooperation mechanism), one event per instrument, summed within the category cap; not a restoration of relations, an implementing arrangement of a pre-war convention, or an unsigned statement. As filed. | wording |
| R19 | KLP, ABP, PFZW as public pension funds (B-281 (4)) | Public means established by law or owned by the state: none of the three. | none |
| R20 | A port ban on Israeli shipping (B-416 (4)) | Not scored in v1.0; a candidate for a later version (A8 is arms transit). | none |
| R21 | Pre-2023 recognitions (B-199 (3), B-234 (3), B-416 (1), B-431 (4)) | Leads until the state's own document is archived; with B-47, each row adds +3 and does not touch the penalty. | P-16 |
| R22 | B6 description "effective 2 June 2026" (B-319 (5)) | Correct the wording. | wording |

## 7. The proposal for P-24

One proposal, **1.0.0-rc.2**, to be made with P-24 before P-22 (the score flag stays off until then). Scores are not displayed yet (D-16), so the calibration changes are recorded as the next release candidate of 1.0.0, as docs/08 §3 asks ("record the adjustment in the changelog of v1.0.0-rc"), with a CHANGELOG entry and a `diff.json` from 1.0.0-rc.1 to 1.0.0-rc.2 (every country whose display score moves by 1 or more, with the cause), a pull request and the 14-day window of docs/08 §1. How the folder carries it is for P-24 (see docs/10 B-438).

Rule changes (minor level):

1. `confirmed` accepts `official-video` and `parliamentary` sources (B-21).
2. A3, A6, A7, B3, B7 and D2 stack by "most severe" (B-22, B-51).
3. B1 has an indicator cap of −15…+15 (B-23).
4. A qualifying event against passivity contributes +2 or more (B-46).
5. The pre-existing B8 tier does not qualify (B-47).
6. A2 and C3 values of data year 2022 are not in force in the window (P-04, B-63).
7. D1 counts FTS flows dated on or after 2023-10-07 (P-04, B-60); `fetch:fts` builds the windows so.
8. B9 and B10 speakers are the head of state, the head of government and the foreign minister (R3).

Wording (patch level, carried in the same version): the short labels in `indicators.yaml` (B-54); D1's name, "share of GNI" instead of "per capita of GNI" (B-33); A2 and C3 on calendar-year annual data from each reporter's first release (B-151 (2)); A4 without the orders dated 2023 (B-151 (3)); D1's GNI, the latest year not after the window (B-151 (4)); FTS's "Governments" (B-151 (5)); a standing state qualifies for 365 days from its start (B-151 (6), B-48); derived coverage statuses carry a reason, not a date (B-151 (7)); "most severe" chosen by points, B5/B6 on one day by id (B-151 (8), B-38); deviations 7 and 8 of docs/00 in the deviations list (B-151 (9)); states before 7 October 2023 counted from that day (B-44); the A1 coverage reading (B-73); coverage published for the build date only (B-70); the readings R2, R5, R7–R10, R14, R16–R18 and R22 of §6. Once methodology.{en,fr}.md says them, P-24 removes the matching bullets from `apps/web/content/readings.{en,fr}.md` and `computed.{en,fr}.md`.

Effect of the whole set on 2026-09-30 (re-computed after the imports, T-P14): 109 display scores, 57 bands, 4 passivity decisions, ρ 0.9835 (at P-15, before the imports: 9 display scores, 4 bands); among the ten, Germany +5 → −1 (Passive), the United Kingdom +60 → +58, France +54 → +51, Türkiye +78 → +81, Egypt +23 → +20. In the history: 41 display scores and 7 bands on 2023-12-31 (the pre-war data and the negative acts), 151 and 95 on 2025-12-31 (the B1 cap), 109 and 57 today. With all twelve votes imported the B1 cap is now the largest change of the set: most of the 57 bands are states that move from Acting to Passive because their record is votes alone. Rejected: B-23's one-sided cap, B-48's alternative, the pre-existing recognitions from A/78/846, a quarterly D1.

## 8. Structured tables when this was computed

- **B1:** all 12 qualifying votes, 2,316 rows (12 × 193). The seven votes to A/RES/79/232 of December 2024 come from the archived UN Digital Library file of March 2025 (B-186); the five later votes (A/RES/ES-10/27, A/DEC/80/506, A/RES/80/1, A/RES/80/78, A/RES/80/116) from the author's MARCXML exports, archived at their commit-pinned repository URL and imported from the bytes Wayback serves (B-903, B-487). Per-vote totals equal votes.yaml and the UN press releases; the named "no" and "abstention" lists of the press releases equal the rows.
- **A1 and A4:** the SIPRI release of 9 March 2026 (B-487): 12 delivery rows (Germany, Italy and the United States, 2022–2025) and 524 order rows (recipient-years; Taiwan and 16 orders of unknown recipients skipped, B-904). A1 and A4 hold from 2026-03-09; no earlier release could be imported, so the quarter ends before that date have no A1 or A4 (§1).
- **B8:** 32 rows in recognitions.csv. Of the ten, Egypt is `unchecked` on B8: the pre-existing tier, once its own document is archived (R21), adds +3 from 2023-10-07 (+23 → +26 on this date, no band change).
- **A2 and C3:** Comtrade rows for 40 of the 45 researched countries (C3; A2 for 37): Saudi Arabia, the United Arab Emirates, Qatar, Algeria and Azerbaijan have no row (B-437). None of the ten is affected.
- **D1:** complete to August 2026 (fts_funding.csv, 2,448 rows).

## 9. Re-running

After the author publishes the events (and after each import), `pnpm calibrate --date {date} --fts` on the published data with `--statuses` left at its default re-computes every number here; the worksheets are regenerated from its JSON and the reading slots already filled are kept. P-22 does this before the flip, and P-24 uses the same command to write `diff.json` for 1.0.0-rc.2.
