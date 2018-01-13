<template>
  <div class="search-result-actor-wrapper">
    <slot name="actorName" :text="actor.name">
      <div class="actor-name">{{actor.name}}</div>
    </slot>
    <div @click="viewDetails()" class="search-result-actor-img">
      <img v-if="actor.profile_path" :src="'https://image.tmdb.org/t/p/w300/' + actor.profile_path"
           height="75px"/>
      <img v-else :src="'http://shackmanlab.org/wp-content/uploads/2013/07/person-placeholder.jpg'" height="75px"/>
    </div>
    <div class="known-for-wrapper">
      <slot name="knownFor">
        <div class="known-for-movie" v-for="media in actor.known_for">
          <img :src="'https://image.tmdb.org/t/p/original/' + media.poster_path" width="45px"/>
        </div>
      </slot>
    </div>
  </div>
</template>
<script>

  import {mapActions} from 'vuex';
  import {router} from '../../main.js';

  export default {
    props: ['actor'],
    methods: {
      ...mapActions({
        setSelectedMedia: 'movies/setSelectedMedia',
        advancedSearch: 'movies/advancedSearch',
        setAdvancedSearchOptions: 'movies/setAdvancedSearchOptions',
        resetAdvancedSearch: 'movies/resetAdvancedSearch',
        setAdvancedSearchMode: 'movies/setAdvancedSearchMode'
      }),
      viewDetails() {
        router.push(`actor-details?id=${this.actor.id}`);
      }
    }
  }

</script>

<style>

  .search-result-actor-wrapper {
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

  .search-result-actor-img img {
    height: 400px;
    width: 260px;
  }

  .search-result-actor-img img {
    border-radius: 8px;
  }

  .search-result-actor-img:hover {
    opacity: 0.7;
    cursor: pointer;
  }

</style>
