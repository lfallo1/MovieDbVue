<template>
  <modal name="selected-image-modal" height="auto" :scrollable="true" @before-open="beforeOpen">
    <img :src="'https://image.tmdb.org/t/p/original/' + image">
  </modal>
</template>

<script>
  export default {
    data() {
      return {
        image: ''
      }
    },
    methods: {
      beforeOpen(event) {
        this.image = event.params.image
      }
    }
  }
</script>
