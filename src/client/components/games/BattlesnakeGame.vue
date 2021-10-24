<script>
import BattlesnakeGameCanvas from './BattlesnakeGameCanvas.vue';
import BattlesnakeGamePlayers from './BattlesnakeGamePlayers.vue';
import BattlesnakeGameChat from './BattlesnakeGameChat.vue';

import { io } from 'socket.io-client';
import _ from 'lodash';

export default {
	components: {
		BattlesnakeGameCanvas,
		BattlesnakeGamePlayers,
		BattlesnakeGameChat,
	},
	data() {
		return {
			roomID: this.$route.params.id,
			socket: null,
			roomName: null,
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
			this.socket.emit('message', message);
		},
	},
	created() {
		// Check for username
		if (!this.username) {
			this.$store.commit('notify', { level: 'warn', message: 'Username cannot be empty.' });
			this.$router.push('/games/battlesnake');
			return;
		};

		// Attempt connection to server
		this.socket = io('/battlesnake');
		this.socket.on('close', reason => {
			switch (reason) {
				case 'notfound':
					this.$store.commit('notify', { level: 'warn', message: `Room "${this.roomID}" does not exist.` });
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
				case 'roomfull':
					this.$store.commit('notify', { level: 'warn', message: 'This room is full.' });
					break;
				default:
					this.$store.commit('notify', { level: 'warn', message: 'Something went wrong.' });
					break;
			};
			this.$router.push('/games/battlesnake');
		});

		this.socket.on('joined', data => {
			this.isHost = data.isHost;
			this.roomName = data.roomName;

			// Initialize room handlers
			this.socket.on('join', data => {
				this.messages.push({
					type: 'join',
					id: data.id,
					player: data.player,
				});
				this.players = data.players;
			});

			this.socket.on('leave', data => {
				this.messages.push({
					type: 'leave',
					id: data.id,
					player: data.player,
				});
				this.players = data.players;
			});

			this.socket.on('message', message => {
				this.messages.push({
					type: 'message',
					...message,
				});
			});
		});

		this.socket.emit('join', {
			id: this.roomID,
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
	<section>
		<div id="main">
			<h2>{{ roomName }}</h2>
			<div id="canvas-container">
				<BattlesnakeGameCanvas />
			</div>
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
	display: flex
	flex-direction: row
	margin-bottom: 3rem
	width: 100%
	align-items: center
	justify-content: center
	@media (orientation: portrait)
		flex-direction: column
		margin-bottom: 0

#main, #sidebar, #canvas-container
	display: flex
	align-items: center
	justify-content: center
#main, #sidebar
	flex-direction: column
#main
	flex: 2
#sidebar
	width: clamp(0vw, 24rem, 95vw)
	flex: 1
	& > *
		margin: 0.5rem
	@media (orientation: portrait)
		width: 100%
		flex-direction: row
</style>
