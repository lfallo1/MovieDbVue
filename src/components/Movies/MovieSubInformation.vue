<template>
  <span>

    <div id="movie-title-status">
      <h4 id="movie-title">{{movie.original_title || movie.original_name}} ({{movie.release_date || movie.first_air_date}})</h4>&nbsp;
      <span id="movie-status" class="text-warning" v-if="movie.status != 'Released'">{{movie.status}}</span>
    </div>

    <span v-for="n in Math.round(movie.vote_average) || 0" class="stars-filled glyphicon glyphicon-star"></span>
    <span class="stars-empty-container">
        <span v-for="n in 10-(Math.round(movie.vote_average || 0))"
              class="stars-empty glyphicon glyphicon-star-empty"></span>
    </span> <i>({{movie.vote_average}})</i>
    <div v-if="movie.media_type == 'movie'">
      <small>
        <a target="_blank"
           :href="'http://www.imdb.com/title/' + movie.imdb_id">http://www.imdb.com/title/{{movie.imdb_id}}</a>
      </small>
    </div>
    <div v-if="movie.media_type=='tv'">
      <small><a :href="movie.homepage" target="_blank">Homepage</a></small>
      <br>
      <strong>Seasons | </strong><small>{{movie.number_of_seasons}} (Episodes {{movie.number_of_episodes}})</small>
      <br>
      <strong>Networks | </strong><small>{{networks}}</small>
    </div>
    <div v-show="movie.production_companies.length > 0">
      <strong>Companies | </strong>
      <small v-for="company in movie.production_companies">
        <span class="underline clickable">{{company.name}}</span>&nbsp;
      </small>
    </div>
    <div>
      <strong>Overview | </strong><small>{{movie.overview}}</small>
      <span v-show="movie.runtime">
        <br>
        <strong>Runtime | </strong><small>{{Math.floor(movie.runtime / 60)}}:{{twoDigits(movie.runtime % 60)}}</small>
      </span>
    </div>
    <div>
      <strong>Revenue | </strong><small>{{toCurrency(movie.revenue)}}</small>
    </div>
  </span>
</template>

<script>

  import StringUtil from '../../data/string_util'

  export default {
    props: ['movie'],
    methods: {
      twoDigits(val) {
        return StringUtil.formatTwoDecimals(val);
      },
      toCurrency(val) {
        return StringUtil.toCurrency(val);
      }
    },
    computed: {
      networks() {
        if (this.movie.networks) {
          return this.movie.networks.map(n => n.name.toString()).toString()
        }
        return "";
      }
    }
  }
</script>

<style>
  .selected-movie-info .stars-filled {
    color: #0275d8;
  }

  .selected-movie-info .stars-empty-container {
    margin-left: -4px;
  }

  .underline {
    text-decoration: underline;
  }

  #movie-title {
    display: inline
  }

  #movie-title-status {
    margin-bottom: 8px;
  }
</style>
