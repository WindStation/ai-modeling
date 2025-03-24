// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/ui-pro', '@nuxtjs/mdc', '@tailwindcss/typography', '@pinia/nuxt'],
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
      langs: ['java']
    },
  }
})
