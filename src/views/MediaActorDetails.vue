<template>
  <div>
    <app-actor-details/>
  </div>
</template>
<script>

  import {mapState, mapActions} from 'vuex';
  import {router} from '../main.js';
  import ActorDetails from '../components/Movies/ActorDetails.vue';

  export default {
    components: {
      'app-actor-details': ActorDetails,
    },
    methods: {
      ...mapActions({
        setSelectedMedia: 'movies/setSelectedMedia'
      })
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
    },
    watch: {
      $route(to, from) {
        this.setSelectedMedia(to.query.id);
      }
    }
  }
</script>
