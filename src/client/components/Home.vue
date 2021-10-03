<script>
export default {
	async created() {
		if (this.$store.state.posts.length <= 0) {
			try {
				const data = await fetch('/api/posts');
				const posts = await data.json();
				this.$store.commit('setPosts', posts);
			} catch (err) {
				console.error(err);
			};
		};
	},
};
</script>

<template>
	<h1>Hello, world!</h1>
	<article
			v-for="post in this.$store.state.posts"
			:key="post.id"
			>
			<h2>{{ post.title }}</h2>
			<p>{{ post.content }}</p>
	</article>
</template>

<style scoped lang="sass">
</style>
