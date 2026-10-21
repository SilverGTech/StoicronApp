import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { APP } from './src/lib/constants.ts'

/** Inyecta las constantes de la app en index.html (%APP_NAME%, etc.) */
const htmlConstants = () => ({
  name: 'html-constants',
  transformIndexHtml: (html: string) =>
    html
      .replaceAll('%APP_NAME%', APP.name)
      .replaceAll('%APP_DESCRIPTION%', APP.description)
      .replaceAll('%APP_LANG%', APP.lang)
      .replaceAll('%APP_THEME_COLOR%', APP.themeColor),
})

export default defineConfig({
  plugins: [
    react(),
    htmlConstants(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: APP.name,
        short_name: APP.shortName,
        description: APP.description,
        lang: APP.lang,
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: APP.themeColor,
        theme_color: APP.themeColor,
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Cachea todo para que funcione 100% offline
        globPatterns: ['**/*.{js,css,html,svg,png,mp3,wav}'],
        // Las fuentes de Google también quedan guardadas tras la primera carga
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
})
