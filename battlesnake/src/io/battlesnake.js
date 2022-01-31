import { getRoom } from '../rooms.js';
import { createPlayer } from '../players.js';

export function init() {}

export function onConnection(socket) {
	console.log('[BATTLESNAKE] ')

	const timeoutID = setTimeout(() => {
		socket.disconnect(true);
	}, 5000);

	socket.on('join', (id, username, password, cb) => {
		// Disable timeout
		clearTimeout(timeoutID);

		// Get room
		const res = checkRoom(id);
		if (res.type === 'err') {
			return cb(err);
		}
		const room = res.room;


		// Initialize player
		const player = createPlayer(username)

		// If player is first to join, set as host
		if (room.players.size <= 0) {
			player.isHost = true;
		}

		room.addPlayer(player);
	});
}

function checkRoom(id) {
	const room = getRoom(id);

	// Check if room exists
	if (!room) {
		return {
			type: 'err',
			err: 'NOTFOUND',
		};
	}

	// Check for password
	if (room.password && password !== room.password) {
		return {
			type: 'err',
			err: 'BADPASS',
		};
	}

	// Check if room is full
	if (room.players.size >= room.max) {
		return {
			type: 'err',
			err: 'ROOMFULL',
		};
	}

	return {
		type: 'ok',
		room,
	};
}
