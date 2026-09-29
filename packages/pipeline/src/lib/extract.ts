/**
 * Plain text of an archived document (docs/06 §6), the text quotes are checked against:
 *
 * - HTML: the main content found by Readability (Mozilla's, on a linkedom DOM), turned into plain
 *   text with one line per block; when Readability finds nothing, or keeps less than 30 % of the
 *   page's text (index and case pages, where the list is the content), the whole body is used.
 *   A page whose body has no text at all but carries its content in Next.js's `__NEXT_DATA__`
 *   JSON (a client-rendered page, such as the Saudi Press Agency's): the prose strings of
 *   `props.pageProps`, in document order, one line per paragraph (docs/10 B-381).
 * - PDF: the text layer of every page (pdfjs-dist), pages separated by a form feed.
 * - JSON from a content API whose strings carry HTML markup (a client-rendered site's article
 *   API, such as the Indonesian Ministry of Foreign Affairs'): its prose strings in document
 *   order, markup turned into text, one line per paragraph (docs/10 B-407).
 * - Anything else (dataset JSON, CSV, plain text): the bytes decoded as text.
 *
 * The output is capped at 200 KB of UTF-8 with a marker line saying what was cut.
 */
import { Readability } from '@mozilla/readability'
import { parseHTML } from 'linkedom'

export type ExtractMethod =
  | 'readability'
  | 'html-body'
  | 'next-data'
  | 'json-content'
  | 'pdf'
  | 'raw'

export interface Extracted {
  text: string
  method: ExtractMethod
  title: string | null
  /** Language declared by the document (`<html lang>`), lowercase primary tag, or null. */
  lang: string | null
  /** Publication date declared by the document's metadata (YYYY-MM-DD), or null. */
  published: string | null
  /** Site name from the metadata (`og:site_name`), or null. */
  siteName: string | null
}

/** 200 KB (docs/03 §1, D-24). */
export const TEXT_LIMIT_BYTES = 200 * 1024

/** Share of the page text Readability must keep for its result to be used. */
const READABILITY_MIN_SHARE = 0.3

export function isPdf(bytes: Uint8Array, contentType: string | null): boolean {
  if (contentType?.includes('pdf')) return true
  return bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46
}

export function isHtml(bytes: Uint8Array, contentType: string | null): boolean {
  if (contentType?.includes('html')) return true
  const head = new TextDecoder().decode(bytes.subarray(0, 512)).trimStart().toLowerCase()
  return head.startsWith('<!doctype html') || head.startsWith('<html')
}

/** Decodes with the declared charset (header, then `<meta charset>`), UTF-8 otherwise. */
export function decodeText(bytes: Uint8Array, charset: string | null, html: boolean): string {
  let label = charset
  if (!label && html) {
    const head = new TextDecoder('latin1').decode(bytes.subarray(0, 4096))
    label = /<meta[^>]+charset\s*=\s*["']?([\w-]+)/i.exec(head)?.[1]?.toLowerCase() ?? null
  }
  try {
    return new TextDecoder(label ?? 'utf-8').decode(bytes)
  } catch {
    return new TextDecoder('utf-8').decode(bytes)
  }
}

// ---------------------------------------------------------------------------------------------
// DOM → text

const SKIP = new Set([
  'script',
  'style',
  'noscript',
  'template',
  'svg',
  'iframe',
  'object',
  'canvas',
  'head',
])
const BLOCK = new Set([
  'address',
  'article',
  'aside',
  'blockquote',
  'caption',
  'dd',
  'details',
  'dialog',
  'div',
  'dl',
  'dt',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'header',
  'hr',
  'li',
  'main',
  'nav',
  'ol',
  'p',
  'pre',
  'section',
  'summary',
  'table',
  'tbody',
  'thead',
  'tfoot',
  'tr',
  'ul',
])
const CELL = new Set(['td', 'th'])

interface DomNode {
  nodeType: number
  nodeName: string
  textContent: string | null
  childNodes: ArrayLike<DomNode>
}

/**
 * Text of a DOM subtree, one line per block element; runs of whitespace inside a block become one
 * space, `<br>` a line break, table cells are separated by a tab, `<pre>` keeps its layout.
 */
export function domToText(root: DomNode): string {
  const lines: string[] = []
  let current = ''
  const flush = () => {
    const line = current.replace(/[ \t ]+/g, (m) => (m.includes('\t') ? '\t' : ' ')).trim()
    if (line !== '') lines.push(line)
    current = ''
  }
  const walk = (node: DomNode, pre: boolean) => {
    if (node.nodeType === 3) {
      const t = node.textContent ?? ''
      current += pre ? t : t.replace(/\s+/g, ' ')
      return
    }
    if (node.nodeType !== 1 && node.nodeType !== 9 && node.nodeType !== 11) return
    const name = node.nodeName.toLowerCase()
    if (SKIP.has(name)) return
    if (name === 'br') {
      flush()
      return
    }
    const block = BLOCK.has(name)
    if (block) flush()
    if (name === 'pre') {
      for (const l of (node.textContent ?? '').split('\n'))
        if (l.trim() !== '') lines.push(l.trimEnd())
      return
    }
    for (let i = 0; i < node.childNodes.length; i++) {
      const child = node.childNodes[i]
      if (child) walk(child, pre)
    }
    if (CELL.has(name)) current += '\t'
    if (block) flush()
  }
  walk(root, false)
  flush()
  return lines.join('\n')
}

interface QueryDoc {
  querySelector(selector: string): { getAttribute(name: string): string | null } | null
}

function metaContent(doc: QueryDoc, selectors: string[]): string | null {
  for (const sel of selectors) {
    const v = doc.querySelector(sel)?.getAttribute('content')?.trim()
    if (v) return v
  }
  return null
}

/** YYYY-MM-DD at the start of a metadata date, when it names a real day. */
function isoDay(value: string | null | undefined): string | null {
  const m = /^(\d{4}-\d{2}-\d{2})/.exec(value?.trim() ?? '')
  if (!m?.[1]) return null
  const t = Date.parse(`${m[1]}T00:00:00Z`)
  return Number.isNaN(t) || new Date(t).toISOString().slice(0, 10) !== m[1] ? null : m[1]
}

/**
 * Prose strings of a JSON value: every string that contains a space (identifiers, paths and tokens
 * have none), in document order, markup turned into text, one line per paragraph.
 */
export function jsonProse(value: unknown): string {
  const lines: string[] = []
  const walk = (v: unknown): void => {
    if (typeof v === 'string') {
      if (!/\s/.test(v.trim())) return
      for (const para of v.split('\n')) {
        let text = para
        if (/<[a-z][^>]*>/i.test(para)) {
          const { document: frag } = parseHTML(`<!doctype html><html><body>${para}</body></html>`)
          text = domToText(frag.body as unknown as DomNode)
        }
        for (const l of text.split('\n')) if (l.trim() !== '') lines.push(l.trim())
      }
    } else if (Array.isArray(v)) for (const x of v) walk(x)
    else if (v && typeof v === 'object') for (const x of Object.values(v)) walk(x)
  }
  walk(value)
  return lines.join('\n')
}

/**
 * Prose of a client-rendered Next.js page: the prose strings (`jsonProse`) of `props.pageProps`
 * in the `__NEXT_DATA__` JSON. Empty when the page has no such data.
 */
export function nextDataText(html: string): string {
  const m = /<script[^>]*id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/.exec(html)
  if (!m?.[1]) return ''
  let data: unknown
  try {
    data = JSON.parse(m[1])
  } catch {
    return ''
  }
  return jsonProse((data as { props?: { pageProps?: unknown } } | null)?.props?.pageProps)
}

/** An HTML element tag inside a JSON string: the mark of a content API rather than a dataset. */
const JSON_MARKUP = /<(p|div|span|br|strong|em|b|i|h[1-6]|li|ul|ol|table|blockquote)\b[^>]*>/i

/**
 * Prose of a JSON document delivered by a client-rendered site's content API (such as the
 * Indonesian Ministry of Foreign Affairs' `backpanel.kemlu.go.id`, docs/10 B-407): when at least
 * one string carries HTML markup, the prose strings (`jsonProse`) of the whole document. Empty for
 * JSON without markup (datasets such as FTS, Comtrade or World Bank responses), which stay raw.
 */
export function jsonContentText(raw: string): string {
  let data: unknown
  try {
    data = JSON.parse(raw)
  } catch {
    return ''
  }
  let markup = false
  const probe = (v: unknown): void => {
    if (markup) return
    if (typeof v === 'string') markup = JSON_MARKUP.test(v)
    else if (Array.isArray(v)) for (const x of v) probe(x)
    else if (v && typeof v === 'object') for (const x of Object.values(v)) probe(x)
  }
  probe(data)
  return markup ? jsonProse(data) : ''
}

export function extractHtml(html: string): Extracted {
  const { document } = parseHTML(html)
  const title =
    document.querySelector('title')?.textContent?.replace(/\s+/g, ' ').trim() ||
    metaContent(document, ['meta[property="og:title"]'])
  const langAttr = document.documentElement?.getAttribute('lang')?.trim().toLowerCase() || null
  const lang = langAttr ? (langAttr.split(/[-_]/)[0] ?? null) : null
  const published = isoDay(
    metaContent(document, [
      'meta[property="article:published_time"]',
      'meta[name="date"]',
      'meta[name="DC.date"]',
      'meta[name="dcterms.date"]',
      'meta[itemprop="datePublished"]',
    ]),
  )
  const siteName = metaContent(document, ['meta[property="og:site_name"]'])
  const body = document.body ?? document.documentElement
  const bodyText = body ? domToText(body as unknown as DomNode) : ''
  if (bodyText.trim() === '') {
    const text = nextDataText(html)
    if (text !== '') return { text, method: 'next-data', title, lang, published, siteName }
  }

  let article: { content?: string | null | undefined } | null = null
  try {
    // Readability changes the document it reads, so it gets its own copy.
    article = new Readability(parseHTML(html).document as never).parse()
  } catch {
    article = null
  }
  if (article?.content) {
    const { document: frag } = parseHTML(
      `<!doctype html><html><body>${article.content}</body></html>`,
    )
    const text = domToText(frag.body as unknown as DomNode)
    if (text.length >= READABILITY_MIN_SHARE * bodyText.length && text.trim() !== '') {
      return { text, method: 'readability', title, lang, published, siteName }
    }
  }
  return { text: bodyText, method: 'html-body', title, lang, published, siteName }
}

// ---------------------------------------------------------------------------------------------
// PDF

export async function extractPdf(bytes: Uint8Array): Promise<Extracted> {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
  const task = pdfjs.getDocument({
    // pdfjs transfers the buffer it is given; a copy keeps the caller's bytes intact.
    data: new Uint8Array(bytes),
    disableFontFace: true,
    useSystemFonts: false,
    verbosity: 0,
  })
  const doc = await task.promise
  try {
    const pages: string[] = []
    for (let n = 1; n <= doc.numPages; n++) {
      const page = await doc.getPage(n)
      const content = await page.getTextContent()
      let text = ''
      for (const item of content.items) {
        if (!('str' in item)) continue
        text += item.str
        if (item.hasEOL) text += '\n'
      }
      pages.push(
        text
          .split('\n')
          .map((l) => l.replace(/[ \t]+/g, ' ').trim())
          .join('\n')
          .replace(/\n{3,}/g, '\n\n')
          .trim(),
      )
    }
    const meta = await doc.getMetadata().catch(() => null)
    const info = (meta?.info ?? {}) as Record<string, unknown>
    const title =
      typeof info.Title === 'string' && info.Title.trim() !== '' ? info.Title.trim() : null
    const lang =
      typeof info.Language === 'string'
        ? (info.Language.split(/[-_]/)[0]?.toLowerCase() ?? null)
        : null
    const created =
      typeof info.CreationDate === 'string'
        ? /^D:(\d{4})(\d{2})(\d{2})/.exec(info.CreationDate)
        : null
    const published = created ? isoDay(`${created[1]}-${created[2]}-${created[3]}`) : null
    return { text: pages.join('\n\f\n'), method: 'pdf', title, lang, published, siteName: null }
  } finally {
    await task.destroy()
  }
}

/** Text of a document by its type (see the module comment). */
export async function extractText(
  bytes: Uint8Array,
  contentType: string | null,
  charset: string | null = null,
): Promise<Extracted> {
  if (isPdf(bytes, contentType)) {
    try {
      return await extractPdf(bytes)
    } catch {
      // A damaged or encrypted PDF: fall through to the raw bytes.
    }
  }
  if (isHtml(bytes, contentType)) return extractHtml(decodeText(bytes, charset, true))
  const decoded = decodeText(bytes, charset, false)
  if (contentType?.includes('json') || /^\s*[[{]/.test(decoded.slice(0, 64))) {
    const text = jsonContentText(decoded)
    if (text !== '') {
      return {
        text,
        method: 'json-content',
        title: null,
        lang: null,
        published: null,
        siteName: null,
      }
    }
  }
  return {
    text: decoded,
    method: 'raw',
    title: null,
    lang: null,
    published: null,
    siteName: null,
  }
}

/**
 * `text` cut to at most `limit` bytes of UTF-8, marker included, at a character boundary. The
 * marker states how much was kept.
 */
export function truncateText(
  text: string,
  limit = TEXT_LIMIT_BYTES,
): { text: string; truncated: boolean } {
  const total = Buffer.byteLength(text, 'utf8')
  if (total <= limit) return { text, truncated: false }
  const marker = (kept: number) =>
    `\n\n[pnpm archive: text truncated at 200 KB; ${kept} of ${total} bytes of extracted text kept]\n`
  // The marker's length depends on the kept count; reserve room for the widest count.
  const room = limit - Buffer.byteLength(marker(total), 'utf8')
  const buf = Buffer.from(text, 'utf8')
  let end = Math.max(0, room)
  while (end > 0 && ((buf[end] ?? 0) & 0xc0) === 0x80) end--
  const head = buf.subarray(0, end).toString('utf8')
  return { text: head + marker(end), truncated: true }
}
