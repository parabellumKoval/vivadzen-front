<script setup>
import { useAuthStore } from '~~/store/auth';

const localePath = useLocalePath()
const {t} = useI18n()

// COMPUTEDS
const user = computed(() => {
  return useAuthStore().user
})

const auth = computed(() => {
  return useAuthStore().auth
})

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
  closeHandler()
  navigateTo(localePath('/account/settings'))
}

const closeHandler = () => {
  useModal().close()
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
      
      <div class="header">
        <!-- User -->
        
        <template v-if="auth && user" >
          <button @click="goToAccount" class="avatar" type="button" clickable>
            <nuxt-img
              :src="useAuthStore().avatar"
              width="50"
              height="50"
              sizes = "mobile:30px tablet:30px desktop:30px"
              format = "avif"
              fit = "cover"
              quality = "100"
              class = "avatar-image"
            />
          </button>
          <button @click="goToAccount" class="header-btn">
            <span class="header-btn-name">{{ user.email }}</span>
            <span class="header-btn-label">{{ t('dashboard') }}</span>
          </button>
        </template>
        <template v-else>
          <div @click="loginHandler" class="avatar-faker">
            <IconCSS name="iconoir:user" size="24"></IconCSS>
          </div>
          <button @click="loginHandler" class="header-btn">{{ t('login_or_register') }}</button>
        </template>
        
        <!-- Languages -->
        <div class="langs">
          <span class="langs-label">{{ t('label.lang') }}</span>
          <the-header-languages class="langs-switcher"></the-header-languages>
        </div>

      </div>

      <div class="mm-content">

        <the-menu-catalog-main @change-selected="selectMainHandler"></the-menu-catalog-main>

        <div class="line"></div>

        <div class="menu">
          <ul class="menu-ul">
            <li>
              <NuxtLink :to="localePath('/catalog?selections=with_sales&selections=in_stock')" @click="closeHandler" class="menu-link menu-link-sales">
                {{ t('title.sales') }}
                <IconCSS name="iconoir:percentage" class="icon"></IconCSS>
              </NuxtLink>
            </li>
            <li v-for="item in useMenu().common.value" :key="item.id">
              <NuxtLink :to="localePath(item.link)" @click="closeHandler" class="menu-link">{{ item.title }}</NuxtLink>
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
          <div v-for="(phone, index) in phones" :key="index" class="phone-item">
            <nuxt-img
              :src = "phone.logo"
              width="24"
              height="24"
              sizes = "mobile:24px"
              format = "avif"
              quality = "30"
              loading = "lazy"
              fit="outside"
              class="phone-logo"
            />
            <div class="phone-value">{{ phone.value }}</div>
          </div>
        </div>

        <div class="line"></div>

        <div class="social">
          <div class="social-items">
            <a
              v-for="network in useSocial().networks"
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
  </modal-wrapper>
</template>