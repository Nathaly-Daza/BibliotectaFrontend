import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './authStore.js';
import { handleError, handleResponse } from "../validations.js";
import CryptoJS from 'crypto-js';
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'



export const useServiceStore = defineStore('serviceStore', () => {
  const authStore = useAuthStore();
  const service = ref([]);
  const serviceA = ref([]);
  const serviceReport = ref([]);

  
  const secretKey = 'TuClaveSecreta';
  const user = CryptoJS.AES.decrypt(localStorage.getItem('id'), secretKey).toString(CryptoJS.enc.Utf8);
  const acc_administrator = parseInt(CryptoJS.AES.decrypt(localStorage.getItem('type'), secretKey).toString(CryptoJS.enc.Utf8));
  const { t } = useI18n()

  const readService = async () => {
    try {
      const res = await axios({
        url: `/services/1/${user}`,
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + authStore.token
        }
      });
      service.value = res.data.data.map((item) => {
        return {
          ser_id: item.ser_id,
          ser_name: item.ser_name,
          ser_date: item.ser_date,
          ser_start: item.ser_start,
          ser_end: item.ser_end,
          ser_quotas: item.ser_quotas,
          ser_register: item['No. inscripciones'],
          ser_typ_name: item.ser_typ_name,
          per_name: item.per_name,
          per_lastname: item.per_lastname,
          ser_status: item.ser_status,
          
        };
      })
      //console.log(service.value)
    } catch (error) {
      handleError(error);
    }
  };

  const readActiveService = async () => {
    try {
      const res = await axios({
        url: `/calendarService/1/${user}`,
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + authStore.token
        }
      });
      serviceA.value = res.data.data;
      //console.log(serviceA.value);
    } catch (error) {
      handleError(error);
    }
  };
  const readReportService = async (column, data) => {

    try {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.token;
      const res = await axios({
        url: `/historialService/1/${user}/${column}/${data}`,
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + authStore.token
        }
      });
      serviceReport.value = res.data.data.map((item) => {
        return {
          'No. Servicio': item['No. Servicio'],
          'Nombre sel servicio': item['Nombre del servicio'],
          'Fecha': item['Fecha'],
          'Hora inicio': item['Hora inicio'],
          'Hora fin': item['Hora fin'],
          'Cupos': item['Cupos'],
          'Tipo Servicio': item['Tipo Servicio'],
          'Profesional': item['Profesional'],
          'Estado': item['Estado'], 
         
        };
      })
      //console.log(res.data)
       return serviceReport.value 
    } catch (error) {
      handleError(error);
    }
  };
  const readReportDateService= async (DateStart, DateEnd) => {

    try {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.token;
      const res = await axios({
        url: `/historialServiceDates/1/${user}/${DateStart}/${DateEnd}`,
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + authStore.token
        }
      });
      serviceReport.value = res.data.data.map((item) => {
        return {
          'No. Servicio': item['No. Servicio'],
          'Nombre sel servicio': item['Nombre del servicio'],
          'Fecha': item['Fecha'],
          'Hora inicio': item['Hora inicio'],
          'Hora fin': item['Hora fin'],
          'Cupos': item['Cupos'],
          'Tipo Servicio': item['Tipo Servicio'],
          'Profesional': item['Profesional'],
          'Estado': item['Estado'], 
         
        };
      })
       return serviceReport.value 
    } catch (error) {
      handleError(error);
    }
  };
  
  const registerReservation = async (ser_date, ser_start, ser_end,  prof_id,ser_typ_id, ser_name, ser_quotas) => {
    
    try {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.token;
      const res = await axios({
        url: `/services/1/${user}`,
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + authStore.token
        },
        data: {
          ser_date: ser_date,
          ser_start: ser_start,
          ser_end: ser_end,
          use_id: prof_id,
          ser_typ_id: ser_typ_id,
          ser_name: ser_name,
          ser_quotas: ser_quotas,
          acc_administrator: acc_administrator
        }
      });

      readService()
      handleResponse(
        res,
        `${t('messageSuccess.titleSuccess')} ${ser_date}`,
        t('messageSuccess.Success'),
        t('errors.duplicateAlert'),
        t('errors.formatInvalid')
      )
      
      //reservation.value.push(res.data.data.newRegisterReservation)

    } catch (error) {

      handleError(error);
      // console.log(error.response?.data || error)
    }
  };
  const updateService= async (ser_id, new_ser_date, new_ser_start, new_ser_end,new_prof_id, new_ser_typ_id, new_ser_name, new_ser_quotas) => {
  //  console.log(ser_id, new_ser_date, new_ser_start, new_ser_end,new_prof_id, new_ser_typ_id, new_use_id, new_ser_name, new_ser_quotas)
    try {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.token;
      const res = await axios({
        url: `/services/1/${user}/${ser_id}`,
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + authStore.token
        },
        data: {
          ser_name: new_ser_name,
          ser_date: new_ser_date,
          ser_start: new_ser_start,
          ser_end: new_ser_end,
          use_id: new_prof_id,
          ser_quotas: new_ser_quotas,
          ser_typ_id: new_ser_typ_id,
          
          acc_administrator: acc_administrator

        }
      });

      handleResponse(
        res,
        `${t('messageSuccess.titleSuccess')} ${new_ser_date}`,
        t('messageSuccess.Update'),
        t('errors.duplicateAlert'),
        t('errors.pass')
      )
      return res.data.status
    } catch (error) {
      // console.error(error.response?.data || error);
      handleError(error);
    }
  };
  

  const cancelService = async (ser_id) => {

    try {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.token;
      const res = await axios({
        url: `/services/1/${user}/${ser_id}`,
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + authStore.token
        },
        data: {
          acc_administrator: acc_administrator
        }
      });

      handleResponse(
        res,
        null,
        t('messageSuccess.Success'),
        t('errors.duplicateAlert'),
        t('errors.pass')
      )
    } catch (error) {
      // console.error(error.response?.data || error);
      handleError(error);
    }
  };

  return {
    readService,
    readActiveService,
    readReportService,
    readReportDateService,
    registerReservation,
    updateService,
    cancelService,
    service,
    serviceA
    
  };
});
