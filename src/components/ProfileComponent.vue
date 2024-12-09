<template>
  <div class="dropdown">
    <img
      class="img img-thumbnail dropdown-toggle"
      :src="profileImage"
      role="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    />
    <ul class="dropdown-menu">
      <li>
        <div class="container">
          <div class="row">
            <div class="col-2 p-2">
              <div class="position-relative">
                <img class="img-perfil dropdown-toggle" :src="profileImage" role="button" />
                <div class="overlay " data-bs-toggle="modal" data-bs-target="#updatePhoto"><i class="ri-pencil-line "></i>
                </div>
              </div>
            </div>
            <div class="col-10 p-2">
              <div>
                <p class="name fw-semibold mb-1 ">
                  {{ personsStore.persons.per_name }}
                  {{ personsStore.persons.per_lastname }}
                </p>
                <p class="mail mb-0">{{ personsStore.persons.use_mail }}</p>
              </div>
            </div>
          </div>
        </div>
      </li>
      <li><hr class="dropdown-divider"></li>
      <li>
        <div class="container dropdown-item">
          <RouterLink :to="proj_id.includes('7') ? '/salones/profile' : '/profile'" class="">
            <div class="link">
              <div class="link-container dropdown-item">{{ $t("titles.profile") }}</div>
            </div>
          </RouterLink>
        </div>
      </li>
      <li>
        <div class="container dropdown-item">
          <div class="link">
            <a @click="logoutUser" class=" link-container dropdown-item">{{ $t("buttons.logout") }}</a>
          </div>
        </div>
      </li>
      <li></li>
      <li><hr class="dropdown-divider"></li>
      <li>

        <div class="">
        <div class="link">
        <Language></Language>
        </div>
          
        </div>
      </li>
    </ul>
    

  </div>
  <changePhoto></changePhoto>
</template>

<script setup>
import changePhoto from "./changePhoto.vue";
import Language from "./LanguageComponent.vue";
import { useAuthStore } from "../stores/authStore";
import { RouterLink } from "vue-router";
import { useRouter } from "vue-router";
import CryptoJS from "crypto-js";
import { usePersonsStore } from "../stores/personsStore.js";
import { ref, onMounted, watch } from "vue";

const router = useRouter();
const userAuth = useAuthStore();
const personsStore = usePersonsStore();
const secretKey = "TuClaveSecreta";
const use_id = CryptoJS.AES.decrypt(localStorage.getItem("id"), secretKey).toString(
  CryptoJS.enc.Utf8
);

const proj_id = CryptoJS.AES.decrypt(localStorage.getItem("proj"), secretKey).toString(
  CryptoJS.enc.Utf8
);
const profileImage = ref(personsStore.persons.use_photo);

const updateProfileImage = (event) => {
  profileImage.value = event.detail.newImage;
};

onMounted(() => {
  // Actualizar la imagen durante la montura inicial
  updateProfileImage({ detail: { newImage: personsStore.persons.use_photo } });
  // Escuchar evento para actualizar la imagen
  window.addEventListener("update-profile-image", updateProfileImage);
});

// Actualizar la imagen si cambia en el store
watch(
  () => personsStore.persons.use_photo,
  (newValue) => {
    profileImage.value = newValue;
  }
);

const logoutUser = async () => {
  await userAuth.logout(use_id);
  router.push("/");
};
</script>

<style lang="scss" scoped>
.img {
  width: 65px; /* Ancho automático para mantener la proporción */
  height: 65px; /* Establece una altura fija según tus necesidades */
  border-radius: 50%; /* Hace que la imagen sea redonda */
  object-position: center top;
  object-fit: cover;
}
.img-perfil {
  width: 58px; /* Ancho automático para mantener la proporción */
  height: 55px; /* Establece una altura fija según tus necesidades */
  border-radius: 50%; /* Hace que la imagen sea redonda */
  object-position: center top;
  object-fit: cover;
  padding-right: 5px;
}
p {
  margin: 0 10px;
}
.name {
  font-size: 15px;
}
.mail {
  font-size: 14px;
}
.link {
  margin-left: 18%;
  cursor: pointer;
  
}
.link:hover{
  text-decoration: underline;
}

.dropdown-menu {
  width: 300px;
}


.position-relative {
  position: relative;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 55px;
  height: 55px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5); /* Capa de superposición negra con transparencia */
  opacity: 0;
  transition: opacity 0.3s ease; /* Transición de opacidad suave */
}

.overlay:hover {
  opacity: 1; /* Mostrar la capa de superposición al pasar el cursor */
  object-position: center top;
  cursor: pointer;

}
.ri-pencil-line {
  color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* Centrar el ícono horizontal y verticalmente */
}
</style>
