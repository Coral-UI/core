import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vitejs.dev/config/
export default defineConfig({
  root: './src/ui',
  plugins: [
    react(),
    viteSingleFile(),
    tailwindcss(),
    nodePolyfills({
      include: ['path', 'fs'],
    }),
  ],
  build: {
    target: 'esnext',
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    outDir: '../../dist',
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
})
