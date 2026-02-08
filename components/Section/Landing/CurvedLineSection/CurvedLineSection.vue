<template>
  <section class="curved-line-section">
    <svg
      class="curved-line-section__svg"
      viewBox="0 0 1200 1310"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        class="curved-line-section__path"
        d="M5 5 V155 A100 100 0 0 1 105 255 H1095 A100 100 0 0 1 1195 355 V955 A100 100 0 0 1 1095 1055 H105 A100 100 0 0 1 5 1155 V1305"
      />
    </svg>
    <div class="container curved-line-section__content">
      <slot />
    </div>
  </section>
</template>

<style src="./curved-line-section.scss" lang="scss" scoped></style>
