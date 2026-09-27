'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

export interface ShareThisProps {
  /** Dated permalink of the page (`permalink` of the country file). */
  permalink: string
  /** Path of the page's share card (PNG). */
  card: string
}

/**
 * "Share" (docs/05 §6 Country): an outlined button opening a panel with the dated link, a Copy
 * button and the share card. A <details>, so it opens without JavaScript; Copy appears once
 * JavaScript runs (the link stays selectable). No social network buttons (D-19, docs/05 §5). The
 * panel is placed against the nearest positioned ancestor (the country page's tools row), so that
 * it opens from the row's start and stays inside a phone screen whatever the button's position.
 */
export function ShareThis({ permalink, card }: ShareThisProps) {
  const t = useTranslations('share')
  const [ready, setReady] = useState(false)
  const [copied, setCopied] = useState(false)
  useEffect(() => setReady(true), [])
  return (
    <details className="cite">
      <summary className="btn list-none">{t('button')}</summary>
      <div className="absolute start-0 z-10 mt-2 flex w-[min(36rem,calc(100vw-2rem))] flex-col gap-3 rounded-xs border border-ink bg-paper p-4">
        <p className="text-14 font-semibold">{t('title')}</p>
        <div className="flex flex-col gap-1">
          <p className="text-12 text-ink-2">{t('link')}</p>
          <p className="rounded-xs bg-paper-2 p-2 font-mono text-m12 break-all">{permalink}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {ready ? (
            <button
              type="button"
              className="btn"
              onClick={() => {
                // navigator.clipboard exists only in secure contexts; the link stays selectable.
                navigator.clipboard
                  ?.writeText(permalink)
                  .then(() => setCopied(true))
                  .catch(() => {})
              }}
            >
              {t('copy')}
            </button>
          ) : null}
          <span aria-live="polite" className="text-14 text-ink-2">
            {copied ? t('copied') : ''}
          </span>
          <a href={card} className="text-14">
            {t('card')}
          </a>
        </div>
      </div>
    </details>
  )
}
