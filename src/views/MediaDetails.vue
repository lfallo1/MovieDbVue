<template>
  <div>
    <div v-if="selectedMedia.media_type=='person'">
      <app-actor-details/>
    </div>
  </div>
</template>
<script>

  import {mapState} from 'vuex';
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
    mounted() {
      if (!this.selectedMedia) {
        router.push('/');
        return;
      }
    }
  }
</script>
