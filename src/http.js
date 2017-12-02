import axios from 'axios';
import store from './store/store.js';

// --- axios ---
export const HTTP = axios.create({
    baseURL: "https://api.themoviedb.org/3/"
});

HTTP.interceptors.request.use(function (config) {
    if (store.state.movies.usage.retryAfter && new Date() < store.state.movies.usage.retryAfter) {
        return Promise.reject('Request limit reached - please wait until ' + store.state.movies.usage.retryAfter);
    }
    return config;
})

HTTP.interceptors.response.use(function (response) {
    store.dispatch('movies/updateUsage', {
        remaining: Number(response.headers['x-ratelimit-remaining']),
        reset: new Date(Number(response.headers['x-ratelimit-reset']) * 1000),
        retryAfter: false
    });
    return {results: response.data.results}
}, function (error) {
    if (error.status === 429) {
        store.dispatch('movies/updateUsage', {
            remaining: 0,
            reset: new Date(),
            retryAfter: new Date(Number(err.headers['Retry-After']) * 1000)
        })
    }
    console.log(error);
    return Promise.reject(error);
});