<script setup>

</script>

<style src="./skeleton.scss" lang="scss" scoped />

<template>
  <div class="card">

    <div class="image"></div>
    
    <div class="reviews">
      <simple-stars :amount="5" class="reviews-rating"></simple-stars>
      
      <div class="reviews-btn"></div>
    </div>

    <div class="name-wrapper">
      <div class="name name-1"></div>
      <div class="name name-2"></div>
    </div>

    <hr class="line">

    <div class="amount"></div>

    <div class="sale">
      <div class="button small buy-btn">
      </div>
      <div class="price"></div>
    </div>

  </div>
</template>