import { defineConfig } from 'vite'

/**
 * One classic script, dist/gai.js (docs/04 §4): an IIFE without exports or globals, minified,
 * no source map, no hash in the name (the site serves it at the versioned path /embed/v1/gai.js).
 * The target keeps the syntax readable by every browser that has Shadow DOM and fetch.
 */
export default defineConfig({
  build: {
    target: 'es2019',
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    minify: true,
    lib: {
      entry: 'src/main.ts',
      formats: ['iife'],
      name: 'gaiEmbed',
      fileName: () => 'gai.js',
    },
  },
})
