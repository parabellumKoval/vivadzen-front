<script setup lang="ts">
const {t} = useI18n()
const {confirm: confirmAge} = useAgeGate()

const acceptHandler = () => {
  confirmAge()
  useModal().close()
}

const declineHandler = () => {
  if(process.client) {
    window.location.href = 'https://www.google.com'
  }
}
</script>

<style scoped lang="scss">
.age-gate {
  width: 100%;
  background: $color-bg;
  border-radius: $radiusBtn $radiusBtn 0 0;
  padding: 20px 18px;
  box-shadow: 0 20px 40px rgba(14, 27, 47, 0.15);
  display: flex;
  flex-direction: column;
  gap: 16px;
  @include desktop {
    flex-direction: row;
    align-items: center;
    gap: 24px;
    padding: 16px 32px;
    max-width: 820px;
    border-radius: $radiusBtn;
  }

  &__text {
    display: flex;
    gap: 16px;
    align-items: center;
  }

  &__badge {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: $color-bg-2;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 18px;
    color: $color-1;
    flex-shrink: 0;
  }

  &__title {
    font-size: 16px;
    line-height: 1.3;
    font-weight: 600;
    margin-bottom: 4px;
  }

  &__description {
    font-size: 14px;
    line-height: 1.4;
    color: $color-3;
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    @include desktop {
      flex-direction: row;
      width: auto;
      gap: 12px;
    }
  }

  &__button {
    width: 100%;
    @include desktop {
      width: auto;
      min-width: 170px;
    }
  }
}
</style>

<template>
  <div class="age-gate">
    <div class="age-gate__text">
      <div class="age-gate__badge">18+</div>
      <div>
        <div class="age-gate__title">{{ t('age_gate.title') }}</div>
        <p class="age-gate__description">{{ t('age_gate.description') }}</p>
      </div>
    </div>
    <div class="age-gate__actions">
      <button @click="acceptHandler" class="button primary age-gate__button">
        {{ t('age_gate.confirm') }}
      </button>
      <button @click="declineHandler" class="button secondary age-gate__button">
        {{ t('age_gate.decline') }}
      </button>
    </div>
  </div>
</template>
