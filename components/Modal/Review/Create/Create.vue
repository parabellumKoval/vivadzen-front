<script setup>
import { useReviewStore } from '~~/store/review';

const { t } = useI18n()
const { user: authUser, displayName, avatar, isAuthenticated} = useAuth()

const TAB_PRODUCT = 'product'
const TAB_STORE = 'store'

const REVIEW_TYPE_TEXT = 'text'
const REVIEW_TYPE_VIDEO = 'video'

const review = ref({
  provider: 'data',
  owner: {
    name: null,
    email: null,
    photo: null
  },
  link: null,
  rating: 5,
  flaws: null,
  advantages: null,
  text: null,
  reviewable_id: null,
  reviewable_type: null,
  is_video: false,
  video_url: null
})

const errors = ref(null)

const product = computed(() => {
  return useModal().active.data
})

const tab = ref(product.value ? TAB_PRODUCT : TAB_STORE)

const tabs = computed(() => {
  const items = []

  if (product.value) {
    items.push({
      id: TAB_PRODUCT,
      name: t('tab_product')
    })
  }

  items.push({
    id: TAB_STORE,
    name: t('tab_company')
  })

  return items
})

const isProductTab = computed(() => tab.value === TAB_PRODUCT)
const isStoreTab = computed(() => tab.value === TAB_STORE)
const reviewType = computed({
  get: () => (review.value.is_video ? REVIEW_TYPE_VIDEO : REVIEW_TYPE_TEXT),
  set: (value) => {
    review.value.is_video = value === REVIEW_TYPE_VIDEO
  }
})
const isVideoReview = computed(() => reviewType.value === REVIEW_TYPE_VIDEO)
const shouldShowSocialLinkField = computed(() => !isVideoReview.value)

const ratingTitle = computed(() => {
  if (isProductTab.value)
    return t('set_rating')
  else if (isStoreTab.value)
    return t('set_rating_shop')
  return ''
})

// HANDLER
const resetReview = () => {
  review.value.text = null
  review.value.advantages = null
  review.value.flaws = null
  review.value.reviewable_id = null
  review.value.reviewable_type = null
  review.value.link = null
  review.value.video_url = null
  review.value.is_video = false
  review.value.rating = 5
}

const sendHandler = async () => {
  let data = {...review.value}

  if(data.is_video) {
    data.text = null
    data.advantages = null
    data.flaws = null
    data.link = null
  }else {
    data.video_url = null
  }

  await useReviewStore().create(data).then(({data, error}) => {

    if(data.value) {
      resetReview()

      useNoty().setNoty({
        title: t('noty.review.success_title'),
        content: t('noty.review.success'),
        type: 'success'
      }, 5000)

      useModal().close()
    }
    
    if(error.value) 
      throw error.value

  }).catch((e) => {
    useNoty().setNoty({
      title: t('noty.review.fail_title'),
      content: t('noty.review.fail'),
      type: 'error'
    }, 7000)

    if(e.options) {
      errors.value = e.options
    }
  })
}

// METHODS
const clearError = (key) => {
  if(errors.value && errors.value[key]) {
    errors.value[key]= null
  }
}

const clearNameError = () => {
  if(errors.value && errors.value['owner'] && errors.value['owner']['name']) {
    errors.value['owner']['name'] = null
  }
}

const setDefaultTab = () => {
  tab.value = product.value ? TAB_PRODUCT : TAB_STORE
}

const setProductData = () => {
  review.value.reviewable_id = product.value?.id || null
  review.value.reviewable_type = product.value?.id? String.raw`Backpack\Store\app\Models\Catalog`: null
}

const clearProductData = () => {
  review.value.reviewable_id = null
  review.value.reviewable_type = null
}

const setUserData = () => {
  review.value.provider = isAuthenticated.value ? 'auth' : 'data'

  const current = authUser.value
  if (!current) return
  
  review.value.owner.name = displayName.value || current.name || review.value.owner.name
  review.value.owner.email = current.email || review.value.owner.email
  review.value.owner.photo = avatar.value || current.photo || current.avatar || review.value.owner.photo
}

// WATCH
watch(() => tab.value, (v) => {
  if(v === TAB_PRODUCT && product.value) {
    setProductData()
  }else {
    clearProductData()
  }

}, {
  immediate: true
})

watch(product, (value) => {
  if(!value && tab.value === TAB_PRODUCT) {
    tab.value = TAB_STORE
  }
})

setDefaultTab()

watch(authUser, () => setUserData(), { immediate: true })
</script>

<style src="./create.scss" lang="scss" scoped></style>
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <modal-wrapper :title="t('new_review')">
    <div class="modal-wrapper">

      <simple-tabs
        v-model="tab"
        :values="tabs"
        value="name"
        value-key="id"
        class="tab-wrapper"
      ></simple-tabs>

      <transition name="fade-in">
        <product-card-small
          v-if="isProductTab && product"
          :item="product"
          class="product-wrapper"
        ></product-card-small>
      </transition>

      <review-reward class="modal-review-reward" />

      <div class="form-wrapper">

        <div class="rate-wrapper">
          <div class="form-label">{{ ratingTitle }}</div>
          <div class="rate-forms">
            <form-amount v-model="review.rating" :min="1" :max="5"></form-amount>
            <simple-stars :amount="review.rating" :size="20" mobile="medium"></simple-stars>
          </div>
        </div>

        <div class="review-type">
          <div class="form-label">{{ t('review_type_label') }}</div>
          <div class="review-type-toggle">
            <button
              type="button"
              :class="{ active: reviewType === REVIEW_TYPE_TEXT }"
              @click="reviewType = REVIEW_TYPE_TEXT"
            >
              {{ t('review_type_text') }}
            </button>
            <button
              type="button"
              :class="{ active: reviewType === REVIEW_TYPE_VIDEO }"
              @click="reviewType = REVIEW_TYPE_VIDEO"
            >
              {{ t('review_type_video') }}
            </button>
          </div>
        </div>

        <div v-if="!displayName">
          <div class="form-label">{{ t('form.name') }}</div>
          <form-text
            v-model="review.owner.name"
            :error = "errors?.owner.name"
            @input = "clearNameError"
            :placeholder="t('form.enter.name')"
          ></form-text>
        </div>

        <div v-if="!isVideoReview">
          <div class="form-label">{{ t('form.review') }}</div>
          <form-textarea
            v-model="review.text"
            :error = "errors?.text"
            @input = "clearError('text')"
            :placeholder="t('form.enter.review')"
          ></form-textarea>
        </div>

        <transition name="fade-in">
          <div v-if="isVideoReview">
            <div class="form-label">{{ t('video_link_label') }}</div>
            <form-text
              v-model="review.video_url"
              :error="errors?.video_url"
              @input="clearError('video_url')"
              :placeholder="t('video_link_placeholder')"
            ></form-text>

            <div class="form-hint">
              <ul class="form-list">
                <li>{{ t('video_link_desc_1') }}</li>
                <li>{{ t('video_link_desc_2') }}</li>
                <li>
                  {{ t('video_link_desc_reward_prefix') }}
                  <review-reward
                    class="form-reward-inline"
                    variant="inline"
                    :kinds="['video']"
                    :show-title="false"
                    :hide-labels="true"
                  />
                  {{ t('video_link_desc_reward_suffix') }}
                </li>
              </ul>
            </div>
          </div>
        </transition>

        <transition name="fade-in">
          <div v-if="shouldShowSocialLinkField">
            <div class="form-label">{{ t('w_link') }}</div>
            <form-text
              v-model="review.link"
              :error = "errors?.link"
              @input = "clearError('link')"
              :placeholder="t('link')"
            ></form-text>

            <div class="form-hint">
              <ul class="form-list">
                <li>{{ t('link_desc_supported') }}</li>
                <li>{{ t('link_desc_requirement') }}</li>
                <li>
                  {{ t('link_desc_2_prefix') }}
                  <review-reward
                    class="form-reward-inline"
                    variant="inline"
                    :kinds="['text']"
                    :show-title="false"
                    :hide-labels="true"
                  />
                  {{ t('link_desc_2_suffix') }}
                </li>
              </ul>
            </div>
          </div>
        </transition>

        <transition name="fade-in">
          <div v-if="isProductTab && !isVideoReview">
            <div class="form-label">{{ t('w_advantages') }}</div>
            <form-textarea
              v-model="review.advantages"
              :error = "errors?.advantages"
              @input = "clearError('advantages')"
              :placeholder="t('advantages')"
            ></form-textarea>
          </div>
        </transition>

        <transition name="fade-in">
          <div v-if="isProductTab && !isVideoReview">
            <div class="form-label">{{ t('w_flaws') }}</div>
            <form-textarea
              v-model="review.flaws"
              :error = "errors?.flaws"
              @input = "clearError('flaws')"
              :placeholder="t('flaws')"
            ></form-textarea>
          </div>
        </transition>

        <button @click="sendHandler" class="button primary send-btn">{{ t('button.send') }}</button>
      </div>

    </div>
  </modal-wrapper>
</template>
