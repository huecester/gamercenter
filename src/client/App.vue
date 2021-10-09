<script>
import Heading from './components/Heading.vue';
import Navbar from './components/Navbar.vue';

import normalize from 'normalize.css/normalize.css';

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

	<router-view v-slot="{ Component }">
		<transition name="slide" mode="out-in">
			<component :is="Component" />
		</transition>
	</router-view>
</template>

<style lang="sass">
html
	font-family: $font-stack
	background-color: $bg-dark
	color: white
	margin: 0 1rem

a
	color: $fg-light

article
	background-color: $bg-medium
	border: 1px solid $bg-light
	margin: 1rem 0
	padding: 1rem
	& > :first-child
		margin-top: 0
	& > :last-child
		margin-bottom: 0

// Slide animation
.slide-enter-from
	transform: translateX(100%)

.slide-leave-to
	transform: translateX(-100%)

.slide-enter-active,
.slide-leave-active
	transition: transform 0.25s ease
</style>
