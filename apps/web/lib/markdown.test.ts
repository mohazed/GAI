import { describe, expect, it } from 'vitest'
import { parseMarkdown } from './markdown'

describe('monthly report Markdown', () => {
  it('reads headings, paragraphs, lists, tables and escapes', () => {
    const src = [
      '# Changes, August 2025',
      '',
      'Gaza Accountability Index · methodology 1.0.0 · 1 August 2025 to 31 August 2025',
      '',
      '## Movers',
      '',
      '| Country | From | To | Change |',
      '|---|---:|---:|---:|',
      '| Côte d\\|Ivoire | −15 | −5 | +10 |',
      '',
      '### Week of 4 August 2025',
      '',
      '- 2025-08-08 · Germany · A6 · +10 · The \\*government\\* stated \\[x\\].',
      '- 2025-08-09 · Germany · B1 · +2 · A vote.',
      '',
    ].join('\n')
    expect(parseMarkdown(src)).toEqual([
      { kind: 'heading', level: 1, text: 'Changes, August 2025' },
      {
        kind: 'paragraph',
        text: 'Gaza Accountability Index · methodology 1.0.0 · 1 August 2025 to 31 August 2025',
      },
      { kind: 'heading', level: 2, text: 'Movers' },
      {
        kind: 'table',
        header: ['Country', 'From', 'To', 'Change'],
        align: ['start', 'end', 'end', 'end'],
        rows: [['Côte d|Ivoire', '−15', '−5', '+10']],
      },
      { kind: 'heading', level: 3, text: 'Week of 4 August 2025' },
      {
        kind: 'list',
        items: [
          '2025-08-08 · Germany · A6 · +10 · The *government* stated [x].',
          '2025-08-09 · Germany · B1 · +2 · A vote.',
        ],
      },
    ])
  })

  it('refuses what the reports never write', () => {
    expect(() => parseMarkdown('Some *emphasis*.')).toThrow(/inline markup/)
    expect(() => parseMarkdown('> quote')).toThrow(/unsupported block/)
    expect(() => parseMarkdown('1. first')).toThrow(/unsupported block/)
    expect(() => parseMarkdown('| a | b |\n| c | d |')).toThrow(/alignment row/)
    expect(() => parseMarkdown('<b>x</b>')).toThrow(/inline markup/)
    expect(parseMarkdown('- 2026-01-02 · evt_2025_08_08_DEU_A6_x · correction · A \\_ b.')).toEqual(
      [{ kind: 'list', items: ['2026-01-02 · evt_2025_08_08_DEU_A6_x · correction · A _ b.'] }],
    )
  })
})
