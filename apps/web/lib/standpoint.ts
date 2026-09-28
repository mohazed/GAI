/**
 * The standpoint statement of the About page (docs/05 §6 About, D-01): the "Standpoint"
 * paragraph of the project specification (§1, 26 September 2026), verbatim, in its original
 * English, signed by the author; the French page adds a translation beside it, never in its
 * place. A test checks the text against the specification file at the repository root.
 */
export const STANDPOINT = {
  original:
    'The About page states openly that the project was started by someone who believes the response of most governments has been inadequate. The credibility claim is not neutrality; it is that the method is published, versioned and reproducible, so that belief cannot leak into the numbers.',
  lang: 'en',
  translation: {
    fr: "La page « À propos » déclare ouvertement que le projet a été lancé par une personne qui estime que la réponse de la plupart des gouvernements a été insuffisante. Ce qui fonde la crédibilité n'est pas la neutralité ; c'est que la méthode est publiée, versionnée et reproductible, de sorte que cette conviction ne puisse pas se glisser dans les chiffres.",
  },
  author: 'Mohamed Zouad',
  source: 'Gaza Accountability Index — Cahier des charges.md',
} as const
