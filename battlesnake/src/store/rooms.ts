import {v4 as uuidv4} from 'uuid';
import { SanitizedRooms, Room, Rooms } from '../types/room';

const rooms: Rooms = new Map();

export function addRoom(room: Room) {
	const id = uuidv4();
	rooms.set(id, room);
	return id;
}

export function deleteRoom(id: string) {
	return rooms.delete(id);
}

export function getSanitizedRooms() {
	const sanitizedRooms: SanitizedRooms = {};
	for (const [id, room] of rooms) {
		sanitizedRooms[id] = room.sanitized();
	}
	return sanitizedRooms;
}
