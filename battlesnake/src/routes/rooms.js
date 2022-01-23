import { Router } from 'express';
import { addRoom, createRoom, getRooms } from '../rooms.js';

export const router = Router();

router.get('/', (req, res, next) => {
	res.json(getRooms().map(room => room.sanitized()));
	next();
});

router.post('/', (req, res, next) => {
	if (!req?.body?.roomname) {
		res.sendStatus(400);
		next();
		return;
	}

	const roomname = req.body.roomname.slice(0, 32);
	const password = req.body.password?.slice(0, 32);

	const room = createRoom(roomname, password);
	addRoom(room);

	res.sendStatus(201);
	next();
});

router.all('/', (req, res, next) => {
	if (!res.headersSent) {
		res.sendStatus(405);
	}
	next();
});
