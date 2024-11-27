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
              <th id="th" class="blue-color-bg text-light text-center">{{ $t('tables.name') }} </th>
              <th id="th" class="blue-color-bg text-light text-center">{{ $t('tables.reservationDate') }}</th>
              <th id="th" class="blue-color-bg text-light text-center">{{ $t('tables.reservationStart') }}</th>
              <th id="th" class="blue-color-bg text-light text-center">{{ $t('tables.reservationEnd') }} </th>
              <th id="th" class="blue-color-bg text-light text-center">{{ $t('tables.reservationQuotasTotal') }}</th>
              <th id="th" class="blue-color-bg text-light text-center">{{ $t('tables.reservationQuotas') }}</th>
              <th id="th" class="blue-color-bg text-light text-center">{{ $t('tables.reservationService') }}</th>
              <th id="th" class="blue-color-bg text-light text-center">{{ $t('tables.reservedrofessional') }}</th>
              <th id="th" class="blue-color-bg text-light text-center">{{ $t('tables.state') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="paginated.length === 0" class="text-center">
              <td colspan="7"> {{ $t('tables.data') }} </td>
            </tr>
            <tr v-for="(item, index) in paginated" :key="index">
              <td>{{ item.ser_id }} </td>
              <td>{{ item.ser_name }} </td>
              <td>{{ item.ser_date }}</td>
              <td>{{ item.ser_start }}</td>
              <td>{{ item.ser_end }}</td>
              <td>{{ item.ser_quotas}}</td>
              <td>{{ item.ser_quotas -
               item.ser_register }}</td>
              <td>{{ item.ser_typ_name }}</td>
              <td>{{ item.prof_name }}</td>
              <td>{{ item.ser_status === 1 ? "Activa" : "Cancelada" }}</td>
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
import { ref, watchEffect, onMounted, computed, watch } from "vue";
import { useServiceStore } from "../../stores/serviceStore";

const serviceStore = useServiceStore();

const services = ref([]);

onMounted(async () => {
  loading.value = true
  await serviceStore.readService();
  loading.value = false;
});

// Actualizamos las services cuando cambie el valor de serviceStore.service
watchEffect(() => {
  services.value = serviceStore.service;
});


let loading = ref(false)
const searchTerm = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

//Busqueda
const filter = computed(() => {
  const lowerSearchTerm = searchTerm.value.toLowerCase()

  return serviceStore.service.filter((item) => {
    const matchesId = item.ser_id.toString().toLowerCase().includes(lowerSearchTerm)
    const matchesName = item.ser_name.toLowerCase().includes(lowerSearchTerm)
    const matchesdate = item.ser_date.toString().toLowerCase().includes(lowerSearchTerm)
    const matchesStart = item.ser_start ? item.ser_start.toString().toLowerCase().includes(lowerSearchTerm) : false;
    const matchesEnd = item.ser_end.toString().toLowerCase().includes(lowerSearchTerm)
    const matchesQuotas= item.ser_quotas.toString().toLowerCase().includes(lowerSearchTerm)
    const matchesSpaName = item.prof_name.toLowerCase().includes(lowerSearchTerm)
    const matchesTypeName = item.ser_typ_name.toLowerCase().includes(lowerSearchTerm)
    // Verificar si el estado del elemento coincide con la búsqueda
    const matchesStatus = item.ser_status === 0 && "cancelada".includes(lowerSearchTerm);
    const matchesStatusA = item.ser_status === 1 && "activa".includes(lowerSearchTerm);


    return matchesId || matchesName|| matchesdate || matchesStart || matchesEnd || matchesSpaName || matchesTypeName || matchesStatus || matchesStatusA || matchesStatus || matchesQuotas
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
