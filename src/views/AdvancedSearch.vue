<template>
  <div>
    <div id="search-options">
      <form>
        <div class="form-row">
          <div class="form-group col-md-2">
            <label>Vote Count Min</label>
            <app-vueslider :max="1000" tooltip-dir="bottom" ref="vote_count_gte"
                           v-model="form.voteCountMin"></app-vueslider>
          </div>
          <div class="form-group col-md-2">
            <label>Grade Min</label>
            <app-vueslider :max="10" tooltip-dir="bottom" :interval="0.1" ref="vote_average_gte"
                           v-model="form.voteAverageMin"></app-vueslider>
          </div>
          <div class="form-group col-md-2">
            <label>Release Date Min</label>
            <app-datepicker format="yyyy-MM-dd" :clear-button="true"
                            v-model="form.releaseDateGte"
                            :minimumView="'day'"
                            :maximumView="'month'"
                            :initialView="'month'"></app-datepicker>
          </div>
          <div class="form-group col-md-2">
            <label>Release Date Max</label>
            <app-datepicker format="yyyy-MM-dd" :clear-button="true" v-model="form.releaseDateLte" :minimumView="'day'"
                            :maximumView="'month'"
                            :initialView="'month'"></app-datepicker>
          </div>
          <div class="form-group col-md-2">
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
          <div class="form-group col-md-2">
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
          <div class="form-group col-md-2">
            <label>Keywords</label>
            <div v-for="(keyword, idx) in form.keywords">
              <input class="form-control" type="text" v-model="keyword.value"/>&nbsp;
              <span class="text-danger clickable glyphicon glyphicon-remove" @click="keywords.splice(idx, 1)"></span>
            </div>
            <button class="btn btn-success" @click="form.keywords.push({value: ''})">Add</button>
          </div>
        </div>
      </form>
      <div class="row">
        <div class="col-md-6">
          <div @click="search(false)" class="btn btn-primary">Search</div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-12">
          <app-movie-details :movie="selectedMovie"/>
        </div>
      </div>

      <div class="row">

        <div class="col-md-3" v-for="movie in advancedSearchResults">
          <div class="row">
            <app-movieimage-subtitle :movie="movie"></app-movieimage-subtitle>
          </div>
        </div>
        <button class="btn btn-primary" v-if="advancedSearchResults.length > 0" @click="search(true)">View more</button>

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
  import MovieDetails from '../components/Movies/MovieDetails.vue'

  /**
   *         sort_by: '',
   page: 1,
   primary_release_year: 0,
   release_date_gte: null,
   release_date_lte: null,
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
   */

  export default {
    components: {
      'app-datepicker': Datepicker,
      'app-vueslider': vueSlider,
      'app-multiselect': Multiselect,
      'app-movieimage-subtitle': MovieImageSubTitle,
      'app-movie-details': MovieDetails
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
          keywords: [{value: ''}]
        },
        sortOptions: [],
        genres: [],
        page: 1
      }
    },
    computed: {
      ...mapState({
        advancedSearchResults: state => state.movies.advancedSearchResults,
        selectedMovie: state => state.movies.selectedMovie
      })
    },
    methods: {
      ...mapActions({
        setAdvancedSearchOptions: 'movies/setAdvancedSearchOptions',
        advancedSearch: 'movies/advancedSearch',
        resetAdvancedSearch: 'movies/resetAdvancedSearch',
        selectMovieById: 'movies/selectMovieById',
        searchKeyword: 'movies/searchKeyword'
      }),
      genresLabel(option) {
        return option.name;
      },
      sortOptionsLabel(option) {
        const direction = option.direction ? 'desc' : 'asc';
        return `${option.display} ${direction}`;
      },
      search(specifyPage) {

        //reset store's state
        this.resetAdvancedSearch(false);

        this.setPayload(specifyPage).then(payload => {
          this.setAdvancedSearchOptions(payload);
          this.advancedSearch();
        }, err =>{
          Vue.toasted.error('Error performing search', {
            position: 'bottom-right',
            icon: 'warning'
          }).goAway(3500);
        });
      },
      setPayload(specifyPage){
        return new Promise((resolve, reject) =>{
          let searchOptions = { with_keywords: '' };

          if(specifyPage){
            searchOptions.page = ++this.page;
          } else{
            searchOptions.page = this.page = 1;
          }

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

          //format release date values
          if (this.form.releaseDateGte) {
            searchOptions.primary_release_date_gte = StringUtil.dateToString(this.form.releaseDateGte);
          }

          if (this.form.releaseDateLte) {
            searchOptions.primary_release_date_lte = StringUtil.dateToString(this.form.releaseDateLte);
          }

          //set keywords - this will need to be a promise
          let keywordRequests = [];
          for (let i = 0; i < this.form.keywords.length; i++) {
            if(this.form.keywords[i].value) {
              // make web request to /search/keyword?query=keywordList[i], and get list of ids
              keywordRequests.push(this.searchKeyword(this.form.keywords[i].value));
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
      this.sortOptions = moviesData.sortOptions
    }
  }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
