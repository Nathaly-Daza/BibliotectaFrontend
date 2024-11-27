<template>
  <div class="app-container">
    <HeaderMainComponent></HeaderMainComponent>
    <main class="main-content">
      <RouterView></RouterView>
    </main>
    <FooterComponent></FooterComponent>
  </div>
</template>

<script setup>
import FooterComponent from '../../components/FooterComponent.vue'
import HeaderMainComponent from '../header/HeaderMainComponent.vue';
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1; /* Este estilo hace que el contenido principal ocupe todo el espacio disponible */
}
</style>
