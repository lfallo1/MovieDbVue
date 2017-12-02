import Home from './components/Home/Home.vue'
import Login from './components/Login/Login.vue'
import About from './components/About/About.vue'
import Contact from './components/Contact/Contact.vue'
import Support from './components/Support/Support.vue'
import PageNotFound from './components/Errors/PageNotFound.vue';

export default [
    {path: '/', component: Home},
    {
        path: '/login',
        component: Login,
    },
    {path: '/about', component: About},
    {path: '/contact', component: Contact},
    {path: '/support', component: Support},
    {path: '*', component: PageNotFound}
]