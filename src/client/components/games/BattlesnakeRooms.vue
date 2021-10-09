<script>
import BattlesnakeRoomsItem from './BattlesnakeRoomsItem.vue';

export default {
	components: {
		BattlesnakeRoomsItem,
	},
	async created() {
		if (this.$store.state.battlesnakeRooms.length <= 0) {
			try {
				const data = await fetch('/api/battlesnake/rooms');
				const rooms = await data.json();
				this.$store.commit('setBattlesnakeRooms', rooms);
			} catch (err) {
				console.error(err);
			};
		};
	},
};
</script>

<template>
	<section>
		<table>
			<thead>
				<tr>
					<td>Room</td>
					<td>Players</td>
					<td>Password</td>
				</tr>
			</thead>
			<tbody>
				<BattlesnakeRoomsItem
						v-for="(room, index) in this.$store.state.battlesnakeRooms"
						:key="index"
						:name="room.name"
						:roomID="room.id"
						:players="room.players"
						:hasPassword="room.password ? 'Yes' : 'No'"
						/>
			</tbody>
		</table>
	</section>
</template>

<style scoped lang="sass">
table
	text-align: center
	width: 100%
	border-spacing: 0
	border: 0.1rem solid $fg-medium

thead
	background: $fg-medium
	font-size: 1.5rem
	tr
		display: flex
	td
		padding: 0.5rem 0
		flex: 1
</style>
