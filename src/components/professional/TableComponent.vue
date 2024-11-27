<template>
  <div>
    <input type="text" v-model="searchTerm" :placeholder="$t('buttons.search')" class="form-control mb-3" />

    <div class="table-responsive m-1">
      <div v-if="loading" class="d-flex justify-content-center">
        <LoadingComponent></LoadingComponent>
      </div>
      <div v-if="!loading">
        <table class="table  table-bordered display mt-2" id="table" v-if="!loading">
          <thead class="thead">
            <tr>
              <th class="blue-color-bg text-light text-center">{{ $t('tables.id') }}</th>
              <th class="blue-color-bg text-light text-center">{{ $t('tables.name') }}</th>
              <th class="blue-color-bg text-light text-center">{{ $t('tables.state') }}</th>
              <th class="blue-color-bg text-light text-center">{{ $t('tables.actions') }}</th>
              <!-- Nueva columna para botones -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in paginatedData" :key="index">
              <td class="text-center">{{ item.prof_id }}</td>
              <td class="text-center">{{ item.prof_name }}</td>
              <td class="text-center">

                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" role="switch" @change="editStatus(item.prof_id)"
                    id="change" :v-model="parseInt(item.prof_status)" :checked="parseInt(item.prof_status) === 1">
                  <label class="form-check-label" for="change">{{ parseInt(item.prof_status) === 1 ?
      $t('forms.status.enabled') :
      $t('forms.status.disabled') }}</label>
                </div>
              </td>
              <td class="text-center">
                <button class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#ModalProfessional"
                  @click="prepareEditForm(item)">
                  <i class="ri-pencil-fill"></i> {{ $t('buttons.edit') }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <PaginationComponent :currentPage="currentPage" :totalPages="totalPages" @changePage="handlePageChanged" />
      </div>
    </div>
  </div>
  <div class="container p-5">
    <!-- Modal -->
    <div class="modal fade border-primary" id="ModalProfessional" tabindex="-1" aria-labelledby="exampleModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-primary shadow-lg">
          <div class="modal-header">
            <h5 class="modal-title blue-color-text" id="exampleModalLabel1">{{ $t('titles.editprofessional') }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="editProfessional">
              <div class="row">
                <div class="mb-3 col-12">
                  <label for="exampleInputName1" class="form-label">{{ $t('forms.name') }} </label>
                  <input type="text" v-model="prof_name" class="form-control" id="exampleInputName1"
                    aria-describedby="NameHelp" />
                  <div v-if="nameError" class="text-danger">{{ nameError }}</div>

                </div>
              </div>
              <div class="row mt-4">
                <div class="col-md-12 d-flex justify-content-center">
                  <button type="submit" class="btn btn-custom fw-semibold" :disabled="prof_name.trim() === '' || nameError != ''" data-bs-dismiss="modal">
                    <span class="btn-content" v-if="!loadingButton">{{ $t('buttons.send') }}</span>
                    <span class="btn-content" v-else>
                      <span class="spinner-border spinner-border-sm mr-2" aria-hidden="true"></span>
                      <span role="status"> {{ $t('buttons.loading') }}</span>
                    </span>
                  </button>
                  <button type="button" class="btn btn-cancel ml-5 fw-semibold" data-bs-dismiss="modal">
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
import PaginationComponent from '../PaginationComponent.vue';
import LoadingComponent from '../LoadingComponent.vue';
import { useProfessionalStore } from '../../stores/professionalStore'
import { ref, computed, onMounted, watch } from 'vue';
import { validateNameProf } from '../../validations';
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const professionalStore = useProfessionalStore();

const prof_name = ref("");
const prof_id = ref("");

const editing = ref(false);
const loading = ref(false);
const loadingButton = ref(false);
const searchTerm = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;

onMounted(async () => {
  loading.value = true;
  await professionalStore.readProfessional();
  loading.value = false;
});

const filter = computed(() => {
  const lowerSearchTerm = searchTerm.value.toLowerCase();
  return professionalStore.professional.filter((item) => {
    const matchesId = item.prof_id.toString().includes(lowerSearchTerm);
    const matchesTypeName = item.prof_name.toLowerCase().includes(lowerSearchTerm);
    return matchesId || matchesTypeName;
  });
});

const paginatedData = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  //console.log(filteredData.value.slice(startIndex, endIndex));
  return filter.value.slice(startIndex, endIndex);
});

const totalItems = computed(() => filter.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage));

const handlePageChanged = (pageNumber) => {
  currentPage.value = pageNumber;
};

// Monitorea cambios en 'searchTerm'
watch(searchTerm, () => {
  // Reinicia currentPage a 1 cuando cambia el término de búsqueda
  currentPage.value = 1;
});

//Editar tipo reserva
const prepareEditForm = (item) => {
  prof_id.value = item.prof_id;
  prof_name.value = item.prof_name;
  editing.value = true;

};

const validateNameWrapper = () => {
  return validateNameProf(prof_name.value, t('validations.nameInvalid'))
}
const nameError = computed(() => {
  return validateNameWrapper()

})

const editProfessional = async () => {
  if (nameError.value) { return }
  try {
    loadingButton.value = true;
    // Actualizar el tipo de reserva si no hay errores de validación
    await professionalStore.updateProfessional(prof_id.value, prof_name.value.toUpperCase());
    
    loadingButton.value = false;
    editing.value = false;
    
    
  } catch (error) {
    // console.error(error);
  }
  refreshData();
};

const editStatus = async (prof_id) => {
  try {

    await professionalStore.updateStatus(prof_id);
    // console.log(spa_id)
    await refreshData();

  } catch (error) {
    // console.error(error);
  }
}

const refreshData = async () => {
  loading.value = true;
  await professionalStore.readProfessional();
  loading.value = false;
};

</script>

<style lang="scss" scoped>
.blue-color-bg {
  background-color: var(--blue-color);
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
  color: #fff;
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
