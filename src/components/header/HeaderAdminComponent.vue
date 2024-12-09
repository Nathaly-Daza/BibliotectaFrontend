<template>
  <nav class="navbarl navbar-expand-lg ">
    <button @click="toggleAnimation" class="navbar-toggler  " type="button" data-bs-toggle="collapse"
      data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false"
      aria-label="Toggle navigation">
      <div class="animated-icon3" :class="{ open: isAnimated }">
        <span></span><span></span><span></span>
      </div>

    </button>
    <div class="collapse navbar-collapse justify-content-end  m-0 p-0" :class="{ 'show': isMenuOpen }"
      id="navbarNavAltMarkup">

      <div class="menu-items ">
        <div  active-class="active" class="side-title">
          <div class="link-container fw-bold">
            {{ $t('titles.reservations') }}
          </div>
        </div>
       
          <RouterLink to="/reservations" @click="closeMenu" active-class="active" class="side-btn">
          <div class="link-container"><i class="ri-contacts-book-3-fill"></i>
            {{ $t('titles.spacesReserv') }}

          </div>
        </RouterLink>
       
        <RouterLink to="/services" @click="closeMenu" active-class="active" class="side-btn">
          <div class="link-container"><i class="bi bi-book-fill"></i>
            {{ $t('titles.servicesReserv') }}

          </div>
        </RouterLink>
        <div  active-class="active" class="side-title">
          <div class="link-container fw-bold">
            {{ $t('titles.management') }}

          </div>
        </div>
        <RouterLink to="/spaces" @click="closeMenu" active-class="active" class="side-btn">
          <div class="link-container"><i class="bi bi-person-workspace"></i>
            {{ $t('titles.spaces') }}
          </div>
        </RouterLink>
      
        <RouterLink to="/servicesTypes" @click="closeMenu" active-class="active" class="side-btn">
          <div class="link-container"><i class="bi bi-clipboard-fill"></i>
            {{ $t('titles.services') }}
          </div>
        </RouterLink>
        
        
        <button class="side-log text-start" @click="logoutUser"><i
            class="ri-logout-box-r-fill"></i>{{ $t('buttons.logout') }}</button>

      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from "../../stores/authStore";
import { RouterLink } from "vue-router";
import { ref } from "vue";
import { useRouter } from "vue-router";
import CryptoJS from 'crypto-js';

const userAuth = useAuthStore();
const router = useRouter();

//logout cerrar sesion lcth
const secretKey = 'TuClaveSecreta'
const use_id = CryptoJS.AES.decrypt(localStorage.getItem('id'), secretKey).toString( CryptoJS.enc.Utf8 )

const logoutUser = async () => {
 await userAuth.logout(use_id)
 
  router.push('/')

  //console.log(use_id)
}



//animaciones para el button hamburger lcth
const isAnimated = ref(false);
const isMenuOpen = ref(false);

const toggleAnimation = () => {
  isAnimated.value = !isAnimated.value;
  isMenuOpen.value = !isMenuOpen.value;
};
const closeMenu = () => {
  isMenuOpen.value = false;
  isAnimated.value = !isAnimated.value;
};

</script>

<style lang="scss" scoped>
.border--md {
  border: 2px solid var(--blue-color)
}

.navbarl {
  --bs-navbar-padding-x: 0;
  --bs-navbar-padding-y: 0.5rem;
  --bs-navbar-toggler-padding-y: 0.25rem;
  --bs-navbar-toggler-padding-x: 0.75rem;
  --bs-navbar-toggler-focus-width: 0rem;
  --bs-navbar-toggler-transition: box-shadow 0.15s ease-in-out;
  position: relative;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding: var(--bs-navbar-padding-y) var(--bs-navbar-padding-x);
}

.menu-items {
  display: flex;
  flex-direction: column;
  margin-top: 43px;
}

.menu-items>* {
  margin-top: 10px;
}

.side-btn {
  border: none;
  padding: 10px 40px;
  min-width: 190px;
  cursor: pointer;
  font-size: 18px;
  text-decoration: none;
  color: white;
  background-color: transparent;
}

.side-title {
  border: none;
  padding: 10px 15px;
  min-width: 190px;
  cursor: pointer;
  font-size: 22px;
  text-decoration: none;
  color: white;
  background-color: transparent;
}
.side-log {
  border: none;
  padding: 10px 15px;
  min-width: 190px;
  cursor: pointer;
  font-size: 18px;
  text-decoration: none;
  color: white;
  background-color: transparent;
}

.side-btn:focus {
  outline: none;
}

.side-btn.active {
  position: relative;
  background-color: white;
  text-align: center;
  color: var(--blue-color);
  font-weight: 600;
  font-size: 20px;
  border-radius: 30px 0 0 30px;
}

.side-btn.active::before {
  top: -30px;
}

.side-btn.active::after {
  bottom: -30px;
}

.side-btn.active::before,
.side-btn.active::after {
  position: absolute;
  content: "";
  right: 0;
  height: 30px;
  width: 30px;
  background-color: white;
}

.side-btn.active .link-container::before {
  top: -60px;
}

.side-btn.active .link-container::after {
  bottom: -60px;
  z-index: 99;
}

.side-btn.active .link-container::before,
.side-btn.active .link-container::after {
  position: absolute;
  content: "";
  right: 0px;
  height: 60px;
  width: 60px;
  border-radius: 50%;
  background-color: var(--blue-color);
}

/* Icon  hamburger 1 */

.animated-icon1,
.animated-icon2,
.animated-icon3 {
  width: 30px;
  height: 20px;
  position: relative;
  margin: 0px;
  -webkit-transform: rotate(0deg);
  -moz-transform: rotate(0deg);
  -o-transform: rotate(0deg);
  transform: rotate(0deg);
  -webkit-transition: .5s ease-in-out;
  -moz-transition: .5s ease-in-out;
  -o-transition: .5s ease-in-out;
  transition: .5s ease-in-out;
  cursor: pointer;
}

.animated-icon1 span,
.animated-icon2 span,
.animated-icon3 span {
  display: block;
  position: absolute;
  height: 3px;
  width: 100%;
  border-radius: 9px;
  opacity: 1;
  left: 0;
  -webkit-transform: rotate(0deg);
  -moz-transform: rotate(0deg);
  -o-transform: rotate(0deg);
  transform: rotate(0deg);
  -webkit-transition: .25s ease-in-out;
  -moz-transition: .25s ease-in-out;
  -o-transition: .25s ease-in-out;
  transition: .25s ease-in-out;
}

.animated-icon1 span {
  background: #2d7ef7;
}

.animated-icon2 span {
  background: #e3f2fd;
}

.animated-icon3 span {
  background: #f3e5f5;
}

.animated-icon1 span:nth-child(1) {
  top: 0px;
}

.animated-icon1 span:nth-child(2) {
  top: 10px;
}

.animated-icon1 span:nth-child(3) {
  top: 20px;
}

.animated-icon1.open span:nth-child(1) {
  top: 11px;
  -webkit-transform: rotate(135deg);
  -moz-transform: rotate(135deg);
  -o-transform: rotate(135deg);
  transform: rotate(135deg);
}

.animated-icon1.open span:nth-child(2) {
  opacity: 0;
  left: -60px;
}

.animated-icon1.open span:nth-child(3) {
  top: 11px;
  -webkit-transform: rotate(-135deg);
  -moz-transform: rotate(-135deg);
  -o-transform: rotate(-135deg);
  transform: rotate(-135deg);
}

/* Icon 3*/

.animated-icon2 span:nth-child(1) {
  top: 0px;
}

.animated-icon2 span:nth-child(2),
.animated-icon2 span:nth-child(3) {
  top: 10px;
}

.animated-icon2 span:nth-child(4) {
  top: 20px;
}

.animated-icon2.open span:nth-child(1) {
  top: 11px;
  width: 0%;
  left: 50%;
}

.animated-icon2.open span:nth-child(2) {
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  -o-transform: rotate(45deg);
  transform: rotate(45deg);
}

.animated-icon2.open span:nth-child(3) {
  -webkit-transform: rotate(-45deg);
  -moz-transform: rotate(-45deg);
  -o-transform: rotate(-45deg);
  transform: rotate(-45deg);
}

.animated-icon2.open span:nth-child(4) {
  top: 11px;
  width: 0%;
  left: 50%;
}

/* Icon 4 */

.animated-icon3 span:nth-child(1) {
  top: 0px;
  -webkit-transform-origin: left center;
  -moz-transform-origin: left center;
  -o-transform-origin: left center;
  transform-origin: left center;
}

.animated-icon3 span:nth-child(2) {
  top: 10px;
  -webkit-transform-origin: left center;
  -moz-transform-origin: left center;
  -o-transform-origin: left center;
  transform-origin: left center;
}

.animated-icon3 span:nth-child(3) {
  top: 20px;
  -webkit-transform-origin: left center;
  -moz-transform-origin: left center;
  -o-transform-origin: left center;
  transform-origin: left center;
}

.animated-icon3.open span:nth-child(1) {
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  -o-transform: rotate(45deg);
  transform: rotate(45deg);
  top: 0px;
  left: 8px;
}

.animated-icon3.open span:nth-child(2) {
  width: 0%;
  opacity: 0;
}

.animated-icon3.open span:nth-child(3) {
  -webkit-transform: rotate(-45deg);
  -moz-transform: rotate(-45deg);
  -o-transform: rotate(-45deg);
  transform: rotate(-45deg);
  top: 21px;
  left: 8px;
}

@media only screen and (max-width: 1700px) {

  .navbar-collapse.show .side-btn {
    color: white; // Cambiar el color del texto de los botones del menú colapsado a azul

  }

  .navbar-collapse.show .side-btn.active .link-container::before,
  .navbar-collapse.show .side-btn.active .link-container::after {
    border-radius: 0;
    // Cambiar el color de fondo de los círculos alrededor de los íconos en el menú colapsado a blanco
  }

  .navbar-collapse.show .side-btn.active {
    background-color: white; // Cambiar el color de fondo de los botones activos en el menú colapsado a transparente
    color: var(--blue-color);
    border-radius: 30px // Cambiar el color del texto de los botones activos en el menú colapsado a blanco

  }
}
</style>
