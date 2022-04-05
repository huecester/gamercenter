import { Router } from 'express';

import { SanitizedRoom, SanitizedRooms, Room, Rooms, RoomForm } from '../types/room';
import { addRoom, getSanitizedRooms } from '../store/rooms';

const router = Router();

router.get('/', (req, res) => {
	res.json(getSanitizedRooms());
});

router.post('/', (req, res) => {
	const form: RoomForm = req.body;
	if (!form.name) {
		return res.sendStatus(422);
	}

	const room = Room.fromForm(form);
	const id = addRoom(room);

	res
		.status(201)
		.set('Content-Type', 'text/plain')
		.send(id);
});

export default router;
