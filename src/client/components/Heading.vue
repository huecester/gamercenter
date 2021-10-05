<script>
export default {
	props: {
		logoPath: {
			type: String,
			required: true,
		},
	},
};
</script>

<template>
	<header>
		<router-link to="/">
			<img :src="logoPath" />
		</router-link>
	</header>
</template>

<style scoped lang="sass">
header
	text-align: center
	img
		width: 100px
		height: auto
</style>
