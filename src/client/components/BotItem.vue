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
	<article>
		<h2>{{ name }}</h2>
		<p>{{ description }}</p>
		<a :href="link">Invite "{{ name }}"</a>
	</article>
</template>

<style scoped lang="sass">
</style>
