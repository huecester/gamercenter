import genID from './util/id.js';

let rooms = new Map();

export function getRooms() {
	return Array.from(rooms.values());
}

export function getRoom(id) {
	return rooms.get(id);
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
				players: this.players.map(player => player.sanitized),
			}
		},

		addPlayer(player) {},

		removePlayer(player) {},
	}
}
