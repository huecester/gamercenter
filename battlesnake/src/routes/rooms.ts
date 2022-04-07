import { Router } from 'express';
import { Namespace, Socket } from 'socket.io';

import { RoomForm } from '../types/room';
import { JoinData, JoinError, JoinResult } from '../types/data';
import { addRoom, getRoom, getSanitizedRooms } from '../store/rooms';

export const router = Router();

router.get('/', (req, res) => {
	res.json(getSanitizedRooms());
});

router.post('/', (req, res) => {
	const form: RoomForm = req.body;
	if (!form.name) {
		return res.sendStatus(422);
	}

	const id = addRoom(form);

	res
		.status(201)
		.set('Content-Type', 'text/plain')
		.send(id);
});


export function onConnection(io: Namespace, socket: Socket) {
	// Timeout
	const timeoutID = setTimeout(() => {
		socket.disconnect(true);
	}, 5000);

	socket.on('join', (data: JoinData, cb: (res: JoinResult) => void) => {
		// Clear timeout
		clearTimeout(timeoutID);

		// Test for username
		if (!data.username) {
			return cb({
				err: JoinError.NOUSERNAME,
			});
		}

		const username = data.username.slice(0, 32);

		// Get room
		const room = getRoom(data.id);
		if (!room) {
			return cb({
				err: JoinError.NOTFOUND,
			});
		}

		// Check password
		if (room.password && room.password !== data.password) {
			return cb({
				err: JoinError.BADPASS,
			});
		}

		room.addPlayer(username, socket);
	});
}
