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
              <button 
              @click="prepareEditForm(item)"
                class="btn btn-outline-primary" 
                data-bs-toggle="modal" 
                data-bs-target="#modal" 
                
              >
              <i class="ri-pencil-fill"></i> {{ $t('buttons.edit') }}
            </button>
              </td>
             
            </tr>
          </tbody>
        </table>
        <ModalComponent 
          :edit="true" 
          :spa_name="spa_name" 
          :spa_id="spa_id" 
        />
        <PaginationComponent :currentPage="currentPage" :totalPages="totalPages" @changePage="handlePageChanged" />
      </div>
    </div>

  </div> 
 
</template>


<script setup>
import PaginationComponent from '../PaginationComponent.vue';
import LoadingComponent from '../LoadingComponent.vue';
import ModalComponent from './ModalComponent.vue';
import { useSpaceStore } from '../../stores/spaceStore'
import { ref, computed, onMounted, watch } from 'vue';



const spaceStores = useSpaceStore();

const spa_name = ref("");
const spa_id = ref("");
const spa_status = ref("");
const editing = ref(false);

let loading = ref(false)


const searchTerm = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

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
  if (item) {
    spa_id.value = item.spa_id;  // Asigna solo el ID del elemento actual
    spa_name.value = item.spa_name;  // Asigna solo el nombre del elemento actual
    spa_status.value = item.spa_status;  // Asigna el estado del elemento actual
    editing.value = true;
  }
};


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