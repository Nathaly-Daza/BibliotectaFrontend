<template>
  <header class="container-fluid border-bottom shadow pt-2 aling-items-center align-content-center">
     <div class="row">
       <div class="col-6 col-md-10">
         <div class="pb-2 ps-md-5 ms-md-3">
          <a href="#" class="logo-link"></a>
         </div>
       </div>  
       <div class="col-6 col-md-2 p-md-3 py-2 text-end text-sm-end text-md-center align-items-center">
       
        <Language></Language>
        </div>  
     </div>
   </header>
   
  </template>
  <script setup>
  import Language from '../LanguageComponent.vue';
   
  </script>
  <style lang="scss" scoped>
   
  .logo-link {
  display: inline-block;
  margin: 0 8%;
  width: 300.47px; /* Ancho original de la imagen */
  height: 75px; /* Alto original de la imagen */
  background-image: url('../../assets/logo-uniempresarial.webp'); /* URL de la imagen original */
  background-size: contain;
  background-repeat: no-repeat;
}

@media (max-width: 460px) {
  .logo-link {
    background-image: url('../../assets/logo-ue-white.png'); /* URL de la nueva imagen para pantallas anchas */
    width: 400.47px; /* Ancho original de la imagen */
  height: 100px; 
 
  }
}
  </style>