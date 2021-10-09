<script>
import GamesItem from './GamesItem.vue';

export default {
	components: {
		GamesItem,
	},
};
</script>

<template>
	<main>
		<h1>Games</h1>
		<GamesItem
				v-for="(game, index) in this.$store.state.games"
				:key="index"
				:title="game.title"
				:description="game.description"
				:thumbnail="game.thumbnail"
				:link="game.link"
				/>
	</main>
</template>

<style scoped lang="sass">
</style>
