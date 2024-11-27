<template>
  <HeaderProtected></HeaderProtected>
 <section class="container-fluid">
   <div class="row">
     <div class="col-12 m-0 p-0 col-lg-2 blue-color-bg ">
       <HeaderAdmin></HeaderAdmin>
     </div>
     <div class="col-12 col-lg-10 ">
       <main>
         <RouterView></RouterView>
       </main>
     </div>
   </div>
 </section>
 <FooterComponent></FooterComponent>
</template>
<script setup>
import  FooterComponent from '../../components/FooterComponent.vue'
import HeaderAdmin from '../header/HeaderAdminComponent.vue'
import HeaderProtected from '../header/HeaderProtected.vue';
</script>
<style>
@media (min-width: 992px) {
 .min-width-200 {
 min-width: 200px;
}
 .dashboard {
   display: grid;
   grid-template-columns: repeat(auto-fill,minmax(200px,1fr));
   background-color: teal;
   height: 100vh;
   width: 100vw;
}


}
</style>

