<template>
  <div v-if="loading" class="d-flex justify-content-center">
    <LoadingComponent></LoadingComponent>
  </div>
  <div v-else>
    <!-- Dropdown para filtrar por espacio -->
    <div class="row m-2">
  <div class="col-12 col-md-9 col-lg-9 mb-2 mb-md-0">
    <label for="spaSelect" class="form-label">{{$t('forms.spaces')}}:</label>
    <select id="spaSelect" v-model="selectedSpace" class="form-select">
      <option v-for="(spaceItem, index) in filteredSpaceItems" :key="index" :value="spaceItem.spa_name">
        {{ spaceItem.spa_name }}
      </option>
    </select>
  </div>
  <div class="col-12 col-md-3 col-lg-3 d-flex justify-content-center pt-md-4">
    <!-- Botón para borrar el filtro -->
    <button class="btn btn-primary w-100 " @click="showAllEvents">{{$t('buttons.clearFilters')}}</button>
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
import { useSpaceStore } from '../../stores/spaceStore';
import { useReservationStore } from '../../stores/reservationStore';

const selectedDate = new Date();
selectedDate.setHours(0, 0, 0, 0);

const reservationStore = useReservationStore();
const spaceStore = useSpaceStore();

const selectedSpace = ref("");
const loading = ref(true);

const filteredSpaceItems = computed(() => {
  return spaceStore.spaces.filter(spaceItem => spaceItem.spa_status === 1);
});

onMounted(async () => {
  await Promise.all([reservationStore.readDateReservation(), spaceStore.readSpace()]);
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
  if (!selectedSpace.value) {
    return reservationStore.reservationDate.map(item => ({
      id: item['No. Reserva'],
      with: item.Correo,
      location: item.Espacio,
      title: `Reservación # ${item['No. Reserva']}`,
      time: {
        start: `${item.Fecha} ${item['Hora inicio'].substring(0, 5)}`,
        end: `${item.Fecha} ${item['Hora fin'].substring(0, 5)}`
      },
      color: "blue",
      description: `Reservación en el espacio: ${item.Espacio}.`,
      spa_name: item.Espacio
    }));
  } else {
    return reservationStore.reservationDate
      .filter(item => item.Espacio === selectedSpace.value)
      .map(item => ({
        id: item['No. Reserva'],
      with: item.Correo,
      location: item.Espacio,
      title: `Reservación # ${item['No. Reserva']}`,
      time: {
        start: `${item.Fecha} ${item['Hora inicio'].substring(0, 5)}`,
        end: `${item.Fecha} ${item['Hora fin'].substring(0, 5)}`
      },
      color: "blue",
      description: `Reservación en el espacio: ${item.Espacio}.`,
      spa_name: item.Espacio
      }));
  }
});

const filterEventsBySpace = () => {
  filteredEvents.value = [...filteredEvents.value];
};

watch(selectedSpace, filterEventsBySpace);

const showAllEvents = () => {
  selectedSpace.value = '';
};

</script>

<style>
@import "qalendar/dist/style.css";
</style>
