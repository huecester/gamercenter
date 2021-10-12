<script>
import { io } from 'socket.io-client';

export default {
	data() {
		return {
			id: this.$route.params.id,
			io: null,
		};
	},
	created() {
		this.io = io('/battlesnake');
		io.on('joined', data => {
			if (data.error) {
				switch (data.error) {
					case 'notfound':
						this.$store.commit('notify', { level: 'warn', message: `Room ${this.id} does not exist.` });
						break;
					default:
						this.$store.commit('notify', { level: 'warn', message: 'Something went weong.' });
				};
				this.$router.push('/battlesnake');
			};
			console.log('Joined');
		});

		this.io.emit('join', this.id);
	},
};
</script>

<template>
	<section>
		<h2>Game</h2>
	</section>
</template>

<style scoped lang="sass">
</style>
