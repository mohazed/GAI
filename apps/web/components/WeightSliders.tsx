'use client'

import type { CategoryWeights } from '@gai/scoring'
import { useLocale, useTranslations } from 'next-intl'
import { useId } from 'react'
import type { CategorySpec } from '../lib/methodology'

export type WeightKey = 'A' | 'B' | 'C' | 'D'
export const WEIGHT_KEYS: readonly WeightKey[] = ['A', 'B', 'C', 'D']

export interface WeightSlidersProps {
  categories: CategorySpec[]
  weights: CategoryWeights
  onChange: (key: WeightKey, value: number) => void
  onReset: () => void
  /** Copies the current URL (with `?w=`); resolves true once copied. */
  onCopyLink: () => Promise<boolean>
  copied: boolean
}

function formatWeight(v: number, lang: string): string {
  const s = v.toFixed(1)
  return lang === 'fr' ? s.replace('.', ',') : s
}

/**
 * "Your weights" (docs/05 §5 WeightSliders): one range input per scored category, 0 to 2 in steps
 * of 0.1, default 1 marked. Changing a weight re-ranks the table; events do not change.
 */
export function WeightSliders({
  categories,
  weights,
  onChange,
  onReset,
  onCopyLink,
  copied,
}: WeightSlidersProps) {
  const t = useTranslations('weights')
  const lang = useLocale()
  const id = useId()
  return (
    <section
      aria-labelledby={`${id}-title`}
      className="flex flex-col gap-4 border-y border-rule py-4"
    >
      <h2 id={`${id}-title`} className="sr-only">
        {t('title')}
      </h2>
      <p className="text-14 text-ink-2">{t('explain')}</p>
      <datalist id={`${id}-ticks`}>
        <option value="1" />
      </datalist>
      <ul className="grid gap-x-8 gap-y-3 md:grid-cols-2">
        {WEIGHT_KEYS.map((k) => {
          const c = categories.find((x) => x.id === k)
          const label = c === undefined ? k : `${k} ${c.short[lang === 'fr' ? 'fr' : 'en']}`
          return (
            <li key={k} className="grid grid-cols-[8rem_1fr_3rem] items-center gap-3">
              <label htmlFor={`${id}-${k}`} className="text-14">
                {label}
              </label>
              <span className="weight-slot flex h-6 items-center ltr">
                <input
                  id={`${id}-${k}`}
                  type="range"
                  min={0}
                  max={2}
                  step={0.1}
                  list={`${id}-ticks`}
                  value={weights[k]}
                  aria-valuetext={formatWeight(weights[k], lang)}
                  onChange={(e) => onChange(k, Number(e.currentTarget.value))}
                  className="weight-range h-6 w-full"
                />
              </span>
              <output htmlFor={`${id}-${k}`} className="text-end font-mono text-m13">
                {formatWeight(weights[k], lang)}
              </output>
            </li>
          )
        })}
      </ul>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="btn" onClick={onReset}>
          {t('reset')}
        </button>
        <button type="button" className="btn" onClick={() => void onCopyLink()}>
          {t('copy')}
        </button>
        <span aria-live="polite" className="text-14 text-ink-2">
          {copied ? t('copied') : ''}
        </span>
      </div>
    </section>
  )
}
