
import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './authStore.js';
import { handleError, handleResponse, showSwalAlert} from "../validations.js";
import CryptoJS from 'crypto-js';
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'



export const useServiceTypeStore = defineStore('serviceTypeStore', () => {
  const authStore = useAuthStore();
  const serviceType = ref([]);

  
  const secretKey = 'TuClaveSecreta';
  const user = CryptoJS.AES.decrypt(localStorage.getItem('id'), secretKey).toString(CryptoJS.enc.Utf8);
  const acc_administrator = parseInt(CryptoJS.AES.decrypt(localStorage.getItem('type'), secretKey).toString(CryptoJS.enc.Utf8));
  const { t } = useI18n()

  const readServiceType = async () => {
    try {
      const res = await axios({
        url: `/service/types/1/${user}`,
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + authStore.token
        }
      });

      serviceType.value = res.data.data.map((item) => {
        return {
        ser_typ_id : item.ser_typ_id,
          ser_typ_name : item.ser_typ_name,
          ser_typ_status : item.ser_typ_status
        };
    });
   
     
    } catch (error) {
      handleError(error);
    }
  };
  const registerServiceType = async (ser_typ_name) => {
    try {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.token
      const res = await axios({
        url: `/service/types/1/${user}`,
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + authStore.token
        },
        data: {
          ser_typ_name: ser_typ_name,
          acc_administrator: acc_administrator
        }
      })
  
      handleResponse(
        res,
        ser_typ_name,
        t('messageSuccess.Success'),
        t('errors.duplicateAlert'),
        t('errors.formatInvalid')
      )
      

    } catch (error) {
      //handleError(error)
  
      handleResponse(
        { data: { status: false, message: error.response.data.message } },
        ser_typ_name,
        t('messageSuccess.Success'),
        t('errors.duplicateAlert'),
        t('errors.formatInvalid')
      )
      // console.log(error.response.data.message)
    }
  }
  const updateServiceType = async (ser_typ_id, new_ser_typ_name) => {
    try {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.token;
      const res = await axios({
        url: `/service/types/1/${user}/${ser_typ_id}`,
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + authStore.token
        },
        data: {
          ser_typ_name: new_ser_typ_name,
          acc_administrator: acc_administrator

        }
      });

      handleResponse(
        res,
        new_ser_typ_name,
        t('messageSuccess.Update'),
        t('errors.duplicateAlert'),
        t('errors.formatInvalid')
      )
      return res.data.status
    } catch (error) {
     // console.error(error.response?.data || error);
      handleResponse(
        { data: { status: false, message: error.response.data.message } },
        new_ser_typ_name,
        t('messageSuccess.Update'),
        t('errors.duplicateAlert'),
        t('errors.formatInvalid')
      )
    }
  };
  const updateStatus = async (id) => {
    //console.log(id)
    try {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.token;
      const res = await axios({
        url: `/service/types/1/${user}/${id}`,
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

  readServiceType()

  return {
    readServiceType,
    registerServiceType,
    updateServiceType,
    updateStatus,
    serviceType
  };
});