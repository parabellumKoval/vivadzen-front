<script setup>
import { useReviewStore } from '~~/store/review';

const { t } = useI18n()
const { user: authUser, displayName, avatar, isAuthenticated} = useAuth()

const TAB_PRODUCT = 'product'
const TAB_STORE = 'store'
const PRODUCT_REVIEW_TYPE = String.raw`App\Models\Product`

const REVIEW_TYPE_TEXT = 'text'
const REVIEW_TYPE_VIDEO = 'video'
const REVIEW_TYPE_PHOTO = 'photo'
const MAX_PHOTO_COUNT = 5
const MAX_PHOTO_FILE_SIZE_MB = 12

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
  review_type: REVIEW_TYPE_TEXT,
  is_video: false,
  video_url: null,
  photo_gallery: []
})

const errors = ref(null)
const photoInputRef = ref(null)

const extractValidationErrors = (error) => {
  const payload = error?.data || error

  if (!payload || typeof payload !== 'object') {
    return null
  }

  if (payload.options && typeof payload.options === 'object') {
    return payload.options
  }

  if (payload.errors && typeof payload.errors === 'object') {
    return payload.errors
  }

  return null
}

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
  get: () => review.value.review_type || (review.value.is_video ? REVIEW_TYPE_VIDEO : REVIEW_TYPE_TEXT),
  set: (value) => {
    review.value.review_type = value
    review.value.is_video = value === REVIEW_TYPE_VIDEO
  }
})
const isVideoReview = computed(() => reviewType.value === REVIEW_TYPE_VIDEO)
const isPhotoReview = computed(() => reviewType.value === REVIEW_TYPE_PHOTO)
const shouldShowSocialLinkField = computed(() => reviewType.value === REVIEW_TYPE_TEXT)
const photoGalleryError = computed(() => {
  const rootError = errors.value?.photo_gallery
  if (Array.isArray(rootError) && rootError.length) {
    return rootError[0]
  }
  if (typeof rootError === 'string') {
    return rootError
  }

  return errors.value?.['photo_gallery.0.src']?.[0] || null
})

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
  review.value.review_type = REVIEW_TYPE_TEXT
  review.value.photo_gallery = []
  review.value.rating = 5
}

const sendHandler = async () => {
  let data = {...review.value}

  if(data.review_type === REVIEW_TYPE_VIDEO) {
    data.text = null
    data.advantages = null
    data.flaws = null
    data.link = null
    data.photo_gallery = []
  }else if (data.review_type === REVIEW_TYPE_PHOTO) {
    data.link = null
    data.video_url = null
    data.is_video = false
  }else {
    data.video_url = null
    data.photo_gallery = []
    data.is_video = false
  }

  await useReviewStore().create(data).then(({data, error}) => {

    if(data.value) {
      resetReview()
      errors.value = null

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

    errors.value = extractValidationErrors(e)
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

const clearPhotoErrors = () => {
  if (!errors.value) {
    return
  }

  errors.value.photo_gallery = null
  errors.value['photo_gallery.0.src'] = null
}

const toDataUrl = (file) => {
  return new Promise((resolve) => {
    if (!file?.type?.startsWith('image/')) {
      resolve(null)
      return
    }

    if (file.size > MAX_PHOTO_FILE_SIZE_MB * 1024 * 1024) {
      useNoty().setNoty({
        content: t('photo_file_too_large', { max: MAX_PHOTO_FILE_SIZE_MB }),
        type: 'warning'
      }, 5000)
      resolve(null)
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      resolve({
        src: String(reader.result || ''),
        alt: file.name || null,
        title: null,
        size: 'cover'
      })
    }
    reader.onerror = () => resolve(null)
    reader.readAsDataURL(file)
  })
}

const openPhotoPicker = () => {
  photoInputRef.value?.click()
}

const removePhoto = (index) => {
  review.value.photo_gallery.splice(index, 1)
}

const onPhotoInputChange = async (event) => {
  const files = Array.from(event?.target?.files || [])
  event.target.value = ''

  if (!files.length) {
    return
  }

  const slotsLeft = Math.max(0, MAX_PHOTO_COUNT - review.value.photo_gallery.length)
  if (slotsLeft === 0) {
    useNoty().setNoty({
      content: t('photo_limit_reached', { max: MAX_PHOTO_COUNT }),
      type: 'warning'
    }, 4000)
    return
  }

  if (files.length > slotsLeft) {
    useNoty().setNoty({
      content: t('photo_limit_partial', { max: MAX_PHOTO_COUNT }),
      type: 'warning'
    }, 4000)
  }

  const prepared = await Promise.all(files.slice(0, slotsLeft).map(toDataUrl))
  const validItems = prepared.filter(Boolean)

  if (validItems.length) {
    clearPhotoErrors()
    review.value.photo_gallery.push(...validItems)
  }
}

const setDefaultTab = () => {
  tab.value = product.value ? TAB_PRODUCT : TAB_STORE
}

const setProductData = () => {
  const reviewableId = product.value?.group_id || product.value?.id || product.value?.parent_id || null

  review.value.reviewable_id = reviewableId
  review.value.reviewable_type = reviewableId ? PRODUCT_REVIEW_TYPE : null
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
            <button
              type="button"
              :class="{ active: reviewType === REVIEW_TYPE_PHOTO }"
              @click="reviewType = REVIEW_TYPE_PHOTO"
            >
              {{ t('review_type_photo') }}
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
          <div v-if="isPhotoReview">
            <div class="form-label">{{ t('photo_label') }}</div>
            <input
              ref="photoInputRef"
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              multiple
              class="photo-input"
              @change="onPhotoInputChange"
            />
            <button type="button" class="button secondary lowcase photo-add-button" @click="openPhotoPicker">
              <IconCSS name="hugeicons:image-02" class="inline-icon"></IconCSS>
              <span>{{ t('photo_add') }} ({{ review.photo_gallery.length }}/{{ MAX_PHOTO_COUNT }})</span>
            </button>

            <div v-if="photoGalleryError" class="photo-error">{{ photoGalleryError }}</div>

            <div v-if="review.photo_gallery.length" class="photo-grid">
              <div v-for="(photo, index) in review.photo_gallery" :key="photo.src + index" class="photo-item">
                <nuxt-img
                  :provider="useImg().provider"
                  :src="photo.src"
                  width="180"
                  height="180"
                  sizes="mobile:140px tablet:160px desktop:180px"
                  quality="70"
                  loading="lazy"
                  fit="cover"
                  :placeholder="useImg().noImage"
                  class="photo-preview"
                ></nuxt-img>
                <button type="button" class="photo-remove" @click="removePhoto(index)">×</button>
              </div>
            </div>

            <div class="form-hint">
              <ul class="form-list">
                <li>{{ t('photo_desc_1') }}</li>
                <li>{{ t('photo_desc_2') }}</li>
                <li>
                  {{ t('photo_desc_reward_prefix') }}
                  <review-reward
                    class="form-reward-inline"
                    variant="inline"
                    :kinds="['photo']"
                    :show-title="false"
                    :hide-labels="true"
                  />
                  {{ t('photo_desc_reward_suffix') }}
                </li>
              </ul>
            </div>
          </div>
        </transition>

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
