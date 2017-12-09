<template>
  <div class="search-result-actor-wrapper col-md-3">
    <div class="actor-name">{{actor.name}}</div>
    <div class="search-result-actor-img">
      <img v-if="actor.profile_path" :src="'https://image.tmdb.org/t/p/original/' + actor.profile_path"
           height="75px"/>
      <img v-else :src="'http://shackmanlab.org/wp-content/uploads/2013/07/person-placeholder.jpg'" height="75px"/>
    </div>
    <div class="known-for-wrapper">
      <div class="known-for-movie" v-for="media in actor.known_for">
        <img :src="'https://image.tmdb.org/t/p/original/' + media.poster_path" width="45px"/>
      </div>
    </div>
  </div>
</template>
<script>

  import {mapActions} from 'vuex';

  export default {
    props: ['actor']
  }

</script>

<style>

  .search-result-actor-wrapper {
    background: black;
    padding: 10px;
  }

  .actor-name {
    font-size: 16px;
    font-weight: normal;
    color: #666;
    font-family: sans-serif;
  }

  .search-result-actor-wrapper {
    text-align: center;
  }

  .search-result-actor-img {
    margin-bottom: 5px;
  }

  .known-for-movie {
    display: inline;
    margin-left: 8px;
  }

  .search-result-actor-wrapper {
    margin-bottom: 75px;
  }

  .search-result-actor-img img {
    height: 225px !important;
    max-width: 150px;
  }
</style>
