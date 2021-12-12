<script setup>
import { useAsync, useContext, ref } from '@nuxtjs/composition-api';
const { $http, store } = useContext();

const error = ref(false);
if (store.state.cache.bots.length <= 0) {
	$http.$get('/api/bots')
		.then(newBots => {
			store.commit('cache/setBots', newBots);
		})
		.catch(err => {
			error.value = true;
			store.commit('notifications/error', 'Failed to reach server.');
		});
}
</script>

<template>
	<main>
		<h1>Bots</h1>
		<Loading
				:condition="store.state.cache.bots.length > 0"
				:error="error"
				>
				<a
						v-for="bot in store.state.cache.bots"
						:href="bot.link"
						>
						<article
								class="clickable"
								:key="bot.id"
								>
								<h2>{{ bot.name }}</h2>
								<p>{{ bot.description }}</p>
						</article>
				</a>
		</Loading>
	</main>
</template>

<style scoped lang="scss">
a {
	color: inherit;
	text-decoration: none;
}
</style>
