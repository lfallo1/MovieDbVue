<template>
  <div class="search-result-movie-wrapper">
    <img v-if="movie.poster_path"
         @click="showMovieDetails"
         :src="'https://image.tmdb.org/t/p/original/' + movie.poster_path"/>
    <div class="no-image-available" v-else>No image available</div>
    <slot name="additionalDetails"></slot>
  </div>
</template>
<script>

  import {mapActions} from 'vuex';
  import {router} from '../../main.js';

  export default {
    props: ['movie', 'handler'],
    methods: {
      ...mapActions({
        selectMovieById: 'movies/selectMovieById',
        selectTvShowById: 'movies/selectTvShowById'
      }),
      showMovieDetails() {
        if (this.handler) {
          this.handler(this.movie);
        } else {
          if (this.movie.original_title) {
            this.selectMovieById(this.movie.id).then(() => {
              router.push(`tvmovie-details?type=movie&id=${this.movie.id}`)
            });
          } else {
            this.selectTvShowById(this.movie.id).then(() => {
              router.push(`tvmovie-details?type=tv&id=${this.movie.id}`)
            });
          }
        }
      }
    }
  }
</script>

<style scoped>
  div {
    margin-bottom: 5px;
  }

  img, .no-image-available {
    width: 260px;
    height: 400px;
  }

  .search-result-movie-wrapper img:hover {
    cursor: pointer;
    opacity: 0.8;
  }

</style>
