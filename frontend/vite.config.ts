import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/rag-cl/', // Replace with your repository name
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: true, // Listen on all local IPs
    port: 5000,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
