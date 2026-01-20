<script setup>
  const activeIndex = ref(0);
  const activeHandler = (index) => {
    activeIndex.value = index;
  };

  const ribbonRef = ref(null);
  const isOverflowing = ref(false);
  const overlapPx = ref(0);
  let resizeObserver;

  const measureOverlap = () => {
    const ribbon = ribbonRef.value;
    if (!ribbon) return;

    const styles = getComputedStyle(ribbon);
    const gap = parseFloat(styles.columnGap || styles.gap || '0') || 0;
    const paddingX =
      (parseFloat(styles.paddingLeft) || 0) + (parseFloat(styles.paddingRight) || 0);
    const children = Array.from(ribbon.children);
    const cards = ribbon.querySelectorAll('.origin-card');
    const overlapSlots = Math.max(cards.length - 1, 0);

    if (!children.length || overlapSlots === 0) {
      isOverflowing.value = false;
      overlapPx.value = 0;
      return;
    }

    const totalWidth =
      children.reduce((sum, el) => sum + el.offsetWidth, 0) +
      gap * Math.max(children.length - 1, 0);
    const availableWidth = ribbon.clientWidth - paddingX;

    if (totalWidth > availableWidth) {
      overlapPx.value = Math.ceil((totalWidth - availableWidth) / overlapSlots);
      isOverflowing.value = true;
    } else {
      overlapPx.value = 0;
      isOverflowing.value = false;
    }
  };

  onMounted(() => {
    measureOverlap();
    const ribbon = ribbonRef.value;
    if (!ribbon) return;
    resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(measureOverlap);
    });
    resizeObserver.observe(ribbon);
    ribbon.querySelectorAll('.origin-card, .header-card').forEach((el) => {
      resizeObserver.observe(el);
    });
  });

  onBeforeUnmount(() => {
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
  });

  watch(activeIndex, async () => {
    await nextTick();
    measureOverlap();
  });

const origins = [
  { 
    name: 'Maeng Da', 
    subtitle: 'Мощность и Пиковая Эффективность', // Короткое позиционирование
    tags: ['Fast Acting', 'High Potency', 'Sharp'], // Теги для быстрого сканирования
    specs: {
      speed: 'Быстрый старт (10-15 мин)',
      duration: 'Средняя (3-4 часа)',
      character: 'Резкий, Выраженный, Интенсивный'
    },
    video: '/video/regions/maengda.mp4',
    img: '/images/landing/regions/maengda.png',
    bgColor: '#fdf9d0',
    color: '#e39c0f',
    desc: 'Самый мощный сорт на рынке (Pimp Grade).\nИдеален, когда результат нужен "здесь и сейчас".\nВысокая концентрация алкалоидов.\nДает сильный пиковый эффект, но проходит быстрее других.'
  },
  { 
    name: 'Malay', // Malaysian
    subtitle: 'Выносливость и "Длинные ноги"', 
    tags: ['Long Legs', 'Endurance', 'Flow State'],
    specs: {
      speed: 'Медленный разгон (Creeper)',
      duration: 'Максимальная (5-7 часов)',
      character: 'Ровный, Стабильный, Пролонгированный'
    },
    video: '/video/regions/Malay.mp4',
    img: '/images/landing/regions/malay2.png',
    bgColor: '#c6dfca',
    color: '#5a9a91',
    desc: 'Легендарные "Длинные ноги" (Long Legs) — эффект держится дольше всех сортов.\nМягкое, незаметное начало действия.\nОтсутствие резких перепадов настроения.\nЛучший выбор для долгого рабочего дня.'
  },
  { 
    name: 'Thai', 
    subtitle: 'Энергия и Мотивация', 
    tags: ['Energy', 'Workhorse', 'Focus'],
    specs: {
      speed: 'Очень быстрый',
      duration: 'Средняя',
      character: 'Стимулирующий, Деятельный'
    },
    video: '/video/regions/Thai.mp4',
    img: '/images/landing/regions/thai.png',
    bgColor: '#f4dfd7',
    color: '#a95e74',
    desc: 'Сорт-"Рабочая лошадка" для высокой продуктивности.\nДаже в красном цвете сохраняет стимулирующие нотки.\nМинимум седации, максимум желания действовать.\nОтлично сочетается с физической активностью.'
  },
  { 
    name: 'Borneo', 
    subtitle: 'Тяжесть и Глубина', 
    tags: ['Relaxation', 'Pain Relief', 'Sedating'],
    specs: {
      speed: 'Средняя',
      duration: 'Длительная',
      character: 'Тяжелый, Обволакивающий, Телесный'
    },
    video: '/video/regions/borneo3.mp4',
    img: '/images/landing/regions/borneo2.png',
    bgColor: '#bde6eb',
    color: '#0f5880',
    desc: 'Классический "медленный" сорт с упором на физические ощущения.\nМаксимальный потенциал обезболивания.\nГлубокое заземление и мышечный релакс.\nЧасто используется для вечернего отдыха.'
  },
  { 
    name: 'Sumatra', 
    subtitle: 'Настроение и Комфорт', 
    tags: ['Mood Lift', 'Smooth', 'Anti-Anxiety'],
    specs: {
      speed: 'Средняя / Плавная',
      duration: 'Средняя',
      character: 'Мягкий, Эйфоричный, Уютный'
    },
    video: '/video/regions/sumatra.mp4',
    img: '/images/landing/regions/sumatra2.png',
    bgColor: '#fcd0b3',
    color: '#d34b1e',
    desc: 'Самый сбалансированный профиль действия.\nНаиболее выраженный эффект поднятия настроения (Mood lift).\nДействует мягко, без "трясучки" или чрезмерной сонливости.\nИдеален для борьбы со стрессом и тревогой.'
  }
];

const specLabels = {
  speed: 'Скорость',
  duration: 'Длительность',
  character: 'Характер'
};
</script>

<style src="./origins.scss" lang="scss" scoped></style>

<template>
  <section class="kratom-regions-section">
    <div
      class="origins-ribbon"
      ref="ribbonRef"
      :class="{ 'is-overflowing': isOverflowing }"
      :style="{ '--overlap': `${overlapPx}px`}"
    >
      <div class="header-card">
        <h3 class="header-card__title">Откройте для себя разнообразие сортов из разных уголков мира</h3>
        <nuxt-img 
          ref="packImg"
          src="/images/landing/product.png" 
          alt="Vivadzen Kratom Pack" 
          width="506"
          height="776"
          quality="90"
          fit="cover"
          sizes="mobile: 100vw tablet: 550px desktop: 550px"
          class="header-card__img"
        />
      </div>
      <div
        v-for="(origin, index) in origins"
        :key="origin.name"
        :class="{ active: index === activeIndex }"
        :style="{ zIndex: (index === activeIndex ? origins.length + 10 : index + 1), '--bg-color': origin.bgColor, '--color': origin.color }"
        @mouseover="activeHandler(index)"
        class="origin-card"
      >
        <div class="origin-card__title">
          <span class="big">{{ origin.name }}</span>
          <span class="same"> kratom</span>
        </div>
        <div class="origin-card__content">
          <div class="origin-card__media">
            <transition name="media-switch" mode="out-in">
              <video
                v-if="index === activeIndex"
                :key="`video-${origin.name}`"
                :src="origin.video"
                autoplay
                loop
                muted
                playsinline
                preload="metadata"
              ></video>
              <nuxt-img
                v-else
                :key="`image-${origin.name}`"
                :src="origin.img"
                :alt="origin.name"
                class="origin-card__image"
              />
            </transition>
          </div>
          <div class="origin-card__specs">
            <p class="origin-card__subtitle">{{ origin.subtitle }}</p>
            <div v-for="(value, key) in origin.specs" :key="key" class="spec-pill">
              <span class="spec-pill__label">{{ specLabels[key] }}</span>
              <span class="spec-pill__value">{{ value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
