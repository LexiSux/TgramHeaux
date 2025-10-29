// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  // 1. Base for GitHub Pages (repo name)
  base: '/TgramHeaux/',

  // 2. Alias – point to the **root** (no src/ or client/)
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),   // <-- everything is in root
    },
  },

  // 3. Build output (matches the workflow)
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
  },

  // 4. Optional: dev server port (you already had it)
  server: { port: 3000 },
});
