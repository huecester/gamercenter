<script setup>
import { useAsync, useContext, ref } from '@nuxtjs/composition-api';
const formatDate = dateString => {
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	const date = new Date(dateString);
	return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}
const { $http, store } = useContext();

const error = ref(false);
if (store.state.cache.posts.length <= 0) {
	$http.$get('/api/posts')
		.then(newPosts => {
			store.commit('cache/setPosts', newPosts.reverse());
		})
		.catch(err => {
			error.value = true;
			store.commit('notifications/add', { level: 'error', msg: 'Couldn\'t reach server.' });
		});
}
</script>

<template>
	<main>
		<h1>gamercenter</h1>
		<Loading
				:condition="store.state.cache.posts.length > 0"
				:error="error"
				>
				<article
						v-for="post in store.state.cache.posts"
						:key="post.id"
						>
						<h2>{{ post.title }} <time :datetime="post.creation">{{ formatDate(post.creation) }}</time></h2>
						<p>{{ post.content }}</p>
				</article>
		</Loading>
	</main>
</template>

<style scoped lang="scss">
time {
	font-size: 0.75rem;
	font-weight: initial;
	font-style: italic;
}
</style>
