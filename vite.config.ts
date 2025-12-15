import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        app: resolve(__dirname, 'app.html'),
        'privacy-policy': resolve(__dirname, 'privacy-policy.html'),
        'terms-and-conditions': resolve(__dirname, 'terms-and-conditions.html'),
        'refund-policy': resolve(__dirname, 'refund-policy.html'),
        'about-us': resolve(__dirname, 'about-us.html'),
        'contact-us': resolve(__dirname, 'contact-us.html'),
      },
    },
  },
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..'],
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:54321/functions/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    hmr: {
      overlay: false,
    },
  },
});
