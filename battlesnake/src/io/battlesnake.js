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

		const room = getRoom(id);
		// Check if room exists
		if (!room) {
			return cb({
				type: 'err',
				err: 'NOTFOUND',
			});
		}

		// Check for password
		if (room.password && password !== room.password) {
			return cb({
				type: 'err',
				err: 'BADPASS',
			});
		}

		// Check if room is full
		if (room.players.size >= room.max) {
			return cb({
				type: 'err',
				err: 'ROOMFULL',
			});
		}
	});
}
