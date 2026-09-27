import { defineConfig } from 'vitest/config'

// The property and metamorphic tests score thousands of random countries over whole windows;
// under a parallel `pnpm test` they need more than the 5 s default.
export default defineConfig({ test: { testTimeout: 30_000 } })
