/**
 * The actor of a generated summary (docs/05 §7 `{Actor} {past-tense verb} {object}`, P-18): the
 * country's name as the registry gives it with its article (`name.en_def`, `name.fr_def`, the
 * UNTERM forms of P-13 and P-18), its first letter capitalised, the same rule for every country.
 * French verbs agree with a plural name ("les États-Unis d'Amérique ont voté"); gender never
 * matters, since the templates use only verbs conjugated with avoir. Apostrophes stay as the
 * registry writes them: the site sets the typographic apostrophe when it displays French text
 * (docs/05 §2).
 */
import type { CountryName } from '@gai/schema'

export interface Actor {
  /** English name opening a sentence: "The United States of America", "Germany". */
  en: string
  /** French name opening a sentence: "Les États-Unis d'Amérique", "L'Allemagne", "Cuba". */
  fr: string
  /** The French name is plural: its verbs and possessives agree ("ont voté", "leur veto"). */
  frPlural: boolean
}

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/** The actor forms of a registry name; without `en_def` or `fr_def`, the short name. */
export function actorOf(name: CountryName): Actor {
  const fr = name.fr_def ?? name.fr
  return {
    en: capitalise(name.en_def ?? name.en),
    fr: capitalise(fr),
    frPlural: /^(?:les|Les) /.test(fr),
  }
}

/**
 * A country missing from the registry (a structured row the validator also reports) is named by
 * its code, "The country FIN" / "Le pays FIN", and the build notes it.
 */
export function codeActor(iso3: string): Actor {
  return { en: `The country ${iso3}`, fr: `Le pays ${iso3}`, frPlural: false }
}

/** French verb or possessive by number: `fr(a, 'a', 'ont')`. */
export function byNumber(a: Actor, singular: string, plural: string): string {
  return a.frPlural ? plural : singular
}
