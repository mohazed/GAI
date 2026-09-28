/**
 * Display math of the methodology (docs/05 §6: the formula rendered from LaTeX by KaTeX at
 * build). KaTeX writes MathML only (`output: 'mathml'`), which browsers lay out natively: its
 * HTML output needs KaTeX's stylesheet, fonts and inline `style` attributes, which the site's
 * content security policy refuses (docs/10 B-85, B-102). The MathML keeps the LaTeX source as an
 * annotation, and every formula is followed by a plain-language paragraph in the document.
 * Server only: KaTeX never ships to the browser.
 */
import katex from 'katex'

export function renderMath(tex: string): string {
  const html = katex.renderToString(tex, {
    displayMode: true,
    output: 'mathml',
    throwOnError: true,
    strict: 'error',
    trust: false,
  })
  // The build refuses style attributes (scripts/postbuild.ts); KaTeX's MathML has none.
  if (/\sstyle=/.test(html)) throw new Error(`KaTeX wrote a style attribute for: ${tex}`)
  return html
}
