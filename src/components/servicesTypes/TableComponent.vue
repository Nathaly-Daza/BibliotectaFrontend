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
              <td class="text-center">{{ item.ser_typ_id }}</td>
              <td class="text-center">{{ item.ser_typ_name }}</td>
              <td class="text-center">

                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" role="switch" @change="editStatus(item.ser_typ_id)"
                    id="change" :v-model="parseInt(item.ser_typ_status)" :checked="parseInt(item.ser_typ_status) === 1">
                  <label class="form-check-label" for="change">{{ parseInt(item.ser_typ_status) === 1 ?
      $t('forms.status.enabled') :
      $t('forms.status.disabled') }}</label>
                </div>
              </td>

              <td class="text-center">
                <button class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#ModalServicesTypes"
                  @click="prepareEditForm(item)">
                  <i class="ri-pencil-fill"></i> {{ $t('buttons.edit') }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <PaginationComponent :currentPage="currentPage" :totalPages="totalPages" @changePage="handlePageChanged" />
        <ModalComponent 
          :edit="true" 
          :ser_typ_name="ser_typ_name" 
          :ser_typ_id="ser_typ_id" 
        />
      </div>
    </div>
  </div>

</template>

<script setup>
import PaginationComponent from '../PaginationComponent.vue';
import LoadingComponent from '../LoadingComponent.vue';
import ModalComponent from './ModalComponent.vue';
import { useServiceTypeStore } from '../../stores/serviceTypesStore'
import { ref, computed, onMounted, watch } from 'vue';


const serviceTypeStore = useServiceTypeStore();

const ser_typ_name = ref("");
const ser_typ_id = ref("");
const loading = ref(false);


const searchTerm = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;

onMounted(async () => {
  loading.value = true;
  await serviceTypeStore.readServiceType();
  loading.value = false;
});

const filteredData = computed(() => {
  const lowerSearchTerm = searchTerm.value.toLowerCase();
  return serviceTypeStore.serviceType.filter((item) => {
    const matchesId = item.ser_typ_id.toString().includes(lowerSearchTerm);
    const matchesTypeName = item.ser_typ_name.toLowerCase().includes(lowerSearchTerm);
    return matchesId || matchesTypeName;
  });
});

const paginatedData = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  //console.log(filteredData.value.slice(startIndex, endIndex));
  return filteredData.value.slice(startIndex, endIndex);
});

const totalItems = computed(() => filteredData.value.length);
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
  ser_typ_id.value = item.ser_typ_id;
  ser_typ_name.value = item.ser_typ_name;

};



const editStatus = async (ser_typ_id) => {
  try {
    await serviceTypeStore.updateStatus(ser_typ_id);
    // console.log(ser_typ_id)
    await refreshReservationData();
  } catch (error) {
    console.error(error);
  } 
}

const refreshReservationData = async () => {
  loading.value = true;
  await serviceTypeStore.readServiceType();
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
