# Launch commands for the author (November 2026)

Written on 2026-11-28 by task T-H-PREP of the launch-plan run (LAUNCH-PLAN.md Part 4, item (5) of the card; docs/10 B-2226), ready for CHECKUP.md §0. Every step below is the author's: an agent of the run did none of them (LAUNCH-PLAN.md Part 3). They follow CHECKUP.md §3 and §6, `docs/review/launch-readiness.md` §4 and `docs/review/score-flip-dry-run.md` §6, updated to the state of 2026-11-28: PR #16, #17, #18, #22 and #23 merged on `main`; PR #11 (dataset), #15 (rc.2) and #19 (rc.3) open; Discussions #20 and #21 posted on 2026-11-28, windows closing on 2026-12-12; `build-notes.json` `counts.unchecked` 0 in the preview.

Run the steps in order. Each ends with a check; stop at the first check that fails.

## Step 1. The sampled review (in a Claude Code session on this repository)

The sample is drawn: `docs/review/author-sample-2026-11.md` (227 events, the first 10 % by SHA-256 of the id plus one event for each other country; B-2223). Open a new session and paste this prompt, with `{EXCLUDED}` left as is (you give the ids after reading):

```
Read CLAUDE.md, docs/03-data-model.md §11 and docs/review/launch-commands-2026-11.md. Review mode: sampled (docs/01-plan.md §4). For PR #11 (branch data/phase1): git checkout data/phase1 && git pull. Re-draw the sample with the command in docs/review/author-sample-2026-11.md and confirm it gives the same 227 ids; if it does not (events were added or removed since), regenerate the file the same way and say what changed. Then show me the sampled events one country at a time, from that file: id, quote, the archived-text excerpt at the locator, the Wayback link, speaker, date, tier, scope and the French summary, and wait after each country for my verdict (ok, fix, or exclude with a reason). Fix what I ask in place (unpublished events: no correction entry), re-checking each changed quote against archive/text. Do not publish anything until I say "go". After my "go": run pnpm lint && pnpm typecheck --concurrency=1 && pnpm test --concurrency=1 && pnpm validate (0 errors); run pnpm publish:events --pr 11 --dry-run --exclude {EXCLUDED} and show me the counts; after my second "go", run pnpm publish:events --pr 11 --exclude {EXCLUDED} (status: published and review.reviewed_by: mzouad with today's date on every reviewed event not excluded); run pnpm build:data and check that build-notes.json counts.unchecked is 0, and if it is not, list the entries each exclusion left without a published event and ask me what to do with each; run pnpm validate and pnpm build:data:check; commit the edited files with the message "Publish the reviewed events of PR #11" and push; then stop and wait for me to merge.
```

What to check for each sampled event is at the top of the sample file (quote at its locator, Wayback copy, R3, R4, R7, tier, scope, French summary).

## Step 2. Publish on `data/phase1` (what the prompt of step 1 runs, by hand)

```sh
git checkout data/phase1 && git pull
pnpm publish:events --pr 11 --dry-run [--exclude id,id…]   # read the counts first
pnpm publish:events --pr 11 [--exclude id,id…]             # status: published, review.reviewed_by: mzouad
pnpm build:data && jq '.counts.unchecked' apps/web/public/api/v1/build-notes.json   # 0 (rule 8)
pnpm lint && pnpm typecheck --concurrency=1 && pnpm test --concurrency=1 && pnpm validate
pnpm build:data:check
git add -A data && git commit -m "Publish the reviewed events of PR #11" && git push
```

- `evt_2025_09_29_USA_B10` stays `draft`: the command leaves drafts as they are.
- An excluded event leaves its assessment entry `has-events` without a published event, which the build reports as `unchecked` and the score-mode build refuses (rule 8, PR #17). Set such an entry to `none-found` with a note, or keep another published event under it, before the flip.
- Expected without exclusions (preview of 2026-11-28): 1,515 published events, `counts.unchecked` 0; before publication the same build gives 145.

## Step 3. Merge PR #11 and close the superseded pull requests

```sh
gh pr checks 11                                            # CI green on the publication commit
gh pr merge 11 --merge                                     # a merge commit, never squash or rebase
for n in 1 2 3 4 5 6 7 8 9 10; do gh pr close $n --comment "Superseded by #11"; done
gh run list --workflow deploy.yml --limit 3                # the deploy of main is green
curl -s https://gaza-accountability-index.pages.dev/api/v1/manifest.json | jq '.git, .total'
```

Then look at a full-protocol page and a light-protocol page (`/en/country/NOR/`, `/en/country/LBY/`) and the other live checks of CHECKUP §4.

## Step 4. Scorecard launch: correction, launch note, tag

Preconditions (CHECKUP §6, step 1): PR #11 published and merged; the defaults of CHECKUP §2f and §2h kept or reversed; at least one entry in `data/corrections.yaml` for a published event (docs/08 §5; on a branch and PR, as any data change after the merge); the calibration worksheets sent to two readers.

```sh
git checkout main && git pull
# changes/launch.md: fill {DATE}, {N_HAND}, {N_COMPUTED}, {N_SOURCES}, {N_LEADS}, {N_CORRECTIONS}
# from `pnpm build:data` (the comment at the top says how), and {CONTACT}; delete the comment
pnpm build:data && pnpm validate
git add changes/launch.md && git commit -m "Launch note (v0.9.0-scorecard)" && git push
git tag -a v0.9.0-scorecard -m "Scorecard launch" && git push origin v0.9.0-scorecard
gh run list --workflow deploy.yml --limit 3
curl -s https://gaza-accountability-index.pages.dev/api/v1/manifest.json | jq '.git, .total'
```

If `main` refuses a direct push (branch protection), commit the note on a branch and merge it by PR with a merge commit, then tag the merge commit.

## Step 5. The methodology proposals (not before 2026-12-12)

The windows of Discussions #20 (rc.2) and #21 (rc.3) close on 2026-12-12 (docs/08 §1, B-2175). Read the comments, then decide (defaults: merge both as proposed, CHECKUP §2a). PR #19 is built on PR #15, so merge #15 first.

```sh
gh pr view 15 --comments && gh pr view 19 --comments
gh api graphql -f query='{repository(owner:"mohazed",name:"GAI"){discussions(first:5,orderBy:{field:CREATED_AT,direction:DESC}){nodes{number title comments{totalCount}}}}}'
gh pr merge 15 --merge                                     # into data/phase1, merge commit
gh pr checks 19                                            # if #19 shows conflicts after #15, merge data/phase1 into its branch first
gh pr merge 19 --merge
# remove the two entries of methodology/proposals.yaml (on main by a PR, then merge main into data/phase1)
pnpm validate && pnpm build:data:check
```

If PR #11 is already merged when the proposals are merged, `data/phase1` reaches `main` again by a new PR (data/phase1 → main, merge commit). The `{REF}` of the flip's `diff.json` depends on this order (`docs/review/score-flip-dry-run.md` §6, step 6). To keep rc.1, close the PRs with a comment and remove the entries the same way.

## Step 6. The score flip (P-22)

After steps 1 to 5, the reviewers' sign-offs in `methodology/reviewers.yaml` (two or three, naming 1.0.0), the three readers' notes in `docs/calibration/`, and the calibration re-run on the published data: the ten steps of `docs/review/score-flip-dry-run.md` §6, ending with

```sh
git tag -a v1.0.0 -m "Methodology 1.0.0; scores shown" && git push origin v1.0.0
```

The flip's note is `docs/drafts/index-launch.md`, moved to `changes/index-launch.md` in the flip commit, with the braces its comment lists filled and its French version.
