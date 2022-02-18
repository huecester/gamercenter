import genID from './util/id.js';
import io from './io.js';

let rooms = new Map();

export function getRooms() {
	return Array.from(rooms.values());
}

export function getRoom(id) {
	return rooms.get(id);
}

export function deleteRoom(id) {
	const room = getRoom(id);
	if (room?.timeoutID) {
		clearTimeout(room.timeoutID);
	}

	rooms.delete(id);
}

export function addRoom(room) {
	rooms.set(room.id, room);
}

export function clearRooms() {
	for (const room of rooms.values()) {
		if (room.timeoutID) {
			clearTimeout(room.timeoutID);
		}
	}
	rooms.clear();
}


export function createRoom(name, password) {
	const id = genID();
	const roomIO = io.in(id);

	return {
		name,
		password,
		id,
		players: new Map(),
		max: 8,
		io: roomIO,

		sanitized() {
			return {
				name: this.name,
				password: this.password?.length > 0,
				id: this.id,
				players: this.sanitizedPlayers(),
			}
		},

		sanitizedPlayers() {
			return Array.from(this.players).map(player => player.sanitized);
		},

		addPlayer(player) {
			this.players.set(player.id, player);
			this.io.emit('join', {
				player: player.username,
				players: this.sanitizedPlayers(),
			});

			this.setupPlayerSocket(player);
		},

		removePlayer(player) {
			if (player.isHost) {
				return this.close('HOSTLEFT');
			}

			this.players.delete(player.id);
			this.io.emit('leave', {
				player: player.username,
				players: this.sanitizedPlayers(),
			});
		},

		close(reason) {
			reason = reason || undefined;
			this.io.emit('close', reason);

			if (this.io.sockets) {
				for (const socket of this.io.socketsvalues) {
					socket?.disconnect();
				}
			}

			deleteRoom(this.id);
		},


		setupPlayerSocket(player) {
			player.socket.join(this.id);
			player.socket.on('msg', msg => {
				this.io.emit('msg', {
					author: player.username,
					msg: msg.trim().slice(0, 64),
				});
			});
		},
	}
}
