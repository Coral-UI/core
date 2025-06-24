import { defineConfig } from 'tsup'

export default defineConfig((options) => ({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  outDir: 'dist',
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ['colord', 'prettier/standalone', 'prettier/parser-html'],
  minify: !options.watch,
  esModuleInterop: true,
  outExtension: ({ format }) => (format === 'esm' ? { js: '.mjs' } : { js: '.cjs' }),
  ...options,
}))
