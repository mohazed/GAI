/**
 * Locales and messages (D-17). Server components take `lang` explicitly and translate with
 * `getT(lang)`, so one page (the kit) can render both languages; client components use
 * next-intl's `useTranslations` under the nearest NextIntlClientProvider.
 */
import compile from 'icu-minify/compile'
import { createTranslator } from 'next-intl'
import formatMessage from 'use-intl/format-message'
import en from '../messages/en.json'
import fr from '../messages/fr.json'
import { frenchMessages } from './format'
import type { Translate } from './translate'

export const LOCALES = ['en', 'fr'] as const
export type Lang = (typeof LOCALES)[number]

export type Messages = typeof en

/**
 * In the site build, next.config.ts points `use-intl/format-message` at next-intl's format-only
 * formatter, which reads messages compiled ahead of time and leaves the ICU parser
 * (intl-messageformat) out of every page's JavaScript (docs/04 §3). The messages are then
 * compiled here, on the server, once per build. Outside the bundler (Vitest, the build scripts run
 * with tsx) the formatter is next-intl's default one and the messages stay ICU strings.
 */
export const PRECOMPILED = formatMessage.raw === false

// icu-minify builds plural and select branches as null-prototype objects, which React does not pass
// to client components; the JSON round trip makes them plain (next-intl's loader does the same).
function precompile<M>(tree: M): M {
  if (typeof tree === 'string') return JSON.parse(JSON.stringify(compile(tree))) as M
  if (tree !== null && typeof tree === 'object') {
    return Object.fromEntries(Object.entries(tree).map(([k, v]) => [k, precompile(v)])) as M
  }
  return tree
}

/** French messages get French spacing (no-break spaces before `: ; ? ! %`, inside « »). */
const SOURCE: Record<Lang, Messages> = { en, fr: frenchMessages(fr) }
export const MESSAGES: Record<Lang, Messages> = PRECOMPILED
  ? { en: precompile(SOURCE.en), fr: precompile(SOURCE.fr) }
  : SOURCE

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

/**
 * The namespaces the client components of the country page read besides CLIENT_NAMESPACES: the
 * `?date=` snapshot redraws the gauge and the category rows, and the event filters and the share
 * panel have their own strings. Only the country page sends them (a nested provider).
 */
export const COUNTRY_CLIENT_NAMESPACES = [
  'gauge',
  'categories',
  'snapshot',
  'events',
  'share',
] as const

export function countryClientMessages(lang: Lang) {
  const m = MESSAGES[lang]
  return {
    ...clientMessages(lang),
    ...(Object.fromEntries(COUNTRY_CLIENT_NAMESPACES.map((k) => [k, m[k]])) as Pick<
      Messages,
      (typeof COUNTRY_CLIENT_NAMESPACES)[number]
    >),
  }
}

/**
 * The namespaces the Compare page's client panel reads besides CLIENT_NAMESPACES: its own strings
 * and the category labels of CategoryDots. Only the Compare page sends them (a nested provider).
 */
export const COMPARE_CLIENT_NAMESPACES = ['compare', 'categories'] as const

export function compareClientMessages(lang: Lang) {
  const m = MESSAGES[lang]
  return {
    ...clientMessages(lang),
    ...(Object.fromEntries(COMPARE_CLIENT_NAMESPACES.map((k) => [k, m[k]])) as Pick<
      Messages,
      (typeof COMPARE_CLIENT_NAMESPACES)[number]
    >),
  }
}

export { switchLocalePath } from './locale-path'

/** `getT(lang)` as a plain `Translate`, for views shared with client components. */
export function translator(lang: Lang): Translate {
  const t = getT(lang)
  return (key, values) => t(key as never, values as never)
}
