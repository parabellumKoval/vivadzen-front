<script setup>
const { t } = useI18n()
const openId = ref(null)

const props = defineProps({
  groups: {
    type: Array,
    default: () => []
  }
})

const normalizedGroups = computed(() => {
  const list = Array.isArray(props.groups) ? props.groups : []
  let questionNumber = 0

  return list
    .map((group, index) => {
      const title = typeof group?.title === 'string' ? group.title.trim() : ''
      const items = Array.isArray(group?.items) ? group.items : []

      return {
        id: group?.id || `group-${index + 1}`,
        title: title || 'FAQ',
        items: items
          .reduce((result, item, itemIndex) => {
            const question = item?.q || item?.question || ''
            const answer = item?.a || item?.answer || ''

            if (!String(question).trim().length || !String(answer).trim().length) {
              return result
            }

            questionNumber += 1
            result.push({
              id: item?.id || `item-${index + 1}-${itemIndex + 1}`,
              q: question,
              a: answer,
              number: questionNumber
            })

            return result
          }, [])
      }
    })
    .filter((group) => group.items.length)
})

const toggleItem = (itemId) => {
  openId.value = openId.value === itemId ? null : itemId
}
</script>

<style src="./faq.scss" lang="scss" scoped></style>
<style src="~/assets/scss/_rich-text.scss" lang="scss" scoped></style>

<template>
  <section v-if="normalizedGroups.length" class="product-faq">
    <div class="product-faq__title">{{ t('title.qa') }}</div>

    <div v-for="group in normalizedGroups" :key="group.id" class="product-faq__group">
      <h3 class="product-faq__group-title">{{ group.title }}</h3>

      <ul class="product-faq__group-list">
        <li
          v-for="item in group.items"
          :key="item.id"
          :class="{ 'is-open': openId === item.id }"
          class="product-faq__item"
        >
          <button
            :aria-expanded="openId === item.id"
            :aria-controls="`product-faq-answer-${item.id}`"
            class="product-faq__item-header"
            type="button"
            @click="toggleItem(item.id)"
          >
            <span class="product-faq__item-count">{{ item.number }}</span>
            <span class="product-faq__item-question">{{ item.q }}</span>
            <span class="product-faq__item-arrow">
              <IconCSS name="iconoir:nav-arrow-down" class="product-faq__item-icon"></IconCSS>
            </span>
          </button>

          <div
            v-show="openId === item.id"
            :id="`product-faq-answer-${item.id}`"
            class="product-faq__item-answer rich-text"
          >
            <template v-if="Array.isArray(item.a)">
              <p v-for="(htmlItem, answerIndex) in item.a" :key="answerIndex">
                <template v-if="Array.isArray(htmlItem)">
                  <ul>
                    <li v-for="li in htmlItem" :key="li.id || li.name || li">
                      <template v-if="li.slug">
                        <NuxtLink :to="$regionPath('/' + li.slug)">{{ li.name }}</NuxtLink>
                      </template>
                      <template v-else>
                        <span v-html="li"></span>
                      </template>
                    </li>
                  </ul>
                </template>
                <template v-else>
                  <span v-html="htmlItem"></span>
                </template>
              </p>
            </template>
            <template v-else>
              <div v-html="item.a"></div>
            </template>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
