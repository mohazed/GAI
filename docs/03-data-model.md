# 03 — Data model (files in git)

The product is the event and source tables; scores are derived (spec §5). Everything lives as YAML/CSV in the public repository so that a clone is the full dataset. Schemas are enforced by `packages/schema` (zod) and by CI.

## 1. Repository tree (data parts)

```
data/
  countries.yaml                  # the universe: 195 entries (193 scored + ISR + PSE flagged excluded)
  events/{ISO3}.yaml              # hand-authored events, one file per country, sorted by date
  sources/{YYYY}/{src_id}.yaml    # one file per source, sharded by year of the document
  assessments/{ISO3}.yaml         # per-indicator research status (coverage input)
  structured/                     # tables feeding the generated indicators
    unga_votes.csv                # resolution, date, iso3, vote (Y|N|A|X)
    unsc_vetoes.csv               # date, draft, vetoed_by, ceasefire (true|false), source (the UN meeting record)
    fts_funding.csv               # iso3, window_start, window_end, usd_paid_committed, plan_ids, retrieved_at, source
    fts_plan_totals.csv           # iso3, plan_id, usd_paid_committed, flows, retrieved_at, source
    sipri_deliveries.csv          # release_date, data_year, supplier_iso3, tiv_to_israel, tiv_total_to_israel, source
    sipri_orders.csv              # release_date, data_year, buyer_iso3, tiv_new_orders_from_israel, source
    comtrade_a2.csv               # iso3, window_start, window_end, release_date, hs, usd, reporter (self|mirror), retrieved_at, source
    comtrade_c3.csv               # iso3, window_start, window_end, release_date, usd_total, usd_2022, reporter, retrieved_at, source
    gni.csv                       # iso3, year, gni_atlas_usd, source
    population.csv                # iso3, year, population, source
    recognitions.csv              # iso3, date, source (the government's statement): B8 (P-14)
    a2_confirmed_military.csv     # iso3, hs (8526|8802), source: A2 confirmations (P-14)
    raw/                          # downloaded files before import; not loaded (files over 25 MB git-ignored)
  corrections.yaml                # public corrections and retractions log
  replies/{ISO3}/{reply_id}.yaml  # right-of-reply records
  leads/{ISO3}.yaml               # unresolved leads (press/NGO claims without a primary yet); never scored
  snapshots/{version}/            # frozen outputs of superseded methodology versions only
archive/
  text/{src_id}.txt               # extracted plain text of the archived document (≤ 200 KB)
  index.csv                       # src_id, url, wayback_url, sha256, bytes, retrieved_at, content_type
methodology/
  v1.0.0/
    indicators.yaml  categories.yaml  bands.yaml  confidence.yaml  decay.yaml
    passivity.yaml   thresholds.yaml  votes.yaml  symmetry.yaml
    banned-words.txt methodology.en.md methodology.fr.md
  CHANGELOG.md
```

## 2. Identifiers

| Thing | Pattern | Example |
|---|---|---|
| Event | `evt_{YYYY}_{MM}_{DD}_{ISO3}_{IND}[_{n}]` | `evt_2025_08_08_DEU_A6`, `evt_2024_03_26_USA_B10_2` |
| Generated event | `evt_{YYYY}_{MM}_{DD}_{ISO3}_{IND}_{slug}` | `evt_2023_10_27_FRA_B1_es-10-21` |
| Source | `src_{YYYYMMDD}_{publisher-slug}_{topic-slug}` | `src_20250808_bundesregierung_ruestungsexporte` |
| Dataset source | `src_{YYYYMMDD}_{dataset}_{release}` | `src_20240311_sipri_at_2023` |
| Reply | `rep_{YYYYMMDD}_{ISO3}_{n}` | `rep_20261102_DEU_1` |
| Correction | `cor_{YYYYMMDD}_{n}` | `cor_20261015_1` |
| Lead | `lead_{YYYYMMDD}_{ISO3}_{n}` | |

Slugs: lowercase ASCII, hyphens, ≤ 40 chars. IDs never change; a corrected event keeps its id and gets a `revision` counter. Dates are the document's date (source) or the action's date (event), never the retrieval date.

## 3. Country record

```yaml
- iso3: DEU
  iso2: DE
  m49: 276
  name: {en: Germany, en_def: Germany, fr: Allemagne, fr_def: "l'Allemagne"}   # *_def: the UNTERM name with its article, the actor of generated summaries (P-13, P-18)
  region: Europe
  subregion: Western Europe
  un_member: true
  observer: false
  excluded: false                 # true only for ISR, PSE, with `excluded_reason`
  memberships:
    unsc: []                      # [{from: 2027-01-01, to: 2028-12-31, permanent: false}]
    eu: true
    nato: true
    arab_league: false
    oic: false
    g20: true
    g7: true
    brics: false
  recognises_palestine: {since: null}   # date or null; a lead: B8 is generated from structured/recognitions.csv (P-14)
  gov_sources:                    # where the research protocol looks first
    - {label: Federal Foreign Office, url: https://www.auswaertiges-amt.de/en, type: mfa, lang: [de, en]}
    - {label: Bundesregierung, url: https://www.bundesregierung.de, type: head_of_government, lang: [de, en]}
    - {label: Bundestag, url: https://www.bundestag.de, type: parliament, lang: [de]}
    - {label: Bundesanzeiger, url: https://www.bundesanzeiger.de, type: gazette, lang: [de]}
  notes: ""
```

## 4. Event record

```yaml
- id: evt_2025_08_08_DEU_A6
  revision: 1
  country: DEU
  indicator: A6
  type: standing                  # standing | repeatable | computed (computed never hand-authored)
  date: 2025-08-08                # action date; start date for standing
  end: null                       # standing only; null = still holds
  points: 10                      # must match indicators.yaml (fixed) or lie in its range (scaled), with `points_rationale`
  points_rationale: ""            # required for scaled indicators (A5, B9, B12 tiers, C1 review/suspension…)
  confidence: confirmed           # confirmed | corroborated | reported | disputed
  scope: [gaza]                   # gaza | lebanon | west-bank | region | related ; only `gaza` is scored in v1
  summary:                        # template-generated, no adjectives, ≤ 200 chars, starts with the actor
    en: "The federal government suspended approval of military exports to Israel that could be used in the Gaza Strip."
    fr: "Le gouvernement fédéral a suspendu l'autorisation des exportations militaires vers Israël susceptibles d'être utilisées dans la bande de Gaza."
  actor: {en: Federal Chancellor, fr: Chancelier fédéral, name: Friedrich Merz}   # required for B9/B10; optional elsewhere
  evidence:
    - source: src_20250808_bundesregierung_ruestungsexporte
      quote: "Die Bundesregierung wird bis auf Weiteres keine Ausfuhren von Rüstungsgütern genehmigen, die im Gazastreifen zum Einsatz kommen können."
      quote_lang: de
      quote_en: "The federal government will, until further notice, not approve exports of military goods that could be used in the Gaza Strip."
      locator: "paragraph 2"       # page, paragraph, row, or video timestamp
  status: published               # draft | reviewed | published | superseded | corrected | retracted
  supersedes: null                # id of the earlier event this replaces (e.g. A7 superseding A6)
  related: []                     # ids of related events (other countries, same act)
  review:
    drafted_by: claude-opus-5-5
    drafted_at: 2026-10-03
    second_read: {by: claude-opus-5-5, at: 2026-10-03, verdict: agree}   # the mandatory independent re-read
    reviewed_by: mzouad
    reviewed_at: 2026-10-05
    notes: ""
```

Rules enforced by the schema:

- `points` sign must match the indicator's sign; magnitude within the indicator's range.
- `confirmed` requires an evidence source of kind `official`, `court` or `dataset`; `corroborated` requires two sources of distinct publishers.
- B9/B10 require `actor.name`, a `quote`, and a source of kind `official` or `official-video`.
- Every `quote` must be found in `archive/text/{source}.txt` after whitespace normalisation, unless `locator` starts with `row` (dataset) or `video`.
- `status: published` requires `review.reviewed_by`.
- `end` only on `standing`; `end ≥ date`.
- One `scope` entry must be `gaza` for the event to score; other scopes are tracked.

## 5. Source record

```yaml
id: src_20250808_bundesregierung_ruestungsexporte
kind: official                    # official | official-video | court | dataset | ngo | press | parliamentary
title: "Pressestatement von Bundeskanzler Merz zur Lage in Gaza"
publisher: Bundesregierung
publisher_type: head_of_government
url: https://www.bundesregierung.de/breg-de/aktuelles/...
wayback_url: https://web.archive.org/web/20260926140312/https://www.bundesregierung.de/...
sha256: 3f2a…                     # of the bytes served by wayback_url at retrieval
bytes: 48213
content_type: text/html
retrieved_at: 2026-09-26T14:03:12Z
language: de
date: 2025-08-08                  # document date
text_file: archive/text/src_20250808_bundesregierung_ruestungsexporte.txt
excerpt: ""                       # optional, for dataset rows: the row itself
notes: ""
```

Rules: `wayback_url`, `sha256`, `retrieved_at` required for every kind except `dataset` rows that point at a `structured/*.csv` file plus that file's own archived origin. Press articles are allowed as `press` sources but can never be the sole support of a `confirmed` event. Video statements need `official-video` (official channel), with a timestamp locator and a transcript in `archive/text/`.

## 6. Assessment record (coverage)

```yaml
country: DEU
protocol_version: 1
last_full_check: 2026-10-05
indicators:
  A1: {status: has-events}
  A2: {status: no-data, checked_at: 2026-10-04, note: "Germany reports HS 93 to Comtrade as confidential; mirror data from Israel used where available; none for 2025."}
  A3: {status: has-events}
  A5: {status: none-found, checked_at: 2026-10-04, queries: ["site:bmvg.de Israel Übung 2024", "Bundeswehr Israel exercise 2025"]}
  B2: {status: not-applicable, note: "not a Security Council member in the window"}
  C5: {status: unchecked}
```

Statuses: `has-events` (at least one published event, set automatically by the build; hand-set value is overwritten), `none-found`, `no-data`, `not-applicable`, `unchecked`. `none-found` and `no-data` must carry `checked_at` and a `note` or `queries`.

## 7. Structured tables

CSV, UTF-8, header row, ISO dates, USD as integers. Every table has a `source` column with a `src_` id of kind `dataset` whose record archives the origin (the API response or downloaded file, hashed); the hand tables verified against documents may cite other archived kinds (`STRUCTURED_SOURCE_KINDS`, B-31): `unsc_vetoes.csv` and `recognitions.csv` an `official` source (the UN meeting record, the government's statement), `a2_confirmed_military.csv` an `official`, `parliamentary`, `ngo` or `press` source (a licence register, a parliamentary answer or a published investigation citing the customs code). When a row is derived from several archived responses (the pages of one FTS query plus the FTS location list; a Comtrade year and its 2022 baseline plus the release-date record), the column lists every id, joined by `;`, and each one must be an archived dataset source. The generators in `packages/pipeline` produce `computed` and `repeatable` events from these tables at build time; generated events are not written into `data/events/` but are published in the API outputs and carry `generated: true`.

`fts_funding.csv`: one row per donor and monthly D1 window (the twelve calendar months before the month the value applies to, docs/02 §5), zeros included for donors with funding in some window. `fts_plan_totals.csv`: the same government funding per donor and plan over all flow dates, for reference; it does not score. `comtrade_a2.csv` and `comtrade_c3.csv` windows are calendar years; `release_date` is the first release of that year's data by the reporter (Israel for mirror rows) in the Comtrade data-availability record, the date the computed event starts.

`unga_votes.csv` columns: `resolution` (symbol, e.g. `A/RES/ES-10/21`), `date`, `iso3`, `vote` (`Y`, `N`, `A`, `X` = absent/non-voting), `source`. Only resolutions listed in `methodology/vX/votes.yaml` are scored; others may be stored for tracking.

`recognitions.csv`: one row per state whose recognition of the State of Palestine is confirmed by an archived official statement, dated the day it took effect; B8 is +8 from that date when it is on or after 2023-10-07, else +3 from 2023-10-07. A state without a row gets no B8 event; while the table does not cover every recognising state, the build derives no B8 status from a missing row. `a2_confirmed_military.csv`: one row per country and HS heading (8526 or 8802) whose exports to Israel a document citing the customs code shows to be military; only then does the heading count in A2 (docs/02 §2).

## 8. Corrections log

```yaml
- id: cor_20261015_1
  date: 2026-10-15
  event: evt_2024_01_27_DEU_D2
  kind: correction                # correction | retraction
  flagged_by: public              # public | author | reply | reviewer
  flagged_ref: "GitHub issue #12"
  before: {date: 2024-01-28, points: -10}
  after: {date: 2024-01-27}
  reason: "Announcement was on 27 January (Federal Foreign Office release), not 28."
```

A correction bumps the event's `revision`; the previous version is retrievable from git history and linked from the log (commit SHA recorded at build).

## 9. Right of reply

```yaml
id: rep_20261102_DEU_1
country: DEU
received_at: 2026-11-02
published_at: 2026-11-09          # must be ≤ received_at + 10 days
from: {org: "Embassy of Germany, Paris", role: "Press office"}
contests: [evt_2025_08_08_DEU_A6]
text: {original: "…verbatim…", lang: de, en: "…", fr: "…"}
response: {en: "…", fr: "…"}     # the project's answer
outcome: disputed                 # none | disputed | corrected | retracted
```

## 10. Leads

Press or NGO claims without a primary document. Stored so the site can say "under investigation" on the country page's coverage note without scoring anything. Fields: id, country, indicator, claim, sources (press/ngo), date, status (`open`, `promoted:evt_…`, `dropped`, reason).

## 11. Lifecycle in git

- A data session works on a branch `data/{wave-or-country}`; new events are `status: draft`, then `reviewed` after the mandatory second read within the same session.
- The author reviews the pull request diff; on merge, CI flips nothing automatically. The session, or the author, sets `status: published` and `review.reviewed_by` before merge. **Only `published` scores.**
- Corrections and retractions are a PR that edits the event and appends to `corrections.yaml`; CI refuses an edit to a published event's `points`, `date`, `confidence` or `evidence` without a matching corrections entry.
- Nothing is ever deleted: retracted events stay in the file with `status: retracted`.
