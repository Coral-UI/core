import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import electron from 'vite-plugin-electron/simple'

const isElectron = process.env.ELECTRON === 'true'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    extensions: ['.mjs', '.js', '.json', '.jsx', '.ts', '.tsx'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
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
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    // Conditionally add Electron plugin
    ...(isElectron
      ? [
          electron({
            main: {
              // Shortcut of `build.lib.entry`
              entry: 'src/electron/main.ts',
            },
            preload: {
              // Shortcut of `build.rollupOptions.input`
              input: 'src/electron/preload.ts',
            },
            // Ployfill the Electron and Node.js API for Renderer process.
            // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
            // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
            renderer: {},
          }),
        ]
      : []),
  ],
  // Electron doesn't support native ES modules
  build: isElectron
    ? {
        outDir: 'dist',
        rollupOptions: {
          external: ['electron'],
        },
      }
    : undefined,
})
