<script>
</script>

<template>
	<main>
		<h1>Battlesnake</h1>
		<router-view v-slot="{ Component }">
			<transition name="slide" mode="out-in">
				<component :is="Component" />
			</transition>
		</router-view>
	</main>
</template>

<style scoped lang="sass">
h1
	text-align: center
</style>
