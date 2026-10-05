# Methodology changelog

Every change to points, caps, thresholds, decay, passivity, the qualifying-votes list, the
symmetry table or the universe ships as a new version folder under `methodology/` with an entry
here and a `diff.json` listing every country whose displayed score moved by 1 or more, with the
cause (`docs/02-methodology-spec.md` §11, `docs/08-governance.md` §1). Major: scale, category or
universe changes. Minor: indicator, point or threshold changes, new qualifying votes. Patch:
wording.

## 1.0.0-rc.2 — calibration adjustments (proposed 2026-10-05)

Proposed in pull request `methodology/v1.0.0-rc.2` → `data/phase1` (P-24), open for comment for
14 days, until 2026-10-19 (docs/08 §1); merged only after that and after the author's decision.
The adjustments of the hand-scoring of the ten calibration countries (docs/08 §3: "record the
adjustment in the changelog of v1.0.0-rc"), as recommended in docs/calibration/README.md §7
(P-15, docs/10 B-436 to B-442) and re-measured after the P-14 imports (T-P14, B-487, B-491). The
numbers after the imports change no recommendation; they make the B1 cap the change with the
largest effect, because all twelve qualifying votes now score.

Folder: `methodology/v1.0.0/` stays the folder of the 1.0.0 line and now declares 1.0.0-rc.2
(docs/10 B-438, B-493): 1.0.0-rc.1 was never displayed (D-16), and folder names are `vX.Y.Z`.
1.0.0-rc.1 is the content of this folder at commit 6676783ab10118e97a6d687b10a18324283fa4df
(branch `data/phase1`, 2026-10-05); `pnpm methodology:diff --from <that commit>` rescores it. No
snapshot of rc.1 outputs is frozen: none was ever published as a score.

Effect measured with `pnpm calibrate --date 2026-10-05 --fts` on rc.1 (each change alone, then
the set) and with `pnpm methodology:diff` between the two versions, both on 2026-10-05, over the
193 scored entities. Two bases: **published events**, as the build scores them (the generated
events only, since no hand-written event is published yet) — this is `diff.json`; and, as
provisional numbers, the **preview** with the 773 events at status reviewed scored as if
published (PR #11), never written to `diff.json`.

Rule changes (minor level):

1. **`confirmed` accepts sources of kind `official-video` and `parliamentary`** (B-21,
   `confidence.yaml`). An official video or a parliamentary record is the government's own
   record, as good as its press release. Preview: 2 events rise from `reported` to `confirmed`
   (`evt_2025_08_29_TUR_A8`, `evt_2026_01_11_DEU_C2`, raised in their files; ρ 0.9991).
2. **A3, A6, A7, B3, B7 and D2 stack by "most severe"** (B-22, B-51, `indicators.yaml`). A state
   recorded twice must not count twice. No country has two such records holding on a date
   measured: 0 changes today and in the history.
3. **B1 has an indicator cap of −15…+15** (B-23, `indicators.yaml`), the size of the passivity
   penalty, symmetric so that yes and no votes are treated alike (docs/02 §13). A state that
   votes yes and does nothing else is Passive, as spec §2 describes it, and no state loses more
   than the penalty to votes alone. Preview: 107 display scores, 61 bands, ρ 0.9974 today; 150
   display scores and 95 bands on 2025-12-31. The largest change of the set.
4. **A qualifying event against passivity contributes +2 or more** (B-46, `passivity.yaml`
   `contribution_sign: positive`, read by the engine). Adding a negative act to a country's
   record must never raise its score: under rc.1 an agreement signed with Israel or trade as
   usual ended the penalty. Preview: 5 display scores, 3 bands, 6 passivity decisions (ARG, AZE,
   KOR, MAR, RUS, USA), ρ 0.981.
5. **The pre-existing tier of B8 (+3) does not qualify** (B-47, `passivity.yaml`, an `excluded`
   entry with `tiers`, read by the engine). Otherwise about 100 states escape the penalty for
   the first year once their pre-existing recognitions are recorded, and drop 15 points on
   2024-10-06. 0 changes today; 1 display score and 1 band on 2024-06-30.
6. **A2 and C3 values of data year 2022 are not in force in the window** (P-04 B-63,
   `thresholds.yaml` `parameters.min_window_end`, read by the generators and the derived
   statuses). No computed value rests on data from before 2023-10-07. History only: 40 display
   scores and 10 bands on 2023-12-31; none today. Colombia's A2 becomes `no-data` and
   Hungary's `none-found` (their only HS 93 rows are of 2022), recorded in their assessments.
7. **D1 counts FTS flows dated on or after 2023-10-07** (P-04 B-60, `thresholds.yaml`
   `parameters.flows_from`, read by `pnpm fetch:fts`). 67 attributed government flows dated
   before 7 October 2023 (USD 204,070,341, 20 donors) leave the windows: 171 rows of
   `fts_funding.csv` change (19 donors; windows ending up to 30 September 2024; Cyprus's earlier
   flows fall in no window), rebuilt by
   `pnpm fetch:fts --rebuild` from the archived responses the table cites (SHA-256 checked; the
   rebuild with every flow date first equals the committed table). History only: 5 display
   scores on 2023-12-31; none today.
8. **B9 and B10 speakers are the head of state, the head of government and the foreign
   minister** (R3, B-442, `indicators.yaml`: names, descriptions and evidence rules), the three
   who represent the state without full powers (Vienna Convention on the Law of Treaties,
   art. 7 (2) (a)); not vice-presidents, deputies or spokespersons. Widens B9's name and B10's
   speaker; the events filed under the readings of P-16 (B-444, B-447) already follow it.

Wording (patch level, carried in the same version): the short labels of generated text move
from `packages/scoring/src/labels.ts` to `indicators.yaml` `short` (B-54); D1's name reads "as
a share of GNI" (B-33); A2 and C3 on calendar-year data from each reporter's first release
(B-151 (2)); A4 counts orders dated 2024 or later (B-151 (3)); D1's GNI is the latest year not
after the window (B-151 (4)); FTS's type "Governments" (B-151 (5)); a standing state qualifies
for 365 days from its start (B-151 (6), B-48); derived coverage statuses carry a reason, not a
date (B-151 (7)); "most severe" chosen by points, B5/B6 on one day by id (B-151 (8), B-38);
deviations 7 and 8 of docs/00 in the deviations list (B-151 (9)); states before 7 October 2023
counted from that day (B-44); the A1 coverage reading (B-73); coverage published for the build
date only (B-70); the readings R2, R5, R7–R10, R14, R16–R18 and R22 of docs/calibration §6 (B6's
description no longer dates Hungary's withdrawal); the qualifying-votes list is no longer
described as empty. The site notes that stated these readings (`apps/web/content/readings.*.md`,
`computed.*.md`, B-140) are shortened accordingly.

Effect of the whole set on 2026-10-05:

- Published events (`diff.json`): 120 display scores move by 1 or more, 86 bands (84 Acting →
  Passive, 2 Passive → Enabling), 24 passivity decisions.
- Preview (provisional): 109 display scores, 64 bands (62 Acting → Passive, Enabling →
  Sustaining for Argentina, Sustaining → Enabling for Hungary), 6 passivity decisions, ρ 0.9756.
  Among the ten calibration countries: Germany −1 → −7, the United Kingdom +54 → +52, France
  +48 → +45, Türkiye +77 → +80, Egypt +23 → +20; Spain, Ireland, South Africa, India and the
  United States unchanged. In the history: 41 display scores and 7 bands on 2023-12-31, 151 and
  95 on 2025-12-31.

Rejected: B-23's one-sided cap, B-48's alternative, the pre-existing recognitions from A/78/846
as B8 rows, a quarterly D1 (docs/calibration/README.md §4, §5).

## 1.0.0-rc.1 — initial

Folder `methodology/v1.0.0/`, status release candidate; scores are computed but not displayed
(scorecard mode, D-16).

- Encodes `docs/02-methodology-spec.md` v1.0 and the indicator table of the specification §3:
  34 indicators, of which 31 are scored (categories A–D) and 3 are tracked and unscored
  (category E, D-12).
- Category caps A −45/+30, B −40/+45, C −20/+20, D −15/+25; E −10/+10, computed and shown, never
  summed. Score clipped to −100…+100, rounded half away from zero; bands read from the rounded
  integer.
- Indicator-level caps (A5 −15, A8 +10, B9 +10, B10 −10) and stacking rules (one standing state
  for B8, B12, C1, C4, D3; B11 ministers and settlers held separately; latest position for
  B5/B6; A7 supersedes A6).
- Event types follow the final decisions of docs/02 §3: B3, B5, B6 and C2 are standing states,
  and A6 is a standing state for every suspension, ending on the date the suspension is lifted.
- Scaled indicators, whose points may differ between events of the same country and which record
  the reason for their points: A1, A2, A4, A5, B1, B8, B9, B11, B12, C1, C3, C4, D1 and D3. This
  keeps the list of docs/02 §12.1 (A5, B9, B12 tiers) and extends it to the computed indicators
  (A1, A2, A4, C3, D1) and the other indicators with tiers (B1, B8, B11, C1, C4, D3).
- Confidence weights 1.0 / 0.7 / 0.4 / 0.4; decay flat for 365 days, then linear to 0.25 at
  730 days, then 0; passivity penalty 15 with the qualifying rule of docs/02 §6.
- Formulas and thresholds for the computed indicators A1, A2, A4, C3 and D1 (docs/02 §5).
- Symmetry table of docs/02 §13. Qualifying-votes list empty until the votes are verified (P-14).
- Tone-lint list `banned-words.txt` for event summaries.
- `votes.yaml` entries also carry `quote` and `locator`: the verbatim passage of the archived UN
  press release stating the recorded vote, which becomes the press-release evidence of each
  generated B1 event. Shape only; the list is still empty and no score changes.

### Within 1.0.0-rc.1: structured data (P-14, 2026-09-28)

Filled while the version is a release candidate (scores not displayed, D-16), so no new folder;
the qualifying-votes list was left empty for this session by design.

- `votes.yaml` lists twelve qualifying votes from A/RES/ES-10/21 (27 October 2023) to
  A/RES/80/116 (12 December 2025), each with its archived UN press release, verbatim quote and
  inclusion rationale. Two are added to the seed list of docs/06 §2: A/RES/79/232 (request for
  the ICJ advisory opinion on Israel's obligations towards the UN and UNRWA) and A/RES/80/1
  (participation of the State of Palestine during the 80th session). The vote of 17 September
  2026 (draft A/81/L.2) waits for its resolution symbol.
- B8 is generated from `data/structured/recognitions.csv` (one row per recognising state, with
  the archived official statement) instead of the registry field `recognises_palestine.since`
  (`generated_from` and the evidence rule of `indicators.yaml`); points and stacking unchanged.

### Within 1.0.0-rc.1: French wording (P-18, 2026-09-30)

Wording only, in the French document and the French cells of the generated tables; no point,
cap, threshold, rule or English text changes, and no score moves.

- `methodology.fr.md`: "fréquence de mise à jour" for the update cadence (the table column
  "Fréquence", as on the site) and "par cas" for "per instance"; "fiche" for the event and
  country cards (was "vignette"); "données miroir" (invariable); "le FTS" with its article
  throughout; "partage de renseignements"; "fonds public de retraite", as in the table of C5;
  the Changes page named "Changements", as in the site's navigation.
