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

  const readReservation = async () => {
    try {
      const res = await axios({
        url: `/reservations/1/${user}`,
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
        url: `/active/reserv/user/${user}/1/${user}`,
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
        url: `/calendar/1/${user}`,
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
        url: `/historial/1/${user}/${column}/${data}`,
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
        url: `/historialDate/1/${user}/${DateStart}/${DateEnd}`,
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
      const res = await axios.get(`/users/1/${user}`, {
        params: {
          acc_administrator: acc_administrator
        }
      })
      return reservationUsers.value = res.data
      

    } catch (error) {
      // console.log(error);
    }
  };

  const registerReservation = async (res_date, res_start, res_end,  spa_id, use_id, acc_user) => {
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
  };
  const updateReservation = async (res_id, new_res_date, new_res_start, new_res_end, new_spa_id, new_use_id) => {

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
  };
  const cancelReservation = async (res_id) => {

    //console.log(res_id)
    try {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.token;
      const res = await axios({
        url: `/reservations/1/${user}/${res_id}`,
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
