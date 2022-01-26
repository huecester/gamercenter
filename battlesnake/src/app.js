import express from 'express';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';

import expressLogger from './util/expressLog.js';
import socketIOLogger from './util/socketIOLog.js';
import getJS from './util/getJS.js';


const app = express();
const server = http.createServer(app);
const io = new Server(server, { serveClient: false });


// Express setup
// Body parser
app.use(express.json());

// Load routes
for (const filepath of getJS('./src/routes')) {
	const relFilepath = `./${path.relative('src', filepath)}`;
	const route = path.join('/', path.parse(relFilepath).name);
	const module = await import(relFilepath);

	// 405 Method Not Allowed
	module.router.all('/', (req, res, next) => {
		if (!res.headersSent) {
			res.sendStatus(405);
		}
		next();
	});

	app.use(route, module.router);
}

// Fallbacks
app.all('*', (req, res, next) => {
	if (!res.headersSent) {
		res.sendStatus(404);
	}
	next();
});

// Logging
app.use(expressLogger);


// Socket.IO setup
// Logging
io.on('connection', socket => {
	socketIOLogger(socket, ['connection'], () => {});
	socket.use((data, next) => socketIOLogger(socket, data, next));
});

// Load namespace handlers
for (const filepath of getJS('./src/namespaces')) {
	const relFilepath = `./${path.relative('src', filepath)}`;
	const namespace = path.join('/', path.parse(relFilepath).name);
	const module = await import(relFilepath);

	module.init?.(io.of(namespace));
	module.onConnection && io.of(namespace).on('connection', module.onConnection);
}


export default server;
