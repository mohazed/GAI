import { defineConfig } from 'vitest/config'

// The score CLI and generator tests load the methodology and whole datasets, and the tone lint
// compiles the banned-word list; under a parallel `pnpm test` on a two-core CI runner they need
// more than the 5 s default.
export default defineConfig({ test: { testTimeout: 30_000 } })
