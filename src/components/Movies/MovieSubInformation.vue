<template>
  <span>
    <h4>{{movie.original_title || movie.original_name}} ({{movie.release_date || movie.first_air_date}})</h4>&nbsp;
    <small>
      <a target="_blank" :href="'http://www.imdb.com/title/' + movie.imdb_id">http://www.imdb.com/title/{{movie.imdb_id}}</a>
    </small>
    <br>
    <span v-for="n in Math.round(movie.vote_average) || 0" class="stars-filled glyphicon glyphicon-star"></span>
    <span class="stars-empty-container">
                <span v-for="n in 10-(Math.round(movie.vote_average || 0))"
                      class="stars-empty glyphicon glyphicon-star-empty"></span>
        </span> <i>({{movie.vote_average}})</i>
    <br>
    <strong>Companies | </strong>
    <small v-for="company in movie.production_companies">
      <span class="underline clickable">{{company.name}}</span>&nbsp;
    </small>
    <br>
    <strong>Overview | </strong><small>{{movie.overview}}</small>
    <span v-show="movie.runtime">
      <br>
      <strong>Runtime | </strong><small>{{Math.floor(movie.runtime / 60)}}:{{twoDigits(movie.runtime % 60)}}</small>
    </span>
    <br>
    <strong>Revenue | </strong><small>{{toCurrency(movie.revenue)}}</small>
    <br>
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
</style>
