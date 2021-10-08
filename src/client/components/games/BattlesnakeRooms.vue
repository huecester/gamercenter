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
		<h2>Rooms</h2>
		<table>
			<thead>
				<tr>
					<td>Room</td>
					<td>Players</td>
					<td>Password?</td>
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
</style>
