<script>
import BotsItem from './BotsItem.vue';

export default {
	components: {
		BotsItem,
	},
	async created() {
		if (this.$store.state.bots.length <= 0) {
			try {
				const data = await fetch('/api/bots');
				const bots = await data.json();
				this.$store.commit('setBots', bots);
			} catch (err) {
				this.$store.commit('notify', { level: 'error', message: 'Could not fetch data.' });
			};
		};
	},
};
</script>

<template>
	<main>
		<h1>Bots</h1>
		<BotsItem
				v-for="bot in this.$store.state.bots"
				:key="bot.id"
				:name="bot.name"
				:description="bot.description"
				:link="bot.link"
				/>
	</main>
</template>

<style scoped lang="sass">
</style>
