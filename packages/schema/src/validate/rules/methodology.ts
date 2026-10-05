/**
 * Validation rules: methodology (docs/02). Every rule reads `ctx.methodology` only (the votes rule
 * also reads the source index) and skips the checks whose file failed to load: the loader has
 * already reported that file, so nothing cascades from it.
 *
 * Issues name the methodology file (`methodology/vX.Y.Z/indicators.yaml`) and the indicator id,
 * entry key or file name concerned. The YAML loader keeps no per-entry line, so only
 * banned-words.txt issues carry a line.
 */
import { type Issue, issue } from '../../issues.js'
import type { Located } from '../../load/dataset.js'
import type {
  ConfidenceLevel,
  Indicator,
  PointsSpec,
  PointsTier,
} from '../../methodology/schemas.js'
import { CATEGORY_IDS, CONFIDENCE_LEVELS, WINDOW_START } from '../../primitives.js'
import type { Rule, ValidationContext } from '../context.js'
import { quoteSearcher } from '../normalise.js'

// ---------------------------------------------------------------------------------------------
// Helpers

/** `methodology/v1.0.0/bands.yaml` → `bands.yaml`. */
function fileName(path: string): string {
  return path.slice(path.lastIndexOf('/') + 1)
}

/** The named tiers of a points spec (`tiers`, or `per_instance` with tiers); [] otherwise. */
function tiersOf(p: PointsSpec): PointsTier[] {
  if (p.kind === 'tiers') return p.tiers
  if (p.kind === 'per_instance') return p.tiers ?? []
  return []
}

/** Every value one event may carry, except formula outputs (fixed, per-instance, tiers). */
function discreteValues(p: PointsSpec): number[] {
  switch (p.kind) {
    case 'fixed':
      return [p.value]
    case 'per_instance':
      return p.value !== undefined ? [p.value] : (p.tiers ?? []).map((t) => t.value)
    case 'tiers':
      return p.tiers.map((t) => t.value)
    case 'formula':
      return []
  }
}

/** The discrete values, plus both ends of the range for a formula. */
function boundValues(p: PointsSpec): number[] {
  return p.kind === 'formula' ? [p.range.min, p.range.max] : discreteValues(p)
}

function sameSet(a: readonly string[], b: readonly string[]): boolean {
  const sa = new Set(a)
  const sb = new Set(b)
  return sa.size === sb.size && [...sa].every((x) => sb.has(x))
}

const show = (v: number | null | undefined): string =>
  v === null || v === undefined ? 'null' : `${v}`

// ---------------------------------------------------------------------------------------------
// methodology.version

/**
 * docs/02 §11: every file of a version folder declares the version of indicators.yaml, and that
 * version without its pre-release suffix (`1.0.0-rc.1` → `1.0.0`) is the folder name.
 */
function version({ methodology: m }: ValidationContext): Issue[] {
  const out: Issue[] = []
  const declared = m.indicatorsFile?.value.version ?? m.version
  const files: (Located<{ version: string }> | null)[] = [
    m.indicatorsFile,
    m.categories,
    m.bands,
    m.confidence,
    m.decay,
    m.passivity,
    m.thresholds,
    m.votes,
    m.symmetry,
  ]
  for (const f of files) {
    if (f === null || f.value.version === declared) continue
    out.push(
      issue(
        'methodology.version',
        { file: f.file, id: fileName(f.file) },
        `version ${f.value.version} differs from ${declared}, the version declared in indicators.yaml.`,
      ),
    )
  }
  if (m.indicatorsFile) {
    const base = declared.replace(/-.*$/, '')
    if (base !== m.folderVersion) {
      out.push(
        issue(
          'methodology.version',
          { file: m.indicatorsFile.file, id: fileName(m.indicatorsFile.file) },
          `version ${declared} does not match the folder ${m.folder}; expected ${m.folderVersion} or a pre-release of it.`,
        ),
      )
    }
  }
  return out
}

// ---------------------------------------------------------------------------------------------
// methodology.indicator-set

/**
 * docs/02 §2: indicator ids are unique and start with their category letter; the category exists
 * in categories.yaml and `scored` follows it (E1–E3 unscored, D-12).
 */
function indicatorSet({ methodology: m }: ValidationContext): Issue[] {
  const f = m.indicatorsFile
  if (!f) return []
  const out: Issue[] = []
  const categories = new Map<string, { scored: boolean }>()
  for (const c of m.categories?.value.categories ?? []) {
    if (!categories.has(c.id)) categories.set(c.id, c)
  }
  const seen = new Set<string>()
  for (const ind of f.value.indicators) {
    const push = (message: string) =>
      out.push(issue('methodology.indicator-set', { file: f.file, id: ind.id }, message))
    if (seen.has(ind.id)) push(`indicator ${ind.id} is listed more than once; ids are unique.`)
    seen.add(ind.id)
    if (ind.id.charAt(0) !== ind.category) {
      push(`indicator ${ind.id} has category ${ind.category}; expected ${ind.id.charAt(0)}.`)
    }
    if (ind.short === undefined) {
      push(
        `indicator ${ind.id} has no short label; every indicator has one (B-54), for the generated text.`,
      )
    }
    if (!m.categories) continue
    const category = categories.get(ind.category)
    if (!category) {
      push(`category ${ind.category} of ${ind.id} is not in categories.yaml.`)
    } else if (category.scored !== ind.scored) {
      push(
        `${ind.id} has scored: ${ind.scored} but category ${ind.category} has scored: ${category.scored}; they must agree.`,
      )
    }
  }
  return out
}

// ---------------------------------------------------------------------------------------------
// methodology.indicator-points

/** Values of `ind` that contradict its sign (docs/02 §2, docs/03 §4 "points sign"). */
function signProblems(ind: Indicator): string[] {
  const p = ind.points
  const values = discreteValues(p)
  const range = p.kind === 'formula' ? p.range : null
  const out: string[] = []
  if (ind.sign === 'negative') {
    for (const v of values) {
      if (!(v < 0)) out.push(`${ind.id} is negative but allows ${v}; every value must be below 0.`)
    }
    if (range && range.max > 0) {
      out.push(`${ind.id} is negative but its range reaches ${range.max}; the maximum must be ≤ 0.`)
    }
  } else if (ind.sign === 'positive') {
    for (const v of values) {
      if (!(v > 0)) out.push(`${ind.id} is positive but allows ${v}; every value must be above 0.`)
    }
    if (range && range.min < 0) {
      out.push(
        `${ind.id} is positive but its range starts at ${range.min}; the minimum must be ≥ 0.`,
      )
    }
  } else {
    const all = boundValues(p)
    if (!all.some((v) => v > 0) || !all.some((v) => v < 0)) {
      out.push(
        `${ind.id} is mixed but allows only ${all.join(', ')}; expected at least one value above 0 and one below 0.`,
      )
    }
  }
  return out
}

/**
 * docs/02 §2–§3, §5: computed ⇔ formula (with its thresholds.yaml entry), computed indicators are
 * generated and generated ones say where from (D-08), values follow the sign, tier keys are
 * unique, tier values distinct unless generated (B1 abstain −2 and absent −2), and indicators
 * whose per-event points may differ are `scaled` (docs/03 §4 points_rationale).
 */
function indicatorPoints({ methodology: m }: ValidationContext): Issue[] {
  const f = m.indicatorsFile
  if (!f) return []
  const formulas = m.thresholds?.value.formulas ?? null
  const out: Issue[] = []
  for (const ind of f.value.indicators) {
    const push = (message: string) =>
      out.push(issue('methodology.indicator-points', { file: f.file, id: ind.id }, message))
    const p = ind.points

    if (ind.type === 'computed' && p.kind !== 'formula') {
      push(`${ind.id} is computed but its points kind is ${p.kind}; expected formula.`)
    }
    if (p.kind === 'formula') {
      if (ind.type !== 'computed') {
        push(
          `${ind.id} has formula points but type ${ind.type}; only computed indicators use a formula.`,
        )
      }
      if (!(p.range.min < p.range.max)) {
        push(`${ind.id} has range ${p.range.min}…${p.range.max}; expected min < max.`)
      }
      if (formulas) {
        const formula = Object.hasOwn(formulas, p.ref) ? formulas[p.ref] : undefined
        if (!formula) {
          push(`${ind.id} refers to formula ${p.ref}, which is not in thresholds.yaml.`)
        } else if (formula.indicator !== ind.id) {
          push(
            `formula ${p.ref} of thresholds.yaml names ${formula.indicator}; expected ${ind.id}.`,
          )
        }
      }
    }

    if (ind.authoring === 'generated' && (ind.generated_from ?? '').trim() === '') {
      push(
        `${ind.id} is generated but has no generated_from; name the table or file it comes from.`,
      )
    }
    if (ind.type === 'computed' && ind.authoring !== 'generated') {
      push(`${ind.id} is computed but authoring is ${ind.authoring}; expected generated (D-08).`)
    }

    for (const message of signProblems(ind)) push(message)

    const tiers = tiersOf(p)
    const keys = new Set<string>()
    const values = new Map<number, string>()
    for (const tier of tiers) {
      if (keys.has(tier.key)) {
        push(`${ind.id} lists tier ${tier.key} more than once; tier keys are unique.`)
      }
      keys.add(tier.key)
      const other = values.get(tier.value)
      if (other !== undefined && other !== tier.key && ind.authoring !== 'generated') {
        push(
          `${ind.id} tiers ${other} and ${tier.key} both carry ${tier.value}; hand-authored tiers need distinct values.`,
        )
      }
      if (other === undefined) values.set(tier.value, tier.key)
    }

    const mayDiffer = p.kind === 'tiers' || p.kind === 'formula' || tiers.length > 0
    if (mayDiffer && !ind.scaled) {
      push(
        `${ind.id} has ${p.kind} points whose value may differ per event; expected scaled: true.`,
      )
    }
  }
  return out
}

// ---------------------------------------------------------------------------------------------
// methodology.indicator-caps

/**
 * docs/02 §2 "Indicator-level caps": per-instance indicators declare their cap; a cap follows the
 * sign and is at least as large as one event; stacking rules are coherent (one_per_tier needs
 * tiers, most_severe and one_per_tier are standing states, latest_position groups agree: B5/B6);
 * superseded_by names other standing indicators (A6 ← A7).
 */
function indicatorCaps({ methodology: m }: ValidationContext): Issue[] {
  const f = m.indicatorsFile
  if (!f) return []
  const out: Issue[] = []
  for (const ind of f.value.indicators) {
    const push = (message: string) =>
      out.push(issue('methodology.indicator-caps', { file: f.file, id: ind.id }, message))
    const cap = ind.indicator_cap

    if (ind.points.kind === 'per_instance' && cap === null) {
      push(
        `${ind.id} counts per instance but indicator_cap is null; per-instance indicators declare a cap.`,
      )
    }
    if (cap) {
      if (ind.sign === 'negative') {
        if (cap.min === null || !(cap.min < 0)) {
          push(
            `${ind.id} is negative but its cap min is ${show(cap.min)}; expected a number below 0.`,
          )
        }
        if (cap.max !== null && cap.max !== 0) {
          push(`${ind.id} is negative but its cap max is ${cap.max}; expected null or 0.`)
        }
      } else if (ind.sign === 'positive') {
        if (cap.max === null || !(cap.max > 0)) {
          push(
            `${ind.id} is positive but its cap max is ${show(cap.max)}; expected a number above 0.`,
          )
        }
        if (cap.min !== null && cap.min !== 0) {
          push(`${ind.id} is positive but its cap min is ${cap.min}; expected null or 0.`)
        }
      }
      const values = boundValues(ind.points)
      const largestNegative = Math.max(0, ...values.filter((v) => v < 0).map((v) => -v))
      const largestPositive = Math.max(0, ...values.filter((v) => v > 0))
      if (cap.min !== null && cap.min < 0 && -cap.min < largestNegative) {
        push(
          `${ind.id} cap min ${cap.min} is smaller in magnitude than one event (−${largestNegative}).`,
        )
      }
      if (cap.max !== null && cap.max > 0 && cap.max < largestPositive) {
        push(`${ind.id} cap max ${cap.max} is smaller than one event (+${largestPositive}).`)
      }
    }

    const { rule, group } = ind.stacking
    if (rule === 'one_per_tier' && tiersOf(ind.points).length === 0) {
      push(`${ind.id} stacks one_per_tier but its ${ind.points.kind} points have no tiers.`)
    }
    if ((rule === 'most_severe' || rule === 'one_per_tier') && ind.type !== 'standing') {
      push(`${ind.id} stacks ${rule} but its type is ${ind.type}; expected standing.`)
    }
    if (rule === 'latest_position') {
      if (!group || group.length === 0) {
        push(
          `${ind.id} stacks latest_position without a group; name the indicators it competes with.`,
        )
      } else {
        if (!group.includes(ind.id)) {
          push(
            `${ind.id} stacks latest_position with group [${group.join(', ')}], which must include ${ind.id}.`,
          )
        }
        for (const member of group) {
          if (member === ind.id) continue
          const other = m.indicatorById.get(member)
          if (!other) {
            push(`stacking group member ${member} of ${ind.id} is not an indicator.`)
          } else if (other.stacking.rule !== 'latest_position') {
            push(
              `group member ${member} of ${ind.id} stacks ${other.stacking.rule}; expected latest_position.`,
            )
          } else if (!sameSet(other.stacking.group ?? [], group)) {
            push(
              `group member ${member} has group [${(other.stacking.group ?? []).join(', ')}]; expected [${group.join(', ')}] as for ${ind.id}.`,
            )
          }
        }
      }
    } else if (group !== undefined) {
      push(
        `${ind.id} gives a stacking group with rule ${rule}; a group is used only by latest_position.`,
      )
    }

    for (const id of ind.superseded_by) {
      const other = m.indicatorById.get(id)
      if (id === ind.id) {
        push(`${ind.id} lists itself in superseded_by; name another indicator.`)
      } else if (!other) {
        push(`superseded_by of ${ind.id} names ${id}, which is not an indicator.`)
      } else if (ind.type !== 'standing' || other.type !== 'standing') {
        push(
          `${ind.id} (${ind.type}) is superseded by ${id} (${other.type}); both must be standing.`,
        )
      }
    }
  }
  return out
}

// ---------------------------------------------------------------------------------------------
// methodology.thresholds

/**
 * docs/02 §5: each formula names a computed indicator whose points refer back to it; tiers are
 * ordered from the highest threshold down (first match wins), and every tier's points and the
 * `otherwise` value lie in the indicator's range; A1's √s scale is the range's far bound.
 *
 * Equal thresholds are allowed only as `gt v` then `gte v`: after `gte v` a `gt v` tier could
 * never match.
 */
function thresholds({ methodology: m }: ValidationContext): Issue[] {
  const t = m.thresholds
  if (!t) return []
  const out: Issue[] = []
  for (const [key, formula] of Object.entries(t.value.formulas)) {
    const push = (message: string) =>
      out.push(issue('methodology.thresholds', { file: t.file, id: key }, message))

    let range: { min: number; max: number } | null = null
    if (m.indicatorsFile) {
      const ind = m.indicatorById.get(formula.indicator)
      if (!ind) {
        push(`formula ${key} names ${formula.indicator}, which is not an indicator.`)
      } else if (ind.points.kind !== 'formula') {
        push(
          `formula ${key} names ${ind.id}, whose points kind is ${ind.points.kind}; expected formula.`,
        )
      } else if (ind.points.ref !== key) {
        push(
          `formula ${key} names ${ind.id}, whose points refer to ${ind.points.ref}; expected ${key}.`,
        )
      } else {
        range = ind.points.range
      }
    }

    if (formula.kind === 'sqrt_share') {
      if (!range) continue
      if (formula.scale < range.min || formula.scale > range.max) {
        push(
          `scale ${formula.scale} lies outside the range ${range.min}…${range.max} of ${formula.indicator}.`,
        )
      }
      const bound = Math.max(Math.abs(range.min), Math.abs(range.max))
      if (Math.abs(formula.scale) !== bound) {
        push(
          `scale ${formula.scale} does not reach the range bound ${bound} of ${formula.indicator}.`,
        )
      }
      continue
    }

    formula.tiers.forEach((tier, i) => {
      const prev = formula.tiers[i - 1]
      if (prev) {
        const ordered =
          prev.value > tier.value ||
          (prev.value === tier.value && prev.op === 'gt' && tier.op === 'gte')
        if (!ordered) {
          push(
            `tier ${i + 1} (${tier.op} ${tier.value}) follows ${prev.op} ${prev.value}; tiers go from the highest threshold down.`,
          )
        }
      }
      if (range && (tier.points < range.min || tier.points > range.max)) {
        push(
          `tier ${i + 1} gives ${tier.points}, outside the range ${range.min}…${range.max} of ${formula.indicator}.`,
        )
      }
    })
    if (range && (formula.otherwise < range.min || formula.otherwise > range.max)) {
      push(
        `otherwise gives ${formula.otherwise}, outside the range ${range.min}…${range.max} of ${formula.indicator}.`,
      )
    }
  }
  return out
}

// ---------------------------------------------------------------------------------------------
// methodology.categories

/**
 * docs/02 §7: each of the categories A–E appears exactly once with cap.min ≤ 0 ≤ cap.max; the
 * score clip straddles 0.
 */
function categories({ methodology: m }: ValidationContext): Issue[] {
  const c = m.categories
  if (!c) return []
  const out: Issue[] = []
  const clip = c.value.score_clip
  if (!(clip.min < 0 && clip.max > 0)) {
    out.push(
      issue(
        'methodology.categories',
        { file: c.file, id: 'score_clip' },
        `score_clip ${clip.min}…${clip.max} must have min < 0 < max.`,
      ),
    )
  }
  const seen = new Set<string>()
  for (const cat of c.value.categories) {
    const push = (message: string) =>
      out.push(issue('methodology.categories', { file: c.file, id: cat.id }, message))
    if (seen.has(cat.id)) push(`category ${cat.id} is listed more than once; ids are unique.`)
    seen.add(cat.id)
    if (!(cat.cap.min <= 0 && cat.cap.max >= 0)) {
      push(`category ${cat.id} has cap ${cat.cap.min}…${cat.cap.max}; expected min ≤ 0 ≤ max.`)
    }
  }
  for (const id of CATEGORY_IDS) {
    if (!seen.has(id)) {
      out.push(
        issue(
          'methodology.categories',
          { file: c.file, id },
          `category ${id} is missing; each of ${CATEGORY_IDS.join(', ')} appears once.`,
        ),
      )
    }
  }
  return out
}

// ---------------------------------------------------------------------------------------------
// methodology.bands

/**
 * docs/02 §7: bands are integer ranges that, sorted, follow each other without gap or overlap and
 * cover the score clip exactly (−100…+100).
 */
function bands({ methodology: m }: ValidationContext): Issue[] {
  const b = m.bands
  if (!b) return []
  const out: Issue[] = []
  const push = (id: string, message: string) =>
    out.push(issue('methodology.bands', { file: b.file, id }, message))
  const seen = new Set<string>()
  for (const band of b.value.bands) {
    if (seen.has(band.id)) {
      push(band.id, `band ${band.id} is listed more than once; ids are unique.`)
    }
    seen.add(band.id)
    if (band.min > band.max) push(band.id, `band ${band.id} has min ${band.min} > max ${band.max}.`)
  }
  const sorted = [...b.value.bands].sort((x, y) => x.min - y.min || x.max - y.max)
  sorted.forEach((band, i) => {
    const prev = sorted[i - 1]
    if (prev && band.min !== prev.max + 1) {
      push(
        band.id,
        `band ${band.id} starts at ${band.min} but ${prev.id} ends at ${prev.max}; expected ${prev.max + 1}.`,
      )
    }
  })
  const clip = m.categories?.value.score_clip
  const first = sorted[0]
  const last = sorted.at(-1)
  if (clip && first && first.min !== clip.min) {
    push(
      first.id,
      `the lowest band starts at ${first.min}; expected the score clip minimum ${clip.min}.`,
    )
  }
  if (clip && last && last.max !== clip.max) {
    push(
      last.id,
      `the highest band ends at ${last.max}; expected the score clip maximum ${clip.max}.`,
    )
  }
  return out
}

// ---------------------------------------------------------------------------------------------
// methodology.confidence

/**
 * docs/02 §4: confirmed, corroborated, reported and disputed appear once each; confirmed weighs 1
 * and names the source kinds it requires; corroborated states how many distinct publishers.
 */
function confidence({ methodology: m }: ValidationContext): Issue[] {
  const c = m.confidence
  if (!c) return []
  const out: Issue[] = []
  const push = (id: string, message: string) =>
    out.push(issue('methodology.confidence', { file: c.file, id }, message))
  const byId = new Map<string, ConfidenceLevel[]>()
  for (const level of c.value.levels) byId.set(level.id, [...(byId.get(level.id) ?? []), level])
  for (const id of CONFIDENCE_LEVELS) {
    const count = byId.get(id)?.length ?? 0
    if (count === 0) {
      push(id, `confidence level ${id} is missing; each of the four levels appears once.`)
    }
    if (count > 1) push(id, `confidence level ${id} appears ${count} times; expected once.`)
  }
  const confirmed = byId.get('confirmed')?.[0]
  if (confirmed) {
    if (confirmed.weight !== 1) {
      push('confirmed', `confirmed weighs ${confirmed.weight}; expected 1.`)
    }
    if ((confirmed.requires.any_source_kind ?? []).length === 0) {
      push(
        'confirmed',
        'confirmed has no requires.any_source_kind; list the source kinds it requires.',
      )
    }
  }
  const corroborated = byId.get('corroborated')?.[0]
  if (corroborated && corroborated.requires.min_distinct_publishers === undefined) {
    push(
      'corroborated',
      'corroborated has no requires.min_distinct_publishers; state how many distinct publishers it needs.',
    )
  }
  return out
}

// ---------------------------------------------------------------------------------------------
// methodology.decay

/** docs/02 §3: the plateau ends before the decay does, and repeatable events decay. */
function decay({ methodology: m }: ValidationContext): Issue[] {
  const d = m.decay
  if (!d) return []
  const out: Issue[] = []
  if (!(d.value.plateau_days < d.value.end_days)) {
    out.push(
      issue(
        'methodology.decay',
        { file: d.file, id: 'plateau_days' },
        `plateau_days ${d.value.plateau_days} is not below end_days ${d.value.end_days}.`,
      ),
    )
  }
  if (!d.value.applies_to.includes('repeatable')) {
    out.push(
      issue(
        'methodology.decay',
        { file: d.file, id: 'applies_to' },
        `applies_to [${d.value.applies_to.join(', ')}] must include repeatable.`,
      ),
    )
  }
  return out
}

// ---------------------------------------------------------------------------------------------
// methodology.passivity

/**
 * docs/02 §6, D-11: qualifying indicators exist and are scored; excluded ones exist and do not
 * qualify (an entry with `tiers` names tiers of a qualifying indicator instead); the default
 * penalty is one of the published sensitivity values.
 */
function passivity({ methodology: m }: ValidationContext): Issue[] {
  const p = m.passivity
  if (!p) return []
  const out: Issue[] = []
  const push = (id: string, message: string) =>
    out.push(issue('methodology.passivity', { file: p.file, id }, message))
  const known = m.indicatorsFile !== null
  const excluded = new Set(
    p.value.excluded.filter((e) => e.tiers === undefined).flatMap((e) => e.indicators),
  )
  // An entry with tiers excludes some tiers of a qualifying indicator (B-47): the indicator
  // qualifies and has every tier named.
  for (const e of p.value.excluded) {
    if (e.tiers === undefined) continue
    for (const id of e.indicators) {
      const ind = m.indicatorById.get(id)
      if (!p.value.qualifying_indicators.includes(id)) {
        push(id, `${id} has excluded tiers but is not a qualifying indicator.`)
      }
      if (!ind) continue
      const keys = 'tiers' in ind.points ? (ind.points.tiers ?? []).map((t) => t.key) : []
      for (const t of e.tiers) {
        if (!keys.includes(t)) push(id, `${id} has no tier ${t}; excluded tiers must exist.`)
      }
    }
  }
  for (const id of p.value.qualifying_indicators) {
    const ind = m.indicatorById.get(id)
    if (known && !ind) push(id, `qualifying indicator ${id} is not an indicator.`)
    if (ind && !ind.scored) {
      push(id, `qualifying indicator ${id} is not scored; only scored indicators qualify.`)
    }
    if (excluded.has(id)) push(id, `${id} is both qualifying and excluded.`)
  }
  for (const id of excluded) {
    if (known && !m.indicatorById.has(id)) push(id, `excluded indicator ${id} is not an indicator.`)
  }
  if (!p.value.sensitivity_points.includes(p.value.points)) {
    push(
      'sensitivity_points',
      `sensitivity_points [${p.value.sensitivity_points.join(', ')}] must include the penalty ${p.value.points}.`,
    )
  }
  return out
}

// ---------------------------------------------------------------------------------------------
// methodology.votes

/**
 * docs/02 §2 (B1), docs/06 §2: each qualifying vote is listed once, adopted on or after
 * 2023-10-07, cites an existing source of kind official, and quotes it verbatim (the quote is
 * the press-release evidence of the generated B1 events). Whether that source is archived is
 * checked on the source itself (source.archive-required, source.archive-index), not here.
 */
function votes(ctx: ValidationContext): Issue[] {
  const v = ctx.methodology.votes
  if (!v) return []
  const out: Issue[] = []
  const seen = new Set<string>()
  for (const vote of v.value.votes) {
    const push = (message: string) =>
      out.push(issue('methodology.votes', { file: v.file, id: vote.symbol }, message))
    if (seen.has(vote.symbol)) {
      push(`vote ${vote.symbol} is listed more than once; symbols are unique.`)
    }
    seen.add(vote.symbol)
    if (vote.date < WINDOW_START) {
      push(
        `vote ${vote.symbol} is dated ${vote.date}; qualifying votes are on or after ${WINDOW_START}.`,
      )
    }
    const source = ctx.index.sourceById.get(vote.source)
    if (!source) {
      if (!ctx.dataset.invalid.source.has(vote.source)) {
        push(`vote ${vote.symbol} cites ${vote.source}, which is not a source in data/sources.`)
      }
    } else if (source.value.kind !== 'official') {
      push(
        `vote ${vote.symbol} cites ${vote.source} of kind ${source.value.kind}; expected official.`,
      )
    }
    if (source) {
      const text = ctx.dataset.readArchiveText(vote.source)
      if (text === undefined) {
        push(
          `vote ${vote.symbol}: archive/text/${vote.source}.txt is missing, so its quote cannot be checked.`,
        )
      } else if (!quoteSearcher(text)(vote.quote)) {
        push(
          `vote ${vote.symbol}: the quote does not appear verbatim in archive/text/${vote.source}.txt (only whitespace and invisible format characters are normalised).`,
        )
      }
    }
  }
  return out
}

// ---------------------------------------------------------------------------------------------
// methodology.symmetry

/**
 * docs/02 §12.5, §13, spec §8: every negative or mixed indicator has a positive counterpart or a
 * stated reason for none; ids exist and each side has the matching sign (mixed fits both).
 */
function symmetry({ methodology: m }: ValidationContext): Issue[] {
  const s = m.symmetry
  if (!s) return []
  const out: Issue[] = []
  const push = (id: string, message: string) =>
    out.push(issue('methodology.symmetry', { file: s.file, id }, message))
  const known = m.indicatorsFile !== null
  const covered = new Set<string>()
  const check = (id: string, side: 'negative' | 'positive' | 'no_counterpart') => {
    if (!known) return
    const ind = m.indicatorById.get(id)
    if (!ind) {
      push(id, `${id} on the ${side} side of symmetry.yaml is not an indicator.`)
    } else if (side === 'positive' ? ind.sign === 'negative' : ind.sign === 'positive') {
      const expected = side === 'positive' ? 'positive or mixed' : 'negative or mixed'
      push(id, `${id} is ${ind.sign} but sits on the ${side} side; expected ${expected}.`)
    }
  }
  for (const pair of s.value.pairs) {
    for (const id of pair.negative) {
      covered.add(id)
      check(id, 'negative')
    }
    for (const id of pair.positive) check(id, 'positive')
  }
  for (const entry of s.value.no_counterpart) {
    covered.add(entry.indicator)
    check(entry.indicator, 'no_counterpart')
  }
  for (const ind of m.indicatorsFile?.value.indicators ?? []) {
    if (ind.sign !== 'positive' && !covered.has(ind.id)) {
      push(
        ind.id,
        `${ind.id} is ${ind.sign} but has no positive counterpart and no no_counterpart reason in symmetry.yaml.`,
      )
    }
  }
  return out
}

// ---------------------------------------------------------------------------------------------
// methodology.banned-words

/**
 * docs/02 §12.6: banned-words.txt lists at least one term, each once; `*` is a suffix wildcard
 * only (a lone `*`, `**` or a `*` before the end would match everything or nothing sensible).
 */
function bannedWords({ methodology: m }: ValidationContext): Issue[] {
  const b = m.bannedWords
  if (!b) return []
  if (b.entries.length === 0) {
    return [
      issue(
        'methodology.banned-words',
        { file: b.file },
        'banned-words.txt lists no term; the tone lint needs at least one.',
      ),
    ]
  }
  const out: Issue[] = []
  const firstLine = new Map<string, number>()
  for (const entry of b.entries) {
    const push = (message: string) =>
      out.push(
        issue(
          'methodology.banned-words',
          { file: b.file, id: entry.term, line: entry.line },
          message,
        ),
      )
    const earlier = firstLine.get(entry.term)
    if (earlier !== undefined) {
      push(`"${entry.term}" repeats line ${earlier}; each term appears once.`)
    } else {
      firstLine.set(entry.term, entry.line)
    }
    if (entry.term === '*' || entry.term.includes('**') || entry.term.slice(0, -1).includes('*')) {
      push(`"${entry.term}" misplaces the wildcard; * is allowed once, at the end of a term.`)
    }
  }
  return out
}

export const rules: Rule[] = [
  version,
  indicatorSet,
  indicatorPoints,
  indicatorCaps,
  thresholds,
  categories,
  bands,
  confidence,
  decay,
  passivity,
  votes,
  symmetry,
  bannedWords,
]
