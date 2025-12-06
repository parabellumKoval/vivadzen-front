<script setup>
const {locale, t} = useI18n()

const reviewBonus = await queryContent('review-bonus').locale(locale.value).findOne()

const bonusTitle = reviewBonus?.title
const steps = reviewBonus?.items ?? []
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
