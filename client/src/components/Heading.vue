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
		<a href="/">
			<img :src="logoPath" />
		</a>
	</header>
</template>

<style scoped lang="sass">
header
	text-align: center
	img
		width: 100px
		height: auto
</style>
