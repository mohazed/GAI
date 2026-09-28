# Embed a country

A newsroom or an organisation can show a country of the index on its own pages: a gauge with the score, the band and the coverage, or the timeline of the score since 7 October 2023. The embed is a script, not a frame. It reads the country's file from the public API, draws inside its own isolated box, links back to the country page, and shows the scorecard without a score for as long as the site does.

## The snippet

Place the script where the embed should appear; it draws the embed in its place. Several can sit on one page.

<!-- slot:snippet -->

## Options

| Attribute | Values | Default |
|---|---|---|
| `data-country` | The ISO 3166-1 alpha-3 code of a scored country, such as `DEU` | required |
| `data-view` | `gauge` (score, band and coverage) or `timeline` (the score since 7 October 2023) | `gauge` |
| `data-lang` | `en` or `fr` | `en` |
| `data-origin` | The address of the site to read the data from, for a mirror of the index | this site |

## What the embed does

- It reads one file, `/api/v1/countries/{ISO3}.json`, from the origin of the site. It sets no cookie, and that file is the only request it makes.
- It follows the mode of the site: while scores are not published, it shows the scorecard (events, coverage) without a number.
- If the file cannot be read, it shows a link to the country page instead.
- The data are published under CC BY 4.0: the link to the country page, which the embed always shows, is the attribution.
- It is one script under 15 KB compressed, with no dependency. It loads no font: it uses the site's typefaces when the page has them, and the system's serif, sans-serif and monospace faces otherwise.
- It works in current versions of Chrome, Edge, Firefox and Safari (16.4 or later). A page with a Content-Security-Policy must allow this site in `script-src` and `connect-src`.

## Live examples

<!-- slot:examples -->
