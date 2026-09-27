import { defineRouting } from 'next-intl/routing'
import { LOCALES } from '../lib/i18n'

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: 'en',
  localePrefix: 'always',
})
