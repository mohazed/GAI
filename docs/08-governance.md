# 08 — Governance, credibility and the human tasks

Everything in spec §8, made operational for a one-person project with Claude Code as the drafter and GitHub as the public record.

## 1. Methodology changes

1. Open a pull request in the public repo that changes `methodology/` (a new version folder) with a written rationale in `CHANGELOG.md`.
2. CI produces `diff.json` (every country moved ≥ 1 point and why) and posts it as a PR comment.
3. Open a GitHub Discussion linked from the PR, announce it on the site's Changes page ("Proposed: v1.1.0, comment until 2026-11-14"), and leave it open **14 days**.
4. Merge only after the window; the site's version tag updates; the previous version's outputs are frozen under `data/snapshots/`.
5. Major versions additionally require a sign-off comment from at least one named reviewer.

## 2. Reviewers (before flipping the score flag)

Recruit two to three, at minimum one international-law academic and one person with arms-trade data experience. They sign off on the indicator table and thresholds, not on events. Their names and a one-line affiliation disclosure go on the About page.

Where to look: international-law faculties and clinics that filed amicus or intervention work on the ICJ case; former researchers at arms-transfer monitors (SIPRI, Campaign Against Arms Trade, Forum on the Arms Trade, Investigate Europe); the Tech for Palestine network; Disclose and Forensic Architecture contacts. Prefer people who have criticised similar indices in print: their sign-off is worth more.

Email template (EN), to adapt:

> Subject: Review request — indicator table of a conduct index on Gaza (2 hours, named credit)
>
> I am building a public index that scores every state's conduct regarding Gaza since 7 October 2023 on one scale, with every point tied to a dated, archived source. Scores are derived from events; the method is versioned and reproducible from a public repository.
>
> I am asking you to review one document: the indicator table and thresholds (link), about two hours of work. I am not asking you to endorse the project or any score, only to say whether the table is defensible as a description of conduct, and where it is not. Your name and a one-line affiliation would appear on the About page as a reviewer of the methodology, with any caveat you choose to add.
>
> The standpoint of the project is stated openly (link). The site is not live; you would see it before anyone else.

## 3. Phase 0 hand-scoring worksheet

For each of the 10 calibration countries, before any site exists, fill `docs/calibration/{ISO3}.md`:

| Indicator | Event(s) | Points | Confidence | Source (primary) | Notes |
|---|---|---|---|---|---|

Then compute the score by hand with the rules in `02-methodology-spec.md`, and answer: Does the band feel right to (a) someone who thinks most governments have failed, (b) someone who thinks Israel's campaign is justified, (c) someone who does not follow the topic? The three readings are recorded in the worksheet. Adjust thresholds, not events, and record the adjustment in the changelog of v1.0.0-rc.

## 4. Right of reply

- Channels: the GitHub issue form "Right of reply" (fields: country, events contested, the response text, official capacity, contact) and the project email address. The email is answered with the issue link so the exchange is public unless the sender asks otherwise (then the reply is still published, the correspondence is not).
- Clock: published verbatim on the country page within **10 days** of receipt, in the original language with a translation, with the project's answer beneath.
- Effect: contested events move to `disputed` (weight 0.4) until resolved; resolution is a correction, a retraction, or a documented rejection with reasons.
- Anyone (not only governments) can flag an error via the "Report an error" issue form; those go to the corrections process, not to the reply block.

## 5. Corrections

- Every change to a published event's date, points, confidence or evidence requires an entry in `data/corrections.yaml` (CI-enforced).
- The corrections page is public from day one. The first entries should be the project's own, found during backfill (spec §8: an empty corrections page reads as dishonest or unused).
- A correction is announced in the Changes feed and, when material (band change), in the monthly report.

## 6. Recurring checks

| Check | Cadence | Who |
|---|---|---|
| Consistency checks (§12 of methodology spec) | every build | CI |
| Tone audit: read a random sample of 30 summaries for adjectives | monthly | author (a prompt exists in `PROMPTS.md`) |
| Structured sources refresh (FTS monthly, Comtrade quarterly, SIPRI March, votes per session) | as listed | author runs the fetcher prompt |
| Monthly "what changed" report | monthly | generated at build; author reviews |
| Broken-link and Wayback-availability sweep over all sources | quarterly | CI job with a report issue |
| Two-hour maintenance target (spec §9) | weekly | author |

## 7. Independence and money

No funding from any government. Running cost is near zero (see `09-accounts-and-costs.md`). If donations are ever accepted, the source and amount go on the About page. If the project is handed to an organisation (D-01 allows a hand-over, not anonymisation), the methodology repo stays under its own governance with its own reviewers; the About page records the date of hand-over and what changed.

## 8. Threat model and legal posture

- **Defamation.** The site scores states, not persons or companies (companies appear only as named in cited public reports). Summaries are template-generated statements of fact with a primary source. The site's own voice never uses legal characterisations. Right of reply and corrections exist and are fast.
- **Takedown of archived documents.** The repo stores hashes and extracted text under quotation limits, not the documents; Wayback holds the copies. If a Wayback snapshot disappears, the hash and the text extract remain, and the source is flagged "archive unavailable" rather than removed.
- **Harassment of the author.** Signed authorship is the author's decision (D-01). The repository and site expose a project email, not a personal address; GitHub discussions are moderated under a short code of conduct; issue forms require a GitHub account.
- **Platform risk.** Cloudflare Pages can be replaced in an hour by any static host, including the author's VPS; the nightly build produces a complete `out/` folder and the public dumps.
- **Data poisoning via reader submissions.** Leads are never scored; only the author merges.

## 9. Hand-over readiness

Kept true at all times so that a transfer to a media organisation is a checklist, not a project: repository transfer; Cloudflare project transfer or re-deploy; domain transfer; an About page update; the methodology repo's reviewer list carried over; the corrections and replies history intact because it is in git.
