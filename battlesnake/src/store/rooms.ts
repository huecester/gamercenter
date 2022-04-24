import {v4 as uuidv4} from 'uuid';
import { SanitizedRooms, RoomForm, Room, Rooms } from '../types/room';

const rooms: Rooms = new Map();

export function addRoom(form: RoomForm) {
	const id = uuidv4();
	const timeoutID = setTimeout(() => rooms.delete(id), 5000);
	const room = Room.fromForm(form, id, timeoutID);
	rooms.set(id, room);
	return id;
}

export function clearRooms() {
	for (const room of rooms.values()) {
		room.timeoutID && clearTimeout(room.timeoutID);
	}
	rooms.clear();
}

export function deleteRoom(id: string) {
	const timeoutID = rooms.get(id)?.timeoutID;
	if (timeoutID) {
		clearTimeout(timeoutID);
	}
	return rooms.delete(id);
}

export function getRoom(id: string) {
	return rooms.get(id);
}

export function getSanitizedRooms() {
	const sanitizedRooms: SanitizedRooms = {};
	for (const [id, room] of rooms) {
		sanitizedRooms[id] = room.sanitized;
	}
	return sanitizedRooms;
}
