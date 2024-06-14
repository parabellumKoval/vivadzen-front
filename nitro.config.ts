export default defineNitroConfig({
  preset: 'node-server',
  
  compressPublicAssets: { 
    gzip: true, 
    brotli: true 
  },

  minify: true,

  // prerender: {
  //   crawlLinks: true
  // },

  routeRules: {
    '/**': { isr: 60 * 30},
    '/catalog': { isr: 60 * 30},
    '/brands': { isr: 60 * 30},
    '/brands/**': { isr: 60 * 30},
    '/reviews/**': { isr: 60 * 30},
    '/blog': { isr: 60 * 30},
    '/blog/**': { isr: 60 * 30},
    '/account/**': { ssr: false, static: false, swr: false },
    // pages
    '/about': { prerender: true, headers: { 'Cache-Control': 'max-age=31536000, immutable' } },
    '/delivery': { prerender: true, headers: { 'Cache-Control': 'max-age=31536000, immutable' } },
    '/contacts': { prerender: true, headers: { 'Cache-Control': 'max-age=31536000, immutable' } },
    '/faq': { prerender: true, headers: { 'Cache-Control': 'max-age=31536000, immutable' } },
    '/payment': { prerender: true, headers: { 'Cache-Control': 'max-age=31536000, immutable' } },
    '/quarantees': { prerender: true, headers: { 'Cache-Control': 'max-age=31536000, immutable' } },
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
})