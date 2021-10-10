<script>
import Heading from './components/Heading.vue';
import Navbar from './components/Navbar.vue';
import Notifications from './components/Notifications.vue'

import 'normalize.css/normalize.css';

export default {
	components: {
		Heading,
		Navbar,
		Notifications,
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

	<Notifications />
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

button
	color: inherit
	border: none
	padding: 0.5rem
	margin: 0.5rem
	text-decoration: none
	background-color: $fg-medium
	font-family: inherit
	font-size: 1rem
	text-align: center
	cursor: pointer

	&:hover
		background-color: $fg-light
	&:active
		background-color: $fg-dark

input
	&[type=text], &[type=password]
		background-color: $bg-medium
		border: 1px solid $bg-light
		outline: 0
		color: inherit
		font-size: 0.75rem

	&:invalid
		outline: 1px solid $error-dk
		background-color: $error-lt
	&:focus
		outline: 1px solid $fg-medium


.row
	display: flex
	align-items: center

.clickable
	cursor: pointer
	&:hover
		filter: brightness(1.3)
	&:active
		filter: brightness(1.1)

// Transitions
$slide-offset: 4rem

// Slide
.slide-enter-from
	transform: translateX($slide-offset)
	opacity: 0
.slide-leave-to
	transform: translateX(calc(-1 * $slide-offset))
	opacity: 0
.slide-enter-active,
.slide-leave-active
	transition: transform 0.25s, opacity 0.25s

// Slide back
.slide-back-enter-from,
.slide-back-leave-to
	transform: translateX($slide-offset)
	opacity: 0
.notification
	transition: all 0.25s
.slide-back-leave-active
	position: absolute

// Fade in/out
.fade-enter-from,
.fade-leave-to
	opacity: 0
.fade-enter-active,
.fade-leave-active
	transition: opacity 0.25s
</style>
