<template>
  <div class="container">
     <!-- style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 9999; opacity: 0.8;" -->
    <the-breadcrumbs-skeleton></the-breadcrumbs-skeleton>

    <div class="header">
      <div class="name"></div>
      <div class="code"></div>
      
      <div class="header-reviews">
        <div class="rating"></div>
        <div class="reviews"></div>
      </div>

      <div class="like-comp"></div>
    </div>

    <div class="tab-wrapper">
      <div class="tab"></div>
    </div>

    <div class="content">
      <!-- LEFT SIDE -->
      <div class="content-main">
        <div class="gallery"></div>
        <div class="description"></div>
      </div>

      <!-- RIGHT SIDE -->
      <div class="content-sale">
        <div class="price"></div>
        <div class="buy-button"></div>
        <div class="features"></div>
        <div class="attributes"></div>
        <div class="delivery"></div>
      </div>
    </div>
  </div>
</template>

<style src="./skeleton.scss" lang="scss" scoped></style>