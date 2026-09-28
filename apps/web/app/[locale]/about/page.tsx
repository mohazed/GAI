import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { Contact } from '../../../components/Contact'
import { DocMarkdown } from '../../../components/DocMarkdown'
import { publicApi } from '../../../lib/api'
import { content, contentTitle } from '../../../lib/content'
import { frenchPunctuation, longDate } from '../../../lib/format'
import { getT, isLang, type Lang } from '../../../lib/i18n'
import { alternatesFor } from '../../../lib/seo'
import { STANDPOINT } from '../../../lib/standpoint'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLang(locale)) return {}
  const t = getT(locale)
  return {
    title: contentTitle(content('about', locale)),
    description: t('aboutPage.description'),
    alternates: alternatesFor(locale, 'about/'),
  }
}

/** The standpoint, verbatim in English, signed; in French with its translation beneath. */
function Standpoint({ lang }: { lang: Lang }) {
  const t = getT(lang)
  return (
    <figure className="flex max-w-prose flex-col gap-4">
      <blockquote lang={STANDPOINT.lang} className="border-s-2 border-ink-3 ps-4 text-18">
        <p>{STANDPOINT.original}</p>
      </blockquote>
      {lang === 'fr' ? (
        <div className="border-s-2 border-rule ps-4 text-16 text-ink-2">
          <p className="text-12">{t('aboutPage.translation')}</p>
          <p>{frenchPunctuation(STANDPOINT.translation.fr)}</p>
        </div>
      ) : null}
      <figcaption className="text-16">
        {t('aboutPage.signed', { author: STANDPOINT.author })}
      </figcaption>
    </figure>
  )
}

/** Reviewers from methodology/index.json (methodology/reviewers.yaml), or "none yet". */
function Reviewers({ lang }: { lang: Lang }) {
  const t = getT(lang)
  const reviewers = publicApi.methodologyIndex().reviewers
  if (reviewers.length === 0)
    return <p className="max-w-prose text-18">{t('aboutPage.reviewersNone')}</p>
  return (
    <ul className="flex max-w-prose flex-col gap-4 text-18">
      {reviewers.map((r) => (
        <li key={r.name} className="flex flex-col gap-1">
          <span className="font-semibold">{r.name}</span>
          <span className="text-16">
            {r.expertise[lang]}. {r.disclosure[lang]}
          </span>
          {r.signed_off.map((s) => (
            <a key={`${s.version}-${s.date}`} href={s.url} className="text-14">
              {t('aboutPage.signedOff', { version: s.version, date: longDate(s.date, lang) })}
            </a>
          ))}
          {r.caveat === null ? null : (
            <span className="text-16 text-ink-2">
              {t('aboutPage.caveat')} {r.caveat[lang]}
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}

/**
 * About (docs/05 §6): the standpoint of the specification, verbatim and signed (D-01), who
 * maintains the index, the reviewers (methodology/reviewers.yaml; "none yet" until there are),
 * independence and funding, the countries not scored, contact, licences, the hand-over note.
 * The prose is content/about.{lang}.md.
 */
export default async function About({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: lang } = await params
  if (!isLang(lang)) return null
  setRequestLocale(lang)
  return (
    <article className="flex flex-col gap-6 py-12 md:py-16">
      <DocMarkdown
        blocks={content('about', lang)}
        slots={{
          standpoint: <Standpoint lang={lang} />,
          reviewers: <Reviewers lang={lang} />,
          contact: <Contact lang={lang} />,
        }}
      />
    </article>
  )
}
