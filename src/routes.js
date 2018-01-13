import Home from './views/Home.vue'
import SignupLogin from './views/SignupLogin.vue'
import AdvancedSearch from './views/AdvancedSearch.vue'
import MediaActorDetails from './views/MediaActorDetails.vue'
import MediaTvMovieDetails from './views/MediaTvMovieDetails.vue'
import PageNotFound from './components/Errors/PageNotFound.vue';
import store from './store/store.js'

export default [
  {path: '/', component: Home},
  // {path: '/signup-login', component: SignupLogin},
  {path: '/advancedsearch', component: AdvancedSearch},
  {
    path: '/actor-details',
    component: MediaActorDetails,
    beforeEnter(to, from, next) {
      store.dispatch('movies/setSelectedMedia', to.query.id).then(() => {
        store.dispatch('movies/resetAdvancedSearch', true);
        store.dispatch('movies/setAdvancedSearchMode', 'movie');
        store.dispatch('movies/setAdvancedSearchOptions', {'with_people': to.query.id});
        store.dispatch('movies/advancedSearch');
        next();
      }, err => next('/'));
    }
  },
  {
    path: '/tvmovie-details',
    component: MediaTvMovieDetails,
    beforeEnter(to, from, next) {
      var apiCall = to.query.type == 'movie' ? store.dispatch('movies/selectMovieById', to.query.id) : store.dispatch('movies/selectTvShowById', to.query.id)
      apiCall.then(() => {
        next();
      }, () => {
        next('/');
      })
    }
  },
  {path: '*', component: PageNotFound}
]
