# 02 — Methodology v1.0, implementable specification

This document turns spec §2–§4 into rules precise enough to code and to test. Where the spec was ambiguous, the choice is stated and justified. The public methodology page is generated from `methodology/v1.0.0/` files, which must agree with this document; when they conflict, fix the files.

**Amendments of 1.0.0-rc.2** (proposed 2026-10-05 by P-24, in effect once its pull request is merged; `methodology/CHANGELOG.md`, docs/10 B-493): §4 `confirmed` also accepts `official-video` and `parliamentary` sources; §2 A3, A6, A7, B3, B7 and D2 stack by most severe, and B1 has an indicator cap of −15…+15; §6 a qualifying event contributes +2 or more (not its absolute value), and the pre-existing B8 tier (+3) does not qualify; §5 A2 and C3 values of data year 2022 are not in force in the window, and D1 counts FTS flows dated on or after 2023-10-07; B9 and B10 speakers are the head of state, the head of government and the foreign minister. Where the sections below say otherwise, they describe 1.0.0-rc.1.

## 1. Universe

- **Scored entities:** the 193 UN member states plus the Holy See, minus Israel and Palestine (D-10). 193 scored entities. Palestine's observer status is noted on the About page; neither excluded entity has a country page in v1.
- **Identifier:** ISO 3166-1 alpha-3. Names in EN and FR from the UN terminology database (UNTERM) short names. Regions: UN M49 regions and sub-regions; membership tags for UNSC (with permanent/elected periods), EU, NATO, Arab League, OIC, G20, G7, BRICS.

## 2. Indicators

The spec says "30 indicators" but its tables list **34**: A 8, B 12, C 6, D 5, E 3. v1.0 states 34, of which **31 are scored** (A–D) and **3 are experimental and unscored** (E, per D-12). Coverage is computed over the 31.

Indicator definitions, points, sources and cadence are exactly those in spec §3, with the following precisions.

### Indicator-level caps

Some indicators have their own cap on top of the category cap. Applied to the indicator's summed contributions before the category clip.

| Indicator | Cap |
|---|---|
| A5 military cooperation | −15 |
| A8 transit denied | +10 |
| B9 formal statements | +10 |
| B10 unconditional support / denial | −10 |
| B1 UNGA votes | none (category cap governs) |
| B12 relations downgraded | one standing state only: the most severe current measure counts (recall +5, downgrade +8, severed +10); they do not add |
| B8 recognition | one standing state only: +8 if recognised after 2023-10-07, else +3 if recognised before (pre-existing recognition is a standing state from 2023-10-07) |
| B11 sanctions | ministers +10 and settlers +5 are separate standing states; both can hold |
| C1 | review +4 and suspension +10 do not add; suspension supersedes review |
| C4 | labelling +2 and ban +5 do not add; ban supersedes |
| D3 | restored +5 and increased +8 do not add; increased supersedes |

### Precisions per indicator

- **A1** and **A4** use SIPRI TIV (trend-indicator values) from the annual release. A4 counts only contracts signed on or after 2023-10-07 (orders, not deliveries of pre-war orders).
- **A2** uses HS chapter 93 (arms and ammunition) and heading 8710 (tanks and armoured vehicles) fully. Headings 8526 (radar and remote-control apparatus) and 8802 (aircraft) count **only** when a licence register, a parliamentary answer or a published investigation citing the customs code confirms the military nature of the flow, because both headings are dominated by civil goods. This is a documented deviation from the spec's list (deviation 6 in `00-decisions.md`).
- **A3** F-35 supply chain: a standing state for the countries whose companies are documented Tier-1 or Tier-2 suppliers of parts or maintenance for the F-35 programme in official programme documents, national ministry statements, or the UN Special Rapporteur's reports. Points −15 while the state holds. A judicial or governmental halt of F-35 part exports to Israel ends the standing state (and is separately an A6 event).
- **A5** counts confirmed instances only: a named exercise, a documented transit (port call, overflight authorisation), a public basing agreement, or an official confirmation of intelligence sharing related to the Gaza campaign. Routine pre-existing NATO or bilateral arrangements are not instances unless activated for the campaign.
- **A6** partial suspension: any government decision suspending or refusing a class of licences to Israel, or a court order with the same effect. **A7** full embargo: law or decree covering both exports to and imports from Israel. A7 supersedes A6 for the same country (do not add).
- **B1** counts only **plenary General Assembly resolutions or decisions adopted by recorded vote** whose subject is Gaza (ceasefire, truce, humanitarian access), UNRWA, or the status and rights of Palestine, adopted on or after 2023-10-07 (the 12 September 2025 endorsement of the New York Declaration was adopted as a decision, A/DEC/80/506, and qualifies). The list of qualifying resolutions is `methodology/v1.0.0/votes.yaml`, each with a one-line inclusion rationale. Committee votes, procedural votes and amendments are excluded. Absent is scored −2; a formal "did not participate" is treated as absent.
- **B2** counts any veto of a draft resolution whose operative paragraphs called for a ceasefire, a humanitarian truce or pause, regardless of which permanent member cast it. Vetoes of drafts on other subjects (e.g. Palestine's UN membership, 18 April 2024) and vetoes of amendments (22 December 2023) are recorded in `unsc_vetoes.csv` with `ceasefire: false` and tracked, not scored.
- **B3** counts declarations of intervention filed in ICJ case 192 (South Africa v. Israel), Article 62 or 63, from the date the ICJ registers the filing, **only when the declaration's stated construction of the Genocide Convention supports the applicant's reading or the Court's provisional-measures orders** (obligations to prevent, scope of intent, binding character of the orders). A declaration that argues for a narrower reading against the applicant (the United States and Hungary filed such declarations on 12 March 2026, to be verified from the texts) is a **B4** event (−15), not B3. A withdrawal ends the standing state on the withdrawal date (Colombia, 18 September 2026; Nicaragua's Article 62 application, withdrawn 3 April 2025). Joining a separate case (e.g. Nicaragua v. Germany) is tracked under scope tag `related` and unscored.
- **B4** requires an official statement rejecting the ICJ's provisional-measures orders or their binding character, a formal act to that effect, or an intervention filed against the applicant's construction (see B3). Criticism of the case's merits in a press remark without a formal act is not B4.
- **B5 / B6** ICC: an official statement by the head of government, foreign or justice minister on executing the 21 November 2024 warrants; hosting a person under warrant on an official visit without arrest is a B6 instance; withdrawal from the Rome Statute in the window (Hungary, effective 2 June 2026) is a B6 instance. Authorising an overflight is a lead, not an instance, unless accompanied by a stated position on the warrants. B5 and B6 by the same country supersede each other in time: the latest formal position holds.
- **B7** sanctions on ICC officials: standing state while sanctions are in force.
- **B9 / B10** require the exact quote, speaker, date and the official transcript or official video with timestamp. +2 for a formal call for ceasefire or end of blockade; +5 when the statement names specific violations (e.g. starvation as a method of warfare, attacks on hospitals, forced displacement) or uses a legal characterisation. −5 for any B10 statement. Same speaker, same day: one event.
- **B11** counts sanctions listings by the country itself or, for EU member states, EU-level listings the state voted for; a state that blocked an EU listing gets no B11 event and the block is a B10-adjacent note, unscored.
- **C1** for EU member states: an EU-level review or suspension of the Association Agreement counts for every member state that supported it in the Council, as recorded in official minutes or ministerial statements; states that opposed get no C1 event.
- **C3** uses total goods trade (exports + imports) with Israel for the trailing 12 months, compared to calendar 2022. See §5.
- **C5** counts decisions by a sovereign fund, public pension fund or central bank to exclude companies over conduct in Gaza or the occupied territories, one event per decision batch.
- **D1** see §5. **D2** UNRWA suspension: a standing state from the announcement to the announced resumption; **D3** applies from the resumption date, with "increased" meaning the annual contribution exceeds the 2022 contribution in nominal USD per UNRWA donor tables.
- **D4** one event per programme (a field hospital deployment, a medical-evacuation programme), not per patient. **D5** one event per legal instrument.
- **E1–E3** are recorded with points as listed but excluded from the score in v1.0.

## 3. Event types and time behaviour

Each event has exactly one `type`.

| Type | Contribution at date t |
|---|---|
| `standing` | `p × w` for every t with `start ≤ t < end` (end null = still holds) |
| `repeatable` | `p × w × d(t − date)` with d(Δ) = 1 for 0 ≤ Δ ≤ 365; 1 − 0.75·(Δ−365)/365 for 365 < Δ ≤ 730; 0 for Δ > 730 or Δ < 0 |
| `computed` | as `standing`, with `start` = the source release date and `end` = the next release date; points are the formula output |

Δ is in whole days. Events with `status` other than `published` contribute 0. Retracted events contribute 0 for all dates (history is recomputed; the corrections log records what changed).

Which indicators use which type: standing = A3, A6, A7, B3, B5, B6, B7, B8, B11, B12, C1, C2, C4, D2, D3; repeatable = A5, A8, B1, B2, B4, B9, B10, C5, C6, D4, D5, E1–E3; computed = A1, A2, A4, C3, D1. A6 is a standing state for every suspension, ending on the date the suspension is lifted; B3 persists from filing; B5 and B6 replace each other in time (the latest position holds); C2 persists once the agreement is signed. The `indicators.yaml` file lists the type per indicator; the schema rejects mismatches.

## 4. Confidence weights

| Confidence | Weight | Rule |
|---|---|---|
| confirmed | 1.0 | at least one source of kind `official`, `court`, or `dataset` |
| corroborated | 0.7 | two independent `ngo` or `press` sources that name the underlying document |
| reported | 0.4 | one credible `ngo` or `press` source; flagged on the country page |
| disputed | 0.4 | an official denial is on record (a reply or an official source) and counter-evidence exists; both sides linked |

The schema enforces the source-kind requirement for `confirmed`.

## 5. Computed indicators, exact formulas

All thresholds are in the methodology files so they can be versioned.

**A1 — SIPRI deliveries.** For SIPRI release R (published in March of year Y+1 with data through year Y): `s = TIV(country → Israel, year Y) / TIV(all → Israel, year Y)`. `points = −40 × √s`, rounded to one decimal. Valid from R's publication date to the next release's publication date. Before the first post-war release (March 2024) A1 is `no-data` for everyone. Rationale for the square root: linear scaling makes secondary suppliers invisible (a 1% supplier would score −0.4); the root keeps the largest supplier near the cap and gives a 1% supplier −4.

**A4 — orders from Israel.** From the same release: any new order placed with Israel in year Y with TIV > 0 → tiers by TIV: ≥ 500 → −15; ≥ 100 → −10; ≥ 10 → −5; > 0 → −2.

**A2 — military exports (customs).** Value V = trailing-12-month exports to Israel under HS 93 + 8710 (+ 8526/8802 when confirmed military). Source: the country's own reporting to UN Comtrade; if absent or confidential, Israel's mirror import data by origin; if both absent, `no-data`. Tiers: V ≥ 100 M USD → −25; ≥ 10 M → −15; ≥ 1 M → −8; ≥ 100 k → −3; < 100 k → 0. Recomputed at each Comtrade annual/quarterly release; valid until the next.

**C3 — trade as usual.** T = trailing-12-month goods exports + imports with Israel (own reporting, else mirror). r = T / T(2022). If r ≥ 0.9: tiers by T: ≥ 10 B USD → −8; ≥ 1 B → −5; ≥ 100 M → −3; ≥ 10 M → −2; else 0. If r < 0.9: 0. A drop is not rewarded here (only a decision is, via C1); a rise is not penalised beyond the tier.

**D1 — humanitarian funding.** F = paid + committed contributions from the country's government (donor organisation type "Government") to the OCHA-tracked oPt flash appeals and the oPt pooled fund in the trailing 12 months, per FTS. x = F / GNI (World Bank Atlas, current USD, latest available year). Tiers: x ≥ 0.0100 % → +12; ≥ 0.0050 % → +9; ≥ 0.0020 % → +6; ≥ 0.0005 % → +3; > 0 → +1; 0 → 0. Zero is a real zero (FTS is the reference for government humanitarian funding), but the methodology page states the known limitation that some bilateral and in-kind aid is not reported to FTS, and that D4/D5 capture part of it. Recomputed monthly; valid one month.

## 6. Passivity penalty

A country receives `passivity = 15` at date t if it has **no qualifying event** in the trailing 365 days. A qualifying event is any published event with indicator in B2–B12, C1–C6 or D1–D5, event date in (t − 365, t], and current weighted contribution of absolute value ≥ 2. B1 votes do **not** qualify (spec §2: "votes yes at the UN and does nothing else" is Passive); token funding below the +3 tier of D1 does not qualify. Category A never qualifies: selling or refusing arms is not the kind of engagement the penalty measures, and A6–A8 events almost always come with B or C events anyway.

## 7. Score

```
sub_k(c,t)   = Σ_e∈k  p_e · w_e · d_e(t)            (after indicator-level caps)
clip_k(c,t)  = clip(sub_k, cap_k⁻, cap_k⁺)          for k ∈ {A,B,C,D}
raw(c,t)     = Σ_k clip_k − passivity(c,t)
S(c,t)       = clip(raw, −100, +100)
```

Category caps: A −45/+30, B −40/+45, C −20/+20, D −15/+25. E is computed with cap −10/+10 and shown, never summed.

Display: `S` is rounded half away from zero to an integer; the band is read from the rounded integer: Sustaining ≤ −51, Enabling −50…−21, Passive −20…0, Acting 1…40, Confronting ≥ 41. All internal arithmetic uses full precision; JSON outputs carry both `score` (one decimal) and `score_display` (integer).

**Worked example (illustrative, not data).** Germany, hypothetical date: A: A1 −22 (s = 0.3025, −40 × √0.3025 = −22.0), A3 −15, A6 +10 → −27 (within −45). B: votes +3, +3, −2 (a vote 462 days old, decayed × d(462) = 0.8007 → −1.6), B10 −5, B5 +8 → +7.4. C: C3 −5. D: D1 +6, D2 (ended) 0, D3 +5 → +11. raw = −27 + 7.4 − 5 + 11 = −13.6; no passivity. S = −13.6 → display −14, Passive. (With whole days, d is never exactly 0.8, and s = 0.30 gives −21.9, not −22.)

## 8. Coverage

Over the 31 scored indicators, each country has one assessment status per indicator (D-09): `has-events`, `none-found`, `no-data`, `not-applicable`, `unchecked`.

```
applicable = 31 − count(not-applicable)
coverage   = (count(has-events) + count(none-found)) / applicable
```

Not-applicable rules: B2 for states not on the Security Council at any point in the window; nothing else is automatically N/A. The coverage bar shows missing indicators with `no-data` (hatched) and `unchecked` (empty) distinguished.

**Rule:** a country with any `no-data` on A1 or A2 shows "no export data" on the card, never a zero. `unchecked` on any indicator is a build warning; publishing a country with unchecked indicators is allowed only in Phase-1 scorecard mode and blocks the score flag.

## 9. User-adjustable weights

Readers can set `w_k ∈ [0, 2]` for k ∈ {A,B,C,D}, default 1. `S_user = clip(Σ_k w_k · clip_k − passivity, −100, 100)`. Computed client-side from the published `clip_k` values; the passivity flag is published per country. The URL encodes the weights as `?w=A,B,C,D` with one-decimal values.

## 10. Sensitivity tables (published, regenerated each build)

1. Passivity at 5, 15, 25: full ranking and Spearman rank correlation with the default.
2. Each category weight at 0.5 and 1.5 (others at 1): same.
3. Confidence weights: `reported` at 0.2 and 0.6: same.
4. Statements excluded (B9/B10 at 0): same.
5. Decay off (d = 1 for all repeatable events): same.

## 11. Versioning

- Semantic versions. Major: scale, category or universe changes. Minor: indicator, point or threshold changes, new qualifying votes list. Patch: wording.
- `methodology/vX.Y.Z/` is a complete, self-contained set of files. Snapshots are computed per version. When a version is superseded, its last outputs are frozen under `data/snapshots/vX.Y.Z/` and stay served at `/api/v1/methodology/vX.Y.Z/…`.
- Every methodology change ships with `CHANGELOG.md` entry and a `diff.json` listing every country whose display score moved by ≥ 1, with the cause.
- Adding a resolution to `votes.yaml` is a minor version (it changes scores).

## 12. Consistency checks (run in CI, block on failure)

1. Same indicator, same country, overlapping window, different points → error unless the indicator is scaled, that is, its points may differ between events and each event records `points_rationale`: A1, A2, A4, A5, B1, B8, B9, B11, B12, C1, C3, C4, D1 and D3.
2. Every `confirmed` event has an `official`, `court` or `dataset` source.
3. Every source has `wayback_url`, `sha256`, `retrieved_at`, `quote`.
4. Every B9/B10 event's quote appears verbatim in `archive/text/{src}.txt` (after whitespace normalisation); other events' quotes must appear too unless the source is a dataset row.
5. Symmetry table present and complete (§13).
6. Tone lint: event summaries contain no word from `methodology/v1.0.0/banned-words.txt` (adjectives and loaded terms: brutal, shameful, heroic, genocidal, complicit, courageous, disgraceful…) and no exclamation mark; summaries are ≤ 200 characters and start with the actor.
7. Build reproducibility: a fresh `pnpm build:data` produces byte-identical outputs (D-25).
8. No `unchecked` indicator on any country when `NEXT_PUBLIC_SHOW_SCORES=true`.

## 13. Symmetry table

| Negative | Positive counterpart | Note |
|---|---|---|
| A1 deliveries | A7 embargo | |
| A2 components | A6 partial suspension | |
| A3 F-35 | A6 (halt of F-35 parts) | |
| A4 purchases from Israel | A7 (two-way embargo) | |
| A5 cooperation | A8 transit denied | |
| B1 no/abstain | B1 yes | same indicator |
| B2 veto | B3 intervention | both are legal-institutional acts |
| B4 rejects ICJ | B3 | |
| B6 refuses ICC | B5 executes ICC | |
| B7 sanctions ICC | B5 | |
| B10 denial | B9 naming | |
| C2 new agreement | C1 suspension | |
| C3 trade as usual | C1, C4 | |
| D2 UNRWA cut | D3 UNRWA restored | |
| E2 protest bans | E1 investigations | experimental |

## 14. Published outputs per country (shape)

Illustrative, not data. Coverage: (12 + 9) / 30 = 0.70. A generated event's id ends with a slug: for a vote, the resolution symbol without `A/RES/` (`A/RES/ES-10/21` gives `es-10-21`); `80-000` below stands for a hypothetical symbol. The published file is described field by field in `apps/web/public/api/README.md`.

```json
{
  "iso3": "DEU", "name": {"en": "Germany", "fr": "Allemagne"},
  "methodology": "1.0.0", "date": "2026-09-26",
  "score": -13.6, "score_display": -14, "band": "passive",
  "passivity_applied": false,
  "categories": {"A": {"raw": -27, "clipped": -27}, "B": {"raw": 7.4, "clipped": 7.4}, "C": {"raw": -5, "clipped": -5}, "D": {"raw": 11, "clipped": 11}, "E": {"raw": 0, "clipped": 0, "scored": false}},
  "coverage": {"ratio": 0.70, "applicable": 30, "has_events": 12, "none_found": 9, "no_data": 4, "unchecked": 5, "missing": ["A2", "A4", "C3", "C5"]},
  "events": {"total": 14, "confirmed": 9, "corroborated": 3, "reported": 2, "disputed": 0},
  "last_change": {"date": "2026-09-12", "event": "evt_2026_09_12_DEU_B1_80-000", "delta": 3},
  "summary": {"en": "Score −14 (Passive). 14 events, 9 confirmed. Coverage 70%. Last change: 2026-09-12, UNGA vote (B1, +3).", "fr": "…"}
}
```
