import { v4 as uuidv4 } from 'uuid';
import { Player } from './player';
import { SanitizedRoom } from './sanitizedRoom';

export class Room {
	readonly name;
	private players: Map<string, Player> = new Map();

	constructor(name: string) {
		this.name = name;
	}

	registerPlayer(player: Player) {
		const id = uuidv4();
		this.players.set(id, player);
		return id;
	}

	sanitized() {
		return new SanitizedRoom(this);
	}

	sanitizedPlayers() {
		return Array.from(this.players.entries()).reduce((players, [id, player]) => {
			players[id] = player.sanitized();
			return players;
		}, {});
	}
}
