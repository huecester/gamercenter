<script setup>
import { ref, computed, useStore, useContext, useRouter } from '@nuxtjs/composition-api';
const { $http } = useContext();
const router = useRouter();
const store = useStore();

const showCreateModal = ref(false);
const showPasswordModal = ref(false);
const disableRefresh = ref(false);

const rooms = ref([]);
const id = ref('');

const showPasswordModalHandler = newID => {
	id.value = newID;
	showPasswordModal.value = true;
}

const submitWithPassword = password => {
	sessionStorage.setItem('password', password);
	router.push({ path: `/games/battlesnake/${id.value}` });
}

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
					@click="showCreateModal = true"
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
						@password="showPasswordModalHandler"
						/>
			</tbody>
		</table>

		<LazyBattlesnakeCreateModal
				:show="showCreateModal"
				@close="showCreateModal = false"
				/>
		<LazyBattlesnakePasswordModal
				:show="showPasswordModal"
				@close="showPasswordModal = false"
				@submit="submitWithPassword"
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
