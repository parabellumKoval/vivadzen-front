<script setup>
import { computed } from 'vue'
const { t } = useI18n()
const contacts = useContacts()
const modal = useModal()

const product = computed(() => {
  return modal.active?.data?.product || null
})

const address = computed(() => contacts.address.value || '')
const mapHtml = computed(() => {
  const raw = contacts.map.value
  if (raw && typeof raw === 'object' && 'value' in raw) {
    return raw.value
  }
  return raw || ''
})
</script>

<style src="./store-only.scss" lang="scss" scoped />

<template>
  <modal-wrapper :title="t('store_only.title')">
    <div class="store-only">
      <div class="store-only__info">
        <div class="store-only__badge">
          {{ t('store_only.badge') }}
        </div>
        <p class="store-only__text">
          {{ t('store_only.description') }}
        </p>
        <p v-if="product?.name" class="store-only__product">
          {{ product.name }}
        </p>
        <div class="store-only__address">
          <div class="store-only__label">
            {{ t('store_only.address_label') }}
          </div>
          <div class="store-only__value">
            {{ address || t('store_only.address_fallback') }}
          </div>
        </div>
      </div>
      <div class="store-only__map" v-if="mapHtml">
        <div class="store-only__label">
          {{ t('store_only.map_title') }}
        </div>
        <div class="store-only__map-frame" v-html="mapHtml"></div>
      </div>
    </div>
  </modal-wrapper>
</template>
