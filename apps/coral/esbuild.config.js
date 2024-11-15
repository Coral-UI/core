import process from 'process'
import { build, context } from 'esbuild'

const isProduction = process.env.NODE_ENV === 'production'

const config = {
  entryPoints: ['src/plugin/code.ts'],
  outfile: 'dist/code.js',
  bundle: true,
  platform: 'node',
  target: 'es6',
  format: 'cjs',
  minify: true,
  watch: true,
  // plugins: [nodeExternals()],
}

if (isProduction) {
  build(config).catch(() => process.exit(1))
} else {
  context(config)
    .then((context) => {
      context.watch()
      // console.log('Watching for changes...')
    })
    .catch(() => process.exit(1))
}
