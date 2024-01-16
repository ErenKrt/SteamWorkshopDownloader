import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SchemesView from '../views/SchemesView.vue'


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/schemes',
    name: 'schemes',
    component: SchemesView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
