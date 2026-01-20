<script setup>
// const regions = [
//   { name: 'Sumatra', img: '/images/landing/items/circle3-1.png' },
//   { name: 'Borneo', img: '/images/landing/items/circle3-2.png' },
//   { name: 'Maeng Da', img: '/images/landing/items/circle3-3.png' },
//   { name: 'Malay', img: '/images/landing/items/circle3-4.png' },
//   { name: 'Thai', img: '/images/landing/items/circle3-5.png' },
// ];

const colors = [
  { 
    name: 'White', 
    bg: '/images/landing/items/white.png', 
    img: '/images/landing/items/circle2-1.png', 
    title: 'Стимуляция и Концентрация', 
    desc: 'Замена кофе и энергетикам.\nМощный ноотроп для работы мозга.\nМаксимальный заряд бодрости с утра.\nПомощь при тяжелом физическом труде.',
    color: '#f4e6b8',
    effects: [
      {
        label: 'Синдром усталости', // Подобрал под иконку Lightning (Заряд)
        text: 'Борьба с дневной сонливостью, вялостью и хроническим упадком сил.',
        icon: 'ph:lightning'
      },
      {
        label: 'Работа и Учеба', // Подобрал под иконку Brain (Мозг)
        text: 'Фокус внимания, программирование, написание текстов, работа с данными.',
        icon: 'ph:brain'
      },
      {
        label: 'Ясность ума', // Подобрал под иконку Arrow-Up (Рост/Подъем)
        text: 'Убирает мозговой туман, повышает скорость мышления и мотивацию.',
        icon: 'ph:arrow-up'
      },
      {
        label: 'Спорт и Тренировки', // Подобрал под иконку Run (Бег)
        text: 'Предтренировочный комплекс, повышение выносливости, кардио нагрузки.',
        icon: 'ph:person-simple-run'
      }
    ]
  },
  { 
    name: 'Green', 
    bg: '/images/landing/items/green.png', 
    img: '/images/landing/items/circle2-3.png', 
    title: 'Социум и Настроение', 
    desc: 'Социальная смазка и уверенность.\nПриродный антидепрессант.\nПодъем настроения без гиперактивности.\nКомфортное состояние для переговоров.',
    color: '#73c56f',
    effects: [
      {
        label: 'Социальная тревожность', // Под иконку Chats
        text: 'Страх общения, зажатость на людях, неуверенность в себе.',
        icon: 'ph:chats'
      },
      {
        label: 'Депрессия и Апатия', // Под иконку Battery (Подзарядка)
        text: 'Отсутствие интереса к жизни, плохое настроение, уныние.',
        icon: 'ph:battery-medium'
      },
      {
        label: 'Креативность', // Под иконку Wind (Поток)
        text: 'Мозговой штурм, творческие задачи, генерация идей.',
        icon: 'ph:wind'
      },
      {
        label: 'Активный отдых', // Под иконку Bandaids (Тут иконка спорная, но оставил как есть)
        text: 'Прогулки, встречи с друзьями, вечеринки, публичные выступления.',
        icon: 'ph:bandaids'
      }
    ]
  },
  { 
    name: 'Red', 
    bg: '/images/landing/items/red.png', 
    img: '/images/landing/items/circle2-2.png', 
    title: 'Обезболивание и Сон', 
    desc: 'Природный анальгетик.\nАльтернатива аптечным обезболивающим.\nМощное седативное действие.\nПомощь при зависимости от опиатов.',
    color: '#d16d3e',
    effects: [
      {
        label: 'Хронические боли', // Под иконку First Aid
        text: 'Грыжи, боли в спине, артрит, травмы, мышечные боли.',
        icon: 'ph:first-aid-kit'
      },
      {
        label: 'Бессонница', // Под иконку Moon
        text: 'Трудности с засыпанием, прерывистый сон, беспокойные ноги.',
        icon: 'ph:moon'
      },
      {
        label: 'Высокий стресс', // Под иконку Walk (Расслабленная прогулка)
        text: 'Нервное перенапряжение, невозможность расслабиться после работы.',
        icon: 'ph:person-simple-walk'
      },
      {
        label: 'Синдром отмены', // Под иконку Shield (Защита/Помощь)
        text: 'Снятие ломки, отказ от тяжелых веществ, облегчение абстиненции.',
        icon: 'ph:shield-check'
      }
    ]
  },
  { 
    name: 'Gold', 
    bg: '/images/landing/items/gold.png', 
    img: '/images/landing/items/circle2-4.png', 
    title: 'Спокойствие и Анти-стресс', 
    desc: 'Средство от тревоги и паники.\nЭмоциональная перезагрузка.\nГлубокое чувство комфорта.\nВосстановление нервной системы.',
    color: '#dfc157',
    effects: [
      {
        label: 'Эмоциональное выгорание', // Под иконку Smiley
        text: 'Усталость от общения, раздражительность, нервное истощение.',
        icon: 'ph:smiley'
      },
      {
        label: 'Тревожное расстройство', // Под иконку Hand-Heart
        text: 'Навязчивые мысли, постоянное беспокойство, ожидание плохого.',
        icon: 'ph:hand-heart'
      },
      {
        label: 'Панические атаки', // Под иконку Heart
        text: 'Внезапные приступы страха, учащенное сердцебиение, нервная дрожь.',
        icon: 'ph:heart'
      },
      {
        label: 'Вечерний релакс', // Под иконку Leaf
        text: 'Просмотр кино, чтение, медитация, спокойный отдых дома.',
        icon: 'ph:leaf'
      }
    ]
  }
];
</script>

<template>
  <section class="kratom-variety-section">
    <div class="container">
      <h2 class="kratom-variety-section__title">Твой природный помошник</h2>
      
       <!-- <section-landing-kratom-variety-origins /> -->

      <div class="kratom-variety-section__colors">
        <div class="kratom-variety-section__subtitle">Подберите свой идеальный цвет кратома:</div>
        <div class="colors-list">
          <div v-for="color in colors" :key="color.name" class="color-item">
            <div class="color-item__image-wrapper">
              <nuxt-img :src="color.bg" :alt="color.name" class="color-item__image" />
            </div>
            <p class="color-item__name">
              <span class="big">{{ color.name }}</span>
              <span class="same" :style="{ color: color.color }"> kratom</span>
            </p>
            <div class="color-item__desc">{{ color.desc }}</div>
          </div>
        </div>
        <div class="color-effects-section">
          <div class="color-effects-section__divider"></div>
          <div class="color-effects-section__title">Помогает в таких случаях</div>
          <div class="color-effects-section__lists">
            <div v-for="color in colors" :key="`${color.name}-effects`" class="color-item__effects">
              <ul class="effects-list">
                <li v-for="effect in color.effects" :key="effect.label" class="effect-item">
                  <IconCSS :name="effect.icon" class="effect-item__icon" :style="{ color: color.color }" />
                  <div>
                    <strong class="effect-label">{{ effect.label }}</strong> 
                    <div class="effect-desc">{{ effect.text }}</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <section-landing-kratom-variety-support class="support-box" />
    </div>
  </section>
</template>

<style lang="scss" src="./kratom-variety.scss"></style>
