import type { ReactNode } from 'react'
import { type DocBlock, type Inline, parseInline, sitePath } from '../lib/doc'
import { renderMath } from '../lib/math'

export interface DocMarkdownProps {
  blocks: readonly DocBlock[]
  /** Components placed at `<!-- slot:name -->` lines; a slot without a component fails the build. */
  slots?: Record<string, ReactNode>
  /**
   * The id of a table row, from the generated block it sits in and its first cell: the
   * methodology's indicator rows get `indicator-{ID}`, so other pages can link them.
   */
  rowId?: (generated: string | null, firstCell: string) => string | undefined
  /** Leave out the document's `#` heading (the page renders its own h1). */
  skipTitle?: boolean
  /** Heading levels added to every heading (a document placed inside a section); at most h4. */
  shift?: number
  /** Prefix of every heading id (two documents on one page). */
  idPrefix?: string
  /**
   * Components placed at the end of a section, keyed by the id of its heading: before the next
   * heading of the same or a higher level. A key without its heading fails the build.
   */
  appendTo?: Record<string, ReactNode>
}

function InlineNodes({ nodes }: { nodes: readonly Inline[] }) {
  return (
    <>
      {nodes.map((n, i) => {
        const key = `${n.t}-${i}`
        switch (n.t) {
          case 'text':
            return n.v
          case 'code':
            return (
              <code key={key} className="font-mono text-[0.9em] [overflow-wrap:anywhere]">
                {n.v}
              </code>
            )
          case 'strong':
            return (
              <strong key={key} className="font-semibold">
                <InlineNodes nodes={n.children} />
              </strong>
            )
          default:
            return (
              <a key={key} href={sitePath(n.href)}>
                <InlineNodes nodes={n.children} />
              </a>
            )
        }
      })}
    </>
  )
}

export function InlineText({ text }: { text: string }) {
  return <InlineNodes nodes={parseInline(text)} />
}

const HEADING_CLASS = {
  1: 'display text-d40 md:text-d64',
  2: 'display text-d28 border-t border-rule pt-12 mt-4',
  3: 'text-18 font-semibold mt-4',
  4: 'text-16 font-semibold mt-2',
} as const

const ALIGN = { start: 'text-start', center: 'text-center', end: 'text-end' } as const

/**
 * A document of lib/doc.ts as React elements (the methodology, its changelog, the prose of the
 * About, Data, Embed and Reply pages): headings with anchors, paragraphs at reading size, lists,
 * tables in a horizontally scrolling box (hairlines, no cards), display math as MathML from
 * KaTeX, code blocks, and the components of the page at its slots. Nothing from the document is
 * injected as HTML except KaTeX's MathML of the formulas (lib/math.ts).
 */
export function DocMarkdown({
  blocks,
  slots = {},
  rowId,
  skipTitle = false,
  shift = 0,
  idPrefix = '',
  appendTo = {},
}: DocMarkdownProps) {
  const used = new Set<string>()
  let generated: string | null = null
  const out: ReactNode[] = []
  const pending: { level: number; id: string }[] = []
  const flush = (level: number) => {
    while (
      pending.length > 0 &&
      (pending[pending.length - 1] as { level: number }).level >= level
    ) {
      const p = pending.pop() as { level: number; id: string }
      out.push(<div key={`append-${p.id}`}>{appendTo[p.id]}</div>)
    }
  }
  blocks.forEach((b, i) => {
    const key = `b${i}`
    switch (b.kind) {
      case 'heading': {
        if (b.level === 1 && skipTitle) return
        const level = Math.min(4, b.level + shift) as 1 | 2 | 3 | 4
        flush(level)
        const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4'
        out.push(
          <Tag
            key={key}
            id={`${idPrefix}${b.id}`}
            className={`${HEADING_CLASS[level]} scroll-mt-8`}
          >
            <InlineText text={b.text} />
          </Tag>,
        )
        if (appendTo[b.id] !== undefined) {
          used.add(`append:${b.id}`)
          pending.push({ level, id: b.id })
        }
        return
      }
      case 'paragraph':
        out.push(
          <p key={key} className="max-w-prose text-18">
            <InlineText text={b.text} />
          </p>,
        )
        return
      case 'list': {
        const items = b.items.map((item, k) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: document order is the identity.
          <li key={k} className="ps-1">
            <InlineText text={item} />
          </li>
        ))
        out.push(
          b.ordered ? (
            <ol
              key={key}
              start={b.start}
              className="flex max-w-prose list-decimal flex-col gap-2 ps-6 text-18"
            >
              {items}
            </ol>
          ) : (
            <ul key={key} className="flex max-w-prose list-disc flex-col gap-2 ps-6 text-18">
              {items}
            </ul>
          ),
        )
        return
      }
      case 'table':
        out.push(
          <div key={key} className="overflow-x-auto">
            <table className="w-full border-collapse text-14">
              <thead>
                <tr className="border-b border-ink">
                  {b.header.map((h, k) => (
                    <th
                      // biome-ignore lint/suspicious/noArrayIndexKey: column order is the identity.
                      key={k}
                      scope="col"
                      className={`py-2 pe-4 align-bottom font-semibold ${ALIGN[b.align[k] ?? 'start']}`}
                    >
                      <InlineText text={h} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.rows.map((row, r) => (
                  <tr
                    // biome-ignore lint/suspicious/noArrayIndexKey: row order is the identity.
                    key={r}
                    id={rowId?.(generated, row[0] ?? '')}
                    className="scroll-mt-8 border-b border-rule align-top"
                  >
                    {row.map((cell, k) =>
                      k === 0 ? (
                        <th
                          // biome-ignore lint/suspicious/noArrayIndexKey: column order.
                          key={k}
                          scope="row"
                          className={`py-2 pe-4 font-normal ${ALIGN[b.align[k] ?? 'start']}`}
                        >
                          <InlineText text={cell} />
                        </th>
                      ) : (
                        <td
                          // biome-ignore lint/suspicious/noArrayIndexKey: column order.
                          key={k}
                          className={`py-2 pe-4 ${ALIGN[b.align[k] ?? 'start']}`}
                        >
                          <InlineText text={cell} />
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>,
        )
        return
      case 'math':
        out.push(
          <div
            key={key}
            className="doc-math overflow-x-auto py-2"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: KaTeX MathML of the methodology's own formulas, rendered at build (lib/math.ts).
            dangerouslySetInnerHTML={{ __html: renderMath(b.tex) }}
          />,
        )
        return
      case 'code':
        out.push(
          <pre
            key={key}
            // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrolling region must be reachable by keyboard (WCAG 2.1.1).
            tabIndex={0}
            className="overflow-x-auto rounded-xs bg-paper-2 p-4 font-mono text-m13"
          >
            <code>{b.text}</code>
          </pre>,
        )
        return
      case 'slot': {
        const node = slots[b.name]
        if (node === undefined) throw new Error(`document slot "${b.name}" has no component`)
        used.add(b.name)
        out.push(<div key={key}>{node}</div>)
        return
      }
      case 'generated':
        generated = b.edge === 'begin' ? b.name : null
        return
    }
  })
  flush(0)
  const unused = [
    ...Object.keys(slots).filter((s) => !used.has(s)),
    ...Object.keys(appendTo)
      .filter((id) => !used.has(`append:${id}`))
      .map((id) => `#${id}`),
  ]
  if (unused.length > 0)
    throw new Error(`document has no slot or section for: ${unused.join(', ')}`)
  return <>{out}</>
}
