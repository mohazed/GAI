<!--
Draft of the launch note (P-20, T-P20 of 2026-11-04). Not published. The author publishes it with the
tag v0.9.0-scorecard (docs/review/launch-readiness.md, "Launch commands"). Before tagging:
1. Replace {DATE} and {URL} (the custom domain, if one is chosen) and set the contact line.
2. Recompute the counts below after `pnpm publish:events --pr 11` with `pnpm build:data` and
   `pnpm validate`; the counts here are those of the preview build of 2026-11-04 (1,235 reviewed
   events shown as if published) and are the numbers expected after publication.
3. Delete this comment.
-->

# Gaza Accountability Index: launch note

Version 0.9.0-scorecard, {DATE}. Address: {URL}

## What the site is

The index records what each state has done regarding Gaza since 7 October 2023. It scores 193 entities: the member states of the United Nations other than Israel, and the Holy See. Israel and Palestine are not scored, because the scale measures the conduct of third states. A state's record is a list of dated events. Each event has a primary document, an archived copy of it and its SHA-256 hash, and a short statement of fact in English and French. The methodology (version 1.0.0-rc.1) gives each kind of act a number of points; the rules are the same for every state, for acts that count in favour and acts that count against.

The site shows, for each state:

- the events, with the source of each, its archive link and the quote it rests on;
- what was checked and what was not, indicator by indicator (34 indicators in five categories), with the searches made;
- the number of events by confidence level and by category, and the share of the indicators checked.

The same data is published as JSON and CSV (the Data page and `/api/v1/`), with a manifest of file hashes; any build can be reproduced from the repository.

## What the site does not do yet

No score, band or ranking is displayed. The index is in scorecard mode: scores are computed in every build and are in the data files, but the site does not show them until the methodology has been reviewed by two or three named external reviewers and the readers' notes on the calibration worksheet are in. The About page lists the reviewers; today it says there are none. The methodology page explains the gates.

The research is of two depths. The 45 states of the first phase were researched with the full protocol: the Ministry's and the Head of State's pages, the structured datasets, one search per indicator group in English and the official language, a second reading of every event against the archived text. The other 148 states were researched with a lighter protocol (the same rules for what counts as an event, fewer sources searched); their pages say which indicators were not checked. A missing event on a page means that none was found in the sources read, not that none exists.

## What the data holds

At the build of {DATE}: 193 scored states; 1,235 events researched and read twice, and 4,834 values computed from structured data (UN votes, arms-transfer data, trade, humanitarian funding, UNRWA tables); 2,084 sources with an archived copy; 232 open leads (claims from the press or from non-governmental reports that have no primary document and are not scored). The corrections log is empty until a published event is corrected.

## How to report an error, reply or send a lead

- **Report an error** in an event (date, quote, source, reading): the public form "Report an error" in the repository's issues. A confirmed error is corrected in the corrections log, which keeps the old version.
- **Reply** (any government, embassy or other party named in an event): the public form "Right of reply". The reply is published verbatim on the country page within 10 days, in its original language with a translation, with the answer of the index beneath it. The events it contests are marked disputed until the matter is resolved. The Reply page of the site describes the steps.
- **Send a lead** (an act the index has not recorded): the public form "Submit a lead". A lead is never scored; it becomes an event only with a primary document, archived.
- Contact: {CONTACT}

All three forms need a GitHub account and are public.

## What comes next

Monthly maintenance (new events, the structured datasets, the quarterly check that archived copies still open). The score is displayed in version 1.0.0, after the reviewers' sign-off; a methodology change is proposed in a pull request and announced on the Changes page for 14 days before it is merged.
