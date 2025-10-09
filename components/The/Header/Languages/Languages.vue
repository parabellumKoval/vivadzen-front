<script setup>

const { locale, locales, t } = useI18n()

const switchLocalePath = useSwitchLocalePath()

const props = defineProps({
  isActive: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'select'
])

const switchHandler = (item) => {
  const newLocale = switchLocalePath(item.code)
  navigateTo(newLocale)
  useModal().close()
  emit('select')
}

const openModalHandler = (event) => {
  const component = defineAsyncComponent(() => import('~/components/Modal/Region/Region.vue'))
  useModal().open(component, null, null)
}
</script>

<style src="./languages.scss" lang="scss" scoped />

<template>
  <div>
    <button @click="openModalHandler" class="btn" type="button" clickable>>
      Change
    </button>
    <!-- <span
      v-for="locale in locales"
      :key="locale.code"
      :class="{active: locale === locale.code}"
      class="languages-btn-item"
      clickable
    >
      <nuxt-link :to="switchLocalePath(locale.code)" :aria-label="locale.name" class="languages-btn-link" clickable>
        {{ locale.shortName }}
      </nuxt-link>
    </span> -->
  </div> 
</template>