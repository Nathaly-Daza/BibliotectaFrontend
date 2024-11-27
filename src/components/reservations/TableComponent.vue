<template>
  <div>
    <input type="text" v-model="searchTerm" :placeholder="$t('buttons.search')" class="form-control mb-3" />

    <div class="table-responsive m-1">
      <!-- Agregar un indicador de carga -->
      <div v-if="loading" class="d-flex justify-content-center">
        <LoadingComponent></LoadingComponent>
      </div>
      <div v-if="!loading">
        <table class="table table-bordered display mt-2" v-if="!loading" id="table">
          <thead class="thead">
            <tr>
              <th id="th" class="blue-color-bg text-light text-center">{{ $t('tables.id') }} </th>
              <th id="th" class="blue-color-bg text-light text-center">{{ $t('tables.reservationDate') }}</th>
              <th id="th" class="blue-color-bg text-light text-center">{{ $t('tables.reservationStart') }}</th>
              <th id="th" class="blue-color-bg text-light text-center">{{ $t('tables.reservationEnd') }} </th>
              <th id="th" class="blue-color-bg text-light text-center">{{ $t('tables.reservedSpace') }}</th>
              <th class="blue-color-bg text-light text-center">{{ $t('tables.userEmail') }}</th>
              <th id="th" class="blue-color-bg text-light text-center">{{ $t('tables.state') }}</th>


            </tr>
          </thead>
          <tbody>
            <tr v-if="paginated.length === 0" class="text-center">
              <td colspan="7"> {{ $t('tables.data') }} </td>
            </tr>
            <tr v-for="(item, index) in paginated" :key="index">
              <td>{{ item.res_id }}</td>
              <td>{{ item.res_date }}</td>
              <td>{{ item.res_start }}</td>
              <td>{{ item.res_end }}</td>
              <td>{{ item.spa_name }}</td>
              <td>{{ item.use_mail }}</td>
              <td>{{ item.res_status === 1 ? "Activa" : "Cancelada" }}</td>
            </tr>
          </tbody>
        </table>
        <PaginationComponent :currentPage="currentPage" :totalPages="totalPages" @changePage="handlePageChanged" />
      </div>
    </div>
  </div>
</template>

<script setup>

import PaginationComponent from '../PaginationComponent.vue';
import LoadingComponent from '../LoadingComponent.vue';
import { ref, computed, onMounted, watch } from 'vue';

import { useReservationStore } from '../../stores/reservationStore';

const reservationStore = useReservationStore();

onMounted(async () => {
  loading.value = true
  await reservationStore.readReservation()
  loading.value = false
})


let loading = ref(false)
const searchTerm = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

//Busqueda
const filter = computed(() => {
  const lowerSearchTerm = searchTerm.value.toLowerCase()

  return reservationStore.reservation.filter((item) => {
    const matchesId = item.res_id.toString().toLowerCase().includes(lowerSearchTerm)
    const matchesdate = item.res_date.toString().toLowerCase().includes(lowerSearchTerm)
    const matchesStart = item.res_start ? item.res_start.toString().toLowerCase().includes(lowerSearchTerm) : false;
    const matchesEnd = item.res_end.toString().toLowerCase().includes(lowerSearchTerm)
    const matchesSpaName = item.spa_name.toLowerCase().includes(lowerSearchTerm)
    const matchesMail = item.use_mail.toString().toLowerCase().includes(lowerSearchTerm)
    // Verificar si el estado del elemento coincide con la búsqueda
    const matchesStatus = item.res_status === 0 && "cancelada".includes(lowerSearchTerm);
    const matchesStatusA = item.res_status === 1 && "activa".includes(lowerSearchTerm);


    return matchesId || matchesdate || matchesStart || matchesEnd  || matchesSpaName || matchesMail || matchesStatus || matchesStatusA || matchesStatus
  })
})

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

</script>
<style lang="scss" scoped>
.blue-color-bg {
  background-color: var(--blue-color);
}

.btn-custom {
  background-color: var(--blue-color);
  color: #ffffff;
  padding: 1rem 4rem;
  font-size: 1.25rem;
}

.btn-custom:hover {
  background-color: var(----color-background);
  color: var(--blue-color);
  border: 2px solid var(--blue-color);
}
</style>


