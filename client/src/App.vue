<script setup>
</script>

<template>
  <div class="container">
    <router-view></router-view>
  </div>
</template>

<style scoped>
* {
  margin: 0;
}

.container {
  background: linear-gradient(-45deg, rgb(225, 190, 124), rgb(223, 130, 116));
  width: 100vw;
  height: auto;
  min-height: 100vh;
}
</style>
