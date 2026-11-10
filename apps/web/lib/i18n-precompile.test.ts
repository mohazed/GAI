/**
 * The site build formats messages compiled ahead of time with next-intl's format-only formatter
 * (lib/i18n.ts, next.config.ts; docs/04 §3). Outside the bundler the default formatter
 * (intl-messageformat) runs on the ICU strings. Every message of both languages must read the same
 * either way, for every plural branch.
 */
import compile from 'icu-minify/compile'
import format, { type CompiledMessage } from 'icu-minify/format'
import { createTranslator } from 'next-intl'
import { describe, expect, it } from 'vitest'
import { LOCALES, MESSAGES, PRECOMPILED } from './i18n'

type Tree = { [k: string]: string | Tree }

function leaves(tree: Tree, prefix = ''): Array<[string, string]> {
  return Object.entries(tree).flatMap(([k, v]) =>
    typeof v === 'string'
      ? [[`${prefix}${k}`, v] as [string, string]]
      : leaves(v, `${prefix}${k}.`),
  )
}

/** Argument names of a compiled message: plain ones and plural ones (the only kinds used). */
function args(node: unknown, plain: Set<string>, plural: Set<string>): void {
  if (!Array.isArray(node)) return
  if (typeof node[0] === 'string' && node.length === 1) {
    plain.add(node[0])
    return
  }
  if (typeof node[0] === 'string' && typeof node[1] === 'number') {
    if (node[1] !== 2) throw new Error(`argument type ${node[1]} is not covered by this test`)
    plural.add(node[0])
    // A branch is a string, the pound sign (0) or a list of nodes.
    for (const branch of Object.values(node[2] as Record<string, unknown>)) {
      if (Array.isArray(branch)) for (const child of branch) args(child, plain, plural)
    }
    return
  }
  for (const child of node) args(child, plain, plural)
}

const formatters = {
  getNumberFormat: (...a: ConstructorParameters<typeof Intl.NumberFormat>) =>
    new Intl.NumberFormat(...a),
  getDateTimeFormat: (...a: ConstructorParameters<typeof Intl.DateTimeFormat>) =>
    new Intl.DateTimeFormat(...a),
  getPluralRules: (...a: ConstructorParameters<typeof Intl.PluralRules>) =>
    new Intl.PluralRules(...a),
}

describe('precompiled messages (docs/04 §3)', () => {
  it('keeps ICU strings outside the bundler', () => {
    expect(PRECOMPILED).toBe(false)
    expect(typeof MESSAGES.en.common.siteName).toBe('string')
  })

  for (const lang of LOCALES) {
    it(`formats every ${lang} message as the default formatter does`, () => {
      const t = createTranslator({ locale: lang, messages: MESSAGES[lang] })
      const all = leaves(MESSAGES[lang] as unknown as Tree)
      expect(all.length).toBeGreaterThan(100)
      let plurals = 0
      for (const [key, source] of all) {
        const compiled = compile(source) as CompiledMessage
        const plain = new Set<string>()
        const plural = new Set<string>()
        if (Array.isArray(compiled)) for (const n of compiled) args(n, plain, plural)
        plurals += plural.size
        const counts = plural.size > 0 ? [0, 1, 2, 5, 21, 1234] : [0]
        for (const n of counts) {
          const values: Record<string, string | number> = {}
          for (const a of plain) values[a] = `‹${a}›`
          for (const a of plural) values[a] = n
          const expected = t(key as never, values as never)
          const actual = format(compiled, lang, values, { formatters })
          expect(actual, `${lang} ${key} (${n})`).toBe(expected)
        }
      }
      expect(plurals).toBeGreaterThan(10)
    })
  }
})
