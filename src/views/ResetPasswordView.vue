<template>
  <div class="container">
    <div class="row justify-content-center align-items-center" style="height: 100vh;">
      <div class="col-md-6">
        <div class="card shadow bg-body-tertiary rounded p-5">
          <h3>{{
            $t('titles.resetPassword') }}</h3>
          
          <form  @submit.prevent="handleSubmitResetPassword">
            <div class="mb-3">
              <label for="newPassword" class="form-label">{{ $t('profile.changePassword')}}</label>
              <div class="input-group flex-nowrap">
                <input type="password" class="form-control ps-3" aria-describedby="password" id="newPassword"
                  v-model="newPassword" required />
                <span v-on:click="showPassword('newPassword')" id="show_password" class="btn btn-outline-dark"
                  type="button">
                  <span class="icon fa fa-eye-slash"></span>
                </span>
                
              </div>
              <span class="text-danger" v-if="passwordError">
                  <i class="bi bi-exclamation-circle-fill"></i> {{
                    passwordError }}
                </span>
            </div>
            <div class="mb-3">
              <label for="confirmPassword" class="form-label">{{ $t('profile.passwordConfirm')}}</label>
              <div class="input-group flex-nowrap">
                <input type="password" class="form-control ps-3" aria-describedby="password" id="confirmPassword"
                  v-model="confirmPassword" required />
                <span v-on:click="showPassword('confirmPassword')" id="show_password" class="btn btn-outline-dark"
                  type="button">
                  <span class="icon fa fa-eye-slash"></span>
                </span>
                
              </div>
              <span v-if="confirmPassword !== ''" v-bind:class="{
                  'bi bi-check-circle-fill text-success': passwordsNotMatching.isValid,
                  'bi-exclamation-circle-fill text-danger': !passwordsNotMatching.isValid
                  }">
                    <i class="bi"></i> {{ passwordsNotMatching.message }}
                </span>
            </div>
            <div class="mb-3">
              <label for="code" class="form-label">{{ $t('profile.code')}}</label>
              <input type="number" v-model="code" class="form-control" id="code" :placeholder="$t('profile.code')">
            </div>
            <div class="row">
              <div class="col-md-12 d-flex justify-content-center">
                <button type="submit" class="btn btn-custom">{{ $t('buttons.send') }} <i
                    class="ri-send-plane-fill"></i></button>
              </div>
            </div>
          </form>
          <div class="text-center pt-3">
            <router-link class="link-dark link-offset-2" to="/"> {{ $t('login.title') }}</router-link><br />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import CryptoJS from 'crypto-js';
import { useAuthStore } from '../stores/authStore';
import { showPassword, validateNewPassword, validateSame  } from '../validations.js';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const authStore = useAuthStore();

const newPassword = ref('');
const confirmPassword = ref('');
const code = ref('');

// Inicialmente mostrar el primer formulario

const handleSubmitResetPassword = async () => {

   // Realizar validaciones
   const isPasswordValid = !passwordError.value;


  // Si no cumple con las validaciones, no enviar el formulario
  if (!isPasswordValid ) {
    return;
  }
  try {
    const encrypPassword = CryptoJS.SHA256(newPassword.value).toString();
  const encrypConfirmPassword = CryptoJS.SHA256(confirmPassword.value).toString();
  //console.log(encrypPassword, encrypConfirmPassword, code.value);
  await authStore.reset(encrypPassword, encrypConfirmPassword, code.value);

  newPassword.value=  ''
  confirmPassword.value=  ''
  code.value=  ''
  } catch (error) {
  newPassword.value=  ''
  confirmPassword.value=  ''
  code.value=  ''
  }
  
};
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
    t('validations.password.Same')
  );
}
 
const passwordsNotMatching = computed(() => {
  return validatePasswordSameWrapper();
});
</script>

<style lang="scss" scoped>
.btn-custom {
  background-color: var(--blue-color);
  color: #ffffff;
  padding: 1rem 4rem;
  font-size: 1.25rem;
}

.btn-custom:hover {
  background-color: var(----color-background);
  color: var(--blue-color);
  border: 2px solid var(--blue-color);
}
</style>
