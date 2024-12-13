<template>
  <div class="container ">
    <!-- Modal -->
    <div class="modal fade border-primary" :id="props.edit == false ?'regystrySpaces' : 'modal'" tabindex="-1" aria-labelledby="exampleModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-primary shadow-lg">
          <div class="modal-header">
            <h5 class="modal-title text-danger" id="exampleModalLabel">{{ props.edit === false ? $t('titles.Registryservices') : $t('titles.editservices') }}            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitForm">
              <div class="row">
                <div class="mb-3 col-md-12">
                  <label for="exampleInputName1" class="form-label">{{ $t('forms.name') }}</label>
                  <input type="text" class="form-control" id="exampleInputName1" aria-describedby="NameHelp"
                    v-model.trim="spa_name" @input="handleInput"/>
                  <div v-if="nameError" class="text-danger">{{ nameError }}</div>
                </div>

              </div>
              <div class="row mt-4">
                <div class="col-md-12 d-flex justify-content-center">
                  <button type="submit" class="btn btn-custom fw-semibold" :disabled="spa_name.trim() === '' || nameError != ''|| nameError != ''">
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
import { ref, computed,watchEffect } from 'vue';
import { useSpaceStore } from '../../stores/spaceStore';
import { defineProps } from 'vue';
import { validateName } from '../../validations';
import { useI18n } from 'vue-i18n'


const props = defineProps({
  spa_id: Number,
  spa_name: String,
  edit: Boolean,
});


const spaceStores = useSpaceStore();
const spa_name = ref(props.spa_name ||'');
const editing = ref(false);
let loading = ref(false)
const loadingButton = ref(false);
const hasInteracted = ref(false); 


const { t } = useI18n()


const validateNameWrapper = () => {
  return validateName(spa_name.value, t('validations.nameInvalid'))
}
const nameError = computed(() => {console.log(props)
  return hasInteracted.value ? validateNameWrapper() : ''; 

})

const handleInput = () => {
  if (!hasInteracted.value && spa_name.value.trim() !== '') {
    hasInteracted.value = true; 
  }
};
watchEffect(() => {
  spa_name.value = props.spa_name || ''
  editing.value = props.edit
})
const submitForm = async () => {
  if (nameError.value) { return; }
  if(props.edit){
    try {
    loadingButton.value = true
    await spaceStores.updateSpace(props.spa_id, spa_name.value.toUpperCase());
    loadingButton.value = false
    editing.value = false;
    


  } catch (error) {
    // console.error(error);
  }

  }else{
    try {
    if (!nameError.value) {
      loadingButton.value = true;
      await spaceStores.registerSpace(spa_name.value.toUpperCase()); // Usar spaceStore en lugar de spaceStores
      loadingButton.value = false;
      spa_name.value = '';
    hasInteracted.value = false; 

    }
  } catch (error) {
    // console.log(error);
  }
  }
  
  refreshSpaceData()

};

const refreshSpaceData = async () => {
  loading.value = true;
  await spaceStores.readSpace();
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
