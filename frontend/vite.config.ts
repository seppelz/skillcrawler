import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  server: {
    headers: {
      'Content-Security-Policy': "default-src 'self'; connect-src 'self' http://localhost:8000 http://127.0.0.1:8000 https://localhost:8000 https://127.0.0.1:8000 http://localhost:5173 http://127.0.0.1:* https://*.googlevideo.com https://*.youtube.com https://www.google-analytics.com https://analytics.google.com https://play.google.com https://www.recaptcha.net https://www.gstatic.com https://*.ingest.sentry.io https://api.segment.io https://csp.withgoogle.com; frame-src 'self' https://www.youtube.com https://youtube.com; img-src 'self' https://*.ytimg.com https://*.youtube.com data:; media-src 'self' blob: https://*.googlevideo.com https://*.youtube.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://s.ytimg.com; style-src 'self' 'unsafe-inline';"
    },
  }
})
