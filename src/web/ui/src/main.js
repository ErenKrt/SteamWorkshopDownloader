import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import API from './utils/API'
import io from 'socket.io-client'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';


import './assets/css/style.css';

var app= createApp(App);
app.config.globalProperties.$socket= io(API.socketURL)

app.use(router).use(VueSweetalert2).mount('#app')
