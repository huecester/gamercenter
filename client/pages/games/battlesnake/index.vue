<script setup>
import { ref, computed, useStore, useContext } from '@nuxtjs/composition-api';
const { $http } = useContext();
const store = useStore();

const showModal = ref(false);
const disableRefresh = ref(false);

const rooms = ref([]);

const fetchRooms = async () => {
	disableRefresh.value = true;
	setTimeout(() => { disableRefresh.value = false; }, 3000);

	try {
		const data = await $http.$get('/api/battlesnake/rooms');
		rooms.value = data;
	} catch (err) {
		console.error(err)
		store.commit('notifications/error', 'Failed to reach server.');
	}
}
fetchRooms();
</script>

<template>
	<main>
		<h1>Battlesnake</h1>

		<div class="row">
			<button
					type="button"
					@click="showModal = true"
					>
					Create room
			</button>
			<button
					type="button"
					@click="fetchRooms"
					:disabled="disableRefresh"
					>
					Refresh
			</button>
		</div>

		<Username />

		<table>
			<thead>
				<th>
					<td>Room</td>
					<td>Players</td>
					<td>Password?</td>
				</th>
			</thead>
			<tbody>
				<BattlesnakeRoom
						v-for="room in rooms"
						:key="room.id"
						:name="room.name"
						:roomID="room.id"
						:players="room.players"
						:hasPassword="room.password"
						/>
			</tbody>
		</table>

		<BattlesnakeCreateModal
				:show="showModal"
				@close="showModal = false"
				/>
	</main>
</template>

<style scoped lang="scss">
table {
	text-align: center;
	width: 100%;
	border-spacing: 0;
	border: 0.1rem solid $fg-medium;
	margin: 0.5rem 0 2.5rem 0;
	thead {
		background: $fg-medium;
		font-size: 1.5rem;
		th {
			display: flex;
			td {
				padding: 0.5rem 0;
				flex: 1;
			}
		}
	}
}
</style>
