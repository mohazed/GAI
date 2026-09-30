/**
 * The Data page's reference of the API (docs/05 §6 Data): every endpoint of
 * apps/web/public/api/README.md §3 with a short description in both languages, and an example
 * taken from the files of the build itself, cut to a readable length with a note saying exactly
 * what was left out (the README's rule: nothing else is changed). The structured tables of
 * `data/structured/` are described with their columns from @gai/schema/structured.
 * Server only: the examples are read at build.
 */
import { STRUCTURED_TABLES, type StructuredTableName } from '@gai/schema/structured'
import type { ApiReader } from './api'
import { frenchPunctuation } from './format'
import type { LangText } from './methodology'
import type { Mode } from './mode'

export type ExampleKind = 'json' | 'csv' | 'md'

export interface Endpoint {
  /** The path pattern under /api/v1/, as the README writes it. */
  path: string
  holds: LangText
  /** The file of this build shown as the example, or null when the build has none. */
  example: string | null
  kind: ExampleKind
  /** JSON: the top-level keys kept in the example (the others are named in the note). */
  pick?: readonly string[]
}

/** What an example left out: arrays cut, strings cut, keys left out. */
export interface Cut {
  path: string
  shown: number
  total: number
  what: 'items' | 'characters' | 'keys'
}

export interface Excerpt {
  text: string
  cuts: Cut[]
}

const MAX_STRING = 240

/**
 * A JSON value cut for display: every array keeps its first `keep` elements, every string its
 * first 240 characters, and with `pick` only those top-level keys; each cut is recorded.
 */
export function excerptJson(
  value: unknown,
  opts: { keep?: number; pick?: readonly string[] } = {},
): Excerpt {
  const keep = opts.keep ?? 1
  const cuts: Cut[] = []
  const walk = (v: unknown, path: string): unknown => {
    if (Array.isArray(v)) {
      if (v.length > keep) cuts.push({ path, shown: keep, total: v.length, what: 'items' })
      return v.slice(0, keep).map((x, i) => walk(x, `${path}[${i}]`))
    }
    if (typeof v === 'string' && v.length > MAX_STRING) {
      cuts.push({ path, shown: MAX_STRING, total: v.length, what: 'characters' })
      return `${v.slice(0, MAX_STRING)}…`
    }
    if (v !== null && typeof v === 'object') {
      return Object.fromEntries(
        Object.entries(v as Record<string, unknown>).map(([k, x]) => [
          k,
          walk(x, path === '' ? k : `${path}.${k}`),
        ]),
      )
    }
    return v
  }
  let root = value
  if (opts.pick !== undefined && value !== null && typeof value === 'object') {
    const all = Object.keys(value as Record<string, unknown>)
    const kept = all.filter((k) => opts.pick?.includes(k))
    if (kept.length < all.length)
      cuts.push({ path: '', shown: kept.length, total: all.length, what: 'keys' })
    root = Object.fromEntries(kept.map((k) => [k, (value as Record<string, unknown>)[k]]))
  }
  const out = walk(root, '')
  return { text: JSON.stringify(out, null, 2), cuts }
}

/** The first `lines` lines of a text file (CSV: the header and data rows; Markdown). */
export function excerptLines(text: string, lines: number): Excerpt {
  const all = text.replace(/\n$/, '').split('\n')
  const cuts: Cut[] =
    all.length > lines ? [{ path: '', shown: lines, total: all.length, what: 'items' }] : []
  return { text: all.slice(0, lines).join('\n'), cuts }
}

/** French strings get French spacing (no-break spaces before `: ; ? !`, lib/format.ts). */
const t = (en: string, fr: string): LangText => ({ en, fr: frenchPunctuation(fr) })

/**
 * Every endpoint, in the order of the README (§3), with the example file of this build. The
 * country of the examples is the first scored country of countries.json; the month the latest.
 */
export function endpoints(api: ApiReader, mode: Mode): Endpoint[] {
  const countries = api.countries()
  const manifest = api.manifest()
  const files = new Set(manifest.files.map((f) => f.path))
  const has = (p: string) => (files.has(p) ? p : null)
  const first = countries.countries.find((c) => !c.excluded)?.iso3 ?? null
  const date = manifest.build_date
  const months = api.changesLatest().months
  const month = months[months.length - 1]?.month ?? null
  const year = date.slice(0, 4)
  const report = mode === 'score' ? 'md' : 'scorecard.md'
  return [
    {
      path: 'countries.json',
      holds: t(
        'Every registry entry, with the score, band, category subtotals, coverage and event counts of each scored country at the build date; excluded entities carry the reason.',
        "Chaque entrée du registre, avec le score, la bande, les sous-totaux par catégorie, la couverture et le nombre d'événements de chaque pays noté à la date de génération ; les entités exclues portent la raison.",
      ),
      example: has('countries.json'),
      kind: 'json',
    },
    {
      path: 'countries/{ISO3}.json',
      holds: t(
        'One country in full: the score fields, the assessment of every indicator, the published events and replies, the corrections, the open leads, the daily series as change points, and the citations.',
        "Un pays en entier : les champs du score, l'évaluation de chaque indicateur, les événements et réponses publiés, les corrections, les pistes ouvertes, la série quotidienne en points de changement et les citations.",
      ),
      example: first === null ? null : has(`countries/${first}.json`),
      kind: 'json',
    },
    {
      path: 'countries/{ISO3}/events.json',
      holds: t(
        "One country's published events, with their evidence and evaluation at the build date, and every source they cite.",
        "Les événements publiés d'un pays, avec leurs preuves et leur évaluation à la date de génération, et chaque source qu'ils citent.",
      ),
      example: first === null ? null : has(`countries/${first}/events.json`),
      kind: 'json',
    },
    {
      path: 'countries/{ISO3}/series.json',
      holds: t(
        "One country's daily score from 7 October 2023 to the build date, as change points: a point is written only on the days the score or a subtotal changes.",
        "Le score quotidien d'un pays du 7 octobre 2023 à la date de génération, en points de changement : un point n'est écrit que les jours où le score ou un sous-total change.",
      ),
      example: first === null ? null : has(`countries/${first}/series.json`),
      kind: 'json',
    },
    {
      path: 'scores/index.json',
      holds: t(
        'The dates that have a scores file: every day from 7 October 2023 to the build date.',
        'Les dates qui ont un fichier de scores : chaque jour du 7 octobre 2023 à la date de génération.',
      ),
      example: has('scores/index.json'),
      kind: 'json',
    },
    {
      path: 'scores/{YYYY-MM-DD}.json',
      holds: t(
        'Every scored country on one date: score, band, passivity flag and clipped category subtotals. Coverage is not included (it is published for the build date only).',
        "Chaque pays noté à une date : score, bande, indicateur de passivité et sous-totaux plafonnés par catégorie. La couverture n'y figure pas (elle n'est publiée qu'à la date de génération).",
      ),
      example: has(`scores/${date}.json`),
      kind: 'json',
    },
    {
      path: 'methodology/index.json',
      holds: t(
        'The methodology versions, current and superseded, the changelog, and the named reviewers.',
        'Les versions de la méthodologie, en vigueur et remplacées, le journal des modifications et les relecteurs nommés.',
      ),
      example: has('methodology/index.json'),
      kind: 'json',
    },
    {
      path: 'methodology/{version}.json',
      holds: t(
        'One methodology version: every file of its folder as parsed (indicators, categories, bands, confidence, decay, passivity, thresholds, votes, symmetry, the banned words), the two documents in Markdown, and the diff with the previous version when there is one.',
        "Une version de la méthodologie : chaque fichier de son dossier tel que lu (indicateurs, catégories, bandes, confiance, décroissance, passivité, seuils, votes, symétrie, mots proscrits), les deux documents en Markdown, et l'écart avec la version précédente lorsqu'il y en a une.",
      ),
      example: has(`methodology/${countries.methodology}.json`),
      kind: 'json',
      pick: ['version', 'folder', 'status', 'window_start', 'diff'],
    },
    {
      path: 'changes/latest.json',
      holds: t(
        'The changes feed at the build date: movers over 7 and 30 days, the latest entries, the last five ISO weeks, the corrections and the list of months.',
        'Le fil des changements à la date de génération : mouvements sur 7 et 30 jours, dernières entrées, cinq dernières semaines ISO, corrections et liste des mois.',
      ),
      example: has('changes/latest.json'),
      kind: 'json',
    },
    {
      path: 'changes/{YYYY-MM}.json',
      holds: t(
        'The changes of one month, by ISO week: events that started or ended, computed values whose points changed, the recomputations without change counted per week, the movers and the corrections.',
        "Les changements d'un mois, par semaine ISO : événements commencés ou terminés, valeurs calculées dont les points ont changé, recalculs sans changement comptés par semaine, mouvements et corrections.",
      ),
      example: month === null ? null : has(`changes/${month}.json`),
      kind: 'json',
    },
    {
      path: 'changes/{YYYY-MM}.md, .fr.md, .scorecard.md, .scorecard.fr.md',
      holds: t(
        'The monthly report in Markdown, in English and French, with scores and without (scorecard variants).',
        'Le rapport mensuel en Markdown, en anglais et en français, avec et sans scores (variantes « scorecard »).',
      ),
      example: month === null ? null : has(`changes/${month}.${report}`),
      kind: 'md',
    },
    {
      path: 'corrections.json',
      holds: t(
        'The corrections log: each correction or retraction of a published event, with the fields before and after, the reason, who flagged it, and the commit that added it.',
        "Le journal des corrections : chaque correction ou retrait d'un événement publié, avec les champs avant et après, la raison, l'origine du signalement et le commit qui l'a ajoutée.",
      ),
      example: has('corrections.json'),
      kind: 'json',
    },
    {
      path: 'replies.json',
      holds: t(
        'The published replies: the verbatim text in its original language with translations, the events contested, the answer of the index and the outcome.',
        "Les réponses publiées : le texte intégral dans sa langue d'origine avec ses traductions, les événements contestés, la réponse de l'index et l'issue.",
      ),
      example: has('replies.json'),
      kind: 'json',
    },
    {
      path: 'sensitivity.json',
      holds: t(
        'The five sensitivity tables: the ranking under each alternative setting and its Spearman rank correlation with the default ranking.',
        'Les cinq tables de sensibilité : le classement sous chaque réglage alternatif et sa corrélation de rang de Spearman avec le classement par défaut.',
      ),
      example: has('sensitivity.json'),
      kind: 'json',
    },
    {
      path: 'build-notes.json',
      holds: t(
        'What the build noted without failing: rows a generator could not use, unpublished drafts, structured tables without rows, statuses the tables contradict, unchecked indicators, validation warnings.',
        'Ce que la génération a relevé sans échouer : lignes inutilisables par un générateur, brouillons non publiés, tableaux structurés sans lignes, statuts contredits par les tableaux, indicateurs non vérifiés, avertissements de validation.',
      ),
      example: has('build-notes.json'),
      kind: 'json',
    },
    {
      path: 'manifest.json',
      holds: t(
        'The git commit the build read, whether its inputs had uncommitted changes, the methodology, the build date, the site address, and the size and SHA-256 of every other file.',
        "Le commit git lu par la génération, la présence de modifications non validées dans ses entrées, la méthodologie, la date de génération, l'adresse du site, et la taille et le SHA-256 de chaque autre fichier.",
      ),
      example: 'manifest.json',
      kind: 'json',
    },
    {
      path: 'dumps/events.csv, dumps/sources.csv, dumps/assessments.csv',
      holds: t(
        'The events, the sources and the assessments as tables: one row per published event, per source, and per country and indicator.',
        'Les événements, les sources et les évaluations en tableaux : une ligne par événement publié, par source, et par pays et indicateur.',
      ),
      example: has('dumps/events.csv'),
      kind: 'csv',
    },
    {
      path: 'dumps/countries.csv, dumps/countries.scorecard.csv',
      holds: t(
        'Every country at the build date as the ranking table shows it: with the scores and the clipped subtotals in full precision, so that other weights can be applied, or, for scorecard mode, without anything derived from the score.',
        "Chaque pays à la date de génération, comme le montre le tableau du classement : avec les scores et les sous-totaux plafonnés en pleine précision, pour appliquer d'autres pondérations, ou, pour le mode fiche, sans rien de dérivé du score.",
      ),
      example: has(mode === 'score' ? 'dumps/countries.csv' : 'dumps/countries.scorecard.csv'),
      kind: 'csv',
    },
    {
      path: 'dumps/registry.csv',
      holds: t(
        'The country registry: ISO codes, M49 region and sub-region, UN names in English and French (with the French article), memberships with their dates, the memberships held at the build date, and the date of recognition of the State of Palestine.',
        "Le registre des pays : codes ISO, région et sous-région M49, noms de l'ONU en anglais et en français (avec l'article), appartenances avec leurs dates, appartenances à la date de génération, et date de reconnaissance de l'État de Palestine.",
      ),
      example: has('dumps/registry.csv'),
      kind: 'csv',
    },
    {
      path: 'dumps/scores-daily-{YYYY}.csv',
      holds: t(
        'Daily scores, one file per year: one row per date and scored country, with the score, band, passivity flag and clipped subtotals. No coverage.',
        "Les scores quotidiens, un fichier par année : une ligne par date et par pays noté, avec le score, la bande, l'indicateur de passivité et les sous-totaux plafonnés. Sans couverture.",
      ),
      example: has(`dumps/scores-daily-${year}.csv`),
      kind: 'csv',
    },
    {
      path: 'dumps/gai-{YYYY-MM-DD}.json',
      holds: t(
        'The whole published dataset at the build date in one file: countries, events, sources, assessments, corrections, replies and open leads.',
        "L'ensemble des données publiées à la date de génération en un fichier : pays, événements, sources, évaluations, corrections, réponses et pistes ouvertes.",
      ),
      example: has(`dumps/gai-${date}.json`),
      kind: 'json',
    },
  ]
}

/** An example of this build: the file cut for display. */
export function exampleOf(api: ApiReader, e: Endpoint): Excerpt | null {
  if (e.example === null) return null
  const raw = api.text(e.example)
  if (e.kind === 'json') {
    return excerptJson(JSON.parse(raw), e.pick === undefined ? {} : { pick: e.pick })
  }
  return excerptLines(raw, e.kind === 'csv' ? 3 : 14)
}

/** What each structured table holds (docs/03 §1, §7), with its columns from the schema. */
export const STRUCTURED_DOCS: Record<StructuredTableName, LangText> = {
  'unga_votes.csv': t(
    'Recorded votes of the UN General Assembly on the qualifying resolutions and decisions (B1): one row per vote and country; Y, N, A, or X for absent or did not participate.',
    "Votes enregistrés de l'Assemblée générale des Nations unies sur les résolutions et décisions retenues (B1) : une ligne par vote et par pays ; Y, N, A, ou X pour absent ou n'ayant pas participé.",
  ),
  'unsc_vetoes.csv': t(
    'Vetoes cast in the Security Council (B2): one row per draft and vetoing member; only drafts calling for a ceasefire, truce or pause (`ceasefire` true) score.',
    'Vetos au Conseil de sécurité (B2) : une ligne par projet et par membre ayant opposé son veto ; seuls les projets appelant à un cessez-le-feu, une trêve ou une pause (`ceasefire` vrai) sont notés.',
  ),
  'fts_funding.csv': t(
    'Government humanitarian funding per donor and monthly D1 window (the twelve calendar months before the month the value applies to), from OCHA FTS; zeros included.',
    "Financement humanitaire gouvernemental par donateur et par fenêtre mensuelle de D1 (les douze mois civils précédant le mois auquel la valeur s'applique), selon le FTS d'OCHA ; zéros compris.",
  ),
  'fts_plan_totals.csv': t(
    'The same government funding per donor and FTS plan over all flow dates, for reference; it does not score.',
    "Le même financement gouvernemental par donateur et par plan du FTS, toutes dates de flux confondues, pour référence ; il n'est pas noté.",
  ),
  'sipri_deliveries.csv': t(
    'SIPRI trend-indicator values of major arms delivered to Israel, per release, data year and supplier, with the total to Israel (A1).',
    "Valeurs d'indicateur de tendance du SIPRI des armes majeures livrées à Israël, par édition, année de données et fournisseur, avec le total vers Israël (A1).",
  ),
  'sipri_orders.csv': t(
    'SIPRI trend-indicator values of new orders placed with Israel, per release, data year and buyer (A4).',
    "Valeurs d'indicateur de tendance du SIPRI des nouvelles commandes passées à Israël, par édition, année de données et acheteur (A4).",
  ),
  'comtrade_a2.csv': t(
    "Exports to Israel under HS 93, 8710, 8526 and 8802 per country, calendar year and heading, from UN Comtrade (own reporting, or Israel's mirror data), with the release date (A2).",
    "Exportations vers Israël sous les positions SH 93, 8710, 8526 et 8802 par pays, année civile et position, selon UN Comtrade (déclarations du pays, ou données miroir d'Israël), avec la date de publication (A2).",
  ),
  'comtrade_c3.csv': t(
    'Total goods trade with Israel per country and calendar year, with the 2022 total, from UN Comtrade, with the release date (C3).',
    'Commerce total de marchandises avec Israël par pays et année civile, avec le total de 2022, selon UN Comtrade, avec la date de publication (C3).',
  ),
  'gni.csv': t(
    'Gross national income, World Bank Atlas method, current US dollars, per country and year (the denominator of D1).',
    'Revenu national brut, méthode Atlas de la Banque mondiale, en dollars courants, par pays et année (le dénominateur de D1).',
  ),
  'population.csv': t(
    'Population per country and year, from the World Bank; kept for reference, it does not score.',
    "Population par pays et année, selon la Banque mondiale ; conservée pour référence, elle n'est pas notée.",
  ),
  'recognitions.csv': t(
    'Recognitions of the State of Palestine (B8): one row per recognising state, with the date the recognition took effect and the archived official statement that confirms it; a recognition before 7 October 2023 scores +3 from that day, a later one +8 from its date.',
    "Reconnaissances de l'État de Palestine (B8) : une ligne par État qui reconnaît, avec la date d'effet de la reconnaissance et la déclaration officielle archivée qui la confirme ; une reconnaissance antérieure au 7 octobre 2023 compte +3 à partir de ce jour, une reconnaissance postérieure +8 à partir de sa date.",
  ),
  'a2_confirmed_military.csv': t(
    'Exports to Israel under HS 8526 (radar and remote-control apparatus) or 8802 (aircraft) confirmed as military by a licence register, a parliamentary answer or a published investigation citing the customs code (A2): one row per country and heading. Without a row these headings do not count in A2.',
    'Exportations vers Israël sous les positions SH 8526 (appareils de radar et de télécommande) ou 8802 (aéronefs) dont la nature militaire est confirmée par un registre de licences, une réponse parlementaire ou une enquête publiée citant le code douanier (A2) : une ligne par pays et par position. Sans ligne, ces positions ne comptent pas dans A2.',
  ),
}

export function structuredTables(): { name: StructuredTableName; columns: readonly string[] }[] {
  return (Object.keys(STRUCTURED_TABLES) as StructuredTableName[]).map((name) => ({
    name,
    columns: STRUCTURED_TABLES[name].columns,
  }))
}
