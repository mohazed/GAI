import { publicApi } from '../../lib/api'
import { llmsText } from '../../lib/llms'

export const dynamic = 'force-static'

/** /llms.txt (llmstxt.org): what the site is and where its documents and data are, in Markdown. */
export function GET(): Response {
  return new Response(llmsText(publicApi), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
