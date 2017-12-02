import {
  MOVIES_SET_DISCOVER_RESULTS,
  MOVIES_SET_NOW_PLAYING_MOVIES,
  MOVIES_SET_SEARCH_RESULTS,
  MOVIES_SET_USAGE
} from './mutation-types.js';
import {HTTP} from '../../http.js';

const api_key = '21daf02c31d8c5f60b02897088a9aa87';

export default {
  namespaced: true,
  state: {
    multiSearchResults: {
      movies: [],
      actors: [],
      tvShows: []
    },
    discoverSearchResults: [],
    popularMovies: [],
    topRatedMovies: [],
    upcomingMovies: [],
    nowPlayingMovies: [],
    usage: {
      remaining: 40,
      reset: new Date(),
      retryAfter: false
    }
  },
  mutations: {
    [MOVIES_SET_SEARCH_RESULTS](state, results) {
      state.multiSearchResults.movies = results.movies;
      state.multiSearchResults.actors = results.actors;
      state.multiSearchResults.tvShows = results.tvShows;
    },
    [MOVIES_SET_DISCOVER_RESULTS](state, discoverSearchResults) {
      state.discoverSearchResults = discoverSearchResults;
    },
    [MOVIES_SET_NOW_PLAYING_MOVIES](state, movies) {
      state.nowPlayingMovies = movies;
    },
    [MOVIES_SET_USAGE](state, usage) {
      state.usage = usage;
    }
  },
  actions: {
    multiSearch({commit}, query) {
      HTTP.get(`/search/multi?api_key=${api_key}&query=${query}`).then(res => {
        const data = {
          movies: res.results.filter(r => r.media_type === 'movie'),
          actors: res.results.filter(r => r.media_type === 'person'),
          tvShows: res.results.filter(r => r.media_type === 'tv')
        }
        commit(MOVIES_SET_SEARCH_RESULTS, data);
      });
    },
    discover({commit}, payload) {
      commit(MOVIES_SET_DISCOVER_RESULTS, payload);
    },
    loadNowPlaying({commit}) {
      commit(MOVIES_SET_NOW_PLAYING_MOVIES, []);
      HTTP.get(`/movie/now_playing?api_key=${api_key}`).then(res => {
        commit(MOVIES_SET_NOW_PLAYING_MOVIES, res.results);
      });
    },
    updateUsage({commit}, usage) {
      commit(MOVIES_SET_USAGE, usage);
    }
  }
};
