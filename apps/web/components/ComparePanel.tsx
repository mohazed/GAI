'use client'

import type { ApiScoredCountryFile } from '@gai/schema/api'
import { useTranslations } from 'next-intl'
import { type KeyboardEvent, useEffect, useId, useMemo, useState } from 'react'
import { compareQuery, compareStyle, MAX_COMPARE, parseCompare } from '../lib/compare'
import type { Lang } from '../lib/i18n'
import type { SiteMethodology } from '../lib/methodology'
import type { Mode } from '../lib/mode'
import { type SearchCountry, searchMatches } from '../lib/search'
import type { Translate } from '../lib/translate'
import { CompareMark } from './CompareMark'
import type { CompareResultsView } from './CompareResults'

export interface ComparePanelProps {
  lang: Lang
  mode: Mode
  methodology: SiteMethodology
  /** Scored countries, the only ones that can be compared (excluded entities are not, D-10). */
  countries: SearchCountry[]
  buildDate: string
  siteUrl: string
  /** The API folder (`/api/v1`): countries/{ISO3}.json is fetched on demand (docs/04 §3). */
  apiBase: string
}

type Load =
  | { status: 'loading' }
  | { status: 'ok'; file: ApiScoredCountryFile }
  | { status: 'error' }

const MAX_OPTIONS = 8

/**
 * The Compare page's client part (docs/05 §6 Compare): the country picker (search and up to five
 * chips), the state in the URL (`?c=` and, in score mode, `?w=`, docs/04 §3), and the fetch of each
 * chosen country's file. The charts, tables and citation (CompareResults) load with `import()`
 * once a file is in, so the page's first JavaScript holds only the picker (docs/04 §3 budget).
 * The whole panel is in the HTML from the start (.js-only) so that hydration moves nothing; the
 * page gives readers without JavaScript an explanation and the country pages instead.
 */
export function ComparePanel({
  lang,
  mode,
  methodology,
  countries,
  buildDate,
  siteUrl,
  apiBase,
}: ComparePanelProps) {
  const intl = useTranslations()
  const t: Translate = (key, values) => intl(key as never, values as never)
  const id = useId()
  const scored = useMemo(() => new Set(countries.map((c) => c.iso3)), [countries])
  const byIso = useMemo(() => new Map(countries.map((c) => [c.iso3, c])), [countries])
  const [ready, setReady] = useState(false)
  const [chosen, setChosen] = useState<string[]>([])
  const [dropped, setDropped] = useState<string[]>([])
  // `?w=` as written in the address; CompareResults reads it with @gai/scoring's parseWeights,
  // so that the scoring code loads with the results, not with the picker.
  const [weights, setWeights] = useState<string | null>(null)
  const [loads, setLoads] = useState<Record<string, Load>>({})
  const [View, setView] = useState<typeof CompareResultsView | null>(null)

  // Read the address once, after hydration.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    const c = parseCompare(q.get('c'), scored)
    setChosen(c.kept)
    setDropped(c.dropped)
    // Scorecard mode has no score to weight (D-16): `w` is dropped.
    if (mode === 'score') setWeights(q.get('w'))
    setReady(true)
  }, [scored, mode])

  // Write the state back into the address (replaceState: the page is one view).
  useEffect(() => {
    if (!ready) return
    const url = `${window.location.pathname}${compareQuery(chosen, weights)}${window.location.hash}`
    window.history.replaceState(null, '', url)
  }, [ready, chosen, weights])

  // Fetch the files not yet asked for; the results views load with the first one.
  useEffect(() => {
    for (const iso3 of chosen) {
      if (loads[iso3] !== undefined) continue
      setLoads((l) => ({ ...l, [iso3]: { status: 'loading' } }))
      fetch(`${apiBase}/countries/${iso3}.json`)
        .then((r) => (r.ok ? (r.json() as Promise<ApiScoredCountryFile>) : null))
        .then((file) =>
          setLoads((l) => ({
            ...l,
            [iso3]:
              file !== null && file.excluded === false && file.iso3 === iso3
                ? { status: 'ok', file }
                : { status: 'error' },
          })),
        )
        .catch(() => setLoads((l) => ({ ...l, [iso3]: { status: 'error' } })))
    }
    if (chosen.length > 0 && View === null)
      import('./CompareResults').then((m) => setView(() => m.CompareResultsView)).catch(() => {})
  }, [chosen, loads, apiBase, View])

  const name = (iso3: string) => byIso.get(iso3)?.name[lang] ?? iso3
  const loading = chosen.filter((c) => loads[c] === undefined || loads[c]?.status === 'loading')
  const failed = chosen.filter((c) => loads[c]?.status === 'error')
  const files = chosen.flatMap((c) => {
    const l = loads[c]
    return l?.status === 'ok' ? [l.file] : []
  })
  // Colours, dashes and shapes follow the order of the countries shown (lib/compare.ts).
  const shown = loading.length === 0 ? files : []
  const styleIndex = new Map(shown.map((f, i) => [f.iso3, i]))

  const add = (iso3: string) => {
    if (chosen.includes(iso3) || chosen.length >= MAX_COMPARE) return
    setChosen([...chosen, iso3])
  }
  const remove = (iso3: string) => setChosen(chosen.filter((c) => c !== iso3))

  const status =
    loading.length > 0
      ? t('compare.loading', { countries: loading.map(name).join(', ') })
      : failed.length > 0
        ? t('compare.failed', { countries: failed.map(name).join(', ') })
        : ''

  return (
    <div className="js-only flex flex-col gap-8">
      <section aria-labelledby={`${id}-pick`} className="flex flex-col gap-4">
        <h2 id={`${id}-pick`} className="text-18 font-semibold">
          {t('compare.pickTitle')}
        </h2>
        <CountryPicker
          lang={lang}
          t={t}
          countries={countries.filter((c) => !chosen.includes(c.iso3))}
          full={chosen.length >= MAX_COMPARE}
          onPick={add}
        />
      </section>
      {/* Everything that changes after hydration or a fetch sits in this region, which keeps a
          minimum height (app/globals.css .compare-results) so that nothing below it moves. */}
      <div className="compare-results flex flex-col gap-4">
        {/* The chosen countries open the results region: chips added after hydration (a
            `?c=` of five countries wraps them onto several lines) then grow inside the region's
            reserved height instead of pushing it and the picker down (CLS 0.031 with five
            countries before; docs/10 B-174). */}
        <ul aria-label={t('compare.chosen')} className="flex min-h-8 flex-wrap gap-2">
          {chosen.map((iso3) => {
            const i = styleIndex.get(iso3)
            return (
              <li
                key={iso3}
                className="inline-flex min-h-8 items-center gap-2 rounded-xs border border-rule ps-2"
              >
                {/* Before its file is in, the chip keeps the mark's 36 px, so that the name
                    does not move when the mark appears (CLS, docs/10 B-174). */}
                {i === undefined ? (
                  <span aria-hidden="true" className="inline-block h-3 w-9 shrink-0" />
                ) : (
                  <CompareMark style={compareStyle(i)} />
                )}
                <a href={`/${lang}/country/${iso3}/`} className="text-16">
                  {name(iso3)}
                </a>
                <button
                  type="button"
                  className="inline-flex min-h-8 min-w-8 items-center justify-center text-18 text-ink-2 hover:text-ink"
                  aria-label={t('compare.remove', { country: name(iso3) })}
                  onClick={() => remove(iso3)}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </li>
            )
          })}
        </ul>
        {dropped.length > 0 ? (
          <p className="text-14 text-ink-2">
            {t('compare.dropped', { codes: dropped.join(', '), max: MAX_COMPARE })}
          </p>
        ) : null}
        <p aria-live="polite" className="text-14 text-ink-2">
          {status}
        </p>
        {chosen.length === 0 ? (
          <p className="text-16 text-ink-2">
            {t(mode === 'score' ? 'compare.empty' : 'compare.emptyScorecard', {
              max: MAX_COMPARE,
            })}
          </p>
        ) : View !== null && shown.length > 0 ? (
          <View
            lang={lang}
            t={t}
            mode={mode}
            methodology={methodology}
            files={shown}
            weights={weights}
            onWeights={setWeights}
            buildDate={buildDate}
            siteUrl={siteUrl}
          />
        ) : null}
      </div>
    </div>
  )
}

/**
 * The picker's search field: an ARIA 1.2 combobox over the scored countries' names in both
 * languages and their ISO3 codes (lib/search.ts, as the home page's search box); Enter or a
 * click adds the active option. Disabled at five countries.
 */
function CountryPicker({
  lang,
  t,
  countries,
  full,
  onPick,
}: {
  lang: Lang
  t: Translate
  countries: SearchCountry[]
  full: boolean
  onPick: (iso3: string) => void
}) {
  const id = useId()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const matches = useMemo(
    () => searchMatches(countries, q, lang, MAX_OPTIONS),
    [q, countries, lang],
  )
  const pick = (c: SearchCountry | undefined) => {
    if (c === undefined) return
    onPick(c.iso3)
    setQ('')
    setActive(0)
    setOpen(false)
  }
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setActive((a) => Math.min(a + 1, Math.max(matches.length - 1, 0)))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Escape') {
      setOpen(false)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      pick(matches[active])
    }
  }
  const listId = `${id}-list`
  const expanded = open && q.trim() !== '' && !full
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={`${id}-input`} className="text-16 font-semibold">
        {t('compare.add')}
      </label>
      <div className="relative max-w-112">
        <input
          id={`${id}-input`}
          type="search"
          autoComplete="off"
          value={q}
          disabled={full}
          onChange={(e) => {
            setQ(e.currentTarget.value)
            setOpen(true)
            setActive(0)
          }}
          onKeyDown={onKey}
          onBlur={() => window.setTimeout(() => setOpen(false), 150)}
          role="combobox"
          aria-expanded={expanded}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            expanded && matches[active] ? `${id}-opt-${matches[active]?.iso3}` : undefined
          }
          aria-describedby={`${id}-hint`}
          className="min-h-10 w-full rounded-xs border border-ink bg-paper px-3 text-16 disabled:border-rule disabled:bg-paper-2"
        />
        {expanded ? (
          <ul
            id={listId}
            // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: the ARIA 1.2 combobox listbox; focus stays on the input (aria-activedescendant).
            role="listbox"
            aria-label={t('compare.add')}
            className="absolute top-full z-10 mt-1 w-full rounded-xs border border-ink bg-paper py-1"
          >
            {matches.length === 0 ? (
              <li className="px-3 py-2 text-14 text-ink-2">{t('search.none', { q: q.trim() })}</li>
            ) : (
              matches.map((c, i) => (
                // biome-ignore lint/a11y/useKeyWithClickEvents: keyboard selection is on the combobox input (ARIA 1.2 pattern).
                // biome-ignore lint/a11y/useFocusableInteractive: options are reached through aria-activedescendant, not focus.
                <li
                  key={c.iso3}
                  id={`${id}-opt-${c.iso3}`}
                  // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: an option of the listbox above.
                  role="option"
                  aria-selected={i === active}
                  className={`flex min-h-8 cursor-pointer items-center justify-between gap-4 px-3 text-16 ${i === active ? 'bg-paper-2' : ''}`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(c)}
                >
                  {c.name[lang]}
                  <span className="font-mono text-m12 text-ink-2">{c.iso3}</span>
                </li>
              ))
            )}
          </ul>
        ) : null}
      </div>
      {/* Two lines kept for the hint: the "full" message that replaces it at five countries is
          longer and would otherwise push the results down after hydration (docs/10 B-174). */}
      <p id={`${id}-hint`} className="min-h-[2lh] text-12 text-ink-2">
        {full ? t('compare.full', { max: MAX_COMPARE }) : t('compare.hint', { max: MAX_COMPARE })}
      </p>
    </div>
  )
}
