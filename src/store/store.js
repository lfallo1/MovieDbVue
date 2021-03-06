import Vue from 'vue';
import Vuex from 'vuex';
import MoviesStore from './movies/moviesStore.js';
import AuthStore from './auth/authStore.js';
import {ROOTSTORE_SET_GLOBAL_TIME} from './mutation-types.js';

Vue.use(Vuex);
export default new Vuex.Store({
    modules: {
        movies: MoviesStore,
        auth: AuthStore
    },
    state: {
        globalTime: new Date()
    },
    mutations: {
        [ROOTSTORE_SET_GLOBAL_TIME](state, time) {
            state.globalTime = time;
        }
    },
    actions: {
        globalMethod({commit}) {
            commit(ROOTSTORE_SET_GLOBAL_TIME, new Date());
        }
    }
});