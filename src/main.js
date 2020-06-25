import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App.vue'
import router from './router'
import VueAuth from '@websanova/vue-auth'
import './registerServiceWorker'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import {
  FontAwesomeIcon
} from '@fortawesome/vue-fontawesome'
import {
  faHome,
  faHeading,
  faParagraph,
  faLessThan,
  faGreaterThan,
  faVideo,
  faTimes,
  faCheck,
  faTrash,
  faSyncAlt,
  faTasks,
  faUser,
  faCommentAlt,
  faExclamationCircle,
  faCamera,
  faFile,
  faFileAlt,
  faSignInAlt,
  faSignOutAlt,
  faFileSignature,
  faBolt,
  faTools,
  faExclamationTriangle,
  faCheckSquare,
  faListAlt,
  faPlane,
  faEdit,
  faSave
} from '@fortawesome/free-solid-svg-icons';
import {
  faFirstdraft,
} from '@fortawesome/free-brands-svg-icons';
import {
  library
} from '@fortawesome/fontawesome-svg-core';

library.add(faParagraph, faHeading, faSave, faEdit, faFirstdraft, faHome, faLessThan, faGreaterThan, faVideo, faTimes, faCheck, faTrash, faSyncAlt, faTasks, faUser, faCommentAlt, faExclamationCircle, faCamera, faFile, faFileAlt, faFileSignature, faBolt, faTools, faExclamationTriangle, faCheckSquare, faListAlt, faPlane, faSignInAlt, faSignOutAlt)
Vue.use(BootstrapVue)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
Vue.axios.defaults.baseURL = process.env.VUE_APP_APIURL;
Vue.router = router;
Vue.use(VueAuth, {
  auth: require('@websanova/vue-auth/drivers/auth/bearer.js'),
  http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
  router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js')
});

new Vue({
  router,
  render: function (h) {
    return h(App)
  }
}).$mount('#app')