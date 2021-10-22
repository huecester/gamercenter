<script>
export default {
	props: {
		size: {
			type: Number,
			default: 300,
		},
	},
};
</script>

<template>
	<canvas
			:width="size"
			:height="size"
			/>
</template>

<style scoped lang="sass">
canvas
	background: black
	border: 2px solid $fg-medium
</style>
