// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/ui-pro', '@nuxtjs/mdc', '@tailwindcss/typography', '@pinia/nuxt', "@nuxt/content"],
  ui: {
    fonts: false
  },
  runtimeConfig: {
    dsApikey: {
      official: '',
      huawei: ''
    }
  },
  mdc: {
    highlight: {
      langs: ['java', 'js', 'ts', 'vue', 'css', 'html'],
    },
  },
  devServer: {
    // host: '0.0.0.0',
    port: 3000,
  }
})
