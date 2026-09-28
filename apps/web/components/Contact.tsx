import { getT, type Lang } from '../lib/i18n'
import { CONTACT_EMAIL, ISSUE_FORMS } from '../lib/site'

/** Contact: the project address when there is one (lib/site.ts), else the public forms. */
export function Contact({ lang }: { lang: Lang }) {
  const t = getT(lang)
  return (
    <div className="flex max-w-prose flex-col gap-2 text-18">
      {CONTACT_EMAIL === null ? (
        <p>{t('contact.none')}</p>
      ) : (
        <p>
          {t('contact.email')} <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.{' '}
          {t('contact.emailNote')}
        </p>
      )}
      <ul className="flex list-disc flex-col gap-1 ps-6">
        <li>
          <a href={ISSUE_FORMS.reply}>{t('contact.reply')}</a>
        </li>
        <li>
          <a href={ISSUE_FORMS.error}>{t('contact.error')}</a>
        </li>
        <li>
          <a href={ISSUE_FORMS.lead}>{t('contact.lead')}</a>
        </li>
      </ul>
    </div>
  )
}
