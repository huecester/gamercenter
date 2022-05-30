import { Server } from 'socket.io';
import { JoinData } from './types/joinData';
import { socketHandler as roomSocketHandler } from './app';

interface ServerToClientEvents {
	msg: (author: string, msg: string) => void;
}

interface ClientToServerEvents {
	join: (id: string, username: string, cb: (joinData: JoinData) => void) => void;
	msg: (msg: string) => void;
}

const io = new Server<ClientToServerEvents, ServerToClientEvents>({ serveClient: false });

io.of('/rooms').on('connection', roomSocketHandler);

export default io;
