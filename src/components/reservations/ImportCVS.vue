<template>
  <div class="container">
    <!-- Modal -->
    <div class="modal fade border-primary" id="importCVS" tabindex="-1" aria-labelledby="importCVS"
      aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-primary shadow-lg">
          <div class="modal-header">
            <h5 class="modal-title text-danger" id="importCVSLabel">{{ $t('titles.import') }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveCSV" enctype="multipart/form-data">
              <div class="row">
                <div class="col-md-12">
                  <div class="mb-3 text-start">
                    <label for="exampleInputName1" class="form-label">{{ $t('forms.Import') }}</label>
                    <input @change="checkFileValidity" type="file" ref="fileInput" class="form-control"
                      accept=".csv,.txt">
                    <span class="text text-secondary"> <i class="bi bi-exclamation-lg"></i>
                      {{ $t('profile.noteImport') }}</span>
                  </div>
                </div>
              </div>

              <div class="row mt-4">
                <div class="col-md-12 d-flex justify-content-center">
                  <button type="submit" class="btn btn-custom fw-semibold" :disabled="!fileInput || !isValidFile || loading ">
                    {{ $t("buttons.send") }}
                  </button>
                  <button type="button" class="btn btn-cancel ml-5 fw-semibold" data-bs-dismiss="modal">
                    {{ $t("buttons.close") }}
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
import { useReservationStore } from '../../stores/reservationStore'
import { ref } from 'vue'

const reservationStore = useReservationStore()

const fileInput = ref(null);
const isValidFile = ref(true)
const loading = ref(false)

const saveCSV = async () => {
    const formData = new FormData();
    formData.append('file', fileInput.value.files[0]);
    loading.value = true;

    await reservationStore.ImportCVS(formData);
    loading.value = false; // Restablecer el estado de carga
}

const checkFileValidity = () => {
  const selectedFile = fileInput.value.files[0]
  if (!selectedFile) {
    isValidFile.value = false;
    return;
  }
  const validExtensions = ['.csv', '.txt'];

  const isValidExtension = validExtensions.some(ext => selectedFile.name.toLowerCase().endsWith(ext));

  isValidFile.value = isValidExtension;
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