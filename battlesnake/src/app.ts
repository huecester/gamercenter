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
	const id = addRoom(room);
	res.status(201)
		.set('Content-Type', 'text/plain')
		.send(id);
});

export default app;
