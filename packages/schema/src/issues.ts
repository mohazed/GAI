/**
 * Validation issues and the registry of every rule the validator enforces.
 *
 * Every issue names the file, the record id and the rule (CLAUDE.md, P-02). Rule ids are stable:
 * tests, CI output and the methodology page refer to them.
 */

export type Level = 'error' | 'warning'

interface RuleSpec {
  level: Level
  doc: string
  summary: string
}

export const RULES = {
  // Loading and shape ---------------------------------------------------------------------------
  'load.yaml-syntax': { level: 'error', doc: 'docs/03 §1', summary: 'File is not valid YAML.' },
  'load.csv-syntax': {
    level: 'error',
    doc: 'docs/03 §7',
    summary: 'CSV cannot be parsed or its header differs from the documented columns.',
  },
  'load.unexpected-file': {
    level: 'warning',
    doc: 'docs/03 §1',
    summary: 'File does not belong to the documented data tree.',
  },
  'load.missing-file': {
    level: 'error',
    doc: 'docs/03 §1',
    summary: 'A file the data tree or the methodology requires is missing.',
  },
  'load.misplaced-file': {
    level: 'error',
    doc: 'docs/03 §1',
    summary:
      'A file inside a record directory (data/events, sources, assessments, replies, leads, structured; archive/text) does not follow its documented name pattern, so it would not be loaded.',
  },
  'load.symlink': {
    level: 'error',
    doc: 'docs/03 §1',
    summary: 'data/ and archive/ hold regular files only; symbolic links are not followed.',
  },
  'load.encoding': {
    level: 'error',
    doc: 'docs/03 §1, §7',
    summary: 'Data, archive text and methodology files are valid UTF-8.',
  },
  'schema.country': { level: 'error', doc: 'docs/03 §3', summary: 'Country record shape.' },
  'schema.event': { level: 'error', doc: 'docs/03 §4', summary: 'Event record shape.' },
  'schema.source': { level: 'error', doc: 'docs/03 §5', summary: 'Source record shape.' },
  'schema.assessment': { level: 'error', doc: 'docs/03 §6', summary: 'Assessment record shape.' },
  'schema.correction': { level: 'error', doc: 'docs/03 §8', summary: 'Correction record shape.' },
  'schema.reply': { level: 'error', doc: 'docs/03 §9', summary: 'Reply record shape.' },
  'schema.lead': { level: 'error', doc: 'docs/03 §10', summary: 'Lead record shape.' },
  'schema.structured-row': {
    level: 'error',
    doc: 'docs/03 §7',
    summary: 'Structured table row shape.',
  },
  'schema.archive-index': {
    level: 'error',
    doc: 'docs/03 §1',
    summary: 'archive/index.csv row shape.',
  },
  'schema.methodology': {
    level: 'error',
    doc: 'docs/02, docs/03 §1',
    summary: 'Methodology file shape.',
  },

  // Identifiers and layout (docs/03 §1–§2) -------------------------------------------------------
  'id.unique': { level: 'error', doc: 'docs/03 §2', summary: 'Ids are unique per record kind.' },
  'id.date-matches': {
    level: 'error',
    doc: 'docs/03 §2',
    summary:
      'The date in an id equals the record date (event date, source document date, correction date, reply received_at, lead date); an event keeps its id when a correction changes its date.',
  },
  'id.parts-match': {
    level: 'error',
    doc: 'docs/03 §2',
    summary: 'The country and indicator in an id equal the record fields.',
  },
  'layout.file-matches-record': {
    level: 'error',
    doc: 'docs/03 §1',
    summary:
      'Each record lives in its documented file (events/{ISO3}.yaml, sources/{YYYY}/{id}.yaml, assessments/{ISO3}.yaml, replies/{ISO3}/{id}.yaml, leads/{ISO3}.yaml).',
  },
  'layout.events-sorted': {
    level: 'error',
    doc: 'docs/03 §1',
    summary: 'Events in a country file are sorted by date, then id.',
  },

  // Countries (docs/03 §3, docs/02 §1) ------------------------------------------------------------
  'country.excluded': {
    level: 'error',
    doc: 'docs/03 §3, D-10',
    summary: 'Only ISR and PSE are excluded, and an excluded entry carries excluded_reason.',
  },
  'country.membership-flags': {
    level: 'error',
    doc: 'docs/02 §1, docs/03 §3',
    summary:
      'Observers are not UN members; Security Council terms and dated memberships have from ≤ to.',
  },
  'country.universe-size': {
    level: 'warning',
    doc: 'docs/02 §1',
    summary:
      'The registry lists 193 scored entities (UN members plus the Holy See, minus ISR and PSE).',
  },

  // Events (docs/03 §4, docs/02 §2–§4, §12) ------------------------------------------------------
  'event.country-known': {
    level: 'error',
    doc: 'docs/03 §4, D-10',
    summary: 'The event country is in countries.yaml and is not excluded.',
  },
  'event.indicator-known': {
    level: 'error',
    doc: 'docs/02 §2',
    summary: 'The event indicator exists in the current methodology.',
  },
  'event.type-matches-indicator': {
    level: 'error',
    doc: 'docs/02 §3',
    summary: 'The event type equals the type indicators.yaml gives the indicator.',
  },
  'event.not-generated': {
    level: 'error',
    doc: 'D-08, docs/03 §4, docs/03 §7',
    summary:
      'Hand-authored events never use a generated indicator, the computed type, a generated id or generated: true.',
  },
  'event.points-sign': {
    level: 'error',
    doc: 'docs/03 §4',
    summary: 'The points sign matches the indicator sign.',
  },
  'event.points-range': {
    level: 'error',
    doc: 'docs/03 §4, docs/02 §2',
    summary:
      'The points equal the fixed value, one of the tier values, or lie in the indicator range.',
  },
  'event.points-rationale': {
    level: 'error',
    doc: 'docs/03 §4',
    summary: 'Scaled indicators (tiers, per-instance values) carry a points_rationale.',
  },
  'event.end': {
    level: 'error',
    doc: 'docs/03 §4, docs/02 §3',
    summary: 'end is set only on standing events, and end ≥ date.',
  },
  'event.confirmed-source-kind': {
    level: 'error',
    doc: 'docs/02 §4, docs/02 §12.2, docs/03 §4',
    summary: 'A confirmed event has a source of kind official, court or dataset.',
  },
  'event.corroborated-publishers': {
    level: 'error',
    doc: 'docs/02 §4, docs/03 §4',
    summary: 'A corroborated event has two sources from distinct publishers.',
  },
  'event.disputed-both-sides': {
    level: 'error',
    doc: 'docs/02 §4',
    summary:
      'A disputed event links both sides: a reply contesting it, or at least two evidence sources, one of kind official or official-video (the denial).',
  },
  'event.statement-requirements': {
    level: 'error',
    doc: 'docs/03 §4, docs/02 §2 (B9/B10)',
    summary:
      'Indicators that require an actor (B9, B10) carry actor.name, and at least one evidence source is of an allowed kind (official, official-video).',
  },
  'event.statement-duplicate': {
    level: 'error',
    doc: 'docs/02 §2 (B9/B10)',
    summary: 'Same speaker, same day: one event.',
  },
  'event.quote-in-archive': {
    level: 'error',
    doc: 'docs/03 §4, docs/02 §12.4',
    summary:
      'Every quote appears in archive/text/{source}.txt after whitespace normalisation (B9/B10 always; others unless the locator starts with row or video).',
  },
  'event.quote-translation': {
    level: 'error',
    doc: 'docs/03 §4, CLAUDE.md',
    summary: 'A quote not in English carries quote_en beside the original.',
  },
  'event.evidence-source-known': {
    level: 'error',
    doc: 'docs/03 §4',
    summary: 'Every evidence entry cites an existing source.',
  },
  'event.evidence-archived': {
    level: 'error',
    doc: 'CLAUDE.md, docs/02 §12.3, docs/06 §6',
    summary:
      'A published event cites only sources with wayback_url and sha256 (nothing scores without an archived copy).',
  },
  'event.video-locator': {
    level: 'error',
    doc: 'docs/03 §5',
    summary: 'Evidence from an official-video source has a `video hh:mm:ss` locator.',
  },
  'event.published-reviewed': {
    level: 'error',
    doc: 'docs/03 §4',
    summary: 'status: published requires review.reviewed_by and review.reviewed_at.',
  },
  'event.second-read': {
    level: 'error',
    doc: 'docs/03 §11, docs/06 §1.6',
    summary: 'reviewed and published events carry a second reading with verdict agree.',
  },
  'event.references': {
    level: 'error',
    doc: 'docs/03 §4',
    summary: 'supersedes and related name existing events; supersedes names the same country.',
  },
  'event.same-points': {
    level: 'error',
    doc: 'docs/02 §12.1',
    summary:
      'Same indicator, same country, overlapping window, different points is an error unless the indicator is scaled.',
  },

  // Tone lint (docs/02 §12.6, docs/05 §7) --------------------------------------------------------
  'tone.banned-word': {
    level: 'error',
    doc: 'docs/02 §12.6',
    summary: 'Summaries contain no word from banned-words.txt.',
  },
  'tone.exclamation': {
    level: 'error',
    doc: 'docs/02 §12.6',
    summary: 'Summaries contain no exclamation mark.',
  },
  'tone.length': {
    level: 'error',
    doc: 'docs/02 §12.6',
    summary: 'Summaries are at most 200 characters.',
  },
  'tone.actor-first': {
    level: 'error',
    doc: 'docs/02 §12.6, docs/05 §7',
    summary: 'Summaries start with the actor ({Actor} {past-tense verb} {object}).',
  },
  'tone.site-voice': {
    level: 'warning',
    doc: 'CLAUDE.md, docs/05 §7',
    summary:
      'Other text in the site voice (correction reasons, reply responses) contains no banned word.',
  },

  // Sources and archive (docs/03 §5, docs/02 §12.3) ----------------------------------------------
  'source.archive-required': {
    level: 'error',
    doc: 'docs/03 §5, docs/02 §12.3',
    summary:
      'Every source has wayback_url, sha256 and retrieved_at, except dataset rows pointing at data/structured with an archived origin, and captures recorded as archive_status: failed (warning).',
  },
  'source.text-file': {
    level: 'error',
    doc: 'docs/03 §1, docs/03 §5',
    summary:
      'text_file is archive/text/{id}.txt and the file exists (required for official-video transcripts).',
  },
  'source.archive-index': {
    level: 'error',
    doc: 'docs/03 §1, docs/06 §6',
    summary: 'archive/index.csv agrees with the source record (wayback_url, sha256, bytes).',
  },
  'source.dataset-origin': {
    level: 'error',
    doc: 'docs/03 §5',
    summary:
      'A dataset-row source pointing at data/structured names an origin dataset source that is archived.',
  },
  'source.orphan': {
    level: 'warning',
    doc: 'docs/03 §5',
    summary: 'A source is cited by no event, vote, structured row, lead or other source.',
  },

  // Assessments (docs/03 §6, docs/02 §8) ---------------------------------------------------------
  'assessment.country-known': {
    level: 'error',
    doc: 'docs/03 §6',
    summary: 'The assessment country is in countries.yaml and is not excluded.',
  },
  'assessment.indicator-known': {
    level: 'error',
    doc: 'docs/03 §6',
    summary: 'Assessment keys are indicator ids of the current methodology.',
  },
  'assessment.checked-evidence': {
    level: 'error',
    doc: 'docs/03 §6',
    summary: 'none-found and no-data carry checked_at and a note or queries.',
  },
  'assessment.not-applicable': {
    level: 'error',
    doc: 'docs/02 §8',
    summary:
      'not-applicable carries a note; B2 is not-applicable only for states not on the Security Council in the window.',
  },
  'assessment.has-events-mismatch': {
    level: 'warning',
    doc: 'docs/03 §6',
    summary:
      'has-events is set by the build: a hand-set has-events without events, or another status on an indicator with published events, is overwritten.',
  },
  'assessment.unchecked': {
    level: 'warning',
    doc: 'docs/02 §8',
    summary: 'Indicators missing from an assessment, or unchecked, are a build warning.',
  },

  // Corrections and history (docs/03 §8, §11) ----------------------------------------------------
  'correction.event-known': {
    level: 'error',
    doc: 'docs/03 §8',
    summary: 'A correction names an existing event.',
  },
  'correction.kind-consistent': {
    level: 'error',
    doc: 'docs/03 §8, §11',
    summary:
      'A retraction leaves the event with status retracted; each correction bumps the event revision.',
  },
  'correction.required-on-edit': {
    level: 'error',
    doc: 'docs/03 §11, docs/08 §5',
    summary:
      "An edit to a published event's points, date, confidence or evidence (or a retraction) comes with a new corrections.yaml entry and a revision bump, and the entry's before/after match the diff.",
  },
  'correction.never-delete': {
    level: 'error',
    doc: 'CLAUDE.md, docs/03 §11',
    summary:
      'Events, sources, corrections, replies and leads present on the base ref are never deleted.',
  },
  'correction.append-only': {
    level: 'warning',
    doc: 'docs/03 §8',
    summary: 'Existing corrections entries are not edited.',
  },
  'correction.status-regression': {
    level: 'error',
    doc: 'docs/03 §11',
    summary: 'A published event does not go back to draft or reviewed.',
  },
  'correction.base-unavailable': {
    level: 'warning',
    doc: 'docs/03 §11',
    summary:
      'The git base ref could not be read, so edit checks were skipped. pnpm validate reports it as an error when a comparison was required (--base, GAI_VALIDATE_BASE, GITHUB_BASE_REF, or any run on GitHub Actions).',
  },

  // Replies (docs/03 §9, docs/08 §4) -------------------------------------------------------------
  'reply.deadline': {
    level: 'error',
    doc: 'docs/03 §9, docs/08 §4',
    summary: 'received_at ≤ published_at ≤ received_at + 10 days.',
  },
  'reply.contests-known': {
    level: 'error',
    doc: 'docs/03 §9',
    summary: 'Contested events exist and belong to the reply country.',
  },
  'reply.outcome-consistent': {
    level: 'error',
    doc: 'docs/03 §9, docs/08 §4',
    summary:
      'outcome disputed → contested events are disputed; retracted → retracted; corrected → a correction entry exists.',
  },

  // Leads (docs/03 §10) --------------------------------------------------------------------------
  'lead.status': {
    level: 'error',
    doc: 'docs/03 §10',
    summary: 'promoted:evt_… names an existing event; dropped carries a reason.',
  },
  'lead.source-kind': {
    level: 'error',
    doc: 'docs/03 §10',
    summary: 'Lead sources are press or NGO sources.',
  },

  // Structured tables (docs/03 §7) ---------------------------------------------------------------
  'structured.source-dataset': {
    level: 'error',
    doc: 'docs/03 §7',
    summary: 'The source column names an existing source of kind dataset.',
  },
  'structured.iso3-known': {
    level: 'warning',
    doc: 'docs/03 §7',
    summary: 'The country code is in countries.yaml.',
  },
  'structured.window': {
    level: 'error',
    doc: 'docs/03 §7',
    summary: 'window_start ≤ window_end.',
  },

  // Methodology (docs/02) ------------------------------------------------------------------------
  'methodology.version': {
    level: 'error',
    doc: 'docs/02 §11',
    summary: 'All files of a version carry the same version, whose base is the folder name.',
  },
  'methodology.indicator-set': {
    level: 'error',
    doc: 'docs/02 §2',
    summary:
      'Indicator ids are unique, prefixed by their category, the category exists, and scored follows the category.',
  },
  'methodology.indicator-points': {
    level: 'error',
    doc: 'docs/02 §2–§3, §5',
    summary:
      'Points specs agree with the sign and type: computed ⇔ formula (with a thresholds entry), tier values distinct, generated indicators say where from.',
  },
  'methodology.indicator-caps': {
    level: 'error',
    doc: 'docs/02 §2',
    summary:
      'Indicator-level caps and stacking rules are present and coherent: per-instance indicators declare their cap, caps follow the sign, stacking groups name existing indicators.',
  },
  'methodology.thresholds': {
    level: 'error',
    doc: 'docs/02 §5',
    summary:
      'Formulas name an indicator whose points spec refers to them; tiers are ordered and their points lie in the indicator range.',
  },
  'methodology.categories': {
    level: 'error',
    doc: 'docs/02 §7',
    summary: 'Each category appears once with min ≤ 0 ≤ max.',
  },
  'methodology.bands': {
    level: 'error',
    doc: 'docs/02 §7',
    summary: 'Bands are contiguous integer ranges covering the score clip exactly.',
  },
  'methodology.confidence': {
    level: 'error',
    doc: 'docs/02 §4',
    summary: 'The four confidence levels appear once each, confirmed weighs 1.',
  },
  'methodology.decay': {
    level: 'error',
    doc: 'docs/02 §3',
    summary: 'plateau_days < end_days, and repeatable events decay.',
  },
  'methodology.passivity': {
    level: 'error',
    doc: 'docs/02 §6',
    summary: 'Qualifying indicators exist and are scored; excluded ones are not qualifying.',
  },
  'methodology.votes': {
    level: 'error',
    doc: 'docs/02 §2 (B1)',
    summary:
      'Qualifying votes are unique, dated on or after 2023-10-07, and cite an existing official source.',
  },
  'methodology.symmetry': {
    level: 'error',
    doc: 'docs/02 §12.5, §13',
    summary:
      'Every negative or mixed indicator has a positive counterpart or a reason for none; ids exist and signs agree.',
  },
  'methodology.banned-words': {
    level: 'error',
    doc: 'docs/02 §12.6',
    summary: 'banned-words.txt is non-empty and has no duplicate entries.',
  },
  'methodology.docs-generated': {
    level: 'error',
    doc: 'docs/05 §6',
    summary:
      'Generated tables in methodology.{en,fr}.md are up to date with the YAML (run pnpm methodology:render).',
  },
} as const satisfies Record<string, RuleSpec>

export type RuleId = keyof typeof RULES
export const RULE_IDS = Object.keys(RULES) as RuleId[]

export interface Issue {
  level: Level
  rule: RuleId
  /** Repo-relative POSIX path, e.g. `data/events/DEU.yaml`. */
  file: string
  /** Record id, or `-` when the issue concerns the file itself. */
  id: string
  line?: number
  /** Dotted path inside the record, e.g. `evidence.0.quote`. */
  path?: string
  message: string
}

export interface IssueLocation {
  file: string
  id?: string
  line?: number | undefined
  path?: string
}

/** Builds an issue at the rule's registered level (or `level` when given). */
export function issue(
  rule: RuleId,
  at: IssueLocation,
  message: string,
  level: Level = RULES[rule].level,
): Issue {
  const out: Issue = { level, rule, file: at.file, id: at.id ?? '-', message }
  if (at.line !== undefined) out.line = at.line
  if (at.path !== undefined && at.path !== '') out.path = at.path
  return out
}

/** `error  data/events/DEU.yaml:12  evt_2025_08_08_DEU_A6  [event.points-sign]  message` */
export function formatIssue(i: Issue): string {
  const where = i.line !== undefined ? `${i.file}:${i.line}` : i.file
  const path = i.path ? ` (${i.path})` : ''
  return `${i.level.padEnd(7)} ${where}  ${i.id}  [${i.rule}]  ${i.message}${path}`
}

/**
 * Compares strings by UTF-16 code units, like `Array.prototype.sort` without a comparator: the
 * order does not depend on the host locale (unlike `localeCompare`), so output is identical on
 * every machine.
 */
export function compareCodeUnits(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0
}

/** Stable order: file, line, id, rule, message (code-unit order, locale-independent). */
export function sortIssues(issues: Issue[]): Issue[] {
  return [...issues].sort(
    (a, b) =>
      compareCodeUnits(a.file, b.file) ||
      (a.line ?? 0) - (b.line ?? 0) ||
      compareCodeUnits(a.id, b.id) ||
      compareCodeUnits(a.rule, b.rule) ||
      compareCodeUnits(a.message, b.message),
  )
}
