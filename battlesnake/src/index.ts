import 'dotenv/config';
import { createServer } from 'http';
import app from './app';
import io from './io';

const port = process.env.PORT || 8000;

const server = createServer(app);
io.attach(server, {
	serveClient: false,
});

server.listen(port, () => {
	console.log(`App listening on localhost:${port}.`);
});
