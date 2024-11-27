<template>
  <nav aria-label="Page navigation" class="text-sm-center">
    <ul class="pagination justify-content-center">
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <a class="page-link" href="#" @click.prevent="changePage(1)"><i class="ri-arrow-left-double-fill"></i></a>
      </li>
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)"><i class="ri-arrow-left-s-line"></i></a>
      </li>
      <li class="page-item" v-for="pageNumber in totalPages" :key="pageNumber"
        :class="{ active: currentPage === pageNumber }">
        <a class="page-link" href="#" @click.prevent="changePage(pageNumber)">{{ pageNumber }}</a>
      </li>
      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)"><i class="ri-arrow-right-s-line"></i></a>
      </li>
      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <a class="page-link" href="#" @click.prevent="changePage(totalPages)"><i class="ri-arrow-right-double-fill"></i></a>
      </li>
    </ul>
  </nav>
</template>


<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps(['currentPage', 'totalPages']);
const emit = defineEmits(['changePage']);

function changePage(pageNumber) {
  if (pageNumber >= 1 && pageNumber <= props.totalPages) {
    emit('changePage', pageNumber); // Emitir el evento changePage
  }
}
</script>

<style>
.page-link {
  color: var(--blue-color);
  ;
}

.page-link.active,
.active>.page-link {
  z-index: 3;
  color: var(--bs-pagination-active-color);
  background-color: var(--blue-color);
  border-color: var(--blue-color);
  ;
}

.page-item.active .page-link {
  z-index: 1;
  color: #fff;
  background-color: var(--blue-color);
  border-color: var(--blue-color);
}
</style>