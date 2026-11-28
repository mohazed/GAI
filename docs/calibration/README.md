# Calibration: the ten countries and the thresholds (P-15)

The Phase-0 hand-scoring of docs/08 §3 for the ten calibration countries, a critical review of the thresholds of methodology 1.0.0-rc.1, and one proposal for the next version (P-24, before the score is shown in P-22). No methodology file was changed by this file (docs/08 §1).

**Provisional numbers.** First computed on 2026-09-30 (P-15); re-computed on 2026-10-05 for the same date after the import of the five later General Assembly votes and of the SIPRI release of 9 March 2026 (T-P14, docs/10 B-487); **re-computed on 2026-11-28** on branch `data/phase1` at `63b4c8b` by task T-H-PREP of the launch-plan run (docs/10 B-2224), for the date 2026-11-28, after the finish plan, the P-23 pre-launch pass and the launch-plan run (events filed to 2026-11-28, B8 rows from A/78/846 added by default, FTS to October 2026). No hand-written event is published yet: the author's review is still to come (PR #11, `data/phase1`). The 1,515 events at status `reviewed` are scored as if published, as `pnpm score --preview` does (docs/06 §4 step 7); the one `draft` event (`evt_2025_09_29_USA_B10`, rejected at the second reading, B-205) is left out. Every number here changes when the author publishes, drops or corrects events. P-22 re-runs this worksheet on the published dataset before the flip. Sections 1, 2, 4 and 8 and the ten worksheets carry the numbers of 2026-11-28; sections 3, 5, 6 and 7 keep the reasoning and the numbers of 2026-10-05, each with a dated update where the numbers moved.

**Reproduce.** `pnpm calibrate --date 2026-11-28 --fts --out calibration.json` on this commit (packages/pipeline/src/calibrate.ts and cli/calibrate.ts, local only; no workflow runs it). It scores the 193 scored entities with the engine of @gai/scoring, checks its baseline against `sensitivitySuite` (the function that writes sensitivity.json), compiles each proposal of §4 on a copy of the methodology in memory, and with `--fts` downloads the archived FTS responses fts_funding.csv cites (nine on 2026-11-28), checks each SHA-256 against its source record, rebuilds the monthly windows (0 differences from the committed table) and rebuilds them again without the flows dated before 2023-10-07. The worksheets `{ISO3}.md` are written from that JSON, field by field, keeping the reading slots (all 30 still blank on 2026-11-28) and each worksheet's last section. Since B-489 the assessment statuses it reports are the ones the build publishes (the hand statuses with those derived from the structured tables laid over them).

## 1. The ten

| Country | Score | Display | Band | A | B | C | D | Passivity | Position of 193 |
|---|---|---|---|---|---|---|---|---|---|
| Spain (ESP) | +82.0 | +82 | Confronting | +22.0 | +45.0 (sum +76.6) | +4.0 | +11.0 | not applied | 1 |
| Türkiye (TUR) | +69.6 | +70 | Confronting | +23.6 | +45.0 (sum +48.6) | 0.0 | +1.0 | not applied | 3 |
| Ireland (IRL) | +67.5 | +67 | Confronting | 0.0 | +45.0 (sum +69.2) | +4.0 | +18.5 | not applied | 4 |
| South Africa (ZAF) | +56.0 | +56 | Confronting | 0.0 | +45.0 (sum +56.6) | 0.0 | +11.0 | not applied | 8 |
| United Kingdom (GBR) | +54.9 | +55 | Confronting | −8.0 | +43.6 | +4.0 | +15.3 | not applied | 10 |
| France (FRA) | +51.6 | +52 | Confronting | 0.0 | +38.6 | −1.0 | +14.0 | not applied | 14 |
| Egypt (EGY) | +23.6 | +24 | Acting | 0.0 | +28.6 | −5.0 | 0.0 | not applied | 61 |
| India (IND) | −9.4 | −9 | Passive | −15.0 | +16.6 | −20.0 (sum −30.0) | +9.0 | not applied | 152 |
| Germany (DEU) | −21.8 | −22 | Enabling | −38.4 | +14.6 | −9.0 | +11.0 | not applied | 166 |
| United States (USA) | −100.0 | −100 | Sustaining | −45.0 (sum −78.2) | −40.0 (sum −97.0) | −18.0 | −7.0 | not applied | 193 |

Ranking of the ten: 1 Spain, 2 Türkiye, 3 Ireland, 4 South Africa, 5 United Kingdom, 6 France, 7 Egypt, 8 India, 9 Germany, 10 United States. The positions of 193 mix 45 countries researched with the full protocol and 148 researched with the light protocol (103 of which have hand-researched events): they compare the ten with each other more safely than with the rest of the world.

**What moved since the run of 2026-10-05** (display score on 2026-09-30 in that run, against 2026-11-28 now). Both the date and the data moved: decay lowers the B1 votes of 2024 and the statements of 2024 and 2025, a vote or statement older than two years leaves the score, D1 reads the twelve months to October 2026, and the events filed between 2026-10-05 and 2026-11-28 (the finish plan, the P-23 pass and this run) are in. The change of each category subtotal (clipped) is shown; the worksheets list the events in force.

| Country | 2026-09-30 (run of 2026-10-05) | 2026-11-28 | A | B | C | D |
|---|---|---|---|---|---|---|
| Spain | +85 Confronting | +82 Confronting | 0 | 0 | 0 | −3.0 |
| Türkiye | +78 Confronting | +70 Confronting | −0.3 | 0 | 0 | −8.0 |
| Ireland | +68 Confronting | +67 Confronting | 0 | 0 | 0 | −0.6 |
| South Africa | +56 Confronting | +56 Confronting | 0 | 0 | 0 | 0 |
| United Kingdom | +60 Confronting | +55 Confronting | 0 | −1.4 | 0 | −3.6 |
| France | +54 Confronting | +52 Confronting | 0 | −2.2 | 0 | 0 |
| Egypt | +23 Acting | +24 Acting | 0 | +0.8 | 0 | 0 |
| India | −17 Passive | −9 Passive | 0 | −0.8 | 0 | +8.0 |
| Germany | +5 Acting | −22 Enabling | −15.0 | −11.9 | 0 | 0 |
| United States | −100 Sustaining | −100 Sustaining | 0 | 0 | 0 | 0 |

All 193 on 2026-11-28: Sustaining 4, Enabling 24, Passive 38, Acting 99, Confronting 28 (on 2026-09-30 in the run of 2026-10-05: 2, 27, 55, 89, 20); the penalty applies to 78 (141 then). At the quarter ends since 2023-10-07 and on the date the distribution is as follows (rc.1, the same data):

| Date | Sustaining | Enabling | Passive | Acting | Confronting |
|---|---|---|---|---|---|
| 2023-12-31 | 1 | 11 | 78 | 103 | 0 |
| 2024-03-31 | 1 | 13 | 79 | 99 | 1 |
| 2024-06-30 | 1 | 18 | 59 | 109 | 6 |
| 2024-09-30 | 1 | 15 | 59 | 106 | 12 |
| 2024-12-31 | 1 | 18 | 34 | 113 | 27 |
| 2025-03-31 | 1 | 23 | 31 | 113 | 25 |
| 2025-06-30 | 2 | 25 | 23 | 113 | 30 |
| 2025-09-30 | 7 | 19 | 19 | 101 | 47 |
| 2025-12-31 | 8 | 20 | 16 | 95 | 54 |
| 2026-03-31 | 7 | 22 | 20 | 98 | 46 |
| 2026-06-30 | 5 | 24 | 22 | 105 | 37 |
| 2026-11-28 | 4 | 24 | 38 | 99 | 28 |

A1 and A4 hold from 2026-03-09 only: no earlier SIPRI release could be imported (SIPRI's database serves its current release), so at the quarter ends before that date A1 and A4 are `no-data` (`no-release`) and contribute nothing.

The worksheets: [USA](USA.md), [DEU](DEU.md), [GBR](GBR.md), [FRA](FRA.md), [ESP](ESP.md), [IRL](IRL.md), [ZAF](ZAF.md), [TUR](TUR.md), [EGY](EGY.md), [IND](IND.md). Each has the worksheet table of docs/08 §3, the score by category, the band, the three reading slots left blank, the three largest contributions, the effect of each proposal and the sensitivity rows.

## 2. Sensitivity (docs/02 §10)

The fifteen rows of sensitivity.json computed on the same preview dataset (193 entities; Spearman's ρ against the default ranking; countries whose display score changes; the ten whose band changes):

| Variant | ρ | Changed | Ten: band changes |
|---|---|---|---|
| passivity-5 | 0.9813 | 78 | none |
| passivity-15 | 1.0000 | 0 | none |
| passivity-25 | 0.9892 | 78 | none |
| weight-A-0.5 | 0.9953 | 38 | Germany Passive (−3) |
| weight-A-1.5 | 0.9958 | 37 | none |
| weight-B-0.5 | 0.9918 | 192 | United Kingdom Acting (+33); France Acting (+32); South Africa Acting (+34) |
| weight-B-1.5 | 0.9976 | 191 | Germany Passive (−15) |
| weight-C-0.5 | 0.9940 | 82 | Germany Passive (−17); India Acting (+1) |
| weight-C-1.5 | 0.9953 | 84 | none |
| weight-D-0.5 | 0.9973 | 59 | none |
| weight-D-1.5 | 0.9986 | 59 | Germany Passive (−16) |
| reported-0.2 | 0.9999 | 6 | Germany Passive (−20) |
| reported-0.6 | 0.9999 | 5 | none |
| statements-excluded | 0.9596 | 107 | none |
| decay-off | 0.9479 | 184 | Egypt Confronting (+45); India Acting (+3) |

Decay off changes 184 display scores with ρ 0.9479 (0.9432 on 2026-09-30 in the run of 2026-10-05); the variant that changes the most display scores is weight-B-0.5 (192, ρ 0.9918). The reading of 2026-10-05 below still applies in kind: decay and the weight of category B, where the votes sit, move the ranking most.

*Reading of 2026-10-05:* Decay is still the parameter the ranking depends on most: switching it off changes 183 display scores and brings ρ to 0.943 (0.912 with the same events before the imports, 0.907 at P-15): the B1 votes of 2023 and 2024 and the statements of 2023 expire after two years by default, and the five votes of 2025, all within the last 16 months, now weigh on both sides. The category weights move more than at P-15, mostly through B, where the twelve votes sit: weight B 0.5 brings three of the ten from Confronting to Acting. For comparison, the sensitivity.json of `pnpm build:data --date 2026-09-30` (published events only, which are all generated) gives ρ 0.9702 and 0.9917 for passivity 5 and 25 (149 penalised), and 0.9172 for decay off.

## 3. Critical review of the thresholds

*Written at P-15 and revised on 2026-10-05; the numbers in this section are of 2026-09-30. The numbers of 2026-11-28 are in §1, §2 and §4.*

Which rules produced a result that surprised on reading the ten and the 193, and what would change it. Each change is measured in §4 and §5; the ones recommended are gathered in §7.

1. **A state that only votes yes lands in Acting for months (B-23).** B1 votes do not lift the penalty, but they are summed without a cap, so enough recent yes votes outweigh it. A hypothetical state that votes yes on all twelve qualifying votes and does nothing else scores up to +12.6 (display +13, Acting) at the end of 2025 and is Acting at 24 month ends, from December 2024 to November 2026 (+2.8 on 2026-09-30). With all twelve votes imported this is no longer hypothetical: of the 108 states whose only events are B1 votes or events of zero points, 41 are Acting on 2026-09-30, 42 Passive and 25 Enabling, and the penalty applies to 141 states while 89 are Acting; Armenia, the Bahamas, Barbados, Malta, Portugal and Trinidad and Tobago are penalised and Acting at +11 or +12. The number of Acting states goes from 37–43 (to September 2024) to 101–116 (December 2024 to December 2025). Spec §2 describes such a state as Passive. Proposed: an indicator cap on B1 of −15…+15, equal to the penalty, so that votes alone never outweigh it (minor version); measured today it changes 107 display scores and 54 bands, all of them states whose record is mostly votes. Symmetric, so that yes and no votes are treated alike (docs/02 §13); the one-sided cap +15 was measured too (§4).
2. **A negative act lifts the passivity penalty (B-46, also B-24, B-403 (7), B-431 (1)).** The qualifying rule counts contributions of absolute value 2 or more, so an agreement signed with Israel (C2 −10) or trade as usual (C3 −5) ends the −15 for inaction: Russia's only qualifying event is C3 −5 on its 2025 trade and it scores +25 (Acting); Azerbaijan's two C2 memoranda (−20) leave it at −2 instead of −17; Argentina's two C2 instruments and its C3 spare it the penalty (−48, Enabling, instead of −63, Sustaining), and Morocco's C3 and C2 keep it at +5 (Acting) instead of −10. Adding a negative act raises these scores. Proposed: only contributions of +2 or more qualify (minor).
3. **Pre-war data at the start of the window (P-04 choices B-60, B-63).** Until each reporter's 2023 figures appear (February to May 2024), A2 and C3 hold values of the calendar year 2022: C3's ratio to 2022 is then 1 by construction, so "trade as usual" applies to everyone with trade, and A2 counts 2022 exports. On 2023-12-31 this is 40 display scores, 10 bands and 2 passivity decisions; the United States −79 would be −46 and Spain +14 would be +27. D1's value of October 2023 rests entirely on funding of October 2022 to September 2023, and flows dated before 7 October 2023 count in windows to September 2024 (details in §5). Proposed: no computed value rests on data from before 2023-10-07: A2 and C3 values of data year 2022 are not in force in the window, and D1 counts FTS flows dated on or after 2023-10-07 (minor; history only, no effect on 2026-09-30).
4. **Caps that bind.** The category cap B binds for Spain (+78.8 → +45), Ireland (+68.4 → +45), South Africa (+58.8 → +45), Türkiye (+50.8 → +45), the United Kingdom (+45.8 → +45) and the United States (−114.4 → −40); A for the United States (−78.2 → −45); C for India (−30 → −20, three C2 instruments); B9's +10 for the United Kingdom, France, Spain, Ireland, South Africa, Türkiye and Egypt; and the score clip for the United States (raw −110 → −100). They work as designed (statements below deeds, D-13; no category decides alone), but with the twelve votes B reaches its cap for five of the ten, so a further positive act in B no longer moves them. The United States sits at the clip with or without any single indicator, which makes it the one country whose position cannot respond to a change; that is a property of the scale, not a proposal.
5. **Category A with the SIPRI release.** Germany gets A1 −10.4 (36 of 537 TIV delivered to Israel in 2025) and A4 −10 (281 TIV of orders in 2025) from 9 March 2026; with the five votes (+9.1) it moves from +16 to +5 and stays Acting. The United States' A1 −38.2 adds to an A already beyond its cap. A4 reads only the release's data year (orders placed in 2025): the 2023 orders (Germany's 5,400 TIV among them) are excluded by `orders_signed_from` (B-10), and the 2024 orders (the United States 288 TIV, Slovakia 282, Austria 165, Azerbaijan 121.8) would have counted only under the release of 2025, which could not be imported, so they never score. SIPRI writes 0 for the TIV of an order whose number is not yet known (India's Heron-2 and PULS of 2025, Germany's Arrow-3 of 2025): such an order adds nothing, and a country with only such orders is `no-data` on A4 (B-488). No threshold change is proposed; the author and the reviewers should know that A4 is a one-year window on the latest release.
6. **Egypt at +23 (Acting) rests on votes and statements.** B1 (+17.8, all twelve votes yes) and B9 (capped at +10), less C3 −5; category D is 0 because Egypt's aid does not appear as government funding in FTS and D4 found no qualifying programme on the sources read (B-244 (4)). The limitation of D1 to FTS is stated on the methodology page (docs/02 §5); no threshold change is proposed, but the author and the readers of §3 of docs/08 should see it.
7. **D1 moves between tiers from month to month.** 67 donors had a D1 value in the window; their points changed 274 times in 36 months (median 4 per donor; the United Kingdom and Poland 10 times, Germany 8). A quarterly value would change 219 times in 12 quarters, so it smooths nothing per step; the monthly rule is kept (§5).

## 4. The methodology defaults under review

Measured on 2026-11-28 over the 193 entities, and at the eleven quarter ends from 2023-12-31 to 2026-06-30 and on the date (history). "Changed" counts display scores; ρ compares with rc.1. The reasons for each recommendation are those of 2026-10-05 (the table of that date is in the git history of this file, commit c125e38); rc.2 (PR #15) carries the adopted ones. rc.3 (PR #19: Article 19 absences, A4 data years) is not modelled by `pnpm calibrate`; its effect is in PR #19's `diff.json` and in `docs/review/monthly-2026-11.md` §13.

| Default | Today: changed, bands, passivity, ρ | History (largest quarter end) | The ten today | Recommendation |
|---|---|---|---|---|
| b21: official-video and parliamentary sources count for confirmed (B-21) | 2, 0, 0, 0.9998 | 2 changes, 1 band (2026-03-31) | Germany −22 → −28; Türkiye +70 → +72 | Adopt (rc.2 rule 1). |
| b22: most severe stacking for A3, A6, A7, B3, B7, D2 (B-22, B-51) | 0, 0, 0, 1.0000 | 0 | none | Adopt (rc.2 rule 2). |
| b23: B1 capped at +15 (B-23, one option) | 74, 9, 0, 0.9999 | 126 changes, 36 bands (2025-12-31) | United Kingdom +55 → +54; France +52 → +51; Egypt +24 → +23 | Reject in favour of the symmetric cap. |
| b23-sym: B1 capped at −15 and +15 (B-23, symmetric option) | 83, 11, 0, 0.9999 | 149 changes, 44 bands (2025-12-31) | United Kingdom +55 → +54; France +52 → +51; Egypt +24 → +23 | Adopt (rc.2 rule 3). |
| b46: only contributions of +2 or more qualify (B-46) | 31, 19, 31, 0.9730 | 31 changes, 19 bands (2026-11-28) | none | Adopt (rc.2 rule 4). |
| b47: pre-existing B8 tier does not qualify (B-47) | 0, 0, 0, 1.0000 | 27 changes, 26 bands (2024-06-30) | none | Adopt (rc.2 rule 5). |
| b48-alt: alternative to B-48: a standing state qualifies while it holds | 37, 15, 37, 0.9653 | 37 changes, 15 bands (2026-11-28) | none | Keep B-48 (alternative rejected). |
| b46+b47: B-46 and B-47 together | 31, 19, 31, 0.9730 | 62 changes, 49 bands (2023-12-31) | none | Measured together. |
| b8-pre: pre-existing recognitions of the registry as B8 +3 (B-199 (3) alternative) | 60, 2, 0, 0.9977 | 61 changes, 39 bands (2024-03-31) | none | Rows one by one (R21); the seven A/78/846 rows of B-2170 were added by default, flagged. |
| b8-pre+b47: pre-existing B8 +3 rows, with B-47 | 60, 2, 0, 0.9977 | 88 changes, 31 bands (2024-06-30) | none | As above, with B-47. |
| trade-no-2022: A2 and C3 values of data year 2022 not in force in the window (P-04, B-63) | 1, 0, 0, 1.0000 | 95 changes, 24 bands (2023-12-31) | none | Adopt (rc.2 rule 6). |
| d1-postwar: D1 from FTS flows dated on or after 2023-10-07 only (P-04, B-60) | 0, 0, 0, 1.0000 | 5 changes, 0 bands (2023-12-31) | none | Adopt (rc.2 rule 7). |
| proposal: the recommended set: B-21, B-22, B-23 (B1 within −15…+15), B-46, B-47, no 2022 trade values, D1 from post-war flows | 105, 28, 31, 0.9728 | 158 changes, 57 bands (2025-12-31) | Germany −22 → −28; United Kingdom +55 → +54; France +52 → +51; Türkiye +70 → +72; Egypt +24 → +23 | The set of §7 (rc.2, PR #15). |

Effect on the sensitivity rows: Spearman's ρ of four rows, each computed against the variant's own default ranking.

| Default | passivity 5 | passivity 25 | statements excluded | decay off |
|---|---|---|---|---|
| rc.1 | 0.9813 | 0.9892 | 0.9596 | 0.9479 |
| b21 | 0.9814 | 0.9891 | 0.9598 | 0.9479 |
| b22 | 0.9813 | 0.9892 | 0.9596 | 0.9479 |
| b23 | 0.9811 | 0.9886 | 0.9596 | 0.9618 |
| b23-sym | 0.9808 | 0.9885 | 0.9594 | 0.9613 |
| b46 | 0.9911 | 0.9966 | 0.9582 | 0.9576 |
| b47 | 0.9813 | 0.9892 | 0.9596 | 0.9479 |
| b48-alt | 0.9882 | 0.9955 | 0.9688 | 0.9407 |
| b46+b47 | 0.9911 | 0.9966 | 0.9582 | 0.9576 |
| b8-pre | 0.9811 | 0.9878 | 0.9593 | 0.9475 |
| b8-pre+b47 | 0.9811 | 0.9878 | 0.9593 | 0.9475 |
| trade-no-2022 | 0.9814 | 0.9892 | 0.9596 | 0.9480 |
| d1-postwar | 0.9813 | 0.9892 | 0.9596 | 0.9479 |
| proposal | 0.9916 | 0.9964 | 0.9578 | 0.9655 |

Band changes of the whole set on 2026-11-28 (28): BWA Acting +6 → Passive −9; CIV Acting +1 → Passive 0; CRI Acting +2 → Passive −13; DOM Acting +7 → Passive −9; ECU Passive −14 → Enabling −29; GEO Passive −8 → Enabling −23; GIN Acting +1 → Passive 0; HUN Sustaining −53 → Enabling −48; KHM Acting +10 → Passive −6; MAR Acting +11 → Passive −5; MDA Passive −11 → Enabling −26; MKD Passive −15 → Enabling −30; MLI Acting +1 → Passive 0; MMR Acting +1 → Passive 0; MNE Acting +15 → Passive 0; NAM Confronting +41 → Acting +40; NPL Acting +1 → Passive 0; POL Confronting +41 → Acting +40; QAT Confronting +41 → Acting +40; SRB Passive −6 → Enabling −21; TGO Passive −7 → Enabling −22; TKM Acting +12 → Passive −3; TZA Acting +4 → Passive −11; UGA Acting +14 → Passive −2; UKR Acting +8 → Passive −7; URY Acting +14 → Passive −1; ZMB Passive −12 → Enabling −27; ZWE Acting +1 → Passive 0.

## 5. The implementation choices of P-04, with numbers

- **D1 month to month (B-53).** 67 donors; 274 tier changes in 36 months (median 4). The ten: the United States 3 (+1, +3 from March 2024, +6 from November 2024, +3 from November 2025); Germany 8 (+3 and +6 alternating from June 2024); the United Kingdom 10; France 6; Spain 5; Ireland 4 (+9 since January 2026); South Africa 3; Türkiye 5; India 1 (+1 since July 2026); Egypt none (no FTS flow). Each change moves the score by up to 6 points (Ireland +3 → +9) and can switch the penalty (+1 does not qualify, +3 does). A quarterly value would change 219 times in 12 quarters: kept monthly.
- **FTS flows dated before 7 October 2023 (B-60).** 67 attributed government flows, USD 204,070,341, from 20 donors (the United States 84.9 million, Germany 63.6 million, the United Arab Emirates 15.0 million, Switzerland 14.8 million, Belgium 4.6 million, Norway 4.0 million, France 3.3 million and 13 others). They change D1 in 49 country-months of 19 countries, the last in July 2024: the October 2023 value of 19 donors (a window wholly before the war; the United Arab Emirates +6 → 0), and later months for Belgium (+6 → +3, March–June 2024), Iceland, Luxembourg, Norway and the United States (+3 → +1, March–July 2024). At the quarter ends, 5 display scores on 2023-12-31, 3 on 2024-03-31 and 2 on 2024-06-30 (1 band); the United States −95 → −97 and −85 → −87. Proposed in §7 (D1 from post-war flows).
- **The GNI year when the World Bank's latest is old (B-62).** Of the countries with an old GNI year, only Liechtenstein (2009) and San Marino (2023) have FTS funding: Liechtenstein's best month is x = 0.0060 % (+9); a GNI more than 19.2 % above the 2009 figure would put it at +6. San Marino's best is 0.0024 % (+6); a GNI more than 20.9 % above the 2023 figure would put it at +3. Cuba (2019), Eritrea (2011), South Sudan (2015), Syria (2022) and Yemen (2018) have no government flow to the appeals, so the choice changes nothing for them. Kept; the wording patch states it.
- **A4 without the orders of 2023 (B-10).** Measured with the release of 9 March 2026, whose trade register (372 order lines with a year marked uncertain by SIPRI) is read by data year: under that release A4 counts the orders of 2025 only, so the rule on 2023 changes nothing on 2026-09-30. It would matter only under the release of 2024 (data year 2023), which is not imported: the 2023 orders of universe states total 6,103 TIV, with Germany's 5,400 (two Arrow-3 orders), the Netherlands 184, Morocco 127, Singapore 125 and Greece 103 among them, all excluded by `orders_signed_from` as SIPRI dates orders by year only.
- **A2 and C3 on calendar-year data (B-63).** Each value holds from the reporter's first release of the year's data to the next. The 2022 values (wholly pre-war) are in force from 2023-10-07 to: the United States 2024-02-11 (A2 −25, C3 −8), Germany 2024-02-21 (−3, −5), the United Kingdom 2024-03-06 (−3, −5), France 2024-05-21 (0, −5), Spain 2024-05-02 (−8, −5), Ireland 2024-04-12 (C3 −5), South Africa 2024-02-06 (C3 −3; A2 0 to 2024-03-08), Türkiye 2024-02-06 (−3, −5), Egypt 2024-03-21 (C3 −5), India 2024-05-30 (−15, −8). The 2023 values (86 of 365 days after 7 October) then hold until early 2025. Measured with the 2022 values out: see §3 item 3. Proposed in §7 for 2022; the 2023 values stay (the only annual figure that covers the start of the window).

**Update of 2026-11-28.** D1: 67 donors; 284 tier changes in the window (median 4; most: GBR 11, POL 10, BEL 8, DEU 8); a quarterly value would change 231 times: kept monthly. FTS flows dated before 7 October 2023: 65 flows, USD 202,672,872, from 20 donors; they change D1 in 46 country-months of 19 countries, the last in 2024-07; the rebuilt windows differ from the committed table in 0 cases. Old GNI years: Liechtenstein (2009) best month x = 0.006 %, a GNI more than 19.2 % above the 2009 figure changes its tier; San Marino (2023) x = 0.0024 %, 20.8 %; Cuba, Eritrea, South Sudan, Syria and Yemen have no government flow.

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

**Status on 2026-11-28.** The proposal is PR #15 (1.0.0-rc.2, into `data/phase1`); its Discussion is #20, posted on 2026-11-28 (docs/10 B-2175). A further proposal, 1.0.0-rc.3 (PR #19, Discussion #21; B-2174), built on rc.2, scores 0 for an absence of a state not entitled to vote under Article 19 (with the reason shown) and scores each SIPRI data year from 2024 once, in the first imported release that reports it. Both windows close on 2026-12-12; the author decides. Effect of the rc.2 set (as `pnpm calibrate` models it, §4 row "proposal") on 2026-11-28: 105 display scores, 28 bands, 31 passivity decisions, ρ 0.9728; among the ten: Germany −22 → −28; United Kingdom +55 → +54; France +52 → +51; Türkiye +70 → +72; Egypt +24 → +23.

## 8. Structured tables when this was computed

On `data/phase1` at `63b4c8b`:

- **B1:** the 12 qualifying votes, 2,316 rows (12 × 193), as on 2026-10-05 (B-186, B-903, B-487). A/RES/81/1 of the 81st session is not on the qualifying list (adding a vote is a minor version; T-H-STRUCT, B-2177).
- **A1 and A4:** the SIPRI release of 9 March 2026 (B-487): 12 delivery rows and 524 order rows. A1 and A4 hold from 2026-03-09; no earlier release could be imported, so the quarter ends before that date have no A1 or A4 (§1).
- **B8:** 96 rows in recognitions.csv, among them the seven rows from the registry A/78/846 added by default and flagged for ARE, AZE, EGY, JOR, MAR, MYS and NGA (B-2170). Of the ten, Egypt's B8 now rests on such a row (1988-11-18): +3 from 2023-10-07. `build-notes.json` `counts.unchecked` is 0 in the preview (B-2173).
- **A2 and C3:** Comtrade rows for 152 reporters on C3 and 79 on A2; 42 registry entries have none, each with a documented reason (B-850; T-H-STRUCT re-run, B-2177). None of the ten is affected.
- **D1:** fts_funding.csv, 2,584 rows, the newest window ending 2026-10-31 (T-H-STRUCT, B-2177).

## 9. Re-running

After the author publishes the events (and after each import), `pnpm calibrate --date {date} --fts` on the published data with `--statuses` left at its default re-computes every number here; the worksheets are regenerated from its JSON and the reading slots already filled are kept. P-22 does this before the flip, and P-24 uses the same command to write `diff.json` for 1.0.0-rc.2.
