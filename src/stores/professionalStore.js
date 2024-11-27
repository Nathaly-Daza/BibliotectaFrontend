import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './authStore.js';
import { handleError,showSwalAlert ,handleResponse } from "../validations.js";
import CryptoJS from 'crypto-js';
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

export const useProfessionalStore = defineStore('professionalStore', () => {
  const authStore = useAuthStore();
  const professional = ref([]);

  
  const secretKey = 'TuClaveSecreta';
  const user = CryptoJS.AES.decrypt(localStorage.getItem('id'), secretKey).toString(CryptoJS.enc.Utf8);
  const acc_administrator = parseInt(CryptoJS.AES.decrypt(localStorage.getItem('type'), secretKey).toString(CryptoJS.enc.Utf8));
  const { t } = useI18n()

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
   
  const updateStatus = async (id) => {
    //console.log(id)
    try {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.token;
      const res = await axios({
        url: `/profesionals/1/${user}/${id}`,
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + authStore.token
        },
        data: {
          acc_administrator: acc_administrator
        }
      });
      //console.log(acc_administrator)

      if (res.data.status === false) {
        showSwalAlert(res.data.message, 'error')
      }
      if (res.data.status === true) {
        showSwalAlert(res.data.message, 'success')
      }
    } catch (error) {
      // console.error(error.response?.data || error);
      handleError(error);
    }
  };

  const updateProfessional = async (prof_id, new_prof_name) => {
    try {

      axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.token;
      const res = await axios({
        url: `/profesionals/1/${user}/${prof_id}`,
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + authStore.token
        },
        data: {
          prof_name: new_prof_name,
          acc_administrator: acc_administrator

        }

      });

        handleResponse(
          res,
          new_prof_name,
          t('messageSuccess.Update'),
        t('errors.duplicateAlert'),
        t('errors.formatInvalid')
        )
        return res.data.status
      
    } catch (error) {
      console.error(error.response?.data || error);
      // console.log(error.response.data.message)
      handleResponse(
        { data: { status: false, message: error.response.data.message } },
        new_prof_name,
        t('messageSuccess.Update'),
        t('errors.duplicateAlert'),
        t('errors.formatInvalid')
      )
      // console.log(error.message)
    }
  };
  
  const registerProfessional= async (prof_name) => {
    try {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.token
      const res = await axios({
        url: `/profesionals/1/${user}`,
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + authStore.token
        },
        data: {
            prof_name: prof_name,
          acc_administrator: acc_administrator
        }
      })
      readProfessional()
      handleResponse(
        res,
        prof_name,
        t('messageSuccess.Success'),
        t('errors.duplicateAlert'),
        t('errors.formatInvalid')
      )
   

    } catch (error) {
      handleResponse(
        { data: { status: false,message: error.response.data.message } },
        prof_name,
        t('messageSuccess.Success'),
        t('errors.duplicateAlert'),
        t('errors.formatInvalid')
      )
    }
  }

  readProfessional()

  return {
    readProfessional,
    updateStatus,
    updateProfessional,
    registerProfessional,
    professional
  };
});
