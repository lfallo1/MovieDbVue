import {
  MOVIES_SET_NOW_PLAYING_MOVIES,
  MOVIES_SET_SEARCH_RESULTS,
  MOVIES_SET_SELECTED_MEDIA,
  MOVIES_SET_USAGE,
  MOVIES_ADVANCEDSEARCH_SET_OPTIONS,
  MOVIES_ADVANCEDSEARCH_SET_RESULTS
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
    selectedMedia: false,
    usage: {
      remaining: 40,
      reset: new Date(),
      retryAfter: false
    },
    advancedSearchOptions: {
      sort_by: {value: 'vote_average.desc', q: 'sort_by'},
      page: {value: 1, q: 'page'},
      primary_release_year: {value: 0, q: 'primary_release_year'},
      release_date_gte: {value: null, q: 'release_date.gte'},
      release_date_lte: {value: null, q: 'release_date.lte'},
      vote_count_gte: {value: 75, q: 'vote_count.gte'},
      vote_count_lte: {value: 0, q: 'vote_count.lte'},
      vote_average_gte: {value: 7.0, q: 'vote_average.gte'},
      vote_average_lte: {value: 0, q: 'vote_average.lte'},
      with_cast: {value: '', q: 'with_cast'},
      with_genres: {value: '', q: 'with_genres'},
      without_genres: {value: '', q: 'without_genres'},
      with_keywords: {value: '', q: 'with_keywords'},
      without_keywords: {value: '', q: 'without_keywords'},
      with_people: {value: '', q: 'with_people'},
    },
    advancedSearchResults: []
  },
  mutations: {
    [MOVIES_SET_SEARCH_RESULTS](state, results) {
      state.multiSearchResults.movies = results.movies;
      state.multiSearchResults.actors = results.actors;
      state.multiSearchResults.tvShows = results.tvShows;
    },
    [MOVIES_SET_NOW_PLAYING_MOVIES](state, movies) {
      state.nowPlayingMovies = movies;
    },
    [MOVIES_SET_SELECTED_MEDIA](state, media) {
      state.selectedMedia = media;
    },
    [MOVIES_SET_USAGE](state, usage) {
      state.usage = usage;
    },
    [MOVIES_ADVANCEDSEARCH_SET_OPTIONS](state, searchOptions) {
      for (var option in searchOptions) {
        if (state.advancedSearchOptions[option]) {
          state.advancedSearchOptions[option].value = searchOptions[option];
        }
      }
    },
    [MOVIES_ADVANCEDSEARCH_SET_RESULTS](state, searchResults) {
      state.advancedSearchResults = searchResults;
    }
  },
  actions: {
    resetAdvancedSearch({dispatch}) {
      dispatch('setAdvancedSearchOptions', {
        sort_by: '',
        page: 1,
        primary_release_year: 0,
        release_date_gte: null,
        release_date_lte: null,
        vote_count_gte: 75,
        vote_count_lte: 0,
        vote_average_gte: 7.0,
        vote_average_lte: 0,
        with_cast: '',
        with_genres: '',
        without_genres: '',
        with_keywords: '',
        without_keywords: '',
        with_people: '',
        sort_by: 'vote_average.desc'
      });
    },
    setAdvancedSearchOptions({commit}, searchOptions) {
      commit(MOVIES_ADVANCEDSEARCH_SET_OPTIONS, searchOptions);
    },
    advancedSearch({commit, state}) {
      let url = `/discover/movie?api_key=${api_key}`;
      for (var prop in state.advancedSearchOptions) {
        const obj = state.advancedSearchOptions[prop];
        url += obj.value ? `&${obj.q}=${obj.value}` : '';
      }
      commit(MOVIES_ADVANCEDSEARCH_SET_RESULTS, []);
      HTTP.get(url).then(res => {
        commit(MOVIES_ADVANCEDSEARCH_SET_RESULTS, res.results);
      }, err => console.log(err));
    },
    multiSearch({commit}, query) {
      commit(MOVIES_SET_SEARCH_RESULTS, {movies: [], actors: [], tvShows: []});

      //actors
      HTTP.get(`/search/person?api_key=${api_key}&query=${query}`).then(res => {
        res.results.forEach(r => r.media_type = 'person');
        commit(MOVIES_SET_SEARCH_RESULTS, {actors: res.results});
      });
    },
    loadNowPlaying({commit}) {
      commit(MOVIES_SET_NOW_PLAYING_MOVIES, []);
      HTTP.get(`/movie/now_playing?api_key=${api_key}`).then(res => {
        commit(MOVIES_SET_NOW_PLAYING_MOVIES, res.results);
      });
    },
    setSelectedMedia({commit}, media) {
      return new Promise((resolve, reject) => {
        if (media.media_type == 'person') {
          HTTP.get(`/person/${media.id}?api_key=${api_key}`).then(data => {
            data.media_type = 'person';
            commit(MOVIES_SET_SELECTED_MEDIA, data);
            resolve();
          }, err => reject());
        } else {
          HTTP.get(`/movie/${media.id}/credits?api_key=${api_key}`).then(res => {
            media.actors = res.cast;
            commit(MOVIES_SET_SELECTED_MEDIA, media);
            resolve();
          }, err => reject());
        }
      });
    },
    updateUsage({commit}, usage) {
      commit(MOVIES_SET_USAGE, usage);
    }
  }
};
