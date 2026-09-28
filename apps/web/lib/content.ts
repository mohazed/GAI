/**
 * The site's own prose (apps/web/content/{name}.{lang}.md): the About, Data, Embed and Reply
 * pages and the implementation notes of the methodology and data pages, read at build and parsed
 * by lib/doc.ts. Server only. The methodology itself is not here: it is read from the API
 * (`methodology/{version}.json` `docs`), as the build published it.
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { type DocBlock, parseDoc } from './doc'
import { frenchPunctuation } from './format'
import type { Lang } from './i18n'

export const CONTENT_DIR = path.join(process.cwd(), 'content')

export const CONTENT_NAMES = ['about', 'computed', 'data', 'embed', 'readings', 'reply'] as const
export type ContentName = (typeof CONTENT_NAMES)[number]

/**
 * The text of a content file. French files are written with ordinary spaces; French spacing
 * (no-break space before `:`, narrow no-break space before `; ? !`, inside « ») is applied here,
 * as for the messages (lib/format.ts `frenchPunctuation`).
 */
export function contentText(name: ContentName, lang: Lang): string {
  const text = readFileSync(path.join(CONTENT_DIR, `${name}.${lang}.md`), 'utf8')
  return lang === 'fr' ? frenchPunctuation(text) : text
}

export function content(name: ContentName, lang: Lang): DocBlock[] {
  try {
    return parseDoc(contentText(name, lang))
  } catch (e) {
    throw new Error(`content/${name}.${lang}.md: ${(e as Error).message}`)
  }
}

/** The document's `#` title, for the page metadata. */
export function contentTitle(blocks: readonly DocBlock[]): string {
  const h = blocks.find((b) => b.kind === 'heading' && b.level === 1)
  if (h === undefined || h.kind !== 'heading') throw new Error('document without a # title')
  return h.text
}
