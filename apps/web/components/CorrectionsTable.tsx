import type { ApiCorrection } from '@gai/schema/api'
import { getT, type Lang } from '../lib/i18n'
import type { LangText } from '../lib/methodology'

/** A value of a corrected field as text: dates, numbers and ids as written, lists joined. */
export function fieldValue(v: unknown): string {
  if (v === null || v === undefined) return '—'
  if (Array.isArray(v)) return v.length === 0 ? '—' : v.map(fieldValue).join(', ')
  if (typeof v === 'object') return JSON.stringify(v)
  return String(v)
}

/**
 * The issue a correction was flagged in, as a link: `#12` or an issue URL of the repository.
 * Any other reference is shown as text.
 */
export function flaggedHref(ref: string | null, repoUrl: string): string | null {
  if (ref === null) return null
  const n = /^#(\d+)$/.exec(ref.trim())
  if (n !== null) return `${repoUrl}/issues/${n[1]}`
  return ref.startsWith(`${repoUrl}/issues/`) || ref.startsWith(`${repoUrl}/pull/`) ? ref : null
}

/**
 * The corrections log (docs/05 §6 Corrections, docs/08 §5): a table, newest first, one row per
 * correction or retraction with its date and id (the anchor event cards link to), the event on
 * its country page, the kind, what changed (each field, before → after), the reason, who flagged
 * it with a link to the issue, and the commit that added it. Empty: one sentence.
 */
export function CorrectionsTable({
  lang,
  corrections,
  names,
  repoUrl,
  anchors = true,
}: {
  lang: Lang
  corrections: readonly ApiCorrection[]
  names: Record<string, LangText>
  repoUrl: string
  /** Rows carry the correction id as their id (false where the table is shown twice: the kit). */
  anchors?: boolean
}) {
  const t = getT(lang)
  if (corrections.length === 0) return <p className="text-16">{t('correctionsPage.empty')}</p>
  const rows = [...corrections].sort((a, b) =>
    a.date === b.date ? (a.id < b.id ? 1 : -1) : a.date < b.date ? 1 : -1,
  )
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-14">
        <caption className="mb-2 text-start text-14 text-ink-2">
          {t('correctionsPage.caption', { count: rows.length })}
        </caption>
        <thead>
          <tr className="border-b border-ink">
            <th scope="col" className="py-2 pe-4 text-start font-semibold">
              {t('correctionsPage.cols.date')}
            </th>
            <th scope="col" className="py-2 pe-4 text-start font-semibold">
              {t('correctionsPage.cols.event')}
            </th>
            <th scope="col" className="py-2 pe-4 text-start font-semibold">
              {t('correctionsPage.cols.changed')}
            </th>
            <th scope="col" className="py-2 pe-4 text-start font-semibold">
              {t('correctionsPage.cols.reason')}
            </th>
            <th scope="col" className="py-2 text-start font-semibold">
              {t('correctionsPage.cols.flagged')}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => {
            const fields = [...new Set([...Object.keys(c.before), ...Object.keys(c.after)])].sort()
            const flagged = flaggedHref(c.flagged_ref, repoUrl)
            return (
              <tr
                key={c.id}
                id={anchors ? c.id : undefined}
                className="scroll-mt-8 border-b border-rule align-top"
              >
                <th scope="row" className="py-2 pe-4 text-start font-normal">
                  <span className="block font-mono text-m13">{c.date}</span>
                  <span className="block font-mono text-m11 text-ink-2">{c.id}</span>
                  <span className="block text-12 text-ink-2">
                    {t(`correctionsPage.kind.${c.kind}`)}
                  </span>
                </th>
                <td className="py-2 pe-4">
                  {c.country === null ? (
                    <span className="font-mono text-m12 break-all">{c.event}</span>
                  ) : (
                    <>
                      <span className="block">{names[c.country]?.[lang] ?? c.country}</span>
                      <a
                        href={`/${lang}/country/${c.country}/#${c.event}`}
                        className="font-mono text-m12 break-all"
                      >
                        {c.event}
                      </a>
                    </>
                  )}
                </td>
                <td className="py-2 pe-4">
                  <ul className="flex flex-col gap-1">
                    {fields.map((f) => (
                      <li key={f}>
                        <span className="font-mono text-m12">{f}</span>
                        {': '}
                        <span className="break-all">{fieldValue(c.before[f])}</span>
                        {' → '}
                        <span className="break-all">{fieldValue(c.after[f])}</span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="max-w-prose py-2 pe-4" lang="en">
                  {c.reason}
                </td>
                <td className="py-2">
                  <span className="block">{t(`correctionsPage.flaggedBy.${c.flagged_by}`)}</span>
                  {c.flagged_ref === null ? null : flagged === null ? (
                    <span className="block text-12 text-ink-2">{c.flagged_ref}</span>
                  ) : (
                    <a href={flagged} className="block text-12">
                      {c.flagged_ref.startsWith('#')
                        ? t('correctionsPage.issue', { ref: c.flagged_ref })
                        : c.flagged_ref}
                    </a>
                  )}
                  {c.commit === null ? null : (
                    <a href={`${repoUrl}/commit/${c.commit}`} className="block font-mono text-m11">
                      {c.commit.slice(0, 7)}
                    </a>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
