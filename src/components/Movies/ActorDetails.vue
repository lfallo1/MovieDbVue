<template>
  <main>
    <h4>{{selectedMedia.name}}</h4>
    <img class="media-image" @click="showImageModal()"
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
    <main v-show="advancedSearchResults.length > 0">
      <strong>Popular movies</strong><br>
      <div v-for="result in advancedSearchResults">
        <div>{{result.original_title}} {{result.release_date}} ({{result.vote_average}})</div>
      </div>
    </main>
    <selected-image-modal/>
  </main>
</template>

<script>

  import {mapState, mapActions} from 'vuex';
  import ImageModal from '../Modals/ImageModal.vue';

  export default {
    components: {
      'selected-image-modal': ImageModal
    },
    computed: {
      ...mapState({
        advancedSearchResults: state => state.movies.advancedSearchResults,
        selectedMedia: state => state.movies.selectedMedia
      })
    },
    methods: {
      showImageModal() {
        let image = '';
        if (this.selectedMedia.media_type == 'person') {
          image = this.selectedMedia.profile_path;
        } else {
          image = this.selectedMedia.poster_path;
        }
        this.$modal.show('selected-image-modal', {image: image});
      }
    }
  }
</script>

<style scoped>
  .media-image:hover {
    cursor: pointer;
    opacity: 0.7;
  }
</style>
