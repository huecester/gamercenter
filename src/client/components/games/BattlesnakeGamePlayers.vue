<script>
import BattlesnakeGamePlayersItem from './BattlesnakeGamePlayersItem.vue';

export default {
	components: {
		BattlesnakeGamePlayersItem,
	},
	props: {
		players: {
			type: Array,
			required: true,
		},
	},
};
</script>

<template>
	<h2>Players</h2>
	<table>
		<thead>
			<tr>
				<th />
				<th>Username</th>
				<th>Status</th>
			</tr>
		</thead>
		<tbody>
			<BattlesnakeGamePlayersItem
					v-for="player in players"
					:color="player.color"
					:username="player.username"
					:status="player.status"
					/>
		</tbody>
	</table>
</template>

<style scoped lang="sass">
table
	border-collapse: collapse
	border: 2px solid $fg-medium
	width: 8rem

thead
	background-color: $fg-medium

thead
	tr
		height: $bs-row-height
		display: flex
		align-items: center
		justify-content: center
		td:nth-child(1)
			width: $bs-row-height
		td:nth-child(2)
			flex: 1
		td:nth-child(3)
			width: $bs-row-height
</style>
