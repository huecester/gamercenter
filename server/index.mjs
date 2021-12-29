import express from 'express';
import { createServer as createHttpServer } from 'http';
import { Server as IOServer } from 'socket.io';
import { join } from 'path';
import cors from 'cors';

// variables
const root = './routes'
const modules = [
	'posts',
	'bots',
	'battlesnake',
];
const port = process.env.PORT || 3031

// init
const app = express();
const server = createHttpServer(app);
const io = new IOServer(server, {
	serveClient: false,
	cors: {
		origin: 'http://localhost:3000',
	},
});

// middleware
app.use(cors({
	origin: 'http://localhost:3000',
}));
app.use(express.json());

// routes
for (const name of modules) {
	const path = `./${join(root, name)}.mjs`;
	const module = await import(path);

	if (module.router) {
		app.use(`/api/${name}`, module.router);
		console.log(`Registered ${name} router.`);
	}

	if (module.ioInit) {
		module.ioInit(io.of(`/${name}`));
		console.log(`Registered ${name} IO.`);
	}
}


server.listen(port, () => {
	console.log(`App listening at http://localhost:${port}.`);
});
