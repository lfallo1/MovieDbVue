import {
  MOVIES_SET_NOW_PLAYING_MOVIES,
  MOVIES_SET_SEARCH_RESULTS,
  MOVIES_SET_SELECTED_MEDIA,
  MOVIES_SET_USAGE,
  MOVIES_ADVANCEDSEARCH_SET_OPTIONS,
  MOVIES_ADVANCEDSEARCH_SET_RESULTS,
  MOVIES_SET_MOVIE,
  MOVIES_SET_ACTORS_SEARCH_RESULTS,
  MOVIES_ADVANCEDSEARCH_SET_MODE,
  MOVIES_TOGGLE_FILTER_REGION,
  MOVIES_VIEW_MORE_RECOMMENDED,
  MOVIES_VIEW_MORE_SIMILAR
} from './mutation-types.js';
import {HTTP} from '../../http.js';

const api_key = '21daf02c31d8c5f60b02897088a9aa87';

const ADVANCED_SEARCH_MODES = {
  movies: 'movie',
  tv: 'tv'
}

export default {
  namespaced: true,
  state: {
    selectedMovie: {},
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
      primary_release_date_gte: {value: null, q: 'primary_release_date.gte'},
      primary_release_date_lte: {value: null, q: 'primary_release_date.lte'},
      air_date_gte: {value: null, q: 'air_date.gte'},
      air_date_lte: {value: null, q: 'air_date.lte'},
      vote_count_gte: {value: 0, q: 'vote_count.gte'},
      vote_count_lte: {value: 0, q: 'vote_count.lte'},
      vote_average_gte: {value: 6.0, q: 'vote_average.gte'},
      vote_average_lte: {value: 0, q: 'vote_average.lte'},
      with_cast: {value: '', q: 'with_cast'},
      with_genres: {value: '', q: 'with_genres'},
      without_genres: {value: '', q: 'without_genres'},
      with_keywords: {value: '', q: 'with_keywords'},
      without_keywords: {value: '', q: 'without_keywords'},
      with_people: {value: '', q: 'with_people'},
    },
    advancedSearchResults: [],
    advancedSearchResultMode: ADVANCED_SEARCH_MODES.movies,
    searchActorsResults: [],
    filterRegion: true
  },
  mutations: {
    [MOVIES_SET_MOVIE](state, movie) {
      state.selectedMovie = movie;
    },
    [MOVIES_SET_SEARCH_RESULTS](state, results) {
      if (results.movies) {
        state.multiSearchResults.movies = results.movies;
      }

      if (results.actors) {
        state.multiSearchResults.actors = results.actors;
      }

      if (results.tvShows) {
        state.multiSearchResults.tvShows = results.tvShows;
      }
    },
    [MOVIES_SET_NOW_PLAYING_MOVIES](state, movies) {
      state.nowPlayingMovies = movies;
    },
    [MOVIES_SET_SELECTED_MEDIA](state, media) {
      state.selectedMedia = media;
    },
    [MOVIES_SET_ACTORS_SEARCH_RESULTS](state, actors) {
      state.searchActorsResults = actors;
    },
    [MOVIES_SET_USAGE](state, usage) {
      state.usage = usage;
    },
    [MOVIES_ADVANCEDSEARCH_SET_OPTIONS](state, searchOptions) {
      for (var option in searchOptions) {
        state.advancedSearchOptions[option].value = searchOptions[option];
      }
    },
    [MOVIES_ADVANCEDSEARCH_SET_MODE](state, mode) {
      state.advancedSearchResultMode = mode;
    },
    [MOVIES_TOGGLE_FILTER_REGION](state) {
      state.filterRegion = !state.filterRegion;
    },
    [MOVIES_ADVANCEDSEARCH_SET_RESULTS](state, searchResults) {
      state.advancedSearchResults = searchResults;
    }
  },
  actions: {
    selectMovieById({commit}, id) {
      commit(MOVIES_SET_MOVIE, {});
      return new Promise((resolve, reject) => {
        HTTP.get(`/movie/${id}?api_key=${api_key}`).then(movie => {

          const promises = [
            HTTP.get(`/movie/${id}/credits?api_key=${api_key}`),
            HTTP.get(`/movie/${id}/similar?api_key=${api_key}`),
            HTTP.get(`/movie/${id}/recommendations?api_key=${api_key}`)
          ];

          Promise.all(promises).then(res => {

            //credits
            movie.actors = res[0].cast;

            //similar movies
            movie.similar = {
              results: res[1].results,
              page: 1,
              finished: res[1].results.length == res[1].total_results
            };

            //recommended movies
            movie.recommendations = {
              results: res[2].results,
              page: 1,
              finished: res[2].results.length == res[2].total_results
            };

            movie.media_type = 'movie';
            commit(MOVIES_SET_MOVIE, movie);
            resolve();
          });

        }, err => reject(err));
      });
    },
    selectTvShowById({commit}, id) {
      commit(MOVIES_SET_MOVIE, {});
      return new Promise((resolve, reject) => {
        HTTP.get(`/tv/${id}?api_key=${api_key}`).then(tvShow => {

          const promises = [
            HTTP.get(`/tv/${id}/credits?api_key=${api_key}`),
            HTTP.get(`/tv/${id}/similar?api_key=${api_key}`),
            HTTP.get(`/tv/${id}/recommendations?api_key=${api_key}`)
          ];

          Promise.all(promises).then(res => {

            //credits
            tvShow.actors = res[0].cast;

            //similar movies
            tvShow.similar = {
              results: res[1].results,
              page: 1,
              finished: res[1].results.length == res[1].total_results
            };

            //recommended movies
            tvShow.recommendations = {
              results: res[2].results,
              page: 1,
              finished: res[2].results.length == res[2].total_results
            };

            tvShow.media_type = 'tv';
            commit(MOVIES_SET_MOVIE, tvShow);
            resolve();
          });

        }, err => {
          reject();
          console.log('error', err)
        });
      })
    },
    viewMoreRecommended({commit, state}, media) {
      const id = media.id;
      const type = media.original_title ? 'movie' : 'tv';
      const url = `/${widthType}/${id}/recommendations?api_key=${api_key}&page=${state.selectedMovie.recommendations.page + 1}`;
      HTTP.get(url).then(res => {
        state.selectedMovie.recommendations.forEach(r => r.media_type = type);
        state.selectedMovie.recommendations.results = state.selectedMovie.recommendations.results.concat(res.results);
        state.selectedMovie.recommendations.page++;
        state.selectedMovie.recommendations.finished = res.results.length == res.total_results
      });
    },
    viewMoreSimilar({commit, state}, media) {
      const id = media.id;
      const type = media.original_title ? 'movie' : 'tv';
      const url = `/${type}/${id}/similar?api_key=${api_key}&page=${state.selectedMovie.similar.page + 1}`;
      HTTP.get(url).then(res => {
        state.selectedMovie.similar.forEach(r => r.media_type = type);
        state.selectedMovie.similar.results = state.selectedMovie.similar.results.concat(res.results);
        state.selectedMovie.similar.page++;
        state.selectedMovie.similar.finished = res.results.length == res.total_results;
      });
    },
    resetAdvancedSearch({dispatch}, resetToDefault) {
      if (resetToDefault) {
        //when resetting to the default options
        dispatch('setAdvancedSearchOptions', {
          page: 1,
          primary_release_year: 0,
          primary_release_date_gte: null,
          primary_release_date_lte: null,
          air_date_gte: null,
          air_date_lte: null,
          vote_count_gte: 0,
          vote_count_lte: 0,
          vote_average_gte: 6.0,
          vote_average_lte: 0,
          with_cast: '',
          with_genres: '',
          without_genres: '',
          with_keywords: '',
          without_keywords: '',
          with_people: '',
          sort_by: 'vote_average.desc'
        });
      } else {
        //when clearing all options
        dispatch('setAdvancedSearchOptions', {
          sort_by: '',
          page: 1,
          primary_release_year: 0,
          primary_release_date_gte: null,
          primary_release_date_lte: null,
          air_date_gte: null,
          air_date_lte: null,
          vote_count_gte: 0,
          vote_count_lte: 0,
          vote_average_gte: 0,
          vote_average_lte: 0,
          with_cast: '',
          with_genres: '',
          without_genres: '',
          with_keywords: '',
          without_keywords: '',
          with_people: '',
        });
      }
    },
    setAdvancedSearchResults({commit}, results) {
      commit(MOVIES_ADVANCEDSEARCH_SET_RESULTS, results);
    },
    setAdvancedSearchMode({commit}, mode) {
      commit(MOVIES_ADVANCEDSEARCH_SET_MODE, mode);
    },
    toggleFilterRegion({commit}) {
      commit(MOVIES_TOGGLE_FILTER_REGION);
    },
    setAdvancedSearchOptions({commit, state}, searchOptions) {
      if (searchOptions.searchMode) {
        state.advancedSearchResultMode = searchOptions.searchMode;
      }
      commit(MOVIES_ADVANCEDSEARCH_SET_OPTIONS, searchOptions);
    },
    advancedSearch({commit, state}) {
      let url = `/discover/${state.advancedSearchResultMode}?api_key=${api_key}`;
      if (state.filterRegion) {
        url += '&with_original_language=en';
      }
      for (var prop in state.advancedSearchOptions) {
        const obj = state.advancedSearchOptions[prop];
        url += obj.value ? `&${obj.q}=${obj.value}` : '';
      }

      HTTP.get(url).then(res => {

        //add the media_type prop
        res.results.forEach(r => r.media_type = state.advancedSearchResultMode === ADVANCED_SEARCH_MODES.movies ? 'movie' : 'tv');

        let results = [];

        if (state.advancedSearchOptions.page.value > 1) {
          results = state.advancedSearchResults.concat(res.results);
        } else {
          results = res.results;
        }

        commit(MOVIES_ADVANCEDSEARCH_SET_RESULTS, results);
      }, err => console.log(err));
    },
    multiSearch({commit}, query) {
      commit(MOVIES_SET_SEARCH_RESULTS, {movies: [], actors: [], tvShows: []});

      //actors
      HTTP.get(`/search/person?api_key=${api_key}&query=${query}`).then(res => {
        res.results.forEach(r => r.media_type = 'person');
        commit(MOVIES_SET_SEARCH_RESULTS, {actors: res.results});
      });

      //movies
      HTTP.get(`/search/movie?api_key=${api_key}&query=${query}`).then(res => {
        res.results.forEach(r => r.media_type = 'person');
        commit(MOVIES_SET_SEARCH_RESULTS, {movies: res.results});
      });

      //tv shows
      HTTP.get(`/search/tv?api_key=${api_key}&query=${query}`).then(res => {
        res.results.forEach(r => r.media_type = 'person');
        commit(MOVIES_SET_SEARCH_RESULTS, {tvShows: res.results});
      });
    },
    loadNowPlaying({commit}) {
      commit(MOVIES_SET_NOW_PLAYING_MOVIES, []);
      HTTP.get(`/movie/now_playing?api_key=${api_key}`).then(res => {
        commit(MOVIES_SET_NOW_PLAYING_MOVIES, res.results);
      });
    },
    setSelectedMedia({commit}, actorId) {
      return new Promise((resolve, reject) => {
        HTTP.get(`/person/${actorId}?api_key=${api_key}`).then(data => {
          data.media_type = 'person';
          commit(MOVIES_SET_SELECTED_MEDIA, data);
          resolve();
        }, err => reject(err));
      });
    },
    searchActors({commit}, text) {
      HTTP.get(`/search/person?api_key=${api_key}&query=${text}`).then(res => {
        commit(MOVIES_SET_ACTORS_SEARCH_RESULTS, res.results);
      });
    },
    setSearchActorsResults({commit}, actors) {
      commit(MOVIES_SET_ACTORS_SEARCH_RESULTS, actors);
    },
    searchKeyword({}, text) {
      return new Promise((resolve, reject) => {
        HTTP.get(`/search/keyword?query=${text}&api_key=${api_key}`).then(data => {
          resolve(data);
        });
      });
    },
    updateUsage({commit}, usage) {
      commit(MOVIES_SET_USAGE, usage);
    }
  }
};
