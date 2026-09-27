'use client'

import { useLocale, useTranslations } from 'next-intl'
import { type KeyboardEvent, useEffect, useId, useMemo, useState } from 'react'

export interface SearchCountry {
  iso3: string
  name: { en: string; fr: string }
}

export interface SearchBoxProps {
  countries: SearchCountry[]
  /** Where the form goes without JavaScript: the ranking page, which lists every country. */
  action: string
}

const MAX = 8

function fold(s: string): string {
  return s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
}

/**
 * "Find a country" (docs/05 §6 Home): a combobox over the country names in both languages and
 * the ISO3 codes (docs/04 §3 Search), keyboard operable (arrows, Enter, Escape). Without
 * JavaScript the form opens the ranking page, which lists every country.
 */
export function SearchBox({ countries, action }: SearchBoxProps) {
  const t = useTranslations('search')
  const lang = useLocale() as 'en' | 'fr'
  const id = useId()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])

  const matches = useMemo(() => {
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
    return scored.slice(0, MAX).map((m) => m.c)
  }, [q, countries, lang])

  const go = (c: SearchCountry) => {
    window.location.assign(`/${lang}/country/${c.iso3}/`)
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
      const c = matches[active]
      if (c !== undefined) {
        e.preventDefault()
        go(c)
      }
    }
  }

  const listId = `${id}-list`
  const expanded = ready && open && q.trim() !== ''
  return (
    <search>
      <form
        action={action}
        method="get"
        className="flex flex-col gap-2"
        onSubmit={(e) => {
          const c = matches[active]
          if (c !== undefined) {
            e.preventDefault()
            go(c)
          }
        }}
      >
        <label htmlFor={`${id}-input`} className="text-16 font-semibold">
          {t('label')}
        </label>
        <div className="relative flex max-w-112 gap-2">
          {/* biome-ignore lint/a11y/useAriaPropsSupportedByRole: role="combobox" is set once hydrated, with its aria-expanded (ARIA 1.2 combobox); before that it is a plain search field. */}
          <input
            id={`${id}-input`}
            name="q"
            type="search"
            autoComplete="off"
            value={q}
            onChange={(e) => {
              setQ(e.currentTarget.value)
              setOpen(true)
              setActive(0)
            }}
            onKeyDown={onKey}
            onBlur={() => window.setTimeout(() => setOpen(false), 150)}
            role={ready ? 'combobox' : undefined}
            aria-expanded={ready ? expanded : undefined}
            aria-controls={ready ? listId : undefined}
            aria-autocomplete={ready ? 'list' : undefined}
            aria-activedescendant={
              expanded && matches[active] ? `${id}-opt-${matches[active]?.iso3}` : undefined
            }
            aria-describedby={`${id}-hint`}
            className="min-h-10 w-full rounded-xs border border-ink bg-paper px-3 text-16"
          />
          <button type="submit" className="btn min-h-10">
            {t('submit')}
          </button>
          {expanded ? (
            <ul
              id={listId}
              // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: the ARIA 1.2 combobox listbox; focus stays on the input (aria-activedescendant).
              role="listbox"
              aria-label={t('label')}
              className="absolute top-full z-10 mt-1 w-full rounded-xs border border-ink bg-paper py-1"
            >
              {matches.length === 0 ? (
                <li className="px-3 py-2 text-14 text-ink-2">{t('none', { q: q.trim() })}</li>
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
                    onClick={() => go(c)}
                  >
                    {c.name[lang]}
                    <span className="font-mono text-m12 text-ink-2">{c.iso3}</span>
                  </li>
                ))
              )}
            </ul>
          ) : null}
        </div>
        <p id={`${id}-hint`} className="text-12 text-ink-2">
          {t('hint')}
        </p>
      </form>
    </search>
  )
}
