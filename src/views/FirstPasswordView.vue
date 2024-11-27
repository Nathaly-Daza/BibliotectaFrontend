<template>
  <div class="container">
    <div class="row justify-content-center align-items-center" style="height: 100vh;">
      <div class="col-md-6">
        <div class="card shadow bg-body-tertiary rounded p-5">
          <h3>{{ $t('titles.changePassword') }}</h3>

          <form @submit.prevent="changePassword">
            <label for="currentPassword">{{ $t('profile.password') }} </label>
            <div class="input-group flex-nowrap">
              <input type="password" class="form-control ps-3" aria-describedby="password" v-model="currentPassword"
                id="txtPassword" required autocomplete="current-password" />
              <span v-on:click="showPassword('txtPassword')" id="show_password" class="btn btn-outline-dark"
                type="button">
                <span class="icon fa fa-eye-slash"></span>
              </span>
            </div>

            <label for="newPassword">{{ $t('profile.changePassword') }}</label>
            <div class="input-group flex-nowrap">
              <input type="password" class="form-control ps-3" aria-describedby="password" v-model="newPassword"
                id="txtNewPassword" required autocomplete="new-password" />

              <span v-on:click="showPassword('txtNewPassword')" id="show_newpassword" class="btn btn-outline-dark"
                type="button">
                <span class="icon fa fa-eye-slash"></span>
              </span>
            </div>
            <span class="text-danger" v-if="passwordError">
              <i class="bi bi-exclamation-circle-fill"></i> {{
            passwordError }}
            </span><br>

            <label for="confirmPassword">{{ $t('profile.passwordConfirm') }}</label>
            <div class="input-group flex-nowrap">
              <input type="password" class="form-control ps-3" aria-describedby="password" v-model="confirmPassword"
                id="txtConfirmPassword" required autocomplete="new-password" />

              <span v-on:click="showPassword('txtConfirmPassword')" id="show_passwordConfirm"
                class="btn btn-outline-dark" type="button">
                <span class="icon fa fa-eye-slash"></span>
              </span>
            </div>
            <span v-if="confirmPassword !== ''" v-bind:class="{
            'bi bi-check-circle-fill text-success': passwordsNotMatching.isValid,
            'bi-exclamation-circle-fill text-danger': !passwordsNotMatching.isValid
          }">
              <i class="bi"></i> {{ passwordsNotMatching.message }}
            </span>
            <div class="row">
              <div class="col-md-12 d-flex justify-content-center p-3">
                <button type="submit"  class="btn btn-custom fw-semibold mx-2" v-bind:disabled="passwordError || !passwordsNotMatching.isValid">
                  {{ $t('buttons.send') }}
                </button>
                <button type="submit"  class="btn btn-cancel fw-semibold" @click="logoutUser">
                  {{ $t('buttons.cancel') }}
                </button>

              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import CryptoJS from 'crypto-js';
import { usePersonsStore } from '../stores/personsStore'
import { showPassword, validateNewPassword, validateSame } from '../validations'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../stores/authStore'

import { useRouter } from 'vue-router'
const userAuth = useAuthStore()
const router = useRouter()
const { t } = useI18n()
const personStore = usePersonsStore()

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const message = ref('')
const secretKey = "TuClaveSecreta";

const use_id = CryptoJS.AES.decrypt(localStorage.getItem("id"), secretKey).toString(
  CryptoJS.enc.Utf8
);
const changePassword = async () => {
  try {
    const hashedPassword = CryptoJS.SHA256(currentPassword.value).toString()
    const hashedPasswordNew = CryptoJS.SHA256(newPassword.value).toString()
    const hashedPasswordValidation = CryptoJS.SHA256(confirmPassword.value).toString()
    // Llama a la función de la tienda de personas para cambiar la contraseña
   const update = await personStore.updatePassword(hashedPassword, hashedPasswordNew, hashedPasswordValidation)
   if (update === true) {
    logoutUser()
   } else {
    return ''
   }

    //console.log(hashedPassword, hashedPasswordNew, hashedPasswordValidation)
    // Si no hay errores, muestra un mensaje de éxito
    message.value = '¡La contraseña ha sido cambiada exitosamente!'
  } catch (error) {
    // Si hay errores, muestra un mensaje de error
    message.value = 'Hubo un error al cambiar la contraseña. Por favor, inténtalo de nuevo.'
  }
}

const validatePasswordWrapper = () => {
  return validateNewPassword(
    newPassword.value,
    t('validations.password.invalidFormat')
  )
}
const passwordError = computed(() => {
  return validatePasswordWrapper()
})

const validatePasswordSameWrapper = () => {
  return validateSame(
    newPassword.value,
    confirmPassword.value,
    t('validations.password.notSame'),
    t('validations.password.same')
  );
}

const passwordsNotMatching = computed(() => {
  return validatePasswordSameWrapper();
});


//logout cerrar sesion 
const logoutUser = async () => {
  await userAuth.logout(use_id)
  //console.log('salida exitosa')
  router.push('/')
}
</script>

<style lang="scss" >
@import '../assets/main.css';

</style>
