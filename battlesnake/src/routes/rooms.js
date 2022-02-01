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

	socket.on('join', (id, username, password, cb) => {
		// Disable timeout
		clearTimeout(timeoutID);

		// Get room
		const res = checkRoom(id);
		if (res.err) {
			return cb(res.err);
		}
		const room = res.room;


		// Initialize player
		const player = createPlayer(username)

		// If player is first to join, set as host
		if (room.players.size <= 0) {
			player.isHost = true;
		}

		room.addPlayer(player);
	});
}

function checkRoom(id) {
	const room = getRoom(id);

	// Check if room exists
	if (!room) {
		return { err: 'NOTFOUND' };
	}

	// Check for password
	if (room.password && password !== room.password) {
		return { err: 'BADPASS' };
	}

	// Check if room is full
	if (room.players.size >= room.max) {
		return { err: 'ROOMFULL' };
	}

	return { room };
}
