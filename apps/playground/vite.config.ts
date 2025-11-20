import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    extensions: ['.mjs', '.js', '.json', '.jsx', '.ts', '.tsx'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    devtools(),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      // Don't polyfill these modules
      exclude: ['fs', 'path'],
      // Specify which modules should be polyfilled
      include: ['buffer', 'process', 'util'],
    }),
    // Skip Router plugin in Storybook (not needed)
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
})
