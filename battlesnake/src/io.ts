import { Server } from 'socket.io';

// Define events
import { JoinData, JoinResult } from './types/data';
import { SanitizedPlayers } from './types/player';
import { BoardState, SanitizedGamePlayers, Direction } from './types/game';

export interface ClientToServerEvents {
	// Room
	join: (data: JoinData, cb: (res: JoinResult) => void) => void,
	msg: (msg: string) => void,

	// Game
	direction: (direction: Direction) => void,
}

export interface ServerToClientEvents {
	// Room
	join: (username: string, players: SanitizedPlayers) => void,
	leave: (username: string, players: SanitizedPlayers) => void,
	msg: (author: string, msg: string) => void,

	// Game
	countdown: (seconds: number) => void,
	start: () => void,
	wall: (player: string) => void,
	killed: (player: string, killer: string) => void,
	board: (state: BoardState) => void,
	players: (players: SanitizedGamePlayers) => void,
	winner: (winner: string | null) => void,
}

const io = new Server<ClientToServerEvents, ServerToClientEvents>();

// Setup handlers
import { onConnection as roomOnConnection } from './routes/rooms';
io.on('connection', socket => roomOnConnection(socket));

export default io;
