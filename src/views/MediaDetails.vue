<template>
  <div>
    <div v-if="selectedMedia.media_type=='person'">
      <app-actor-details/>
    </div>
  </div>
</template>
<script>

  import {mapState, mapActions} from 'vuex';
  import {router} from '../main.js';
  import ActorDetails from '../components/Movies/ActorDetails.vue';

  export default {
    components: {
      'app-actor-details': ActorDetails
    },
    computed: {
      ...mapState({
        selectedMedia: state => state.movies.selectedMedia
      })
    },
    methods: {
      ...mapActions({
        advancedSearch: 'movies/advancedSearch',
        setAdvancedSearchOptions: 'movies/setAdvancedSearchOptions',
        resetAdvancedSearch: 'movies/resetAdvancedSearch'
      })
    },
    mounted() {
      if (!this.selectedMedia) {
        router.push('/');
        return;
      }

      if (this.selectedMedia.media_type == 'person') {
        this.resetAdvancedSearch();
        this.setAdvancedSearchOptions({'with_people': this.selectedMedia.id});
        this.advancedSearch();
      }
    }
  }
</script>
