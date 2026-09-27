/** Constants shared by the layouts. */
export const REPO_URL = 'https://github.com/mohazed/GAI'

/**
 * The language redirect of `/` (docs/04 §3): the first of the browser's preferred languages that
 * the site has, else English. Hashed into the page's CSP by scripts/postbuild.ts; a
 * <meta http-equiv="refresh"> inside <noscript> covers browsers without JavaScript.
 */
export const REDIRECT_SCRIPT =
  "(function(){var l=navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||''];for(var i=0;i<l.length;i++){var c=String(l[i]).toLowerCase().slice(0,2);if(c==='en'||c==='fr'){location.replace('/'+c+'/');return}}location.replace('/en/')})()"
