import { defineConfig } from 'vitest/config'

// The CLI and rule-firing tests load and validate whole datasets (and read git); under a parallel
// `pnpm test` on a two-core CI runner, next to the scoring property tests, they need more than the
// 5 s default.
export default defineConfig({ test: { testTimeout: 30_000 } })
