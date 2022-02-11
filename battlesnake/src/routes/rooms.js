import { Router } from 'express';
import io from '../io.js';
import { addRoom, createRoom, getRoom, getRooms } from '../rooms.js';
import { createPlayer } from '../players.js';

export function createRouter() {
	// Router
	const router = Router();

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

		res.status(201).set('Content-Type', 'text/plain').send(room.id);
		next();
	});

	// IO
	io.on('connection', onConnection);

	return router;
}

function onConnection(socket) {
	const timeoutID = setTimeout(() => {
		socket.disconnect(true);
	}, 5000);

	socket.on('join', (data, cb) => {
		// Disable timeout
		clearTimeout(timeoutID);

		// Check for ID
		if (!data.id) {
			return cb({ err: 'NOID' })
		}

		// Get room
		const res = checkRoom(data.id);
		if (res.err) {
			return cb(res);
		}
		const room = res.room;

		// Check for password
		if (room.password && data?.password !== room.password) {
			return cb({ err: 'BADPASS' });
		}


		// Initialize player
		const player = createPlayer(data.username, socket);

		// If player is first to join, set as host
		if (room.players.size <= 0) {
			player.isHost = true;
		}

		room.addPlayer(player);

		cb({
			room: room.sanitized(),
		});
	});
}

function checkRoom(id) {
	const room = getRoom(id);

	// Check if room exists
	if (!room) {
		return { err: 'NOTFOUND' };
	}

	// Check if room is full
	if (room.players.size >= room.max) {
		return { err: 'ROOMFULL' };
	}

	return { room };
}
