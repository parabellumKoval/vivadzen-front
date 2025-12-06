<script setup lang="ts">
const { t } = useI18n()
const { $regionPath } = useNuxtApp();
const { user, isAuthenticated, avatar } = useAuth()

const avatars = ref([
  '/images/ref/avatars/av-1.png',
  '/images/ref/avatars/av-2.png',
  '/images/ref/avatars/av-3.png',
  '/images/ref/avatars/av-4.png',
])

const showAuthHandler = () => {
  if(isAuthenticated.value && user.value) {
    navigateTo($regionPath('/account/network/common'))
  } else {
    const component = defineAsyncComponent(() => import('~/components/Modal/Auth/Social/Social.vue'))
    useModal().open(component, null, null)
  }
}
</script>

<style src='./referral.scss' lang='scss' scoped></style>
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <section class="refgrow" aria-labelledby="refgrow-title">

    <header class="refgrow__header">
      <h2 class="refgrow__title">
        {{ t('refGrow.title') }}
      </h2>
      <p class="refgrow__subtitle">
        <span class="orange">{{ t('refGrow.subtitleAccent') }}</span>
        {{ t('refGrow.subtitleRest') }}
      </p>
    </header>

    <div class="refgrow__grid">
      <!-- Колонка 1 -->
      <div class="refgrow__col">
        <div class="refgrow__icon">

          <div class="icon-prefix">
            <div class="icon icon-1"></div>
          </div>

          <CircleSlices
            class="refgrow__circle-slices"
            :segments="3"
            :total-angle="90"
            :start-angle="0"
            :segment-styles="[
              { fill: '#FFE9CB', stroke: '#FFB466', outerStroke: '#FF8400', dashed: true },
              { fill: 'rgba(255, 132, 0, 0.1)', stroke: '#FF8400', outerStroke: '#FF8400', dashed: true },
              { fill: 'rgba(255, 132, 0, 0.2)', stroke: '#FF8400', outerStroke: '#FF8400' },
            ]"
          />

          <div class="refgrow__circle" aria-hidden="true" data-percent="10%">
            <!-- <span style="--i:0;">L</span>
            <span style="--i:1;">E</span>
            <span style="--i:2;">V</span>
            <span style="--i:3;">E</span>
            <span style="--i:4;">L</span>
            <span style="--i:5;">1</span> -->
          </div>

          <nuxt-img
            src = "/images/ref/img-1.png"
            width="370"
            height="370"
            sizes = "mobile:100vw tablet:370px"
            format = "avif"
            quality = "60"
            loading = "lazy"
            fit="outside"
            class="refgrow__image refgrow__image-1"
          >
          </nuxt-img>
        </div>

        <h3 class="refgrow__col-title refgrow__col-content">
          <wrapper-html :string="t('refGrow.col1.title')" :wrappers="['<b class=\'orange\'>']" />
        </h3>
        <p class="refgrow__col-kicker refgrow__col-content">{{ t('refGrow.col1.kicker') }}</p>
        <p class="refgrow__col-text refgrow__col-content">
          <span class="refgrow__level">{{ t('refGrow.levels.level1') }}</span> 
          {{ t('refGrow.col1.text') }}
        </p>
      </div>

      <!-- Колонка 2 -->
      <div class="refgrow__col">
        <div class="refgrow__icon">
          <div class="icon-prefix">
            <IconCSS name="ion:git-branch-outline" class="icon icon-2"></IconCSS>
          </div>

          <CircleSlices
            class="refgrow__circle-slices"
            :segments="3"
            :total-angle="90"
            :start-angle="0"
            :segment-styles="[
              { fill: 'rgba(255, 132, 0, 0.1)', stroke: '#FF8400', dashed: true },
              { fill: 'rgba(255, 132, 0, 0.2)', stroke: '#FF8400'},
              { fill: 'rgba(255, 132, 0, 0.4)', stroke: '#FF8400' },
            ]"
          />
          
          <div class="refgrow__circle" aria-hidden="true"  data-percent="5%">
            <!-- <span style="--i:0;">L</span>
            <span style="--i:1;">E</span>
            <span style="--i:2;">V</span>
            <span style="--i:3;">E</span>
            <span style="--i:4;">L</span>
            <span style="--i:5;">2</span> -->
          </div>

            <nuxt-img
              src = "/images/ref/img-2.png"
              width="370"
              height="370"
              sizes = "mobile:100vw tablet:370px"
              format = "avif"
              quality = "60"
              loading = "lazy"
              fit="outside"
              class="refgrow__image refgrow__image-2"
            >
            </nuxt-img>
        </div>

        <h3 class="refgrow__col-title refgrow__col-content">
          <wrapper-html :string="t('refGrow.col2.title')" :wrappers="['<b class=\'orange\'>']" />
         </h3>
        <p class="refgrow__col-kicker refgrow__col-content">{{ t('refGrow.col2.kicker') }}</p>
        <p class="refgrow__col-text refgrow__col-content">
          <span class="refgrow__level">{{ t('refGrow.levels.level2') }}</span>
          {{ t('refGrow.col2.text') }}
        </p>
      </div>

      <!-- Колонка 3 -->
      <div class="refgrow__col">
        <div class="refgrow__icon">
          <div class="icon-prefix">
            <div class="icon-prefix-inner">
              <IconCSS name="ion:git-branch-outline" class="icon icon-3-1"></IconCSS>
              <IconCSS name="ion:git-branch-outline" class="icon icon-3-2"></IconCSS>
            </div>
          </div>
          <CircleSlices
            class="refgrow__circle-slices"
            :segments="3"
            :total-angle="90"
            :start-angle="0"
            :segment-styles="[
              { fill: 'rgba(255, 132, 0, 0.2)', stroke: '#FF8400'},
              { fill: 'rgba(255, 132, 0, 0.4)', stroke: '#FF8400'},
              { fill: 'rgba(255, 132, 0, 0.6)', stroke: '#FF8400' },
            ]"
          />
          <div class="refgrow__circle" aria-hidden="true"  data-percent="3%">
            <!-- <span style="--i:0;">L</span>
            <span style="--i:1;">E</span>
            <span style="--i:2;">V</span>
            <span style="--i:3;">E</span>
            <span style="--i:4;">L</span>
            <span style="--i:5;">3</span> -->
          </div>
            <nuxt-img
              src = "/images/ref/img-3.png"
              width="370"
              height="370"
              sizes = "mobile:100vw tablet:370px"
              format = "avif"
              quality = "60"
              loading = "lazy"
              fit="outside"
              class="refgrow__image refgrow__image-3"
            >
            </nuxt-img>
        </div>

        <h3 class="refgrow__col-title refgrow__col-content">
          <wrapper-html :string="t('refGrow.col3.title')" :wrappers="['<b class=\'orange\'>']" />
        </h3>
        <p class="refgrow__col-kicker refgrow__col-content">{{ t('refGrow.col3.kicker') }}</p>
        <p class="refgrow__col-text refgrow__col-content">
          <span class="refgrow__level">{{ t('refGrow.levels.level3') }}</span> 
          {{ t('refGrow.col3.text') }}
        </p>
      </div>

      <!-- CTA карточка -->
      <div class="refgrow__cta-wrapper">
        <aside class="refgrow__cta" aria-label="Join">
          <h3 class="refgrow__cta-title">{{ t('refGrow.cta.title') }}</h3>
          <p class="refgrow__cta-text">
            {{ t('refGrow.cta.text') }}
          </p>

          <ul v-if="avatars?.length" class="refgrow__avatars" aria-hidden="true">
            <li v-for="(a, i) in avatars" :key="i">
              <nuxt-img
                :src = "a"
                width="60"
                height="60"
                sizes = "mobile:80px"
                format = "avif"
                quality = "60"
                loading = "lazy"
                fit="outside"
              >
              </nuxt-img>
            </li>
          </ul>

          <button @click="showAuthHandler" class="refgrow__cta-btn button color-orange" type="button">
            {{ t('refGrow.cta.button') }}
          </button>
        </aside>
        <div class="refgrow__cta-info">
          <div class="refgrow__cta-info-text">{{ t('refGrow.cta.infoText') }}</div>
          <NuxtLink :to="$regionPath('/affiliate')" class="button promo full">{{ t('refGrow.cta.infoLink') }}</NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
