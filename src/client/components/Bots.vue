<script>
import BotItem from './BotItem.vue';

export default {
	components: {
		BotItem,
	},
	async created() {
		if (this.$store.state.bots.length <= 0) {
			try {
				const data = await fetch('/api/bots');
				const bots = await data.json();
				this.$store.commit('setBots', bots);
			} catch (err) {
				console.error(err);
			};
		};
	},
};
</script>

<template>
	<h1>Bots</h1>
	<BotItem
			v-for="bot in this.$store.state.bots"
			:key="bot.id"
			:name="bot.name"
			:description="bot.description"
			:link="bot.link"
			/>
</template>

<style scoped lang="sass">
</style>
