import { createApp } from 'vue';
import { createStore } from 'vuex';
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';

// Main app
import App from './App.vue'

// Routes
import Home from './components/Home.vue';
import About from './components/About.vue';
import Games from './components/Games.vue';
import Bots from './components/Bots.vue';

const routes = [
	{ path: '/',  component: Home },
	{ path: '/about', component: About },
	{ path: '/games', component: Games },
	{ path: '/bots', component: Bots },
];

// Initalize app
const store = createStore({
	state() {
		return {
			posts: [],
			bots: [],
		};
	},
	mutations: {
		setPosts(state, newPosts) {
			state.posts = newPosts;
		},
		setBots(state, newBots) {
			state.bots = newBots;
		},
	},
});

const router = createRouter({
	history: createWebHistory(),
	routes,
});


const app = createApp(App);
app.use(store);
app.use(router);

app.mount('#app');
