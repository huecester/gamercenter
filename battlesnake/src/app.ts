import express from 'express';

import { getSanitizedRooms } from './store/rooms';

const app = express();

app.get('/', (req, res) => {
	res.send(getSanitizedRooms());
});

export default app;
