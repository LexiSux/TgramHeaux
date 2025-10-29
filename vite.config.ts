import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'  // for cleaner paths

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/TgramHeaux/',  // ← THIS FIXES BLANK SCREEN ON GITHUB PAGES
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),  // optional: for cleaner imports
    },
  },
  build: {
    outDir: 'dist',  // matches your workflow
    emptyOutDir: true,  // clears old builds
    sourcemap: false,  // faster, smaller bundles
  },
  server: {
    port: 3000,  // local dev port
  },
})
