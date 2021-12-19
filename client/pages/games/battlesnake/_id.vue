<script setup>
import { useRoute, useRouter, useStore, computed, ref, onUnmounted } from '@nuxtjs/composition-api';
import io from 'socket.io-client';
const route = useRoute();
const router = useRouter();
const store = useStore();

// check for username
const username = computed(() => localStorage.getItem('username'));
if (!username) {
	store.commit('notifications/error', 'Username must be set.');
	router.push('/games/battlesnake');
}
// get password
const password = computed(() => sessionStorage.getItem('password'));

// variables
const roomName = ref('');
const isHost = ref(false);
const started = ref(false);
const gridSize = ref(20);

// helper functions
const handleError = err => {
	let msg;
	let level = 'error';
	switch (err) {
		case 'notfound':
			msg = `Room with ID "${id.value}" does not exist.`;
			break;
		case 'full':
			msg = 'This room is full.';
			level = 'warn';
			break;
		case 'wrongpassword':
			msg = 'Incorrect password.';
			level = 'warn';
			break;

		case 'hostleft':
			msg = 'The host left the room.';
			level = 'info';
			break;
		default:
			msg = 'Unknown error.';
			break;
	}
	store.commit(`notifications/${level}`, msg);
	router.push('/games/battlesnake');
}


// join
const id = ref(route.value.params.id);
const socket = io('http://localhost:3031/battlesnake');

onUnmounted(() => {
	socket.disconnect();
	store.dispatch('battlesnake/teardown');
});

socket.emit('join', id.value, username.value, password.value, res => {
	if (res.status !== 'ok') {
		handleError(res.err);
	}

	// init variables
	roomName.value = res.room?.name || '';
	isHost.value = res.isHost || false;
	gridSize.value = res.room?.gridSize || 20;
	store.commit('battlesnake/players/set', res.room?.players);

	// chat
	socket.on('player', (username, action, newPlayers) => {
		switch (action) {
			case 'join':
				store.commit('battlesnake/chat/join', username);
				break;
			case 'leave':
				store.commit('battlesnake/chat/leave', username);
				break;
		}

		store.commit('battlesnake/players/set', newPlayers);
	});
	socket.on('msg', (msg, username) => store.commit('battlesnake/chat/msg', { text: msg, author: username }));
	socket.on('countdown', n => store.commit('battlesnake/chat/countdown', n));
	socket.on('render', state => store.commit('battlesnake/canvas/update', state));
	socket.on('players', players => store.commit('battlesnake/players/set', players));
	socket.on('win', username => {
		store.commit('battlesnake/chat/winner', username);
		store.commit('battlesnake/canvas/update', []);
		started.value = false;
	});

	// error
	socket.on('err', handleError);
});

// methods
const send = msg => socket.emit('msg', msg);


const start = () => {
	started.value = true;
	socket.emit('start');
}

const dir = direction => socket.emit('dir', direction);
</script>

<template>
	<div class="outer">
		<div class="inner">
			<h1>{{ roomName }}</h1>
			<BattlesnakeCanvas
					:gridSize="gridSize"
					@dir="dir"
					/>
		</div>
		<div class="inner sidebar">
			<button
					v-if="isHost && !started"
					@click="start"
					>
					Start
			</button>
			<BattlesnakePlayers />
			<BattlesnakeChat @send="send" />
		</div>
	</div>
</template>

<style scoped lang="scss">
.outer {
	padding: 1rem;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;

	.inner {
		display: flex;
		margin: 1rem;
		flex: 1;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		h1 {
			max-width: 50vw;
			overflow: clip;
		}
	}

	.sidebar {
		width: clamp(0vw, 24rem, 95vw);
		* {
			margin: 0.5rem;
		}
	}
}
</style>
