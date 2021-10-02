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
		<img :src="logoPath">
	</header>
</template>

<style scoped lang="sass">
header
	text-align: center
	background-color: $test-color-1
</style>
