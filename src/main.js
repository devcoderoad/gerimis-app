import Vue from 'vue'
import Router from 'vue-router'

import store from './store'

import App from './App.vue'

import './assets/css/tailwind.css'

Vue.config.productionTip = false
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./components/Home.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('./components/Dashboard.vue')
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('./components/Search.vue')
    },
    {
      path: '/detail',
      name: 'detail',
      component: () => import('./components/Detail.vue')
    },
    {
      path: '/detail/:id',
      name: 'detailId',
      component: () => import('./components/Detail.vue')
    },
    {
      path: '/setting',
      name: 'setting',
      component: () => import('./components/Setting.vue')
    }
  ]
})

new Vue({
  store,
  router,
  render: h => h(App),
  beforeCreate() {
    this.$store.commit('INITIALIZE_STORE')
  }
}).$mount('#app')
