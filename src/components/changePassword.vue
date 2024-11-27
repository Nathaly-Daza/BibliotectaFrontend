<template>
  <div class="container ">
    <!-- Modal -->
    <div
      class="modal fade border-primary"
      id="CambiarContrasena"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-primary shadow-lg">
          <div class="modal-header ">
            <h5 class="text-danger fw-semibold" id="exampleModalLabel">
              {{ $t('titles.changePassword') }}
            </h5>
          </div>
          <div class="modal-body">
            <form @submit.prevent="changePassword">
              <label for="currentPassword">{{ $t('profile.password') }} </label>
              <div class="input-group flex-nowrap">
                <input
                  type="password"
                  class="form-control ps-3"
                  aria-describedby="password"
                  v-model="currentPassword"
                  id="txtPassword"
                  required
                  autocomplete="current-password"
                />
                <span
                  v-on:click="showPassword('txtPassword')"
                  id="show_password"
                  class="btn btn-outline-dark"
                  type="button"
                >
                  <span class="icon fa fa-eye-slash"></span>
                </span>
              </div>

              <label for="newPassword">{{ $t('profile.changePassword') }} </label>
              <div class="input-group flex-nowrap">
                <input
                  type="password"
                  class="form-control ps-3"
                  aria-describedby="password"
                  v-model="newPassword"
                  id="txtNewPassword"
                  required
                  autocomplete="new-password"
                />

                <span
                  v-on:click="showPassword('txtNewPassword')"
                  id="show_newpassword"
                  class="btn btn-outline-dark"
                  type="button"
                >
                  <span class="icon fa fa-eye-slash"></span>
                </span>
              </div>

              <span class="text-danger" v-if="passwordError">
                <i class="bi bi-exclamation-circle-fill"></i>
                 {{ passwordError }}
              </span> <br>

              <label for="confirmPassword">{{ $t('profile.passwordConfirm') }} </label>
              <div class="input-group flex-nowrap">
                <input
                  type="password"
                  class="form-control ps-3"
                  aria-describedby="password"
                  v-model="confirmPassword"
                  id="txtConfirmPassword"
                  required
                  autocomplete="new-password"
                />

                <span
                  v-on:click="showPassword('txtConfirmPassword')"
                  id="show_passwordConfirm"
                  class="btn btn-outline-dark"
                  type="button"
                >
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
                <div  class="col-md-12 d-flex justify-content-center m-2 mt-3">
                  <button  type="submit" class="btn btn-custom fw-semibold" 
                  v-bind:disabled="passwordError || !passwordsNotMatching.isValid">
                  <span class="btn-content" v-if="!loading">
                    {{ $t('buttons.send') }}
                  </span>
                  <span class="btn-content" v-else>
                      <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                      <span role="status"> {{ $t('buttons.loading') }}</span>
                    </span>
                  </button>
                  <button type="button" class="btn btn-cancel ml-5 fw-semibold" data-bs-dismiss="modal" @click="cancelChanges">
                    {{ $t('buttons.close') }}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePersonsStore } from '../stores/personsStore'
import {  showPassword, validateNewPassword, validateSame} from '../validations.js'
import { ref , computed} from 'vue'
import CryptoJS from 'crypto-js'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const profileStore = usePersonsStore()
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const message = ref('')
const status= ref('')
const loading = ref(false)
const changePassword = async () => {
  try {
    loading.value = true
    const hashedPassword = CryptoJS.SHA256(currentPassword.value).toString()
    const hashedPasswordNew = CryptoJS.SHA256(newPassword.value).toString()
    const hashedPasswordValidation = CryptoJS.SHA256(confirmPassword.value).toString()

    const password = await profileStore.updatePassword(hashedPassword, hashedPasswordNew, hashedPasswordValidation)
    status.value = password
    if (password === true){
      clearFormFields()
     
    }


  } catch (error) {
    // Si hay errores, muestra un mensaje de error
    message.value = t('errors.changePassword')
  } finally {
    
    loading.value = false
  }

}
const clearFormFields = () => {
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  message.value = ''
}

const cancelChanges = () => {
  clearFormFields()
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

</script>

<style lang="scss" scoped>
.btn-custom {
  background-color: var(--blue-color);
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

.btn-custom:hover {
  background-color: var(----color-background);
  color: var(--blue-color);
  border: 2px solid var(--blue-color);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
  transition: 0.5s ease;
}

.btn-cancel {
  background-color: var(--button-red-color);
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

.btn-cancel:hover {
  background-color: var(----color-background);
  color: var(--button-red-color);
  border: 2px solid var(--button-red-color);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
  transition: 0.5s ease;
}
</style>