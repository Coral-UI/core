import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Tailwind v4 Vite plugin handles PostCSS automatically
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    // Ensure workspace packages are resolved correctly
    dedupe: ['@reallygoodwork/coral-core'],
  },
  optimizeDeps: {
    // Pre-bundle workspace packages
    include: [
      '@reallygoodwork/coral-core',
      '@reallygoodwork/coral-to-html',
      '@reallygoodwork/coral-to-react',
      '@reallygoodwork/react-to-coral',
    ],
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild', // Use esbuild for faster builds, avoids CSS minification issues
    cssMinify: 'esbuild', // Use esbuild for CSS minification instead of cssnano
    commonjsOptions: {
      // Transform workspace packages
      transformMixedEsModules: true,
      include: [/node_modules/],
    },
    rollupOptions: {
      // Don't externalize anything - bundle all client-side code
      // Server-only files are already excluded via tsconfig.json
    },
  },
  server: {
    port: 3000,
  },
})
