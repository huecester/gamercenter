<script>
export default {
	props: {
		to: String,
	},
};
</script>

<template>
	<li>
		<router-link
			:to="to"
			>
			<slot />
		</router-link>
	</li>
</template>

<style scoped lang="sass">
a
	display: block
	padding: 0.5rem 1rem
	color: inherit
	font-style: bold
	font-size: 1.1rem
	text-decoration: none
	transition: background-color 0.05s

	&:hover
		background-color: $fg-medium
	&:active
		background-color: $fg-dark
</style>
