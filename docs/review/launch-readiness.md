# Launch readiness (P-20, run T-P20 of 2026-11-04)

What this is: the verification of every launch criterion of `docs/01-plan.md` §6, with the evidence of each, run on `main` against the live site (https://gaza-accountability-index.pages.dev) and on `data/phase1` with a local preview build (the 1,235 reviewed events shown as if published; never deployed). Nothing was published, tagged, merged or deployed from a preview build. The tag `v0.9.0-scorecard` was not created and the site was not launched: the "Before" line of P-20 is not met (no event published, the corrections log empty, the calibration worksheet not posted), and publishing is the author's step (HANDOFF Part 4).

Commits of the run: `main` 762ccbe (e2e), d7868e8 (dump split), 86a5909 (intermediate region, methodology workflow and notice); `data/phase1` ca4fb3a (assessment statuses), 4d9f15f (merge of `main`), 8de43b7 (this file, the launch note, the build log).

## 1. The criteria

| Criterion (docs/01 §6) | Evidence | State |
|---|---|---|
| Every page renders in EN and FR without JavaScript | Live site: all 486 URLs of `/sitemap.xml` answer 200; each has the right `lang`, exactly one `h1`, a `main` with its text in the served HTML, a Content-Security-Policy meta, and no error text (a script reading the pages with no JavaScript engine). Local preview build: the same checks on the 490 `index.html` files of `apps/web/out`, no problem. CI runs the no-JavaScript Playwright suite on every push. | Met |
| Lighthouse ≥ 95 on performance, accessibility, best practices, SEO for the country page | CI step "Lighthouse CI (performance budgets)" asserts, on `/en/country/DEU/` and `/fr/country/DEU/` among 21 pages: LCP < 1.5 s on the mobile profile with applied throttling, CLS ≤ 0.001, accessibility, best practices and SEO at 100, JavaScript ≤ 150 KB (`apps/web/lighthouserc.cjs`). Result: CI run 41921109698 on `main` (762ccbe), green, ran Lighthouse 3 times on each of the 21 pages (63 runs, both country pages of Germany included) and every assertion passed; the later `main` runs (d7868e8, 86a5909) repeat it. Not run on this Mac (8 GB, no Chrome during the run), and the CI build holds the data of `main`, not the published events of `data/phase1` (see "Page weight" below). | Met on `main`; to repeat on the published data |
| 40 countries with full assessments | 45 full-protocol countries have 34 assessment entries, and the 148 others have them too (193 files in `data/assessments/`). | Met (193) |
| ≥ 500 published events | The live site publishes the 4,834 computed events (UN votes, arms, trade, funding, UNRWA tables). Hand-researched events published: 0 of 1,235 (status `reviewed`; plus one `draft`, `evt_2025_09_29_USA_B10`, never to be published). `pnpm publish:events --pr 11` is the author's step (Part 4, item 1). | Blocking until the author publishes |
| Every event with an archived source and a hash | `pnpm validate`: 0 errors. In the preview dump all 1,235 hand events cite sources that have a record, a `sha256` and a `wayback_url`; 2,081 of the 2,084 source records are `archived`; the 3 `failed` ones (`src_20260928_undl_ga-voting-2026-02-06`, `src_20260929_sipri_tiv-israel-2022-2025`, `src_20260929_undl_voting-es-10-27`) are superseded dataset records the author's downloads replaced (B-903) and no event cites them. | Met |
| Zero `unchecked` among the 45 | The build showed 12 unchecked entries among the 45. Three were a convention gap and are fixed (ESP C4, IRL C4, IRL C5, B-860). Nine remain, all B8, for ARE, AZE, EGY, JOR, MAR, MYS, NGA, QAT, SAU: no document of the state itself stating its recognition is archived (B-860 has the options). | **Not met** (9) |
| Corrections page has at least one entry | `data/corrections.yaml` is empty; the live page reads "No correction has been published yet." Every correction so far was made in place, before publication (the rule for unpublished events). A correction needs a published event. | **Not met** |
| `manifest.json` reproducible from a clone | Live site: a fresh `git clone` of GitHub at the deployed commit (d7868e8), `pnpm install --frozen-lockfile`, `pnpm build:data --date 2026-11-04 --site-url …`: `manifest.json` is byte-identical to the live one and every one of its 1,921 files matches its SHA-256 (the command of the API README §4, exit 0). `data/phase1` at 4d9f15f: the fresh clone's manifest equals the build on this Mac in all 1,921 files except the dump, whose `git.dirty` is `true` here only because of the git-ignored `data/structured/raw/` (352 MB) and `.DS_Store` files; the clone says `false`. `pnpm build:data:check` (two builds, every byte) passes on the real data and the fixtures. | Met |
| No banned word in any summary | `pnpm validate` (tone rule): 0 errors. A second scan with the 280 terms of `methodology/v1.0.0/banned-words.txt` over the 12,910 English and French summaries of the preview build (events and country summaries): 0 hits (the scanner caught `brutal`, `shameful`, `honteusement` and `lâche` in a control sentence). | Met |
| Design critique pass passed | P-17 (B-461 to B-475) ran the critique and the anti-slop checklist on a preview build; every build since enforces the design tokens (no colour outside them, no style attribute, no `oklch`, no Inter: `postbuild.ts`). Nothing changed in the design in this run. | Met |
| The nightly workflow's last run | 39 nightly runs, all successful; the last on 2026-11-04 10:51 UTC (run 41816977146). | Met |
| CI green on `main` and on PR #11 | `main`: green at 762ccbe (run 41921109698), d7868e8 (41922058249) and 86a5909 (41924874746), each with the browser tests, Lighthouse and the deploy. `data/phase1`: red on every push of 2026-11-04 until the end-to-end fix (B-862); green at 8de43b7, push run 41927496713 and PR #11 run 41927502534. The deploy workflow on PR #11 is green too. | Met |

Other checks of the P-20 prompt:

| Check | Evidence |
|---|---|
| `methodology/reviewers.yaml` | Present, `reviewers: []` (valid; schema `ReviewersFile`; `pnpm validate` 0 errors). The About page says "Reviewers: none yet." The score flip needs two or three named reviewers (P-22 gate). |
| Contact address | `CONTACT_EMAIL` is `null` in `apps/web/lib/site.ts`; the About and Reply pages fall back to the issue forms. The author creates the address. |
| Private vulnerability reporting | Enabled (`gh api repos/mohazed/GAI/private-vulnerability-reporting`: `{"enabled":true}`). |
| Open issues | #12 (dev-tool advisories under `@lhci/cli`), #13 (widget under Trusted Types), #14 (Wayback check: archived copies failing) are open and explained in B-858; no "Nightly build failed" issue is open. |
| Branch protection | `main` is not protected (404 from the API). Merge commits only are allowed in the repository settings. |
| Tags | None exist (no `methodology-1.0.0-rc.1`, no `v0.9.0-scorecard`). |
| Page weight (P-17 follow-up (3)) | Preview build, HTML of the country pages: Norway 1,119,339 bytes (151 KB gzipped, English) and 1,128,152 (155 KB, French), Germany 916,518 (125 KB); P-17 measured up to 1.04 MB (115 KB gzipped) with 773 events. 16 of the 390 country pages pass 1 MB. LCP cannot be measured without Chrome; see "Author", item 6. |
| Output size | 5,795 files in `apps/web/out` (limit 20,000 for Cloudflare Pages), none above 20 MB (largest API file about 7 MB after the dump split, B-859). |
| API shape | The JSON dump is split (B-859); `intermediate_region` added to the registry (B-861); `methodology/index.json` has `proposals` (B-863). Each is documented in `apps/web/public/api/README.md`. |

## 2. Blocking items

1. **Nine unchecked indicators among the 45 (B8).** ARE, AZE, EGY, JOR, MAR, MYS, NGA, QAT, SAU. Evidence: `build-notes.json`, `countries/{ISO3}.json` `coverage.unchecked_ids`, the notes in `data/assessments/{ISO3}.yaml` (B8). The decision is the author's (B-860: archive a document, accept A/78/846 as the primary with a flag, or record `no-data`).
2. **The corrections log is empty.** Evidence: `data/corrections.yaml`, the live Corrections page. Docs/08 §5 asks for the project's own first entries, found during the backfill; the backfill's corrections were all made on unpublished events, in place. After publishing, the author's sampled review (Part 4, item 1) is the natural source of the first entry; a correction can be recorded only for a published event.
3. **No hand-researched event is published** (0 of 1,235): the scorecard shows computed values only. This is Part 4, item 1.
4. **The calibration worksheet has not been posted to readers** (Part 4, item 6), so the three "does the band feel right" slots are blank.

None of these can be lifted by a default: each needs the author or a published event.

## 3. Fixed in this run

- The end-to-end failure that kept CI red on `data/phase1` (B-862).
- The JSON dump, 26.5 MB in one file on the full data and above the build's limit, split by record type and year (B-859).
- Three assessment statuses among the 45 (B-860).
- The M49 intermediate region, first in the scorecard peers (B-861, P-17 follow-up).
- docs/08 §1 steps 2 and 3: the methodology-diff workflow and the "Proposed" notice on the Changes page (B-863, P-24 follow-up).
- `changes/launch.md`, the launch note, written as a draft with `{DATE}`, `{URL}` and `{CONTACT}` to fill.

## 4. Launch commands (the author's, after the blocking items)

On `data/phase1`, the dataset first:

```sh
git checkout data/phase1 && git pull
pnpm publish:events --pr 11 [--exclude id,id…]   # sets status: published and review.reviewed_by: mzouad
pnpm lint && pnpm typecheck && pnpm test && pnpm validate && pnpm build:data:check
git add -A && git commit -m "Publish the reviewed events of PR #11"
git push
gh pr merge 11 --merge                           # a merge commit, never squash or rebase
```

Then close PRs #1 to #10 as superseded, check that the deploy of `main` is green, then:

```sh
# the corrections log: at least one entry, for a published event (docs/08 §5), then pnpm validate
git checkout main && git pull
# edit changes/launch.md: {DATE}, {URL}, {CONTACT}; delete the top comment
git add changes/launch.md && git commit -m "Launch note" && git push
git tag -a v0.9.0-scorecard -m "Scorecard launch" && git push origin v0.9.0-scorecard
# confirm the deploy and the live counts
gh run list --workflow deploy.yml --limit 3
curl -s https://gaza-accountability-index.pages.dev/api/v1/manifest.json | jq '.git, .total'
```

## 5. What only the author can do next (P-20's checklist)

1. Review PR #11 and publish (above); close #1 to #10.
2. Take the B8 decision for the nine states (B-860) and decide the other flagged readings (HANDOFF Part 4, item 3).
3. A custom domain (then `SITE_URL` in `deploy.yml` and `nightly.yml`, HSTS `includeSubDomains` and `preload`), Cloudflare Web Analytics yes or no (default off, D-19), the VPS mirror (off), a Cloudflare API token limited to Pages edit on this account, a protected GitHub environment for the deploy secrets, branch protection on `main` as wanted.
4. Create the project address and set `CONTACT_EMAIL`; fill `{CONTACT}` in the launch note; re-read the About page's standpoint.
5. Recruit two or three reviewers (`methodology/reviewers.yaml`; docs/08 §2 has the template) and post the calibration worksheet (`docs/calibration/*.md`) to two or three readers.
6. Look once at `/en/methodology/` and `/en/embed/` in branded Safari and Firefox; run Lighthouse on a build with the full data (`pnpm build:data --preview && pnpm --filter @gai/web build && pnpm --filter @gai/web lighthouse`, on a machine with room for Chrome) and, if LCP on `/en/country/NOR/` passes 1.5 s, move the "All n values" tables of the computed runs out of the page (P-17 follow-up (3)); a French native reader's pass over the French site against `docs/glossary.fr.md`.
7. Post the Discussion for 1.0.0-rc.2 and decide PR #15; when the Discussion is posted, add its entry to `methodology/proposals.yaml` (template in the file) so that the Changes page announces it; remove the entry when the proposal is merged or withdrawn.
8. Distribution (spec §9): the first ten country scorecards to Tech for Palestine for feedback; one novel finding from the data, not the site, to Disclose and one French newsroom.
9. Update `CLAUDE.md`'s commit-trailer line (it names Opus 5.5; sessions since 2026-10-05 ran on Sonnet 5.5).
