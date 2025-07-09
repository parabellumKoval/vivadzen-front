<script setup>
import {useCartStore} from '~/store/cart'
import {useCard} from '~/composables/product/useCard.ts'

const { t } = useI18n()
const localePath = useLocalePath()

const props = defineProps({
  item: {
    type: Object
  }
})


const {photo, photoAlt, photoTitle, photoSize} = useCard(props.item)

const deleteHandler = () => {
  useCartStore().remove(props.item.id)
  useNoty().setNoty({
    content: t('noty.product_delete_cart', {product: props.item.name})
  }, 1000)


  useGoogleEvent().setEvent('RemoveFromCart', props.item)
}
</script>

<style src="./checkout.scss" lang="scss" scoped></style>

<template>
<div class="wrapper">
  <NuxtLink :to="localePath('/' + item.slug)" :aria-label="item.name" clickable class="image-wrapper">
    <nuxt-img
      :src = "photo"
      :alt = "photoAlt"
      :title = "photoTitle"
      :class = "photoSize"
      width="85"
      height="110"
      sizes = "mobile:85px tablet:85px desktop:120px"
      format = "avif"
      quality = "80"
      loading = "lazy"
      fit="outside"
      placeholder="/images/noimage.png"
      class="image"
    >
    </nuxt-img> 
  </NuxtLink>
  <div class="body">
    <span v-if="item.code" class="code label">{{ item.code }}</span>
    <NuxtLink
      :to="localePath('/' + item.slug)"
      :aria-label="item.name"
      clickable
      class="name"
    >{{ item.name }}</NuxtLink>
  </div>
  <div class="footer">
    <form-amount v-model="item.amount"></form-amount>
    <div>
      <button @click="deleteHandler" class="remove-btn">{{ t('button.delete') }}</button>
    </div>
    <product-price :price="item.price" :old-price="item.oldPrice"></product-price>
  </div>
</div>
</template>