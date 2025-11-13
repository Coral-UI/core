import path from 'path'
import type { PluginOption } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron/simple'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

const isElectron = process.env['ELECTRON'] === 'true'

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
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    // Conditionally add Electron plugin
    // Type assertion needed due to version mismatch between vite-plugin-electron's Vite dependency and project's Vite version
    ...(isElectron
      ? ([
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
        ] as unknown as PluginOption[])
      : []),
  ],
  // Electron doesn't support native ES modules
  ...(isElectron && {
    build: {
      outDir: 'dist',
      rollupOptions: {
        external: ['electron'],
      },
    },
  }),
})
