# Proposal: absences under Article 19 of the Charter in B1

Draft for the author, written by T-F-METHOD (FINISH-PLAN.md Phase D, docs/10 B-2099). It follows the
format of the 1.0.0-rc.2 drafts (`docs/proposals/v1.0.0-rc.2-*.md` on branch
`methodology/v1.0.0-rc.2`), but it is not a version: no methodology folder, no pull request and no
Discussion were made. The author decides; if a methodology change follows, P-24 makes it as a
version with its changelog entry, `diff.json` and comment window (docs/08 §1).

Inputs: `docs/review/monthly-2026-11.md` §6 (the classification of every absence, T-F-UNDOCS-3),
docs/10 B-626, B-856, B-878, B-879. Scores measured on 2026-11-10 on `data/phase1` (commit 2282c48,
methodology 1.0.0-rc.1) with `pnpm score --country XXX --date 2026-11-10 --json`, with and without
`--preview`.

---

## The question

docs/02 §2 B1: "Absent is scored −2; a formal 'did not participate' is treated as absent."
`data/structured/unga_votes.csv` records every absence as `X` and has no field for entitlement. A
state that had no vote under Article 19 of the Charter (arrears equal to or above its contributions
for the two preceding full years, not permitted to vote by the General Assembly) therefore scores
−2 per vote, as a state that was entitled to vote and did not.

## What the record shows

The twelve qualifying votes of `votes.yaml` have 218 absences by 64 states. Each absence is tied to
the Secretary-General's letter under Article 19 in force on the vote date and to the resolutions
that permitted named states to vote (A/78/336, A/78/707 and five addenda, A/79/338 and Add.1,
A/79/720 and five addenda, A/80/362; A/RES/78/2, 79/3, 80/2; all archived, docs/10 B-878):

- **Not entitled: 30 absences by six states.** Venezuela 12 (every vote), Afghanistan 10 (every vote
  from 10 May 2024), Bolivia 3 (12 June, 12 and 19 September 2025), Sao Tome and Principe 3
  (18 September 2024, 12 and 19 September 2025, when no permission was in force), Ecuador 1
  (10 May 2024), Somalia 1 (18 September 2024).
- **Non-vote: 188 absences by 61 states**, entitled to vote on the date (not named in the letter in
  force, or named and permitted by resolution). The record does not say whether the delegation was
  absent or formally did not participate.

The table of each vote is `docs/review/monthly-2026-11.md` §6.2; the table of each state is §6.3.

## Options

**(a) Keep −2 for every absence (no change).**

**(b) Score 0 for an absence of a state not entitled to vote under Article 19.** A state named in the
Secretary-General's letter in force on the vote date (the last letter with its addenda dated on or
before the vote) and not permitted to vote by a resolution in force that day scores 0 on that vote.
Every other absence keeps −2.

- Methodology (minor version, docs/02 §11): B1's text in docs/02 §2 and `indicators.yaml` gains the
  sentence above; the B1 tiers gain `not-entitled: 0`.
- Data: a dated table beside `unga_votes.csv`, for example `data/structured/unga_article19.csv`
  (`resolution`, `iso3`, `letter` source id, `permission` source id or empty), with the 30 rows of
  §6.2, each citing the archived letter; `unga_votes.csv` keeps the UN's `X` unchanged. A new
  qualifying vote adds its rows from the letter in force (A/81/360 and resolution 81/2 for the 81st
  session, not archived yet).
- Code (in the same pull request as the version, as rc.2 did): the B1 generator reads the table;
  the validator checks that each row's vote is `X` in `unga_votes.csv` and that its sources exist;
  the B1 summary line names the reason ("no vote: not entitled under Article 19").

**(c) Keep −2 and show the reason on the country page.** Beside each absence that §6.2 classes as
not entitled, the country page and the API state "not entitled to vote under Article 19 of the
Charter on this date" with the letter. No score changes and no version is needed; the data table of
(b) is needed for the display.

(b) and (c) combine: score 0 and show the reason.

## Effect of (b), measured on 2026-11-10

The 30 rows were removed from a working copy of `unga_votes.csv` (the build then records no B1 event
for them, which equals 0 points), the scores were taken, and the file was restored (`git checkout`;
nothing committed). "Generated" counts only the published (generated) events; "preview" counts the
1,420 reviewed events as if published (provisional).

| Country | B1 before → after | Generated: display, band | Preview: display, band |
|---|---|---|---|
| Venezuela (VEN) | −10.8 → 0.0 | −23 Enabling → −12 Passive | −9 Passive → +2 Acting |
| Afghanistan (AFG) | −10.8 → 0.0 | −26 Enabling → −15 Passive | −26 Enabling → −15 Passive |
| Bolivia (BOL) | −9.1 → −4.1 | −21 Enabling → −16 Passive | +4 Acting → +9 Acting |
| Sao Tome and Principe (STP) | −10.8 → −7.3 | −26 Enabling → −22 Enabling | −26 Enabling → −22 Enabling |
| Ecuador (ECU) | +3.4 → +3.4 | +4, unchanged | −14, unchanged |
| Somalia (SOM) | +11.8 → +11.8 | −3, unchanged | +4, unchanged |

Four display scores move today and three bands change on the generated events (one on the preview).
Ecuador's and Somalia's absences (May and September 2024) are older than 730 days and no longer
count (decay.yaml), so (b) changes only their history. Earlier dates move more, because the
absences were less decayed; P-24 computes the history in `diff.json`.

**With 1.0.0-rc.2 (PR #15, not merged).** rc.2 caps B1 at −15…+15. The four states' B1 lies between
−10.8 and −4.1 before and after, so the cap does not bind and the deltas above hold under rc.2 on
this date. B1 never ends the passivity penalty under either version.

## Recommended default: (b) with (c)

Score 0 for an absence of a state that had no vote under Article 19, from the dated table, and show
the reason on the country page. Reasons: B1 measures the position a state takes in a vote; a state
without a vote took no position, and −2 records a choice it could not make. Each of the 30 absences
is now tied to an archived document of the Secretary-General, so the rule can be applied from
primary documents and checked by a reader, the same way for every state. The 188 non-votes keep −2,
as docs/02 §2 B1 says.

This differs from the default written by T-P23-4 in the P-24 block of `PROMPTS.md` ("(a), with (c) as
a display change that needs no new version"). That default was set before the letters were archived
(docs/10 B-856); with each absence now tied to a letter (B-878), the reason given for (a) (no
document per vote) no longer holds. If the author prefers no methodology change before the flip,
(c) alone is the fallback: it needs the same table and no version.

## Points the author decides with it (docs/10 B-879)

1. **Ecuador, 10 May 2024.** Classed not entitled on the letters in force; A/78/707/Add.4 (22 May
   2024) reports its payment without a date. Default: keep "not entitled". No effect on today's
   score (older than 730 days).
2. **Somalia, 18 September 2024.** Same position (payment reported by A/79/338/Add.1 of 18 December
   2024, without a date). Default: keep. No effect today.
3. **Session boundaries.** The permissions of 78/2 and 79/3 run "until the end of" a session; the
   opening dates of the 79th (10 September 2024) and 80th (9 September 2025) sessions are calendar
   facts not stated in an archived document. Default: keep (Sao Tome and Principe on 18 September
   2024 and on the two votes of September 2025, Somalia on 18 September 2024 not entitled); archive
   the Assembly's own record of each opening date with the table if (b) is adopted.
4. **"Non-vote" is not a finding of choice.** The label means only that the state was entitled.
   Default: keep the label; the site's text for a non-vote says "no vote recorded".

## Checks for P-24 if (b) is adopted

- `pnpm validate`: every row of the new table matches an `X` in `unga_votes.csv` and cites archived
  sources.
- `pnpm methodology:diff --from <REF> --date {DATE} --write`: the countries that move are among the
  six above, each with the cause "B1: absence while not entitled under Article 19 scored 0".
- The B1 unit tests keep the worked examples of the previous rule (docs/10 B-495) and add one for a
  not-entitled absence.
