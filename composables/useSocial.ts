export const useSocial = () => {
  const {get} = useSettings()

  const messengers = computed(() =>  {
    return [
      {
        id: 1,
        link: get('site.contacts.social.telegram'),
        key: 'telegram',
        name: 'Telegram',
        icon: 'ph:telegram-logo',
      },{
        id: 2,
        link: get('site.contacts.social.viber'),
        key: 'viber',
        name: 'Viber',
        icon: 'la:viber',
      },{
        id: 3,
        link: get('site.contacts.social.whatsapp'),
        key: 'whatsapp',
        name: 'Whatsapp',
        icon: 'ph:whatsapp-logo',
      }
    ];
  });

  const networks = computed(() =>  {
    return [
      {
        id: 5,
        link: get('site.contacts.social.instagram'),
        key: 'instagram',
        name: 'Instagram',
        icon: 'iconoir:instagram',
      }
    ];
  });

  const all = [
      ...messengers.value,
      ...networks.value,
    ]

  return {
    all,
    messengers,
    networks
  }
}