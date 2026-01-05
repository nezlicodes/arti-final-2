// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxtjs/supabase',
    'nuxt-lodash'
  ],

  // Performance optimizations
  experimental: {
    payloadExtraction: true,
    renderJsonPayloads: true,
    viewTransition: true
  },

  // Optimization features
  optimization: {
    splitChunks: {
      layouts: true,
      pages: true,
      commons: true
    }
  },

  // Nitro optimizations
  nitro: {
    compressPublicAssets: true,
    minify: true,
    prerender: {
      // Avoid crawler causing build failures when template links to routes
      // that are not enabled in this project.
      crawlLinks: false,
      routes: ['/'],
      ignore: ['/admin']
    },
    routeRules: {
      '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      '/images/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      '/api/**': { cors: true, headers: { 'cache-control': 'public, max-age=300, s-maxage=600' } },
      '/**': { headers: { 'cache-control': 'public, max-age=3600, s-maxage=7200' } }
    }
  },

  i18n: {
    locales: [
      { code: 'fr', iso: 'fr-DZ', name: 'Français', dir: 'ltr', file: 'fr.json' },
      { code: 'ar', iso: 'ar-DZ', name: 'العربية', dir: 'rtl', file: 'ar.json' },
      { code: 'en', iso: 'en-US', name: 'English', dir: 'ltr', file: 'en.json' }
    ],
    lazy: true,
    langDir: 'locales',
    defaultLocale: 'en',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: false,
      fallbackLocale: 'en'
    },
    vueI18n: './i18n.config.ts'
  },

  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirect: false,
  },

  runtimeConfig: {
    public: {
      user: process.env.USER_ID
    }
  },

  // Image optimization
/*   image: {
    provider: 'netlify',
    domains: [`${process.env.SUPABASE_URL}/storage/v1/object/public`],
    format: ['webp'],
    quality: 85,
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536
    },
    densities: [1, 2],
    presets: {
      avatar: {
        modifiers: {
          format: 'webp',
          width: 150,
          height: 150,
          fit: 'cover',
          quality: 80
        }
      },
      thumbnail: {
        modifiers: {
          format: 'webp',
          width: 300,
          height: 200,
          fit: 'cover',
          quality: 80
        }
      },
      hero: {
        modifiers: {
          format: 'webp',
          width: 1920,
          height: 1080,
          fit: 'cover',
          quality: 85
        }
      }
    }
  }, */
 
  // Build optimization
  build: {
    transpile: ['vue-quill']
  },

  // Vite optimization
  vite: {
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['vue', 'vue-router']
          }
        }
      }
    },
    css: {
      preprocessorOptions: {
        css: {
          charset: false
        }
      }
    }
  }
})