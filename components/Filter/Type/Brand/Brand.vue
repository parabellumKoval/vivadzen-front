<script setup>
// import {useFilterItem} from '~/composables/product/useFilterItem.ts'

const props = defineProps({
  filter: {
    type: Object
  }
})

const {
  updateCheckboxValue,
  isValueChecked
} = useFilterItem(props.filter.id)

// METHODS
const checkHandler = (valueId) => {
  updateCheckboxValue(valueId)
}

// WATCH
</script>

<style src="./brand.scss" lang="scss" scoped></style>

<template>
  <div class="wrapper">
    <ul class="brand-list">
      <li
        v-for="(value, index) in filter.values"
        :key="value.id"
        :class="[{checked: isValueChecked(value.id)}]"
        @click="checkHandler(value.id)"
        class="brand-item"
      >
        <button class="brand-item-btn" button>
          <div class="brand-input">
            <IconCSS name="iconoir:check" class="brand-input-icon"></IconCSS>
          </div>
          <span class="brand-content">
            <nuxt-img
              :src='useImg().brand(value.image)'
              width='40'
              height='40'
              sizes='mobile:40px tablet:40px desktop:40px'
              format='webp'
              quality='60'
              loading='lazy'
              fit='outside'
              :placeholder="useImg().noImage"
              class='brand-image'
            />
            <span class="brand-name">{{ value.name }}</span>
            <span class="brand-count">{{ value.count }}</span>
          </span>
        </button>
      </li>
    </ul>
  </div>
</template>