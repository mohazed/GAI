/**
 * /llms.txt (the llmstxt.org format: a title, a one-paragraph summary, then lists of links):
 * what the index is, its standpoint on scores (a description of conduct, not a legal finding),
 * and where the methodology, the data and the API are, so that a language model reading the
 * site cites the documents instead of guessing. Plain statements, as on the site.
 */
import type { ApiReader } from './api'
import { SITE_MODE } from './mode'

export function llmsText(api: ApiReader): string {
  const manifest = api.manifest()
  const base = manifest.site_url.replace(/\/+$/, '')
  const version = manifest.methodology.version
  const first = api.countries().countries.find((c) => !c.excluded)?.iso3 ?? 'DEU'
  const mode =
    SITE_MODE === 'score'
      ? 'Scores are displayed.'
      : 'The site is in scorecard mode: it shows events, sources and coverage, and no score or ranking; the API files carry the computed scores.'
  return [
    '# Gaza Accountability Index',
    '',
    `> The Gaza Accountability Index records what each state has done regarding Gaza since 7 October 2023, on one scale from −100 to +100 with the same rules for every country. Every point comes from a dated act backed by an archived document. The number describes conduct; it is not a legal finding. Methodology ${version}, built on ${manifest.build_date}. Data and methodology under CC BY 4.0; code under MIT. Maintained and signed by Mohamed Zouad.`,
    '',
    mode,
    '',
    '## Documents',
    '',
    `- [Methodology](${base}/en/methodology/): indicators, points, caps, formula, decay, confidence, passivity, coverage, known limitations`,
    `- [Data and API](${base}/en/data/): downloads, every API endpoint with examples, the structured tables, citation, reproducibility`,
    `- [Corrections](${base}/en/corrections/): every correction and retraction of a published event`,
    `- [Right of reply](${base}/en/reply/): how a government replies to an event`,
    `- [About](${base}/en/about/): standpoint, maintainer, reviewers, funding`,
    '',
    '## Data',
    '',
    `- [countries.json](${base}/api/v1/countries.json): every country at the build date`,
    `- [countries/{ISO3}.json](${base}/api/v1/countries/${first}.json): one country in full, with its events and sources`,
    `- [methodology/index.json](${base}/api/v1/methodology/index.json): methodology versions and changelog`,
    `- [manifest.json](${base}/api/v1/manifest.json): the git commit, the build date and the hash of every file`,
    `- [API reference](https://github.com/mohazed/GAI/blob/main/apps/web/public/api/README.md)`,
    '',
    '## Optional',
    '',
    `- [Pages in French](${base}/fr/)`,
    '- [Source code and data files](https://github.com/mohazed/GAI)',
    '',
  ].join('\n')
}
