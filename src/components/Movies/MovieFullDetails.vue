<template>
  <div class="well well-sm" v-if="movie.id" id="full-movie-details" ref="fullDetails">
    <div class="row">
      <div class="col-md-3">
        <img :src="'https://image.tmdb.org/t/p/original/' + movie.poster_path"
             width="200px">
      </div>
      <div class="selected-movie-info col-md-9">
        <app-movie-sub-information :movie="movie"/>
        <strong>Cast</strong><br>
        <div v-for="actor in visibleActors">
          <span class="clickable" @click="viewDetails(actor)">{{actor.name}} <small>({{actor.character}})</small></span>
          <br>
        </div>
        <br>
        <span v-if="movie.actors.length > 7">
          <span v-if="actorsCollapsed" class="clickable" @click="actorsCollapsed=false">View more</span>
          <span v-else class="clickable" @click="actorsCollapsed=true">View less</span>
        </span>
      </div>
    </div>
    <div class="related-movies scrollable-row"
         v-if="movie.similar && movie.similar.results && movie.similar.results.length > 0">
      <h4>Similar</h4>
      <div v-for="similarMovie in movie.similar.results">
        <img :src="'https://image.tmdb.org/t/p/original/' + similarMovie.poster_path"
             width="100px" @click="selectMovie(similarMovie)">
        <br>
        <div class="related-movie-details text-center">
          <span class="related-movie-rating">{{similarMovie.vote_average}}</span>
        </div>
      </div>
      <div v-if="!movie.similar.finished" class="clickable" @click="viewMoreSimilar(movie)">View more</div>
    </div>
    <div class="related-movies scrollable-row"
         v-if="movie.recommendations && movie.recommendations.results && movie.recommendations.results.length > 0">
      <h4>Recommended</h4>
      <div v-for="movieRecommendation in movie.recommendations.results">
        <img :src="'https://image.tmdb.org/t/p/original/' + movieRecommendation.poster_path"
             width="100px" @click="selectMovie(movieRecommendation)">
        <br>
        <div class="related-movie-details text-center">
          <span class="related-movie-rating">{{movieRecommendation.vote_average}}</span>
        </div>
      </div>
      <div v-if="!movie.recommendations.finished" class="clickable" @click="viewMoreRecommended(movie)">View more
      </div>
    </div>
  </div>
</template>
<script>

  import MovieSubInformation from './MovieSubInformation.vue'
  import StringUtil from '../../data/string_util.js'
  import {mapActions, mapState} from 'vuex'
  import {router} from '../../main.js'

  export default {
    props: ['handler'],
    components: {
      'app-movie-sub-information': MovieSubInformation
    },
    data() {
      return {
        actorsCollapsed: true
      }
    },
    methods: {
      ...mapActions({
        advancedSearch: 'movies/advancedSearch',
        setAdvancedSearchOptions: 'movies/setAdvancedSearchOptions',
        resetAdvancedSearch: 'movies/resetAdvancedSearch',
        setAdvancedSearchMode: 'movies/setAdvancedSearchMode',
        selectMovieById: 'movies/selectMovieById',
        selectTvShowById: 'movies/selectTvShowById',
        viewMoreRecommended: 'movies/viewMoreRecommended',
        viewMoreSimilar: 'movies/viewMoreSimilar',
        setSelectedMedia: 'movies/setSelectedMedia'
      }),
      viewDetails(actor) {
        router.push(`actor-details?id=${actor.id}`)
      },
      selectMovie(movie) {
        if (this.handler) {
          movie.media_type = movie.original_title ? 'movie' : 'tv';
          this.handler(movie);
        } else {

          if (movie.original_title) {
            this.selectMovieById(movie.id).then(() => {
              router.push(`tvmovie-details?type=movie&id=${this.movie.id}`)
            });
          } else {
            this.selectTvShowById(movie.id).then(() => {
              router.push(`tvmovie-details?type=tv&id=${this.movie.id}`)
            });
          }
        }
      }
    },
    computed: {
      ...mapState({
        movie: state => state.movies.selectedMovie
      }),
      visibleActors() {
        return this.actorsCollapsed ? this.movie.actors.slice(0, 7) : this.movie.actors;
      }
    },
    updated() {
      if (this.$refs.fullDetails) {
        let vm = this;
        vm.$scrollTo(vm.$refs.fullDetails, 250, {
          easing: 'ease-in'
        });
      }
    }
  }
</script>
<style scoped>

  .clickable:hover {
    cursor: pointer;
    opacity: 0.7;
  }

  .related-movies div {
    display: inline-block !important;
  }

  .related-movies img:hover {
    cursor: pointer;
    opacity: 0.8;
  }

  .related-movies {
    text-align: center;
    font-weight: bold;
  }
</style>
