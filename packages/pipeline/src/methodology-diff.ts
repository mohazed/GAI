/**
 * `diff.json` of a methodology version (docs/02 §11, docs/08 §1, B-141): every country whose
 * display score moves by 1 or more between the previous version and this one at one date, with
 * the cause in words, built from the engine's own results under both versions. Pure: the CLI
 * (cli/methodology-diff.ts) loads the two versions and scores them.
 *
 * The cause names what moved the score, in the same words for every country: the indicators
 * whose value changed in a category whose clipped subtotal changed (with the rule that changed
 * it: an indicator cap, the most severe of overlapping records, the confidence of an event, or
 * a recomputed value), the category cap when it binds, and the passivity penalty when its
 * decision changed (with the events that no longer lift it, or now do).
 */
import type { MethodologyDiffFile } from '@gai/schema'
import {
  type CategoryId,
  type CountryScore,
  type EventEvaluation,
  formatSigned,
  type Lang,
  type LangText,
} from '@gai/scoring'

export type DiffRow = MethodologyDiffFile['countries'][number]

export interface DiffInput {
  iso3: string
  name: LangText
  before: CountryScore
  after: CountryScore
}

const SCORED: readonly Exclude<CategoryId, 'E'>[] = ['A', 'B', 'C', 'D']
const EPS = 0.05

const T = {
  en: {
    indicatorCap: 'indicator cap',
    mostSevere: 'most severe of overlapping records',
    confidence: 'confidence',
    recomputed: 'value recomputed',
    categoryCap: (k: string, a: string, b: string) => `category ${k} ${a} → ${b} (category cap)`,
    applied: (p: string, list: string, n: number) =>
      n === 0
        ? `passivity penalty applied (${p})`
        : `passivity penalty applied (${p}): ${list} no longer ${n === 1 ? 'lifts' : 'lift'} it`,
    lifted: (p: string, list: string, n: number) =>
      n === 0 ? `passivity penalty lifted (${p})` : `passivity penalty lifted (${p}) by ${list}`,
    and: ' and ',
    none: 'rounding of the score',
  },
  fr: {
    indicatorCap: "plafond de l'indicateur",
    mostSevere: 'le plus grave des états superposés',
    confidence: 'niveau de confiance',
    recomputed: 'valeur recalculée',
    categoryCap: (k: string, a: string, b: string) =>
      `catégorie ${k} ${a} → ${b} (plafond de la catégorie)`,
    applied: (p: string, list: string) =>
      list === ''
        ? `pénalité de passivité appliquée (${p})`
        : `pénalité de passivité appliquée (${p}) : ${list} ne la lève plus`,
    lifted: (p: string, list: string) =>
      list === ''
        ? `pénalité de passivité levée (${p})`
        : `pénalité de passivité levée (${p}) par ${list}`,
    and: ' et ',
    none: 'arrondi du score',
  },
} as const

const fmt = (x: number, lang: Lang) => {
  const s = formatSigned(x, lang, 1)
  if (s === '0') return lang === 'fr' ? '0,0' : '0.0'
  return /[.,]/.test(s) ? s : `${s}${lang === 'fr' ? ',0' : '.0'}`
}

const indicatorValue = (s: CountryScore, id: string) =>
  s.indicators.find((i) => i.id === id)?.value ?? 0

/** Why an indicator's value changed, from the two evaluations of its events. */
function reasonOf(id: string, before: CountryScore, after: CountryScore, lang: Lang): string {
  const t = T[lang]
  const ib = before.indicators.find((i) => i.id === id)
  const ia = after.indicators.find((i) => i.id === id)
  if (ia?.capped === true && ib?.capped !== true) return t.indicatorCap
  const ev = (s: CountryScore) =>
    new Map(s.events.filter((e) => e.indicator === id).map((e) => [e.id, e] as const))
  const eb = ev(before)
  const ea = ev(after)
  const same = (a: EventEvaluation | undefined, b: EventEvaluation | undefined) =>
    a !== undefined && b !== undefined && a.points === b.points && a.date === b.date
  if (
    [...ea.values()].some((e) => e.reason === 'less-severe' && eb.get(e.id)?.reason === 'counted')
  )
    return t.mostSevere
  if ([...ea.values()].some((e) => same(e, eb.get(e.id)) && e.weight !== eb.get(e.id)?.weight))
    return t.confidence
  return t.recomputed
}

/** The events that lifted the penalty in one result and not in the other, as "C2 −10.0". */
function lifting(from: CountryScore, to: CountryScore, lang: Lang): string[] {
  const now = new Set(to.passivity.qualifying)
  return from.events
    .filter((e) => from.passivity.qualifying.includes(e.id) && !now.has(e.id))
    .map((e) => `${e.indicator} ${fmt(e.value, lang)}`)
    .filter((x, i, a) => a.indexOf(x) === i)
}

/** The cause of one country's move, in one language. */
export function causeOf(before: CountryScore, after: CountryScore, lang: Lang): string {
  const t = T[lang]
  const parts: string[] = []
  for (const k of SCORED) {
    const cb = before.categories[k]
    const ca = after.categories[k]
    if (Math.abs(ca.clipped - cb.clipped) < EPS) continue
    const ids = [...new Set([...before.indicators, ...after.indicators].map((i) => i.id))]
      .filter((id) => id.startsWith(k))
      .filter((id) => Math.abs(indicatorValue(after, id) - indicatorValue(before, id)) >= EPS)
      .sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)))
    for (const id of ids) {
      parts.push(
        `${id} ${fmt(indicatorValue(before, id), lang)} → ${fmt(indicatorValue(after, id), lang)} (${reasonOf(id, before, after, lang)})`,
      )
    }
    if (cb.capped || ca.capped)
      parts.push(t.categoryCap(k, fmt(cb.clipped, lang), fmt(ca.clipped, lang)))
  }
  if (before.passivity.applied !== after.passivity.applied) {
    const p = after.passivity.points
    const list = after.passivity.applied
      ? lifting(before, after, lang)
      : lifting(after, before, lang)
    const pts = fmt(after.passivity.applied ? -p : p, lang).replace(/[.,]0$/, '')
    parts.push(
      after.passivity.applied
        ? t.applied(pts, list.join(t.and), list.length)
        : t.lifted(pts, list.join(t.and), list.length),
    )
  }
  return parts.length === 0 ? t.none : parts.join('; ')
}

/** Every country whose display score moved by 1 or more, by ISO3, with its cause. */
export function diffRows(inputs: readonly DiffInput[]): DiffRow[] {
  return inputs
    .filter((x) => Math.abs(x.after.display - x.before.display) >= 1)
    .sort((a, b) => (a.iso3 < b.iso3 ? -1 : a.iso3 > b.iso3 ? 1 : 0))
    .map((x) => ({
      iso3: x.iso3,
      name: { en: x.name.en, fr: x.name.fr },
      old: x.before.display,
      new: x.after.display,
      cause: { en: causeOf(x.before, x.after, 'en'), fr: causeOf(x.before, x.after, 'fr') },
    }))
}

export interface DiffSummary {
  /** Countries whose display score moved by 1 or more. */
  changed: number
  /** Countries whose band changed, by band pair "from → to". */
  bands: Record<string, number>
  /** Countries whose passivity decision changed. */
  passivity: number
}

export function diffSummary(inputs: readonly DiffInput[]): DiffSummary {
  const bands: Record<string, number> = {}
  for (const x of inputs) {
    if (x.before.band === x.after.band) continue
    const k = `${x.before.band} → ${x.after.band}`
    bands[k] = (bands[k] ?? 0) + 1
  }
  return {
    changed: inputs.filter((x) => Math.abs(x.after.display - x.before.display) >= 1).length,
    bands: Object.fromEntries(Object.entries(bands).sort(([a], [b]) => (a < b ? -1 : 1))),
    passivity: inputs.filter((x) => x.before.passivity.applied !== x.after.passivity.applied)
      .length,
  }
}
