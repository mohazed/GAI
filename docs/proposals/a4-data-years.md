# Proposal: the A4 data-year gap (orders of 2024)

Draft for the author, written by T-F-METHOD (FINISH-PLAN.md Phase D, docs/10 B-2100). It follows the
format of the 1.0.0-rc.2 drafts (`docs/proposals/v1.0.0-rc.2-*.md` on branch
`methodology/v1.0.0-rc.2`), but it is not a version: no methodology folder, no pull request and no
Discussion were made. The author decides; if a methodology change follows, P-24 makes it as a
version with its changelog entry, `diff.json` and comment window (docs/08 §1).

Inputs: docs/10 B-536 (7), B-857; `docs/review/monthly-2026-11.md` §7. Scores measured on 2026-11-10
on `data/phase1` (commit 2282c48, methodology 1.0.0-rc.1) with `pnpm score --country XXX --date
2026-11-10 --json`, with and without `--preview`, before and after a temporary edit of the A4
generator in the working copy (reverted with `git checkout`; nothing committed).

---

## The question

A4 scores arms ordered from Israel. Two texts define it:

- docs/02 §2 and `indicators.yaml`: "Arms purchased from Israel under new contracts since October
  2023 … counts only contracts signed on or after 2023-10-07".
- docs/02 §5 and `thresholds.yaml` `a4`: "From the same release [as A1]: any new order placed with
  Israel in year Y with TIV > 0", valid "from the release's publication date to the next release's
  publication date".

The generator follows §5: `packages/pipeline/src/generate/sipri.ts` keeps only the rows whose data
year is the release's own (`isDataYearRow`: data year = release year − 1). One SIPRI release is
imported, that of 9 March 2026 (data year 2025, docs/10 B-487). Its register export
(`src_20261005_sipri_register-supplier-israel`) carries every order year, so `sipri_orders.csv` holds
the orders of 2024, and they are not scored:

| Country | TIV of new orders from Israel, 2024 | Tier under docs/02 §5 |
|---|---|---|
| United States (USA) | 288 | −10 |
| Slovakia (SVK) | 282 | −10 (Barak MX, contract of 23 December 2024, B-536 (7)) |
| Austria (AUT) | 165 | −10 |
| Azerbaijan (AZE) | 121.8 | −10 |
| Kenya (KEN) | 45 | −5 |
| Philippines (PHL) | 5 | −2 |
| Liberia (LBR) | 0.24 | −2 |

Six more rows of 2024 are 0 TIV (CHE, NLD, PRT, ROU, SRB, SWE). The orders of 2025 are scored now
(DEU 281, GRC 79.2, KOR 140, LTU 3.75, LVA 50.4, MAR 45, PER 22.8, PHL 24, ROU 192, SGP 15, THA
114.5). The orders of 2023 stay out by design (the year starts before 7 October 2023; docs/10
B-151 (3)); this proposal does not change that.

Under §5 as written, the 2024 orders belong to the release of March 2025, whose window ran to
9 March 2026. That release was never imported (the archive starts in 2026), so the orders of 2024
are absent from the history between March 2025 and March 2026, and under §5 they would no longer
count today in any case. Because scores are displayed only after the flip (D-16), no displayed score
would ever include them. The question: is that the rule ("orders of the release's own year"), or a
gap to close ("contracts since October 2023")?

A technical constraint applies to every option that scores two data years from one release: the
engine accepts one computed value per indicator and release window (docs/02 §3). With both years
read as separate events, `pnpm score --country PHL` stops with "computed events
evt_2026_03_09_PHL_A4_orders-2024 and evt_2026_03_09_PHL_A4_orders-2025 of A4 overlap". Each such
option therefore writes one A4 event per country and release, with the years listed in its
`points_rationale`. docs/10 B-857 described the fix as reading every row with data year ≥ 2024 on
`main`; that edit alone fails on the Philippines, and, since the generator follows §5 as written,
any change of what is scored is a rule change (a minor version, docs/02 §11), not a fix on `main`.

## Options

**(a) Keep §5 as written.** A4 scores the orders of the release's own year. The methodology text
(a patch) states that orders of a year whose release is not imported are not scored, and names the
gap (2024). No score changes.

**(b) Cumulative.** Each release scores every order of the data years from 2024 to its own year, in
one event (points: the sum of each year's tier). An order then keeps scoring at every later release,
without end. Effect on today's scores: as in the table below. Long-run effect: every state's A4
grows with each order and never falls back, unlike A1 (the latest year only) and unlike repeatable
events (730 days).

**(c) First release that reports the year.** Each data year from 2024 is scored once, in the window
of the first imported release that carries it; one event per country and release (points: the sum
of each year's tier; the rationale lists each year's TIV). Once two consecutive releases are
imported, (c) equals (a). Today: the release of 9 March 2026 scores the orders of 2024 and 2025
until the next release (expected March 2027).

**(d) Two years per release.** Each release scores the orders of its own year and the year before,
in one event. Every order then counts in two consecutive windows (about 24 months). Effect today: as
in the table below; from the next release it also changes A4 for the states that order in 2025 and
2026.

Variant for (b), (c) and (d): the TIV of the years summed and tiered once, instead of each year's
tier summed. It differs only for a state with orders in both years: the Philippines (5 + 24 = 29
TIV, −5, unchanged from today) instead of −2 −5 = −7.

## Effect on 2026-11-10 (options b, c and d coincide today)

"Generated" counts only the published (generated) events; "preview" counts the 1,420 reviewed events
as if published (provisional). Measured with the temporary generator edit, except the Philippines,
which the engine rejects in that form and which is computed by hand (A4 −5 → −7, category A not at
its cap, passivity unchanged).

| Country | A4 added | Generated: display, band | Preview: display, band |
|---|---|---|---|
| USA | −10 | −93, unchanged (category A at −45: raw −63.2 → −73.2) | −100, unchanged |
| SVK | −10 | −18 Passive → −28 Enabling | −1 Passive → −11 Passive |
| AUT | −10 | +7 Acting → −3 Passive | +35 Acting → +25 Acting |
| AZE | −10 | +1 Acting → −9 Passive | −4 Passive → −14 Passive |
| KEN | −5 | +1 Acting → −4 Passive | +3 Acting → −2 Passive |
| LBR | −2 | −13 → −15, Passive | −13 → −15, Passive |
| PHL | −2 (variant: 0) | −4 → −6, Passive | −2 → −4, Passive |

Six display scores move on the generated events and four bands change (SVK, AUT, AZE, KEN); on the
preview, six scores and one band (KEN).

**With 1.0.0-rc.2 (PR #15, not merged).** rc.2 does not change A4 (its "most severe" stacking covers
A3, A6, A7, B3, B7 and D2), and category A never ends the passivity penalty under either version, so
the A4 points add to category A in the same way; the bands can differ because the other rules move
the starting scores.

## Recommended default: (c), each year's tier summed

Score each order year from 2024 once, in the window of the first imported release that reports it,
in one event per country and release. Reasons:

- Every order placed after 7 October 2023 counts once, for one release window, which is what §5
  gives when every release is imported; none is left out because the index began importing in 2026.
- Once two consecutive releases are imported, the rule is the same as today's; no state's A4 grows
  without end, as under (b), and the window stays one release long, unlike (d).
- Each year keeps the tier it would have had in its own release, so the Philippines' two orders
  count as two orders (−7), not as one merged order.

What it costs: the orders of 2024 count from 9 March 2026 to the next release, one release later
than their own release would have placed them; the event's summary says so ("ordered major arms
from Israel in 2024 and 2025 worth … TIV, per SIPRI (release of 9 March 2026)"). The change is a
minor version, with the generator, its tests (the worked examples of the rc.1 rule kept, docs/10
B-495) and `thresholds.yaml` `a4` (a parameter naming the rule, for example `years:
first-reporting-release`, read by the generator) in the same pull request.

A1 is not proposed for the same treatment: A1 is the share of Israel's imports in the release's own
year, a flow that the next release measures again, while an order is one act that a later release
does not repeat. If the author wants A1 treated alike, the 2024 deliveries of Germany, Italy and the
United States in `sipri_deliveries.csv` are the rows concerned, and two years of A1 in one event
would need a rule for combining two shares.

## Checks for P-24 if (b), (c) or (d) is adopted

- `pnpm score --country PHL --date {DATE}` runs (one A4 event per release).
- `pnpm methodology:diff --from <REF> --date {DATE} --write`: the countries that move are among the
  seven above, each with the cause "A4: orders of 2024 scored from the release of 9 March 2026".
- `pnpm calibrate --date {DATE} --fts` re-run (docs/calibration/README.md §9), since the change
  moves bands.
