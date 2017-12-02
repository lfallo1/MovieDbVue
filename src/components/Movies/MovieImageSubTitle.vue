<template>
    <div>
        <img :src="'https://image.tmdb.org/t/p/original/' + movie.poster_path"
             width="80px"/>
        <span class="image-sub-title">{{movie.title}} ({{movie.release_date}})</span>
    </div>
</template>
<script>
    export default {
        props: ['movie']
    }
</script>