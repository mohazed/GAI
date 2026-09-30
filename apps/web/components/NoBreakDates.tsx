/**
 * A text whose ISO dates (`2026-05-28`) never break across lines: a narrow column otherwise breaks
 * them after a hyphen ("2026-" / "05-28"), which reads as two numbers (P-17). Used for the
 * generated summary line; the characters are unchanged, so a copied text stays the same.
 */
export function NoBreakDates({ text }: { text: string }) {
  const parts = text.split(/(\d{4}-\d{2}-\d{2})/)
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: the parts of one fixed string
          <span key={i} className="whitespace-nowrap">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  )
}
