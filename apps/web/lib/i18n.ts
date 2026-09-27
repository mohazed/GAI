/**
 * Locales and messages (D-17). Server components take `lang` explicitly and translate with
 * `getT(lang)`, so one page (the kit) can render both languages; client components use
 * next-intl's `useTranslations` under the nearest NextIntlClientProvider.
 */
import { createTranslator } from 'next-intl'
import en from '../messages/en.json'
import fr from '../messages/fr.json'
import { frenchMessages } from './format'

export const LOCALES = ['en', 'fr'] as const
export type Lang = (typeof LOCALES)[number]

export type Messages = typeof en
/** French messages get French spacing (no-break spaces before `: ; ? ! %`, inside « »). */
export const MESSAGES: Record<Lang, Messages> = { en, fr: frenchMessages(fr) }

export function isLang(value: unknown): value is Lang {
  return value === 'en' || value === 'fr'
}

export function getT(lang: Lang) {
  return createTranslator({ locale: lang, messages: MESSAGES[lang] })
}
export type T = ReturnType<typeof getT>

/** The message namespaces client components read; only these are sent to the browser. */
export const CLIENT_NAMESPACES = [
  'common',
  'chart',
  'rank',
  'weights',
  'search',
  'cite',
  'changes',
  'version',
  'hash',
] as const

export function clientMessages(lang: Lang): Pick<Messages, (typeof CLIENT_NAMESPACES)[number]> {
  const m = MESSAGES[lang]
  return Object.fromEntries(CLIENT_NAMESPACES.map((k) => [k, m[k]])) as Pick<
    Messages,
    (typeof CLIENT_NAMESPACES)[number]
  >
}

/** Same path in the other language: `/en/ranking/` ↔ `/fr/ranking/`. */
export function switchLocalePath(path: string, to: Lang): string {
  const rest = path.replace(/^\/(en|fr)(?=\/|$)/, '')
  return `/${to}${rest === '' ? '/' : rest}`
}
