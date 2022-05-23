import { v4 as uuidv4 } from 'uuid';
import { Room } from '../types/room';
import { SanitizedRoom } from '../types/sanitizedRoom';

const rooms = new Map();

export function addRoom(room: Room) {
	const id = uuidv4();
	rooms.set(id, room);
	return id;
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

