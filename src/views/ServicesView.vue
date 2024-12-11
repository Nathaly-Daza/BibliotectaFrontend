<template>
  <div class="m-5">
    <div class="card shadow bg-body-tertiary rounded">
      <h2 class="red-color-text fw-bold text-center mt-3">
        {{ $t("titles.servicesReserv") }}
      </h2>
      <div class="card-header">
        <div class="row p-3">
          <div class="col-6 col-md-6 col-lg-6">
            <button
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#pdf"
              class="btn btn-danger mr-2"
            >
              <i class="bi bi-file-pdf"></i> {{ $t("buttons.pdf") }}
            </button>
            <button
              v-if="activeTab === 'table'"
              type="button"
              @click="exportCSV"
              class="btn btn-success mr-2"
            >
              <i class="ri-file-excel-2-fill"></i> {{ $t("buttons.excel") }}
            </button>
          </div>
          <div class="col-6 col-md-6 col-lg-6 text-end">
            <!--button modal lcth-->
            <button
              class="btn btn-custom"
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#RegistryReservation"
            >
              <i class="ri-add-circle-line"></i> {{ $t("buttons.Registry") }}
            </button>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div>
          <ul class="nav nav-tabs m-3">
            <li class="nav-item" v-for="(tab, index) in tabs" :key="index">
              <a
                class="nav-link"
                :class="{ active: activeTab === tab.name }"
                @click="changeTab(tab.name)"
                href="#"
              >
                <template v-if="tab.name === 'tableActive'">
                  {{ $t("tables.labelActiveService") }}
                </template>
                <template v-else-if="tab.name === 'table'">
                  {{ $t("tables.labelHistory") }}
                </template>
                <template v-else>
                  {{ $t("tables.labelCalendar") }}
                </template>
              </a>
            </li>
          </ul>

          <div v-for="(tab, index) in tabs" :key="index">
            <component :is="tab.component" v-if="activeTab === tab.name"></component>
          </div>
        </div>
     

        <div class="container p-5">
          <!-- Modal -->
          <div
            class="modal fade border-primary"
            id="pdf"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content border-primary shadow-lg">
                <div class="modal-header">
                  <h5 class="modal-title text-danger" id="exampleModalLabel">
                    {{ $t("titles.pdf") }}
                  </h5>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="modal-body">
                  <form @submit.prevent="exportPDF">
                    <div class="row">
                      <div class="mb-3 col-md-12">
                        <label for="exampleInputName1" class="form-label">{{$t("forms.labelpdf") }}</label>
                        <select class="form-control" v-model="selectedOption">
                          <option value="fecha">{{ $t("forms.date") }}</option>
                          <option value="rangoFecha">{{ $t("forms.dateRange") }}</option>
                          <option value="profesional">
                            {{ $t("forms.professional") }}
                          </option>
                          <option value="activas">{{ $t("forms.activeReser") }}</option>
                          <option value="todo">{{ $t("forms.allReser") }}</option>
                        </select>

                        <div v-show="selectedOption == 'fecha'" class="m-2">
                          <label class="form-label" for="fecha">{{$t("forms.labelDateOPt")}}</label>
                          <input
                            class="form-control"
                            type="date"
                            id="fecha"
                            v-model="selectedDate"
                          />
                        </div>
                        <div v-show="selectedOption == 'profesional'" class="m-2">
                          <label for="exampleInputStatus" class="form-label">{{ $t("forms.professional") }}:</label>
                          <select id="spaSelect" v-model="selectedService" class="form-control">
                            <option v-for="(profItem, index) in professionalStore.professional" :key="index" :value="profItem.use_id" >{{ profItem.per_name }} {{ profItem.per_lastname }}</option>
                          </select>
                        </div>
                        <div v-show="selectedOption == 'rangoFecha'" class="m-2">
                          <label class="form-label" for="dateStart">{{ $t("forms.dateInitial") }}</label>
                          <input class="form-control" type="date" id="dateStart" v-model="selectedDateStart" />
                          <label class="form-label" for="dateEnd">{{ $t("forms.dateEnd") }}</label>
                          <input class="form-control" type="date" id="dateEnd" v-model="selectedDateEnd" />
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-12 d-flex justify-content-center">
                        <button type="submit" class="btn btn-custom">
                          {{ $t("buttons.send") }} <i class="ri-send-plane-fill"></i>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal" >
                     {{ $t("buttons.close") }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>   <ModalComponent :edit="false"></ModalComponent>
</template>

<script setup>
import { ref, onMounted } from "vue";
import TableComponent from "../components/services/TableComponent.vue";
import TableActiveComponent from "../components/services/TableActiveComponent.vue";
import ModalComponent from "../components/services/ModalComponent.vue";
import calendarComponent from "../components/services/calendarComponet.vue";
import { exportReservationToCSV, exportReservationToPDF, showSwalAlert} from "../validations";
import { useServiceStore } from "../stores/serviceStore";
import { useProfessionalStore } from "../stores/professionalStore";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const professionalStore = useProfessionalStore();
const serviceStore = useServiceStore();
const selectedOption = ref("fecha");
const selectedDate = ref();
const selectedService = ref();
const selectedDateStart = ref();
const selectedDateEnd = ref();

const activeTab = ref("Calendar"); // Inicialmente muestra el componente de tabla

const tabs = [
  { name: "Calendar", component: calendarComponent },
  { name: "tableActive", component: TableActiveComponent },
  { name: "table", component: TableComponent },
];

const changeTab = (tabName) => {
  activeTab.value = tabName;
};

const exportCSV = () => {
  // Obtener los datos de la tienda de reservas
  const data = serviceStore.service
 

  // Definir el nombre del archivo CSV
  const filename = t("excel.services");
  if (data.length === 0) {
    // Mostrar una alerta si el array de datos está vacío
    showSwalAlert(null, t("pdf.error"), "warning");
  } else {
    // Exportar los datos filtrados como CSV
    exportReservationToCSV(filename, data);
  }
};

const exportPDF = async () => {
  let datas = null;
  let column = null;

  if (selectedOption.value === "fecha") {
    //console.log(selectedDate.value);
    column = "ser_date";
    datas = await serviceStore.readReportService(column, selectedDate.value);
    //console.log(datas)
  } else if (selectedOption.value === "rangoFecha") {
    const dateRange = await serviceStore.readReportDateService(
      selectedDateStart.value,
      selectedDateEnd.value
    );
    datas = dateRange;
    //console.log(datas)
  } else if (selectedOption.value === "profesional") {
    if (selectedService.value) {
      column = "use_id";
      const profesional = await serviceStore.readReportService(
        column,
        selectedService.value
      );
      datas = profesional;
      // console.log(datas);
    }
  } else if (selectedOption.value === "activas") {
    if (serviceStore.serviceA) {
      datas = serviceStore.serviceA;
      //console.log(datas)
    }
  } else if (selectedOption.value === "todo") {
    if (serviceStore.service) {
      datas = serviceStore.service
    
    }
  }
  if (datas.length === 0) {
    // Mostrar una alerta si el array de datos está vacío
    showSwalAlert(null, t("pdf.error"), "warning");
  } else {
    const title = t("pdf.services");
    exportReservationToPDF(title, datas);
  }
};

onMounted(() => {
  serviceStore.readService();
});
</script>

<style lang="scss" scoped>
.btn-custom {
  background-color: var(--red-color);
  color: #ffffff;
  padding: 1rem 4rem;
  font-size: 1.25rem;
}

.btn-custom:hover {
  background-color: var(--color-background);
  color: var(--blue-color);
  border: 2px solid var(--red-color);
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
