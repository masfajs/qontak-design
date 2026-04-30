// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: [
    '@/assets/css/pixel.css' // make sure to load pixel.css file at the very last
  ],
  postcss: {
    plugins: {
      '@mekari/pixel3-postcss': {
      }
    }
  }
})
