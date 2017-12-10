<template>
  <div>
    <div id="search-options">
      <form>
        <div class="form-row">
          <div class="form-group col-md-2">
            <label>Vote Count Min</label>
            <app-vueslider :max="1000" tooltip-dir="bottom" ref="vote_count_gte"
                           v-model="searchOptions.vote_count_gte"></app-vueslider>
          </div>
          <div class="form-group col-md-2">
            <label>Grade Min</label>
            <app-vueslider :max="10" tooltip-dir="bottom" :interval="0.1" ref="vote_average_gte"
                           v-model="searchOptions.vote_average_gte"></app-vueslider>
          </div>
          <div class="form-group col-md-2">
            <label>Release Date Min</label>
            <app-datepicker :clear-button="true"
                            v-model="searchOptions.release_date_gte"
                            :minimumView="'day'"
                            :maximumView="'month'"
                            :initialView="'month'"></app-datepicker>
          </div>
          <div class="form-group col-md-2">
            <label>Release Date Max</label>
            <app-datepicker :clear-button="true" v-model="searchOptions.release_date_Lte" :minimumView="'day'"
                            :maximumView="'month'"
                            :initialView="'month'"></app-datepicker>
          </div>
          <div class="form-group col-md-2">
            <label>With genres</label>
            <app-multiselect v-model="searchOptions.withGenres"
                             :close-on-select="false"
                             :options="genres"
                             :multiple="true"
                             track-by="id"
                             select-label=""
                             deselect-label=""
                             :custom-label="genresLabel"></app-multiselect>
          </div>
          <div class="form-group col-md-2">
            <label>Sort</label>
            <app-multiselect v-model="searchOptions.sort_by"
                             :close-on-select="false"
                             :options="sortOptions"
                             :multiple="false"
                             track-by="value"
                             select-label=""
                             deselect-label=""
                             :custom-label="sortOptionsLabel"></app-multiselect>
          </div>
          <!--<div class="form-group col-md-2">-->
          <!--<label>Without genres</label>-->
          <!--<app-multiselect v-model="searchOptions.withoutGenres"-->
          <!--:options="options"> />-->
          <!--</div>-->
        </div>
      </form>
    </div>
  </div>
</template>

<script>

  import Datepicker from 'vuejs-datepicker';
  import vueSlider from 'vue-slider-component'
  import Multiselect from 'vue-multiselect'
  import moviesData from '../data/movies_data.js'

  /**
   *         sort_by: '',
   page: 1,
   primary_release_year: 0,
   release_date_gte: null,
   release_date_lte: null,
   vote_count_gte: 0,
   vote_count_lte: 0,
   vote_average_gte: 6.0,
   vote_average_lte: 0,
   with_cast: '',
   with_genres: '',
   without_genres: '',
   with_keywords: '',
   without_keywords: '',
   with_people: '',
   sort_by: 'vote_average.desc'
   */

  export default {
    components: {
      'app-datepicker': Datepicker,
      'app-vueslider': vueSlider,
      'app-multiselect': Multiselect
    },
    data() {
      return {
        searchOptions: {
          release_date_gte: new Date(new Date().getFullYear(), 0, 1)
        },
        genres: [],
        sortOptions: []
      }
    },
    methods: {
      genresLabel(option) {
        return option.name;
      },
      sortOptionsLabel(option) {
        const direction = option.direction ? 'desc' : 'asc';
        return `${option.display} ${direction}`;
      }
    },
    created() {
      this.genres = moviesData.genres;
      this.sortOptions = moviesData.sortOptions
    }
  }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
