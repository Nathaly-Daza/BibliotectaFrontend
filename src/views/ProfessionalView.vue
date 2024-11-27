<template>
  <div class="m-5     ">
    <div class="card  shadow bg-body-tertiary rounded">
      <h2 class="red-color-text fw-bold text-center mt-3">{{$t('titles.professional')}}</h2>
      <div class="card-header">
        <div class="row p-3">
          <div class="col-6 col-md-6 col-lg-6">
            <button type="button" @click="exportPDF" class="btn btn-danger mr-2"><i class="bi bi-file-pdf"></i> {{ $t('buttons.pdf') }}</button>
            <button type="button" @click="exportCSV" class="btn btn-success mr-2"><i class="ri-file-excel-2-fill"></i> {{ $t('buttons.excel') }}</button>
          </div>
          <div class="col-6 col-md-6 col-lg-6 text-end">
              <!--button modal lcth-->
              <button class="btn btn-custom " type="button" data-bs-toggle="modal" data-bs-target="#registerProfessional"><i class="ri-add-circle-line"></i> {{$t('buttons.Registry')}}</button>
            </div>
          
        </div>
      </div>
      <div class="card-body">
        
        <!--aqui va el datatable-->
        <TableComponent></TableComponent>
        <ModalComponent></ModalComponent>
      </div>
    </div>
  </div>
</template>

<script setup>
import TableComponent from '../components/professional/TableComponent.vue';
import ModalComponent from '../components/professional/ModalComponent.vue';
import {exportToCSV ,exportToPDF, showSwalAlert} from '../validations'
import {useProfessionalStore} from  '../stores/professionalStore'
import { useI18n } from 'vue-i18n'
  const { t } = useI18n()

const professionalStore = useProfessionalStore()
 
const exportCSV = () => {
  const data = professionalStore.professional;  
  const filename = t('excel.personal');  
  if (data.length === 0) {
       // Mostrar una alerta si el array de datos está vacío
    showSwalAlert(null, t('pdf.error'), 'warning');
    } else {
      exportToCSV( filename,data);
    }
  
};
 
const exportPDF = () => {
  const title = t('pdf.personal');  
  const data = professionalStore.professional;
  if (data.length === 0) {
       // Mostrar una alerta si el array de datos está vacío
    showSwalAlert(null, t('pdf.error'), 'warning');
    } else {
      exportToPDF(title, data);
    }
  
};
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
</style>