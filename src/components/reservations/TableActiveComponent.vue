<template>
  <div>
    <input type="text" v-model="searchTerm" :placeholder="$t('buttons.search')" class="form-control mb-3" />

    <div class="table-responsive m-1">
      <!-- Agregar un indicador de carga -->
      <div v-if="loading" class="d-flex justify-content-center">
        <LoadingComponent></LoadingComponent>
      </div>
      <div v-if="!loading">
        <table class="table table-bordered display mt-2" v-if="!loading" id="tableActive">
          <thead>
            <tr>
              <th id="th" class="blue-color-bg text-light text-center">{{ $t('tables.id') }} </th>
              <th id="th" class="blue-color-bg text-light text-center">{{ $t('tables.reservationDate') }}</th>
              <th id="th" class="blue-color-bg text-light text-center">{{ $t('tables.reservationStart') }}</th>
              <th id="th" class="blue-color-bg text-light text-center">{{ $t('tables.reservationEnd') }} </th>
              <th id="th" class="blue-color-bg text-light text-center">{{ $t('tables.reservedSpace') }}</th>


              <th class="blue-color-bg text-light text-center">{{ $t('tables.userEmail') }}</th>

              <th class="blue-color-bg text-light text-center">{{ $t('tables.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="paginated.length === 0" class="text-center">
              <td colspan="7"> {{ $t('tables.data') }} </td>
            </tr>
            <tr v-for="(item, index) in paginated" :key="index">
              <td>{{ item['No. Reserva'] }}</td>
              <td>{{ item.Fecha }}</td>
              <td>{{ item['Hora inicio'] }}</td>
              <td>{{ item['Hora fin'] }}</td>
              <td>{{ item.Espacio }}</td>

              <td>{{ item.Correo }}<span hidden>{{ item['Identificacion'] }}</span></td>
              <span hidden>{{ item.Estado }}</span>


              <td>
                <div class="text-light text-center align-items-center justify-content-center">

                  <button @click="prepareEditForm(item)" type="button" data-bs-toggle="modal"
                    data-bs-target="#ModalReservations" class="btn btn-outline-primary m-1">
                    <i class="ri-pencil-fill"></i>
                  </button>
                  <button @click="deleteReservation(item['No. Reserva'])" type="button"
                    class="btn btn-outline-danger m-1">
                    <i class="ri-calendar-close-fill"></i>
                  </button>

                </div>
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
    <div class="modal fade border-primary" id="ModalReservations" tabindex="-1" aria-hidden="true"
      @data-bs-dismiss="resetEditForm">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-primary shadow-lg">
          <div class="modal-header">
            <h5 class="modal-title text-danger" id="exampleModalLabel">{{ $t('titles.editreservations') }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="editReservation">
              <div class="row">
                <div class="mb-3 col-md-12">
                  <label for="exampleInputDate" class="form-label">{{ $t('forms.date') }}</label>
                  <input type="date" pattern="\d{4}-\{2}-\{2}" class="form-control" id="exampleInputDate"
                    v-model="res_date" />
                  <div v-if="dateErrorMessage" class="text-danger">{{ dateErrorMessage }}</div>
                  <div v-if="errors['res_date']" class="text-danger">{{ errors['res_date'] }}</div>
                </div>
              </div>
              <div class="row">
                <div class="mb-3 col-md-6">
                  <label for="exampleInputDate" class="form-label">{{ $t('forms.hourStart') }}</label>
                  <input type="time" class="form-control" id="exampleInputDate" v-model="res_start" />
                  <div v-if="timeErrorMessage" class="text-danger">{{ timeErrorMessage }}</div>
                  <div v-if="errors['res_start']" class="text-danger">{{ errors['res_start'] }}</div>
                </div>
                <div class="mb-3 col-md-6">
                  <label for="exampleInputDate" class="form-label">{{ $t('forms.hourEnd') }}</label>
                  <input type="time" class="form-control" id="exampleInputDate" v-model="res_end" />
                  <div v-if="timeErrorMessage" class="text-danger">{{ timeErrorMessage }}</div>
                  <div v-if="errors['res_end']" class="text-danger">{{ errors['res_end'] }}</div>

                </div>
              </div>


              <div class="row">
                <div class="mb-3 col-md-12">
                  <label for="exampleInputStatus" class="form-label"> {{ $t('forms.reservedSpace') }}</label>
                  <select class="form-select" id="exampleInputStatus" v-model="spa_name">
                    <option v-for="(spaceItem, index) in filteredSpaceItems" :key="index" :value="spaceItem.spa_id">
                      {{ spaceItem.spa_name }}
                    </option>
                  </select>
                  <div v-if="errors['spa_name']" class="text-danger">{{ errors['spa_name'] }}</div>
                </div>


              </div>

              <div class="row mt-4">
                <div class="col-md-12 d-flex justify-content-center">
                  <button type="submit" class="btn btn-custom fw-semibold" :disabled="spa_name === ''" data-bs-dismiss="modal">
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

import Swal from 'sweetalert2';
import { validateDate, validateTime, validateFields } from '../../validations';
import PaginationComponent from '../PaginationComponent.vue';
import LoadingComponent from '../LoadingComponent.vue';
import { ref, computed, onMounted, watch } from 'vue';
import { useSpaceStore } from '../../stores/spaceStore';
import { useReservationStore } from '../../stores/reservationStore';
import { useI18n } from 'vue-i18n'


const reservationStore = useReservationStore();

const spaceStore = useSpaceStore();

const res_id = ref("")
const use_id = ref("")
const res_date = ref(new Date());
const spa_name = ref('');
const res_start = ref('');
const res_end = ref('');

const dateErrorMessage = ref('');
const editing = ref(false);

let loading = ref(false)
const loadingButton = ref(false);

const searchTerm = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const { t } = useI18n()
const validateNameWrapper = () => {
  const fields = [
    { name: 'res_date', value: res_date.value },
    { name: 'res_start', value: res_start.value },
    { name: 'res_end', value: res_end.value },
    { name: 'spa_name', value: spa_name.value },

  ];

  return validateFields(fields, t('validations.inputRequired'));
}
const errors = computed(() => {
  return validateNameWrapper()

})

const validateTimeWrapper = () => {
  const startTime = new Date(`2000-01-01T${res_start.value}`);
  const endTime = new Date(`2000-01-01T${res_end.value}`);
  return validateTime(startTime, endTime, t('validations.hourAfterInvalid'), t('validations.hourIqualInvalid'));
}
const timeErrorMessage = computed(() => {
  return validateTimeWrapper()

})

onMounted(async () => {
  loading.value = true
  await reservationStore.readDateReservation()
  loading.value = false
})

const filteredSpaceItems = computed(() => {
  return spaceStore.spaces.filter(spaceItem => spaceItem.spa_status === 1);
});

//Busqueda
const filter = computed(() => {
  const lowerSearchTerm = searchTerm.value.toLowerCase()

  return reservationStore.reservationDate.filter((item) => {
    const matchesId = item['No. Reserva'].toString().toLowerCase().includes(lowerSearchTerm)
    const matchesdate = item.Fecha.toString().toLowerCase().includes(lowerSearchTerm)
    const matchesStart = item['Hora inicio'] ? item['Hora inicio'].toString().toLowerCase().includes(lowerSearchTerm) : false;
    const matchesEnd = item['Hora fin'].toString().toLowerCase().includes(lowerSearchTerm)
    const matchesSpaName = item.Espacio.toLowerCase().includes(lowerSearchTerm)
    const matchesMail = item.Correo.toString().toLowerCase().includes(lowerSearchTerm)

    return matchesId || matchesdate || matchesStart || matchesEnd || matchesSpaName || matchesMail
  })
})
const paginated = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
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
//Editar Reservacion

const formatTime = (time) => {
  return time ? time.substring(0, 5) : ''; // Devuelve los primeros 5 caracteres (hh:mm)
};

const prepareEditForm = (item) => {
  res_id.value = item['No. Reserva'];
  res_date.value = item.Fecha;
  use_id.value = item['Identificacion'];
  dateErrorMessage.value = '';


  const selectedReservationSpace = spaceStore.spaces.find(spaces => spaces.spa_name === item.Espacio);
  spa_name.value = selectedReservationSpace ? selectedReservationSpace.spa_id : '';
  res_start.value = formatTime(item['Hora inicio']);
  res_end.value = formatTime(item['Hora fin']);
  editing.value = true;
  //console.log('Datos de tipo de reserva para editar:', res_id.value, res_date.value, res_typ_name.value, spa_name.value, res_start.value, res_end.value ,use_id.value);


};

const editReservation = async () => {

  dateErrorMessage.value = validateDate(res_date.value, t('validations.dateBeforeInvalid'));
  if (Object.keys(errors.value).length > 0 || timeErrorMessage.value || dateErrorMessage.value) {
    // Mostrar mensajes de error si las validaciones no pasan
    return;
  }
  try {
    loadingButton.value = true;
    await reservationStore.updateReservation(res_id.value, res_date.value, res_start.value, res_end.value, spa_name.value, use_id.value);
    loadingButton.value = false;
    //console.log(res_id.value,res_date.value,res_start.value,res_end.value, spa_name.value,use_id.value);
    editing.value = false;
    
  } catch (error) {
    console.error(error);
  }
  refreshReservationData();
};

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-primary ml-2",
    cancelButton: "btn btn-danger mr-2"
  },
  buttonsStyling: false
});

const deleteReservation = async (res_id) => {
  try {
    const result = await swalWithBootstrapButtons.fire({
      title: t('cancel.title'),
      text: t('cancel.text'),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t('cancel.confirmButtonText'),
      cancelButtonText: t('cancel.close'),
      reverseButtons: true
    });

    if (result.isConfirmed) {
      await reservationStore.cancelReservation(res_id);
      //console.log(res_id);
      await refreshReservationData();
      swalWithBootstrapButtons.fire({
        title: t('cancel.title2'),
        text: t('cancel.text2'),
        icon: "success"
      });
    }
  } catch (error) {
    console.error(error);
  }
};

const refreshReservationData = async () => {
  loading.value = true;
  await reservationStore.readDateReservation();
  await reservationStore.readReservation();
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