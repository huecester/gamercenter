<script>
export default {
	data() {
		return {
			posts: [],
		};
	},
	async created() {
		try {
			const data = await fetch('/api/posts');
			this.posts = await data.json();
		} catch (err) {
			console.error(err);
		}
	},
};
// TOOD: get content from database
</script>

<template>
	<h1>Hello, world!</h1>
	<article
			v-for="post in posts"
			:key="post.id"
			>
			<h2>{{ post.title }}</h2>
			<p>{{ post.content }}</p>
	</article>
</template>

<style scoped lang="sass">
</style>
