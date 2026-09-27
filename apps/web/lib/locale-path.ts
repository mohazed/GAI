/**
 * Locale paths for client components. Kept apart from lib/i18n.ts, which imports both message
 * files: a client component importing from there would ship every message of both languages.
 */

/** Same path in the other language: `/en/ranking/` ↔ `/fr/ranking/`. */
export function switchLocalePath(path: string, to: 'en' | 'fr'): string {
  const rest = path.replace(/^\/(en|fr)(?=\/|$)/, '')
  return `/${to}${rest === '' ? '/' : rest}`
}
