'use client'

import {
  type CategoryWeights,
  DEFAULT_WEIGHTS,
  formatWeights,
  isDefaultWeights,
  parseWeights,
} from '@gai/scoring'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import type { SiteMethodology } from '../lib/methodology'
import type { Mode } from '../lib/mode'
import type { RankRow } from '../lib/rank'
import { RankTable } from './RankTable'
import { WeightSliders } from './WeightSliders'

export interface RankingPanelProps {
  rows: RankRow[]
  mode: Mode
  methodology: SiteMethodology
  /** Anchor id of the table. */
  id?: string
}

/** Reads `?w=A,B,C,D` from the address bar; the defaults when absent or invalid. */
function weightsFromUrl(): CategoryWeights {
  return parseWeights(new URLSearchParams(window.location.search).get('w')) ?? DEFAULT_WEIGHTS
}

/**
 * The current address with `?w=` set to the weights, written with plain commas as documented
 * (docs/02 §9: `?w=1.0,1.5,0.0,2.0`; URLSearchParams would encode them as %2C), other query
 * parameters kept, `w` left out at the default weights.
 */
export function urlWithWeights(
  loc: Pick<Location, 'pathname' | 'search' | 'hash'>,
  weights: CategoryWeights,
): string {
  const params = new URLSearchParams(loc.search)
  params.delete('w')
  const parts = [params.toString(), isDefaultWeights(weights) ? '' : `w=${formatWeights(weights)}`]
  const query = parts.filter((p) => p !== '').join('&')
  return `${loc.pathname}${query === '' ? '' : `?${query}`}${loc.hash}`
}

/**
 * The weight sliders and the ranking table together (docs/05 §6 Ranking): weights live in the
 * URL as `?w=` (docs/02 §9) so a re-weighted ranking can be linked. The sliders only exist in
 * score mode; in scorecard mode (D-16) there is no score to weight.
 */
export function RankingPanel({ rows, mode, methodology, id }: RankingPanelProps) {
  const summary = useTranslations('weights')('title')
  const [weights, setWeights] = useState<CategoryWeights>(DEFAULT_WEIGHTS)
  const [copied, setCopied] = useState(false)
  const [ready, setReady] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const w = weightsFromUrl()
    setWeights(w)
    setOpen(!isDefaultWeights(w))
    setReady(true)
  }, [])

  const update = (next: CategoryWeights) => {
    setWeights(next)
    setCopied(false)
    window.history.replaceState(null, '', urlWithWeights(window.location, next))
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Collapsed by default (docs/05 §6 Ranking), open when the link carries weights. Only
          rendered once JavaScript runs: without it the sliders could not re-rank anything. */}
      {mode === 'score' && ready ? (
        <details
          className="weights"
          open={open}
          onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}
        >
          <summary className="btn list-none">{summary}</summary>
          <div className="mt-4">
            <WeightSliders
              categories={methodology.categories}
              weights={weights}
              onChange={(k, v) => update({ ...weights, [k]: v })}
              onReset={() => update(DEFAULT_WEIGHTS)}
              copied={copied}
              onCopyLink={async () => {
                try {
                  if (navigator.clipboard === undefined) return false
                  await navigator.clipboard.writeText(window.location.href)
                  setCopied(true)
                  return true
                } catch {
                  return false
                }
              }}
            />
          </div>
        </details>
      ) : null}
      <RankTable
        rows={rows}
        mode={mode}
        methodology={methodology}
        weights={weights}
        {...(id === undefined ? {} : { id })}
      />
    </div>
  )
}
