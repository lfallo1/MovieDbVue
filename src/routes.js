import Home from './components/Home/Home.vue'
import Login from './components/Login/Login.vue'
import PageNotFound from './components/Errors/PageNotFound.vue';

export default [
    {path: '/', component: Home},
    {
        path: '/login',
        component: Login,
    },
    {path: '*', component: PageNotFound}
]
