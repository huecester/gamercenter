<script>
import BotItem from './BotItem.vue';

export default {
	components: {
		BotItem,
	},
	data() {
		return {
			bots: [],
		};
	},
	async created() {
		let bots = this.$store.bots;
		if (!bots) {
			try {
				const data = await fetch('/api/bots');
				bots = await data.json();
				this.$store.commit('setBots', bots);
			} catch (err) {
				console.error(err);
			};
		};
		this.bots = bots;
	},
};
</script>

<template>
	<h1>Bots</h1>
	<BotItem
			v-for="bot in bots"
			:key="bot.id"
			:name="bot.name"
			:description="bot.description"
			:link="bot.link"
			/>
</template>

<style scoped lang="sass">
</style>
