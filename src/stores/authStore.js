import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import CryptoJS from 'crypto-js';
import { showSwalAlert, handleResponse } from "../validations.js"
import router from '../router/index'

import { useI18n } from 'vue-i18n'

export const useAuthStore = defineStore('user', () => {
  const token = ref()
  const use_id = ref()
  const acc_administrator = ref()
  const per_document = ref()
  const use_photo = ref()
  const authUser = ref(null);
  const project_id = ref(null);
  const { t } = useI18n()
  const API_URL = import.meta.env.VITE_GENERAL_URL

  const access = async (use_mail, use_password) => {
    try {
      const hashedPassword = CryptoJS.SHA256(use_password).toString();

      const res = await axios.post('/login', {
        use_mail: use_mail,
        use_password: hashedPassword

      })
      const secretKey = 'TuClaveSecreta';

      token.value = res.data.data.token
      use_id.value = res.data.data.use_id
      acc_administrator.value = res.data.data.acc_administrator
      per_document.value = res.data.data.per_document
      use_photo.value = res.data.data.use_photo
      authUser.value = res.data.data;
      project_id.value = res.data.data.proj_id;

     

      // if (acc_administrator.value === 0) {
      //   logout(res.data.data.use_id)
      //   showSwalAlert(null, t('errors.accessDenied'), 'error');
      //   return;
      // }

      // localStorage.setItem('Accept', token.value);
      // localStorage.setItem('img', use_photo.value);

      // try {

      //   const hashedDoct = CryptoJS.SHA256(per_document.value).toString();
      //   const encryptedId = CryptoJS.AES.encrypt(String(use_id.value), secretKey).toString();
      //   const encryptedType = CryptoJS.AES.encrypt(String(acc_administrator.value), secretKey).toString();
      //   localStorage.setItem('doct', hashedDoct);
      //   localStorage.setItem('id', encryptedId);
      //   localStorage.setItem('pass', hashedPassword);
      //   localStorage.setItem('type', encryptedType);
      //   //console.log(hashedPassword)
      // } catch (error) {
      //   // console.error('Error al cifrar y almacenar datos en localStorage:', error);
      //   }
        
    } catch (error) {
      // console.log(error.response.data.message)
    
      if (error.response) {
        let messageToShow = error.response.data.message

        if (messageToShow.includes('Invalid email or password')) {
          showSwalAlert(null, t('errors.login'), 'error');
        }
        if (messageToShow.includes('This user already has an active session')) {
          showSwalAlert(null, t('errors.accesActive'), 'error');

        }
        if (messageToShow.includes('has no access.')) {
          showSwalAlert(null, use_mail + t('errors.accessDenied2'), 'error');
        }
        if (error.response.data.message.includes('The user who is trying to login does not exist')) {
          showSwalAlert(null,  t('errors.login'), 'error');
          return ''
        }
        // console.error('Error de solicitud:', error.response.data);
      } else {
        // Otros tipos de errores
        showSwalAlert({
          icon: 'error',
          title: 'Error',
          text: t('errors.error')
        });
        //console.error('Error inesperado:', error.message);
      }
    }
  }

  const logout = async (use_id) => {
    try {
      const res = await axios({
        url: '/logout',
        method: 'POST',
        data: {
          use_id: use_id,
        },

      })
      res.data
      //console.log(res.data)
    } catch (error) {
      // console.log(error)
    } finally {
      resetStore();
    }
  }

  const resetStore = () => {
    token.value = null
    use_photo.value = null
    authUser.value = null
    localStorage.removeItem('Accept');
    localStorage.removeItem('img');
    localStorage.removeItem('id');
    localStorage.removeItem('type');
    localStorage.removeItem('pass');
    localStorage.removeItem('doct');

  }


  const mail = async (email) => {
    try {
      const res = await axios({
        url: `${API_URL}/send/email`,
        method: 'POST',
        data: {
          use_mail: email,
        }
      });
      //console.log(res.data)
      //console.log(email)
      router.push('/resetPassword')
      handleResponse(
        res,
        email,
        t('messageSuccess.mailSuccess'),
        t('errors.duplicateAlert'),
        t('errors.errorMail')
      )
    } catch (error) {

      if (error.request) {
        let messageToShow = error.response.data.message

        if (messageToShow.includes('Attempt to read property "use_id"')) {
          showSwalAlert(null, t('errors.userMail'), 'error');

        }
        //console.error('Error de solicitud:', error.response.data);
      } else {
        // Otros tipos de errores
        showSwalAlert({
          icon: 'error',
          title: 'Error',
          text: t('errors.error')
        });
        //console.error('Error inesperado:', error.message);
      }
    }
  };

  const reset = async (newPassword, confirmPassword, code) => {
    try {
      const res = await axios({
        url: `${API_URL}/reset/password`,
        method: 'POST',
        data: {
          new_password: newPassword,
          password_confirmation: confirmPassword,
          res_pas_code: code
        }
      });
      router.push('/')

      handleResponse(
        res,
        null,
        t('messageSuccess.changePasswordSuccess'),
        t('errors.duplicateAlert'),
        t('errors.changePassword')
      )
    } catch (error) {
      //handleErrorLog(error);

      if (error.request) {
        let messageToShow = error.response.data.message

        if (messageToShow.includes('Code does not match')) {
          showSwalAlert(null, t('errors.resetCode'), 'error');

        } if (messageToShow.includes('Invalid password confirmation')) {
          showSwalAlert(null, t('errors.pass'), 'error');

        }
        //console.error('Error de solicitud:', error.response.data);
      } else {
        // Otros tipos de errores
        showSwalAlert({
          icon: 'error',
          title: 'Error',
          text: t('errors.error')
        });
        //console.error('Error inesperado:', error.message);
      }
    }
  };

  return {
    token,
    use_photo,
    project_id,
    access,
    logout,
    mail,
    reset
  }

})
