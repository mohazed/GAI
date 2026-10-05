# Gaza Accountability Index API, version 1

## 1. What the API is

The API is a set of static JSON, CSV and Markdown files. `pnpm build:data` rebuilds all of them from `data/`, `archive/` and `methodology/` for one build date and writes them to `apps/web/public/api/v1/` (docs/04 §2). The site serves them under the base path `/api/v1/`, for example `https://gaza-accountability-index.pages.dev/api/v1/countries.json`, with `Access-Control-Allow-Origin: *` (docs/04 §3; the header is set by the site's `_headers` file). The data are published under CC BY 4.0 (D-15; the code is under MIT). There is no key, no account and no rate limit beyond the host's. Nothing is computed per request: every file comes from one build, and `manifest.json` lists each file with its size and SHA-256.

The examples below are copied from the files of two builds with build date 2026-09-27 and pretty-printed (the files themselves are compact):

- **Fixtures build**: `pnpm build:data --root fixtures --date 2026-09-27`, from `fixtures/`. This is test data and is never deployed (fixtures/README.md). The DEU A6 event and its two sources are real; the correction `cor_20260927_1` and the reply `rep_20260927_DEU_1` are synthetic test records, and their texts say "Test fixture".
- **Real-data build**: `pnpm build:data --date 2026-09-27`, from `data/`. At that date the registry holds DEU, ISR and PSE; DEU is the only scored country, and all its events are generated from the FTS, World Bank and UN Comtrade tables (D1, A2, C3).

Where an example leaves out array elements, keys or the end of a string, the sentence above it says which and how many. Nothing else is changed.

## 2. Conventions

### Format

- JSON files are UTF-8 and compact, with object keys sorted by UTF-16 code unit at every level and one final line feed. A map keyed by indicator therefore lists `B1`, `B10`, `B11`, `B12`, `B2`; arrays keep the order stated for each field.
- Keys are snake_case. Objects are strict: every key of the schema is present, and an absent value is `null`, never a missing key. Two exceptions: `methodology/{version}.json` reproduces the YAML files of a version folder as parsed, so an optional key there is absent when the file omits it; `before` and `after` in a correction hold only the fields that changed.
- Dates are `YYYY-MM-DD` UTC calendar dates. `retrieved_at` is an ISO 8601 UTC date-time. Weeks are ISO 8601 weeks (`2026-W39`, Monday to Sunday); months are `YYYY-MM`.
- Text for readers is bilingual: an object with `en` and `fr`. Inside text, a negative number uses the minus sign U+2212 (`Score −15`); JSON and CSV numbers use the ASCII hyphen-minus (`-15`).
- CSV files are UTF-8, with a header row, LF line endings and a final LF. A field is quoted when it holds a comma, a quote or a line break; booleans are `true` and `false`; `null` is an empty field; numbers are written in full precision.
- Identifiers follow docs/03 §2: events `evt_{YYYY}_{MM}_{DD}_{ISO3}_{IND}[_{n}]`, generated events `evt_{YYYY}_{MM}_{DD}_{ISO3}_{IND}_{slug}`, sources `src_{YYYYMMDD}_{…}`, replies `rep_{YYYYMMDD}_{ISO3}_{n}`, corrections `cor_{YYYYMMDD}_{n}`, leads `lead_{YYYYMMDD}_{ISO3}_{n}`. Ids never change; a corrected event keeps its id and its `revision` goes up by one.

### Build date

`build_date` is the date passed to the build (`--date`, default today in UTC). The build reads no other clock, so the same inputs and the same date give the same bytes (D-25). Every JSON file whose content depends on the build date carries `build_date`, and the score fields of a country repeat it as `date`. Three kinds of file do not carry it: `scores/{YYYY-MM-DD}.json` (dated by `date`), `changes/{YYYY-MM}.json` (dated by `month`; for the month in progress, `to` is the build date and `complete` is `false`) and `methodology/{version}.json`. CSV files carry no build date; `manifest.json` gives it.

### Scores and subtotals

- `score` is S rounded half away from zero to one decimal. `score_display` is S rounded half away from zero to an integer, from S itself and not from `score`. `band` is read from `score_display` (docs/02 §7).
- Category subtotals are published in full precision: `raw` is the sum of the indicator values after the indicator-level caps, `clipped` is `raw` bounded by the category cap. Category E is computed and shown, never summed (`scored: false`, D-12).
- A reader can recompute S from the published values (docs/02 §7 and §9): S = clip(clipped_A + clipped_B + clipped_C + clipped_D − passivity.value, −100, 100). With reader weights w_k between 0 and 2, S_user = clip(Σ w_k · clipped_k − passivity.value, −100, 100); weights of 1 give back the published S. A file that gives only `passivity_applied` (`scores/{date}.json`, series points, `scores-daily-{YYYY}.csv`) implies a penalty of `passivity.points` (15 in methodology 1.0.0-rc.1) when it is `true` and 0 when it is `false`. Real-data build, DEU at 2026-09-27: −3 + 0 − 5 + 6 − 0 = −2, so `score` is −2, `score_display` −2 and `band` `passive`.
- Series points (`series` in a country file, `points` in `series.json`) carry one-decimal subtotals, because the change points are cut on one-decimal values. The exact subtotals of any date are in `scores/{date}.json`.
- Movers compare S in full precision at two dates; a country is a mover when its display score changed.

### Coverage

`coverage` is the research status of the dataset at the build date (docs/02 §8, D-09): ratio = (has-events + none-found) / applicable, over the 31 scored indicators. It is not recomputed for earlier dates, because the assessments record what was checked, not when. `scores/{date}.json`, the series and `scores-daily-{YYYY}.csv` therefore carry no coverage. `no_export_data` is `true` when A1 or A2 is `no-data`: the card then says "no export data", never a zero.

### The `scored` and `generated` flags

- `scored` on an event: the event can contribute to the score (status `published`, scope including `gaza`, indicator in categories A to D). Whether it counts at the build date is given by `at_build.reason`. `scored` on a category is `false` for E; on an assessment row it is `false` for E1, E2 and E3 (tracked, outside coverage, D-12).
- `generated: true`: the build computed the event from the tables in `data/structured/` (D-08) for one of the indicators B1, B2, A1, A2, A4, C3 and D1. A generated event has `actor: null`, `review.drafted_by` `@gai/pipeline generate`, `review.drafted_at` the date in the id of its first source, and no second reading or review. Its points come from the formula or the tiers of `thresholds.yaml`, and `points_rationale` gives the figures. Each evidence entry quotes one row of a structured table (`locator` `row N of data/structured/{table}.csv`) and cites one dataset source that archives the response the row came from.

### Assessment statuses of the generated indicators

Each assessment row gives `hand_status` (what `data/assessments/{ISO3}.yaml` says, `unchecked` when absent), `derived` (for B1, B2, A1, A2, A4, C3 and D1: the status read from the tables, with its reason; `null` when the tables say nothing), `status` (what coverage uses) and `override` (set when a rule replaced the hand-written status; its `reason` is `published-event`, `no-published-event`, `unsc-rule`, `before-first-release` or `derived:{reason}`). The rules, applied in this order at the build date (packages/pipeline/src/build/assessments.ts):

| Indicator | Derived status (`reason`) |
|---|---|
| Any of the seven | `has-events` (`generated-event`) when a published generated event of the indicator, scoped to gaza, is dated on or before the build date. Nothing overrides it. |
| A1 | Before the first post-war SIPRI release (`no_data_before` of formula a1, 2024-03-11 in 1.0.0-rc.1): `no-data` (`before-first-release`) for every country. With a release in force: `none-found` (`release-without-deliveries`, share s = 0) for a country without an event, or `no-data` (`row-not-computable`) when the country's row has deliveries but no computable share. No release in force: `no-data` (`no-release`). |
| A2 | A row of the country in `comtrade_a2.csv` released on or before the date: `none-found` (`row-without-counted-exports`). No row: `no-data` (`no-row`). |
| C3 | A row of the country in `comtrade_c3.csv` released on or before the date: `none-found` (`row-without-event`). No row: `no-data` (`no-row`). |
| A4 | A SIPRI orders release in force whose data year starts on or after `orders_signed_from` of formula a4 (2023-10-07 in 1.0.0-rc.1): `none-found` (`release-without-orders`), except a country whose row of the data year in the latest such release is 0 TIV (SIPRI's 0: below 0.5 TIV, or the size of the order is not known): `no-data` (`orders-without-tiv`). None: `no-data` (`no-release`). |
| D1 | Funding above zero in a window that ended before the date, and no usable GNI: `no-data` (`no-gni`). Otherwise `none-found` (`no-funding`): no FTS row, or only zero rows, is a real zero (docs/02 §5). |
| B2 | Not on the Security Council in the window: no derived status (coverage sets `not-applicable`). Elected member: `none-found` (`no-veto-power`). Permanent member: `none-found` (`no-ceasefire-veto`) once `unsc_vetoes.csv` has rows. |
| B1 | Only `has-events`; otherwise the hand-written assessment decides. |

A table without rows was not imported: its indicator keeps the hand-written status (`derived: null`), except A1 before the first post-war release, and `build-notes.json` carries an `assessment-derived` note. A hand-written status that the tables contradict gives an `assessment-disagreement` note, and the derived status is used; a derived `has-events` is set without a note.

The first two assessment rows of DEU in the real-data build: A1 keeps its hand-written status (`sipri_deliveries.csv` has no rows), A2 is `has-events` from generated events.

```json
[
  {
    "category": "A",
    "checked_at": null,
    "derived": null,
    "hand_status": "unchecked",
    "indicator": "A1",
    "name": {
      "en": "Major conventional arms delivered to Israel, scaled by share of Israel's imports",
      "fr": "Armes conventionnelles majeures livrées à Israël, pondérées par la part dans les importations d'Israël"
    },
    "note": null,
    "override": null,
    "queries": [],
    "scored": true,
    "status": "unchecked"
  },
  {
    "category": "A",
    "checked_at": null,
    "derived": {
      "reason": "generated-event",
      "status": "has-events"
    },
    "hand_status": "unchecked",
    "indicator": "A2",
    "name": {
      "en": "Ammunition, components, dual-use military goods exported (HS 93, 8710, 8802, 8526)",
      "fr": "Munitions, composants, biens militaires à double usage exportés (SH 93, 8710, 8802, 8526)"
    },
    "note": null,
    "override": {
      "from": "unchecked",
      "reason": "derived:generated-event",
      "to": "has-events"
    },
    "queries": [],
    "scored": true,
    "status": "has-events"
  }
]
```

### Scorecard mode (D-16)

Outputs always carry the scores; the site decides what to show. For scorecard mode (`NEXT_PUBLIC_SHOW_SCORES=false`) the API also carries text without score or band: `summary_scorecard` beside `summary`, `citations.scorecard` beside `citations.score`, and the `.scorecard.md` and `.scorecard.fr.md` monthly reports beside the `.md` and `.fr.md` ones. The summary lines count the published events scoped to gaza, computed values (A1, A2, A4, C3, D1) excepted. `summary` ends with the last change of the score; `summary_scorecard` ends with the latest of the counted events (`latest_event`), or "none".

### What is published

- An event is published when its status is public: `published`, `corrected`, `superseded` or `retracted`. Drafts and reviewed events are not published; `build-notes.json` lists them as `unpublished-event`. Only `published` events score: the others appear with `scored: false` and `at_build.reason` `not-published`.
- Events of an excluded entity (D-10) or of a code missing from `data/countries.yaml` are not published (`unregistered-country` notes).
- Leads (press or NGO claims without a primary document, never scored, docs/03 §10) are published as counts and ids only: `leads` in a country file gives the number of open leads and their indicators, and `leads` in the dump gives the `id`, `country` and `indicator` of each open lead. The claims themselves are not published.
- A reply is published from its `published_at` date, a correction from its `date`.

## 3. Endpoints

All paths are relative to `/api/v1/`.

| Path | Holds |
|---|---|
| `countries.json` | Every registry entry, with the score of each scored country at the build date |
| `countries/{ISO3}.json` | One country in full |
| `countries/{ISO3}/events.json` | One country's published events and the sources they cite |
| `countries/{ISO3}/series.json` | One country's daily score as change points |
| `scores/index.json` | The dates with a scores file |
| `scores/{YYYY-MM-DD}.json` | Every scored country on one date |
| `methodology/index.json` | Methodology versions and the changelog |
| `methodology/{version}.json` | One methodology version |
| `changes/latest.json` | Movers, recent changes, the last five weeks, the list of months |
| `changes/{YYYY-MM}.json` | The changes of one month |
| `changes/{YYYY-MM}.md`, `.fr.md`, `.scorecard.md`, `.scorecard.fr.md` | The monthly report |
| `corrections.json` | The corrections log |
| `replies.json` | The published replies |
| `sensitivity.json` | The sensitivity tables |
| `build-notes.json` | Notes of the build |
| `manifest.json` | Git commit, methodology, build date, and size and SHA-256 of every other file |
| `dumps/events.csv`, `dumps/sources.csv`, `dumps/assessments.csv` | Tables of events, sources and assessments |
| `dumps/countries.csv`, `dumps/countries.scorecard.csv` | Every country at the build date, as the ranking table shows it, with and without scores |
| `dumps/registry.csv` | The country registry: codes, names, regions, memberships, recognition of Palestine |
| `dumps/scores-daily-{YYYY}.csv` | Daily scores, one file per year |
| `dumps/gai-{YYYY-MM-DD}.json` | The whole published dataset at the build date |

### 3.1 `countries.json`

Every entry of `data/countries.yaml` at the build date, by ISO3. A scored country carries the score fields; an excluded entity (ISR, PSE, D-10) carries `excluded: true` and `excluded_reason` instead.

- `counts`: `total`, `scored`, `excluded`.
- Registry fields: `iso3`, `iso2`, `m49`, `name`, `region`, `subregion`, `un_member`, `observer`, `memberships` (`unsc` is a list of terms `{from, to, permanent}`; each other membership is `true`, `false` or `{since, until, note}`), `member_of` (the memberships held on the build date), `recognises_palestine_since`.
- Score fields: `methodology`, `date` (the build date), `score`, `score_display`, `band`, `band_name`, `passivity_applied`, `passivity`, `categories`, `coverage`, `events`, `last_change`, `latest_event`, `summary`, `summary_scorecard`.
- `passivity`: `applied`; `points`, the size of the penalty, applied or not; `value`, what is subtracted (`points` when applied, else 0); `window_days`; `qualifying`, the ids of the qualifying events at the build date, by date then id.
- `categories`: A to E, each with `raw`, `clipped`, `cap` (`min`, `max`), `capped`, `scored` and `weight` (1 at the published score).
- `coverage`: `ratio`; the counts `applicable`, `has_events`, `none_found`, `no_data`, `unchecked`, `not_applicable`; `missing` (no-data and unchecked indicators), `no_data_ids`, `unchecked_ids`, `not_applicable_ids`, all in methodology order; `no_export_data`; `statuses`, the status of each of the 31 scored indicators.
- `events`: the published events scoped to gaza dated on or before the build date, computed values excepted, as `total`, per confidence level, and per category in `by_category` (A to E, adding up to `total`; scorecard mode shows these counts in place of the category subtotals, D-16).
- `last_change`: the latest day on which an event step changed the score, or `null`. `kind` is `event` or `passivity`; `event`, `indicator` and `change` (`start`, `end`, `expire`) name the step that moved S most that day; `points` is the net change of that indicator's value that day, after its cap; `effect` is what that step alone did to S, in full precision; `delta` is score(d) − score(d − 1), to one decimal; `passivity.before` and `passivity.after` give the flag on the two days. When a computed value replaces another on the same day, `points` and `effect` differ: in the real-data build, on 2026-07-01 a D1 value of +6 started as the +3 value ended, so `points` is 3, `effect` 6 and `delta` 3.
- `latest_event`: the latest counted event (`date`, `id`, `indicator`, `points`), or `null`.

Example (fixtures build). `countries` keeps DEU and ISR, and leaves out PSE (1 of 3 entries). In DEU's `coverage`, `missing` and `unchecked_ids` keep their first 3 ids (26 left out of each), and `statuses` keeps its first 6 keys (25 of 31 left out).

```json
{
  "build_date": "2026-09-27",
  "countries": [
    {
      "band": "passive",
      "band_name": {
        "en": "Passive",
        "fr": "Passivité"
      },
      "categories": {
        "A": {
          "cap": {
            "max": 30,
            "min": -45
          },
          "capped": false,
          "clipped": 0,
          "raw": 0,
          "scored": true,
          "weight": 1
        },
        "B": {
          "cap": {
            "max": 45,
            "min": -40
          },
          "capped": false,
          "clipped": 0,
          "raw": 0,
          "scored": true,
          "weight": 1
        },
        "C": {
          "cap": {
            "max": 20,
            "min": -20
          },
          "capped": false,
          "clipped": 0,
          "raw": 0,
          "scored": true,
          "weight": 1
        },
        "D": {
          "cap": {
            "max": 25,
            "min": -15
          },
          "capped": false,
          "clipped": 0,
          "raw": 0,
          "scored": true,
          "weight": 1
        },
        "E": {
          "cap": {
            "max": 10,
            "min": -10
          },
          "capped": false,
          "clipped": 0,
          "raw": 0,
          "scored": false,
          "weight": 1
        }
      },
      "coverage": {
        "applicable": 30,
        "has_events": 1,
        "missing": [
          "A1",
          "A2",
          "A3"
        ],
        "no_data": 0,
        "no_data_ids": [],
        "no_export_data": false,
        "none_found": 0,
        "not_applicable": 1,
        "not_applicable_ids": [
          "B2"
        ],
        "ratio": 0.03333333333333333,
        "statuses": {
          "A1": "unchecked",
          "A2": "unchecked",
          "A3": "unchecked",
          "A4": "unchecked",
          "A5": "unchecked",
          "A6": "has-events"
        },
        "unchecked": 29,
        "unchecked_ids": [
          "A1",
          "A2",
          "A3"
        ]
      },
      "date": "2026-09-27",
      "events": {
        "by_category": {
          "A": 1,
          "B": 0,
          "C": 0,
          "D": 0,
          "E": 0
        },
        "confirmed": 1,
        "corroborated": 0,
        "disputed": 0,
        "reported": 0,
        "total": 1
      },
      "excluded": false,
      "iso2": "DE",
      "iso3": "DEU",
      "last_change": {
        "change": "end",
        "date": "2025-11-24",
        "delta": -10,
        "effect": -10,
        "event": "evt_2025_08_08_DEU_A6",
        "indicator": "A6",
        "kind": "event",
        "passivity": {
          "after": true,
          "before": true
        },
        "points": -10
      },
      "latest_event": {
        "date": "2025-08-08",
        "id": "evt_2025_08_08_DEU_A6",
        "indicator": "A6",
        "points": 10
      },
      "m49": 276,
      "member_of": [
        "eu",
        "nato",
        "g20",
        "g7"
      ],
      "memberships": {
        "arab_league": false,
        "brics": false,
        "eu": true,
        "g20": true,
        "g7": true,
        "nato": true,
        "oic": false,
        "unsc": []
      },
      "methodology": "1.0.0-rc.1",
      "name": {
        "en": "Germany",
        "fr": "Allemagne"
      },
      "observer": false,
      "passivity": {
        "applied": true,
        "points": 15,
        "qualifying": [],
        "value": 15,
        "window_days": 365
      },
      "passivity_applied": true,
      "recognises_palestine_since": null,
      "region": "Europe",
      "score": -15,
      "score_display": -15,
      "subregion": "Western Europe",
      "summary": {
        "en": "Score −15 (Passive). 1 event, 1 confirmed. Coverage 3%. Last change: 2025-11-24, export licence suspension, ended (A6, −10).",
        "fr": "Score −15 (Passivité). 1 événement, dont 1 confirmé. Couverture 3 %. Dernier changement : 2025-11-24, suspension de licences d'exportation, fin (A6, −10)."
      },
      "summary_scorecard": {
        "en": "1 event, 1 confirmed. Coverage 3%. Latest event: 2025-08-08, export licence suspension (A6, +10).",
        "fr": "1 événement, dont 1 confirmé. Couverture 3 %. Dernier événement : 2025-08-08, suspension de licences d'exportation (A6, +10)."
      },
      "un_member": true
    },
    {
      "excluded": true,
      "excluded_reason": {
        "en": "Party to the conflict. The index measures the conduct of third states, so Israel is not scored (D-10).",
        "fr": "Partie au conflit. L'indice mesure la conduite des États tiers, Israël n'est donc pas noté (D-10)."
      },
      "iso2": "IL",
      "iso3": "ISR",
      "m49": 376,
      "member_of": [],
      "memberships": {
        "arab_league": false,
        "brics": false,
        "eu": false,
        "g20": false,
        "g7": false,
        "nato": false,
        "oic": false,
        "unsc": []
      },
      "name": {
        "en": "Israel",
        "fr": "Israël"
      },
      "observer": false,
      "recognises_palestine_since": null,
      "region": "Asia",
      "subregion": "Western Asia",
      "un_member": true
    }
  ],
  "counts": {
    "excluded": 2,
    "scored": 1,
    "total": 3
  },
  "methodology": "1.0.0-rc.1"
}
```

### 3.2 `countries/{ISO3}.json`

One country in full at the build date. For a scored country: the fields of its `countries.json` entry, plus:

- `build_date`.
- `indicators`: the indicators with at least one event of the country, in methodology order: `id`, `category`, `raw` (sum of the counted contributions), `value` (`raw` bounded by the indicator-level cap), `cap` (`null` when the indicator has none), `capped`, `counted` (ids of the events counted at the build date).
- `assessment`: `protocol_version`, `last_full_check` and `indicators`, one row for each of the 34 indicators, in methodology order (see section 2 for `status`, `hand_status`, `derived` and `override`), with `checked_at`, `note` and `queries` from the assessment file.
- `event_list`: every published event of the country, by date then id, in the shape of section 3.3.
- `sources`: every source the events cite, keyed by id.
- `replies` and `corrections`: the country's entries of `replies.json` and `corrections.json`.
- `leads`: `open` (number of open leads) and `indicators`.
- `series`: the daily score as change points, as in section 3.4.
- `citations`: APA, Chicago and plain citations of the build-date snapshot in English and French, `score` with the score and band, `scorecard` without them (D-16).
- `permalink`: the dated country pages, `/{lang}/country/{ISO3}?date={build_date}`.

Example (fixtures build, DEU). The keys shared with the `countries.json` entry (section 3.1) are left out, and so are `event_list`, `sources`, `replies` and `corrections`, which hold the objects shown in sections 3.3, 3.13 and 3.12. `assessment.indicators` keeps its first 2 rows (32 of 34 left out); `series` keeps its first point (2 of 3 left out).

```json
{
  "assessment": {
    "indicators": [
      {
        "category": "A",
        "checked_at": null,
        "derived": null,
        "hand_status": "unchecked",
        "indicator": "A1",
        "name": {
          "en": "Major conventional arms delivered to Israel, scaled by share of Israel's imports",
          "fr": "Armes conventionnelles majeures livrées à Israël, pondérées par la part dans les importations d'Israël"
        },
        "note": null,
        "override": null,
        "queries": [],
        "scored": true,
        "status": "unchecked"
      },
      {
        "category": "A",
        "checked_at": null,
        "derived": null,
        "hand_status": "unchecked",
        "indicator": "A2",
        "name": {
          "en": "Ammunition, components, dual-use military goods exported (HS 93, 8710, 8802, 8526)",
          "fr": "Munitions, composants, biens militaires à double usage exportés (SH 93, 8710, 8802, 8526)"
        },
        "note": null,
        "override": null,
        "queries": [],
        "scored": true,
        "status": "unchecked"
      }
    ],
    "last_full_check": null,
    "protocol_version": 1
  },
  "build_date": "2026-09-27",
  "citations": {
    "score": {
      "en": {
        "apa": "Zouad, M. (2026, September 27). Germany: −15 (Passive) (Methodology version 1.0.0-rc.1) [Data set]. Gaza Accountability Index. https://gaza-accountability-index.pages.dev/en/country/DEU?date=2026-09-27",
        "chicago": "Zouad, Mohamed. “Germany: −15 (Passive).” Gaza Accountability Index, methodology v1.0.0-rc.1, September 27, 2026. https://gaza-accountability-index.pages.dev/en/country/DEU?date=2026-09-27.",
        "plain": "Gaza Accountability Index, Germany: −15 (Passive), methodology v1.0.0-rc.1, as of 27 September 2026, https://gaza-accountability-index.pages.dev/en/country/DEU?date=2026-09-27"
      },
      "fr": {
        "apa": "Zouad, M. (2026, 27 septembre). Allemagne : −15 (Passivité) (version 1.0.0-rc.1 de la méthodologie) [Jeu de données]. Gaza Accountability Index. https://gaza-accountability-index.pages.dev/fr/country/DEU?date=2026-09-27",
        "chicago": "Zouad, Mohamed. « Allemagne : −15 (Passivité) ». Gaza Accountability Index, méthodologie v1.0.0-rc.1, 27 septembre 2026. https://gaza-accountability-index.pages.dev/fr/country/DEU?date=2026-09-27.",
        "plain": "Gaza Accountability Index, Allemagne : −15 (Passivité), méthodologie v1.0.0-rc.1, au 27 septembre 2026, https://gaza-accountability-index.pages.dev/fr/country/DEU?date=2026-09-27"
      }
    },
    "scorecard": {
      "en": {
        "apa": "Zouad, M. (2026, September 27). Germany (scorecard) (Methodology version 1.0.0-rc.1) [Data set]. Gaza Accountability Index. https://gaza-accountability-index.pages.dev/en/country/DEU?date=2026-09-27",
        "chicago": "Zouad, Mohamed. “Germany (scorecard).” Gaza Accountability Index, methodology v1.0.0-rc.1, September 27, 2026. https://gaza-accountability-index.pages.dev/en/country/DEU?date=2026-09-27.",
        "plain": "Gaza Accountability Index, Germany (scorecard), methodology v1.0.0-rc.1, as of 27 September 2026, https://gaza-accountability-index.pages.dev/en/country/DEU?date=2026-09-27"
      },
      "fr": {
        "apa": "Zouad, M. (2026, 27 septembre). Allemagne (fiche d'évaluation) (version 1.0.0-rc.1 de la méthodologie) [Jeu de données]. Gaza Accountability Index. https://gaza-accountability-index.pages.dev/fr/country/DEU?date=2026-09-27",
        "chicago": "Zouad, Mohamed. « Allemagne (fiche d'évaluation) ». Gaza Accountability Index, méthodologie v1.0.0-rc.1, 27 septembre 2026. https://gaza-accountability-index.pages.dev/fr/country/DEU?date=2026-09-27.",
        "plain": "Gaza Accountability Index, Allemagne (fiche d'évaluation), méthodologie v1.0.0-rc.1, au 27 septembre 2026, https://gaza-accountability-index.pages.dev/fr/country/DEU?date=2026-09-27"
      }
    }
  },
  "indicators": [
    {
      "cap": null,
      "capped": false,
      "category": "A",
      "counted": [],
      "id": "A6",
      "raw": 0,
      "value": 0
    }
  ],
  "leads": {
    "indicators": [],
    "open": 0
  },
  "permalink": {
    "en": "https://gaza-accountability-index.pages.dev/en/country/DEU?date=2026-09-27",
    "fr": "https://gaza-accountability-index.pages.dev/fr/country/DEU?date=2026-09-27"
  },
  "series": [
    {
      "band": "passive",
      "categories": {
        "A": {
          "clipped": 0,
          "raw": 0
        },
        "B": {
          "clipped": 0,
          "raw": 0
        },
        "C": {
          "clipped": 0,
          "raw": 0
        },
        "D": {
          "clipped": 0,
          "raw": 0
        },
        "E": {
          "clipped": 0,
          "raw": 0
        }
      },
      "date": "2023-10-07",
      "passivity_applied": true,
      "score": -15,
      "score_display": -15,
      "transitions": []
    }
  ]
}
```

For an excluded entity the file holds the registry fields, `excluded`, `excluded_reason`, `build_date` and `methodology`. Example (fixtures build), the whole file:

```json
{
  "build_date": "2026-09-27",
  "excluded": true,
  "excluded_reason": {
    "en": "Party to the conflict. The index measures the conduct of third states, so Israel is not scored (D-10).",
    "fr": "Partie au conflit. L'indice mesure la conduite des États tiers, Israël n'est donc pas noté (D-10)."
  },
  "iso2": "IL",
  "iso3": "ISR",
  "m49": 376,
  "member_of": [],
  "memberships": {
    "arab_league": false,
    "brics": false,
    "eu": false,
    "g20": false,
    "g7": false,
    "nato": false,
    "oic": false,
    "unsc": []
  },
  "methodology": "1.0.0-rc.1",
  "name": {
    "en": "Israel",
    "fr": "Israël"
  },
  "observer": false,
  "recognises_palestine_since": null,
  "region": "Asia",
  "subregion": "Western Asia",
  "un_member": true
}
```

### 3.3 `countries/{ISO3}/events.json`

The country's published events, by date then id, and the sources they cite: `build_date`, `methodology`, `iso3`, `events`, `sources` (keyed by id). The same event objects are in `event_list` of the country file and in the dump.

Event fields:

- `id`, `revision`, `country`, `indicator`, `indicator_name`, `category`, `type` (`standing`, `repeatable`, `computed`), `date`, `end` (standing and computed events: the first day the state no longer holds; `null` while it holds), `points`, `points_rationale`, `confidence`, `scope`, `summary`, `actor` (`en`, `fr`, `name`, or `null`), `evidence` (`source`, `quote` verbatim in `quote_lang`, `quote_en` and `quote_fr` translations or `null`, `locator`), `status`, `supersedes`, `related`, `generated`, `review` (`drafted_by`, `drafted_at`, `second_read`, `reviewed_by`, `reviewed_at`, `notes`), `scored`.
- `at_build`, the evaluation at the build date (docs/02 §3 and §6): `reason` (`counted`, `not-published`, `out-of-scope`, `not-yet`, `ended`, `expired`, `excluded`, `superseded`, `earlier-position`, `less-severe`, `same-tier`); `factor` (1 or 0 for standing and computed events, the decay d(Δ) for repeatable ones); `weight` (the confidence weight); `value` (own contribution p · w · d, 0 when the event cannot score); `counted` (what it adds to its indicator after the stacking rules, before the indicator cap); `qualifies` (counts against the passivity penalty); `by` (for `superseded`, `earlier-position`, `less-severe` and `same-tier`: the event that counts instead).
- `previous_points`: for a computed event, the points of the computed value of the same country and indicator in force the day before; `null` for the first value and after a gap, and for other events.
- `corrections` and `replies`: ids of the corrections log entries naming the event and of the published replies contesting it.

Source fields: `id`, `kind`, `title`, `publisher`, `publisher_type`, `url`, `wayback_url`, `archive_status`, `archive_url_alt`, `sha256`, `bytes`, `content_type`, `retrieved_at`, `language`, `date` (the document's date), `text_file`, `excerpt`, `origin`, `notes`.

Example (fixtures build, DEU): a hand-written standing event, scoped to gaza, that ended on 2025-11-24. It is a real event; its review fields, the correction id and the reply id it lists are test fixture records. `sources` keeps its first source (1 of 2 left out).

```json
{
  "build_date": "2026-09-27",
  "events": [
    {
      "actor": {
        "en": "Federal Chancellor",
        "fr": "Chancelier fédéral",
        "name": "Friedrich Merz"
      },
      "at_build": {
        "by": null,
        "counted": 0,
        "factor": 0,
        "qualifies": false,
        "reason": "ended",
        "value": 0,
        "weight": 1
      },
      "category": "A",
      "confidence": "confirmed",
      "corrections": [
        "cor_20260927_1"
      ],
      "country": "DEU",
      "date": "2025-08-08",
      "end": "2025-11-24",
      "evidence": [
        {
          "locator": "paragraph 6",
          "quote": "Unter diesen Umständen genehmigt die Bundesregierung bis auf Weiteres keine Ausfuhren von Rüstungsgütern, die im Gazastreifen zum Einsatz kommen können.",
          "quote_en": "Under these circumstances, the federal government will not approve, until further notice, any exports of military equipment that could be used in the Gaza Strip.",
          "quote_fr": null,
          "quote_lang": "de",
          "source": "src_20250808_bundesregierung_ruestungsexporte-gaza"
        },
        {
          "locator": "paragraph 19",
          "quote": "Die mit der Pressemitteilung der Bundesregierung vom 8. August 2025 bekanntgegebenen Beschränkungen zum Rüstungsexport nach Israel werden aufgehoben. Die Aufhebung wird ab dem 24. November 2025 in Vollzug gesetzt.",
          "quote_en": "The restrictions on arms exports to Israel announced in the federal government's press release of 8 August 2025 are being lifted. The lifting will be put into effect from 24 November 2025.",
          "quote_fr": null,
          "quote_lang": "de",
          "source": "src_20251117_bundesregierung_ruestungsexporte-israel-aufhebung"
        }
      ],
      "generated": false,
      "id": "evt_2025_08_08_DEU_A6",
      "indicator": "A6",
      "indicator_name": {
        "en": "Export licences suspended (partial)",
        "fr": "Licences d'exportation suspendues (suspension partielle)"
      },
      "points": 10,
      "points_rationale": null,
      "previous_points": null,
      "related": [],
      "replies": [
        "rep_20260927_DEU_1"
      ],
      "review": {
        "drafted_at": "2026-09-27",
        "drafted_by": "claude-opus-5-5",
        "notes": "Test fixture. Real event and sources, verified in P-02; not reviewed by the maintainer and not part of the published dataset.",
        "reviewed_at": "2026-09-27",
        "reviewed_by": "fixture",
        "second_read": {
          "at": "2026-09-27",
          "by": "claude-opus-5-5",
          "notes": null,
          "verdict": "agree"
        }
      },
      "revision": 2,
      "scope": [
        "gaza"
      ],
      "scored": true,
      "status": "published",
      "summary": {
        "en": "The Federal Chancellor stated that the federal government would not approve, until further notice, exports of military equipment that could be used in the Gaza Strip.",
        "fr": "Le chancelier fédéral a déclaré que le gouvernement fédéral n'autoriserait pas, jusqu'à nouvel ordre, les exportations d'équipements militaires susceptibles d'être utilisés dans la bande de Gaza."
      },
      "supersedes": null,
      "type": "standing"
    }
  ],
  "iso3": "DEU",
  "methodology": "1.0.0-rc.1",
  "sources": {
    "src_20250808_bundesregierung_ruestungsexporte-gaza": {
      "archive_status": "archived",
      "archive_url_alt": null,
      "bytes": 107672,
      "content_type": "text/html;charset=UTF-8",
      "date": "2025-08-08",
      "excerpt": null,
      "id": "src_20250808_bundesregierung_ruestungsexporte-gaza",
      "kind": "official",
      "language": "de",
      "notes": "Test fixture source (P-02). Pressemitteilung 178 of 8 August 2025, Presse- und Informationsamt der Bundesregierung (BPA). Existing Wayback capture found with the CDX API (first capture of the page, 2025-08-08 10:29:07 UTC); no new capture requested. sha256 and bytes are of the decoded response body (Wayback serves this capture with gzip content-encoding). Text extracted from the <main> element.",
      "origin": null,
      "publisher": "Bundesregierung",
      "publisher_type": "head_of_government",
      "retrieved_at": "2026-09-26T22:58:53Z",
      "sha256": "a242f7b6918ffa89037e5e3ad3421d9bf0dc53acfbf25a2f59de773b989e177f",
      "text_file": "archive/text/src_20250808_bundesregierung_ruestungsexporte-gaza.txt",
      "title": "Bundeskanzler Friedrich Merz erklärt zur Entwicklung in Gaza:",
      "url": "https://www.bundesregierung.de/breg-de/aktuelles/bundeskanzler-friedrich-merz-erklaert-zur-entwicklung-in-gaza--2377366",
      "wayback_url": "https://web.archive.org/web/20250808102907id_/https://www.bundesregierung.de/breg-de/aktuelles/bundeskanzler-friedrich-merz-erklaert-zur-entwicklung-in-gaza--2377366"
    }
  }
}
```

A generated D1 event (real-data build, `countries/DEU/events.json`, one of its 44 events). `evidence` keeps its first 2 entries; the other 7 quote the same row of `fts_funding.csv` with the six other FTS sources the row names, and row 46 of `gni.csv` with `src_20260927_worldbank_gni-atlas`.

```json
{
  "actor": null,
  "at_build": {
    "by": null,
    "counted": 6,
    "factor": 1,
    "qualifies": true,
    "reason": "counted",
    "value": 6,
    "weight": 1
  },
  "category": "D",
  "confidence": "confirmed",
  "corrections": [],
  "country": "DEU",
  "date": "2026-09-01",
  "end": "2026-10-01",
  "evidence": [
    {
      "locator": "row 541 of data/structured/fts_funding.csv",
      "quote": "DEU,2025-09-01,2026-08-31,105066282,1186;1156;1273;1510,2026-09-27T11:14:55Z,src_20260927_fts_plan-1186-p1;src_20260927_fts_plan-1156-p1;src_20260927_fts_plan-1156-p2;src_20260927_fts_plan-1273-p1;src_20260927_fts_plan-1273-p2;src_20260927_fts_plan-1510-p1;src_20260927_fts_plan-1510-p2;src_20260927_fts_locations",
      "quote_en": null,
      "quote_fr": null,
      "quote_lang": "en",
      "source": "src_20260927_fts_plan-1186-p1"
    },
    {
      "locator": "row 541 of data/structured/fts_funding.csv",
      "quote": "DEU,2025-09-01,2026-08-31,105066282,1186;1156;1273;1510,2026-09-27T11:14:55Z,src_20260927_fts_plan-1186-p1;src_20260927_fts_plan-1156-p1;src_20260927_fts_plan-1156-p2;src_20260927_fts_plan-1273-p1;src_20260927_fts_plan-1273-p2;src_20260927_fts_plan-1510-p1;src_20260927_fts_plan-1510-p2;src_20260927_fts_locations",
      "quote_en": null,
      "quote_fr": null,
      "quote_lang": "en",
      "source": "src_20260927_fts_plan-1156-p1"
    }
  ],
  "generated": true,
  "id": "evt_2026_09_01_DEU_D1_fts",
  "indicator": "D1",
  "indicator_name": {
    "en": "Humanitarian funding to the Gaza response, scaled per capita of GNI",
    "fr": "Financement humanitaire de la réponse à Gaza, rapporté au RNB par habitant"
  },
  "points": 6,
  "points_rationale": "F = USD 105,066,282 (2025-09-01 to 2026-08-31, plans 1186, 1156, 1273, 1510); GNI 2025 = USD 5,026,012,352,665; x = 0.00209% of GNI; tier +6.",
  "previous_points": 6,
  "related": [],
  "replies": [],
  "review": {
    "drafted_at": "2026-09-27",
    "drafted_by": "@gai/pipeline generate",
    "notes": "Generated from data/structured/fts_funding.csv (D-08); not hand-authored.",
    "reviewed_at": null,
    "reviewed_by": null,
    "second_read": null
  },
  "revision": 1,
  "scope": [
    "gaza"
  ],
  "scored": true,
  "status": "published",
  "summary": {
    "en": "Germany paid or committed USD 105.1 million to the oPt flash appeals in the 12 months to 31 August 2026, per FTS.",
    "fr": "L'Allemagne a versé ou engagé 105,1 millions USD aux appels éclair pour le TPO sur les 12 mois clos le 31 août 2026, selon le FTS."
  },
  "supersedes": null,
  "type": "computed"
}
```

### 3.4 `countries/{ISO3}/series.json`

The daily score of one country from 2023-10-07 (`from`) to the build date (`to`), as change points: `build_date`, `methodology`, `iso3`, `from`, `to`, `points`. A point is a day on which the score (one decimal), the display integer, the band, the passivity flag or a category subtotal (one decimal) changed; between two points every value equals the earlier point's, and 2023-10-07 is always a point. Each point has `date`, `score`, `score_display`, `band`, `passivity_applied`, `categories` (A to E, `raw` and `clipped` to one decimal) and `transitions`, the event steps of that day (`id`, `indicator`, `kind`: `start`, `end`, `expire` or `leaves-passivity-window`). On 2023-10-07 the transitions list the events already in force at the window start as `start`.

Example (real-data build, DEU): `points` keeps its first 3 points (6 of 9 left out).

```json
{
  "build_date": "2026-09-27",
  "from": "2023-10-07",
  "iso3": "DEU",
  "methodology": "1.0.0-rc.1",
  "points": [
    {
      "band": "passive",
      "categories": {
        "A": {
          "clipped": -3,
          "raw": -3
        },
        "B": {
          "clipped": 0,
          "raw": 0
        },
        "C": {
          "clipped": -5,
          "raw": -5
        },
        "D": {
          "clipped": 1,
          "raw": 1
        },
        "E": {
          "clipped": 0,
          "raw": 0
        }
      },
      "date": "2023-10-07",
      "passivity_applied": false,
      "score": -7,
      "score_display": -7,
      "transitions": [
        {
          "id": "evt_2023_02_20_DEU_A2_comtrade-2022-self",
          "indicator": "A2",
          "kind": "start"
        },
        {
          "id": "evt_2023_02_20_DEU_C3_comtrade-2022-self",
          "indicator": "C3",
          "kind": "start"
        },
        {
          "id": "evt_2023_10_01_DEU_D1_fts",
          "indicator": "D1",
          "kind": "start"
        }
      ]
    },
    {
      "band": "passive",
      "categories": {
        "A": {
          "clipped": -3,
          "raw": -3
        },
        "B": {
          "clipped": 0,
          "raw": 0
        },
        "C": {
          "clipped": -5,
          "raw": -5
        },
        "D": {
          "clipped": 3,
          "raw": 3
        },
        "E": {
          "clipped": 0,
          "raw": 0
        }
      },
      "date": "2023-12-01",
      "passivity_applied": false,
      "score": -5,
      "score_display": -5,
      "transitions": [
        {
          "id": "evt_2023_11_01_DEU_D1_fts",
          "indicator": "D1",
          "kind": "end"
        },
        {
          "id": "evt_2023_12_01_DEU_D1_fts",
          "indicator": "D1",
          "kind": "start"
        }
      ]
    },
    {
      "band": "passive",
      "categories": {
        "A": {
          "clipped": -3,
          "raw": -3
        },
        "B": {
          "clipped": 0,
          "raw": 0
        },
        "C": {
          "clipped": -5,
          "raw": -5
        },
        "D": {
          "clipped": 6,
          "raw": 6
        },
        "E": {
          "clipped": 0,
          "raw": 0
        }
      },
      "date": "2024-06-01",
      "passivity_applied": false,
      "score": -2,
      "score_display": -2,
      "transitions": [
        {
          "id": "evt_2024_05_01_DEU_D1_fts",
          "indicator": "D1",
          "kind": "end"
        },
        {
          "id": "evt_2024_06_01_DEU_D1_fts",
          "indicator": "D1",
          "kind": "start"
        }
      ]
    }
  ],
  "to": "2026-09-27"
}
```

### 3.5 `scores/index.json`

The dates that have a `scores/{date}.json` file, ascending: `build_date`, `methodology`, `from`, `to`, `count`, `dates`.

Example (real-data build): `dates` keeps its first 3 dates (1084 of 1087 left out).

```json
{
  "build_date": "2026-09-27",
  "count": 1087,
  "dates": [
    "2023-10-07",
    "2023-10-08",
    "2023-10-09"
  ],
  "from": "2023-10-07",
  "methodology": "1.0.0-rc.1",
  "to": "2026-09-27"
}
```

### 3.6 `scores/{YYYY-MM-DD}.json`

Every scored country on one date, by ISO3, one file for each date from 2023-10-07 to the build date: `date`, `methodology`, `countries`. Each entry has `iso3`, `score`, `score_display`, `band`, `passivity_applied` and `clipped`, the clipped category subtotals A to E in full precision. The dated permalink `/country/{ISO3}?date={date}` shows the snapshot from this file (docs/04 §3). No coverage (section 2).

Example (real-data build, `scores/2026-09-27.json`), the whole file:

```json
{
  "countries": [
    {
      "band": "passive",
      "clipped": {
        "A": -3,
        "B": 0,
        "C": -5,
        "D": 6,
        "E": 0
      },
      "iso3": "DEU",
      "passivity_applied": false,
      "score": -2,
      "score_display": -2
    }
  ],
  "date": "2026-09-27",
  "methodology": "1.0.0-rc.1"
}
```

### 3.7 `methodology/index.json`

The methodology versions, the changelog and the reviewers: `build_date`, `current`, `versions` (each with `version`, `folder` in the repository, `status` `current` or `superseded`, `file` in the API, and `frozen`, the API folder of the frozen outputs of a superseded version, or `null`), `changelog`, `methodology/CHANGELOG.md` verbatim, and `reviewers`, the named external reviewers of `methodology/reviewers.yaml` (docs/08 §2; empty until there are reviewers), each with `name`, `expertise` and `disclosure` (`en`, `fr`), `signed_off` (`version`, `date`, `url` of the public sign-off) and `caveat` (`en`, `fr`, or `null`). A superseded version keeps its last outputs, copied verbatim from `data/snapshots/{folder}/` to `methodology/{folder}/`, for example `methodology/v1.0.0/` (docs/02 §11); those files follow the schemas of their own time.

Example (fixtures build; the real-data build gives the same bytes). `changelog` is cut after its first paragraph (the string has 2528 characters).

```json
{
  "build_date": "2026-09-27",
  "changelog": "# Methodology changelog\n\nEvery change to points, caps, thresholds, decay, passivity, the qualifying-votes list, the\nsymmetry table or the universe ships as a new version folder under `methodology/` with an entry\nhere and a `diff.json` listing every country whose displayed score moved by 1 or more, with the\ncause (`docs/02-methodology-spec.md` §11, `docs/08-governance.md` §1). Major: scale, category or\nuniverse changes. Minor: indicator, point or threshold changes, new qualifying votes. Patch:\nwording.",
  "current": "1.0.0-rc.1",
  "reviewers": [],
  "versions": [
    {
      "file": "methodology/1.0.0-rc.1.json",
      "folder": "methodology/v1.0.0",
      "frozen": null,
      "status": "current",
      "version": "1.0.0-rc.1"
    }
  ]
}
```

### 3.8 `methodology/{version}.json`

The files of one version folder as parsed (docs/03 §1), for example `methodology/1.0.0-rc.1.json` for the folder `methodology/v1.0.0`. Top-level keys:

| Key | Holds |
|---|---|
| `version`, `folder`, `status`, `window_start` | Version, repository folder, `current` or `superseded`, first scored day (2023-10-07) |
| `indicators` | `indicators.yaml`: `version`, `cadences`, and `indicators`, the 34 indicators in methodology order |
| `categories` | `categories.yaml`: categories with caps, and `score_clip` |
| `bands` | `bands.yaml`: bands with bounds, names and colour tokens |
| `confidence` | `confidence.yaml`: confidence levels, rules and weights |
| `decay` | `decay.yaml`: the decay function of repeatable events |
| `passivity` | `passivity.yaml`: penalty size, window, qualifying and excluded indicators |
| `thresholds` | `thresholds.yaml`: the formulas of the computed indicators, or `null` |
| `votes` | `votes.yaml`: the qualifying votes, or `null` |
| `symmetry` | `symmetry.yaml`: the symmetry table, or `null` |
| `banned_words` | `banned-words.txt`, in file order (280 entries in 1.0.0-rc.1) |
| `docs` | `methodology.en.md` and `methodology.fr.md`, verbatim |
| `diff` | `diff.json` of the folder, or `null`: `from` and `to` (the previous and this version), `date` (the build date both were scored at) and `countries`, every country whose display score moved by 1 or more, with `iso3`, `name`, `old`, `new` and `cause` (`en`, `fr`) (docs/02 §11). The first version has none. |

Example (fixtures build, `methodology/1.0.0-rc.1.json`): the D1 entry of `indicators.indicators`. A hand-authored indicator has no `generated_from` key.

```json
{
  "authoring": "generated",
  "cadence": "monthly",
  "category": "D",
  "description": {
    "en": "Humanitarian funding to the Gaza response, scaled to the country's GNI: paid and committed contributions from the country's government to the OCHA-tracked oPt flash appeals and the oPt pooled fund in the trailing 12 months, per FTS, divided by GNI. Points are computed by the formula d1 of thresholds.yaml (docs/02 §5).",
    "fr": "Financement humanitaire de la réponse à Gaza, rapporté au RNB du pays : contributions versées et engagées par le gouvernement du pays aux appels éclair pour le Territoire palestinien occupé suivis par OCHA et au fonds commun pour le Territoire palestinien occupé, sur les 12 derniers mois, selon le FTS, divisées par le RNB. Les points sont calculés par la formule d1 de thresholds.yaml (docs/02 §5)."
  },
  "evidence": {
    "requires_actor": false,
    "rule": {
      "en": "Computed from the dataset, never typed in by hand; the formula and the raw rows are downloadable. Rows of `data/structured/fts_funding.csv` (FTS, donor organisation type Government) and `data/structured/gni.csv` (World Bank Atlas) cite dataset sources that archive the API responses.",
      "fr": "Calculé à partir du jeu de données, jamais saisi à la main ; la formule et les lignes brutes sont téléchargeables. Les lignes de `data/structured/fts_funding.csv` (FTS, type d'organisation donatrice Government) et de `data/structured/gni.csv` (méthode Atlas de la Banque mondiale) citent des sources de type dataset qui archivent les réponses des API."
    },
    "source_kinds": null
  },
  "generated_from": "data/structured/fts_funding.csv and data/structured/gni.csv by the formula d1 of thresholds.yaml",
  "id": "D1",
  "indicator_cap": null,
  "name": {
    "en": "Humanitarian funding to the Gaza response, scaled per capita of GNI",
    "fr": "Financement humanitaire de la réponse à Gaza, rapporté au RNB par habitant"
  },
  "not_applicable": null,
  "notes": {
    "en": "Zero is a real zero: FTS is the reference for government humanitarian funding. Known limitation, stated on the methodology page: some bilateral and in-kind aid is not reported to FTS; D4 and D5 capture part of it.",
    "fr": "Zéro est un vrai zéro : le FTS est la référence pour le financement humanitaire des gouvernements. Limite connue, indiquée sur la page de méthodologie : une partie de l'aide bilatérale et en nature n'est pas déclarée au FTS ; D4 et D5 en couvrent une partie."
  },
  "points": {
    "kind": "formula",
    "range": {
      "max": 12,
      "min": 0
    },
    "ref": "d1"
  },
  "primary_sources": [
    {
      "en": "OCHA Financial Tracking Service API",
      "fr": "API du Service de suivi financier (FTS) d'OCHA",
      "url": "https://fts.unocha.org"
    }
  ],
  "scaled": true,
  "scored": true,
  "sign": "positive",
  "stacking": {
    "rule": "sum"
  },
  "superseded_by": [],
  "type": "computed"
}
```

### 3.9 `changes/latest.json`

The changes feed at the build date: `build_date`, `methodology`, `movers`, `recent`, `weeks`, `corrections`, `months`.

- `movers.d7` and `movers.d30`: display-score movers over the 7 and 30 days to the build date (never from before 2023-10-07): `days`, `from`, `to`, `up` (largest rise first) and `down` (largest fall first). A mover has `iso3`, `name`, `from`, `to`, `delta` (one decimal), `display_from`, `display_to` and `display_delta` (never 0).
- A feed entry is either the start of a published event scoped to gaza (`change: start`, on its `date`), or the end of a standing state or of a computed value that no other value of the same indicator replaces that day (`change: end`, on the first day it no longer counts). Repeatable events have no end. Fields: `id`, `country`, `country_name`, `indicator`, `indicator_name`, `category`, `type`, `change`, `date`, `points`, `previous_points` (computed starts; else `null`), `points_changed` (`false` only for a computed start whose points equal the value in force the day before), `confidence`, `generated`, `summary`.
- `recent`: the 20 latest entries dated on or before the build date, newest first, without the computed values whose points did not change.
- `weeks`: the ISO week of the build date and the four before it, newest first; each has `week`, `from` (Monday), `to` (Sunday), `entries` (by date, country, id) and `unchanged_computed` (the entries of computed values whose points did not change, listed and counted).
- `corrections`: corrections dated in the 30 days to the build date, newest first.
- `months`: every month from 2023-10 to the build month, ascending: `month`, `file`, `reports`, `entries`, `complete`.

Example (real-data build). No display score changed in the 7 or 30 days to 2026-09-27, so both mover lists are empty (section 3.10 shows a mover). `recent` keeps its first entry (7 of 8 left out), `weeks` its first 4 weeks (1 of 5 left out), `months` its first month (35 of 36 left out).

```json
{
  "build_date": "2026-09-27",
  "corrections": [],
  "methodology": "1.0.0-rc.1",
  "months": [
    {
      "complete": true,
      "entries": 0,
      "file": "changes/2023-10.json",
      "month": "2023-10",
      "reports": {
        "en": "changes/2023-10.md",
        "fr": "changes/2023-10.fr.md",
        "scorecard_en": "changes/2023-10.scorecard.md",
        "scorecard_fr": "changes/2023-10.scorecard.fr.md"
      }
    }
  ],
  "movers": {
    "d30": {
      "days": 30,
      "down": [],
      "from": "2026-08-28",
      "to": "2026-09-27",
      "up": []
    },
    "d7": {
      "days": 7,
      "down": [],
      "from": "2026-09-20",
      "to": "2026-09-27",
      "up": []
    }
  },
  "recent": [
    {
      "category": "D",
      "change": "start",
      "confidence": "confirmed",
      "country": "DEU",
      "country_name": {
        "en": "Germany",
        "fr": "Allemagne"
      },
      "date": "2026-07-01",
      "generated": true,
      "id": "evt_2026_07_01_DEU_D1_fts",
      "indicator": "D1",
      "indicator_name": {
        "en": "Humanitarian funding to the Gaza response, scaled per capita of GNI",
        "fr": "Financement humanitaire de la réponse à Gaza, rapporté au RNB par habitant"
      },
      "points": 6,
      "points_changed": true,
      "previous_points": 3,
      "summary": {
        "en": "Germany paid or committed USD 105.1 million to the oPt flash appeals in the 12 months to 30 June 2026, per FTS.",
        "fr": "L'Allemagne a versé ou engagé 105,1 millions USD aux appels éclair pour le TPO sur les 12 mois clos le 30 juin 2026, selon le FTS."
      },
      "type": "computed"
    }
  ],
  "weeks": [
    {
      "entries": [],
      "from": "2026-09-21",
      "to": "2026-09-27",
      "unchanged_computed": 0,
      "week": "2026-W39"
    },
    {
      "entries": [],
      "from": "2026-09-14",
      "to": "2026-09-20",
      "unchanged_computed": 0,
      "week": "2026-W38"
    },
    {
      "entries": [],
      "from": "2026-09-07",
      "to": "2026-09-13",
      "unchanged_computed": 0,
      "week": "2026-W37"
    },
    {
      "entries": [
        {
          "category": "D",
          "change": "start",
          "confidence": "confirmed",
          "country": "DEU",
          "country_name": {
            "en": "Germany",
            "fr": "Allemagne"
          },
          "date": "2026-09-01",
          "generated": true,
          "id": "evt_2026_09_01_DEU_D1_fts",
          "indicator": "D1",
          "indicator_name": {
            "en": "Humanitarian funding to the Gaza response, scaled per capita of GNI",
            "fr": "Financement humanitaire de la réponse à Gaza, rapporté au RNB par habitant"
          },
          "points": 6,
          "points_changed": false,
          "previous_points": 6,
          "summary": {
            "en": "Germany paid or committed USD 105.1 million to the oPt flash appeals in the 12 months to 31 August 2026, per FTS.",
            "fr": "L'Allemagne a versé ou engagé 105,1 millions USD aux appels éclair pour le TPO sur les 12 mois clos le 31 août 2026, selon le FTS."
          },
          "type": "computed"
        }
      ],
      "from": "2026-08-31",
      "to": "2026-09-06",
      "unchanged_computed": 1,
      "week": "2026-W36"
    }
  ]
}
```

### 3.10 `changes/{YYYY-MM}.json`

The changes of one month: `month`, `methodology`, `from` (first day of the month; 2023-10-07 for October 2023), `to` (last day of the month, or the build date for the month in progress), `complete`, `weeks` (every ISO week with at least one day in the month, with its full Monday-to-Sunday bounds and only the entries dated inside the month), `movers` (from the day before `from`, or from `from` in October 2023, to `to`; `days` is `null`), `corrections` and `replies` of the month, `counts` (`entries`, `starts`, `ends`, `unchanged_computed`) and `reports`, the paths of the four monthly reports.

Example (real-data build, `changes/2026-07.json`). `weeks` keeps its first 2 weeks (3 of 5 left out, all without entries).

```json
{
  "complete": true,
  "corrections": [],
  "counts": {
    "ends": 0,
    "entries": 1,
    "starts": 1,
    "unchanged_computed": 0
  },
  "from": "2026-07-01",
  "methodology": "1.0.0-rc.1",
  "month": "2026-07",
  "movers": {
    "days": null,
    "down": [],
    "from": "2026-06-30",
    "to": "2026-07-31",
    "up": [
      {
        "delta": 3,
        "display_delta": 3,
        "display_from": -5,
        "display_to": -2,
        "from": -5,
        "iso3": "DEU",
        "name": {
          "en": "Germany",
          "fr": "Allemagne"
        },
        "to": -2
      }
    ]
  },
  "replies": [],
  "reports": {
    "en": "changes/2026-07.md",
    "fr": "changes/2026-07.fr.md",
    "scorecard_en": "changes/2026-07.scorecard.md",
    "scorecard_fr": "changes/2026-07.scorecard.fr.md"
  },
  "to": "2026-07-31",
  "weeks": [
    {
      "entries": [
        {
          "category": "D",
          "change": "start",
          "confidence": "confirmed",
          "country": "DEU",
          "country_name": {
            "en": "Germany",
            "fr": "Allemagne"
          },
          "date": "2026-07-01",
          "generated": true,
          "id": "evt_2026_07_01_DEU_D1_fts",
          "indicator": "D1",
          "indicator_name": {
            "en": "Humanitarian funding to the Gaza response, scaled per capita of GNI",
            "fr": "Financement humanitaire de la réponse à Gaza, rapporté au RNB par habitant"
          },
          "points": 6,
          "points_changed": true,
          "previous_points": 3,
          "summary": {
            "en": "Germany paid or committed USD 105.1 million to the oPt flash appeals in the 12 months to 30 June 2026, per FTS.",
            "fr": "L'Allemagne a versé ou engagé 105,1 millions USD aux appels éclair pour le TPO sur les 12 mois clos le 30 juin 2026, selon le FTS."
          },
          "type": "computed"
        }
      ],
      "from": "2026-06-29",
      "to": "2026-07-05",
      "unchanged_computed": 0,
      "week": "2026-W27"
    },
    {
      "entries": [],
      "from": "2026-07-06",
      "to": "2026-07-12",
      "unchanged_computed": 0,
      "week": "2026-W28"
    }
  ]
}
```

### 3.11 Monthly reports: `changes/{YYYY-MM}.md`, `.fr.md`, `.scorecard.md`, `.scorecard.fr.md`

One Markdown report per month, written from `changes/{YYYY-MM}.json`, in English (`{YYYY-MM}.md`) and French (`{YYYY-MM}.fr.md`), with display scores, and in scorecard mode (`{YYYY-MM}.scorecard.md`, `{YYYY-MM}.scorecard.fr.md`; D-16), which add the line "Scorecard mode: scores are not displayed." and leave out the movers section. Sections: movers, new events by ISO week (computed values recomputed without change are counted, not listed), ended standing states, corrections, methodology. LF line endings, one final LF. The site renders them at `/changes/{YYYY-MM}`.

Example (real-data build, `changes/2026-07.md`), verbatim:

```markdown
# Changes, July 2026

Gaza Accountability Index · methodology v1.0.0-rc.1 · 1 July 2026 to 31 July 2026

## Movers

| Country | From | To | Change |
|---|---:|---:|---:|
| Germany | −5 | −2 | +3 |

## New events

### Week of 29 June 2026

- 2026-07-01 · Germany · D1 · +6 · Germany paid or committed USD 105.1 million to the oPt flash appeals in the 12 months to 30 June 2026, per FTS.

## Ended

None.

## Corrections

None.

## Methodology

Scores for every date are computed with methodology v1.0.0-rc.1; a new methodology version recomputes every date.
```

### 3.12 `corrections.json`

The corrections log up to the build date, by date then id: `build_date`, `corrections`. Each entry has `id`, `date`, `event`, `country` (of the event; `null` when the event is not in the dataset), `kind` (`correction` or `retraction`), `flagged_by` (`public`, `author`, `reply`, `reviewer`), `flagged_ref`, `before` and `after` (the fields that changed), `reason` and `commit`: the mainline commit (first-parent history of the built branch) that added the entry to the log; the previous version of the event is at its first parent (docs/03 §8). `commit` is `null` when the entry is not committed yet, or when the build could not read the history (a shallow clone, no git work tree; `build-notes.json` then has a `history` note).

Example (fixtures build), the whole file. The entry is a synthetic test record; its reason says so.

```json
{
  "build_date": "2026-09-27",
  "corrections": [
    {
      "after": {
        "end": "2025-11-24",
        "evidence": [
          "src_20250808_bundesregierung_ruestungsexporte-gaza",
          "src_20251117_bundesregierung_ruestungsexporte-israel-aufhebung"
        ]
      },
      "before": {
        "end": null,
        "evidence": [
          "src_20250808_bundesregierung_ruestungsexporte-gaza"
        ]
      },
      "commit": "6aa8b83002415d42582dc20c60ce2077a419fdb9",
      "country": "DEU",
      "date": "2026-09-27",
      "event": "evt_2025_08_08_DEU_A6",
      "flagged_by": "author",
      "flagged_ref": "test fixture",
      "id": "cor_20260927_1",
      "kind": "correction",
      "reason": "Test fixture. The end date was added, with its source: the transcript of the government press conference of 17 November 2025, which states that the restrictions are lifted from 24 November 2025."
    }
  ]
}
```

### 3.13 `replies.json`

The replies published on or before the build date, by `published_at` then id: `build_date`, `replies`. Each reply has `id`, `country`, `received_at`, `published_at`, `from` (`org`, `role`), `contests` (event ids), `text` (`original`, `lang`, `en`, `fr`), `response` (the index's response, `en` and `fr`), `outcome` (`none`, `disputed`, `corrected`, `retracted`) and `notes`.

Example (fixtures build), the whole file. The reply is a synthetic test record: no government submitted it, and its text says so.

```json
{
  "build_date": "2026-09-27",
  "replies": [
    {
      "contests": [
        "evt_2025_08_08_DEU_A6"
      ],
      "country": "DEU",
      "from": {
        "org": "Test fixture (no real submission)",
        "role": "none"
      },
      "id": "rep_20260927_DEU_1",
      "notes": null,
      "outcome": "none",
      "published_at": "2026-09-27",
      "received_at": "2026-09-27",
      "response": {
        "en": "Test fixture. No change to the event.",
        "fr": "Donnée de test. Aucune modification de l'événement."
      },
      "text": {
        "en": "Test fixture. This text was written for the test suite; no government submitted it.",
        "fr": "Donnée de test. Ce texte a été rédigé pour la suite de tests ; aucun gouvernement ne l'a soumis.",
        "lang": "en",
        "original": "Test fixture. This text was written for the test suite; no government submitted it."
      }
    }
  ]
}
```

### 3.14 `sensitivity.json`

The sensitivity tables of docs/02 §10, recomputed at each build: `build_date`, `methodology`, `n` (countries ranked), `baseline` (the default ranking) and `tables`, with `id` `passivity` (penalty 5, 15, 25), `weights` (each of A to D at 0.5 and 1.5), `confidence` (`reported` at 0.2 and 0.6), `statements` (B9 and B10 excluded) and `decay` (decay off). Each variant has `id`, `params` (the parameters changed; `null` for the others), `spearman` (Spearman's ρ with the default ranking; `null` with fewer than two countries or when all are tied), `changed_display` (countries whose display score differs from the default) and `ranking`. A ranked entry has `iso3`, `exact` (S in full precision), `score`, `score_display`, `band`, `position` (1-based, score descending, then ISO3) and `rank` (tied scores share the average of their positions).

Example (fixtures build). Each table keeps its first variant: 2 of 3 left out for `passivity`, 7 of 8 for `weights`, 1 of 2 for `confidence`; `statements` and `decay` have one variant each. With one country, every `spearman` is `null`.

```json
{
  "baseline": [
    {
      "band": "passive",
      "exact": -15,
      "iso3": "DEU",
      "position": 1,
      "rank": 1,
      "score": -15,
      "score_display": -15
    }
  ],
  "build_date": "2026-09-27",
  "methodology": "1.0.0-rc.1",
  "n": 1,
  "tables": [
    {
      "id": "passivity",
      "variants": [
        {
          "changed_display": 1,
          "id": "passivity-5",
          "params": {
            "confidence_weights": null,
            "decay": null,
            "exclude_indicators": null,
            "passivity_points": 5,
            "weights": null
          },
          "ranking": [
            {
              "band": "passive",
              "exact": -5,
              "iso3": "DEU",
              "position": 1,
              "rank": 1,
              "score": -5,
              "score_display": -5
            }
          ],
          "spearman": null
        }
      ]
    },
    {
      "id": "weights",
      "variants": [
        {
          "changed_display": 0,
          "id": "weight-A-0.5",
          "params": {
            "confidence_weights": null,
            "decay": null,
            "exclude_indicators": null,
            "passivity_points": null,
            "weights": {
              "A": 0.5,
              "B": null,
              "C": null,
              "D": null
            }
          },
          "ranking": [
            {
              "band": "passive",
              "exact": -15,
              "iso3": "DEU",
              "position": 1,
              "rank": 1,
              "score": -15,
              "score_display": -15
            }
          ],
          "spearman": null
        }
      ]
    },
    {
      "id": "confidence",
      "variants": [
        {
          "changed_display": 0,
          "id": "reported-0.2",
          "params": {
            "confidence_weights": {
              "reported": 0.2
            },
            "decay": null,
            "exclude_indicators": null,
            "passivity_points": null,
            "weights": null
          },
          "ranking": [
            {
              "band": "passive",
              "exact": -15,
              "iso3": "DEU",
              "position": 1,
              "rank": 1,
              "score": -15,
              "score_display": -15
            }
          ],
          "spearman": null
        }
      ]
    },
    {
      "id": "statements",
      "variants": [
        {
          "changed_display": 0,
          "id": "statements-excluded",
          "params": {
            "confidence_weights": null,
            "decay": null,
            "exclude_indicators": [
              "B9",
              "B10"
            ],
            "passivity_points": null,
            "weights": null
          },
          "ranking": [
            {
              "band": "passive",
              "exact": -15,
              "iso3": "DEU",
              "position": 1,
              "rank": 1,
              "score": -15,
              "score_display": -15
            }
          ],
          "spearman": null
        }
      ]
    },
    {
      "id": "decay",
      "variants": [
        {
          "changed_display": 0,
          "id": "decay-off",
          "params": {
            "confidence_weights": null,
            "decay": "off",
            "exclude_indicators": null,
            "passivity_points": null,
            "weights": null
          },
          "ranking": [
            {
              "band": "passive",
              "exact": -15,
              "iso3": "DEU",
              "position": 1,
              "rank": 1,
              "score": -15,
              "score_display": -15
            }
          ],
          "spearman": null
        }
      ]
    }
  ]
}
```

### 3.15 `build-notes.json`

What the build noted without failing: `build_date`, `methodology`, `counts` (notes per kind, every kind listed) and `notes`, by kind (in the order below), country, indicator and message. Each note has `kind`, `country`, `indicator` and `message`; `country` and `indicator` are `null` when the note is not about one.

| Kind | Meaning |
|---|---|
| `generator` | A row a generator could not use (no GNI, a SIPRI row before the first release, a tracked veto) |
| `unregistered-country` | Events of an excluded entity (D-10) or of a code missing from `data/countries.yaml`; not published |
| `unpublished-event` | A hand-written event of a scored country with status `draft` or `reviewed`; not published |
| `assessment-derived` | A structured table without rows (the hand-written assessments decide the indicator), or qualifying votes whose rows in `unga_votes.csv` omit the country (the hand-written assessment decides B1) |
| `assessment-disagreement` | A hand-written status that the structured tables contradict; the derived status is used |
| `unchecked` | A scored country with unchecked applicable indicators; allowed in scorecard mode only (docs/02 §8) |
| `validation-warning` | A warning of `pnpm validate`; errors fail the build |
| `history` | The commits of the corrections log could not be read (no git work tree, shallow clone, git failure); every `commit` in the corrections is then `null` |
| `large-file` | A file above 20 MiB; a file above 25 MiB fails the build (the Cloudflare Pages limit) |

Example (real-data build). `notes` keeps its first 2 notes (75 of 77 left out).

```json
{
  "build_date": "2026-09-27",
  "counts": {
    "assessment-derived": 2,
    "assessment-disagreement": 0,
    "generator": 1,
    "history": 0,
    "large-file": 0,
    "unchecked": 1,
    "unpublished-event": 0,
    "unregistered-country": 66,
    "validation-warning": 7
  },
  "methodology": "1.0.0-rc.1",
  "notes": [
    {
      "country": "MCO",
      "indicator": null,
      "kind": "generator",
      "message": "MCO: FTS funding but no GNI in gni.csv; D1 is no-data"
    },
    {
      "country": "ARE",
      "indicator": null,
      "kind": "unregistered-country",
      "message": "36 generated event(s) of ARE (D1) are not published: ARE is not in data/countries.yaml"
    }
  ]
}
```

### 3.16 `manifest.json`

What a reader needs to rebuild and compare (D-25): `build_date`, `methodology` (`version`, `folder`), `git` (`sha`, the commit the build read, `null` outside a git checkout; `dirty`, section 4), `site_url` (the origin used in permalinks and citations), `generator`, `files` (every other file of the build, by path relative to `api/v1/`, with `bytes` and `sha256`) and `total` (`files`, `bytes`; the manifest itself is not counted).

Example (fixtures build). `files` keeps its first 2 files (1287 of 1289 left out).

```json
{
  "build_date": "2026-09-27",
  "files": [
    {
      "bytes": 1770,
      "path": "build-notes.json",
      "sha256": "d1c20336f2ce854a427e210087ca8ca65558d1eaaddc4ab7857208a9059ffd49"
    },
    {
      "bytes": 428,
      "path": "changes/2023-10.fr.md",
      "sha256": "5f0ef19f0d03aef07b51790255c3a9b8a80f9dff5186f712f56e213198b003cb"
    }
  ],
  "generator": "@gai/pipeline build-data",
  "git": {
    "dirty": false,
    "sha": "b1a6a1ca571adb99df16df83049102fbf45d8d31"
  },
  "methodology": {
    "folder": "methodology/v1.0.0",
    "version": "1.0.0-rc.1"
  },
  "site_url": "https://gaza-accountability-index.pages.dev",
  "total": {
    "bytes": 702097,
    "files": 1289
  }
}
```

### 3.17 Dumps

Bulk downloads of the published dataset at the build date, in `dumps/`.

**`dumps/events.csv`**: one row per published event of the scored countries, by country, date and id. Lists are joined with `;` (`scope`; `sources`, the evidence sources without repeats, in evidence order; `related`). The evaluation at the build date is reduced to `at_build_reason`, `at_build_value` and `at_build_counted`. Header and the one data row of the fixtures build:

```csv
id,revision,country,indicator,category,type,date,end,points,points_rationale,confidence,scope,status,generated,scored,summary_en,summary_fr,actor_en,actor_fr,actor_name,sources,supersedes,related,at_build_reason,at_build_value,at_build_counted
evt_2025_08_08_DEU_A6,2,DEU,A6,A,standing,2025-08-08,2025-11-24,10,,confirmed,gaza,published,false,true,"The Federal Chancellor stated that the federal government would not approve, until further notice, exports of military equipment that could be used in the Gaza Strip.","Le chancelier fédéral a déclaré que le gouvernement fédéral n'autoriserait pas, jusqu'à nouvel ordre, les exportations d'équipements militaires susceptibles d'être utilisés dans la bande de Gaza.",Federal Chancellor,Chancelier fédéral,Friedrich Merz,src_20250808_bundesregierung_ruestungsexporte-gaza;src_20251117_bundesregierung_ruestungsexporte-israel-aufhebung,,,ended,0,0
```

**`dumps/sources.csv`**: every source of the dataset, by id, with every source field in the order of section 3.3. It includes sources that no published event cites (dataset sources of structured rows, for example). Header and first data row of the fixtures build:

```csv
id,kind,title,publisher,publisher_type,url,wayback_url,archive_status,archive_url_alt,sha256,bytes,content_type,retrieved_at,language,date,text_file,excerpt,origin,notes
src_20250808_bundesregierung_ruestungsexporte-gaza,official,Bundeskanzler Friedrich Merz erklärt zur Entwicklung in Gaza:,Bundesregierung,head_of_government,https://www.bundesregierung.de/breg-de/aktuelles/bundeskanzler-friedrich-merz-erklaert-zur-entwicklung-in-gaza--2377366,https://web.archive.org/web/20250808102907id_/https://www.bundesregierung.de/breg-de/aktuelles/bundeskanzler-friedrich-merz-erklaert-zur-entwicklung-in-gaza--2377366,archived,,a242f7b6918ffa89037e5e3ad3421d9bf0dc53acfbf25a2f59de773b989e177f,107672,text/html;charset=UTF-8,2026-09-26T22:58:53Z,de,2025-08-08,archive/text/src_20250808_bundesregierung_ruestungsexporte-gaza.txt,,,"Test fixture source (P-02). Pressemitteilung 178 of 8 August 2025, Presse- und Informationsamt der Bundesregierung (BPA). Existing Wayback capture found with the CDX API (first capture of the page, 2025-08-08 10:29:07 UTC); no new capture requested. sha256 and bytes are of the decoded response body (Wayback serves this capture with gzip content-encoding). Text extracted from the <main> element."
```

**`dumps/assessments.csv`**: one row per scored country and indicator (countries by ISO3, indicators in methodology order), with `status`, `hand_status`, `derived_status` and `derived_reason`; `queries` are joined with ` | `. Header and the DEU A2 row of the real-data build:

```csv
country,indicator,category,scored,status,hand_status,derived_status,derived_reason,checked_at,note,queries
DEU,A2,A,true,has-events,unchecked,has-events,generated-event,,,
```

**`dumps/countries.csv`**: one row per registry entry at the build date, the file the ranking page offers as "Download CSV". Scored countries come first, by score (full precision) highest first, then ISO3; excluded entities follow by ISO3 with every score field empty. `A` to `E` are the clipped category subtotals and `passivity_value` the penalty in force, both in full precision, so that a reader can recombine the score with other weights (docs/02 §9: `S = clip(Σ w_k · k − passivity_value, −100, 100)`); `coverage` is the ratio, followed by the status counts; `events` is `events.total`; `last_change` the date of the last change of the score. Header and first two rows of the real-data build:

```csv
iso3,name_en,name_fr,region,excluded,score,score_display,band,passivity_applied,passivity_value,A,B,C,D,E,coverage,has_events,none_found,no_data,unchecked,not_applicable,events,last_change
DEU,Germany,Allemagne,Europe,false,-2,-2,passive,false,0,-3,0,-5,6,0,0.1,3,0,0,27,1,0,2026-07-01
ISR,Israel,Israël,Asia,true,,,,,,,,,,,,,,,,,,
```

**`dumps/countries.scorecard.csv`**: the same entries by ISO3, with nothing derived from the score (no score, band, subtotal, passivity or last change), for scorecard mode (D-16): the coverage columns, the event counts by confidence and by category (`events_A` to `events_E`) and `latest_event`, the date of the latest counted event. Header and first row of the real-data build:

```csv
iso3,name_en,name_fr,region,excluded,coverage,has_events,none_found,no_data,unchecked,not_applicable,events,events_confirmed,events_corroborated,events_reported,events_disputed,events_A,events_B,events_C,events_D,events_E,latest_event
DEU,Germany,Allemagne,Europe,false,0.1,3,0,0,27,1,0,0,0,0,0,0,0,0,0,0,
```

**`dumps/registry.csv`**: the country registry (`data/countries.yaml`) by ISO3, as the build publishes it: `iso2`, `m49`, the UNTERM short names `name_en` and `name_fr`, `name_en_def` and `name_fr_def` (the short name with the article UNTERM gives it, "the United States of America", "l'Allemagne", "la France"; the name alone when UNTERM gives none, "Germany", "Cuba"; the formal name for the five short names that carry a descriptor, "the Islamic Republic of Iran", "la République islamique d'Iran"), the M49 `region` and `subregion`, `un_member`, `observer`, `excluded`; `unsc` lists the Security Council terms as ISO 8601 intervals `from/to` joined with `;` (`..` for an open end: the permanent members' `1945-10-24/..`), `unsc_permanent` says whether one of them is permanent; each other membership is `true`, `false`, or a dated interval `since/until` when it began or ended after 7 October 2023 (Sweden's NATO membership is `2024-03-07/..`); `member_of` lists the memberships held at the build date, joined with `;`; `recognises_palestine_since` is the date in the registry, a lead for B8 until the recognitions table confirms it. Research notes and `gov_sources` are not published. Header and the DEU row of the real-data build:

```csv
iso3,iso2,m49,name_en,name_en_def,name_fr,name_fr_def,region,subregion,un_member,observer,excluded,unsc,unsc_permanent,eu,nato,arab_league,oic,g20,g7,brics,member_of,recognises_palestine_since
DEU,DE,276,Germany,Germany,Allemagne,l'Allemagne,Europe,Western Europe,true,false,false,,false,true,true,false,false,true,true,false,eu;nato;g20;g7,
```

**`dumps/scores-daily-{YYYY}.csv`**: one file per year, one row per date and scored country from 2023-10-07 to the build date, by date then ISO3; `score` to one decimal, `score_display`, `band`, `passivity_applied`, and the clipped category subtotals `A` to `E` in full precision. No coverage (section 2). Header and first two rows of `scores-daily-2026.csv` in the real-data build:

```csv
date,iso3,score,score_display,band,passivity_applied,A,B,C,D,E
2026-01-01,DEU,-5,-5,passive,false,-3,0,-5,3,0
2026-01-02,DEU,-5,-5,passive,false,-3,0,-5,3,0
```

**`dumps/gai-{YYYY-MM-DD}.json`**: the whole published dataset at the build date, in one JSON file. Top-level keys:

| Key | Holds |
|---|---|
| `build_date`, `methodology`, `git` | As in `manifest.json` (`methodology` is the version string) |
| `countries` | Every registry entry, as in `countries.json` |
| `events` | Every published event of the scored countries, as in section 3.3 |
| `sources` | Every source of the dataset, as in section 3.3 |
| `assessments` | One per scored country: `country`, `protocol_version`, `last_full_check`, `indicators` (the rows of section 3.2) |
| `corrections`, `replies` | As in `corrections.json` and `replies.json` |
| `leads` | Open leads: `id`, `country`, `indicator` |

## 4. Reproducing a build

Every file can be rebuilt from a clone (D-25). Requires Node 22 or later and pnpm.

1. Clone the full history (not `--depth`; the `commit` of each correction is read from it): `git clone https://github.com/mohazed/GAI.git && cd GAI`.
2. Check out the commit in `manifest.json` `git.sha`: `git checkout <sha>`.
3. `pnpm install --frozen-lockfile`.
4. `pnpm build:data --date <build_date> --site-url <site_url>`, with `build_date` and `site_url` from the manifest. The files are written to `apps/web/public/api/v1/`.
5. Compare the SHA-256 of every file with the published manifest. From the repository root, with `jq` (use `sha256sum -c --quiet -` in place of `shasum -a 256 -c --quiet -` on Linux):

```sh
curl -s https://gaza-accountability-index.pages.dev/api/v1/manifest.json | jq -r '.files[] | "\(.sha256)  \(.path)"' | (cd apps/web/public/api/v1 && shasum -a 256 -c --quiet -)
```

The command prints nothing and exits with 0 when every file matches.

`git.dirty: true` means the build read uncommitted changes under its inputs (`data/`, `archive/`, `methodology/`, `packages/schema`, `packages/scoring`, `packages/pipeline`, `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`) or files that git ignores under `data/`, `archive/` and `methodology/`; such a build cannot be reproduced from a clone at `git.sha`. `git.dirty: null` means git could not tell.

`pnpm build:data:check [--date YYYY-MM-DD] [--root DIR] [--site-url URL]` runs two builds in separate processes with the same date and compares every byte; CI runs it on `data/` and on `fixtures/`.

The deployed builds (`.github/workflows/deploy.yml` and `nightly.yml`, docs/04 §5) run `pnpm build:data --date <run day>` and then `pnpm build` with `GAI_BUILD_DATE` set to the same day (build-data takes it as the default `--date`) and `NEXT_PUBLIC_SITE_URL=https://gaza-accountability-index.pages.dev`, from a full clone; the build logs are public in the repository's Actions tab.

## 5. Schemas

The zod schemas in `packages/schema/src/api.ts` are the contract of every JSON file: `apiSchemaFor(path)` returns the schema of a path relative to `api/v1/` (`null` for CSV and Markdown files and for the frozen outputs of superseded versions), and the `Api…` types (`ApiScoredCountryFile`, `ApiEvent`, `ApiFeedEntry` and the others) describe each file. The build checks every JSON file it emits against its schema before it writes anything; a file that does not match, or a JSON file without a schema, fails the build.
