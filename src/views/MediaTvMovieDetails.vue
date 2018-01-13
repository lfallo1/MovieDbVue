<template>
  <div>
    <app-movie-full-details/>
  </div>
</template>
<script>

  import {mapState, mapActions} from 'vuex';
  import {router} from '../main.js';
  import MovieFullDetails from '../components/Movies/MovieFullDetails.vue';

  export default {
    components: {
      'app-movie-full-details': MovieFullDetails
    },
    computed: {
      ...mapState({
        selectedMovie: state => state.movies.selectedMovie
      })
    },
    methods: {
      ...mapActions({
        selectMovieById: 'movies/selectMovieById',
        selectTvShowById: 'movies/selectTvShowById'
      })
    },
    watch: {
      $route(to, from) {
        if (to.query.type == 'movie') {
          this.selectMovieById(to.query.id);
        } else if (to.query.type == 'tv') {
          this.selectTvShowById(to.query.id);
        }
      }
    }
  }
</script>
