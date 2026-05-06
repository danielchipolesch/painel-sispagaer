import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      // Todas as chamadas /api/... são roteadas para o Quarkus.
      // O rewrite remove o prefixo /api, pois o Quarkus não o conhece.
      // API_TARGET_URL é injetada via docker-compose (server-side, não exposta ao browser).
      '/api': {
        target: process.env.API_TARGET_URL || 'http://localhost:8080',
        changeOrigin: true,
      },
    },
    watch: {
      usePolling: true,   // necessário para volumes Docker no Windows/WSL
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor:   ['vue', 'vue-router', 'pinia'],
          vuetify:  ['vuetify'],
          echarts:  ['echarts', 'vue-echarts'],
        },
      },
    },
  },
})
