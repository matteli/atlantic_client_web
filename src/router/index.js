import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Log3S from '../views/Log3S.vue'
//import FileDesigner from '../views/FileDesigner.vue'
import FileEditor from '../views/FileEditor.vue'
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
        path: '/docs/:model',
        name: 'FilelistModel',
        component: FileList,
        props: true
    },
    {
        path: '/docs/:model/references/:reference',
        name: 'FilelistRef',
        component: FileList,
        props: true
    },
    /*{
        path: '/docs/:model/planes/:plane/files/:name',
        name: 'Filedesigner',
        component: FileDesigner
    },*/
    {
        path: '/docs/:model/references/:reference/files/:name',
        name: 'FileEditor',
        component: FileEditor
    },


]

const router = new VueRouter({
    routes
})

export default router