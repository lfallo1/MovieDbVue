import Home from './views/Home.vue'
import SignupLogin from './views/SignupLogin.vue'
import AdvancedSearch from './views/AdvancedSearch.vue'
import MediaActorDetails from './views/MediaActorDetails.vue'
import MediaTvMovieDetails from './views/MediaTvMovieDetails.vue'
import PageNotFound from './components/Errors/PageNotFound.vue';

export default [
  {path: '/', component: Home},
  // {path: '/signup-login', component: SignupLogin},
  {path: '/advancedsearch', component: AdvancedSearch},
  {path: '/actor-details', component: MediaActorDetails},
  {path: '/tvmovie-details', component: MediaTvMovieDetails},
  {path: '*', component: PageNotFound}
]
