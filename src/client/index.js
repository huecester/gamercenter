import { createApp } from 'vue';
import { createStore } from 'vuex';
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';

// Main app
import App from './App.vue'

// Routes
const Home = () => import('./components/Home.vue');
const About = () => import('./components/About.vue');
const Games = () => import('./components/Games.vue');
const Bots = () => import('./components/Bots.vue');

const Battlesnake = () => import('./components/games/Battlesnake.vue');
const BattlesnakeRooms = () => import('./components/games/BattlesnakeRooms.vue');
const BattlesnakeGame = () => import('./components/games/BattlesnakeGame.vue');

const routes = [
	{ path: '/',  component: Home },
	{ path: '/about', component: About },
	{ path: '/games', component: Games, },
	{
		path: '/games/battlesnake',
		component: Battlesnake,
		children: [
			{
				path: '',
				component: BattlesnakeRooms,
			},
			{
				path: ':id',
				component: BattlesnakeGame,
			},
		],
	},
	{ path: '/bots', component: Bots },
];

// Initalize store
const store = createStore({
	state() {
		return {
			posts: [],
			games: [
				{
					title: 'Battlesnake',
					description: 'Snake battle arena. Fight your friends, or strangers, or little children, for glory.',
					thumbnail: '/static/images/battlesnake.jpg',
					link: '/games/battlesnake',
				},
			],
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

// Initialize router
const router = createRouter({
	history: createWebHistory(),
	routes,
});


// Initialize app
const app = createApp(App);
app.use(store);
app.use(router);

app.mount('#app');
