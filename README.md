# Gaza Accountability Index

The Gaza Accountability Index records what each state has done regarding Gaza since 7 October 2023 and scores that conduct on one scale, from −100 to +100. Every point comes from a dated action with a primary document, an archived copy and a SHA-256 hash. The score describes conduct; it is not a legal finding.

193 entities are scored: the UN member states other than Israel, plus the Holy See. Israel and the State of Palestine are excluded from the ranking, with a note explaining why (decision D-10 in `docs/00-decisions.md`). Until the author enables scores, the site shows events, sources and coverage without a number (D-16).

**Standpoint.** This project was started by someone who believes the response of most governments has been inadequate. The credibility claim is not neutrality; it is that the method is published, versioned and reproducible, so that belief cannot leak into the numbers.

## Repository

- `data/` events, sources, assessments, corrections and replies as YAML
- `methodology/` versioned points, caps and thresholds
- `archive/` hashes and text extracts of archived sources
- `packages/` schema, scoring, pipeline, shared UI
- `apps/` the static site and the embeddable widget
- `docs/` decisions, specification and protocols

## Reproduce a build

Requires Node 22 or later and pnpm.

```bash
git clone https://github.com/mohazed/GAI.git && cd GAI
pnpm install
pnpm lint && pnpm typecheck && pnpm test
pnpm build:data --date 2026-10-01
pnpm build:data:check --date 2026-10-01
```

The same commit and date produce identical output files under `apps/web/public/api/v1/`; `manifest.json` lists the SHA-256 of each file for comparison, and `pnpm build:data:check` builds twice and compares every byte. The API is documented in `apps/web/public/api/README.md`. `pnpm build` (the site) is added in a later build step and is not yet available.

## Errors and replies

See `CONTRIBUTING.md`. Corrections are public and logged.

## Licences

Code: MIT (`LICENSE`). Data and methodology: CC BY 4.0 (`DATA-LICENSE`). Maintained by Mohamed Zouad.
