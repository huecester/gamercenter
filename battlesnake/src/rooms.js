import genID from './util/id.js';

let rooms = new Map();

export function getRooms() {
	return Array.from(rooms.values());
}

export function getRoom(id) {
	return rooms.get(id);
}

export function deleteRoom(id) {
	rooms.delete(id);
}

export function addRoom(room) {
	rooms.set(room.id, room);
}

export function clearRooms() {
	rooms.clear();
}


export function createRoom(name, password, io) {
	const id = genID();
	return {
		name,
		password,
		id,
		players: new Map(),
		io: io.in(id),

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
			this.io.emit('join', player.username, this.sanitizedPlayers());
		},

		removePlayer(player) {
			this.players.delete(player.id);
			this.io.emit('leave', player.username, this.sanitizedPlayers());
		},

		close(reason) {
			reason = reason || undefined;
			this.io.emit('close', reason);
			deleteRoom(this.id);
		},
	}
}
