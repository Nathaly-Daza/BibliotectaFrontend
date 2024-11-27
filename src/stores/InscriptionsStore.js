import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './authStore.js';

import CryptoJS from 'crypto-js';
import { ref } from 'vue'
// import { useI18n } from 'vue-i18n'



export const useInscriptionStore = defineStore('inscriptionStore', () => {
  const authStore = useAuthStore();
  const inscription = ref([]);


  
  const secretKey = 'TuClaveSecreta';
  const user = CryptoJS.AES.decrypt(localStorage.getItem('id'), secretKey).toString(CryptoJS.enc.Utf8);
  // const acc_administrator = parseInt(CryptoJS.AES.decrypt(localStorage.getItem('type'), secretKey).toString(CryptoJS.enc.Utf8));
  // const { t } = useI18n()

  const readInscription = async (service) => {
    try {
      const res = await axios({
        url: `inscriptions/users/1/${user}/${service}`,
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + authStore.token
        }
      });
      inscription.value = res.data
      return inscription.value
    
    } catch (error) {
      // console.erorr(error);
    }
  };

 
  return {
    readInscription,
    inscription,
    useInscriptionStore
  
    
  };
});
