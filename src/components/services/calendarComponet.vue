<template>
  <div v-if="loading" class="d-flex justify-content-center">
    <LoadingComponent></LoadingComponent>
  </div>
  <div v-else>
    <!-- Dropdown para filtrar por espacio -->
    <div class="row m-2">
  <label for="spaSelect" class="col-12 col-md-12 me-2">{{$t('forms.filter')}} </label>
  <div class="col-12 col-md-5 col-lg-5 mb-2 mb-md-0">
    <label for="professionalSelect" class="form-label">{{$t('forms.professional')}}</label>
    <select id="professionalSelect" v-model="selectedProfessional" class="form-select">
      <option v-for="(profItem, index) in filteredProfessinalItems" :key="index" :value="profItem.prof_name">
        {{ profItem.prof_name }}
      </option>
    </select>
  </div>
  <div class="col-12 col-md-5 col-lg-5 mb-2 mb-md-0">
    <label for="serviceSelect" class="form-label">{{$t('forms.reservationType')}}</label>
    <select id="serviceSelect" v-model="selectedService" class="form-select">
      <option v-for="(profItem, index) in filteredServiceTypeItems" :key="index" :value="profItem.ser_typ_name">
        {{ profItem.ser_typ_name }}
      </option>
    </select>
  </div>
  <div class="col-12 col-md-2 col-lg-2 d-flex justify-content-center justify-content-md-start mt-md-4">
    <!-- Botón para borrar el filtro -->
    <button class="btn btn-primary w-100" @click="showAllEvents">{{$t('buttons.clearFilters')}}</button>
  </div>
</div>

    <!-- Componente Qalendar con eventos filtrados -->
    <Qalendar :selected-date="selectedDate" :events="filteredEvents" :config="config" />
  </div>
</template>

<script setup>
import { Qalendar } from "qalendar";
import LoadingComponent from '../LoadingComponent.vue';
import { ref, computed, onMounted, watch } from 'vue';
import { useProfessionalStore } from '../../stores/professionalStore';
import { useServiceStore } from '../../stores/serviceStore';
import { useServiceTypeStore } from '../../stores/serviceTypesStore';

const selectedDate = new Date();
selectedDate.setHours(0, 0, 0, 0);

const serviceStore = useServiceStore();
const professionalStore = useProfessionalStore();
const serviceTypeStore = useServiceTypeStore();


const selectedProfessional = ref("");
const selectedService= ref("");
const loading = ref(true);

const filteredProfessinalItems = computed(() => {
  return professionalStore.professional.filter(profItem => profItem.prof_status === 1);
});
const filteredServiceTypeItems = computed(() => {
  return serviceTypeStore.serviceType.filter(serItem => serItem.ser_typ_status === 1);
});
onMounted(async () => {
  await Promise.all([serviceStore.readActiveService(), professionalStore.readProfessional(), serviceTypeStore.readServiceType()]);
  loading.value = false;
});

const config = {
  defaultMode: "month",
  style: {
    colorSchemes: {
      meetings: {
        color: "#fff",
        backgroundColor: "#131313",
      },
      sports: {
        color: "#fff",
        backgroundColor: "#ff4081",
      },
    },
  },
};


const filteredEvents = computed(() => {
  if (selectedProfessional.value && selectedService.value) {
    // Si se seleccionaron tanto un profesional como un tipo de servicio
    return serviceStore.serviceA
      .filter(item => item.Profesional === selectedProfessional.value && item['Tipo Servicio'] === selectedService.value)
      .map(item => ({
        id: item['No. Servicio'],
        with: `Profesional: ${item.Profesional}`,
        title: ` ${item['Nombre del servicio']}`,
        time: {
          start: `${item.Fecha} ${item['Hora inicio'].substring(0, 5)}`,
          end: `${item.Fecha} ${item['Hora fin'].substring(0, 5)}`
        },
        color: "blue",
        topic: `Tipo de servicio: ${item['Tipo Servicio']}`,
      }));
  } else if (selectedProfessional.value) {
    // Si solo se seleccionó un profesional
    return serviceStore.serviceA
      .filter(item => item.Profesional === selectedProfessional.value)
      .map(item => ({
        id: item['No. Servicio'],
        with: `Profesional: ${item.Profesional}`,
        title: ` ${item['Nombre del servicio']}`,
        time: {
          start: `${item.Fecha} ${item['Hora inicio'].substring(0, 5)}`,
          end: `${item.Fecha} ${item['Hora fin'].substring(0, 5)}`
        },
        color: "blue",
        topic: `Tipo de servicio: ${item['Tipo Servicio']}`,
      }));
  } else if (selectedService.value) {
    // Si solo se seleccionó un tipo de servicio
    return serviceStore.serviceA
      .filter(item => item['Tipo Servicio'] === selectedService.value)
      .map(item => ({
        id: item['No. Servicio'],
        with: `Profesional: ${item.Profesional}`,
        title: ` ${item['Nombre del servicio']}`,
        time: {
          start: `${item.Fecha} ${item['Hora inicio'].substring(0, 5)}`,
          end: `${item.Fecha} ${item['Hora fin'].substring(0, 5)}`
        },
        color: "blue",
        topic: `Tipo de servicio: ${item['Tipo Servicio']}`,
      }));
  } else {
    // Si no se seleccionó ni un profesional ni un tipo de servicio
    return serviceStore.serviceA.map(item => ({
      id: item['No. Servicio'],
        with: `Profesional: ${item.Profesional}`,
        title: ` ${item['Nombre del servicio']}`,
        time: {
          start: `${item.Fecha} ${item['Hora inicio'].substring(0, 5)}`,
          end: `${item.Fecha} ${item['Hora fin'].substring(0, 5)}`
        },
        color: "blue",
        topic: `Tipo de servicio: ${item['Tipo Servicio']}`,
      }));
  }
});
const filterEventsByProfessional = () => {
  filteredEvents.value = [...filteredEvents.value];
};

watch(selectedProfessional, filterEventsByProfessional);

const showAllEvents = () => {
  selectedProfessional.value = '';
  selectedService.value = '';
};

</script>

<style>
@import "qalendar/dist/style.css";
</style>
