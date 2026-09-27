/**
 * Runs every validation rule over a loaded dataset and methodology.
 */
import { type Issue, sortIssues } from '../issues.js'
import type { Rule, ValidationContext } from './context.js'
import { rules as docsRules } from './rules/docs.js'
import { rules as eventRules } from './rules/events.js'
import { rules as historyRules } from './rules/history.js'
import { rules as methodologyRules } from './rules/methodology.js'
import { rules as recordRules } from './rules/records.js'
import { rules as sourceRules } from './rules/sources.js'
import { rules as toneRules } from './rules/tone.js'

export const ALL_RULES: Rule[] = [
  ...methodologyRules,
  ...docsRules,
  ...recordRules,
  ...eventRules,
  ...sourceRules,
  ...toneRules,
  ...historyRules,
]

/** Rules that only need the methodology (run for every version folder). */
export const METHODOLOGY_ONLY_RULES: Rule[] = [...methodologyRules, ...docsRules]

/** Loading issues plus every rule's issues, sorted. */
export function validate(ctx: ValidationContext, rules: Rule[] = ALL_RULES): Issue[] {
  const issues: Issue[] = [...ctx.dataset.issues, ...ctx.methodology.issues]
  for (const rule of rules) issues.push(...rule(ctx))
  return sortIssues(issues)
}

export type { DatasetIndex, Rule, ValidationContext } from './context.js'
export { buildContext, buildIndex } from './context.js'
