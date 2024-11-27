<template>
  <div class="container ">
    <!-- Modal -->
    <div class="modal fade border-primary" id="updatePhoto" tabindex="-1" aria-labelledby="exampleModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-primary shadow-lg">
          <div class="modal-header">
            <h5 class="modal-title text-danger" id="exampleModalLabel">{{ $t('titles.photo') }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="changePhoto" enctype="multipart/form-data">
              <div class="row">
                <div class="col-md-12">
                  <div class="mb-3 text-start">
                    <label for="exampleInputName1" class="form-label">{{ $t('forms.imagen') }}</label>
                    <input @change="checkFileValidity" type="file" ref="fileInput" class="form-control"
                      accept="image/*">
                    <span class="text text-secondary"> <i class="bi bi-exclamation-lg"></i>
                      {{ $t('profile.note') }}</span>
                  </div>

                </div>
              </div>

              <div class="row mt-4">
                <div class="col-md-12 d-flex justify-content-center">
                  <button type="submit" class="btn btn-custom fw-semibold"
                    :disabled="!fileInput || !isValidFile || loading">{{ $t("buttons.send") }}</button>
                  <button type="button" class="btn btn-cancel ml-5 fw-semibold" data-bs-dismiss="modal">{{
              $t("buttons.close") }}</button>
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
import { ref } from 'vue'

const profileStore = usePersonsStore()


const photo = ref('')
const fileInput = ref(null);
const isValidFile = ref(true)
const loading = ref(false)

const changePhoto = async () => {
  if (!isValidFile.value) return;
  try {
    const formData = new FormData();
    formData.append('file', fileInput.value.files[0]);
    loading.value = true;

    await profileStore.updatePhoto(formData);

    await profileStore.readPersonDetailsById();

    photo.value = profileStore.persons.use_photo + `?${Math.random()}`;
    emitUpdateImageEvent(photo.value);
    loading.value = false;
  } catch (error) {
    // console.error('Error uploading photo:', error);
  }
};
const emitUpdateImageEvent = (newImage) => {
  window.dispatchEvent(new CustomEvent('update-profile-image', { detail: { newImage } }));
};

const checkFileValidity = () => {
  const selectedFile = fileInput.value.files[0]
  if (!selectedFile) {
    isValidFile.value = false;
    return;
  }
  const validExtensions = ['.jpeg', '.jpg', '.png'];
  const maxSizeKB = 2048;
  const isValidExtension = validExtensions.some(ext => selectedFile.name.toLowerCase().endsWith(ext));
  const isValidSize = selectedFile.size <= maxSizeKB * 1024;
  isValidFile.value = isValidExtension && isValidSize;
}

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

.text {
  font-size: 14px;
}
</style>