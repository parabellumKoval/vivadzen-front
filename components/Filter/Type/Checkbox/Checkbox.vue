<script setup>
const props = defineProps({
  filter: {
    type: Object
  },

  meta: {
    type: Array,
    default: []
  },
})

const emit = defineEmits(['update:modelValue'])
const meta = ref([])

const {
  updateCheckboxValue,
  isValueChecked,
  thisFilter
} = useFilterItem(props.filter.id)

// COMPUTED
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
     const aChecked = isValueChecked(a.id, props.filter.name);
     const bChecked = isValueChecked(b.id, props.filter.name);

    if ((aCount === 0 && bCount !== 0) || (!aChecked && bChecked)) {
      return 1; // Переместить 'a' (с count: 0) в конец
    } else if ((aCount !== 0 && bCount === 0)  || (aChecked && !bChecked)) {
      return -1; // Переместить 'b' (с count: 0) в конец
    } else {
      return 0; // Сохранить исходный порядок для остальных элементов
    }
  });
})

// HANDLERS
const checkHandler = (valueId) => {
  updateCheckboxValue(valueId)
}

// METHODS
const isPlus = (valueId) => {
  return thisFilter.value && getMeta(valueId) > 0 && !isValueChecked(valueId) && !props.filter?.isNarrowing
}

const isDisabled = (valueId) => {
  if(props.filter.noMeta)
    return false

  if(isValueChecked(valueId))
    return false

  if(meta.value && (meta.value[valueId] === undefined || !meta.value[valueId]) ) {
    return true
  }

  return false;
}

const getMeta = (valueId) => {
  if(props.filter.noMeta){
    return null
  }

  if(meta.value && meta.value[valueId]){
    return meta.value[valueId]
  }else {
    return 0
  }
}

// WATCH
// watch(() => props.modelValue, (v) => {
//   updateModelValue(v)
// }, {
//   deep: true
// })

watch(() => props.meta, (v) => {
  meta.value = v
}, {
  deep: true,
  immediate: true
})
</script>

<style src="./checkbox.scss" lang="scss" scoped></style>

<template>
  <div class="wrapper">
    <ul class="checkbox-list">
      <template v-for="(value, index) in items" :key="value.id">
        <li
          :class="[
            {disabled: isDisabled(value.id)},
            {checked: isValueChecked(value.id)}
          ]"
          class="checkbox-item"
        >
          <button @click="checkHandler(value.id)" class="checkbox-item-btn" button>
            <div class="checkbox-input">
              <IconCSS name="iconoir:check" class="checkbox-input-icon"></IconCSS>
            </div>
            <span class="checkbox-content">
              <span class="checkbox-name">{{ value.value }}</span>
              <span
                :class="{plus: isPlus(value.id)}"
                class="checkbox-count">
                <template v-if="!isValueChecked(value.id)">
                  {{ getMeta(value.id) }}
                </template>
              </span>
            </span>
          </button>
        </li>
      </template>
    </ul>
  </div>
</template>