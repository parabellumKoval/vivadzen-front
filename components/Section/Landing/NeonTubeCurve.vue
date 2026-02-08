<template>
  <div class="neon-container">
    <svg 
      viewBox="0 0 800 600" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      class="neon-svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        
        <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#2ee89e" />
          <stop offset="50%" stop-color="#a2ffda" />
          <stop offset="100%" stop-color="#2ee89e" />
        </linearGradient>
      </defs>

      <path 
        id="mainPath"
        d="M50,100 C250,100 350,300 550,300 S750,500 750,500" 
        stroke-linecap="round"
      />

      <use href="#mainPath" class="layer-glow" />

      <use href="#mainPath" class="layer-glass" />

      <use href="#mainPath" class="layer-liquid" />

      <use href="#mainPath" class="layer-highlight" />
    </svg>

    <slot />
  </div>
</template>

<style scoped lang="scss">
.neon-container {
  position: relative;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  background: #f1e9d2; /* Цвет фона как на скрине */
  padding: 50px 0;
}

.neon-svg {
  width: 100%;
  height: auto;
  overflow: visible;
}

/* Общие стили для всех слоев пути */
path, use {
  fill: none;
  transition: all 0.3s ease;
}

/* 1. Свечение */
.layer-glow {
  stroke: #2ee89e;
  stroke-width: 25px;
  filter: blur(5px);
  opacity: 0.1;
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
}

/* 2. Стеклянная трубка */
.layer-glass {
  stroke: rgba(255, 255, 255, 0.2);
  stroke-width: 18px;
  stroke-opacity: 0.5;
}

/* 3. Жидкость (с анимацией "перетекания") */
.layer-liquid {
  stroke: url(#liquidGradient);
  stroke-width: 10px;
  stroke-dasharray: 2000;
  stroke-dashoffset: 1000;
  animation: flow 15s linear;
  filter: drop-shadow(0 0 5px #2ee89e);
}

/* 4. Блик на стекле (создает эффект объема) */
.layer-highlight {
  stroke: white;
  stroke-width: 2px;
  stroke-opacity: 0.6;
  stroke-dasharray: 150 200; /* Делаем прерывистым для реализма */
  transform: translate(-2px, -3px); /* Смещаем чуть в сторону */
  filter: blur(1px);
}

// @keyframes flow {
//   from { stroke-dashoffset: 2000; }
//   to { stroke-dashoffset: 0; }
// }
</style>