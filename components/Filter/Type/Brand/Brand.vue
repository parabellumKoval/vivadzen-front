<script setup>
// import {useFilterItem} from '~/composables/product/useFilterItem.ts'

const props = defineProps({
  filter: {
    type: Object
  }, 
  meta: {
    type: Array,
    default: []
  }
})

const meta = ref([])

const {
  updateCheckboxValue,
  isValueChecked,
  thisFilter,
} = useFilterItem(props.filter.id)

// Computeds
const items = computed(() => {

  let values = props.filter?.values || [];
  if(!Array.isArray(props.filter.values)) {
    values = Object.values(props.filter.values);
  }

  if (!values) {
    return [];
  }
  
  if(!meta.value) {
    return values;
  }

  return values.sort((a, b) => {
     const aCount = meta.value[a.id] || 0;
     const bCount = meta.value[b.id] || 0;
     const aChecked = isValueChecked(a.id);
     const bChecked = isValueChecked(b.id);

    if ((aCount === 0 && bCount !== 0) || (!aChecked && bChecked)) {
      return 1; // Переместить 'a' (с count: 0) в конец
    } else if ((aCount !== 0 && bCount === 0)  || (aChecked && !bChecked)) {
      return -1; // Переместить 'b' (с count: 0) в конец
    } else {
      return 0; // Сохранить исходный порядок для остальных элементов
    }
  });
})


// METHODS
const checkHandler = (valueId) => {
  updateCheckboxValue(valueId)
}

const isPlus = (valueId) => {
  return thisFilter.value && getMeta(valueId) > 0 && !isValueChecked(valueId) && !props.filter?.isNarrowing
}

const isDisabled = (valueId) => {
  // if(props.filter.noMeta)
  //   return false

  if(isValueChecked(valueId))
    return false

  if(meta.value && meta.value[valueId] === undefined) {
    return true
  }

  return false
}

const getMeta = (valueId) => {
  if(meta.value && meta.value[valueId]){
    return meta.value[valueId]
  }else {
    return ''
  }
}

// WATCH

watch(() => props.meta, (v) => {

  meta.value = v
}, {
  deep: true,
  immediate: true
})

</script>

<style src="./brand.scss" lang="scss" scoped></style>

<template>
  <div class="wrapper">
    <TransitionGroup name="list" tag="ul" class="brand-list">
      <li
        v-for="(value, index) in items"
        :key="value.id"
        :class="[
          {checked: isValueChecked(value.id, 'classset')},
          {disabled: isDisabled(value.id)}
        ]"
        @click.stop="checkHandler(value.id)"
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
            <span 
              :class="{plus: isPlus(value.id)}"
              class="brand-count"
            >
              <template v-if="!isValueChecked(value.id)">
                  {{ getMeta(value.id) }}
              </template>
            </span>
          </span>
        </button>
      </li>
    </TransitionGroup>
  </div>
</template>