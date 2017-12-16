<template>
  <main>
    <h4>{{selectedMedia.name}}</h4>
    <img class="clickable" @click="showImageModal()"
         :src="'https://image.tmdb.org/t/p/original/' + selectedMedia.profile_path"
         width="200px">
    <br>
    <strong>Birth</strong>&nbsp;<small>{{selectedMedia.birthday}}, {{selectedMedia.place_of_birth}}</small>
    <br>
    <strong>BIO</strong>
    <small>{{selectedMedia.biography}}</small>
    <br>
    <strong>IMDB</strong>&nbsp;<small><a target="_blank" :href="'http://www.imdb.com/name/' + selectedMedia.imdb_id">http://www.imdb.com/name/{{selectedMedia.imdb_id}}</a>
  </small>
    <br>
    <div class="row">
      <div class="col-md-3">
        <main v-show="advancedSearchResults.length > 0">
          <strong>Popular movies</strong><br>
          <div v-for="result in advancedSearchResults">
            <div class="clickable" @click="selectMovieById(result.id)">{{result.original_title}} ({{result.vote_average}})</div>
          </div>
        </main>
      </div>
      <div class="col-md-9">
        <app-movie-details :movie="selectedMovie" />
      </div>
    </div>
    <selected-image-modal/>
  </main>
</template>

<script>

  import {mapState, mapActions} from 'vuex'
  import ImageModal from '../Modals/ImageModal.vue'
  import MovieDetails from './MovieDetails.vue'

  export default {
    components: {
      'selected-image-modal': ImageModal,
      'app-movie-details' : MovieDetails
    },
    computed: {
      ...mapState({
        advancedSearchResults: state => state.movies.advancedSearchResults,
        selectedMedia: state => state.movies.selectedMedia,
        selectedMovie: state => state.movies.selectedMovie
      })
    },
    methods: {
      ...mapActions({
        selectMovieById: 'movies/selectMovieById'
      }),
      showImageModal() {
        let image = this.selectedMedia.profile_path;
        this.$modal.show('selected-image-modal', {image: image});
      }
    }
  }
</script>

<style>

  .clickable:hover {
    cursor: pointer;
    opacity: 0.7;
  }

</style>
