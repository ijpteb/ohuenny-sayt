import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Папка assets/ — «публичная»: всё, что в неё положено, отдаётся как есть
// (assets/models/console.glb → ./models/console.glb). Собранный код Vite кладёт в dist/static,
// чтобы не путать со своими файлами.
export default defineConfig({
  base: './',
  publicDir: 'assets',
  plugins: [react()],
  build: { assetsDir: 'static', chunkSizeWarningLimit: 2000 },
  server: { port: 5173 },
})
