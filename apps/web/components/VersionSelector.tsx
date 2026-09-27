'use client'

import { useTranslations } from 'next-intl'
import { useId } from 'react'

export interface VersionLink {
  version: string
  status: 'current' | 'superseded'
  href: string
}

/**
 * Methodology version picker (docs/05 §5 VersionSelector): a <select> that opens the chosen
 * version's page; without JavaScript, a list of links instead.
 */
export function VersionSelector({
  versions,
  current,
}: {
  versions: VersionLink[]
  current: string
}) {
  const t = useTranslations('version')
  const id = useId()
  const label = (v: VersionLink) => `${v.version} · ${t(v.status)}`
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-14 font-semibold">
        {t('label')}
      </label>
      <select
        id={id}
        value={current}
        onChange={(e) => {
          const v = versions.find((x) => x.version === e.currentTarget.value)
          if (v !== undefined) window.location.assign(v.href)
        }}
        className="no-js-hidden min-h-10 max-w-80 rounded-xs border border-ink bg-paper px-3 text-16"
      >
        {versions.map((v) => (
          <option key={v.version} value={v.version}>
            {label(v)}
          </option>
        ))}
      </select>
      <noscript>
        <ul className="flex flex-col gap-1 text-14">
          {versions.map((v) => (
            <li key={v.version}>
              {v.version === current ? (
                <span aria-current="page" className="font-semibold">
                  {label(v)}
                </span>
              ) : (
                <a href={v.href}>{label(v)}</a>
              )}
            </li>
          ))}
        </ul>
      </noscript>
    </div>
  )
}
