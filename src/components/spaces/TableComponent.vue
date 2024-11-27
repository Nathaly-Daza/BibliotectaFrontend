<template>
  <div>
    <input type="text" v-model="searchTerm" :placeholder="$t('buttons.search')" class="form-control mb-3" />
    <div class="table-responsive m-1">
      <div v-if="loading" class="d-flex justify-content-center">
        <LoadingComponent></LoadingComponent>
      </div>
      <div v-if="!loading">
        <table class="table table-striped table-bordered display mt-2" id="table" v-if="!loading">
          <thead class="thead">
            <tr>
              <th class="blue-color-bg text-light text-center">{{ $t('tables.id') }}</th>
              <th class="blue-color-bg text-light text-center">{{ $t('tables.name') }}</th>
              <th class="blue-color-bg text-light text-center">{{ $t('tables.state') }}</th>
              <th class="blue-color-bg text-light text-center">{{ $t('tables.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in paginated" :key="index">
              <td class="text-center">{{ item.spa_id }}</td>
              <td class="text-center">{{ item.spa_name }}</td>
              <td class="text-center">

                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" role="switch" @change="editStatus(item.spa_id)"
                    id="change" :v-model="parseInt(item.spa_status)" :checked="parseInt(item.spa_status) === 1">
                  <label class="form-check-label" for="change">{{ parseInt(item.spa_status) === 1 ?
      $t('forms.status.enabled') :
      $t('forms.status.disabled') }}</label>
                </div>
              </td>
              <td class="text-center">
                <button class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#modal"
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
    <div class="modal fade border-primary" id="modal" tabindex="-1" aria-labelledby="exampleModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-primary shadow-lg">
          <div class="modal-header">
            <h5 class="modal-title blue-color-text" id="exampleModalLabel1">{{ $t('titles.editservices') }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="editSpace">
              <div class="row">

                <div class="mb-3 col-12">
                  <label for="exampleInputName1" class="form-label">{{ $t('forms.name') }}</label>
                  <input type="text" v-model="spa_name" class="form-control" id="exampleInputName1"
                    aria-describedby="NameHelp" />
                  <div v-if="nameError" class="text-danger">{{ nameError }}</div>

                </div>


              </div>
              <div class="row mt-4">
                <div class="col-md-12 d-flex justify-content-center">
                  <button type="submit" class="btn btn-custom fw-semibold" :disabled="spa_name.trim() === ''|| nameError != ''" data-bs-dismiss="modal">
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
import { useSpaceStore } from '../../stores/spaceStore'
import { ref, computed, onMounted, watch } from 'vue';
import { validateName } from '../../validations';
import { useI18n } from 'vue-i18n'


const spaceStores = useSpaceStore();

const spa_name = ref("");
const spa_id = ref("");
const spa_status = ref("");
const editing = ref(false);

let loading = ref(false)
let loadingButton = ref(false);

const searchTerm = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const { t } = useI18n()
onMounted(async () => {
  loading.value = true
  await spaceStores.readSpace()
  loading.value = false
})


const filter = computed(() => {
  const lowerSearchTerm = searchTerm.value.toLowerCase();
  if (!spaceStores.spaces) return []; // Verificar si spaceStores.spaces está definido

  return spaceStores.spaces.filter((item) => {
    if (!item || typeof item.spa_id === 'undefined') return false; // Verificar si item está definido y tiene spa_id
    const matchesId = item.spa_id.toString().includes(lowerSearchTerm);
    const matchesSpaName = item.spa_name.toLowerCase().includes(lowerSearchTerm);

    return matchesId || matchesSpaName;
  });
});
const paginated = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  //console.log(filter.value.slice(startIndex, endIndex));
  return filter.value.slice(startIndex, endIndex);

})
const totalItems = computed(() => filter.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage))

const handlePageChanged = (pageNumber) => {
  currentPage.value = pageNumber
}
watch(searchTerm, () => {
  // Reinicia currentPage a 1 cuando cambia el término de búsqueda
  currentPage.value = 1;
});

const prepareEditForm = (item) => {
  spa_id.value = item.spa_id;
  spa_name.value = item.spa_name;
  spa_status.value = item.spa_status;

  editing.value = true;
  //console.log('Datos de espacio para editar:', spa_id.value, spa_name.value, spa_status.value);
  // Emitir el evento personalizado para abrir el modal de edición con los datos

};
const validateNameWrapper = () => {
  return validateName(spa_name.value, t('validations.nameInvalid'))
}
const nameError = computed(() => {
  return validateNameWrapper()

})

const editSpace = async () => {

  if (nameError.value) {
    // Detener el envío de datos si hay errores
    return;
  }
  try {
    loadingButton.value = true
    await spaceStores.updateSpace(spa_id.value, spa_name.value.toUpperCase());
    loadingButton.value = false
    editing.value = false;
    


  } catch (error) {
    // console.error(error);
  }
  refreshReservationData();
}

const editStatus = async (spa_id) => {
  try {
    await spaceStores.updateStatus(spa_id);
    await refreshReservationData();
    // console.log(spa_id)

  } catch (error) {
    // console.error(error);
  }
}
const refreshReservationData = async () => {
  loading.value = true;
  await spaceStores.readSpace();
  loading.value = false;
};
refreshReservationData();
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