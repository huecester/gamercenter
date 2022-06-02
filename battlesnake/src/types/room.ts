import { v4 as uuidv4 } from 'uuid';
import io from '../io';
import { JoinError } from './joinData';
import { Player } from './player';
import { SanitizedPlayer } from './sanitizedPlayer';
import { SanitizedRoom } from './sanitizedRoom';

const clampDefault = (val: number | undefined, min: number, max: number, def: number) => Math.max(Math.min(val ?? def, max), min);

export interface BaseRoomConfig {
	maxPlayers?: number;
}

function createConfig(options: BaseRoomConfig): RoomConfig {
	return {
		maxPlayers: clampDefault(options?.maxPlayers, 2, 8, 4),
	};
}


export interface RoomConfig {
	maxPlayers: number;
}

export class Room {
	readonly name;
	readonly id;
	readonly config;
	private players: Map<string, Player> = new Map();

	constructor(name: string, id: string, options: BaseRoomConfig) {
		this.name = name;
		this.id = id;
		this.config = createConfig(options);
	}

	registerPlayer(player: Player) {
		if (Object.keys(this.players).length >= this.config.maxPlayers) {
			throw JoinError.ROOMFULL;
		}

		this.setupPlayerSocket(player);

		const id = uuidv4();
		this.players.set(id, player);
		return id;
	}

	setupPlayerSocket({ socket }: Player) {
		socket.join(this.id);

		socket.on('msg', msg => {
			io.of('./rooms').to(this.id).emit('msg', player.username, msg);
		});
	}

	sanitized() {
		return new SanitizedRoom(this);
	}

	sanitizedPlayers() {
		return Array.from(this.players.entries()).reduce((players: {[id: string]: SanitizedPlayer}, [id, player]) => {
			players[id] = player.sanitized();
			return players;
		}, {});
	}
}
