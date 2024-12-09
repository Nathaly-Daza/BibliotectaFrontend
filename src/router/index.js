import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore';
import CryptoJS from 'crypto-js';


const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../components/layout/DefaultLayout.vue'),
      children: [
       
        {
          path: '/',
          name: 'login',
          component: () => import('../views/LoginView.vue')
        },
        {
          path: '/resetPassword',
          name: 'resetPassword',
          component: () => import('../views/ResetPasswordView.vue')
        },
        {
          path: '/emailPassword',
          name: 'emailPassword',
          component: () => import('../views/EmailPasswordView.vue')
        },
        {
          path: '/firstPassword',
          name: 'FirstPassword',
          component: () => import('../views/FirstPasswordView.vue'),
          meta: {
            auth: true
          },
        }
        

      ]
    },
    

    {
      path: '/protected',
      name:'protected',
      component: () => import('../components/layout/ProtectedAdminLayout.vue'),
      meta: {
        auth: true
      },
      children: [
        {
          path: '/profile',
          name: 'byprofile',
          component: () => import('../views/UserProfileView.vue'),
          meta: {
            auth: true
          }
    },
       
        
        {
          path: '/spaces',
          name: 'byspaces',
          component: () => import('../views/SpacesView.vue'),
          meta: {
            auth: true
          }
        },
        {
          path: '/reservations',
          name: 'bygreservations',
          component: () => import('../views/ReservationView.vue'),
          meta: {
            auth: true
          }
        },
       
        {
          path: '/services',
          name: 'byservices',
          component: () => import('../views/ServicesView.vue'),
          meta: {
            auth: true
          },
        },
        {
          path: '/servicesTypes',
          name: 'byservicesTypes',
          component: () => import('../views/ServiceTypesView.vue'),
          meta: {
            auth: true
          },
        }

      ]

    },

    {
      path: '/salones',
      name:'salones',
      component: () => import('../components/layout/ProtectedAdminSalonesLayout.vue'),
      meta: {
        auth: true
      },
      children: [
        {
          path: 'profile',
          name: 'byprofileSalones',
          component: () => import('../views/UserProfileView.vue'),
          meta: {
            auth: true
          }
    },
       
       
        {
          path: 'spaces',
          name: 'byspacesSalones',
          component: () => import('../views/SpacesView.vue'),
          meta: {
            auth: true
          }
        },
        {
          path: 'reservations',
          name: 'bygreservationsSalones',
          component: () => import('../views/ReservationView.vue'),
          meta: {
            auth: true
          }
        }

      ]

    },
    {
      path: '/:pathMatch(.*)*',
      name: 'Notfound',
      component: () => import('../views/NotFound.vue'),
    },
   

  ]
})


router.beforeEach(async (to, from, next) => {
  const requiredAuth = to.meta.auth;
  const UserStore = useAuthStore();

  const localStoragePassword = localStorage.getItem('pass');
  const localStorageDocument = localStorage.getItem('doct');
  const localStorageToken = localStorage.getItem("Accept");
  const localStorageUser = localStorage.getItem("id");
  const localStorageProj = localStorage.getItem("proj");
  const secretKey = 'TuClaveSecreta';

  if (localStorageToken) {
    UserStore.token = localStorageToken;
  }

  if (UserStore.token) {
    if (to.name === 'login') {
      return next("/reservations"); // Redirigir al usuario autenticado
    }

    // Verificar y desencriptar datos de localStorage
    let acc_administrator = null;
    if (localStorage.getItem('type')) {
      try {
        acc_administrator = CryptoJS.AES.decrypt(localStorage.getItem('type'), secretKey).toString(CryptoJS.enc.Utf8);
      } catch (error) {
        console.error("Error desencriptando 'type':", error);
      }
    }

    if (acc_administrator === '0') {
      UserStore.logout(localStorageUser);
    } else if (acc_administrator === '1') {
      let decryptedValue = null;
      if (localStorageProj) {
        try {
          const decryptedBytes = CryptoJS.AES.decrypt(localStorageProj, secretKey);
          decryptedValue = decryptedBytes.toString(CryptoJS.enc.Utf8);
        } catch (error) {
          console.error("Error desencriptando 'proj':", error);
        }
      }

      // Validar acceso para usuarios con proj_id
      if (decryptedValue) {
        if (decryptedValue.includes(7)) {
          // Usuario con `proj_id = 7` puede acceder a rutas que comiencen con `/salones`
          if (!to.path.startsWith('/salones')) {
            console.log(`Ruta ${to.path} bloqueada para proj_id = 7`);
            return next("/salones/reservations"); // Redirigir al layout salones
          }
          console.log(`Acceso permitido a ${to.path} para proj_id = 7`);
          return next();
        } else if (decryptedValue.includes(1)) {

          if (to.path.startsWith('/salones')) {
            console.log(`Ruta ${to.path} bloqueada para proj_id =1`);
            return next("/reservations"); // Redirigir al layout salones
          }
          
          return next();
        }
      }
      return next();
    }

    // Verificar si el usuario debe cambiar su contraseña
    if (localStoragePassword === localStorageDocument) {
      if (to.path !== '/firstPassword') {
        return next("/firstPassword");
      } else {
        return next();
      }
    }

    return next();
  }

  if (requiredAuth) {
    return next("/");
  }

  return next();
});





export default router
