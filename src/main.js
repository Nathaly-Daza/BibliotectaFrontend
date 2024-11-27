import './assets/main.css'
import pdfMake from "pdfmake/build/pdfmake";
import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import axios from 'axios'
import VueAxios from 'vue-axios'
 import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
 import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.vue'
import router from './router'
import { i18n } from './i18n/index.js'
 
(pdfMake).fonts = {
    Roboto: {
      normal:
        "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf",
      bold: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf",
      italics:
        "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf",
      bolditalics:
        "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf",
    },
  };
 
const app = createApp(App)
 
window.axios = axios;
window.axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
window.axios.defaults.headers.common['Accept'] ='application/json'
window.axios.defaults.headers.common['Content-Type']='application/json'
window.axios.defaults.headers.common['X-Requested-with'] = 'XMLHttpRequest'
window.axios.defaults.withCredentials = true
 
 
const pinia = createPinia()
pinia.use(({store}) =>{
store.router = markRaw(router)
});
pinia.use(createPersistedState)
 
app.use(pinia)
app.use(router)
app.use(VueAxios, axios)
// app.use(BootstrapVue)
// app.use(IconsPlugin)
app.use(i18n)
 
app.mount('#app')
 
 
 
import "bootstrap/dist/js/bootstrap.js";