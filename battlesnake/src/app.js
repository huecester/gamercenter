import express from 'express';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import logger from './util/log.js';


const app = express();
const server = http.createServer(app);
const io = new Server(server, { serveClient: false });


// Body parser
app.use(express.json());


// Express setup
for (const filename of [
	'rooms.js',
]) {
	const filepath = './' + path.join('routes', filename);
	const module = await import(filepath);
	app.use(module.router);
}


io.on('connection', socket => {
	console.log('User connected');
});

// Fallbacks
app.all('*', (req, res, next) => {
	if (!res.headersSent) {
		res.sendStatus(404);
	}
	next();
});

// Logging
app.use(logger);

export default server;
