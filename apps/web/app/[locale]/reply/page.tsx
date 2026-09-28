import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { DocMarkdown } from '../../../components/DocMarkdown'
import { publicApi } from '../../../lib/api'
import { content, contentTitle } from '../../../lib/content'
import { getT, isLang } from '../../../lib/i18n'
import { alternatesFor } from '../../../lib/seo'
import { CONTACT_EMAIL, ISSUE_FORMS } from '../../../lib/site'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLang(locale)) return {}
  const t = getT(locale)
  return {
    title: contentTitle(content('reply', locale)),
    description: t('replyPage.description'),
    alternates: alternatesFor(locale, 'reply/'),
  }
}

/**
 * Right of reply (docs/05 §6 Reply, docs/08 §4): who can reply and how (the public issue form;
 * the project email address once there is one, lib/site.ts), the 10-day rule, what happens to
 * the events contested, the forms for errors and leads, and the replies published so far. The
 * prose is content/reply.{lang}.md.
 */
export default async function Reply({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: lang } = await params
  if (!isLang(lang)) return null
  setRequestLocale(lang)
  const t = getT(lang)
  const replies = publicApi.replies().replies
  const names = Object.fromEntries(publicApi.countries().countries.map((c) => [c.iso3, c.name]))
  return (
    <article className="flex flex-col gap-6 py-12 md:py-16">
      <DocMarkdown
        blocks={content('reply', lang)}
        slots={{
          channels: (
            <ul className="flex max-w-prose list-disc flex-col gap-2 ps-6 text-18">
              <li>
                <a href={ISSUE_FORMS.reply}>{t('replyPage.form')}</a> {t('replyPage.formNote')}
              </li>
              <li>
                {CONTACT_EMAIL === null ? (
                  t('replyPage.noEmail')
                ) : (
                  <>
                    {t('replyPage.email')} <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.{' '}
                    {t('replyPage.emailNote')}
                  </>
                )}
              </li>
            </ul>
          ),
          published:
            replies.length === 0 ? (
              <p className="max-w-prose text-18">{t('replyPage.none')}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-14">
                  <caption className="mb-2 text-start text-14 text-ink-2">
                    {t('replyPage.caption', { count: replies.length })}
                  </caption>
                  <thead>
                    <tr className="border-b border-ink">
                      <th scope="col" className="py-2 pe-4 text-start font-semibold">
                        {t('replyPage.cols.published')}
                      </th>
                      <th scope="col" className="py-2 pe-4 text-start font-semibold">
                        {t('replyPage.cols.country')}
                      </th>
                      <th scope="col" className="py-2 pe-4 text-start font-semibold">
                        {t('replyPage.cols.from')}
                      </th>
                      <th scope="col" className="py-2 text-start font-semibold">
                        {t('replyPage.cols.outcome')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...replies].reverse().map((r) => (
                      <tr key={r.id} className="border-b border-rule align-top">
                        <th
                          scope="row"
                          className="py-2 pe-4 text-start font-mono text-m13 font-normal"
                        >
                          {r.published_at}
                        </th>
                        <td className="py-2 pe-4">
                          <a href={`/${lang}/country/${r.country}/#${r.id}`}>
                            {names[r.country]?.[lang] ?? r.country}
                          </a>
                        </td>
                        <td className="py-2 pe-4">
                          {r.from.org}, {r.from.role}
                        </td>
                        <td className="py-2">{t(`reply.outcome.${r.outcome}`)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ),
        }}
      />
    </article>
  )
}
