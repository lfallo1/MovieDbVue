<template>
  <modal name="selected-media-modal" height="auto" :scrollable="true" @before-open="beforeOpen">
    <img :src="'https://image.tmdb.org/t/p/original/' + selectedMedia.poster_path">
  </modal>
</template>

<script>
  export default {
    data() {
      return {
        selectedMedia: {}
      }
    },
    methods: {
      beforeOpen(event) {
        this.selectedMedia = event.params.selectedMedia
      }
    }
  }
</script>
