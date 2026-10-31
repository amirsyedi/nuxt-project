// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss', 
    '@vite-pwa/nuxt'
  ],

  app: {
    head: {
      title: 'Nuxt Project',
      meta: [
        { name: 'description', content: 'Nuxt Project' },
        { name: 'theme-color', content: '#2563eb' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/icons/icon-192.png' },
        { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/icons/icon-512.png' },
        { rel: 'apple-touch-icon', href: '/icons/apple-touch-icon.png' }
      ]
    }
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Nuxt Project',
      short_name: 'Nuxt Project',
      description: 'Nuxt Project',
      theme_color: '#2563eb',
      background_color: '#ffffff',
      display: 'standalone',
      icons: [
        { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
      ]
    }
  },

  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
      ]
    }
  },

  nitro: {
    devProxy: {
      '/api': {
        target: 'http://localhost:5000/api',
        changeOrigin: true
      }
    }
  },
})