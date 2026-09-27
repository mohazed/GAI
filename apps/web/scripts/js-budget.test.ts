import { describe, expect, it } from 'vitest'
import { BUDGET, budgetProblems, frameworkChunks, type PageWeight, pageScripts } from './js-budget'

const page = (p: Partial<PageWeight>): PageWeight => ({
  page: 'en/index.html',
  frameworkBytes: 0,
  appBytes: 0,
  totalBytes: 0,
  scripts: [],
  ...p,
})

describe('JavaScript budget (docs/04 §3, B-79)', () => {
  it('reads the external scripts a modern browser loads, leaving out noModule ones', () => {
    const html =
      '<script src="/_next/a.js" async=""></script><script src="/_next/p.js" noModule=""></script>' +
      '<script>inline()</script><script id="x" src="/_next/b.js?v=1"></script>'
    expect(pageScripts(html)).toEqual(['/_next/a.js', '/_next/b.js?v=1'])
  })

  it('takes the framework chunks from the build manifest', () => {
    const f = frameworkChunks({
      rootMainFiles: ['static/chunks/webpack-1.js'],
      polyfillFiles: ['static/chunks/polyfills-2.js'],
    })
    expect([...f]).toEqual([
      '/_next/static/chunks/webpack-1.js',
      '/_next/static/chunks/polyfills-2.js',
    ])
  })

  it('flags a page over either limit, and only then', () => {
    const kb = 1024
    expect(
      budgetProblems([page({ totalBytes: BUDGET.totalKb * kb, appBytes: BUDGET.appKb * kb })]),
    ).toEqual([])
    expect(budgetProblems([page({ totalBytes: BUDGET.totalKb * kb + 1 })])).toHaveLength(1)
    expect(budgetProblems([page({ appBytes: BUDGET.appKb * kb + 1 })])[0]).toMatch(
      /application code/,
    )
  })
})
