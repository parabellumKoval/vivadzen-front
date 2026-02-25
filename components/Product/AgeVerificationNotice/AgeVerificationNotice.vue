<style src="./age-verification-notice.scss" lang="scss" scoped></style>

<template>
  <div class="age-verification-notice">
    <div class="age-verification-notice__icon">
      <IconCSS name="ph:shield-check" />
    </div>
    <div class="age-verification-notice__body">
      <div class="age-verification-notice__title">{{ $t('age_verification.badge') }}</div>
      <div class="age-verification-notice__text">
        {{ $t('age_verification.product_banner') }}
      </div>
    </div>
  </div>
</template>
