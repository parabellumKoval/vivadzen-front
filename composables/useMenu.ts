export const useMenu = () => {
  const {t} = useI18n({useScope: 'global'})

  const customer = computed(() => {
    return [
      {
        id: 1,
        link: '/policy',
        title: t('title.policy')
      }, {
        id: 9,
        link: '/terms',
        title: t('title.terms')
      },{
        id: 7,
        link: '/returns',
        title: t('title.returns')
      },{
        id: 8,
        link: '/faq',
        title: t('title.qa')
      },{
        id: 2,
        link: '/guarantees',
        title: t('title.guarantees')
      },{
        id: 3,
        link: '/delivery',
        title: t('title.delivery')
      },{
        id: 4,
        link: '/payment',
        title: t('title.payment')
      }
    ]
  })

  const info = computed(() => {
    return [
      {
        id: 1,
        link: '/about',
        title: t('title.about')
      },
      {
        id: 2,
        link: '/vivapoints',
        title: t('title.vivapoints_and_rewards')
      },
      {
        id: 21,
        link: '/affiliate',
        title: t('title.affiliate_system')
      },
      {
        id: 22,
        link: '/czech-republic-kratom',
        title: t('title.czech-republic-kratom')
      },
      {
        id: 3,
        link: '/reviews/products',
        title: t('title.reviews')
      },{
        id: 4,
        link: '/brands',
        title: t('title.brands')
      },{
        id: 5,
        link: '/blog',
        title: t('title.blog')
      },
      {
        id: 7,
        link: '/contacts',
        title: t('title.contacts')
      }
    ]
  })

  const common = computed(() => {
    return [
      {
        id: 1,
        link: '/delivery',
        title: t('title.delivery')
      },{
        id: 2,
        link: '/payment',
        title: t('title.payment')
      },{
        id: 3,
        link: '/guarantees',
        title: t('title.guarantees')
      },{
        id: 4,
        link: '/returns',
        title: t('title.returns')
      },{
        id: 5,
        link: '/contacts',
        title: t('title.contacts')
      }
    ]
  })

  return {
    customer,
    info,
    common
  }
}