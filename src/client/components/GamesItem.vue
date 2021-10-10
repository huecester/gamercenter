<script>
export default {
	props: {
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		thumbnail: {
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
	<router-link :to="link">
		<article class="link">
			<h2>{{ title }}</h2>
			<p>{{ description }}</p>
			<img :src="thumbnail" />
		</article>
	</router-link>
</template>

<style scoped lang="sass">
a
	color: inherit
	text-decoration: inherit
</style>
