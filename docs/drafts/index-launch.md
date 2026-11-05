<!--
Draft of changes/index-launch.md (P-22; T-P22 dry run of 2026-11-05, docs/review/score-flip-dry-run.md).
Not published, and kept out of changes/ so that no build picks it up. The author moves it to
changes/index-launch.md in the flip commit (docs/review/score-flip-dry-run.md §6, step 7), after:
1. replacing {DATE}, {URL}, {VERSION_DATE} and {CONTACT};
2. replacing the counts in braces with those of `pnpm build:data --date {DATE}` on the published
   dataset (build-notes.json counts, countries.json bands); the preview build of 2026-11-04
   (1,235 reviewed events shown as if published, methodology 1.0.0-rc.1) gave 193 scored entities,
   4 Sustaining, 21 Enabling, 41 Passive, 105 Acting, 22 Confronting; with 1.0.0-rc.2 merged the
   same events give 3, 28, 63, 80, 19;
3. naming the methodology changes between 1.0.0-rc.1 and 1.0.0 in the paragraph "What changed
   since the scorecard" (the CHANGELOG entry of the final version; "none" if the author keeps rc.1);
4. listing the reviewers exactly as methodology/reviewers.yaml names them, with their sign-off links;
5. writing the French version (docs/glossary.fr.md) and having it read by a native reader;
6. deleting this comment.
Site voice: statements of fact, sentence case, no adjectives in summaries, no legal
characterisations (methodology/v1.0.0/banned-words.txt is linted on changes/ once the file is there).
-->

# The index shows scores

Methodology 1.0.0, {DATE}. Address: {URL}

From today the site shows a score for each of the {N_SCORED} entities in the index, its band and its place in the ranking. Until now it showed the scorecard only: the events, the sources and what was checked. The events and the sources are the same; the score is computed from them by the published methodology, version 1.0.0.

## What the number is

The score is a number from −100 to +100. It sums what a government did regarding Gaza since 7 October 2023: each act recorded as an event gives points, positive or negative, by the indicator table of the methodology (34 indicators in five categories: arms, diplomacy and international law, trade, humanitarian, domestic accountability). Each event has a primary document, an archived copy and its SHA-256 hash. Points are weighted by confidence, decay with time for acts that repeat, and are capped per indicator and per category, so that no single kind of act decides the score. Category E, domestic accountability, is shown on the country pages and is not part of the score in version 1.0.

The score is displayed as an integer, rounded half away from zero, and the band is read from that integer:

| Band | Score |
|---|---|
| Sustaining | −100 to −51 |
| Enabling | −50 to −21 |
| Passive | −20 to 0 |
| Acting | +1 to +40 |
| Confronting | +41 to +100 |

On {DATE}: {N_SUSTAINING} Sustaining, {N_ENABLING} Enabling, {N_PASSIVE} Passive, {N_ACTING} Acting, {N_CONFRONTING} Confronting.

## What the number is not

- It is not a legal finding. The index records conduct and documents; it does not say whether any act breaks the law.
- It is not complete. A missing event means that none was found in the sources read. The 45 states of the first phase were researched with the full protocol; the other {N_LIGHT} with a lighter one, and their pages say which indicators were not checked. Every country page shows the share of indicators checked next to the score.
- It does not measure intentions, promises or the views of a population. Announcing a review scores nothing; decisions, laws, votes, deliveries, funding and formal acts on the record do.
- It is not fixed. The score at a date is recomputed from the events in force at that date; the score of any past date can be read with `?date=` on the country page and in `/api/v1/scores/`.
- A difference of a few points between two countries depends on the parameters. The sensitivity tables on the methodology page show which places change when the weights, the passivity penalty, the confidence weights or the decay are set otherwise.

## The passivity rule

A country receives a penalty of 15 points at a date if it has no qualifying event in the 365 days before that date. A qualifying event is a published event of indicators B2 to B12, C1 to C6 or D1 to D5, dated within those 365 days, whose current weighted contribution is at least 2 points in absolute value. Votes at the General Assembly (B1) do not qualify, and neither do arms transfers (category A) nor category E. The rule exists because the scale counts silence: a country with no qualifying act in a year loses 15 points, and a country that has done nothing sits below zero.

<!-- If 1.0.0-rc.2 is merged, replace "at least 2 points in absolute value" with the rc.2 wording
(only contributions of +2 or more lift the penalty) from methodology/v1.0.0/passivity.yaml. -->

## How to change the weights

The ranking and the comparison pages have a panel "Your weights". It sets a weight from 0 to 2 for each of the categories A to D (the default is 1). The weights multiply each category's capped subtotal; the events do not change, and the passivity penalty is subtracted as published. The result is computed in the browser, and the address keeps the weights (`?w=1.0,0.5,1.0,1.0`), so a weighted view can be shared as a link. The site always shows the published score beside a weighted one. The CSV download of the ranking carries the category subtotals for other calculations.

## How to cite

Cite a country at a date, with the methodology version. Each country page has a panel "Cite" with the same reference in three forms, for example:

> Gaza Accountability Index, {COUNTRY}: {SCORE} ({BAND}), methodology v1.0.0, as of {LONG_DATE}, {URL}/en/country/{ISO3}?date={DATE}

The link with `?date=` opens the page as it was computed on that date. A comparison of up to five countries can be cited from the Compare page in the same way. The data files are under `/api/v1/` with a manifest of their SHA-256 hashes; any build can be reproduced from the repository at its commit.

## What changed since the scorecard

{CHANGES_SINCE_RC1}

## Reviewers

The methodology was reviewed before the score was shown by {REVIEWERS}. Their sign-offs are linked on the About page. They reviewed the indicator table and the thresholds, not the events.

## Errors, replies, leads

The forms are unchanged: report an error, right of reply, submit a lead (the Reply page). A confirmed error is corrected in the public corrections log, which keeps the previous version; the score of every date it touches is recomputed. Contact: {CONTACT}
