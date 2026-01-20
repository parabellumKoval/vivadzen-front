<script setup>
  const activeIndex = ref(0);
  const activeHandler = (index) => {
    activeIndex.value = index;
  };

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
    video: '/video/regions/Sumatra.mp4',
    img: '/images/landing/regions/maengda.png',
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
    video: '/video/regions/Sumatra.mp4',
    img: '/images/landing/regions/malay.png',
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
    video: '/video/regions/Sumatra.mp4',
    img: '/images/landing/regions/thai.png',
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
    video: '/video/regions/Borneo.mp4',
    img: '/images/landing/regions/borneo.png',
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
    video: '/video/regions/Sumatra.mp4',
    img: '/images/landing/regions/sumatra.png',
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
    <div class="origins-ribbon">
      <div class="header-card">
        <h3 class="header-card__title">Откройте для себя разнообразие сортов кратома из разных уголков мира</h3>
      </div>
      <div v-for="(origin, index) in origins" :key="origin.name" :class="{active: index === activeIndex}" @mouseover="activeHandler(index)" class="origin-card">
        <div class="origin-card__title">
          <span class="big">{{ origin.name }}</span>
          <span class="same"> kratom</span>
        </div>
        <div class="origin-card__content">
          <div class="origin-card__media">
            <!-- <video
              :src="origin.video"
              autoplay
              loop
              muted
              playsinline
              preload="metadata"
            ></video> -->
            <nuxt-img :src="origin.img" :alt="origin.name" class="origin-card__image" />
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
