export default defineNuxtPlugin(() => {
  const setAppHeight = () => {
    const doc = document.documentElement;

    const vh = window.visualViewport
      ? window.visualViewport.height // учитывает клавиатуру и панели
      : window.innerHeight;

    doc.style.setProperty('--app-height', `${vh}px`);
  };

  // начальная установка
  setAppHeight();

  // обычные случаи (поворот, обычный resize)
  window.addEventListener('resize', setAppHeight);
  window.addEventListener('orientationchange', setAppHeight);

  // ВАЖНО: iOS дергает visualViewport, когда:
  // - появляется/пропадает клавиатура
  // - меняется высота из-за UI браузера
  if (window.visualViewport) {
    const vv = window.visualViewport;
    vv.addEventListener('resize', setAppHeight);
    vv.addEventListener('scroll', setAppHeight); // на iOS помогает при анимации панели
  }

  // на всякий случай обновляем при фокусе на инпутах (иногда это единственный триггер)
  document.addEventListener('focusin', setAppHeight);
  document.addEventListener('focusout', setAppHeight);
});