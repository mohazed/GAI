'use client'

import { useTranslations } from 'next-intl'
import { type KeyboardEvent, useEffect, useId, useRef, useState } from 'react'

export interface CiteThisProps {
  /** The three citation strings in the page language (`citations.score` or `.scorecard`, D-16). */
  citations: { apa: string; chicago: string; plain: string }
}

const STYLES = ['apa', 'chicago', 'plain'] as const
type Style = (typeof STYLES)[number]

/**
 * "Cite" (docs/05 §5 CiteThis): an outlined button opening a panel with three tabs (APA,
 * Chicago, Plain) and a Copy button. It is a <details>, so it opens without JavaScript and then
 * lists all three formats; with JavaScript the formats become tabs.
 */
export function CiteThis({ citations }: CiteThisProps) {
  const t = useTranslations('cite')
  const id = useId()
  const [ready, setReady] = useState(false)
  const [style, setStyle] = useState<Style>('plain')
  const [copied, setCopied] = useState(false)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  useEffect(() => setReady(true), [])

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = STYLES.indexOf(style)
    const next =
      e.key === 'ArrowRight'
        ? (i + 1) % 3
        : e.key === 'ArrowLeft'
          ? (i + 2) % 3
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? 2
              : -1
    if (next < 0) return
    e.preventDefault()
    setStyle(STYLES[next] as Style)
    setCopied(false)
    tabs.current[next]?.focus()
  }

  return (
    <details className="cite relative">
      <summary className="btn list-none">{t('button')}</summary>
      <div className="absolute z-10 mt-2 flex w-[min(36rem,calc(100vw-2rem))] flex-col gap-3 rounded-xs border border-ink bg-paper p-4">
        <p className="text-14 font-semibold">{t('title')}</p>
        {ready ? (
          <>
            <div role="tablist" aria-label={t('title')} className="flex gap-2" onKeyDown={onKey}>
              {STYLES.map((s, i) => (
                <button
                  key={s}
                  ref={(el) => {
                    tabs.current[i] = el
                  }}
                  type="button"
                  role="tab"
                  id={`${id}-tab-${s}`}
                  aria-selected={style === s}
                  aria-controls={`${id}-panel`}
                  tabIndex={style === s ? 0 : -1}
                  className="btn"
                  onClick={() => {
                    setStyle(s)
                    setCopied(false)
                  }}
                >
                  <span className={style === s ? 'font-semibold' : ''}>{t(s)}</span>
                </button>
              ))}
            </div>
            <div
              role="tabpanel"
              id={`${id}-panel`}
              aria-labelledby={`${id}-tab-${style}`}
              className="rounded-xs bg-paper-2 p-3 text-14 break-words"
            >
              {citations[style]}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="btn"
                onClick={() => {
                  // navigator.clipboard exists only in secure contexts; the text stays selectable.
                  navigator.clipboard
                    ?.writeText(citations[style])
                    .then(() => setCopied(true))
                    .catch(() => {})
                }}
              >
                {t('copy')}
              </button>
              <span aria-live="polite" className="text-14 text-ink-2">
                {copied ? t('copied') : ''}
              </span>
            </div>
          </>
        ) : (
          <dl className="flex flex-col gap-2 text-14">
            {STYLES.map((s) => (
              <div key={s}>
                <dt className="font-semibold">{t(s)}</dt>
                <dd className="rounded-xs bg-paper-2 p-2 break-words">{citations[s]}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </details>
  )
}
