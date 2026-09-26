# Contributing

The index is maintained by Mohamed Zouad. Anyone can report an error, submit a right of reply or send a lead. Only the maintainer merges changes to this repository.

All three channels are GitHub issue forms. Issues are public; do not include information you do not want published.

## Report an error

Use the **Report an error** form. Give the country, the event id or page address, what is wrong, and a source that shows it. Errors go through the corrections process: every change to a published event's date, points, confidence or evidence is logged in `data/corrections.yaml` and appears on the public corrections page. Nothing is deleted; retracted events stay in the record with the status `retracted`.

## Right of reply

Any government, embassy or other party named in an event can respond with the **Right of reply** form. Give the country, the events you contest (their ids), the response text in its original language, your official capacity and a contact.

- The response is published verbatim on the country page within 10 days of receipt, with a translation, and the project's answer beneath it.
- Contested events are marked `disputed` until resolved by a correction, a retraction or a documented rejection with reasons.

A reply is not the place for general errors; use **Report an error** for those.

## Submit a lead

Use the **Submit a lead** form for conduct the index may be missing. Include a primary document if one exists (government release, official gazette, UN record, court filing). Leads are never scored as they are: an event scores only after it is checked against a primary document, archived and hashed, following `docs/06-sources-playbook.md`.

## Methodology

Methodology changes follow `docs/08-governance.md` §1: a new version folder, a changelog entry, and a 14-day public comment period in GitHub Discussions.

## Code

Pull requests for code are read but merged only by the maintainer. Before opening one, run `pnpm lint && pnpm typecheck && pnpm test`. Contributions are accepted under the repository licences (MIT for code, CC BY 4.0 for data and methodology).

Participation is governed by `CODE_OF_CONDUCT.md`.
