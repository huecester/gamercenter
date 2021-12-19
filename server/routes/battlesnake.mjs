import { Router } from 'express';

import createRoom from '../battlesnake/room.mjs';
import createPlayer from '../battlesnake/player.mjs';

export const router = Router();


let rooms = new Map();

// routes
router.get('/rooms', (req, res) => {
	const sanitizedRooms = [];
	for (const room of rooms.values()) {
		sanitizedRooms.push(room.sanitized());
	}
	res.json(sanitizedRooms);
});

router.post('/rooms', (req, res) => {
	if (!req.body.name) {
		res.sendStatus(400);
		return;
	}

	req.body.name = req.body.name.slice(0, 32);
	req.body.password = req.body.password?.slice(0, 32);

	const newRoom = createRoom(req.body.name, req.body.password);
	newRoom.onclose = () => {
		rooms.delete(newRoom.id);
	};
	rooms.set(newRoom.id, newRoom)

	res.status(201).type('txt').send(newRoom.id);
});

// io
export function ioInit(io) {
	io.on('connection', socket => {
		socket.on('join', (roomID, username, cb) => {
			const room = rooms.get(roomID);
			if (!room) {
				cb({
					status: 'err',
					err: 'notfound',
				});
				return;
			}

			const player = createPlayer(username, socket.id, socket);
			if (!room.io) {
				// player is host, initialize room io
				room.ioInit(io.in(room.id));
				player.isHost = true;
			}
			if (!room.add(player)) {
				cb({
					status: 'err',
					err: 'full',
				});
				return;
			}

			cb({
				status: 'ok',
				room: room.sanitized(),
				isHost: player.isHost,
			});
		});
	});
}
