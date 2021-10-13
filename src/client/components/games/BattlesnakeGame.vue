<script>
import { io } from 'socket.io-client';

export default {
	data() {
		return {
			id: this.$route.params.id,
			socket: null,
		};
	},
	computed: {
		username() {
			return window.localStorage?.getItem('username');
		},
	},
	created() {
		if (!this.username) {
			this.$store.commit('notify', { level: 'warn', message: 'Username cannot be empty.' });
			this.$router.push('/games/battlesnake');
			return;
		}

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
			console.log('Joined');
		});

		this.socket.emit('join', { id: this.id, username: this.username });
	},
	unmounted() {
		this.socket.disconnect();
		this.socket = null;
	}
};
</script>

<template>
	<section>
		<h2>Game</h2>
	</section>
</template>

<style scoped lang="sass">
</style>
