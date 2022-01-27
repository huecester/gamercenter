import { getRoom } from '../src/rooms.js';
import { createPlayer } from '../src/players.js';

export function init() {}

export function onConnection(socket) {
	console.log('[BATTLESNAKE] ')

	socket.on('join', (id, username, password, cb) => {
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
				err: 'WRONGPASS',
			});
		}
	});
}
