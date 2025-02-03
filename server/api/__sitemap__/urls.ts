import fetch from 'node-fetch'

export default defineSitemapEventHandler(async () => {
  
  const getStaticRoutes = () => {
    const base = [
      '/',
      '/o-nas',
      '/payment',
      '/delivery',
      '/guarantees',
      '/articles',
      '/contacts',
      '/policy',
      '/terms',
      '/shop',
    ]

    const routes = [
      ...base.map((item) => {
        return {
          url: item,
          lastmod: new Date().toISOString(),
          changefreq: 'daily',
          priority: 0.8,
        }
      }),
      ...base.map((item) => {
        return {
          url: '/ru' + item,
          lastmod: new Date().toISOString(),
          changefreq: 'daily',
          priority: 0.8,
        }
      })
    ]

    return routes
  }

  const fetchProducts = async () => {
    const response = await fetch(`${process.env.API_SERVER_URL}/product?per_page=5000`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const {data: products} = await response.json();

    const routes = [
      ...products.map((item) => {
        return {
          url: '/ru/' + item.slug,
          lastmod: new Date().toISOString(),
          changefreq: 'daily',
          priority: 0.8,
        }
      }),
      ...products.map((item) => {
        return {
          url: '/' + item.slug,
          lastmod: new Date().toISOString(),
          changefreq: 'daily',
          priority: 0.8,
        }
      })
    ]
    
    return routes
  }

  const fetchCategories = async () => {
    const response = await fetch(`${process.env.API_SERVER_URL}/category?per_page=5000`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const {data: categories} = await response.json();

    const routes = [
      ...categories.map((item) => {
        return {
          url: '/ru/' + item.slug,
          lastmod: new Date().toISOString(),
          changefreq: 'daily',
          priority: 0.8,
        }
      }),
      ...categories.map((item) => {
        return {
          url: '/' + item.slug,
          lastmod: new Date().toISOString(),
          changefreq: 'daily',
          priority: 0.8,
        }
      })
    ]
    
    return routes
  }

  return [
    // ...(await fetchProducts()),
    ...(await fetchCategories()),
    ...getStaticRoutes()
  ]
})