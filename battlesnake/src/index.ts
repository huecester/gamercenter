import 'dotenv/config';
import { createServer } from 'http';
import app from './app';
import io from './io';

const PORT = process.env.PORT ?? 3000;

const server = createServer(app);
io.attach(server);

server.listen(PORT, () => {
	console.log(`App listening on localhost:${PORT}.`);
});
