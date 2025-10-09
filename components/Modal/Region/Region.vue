<script setup>

import {useRegionStore} from '~/store/region'

const { locale, locales, setLocale, t } = useI18n()
const region = useRegionStore().region

const switchLocalePath = useSwitchLocalePath()

const availableLocales = computed(() => {
  return locales.value.filter(i => i.code !== locale.value)
})

const availableRegions = [
  { code: '', name: 'Global' },
  { code: 'ua', name: 'Ukraine' },
  { code: 'de', name: 'Germany' },
  { code: 'cz', name: 'Czechia' },
  { code: 'es', name: 'Spain' },
]


</script>

<style src="./region.scss" lang="scss" scoped />
<!-- <i18n src="./lang.yaml" lang="yaml"></i18n> -->

<template>
  <modal-wrapper :title="t('title.contacts')">
    <div class="regions">
      <div>
        Язык:
        <button v-for="locale in availableLocales" :key="locale.code" @click.prevent.stop="setLocale(locale.code)" style="display: block;">
          {{ locale.name }}
        </button>

        Регион:
        <NuxtLink v-for="region in availableRegions" :key="region.code" :to='useRegion().currentUrl(region.code)' style="display: block;">
          {{ region.name }}
        </NuxtLink>
      </div>
    </div>
  </modal-wrapper>
</template>