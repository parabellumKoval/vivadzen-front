<script setup>
import { useAuthStore } from '~~/store/auth';

const localePath = useLocalePath()
const {t} = useI18n()

// COMPUTEDS
const menu = computed(() => {
  return {
    customer: useMenu().customer.value,
    info: useMenu().info.value
  }
})


// METHODS
// HANDLERS

const closeHandler = () => {
  useModal().close()
}

const backHandler = () => {
  useModal().open(resolveComponent('ModalMenuMobile'), null, null)
}
// WATCHERS
</script>

<style src='./info.scss' lang='scss' scoped></style>
<i18n src='./lang.yaml' lang='yaml'></i18n>

<template>
  <modal-wrapper class="m-wrapper">
    <div class="mm">
      
      <div class="header">
        <button @click="backHandler" class="back">
          <span class="back-btn">
            <IconCSS name="iconoir:nav-arrow-left" class="icon"></IconCSS>
          </span>
          <span class="back-text">{{ t('button.back') }}</span>
        </button>
      </div>

      <div class="content">

        <div class="menu menu-2">
          <div class="menu-label">{{ t('label.common_info') }}</div>
          <ul class="menu-ul">
            <li v-for="item in menu.info" :key="item.id">
              <NuxtLink :to="localePath(item.link)" @click="closeHandler" class="menu-link">{{ item.title }}</NuxtLink>
            </li>
          </ul>
        </div>

        <div class="menu menu-1">
          <div class="menu-label">{{ t('label.guide') }}</div>
          <ul class="menu-ul">
            <li v-for="item in menu.customer" :key="item.id">
              <NuxtLink :to="localePath(item.link)" @click="closeHandler" class="menu-link">{{ item.title }}</NuxtLink>
            </li>
          </ul>
        </div>

      </div>
    </div>
  </modal-wrapper>
</template>