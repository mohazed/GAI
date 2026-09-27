/**
 * Validation rules: tone lint (docs/02 §12.6, docs/05 §7, CLAUDE.md "Site voice").
 *
 * The checks themselves live in `../tone.ts`, shared with the summary generator; this module maps
 * their violations onto rule ids and record locations.
 */
import { type Issue, issue, type RuleId } from '../../issues.js'
import type { Methodology } from '../../load/methodology.js'
import type { Rule, ValidationContext } from '../context.js'
import {
  type BannedWordMatcher,
  bannedWordMessage,
  compileBannedWords,
  findBannedWords,
  lintSummary,
  type SummaryLang,
  type ToneViolation,
} from '../tone.js'

const LANGS: readonly SummaryLang[] = ['en', 'fr']
const LANG_LABEL: Record<SummaryLang, string> = { en: 'EN', fr: 'FR' }

const RULE_BY_KIND: Record<ToneViolation['kind'], RuleId> = {
  'banned-word': 'tone.banned-word',
  exclamation: 'tone.exclamation',
  length: 'tone.length',
  'actor-first': 'tone.actor-first',
}

/** One compiled matcher per loaded banned-words list, shared by every rule in a run. */
const matchers = new WeakMap<NonNullable<Methodology['bannedWords']>, BannedWordMatcher>()

/** The compiled banned-words list of the methodology, or null when the file failed to load. */
function bannedMatcher(ctx: ValidationContext): BannedWordMatcher | null {
  const list = ctx.methodology.bannedWords
  if (list === null) return null
  let matcher = matchers.get(list)
  if (!matcher) {
    matcher = compileBannedWords(list.entries)
    matchers.set(list, matcher)
  }
  return matcher
}

/**
 * tone.banned-word, tone.exclamation, tone.length, tone.actor-first (docs/02 §12.6, docs/05 §7):
 * every event summary, EN and FR, contains no banned word and no exclamation mark, is at most
 * 200 characters and starts with the actor (country name, actor label or actor name). Every
 * event is linted, whatever its status: retracted summaries stay on the site. One issue per
 * violation; the banned-word check is skipped when banned-words.txt failed to load.
 */
function summaryTone(ctx: ValidationContext): Issue[] {
  const matcher = bannedMatcher(ctx)
  const out: Issue[] = []
  for (const located of ctx.dataset.events) {
    const event = located.value
    const country = ctx.index.countryByIso3.get(event.country)?.value
    for (const lang of LANGS) {
      const violations = lintSummary(event.summary[lang], lang, {
        matcher,
        countryName: country?.name[lang],
        actor: { label: event.actor?.[lang], name: event.actor?.name },
      })
      const at = { file: located.file, id: event.id, line: located.line, path: `summary.${lang}` }
      for (const v of violations) {
        out.push(issue(RULE_BY_KIND[v.kind], at, `${LANG_LABEL[lang]} summary ${v.message}.`))
      }
    }
  }
  return out
}

/**
 * tone.site-voice (warning; CLAUDE.md "Site voice", docs/05 §7): other text written in the site's
 * voice contains no banned word: correction reasons and the project's responses to replies
 * (`response.en`, `response.fr`). A reply's own text is the sender's words and is not linted.
 */
function siteVoice(ctx: ValidationContext): Issue[] {
  const matcher = bannedMatcher(ctx)
  if (matcher === null) return []
  const out: Issue[] = []
  const lint = (text: string, subject: string, at: Parameters<typeof issue>[1]) => {
    for (const m of findBannedWords(text, matcher)) {
      out.push(issue('tone.site-voice', at, `${subject} ${bannedWordMessage(m)}.`))
    }
  }
  for (const { value: c, file, line } of ctx.dataset.corrections) {
    lint(c.reason, 'Correction reason', { file, id: c.id, line, path: 'reason' })
  }
  for (const { value: r, file, line } of ctx.dataset.replies) {
    for (const lang of LANGS) {
      const at = { file, id: r.id, line, path: `response.${lang}` }
      lint(r.response[lang], `${LANG_LABEL[lang]} response to the reply`, at)
    }
  }
  return out
}

export const rules: Rule[] = [summaryTone, siteVoice]
