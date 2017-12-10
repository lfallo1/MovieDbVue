<template>
  <div id="home">
    <h3>Home</h3>

    <div id="search-bar">
      <div class="input-group">
        <span>{{multiSearchText}}</span>
        <input v-model="multiSearchText" type="text" class="form-control"
               placeholder="Search movies, actors, and tv shows" aria-describedby="search-addon">
        <span @click="performMultiSearch" class="btn btn-success input-group-addon" id="search-addon">Search</span>
      </div>
    </div>

    <div class="row" v-show="multiSearchResults.actors">
      <app-actorsummary
        :key="actor.id"
        :actor="actor"
        v-for="actor in multiSearchResults.actors">
        <!--<strong slot="actorName" slot-scope="props" class="slot-class">SLOT: {{props.text.toUpperCase()}}</strong>-->
        <!--<p slot="knownFor" class="known-for">This is actor is known for some things</p>-->
      </app-actorsummary>
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

  export default {
    data() {
      return {
        multiSearchText: ''
      }
    },
    components: {
      'app-movieimage-subtitle': MovieImageSubTitle,
      'app-actorsummary': ActorSummary
    },
    methods: {
      ...mapActions({
        loadNowPlaying: 'movies/loadNowPlaying',
        multiSearch: 'movies/multiSearch',
        setSelectedMedia: 'movies/setSelectedMedia'
      }),
      performMultiSearch() {
        if (this.multiSearchText) {
          this.multiSearch(this.multiSearchText)
        }
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
</style>
