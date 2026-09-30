# Methodology changelog

Every change to points, caps, thresholds, decay, passivity, the qualifying-votes list, the
symmetry table or the universe ships as a new version folder under `methodology/` with an entry
here and a `diff.json` listing every country whose displayed score moved by 1 or more, with the
cause (`docs/02-methodology-spec.md` §11, `docs/08-governance.md` §1). Major: scale, category or
universe changes. Minor: indicator, point or threshold changes, new qualifying votes. Patch:
wording.

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

### Within 1.0.0-rc.1: French wording (P-18, 2026-09-30)

Wording only, in the French document and the French cells of the generated tables; no point,
cap, threshold, rule or English text changes, and no score moves.

- `methodology.fr.md`: "fréquence de mise à jour" for the update cadence (the table column
  "Fréquence", as on the site) and "par cas" for "per instance"; "fiche" for the event and
  country cards (was "vignette"); "données miroir" (invariable); "le FTS" with its article
  throughout; "partage de renseignements"; "fonds public de retraite", as in the table of C5;
  the Changes page named "Changements", as in the site's navigation.
