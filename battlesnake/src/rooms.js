import genID from './util/id.js';

let rooms = [];

export function getRooms() {
	return rooms;
}

export function addRoom(room) {
	rooms.push(room);
}

export function clearRooms() {
	rooms = [];
}


export function createRoom(name, password) {
	return {
		name,
		password,
		id: genID(),
		players: [],

		sanitized() {
			return {
				name: this.name,
				password: this.password?.length > 0,
				id: this.id,
				players: this.players.map(player => player.sanitized),
			}
		},
	}
}
