/**
 * The pages of the site, for sitemap.xml and llms.txt: every page path after the language, in
 * both languages. Built from the API like the pages themselves (countries, months, methodology
 * versions), so a page added by the data is listed without a code change.
 */
import type { ApiReader } from './api'

/** Paths after `/{lang}/`, with their trailing slash ('' is the home page). */
export function sitePaths(api: ApiReader): string[] {
  const index = api.methodologyIndex()
  return [
    '',
    'ranking/',
    'compare/',
    'changes/',
    ...api.changesLatest().months.map((m) => `changes/${m.month}/`),
    'methodology/',
    ...index.versions
      .filter((v) => v.version !== index.current)
      .map((v) => `methodology/${v.version}/`),
    'corrections/',
    'data/',
    'embed/',
    'reply/',
    'about/',
    ...api.countries().countries.map((c) => `country/${c.iso3}/`),
  ]
}
