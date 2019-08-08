import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Log3S from './views/Log3S.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path:'/log3s/:registration',
      name: 'log3s',
      component: Log3S
    },
  ]
})
