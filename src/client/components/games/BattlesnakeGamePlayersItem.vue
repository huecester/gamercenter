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
			validator(value) {
				return [
					'alive',
					'dead',
					'winner',
				].includes(value);
			}
		},
		isHost: {
			type: Boolean,
			default: false,
		},
	},
};
</script>

<template>
	<tr>
		<td :style="{ 'color': '#ffffff', 'background-color': color }">
			<span v-if="isHost === true" class="fas fa-crown" />
		</td>

		<td>{{ username }}</td>

		<td :style="{ 'color': color }">
			<span v-if="status === 'alive'" class="fas fa-heart" />
			<span v-else-if="status === 'dead'" class="fas fa-skull" />
			<span v-else-if="status === 'winner'" class="fas fa-trophy" />
		</td>
	</tr>
</template>

<style scoped lang="sass">
tbody
	tr
		height: $bs-row-height
		display: flex
		td
			&:nth-child(1), &:nth-child(3)
				width: $bs-row-height
			&:nth-child(2)
				flex: 1
				padding-left: 0.25rem
</style>
