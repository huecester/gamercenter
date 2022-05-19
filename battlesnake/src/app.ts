import express from 'express';

import { Room } from './types/room';
import { addRoom, getSanitizedRooms } from './store/rooms';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/rooms', (req, res) => {
	res.send(getSanitizedRooms());
});

app.post('/rooms', (req, res) => {
	const room = new Room(req.body.name);
	addRoom(room);
	res.sendStatus(201);
});

export default app;
