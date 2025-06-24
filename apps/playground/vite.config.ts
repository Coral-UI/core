import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    extensions: ['.mjs', '.js', '.json', '.jsx', '.ts', '.tsx'],
  },
  plugins: [
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
    react(),
    tailwindcss(),
  ],
})
