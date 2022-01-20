import express from 'express';
import { addRoom, createRoom, getRooms } from './rooms.js';

const port = process.env.PORT || 3030;
const app = express();


// Body parser
app.use(express.json());


// Room creation
app.get('/rooms', (req, res) => {
	res.json(getRooms().map(room => room.sanitized()));
});

app.post('/rooms', (req, res) => {
	console.log(req.body)

	if (!req?.body?.roomname) {
		return res.sendStatus(400);
	}

	const roomname = req.body.roomname.slice(0, 32);
	const password = req.body.password?.slice(0, 32);

	const room = createRoom(roomname, password);
	addRoom(room);

	res.sendStatus(201);
});


// Listen
app.listen(port, () => {
	console.log(`App listening on port ${port}.`);
});

export default app;
