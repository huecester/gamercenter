<script>
import Heading from './components/Heading.vue';
import Navbar from './components/Navbar.vue';

import normalize from '../node_modules/normalize.css/normalize.css';

export default {
	components: {
		Heading,
		Navbar,
	},
	data() {
		return {
			navItems: [
				{ title: 'Home', path: '/' },
				{ title: 'About', path: '/about' },
				{ title: 'Games', path: '/games' },
				{ title: 'Bots', path: '/bots' },
			],
		};
	},
};
</script>

<template>
	<Heading logoPath='/images/logo-white-200px.png' />

	<Navbar
			:nav-items="navItems"
			/>

	<main>
		<router-view />
	</main>
</template>

<style lang="sass">
html
	font-family: $font-stack
	background-color: $bg-dark
	color: white
	margin: 0 1rem

a
	color: $fg-light
</style>
