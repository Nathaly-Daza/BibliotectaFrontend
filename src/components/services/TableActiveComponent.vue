<template>
  <div>
    <input type="text" v-model="searchTerm" :placeholder="$t('buttons.search')" class="form-control mb-3" />

    <div class="table-responsive m-1">
      <!-- Agregar un indicador de carga -->
      <div v-if="loading" class="d-flex justify-content-center">
        <LoadingComponent></LoadingComponent>
      </div>
      <div v-if="!loading">
        <table class="table table-bordered display mt-2" v-if="!loading" id="tableHistory">
          <thead class="thead">
            <tr>
              
              <th id="th" class="blue-color-bg text-light text-center">{{ $t('tables.name') }} </th>
              <th id="th" class="blue-color-bg text-light text-center">{{ $t('tables.reservationDate') }}</th>
              <th id="th" class="blue-color-bg text-light text-center">{{ $t('tables.reservationStart') }}</th>
              <th id="th" class="blue-color-bg text-light text-center">{{ $t('tables.reservationEnd') }} </th>
              <th id="th" class="blue-color-bg text-light text-center">{{ $t('tables.reservationQuotasTotal') }}</th>
              <th id="th" class="blue-color-bg text-light text-center">{{ $t('tables.reservationQuotas') }}</th>
              <th id="th" class="blue-color-bg text-light text-center">{{ $t('tables.reservationType') }}</th>
              <th id="th" class="blue-color-bg text-light text-center">{{ $t('tables.reservedrofessional') }}</th>
              <th id="th" class="blue-color-bg text-light text-center">{{ $t('tables.inscription') }}</th>
              <th class="blue-color-bg text-light text-center">{{ $t('tables.actions') }}</th>
  
            </tr>
          </thead>
          <tbody>
            <tr v-if="paginated.length === 0" class="text-center">
              <td colspan="7"> {{ $t('tables.data') }} </td>
            </tr>
            <tr v-for="(item, index) in paginated" :key="index">
              
              <td>{{ item['Nombre del servicio'] }} </td>
              <td>{{ item.Fecha }}</td>
              <td>{{ item['Hora inicio']}}</td>
              <td>{{ item['Hora fin'] }}</td>
              <td>{{ item['Cupos Totales'] }}</td>
              <td>{{  item['Cupos Totales'] -item['No. inscripciones'] }}</td>
              <td>{{ item['Tipo Servicio'] }}</td>
              <td>{{ item['Profesional'] }}</td>
              <td class="text-light text-center align-items-center justify-content-center"><button type="button" class="btn btn-success" @click="read(item['No. Servicio'])" data-bs-toggle="modal" data-bs-target="#Inscriptions" > {{ $t('tables.inscription') }}</button></td>
         
              <td>
                <div class="text-light text-center align-items-center justify-content-center">

                  <button @click="prepareEditForm(item)" type="button" data-bs-toggle="modal"
                    data-bs-target="#ModalServices" class="btn btn-outline-primary m-1">
                    <i class="ri-pencil-fill"></i>
                  </button>
                  <button @click="deleteReservation(item['No. Servicio'])" type="button" class="btn btn-outline-danger m-1">
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
    <div class="modal fade border-primary" id="ModalServices" tabindex="-1" aria-hidden="true"
      @data-bs-dismiss="resetEditForm">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-primary shadow-lg">
          <div class="modal-header">
            <h5 class="modal-title text-danger" id="exampleModalLabel">{{ $t('titles.editcategories') }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="editService">
              <div class="row">
                <div class="mb-3 col-md-12">
                  <label for="exampleInputName" class="form-label">{{ $t('forms.name') }}</label>
                  <input type="text" class="form-control" id="exampleInputName" v-model="ser_name" />
                  
                  <div v-if="errors['ser_name']" class="text-danger">{{ errors['ser_name'] }}</div>
                </div>
              </div>
              <div class="row">
                <div class="mb-3 col-md-12">
                  <label for="exampleInputQuotas" class="form-label">{{ $t('forms.quotas') }}</label>
                  <input type="number" class="form-control" id="exampleInputQuotas" v-model="ser_quotas" />
                  <div v-if="ser_quotas < 0" class="text-danger">{{$t('errors.numberQuotas')}}</div>
                  <div v-if="errors['ser_quotas']" class="text-danger">{{ errors['ser_quotas'] }}</div>
                </div>
              </div>
              <div class="row">
                <div class="mb-3 col-md-12">
                  <label for="exampleInputDate" class="form-label">{{ $t('forms.date') }}</label>
                  <input type="date" pattern="\d{4}-\{2}-\{2}" class="form-control" id="exampleInputDate"
                    v-model="ser_date" />
                  <div v-if="dateErrorMessage" class="text-danger">{{ dateErrorMessage }}</div>
                  <div v-if="errors['ser_date']" class="text-danger">{{ errors['ser_date'] }}</div>
                </div>
              </div>
              <div class="row">
                <div class="mb-3 col-md-6">
                  <label for="exampleInputDate" class="form-label">{{ $t('forms.hourStart') }}</label>
                  <input type="time" class="form-control" id="exampleInputDate" v-model="ser_start" />
                  <div v-if="timeErrorMessage" class="text-danger">{{ timeErrorMessage }}</div>
                  <div v-if="errors['ser_start']" class="text-danger">{{ errors['ser_start'] }}</div>
                </div>
                <div class="mb-3 col-md-6">
                  <label for="exampleInputDate" class="form-label">{{ $t('forms.hourEnd') }}</label>
                  <input type="time" class="form-control" id="exampleInputDate" v-model="ser_end" />
                  <div v-if="timeErrorMessage" class="text-danger">{{ timeErrorMessage }}</div>
                  <div v-if="errors['ser_end']" class="text-danger">{{ errors['ser_end'] }}</div>

                </div>
              </div>

              <div class="row">
                <div class="mb-3 col-md-6">
                  <label for="exampleInputStatus" class="form-label">{{ $t('forms.professional') }}</label>
                  <select id="spaSelect" v-model="prof_name" class="form-select">
                    <option v-for="(profItem, index) in filteredProfessinalItems" :key="index" :value="profItem.prof_id">
                      {{ profItem.prof_name }}
                    </option>
                  </select>
                  <div v-if="errors['prof_name']" class="text-danger">{{ errors['prof_name'] }}</div>
                </div>
                <div class="mb-3 col-md-6">
                  <label for="exampleInputStatus" class="form-label">{{ $t('forms.reservationType') }}</label>
                  <select id="spaSelect" v-model="ser_typ_name" class="form-select">
                    <option v-for="(serTypItem, index) in filteredServiceTypeItems" :key="index" :value="serTypItem.ser_typ_id">
                      {{ serTypItem.ser_typ_name }}
                    </option>
                  </select>
                  <div v-if="errors['serTyp_name']" class="text-danger">{{ errors['serTyp_name'] }}</div>
                </div>
                </div>
                <div class="row mt-4">
                  <div class="col-md-12 d-flex justify-content-center">
                    <button type="submit" class="btn btn-custom fw-semibold" :disabled="ser_typ_name === ''">
                      <span class="btn-content" v-if="!loadingButton">{{$t('buttons.send')}}</span>
                      <span class="btn-content" v-else>
                        <span class="spinner-border spinner-border-sm mr-2" aria-hidden="true" data-bs-dismiss="modal"></span>
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
  <ModalInscription :data="data"></ModalInscription>
</template>

<script setup>
import Swal from 'sweetalert2';
import { validateDate, validateTime, validateFields } from '../../validations';
import PaginationComponent from '../PaginationComponent.vue';
import LoadingComponent from '../LoadingComponent.vue';
import ModalInscription from '../services/ModalInscriptions.vue';
import { ref, watchEffect, onMounted, computed, watch } from "vue";
import { useServiceStore } from "../../stores/serviceStore";
import { useServiceTypeStore } from '../../stores/serviceTypesStore';
import { useProfessionalStore } from '../../stores/professionalStore';
import { useInscriptionStore } from '../../stores/InscriptionsStore';
import { useI18n } from 'vue-i18n'

const serviceStore = useServiceStore();
const professionalStore = useProfessionalStore();
const serviceTypeStore = useServiceTypeStore();
const inscriptionStore = useInscriptionStore()

const services = ref([]);
const ser_id = ref("")
const ser_date = ref(new Date());
const ser_typ_name = ref('');
const prof_name = ref('');
const ser_start = ref('');
const ser_end = ref('');
const ser_name = ref('');
const ser_quotas = ref('');
const dateErrorMessage= ref('');
const editing = ref(false);
const { t } = useI18n()
const data = ref([])
let loading = ref(false)
const loadingButton = ref(false);

const searchTerm = ref('')
const currentPage = ref(1)
const itemsPerPage = 10



//validaciones
const validateNameWrapper = () => {
  const fields = [
  { name: 'ser_date', value: ser_date.value },
  { name: 'ser_start', value: ser_start.value },
  { name: 'ser_end', value: ser_end.value },
  { name: 'spa_name', value: prof_name.value },
  { name: 'ser_typ_name', value: ser_typ_name.value },
  { name: 'ser_name', value: ser_name.value },
  { name: 'ser_quotas', value: ser_quotas.value }

];

  return validateFields(fields, t('validations.inputRequired'));
}
const errors = computed(() => {
  return validateNameWrapper()

})

const validateTimeWrapper = () => {
  const startTime = new Date(`2000-01-01T${ser_start.value}`);
  const endTime = new Date(`2000-01-01T${ser_end.value}`);
  return validateTime(startTime, endTime, t('validations.hourAfterInvalid'), t('validations.hourIqualInvalid'));
}
const timeErrorMessage = computed(() => {
  return validateTimeWrapper()

})
const read = async(item) => {
   
    data.value =await inscriptionStore.readInscription(item);
}


onMounted(async () => {
  loading.value = true
  await serviceStore.readActiveService();
  await serviceTypeStore.readServiceType();

  loading.value = false;
});

const filteredProfessinalItems = computed(() => {
  return professionalStore.professional.filter(profItem => profItem.prof_status === 1);
});
const filteredServiceTypeItems = computed(() => {
  return serviceTypeStore.serviceType.filter(serItem => serItem.ser_typ_status === 1);
});

// Actualizamos las services cuando cambie el valor de serviceStore.service
watchEffect(() => {
  services.value = serviceStore.service;
});


const formatTime = (time) => {
  return time ? time.substring(0, 5) : ''; // Devuelve los primeros 5 caracteres (hh:mm)
};


const prepareEditForm = (item) => {
  ser_id.value = item['No. Servicio'];
  ser_name.value = item['Nombre del servicio'];
  ser_quotas.value = item['Cupos Totales'];
  ser_date.value = item.Fecha;
  dateErrorMessage.value = '';

  // Busca el profesional seleccionado en professionalStore.professional
  const selectedProfessional = professionalStore.professional.find(profItem => profItem.prof_name === item.Profesional);
  prof_name.value = selectedProfessional ? selectedProfessional.prof_id : ''; // Asigna el id del profesional seleccionado

  // Busca el tipo de servicio seleccionado en serviceTypeStore.serviceType
  const selectedServiceType = serviceTypeStore.serviceType.find(serItem => serItem.ser_typ_name === item['Tipo Servicio']);
  ser_typ_name.value = selectedServiceType ? selectedServiceType.ser_typ_id : ''; // Asigna el id del tipo de servicio seleccionado
  ser_start.value = formatTime(item['Hora inicio']);
  ser_end.value = formatTime(item['Hora fin']);
  editing.value = true;
};

const editService = async () => {
  
//validaciones
dateErrorMessage.value = validateDate(ser_date.value, t('validations.dateBeforeInvalid'));
if (Object.keys(errors.value).length > 0 || timeErrorMessage.value || dateErrorMessage.value) {
  // Mostrar mensajes de error si las validaciones no pasan
  return;
}
try {
  loadingButton.value = true; await serviceStore.updateService(ser_id.value, ser_date.value, ser_start.value, ser_end.value, prof_name.value,ser_typ_name.value,ser_name.value.toUpperCase(), ser_quotas.value);
  loadingButton.value = false;
  //console.log(ser_id.value,ser_date.value,ser_start.value,ser_end.value, ser_typ_name.value,prof_name.value,use_id.value);

  editing.value = false;
 
} catch (error) {
  console.error(error);
}
refreshReservationData();
};

//Busqueda
const filter = computed(() => {
  const lowerSearchTerm = searchTerm.value.toLowerCase();
  if (!serviceStore.serviceA.length) {
    return [];
  }
  return serviceStore.serviceA.filter((item) => {
    const matchesId = item['No. Servicio'].toString().toLowerCase().includes(lowerSearchTerm);
    const matchesName = item['Nombre del servicio'].toLowerCase().includes(lowerSearchTerm)
    const matchesDate = item.Fecha.toString().toLowerCase().includes(lowerSearchTerm);
    const matchesStart = item['Hora inicio'] ? item['Hora inicio'].toString().toLowerCase().includes(lowerSearchTerm) : false;
    const matchesEnd = item['Hora fin'].toString().toLowerCase().includes(lowerSearchTerm);
    const matcheQuotas = item['Cupos Totales'].toString().toLowerCase().includes(lowerSearchTerm);
    const matchesTypeName = item['Tipo Servicio'].toLowerCase().includes(lowerSearchTerm);
    const matchesSpaName = item['Profesional'].toLowerCase().includes(lowerSearchTerm);
    return matchesId ||matchesName|| matchesDate || matchesStart || matchesEnd || matchesTypeName || matchesSpaName || matcheQuotas;
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

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-primary ml-2",
    cancelButton: "btn btn-danger mr-2"
  },
  buttonsStyling: false
});

const deleteReservation = async (ser_id) => {
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
      await serviceStore.cancelService(ser_id);
      await refreshReservationData();
      swalWithBootstrapButtons.fire({
        title:t('cancel.title2'),
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
  await serviceStore.readActiveService();
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
