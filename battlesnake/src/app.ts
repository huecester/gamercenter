import express from 'express';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

import { JoinError } from './types/joinData';
import { Player } from './types/player';
import { Room } from './types/room';
import { addRoom, getRoom, getSanitizedRooms } from './store/rooms';

const SOCKET_TIMEOUT = 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/rooms', (req, res) => {
	res.send(getSanitizedRooms());
});

app.post('/rooms', (req, res) => {
	const id = uuidv4();
	const room = new Room(req.body.name, id, req.body.options ?? {});
	addRoom(room);
	res.status(201)
		.set('Content-Type', 'text/plain')
		.send(id);
});

export function socketHandler(socket: Socket) {
	const timeoutID = setTimeout(() => {
		socket.disconnect();
	}, SOCKET_TIMEOUT);

	socket.on('join', (id, username, cb) => {
		clearTimeout(timeoutID);

		const room = getRoom(id);
		if (room === undefined) {
			cb({ err: JoinError.NOTFOUND });
			return;
		}

		const player = new Player(username, socket);

		try {
			room.registerPlayer(player);
		} catch (err) {
			cb({ err });
			return;
		}
	});
}

export default app;
