import { v4 as uuidv4 } from 'uuid';
import faker from '@faker-js/faker';

import { Room } from '../types/room';

const rooms = new Map();
for (let i = 0; i < 10; i++) {
	rooms.set(uuidv4(), new Room(faker.lorem.word()));
}

export function getSanitizedRooms() {
	return Array.from(rooms.values()).map(room => room.sanitized());
}
