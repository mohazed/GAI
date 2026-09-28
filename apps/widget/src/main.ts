/**
 * /embed/v1/gai.js (docs/04 §4): for its own `<script>` element (and any other one of this script
 * not yet handled), creates a `<div>` right after it, isolates it with a shadow root, shows the
 * link to the country page, reads `countries/{ISO3}.json` from the site (one request, no cookie)
 * and replaces the link with the gauge or the timeline. If the file cannot be read, the link
 * stays. No dependency, no global, no font or other file loaded.
 */
import { CONFIG_PLACEHOLDER, readConfig } from './config.js'
import { dataUrl, linkHtml, readOptions, renderWidget } from './render.js'
import { CSS } from './styles.js'

const config = readConfig(CONFIG_PLACEHOLDER)
const DONE = 'data-gai-embed'

function mount(script: HTMLScriptElement): void {
  script.setAttribute(DONE, '')
  const o = readOptions({ ...script.dataset }, script.src, location.href)
  const host = document.createElement('div')
  script.after(host)
  const root = host.attachShadow({ mode: 'open' })
  // A constructed stylesheet is not an inline style for the page's Content-Security-Policy; a
  // <style> element is the fallback for browsers without one.
  try {
    const sheet = new CSSStyleSheet()
    sheet.replaceSync(CSS)
    root.adoptedStyleSheets = [sheet]
  } catch {
    const style = document.createElement('style')
    style.textContent = CSS
    root.append(style)
  }
  const box = document.createElement('div')
  box.className = 'w'
  box.innerHTML = linkHtml(o)
  root.append(box)
  if (o.iso3 === null || config === null) return
  fetch(dataUrl(o), { credentials: 'omit' })
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((f) => {
      box.outerHTML = renderWidget(f, o, config)
    })
    .catch(() => {
      // The link to the country page stays: the embed degrades to it.
    })
}

const current = document.currentScript
if (current instanceof HTMLScriptElement && !current.hasAttribute(DONE)) mount(current)
for (const s of document.querySelectorAll<HTMLScriptElement>(
  `script[src*="/embed/v1/gai.js"]:not([${DONE}])`,
))
  mount(s)
