<script setup>
import { RouterView, useRouter } from "vue-router";
import { useAuthStore } from './stores/authStore';
import { onMounted, onUnmounted } from 'vue';
import Swal from 'sweetalert2';
import { useI18n } from 'vue-i18n';
import CryptoJS from 'crypto-js';

const { t } = useI18n();

const router = useRouter();
const authStore = useAuthStore();
let inactivityTimer;
let countdownTimer;

// Clave secreta para AES
const secretKey = 'TuClaveSecreta';

// Función para cerrar la sesión debido a la inactividad
const logoutDueToInactivity = async () => {
  if (localStorage.getItem('id')) {
    const use_id = CryptoJS.AES.decrypt(localStorage.getItem('id'), secretKey).toString(CryptoJS.enc.Utf8);

    await authStore.logout(use_id);
    router.push('/');

  }
};

// Función para reiniciar el temporizador de inactividad
const resetInactivityTimer = () => {
  clearTimeout(inactivityTimer);
  clearTimeout(countdownTimer);

  if (localStorage.getItem('id')) {
    inactivityTimer = setTimeout(logoutDueToInactivity, 1800000); // 30 minutos en milisegundos
    countdownTimer = setTimeout(showInactivityAlert, 1680000); // 28 minutos en milisegundos
  }
};

// Función para cerrar la alerta después de un tiempo determinado
const resetAlertTimer = () => {
  clearTimeout(countdownTimer);
  countdownTimer = setTimeout(() => {
    Swal.close();
    logoutDueToInactivity(); // Cerrar sesión si no se confirmó la alerta
  }, 1800000); // 30 minutos en milisegundos
};

// Función para mostrar la alerta de inactividad
const showInactivityAlert = () => {
  Swal.fire({
    icon: 'warning',
    title: t('errors.warning'),
    text: t('errors.warningLabel'),
    timer: 120000, // 2 minutos en milisegundos 
    timerProgressBar: true,
    showConfirmButton: true,
    confirmButtonText: t('errors.confirmLabel'),
    confirmButtonColor: '#0e1f87',
    allowOutsideClick: false
  }).then((result) => {
    if (result.isConfirmed) {
      // Si se confirma la alerta, reiniciar el temporizador
      resetInactivityTimer();
    } else {
      // Si se cierra la alerta sin confirmar, cerrar sesión
      logoutDueToInactivity();
    }
  });

  // Reiniciar el temporizador de alerta
  resetAlertTimer();
};

// Configurar manejadores de eventos para reiniciar los temporizadores de inactividad y alerta
onMounted(() => {
  resetInactivityTimer();

  document.addEventListener("mousemove", resetInactivityTimer);
  document.addEventListener("scroll", resetInactivityTimer);
  document.addEventListener("keydown", resetInactivityTimer);
  document.addEventListener("resize", resetInactivityTimer);
  document.addEventListener("touchmove", resetInactivityTimer);
  document.addEventListener("wheel", resetInactivityTimer);

});

// Eliminar todos los manejadores de eventos cuando el componente se desmonta
onUnmounted(() => {
  clearTimeout(inactivityTimer);
  clearTimeout(countdownTimer);

  document.removeEventListener("mousemove", resetInactivityTimer);
  document.removeEventListener("scroll", resetInactivityTimer);
  document.removeEventListener("keydown", resetInactivityTimer);
  document.removeEventListener("resize", resetInactivityTimer);
  document.removeEventListener("touchmove", resetInactivityTimer);
  document.removeEventListener("wheel", resetInactivityTimer);
});
</script>
<template>
  <RouterView />
</template>
