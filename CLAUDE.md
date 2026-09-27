# Gaza Accountability Index — rules for every Claude Code session

You are building and filling a public index that scores every state's conduct regarding Gaza since 7 October 2023. Credibility is the product. Read this file fully, then the documents listed for your prompt, before touching anything.

## Read first, always

1. `docs/00-decisions.md` — decisions D-01…D-26; cite them ("per D-09") when they drive a choice. Then `docs/10-build-log.md` — every decision taken during the build (B-xx), every departure from the plan, every prompt change, and what is still open or scheduled; cite them ("per B-26").
2. The documents your prompt names. `docs/02-methodology-spec.md`, `docs/03-data-model.md`, `docs/04-architecture.md`, `docs/05-design-system.md`, `docs/06-sources-playbook.md` are the contract; the original spec is `Gaza Accountability Index — Cahier des charges.md`.
3. `PROMPTS.md` to see where your session sits in the sequence.

## Non-negotiables

- **Never fabricate.** No invented events, quotes, URLs, hashes, dates, votes or figures. If a page cannot be fetched, say so in the assessment note and move on. A missing fact is recorded as `none-found`, `no-data` or a lead, never guessed.
- **Nothing scores without a primary document, an archived copy (`wayback_url`) and a `sha256`.** Press and NGO reports are leads or reduced-confidence evidence, exactly as `docs/06-sources-playbook.md` says.
- **Quotes are verbatim** from `archive/text/`; CI checks them. Translations sit beside the original, never instead of it.
- **Do not change the methodology silently.** Points, caps, thresholds, decay, passivity, the qualifying-votes list and the universe live in `methodology/vX.Y.Z/` and change only through a new version folder plus a changelog entry, per `docs/08-governance.md`.
- **Never delete data.** Retract or correct with a `data/corrections.yaml` entry.
- **No secrets in git.** `.env` only; the two Cloudflare secrets only in GitHub Actions.
- **No LLM API calls in the codebase** (D-03). This repository contains no Anthropic SDK usage.
- **Same treatment for every country.** Same protocol, same templates, same layout for positive and negative events. No warmer prose for anyone.
- **Site voice:** statements of fact, sentence case, no adjectives in summaries, no legal characterisations ("complicit", "guilty", "war crime") in the site's own words. Banned words are linted from `methodology/*/banned-words.txt`.

## Engineering conventions

- pnpm workspaces + Turborepo, TypeScript strict, Node 22 or later, Biome for lint/format, Vitest, Playwright smoke tests. React 19, Next.js App Router with `output: 'export'`, Tailwind 4 with the tokens from `docs/05-design-system.md`, `next-intl` for EN/FR.
- Commands (must exist after P-01…P-05): `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm validate` (data + methodology), `pnpm build:data`, `pnpm build`, `pnpm dev`, `pnpm archive <url>`, `pnpm score --country XXX [--date YYYY-MM-DD] [--list]`, `pnpm fetch:fts`, `pnpm fetch:worldbank`, `pnpm fetch:comtrade`, `pnpm import:sipri <file>`, `pnpm import:unvotes <csv>`, `pnpm publish:events --pr N`.
- Pure functions in `packages/scoring`; no I/O there. Every rule in `docs/02-methodology-spec.md` has a unit test with the worked example.
- Determinism: `pnpm build:data --date YYYY-MM-DD` twice must produce identical bytes (D-25).
- Accessibility and performance budgets in `docs/04-architecture.md` §3 are CI gates, not aspirations.
- Small commits with clear messages; build sessions commit to `main` after CI passes locally; data sessions commit to `data/<wave-or-iso3>` and open a PR. Commit messages end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Design conventions (summary; the full contract is `docs/05-design-system.md`)

White ground, cool ink, blue links; Newsreader for numbers and titles only, Source Sans 3 for text, Source Code Pro for codes; band colours are the only other saturated colours and only ever mean bands; no cream-paper-and-terracotta look; hairlines instead of cards; 2 px radii; no gradients, shadows, illustrations, icons-per-heading, emoji, animated counters, purple, Inter, pill buttons, testimonials, or feature grids. Tables for data. Minus sign U+2212. Every chart has a text alternative. The page works without JavaScript. Run the anti-slop checklist (§9) before you call any page done.

## Data conventions (summary; the full contract is `docs/03-data-model.md` and `docs/06-sources-playbook.md`)

One file per country for events and assessments; one file per source; ids follow the patterns in `docs/03-data-model.md` §2; every indicator gets an assessment status; the second reading is mandatory and recorded; the summary follows the template `{Actor} {past-tense verb} {object}{, qualifier}.` in EN and FR.

## How to end every session

1. Run `pnpm lint && pnpm typecheck && pnpm test && pnpm validate` (and `pnpm build` for site sessions). Fix what fails; do not skip.
2. Commit as described above.
3. Add this session's decisions, departures from the plan, prompt changes and open questions to `docs/10-build-log.md` (new B-xx rows, statuses of older rows updated).
4. Print a report with: what was done; what was verified and how; what was **not** done and why; open questions for the author (numbered, each with a recommended default); the exact next prompt id in `PROMPTS.md`.
