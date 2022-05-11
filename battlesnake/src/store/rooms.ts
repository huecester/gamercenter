import { v4 as uuidv4 } from 'uuid';
import faker from '@faker-js/faker';

import { Room } from '../types/room';

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
	return Array.from(rooms.values()).map(room => room.sanitized());
}

