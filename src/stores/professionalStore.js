import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './authStore.js';
import { handleError} from "../validations.js";
import CryptoJS from 'crypto-js';
import { ref } from 'vue'

export const useProfessionalStore = defineStore('professionalStore', () => {
  const authStore = useAuthStore();
  const professional = ref([]);

  
  const secretKey = 'TuClaveSecreta';
  const user = CryptoJS.AES.decrypt(localStorage.getItem('id'), secretKey).toString(CryptoJS.enc.Utf8);
  //const acc_administrator = parseInt(CryptoJS.AES.decrypt(localStorage.getItem('type'), secretKey).toString(CryptoJS.enc.Utf8));
  //const { t } = useI18n()

  const readProfessional = async () => {
    try {
      const res = await axios({
        url: `/profesionals/1/${user}`,
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + authStore.token
        }
      });
       professional.value = res.data.data
     
    } catch (error) {
      handleError(error);
    }
  };
   

  readProfessional()

  return {
    readProfessional,
    professional
  };
});
