import { defineConfig } from 'vitest/config'

// The property and metamorphic tests score thousands of random countries over whole windows;
// under a parallel `pnpm test` they need more than the 5 s default.
// `pnpm --filter @gai/scoring coverage` measures line and branch coverage of src/ (P-19); the
// thresholds keep it from falling below what it was when measured.
export default defineConfig({
  test: {
    testTimeout: 30_000,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/test-helpers.ts', 'src/types.ts'],
      reporter: ['text-summary', 'text'],
      // Measured on 2026-09-30 (P-19): statements 98.0 %, branches 96.4 %, functions 96.0 %,
      // lines 98.7 %. The uncovered rest is FrozenMap's unused iteration methods and defensive
      // branches the schema already rules out.
      thresholds: { statements: 97, branches: 95, functions: 95, lines: 98 },
    },
  },
})
