/** Constants shared by the layouts. */
export const REPO_URL = 'https://github.com/mohazed/GAI'

/**
 * The project's public contact address (docs/08 §4 right of reply, §8: a project address, never a
 * personal one). `null` until the author creates one: the About and Reply pages then send readers
 * to the GitHub issue forms and say that an address will be added. This is the one place to set
 * it (docs/10 B-143).
 */
export const CONTACT_EMAIL: string | null = null

/** The public issue forms of the repository (.github/ISSUE_TEMPLATE, D-18). */
export const ISSUE_FORMS = {
  reply: `${REPO_URL}/issues/new?template=right-of-reply.yml`,
  error: `${REPO_URL}/issues/new?template=report-an-error.yml`,
  lead: `${REPO_URL}/issues/new?template=submit-a-lead.yml`,
} as const

/** A file of the repository at a commit (or `main` when the build has none). */
export function repoFileUrl(file: string, sha: string | null): string {
  return `${REPO_URL}/blob/${sha ?? 'main'}/${file}`
}

/**
 * The language redirect of `/` (docs/04 §3): the first of the browser's preferred languages that
 * the site has, else English. Hashed into the page's CSP by scripts/postbuild.ts; a
 * <meta http-equiv="refresh"> inside <noscript> covers browsers without JavaScript.
 */
export const REDIRECT_SCRIPT =
  "(function(){var l=navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||''];for(var i=0;i<l.length;i++){var c=String(l[i]).toLowerCase().slice(0,2);if(c==='en'||c==='fr'){location.replace('/'+c+'/');return}}location.replace('/en/')})()"
