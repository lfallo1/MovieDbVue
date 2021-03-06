//vue
import Vue from "vue";

//plugins
import VueRouter from 'vue-router';
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
import Toasted from 'vue-toasted';
import BootstrapVue from 'bootstrap-vue'
import VModal from 'vue-js-modal'
import VueScrollTo from 'vue-scrollto';


//vuex / routes
import store from './store/store.js';
import routes from './routes.js';

//bootstrap
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vue2-autocomplete-js/dist/style/vue2-autocomplete.css'

//components
import App from './components/App.vue'

//register plugins
Vue.use(BootstrapVue);
Vue.use(VueMaterial);
Vue.use(Toasted);
Vue.use(VueRouter);
Vue.use(VModal, {dialog: true});
Vue.use(VueScrollTo);

//optional eventBus
export const eventBus = new Vue();

// --- router ---

export const router = new VueRouter({
  // mode: 'history',
  routes: routes,
  linkExactActiveClass: 'exact-route-match',
  scrollBehavior(to, from, savedPosition) {
    return to.hash ? {selector: to.hash} : savedPosition ? savedPosition : {x: 0, y: 0};
  }
});

router.beforeEach((to, from, next) => {
  if (to.matched.filter(t => t.meta.isAuthRequired).length > 0) {
    console.log('route::auth_required');
  }
  if (to.matched.filter(t => t.meta.isAnonymousRequired).length > 0) {
    console.log('route::must_be_logged_out');
  }
  next();
});
// --- end router ---

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
