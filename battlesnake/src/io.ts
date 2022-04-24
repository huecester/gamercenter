import { Server } from 'socket.io';

// Define events
import { JoinData, JoinResult } from './types/data';
import { SanitizedPlayers } from './types/player';

export interface ClientToServerEvents {
	// Room
	join: (data: JoinData, cb: (res: JoinResult) => void) => void,
	msg: (msg: string) => void,

	// Game
}

export interface ServerToClientEvents {
	// Room
	join: (username: string, players: SanitizedPlayers) => void,
	leave: (username: string, players: SanitizedPlayers) => void,
	msg: (author: string, msg: string) => void,

	// Game
	countdown: (seconds: number) => void,
	start: () => void,
}

const io = new Server<ClientToServerEvents, ServerToClientEvents>();

// Setup handlers
import { onConnection as roomOnConnection } from './routes/rooms';
io.on('connection', socket => roomOnConnection(socket));

export default io;
