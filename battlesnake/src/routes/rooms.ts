import { Router } from 'express';
import {v4 as uuidv4} from 'uuid';

import { SanitizedRoom, SanitizedRooms, Room, Rooms } from '../types/room';

const router = Router();

const rooms: Rooms = new Map([
	[uuidv4(), new Room('bazinga', 'horseshoe')],
	[uuidv4(), new Room('gaming')],
	[uuidv4(), new Room('horse', '')],
]);

router.get('/', (req, res) => {
	const sanitizedRooms: SanitizedRooms = {};
	for (const [id, room] of rooms) {
		sanitizedRooms[id] = room.sanitized();
	}
	res.json(sanitizedRooms);
});

export default router;
