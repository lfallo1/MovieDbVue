<template>
  <div>
    <img @click="selectMovieById(movie.id)" :src="'https://image.tmdb.org/t/p/original/' + movie.poster_path"
         width="80px"/>
    <span class="image-sub-title">{{movie.title}} ({{movie.release_date}})</span>
  </div>
</template>
<script>

  import {mapActions} from 'vuex';

  export default {
    props: ['movie'],
    methods: {
      ...mapActions({
        selectMovieById : 'movies/selectMovieById'
      })
    }
  }
</script>
