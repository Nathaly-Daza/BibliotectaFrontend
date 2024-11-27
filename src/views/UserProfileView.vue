<template>
  <div class="card m-5">
    <div v-if="loading" class="d-flex justify-content-center">
      <LoadingComponent></LoadingComponent>
    </div>
    <div class="back" v-if="!loading">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <div class="row p-3 ">
            <div class="col-12 mt-4">
              <!-- Agregamos una clase "mb-3" para agregar un margen inferior -->
              <div class="position-relative text-center">
              <div>
               <figure class="figure">
                  <img :src="profileImage" class="figure-img img-fluid object-fit-cover" :alt="$t('profile.photoAlt')" />
                </figure>
                <div
                  class="overlayPefil"
                  data-bs-toggle="modal"
                  data-bs-target="#updatePhoto"
                >
                  <i class="ri-pencil-line"></i>
                </div>
              </div>
               
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-lg-8 d-flex align-items-center">
          <div class="w-100 text-sm-center text-md-start text-center">
            <!-- Añade un div para que el contenido tenga anchura completa -->
            <h2 class="fw-bold">
              {{ $t("profile.title") }} {{ profileStore.persons.per_name }}
              {{ profileStore.persons.per_lastname }}
            </h2>
            <h3 class="mt-3">
              {{ profileStore.persons.doc_typ_name }} No:
              {{ formatDocument(profileStore.persons.per_document) }}
            </h3>
          </div>
        </div>
      </div>
    </div>

    <div class="card-body" v-if="!loading">
      <div>
        <div class="card shadow bg-body-tertiary rounded">
          <div class="bg-body-tertiary">
            <div class="row p-3">
              <div class="row">
                <div class="col-6 col-md-12 col-lg-12 text-end m-2">
                  <button
                    class="btn btn-danger"
                    data-bs-toggle="modal"
                    data-bs-target="#CambiarContrasena"
                  >
                    {{ $t("buttons.changePassword") }}
                  </button>
                </div>
                <div class="col-12 col-md-12 col-lg-5 overflow-auto">
                  <table class="table bg-body-tertiary">
                    <tbody>
                      <tr>
                        <td class="bg-body-tertiary">
                          <strong>{{ $t("profile.status") }} :</strong>
                        </td>
                        <td class="bg-body-tertiary">
                          <!-- Mostrar botón verde si el estado es activo (1) -->
                          <button
                            v-if="profileStore.persons.use_status == '1'"
                            class="btn btn-success"
                            disabled
                          >
                            {{ $t("profile.states.active") }}
                          </button>
                          <!-- Mostrar botón rojo si el estado es inactivo (0) -->
                          <button
                            v-else-if="profileStore.persons.use_status == '0'"
                            class="btn btn-danger"
                            disabled
                          >
                            {{ $t("profile.states.inactive") }}
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td class="bg-body-tertiary">
                          <strong>{{ $t("profile.expeditionDate") }}: </strong>
                        </td>
                        <td class="bg-body-tertiary">
                          {{ profileStore.persons.per_expedition }}
                        </td>
                      </tr>
                      <tr>
                        <td class="bg-body-tertiary">
                          <strong>{{ $t("profile.adress") }}: </strong>
                        </td>
                        <td class="bg-body-tertiary">
                          {{ profileStore.persons.per_direction }}
                        </td>
                      </tr>
                      <tr>
                        <td class="bg-body-tertiary">
                          <strong>{{ $t("profile.gender") }}: </strong>
                        </td>
                        <td class="bg-body-tertiary">
                          {{ profileStore.persons.gen_name }}
                        </td>
                      </tr>
                      <tr>
                        <td class="bg-body-tertiary">
                          <strong>{{ $t("profile.relationship") }} :</strong>
                        </td>
                        <td class="bg-body-tertiary">
                          {{ profileStore.persons.civ_sta_name }}
                        </td>
                      </tr>
                     
                    </tbody>
                  </table>
                </div>
                <div class="col-12 col-md-12 col-lg-7 overflow-auto">
                  <table class="table">
                    <tbody>
                      <tr>
                        <td class="bg-body-tertiary">
                          <strong>{{ $t("profile.rh") }} :</strong>
                        </td>
                        <td class="bg-body-tertiary">
                          {{ profileStore.persons.per_rh }}
                        </td>
                      </tr>
                     
                      <tr>
                        <td class="bg-body-tertiary">
                          <strong>{{ $t("profile.birthdate") }}: </strong>
                        </td>
                        <td class="bg-body-tertiary">
                          {{ profileStore.persons.per_birthdate }}
                        </td>
                      </tr>
                      <tr>
                        <td class="bg-body-tertiary">
                          <strong>{{ $t("profile.email") }}: </strong>
                        </td>
                        <td class="bg-body-tertiary">
                          {{ profileStore.persons.use_mail }}
                        </td>
                      </tr>
                      <tr>
                        <td class="bg-body-tertiary">
                          <strong>{{ $t("profile.eps") }}: </strong>
                        </td>
                        <td class="bg-body-tertiary">
                          {{ profileStore.persons.eps_name }}
                        </td>
                      </tr>
                      <tr>
                        <td class="bg-body-tertiary">
                          <strong>{{ $t("profile.multiculturalism") }}: </strong>
                        </td>
                        <td class="bg-body-tertiary">
                          {{ profileStore.persons.mul_name }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <changePassword></changePassword>
  <changePhoto></changePhoto>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

import LoadingComponent from "../../src/components/LoadingComponent.vue";
import changePassword from "../../src/components/changePassword.vue";
import changePhoto from "../../src/components/changePhoto.vue";

import { usePersonsStore } from "../stores/personsStore";
import { formatDocument } from "../validations";

const profileStore = usePersonsStore();
const loading = ref(true);
const photo = ref("");
const profileImage = ref(profileStore.persons.use_photo);

const updateProfileImage = (event) => {
  profileImage.value = event.detail.newImage;
};

onMounted(() => {
  // Actualizar la imagen durante la montura inicial
  updateProfileImage({ detail: { newImage: profileStore.persons.use_photo } });
  // Escuchar evento para actualizar la imagen
  window.addEventListener("update-profile-image", updateProfileImage);
});

// Actualizar la imagen si cambia en el store
watch(
  () => profileStore.persons.use_photo,
  (newValue) => {
    profileImage.value = newValue;
  }
);

onMounted(async () => {
  await profileStore.readPersonDetailsById();
  photo.value = profileStore.persons.use_photo;
  loading.value = false;
});
</script>

<style>
.card-img-top {
  width: 50%;
  height: auto;
}

.back {
  background-color: hsla(229, 100%, 74%, 0.493);
  margin: 2%;
  border-radius: 15px;
  position: relative;
}

.top-0 {
  top: 0;
  /* La imagen estará en la parte superior del contenedor */
}

.start-100 {
  left: 100%;
  /* La imagen estará a la derecha del contenedor */
}

.translate-middle {
  transform: translate(50%);
  /* Centra la imagen vertical y horizontalmente */
}
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

.figure {
  position: relative;
  width: 50%;
  height: 0;
  padding-top: 50%;
  overflow: hidden;
  border-radius: 2%;
}

.figure img {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  object-fit: cover;
  object-position: center top; /* La imagen se recortará desde la parte superior si es necesario, pero se centrará en la parte inferior */
}


.overlayPefil {
    position: absolute;
    margin-left: 25%;
    bottom: 22px; /* Coloca el elemento en la parte inferior del div */
    left: 0;
    width: 50%;
    height: 20%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity 0.3s ease;
}
 .overlayPefil:hover{
  cursor: pointer;
 }

.ri-pencil-line {
  color: #fff;
  font-size: 24px; /* Tamaño del icono */
}
</style>
