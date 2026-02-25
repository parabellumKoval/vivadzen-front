<script setup>
const {locale, t} = useI18n()
const { replaceInText } = usePoints()

const reviewBonus = await queryContent('review-bonus').locale(locale.value).findOne()

const bonusTitle = computed(() => replaceInText(reviewBonus?.title))
const steps = computed(() => {
  return (reviewBonus?.items ?? []).map((item) => ({
    ...item,
    text: replaceInText(item.text),
    before: replaceInText(item.before),
    highlight: replaceInText(item.highlight),
    after: replaceInText(item.after),
    button: item.button ? { ...item.button, label: replaceInText(item.button.label) } : item.button
  }))
})
</script>

<style src='./bonus.scss' lang='scss' scoped></style>

<template>
  <div>
    <div class="info-header">
      <nuxt-img
        src = "/images/viva.png"
        :provider = "useImg().provider"
        width="30"
        height="30"
        sizes = "mobile:50px"
        format = "avif"
        loading = "lazy"
        fit="outside"
        class="info-image"
      />
      <span class="info-title">{{ bonusTitle }}</span>
    </div>
    <ol class="info-list">
      <li v-for="(item, index) in steps" :key="index">
        <template v-if="item.type === 'cta'">
          <span> {{ item.text }}</span>
        </template>
        <template v-else-if="item.type === 'highlight'">
          {{ item.before }} <span class="violet-text">{{ item.highlight }}</span>{{ item.after }}
        </template>
        <template v-else-if="item.type === 'manual'">
          <NuxtLink :to="$regionPath(item.button.link)" class="text-link"><span>{{ item.button.label }}</span></NuxtLink>
          {{ item.text }}
        </template>
        <template v-else>
          {{ item.text }}
        </template>
      </li>
    </ol>
  </div>
</template>
