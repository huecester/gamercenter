<script>
import BattlesnakeGameCanvas from './BattlesnakeGameCanvas.vue';
import BattlesnakeGamePlayers from './BattlesnakeGamePlayers.vue';
import BattlesnakeGameChat from './BattlesnakeGameChat.vue';

import { io } from 'socket.io-client';

export default {
	components: {
		BattlesnakeGameCanvas,
		BattlesnakeGamePlayers,
		BattlesnakeGameChat,
	},
	data() {
		return {
			id: this.$route.params.id,
			socket: null,
			isHost: false,
			players: [],
			messages: [],
		};
	},
	computed: {
		username() {
			return window.localStorage?.getItem('username');
		},
	},
	methods: {
		send(message) {
			this.io.emit('message', message);
		},
	},
	created() {
		if (!this.username) {
			this.$store.commit('notify', { level: 'warn', message: 'Username cannot be empty.' });
			this.$router.push('/games/battlesnake');
			return;
		};

		this.socket = io('/battlesnake');
		this.socket.on('close', reason => {
			switch (reason) {
				case 'notfound':
					this.$store.commit('notify', { level: 'warn', message: `Room "${this.id}" does not exist.` });
					break;
				case 'nousername':
					this.$store.commit('notify', { level: 'warn', message: 'Username was not set.' });
					break;
				case 'wrongpassword':
					this.$store.commit('notify', { level: 'warn', message: 'Incorrect password.' });
					break;
				case 'hostleft':
					this.$store.commit('notify', { level: 'info', message: 'The host left the room.' });
					break;
				default:
					this.$store.commit('notify', { level: 'warn', message: 'Something went wrong.' });
					break;
			};
			this.$router.push('/games/battlesnake');
		});

		this.socket.on('joined', data => {
			this.isHost = data.isHost;
			// TODO add statuses to players
			this.players = data.players.map(player => {
				return {
					...player,
					status: '\u{1F40D}',
				};
			});

			this.socket.on('message', messages.push(message));
		});

		this.socket.emit('join', { 
			id: this.id,
			username: this.username,
		});
	},
	unmounted() {
		this.socket.disconnect();
		this.socket = null;
	},
};
</script>

<template>
	<section class="row">
		<div id="canvas-container">
			<BattlesnakeGameCanvas />
		</div>
		<div id="sidebar">
			<BattlesnakeGamePlayers :players="players" />
			<BattlesnakeGameChat
					:messages="messages"
					@message="send($event)"
					/>
		</div>
	</section>
</template>

<style scoped lang="sass">
section
	width: 100%

#canvas-container, #sidebar
	flex: 1
	align-items: center
	justify-content: center

#sidebar
	display: flex
	flex-direction: column

section, #sidebar
	align-items: center
	justify-content: center
</style>
