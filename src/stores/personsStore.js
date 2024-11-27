import axios from 'axios'
import CryptoJS from 'crypto-js'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './authStore.js'
import { handleResponse, handleError,showSwalAlert } from "../validations.js"
import { useI18n } from 'vue-i18n'



export const usePersonsStore = defineStore('persons', () => {
  const secretKey = 'TuClaveSecreta'
  const authStore = useAuthStore()
  
  
  //parseInt(user);
  const API_URL = import.meta.env.VITE_GENERAL_URL
  const persons = ref([])
  const { t } = useI18n()
 const readUserLocal = ()=>{
  const user = CryptoJS.AES.decrypt(localStorage.getItem('id'), secretKey).toString( CryptoJS.enc.Utf8 )
  return user

 }
 readUserLocal();
 const readPersonDetailsById = async () => {
  try {
    const res = await axios({
      url: `${API_URL}/profile/1/${readUserLocal()}`,
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + authStore.token
      }
    })
   
    persons.value = res.data.data
    
    } catch (error) {
      handleError(error)
    }
  }
  const updatePassword = async (currentPassword, newPassword, confirmPassword) => {
    try {
      const res = await axios({
        url: `${API_URL}/update/password/1/${readUserLocal()}`,
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + authStore.token
        },
        data: {
          use_password: currentPassword,
          new_password: newPassword,
          password_confirmation: confirmPassword
        }
      })
      handleResponse(
        res,
        null,
        t('messageSuccess.Update'),
        t('errors.duplicateAlert'),
        t('errors.passActual'),
        t('errors.passIqual'),
        
      )
      // console.log(res.data.status);
      return res.data.status
      
    
    } catch (error) {
      // console.log(error.response.data.message)
      
      if (error.request) {
        let messageToShow  = error.response.data.message
        
        if (messageToShow.includes('Password does not match')) {
          showSwalAlert(null, "la contraseña no coincide", 'error');
          
        } 
        // console.error('Error de solicitud:', error.response.data);
      } else {
        // Otros tipos de errores
        showSwalAlert({
          icon: 'error',
          title: 'Error',
          text: 'Error: Se produjo un error inesperado'
        });
        // console.error('Error inesperado:', error.message);
      }
    }
  }
  
  const updatePhoto= async (newPhoto) => {
    try {
      const res = await axios.post(`${API_URL}/update/photo/${readUserLocal()}`, newPhoto, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + authStore.token // Asegúrate de tener un mecanismo seguro para obtener y pasar el token de autenticación
        }
      });
    
      handleResponse(
        res,
        null,
        t('messageSuccess.Update'),
        t('errors.duplicateAlert'),
        t('errors.passActual')
      )
      
    
    } catch (error) {
      // console.log(error.response.data.message)
      
      if (error.request) {
        let messageToShow  = error.response.data.message
        
        if (messageToShow.includes('Password does not match')) {
          showSwalAlert(null, "la contraseña no coincide", 'error');
          
        } 
        // console.error('Error de solicitud:', error.response.data);
      } else {
        // Otros tipos de errores
        showSwalAlert({
          icon: 'error',
          title: 'Error',
          text: 'Error: Se produjo un error inesperado'
        });
        // console.error('Error inesperado:', error.message);
      }
    }
  }


  return {
    readPersonDetailsById,
    updatePassword,
    updatePhoto,
    usePersonsStore,
    persons
  }
})
