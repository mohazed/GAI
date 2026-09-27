import { describe, expect, it } from 'vitest'
import { parseEnv } from './env.js'

describe('parseEnv', () => {
  it('reads KEY=VALUE lines, quotes, comments and export prefixes', () => {
    expect(
      parseEnv(
        [
          '# comment',
          'A=1',
          'export B="two words"',
          "C='x#y'",
          'D=plain # trailing',
          '',
          'bad line',
        ].join('\n'),
      ),
    ).toEqual({ A: '1', B: 'two words', C: 'x#y', D: 'plain' })
  })
})
