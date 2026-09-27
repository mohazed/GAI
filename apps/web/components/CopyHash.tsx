'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { shortHash } from '../lib/format'

/**
 * A source's SHA-256, truncated, with the full hash in `title`. After hydration it becomes a
 * button that copies the full hash (docs/05 §5 EventCard); without JavaScript it stays text.
 */
export function CopyHash({ sha256 }: { sha256: string }) {
  const t = useTranslations('hash')
  const [ready, setReady] = useState(false)
  const [copied, setCopied] = useState(false)
  useEffect(() => setReady(true), [])
  const text = `sha256 ${shortHash(sha256)}`
  if (!ready) {
    return (
      <code className="font-mono text-m12 text-ink-2" title={sha256}>
        {text}
      </code>
    )
  }
  return (
    <button
      type="button"
      title={sha256}
      aria-label={t('copy', { short: shortHash(sha256) })}
      className="inline-flex min-h-6 cursor-pointer items-center rounded-xs font-mono text-m12 text-ink-2 hover:text-ink"
      onClick={() => {
        // navigator.clipboard exists only in secure contexts; the full hash stays in `title`.
        navigator.clipboard
          ?.writeText(sha256)
          .then(() => {
            setCopied(true)
            window.setTimeout(() => setCopied(false), 1500)
          })
          .catch(() => {})
      }}
    >
      {text}
      <span aria-live="polite" className="ms-2 text-ink">
        {copied ? t('copied') : ''}
      </span>
    </button>
  )
}
