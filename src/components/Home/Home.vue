<template>
  <div id="home">
    <h3>Home</h3>

    <div id="search-bar">
      <div class="input-group">
        <span>{{multiSearchText}}</span>
        <input v-model="multiSearchText" type="text" class="form-control"
               placeholder="Search movies, actors, and tv shows" aria-describedby="search-addon">
        <span @click="performMultiSearch" class="btn btn-success input-group-addon" id="search-addon"><i
          class="material-icons">youtube_searched_for</i>Search</span>
      </div>
    </div>

    <div>


      <ul class="list-group" v-for="result in multiSearchResults.movies">
        <li class="list-group-item">
          <app-movieimage-subtitle :movie="result"></app-movieimage-subtitle>
        </li>
      </ul>

      <table class="table">
        <tbody>
        <tr v-for="result in multiSearchResults.actors">
          <td><img v-if="result.profile_path" :src="'https://image.tmdb.org/t/p/original/' + result.profile_path" width="60px"/></td>
          <td>{{result.name}}</td>
          <td>
            <div v-for="item in result.known_for">
              {{item.original_title}}
            </div>
          </td>
        </tr>
        </tbody>
      </table>

      <div v-for="result in multiSearchResults.tvShows">
        <small>TV Show name: </small>
        <strong>{{result.original_name}}</strong>
        <img :src="'https://image.tmdb.org/t/p/original/' + result.poster_path" width="100px"/>
      </div>

    </div>

    <div id="now-playing-wrapper">
      <h4>Now Playing</h4>
      <ul id="now-playing" class="list-group list-group-horizontal">
        <li class="list-group-item" v-for="movie in nowPlayingMovies">
          <app-movieimage-subtitle :movie="movie"></app-movieimage-subtitle>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>

  import {mapState, mapActions} from 'vuex';
  import MovieImageSubTitle from '../Movies/MovieImageSubTitle.vue'

  export default {
    data() {
      return {
        multiSearchText: ''
      }
    },
    components: {
      'app-movieimage-subtitle': MovieImageSubTitle
    },
    methods: {
      ...mapActions({
        loadNowPlaying: 'movies/loadNowPlaying',
        multiSearch: 'movies/multiSearch'
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
        multiSearchResults: state => state.movies.multiSearchResults
      })
    },
    created() {
      this.loadNowPlaying();
    }
  }
</script>

<style scoped>
  #now-playing li {
    width: 120px;
    text-align: center;
  }

  #now-playing .image-sub-title {
    display: block;
    color: #888;
    font-weight: bold;
  }
</style>
