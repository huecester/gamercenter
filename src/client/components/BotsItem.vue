<script>
export default {
	props: {
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		link: {
			type: String,
			required: true,
		},
	},
};
</script>

<template>
	<a :href="link">
		<article class="clickable">
			<h2>{{ name }}</h2>
			<p>{{ description }}</p>
		</article>
	</a>
</template>

<style scoped lang="sass">
a
	color: inherit
	text-decoration: inherit
</style>
