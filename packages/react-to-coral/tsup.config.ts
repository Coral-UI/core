import { defineConfig } from 'tsup'

export default defineConfig((options) => ({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  outDir: 'dist',
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: !options.watch,
  ...options,
}))
