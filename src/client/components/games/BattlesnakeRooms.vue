<script>
import BattlesnakeRoomsItem from './BattlesnakeRoomsItem.vue';
import BattlesnakeRoomsCreateModal from './BattlesnakeRoomsCreateModal.vue'

export default {
	components: {
		BattlesnakeRoomsItem,
		BattlesnakeRoomsCreateModal,
	},
	data() {
		return {
			showModal: false,
			username: '',
		};
	},
	watch: {
		username(newUsername) {
			window.localStorage?.setItem('username', newUsername);
		},
	},
	methods: {
		closeModal(data) {
			this.showModal = false;
			if (data) {
				const xhr = new XMLHttpRequest();

				xhr.onload = () => {
					if (xhr.status !== 201) {
						this.$store.commit('notify', { level: 'error', message: 'Could not create the room.' });
						return;
					}
					const data = JSON.parse(xhr.response);
					this.$router.push({ path: `/games/battlesnake/${data.id}` })
				};

				xhr.open('POST', '/api/battlesnake/rooms', true);
				xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				xhr.send(`name=${data.roomname}&password=${data.password}`);
			};
		},
	},
	async created() {
		this.username = window.localStorage?.getItem('username') || '';

		try {
			const data = await fetch('/api/battlesnake/rooms');
			const rooms = await data.json();
			this.$store.commit('setBattlesnakeRooms', rooms);
		} catch (err) {
			this.$store.commit('notify', { level: 'error', message: 'Could not fetch data.' });
		};
	},
};
</script>

<template>
	<section>
		<div class="row">
			<button @click="this.showModal = true">Create room</button>
		</div>

		<form
				class="row"
				@submit.prevent=""
				>
				<label for="username">Username</label>
				<input type="text" name="username" id="username" v-model="username" required maxlength="20" autocomplete="off" />
		</form>

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
		<BattlesnakeRoomsCreateModal
				:show="this.showModal"
				@close="closeModal($event)"
				/>
	</section>
</template>

<style scoped lang="sass">
input
	margin: 0.5rem

table
	text-align: center
	width: 100%
	border-spacing: 0
	border: 0.1rem solid $fg-medium
	margin: 0.5rem 0 2.5rem 0

thead
	background: $fg-medium
	font-size: 1.5rem
	tr
		display: flex
	td
		padding: 0.5rem 0
		flex: 1
</style>
