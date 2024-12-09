import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from './authStore.js'
import { showSwalAlert, handleError, handleResponse } from "../validations.js"
import CryptoJS from 'crypto-js';
import { useI18n } from 'vue-i18n'

export const useSpaceStore = defineStore('space_name', () => {
  
  const authStore = useAuthStore()
  const spaces = ref([])
  const secretKey = 'TuClaveSecreta';
  const user = CryptoJS.AES.decrypt(localStorage.getItem('id'), secretKey).toString(CryptoJS.enc.Utf8);
  const acc_administrator = CryptoJS.AES.decrypt(localStorage.getItem('type'), secretKey).toString(CryptoJS.enc.Utf8);
  const proj_id = CryptoJS.AES.decrypt(localStorage.getItem('proj'), secretKey).toString(CryptoJS.enc.Utf8);
  const { t } = useI18n()
  // esta funcion se utiliza para obtener datos de las spaces

  const readSpace = async () => {
    try {
      const res = await axios({
        url: `/spaces/${proj_id}/${user}`,
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + authStore.token
        }
      })
      // spaces.value = res.data.data
      spaces.value = res.data.data.map((item) => {
        return {
          spa_id: item.spa_id,
          spa_name: item.spa_name,
          spa_status: item.spa_status
        };
      });

      //console.log(spaces.value)
    } catch (error) {
      handleError(error)
    }
  }

  const registerSpace = async (spa_name) => {
    try {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.token
      const res = await axios({
        url: `/spaces/${proj_id}/${user}`,
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + authStore.token
        },
        data: {
          spa_name: spa_name,
          acc_administrator: acc_administrator
        }
      })
      readSpace()
      handleResponse(
        res,
        spa_name,
        t('messageSuccess.Success'),
        t('errors.duplicateAlert'),
        t('errors.formatInvalid')
      )
     

    } catch (error) {
      handleResponse(
        { data: { status: false,message: error.response.data.message } },
        spa_name,
        t('messageSuccess.Success'),
        t('errors.duplicateAlert'),
        t('errors.formatInvalid')
      )
    }
  }
  const updateSpace = async (spa_id, new_spa_name) => {
    try {

      axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.token;
      const res = await axios({
        url: `/spaces/${proj_id}/${user}/${spa_id}`,
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + authStore.token
        },
        data: {
          spa_name: new_spa_name,
          acc_administrator: acc_administrator

        }
      });

     
        handleResponse(
          res,
          new_spa_name,
          t('messageSuccess.Update'),
        t('errors.duplicateAlert'),
        t('errors.formatInvalid')
        )
        return res.data.status
      
    } catch (error) {
      // console.error(error.response?.data || error);
      // console.log(error.response.data.message)
      handleResponse(
        { data: { status: false, message: error.response.data.message } },
        new_spa_name,
        t('messageSuccess.Update'),
        t('errors.duplicateAlert'),
        t('errors.formatInvalid')
      )
      // console.log(error.message)
    }
  };
  const updateStatus = async (id) => {
    //console.log(id)
    try {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.token;
      const res = await axios({
        url: `/spaces/${proj_id}/${user}/${id}`,
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

  readSpace()
  return {
    readSpace,
    registerSpace,
    updateSpace,
    updateStatus,
    useSpaceStore,
    spaces
  }
})
