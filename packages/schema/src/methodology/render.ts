/**
 * Renders the methodology YAML as Markdown tables and keeps the generated blocks of
 * methodology.{en,fr}.md in sync (one source of truth: the YAML; docs/05 §6).
 *
 * A generated block in the Markdown looks like:
 *
 *   <!-- BEGIN generated:indicators -->
 *
 *   …table rendered from indicators.yaml…
 *
 *   <!-- END generated:indicators -->
 *
 * Everything between the two marker lines belongs to the renderer; `pnpm methodology:render`
 * rewrites it and the rule `methodology.docs-generated` (validate/rules/docs.ts) fails when it is
 * stale. The output is deterministic: no clock, no locale APIs, LF line endings.
 *
 * Typography: numbers use the minus sign U+2212 and an explicit + on positive points; EN groups
 * thousands with a comma and uses a decimal point; FR groups with U+202F and uses a decimal
 * comma, and the French text written here puts U+00A0 before ":" and U+202F before ";", "?" and
 * "!". Text taken from the YAML is used verbatim (it carries its own typography).
 */
import type { Methodology } from '../load/methodology.js'
import type {
  Category,
  Formula,
  Indicator,
  PointsSpec,
  PointsTier,
  QualifyingVote,
  ThresholdTier,
} from './schemas.js'

export const GENERATED_BLOCKS = [
  'indicators',
  'categories',
  'bands',
  'confidence',
  'decay',
  'passivity',
  'thresholds',
  'symmetry',
  'votes',
] as const
export type GeneratedBlock = (typeof GENERATED_BLOCKS)[number]
export type DocLang = 'en' | 'fr'

const MINUS = '\u2212'
const NBSP = '\u00a0'
const NNBSP = '\u202f'

export function isGeneratedBlock(name: string): name is GeneratedBlock {
  return (GENERATED_BLOCKS as readonly string[]).includes(name)
}

// ---------------------------------------------------------------------------------------------
// Numbers, dates, lists

export interface NumberFormat {
  /** Prefix positive values with `+` (points, caps, score bounds). */
  plus?: boolean
  /** Exactly this many decimals (`toFixed`). */
  decimals?: number
  /** At least this many decimals (weights: 1 → `1.0`). */
  minDecimals?: number
}

/** Digits of |n| without exponent notation. */
function plainDigits(abs: number, decimals: number | undefined): string {
  if (decimals !== undefined) return abs.toFixed(decimals)
  const s = String(abs)
  if (!s.includes('e')) return s
  return abs.toFixed(20).replace(/0+$/, '').replace(/\.$/, '')
}

/**
 * `-1234.5` → EN `−1,234.5`, FR `−1 234,5` (U+202F). Zero never carries a sign, and a value that
 * rounds to zero is not shown as `−0`.
 */
export function formatNumber(n: number, lang: DocLang, opts: NumberFormat = {}): string {
  let digits = plainDigits(Math.abs(n), opts.decimals)
  const [intPart = '0', fracPart = ''] = digits.split('.')
  let frac = fracPart
  if (opts.minDecimals !== undefined && frac.length < opts.minDecimals) {
    frac = frac.padEnd(opts.minDecimals, '0')
  }
  const group = lang === 'fr' ? NNBSP : ','
  const grouped = intPart.length > 3 ? intPart.replace(/\B(?=(\d{3})+(?!\d))/g, group) : intPart
  digits = frac === '' ? grouped : `${grouped}${lang === 'fr' ? ',' : '.'}${frac}`
  const sign = !/[1-9]/.test(digits) ? '' : n < 0 ? MINUS : opts.plus && n > 0 ? '+' : ''
  return `${sign}${digits}`
}

/** Points with an explicit sign: `+10`, `−15`, `0`. */
function pts(n: number, lang: DocLang): string {
  return formatNumber(n, lang, { plus: true })
}

const MONTHS: Record<DocLang, string[]> = {
  en: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  fr: [
    'janvier',
    'février',
    'mars',
    'avril',
    'mai',
    'juin',
    'juillet',
    'août',
    'septembre',
    'octobre',
    'novembre',
    'décembre',
  ],
}

/** `2024-03-11` → EN `11 March 2024`, FR `11 mars 2024` (`1er` for the first of the month). */
export function formatDate(iso: string, lang: DocLang): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  const month = match ? MONTHS[lang][Number(match[2]) - 1] : undefined
  if (!match || month === undefined) return iso
  const day = Number(match[3])
  return `${lang === 'fr' && day === 1 ? '1er' : String(day)} ${month} ${match[1]}`
}

/** `A, B and C` / `A, B et C`. */
function joinAnd(items: string[], lang: DocLang): string {
  if (items.length <= 1) return items.join('')
  const and = lang === 'fr' ? 'et' : 'and'
  return `${items.slice(0, -1).join(', ')} ${and} ${items.at(-1)}`
}

/**
 * Indicator ids with runs of three or more consecutive numbers of one category collapsed:
 * `B2, B3, …, B12, C1` → `B2–B12, C1`. Order is kept as given.
 */
export function compressIds(ids: readonly string[]): string {
  const runs: { prefix: string; from: number; to: number; raw?: string }[] = []
  for (const id of ids) {
    const match = /^([A-Z])(\d+)$/.exec(id)
    const last = runs.at(-1)
    if (!match || match[1] === undefined) {
      runs.push({ prefix: '', from: 0, to: 0, raw: id })
      continue
    }
    const n = Number(match[2])
    if (last && last.raw === undefined && last.prefix === match[1] && last.to + 1 === n) last.to = n
    else runs.push({ prefix: match[1], from: n, to: n })
  }
  return runs
    .flatMap((r) => {
      if (r.raw !== undefined) return [r.raw]
      if (r.to - r.from >= 2) return [`${r.prefix}${r.from}–${r.prefix}${r.to}`]
      const out: string[] = []
      for (let n = r.from; n <= r.to; n++) out.push(`${r.prefix}${n}`)
      return out
    })
    .join(', ')
}

// ---------------------------------------------------------------------------------------------
// Markdown

/** One table cell: single line, pipes escaped. */
function cell(text: string): string {
  const flat = text.replace(/\s*\n\s*/g, ' ').trim()
  return flat === '' ? '—' : flat.replace(/\|/g, '\\|')
}

/** A GitHub-flavoured Markdown table in the style of the hand-written tables (`|---|`). */
function table(headers: readonly string[], rows: readonly (readonly string[])[]): string {
  const line = (cells: readonly string[]) => `| ${cells.map(cell).join(' | ')} |`
  return [line(headers), `|${headers.map(() => '---').join('|')}|`, ...rows.map(line)].join('\n')
}

// ---------------------------------------------------------------------------------------------
// Words written by the renderer (column headers, connectors), per language

interface Words {
  semi: string
  indicatorHeaders: readonly string[]
  cap: string
  experimental: string
  notScored: string
  noIndicator: string
  evidenceRules: string
  types: Record<Indicator['type'], string>
  perInstance: string
  range: (min: string, max: string) => string
  formula: string
  mostSevere: string
  onePerTier: string
  latest: (ids: string) => string
  supersededBy: (ids: string) => string
  supersedes: (ids: string) => string
  categoryHeaders: readonly string[]
  scored: (scored: boolean, experimental: boolean) => string
  bandHeaders: readonly string[]
  confidenceHeaders: readonly string[]
  decayHeaders: readonly string[]
  decaySpan: (from: string, to: string) => string
  decayLinear: (formula: string, endWeight: string) => string
  decayAfter: (end: string) => string
  thresholdHeaders: readonly string[]
  rounded: (decimals: number) => string
  before: (date: string) => string
  noData: string
  otherwise: string
  and: string
  where: (text: string) => string
  passivityHeaders: readonly string[]
  penalty: string
  points: (n: string) => string
  window: string
  days: (n: string) => string
  qualifying: string
  minContribution: string
  statuses: string
  excluded: (ids: string) => string
  sensitivity: string
  symmetryHeaders: readonly string[]
  none: string
  votesHeaders: readonly string[]
  votesEmpty: string
  subjects: Record<QualifyingVote['subject'], string>
}

const WORDS: Record<DocLang, Words> = {
  en: {
    semi: '; ',
    indicatorHeaders: [
      'ID',
      'Indicator',
      'Points',
      'Type',
      'Indicator cap and stacking',
      'Primary sources',
      'Cadence',
    ],
    cap: 'cap',
    experimental: 'experimental',
    notScored: 'not scored',
    noIndicator: 'No indicator in this category.',
    evidenceRules: 'Evidence rules',
    types: { standing: 'standing', repeatable: 'repeatable', computed: 'computed' },
    perInstance: 'per instance',
    range: (min, max) => `${min} to ${max}`,
    formula: 'formula',
    mostSevere: 'only the largest holding tier counts',
    onePerTier: 'one event per tier, tiers add',
    latest: (ids) => `latest position of ${ids} holds`,
    supersededBy: (ids) => `superseded by ${ids}`,
    supersedes: (ids) => `supersedes ${ids}`,
    categoryHeaders: ['Category', 'Cap', 'Scored'],
    scored: (scored, experimental) =>
      `${scored ? 'Yes' : 'No'}${experimental ? ', experimental' : ''}`,
    bandHeaders: ['Band', 'Score', 'Meaning', 'Illustrative conduct'],
    confidenceHeaders: ['Level', 'Weight', 'Rule'],
    decayHeaders: ['Δ (days)', 'd(Δ)'],
    decaySpan: (from, to) => `${from} to ${to}`,
    decayLinear: (formula, endWeight) => `${formula}, from 1 to ${endWeight}`,
    decayAfter: (end) => `over ${end}, or before the event`,
    thresholdHeaders: ['Condition', 'Points'],
    rounded: (d) =>
      d === 0
        ? 'rounded to an integer'
        : d === 1
          ? 'rounded to one decimal'
          : `rounded to ${d} decimals`,
    before: (date) => `Before ${date}`,
    noData: 'No data',
    otherwise: 'Otherwise',
    and: 'and',
    where: (text) => `(${text})`,
    passivityHeaders: ['Parameter', 'Value'],
    penalty: 'Penalty',
    points: (n) => `${n} points`,
    window: 'Window',
    days: (n) => `${n} days, up to and including t`,
    qualifying: 'Qualifying indicators',
    minContribution: 'Minimum absolute contribution',
    statuses: 'Event statuses',
    excluded: (ids) => `Excluded: ${ids}`,
    sensitivity: 'Sensitivity values',
    symmetryHeaders: ['Negative', 'Positive counterpart', 'Note'],
    none: 'None',
    votesHeaders: ['Symbol', 'Date', 'Subject', 'Yes–no–abstain', 'Rationale'],
    votesEmpty:
      'No qualifying votes are listed yet; the list is filled once each vote is verified.',
    subjects: { gaza: 'Gaza', unrwa: 'UNRWA', 'palestine-status': 'Status of Palestine' },
  },
  fr: {
    semi: `${NNBSP}; `,
    indicatorHeaders: [
      'ID',
      'Indicateur',
      'Points',
      'Type',
      "Plafond de l'indicateur et cumul",
      'Sources primaires',
      'Cadence',
    ],
    cap: 'plafond',
    experimental: 'expérimentale',
    notScored: 'non notée',
    noIndicator: 'Aucun indicateur dans cette catégorie.',
    evidenceRules: 'Règles de preuve',
    types: {
      standing: 'état durable',
      repeatable: 'événement répétable',
      computed: 'quantité calculée',
    },
    perInstance: 'par instance',
    range: (min, max) => `de ${min} à ${max}`,
    formula: 'formule',
    mostSevere: 'seul le palier en vigueur le plus élevé compte',
    onePerTier: "un événement par palier, les paliers s'additionnent",
    latest: (ids) => `la dernière position entre ${ids} prévaut`,
    supersededBy: (ids) => `remplacé par ${ids}`,
    supersedes: (ids) => `remplace ${ids}`,
    categoryHeaders: ['Catégorie', 'Plafond', 'Notée'],
    scored: (scored, experimental) =>
      `${scored ? 'Oui' : 'Non'}${experimental ? ', expérimentale' : ''}`,
    bandHeaders: ['Bande', 'Score', 'Signification', 'Exemples de conduite'],
    confidenceHeaders: ['Niveau', 'Poids', 'Règle'],
    decayHeaders: ['Δ (jours)', 'd(Δ)'],
    decaySpan: (from, to) => `de ${from} à ${to}`,
    decayLinear: (formula, endWeight) => `${formula}, de 1 à ${endWeight}`,
    decayAfter: (end) => `au-delà de ${end} ou avant l'événement`,
    thresholdHeaders: ['Condition', 'Points'],
    rounded: (d) =>
      d === 0
        ? "arrondi à l'entier"
        : d === 1
          ? 'arrondi à une décimale'
          : `arrondi à ${d} décimales`,
    before: (date) => `Avant le ${date}`,
    noData: 'Pas de données',
    otherwise: 'Sinon',
    and: 'et',
    where: (text) => `(${text})`,
    passivityHeaders: ['Paramètre', 'Valeur'],
    penalty: 'Pénalité',
    points: (n) => `${n} points`,
    window: 'Fenêtre',
    days: (n) => `${n} jours, jusqu'à t inclus`,
    qualifying: 'Indicateurs admissibles',
    minContribution: 'Contribution minimale en valeur absolue',
    statuses: 'Statuts des événements',
    excluded: (ids) => `Exclus${NBSP}: ${ids}`,
    sensitivity: 'Valeurs de sensibilité',
    symmetryHeaders: ['Négatif', 'Pendant positif', 'Remarque'],
    none: 'Aucun',
    votesHeaders: ['Cote', 'Date', 'Objet', 'Pour–contre–abstention', 'Justification'],
    votesEmpty: `Aucun vote retenu ne figure encore dans la liste${NNBSP}; elle est remplie une fois chaque vote vérifié.`,
    subjects: { gaza: 'Gaza', unrwa: 'UNRWA', 'palestine-status': 'Statut de la Palestine' },
  },
}

// ---------------------------------------------------------------------------------------------
// indicators (indicators.yaml, grouped by the categories of categories.yaml)

function tierList(tiers: readonly PointsTier[], lang: DocLang): string {
  return tiers.map((t) => `${t.label[lang]} ${pts(t.value, lang)}`).join(' / ')
}

/** `+10`; `−5 per instance`; `Yes +3 / Abstain −2 …`; `−40 to 0 (formula a1)`. */
function pointsCell(p: PointsSpec, lang: DocLang): string {
  const W = WORDS[lang]
  switch (p.kind) {
    case 'fixed':
      return pts(p.value, lang)
    case 'per_instance':
      return p.tiers
        ? `${tierList(p.tiers, lang)}, ${W.perInstance}`
        : `${pts(p.value ?? 0, lang)} ${W.perInstance}`
    case 'tiers':
      return tierList(p.tiers, lang)
    case 'formula':
      return `${W.range(pts(p.range.min, lang), pts(p.range.max, lang))} (${W.formula} ${p.ref})`
  }
}

/** Indicator cap, a short stacking phrase and the supersede relations, or `—`. */
function capCell(ind: Indicator, supersedes: readonly string[], lang: DocLang): string {
  const W = WORDS[lang]
  const parts: string[] = []
  const cap = ind.indicator_cap
  if (cap && (cap.min !== null || cap.max !== null)) {
    const bounds = [cap.min, cap.max].flatMap((v) => (v === null ? [] : [pts(v, lang)]))
    parts.push(`${W.cap} ${bounds.join(' / ')}`)
  }
  switch (ind.stacking.rule) {
    case 'most_severe':
      parts.push(W.mostSevere)
      break
    case 'one_per_tier':
      parts.push(W.onePerTier)
      break
    case 'latest_position':
      parts.push(W.latest(joinAnd(ind.stacking.group ?? [ind.id], lang)))
      break
    case 'sum':
      break
  }
  if (ind.superseded_by.length > 0) parts.push(W.supersededBy(joinAnd(ind.superseded_by, lang)))
  if (supersedes.length > 0) parts.push(W.supersedes(joinAnd([...supersedes], lang)))
  return parts.length > 0 ? parts.join(W.semi) : '—'
}

function sourcesCell(ind: Indicator, lang: DocLang): string {
  return ind.primary_sources
    .map((s) => (s.url ? `[${s[lang]}](${s.url})` : s[lang]))
    .join(WORDS[lang].semi)
}

/** `### A. Arms & military (cap −45 / +30)`, with `· experimental · not scored` for E. */
function categoryHeading(c: Category, lang: DocLang): string {
  const W = WORDS[lang]
  const flags = [...(c.experimental ? [W.experimental] : []), ...(c.scored ? [] : [W.notScored])]
  const cap = `${W.cap} ${pts(c.cap.min, lang)} / ${pts(c.cap.max, lang)}`
  return [`### ${c.id}. ${c.name[lang]} (${cap})`, ...flags].join(' · ')
}

/**
 * One section per category (categories.yaml order): a heading with the category cap, the table
 * ID | Indicator | Points | Type | Indicator cap and stacking | Primary sources | Cadence, then
 * the evidence rule of each indicator as a list.
 * The headings are level 3 because the block sits directly under the level-2 "Indicator table"
 * heading: no skipped heading level for the axe check of the methodology page (docs/04 §3,
 * docs/05 §10).
 */
function renderIndicators(m: Methodology, lang: DocLang): string {
  const file = m.indicatorsFile?.value
  if (!file) return ''
  const W = WORDS[lang]
  const cadences: Partial<Record<string, { en: string; fr: string }>> = file.cadences
  const supersedes = new Map<string, string[]>()
  for (const ind of m.indicators) {
    for (const by of ind.superseded_by) supersedes.set(by, [...(supersedes.get(by) ?? []), ind.id])
  }
  const tableOf = (inds: readonly Indicator[]) =>
    inds.length === 0
      ? W.noIndicator
      : table(
          W.indicatorHeaders,
          inds.map((ind) => [
            ind.id,
            ind.name[lang],
            pointsCell(ind.points, lang),
            W.types[ind.type],
            capCell(ind, supersedes.get(ind.id) ?? [], lang),
            sourcesCell(ind, lang),
            cadences[ind.cadence]?.[lang] ?? ind.cadence,
          ]),
        )
  // The evidence rule of each indicator runs to 40–90 words: a list under the table, not a column.
  const evidenceOf = (inds: readonly Indicator[]) =>
    inds.length === 0
      ? ''
      : `\n\n**${W.evidenceRules}**\n\n${inds
          .map(
            (ind) =>
              `- **${ind.id}** — ${ind.evidence.rule[lang].replace(/\s*\n\s*/g, ' ').trim()}`,
          )
          .join('\n')}`
  const sections: string[] = []
  const categories = m.categories?.value.categories ?? []
  const known = new Set<string>(categories.map((c) => c.id))
  for (const c of categories) {
    const inds = m.indicators.filter((i) => i.category === c.id)
    sections.push(`${categoryHeading(c, lang)}\n\n${tableOf(inds)}${evidenceOf(inds)}`)
  }
  const orphans = m.indicators.filter((i) => !known.has(i.category))
  for (const catId of [...new Set(orphans.map((i) => i.category))]) {
    sections.push(`### ${catId}\n\n${tableOf(orphans.filter((i) => i.category === catId))}`)
  }
  return sections.join('\n\n')
}

// ---------------------------------------------------------------------------------------------
// categories, bands, confidence, decay

/** Category | Cap | Scored. */
function renderCategories(m: Methodology, lang: DocLang): string {
  const file = m.categories?.value
  if (!file) return ''
  const W = WORDS[lang]
  return table(
    W.categoryHeaders,
    file.categories.map((c) => [
      `${c.id}. ${c.name[lang]}`,
      `${pts(c.cap.min, lang)} / ${pts(c.cap.max, lang)}`,
      W.scored(c.scored, c.experimental),
    ]),
  )
}

/** Band | Score | Meaning | Illustrative conduct; score as `−100 to −51`. */
function renderBands(m: Methodology, lang: DocLang): string {
  const file = m.bands?.value
  if (!file) return ''
  const W = WORDS[lang]
  return table(
    W.bandHeaders,
    file.bands.map((b) => [
      b.name[lang],
      W.range(pts(b.min, lang), pts(b.max, lang)),
      b.meaning[lang],
      b.illustrative[lang],
    ]),
  )
}

/** Level | Weight | Rule; weights with at least one decimal (`1.0`, FR `0,7`). */
function renderConfidence(m: Methodology, lang: DocLang): string {
  const file = m.confidence?.value
  if (!file) return ''
  return table(
    WORDS[lang].confidenceHeaders,
    file.levels.map((l) => [
      l.label[lang],
      formatNumber(l.weight, lang, { minDecimals: 1 }),
      l.rule[lang],
    ]),
  )
}

/** Removes floating-point noise from a derived constant (1 − 0.25 → 0.75). */
function clean(n: number): number {
  return Number(n.toFixed(10))
}

/** Δ (days) | d(Δ): the plateau, the linear segment and the zero, from decay.yaml numbers. */
function renderDecay(m: Methodology, lang: DocLang): string {
  const d = m.decay?.value
  if (!d) return ''
  const W = WORDS[lang]
  const n = (v: number) => formatNumber(v, lang)
  const slope = n(clean(1 - d.end_weight))
  const span = n(d.end_days - d.plateau_days)
  const linear = `1 ${MINUS} ${slope} × (Δ ${MINUS} ${n(d.plateau_days)}) / ${span}`
  return table(W.decayHeaders, [
    [W.decaySpan('0', n(d.plateau_days)), '1'],
    [W.decaySpan(n(d.plateau_days + 1), n(d.end_days)), W.decayLinear(linear, n(d.end_weight))],
    [W.decayAfter(n(d.end_days)), n(d.before_event)],
  ])
}

// ---------------------------------------------------------------------------------------------
// thresholds

type TierFormula = Extract<Formula, { kind: 'tiers' | 'ratio_gated_tiers' }>

/**
 * The measured variable, as the measure texts of thresholds.yaml name it: T for the
 * ratio-gated trade total (C3), x for a share of GNI (D1), TIV for SIPRI values (A4), V for any
 * other USD value (A2).
 */
function variableOf(f: TierFormula): string {
  if (f.kind === 'ratio_gated_tiers') return 'T'
  if (f.unit === 'percent_of_gni') return 'x'
  if (f.unit === 'tiv') return 'TIV'
  return 'V'
}

/** `100,000,000 USD`, `500`, `0.0100 %` (percent of GNI keeps four decimals). */
function quantity(value: number, unit: TierFormula['unit'], lang: DocLang): string {
  if (value === 0) return '0'
  switch (unit) {
    case 'usd':
      return `${formatNumber(value, lang, { decimals: 0 })}${NBSP}USD`
    case 'tiv':
      return formatNumber(value, lang, { decimals: 0 })
    case 'percent_of_gni':
      return `${formatNumber(value, lang, { decimals: 4 })}${lang === 'fr' ? NNBSP : NBSP}%`
  }
}

const OP: Record<ThresholdTier['op'], string> = { gte: '≥', gt: '>' }
const NOT_OP: Record<ThresholdTier['op'], string> = { gte: '<', gt: '≤' }

/**
 * The condition of the `otherwise` row: the negation of the last tier when the tiers are
 * strictly decreasing (`V < 100,000 USD`, `x = 0` for `> 0`), else the word "Otherwise".
 */
function otherwiseCondition(f: TierFormula, lang: DocLang): string {
  const v = variableOf(f)
  const last = f.tiers.at(-1)
  const decreasing = f.tiers.every((t, i) => i === 0 || t.value < (f.tiers[i - 1]?.value ?? 0))
  if (!last || !decreasing) return WORDS[lang].otherwise
  if (last.op === 'gt' && last.value === 0) return `${v} = 0`
  return `${v} ${NOT_OP[last.op]} ${quantity(last.value, f.unit, lang)}`
}

function formulaRows(f: Formula, lang: DocLang): string[][] {
  const W = WORDS[lang]
  if (f.kind === 'sqrt_share') {
    return [
      ['0 ≤ s ≤ 1', `${formatNumber(f.scale, lang)} × √s, ${W.rounded(f.decimals)}`],
      [W.before(formatDate(f.no_data_before, lang)), W.noData],
    ]
  }
  const v = variableOf(f)
  const tierRows = f.tiers.map((t) => [
    `${v} ${OP[t.op]} ${quantity(t.value, f.unit, lang)}`,
    pts(t.points, lang),
  ])
  const otherwise = [otherwiseCondition(f, lang), pts(f.otherwise, lang)]
  if (f.kind === 'tiers') return [...tierRows, otherwise]
  const ratio = formatNumber(f.ratio_min, lang)
  const gate = `r ${OP.gte} ${ratio} ${W.and} `
  return [
    [`r < ${ratio} ${W.where(`r = T ÷ T(${f.baseline_year})`)}`, pts(f.otherwise, lang)],
    ...tierRows.map(([condition = '', points = '']) => [`${gate}${condition}`, points]),
    [`${gate}${otherwise[0]}`, otherwise[1] ?? ''],
  ]
}

/**
 * Per formula, in thresholds.yaml order: `#### A2 (formula a2) — {indicator name}` and a
 * Condition | Points table built from the tiers and `otherwise` (A1: the formula itself and the
 * no-data date).
 */
function renderThresholds(m: Methodology, lang: DocLang): string {
  const file = m.thresholds?.value
  if (!file) return ''
  const W = WORDS[lang]
  return Object.entries(file.formulas)
    .map(([key, f]) => {
      const ind = m.indicators.find((i) => i.id === f.indicator)
      const title = `${f.indicator} (${W.formula} ${key})${ind ? ` — ${ind.name[lang]}` : ''}`
      return `#### ${title}\n\n${table(W.thresholdHeaders, formulaRows(f, lang))}`
    })
    .join('\n\n')
}

// ---------------------------------------------------------------------------------------------
// passivity, symmetry, votes

/** Parameter | Value: the constants of passivity.yaml. */
function renderPassivity(m: Methodology, lang: DocLang): string {
  const p = m.passivity?.value
  if (!p) return ''
  const W = WORDS[lang]
  const n = (v: number) => formatNumber(v, lang)
  return table(W.passivityHeaders, [
    [W.penalty, W.points(n(p.points))],
    [W.window, W.days(n(p.window_days))],
    [W.qualifying, compressIds(p.qualifying_indicators)],
    [W.minContribution, n(p.min_abs_contribution)],
    [W.statuses, p.statuses.map((s) => `\`${s}\``).join(', ')],
    ...p.excluded.map((e) => [W.excluded(compressIds(e.indicators)), e.reason[lang]]),
    [W.sensitivity, W.points(joinAnd(p.sensitivity_points.map(n), lang))],
  ])
}

/** Negative | Positive counterpart | Note, then the negatives without counterpart. */
function renderSymmetry(m: Methodology, lang: DocLang): string {
  const s = m.symmetry?.value
  if (!s) return ''
  const W = WORDS[lang]
  return table(W.symmetryHeaders, [
    ...s.pairs.map((p) => [p.negative_label[lang], p.positive_label[lang], p.note?.[lang] ?? '—']),
    ...s.no_counterpart.map((c) => [c.indicator, W.none, c.reason[lang]]),
  ])
}

/** Symbol | Date | Subject | Yes–no–abstain | Rationale, or one sentence while empty. */
function renderVotes(m: Methodology, lang: DocLang): string {
  const v = m.votes?.value
  if (!v) return ''
  const W = WORDS[lang]
  if (v.votes.length === 0) return W.votesEmpty
  const n = (x: number) => formatNumber(x, lang)
  return table(
    W.votesHeaders,
    v.votes.map((vote) => [
      vote.symbol,
      formatDate(vote.date, lang),
      W.subjects[vote.subject],
      `${n(vote.counts.yes)}–${n(vote.counts.no)}–${n(vote.counts.abstain)}`,
      vote.rationale[lang],
    ]),
  )
}

// ---------------------------------------------------------------------------------------------
// Public API

const RENDERERS: Record<GeneratedBlock, (m: Methodology, lang: DocLang) => string> = {
  indicators: renderIndicators,
  categories: renderCategories,
  bands: renderBands,
  confidence: renderConfidence,
  decay: renderDecay,
  passivity: renderPassivity,
  thresholds: renderThresholds,
  symmetry: renderSymmetry,
  votes: renderVotes,
}

/** Markdown for one block in one language ('' when the YAML it needs did not load). */
export function renderBlock(m: Methodology, block: GeneratedBlock, lang: DocLang): string {
  return RENDERERS[block](m, lang)
}

/** A marker line: `<!-- BEGIN generated:NAME -->` or `<!-- END generated:NAME -->`. */
export interface GeneratedMarker {
  kind: 'BEGIN' | 'END'
  name: string
  /** 1-based line number. */
  line: number
}

const MARKER_RE = /^\s*<!--\s*(BEGIN|END)\s+generated:\s*([^\s>]*?)\s*-->\s*$/

/** Every marker line of `text`, in order (any name, known or not). */
export function findMarkers(text: string): GeneratedMarker[] {
  const out: GeneratedMarker[] = []
  text
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .forEach((raw, i) => {
      const match = MARKER_RE.exec(raw)
      if (match)
        out.push({
          kind: match[1] === 'BEGIN' ? 'BEGIN' : 'END',
          name: match[2] ?? '',
          line: i + 1,
        })
    })
  return out
}

/** A BEGIN/END pair of a known block with no other marker between them. */
export interface GeneratedPair {
  name: GeneratedBlock
  /** 1-based lines of the two markers. */
  begin: number
  end: number
}

/** Well-formed pairs: `BEGIN x` immediately followed (among markers) by `END x`, x known. */
export function generatedPairs(markers: readonly GeneratedMarker[]): GeneratedPair[] {
  const pairs: GeneratedPair[] = []
  markers.forEach((mk, i) => {
    const next = markers[i + 1]
    if (
      mk.kind === 'BEGIN' &&
      isGeneratedBlock(mk.name) &&
      next?.kind === 'END' &&
      next.name === mk.name
    ) {
      pairs.push({ name: mk.name, begin: mk.line, end: next.line })
    }
  })
  return pairs
}

/** The lines a pair must enclose: a blank line, the rendering, a blank line. */
export function renderedLines(m: Methodology, block: GeneratedBlock, lang: DocLang): string[] {
  return ['', ...renderBlock(m, block, lang).split('\n'), '']
}

/**
 * `text` with every well-formed generated block replaced by its current rendering, so that the
 * result has a blank line after BEGIN and before END. Unknown names and unbalanced markers are
 * left untouched (the validator reports them). Idempotent; line endings become LF.
 */
export function renderDoc(text: string, m: Methodology, lang: DocLang): string {
  const lines = text.replace(/\r\n?/g, '\n').split('\n')
  const out: string[] = []
  let cursor = 0
  for (const pair of generatedPairs(findMarkers(text))) {
    out.push(...lines.slice(cursor, pair.begin), ...renderedLines(m, pair.name, lang))
    cursor = pair.end - 1
  }
  out.push(...lines.slice(cursor))
  return out.join('\n')
}
