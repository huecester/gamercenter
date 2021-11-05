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
	<table>
		<thead>
			<tr>
				<th />
				<th>Players</th>
				<th />
			</tr>
		</thead>
		<tbody>
			<BattlesnakeGamePlayersItem
					v-for="player in players"
					:key="player.id"
					:color="player.color"
					:username="player.username"
					:status="player.status"
					:isHost="player.isHost"
					/>
		</tbody>
	</table>
</template>

<style scoped lang="sass">
table
	border-collapse: collapse
	border: 2px solid $fg-medium
	width: 16rem

thead
	background-color: $fg-medium

thead
	tr
		height: calc($bs-row-height * 1.5)
		display: flex
		align-items: center
		justify-content: center
		th
			&:nth-child(1), &:nth-child(3)
				width: $bs-row-height
			&:nth-child(2)
				flex: 1
				font-size: 1.25rem

tbody
	overflow: auto
</style>
