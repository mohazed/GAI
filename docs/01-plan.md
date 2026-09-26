# 01 — Master plan

How the Gaza Accountability Index gets built, filled and published, given the confirmed decisions (`00-decisions.md`). The spec's four phases are kept; what changes is *who does what*: Claude Code sessions build the software and research the data; the author reviews every pull request, recruits reviewers, and decides when the score goes public.

## 1. What is being built

1. A **public monorepo** on GitHub: code (MIT), methodology (CC BY 4.0), data (CC BY 4.0), archives index.
2. A **static site** in English and French with the six pages of spec §6 plus Changes, Corrections, Data/API, Embed and Reply pages, a static JSON API, nightly CSV/JSON dumps, share cards and an embeddable widget.
3. A **dataset**: events, sources, assessments, corrections, replies for 193 scored entities, filled by Claude Code sessions under the protocol in `06-sources-playbook.md`, reviewed by the author as pull requests.
4. A **methodology v1.0.0**, versioned, with sensitivity tables, symmetry table, changelog, and a 14-day public comment process.

## 2. Phases and gates

| Phase | What happens | Sessions (`PROMPTS.md`) | Gate to pass before the next phase |
|---|---|---|---|
| **0 — Foundations** | Repo, schema, scoring engine with tests, pipeline tools (archiver, fetchers, generators, build-data), the whole site in scorecard mode, deploy to `*.pages.dev`, methodology files v1.0.0-rc | P-01 → P-12 | CI green; determinism test passes; the site renders every page in EN and FR with fixture data; anti-slop review passed |
| **1 — Scorecard** | Structured data (votes, vetoes, funding, GNI, SIPRI, Comtrade, recognitions); country registry; the 10 calibration countries then the rest of the 40 under the full protocol; quality passes; French review; launch in **scorecard mode** (no number shown) | P-13 → P-20, with P-D run per country | ≥ 500 published events; calibration worksheet read by three politically different readers; first outside error found and corrected publicly; reviewers recruited (at least one law academic, one arms-trade data person) |
| **2 — Index** | Reviewer sign-off on the indicator table; methodology v1.0.0 finalised; score flag flipped; ranking, compare, sliders, cite, API go live; right-of-reply live | P-22 | First citation by a journalist or NGO |
| **3 — Scale** | Remaining 153 entities under the light protocol; monthly reports; embeddable widgets in newsrooms; Arabic UI; scope-extension debate (Lebanon, West Bank) as a v2.0 proposal | P-21 (repeated), P-23, P-24 | Under 2 h/week maintenance; one institutional partner |

The order inside Phase 0 is deliberate: schema → scoring → pipeline → site, so that every later prompt builds on tested, typed foundations and the data sessions have working tools (`pnpm archive`, `pnpm score`, `pnpm validate`) before the first event is researched.

## 3. Division of labour

**Claude Code (Opus 5.5) does:** all code; all methodology files from this plan; the country registry; structured data fetch and import, including the two browser downloads (UN voting CSV, SIPRI export) through the built-in browser; every country research session; second readings; French translation and French review; quality, design, security and accessibility passes; deploys; monthly refresh sessions; drafts of every reply and correction.

**The author does only what a machine cannot or must not do:** creates the accounts (identity and logins); approves the two browser downloads if the app asks; merges data pull requests (in one of the two review modes below); reads the calibration worksheet with two other readers; recruits the external reviewers; decides when the score goes public; approves replies and corrections. Distribution (Tech for Palestine, newsrooms) is outside the build.

## 4. Manual time, honestly

| Task | When | Time | Can it be cut? |
|---|---|---|---|
| Create accounts (GitHub org, Cloudflare, Internet Archive keys, Comtrade key, project email) | once, before P-01/P-04/P-12 | 30–45 min | No: account creation needs your identity. |
| Approve the two browser downloads (UN votes CSV, SIPRI export) | P-14, then once a year | 5 min | Claude does the clicking; you only approve if a CAPTCHA or a download prompt appears. |
| Merge data PRs, **full review mode** (read every event table, spot-check quotes) | per wave of 5 countries | 20–30 min per country → 15–22 h over the 45 countries; 8 h more for the 153 light-protocol countries | Yes, see the next row. |
| Merge data PRs, **sampled review mode** (CI + second reading gate; you read a 10 % sample) | per wave | 5–10 min per wave → about 2 h for Phase 1, 2 h for Phase 3 | This is the recommended mode if your time is the constraint; the spec's "a human publishes every event" becomes "a human can audit every event and samples them". State the mode on the About page. |
| Calibration reading with two other readers | once, after wave 2 | 2–3 h of your time, plus finding two readers | Could be skipped, but it is the cheapest credibility test in the plan. |
| Recruit two or three reviewers | Phase 1, in parallel | 2–4 h of emails over several weeks | Not for the scorecard launch; required only before the score flag is flipped. |
| Decide the score flip | once | 10 min | No. |
| Approve a drafted reply or correction | as they arrive | 10 min each | No: these are public statements in your name. |

Total mandatory manual work before a scorecard launch in sampled mode: about **4–6 hours**, most of it account setup and the calibration reading. In full review mode add 15–22 hours spread over the waves.

## 4b. Effort estimate (Claude Code sessions)


| Block | Sessions | Wall-clock guess |
|---|---|---|
| Phase 0 software | 12 sessions of 1–3 h | 1–2 weeks part-time |
| Structured data + country registry | 3 sessions | 2–3 days |
| 40 full-protocol countries | 40 sessions of 1–2 h + author review 15–30 min each | 3–5 weeks part-time |
| Quality, French review, design and security passes, launch | 6 sessions | 1 week |
| 153 light-protocol countries | ~50 sessions of 30–60 min (3 countries per session) | 4–6 weeks part-time |
| Monthly maintenance | 1 session per month | 1–2 h |

## 5. Open questions still for the author (defaults apply until answered)

1. **Belligerent states** (IRN, LBN, SYR, YEM): scored like everyone with a page note (default), or excluded like ISR/PSE? Default keeps the universe simple and the rule symmetric; the note says direct hostilities are outside the scale.
2. **The 40 list:** `07-country-list.md` proposes 45 in nine waves; wave 9 is optional. Confirm or swap.
3. **Domain name:** none needed until launch; buy at Cloudflare Registrar when ready.
4. ~~GitHub organisation vs personal account~~ Decided: https://github.com/mohazed/GAI. A transfer to an organisation later is one click in GitHub settings and redirects old links.
5. **Public contact address:** optional; the About and Reply pages (P-10) fall back to the GitHub issue forms if none is given.
6. **Cloudflare Web Analytics:** on or off (default off).

## 6. Success criteria at launch (scorecard mode)

- Every page renders in EN and FR without JavaScript; Lighthouse ≥ 95 on performance, accessibility, best practices, SEO for the country page.
- 40 countries with full assessments, ≥ 500 published events, every event with an archived source and a hash, zero `unchecked` indicators among the 40.
- Corrections page has at least one entry.
- `manifest.json` reproducible from a clone by a third party (tested by the author on a fresh machine).
- No banned word in any summary; no board-ready "AI look" left (design critique pass passed).

## 7. Risks specific to this build

| Risk | Mitigation |
|---|---|
| Claude Code sessions drift from the protocol as context grows | one country per session; the prompt reloads the playbook; second reading is mandatory; CI validates |
| Wayback throttling or failures during research | authenticated SPN2 keys; retries; `archive_status: failed` blocks `confirmed` until fixed |
| Government sites block fetches | Wayback crawl first; built-in browser second; note in assessment third; never invent |
| Author review becomes the bottleneck | Sampled review mode (§4); PR descriptions are tables; five-country waves; CI checks every quote against the archived text |
| GitHub scheduled workflow auto-disables after 60 days without a commit | monthly maintenance session commits; the nightly workflow also fails loudly on the Changes page if the build is older than 3 days |
| The score flag is flipped before the gates | the flip prompt (P-22) refuses when any of the 40 has `unchecked` indicators or when no reviewer is listed on the About page |
