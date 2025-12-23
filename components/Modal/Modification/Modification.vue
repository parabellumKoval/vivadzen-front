<script setup>
import { useStoreOnly } from '~/composables/useStoreOnly'
const {t} = useI18n()


// COMPUTEDS
const item = computed(() => {
  return useModal().active.data
})

const {toCartHandler} = useCart()
const {photos} = useCard(item.value)
const { isStoreOnly, openStoreOnlyModal } = useStoreOnly(item)

const photoSrc = computed(() => {
  return photos?.value[0]? photos?.value[0].src: null
})

const resolveStoreOnly = (modification) => {
  if (modification && typeof modification === 'object') {
    return Boolean(modification.storeOnly ?? modification.store_only ?? modification.store_only_flag)
  }
  return isStoreOnly.value
}
</script>

<style src="./modification.scss" lang="scss" scoped />
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <modal-wrapper :title="t('title')">
    <div class="modifications-wrapper">

      <div class="product">
        <nuxt-img
          :src = "photoSrc"
          width="200"
          height="200"
          sizes = "mobile:200px"
          quality = "50"
          fit="outside"
          :placeholder="useImg().noImage"
          class="product-image"
        ></nuxt-img>
        <span class="product-name">{{ item.name }}</span>
      </div>
      
      <div v-if="item.modifications?.length" class="modifications">
        <template v-for="(modification, modIndex) in item.modifications" :key="modification.id">
          <div v-if="modification.inStock" class="modifications-item">
            <div class="name">
              {{ modification.short_name }}
            </div>
            <div class="line"></div>
            <div class="price-box">
              <span v-if="modification.sale" class="price-sale">-{{ modification.sale }}%</span>
              <simple-price :value="modification.price" :class="{sale: modification.sale}" class="price-value" ></simple-price>
            </div>
            <button
              v-if="!resolveStoreOnly(modification)"
              @click="() => toCartHandler(1, modification)"
              type="button"
              class="button primary small buy-btn"
            >
              <IconCSS name="ci:shopping-cart-01" class="buy-btn-icon"></IconCSS>
            </button>
            <button
              v-else
              @click="() => openStoreOnlyModal(modification)"
              type="button"
              class="button color-primary small buy-btn store-only-btn"
              :aria-label="t('store_only.button')"
              :title="t('store_only.button')"
            >
              <IconCSS name="ci:map-pin" class="buy-btn-icon"></IconCSS>
            </button>
          </div>
        </template>
      </div>
    </div>
  </modal-wrapper>
</template>
