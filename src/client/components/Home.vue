<script>
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default {
	methods: {
		formatDate(dateString) {
			const date = new Date(dateString);
			return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
		}
	},
	async created() {
		if (this.$store.state.posts.length <= 0) {
			try {
				const data = await fetch('/api/posts');
				const posts = await data.json();
				this.$store.commit('setPosts', posts);
			} catch (err) {
				this.$store.commit('notify', { level: 'error', message: 'Could not reach server.' });
				console.error(err);
			};
		};
	},
};
</script>

<template>
	<main>
		<h1>gamercenter</h1>
		<article
				v-for="post in this.$store.state.posts"
				:key="post.id"
				>
				<h2>{{ post.title }} <time :datetime="post.creation">{{ formatDate(post.creation) }}</time></h2>
				<p>{{ post.content }}</p>
		</article>
	</main>
</template>

<style scoped lang="sass">
time
	font-size: 0.75rem
	font-weight: initial
	font-style: italic
</style>
