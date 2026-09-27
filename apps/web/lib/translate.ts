/**
 * A translator that both server components (`getT`, lib/i18n.ts) and client components
 * (`useTranslations`) can hand to a shared view, so that a view renders in either without
 * importing the message files. Keys are full paths (`gauge.label`).
 */
export type Translate = (key: string, values?: Record<string, string | number>) => string
