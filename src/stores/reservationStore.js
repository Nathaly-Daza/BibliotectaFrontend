import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from './authStore.js'
import {  handleError, handleResponse, showSwalAlert } from "../validations.js"
import CryptoJS from 'crypto-js';
import { useI18n } from 'vue-i18n'


export const useReservationStore = defineStore('reservation_name', () => {
  const authStore = useAuthStore()
  const reservation = ref([])
  const reservationUserActive = ref([])
  const reservationDate = ref([])
  const reservationReportDate = ref([])
  const reservationUsers = ref([])
  const { t } = useI18n()
  const secretKey = 'TuClaveSecreta';
  const user = CryptoJS.AES.decrypt(localStorage.getItem('id'), secretKey).toString(CryptoJS.enc.Utf8);
  const acc_administrator = parseInt(CryptoJS.AES.decrypt(localStorage.getItem('type'), secretKey).toString(CryptoJS.enc.Utf8));
  const proj_id = CryptoJS.AES.decrypt(localStorage.getItem('proj'), secretKey).toString(CryptoJS.enc.Utf8);

  //const isRecurring = ref(false); // Indica si es una reserva recurrente
  //const recurrenceType = ref(''); // Diario, semanal, mensual, etc.
  //const recurrenceEndDate = ref(''); // Fecha límite de la recurrencia


  const readReservation = async () => {
    try {
      const res = await axios({
        url: `/reservations/${proj_id}/${user}`,
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + authStore.token
        }
      })
      reservation.value = res.data.data.map((item) => {
        return {
          res_id: item.res_id,
          res_date: item.res_date,
          res_start: item.res_start,
          res_end: item.res_end,
          spa_name: item.spa_name,
          use_mail: item.use_mail, 
          res_status: item.res_status,
          use_id: item.use_id
        };
      })
      
     
    } catch (error) {
      handleError(error);
    }
  }
  const readReservationUser = async () => {
    try {
      const res = await axios({
        url: `/active/reserv/user/${user}/${proj_id}/${user}`,
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + authStore.token
        }
      });
      
      if (!user) {
        throw new Error('ID de usuario no encontrado en el localStorage');
      }

      reservationUserActive.value = res.data.data;
      

    } catch (error) {
      // console.log(error);
    }
   
  };
  const readDateReservation = async () => {
    try {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.token;
      const res = await axios({
        url: `/calendar/${proj_id}/${user}`,
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + authStore.token
          
        },
        data: {

        }
      });

      reservationDate.value = res.data.data;
    } catch (error) {
      // handleError(error);
    }
  };

  const readDateReportReservation = async (column, data) => {

    try {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.token;
      const res = await axios({
        url: `/historial/${proj_id}/${user}/${column}/${data}`,
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + authStore.token
        }
      });
      reservationReportDate.value = res.data.data;
      
      if (reservation.value.length === 0) {
        // Show an alert if the reservation array is empty
        showSwalAlert(null, 'No reservations available', 'warning');
      }
       return reservationReportDate.value 
    } catch (error) {
      handleError(error);
    }
  };

  const readReportDateReservation= async (DateStart, DateEnd) => {

    try {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.token;
      const res = await axios({
        url: `/historialDate/${proj_id}/${user}/${DateStart}/${DateEnd}`,
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + authStore.token
        }
      });
      reservationReportDate.value = res.data.data.map((item) => {
        return {
          'No. Reserva': item['No. Reserva'],
          'Fecha': item['Fecha'],
          'Hora inicio': item['Hora inicio'],
          'Hora fin': item['Hora fin'],
          'Espacio': item['Espacio'],
          'Correo': item['Correo'],
          'Estado': item['Estado'], 
         
        };
      })
       return reservationReportDate.value 
    } catch (error) {
      handleError(error);
    }
  };
  
  const readUsers = async () => {
    //console.log(acc_administrator)
    try {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.token;
      const res = await axios.get(`/users/${proj_id}/${user}`, {
        params: {
          acc_administrator: acc_administrator
        }
      })
      return reservationUsers.value = res.data
      

    } catch (error) {
      // console.log(error);
    }
  };

 /*  const registerReservation = async (res_date, res_start, res_end,  spa_id, use_id, acc_user) => {
    //console.log(res_typ_id)
    //console.log(spa_id)
    //console.log(use_id)
    //console.log(res_start)
    //console.log(res_end)
    //console.log(res_date)
    console.log(acc_user)
    try {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.token;
      const res = await axios({
        url: `/reservations/1/${user}`,
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + authStore.token
        },
        data: {
          res_date: res_date,
          res_start: res_start,
          res_end: res_end,
          spa_id: spa_id,
          use_id: use_id,
          acc_administrator: acc_user
        }
      });

      readReservation()
      handleResponse(
        res,
    ` ${t('messageSuccess.titleSuccess')} ${res_date}`,
        t('messageSuccess.Success'),
        t('errors.duplicateAlert'),
        t('errors.formatInvalid')
      )
      
      //reservation.value.push(res.data.data.newRegisterReservation)

    } catch (error) {

      handleError(error);
      // console.log(error.response?.data || error)
    }
  }; */
  
  const registerReservation = async (res_date, res_start, res_end, spa_id, use_id, acc_user, isRecurring = false, recurrenceType = '', recurrenceEndDate = '') => {
    try {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.token;
  
      if (isRecurring) {
        // Generar las fechas de las reservas según el tipo de recurrencia
        const recurrenceDates = generateRecurrenceDates(res_date, recurrenceType, recurrenceEndDate);
  
        // Crear todas las reservas recurrentes
        for (const date of recurrenceDates) {
          await axios({
            url: `/reservations/${proj_id}/${user}`,
            method: 'POST',
            headers: {
              Authorization: 'Bearer ' + authStore.token,
            },
            data: {
              res_date: date,
              res_start: res_start,
              res_end: res_end,
              spa_id: spa_id,
              use_id: use_id,
              acc_administrator: acc_user,
              isRecurring:isRecurring,
              recurrenceType:recurrenceType,
              recurrenceEndDate:recurrenceEndDate,
            },
          });
        }
  
        handleResponse(null, t('messageSuccess.RecurringSuccess'), t('messageSuccess.Success'), null, null);
      } else {
        // Crear una única reserva
        const res = await axios({
          url: `/reservations/1/${user}`,
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + authStore.token,
          },
          data: {
            res_date: res_date,
            res_start: res_start,
            res_end: res_end,
            spa_id: spa_id,
            use_id: use_id,
            acc_administrator: acc_user,
            isRecurring:isRecurring,
            recurrenceType:recurrenceType,
            recurrenceEndDate:recurrenceEndDate,
          },
        });
  
        handleResponse(res, t('messageSuccess.titleSuccess'), t('messageSuccess.Success'), null, null);
      }
  
      readReservation(); // Actualiza la lista de reservas
    } catch (error) {
      handleError(error);
    }
  };
  

  const generateRecurrenceDates = (startDate, recurrenceType, endDate) => {
    const dates = [];
    const currentDate = new Date(startDate);
    const end = new Date(endDate);
  
    while (currentDate <= end) {
      dates.push(new Date(currentDate).toISOString().split('T')[0]); // Agrega la fecha en formato 'YYYY-MM-DD'
  
      // Incrementar la fecha según el tipo de recurrencia
      switch (recurrenceType) {
     /*   case 'daily':
          currentDate.setDate(currentDate.getDate() + 1);
          break;*/
        case 'weekly':
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case 'monthly':
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
        default:
          throw new Error('Tipo de recurrencia no válido');
      }
    }
  
    return dates;
  };
  
  
 /*  const updateReservation = async (res_id, new_res_date, new_res_start, new_res_end, new_spa_id, new_use_id) => {

    try {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.token;
      const res = await axios({
        url: `/reservations/1/${user}/${res_id}`,
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + authStore.token
        },
        data: {
          res_date: new_res_date,
          res_start: new_res_start,
          res_end: new_res_end,
          spa_id: new_spa_id,
          use_id: new_use_id,
          acc_administrator: acc_administrator

        }
      });

      handleResponse(
        res,
        ` ${t('messageSuccess.titleSuccess')} ${new_res_date}`,
        t('messageSuccess.Update'),
        t('errors.duplicateAlert'),
        t('errors.pass')
      )
      return res.data.status
    } catch (error) {
      // console.error(error.response?.data || error);
      handleError(error);
    }
  }; */
  
  const updateReservation = async (res_id, new_res_date, new_res_start, new_res_end, new_spa_id, new_use_id, isRecurring = false, recurrenceType = '', recurrenceEndDate = '') => {
    try {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.token;
  
      if (isRecurring) {
        // Similar a registerReservation, actualiza todas las reservas recurrentes
        const recurrenceDates = generateRecurrenceDates(new_res_date, recurrenceType, recurrenceEndDate);
  
        for (const date of recurrenceDates) {
          await axios({
            url: `/reservations/${proj_id}/${user}/${res_id}`,
            method: 'PUT',
            headers: {
              Authorization: 'Bearer ' + authStore.token,
            },
            data: {
              res_date: date,
              res_start: new_res_start,
              res_end: new_res_end,
              spa_id: new_spa_id,
              use_id: new_use_id,
              isRecurring:isRecurring,
              recurrenceType:recurrenceType,
              recurrenceEndDate:recurrenceEndDate,
              acc_administrator: acc_administrator,
            },
          });
        }
  
        handleResponse(null, t('messageSuccess.RecurringUpdate'), t('messageSuccess.Success'), null, null);
      } else {
        // Actualiza una única reserva
        const res = await axios({
          url: `/reservations/${proj_id}/${user}/${res_id}`,
          method: 'PUT',
          headers: {
            Authorization: 'Bearer ' + authStore.token,
          },
          data: {
            res_date: new_res_date,
            res_start: new_res_start,
            res_end: new_res_end,
            spa_id: new_spa_id,
            use_id: new_use_id,
            isRecurring:isRecurring,
            recurrenceType:recurrenceType,
            recurrenceEndDate:recurrenceEndDate,
            acc_administrator: acc_administrator,
          },
        });
  
        handleResponse(res, t('messageSuccess.Update'), t('messageSuccess.Success'), null, null);
      }
    } catch (error) {
      handleError(error);
    }
  };
  
  
  
  const cancelReservation = async (res_id) => {

    //console.log(res_id)
    try {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.token;
      const res = await axios({
        url: `/reservations/${proj_id}/${user}/${res_id}`,
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
      console.error(error.response?.data || error);
      handleError(error);
    }
  };

  readReservation()

  return {
    readReservation,
    readDateReservation,
    readReservationUser,
    readDateReportReservation,
    readUsers,
    readReportDateReservation,
    registerReservation,
    updateReservation,
    cancelReservation,
    reservation,
    reservationUserActive,
    reservationDate,
    reservationUsers,
    reservationReportDate 
  }
})
