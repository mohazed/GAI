'use client'

import {
  type CategoryWeights,
  DEFAULT_WEIGHTS,
  formatSigned,
  isDefaultWeights,
  roundHalfAwayFromZero,
  userScore,
} from '@gai/scoring'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'
import { type BandSpec, combineModel, type SiteMethodology } from '../lib/methodology'
import type { Mode } from '../lib/mode'
import type { RankRow } from '../lib/rank'

type SortKey = 'score' | 'coverage' | 'lastChange' | 'name' | 'events'
type Dir = 'asc' | 'desc'
type Lang = 'en' | 'fr'

export interface RankTableProps {
  rows: RankRow[]
  mode: Mode
  methodology: SiteMethodology
  /** Reader weights (docs/02 §9); the defaults reproduce the published scores. */
  weights?: CategoryWeights
  /** Anchor id of the table (the masthead's "Countries" link points at `#countries`). */
  id?: string
}

const MEMBERSHIPS = ['unsc', 'eu', 'nato', 'arab_league', 'oic', 'g20', 'g7', 'brics'] as const

interface Effective {
  score: number
  display: number
  band: string
  delta: number
}

function fmtSigned(x: number, lang: Lang, decimals = 0): string {
  return formatSigned(x, lang, decimals)
}

function fmtPercent(ratio: number, lang: Lang): string {
  const n = roundHalfAwayFromZero(ratio * 100, 0)
  return lang === 'fr' ? `${n}\u202f%` : `${n}%`
}

/**
 * The ranking as a table (docs/05 §5 RankTable): position, country, score, band, the five category
 * subtotals as mini-bars, coverage with a micro bar, last change. Sortable and filterable once
 * JavaScript runs; the server-rendered table is complete and sorted by score. Scorecard mode
 * (D-16): alphabetical, no score or band, an event count instead. Excluded entities are listed
 * apart, with the reason (D-10). No flags (D-23).
 */
export function RankTable({
  rows,
  mode,
  methodology,
  weights = DEFAULT_WEIGHTS,
  id,
}: RankTableProps) {
  const t = useTranslations('rank')
  const lang = useLocale() as Lang
  const scoreMode = mode === 'score'
  const [ready, setReady] = useState(false)
  const [sort, setSort] = useState<{ key: SortKey; dir: Dir }>(
    scoreMode ? { key: 'score', dir: 'desc' } : { key: 'name', dir: 'asc' },
  )
  const [regions, setRegions] = useState<string[]>([])
  const [bands, setBands] = useState<string[]>([])
  const [members, setMembers] = useState<string[]>([])
  const [cov50, setCov50] = useState(false)
  useEffect(() => setReady(true), [])

  const model = useMemo(() => combineModel(methodology), [methodology])
  const custom = !isDefaultWeights(weights)
  const scored = rows.filter((r) => !r.excluded)
  const excluded = rows.filter((r) => r.excluded)

  const effective = useMemo(() => {
    const out = new Map<string, Effective>()
    for (const r of scored) {
      if (r.score === null || r.display === null || r.band === null || r.clipped === null) continue
      if (!custom) {
        out.set(r.iso3, { score: r.score, display: r.display, band: r.band, delta: 0 })
        continue
      }
      const c = r.clipped
      const u = userScore(
        {
          categories: {
            A: { clipped: c.A },
            B: { clipped: c.B },
            C: { clipped: c.C },
            D: { clipped: c.D },
            E: { clipped: c.E },
          },
          passivity: { value: r.passivityValue ?? 0 },
        },
        weights,
        model,
      )
      out.set(r.iso3, {
        score: u.score,
        display: u.display,
        band: u.band,
        delta: u.display - r.display,
      })
    }
    return out
  }, [scored, custom, weights, model])

  // Positions follow the (reader-weighted) score, whatever the column sorted on.
  const positions = useMemo(() => {
    const order = [...scored].sort((a, b) => {
      const d = (effective.get(b.iso3)?.score ?? 0) - (effective.get(a.iso3)?.score ?? 0)
      return d !== 0 ? d : a.iso3 < b.iso3 ? -1 : 1
    })
    return new Map(order.map((r, i) => [r.iso3, i + 1]))
  }, [scored, effective])

  const collator = useMemo(() => new Intl.Collator(lang), [lang])
  const visible = useMemo(() => {
    const keep = scored.filter(
      (r) =>
        (regions.length === 0 || regions.includes(r.region)) &&
        (bands.length === 0 || bands.includes(effective.get(r.iso3)?.band ?? '')) &&
        (members.length === 0 || members.every((m) => r.memberOf.includes(m))) &&
        (!cov50 || (r.coverage ?? 0) >= 0.5),
    )
    const sign = sort.dir === 'asc' ? 1 : -1
    const val = (r: RankRow): number | string => {
      switch (sort.key) {
        case 'score':
          return effective.get(r.iso3)?.score ?? 0
        case 'coverage':
          return r.coverage ?? 0
        case 'lastChange':
          return r.lastChange ?? ''
        case 'events':
          return r.events ?? 0
        case 'name':
          return r.name[lang]
      }
    }
    return keep.sort((a, b) => {
      const va = val(a)
      const vb = val(b)
      const d =
        typeof va === 'string' && typeof vb === 'string'
          ? collator.compare(va, vb)
          : (va as number) - (vb as number)
      if (d !== 0) return sign * d
      // Equal scores keep the order of the positions (ISO3, as ApiRanked); other ties go by name.
      if (sort.key === 'score') return a.iso3 < b.iso3 ? -1 : 1
      return collator.compare(a.name[lang], b.name[lang])
    })
  }, [scored, regions, bands, members, cov50, sort, effective, collator, lang])

  const regionList = useMemo(() => [...new Set(scored.map((r) => r.region))].sort(), [scored])
  const memberList = MEMBERSHIPS.filter((m) => scored.some((r) => r.memberOf.includes(m)))
  const bandSpec = (id: string): BandSpec | undefined => methodology.bands.find((b) => b.id === id)
  const filtered = regions.length + bands.length + members.length > 0 || cov50

  const toggle = (list: string[], set: (v: string[]) => void, v: string) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v])

  const header = (key: SortKey, label: string, align: 'start' | 'end' = 'start', extra = '') => {
    const active = sort.key === key
    const ariaSort = active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined
    return (
      <th
        scope="col"
        aria-sort={ariaSort}
        className={`sticky top-0 z-[1] border-b border-ink bg-paper py-2 pe-3 font-semibold ${align === 'end' ? 'text-end' : 'text-start'} ${extra}`}
      >
        {ready ? (
          <button
            type="button"
            className="inline-flex min-h-6 cursor-pointer items-center gap-1 font-semibold"
            onClick={() =>
              setSort(
                active
                  ? { key, dir: sort.dir === 'asc' ? 'desc' : 'asc' }
                  : { key, dir: key === 'name' ? 'asc' : 'desc' },
              )
            }
          >
            {label}
            <span aria-hidden="true" className="font-mono text-m11 text-ink-2">
              {active ? (sort.dir === 'asc' ? '↑' : '↓') : ''}
            </span>
          </button>
        ) : (
          // The same box as the button, so that hydration does not move the rows (CLS).
          <span className="inline-flex min-h-6 items-center gap-1">
            {label}
            <span aria-hidden="true" className="font-mono text-m11 text-ink-2">
              {active ? (sort.dir === 'asc' ? '↑' : '↓') : ''}
            </span>
          </span>
        )}
      </th>
    )
  }
  const plainHeader = (label: string, extra = '') => (
    <th
      scope="col"
      className={`sticky top-0 z-[1] border-b border-ink bg-paper py-2 pe-3 text-start font-semibold ${extra}`}
    >
      {label}
    </th>
  )
  const colCount = scoreMode ? 7 : 3

  return (
    <div id={id} className="flex flex-col gap-4">
      {/* Server-rendered so that hydration does not push the table down; hidden without
          scripting (.js-only), where the buttons could not filter anything. */}
      {scored.length > 0 ? (
        <fieldset className="js-only flex flex-col gap-2">
          <legend className="text-14 font-semibold">{t('filters')}</legend>
          <div className="flex flex-wrap items-center gap-2">
            {regionList.map((r) => (
              <button
                key={r}
                type="button"
                className="btn"
                aria-pressed={regions.includes(r)}
                onClick={() => toggle(regions, setRegions, r)}
              >
                {t.has(`regions.${r}` as 'regions.Europe')
                  ? t(`regions.${r}` as 'regions.Europe')
                  : r}
              </button>
            ))}
            {scoreMode
              ? methodology.bands.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    className={`btn band-${b.id}`}
                    aria-pressed={bands.includes(b.id)}
                    onClick={() => toggle(bands, setBands, b.id)}
                  >
                    <span aria-hidden="true" className="band-swatch inline-block size-2" />
                    {b.name[lang]}
                  </button>
                ))
              : null}
            {memberList.map((m) => (
              <button
                key={m}
                type="button"
                className="btn"
                aria-pressed={members.includes(m)}
                onClick={() => toggle(members, setMembers, m)}
              >
                {t(`memberships.${m}`)}
              </button>
            ))}
            <button
              type="button"
              className="btn"
              aria-pressed={cov50}
              onClick={() => setCov50(!cov50)}
            >
              {t('coverage50')}
            </button>
            {filtered ? (
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setRegions([])
                  setBands([])
                  setMembers([])
                  setCov50(false)
                }}
              >
                {t('clear')}
              </button>
            ) : null}
          </div>
        </fieldset>
      ) : null}
      <p aria-live="polite" className="text-14 text-ink-2">
        {t('count', { shown: visible.length, total: scored.length })}
      </p>
      <table className="w-full border-separate border-spacing-0 text-14">
        <caption className="sr-only">{scoreMode ? t('caption') : t('captionScorecard')}</caption>
        <thead>
          <tr>
            {scoreMode ? plainHeader(t('cols.position'), 'w-8') : null}
            {/* Scorecard mode: the country column keeps a share of the width, so that the table's
                columns do not change as rows with longer names (and the excluded entities) are
                parsed after the first paint (CLS, docs/10 B-150). */}
            {header('name', t('cols.country'), 'start', scoreMode ? '' : 'w-[45%]')}
            {scoreMode
              ? header('score', t('cols.score'), 'end')
              : header('events', t('cols.events'), 'end')}
            {scoreMode ? plainHeader(t('cols.band')) : null}
            {scoreMode ? plainHeader(t('cols.categories'), 'hidden md:table-cell') : null}
            {header('coverage', t('cols.coverage'), 'end')}
            {scoreMode
              ? header('lastChange', t('cols.lastChange'), 'start', 'hidden md:table-cell')
              : null}
          </tr>
        </thead>
        <tbody>
          {visible.length === 0 ? (
            <tr>
              <td colSpan={colCount} className="py-4 text-ink-2">
                {scored.length === 0 ? t('none') : t('empty')}
              </td>
            </tr>
          ) : null}
          {visible.map((r) => {
            const e = effective.get(r.iso3)
            const band = e ? bandSpec(e.band) : undefined
            return (
              <tr key={r.iso3} className="align-top">
                {scoreMode ? (
                  <td className="border-b border-rule py-2 pe-3 font-mono text-m13 text-ink-2">
                    {positions.get(r.iso3)}
                  </td>
                ) : null}
                <th scope="row" className="border-b border-rule py-2 pe-3 text-start font-normal">
                  <a href={`/${lang}/country/${r.iso3}/`}>{r.name[lang]}</a>
                  <span className="block font-mono text-m11 text-ink-2 md:inline md:ps-2">
                    {r.iso3}
                  </span>
                </th>
                {scoreMode ? (
                  <td className="border-b border-rule py-2 pe-3 text-end font-mono text-m13 whitespace-nowrap">
                    <span className="num font-semibold">{e ? fmtSigned(e.display, lang) : ''}</span>
                    {e && e.delta !== 0 ? (
                      <span className="block text-m11 text-ink-2">
                        <span className="sr-only">{t('delta')} </span>
                        <span className="num">({fmtSigned(e.delta, lang)})</span>
                      </span>
                    ) : null}
                  </td>
                ) : (
                  <td className="border-b border-rule py-2 pe-3 text-end font-mono text-m13">
                    {r.events ?? 0}
                  </td>
                )}
                {scoreMode ? (
                  <td className="border-b border-rule py-2 pe-3">
                    {band ? (
                      <span
                        className={`band-${band.id} band-tint inline-flex items-center gap-1.5 rounded-xs px-1.5 py-0.5 text-12 whitespace-nowrap`}
                      >
                        <span aria-hidden="true" className="band-swatch inline-block size-2" />
                        {band.name[lang]}
                      </span>
                    ) : null}
                  </td>
                ) : null}
                {scoreMode ? (
                  <td className="hidden border-b border-rule py-2 pe-3 md:table-cell">
                    {r.clipped ? (
                      <MiniBars clipped={r.clipped} methodology={methodology} lang={lang} />
                    ) : null}
                  </td>
                ) : null}
                <td className="border-b border-rule py-2 pe-3 text-end whitespace-nowrap">
                  <span className="num font-mono text-m13">
                    {fmtPercent(r.coverage ?? 0, lang)}
                  </span>
                  {r.statuses ? (
                    <MicroCoverage statuses={r.statuses} methodology={methodology} />
                  ) : null}
                </td>
                {scoreMode ? (
                  <td className="hidden border-b border-rule py-2 font-mono text-m12 text-ink-2 md:table-cell">
                    {r.lastChange ?? '—'}
                  </td>
                ) : null}
              </tr>
            )
          })}
        </tbody>
        {excluded.length > 0 ? (
          <tbody>
            <tr>
              <th
                scope="colgroup"
                colSpan={colCount}
                className="border-b border-rule pt-6 pb-2 text-start font-semibold"
              >
                {t('excluded')}
              </th>
            </tr>
            {excluded.map((r) => (
              <tr key={r.iso3}>
                <th
                  scope="row"
                  colSpan={scoreMode ? 2 : 1}
                  className="border-b border-rule py-2 pe-3 text-start font-normal"
                >
                  <a href={`/${lang}/country/${r.iso3}/`}>{r.name[lang]}</a>
                  <span className="block font-mono text-m11 text-ink-2 md:inline md:ps-2">
                    {r.iso3}
                  </span>
                </th>
                <td
                  colSpan={colCount - (scoreMode ? 2 : 1)}
                  className="border-b border-rule py-2 text-ink-2"
                >
                  {r.excludedReason?.[lang]}
                </td>
              </tr>
            ))}
          </tbody>
        ) : null}
      </table>
    </div>
  )
}

/** Five 40 × 8 px bars on each category's own cap axis, zero marked (docs/05 §5 RankTable). */
function MiniBars({
  clipped,
  methodology,
  lang,
}: {
  clipped: Record<'A' | 'B' | 'C' | 'D' | 'E', number>
  methodology: SiteMethodology
  lang: Lang
}) {
  const text = methodology.categories
    .map((c) => `${c.id} ${fmtSigned(clipped[c.id], lang, 1)}`)
    .join(', ')
  return (
    <span className="inline-flex gap-1" dir="ltr">
      <span className="sr-only">{text}</span>
      {methodology.categories.map((c) => {
        const span = c.cap.max - c.cap.min
        const x = (v: number) => ((v - c.cap.min) / span) * 40
        const x0 = x(0)
        const xv = x(Math.max(c.cap.min, Math.min(c.cap.max, clipped[c.id])))
        const fill = c.scored ? 'fill-ink' : 'fill-ink-3'
        return (
          <svg key={c.id} width="40" height="8" aria-hidden="true" className="block">
            <title>{`${c.id} ${fmtSigned(clipped[c.id], lang, 1)}`}</title>
            <rect x={0} y={3.5} width={40} height={1} className="fill-rule" />
            <rect
              x={Math.min(x0, xv)}
              y={1}
              width={Math.max(Math.abs(xv - x0), 0)}
              height={6}
              className={fill}
            />
            <rect x={x0 - 0.5} y={0} width={1} height={8} className="fill-ink-2" />
          </svg>
        )
      })}
    </span>
  )
}

/** 31 segments, one per scored indicator: ink covered, grey no data, rule unchecked. */
function MicroCoverage({
  statuses,
  methodology,
}: {
  statuses: Record<string, string>
  methodology: SiteMethodology
}) {
  const ids = methodology.indicators.filter((i) => i.scored).map((i) => i.id)
  return (
    <svg
      width={ids.length * 3}
      height="8"
      aria-hidden="true"
      className="mt-1 ms-auto hidden md:block ltr"
    >
      {ids.map((id, i) => {
        const s = statuses[id]
        const cls =
          s === 'has-events' || s === 'none-found'
            ? 'fill-ink'
            : s === 'no-data'
              ? 'fill-ink-3'
              : s === 'unchecked'
                ? 'fill-rule'
                : 'fill-transparent'
        return <rect key={id} x={i * 3} y={0} width={2} height={8} className={cls} />
      })}
    </svg>
  )
}
