import { Router } from 'express';
import {v4 as uuidv4} from 'uuid';

import { SanitizedRoom, SanitizedRooms, Room, Rooms, RoomForm } from '../types/room';

const router = Router();

const rooms: Rooms = new Map();

router.get('/', (req, res) => {
	const sanitizedRooms: SanitizedRooms = {};
	for (const [id, room] of rooms) {
		sanitizedRooms[id] = room.sanitized();
	}
	res.json(sanitizedRooms);
});

router.post('/', (req, res) => {
	const form: RoomForm = req.body;
	if (!form.name) {
		return res.sendStatus(422);
	}

	const room = Room.fromForm(form);
	rooms.set(uuidv4(), room);

	res.sendStatus(201);
});

export default router;
