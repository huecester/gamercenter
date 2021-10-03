<script>
export default {
	data() {
		return {
			posts: [],
		};
	},
	async created() {
		let posts = this.$store.posts;
		if (!posts) {
			try {
				const data = await fetch('/api/posts');
				posts = await data.json();
				this.$store.commit('setPosts', posts);
			} catch (err) {
				console.error(err);
			};
		};
		this.posts = posts;
	},
};
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
