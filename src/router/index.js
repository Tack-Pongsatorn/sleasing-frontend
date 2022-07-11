import Axios from 'axios'
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Thank',
    component: () => import('../views/thank.vue'),
    meta: {
      title: 'ขอบคุณที่ใช้บริการ',
      description: 'ขอบคุณที่ใช้บริการ'
    },
  },
  {
    path: '/end',
    name: 'End',
    component: () => import('../views/end.vue'),
    meta: {
      title: 'ข้อมูลไม่ถูกต้อง',
      description: 'ข้อมูลไม่ถูกต้อง'
    },
  },
  {
    path: '/:token',
    name: 'payment',
    component: () => import('../views/pay.vue'),
    meta: {
      title: 'กรอกข้อมูล',
      description: 'กรอกข้อมูล'
    },
    beforeEnter: async function (to, from, next) {

      const { token } = to.params
      const { data } = await Axios.get(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/${token}`)
      store.commit('SET_RESPONSE', data)
      if (!data.status) {
        next('/end')
      } else {
        next()
      }
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


export default router
