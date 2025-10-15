import process from 'process'
import fs from 'fs'
import { build, context } from 'esbuild'

const isProduction = process.env.NODE_ENV === 'production'

// Helper to replace BigInt calls in the output
function postProcess() {
  const outfile = 'dist/code.js'
  let code = fs.readFileSync(outfile, 'utf8')

  // Replace BigInt calls from Zod with safe Number values
  // These are int64 range constants that Zod uses internally
  code = code.replace(/BigInt\("(-?\d+)"\)/g, (match, num) => {
    // For large numbers, just use Number.MAX_SAFE_INTEGER or MIN
    if (num === '-9223372036854775808') return 'Number.MIN_SAFE_INTEGER'
    if (num === '9223372036854775807') return 'Number.MAX_SAFE_INTEGER'
    if (num === '18446744073709551615') return 'Number.MAX_SAFE_INTEGER'
    return `"${num}"`
  })
  code = code.replace(/BigInt\(0\)/g, '0')
  // Replace dynamic BigInt calls (from Zod runtime) with Number conversion
  code = code.replace(/BigInt\(([^)]+)\)/g, 'Number($1)')

  fs.writeFileSync(outfile, code)
  console.log('✅ Post-processed code.js')
}

const config = {
  entryPoints: ['src/plugin/code.ts'],
  outfile: 'dist/code.js',
  bundle: true,
  platform: 'browser',
  target: 'es2017',
  format: 'iife',
  minify: isProduction,
  sourcemap: !isProduction,
  treeShaking: true,
  // Figma plugin sandbox doesn't support these features
  // Use supported to control feature transpilation
  supported: {
    'bigint': false,
    'top-level-await': false,
    'object-rest-spread': false, // Force transpilation of spread operators
  },
  logLevel: 'info',
  plugins: [
    {
      name: 'post-process',
      setup(build) {
        build.onEnd(() => {
          if (fs.existsSync('dist/code.js')) {
            postProcess()
          }
        })
      }
    }
  ]
}

if (isProduction) {
  build(config).catch(() => process.exit(1))
} else {
  context(config)
    .then((ctx) => {
      ctx.watch()
      console.log('👀 Watching for changes...')
    })
    .catch(() => process.exit(1))
}
