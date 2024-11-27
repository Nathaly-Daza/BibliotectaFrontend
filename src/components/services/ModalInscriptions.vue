<template>
    <div v-if="props.data" class="modal fade border-primary" id="Inscriptions" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content border-primary shadow-lg">
                <div class="modal-header">
                    <h5 class="modal-title text-danger" id="exampleModalLabel"> {{ $t('tables.inscription') }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>{{$t('tables.name')}}</th>
                                <th>{{$t('tables.userEmail')}}</th>
                                <th>{{$t('tables.inscriptionDate')}}</th>
                            </tr>
                        </thead>
                        
                        <tbody v-if="props.data.data =='' ">
                        
                            <tr>
                                <td colspan="3" class="text-center">{{$t('tables.dataInscriptions')}}</td>
                            </tr>
                        </tbody>
                        <tbody v-else-if="props.data">
                            <tr v-for="(value, key) in props.data.data" :key="key">
                                <td>{{ value.per_name }} {{ value.per_lastname }}</td>
                                <td>{{ value.use_mail }}</td>
                                <td>{{ value.bio_ins_date }}</td>
                            </tr>
                        </tbody>
                    
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
    data: Object,
    ser_name: String
});
</script>
