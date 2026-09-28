# Data and API

Everything the site shows is published as static files: JSON, CSV and Markdown, rebuilt at every build from the public repository. The data are published under the Creative Commons Attribution 4.0 licence (CC BY 4.0). There is no key, no account and no rate limit beyond the host's, and nothing is computed per request.

<!-- slot:build -->

## Downloads

<!-- slot:downloads -->

## Structured tables

The generated and computed events (B1, B2, B8, A1, A2, A4, C3 and D1) are made by the build from tables in `data/structured/` of the repository, never typed in by hand. Each row cites the dataset sources that archive the response it was read from, in the column `source`: one source id, or several joined by `;` when a row was built from several archived responses (for example the pages of one FTS plan and the FTS list of locations). The links below open each table at the commit of this build.

<!-- slot:structured -->

## API

The files are served under `/api/v1/` with the header `Access-Control-Allow-Origin: *`, so a page on another site can read them. JSON files are UTF-8 with sorted keys; a missing value is `null`, never a missing key; dates are `YYYY-MM-DD` in UTC; text for readers is an object with `en` and `fr`. In text a negative number uses the minus sign (−15); in JSON and CSV numbers use the ASCII hyphen-minus (-15). CSV files have a header row and LF line endings. The complete reference, field by field, is the [API README](https://github.com/mohazed/GAI/blob/main/apps/web/public/api/README.md); the schemas are the zod schemas of `packages/schema/src/api.ts`. The examples below are taken from the files of this build.

<!-- slot:api -->

## How the site uses the data

- **Country pages.** Each hand-authored event has its card. The computed values of one indicator, such as D1 recomputed every month, are shown as runs: one entry per run of consecutive values, with the dates on which the points changed. Every value is one click away in the run's table, with its table row and the archived responses it cites.
- **Dated links.** A country page with `?date=YYYY-MM-DD` reads `scores/{YYYY-MM-DD}.json` in the browser and redraws the score, the band and the category subtotals of that date; the coverage and the events shown stay those of the build date.
- **Structured data for search engines.** Each country page carries a JSON-LD Dataset record (schema.org) with its JSON files as distributions; this page carries the record of the whole dataset.
- **Share cards.** `/cards/{ISO3}.png` in English and `/cards/fr/{ISO3}.png` in French, 1200 × 630 pixels, rebuilt at every build.
- **Monthly reports.** The reports `changes/{YYYY-MM}.md` and `.fr.md`, and their `.scorecard` variants without scores, are rendered at `/changes/{YYYY-MM}/` in the mode of the site, each row linked to its event.
- **Compare.** The Compare page reads `countries/{ISO3}.json` in the browser for each country chosen, up to five scored countries given in `?c=`. With weights set by the reader (`?w=`, once scores are displayed), it recomputes each change point of the series from the clipped category subtotals, which the series publishes to one decimal. The citation of a comparison links `/compare?c=…` and names the build date.
- **Build date.** The Changes page shows a notice in the browser when the build date is more than three days old.

<!-- slot:computed -->

## Citing the dataset

<!-- slot:citation -->

## Reproducing a build

Every file can be rebuilt from a copy of the repository for the same build date, byte for byte. `manifest.json` records the git commit the build read, the build date, the site address used in links and citations, and the size and SHA-256 hash of every other file. The procedure needs Node 22 or later, pnpm and `jq`:

<!-- slot:reproduce -->

The last command prints nothing and ends with status 0 when every file matches. A build whose `git.dirty` is `true` read uncommitted changes to its inputs and cannot be reproduced from a clone; `git.dirty: null` means git could not tell. `pnpm build:data:check --date YYYY-MM-DD` runs two builds in separate processes and compares every byte; the continuous integration of the repository runs it at every change.
