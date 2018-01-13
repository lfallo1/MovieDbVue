<template>
  <div>
    <div id="search-options">
      <div class="well well-md">
        <form>
          <div class="row">
            <div class="form-group col-md-3">
              <label>Vote Count Min</label>
              <app-vueslider :max="1000" tooltip-dir="bottom" ref="vote_count_gte"
                             v-model="form.voteCountMin"></app-vueslider>
            </div>
            <div class="form-group col-md-3">
              <label>Grade Min</label>
              <app-vueslider :max="10" tooltip-dir="bottom" :interval="0.1" ref="vote_average_gte"
                             v-model="form.voteAverageMin"></app-vueslider>
            </div>
            <div class="form-group col-md-3">
              <label>With genres</label>
              <app-multiselect v-model="form.selectedGenres"
                               :close-on-select="false"
                               :options="genres"
                               :multiple="true"
                               track-by="id"
                               select-label=""
                               deselect-label=""
                               :custom-label="genresLabel"></app-multiselect>
            </div>
            <div class="form-group col-md-3">
              <label>Sort</label>
              <app-multiselect v-model="form.sortBy"
                               :close-on-select="true"
                               :options="sortOptions"
                               :multiple="false"
                               track-by="value"
                               select-label=""
                               deselect-label=""
                               :custom-label="sortOptionsLabel"></app-multiselect>
            </div>

            <div class="extra-space col-md-12"></div>

            <div class="form-group col-md-3">
              <label>Release Date Min</label>
              <app-datepicker format="yyyy-MM-dd" :clear-button="true"
                              v-model="form.releaseDateGte"
                              :minimumView="'day'"
                              :maximumView="'year'"
                              :initialView="'month'"></app-datepicker>
            </div>
            <div class="form-group col-md-3">
              <label>Release Date Max</label>
              <app-datepicker format="yyyy-MM-dd" :clear-button="true" v-model="form.releaseDateLte"
                              :minimumView="'day'"
                              :maximumView="'year'"
                              :initialView="'month'"></app-datepicker>
            </div>
            <div class="form-group col-md-3">
              <label>Keywords</label>
              <div class="keyword-item" v-for="(keyword, idx) in form.keywords">
                <input class="form-control"
                       :disabled="searchMode != 'movie'"
                       :style="{ width : form.keywords.length > 1 && searchMode == 'movie' ? '80%' : '100%'}"

                       v-model="keyword.value"/>&nbsp;
                <span v-if="form.keywords.length > 1 && searchMode == 'movie'"
                      class="text-danger clickable glyphicon glyphicon-remove"
                      @click="form.keywords.splice(idx, 1)"></span>
              </div>
              <button v-if="searchMode == 'movie'" class="add-keyword btn btn-success"
                      @click.prevent="form.keywords.push({value: ''})">Add
              </button>
            </div>
            <div class="form-group col-md-3">
              <label>With Actor</label>
              <input :disabled="searchMode != 'movie'" class="form-control" type="text" v-model="actorSearchText"
                     @blur="_searchActors()"/>&nbsp;
              <div id="actor-search-results">
                <div v-for="a in searchActorsResults">
                  <a class="actor-search-result-item" @click.prevent="selectActor(a)">{{a.name}}</a>
                </div>
              </div>
            </div>
          </div>
        </form>

        <hr>

        <div class="row">
          <div id="advanced-search-button" class="col-md-12">
            <label for="searchModeMovie">Movie</label>
            <input id="searchModeMovie" name="searchMode" type="radio" v-model="searchMode" value="movie"/>
            <label for="searchModeTV">TV</label>
            <input id="searchModeTV" name="searchMode" type="radio" v-model="searchMode" value="tv"/>

            <div @click="searchButtonPressed(false)" class="btn btn-primary">Search</div>
          </div>
          <div id="filter-region">
            <button class="btn btn-default" @click="toggleFilterRegion()">Toggle</button>
            <span
              :class="filterRegion ? 'text-success' : 'text-danger'">(Region Filter {{filterRegion ? 'ON' : 'OFF'}})</span>
          </div>
        </div>

      </div>

      <div class="row">
        <div class="col-md-12">
          <app-movie-full-details :handler="selectMedia"/>
        </div>
      </div>

      <div class="row">

        <div class="col-md-3" v-for="movie in advancedSearchResults" v-if="movie.poster_path">
          <div class="row">
            <app-movieimage-subtitle :movie="movie" :handler="selectMedia"></app-movieimage-subtitle>
          </div>
        </div>
        <br>

      </div>

      <div id="view-more" class="row">
        <div class="col-md-12">
          <button class="btn btn-primary" v-if="advancedSearchResults.length > 0" @click="nextPage()">
            View more
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>

  import Vue from 'vue'
  import Datepicker from 'vuejs-datepicker'
  import vueSlider from 'vue-slider-component'
  import Multiselect from 'vue-multiselect'
  import moviesData from '../data/movies_data.js'
  import {mapActions, mapState} from 'vuex'
  import StringUtil from '../data/string_util.js'
  import MovieImageSubTitle from '../components/Movies/MovieImageSubTitle.vue'
  import MovieFullDetails from '../components/Movies/MovieFullDetails.vue'
  import {router} from '../main.js';

  export default {
    components: {
      'app-datepicker': Datepicker,
      'app-vueslider': vueSlider,
      'app-multiselect': Multiselect,
      'app-movieimage-subtitle': MovieImageSubTitle,
      'app-movie-full-details': MovieFullDetails
    },
    data() {
      return {
        form: {
          sortBy: '',
          voteCountMin: 0,
          voteAverageMin: 0,
          releaseDateGte: new Date(new Date().getFullYear(), 0, 1),
          releaseDateLte: null,
          selectedGenres: [],
          selectedWithoutGenres: [],
          sortOptions: [],
          keywords: [{value: ''}],
          withActor: 0
        },
        sortOptions: [],
        genres: [],
        actorSearchText: '',
        searchMode: 'movie',
        page: 1
      }
    },
    computed: {
      ...mapState({
        advancedSearchResults: state => state.movies.advancedSearchResults,
        selectedMovie: state => state.movies.selectedMovie,
        searchActorsResults: state => state.movies.searchActorsResults,
        filterRegion: state => state.movies.filterRegion
      })
    },
    methods: {
      ...mapActions({
        setAdvancedSearchOptions: 'movies/setAdvancedSearchOptions',
        advancedSearch: 'movies/advancedSearch',
        resetAdvancedSearch: 'movies/resetAdvancedSearch',
        selectMovieById: 'movies/selectMovieById',
        selectTvShowById: 'movies/selectTvShowById',
        searchKeyword: 'movies/searchKeyword',
        searchActors: 'movies/searchActors',
        setSearchActorsResults: 'movies/setSearchActorsResults',
        setAdvancedSearchResults: 'movies/setAdvancedSearchResults',
        clearSelectedMedia: 'movies/clearSelectedMedia',
        setAdvancedSearchMode: 'movies/setAdvancedSearchMode',
        toggleFilterRegion: 'movies/toggleFilterRegion'
      }),
      selectMedia(media) {
        if (media.media_type === 'tv') {
          this.selectTvShowById(media.id);
        }
        else {
          this.selectMovieById(media.id);
        }
      },
      _searchActors() {
        this.form.withActor = 0;
        if (this.actorSearchText) {
          this.searchActors(this.actorSearchText);
        }
      },
      selectActor(actor) {
        this.form.withActor = actor.id;
        this.actorSearchText = actor.name;
        this.setSearchActorsResults([]);
      },
      genresLabel(option) {
        return option.name;
      },
      sortOptionsLabel(option) {
        const direction = option.direction ? 'desc' : 'asc';
        return `${option.display} ${direction}`;
      },
      search(q) {
        this.resetAdvancedSearch(false);
        this.setAdvancedSearchMode(q.search_mode);
        delete q.search_mode;
        this.setAdvancedSearchOptions(q);
        this.advancedSearch();
      },
      searchButtonPressed(specifyPage) {

        //reset store's state

        this.setPayload(specifyPage).then(searchOptions => {
          let q = '';
          let first = true;
          for (let key in searchOptions) {
            if (searchOptions[key]) {
              const separator = first ? '?' : '&';
              q += separator + key + '=' + searchOptions[key]
              first = false;
            }
          }
          router.push('advancedsearch' + q);
        });

      },
      nextPage() {
        this.setPayload(true).then(payload => this.search(payload));
      },
      setPayload(specifyPage) {
        return new Promise((resolve, reject) => {
          let searchOptions = {with_keywords: ''};

          if (specifyPage) {
            searchOptions.page = ++this.page;
          } else {
            searchOptions.page = this.page = 1;
          }

          searchOptions.search_mode = this.searchMode;

          //vote params
          searchOptions.vote_count_gte = this.form.voteCountMin;
          searchOptions.vote_average_gte = this.form.voteAverageMin;

          //set genres
          searchOptions.with_genres = this.form.selectedGenres.map(s => s.id).toString().replace(/,/g, '|');
          searchOptions.without_genres = this.form.selectedWithoutGenres.map(s => s.id).toString().replace(/,/g, '|');

          //sort direction
          if (this.form.sortBy) {
            searchOptions.sort_by = this.form.sortBy.value;
          }

          let keywordRequests = [];
          if (this.searchMode == 'movie') {
            //format release date values
            if (this.form.releaseDateGte) {
              searchOptions.primary_release_date_gte = StringUtil.dateToString(this.form.releaseDateGte);
            }

            if (this.form.releaseDateLte) {
              searchOptions.primary_release_date_lte = StringUtil.dateToString(this.form.releaseDateLte);
            }

            //with actor
            if (this.form.withActor) {
              searchOptions.with_cast = this.form.withActor;
            }

            //set keywords - this will need to be a promise
            for (let i = 0; i < this.form.keywords.length; i++) {
              if (this.form.keywords[i].value) {
                // make web request to /search/keyword?query=keywordList[i], and get list of ids
                keywordRequests.push(this.searchKeyword(this.form.keywords[i].value));
              }
            }
          } else if (this.searchMode == 'tv') {
            //format air date values
            if (this.form.releaseDateGte) {
              searchOptions.air_date_gte = StringUtil.dateToString(this.form.releaseDateGte);
            }

            if (this.form.releaseDateLte) {
              searchOptions.air_date_lte = StringUtil.dateToString(this.form.releaseDateLte);
            }
          }

          Promise.all(keywordRequests).then(data => {
            for (let i = 0; i < data.length; i++) {
              searchOptions.with_keywords += data[i].results.map(r => r.id).toString().replace(/,/g, '|') + "|";
            }
            searchOptions.with_keywords = searchOptions.with_keywords.substring(0, searchOptions.with_keywords.length - 1);
            resolve(searchOptions);
          }, err => reject());
        });
      }
    },
    created() {
      this.genres = moviesData.genres;
      this.sortOptions = moviesData.sortOptions;
      this.setSearchActorsResults([]);
      if (Object.keys(this.$route.query).length > 0) {
        this.search(this.$route.query);
      }
    },
    watch: {
      $route(to, from) {
        if (Object.keys(to.query).length > 0) {
          this.search(to.query);
        }
      }
    }
  }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css">

</style>
