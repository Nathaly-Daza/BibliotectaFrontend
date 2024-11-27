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
        },
        {
          path: '/professional',
          name: 'byprofessonal',
          component: () => import('../views/ProfessionalView.vue'),
          meta: {
            auth: true
          },
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
  if (localStorageToken) {
    UserStore.token = localStorageToken;
  }

  // Si el token está presente en el almacén de estado, permitir el acceso
  if (UserStore.token) {
    if (UserStore.token && to.name === 'login') {
      return next("/reservations"); // Cambiar "/projects" por la ruta a la que quieres redirigir al usuario autenticado
    }
    const secretKey = 'TuClaveSecreta';
    const acc_administrator = CryptoJS.AES.decrypt(localStorage.getItem('type'), secretKey).toString(CryptoJS.enc.Utf8);

    // Verificar si el usuario es acc_administrator === '0'
    if (acc_administrator === '0') {
      UserStore.logout(localStorageUser)
    } else if (acc_administrator === '1') {
      // Si el usuario es acc_administrator === '1', tiene acceso a todas las rutas protegidas
      return next();
    }
    if (localStoragePassword === localStorageDocument) {
      if (to.path !== '/firstPassword') {
        return next("/firstPassword");
      } else {
        return next();
      }
    } else {
      return next();
    }

  }


  // Si la ruta requiere autenticación, redirigir al inicio de sesión
  if (requiredAuth) {
    return next("/");
  }

  // Permitir el acceso a rutas públicas
  return next();
});

export default router
