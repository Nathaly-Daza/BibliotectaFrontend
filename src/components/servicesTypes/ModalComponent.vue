<template>
  <div class="container p-5">
    <!-- Modal -->
    <div class="modal fade border-primary" :id="props.edit == false ?'registerTypeReservations' : 'ModalServicesTypes'" tabindex="-1"
      aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-primary shadow-lg">
          <div class="modal-header">
            <h5 class="modal-title text-danger" id="exampleModalLabel">{{ props.edit == false ? $t('titles.Registrycategories') : $t('titles.editcategories') }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitForm">
              <div class="row">
                <div class="mb-3 col-md-12">
                  <label for="exampleInputName1" class="form-label">{{ $t('forms.name') }}</label>
                  <input type="text" class="form-control" id="exampleInputName1" aria-describedby="NameHelp"
                    v-model.trim="ser_typ_name" @input="handleInput"/>
                  <div v-if="nameError " class="text-danger">{{ nameError }}</div>
                </div>

              </div>
              <div class="row mt-4">
                <div class="col-md-12 d-flex justify-content-center">
                  <button type="submit" class="btn btn-custom fw-semibold" :disabled="ser_typ_name.trim() === '' || nameError != ''">
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

import { ref, computed, defineProps, watchEffect } from 'vue';
import { useServiceTypeStore } from '../../stores/serviceTypesStore';
import { validateNameSer } from '../../validations';
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const props = defineProps({
  ser_typ_id: Number,
  ser_typ_name: String,
  edit: Boolean,
});



const serviceTypesStore = useServiceTypeStore();
const ser_typ_name = ref(props.ser_typ_name ||'');

const loading = ref(false)
const loadingButton = ref(false);
const editing = ref(false);

const hasInteracted = ref(false); 

const validateNameWrapper = () => {
  return validateNameSer(ser_typ_name.value, t('validations.nameInvalid'))
}
const nameError = computed(() => {
  return hasInteracted.value ? validateNameWrapper(): '';

})

const handleInput = () => {
  if (!hasInteracted.value && ser_typ_name.value.trim() !== '') {
    hasInteracted.value = true; 
  }
};

watchEffect(() => {
  ser_typ_name.value = props.ser_typ_name || ''
  editing.value = props.edit
})

const submitForm = async () => {
  hasInteracted.value = true; 
  if (nameError.value) {
    return;
  }
  if(props.edit==false){
  try { 
    loadingButton.value = true
    await serviceTypesStore.registerServiceType(ser_typ_name.value.toUpperCase());
    loadingButton.value = false
    ser_typ_name.value = '';
    hasInteracted.value = false; 

  } catch (error) {
    console.log(error);
  }
  }else{
    try {
    loadingButton.value = true;
     await serviceTypesStore.updateServiceType(props.ser_typ_id, ser_typ_name.value.toUpperCase());
    loadingButton.value = false;
    // Restablecer el estado de edición y actualizar los datos
    editing.value = false;
    
    
    refreshReservationData();
  } catch (error) {
    console.error(error);
  }
  }
    refreshReservationData()
};
const refreshReservationData = async () => {
  loading.value = true;
  await serviceTypesStore.readServiceType();
  loading.value = false;
  hasInteracted.value = false; 

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
