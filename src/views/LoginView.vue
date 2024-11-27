<template>
  <div v-if="loading" class="d-flex justify-content-center align-items-center loading">
    <LoadingComponent></LoadingComponent>
  </div>
  <div class="container-flex" v-else>
    <div class="row">
      <div
        class="col-md-6 col-sm-6 p-5 text-center justify-content-center align-items-center"
        v-if="isScreenLarge"
      >
        <carousel></carousel>
      </div>
      <div class="col-md-6 py-5">
        <div class="card shadow p-3 bg-body-tertiary rounded  m-3 mx-ms-3 mx-md-5">
          <a class="text-secondary" href="http://uniempresarialfabricasoluciones/home/">
            <i class="ri-arrow-left-line"></i>
          </a>
          <form @submit.prevent="handleSubmit">
            <strong class="text-center red-color-text">
              <h3>{{ $t("login.title") }}</h3>
            </strong>

            <div class="mb-3 pt-4">
              <label for="exampleInputEmail1" class="form-label text-start ps-3">{{
                $t("login.email")
              }}</label>
              <div class="input-group flex-nowrap">
                <span class="input-group-text">
                  <i class="bi bi-envelope-at-fill"></i>
                </span>
                <input
                  type="email"
                  v-model="use_mail"
                  class="form-control ps-3"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  :placeholder="$t('login.email')"
                  required
                />
              </div>
              <span
                v-if="use_mail === '' && mailError"
                v-bind:class="{
                  ' bi bi-exclamation-lg ': !mailError.isEmpty,
                  ' text-secondary ': !mailError.isEmpty,
                }"
              >
                {{ mailError.message }}
              </span>
              <span
                v-else-if="mailError"
                v-bind:class="{
                  'bi bi-exclamation-lg': mailError.isEmpty,
                  'text-danger': mailError.isEmpty,
                }"
              >
                {{ mailError.message }}
              </span>
            </div>
            <div class="mb-3 pt-4">
              <label for="exampleInputPassword1" class="form-label ps-3">{{
                $t("login.password")
              }}</label>
              <div class="input-group flex-nowrap">
                <span class="input-group-text">
                  <i class="bi bi-lock-fill"></i>
                </span>
                <input
                  type="password"
                  class="form-control ps-3"
                  aria-describedby="password"
                  v-model="use_password"
                  id="txtPassword"
                  :placeholder="$t('login.password')"
                  required
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
            </div>

            <div class="mb-3 form-check">
              <input class="form-check-input text-dark" type="checkbox" value="" id="invalidCheck3" required
                v-model="termsAccepted" />
              <label class="form-check-label text-dark" for="invalidCheck3">{{$t("login.Terms")}}</label>
            </div>
            <div class="text-center mt-3">
              <button
                type="submit"
                class="btn btn-danger p-2 align-content-center"
                style="width: 40%"
              >
                {{ $t("login.Login") }}
              </button>
            </div>

            <div class="text-center mt-3">
              <router-link
                class="link-dark link-offset-2 link-underline link-underline-opacity-0"
                to="/emailPassword"
                >{{ $t("login.Forget") }}</router-link
              ><br />
              <br />
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Carousel from "../components/Carousel.vue";
import LoadingComponent from "../components/LoadingComponent.vue";
import { useAuthStore } from "../stores/authStore.js";
import { validateEmail, showPassword } from "../validations.js";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import CryptoJS from "crypto-js";
// import { usePersonsStore } from '../stores/personsStore'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

let loading = ref(false);

const authStore = useAuthStore();
// const personStore = usePersonsStore()
const router = useRouter();
const termsAccepted = ref(false);
const use_mail = ref("");
const use_password = ref("");

const isScreenLarge = ref(true);

const validateMailWrapper = () => {
  return validateEmail(use_mail.value, t("validations.mails.institutional"));
};
const mailError = computed(() => {
  return validateMailWrapper();
});

const handleSubmit = async () => {
  try {
    loading.value = true;
    //console.log('paso las validaciones')
    await authStore.access(use_mail.value, use_password.value);

    loading.value = false;

    const secretKey = "TuClaveSecreta";
    const type = CryptoJS.AES.decrypt(localStorage.getItem("type"), secretKey).toString(
      CryptoJS.enc.Utf8
    );
    const localStorageDocument = localStorage.getItem("doct");
    const localStoragePassword = localStorage.getItem("pass");
    //console.log(localStorageDocument)
    //console.log(localStoragePassword)

    const cc_administrator = parseInt(type, 10);

    if (localStoragePassword === localStorageDocument) {
      // Si las contraseñas cifradas y los documentos cifrados son iguales, redirigir a "/resetPassword"
      router.push("/firstPassword");
    } else {
      if (cc_administrator === 1) {
        router.push("/reservations");
      }
      // personStore.readPersonDetailsById()
    }
  } catch (error) {
    // console.log('error', error)
    use_password.value = "";
  }
};
</script>

<style lang="scss" scoped>
.row {
  margin: 0;
}

.loading {
  height: 80vh;
}

@media (max-width: 940px) {
  .col-md-6 {
    width: 100% !important;
    /* En pantallas pequeñas, ocupa todo el ancho */
  }

  .col-sm-6 {
    display: none;
    /* Oculta el carrusel en pantallas pequeñas */
  }
}
</style>
