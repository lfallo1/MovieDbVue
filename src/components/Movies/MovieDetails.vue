<template>
  <div class="well well-sm" v-if="movie.id">
    <div class="row">
      <div class="col-md-3">
        <img :src="'https://image.tmdb.org/t/p/original/' + movie.poster_path"
             width="200px">
      </div>
      <div class="selected-movie-info col-md-9">
        <h4>{{movie.original_title}} ({{movie.release_date}})</h4>&nbsp;
        <small>
          <a target="_blank" :href="'http://www.imdb.com/title/' + movie.imdb_id">http://www.imdb.com/title/{{movie.imdb_id}}</a>
        </small>
        <br>
        <span v-for="n in Math.round(movie.vote_average) || 0" class="stars-filled glyphicon glyphicon-star"></span>
        <span class="stars-empty-container">
                <span v-for="n in 10-(Math.round(movie.vote_average || 0))" class="stars-empty glyphicon glyphicon-star-empty"></span>
              </span>
        <br>
        <strong>Companies | </strong>
        <small v-for="company in movie.production_companies">
          <span class="underline clickable">{{company.name}}</span>&nbsp;
        </small>
        <br>
        <strong>Overview | </strong><small>{{movie.overview}}</small>
        <br>
        <strong>Runtime | </strong><small>{{Math.floor(movie.runtime / 60)}}:{{twoDigits(movie.runtime % 60)}}</small>
        <br>
        <strong>Revenue | </strong><small>{{toCurrency(movie.revenue)}}</small>
        <br>
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
  </div>
</template>
<script>

  import StringUtil from '../../data/string_util.js'
  import {mapActions} from 'vuex'
  import {router} from '../../main.js'

  export default{
    data(){
      return {
        actorsCollapsed : true
      }
    },
    props: ['movie'],
    methods: {
      ...mapActions({
        setSelectedMedia : 'movies/setSelectedMedia',
        advancedSearch: 'movies/advancedSearch',
        setAdvancedSearchOptions: 'movies/setAdvancedSearchOptions',
        resetAdvancedSearch: 'movies/resetAdvancedSearch'
      }),
      twoDigits(val){
        return StringUtil.formatTwoDecimals(val);
      },
      toCurrency(val){
        return StringUtil.toCurrency(val);
      },
      viewDetails(actor) {
        actor.media_type='person';
        this.setSelectedMedia(actor).then(() => {
          this.resetAdvancedSearch(true);
          this.setAdvancedSearchOptions({'with_people': actor.id});
          this.advancedSearch();
          router.push('details')
        });
      }
    },
    computed: {
      visibleActors(){
        return this.actorsCollapsed ? this.movie.actors.slice(0,7) : this.movie.actors;
      }
    }
  }
</script>
<style scoped>
  .selected-movie-info .stars-filled{
    color: #0275d8;
  }

  .selected-movie-info .stars-empty-container{
    margin-left: -4px;
  }

  .underline{
    text-decoration: underline;
  }

  .clickable:hover{
    cursor: pointer;
    opacity: 0.7;
  }
</style>
