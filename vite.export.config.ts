import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    lib: {
      entry: 'scripts/export-entry.ts',
      formats: ['es'],
      fileName: () => 'export-test.mjs',
    },
    outDir: 'dist-export-test',
  },
})
