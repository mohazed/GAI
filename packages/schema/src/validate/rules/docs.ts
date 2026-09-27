/**
 * Validation rules: docs (docs/05 §6).
 *
 * The tables of methodology.{en,fr}.md are generated from the YAML of the same version folder by
 * `pnpm methodology:render` (methodology/render.ts) between marker lines
 * `<!-- BEGIN generated:NAME -->` and `<!-- END generated:NAME -->`. The prose around them is
 * hand-written; the tables never are, so the page cannot drift from the numbers that score.
 */
import { type Issue, issue } from '../../issues.js'
import type { Methodology, MethodologyDoc } from '../../load/methodology.js'
import {
  findMarkers,
  GENERATED_BLOCKS,
  type GeneratedPair,
  isGeneratedBlock,
  renderDoc,
  renderedLines,
} from '../../methodology/render.js'
import type { Rule } from '../context.js'

const marker = (kind: 'BEGIN' | 'END', name: string) => `<!-- ${kind} generated:${name} -->`

/** Every YAML file a rendering reads has loaded (otherwise staleness cannot be judged). */
function yamlLoaded(m: Methodology): boolean {
  return [
    m.indicatorsFile,
    m.categories,
    m.bands,
    m.confidence,
    m.decay,
    m.passivity,
    m.thresholds,
    m.symmetry,
    m.votes,
  ].every((f) => f !== null)
}

/**
 * Marker layout of one document: each block of GENERATED_BLOCKS has exactly one BEGIN and one
 * END line, BEGIN first, with no other marker between them; marker names are known blocks.
 * Returns the issues and the well-formed pairs.
 */
function checkMarkers(doc: MethodologyDoc): { issues: Issue[]; pairs: GeneratedPair[] } {
  const file = doc.file
  const markers = findMarkers(doc.text)
  const issues: Issue[] = []
  const pairs: GeneratedPair[] = []
  for (const mk of markers) {
    if (isGeneratedBlock(mk.name)) continue
    issues.push(
      issue(
        'methodology.docs-generated',
        { file, id: mk.name === '' ? '-' : mk.name, line: mk.line },
        `Marker "${marker(mk.kind, mk.name)}" names no generated block; expected one of ${GENERATED_BLOCKS.join(', ')}.`,
      ),
    )
  }
  for (const name of GENERATED_BLOCKS) {
    const at = (line: number) => ({ file, id: name, line })
    const begins = markers.filter((mk) => mk.kind === 'BEGIN' && mk.name === name)
    const ends = markers.filter((mk) => mk.kind === 'END' && mk.name === name)
    const [begin, secondBegin] = begins
    const [end, secondEnd] = ends
    if (!begin && !end) {
      issues.push(
        issue(
          'methodology.docs-generated',
          at(1),
          `Generated block "${name}" is missing; expected the lines "${marker('BEGIN', name)}" and "${marker('END', name)}" where its table belongs.`,
        ),
      )
      continue
    }
    if (!begin || !end) {
      const present = begin ?? end
      issues.push(
        issue(
          'methodology.docs-generated',
          at(present?.line ?? 1),
          begin
            ? `Marker "${marker('BEGIN', name)}" has no matching "${marker('END', name)}"; expected one after it.`
            : `Marker "${marker('END', name)}" has no matching "${marker('BEGIN', name)}"; expected one before it.`,
        ),
      )
      continue
    }
    if (secondBegin || secondEnd) {
      for (const [list, second] of [
        [begins, secondBegin],
        [ends, secondEnd],
      ] as const) {
        if (!second) continue
        issues.push(
          issue(
            'methodology.docs-generated',
            at(second.line),
            `Marker "${marker(second.kind, name)}" appears ${list.length} times (lines ${list.map((mk) => mk.line).join(', ')}); expected exactly one.`,
          ),
        )
      }
      continue
    }
    if (end.line < begin.line) {
      issues.push(
        issue(
          'methodology.docs-generated',
          at(end.line),
          `Marker "${marker('END', name)}" at line ${end.line} comes before "${marker('BEGIN', name)}" at line ${begin.line}; expected BEGIN first.`,
        ),
      )
      continue
    }
    const inner = markers.find((mk) => mk.line > begin.line && mk.line < end.line)
    if (inner) {
      issues.push(
        issue(
          'methodology.docs-generated',
          at(begin.line),
          `Block "${name}" (lines ${begin.line}–${end.line}) contains the marker "${marker(inner.kind, inner.name)}" at line ${inner.line}; expected no other marker between BEGIN and END.`,
        ),
      )
      continue
    }
    pairs.push({ name, begin: begin.line, end: end.line })
  }
  return { issues, pairs }
}

/**
 * `methodology.docs-generated` (docs/05 §6): for methodology.en.md and methodology.fr.md, the
 * markers are well formed (checkMarkers) and every block holds exactly what the renderer
 * produces from the current YAML — one issue per stale block, at its BEGIN line. Staleness is not
 * judged when a methodology YAML failed to load (its schema error is reported instead). A file
 * whose blocks are current but which the renderer would still rewrite (CRLF line endings) gets
 * one file-level issue, so that a clean rule means `pnpm methodology:render --check` passes.
 */
export const docsGenerated: Rule = (ctx) => {
  const m = ctx.methodology
  const out: Issue[] = []
  for (const lang of ['en', 'fr'] as const) {
    const doc = m.docs[lang]
    if (!doc) continue
    const { issues, pairs } = checkMarkers(doc)
    out.push(...issues)
    if (!yamlLoaded(m)) continue
    const lines = doc.text.replace(/\r\n?/g, '\n').split('\n')
    let stale = 0
    for (const pair of pairs) {
      const current = lines.slice(pair.begin, pair.end - 1).join('\n')
      if (current === renderedLines(m, pair.name, lang).join('\n')) continue
      stale++
      out.push(
        issue(
          'methodology.docs-generated',
          { file: doc.file, id: pair.name, line: pair.begin },
          `Block "${pair.name}" differs from its rendering of the ${m.folder} YAML; run pnpm methodology:render.`,
        ),
      )
    }
    if (issues.length === 0 && stale === 0 && renderDoc(doc.text, m, lang) !== doc.text) {
      out.push(
        issue(
          'methodology.docs-generated',
          { file: doc.file, id: '-', line: 1 },
          `${doc.file} differs from its rendering (line endings are not LF); run pnpm methodology:render.`,
        ),
      )
    }
  }
  return out
}

export const rules: Rule[] = [docsGenerated]
