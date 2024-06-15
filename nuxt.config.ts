import dynamicRoutes from './helpers/dynamicRoutes'
// import fetchCategories from './helpers/fetchCategories'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // alias: {
  //   "~": "/<srcDir>",
  //   "@": "/<srcDir>",
  //   "~~": "/<rootDir>",
  //   "~/assets": "/<srcDir>/assets",
  // },
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
      instagramToken: process.env.INSTAGRAM_TOKEN
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
    // pageTransition: { name: 'page-tr', mode: 'out-in' },
    // layoutTransition: { name: 'layout-tr', mode: 'out-in' },
    head: {
      script: [
        // {
        //   type: 'text/partytown',
        //   innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        //   new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        //   j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        //   'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        //   })(window,document,'script','dataLayer','${process.env.GTM}');`
        // }
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
    '@nuxtjs/prismic',
    {
      endpoint: 'https://all-be-ukraine.cdn.prismic.io/api/v2',
      preview: false,
      toolbar: false
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
      mode: 'manual',
      debug: process.env.NODE_ENV === 'development'
    }
  ],
  [
    '@nuxtjs/device',
    {
      refreshOnResize: true
    }
  ], // '@nuxtjs/fontaine',
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
        '*.cdninstagram.com'
      ],
      
      alias: {
        server: process.env.SERVER_URL
      },
      
      dir: process.env.IMAGE_DIR || "public",
      
      vercel: {
        dirname: 'public'
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
  ], '@pinia-plugin-persistedstate/nuxt', '@nuxtjs/i18n', // '@vueuse/nuxt',
  [
    '@nuxt/content', 
    {
      defaultLocale: 'ru',
      locales: ['uk','ru']
    }
  ], "@nuxtjs/seo"],

  experimental: {
    renderJsonPayloads: false,
  },

  sitemap: {
    enabled: true,
    exclude: [
        '/account/**'
    ],
    defaults: {
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date().toISOString(),
    },
    urls: dynamicRoutes
  }, 
  schemaOrg: {
    enabled: true,
  },
  i18n: {
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
      },
      {
        iso: 'ru-RU',
        code: 'ru',
        file: 'ru.yaml',
        name: 'Русский',
        shortName: 'Рус',
      }
    ]
  },

  nitro: {
    routeRules: {
      '': { isr: 60 * 30},
      '/**': { isr: 60 * 30},
      '/catalog': { isr: 60 * 30},
      '/vitaminy_i_mineraly': { isr: 60 * 30},
      // '/brands': { isr: 60 * 30},
      // '/brands/**': { isr: 60 * 30},
      // '/reviews/**': { isr: 60 * 30},
      // '/blog': { isr: 60 * 30},
      // '/blog/**': { isr: 60 * 30},
      '/checkout': { ssr: false, static: false, swr: false },
      '/checkout/**': { ssr: false, static: false, swr: false },
      '/account/**': { ssr: false, static: false, swr: false },
      // pages
      '/about': { prerender: true, headers: { 'Cache-Control': 'max-age=31536000, immutable' } },
      '/delivery': { prerender: true, headers: { 'Cache-Control': 'max-age=31536000, immutable' } },
      '/contacts': { prerender: true, headers: { 'Cache-Control': 'max-age=31536000, immutable' } },
      '/faq': { prerender: true, headers: { 'Cache-Control': 'max-age=31536000, immutable' } },
      '/payment': { prerender: true, headers: { 'Cache-Control': 'max-age=31536000, immutable' } },
      '/guarantees': { prerender: true, headers: { 'Cache-Control': 'max-age=31536000, immutable' } },
      '/terms': { prerender: true, headers: { 'Cache-Control': 'max-age=31536000, immutable' } },
      '/policy': { prerender: true, headers: { 'Cache-Control': 'max-age=31536000, immutable' } },
      '/returns': { prerender: true, headers: { 'Cache-Control': 'max-age=31536000, immutable' } },
      // api
      // '/api/**': { swr: false, prerender: false },
      // assets
      '/assets/**': { headers: { 'Cache-Control': 'max-age=31536000, immutable' } },
      '/images/**': { headers: { 'Cache-Control': 'max-age=31536000, immutable' } },
      '/_nuxt/**': { headers: { 'Cache-Control': 'max-age=31536000, immutable' } },
      '/**/*.js': { headers: { 'Cache-Control': 'max-age=31536000, immutable' } },
      '/**/*.css': { headers: { 'Cache-Control': 'max-age=31536000, immutable' } },
      '/**/*.json': { headers: { 'Cache-Control': 'max-age=31536000, immutable' } },
      '/**/*.html': { headers: { 'Cache-Control': 'max-age=31536000, immutable' } },
      '/**/*.xml': { headers: { 'Cache-Control': 'max-age=31536000, immutable' } },
      '/**/*.svg': { headers: { 'Cache-Control': 'max-age=31536000, immutable' } },
    },
    compressPublicAssets: { 
      gzip: true, 
      brotli: true 
    },
    // publicAssets: [
    //   {
    //     baseURL: "images",
    //     dir: "public/images",
    //     maxAge: 60 * 60 * 24 * 7, // 7 days
    //   },
    // ],
    minify: true,
    prerender: {
      autoSubfolderIndex: true,
      concurrency: 1,
      interval: 50,
      failOnError: false,
      crawlLinks: true,
      // ignore: [],
      // routes: [],
      retries: 2,
      retryDelay: 500
    }
  },
})