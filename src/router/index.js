import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Log3S from '../views/Log3S.vue'
import FileDesigner from '../views/FileDesigner.vue'
import FileList from '../views/FileList.vue'

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
    path: '/docs',
    name: 'Filelist',
    component: FileList
},
{
    path: '/docs/:plane_model/planes/:plane/files/:name',
    name: 'Filedesigner',
    component: FileDesigner
},

]

const router = new VueRouter({
    routes
})

export default router