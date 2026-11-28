# Proposal: the scope of docs/02 §12 rule 8 at the score flip

Draft for the author, written by T-F-METHOD (FINISH-PLAN.md Phase D, docs/10 B-2098). It follows the
format of the 1.0.0-rc.2 drafts (`docs/proposals/v1.0.0-rc.2-*.md` on branch
`methodology/v1.0.0-rc.2`), but it is not a version: no methodology folder, no pull request and no
Discussion were made. The author decides; if a methodology change follows, P-24 makes it as a
version with its changelog entry, `diff.json` and comment window (docs/08 §1).

Counts measured on 2026-11-10 on `data/phase1` (commit 2282c48, methodology 1.0.0-rc.1) with
`pnpm build:data --date 2026-11-10` (`build-notes.json`, kind `unchecked`) and a reading of
`data/assessments/*.yaml`.

---

## The question

docs/02 §12 rule 8 reads: "No `unchecked` indicator on any country when
`NEXT_PUBLIC_SHOW_SCORES=true`." The methodology text of 1.0.0-rc.1 says the same in two places
(`methodology.en.md`, Coverage: "scores are not displayed while any published country has an
unchecked indicator"; Sensitivity tables, check 8). Three other texts give the gate a narrower
scope:

- docs/01 §6 and its risk table: "zero `unchecked` indicators among the 40" (later the 45
  full-protocol countries);
- the P-22 prompt in `PROMPTS.md` and `CHECKUP.md` §6: "no unchecked indicator among the 45
  full-protocol countries";
- the build: `packages/pipeline/src/build/index.ts` writes a note of kind `unchecked` for each
  country and does not fail. Nothing enforces rule 8 in code.

The site publishes a page for each of the 193 scored entities in scorecard mode, so "any published
country" is all 193. The question is which scope the flip uses: all 193, only the countries that
have no unchecked indicator, or a changed rule.

## What is left unchecked after Phase C

**In the hand-written assessments.** Over the 193 files, excluding the generated indicators A1, A2,
A4, B1, B2, B8, C3 and D1, one entry has the status `unchecked`: Bahrain B12 (the Government's
statement of 2 November 2023 on the ambassadors could not be read or archived: `mofa.gov.bh` and
`bna.bh` answer 405, the Wayback captures of BNA for those days are 403 pages; `lead_20261110_BHR_2`,
docs/10 B-2085). Every other hand-researched entry is `has-events` (436), `none-found` (4,576) or
`no-data` (5). The light-protocol completion (T-F-L01 to T-F-L25) filled the 1,285 entries the
finish plan counted.

**In the build.** The build derives the status, and it shows more `unchecked` entries than the
files, for two reasons: a hand-set `has-events` counts only when the country has a published event
of that indicator scoped `gaza` (docs/03 §6; `packages/scoring/src/coverage.ts`), and no
hand-researched event is published yet (1,420 events are `reviewed`, one is `draft`); and B8 is
left to the hand status where `recognitions.csv` has no row.

| What | Entries | Countries | Resolved by |
|---|---|---|---|
| `has-events` with only unpublished events, scoped `gaza` | 419 | (part of the 154) | the author publishing the reviewed events (`pnpm publish:events`) |
| `has-events` whose events are scoped `related` or `west-bank` (BFA, MLI, NER, NRU, VEN B6; SGP B11) | 6 | 6 | a data fix, as docs/10 B-860 (1) did for ESP C4 and IRL C4, C5: `none-found`, with the event ids in the note (the events are recorded and unscored in v1) |
| B8, no row in `recognitions.csv` (the registry gives a recognition of 1988 or later; no document of the state itself is archived, R21) | 30 | 30 | the author's decision of docs/10 B-860 (2) |
| Bahrain B12 (hand status `unchecked`) | 1 | 1 | a Government text read and archived (P-23, another network or a Wayback capture of the BNA item) |
| **Total on 2026-11-10** | **456** | **154** | |

Of the 154 countries, 45 are the full-protocol countries (232 entries: 224 awaiting publication, 8
B8: ARE, AZE, EGY, JOR, MAR, MYS, NGA, SAU) and 109 are light-protocol countries (224 entries). 39
countries have no unchecked entry today; all are countries whose hand-researched record holds no
event.

The 30 B8 countries: ARE, AZE, BGR, BLR, BRN, CRI, DMA, EGY, GRD, GTM, JOR, KAZ, KGZ, KHM, LAO, LBY,
MAR, MYS, NGA, NIC, PHL, PRK, ROU, SAU, SVK, TJK, TKM, UKR, UZB, VUT.

**After publication.** If the author publishes every reviewed event as it stands, 37 entries in 37
countries remain (the 30 B8, Bahrain B12 and the six scope entries); after the six-entry data fix,
31 entries in 31 countries. An event the author rejects in review sends its indicator back to
research, so the count is measured again at the flip (see Checks).

## Options

**(a) All countries (rule 8 as written).** Scores are displayed only when no country of the 193 has
an unchecked indicator. The P-22 gate is widened from the 45 to the 193.

- Methodology: no change. The text of 1.0.0-rc.1 already says "any published country".
- Prompts: the P-22 gate ("no unchecked indicator among the 45") becomes "no `unchecked` note in
  `build-notes.json`" (`counts.unchecked` = 0); `CHECKUP.md` §6 the same.
- Cost: the flip waits for the 31 residual entries to be decided. The B8 decision is already
  pending for eight of the 45 (docs/10 B-860), so the wait is the same decision applied to 30
  states instead of 8, plus Bahrain B12.

**(b) Per country: only countries with no unchecked indicator show a score.** The site switches to
score mode; a country with an unchecked indicator keeps its scorecard (events, sources, coverage)
and shows no number, with the reason ("score not shown: N indicators unchecked").

- Methodology: the two sentences of `methodology.{en,fr}.md` and docs/02 §12 rule 8 change (a new
  version, docs/08 §1; minor, since it changes which scores are shown).
- Code (on `main`, through a pull request): the build publishes a per-country flag; the ranking,
  the map, Compare, the share cards, the widget, the citations and the API's summary lines read it;
  the sensitivity tables are computed over the countries shown. Today the mode is one site-wide
  value (`apps/web/lib/mode.ts`, `NEXT_PUBLIC_SHOW_SCORES`, D-16).
- Effect at the flip, if it were today with the reviewed events published: 156 or 162 countries
  with a score, 31 or 37 without. The countries without a score are not a random set: 30 of them
  lack a 1988 recognition document that the research could not find, which follows how a
  Government archives its records, not its conduct. A ranking with gaps can be read as a ranking of
  the states shown.

**(c) Rule changed: an unchecked indicator is allowed in score mode.** The score is displayed for
every country; an unchecked indicator counts as an empty segment of the coverage bar, as today, and
adds no points.

- Methodology: rule 8 removed or turned into a coverage threshold (for example: no score below a
  set coverage); a new version (minor).
- Code: none, beyond removing the gate from the P-22 prompt.
- Effect: the 31 residual entries would be displayed as empty segments beside a score. Rule 8 is
  one of the published checks that "block publication when they fail"; removing it weakens a
  promise the methodology page makes.

## Recommended default: (a)

Keep rule 8 as written, for all 193 countries, and resolve the residual entries by data before the
flip. Reasons: the residual after publication is small (31 entries); the methodology text already
states this scope, so no version is needed; (b) needs code across the site and leaves a non-random
set of states without a score; (c) weakens a published check.

What (a) needs, in order:

1. The author publishes the reviewed events (author-only; P-22 prerequisite already).
2. The six scope entries (BFA, MLI, NER, NRU, VEN B6; SGP B11) are set to `none-found` with the
   event ids in the note, as docs/10 B-860 (1) did (a data session; scheduled in the P-23 block of
   `PROMPTS.md`).
3. The 30 B8 entries: the author's decision of docs/10 B-860 (2), applied to the 30 states (not only
   the eight of the 45). The recorded default there is option (b): A/78/846 (the UN document that
   lists the date of each recognition) as a flagged primary where it gives a date; Saudi Arabia per
   docs/10 B-950 (1). If the author declines, option (c) there: `no-data` with the note.
4. Bahrain B12: P-23 tries again to read and archive the Government's statement of 2 November 2023.
   Default if it still cannot be read when the flip is prepared: `no-data`, with the note that the
   Government's text exists but could not be archived (the methodology's own definition: "the data
   needed to assess the indicator is not published" in a form the index can archive). This changes
   the T-P21-46 convention (an indicator a Government source would decide and that no reachable
   source can check stays `unchecked`) for the flip only, and it is the author's call.
5. Enforcement: the site build in score mode fails when `build-notes.json` has `counts.unchecked`
   above 0 (a check in `.github/actions/build-site/action.yml` or in `build-data`, on `main`, through
   a pull request), so rule 8 is enforced by the build and not only by the prompt.

## Checks before the flip (any option)

- `pnpm build:data --date {DATE}` on the published dataset; `build-notes.json` `counts.unchecked`
  is 0 under (a), or equals the number of countries shown without a score under (b).
- `pnpm score --country XXX --list` for any country the notes name.
- docs/02 §12, `methodology.{en,fr}.md` and the P-22 prompt state the same scope.

## Not decided here

- The B8 reading itself (docs/10 B-860, B-950 (1); R21 of `docs/calibration/README.md`).
- Whether E1 to E3 (unscored, experimental) fall under rule 8: none is `unchecked` today, so the
  question has no effect at present; the text says "indicator", and the recommended reading is that
  it covers them.
