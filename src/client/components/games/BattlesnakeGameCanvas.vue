<script>
export default {
	props: {
		width: {
			type: Number,
			default: 300,
		},
		height: {
			type: Number,
			default: 300,
		},
	},
};
</script>

<template>
	<canvas
			:width="width"
			:height="height"
			/>
</template>

<style scoped lang="sass">
canvas
	background: black
</style>
