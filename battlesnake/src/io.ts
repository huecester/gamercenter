import { Server } from 'socket.io';

interface ServerToClientEvents {
	test: () => void;
}

interface ClientToServerEvents {
}

const io = new Server<ServerToClientEvents, ClientToServerEvents>({ serveClient: false });

io.on('connection', socket => {
	console.log('connected');
	socket.on('disconnect', () => {
		console.log('disconnected');
	});
});

export default io;
