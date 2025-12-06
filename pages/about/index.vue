<script setup>
const {t, locale} = useI18n()

const text = await queryContent('about').locale(locale.value).findOne()

const breadcrumbs = [
  {
    name: t('title.home'),
    item: '/'
  },{
    name: t('title.about'),
    item: '/about'
  }
]
// COMPUTEDS
// METHODS
// HANDLERS
// WATCHERS
//
useSeo().setPageSeo(t('title.about'))
</script>

<style src='~/assets/scss/page.scss' lang='scss' scoped></style>
<style src='~/assets/scss/_rich-text.scss' lang='scss' scoped></style>
<!-- <i18n src='' lang='yaml'></i18n> -->

<template>
  <div class="page-base">
    <div class="container">
      <the-breadcrumbs :crumbs="breadcrumbs"></the-breadcrumbs>

      <div class="title-common">{{ t('title.about') }}</div>

      <div class="content-wrapper">
        <div class="rich-text about-rich-text" v-if="text">
          <section class="about-hero-card">
            <div class="about-hero-card__content">
              <p v-if="text.hero?.eyebrow" class="about-section-label">{{ text.hero.eyebrow }}</p>
              <h1 class="about-hero-card__title">{{ text.hero?.title || t('title.about') }}</h1>
              <p v-for="(paragraph, index) in text.hero?.paragraphs" :key="`hero-paragraph-${index}`">
                {{ paragraph }}
              </p>
            </div>
            <div v-if="text.hero?.image?.src" class="about-hero-card__media">
              <nuxt-img
                :src="text.hero.image.src"
                :alt="text.hero.image.alt"
                :width="text.hero.image.width"
                :height="text.hero.image.height"
                sizes="mobile:100vw tablet:520px desktop:520px"
                format="webp"
                quality="70"
                loading="lazy"
                class="about-hero-card__image"
              ></nuxt-img>
            </div>
          </section>

          <section v-if="text.quote" class="about-quote">
            <p class="about-section-label">{{ text.quote.title }}</p>
            <blockquote>{{ text.quote.text }}</blockquote>
          </section>

          <section v-if="text.mediaBlocks?.length" class="about-media-grid">
            <article
              v-for="(block, index) in text.mediaBlocks"
              :key="block.title"
              class="about-media-card"
              :class="{'about-media-card--reverse': index % 2 === 1 && block.image?.src}"
            >
              <div class="about-media-card__content">
                <div v-if="block.icon" class="about-media-card__icon">
                  <IconCSS :name="block.icon"></IconCSS>
                </div>
                <h2>{{ block.title }}</h2>
                <p v-for="(paragraph, idx) in block.body" :key="`media-${block.title}-${idx}`">
                  {{ paragraph }}
                </p>
              </div>
              <div v-if="block.image?.src" class="about-media-card__media">
                <nuxt-img
                  :src="block.image.src"
                  :alt="block.image.alt"
                  :width="block.image.width"
                  :height="block.image.height"
                  sizes="mobile:100vw tablet:420px desktop:460px"
                  format="webp"
                  quality="70"
                  loading="lazy"
                ></nuxt-img>
              </div>
            </article>
          </section>

          <section v-if="text.offer" class="about-offer">
            <div class="about-offer__content">
              <p class="about-section-label">{{ text.offer.title }}</p>
              <h2>{{ text.offer.intro }}</h2>
              <ul class="about-offer__list">
                <li v-for="item in text.offer.items" :key="item.label" class="about-offer__item">
                  <div class="about-offer__item-head">
                    <IconCSS name="iconoir:check-circle" class="about-offer__item-icon"></IconCSS>
                    <h3>{{ item.label }}</h3>
                  </div>
                  <p>{{ item.description }}</p>
                  <div v-if="item.links?.length" class="about-offer__links">
                    <a
                      v-for="link in item.links"
                      :key="link.url"
                      :href="link.url"
                      target="_blank"
                      rel="noopener"
                    >
                      {{ link.label }}
                      <IconCSS name="iconoir:arrow-tr"></IconCSS>
                    </a>
                  </div>
                </li>
              </ul>
            </div>
            <div v-if="text.offer.image?.src" class="about-offer__media">
              <nuxt-img
                :src="text.offer.image.src"
                :alt="text.offer.image.alt"
                :width="text.offer.image.width"
                :height="text.offer.image.height"
                sizes="mobile:100vw tablet:400px desktop:420px"
                format="webp"
                quality="70"
                loading="lazy"
              ></nuxt-img>
            </div>
          </section>

          <section v-if="text.values" class="about-values">
            <div class="about-values__media" v-if="text.values.image?.src">
              <nuxt-img
                :src="text.values.image.src"
                :alt="text.values.image.alt"
                :width="text.values.image.width"
                :height="text.values.image.height"
                sizes="mobile:100vw tablet:420px desktop:520px"
                format="webp"
                quality="70"
                loading="lazy"
              ></nuxt-img>
            </div>
            <div class="about-values__content">
              <p class="about-section-label">{{ text.values.title }}</p>
              <h2>{{ text.values.intro }}</h2>
              <p class="about-values__lead">{{ text.values.principles_intro }}</p>
              <ul>
                <li v-for="principle in text.values.principles" :key="principle">
                  {{ principle }}
                </li>
              </ul>
              <p>{{ text.values.description }}</p>
            </div>
          </section>

          <section v-if="text.logistics?.sections?.length" class="about-logistics">
            <article v-for="section in text.logistics.sections" :key="section.title" class="about-logistics__card">
              <p class="about-section-label">{{ section.title }}</p>
              <p>{{ section.text }}</p>
            </article>
          </section>
        </div>

        <aside class="content-aside">
          <checkout-contacts></checkout-contacts>
        </aside>
      </div>

    </div>
  </div>
</template>

<style scoped lang='scss'>
@use '~/assets/scss/vars' as *;
@use '~/assets/scss/mixins' as *;

.about-rich-text {
  display: flex;
  flex-direction: column;
  gap: 40px;

  @include desktop {
    gap: 50px;
  }
}

.about-section-label {
  font-size: 13px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: $color-green;
  font-weight: 600;
  margin-bottom: 12px;
}

.about-hero-card {
  display: grid;
  gap: 25px;
  @include tablet {
    grid-template-columns: 4fr 2fr;
    align-items: center;
    gap: 40px;
    padding: 30px;
    border: 1px solid rgba($color-green, 0.2);
    border-radius: 20px;
  }

  &__content {
    order: 2;
    @include tablet {
      order: 1;
    }

    p {
      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  &__media {
    order: 1;
    max-height: 300px;
    @include tablet {
      order: 2;
      max-height: initial;
    }
  }
  &__image {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.about-hero-card__title {
  font-size: 32px;
  margin-bottom: 20px;
  color: $color-0;
}


.about-quote {
  padding: 30px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba($color-green, 0.12), rgba($color-orange, 0.08));
  border: 1px solid $color-border;
  blockquote {
    margin: 0;
    font-size: 20px;
    line-height: 160%;
    color: $color-0;
    font-style: italic;
  }
}

.about-media-grid {
  display: grid;
  grid-template-columns: 1fr;
  align-items: flex-start;
  gap: 30px;

  @include desktop {
    grid-template-columns: repeat(2, 1fr);
  }
}

.about-media-card {
  display: grid;
  gap: 20px;
  padding: 24px;
  border-radius: 18px;
  background: $color-8;
  border: 1px solid $color-5;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  @include tablet {
    grid-template-columns: 4fr min-content;
    align-items: center;
  }

  p {
    &:last-child {
      margin-bottom: 0;
    }
  }
}

.about-media-card--reverse {
  @include tablet {
    direction: rtl;
    .about-media-card__content {
      direction: ltr;
    }
  }
}

.about-media-card__icon {
  color: $color-green;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  font-size: 32px;
}

.about-media-card__media {
  width: 100%;

  @include desktop {
    width: 400px;
  }

  :deep(img){
    border-radius: 16px;
    width: 100%;
    height: auto;
    object-fit: contain;
  }
}

.about-offer {
  display: grid;
  gap: 30px;
  border-radius: 20px;
  @include tablet {
    grid-template-columns: 1.2fr 0.8fr;
    align-items: center;
  }
}

.about-offer__list {
  list-style: none;
  padding: 0;
  margin: 20px 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.about-offer__item {
  padding: 18px;
  margin-bottom: 0 !important;
  border-radius: 16px;
  background: $color-8;
  border: 1px solid $color-5;

  &::before {
    display: none;
  }
}

.about-offer__item-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;

  h3 {
    margin: 0;
    color: $color-0;
  }
}

.about-offer__item-icon {
  color: $color-green;
  font-size: 18px;
}

.about-offer__links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
  a {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: $color-green;
    border-bottom: 1px dashed rgba($color-green, 0.4);
    padding-bottom: 2px;
    transition: color $speed;
    &:hover {
      color: $color-orange;
    }
  }
}

.about-values {
  display: grid;
  gap: 30px;
  align-items: center;
  @include tablet {
    grid-template-columns: min-content 4fr;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0 0 20px 20px;
    display: flex;
    flex-direction: column;
    gap: 0px;
    li {
      position: relative;
      padding-left: 18px;
      margin-bottom: 10px;
      &:before {
        content: '';
        position: absolute;
        left: 0;
        top: 9px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: $color-green;
      }
    }
  }
}

.about-values__media {
  width: 100%;

  @include desktop {
    width: 400px;
  }
  :deep(img) {
    width: 100%;
    height: auto;
    object-fit: cover;
  }
}
.about-offer__media {
  width: 300px;
  justify-self: flex-end;

  :deep(img) {
    width: 100%;
    height: auto;
    object-fit: cover;
  }
}

.about-values__lead {
  font-weight: 600;
  color: $color-0;
  margin-bottom: 10px;
}

.about-logistics {
  display: grid;
  gap: 20px;
  @include tablet {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.about-logistics__card {
  padding: 20px;
  border-radius: 16px;
  border: 1px solid $color-5;
  background: $color-8;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04);
}

.about-media-card__content h2,
.about-offer__content h2,
.about-values__content h2 {
  margin-top: 0;
  color: $color-0;
}

.about-hero-card__content p,
.about-media-card__content p,
.about-offer__item p,
.about-values__content p,
.about-logistics__card p {
  color: $color-2;
}

@include tablet {
  .about-hero-card {
    padding: 40px;
  }
}
</style>