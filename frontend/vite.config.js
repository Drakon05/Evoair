import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'rewrite-multi-page-routes',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/products' || req.url?.startsWith('/products?')) {
            req.url = '/products.html';
          } else if (req.url === '/cart' || req.url?.startsWith('/cart?')) {
            req.url = '/cart.html';
          }
          next();
        });
      },
    },
    {
      name: 'postbuild-github-pages',
      closeBundle() {
        const distDir = resolve(__dirname, 'dist');
        const productsHtml = resolve(distDir, 'products.html');
        const cartHtml = resolve(distDir, 'cart.html');
        const indexHtml = resolve(distDir, 'index.html');

        const productsDir = resolve(distDir, 'products');
        const cartDir = resolve(distDir, 'cart');

        if (fs.existsSync(productsHtml)) {
          if (!fs.existsSync(productsDir)) fs.mkdirSync(productsDir, { recursive: true });
          fs.copyFileSync(productsHtml, resolve(productsDir, 'index.html'));
        }
        if (fs.existsSync(cartHtml)) {
          if (!fs.existsSync(cartDir)) fs.mkdirSync(cartDir, { recursive: true });
          fs.copyFileSync(cartHtml, resolve(cartDir, 'index.html'));
        }
        if (fs.existsSync(indexHtml)) {
          fs.copyFileSync(indexHtml, resolve(distDir, '404.html'));
        }
      },
    },
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  base: process.env.VITE_BASE_PATH || (process.env.NODE_ENV === 'production' ? '/Evoair/' : '/'),
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        products: resolve(__dirname, 'products.html'),
        cart: resolve(__dirname, 'cart.html'),
      },
    },
  },
})
