<script setup>
const props = defineProps({
	to: String,
});
</script>

<template>
	<li>
		<NuxtLink :to="to">
			<slot />
		</NuxtLink>
	</li>
</template>

<style scoped lang="scss">
a {
	display: block;
	padding: 0.5rem 1rem;
	color: inherit;
	font-style: bold;
	font-size: 1.1rem;
	text-decoration: none;
	transition: background-color 0.05s;
	&:hover {
		background-color: $fg-medium;
	}
	&:active {
		background-color: $fg-dark;
	}
}

.nuxt-link-exact-active {
	background-color: $fg-medium;
}
</style>
