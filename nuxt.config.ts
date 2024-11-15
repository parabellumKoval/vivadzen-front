import dynamicRoutes from './helpers/dynamicRoutes'
// import fetchCategories from './helpers/fetchCategories'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: process.env.SRC_DIR || '',
  rootDir: process.env.ROOT_DIR || '',
  devtools: { enabled: false },

  // Debug
  debug: false,

  appConfig: {},

  runtimeConfig: {
    public: {
      siteUrl: process.env.SITE_URL || 'https://djini.com.ua',
      frontendUrl: process.env.SITE_URL,
      novaposhtaKey: process.env.NOVAPOSHTA_KEY,
      apiBase: process.env.SERVER_URL + '/api',
      instagramToken: process.env.INSTAGRAM_TOKEN,
      imagesDir: '/server/uploads/images',
      noimage: '/images/noimage.png',
      staticImageProvider: process.env.STATIC_IMAGE_PROVIDER,
      appVersion: '1.0.4'
    }
  },

  imports: {
    dirs: [
      'composables',
      'composables/**'
    ]
  },
  // hooks: {
  //   async 'pages:extend' (pages) {
  //     const routes = await fetchCategories()

  //     // add a route
  //     routes.forEach((page) => {
  //       pages.push(page)
  //     })
  //   }
  // },

  app: {
    head: {
      templateParams: {
        siteName: 'Djini.com.ua',
        separator: '-'
      },

      script: [
      ],

      noscript: [
      ]
    },
  },

  css: [
    '@/assets/scss/main.scss'
  ],

  modules: [
    'nuxt-anchorscroll', 
    [
      '@nuxtjs/supabase',
      {
        redirectOptions: {
          login: '/',
          include: ['/account(/*)?']
        }
      }
    ], [
      'nuxt-icon',
      {
        class: 'icon'
      }
    ], // [
    //   '@nuxtjs/partytown',
    //   {
    //     debug: process.env.NODE_ENV === 'development',
    //     forward: ['dataLayer.push']
    //   }
    // ],
    [
      'nuxt-delay-hydration',
      {
        // mode: 'manual',
        mode: 'init',
        debug: process.env.NODE_ENV === 'development'
      }
    ],
    [
      '@nuxtjs/device',
      {
        refreshOnResize: true
      }
    ], 
    '@nuxtjs/fontaine',
    [
      '@nuxtjs/google-fonts',
      {
        families: {
          Rubik: {
            wght: [300, 400, 500, 700]
          },
        },
        display: 'swap',
        preload: true
      }
    ], [
      '@nuxt/image',
      {
        provider: process.env.IMAGE_PROVIDER || "ipx",
        
        quality: 50,

        screens: {
          mobile: 767,
          tablet: 1023,
          desktop: 1919,
        },

        domains: [
          process.env.DOMAIN,
          '*.googleusercontent.com',
          'lh3.googleusercontent.com',
          'images.prismic.io',
          '*.cdninstagram.com',
          '*.cloudinary.com'
        ],
        
        alias: {
          server: process.env.SERVER_URL
        },
        
        dir: process.env.IMAGE_DIR || "public",
        
        vercel: {
          dirname: 'public'
        },

        bunny: {
          baseURL: "https://djini-v2.b-cdn.net",
        },

        ipx: {
          domains: [
            process.env.DOMAIN,
            '*.googleusercontent.com',
            'lh3.googleusercontent.com',
            'images.prismic.io',
            '*.cdninstagram.com',
            '*.fbsbx.com'
          ]
        }
      }
    ], [
      '@pinia/nuxt',
      {
        autoImports: [
          'defineStore',
        ],
      },
    ], 
    '@pinia-plugin-persistedstate/nuxt', 
    // '@nuxtjs/i18n',
    [
      '@nuxtjs/i18n',
      {
        baseUrl: 'https://djini.com.ua',
        defaultLocale: 'uk',
        lazy: true,
        langDir: './lang',
        locales: [
          {
            iso: 'uk-UA',
            code: 'uk',
            file: 'uk.yaml',
            name: 'Українська',
            shortName: 'Укр',
            isCatchallLocale: true
          },
          {
            iso: 'ru-RU',
            code: 'ru',
            file: 'ru.yaml',
            name: 'Русский',
            shortName: 'Рус',
            isCatchallLocale: true
          }
        ]
      }
    ],
    '@nuxt/content',
    // [
    //   '@nuxt/content', 
    //   {
    //     defaultLocale: 'ru',
    //     locales: ['uk','ru'],
    //     navigation: false
    //   }
    // ],
    "@nuxtjs/seo"
  ],

  experimental: {
    renderJsonPayloads: false,
  },

  site: {
    indexable: true,
    url: 'https://djini.com.ua',
    name: 'Djini',
    description: 'Джини ☝️ интернет-магазин здорового питания.',
  },

  seo: {
    fallbackTitle: false
  },

  sitemap: {
    enabled: true,
    cacheMaxAgeSeconds: 3600,

    exclude: [
      '/account/**',
      '/confirm',
      '/reviews',
      '/auth/**'
    ],

    defaults: {
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date().toISOString(),
    },

    sources: [
      process.env.API_SERVER_URL + '/sitemap/categories',
      process.env.API_SERVER_URL + '/sitemap/products',
      process.env.API_SERVER_URL + '/sitemap/brands',
      process.env.API_SERVER_URL + '/sitemap/articles'
    ]
  },
  
  content: {
    defaultLocale: 'ru',
    locales: ['uk','ru'],
    navigation: false
  },

  schemaOrg: {
    enabled: true,
  },

  // i18n: {
  //   baseUrl: 'https://djini.com.ua',
  //   defaultLocale: 'uk',
  //   lazy: true,
  //   langDir: './lang',
  //   locales: [
  //     {
  //       iso: 'uk-UA',
  //       code: 'uk',
  //       file: 'uk.yaml',
  //       name: 'Українська',
  //       shortName: 'Укр',
  //       isCatchallLocale: true
  //     },
  //     {
  //       iso: 'ru-RU',
  //       code: 'ru',
  //       file: 'ru.yaml',
  //       name: 'Русский',
  //       shortName: 'Рус',
  //       isCatchallLocale: true
  //     }
  //   ],
  //   // precompile: {
  //   //   strictMessage: false
  //   // }
  // },

  webpack: {
    optimization: {
      minimize: true,
    }
  },
  

  nitro: {
    // routeRules: {
    //   '/': {swr: true},
    //   '/reviews/**': {isr: 60 * 30},
    //   '/blog': {isr: 60 * 30},
    //   '/blog/**': {isr: 60 * 30},
    //   '/checkout': {ssr: false, static: false, swr: false},
    //   '/checkout/**': {ssr: false, static: false, swr: false},
    //   '/account/**': {ssr: false, static: false, swr: false},
    //   // pages
    //   '/about': { prerender: true, headers: { 'Cache-Control': 'max-age=31536000, immutable' } },
    //   '/delivery': { prerender: true, headers: { 'Cache-Control': 'max-age=31536000, immutable' } },
    //   '/contacts': { prerender: true, headers: { 'Cache-Control': 'max-age=31536000, immutable' } },
    //   '/faq': { prerender: true, headers: { 'Cache-Control': 'max-age=31536000, immutable' } },
    //   '/payment': { prerender: true, headers: { 'Cache-Control': 'max-age=31536000, immutable' } },
    //   '/guarantees': { prerender: true, headers: { 'Cache-Control': 'max-age=31536000, immutable' } },
    //   '/terms': { prerender: true, headers: { 'Cache-Control': 'max-age=31536000, immutable' } },
    //   '/policy': { prerender: true, headers: { 'Cache-Control': 'max-age=31536000, immutable' } },
    //   '/returns': { prerender: true, headers: { 'Cache-Control': 'max-age=31536000, immutable' } },
    //   // api
    //   // '/api/**': {swr: true},
    //   // assets
    //   '/assets/**': { headers: { 'Cache-Control': 'max-age=31536000, immutable' } },
    //   '/images/**': { headers: { 'Cache-Control': 'max-age=31536000, immutable' } },
    //   '/_nuxt/**': { headers: { 'Cache-Control': 'max-age=31536000, immutable' } },
    //   '/**/*.js': { headers: { 'Cache-Control': 'max-age=31536000, immutable' } },
    //   '/**/*.css': { headers: { 'Cache-Control': 'max-age=31536000, immutable' } },
    //   '/**/*.json': { headers: { 'Cache-Control': 'max-age=31536000, immutable' } },
    //   '/**/*.html': { headers: { 'Cache-Control': 'max-age=31536000, immutable' } },
    //   '/**/*.xml': { headers: { 'Cache-Control': 'max-age=31536000, immutable' } },
    //   '/**/*.svg': { headers: { 'Cache-Control': 'max-age=31536000, immutable' } },
    // },
    compressPublicAssets: { 
      gzip: true, 
      brotli: true 
    },
    minify: true,
    prerender: {
      autoSubfolderIndex: true,
      concurrency: 1,
      interval: 50,
      failOnError: false,
      crawlLinks: false,
      // ignore: [],
      // routes: [],
      // retries: 2,
      retryDelay: 500
    }
  },

  compatibilityDate: '2024-08-13',
})