import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Log3S from '../views/Log3S.vue'
import ManualDesigner from '../views/ManualDesigner.vue'
import ManualList from '../views/ManualList.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'home',
    component: Home
},
{
    path: '/log3s/:registration',
    name: 'log3s',
    component: Log3S
},
{
    path: '/manuallist',
    name: 'manuallist',
    component: ManualList
},
{
    path: '/manualdesigner/:id',
    name: 'manualdesigner',
    component: ManualDesigner
},

]

const router = new VueRouter({
    routes
})

export default router