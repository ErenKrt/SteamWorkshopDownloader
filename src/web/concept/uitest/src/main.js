import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

createApp(App).use(store).mount('#app')
