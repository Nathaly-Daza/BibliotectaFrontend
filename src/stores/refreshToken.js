import { defineStore } from 'pinia'
import axios from 'axios'
import { ref, onMounted } from 'vue'
import CryptoJS from 'crypto-js'

export const useRefreshTokenStore = defineStore('refreshToken', () => {
  const secretKey = 'TuClaveSecreta' // Clave secreta para encriptar/desencriptar
  const token = ref(localStorage.getItem('Accept')) // Obtener el token del local storage
  const tokenExpiration = parseInt(
    CryptoJS.AES.decrypt(localStorage.getItem('TokenExpiration'), secretKey).toString(
      CryptoJS.enc.Utf8
    )
  )
  // Obtener la expiración del token del local storage
  let refreshTimer = null // Variable para almacenar el temporizador

  const startTokenRefreshTimer = () => {
    // Cancelar cualquier temporizador previo
    if (refreshTimer) {
      clearTimeout(refreshTimer)
    }

    const now = new Date()
    if (tokenExpiration.value) {
      const expirationTime = new Date(tokenExpiration.value).getTime()
      const timeLeft = expirationTime - now.getTime()

      if (timeLeft > 0) {
        // Configurar el temporizador para ejecutar `refreshToken` un minuto antes de que expire
        const timeBeforeRefresh = Math.max(timeLeft - 60 * 1000, 0) // Evitar valores negativos
        refreshTimer = setTimeout(() => refreshToken(), timeBeforeRefresh)
      }
    }
  }

  const refreshToken = async () => {
    const now = new Date()

    if (tokenExpiration.value && new Date(tokenExpiration.value) > now) {
      // El token aún es válido, no es necesario refrescar
      startTokenRefreshTimer() // Reprogramar el temporizador
      return
    }

    try {
      // Solicitar un nuevo token al servidor
      const res = await axios({
        url: '/refresh-token',
        method: 'POST',
        data: {
          refreshToken: localStorage.getItem('Accept') // Asegúrate de tener almacenado el `refreshToken`
        }
      })

      console.log('Token refrescado:', res)
      token.value = res.data.data.token // Asignar el nuevo token
      tokenExpiration.value = new Date(now.getTime() + res.data.data.expiresIn * 1000) // Calcular nueva expiración

      localStorage.setItem('Accept', token.value) // Guardar el nuevo token
      localStorage.setItem('TokenExpiration', tokenExpiration.value.toISOString()) // Guardar nueva expiración

      startTokenRefreshTimer() // Reprogramar el temporizador
    } catch (error) {
      console.error('Error al refrescar el token:', error)
      clearTimeout(refreshTimer) // Limpiar el temporizador en caso de error
    }
  }

  // Iniciar el temporizador al montar la store
  onMounted(async () => {
    await startTokenRefreshTimer()
  })

  return {
    token,
    refreshToken
  }
})
