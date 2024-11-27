<template>
  <span class="loader"></span>
  <span class="visually-hidden">Loading...</span>

  <div class="loading">
    <img src="../assets/logo-ue-white.png" alt="Logo de la empresa">
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30vh;
  /* Ajusta esta altura según tus necesidades */
}

.loading img {
  width: 100px;
  /* Ajusta el tamaño del logo según tus necesidades */
  animation: spin 2s linear infinite;
  /* Agrega la animación 'spin' con duración de 2 segundos y repetición infinita */
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
    /* Estado inicial */
  }

  100% {
    transform: rotate(360deg);
    /* Estado final */
  }
}


@keyframes drawLine {

  0%,
  100% {
    width: 0px
  }

  45%,
  55% {
    width: 200px
  }
}
</style>