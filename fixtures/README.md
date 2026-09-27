# fixtures/

Test data for `packages/schema` (and later packages). The folder mirrors the repository's data tree: `fixtures/data/` is laid out like `data/`, and `fixtures/archive/` like `archive/`. The test harness (`packages/schema/src/testing/harness.ts`) loads it, and every validator rule must report zero errors on it. Tests copy it in memory, change one thing, and check that the rule fires.

**Never copy fixtures into `data/`, never deploy them.** Nothing here is part of the published dataset, and nothing here has been reviewed by the maintainer (`reviewed_by: fixture`).

## What is real and what is synthetic

| Record | Status |
|---|---|
| `data/countries.yaml` | Real. Identical to `data/countries.yaml` (DEU, ISR, PSE), facts verified 2026-09-27, sources in the file header and `notes`. |
| `data/events/DEU.yaml`, `evt_2025_08_08_DEU_A6` | Real event, real sources, quotes copied from the archived text. Only the review fields (`reviewed_by: fixture`) and `revision: 2` are fixture bookkeeping. |
| `data/sources/2025/*.yaml`, `archive/index.csv`, `archive/text/*.txt` | Real, archived and hashed (below). |
| `data/corrections.yaml`, `cor_20260927_1` | Synthetic. It records how the fixture went from revision 1 (no end date) to revision 2 (end date and its source added) while it was being built. Its reason starts with "Test fixture." |
| `data/replies/DEU/rep_20260927_DEU_1.yaml` | Synthetic. No government or embassy submitted it; its text says so. |
| `data/assessments/DEU.yaml` | A6 `has-events` and B2 `not-applicable` are real (Germany was not on the Security Council between 2023-10-07 and 2026-09-27; it served 2019-2020 and was not elected for 2027-2028). Every other indicator is `unchecked`: nothing was researched. |
| `data/structured/*.csv` | Header rows only. |
| `data/leads/`, `data/snapshots/` | Empty. Tests add leads in memory. |

## The event

On 8 August 2025 the Federal Chancellor, Friedrich Merz, stated that the federal government would not approve, until further notice, exports of military equipment that could be used in the Gaza Strip (indicator A6, standing, +10, confirmed). At the government press conference of 17 November 2025 the deputy government spokesperson stated that these restrictions on arms exports to Israel were lifted with effect from 24 November 2025. `end` is exclusive (docs/02 §3), so `end: 2025-11-24` is the first day the suspension no longer held.

## Sources

Both captures already existed in the Wayback Machine; they were found with the CDX API (`https://web.archive.org/cdx/search/cdx?url=<url>&output=json`), and no new capture was requested. Each `wayback_url` is the `id_` form, which serves the original bytes. Wayback serves both captures with `Content-Encoding: gzip`; `sha256` and `bytes` are those of the decoded body (what `curl --compressed` or a `fetch()` returns). Retrieved 2026-09-26 at 22:58 UTC (2026-09-27 in Paris).

1. `src_20250808_bundesregierung_ruestungsexporte-gaza`
   - Title: "Bundeskanzler Friedrich Merz erklärt zur Entwicklung in Gaza:" (Pressemitteilung 178, Presse- und Informationsamt der Bundesregierung)
   - URL: https://www.bundesregierung.de/breg-de/aktuelles/bundeskanzler-friedrich-merz-erklaert-zur-entwicklung-in-gaza--2377366
   - Wayback: https://web.archive.org/web/20250808102907id_/https://www.bundesregierung.de/breg-de/aktuelles/bundeskanzler-friedrich-merz-erklaert-zur-entwicklung-in-gaza--2377366
   - sha256 `a242f7b6918ffa89037e5e3ad3421d9bf0dc53acfbf25a2f59de773b989e177f`, 107672 bytes, `text/html;charset=UTF-8`
2. `src_20251117_bundesregierung_ruestungsexporte-israel-aufhebung`
   - Title: "Regierungspressekonferenz vom 17. November 2025" (official transcript). No separate press release on the lifting was found on bundesregierung.de.
   - URL: https://www.bundesregierung.de/breg-de/aktuelles/regierungspressekonferenz-vom-17-november-2025-2394212
   - Wayback: https://web.archive.org/web/20251122083237id_/https://www.bundesregierung.de/breg-de/aktuelles/regierungspressekonferenz-vom-17-november-2025-2394212
   - sha256 `f35cd0e01df1168c3d8a6fd47d765771908f10d170fc0cc8f72462977137188a`, 146709 bytes, `text/html;charset=UTF-8`

## Text files and locators

`archive/text/{src_id}.txt` holds the text of the page's `<main>` element: scripts, styles, share widgets and screen-reader labels removed, entities decoded, one blank line between blocks. The extraction was a throwaway script of the P-02 session; `pnpm archive` (built in P-04) replaces it. A locator `paragraph N` counts the non-empty blocks separated by blank lines from the top of the text file. The quote check (docs/02 §12.4) compares after collapsing whitespace.
