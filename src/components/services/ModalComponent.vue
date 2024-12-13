<template>
  <div class="container p-5">
    <!-- Modal -->
    <div class="modal fade border-primary" :id=" props.edit==false ?'RegistryReservation' :'ModalServices'" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-primary shadow-lg">
          <div class="modal-header">
            <h5 class="modal-title text-danger" id="exampleModalLabel">{{ props.edit==false ? $t('titles.Registrycategories'): $t('titles.editcategories') }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmitReservation">
          
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
                  <div v-if="ser_quotas < 0" class="text-danger">{{ $t('errors.numberQuotas') }}</div>
                  <div v-if="errors['ser_quotas']" class="text-danger">{{ errors['ser_quotas'] }}</div>
                </div>
              </div>
              <div class="row">
                <div class="mb-3 col-md-12">
                  <label for="exampleInputDate" class="form-label">{{ $t('forms.date') }}</label>
                  <input type="date" class="form-control" id="exampleInputDate" v-model="ser_date" />
                  <div v-if="dateErrorMessage" class="text-danger">{{ dateErrorMessage }}</div>
                  <div v-if="errors['ser_date']" class="text-danger">{{ errors['ser_date'] }}</div>
                </div>
              </div>
              <div class="row">
                <div class="mb-3 col-md-6">
                  <label for="exampleInputStart" class="form-label">{{ $t('forms.reservationStart') }}</label>
                  <input type="time" class="form-control" id="exampleInputStart" v-model="ser_start" />
                  <div v-if="timeErrorMessage" class="text-danger">{{ timeErrorMessage }}</div>
                  <div v-if="errors['ser_start']" class="text-danger">{{ errors['ser_start'] }}</div>
                </div>
                <div class="mb-3 col-md-6">
                  <label for="exampleInputEnd" class="form-label">{{ $t('forms.reservationEnd') }}</label>
                  <input type="time" class="form-control" id="exampleInputEnd" v-model="ser_end" />
                  <div v-if="timeErrorMessage" class="text-danger">{{ timeErrorMessage }}</div>
                  <div v-if="errors['ser_end']" class="text-danger">{{ errors['ser_end'] }}</div>
                </div>
              </div>

              <div class="row">
                <div class="mb-3 col-md-6">
                  <label for="exampleInputStatus" class="form-label">{{ $t('forms.professional') }}</label>
                  <select id="spaSelect" v-model="prof_name" class="form-select">
                    <option v-for="(profItem, index) in professionalStore.professional" :key="index"
                      :value="profItem.use_id">
                      {{ profItem.per_name }}
                      {{ profItem.per_lastname }}
                    </option>
                  </select>
                  <div v-if="errors['prof_name']" class="text-danger">{{ errors['prof_name'] }}</div>
                </div>
                <div class="mb-3 col-md-6">
                  <label for="exampleInputStatus" class="form-label">{{ $t('forms.reservationType') }}</label>
                  <select id="spaSelect" v-model="ser_typ_name" class="form-select">
                    <option v-for="(serTypItem, index) in filteredServiceTypeItems" :key="index"
                      :value="serTypItem.ser_typ_id">
                      {{ serTypItem.ser_typ_name }}
                    </option>
                  </select>
                  <div v-if="errors['ser_typ_name']" class="text-danger">{{ errors['ser_typ_name'] }}</div>
                </div>

              </div>
              <div class="row mt-4">
                <div class="col-md-12 d-flex justify-content-center">
                  <button type="submit" class="btn btn-custom fw-semibold" :disabled="ser_typ_name === ''">
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
import { validateDate, validateTime, validateFields } from '../../validations';
import { useServiceStore } from '../../stores/serviceStore';
import { useReservationStore } from '../../stores/reservationStore';
import { useProfessionalStore } from '../../stores/professionalStore';
import { useServiceTypeStore } from '../../stores/serviceTypesStore';

import { ref, computed, onMounted, defineProps, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

//import CryptoJS from 'crypto-js';

const props =defineProps({

  ser_id:Number,
    ser_name:String,
    ser_quotas:Number,
    ser_date:String,
    prof_name:Number,
    ser_typ_name:Number,
    ser_start:String,
    ser_end:String,
    edit:Boolean

})


const professionalStore = useProfessionalStore();
const serviceTypeStore = useServiceTypeStore();

const serviceStore = useServiceStore();
const reservationStore = useReservationStore();

const ser_date = ref(props.ser_date||'');
const selectedUser = ref('');
// const selectedUserAcc = ref('');
// const selectedUserId = ref('');
const ser_typ_name = ref(props.ser_typ_name||'');
const prof_name = ref(props.prof_name||'');
const ser_start = ref(props.ser_start||'');
const ser_end = ref(props.ser_end||'');
const ser_name= ref(props.ser_name||'')
const ser_quotas = ref(props.ser_quotas||'')
const editing = ref(false);

const UserItems = ref([]);
let loading = ref(false)
const loadingButton = ref(false);



//validaciones
const validateNameWrapper = () => {
  const fields = [
    // { name: 'use_id', value: selectedUserId.value },
    { name: 'ser_date', value: ser_date.value },
    { name: 'ser_start', value: ser_start.value },
    { name: 'ser_end', value: ser_end.value },
    { name: 'prof_name', value: prof_name.value },
    { name: 'ser_typ_name', value: ser_typ_name.value},
    { name: 'ser_name', value: ser_name.value},
    { name: 'ser_quotas', value: ser_quotas.value},
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

const validateDateWrapper = () => {
  console.log(ser_date.value)

  return validateDate(ser_date.value, t('validations.dateBeforeInvalid'));
 } 
const dateErrorMessage = computed(() => {
  return validateDateWrapper()

})
onMounted(async () => {
  try {
    const users = await reservationStore.readUsers();
    UserItems.value = users.data;

    await serviceTypeStore.readServiceType();
    await professionalStore.readProfessional();
    


  } catch (error) {
    console.error(error);
  }
});

const filteredServiceTypeItems = computed(() => {
  return serviceTypeStore.serviceType.filter(serItem => serItem.ser_typ_status === 1);
});

watchEffect(() => {
  ser_name.value = props.ser_name || ''
  ser_date.value = props.ser_date || ''
  prof_name.value = props.prof_name || ''
  ser_typ_name.value = props.ser_typ_name || ''
  ser_start.value = props.ser_start || ''
  ser_end.value = props.ser_end || ''
  editing.value = props.edit
  console.log(props)
})
const handleSubmitReservation = async () => {

  if (Object.keys(errors.value).length > 0 || timeErrorMessage.value || dateErrorMessage.value) { return; }
  // Registrar la reserva
  if(props.edit ==false){
  try {
    loadingButton.value = true;
    //const secretKey = 'TuClaveSecreta';
    //const user = CryptoJS.AES.decrypt(localStorage.getItem('id'), secretKey).toString(CryptoJS.enc.Utf8);
    await serviceStore.registerReservation(ser_date.value, ser_start.value, ser_end.value, prof_name.value, ser_typ_name.value, ser_name.value.toUpperCase(), ser_quotas.value);
    // console.log(ser_date.value, ser_start.value, ser_end.value, prof_name.value, ser_typ_name.value, ser_name.value.toUpperCase(), ser_quotas.value)
    loadingButton.value = false;
    // selectedUserId.value = '';
    selectedUser.value = '';
    ser_date.value = '';
    ser_start.value = '';
    ser_end.value = '';
    prof_name.value = '';
    ser_typ_name.value = ''
    ser_name.value = ''
    ser_quotas.value = ''

    // Limpiar mensajes de error
    timeErrorMessage.value = '';
    dateErrorMessage.value = '';

  } catch (error) {
    console.log(error);
  }
}else{
  try {
  loadingButton.value = true; await serviceStore.updateService(props.ser_id, ser_date.value, ser_start.value, ser_end.value, prof_name.value,ser_typ_name.value,ser_name.value.toUpperCase(), ser_quotas.value);
  loadingButton.value = false;

  editing.value = false;
 
} catch (error) {
  console.error(error);
}
}
  refreshReservationData();
};

const refreshReservationData = async () => {
  loading.value = true;
  await serviceStore.readService();
  await serviceStore.readActiveService();
  loading.value = false;
};

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