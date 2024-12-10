<template>
  <div class="m-5     ">
    <div class="card  shadow bg-body-tertiary rounded">
      <h2 class="red-color-text fw-bold text-center mt-3">{{ $t('titles.spacesReserv') }}</h2>
      <div class="card-header">
        <div class="row p-3">
          <div class="col-6 col-md-6 col-lg-6 ">
            <button type="button" data-bs-toggle="modal" data-bs-target="#pdf" class="btn btn-danger mr-2"><i
                class="bi bi-file-pdf"></i> {{ $t('buttons.pdf') }}</button>
            <!-- Mostrar el botón de Excel solo cuando esté en el componente de historial -->
            <button v-if="activeTab === 'table'" @click="exportCSV" class="btn btn-success mr-2">
              <i class="ri-file-excel-2-fill"></i> {{ $t('buttons.excel') }}
            </button>
          </div>
          <div class="col-12 col-md-6 col-lg-6  text-end">
            <button class="btn btn-success " type="button"  data-bs-toggle="modal"
            data-bs-target="#importCVS" ><i class="ri-download-2-line"></i> {{ $t('buttons.Import')}}</button>
            <!--button modal lcth-->
            <button class="btn btn-custom mx-2" type="button" data-bs-toggle="modal"
              data-bs-target="#RegistryReservation"><i class="ri-add-circle-line"></i> {{ $t('buttons.Registry')
              }}</button>

              
          </div>

        </div>
      </div>
      <div class="card-body">

        <div>
          <ul class="nav nav-tabs m-3">
            <li class="nav-item" v-for="(tab, index) in tabs" :key="index">
              <a class="nav-link" :class="{ active: activeTab === tab.name }" @click="changeTab(tab.name)" href="#">
                <template v-if="tab.name === 'tableActive'">
                  {{ $t('tables.labelActive') }}
                </template>
                <template v-else-if="tab.name === 'table'">
                  {{ $t('tables.labelHistory') }}
                </template>
                <template v-else>
                  {{ $t('tables.labelCalendar') }}
                </template>
              </a>
            </li>

          </ul>

          <div v-for="(tab, index) in tabs" :key="index">
            <component :is="tab.component" v-if="activeTab === tab.name"></component>
          </div>
        </div>
        <ModalComponent></ModalComponent>
        <importCVS></importCVS>

        <div class="container p-5">
          <!-- Modal -->
          <div class="modal fade border-primary" id="pdf" tabindex="-1" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content border-primary shadow-lg">
                <div class="modal-header">
                  <h5 class="modal-title text-danger" id="exampleModalLabel">{{ $t('titles.pdf') }} </h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <form @submit.prevent="exportPDF">
                    <div class="row">
                      <div class="mb-3 col-md-12">
                        <label for="exampleInputName1" class="form-label">{{ $t('forms.labelpdf') }}</label>
                        <select class="form-control" v-model="selectedOption">
                          <option value="fecha">{{ $t('forms.date') }}</option>
                          <option value="rangoFecha">{{ $t('forms.dateRange') }}</option>
                          <option value="espacio">{{ $t('forms.reservedSpace') }}</option>
                          <option value="activas">{{ $t('forms.activeReser') }}</option>
                          <option value="todo">{{ $t('forms.allReser') }}</option>
                        </select>

                        <div v-show="selectedOption == 'fecha'" class="m-2">
                          <label class="form-label" for="fecha">{{ $t('forms.labelDateOPt') }}</label>
                          <input class="form-control" type="date" id="fecha" v-model="selectedDate">
                        </div>
                        <div v-show="selectedOption == 'rangoFecha'" class="m-2">
                          <label class="form-label" for="DateStart">{{ $t('forms.dateInitial') }}</label>
                          <input class="form-control" type="date" id="DateStart" v-model="selectedDateStart">
                          <label class="form-label" for="dateEnd">{{ $t('forms.dateEnd') }}</label>
                          <input class="form-control" type="date" id="dateEnd" v-model="selectedDateEnd">
                        </div>
                        <div v-show="selectedOption == 'espacio'" class="m-2">
                          <label for="exampleInputStatus" class="form-label">{{ $t('forms.reservedSpace') }}</label>
                          <select class="form-select" id="exampleInputStatus" v-model="selectedSpace">
                            <option v-for="(spaceItem, index) in spaceStore.spaces" :key="index"
                              :value="spaceItem.spa_id">
                              {{ spaceItem.spa_name }}
                            </option>
                          </select>
                        </div>
                      </div>

                    </div>
                    <div class="row">
                      <div class="col-md-12 d-flex justify-content-center">
                        <button type="submit" class="btn btn-custom">{{ $t('buttons.send') }} <i
                            class="ri-send-plane-fill"></i></button>
                      </div>
                    </div>
                  </form>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">
                    {{ $t('buttons.close') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import TableComponent from '../components/reservations/TableComponent.vue';
import TableActiveComponent from '../components/reservations/TableActiveComponent.vue';
import ModalComponent from '../components/reservations/ModalComponent.vue';
import importCVS from '../components/reservations/ImportCVS.vue';
import calendarComponent from '../components/reservations/calendarComponet.vue';

import { exportReservationToCSV, exportReservationToPDF, showSwalAlert } from '../validations'
import { useReservationStore } from '../stores/reservationStore'
import { useSpaceStore } from '../stores/spaceStore';
import { useI18n } from 'vue-i18n'
  const { t } = useI18n()



const spaceStore = useSpaceStore();
const reservationStore = useReservationStore()
const selectedOption = ref('fecha')
const selectedDate = ref()
const selectedSpace = ref()
const selectedDateStart = ref()
const selectedDateEnd = ref()

const activeTab = ref('Calendar');// Inicialmente muestra el componente de tabla

const tabs = [
  { name: 'Calendar', component: calendarComponent },
  { name: 'tableActive', component: TableActiveComponent },
  { name: 'table', component: TableComponent }
];

const changeTab = (tabName) => {
  activeTab.value = tabName;
};


const exportCSV = () => {
  // Obtener los datos de la tienda de reservas
  const data = reservationStore.reservation.map(reservation => {
    const clonedReservation = { ...reservation };

    delete clonedReservation[Object.keys(clonedReservation).pop()];
    return clonedReservation;
  });

  // Definir el nombre del archivo CSV
  const filename = t('excel.ReservationSpaces');
  if (data.length === 0) {
       // Mostrar una alerta si el array de datos está vacío
    showSwalAlert(null, t('pdf.error'), 'warning')

  }else {
    // Exportar los datos filtrados como CSV
  exportReservationToCSV(filename, data);
  } 
};


const exportPDF = async () => {
  let datas = null;
  let column = null

  if (selectedOption.value === 'fecha') {
    //console.log(selectedDate.value);
    column = 'res_date'
    datas = await reservationStore.readDateReportReservation(column, selectedDate.value);
    //console.log(datas)

  } else if (selectedOption.value === 'rangoFecha') {
      
      const dateRange = await reservationStore.readReportDateReservation(selectedDateStart.value,selectedDateEnd.value);
      datas = dateRange
    //console.log(datas)
    
  } else if (selectedOption.value === 'espacio') {

    if (selectedSpace.value) {
      column = 'spa_id'
      const space = await reservationStore.readDateReportReservation(column, selectedSpace.value);
      datas = space
    }
  } else if (selectedOption.value === 'activas') {
      if (reservationStore.reservationDate) {
        datas = reservationStore.reservationDate.map(reservation => {
          const { ...clonedReservation } = reservation; // Hacemos una copia del objeto
          const keys = Object.keys(clonedReservation);
          delete clonedReservation[keys[keys.length - 2]]; // Eliminamos la penúltima propiedad
          return clonedReservation;
        });
      }
} else if (selectedOption.value === 'todo') {

    if (reservationStore.reservation) {
      datas = reservationStore.reservation.map(reservation => {
        const clonedReservation = { ...reservation };

        delete clonedReservation[Object.keys(clonedReservation).pop()];
        return clonedReservation;
      });
    }
  }
  if (datas.length === 0) {
       // Mostrar una alerta si el array de datos está vacío
    showSwalAlert(null, t('pdf.error'), 'warning')

  }else {
    const title = t('pdf.ReservationSpaces');
    exportReservationToPDF(title, datas);
  } 
};

onMounted(() => {
  reservationStore.readReservation();
});
</script>

<style lang="scss" scoped>
.btn-custom {
  background-color: var(--red-color);
  color: #ffffff;
  padding: 0.5rem 2rem;
  font-size: 1.25rem;
}

.btn-custom:hover {
  background-color: var(--color-background);
  color: var(--blue-color);
  border: 2px solid var(--red-color);
}
.btn-success {
  color: #ffffff;
  padding: 0.5rem 2rem;
  font-size: 1.25rem;
}

.btn-success:hover {
  background-color: var(--color-background);
  color: var(--blue-color);
  border: 2px solid #12903a;
}

@media (max-width: 630px) {
  .btn-custom {
    padding: 0.5rem 1rem;
    font-size: 1rem;
  }
}
.nav-link:hover{
  color: black;
  background-color: #ffffff
}

</style>