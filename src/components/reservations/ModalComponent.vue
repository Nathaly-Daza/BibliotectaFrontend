<template>
  <div class="container p-5">
    <!-- Modal -->
    <div class="modal fade border-primary" id="RegistryReservation" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-primary shadow-lg">
          <div class="modal-header">
            <h5 class="modal-title text-danger" id="exampleModalLabel">{{ $t('titles.Registryreservations') }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmitReservation">
              <div class="row">
                <div class="mb-3 col-md-12">
                  <label for="exampleInputDate" class="form-label">{{ $t('forms.users') }}</label>
                  <input type="text" list="users-list" id="exampleInputUser" name="users-list" class="form-control"
                    v-model="selectedUser" @input="updateSelectedUserId" />
                  <datalist id="users-list">
                    <option v-for="item in UserItems" :key="item.use_id" :value="item.use_mail"
                      :data-id="[item.use_id]">
                    </option>
                  </datalist>
                  <div v-if="errors['use_id']" class="text-danger">{{ errors['use_id'] }}</div>
                </div>
              </div>
              <div class="row">
                <div class="mb-3 col-md-12">
                  <label for="exampleInputDate" class="form-label">{{ $t('forms.date') }}</label>
                  <input type="date" class="form-control" id="exampleInputDate" v-model="res_date" />
                  <div v-if="dateErrorMessage" class="text-danger">{{ dateErrorMessage }}</div>
                  <div v-if="errors['res_date']" class="text-danger">{{ errors['res_date'] }}</div>
                </div>
              </div>
              <div class="row mt-3">
                <div class="col-md-12">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="isRecurring" v-model="isRecurring">
                    <label class="form-check-label" for="isRecurring">
                      {{ $t('forms.recurringReservation') }}
                    </label>
                  </div>
                </div>
              </div>

              <div v-if="isRecurring" class="row mt-3">
                <div class="col-md-6">
                  <label for="recurrenceType" class="form-label">{{ $t('forms.recurrenceType') }}</label>
                  <select id="recurrenceType" class="form-select" v-model="recurrenceType">
                    <option value="weekly">{{ $t('forms.weekly') }}</option>
                    <option value="monthly">{{ $t('forms.monthly') }}</option>
                  </select>
                  <div v-if="errors['recurrenceType']" class="text-danger">{{ errors['recurrenceType'] }}</div>
                </div>
                <div class="col-md-6">
                  <label for="recurrenceEndDate" class="form-label">{{ $t('forms.recurrenceEndDate') }}</label>
                  <input type="date" id="recurrenceEndDate" class="form-control" v-model="recurrenceEndDate">
                  <div v-if="errors['recurrenceEndDate']" class="text-danger">{{ errors['recurrenceEndDate'] }}</div>
                </div>
            </div>


              <div class="row">
                <div class="mb-3 col-md-6">
                  <label for="exampleInputStart" class="form-label">{{ $t('forms.reservationStart') }}</label>
                  <input type="time" class="form-control" id="exampleInputStart" v-model="res_start" />
                  <div v-if="timeErrorMessage" class="text-danger">{{ timeErrorMessage }}</div>
                  <div v-if="errors['res_start']" class="text-danger">{{ errors['res_start'] }}</div>
                </div>
                <div class="mb-3 col-md-6">
                  <label for="exampleInputEnd" class="form-label">{{ $t('forms.reservationEnd') }}</label>
                  <input type="time" class="form-control" id="exampleInputEnd" v-model="res_end" />
                  <div v-if="timeErrorMessage" class="text-danger">{{ timeErrorMessage }}</div>
                  <div v-if="errors['res_end']" class="text-danger">{{ errors['res_end'] }}</div>
                </div>
              </div>

              <div class="row">
                <div class="mb-3 col-md-12">
                  <label for="exampleInputStatus" class="form-label">{{ $t('forms.reservedSpace') }}</label>
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
                  <button type="submit" class="btn btn-custom fw-semibold" :disabled="spa_name=== ''">
                    <span class="btn-content" v-if="!loadingButton">{{$t('buttons.send')}}</span>
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
import { validateDate, validateTime, validateFields } from '../../validations';
import { useReservationStore } from '../../stores/reservationStore';
import { useSpaceStore } from '../../stores/spaceStore';
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
//import CryptoJS from 'crypto-js';

const spaceStore = useSpaceStore();
const reservationStore = useReservationStore();

const res_date = ref('');
const selectedUser = ref('');
const selectedUserAcc = ref('');
const selectedUserId = ref('');

const spa_name = ref('');
const res_start = ref('');
const res_end = ref('');
//const dateTimeErrorMessage = ref('');
const UserItems = ref([]);
let loading = ref(false)
const loadingButton = ref(false);
const isRecurring = ref(false); // Controla si la reserva es recurrente
const recurrenceType = ref(''); // Tipo de recurrencia: "weekly" o "monthly"
const recurrenceEndDate = ref(''); // Fecha límite de la recurrencia





//validaciones
const validateNameWrapper = () => {
  const fields = [
    { name: 'use_id', value: selectedUserId.value },
    { name: 'res_date', value: res_date.value },
    { name: 'res_start', value: res_start.value },
    { name: 'res_end', value: res_end.value },
    { name: 'spa_name', value: spa_name.value },
    { name: 'isRecurring', value: isRecurring.value },
    { name: 'recurrenceType', value: recurrenceType.value },
    { name: 'recurrenceEndDate', value: recurrenceEndDate.value },
  ];

  return validateFields(fields, t('validations.inputRequired'));
}
/*const errors = computed(() => {
  return validateNameWrapper()

})*/

const validateTimeWrapper = () => {
  const startTime = new Date(`2000-01-01T${res_start.value}`);
  const endTime = new Date(`2000-01-01T${res_end.value}`);
  return validateTime(startTime, endTime, t('validations.hourAfterInvalid'), t('validations.hourIqualInvalid'));
}
const timeErrorMessage = computed(() => {
  return validateTimeWrapper()

})

const validateDateWrapper = () => {
  return validateDate(res_date.value, t('validations.dateBeforeInvalid'));
}
const dateErrorMessage = computed(() => {
  return validateDateWrapper()

})

onMounted(async () => {
  try {
    const users = await reservationStore.readUsers();
    UserItems.value = users.data;
    //console.log(UserItems.value);
  } catch (error) {
    console.error(error);
  }
});

const filteredSpaceItems = computed(() => {
  return spaceStore.spaces.filter(spaceItem => spaceItem.spa_status === 1);
});

const updateSelectedUserId = (event) => {
  const selectedUserItem = UserItems.value.find(item => item.use_mail === event.target.value);
  if (selectedUserItem) {
    selectedUserId.value = selectedUserItem.use_id;
    selectedUserAcc.value = selectedUserItem.acc_admin;
  } else {
    selectedUserId.value = '';
  }
};
const handleSubmitReservation = async () => {
  if (Object.keys(errors.value).length > 0 || timeErrorMessage.value || dateErrorMessage.value) {
    return;
  }

  try {
    loadingButton.value = true;
    await reservationStore.registerReservation(
      res_date.value,
      res_start.value,
      res_end.value,
      spa_name.value,
      parseInt(selectedUserId.value),
      parseInt(selectedUserAcc.value),
      isRecurring.value,
      isRecurring.value ? recurrenceType.value : null,
      isRecurring.value ? recurrenceEndDate.value : null,
    );
    loadingButton.value = false;

    // Limpiar el formulario
    selectedUserId.value = '';
    res_date.value = '';
    res_start.value = '';
    res_end.value = '';
    spa_name.value = '';
    isRecurring.value = false;
    recurrenceType.value = '';
    recurrenceEndDate.value = '';
  } catch (error) {
    console.error(error);
  }

  refreshReservationData();
};
/* const handleSubmitReservation = async () => {
  // Validar el formulario antes de enviar
  if (Object.keys(errors.value).length > 0 || timeErrorMessage.value || dateErrorMessage.value) {
    return;
  }

  try {
    loadingButton.value = true;

    // Datos para la reserva
    const reservationData = {
      res_date: res_date.value,
      res_start: res_start.value,
      res_end: res_end.value,
      spa_id: parseInt(spa_name.value),
      use_id: parseInt(selectedUserId.value),
      is_recurrent: isRecurring.value,
      recurrence_type: isRecurring.value ? recurrenceType.value : null,
      recurrence_end_date: isRecurring.value ? recurrenceEndDate.value : null,
    };

    // Enviar la reserva al backend
    await reservationStore.registerReservation(reservationData);
    loadingButton.value = false;

    // Limpiar el formulario después de enviar
    selectedUserId.value = '';
    res_date.value = '';
    res_start.value = '';
    res_end.value = '';
    spa_name.value = '';
    isRecurring.value = false;
    recurrenceType.value = '';
    recurrenceEndDate.value = '';
  } catch (error) {
    console.error(error);
  }

  refreshReservationData();
}; */

const refreshReservationData = async () => {
  loading.value = true;
  await reservationStore.readDateReservation();
  await reservationStore.readReservation();
  loading.value = false;
};
/* const validateRecurringWrapper = () => {
  if (isRecurring.value) {
    if (!recurrenceType.value) {
      return { recurrenceType: t('validations.recurrenceTypeRequired') };
    }
    if (!recurrenceEndDate.value || recurrenceEndDate.value <= res_date.value) {
      return { recurrenceEndDate: t('validations.invalidRecurrenceEndDate') };
    }
  }
  return {};
}; */

const validateRecurringWrapper = () => {
  if (isRecurring.value) {
    const errors = {};
    if (!recurrenceType.value) {
      errors.recurrenceType = t('validations.recurrenceTypeRequired');
    }
    if (!recurrenceEndDate.value || recurrenceEndDate.value <= res_date.value) {
      errors.recurrenceEndDate = t('validations.invalidRecurrenceEndDate');
    }
    return errors;
  }
  return {};
};

const errors = computed(() => {
  const baseErrors = validateNameWrapper();
  const recurrenceErrors = validateRecurringWrapper();
  return { ...baseErrors, ...recurrenceErrors };
});

</script>


<style lang="scss" scoped>
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
