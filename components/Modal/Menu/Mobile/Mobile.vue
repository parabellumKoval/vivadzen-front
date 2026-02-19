<script setup>
const { $regionPath } = useNuxtApp();
const {t} = useI18n()
const { user: authUser, isAuthenticated: isLoggedIn, avatar: userAvatar } = useAuth()
const { messengers, networks } = useSocial()

// COMPUTEDS
const phones = computed(() => {
  return [
    {
      logo: '/images/logo/vodafone.png',
      value: useContacts().phone
    },{
      logo: '/images/logo/kievstar.png',
      value: useContacts().phone2
    }
  ]
})

// METHODS
// HANDLERS
const goToAccount = () => {
  navigateTo($regionPath('/account/settings'))
}

const loginHandler = () => {
  useModal().open(resolveComponent('ModalAuthSocial'), null, null)
}

const infoMenuHandler = () => {
  useModal().open(resolveComponent('ModalMenuInfo'), null, null)
}

const selectMainHandler = (index) => {
  useModal().open(resolveComponent('ModalCatalogSub'), index)
}
// WATCHERS
</script>

<style src='./mobile.scss' lang='scss' scoped></style>
<i18n src='./lang.yaml' lang='yaml'></i18n>

<template>
  <modal-wrapper class="m-wrapper">
    <div class="mm">
      
      <div v-if="isLoggedIn && authUser" class="header">
        <the-header-favorite class="header-btn"></the-header-favorite>
        <the-header-comparison class="header-btn"></the-header-comparison>
      </div>

      <div class="mm-content">

        <the-menu-catalog-main @change-selected="selectMainHandler"></the-menu-catalog-main>

        <div class="line"></div>

        <div class="menu">
          <ul class="menu-ul">
            <li>
              <NuxtLink :to="$regionPath('/catalog?selections=with_sales&selections=in_stock')" @click="closeHandler" class="menu-link menu-link-sales">
                {{ t('title.sales') }}
                <IconCSS name="iconoir:percentage" class="icon"></IconCSS>
              </NuxtLink>
            </li>
            <li v-for="item in useMenu().common.value" :key="item.id">
              <NuxtLink :to="$regionPath(item.link)" @click="closeHandler" class="menu-link">{{ item.title }}</NuxtLink>
            </li>
            <li>
              <button @click="infoMenuHandler" class="menu-link  menu-link-more">
                {{ t('all_pages') }}
                <IconCSS name="iconoir:nav-arrow-right" class="icon"></IconCSS>
              </button>
            </li>
          </ul>
        </div>

        <div class="line"></div>

        <div class="phone">
          <div class="phone-item">
            <IconCSS name="mynaui:telephone-call" class="phone-icon"></IconCSS>
            <div class="phone-value">{{ useContacts().phone }}</div>
          </div>
        </div>

        <div class="line"></div>

        <div class="social">
          <div v-if="messengers.length" class="social-group">
            <div class="social-label">{{ t('label.messengers') }}</div>
            <div class="social-items">
              <a
                v-for="messenger in messengers"
                :key="messenger.key"
                :href="messenger.link"
                :class="messenger.key + '-bg'"
                class="social-item"
              >
                <IconCSS :name="messenger.icon" class="social-icon"></IconCSS>
              </a>
            </div>
          </div>
          <div v-if="networks.length" class="social-group">
            <div class="social-label">{{ t('label.social_networks') }}</div>
            <div class="social-items">
              <a
                v-for="network in networks"
                :key="network.key"
                :href="network.link"
                :class="network.key + '-bg'"
                class="social-item"
              >
                <IconCSS :name="network.icon" class="social-icon"></IconCSS>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  </modal-wrapper>
</template>
