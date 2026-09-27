# data/

The hand-maintained dataset of the index. Schemas and rules: [`docs/03-data-model.md`](../docs/03-data-model.md); research protocol: [`docs/06-sources-playbook.md`](../docs/06-sources-playbook.md). Run `pnpm validate` after every change.

- `countries.yaml`: the universe, one entry per state, with ISR and PSE flagged `excluded` (docs/03 §3).
- `events/{ISO3}.yaml`: hand-authored events, one file per country, sorted by date (docs/03 §4).
- `sources/{YYYY}/{src_id}.yaml`: one file per source, sharded by the year of the document (docs/03 §5).
- `assessments/{ISO3}.yaml`: research status of every indicator for a country (docs/03 §6).
- `structured/*.csv`: tables feeding the generated indicators, header row first (docs/03 §7).
- `corrections.yaml`: the public corrections and retractions log, append-only (docs/03 §8).
- `replies/{ISO3}/{reply_id}.yaml`: right-of-reply records (docs/03 §9).
- `leads/{ISO3}.yaml`: press or NGO claims without a primary document yet; never scored (docs/03 §10).
- `snapshots/{version}/`: frozen outputs of superseded methodology versions only (docs/03 §1).

The archived copies live outside this folder, in `archive/`: `archive/index.csv` (one row per archived source) and `archive/text/{src_id}.txt` (extracted text that quotes are checked against).

Test fixtures live in `fixtures/` at the repository root. Never copy them into `data/`.
