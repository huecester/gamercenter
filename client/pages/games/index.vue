<script setup>
import { ref } from '@nuxtjs/composition-api';
import battlesnake from '@/assets/images/battlesnake.png';

const games = ref([
	{
		title: 'Battlesnake',
		image: {
			src: battlesnake,
			width: 1010,
			height: 1011,
			resize: 0.25,
		},
		description: 'It\'s back baby. The better snake. Battle it out with friends for that last bagel bite, who has to take out the trash, or whatever I don\'t care. It\'s time to epic.',
		link: '/games/battlesnake'
	}
]);
</script>

<template>
	<main>
		<h1>Games</h1>
		<NuxtLink
				v-for="game in games"
				:to="game.link"
				:key="game.title"
				class="delink"
				>
				<article>
					<h2>{{ game.title }}</h2>
					<img
							:src="game.image.src"
							:width="game.image.width * (game.image.resize || 1)"
							:height="game.image.height * (game.image.resize || 1)"
							/>
					<p>{{ game.description }}</p>
				</article>
		</NuxtLink>
	</main>
</template>
