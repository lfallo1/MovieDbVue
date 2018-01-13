<template>
  <div id="home">
    <h3>Home</h3>

    <div id="search-bar">
      <div class="input-group">
        <input class="form-control" v-model="multiSearchText" @keyup.enter="performMultiSearch"/>
        <!--<vue-typeahead-->
        <!--url="https://api.themoviedb.org/3/search/keyword"-->
        <!--anchor="name"-->
        <!--label=""-->
        <!--:classes="{ input: 'form-control'}"-->
        <!--param="query"-->
        <!--:customParams="{api_key: '21daf02c31d8c5f60b02897088a9aa87'}"-->
        <!--:onSelect="selectAutocompleteItem"-->
        <!--:onShouldGetData="invokeAutocomplete"-->
        <!--@keyup.enter="performMultiSearch">-->

        <!--</vue-typeahead>-->

        <span @click="performMultiSearch" class="btn btn-success input-group-addon" id="search-addon">Search</span>
      </div>
    </div>

    <div class="section-header">
      ACTORS
    </div>
    <div class="scrollable-row" v-if="multiSearchResults.actors.length > 0">
      <app-actorsummary
        :key="actor.id"
        :actor="actor"
        v-for="actor in multiSearchResults.actors">
        <!--<strong slot="actorName" slot-scope="props" class="slot-class">SLOT: {{props.text.toUpperCase()}}</strong>-->
        <!--<p slot="knownFor" class="known-for">This is actor is known for some things</p>-->
      </app-actorsummary>
    </div>
    <div class="no-data-available" v-else>
      No data available
    </div>

    <div class="section-header">
      MOVIES
    </div>
    <div class="scrollable-row" v-if="multiSearchResults.movies.length > 0">
      <app-movieimage-subtitle
        :key="movie.id"
        :movie="movie"
        v-for="movie in multiSearchResults.movies">
        <p slot="additionalDetails" class="additional-movie-details text-center">
          <strong>{{movie.original_title}}</strong>&nbsp;<small>{{movie.vote_average}}/10</small>
        </p>
        <!--<strong slot="actorName" slot-scope="props" class="slot-class">SLOT: {{props.text.toUpperCase()}}</strong>-->
        <!--<p slot="knownFor" class="known-for">This is actor is known for some things</p>-->
      </app-movieimage-subtitle>
    </div>
    <div class="no-data-available" v-else>
      No data available
    </div>

    <div class="section-header">
      TV SHOWS
    </div>
    <div class="scrollable-row" v-if="multiSearchResults.tvShows.length > 0">
      <app-movieimage-subtitle
        :key="tvShow.id"
        :movie="tvShow"
        v-for="tvShow in multiSearchResults.tvShows">
        <p slot="additionalDetails" class="additional-movie-details text-center">
          <strong>{{tvShow.original_name}}</strong>&nbsp;<small>{{tvShow.vote_average}}/10</small>
        </p>
        <!--<strong slot="actorName" slot-scope="props" class="slot-class">SLOT: {{props.text.toUpperCase()}}</strong>-->
        <!--<p slot="knownFor" class="known-for">This is actor is known for some things</p>-->
      </app-movieimage-subtitle>
    </div>
    <div class="no-data-available" v-else>
      No data available
    </div>

    <!--<div class="col-md-4">-->
    <!--<div id="selectedMovie" v-if="selectedMedia">-->
    <!--<div class="well">-->
    <!--<img class="thumbnail" :src="'https://image.tmdb.org/t/p/original/' + selectedMedia.poster_path">-->
    <!--<div>-->
    <!--<strong>{{selectedMedia.original_title}}</strong>-->
    <!--</div>-->
    <!--</div>-->
    <!--</div>-->
    <!--</div>-->

    <div class="row">
      <!--<div class="col-md-3">-->
      <!--<div id="now-playing-wrapper">-->
      <!--<h4>Now Playing</h4>-->
      <!--<ul id="now-playing" class="list-group list-group-horizontal">-->
      <!--<li class="list-group-item" v-for="movie in nowPlayingMovies">-->
      <!--<app-movieimage-subtitle :movie="movie"></app-movieimage-subtitle>-->
      <!--</li>-->
      <!--</ul>-->
      <!--</div>-->
      <!--</div>-->
    </div>
  </div>
</template>

<script>

  import {mapState, mapActions} from 'vuex';
  import MovieImageSubTitle from '../components/Movies/MovieImageSubTitle.vue';
  import ActorSummary from '../components/Movies/ActorSummary.vue';
  import VueAutocomplete from 'vue2-autocomplete-js'

  export default {
    components: {
      'app-movieimage-subtitle': MovieImageSubTitle,
      'app-actorsummary': ActorSummary,
      'vue-typeahead': VueAutocomplete
    },
    data() {
      return {
        multiSearchText: ''
      }
    },
    methods: {
      ...mapActions({
        loadNowPlaying: 'movies/loadNowPlaying',
        multiSearch: 'movies/multiSearch',
        setSelectedMedia: 'movies/setSelectedMedia',
        searchKeyword: 'movies/searchKeyword'
      }),
      performMultiSearch() {
        if (this.multiSearchText) {
          this.multiSearch(this.multiSearchText)
        }
      },
      selectAutocompleteItem(item) {
        this.multiSearchText = item;
      },
      invokeAutocomplete(q) {
        this.multiSearchText = q;
        return new Promise((resolve, reject) => {
          this.searchKeyword(q).then(res => {
            resolve(res.results);
          });
        });
      }
    },
    computed: {
      ...mapState({
        nowPlayingMovies: state => state.movies.nowPlayingMovies,
        multiSearchResults: state => state.movies.multiSearchResults,
        selectedMedia: state => state.movies.selectedMedia
      })
    },
    created() {
      /* disabled for now for api-usage reasons - enable once site is at more complete state
        this.loadNowPlaying();
      */
    }
  }
</script>

<style scoped>
  strong, .known-for {
    color: white !important;
  }

  .search-result-actor-wrapper, .search-result-movie-wrapper {
    display: inline-block;
  }

  .additional-movie-details strong {
    color: black !important;
  }

  .section-header {
    margin-top: 45px;
    margin-bottom: -10px;
    margin-left: 15px;
    font-size: 46px;
    font-weight: bold;
  }

  .search-result-movie-wrapper img {
    margin-top: 8px;
    border-radius: 4px;
    margin-left: 16px;
  }

  .no-data-available {
    color: #e91e63;
    font-size: 18px;
    font-weight: bold;
    margin-left: 20px;
    margin-top: 10px;
  }

  #search-bar input {
    height: 45px !important;
    font-weight: bold !important;
    font-size: 42px !important;
  }

  #search-addon {
    font-size: 24px;
    font-weight: bold;
  }

</style>
