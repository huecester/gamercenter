import {v4 as uuidv4} from 'uuid';
import { SanitizedRooms, RoomForm, Room, Rooms } from '../types/room';
import io from '../io';

const rooms: Rooms = new Map();

export function addRoom(form: RoomForm) {
	const id = uuidv4();
	const room = Room.fromForm(form, io.of('/rooms').to(id));
	rooms.set(id, room);
	return id;
}

export function clearRooms() {
	rooms.clear();
}

export function deleteRoom(id: string) {
	return rooms.delete(id);
}

export function getRoom(id: string) {
	return rooms.get(id);
}

export function getSanitizedRooms() {
	const sanitizedRooms: SanitizedRooms = {};
	for (const [id, room] of rooms) {
		sanitizedRooms[id] = room.sanitized();
	}
	return sanitizedRooms;
}
