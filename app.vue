<template>
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <Transition name="page-tr">
      <NuxtPage />
    </Transition>
  </NuxtLayout>
</template>