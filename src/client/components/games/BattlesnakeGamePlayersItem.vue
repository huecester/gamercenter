<script>
export default {
	props: {
		color: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			required: true,
		},
	},
};
</script>

<template>
	<tr>
		<td :style="{ 'background-color': color }"></td>
		<td>{{ username }}</td>
		<td>{{ status }}</td>
	</tr>
</template>

<style scoped lang="sass">
tbody
	tr
		height: $bs-row-height
		display: flex
		td:nth-child(1)
			width: $bs-row-height
		td:nth-child(2)
			flex: 1
		td:nth-child(3)
			width: $bs-row-height
</style>