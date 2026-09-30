/**
 * Country search over the names in both languages and the ISO3 codes (docs/04 §3 Search), shared
 * by the home page's search box and the Compare page's picker. No imports: safe in any bundle.
 */

export interface SearchCountry {
  iso3: string
  name: { en: string; fr: string }
}

/**
 * Lower case without diacritics, one apostrophe, so that "cote" and "cote d'ivoire" find
 * "Côte d’Ivoire" (the French names are shown with the typographic apostrophe, P-18).
 */
export function fold(s: string): string {
  return s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[’‘]/g, "'")
    .toLowerCase()
}

/**
 * Countries matching `q`, best first: the exact ISO3 code, then names starting with the query,
 * then names containing it (in either language), each group alphabetical in `lang`; at most `max`.
 */
export function searchMatches<C extends SearchCountry>(
  countries: readonly C[],
  q: string,
  lang: 'en' | 'fr',
  max: number,
): C[] {
  const needle = fold(q.trim())
  if (needle === '') return []
  const scored = countries
    .map((c) => {
      const names = [fold(c.name[lang]), fold(c.name[lang === 'en' ? 'fr' : 'en'])]
      const code = c.iso3.toLowerCase()
      const rank =
        code === needle
          ? 0
          : names.some((n) => n.startsWith(needle))
            ? 1
            : names.some((n) => n.includes(needle))
              ? 2
              : -1
      return { c, rank }
    })
    .filter((m) => m.rank >= 0)
  const collator = new Intl.Collator(lang)
  scored.sort((a, b) => a.rank - b.rank || collator.compare(a.c.name[lang], b.c.name[lang]))
  return scored.slice(0, max).map((m) => m.c)
}
