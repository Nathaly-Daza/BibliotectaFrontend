<template>
  <header class="container-fluid border-bottom shadow pt-2">
    <div class="row justify-content-start align-items-center px-md-5">
      <div class="col-4 col-md-5  ">
        <div class="foto">
          <a href="#" class="logo-link"></a>
        </div>
      </div>
      <div class="col-4 col-md-4 text-center ">
        <h1 class="red-color-text title ">{{ $t('titles.titleGeneral') }}</h1>
      </div>
      <div class="col-4 col-md-3  text-end ">
        <ProfileComponent></ProfileComponent>
        <changePhoto/>
      </div>
    </div>
  </header>
</template>

<script setup>
import changePhoto from "../changePhoto.vue";
import ProfileComponent from '../../components/ProfileComponent.vue';
import { usePersonsStore } from "../../stores/personsStore.js";
const profileStore = usePersonsStore();
profileStore.readPersonDetailsById()
</script>

<style lang="scss" scoped>
.foto{
  width: 300.47px;
}
.logo-link {
  display: inline-block;
  width: 300.47px; /* Ancho original de la imagen */
  height: 80px; /* Alto original de la imagen */
  background-image: url('../../assets/logo-uniempresarial.webp'); /* URL de la imagen original */
  background-size: contain;
  background-repeat: no-repeat;
}
.title{
  font-size: 26px;
  color: var(--red-color);
}

@media (max-width: 850px) {
  .foto{
  width: 100px;
}
  .logo-link {
    background-image: url('../../assets/logo-ue-white.png'); /* URL de la nueva imagen para pantallas anchas */
    width: 100px; /* Ancho original de la imagen */
  height: 100px; 
  }
  .title{
  font-size: 20px;
}

}
</style>
