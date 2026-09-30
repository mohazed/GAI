/**
 * The widget's markup (docs/04 §4, docs/05 §5 ScoreGauge, CoverageBar, Timeline), as strings:
 * pure functions of the country file, the options and the site's config, so that they can be
 * tested without a browser. Charts are SVG without a viewBox, positioned in percentages, as on
 * the site (apps/web/lib/chart.ts); no style attribute anywhere (the site's CSP refuses them).
 * Every text from the file is escaped.
 */
import {
  dayNumber,
  formatLongDate,
  formatSigned,
  frenchTypography,
  roundHalfAwayFromZero,
} from '@gai/scoring'
import type { Lang, View, WidgetConfig } from './config.js'
import { STRINGS } from './strings.js'

export interface Options {
  /** ISO 3166-1 alpha-3, upper case; null when `data-country` is not one. */
  iso3: string | null
  view: View
  lang: Lang
  /** Origin of the site the data is read from and linked to. */
  origin: string
}

type LangText = Record<Lang, string>

/** The fields of `countries/{ISO3}.json` the widget reads (@gai/schema/api ApiCountryFile). */
export interface CountryFile {
  iso3: string
  name: LangText
  excluded: boolean
  excluded_reason?: LangText
  build_date: string
  methodology: string
  score?: number
  score_display?: number
  band?: string
  band_name?: LangText
  summary?: LangText
  summary_scorecard?: LangText
  coverage?: {
    ratio: number
    applicable: number
    has_events: number
    none_found: number
    no_data: number
    unchecked: number
    statuses: Record<string, string>
  }
  series?: { date: string; score: number }[]
  event_list?: {
    date: string
    indicator: string
    points: number
    summary: LangText
    generated: boolean
    scored: boolean
    type: string
  }[]
}

const esc = (s: string | number): string =>
  String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)

const pct = (n: number): string => `${Math.round(n * 1000) / 1000}%`

/** Reads the options of a script element's data attributes (docs/04 §4, apps/web/lib/embed.ts). */
export function readOptions(
  data: Record<string, string | undefined>,
  scriptSrc: string,
  base: string,
): Options {
  const iso3 = (data.country ?? '').trim().toUpperCase()
  let origin = new URL(scriptSrc || base, base).origin
  if (data.origin) {
    try {
      const u = new URL(data.origin)
      if (/^https?:$/.test(u.protocol)) origin = u.origin
    } catch {
      // An address that does not parse leaves the script's own origin.
    }
  }
  return {
    iso3: /^[A-Z]{3}$/.test(iso3) ? iso3 : null,
    view: data.view === 'timeline' ? 'timeline' : 'gauge',
    lang: data.lang === 'fr' ? 'fr' : 'en',
    origin,
  }
}

export function countryUrl(o: Options): string {
  return `${o.origin}/${o.lang}/${o.iso3 === null ? '' : `country/${o.iso3}/`}`
}

export function dataUrl(o: Options): string {
  return `${o.origin}/api/v1/countries/${o.iso3}.json`
}

const percent = (ratio: number, lang: Lang): string =>
  `${roundHalfAwayFromZero(ratio * 100, 0)}${lang === 'fr' ? ' ' : ''}%`

/** An unsigned-looking number: the minus sign when negative, no plus (apps/web lib/format `plain`). */
const plain = (x: number, lang: Lang): string => formatSigned(x, lang, 0).replace('+', '')

/** The −100…+100 bar (ScoreGauge): band colours and marker in score mode, the bare scale otherwise. */
function gaugeSvg(f: CountryFile, o: Options, c: WidgetConfig): string {
  const t = STRINGS[o.lang]
  const [min, max] = c.clip
  const x = (v: number) => Math.max(0, Math.min(100, ((v - min) / (max - min)) * 100))
  const score = c.mode === 'score'
  let s = ''
  for (const [id, from, to] of c.bands) {
    s += `<rect class="${score ? `b-${id}` : 'sc'}" x="${pct(x(from))}" width="${pct(x(to) - x(from))}" y="24" height="12"/>`
  }
  for (const [, from] of c.bands.slice(1)) {
    s += `<line class="${score ? 'sp' : 'sr'}" x1="${pct(x(from))}" x2="${pct(x(from))}" y1="24" y2="36"/>`
  }
  s += '<line class="tk" x1="50%" x2="50%" y1="36" y2="43"/>'
  for (const v of [min, min / 2, 0, max / 2, max]) {
    const label = v === 0 ? t.zero : v > 0 ? `+${plain(v, o.lang)}` : plain(v, o.lang)
    // The ±50 labels give way in a narrow column, where they would run into the zero label.
    const cls = v === min || v === max || v === 0 ? '' : ' class="q"'
    s += `<text${cls} x="${pct(x(v))}" y="56" text-anchor="${v === min ? 'start' : v === max ? 'end' : 'middle'}">${esc(label)}</text>`
  }
  let label = t.scorecardLabel
  if (score) {
    const band = f.band_name?.[o.lang] ?? ''
    label = t.gaugeLabel(formatSigned(f.score_display ?? 0, o.lang, 0), band)
    s += `<svg x="${pct(x(f.score ?? 0))}" overflow="visible"><title>${esc(t.tooltip(formatSigned(f.score ?? 0, o.lang), f.methodology))}</title><path class="ik" d="M-5,14 L5,14 L0,21 Z"/><rect class="ik" x="-1" y="21" width="2" height="20"/></svg>`
  }
  return `<div role="img" aria-label="${esc(label)}" dir="ltr"><svg width="100%" height="64" overflow="visible" aria-hidden="true">${s}</svg></div>`
}

/** Indicator ids in methodology order: category letter, then number (A1 … A8, B1 … B12). */
const byId = (a: string, b: string): number =>
  a.charCodeAt(0) - b.charCodeAt(0) || Number(a.slice(1)) - Number(b.slice(1))

const SEGMENT: Record<string, string> = {
  'has-events': 'k',
  'none-found': 'k',
  'no-data': 'h',
  unchecked: 'u',
}

/** CoverageBar: one segment per applicable indicator, with the figures written out. */
function coverageHtml(f: CountryFile, o: Options): string {
  const t = STRINGS[o.lang]
  const cov = f.coverage
  if (cov === undefined) return ''
  const share = percent(cov.ratio, o.lang)
  let segs = ''
  for (const id of Object.keys(cov.statuses).sort(byId)) {
    const st = cov.statuses[id] ?? 'unchecked'
    if (SEGMENT[st] === undefined) continue
    segs += `<li class="${SEGMENT[st]}" title="${esc(`${id} · ${t.status[st]}`)}"></li>`
  }
  const aria = t.coverageAria(
    share,
    cov.has_events + cov.none_found,
    cov.applicable,
    cov.no_data,
    cov.unchecked,
  )
  return `<div class="cv"><p class="row f14"><span class="sb">${esc(t.coverage(share))}</span><span class="i2">${esc(t.missing(cov.no_data, cov.unchecked))}</span></p><div role="img" aria-label="${esc(aria)}" dir="ltr"><ul class="bar">${segs}</ul></div></div>`
}

const PLOT_TOP = 12
const PLOT_BOTTOM = 172
const CHART_HEIGHT = 200
const STRIP_HEIGHT = 72

/** First days of the quarters strictly after `from` and on or before `to` (apps/web lib/chart). */
function quarterTicks(from: string, to: string): string[] {
  const out: string[] = []
  let y = Number(from.slice(0, 4))
  let q = Math.floor((Number(from.slice(5, 7)) - 1) / 3)
  for (;;) {
    q += 1
    if (q === 4) {
      q = 0
      y += 1
    }
    const d = `${y}-${String(q * 3 + 1).padStart(2, '0')}-01`
    if (d > to) return out
    out.push(d)
  }
}

/** Timeline: the score as a step line on the −100…+100 axis in score mode, a date strip otherwise. */
function timelineSvg(f: CountryFile, o: Options, c: WidgetConfig): string {
  const t = STRINGS[o.lang]
  const from = c.start
  const to = f.build_date
  const d0 = dayNumber(from)
  const span = Math.max(dayNumber(to) - d0, 1)
  const x = (iso: string) => Math.max(0, Math.min(100, ((dayNumber(iso) - d0) / span) * 100))
  const [min, max] = c.clip
  const y = (v: number) =>
    Math.round((PLOT_BOTTOM - ((v - min) / (max - min)) * (PLOT_BOTTOM - PLOT_TOP)) * 100) / 100
  const series = f.series ?? []
  const events = (f.event_list ?? []).filter((e) => e.scored && e.date >= from && e.date <= to)
  const score = c.mode === 'score'
  const axisY = score ? PLOT_BOTTOM : STRIP_HEIGHT - 28
  let s = ''
  let axis = ''
  if (score) {
    for (const [id, lo, hi] of c.bands) {
      s += `<rect class="b-${id} st" x="0" width="100%" y="${y(hi)}" height="${y(lo) - y(hi)}"/>`
    }
    for (const v of [min, min / 2, 0, max / 2, max]) {
      s += `<line class="${v === 0 ? 'g0' : 'sr'}" x1="0" x2="100%" y1="${y(v)}" y2="${y(v)}"/>`
      axis += `<text x="34" y="${y(v) + 4}" text-anchor="end">${v > 0 ? `+${v}` : plain(v, o.lang)}</text>`
    }
    // The step line, in a nested SVG stretched to the plot width (apps/web lib/chart stepPath).
    let d = ''
    let prev: number | null = null
    for (const p of [...series, { date: to, score: series[series.length - 1]?.score ?? 0 }]) {
      const px = Math.round(x(p.date) * 1000) / 100
      const py = y(p.score)
      d += prev === null ? `M${px},${py}` : `H${px}V${py}`
      prev = py
    }
    s += `<svg width="100%" height="${CHART_HEIGHT}" viewBox="0 0 1000 ${CHART_HEIGHT}" preserveAspectRatio="none"><path class="ln" d="${d}"/></svg>`
  } else {
    s += `<line class="sr" x1="0" x2="100%" y1="${axisY / 2}" y2="${axisY / 2}"/>`
  }
  s += `<line class="sr" x1="0" x2="100%" y1="${axisY}" y2="${axisY}"/>`
  for (const q of quarterTicks(from, to)) {
    const year = q.endsWith('-01-01')
    s += `<line class="i3" x1="${pct(x(q))}" x2="${pct(x(q))}" y1="${axisY}" y2="${axisY + (year ? 6 : 3)}"/>`
    if (year)
      s += `<text x="${pct(x(q))}" y="${axisY + 18}" text-anchor="middle">${q.slice(0, 4)}</text>`
  }
  for (const e of events) {
    let at = series[0]?.score ?? 0
    for (const p of series) if (p.date <= e.date) at = p.score
    const r = e.generated ? 3 : 5
    const neg = e.points < 0
    const tip = `${e.date} · ${e.indicator} · ${formatSigned(e.points, o.lang)}\n${e.summary[o.lang]}`
    s += `<circle class="${neg ? 'ik' : 'op'}" cx="${pct(x(e.date))}" cy="${score ? y(at) : axisY / 2}" r="${neg ? r : r - 0.75}"><title>${esc(tip)}</title></circle>`
  }
  const name = f.name[o.lang]
  const longFrom = formatLongDate(from, o.lang)
  const longTo = formatLongDate(to, o.lang)
  const last = series[series.length - 1]
  const label = score
    ? t.timelineAria(
        name,
        longFrom,
        longTo,
        Math.max(0, series.length - 1),
        last === undefined ? '—' : formatSigned(last.score, o.lang),
      )
    : t.stripAria(
        name,
        longFrom,
        longTo,
        events.filter((e) => e.type !== 'computed').length,
        events.filter((e) => e.type === 'computed').length,
      )
  const h = score ? CHART_HEIGHT : STRIP_HEIGHT
  const yAxis = score ? `<svg width="40" height="${h}" aria-hidden="true">${axis}</svg>` : ''
  return `<div class="${score ? 'tl' : ''}" role="img" aria-label="${esc(label)}" dir="ltr">${yAxis}<svg width="100%" height="${h}" overflow="visible" aria-hidden="true">${s}</svg></div>`
}

/** The text of the link back to the country page. */
export function linkText(o: Options, name?: string): string {
  const who = name ?? o.iso3
  return who === null ? STRINGS[o.lang].site : STRINGS[o.lang].link(who)
}

/** The link back to the country page, as markup (the widget's footer). */
export function linkHtml(o: Options, name?: string): string {
  return `<a href="${esc(countryUrl(o))}">${esc(linkText(o, name))}</a>`
}

/** French typography on every string of a value. */
function frenchAll<T>(v: T): T {
  if (typeof v === 'string') return frenchTypography(v) as T
  if (Array.isArray(v)) return v.map(frenchAll) as T
  if (v === null || typeof v !== 'object') return v
  const out: Record<string, unknown> = {}
  for (const [k, x] of Object.entries(v)) out[k] = frenchAll(x)
  return out as T
}

/**
 * French typography on the `fr` member of every `{ en, fr }` text of the file, as the site shows
 * them (docs/05 §2, P-18: the API keeps straight apostrophes and ordinary spaces as written).
 */
function frenchDisplay<T>(v: T): T {
  if (Array.isArray(v)) return v.map(frenchDisplay) as T
  if (v === null || typeof v !== 'object') return v
  const text = 'en' in v && 'fr' in v && !('original' in v)
  const out: Record<string, unknown> = {}
  for (const [k, x] of Object.entries(v))
    out[k] = text && k === 'fr' ? frenchAll(x) : frenchDisplay(x)
  return out as T
}

/**
 * The widget for a country file, in the site's mode. Throws on a file that is not the country's
 * (the caller then keeps the link).
 */
export function renderWidget(file: CountryFile, o: Options, c: WidgetConfig): string {
  const f = o.lang === 'fr' ? frenchDisplay(file) : file
  if (f.iso3 !== o.iso3 || typeof f.name?.[o.lang] !== 'string') throw new Error('not this country')
  const t = STRINGS[o.lang]
  const name = f.name[o.lang]
  const foot = `<p class="f12 i2">${linkHtml(o, name)}. ${esc(t.built(formatLongDate(f.build_date, o.lang), f.methodology))}</p>`
  const head = `<p class="nm">${esc(name)}</p>`
  if (f.excluded) {
    return `<div class="w" lang="${o.lang}">${head}<p class="i2">${esc(t.excluded(f.excluded_reason?.[o.lang] ?? ''))}</p>${foot}</div>`
  }
  if (f.coverage === undefined || !Array.isArray(f.series))
    throw new Error('not a scored country file')
  const score = c.mode === 'score'
  const summary = (score ? f.summary : f.summary_scorecard)?.[o.lang] ?? ''
  let top: string
  if (!score) top = `<p class="i2">${esc(t.scorecard)}</p>`
  else if (o.view === 'gauge') {
    top = `<p class="hd" aria-hidden="true"><span class="sc0">${esc(formatSigned(f.score_display ?? 0, o.lang, 0))}</span><span class="chip b-${esc(f.band ?? '')}"><span class="sw"></span>${esc(f.band_name?.[o.lang] ?? '')}</span></p>`
  } else top = ''
  const body = o.view === 'gauge' ? gaugeSvg(f, o, c) + coverageHtml(f, o) : timelineSvg(f, o, c)
  return `<div class="w" lang="${o.lang}">${head}${top}${body}<p class="f14">${esc(summary).replace(/\d{4}-\d\d-\d\d/g, '<span class="n">$&</span>')}</p>${foot}</div>`
}
