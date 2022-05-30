import { Room } from '../types/room';
import { SanitizedRoom } from '../types/sanitizedRoom';

const rooms = new Map();

export function addRoom(room: Room) {
	rooms.set(room.id, room);
}

export function getRoom(id: string) {
	return rooms.get(id);
}

export function clearRooms() {
	rooms.clear();
}

export function getSanitizedRooms() {
	return Array.from(rooms.entries()).reduce((rooms: {[id: string]: SanitizedRoom}, [id, room]) => {
		rooms[id] = room.sanitized();
		return rooms;
	}, {});
}

