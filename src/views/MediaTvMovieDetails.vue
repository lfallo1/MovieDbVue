<template>
  <div>
    <app-movie-full-details/>
  </div>
</template>
<script>

  import {mapState} from 'vuex';
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
    mounted() {
      if (!this.selectedMovie) {
        router.push('/');
        return;
      }
    }
  }
</script>
