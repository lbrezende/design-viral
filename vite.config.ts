import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import ViteSitemap from 'vite-plugin-sitemap'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    ViteSitemap({
      hostname: 'https://designviral.vercel.app',
      dynamicRoutes: ['/motion', '/motion/biblioteca'],
      outDir: 'dist',
      changefreq: 'weekly',
      priority: 1,
      lastmod: new Date(),
      generateRobotsTxt: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve('.', './src'),
    },
  },
  server: {
    host: true,
    allowedHosts: true,
    // respeita a porta atribuída pelo runner (PORT); sem env, mantém o default 5173
    port: Number(process.env.PORT) || 5173,
  },
})
