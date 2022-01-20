import express from 'express';
import { addRoom, createRoom, getRooms } from './rooms.js';
import logger from './util/log.js';

const port = process.env.PORT || 3030;
const app = express();


// Body parser
app.use(express.json());

// Logging
// app.use(logger);

// Room creation
app.get('/rooms', (req, res, next) => {
	res.json(getRooms().map(room => room.sanitized()));
	next();
});

app.post('/rooms', (req, res, next) => {
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

app.use(logger);

// Listen
app.listen(port, () => {
	console.log(`App listening on port ${port}.`);
});

export default app;
