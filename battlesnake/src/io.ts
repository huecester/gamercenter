import { Server } from 'socket.io';

// Define events
import { JoinData, JoinResult } from './types/data';
import { SanitizedPlayers } from './types/player';

export interface ClientToServerEvents {
	join: (data: JoinData, cb: (res: JoinResult) => void) => void,
	msg: (msg: string) => void,
}

export interface ServerToClientEvents {
	join: (username: string, players: SanitizedPlayers) => void,
	leave: (username: string, players: SanitizedPlayers) => void,
	msg: (author: string, msg: string) => void,
}

const io = new Server<ClientToServerEvents, ServerToClientEvents>();

// Setup handlers
import { onConnection as roomOnConnection } from './routes/rooms';
io.of('/rooms').on('connection', socket => roomOnConnection(io.of('/rooms'), socket));

export default io;