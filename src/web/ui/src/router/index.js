import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SchemesView from '../views/SchemesView.vue'
import TestView from '../views/TestView'

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
  },
  {
    path: '/test',
    name: 'test',
    component: TestView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
