<script setup>
import { computed } from 'vue'
const { t } = useI18n()
const contacts = useContacts()
const modal = useModal()

const product = computed(() => {
  return modal.active?.data?.product || null
})

const pickupLocations = computed(() => contacts.pickupLocations.value || [])
const mapLocations = computed(() => contacts.mapLocations.value || [])
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
          <div class="store-only__value store-only__locations">
            <template v-if="pickupLocations.length">
              <div
                v-for="location in pickupLocations"
                :key="location.id"
                class="store-only__location"
              >
                <div v-if="location.title" class="store-only__location-title">{{ location.title }}</div>
                <div>{{ location.address }}</div>
                <div v-if="location.schedule" class="store-only__location-schedule">{{ location.schedule }}</div>
              </div>
            </template>
            <template v-else>
              {{ t('store_only.address_fallback') }}
            </template>
          </div>
        </div>
      </div>
      <div v-if="mapLocations.length" class="store-only__maps">
        <div
          v-for="location in mapLocations"
          :key="`store-map-${location.id}`"
          class="store-only__map"
        >
          <div class="store-only__label">
            {{ location.title || location.address }}
          </div>
          <div v-if="location.title" class="store-only__map-caption">{{ location.address }}</div>
          <div v-if="location.schedule" class="store-only__map-caption">{{ location.schedule }}</div>
          <div class="store-only__map-frame" v-html="location.map"></div>
        </div>
      </div>
    </div>
  </modal-wrapper>
</template>
