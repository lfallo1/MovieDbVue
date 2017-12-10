import Home from './views/Home.vue'
import Login from './views/Login.vue'
import AdvancedSearch from './views/AdvancedSearch.vue'
import MediaDetails from './views/MediaDetails.vue'
import PageNotFound from './components/Errors/PageNotFound.vue';

export default [
  {path: '/', component: Home},
  {path: '/login', component: Login},
  {path: '/advancedsearch', component: AdvancedSearch},
  {path: '/details', component: MediaDetails},
  {path: '*', component: PageNotFound}
]
