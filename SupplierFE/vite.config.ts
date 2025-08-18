import { defineConfig } from 'vitest/config'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { resolve } from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({ autoCodeSplitting: true }),
    viteReact(),
    tailwindcss(),
  ],
  // build: {
  //   outDir: path.resolve(__dirname, '../SupplierBE/FEBuild'),
  //   emptyOutDir: true,
  // },
  test: {
    globals: true,
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    https: {
      key: fs.readFileSync('./172.22.80.1+2-key.pem'),
      cert: fs.readFileSync('./172.22.80.1+2.pem'),
    },
    host: '172.22.80.1',
    port: 3000,
  },
})
