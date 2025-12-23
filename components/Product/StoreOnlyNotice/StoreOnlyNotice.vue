<script setup>
defineEmits(['action'])
</script>

<style src="./store-only-notice.scss" lang="scss" scoped></style>

<template>
  <div class="store-only-notice">
    <div class="store-only-notice__icon">
      <IconCSS name="ph:storefront" />
    </div>
    <div class="store-only-notice__body">
      <div class="store-only-notice__title">{{ $t('store_only.badge') }}</div>
      <div class="store-only-notice__text">
        {{ $t('store_only.banner') }}
      </div>
    </div>
    <button class="button color-primary store-only-notice__btn" @click="$emit('action')">
      {{ $t('store_only.button') }}
    </button>
  </div>
</template>
