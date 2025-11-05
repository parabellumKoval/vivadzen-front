// import dynamicRoutes from './helpers/dynamicRoutes'
// import fetchCategories from './helpers/fetchCategories'
import path from 'path'


// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: process.env.SRC_DIR || '',
  rootDir: process.env.ROOT_DIR || '',
  devtools: { enabled: true },
  logLevel: 'verbose', 

  // Debug
  debug: process.env.NODE_ENV === 'development'? true: false,

  appConfig: {},

  runtimeConfig: {
    public: {
      site: {
        url: process.env.SITE_URL || 'https://new.vivadzen.com'
      },
      siteUrl: process.env.SITE_URL || 'https://new.vivadzen.com',
      frontendUrl: process.env.SITE_URL,
      novaposhtaKey: process.env.NOVAPOSHTA_KEY,
      serverBase: process.env.SERVER_URL,
      apiBase: process.env.SERVER_URL + '/api',
      instagramToken: process.env.INSTAGRAM_TOKEN,
      imagesDir: '/server/uploads/images',
      noimage: '/images/noimage.png',
      noimagegray: '/images/noimagegray.png',
      staticImageProvider: process.env.STATIC_IMAGE_PROVIDER,
      appVersion: '1.0.6',
      i18n: {
        locales: ['uk', 'ru']
      }
    }
  },

  imports: {
    // autoImport: false,
    dirs: [
      'composables',
      'composables/product',
      'composables/review',
      'composables/form',
      'composables/fakers',
      'composables/mockups'
      // 'composables/**'
    ]
  },

  app: {
    head: {
      templateParams: {
        siteName: 'Vivadzen.com',
        separator: '-'
      },

      script: [
        // {
        //   type: 'text/partytown',
        //   innerHTML: `(function(c,l,a,r,i,t,y){
        //     c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        //     t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        //     y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        //   })(window, document, "clarity", "script", "r9p9918va4");`
        // },
        // {
        //   type: 'text/partytown',
        //   src: '//script.crazyegg.com/pages/scripts/0129/2992.js',
        //   async: true
        // },

//         {
//           type: 'text/javascript',
//           innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
// new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
// j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
// 'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
// })(window,document,'script','dataLayer','${process.env.GTM}');`
//         },
      ],

      noscript: [
        // {
        //   tagPosition: 'bodyOpen',
        //   innerHTML: `<iframe src="https://www.googletagmanager.com/ns.html?id=${process.env.GTM}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`
        // }
      ]
    },
  },

  css: [
    '@/assets/scss/main.scss'
  ],

  vite: {
    resolve: {
      alias: {
        'lang': path.resolve(__dirname, './lang')
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "@/assets/scss/vars" as *;
            @use "@/assets/scss/mixins" as *;
          `
        }
      }
    },
    server: {
      fs: {
        strict: true,
        // Разрешаем только корень проекта и, при необходимости, конкретные пакеты
        allow: [process.cwd()],
      },
      watch: {
        // Игнорим тяжёлые каталоги
        ignored: [
          '**/.git/**',
          '**/.nuxt/**',
          '**/dist/**',
          '**/node_modules/**',
          '**/coverage/**',
          '**/.turbo/**',
          '**/.next/**',
          '**/*.log'
        ],
      },
    },
    // На всякий случай запретим vite идти «выше»
    resolve: { preserveSymlinks: false },
  },

  modules: [['./modules/auth-bridge', {
    tokenCookieName: 'auth_token',
    endpoints: {
      me: '/auth/me',
      login: '/auth/login',
      logout: '/auth/logout',
      register: '/auth/register',
      forgot: '/auth/password/forgot',
      reset: '/auth/password/reset',
      resendLoggedIn: '/auth/email/verification-notification',
      resendByEmail: '/auth/email/resend',
      changePassword: '/auth/password/change',
      profileUpdate: '/profile/update',
      profileEmailChange: '/auth/email/change',
      socialUrl: '/auth/oauth/:provider/url',
      validateReferralCode: '/auth/referral/validate/:code',
      referrals: '/auth/referral/all'
    },
    heartbeat: { enabled: true, intervalMs: 300000 },
  }], './modules/settings', './modules/regions', './modules/converter', './modules/category', './modules/fetcher', // 'nuxt-gtag',
  '~/modules/snap-carousel', // '@zadigetvoltaire/nuxt-gtm',
  '~/modules/packeta', 'nuxt-anchorscroll', [
      'nuxt-icon',
      {
        class: 'icon'
      }
  ], [
    'nuxt-delay-hydration',
    {
      // mode: 'manual',
      mode: 'init',
      debug: process.env.NODE_ENV === 'development'
    }
  ], [
    '@nuxtjs/device',
    {
      refreshOnResize: true
    }
  ], '@nuxtjs/fontaine', [
    '@nuxtjs/google-fonts',
    {
      families: {
        Rubik: {
          wght: [300, 400, 500, 700]
        },
        Onest: {
          wght: [400, 500, 600, 700, 900]
        },
        'Alegreya Sans': {
          wght: [400, 500, 700, 900]
        },
      },
      display: 'swap',
      preload: true,
      preconnect: true,
      subsets: ['latin', 'cyrillic']
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
          xl: 2540,
        },

        domains: [
          process.env.DOMAIN,
          "*.vivadzen.com",
          "localhost:8000",
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
          baseURL: "https://vivadzen-v2.b-cdn.net",
        },

        ipx: {
          domains: [
            process.env.DOMAIN,
            "*.vivadzen.com",
            "localhost:8000",
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
    ], // "@nuxtjs/seo", 
  '@nuxtjs/i18n', '@nuxt/content', 'nuxt-schema-org', '@nuxtjs/sitemap', '@nuxtjs/robots', '@nuxtjs/seo'],

  experimental: {
    renderJsonPayloads: false,
    appManifest: false
  },
  
  // checkOutdatedBuildInterval: false,
  
  packeta: {
    widgetApiKey: process.env.PACKETA_WIDGET_API_KEY,
    language: 'en',
    defaultCountry: 'CZ',
    carriers: ['packeta']
  },

  // /api/_fetcher/{endpointKey}/refresh 
  fetcherModule: {
      enableTtl: false,
      ttlSec: 600,
      languages: ['uk', 'ru', 'cs', 'de', 'es'],
      regions: ['zz', 'ua', 'cz', 'de', 'es'],
      endpoints: [
        {
          key: 'homepage-product-reviews',
          endpoint: '/review/relation',
          query: {
            per_page: 3,
            reviewable_type: 'App\\Models\\Product'
          },
          dependsOnLocale: true,
          dependsOnRegion: true
        },
        {
          key: 'homepage-shop-reviews',
          endpoint: '/review/relation',
          query: {
            per_page: 3
          },
          dependsOnLocale: true,
          dependsOnRegion: true
        },
        {
          key: 'homepage-main-lists',
          endpoint: '/lists/main',
          dependsOnLocale: true,
          dependsOnRegion: true
        },
        {
          key: 'homepage-main-articles',
          endpoint: 'articles/grouped-by-tags',
          query: {
            per_tag: 5,
            tag_id:  {0: 1, 1:2}
          },
          dependsOnLocale: true,
          dependsOnRegion: true
        },
        {
          key: 'homepage-video-reviews',
          endpoint: 'review/relation',
          query: {
            video: 1,
            per_page:  4
          },
          dependsOnLocale: true,
          dependsOnRegion: true
        }
      ]
  },

  snapCarousel: {
    screens: {
      mobile: 0,
      tablet: 768,
      desktop: 1024,
      ld: 1441,
      xld: 1920
    },
    defaults: {
      mode: 'page',         // 'page' | 'item'
      loop: true,
      gap: 16,
      showArrows: true,
      showDots: true,
      snapStop: 'normal',
      itemsPerPage: { mobile: 2, tablet: 4, desktop: 5, ld: 6, xld: 7 }
    }
  },

  categoryModule: {
    slugsEndpoint: '/company-category/slugs-simple',
    detailsEndpoint: '/category_cached/:slug',
    listEndpoint: '/category',
    enableTtl: false,
    ttlSec: 600,
    languages: ['uk', 'ru', 'en', 'cs', 'de', 'es'],
    regions: ['zz', 'ua', 'cz', 'de', 'es'],
    slugsRoutePath: '/api/_categories/slugs',
    categoryRoutePath: '/api/_categories/:slug',
    listRoutePath: '/api/_categories/list',
    refreshSlugsRoutePath: '/api/_categories/refresh/slugs',
    refreshAllRoutePath: '/api/_categories/refresh/all',
    refreshSingleRoutePath: '/api/_categories/refresh/:slug',
    refreshListRoutePath: '/api/_categories/refresh/list'
  },

  settingsModule: {
    apiUrl: process.env.SERVER_URL + '/api/settings/nested',
    enableTtl: false,
    ttlSec: 300, // TTL кэша в секундах
    refreshRoutePath: '/api/_refresh-settings', // POST для принудительного обновления
    regions: ['ua', 'cz', 'de', 'es'],
    locales: ['uk','ru','cs','de','en','es']
  },

  converterModule: {
    ttlSec: 300,
    ratesEndpoint: '/points/rates',
    apiRoutePath: '/api/_converter/rates',
    refreshRoutePath: '/api/_converter/refresh',
  },

  regionsModule: {
    regions: {
      global: { name: 'Global', locale: 'en', currency: 'USD', flagClass: 'emojione:globe-showing-europe-africa'},
      ua: { name: 'Ukraine', locale: 'uk', currency: 'UAH', flagClass: 'emojione:flag-for-ukraine'},
      cz: { name: 'Czechia', locale: 'cs', currency: 'CZK', flagClass: 'emojione:flag-for-czechia'},
      de: { name: 'Germany', locale: 'de', currency: 'EUR', flagClass: 'emojione:flag-for-germany'},
      es: { name: 'Spain', locale: 'es', currency: 'EUR', flagClass: 'emojione:flag-for-spain'}
    },
    regionAliases: {
      global: 'zz'
    },
    fallbackRegion: 'global',
    fallbackCurrency: 'USD'
  },

  site: {
    indexable: true,
    url: 'https://new.vivadzen.com',
    name: 'Vivadzen',
    description: 'Vivadzen desc',
  },

  seo: {
    fallbackTitle: false
  },
  
  // gtm: {
  //   id: process.env.GTM,
  //   defer: true,
  //   compatibility: true, 
  // },

  // gtag: {
  //   id: process.env.GTAG,
  //   initCommands: [
  //     // Setup up consent mode
  //     ['consent', 'default', {
  //       ad_user_data: 'granted',
  //       ad_personalization: 'granted',
  //       ad_storage: 'granted',
  //       analytics_storage: 'granted',
  //     }]
  //   ]
  // },
  
  i18n: {
    baseUrl: 'https://new.vivadzen.com',
    defaultLocale: 'uk',
    lazy: true,
    strategy: 'no_prefix',
    langDir: '../lang',
    vueI18n: '../i18n.config.ts',
    detectBrowserLanguage: false,
    locales: [
      {
        iso: 'ru-RU',
        code: 'ru',
        file: 'ru.yaml',
        name: 'Русский',
        shortName: 'Рус',
      },
      {
        iso: 'uk-UA',
        code: 'uk',
        file: 'uk.yaml',
        name: 'Українська',
        shortName: 'Укр',
        isCatchallLocale: true
      },{
        iso: 'en-US',
        code: 'en',
        file: 'en.yaml',
        name: 'English',
        isCatchallLocale: true
      },{
        iso: 'cs-CZ',
        code: 'cs',
        file: 'cs.yaml',
        name: 'Čeština',
      }, {
        iso: 'de-DE',
        code: 'de',
        file: 'de.yaml',
        name: 'Deutsch',
      },{
        iso: 'es-ES',
        code: 'es',
        file: 'es.yaml',
        name: 'Spain',
      }
    ],
    experimental: {
      autoImportTranslationFunctions: true
    }
  },

  robots: {
    autoI18n: false,
    disableNuxtContentIntegration: true,
    disallow: ['/_ipx', '/.well-known']
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
      process.env.API_SERVER_URL + '/sitemap/regions',
      process.env.API_SERVER_URL + '/sitemap/products',
      process.env.API_SERVER_URL + '/sitemap/brands',
      process.env.API_SERVER_URL + '/sitemap/articles'
    ]
  },

  schemaOrg: {
    enabled: true,
  },
  
  content: {
    defaultLocale: 'ru',
    locales: ['uk','ru','en','cs','de','es'],
    navigation: false
  },

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

  compatibilityDate: '2025-07-12',
})